import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { SharedModule } from '../common/shared/shared.module';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule
  ],
  providers: [GoogleAnalyticsService]
})
export class NotificationModule { }
