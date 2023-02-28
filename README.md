# HSuite - Smart Node - Angular SDK
Welcome to Hsuite Angular SDK!
This library is meant to provide an easy-to-use interface to interact with our Smart Node Network, and to integrate our features into your own DAPP.
Right now we decided to release just an Angular-SDK because our DAPP is Angular based, but feel free to take this as an inspiration to develop the SDK into any other framework you like.

## What's Hsuite?
Hsuite is an Hedera based technology, it makes uses of the power of Hedera to run the so called "Smart Nodes", which are a decentralised alternative to Smart Contract for Hedera Hashgraph.

If you want to know more about the project, check out the official links:
[Website](https://www.hsuite.finance/) |
[Docs](https://docs.hsuite.finance/)

follow us on socials:
[Twitter](https://twitter.com/hbarsuite) |
[Discord](https://discord.gg/tHn2BXV5hk)

Every single node of the network acts in a decentralised manner, so you can basically query each node and obtain the same identical response.
We provided also very basic swagger interface as well, which can be found under /api of every node, so for instance you will find the swagger for testnet nodes by following those links (those urls are just an example, you will find the same /api swagger interface on any of our network's nodes):

[Testnet - Smart Node 1 - API](https://testnet-sn1.hbarsuite.network/api)\
[Testnet - Smart Node 2 - API](https://testnet-sn2.hbarsuite.network/api)\
[Testnet - Smart Node 3 - API](https://testnet-sn3.hbarsuite.network/api)\
[Testnet - Smart Node 4 - API](https://testnet-sn4.hbarsuite.network/api)
## Installation
If you use npm, you shall run:
```bash
npm install @hsuite/smart-node-sdk
```
instead, if you use yarn:
```bash
yarn add @hsuite/smart-node-sdk
```

## How to Use the SDK
Into your `app.module.ts` you should import our SDK and also provide the network you wish to work with, either `'testnet' | 'mainnet'`.

```js
import { SmartNodeSdkModule } from 'src/app/services/src/lib/smart-node-sdk.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SmartNodeSdkModule
  ],
  providers: [
    { provide: 'network', useValue: 'mainnet'}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

Then, you can use the SDK in your `app.component.ts` to setup the events listeners and the main behavior, like in this example:

```js
import { SmartNodeSdkService } from '@hsuite/angular-sdk';

// subscribing to webSockets authentication events...
this.smartNodeSdkService.getEventsObserver().subscribe(async(event) => {
  switch(event.method) {
    case 'authentication':
      // this event will open an authenticate request on hashpack, you can
      // use this event to show a loading spinner, or any other UI interaction...
      break;
    case 'authenticate':
      // this event will let you know if the user signed the auth on hashpack,
      // or either rejected it, so you can do your UI login in here...
      break;
    case 'events':
      // those are generic events, so you can handle all your UI logic related to
      // any of the feature you're interacting with (launchpad, dex, dao, etc)
      break;
    case 'error':
      // those events will show you any error coming from your interaction with smart nodes
      // you can use those events to show those error in your UI...
      break;
  }    
});  

this.smartNodeSdkService.getHashPackService().observeHashpackConnection.subscribe(async(savedData) => {
  // this observer will let your DAPP know any login/logout/connection events related to hashpack itself...
});
```

## Services
You can interact with the SDK on a very high level, you don't need to interact with the websockets 
or the network services unless you're doing something very advanced.

Nodes will be validating the requested transaction, and sign it if all the validators checks approves it.

### SmartNodeSdkService
The easiest way to use this SDK is to interact only with the `SmartNodeSdkService`.
There are few methods to help you out interacting with the all underlying layer.

The EventsObserver will provide you an easy access to all events triggered by the SmartNode Network.
```js
getEventsObserver()
```

The NetworkService provides all the methods you might need in order to interact with the SmartNode Network on a lower level.
```js
getNetworkService()
```

The HashPackService is basically wrapping all the interactions with HashPask into an easy-to-use service, so to avoid any headacke. 
```js
getHashPackService()
```

The RestService provides all the methods you need to interact with the SmartNode HTTP GET Methods (read-only)
```js
getRestService()
```

The SocketService handles all the websockets connections on a low level, keeping track of healthy nodes and providing an easy-to-handle interface.
```js
getSocketsService()
```

The HederaService offers some methods (like AssociateToken for example), to facilitate some interaction by wrapping the most common use cases.
```js
getHederaService()
```