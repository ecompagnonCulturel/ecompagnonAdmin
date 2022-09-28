import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SessionService} from '../../session/session.service';
import {ResponseService} from '../../response/response.service';
import {QuestionnaireService} from '../questionnaire.service';
import {ActivityService} from '../../activity/activity.service';
import {UtileService} from '../../utile/utile.service';
import {MatDialog} from '@angular/material/dialog';
import {AddQuestionnaireComponent} from '../add-questionnaire/add-questionnaire.component';
import Swal from 'sweetalert2';
import {fromEvent, of} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import { DatePipe } from '@angular/common';
import * as moment from "moment";

@Component({
  selector: 'app-list-questionnaire',
  templateUrl: './list-questionnaire.component.html',
  styleUrls: ['./list-questionnaire.component.css']
})
export class ListQuestionnaireComponent implements OnInit,AfterViewInit {

  questionnaire: any;
  _filtre: any;
  public dataSource = new MatTableDataSource<any>();
  currentAcitite: any;
  displayedColumns: string[] = ['session.sessNom', 'type', 'groupEtudiant', 'startDate', 'endDate', 'edit', 'delete'];
  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 30];
  showFirstLastButtons = true;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  questionnaireUse: any = [];
  questionnaireRepUse: any = [];
  originalData: any[]
  groupeAhead: any;
  sessionAheadQ: any;
  typeAheadR: any;
  sDateAhead: any;
  eDateAhead: any;

  constructor(private sessionService: SessionService,
              private questionnaireService: QuestionnaireService,
              private utileService: UtileService,
              private dialog: MatDialog,
              private responseService: ResponseService,
              private activiteService: ActivityService,
              private datePipe:DatePipe) {
  }


  ngOnInit(): void {
    this.getAllQuest();
    this.getAllQuestionnaireResponse();


  }

 ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;

   let typeSearchBoxR = document.querySelector<HTMLInputElement>('#typeSearchBoxR');
   let sessionSearchBoxQ = document.querySelector<HTMLInputElement>('#sessionSearchBoxQ');
   let groupeSearchBox = document.querySelector<HTMLInputElement>('#groupeSearchBox');
   let sDateSearchBox = document.querySelector<HTMLInputElement>('#sDateSearchBox');
   let eDateSearchBox = document.querySelector<HTMLInputElement>('#eDateSearchBox');


   this.sessionAheadQ = fromEvent(sessionSearchBoxQ, 'input').pipe(
     map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
     filter(text => text.length > 1), // plus de deux caractères
     debounceTime(10), // prevenir ecriture effacement rapide
     distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
     switchMap(() => {
       return of(this.originalData.filter(r => sessionSearchBoxQ.value.length <= 2
         || this.utileService.removeDiacritics(r.session.sessNom.toLowerCase())
           .includes(this.utileService.removeDiacritics(sessionSearchBoxQ.value.toLocaleLowerCase()))));
     }));

   this.typeAheadR = fromEvent(typeSearchBoxR, 'input').pipe(
     map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
     filter(text => text.length >0), // plus de deux caractères
     debounceTime(10), // prevenir ecriture effacement rapide
     distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
     switchMap(() => {
       //console.log(typeSearchBoxR.value.length);
       return of(this.originalData.filter(r => typeSearchBoxR.value.length <= 1
         || r.type.toUpperCase().includes(typeSearchBoxR.value.toLocaleUpperCase())));
     }));

   this.groupeAhead = fromEvent(groupeSearchBox, 'input').pipe(
     map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
     filter(text => text.length > 1), // plus de deux caractères
     debounceTime(10), // prevenir ecriture effacement rapide
     distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
     switchMap(() => {
       return of(this.originalData.filter(r => groupeSearchBox.value.length <= 2
         || r.groupEtudiant.groupName.toUpperCase().includes(groupeSearchBox.value.toLocaleUpperCase())));
     }));

   this.sDateAhead = fromEvent(sDateSearchBox, 'input').pipe(
     map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
     filter(text => text.length > 1), // plus de deux caractères
     debounceTime(10), // prevenir ecriture effacement rapide
     distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
     switchMap(() => {
       //  console.log()
       //console.log(sDateSearchBox.value.length)
       return of(this.originalData.filter(r => (sDateSearchBox.value.length>=2
         &&(moment(this.datePipe.transform(r.startDate, 'yyyy-MM-dd')).isSameOrAfter(moment(sDateSearchBox.value))))));
     }));

   this.eDateAhead = fromEvent(eDateSearchBox, 'input').pipe(
     map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // transfome en observable de chaine de char
     filter(text => text.length > 1), // plus de deux caractères
     debounceTime(10), // prevenir ecriture effacement rapide
     distinctUntilChanged(), // prevenir écriture effacement du même caraßctère
     switchMap(() => {
       //  console.log()
       //console.log(sDateSearchBox.value.length)
       return of(this.originalData.filter(r => (eDateSearchBox.value.length>=2
         &&(moment(this.datePipe.transform(r.endDate, 'yyyy-MM-dd')).isSameOrBefore(moment(eDateSearchBox.value))))));
     }));

   this.sessionAheadQ.subscribe(data => {
     this.dataSource.data = data
   });

   this.typeAheadR.subscribe(data => {
     this.dataSource.data = data
   });

   this.groupeAhead.subscribe(data => {
     this.dataSource.data = data
   });

   this.sDateAhead.subscribe(data => {
     this.dataSource.data = data
   });

   this.eDateAhead.subscribe(data => {
     this.dataSource.data = data
   });


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
        let sDateSearchBox = document.querySelector<HTMLInputElement>('#sDateSearchBox');
        if (QuestAll.length > 0) {
          //console.log(QuestAll)
          this.questionnaire = QuestAll;
          this.dataSource.data = QuestAll;
          this.originalData = QuestAll;
          this.initResearch();

        }
      },
      err => {
        console.log(err);
      }
    );

  }

  change(event: any)
  {
    if(event.target.value.length<=0)
    {
      this.getAllQuest()
    }

  }
  getComplementByQuestionnaire(questionnaire: any) {
    // this.sessionService.getAllSession();
    this.activiteService.getComplementByQuestionnaire(questionnaire).subscribe(complement => {

        if (complement.length > 0) {
          this.currentAcitite = complement;

        }
      },
      err => {
        console.log(err);
      }
    );

  }

  getAllQuestionnaireResponse() {
    // this.sessionService.getAllSession();
    this.responseService.getAllQuestionnaireResponse().subscribe(repQuestAll => {
        //
        if (repQuestAll.length > 0) {
          //  console.log(repQuestAll);
          this.questionnaireRepUse = repQuestAll;

        }
      },
      err => {
        console.log(err);
      }
    );

  }


  getAllQuestQuestionnaire() {
    // this.sessionService.getAllSession();
    this.questionnaireService.getAllQuestQuestionnaire().subscribe(QuestQAll => {
        // console.log(QuestQAll);
        if (QuestQAll.length > 0) {
          QuestQAll.forEach(value => {
            // this.questionnaireUse.push(value.questionnaire);
          });
          /* this.questionnaireUse = this.utileService.delDuplicateSession(this.questionnaireUse, [{
             id: '', activite: '', groupEtudiant: '',
             startDate: '', endDate: '', session: '',
             status: '', type: ''
           }]);*/

        }
      },
      err => {
        console.log(err);
      }
    );

  }


  editDialog(questionnaire) {
    // tslint:disable-next-line:prefer-const
    let dialogRef12: any;
    let dialogRef: any;

    if (questionnaire.type === 'T12') {
      this.activiteService.getComplementByQuestionnaire(questionnaire.id).subscribe(complement => {
//console.log(complement );
          if (complement != null) {
            questionnaire.activite = complement.activite;
            //   console.log(questionnaire);

            dialogRef12 = this.dialog.open(AddQuestionnaireComponent, {
              width: '70%',
              data: {questionnaire, titre: 'Modifier ou Dupliquer un questionnaire'}
            });
            dialogRef12.afterClosed().subscribe(result => {
              this.ngOnInit();
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    } else {
      dialogRef = this.dialog.open(AddQuestionnaireComponent, {
        width: '70%',
        data: {questionnaire, titre: 'Modifier ou Dupliquer un questionnaire'}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
  }

  objectExist(item: any, object: any) {
    //console.log(item)
    // console.log(object)
    return this.utileService.objectExist(item, object);
  }

  async deleteQuestionnaire(questionnaire: any, session: any) {

    await Swal.fire({
      // title: 'Are you sure?',
      text: 'Voulez- vous supprimer ce questionnaire',
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

        this.questionnaireService.deleteQuestionnaire(questionnaire, session)
          .subscribe(
            // Admire results
            (data) => {
              this.utileService.successAlert('Supprimer un questionnaire', 'Surpression effectuée avec sussès')
              this.getAllQuest();
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

  initResearch()
  {
    document.querySelector<HTMLInputElement>('#typeSearchBoxR').value='';
    document.querySelector<HTMLInputElement>('#sessionSearchBoxQ').value='';
    document.querySelector<HTMLInputElement>('#groupeSearchBox').value='';
    document.querySelector<HTMLInputElement>('#sDateSearchBox').value='';
    document.querySelector<HTMLInputElement>('#eDateSearchBox').value='';
  }

}
