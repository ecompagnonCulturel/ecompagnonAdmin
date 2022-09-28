import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConnexionComponent} from "./authentification/connexion/connexion.component";
import {AutoLoginGuard} from "./secutity/guard/auto-login.guard";
import {AuthentificationGuard} from "./secutity/guard/authentification.guard";

const routes: Routes = [
  {  path: 'connexion',
    loadChildren: () => import('./authentification/authentification.module').then(m => m.AuthentificationModule),
     canLoad: [AutoLoginGuard]},
  {  path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomeModule),
    canLoad: [AuthentificationGuard]},
  { path: '', redirectTo: 'connexion', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*,
    { enableTracing: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
