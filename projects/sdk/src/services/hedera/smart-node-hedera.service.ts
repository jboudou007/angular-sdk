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

@Injectable({
  providedIn: 'root'
})  
export class SmartNodeHederaService {
  utilities: any;

  constructor(
    private smartNodeHashPackService: SmartNodeHashPackService,
    private smartNodeRestService: SmartNodeRestService,
    @Inject('network') private network: 'mainnet' | 'testnet' | 'local'
  ) {}

  setUtilities(utilities: any): void {
    this.utilities = utilities;
  }

  getRandomNodeForNetwork(): AccountId {
    let nodeAccountId = 0;

    switch(this.network) {
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
