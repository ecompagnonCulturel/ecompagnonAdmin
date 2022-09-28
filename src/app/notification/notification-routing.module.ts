import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListNotificationComponent} from "./list-notification/list-notification.component";


const routes: Routes = [{path: 'list-notification', component: ListNotificationComponent},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
