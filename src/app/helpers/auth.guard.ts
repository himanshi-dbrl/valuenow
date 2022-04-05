import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { CommonHttpService } from '../services/common-http.service';
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(
    private router: Router,
    private commonService: CommonHttpService
  ) {

  }



  canActivate(route: ActivatedRouteSnapshot) {
    this.commonService.userData.subscribe(data => {
      this.currentUser = data;
    })

    this.currentUser = this.commonService.getUserData();
    const token = localStorage.getItem("token");
    var type = parseInt(this.currentUser.type);
    if (this.currentUser != null && token) {
      // if (this.currentUser.social_login == 0 && this.currentUser.profile_completed == 0 && this.currentUser.is_phone_verified == 0) {
      //   this.router.navigate(['/otp']);
      //   return false;
      // }
      if (route.data.role &&
        route.data.role.indexOf(type) == -1) {

        this.router.navigate(['/home']);



        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    // not logged in so redirect to login page with the return url
    return false;
  }


}