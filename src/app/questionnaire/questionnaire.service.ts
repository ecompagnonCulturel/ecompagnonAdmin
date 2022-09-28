import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlQuestionnaire = '/api/Questionnaire';


@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  constructor(private httpClient: HttpClient
  ) {
  }


  getAllQuest(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire  + '/getAllQuest', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllQuestQuestionnaire(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire  + '/getAllQuestQuestionnaire', httpOptions)
      .pipe(
        tap()
      );
  }

  updateQuestionnaire(questionnaire: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlQuestionnaire + '/updateQuestionnaire', questionnaire, httpOptions).pipe(
      tap()
    );
  }

  addQuestionnaire(questionnaire: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlQuestionnaire + '/addQuestionnaire', questionnaire, httpOptions).pipe(
      tap()
    );
  }

  getAllQuestDate(DateDebut: any, DateFin: any, session: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      StartD: DateDebut,
      EndD: DateFin,
      session

    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire + '/getAllQuestDate', { ...httpOptions, params}).pipe(
      tap(),

    );
  }


  getByTypeAndGroupEtudiantAndSession(type: any, groupe: any, session: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      type,
      groupe,
      session

    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire + '/getByTypeAndGroupEtudiantAndSession', { ...httpOptions, params}).pipe(
      tap(),

    );
  }

  getQuestionnaireByStartDateAndEndDate(DateDebut: any, DateFin: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      StartD: DateDebut,
      EndD: DateFin

    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire + '/getQuestionnaireByStartDateAndEndDate', { ...httpOptions, params}).pipe(
      tap(),

    );
  }

  deleteQuestionnaire(questionnaire: any,session: any): Observable<any> {
    /* const params = new HttpParams();
     params.set('id',id);*/
    const params = {questionnaire,session};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlQuestionnaire + '/delQuestionnaire', { ...httpOptions, params});
  }

  getQuestionnaireByGroupEtudiant(groupe: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      groupe,
    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire + '/getQuestionnaireByGroupEtudiant', { ...httpOptions, params}).pipe(
      tap(),

    );
  }


  getQuestionnaireGroupEtudiant(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlQuestionnaire + '/getQuestionnaireGroupEtudiant', { ...httpOptions}).pipe(
      tap(),

    );
  }

}
