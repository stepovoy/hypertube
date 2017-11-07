import { Component, OnInit } from '@angular/core';
import {fade} from '../common/animations';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css'],
  animations: [
    fade
  ]
})
export class SignUpPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
