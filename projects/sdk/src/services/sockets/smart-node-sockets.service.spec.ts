import { TestBed } from '@angular/core/testing';

import { SmartNodeSocketsService } from './smart-node-sockets.service';

describe('SmartNodeSocketsService', () => {
  let service: SmartNodeSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeSocketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
