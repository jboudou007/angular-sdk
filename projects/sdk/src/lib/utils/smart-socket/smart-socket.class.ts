import { Inject, Injectable } from "@angular/core";
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SmartNodeSocket extends Socket {
  private node: any;

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

  getNode(): any {
    return this.node;
  }
}