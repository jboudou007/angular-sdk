import { Injectable } from '@angular/core';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeRestService {
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) {}

  // GAME
  public async getGameToken(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`games/token`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'getGameToken',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async gameFlipCoin(transactionId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`games/coin/flip`, 
        { params: { 
          transactionId: transactionId
        } });
        
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'gameFlipCoin',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  // DEX
  public async getPoolCharts(
    poolId: string, 
    type: 'hour' | 'day' | 'week',
    from?: number,
    limit?: number,
    order?: 'asc' | 'desc'
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`pools/pool/${poolId}/chart/${type}`,
        { params: { 
          from: from,
          limit: limit,
          order: order
        } });

        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'getPoolCharts',
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

  // SMART NODE
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

  public async getHsuiteHolders(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/hsuite/holders`);

        resolve({
          function: 'getHsuiteHolders',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getHsuiteStaking(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/hsuite/staking`);

        resolve({
          function: 'getHsuiteStaking',
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

  public async getAccountBalance(accountId: string, tokenId?: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/balance`,
          { params: {
            accountId: accountId,
            tokenId: tokenId
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

  public async loadFees(
    fee: 'tokens' | 'launchpads' | 'daos' | 'multisig' | 'nft_exchange' | 'exchange'
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

  public async getNftForHolder(accountId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/nfts`,
          { params: {
            accountId: accountId
          } }          
        );

        resolve({
          function: 'getNftForHolder',
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
}
