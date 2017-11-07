import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {DataService} from './data.service';
import {GlobalVariable} from '../global';
import {AuthService} from './auth.service';

@Injectable()
export class WatchedMoviesService extends DataService {

  constructor(http: Http,
              authService: AuthService) {
    super(http, authService);
    this.url = GlobalVariable.FLASK_API_URL + '/watched_movies';
  }

}
