import {Injectable, OnInit} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map,switchMap,tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {TokenStorageServiceService} from "./token-storage-service.service";
const httpOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'json'
};
const userUrl = '/api/User';
const loginUrl = '/api/login';
const accountURL = '/api/registration';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageServiceService) {
    //this.loadToken();
  }



  login(user: any ): Observable<any> {
    httpOptions.responseType = 'json';
    return this.http.post(`${environment.serverURL}` + loginUrl + '/etudiant', user, httpOptions)
      .pipe(
        map((data: any) => {
          if (data != null) {
            return data
          }
        }),
        tap(_ => {

        })
      );
  }

  logOut()
  {
    this.tokenStorage.signOut();
   // this.isAuthenticated.next(false);
  }


  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.serverURL}` +userUrl + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }

  updateUserPwd(user: any): Observable<any> {
    return this.http.post(`${environment.serverURL}` + accountURL + '/updatePwd', user, {...httpOptions, responseType: 'text'})
      .pipe(
        tap(_ => {
        })
        // , catchError(this.handleError<any>('Update user'))
      );


  }

  getAllusers(): Observable<any> {
    httpOptions.responseType ='json';
    return this.http.get(`${environment.serverURL}` + userUrl + '/getAllusers', {...httpOptions})
      .pipe(
        tap()
      );
  }
}
