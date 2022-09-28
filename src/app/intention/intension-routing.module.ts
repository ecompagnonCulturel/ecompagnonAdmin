import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListSessionComponent} from "../session/list-session/list-session.component";
import {ListIntentionComponent} from "./list-intention/list-intention.component";

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntensionRoutingModule { }
