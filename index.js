// From: https://github.com/ethereum/web3.js/blob/1.0/test/helpers/FakeHttpProvider.js

var FakeProvider = function () {
    var _this = this;
    this.countId = 1;
    this.getResponseStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId,
            result: null
        };
    };
    this.getErrorStub = function () {
        return {
            jsonrpc: '2.0',
            id: _this.countId,
            error: {
                code: 1234,
                message: 'Stub error'
            }
        };
    };

    this.response = [];
    this.error = [];
    this.validation = [];
    this.notificationCallbacks = [];
};

FakeProvider.prototype.send = function (payload) {
    assert.equal(isArray(payload) || isObject(payload), true);

    var error = this.getResponseOrError('error', payload);
    if (error) {
        throw new Error(error.error.message);
    }

    var validation = this.validation.shift();

    if(validation) {
        // imitate plain json object
        validation(JSON.parse(JSON.stringify(payload)));
    }

    return this.getResponseOrError('response', payload);
};

FakeProvider.prototype.sendAsync = function (payload, callback) {
    var _this = this;

    // set id
    if(payload.id)
        this.countId = payload.id;
    // else
    //     this.countId++;

    assert.equal(isArray(payload) || isObject(payload), true);
    assert.equal(isFunction(callback), true);

    var validation = this.validation.shift();

    if (validation) {
        // imitate plain json object
        validation(JSON.parse(JSON.stringify(payload)), callback);
    }

    var response = _this.getResponseOrError('response', payload);
    var error = this.getResponseOrError('error', payload);

    setTimeout(function(){
        callback(error, response);
    }, 1);
};

FakeProvider.prototype.on = function (type, callback) {
    if(type === 'notification') {
        this.notificationCallbacks.push(callback);
    }
};

FakeProvider.prototype.getResponseOrError = function (type, payload) {
    var _this = this;
    var response;

    if(type === 'error')
        response = this.error.shift();
    else
        response = this.response.shift() || this.getResponseStub();

    if(response) {
        if(isArray(response)) {
            response = response.map(function(resp, index) {
                resp.id = payload[index] ? payload[index].id : _this.countId++;
                return resp;
            });
        } else
            response.id = payload.id;
    }

    return response;
};

FakeProvider.prototype.injectNotification = function (notification) {
    var _this = this;
    setTimeout(function(){
        _this.notificationCallbacks.forEach(function(cb){
            if(notification && cb)
                cb(null, notification);
        });
    }, 100);
};

FakeProvider.prototype.injectResponse = function (response) {
    this.response = response;
};

FakeProvider.prototype.injectResult = function (result) {
    var response = this.getResponseStub();
    response.result = result;

    this.response.push(response);
};

FakeProvider.prototype.injectBatchResults = function (results, error) {
    var _this = this;
    this.response.push(results.map(function (r) {
        if(error) {
            var response = _this.getErrorStub();
            response.error.message = r;
        } else {
            var response = _this.getResponseStub();
            response.result = r;
        }
        return response;
    }));
};

FakeProvider.prototype.injectError = function (error) {
    var error = this.getErrorStub();
    error.error = error; // message, code

    this.error.push(error);
};

FakeProvider.prototype.injectValidation = function (callback) {
    this.validation.push(callback);
};

/**
 * Returns true if object is array, otherwise false
 *
 * @method isArray
 * @param {Object}
 * @return {Boolean}
 */
var isArray = function (object) {
    return object instanceof Array;
};

/**
 * Returns true if object is Objet, otherwise false
 *
 * @method isObject
 * @param {Object}
 * @return {Boolean}
 */
var isObject = function (object) {
    return typeof object === 'object';
};

/**
 * Returns true if object is function, otherwise false
 *
 * @method isFunction
 * @param {Object}
 * @return {Boolean}
 */
var isFunction = function (object) {
    return typeof object === 'function';
};

var assert = {
    equal: function(a, b) {
        if(a !== b) {
            throw new Error('Expected "' + a + '" to equal "' + b + '"')
        }
    }
}

module.exports = FakeProvider;
