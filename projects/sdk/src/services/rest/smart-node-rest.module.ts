import { NgModule } from '@angular/core';
import { SmartNodeNetworkModule } from '../network/smart-node-network.module';
import { SmartNodeRestService } from './smart-node-rest.service';

@NgModule({
  imports: [
    SmartNodeNetworkModule
  ],
  providers: [
    SmartNodeRestService
  ],
  exports: [],
})
export class SmartNodeRestModule { }
