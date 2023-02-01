import { Injectable } from '@angular/core';
import { Node } from './interfaces/node.interface';
import { Observable, Subject } from 'rxjs';
import { Storage } from '@capacitor/storage';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeNetworkService {
  private nodeObserver = new Subject<any>();
  private nodeObservable = this.nodeObserver.asObservable();

  private nodes: Array<Node> = new  Array<Node>();
  private node: Node = {
    operator: '',
    publicKey: '',
    url: ''
  };

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
        "operator": "0.0.1786600",
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
        "operator": "0.0.3224",
        "publicKey": "302a300506032b657003210057a3ffed480e36faf916e032435368f2eb9f951a6b58de1a64829336516fdcbf",
        "url": "https://testnet-sn1.hbarsuite.network"
      },
      {
        "operator": "0.0.3243",
        "publicKey": "302a300506032b6570032100c63e283249e90a6971d71e4c8a1f0bc26a7a7f61f8524c7866a1d8ff779a4ffb",
        "url": "https://testnet-sn2.hbarsuite.network"
      },
      {
        "operator": "0.0.3266",
        "publicKey": "302a300506032b65700321004530757c566a19027a02fc58c9387739661e727e09e1bc92f1ee2fcde530b391",
        "url": "https://testnet-sn3.hbarsuite.network"
      },
      {
        "operator": "0.0.3320",
        "publicKey": "302a300506032b6570032100ecb67bdae47babf0d2df87f6b787562357550fac02a5e1ea44b22cc0c1ab2738",
        "url": "https://testnet-sn4.hbarsuite.network"
      }
    ],
    local: [
      {
        "operator": "0.0.3224",
        "publicKey": "302a300506032b657003210057a3ffed480e36faf916e032435368f2eb9f951a6b58de1a64829336516fdcbf",
        "url": "http://localhost:3001"
      },
      {
        "operator": "0.0.3243",
        "publicKey": "302a300506032b6570032100c63e283249e90a6971d71e4c8a1f0bc26a7a7f61f8524c7866a1d8ff779a4ffb",
        "url": "http://localhost:3002"
      },
      {
        "operator": "0.0.3266",
        "publicKey": "302a300506032b65700321004530757c566a19027a02fc58c9387739661e727e09e1bc92f1ee2fcde530b391",
        "url": "http://localhost:3003"
      },
      {
        "operator": "0.0.3320",
        "publicKey": "302a300506032b6570032100ecb67bdae47babf0d2df87f6b787562357550fac02a5e1ea44b22cc0c1ab2738",
        "url": "http://localhost:3004"
      }   
    ]
  };

  constructor() {}

  getNodeObserver(): Observable<any> {
    return this.nodeObservable;
  }

  public async setNetwork(network: 'mainnet' | 'testnet' | 'local', node: string, override: boolean = false): Promise<boolean> {
    return new Promise(async(resolve, reject) => {
      try {
        // as very first, we setup the core network...
        this.nodes = this.network[network];
        // setting a random node to use as default one...
        if(node == 'random') {
          await this.shuffleNode(override);
        } else {
          this.node = this.getSpecificNode(Number(node));
        }
        
        // then we fetch the entire network of nodes, and we update our nodes array...
        try {
          let whitelistedNetwork = await this.getNetwork();
          this.nodes = whitelistedNetwork.data;          
          resolve(true);
        } catch(error) {
          resolve(await this.setNetwork(network, node, true));
        }
      } catch(error) {
        reject(error);
      }
    })
  }

  async getNetwork(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        // then we call the endpoint to grab the entire list of nodes...
        let response = await this.getApiEndpoint('smart-node/network');
        // finally, we can resolve it...
        resolve({
          function: 'getNetwork',
          node: this.node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public getCurrentNode(): Node {
    return this.node;
  }

  public setCurrentNode(node: Node): void {
    this.node = node;
  }

  public async getRandomNode(override: boolean): Promise<Node> {
    let auth = await Storage.get({key: 'hashconnect.auth'});
    let node = null;

    if(auth.value && !override) {
      let authStorage = JSON.parse(auth.value);
      node = this.nodes.find(node => node.operator == authStorage.signedPayload.originalPayload.node);
    } else {
      node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    return node;
  }

  public getSpecificNode(index: number): Node {
    return this.nodes[index];
  }

  public async shuffleNode(override: boolean): Promise<void> {
    this.node = await this.getRandomNode(override);
  }

  public setNodeFromActiveNodes(activeNodes: Array<Node>): void {
    if(activeNodes.length) {
      this.node = activeNodes[Math.floor(Math.random() * activeNodes.length)];
      this.nodeObserver.next(this.node);
    } else {
      throw new Error(`the list of active nodes can't be empty`);
    }
  }

  async postApiEndpoint(endpoint: string, params: any = {}, config: any = {}): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.callApiEndpoint('post', endpoint, params, config);
        resolve(response);
      } catch(error) {
        reject(error);
      }
    });
  }

  async getApiEndpoint(endpoint: string, params: any = {}): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.callApiEndpoint('get', endpoint, params);
        resolve(response);
      } catch(error) {
        reject(error);
      }
    });
  }

  private async callApiEndpoint(
    type: 'get' | 'post',
    endpoint: string, 
    params: any = {}, 
    config: any = {}, 
    trials: number = 0
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        // try to call the required api endpoint...
        let response = null;

        if(this.node.url != '') {
          switch(type) {
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
      } catch(error) {
        reject(error);
      }
    });
  }
}
