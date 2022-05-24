import { TestBed } from '@angular/core/testing';

import { EventypesService } from './eventypes.service';

describe('EventypesService', () => {
  let service: EventypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
