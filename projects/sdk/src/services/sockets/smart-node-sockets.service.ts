import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmartNodeSocket } from './smart-socket/smart-socket.class';
import { Node } from '../network/interfaces/node.interface';
import * as lodash from 'lodash';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';
import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeSocketsService {
  private nodesSockets: Array<SmartNodeSocket> = new Array<SmartNodeSocket>();
  private nodesOnline: Map<string, any> = new Map<string, any>();
  
  private socketObserver = new Subject<any>();
  private socketObservable = this.socketObserver.asObservable();

  private mainSocket: SmartNodeSocket;

  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) {}

  async init(currentNode: Node, authSession: any, network: Array<Node>): Promise<void> {
    return new Promise(async(resolve, reject) => {
      try {
        let wallet = lodash.get(authSession.accountIds, 0);
        
        await this.initNodes(wallet, network);
        await this.initAuth(wallet, currentNode);
       
        resolve();
      } catch(error) {
        reject(error);
      }
    });   
  }

  getMainSocket(): SmartNodeSocket {
    return this.mainSocket;
  }

  getSocketObserver(): Observable<any> {
    return this.socketObservable;
  }

  getNodesOnline(): Map<string, any> {
    return this.nodesOnline;
  }

  async sendMessageToSmartNodes(payload: any, topic: string) {
    this.mainSocket.emit(topic, payload);
  }

  authorizeWallet(): void {
    this.mainSocket.disconnect();
    this.mainSocket.connect();
  }

  initMainSocket(currentNode: Node): SmartNodeSocket {
    this.nodesSockets.forEach(nodeSocket => {
      let node = nodeSocket.getNode();

      if(node.operator == currentNode.operator) {
        this.mainSocket = nodeSocket;
      }
    });

    return this.mainSocket;
  }

  async mintLpNft(joinPool: any): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('mintLpNft').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('mintLpNft', {
          joinPool: joinPool
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async burnLpNft(serialNumber: number): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('burnLpNft').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('burnLpNft', {
          serialNumber: serialNumber
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async reserveNftPrice(
    wallet: string,
    poolId: string,
    collectionId: string,
    nft: number,
    type: 'buy' | 'sell'
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('reserveNftPrice').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('reserveNftPrice', {
          type: 'reserveNftPrice',
          wallet: wallet,
          poolId: poolId,
          collectionId: collectionId,
          nft: nft,
          action: type
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async releaseNftPrice(
    wallet: string,
    poolId: string,
    collectionId: string,
    nft: number,
    type: 'buy' | 'sell',
    timestamp: string
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('releaseNftPrice').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('releaseNftPrice', {
          type: 'releaseNftPrice',
          wallet: wallet,
          poolId: poolId,
          collectionId: collectionId,
          nft: nft,
          action: type,
          timestamp: timestamp
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async swapNftPool(
    signedTransaction: any,
    timestamp: string
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('swapNftPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('swapNftPool', {
          type: 'swapNftPool',
          signedTransaction: signedTransaction,
          timestamp: timestamp
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async exitNftPool(
    signedTransaction: any
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('exitNftPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('exitNftPool', {
          type: 'exitNftPool',
          signedTransaction: signedTransaction
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  async createNftPool(
    signedTransaction: any, 
    collectionId: string,
    pricing: { fee: number, spotPrice: number, bondingCurve: 'linear' | 'exponential', delta: number},
    nftList: Array<string>,
    type: 'hbar' | 'hsuite'
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        this.mainSocket.fromOneTimeEvent('createNftPool').then((response: {status: string, payload: any, error: string}) => {
          if(response.status == 'success') {
            resolve(response.payload);
          } else {
            reject(new Error(response.error));
          }
        }).catch(error => {
          reject(error);
        });

        this.mainSocket.emit('createNftPool', {
          type: 'createNftPool',
          signedTransaction: signedTransaction,
          collectionId: collectionId,
          pricing: pricing,
          nftList: nftList,
          fungible_common: type
        });
      } catch(error) {
        reject(error);
      }
    });
  }
  
  async initAuth(wallet: string | null, currentNode: Node): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.mainSocket = this.initMainSocket(currentNode);

      this.mainSocket.fromEvent('events').subscribe((message: any) => {
        this.socketObserver.next({
          event: 'events',
          content: {
            method: 'events',
            ...message
          }
        });
      });

      this.mainSocket.fromEvent('errors').subscribe(async(message: any) => {
        this.socketObserver.next({
          event: 'errors',
          content: {
            method: 'error',
            ...message
          }
        });
      });

      this.mainSocket.fromEvent('authenticate').subscribe(async (auth: any) => {
        if (auth.isValidSignature) {
          this.socketObserver.next({
            event: 'auth',
            content: {
              message: `You are safely connected to the node ${this.mainSocket.getNode().operator} on Hsuite Network`,
              method: 'authenticate',
              type: 'success'
            }
          });
        } else {
          this.socketObserver.next({
            event: 'auth',
            content: {
              message: `<b>You are now connected to node ${this.mainSocket.getNode().operator}</b> 
              <br />For security reasons, authentication will be required every time the DAPP connects to a different node of the network.`,
              method: 'authenticate',
              type: 'warning'
            }
          });
        }
      });

      this.mainSocket.fromEvent('authentication').subscribe(async (authResponse: any) => {
        this.socketObserver.next({
          event: 'auth',
          content: {
            message: 'Please authenticate your wallet in order to safely use the app...',
            method: 'authentication',
            type: 'loading',
            data: {
              authResponse: authResponse,
              wallet: wallet
            }
          }
        });
      });

      resolve(true);
    });
  }

  async initNodes(wallet: string | null, network: Array<Node>): Promise<Array<SmartNodeSocket>> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.nodesSockets.length) {
          this.nodesSockets.forEach(socket => {
            socket.disconnect();
          });
        }

        this.nodesSockets = new Array<SmartNodeSocket>();
        this.nodesOnline = new Map<string, any>();
        
        network.forEach(node => {
          let nodeSocket = new SmartNodeSocket(node, wallet);

          this.nodesOnline.set(nodeSocket.getNode().operator, {
            node: nodeSocket.getNode(),
            online: false
          });

          nodeSocket.on("connect", async() => {
            this.nodesOnline.set(nodeSocket.getNode().operator, {
              node: nodeSocket.getNode(),
              online: true
            });
          });

          nodeSocket.on("disconnect", async(event) => {
            this.nodesOnline.set(nodeSocket.getNode().operator, {
              node: nodeSocket.getNode(),
              online: false
            });

            if(nodeSocket.getNode().operator == this.mainSocket.getNode().operator
            && event == 'transport close') {
              this.setNodeFromActiveNodes();
            }
          });

          nodeSocket.connect();
          this.nodesSockets.push(nodeSocket);
        });

        resolve(this.nodesSockets);
      } catch (error) {
        reject(error);
      }
    });
  }

  private setNodeFromActiveNodes(): void {
    try {
      // creating a Map of active node of the network...
      let activeNodes = new Map(
        Array.from(this.nodesOnline).filter(([key, node]) => {
          if (node.online) {
            return node.node.operator;
          }
      
          return false;
        })
      );

      // mapping the Map into Array<Node>...
      let network: Array<Node> = Array.from(activeNodes.values()).map(x => x.node);

      // updating the current used node, picking up a random one from the online list...
      this.smartNodeNetworkService.setNodeFromActiveNodes(network);
    } catch(error) {
      throw new Error(error.message);
    }
  }
}
