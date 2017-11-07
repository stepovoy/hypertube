import { Injectable } from '@angular/core';

@Injectable()
export class SearchProgressService {
  public search_pending = true;
  public no_more_results = false;

  constructor() {}

  showLoader() {
    this.search_pending = true;
  }

  hideLoader() {
    this.search_pending = false;
  }

  showNoResults() {
    this.no_more_results = true;
  }

  hideNoResults() {
    this.no_more_results = false;
  }
}
