import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../session/session.service';
import {ActivityService} from '../../activity/activity.service';
import {QuestionnaireService} from '../questionnaire.service';
import {EtudiantGroupService} from '../../etudiantGroup/etudiant-group.service';
import {ResponseService} from '../../response/response.service';
import {UtileService} from '../../utile/utile.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {DateAdapter} from "@angular/material/core";


@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.css']
})
export class AddQuestionnaireComponent implements OnInit {
  addQuestionnaireForm: FormGroup;
  editobject: any = [];
  currentSession: any;
  activite: any;
  etudiantGroup: any;
  formEditStatut = false;
  session: any;
  questionnaire: any = {
    id: '', activite: '', groupEtudiant: '',
    startDate: '', endDate: '', session: '',
    status: '', type: ''
  };


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private sessionService: SessionService,
              private utileService: UtileService,
              private activiteService: ActivityService,
              private etudiantGroupService: EtudiantGroupService,
              @Inject(MAT_DIALOG_DATA) public data,
              private questionnaireService: QuestionnaireService,
              private responseService: ResponseService,
              private dateAdapter: DateAdapter<any>) {
  }

    ngOnInit(): void {
    this.addQuestionnaireForm = this.formBuilder.group({
      id: [],
      activite: [0],
      groupEtudiant: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      session: ['', Validators.required],
      type: ['', Validators.required],
      action: ['', Validators.required]

    });

    if (this.data.questionnaire !== undefined) {

      if ((this.data.questionnaire.type === 'T0') || (this.data.questionnaire.type === 'T2'))
      {


       // console.log(this.addQuestionnaireForm.controls);
        // type: this.data.questionnaire.type;
       /* this.addQuestionnaireForm.patchValue(
          {groupEtudiant: this.data.questionnaire.groupEtudiant.id});
     */
        //console.log(this.addQuestionnaireForm.controls.groupEtudiant.errors);
        this.addQuestionnaireForm.controls.groupEtudiant.setErrors(null);
       //console.log(this.addQuestionnaireForm.controls.groupEtudiant.errors);
        this.addQuestionnaireForm.controls.groupEtudiant.clearValidators();
        //console.log(this.addQuestionnaireForm.controls.groupEtudiant);
        this.addQuestionnaireForm.controls.groupEtudiant.updateValueAndValidity();
        this.addQuestionnaireForm.controls['groupEtudiant'].setValidators([]);
        //console.log(this.addQuestionnaireForm.controls.groupEtudiant.errors);
        this.addQuestionnaireForm.controls.groupEtudiant.clearValidators();
        //console.log(this.addQuestionnaireForm.controls.groupEtudiant);
       // this.addQuestionnaireForm.get('groupEtudiant').clearValidators();
        this.addQuestionnaireForm.updateValueAndValidity();
        //console.log(this.addQuestionnaireForm.controls['groupEtudiant']);
      } else {
        //console.log(this.data.questionnaire.groupEtudiant.id);
        this.addQuestionnaireForm.patchValue(
          {groupEtudiant: this.data.questionnaire.groupEtudiant.id});

        // Récupération de l'activité du questionnaire T12
        if (this.data.questionnaire.type === 'T12') {
          // console.log(this.data.questionnaire);
          this.addQuestionnaireForm.get("activite").setValue(this.data.questionnaire.activite.id);


        }
      }


      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      this.addQuestionnaireForm.patchValue(
        {
          id: this.data.questionnaire.id,
          startDate: this.data.questionnaire.startDate,
          type: this.data.questionnaire.type,
          endDate: this.data.questionnaire.endDate,
          session: this.data.questionnaire.session.id,
          action: 1,

        });
    }

    this.getCurrentSession();

    this.getAllSession();
    this.frenchLocale();
  }

  async getCurrentSession() {
    await this.sessionService.getActiveSession().subscribe(session => {
        // console.log(session);
        if (session !== null) {
          //this.getActiviteBySession(session.id);
          //this.getAllGroupeEtudiantBySession(session.id);
          this.currentSession = session;

        }
      },
      err => {
        console.log(err);
      }
    );

  }

  async getActiviteBySession(event: any) {
    await this.activiteService.getBySession(event.source.value).subscribe(activite => {
        // console.log(repQuestAll);
        // console.log(activite);
        this.activite=null;
        if (activite.length > 0) {
          this.activite = activite;
        }
      },
      err => {
        console.log(err);
      }
    );

  }


  async getAllGroupeEtudiantBySession(event: any) {
    this.etudiantGroup=null;
   // console.log(this.etudiantGroup);
    await this.etudiantGroupService.getAllGroupeEtudiantBySession(event.source.value).subscribe(etudiantGroup => {
        // console.log(repQuestAll);
        if (etudiantGroup.length > 0) {
          this.etudiantGroup = etudiantGroup;
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  async getComplementByQuestionnaire(questionnaire: any) {
    await this.activiteService.getComplementByQuestionnaire(questionnaire).subscribe(complement => {

      },
      err => {
        console.log(err);
      }
    );

  }

  onSubmit() {
  }

  async addQuestionnaire() {

// vérification des dates
    if (this.addQuestionnaireForm.get('startDate').value > this.addQuestionnaireForm.get('endDate').value) {

      this.utileService.successAlert('Ajouter un questionnaire', 'La date de début doit être inférieure à la date fin');

    } else {
// Vérification de l'existence de questionnaire dans cette période
   /*   this.questionnaireService.getQuestionnaireByStartDateAndEndDate(this.addQuestionnaireForm.get
   ('startDate').value.format('yyyy-MM-DDTHH:mm:ss'), this.addQuestionnaireForm.get('endDate').value.
   format('yyyy-MM-DDTHH:mm:ss'))
        .subscribe(questionnaireReq => {
            console.log(questionnaireReq);


            if ((questionnaireReq.length === 0) ||
              ((questionnaireReq.length === 1) && (questionnaireReq[0].id === this.data.questionnaire.id)))
            {*/

              // Vérification de la présence d'activité pour les questionnaire T12
              if ((this.addQuestionnaireForm.get('type').value === 'T12') && (this.addQuestionnaireForm.get('activite').value === 0)) {
                this.utileService.successAlert('Modifier un questionnaire', 'une activité est requise pour ce questionnaire');

              } else {
                // Vérification du doublon du question du même type, pour le même groupe sur la session
                this.questionnaireService.getByTypeAndGroupEtudiantAndSession(this.addQuestionnaireForm.get('type').value,
                  this.addQuestionnaireForm.get('groupEtudiant').value, this.addQuestionnaireForm.get('session').value)
                  .subscribe(questionnaireDoublon => {
                      if ((questionnaireDoublon.length === 0) || ((questionnaireDoublon.length === 1) && (this.addQuestionnaireForm.get('action').value === 1))) {
                        const questionnaire = {
                          id: 0,
                          activite: this.addQuestionnaireForm.get('activite').value,
                          groupEtudiant: this.addQuestionnaireForm.get('groupEtudiant').value,
                          startDate: this.addQuestionnaireForm.get('startDate').value,
                          endDate: this.addQuestionnaireForm.get('endDate').value,
                          session: this.addQuestionnaireForm.get('session').value,
                          status: 1,
                          type: this.addQuestionnaireForm.get('type').value,
                          questionnaire: this.data.questionnaire.id

                        };
                        if (this.addQuestionnaireForm.get('action').value === 1) {
                          questionnaire.id = this.data.questionnaire.id;
                          this.responseService.getByQuestionnaire(this.data.questionnaire.id)
                            .subscribe(reponse => {
                                if (reponse.length > 0) {
                                  Swal.fire({
                                    title: 'Ce questionnaire a été déjà repondu',
                                    text: 'Voullez vous quand même le modifier?',
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
                                      this.updateQuestionnaire(questionnaire);
                                    } else if (result.isDismissed) {

                                      console.log('Clicked No, File is safe!');

                                    }
                                  });

                                } else {
                                  this.updateQuestionnaire(questionnaire);
                                }
                              },

                              error => {

                              });

                        } else if (this.addQuestionnaireForm.get('action').value === 2) {
                          // les questionnaire T0 et T3 ne peuvent être dupliqués
                          if ((this.addQuestionnaireForm.get('type').value) === 'T0' || (this.addQuestionnaireForm.get('type').value === 'T3')) {
                            this.utileService.successAlert('Dupliquer un questionnaire', 'ce questionnaire ne peut être dupliqué');

                          } else {
                            this.questionnaireService.addQuestionnaire(questionnaire)
                              .subscribe(
                                // Admire results
                                data => {
                                  this.utileService.successAlert('Dupliquer un questionnaire', 'Opération effectuée avec succès');

                                },

                                error => {
                                  console.log(error);
                                  this.utileService.successAlert('Dupliquer un questionnaire', 'l\'opération  a échoué');

                                }
                              );


                          }


                        }

                      } else {
                        this.utileService.successAlert('Mofidier/Dupliquer un questionnaire', 'Ce type de questionnaire existe déjà pour ce groupe à cette session');

                      }
                    },
                    error => {

                    });
              }
/*

            } else {
              this.utileService.successAlert('Modifier/Dupliquer un questionnaire',
              'Un ou des questionnaire(s) existe(nt) déjà dans cette période');

            }
*/

         /* },
          err => {
            console.log(err);
          }
        );*/


    }
  }


  getAllSession() {
    // this.sessionService.getAllSession();
    this.sessionService.getSessionOrderByStartDate().subscribe(sessionAll => {
        // console.log(sessionAll)
        this.session = sessionAll;

      },
      err => {
        console.log(err);
      }
    );
  }

  updateQuestionnaire(questionnaire: any) {
    this.questionnaireService.updateQuestionnaire(questionnaire)
      .subscribe(
        // Admire results
        data => {
          this.utileService.successAlert('Modifier un questionnaire', 'Opération effectuée avec succès');

        },

        error => {
          console.log(error);
          this.utileService.successAlert('Modifier un questionnaire', 'l\'opération  a échoué');

        }
      );
  }
  frenchLocale() {
    this.dateAdapter.setLocale('fr-FR');
  }
}
