import { TestBed } from '@angular/core/testing';

import { CustomAddEditRoleGuard } from './custom-add-edit-role.guard';

describe('CustomAddEditRoleGuard', () => {
  let guard: CustomAddEditRoleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddEditRoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
