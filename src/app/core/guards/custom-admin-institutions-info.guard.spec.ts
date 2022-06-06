import { TestBed } from '@angular/core/testing';

import { CustomAdminInstitutionsInfoGuard } from './custom-admin-institutions-info.guard';

describe('CustomAdminInstitutionsInfoGuard', () => {
  let guard: CustomAdminInstitutionsInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminInstitutionsInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
