import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpBackend} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlEtudiantGroup = '/api/EtudiantGroupe';
const apiUrlGroupEtudiant = '/api/GroupEtudiant';
const apiUrlEtudiant = '/api/Etudiant';

@Injectable({
  providedIn: 'root'
})
export class EtudiantGroupService {

  constructor(private httpClient: HttpClient,
              private httpBackend: HttpBackend) { }


  getAllGroupeEtudiantBySession(session:any): Observable<any> {
    const params={ Session: session};
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiantGroup + '/getAllGroupeEtudiantBySession', {...httpOptions, params})
      .pipe(
        tap()
      );
  }

  getAllEtudiantByGroup(group: any): Observable<any> {
    const params = { Group: group};
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiantGroup + '/getAllEtudiantByGroup', {...httpOptions, params : params})
      .pipe(
        tap()
      );
  }

  getAllEtudiant(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiantGroup + '/getAllEtudiant', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllGroupeEtudiant(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiantGroup + '/getAllGroupeEtudiant', httpOptions)
      .pipe(
        tap()
      );
  }

  getGroupEtudiant(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlGroupEtudiant + '/getGroupEtudiant', httpOptions)
      .pipe(
        tap()
      );
  }

  addGroupEtudiant(groupeEtudiant: any, etudiantsId: any): Observable<any> {
    httpOptions.responseType = 'Text';
    const body = {groupEtudiant: groupeEtudiant,
      etudiantId: etudiantsId};
    return this.httpClient.post(`${environment.serverURL}` + apiUrlGroupEtudiant + '/addGroupEtudiant', body, httpOptions).pipe(
      tap()
    );
  }


  saveSomeStudentInGroup(groupeEtudiant: any, etudiantsId: any): Observable<any> {
    httpOptions.responseType = 'json';
    const body = {idEtud: etudiantsId,
      group: groupeEtudiant};
    return this.httpClient.post(`${environment.serverURL}` + apiUrlEtudiantGroup + '/saveSomeStudentInGroup', body, httpOptions).pipe(
      tap()
    );
  }

  addGroup(groupeEtudiant: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlGroupEtudiant + '/addGroup', groupeEtudiant, httpOptions).pipe(
      tap()
    );
  }

  delGroupEtudiant(id: any): Observable<any> {
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlGroupEtudiant + '/delGroupEtudiant', { ...httpOptions, params});
  }

  delEtudiantFromGroup(group : any,idStudent : any ,session : any): Observable<any> {
    const params = {group, idEtud:idStudent, session};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlEtudiantGroup + '/deleteByGroupEtudiantAndEtudiantAndSession', { ...httpOptions, params});
  }

  getAllStudent(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiant+ '/getAllStudent', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllEtudiantNotInGroup(group: any): Observable<any> {
    const params = {group};
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlEtudiantGroup + '/getAllEtudiantNotInGroup', {...httpOptions, params : params})
      .pipe(
        tap()
      );
  }
  getGroupEtudiantBySessionAndType(session: any, types): Observable<any> {
    const params = {session,types};
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlGroupEtudiant + '/getGroupEtudiantBySessionAndType', {...httpOptions, params : params})
      .pipe(
        tap()
      );
  }


// 'Content-Type': 'multipart/form-data;bondary=------WebKitFormBoundaryabgnNF4QEACALgwm'
  addEtudiantGroup(file: any, groupe:any): Observable<any> {
    httpOptions.responseType = 'json';
   // this.httpClient= new HttpClient(this.httpBackend);
    let body = new FormData();
    // Add file content to prepare the request
    console.log(file);
    body.append('file', file);
    body.append('groupe', groupe);
    console.log(body);
    return this.httpClient.post(`${environment.serverURL}` + apiUrlEtudiantGroup + '/addEtudiantGroup', body).pipe(
      tap()
    );
  }


}
