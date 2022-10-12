import { Injectable } from '@angular/core';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeRestService {
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) {}

  public async loadLaunchpads(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`launchpad/list`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        response.forEach((data: any) => {
          data.image = `${node.url}/${data.image}`;
          data.launchpad.header = data.launchpad.header ? `${node.url}/${data.launchpad.header}` : null;
        });

        resolve({
          function: 'loadLaunchpads',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadPositions(tokenId: string, serialNumbers: Array<string>): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`pools/positions`, 
        { params: { 
          tokenId: tokenId,
          serialNumbers: serialNumbers
        } });

        resolve({
          function: 'loadPositions',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadPools(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`pools/list`);

        resolve({
          function: 'loadPools',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getUtilities(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/utilities`);

        resolve({
          function: 'getUtilities',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async createPool(pool: any): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.postApiEndpoint(`pools/create`,
        pool,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000
        });
        
        resolve({
          function: 'createPool',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);
      }
    });
  }

  public async getAccountInfos(accountId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/info`,
          { params: {
            accountId: accountId
          } }
        );

        resolve({
          function: 'getAccountInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getAccountBalance(accountId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/balance`,
          { params: {
            accountId: accountId
          } } 
        );

        resolve({
          function: 'getAccountInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadDAOs(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`dao/list`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadDAOs',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadProposals(tokenId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `dao/proposals`,
          { params: {
            tokenId: tokenId
          } }          
        );
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadProposals',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadFees(
    fee: 'tokens' | 'launchpads' | 'daos' | 'proposals' | 'votes' | 'multisig' | 'marketplace' | 'swap' | 'join' | 'exit'
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `fees/info`,
          { params: {
            fee: fee
          } }
        );

        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadFees',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadProposal(tokenId: string, consensus_timestamp: string, type: 'public' | 'private'): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `dao/proposal`,
          { params: {
            tokenId: tokenId,
            consensus_timestamp: consensus_timestamp,
            type: type
          } }
        );
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadProposal',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadSnapshot(tokenId: string, consensus_timestamp: string, type: 'public' | 'private'): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `dao/snapshot`,
          { params: {
            tokenId: tokenId,
            consensus_timestamp: consensus_timestamp,
            type: type
          } }
        );
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadSnapshot',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async loadTokens(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`tokens/list`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        response.forEach((data: any) => {
          data.image = `${node.url}/${data.image}`
        });

        resolve({
          function: 'loadTokens',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getTokenInfos(tokenId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `tokens/info`,
          { params: {
            tokenId: tokenId
          } }          
        );

        resolve({
          function: 'getTokenInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getTokenChainInfos(tokenId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `tokens/chain-info`,
          { params: {
            tokenId: tokenId
          } }          
        );

        resolve({
          function: 'getTokenChainInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async calculatePoolPrice(amount: string, baseTokenId: string, swapTokenId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `pools/price`,
          { params: {
            amount: amount,
            baseToken: baseTokenId,
            swapToken: swapTokenId
          } }
        );
        
        resolve({
          function: 'calculatePoolPrice',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });        
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getPoolRatio(walletId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `pools/ratio`,
          { params: {
            wallet: walletId
          } }          
        );
        
        resolve({
          function: 'getPoolRatio',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });        
      } catch(error) {
        reject(error);        
      }
    });
  }
}
