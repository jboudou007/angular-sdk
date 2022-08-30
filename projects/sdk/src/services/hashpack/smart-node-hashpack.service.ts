import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SmartNodeHashPackService {
  private hashconnect: HashConnect;
  private appMetadata: HashConnectTypes.AppMetadata;

  private dataObserver = new Subject<any>();
  public observeHashpackConnection = this.dataObserver.asObservable();

  private hashconnectData = {
    topic: '',
    pairingString: '',
    accountIds: new Array<string>()
  }

  constructor() {
    this.hashconnect = new HashConnect();

    this.appMetadata = {
      name: "HSuite Finance",
      description: "Enhanching the Hedera Network",
      icon: "https://testnet-sn1.hbarsuite.network/public/tokens/hsuite.png"
    };

    this.hashconnect.pairingEvent.on(async (pairingData) => {
      this.hashconnectData.topic = pairingData.topic;
      this.hashconnectData.accountIds = pairingData.accountIds;

      await Storage.set({
        key: 'hashconnect.data',
        value: JSON.stringify(this.hashconnectData),
      });      

      this.dataObserver.next(this.hashconnectData);
    });
  }

  public async connect(network: 'mainnet' | 'testnet' | 'previewnet', type?: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let initData = await this.hashconnect.init(this.appMetadata, network, true);

        this.hashconnectData = {
          topic: initData.pairingString,
          pairingString: initData.pairingString,
          accountIds: initData.savedPairings[0]?.accountIds
        }

        if(type == 'hashpack') {
          this.hashconnect.connectToLocalWallet();
        }

        resolve(this.hashconnectData.pairingString);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async disconnect(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        try {
          await this.hashconnect.disconnect(this.hashconnectData.topic);          
        } catch(error) {
          console.error(error);
        }

        this.hashconnect.clearConnectionsAndData();

        await Storage.remove({ key: 'hashconnect.data' });
        await Storage.remove({ key: 'hashconnect.auth' });

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

  public async loadHashconnectData(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let hashconnectData = await Storage.get({ key: 'hashconnect.data' });

        if (hashconnectData.value) {
          let parsedHashconnectData = JSON.parse(hashconnectData.value);

          if (parsedHashconnectData.accountIds.length > 0) {
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

  public async sendTransaction(transaction: any, accountId: string, returnTransaction: boolean = true) {
    return new Promise(async (resolve, reject) => {
      try {
        const transactionHashPack: MessageTypes.Transaction = {
          topic: this.hashconnectData.topic,
          byteArray: transaction,

          metadata: {
            accountToSign: accountId,
            returnTransaction: returnTransaction,
            hideNft: true
          }
        };

        let response = await this.hashconnect.sendTransaction(
          this.hashconnectData.topic,
          transactionHashPack
        );

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async clearAuthSession(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        await Storage.remove({ key: 'hashconnect.auth' });
        resolve(true);
      } catch(error) {
        reject(error);
      }
    });
  }

  public async getAuthSession(): Promise<any> {
    return new Promise(async(resolve, reject) => {
      try {
        let auth = await Storage.get({
          key: 'hashconnect.auth'
        });

        let authResponse = null;

        if (auth.value) {
          authResponse = JSON.parse(auth.value);
        }

        resolve(authResponse);
      } catch(error) {
        reject(error);
      }
    });
  }

  public async authenticateWallet(walletId: string, signature: any, payload: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let authResponse = await this.hashconnect.authenticate(
          this.hashconnectData.topic,
          walletId,
          signature.serverSigningAccount,
          signature.signature,
          payload);

        if(authResponse.success) {
          await Storage.set({
            key: 'hashconnect.auth',
            value: JSON.stringify(authResponse),
          });
        }

        resolve(authResponse);
      } catch (error) {
        reject(error);
      }
    });
  }
}
