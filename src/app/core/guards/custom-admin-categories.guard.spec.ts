import { TestBed } from '@angular/core/testing';

import { CustomAdminCategoriesGuard } from './custom-admin-categories.guard';

describe('CustomAdminCategoriesGuard', () => {
  let guard: CustomAdminCategoriesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAdminCategoriesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
