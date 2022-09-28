import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtileService} from "../../utile/utile.service";
import {Validator} from "../../utile/validator";
import {FormateurService} from "../formateur.service";

@Component({
  selector: 'app-add-formateur',
  templateUrl: './add-formateur.component.html',
  styleUrls: ['./add-formateur.component.css']
})
export class AddFormateurComponent implements OnInit {
  addFormateurForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private utileService: UtileService,
              private validator: Validator,
              private formateurService: FormateurService) { }

  ngOnInit(): void {

    this.addFormateurForm = this.formBuilder.group({
      id: [],
      profFirstName: ['', [Validators.required]],
      profLastName: ['', [Validators.required]],
      profContact: ['',[Validators.email]],
      profAdresse: [''],
      profDiplome: [''],
      profStatus: [1],
    });

    if (this.data.prof !== undefined){
      //console.log(this.data.prof)
      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      // console.log(this.data.session.sessNom);
      this.addFormateurForm.patchValue(
        {  id: this.data.prof.id ,
          profFirstName: this.data.prof.profFirstName,
          profLastName : this.data.prof.profLastName,
          profContact : this.data.prof.profContact,
          profAdresse : this.data.prof.profAdresse,
          profDiplome : this.data.prof.profDiplome,
          profStatus : this.data.prof.profStatus

        } );
    }
  }

  addFormateur() {
    // console.log(this.addStudentForm.value);
    this.formateurService.addProf(this.addFormateurForm.value)
      .subscribe(rep=>{
          // console.log(rep);
          this.utileService.successAlert('Ajouter/Modifier un formateur', 'Opération effectuée avec succès');
          this.addFormateurForm.reset();

        },
        err => {
          console.log(err)
          this.utileService.errorAlert('Ajouter/Modifier un formateur',err.error);
        });


  }


  get profFirstName() {
    return this.addFormateurForm.get('profFirstName');
  }

  get profLastName() {
    return this.addFormateurForm.get('profLastName');
  }

  get profContact() {
    return this.addFormateurForm.get('profContact');
  }
}
