import { TestBed } from '@angular/core/testing';

import { CustomEditInstitutionGuard } from './custom-edit-institution.guard';

describe('CustomEditInstitutionGuard', () => {
  let guard: CustomEditInstitutionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditInstitutionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
