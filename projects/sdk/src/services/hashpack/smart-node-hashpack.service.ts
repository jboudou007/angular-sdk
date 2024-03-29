import { Injectable } from '@angular/core';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { Subject } from 'rxjs';
import * as lodash from 'lodash';

/**
 *  SmartNodeHashPackService
 * @description This service is responsible for handling the HashPack connection
 */
@Injectable({
  providedIn: 'root'
})
export class SmartNodeHashPackService {
  /**
   * Private property hashconnect
   */
  private hashconnect: HashConnect;

  /**
   * Private property appMetadata
   */
  private appMetadata: HashConnectTypes.AppMetadata;

  /**
   * Private property dataObserver
   */
  private dataObserver = new Subject<any>();

  /**
   * Public property observeHashpackConnection
   * @returns {Observable<any>}
   */
  public observeHashpackConnection = this.dataObserver.asObservable();

  /**
   * Private property network
   */
  private network: string;

  /**
   * Private property hashconnectData
   */
  private hashconnectData = {
    topic: '',
    pairingString: '',
    accountIds: new Array<string>()
  }

  /**
   * Constructor Method
   */
  constructor() {
    this.hashconnect = new HashConnect();

    this.appMetadata = {
      name: "HSuite Finance",
      description: "Enhanching the Hedera Network",
      icon: "https://testnet-sn1.hbarsuite.network/public/logos/rounded_logo.png"
    };

    this.hashconnect.pairingEvent.on(async (pairingData) => {
      this.hashconnectData.topic = pairingData.topic;
      this.hashconnectData.accountIds = pairingData.accountIds;

      localStorage.setItem('hashconnect.data', JSON.stringify(this.hashconnectData));

      this.dataObserver.next(this.hashconnectData);
    });
  }

  public getInstance(): HashConnect {
    return this.hashconnect;
  }

  /**
   * Public method getSigner
   * @returns {any}
   */
  public getSigner(): any {
    const provider = this.hashconnect.getProvider(
      this.network,
      this.hashconnectData.topic,
      lodash.first(this.hashconnectData.accountIds)
    );

    const signer = this.hashconnect.getSigner(provider);
    return signer;
  }

  /**
   * Public method to connect to HashPack
   * @param {string} network
   * @param {string} type
   * @returns {Promise<string>}
   */
  public async connect(network: 'mainnet' | 'testnet' | 'previewnet', type?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.init(network);

        if (type == 'hashpack') {
          this.hashconnect.connectToLocalWallet();
        }

        resolve(this.hashconnectData.pairingString);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async init(network: 'mainnet' | 'testnet' | 'previewnet'): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.network = network;
        let initData = await this.hashconnect.init(this.appMetadata, network, true);

        this.hashconnectData = {
          topic: initData.pairingString,
          pairingString: initData.pairingString,
          accountIds: initData.savedPairings[0]?.accountIds
        }

        resolve({
          hashpack: "init",
          hashconnectData: JSON.parse(localStorage.getItem("hashconnectData")),
          appMetadata: this.appMetadata,
          network: this.network
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *  Public method disconnect
   * @returns {Promise<boolean>}
   */
  public async disconnect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        try {
          await this.hashconnect.disconnect(this.hashconnectData.topic);
          this.hashconnect.clearConnectionsAndData();
        } catch (error) {
          console.error(error);
        }

        localStorage.removeItem('hashconnect.data');
        localStorage.removeItem('hashconnect.auth');

        this.hashconnectData = {
          topic: '',
          pairingString: '',
          accountIds: new Array<string>()
        }

        this.dataObserver.next(this.hashconnectData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method loadHashconnectData
   * @returns {Promise<any>}
   */
  public async loadHashconnectData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let hashconnectData = localStorage.getItem('hashconnect.data');

        if (hashconnectData) {
          let parsedHashconnectData = JSON.parse(hashconnectData);

          if (parsedHashconnectData.accountIds?.length > 0) {
            this.hashconnectData = parsedHashconnectData;
            resolve(this.hashconnectData);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method to send a transaction
   * @param {any} transaction
   * @param {string} accountId
   * @param {boolean} returnTransaction
   * @param {boolean} hideNft
   * @returns {Promise<any>}
   */
  public async sendTransaction(transaction: any, accountId: string, returnTransaction: boolean = true, hideNft: boolean = false) {
    return new Promise(async (resolve, reject) => {
      try {
        const transactionHashPack: MessageTypes.Transaction = {
          topic: this.hashconnectData.topic,
          byteArray: transaction,

          metadata: {
            accountToSign: accountId,
            returnTransaction: returnTransaction,
            hideNft: hideNft
          }
        };

        let hashconnectResponse = await this.hashconnect.sendTransaction(
          this.hashconnectData.topic,
          transactionHashPack
        );

        resolve(hashconnectResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method to clear an authentication session
   * @returns {Promise<any>}
   */
  public async clearAuthSession(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        localStorage.removeItem('hashconnect.auth');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method to get an authentication session
   * @returns {Promise<any>}
   */
  public async getAuthSession(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let auth = localStorage.getItem('hashconnect.auth');
        let authResponse = null;

        if (auth) {
          authResponse = JSON.parse(auth);
        }

        resolve(authResponse);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Public method to authenticate a wallet
   * @param {string} walletId
   * @param {any} signature
   * @param {any} payload
   * @returns {Promise<any>}
   */
  public async authenticateWallet(walletId: string, signature: any, payload: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let authResponse = await this.hashconnect.authenticate(
          this.hashconnectData.topic,
          walletId,
          signature.serverSigningAccount,
          signature.signature,
          payload);

        if (authResponse.success) {
          localStorage.setItem('hashconnect.auth', JSON.stringify(authResponse));
        }

        resolve(authResponse);
      } catch (error) {
        reject(error);
      }
    });
  }
}
