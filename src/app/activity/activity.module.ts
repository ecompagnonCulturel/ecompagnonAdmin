import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ListActivityComponent } from './list-activity/list-activity.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import {MaterialModule} from "../utile/material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ListActivityComponent,
    AddActivityComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ActivityModule { }
