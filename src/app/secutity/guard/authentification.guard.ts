import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthentificationService} from "../../authentification/authentification.service";
import {filter, map, take} from "rxjs/operators";
import {TokenStorageServiceService} from "../../authentification/token-storage-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanLoad {
  constructor(private authService: TokenStorageServiceService,
              private router: Router) { }
  canLoad(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
      // console.log(isAuthenticated)
        if (isAuthenticated) {
          return true;
        } else {

          this.router.navigateByUrl('/connexion').then(e => {
            if (e) {
              console.log("Navigation is successful!");
            } else {
              console.log("Navigation has failed!");
            }
          });
          return false;
        }
      })
    );
  }

}
