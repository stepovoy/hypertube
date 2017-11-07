import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailConfirmService} from '../services/email-confirm.service';
import {AuthService} from '../services/auth.service';
import {GlobalVariable} from '../global';
import {fade} from '../common/animations';


@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css'],
  animations: [
    fade
  ]
})
export class SignInPageComponent implements OnInit {

  notActivated = false;
  registered = false;
  confirmed = false;
  confirmed_api = false;
  accessDenied = false;
  token: string;
  login: string;
  invalidLogin = false;
  private oAuth42_url = 'https://api.intra.42.fr/oauth/authorize';
  private oAuthGoogle_url = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(private route: ActivatedRoute,
              private emailConfirmService: EmailConfirmService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    let queryParams = this.route.snapshot.queryParamMap;
    this.registered = ('true' === queryParams.get('registered'));
    this.confirmed = ('true' === queryParams.get('confirmed'));
    this.token = queryParams.get('token');
    this.login = queryParams.get('login');
    this.accessDenied = ('true' === queryParams.get('denied'));
    if (this.confirmed) {
      this.emailConfirmService.readOne(this.login + '/' + this.token)
        .subscribe(response => {
          if (response['confirmed'] == true) {
            this.confirmed_api = true;
          }
        });
    }
  }

  signIn(credentials) {
    this.authService.login(credentials).subscribe(
      response => {
        localStorage.setItem('token', response['token']);
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/']);
      },
      error => {
        if (error.status === 400) {
          this.invalidLogin = true;
        } else if (error.status === 401) {
          this.notActivated= true;
        } else {
          throw new error();
        }
      });
  }

  encodeQueryParams(obj: Object): string {
    let str = '';
    for (var key in obj) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
  }

  oAuth42() {
    let queryString: string;
    let queryParams = {
      client_id: '135caaea196569df717378f2950cfb4833e1a936d8c3c4a5f56f57fbec6935a4',
      redirect_uri: GlobalVariable.CURRENT + '/oauth42',
      scope: 'public',
      response_type: 'code'
    };
    queryString = this.encodeQueryParams(queryParams);
    window.location.href = this.oAuth42_url + '?' + queryString;
  }

  oAuthGoogle() {
    let queryString: string;
    let queryParams = {
      client_id: '248773064708-bqnk5a6iq0lsa274bdcf5ije21lmqi5p.apps.googleusercontent.com',
      redirect_uri: "http://" + window.location.hostname + ':4300/oauth-google',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      access_type: 'online',
      response_type: 'code'
    };

    queryString = this.encodeQueryParams(queryParams);
    window.location.href = this.oAuthGoogle_url + '?' + queryString;
  }
}
