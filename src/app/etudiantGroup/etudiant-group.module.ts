import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../utile/material/material.module';
import { EtudiantGroupRoutingModule } from './etudiant-group-routing.module';
import { ListGroupEtudiantComponent } from './list-group-etudiant/list-group-etudiant.component';
import { EtudiantCheckListForAddComponent } from './etudiant-check-list-for-add/etudiant-check-list-for-add.component';
import { AddEtudiantGroupComponent } from './add-group-etudiant/add-etudiant-group.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChargerEtudiantExcelComponent } from './charger-etudiant-excel/charger-etudiant-excel.component';
import { StudentListAddedComponent } from './student-list-added/student-list-added.component';
import { MatTableExporterModule } from 'mat-table-exporter';


@NgModule({
  declarations: [
    ListGroupEtudiantComponent,
    EtudiantCheckListForAddComponent,
    AddEtudiantGroupComponent,
    ChargerEtudiantExcelComponent,
    StudentListAddedComponent,
  ],
  imports: [
    CommonModule,
    EtudiantGroupRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableExporterModule
  ]
})
export class EtudiantGroupModule { }
