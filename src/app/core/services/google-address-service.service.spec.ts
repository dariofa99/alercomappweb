import { TestBed } from '@angular/core/testing';

import { GoogleAddressServiceService } from './google-address-service.service';

describe('GoogleAdressServiceService', () => {
  let service: GoogleAddressServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAddressServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
