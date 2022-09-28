import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { ListSessionComponent } from './list-session/list-session.component';
import { MaterialModule } from '../utile/material/material.module';
import { AddSessionComponent } from './add-session/add-session.component'
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ListSessionComponent,
    AddSessionComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class SessionModule { }
