import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddQuestionnaireComponent} from "../questionnaire/add-questionnaire/add-questionnaire.component";
import {AddActivityComponent} from "./add-activity/add-activity.component";
import {ListActivityComponent} from "./list-activity/list-activity.component";

const routes: Routes = [
 /* {path: 'add-activity', component: AddActivityComponent,outlet: 'home'},*/


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
