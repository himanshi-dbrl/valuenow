import { Component, OnInit, Input } from '@angular/core';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-inner-main-header',
  templateUrl: './inner-main-header.component.html',
  styleUrls: ['./inner-main-header.component.css']
})
export class InnerMainHeaderComponent implements OnInit {
  @Input() Countadd: any;
  userData: any = [];
  chatCount: number = 0;
  language: any = [];
  notificationCount: number = 0;
  isScroll: boolean = false;
  constructor(private commonService: CommonHttpService, private chatService: ChatService) {
    this.userData = this.commonService.getUserData();
    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
      },
      err => { }
    )
  }

  ngOnInit() {
    this.callChatCount();

    this.getDataCount();
  }


  getDataCount() {
    const url = 'getNotificationCount';
    console.log(localStorage.getItem('notification_date'))
    var date = localStorage.getItem('notification_date') != undefined ? localStorage.getItem('notification_date') : '';
    var data = { date: date };
    this.commonService.commonPostCall(url, data).subscribe(data => {
      this.notificationCount = data.data;
    }, error => {
    });
  }


  getChatCount(isScroll, chatCount) {
    this.isScroll = isScroll;
    if (isScroll == false) {
      this.isScroll = true;
      this.callChatCount();
    }
  }


  callChatCount() {
    const url = `chatCount/${this.userData['id']}`;
    this.chatService.getCall(url).subscribe(data => {
      const datas = data.data;
      if (datas.data) {
        this.chatCount = datas.data[0].unread_count != null ? datas.data[0].unread_count : 0;
      } else {
        this.chatCount = 0;
      }


    }, error => {

    })
  }

}
