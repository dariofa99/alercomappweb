import { TestBed } from '@angular/core/testing';

import { InstitutionalRoutesService } from './institutional-routes.service';

describe('InstitutionalRoutesService', () => {
  let service: InstitutionalRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionalRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
