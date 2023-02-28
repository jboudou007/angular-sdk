import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmartNodeHashPackService } from '../services/hashpack/smart-node-hashpack.service';
import { SmartNodeHederaService } from '../services/hedera/smart-node-hedera.service';
import { SmartNodeNetworkService } from '../services/network/smart-node-network.service';
import { SmartNodeRestService } from '../services/rest/smart-node-rest.service';
import { SmartNodeSocketsService } from '../services/sockets/smart-node-sockets.service';
import * as lodash from 'lodash';

/**
 * SmartNodeSdkService
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeSdkService {
  /**
   * Private property eventsObserver
   */
  private eventsObserver = new Subject<any>();

  /**
   * Private property eventsObservable
   */
  private eventsObservable = this.eventsObserver.asObservable();

  /**
   * Private property hashpackWallet
   */
  private hashpackWallet = null;

  /**
   * Constructor Method
   * @param {smartNodeNetworkService} smartNodeNetworkService
   * * @param {smartNodeRestService} smartNodeRestService
   * * @param {smartNodeSocketsService} smartNodeSocketsService
   * * @param {smartNodeHashPackService} smartNodeHashPackService
   * * @param {smartNodeNetworkService} smartNodeNetworkService
   * * @param {'mainnet' | 'testnet' | 'local'} network
   * * @param {string} node
   */
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
    this.smartNodeNetworkService.setNetwork(this.network, this.node).then(async () => {
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
          if (mainSocket && mainSocket.getNode().operator != node.operator) {
            // and we re-establish a secure connection by initializing an new auth session...
            await this.smartNodeSocketsService.initAuth(this.hashpackWallet, this.smartNodeNetworkService.getCurrentNode());
            await this.smartNodeSocketsService.authorizeWallet();
          }
        });
      } catch (error) {
        console.error(error);
      }

      // subscribing to login/logout events...
      this.smartNodeHashPackService.observeHashpackConnection.subscribe(async (hashconnectData) => {
        try {
          let message = await this._initSockets(hashconnectData);
          this.hashpackWallet = lodash.get(hashconnectData.accountIds, 0);
          console.log(message);
        } catch (error) {
          console.error(error);
        }
      });

      // subscribing to websockets authentication events...
      this.smartNodeSocketsService.getSocketObserver().subscribe(async (event) => {
        switch (event.event) {
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

  /**
   * Private method for error handling.
   * @param event
   * @returns Promise<any>
   */
  private async handleErrors(event: any): Promise<any> {
    this.eventsObserver.next(event);
  }

  /**
   * Private method for events handling.
   * @param event
   * @returns Promise<any>
   */
  private async handleGenericEvents(event: any): Promise<any> {
    this.eventsObserver.next(event);
  }

  /**
   * Private method for authentication handling.
   * @param event
   * @returns Promise<void>
   */
  private async handleAuthEvent(event: any): Promise<void> {
    switch (event.method) {
      case 'authentication':
        try {
          let authResponse = await this.smartNodeHashPackService.getAuthSession();

          if (!authResponse) {
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
        } catch (error: any) {
          this.eventsObserver.next({
            title: 'Authentication Error',
            message: error.message,
            method: 'error',
            mode: 'danger'
          });
        }
        break;
      case 'authenticate':
        if (event.type == 'warning') {
          this.smartNodeHashPackService.clearAuthSession();
        }

        this.eventsObserver.next(event);
        break;
    }
  }

  /**
   * Private method to initialize the websockets.
   * @param hashconnectData
   * @returns Promise<string>
   */
  private _initSockets(hashconnectData: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.smartNodeSocketsService.init(
          this.smartNodeNetworkService.getCurrentNode(),
          hashconnectData,
          (await this.smartNodeNetworkService.getNetwork()).data
        );

        resolve("all sockets have been initialized correctly.");
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * Retrieves the events observer, to subscribe to events from the SmartNode Network.
   * @returns Observable<any>
   */
  getEventsObserver(): Observable<any> {
    return this.eventsObservable;
  }

  /**
   * Retrieves Network Service, to interact with the SmartNode Network.
   * @returns SmartNodeNetworkService
   */
  public getNetworkService(): SmartNodeNetworkService {
    return this.smartNodeNetworkService;
  }

  /**
   * Retrieves HashPack Service, to interact with the SmartNode HashPack.
   * @returns SmartNodeHashPackService
   */
  public getHashPackService(): SmartNodeHashPackService {
    return this.smartNodeHashPackService;
  }

  /**
   * Retrieves the Rest Service, to interact with the SmartNode Rest API.
   * @returns SmartNodeRestService
   */
  public getRestService(): SmartNodeRestService {
    return this.smartNodeRestService;
  }

  /**
   * Retrieves the Sockets Service, to interact with the SmartNode Sockets API.
   * @returns SmartNodeSocketsService
   */
  public getSocketsService(): SmartNodeSocketsService {
    return this.smartNodeSocketsService;
  }

  /**
   * Retrieves the Hedera Service, to interact with the SmartNode Hedera API.
   * @returns SmartNodeHederaService
   */
  public getHederaService(): SmartNodeHederaService {
    return this.smartNodeHederaService;
  }
}
