import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmartNodeHashPackService } from '../services/hashpack/smart-node-hashpack.service';
import { SmartNodeHederaService } from '../services/hedera/smart-node-hedera.service';
import { SmartNodeNetworkService } from '../services/network/smart-node-network.service';
import { SmartNodeRestService } from '../services/rest/smart-node-rest.service';
import { SmartNodeSocketsService } from '../services/sockets/smart-node-sockets.service';
import * as lodash from 'lodash';
import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeSdkService {
  private eventsObserver = new Subject<any>();
  private eventsObservable = this.eventsObserver.asObservable();
  private hashpackWallet = null;
  
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService,
    private smartNodeRestService: SmartNodeRestService,
    private smartNodeSocketsService: SmartNodeSocketsService,
    private smartNodeHashPackService: SmartNodeHashPackService,
    private smartNodeHederaService: SmartNodeHederaService,
    @Inject('network') private network: 'mainnet' | 'testnet' | 'local',
    @Inject('node') private node: string
  ) {
    // initializing the HSuite Network from the code-nodes...
    this.smartNodeNetworkService.setNetwork(this.network, this.node).then(async() => {
      console.log(`network has been initialized correctly, all new nodes have been fetched and ready to be used.`);

      try {
        let utilities = (await this.smartNodeRestService.getUtilities()).data;
        this.smartNodeHederaService.setUtilities(utilities);
        
        let hashconnectData = await this.smartNodeHashPackService.loadHashconnectData();
        this.hashpackWallet = lodash.get(hashconnectData.accountIds, 0);

        let message = await this._initSockets(hashconnectData);
        console.log(message);
        
        // subscribing to the nodeObserver, to monitor if a node goes down, and the service switches to a new one...
        this.smartNodeNetworkService.getNodeObserver().subscribe(async (node) => {
          let mainSocket = this.smartNodeSocketsService.getMainSocket();

          // if we received a notification, we check if the new node is different than the one used with the mainSocket...
          if(mainSocket && mainSocket.getNode().operator != node.operator) {
            // and we re-establish a secure connection by initializing an new auth session...
            await this.smartNodeSocketsService.initAuth(this.hashpackWallet, this.smartNodeNetworkService.getCurrentNode());
            await this.smartNodeSocketsService.authorizeWallet();
          }
        });          
      } catch(error) {
        console.error(error);
      }

      // subscribing to login/logout events...
      this.smartNodeHashPackService.observeHashpackConnection.subscribe(async (hashconnectData) => {
        try {
          let message = await this._initSockets(hashconnectData);
          this.hashpackWallet = lodash.get(hashconnectData.accountIds, 0);
          console.log(message);
        } catch(error) {
          console.error(error);
        }
      });

      // subscribing to websockets authentication events...
      this.smartNodeSocketsService.getSocketObserver().subscribe(async(event) => {
        switch(event.event) {
          case 'auth':
            await this.handleAuthEvent(event.content);
            break;
          case 'events':
            await this.handleGenericEvents(event.content);
            break;
          case 'errors':
            await this.handleErrors(event.content);     
            break;       
        }
      });
    }).catch(error => {
      throw new Error(error.message);
    });
  }

  getEventsObserver(): Observable<any> {
    return this.eventsObservable;
  }

  private async handleErrors(event: any): Promise<any> {
    this.eventsObserver.next(event);
  }

  private async handleGenericEvents(event: any): Promise<any> {
    this.eventsObserver.next(event);
  }

  private async handleAuthEvent(event: any): Promise<void> {
    switch(event.method) {
      case 'authentication':
        try {
          let authResponse = await this.smartNodeHashPackService.getAuthSession();

          if(!authResponse) {
            this.eventsObserver.next(event);

            let signedData = {
              signature: new Uint8Array(event.data.authResponse.signedData.signature),
              serverSigningAccount: event.data.authResponse.signedData.serverSigningAccount
            };

            authResponse = await this.smartNodeHashPackService.authenticateWallet(
              event.data.wallet,
              signedData,
              event.data.authResponse.payload
            );             
          }

          if (authResponse.success) {
            this.smartNodeSocketsService.getMainSocket().emit('authenticate', {
              signedData: authResponse,
              walletId: event.data.wallet
            });
          } else {
            this.eventsObserver.next({
              title: 'Authentication Failed',
              message: 'You need to authenticate your wallet in order to safely use the app.',
              method: 'error',
              mode: 'warning'
            });
          }
        } catch(error: any) {
          this.eventsObserver.next({
            title: 'Authentication Error',
            message: error.message,
            method: 'error',
            mode: 'danger'
          });
        }
        break;
      case 'authenticate':
        if(event.type == 'warning') {
          this.smartNodeHashPackService.clearAuthSession();
        }

        this.eventsObserver.next(event); 
      break;
    }    
  }

  private _initSockets(hashconnectData: any): Promise<string> {
   return new Promise(async(resolve, reject) => {
    try {
      await this.smartNodeSocketsService.init(
        this.smartNodeNetworkService.getCurrentNode(),
        hashconnectData,
        (await this.smartNodeNetworkService.getNetwork()).data
      );
      
      resolve("all sockets have been initialized correctly.");
    } catch(error) {
      reject(error);
    }     
   })
  }

  public getNetworkService(): SmartNodeNetworkService {
    return this.smartNodeNetworkService;
  }

  public getHashPackService(): SmartNodeHashPackService {
    return this.smartNodeHashPackService;
  }
  
  public getRestService(): SmartNodeRestService {
    return this.smartNodeRestService;
  }

  public getSocketsService(): SmartNodeSocketsService {
    return this.smartNodeSocketsService;
  }

  public getHederaService(): SmartNodeHederaService {
    return this.smartNodeHederaService;
  }
  // ---------------------------------------------

  /**
   * ----------------------------------------------
   * DEX
   * ----------------------------------------------
   */  
  async swapPool(
    senderId: string,
    swap: any
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.getSocketsService().getMainSocket().fromOneTimeEvent('swapPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.getSocketsService().getMainSocket().emit('swapPool', {
          type: 'swapPool',
          senderId: senderId,
          swap: swap
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async createPool(
    senderId: string,
    params: {
      baseToken: {
        id: string
      },
      swapToken: {
        id: string
      }
    }
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.getSocketsService().getMainSocket().fromOneTimeEvent('createPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.getSocketsService().getMainSocket().emit('createPool', {
          type: 'createPool',
          senderId: senderId,
          params: params
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  public async joinPool(
    senderId: string,
    poolWalletId: string,
    joinPool: {
      baseToken: {
        id: string,
        amount: Decimal,
        decimals: number
      },
      swapToken: {
        id: string,
        amount: Decimal,
        decimals: number
      }
    }
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.getSocketsService().getMainSocket().fromOneTimeEvent('joinPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.getSocketsService().getMainSocket().emit('joinPool', {
          type: 'swapPool',
          senderId: senderId,
          poolWalletId: poolWalletId,
          joinPool: joinPool
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  public async exitPool(
    senderId: string,
    poolWalletId: string,
    exitPool: {
      baseToken: {
        id: string,
        amount: Decimal,
        decimals: number
      },
      swapToken: {
        id: string,
        amount: Decimal,
        decimals: number
      }
    },
    serialNumber: number
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.getSocketsService().getMainSocket().fromOneTimeEvent('exitPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.getSocketsService().getMainSocket().emit('exitPool', {
          type: 'swapPool',
          senderId: senderId,
          poolWalletId: poolWalletId,
          exitPool: exitPool,
          serialNumber: serialNumber
        });
      } catch(error) {
        reject(error);
      }
    });
  }
  // ---------------------------------------------
}
