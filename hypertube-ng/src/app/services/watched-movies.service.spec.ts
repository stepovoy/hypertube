import { TestBed, inject } from '@angular/core/testing';

import { WatchedMoviesService } from './watched-movies.service';

describe('WatchedMoviesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchedMoviesService]
    });
  });

  it('should be created', inject([WatchedMoviesService], (service: WatchedMoviesService) => {
    expect(service).toBeTruthy();
  }));
});
