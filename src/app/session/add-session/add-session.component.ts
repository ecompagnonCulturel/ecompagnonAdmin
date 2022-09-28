import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import {SessionService} from '../session.service';
import {UtileService} from '../../utile/utile.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';








@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css']
})
export class AddSessionComponent implements OnInit {
  addSessionForm: FormGroup;
  editobject: any = [];
  formEditStatut = false;
  session: any = {
  id: '', sessNom: '', sessStatus: '',
  sessYear: '', sessStart: '', sessMiddle: '',
  sessEnd: ''
};
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private sessionService: SessionService,
              private utileService: UtileService,
              @Inject(MAT_DIALOG_DATA) public data,
              private dateAdapter: DateAdapter<any>,
              private datePipe : DatePipe)  { }

  ngOnInit(): void {
    this.addSessionForm = this.formBuilder.group({
      id: [],
      sessNom: ['', Validators.required],
      sessYear : ['', Validators.required],
      sessStart: ['', Validators.required],
      sessEnd: ['', Validators.required],
      sessMiddle: [null],
      sessStatus: [''],

    });
    if (this.data.session !== undefined){
      // tslint:disable-next-line:max-line-length
        // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
        // console.log( this.data.session.sessStatus);
         this.addSessionForm.patchValue(
        {  id: this.data.session.id ,
          sessNom: this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1),
          sessYear : this.data.session.sessYear,
          sessStart: this.data.session.sessStart,
          sessEnd: this.data.session.sessEnd,
          sessMiddle: this.data.session.sessMiddle,
          sessStatus: this.data.session.sessStatus,

        } );

         //console.log( this.addSessionForm.get('sessStatus').value);
    }

    this.frenchLocale()

  }
  onSubmit() {
   /// console.log('moi');
    this.addSession();
  }


  async addSession(){
    this.addSessionForm.get('sessStatus').setValue(0);
    if (this.addSessionForm.get('sessStart').value > this.addSessionForm.get('sessEnd').value)
    {
      this.utileService.successAlert('Ajouter/Modifier une session', 'L\'année de la  date de début doit être inférieure à la date fin');

    }
    else
    {

      const pipeSessStart=this.datePipe.transform(this.addSessionForm.get('sessStart').value, 'YYYY-MM-dd');
      const pipesessEnd=this.datePipe.transform(this.addSessionForm.get('sessEnd').value, 'YYYY-MM-dd')

      if ((pipeSessStart.substring(0, 4)) !== this.addSessionForm.get('sessYear').value)
      {
        this.utileService.successAlert('Ajouter/Modifier une session', 'La date de début ne correpond pas à l\'année saisie ');

      }
      else
      {
        const sessionSend = {
          id: this.addSessionForm.get('id').value,
          sessNom: this.addSessionForm.get('sessNom').value + ' ' + this.addSessionForm.get('sessYear').value,
          sessYear :this.addSessionForm.get('sessYear').value,
          sessStart: pipeSessStart,
          sessEnd: pipesessEnd,
          sessMiddle: this.addSessionForm.get('sessMiddle').value,
          sessStatus: this.addSessionForm.get('sessStatus').value,

        }
         ;

        await  this.sessionService.addSession(sessionSend)
          .subscribe(
            // Admire results
            data => {
              this.utileService.successAlert('Ajouter/Modifier une session', 'Opération effectuée avec succès');
               this.addSessionForm.reset();
            },

            error => {
              console.log(error);
              this.utileService.successAlert('Ajouter/Modifier une session', 'l\'opération  a échoué');

            }

          );
      }
    }

  }

  frenchLocale() {
    this.dateAdapter.setLocale('fr-FR');
  }

  showDateeValue(value : any){
    console.log(value)
  }
}
