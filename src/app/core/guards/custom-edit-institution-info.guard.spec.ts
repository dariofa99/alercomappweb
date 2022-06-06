import { TestBed } from '@angular/core/testing';

import { CustomEditInstitutionInfoGuard } from './custom-edit-institution-info.guard';

describe('CustomEditInstitutionInfoGuard', () => {
  let guard: CustomEditInstitutionInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditInstitutionInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
