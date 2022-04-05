import * as io from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = environment.SOCKET_ENDPOINT;
  private socket;
  public chatConnect: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(private _scrollToService: ScrollToService, private http: HttpClient) {
    this.socket = io(this.url);
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
    this._scrollToService.scrollTo(config);
  }


  public sendMessage(data) {
    this.socket.emit('new-message', data);
  }

  public readMessage(data) {
    this.socket.emit('read-message', data);
  }

  public resReadMessage = () => {
    return Observable.create((obs) => {
      this.socket.on('read-message', (data) => {
        obs.next(data);
      })

    });
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  public getMessagesRecevier = () => {
    return Observable.create((observer) => {
      this.socket.on('recevier-message', (message) => {
        observer.next(message);
      });
    });
  }


  // To make HTTP GET request
  getCall(req_url): Observable<any> {
    // make url
    const url = `${this.url}${req_url}`;
    // make request
    return this.http.get<any>(url);
  }


  onInit(data) {
    this.socket.emit('init', data);
  }

  public getOnInit = () => {
    return Observable.create((observer) => {
      this.socket.on('init', (data) => {
        observer.next(data);
      });
    });
  }


}
