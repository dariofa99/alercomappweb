import { TestBed } from '@angular/core/testing';

import { CustomAdminAlertsGuard } from './custom-admin-alerts.guard';

describe('CustomAdminAlertsGuard', () => {
  let guard: CustomAdminAlertsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminAlertsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
