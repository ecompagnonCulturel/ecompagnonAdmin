import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {EtudiantGroupService} from '../../etudiantGroup/etudiant-group.service';
import {ResponseService} from '../../response/response.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {UtileService} from '../../utile/utile.service';
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {error} from "protractor";
import Swal from "sweetalert2";


@Component({
  selector: 'app-student-list-added',
  templateUrl: './student-list-added.component.html',
  styleUrls: ['./student-list-added.component.css']
})
export class StudentListAddedComponent implements OnInit,AfterViewInit   {
  studentAdded: any;
  public dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Prenom', 'Nom', 'CP',  'Courriel', 'delete'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  originalData: any[]
  nomAhead : any ;
  prenomAhead : any ;
  cpAhead : any ;
  responseStudentQuest: any;
  etudiantFillQuestInThisGroup: any;
  constructor( @Inject(MAT_DIALOG_DATA) public dataGet,
               private etudiantGroupService: EtudiantGroupService,
               private responseService: ResponseService,
               private utileService: UtileService,) { }

  ngOnInit(): void {
    this.getAllEtudiantByGroup();
    this.getEtudiantFromReponseByGroupAndSession();
  }

  getAllEtudiantByGroup()
  {
    this.etudiantGroupService.getAllEtudiantByGroup( this.dataGet.group.id)
      .subscribe(response => {
       // console.log(response);
        this.dataSource.data = response;
        this.originalData = response;
      this.studentAdded=response;
      }, error => {
        console.log(error);
      })

  }

  getEtudiantFromReponseByGroupAndSession()
  {
   // console.log(this.dataGet.group);
    this.responseService.getEtudiantFromReponseByGroupAndSession( this.dataGet.group.id,this.dataGet.group.groupSession.id)
      .subscribe(resp => {
         console.log(resp);
    this.etudiantFillQuestInThisGroup=resp;
      }, error => {
        console.log(error);
      })

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
          ||this.utileService.removeDiacritics(r.etudFirstName.toLowerCase())
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
  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }

  async delStudentFromGroup(group : any, idStudent : any, session: any){
    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer cet étudiant de ce groupe?',
      // icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'OK',
      reverseButtons: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      confirmButtonColor: '#3DC2FF',
      cancelButtonColor: '#d33',
    }).then((result) => {

      if (result.isConfirmed) {
                //console.log(group);
                //console.log(idStudent);
                //console.log(session);
                this.etudiantGroupService.delEtudiantFromGroup(group,idStudent,session)
                  .subscribe(response =>{
                      //  console.log(response);
                      this.utileService.successAlert('Supprimer un étudiant d\'un groupe', 'Surpression effectuée avec sussès')
                      this.getAllEtudiantByGroup();
                    },
                    error=>{})


      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    });


  }

  objectExist(item: any, object: any) {
    //console.log(item)
    // console.log(object)
    return this.utileService.objectExist(item, object);
  }
}
