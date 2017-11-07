import { Component, OnInit } from '@angular/core';
import {fade} from '../common/animations';
import {ResetService} from '../services/reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations: [
    fade
  ]
})
export class ResetPasswordComponent implements OnInit {

  invalidEmail = false;
  mailSent = false;

  constructor(private resetService: ResetService) { }

  ngOnInit() {
  }

  resetPasswd(email) {
    console.log(email.value);

    this.resetService.create({
      email: email.value
    }).subscribe(result => {
      this.mailSent = true;
    }, error => {
      this.invalidEmail = true;
    });
  }

}
