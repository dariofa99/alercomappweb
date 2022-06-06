import { TestBed } from '@angular/core/testing';

import { CustomAdminUsersGuard } from './custom-admin-users.guard';

describe('CustomAdminUsersGuard', () => {
  let guard: CustomAdminUsersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminUsersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
