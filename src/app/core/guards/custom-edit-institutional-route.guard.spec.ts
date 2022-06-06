import { TestBed } from '@angular/core/testing';

import { CustomEditInstitutionalRouteGuard } from './custom-edit-institutional-route.guard';

describe('CustomEditInstitutionalRouteGuard', () => {
  let guard: CustomEditInstitutionalRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditInstitutionalRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
