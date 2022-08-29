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
    { provide: 'network', useValue: environment.network}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

Then, you can use the SDK in your `app.component.ts` to setup the events listeners and the main behavior, like in this example:

```js
import { SmartNodeSdkService } from 'src/app/services/src/lib/smart-node-sdk.service';

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

Finally, you can use the `SmartNodeRestService` and the `smartNodeHederaService` to interact with the Smart Nodes.
So for example, if you want to send a launchpad buy transaction, you can do something like this:

```js
responseData  = await this.smartNodeSdkService.getHederaService().launchpadTransaction(
  launchpad_current_round, //fetched from the launchpad endpoint API
  wallet_sender, // the wallet of the buyer
  new Decimal(hbar_amount), // the amount of hbar about to be spent
  token_amount, // the amount of token meant to be received
  token_id, // the tokenID meant to be received, fetched from the launchpad endpoint API 
  token_decimals, // the token's decimals, fetched from the launchpad endpoint API
  null, // memo to add into the transaction, if needed
  launchpad_current_round.fees // the fees to be applied, fetched from the launchpad endpoint API
);

if(responseData.response.success) {
  let signedTransaction = responseData.response.signedTransaction;

  this.smartNodeSdkService.getSocketsService().sendMessageToSmartNodes({
    type: 'launchpadBuy',
    signedTransaction: signedTransaction
  }, 'launchpadBuy');

  // here you can notify the success on the UI...
} else {
  // here you can notify the error on the UI...
  // (for example if user rejected from hashpack)
} 
```

## Services
You can interact with the SDK on a very high level, you don't need to interact with the websockets 
or the network services unless you're doing something very advanced.

The easiest way to use this SDK is to interact with the `SmartNodeRestService` and the `smartNodeHederaService`.
The `SmartNodeSocketsService` is instead used to send SmartMessages to the network's node.

### SmartNodeSocketsService
Most of the methods of this service are meant to be used behind the scene, still the most important method you 
will be using is called `sendMessageToSmartNodes`, and it's used to send the pre-signed transaction to our network.

Nodes will be validating the requested transaction, and sign it if all the validators checks approves it.
An example has been provided previously in the `How to Use the SDK` section, and the list of the messages you can send 
will be listed below:

#### launchpadBuy
Documentation - Work in progress...

#### exchangeSwapRequest
Documentation - Work in progress...

#### joinPool
Documentation - Work in progress...

#### exitPool
Documentation - Work in progress...

#### reserveNft
Documentation - Work in progress...

#### burnLpNft
Documentation - Work in progress...

#### mintLpNft
Documentation - Work in progress...

### smartNodeHederaService
This service is mainly used to send informations and interact with the Smart Nodes.

#### associateToken
Documentation - Work in progress...

#### sendSwapTransaction
Documentation - Work in progress...

#### launchpadTransaction
Documentation - Work in progress...

#### launchpadNftTransaction
Documentation - Work in progress...

#### joinPoolTransaction
Documentation - Work in progress...

#### exitPoolTransaction
Documentation - Work in progress...

### SmartNodeRestService
This service is mainly used to fetch informations from the node, it makes uses of HTTP GET/POST methods.

#### loadLaunchpads
It takes no parameters, returns the list of our launchpads.
```js
let response = await loadLaunchpads();

### loadPools
It takes no parameters, returns the list of our pools.
```js
let response = await loadPools();
```

#### loadTokens
It takes no parameters, returns the list of our tokens.
```js
let response = await loadTokens();
```

#### getAccountInfos
it takes two parameters:\
accountId => the account you want to retrieve the infos from
```js
let response = await getAccountInfos(accountId);
```
#### getAccountBalance
it takes two parameters:\
accountId => the account you want to retrieve the balances from
```js
let response = await getAccountBalance(accountId);
```

#### createPool
it takes two parameters:\
pool => an object shaped as follows
```js
let pool = {
  "baseToken": {
    "id": "string"
  },
  "swapToken": {
    "id": "string"
  }
}
```

You can call the method by running:
```js
let response = await createPool(pool);
```

#### calculatePoolPrice
it takes four parameters:\
amount => the amount you want to swap
baseToken => the id of the token you want to swap
swapToken => the id of the token you want to receive

You can call the method by running:
```js
let response = await calculatePoolPrice(amount, baseToken, swapToken);
```