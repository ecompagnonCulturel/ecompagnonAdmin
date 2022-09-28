import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCoursComponent} from "./list-cours/list-cours.component";

const routes: Routes = [


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursRoutingModule { }
