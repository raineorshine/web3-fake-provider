web3-fake-provider is a mock provider class that can be used with Ethereum `web3.js`. It mocks the behavior of `Web3.providers.HttpProvider`.

Might be useful for testing or having a working web3 instance when your Ethereum node is down.

Originally [part of web3.js](https://github.com/ethereum/web3.js/blob/1.0/test/helpers/FakeHttpProvider.js).

# Install

```sh
npm install web3-fake-provider
```

# Usage

```js
var FakeProvider = require('web3-fake-provider')

var result = '0x47d33b27bb249a2dbab4c0612bf9caf4c1950855';
var provider = new FakeProvider();
web3.setProvider(provider);
provider.injectResult(result);
provider.injectValidation(function (payload) {
    assert.equal(payload.jsonrpc, '2.0');
    assert.equal(payload.method, 'eth_accounts');
    assert.deepEqual(payload.params, []);
});

assert.deepEqual(result, web3.eth.accounts);
```

# LICENSE

GPL-3.0