import { TestBed } from '@angular/core/testing';

import { CustomEditTypeAlertGuard } from './custom-edit-type-alert.guard';

describe('CustomEditTypeAlertGuard', () => {
  let guard: CustomEditTypeAlertGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditTypeAlertGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
