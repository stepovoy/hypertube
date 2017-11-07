import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {Http} from '@angular/http';
import {GlobalVariable} from '../global';
import {AuthService} from './auth.service';

@Injectable()
export class CommentsService extends DataService {

  constructor(http: Http,
              authService: AuthService) {
    super(http, authService);
    this.url = GlobalVariable.FLASK_API_URL + '/comments';
  }

}
