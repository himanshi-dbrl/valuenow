import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  { path: "", redirectTo: "profile", pathMatch: "full" },
  { path: '', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
