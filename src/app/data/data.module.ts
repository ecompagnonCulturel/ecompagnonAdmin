import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataRoutingModule } from './data-routing.module';
import { ExportDataComponent } from './export-data/export-data.component';
import { MaterialModule } from '../utile/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ExportDataComponent
  ],
  imports: [
    CommonModule,
    DataRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DataModule { }
