import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListGroupEtudiantComponent} from './list-group-etudiant/list-group-etudiant.component';
import {AddEtudiantGroupComponent} from './add-group-etudiant/add-etudiant-group.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantGroupRoutingModule { }
