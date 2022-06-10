import { TestBed } from '@angular/core/testing';

import { CustomEditAlertGuard } from './custom-edit-alert.guard';

describe('CustomEditAlertGuard', () => {
  let guard: CustomEditAlertGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditAlertGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
