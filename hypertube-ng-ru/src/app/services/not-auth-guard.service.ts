import { Injectable } from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class NotAuthGuardService implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) { }

  canActivate(route, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) return true;

    this.router.navigate(['/']);
    return false;
  }

}
