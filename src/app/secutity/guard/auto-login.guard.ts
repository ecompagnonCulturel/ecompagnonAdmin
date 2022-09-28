import { Injectable } from '@angular/core';
import { CanLoad, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {filter, map, take} from "rxjs/operators";
import {AuthentificationService} from "../../authentification/authentification.service";
import {TokenStorageServiceService} from "../../authentification/token-storage-service.service";

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: TokenStorageServiceService,
              private router: Router){}
  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log(isAuthenticated);
          this.router.navigateByUrl('/home',{replaceUrl: true});
         // console.log(isAuthenticated);
        } else {
         // this.router.navigateByUrl('/connexion',{replaceUrl: true});
          return true;
        }
      })
    );
  }

}
