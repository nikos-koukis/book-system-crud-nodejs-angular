import { TestBed } from '@angular/core/testing';

import { BookExistsGuard } from './book-exists.guard';

describe('BookExistsGuard', () => {
  let guard: BookExistsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BookExistsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
