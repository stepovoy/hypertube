import { TestBed, inject } from '@angular/core/testing';

import { SearchProgressService } from './search-progress.service';

describe('SearchProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchProgressService]
    });
  });

  it('should be created', inject([SearchProgressService], (service: SearchProgressService) => {
    expect(service).toBeTruthy();
  }));
});
