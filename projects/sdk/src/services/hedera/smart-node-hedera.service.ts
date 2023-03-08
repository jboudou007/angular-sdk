import { Inject, Injectable } from '@angular/core';
import {
  AccountId,
  TokenAssociateTransaction,
  Transaction,
  TransactionId,
  TransactionReceipt
} from '@hashgraph/sdk';
import { SmartNodeHashPackService } from '../hashpack/smart-node-hashpack.service';
import { SmartNodeRestService } from '../rest/smart-node-rest.service';

/**
 * SmartNodeHederaService
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeHederaService {

  /**
   * Utilities
   * @type {any}
   */
  utilities: any;

  /**
   * Constructor Method
   * @param {SmartNodeHashPackService} smartNodeHashPackService
   * @param {SmartNodeRestService} smartNodeRestService
   * @param {string} network
   * @returns {SmartNodeHederaService}
   */
  constructor(
    private smartNodeHashPackService: SmartNodeHashPackService,
    private smartNodeRestService: SmartNodeRestService,
    @Inject('network') private network: 'mainnet' | 'testnet' | 'local'
  ) { }

  /**
   * Public method setUtilities
   * @param {any} utilities
   * @returns {void}
   */
  setUtilities(utilities: any): void {
    this.utilities = utilities;
  }

  /**
   * Public method getRandomNodeForNetwork
   * @returns {AccountId}
   */
  getRandomNodeForNetwork(): AccountId {
    let nodeAccountId = 0;

    switch (this.network) {
      case 'mainnet':
        // generating random number from 3 to 28...
        nodeAccountId = Math.floor(Math.random() * (28 - 3 + 1) + 3);
        break;
      case 'testnet':
      case 'local':
        // generating random number from 3 to 9...
        nodeAccountId = Math.floor(Math.random() * (9 - 3 + 1) + 3);
        break;
    }

    return new AccountId(nodeAccountId);
  }

  /**
   * Public method makeBytes
   * @param {Transaction} transaction
   * @param {string} accountId
   * @returns {Promise<any>}
   */
  public async makeBytes(transaction: Transaction, accountId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let transactionId = TransactionId.generate(accountId);

        transaction.setTransactionId(transactionId)
          .setNodeAccountIds([this.getRandomNodeForNetwork()]);

        await transaction.freeze();
        resolve(transaction.toBytes());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method associateToken
   * @param {Uint8Array} transactionBytes
   * @param {string} accountId
   * @param {boolean} returnTransaction
   * @returns {Promise<any>}
   */
  public async associateToken(tokenIds: Array<string>, accountId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = await new TokenAssociateTransaction()
          .setTokenIds(tokenIds)
          .setAccountId(accountId);

        let transBytes = await this.makeBytes(transaction, accountId);
        let response: any = await this.smartNodeHashPackService.sendTransaction(transBytes, accountId, false);

        let responseData: any = {
          response: response,
          receipt: null
        }

        if (response.success) {
          responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
        }

        resolve(responseData);
      } catch (error) {
        reject(error);
      }
    });
  }
}
