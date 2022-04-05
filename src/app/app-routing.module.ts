import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinComponent } from './component/join/join.component';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';
import { OtpComponent } from './component/otp/otp.component';
import { AuthGuard } from './helpers/auth.guard';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { PaymentSuccessComponent } from './component/common/payment-success/payment-success.component';
import { PaymentFailedComponent } from './component/common/payment-failed/payment-failed.component';
import { ProfileRestricationGuard } from './helpers/profile-restrication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'join',
    pathMatch: 'full'
  },
  {
    path: 'join',
    component: JoinComponent,
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [AuthGuard],
    data: { role: [1, 2] },

  },
  {
    path: 'payment-success/:id',
    component: PaymentSuccessComponent,
    canActivate: [AuthGuard],
    data: { role: [1, 2] },

  },
  {
    path: 'payment-failed/:id',
    component: PaymentFailedComponent,
    canActivate: [AuthGuard],
    data: { role: [1, 2] },
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1, 2] },
  },
  {
    path: "home",
    loadChildren: () => import('./component/myhome/myhome.module').then(m => m.MyhomeModule),
    canActivate: [AuthGuard],
    data: { role: [1, 2] },
  },
  {
    path: "business",
    loadChildren: () => import('./component/mybusiness/mybusiness.module').then(m => m.MybusinessModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1] },
  },
  {
    path: "search-opportunity",
    loadChildren: () => import('./component/search-opportunity/search-opportunity.module').then(m => m.SearchOpportunityModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1, 2] },
  },
  {
    path: "workplace",
    loadChildren: () => import('./component/myworkplace/myworkplace.module').then(m => m.MyworkplaceModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [2] },
  },
  {
    path: "opportunity",
    loadChildren: () => import('./component/post-opportunity/post-opportunity.module').then(m => m.PostOpportunityModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1, 2] },
  },
  {
    path: "business-valuation",
    loadChildren: () => import('./component/business-valuation/business-valuation.module').then(m => m.BusinessValuationModule),
    canActivate: [AuthGuard],
    data: { role: [1, 2] },
  },
  {
    path: "order-invoice",
    loadChildren: () => import('./component/order-invoice/order-invoice.module').then(m => m.OrderInvoiceModule),
    canActivate: [AuthGuard],
    data: { role: [1, 2] },
  },
  {
    path: "chat",
    loadChildren: () => import('./component/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1, 2] },
  },
  {
    path: "notification",
    loadChildren: () => import('./component/notification/notification.module').then(m => m.NotificationModule),
    canActivate: [AuthGuard, ProfileRestricationGuard],
    data: { role: [1, 2] },
  },
  {
    path: "profile",
    loadChildren: () => import('./component/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    data: { role: [1, 2] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
