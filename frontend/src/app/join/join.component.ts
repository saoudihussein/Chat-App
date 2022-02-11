import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  date = new Date();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  save(username: string) {
    localStorage.setItem("username", username);
    this.router.navigateByUrl('/video-call');
  }

}
