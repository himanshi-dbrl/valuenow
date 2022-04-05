import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../common/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelect2Module } from 'ng-select2';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgSelect2Module
  ],
  providers: [GoogleAnalyticsService]
})
export class ProfileModule { }
