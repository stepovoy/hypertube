import { TestBed, inject } from '@angular/core/testing';

import { LangRedirectService } from './lang-redirect.service';

describe('LangRedirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LangRedirectService]
    });
  });

  it('should be created', inject([LangRedirectService], (service: LangRedirectService) => {
    expect(service).toBeTruthy();
  }));
});
