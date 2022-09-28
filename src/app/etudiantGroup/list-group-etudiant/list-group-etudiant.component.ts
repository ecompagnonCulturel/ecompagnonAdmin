import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {EtudiantGroupService} from '../../etudiantGroup/etudiant-group.service';
import {UtileService} from '../../utile/utile.service';
import {SessionService} from '../../session/session.service';
import {QuestionnaireService} from '../../questionnaire/questionnaire.service';
import {AddEtudiantGroupComponent} from '../add-group-etudiant/add-etudiant-group.component';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {EtudiantCheckListForAddComponent} from '../etudiant-check-list-for-add/etudiant-check-list-for-add.component';
import {ChargerEtudiantExcelComponent} from '../charger-etudiant-excel/charger-etudiant-excel.component';
import {StudentListAddedComponent} from '../student-list-added/student-list-added.component';
import {Groupe} from "../../models/groupe";
import {FormControl, FormGroup} from "@angular/forms";
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";


@Component({
  selector: 'app-list-etudiant-group',
  templateUrl: './list-group-etudiant.component.html',
  styleUrls: ['./list-group-etudiant.component.css']
})
export class ListGroupEtudiantComponent implements OnInit, AfterViewInit  {
  groupeEtud: any;
  session:any;
  public dataSource = new MatTableDataSource<Groupe>();
  displayedColumns: string[] = ['Nom', 'Session', 'edit',  'addStudent', 'addStudentExcel', 'studentList', 'delete'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  groupeEtudUse: any = [];
  filterSelectObj = [];
  nameAhead : any ;
  sessionAheadG : any ;
  originalData: any[]
  constructor(private etudiantGroupService: EtudiantGroupService,
              private dialog: MatDialog,
              private utileService: UtileService,
              private sessionService: SessionService,
              private questionnaireService: QuestionnaireService
             ) {

  }



  ngOnInit(): void {
    this.getGroupEtudiant();
    this.getAllGroupeEtudiant();
    // Overrride default filter behaviour of Material Datatable
    //this.dataSource.filterPredicate = this.createFilter();

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    let nameSearchBox = document.querySelector<HTMLInputElement>('#nameSearchBox');
    let sessionSearchBoxG = document.querySelector<HTMLInputElement>('#sessionSearchBoxG');


    this.nameAhead = fromEvent(nameSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nameSearchBox.value.length <=2
          || this.utileService.removeDiacritics(r.groupName.toLowerCase())
            .includes(this.utileService.removeDiacritics(nameSearchBox.value.toLocaleLowerCase()))));
      }));

    this.sessionAheadG = fromEvent(sessionSearchBoxG,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        //console.log(this.originalData);
        return of(this.originalData.filter(r =>  sessionSearchBoxG.value.length <=2
          || this.utileService.removeDiacritics(r.groupSession.sessNom.toLowerCase())
            .includes(this.utileService.removeDiacritics(sessionSearchBoxG.value.toLocaleLowerCase()))));
      }));

    this.nameAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.sessionAheadG.subscribe(data =>{
      this.dataSource.data = data
    });
  }
  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }



  getGroupEtudiant() {
    // this.sessionService.getAllSession();
    this.etudiantGroupService.getGroupEtudiant().subscribe(group => {

        if (group.length > 0) {
          this.groupeEtud = group;
          //group.forEach(item=>{this.groupe.set(item.id,item)})
          this.dataSource.data = group;
          this.originalData = group;
         /* this.filterSelectObj.filter((o) => {
            //console.log(this.getFilterObject(group, o.columnProp, o.type))
            o.options = this.getFilterObject(group, o.columnProp, o.type);
          });*/

        }
      },
      err => {
        console.log(err);
      }
    );

  }

  objectExist(item: any, object: any) {
    return this.utileService.objectExist(item, object);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEtudiantGroupComponent, {
      width: '35%',
      data: {titre: 'Ajouter un groupe d\'étudiant'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  getAllGroupeEtudiant(){
    this.etudiantGroupService.getAllGroupeEtudiant().subscribe(groupUse => {

        if (groupUse.length > 0) {
          //console.log(groupUse);

            this.groupeEtudUse= groupUse;
        }
        else
        {
          this.questionnaireService.getQuestionnaireGroupEtudiant().subscribe(groupUse => {
              console.log(groupUse);
              if (groupUse.length > 0) {

                this.groupeEtudUse= groupUse;
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
        console.log(err);
      }
    );



  }

  async deleteGroup(id) {

    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer ce groupe',
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

        this.etudiantGroupService.delGroupEtudiant(id)
          .subscribe(
            // Admire results
            (data) => {
              this.ngOnInit();
            },

            error => {
              console.log(error);
            },

            // () => { console.log("completed") }

          );

      } else if (result.isDismissed) {

        console.log('Clicked No, File is safe!');

      }
    });

  }
  editDialog(group) {
    const dialogRef = this.dialog.open(AddEtudiantGroupComponent, {
      width: '35%',
      data: {group, titre: 'Modifier un groupe'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  addStudent(group:any) {
    const dialogRef = this.dialog.open(EtudiantCheckListForAddComponent, {
      width: '100%',
      data: {group, titre: 'Ajout manuel des etudiants au groupe ' + group.groupName + ' de la session ' + group.groupSession.sessNom}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  listStudentAdded(group:any) {
    const dialogRef = this.dialog.open(StudentListAddedComponent, {
      width: '100%',
      data: {group, titre: 'Liste des étudiant(es) du groupe ' + group.groupName + ' de la session ' + group.groupSession.sessNom}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  uploadStudent(group:any) {
    const dialogRef = this.dialog.open(ChargerEtudiantExcelComponent, {
      width: '50%',
      data: {group, titre: 'Chargement par fichier Excel des Etudiants du groupe ' + group.groupName + ' de la session ' + group.groupSession.sessNom}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
/*  get groupName() { return this.filterForm.get('groupName'); }
  get groupSession() { return this.filterForm.get('groupSession'); }*/


  isArray = function(a) {
    return (!!a) && (a.constructor === Array);
  };
  isObject = function(a) {
    return (!!a) && (a.constructor === Object);
  };



}
