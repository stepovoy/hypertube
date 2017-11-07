import { Injectable } from '@angular/core';
import {GlobalVariable} from '../global';
import {AuthService} from './auth.service';

@Injectable()
export class LangRedirectService {

  public language = 'en';

  constructor(private authService: AuthService) { }

    setLang(lang) {
      this.language = lang;
    }

    redirectToLang() {
    if (document.documentElement.lang === 'en' && this.language === 'ru') {
      GlobalVariable.CURRENT = GlobalVariable.ANGULAR_RU;
      if (this.authService.isLoggedIn()) this.authService.logout();
      window.location.assign(GlobalVariable.ANGULAR_RU);
    } else if (document.documentElement.lang === 'ru' && this.language === 'en') {
      GlobalVariable.CURRENT = GlobalVariable.ANGULAR_EN;
      if (this.authService.isLoggedIn()) this.authService.logout();
      window.location.assign(GlobalVariable.ANGULAR_EN);
    }
  }
}
