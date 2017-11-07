import { TestBed, inject } from '@angular/core/testing';

import { EmailValidationService } from './email-validation.service';

describe('EmailValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailValidationService]
    });
  });

  it('should be created', inject([EmailValidationService], (service: EmailValidationService) => {
    expect(service).toBeTruthy();
  }));
});
