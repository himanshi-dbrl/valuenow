import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessValuationRoutingModule } from './business-valuation-routing.module';
import { BusinessValuationComponent } from './business-valuation/business-valuation.component';
import { SharedModule } from '../common/shared/shared.module';
import { NgSelect2Module } from 'ng-select2';
import { EntrepreneurPackageComponent } from '../entrepreneur-package/entrepreneur-package.component';
import { InvestorPackageComponent } from '../investor-package/investor-package.component';


@NgModule({
  declarations: [BusinessValuationComponent,
    InvestorPackageComponent,
    EntrepreneurPackageComponent],
  imports: [
    CommonModule,
    BusinessValuationRoutingModule,
    SharedModule,
    NgSelect2Module
  ]
})
export class BusinessValuationModule { }
