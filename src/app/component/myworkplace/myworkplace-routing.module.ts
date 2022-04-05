import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyworkplaceListComponent } from './myworkplace-list/myworkplace-list.component';
import { MyworkplaceAddComponent } from './myworkplace-add/myworkplace-add.component';
import { MyworkplaceDetailsComponent } from './myworkplace-details/myworkplace-details.component';


const routes: Routes = [{ path: "", redirectTo: "list", pathMatch: "full" },
{ path: 'add', component: MyworkplaceAddComponent },
{ path: 'list', component: MyworkplaceListComponent },
{ path: 'edit/:id', component: MyworkplaceAddComponent },
{ path: 'details/:id', component: MyworkplaceDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyworkplaceRoutingModule { }
