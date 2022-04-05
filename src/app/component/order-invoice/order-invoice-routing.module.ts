import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { DetailsComponent } from './details/details.component';


const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: 'list', component: OrderInvoiceComponent },
  { path: 'details/:id/:type', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderInvoiceRoutingModule { }
