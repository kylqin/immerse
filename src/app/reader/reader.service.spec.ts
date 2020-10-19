import { TestBed } from '@angular/core/testing';

import { ReaderService } from './reader.service';

describe('ReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReaderService = TestBed.get(ReaderService);
    expect(service).toBeTruthy();
  });
});
