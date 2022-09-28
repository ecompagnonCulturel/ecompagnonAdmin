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
const apiUrlIntension = '/api/CourseResource';
@Injectable({
  providedIn: 'root'
})
export class IntensionService {

  constructor(private httpClient: HttpClient) { }

  getAllIntension(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlIntension + '/getAllCourseResourse', httpOptions)
      .pipe(
        tap()
      );
  }

  delIntension(id: any): Observable<any> {
    /* const params = new HttpParams();
     params.set('id',id);*/
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlIntension + '/delCourseResource', { ...httpOptions, params});
  }

  addIntension(session: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlIntension + '/addCourseResource', session, httpOptions).pipe(
      tap()
    );
  }

}
