import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessValuationComponent } from './business-valuation/business-valuation.component';


const routes: Routes = [
  { path: "", redirectTo: "business-valuation", pathMatch: "full" },
  { path: '', component: BusinessValuationComponent },
  { path: 'valuation/:id', component: BusinessValuationComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessValuationRoutingModule { }
