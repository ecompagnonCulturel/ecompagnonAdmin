import {Component, Inject, OnInit} from '@angular/core';
import {SessionService} from '../../session/session.service';
import {EtudiantGroupService} from '../etudiant-group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UtileService} from '../../utile/utile.service';
import * as moment from 'moment';
@Component({
  selector: 'app-add-etudiant-group',
  templateUrl: './add-group-etudiant.component.html',
  styleUrls: ['./add-group-etudiant.component.css']
})
export class AddEtudiantGroupComponent implements OnInit {
session: any;
addGroupForm: FormGroup;
  constructor(private sessionService: SessionService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data,
              private etudiantGroupService: EtudiantGroupService,
              private utileService: UtileService) { }

  ngOnInit(): void {

    this.addGroupForm = this.formBuilder.group({
      id: [],
      groupName: ['', Validators.required],
      groupDateCreate: [null],
      groupSession: ['', Validators.required],
      groupStatus: [1]
    });

    if (this.data.group !== undefined){
      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      // console.log(this.data.session.sessNom);
      this.addGroupForm.patchValue(
        {  id: this.data.group.id ,
          groupName: this.data.group.groupName,
          groupSession : this.data.group.groupSession.id,

        } );
    }
    this.getAllSession();
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

  async addGroup() {
    this.addGroupForm.get('groupDateCreate').setValue(moment().date());
    await  this.etudiantGroupService.addGroup(this.addGroupForm.value)
      .subscribe(
        // Admire results
        data => {
          this.utileService.successAlert('Ajouter/Modifier un groupe d\'étudiant', 'Opération effectuée avec succès');
          this.addGroupForm.reset();
        },
        error => {
         // console.log(error);
          this.utileService.errorAlert('Ajouter/Modifier un groupe d\'étudiant', 'l\'opération  a échoué');

        }

      );
  }
}
