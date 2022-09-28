import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntensionRoutingModule } from './intension-routing.module';
import { ListIntentionComponent } from './list-intention/list-intention.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../utile/material/material.module";
import { AddIntentionComponent } from './add-intention/add-intention.component';


@NgModule({
  declarations: [
    ListIntentionComponent,
    AddIntentionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IntensionRoutingModule
  ]
})
export class IntensionModule { }
