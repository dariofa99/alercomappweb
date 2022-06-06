import { TestBed } from '@angular/core/testing';

import { CustomAddUserGuard } from './custom-add-user.guard';

describe('CustomAddUserGuard', () => {
  let guard: CustomAddUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
