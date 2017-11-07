import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {LanguageService} from '../services/language.service';
import {SearchProgressService} from '../services/search-progress.service';
import {LangRedirectService} from '../services/lang-redirect.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public language = 'en';

  constructor(public authService: AuthService,
              private router: Router,
              private languageService: LanguageService,
              private searchProgressService: SearchProgressService,
              public langRedirectService: LangRedirectService) {
    this.language = langRedirectService.language;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.languageService.readOne(this.authService.currentUser.user_id)
        .subscribe(res => {
          this.langRedirectService.setLang(res.language);
          this.langRedirectService.redirectToLang();
        });
    }
  }

  setEn() {
    if (this.langRedirectService.language !== 'en') {

      if (this.authService.isLoggedIn()) {
        let resource = {
          user_id: this.authService.currentUser.user_id,
          language: 'en'
        };
        this.languageService.update(resource)
          .subscribe(res => {
            this.langRedirectService.setLang('en');
            this.langRedirectService.redirectToLang();
          });
      } else {
        this.langRedirectService.setLang('en');
        this.langRedirectService.redirectToLang();
      }
    }
  }

  setRu() {
    if (this.langRedirectService.language !== 'ru') {

      if (this.authService.isLoggedIn()) {
        let resource = {
          user_id: this.authService.currentUser.user_id,
          language: 'ru'
        };
        this.languageService.update(resource)
          .subscribe(res => {
            this.langRedirectService.setLang('ru');
            this.langRedirectService.redirectToLang();
          });
      } else {
        this.langRedirectService.setLang('ru');
        this.langRedirectService.redirectToLang();
      }
    }
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  search(searchBox) {
    let toSearch = searchBox.value;
    if (searchBox.value === '') toSearch = 'null';
    this.searchProgressService.showLoader();
    this.searchProgressService.hideNoResults();
    this.router.navigate(['/'],
      {queryParams: {searchWord: toSearch}});
    searchBox.value = '';
  }
}
