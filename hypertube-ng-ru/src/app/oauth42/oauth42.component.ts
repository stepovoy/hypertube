import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Oauth42Service} from '../services/oauth42.service';
import {fade} from '../common/animations';
import {GlobalVariable} from '../global';

@Component({
  selector: 'app-oauth42',
  templateUrl: './oauth42.component.html',
  styleUrls: ['./oauth42.component.css'],
  animations: [
    fade
  ]
})
export class Oauth42Component implements OnInit {

  private code: string;
  public status = 'Authenticating 42 user...';
  public pending = true;

  constructor(private route: ActivatedRoute,
              private oauth42Service: Oauth42Service,
              private router: Router) {}

  ngOnInit() {
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.oauth42Service.create({code: this.code,
                                redirect_uri: GlobalVariable.CURRENT + '/oauth42'})
      .subscribe(response => {
        if (response['token']) {
          localStorage.setItem('token', response['token']);
          this.router.navigate(['/']);
        } else {
          this.status = 'Unauthorized(';
          this.pending = false;
        }
      }, error => {
          this.status = 'Unauthorized(';
          this.pending = false;
      });
  }
}
