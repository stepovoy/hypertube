import { TestBed, inject } from '@angular/core/testing';

import { WatchGuardService } from './watch-guard.service';

describe('WatchGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchGuardService]
    });
  });

  it('should be created', inject([WatchGuardService], (service: WatchGuardService) => {
    expect(service).toBeTruthy();
  }));
});
