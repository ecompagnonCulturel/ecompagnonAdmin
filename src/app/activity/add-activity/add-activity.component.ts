import {Component, Inject, OnInit} from '@angular/core';
import {SessionService} from '../../session/session.service';
import {EtudiantGroupService} from '../../etudiantGroup/etudiant-group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UtileService} from '../../utile/utile.service';
import {ActivityService} from '../activity.service';
import * as moment from "moment";

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent implements OnInit {
  sessions: any;
  groupes: any;
  addActivityForm: FormGroup;
  types: any;
  activiteInuse: any=[];
  constructor(private sessionService: SessionService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data,
              private etudiantGroupService: EtudiantGroupService,
              private utileService: UtileService,
              private activityService:ActivityService ) { }

  ngOnInit(): void {

    this.addActivityForm = this.formBuilder.group({
      id: [],
      session: ['', Validators.required],
      actDesc: ['', Validators.required]
    });

    if (this.data.activite !== undefined){
      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      // console.log(this.data.session.sessNom);
      this.addActivityForm.patchValue(
        { id: this.data.activite.id ,
          actDesc: this.data.activite.actDesc,
          session : this.data.activite.session.id,

        } );
    }

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


  getGroupEtudiantBySessionAndType(sel: any) {
    // this.sessionService.getAllSession();
    this.etudiantGroupService.getGroupEtudiantBySessionAndType(sel.source.value,'T12')
      .subscribe(group => {
        // console.log(sessionAll)
        this.groupes = group;
      },
      err => {
        console.log(err);
      }
    );
  }

  async addAcrivity() {
   // this.types='T12';
    //this.addActivityForm.get('types').setValue(this.types);
    await  this.activityService.addActivity(this.addActivityForm.value)
      .subscribe(
        // Admire results
        data => {
          this.utileService.successAlert('Ajouter/Modifier un groupe d\'une activité', 'Opération effectuée avec succès');
          this.addActivityForm.reset();

        },
        error => {
          console.log(error);
          this.utileService.successAlert('Ajouter/Modifier un groupe d\'une activité', 'l\'opération  a échoué');

        }

      );
  }

}
