import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SessionService} from "../../session/session.service";
import {UtileService} from "../../utile/utile.service";
import {Validator} from "../../utile/validator";
import {EtudiantService} from "../etudiant.service";


@Component({
  selector: 'app-add-etudiant',
  templateUrl: './add-etudiant.component.html',
  styleUrls: ['./add-etudiant.component.css']
})
export class AddEtudiantComponent implements OnInit {
   addStudentForm: FormGroup;
   sessions: any;
   message: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private sessionService: SessionService,
              private utileService: UtileService,
              private validator: Validator,
              private etudiantService: EtudiantService,
            ) { }

  ngOnInit(): void {
    this.addStudentForm = this.formBuilder.group({
      id: [],
      etudFirstName: ['', [Validators.required]],
      etudLastName: ['', [Validators.required]],
      etudCP: ['', [Validators.required,Validators.maxLength(12),Validators.minLength(12)]],
      etudAdresse: ['', Validators.compose([ Validators.email, this.validator.validateMail])]
    });


    if (this.data.etudiant !== undefined){
      //console.log(this.data.etudiant)
      // tslint:disable-next-line:max-line-length
      // this.data.session.sessNom = this.data.session.sessNom.substr(0, (this.data.session.sessNom.search(this.data.session.sessYear)) - 1);
      // console.log(this.data.session.sessNom);
      this.addStudentForm.patchValue(
        {  id: this.data.etudiant.id ,
          etudFirstName: this.data.etudiant.etudFirstName,
          etudLastName : this.data.etudiant.etudLastName,
          etudCP : this.data.etudiant.etudCP,
          etudAdresse : this.data.etudiant.etudAdresse,

        } );
    }
  }


  addStudent() {
   // console.log(this.addStudentForm.value);
   this.etudiantService.addEtudiant(this.addStudentForm.value)
      .subscribe(rep=>{
       // console.log(rep);
          this.utileService.successAlert('Ajouter/Modifier un étudiant', 'Opération effectuée avec succès');
          this.addStudentForm.reset();
          this.message='';
          },
        err => {
        console.log(err)
          this.utileService.errorAlert('Ajouter/Modifier un étudiant',err.error);
        });


  }

  transform(target:any): string {
   let value=target.value
    let first = value.substr(0,1).toUpperCase();
    return first + value.substr(1);

  }

  setEmailValue() {
    if((this.addStudentForm.get("etudFirstName").value!=null) && (this.addStudentForm.get("etudLastName").value!=null))
    {
     let firstNameWithNoSpace=((this.addStudentForm.get("etudFirstName").value).toLowerCase())
       .replaceAll(' ','.')
      let lastNameWithNoSpace=((this.addStudentForm.get("etudLastName").value).toLowerCase())
        .replaceAll(' ','.')
      let courrielFirstName= this.utileService.removeDiacritics(firstNameWithNoSpace);
      let courrielLastName=this.utileService.removeDiacritics(lastNameWithNoSpace);

      let courriel=(courrielFirstName
        +'.'+courrielLastName
        +'@uqtr.ca');

      this.addStudentForm.controls["etudAdresse"]
        .patchValue(courriel);
    }
    else
    {
      this.addStudentForm.controls["etudAdresse"]
        .patchValue(null);
    }

    this.message='Vérifiez si le courriel est correct !!!!'

  }

  // Easy access for form fields

  get etudFirstName() {
    return this.addStudentForm.get('etudFirstName');
  }

  get etudLastName() {
    return this.addStudentForm.get('etudLastName');
  }

  get etudCP() {
    return this.addStudentForm.get('etudCP');
  }

  get etudAdresse() {
    return this.addStudentForm.get('etudAdresse');
  }




}
