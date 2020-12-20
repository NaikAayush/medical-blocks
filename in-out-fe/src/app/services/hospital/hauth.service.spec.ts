import { TestBed } from '@angular/core/testing';

import { HauthService } from './hauth.service';

describe('HauthService', () => {
  let service: HauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
