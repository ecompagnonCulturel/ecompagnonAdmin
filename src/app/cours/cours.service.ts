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
const apiUrlCours = '/api/Cours';
@Injectable({
  providedIn: 'root'
})
export class CoursService {


  constructor(private httpClient: HttpClient) { }


  addCours(cours: any): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlCours + '/addCours', cours, httpOptions).pipe(
      tap()
    );
  }

  delCours(id: any): Observable<any> {
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlCours + '/delCours', { ...httpOptions, params});
  }

  getAllCours(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlCours + '/getAllCours', {...httpOptions})
      .pipe(
        tap()
      );
  }

  getAllCoursInUse(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlCours + '/getAllCoursInUse', {...httpOptions})
      .pipe(
        tap()
      );
  }

}
