import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';


const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlActivite = '/api/Activite';
const apiUrlComplement = '/api/Complement';
@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private httpClient: HttpClient) { }

  getBySession(session:any): Observable<any> {
    const params={Session: session};
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlActivite + '/getBySession', {...httpOptions, params})
      .pipe(
        tap()
      );
  }

  getAllActivitiesFromComplement(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlComplement + '/getAllActivitiesFromComplement', {...httpOptions})
      .pipe(
        tap()
      );
  }

  getAllActivities(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlActivite + '/getAllActivities', {...httpOptions})
      .pipe(
        tap()
      );
  }

  getComplementByQuestionnaire(questionnaire:any): Observable<any> {
    const params={questionnaire: questionnaire};
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlComplement + '/getByQuestionnaire', {...httpOptions, params})
      .pipe(
        tap()
      );
  }

  getAllComplement(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlComplement + '/getAllComplement', {...httpOptions})
      .pipe(
        tap()
      );
  }

  addActivity(activity: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlActivite + '/addActivity', activity, httpOptions).pipe(
      tap()
    );
  }


  deleteActivite(id: any): Observable<any> {
    /* const params = new HttpParams();
     params.set('id',id);*/
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlActivite + '/delActivite', { ...httpOptions, params});
  }
}
