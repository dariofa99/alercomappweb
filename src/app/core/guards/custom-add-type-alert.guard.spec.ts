import { TestBed } from '@angular/core/testing';

import { CustomAddTypeAlertGuard } from './custom-add-type-alert.guard';

describe('CustomAddTypeAlertGuard', () => {
  let guard: CustomAddTypeAlertGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddTypeAlertGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
