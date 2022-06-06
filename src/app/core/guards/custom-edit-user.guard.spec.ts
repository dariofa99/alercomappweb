import { TestBed } from '@angular/core/testing';

import { CustomEditUserGuard } from './custom-edit-user.guard';

describe('CustomEditUserGuard', () => {
  let guard: CustomEditUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
