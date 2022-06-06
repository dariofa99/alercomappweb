import { TestBed } from '@angular/core/testing';

import { CustomAdminRolesGuard } from './custom-admin-roles.guard';

describe('CustomAdminRolesGuard', () => {
  let guard: CustomAdminRolesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminRolesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
