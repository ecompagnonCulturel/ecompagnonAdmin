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
const apiUrlEtudiant = '/api/Etudiant';
const apiUrlCpMail = '/api/CPEmail';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(private httpClient: HttpClient) { }


  getAllCpMail(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlCpMail + '/getAllCpMail', {...httpOptions})
      .pipe(
        tap()
      );
  }

  getAllEtudiantOrderByFirstName(): Observable<any> {
    httpOptions.responseType ='json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiant + '/getAllEtudiantOrderByFirstName', {...httpOptions})
      .pipe(
        tap()
      );
  }

  addEtudiant(etudiant: any): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlEtudiant + '/addEtudiant', etudiant, httpOptions).pipe(
      tap()
    );
  }

  delEtudiant(id: any): Observable<any> {
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlEtudiant + '/delEtudiant', { ...httpOptions, params});
  }

  // 'Content-Type': 'multipart/form-data;bondary=------WebKitFormBoundaryabgnNF4QEACALgwm'
  addEtudiantByFile(file: any): Observable<any> {
    httpOptions.responseType = 'json';
    // this.httpClient= new HttpClient(this.httpBackend);
    let body = new FormData();
    body.append('file', file);

    return this.httpClient.post(`${environment.serverURL}` + apiUrlEtudiant + '/addEtudiantByFile', body).pipe(
      tap()
    );
  }
}
