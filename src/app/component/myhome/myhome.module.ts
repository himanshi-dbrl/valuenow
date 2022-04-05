import { NgModule } from '@angular/core';
import { MyhomeRoutingModule } from './myhome-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../common/shared/shared.module';
import { CarouselModule } from 'ngx-bootstrap';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    MyhomeRoutingModule,
    SharedModule,
    CarouselModule.forRoot()
  ],
  exports: [],
  providers: [GoogleAnalyticsService],
  bootstrap: [HomeComponent]
})
export class MyhomeModule { }
