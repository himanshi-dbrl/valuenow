import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '../common/shared/shared.module';
import { ChatService } from 'src/app/services/chat.service';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    ScrollToModule.forRoot(),
  ],
  providers: [ChatService, GoogleAnalyticsService]
})
export class ChatModule { }
