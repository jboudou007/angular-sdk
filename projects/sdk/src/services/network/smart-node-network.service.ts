import { Injectable } from '@angular/core';
import { Node } from './interfaces/node.interface';
import { Observable, Subject } from 'rxjs';
import axios from 'axios';
import * as lodash from 'lodash';

/**
 * SmartNodeNetworkService
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeNetworkService {

  /**
   * private nodeObserver
   * @type {Subject<any>}
   */
  private nodeObserver = new Subject<any>();

  /**
   * private nodeObservable
   * @type {Observable<any>}
   */
  private nodeObservable = this.nodeObserver.asObservable();

  /**
   * private nodes
   * @type {Array<Node>}
   */
  private nodes: Array<Node> = new Array<Node>();

  /**
   * private node
   * @type {Node}
   */
  private node: Node = {
    operator: '',
    publicKey: '',
    url: ''
  };

  /**
   * private network
   * @type {any}
   */
  private network = {
    mainnet: [
      {
        "operator": "0.0.1786597",
        "publicKey": "302a300506032b65700321003f54816030c29221e4f228c76415cba0db1ab4c49827d9dbf580abc2f2b29c24",
        "url": "https://mainnet-sn1.hbarsuite.network"
      },
      {
        "operator": "0.0.1786598",
        "publicKey": "302a300506032b6570032100233b043e21d5e148f48e2c2da6607a1f5e6fc381781bd0561967743a8291785e",
        "url": "https://mainnet-sn2.hbarsuite.network"
      },
      {
        "operator": "0.0.1786599",
        "publicKey": "302a300506032b6570032100c236c88b0aadccf86cc09c57734401409e301d45018ab179f8463801f486c89a",
        "url": "https://mainnet-sn3.hbarsuite.network"
      },
      {
        "operator": "0.0.1786344",
        "publicKey": "302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766",
        "url": "https://mainnet-sn4.hbarsuite.network"
      },
      {
        "operator": "0.0.1786344",
        "publicKey": "302a300506032b65700321004e3c29113c911ce6dba13669fda53ed1ab3d89547e23c0b7ab2275fd5dc05766",
        "url": "https://mainnet-sn5.hbarsuite.network"
      },
      {
        "operator": "0.0.1786345",
        "publicKey": "302a300506032b6570032100077bfba9f0fb180026f0de51d4e1083d616eff34a8fe62a1c0e34dd975b7f8cf",
        "url": "https://mainnet-sn6.hbarsuite.network"
      },
      {
        "operator": "0.0.1786347",
        "publicKey": "302a300506032b6570032100ff792317f5a24278f1a2dddfc9a23670e158ccb9ecd42cdd0ab36e5ad8bc40a6",
        "url": "https://mainnet-sn7.hbarsuite.network"
      },
      {
        "operator": "0.0.1786365",
        "publicKey": "302a300506032b6570032100485e23e18834571e466f96de9f96f228a1f5da860b319f0f0cb2890f938f298d",
        "url": "https://mainnet-sn8.hbarsuite.network"
      }
    ],
    testnet: [
      {
        "operator": "0.0.467726",
        "publicKey": "302a300506032b657003210057a3ffed480e36faf916e032435368f2eb9f951a6b58de1a64829336516fdcbf",
        "url": "https://testnet-sn1.hbarsuite.network"
      },
      {
        "operator": "0.0.467732",
        "publicKey": "302a300506032b6570032100c63e283249e90a6971d71e4c8a1f0bc26a7a7f61f8524c7866a1d8ff779a4ffb",
        "url": "https://testnet-sn2.hbarsuite.network"
      },
      {
        "operator": "0.0.467734",
        "publicKey": "302a300506032b65700321004530757c566a19027a02fc58c9387739661e727e09e1bc92f1ee2fcde530b391",
        "url": "https://testnet-sn3.hbarsuite.network"
      },
      {
        "operator": "0.0.467737",
        "publicKey": "302a300506032b6570032100ecb67bdae47babf0d2df87f6b787562357550fac02a5e1ea44b22cc0c1ab2738",
        "url": "https://testnet-sn4.hbarsuite.network"
      }
    ],
    local: [
      {
        "operator": "0.0.467726",
        "publicKey": "302a300506032b657003210057a3ffed480e36faf916e032435368f2eb9f951a6b58de1a64829336516fdcbf",
        "url": "http://localhost:3001"
      },
      {
        "operator": "0.0.467732",
        "publicKey": "302a300506032b6570032100c63e283249e90a6971d71e4c8a1f0bc26a7a7f61f8524c7866a1d8ff779a4ffb",
        "url": "http://localhost:3002"
      },
      {
        "operator": "0.0.467734",
        "publicKey": "302a300506032b65700321004530757c566a19027a02fc58c9387739661e727e09e1bc92f1ee2fcde530b391",
        "url": "http://localhost:3003"
      },
      {
        "operator": "0.0.467737",
        "publicKey": "302a300506032b6570032100ecb67bdae47babf0d2df87f6b787562357550fac02a5e1ea44b22cc0c1ab2738",
        "url": "http://localhost:3004"
      }
    ]
  };

  /**
   * constructor
   */
  constructor() { }

  /**
   * public method to get the node observer
   * @returns Observable<any>
   */
  getNodeObserver(): Observable<any> {
    return this.nodeObservable;
  }

  /**
   * public method to set the network
   * @param network
   * @param node
   * @param override
   * @returns Promise<boolean>
    */
  public setNetwork(
    network: 'mainnet' | 'testnet' | 'local' | 'custom', 
    node: string, 
    override: boolean = false,
    customNetwork: Array<{
      operator: string,
      publicKey: string,
      url: string
    }>
  ): void {
    // as very first, we setup the core network...
    if(network == 'custom') {
      this.nodes = lodash.cloneDeep(customNetwork);
    } else {
      this.nodes = lodash.cloneDeep(this.network[network]);
    }
    
    // setting a random node to use as default one...
    if (node == 'random') {
      this.node = lodash.clone(this.shuffleNode(override));
    } else {
      this.node = lodash.clone(this.getSpecificNode(Number(node)));
    }
  }

  /**
   * public method to get the network
   * @returns Promise<any>
   */
  getNetwork(): Array<Node> {
    return this.nodes;
  }

  /**
   * public method to get the current node
   * @returns Node
   */
  public getCurrentNode(): Node {
    return this.node;
  }

  /**
   * public method to set the current node
   * @param node
   * @returns void
   */
  public setCurrentNode(node: Node): void {
    this.node = lodash.clone(node);
  }

  /**
   * public method to get a random node
   * @param override
   * @returns Promise<Node>
   */
  public getRandomNode(override: boolean): Node {
    let auth = localStorage.getItem('hashconnect.auth');
    let node = null;

    if (auth && !override) {
      let authStorage = JSON.parse(auth);
      node = this.nodes.find(node => node.operator == authStorage.signedPayload.originalPayload.node);
    } else {
      if(this.nodes && this.nodes.length) {
        node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      } else {
        node = 0;
      }
    }

    return node;
  }

  /**
   * public method to get a specific node
   * @param index
   * @returns Node
   */
  public getSpecificNode(index: number): Node {
    return this.nodes[index];
  }

  /**
   * public method to shuffle the node
   * @param override
   * @returns Promise<void>
   */
  public shuffleNode(override: boolean): Node {
    return this.getRandomNode(override);
  }

  /**
   * public method to set node from active nodes
   * @param activeNodes
   * @returns void
   */
  public setNodeFromActiveNodes(activeNodes: Array<Node>): void {
    if (activeNodes && activeNodes.length) {
      this.node = lodash.clone(activeNodes[Math.floor(Math.random() * activeNodes.length)]);
      this.nodeObserver.next(this.node);
    } else {
      throw new Error(`the list of active nodes can't be empty`);
    }
  }

  /**
   * Post API endpoint
   * @param endpoint
   * @param params
   * @param config
   * @returns Promise<any>
   */
  async postApiEndpoint(endpoint: string, params: any = {}, config: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.callApiEndpoint('post', endpoint, params, config);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get API endpoint
   * @param endpoint
   * @param params
   * @returns Promise<any>
   */
  async getApiEndpoint(endpoint: string, params: any = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.callApiEndpoint('get', endpoint, params);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * private method to call the api endpoint
   * @param type
   * @param endpoint
   * @param params
   * @param config
   * @param trials
   * @returns Promise<any>
   */
  private async callApiEndpoint(
    type: 'get' | 'post',
    endpoint: string,
    params: any = {},
    config: any = {},
    trials: number = 0
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // try to call the required api endpoint...
        let response = null;

        if (this.node.url != '') {
          switch (type) {
            case 'get':
              response = await axios.get(`${this.node.url}/${endpoint}`, params);
              break;
            case 'post':
              response = await axios.post(`${this.node.url}/${endpoint}`, params, config);
              break;
          }

          this.nodeObserver.next(this.node);
          resolve(response.data);
        } else {
          resolve(response);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
