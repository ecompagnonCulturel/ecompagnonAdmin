import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceRoutingModule } from './resource-routing.module';
import { ListResourceComponent } from './list-resource/list-resource.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ChargerExcelResourceComponent } from './charger-excel-resource/charger-excel-resource.component';
import {MaterialModule} from "../utile/material/material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListResourceComponent,
    AddResourceComponent,
    ChargerExcelResourceComponent
  ],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ResourceModule { }
