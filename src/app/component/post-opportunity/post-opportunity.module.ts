import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostOpportunityRoutingModule } from './post-opportunity-routing.module';
import { PostOpportunityComponent } from './post-opportunity/post-opportunity.component';
import { SharedModule } from '../common/shared/shared.module';
import { NgSelect2Module } from 'ng-select2';
import { PostOpportunityDetailsComponent } from './post-opportunity-details/post-opportunity-details.component';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@NgModule({
  declarations: [PostOpportunityComponent, PostOpportunityDetailsComponent],
  imports: [
    CommonModule,
    PostOpportunityRoutingModule,
    SharedModule,
    NgSelect2Module

  ],
  exports: [SharedModule, CommonModule],
  providers: [GoogleAnalyticsService]
})
export class PostOpportunityModule { }
