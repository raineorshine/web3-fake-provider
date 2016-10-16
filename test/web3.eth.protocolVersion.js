var chai = require('chai');
var assert = chai.assert;
var Web3 = require('web3');
var web3 = new Web3();
var FakeProvider = require('../');

var method = 'protocolVersion';

var tests = [{
    result: ['1234'],
    call: 'eth_'+ method
}];

describe('eth.protocolVersion', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('property test: ' + index, function () {

                // given
                var provider = new FakeProvider();
                web3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, 'net_version');
                    assert.deepEqual(payload.params, []);
                });

                // when
                var result = web3.version.network;

                // then
                assert.deepEqual(test.result, result);
            });
        });
    });
});
