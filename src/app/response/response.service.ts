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
const apiUrlResponse = '/api/Reponse';
@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private httpClient: HttpClient) { }


getAllQuestionnaireResponse(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlResponse + '/getAllQuestionnaireResponse', httpOptions)
      .pipe(
        tap()
      );
  }


  getByQuestionnaire(questionnaire:any): Observable<any> {
    let params ={questionnaire: questionnaire};
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlResponse + '/getByQuestionnaire', {...httpOptions,params : params})
      .pipe(
        tap()
      );
  }

  getReponseByGroupAndSessionAndIdEtud(group:any, idEtud, session:any): Observable<any> {
    console.log("group:"+group)
    console.log("idEtud:"+idEtud)
    console.log("session:"+session)
    let params ={group, idEtud, session};
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlResponse + '/getReponseByGroupAndSessionAndIdEtud', {...httpOptions,params : params})
      .pipe(
        tap()
      );
  }
  getEtudiantFromReponseByGroupAndSession(group:any, session:any): Observable<any> {
    let params ={group,session};
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlResponse + '/getEtudiantFromReponseByGroupAndSession', {...httpOptions,params : params})
      .pipe(
        tap()
      );
  }


}


