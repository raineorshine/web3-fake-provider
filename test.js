// Original: https://github.com/ethereum/web3.js/blob/e4eb9606aa0aa10fd3eeb0a5e5d67c4fff43e814/test/web3.eth.accounts.js

var chai = require('chai');
var assert = chai.assert;
var Web3 = require('web3');
var web3 = new Web3();
var FakeProvider = require('./');

var method = 'accounts';

var tests = [{
    result: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    formattedResult: ['0x47d33b27bb249a2dbab4c0612bf9caf4c1950855'],
    call: 'eth_' + method
}];

describe('web3.eth', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('property test: ' + index, function () {

                // given
                var provider = new FakeProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, []);
                });

                // when
                var result = web3.eth[method];

                // then
                assert.deepEqual(test.formattedResult, result);
            });
        });
    });
});
