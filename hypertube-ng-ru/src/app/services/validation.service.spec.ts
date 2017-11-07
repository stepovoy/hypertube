import { TestBed, inject } from '@angular/core/testing';

import { LoginValidationService } from './login.validation.service';

describe('LoginValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginValidationService]
    });
  });

  it('should be created', inject([LoginValidationService], (service: LoginValidationService) => {
    expect(service).toBeTruthy();
  }));
});
