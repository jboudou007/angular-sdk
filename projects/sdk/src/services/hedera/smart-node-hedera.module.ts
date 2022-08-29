import { NgModule } from '@angular/core';
import { SmartNodeHashPackModule } from '../hashpack/smart-node-hashpack.module';
import { SmartNodeRestModule } from '../rest/smart-node-rest.module';
import { SmartNodeHederaService } from './smart-node-hedera.service';

@NgModule({
  imports: [
    SmartNodeHashPackModule,
    SmartNodeRestModule
  ],
  providers: [
    SmartNodeHederaService
  ],
  exports: [],
})
export class SmartNodeHederaModule { }
