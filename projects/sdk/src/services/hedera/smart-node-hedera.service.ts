import { Inject, Injectable } from '@angular/core';
import {
  AccountId,
  Hbar,
  HbarUnit,
  TokenAssociateTransaction,
  Transaction,
  TransactionId,
  TransactionReceipt,
  TransferTransaction
} from '@hashgraph/sdk';
import { SmartNodeHashPackService } from '../hashpack/smart-node-hashpack.service';
import { SmartNodeRestService } from '../rest/smart-node-rest.service';
import Decimal from 'decimal.js';

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

  /**
   * Public method createDaoTransaction
   * @param {string} daoTokenId
   * @param {string} senderId
   * @param {any} daoDocument
   * @param {any} fees
   * @param {boolean} returnTransaction
   * @returns {Promise<any>}
   */
  public async createDaoTransaction(
    daoTokenId: string,
    senderId: string,
    daoDocument: {
      about: string
      tokenId: string
      image: string
      limited: {
        councilNftId: string
      }
    },
    fees: any,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;
        let veHsuiteReward = new Decimal(fees.fixed.hbar).div(hsuiteInfos.price).times(0.1)
          .times(10 ** hsuiteInfos.decimals).toDecimalPlaces(hsuiteInfos.decimals).toNumber();

        let transaction = new TransferTransaction()
          .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
          .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
          .setTransactionMemo(`${daoTokenId}/${daoDocument.limited.councilNftId}`)
          .addTokenTransfer(this.utilities.veHsuite.id, senderId, veHsuiteReward)
          .addTokenTransfer(this.utilities.veHsuite.id, this.utilities.veHsuite.treasury, -veHsuiteReward);

        let transBytes = await this.makeBytes(transaction, senderId);
        let response: any = await this.smartNodeHashPackService.sendTransaction(transBytes, senderId, returnTransaction);

        let responseData: any = {
          response: response,
          receipt: null
        }

        if (response.success && returnTransaction === false) {
          responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
        }

        resolve(responseData);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method voteTransaction
   * @param {string} daoTokenId
   * @param {any} proposalDocument
   * @param {number} votedOption
   * @param {string} senderId
   * @param {any} fees
   * @param {boolean} returnTransaction
   * @returns {Promise<any>}
   */
  public async voteTransaction(
    daoTokenId: string,
    proposalDocument: any,
    votedOption: number,
    senderId: string,
    fees: any,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;
        let veHsuiteReward = new Decimal(fees.fixed.hbar).div(hsuiteInfos.price).times(0.1)
          .times(10 ** hsuiteInfos.decimals).toDecimalPlaces(hsuiteInfos.decimals).toNumber();

        let transaction = new TransferTransaction()
          .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
          .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
          .setTransactionMemo(`${daoTokenId}/${proposalDocument.consensus_timestamp}/${proposalDocument.type}/${votedOption}`)
          .addTokenTransfer(this.utilities.veHsuite.id, senderId, veHsuiteReward)
          .addTokenTransfer(this.utilities.veHsuite.id, this.utilities.veHsuite.treasury, -veHsuiteReward);

        let transBytes = await this.makeBytes(transaction, senderId);
        let response: any = await this.smartNodeHashPackService.sendTransaction(transBytes, senderId, returnTransaction);

        let responseData: any = {
          response: response,
          receipt: null
        }

        if (response.success && returnTransaction === false) {
          responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
        }

        resolve(responseData);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method proposalTransaction
   * @param {string} daoTokenId
   * @param {string} senderId
   * @param {any} fees
   * @param {boolean} returnTransaction
   * @returns {Promise<any>}
   */
  public async proposalTransaction(
    daoTokenId: string,
    senderId: string,
    fees: any,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;
        let veHsuiteReward = new Decimal(fees.fixed.hbar).div(hsuiteInfos.price).times(0.1)
          .times(10 ** hsuiteInfos.decimals).toDecimalPlaces(hsuiteInfos.decimals).toNumber();

        let transaction = new TransferTransaction()
          .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
          .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
          .setTransactionMemo(`${daoTokenId}`)
          .addTokenTransfer(this.utilities.veHsuite.id, senderId, veHsuiteReward)
          .addTokenTransfer(this.utilities.veHsuite.id, this.utilities.veHsuite.treasury, -veHsuiteReward);

        let transBytes = await this.makeBytes(transaction, senderId);
        let response: any = await this.smartNodeHashPackService.sendTransaction(transBytes, senderId, returnTransaction);

        let responseData: any = {
          response: response,
          receipt: null
        }

        if (response.success && returnTransaction === false) {
          responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
        }

        resolve(responseData);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method createNftPoolTransaction
   * @param {string} senderId
   * @param {string} memo
   * @param {boolean} returnTransaction
   * @returns {Promise<any>}
   */
  public async createNftPoolTransaction(
    senderId: string,
    memo: string,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let fees = (await this.smartNodeRestService.loadFees('nft_exchange')).data;
        let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;
        let veHsuiteReward = new Decimal(fees.create.fixed.hbar).div(hsuiteInfos.price).times(0.1)
          .times(10 ** hsuiteInfos.decimals).toDecimalPlaces(hsuiteInfos.decimals).toNumber();

        let transaction = new TransferTransaction()
          .addHbarTransfer(fees.wallet, new Hbar(fees.create.fixed.hbar))
          .addHbarTransfer(senderId, new Hbar(-fees.create.fixed.hbar))
          .addTokenTransfer(this.utilities.veHsuite.id, senderId, veHsuiteReward)
          .addTokenTransfer(this.utilities.veHsuite.id, this.utilities.veHsuite.treasury, -veHsuiteReward)
          .setTransactionMemo(memo);

        let transBytes = await this.makeBytes(transaction, senderId);
        let response: any = await this.smartNodeHashPackService.sendTransaction(transBytes, senderId, returnTransaction);

        let responseData: any = {
          response: response,
          receipt: null
        }

        if (response.success && returnTransaction === false) {
          responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
        }

        resolve(responseData);
      } catch (error) {
        reject(error);
      }
    });
  }
}
