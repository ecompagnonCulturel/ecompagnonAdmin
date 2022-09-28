import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListResourceComponent} from "./list-resource/list-resource.component";

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
