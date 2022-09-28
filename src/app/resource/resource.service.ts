import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};


const apiUrlCoursRes= '/api/CourseResource';
const apiUrlRes= '/api/Resources';
const apiUrlRegion= '/api/Region';
const apiUrlRescCate = '/TypeRessource/getTypeRessource';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private httpClient: HttpClient
  ) {
  }

  getAllCourseResourse(): Observable<any> {

    return this.httpClient.get(`${environment.serverURL}` + apiUrlCoursRes + '/getAllCourseResourse', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllResources(): Observable<any> {

    return this.httpClient.get(`${environment.serverURL}` + apiUrlRes + '/getAllResources', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllRegion(): Observable<any> {

    return this.httpClient.get(`${environment.serverURL}` + apiUrlRegion + '/getAllRegion', httpOptions)
      .pipe(
        tap()
      );
  }


  getAllResourcesFromCoursRes(): Observable<any> {

    return this.httpClient.get(`${environment.serverURL}` + apiUrlCoursRes + '/getAllRessource', httpOptions)
      .pipe(
        tap()
      );
  }

  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.serverURL}`+apiUrlRescCate, httpOptions)
      .pipe(
        tap()
      );
  }

  getAllType(): Observable<any> {
    return this.httpClient.get(`${environment.serverURL}`+apiUrlRescCate, httpOptions)
      .pipe(
        tap()
      );
  }

  addRessource(ressource: any): Observable<any> {
    httpOptions.responseType='json';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlRes + '/addRessource', ressource, httpOptions).pipe(
      tap()
    );
  }


  deleteRessource(id: any): Observable<any> {
    /* const params = new HttpParams();
     params.set('id',id);*/
    const params = {id};
    httpOptions.responseType = 'json';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlRes + '/delRessource', { ...httpOptions, params});
  }

  // 'Content-Type': 'multipart/form-data;bondary=------WebKitFormBoundaryabgnNF4QEACALgwm'
  addResourceByFile(file: any, session: any): Observable<any> {
    httpOptions.responseType = 'json';
    // this.httpClient= new HttpClient(this.httpBackend);
    let body = new FormData();
    body.append('file', file);
    body.append('session', session);

    return this.httpClient.post(`${environment.serverURL}` + apiUrlRes + '/addResourceByFile', body).pipe(
      tap()
    );
  }

}
