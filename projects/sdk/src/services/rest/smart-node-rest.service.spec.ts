import { TestBed } from '@angular/core/testing';

import { SmartNodeRestService } from './smart-node-rest.service';

describe('SmartNodeRestService', () => {
  let service: SmartNodeRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
