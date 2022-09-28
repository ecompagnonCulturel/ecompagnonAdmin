import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListSessionComponent} from '../session/list-session/list-session.component';
import {AddSessionComponent} from '../session/add-session/add-session.component';
import {ListQuestionnaireComponent} from './list-questionnaire/list-questionnaire.component';
import {AddQuestionnaireComponent} from './add-questionnaire/add-questionnaire.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnaireRoutingModule { }
