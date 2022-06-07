import { TestBed } from '@angular/core/testing';

import { CustomAddEditPermissionGuard } from './custom-add-edit-permission.guard';

describe('CustomAddEditPermissionGuard', () => {
  let guard: CustomAddEditPermissionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddEditPermissionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
