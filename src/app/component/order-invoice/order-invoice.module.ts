import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderInvoiceRoutingModule } from './order-invoice-routing.module';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { SharedModule } from '../common/shared/shared.module';
import { DetailsComponent } from './details/details.component';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


@NgModule({
  declarations: [OrderInvoiceComponent, DetailsComponent],
  imports: [
    CommonModule,
    OrderInvoiceRoutingModule,
    SharedModule
  ],
  providers: [GoogleAnalyticsService]
})
export class OrderInvoiceModule { }
