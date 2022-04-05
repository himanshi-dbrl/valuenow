import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonHttpService } from '../services/common-http.service';
import { AlertService } from '../services/alert.service';

@Injectable({ providedIn: 'root' })
export class ProfileRestricationGuard implements CanActivate {
    currentUser: any;
    language: any = [];
    constructor(
        private router: Router,
        private commonService: CommonHttpService,
        private alert: AlertService
    ) {
        this.commonService.languageData.subscribe(data => {
            this.language = data;
        })
    }

    canActivate(route: ActivatedRouteSnapshot) {
        this.commonService.userData.subscribe(data => {
            this.currentUser = data;
        })
        this.currentUser = this.commonService.getUserData();
        if (this.currentUser != null) {
            if (this.currentUser.profile_completed == 1 && this.currentUser.is_phone_verified == 1 && this.currentUser.email_verified_at != null) {
                return true;
            } else if (this.currentUser.social_login == 0 && this.currentUser.profile_completed == 0 && this.currentUser.is_phone_verified == 0) {
                this.router.navigate(['/otp'])
            }
            else {
                this.alert.info(this.language.complete_your_profile);
                this.router.navigate(['/home']);
            }

        } else {
            this.router.navigate(['/join']);
        }

        // not logged in so redirect to login page with the return url
        return false;
    }


}