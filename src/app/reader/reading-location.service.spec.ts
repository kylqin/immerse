import { TestBed } from '@angular/core/testing';

import { ReadingLocationService } from './reading-location.service';

describe('ReadingLocationService', () => {
  let service: ReadingLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
