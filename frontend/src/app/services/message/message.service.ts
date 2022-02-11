import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  greetings: any = [];
  disabled = true;

  private stompClient: any;
  name: string | null = "";



  constructor() { }

  connect():any {
    const socket = new SockJS('http://' + environment.ip + ':8081/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, (frame: any) => {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/hi', (hello: any) => {
        _this.showGreeting(JSON.parse(hello.body));
      });
    });
    return this.stompClient;
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  showGreeting(message: any) {
    this.greetings.push(message);
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }
}
