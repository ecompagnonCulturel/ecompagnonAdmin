import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EtudiantGroupService} from '../etudiant-group.service';
import {UtileService} from '../../utile/utile.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-etudiant',
  templateUrl: './etudiant-check-list-for-add.component.html',
  styleUrls: ['./etudiant-check-list-for-add.component.css']
})
export class EtudiantCheckListForAddComponent implements OnInit,AfterViewInit {
  etudiant: any;
  etudiantform: FormGroup;
  etudiantByGroup:any;
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['etudFirstName', 'etudLastName', 'etudCP', 'check'];
  length = 500;
  pageSize = 50;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  nomAhead : any ;
  prenomAhead : any ;
  cpAhead : any ;


  constructor(private etudiantGroupService: EtudiantGroupService,
              private formBuilder: FormBuilder,
              private utileService: UtileService,
              @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {

    this.etudiantform = this.formBuilder.group({
      check: new FormArray([],this.minSelectedCheckboxes(1))
    });

    this.getAllEtudiantNotInGroup();


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //Filter

    let nomSearchBox = document.querySelector<HTMLInputElement>('#nomSearchBox');
    let prenomSearchBox = document.querySelector<HTMLInputElement>('#prenomSearchBox');
    let cpSearchBox = document.querySelector<HTMLInputElement>('#cpSearchBox');


    this.nomAhead = fromEvent(nomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nomSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r.etudLastName.toLowerCase())
            .includes(this.utileService.removeDiacritics(nomSearchBox.value.toLocaleLowerCase()))));
      }));

    this.prenomAhead = fromEvent(prenomSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  prenomSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r.etudFirstName.toLowerCase())
            .includes(this.utileService.removeDiacritics(prenomSearchBox.value.toLocaleLowerCase()))));
      }));

    this.cpAhead = fromEvent(cpSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        //console.log(cpSearchBox.value)
        return of(this.originalData.filter(r =>  cpSearchBox.value.length <=2
          || r.etudCP.includes(cpSearchBox.value.toLocaleUpperCase())));
      }));


    this.nomAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.prenomAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.cpAhead.subscribe(data =>{
      // console.log(data)
      this.dataSource.data = data
    });


  }

  get checkFormArray() {
    return this.etudiantform.controls.check as FormArray;
  }



  submit() {
    //get selected checkbox
    const selectedStudentsIds = this.etudiantform.value.check
      .map((checked, i) => checked ? this.etudiant[i].id: null)
      .filter(v => v !== null);
    //console.log(selectedStudentsIds);

    this.etudiantGroupService.saveSomeStudentInGroup(this.data.group.id,selectedStudentsIds)
      .subscribe(send => {

        if(send.idEtud.length>0)
        {
          this.utileService.successAlert('Ajouter des étudiants à un groupe',
                                'Ajout de '+send.idEtud.length+' étudiant(s) au groupe '+this.data.group.groupName+'  avec succès')
        }
         this.etudiantform.reset() ;
        this.getAllEtudiantNotInGroup();

      },
      err => {
        console.log(err);
      }
    )
  }


  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }

  getAllStudent() {
    // this.sessionService.getAllSession();
    this.etudiantGroupService.getAllStudent().subscribe(etudiant => {

        if (etudiant.length > 0) {
          this.etudiant = etudiant;
         // this.dataSource.data = etudiant;
        //  this.getAllEtudiantByGroup(etudiant, this.data.group.id);
          this.dataSource.data = etudiant;
        //  console.log(this.checkFormArray);

        }
      },
      err => {
        console.log(err);
      }
    );

  }

  getAllEtudiantNotInGroup() {
    // this.sessionService.getAllSession();
    this.etudiantGroupService.getAllEtudiantNotInGroup( this.data.group.id).subscribe(etudiant => {
        if (etudiant.length > 0) {
         // console.log(etudiant)
          this.etudiant = etudiant;
          this.dataSource.data = etudiant;
          this.originalData =etudiant;
          this.addCheckboxes(etudiant);
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  private addCheckboxes(etudiant: any) {
   etudiant.forEach(() => this.checkFormArray.push(new FormControl(false)));
  }
//Minimum select 1 checkbox
 minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        // get a list of checkbox values (boolean)
        .map(control => control.value)
        // total up the number of checked checkboxes
        .reduce((prev, next) => next ? prev + next : prev, 0);

      // if the total is not greater than the minimum, return the error message
      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }

}
