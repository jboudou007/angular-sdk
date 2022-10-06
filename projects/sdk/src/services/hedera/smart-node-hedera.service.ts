import { Inject, Injectable } from '@angular/core';
import { 
  AccountId, 
  Hbar, 
  HbarUnit, 
  NftId, 
  TokenAssociateTransaction, 
  TokenId, 
  Transaction, 
  TransactionId, 
  TransactionReceipt, 
  TransferTransaction 
} from '@hashgraph/sdk';
import { SmartNodeHashPackService } from '../hashpack/smart-node-hashpack.service';
import axios from 'axios';
import lodash from 'lodash';
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
        let transaction = new TransferTransaction()
        .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
        .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
        .setTransactionMemo(`${daoTokenId}/${daoDocument.limited.councilNftId}`);

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
        let transaction = new TransferTransaction()
        .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
        .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
        .setTransactionMemo(`${daoTokenId}/${proposalDocument.consensus_timestamp}/${proposalDocument.type}/${votedOption}`);

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
        let transaction = new TransferTransaction()
        .addHbarTransfer(senderId, Hbar.from(-fees.fixed.hbar, HbarUnit.Hbar))
        .addHbarTransfer(fees.wallet, Hbar.from(fees.fixed.hbar, HbarUnit.Hbar))
        .setTransactionMemo(`${daoTokenId}`);

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

  public async sendSwapTransaction(
    senderId: string,
    swap: any,
    routing: any,
    fees?: Array<any>,
    memo?: string,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = new TransferTransaction();

        if(memo) {
          transaction.setTransactionMemo(memo);
        }

        // adding the payment from the client into the transaction...
        if (swap.baseToken.tokenId == 'HBAR') {
          transaction.addHbarTransfer((<any>lodash.first(routing)).wallet, Hbar.from((<any>lodash.first(routing)).amount, HbarUnit.Hbar))
            .addHbarTransfer(senderId, Hbar.from(-(<any>lodash.first(routing)).amount, HbarUnit.Hbar));
        } else {
          transaction.addTokenTransfer((<any>lodash.first(routing)).baseToken.id, senderId, Number(-(<any>lodash.first(routing)).amount * (10 ** swap.baseToken.decimals)))
            .addTokenTransfer((<any>lodash.first(routing)).baseToken.id, (<any>lodash.first(routing)).wallet, Number((<any>lodash.first(routing)).amount * (10 ** swap.baseToken.decimals)));
        }

        routing.forEach((route: any, index: number) => {
          if(index < routing.length - 1) {
            let nextRoute = routing[index + 1];

            if (route.swapToken.id == 'HBAR') {
              transaction.addHbarTransfer(nextRoute.wallet, Hbar.from(route.payout, HbarUnit.Hbar))
                .addHbarTransfer(route.wallet, Hbar.from(-route.payout, HbarUnit.Hbar));
            } else {
              transaction.addTokenTransfer(route.swapToken.id, nextRoute.wallet, Number(route.payout * (10 ** swap.swapToken.decimals)))
                .addTokenTransfer(route.swapToken.id, route.wallet, Number(-route.payout * (10 ** swap.swapToken.decimals)));
            }
          } else {
            if (route.swapToken.id == 'HBAR') {
              transaction.addHbarTransfer(senderId, Hbar.from(route.payout, HbarUnit.Hbar))
                .addHbarTransfer(route.wallet, Hbar.from(-route.payout, HbarUnit.Hbar));
            } else {
              transaction.addTokenTransfer(route.swapToken.id, senderId, Number(route.payout * (10 ** swap.swapToken.decimals)))
                .addTokenTransfer(route.swapToken.id, route.wallet, Number(-route.payout * (10 ** swap.swapToken.decimals)));
            }
          }
        });

        if(fees) {
          fees.forEach(fee => {
            let feeAmount = Number((fee.amount * (10 ** this.utilities.hsuite.decimals)).toFixed(0));
            transaction.addTokenTransfer(this.utilities.hsuite.id, senderId, -feeAmount)
            .addTokenTransfer(this.utilities.hsuite.id, fee.wallet, feeAmount);
          });
        }        

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

  public async launchpadTransaction(
    launchpadDocument: any,
    senderId: string,
    hbarAmount: Decimal,
    tokenAmount: number,
    tokenId: string,
    tokenDecimals: number,
    memo?: string,
    fees?: any,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let transaction = new TransferTransaction()
        .addHbarTransfer(senderId, Hbar.from(-hbarAmount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
        .addHbarTransfer(launchpadDocument.treasuryId, Hbar.from(hbarAmount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
        .addTokenTransfer(tokenId, launchpadDocument.walletId, Number(-tokenAmount * (10 ** tokenDecimals)))
        .addTokenTransfer(tokenId, senderId, Number(tokenAmount * (10 ** tokenDecimals)));

        if(memo) {
          transaction.setTransactionMemo(memo);
        }

        if(fees) {
          let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;

          Object.keys(fees.percentage).forEach(key => {
            let fee = null;

            if(fees.percentage[key]) {
              switch(key) {
                case 'hbar':
                  fee = hbarAmount.times(fees.percentage[key]);
                  transaction.addHbarTransfer(senderId, -fee.toDecimalPlaces(8).toNumber())
                  .addHbarTransfer(fees.wallet, fee.toDecimalPlaces(8).toNumber());
                  break;
                case 'hsuite':
                  fee = hbarAmount.div(hsuiteInfos.price).times(fees.percentage[key]).times(10 ** hsuiteInfos.decimals);
                  transaction.addTokenTransfer(this.utilities.hsuite.id, senderId, -fee.toDecimalPlaces(8).toNumber())
                  .addTokenTransfer(this.utilities.hsuite.id, fees.wallet, fee.toDecimalPlaces(8).toNumber());     
                  break;
              }
            }
          });
        }

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

  public async launchpadNftTransaction(
    launchpadDocument: any,
    senderId: string,
    hbarAmount: Decimal,
    serialNumber: number,
    tokenId: string,
    memo?: string,
    fees?: any,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let nftId = new NftId(TokenId.fromString(tokenId), serialNumber);
        let transaction = new TransferTransaction()
        .addHbarTransfer(senderId, Hbar.from(-hbarAmount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
        .addHbarTransfer(launchpadDocument.treasuryId, Hbar.from(hbarAmount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
        .addNftTransfer(nftId, launchpadDocument.walletId, senderId);

        if(memo) {
          transaction.setTransactionMemo(memo);
        }

        if(fees) {
          let hsuiteInfos = (await this.smartNodeRestService.getTokenInfos(this.utilities.hsuite.id)).data;

          Object.keys(fees.percentage).forEach(key => {
            let fee = null;

            if(fees.percentage[key]) {
              switch(key) {
                case 'hbar':
                  fee = hbarAmount.times(fees.percentage[key]);
                  transaction.addHbarTransfer(senderId, -fee.toDecimalPlaces(8).toNumber())
                  .addHbarTransfer(fees.wallet, fee.toDecimalPlaces(8).toNumber());
                  break;
                case 'hsuite':
                  fee = hbarAmount.div(hsuiteInfos.price).times(fees.percentage[key]).times(10 ** hsuiteInfos.decimals);
                  transaction.addTokenTransfer(this.utilities.hsuite.id, senderId, -fee.toDecimalPlaces(8).toNumber())
                  .addTokenTransfer(this.utilities.hsuite.id, fees.wallet, fee.toDecimalPlaces(8).toNumber());     
                  break;
              }
            }
          });
        }

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

  public async joinPoolTransaction(
    senderId: string,
    poolWalletId: string,
    joinPool: {
      baseToken: {
        id: string,
        amount: Decimal,
        decimals: number
      },
      swapToken: {
        id: string,
        amount: Decimal,
        decimals: number
      }
    },
    nft: {
      tokenId: string,
      serialNumber: number
    },
    memo?: string,
    fees?: Array<any>,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let nftId = new NftId(TokenId.fromString(nft.tokenId), nft.serialNumber);
        let transaction = new TransferTransaction()
          .addNftTransfer(nftId, this.utilities.lpHSuite.treasury, senderId);

        if(joinPool.baseToken.id == 'HBAR') {
          transaction
          .addHbarTransfer(senderId, Hbar.from(-joinPool.baseToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
          .addHbarTransfer(poolWalletId, Hbar.from(joinPool.baseToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar));
        } else {
          transaction
          .addTokenTransfer(joinPool.baseToken.id, senderId, -(joinPool.baseToken.amount.toNumber() * (10 ** joinPool.baseToken.decimals)))
          .addTokenTransfer(joinPool.baseToken.id, poolWalletId, (joinPool.baseToken.amount.toNumber() * (10 ** joinPool.baseToken.decimals)))
        }

        if(joinPool.swapToken.id == 'HBAR') {
          transaction
          .addHbarTransfer(senderId, Hbar.from(-joinPool.swapToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
          .addHbarTransfer(poolWalletId, Hbar.from(joinPool.swapToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar));
        } else {
          transaction
          .addTokenTransfer(joinPool.swapToken.id, senderId, -(joinPool.swapToken.amount.toNumber() * (10 ** joinPool.swapToken.decimals)))
          .addTokenTransfer(joinPool.swapToken.id, poolWalletId, (joinPool.swapToken.amount.toNumber() * (10 ** joinPool.swapToken.decimals)))
        }

        if(memo) {
          transaction.setTransactionMemo(memo);
        }

        if(fees) {
          fees.forEach(fee => {
            transaction.addTokenTransfer(this.utilities.hsuite.id, senderId, Number(-fee.fees * (10 ** this.utilities.hsuite.decimals)))
            .addTokenTransfer(this.utilities.hsuite.id, fee.wallet, Number(fee.fees * (10 ** this.utilities.hsuite.decimals)));
          });
        }

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

  public async exitPoolTransaction(
    senderId: string,
    poolWalletId: string,
    exitPool: {
      baseToken: {
        id: string,
        amount: Decimal,
        decimals: number
      },
      swapToken: {
        id: string,
        amount: Decimal,
        decimals: number
      }
    },
    nft: {
      tokenId: string,
      serialNumber: number
    },
    memo?: string,
    fees?: Array<any>,
    returnTransaction?: boolean
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        let nftId = new NftId(TokenId.fromString(nft.tokenId), nft.serialNumber);
        let transaction = new TransferTransaction()
          .addNftTransfer(nftId, senderId, this.utilities.lpHSuite.treasury);

        if(exitPool.baseToken.id == 'HBAR') {
          transaction
          .addHbarTransfer(senderId, Hbar.from(exitPool.baseToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
          .addHbarTransfer(poolWalletId, Hbar.from(-exitPool.baseToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar));
        } else {
          transaction
          .addTokenTransfer(exitPool.baseToken.id, senderId, (exitPool.baseToken.amount.toNumber() * (10 ** exitPool.baseToken.decimals)))
          .addTokenTransfer(exitPool.baseToken.id, poolWalletId, -(exitPool.baseToken.amount.toNumber() * (10 ** exitPool.baseToken.decimals)))
        }

        if(exitPool.swapToken.id == 'HBAR') {
          transaction
          .addHbarTransfer(senderId, Hbar.from(exitPool.swapToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar))
          .addHbarTransfer(poolWalletId, Hbar.from(-exitPool.swapToken.amount.toDecimalPlaces(8).toNumber(), HbarUnit.Hbar));
        } else {
          transaction
          .addTokenTransfer(exitPool.swapToken.id, senderId, (exitPool.swapToken.amount.toNumber() * (10 ** exitPool.swapToken.decimals)))
          .addTokenTransfer(exitPool.swapToken.id, poolWalletId, -(exitPool.swapToken.amount.toNumber() * (10 ** exitPool.swapToken.decimals)))
        }

        if(memo) {
          transaction.setTransactionMemo(memo);
        }

        if(fees) {
          fees.forEach(fee => {
            transaction.addTokenTransfer(this.utilities.hsuite.id, senderId, Number(-fee.fees * (10 ** this.utilities.hsuite.decimals)))
            .addTokenTransfer(this.utilities.hsuite.id, fee.wallet, Number(fee.fees * (10 ** this.utilities.hsuite.decimals)));
          });
        }

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

  public async getAccountNftTokens(accountId: string): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let nftUrl = null;

        switch (this.network) {
          case 'local':
          case 'testnet':
            nftUrl = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts`;
            break;
          case 'mainnet':
            nftUrl = `https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts`;
            break;
        }

        let nftTokens = new Array<any>();

        let response = await axios.get(nftUrl);
        nftTokens = nftTokens.concat(response.data.nfts);

        while (response.data.links.next) {
          let next = lodash.get(response.data.links.next.split("?"), 1);
          response = await axios.get(`${nftUrl}?${next}`);
          nftTokens = nftTokens.concat(response.data.nfts);
        }

        resolve(nftTokens);
      } catch(error) {
        reject(error);
      }
    });
  }

  public async getAccountLpNftTokens(accountId: string, details?: boolean): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let nftTokens = await this.getAccountNftTokens(accountId);
        nftTokens = nftTokens.filter((nft: any) => nft.token_id == this.utilities.lpHSuite.id);
        let serialNumbers = nftTokens.map((x: any) => x.serial_number);
        
        let nftDocuments = (await this.smartNodeRestService.loadPositions(this.utilities.lpHSuite.id, serialNumbers)).data;
        resolve(nftDocuments);
      } catch (error) {
        reject(error);
      }
    });
  }
}
