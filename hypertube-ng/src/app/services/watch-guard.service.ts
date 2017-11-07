import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class WatchGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (JSON.parse(localStorage.getItem('movie'))) return true;

    this.router.navigate(['/ooops']);
    return false;
  }
}
