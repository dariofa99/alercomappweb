import { TestBed } from '@angular/core/testing';

import { CustomEditCategoryGuard } from './custom-edit-category.guard';

describe('CustomEditCategoryGuard', () => {
  let guard: CustomEditCategoryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomEditCategoryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
