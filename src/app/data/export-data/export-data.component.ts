import { Component, OnInit } from '@angular/core';
import {DataService} from '../data.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../session/session.service';
import {UtileService} from '../../utile/utile.service';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.css']
})
export class ExportDataComponent implements OnInit {
  reponses: any;
  reponsesFormat: [];
  etudiants: any;
  questions: any;
  questionnaires: any;
  sessions: any;
  type: any;
  type4Name: any;
  sessionText: any;
  exportDataForm: FormGroup;
  reponseName: any='reponse';
  activite: any ;
  tailleQuestionnaireInitT0: any= `${environment.tailleQuestionnaireInitT0}`;
  tailleQuestionnaireInitT11: any= `${environment.tailleQuestionnaireInitT11}`;
  tailleQuestionnaireInitT12: any= `${environment.tailleQuestionnaireInitT12}`;
  tailleQuestionnaireInitT2: any= `${environment.tailleQuestionnaireInitT2}`;
  tailleQuestionnaireInitT3: any= `${environment.tailleQuestionnaireInitT3}`;
  constructor(private dataService: DataService,
              private sessionService: SessionService,
              private formBuilder: FormBuilder,
              private utileService: UtileService
  ) { }

  ngOnInit(): void {

    this.exportDataForm = this.formBuilder.group({
      session: ['', Validators.required],
      questionnaire: ['', Validators.required],

    });

    this.getAllSession();
  }

  getAllSession() {
    // this.sessionService.getAllSession();
    this.sessionService.getSessionOrderByStartDate().subscribe(sessionAll => {
        // console.log(sessionAll)
        this.sessions = sessionAll;
      },
      err => {
        console.log(err);
      }
    );
  }

  getByQuestionnaire(sel: any) {
    // this.sessionService.getAllSession();
    this.reponses = null;
    this.questions = null;
    this.etudiants = null;
    this.type = null;
    // console.log(sel.source.option.value);
    if (sel.isUserInput) {

      this.dataService.getReponseByQuestionnaireAndSession(sel.source.value, this.exportDataForm.get('session').value)
      //this.dataService.getByQuestionnaire(sel.source.value)
      .subscribe(reponse => {
          this.type = sel.source._mostRecentViewValue;

          this.type4Name=sel.source._mostRecentViewValue;
          if((this.type != 'T0')||(this.type != 'T2')||(this.type != 'T3'))
          {
            this.type=this.type.substr(0,3);
          }


          if(this.type == 'T12')
          {
            this.dataService.getComplementByQuestionnaire(sel.source.value).subscribe(complements => {
                if (complements) {
                  this.activite = complements.activite.actDesc;
                }
              },
              err => {
                console.log(err);
              }
            );
          }


          // this.sessionText=sel.sessions
          if (reponse.length > 0) {
            this.reponses = reponse;
            let  etuds: any = [];
            let  quests: any = [];
            const  rep: any = [];
            for (const reponse of this.reponses) {

              etuds.push(reponse.cp);
              quests.push(reponse.question);

            }
            this.etudiants = etuds;

            // etud = etud.filter((el, i, a) => i === a.indexOf(el));
            etuds = Array.from(etuds.reduce((m, t) => m.set(t.idUsers, t), new Map()).values());
            quests = Array.from(quests.reduce((m, t) => m.set(t.id, t), new Map()).values());
            this.questions = quests;
            this.questions = quests.sort(function(a, b) {
              return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0;
            });

            const reponsTab: any = [];
            let i: any = 0 ;
            for (const etud of etuds) {
              let repformat: any = {};
              const reponseObject: any = {} ;
              for (const reponse of this.reponses) {
                i = i + 1;
                if (etud.idUsers == reponse.cp.idUsers)
                {

                  const objetName = this.reponseName + reponse.question.id ;
                  reponseObject[objetName] = reponse;
                  repformat = {...etud,  reponseObject};


                }

              }
              // console.log(repformat);
              reponsTab.push(repformat);
            }

            this.reponses = reponsTab;


          }

        },
        err => {
          console.log(err);
        }
      );
    }
  }

