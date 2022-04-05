import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }
  requestPermission() {
    return this.angularFireMessaging.requestToken;
  }

  setToken(token) {
    localStorage.setItem('device_token', token)
  }

  getToken() {
    return localStorage.getItem('device_token');
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        this.currentMessage.next(payload);
      })
  }
}
