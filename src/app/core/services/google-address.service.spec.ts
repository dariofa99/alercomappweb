import { TestBed } from '@angular/core/testing';

import { GoogleAddressService } from './google-address.service';

describe('GoogleAdressServiceService', () => {
  let service: GoogleAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
