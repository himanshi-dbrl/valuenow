import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchOpportunityRoutingModule } from './search-opportunity-routing.module';
import { SearchOpportunityComponent } from './search-opportunity/search-opportunity.component';
import { SharedModule } from '../common/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@NgModule({
  declarations: [SearchOpportunityComponent],
  imports: [
    CommonModule,
    SearchOpportunityRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    NgSelect2Module
  ],
  providers: [GoogleAnalyticsService]
})
export class SearchOpportunityModule { }
