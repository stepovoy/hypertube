import { TestBed, inject } from '@angular/core/testing';

import { EmailConfirmService } from './email-confirm.service';

describe('EmailConfirmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailConfirmService]
    });
  });

  it('should be created', inject([EmailConfirmService], (service: EmailConfirmService) => {
    expect(service).toBeTruthy();
  }));
});
