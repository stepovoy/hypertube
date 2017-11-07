import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {GlobalVariable} from '../global';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';


@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  login(credentials) {
    return this.http.post(GlobalVariable.FLASK_API_URL + '/auth',
      credentials)
      .map(response => response.json());
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  get currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return null;

    let decodedToken = new JwtHelper().decodeToken(token);
    return decodedToken;
  }
}
