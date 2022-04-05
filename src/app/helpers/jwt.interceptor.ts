import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonHttpService } from '../services/common-http.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private commonService: CommonHttpService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const token = localStorage.getItem('token');
        let lang = this.commonService.getLanguage() ? this.commonService.getLanguage() : 'en';
        if (token != null || token != undefined || token != "") {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                    'x-localization': lang
                }
            });
        } else {
            request = request.clone({
                setHeaders: {
                    'x-localization': lang
                }
            });
        }
        return next.handle(request);
    }
}