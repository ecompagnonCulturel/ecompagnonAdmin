import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageServiceService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {
    this.loadToken()
  }
  signOut(): void {
    this.isAuthenticated.next(false);
    localStorage.clear();
    //console.log(this.getUser());

  }
  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);

  }
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.isAuthenticated.next(true);
  }
  public getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

   async loadToken() {
   let user = this.getUser();
  //  console.log(user);
   if (user.idUsers !=undefined) {
     this.isAuthenticated.next(true);
   } else {
     this.isAuthenticated.next(false);
   }
 }


}
