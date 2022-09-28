import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SessionService} from '../session.service';
import {UtileService} from '../../utile/utile.service';
import {QuestionnaireService} from '../../questionnaire/questionnaire.service';
import {ResourceService} from '../../resource/resource.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {AddSessionComponent} from '../add-session/add-session.component';
import {MatDialog} from '@angular/material/dialog';
import {fromEvent, Observable, of, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-list-session',
  templateUrl: './list-session.component.html',
  styleUrls: ['./list-session.component.css']
})
export class ListSessionComponent implements OnInit, AfterViewInit {
  session: any;
   originalData: any[]
  public dataSource = new MatTableDataSource<any[]>();
  displayedColumns: string[] = ['sessNom', 'sessYear', 'sessStart', 'sessEnd', 'sessStatus', 'edit', 'delete'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  sessionUse: any = [];
  sessionCours: any = [];
  sessionsFiltrer : any ;
  typeahead : any ;
  nameAhead : any ;
  yearAhead : any ;


  constructor(private sessionService: SessionService,
              private questionnaireService: QuestionnaireService,
              private utileService: UtileService,
              private resourceService: ResourceService,
              private dialog: MatDialog) {



  }

  ngOnInit(): void {

    this.getAllSession();
    this.getAllQuest();
    this.getAllCourseResourse();


  }


  ngOnChanges() {
    this.getAllSession();
    this.getAllQuest();
    this.getAllCourseResourse();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    let nameSearchBox = document.querySelector<HTMLInputElement>('#nameSearchBox');
    let yearSearchBox = document.querySelector<HTMLInputElement>('#yearSearchBox');
   this.nameAhead = fromEvent(nameSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 1), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
      switchMap(() => {
        return of(this.originalData.filter(r =>  nameSearchBox.value.length <=2
                                    || r.sessNom.toLowerCase().includes(nameSearchBox.value.toLocaleLowerCase())));
       }));

    this.yearAhead = fromEvent(yearSearchBox,'input').pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
      filter(text => text.length > 2), // plus de deux caractères
      debounceTime(10), // prevenir ecriture effacement rapide
      distinctUntilChanged(), // prevenir écriture effacement du même caractère
      switchMap(() => {
        return of(this.originalData.filter(r =>  yearSearchBox.value.length <=3
          || r.sessNom.toLowerCase().includes(yearSearchBox.value.toLocaleLowerCase())));
      }));

    this.nameAhead.subscribe(data =>{
      this.dataSource.data = data
    });

    this.yearAhead.subscribe(data =>{
      this.dataSource.data = data
    });


  }


  getAllSession() {
    // this.sessionService.getAllSession();
    this.sessionService.getAllSession().subscribe(sessionAll => {
        // console.log(sessionAll)
        this.session = sessionAll;
        this.afficheResult(sessionAll);

      },
      err => {
        console.log(err);
      }
    );
  }

  afficheResult(data : any){
    this.originalData = data;
    this.dataSource.data = data;
  }

  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageIndex = event.pageIndex; // * event.pageSize;
    this.pageSize = event.pageSize; // +this.pageIndex  ;
    return event;
  }


  getAllQuest() {
    // this.sessionService.getAllSession();
    this.questionnaireService.getAllQuest().subscribe(QuestAll => {

        if (QuestAll.length > 0) {
          QuestAll.forEach(value => {
            this.sessionUse.push(value.session);
          });

          this.sessionUse = this.utileService.delDuplicateSession(this.sessionUse, [{
            id: '', sessNom: '', sessStatus: '',
            sessYear: '', sessStart: '', sessMiddle: '',
            sessEnd: ''
          }]);
         // console.log(this.sessionUse);


        }
      },
      err => {
        console.log(err);
      }
    );

  }

  getAllCourseResourse() {
    // this.sessionService.getAllSession();
    this.resourceService.getAllCourseResourse().subscribe(coursResAll => {
      //  console.log(coursResAll);
        if (coursResAll.length > 0) {
          coursResAll.forEach(value => {
            this.sessionUse.push(value.coursResSession);
          });

          this.sessionUse = this.utileService.delDuplicateSession(this.sessionUse, [{
            id: '', sessNom: '', sessStatus: '',
            sessYear: '', sessStart: '', sessMiddle: '',
            sessEnd: ''
          }]);

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

  async deleteSession(id) {

    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer cette session',
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

        this.sessionService.deleteSession(id)
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

  async activeSession(session: any, action: any) {
    const sessionSend = {
      id: session.id, sessNom: session.sessNom,
      sessStatus: session.sessStatus, sessYear: session.sessYear,
      sessStart: session.sessStart, sessMiddle: session.sessMiddle,
      sessEnd: session.sessEnd
    };
    let message;
    //  console.log(this.utileService.ObjectExistByField(this.session,"sessStatus",1));

    if (action == 1) {
      sessionSend.sessStatus = 1;
      message = 'Session bien activée';
      if (this.utileService.objectExistByStstus(this.session, 1) == true) {
        this.utileService.successAlert('Activer/Désactiver session', 'Une session est déjà activée');

      } else {
        this.sendSession(sessionSend, message);
      }
    } else {
      sessionSend.sessStatus = 0;
      message = 'Session bien désactivée';
      this.sendSession(sessionSend, message);
    }


  }

  async sendSession(sessionSend: any, message: any) {
    await this.sessionService.addSession(sessionSend)
      .subscribe(
        // Admire results
        data => {
          this.utileService.successAlert('Activer/Désactiver session', message);
          this.session = [];
          this.getAllSession();
        },

        error => {
          console.log(error);
          this.utileService.successAlert('Activer/Désactiver session', 'l\'opération n\'a pas pu aboutir');

        }
      );
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddSessionComponent, {
      width: '50%',
      data: {titre: 'Ajouter une session'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editDialog(session) {
    const dialogRef = this.dialog.open(AddSessionComponent, {
      width: '50%',
      data: {session, titre: 'Modifier une session'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }


}
