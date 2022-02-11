import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService {

  constructor(public router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem("username") == null) {
      this.router.navigate(['join']);
      return false;
    }
    return true;
  }
}