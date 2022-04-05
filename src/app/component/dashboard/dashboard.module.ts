import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../common/shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TooltipModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@NgModule({
  declarations: [
    DashboardComponent,

  ],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    CarouselModule.forRoot()
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
