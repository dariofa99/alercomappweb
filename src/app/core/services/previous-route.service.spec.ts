import { TestBed } from '@angular/core/testing';

import { PreviousRouteService } from './previous-route.service';

describe('PreviousRouteServiceService', () => {
  let service: PreviousRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
