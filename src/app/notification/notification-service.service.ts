import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";

const apiUrlNotification = '/api/notification';
const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {


  constructor(private httpClient: HttpClient
  ) {}

  getAllQuest(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlNotification  + '/getAllQuest', httpOptions)
      .pipe(
        tap()
      );
  }
}