  getQuestionnaireBySession(sel: any) {
    // this.sessionService.getAllSession();
    if (sel.isUserInput) {

      this.questionnaires = null;
      this.dataService.getQuestionnaireBySession(sel.source.value).subscribe(questionnaire => {
          // console.log(questionnaire);
          if (questionnaire.length > 0) {
            // console.log(questionnaire);
            this.questionnaires = questionnaire;
            this.sessionText = sel.source._mostRecentViewValue;

          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  exportExcel() {

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.type + ' ' + this.sessionText);
    const columns = [];
    columns.push({ header: 'Etudiant', key: 'etudiant' });

    //console.log(this.questions)

    for (const quest of this.questions) {
      // console.log((JSON.parse(quest.questModalite))[0].value);

      if (quest.questType === 'likert5')
      {
        if (this.type === 'T2')
        {
          columns.push({ header: quest.questDesc, key: quest.questId, width: 50.71 });
        }
        else {
          //console.log(quest);
          columns.push({ header: (JSON.parse(quest.questModalite))[0].value, key: quest.questId, width: 50.71 });
        }
      }
      else {
        if (quest.questType === 'slider10CE')
        {
          columns.push({ header: quest.questDesc + ' ' + this.activite, key: quest.questId, width: 50.71 });
        }
        else {
          if (quest.questType === 'slider10CS')
          {
            columns.push({ header: this.activite + ' ' + quest.questDesc, key: quest.questId, width: 50.71 });
          }
          else {
            columns.push({ header: quest.questDesc, key: quest.questId, width: 50.71 });
          }



        }


      }
      if (quest.questFilleDesc != null)
      {
        columns.push({ header: quest.questFilleDesc, key: quest.questId, width: 50.71 });
      }
    }
    worksheet.columns = columns;

    const rows = [];
    for (const reponse of this.reponses) {
      // var repLength = reponse.reponseObject.length();
      console.log(this.reponses)
      if ( this.type == 'T0')
      {

        console.log(reponse.reponseObject.reponse6.reponsText);
        console.log(this.fromLikertNumber(reponse.reponseObject.reponse6.reponsText));


        if( Object.keys(reponse.reponseObject).length > this.tailleQuestionnaireInitT0)//Taille du questionnaire initial
        {

          rows.push([reponse.idUsers, reponse.reponseObject.reponse1.reponsText,
            reponse.reponseObject.reponse2.reponsText,
            reponse.reponseObject.reponse2.reponsFilleText,
            reponse.reponseObject.reponse3.reponsText,
            reponse.reponseObject.reponse4.reponsText,
            reponse.reponseObject.reponse4.reponsFilleText,
            reponse.reponseObject.reponse5.reponsText,
            reponse.reponseObject.reponse5.reponsFilleText,
            this.fromLikertNumber(reponse.reponseObject.reponse6.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse7.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse8.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse9.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse10.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse11.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse12.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse13.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse14.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse15.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse16.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse17.reponsText),
            reponse.reponseObject.reponse18.reponsText,
            reponse.reponseObject.reponse23.reponsText,
            reponse.reponseObject.reponse23.reponsFilleText,
            reponse.reponseObject.reponse31.reponsText]);
        }
        else
        {
          // console.log(reponse);
          rows.push([reponse.idUsers, reponse.reponseObject.reponse1.reponsText,
            reponse.reponseObject.reponse2.reponsText,
            reponse.reponseObject.reponse2.reponsFilleText,
            reponse.reponseObject.reponse3.reponsText,
            reponse.reponseObject.reponse4.reponsText,
            reponse.reponseObject.reponse4.reponsFilleText,
            reponse.reponseObject.reponse5.reponsText,
            reponse.reponseObject.reponse5.reponsFilleText,
            this.fromLikertNumber(reponse.reponseObject.reponse6.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse7.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse8.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse9.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse10.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse11.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse12.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse13.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse14.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse15.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse16.reponsText),
            this.fromLikertNumber(reponse.reponseObject.reponse17.reponsText),
            reponse.reponseObject.reponse18.reponsText,
            reponse.reponseObject.reponse23.reponsText,
            reponse.reponseObject.reponse23.reponsFilleText,

          ]);
        }

      }
      else
      {
        if ( this.type == 'T2')
        {
          if( Object.keys(reponse.reponseObject).length > this.tailleQuestionnaireInitT2)
          {
            rows.push([reponse.idUsers, reponse.reponseObject.reponse19.reponsText,
              reponse.reponseObject.reponse19.reponsFilleText,
              reponse.reponseObject.reponse20.reponsText,
              reponse.reponseObject.reponse20.reponsFilleText,
              reponse.reponseObject.reponse31.reponsText
            ]);
          }
          else {
            rows.push([reponse.idUsers, reponse.reponseObject.reponse19.reponsText,
              reponse.reponseObject.reponse19.reponsFilleText,
              reponse.reponseObject.reponse20.reponsText,
              reponse.reponseObject.reponse20.reponsFilleText
            ]);
          }

        }
        else
        {

          if ( this.type == 'T11')
          {
            if( Object.keys(reponse.reponseObject).length > this.tailleQuestionnaireInitT11)
            {
              rows.push([reponse.idUsers, reponse.reponseObject.reponse26.reponsEntier,
                reponse.reponseObject.reponse26.reponsFilleText,
                reponse.reponseObject.reponse27.reponsEntier,
                reponse.reponseObject.reponse27.reponsFilleText,
                reponse.reponseObject.reponse28.reponsEntier,
                reponse.reponseObject.reponse28.reponsFilleText,
                reponse.reponseObject.reponse29.reponsEntier,
                reponse.reponseObject.reponse29.reponsFilleText,
                reponse.reponseObject.reponse31.reponsText
              ]);
            }
            else {
              rows.push([reponse.idUsers, reponse.reponseObject.reponse26.reponsEntier,
                reponse.reponseObject.reponse26.reponsFilleText,
                reponse.reponseObject.reponse27.reponsEntier,
                reponse.reponseObject.reponse27.reponsFilleText,
                reponse.reponseObject.reponse28.reponsEntier,
                reponse.reponseObject.reponse28.reponsFilleText,
                reponse.reponseObject.reponse29.reponsEntier,
                reponse.reponseObject.reponse29.reponsFilleText,
              ]);

            }

          }
          else
          {
            if ( this.type == 'T12')
            {
              if( Object.keys(reponse.reponseObject).length > this.tailleQuestionnaireInitT12)
              {
                rows.push([reponse.idUsers,
                  reponse.reponseObject.reponse24.reponsEntier,
                  reponse.reponseObject.reponse24.reponsFilleText,
                  reponse.reponseObject.reponse25.reponsEntier,
                  reponse.reponseObject.reponse25.reponsFilleText,
                  reponse.reponseObject.reponse26.reponsEntier,
                  reponse.reponseObject.reponse26.reponsFilleText,
                  reponse.reponseObject.reponse27.reponsEntier,
                  reponse.reponseObject.reponse27.reponsFilleText,
                  reponse.reponseObject.reponse28.reponsEntier,
                  reponse.reponseObject.reponse28.reponsFilleText,
                  reponse.reponseObject.reponse29.reponsEntier,
                  reponse.reponseObject.reponse29.reponsFilleText,
                  reponse.reponseObject.reponse31.reponsText

                ]);
              }
              else{
                rows.push([reponse.idUsers,
                  reponse.reponseObject.reponse24.reponsEntier,
                  reponse.reponseObject.reponse24.reponsFilleText,
                  reponse.reponseObject.reponse25.reponsEntier,
                  reponse.reponseObject.reponse25.reponsFilleText,
                  reponse.reponseObject.reponse26.reponsEntier,
                  reponse.reponseObject.reponse26.reponsFilleText,
                  reponse.reponseObject.reponse27.reponsEntier,
                  reponse.reponseObject.reponse27.reponsFilleText,
                  reponse.reponseObject.reponse28.reponsEntier,
                  reponse.reponseObject.reponse28.reponsFilleText,
                  reponse.reponseObject.reponse29.reponsEntier,
                  reponse.reponseObject.reponse29.reponsFilleText,

                ]);
              }


            }
            else
            {

              //console.log(this.type);
               // console.log('T3');
              rows.push([reponse.idUsers,
                reponse.reponseObject.reponse4.reponsText,
                reponse.reponseObject.reponse4.reponsFilleText,
                reponse.reponseObject.reponse5.reponsText,
                reponse.reponseObject.reponse5.reponsFilleText,
                this.fromLikertNumber(reponse.reponseObject.reponse6.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse7.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse8.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse9.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse10.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse11.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse12.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse13.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse14.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse15.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse16.reponsText),
                this.fromLikertNumber(reponse.reponseObject.reponse17.reponsText),
                reponse.reponseObject.reponse18.reponsText,
                reponse.reponseObject.reponse23.reponsText,
                reponse.reponseObject.reponse23.reponsFilleText,
                reponse.reponseObject.reponse30.reponsText,
                reponse.reponseObject.reponse30.reponsFilleText,
                reponse.reponseObject.reponse31.reponsText,]);
            }
          }
        }

      }


    }

   worksheet.addRows(rows, 'n');

    // formatage de l'en tête

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { wrapText: true, horizontal: 'center', vertical: 'middle'  };

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.type4Name + ' ' + this.sessionText + moment().format('MM/DD/YYYY HH:mm:ss') + '.xlsx');
    });

    this.utileService.successAlert('Exporter vos données', 'Opération effectuée avec succès');

  }

  fromLikertNumber(qualitativeValue: any)
  {
    if (qualitativeValue === 'Pas du tout')
    {

      return 0;


    }
      if(qualitativeValue === 'Un peu')
      {
        return 1;
      }


      if(qualitativeValue === 'Moyennement')
        {
            return 2
        }

          if(qualitativeValue === 'Vraiment')
          {
              return 3
          }

            if(qualitativeValue === 'Extrêmement')
            {
              return 4
            }



    }







}
