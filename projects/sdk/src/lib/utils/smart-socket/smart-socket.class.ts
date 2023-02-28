import { Inject, Injectable } from "@angular/core";
import { Socket } from 'ngx-socket-io';

/**
 * SmartNodeSocket
 */
@Injectable()

export class SmartNodeSocket extends Socket {
  /**
   * Private property node
   * @type {Object}
  */
  private node: any;

  /**
   * Constructor Method
   * @param {Object} node
   * @param {Object} wallet
   * @param {string} namespace
   * @returns {SmartNodeSocket}
   */
  constructor(
    @Inject(Object) node: any,
    @Inject(Object) wallet: any,
    @Inject(Object) namespace: string = 'smart-node'
  ) {
    node.url = `${node.url.replace('https://', 'wss://').replace('http://', 'ws://')}/${namespace}`;

    super({
      url: node.url,
      options: {
        transports: ["websocket"],
        query: {
          wallet: wallet,
          signedData: null,
          referrer: document.referrer
        }
      }
    });

    this.node = node;
  }

  /**
   * getNode Method
   * @returns {Object}
   */
  getNode(): any {
    return this.node;
  }
}