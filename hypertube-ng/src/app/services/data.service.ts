import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';
import {Headers} from  '@angular/http';

@Injectable()
export class DataService {

  url: string;

  constructor(private http: Http,
              private authService: AuthService) {
  }

  getOptions() {
    if (!this.authService || !this.authService.isLoggedIn())
      return new RequestOptions();

    let token = localStorage.getItem('token');

    let headers = new Headers();
    headers.append('Authorisation', token);
    return new RequestOptions({ headers: headers});
  }

  readAll() {
    return this.http.get(this.url, this.getOptions())
      .map(response => response.json())
      .catch(this.handleError);
  }

  readOne(id) {
    return this.http.get(this.url + '/' + id, this.getOptions())
      .map(responce => responce.json())
      .catch(this.handleError);
  }

  create(resource) {
    return this.http.post(this.url, resource, this.getOptions())
      .map(response => response.json())
      .catch(this.handleError);
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.user_id, resource, this.getOptions())
      .map(responce => responce.json())
      .catch(this.handleError);
  }

  delete(id) {
    return this.http.delete(this.url + '/' + id, this.getOptions())
      .map(responce => responce.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log('DATA IS SUPPER');
    return Observable.throw(new Error());
  }
}
