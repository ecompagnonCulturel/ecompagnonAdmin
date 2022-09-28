import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const apiUrlSession = '/api/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient
  ) {
  }

  getAllSession(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlSession + '/getAllSession', httpOptions)
      .pipe(
        tap()
      );
  }

  getActiveSession(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlSession + '/getActiveSession', httpOptions)
      .pipe(
        tap()
      );
  }

  deleteSession(id: any): Observable<any> {
   /* const params = new HttpParams();
    params.set('id',id);*/
    const params = {id};
    httpOptions.responseType = 'Text';
    return this.httpClient.delete(`${environment.serverURL}` + apiUrlSession + '/delSession', { ...httpOptions, params});
  }


  addSession(session: any): Observable<any> {
    httpOptions.responseType = 'Text';
    return this.httpClient.post(`${environment.serverURL}` + apiUrlSession + '/addSession', session, httpOptions).pipe(
      tap()
    );
  }

  getSessionOrderByStartDate(): Observable<any> {
    httpOptions.responseType = 'json';
    return this.httpClient.get(`${environment.serverURL}` + apiUrlSession + '/getSessionOrderByStartDate', { ...httpOptions}).pipe(
      tap(),

    );
  }

}
