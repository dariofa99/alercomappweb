import { TestBed } from '@angular/core/testing';

import { CustomAddInstitutionalRouteGuard } from './custom-add-institutional-route.guard';

describe('CustomAddInstitutionalRouteGuard', () => {
  let guard: CustomAddInstitutionalRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddInstitutionalRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
