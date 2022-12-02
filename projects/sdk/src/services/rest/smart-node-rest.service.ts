import { Injectable } from '@angular/core';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeRestService {
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) {}

  public async calculateLaunchpadDiscount(launchpadId: string, accountId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`launchpad/${launchpadId}/discount/${accountId}`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'calculateLaunchpadDiscount',
          node: node,
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

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

  public async getNftPoolsCollections(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`nft-pools/collections`);

        resolve({
          function: 'getNftPoolsCollections',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async findNftPoolsCollection(collectionId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`nft-pools/collection/find/${collectionId}`);

        resolve({
          function: 'findNftPoolsCollection',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getNftPoolsCollection(consensus_timestamp: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`nft-pools/collection/${consensus_timestamp}`);

        resolve({
          function: 'getNftPoolsCollection',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getNftPoolsCollectionPools(collection_consensus_timestamp: string, pool_consensus_timestamp: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`nft-pools/collection/${collection_consensus_timestamp}/pool/${pool_consensus_timestamp}`);

        resolve({
          function: 'getNftPoolsCollectionPools',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async getNftPoolsForUser(serialNumber: number): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`nft-pools/collection/pools/user/${serialNumber}`);

        resolve({
          function: 'getNftPoolsForUser',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async calculateNftPoolInjectionAmount(
    nftList: Array<number>,
    spotPrice: number,
    delta: number,
    bondingCurve: 'linear' | 'exponential',
    collectionId: string,
    poolWalletId: string
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try { 
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `nft-pools/collections/pools/inject/calculate`,
          { params: {
            nftList: nftList,
            spotPrice: spotPrice,
            delta: delta,
            bondingCurve: bondingCurve,
            collectionId: collectionId,
            poolWalletId: poolWalletId
          } }          
        );

        resolve({
          function: 'calculateNftPoolInjectionAmount',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch(error) {
        reject(error);        
      }
    });
  }

  public async calculateNftPoolWithdrawAmount(
    nftList: Array<number>,
    spotPrice: number,
    delta: number,
    bondingCurve: 'linear' | 'exponential',
    collectionId: string,
    poolWalletId: string
  ): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try { 
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `nft-pools/collections/pools/withdraw/calculate`,
          { params: {
            nftList: nftList,
            spotPrice: spotPrice,
            delta: delta,
            bondingCurve: bondingCurve,
            collectionId: collectionId,
            poolWalletId: poolWalletId
          } }          
        );

        resolve({
          function: 'calculateNftPoolWithdrawAmount',
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

  public async getNftMetadata(CID: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `nft-pools/metadata/${encodeURIComponent(CID)}`,
        );

        resolve({
          function: 'getNftMetadata',
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

  public async loadSnapshotValidate(walletId: string, tokenId: string, consensus_timestamp: string, type: 'public' | 'private'): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `dao/snapshot/validate`,
          { params: {
            walletId: walletId,
            tokenId: tokenId,
            consensus_timestamp: consensus_timestamp,
            type: type
          } }
        );
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadSnapshotValidate',
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
