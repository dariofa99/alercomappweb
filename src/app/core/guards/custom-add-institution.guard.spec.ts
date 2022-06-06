import { TestBed } from '@angular/core/testing';

import { CustomAddInstitutionGuard } from './custom-add-institution.guard';

describe('CustomAddInstitutionGuard', () => {
  let guard: CustomAddInstitutionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddInstitutionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
