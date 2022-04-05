import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchOpportunityComponent } from './search-opportunity/search-opportunity.component';



const routes: Routes = [
  { path: "", redirectTo: "search-opportunity", pathMatch: "full" },
  { path: '', component: SearchOpportunityComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchOpportunityRoutingModule { }
