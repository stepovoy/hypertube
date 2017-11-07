import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {Http} from '@angular/http';
import {GlobalVariable} from '../global';

@Injectable()
export class WatchService extends DataService {

  constructor(http: Http) {
    super(http, null);
    this.url = GlobalVariable.NODE_API_URL + '/watch';
  }

}
