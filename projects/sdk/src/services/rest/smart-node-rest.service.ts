import { Injectable } from '@angular/core';
import { SmartNodeNetworkService } from '../network/smart-node-network.service';

/**
 * SmartNodeRestService
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeRestService {

  /**
   * Constructor
   * @param {SmartNodeNetworkService} smartNodeNetworkService
   */
  constructor(
    private smartNodeNetworkService: SmartNodeNetworkService
  ) { }

  /**
   * getGameToken
   * @returns {Promise<any>}
   */
  public async getGameToken(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`games/token`);
        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'getGameToken',
          node: node,
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method for gameFlipCoin
   * @param {string} transactionId
   * @returns {Promise<any>}
   */
  public async gameFlipCoin(transactionId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`games/coin/flip`,
          {
            params: {
              transactionId: transactionId
            }
          });

        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'gameFlipCoin',
          node: node,
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get Smart Node Utilities
   * @returns {Promise<any>}
   */
  public async getUtilities(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/utilities`);

        resolve({
          function: 'getUtilities',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * publc method to get all the hsuite holders
   * @returns {Promise<any>}
   */
  public async getHsuiteHolders(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/hsuite/holders`);

        resolve({
          function: 'getHsuiteHolders',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get all the hsuite staking info
   * @returns {Promise<any>}
   */
  public async getHsuiteStaking(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(`smart-node/hsuite/staking`);

        resolve({
          function: 'getHsuiteStaking',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get all the account info
   * @param {string} accountId
   * @returns {Promise<any>}
   */
  public async getAccountInfos(accountId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/info`,
          {
            params: {
              accountId: accountId
            }
          }
        );

        resolve({
          function: 'getAccountInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get account balance
   * @param {string} accountId
   * @param {string} tokenId
   * @returns {Promise<any>}
   */
  public async getAccountBalance(accountId: string, tokenId?: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        if(!tokenId) tokenId = '0.0.0.0';
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/balance`,
          {
            params: {
              accountId: accountId,
              tokenId: tokenId
            }
          }
        );

        resolve({
          function: 'getAccountInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to load the fees
   * @param {string} fee
   * @returns {Promise<any>}
   */
  public async loadFees(
    fee: 'tokens' | 'launchpads' | 'daos' | 'multisig' | 'nft_exchange' | 'exchange'
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `fees/info`,
          {
            params: {
              fee: fee
            }
          }
        );

        let node = this.smartNodeNetworkService.getCurrentNode();

        resolve({
          function: 'loadFees',
          node: node,
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to load the tokens
   * @returns {Promise<any>}
   */
  public async loadTokens(): Promise<any> {
    return new Promise(async (resolve, reject) => {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get the token infos
   * @param {string} tokenId
   * @returns {Promise<any>}
   */
  public async getTokenInfos(tokenId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `tokens/info`,
          {
            params: {
              tokenId: tokenId
            }
          }
        );

        resolve({
          function: 'getTokenInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get the NFT for holder
   * @param {string} accountId
   * @returns {Promise<any>}
   */
  public async getNftForHolder(accountId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `wallets/nfts`,
          {
            params: {
              accountId: accountId
            }
          }
        );

        resolve({
          function: 'getNftForHolder',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * public method to get a token chain info
   * @param {string} tokenId
   * @returns {Promise<any>}
   */
  public async getTokenChainInfos(tokenId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.smartNodeNetworkService.getApiEndpoint(
          `tokens/chain-info`,
          {
            params: {
              tokenId: tokenId
            }
          }
        );

        resolve({
          function: 'getTokenChainInfos',
          node: this.smartNodeNetworkService.getCurrentNode(),
          data: response
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
