import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../utile/material/material.module';
import { SessionModule } from '../session/session.module';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module';
import { EtudiantGroupModule } from '../etudiantGroup/etudiant-group.module';
import { QuestionModule } from '../question/question.module';
import { ResourceModule } from '../resource/resource.module';
import { NotificationModule } from '../notification/notification.module';
import { ActivityModule } from '../activity/activity.module';
import {EtudiantModule} from "../etudiant/etudiant.module";
import {FormateurModule} from "../formateur/formateur.module";
import {CoursModule} from "../cours/cours.module";
import { IntensionModule } from '../intention/intension.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    QuestionnaireModule,
    QuestionModule,
    ResourceModule,
    ActivityModule,
    EtudiantModule,
    FormateurModule,
    CoursModule,
    IntensionModule,
    SessionModule,
    EtudiantGroupModule
  ]
})
export class HomeModule { }
