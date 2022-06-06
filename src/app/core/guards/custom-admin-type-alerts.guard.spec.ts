import { TestBed } from '@angular/core/testing';

import { CustomAdminTypeAlertsGuard } from './custom-admin-type-alerts.guard';

describe('CustomAdminTypeAlertsGuard', () => {
  let guard: CustomAdminTypeAlertsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminTypeAlertsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
