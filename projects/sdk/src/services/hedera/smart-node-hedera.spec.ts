import { TestBed } from '@angular/core/testing';

import { SmartNodeHederaService } from './smart-node-hedera.service';

describe('SmartNodeHederaService', () => {
  let service: SmartNodeHederaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeHederaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
