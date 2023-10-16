import { ModuleWithProviders, NgModule } from '@angular/core';
import { SmartNodeHashPackModule } from '../hashpack/smart-node-hashpack.module';
import { SmartNodeRestModule } from '../rest/smart-node-rest.module';
import { SmartNodeHederaService } from './smart-node-hedera.service';

@NgModule({
  imports: [
    SmartNodeHashPackModule,
    SmartNodeRestModule
  ],
  exports: [],
})
export class SmartNodeHederaModule {
  static forRoot(options: any): ModuleWithProviders<SmartNodeHederaModule> {
    return {
      ngModule: SmartNodeHederaModule,
      providers: [
        {
          provide: 'options',
          useValue: options,
        },
        SmartNodeHederaService
      ]
    }
  }
}
