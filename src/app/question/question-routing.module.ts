import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListQuestionComponent} from './list-question/list-question.component';

const routes: Routes = [
  {path: 'list-question', component: ListQuestionComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRoutingModule { }
