import { ModuleWithProviders, NgModule } from '@angular/core';
import { SmartNodeHashPackModule } from '../services/hashpack/smart-node-hashpack.module';
import { SmartNodeHederaModule } from '../services/hedera/smart-node-hedera.module';
import { SmartNodeNetworkModule } from '../services/network/smart-node-network.module';
import { SmartNodeRestModule } from '../services/rest/smart-node-rest.module';
import { SmartNodeSocketsModule } from '../services/sockets/smart-node-sockets.module';
import { SmartNodeSdkService } from './smart-node-sdk.service';

@NgModule({
  imports: [
    SmartNodeRestModule,
    SmartNodeNetworkModule,
    SmartNodeSocketsModule,
    SmartNodeHashPackModule,
    SmartNodeHederaModule
  ],
  exports: []
})
export class SmartNodeSdkModule {
  static forRoot(options: any): ModuleWithProviders<SmartNodeSdkModule> {
    return {
      ngModule: SmartNodeSdkModule,
      providers: [
        {
          provide: 'options',
          useValue: options,
        },
        SmartNodeSdkService
      ]
    }
  }
}
