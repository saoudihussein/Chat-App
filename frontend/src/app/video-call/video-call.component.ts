import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';




const MESSAGE_TYPE = {
  SDP: 'SDP',
  CANDIDATE: 'CANDIDATE',
};

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

  @ViewChild('video1', { static: true })
  video1!: ElementRef<HTMLVideoElement>;
  @ViewChild('video2', { static: true })
  video2!: ElementRef<HTMLVideoElement>;
  peerConnection: any;
  signaling: any;
  senders: any = [];
  userMediaStream: any;
  disabled: boolean = true;
  connected: boolean = false;
  micSetti: boolean = true;
  vidSetti: boolean = true;
  showChatDiv: boolean = false;
  showChat: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.startChat()
  }

  async startChat() {
    // try {
    //   this.userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    //   var user = Math.round(Math.random() * 1000) + ""
    //   this.signaling = new WebSocket('ws://' + environment.ip + ':8081/msgServer/' + user);
    //   this.peerConnection = this.createPeerConnection();
    //   this.connected = true;

    //   this.addMessageHandler();


    //   this.userMediaStream.getTracks().forEach((track: any) => this.senders.push(this.peerConnection.addTrack(track, this.userMediaStream)));
    //   this.video1.nativeElement.srcObject = this.userMediaStream;
    //   this.video1.nativeElement.muted = true

    // }
    // catch (err) {
    //   console.error(err);
    // }

    try {
      this.userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      this.signaling = new WebSocket('ws://'+ environment.ip +':8081/signal');
      this.peerConnection = this.createPeerConnection();
      this.connected = true;

      this.addMessageHandler();


      this.userMediaStream.getTracks().forEach((track: any) => this.senders.push(this.peerConnection.addTrack(track, this.userMediaStream)));
      this.video1.nativeElement.srcObject = this.userMediaStream;
      this.video1.nativeElement.muted = true

    }
    catch (err) {
      console.error(err);
    }
  }

  micSett(sett: string) {
    this.userMediaStream.getAudioTracks().forEach((track: any) => track.enabled = !track.enabled);
    if (sett == "disable") {
      this.micSetti = false
    } else if (sett == "enable") {
      this.micSetti = true
    }
  }

  vidSett(sett: string) {
    this.userMediaStream.getVideoTracks().forEach((track: any) => track.enabled = !track.enabled);
    if (sett == "disable") {
      this.vidSetti = false
    } else if (sett == "enable") {
      this.vidSetti = true
    }
  }

  createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: []
    });

    pc.onnegotiationneeded = async () => {
      await this.createAndSendOffer();
    };

    pc.onicecandidate = (iceEvent) => {
      if (iceEvent && iceEvent.candidate) {
        this.sendMessage({
          message_type: MESSAGE_TYPE.CANDIDATE,
          content: iceEvent.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const _video2 = this.video2.nativeElement;
      _video2.srcObject = event.streams[0];
      _video2.srcObject = event.streams[0];
      this.showChat = true;
    };

    return pc;
  }

  addMessageHandler() {
    this.signaling.onmessage = async (message: { data: string; }) => {
      const data = JSON.parse(message.data);
      if (!data) {
        return;
      }

      const { message_type, content } = data;

      try {
        if (message_type === MESSAGE_TYPE.CANDIDATE && content) {
          await this.peerConnection.addIceCandidate(content);
        }
        else if (message_type === MESSAGE_TYPE.SDP) {
          if (content.type === 'offer') {
            await this.peerConnection.setRemoteDescription(content);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.sendMessage({
              message_type: MESSAGE_TYPE.SDP,
              content: answer,
            });
          }
          else if (content.type === 'answer') {
            await this.peerConnection.setRemoteDescription(content);
          }
          else {
            console.log('unsupported SDP type.');
          }
        }
      }
      catch (err) {
        console.error(err);
      }
    };
  }

  async createAndSendOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.sendMessage({
      message_type: MESSAGE_TYPE.SDP,
      content: offer,
    });
  }

  sendMessage(message: { message_type: string; content: any; }) {
    this.signaling.send(JSON.stringify({
      ...message,
    }));
  }
  async endCall() {
    this.userMediaStream.getTracks().forEach((track: { stop: () => void; }) => {
      track.stop();
      this.connected = false;
      this.video1.nativeElement.srcObject = null;
      this.video2.nativeElement.srcObject = null;
      this.signaling.close()
      console.clear()
      localStorage.removeItem("username");
      this.router.navigateByUrl('/join');
    });
  }
  showChatBox(show: boolean) {
    this.showChat = show;
  }


}