import { TestBed } from '@angular/core/testing';

import { CustomAddCategoryGuard } from './custom-add-category.guard';

describe('CustomAddCategoryGuard', () => {
  let guard: CustomAddCategoryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAddCategoryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
