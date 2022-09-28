import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListQuestionComponent} from "../question/list-question/list-question.component";
import {ListFormateurComponent} from "./list-formateur/list-formateur.component";

const routes: Routes = [


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }
