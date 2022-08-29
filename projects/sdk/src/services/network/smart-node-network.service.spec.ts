import { TestBed } from '@angular/core/testing';

import { SmartNodeNetworkService } from './smart-node-network.service';

describe('SmartNodeNetworkService', () => {
  let service: SmartNodeNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
