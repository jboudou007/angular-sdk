import { TestBed } from '@angular/core/testing';
import { SmartNodeHashPackService } from './smart-node-hashpack.service';



describe('SmartNodeHashPackService', () => {
  let service: SmartNodeHashPackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartNodeHashPackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
