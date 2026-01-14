// src/app/services/vacancy.spec.ts
import { TestBed } from '@angular/core/testing';

import { Vacancy } from './vacancy';

describe('Vacancy', () => {
  let service: Vacancy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vacancy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
