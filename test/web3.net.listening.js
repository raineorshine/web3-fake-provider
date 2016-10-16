var chai = require('chai');
var assert = chai.assert;
var Web3 = require('web3');
var web3 = new Web3();
var FakeProvider = require('../');

var method = 'listening';

var tests = [{
    result: true,
    formattedResult: true,
    call: 'net_'+ method
}];

describe('web3.net', function () {
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
                var result = web3.net[method];

                // then
                assert.deepEqual(test.formattedResult, result);
            });
        });
    });
});

