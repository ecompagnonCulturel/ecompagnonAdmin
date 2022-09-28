import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { ConnexionComponent } from './connexion/connexion.component';
import {MaterialModule} from "../utile/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UpdatePwdComponent } from './update-pwd/update-pwd.component';
import { ListUsersComponent } from './list-users/list-users.component';


@NgModule({
  declarations: [
    ConnexionComponent,
    UpdatePwdComponent,
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthentificationModule { }
