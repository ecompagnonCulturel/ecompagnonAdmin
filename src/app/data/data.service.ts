import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlReponse = '/api/Reponse';
const apiUrlComplement = '/api/Complement';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }


  getByQuestionnaire(questionnaire: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      questionnaire
    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlReponse + '/getByQuestionnaire', { ...httpOptions, params}).pipe(
      tap(),

    );
  }

  getQuestionnaireBySession(session: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      session
    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlReponse + '/getQuestionnaireBySession', { ...httpOptions, params}).pipe(
      tap(),

    );
  }

  getReponseByQuestionnaireAndSession(questionnaire: any, session: any): Observable<any> {
    httpOptions.responseType = 'json';
    const params = {
      questionnaire,
      session
    };
    return this.httpClient.get(`${environment.serverURL}` + apiUrlReponse + '/getReponseByQuestionnaireAndSession', { ...httpOptions, params}).pipe(
      tap(),

    );
  }

  getComplementByQuestionnaire(questionnaire: any): Observable<any> {
    const params = {questionnaire: questionnaire};
    return this.httpClient.get(`${environment.serverURL}` + apiUrlComplement + '/getByQuestionnaire', {...httpOptions, responseType: 'json', params: params}).pipe(
      tap(),
    );

  }

}
