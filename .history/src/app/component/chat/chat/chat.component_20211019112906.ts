import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { CommonHttpService } from 'src/app/services/common-http.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';


declare var $: any;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('InnerMainHeaderComponent', { static: false }) InnerMainHeaderComponent: ElementRef
  @ViewChild('fileTypeRef', { static: false }) fileTypeRef: ElementRef;
  headerData: object;
  imageBaseUrl = this.commonService.site_url;
  message: string;
  userData: any;
  messages: any = [];
  sender_id: any;
  friendLists: any = [];
  saveFriendLists: any = [];
  activeUserIndex: number = 0;
  activeUserData: any;
  isScroll: boolean = false;
  page: number = 1;
  totalMessage: number = 0;
  isReqMessage: boolean = false;
  activePackage: any = [];
  language: any = [];
  searchValue: string = "";
  loaderShow: boolean = true;
  constructor(private googleAnalyticsService: GoogleAnalyticsService, private router: Router, private chatService: ChatService, protected commonService: CommonHttpService, private alert: AlertService, private rotuer: Router, private location: Location, private loader: LoaderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this
          .googleAnalyticsService
          .eventEmitter("User Chat", "user chat", "user chat", event.urlAfterRedirects, 2);
      }
    });

    this.commonService.languageData.subscribe(
      result => {
        this.language = result;
        this.headerData = { title: this.language.chat, description: '' };
      },
      err => { }
    )
    this.userData = this.commonService.getUserData();
    this.sender_id = this.userData.id;
  }

  onScrollDown() {
    if (this.activeUserData.unread_count > 0 && this.isScroll == false) {
      this.isScroll = true;
      this.chatService.readMessage({ sender_id: this.sender_id, receiver_id: this.activeUserData.user_id });
      this.resReadMessage();

    }

  }

  fileUpload(file) {
    if (file[0]) {
      const url = 'chatFileUpload';
      const formData = new FormData();
      formData.append('file', file[0], file[0].name);
      this.commonService.commonPostCall(url, formData).subscribe(data => {
        if (data.status == 200) {
          const url = data.data;
          var req = { sender_id: this.sender_id, receiver_id: this.activeUserData.user_id, message: url, type: 2, url: "" };
          this.chatService.sendMessage(req);
          this.fileTypeRef.nativeElement.value = "";
        }
      }, error => {
        if (typeof error == 'string') {
          this.alert.info(error);
        } else {
          this.alert.error(this.language.server_not_responding);
        }
      })
    }

  }

  removeValue() {
    this.searchValue = "";
  }

  filterUser(value) {
    this.searchValue = value;
    this.friendLists = this.saveFriendLists;
    this.friendLists = this.friendLists.filter(element => {
      var fullName = element.first_name.toLowerCase() + ' ' + element.last_name.toLowerCase();
      return element.first_name.toLowerCase().indexOf(value.toLowerCase()) > -1 || element.last_name.toLowerCase().indexOf(value.toLowerCase()) > -1 || fullName.indexOf(value.toLowerCase()) > -1
    });
    this.activeChatUser(this.activeUserData, 1);
  }

  onScrollUp() {
    var totalPage = Math.ceil(this.totalMessage / 50);
    if (this.page < totalPage && this.isReqMessage == false) {
      this.page += 1;
      this.isReqMessage = true;
      this.getMessageList();
    }
  }


  sendMessage() {
    if (this.message) {
      var data = { sender_id: this.sender_id, receiver_id: this.activeUserData.user_id, message: this.message, type: 1, url: "" };
      this.chatService.sendMessage(data);
      this.message = "";
    }
  }

  textChange(value) {
    this.message = value.trim();
  }

  activeChatUser(data, index) {
    this.activeUserData = data;
    this.friendLists.forEach((element, index) => {
      if (element.user_id == data.user_id) {
        this.activeUserIndex = index;
      }
    });

    this.page = 1;
    this.messages = [];
    this.getMessageList();
  }

  ngOnInit() {
    this.checkRestrication();



  }
  messageIn() {

    $('.message').css({ 'left': '0px' });

  }
  messageOut() {
    $('.message').css({ 'left': '100%' });
  }


  checkRestrication() {
    const url = `packages/activeUser`;
    this.commonService.commonGetCall(url).subscribe(data => {
      if (data.status == 200) {
        this.activePackage = data.data;
        this.userOnInit();
      } else {
        this.alert.info(data.message);
        this.location.back();
      }
    }, error => {
      if (typeof error == 'string') {
        this.alert.info(error);
      } else {
        this.alert.error(this.language.server_not_responding);
      }
      this.location.back();
    })
  }

  getMessageList() {
    const url = `/api/messageLists/${this.sender_id}/${this.activeUserData.user_id}/${this.page}`;
    this.chatService.getCall(url).subscribe(data => {
      const datas = data.data;
      this.totalMessage = datas.totalData;
      var messages = [];
      if (this.page == 1) {
        messages = datas.data;
        this.goBottom();
      } else {
        this.isReqMessage = false;
        this.messages.concat(datas.data, this.messages);
        messages = this.messages.concat(datas.data);
      }
      this.messages = messages;
      const mess = this.messages.sort((a, b) => { return a.id - b.id });

    }, error => {

    });
  }

  goBottom() {
    setTimeout(() => {
      this.chatService.triggerScrollTo();
    }, 500);
  }



  getFriendsList() {
    this.loader.display(true);
    this.loaderShow = true;
    const url = `/api/frindLists/${this.sender_id}`;
    this.chatService.getCall(url).subscribe(data => {
      const datas = data.data;
      console.log('kkjk',datas)
      this.saveFriendLists = datas.data;
      console.log(this.saveFriendLists);
      this.friendLists = this.saveFriendLists;
      if (this.friendLists.length > 0) {
        this.activeUserData = this.friendLists[0];
        this.getMessageList();
      }
      this.loader.display(false);
      this.loaderShow = false;
    }, error => {
      this.loader.display(false);
      this.loaderShow = false;
    })

  }

  userOnInit() {
    const req = { user_id: this.sender_id };
    this.chatService.onInit(req);
    this.getOnInit();

  }
  getOnInit() {
    this.chatService.getOnInit().subscribe(data => {
      if (data.status == 1) {
        this.getFriendsList();
        this.getMessage();
        this.getMessageRecevier();
      } else {
        this.alert.error(this.language.server_not_responding);
      }
    })
  }

  getMessageRecevier() {
    this.chatService.getMessagesRecevier().subscribe((data) => {
      data[0]['messages'] = data[0]['message'];
      this.pushMessage(data);
      this.saveFriendLists.forEach((element, index) => {
        if (element.user_id == data[0].senderId) {
          if (index != 0) {
            this.activeUserIndex += 1;
          }
          element.unread_count += 1;
          element.type = data[0].type;
          element.message = data[0].message;
          element.chat_id = data[0].id;
        }
      });
      this.sortData();
    })
  }

  sortData() {
    this.friendLists.sort((a, b) => { return b.chat_id - a.chat_id });
  }

  resReadMessage() {
    this.chatService.resReadMessage().subscribe((data) => {
      if (data.status == 1) {
        this.friendLists.forEach(element => {
          this.isScroll = false;
          if (element.user_id == this.activeUserData.user_id) {
            element.unread_count = 0;
          }
        })
      }
    })
  }

  getMessage() {
    this.chatService
      .getMessages()
      .subscribe((data) => {
        data[0]['messages'] = data[0]['message'];
        this.pushMessage(data);
        this.saveFriendLists.forEach(element => {
          if (element.user_id == data[0].receiverId) {
            element.type = data[0].type;
            element.message = data[0].message;
            element.chat_id = data[0].id;
            this.activeUserData = element;
            this.activeUserIndex = 0;
          }
        });
        this.sortData();
        this.activeUserIndex = 0;
        this.goBottom();
      });
  }

  pushMessage(data) {
    if ((data[0].senderId == this.sender_id && data[0].receiverId == this.activeUserData.user_id) || (data[0].receiverId == this.sender_id && data[0].senderId == this.activeUserData.user_id)) {
      this.messages.push(data[0]);
      if (data[0].senderId == this.sender_id) {
        this.getOnInit();
      }
    }
  }

}
