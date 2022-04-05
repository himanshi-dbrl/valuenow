import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyworkplaceRoutingModule } from './myworkplace-routing.module';
import { SharedModule } from '../common/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MyworkplaceListComponent } from './myworkplace-list/myworkplace-list.component';
import { MyworkplaceDetailsComponent } from './myworkplace-details/myworkplace-details.component';
import { MyworkplaceAddComponent } from './myworkplace-add/myworkplace-add.component';
import { MyworkplaceComponent } from './mywrokplace/myworkplace.component';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@NgModule({
  declarations: [MyworkplaceComponent, MyworkplaceListComponent, MyworkplaceDetailsComponent, MyworkplaceAddComponent],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    MyworkplaceRoutingModule
  ],
  providers: [GoogleAnalyticsService],
  exports: [SharedModule, CommonModule]
})
export class MyworkplaceModule { }
