import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmartNodeSocket } from '../../lib/utils/smart-socket/smart-socket.class';
import { Node } from '../network/interfaces/node.interface';
import * as lodash from 'lodash';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';

/**
 * SmartNodeSocketsService
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeSocketsService {

  /**
   * private nodes sockets
   * @type {Array<SmartNodeSocket>}
   */
  private nodesSockets: Array<SmartNodeSocket> = new Array<SmartNodeSocket>();

  /**
   * private nodesOnline
   * @type {Map<string, any>}
   */
  private nodesOnline: Map<string, any> = new Map<string, any>();

  /**
   * private socketObserver
   * @type {Subject<any>}
   */
  private socketObserver = new Subject<any>();

  /**
   * private socketObservable
   * @type {Observable<any>}
   */
  private socketObservable = this.socketObserver.asObservable();

  /**
   * private mainSocket
   * @type {SmartNodeSocket}
   */
  private mainSocket: SmartNodeSocket;

  /**
   * Constructor
   * @param {SmartNodeNetworkService} smartNodeNetworkService
   */
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) { }

  /**
   * init the node
   * @param {Node} currentNode
   * @param {any} authSession
   * @param {Array<Node>} network
   * @returns {Promise<void>}
   */
  async init(currentNode: Node, authSession: any, network: Array<Node>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let wallet = lodash.get(authSession.accountIds, 0);

        await this.initNodes(wallet, network);
        await this.initAuth(wallet, currentNode);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * get the main socket
   * @returns {SmartNodeSocket}
   */
  getMainSocket(): SmartNodeSocket {
    return this.mainSocket;
  }

  /**
   * get the socket observer
   * @returns {Observable<any>}
   */
  getSocketObserver(): Observable<any> {
    return this.socketObservable;
  }

  /**
   * get the nodes online
   * @returns {Map<string, any>}
   */
  getNodesOnline(): Map<string, any> {
    return this.nodesOnline;
  }

  /**
   * send message to smart nodes
   * @param {any} payload
   * @param {string} topic
   * @returns {Promise<void>}
   */
  async sendMessageToSmartNodes(payload: any, topic: string) {
    this.mainSocket.emit(topic, payload);
  }

  /**
   * authenticate the wallet
   * @param {string} wallet
   * @returns {Promise<void>}
   */
  authorizeWallet(): void {
    this.mainSocket.disconnect();
    this.mainSocket.connect();
  }

  /**
   * initialize main socket
   * @param {Node} currentNode
   * @returns {SmartNodeSocket}
   */
  initMainSocket(currentNode: Node): SmartNodeSocket {
    this.nodesSockets.forEach(nodeSocket => {
      let node = nodeSocket.getNode();

      if (node.operator == currentNode.operator) {
        this.mainSocket = nodeSocket;
      }
    });

    return this.mainSocket;
  }

  /**
   * initialize authentication
   * @param {string} wallet
   * @param {Node} currentNode
   * @returns {Promise<boolean>}
   */
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

      this.mainSocket.fromEvent('errors').subscribe(async (message: any) => {
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

  /**
   * initialize nodes
   * @param {string} wallet
   * @param {Array<Node>} network
   * @returns {Promise<Array<SmartNodeSocket>>}
   */
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

          this.nodesOnline.set(nodeSocket.getNode().url, {
            node: nodeSocket.getNode(),
            online: false
          });

          nodeSocket.on("connect", async () => {
            this.nodesOnline.set(nodeSocket.getNode().url, {
              node: nodeSocket.getNode(),
              online: true
            });
          });

          nodeSocket.on("disconnect", async (event) => {
            this.nodesOnline.set(nodeSocket.getNode().url, {
              node: nodeSocket.getNode(),
              online: false
            });

            if (nodeSocket.getNode().operator == this.mainSocket.getNode().operator
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

  /**
   * private method to set node from active nodes
   * @returns {void}
   */
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
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
