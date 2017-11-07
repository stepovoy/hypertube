import {Component, HostListener, OnInit} from '@angular/core';
import {PreviewsService} from '../services/previews.service';
import {isUndefined} from 'util';
import {ActivatedRoute, Router} from '@angular/router';
import {fade} from '../common/animations';
import {WatchedMoviesService} from '../services/watched-movies.service';
import {JwtHelper} from 'angular2-jwt';
import {SearchProgressService} from '../services/search-progress.service';


@Component({
  selector: 'app-gallery-preview',
  templateUrl: './gallery-preview.component.html',
  styleUrls: ['./gallery-preview.component.css'],
  animations: [
    fade
  ]
})
export class GalleryPreviewComponent implements OnInit {

  public previews: any[] = [];
  public previews_backup: any[] = [];
  public watched_movies: any[] = [];
  public searchword = 'null';
  public previousSearchword = 'null';
  private per_page = 1;
  public more_results_disabled = false;
  private current_user: any;

  private initiated = false;

  private from = 0;

  constructor(private preview_service: PreviewsService,
              private route: ActivatedRoute,
              private watchedMoviesService: WatchedMoviesService,
              public searchProgressService: SearchProgressService) {
  }


  ngOnInit() {
    this.searchProgressService.showLoader();
    this.searchProgressService.hideNoResults();

    this.route.queryParamMap.subscribe(params => {
      this.searchword = params.get('searchWord');
      this.more_results_disabled = false;
      if (this.previousSearchword !== this.searchword) this.from = 0;
      let uri_prefix: string;
      uri_prefix = this.searchword + '/0/';
      this.preview_service.readOne(uri_prefix + this.per_page)
        .subscribe(response => {
          this.previews = JSON.parse(response['res']);
          this.previousSearchword = this.searchword;
          this.from += 1;
          this.previews = this.previews.filter(this.nullFilter);
          if (this.previews.length == 0) {
            this.searchProgressService.showNoResults();
          }
          this.previews.sort(this.comp_title_asc);
          this.previews_backup = this.previews;
          this.searchProgressService.hideLoader();
          this.initiated = true;
        });
    });


    let token = localStorage.getItem('token');
    if (token) {
      let jwtHelper = new JwtHelper();
      this.current_user = jwtHelper.decodeToken(token);

      this.watchedMoviesService.readOne(this.current_user.user_id)
        .subscribe(result => {
          this.watched_movies = result;
        });
    }
  }

  nullFilter(value) {
    if (value) return true;
    return false;
  }

  movieIsSeen(movie_id) {
    return this.watched_movies.indexOf(movie_id) != -1;
  }

  onInViewportChange(inViewport: boolean) {
    if (inViewport) {
      if (this.initiated)
        this.getMore();
    }
  }

  getMore() {
    this.searchProgressService.showLoader();
    this.searchProgressService.hideNoResults();
    if (this.previousSearchword !== this.searchword) this.from = 0;
    let to = this.from + this.per_page;

    this.preview_service.readOne(this.searchword + '/' + this.from + '/' + to)
      .subscribe(response => {
        let search_results = JSON.parse(response['res']);
        this.from += 1;
        this.previousSearchword = this.searchword;
        search_results = search_results.filter(this.nullFilter);
        if (search_results.length == 0) {
          this.searchProgressService.showNoResults();
        }
        search_results.sort(this.comp_title_asc);
        this.previews = this.previews.concat(search_results);
        this.previews_backup = this.previews.concat(search_results);
        if (search_results.length == 0) {
          this.more_results_disabled = true;
        }
        this.searchProgressService.hideLoader();
      });
  }

  sort(param, order) {
    if (param === 'title') {
      if (order)
        this.previews.sort(this.comp_title_asc);
      else
        this.previews.sort(this.comp_title_dec);
    } else if (param === 'genre') {
      if (order)
        this.previews.sort(this.comp_genre_asc);
      else
        this.previews.sort(this.comp_genre_dec);
    } else if (param === 'rating') {
      if (order)
        this.previews.sort(this.comp_rating_asc);
      else
        this.previews.sort(this.comp_rating_dec);
    } else if (param === 'year') {
      if (order)
        this.previews.sort(this.comp_year_asc);
      else
        this.previews.sort(this.comp_year_dec);
    }
  }

  apply_filter(title,
               genre,
               rating_from,
               rating_to,
               year_from,
               year_to) {
    this.previews = this.previews_backup;
    if (!isUndefined(title) && title !== '') {
      this.previews = this.previews_backup.filter(item => item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1);
    }
    if (!isUndefined(genre) && genre !== '') {
      this.previews = this.previews.filter(item => item.genre.toLowerCase().indexOf(genre.toLowerCase()) !== -1);
    }
    if (!isUndefined(rating_from) && rating_from !== '') {
      let n = parseInt(rating_from);
      this.previews = this.previews.filter(item => item.rating >= n);
    }
    if (!isUndefined(rating_to) && rating_to !== '') {
      let n = parseInt(rating_to);
      this.previews = this.previews.filter(item => item.rating <= n);
    }
    if (!isUndefined(year_from) && year_from !== '') {
      let n = parseInt(year_from);
      this.previews = this.previews.filter(item => item.year >= n);
    }
    if (!isUndefined(year_to) && year_to !== '') {
      let n = parseInt(year_to);
      this.previews = this.previews.filter(item => item.year <= n);
    }
  }

  reset_filters() {
    this.previews = this.previews_backup;
  }

  comp_title_asc(param1, param2) {
    if (param1.title < param2.title)
      return -1;
    else if (param1.title > param2.title)
      return 1;
    else
      return 0;
  }

  comp_title_dec(param1, param2) {
    if (param1.title > param2.title)
      return -1;
    else if (param1.title < param2.title)
      return 1;
    else
      return 0;
  }

  comp_genre_asc(param1, param2) {
    if (param1.genre < param2.genre)
      return -1;
    else if (param1.genre > param2.genre)
      return 1;
    else
      return 0;
  }

  comp_genre_dec(param1, param2) {
    if (param1.genre > param2.genre)
      return -1;
    else if (param1.genre < param2.genre)
      return 1;
    else
      return 0;
  }

  comp_rating_asc(param1, param2) {
    if (param1.rating < param2.rating)
      return -1;
    else if (param1.rating > param2.rating)
      return 1;
    else
      return 0;
  }

  comp_rating_dec(param1, param2) {
    if (param1.rating > param2.rating)
      return -1;
    else if (param1.rating < param2.rating)
      return 1;
    else
      return 0;
  }

  comp_year_asc(param1, param2) {
    if (param1.year < param2.year)
      return -1;
    else if (param1.year > param2.year)
      return 1;
    else
      return 0;
  }

  comp_year_dec(param1, param2) {
    if (param1.year > param2.year)
      return -1;
    else if (param1.year < param2.year)
      return 1;
    else
      return 0;
  }
}
