import { TestBed } from '@angular/core/testing';

import { CustomAdminInstitutionsGuard } from './custom-admin-institutions.guard';

describe('CustomAdminInstitutionsGuard', () => {
  let guard: CustomAdminInstitutionsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminInstitutionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
