import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConnexionComponent} from "../authentification/connexion/connexion.component";
import {HomeComponent} from "./home/home.component";
import {ListActivityComponent} from "../activity/list-activity/list-activity.component";
import {ListCoursComponent} from "../cours/list-cours/list-cours.component";
import {ExportDataComponent} from "../data/export-data/export-data.component";
import {ListEtudiantComponent} from "../etudiant/list-etudiant/list-etudiant.component";
import {ListGroupEtudiantComponent} from "../etudiantGroup/list-group-etudiant/list-group-etudiant.component";
import {ListFormateurComponent} from "../formateur/list-formateur/list-formateur.component";
import {ListIntentionComponent} from "../intention/list-intention/list-intention.component";
import {ListQuestionnaireComponent} from "../questionnaire/list-questionnaire/list-questionnaire.component";
import {ListResourceComponent} from "../resource/list-resource/list-resource.component";
import {ListSessionComponent} from "../session/list-session/list-session.component";
import {AutoLoginGuard} from "../secutity/guard/auto-login.guard";
import {ListUsersComponent} from "../authentification/list-users/list-users.component";

const routes: Routes = [
  { path: '', component: HomeComponent,
    children:[
      { path: 'list-activity', component: ListActivityComponent},
      { path: 'list-cours', component: ListCoursComponent},
      {path: 'export', component: ExportDataComponent},
      { path: 'list-etudiant', component: ListEtudiantComponent},
      {path: 'list-etudGroup', component: ListGroupEtudiantComponent},
      {path: 'list-formateur', component: ListFormateurComponent},
      {path: 'list-intension', component: ListIntentionComponent},
      {path: 'list-questionnaire', component: ListQuestionnaireComponent},
      { path: 'list-resource', component: ListResourceComponent},
      {path: 'list-session', component: ListSessionComponent},
      {path: 'list-users', component: ListUsersComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
