import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {GlobalVariable} from '../global';
import {Http} from '@angular/http';
import {AuthService} from './auth.service';


@Injectable()
export class UserService extends DataService {

  constructor(http: Http,
              authService: AuthService) {
    super(http, authService);
    this.url = GlobalVariable.FLASK_API_URL + '/user';
  }
}
