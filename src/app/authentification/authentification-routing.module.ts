import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListCoursComponent} from "../cours/list-cours/list-cours.component";
import {ConnexionComponent} from "./connexion/connexion.component";
import {AuthentificationGuard} from "../secutity/guard/authentification.guard";
import {ListUsersComponent} from "./list-users/list-users.component";

const routes: Routes = [
  { path: '', component: ConnexionComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }
