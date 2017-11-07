import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user.service';
import {GlobalVariable} from '../global';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user_id;
  user = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(result => {
      this.user_id = result.get('id');

    });

    this.userService.readOne(this.user_id)
      .subscribe(result => {
        this.user = result;
        if (!this.user.avatar_url) this.user.avatar_url = '/assets/dummy_avatar.png';
        else this.user.avatar_url = GlobalVariable.FLASK_API_URL + this.user.avatar_url;
      });
  }
}

