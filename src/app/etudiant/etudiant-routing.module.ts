import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddActivityComponent} from "../activity/add-activity/add-activity.component";
import {ListActivityComponent} from "../activity/list-activity/list-activity.component";
import {AddEtudiantComponent} from "./add-etudiant/add-etudiant.component";
import {ListEtudiantComponent} from "./list-etudiant/list-etudiant.component";
import {ListCpMailComponent} from "./list-cp-mail/list-cp-mail.component";

const routes: Routes = [
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }
