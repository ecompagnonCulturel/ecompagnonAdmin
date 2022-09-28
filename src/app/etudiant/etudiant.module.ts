import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtudiantRoutingModule } from './etudiant-routing.module';
import { ListEtudiantComponent } from './list-etudiant/list-etudiant.component';
import { AddEtudiantComponent } from './add-etudiant/add-etudiant.component';
import {MaterialModule} from "../utile/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChargerExcelComponent } from './charger-excel/charger-excel.component';
import { ListCpMailComponent } from './list-cp-mail/list-cp-mail.component';



@NgModule({
    declarations: [
        ListEtudiantComponent,
        AddEtudiantComponent,
        ChargerExcelComponent,
        ListCpMailComponent
    ],
  imports: [
    CommonModule,
    EtudiantRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EtudiantModule { }
