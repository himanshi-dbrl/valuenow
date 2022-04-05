import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InnerHeaderComponent } from '../inner-layout/inner-header/inner-header.component';
import { JwtInterceptor } from 'src/app/helpers/jwt.interceptor';
import { ErrorInterceptor } from 'src/app/helpers/error.interceptor';
import { AuthServiceConfig } from 'angularx-social-login';
import { provideConfig } from 'src/app/app.module';
import { RouterModule } from '@angular/router';
import { InnerTopHeaderComponent } from '../inner-layout/inner-top-header/inner-top-header.component';
import { InnerFooterComponent } from '../inner-layout/inner-footer/inner-footer.component';
import { InnerMainHeaderComponent } from '../inner-layout/inner-main-header/inner-main-header.component';
import { OpportunitiesListComponent } from '../opportunities-list/opportunities-list.component';
import { TooltipModule, CarouselModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CommonSliderComponent } from '../common-slider/common-slider.component';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopHeaderMenuSidebarComponent } from '../top-header-menu-sidebar/top-header-menu-sidebar.component';
import { PostOpportunitiesListComponent } from '../post-opportunities-list/post-opportunities-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';
import { ChatService } from 'src/app/services/chat.service';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { LeftBannerComponent } from '../left-banner/left-banner.component';
import { PostBannerComponent } from '../post-banner/post-banner.component';


@NgModule({
  declarations: [
    InnerFooterComponent,
    SidebarComponent,
    InnerTopHeaderComponent,
    InnerHeaderComponent,
    InnerMainHeaderComponent,
    OpportunitiesListComponent,
    CommonSliderComponent,
    MenuListComponent,
    TopHeaderMenuSidebarComponent,
    ProfilePictureComponent,
    PostOpportunitiesListComponent,
    DateAgoPipe,
    LeftBannerComponent,
    PostBannerComponent

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SelectDropDownModule,
    InfiniteScrollModule,
    ScrollToModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),

  ],
  exports: [InnerFooterComponent,
    DateAgoPipe,
    SidebarComponent,
    InnerTopHeaderComponent,
    InnerHeaderComponent,
    InnerMainHeaderComponent,
    OpportunitiesListComponent,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgSelectModule,
    SelectDropDownModule,
    CommonModule,
    CommonSliderComponent,
    MenuListComponent,
    ProfilePictureComponent,
    TopHeaderMenuSidebarComponent,
    PostOpportunitiesListComponent,
    InfiniteScrollModule,
    LeftBannerComponent,
    PostBannerComponent
  ],

  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,

    },
    ChatService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
})
export class SharedModule { }
