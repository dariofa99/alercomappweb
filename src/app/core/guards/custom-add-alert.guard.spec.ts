import { TestBed } from '@angular/core/testing';

import { CustomAddAlertGuard } from './custom-add-alert.guard';

describe('CustomAddAlertGuard', () => {
  let guard: CustomAddAlertGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddAlertGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
