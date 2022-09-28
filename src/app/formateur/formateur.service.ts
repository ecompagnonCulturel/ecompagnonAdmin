import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";
const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlProf = '/api/Prof';
@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  constructor(private httpClient: HttpClient) { }

  addProf(prof: any): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlProf + '/addProf', prof, httpOptions).pipe(
      tap()
    );
  }

  delProf(id: any): Observable<any> {
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlProf + '/delProf', { ...httpOptions, params});
  }


  getAllProf(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlProf + '/getAllProf', {...httpOptions})
      .pipe(
        tap()
      );
  }

  getAllProfInUse(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlProf + '/getAllProfInUse', {...httpOptions})
      .pipe(
        tap()
      );
  }


}
