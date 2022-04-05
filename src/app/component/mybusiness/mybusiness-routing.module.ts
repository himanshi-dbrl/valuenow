import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBusinessComponent } from './add-business/add-business.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';


const routes: Routes = [
  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: 'add', component: AddBusinessComponent },
  { path: 'edit/:id', component: AddBusinessComponent },
  { path: 'list', component: BusinessListComponent },
  { path: 'details/:id', component: BusinessDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MybusinessRoutingModule { }
