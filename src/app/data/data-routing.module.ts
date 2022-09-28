import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListGroupEtudiantComponent} from '../etudiantGroup/list-group-etudiant/list-group-etudiant.component';
import {ExportDataComponent} from './export-data/export-data.component';

const routes: Routes = [


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
