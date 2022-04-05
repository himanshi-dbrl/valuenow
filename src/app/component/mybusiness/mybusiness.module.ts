import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MybusinessRoutingModule } from './mybusiness-routing.module';
import { MybusinessComponent } from './mybusiness/mybusiness.component';
import { SharedModule } from '../common/shared/shared.module';
import { AddBusinessComponent } from './add-business/add-business.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { TooltipModule, CarouselModule } from 'ngx-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@NgModule({
  declarations: [
    MybusinessComponent,
    AddBusinessComponent,
    BusinessListComponent,
    BusinessDetailsComponent

  ],
  imports: [
    CommonModule,
    MybusinessRoutingModule,
    SharedModule,
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    NgSelect2Module
  ],
  providers: [GoogleAnalyticsService],
  bootstrap: [MybusinessComponent]

})
export class MybusinessModule { }
