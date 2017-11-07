import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {MyValidators} from '../common/validators/my.validators';
import {AuthService} from '../services/auth.service';
import {GlobalVariable} from '../global';
import {UserService} from '../services/user.service';
import {LoginValidationService} from '../services/login.validation.service';
import {EmailValidationService} from '../services/email-validation.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.css']
})
export class EditProfileFormComponent implements OnInit {
  form;
  img_url = 'assets/dummy_avatar.png';
  current_user: any;
  display_cross = false;
  mouseOvered = false;


  constructor(fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private loginValidationService: LoginValidationService,
              private emailValidationService: EmailValidationService,
              private router: Router) {
    this.current_user = this.authService.currentUser;

    if (this.current_user.avatar_url)
      this.img_url = GlobalVariable.FLASK_API_URL + this.current_user.avatar_url;

    this.form = fb.group({
      avatar64: [null],
      login: [this.current_user.login, [
        Validators.required,
        Validators.minLength(3),
        MyValidators.cannotContainSpecial,
        MyValidators.maxLenthReached
      ], [this.loginOccupied.bind(this)]],
      first_name: [this.current_user.first_name, [
        Validators.required,
        Validators.minLength(2),
        MyValidators.onlyLetters
      ]],
      last_name: [this.current_user.last_name, [
        Validators.required,
        Validators.minLength(2),
        MyValidators.onlyLetters
      ]],
      email: [this.current_user.email, [MyValidators.myEmail],
        [this.emailOccupied.bind(this)]
      ],
      passwd: ['', []],
      confirm_passwd: ['', []]
    }, {validator: MyValidators.confirmPassword});
  }

  ngOnInit() {
    if (this.authService.currentUser.avatar_url)
      this.display_cross = true;
  }

  updateProfile() {
    let resource = this.initResource(this.authService.currentUser.user_id,
      this.form.value);
    this.userService.update(resource)
      .subscribe(response => {
        localStorage.setItem('token', response['token']);
      });
  }

  deleteAccount() {
    if (confirm('Delete your account, really?')) {
      this.userService.delete(this.authService.currentUser.user_id)
        .subscribe(response => {
          this.authService.logout();
          this.router.navigate(['/']);
        });
    }
  }

  loginOccupied(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(((resolve, reject) => {
      this.loginValidationService.readOne(control.value)
        .subscribe(response => {
          if (response['user_exists'] === true &&
            this.login.value != this.authService.currentUser.login) {
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
          if (response['email_exists'] &&
            this.email.value != this.authService.currentUser.email)
            resolve({emailOccupied: true});
          resolve(null);
        });
    }));
  }

  initResource(user_id, formValues) {
    return {
      user_id: user_id,
      login: formValues.login,
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      avatar64: formValues.avatar64,
      email: formValues.email,
      passwd: (formValues.passwd != '') ? formValues.passwd : null,
    };
  }

  delPhoto() {
    this.avatar64 = 'del';
    this.img_url = 'assets/dummy_avatar.png';
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

  uploadPhoto(fileInput: any) {
    fileInput.click();
  }

  get login() {
    return this.form.get('login');
  }

  set avatar64(param) {
    this.form.patchValue({'avatar64': param});
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
