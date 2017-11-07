import {Component, EventEmitter, ViewChild} from '@angular/core';
import {Validators, FormBuilder, AbstractControl, ValidationErrors} from '@angular/forms';
import {MyValidators} from '../common/validators/my.validators';
import {LoginValidationService} from '../services/login.validation.service';
import {EmailValidationService} from '../services/email-validation.service';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent {
  form;
  img_url = 'assets/dummy_avatar.png';

  constructor(fb: FormBuilder,
              private loginValidationService: LoginValidationService,
              private emailValidationService: EmailValidationService,
              private userService: UserService,
              private router: Router) {

    this.form = fb.group({
      avatar64: [null],
      login: ['',
        [Validators.required,
          Validators.minLength(3),
          MyValidators.cannotContainSpecial,
          MyValidators.maxLenthReached],
        [this.loginOccupied.bind(this)]
      ],
      first_name: ['',
        [Validators.required,
          Validators.minLength(2),
          MyValidators.onlyLetters]],
      last_name: ['',
        [Validators.required,
          Validators.minLength(2),
          MyValidators.onlyLetters]
      ],
      email: ['',
        [MyValidators.myEmail],
        [this.emailOccupied.bind(this)]
      ],
      passwd: ['', [MyValidators.myPassword]],
      confirm_passwd: ['', [Validators.required]],
    }, {validator: MyValidators.confirmPassword});
  }

  register() {
    this.userService.create(this.form.value)
      .subscribe(response => {
        this.router.navigate(['/sign-in'], {
          queryParams: {registered: true}
        });
      },
      error => {
        if (error.status === 409) {
          this.form.setErrors({userExists: true});
        } else {
          throw new error;
        }
      });
  }


  loginOccupied(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(((resolve, reject) => {
      this.loginValidationService.readOne(control.value)
        .subscribe(response => {
          if (response['user_exists'] === true) {
            resolve({loginOccupied: true});
          }
          resolve(null);
        });
    }));
  }

  emailOccupied(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(((resolve, reject) => {
      this.emailValidationService.readOne(control.value)
        .subscribe(response => {
          if (response['email_exists'])
            resolve({emailOccupied: true});
          resolve(null);
        });
    }));
  }

  uploadPhoto(fileInput: any) {
    fileInput.click();
  }

  @ViewChild('fileInput') fileInput;

  fileInputChanged(event) {
    let file = event.srcElement.files[0];
    let filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onloadend = (e) => {
      this.form.patchValue({'avatar64': filereader.result});
      this.img_url = filereader.result;
    };
  }

  get avatar64() {
    return this.form.get('avatar64');
  }

  get login() {
    return this.form.get('login');
  }

  get first_name() {
    return this.form.get('first_name');
  }

  get last_name() {
    return this.form.get('last_name');
  }

  get email() {
    return this.form.get('email');
  }

  get passwd() {
    return this.form.get('passwd');
  }

  get confirm_passwd() {
    return this.form.get('confirm_passwd');
  }
}
