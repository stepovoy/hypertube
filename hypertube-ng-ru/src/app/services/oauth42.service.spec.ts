import { TestBed, inject } from '@angular/core/testing';

import { Oauth42Service } from './oauth42.service';

describe('Oauth42Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Oauth42Service]
    });
  });

  it('should be created', inject([Oauth42Service], (service: Oauth42Service) => {
    expect(service).toBeTruthy();
  }));
});
