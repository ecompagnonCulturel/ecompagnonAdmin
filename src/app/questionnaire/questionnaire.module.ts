import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../utile/material/material.module';

import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { ListQuestionnaireComponent } from './list-questionnaire/list-questionnaire.component';
import { AddQuestionnaireComponent } from './add-questionnaire/add-questionnaire.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ListQuestionnaireComponent,
    AddQuestionnaireComponent
  ],
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class QuestionnaireModule { }
