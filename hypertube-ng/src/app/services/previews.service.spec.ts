import { TestBed, inject } from '@angular/core/testing';

import { PreviewsService } from './previews.service';

describe('PreviewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviewsService]
    });
  });

  it('should be created', inject([PreviewsService], (service: PreviewsService) => {
    expect(service).toBeTruthy();
  }));
});
