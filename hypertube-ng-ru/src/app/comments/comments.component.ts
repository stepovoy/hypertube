import {Component, OnInit} from '@angular/core';
import {CommentsService} from '../services/comments.service';
import {GlobalVariable} from '../global';
import {JwtHelper} from 'angular2-jwt';
import {ActivatedRoute} from '@angular/router';
import {expandCollapse} from '../common/animations';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  animations: [
    expandCollapse
  ]
})
export class CommentsComponent implements OnInit {

  public showComments = true;
  comments: any[] = [];
  server_path = GlobalVariable.FLASK_API_URL;
  private current_user: any;
  private movie_id: number;

  constructor(private commentsService: CommentsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.
      subscribe(result => {
        this.movie_id = result['params'].id;
    });
    this.commentsService.readOne(this.movie_id)
      .subscribe(result => {
        this.comments = result.comments;
      });
    let token = localStorage.getItem('token');
    let jwtHelper = new JwtHelper();
    this.current_user = jwtHelper.decodeToken(token);
  }

  addComment(comment_input) {
    if (comment_input.value.match(/[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+/g)) {
      let comment = this.initComment(comment_input.value);
      this.comments.unshift(comment);
      this.commentsService.create({
        'movie_id': this.movie_id,
        'user_id': this.current_user.user_id,
        'msg': comment_input.value
      })
        .subscribe();
      comment_input.value = '';
    }
  }

  initComment(msg) {
    return new Object({
      'user_id': this.current_user.user_id,
      'movie_id': this.movie_id,
      'msg': msg,
      'date_time': Date.now() / 1000,
      'login': this.current_user.login,
      'avatar_url': this.current_user.avatar_url
    });
  }

  avatarUrl(comment) {
    if (comment.avatar_url) {
      return this.server_path + comment.avatar_url;
    } else {
      return '/assets/dummy_avatar.png';
    }
  }

  show_hide_comments() {
    return this.showComments = !this.showComments;
  }

}
