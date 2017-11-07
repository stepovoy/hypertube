import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MyValidators} from '../common/validators/my.validators';
import {ResetService} from '../services/reset.service';

@Component({
  selector: 'app-create-new-passwd',
  templateUrl: './create-new-passwd.component.html',
  styleUrls: ['./create-new-passwd.component.css']
})
export class CreateNewPasswdComponent implements OnInit {

  form;
  email;
  token;
  unauthorized = false;

  constructor(fb: FormBuilder,
              private resetService: ResetService,
              private router: Router,
              private route: ActivatedRoute) {
    this.form = fb.group({
      passwd: ['', [MyValidators.myPassword]]
    });
  }

  ngOnInit() {
    let queryParams = this.route.snapshot.queryParamMap;
    this.email = queryParams.get('email');
    this.token = queryParams.get('token');
  }


  updatePasswd() {
    this.resetService.update({
      user_id: this.email,
      token: this.token,
      passwd: this.passwd.value
    }).
      subscribe(result => {
        localStorage.setItem('token', result['token']);
        this.router.navigate(['/']);
    }, error => {
        this.unauthorized = true;
    });
  }

  get passwd() {
    return this.form.get('passwd');
  }

}
