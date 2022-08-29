import { TestBed } from '@angular/core/testing';

import { SmartNodeSdkService } from './smart-node-sdk.service';

describe('SmartNodeSdkService', () => {
  let service: SmartNodeSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
