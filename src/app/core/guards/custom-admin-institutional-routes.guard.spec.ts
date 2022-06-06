import { TestBed } from '@angular/core/testing';

import { CustomAdminInstitutionalRoutesGuard } from './custom-admin-institutional-routes.guard';

describe('CustomAdminInstitutionalRoutesGuard', () => {
  let guard: CustomAdminInstitutionalRoutesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminInstitutionalRoutesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
