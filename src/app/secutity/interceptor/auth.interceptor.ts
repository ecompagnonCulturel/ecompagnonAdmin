import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {EMPTY, Observable, throwError, from } from 'rxjs';
import {catchError, delay, finalize, map, retryWhen, tap, switchMap } from 'rxjs/operators';
import {TokenStorageServiceService} from "../../authentification/token-storage-service.service";
import { environment } from '../../../environments/environment';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private tok: any;

    constructor(private tokenService:TokenStorageServiceService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
                  const token = `${environment.key}`;
                  //const token=this.tokenService.getToken();
                  if (token) {
                    req = req.clone({ headers: req.headers.set('Authorization',  token) });
                  }
                 // console.log(req.headers);
      if (!req.headers.has('Content-Type')) {

        //Pour les fichiers MultiPart
        let ignore =  req.body.toString() === "[object FormData]" // <-- This solves your problem
        ;
        if (ignore) {

        }
        else
        {
          req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });

        }

      }






                 /* if (!req.headers.has('Content-Type')) {
                        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
                      /!*  if (req.body.toString() === '[object FormData]')
                         {
                           req = req.clone({ headers: req.headers.set('Content-Type', 'multipart/form-data')});
                         }
*!/
                    }*/
                    return next.handle(req).pipe(
                        map((event: HttpEvent<any>) => {
                          //console.log('4');
                            if (event instanceof HttpResponse) {
                                // do nothing for now
                            }
                            return event;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            const status =  error.status;
                            const reason = error && error.error.reason ? error.error.reason : '';
                            return throwError(error);
                        })
                    );




    }

}
