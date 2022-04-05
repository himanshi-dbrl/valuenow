import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostOpportunityComponent } from './post-opportunity/post-opportunity.component';
import { PostOpportunityDetailsComponent } from './post-opportunity-details/post-opportunity-details.component';


const routes: Routes = [
  { path: "", redirectTo: "add", pathMatch: "full" },
  { path: 'add', component: PostOpportunityComponent },
  { path: 'edit/:id', component: PostOpportunityComponent },
  { path: 'details/:id', component: PostOpportunityDetailsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostOpportunityRoutingModule { }
