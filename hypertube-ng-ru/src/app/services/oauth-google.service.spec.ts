import { TestBed, inject } from '@angular/core/testing';

import { OauthGoogleService } from './oauth-google.service';

describe('OauthGoogleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OauthGoogleService]
    });
  });

  it('should be created', inject([OauthGoogleService], (service: OauthGoogleService) => {
    expect(service).toBeTruthy();
  }));
});
