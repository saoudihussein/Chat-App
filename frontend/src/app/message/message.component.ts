import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | any;

  greetings: any = [];
  disabled = true;
  time: string = "";
  private stompClient: any;
  name: string | null = "";

  constructor() { }
  ngOnInit(): void {
    this.connect()
    this.scrollToBottom();
    this.name = localStorage.getItem("username");

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }
 
  connect() {
    const socket = new SockJS('http://' + environment.ip + ':8081/message');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, (frame: any) => {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/hi', (hello: any) => {
        _this.showGreeting(JSON.parse(hello.body));
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }



  showGreeting(message: any) {
    this.greetings.push(message);
  }

  onSubmit(f: NgForm) {
    this.stompClient.send(
      '/gkz/hello',
      {},
      JSON.stringify({ 'message': f.value.message, 'name': localStorage.getItem("username") })
    );
    f.reset()
  }
}
