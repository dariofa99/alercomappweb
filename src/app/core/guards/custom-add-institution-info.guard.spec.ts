import { TestBed } from '@angular/core/testing';

import { CustomAddInstitutionInfoGuard } from './custom-add-institution-info.guard';

describe('CustomAddInstitutionInfoGuard', () => {
  let guard: CustomAddInstitutionInfoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddInstitutionInfoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
