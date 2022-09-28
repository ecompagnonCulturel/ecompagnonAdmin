import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtileService} from "../../utile/utile.service";
import {Validator} from "../../utile/validator";
import {CoursService} from "../cours.service";

@Component({
  selector: 'app-add-cours',
  templateUrl: './add-cours.component.html',
  styleUrls: ['./add-cours.component.css']
})
export class AddCoursComponent implements OnInit {
  addCoursForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private formBuilder: FormBuilder,
              private utileService: UtileService,
              private validator: Validator,
              private coursService: CoursService) { }

  ngOnInit(): void {

    this.addCoursForm = this.formBuilder.group({
      id: [],
      coursDes: ['', [Validators.required]],
      coursNomLong: ['', [Validators.required]],
      coursNomCourt: ['', [Validators.required]],
      coursStatus: [1]
    });


    if (this.data.cours !== undefined){
      this.addCoursForm.patchValue(
        {  id: this.data.cours.id ,
          coursDes: this.data.cours.coursDes,
          coursNomLong : this.data.cours.coursNomLong,
          coursNomCourt : this.data.cours.coursNomCourt,
          coursStatus : this.data.cours.coursStatus
        } );
    }
  }

  addCours() {
    // console.log(this.addStudentForm.value);
    this.coursService.addCours(this.addCoursForm.value)
      .subscribe(rep=>{
          // console.log(rep);
          this.utileService.successAlert('Ajouter/Modifier un cours', 'Opération effectuée avec succès');
          this.addCoursForm.reset();

        },
        err => {
          console.log(err)
          this.utileService.errorAlert('Ajouter/Modifier un cours',err.error);
        });


  }


  get coursDes() {
    return this.addCoursForm.get('coursDes');
  }

  get coursNomLong() {
    return this.addCoursForm.get('coursNomLong');
  }

  get coursNomCourt() {
    return this.addCoursForm.get('coursNomCourt');
  }

}
