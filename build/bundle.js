(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pathwayCommons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var iconvLite = require('iconv-lite');
// Load Iconv from an external file to be able to disable Iconv for webpack
// Add /\/iconv-loader$/ to webpack.IgnorePlugin to ignore it
var Iconv = require('./iconv-loader');

// Expose to the world
module.exports.convert = convert;

/**
 * Convert encoding of an UTF-8 string or a buffer
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @param {Boolean} useLite If set to ture, force to use iconvLite
 * @return {Buffer} Encoded string
 */
function convert(str, to, from, useLite) {
    from = checkEncoding(from || 'UTF-8');
    to = checkEncoding(to || 'UTF-8');
    str = str || '';

    var result;

    if (from !== 'UTF-8' && typeof str === 'string') {
        str = new Buffer(str, 'binary');
    }

    if (from === to) {
        if (typeof str === 'string') {
            result = new Buffer(str);
        } else {
            result = str;
        }
    } else if (Iconv && !useLite) {
        try {
            result = convertIconv(str, to, from);
        } catch (E) {
            console.error(E);
            try {
                result = convertIconvLite(str, to, from);
            } catch (E) {
                console.error(E);
                result = str;
            }
        }
    } else {
        try {
            result = convertIconvLite(str, to, from);
        } catch (E) {
            console.error(E);
            result = str;
        }
    }


    if (typeof result === 'string') {
        result = new Buffer(result, 'utf-8');
    }

    return result;
}

/**
 * Convert encoding of a string with node-iconv (if available)
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @return {Buffer} Encoded string
 */
function convertIconv(str, to, from) {
    var response, iconv;
    iconv = new Iconv(from, to + '//TRANSLIT//IGNORE');
    response = iconv.convert(str);
    return response.slice(0, response.length);
}

/**
 * Convert encoding of astring with iconv-lite
 *
 * @param {String|Buffer} str String to be converted
 * @param {String} to Encoding to be converted to
 * @param {String} [from='UTF-8'] Encoding to be converted from
 * @return {Buffer} Encoded string
 */
function convertIconvLite(str, to, from) {
    if (to === 'UTF-8') {
        return iconvLite.decode(str, from);
    } else if (from === 'UTF-8') {
        return iconvLite.encode(str, to);
    } else {
        return iconvLite.encode(iconvLite.decode(str, from), to);
    }
}

/**
 * Converts charset name if needed
 *
 * @param {String} name Character set
 * @return {String} Character set name
 */
function checkEncoding(name) {
    return (name || '').toString().trim().
    replace(/^latin[\-_]?(\d+)$/i, 'ISO-8859-$1').
    replace(/^win(?:dows)?[\-_]?(\d+)$/i, 'WINDOWS-$1').
    replace(/^utf[\-_]?(\d+)$/i, 'UTF-$1').
    replace(/^ks_c_5601\-1987$/i, 'CP949').
    replace(/^us[\-_]?ascii$/i, 'ASCII').
    toUpperCase();
}

},{"./iconv-loader":2,"iconv-lite":23}],2:[function(require,module,exports){
'use strict';

var iconv_package;
var Iconv;

try {
    // this is to fool browserify so it doesn't try (in vain) to install iconv.
    iconv_package = 'iconv';
    Iconv = require(iconv_package).Iconv;
} catch (E) {
    // node-iconv not present
}

module.exports = Iconv;

},{}],3:[function(require,module,exports){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

},{}],4:[function(require,module,exports){
"use strict"

// Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
// Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
// To save memory and loading time, we read table files only when requested.

exports._dbcs = DBCSCodec;

var UNASSIGNED = -1,
    GB18030_CODE = -2,
    SEQ_START  = -10,
    NODE_START = -1000,
    UNASSIGNED_NODE = new Array(0x100),
    DEF_CHAR = -1;

for (var i = 0; i < 0x100; i++)
    UNASSIGNED_NODE[i] = UNASSIGNED;


// Class DBCSCodec reads and initializes mapping tables.
function DBCSCodec(codecOptions, iconv) {
    this.encodingName = codecOptions.encodingName;
    if (!codecOptions)
        throw new Error("DBCS codec is called without the data.")
    if (!codecOptions.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");

    // Load tables.
    var mappingTable = codecOptions.table();


    // Decode tables: MBCS -> Unicode.

    // decodeTables is a trie, encoded as an array of arrays of integers. Internal arrays are trie nodes and all have len = 256.
    // Trie root is decodeTables[0].
    // Values: >=  0 -> unicode character code. can be > 0xFFFF
    //         == UNASSIGNED -> unknown/unassigned sequence.
    //         == GB18030_CODE -> this is the end of a GB18030 4-byte sequence.
    //         <= NODE_START -> index of the next node in our trie to process next byte.
    //         <= SEQ_START  -> index of the start of a character code sequence, in decodeTableSeq.
    this.decodeTables = [];
    this.decodeTables[0] = UNASSIGNED_NODE.slice(0); // Create root node.

    // Sometimes a MBCS char corresponds to a sequence of unicode chars. We store them as arrays of integers here. 
    this.decodeTableSeq = [];

    // Actual mapping tables consist of chunks. Use them to fill up decode tables.
    for (var i = 0; i < mappingTable.length; i++)
        this._addDecodeChunk(mappingTable[i]);

    this.defaultCharUnicode = iconv.defaultCharUnicode;

    
    // Encode tables: Unicode -> DBCS.

    // `encodeTable` is array mapping from unicode char to encoded char. All its values are integers for performance.
    // Because it can be sparse, it is represented as array of buckets by 256 chars each. Bucket can be null.
    // Values: >=  0 -> it is a normal char. Write the value (if <=256 then 1 byte, if <=65536 then 2 bytes, etc.).
    //         == UNASSIGNED -> no conversion found. Output a default char.
    //         <= SEQ_START  -> it's an index in encodeTableSeq, see below. The character starts a sequence.
    this.encodeTable = [];
    
    // `encodeTableSeq` is used when a sequence of unicode characters is encoded as a single code. We use a tree of
    // objects where keys correspond to characters in sequence and leafs are the encoded dbcs values. A special DEF_CHAR key
    // means end of sequence (needed when one sequence is a strict subsequence of another).
    // Objects are kept separately from encodeTable to increase performance.
    this.encodeTableSeq = [];

    // Some chars can be decoded, but need not be encoded.
    var skipEncodeChars = {};
    if (codecOptions.encodeSkipVals)
        for (var i = 0; i < codecOptions.encodeSkipVals.length; i++) {
            var val = codecOptions.encodeSkipVals[i];
            if (typeof val === 'number')
                skipEncodeChars[val] = true;
            else
                for (var j = val.from; j <= val.to; j++)
                    skipEncodeChars[j] = true;
        }
        
    // Use decode trie to recursively fill out encode tables.
    this._fillEncodeTable(0, 0, skipEncodeChars);

    // Add more encoding pairs when needed.
    if (codecOptions.encodeAdd) {
        for (var uChar in codecOptions.encodeAdd)
            if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
                this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
    }

    this.defCharSB  = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]['?'];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);


    // Load & create GB18030 tables when needed.
    if (typeof codecOptions.gb18030 === 'function') {
        this.gb18030 = codecOptions.gb18030(); // Load GB18030 ranges.

        // Add GB18030 decode tables.
        var thirdByteNodeIdx = this.decodeTables.length;
        var thirdByteNode = this.decodeTables[thirdByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        var fourthByteNodeIdx = this.decodeTables.length;
        var fourthByteNode = this.decodeTables[fourthByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        for (var i = 0x81; i <= 0xFE; i++) {
            var secondByteNodeIdx = NODE_START - this.decodeTables[0][i];
            var secondByteNode = this.decodeTables[secondByteNodeIdx];
            for (var j = 0x30; j <= 0x39; j++)
                secondByteNode[j] = NODE_START - thirdByteNodeIdx;
        }
        for (var i = 0x81; i <= 0xFE; i++)
            thirdByteNode[i] = NODE_START - fourthByteNodeIdx;
        for (var i = 0x30; i <= 0x39; i++)
            fourthByteNode[i] = GB18030_CODE
    }        
}

DBCSCodec.prototype.encoder = DBCSEncoder;
DBCSCodec.prototype.decoder = DBCSDecoder;

// Decoder helpers
DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
    var bytes = [];
    for (; addr > 0; addr >>= 8)
        bytes.push(addr & 0xFF);
    if (bytes.length == 0)
        bytes.push(0);

    var node = this.decodeTables[0];
    for (var i = bytes.length-1; i > 0; i--) { // Traverse nodes deeper into the trie.
        var val = node[bytes[i]];

        if (val == UNASSIGNED) { // Create new node.
            node[bytes[i]] = NODE_START - this.decodeTables.length;
            this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
        }
        else if (val <= NODE_START) { // Existing node.
            node = this.decodeTables[NODE_START - val];
        }
        else
            throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
    }
    return node;
}


DBCSCodec.prototype._addDecodeChunk = function(chunk) {
    // First element of chunk is the hex mbcs code where we start.
    var curAddr = parseInt(chunk[0], 16);

    // Choose the decoding node where we'll write our chars.
    var writeTable = this._getDecodeTrieNode(curAddr);
    curAddr = curAddr & 0xFF;

    // Write all other elements of the chunk to the table.
    for (var k = 1; k < chunk.length; k++) {
        var part = chunk[k];
        if (typeof part === "string") { // String, write as-is.
            for (var l = 0; l < part.length;) {
                var code = part.charCodeAt(l++);
                if (0xD800 <= code && code < 0xDC00) { // Decode surrogate
                    var codeTrail = part.charCodeAt(l++);
                    if (0xDC00 <= codeTrail && codeTrail < 0xE000)
                        writeTable[curAddr++] = 0x10000 + (code - 0xD800) * 0x400 + (codeTrail - 0xDC00);
                    else
                        throw new Error("Incorrect surrogate pair in "  + this.encodingName + " at chunk " + chunk[0]);
                }
                else if (0x0FF0 < code && code <= 0x0FFF) { // Character sequence (our own encoding used)
                    var len = 0xFFF - code + 2;
                    var seq = [];
                    for (var m = 0; m < len; m++)
                        seq.push(part.charCodeAt(l++)); // Simple variation: don't support surrogates or subsequences in seq.

                    writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
                    this.decodeTableSeq.push(seq);
                }
                else
                    writeTable[curAddr++] = code; // Basic char
            }
        } 
        else if (typeof part === "number") { // Integer, meaning increasing sequence starting with prev character.
            var charCode = writeTable[curAddr - 1] + 1;
            for (var l = 0; l < part; l++)
                writeTable[curAddr++] = charCode++;
        }
        else
            throw new Error("Incorrect type '" + typeof part + "' given in "  + this.encodingName + " at chunk " + chunk[0]);
    }
    if (curAddr > 0xFF)
        throw new Error("Incorrect chunk in "  + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
}

// Encoder helpers
DBCSCodec.prototype._getEncodeBucket = function(uCode) {
    var high = uCode >> 8; // This could be > 0xFF because of astral characters.
    if (this.encodeTable[high] === undefined)
        this.encodeTable[high] = UNASSIGNED_NODE.slice(0); // Create bucket on demand.
    return this.encodeTable[high];
}

DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;
    if (bucket[low] <= SEQ_START)
        this.encodeTableSeq[SEQ_START-bucket[low]][DEF_CHAR] = dbcsCode; // There's already a sequence, set a single-char subsequence of it.
    else if (bucket[low] == UNASSIGNED)
        bucket[low] = dbcsCode;
}

DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
    
    // Get the root of character tree according to first character of the sequence.
    var uCode = seq[0];
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;

    var node;
    if (bucket[low] <= SEQ_START) {
        // There's already a sequence with  - use it.
        node = this.encodeTableSeq[SEQ_START-bucket[low]];
    }
    else {
        // There was no sequence object - allocate a new one.
        node = {};
        if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low]; // If a char was set before - make it a single-char subsequence.
        bucket[low] = SEQ_START - this.encodeTableSeq.length;
        this.encodeTableSeq.push(node);
    }

    // Traverse the character tree, allocating new nodes as needed.
    for (var j = 1; j < seq.length-1; j++) {
        var oldVal = node[uCode];
        if (typeof oldVal === 'object')
            node = oldVal;
        else {
            node = node[uCode] = {}
            if (oldVal !== undefined)
                node[DEF_CHAR] = oldVal
        }
    }

    // Set the leaf to given dbcsCode.
    uCode = seq[seq.length-1];
    node[uCode] = dbcsCode;
}

DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
    var node = this.decodeTables[nodeIdx];
    for (var i = 0; i < 0x100; i++) {
        var uCode = node[i];
        var mbCode = prefix + i;
        if (skipEncodeChars[mbCode])
            continue;

        if (uCode >= 0)
            this._setEncodeChar(uCode, mbCode);
        else if (uCode <= NODE_START)
            this._fillEncodeTable(NODE_START - uCode, mbCode << 8, skipEncodeChars);
        else if (uCode <= SEQ_START)
            this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
    }
}



// == Encoder ==================================================================

function DBCSEncoder(options, codec) {
    // Encoder state
    this.leadSurrogate = -1;
    this.seqObj = undefined;
    
    // Static data
    this.encodeTable = codec.encodeTable;
    this.encodeTableSeq = codec.encodeTableSeq;
    this.defaultCharSingleByte = codec.defCharSB;
    this.gb18030 = codec.gb18030;
}

DBCSEncoder.prototype.write = function(str) {
    var newBuf = new Buffer(str.length * (this.gb18030 ? 4 : 3)), 
        leadSurrogate = this.leadSurrogate,
        seqObj = this.seqObj, nextChar = -1,
        i = 0, j = 0;

    while (true) {
        // 0. Get next character.
        if (nextChar === -1) {
            if (i == str.length) break;
            var uCode = str.charCodeAt(i++);
        }
        else {
            var uCode = nextChar;
            nextChar = -1;    
        }

        // 1. Handle surrogates.
        if (0xD800 <= uCode && uCode < 0xE000) { // Char is one of surrogates.
            if (uCode < 0xDC00) { // We've got lead surrogate.
                if (leadSurrogate === -1) {
                    leadSurrogate = uCode;
                    continue;
                } else {
                    leadSurrogate = uCode;
                    // Double lead surrogate found.
                    uCode = UNASSIGNED;
                }
            } else { // We've got trail surrogate.
                if (leadSurrogate !== -1) {
                    uCode = 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (uCode - 0xDC00);
                    leadSurrogate = -1;
                } else {
                    // Incomplete surrogate pair - only trail surrogate found.
                    uCode = UNASSIGNED;
                }
                
            }
        }
        else if (leadSurrogate !== -1) {
            // Incomplete surrogate pair - only lead surrogate found.
            nextChar = uCode; uCode = UNASSIGNED; // Write an error, then current char.
            leadSurrogate = -1;
        }

        // 2. Convert uCode character.
        var dbcsCode = UNASSIGNED;
        if (seqObj !== undefined && uCode != UNASSIGNED) { // We are in the middle of the sequence
            var resCode = seqObj[uCode];
            if (typeof resCode === 'object') { // Sequence continues.
                seqObj = resCode;
                continue;

            } else if (typeof resCode == 'number') { // Sequence finished. Write it.
                dbcsCode = resCode;

            } else if (resCode == undefined) { // Current character is not part of the sequence.

                // Try default character for this sequence
                resCode = seqObj[DEF_CHAR];
                if (resCode !== undefined) {
                    dbcsCode = resCode; // Found. Write it.
                    nextChar = uCode; // Current character will be written too in the next iteration.

                } else {
                    // TODO: What if we have no default? (resCode == undefined)
                    // Then, we should write first char of the sequence as-is and try the rest recursively.
                    // Didn't do it for now because no encoding has this situation yet.
                    // Currently, just skip the sequence and write current char.
                }
            }
            seqObj = undefined;
        }
        else if (uCode >= 0) {  // Regular character
            var subtable = this.encodeTable[uCode >> 8];
            if (subtable !== undefined)
                dbcsCode = subtable[uCode & 0xFF];
            
            if (dbcsCode <= SEQ_START) { // Sequence start
                seqObj = this.encodeTableSeq[SEQ_START-dbcsCode];
                continue;
            }

            if (dbcsCode == UNASSIGNED && this.gb18030) {
                // Use GB18030 algorithm to find character(s) to write.
                var idx = findIdx(this.gb18030.uChars, uCode);
                if (idx != -1) {
                    var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 12600); dbcsCode = dbcsCode % 12600;
                    newBuf[j++] = 0x30 + Math.floor(dbcsCode / 1260); dbcsCode = dbcsCode % 1260;
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 10); dbcsCode = dbcsCode % 10;
                    newBuf[j++] = 0x30 + dbcsCode;
                    continue;
                }
            }
        }

        // 3. Write dbcsCode character.
        if (dbcsCode === UNASSIGNED)
            dbcsCode = this.defaultCharSingleByte;
        
        if (dbcsCode < 0x100) {
            newBuf[j++] = dbcsCode;
        }
        else if (dbcsCode < 0x10000) {
            newBuf[j++] = dbcsCode >> 8;   // high byte
            newBuf[j++] = dbcsCode & 0xFF; // low byte
        }
        else {
            newBuf[j++] = dbcsCode >> 16;
            newBuf[j++] = (dbcsCode >> 8) & 0xFF;
            newBuf[j++] = dbcsCode & 0xFF;
        }
    }

    this.seqObj = seqObj;
    this.leadSurrogate = leadSurrogate;
    return newBuf.slice(0, j);
}

DBCSEncoder.prototype.end = function() {
    if (this.leadSurrogate === -1 && this.seqObj === undefined)
        return; // All clean. Most often case.

    var newBuf = new Buffer(10), j = 0;

    if (this.seqObj) { // We're in the sequence.
        var dbcsCode = this.seqObj[DEF_CHAR];
        if (dbcsCode !== undefined) { // Write beginning of the sequence.
            if (dbcsCode < 0x100) {
                newBuf[j++] = dbcsCode;
            }
            else {
                newBuf[j++] = dbcsCode >> 8;   // high byte
                newBuf[j++] = dbcsCode & 0xFF; // low byte
            }
        } else {
            // See todo above.
        }
        this.seqObj = undefined;
    }

    if (this.leadSurrogate !== -1) {
        // Incomplete surrogate pair - only lead surrogate found.
        newBuf[j++] = this.defaultCharSingleByte;
        this.leadSurrogate = -1;
    }
    
    return newBuf.slice(0, j);
}

// Export for testing
DBCSEncoder.prototype.findIdx = findIdx;


// == Decoder ==================================================================

function DBCSDecoder(options, codec) {
    // Decoder state
    this.nodeIdx = 0;
    this.prevBuf = new Buffer(0);

    // Static data
    this.decodeTables = codec.decodeTables;
    this.decodeTableSeq = codec.decodeTableSeq;
    this.defaultCharUnicode = codec.defaultCharUnicode;
    this.gb18030 = codec.gb18030;
}

DBCSDecoder.prototype.write = function(buf) {
    var newBuf = new Buffer(buf.length*2),
        nodeIdx = this.nodeIdx, 
        prevBuf = this.prevBuf, prevBufOffset = this.prevBuf.length,
        seqStart = -this.prevBuf.length, // idx of the start of current parsed sequence.
        uCode;

    if (prevBufOffset > 0) // Make prev buf overlap a little to make it easier to slice later.
        prevBuf = Buffer.concat([prevBuf, buf.slice(0, 10)]);
    
    for (var i = 0, j = 0; i < buf.length; i++) {
        var curByte = (i >= 0) ? buf[i] : prevBuf[i + prevBufOffset];

        // Lookup in current trie node.
        var uCode = this.decodeTables[nodeIdx][curByte];

        if (uCode >= 0) { 
            // Normal character, just use it.
        }
        else if (uCode === UNASSIGNED) { // Unknown char.
            // TODO: Callback with seq.
            //var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            i = seqStart; // Try to parse again, after skipping first byte of the sequence ('i' will be incremented by 'for' cycle).
            uCode = this.defaultCharUnicode.charCodeAt(0);
        }
        else if (uCode === GB18030_CODE) {
            var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            var ptr = (curSeq[0]-0x81)*12600 + (curSeq[1]-0x30)*1260 + (curSeq[2]-0x81)*10 + (curSeq[3]-0x30);
            var idx = findIdx(this.gb18030.gbChars, ptr);
            uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
        }
        else if (uCode <= NODE_START) { // Go to next trie node.
            nodeIdx = NODE_START - uCode;
            continue;
        }
        else if (uCode <= SEQ_START) { // Output a sequence of chars.
            var seq = this.decodeTableSeq[SEQ_START - uCode];
            for (var k = 0; k < seq.length - 1; k++) {
                uCode = seq[k];
                newBuf[j++] = uCode & 0xFF;
                newBuf[j++] = uCode >> 8;
            }
            uCode = seq[seq.length-1];
        }
        else
            throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);

        // Write the character to buffer, handling higher planes using surrogate pair.
        if (uCode > 0xFFFF) { 
            uCode -= 0x10000;
            var uCodeLead = 0xD800 + Math.floor(uCode / 0x400);
            newBuf[j++] = uCodeLead & 0xFF;
            newBuf[j++] = uCodeLead >> 8;

            uCode = 0xDC00 + uCode % 0x400;
        }
        newBuf[j++] = uCode & 0xFF;
        newBuf[j++] = uCode >> 8;

        // Reset trie node.
        nodeIdx = 0; seqStart = i+1;
    }

    this.nodeIdx = nodeIdx;
    this.prevBuf = (seqStart >= 0) ? buf.slice(seqStart) : prevBuf.slice(seqStart + prevBufOffset);
    return newBuf.slice(0, j).toString('ucs2');
}

DBCSDecoder.prototype.end = function() {
    var ret = '';

    // Try to parse all remaining chars.
    while (this.prevBuf.length > 0) {
        // Skip 1 character in the buffer.
        ret += this.defaultCharUnicode;
        var buf = this.prevBuf.slice(1);

        // Parse remaining as usual.
        this.prevBuf = new Buffer(0);
        this.nodeIdx = 0;
        if (buf.length > 0)
            ret += this.write(buf);
    }

    this.nodeIdx = 0;
    return ret;
}

// Binary search for GB18030. Returns largest i such that table[i] <= val.
function findIdx(table, val) {
    if (table[0] > val)
        return -1;

    var l = 0, r = table.length;
    while (l < r-1) { // always table[l] <= val < table[r]
        var mid = l + Math.floor((r-l+1)/2);
        if (table[mid] <= val)
            l = mid;
        else
            r = mid;
    }
    return l;
}


},{}],5:[function(require,module,exports){
"use strict"

// Description of supported double byte encodings and aliases.
// Tables are not require()-d until they are needed to speed up library load.
// require()-s are direct to support Browserify.

module.exports = {
    
    // == Japanese/ShiftJIS ====================================================
    // All japanese encodings are based on JIS X set of standards:
    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
    //              Has several variations in 1978, 1983, 1990 and 1997.
    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
    //              2 planes, first is superset of 0208, second - revised 0212.
    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)

    // Byte encodings are:
    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
    //               0x00-0x7F       - lower part of 0201
    //               0x8E, 0xA1-0xDF - upper part of 0201
    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
    //               Used as-is in ISO2022 family.
    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
    //                0201-1976 Roman, 0208-1978, 0208-1983.
    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
    //
    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
    //
    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html


    'shiftjis': {
        type: '_dbcs',
        table: function() { return require('./tables/shiftjis.json') },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
        encodeSkipVals: [{from: 0xED40, to: 0xF940}],
    },
    'csshiftjis': 'shiftjis',
    'mskanji': 'shiftjis',
    'sjis': 'shiftjis',
    'windows31j': 'shiftjis',
    'xsjis': 'shiftjis',
    'windows932': 'shiftjis',
    '932': 'shiftjis',
    'cp932': 'shiftjis',

    'eucjp': {
        type: '_dbcs',
        table: function() { return require('./tables/eucjp.json') },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
    },

    // TODO: KDDI extension to Shift_JIS
    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.

    // == Chinese/GBK ==========================================================
    // http://en.wikipedia.org/wiki/GBK

    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
    'gb2312': 'cp936',
    'gb231280': 'cp936',
    'gb23121980': 'cp936',
    'csgb2312': 'cp936',
    'csiso58gb231280': 'cp936',
    'euccn': 'cp936',
    'isoir58': 'gbk',

    // Microsoft's CP936 is a subset and approximation of GBK.
    // TODO: Euro = 0x80 in cp936, but not in GBK (where it's valid but undefined)
    'windows936': 'cp936',
    '936': 'cp936',
    'cp936': {
        type: '_dbcs',
        table: function() { return require('./tables/cp936.json') },
    },

    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    'gbk': {
        type: '_dbcs',
        table: function() { return require('./tables/cp936.json').concat(require('./tables/gbk-added.json')) },
    },
    'xgbk': 'gbk',

    // GB18030 is an algorithmic extension of GBK.
    'gb18030': {
        type: '_dbcs',
        table: function() { return require('./tables/cp936.json').concat(require('./tables/gbk-added.json')) },
        gb18030: function() { return require('./tables/gb18030-ranges.json') },
    },

    'chinese': 'gb18030',

    // TODO: Support GB18030 (~27000 chars + whole unicode mapping, cp54936)
    // http://icu-project.org/docs/papers/gb18030.html
    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0

    // == Korean ===============================================================
    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
    'windows949': 'cp949',
    '949': 'cp949',
    'cp949': {
        type: '_dbcs',
        table: function() { return require('./tables/cp949.json') },
    },

    'cseuckr': 'cp949',
    'csksc56011987': 'cp949',
    'euckr': 'cp949',
    'isoir149': 'cp949',
    'korean': 'cp949',
    'ksc56011987': 'cp949',
    'ksc56011989': 'cp949',
    'ksc5601': 'cp949',


    // == Big5/Taiwan/Hong Kong ================================================
    // There are lots of tables for Big5 and cp950. Please see the following links for history:
    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
    // Variations, in roughly number of defined chars:
    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
    //    Plus, it has 4 combining sequences.
    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
    // 
    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.

    'windows950': 'cp950',
    '950': 'cp950',
    'cp950': {
        type: '_dbcs',
        table: function() { return require('./tables/cp950.json') },
    },

    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    'big5': 'big5hkscs',
    'big5hkscs': {
        type: '_dbcs',
        table: function() { return require('./tables/cp950.json').concat(require('./tables/big5-added.json')) },
        encodeSkipVals: [0xa2cc],
    },

    'cnbig5': 'big5hkscs',
    'csbig5': 'big5hkscs',
    'xxbig5': 'big5hkscs',

};

},{"./tables/big5-added.json":11,"./tables/cp936.json":12,"./tables/cp949.json":13,"./tables/cp950.json":14,"./tables/eucjp.json":15,"./tables/gb18030-ranges.json":16,"./tables/gbk-added.json":17,"./tables/shiftjis.json":18}],6:[function(require,module,exports){
"use strict"

// Update this array if you add/rename/remove files in this directory.
// We support Browserify by skipping automatic module discovery and requiring modules directly.
var modules = [
    require("./internal"),
    require("./utf16"),
    require("./utf7"),
    require("./sbcs-codec"),
    require("./sbcs-data"),
    require("./sbcs-data-generated"),
    require("./dbcs-codec"),
    require("./dbcs-data"),
];

// Put all encoding/alias/codec definitions to single object and export it. 
for (var i = 0; i < modules.length; i++) {
    var module = modules[i];
    for (var enc in module)
        if (Object.prototype.hasOwnProperty.call(module, enc))
            exports[enc] = module[enc];
}

},{"./dbcs-codec":4,"./dbcs-data":5,"./internal":7,"./sbcs-codec":8,"./sbcs-data":10,"./sbcs-data-generated":9,"./utf16":19,"./utf7":20}],7:[function(require,module,exports){
"use strict"

// Export Node.js internal encodings.

module.exports = {
    // Encodings
    utf8:   { type: "_internal", bomAware: true},
    cesu8:  { type: "_internal", bomAware: true},
    unicode11utf8: "utf8",

    ucs2:   { type: "_internal", bomAware: true},
    utf16le: "ucs2",

    binary: { type: "_internal" },
    base64: { type: "_internal" },
    hex:    { type: "_internal" },

    // Codec.
    _internal: InternalCodec,
};

//------------------------------------------------------------------------------

function InternalCodec(codecOptions, iconv) {
    this.enc = codecOptions.encodingName;
    this.bomAware = codecOptions.bomAware;

    if (this.enc === "base64")
        this.encoder = InternalEncoderBase64;
    else if (this.enc === "cesu8") {
        this.enc = "utf8"; // Use utf8 for decoding.
        this.encoder = InternalEncoderCesu8;

        // Add decoder for versions of Node not supporting CESU-8
        if (new Buffer("eda080", 'hex').toString().length == 3) {
            this.decoder = InternalDecoderCesu8;
            this.defaultCharUnicode = iconv.defaultCharUnicode;
        }
    }
}

InternalCodec.prototype.encoder = InternalEncoder;
InternalCodec.prototype.decoder = InternalDecoder;

//------------------------------------------------------------------------------

// We use node.js internal decoder. Its signature is the same as ours.
var StringDecoder = require('string_decoder').StringDecoder;

if (!StringDecoder.prototype.end) // Node v0.8 doesn't have this method.
    StringDecoder.prototype.end = function() {};


function InternalDecoder(options, codec) {
    StringDecoder.call(this, codec.enc);
}

InternalDecoder.prototype = StringDecoder.prototype;


//------------------------------------------------------------------------------
// Encoder is mostly trivial

function InternalEncoder(options, codec) {
    this.enc = codec.enc;
}

InternalEncoder.prototype.write = function(str) {
    return new Buffer(str, this.enc);
}

InternalEncoder.prototype.end = function() {
}


//------------------------------------------------------------------------------
// Except base64 encoder, which must keep its state.

function InternalEncoderBase64(options, codec) {
    this.prevStr = '';
}

InternalEncoderBase64.prototype.write = function(str) {
    str = this.prevStr + str;
    var completeQuads = str.length - (str.length % 4);
    this.prevStr = str.slice(completeQuads);
    str = str.slice(0, completeQuads);

    return new Buffer(str, "base64");
}

InternalEncoderBase64.prototype.end = function() {
    return new Buffer(this.prevStr, "base64");
}


//------------------------------------------------------------------------------
// CESU-8 encoder is also special.

function InternalEncoderCesu8(options, codec) {
}

InternalEncoderCesu8.prototype.write = function(str) {
    var buf = new Buffer(str.length * 3), bufIdx = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        // Naive implementation, but it works because CESU-8 is especially easy
        // to convert from UTF-16 (which all JS strings are encoded in).
        if (charCode < 0x80)
            buf[bufIdx++] = charCode;
        else if (charCode < 0x800) {
            buf[bufIdx++] = 0xC0 + (charCode >>> 6);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
        else { // charCode will always be < 0x10000 in javascript.
            buf[bufIdx++] = 0xE0 + (charCode >>> 12);
            buf[bufIdx++] = 0x80 + ((charCode >>> 6) & 0x3f);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
    }
    return buf.slice(0, bufIdx);
}

InternalEncoderCesu8.prototype.end = function() {
}

//------------------------------------------------------------------------------
// CESU-8 decoder is not implemented in Node v4.0+

function InternalDecoderCesu8(options, codec) {
    this.acc = 0;
    this.contBytes = 0;
    this.accBytes = 0;
    this.defaultCharUnicode = codec.defaultCharUnicode;
}

InternalDecoderCesu8.prototype.write = function(buf) {
    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, 
        res = '';
    for (var i = 0; i < buf.length; i++) {
        var curByte = buf[i];
        if ((curByte & 0xC0) !== 0x80) { // Leading byte
            if (contBytes > 0) { // Previous code is invalid
                res += this.defaultCharUnicode;
                contBytes = 0;
            }

            if (curByte < 0x80) { // Single-byte code
                res += String.fromCharCode(curByte);
            } else if (curByte < 0xE0) { // Two-byte code
                acc = curByte & 0x1F;
                contBytes = 1; accBytes = 1;
            } else if (curByte < 0xF0) { // Three-byte code
                acc = curByte & 0x0F;
                contBytes = 2; accBytes = 1;
            } else { // Four or more are not supported for CESU-8.
                res += this.defaultCharUnicode;
            }
        } else { // Continuation byte
            if (contBytes > 0) { // We're waiting for it.
                acc = (acc << 6) | (curByte & 0x3f);
                contBytes--; accBytes++;
                if (contBytes === 0) {
                    // Check for overlong encoding, but support Modified UTF-8 (encoding NULL as C0 80)
                    if (accBytes === 2 && acc < 0x80 && acc > 0)
                        res += this.defaultCharUnicode;
                    else if (accBytes === 3 && acc < 0x800)
                        res += this.defaultCharUnicode;
                    else
                        // Actually add character.
                        res += String.fromCharCode(acc);
                }
            } else { // Unexpected continuation byte
                res += this.defaultCharUnicode;
            }
        }
    }
    this.acc = acc; this.contBytes = contBytes; this.accBytes = accBytes;
    return res;
}

InternalDecoderCesu8.prototype.end = function() {
    var res = 0;
    if (this.contBytes > 0)
        res += this.defaultCharUnicode;
    return res;
}

},{"string_decoder":undefined}],8:[function(require,module,exports){
"use strict"

// Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
// correspond to encoded bytes (if 128 - then lower half is ASCII). 

exports._sbcs = SBCSCodec;
function SBCSCodec(codecOptions, iconv) {
    if (!codecOptions)
        throw new Error("SBCS codec is called without the data.")
    
    // Prepare char buffer for decoding.
    if (!codecOptions.chars || (codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256))
        throw new Error("Encoding '"+codecOptions.type+"' has incorrect 'chars' (must be of len 128 or 256)");
    
    if (codecOptions.chars.length === 128) {
        var asciiString = "";
        for (var i = 0; i < 128; i++)
            asciiString += String.fromCharCode(i);
        codecOptions.chars = asciiString + codecOptions.chars;
    }

    this.decodeBuf = new Buffer(codecOptions.chars, 'ucs2');
    
    // Encoding buffer.
    var encodeBuf = new Buffer(65536);
    encodeBuf.fill(iconv.defaultCharSingleByte.charCodeAt(0));

    for (var i = 0; i < codecOptions.chars.length; i++)
        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;

    this.encodeBuf = encodeBuf;
}

SBCSCodec.prototype.encoder = SBCSEncoder;
SBCSCodec.prototype.decoder = SBCSDecoder;


function SBCSEncoder(options, codec) {
    this.encodeBuf = codec.encodeBuf;
}

SBCSEncoder.prototype.write = function(str) {
    var buf = new Buffer(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = this.encodeBuf[str.charCodeAt(i)];
    
    return buf;
}

SBCSEncoder.prototype.end = function() {
}


function SBCSDecoder(options, codec) {
    this.decodeBuf = codec.decodeBuf;
}

SBCSDecoder.prototype.write = function(buf) {
    // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
    var decodeBuf = this.decodeBuf;
    var newBuf = new Buffer(buf.length*2);
    var idx1 = 0, idx2 = 0;
    for (var i = 0; i < buf.length; i++) {
        idx1 = buf[i]*2; idx2 = i*2;
        newBuf[idx2] = decodeBuf[idx1];
        newBuf[idx2+1] = decodeBuf[idx1+1];
    }
    return newBuf.toString('ucs2');
}

SBCSDecoder.prototype.end = function() {
}

},{}],9:[function(require,module,exports){
"use strict"

// Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
module.exports = {
  "437": "cp437",
  "737": "cp737",
  "775": "cp775",
  "850": "cp850",
  "852": "cp852",
  "855": "cp855",
  "856": "cp856",
  "857": "cp857",
  "858": "cp858",
  "860": "cp860",
  "861": "cp861",
  "862": "cp862",
  "863": "cp863",
  "864": "cp864",
  "865": "cp865",
  "866": "cp866",
  "869": "cp869",
  "874": "windows874",
  "922": "cp922",
  "1046": "cp1046",
  "1124": "cp1124",
  "1125": "cp1125",
  "1129": "cp1129",
  "1133": "cp1133",
  "1161": "cp1161",
  "1162": "cp1162",
  "1163": "cp1163",
  "1250": "windows1250",
  "1251": "windows1251",
  "1252": "windows1252",
  "1253": "windows1253",
  "1254": "windows1254",
  "1255": "windows1255",
  "1256": "windows1256",
  "1257": "windows1257",
  "1258": "windows1258",
  "28591": "iso88591",
  "28592": "iso88592",
  "28593": "iso88593",
  "28594": "iso88594",
  "28595": "iso88595",
  "28596": "iso88596",
  "28597": "iso88597",
  "28598": "iso88598",
  "28599": "iso88599",
  "28600": "iso885910",
  "28601": "iso885911",
  "28603": "iso885913",
  "28604": "iso885914",
  "28605": "iso885915",
  "28606": "iso885916",
  "windows874": {
    "type": "_sbcs",
    "chars": "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "win874": "windows874",
  "cp874": "windows874",
  "windows1250": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "win1250": "windows1250",
  "cp1250": "windows1250",
  "windows1251": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "win1251": "windows1251",
  "cp1251": "windows1251",
  "windows1252": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "win1252": "windows1252",
  "cp1252": "windows1252",
  "windows1253": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "win1253": "windows1253",
  "cp1253": "windows1253",
  "windows1254": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "win1254": "windows1254",
  "cp1254": "windows1254",
  "windows1255": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹ�ֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "win1255": "windows1255",
  "cp1255": "windows1255",
  "windows1256": {
    "type": "_sbcs",
    "chars": "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
  },
  "win1256": "windows1256",
  "cp1256": "windows1256",
  "windows1257": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
  },
  "win1257": "windows1257",
  "cp1257": "windows1257",
  "windows1258": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "win1258": "windows1258",
  "cp1258": "windows1258",
  "iso88591": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28591": "iso88591",
  "iso88592": {
    "type": "_sbcs",
    "chars": " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "cp28592": "iso88592",
  "iso88593": {
    "type": "_sbcs",
    "chars": " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
  },
  "cp28593": "iso88593",
  "iso88594": {
    "type": "_sbcs",
    "chars": " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
  },
  "cp28594": "iso88594",
  "iso88595": {
    "type": "_sbcs",
    "chars": " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
  },
  "cp28595": "iso88595",
  "iso88596": {
    "type": "_sbcs",
    "chars": " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
  },
  "cp28596": "iso88596",
  "iso88597": {
    "type": "_sbcs",
    "chars": " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "cp28597": "iso88597",
  "iso88598": {
    "type": "_sbcs",
    "chars": " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "cp28598": "iso88598",
  "iso88599": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "cp28599": "iso88599",
  "iso885910": {
    "type": "_sbcs",
    "chars": " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
  },
  "cp28600": "iso885910",
  "iso885911": {
    "type": "_sbcs",
    "chars": " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "cp28601": "iso885911",
  "iso885913": {
    "type": "_sbcs",
    "chars": " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
  },
  "cp28603": "iso885913",
  "iso885914": {
    "type": "_sbcs",
    "chars": " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
  },
  "cp28604": "iso885914",
  "iso885915": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28605": "iso885915",
  "iso885916": {
    "type": "_sbcs",
    "chars": " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
  },
  "cp28606": "iso885916",
  "cp437": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm437": "cp437",
  "csibm437": "cp437",
  "cp737": {
    "type": "_sbcs",
    "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
  },
  "ibm737": "cp737",
  "csibm737": "cp737",
  "cp775": {
    "type": "_sbcs",
    "chars": "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
  },
  "ibm775": "cp775",
  "csibm775": "cp775",
  "cp850": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm850": "cp850",
  "csibm850": "cp850",
  "cp852": {
    "type": "_sbcs",
    "chars": "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
  },
  "ibm852": "cp852",
  "csibm852": "cp852",
  "cp855": {
    "type": "_sbcs",
    "chars": "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
  },
  "ibm855": "cp855",
  "csibm855": "cp855",
  "cp856": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm856": "cp856",
  "csibm856": "cp856",
  "cp857": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
  },
  "ibm857": "cp857",
  "csibm857": "cp857",
  "cp858": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm858": "cp858",
  "csibm858": "cp858",
  "cp860": {
    "type": "_sbcs",
    "chars": "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm860": "cp860",
  "csibm860": "cp860",
  "cp861": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm861": "cp861",
  "csibm861": "cp861",
  "cp862": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm862": "cp862",
  "csibm862": "cp862",
  "cp863": {
    "type": "_sbcs",
    "chars": "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm863": "cp863",
  "csibm863": "cp863",
  "cp864": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"
  },
  "ibm864": "cp864",
  "csibm864": "cp864",
  "cp865": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm865": "cp865",
  "csibm865": "cp865",
  "cp866": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
  },
  "ibm866": "cp866",
  "csibm866": "cp866",
  "cp869": {
    "type": "_sbcs",
    "chars": "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
  },
  "ibm869": "cp869",
  "csibm869": "cp869",
  "cp922": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
  },
  "ibm922": "cp922",
  "csibm922": "cp922",
  "cp1046": {
    "type": "_sbcs",
    "chars": "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
  },
  "ibm1046": "cp1046",
  "csibm1046": "cp1046",
  "cp1124": {
    "type": "_sbcs",
    "chars": " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
  },
  "ibm1124": "cp1124",
  "csibm1124": "cp1124",
  "cp1125": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
  },
  "ibm1125": "cp1125",
  "csibm1125": "cp1125",
  "cp1129": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1129": "cp1129",
  "csibm1129": "cp1129",
  "cp1133": {
    "type": "_sbcs",
    "chars": " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
  },
  "ibm1133": "cp1133",
  "csibm1133": "cp1133",
  "cp1161": {
    "type": "_sbcs",
    "chars": "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
  },
  "ibm1161": "cp1161",
  "csibm1161": "cp1161",
  "cp1162": {
    "type": "_sbcs",
    "chars": "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "ibm1162": "cp1162",
  "csibm1162": "cp1162",
  "cp1163": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1163": "cp1163",
  "csibm1163": "cp1163",
  "maccroatian": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
  },
  "maccyrillic": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "macgreek": {
    "type": "_sbcs",
    "chars": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
  },
  "maciceland": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macroman": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macromania": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macthai": {
    "type": "_sbcs",
    "chars": "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู﻿​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
  },
  "macturkish": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macukraine": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "koi8r": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8u": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8ru": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8t": {
    "type": "_sbcs",
    "chars": "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "armscii8": {
    "type": "_sbcs",
    "chars": " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
  },
  "rk1048": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "tcvn": {
    "type": "_sbcs",
    "chars": "\u0000ÚỤ\u0003ỪỬỮ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010ỨỰỲỶỸÝỴ\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"
  },
  "georgianacademy": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "georgianps": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "pt154": {
    "type": "_sbcs",
    "chars": "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "viscii": {
    "type": "_sbcs",
    "chars": "\u0000\u0001Ẳ\u0003\u0004ẴẪ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013Ỷ\u0015\u0016\u0017\u0018Ỹ\u001a\u001b\u001c\u001dỴ\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"
  },
  "iso646cn": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "iso646jp": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "hproman8": {
    "type": "_sbcs",
    "chars": " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
  },
  "macintosh": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "ascii": {
    "type": "_sbcs",
    "chars": "��������������������������������������������������������������������������������������������������������������������������������"
  },
  "tis620": {
    "type": "_sbcs",
    "chars": "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  }
}
},{}],10:[function(require,module,exports){
"use strict"

// Manually added data to be used by sbcs codec in addition to generated one.

module.exports = {
    // Not supported by iconv, not sure why.
    "10029": "maccenteuro",
    "maccenteuro": {
        "type": "_sbcs",
        "chars": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
    },

    "808": "cp808",
    "ibm808": "cp808",
    "cp808": {
        "type": "_sbcs",
        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
    },

    // Aliases of generated encodings.
    "ascii8bit": "ascii",
    "usascii": "ascii",
    "ansix34": "ascii",
    "ansix341968": "ascii",
    "ansix341986": "ascii",
    "csascii": "ascii",
    "cp367": "ascii",
    "ibm367": "ascii",
    "isoir6": "ascii",
    "iso646us": "ascii",
    "iso646irv": "ascii",
    "us": "ascii",

    "latin1": "iso88591",
    "latin2": "iso88592",
    "latin3": "iso88593",
    "latin4": "iso88594",
    "latin5": "iso88599",
    "latin6": "iso885910",
    "latin7": "iso885913",
    "latin8": "iso885914",
    "latin9": "iso885915",
    "latin10": "iso885916",

    "csisolatin1": "iso88591",
    "csisolatin2": "iso88592",
    "csisolatin3": "iso88593",
    "csisolatin4": "iso88594",
    "csisolatincyrillic": "iso88595",
    "csisolatinarabic": "iso88596",
    "csisolatingreek" : "iso88597",
    "csisolatinhebrew": "iso88598",
    "csisolatin5": "iso88599",
    "csisolatin6": "iso885910",

    "l1": "iso88591",
    "l2": "iso88592",
    "l3": "iso88593",
    "l4": "iso88594",
    "l5": "iso88599",
    "l6": "iso885910",
    "l7": "iso885913",
    "l8": "iso885914",
    "l9": "iso885915",
    "l10": "iso885916",

    "isoir14": "iso646jp",
    "isoir57": "iso646cn",
    "isoir100": "iso88591",
    "isoir101": "iso88592",
    "isoir109": "iso88593",
    "isoir110": "iso88594",
    "isoir144": "iso88595",
    "isoir127": "iso88596",
    "isoir126": "iso88597",
    "isoir138": "iso88598",
    "isoir148": "iso88599",
    "isoir157": "iso885910",
    "isoir166": "tis620",
    "isoir179": "iso885913",
    "isoir199": "iso885914",
    "isoir203": "iso885915",
    "isoir226": "iso885916",

    "cp819": "iso88591",
    "ibm819": "iso88591",

    "cyrillic": "iso88595",

    "arabic": "iso88596",
    "arabic8": "iso88596",
    "ecma114": "iso88596",
    "asmo708": "iso88596",

    "greek" : "iso88597",
    "greek8" : "iso88597",
    "ecma118" : "iso88597",
    "elot928" : "iso88597",

    "hebrew": "iso88598",
    "hebrew8": "iso88598",

    "turkish": "iso88599",
    "turkish8": "iso88599",

    "thai": "iso885911",
    "thai8": "iso885911",

    "celtic": "iso885914",
    "celtic8": "iso885914",
    "isoceltic": "iso885914",

    "tis6200": "tis620",
    "tis62025291": "tis620",
    "tis62025330": "tis620",

    "10000": "macroman",
    "10006": "macgreek",
    "10007": "maccyrillic",
    "10079": "maciceland",
    "10081": "macturkish",

    "cspc8codepage437": "cp437",
    "cspc775baltic": "cp775",
    "cspc850multilingual": "cp850",
    "cspcp852": "cp852",
    "cspc862latinhebrew": "cp862",
    "cpgr": "cp869",

    "msee": "cp1250",
    "mscyrl": "cp1251",
    "msansi": "cp1252",
    "msgreek": "cp1253",
    "msturk": "cp1254",
    "mshebr": "cp1255",
    "msarab": "cp1256",
    "winbaltrim": "cp1257",

    "cp20866": "koi8r",
    "20866": "koi8r",
    "ibm878": "koi8r",
    "cskoi8r": "koi8r",

    "cp21866": "koi8u",
    "21866": "koi8u",
    "ibm1168": "koi8u",

    "strk10482002": "rk1048",

    "tcvn5712": "tcvn",
    "tcvn57121": "tcvn",

    "gb198880": "iso646cn",
    "cn": "iso646cn",

    "csiso14jisc6220ro": "iso646jp",
    "jisc62201969ro": "iso646jp",
    "jp": "iso646jp",

    "cshproman8": "hproman8",
    "r8": "hproman8",
    "roman8": "hproman8",
    "xroman8": "hproman8",
    "ibm1051": "hproman8",

    "mac": "macintosh",
    "csmacintosh": "macintosh",
};


},{}],11:[function(require,module,exports){
module.exports=[
["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],
["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],
["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],
["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],
["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],
["8940","𪎩𡅅"],
["8943","攊"],
["8946","丽滝鵎釟"],
["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],
["89a1","琑糼緍楆竉刧"],
["89ab","醌碸酞肼"],
["89b0","贋胶𠧧"],
["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],
["89c1","溚舾甙"],
["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],
["8a40","𧶄唥"],
["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],
["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],
["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],
["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],
["8aac","䠋𠆩㿺塳𢶍"],
["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],
["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],
["8ac9","𪘁𠸉𢫏𢳉"],
["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],
["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],
["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],
["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],
["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],
["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],
["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],
["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],
["8ca1","𣏹椙橃𣱣泿"],
["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],
["8cc9","顨杫䉶圽"],
["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],
["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],
["8d40","𠮟"],
["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],
["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],
["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],
["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],
["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],
["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],
["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],
["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],
["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],
["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],
["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],
["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],
["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],
["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],
["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],
["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],
["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],
["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],
["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],
["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],
["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],
["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],
["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],
["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],
["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],
["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],
["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],
["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],
["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],
["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],
["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],
["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],
["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],
["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],
["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],
["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],
["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],
["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],
["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],
["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],
["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],
["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],
["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],
["9fae","酙隁酜"],
["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],
["9fc1","𤤙盖鮝个𠳔莾衂"],
["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],
["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],
["9fe7","毺蠘罸"],
["9feb","嘠𪙊蹷齓"],
["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],
["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],
["a055","𡠻𦸅"],
["a058","詾𢔛"],
["a05b","惽癧髗鵄鍮鮏蟵"],
["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],
["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],
["a0a1","嵗𨯂迚𨸹"],
["a0a6","僙𡵆礆匲阸𠼻䁥"],
["a0ae","矾"],
["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],
["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],
["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],
["a3c0","␀",31,"␡"],
["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],
["c740","す",58,"ァアィイ"],
["c7a1","ゥ",81,"А",5,"ЁЖ",4],
["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],
["c8a1","龰冈龱𧘇"],
["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],
["c8f5","ʃɐɛɔɵœøŋʊɪ"],
["f9fe","￭"],
["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],
["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],
["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],
["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],
["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],
["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],
["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],
["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],
["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],
["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]
]

},{}],12:[function(require,module,exports){
module.exports=[
["0","\u0000",127,"€"],
["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],
["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],
["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],
["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],
["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],
["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],
["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],
["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],
["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],
["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],
["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],
["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],
["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],
["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],
["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],
["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],
["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],
["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],
["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],
["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],
["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],
["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],
["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],
["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],
["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],
["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],
["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],
["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],
["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],
["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],
["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],
["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],
["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],
["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],
["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],
["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],
["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],
["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],
["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],
["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],
["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],
["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],
["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],
["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],
["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],
["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],
["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],
["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],
["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],
["9980","檧檨檪檭",114,"欥欦欨",6],
["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],
["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],
["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],
["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],
["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],
["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],
["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],
["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],
["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],
["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],
["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],
["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],
["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],
["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],
["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],
["a2a1","ⅰ",9],
["a2b1","⒈",19,"⑴",19,"①",9],
["a2e5","㈠",9],
["a2f1","Ⅰ",11],
["a3a1","！＂＃￥％",88,"￣"],
["a4a1","ぁ",82],
["a5a1","ァ",85],
["a6a1","Α",16,"Σ",6],
["a6c1","α",16,"σ",6],
["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],
["a6ee","︻︼︷︸︱"],
["a6f4","︳︴"],
["a7a1","А",5,"ЁЖ",25],
["a7d1","а",5,"ёж",25],
["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],
["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],
["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],
["a8bd","ńň"],
["a8c0","ɡ"],
["a8c5","ㄅ",36],
["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],
["a959","℡㈱"],
["a95c","‐"],
["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],
["a980","﹢",4,"﹨﹩﹪﹫"],
["a996","〇"],
["a9a4","─",75],
["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],
["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],
["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],
["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],
["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],
["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],
["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],
["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],
["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],
["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],
["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],
["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],
["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],
["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],
["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],
["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],
["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],
["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],
["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],
["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],
["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],
["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],
["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],
["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],
["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],
["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],
["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],
["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],
["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],
["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],
["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],
["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],
["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],
["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],
["bb40","籃",9,"籎",36,"籵",5,"籾",9],
["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],
["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],
["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],
["bd40","紷",54,"絯",7],
["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],
["be40","継",12,"綧",6,"綯",42],
["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],
["bf40","緻",62],
["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],
["c040","繞",35,"纃",23,"纜纝纞"],
["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],
["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],
["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],
["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],
["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],
["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],
["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],
["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],
["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],
["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],
["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],
["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],
["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],
["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],
["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],
["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],
["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],
["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],
["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],
["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],
["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],
["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],
["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],
["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],
["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],
["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],
["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],
["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],
["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],
["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],
["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],
["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],
["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],
["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],
["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],
["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],
["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],
["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],
["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],
["d440","訞",31,"訿",8,"詉",21],
["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],
["d540","誁",7,"誋",7,"誔",46],
["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],
["d640","諤",34,"謈",27],
["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],
["d740","譆",31,"譧",4,"譭",25],
["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],
["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],
["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],
["d940","貮",62],
["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],
["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],
["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],
["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],
["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],
["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],
["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],
["dd40","軥",62],
["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],
["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],
["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],
["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],
["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],
["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],
["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],
["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],
["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],
["e240","釦",62],
["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],
["e340","鉆",45,"鉵",16],
["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],
["e440","銨",5,"銯",24,"鋉",31],
["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],
["e540","錊",51,"錿",10],
["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],
["e640","鍬",34,"鎐",27],
["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],
["e740","鏎",7,"鏗",54],
["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],
["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],
["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],
["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],
["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],
["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],
["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],
["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],
["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],
["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],
["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],
["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],
["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],
["ee40","頏",62],
["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],
["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],
["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],
["f040","餈",4,"餎餏餑",28,"餯",26],
["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],
["f140","馌馎馚",10,"馦馧馩",47],
["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],
["f240","駺",62],
["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],
["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],
["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],
["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],
["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],
["f540","魼",62],
["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],
["f640","鯜",62],
["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],
["f740","鰼",62],
["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],
["f840","鳣",62],
["f880","鴢",32],
["f940","鵃",62],
["f980","鶂",32],
["fa40","鶣",62],
["fa80","鷢",32],
["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],
["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],
["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],
["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],
["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],
["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],
["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]
]

},{}],13:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],
["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],
["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],
["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],
["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],
["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],
["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],
["8361","긝",18,"긲긳긵긶긹긻긼"],
["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],
["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],
["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],
["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],
["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],
["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],
["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],
["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],
["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],
["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],
["8741","놞",9,"놩",15],
["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],
["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],
["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],
["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],
["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],
["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],
["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],
["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],
["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],
["8a61","둧",4,"둭",18,"뒁뒂"],
["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],
["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],
["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],
["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],
["8c41","똀",15,"똒똓똕똖똗똙",4],
["8c61","똞",6,"똦",5,"똭",6,"똵",5],
["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],
["8d41","뛃",16,"뛕",8],
["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],
["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],
["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],
["8e61","럂",4,"럈럊",19],
["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],
["8f41","뢅",7,"뢎",17],
["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],
["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],
["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],
["9061","륾",5,"릆릈릋릌릏",15],
["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],
["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],
["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],
["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],
["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],
["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],
["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],
["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],
["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],
["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],
["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],
["9461","봞",5,"봥",6,"봭",12],
["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],
["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],
["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],
["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],
["9641","뺸",23,"뻒뻓"],
["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],
["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],
["9741","뾃",16,"뾕",8],
["9761","뾞",17,"뾱",7],
["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],
["9841","쁀",16,"쁒",5,"쁙쁚쁛"],
["9861","쁝쁞쁟쁡",6,"쁪",15],
["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],
["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],
["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],
["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],
["9a41","숤숥숦숧숪숬숮숰숳숵",16],
["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],
["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],
["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],
["9b61","쌳",17,"썆",7],
["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],
["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],
["9c61","쏿",8,"쐉",6,"쐑",9],
["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],
["9d41","쒪",13,"쒹쒺쒻쒽",8],
["9d61","쓆",25],
["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],
["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],
["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],
["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],
["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],
["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],
["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],
["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],
["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],
["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],
["a141","좥좦좧좩",18,"좾좿죀죁"],
["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],
["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],
["a241","줐줒",5,"줙",18],
["a261","줭",6,"줵",18],
["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],
["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],
["a361","즑",6,"즚즜즞",16],
["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],
["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],
["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],
["a481","쨦쨧쨨쨪",28,"ㄱ",93],
["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],
["a561","쩫",17,"쩾",5,"쪅쪆"],
["a581","쪇",16,"쪙",14,"ⅰ",9],
["a5b0","Ⅰ",9],
["a5c1","Α",16,"Σ",6],
["a5e1","α",16,"σ",6],
["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],
["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],
["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],
["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],
["a761","쬪",22,"쭂쭃쭄"],
["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],
["a841","쭭",10,"쭺",14],
["a861","쮉",18,"쮝",6],
["a881","쮤",19,"쮹",11,"ÆÐªĦ"],
["a8a6","Ĳ"],
["a8a8","ĿŁØŒºÞŦŊ"],
["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],
["a941","쯅",14,"쯕",10],
["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],
["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],
["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],
["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],
["aa81","챳챴챶",29,"ぁ",82],
["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],
["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],
["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],
["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],
["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],
["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],
["acd1","а",5,"ёж",25],
["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],
["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],
["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],
["ae41","췆",5,"췍췎췏췑",16],
["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],
["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],
["af41","츬츭츮츯츲츴츶",19],
["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],
["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],
["b041","캚",5,"캢캦",5,"캮",12],
["b061","캻",5,"컂",19],
["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],
["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],
["b161","켥",6,"켮켲",5,"켹",11],
["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],
["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],
["b261","쾎",18,"쾢",5,"쾩"],
["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],
["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],
["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],
["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],
["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],
["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],
["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],
["b541","킕",14,"킦킧킩킪킫킭",5],
["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],
["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],
["b641","턅",7,"턎",17],
["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],
["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],
["b741","텮",13,"텽",6,"톅톆톇톉톊"],
["b761","톋",20,"톢톣톥톦톧"],
["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],
["b841","퇐",7,"퇙",17],
["b861","퇫",8,"퇵퇶퇷퇹",13],
["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],
["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],
["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],
["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],
["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],
["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],
["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],
["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],
["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],
["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],
["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],
["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],
["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],
["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],
["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],
["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],
["be41","퐸",7,"푁푂푃푅",14],
["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],
["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],
["bf41","풞",10,"풪",14],
["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],
["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],
["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],
["c061","픞",25],
["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],
["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],
["c161","햌햍햎햏햑",19,"햦햧"],
["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],
["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],
["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],
["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],
["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],
["c361","홢",4,"홨홪",5,"홲홳홵",11],
["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],
["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],
["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],
["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],
["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],
["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],
["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],
["c641","힍힎힏힑",6,"힚힜힞",5],
["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],
["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],
["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],
["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],
["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],
["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],
["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],
["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],
["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],
["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],
["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],
["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],
["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],
["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],
["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],
["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],
["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],
["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],
["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],
["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],
["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],
["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],
["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],
["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],
["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],
["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],
["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],
["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],
["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],
["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],
["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],
["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],
["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],
["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],
["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],
["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],
["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],
["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],
["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],
["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],
["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],
["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],
["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],
["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],
["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],
["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],
["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],
["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],
["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],
["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],
["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],
["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],
["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],
["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],
["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]
]

},{}],14:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],
["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],
["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],
["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],
["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],
["a3a1","ㄐ",25,"˙ˉˊˇˋ"],
["a3e1","€"],
["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],
["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],
["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],
["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],
["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],
["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],
["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],
["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],
["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],
["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],
["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],
["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],
["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],
["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],
["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],
["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],
["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],
["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],
["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],
["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],
["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],
["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],
["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],
["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],
["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],
["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],
["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],
["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],
["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],
["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],
["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],
["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],
["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],
["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],
["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],
["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],
["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],
["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],
["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],
["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],
["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],
["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],
["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],
["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],
["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],
["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],
["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],
["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],
["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],
["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],
["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],
["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],
["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],
["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],
["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],
["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],
["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],
["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],
["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],
["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],
["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],
["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],
["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],
["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],
["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],
["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],
["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],
["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],
["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],
["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],
["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],
["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],
["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],
["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],
["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],
["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],
["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],
["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],
["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],
["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],
["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],
["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],
["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],
["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],
["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],
["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],
["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],
["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],
["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],
["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],
["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],
["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],
["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],
["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],
["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],
["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],
["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],
["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],
["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],
["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],
["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],
["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],
["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],
["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],
["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],
["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],
["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],
["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],
["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],
["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],
["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],
["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],
["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],
["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],
["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],
["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],
["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],
["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],
["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],
["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],
["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],
["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],
["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],
["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],
["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],
["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],
["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],
["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],
["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],
["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],
["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],
["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],
["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],
["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],
["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],
["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],
["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],
["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],
["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],
["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],
["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],
["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],
["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],
["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],
["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],
["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],
["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],
["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],
["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],
["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],
["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],
["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],
["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],
["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],
["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],
["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],
["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],
["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],
["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],
["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],
["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],
["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],
["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],
["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],
["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],
["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],
["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]
]

},{}],15:[function(require,module,exports){
module.exports=[
["0","\u0000",127],
["8ea1","｡",62],
["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],
["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],
["a2ba","∈∋⊆⊇⊂⊃∪∩"],
["a2ca","∧∨￢⇒⇔∀∃"],
["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],
["a2f2","Å‰♯♭♪†‡¶"],
["a2fe","◯"],
["a3b0","０",9],
["a3c1","Ａ",25],
["a3e1","ａ",25],
["a4a1","ぁ",82],
["a5a1","ァ",85],
["a6a1","Α",16,"Σ",6],
["a6c1","α",16,"σ",6],
["a7a1","А",5,"ЁЖ",25],
["a7d1","а",5,"ёж",25],
["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],
["ada1","①",19,"Ⅰ",9],
["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],
["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],
["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],
["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],
["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],
["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],
["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],
["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],
["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],
["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],
["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],
["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],
["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],
["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],
["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],
["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],
["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],
["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],
["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],
["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],
["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],
["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],
["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],
["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],
["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],
["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],
["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],
["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],
["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],
["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],
["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],
["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],
["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],
["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],
["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],
["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],
["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],
["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],
["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],
["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],
["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],
["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],
["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],
["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],
["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],
["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],
["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],
["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],
["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],
["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],
["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],
["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],
["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],
["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],
["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],
["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],
["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],
["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],
["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],
["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],
["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],
["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],
["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],
["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],
["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],
["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],
["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],
["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],
["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],
["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],
["f4a1","堯槇遙瑤凜熙"],
["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],
["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],
["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],
["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],
["fcf1","ⅰ",9,"￢￤＇＂"],
["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],
["8fa2c2","¡¦¿"],
["8fa2eb","ºª©®™¤№"],
["8fa6e1","ΆΈΉΊΪ"],
["8fa6e7","Ό"],
["8fa6e9","ΎΫ"],
["8fa6ec","Ώ"],
["8fa6f1","άέήίϊΐόςύϋΰώ"],
["8fa7c2","Ђ",10,"ЎЏ"],
["8fa7f2","ђ",10,"ўџ"],
["8fa9a1","ÆĐ"],
["8fa9a4","Ħ"],
["8fa9a6","Ĳ"],
["8fa9a8","ŁĿ"],
["8fa9ab","ŊØŒ"],
["8fa9af","ŦÞ"],
["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],
["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],
["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],
["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],
["8fabbd","ġĥíìïîǐ"],
["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],
["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],
["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],
["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],
["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],
["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],
["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],
["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],
["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],
["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],
["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],
["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],
["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],
["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],
["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],
["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],
["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],
["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],
["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],
["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],
["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],
["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],
["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],
["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],
["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],
["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],
["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],
["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],
["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],
["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],
["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],
["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],
["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],
["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],
["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],
["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],
["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],
["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],
["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],
["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],
["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],
["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],
["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],
["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],
["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],
["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],
["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],
["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],
["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],
["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],
["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],
["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],
["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],
["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],
["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],
["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],
["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],
["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],
["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],
["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],
["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],
["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],
["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]
]

},{}],16:[function(require,module,exports){
module.exports={"uChars":[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],"gbChars":[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189000]}
},{}],17:[function(require,module,exports){
module.exports=[
["a140","",62],
["a180","",32],
["a240","",62],
["a280","",32],
["a2ab","",5],
["a2e3","€"],
["a2ef",""],
["a2fd",""],
["a340","",62],
["a380","",31,"　"],
["a440","",62],
["a480","",32],
["a4f4","",10],
["a540","",62],
["a580","",32],
["a5f7","",7],
["a640","",62],
["a680","",32],
["a6b9","",7],
["a6d9","",6],
["a6ec",""],
["a6f3",""],
["a6f6","",8],
["a740","",62],
["a780","",32],
["a7c2","",14],
["a7f2","",12],
["a896","",10],
["a8bc",""],
["a8bf","ǹ"],
["a8c1",""],
["a8ea","",20],
["a958",""],
["a95b",""],
["a95d",""],
["a989","〾⿰",11],
["a997","",12],
["a9f0","",14],
["aaa1","",93],
["aba1","",93],
["aca1","",93],
["ada1","",93],
["aea1","",93],
["afa1","",93],
["d7fa","",4],
["f8a1","",93],
["f9a1","",93],
["faa1","",93],
["fba1","",93],
["fca1","",93],
["fda1","",93],
["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],
["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]
]

},{}],18:[function(require,module,exports){
module.exports=[
["0","\u0000",128],
["a1","｡",62],
["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],
["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],
["81b8","∈∋⊆⊇⊂⊃∪∩"],
["81c8","∧∨￢⇒⇔∀∃"],
["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],
["81f0","Å‰♯♭♪†‡¶"],
["81fc","◯"],
["824f","０",9],
["8260","Ａ",25],
["8281","ａ",25],
["829f","ぁ",82],
["8340","ァ",62],
["8380","ム",22],
["839f","Α",16,"Σ",6],
["83bf","α",16,"σ",6],
["8440","А",5,"ЁЖ",25],
["8470","а",5,"ёж",7],
["8480","о",17],
["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],
["8740","①",19,"Ⅰ",9],
["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],
["877e","㍻"],
["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],
["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],
["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],
["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],
["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],
["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],
["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],
["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],
["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],
["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],
["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],
["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],
["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],
["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],
["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],
["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],
["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],
["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],
["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],
["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],
["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],
["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],
["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],
["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],
["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],
["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],
["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],
["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],
["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],
["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],
["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],
["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],
["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],
["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],
["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],
["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],
["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],
["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],
["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],
["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],
["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],
["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],
["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],
["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],
["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],
["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],
["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],
["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],
["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],
["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],
["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],
["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],
["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],
["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],
["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],
["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],
["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],
["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],
["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],
["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],
["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],
["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],
["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],
["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],
["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],
["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],
["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],
["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],
["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],
["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],
["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],
["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],
["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],
["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],
["eeef","ⅰ",9,"￢￤＇＂"],
["f040","",62],
["f080","",124],
["f140","",62],
["f180","",124],
["f240","",62],
["f280","",124],
["f340","",62],
["f380","",124],
["f440","",62],
["f480","",124],
["f540","",62],
["f580","",124],
["f640","",62],
["f680","",124],
["f740","",62],
["f780","",124],
["f840","",62],
["f880","",124],
["f940",""],
["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],
["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],
["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],
["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],
["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]
]

},{}],19:[function(require,module,exports){
"use strict"

// == UTF16-BE codec. ==========================================================

exports.utf16be = Utf16BECodec;
function Utf16BECodec() {
}

Utf16BECodec.prototype.encoder = Utf16BEEncoder;
Utf16BECodec.prototype.decoder = Utf16BEDecoder;
Utf16BECodec.prototype.bomAware = true;


// -- Encoding

function Utf16BEEncoder() {
}

Utf16BEEncoder.prototype.write = function(str) {
    var buf = new Buffer(str, 'ucs2');
    for (var i = 0; i < buf.length; i += 2) {
        var tmp = buf[i]; buf[i] = buf[i+1]; buf[i+1] = tmp;
    }
    return buf;
}

Utf16BEEncoder.prototype.end = function() {
}


// -- Decoding

function Utf16BEDecoder() {
    this.overflowByte = -1;
}

Utf16BEDecoder.prototype.write = function(buf) {
    if (buf.length == 0)
        return '';

    var buf2 = new Buffer(buf.length + 1),
        i = 0, j = 0;

    if (this.overflowByte !== -1) {
        buf2[0] = buf[0];
        buf2[1] = this.overflowByte;
        i = 1; j = 2;
    }

    for (; i < buf.length-1; i += 2, j+= 2) {
        buf2[j] = buf[i+1];
        buf2[j+1] = buf[i];
    }

    this.overflowByte = (i == buf.length-1) ? buf[buf.length-1] : -1;

    return buf2.slice(0, j).toString('ucs2');
}

Utf16BEDecoder.prototype.end = function() {
}


// == UTF-16 codec =============================================================
// Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
// Defaults to UTF-16LE, as it's prevalent and default in Node.
// http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
// Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});

// Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).

exports.utf16 = Utf16Codec;
function Utf16Codec(codecOptions, iconv) {
    this.iconv = iconv;
}

Utf16Codec.prototype.encoder = Utf16Encoder;
Utf16Codec.prototype.decoder = Utf16Decoder;


// -- Encoding (pass-through)

function Utf16Encoder(options, codec) {
    options = options || {};
    if (options.addBOM === undefined)
        options.addBOM = true;
    this.encoder = codec.iconv.getEncoder('utf-16le', options);
}

Utf16Encoder.prototype.write = function(str) {
    return this.encoder.write(str);
}

Utf16Encoder.prototype.end = function() {
    return this.encoder.end();
}


// -- Decoding

function Utf16Decoder(options, codec) {
    this.decoder = null;
    this.initialBytes = [];
    this.initialBytesLen = 0;

    this.options = options || {};
    this.iconv = codec.iconv;
}

Utf16Decoder.prototype.write = function(buf) {
    if (!this.decoder) {
        // Codec is not chosen yet. Accumulate initial bytes.
        this.initialBytes.push(buf);
        this.initialBytesLen += buf.length;
        
        if (this.initialBytesLen < 16) // We need more bytes to use space heuristic (see below)
            return '';

        // We have enough bytes -> detect endianness.
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        this.initialBytes.length = this.initialBytesLen = 0;
    }

    return this.decoder.write(buf);
}

Utf16Decoder.prototype.end = function() {
    if (!this.decoder) {
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);

        var res = this.decoder.write(buf),
            trail = this.decoder.end();

        return trail ? (res + trail) : res;
    }
    return this.decoder.end();
}

function detectEncoding(buf, defaultEncoding) {
    var enc = defaultEncoding || 'utf-16le';

    if (buf.length >= 2) {
        // Check BOM.
        if (buf[0] == 0xFE && buf[1] == 0xFF) // UTF-16BE BOM
            enc = 'utf-16be';
        else if (buf[0] == 0xFF && buf[1] == 0xFE) // UTF-16LE BOM
            enc = 'utf-16le';
        else {
            // No BOM found. Try to deduce encoding from initial content.
            // Most of the time, the content has ASCII chars (U+00**), but the opposite (U+**00) is uncommon.
            // So, we count ASCII as if it was LE or BE, and decide from that.
            var asciiCharsLE = 0, asciiCharsBE = 0, // Counts of chars in both positions
                _len = Math.min(buf.length - (buf.length % 2), 64); // Len is always even.

            for (var i = 0; i < _len; i += 2) {
                if (buf[i] === 0 && buf[i+1] !== 0) asciiCharsBE++;
                if (buf[i] !== 0 && buf[i+1] === 0) asciiCharsLE++;
            }

            if (asciiCharsBE > asciiCharsLE)
                enc = 'utf-16be';
            else if (asciiCharsBE < asciiCharsLE)
                enc = 'utf-16le';
        }
    }

    return enc;
}



},{}],20:[function(require,module,exports){
"use strict"

// UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
// See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3

exports.utf7 = Utf7Codec;
exports.unicode11utf7 = 'utf7'; // Alias UNICODE-1-1-UTF-7
function Utf7Codec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7Codec.prototype.encoder = Utf7Encoder;
Utf7Codec.prototype.decoder = Utf7Decoder;
Utf7Codec.prototype.bomAware = true;


// -- Encoding

var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;

function Utf7Encoder(options, codec) {
    this.iconv = codec.iconv;
}

Utf7Encoder.prototype.write = function(str) {
    // Naive implementation.
    // Non-direct chars are encoded as "+<base64>-"; single "+" char is encoded as "+-".
    return new Buffer(str.replace(nonDirectChars, function(chunk) {
        return "+" + (chunk === '+' ? '' : 
            this.iconv.encode(chunk, 'utf16-be').toString('base64').replace(/=+$/, '')) 
            + "-";
    }.bind(this)));
}

Utf7Encoder.prototype.end = function() {
}


// -- Decoding

function Utf7Decoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64Regex = /[A-Za-z0-9\/+]/;
var base64Chars = [];
for (var i = 0; i < 256; i++)
    base64Chars[i] = base64Regex.test(String.fromCharCode(i));

var plusChar = '+'.charCodeAt(0), 
    minusChar = '-'.charCodeAt(0),
    andChar = '&'.charCodeAt(0);

Utf7Decoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '+'
            if (buf[i] == plusChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64Chars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) {// "+-" -> "+"
                    res += "+";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString();
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus is absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString();

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7Decoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}


// UTF-7-IMAP codec.
// RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
// Differences:
//  * Base64 part is started by "&" instead of "+"
//  * Direct characters are 0x20-0x7E, except "&" (0x26)
//  * In Base64, "," is used instead of "/"
//  * Base64 must not be used to represent direct characters.
//  * No implicit shift back from Base64 (should always end with '-')
//  * String must end in non-shifted position.
//  * "-&" while in base64 is not allowed.


exports.utf7imap = Utf7IMAPCodec;
function Utf7IMAPCodec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
Utf7IMAPCodec.prototype.bomAware = true;


// -- Encoding

function Utf7IMAPEncoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = new Buffer(6);
    this.base64AccumIdx = 0;
}

Utf7IMAPEncoder.prototype.write = function(str) {
    var inBase64 = this.inBase64,
        base64Accum = this.base64Accum,
        base64AccumIdx = this.base64AccumIdx,
        buf = new Buffer(str.length*5 + 10), bufIdx = 0;

    for (var i = 0; i < str.length; i++) {
        var uChar = str.charCodeAt(i);
        if (0x20 <= uChar && uChar <= 0x7E) { // Direct character or '&'.
            if (inBase64) {
                if (base64AccumIdx > 0) {
                    bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
                    base64AccumIdx = 0;
                }

                buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
                inBase64 = false;
            }

            if (!inBase64) {
                buf[bufIdx++] = uChar; // Write direct character

                if (uChar === andChar)  // Ampersand -> '&-'
                    buf[bufIdx++] = minusChar;
            }

        } else { // Non-direct character
            if (!inBase64) {
                buf[bufIdx++] = andChar; // Write '&', then go to base64 mode.
                inBase64 = true;
            }
            if (inBase64) {
                base64Accum[base64AccumIdx++] = uChar >> 8;
                base64Accum[base64AccumIdx++] = uChar & 0xFF;

                if (base64AccumIdx == base64Accum.length) {
                    bufIdx += buf.write(base64Accum.toString('base64').replace(/\//g, ','), bufIdx);
                    base64AccumIdx = 0;
                }
            }
        }
    }

    this.inBase64 = inBase64;
    this.base64AccumIdx = base64AccumIdx;

    return buf.slice(0, bufIdx);
}

Utf7IMAPEncoder.prototype.end = function() {
    var buf = new Buffer(10), bufIdx = 0;
    if (this.inBase64) {
        if (this.base64AccumIdx > 0) {
            bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
            this.base64AccumIdx = 0;
        }

        buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
        this.inBase64 = false;
    }

    return buf.slice(0, bufIdx);
}


// -- Decoding

function Utf7IMAPDecoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64IMAPChars = base64Chars.slice();
base64IMAPChars[','.charCodeAt(0)] = true;

Utf7IMAPDecoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.
    // It is forgiving, closer to standard UTF-7 (for example, '-' is optional at the end).

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '&'
            if (buf[i] == andChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64IMAPChars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) { // "&-" -> "&"
                    res += "&";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString().replace(/,/g, '/');
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus may be absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString().replace(/,/g, '/');

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7IMAPDecoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}



},{}],21:[function(require,module,exports){
"use strict"

var BOMChar = '\uFEFF';

exports.PrependBOM = PrependBOMWrapper
function PrependBOMWrapper(encoder, options) {
    this.encoder = encoder;
    this.addBOM = true;
}

PrependBOMWrapper.prototype.write = function(str) {
    if (this.addBOM) {
        str = BOMChar + str;
        this.addBOM = false;
    }

    return this.encoder.write(str);
}

PrependBOMWrapper.prototype.end = function() {
    return this.encoder.end();
}


//------------------------------------------------------------------------------

exports.StripBOM = StripBOMWrapper;
function StripBOMWrapper(decoder, options) {
    this.decoder = decoder;
    this.pass = false;
    this.options = options || {};
}

StripBOMWrapper.prototype.write = function(buf) {
    var res = this.decoder.write(buf);
    if (this.pass || !res)
        return res;

    if (res[0] === BOMChar) {
        res = res.slice(1);
        if (typeof this.options.stripBOM === 'function')
            this.options.stripBOM();
    }

    this.pass = true;
    return res;
}

StripBOMWrapper.prototype.end = function() {
    return this.decoder.end();
}


},{}],22:[function(require,module,exports){
"use strict"

// == Extend Node primitives to use iconv-lite =================================

module.exports = function (iconv) {
    var original = undefined; // Place to keep original methods.

    // Node authors rewrote Buffer internals to make it compatible with
    // Uint8Array and we cannot patch key functions since then.
    iconv.supportsNodeEncodingsExtension = !(new Buffer(0) instanceof Uint8Array);

    iconv.extendNodeEncodings = function extendNodeEncodings() {
        if (original) return;
        original = {};

        if (!iconv.supportsNodeEncodingsExtension) {
            console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
            console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
            return;
        }

        var nodeNativeEncodings = {
            'hex': true, 'utf8': true, 'utf-8': true, 'ascii': true, 'binary': true, 
            'base64': true, 'ucs2': true, 'ucs-2': true, 'utf16le': true, 'utf-16le': true,
        };

        Buffer.isNativeEncoding = function(enc) {
            return enc && nodeNativeEncodings[enc.toLowerCase()];
        }

        // -- SlowBuffer -----------------------------------------------------------
        var SlowBuffer = require('buffer').SlowBuffer;

        original.SlowBufferToString = SlowBuffer.prototype.toString;
        SlowBuffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.SlowBufferWrite = SlowBuffer.prototype.write;
        SlowBuffer.prototype.write = function(string, offset, length, encoding) {
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferWrite.call(this, string, offset, length, encoding);

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;
        }

        // -- Buffer ---------------------------------------------------------------

        original.BufferIsEncoding = Buffer.isEncoding;
        Buffer.isEncoding = function(encoding) {
            return Buffer.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
        }

        original.BufferByteLength = Buffer.byteLength;
        Buffer.byteLength = SlowBuffer.byteLength = function(str, encoding) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferByteLength.call(this, str, encoding);

            // Slow, I know, but we don't have a better way yet.
            return iconv.encode(str, encoding).length;
        }

        original.BufferToString = Buffer.prototype.toString;
        Buffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.BufferWrite = Buffer.prototype.write;
        Buffer.prototype.write = function(string, offset, length, encoding) {
            var _offset = offset, _length = length, _encoding = encoding;
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferWrite.call(this, string, _offset, _length, _encoding);

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;

            // TODO: Set _charsWritten.
        }


        // -- Readable -------------------------------------------------------------
        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            original.ReadableSetEncoding = Readable.prototype.setEncoding;
            Readable.prototype.setEncoding = function setEncoding(enc, options) {
                // Use our own decoder, it has the same interface.
                // We cannot use original function as it doesn't handle BOM-s.
                this._readableState.decoder = iconv.getDecoder(enc, options);
                this._readableState.encoding = enc;
            }

            Readable.prototype.collect = iconv._collect;
        }
    }

    // Remove iconv-lite Node primitive extensions.
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
        if (!iconv.supportsNodeEncodingsExtension)
            return;
        if (!original)
            throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.")

        delete Buffer.isNativeEncoding;

        var SlowBuffer = require('buffer').SlowBuffer;

        SlowBuffer.prototype.toString = original.SlowBufferToString;
        SlowBuffer.prototype.write = original.SlowBufferWrite;

        Buffer.isEncoding = original.BufferIsEncoding;
        Buffer.byteLength = original.BufferByteLength;
        Buffer.prototype.toString = original.BufferToString;
        Buffer.prototype.write = original.BufferWrite;

        if (iconv.supportsStreams) {
            var Readable = require('stream').Readable;

            Readable.prototype.setEncoding = original.ReadableSetEncoding;
            delete Readable.prototype.collect;
        }

        original = undefined;
    }
}

},{"buffer":undefined,"stream":undefined}],23:[function(require,module,exports){
"use strict"

var bomHandling = require('./bom-handling'),
    iconv = module.exports;

// All codecs and aliases are kept here, keyed by encoding name/alias.
// They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
iconv.encodings = null;

// Characters emitted in case of error.
iconv.defaultCharUnicode = '�';
iconv.defaultCharSingleByte = '?';

// Public API.
iconv.encode = function encode(str, encoding, options) {
    str = "" + (str || ""); // Ensure string.

    var encoder = iconv.getEncoder(encoding, options);

    var res = encoder.write(str);
    var trail = encoder.end();
    
    return (trail && trail.length > 0) ? Buffer.concat([res, trail]) : res;
}

iconv.decode = function decode(buf, encoding, options) {
    if (typeof buf === 'string') {
        if (!iconv.skipDecodeWarning) {
            console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
            iconv.skipDecodeWarning = true;
        }

        buf = new Buffer("" + (buf || ""), "binary"); // Ensure buffer.
    }

    var decoder = iconv.getDecoder(encoding, options);

    var res = decoder.write(buf);
    var trail = decoder.end();

    return trail ? (res + trail) : res;
}

iconv.encodingExists = function encodingExists(enc) {
    try {
        iconv.getCodec(enc);
        return true;
    } catch (e) {
        return false;
    }
}

// Legacy aliases to convert functions
iconv.toEncoding = iconv.encode;
iconv.fromEncoding = iconv.decode;

// Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
iconv._codecDataCache = {};
iconv.getCodec = function getCodec(encoding) {
    if (!iconv.encodings)
        iconv.encodings = require("../encodings"); // Lazy load all encoding definitions.
    
    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
    var enc = (''+encoding).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g, "");

    // Traverse iconv.encodings to find actual codec.
    var codecOptions = {};
    while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
            return codec;

        var codecDef = iconv.encodings[enc];

        switch (typeof codecDef) {
            case "string": // Direct alias to other encoding.
                enc = codecDef;
                break;

            case "object": // Alias with options. Can be layered.
                for (var key in codecDef)
                    codecOptions[key] = codecDef[key];

                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;
                
                enc = codecDef.type;
                break;

            case "function": // Codec itself.
                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;

                // The codec function must load all tables and return object with .encoder and .decoder methods.
                // It'll be called only once (for each different options object).
                codec = new codecDef(codecOptions, iconv);

                iconv._codecDataCache[codecOptions.encodingName] = codec; // Save it to be reused later.
                return codec;

            default:
                throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
        }
    }
}

iconv.getEncoder = function getEncoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        encoder = new codec.encoder(options, codec);

    if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling.PrependBOM(encoder, options);

    return encoder;
}

iconv.getDecoder = function getDecoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        decoder = new codec.decoder(options, codec);

    if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling.StripBOM(decoder, options);

    return decoder;
}


// Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
if (nodeVer) {

    // Load streaming support in Node v0.10+
    var nodeVerArr = nodeVer.split(".").map(Number);
    if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
        require("./streams")(iconv);
    }

    // Load Node primitive extensions.
    require("./extend-node")(iconv);
}


},{"../encodings":6,"./bom-handling":21,"./extend-node":22,"./streams":24}],24:[function(require,module,exports){
"use strict"

var Transform = require("stream").Transform;


// == Exports ==================================================================
module.exports = function(iconv) {
    
    // Additional Public API.
    iconv.encodeStream = function encodeStream(encoding, options) {
        return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    }

    iconv.decodeStream = function decodeStream(encoding, options) {
        return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    }

    iconv.supportsStreams = true;


    // Not published yet.
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
};


// == Encoder stream =======================================================
function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
    Transform.call(this, options);
}

IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
});

IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != 'string')
        return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on('error', cb);
    this.on('data', function(chunk) { chunks.push(chunk); });
    this.on('end', function() {
        cb(null, Buffer.concat(chunks));
    });
    return this;
}


// == Decoder stream =======================================================
function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = 'utf8'; // We output strings.
    Transform.call(this, options);
}

IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
});

IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer.isBuffer(chunk))
        return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res, this.encoding);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res, this.encoding);                
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = '';
    this.on('error', cb);
    this.on('data', function(chunk) { res += chunk; });
    this.on('end', function() {
        cb(null, res);
    });
    return this;
}


},{"stream":undefined}],25:[function(require,module,exports){
'use strict';

var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};

},{}],26:[function(require,module,exports){
"use strict";

var realFetch = require('node-fetch');
module.exports = function(url, options) {
	if (/^\/\//.test(url)) {
		url = 'https:' + url;
	}
	return realFetch.call(this, url, options);
};

if (!global.fetch) {
	global.fetch = module.exports;
	global.Response = realFetch.Response;
	global.Headers = realFetch.Headers;
	global.Request = realFetch.Request;
}

},{"node-fetch":64}],27:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":41,"./_root":51}],28:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":41,"./_root":51}],29:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":41,"./_root":51}],30:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":41,"./_root":51}],31:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":51}],32:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":41,"./_root":51}],33:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":31,"./_getRawTag":42,"./_objectToString":49}],34:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":33,"./isObjectLike":61}],35:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":45,"./_toSource":52,"./isFunction":58,"./isObject":60}],36:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":33,"./isLength":59,"./isObjectLike":61}],37:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":46,"./_nativeKeys":47}],38:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],39:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":51}],40:[function(require,module,exports){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

},{}],41:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":35,"./_getValue":44}],42:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":31}],43:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":27,"./_Map":28,"./_Promise":29,"./_Set":30,"./_WeakMap":32,"./_baseGetTag":33,"./_toSource":52}],44:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],45:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":39}],46:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],47:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":50}],48:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":40}],49:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],50:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],51:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":40}],52:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],53:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":34,"./isObjectLike":61}],54:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],55:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":58,"./isLength":59}],56:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":51,"./stubFalse":63}],57:[function(require,module,exports){
var baseKeys = require('./_baseKeys'),
    getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isPrototype = require('./_isPrototype'),
    isTypedArray = require('./isTypedArray');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;

},{"./_baseKeys":37,"./_getTag":43,"./_isPrototype":46,"./isArguments":53,"./isArray":54,"./isArrayLike":55,"./isBuffer":56,"./isTypedArray":62}],58:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":33,"./isObject":60}],59:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],60:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],61:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],62:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":36,"./_baseUnary":38,"./_nodeUtil":48}],63:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],64:[function(require,module,exports){

/**
 * index.js
 *
 * a request API compatible with window.fetch
 */

var parse_url = require('url').parse;
var resolve_url = require('url').resolve;
var http = require('http');
var https = require('https');
var zlib = require('zlib');
var stream = require('stream');

var Body = require('./lib/body');
var Response = require('./lib/response');
var Headers = require('./lib/headers');
var Request = require('./lib/request');
var FetchError = require('./lib/fetch-error');

// commonjs
module.exports = Fetch;
// es6 default export compatibility
module.exports.default = module.exports;

/**
 * Fetch class
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function Fetch(url, opts) {

	// allow call as function
	if (!(this instanceof Fetch))
		return new Fetch(url, opts);

	// allow custom promise
	if (!Fetch.Promise) {
		throw new Error('native promise missing, set Fetch.Promise to your favorite alternative');
	}

	Body.Promise = Fetch.Promise;

	var self = this;

	// wrap http.request into fetch
	return new Fetch.Promise(function(resolve, reject) {
		// build request object
		var options = new Request(url, opts);

		if (!options.protocol || !options.hostname) {
			throw new Error('only absolute urls are supported');
		}

		if (options.protocol !== 'http:' && options.protocol !== 'https:') {
			throw new Error('only http(s) protocols are supported');
		}

		var send;
		if (options.protocol === 'https:') {
			send = https.request;
		} else {
			send = http.request;
		}

		// normalize headers
		var headers = new Headers(options.headers);

		if (options.compress) {
			headers.set('accept-encoding', 'gzip,deflate');
		}

		if (!headers.has('user-agent')) {
			headers.set('user-agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
		}

		if (!headers.has('connection') && !options.agent) {
			headers.set('connection', 'close');
		}

		if (!headers.has('accept')) {
			headers.set('accept', '*/*');
		}

		// detect form data input from form-data module, this hack avoid the need to pass multipart header manually
		if (!headers.has('content-type') && options.body && typeof options.body.getBoundary === 'function') {
			headers.set('content-type', 'multipart/form-data; boundary=' + options.body.getBoundary());
		}

		// bring node-fetch closer to browser behavior by setting content-length automatically
		if (!headers.has('content-length') && /post|put|patch|delete/i.test(options.method)) {
			if (typeof options.body === 'string') {
				headers.set('content-length', Buffer.byteLength(options.body));
			// detect form data input from form-data module, this hack avoid the need to add content-length header manually
			} else if (options.body && typeof options.body.getLengthSync === 'function') {
				// for form-data 1.x
				if (options.body._lengthRetrievers && options.body._lengthRetrievers.length == 0) {
					headers.set('content-length', options.body.getLengthSync().toString());
				// for form-data 2.x
				} else if (options.body.hasKnownLength && options.body.hasKnownLength()) {
					headers.set('content-length', options.body.getLengthSync().toString());
				}
			// this is only necessary for older nodejs releases (before iojs merge)
			} else if (options.body === undefined || options.body === null) {
				headers.set('content-length', '0');
			}
		}

		options.headers = headers.raw();

		// http.request only support string as host header, this hack make custom host header possible
		if (options.headers.host) {
			options.headers.host = options.headers.host[0];
		}

		// send request
		var req = send(options);
		var reqTimeout;

		if (options.timeout) {
			req.once('socket', function(socket) {
				reqTimeout = setTimeout(function() {
					req.abort();
					reject(new FetchError('network timeout at: ' + options.url, 'request-timeout'));
				}, options.timeout);
			});
		}

		req.on('error', function(err) {
			clearTimeout(reqTimeout);
			reject(new FetchError('request to ' + options.url + ' failed, reason: ' + err.message, 'system', err));
		});

		req.on('response', function(res) {
			clearTimeout(reqTimeout);

			// handle redirect
			if (self.isRedirect(res.statusCode) && options.redirect !== 'manual') {
				if (options.redirect === 'error') {
					reject(new FetchError('redirect mode is set to error: ' + options.url, 'no-redirect'));
					return;
				}

				if (options.counter >= options.follow) {
					reject(new FetchError('maximum redirect reached at: ' + options.url, 'max-redirect'));
					return;
				}

				if (!res.headers.location) {
					reject(new FetchError('redirect location header missing at: ' + options.url, 'invalid-redirect'));
					return;
				}

				// per fetch spec, for POST request with 301/302 response, or any request with 303 response, use GET when following redirect
				if (res.statusCode === 303
					|| ((res.statusCode === 301 || res.statusCode === 302) && options.method === 'POST'))
				{
					options.method = 'GET';
					delete options.body;
					delete options.headers['content-length'];
				}

				options.counter++;

				resolve(Fetch(resolve_url(options.url, res.headers.location), options));
				return;
			}

			// normalize location header for manual redirect mode
			var headers = new Headers(res.headers);
			if (options.redirect === 'manual' && headers.has('location')) {
				headers.set('location', resolve_url(options.url, headers.get('location')));
			}

			// prepare response
			var body = res.pipe(new stream.PassThrough());
			var response_options = {
				url: options.url
				, status: res.statusCode
				, statusText: res.statusMessage
				, headers: headers
				, size: options.size
				, timeout: options.timeout
			};

			// response object
			var output;

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no content-encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!options.compress || options.method === 'HEAD' || !headers.has('content-encoding') || res.statusCode === 204 || res.statusCode === 304) {
				output = new Response(body, response_options);
				resolve(output);
				return;
			}

			// otherwise, check for gzip or deflate
			var name = headers.get('content-encoding');

			// for gzip
			if (name == 'gzip' || name == 'x-gzip') {
				body = body.pipe(zlib.createGunzip());
				output = new Response(body, response_options);
				resolve(output);
				return;

			// for deflate
			} else if (name == 'deflate' || name == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				var raw = res.pipe(new stream.PassThrough());
				raw.once('data', function(chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					output = new Response(body, response_options);
					resolve(output);
				});
				return;
			}

			// otherwise, use response as-is
			output = new Response(body, response_options);
			resolve(output);
			return;
		});

		// accept string, buffer or readable stream as body
		// per spec we will call tostring on non-stream objects
		if (typeof options.body === 'string') {
			req.write(options.body);
			req.end();
		} else if (options.body instanceof Buffer) {
			req.write(options.body);
			req.end()
		} else if (typeof options.body === 'object' && options.body.pipe) {
			options.body.pipe(req);
		} else if (typeof options.body === 'object') {
			req.write(options.body.toString());
			req.end();
		} else {
			req.end();
		}
	});

};

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
Fetch.prototype.isRedirect = function(code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
}

// expose Promise
Fetch.Promise = global.Promise;
Fetch.Response = Response;
Fetch.Headers = Headers;
Fetch.Request = Request;

},{"./lib/body":65,"./lib/fetch-error":66,"./lib/headers":67,"./lib/request":68,"./lib/response":69,"http":undefined,"https":undefined,"stream":undefined,"url":undefined,"zlib":undefined}],65:[function(require,module,exports){

/**
 * body.js
 *
 * Body interface provides common methods for Request and Response
 */

var convert = require('encoding').convert;
var bodyStream = require('is-stream');
var PassThrough = require('stream').PassThrough;
var FetchError = require('./fetch-error');

module.exports = Body;

/**
 * Body class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body, opts) {

	opts = opts || {};

	this.body = body;
	this.bodyUsed = false;
	this.size = opts.size || 0;
	this.timeout = opts.timeout || 0;
	this._raw = [];
	this._abort = false;

}

/**
 * Decode response as json
 *
 * @return  Promise
 */
Body.prototype.json = function() {

	// for 204 No Content response, buffer will be empty, parsing it will throw error
	if (this.status === 204) {
		return Body.Promise.resolve({});
	}

	return this._decode().then(function(buffer) {
		return JSON.parse(buffer.toString());
	});

};

/**
 * Decode response as text
 *
 * @return  Promise
 */
Body.prototype.text = function() {

	return this._decode().then(function(buffer) {
		return buffer.toString();
	});

};

/**
 * Decode response as buffer (non-spec api)
 *
 * @return  Promise
 */
Body.prototype.buffer = function() {

	return this._decode();

};

/**
 * Decode buffers into utf-8 string
 *
 * @return  Promise
 */
Body.prototype._decode = function() {

	var self = this;

	if (this.bodyUsed) {
		return Body.Promise.reject(new Error('body used already for: ' + this.url));
	}

	this.bodyUsed = true;
	this._bytes = 0;
	this._abort = false;
	this._raw = [];

	return new Body.Promise(function(resolve, reject) {
		var resTimeout;

		// body is string
		if (typeof self.body === 'string') {
			self._bytes = self.body.length;
			self._raw = [new Buffer(self.body)];
			return resolve(self._convert());
		}

		// body is buffer
		if (self.body instanceof Buffer) {
			self._bytes = self.body.length;
			self._raw = [self.body];
			return resolve(self._convert());
		}

		// allow timeout on slow response body
		if (self.timeout) {
			resTimeout = setTimeout(function() {
				self._abort = true;
				reject(new FetchError('response timeout at ' + self.url + ' over limit: ' + self.timeout, 'body-timeout'));
			}, self.timeout);
		}

		// handle stream error, such as incorrect content-encoding
		self.body.on('error', function(err) {
			reject(new FetchError('invalid response body at: ' + self.url + ' reason: ' + err.message, 'system', err));
		});

		// body is stream
		self.body.on('data', function(chunk) {
			if (self._abort || chunk === null) {
				return;
			}

			if (self.size && self._bytes + chunk.length > self.size) {
				self._abort = true;
				reject(new FetchError('content size at ' + self.url + ' over limit: ' + self.size, 'max-size'));
				return;
			}

			self._bytes += chunk.length;
			self._raw.push(chunk);
		});

		self.body.on('end', function() {
			if (self._abort) {
				return;
			}

			clearTimeout(resTimeout);
			resolve(self._convert());
		});
	});

};

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   String  encoding  Target encoding
 * @return  String
 */
Body.prototype._convert = function(encoding) {

	encoding = encoding || 'utf-8';

	var ct = this.headers.get('content-type');
	var charset = 'utf-8';
	var res, str;

	// header
	if (ct) {
		// skip encoding detection altogether if not html/xml/plain text
		if (!/text\/html|text\/plain|\+xml|\/xml/i.test(ct)) {
			return Buffer.concat(this._raw);
		}

		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	if (!res && this._raw.length > 0) {
		for (var i = 0; i < this._raw.length; i++) {
			str += this._raw[i].toString()
			if (str.length > 1024) {
				break;
			}
		}
		str = str.substr(0, 1024);
	}

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(
		Buffer.concat(this._raw)
		, encoding
		, charset
	);

};

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
Body.prototype._clone = function(instance) {
	var p1, p2;
	var body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (bodyStream(body) && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance.body = p1;
		body = p2;
	}

	return body;
}

// expose Promise
Body.Promise = global.Promise;

},{"./fetch-error":66,"encoding":1,"is-stream":25,"stream":undefined}],66:[function(require,module,exports){

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

module.exports = FetchError;

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {

	// hide custom error implementation details from end-users
	Error.captureStackTrace(this, this.constructor);

	this.name = this.constructor.name;
	this.message = message;
	this.type = type;

	// when err.type is `system`, err.code contains system error code
	if (systemError) {
		this.code = this.errno = systemError.code;
	}

}

require('util').inherits(FetchError, Error);

},{"util":undefined}],67:[function(require,module,exports){

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

module.exports = Headers;

/**
 * Headers class
 *
 * @param   Object  headers  Response headers
 * @return  Void
 */
function Headers(headers) {

	var self = this;
	this._headers = {};

	// Headers
	if (headers instanceof Headers) {
		headers = headers.raw();
	}

	// plain object
	for (var prop in headers) {
		if (!headers.hasOwnProperty(prop)) {
			continue;
		}

		if (typeof headers[prop] === 'string') {
			this.set(prop, headers[prop]);

		} else if (typeof headers[prop] === 'number' && !isNaN(headers[prop])) {
			this.set(prop, headers[prop].toString());

		} else if (headers[prop] instanceof Array) {
			headers[prop].forEach(function(item) {
				self.append(prop, item.toString());
			});
		}
	}

}

/**
 * Return first header value given name
 *
 * @param   String  name  Header name
 * @return  Mixed
 */
Headers.prototype.get = function(name) {
	var list = this._headers[name.toLowerCase()];
	return list ? list[0] : null;
};

/**
 * Return all header values given name
 *
 * @param   String  name  Header name
 * @return  Array
 */
Headers.prototype.getAll = function(name) {
	if (!this.has(name)) {
		return [];
	}

	return this._headers[name.toLowerCase()];
};

/**
 * Iterate over all headers
 *
 * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
 * @param   Boolean   thisArg   `this` context for callback function
 * @return  Void
 */
Headers.prototype.forEach = function(callback, thisArg) {
	Object.getOwnPropertyNames(this._headers).forEach(function(name) {
		this._headers[name].forEach(function(value) {
			callback.call(thisArg, value, name, this)
		}, this)
	}, this)
}

/**
 * Overwrite header values given name
 *
 * @param   String  name   Header name
 * @param   String  value  Header value
 * @return  Void
 */
Headers.prototype.set = function(name, value) {
	this._headers[name.toLowerCase()] = [value];
};

/**
 * Append a value onto existing header
 *
 * @param   String  name   Header name
 * @param   String  value  Header value
 * @return  Void
 */
Headers.prototype.append = function(name, value) {
	if (!this.has(name)) {
		this.set(name, value);
		return;
	}

	this._headers[name.toLowerCase()].push(value);
};

/**
 * Check for header name existence
 *
 * @param   String   name  Header name
 * @return  Boolean
 */
Headers.prototype.has = function(name) {
	return this._headers.hasOwnProperty(name.toLowerCase());
};

/**
 * Delete all header values given name
 *
 * @param   String  name  Header name
 * @return  Void
 */
Headers.prototype['delete'] = function(name) {
	delete this._headers[name.toLowerCase()];
};

/**
 * Return raw headers (non-spec api)
 *
 * @return  Object
 */
Headers.prototype.raw = function() {
	return this._headers;
};

},{}],68:[function(require,module,exports){

/**
 * request.js
 *
 * Request class contains server only options
 */

var parse_url = require('url').parse;
var Headers = require('./headers');
var Body = require('./body');

module.exports = Request;

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
function Request(input, init) {
	var url, url_parsed;

	// normalize input
	if (!(input instanceof Request)) {
		url = input;
		url_parsed = parse_url(url);
		input = {};
	} else {
		url = input.url;
		url_parsed = parse_url(url);
	}

	// normalize init
	init = init || {};

	// fetch spec options
	this.method = init.method || input.method || 'GET';
	this.redirect = init.redirect || input.redirect || 'follow';
	this.headers = new Headers(init.headers || input.headers || {});
	this.url = url;

	// server only options
	this.follow = init.follow !== undefined ?
		init.follow : input.follow !== undefined ?
		input.follow : 20;
	this.compress = init.compress !== undefined ?
		init.compress : input.compress !== undefined ?
		input.compress : true;
	this.counter = init.counter || input.counter || 0;
	this.agent = init.agent || input.agent;

	Body.call(this, init.body || this._clone(input), {
		timeout: init.timeout || input.timeout || 0,
		size: init.size || input.size || 0
	});

	// server request options
	this.protocol = url_parsed.protocol;
	this.hostname = url_parsed.hostname;
	this.port = url_parsed.port;
	this.path = url_parsed.path;
	this.auth = url_parsed.auth;
}

Request.prototype = Object.create(Body.prototype);

/**
 * Clone this request
 *
 * @return  Request
 */
Request.prototype.clone = function() {
	return new Request(this);
};

},{"./body":65,"./headers":67,"url":undefined}],69:[function(require,module,exports){

/**
 * response.js
 *
 * Response class provides content decoding
 */

var http = require('http');
var Headers = require('./headers');
var Body = require('./body');

module.exports = Response;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Response(body, opts) {

	opts = opts || {};

	this.url = opts.url;
	this.status = opts.status || 200;
	this.statusText = opts.statusText || http.STATUS_CODES[this.status];
	this.headers = new Headers(opts.headers);
	this.ok = this.status >= 200 && this.status < 300;

	Body.call(this, body, opts);

}

Response.prototype = Object.create(Body.prototype);

/**
 * Clone this response
 *
 * @return  Response
 */
Response.prototype.clone = function() {
	return new Response(this._clone(this), {
		url: this.url
		, status: this.status
		, statusText: this.statusText
		, headers: this.headers
		, ok: this.ok
	});
};

},{"./body":65,"./headers":67,"http":undefined}],70:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],71:[function(require,module,exports){
'use strict';
var strictUriEncode = require('strict-uri-encode');
var objectAssign = require('object-assign');

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)]$/.exec(key);

				key = key.replace(/\[\d*]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[])$/.exec(key);

				key = key.replace(/\[]$/, '');

				if (!result || accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};

},{"object-assign":70,"strict-uri-encode":72}],72:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};

},{}],73:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _es6Promise = require('es6-promise');

var _fetchRequest2 = require('./private/fetchRequest.js');

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Fetches an array of datasources from PC.
 * @module dataSources
 */
var dataSources = function (_fetchRequest) {
  _inherits(dataSources, _fetchRequest);

  function dataSources() {
    var _ret;

    _classCallCheck(this, dataSources);

    var _this = _possibleConstructorReturn(this, (dataSources.__proto__ || Object.getPrototypeOf(dataSources)).call(this, {
      user: "pc2pathways"
    }));

    _this.command = "metadata/datasources";
    _this.data = undefined;
    _this.fetch();

    // Private functions
    _this.promisifyData = function () {
      if (_this.data !== undefined) {
        return new _es6Promise.Promise(function (resolve) {
          resolve(_this.data);
        });
      } else {
        return _this.fetch().then(function () {
          return _this.data;
        });
      }
    };

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  /**
  * Purges existing data source cache and makes a call to PC to re-get data sources.
  * @function - fetch
  */


  _createClass(dataSources, [{
    key: 'fetch',
    value: function fetch() {
      var _this2 = this;

      return _get(dataSources.prototype.__proto__ || Object.getPrototypeOf(dataSources.prototype), 'fetch', this).call(this).then(function (response) {
        if ((0, _isObject2.default)(response)) {
          var output = {};
          response.filter(function (source) {
            return source.notPathwayData == false;
          }).map(function (ds) {
            var name = ds.name.length > 1 ? ds.name[1] : ds.name[0];
            output[ds.uri] = {
              id: ds.identifier,
              uri: ds.uri,
              name: name,
              description: ds.description,
              type: ds.type
            };
          });
          _this2.data = output;
        } else {
          _this2.data = false;
        }
        return _this2.data;
      });
    }

    /**
    * Returns array of data sources from PC. Caches array for use in later calls.
    * @function - get
    * @returns {Promise<array>|Promise<boolean>} - Returns promise containing either the data source array or false if not data source not available
    */

  }, {
    key: 'get',
    value: function get(callback) {
      var _this3 = this;

      if (callback !== undefined) {
        this.promisifyData().then(function () {
          return callback(_this3.data);
        });
      } else {
        return this.promisifyData();
      }
    }
  }]);

  return dataSources;
}(_fetchRequest2.fetchRequest);

module.exports = new dataSources();

},{"./private/fetchRequest.js":77,"es6-promise":3,"lodash/isObject":60}],74:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _es6Promise = require('es6-promise');

var _fetchRequest2 = require('./private/fetchRequest.js');

var _helpers = require('./private/helpers.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class
 * @classdesc Peforms a GET web query to the Pathway Commons web service
 */
var get = function (_fetchRequest) {
  _inherits(get, _fetchRequest);

  /**
   * Initialises get and sets query object if one is provided. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */
  function get(queryObject) {
    var _ret;

    _classCallCheck(this, get);

    var _this = _possibleConstructorReturn(this, (get.__proto__ || Object.getPrototypeOf(get)).call(this, queryObject));

    _this.command = "get";
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Sets uri parameter which is to be sent with the get request
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(get, [{
    key: 'query',
    value: function query(queryObject) {
      return _get(get.prototype.__proto__ || Object.getPrototypeOf(get.prototype), 'query', this).call(this, queryObject);
    }

    /**
     * Sets uri parameter which is to be sent with the get request
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      return _get(get.prototype.__proto__ || Object.getPrototypeOf(get.prototype), 'set', this).call(this, "uri", value);
    }

    /**
     * Sets uri parameter using the uniprot ID
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uniprot',
    value: function uniprot(uniprotId) {
      return this.uri((0, _helpers._buildUniprotUri)(uniprotId));
    }

    /**
     * Sets format parameter which is to be sent with the get request
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      return _get(get.prototype.__proto__ || Object.getPrototypeOf(get.prototype), 'set', this).call(this, "format", value);
    }

    /**
     * Initialises get and sets query object if one is provided
     * @return {Promise<string>|Promise<object>|Promise<boolean>} - Promise returning either an object or string depending on format
     *
     */
    /** Initialises get and sets query object if one is provided
     * @param {requestCallback} [callback] - Terminating callback, see below for arguments
     * @return {this}
     */

  }, {
    key: 'fetch',
    value: function fetch(callback) {
      var _this2 = this;

      return _get(get.prototype.__proto__ || Object.getPrototypeOf(get.prototype), 'fetch', this).call(this).then(function (response) {
        if (callback !== undefined) {
          /**
           * Callback for get function, which is always called on completion
           *
           * @callback get~requestCallback
           * @param {string|object|boolean} response - Response text or object returned from PC if available. Otherwise if no response returned, returns false. If there was a network failure, null returned.
           */
          callback(response);
          return _this2;
        } else {
          return response;
        }
      });
    }
  }]);

  return get;
}(_fetchRequest2.fetchRequest);

module.exports = get;

},{"./private/fetchRequest.js":77,"./private/helpers.js":78,"es6-promise":3}],75:[function(require,module,exports){
'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
	get: require('./get.js'),
	dataSources: require('./dataSources.js'),
	logoUrl: require('./logoUrl.js'),
	search: require('./search.js'),
	traverse: require('./traverse.js')
};

},{"./dataSources.js":73,"./get.js":74,"./logoUrl.js":76,"./search.js":79,"./traverse.js":80}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Fetches the logo for the datasource using either datasources URI or name. Intended to be used to generate image tags.
 * @module logoUrl
 * @param {string} logoIdentifier - Either URI or name of the data source
 * @return {string} logoUrl - URL of datasource in question, else empty string
 */
var logoUrl = function logoUrl(dsUriOrName) {
  return string;
};

exports.default = logoUrl;

},{}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRequest = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Promise = require('es6-promise');

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _queryString = require('query-string');

var _helpers = require('./helpers.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('isomorphic-fetch');

fetch.Promise = _es6Promise.Promise;

/**
 * @class
 * @classdesc Base class for use in fetch requests, not intended to be used on its own
 */

var fetchRequest = exports.fetchRequest = function () {
  function fetchRequest(queryObject) {
    _classCallCheck(this, fetchRequest);

    this.pcUrl = "http://www.pathwaycommons.org/pc2/";
    this.command = "TO_BE_REPLACED";
    this.responseText = "";
    this.queryObject = {};
    if (queryObject !== undefined) {
      this.queryObject = queryObject;
    }

    return this;
  }

  _createClass(fetchRequest, [{
    key: 'query',
    value: function query(queryObject) {
      this.queryObject = queryObject;
      return this;
    }
  }, {
    key: 'set',
    value: function set(parameter, value) {
      parameter = String(parameter);
      if (parameter !== "") {
        if (value === "" || (0, _isArray2.default)(value) && !(0, _isEmpty2.default)(value)) {
          this.delete(parameter);
        } else {
          this.queryObject[parameter] = value;
        }
      }

      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(parameter) {
      delete this.queryObject[parameter];
    }
  }, {
    key: 'fetch',
    value: function (_fetch) {
      function fetch() {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function () {
      var _this = this;

      var fetchPromise = fetch(this.pcUrl + this.command + "?" + (0, _queryString.stringify)(this.queryObject));
      var responseCode = fetchPromise.then(function (responseObject) {
        return responseObject;
      });

      var responseText = fetchPromise.then(function (responseObject) {
        return responseObject.text();
      }).then(function (responseString) {
        _this.responseText = responseString;
        return responseString;
      });

      return _es6Promise.Promise.all([responseCode, responseText]).then(function (promiseArray) {
        switch (promiseArray[0].status) {
          case 200:
            return (0, _helpers._parseUnknownString)(promiseArray[1]);
            break;
          case 500:
            return false;
            break;
          default:
            return null;
        }
      }).catch(function (error) {
        return null;
      });
    })
  }]);

  return fetchRequest;
}();

},{"./helpers.js":78,"es6-promise":3,"isomorphic-fetch":26,"lodash/isArray":54,"lodash/isEmpty":57,"lodash/isObject":60,"query-string":71}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @private
 * @param {string} jsonString
 * @return {object|string} jsonObject - If valid JSON parse as JSON otherwise return original string
 */
var _parseUnknownString = exports._parseUnknownString = function _parseUnknownString(string) {
  try {
    return JSON.parse(string);
  } catch (e) {
    return string;
  }
};

/**
 * @private
 * @param {string} uniprotId
 * @return {string} uniprotUri
 */
var _buildUniprotUri = exports._buildUniprotUri = function _buildUniprotUri(uniprodId) {
  return "http://identifiers.org/uniprot/" + uniprodId;
};

},{}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Peforms a SEARCH web query to the Pathway Commons web service
 * @module search
 * @param {object} query_object - Object representing the query parameters to be sent along with the search command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var search = function search(query_object, callback) {
	/**
 * Callback for search function, which is always called on completion
 *
 * @callback requestCallback
 * @param {string} responseStatus - A string which indicates failure, no results returned, or success.
 * @param {object} responseObject - A parsed JSON object returned from PC if available, else empty object. Result from search is assumed to be in JSON format.
 */
	callback(responseStatus, responseObject);
};

exports.default = search;

},{}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Peforms a SEARCH web query to the Pathway Commons web service
 * @module traverse
 * @param {object} query_object - Object representing the query parameters to be sent along with the traverse command.
 * @param {requestCallback} callback - Terminating callback, see below for arguments.
 */
var traverse = function traverse(query_array, callback) {
	/**
 * Callback for traverse function, which is always called on completion
 *
 * @callback requestCallback
 * @param {string} responseStatus - A string which indicates failure, no results returned, or success.
 * @param {object} responseObject - A parsed JSON object returned from PC if available, else empty object. Result from traverse is assumed to be in JSON format.
 */
	callback(responseStatus, responseObject);
};

exports.default = traverse;

},{}]},{},[75])(75)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZW5jb2RpbmcvbGliL2VuY29kaW5nLmpzIiwibm9kZV9tb2R1bGVzL2VuY29kaW5nL2xpYi9pY29udi1sb2FkZXIuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9kYmNzLWNvZGVjLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL2RiY3MtZGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9zYmNzLWNvZGVjLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3NiY3MtZGF0YS1nZW5lcmF0ZWQuanMiLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3Mvc2Jjcy1kYXRhLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3RhYmxlcy9iaWc1LWFkZGVkLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTM2Lmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTQ5Lmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTUwLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2V1Y2pwLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2diMTgwMzAtcmFuZ2VzLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2diay1hZGRlZC5qc29uIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3RhYmxlcy9zaGlmdGppcy5qc29uIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3V0ZjE2LmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3V0ZjcuanMiLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9saWIvYm9tLWhhbmRsaW5nLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL2V4dGVuZC1ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL3N0cmVhbXMuanMiLCJub2RlX21vZHVsZXMvaXMtc3RyZWFtL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtZmV0Y2gvZmV0Y2gtbnBtLW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2xpYi9ib2R5LmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvbGliL2ZldGNoLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvbGliL2hlYWRlcnMuanMiLCJub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9saWIvcmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2xpYi9yZXNwb25zZS5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5LXN0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpY3QtdXJpLWVuY29kZS9pbmRleC5qcyIsInNyYy9kYXRhU291cmNlcy5qcyIsInNyYy9nZXQuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbG9nb1VybC5qcyIsInNyYy9wcml2YXRlL2ZldGNoUmVxdWVzdC5qcyIsInNyYy9wcml2YXRlL2hlbHBlcnMuanMiLCJzcmMvc2VhcmNoLmpzIiwic3JjL3RyYXZlcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNOQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7SUFJTSxXOzs7QUFDSix5QkFBYztBQUFBOztBQUFBOztBQUFBLDBIQUNOO0FBQ0osWUFBTTtBQURGLEtBRE07O0FBSVosVUFBSyxPQUFMLEdBQWUsc0JBQWY7QUFDQSxVQUFLLElBQUwsR0FBWSxTQUFaO0FBQ0EsVUFBSyxLQUFMOztBQUVBO0FBQ0EsVUFBSyxhQUFMLEdBQXFCLFlBQU07QUFDekIsVUFBSSxNQUFLLElBQUwsS0FBYyxTQUFsQixFQUE2QjtBQUMzQixlQUFPLHdCQUFZLFVBQUMsT0FBRCxFQUFhO0FBQzlCLGtCQUFRLE1BQUssSUFBYjtBQUNELFNBRk0sQ0FBUDtBQUdELE9BSkQsTUFJTztBQUNMLGVBQU8sTUFBSyxLQUFMLEdBQWEsSUFBYixDQUFrQixZQUFNO0FBQzdCLGlCQUFPLE1BQUssSUFBWjtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBQ0YsS0FWRDs7QUFZQTtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFJUTtBQUFBOztBQUNOLGFBQU8sZ0hBQWMsSUFBZCxDQUFtQixVQUFDLFFBQUQsRUFBYztBQUN0QyxZQUFJLHdCQUFTLFFBQVQsQ0FBSixFQUF3QjtBQUN0QixjQUFJLFNBQVMsRUFBYjtBQUNBLG1CQUNHLE1BREgsQ0FDVTtBQUFBLG1CQUFVLE9BQU8sY0FBUCxJQUF5QixLQUFuQztBQUFBLFdBRFYsRUFFRyxHQUZILENBRU8sVUFBQyxFQUFELEVBQVE7QUFDWCxnQkFBSSxPQUFRLEdBQUcsSUFBSCxDQUFRLE1BQVIsR0FBaUIsQ0FBbEIsR0FBdUIsR0FBRyxJQUFILENBQVEsQ0FBUixDQUF2QixHQUFvQyxHQUFHLElBQUgsQ0FBUSxDQUFSLENBQS9DO0FBQ0EsbUJBQU8sR0FBRyxHQUFWLElBQWlCO0FBQ2Ysa0JBQUksR0FBRyxVQURRO0FBRWYsbUJBQUssR0FBRyxHQUZPO0FBR2Ysb0JBQU0sSUFIUztBQUlmLDJCQUFhLEdBQUcsV0FKRDtBQUtmLG9CQUFNLEdBQUc7QUFMTSxhQUFqQjtBQU9ELFdBWEg7QUFZQSxpQkFBSyxJQUFMLEdBQVksTUFBWjtBQUNELFNBZkQsTUFlTztBQUNMLGlCQUFLLElBQUwsR0FBWSxLQUFaO0FBQ0Q7QUFDRCxlQUFPLE9BQUssSUFBWjtBQUNELE9BcEJNLENBQVA7QUFxQkQ7O0FBRUQ7Ozs7Ozs7O3dCQUtJLFEsRUFBVTtBQUFBOztBQUNaLFVBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixhQUFLLGFBQUwsR0FBcUIsSUFBckIsQ0FBMEI7QUFBQSxpQkFBTSxTQUFTLE9BQUssSUFBZCxDQUFOO0FBQUEsU0FBMUI7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLEtBQUssYUFBTCxFQUFQO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLElBQUksV0FBSixFQUFqQjs7Ozs7Ozs7O0FDNUVBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBOzs7O0lBSU0sRzs7O0FBQ0o7Ozs7OztBQU1BLGVBQVksV0FBWixFQUF5QjtBQUFBOztBQUFBOztBQUFBLDBHQUNqQixXQURpQjs7QUFFdkIsVUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzswQkFLTSxXLEVBQWE7QUFDakIsNkdBQW1CLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtJLEssRUFBTztBQUNULDJHQUFpQixLQUFqQixFQUF3QixLQUF4QjtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFLUSxTLEVBQVc7QUFDakIsYUFBTyxLQUFLLEdBQUwsQ0FBUywrQkFBaUIsU0FBakIsQ0FBVCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUtPLEssRUFBTztBQUNaLDJHQUFpQixRQUFqQixFQUEyQixLQUEzQjtBQUNEOztBQUVEOzs7OztBQUtBOzs7Ozs7OzBCQUlNLFEsRUFBVTtBQUFBOztBQUNkLGFBQU8sZ0dBQWMsSUFBZCxDQUFtQixVQUFDLFFBQUQsRUFBYztBQUN0QyxZQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUI7Ozs7OztBQU1BLG1CQUFTLFFBQVQ7QUFDQTtBQUNELFNBVEQsTUFTTztBQUNMLGlCQUFPLFFBQVA7QUFDRDtBQUNGLE9BYk0sQ0FBUDtBQWNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsR0FBakI7Ozs7O0FDcEZBOzs7Ozs7QUFNQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsTUFBSyxRQUFRLFVBQVIsQ0FEVztBQUVoQixjQUFhLFFBQVEsa0JBQVIsQ0FGRztBQUdoQixVQUFTLFFBQVEsY0FBUixDQUhPO0FBSWhCLFNBQVEsUUFBUSxhQUFSLENBSlE7QUFLaEIsV0FBVSxRQUFRLGVBQVI7QUFMTSxDQUFqQjs7Ozs7Ozs7QUNOQTs7Ozs7O0FBTUEsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLFdBQUQsRUFBaUI7QUFDaEMsU0FBTyxNQUFQO0FBQ0EsQ0FGRDs7a0JBSWUsTzs7Ozs7Ozs7Ozs7O0FDVmY7O0FBR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7OztBQVBBLFFBQVEsa0JBQVI7O0FBU0EsTUFBTSxPQUFOOztBQUVBOzs7OztJQUlhLFksV0FBQSxZO0FBQ1gsd0JBQVksV0FBWixFQUF5QjtBQUFBOztBQUN2QixTQUFLLEtBQUwsR0FBYSxvQ0FBYjtBQUNBLFNBQUssT0FBTCxHQUFlLGdCQUFmO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEVBQXBCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsUUFBSSxnQkFBZ0IsU0FBcEIsRUFBK0I7QUFDN0IsV0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0Q7Ozs7MEJBRUssVyxFQUFhO0FBQ2pCLFdBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7d0JBRUcsUyxFQUFXLEssRUFBTztBQUNwQixrQkFBWSxPQUFPLFNBQVAsQ0FBWjtBQUNBLFVBQUksY0FBYyxFQUFsQixFQUFzQjtBQUNwQixZQUFJLFVBQVUsRUFBVixJQUFpQix1QkFBUSxLQUFSLEtBQWtCLENBQUMsdUJBQVEsS0FBUixDQUF4QyxFQUF5RDtBQUN2RCxlQUFLLE1BQUwsQ0FBWSxTQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxXQUFMLENBQWlCLFNBQWpCLElBQThCLEtBQTlCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OzRCQUVNLFMsRUFBVztBQUNoQixhQUFPLEtBQUssV0FBTCxDQUFpQixTQUFqQixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7a0JBRU87QUFBQTs7QUFDTixVQUFJLGVBQWUsTUFBTSxLQUFLLEtBQUwsR0FBYSxLQUFLLE9BQWxCLEdBQTRCLEdBQTVCLEdBQWtDLDRCQUFlLEtBQUssV0FBcEIsQ0FBeEMsQ0FBbkI7QUFDQSxVQUFJLGVBQWUsYUFBYSxJQUFiLENBQWtCLFVBQUMsY0FBRCxFQUFvQjtBQUN2RCxlQUFPLGNBQVA7QUFDRCxPQUZrQixDQUFuQjs7QUFJQSxVQUFJLGVBQWUsYUFBYSxJQUFiLENBQWtCLFVBQUMsY0FBRCxFQUFvQjtBQUNyRCxlQUFPLGVBQWUsSUFBZixFQUFQO0FBQ0QsT0FGZ0IsRUFHaEIsSUFIZ0IsQ0FHWCxVQUFDLGNBQUQsRUFBb0I7QUFDeEIsY0FBSyxZQUFMLEdBQW9CLGNBQXBCO0FBQ0EsZUFBTyxjQUFQO0FBQ0QsT0FOZ0IsQ0FBbkI7O0FBUUEsYUFBTyxvQkFBUSxHQUFSLENBQVksQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFaLEVBQTBDLElBQTFDLENBQStDLFVBQUMsWUFBRCxFQUFrQjtBQUNwRSxnQkFBUSxhQUFhLENBQWIsRUFBZ0IsTUFBeEI7QUFDRSxlQUFLLEdBQUw7QUFDRSxtQkFBTyxrQ0FBb0IsYUFBYSxDQUFiLENBQXBCLENBQVA7QUFDQTtBQUNGLGVBQUssR0FBTDtBQUNFLG1CQUFPLEtBQVA7QUFDQTtBQUNGO0FBQ0UsbUJBQU8sSUFBUDtBQVJKO0FBVUQsT0FYSSxFQVlKLEtBWkksQ0FZRSxVQUFDLEtBQUQsRUFBVztBQUNoQixlQUFPLElBQVA7QUFDRCxPQWRJLENBQVA7QUFlRCxLOzs7Ozs7Ozs7Ozs7QUNoRkg7Ozs7O0FBS08sSUFBTSxvREFBc0IsU0FBdEIsbUJBQXNCLENBQUMsTUFBRCxFQUFZO0FBQzdDLE1BQUk7QUFDRixXQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBUDtBQUNELEdBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLFdBQU8sTUFBUDtBQUNEO0FBQ0YsQ0FOTTs7QUFRUDs7Ozs7QUFLTyxJQUFNLDhDQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxTQUFELEVBQWU7QUFDN0MsU0FBTyxvQ0FBb0MsU0FBM0M7QUFDRCxDQUZNOzs7Ozs7OztBQ2xCUDs7Ozs7O0FBTUEsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFDLFlBQUQsRUFBZSxRQUFmLEVBQTRCO0FBQzFDOzs7Ozs7O0FBT0EsVUFBUyxjQUFULEVBQXlCLGNBQXpCO0FBQ0EsQ0FURDs7a0JBV2UsTTs7Ozs7Ozs7QUNqQmY7Ozs7OztBQU1BLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUEyQjtBQUMzQzs7Ozs7OztBQU9BLFVBQVMsY0FBVCxFQUF5QixjQUF6QjtBQUNBLENBVEQ7O2tCQVdlLFEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaWNvbnZMaXRlID0gcmVxdWlyZSgnaWNvbnYtbGl0ZScpO1xuLy8gTG9hZCBJY29udiBmcm9tIGFuIGV4dGVybmFsIGZpbGUgdG8gYmUgYWJsZSB0byBkaXNhYmxlIEljb252IGZvciB3ZWJwYWNrXG4vLyBBZGQgL1xcL2ljb252LWxvYWRlciQvIHRvIHdlYnBhY2suSWdub3JlUGx1Z2luIHRvIGlnbm9yZSBpdFxudmFyIEljb252ID0gcmVxdWlyZSgnLi9pY29udi1sb2FkZXInKTtcblxuLy8gRXhwb3NlIHRvIHRoZSB3b3JsZFxubW9kdWxlLmV4cG9ydHMuY29udmVydCA9IGNvbnZlcnQ7XG5cbi8qKlxuICogQ29udmVydCBlbmNvZGluZyBvZiBhbiBVVEYtOCBzdHJpbmcgb3IgYSBidWZmZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xCdWZmZXJ9IHN0ciBTdHJpbmcgdG8gYmUgY29udmVydGVkXG4gKiBAcGFyYW0ge1N0cmluZ30gdG8gRW5jb2RpbmcgdG8gYmUgY29udmVydGVkIHRvXG4gKiBAcGFyYW0ge1N0cmluZ30gW2Zyb209J1VURi04J10gRW5jb2RpbmcgdG8gYmUgY29udmVydGVkIGZyb21cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXNlTGl0ZSBJZiBzZXQgdG8gdHVyZSwgZm9yY2UgdG8gdXNlIGljb252TGl0ZVxuICogQHJldHVybiB7QnVmZmVyfSBFbmNvZGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBjb252ZXJ0KHN0ciwgdG8sIGZyb20sIHVzZUxpdGUpIHtcbiAgICBmcm9tID0gY2hlY2tFbmNvZGluZyhmcm9tIHx8ICdVVEYtOCcpO1xuICAgIHRvID0gY2hlY2tFbmNvZGluZyh0byB8fCAnVVRGLTgnKTtcbiAgICBzdHIgPSBzdHIgfHwgJyc7XG5cbiAgICB2YXIgcmVzdWx0O1xuXG4gICAgaWYgKGZyb20gIT09ICdVVEYtOCcgJiYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3RyID0gbmV3IEJ1ZmZlcihzdHIsICdiaW5hcnknKTtcbiAgICB9XG5cbiAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgQnVmZmVyKHN0cik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBzdHI7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEljb252ICYmICF1c2VMaXRlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBjb252ZXJ0SWNvbnYoc3RyLCB0bywgZnJvbSk7XG4gICAgICAgIH0gY2F0Y2ggKEUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoRSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNvbnZlcnRJY29udkxpdGUoc3RyLCB0bywgZnJvbSk7XG4gICAgICAgICAgICB9IGNhdGNoIChFKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihFKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBzdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gY29udmVydEljb252TGl0ZShzdHIsIHRvLCBmcm9tKTtcbiAgICAgICAgfSBjYXRjaCAoRSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihFKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHN0cjtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBCdWZmZXIocmVzdWx0LCAndXRmLTgnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnQgZW5jb2Rpbmcgb2YgYSBzdHJpbmcgd2l0aCBub2RlLWljb252IChpZiBhdmFpbGFibGUpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QnVmZmVyfSBzdHIgU3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIHtTdHJpbmd9IHRvIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCB0b1xuICogQHBhcmFtIHtTdHJpbmd9IFtmcm9tPSdVVEYtOCddIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCBmcm9tXG4gKiBAcmV0dXJuIHtCdWZmZXJ9IEVuY29kZWQgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRJY29udihzdHIsIHRvLCBmcm9tKSB7XG4gICAgdmFyIHJlc3BvbnNlLCBpY29udjtcbiAgICBpY29udiA9IG5ldyBJY29udihmcm9tLCB0byArICcvL1RSQU5TTElULy9JR05PUkUnKTtcbiAgICByZXNwb25zZSA9IGljb252LmNvbnZlcnQoc3RyKTtcbiAgICByZXR1cm4gcmVzcG9uc2Uuc2xpY2UoMCwgcmVzcG9uc2UubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGVuY29kaW5nIG9mIGFzdHJpbmcgd2l0aCBpY29udi1saXRlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QnVmZmVyfSBzdHIgU3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIHtTdHJpbmd9IHRvIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCB0b1xuICogQHBhcmFtIHtTdHJpbmd9IFtmcm9tPSdVVEYtOCddIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCBmcm9tXG4gKiBAcmV0dXJuIHtCdWZmZXJ9IEVuY29kZWQgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRJY29udkxpdGUoc3RyLCB0bywgZnJvbSkge1xuICAgIGlmICh0byA9PT0gJ1VURi04Jykge1xuICAgICAgICByZXR1cm4gaWNvbnZMaXRlLmRlY29kZShzdHIsIGZyb20pO1xuICAgIH0gZWxzZSBpZiAoZnJvbSA9PT0gJ1VURi04Jykge1xuICAgICAgICByZXR1cm4gaWNvbnZMaXRlLmVuY29kZShzdHIsIHRvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaWNvbnZMaXRlLmVuY29kZShpY29udkxpdGUuZGVjb2RlKHN0ciwgZnJvbSksIHRvKTtcbiAgICB9XG59XG5cbi8qKlxuICogQ29udmVydHMgY2hhcnNldCBuYW1lIGlmIG5lZWRlZFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIENoYXJhY3RlciBzZXRcbiAqIEByZXR1cm4ge1N0cmluZ30gQ2hhcmFjdGVyIHNldCBuYW1lXG4gKi9cbmZ1bmN0aW9uIGNoZWNrRW5jb2RpbmcobmFtZSkge1xuICAgIHJldHVybiAobmFtZSB8fCAnJykudG9TdHJpbmcoKS50cmltKCkuXG4gICAgcmVwbGFjZSgvXmxhdGluW1xcLV9dPyhcXGQrKSQvaSwgJ0lTTy04ODU5LSQxJykuXG4gICAgcmVwbGFjZSgvXndpbig/OmRvd3MpP1tcXC1fXT8oXFxkKykkL2ksICdXSU5ET1dTLSQxJykuXG4gICAgcmVwbGFjZSgvXnV0ZltcXC1fXT8oXFxkKykkL2ksICdVVEYtJDEnKS5cbiAgICByZXBsYWNlKC9ea3NfY181NjAxXFwtMTk4NyQvaSwgJ0NQOTQ5JykuXG4gICAgcmVwbGFjZSgvXnVzW1xcLV9dP2FzY2lpJC9pLCAnQVNDSUknKS5cbiAgICB0b1VwcGVyQ2FzZSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaWNvbnZfcGFja2FnZTtcbnZhciBJY29udjtcblxudHJ5IHtcbiAgICAvLyB0aGlzIGlzIHRvIGZvb2wgYnJvd3NlcmlmeSBzbyBpdCBkb2Vzbid0IHRyeSAoaW4gdmFpbikgdG8gaW5zdGFsbCBpY29udi5cbiAgICBpY29udl9wYWNrYWdlID0gJ2ljb252JztcbiAgICBJY29udiA9IHJlcXVpcmUoaWNvbnZfcGFja2FnZSkuSWNvbnY7XG59IGNhdGNoIChFKSB7XG4gICAgLy8gbm9kZS1pY29udiBub3QgcHJlc2VudFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEljb252O1xuIiwiLyohXG4gKiBAb3ZlcnZpZXcgZXM2LXByb21pc2UgLSBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgUHJvbWlzZXMvQSsuXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAxNCBZZWh1ZGEgS2F0eiwgVG9tIERhbGUsIFN0ZWZhbiBQZW5uZXIgYW5kIGNvbnRyaWJ1dG9ycyAoQ29udmVyc2lvbiB0byBFUzYgQVBJIGJ5IEpha2UgQXJjaGliYWxkKVxuICogQGxpY2Vuc2UgICBMaWNlbnNlZCB1bmRlciBNSVQgbGljZW5zZVxuICogICAgICAgICAgICBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3N0ZWZhbnBlbm5lci9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICA0LjAuNVxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5FUzZQcm9taXNlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBvYmplY3RPckZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nO1xufVxuXG52YXIgX2lzQXJyYXkgPSB1bmRlZmluZWQ7XG5pZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgX2lzQXJyYXkgPSBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG59IGVsc2Uge1xuICBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG59XG5cbnZhciBpc0FycmF5ID0gX2lzQXJyYXk7XG5cbnZhciBsZW4gPSAwO1xudmFyIHZlcnR4TmV4dCA9IHVuZGVmaW5lZDtcbnZhciBjdXN0b21TY2hlZHVsZXJGbiA9IHVuZGVmaW5lZDtcblxudmFyIGFzYXAgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgcXVldWVbbGVuXSA9IGNhbGxiYWNrO1xuICBxdWV1ZVtsZW4gKyAxXSA9IGFyZztcbiAgbGVuICs9IDI7XG4gIGlmIChsZW4gPT09IDIpIHtcbiAgICAvLyBJZiBsZW4gaXMgMiwgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gc2NoZWR1bGUgYW4gYXN5bmMgZmx1c2guXG4gICAgLy8gSWYgYWRkaXRpb25hbCBjYWxsYmFja3MgYXJlIHF1ZXVlZCBiZWZvcmUgdGhlIHF1ZXVlIGlzIGZsdXNoZWQsIHRoZXlcbiAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgaWYgKGN1c3RvbVNjaGVkdWxlckZuKSB7XG4gICAgICBjdXN0b21TY2hlZHVsZXJGbihmbHVzaCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNldFNjaGVkdWxlcihzY2hlZHVsZUZuKSB7XG4gIGN1c3RvbVNjaGVkdWxlckZuID0gc2NoZWR1bGVGbjtcbn1cblxuZnVuY3Rpb24gc2V0QXNhcChhc2FwRm4pIHtcbiAgYXNhcCA9IGFzYXBGbjtcbn1cblxudmFyIGJyb3dzZXJXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbnZhciBicm93c2VyR2xvYmFsID0gYnJvd3NlcldpbmRvdyB8fCB7fTtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgaXNOb2RlID0gdHlwZW9mIHNlbGYgPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAoe30pLnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJztcblxuLy8gdGVzdCBmb3Igd2ViIHdvcmtlciBidXQgbm90IGluIElFMTBcbnZhciBpc1dvcmtlciA9IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIG5vZGVcbmZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAvLyBub2RlIHZlcnNpb24gMC4xMC54IGRpc3BsYXlzIGEgZGVwcmVjYXRpb24gd2FybmluZyB3aGVuIG5leHRUaWNrIGlzIHVzZWQgcmVjdXJzaXZlbHlcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWpvanMvd2hlbi9pc3N1ZXMvNDEwIGZvciBkZXRhaWxzXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICB9O1xufVxuXG4vLyB2ZXJ0eFxuZnVuY3Rpb24gdXNlVmVydHhUaW1lcigpIHtcbiAgaWYgKHR5cGVvZiB2ZXJ0eE5leHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZlcnR4TmV4dChmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gIHZhciBpdGVyYXRpb25zID0gMDtcbiAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG9ic2VydmVyLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgbm9kZS5kYXRhID0gaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDI7XG4gIH07XG59XG5cbi8vIHdlYiB3b3JrZXJcbmZ1bmN0aW9uIHVzZU1lc3NhZ2VDaGFubmVsKCkge1xuICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBlczYtcHJvbWlzZSB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gIHZhciBnbG9iYWxTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZ2xvYmFsU2V0VGltZW91dChmbHVzaCwgMSk7XG4gIH07XG59XG5cbnZhciBxdWV1ZSA9IG5ldyBBcnJheSgxMDAwKTtcbmZ1bmN0aW9uIGZsdXNoKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gcXVldWVbaV07XG4gICAgdmFyIGFyZyA9IHF1ZXVlW2kgKyAxXTtcblxuICAgIGNhbGxiYWNrKGFyZyk7XG5cbiAgICBxdWV1ZVtpXSA9IHVuZGVmaW5lZDtcbiAgICBxdWV1ZVtpICsgMV0gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBhdHRlbXB0VmVydHgoKSB7XG4gIHRyeSB7XG4gICAgdmFyIHIgPSByZXF1aXJlO1xuICAgIHZhciB2ZXJ0eCA9IHIoJ3ZlcnR4Jyk7XG4gICAgdmVydHhOZXh0ID0gdmVydHgucnVuT25Mb29wIHx8IHZlcnR4LnJ1bk9uQ29udGV4dDtcbiAgICByZXR1cm4gdXNlVmVydHhUaW1lcigpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHVzZVNldFRpbWVvdXQoKTtcbiAgfVxufVxuXG52YXIgc2NoZWR1bGVGbHVzaCA9IHVuZGVmaW5lZDtcbi8vIERlY2lkZSB3aGF0IGFzeW5jIG1ldGhvZCB0byB1c2UgdG8gdHJpZ2dlcmluZyBwcm9jZXNzaW5nIG9mIHF1ZXVlZCBjYWxsYmFja3M6XG5pZiAoaXNOb2RlKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xufSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xufSBlbHNlIGlmIChpc1dvcmtlcikge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTWVzc2FnZUNoYW5uZWwoKTtcbn0gZWxzZSBpZiAoYnJvd3NlcldpbmRvdyA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSB7XG4gIHNjaGVkdWxlRmx1c2ggPSBhdHRlbXB0VmVydHgoKTtcbn0gZWxzZSB7XG4gIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG59XG5cbmZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9hcmd1bWVudHMgPSBhcmd1bWVudHM7XG5cbiAgdmFyIHBhcmVudCA9IHRoaXM7XG5cbiAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKGNoaWxkW1BST01JU0VfSURdID09PSB1bmRlZmluZWQpIHtcbiAgICBtYWtlUHJvbWlzZShjaGlsZCk7XG4gIH1cblxuICB2YXIgX3N0YXRlID0gcGFyZW50Ll9zdGF0ZTtcblxuICBpZiAoX3N0YXRlKSB7XG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWxsYmFjayA9IF9hcmd1bWVudHNbX3N0YXRlIC0gMV07XG4gICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrKF9zdGF0ZSwgY2hpbGQsIGNhbGxiYWNrLCBwYXJlbnQuX3Jlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KSgpO1xuICB9IGVsc2Uge1xuICAgIHN1YnNjcmliZShwYXJlbnQsIGNoaWxkLCBvbkZ1bGZpbGxtZW50LCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4gY2hpbGQ7XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZXNvbHZlYCByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIHJlc29sdmVkIHdpdGggdGhlXG4gIHBhc3NlZCBgdmFsdWVgLiBJdCBpcyBzaG9ydGhhbmQgZm9yIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgcmVzb2x2ZSgxKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgSW5zdGVhZCBvZiB3cml0aW5nIHRoZSBhYm92ZSwgeW91ciBjb2RlIG5vdyBzaW1wbHkgYmVjb21lcyB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoMSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyB2YWx1ZSA9PT0gMVxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCByZXNvbHZlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHZhbHVlIHZhbHVlIHRoYXQgdGhlIHJldHVybmVkIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgd2lsbCBiZWNvbWUgZnVsZmlsbGVkIHdpdGggdGhlIGdpdmVuXG4gIGB2YWx1ZWBcbiovXG5mdW5jdGlvbiByZXNvbHZlKG9iamVjdCkge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3Jlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbnZhciBQUk9NSVNFX0lEID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDE2KTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBQRU5ESU5HID0gdm9pZCAwO1xudmFyIEZVTEZJTExFRCA9IDE7XG52YXIgUkVKRUNURUQgPSAyO1xuXG52YXIgR0VUX1RIRU5fRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gc2VsZkZ1bGZpbGxtZW50KCkge1xuICByZXR1cm4gbmV3IFR5cGVFcnJvcihcIllvdSBjYW5ub3QgcmVzb2x2ZSBhIHByb21pc2Ugd2l0aCBpdHNlbGZcIik7XG59XG5cbmZ1bmN0aW9uIGNhbm5vdFJldHVybk93bigpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZXMgY2FsbGJhY2sgY2Fubm90IHJldHVybiB0aGF0IHNhbWUgcHJvbWlzZS4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbihwcm9taXNlKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBHRVRfVEhFTl9FUlJPUi5lcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBHRVRfVEhFTl9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlUaGVuKHRoZW4sIHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpIHtcbiAgdHJ5IHtcbiAgICB0aGVuLmNhbGwodmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgYXNhcChmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgIHZhciBzZWFsZWQgPSBmYWxzZTtcbiAgICB2YXIgZXJyb3IgPSB0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGVuYWJsZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgaWYgKHNlYWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuXG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgIGlmICghc2VhbGVkICYmIGVycm9yKSB7XG4gICAgICBzZWFsZWQgPSB0cnVlO1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfVxuICB9LCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUpIHtcbiAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gRlVMRklMTEVEKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUodGhlbmFibGUsIHVuZGVmaW5lZCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlLCB0aGVuJCQpIHtcbiAgaWYgKG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IgPT09IHByb21pc2UuY29uc3RydWN0b3IgJiYgdGhlbiQkID09PSB0aGVuICYmIG1heWJlVGhlbmFibGUuY29uc3RydWN0b3IucmVzb2x2ZSA9PT0gcmVzb2x2ZSkge1xuICAgIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0aGVuJCQgPT09IEdFVF9USEVOX0VSUk9SKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIEdFVF9USEVOX0VSUk9SLmVycm9yKTtcbiAgICB9IGVsc2UgaWYgKHRoZW4kJCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIG1heWJlVGhlbmFibGUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbih0aGVuJCQpKSB7XG4gICAgICBoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBzZWxmRnVsZmlsbG1lbnQoKSk7XG4gIH0gZWxzZSBpZiAob2JqZWN0T3JGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICBoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlLCBnZXRUaGVuKHZhbHVlKSk7XG4gIH0gZWxzZSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gIGlmIChwcm9taXNlLl9vbmVycm9yKSB7XG4gICAgcHJvbWlzZS5fb25lcnJvcihwcm9taXNlLl9yZXN1bHQpO1xuICB9XG5cbiAgcHVibGlzaChwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gZnVsZmlsbChwcm9taXNlLCB2YWx1ZSkge1xuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fc3RhdGUgPSBGVUxGSUxMRUQ7XG5cbiAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgIGFzYXAocHVibGlzaCwgcHJvbWlzZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX3JlamVjdChwcm9taXNlLCByZWFzb24pIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHByb21pc2UuX3N0YXRlID0gUkVKRUNURUQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHJlYXNvbjtcblxuICBhc2FwKHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgdmFyIF9zdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gIHZhciBsZW5ndGggPSBfc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gIHBhcmVudC5fb25lcnJvciA9IG51bGw7XG5cbiAgX3N1YnNjcmliZXJzW2xlbmd0aF0gPSBjaGlsZDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIEZVTEZJTExFRF0gPSBvbkZ1bGZpbGxtZW50O1xuICBfc3Vic2NyaWJlcnNbbGVuZ3RoICsgUkVKRUNURURdID0gb25SZWplY3Rpb247XG5cbiAgaWYgKGxlbmd0aCA9PT0gMCAmJiBwYXJlbnQuX3N0YXRlKSB7XG4gICAgYXNhcChwdWJsaXNoLCBwYXJlbnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2gocHJvbWlzZSkge1xuICB2YXIgc3Vic2NyaWJlcnMgPSBwcm9taXNlLl9zdWJzY3JpYmVycztcbiAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGNoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2sgPSB1bmRlZmluZWQsXG4gICAgICBkZXRhaWwgPSBwcm9taXNlLl9yZXN1bHQ7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMykge1xuICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgY2FsbGJhY2sgPSBzdWJzY3JpYmVyc1tpICsgc2V0dGxlZF07XG5cbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICB9XG4gIH1cblxuICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBFcnJvck9iamVjdCgpIHtcbiAgdGhpcy5lcnJvciA9IG51bGw7XG59XG5cbnZhciBUUllfQ0FUQ0hfRVJST1IgPSBuZXcgRXJyb3JPYmplY3QoKTtcblxuZnVuY3Rpb24gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCkge1xuICB0cnkge1xuICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgVFJZX0NBVENIX0VSUk9SLmVycm9yID0gZTtcbiAgICByZXR1cm4gVFJZX0NBVENIX0VSUk9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludm9rZUNhbGxiYWNrKHNldHRsZWQsIHByb21pc2UsIGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdmFyIGhhc0NhbGxiYWNrID0gaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZCxcbiAgICAgIGVycm9yID0gdW5kZWZpbmVkLFxuICAgICAgc3VjY2VlZGVkID0gdW5kZWZpbmVkLFxuICAgICAgZmFpbGVkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChoYXNDYWxsYmFjaykge1xuICAgIHZhbHVlID0gdHJ5Q2F0Y2goY2FsbGJhY2ssIGRldGFpbCk7XG5cbiAgICBpZiAodmFsdWUgPT09IFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgIGVycm9yID0gdmFsdWUuZXJyb3I7XG4gICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIC8vIG5vb3BcbiAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGZhaWxlZCkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSBGVUxGSUxMRUQpIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVByb21pc2UocHJvbWlzZSwgcmVzb2x2ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSkge1xuICAgICAgX3Jlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0sIGZ1bmN0aW9uIHJlamVjdFByb21pc2UocmVhc29uKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfcmVqZWN0KHByb21pc2UsIGUpO1xuICB9XG59XG5cbnZhciBpZCA9IDA7XG5mdW5jdGlvbiBuZXh0SWQoKSB7XG4gIHJldHVybiBpZCsrO1xufVxuXG5mdW5jdGlvbiBtYWtlUHJvbWlzZShwcm9taXNlKSB7XG4gIHByb21pc2VbUFJPTUlTRV9JRF0gPSBpZCsrO1xuICBwcm9taXNlLl9zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICBwcm9taXNlLl9zdWJzY3JpYmVycyA9IFtdO1xufVxuXG5mdW5jdGlvbiBFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCkge1xuICB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yID0gQ29uc3RydWN0b3I7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcblxuICBpZiAoIXRoaXMucHJvbWlzZVtQUk9NSVNFX0lEXSkge1xuICAgIG1ha2VQcm9taXNlKHRoaXMucHJvbWlzZSk7XG4gIH1cblxuICBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuX3JlbWFpbmluZyA9IGlucHV0Lmxlbmd0aDtcblxuICAgIHRoaXMuX3Jlc3VsdCA9IG5ldyBBcnJheSh0aGlzLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICB0aGlzLl9lbnVtZXJhdGUoKTtcbiAgICAgIGlmICh0aGlzLl9yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgZnVsZmlsbCh0aGlzLnByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIF9yZWplY3QodGhpcy5wcm9taXNlLCB2YWxpZGF0aW9uRXJyb3IoKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGlvbkVycm9yKCkge1xuICByZXR1cm4gbmV3IEVycm9yKCdBcnJheSBNZXRob2RzIG11c3QgYmUgcHJvdmlkZWQgYW4gQXJyYXknKTtcbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lbnVtZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgdmFyIF9pbnB1dCA9IHRoaXMuX2lucHV0O1xuXG4gIGZvciAodmFyIGkgPSAwOyB0aGlzLl9zdGF0ZSA9PT0gUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lYWNoRW50cnkoX2lucHV0W2ldLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uIChlbnRyeSwgaSkge1xuICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gIHZhciByZXNvbHZlJCQgPSBjLnJlc29sdmU7XG5cbiAgaWYgKHJlc29sdmUkJCA9PT0gcmVzb2x2ZSkge1xuICAgIHZhciBfdGhlbiA9IGdldFRoZW4oZW50cnkpO1xuXG4gICAgaWYgKF90aGVuID09PSB0aGVuICYmIGVudHJ5Ll9zdGF0ZSAhPT0gUEVORElORykge1xuICAgICAgdGhpcy5fc2V0dGxlZEF0KGVudHJ5Ll9zdGF0ZSwgaSwgZW50cnkuX3Jlc3VsdCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX3RoZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gZW50cnk7XG4gICAgfSBlbHNlIGlmIChjID09PSBQcm9taXNlKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBjKG5vb3ApO1xuICAgICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBlbnRyeSwgX3RoZW4pO1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KHByb21pc2UsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93aWxsU2V0dGxlQXQobmV3IGMoZnVuY3Rpb24gKHJlc29sdmUkJCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSQkKGVudHJ5KTtcbiAgICAgIH0pLCBpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fd2lsbFNldHRsZUF0KHJlc29sdmUkJChlbnRyeSksIGkpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fc2V0dGxlZEF0ID0gZnVuY3Rpb24gKHN0YXRlLCBpLCB2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXMucHJvbWlzZTtcblxuICBpZiAocHJvbWlzZS5fc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICB0aGlzLl9yZW1haW5pbmctLTtcblxuICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZXN1bHRbaV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgZnVsZmlsbChwcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICB9XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fd2lsbFNldHRsZUF0ID0gZnVuY3Rpb24gKHByb21pc2UsIGkpIHtcbiAgdmFyIGVudW1lcmF0b3IgPSB0aGlzO1xuXG4gIHN1YnNjcmliZShwcm9taXNlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoRlVMRklMTEVELCBpLCB2YWx1ZSk7XG4gIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KFJFSkVDVEVELCBpLCByZWFzb24pO1xuICB9KTtcbn07XG5cbi8qKlxuICBgUHJvbWlzZS5hbGxgIGFjY2VwdHMgYW4gYXJyYXkgb2YgcHJvbWlzZXMsIGFuZCByZXR1cm5zIGEgbmV3IHByb21pc2Ugd2hpY2hcbiAgaXMgZnVsZmlsbGVkIHdpdGggYW4gYXJyYXkgb2YgZnVsZmlsbG1lbnQgdmFsdWVzIGZvciB0aGUgcGFzc2VkIHByb21pc2VzLCBvclxuICByZWplY3RlZCB3aXRoIHRoZSByZWFzb24gb2YgdGhlIGZpcnN0IHBhc3NlZCBwcm9taXNlIHRvIGJlIHJlamVjdGVkLiBJdCBjYXN0cyBhbGxcbiAgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBpdGVyYWJsZSB0byBwcm9taXNlcyBhcyBpdCBydW5zIHRoaXMgYWxnb3JpdGhtLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZXNvbHZlKDIpO1xuICBsZXQgcHJvbWlzZTMgPSByZXNvbHZlKDMpO1xuICBsZXQgcHJvbWlzZXMgPSBbIHByb21pc2UxLCBwcm9taXNlMiwgcHJvbWlzZTMgXTtcblxuICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihhcnJheSl7XG4gICAgLy8gVGhlIGFycmF5IGhlcmUgd291bGQgYmUgWyAxLCAyLCAzIF07XG4gIH0pO1xuICBgYGBcblxuICBJZiBhbnkgb2YgdGhlIGBwcm9taXNlc2AgZ2l2ZW4gdG8gYGFsbGAgYXJlIHJlamVjdGVkLCB0aGUgZmlyc3QgcHJvbWlzZVxuICB0aGF0IGlzIHJlamVjdGVkIHdpbGwgYmUgZ2l2ZW4gYXMgYW4gYXJndW1lbnQgdG8gdGhlIHJldHVybmVkIHByb21pc2VzJ3NcbiAgcmVqZWN0aW9uIGhhbmRsZXIuIEZvciBleGFtcGxlOlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSByZXNvbHZlKDEpO1xuICBsZXQgcHJvbWlzZTIgPSByZWplY3QobmV3IEVycm9yKFwiMlwiKSk7XG4gIGxldCBwcm9taXNlMyA9IHJlamVjdChuZXcgRXJyb3IoXCIzXCIpKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIENvZGUgaGVyZSBuZXZlciBydW5zIGJlY2F1c2UgdGhlcmUgYXJlIHJlamVjdGVkIHByb21pc2VzIVxuICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgIC8vIGVycm9yLm1lc3NhZ2UgPT09IFwiMlwiXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIGFsbFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QXJyYXl9IGVudHJpZXMgYXJyYXkgb2YgcHJvbWlzZXNcbiAgQHBhcmFtIHtTdHJpbmd9IGxhYmVsIG9wdGlvbmFsIHN0cmluZyBmb3IgbGFiZWxpbmcgdGhlIHByb21pc2UuXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gcHJvbWlzZSB0aGF0IGlzIGZ1bGZpbGxlZCB3aGVuIGFsbCBgcHJvbWlzZXNgIGhhdmUgYmVlblxuICBmdWxmaWxsZWQsIG9yIHJlamVjdGVkIGlmIGFueSBvZiB0aGVtIGJlY29tZSByZWplY3RlZC5cbiAgQHN0YXRpY1xuKi9cbmZ1bmN0aW9uIGFsbChlbnRyaWVzKSB7XG4gIHJldHVybiBuZXcgRW51bWVyYXRvcih0aGlzLCBlbnRyaWVzKS5wcm9taXNlO1xufVxuXG4vKipcbiAgYFByb21pc2UucmFjZWAgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoIGlzIHNldHRsZWQgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZVxuICBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBzZXR0bGUuXG5cbiAgRXhhbXBsZTpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDInKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyByZXN1bHQgPT09ICdwcm9taXNlIDInIGJlY2F1c2UgaXQgd2FzIHJlc29sdmVkIGJlZm9yZSBwcm9taXNlMVxuICAgIC8vIHdhcyByZXNvbHZlZC5cbiAgfSk7XG4gIGBgYFxuXG4gIGBQcm9taXNlLnJhY2VgIGlzIGRldGVybWluaXN0aWMgaW4gdGhhdCBvbmx5IHRoZSBzdGF0ZSBvZiB0aGUgZmlyc3RcbiAgc2V0dGxlZCBwcm9taXNlIG1hdHRlcnMuIEZvciBleGFtcGxlLCBldmVuIGlmIG90aGVyIHByb21pc2VzIGdpdmVuIHRvIHRoZVxuICBgcHJvbWlzZXNgIGFycmF5IGFyZ3VtZW50IGFyZSByZXNvbHZlZCwgYnV0IHRoZSBmaXJzdCBzZXR0bGVkIHByb21pc2UgaGFzXG4gIGJlY29tZSByZWplY3RlZCBiZWZvcmUgdGhlIG90aGVyIHByb21pc2VzIGJlY2FtZSBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICBwcm9taXNlIHdpbGwgYmVjb21lIHJlamVjdGVkOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXNvbHZlKCdwcm9taXNlIDEnKTtcbiAgICB9LCAyMDApO1xuICB9KTtcblxuICBsZXQgcHJvbWlzZTIgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoJ3Byb21pc2UgMicpKTtcbiAgICB9LCAxMDApO1xuICB9KTtcblxuICBQcm9taXNlLnJhY2UoW3Byb21pc2UxLCBwcm9taXNlMl0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVuc1xuICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgIC8vIHJlYXNvbi5tZXNzYWdlID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIHByb21pc2UgMiBiZWNhbWUgcmVqZWN0ZWQgYmVmb3JlXG4gICAgLy8gcHJvbWlzZSAxIGJlY2FtZSBmdWxmaWxsZWRcbiAgfSk7XG4gIGBgYFxuXG4gIEFuIGV4YW1wbGUgcmVhbC13b3JsZCB1c2UgY2FzZSBpcyBpbXBsZW1lbnRpbmcgdGltZW91dHM6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBQcm9taXNlLnJhY2UoW2FqYXgoJ2Zvby5qc29uJyksIHRpbWVvdXQoNTAwMCldKVxuICBgYGBcblxuICBAbWV0aG9kIHJhY2VcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBwcm9taXNlcyBhcnJheSBvZiBwcm9taXNlcyB0byBvYnNlcnZlXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHdoaWNoIHNldHRsZXMgaW4gdGhlIHNhbWUgd2F5IGFzIHRoZSBmaXJzdCBwYXNzZWRcbiAgcHJvbWlzZSB0byBzZXR0bGUuXG4qL1xuZnVuY3Rpb24gcmFjZShlbnRyaWVzKSB7XG4gIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgaWYgKCFpc0FycmF5KGVudHJpZXMpKSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAoXywgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYW4gYXJyYXkgdG8gcmFjZS4nKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgbGVuZ3RoID0gZW50cmllcy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLnJlc29sdmUoZW50cmllc1tpXSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICBgUHJvbWlzZS5yZWplY3RgIHJldHVybnMgYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIHBhc3NlZCBgcmVhc29uYC5cbiAgSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlamVjdChuZXcgRXJyb3IoJ1dIT09QUycpKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAvLyBDb2RlIGhlcmUgZG9lc24ndCBydW4gYmVjYXVzZSB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCFcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ1dIT09QUydcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVqZWN0XG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBbnl9IHJlYXNvbiB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aC5cbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgcmVqZWN0ZWQgd2l0aCB0aGUgZ2l2ZW4gYHJlYXNvbmAuXG4qL1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3Rvcihub29wKTtcbiAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gbmVlZHNSZXNvbHZlcigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignWW91IG11c3QgcGFzcyBhIHJlc29sdmVyIGZ1bmN0aW9uIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgcHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xufVxuXG5mdW5jdGlvbiBuZWVkc05ldygpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkZhaWxlZCB0byBjb25zdHJ1Y3QgJ1Byb21pc2UnOiBQbGVhc2UgdXNlIHRoZSAnbmV3JyBvcGVyYXRvciwgdGhpcyBvYmplY3QgY29uc3RydWN0b3IgY2Fubm90IGJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLlwiKTtcbn1cblxuLyoqXG4gIFByb21pc2Ugb2JqZWN0cyByZXByZXNlbnQgdGhlIGV2ZW50dWFsIHJlc3VsdCBvZiBhbiBhc3luY2hyb25vdXMgb3BlcmF0aW9uLiBUaGVcbiAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuXG4gIFRlcm1pbm9sb2d5XG4gIC0tLS0tLS0tLS0tXG5cbiAgLSBgcHJvbWlzZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHdpdGggYSBgdGhlbmAgbWV0aG9kIHdob3NlIGJlaGF2aW9yIGNvbmZvcm1zIHRvIHRoaXMgc3BlY2lmaWNhdGlvbi5cbiAgLSBgdGhlbmFibGVgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgYSBgdGhlbmAgbWV0aG9kLlxuICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gIC0gYGV4Y2VwdGlvbmAgaXMgYSB2YWx1ZSB0aGF0IGlzIHRocm93biB1c2luZyB0aGUgdGhyb3cgc3RhdGVtZW50LlxuICAtIGByZWFzb25gIGlzIGEgdmFsdWUgdGhhdCBpbmRpY2F0ZXMgd2h5IGEgcHJvbWlzZSB3YXMgcmVqZWN0ZWQuXG4gIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gIEEgcHJvbWlzZSBjYW4gYmUgaW4gb25lIG9mIHRocmVlIHN0YXRlczogcGVuZGluZywgZnVsZmlsbGVkLCBvciByZWplY3RlZC5cblxuICBQcm9taXNlcyB0aGF0IGFyZSBmdWxmaWxsZWQgaGF2ZSBhIGZ1bGZpbGxtZW50IHZhbHVlIGFuZCBhcmUgaW4gdGhlIGZ1bGZpbGxlZFxuICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gIHJlamVjdGVkIHN0YXRlLiAgQSBmdWxmaWxsbWVudCB2YWx1ZSBpcyBuZXZlciBhIHRoZW5hYmxlLlxuXG4gIFByb21pc2VzIGNhbiBhbHNvIGJlIHNhaWQgdG8gKnJlc29sdmUqIGEgdmFsdWUuICBJZiB0aGlzIHZhbHVlIGlzIGFsc28gYVxuICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gIHNldHRsZWQgc3RhdGUuICBTbyBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IHJlamVjdHMgd2lsbFxuICBpdHNlbGYgcmVqZWN0LCBhbmQgYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCBmdWxmaWxscyB3aWxsXG4gIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgQmFzaWMgVXNhZ2U6XG4gIC0tLS0tLS0tLS0tLVxuXG4gIGBgYGpzXG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gb24gc3VjY2Vzc1xuICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgLy8gb24gZmFpbHVyZVxuICAgIHJlamVjdChyZWFzb24pO1xuICB9KTtcblxuICBwcm9taXNlLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIEFkdmFuY2VkIFVzYWdlOlxuICAtLS0tLS0tLS0tLS0tLS1cblxuICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gIGBYTUxIdHRwUmVxdWVzdGBzLlxuXG4gIGBgYGpzXG4gIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGhhbmRsZXI7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2pzb24nO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignZ2V0SlNPTjogYCcgKyB1cmwgKyAnYCBmYWlsZWQgd2l0aCBzdGF0dXM6IFsnICsgdGhpcy5zdGF0dXMgKyAnXScpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBnZXRKU09OKCcvcG9zdHMuanNvbicpLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIC8vIG9uIHJlamVjdGlvblxuICB9KTtcbiAgYGBgXG5cbiAgVW5saWtlIGNhbGxiYWNrcywgcHJvbWlzZXMgYXJlIGdyZWF0IGNvbXBvc2FibGUgcHJpbWl0aXZlcy5cblxuICBgYGBqc1xuICBQcm9taXNlLmFsbChbXG4gICAgZ2V0SlNPTignL3Bvc3RzJyksXG4gICAgZ2V0SlNPTignL2NvbW1lbnRzJylcbiAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgIHZhbHVlc1swXSAvLyA9PiBwb3N0c0pTT05cbiAgICB2YWx1ZXNbMV0gLy8gPT4gY29tbWVudHNKU09OXG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9KTtcbiAgYGBgXG5cbiAgQGNsYXNzIFByb21pc2VcbiAgQHBhcmFtIHtmdW5jdGlvbn0gcmVzb2x2ZXJcbiAgVXNlZnVsIGZvciB0b29saW5nLlxuICBAY29uc3RydWN0b3JcbiovXG5mdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gIHRoaXNbUFJPTUlTRV9JRF0gPSBuZXh0SWQoKTtcbiAgdGhpcy5fcmVzdWx0ID0gdGhpcy5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHRoaXMuX3N1YnNjcmliZXJzID0gW107XG5cbiAgaWYgKG5vb3AgIT09IHJlc29sdmVyKSB7XG4gICAgdHlwZW9mIHJlc29sdmVyICE9PSAnZnVuY3Rpb24nICYmIG5lZWRzUmVzb2x2ZXIoKTtcbiAgICB0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSA/IGluaXRpYWxpemVQcm9taXNlKHRoaXMsIHJlc29sdmVyKSA6IG5lZWRzTmV3KCk7XG4gIH1cbn1cblxuUHJvbWlzZS5hbGwgPSBhbGw7XG5Qcm9taXNlLnJhY2UgPSByYWNlO1xuUHJvbWlzZS5yZXNvbHZlID0gcmVzb2x2ZTtcblByb21pc2UucmVqZWN0ID0gcmVqZWN0O1xuUHJvbWlzZS5fc2V0U2NoZWR1bGVyID0gc2V0U2NoZWR1bGVyO1xuUHJvbWlzZS5fc2V0QXNhcCA9IHNldEFzYXA7XG5Qcm9taXNlLl9hc2FwID0gYXNhcDtcblxuUHJvbWlzZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBQcm9taXNlLFxuXG4gIC8qKlxuICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgIHdoaWNoIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlXG4gICAgcmVhc29uIHdoeSB0aGUgcHJvbWlzZSBjYW5ub3QgYmUgZnVsZmlsbGVkLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgIC8vIHVzZXIgaXMgYXZhaWxhYmxlXG4gICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIENoYWluaW5nXG4gICAgLS0tLS0tLS1cbiAgXG4gICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZmlyc3QgcHJvbWlzZSdzIGZ1bGZpbGxtZW50XG4gICAgb3IgcmVqZWN0aW9uIGhhbmRsZXIsIG9yIHJlamVjdGVkIGlmIHRoZSBoYW5kbGVyIHRocm93cyBhbiBleGNlcHRpb24uXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlci5uYW1lO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh1c2VyTmFtZSkge1xuICAgICAgLy8gSWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGB1c2VyTmFtZWAgd2lsbCBiZSB0aGUgdXNlcidzIG5hbWUsIG90aGVyd2lzZSBpdFxuICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgfSk7XG4gIFxuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScpO1xuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYGZpbmRVc2VyYCByZWplY3RlZCBhbmQgd2UncmUgdW5oYXBweScpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gaWYgYGZpbmRVc2VyYCBmdWxmaWxsZWQsIGByZWFzb25gIHdpbGwgYmUgJ0ZvdW5kIHVzZXIsIGJ1dCBzdGlsbCB1bmhhcHB5Jy5cbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgIH0pO1xuICAgIGBgYFxuICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IFBlZGFnb2dpY2FsRXhjZXB0aW9uKCdVcHN0cmVhbSBlcnJvcicpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBUaGUgYFBlZGdhZ29jaWFsRXhjZXB0aW9uYCBpcyBwcm9wYWdhdGVkIGFsbCB0aGUgd2F5IGRvd24gdG8gaGVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBc3NpbWlsYXRpb25cbiAgICAtLS0tLS0tLS0tLS1cbiAgXG4gICAgU29tZXRpbWVzIHRoZSB2YWx1ZSB5b3Ugd2FudCB0byBwcm9wYWdhdGUgdG8gYSBkb3duc3RyZWFtIHByb21pc2UgY2FuIG9ubHkgYmVcbiAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgZnVsZmlsbG1lbnQgb3IgcmVqZWN0aW9uIGhhbmRsZXIuIFRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCB0aGVuIGJlIHBlbmRpbmdcbiAgICB1bnRpbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpcyBzZXR0bGVkLiBUaGlzIGlzIGNhbGxlZCAqYXNzaW1pbGF0aW9uKi5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBJZiB0aGUgYXNzaW1saWF0ZWQgcHJvbWlzZSByZWplY3RzLCB0aGVuIHRoZSBkb3duc3RyZWFtIHByb21pc2Ugd2lsbCBhbHNvIHJlamVjdC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHJldHVybiBmaW5kQ29tbWVudHNCeUF1dGhvcih1c2VyKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChjb21tZW50cykge1xuICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgcmVqZWN0cywgd2UnbGwgaGF2ZSB0aGUgcmVhc29uIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgU2ltcGxlIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgcmVzdWx0O1xuICBcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gZmluZFJlc3VsdCgpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgICBmaW5kUmVzdWx0KGZ1bmN0aW9uKHJlc3VsdCwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEFkdmFuY2VkIEV4YW1wbGVcbiAgICAtLS0tLS0tLS0tLS0tLVxuICBcbiAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBsZXQgYXV0aG9yLCBib29rcztcbiAgXG4gICAgdHJ5IHtcbiAgICAgIGF1dGhvciA9IGZpbmRBdXRob3IoKTtcbiAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAvLyBzdWNjZXNzXG4gICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgIC8vIGZhaWx1cmVcbiAgICB9XG4gICAgYGBgXG4gIFxuICAgIEVycmJhY2sgRXhhbXBsZVxuICBcbiAgICBgYGBqc1xuICBcbiAgICBmdW5jdGlvbiBmb3VuZEJvb2tzKGJvb2tzKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gZmFpbHVyZShyZWFzb24pIHtcbiAgXG4gICAgfVxuICBcbiAgICBmaW5kQXV0aG9yKGZ1bmN0aW9uKGF1dGhvciwgZXJyKXtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZpbmRCb29va3NCeUF1dGhvcihhdXRob3IsIGZ1bmN0aW9uKGJvb2tzLCBlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgZmFpbHVyZShlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3VuZEJvb2tzKGJvb2tzKTtcbiAgICAgICAgICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9XG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFByb21pc2UgRXhhbXBsZTtcbiAgXG4gICAgYGBgamF2YXNjcmlwdFxuICAgIGZpbmRBdXRob3IoKS5cbiAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgdGhlbihmdW5jdGlvbihib29rcyl7XG4gICAgICAgIC8vIGZvdW5kIGJvb2tzXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgdGhlblxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uRnVsZmlsbGVkXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gb25SZWplY3RlZFxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICB0aGVuOiB0aGVuLFxuXG4gIC8qKlxuICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICBhcyB0aGUgY2F0Y2ggYmxvY2sgb2YgYSB0cnkvY2F0Y2ggc3RhdGVtZW50LlxuICBcbiAgICBgYGBqc1xuICAgIGZ1bmN0aW9uIGZpbmRBdXRob3IoKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgIH1cbiAgXG4gICAgLy8gc3luY2hyb25vdXNcbiAgICB0cnkge1xuICAgICAgZmluZEF1dGhvcigpO1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH1cbiAgXG4gICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgIGZpbmRBdXRob3IoKS5jYXRjaChmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQG1ldGhvZCBjYXRjaFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0aW9uXG4gICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICovXG4gICdjYXRjaCc6IGZ1bmN0aW9uIF9jYXRjaChvblJlamVjdGlvbikge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3Rpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgICB2YXIgbG9jYWwgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBnbG9iYWw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsb2NhbCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seWZpbGwgZmFpbGVkIGJlY2F1c2UgZ2xvYmFsIG9iamVjdCBpcyB1bmF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgUCA9IGxvY2FsLlByb21pc2U7XG5cbiAgICBpZiAoUCkge1xuICAgICAgICB2YXIgcHJvbWlzZVRvU3RyaW5nID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChQLnJlc29sdmUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIHNpbGVudGx5IGlnbm9yZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlVG9TdHJpbmcgPT09ICdbb2JqZWN0IFByb21pc2VdJyAmJiAhUC5jYXN0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbC5Qcm9taXNlID0gUHJvbWlzZTtcbn1cblxuLy8gU3RyYW5nZSBjb21wYXQuLlxuUHJvbWlzZS5wb2x5ZmlsbCA9IHBvbHlmaWxsO1xuUHJvbWlzZS5Qcm9taXNlID0gUHJvbWlzZTtcblxucmV0dXJuIFByb21pc2U7XG5cbn0pKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lczYtcHJvbWlzZS5tYXAiLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBNdWx0aWJ5dGUgY29kZWMuIEluIHRoaXMgc2NoZW1lLCBhIGNoYXJhY3RlciBpcyByZXByZXNlbnRlZCBieSAxIG9yIG1vcmUgYnl0ZXMuXG4vLyBPdXIgY29kZWMgc3VwcG9ydHMgVVRGLTE2IHN1cnJvZ2F0ZXMsIGV4dGVuc2lvbnMgZm9yIEdCMTgwMzAgYW5kIHVuaWNvZGUgc2VxdWVuY2VzLlxuLy8gVG8gc2F2ZSBtZW1vcnkgYW5kIGxvYWRpbmcgdGltZSwgd2UgcmVhZCB0YWJsZSBmaWxlcyBvbmx5IHdoZW4gcmVxdWVzdGVkLlxuXG5leHBvcnRzLl9kYmNzID0gREJDU0NvZGVjO1xuXG52YXIgVU5BU1NJR05FRCA9IC0xLFxuICAgIEdCMTgwMzBfQ09ERSA9IC0yLFxuICAgIFNFUV9TVEFSVCAgPSAtMTAsXG4gICAgTk9ERV9TVEFSVCA9IC0xMDAwLFxuICAgIFVOQVNTSUdORURfTk9ERSA9IG5ldyBBcnJheSgweDEwMCksXG4gICAgREVGX0NIQVIgPSAtMTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCAweDEwMDsgaSsrKVxuICAgIFVOQVNTSUdORURfTk9ERVtpXSA9IFVOQVNTSUdORUQ7XG5cblxuLy8gQ2xhc3MgREJDU0NvZGVjIHJlYWRzIGFuZCBpbml0aWFsaXplcyBtYXBwaW5nIHRhYmxlcy5cbmZ1bmN0aW9uIERCQ1NDb2RlYyhjb2RlY09wdGlvbnMsIGljb252KSB7XG4gICAgdGhpcy5lbmNvZGluZ05hbWUgPSBjb2RlY09wdGlvbnMuZW5jb2RpbmdOYW1lO1xuICAgIGlmICghY29kZWNPcHRpb25zKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEQkNTIGNvZGVjIGlzIGNhbGxlZCB3aXRob3V0IHRoZSBkYXRhLlwiKVxuICAgIGlmICghY29kZWNPcHRpb25zLnRhYmxlKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbmNvZGluZyAnXCIgKyB0aGlzLmVuY29kaW5nTmFtZSArIFwiJyBoYXMgbm8gZGF0YS5cIik7XG5cbiAgICAvLyBMb2FkIHRhYmxlcy5cbiAgICB2YXIgbWFwcGluZ1RhYmxlID0gY29kZWNPcHRpb25zLnRhYmxlKCk7XG5cblxuICAgIC8vIERlY29kZSB0YWJsZXM6IE1CQ1MgLT4gVW5pY29kZS5cblxuICAgIC8vIGRlY29kZVRhYmxlcyBpcyBhIHRyaWUsIGVuY29kZWQgYXMgYW4gYXJyYXkgb2YgYXJyYXlzIG9mIGludGVnZXJzLiBJbnRlcm5hbCBhcnJheXMgYXJlIHRyaWUgbm9kZXMgYW5kIGFsbCBoYXZlIGxlbiA9IDI1Ni5cbiAgICAvLyBUcmllIHJvb3QgaXMgZGVjb2RlVGFibGVzWzBdLlxuICAgIC8vIFZhbHVlczogPj0gIDAgLT4gdW5pY29kZSBjaGFyYWN0ZXIgY29kZS4gY2FuIGJlID4gMHhGRkZGXG4gICAgLy8gICAgICAgICA9PSBVTkFTU0lHTkVEIC0+IHVua25vd24vdW5hc3NpZ25lZCBzZXF1ZW5jZS5cbiAgICAvLyAgICAgICAgID09IEdCMTgwMzBfQ09ERSAtPiB0aGlzIGlzIHRoZSBlbmQgb2YgYSBHQjE4MDMwIDQtYnl0ZSBzZXF1ZW5jZS5cbiAgICAvLyAgICAgICAgIDw9IE5PREVfU1RBUlQgLT4gaW5kZXggb2YgdGhlIG5leHQgbm9kZSBpbiBvdXIgdHJpZSB0byBwcm9jZXNzIG5leHQgYnl0ZS5cbiAgICAvLyAgICAgICAgIDw9IFNFUV9TVEFSVCAgLT4gaW5kZXggb2YgdGhlIHN0YXJ0IG9mIGEgY2hhcmFjdGVyIGNvZGUgc2VxdWVuY2UsIGluIGRlY29kZVRhYmxlU2VxLlxuICAgIHRoaXMuZGVjb2RlVGFibGVzID0gW107XG4gICAgdGhpcy5kZWNvZGVUYWJsZXNbMF0gPSBVTkFTU0lHTkVEX05PREUuc2xpY2UoMCk7IC8vIENyZWF0ZSByb290IG5vZGUuXG5cbiAgICAvLyBTb21ldGltZXMgYSBNQkNTIGNoYXIgY29ycmVzcG9uZHMgdG8gYSBzZXF1ZW5jZSBvZiB1bmljb2RlIGNoYXJzLiBXZSBzdG9yZSB0aGVtIGFzIGFycmF5cyBvZiBpbnRlZ2VycyBoZXJlLiBcbiAgICB0aGlzLmRlY29kZVRhYmxlU2VxID0gW107XG5cbiAgICAvLyBBY3R1YWwgbWFwcGluZyB0YWJsZXMgY29uc2lzdCBvZiBjaHVua3MuIFVzZSB0aGVtIHRvIGZpbGwgdXAgZGVjb2RlIHRhYmxlcy5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcHBpbmdUYWJsZS5sZW5ndGg7IGkrKylcbiAgICAgICAgdGhpcy5fYWRkRGVjb2RlQ2h1bmsobWFwcGluZ1RhYmxlW2ldKTtcblxuICAgIHRoaXMuZGVmYXVsdENoYXJVbmljb2RlID0gaWNvbnYuZGVmYXVsdENoYXJVbmljb2RlO1xuXG4gICAgXG4gICAgLy8gRW5jb2RlIHRhYmxlczogVW5pY29kZSAtPiBEQkNTLlxuXG4gICAgLy8gYGVuY29kZVRhYmxlYCBpcyBhcnJheSBtYXBwaW5nIGZyb20gdW5pY29kZSBjaGFyIHRvIGVuY29kZWQgY2hhci4gQWxsIGl0cyB2YWx1ZXMgYXJlIGludGVnZXJzIGZvciBwZXJmb3JtYW5jZS5cbiAgICAvLyBCZWNhdXNlIGl0IGNhbiBiZSBzcGFyc2UsIGl0IGlzIHJlcHJlc2VudGVkIGFzIGFycmF5IG9mIGJ1Y2tldHMgYnkgMjU2IGNoYXJzIGVhY2guIEJ1Y2tldCBjYW4gYmUgbnVsbC5cbiAgICAvLyBWYWx1ZXM6ID49ICAwIC0+IGl0IGlzIGEgbm9ybWFsIGNoYXIuIFdyaXRlIHRoZSB2YWx1ZSAoaWYgPD0yNTYgdGhlbiAxIGJ5dGUsIGlmIDw9NjU1MzYgdGhlbiAyIGJ5dGVzLCBldGMuKS5cbiAgICAvLyAgICAgICAgID09IFVOQVNTSUdORUQgLT4gbm8gY29udmVyc2lvbiBmb3VuZC4gT3V0cHV0IGEgZGVmYXVsdCBjaGFyLlxuICAgIC8vICAgICAgICAgPD0gU0VRX1NUQVJUICAtPiBpdCdzIGFuIGluZGV4IGluIGVuY29kZVRhYmxlU2VxLCBzZWUgYmVsb3cuIFRoZSBjaGFyYWN0ZXIgc3RhcnRzIGEgc2VxdWVuY2UuXG4gICAgdGhpcy5lbmNvZGVUYWJsZSA9IFtdO1xuICAgIFxuICAgIC8vIGBlbmNvZGVUYWJsZVNlcWAgaXMgdXNlZCB3aGVuIGEgc2VxdWVuY2Ugb2YgdW5pY29kZSBjaGFyYWN0ZXJzIGlzIGVuY29kZWQgYXMgYSBzaW5nbGUgY29kZS4gV2UgdXNlIGEgdHJlZSBvZlxuICAgIC8vIG9iamVjdHMgd2hlcmUga2V5cyBjb3JyZXNwb25kIHRvIGNoYXJhY3RlcnMgaW4gc2VxdWVuY2UgYW5kIGxlYWZzIGFyZSB0aGUgZW5jb2RlZCBkYmNzIHZhbHVlcy4gQSBzcGVjaWFsIERFRl9DSEFSIGtleVxuICAgIC8vIG1lYW5zIGVuZCBvZiBzZXF1ZW5jZSAobmVlZGVkIHdoZW4gb25lIHNlcXVlbmNlIGlzIGEgc3RyaWN0IHN1YnNlcXVlbmNlIG9mIGFub3RoZXIpLlxuICAgIC8vIE9iamVjdHMgYXJlIGtlcHQgc2VwYXJhdGVseSBmcm9tIGVuY29kZVRhYmxlIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlLlxuICAgIHRoaXMuZW5jb2RlVGFibGVTZXEgPSBbXTtcblxuICAgIC8vIFNvbWUgY2hhcnMgY2FuIGJlIGRlY29kZWQsIGJ1dCBuZWVkIG5vdCBiZSBlbmNvZGVkLlxuICAgIHZhciBza2lwRW5jb2RlQ2hhcnMgPSB7fTtcbiAgICBpZiAoY29kZWNPcHRpb25zLmVuY29kZVNraXBWYWxzKVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvZGVjT3B0aW9ucy5lbmNvZGVTa2lwVmFscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbCA9IGNvZGVjT3B0aW9ucy5lbmNvZGVTa2lwVmFsc1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICBza2lwRW5jb2RlQ2hhcnNbdmFsXSA9IHRydWU7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IHZhbC5mcm9tOyBqIDw9IHZhbC50bzsgaisrKVxuICAgICAgICAgICAgICAgICAgICBza2lwRW5jb2RlQ2hhcnNbal0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIC8vIFVzZSBkZWNvZGUgdHJpZSB0byByZWN1cnNpdmVseSBmaWxsIG91dCBlbmNvZGUgdGFibGVzLlxuICAgIHRoaXMuX2ZpbGxFbmNvZGVUYWJsZSgwLCAwLCBza2lwRW5jb2RlQ2hhcnMpO1xuXG4gICAgLy8gQWRkIG1vcmUgZW5jb2RpbmcgcGFpcnMgd2hlbiBuZWVkZWQuXG4gICAgaWYgKGNvZGVjT3B0aW9ucy5lbmNvZGVBZGQpIHtcbiAgICAgICAgZm9yICh2YXIgdUNoYXIgaW4gY29kZWNPcHRpb25zLmVuY29kZUFkZClcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29kZWNPcHRpb25zLmVuY29kZUFkZCwgdUNoYXIpKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NldEVuY29kZUNoYXIodUNoYXIuY2hhckNvZGVBdCgwKSwgY29kZWNPcHRpb25zLmVuY29kZUFkZFt1Q2hhcl0pO1xuICAgIH1cblxuICAgIHRoaXMuZGVmQ2hhclNCICA9IHRoaXMuZW5jb2RlVGFibGVbMF1baWNvbnYuZGVmYXVsdENoYXJTaW5nbGVCeXRlLmNoYXJDb2RlQXQoMCldO1xuICAgIGlmICh0aGlzLmRlZkNoYXJTQiA9PT0gVU5BU1NJR05FRCkgdGhpcy5kZWZDaGFyU0IgPSB0aGlzLmVuY29kZVRhYmxlWzBdWyc/J107XG4gICAgaWYgKHRoaXMuZGVmQ2hhclNCID09PSBVTkFTU0lHTkVEKSB0aGlzLmRlZkNoYXJTQiA9IFwiP1wiLmNoYXJDb2RlQXQoMCk7XG5cblxuICAgIC8vIExvYWQgJiBjcmVhdGUgR0IxODAzMCB0YWJsZXMgd2hlbiBuZWVkZWQuXG4gICAgaWYgKHR5cGVvZiBjb2RlY09wdGlvbnMuZ2IxODAzMCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmdiMTgwMzAgPSBjb2RlY09wdGlvbnMuZ2IxODAzMCgpOyAvLyBMb2FkIEdCMTgwMzAgcmFuZ2VzLlxuXG4gICAgICAgIC8vIEFkZCBHQjE4MDMwIGRlY29kZSB0YWJsZXMuXG4gICAgICAgIHZhciB0aGlyZEJ5dGVOb2RlSWR4ID0gdGhpcy5kZWNvZGVUYWJsZXMubGVuZ3RoO1xuICAgICAgICB2YXIgdGhpcmRCeXRlTm9kZSA9IHRoaXMuZGVjb2RlVGFibGVzW3RoaXJkQnl0ZU5vZGVJZHhdID0gVU5BU1NJR05FRF9OT0RFLnNsaWNlKDApO1xuXG4gICAgICAgIHZhciBmb3VydGhCeXRlTm9kZUlkeCA9IHRoaXMuZGVjb2RlVGFibGVzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZvdXJ0aEJ5dGVOb2RlID0gdGhpcy5kZWNvZGVUYWJsZXNbZm91cnRoQnl0ZU5vZGVJZHhdID0gVU5BU1NJR05FRF9OT0RFLnNsaWNlKDApO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAweDgxOyBpIDw9IDB4RkU7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNlY29uZEJ5dGVOb2RlSWR4ID0gTk9ERV9TVEFSVCAtIHRoaXMuZGVjb2RlVGFibGVzWzBdW2ldO1xuICAgICAgICAgICAgdmFyIHNlY29uZEJ5dGVOb2RlID0gdGhpcy5kZWNvZGVUYWJsZXNbc2Vjb25kQnl0ZU5vZGVJZHhdO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDB4MzA7IGogPD0gMHgzOTsgaisrKVxuICAgICAgICAgICAgICAgIHNlY29uZEJ5dGVOb2RlW2pdID0gTk9ERV9TVEFSVCAtIHRoaXJkQnl0ZU5vZGVJZHg7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDB4ODE7IGkgPD0gMHhGRTsgaSsrKVxuICAgICAgICAgICAgdGhpcmRCeXRlTm9kZVtpXSA9IE5PREVfU1RBUlQgLSBmb3VydGhCeXRlTm9kZUlkeDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDB4MzA7IGkgPD0gMHgzOTsgaSsrKVxuICAgICAgICAgICAgZm91cnRoQnl0ZU5vZGVbaV0gPSBHQjE4MDMwX0NPREVcbiAgICB9ICAgICAgICBcbn1cblxuREJDU0NvZGVjLnByb3RvdHlwZS5lbmNvZGVyID0gREJDU0VuY29kZXI7XG5EQkNTQ29kZWMucHJvdG90eXBlLmRlY29kZXIgPSBEQkNTRGVjb2RlcjtcblxuLy8gRGVjb2RlciBoZWxwZXJzXG5EQkNTQ29kZWMucHJvdG90eXBlLl9nZXREZWNvZGVUcmllTm9kZSA9IGZ1bmN0aW9uKGFkZHIpIHtcbiAgICB2YXIgYnl0ZXMgPSBbXTtcbiAgICBmb3IgKDsgYWRkciA+IDA7IGFkZHIgPj49IDgpXG4gICAgICAgIGJ5dGVzLnB1c2goYWRkciAmIDB4RkYpO1xuICAgIGlmIChieXRlcy5sZW5ndGggPT0gMClcbiAgICAgICAgYnl0ZXMucHVzaCgwKTtcblxuICAgIHZhciBub2RlID0gdGhpcy5kZWNvZGVUYWJsZXNbMF07XG4gICAgZm9yICh2YXIgaSA9IGJ5dGVzLmxlbmd0aC0xOyBpID4gMDsgaS0tKSB7IC8vIFRyYXZlcnNlIG5vZGVzIGRlZXBlciBpbnRvIHRoZSB0cmllLlxuICAgICAgICB2YXIgdmFsID0gbm9kZVtieXRlc1tpXV07XG5cbiAgICAgICAgaWYgKHZhbCA9PSBVTkFTU0lHTkVEKSB7IC8vIENyZWF0ZSBuZXcgbm9kZS5cbiAgICAgICAgICAgIG5vZGVbYnl0ZXNbaV1dID0gTk9ERV9TVEFSVCAtIHRoaXMuZGVjb2RlVGFibGVzLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuZGVjb2RlVGFibGVzLnB1c2gobm9kZSA9IFVOQVNTSUdORURfTk9ERS5zbGljZSgwKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsIDw9IE5PREVfU1RBUlQpIHsgLy8gRXhpc3Rpbmcgbm9kZS5cbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLmRlY29kZVRhYmxlc1tOT0RFX1NUQVJUIC0gdmFsXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVyd3JpdGUgYnl0ZSBpbiBcIiArIHRoaXMuZW5jb2RpbmdOYW1lICsgXCIsIGFkZHI6IFwiICsgYWRkci50b1N0cmluZygxNikpO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuXG5EQkNTQ29kZWMucHJvdG90eXBlLl9hZGREZWNvZGVDaHVuayA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgLy8gRmlyc3QgZWxlbWVudCBvZiBjaHVuayBpcyB0aGUgaGV4IG1iY3MgY29kZSB3aGVyZSB3ZSBzdGFydC5cbiAgICB2YXIgY3VyQWRkciA9IHBhcnNlSW50KGNodW5rWzBdLCAxNik7XG5cbiAgICAvLyBDaG9vc2UgdGhlIGRlY29kaW5nIG5vZGUgd2hlcmUgd2UnbGwgd3JpdGUgb3VyIGNoYXJzLlxuICAgIHZhciB3cml0ZVRhYmxlID0gdGhpcy5fZ2V0RGVjb2RlVHJpZU5vZGUoY3VyQWRkcik7XG4gICAgY3VyQWRkciA9IGN1ckFkZHIgJiAweEZGO1xuXG4gICAgLy8gV3JpdGUgYWxsIG90aGVyIGVsZW1lbnRzIG9mIHRoZSBjaHVuayB0byB0aGUgdGFibGUuXG4gICAgZm9yICh2YXIgayA9IDE7IGsgPCBjaHVuay5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgcGFydCA9IGNodW5rW2tdO1xuICAgICAgICBpZiAodHlwZW9mIHBhcnQgPT09IFwic3RyaW5nXCIpIHsgLy8gU3RyaW5nLCB3cml0ZSBhcy1pcy5cbiAgICAgICAgICAgIGZvciAodmFyIGwgPSAwOyBsIDwgcGFydC5sZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBwYXJ0LmNoYXJDb2RlQXQobCsrKTtcbiAgICAgICAgICAgICAgICBpZiAoMHhEODAwIDw9IGNvZGUgJiYgY29kZSA8IDB4REMwMCkgeyAvLyBEZWNvZGUgc3Vycm9nYXRlXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlVHJhaWwgPSBwYXJ0LmNoYXJDb2RlQXQobCsrKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDB4REMwMCA8PSBjb2RlVHJhaWwgJiYgY29kZVRyYWlsIDwgMHhFMDAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGVUYWJsZVtjdXJBZGRyKytdID0gMHgxMDAwMCArIChjb2RlIC0gMHhEODAwKSAqIDB4NDAwICsgKGNvZGVUcmFpbCAtIDB4REMwMCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluY29ycmVjdCBzdXJyb2dhdGUgcGFpciBpbiBcIiAgKyB0aGlzLmVuY29kaW5nTmFtZSArIFwiIGF0IGNodW5rIFwiICsgY2h1bmtbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgweDBGRjAgPCBjb2RlICYmIGNvZGUgPD0gMHgwRkZGKSB7IC8vIENoYXJhY3RlciBzZXF1ZW5jZSAob3VyIG93biBlbmNvZGluZyB1c2VkKVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gMHhGRkYgLSBjb2RlICsgMjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlcSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IGxlbjsgbSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VxLnB1c2gocGFydC5jaGFyQ29kZUF0KGwrKykpOyAvLyBTaW1wbGUgdmFyaWF0aW9uOiBkb24ndCBzdXBwb3J0IHN1cnJvZ2F0ZXMgb3Igc3Vic2VxdWVuY2VzIGluIHNlcS5cblxuICAgICAgICAgICAgICAgICAgICB3cml0ZVRhYmxlW2N1ckFkZHIrK10gPSBTRVFfU1RBUlQgLSB0aGlzLmRlY29kZVRhYmxlU2VxLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNvZGVUYWJsZVNlcS5wdXNoKHNlcSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgd3JpdGVUYWJsZVtjdXJBZGRyKytdID0gY29kZTsgLy8gQmFzaWMgY2hhclxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcGFydCA9PT0gXCJudW1iZXJcIikgeyAvLyBJbnRlZ2VyLCBtZWFuaW5nIGluY3JlYXNpbmcgc2VxdWVuY2Ugc3RhcnRpbmcgd2l0aCBwcmV2IGNoYXJhY3Rlci5cbiAgICAgICAgICAgIHZhciBjaGFyQ29kZSA9IHdyaXRlVGFibGVbY3VyQWRkciAtIDFdICsgMTtcbiAgICAgICAgICAgIGZvciAodmFyIGwgPSAwOyBsIDwgcGFydDsgbCsrKVxuICAgICAgICAgICAgICAgIHdyaXRlVGFibGVbY3VyQWRkcisrXSA9IGNoYXJDb2RlKys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5jb3JyZWN0IHR5cGUgJ1wiICsgdHlwZW9mIHBhcnQgKyBcIicgZ2l2ZW4gaW4gXCIgICsgdGhpcy5lbmNvZGluZ05hbWUgKyBcIiBhdCBjaHVuayBcIiArIGNodW5rWzBdKTtcbiAgICB9XG4gICAgaWYgKGN1ckFkZHIgPiAweEZGKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmNvcnJlY3QgY2h1bmsgaW4gXCIgICsgdGhpcy5lbmNvZGluZ05hbWUgKyBcIiBhdCBhZGRyIFwiICsgY2h1bmtbMF0gKyBcIjogdG9vIGxvbmdcIiArIGN1ckFkZHIpO1xufVxuXG4vLyBFbmNvZGVyIGhlbHBlcnNcbkRCQ1NDb2RlYy5wcm90b3R5cGUuX2dldEVuY29kZUJ1Y2tldCA9IGZ1bmN0aW9uKHVDb2RlKSB7XG4gICAgdmFyIGhpZ2ggPSB1Q29kZSA+PiA4OyAvLyBUaGlzIGNvdWxkIGJlID4gMHhGRiBiZWNhdXNlIG9mIGFzdHJhbCBjaGFyYWN0ZXJzLlxuICAgIGlmICh0aGlzLmVuY29kZVRhYmxlW2hpZ2hdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuZW5jb2RlVGFibGVbaGlnaF0gPSBVTkFTU0lHTkVEX05PREUuc2xpY2UoMCk7IC8vIENyZWF0ZSBidWNrZXQgb24gZGVtYW5kLlxuICAgIHJldHVybiB0aGlzLmVuY29kZVRhYmxlW2hpZ2hdO1xufVxuXG5EQkNTQ29kZWMucHJvdG90eXBlLl9zZXRFbmNvZGVDaGFyID0gZnVuY3Rpb24odUNvZGUsIGRiY3NDb2RlKSB7XG4gICAgdmFyIGJ1Y2tldCA9IHRoaXMuX2dldEVuY29kZUJ1Y2tldCh1Q29kZSk7XG4gICAgdmFyIGxvdyA9IHVDb2RlICYgMHhGRjtcbiAgICBpZiAoYnVja2V0W2xvd10gPD0gU0VRX1NUQVJUKVxuICAgICAgICB0aGlzLmVuY29kZVRhYmxlU2VxW1NFUV9TVEFSVC1idWNrZXRbbG93XV1bREVGX0NIQVJdID0gZGJjc0NvZGU7IC8vIFRoZXJlJ3MgYWxyZWFkeSBhIHNlcXVlbmNlLCBzZXQgYSBzaW5nbGUtY2hhciBzdWJzZXF1ZW5jZSBvZiBpdC5cbiAgICBlbHNlIGlmIChidWNrZXRbbG93XSA9PSBVTkFTU0lHTkVEKVxuICAgICAgICBidWNrZXRbbG93XSA9IGRiY3NDb2RlO1xufVxuXG5EQkNTQ29kZWMucHJvdG90eXBlLl9zZXRFbmNvZGVTZXF1ZW5jZSA9IGZ1bmN0aW9uKHNlcSwgZGJjc0NvZGUpIHtcbiAgICBcbiAgICAvLyBHZXQgdGhlIHJvb3Qgb2YgY2hhcmFjdGVyIHRyZWUgYWNjb3JkaW5nIHRvIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgc2VxdWVuY2UuXG4gICAgdmFyIHVDb2RlID0gc2VxWzBdO1xuICAgIHZhciBidWNrZXQgPSB0aGlzLl9nZXRFbmNvZGVCdWNrZXQodUNvZGUpO1xuICAgIHZhciBsb3cgPSB1Q29kZSAmIDB4RkY7XG5cbiAgICB2YXIgbm9kZTtcbiAgICBpZiAoYnVja2V0W2xvd10gPD0gU0VRX1NUQVJUKSB7XG4gICAgICAgIC8vIFRoZXJlJ3MgYWxyZWFkeSBhIHNlcXVlbmNlIHdpdGggIC0gdXNlIGl0LlxuICAgICAgICBub2RlID0gdGhpcy5lbmNvZGVUYWJsZVNlcVtTRVFfU1RBUlQtYnVja2V0W2xvd11dO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gVGhlcmUgd2FzIG5vIHNlcXVlbmNlIG9iamVjdCAtIGFsbG9jYXRlIGEgbmV3IG9uZS5cbiAgICAgICAgbm9kZSA9IHt9O1xuICAgICAgICBpZiAoYnVja2V0W2xvd10gIT09IFVOQVNTSUdORUQpIG5vZGVbREVGX0NIQVJdID0gYnVja2V0W2xvd107IC8vIElmIGEgY2hhciB3YXMgc2V0IGJlZm9yZSAtIG1ha2UgaXQgYSBzaW5nbGUtY2hhciBzdWJzZXF1ZW5jZS5cbiAgICAgICAgYnVja2V0W2xvd10gPSBTRVFfU1RBUlQgLSB0aGlzLmVuY29kZVRhYmxlU2VxLmxlbmd0aDtcbiAgICAgICAgdGhpcy5lbmNvZGVUYWJsZVNlcS5wdXNoKG5vZGUpO1xuICAgIH1cblxuICAgIC8vIFRyYXZlcnNlIHRoZSBjaGFyYWN0ZXIgdHJlZSwgYWxsb2NhdGluZyBuZXcgbm9kZXMgYXMgbmVlZGVkLlxuICAgIGZvciAodmFyIGogPSAxOyBqIDwgc2VxLmxlbmd0aC0xOyBqKyspIHtcbiAgICAgICAgdmFyIG9sZFZhbCA9IG5vZGVbdUNvZGVdO1xuICAgICAgICBpZiAodHlwZW9mIG9sZFZhbCA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICBub2RlID0gb2xkVmFsO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlW3VDb2RlXSA9IHt9XG4gICAgICAgICAgICBpZiAob2xkVmFsICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgbm9kZVtERUZfQ0hBUl0gPSBvbGRWYWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCB0aGUgbGVhZiB0byBnaXZlbiBkYmNzQ29kZS5cbiAgICB1Q29kZSA9IHNlcVtzZXEubGVuZ3RoLTFdO1xuICAgIG5vZGVbdUNvZGVdID0gZGJjc0NvZGU7XG59XG5cbkRCQ1NDb2RlYy5wcm90b3R5cGUuX2ZpbGxFbmNvZGVUYWJsZSA9IGZ1bmN0aW9uKG5vZGVJZHgsIHByZWZpeCwgc2tpcEVuY29kZUNoYXJzKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmRlY29kZVRhYmxlc1tub2RlSWR4XTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDB4MTAwOyBpKyspIHtcbiAgICAgICAgdmFyIHVDb2RlID0gbm9kZVtpXTtcbiAgICAgICAgdmFyIG1iQ29kZSA9IHByZWZpeCArIGk7XG4gICAgICAgIGlmIChza2lwRW5jb2RlQ2hhcnNbbWJDb2RlXSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgIGlmICh1Q29kZSA+PSAwKVxuICAgICAgICAgICAgdGhpcy5fc2V0RW5jb2RlQ2hhcih1Q29kZSwgbWJDb2RlKTtcbiAgICAgICAgZWxzZSBpZiAodUNvZGUgPD0gTk9ERV9TVEFSVClcbiAgICAgICAgICAgIHRoaXMuX2ZpbGxFbmNvZGVUYWJsZShOT0RFX1NUQVJUIC0gdUNvZGUsIG1iQ29kZSA8PCA4LCBza2lwRW5jb2RlQ2hhcnMpO1xuICAgICAgICBlbHNlIGlmICh1Q29kZSA8PSBTRVFfU1RBUlQpXG4gICAgICAgICAgICB0aGlzLl9zZXRFbmNvZGVTZXF1ZW5jZSh0aGlzLmRlY29kZVRhYmxlU2VxW1NFUV9TVEFSVCAtIHVDb2RlXSwgbWJDb2RlKTtcbiAgICB9XG59XG5cblxuXG4vLyA9PSBFbmNvZGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBEQkNTRW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIC8vIEVuY29kZXIgc3RhdGVcbiAgICB0aGlzLmxlYWRTdXJyb2dhdGUgPSAtMTtcbiAgICB0aGlzLnNlcU9iaiA9IHVuZGVmaW5lZDtcbiAgICBcbiAgICAvLyBTdGF0aWMgZGF0YVxuICAgIHRoaXMuZW5jb2RlVGFibGUgPSBjb2RlYy5lbmNvZGVUYWJsZTtcbiAgICB0aGlzLmVuY29kZVRhYmxlU2VxID0gY29kZWMuZW5jb2RlVGFibGVTZXE7XG4gICAgdGhpcy5kZWZhdWx0Q2hhclNpbmdsZUJ5dGUgPSBjb2RlYy5kZWZDaGFyU0I7XG4gICAgdGhpcy5nYjE4MDMwID0gY29kZWMuZ2IxODAzMDtcbn1cblxuREJDU0VuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc3RyLmxlbmd0aCAqICh0aGlzLmdiMTgwMzAgPyA0IDogMykpLCBcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IHRoaXMubGVhZFN1cnJvZ2F0ZSxcbiAgICAgICAgc2VxT2JqID0gdGhpcy5zZXFPYmosIG5leHRDaGFyID0gLTEsXG4gICAgICAgIGkgPSAwLCBqID0gMDtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIC8vIDAuIEdldCBuZXh0IGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKG5leHRDaGFyID09PSAtMSkge1xuICAgICAgICAgICAgaWYgKGkgPT0gc3RyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICB2YXIgdUNvZGUgPSBzdHIuY2hhckNvZGVBdChpKyspO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHVDb2RlID0gbmV4dENoYXI7XG4gICAgICAgICAgICBuZXh0Q2hhciA9IC0xOyAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDEuIEhhbmRsZSBzdXJyb2dhdGVzLlxuICAgICAgICBpZiAoMHhEODAwIDw9IHVDb2RlICYmIHVDb2RlIDwgMHhFMDAwKSB7IC8vIENoYXIgaXMgb25lIG9mIHN1cnJvZ2F0ZXMuXG4gICAgICAgICAgICBpZiAodUNvZGUgPCAweERDMDApIHsgLy8gV2UndmUgZ290IGxlYWQgc3Vycm9nYXRlLlxuICAgICAgICAgICAgICAgIGlmIChsZWFkU3Vycm9nYXRlID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBsZWFkU3Vycm9nYXRlID0gdUNvZGU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxlYWRTdXJyb2dhdGUgPSB1Q29kZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG91YmxlIGxlYWQgc3Vycm9nYXRlIGZvdW5kLlxuICAgICAgICAgICAgICAgICAgICB1Q29kZSA9IFVOQVNTSUdORUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gV2UndmUgZ290IHRyYWlsIHN1cnJvZ2F0ZS5cbiAgICAgICAgICAgICAgICBpZiAobGVhZFN1cnJvZ2F0ZSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdUNvZGUgPSAweDEwMDAwICsgKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDApICogMHg0MDAgKyAodUNvZGUgLSAweERDMDApO1xuICAgICAgICAgICAgICAgICAgICBsZWFkU3Vycm9nYXRlID0gLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW5jb21wbGV0ZSBzdXJyb2dhdGUgcGFpciAtIG9ubHkgdHJhaWwgc3Vycm9nYXRlIGZvdW5kLlxuICAgICAgICAgICAgICAgICAgICB1Q29kZSA9IFVOQVNTSUdORUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUgIT09IC0xKSB7XG4gICAgICAgICAgICAvLyBJbmNvbXBsZXRlIHN1cnJvZ2F0ZSBwYWlyIC0gb25seSBsZWFkIHN1cnJvZ2F0ZSBmb3VuZC5cbiAgICAgICAgICAgIG5leHRDaGFyID0gdUNvZGU7IHVDb2RlID0gVU5BU1NJR05FRDsgLy8gV3JpdGUgYW4gZXJyb3IsIHRoZW4gY3VycmVudCBjaGFyLlxuICAgICAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMi4gQ29udmVydCB1Q29kZSBjaGFyYWN0ZXIuXG4gICAgICAgIHZhciBkYmNzQ29kZSA9IFVOQVNTSUdORUQ7XG4gICAgICAgIGlmIChzZXFPYmogIT09IHVuZGVmaW5lZCAmJiB1Q29kZSAhPSBVTkFTU0lHTkVEKSB7IC8vIFdlIGFyZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBzZXF1ZW5jZVxuICAgICAgICAgICAgdmFyIHJlc0NvZGUgPSBzZXFPYmpbdUNvZGVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNDb2RlID09PSAnb2JqZWN0JykgeyAvLyBTZXF1ZW5jZSBjb250aW51ZXMuXG4gICAgICAgICAgICAgICAgc2VxT2JqID0gcmVzQ29kZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzQ29kZSA9PSAnbnVtYmVyJykgeyAvLyBTZXF1ZW5jZSBmaW5pc2hlZC4gV3JpdGUgaXQuXG4gICAgICAgICAgICAgICAgZGJjc0NvZGUgPSByZXNDb2RlO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc0NvZGUgPT0gdW5kZWZpbmVkKSB7IC8vIEN1cnJlbnQgY2hhcmFjdGVyIGlzIG5vdCBwYXJ0IG9mIHRoZSBzZXF1ZW5jZS5cblxuICAgICAgICAgICAgICAgIC8vIFRyeSBkZWZhdWx0IGNoYXJhY3RlciBmb3IgdGhpcyBzZXF1ZW5jZVxuICAgICAgICAgICAgICAgIHJlc0NvZGUgPSBzZXFPYmpbREVGX0NIQVJdO1xuICAgICAgICAgICAgICAgIGlmIChyZXNDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGJjc0NvZGUgPSByZXNDb2RlOyAvLyBGb3VuZC4gV3JpdGUgaXQuXG4gICAgICAgICAgICAgICAgICAgIG5leHRDaGFyID0gdUNvZGU7IC8vIEN1cnJlbnQgY2hhcmFjdGVyIHdpbGwgYmUgd3JpdHRlbiB0b28gaW4gdGhlIG5leHQgaXRlcmF0aW9uLlxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogV2hhdCBpZiB3ZSBoYXZlIG5vIGRlZmF1bHQ/IChyZXNDb2RlID09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlbiwgd2Ugc2hvdWxkIHdyaXRlIGZpcnN0IGNoYXIgb2YgdGhlIHNlcXVlbmNlIGFzLWlzIGFuZCB0cnkgdGhlIHJlc3QgcmVjdXJzaXZlbHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIERpZG4ndCBkbyBpdCBmb3Igbm93IGJlY2F1c2Ugbm8gZW5jb2RpbmcgaGFzIHRoaXMgc2l0dWF0aW9uIHlldC5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudGx5LCBqdXN0IHNraXAgdGhlIHNlcXVlbmNlIGFuZCB3cml0ZSBjdXJyZW50IGNoYXIuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VxT2JqID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVDb2RlID49IDApIHsgIC8vIFJlZ3VsYXIgY2hhcmFjdGVyXG4gICAgICAgICAgICB2YXIgc3VidGFibGUgPSB0aGlzLmVuY29kZVRhYmxlW3VDb2RlID4+IDhdO1xuICAgICAgICAgICAgaWYgKHN1YnRhYmxlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgZGJjc0NvZGUgPSBzdWJ0YWJsZVt1Q29kZSAmIDB4RkZdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZGJjc0NvZGUgPD0gU0VRX1NUQVJUKSB7IC8vIFNlcXVlbmNlIHN0YXJ0XG4gICAgICAgICAgICAgICAgc2VxT2JqID0gdGhpcy5lbmNvZGVUYWJsZVNlcVtTRVFfU1RBUlQtZGJjc0NvZGVdO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGJjc0NvZGUgPT0gVU5BU1NJR05FRCAmJiB0aGlzLmdiMTgwMzApIHtcbiAgICAgICAgICAgICAgICAvLyBVc2UgR0IxODAzMCBhbGdvcml0aG0gdG8gZmluZCBjaGFyYWN0ZXIocykgdG8gd3JpdGUuXG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IGZpbmRJZHgodGhpcy5nYjE4MDMwLnVDaGFycywgdUNvZGUpO1xuICAgICAgICAgICAgICAgIGlmIChpZHggIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRiY3NDb2RlID0gdGhpcy5nYjE4MDMwLmdiQ2hhcnNbaWR4XSArICh1Q29kZSAtIHRoaXMuZ2IxODAzMC51Q2hhcnNbaWR4XSk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gMHg4MSArIE1hdGguZmxvb3IoZGJjc0NvZGUgLyAxMjYwMCk7IGRiY3NDb2RlID0gZGJjc0NvZGUgJSAxMjYwMDtcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSAweDMwICsgTWF0aC5mbG9vcihkYmNzQ29kZSAvIDEyNjApOyBkYmNzQ29kZSA9IGRiY3NDb2RlICUgMTI2MDtcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSAweDgxICsgTWF0aC5mbG9vcihkYmNzQ29kZSAvIDEwKTsgZGJjc0NvZGUgPSBkYmNzQ29kZSAlIDEwO1xuICAgICAgICAgICAgICAgICAgICBuZXdCdWZbaisrXSA9IDB4MzAgKyBkYmNzQ29kZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gMy4gV3JpdGUgZGJjc0NvZGUgY2hhcmFjdGVyLlxuICAgICAgICBpZiAoZGJjc0NvZGUgPT09IFVOQVNTSUdORUQpXG4gICAgICAgICAgICBkYmNzQ29kZSA9IHRoaXMuZGVmYXVsdENoYXJTaW5nbGVCeXRlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRiY3NDb2RlIDwgMHgxMDApIHtcbiAgICAgICAgICAgIG5ld0J1ZltqKytdID0gZGJjc0NvZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGJjc0NvZGUgPCAweDEwMDAwKSB7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlID4+IDg7ICAgLy8gaGlnaCBieXRlXG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlICYgMHhGRjsgLy8gbG93IGJ5dGVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG5ld0J1ZltqKytdID0gZGJjc0NvZGUgPj4gMTY7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IChkYmNzQ29kZSA+PiA4KSAmIDB4RkY7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlICYgMHhGRjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2VxT2JqID0gc2VxT2JqO1xuICAgIHRoaXMubGVhZFN1cnJvZ2F0ZSA9IGxlYWRTdXJyb2dhdGU7XG4gICAgcmV0dXJuIG5ld0J1Zi5zbGljZSgwLCBqKTtcbn1cblxuREJDU0VuY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmxlYWRTdXJyb2dhdGUgPT09IC0xICYmIHRoaXMuc2VxT2JqID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybjsgLy8gQWxsIGNsZWFuLiBNb3N0IG9mdGVuIGNhc2UuXG5cbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcigxMCksIGogPSAwO1xuXG4gICAgaWYgKHRoaXMuc2VxT2JqKSB7IC8vIFdlJ3JlIGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgdmFyIGRiY3NDb2RlID0gdGhpcy5zZXFPYmpbREVGX0NIQVJdO1xuICAgICAgICBpZiAoZGJjc0NvZGUgIT09IHVuZGVmaW5lZCkgeyAvLyBXcml0ZSBiZWdpbm5pbmcgb2YgdGhlIHNlcXVlbmNlLlxuICAgICAgICAgICAgaWYgKGRiY3NDb2RlIDwgMHgxMDApIHtcbiAgICAgICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSBkYmNzQ29kZSA+PiA4OyAgIC8vIGhpZ2ggYnl0ZVxuICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gZGJjc0NvZGUgJiAweEZGOyAvLyBsb3cgYnl0ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU2VlIHRvZG8gYWJvdmUuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXFPYmogPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGVhZFN1cnJvZ2F0ZSAhPT0gLTEpIHtcbiAgICAgICAgLy8gSW5jb21wbGV0ZSBzdXJyb2dhdGUgcGFpciAtIG9ubHkgbGVhZCBzdXJyb2dhdGUgZm91bmQuXG4gICAgICAgIG5ld0J1ZltqKytdID0gdGhpcy5kZWZhdWx0Q2hhclNpbmdsZUJ5dGU7XG4gICAgICAgIHRoaXMubGVhZFN1cnJvZ2F0ZSA9IC0xO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbmV3QnVmLnNsaWNlKDAsIGopO1xufVxuXG4vLyBFeHBvcnQgZm9yIHRlc3RpbmdcbkRCQ1NFbmNvZGVyLnByb3RvdHlwZS5maW5kSWR4ID0gZmluZElkeDtcblxuXG4vLyA9PSBEZWNvZGVyID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBEQkNTRGVjb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIC8vIERlY29kZXIgc3RhdGVcbiAgICB0aGlzLm5vZGVJZHggPSAwO1xuICAgIHRoaXMucHJldkJ1ZiA9IG5ldyBCdWZmZXIoMCk7XG5cbiAgICAvLyBTdGF0aWMgZGF0YVxuICAgIHRoaXMuZGVjb2RlVGFibGVzID0gY29kZWMuZGVjb2RlVGFibGVzO1xuICAgIHRoaXMuZGVjb2RlVGFibGVTZXEgPSBjb2RlYy5kZWNvZGVUYWJsZVNlcTtcbiAgICB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZSA9IGNvZGVjLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICB0aGlzLmdiMTgwMzAgPSBjb2RlYy5nYjE4MDMwO1xufVxuXG5EQkNTRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihidWYubGVuZ3RoKjIpLFxuICAgICAgICBub2RlSWR4ID0gdGhpcy5ub2RlSWR4LCBcbiAgICAgICAgcHJldkJ1ZiA9IHRoaXMucHJldkJ1ZiwgcHJldkJ1Zk9mZnNldCA9IHRoaXMucHJldkJ1Zi5sZW5ndGgsXG4gICAgICAgIHNlcVN0YXJ0ID0gLXRoaXMucHJldkJ1Zi5sZW5ndGgsIC8vIGlkeCBvZiB0aGUgc3RhcnQgb2YgY3VycmVudCBwYXJzZWQgc2VxdWVuY2UuXG4gICAgICAgIHVDb2RlO1xuXG4gICAgaWYgKHByZXZCdWZPZmZzZXQgPiAwKSAvLyBNYWtlIHByZXYgYnVmIG92ZXJsYXAgYSBsaXR0bGUgdG8gbWFrZSBpdCBlYXNpZXIgdG8gc2xpY2UgbGF0ZXIuXG4gICAgICAgIHByZXZCdWYgPSBCdWZmZXIuY29uY2F0KFtwcmV2QnVmLCBidWYuc2xpY2UoMCwgMTApXSk7XG4gICAgXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJCeXRlID0gKGkgPj0gMCkgPyBidWZbaV0gOiBwcmV2QnVmW2kgKyBwcmV2QnVmT2Zmc2V0XTtcblxuICAgICAgICAvLyBMb29rdXAgaW4gY3VycmVudCB0cmllIG5vZGUuXG4gICAgICAgIHZhciB1Q29kZSA9IHRoaXMuZGVjb2RlVGFibGVzW25vZGVJZHhdW2N1ckJ5dGVdO1xuXG4gICAgICAgIGlmICh1Q29kZSA+PSAwKSB7IFxuICAgICAgICAgICAgLy8gTm9ybWFsIGNoYXJhY3RlciwganVzdCB1c2UgaXQuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodUNvZGUgPT09IFVOQVNTSUdORUQpIHsgLy8gVW5rbm93biBjaGFyLlxuICAgICAgICAgICAgLy8gVE9ETzogQ2FsbGJhY2sgd2l0aCBzZXEuXG4gICAgICAgICAgICAvL3ZhciBjdXJTZXEgPSAoc2VxU3RhcnQgPj0gMCkgPyBidWYuc2xpY2Uoc2VxU3RhcnQsIGkrMSkgOiBwcmV2QnVmLnNsaWNlKHNlcVN0YXJ0ICsgcHJldkJ1Zk9mZnNldCwgaSsxICsgcHJldkJ1Zk9mZnNldCk7XG4gICAgICAgICAgICBpID0gc2VxU3RhcnQ7IC8vIFRyeSB0byBwYXJzZSBhZ2FpbiwgYWZ0ZXIgc2tpcHBpbmcgZmlyc3QgYnl0ZSBvZiB0aGUgc2VxdWVuY2UgKCdpJyB3aWxsIGJlIGluY3JlbWVudGVkIGJ5ICdmb3InIGN5Y2xlKS5cbiAgICAgICAgICAgIHVDb2RlID0gdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGUuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1Q29kZSA9PT0gR0IxODAzMF9DT0RFKSB7XG4gICAgICAgICAgICB2YXIgY3VyU2VxID0gKHNlcVN0YXJ0ID49IDApID8gYnVmLnNsaWNlKHNlcVN0YXJ0LCBpKzEpIDogcHJldkJ1Zi5zbGljZShzZXFTdGFydCArIHByZXZCdWZPZmZzZXQsIGkrMSArIHByZXZCdWZPZmZzZXQpO1xuICAgICAgICAgICAgdmFyIHB0ciA9IChjdXJTZXFbMF0tMHg4MSkqMTI2MDAgKyAoY3VyU2VxWzFdLTB4MzApKjEyNjAgKyAoY3VyU2VxWzJdLTB4ODEpKjEwICsgKGN1clNlcVszXS0weDMwKTtcbiAgICAgICAgICAgIHZhciBpZHggPSBmaW5kSWR4KHRoaXMuZ2IxODAzMC5nYkNoYXJzLCBwdHIpO1xuICAgICAgICAgICAgdUNvZGUgPSB0aGlzLmdiMTgwMzAudUNoYXJzW2lkeF0gKyBwdHIgLSB0aGlzLmdiMTgwMzAuZ2JDaGFyc1tpZHhdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVDb2RlIDw9IE5PREVfU1RBUlQpIHsgLy8gR28gdG8gbmV4dCB0cmllIG5vZGUuXG4gICAgICAgICAgICBub2RlSWR4ID0gTk9ERV9TVEFSVCAtIHVDb2RlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodUNvZGUgPD0gU0VRX1NUQVJUKSB7IC8vIE91dHB1dCBhIHNlcXVlbmNlIG9mIGNoYXJzLlxuICAgICAgICAgICAgdmFyIHNlcSA9IHRoaXMuZGVjb2RlVGFibGVTZXFbU0VRX1NUQVJUIC0gdUNvZGVdO1xuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzZXEubGVuZ3RoIC0gMTsgaysrKSB7XG4gICAgICAgICAgICAgICAgdUNvZGUgPSBzZXFba107XG4gICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSB1Q29kZSAmIDB4RkY7XG4gICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSB1Q29kZSA+PiA4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdUNvZGUgPSBzZXFbc2VxLmxlbmd0aC0xXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpY29udi1saXRlIGludGVybmFsIGVycm9yOiBpbnZhbGlkIGRlY29kaW5nIHRhYmxlIHZhbHVlIFwiICsgdUNvZGUgKyBcIiBhdCBcIiArIG5vZGVJZHggKyBcIi9cIiArIGN1ckJ5dGUpO1xuXG4gICAgICAgIC8vIFdyaXRlIHRoZSBjaGFyYWN0ZXIgdG8gYnVmZmVyLCBoYW5kbGluZyBoaWdoZXIgcGxhbmVzIHVzaW5nIHN1cnJvZ2F0ZSBwYWlyLlxuICAgICAgICBpZiAodUNvZGUgPiAweEZGRkYpIHsgXG4gICAgICAgICAgICB1Q29kZSAtPSAweDEwMDAwO1xuICAgICAgICAgICAgdmFyIHVDb2RlTGVhZCA9IDB4RDgwMCArIE1hdGguZmxvb3IodUNvZGUgLyAweDQwMCk7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IHVDb2RlTGVhZCAmIDB4RkY7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IHVDb2RlTGVhZCA+PiA4O1xuXG4gICAgICAgICAgICB1Q29kZSA9IDB4REMwMCArIHVDb2RlICUgMHg0MDA7XG4gICAgICAgIH1cbiAgICAgICAgbmV3QnVmW2orK10gPSB1Q29kZSAmIDB4RkY7XG4gICAgICAgIG5ld0J1ZltqKytdID0gdUNvZGUgPj4gODtcblxuICAgICAgICAvLyBSZXNldCB0cmllIG5vZGUuXG4gICAgICAgIG5vZGVJZHggPSAwOyBzZXFTdGFydCA9IGkrMTtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGVJZHggPSBub2RlSWR4O1xuICAgIHRoaXMucHJldkJ1ZiA9IChzZXFTdGFydCA+PSAwKSA/IGJ1Zi5zbGljZShzZXFTdGFydCkgOiBwcmV2QnVmLnNsaWNlKHNlcVN0YXJ0ICsgcHJldkJ1Zk9mZnNldCk7XG4gICAgcmV0dXJuIG5ld0J1Zi5zbGljZSgwLCBqKS50b1N0cmluZygndWNzMicpO1xufVxuXG5EQkNTRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJldCA9ICcnO1xuXG4gICAgLy8gVHJ5IHRvIHBhcnNlIGFsbCByZW1haW5pbmcgY2hhcnMuXG4gICAgd2hpbGUgKHRoaXMucHJldkJ1Zi5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFNraXAgMSBjaGFyYWN0ZXIgaW4gdGhlIGJ1ZmZlci5cbiAgICAgICAgcmV0ICs9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgICAgICB2YXIgYnVmID0gdGhpcy5wcmV2QnVmLnNsaWNlKDEpO1xuXG4gICAgICAgIC8vIFBhcnNlIHJlbWFpbmluZyBhcyB1c3VhbC5cbiAgICAgICAgdGhpcy5wcmV2QnVmID0gbmV3IEJ1ZmZlcigwKTtcbiAgICAgICAgdGhpcy5ub2RlSWR4ID0gMDtcbiAgICAgICAgaWYgKGJ1Zi5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmV0ICs9IHRoaXMud3JpdGUoYnVmKTtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGVJZHggPSAwO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8vIEJpbmFyeSBzZWFyY2ggZm9yIEdCMTgwMzAuIFJldHVybnMgbGFyZ2VzdCBpIHN1Y2ggdGhhdCB0YWJsZVtpXSA8PSB2YWwuXG5mdW5jdGlvbiBmaW5kSWR4KHRhYmxlLCB2YWwpIHtcbiAgICBpZiAodGFibGVbMF0gPiB2YWwpXG4gICAgICAgIHJldHVybiAtMTtcblxuICAgIHZhciBsID0gMCwgciA9IHRhYmxlLmxlbmd0aDtcbiAgICB3aGlsZSAobCA8IHItMSkgeyAvLyBhbHdheXMgdGFibGVbbF0gPD0gdmFsIDwgdGFibGVbcl1cbiAgICAgICAgdmFyIG1pZCA9IGwgKyBNYXRoLmZsb29yKChyLWwrMSkvMik7XG4gICAgICAgIGlmICh0YWJsZVttaWRdIDw9IHZhbClcbiAgICAgICAgICAgIGwgPSBtaWQ7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHIgPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBEZXNjcmlwdGlvbiBvZiBzdXBwb3J0ZWQgZG91YmxlIGJ5dGUgZW5jb2RpbmdzIGFuZCBhbGlhc2VzLlxuLy8gVGFibGVzIGFyZSBub3QgcmVxdWlyZSgpLWQgdW50aWwgdGhleSBhcmUgbmVlZGVkIHRvIHNwZWVkIHVwIGxpYnJhcnkgbG9hZC5cbi8vIHJlcXVpcmUoKS1zIGFyZSBkaXJlY3QgdG8gc3VwcG9ydCBCcm93c2VyaWZ5LlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcbiAgICAvLyA9PSBKYXBhbmVzZS9TaGlmdEpJUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gQWxsIGphcGFuZXNlIGVuY29kaW5ncyBhcmUgYmFzZWQgb24gSklTIFggc2V0IG9mIHN0YW5kYXJkczpcbiAgICAvLyBKSVMgWCAwMjAxIC0gU2luZ2xlLWJ5dGUgZW5jb2Rpbmcgb2YgQVNDSUkgKyDCpSArIEthbmEgY2hhcnMgYXQgMHhBMS0weERGLlxuICAgIC8vIEpJUyBYIDAyMDggLSBNYWluIHNldCBvZiA2ODc5IGNoYXJhY3RlcnMsIHBsYWNlZCBpbiA5NHg5NCBwbGFuZSwgdG8gYmUgZW5jb2RlZCBieSAyIGJ5dGVzLiBcbiAgICAvLyAgICAgICAgICAgICAgSGFzIHNldmVyYWwgdmFyaWF0aW9ucyBpbiAxOTc4LCAxOTgzLCAxOTkwIGFuZCAxOTk3LlxuICAgIC8vIEpJUyBYIDAyMTIgLSBTdXBwbGVtZW50YXJ5IHBsYW5lIG9mIDYwNjcgY2hhcnMgaW4gOTR4OTQgcGxhbmUuIDE5OTAuIEVmZmVjdGl2ZWx5IGRlYWQuXG4gICAgLy8gSklTIFggMDIxMyAtIEV4dGVuc2lvbiBhbmQgbW9kZXJuIHJlcGxhY2VtZW50IG9mIDAyMDggYW5kIDAyMTIuIFRvdGFsIGNoYXJzOiAxMTIzMy5cbiAgICAvLyAgICAgICAgICAgICAgMiBwbGFuZXMsIGZpcnN0IGlzIHN1cGVyc2V0IG9mIDAyMDgsIHNlY29uZCAtIHJldmlzZWQgMDIxMi5cbiAgICAvLyAgICAgICAgICAgICAgSW50cm9kdWNlZCBpbiAyMDAwLCByZXZpc2VkIDIwMDQuIFNvbWUgY2hhcmFjdGVycyBhcmUgaW4gVW5pY29kZSBQbGFuZSAyICgweDJ4eHh4KVxuXG4gICAgLy8gQnl0ZSBlbmNvZGluZ3MgYXJlOlxuICAgIC8vICAqIFNoaWZ0X0pJUzogQ29tcGF0aWJsZSB3aXRoIDAyMDEsIHVzZXMgbm90IGRlZmluZWQgY2hhcnMgaW4gdG9wIGhhbGYgYXMgbGVhZCBieXRlcyBmb3IgZG91YmxlLWJ5dGVcbiAgICAvLyAgICAgICAgICAgICAgIGVuY29kaW5nIG9mIDAyMDguIExlYWQgYnl0ZSByYW5nZXM6IDB4ODEtMHg5RiwgMHhFMC0weEVGOyBUcmFpbCBieXRlIHJhbmdlczogMHg0MC0weDdFLCAweDgwLTB4OUUsIDB4OUYtMHhGQy5cbiAgICAvLyAgICAgICAgICAgICAgIFdpbmRvd3MgQ1A5MzIgaXMgYSBzdXBlcnNldCBvZiBTaGlmdF9KSVMuIFNvbWUgY29tcGFuaWVzIGFkZGVkIG1vcmUgY2hhcnMsIG5vdGFibHkgS0RESS5cbiAgICAvLyAgKiBFVUMtSlA6ICAgIFVwIHRvIDMgYnl0ZXMgcGVyIGNoYXJhY3Rlci4gVXNlZCBtb3N0bHkgb24gKm5peGVzLlxuICAgIC8vICAgICAgICAgICAgICAgMHgwMC0weDdGICAgICAgIC0gbG93ZXIgcGFydCBvZiAwMjAxXG4gICAgLy8gICAgICAgICAgICAgICAweDhFLCAweEExLTB4REYgLSB1cHBlciBwYXJ0IG9mIDAyMDFcbiAgICAvLyAgICAgICAgICAgICAgICgweEExLTB4RkUpeDIgICAtIDAyMDggcGxhbmUgKDk0eDk0KS5cbiAgICAvLyAgICAgICAgICAgICAgIDB4OEYsICgweEExLTB4RkUpeDIgLSAwMjEyIHBsYW5lICg5NHg5NCkuXG4gICAgLy8gICogSklTIFggMjA4OiA3LWJpdCwgZGlyZWN0IGVuY29kaW5nIG9mIDAyMDguIEJ5dGUgcmFuZ2VzOiAweDIxLTB4N0UgKDk0IHZhbHVlcykuIFVuY29tbW9uLlxuICAgIC8vICAgICAgICAgICAgICAgVXNlZCBhcy1pcyBpbiBJU08yMDIyIGZhbWlseS5cbiAgICAvLyAgKiBJU08yMDIyLUpQOiBTdGF0ZWZ1bCBlbmNvZGluZywgd2l0aCBlc2NhcGUgc2VxdWVuY2VzIHRvIHN3aXRjaCBiZXR3ZWVuIEFTQ0lJLCBcbiAgICAvLyAgICAgICAgICAgICAgICAwMjAxLTE5NzYgUm9tYW4sIDAyMDgtMTk3OCwgMDIwOC0xOTgzLlxuICAgIC8vICAqIElTTzIwMjItSlAtMTogQWRkcyBlc2Mgc2VxIGZvciAwMjEyLTE5OTAuXG4gICAgLy8gICogSVNPMjAyMi1KUC0yOiBBZGRzIGVzYyBzZXEgZm9yIEdCMjMxMy0xOTgwLCBLU1gxMDAxLTE5OTIsIElTTzg4NTktMSwgSVNPODg1OS03LlxuICAgIC8vICAqIElTTzIwMjItSlAtMzogQWRkcyBlc2Mgc2VxIGZvciAwMjAxLTE5NzYgS2FuYSBzZXQsIDAyMTMtMjAwMCBQbGFuZXMgMSwgMi5cbiAgICAvLyAgKiBJU08yMDIyLUpQLTIwMDQ6IEFkZHMgMDIxMy0yMDA0IFBsYW5lIDEuXG4gICAgLy9cbiAgICAvLyBBZnRlciBKSVMgWCAwMjEzIGFwcGVhcmVkLCBTaGlmdF9KSVMtMjAwNCwgRVVDLUpJU1gwMjEzIGFuZCBJU08yMDIyLUpQLTIwMDQgZm9sbG93ZWQsIHdpdGgganVzdCBjaGFuZ2luZyB0aGUgcGxhbmVzLlxuICAgIC8vXG4gICAgLy8gT3ZlcmFsbCwgaXQgc2VlbXMgdGhhdCBpdCdzIGEgbWVzcyA6KCBodHRwOi8vd3d3OC5wbGFsYS5vci5qcC90a3Vib3RhMS91bmljb2RlLXN5bWJvbHMtbWFwMi5odG1sXG5cblxuICAgICdzaGlmdGppcyc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvc2hpZnRqaXMuanNvbicpIH0sXG4gICAgICAgIGVuY29kZUFkZDogeydcXHUwMGE1JzogMHg1QywgJ1xcdTIwM0UnOiAweDdFfSxcbiAgICAgICAgZW5jb2RlU2tpcFZhbHM6IFt7ZnJvbTogMHhFRDQwLCB0bzogMHhGOTQwfV0sXG4gICAgfSxcbiAgICAnY3NzaGlmdGppcyc6ICdzaGlmdGppcycsXG4gICAgJ21za2FuamknOiAnc2hpZnRqaXMnLFxuICAgICdzamlzJzogJ3NoaWZ0amlzJyxcbiAgICAnd2luZG93czMxaic6ICdzaGlmdGppcycsXG4gICAgJ3hzamlzJzogJ3NoaWZ0amlzJyxcbiAgICAnd2luZG93czkzMic6ICdzaGlmdGppcycsXG4gICAgJzkzMic6ICdzaGlmdGppcycsXG4gICAgJ2NwOTMyJzogJ3NoaWZ0amlzJyxcblxuICAgICdldWNqcCc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvZXVjanAuanNvbicpIH0sXG4gICAgICAgIGVuY29kZUFkZDogeydcXHUwMGE1JzogMHg1QywgJ1xcdTIwM0UnOiAweDdFfSxcbiAgICB9LFxuXG4gICAgLy8gVE9ETzogS0RESSBleHRlbnNpb24gdG8gU2hpZnRfSklTXG4gICAgLy8gVE9ETzogSUJNIENDU0lEIDk0MiA9IENQOTMyLCBidXQgRjAtRjkgY3VzdG9tIGNoYXJzIGFuZCBvdGhlciBjaGFyIGNoYW5nZXMuXG4gICAgLy8gVE9ETzogSUJNIENDU0lEIDk0MyA9IFNoaWZ0X0pJUyA9IENQOTMyIHdpdGggb3JpZ2luYWwgU2hpZnRfSklTIGxvd2VyIDEyOCBjaGFycy5cblxuICAgIC8vID09IENoaW5lc2UvR0JLID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0dCS1xuXG4gICAgLy8gT2xkZXN0IEdCMjMxMiAoMTk4MSwgfjc2MDAgY2hhcnMpIGlzIGEgc3Vic2V0IG9mIENQOTM2XG4gICAgJ2diMjMxMic6ICdjcDkzNicsXG4gICAgJ2diMjMxMjgwJzogJ2NwOTM2JyxcbiAgICAnZ2IyMzEyMTk4MCc6ICdjcDkzNicsXG4gICAgJ2NzZ2IyMzEyJzogJ2NwOTM2JyxcbiAgICAnY3Npc281OGdiMjMxMjgwJzogJ2NwOTM2JyxcbiAgICAnZXVjY24nOiAnY3A5MzYnLFxuICAgICdpc29pcjU4JzogJ2diaycsXG5cbiAgICAvLyBNaWNyb3NvZnQncyBDUDkzNiBpcyBhIHN1YnNldCBhbmQgYXBwcm94aW1hdGlvbiBvZiBHQksuXG4gICAgLy8gVE9ETzogRXVybyA9IDB4ODAgaW4gY3A5MzYsIGJ1dCBub3QgaW4gR0JLICh3aGVyZSBpdCdzIHZhbGlkIGJ1dCB1bmRlZmluZWQpXG4gICAgJ3dpbmRvd3M5MzYnOiAnY3A5MzYnLFxuICAgICc5MzYnOiAnY3A5MzYnLFxuICAgICdjcDkzNic6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5MzYuanNvbicpIH0sXG4gICAgfSxcblxuICAgIC8vIEdCSyAofjIyMDAwIGNoYXJzKSBpcyBhbiBleHRlbnNpb24gb2YgQ1A5MzYgdGhhdCBhZGRlZCB1c2VyLW1hcHBlZCBjaGFycyBhbmQgc29tZSBvdGhlci5cbiAgICAnZ2JrJzoge1xuICAgICAgICB0eXBlOiAnX2RiY3MnLFxuICAgICAgICB0YWJsZTogZnVuY3Rpb24oKSB7IHJldHVybiByZXF1aXJlKCcuL3RhYmxlcy9jcDkzNi5qc29uJykuY29uY2F0KHJlcXVpcmUoJy4vdGFibGVzL2diay1hZGRlZC5qc29uJykpIH0sXG4gICAgfSxcbiAgICAneGdiayc6ICdnYmsnLFxuXG4gICAgLy8gR0IxODAzMCBpcyBhbiBhbGdvcml0aG1pYyBleHRlbnNpb24gb2YgR0JLLlxuICAgICdnYjE4MDMwJzoge1xuICAgICAgICB0eXBlOiAnX2RiY3MnLFxuICAgICAgICB0YWJsZTogZnVuY3Rpb24oKSB7IHJldHVybiByZXF1aXJlKCcuL3RhYmxlcy9jcDkzNi5qc29uJykuY29uY2F0KHJlcXVpcmUoJy4vdGFibGVzL2diay1hZGRlZC5qc29uJykpIH0sXG4gICAgICAgIGdiMTgwMzA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvZ2IxODAzMC1yYW5nZXMuanNvbicpIH0sXG4gICAgfSxcblxuICAgICdjaGluZXNlJzogJ2diMTgwMzAnLFxuXG4gICAgLy8gVE9ETzogU3VwcG9ydCBHQjE4MDMwICh+MjcwMDAgY2hhcnMgKyB3aG9sZSB1bmljb2RlIG1hcHBpbmcsIGNwNTQ5MzYpXG4gICAgLy8gaHR0cDovL2ljdS1wcm9qZWN0Lm9yZy9kb2NzL3BhcGVycy9nYjE4MDMwLmh0bWxcbiAgICAvLyBodHRwOi8vc291cmNlLmljdS1wcm9qZWN0Lm9yZy9yZXBvcy9pY3UvZGF0YS90cnVuay9jaGFyc2V0L2RhdGEveG1sL2diLTE4MDMwLTIwMDAueG1sXG4gICAgLy8gaHR0cDovL3d3dy5raG5nYWkuY29tL2NoaW5lc2UvY2hhcm1hcC90YmxnYmsucGhwP3BhZ2U9MFxuXG4gICAgLy8gPT0gS29yZWFuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEVVQy1LUiwgS1NfQ181NjAxIGFuZCBLUyBYIDEwMDEgYXJlIGV4YWN0bHkgdGhlIHNhbWUuXG4gICAgJ3dpbmRvd3M5NDknOiAnY3A5NDknLFxuICAgICc5NDknOiAnY3A5NDknLFxuICAgICdjcDk0OSc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5NDkuanNvbicpIH0sXG4gICAgfSxcblxuICAgICdjc2V1Y2tyJzogJ2NwOTQ5JyxcbiAgICAnY3Nrc2M1NjAxMTk4Nyc6ICdjcDk0OScsXG4gICAgJ2V1Y2tyJzogJ2NwOTQ5JyxcbiAgICAnaXNvaXIxNDknOiAnY3A5NDknLFxuICAgICdrb3JlYW4nOiAnY3A5NDknLFxuICAgICdrc2M1NjAxMTk4Nyc6ICdjcDk0OScsXG4gICAgJ2tzYzU2MDExOTg5JzogJ2NwOTQ5JyxcbiAgICAna3NjNTYwMSc6ICdjcDk0OScsXG5cblxuICAgIC8vID09IEJpZzUvVGFpd2FuL0hvbmcgS29uZyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBUaGVyZSBhcmUgbG90cyBvZiB0YWJsZXMgZm9yIEJpZzUgYW5kIGNwOTUwLiBQbGVhc2Ugc2VlIHRoZSBmb2xsb3dpbmcgbGlua3MgZm9yIGhpc3Rvcnk6XG4gICAgLy8gaHR0cDovL21venR3Lm9yZy9kb2NzL2JpZzUvICBodHRwOi8vd3d3LmhhaWJsZS5kZS9icnVuby9jaGFyc2V0cy9jb252ZXJzaW9uLXRhYmxlcy9CaWc1Lmh0bWxcbiAgICAvLyBWYXJpYXRpb25zLCBpbiByb3VnaGx5IG51bWJlciBvZiBkZWZpbmVkIGNoYXJzOlxuICAgIC8vICAqIFdpbmRvd3MgQ1AgOTUwOiBNaWNyb3NvZnQgdmFyaWFudCBvZiBCaWc1LiBDYW5vbmljYWw6IGh0dHA6Ly93d3cudW5pY29kZS5vcmcvUHVibGljL01BUFBJTkdTL1ZFTkRPUlMvTUlDU0ZUL1dJTkRPV1MvQ1A5NTAuVFhUXG4gICAgLy8gICogV2luZG93cyBDUCA5NTE6IE1pY3Jvc29mdCB2YXJpYW50IG9mIEJpZzUtSEtTQ1MtMjAwMS4gU2VlbXMgdG8gYmUgbmV2ZXIgcHVibGljLiBodHRwOi8vbWUuYWJlbGNoZXVuZy5vcmcvYXJ0aWNsZXMvcmVzZWFyY2gvd2hhdC1pcy1jcDk1MS9cbiAgICAvLyAgKiBCaWc1LTIwMDMgKFRhaXdhbiBzdGFuZGFyZCkgYWxtb3N0IHN1cGVyc2V0IG9mIGNwOTUwLlxuICAgIC8vICAqIFVuaWNvZGUtYXQtb24gKFVBTykgLyBNb3ppbGxhIDEuOC4gRmFsbGluZyBvdXQgb2YgdXNlIG9uIHRoZSBXZWIuIE5vdCBzdXBwb3J0ZWQgYnkgb3RoZXIgYnJvd3NlcnMuXG4gICAgLy8gICogQmlnNS1IS1NDUyAoLTIwMDEsIC0yMDA0LCAtMjAwOCkuIEhvbmcgS29uZyBzdGFuZGFyZC4gXG4gICAgLy8gICAgbWFueSB1bmljb2RlIGNvZGUgcG9pbnRzIG1vdmVkIGZyb20gUFVBIHRvIFN1cHBsZW1lbnRhcnkgcGxhbmUgKFUrMlhYWFgpIG92ZXIgdGhlIHllYXJzLlxuICAgIC8vICAgIFBsdXMsIGl0IGhhcyA0IGNvbWJpbmluZyBzZXF1ZW5jZXMuXG4gICAgLy8gICAgU2VlbXMgdGhhdCBNb3ppbGxhIHJlZnVzZWQgdG8gc3VwcG9ydCBpdCBmb3IgMTAgeXJzLiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xNjI0MzEgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MzEwMjk5XG4gICAgLy8gICAgYmVjYXVzZSBiaWc1LWhrc2NzIGlzIHRoZSBvbmx5IGVuY29kaW5nIHRvIGluY2x1ZGUgYXN0cmFsIGNoYXJhY3RlcnMgaW4gbm9uLWFsZ29yaXRobWljIHdheS5cbiAgICAvLyAgICBJbXBsZW1lbnRhdGlvbnMgYXJlIG5vdCBjb25zaXN0ZW50IHdpdGhpbiBicm93c2Vyczsgc29tZXRpbWVzIGxhYmVsZWQgYXMganVzdCBiaWc1LlxuICAgIC8vICAgIE1TIEludGVybmV0IEV4cGxvcmVyIHN3aXRjaGVzIGZyb20gYmlnNSB0byBiaWc1LWhrc2NzIHdoZW4gYSBwYXRjaCBhcHBsaWVkLlxuICAgIC8vICAgIEdyZWF0IGRpc2N1c3Npb24gJiByZWNhcCBvZiB3aGF0J3MgZ29pbmcgb24gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTEyNDcwI2MzMVxuICAgIC8vICAgIEluIHRoZSBlbmNvZGVyLCBpdCBtaWdodCBtYWtlIHNlbnNlIHRvIHN1cHBvcnQgZW5jb2Rpbmcgb2xkIFBVQSBtYXBwaW5ncyB0byBCaWc1IGJ5dGVzIHNlcS1zLlxuICAgIC8vICAgIE9mZmljaWFsIHNwZWM6IGh0dHA6Ly93d3cub2djaW8uZ292LmhrL2VuL2J1c2luZXNzL3RlY2hfcHJvbW90aW9uL2NjbGkvdGVybXMvZG9jLzIwMDNjbXBfMjAwOC50eHRcbiAgICAvLyAgICAgICAgICAgICAgICAgICBodHRwOi8vd3d3Lm9nY2lvLmdvdi5oay90Yy9idXNpbmVzcy90ZWNoX3Byb21vdGlvbi9jY2xpL3Rlcm1zL2RvYy9oa3Njcy0yMDA4LWJpZzUtaXNvLnR4dFxuICAgIC8vIFxuICAgIC8vIEN1cnJlbnQgdW5kZXJzdGFuZGluZyBvZiBob3cgdG8gZGVhbCB3aXRoIEJpZzUoLUhLU0NTKSBpcyBpbiB0aGUgRW5jb2RpbmcgU3RhbmRhcmQsIGh0dHA6Ly9lbmNvZGluZy5zcGVjLndoYXR3Zy5vcmcvI2JpZzUtZW5jb2RlclxuICAgIC8vIFVuaWNvZGUgbWFwcGluZyAoaHR0cDovL3d3dy51bmljb2RlLm9yZy9QdWJsaWMvTUFQUElOR1MvT0JTT0xFVEUvRUFTVEFTSUEvT1RIRVIvQklHNS5UWFQpIGlzIHNhaWQgdG8gYmUgd3JvbmcuXG5cbiAgICAnd2luZG93czk1MCc6ICdjcDk1MCcsXG4gICAgJzk1MCc6ICdjcDk1MCcsXG4gICAgJ2NwOTUwJzoge1xuICAgICAgICB0eXBlOiAnX2RiY3MnLFxuICAgICAgICB0YWJsZTogZnVuY3Rpb24oKSB7IHJldHVybiByZXF1aXJlKCcuL3RhYmxlcy9jcDk1MC5qc29uJykgfSxcbiAgICB9LFxuXG4gICAgLy8gQmlnNSBoYXMgbWFueSB2YXJpYXRpb25zIGFuZCBpcyBhbiBleHRlbnNpb24gb2YgY3A5NTAuIFdlIHVzZSBFbmNvZGluZyBTdGFuZGFyZCdzIGFzIGEgY29uc2Vuc3VzLlxuICAgICdiaWc1JzogJ2JpZzVoa3NjcycsXG4gICAgJ2JpZzVoa3Njcyc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5NTAuanNvbicpLmNvbmNhdChyZXF1aXJlKCcuL3RhYmxlcy9iaWc1LWFkZGVkLmpzb24nKSkgfSxcbiAgICAgICAgZW5jb2RlU2tpcFZhbHM6IFsweGEyY2NdLFxuICAgIH0sXG5cbiAgICAnY25iaWc1JzogJ2JpZzVoa3NjcycsXG4gICAgJ2NzYmlnNSc6ICdiaWc1aGtzY3MnLFxuICAgICd4eGJpZzUnOiAnYmlnNWhrc2NzJyxcblxufTtcbiIsIlwidXNlIHN0cmljdFwiXG5cbi8vIFVwZGF0ZSB0aGlzIGFycmF5IGlmIHlvdSBhZGQvcmVuYW1lL3JlbW92ZSBmaWxlcyBpbiB0aGlzIGRpcmVjdG9yeS5cbi8vIFdlIHN1cHBvcnQgQnJvd3NlcmlmeSBieSBza2lwcGluZyBhdXRvbWF0aWMgbW9kdWxlIGRpc2NvdmVyeSBhbmQgcmVxdWlyaW5nIG1vZHVsZXMgZGlyZWN0bHkuXG52YXIgbW9kdWxlcyA9IFtcbiAgICByZXF1aXJlKFwiLi9pbnRlcm5hbFwiKSxcbiAgICByZXF1aXJlKFwiLi91dGYxNlwiKSxcbiAgICByZXF1aXJlKFwiLi91dGY3XCIpLFxuICAgIHJlcXVpcmUoXCIuL3NiY3MtY29kZWNcIiksXG4gICAgcmVxdWlyZShcIi4vc2Jjcy1kYXRhXCIpLFxuICAgIHJlcXVpcmUoXCIuL3NiY3MtZGF0YS1nZW5lcmF0ZWRcIiksXG4gICAgcmVxdWlyZShcIi4vZGJjcy1jb2RlY1wiKSxcbiAgICByZXF1aXJlKFwiLi9kYmNzLWRhdGFcIiksXG5dO1xuXG4vLyBQdXQgYWxsIGVuY29kaW5nL2FsaWFzL2NvZGVjIGRlZmluaXRpb25zIHRvIHNpbmdsZSBvYmplY3QgYW5kIGV4cG9ydCBpdC4gXG5mb3IgKHZhciBpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbW9kdWxlID0gbW9kdWxlc1tpXTtcbiAgICBmb3IgKHZhciBlbmMgaW4gbW9kdWxlKVxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZHVsZSwgZW5jKSlcbiAgICAgICAgICAgIGV4cG9ydHNbZW5jXSA9IG1vZHVsZVtlbmNdO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gRXhwb3J0IE5vZGUuanMgaW50ZXJuYWwgZW5jb2RpbmdzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAvLyBFbmNvZGluZ3NcbiAgICB1dGY4OiAgIHsgdHlwZTogXCJfaW50ZXJuYWxcIiwgYm9tQXdhcmU6IHRydWV9LFxuICAgIGNlc3U4OiAgeyB0eXBlOiBcIl9pbnRlcm5hbFwiLCBib21Bd2FyZTogdHJ1ZX0sXG4gICAgdW5pY29kZTExdXRmODogXCJ1dGY4XCIsXG5cbiAgICB1Y3MyOiAgIHsgdHlwZTogXCJfaW50ZXJuYWxcIiwgYm9tQXdhcmU6IHRydWV9LFxuICAgIHV0ZjE2bGU6IFwidWNzMlwiLFxuXG4gICAgYmluYXJ5OiB7IHR5cGU6IFwiX2ludGVybmFsXCIgfSxcbiAgICBiYXNlNjQ6IHsgdHlwZTogXCJfaW50ZXJuYWxcIiB9LFxuICAgIGhleDogICAgeyB0eXBlOiBcIl9pbnRlcm5hbFwiIH0sXG5cbiAgICAvLyBDb2RlYy5cbiAgICBfaW50ZXJuYWw6IEludGVybmFsQ29kZWMsXG59O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcm5hbENvZGVjKGNvZGVjT3B0aW9ucywgaWNvbnYpIHtcbiAgICB0aGlzLmVuYyA9IGNvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWU7XG4gICAgdGhpcy5ib21Bd2FyZSA9IGNvZGVjT3B0aW9ucy5ib21Bd2FyZTtcblxuICAgIGlmICh0aGlzLmVuYyA9PT0gXCJiYXNlNjRcIilcbiAgICAgICAgdGhpcy5lbmNvZGVyID0gSW50ZXJuYWxFbmNvZGVyQmFzZTY0O1xuICAgIGVsc2UgaWYgKHRoaXMuZW5jID09PSBcImNlc3U4XCIpIHtcbiAgICAgICAgdGhpcy5lbmMgPSBcInV0ZjhcIjsgLy8gVXNlIHV0ZjggZm9yIGRlY29kaW5nLlxuICAgICAgICB0aGlzLmVuY29kZXIgPSBJbnRlcm5hbEVuY29kZXJDZXN1ODtcblxuICAgICAgICAvLyBBZGQgZGVjb2RlciBmb3IgdmVyc2lvbnMgb2YgTm9kZSBub3Qgc3VwcG9ydGluZyBDRVNVLThcbiAgICAgICAgaWYgKG5ldyBCdWZmZXIoXCJlZGEwODBcIiwgJ2hleCcpLnRvU3RyaW5nKCkubGVuZ3RoID09IDMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjb2RlciA9IEludGVybmFsRGVjb2RlckNlc3U4O1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGUgPSBpY29udi5kZWZhdWx0Q2hhclVuaWNvZGU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkludGVybmFsQ29kZWMucHJvdG90eXBlLmVuY29kZXIgPSBJbnRlcm5hbEVuY29kZXI7XG5JbnRlcm5hbENvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gSW50ZXJuYWxEZWNvZGVyO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBXZSB1c2Ugbm9kZS5qcyBpbnRlcm5hbCBkZWNvZGVyLiBJdHMgc2lnbmF0dXJlIGlzIHRoZSBzYW1lIGFzIG91cnMuXG52YXIgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJykuU3RyaW5nRGVjb2RlcjtcblxuaWYgKCFTdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQpIC8vIE5vZGUgdjAuOCBkb2Vzbid0IGhhdmUgdGhpcyBtZXRob2QuXG4gICAgU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7fTtcblxuXG5mdW5jdGlvbiBJbnRlcm5hbERlY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICBTdHJpbmdEZWNvZGVyLmNhbGwodGhpcywgY29kZWMuZW5jKTtcbn1cblxuSW50ZXJuYWxEZWNvZGVyLnByb3RvdHlwZSA9IFN0cmluZ0RlY29kZXIucHJvdG90eXBlO1xuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFbmNvZGVyIGlzIG1vc3RseSB0cml2aWFsXG5cbmZ1bmN0aW9uIEludGVybmFsRW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuZW5jID0gY29kZWMuZW5jO1xufVxuXG5JbnRlcm5hbEVuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3RyLCB0aGlzLmVuYyk7XG59XG5cbkludGVybmFsRW5jb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG59XG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4Y2VwdCBiYXNlNjQgZW5jb2Rlciwgd2hpY2ggbXVzdCBrZWVwIGl0cyBzdGF0ZS5cblxuZnVuY3Rpb24gSW50ZXJuYWxFbmNvZGVyQmFzZTY0KG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgdGhpcy5wcmV2U3RyID0gJyc7XG59XG5cbkludGVybmFsRW5jb2RlckJhc2U2NC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBzdHIgPSB0aGlzLnByZXZTdHIgKyBzdHI7XG4gICAgdmFyIGNvbXBsZXRlUXVhZHMgPSBzdHIubGVuZ3RoIC0gKHN0ci5sZW5ndGggJSA0KTtcbiAgICB0aGlzLnByZXZTdHIgPSBzdHIuc2xpY2UoY29tcGxldGVRdWFkcyk7XG4gICAgc3RyID0gc3RyLnNsaWNlKDAsIGNvbXBsZXRlUXVhZHMpO1xuXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3RyLCBcImJhc2U2NFwiKTtcbn1cblxuSW50ZXJuYWxFbmNvZGVyQmFzZTY0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcih0aGlzLnByZXZTdHIsIFwiYmFzZTY0XCIpO1xufVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDRVNVLTggZW5jb2RlciBpcyBhbHNvIHNwZWNpYWwuXG5cbmZ1bmN0aW9uIEludGVybmFsRW5jb2RlckNlc3U4KG9wdGlvbnMsIGNvZGVjKSB7XG59XG5cbkludGVybmFsRW5jb2RlckNlc3U4LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBidWYgPSBuZXcgQnVmZmVyKHN0ci5sZW5ndGggKiAzKSwgYnVmSWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgLy8gTmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCBpdCB3b3JrcyBiZWNhdXNlIENFU1UtOCBpcyBlc3BlY2lhbGx5IGVhc3lcbiAgICAgICAgLy8gdG8gY29udmVydCBmcm9tIFVURi0xNiAod2hpY2ggYWxsIEpTIHN0cmluZ3MgYXJlIGVuY29kZWQgaW4pLlxuICAgICAgICBpZiAoY2hhckNvZGUgPCAweDgwKVxuICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IGNoYXJDb2RlO1xuICAgICAgICBlbHNlIGlmIChjaGFyQ29kZSA8IDB4ODAwKSB7XG4gICAgICAgICAgICBidWZbYnVmSWR4KytdID0gMHhDMCArIChjaGFyQ29kZSA+Pj4gNik7XG4gICAgICAgICAgICBidWZbYnVmSWR4KytdID0gMHg4MCArIChjaGFyQ29kZSAmIDB4M2YpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBjaGFyQ29kZSB3aWxsIGFsd2F5cyBiZSA8IDB4MTAwMDAgaW4gamF2YXNjcmlwdC5cbiAgICAgICAgICAgIGJ1ZltidWZJZHgrK10gPSAweEUwICsgKGNoYXJDb2RlID4+PiAxMik7XG4gICAgICAgICAgICBidWZbYnVmSWR4KytdID0gMHg4MCArICgoY2hhckNvZGUgPj4+IDYpICYgMHgzZik7XG4gICAgICAgICAgICBidWZbYnVmSWR4KytdID0gMHg4MCArIChjaGFyQ29kZSAmIDB4M2YpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBidWYuc2xpY2UoMCwgYnVmSWR4KTtcbn1cblxuSW50ZXJuYWxFbmNvZGVyQ2VzdTgucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xufVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ0VTVS04IGRlY29kZXIgaXMgbm90IGltcGxlbWVudGVkIGluIE5vZGUgdjQuMCtcblxuZnVuY3Rpb24gSW50ZXJuYWxEZWNvZGVyQ2VzdTgob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmFjYyA9IDA7XG4gICAgdGhpcy5jb250Qnl0ZXMgPSAwO1xuICAgIHRoaXMuYWNjQnl0ZXMgPSAwO1xuICAgIHRoaXMuZGVmYXVsdENoYXJVbmljb2RlID0gY29kZWMuZGVmYXVsdENoYXJVbmljb2RlO1xufVxuXG5JbnRlcm5hbERlY29kZXJDZXN1OC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICB2YXIgYWNjID0gdGhpcy5hY2MsIGNvbnRCeXRlcyA9IHRoaXMuY29udEJ5dGVzLCBhY2NCeXRlcyA9IHRoaXMuYWNjQnl0ZXMsIFxuICAgICAgICByZXMgPSAnJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY3VyQnl0ZSA9IGJ1ZltpXTtcbiAgICAgICAgaWYgKChjdXJCeXRlICYgMHhDMCkgIT09IDB4ODApIHsgLy8gTGVhZGluZyBieXRlXG4gICAgICAgICAgICBpZiAoY29udEJ5dGVzID4gMCkgeyAvLyBQcmV2aW91cyBjb2RlIGlzIGludmFsaWRcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGU7XG4gICAgICAgICAgICAgICAgY29udEJ5dGVzID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1ckJ5dGUgPCAweDgwKSB7IC8vIFNpbmdsZS1ieXRlIGNvZGVcbiAgICAgICAgICAgICAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjdXJCeXRlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyQnl0ZSA8IDB4RTApIHsgLy8gVHdvLWJ5dGUgY29kZVxuICAgICAgICAgICAgICAgIGFjYyA9IGN1ckJ5dGUgJiAweDFGO1xuICAgICAgICAgICAgICAgIGNvbnRCeXRlcyA9IDE7IGFjY0J5dGVzID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyQnl0ZSA8IDB4RjApIHsgLy8gVGhyZWUtYnl0ZSBjb2RlXG4gICAgICAgICAgICAgICAgYWNjID0gY3VyQnl0ZSAmIDB4MEY7XG4gICAgICAgICAgICAgICAgY29udEJ5dGVzID0gMjsgYWNjQnl0ZXMgPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHsgLy8gRm91ciBvciBtb3JlIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBDRVNVLTguXG4gICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBDb250aW51YXRpb24gYnl0ZVxuICAgICAgICAgICAgaWYgKGNvbnRCeXRlcyA+IDApIHsgLy8gV2UncmUgd2FpdGluZyBmb3IgaXQuXG4gICAgICAgICAgICAgICAgYWNjID0gKGFjYyA8PCA2KSB8IChjdXJCeXRlICYgMHgzZik7XG4gICAgICAgICAgICAgICAgY29udEJ5dGVzLS07IGFjY0J5dGVzKys7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRCeXRlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3Igb3ZlcmxvbmcgZW5jb2RpbmcsIGJ1dCBzdXBwb3J0IE1vZGlmaWVkIFVURi04IChlbmNvZGluZyBOVUxMIGFzIEMwIDgwKVxuICAgICAgICAgICAgICAgICAgICBpZiAoYWNjQnl0ZXMgPT09IDIgJiYgYWNjIDwgMHg4MCAmJiBhY2MgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhY2NCeXRlcyA9PT0gMyAmJiBhY2MgPCAweDgwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWN0dWFsbHkgYWRkIGNoYXJhY3Rlci5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFjYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gVW5leHBlY3RlZCBjb250aW51YXRpb24gYnl0ZVxuICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFjYyA9IGFjYzsgdGhpcy5jb250Qnl0ZXMgPSBjb250Qnl0ZXM7IHRoaXMuYWNjQnl0ZXMgPSBhY2NCeXRlcztcbiAgICByZXR1cm4gcmVzO1xufVxuXG5JbnRlcm5hbERlY29kZXJDZXN1OC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IDA7XG4gICAgaWYgKHRoaXMuY29udEJ5dGVzID4gMClcbiAgICAgICAgcmVzICs9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgIHJldHVybiByZXM7XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBTaW5nbGUtYnl0ZSBjb2RlYy4gTmVlZHMgYSAnY2hhcnMnIHN0cmluZyBwYXJhbWV0ZXIgdGhhdCBjb250YWlucyAyNTYgb3IgMTI4IGNoYXJzIHRoYXRcbi8vIGNvcnJlc3BvbmQgdG8gZW5jb2RlZCBieXRlcyAoaWYgMTI4IC0gdGhlbiBsb3dlciBoYWxmIGlzIEFTQ0lJKS4gXG5cbmV4cG9ydHMuX3NiY3MgPSBTQkNTQ29kZWM7XG5mdW5jdGlvbiBTQkNTQ29kZWMoY29kZWNPcHRpb25zLCBpY29udikge1xuICAgIGlmICghY29kZWNPcHRpb25zKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTQkNTIGNvZGVjIGlzIGNhbGxlZCB3aXRob3V0IHRoZSBkYXRhLlwiKVxuICAgIFxuICAgIC8vIFByZXBhcmUgY2hhciBidWZmZXIgZm9yIGRlY29kaW5nLlxuICAgIGlmICghY29kZWNPcHRpb25zLmNoYXJzIHx8IChjb2RlY09wdGlvbnMuY2hhcnMubGVuZ3RoICE9PSAxMjggJiYgY29kZWNPcHRpb25zLmNoYXJzLmxlbmd0aCAhPT0gMjU2KSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5jb2RpbmcgJ1wiK2NvZGVjT3B0aW9ucy50eXBlK1wiJyBoYXMgaW5jb3JyZWN0ICdjaGFycycgKG11c3QgYmUgb2YgbGVuIDEyOCBvciAyNTYpXCIpO1xuICAgIFxuICAgIGlmIChjb2RlY09wdGlvbnMuY2hhcnMubGVuZ3RoID09PSAxMjgpIHtcbiAgICAgICAgdmFyIGFzY2lpU3RyaW5nID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMjg7IGkrKylcbiAgICAgICAgICAgIGFzY2lpU3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAgICAgIGNvZGVjT3B0aW9ucy5jaGFycyA9IGFzY2lpU3RyaW5nICsgY29kZWNPcHRpb25zLmNoYXJzO1xuICAgIH1cblxuICAgIHRoaXMuZGVjb2RlQnVmID0gbmV3IEJ1ZmZlcihjb2RlY09wdGlvbnMuY2hhcnMsICd1Y3MyJyk7XG4gICAgXG4gICAgLy8gRW5jb2RpbmcgYnVmZmVyLlxuICAgIHZhciBlbmNvZGVCdWYgPSBuZXcgQnVmZmVyKDY1NTM2KTtcbiAgICBlbmNvZGVCdWYuZmlsbChpY29udi5kZWZhdWx0Q2hhclNpbmdsZUJ5dGUuY2hhckNvZGVBdCgwKSk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvZGVjT3B0aW9ucy5jaGFycy5sZW5ndGg7IGkrKylcbiAgICAgICAgZW5jb2RlQnVmW2NvZGVjT3B0aW9ucy5jaGFycy5jaGFyQ29kZUF0KGkpXSA9IGk7XG5cbiAgICB0aGlzLmVuY29kZUJ1ZiA9IGVuY29kZUJ1Zjtcbn1cblxuU0JDU0NvZGVjLnByb3RvdHlwZS5lbmNvZGVyID0gU0JDU0VuY29kZXI7XG5TQkNTQ29kZWMucHJvdG90eXBlLmRlY29kZXIgPSBTQkNTRGVjb2RlcjtcblxuXG5mdW5jdGlvbiBTQkNTRW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuZW5jb2RlQnVmID0gY29kZWMuZW5jb2RlQnVmO1xufVxuXG5TQkNTRW5jb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdHIubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKylcbiAgICAgICAgYnVmW2ldID0gdGhpcy5lbmNvZGVCdWZbc3RyLmNoYXJDb2RlQXQoaSldO1xuICAgIFxuICAgIHJldHVybiBidWY7XG59XG5cblNCQ1NFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cblxuXG5mdW5jdGlvbiBTQkNTRGVjb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuZGVjb2RlQnVmID0gY29kZWMuZGVjb2RlQnVmO1xufVxuXG5TQkNTRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICAvLyBTdHJpbmdzIGFyZSBpbW11dGFibGUgaW4gSlMgLT4gd2UgdXNlIHVjczIgYnVmZmVyIHRvIHNwZWVkIHVwIGNvbXB1dGF0aW9ucy5cbiAgICB2YXIgZGVjb2RlQnVmID0gdGhpcy5kZWNvZGVCdWY7XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoYnVmLmxlbmd0aCoyKTtcbiAgICB2YXIgaWR4MSA9IDAsIGlkeDIgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlkeDEgPSBidWZbaV0qMjsgaWR4MiA9IGkqMjtcbiAgICAgICAgbmV3QnVmW2lkeDJdID0gZGVjb2RlQnVmW2lkeDFdO1xuICAgICAgICBuZXdCdWZbaWR4MisxXSA9IGRlY29kZUJ1ZltpZHgxKzFdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmLnRvU3RyaW5nKCd1Y3MyJyk7XG59XG5cblNCQ1NEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbi8vIEdlbmVyYXRlZCBkYXRhIGZvciBzYmNzIGNvZGVjLiBEb24ndCBlZGl0IG1hbnVhbGx5LiBSZWdlbmVyYXRlIHVzaW5nIGdlbmVyYXRpb24vZ2VuLXNiY3MuanMgc2NyaXB0LlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwiNDM3XCI6IFwiY3A0MzdcIixcbiAgXCI3MzdcIjogXCJjcDczN1wiLFxuICBcIjc3NVwiOiBcImNwNzc1XCIsXG4gIFwiODUwXCI6IFwiY3A4NTBcIixcbiAgXCI4NTJcIjogXCJjcDg1MlwiLFxuICBcIjg1NVwiOiBcImNwODU1XCIsXG4gIFwiODU2XCI6IFwiY3A4NTZcIixcbiAgXCI4NTdcIjogXCJjcDg1N1wiLFxuICBcIjg1OFwiOiBcImNwODU4XCIsXG4gIFwiODYwXCI6IFwiY3A4NjBcIixcbiAgXCI4NjFcIjogXCJjcDg2MVwiLFxuICBcIjg2MlwiOiBcImNwODYyXCIsXG4gIFwiODYzXCI6IFwiY3A4NjNcIixcbiAgXCI4NjRcIjogXCJjcDg2NFwiLFxuICBcIjg2NVwiOiBcImNwODY1XCIsXG4gIFwiODY2XCI6IFwiY3A4NjZcIixcbiAgXCI4NjlcIjogXCJjcDg2OVwiLFxuICBcIjg3NFwiOiBcIndpbmRvd3M4NzRcIixcbiAgXCI5MjJcIjogXCJjcDkyMlwiLFxuICBcIjEwNDZcIjogXCJjcDEwNDZcIixcbiAgXCIxMTI0XCI6IFwiY3AxMTI0XCIsXG4gIFwiMTEyNVwiOiBcImNwMTEyNVwiLFxuICBcIjExMjlcIjogXCJjcDExMjlcIixcbiAgXCIxMTMzXCI6IFwiY3AxMTMzXCIsXG4gIFwiMTE2MVwiOiBcImNwMTE2MVwiLFxuICBcIjExNjJcIjogXCJjcDExNjJcIixcbiAgXCIxMTYzXCI6IFwiY3AxMTYzXCIsXG4gIFwiMTI1MFwiOiBcIndpbmRvd3MxMjUwXCIsXG4gIFwiMTI1MVwiOiBcIndpbmRvd3MxMjUxXCIsXG4gIFwiMTI1MlwiOiBcIndpbmRvd3MxMjUyXCIsXG4gIFwiMTI1M1wiOiBcIndpbmRvd3MxMjUzXCIsXG4gIFwiMTI1NFwiOiBcIndpbmRvd3MxMjU0XCIsXG4gIFwiMTI1NVwiOiBcIndpbmRvd3MxMjU1XCIsXG4gIFwiMTI1NlwiOiBcIndpbmRvd3MxMjU2XCIsXG4gIFwiMTI1N1wiOiBcIndpbmRvd3MxMjU3XCIsXG4gIFwiMTI1OFwiOiBcIndpbmRvd3MxMjU4XCIsXG4gIFwiMjg1OTFcIjogXCJpc284ODU5MVwiLFxuICBcIjI4NTkyXCI6IFwiaXNvODg1OTJcIixcbiAgXCIyODU5M1wiOiBcImlzbzg4NTkzXCIsXG4gIFwiMjg1OTRcIjogXCJpc284ODU5NFwiLFxuICBcIjI4NTk1XCI6IFwiaXNvODg1OTVcIixcbiAgXCIyODU5NlwiOiBcImlzbzg4NTk2XCIsXG4gIFwiMjg1OTdcIjogXCJpc284ODU5N1wiLFxuICBcIjI4NTk4XCI6IFwiaXNvODg1OThcIixcbiAgXCIyODU5OVwiOiBcImlzbzg4NTk5XCIsXG4gIFwiMjg2MDBcIjogXCJpc284ODU5MTBcIixcbiAgXCIyODYwMVwiOiBcImlzbzg4NTkxMVwiLFxuICBcIjI4NjAzXCI6IFwiaXNvODg1OTEzXCIsXG4gIFwiMjg2MDRcIjogXCJpc284ODU5MTRcIixcbiAgXCIyODYwNVwiOiBcImlzbzg4NTkxNVwiLFxuICBcIjI4NjA2XCI6IFwiaXNvODg1OTE2XCIsXG4gIFwid2luZG93czg3NFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+977+977+977+94oCm77+977+977+977+977+977+977+977+977+977+977+94oCY4oCZ4oCc4oCd4oCi4oCT4oCU77+977+977+977+977+977+977+977+9wqDguIHguILguIPguITguIXguIbguIfguIjguInguIrguIvguIzguI3guI7guI/guJDguJHguJLguJPguJTguJXguJbguJfguJjguJnguJrguJvguJzguJ3guJ7guJ/guKDguKHguKLguKPguKTguKXguKbguKfguKjguKnguKrguKvguKzguK3guK7guK/guLDguLHguLLguLPguLTguLXguLbguLfguLjguLnguLrvv73vv73vv73vv73guL/guYDguYHguYLguYPguYTguYXguYbguYfguYjguYnguYrguYvguYzguY3guY7guY/guZDguZHguZLguZPguZTguZXguZbguZfguZjguZnguZrguZvvv73vv73vv73vv71cIlxuICB9LFxuICBcIndpbjg3NFwiOiBcIndpbmRvd3M4NzRcIixcbiAgXCJjcDg3NFwiOiBcIndpbmRvd3M4NzRcIixcbiAgXCJ3aW5kb3dzMTI1MFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCa77+94oCe4oCm4oCg4oCh77+94oCwxaDigLnFmsWkxb3Fue+/veKAmOKAmeKAnOKAneKAouKAk+KAlO+/veKEosWh4oC6xZvFpcW+xbrCoMuHy5jFgcKkxITCpsKnwqjCqcWewqvCrMKtwq7Fu8KwwrHLm8WCwrTCtcK2wrfCuMSFxZ/Cu8S9y53EvsW8xZTDgcOCxILDhMS5xIbDh8SMw4nEmMOLxJrDjcOOxI7EkMWDxYfDk8OUxZDDlsOXxZjFrsOaxbDDnMOdxaLDn8WVw6HDosSDw6TEusSHw6fEjcOpxJnDq8Sbw63DrsSPxJHFhMWIw7PDtMWRw7bDt8WZxa/DusWxw7zDvcWjy5lcIlxuICB9LFxuICBcIndpbjEyNTBcIjogXCJ3aW5kb3dzMTI1MFwiLFxuICBcImNwMTI1MFwiOiBcIndpbmRvd3MxMjUwXCIsXG4gIFwid2luZG93czEyNTFcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItCC0IPigJrRk+KAnuKApuKAoOKAoeKCrOKAsNCJ4oC50IrQjNCL0I/RkuKAmOKAmeKAnOKAneKAouKAk+KAlO+/veKEotGZ4oC60ZrRnNGb0Z/CoNCO0Z7QiMKk0pDCpsKn0IHCqdCEwqvCrMKtwq7Qh8KwwrHQhtGW0pHCtcK2wrfRkeKEltGUwrvRmNCF0ZXRl9CQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv9GA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGPXCJcbiAgfSxcbiAgXCJ3aW4xMjUxXCI6IFwid2luZG93czEyNTFcIixcbiAgXCJjcDEyNTFcIjogXCJ3aW5kb3dzMTI1MVwiLFxuICBcIndpbmRvd3MxMjUyXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLigqzvv73igJrGkuKAnuKApuKAoOKAocuG4oCwxaDigLnFku+/vcW977+977+94oCY4oCZ4oCc4oCd4oCi4oCT4oCUy5zihKLFoeKAusWT77+9xb7FuMKgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnCusK7wrzCvcK+wr/DgMOBw4LDg8OEw4XDhsOHw4jDicOKw4vDjMONw47Dj8OQw5HDksOTw5TDlcOWw5fDmMOZw5rDm8Ocw53DnsOfw6DDocOiw6PDpMOlw6bDp8Oow6nDqsOrw6zDrcOuw6/DsMOxw7LDs8O0w7XDtsO3w7jDucO6w7vDvMO9w77Dv1wiXG4gIH0sXG4gIFwid2luMTI1MlwiOiBcIndpbmRvd3MxMjUyXCIsXG4gIFwiY3AxMjUyXCI6IFwid2luZG93czEyNTJcIixcbiAgXCJ3aW5kb3dzMTI1M1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCaxpLigJ7igKbigKDigKHvv73igLDvv73igLnvv73vv73vv73vv73vv73igJjigJnigJzigJ3igKLigJPigJTvv73ihKLvv73igLrvv73vv73vv73vv73CoM6FzobCo8KkwqXCpsKnwqjCqe+/vcKrwqzCrcKu4oCVwrDCscKywrPOhMK1wrbCt86IzonOisK7zozCvc6Ozo/OkM6RzpLOk86UzpXOls6XzpjOmc6azpvOnM6dzp7On86gzqHvv73Oo86kzqXOps6nzqjOqc6qzqvOrM6tzq7Or86wzrHOss6zzrTOtc62zrfOuM65zrrOu868zr3Ovs6/z4DPgc+Cz4PPhM+Fz4bPh8+Iz4nPis+Lz4zPjc+O77+9XCJcbiAgfSxcbiAgXCJ3aW4xMjUzXCI6IFwid2luZG93czEyNTNcIixcbiAgXCJjcDEyNTNcIjogXCJ3aW5kb3dzMTI1M1wiLFxuICBcIndpbmRvd3MxMjU0XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLigqzvv73igJrGkuKAnuKApuKAoOKAocuG4oCwxaDigLnFku+/ve+/ve+/ve+/veKAmOKAmeKAnOKAneKAouKAk+KAlMuc4oSixaHigLrFk++/ve+/vcW4wqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv8OAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPxJ7DkcOSw5PDlMOVw5bDl8OYw5nDmsObw5zEsMWew5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8Sfw7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8xLHFn8O/XCJcbiAgfSxcbiAgXCJ3aW4xMjU0XCI6IFwid2luZG93czEyNTRcIixcbiAgXCJjcDEyNTRcIjogXCJ3aW5kb3dzMTI1NFwiLFxuICBcIndpbmRvd3MxMjU1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLigqzvv73igJrGkuKAnuKApuKAoOKAocuG4oCw77+94oC577+977+977+977+977+94oCY4oCZ4oCc4oCd4oCi4oCT4oCUy5zihKLvv73igLrvv73vv73vv73vv73CoMKhwqLCo+KCqsKlwqbCp8KowqnDl8KrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucO3wrvCvMK9wr7Cv9aw1rHWstaz1rTWtda21rfWuNa577+91rvWvNa91r7Wv9eA14HXgteD17DXsdey17PXtO+/ve+/ve+/ve+/ve+/ve+/ve+/vdeQ15HXkteT15TXldeW15fXmNeZ15rXm9ec153Xntef16DXodei16PXpNel16bXp9eo16nXqu+/ve+/veKAjuKAj++/vVwiXG4gIH0sXG4gIFwid2luMTI1NVwiOiBcIndpbmRvd3MxMjU1XCIsXG4gIFwiY3AxMjU1XCI6IFwid2luZG93czEyNTVcIixcbiAgXCJ3aW5kb3dzMTI1NlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs2b7igJrGkuKAnuKApuKAoOKAocuG4oCw2bnigLnFktqG2pjaiNqv4oCY4oCZ4oCc4oCd4oCi4oCT4oCU2qnihKLakeKAusWT4oCM4oCN2rrCoNiMwqLCo8KkwqXCpsKnwqjCqdq+wqvCrMKtwq7Cr8KwwrHCssKzwrTCtcK2wrfCuMK52JvCu8K8wr3Cvtif24HYodii2KPYpNil2KbYp9io2KnYqtir2KzYrdiu2K/YsNix2LLYs9i02LXYtsOX2LfYuNi52LrZgNmB2YLZg8Og2YTDotmF2YbZh9mIw6fDqMOpw6rDq9mJ2YrDrsOv2YvZjNmN2Y7DtNmP2ZDDt9mRw7nZksO7w7zigI7igI/bklwiXG4gIH0sXG4gIFwid2luMTI1NlwiOiBcIndpbmRvd3MxMjU2XCIsXG4gIFwiY3AxMjU2XCI6IFwid2luZG93czEyNTZcIixcbiAgXCJ3aW5kb3dzMTI1N1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCa77+94oCe4oCm4oCg4oCh77+94oCw77+94oC577+9wqjLh8K477+94oCY4oCZ4oCc4oCd4oCi4oCT4oCU77+94oSi77+94oC677+9wq/Lm++/vcKg77+9wqLCo8Kk77+9wqbCp8OYwqnFlsKrwqzCrcKuw4bCsMKxwrLCs8K0wrXCtsK3w7jCucWXwrvCvMK9wr7DpsSExK7EgMSGw4TDhcSYxJLEjMOJxbnElsSixLbEqsS7xaDFg8WFw5PFjMOVw5bDl8WyxYHFmsWqw5zFu8W9w5/EhcSvxIHEh8Okw6XEmcSTxI3DqcW6xJfEo8S3xKvEvMWhxYTFhsOzxY3DtcO2w7fFs8WCxZvFq8O8xbzFvsuZXCJcbiAgfSxcbiAgXCJ3aW4xMjU3XCI6IFwid2luZG93czEyNTdcIixcbiAgXCJjcDEyNTdcIjogXCJ3aW5kb3dzMTI1N1wiLFxuICBcIndpbmRvd3MxMjU4XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLigqzvv73igJrGkuKAnuKApuKAoOKAocuG4oCw77+94oC5xZLvv73vv73vv73vv73igJjigJnigJzigJ3igKLigJPigJTLnOKEou+/veKAusWT77+977+9xbjCoMKhwqLCo8KkwqXCpsKnwqjCqcKqwqvCrMKtwq7Cr8KwwrHCssKzwrTCtcK2wrfCuMK5wrrCu8K8wr3CvsK/w4DDgcOCxILDhMOFw4bDh8OIw4nDisOLzIDDjcOOw4/EkMORzInDk8OUxqDDlsOXw5jDmcOaw5vDnMavzIPDn8Ogw6HDosSDw6TDpcOmw6fDqMOpw6rDq8yBw63DrsOvxJHDscyjw7PDtMahw7bDt8O4w7nDusO7w7zGsOKCq8O/XCJcbiAgfSxcbiAgXCJ3aW4xMjU4XCI6IFwid2luZG93czEyNThcIixcbiAgXCJjcDEyNThcIjogXCJ3aW5kb3dzMTI1OFwiLFxuICBcImlzbzg4NTkxXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv8OAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPw5DDkcOSw5PDlMOVw5bDl8OYw5nDmsObw5zDncOew5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8Oww7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8w73DvsO/XCJcbiAgfSxcbiAgXCJjcDI4NTkxXCI6IFwiaXNvODg1OTFcIixcbiAgXCJpc284ODU5MlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgxITLmMWBwqTEvcWawqfCqMWgxZ7FpMW5wq3FvcW7wrDEhcubxYLCtMS+xZvLh8K4xaHFn8WlxbrLncW+xbzFlMOBw4LEgsOExLnEhsOHxIzDicSYw4vEmsONw47EjsSQxYPFh8OTw5TFkMOWw5fFmMWuw5rFsMOcw53FosOfxZXDocOixIPDpMS6xIfDp8SNw6nEmcOrxJvDrcOuxI/EkcWExYjDs8O0xZHDtsO3xZnFr8O6xbHDvMO9xaPLmVwiXG4gIH0sXG4gIFwiY3AyODU5MlwiOiBcImlzbzg4NTkyXCIsXG4gIFwiaXNvODg1OTNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMSmy5jCo8Kk77+9xKTCp8KoxLDFnsSexLTCre+/vcW7wrDEp8KywrPCtMK1xKXCt8K4xLHFn8SfxLXCve+/vcW8w4DDgcOC77+9w4TEisSIw4fDiMOJw4rDi8OMw43DjsOP77+9w5HDksOTw5TEoMOWw5fEnMOZw5rDm8OcxazFnMOfw6DDocOi77+9w6TEi8SJw6fDqMOpw6rDq8Osw63DrsOv77+9w7HDssOzw7TEocO2w7fEncO5w7rDu8O8xa3FncuZXCJcbiAgfSxcbiAgXCJjcDI4NTkzXCI6IFwiaXNvODg1OTNcIixcbiAgXCJpc284ODU5NFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgxITEuMWWwqTEqMS7wqfCqMWgxJLEosWmwq3FvcKvwrDEhcubxZfCtMSpxLzLh8K4xaHEk8SjxafFisW+xYvEgMOBw4LDg8OEw4XDhsSuxIzDicSYw4vElsONw47EqsSQxYXFjMS2w5TDlcOWw5fDmMWyw5rDm8OcxajFqsOfxIHDocOiw6PDpMOlw6bEr8SNw6nEmcOrxJfDrcOuxKvEkcWGxY3Et8O0w7XDtsO3w7jFs8O6w7vDvMWpxavLmVwiXG4gIH0sXG4gIFwiY3AyODU5NFwiOiBcImlzbzg4NTk0XCIsXG4gIFwiaXNvODg1OTVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoNCB0ILQg9CE0IXQhtCH0IjQidCK0IvQjMKt0I7Qj9CQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv9GA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGP4oSW0ZHRktGT0ZTRldGW0ZfRmNGZ0ZrRm9GcwqfRntGfXCJcbiAgfSxcbiAgXCJjcDI4NTk1XCI6IFwiaXNvODg1OTVcIixcbiAgXCJpc284ODU5NlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kg77+977+977+9wqTvv73vv73vv73vv73vv73vv73vv73YjMKt77+977+977+977+977+977+977+977+977+977+977+977+977+92Jvvv73vv73vv73Yn++/vdih2KLYo9ik2KXYptin2KjYqdiq2KvYrNit2K7Yr9iw2LHYstiz2LTYtdi22LfYuNi52Lrvv73vv73vv73vv73vv73ZgNmB2YLZg9mE2YXZhtmH2YjZidmK2YvZjNmN2Y7Zj9mQ2ZHZku+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwiY3AyODU5NlwiOiBcImlzbzg4NTk2XCIsXG4gIFwiaXNvODg1OTdcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoOKAmOKAmcKj4oKs4oKvwqbCp8KowqnNusKrwqzCre+/veKAlcKwwrHCssKzzoTOhc6GwrfOiM6JzorCu86Mwr3Ojs6PzpDOkc6SzpPOlM6VzpbOl86YzpnOms6bzpzOnc6ezp/OoM6h77+9zqPOpM6lzqbOp86ozqnOqs6rzqzOrc6uzq/OsM6xzrLOs860zrXOts63zrjOuc66zrvOvM69zr7Ov8+Az4HPgs+Dz4TPhc+Gz4fPiM+Jz4rPi8+Mz43Pju+/vVwiXG4gIH0sXG4gIFwiY3AyODU5N1wiOiBcImlzbzg4NTk3XCIsXG4gIFwiaXNvODg1OThcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoO+/vcKiwqPCpMKlwqbCp8KowqnDl8KrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucO3wrvCvMK9wr7vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73igJfXkNeR15LXk9eU15XXlteX15jXmdea15vXnNed157Xn9eg16HXotej16TXpdem16fXqNep16rvv73vv73igI7igI/vv71cIlxuICB9LFxuICBcImNwMjg1OThcIjogXCJpc284ODU5OFwiLFxuICBcImlzbzg4NTk5XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv8OAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPxJ7DkcOSw5PDlMOVw5bDl8OYw5nDmsObw5zEsMWew5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8Sfw7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8xLHFn8O/XCJcbiAgfSxcbiAgXCJjcDI4NTk5XCI6IFwiaXNvODg1OTlcIixcbiAgXCJpc284ODU5MTBcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMSExJLEosSqxKjEtsKnxLvEkMWgxabFvcKtxarFisKwxIXEk8SjxKvEqcS3wrfEvMSRxaHFp8W+4oCVxavFi8SAw4HDgsODw4TDhcOGxK7EjMOJxJjDi8SWw43DjsOPw5DFhcWMw5PDlMOVw5bFqMOYxbLDmsObw5zDncOew5/EgcOhw6LDo8Okw6XDpsSvxI3DqcSZw6vEl8Otw67Dr8OwxYbFjcOzw7TDtcO2xanDuMWzw7rDu8O8w73DvsS4XCJcbiAgfSxcbiAgXCJjcDI4NjAwXCI6IFwiaXNvODg1OTEwXCIsXG4gIFwiaXNvODg1OTExXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDguIHguILguIPguITguIXguIbguIfguIjguInguIrguIvguIzguI3guI7guI/guJDguJHguJLguJPguJTguJXguJbguJfguJjguJnguJrguJvguJzguJ3guJ7guJ/guKDguKHguKLguKPguKTguKXguKbguKfguKjguKnguKrguKvguKzguK3guK7guK/guLDguLHguLLguLPguLTguLXguLbguLfguLjguLnguLrvv73vv73vv73vv73guL/guYDguYHguYLguYPguYTguYXguYbguYfguYjguYnguYrguYvguYzguY3guY7guY/guZDguZHguZLguZPguZTguZXguZbguZfguZjguZnguZrguZvvv73vv73vv73vv71cIlxuICB9LFxuICBcImNwMjg2MDFcIjogXCJpc284ODU5MTFcIixcbiAgXCJpc284ODU5MTNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoOKAncKiwqPCpOKAnsKmwqfDmMKpxZbCq8Kswq3CrsOGwrDCscKywrPigJzCtcK2wrfDuMK5xZfCu8K8wr3CvsOmxITErsSAxIbDhMOFxJjEksSMw4nFucSWxKLEtsSqxLvFoMWDxYXDk8WMw5XDlsOXxbLFgcWaxarDnMW7xb3Dn8SFxK/EgcSHw6TDpcSZxJPEjcOpxbrEl8SjxLfEq8S8xaHFhMWGw7PFjcO1w7bDt8WzxYLFm8Wrw7zFvMW+4oCZXCJcbiAgfSxcbiAgXCJjcDI4NjAzXCI6IFwiaXNvODg1OTEzXCIsXG4gIFwiaXNvODg1OTE0XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDhuILhuIPCo8SKxIvhuIrCp+G6gMKp4bqC4biL4buywq3CrsW44bie4bifxKDEoeG5gOG5gcK24bmW4bqB4bmX4bqD4bmg4buz4bqE4bqF4bmhw4DDgcOCw4PDhMOFw4bDh8OIw4nDisOLw4zDjcOOw4/FtMORw5LDk8OUw5XDluG5qsOYw5nDmsObw5zDncW2w5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8W1w7HDssOzw7TDtcO24bmrw7jDucO6w7vDvMO9xbfDv1wiXG4gIH0sXG4gIFwiY3AyODYwNFwiOiBcImlzbzg4NTkxNFwiLFxuICBcImlzbzg4NTkxNVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKj4oKswqXFoMKnxaHCqcKqwqvCrMKtwq7Cr8KwwrHCssKzxb3CtcK2wrfFvsK5wrrCu8WSxZPFuMK/w4DDgcOCw4PDhMOFw4bDh8OIw4nDisOLw4zDjcOOw4/DkMORw5LDk8OUw5XDlsOXw5jDmcOaw5vDnMOdw57Dn8Ogw6HDosOjw6TDpcOmw6fDqMOpw6rDq8Osw63DrsOvw7DDscOyw7PDtMO1w7bDt8O4w7nDusO7w7zDvcO+w79cIlxuICB9LFxuICBcImNwMjg2MDVcIjogXCJpc284ODU5MTVcIixcbiAgXCJpc284ODU5MTZcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMSExIXFgeKCrOKAnsWgwqfFocKpyJjCq8W5wq3FusW7wrDCscSMxYLFveKAncK2wrfFvsSNyJnCu8WSxZPFuMW8w4DDgcOCxILDhMSGw4bDh8OIw4nDisOLw4zDjcOOw4/EkMWDw5LDk8OUxZDDlsWaxbDDmcOaw5vDnMSYyJrDn8Ogw6HDosSDw6TEh8Omw6fDqMOpw6rDq8Osw63DrsOvxJHFhMOyw7PDtMWRw7bFm8Wxw7nDusO7w7zEmcibw79cIlxuICB9LFxuICBcImNwMjg2MDZcIjogXCJpc284ODU5MTZcIixcbiAgXCJjcDQzN1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDpMOgw6XDp8Oqw6vDqMOvw67DrMOEw4XDicOmw4bDtMO2w7LDu8O5w7/DlsOcwqLCo8Kl4oKnxpLDocOtw7PDusOxw5HCqsK6wr/ijJDCrMK9wrzCocKrwrvilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDOscOfzpPPgM6jz4PCtc+EzqbOmM6pzrTiiJ7Phs614oip4omhwrHiiaXiiaTijKDijKHDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm00MzdcIjogXCJjcDQzN1wiLFxuICBcImNzaWJtNDM3XCI6IFwiY3A0MzdcIixcbiAgXCJjcDczN1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwizpHOks6TzpTOlc6WzpfOmM6ZzprOm86czp3Ons6fzqDOoc6jzqTOpc6mzqfOqM6pzrHOss6zzrTOtc62zrfOuM65zrrOu868zr3Ovs6/z4DPgc+Dz4LPhM+Fz4bPh8+I4paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAz4nOrM6tzq7Pis6vz4zPjc+Lz47Ohs6IzonOis6Mzo7Oj8Kx4oml4omkzqrOq8O34omIwrDiiJnCt+KImuKBv8Ky4pagwqBcIlxuICB9LFxuICBcImlibTczN1wiOiBcImNwNzM3XCIsXG4gIFwiY3NpYm03MzdcIjogXCJjcDczN1wiLFxuICBcImNwNzc1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLEhsO8w6nEgcOkxKPDpcSHxYLEk8WWxZfEq8W5w4TDhcOJw6bDhsWNw7bEosKixZrFm8OWw5zDuMKjw5jDl8KkxIDEqsOzxbvFvMW64oCdwqbCqcKuwqzCvcK8xYHCq8K74paR4paS4paT4pSC4pSkxITEjMSYxJbilaPilZHilZfilZ3ErsWg4pSQ4pSU4pS04pSs4pSc4pSA4pS8xbLFquKVmuKVlOKVqeKVpuKVoOKVkOKVrMW9xIXEjcSZxJfEr8WhxbPFq8W+4pSY4pSM4paI4paE4paM4paQ4paAw5PDn8WMxYPDtcOVwrXFhMS2xLfEu8S8xYbEksWF4oCZwq3CseKAnMK+wrbCp8O34oCewrDiiJnCt8K5wrPCsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm03NzVcIjogXCJjcDc3NVwiLFxuICBcImNzaWJtNzc1XCI6IFwiY3A3NzVcIixcbiAgXCJjcDg1MFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDpMOgw6XDp8Oqw6vDqMOvw67DrMOEw4XDicOmw4bDtMO2w7LDu8O5w7/DlsOcw7jCo8OYw5fGksOhw63Ds8O6w7HDkcKqwrrCv8KuwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSkw4HDgsOAwqnilaPilZHilZfilZ3CosKl4pSQ4pSU4pS04pSs4pSc4pSA4pS8w6PDg+KVmuKVlOKVqeKVpuKVoOKVkOKVrMKkw7DDkMOKw4vDiMSxw43DjsOP4pSY4pSM4paI4paEwqbDjOKWgMOTw5/DlMOSw7XDlcK1w77DnsOaw5vDmcO9w53Cr8K0wq3CseKAl8K+wrbCp8O3wrjCsMKowrfCucKzwrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODUwXCI6IFwiY3A4NTBcIixcbiAgXCJjc2libTg1MFwiOiBcImNwODUwXCIsXG4gIFwiY3A4NTJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6TFr8SHw6fFgsOrxZDFkcOuxbnDhMSGw4nEucS6w7TDtsS9xL7FmsWbw5bDnMWkxaXFgcOXxI3DocOtw7PDusSExIXFvcW+xJjEmcKsxbrEjMWfwqvCu+KWkeKWkuKWk+KUguKUpMOBw4LEmsWe4pWj4pWR4pWX4pWdxbvFvOKUkOKUlOKUtOKUrOKUnOKUgOKUvMSCxIPilZrilZTilanilabilaDilZDilazCpMSRxJDEjsOLxI/Fh8ONw47Em+KUmOKUjOKWiOKWhMWixa7iloDDk8Ofw5TFg8WExYjFoMWhxZTDmsWVxbDDvcOdxaPCtMKty53Lm8uHy5jCp8O3wrjCsMKoy5nFscWYxZnilqDCoFwiXG4gIH0sXG4gIFwiaWJtODUyXCI6IFwiY3A4NTJcIixcbiAgXCJjc2libTg1MlwiOiBcImNwODUyXCIsXG4gIFwiY3A4NTVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItGS0ILRk9CD0ZHQgdGU0ITRldCF0ZbQhtGX0IfRmNCI0ZnQidGa0IrRm9CL0ZzQjNGe0I7Rn9CP0Y7QrtGK0KrQsNCQ0LHQkdGG0KbQtNCU0LXQldGE0KTQs9CTwqvCu+KWkeKWkuKWk+KUguKUpNGF0KXQuNCY4pWj4pWR4pWX4pWd0LnQmeKUkOKUlOKUtOKUrOKUnOKUgOKUvNC60JrilZrilZTilanilabilaDilZDilazCpNC70JvQvNCc0L3QndC+0J7Qv+KUmOKUjOKWiOKWhNCf0Y/iloDQr9GA0KDRgdCh0YLQotGD0KPQttCW0LLQktGM0KzihJbCrdGL0KvQt9CX0YjQqNGN0K3RidCp0YfQp8Kn4pagwqBcIlxuICB9LFxuICBcImlibTg1NVwiOiBcImNwODU1XCIsXG4gIFwiY3NpYm04NTVcIjogXCJjcDg1NVwiLFxuICBcImNwODU2XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLXkNeR15LXk9eU15XXlteX15jXmdea15vXnNed157Xn9eg16HXotej16TXpdem16fXqNep16rvv73Co++/vcOX77+977+977+977+977+977+977+977+977+977+9wq7CrMK9wrzvv73Cq8K74paR4paS4paT4pSC4pSk77+977+977+9wqnilaPilZHilZfilZ3CosKl4pSQ4pSU4pS04pSs4pSc4pSA4pS877+977+94pWa4pWU4pWp4pWm4pWg4pWQ4pWswqTvv73vv73vv73vv73vv73vv73vv73vv73vv73ilJjilIzilojiloTCpu+/veKWgO+/ve+/ve+/ve+/ve+/ve+/vcK177+977+977+977+977+977+977+9wq/CtMKtwrHigJfCvsK2wqfDt8K4wrDCqMK3wrnCs8Ky4pagwqBcIlxuICB9LFxuICBcImlibTg1NlwiOiBcImNwODU2XCIsXG4gIFwiY3NpYm04NTZcIjogXCJjcDg1NlwiLFxuICBcImNwODU3XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDh8O8w6nDosOkw6DDpcOnw6rDq8Oow6/DrsSxw4TDhcOJw6bDhsO0w7bDssO7w7nEsMOWw5zDuMKjw5jFnsWfw6HDrcOzw7rDscORxJ7En8K/wq7CrMK9wrzCocKrwrvilpHilpLilpPilILilKTDgcOCw4DCqeKVo+KVkeKVl+KVncKiwqXilJDilJTilLTilKzilJzilIDilLzDo8OD4pWa4pWU4pWp4pWm4pWg4pWQ4pWswqTCusKqw4rDi8OI77+9w43DjsOP4pSY4pSM4paI4paEwqbDjOKWgMOTw5/DlMOSw7XDlcK177+9w5fDmsObw5nDrMO/wq/CtMKtwrHvv73CvsK2wqfDt8K4wrDCqMK3wrnCs8Ky4pagwqBcIlxuICB9LFxuICBcImlibTg1N1wiOiBcImNwODU3XCIsXG4gIFwiY3NpYm04NTdcIjogXCJjcDg1N1wiLFxuICBcImNwODU4XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDh8O8w6nDosOkw6DDpcOnw6rDq8Oow6/DrsOsw4TDhcOJw6bDhsO0w7bDssO7w7nDv8OWw5zDuMKjw5jDl8aSw6HDrcOzw7rDscORwqrCusK/wq7CrMK9wrzCocKrwrvilpHilpLilpPilILilKTDgcOCw4DCqeKVo+KVkeKVl+KVncKiwqXilJDilJTilLTilKzilJzilIDilLzDo8OD4pWa4pWU4pWp4pWm4pWg4pWQ4pWswqTDsMOQw4rDi8OI4oKsw43DjsOP4pSY4pSM4paI4paEwqbDjOKWgMOTw5/DlMOSw7XDlcK1w77DnsOaw5vDmcO9w53Cr8K0wq3CseKAl8K+wrbCp8O3wrjCsMKowrfCucKzwrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODU4XCI6IFwiY3A4NThcIixcbiAgXCJjc2libTg1OFwiOiBcImNwODU4XCIsXG4gIFwiY3A4NjBcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6PDoMOBw6fDqsOKw6jDjcOUw6zDg8OCw4nDgMOIw7TDtcOyw5rDucOMw5XDnMKiwqPDmeKCp8OTw6HDrcOzw7rDscORwqrCusK/w5LCrMK9wrzCocKrwrvilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDOscOfzpPPgM6jz4PCtc+EzqbOmM6pzrTiiJ7Phs614oip4omhwrHiiaXiiaTijKDijKHDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjBcIjogXCJjcDg2MFwiLFxuICBcImNzaWJtODYwXCI6IFwiY3A4NjBcIixcbiAgXCJjcDg2MVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDpMOgw6XDp8Oqw6vDqMOQw7DDnsOEw4XDicOmw4bDtMO2w77Du8Odw73DlsOcw7jCo8OY4oKnxpLDocOtw7PDusOBw43Dk8Oawr/ijJDCrMK9wrzCocKrwrvilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDOscOfzpPPgM6jz4PCtc+EzqbOmM6pzrTiiJ7Phs614oip4omhwrHiiaXiiaTijKDijKHDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjFcIjogXCJjcDg2MVwiLFxuICBcImNzaWJtODYxXCI6IFwiY3A4NjFcIixcbiAgXCJjcDg2MlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi15DXkdeS15PXlNeV15bXl9eY15nXmteb15zXndee15/XoNeh16LXo9ek16XXpten16jXqdeqwqLCo8Kl4oKnxpLDocOtw7PDusOxw5HCqsK6wr/ijJDCrMK9wrzCocKrwrvilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDOscOfzpPPgM6jz4PCtc+EzqbOmM6pzrTiiJ7Phs614oip4omhwrHiiaXiiaTijKDijKHDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjJcIjogXCJjcDg2MlwiLFxuICBcImNzaWJtODYyXCI6IFwiY3A4NjJcIixcbiAgXCJjcDg2M1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDgsOgwrbDp8Oqw6vDqMOvw67igJfDgMKnw4nDiMOKw7TDi8OPw7vDucKkw5TDnMKiwqPDmcObxpLCpsK0w7PDusKowrjCs8Kvw47ijJDCrMK9wrzCvsKrwrvilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDOscOfzpPPgM6jz4PCtc+EzqbOmM6pzrTiiJ7Phs614oip4omhwrHiiaXiiaTijKDijKHDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjNcIjogXCJjcDg2M1wiLFxuICBcImNzaWJtODYzXCI6IFwiY3A4NjNcIixcbiAgXCJjcDg2NFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiXFx1MDAwMFxcdTAwMDFcXHUwMDAyXFx1MDAwM1xcdTAwMDRcXHUwMDA1XFx1MDAwNlxcdTAwMDdcXGJcXHRcXG5cXHUwMDBiXFxmXFxyXFx1MDAwZVxcdTAwMGZcXHUwMDEwXFx1MDAxMVxcdTAwMTJcXHUwMDEzXFx1MDAxNFxcdTAwMTVcXHUwMDE2XFx1MDAxN1xcdTAwMThcXHUwMDE5XFx1MDAxYVxcdTAwMWJcXHUwMDFjXFx1MDAxZFxcdTAwMWVcXHUwMDFmICFcXFwiIyTZqiYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xcXFxdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f8KwwrfiiJniiJrilpLilIDilILilLzilKTilKzilJzilLTilJDilIzilJTilJjOsuKIns+GwrHCvcK84omIwqvCu++7t++7uO+/ve+/ve+7u++7vO+/vcKgwq3vuoLCo8Kk77qE77+977+977qO77qP77qV77qZ2Izvup3vuqHvuqXZoNmh2aLZo9mk2aXZptmn2ajZqe+7kdib77qx77q177q52J/Cou+6gO+6ge+6g++6he+7iu+6i++6je+6ke+6k++6l++6m++6n++6o++6p++6qe+6q++6re+6r++6s++6t++6u++6v++7ge+7he+7i++7j8KmwqzDt8OX77uJ2YDvu5Pvu5fvu5vvu5/vu6Pvu6fvu6vvu63vu6/vu7Pvur3vu4zvu47vu43vu6Hvub3Zke+7pe+7qe+7rO+7sO+7su+7kO+7le+7te+7tu+7ne+7me+7seKWoO+/vVwiXG4gIH0sXG4gIFwiaWJtODY0XCI6IFwiY3A4NjRcIixcbiAgXCJjc2libTg2NFwiOiBcImNwODY0XCIsXG4gIFwiY3A4NjVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6TDoMOlw6fDqsOrw6jDr8Ouw6zDhMOFw4nDpsOGw7TDtsOyw7vDucO/w5bDnMO4wqPDmOKCp8aSw6HDrcOzw7rDscORwqrCusK/4oyQwqzCvcK8wqHCq8Kk4paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODY1XCI6IFwiY3A4NjVcIixcbiAgXCJjc2libTg2NVwiOiBcImNwODY1XCIsXG4gIFwiY3A4NjZcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItCQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv+KWkeKWkuKWk+KUguKUpOKVoeKVouKVluKVleKVo+KVkeKVl+KVneKVnOKVm+KUkOKUlOKUtOKUrOKUnOKUgOKUvOKVnuKVn+KVmuKVlOKVqeKVpuKVoOKVkOKVrOKVp+KVqOKVpOKVpeKVmeKVmOKVkuKVk+KVq+KVquKUmOKUjOKWiOKWhOKWjOKWkOKWgNGA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGP0IHRkdCE0ZTQh9GX0I7RnsKw4oiZwrfiiJrihJbCpOKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjZcIjogXCJjcDg2NlwiLFxuICBcImNzaWJtODY2XCI6IFwiY3A4NjZcIixcbiAgXCJjcDg2OVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi77+977+977+977+977+977+9zobvv73Ct8KswqbigJjigJnOiOKAlc6JzorOqs6M77+977+9zo7Oq8Kpzo/CssKzzqzCo86tzq7Or8+KzpDPjM+NzpHOks6TzpTOlc6WzpfCvc6YzpnCq8K74paR4paS4paT4pSC4pSkzprOm86czp3ilaPilZHilZfilZ3Ons6f4pSQ4pSU4pS04pSs4pSc4pSA4pS8zqDOoeKVmuKVlOKVqeKVpuKVoOKVkOKVrM6jzqTOpc6mzqfOqM6pzrHOss6z4pSY4pSM4paI4paEzrTOteKWgM62zrfOuM65zrrOu868zr3Ovs6/z4DPgc+Dz4LPhM6Ewq3Csc+Fz4bPh8Knz4jOhcKwwqjPic+LzrDPjuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NjlcIjogXCJjcDg2OVwiLFxuICBcImNzaWJtODY5XCI6IFwiY3A4NjlcIixcbiAgXCJjcDkyMlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CruKAvsKwwrHCssKzwrTCtcK2wrfCuMK5wrrCu8K8wr3CvsK/w4DDgcOCw4PDhMOFw4bDh8OIw4nDisOLw4zDjcOOw4/FoMORw5LDk8OUw5XDlsOXw5jDmcOaw5vDnMOdxb3Dn8Ogw6HDosOjw6TDpcOmw6fDqMOpw6rDq8Osw63DrsOvxaHDscOyw7PDtMO1w7bDt8O4w7nDusO7w7zDvcW+w79cIlxuICB9LFxuICBcImlibTkyMlwiOiBcImNwOTIyXCIsXG4gIFwiY3NpYm05MjJcIjogXCJjcDkyMlwiLFxuICBcImNwMTA0NlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi77qIw5fDt++jtu+jte+jtO+jt++5scKI4pag4pSC4pSA4pSQ4pSM4pSU4pSY77m577m777m977m/77m377qK77uw77uz77uy77uO77uP77uQ77u277u477u677u8wqDvo7rvo7nvo7jCpO+ju++6i++6ke+6l++6m++6n++6o9iMwq3vuqfvurPZoNmh2aLZo9mk2aXZptmn2ajZqe+6t9ib77q777q/77uK2J/vu4vYodii2KPYpNil2KbYp9io2KnYqtir2KzYrdiu2K/YsNix2LLYs9i02LXYtti377uH2LnYuu+7jO+6gu+6hO+6ju+7k9mA2YHZgtmD2YTZhdmG2YfZiNmJ2YrZi9mM2Y3ZjtmP2ZDZkdmS77uX77ub77uf76O877u177u377u577u777uj77un77us77up77+9XCJcbiAgfSxcbiAgXCJpYm0xMDQ2XCI6IFwiY3AxMDQ2XCIsXG4gIFwiY3NpYm0xMDQ2XCI6IFwiY3AxMDQ2XCIsXG4gIFwiY3AxMTI0XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDQgdCC0pDQhNCF0IbQh9CI0InQitCL0IzCrdCO0I/QkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/RgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7Rj+KEltGR0ZLSkdGU0ZXRltGX0ZjRmdGa0ZvRnMKn0Z7Rn1wiXG4gIH0sXG4gIFwiaWJtMTEyNFwiOiBcImNwMTEyNFwiLFxuICBcImNzaWJtMTEyNFwiOiBcImNwMTEyNFwiLFxuICBcImNwMTEyNVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/4paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paA0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGO0Y/QgdGR0pDSkdCE0ZTQhtGW0IfRl8K34oia4oSWwqTilqDCoFwiXG4gIH0sXG4gIFwiaWJtMTEyNVwiOiBcImNwMTEyNVwiLFxuICBcImNzaWJtMTEyNVwiOiBcImNwMTEyNVwiLFxuICBcImNwMTEyOVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKjwqTCpcKmwqfFk8KpwqrCq8Kswq3CrsKvwrDCscKywrPFuMK1wrbCt8WSwrnCusK7wrzCvcK+wr/DgMOBw4LEgsOEw4XDhsOHw4jDicOKw4vMgMONw47Dj8SQw5HMicOTw5TGoMOWw5fDmMOZw5rDm8Ocxq/Mg8Ofw6DDocOixIPDpMOlw6bDp8Oow6nDqsOrzIHDrcOuw6/EkcOxzKPDs8O0xqHDtsO3w7jDucO6w7vDvMaw4oKrw79cIlxuICB9LFxuICBcImlibTExMjlcIjogXCJjcDExMjlcIixcbiAgXCJjc2libTExMjlcIjogXCJjcDExMjlcIixcbiAgXCJjcDExMzNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoOC6geC6guC6hOC6h+C6iOC6quC6iuC6jeC6lOC6leC6luC6l+C6meC6muC6m+C6nOC6neC6nuC6n+C6oeC6ouC6o+C6peC6p+C6q+C6reC6ru+/ve+/ve+/veC6r+C6sOC6suC6s+C6tOC6teC6tuC6t+C6uOC6ueC6vOC6seC6u+C6ve+/ve+/ve+/veC7gOC7geC7guC7g+C7hOC7iOC7ieC7iuC7i+C7jOC7jeC7hu+/veC7nOC7neKCre+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/veC7kOC7keC7kuC7k+C7lOC7leC7luC7l+C7mOC7me+/ve+/vcKiwqzCpu+/vVwiXG4gIH0sXG4gIFwiaWJtMTEzM1wiOiBcImNwMTEzM1wiLFxuICBcImNzaWJtMTEzM1wiOiBcImNwMTEzM1wiLFxuICBcImNwMTE2MVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+94LmI4LiB4LiC4LiD4LiE4LiF4LiG4LiH4LiI4LiJ4LiK4LiL4LiM4LiN4LiO4LiP4LiQ4LiR4LiS4LiT4LiU4LiV4LiW4LiX4LiY4LiZ4Lia4Lib4Lic4Lid4Lie4Lif4Lig4Lih4Lii4Lij4Lik4Lil4Lim4Lin4Lio4Lip4Liq4Lir4Lis4Lit4Liu4Liv4Liw4Lix4Liy4Liz4Li04Li14Li24Li34Li44Li54Li64LmJ4LmK4LmL4oKs4Li/4LmA4LmB4LmC4LmD4LmE4LmF4LmG4LmH4LmI4LmJ4LmK4LmL4LmM4LmN4LmO4LmP4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZ4Lma4LmbwqLCrMKmwqBcIlxuICB9LFxuICBcImlibTExNjFcIjogXCJjcDExNjFcIixcbiAgXCJjc2libTExNjFcIjogXCJjcDExNjFcIixcbiAgXCJjcDExNjJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrMKBwoLCg8KE4oCmwobCh8KIwonCisKLwozCjcKOwo/CkOKAmOKAmeKAnOKAneKAouKAk+KAlMKYwpnCmsKbwpzCncKewp/CoOC4geC4guC4g+C4hOC4heC4huC4h+C4iOC4ieC4iuC4i+C4jOC4jeC4juC4j+C4kOC4keC4kuC4k+C4lOC4leC4luC4l+C4mOC4meC4muC4m+C4nOC4neC4nuC4n+C4oOC4oeC4ouC4o+C4pOC4peC4puC4p+C4qOC4qeC4quC4q+C4rOC4reC4ruC4r+C4sOC4seC4suC4s+C4tOC4teC4tuC4t+C4uOC4ueC4uu+/ve+/ve+/ve+/veC4v+C5gOC5geC5guC5g+C5hOC5heC5huC5h+C5iOC5ieC5iuC5i+C5jOC5jeC5juC5j+C5kOC5keC5kuC5k+C5lOC5leC5luC5l+C5mOC5meC5muC5m++/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwiaWJtMTE2MlwiOiBcImNwMTE2MlwiLFxuICBcImNzaWJtMTE2MlwiOiBcImNwMTE2MlwiLFxuICBcImNwMTE2M1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKj4oKswqXCpsKnxZPCqcKqwqvCrMKtwq7Cr8KwwrHCssKzxbjCtcK2wrfFksK5wrrCu8K8wr3CvsK/w4DDgcOCxILDhMOFw4bDh8OIw4nDisOLzIDDjcOOw4/EkMORzInDk8OUxqDDlsOXw5jDmcOaw5vDnMavzIPDn8Ogw6HDosSDw6TDpcOmw6fDqMOpw6rDq8yBw63DrsOvxJHDscyjw7PDtMahw7bDt8O4w7nDusO7w7zGsOKCq8O/XCJcbiAgfSxcbiAgXCJpYm0xMTYzXCI6IFwiY3AxMTYzXCIsXG4gIFwiY3NpYm0xMTYzXCI6IFwiY3AxMTYzXCIsXG4gIFwibWFjY3JvYXRpYW5cIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOEw4XDh8OJw5HDlsOcw6HDoMOiw6TDo8Olw6fDqcOow6rDq8Otw6zDrsOvw7HDs8Oyw7TDtsO1w7rDucO7w7zigKDCsMKiwqPCp+KAosK2w5/CrsWg4oSiwrTCqOKJoMW9w5jiiJ7CseKJpOKJpeKIhsK14oiC4oiR4oiPxaHiiKvCqsK64oSmxb7DuMK/wqHCrOKImsaS4omIxIbCq8SM4oCmwqDDgMODw5XFksWTxJDigJTigJzigJ3igJjigJnDt+KXiu+/vcKp4oGEwqTigLnigLrDhsK74oCTwrfigJrigJ7igLDDgsSHw4HEjcOIw43DjsOPw4zDk8OUxJHDksOaw5vDmcSxy4bLnMKvz4DDi8uawrjDisOmy4dcIlxuICB9LFxuICBcIm1hY2N5cmlsbGljXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLQkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv4oCgwrDCosKjwqfigKLCttCGwq7CqeKEotCC0ZLiiaDQg9GT4oiewrHiiaTiiaXRlsK14oiC0IjQhNGU0IfRl9CJ0ZnQitGa0ZjQhcKs4oiaxpLiiYjiiIbCq8K74oCmwqDQi9Gb0IzRnNGV4oCT4oCU4oCc4oCd4oCY4oCZw7figJ7QjtGe0I/Rn+KEltCB0ZHRj9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGOwqRcIlxuICB9LFxuICBcIm1hY2dyZWVrXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDhMK5wrLDicKzw5bDnM6Fw6DDosOkzoTCqMOnw6nDqMOqw6vCo+KEosOuw6/igKLCveKAsMO0w7bCpsKtw7nDu8O84oCgzpPOlM6YzpvOns6gw5/CrsKpzqPOqsKn4omgwrDOh86RwrHiiaTiiaXCpc6SzpXOls6XzpnOms6czqbOq86ozqnOrM6dwqzOn86h4omIzqTCq8K74oCmwqDOpc6nzobOiMWT4oCT4oCV4oCc4oCd4oCY4oCZw7fOic6KzozOjs6tzq7Or8+Mzo/Pjc6xzrLPiM60zrXPhs6zzrfOuc6+zrrOu868zr3Ov8+Az47Pgc+Dz4TOuM+Jz4LPh8+FzrbPis+LzpDOsO+/vVwiXG4gIH0sXG4gIFwibWFjaWNlbGFuZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4TDhcOHw4nDkcOWw5zDocOgw6LDpMOjw6XDp8Opw6jDqsOrw63DrMOuw6/DscOzw7LDtMO2w7XDusO5w7vDvMOdwrDCosKjwqfigKLCtsOfwq7CqeKEosK0wqjiiaDDhsOY4oiewrHiiaTiiaXCpcK14oiC4oiR4oiPz4DiiKvCqsK64oSmw6bDuMK/wqHCrOKImsaS4omI4oiGwqvCu+KApsKgw4DDg8OVxZLFk+KAk+KAlOKAnOKAneKAmOKAmcO34peKw7/FuOKBhMKkw5DDsMOew77DvcK34oCa4oCe4oCww4LDisOBw4vDiMONw47Dj8OMw5PDlO+/vcOSw5rDm8OZxLHLhsucwq/LmMuZy5rCuMudy5vLh1wiXG4gIH0sXG4gIFwibWFjcm9tYW5cIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOEw4XDh8OJw5HDlsOcw6HDoMOiw6TDo8Olw6fDqcOow6rDq8Otw6zDrsOvw7HDs8Oyw7TDtsO1w7rDucO7w7zigKDCsMKiwqPCp+KAosK2w5/CrsKp4oSiwrTCqOKJoMOGw5jiiJ7CseKJpOKJpcKlwrXiiILiiJHiiI/PgOKIq8KqwrrihKbDpsO4wr/CocKs4oiaxpLiiYjiiIbCq8K74oCmwqDDgMODw5XFksWT4oCT4oCU4oCc4oCd4oCY4oCZw7fil4rDv8W44oGEwqTigLnigLrvrIHvrILigKHCt+KAmuKAnuKAsMOCw4rDgcOLw4jDjcOOw4/DjMOTw5Tvv73DksOaw5vDmcSxy4bLnMKvy5jLmcuawrjLncuby4dcIlxuICB9LFxuICBcIm1hY3JvbWFuaWFcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOEw4XDh8OJw5HDlsOcw6HDoMOiw6TDo8Olw6fDqcOow6rDq8Otw6zDrsOvw7HDs8Oyw7TDtsO1w7rDucO7w7zigKDCsMKiwqPCp+KAosK2w5/CrsKp4oSiwrTCqOKJoMSCxZ7iiJ7CseKJpOKJpcKlwrXiiILiiJHiiI/PgOKIq8KqwrrihKbEg8Wfwr/CocKs4oiaxpLiiYjiiIbCq8K74oCmwqDDgMODw5XFksWT4oCT4oCU4oCc4oCd4oCY4oCZw7fil4rDv8W44oGEwqTigLnigLrFosWj4oChwrfigJrigJ7igLDDgsOKw4HDi8OIw43DjsOPw4zDk8OU77+9w5LDmsObw5nEscuGy5zCr8uYy5nLmsK4y53Lm8uHXCJcbiAgfSxcbiAgXCJtYWN0aGFpXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCq8K74oCm76KM76KP76KS76KV76KY76KL76KO76KR76KU76KX4oCc4oCd76KZ77+94oCi76KE76KJ76KF76KG76KH76KI76KK76KN76KQ76KT76KW4oCY4oCZ77+9wqDguIHguILguIPguITguIXguIbguIfguIjguInguIrguIvguIzguI3guI7guI/guJDguJHguJLguJPguJTguJXguJbguJfguJjguJnguJrguJvguJzguJ3guJ7guJ/guKDguKHguKLguKPguKTguKXguKbguKfguKjguKnguKrguKvguKzguK3guK7guK/guLDguLHguLLguLPguLTguLXguLbguLfguLjguLnguLrvu7/igIvigJPigJTguL/guYDguYHguYLguYPguYTguYXguYbguYfguYjguYnguYrguYvguYzguY3ihKLguY/guZDguZHguZLguZPguZTguZXguZbguZfguZjguZnCrsKp77+977+977+977+9XCJcbiAgfSxcbiAgXCJtYWN0dXJraXNoXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDhMOFw4fDicORw5bDnMOhw6DDosOkw6PDpcOnw6nDqMOqw6vDrcOsw67Dr8Oxw7PDssO0w7bDtcO6w7nDu8O84oCgwrDCosKjwqfigKLCtsOfwq7CqeKEosK0wqjiiaDDhsOY4oiewrHiiaTiiaXCpcK14oiC4oiR4oiPz4DiiKvCqsK64oSmw6bDuMK/wqHCrOKImsaS4omI4oiGwqvCu+KApsKgw4DDg8OVxZLFk+KAk+KAlOKAnOKAneKAmOKAmcO34peKw7/FuMSexJ/EsMSxxZ7Fn+KAocK34oCa4oCe4oCww4LDisOBw4vDiMONw47Dj8OMw5PDlO+/vcOSw5rDm8OZ77+9y4bLnMKvy5jLmcuawrjLncuby4dcIlxuICB9LFxuICBcIm1hY3VrcmFpbmVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItCQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/igKDCsNKQwqPCp+KAosK20IbCrsKp4oSi0ILRkuKJoNCD0ZPiiJ7CseKJpOKJpdGWwrXSkdCI0ITRlNCH0ZfQidGZ0IrRmtGY0IXCrOKImsaS4omI4oiGwqvCu+KApsKg0IvRm9CM0ZzRleKAk+KAlOKAnOKAneKAmOKAmcO34oCe0I7RntCP0Z/ihJbQgdGR0Y/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv9GA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjsKkXCJcbiAgfSxcbiAgXCJrb2k4clwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4pSA4pSC4pSM4pSQ4pSU4pSY4pSc4pSk4pSs4pS04pS84paA4paE4paI4paM4paQ4paR4paS4paT4oyg4pag4oiZ4oia4omI4omk4omlwqDijKHCsMKywrfDt+KVkOKVkeKVktGR4pWT4pWU4pWV4pWW4pWX4pWY4pWZ4pWa4pWb4pWc4pWd4pWe4pWf4pWg4pWh0IHilaLilaPilaTilaXilabilafilajilanilarilavilazCqdGO0LDQsdGG0LTQtdGE0LPRhdC40LnQutC70LzQvdC+0L/Rj9GA0YHRgtGD0LbQstGM0YvQt9GI0Y3RidGH0YrQrtCQ0JHQptCU0JXQpNCT0KXQmNCZ0JrQm9Cc0J3QntCf0K/QoNCh0KLQo9CW0JLQrNCr0JfQqNCt0KnQp9CqXCJcbiAgfSxcbiAgXCJrb2k4dVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4pSA4pSC4pSM4pSQ4pSU4pSY4pSc4pSk4pSs4pS04pS84paA4paE4paI4paM4paQ4paR4paS4paT4oyg4pag4oiZ4oia4omI4omk4omlwqDijKHCsMKywrfDt+KVkOKVkeKVktGR0ZTilZTRltGX4pWX4pWY4pWZ4pWa4pWb0pHilZ3ilZ7ilZ/ilaDilaHQgdCE4pWj0IbQh+KVpuKVp+KVqOKVqeKVqtKQ4pWswqnRjtCw0LHRhtC00LXRhNCz0YXQuNC50LrQu9C80L3QvtC/0Y/RgNGB0YLRg9C20LLRjNGL0LfRiNGN0YnRh9GK0K7QkNCR0KbQlNCV0KTQk9Cl0JjQmdCa0JvQnNCd0J7Qn9Cv0KDQodCi0KPQltCS0KzQq9CX0KjQrdCp0KfQqlwiXG4gIH0sXG4gIFwia29pOHJ1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLilIDilILilIzilJDilJTilJjilJzilKTilKzilLTilLziloDiloTilojilozilpDilpHilpLilpPijKDilqDiiJniiJriiYjiiaTiiaXCoOKMocKwwrLCt8O34pWQ4pWR4pWS0ZHRlOKVlNGW0ZfilZfilZjilZnilZrilZvSkdGe4pWe4pWf4pWg4pWh0IHQhOKVo9CG0IfilabilafilajilanilarSkNCOwqnRjtCw0LHRhtC00LXRhNCz0YXQuNC50LrQu9C80L3QvtC/0Y/RgNGB0YLRg9C20LLRjNGL0LfRiNGN0YnRh9GK0K7QkNCR0KbQlNCV0KTQk9Cl0JjQmdCa0JvQnNCd0J7Qn9Cv0KDQodCi0KPQltCS0KzQq9CX0KjQrdCp0KfQqlwiXG4gIH0sXG4gIFwia29pOHRcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItKb0pPigJrSkuKAnuKApuKAoOKAoe+/veKAsNKz4oC50rLSt9K277+90prigJjigJnigJzigJ3igKLigJPigJTvv73ihKLvv73igLrvv73vv73vv73vv73vv73Tr9Ou0ZHCpNOjwqbCp++/ve+/ve+/vcKrwqzCrcKu77+9wrDCscKy0IHvv73TosK2wrfvv73ihJbvv73Cu++/ve+/ve+/vcKp0Y7QsNCx0YbQtNC10YTQs9GF0LjQudC60LvQvNC90L7Qv9GP0YDRgdGC0YPQttCy0YzRi9C30YjRjdGJ0YfRitCu0JDQkdCm0JTQldCk0JPQpdCY0JnQmtCb0JzQndCe0J/Qr9Cg0KHQotCj0JbQktCs0KvQl9Co0K3QqdCn0KpcIlxuICB9LFxuICBcImFybXNjaWk4XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDvv73Wh9aJKSjCu8Kr4oCULtWdLC3WiuKAptWc1ZvVntSx1aHUstWi1LPVo9S01aTUtdWl1LbVptS31afUuNWo1LnVqdS61arUu9Wr1LzVrNS91a3UvtWu1L/Vr9WA1bDVgdWx1YLVstWD1bPVhNW01YXVtdWG1bbVh9W31YjVuNWJ1bnVitW61YvVu9WM1bzVjdW91Y7VvtWP1b/VkNaA1ZHWgdWS1oLVk9aD1ZTWhNWV1oXVltaG1Zrvv71cIlxuICB9LFxuICBcInJrMTA0OFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi0ILQg+KAmtGT4oCe4oCm4oCg4oCh4oKs4oCw0InigLnQitKa0rrQj9GS4oCY4oCZ4oCc4oCd4oCi4oCT4oCU77+94oSi0ZnigLrRmtKb0rvRn8Kg0rDSsdOYwqTTqMKmwqfQgcKp0pLCq8Kswq3CrtKuwrDCsdCG0ZbTqcK1wrbCt9GR4oSW0pPCu9OZ0qLSo9Kv0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGO0Y9cIlxuICB9LFxuICBcInRjdm5cIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIlxcdTAwMDDDmuG7pFxcdTAwMDPhu6rhu6zhu65cXHUwMDA3XFxiXFx0XFxuXFx1MDAwYlxcZlxcclxcdTAwMGVcXHUwMDBmXFx1MDAxMOG7qOG7sOG7suG7tuG7uMOd4bu0XFx1MDAxOFxcdTAwMTlcXHUwMDFhXFx1MDAxYlxcdTAwMWNcXHUwMDFkXFx1MDAxZVxcdTAwMWYgIVxcXCIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXFxcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn/DgOG6osODw4HhuqDhurbhuqzDiOG6uuG6vMOJ4bq44buGw4zhu4jEqMON4buKw5Lhu47DlcOT4buM4buY4buc4bue4bug4bua4buiw5nhu6bFqMKgxILDgsOKw5TGoMavxJDEg8Oiw6rDtMahxrDEkeG6sMyAzInMg8yBzKPDoOG6o8Ojw6HhuqHhurLhurHhurPhurXhuq/hurThuq7huqbhuqjhuqrhuqThu4DhurfhuqfhuqnhuqvhuqXhuq3DqOG7guG6u+G6vcOp4bq54buB4buD4buF4bq/4buHw6zhu4nhu4Thur7hu5LEqcOt4buLw7Lhu5Thu4/DtcOz4buN4buT4buV4buX4buR4buZ4bud4buf4buh4bub4bujw7nhu5bhu6fFqcO64bul4bur4but4buv4bup4bux4buz4bu34bu5w73hu7Xhu5BcIlxuICB9LFxuICBcImdlb3JnaWFuYWNhZGVteVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgeKAmsaS4oCe4oCm4oCg4oChy4bigLDFoOKAucWSwo3CjsKPwpDigJjigJnigJzigJ3igKLigJPigJTLnOKEosWh4oC6xZPCncKexbjCoMKhwqLCo8KkwqXCpsKnwqjCqcKqwqvCrMKtwq7Cr8KwwrHCssKzwrTCtcK2wrfCuMK5wrrCu8K8wr3CvsK/4YOQ4YOR4YOS4YOT4YOU4YOV4YOW4YOX4YOY4YOZ4YOa4YOb4YOc4YOd4YOe4YOf4YOg4YOh4YOi4YOj4YOk4YOl4YOm4YOn4YOo4YOp4YOq4YOr4YOs4YOt4YOu4YOv4YOw4YOx4YOy4YOz4YO04YO14YO2w6fDqMOpw6rDq8Osw63DrsOvw7DDscOyw7PDtMO1w7bDt8O4w7nDusO7w7zDvcO+w79cIlxuICB9LFxuICBcImdlb3JnaWFucHNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHigJrGkuKAnuKApuKAoOKAocuG4oCwxaDigLnFksKNwo7Cj8KQ4oCY4oCZ4oCc4oCd4oCi4oCT4oCUy5zihKLFoeKAusWTwp3CnsW4wqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv+GDkOGDkeGDkuGDk+GDlOGDleGDluGDseGDl+GDmOGDmeGDmuGDm+GDnOGDsuGDneGDnuGDn+GDoOGDoeGDouGDs+GDo+GDpOGDpeGDpuGDp+GDqOGDqeGDquGDq+GDrOGDreGDruGDtOGDr+GDsOGDtcOmw6fDqMOpw6rDq8Osw63DrsOvw7DDscOyw7PDtMO1w7bDt8O4w7nDusO7w7zDvcO+w79cIlxuICB9LFxuICBcInB0MTU0XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLSltKS067Sk+KAnuKAptK20q7SstKv0qDTotKi0prSutK40pfigJjigJnigJzigJ3igKLigJPigJTSs9K30qHTo9Kj0pvSu9K5wqDQjtGe0IjTqNKY0rDCp9CBwqnTmMKrwqzTr8Ku0pzCsNKx0IbRltKZ06nCtsK30ZHihJbTmcK70ZjSqtKr0p3QkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/RgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7Rj1wiXG4gIH0sXG4gIFwidmlzY2lpXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCJcXHUwMDAwXFx1MDAwMeG6slxcdTAwMDNcXHUwMDA04bq04bqqXFx1MDAwN1xcYlxcdFxcblxcdTAwMGJcXGZcXHJcXHUwMDBlXFx1MDAwZlxcdTAwMTBcXHUwMDExXFx1MDAxMlxcdTAwMTPhu7ZcXHUwMDE1XFx1MDAxNlxcdTAwMTdcXHUwMDE44bu4XFx1MDAxYVxcdTAwMWJcXHUwMDFjXFx1MDAxZOG7tFxcdTAwMWYgIVxcXCIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXFxcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn/huqDhuq7hurDhurbhuqThuqbhuqjhuqzhurzhurjhur7hu4Dhu4Lhu4Thu4bhu5Dhu5Lhu5Thu5bhu5jhu6Lhu5rhu5zhu57hu4rhu47hu4zhu4jhu6bFqOG7pOG7ssOV4bqv4bqx4bq34bql4bqn4bqp4bqt4bq94bq54bq/4buB4buD4buF4buH4buR4buT4buV4buX4bugxqDhu5nhu53hu5/hu4vhu7Dhu6jhu6rhu6zGoeG7m8avw4DDgcOCw4PhuqLEguG6s+G6tcOIw4nDiuG6usOMw43EqOG7s8SQ4bupw5LDk8OU4bqh4bu34bur4butw5nDmuG7ueG7tcOd4buhxrDDoMOhw6LDo+G6o8SD4buv4bqrw6jDqcOq4bq7w6zDrcSp4buJxJHhu7HDssOzw7TDteG7j+G7jeG7pcO5w7rFqeG7p8O94buj4buuXCJcbiAgfSxcbiAgXCJpc282NDZjblwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiXFx1MDAwMFxcdTAwMDFcXHUwMDAyXFx1MDAwM1xcdTAwMDRcXHUwMDA1XFx1MDAwNlxcdTAwMDdcXGJcXHRcXG5cXHUwMDBiXFxmXFxyXFx1MDAwZVxcdTAwMGZcXHUwMDEwXFx1MDAxMVxcdTAwMTJcXHUwMDEzXFx1MDAxNFxcdTAwMTVcXHUwMDE2XFx1MDAxN1xcdTAwMThcXHUwMDE5XFx1MDAxYVxcdTAwMWJcXHUwMDFjXFx1MDAxZFxcdTAwMWVcXHUwMDFmICFcXFwiI8KlJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xcXFxdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH3igL5/77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+9XCJcbiAgfSxcbiAgXCJpc282NDZqcFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiXFx1MDAwMFxcdTAwMDFcXHUwMDAyXFx1MDAwM1xcdTAwMDRcXHUwMDA1XFx1MDAwNlxcdTAwMDdcXGJcXHRcXG5cXHUwMDBiXFxmXFxyXFx1MDAwZVxcdTAwMGZcXHUwMDEwXFx1MDAxMVxcdTAwMTJcXHUwMDEzXFx1MDAxNFxcdTAwMTVcXHUwMDE2XFx1MDAxN1xcdTAwMThcXHUwMDE5XFx1MDAxYVxcdTAwMWJcXHUwMDFjXFx1MDAxZFxcdTAwMWVcXHUwMDFmICFcXFwiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbwqVdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH3igL5/77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+9XCJcbiAgfSxcbiAgXCJocHJvbWFuOFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kgw4DDgsOIw4rDi8OOw4/CtMuLy4bCqMucw5nDm+KCpMKvw53DvcKww4fDp8ORw7HCocK/wqTCo8KlwqfGksKiw6LDqsO0w7vDocOpw7PDusOgw6jDssO5w6TDq8O2w7zDhcOuw5jDhsOlw63DuMOmw4TDrMOWw5zDicOvw5/DlMOBw4PDo8OQw7DDjcOMw5PDksOVw7XFoMWhw5rFuMO/w57DvsK3wrXCtsK+4oCUwrzCvcKqwrrCq+KWoMK7wrHvv71cIlxuICB9LFxuICBcIm1hY2ludG9zaFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4TDhcOHw4nDkcOWw5zDocOgw6LDpMOjw6XDp8Opw6jDqsOrw63DrMOuw6/DscOzw7LDtMO2w7XDusO5w7vDvOKAoMKwwqLCo8Kn4oCiwrbDn8KuwqnihKLCtMKo4omgw4bDmOKInsKx4omk4omlwqXCteKIguKIkeKIj8+A4oirwqrCuuKEpsOmw7jCv8KhwqziiJrGkuKJiOKIhsKrwrvigKbCoMOAw4PDlcWSxZPigJPigJTigJzigJ3igJjigJnDt+KXisO/xbjigYTCpOKAueKAuu+sge+sguKAocK34oCa4oCe4oCww4LDisOBw4vDiMONw47Dj8OMw5PDlO+/vcOSw5rDm8OZxLHLhsucwq/LmMuZy5rCuMudy5vLh1wiXG4gIH0sXG4gIFwiYXNjaWlcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwidGlzNjIwXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73guIHguILguIPguITguIXguIbguIfguIjguInguIrguIvguIzguI3guI7guI/guJDguJHguJLguJPguJTguJXguJbguJfguJjguJnguJrguJvguJzguJ3guJ7guJ/guKDguKHguKLguKPguKTguKXguKbguKfguKjguKnguKrguKvguKzguK3guK7guK/guLDguLHguLLguLPguLTguLXguLbguLfguLjguLnguLrvv73vv73vv73vv73guL/guYDguYHguYLguYPguYTguYXguYbguYfguYjguYnguYrguYvguYzguY3guY7guY/guZDguZHguZLguZPguZTguZXguZbguZfguZjguZnguZrguZvvv73vv73vv73vv71cIlxuICB9XG59IiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gTWFudWFsbHkgYWRkZWQgZGF0YSB0byBiZSB1c2VkIGJ5IHNiY3MgY29kZWMgaW4gYWRkaXRpb24gdG8gZ2VuZXJhdGVkIG9uZS5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gTm90IHN1cHBvcnRlZCBieSBpY29udiwgbm90IHN1cmUgd2h5LlxuICAgIFwiMTAwMjlcIjogXCJtYWNjZW50ZXVyb1wiLFxuICAgIFwibWFjY2VudGV1cm9cIjoge1xuICAgICAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgICAgICBcImNoYXJzXCI6IFwiw4TEgMSBw4nEhMOWw5zDocSFxIzDpMSNxIbEh8OpxbnFusSOw63Ej8SSxJPElsOzxJfDtMO2w7XDusSaxJvDvOKAoMKwxJjCo8Kn4oCiwrbDn8KuwqnihKLEmcKo4omgxKPErsSvxKriiaTiiaXEq8S24oiC4oiRxYLEu8S8xL3EvsS5xLrFhcWGxYPCrOKImsWExYfiiIbCq8K74oCmwqDFiMWQw5XFkcWM4oCT4oCU4oCc4oCd4oCY4oCZw7fil4rFjcWUxZXFmOKAueKAusWZxZbFl8Wg4oCa4oCexaHFmsWbw4HFpMWlw43FvcW+xarDk8OUxavFrsOaxa/FsMWxxbLFs8Odw73Et8W7xYHFvMSiy4dcIlxuICAgIH0sXG5cbiAgICBcIjgwOFwiOiBcImNwODA4XCIsXG4gICAgXCJpYm04MDhcIjogXCJjcDgwOFwiLFxuICAgIFwiY3A4MDhcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgICAgICBcImNoYXJzXCI6IFwi0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/4paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paA0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGO0Y/QgdGR0ITRlNCH0ZfQjtGewrDiiJnCt+KImuKEluKCrOKWoMKgXCJcbiAgICB9LFxuXG4gICAgLy8gQWxpYXNlcyBvZiBnZW5lcmF0ZWQgZW5jb2RpbmdzLlxuICAgIFwiYXNjaWk4Yml0XCI6IFwiYXNjaWlcIixcbiAgICBcInVzYXNjaWlcIjogXCJhc2NpaVwiLFxuICAgIFwiYW5zaXgzNFwiOiBcImFzY2lpXCIsXG4gICAgXCJhbnNpeDM0MTk2OFwiOiBcImFzY2lpXCIsXG4gICAgXCJhbnNpeDM0MTk4NlwiOiBcImFzY2lpXCIsXG4gICAgXCJjc2FzY2lpXCI6IFwiYXNjaWlcIixcbiAgICBcImNwMzY3XCI6IFwiYXNjaWlcIixcbiAgICBcImlibTM2N1wiOiBcImFzY2lpXCIsXG4gICAgXCJpc29pcjZcIjogXCJhc2NpaVwiLFxuICAgIFwiaXNvNjQ2dXNcIjogXCJhc2NpaVwiLFxuICAgIFwiaXNvNjQ2aXJ2XCI6IFwiYXNjaWlcIixcbiAgICBcInVzXCI6IFwiYXNjaWlcIixcblxuICAgIFwibGF0aW4xXCI6IFwiaXNvODg1OTFcIixcbiAgICBcImxhdGluMlwiOiBcImlzbzg4NTkyXCIsXG4gICAgXCJsYXRpbjNcIjogXCJpc284ODU5M1wiLFxuICAgIFwibGF0aW40XCI6IFwiaXNvODg1OTRcIixcbiAgICBcImxhdGluNVwiOiBcImlzbzg4NTk5XCIsXG4gICAgXCJsYXRpbjZcIjogXCJpc284ODU5MTBcIixcbiAgICBcImxhdGluN1wiOiBcImlzbzg4NTkxM1wiLFxuICAgIFwibGF0aW44XCI6IFwiaXNvODg1OTE0XCIsXG4gICAgXCJsYXRpbjlcIjogXCJpc284ODU5MTVcIixcbiAgICBcImxhdGluMTBcIjogXCJpc284ODU5MTZcIixcblxuICAgIFwiY3Npc29sYXRpbjFcIjogXCJpc284ODU5MVwiLFxuICAgIFwiY3Npc29sYXRpbjJcIjogXCJpc284ODU5MlwiLFxuICAgIFwiY3Npc29sYXRpbjNcIjogXCJpc284ODU5M1wiLFxuICAgIFwiY3Npc29sYXRpbjRcIjogXCJpc284ODU5NFwiLFxuICAgIFwiY3Npc29sYXRpbmN5cmlsbGljXCI6IFwiaXNvODg1OTVcIixcbiAgICBcImNzaXNvbGF0aW5hcmFiaWNcIjogXCJpc284ODU5NlwiLFxuICAgIFwiY3Npc29sYXRpbmdyZWVrXCIgOiBcImlzbzg4NTk3XCIsXG4gICAgXCJjc2lzb2xhdGluaGVicmV3XCI6IFwiaXNvODg1OThcIixcbiAgICBcImNzaXNvbGF0aW41XCI6IFwiaXNvODg1OTlcIixcbiAgICBcImNzaXNvbGF0aW42XCI6IFwiaXNvODg1OTEwXCIsXG5cbiAgICBcImwxXCI6IFwiaXNvODg1OTFcIixcbiAgICBcImwyXCI6IFwiaXNvODg1OTJcIixcbiAgICBcImwzXCI6IFwiaXNvODg1OTNcIixcbiAgICBcImw0XCI6IFwiaXNvODg1OTRcIixcbiAgICBcImw1XCI6IFwiaXNvODg1OTlcIixcbiAgICBcImw2XCI6IFwiaXNvODg1OTEwXCIsXG4gICAgXCJsN1wiOiBcImlzbzg4NTkxM1wiLFxuICAgIFwibDhcIjogXCJpc284ODU5MTRcIixcbiAgICBcImw5XCI6IFwiaXNvODg1OTE1XCIsXG4gICAgXCJsMTBcIjogXCJpc284ODU5MTZcIixcblxuICAgIFwiaXNvaXIxNFwiOiBcImlzbzY0NmpwXCIsXG4gICAgXCJpc29pcjU3XCI6IFwiaXNvNjQ2Y25cIixcbiAgICBcImlzb2lyMTAwXCI6IFwiaXNvODg1OTFcIixcbiAgICBcImlzb2lyMTAxXCI6IFwiaXNvODg1OTJcIixcbiAgICBcImlzb2lyMTA5XCI6IFwiaXNvODg1OTNcIixcbiAgICBcImlzb2lyMTEwXCI6IFwiaXNvODg1OTRcIixcbiAgICBcImlzb2lyMTQ0XCI6IFwiaXNvODg1OTVcIixcbiAgICBcImlzb2lyMTI3XCI6IFwiaXNvODg1OTZcIixcbiAgICBcImlzb2lyMTI2XCI6IFwiaXNvODg1OTdcIixcbiAgICBcImlzb2lyMTM4XCI6IFwiaXNvODg1OThcIixcbiAgICBcImlzb2lyMTQ4XCI6IFwiaXNvODg1OTlcIixcbiAgICBcImlzb2lyMTU3XCI6IFwiaXNvODg1OTEwXCIsXG4gICAgXCJpc29pcjE2NlwiOiBcInRpczYyMFwiLFxuICAgIFwiaXNvaXIxNzlcIjogXCJpc284ODU5MTNcIixcbiAgICBcImlzb2lyMTk5XCI6IFwiaXNvODg1OTE0XCIsXG4gICAgXCJpc29pcjIwM1wiOiBcImlzbzg4NTkxNVwiLFxuICAgIFwiaXNvaXIyMjZcIjogXCJpc284ODU5MTZcIixcblxuICAgIFwiY3A4MTlcIjogXCJpc284ODU5MVwiLFxuICAgIFwiaWJtODE5XCI6IFwiaXNvODg1OTFcIixcblxuICAgIFwiY3lyaWxsaWNcIjogXCJpc284ODU5NVwiLFxuXG4gICAgXCJhcmFiaWNcIjogXCJpc284ODU5NlwiLFxuICAgIFwiYXJhYmljOFwiOiBcImlzbzg4NTk2XCIsXG4gICAgXCJlY21hMTE0XCI6IFwiaXNvODg1OTZcIixcbiAgICBcImFzbW83MDhcIjogXCJpc284ODU5NlwiLFxuXG4gICAgXCJncmVla1wiIDogXCJpc284ODU5N1wiLFxuICAgIFwiZ3JlZWs4XCIgOiBcImlzbzg4NTk3XCIsXG4gICAgXCJlY21hMTE4XCIgOiBcImlzbzg4NTk3XCIsXG4gICAgXCJlbG90OTI4XCIgOiBcImlzbzg4NTk3XCIsXG5cbiAgICBcImhlYnJld1wiOiBcImlzbzg4NTk4XCIsXG4gICAgXCJoZWJyZXc4XCI6IFwiaXNvODg1OThcIixcblxuICAgIFwidHVya2lzaFwiOiBcImlzbzg4NTk5XCIsXG4gICAgXCJ0dXJraXNoOFwiOiBcImlzbzg4NTk5XCIsXG5cbiAgICBcInRoYWlcIjogXCJpc284ODU5MTFcIixcbiAgICBcInRoYWk4XCI6IFwiaXNvODg1OTExXCIsXG5cbiAgICBcImNlbHRpY1wiOiBcImlzbzg4NTkxNFwiLFxuICAgIFwiY2VsdGljOFwiOiBcImlzbzg4NTkxNFwiLFxuICAgIFwiaXNvY2VsdGljXCI6IFwiaXNvODg1OTE0XCIsXG5cbiAgICBcInRpczYyMDBcIjogXCJ0aXM2MjBcIixcbiAgICBcInRpczYyMDI1MjkxXCI6IFwidGlzNjIwXCIsXG4gICAgXCJ0aXM2MjAyNTMzMFwiOiBcInRpczYyMFwiLFxuXG4gICAgXCIxMDAwMFwiOiBcIm1hY3JvbWFuXCIsXG4gICAgXCIxMDAwNlwiOiBcIm1hY2dyZWVrXCIsXG4gICAgXCIxMDAwN1wiOiBcIm1hY2N5cmlsbGljXCIsXG4gICAgXCIxMDA3OVwiOiBcIm1hY2ljZWxhbmRcIixcbiAgICBcIjEwMDgxXCI6IFwibWFjdHVya2lzaFwiLFxuXG4gICAgXCJjc3BjOGNvZGVwYWdlNDM3XCI6IFwiY3A0MzdcIixcbiAgICBcImNzcGM3NzViYWx0aWNcIjogXCJjcDc3NVwiLFxuICAgIFwiY3NwYzg1MG11bHRpbGluZ3VhbFwiOiBcImNwODUwXCIsXG4gICAgXCJjc3BjcDg1MlwiOiBcImNwODUyXCIsXG4gICAgXCJjc3BjODYybGF0aW5oZWJyZXdcIjogXCJjcDg2MlwiLFxuICAgIFwiY3BnclwiOiBcImNwODY5XCIsXG5cbiAgICBcIm1zZWVcIjogXCJjcDEyNTBcIixcbiAgICBcIm1zY3lybFwiOiBcImNwMTI1MVwiLFxuICAgIFwibXNhbnNpXCI6IFwiY3AxMjUyXCIsXG4gICAgXCJtc2dyZWVrXCI6IFwiY3AxMjUzXCIsXG4gICAgXCJtc3R1cmtcIjogXCJjcDEyNTRcIixcbiAgICBcIm1zaGViclwiOiBcImNwMTI1NVwiLFxuICAgIFwibXNhcmFiXCI6IFwiY3AxMjU2XCIsXG4gICAgXCJ3aW5iYWx0cmltXCI6IFwiY3AxMjU3XCIsXG5cbiAgICBcImNwMjA4NjZcIjogXCJrb2k4clwiLFxuICAgIFwiMjA4NjZcIjogXCJrb2k4clwiLFxuICAgIFwiaWJtODc4XCI6IFwia29pOHJcIixcbiAgICBcImNza29pOHJcIjogXCJrb2k4clwiLFxuXG4gICAgXCJjcDIxODY2XCI6IFwia29pOHVcIixcbiAgICBcIjIxODY2XCI6IFwia29pOHVcIixcbiAgICBcImlibTExNjhcIjogXCJrb2k4dVwiLFxuXG4gICAgXCJzdHJrMTA0ODIwMDJcIjogXCJyazEwNDhcIixcblxuICAgIFwidGN2bjU3MTJcIjogXCJ0Y3ZuXCIsXG4gICAgXCJ0Y3ZuNTcxMjFcIjogXCJ0Y3ZuXCIsXG5cbiAgICBcImdiMTk4ODgwXCI6IFwiaXNvNjQ2Y25cIixcbiAgICBcImNuXCI6IFwiaXNvNjQ2Y25cIixcblxuICAgIFwiY3Npc28xNGppc2M2MjIwcm9cIjogXCJpc282NDZqcFwiLFxuICAgIFwiamlzYzYyMjAxOTY5cm9cIjogXCJpc282NDZqcFwiLFxuICAgIFwianBcIjogXCJpc282NDZqcFwiLFxuXG4gICAgXCJjc2hwcm9tYW44XCI6IFwiaHByb21hbjhcIixcbiAgICBcInI4XCI6IFwiaHByb21hbjhcIixcbiAgICBcInJvbWFuOFwiOiBcImhwcm9tYW44XCIsXG4gICAgXCJ4cm9tYW44XCI6IFwiaHByb21hbjhcIixcbiAgICBcImlibTEwNTFcIjogXCJocHJvbWFuOFwiLFxuXG4gICAgXCJtYWNcIjogXCJtYWNpbnRvc2hcIixcbiAgICBcImNzbWFjaW50b3NoXCI6IFwibWFjaW50b3NoXCIsXG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCI4NzQwXCIsXCLkj7DksLLkmIPklqbklbjwp4mn5LW35Jaz8KeyseSzovCns4XjrpXknLbknYTksYfksYDwpIq/8KOYl/CnjZLwprqL8KeDkuSxl/CqjZHknY/kl5rksoXwp7Gs5LSH5Kqk5Jqh8Kaso+eIpfClqZTwoamj8KO4hvCjvaHmmY3lm7tcIl0sXG5bXCI4NzY3XCIsXCLntpXlpJ3wqK6547e06Zy08Kevr+Wvm/ChtZ7lqqTjmKXwqbqw5auR5a635bO85p2u6JaT8KmlheeRoeeSneOhtfChtZPwo5qe8KaAoeO7rFwiXSxcbltcIjg3YTFcIixcIvClo57jq7Xnq7zpvpfwpIWh8KikjfCjh6rwoKqK8KOJnuSMiuiShOm+lumQr+SksOiYk+WilumdiumImOenkOeosuaZoOaoqeiineeRjOevheaegueorOWJj+mBhuOTpuePhPCltrnnk4bpv4flnrPkpK/lkYzkhLHwo5qO5aCY56my8Ketpeiuj+SarvCmuojkhoHwpbaZ566u8KKSvOm/iPCik4HwopOJ8KKTjOm/ieiUhPCjlrvkgrTpv4rkk6Hwqre/5ouB54Gu6b+LXCJdLFxuW1wiODg0MFwiLFwi44eAXCIsNCxcIvCghIzjh4XwoIOR8KCDjeOHhuOHh/Cgg4vwob+o44eI8KCDiuOHieOHiuOHi+OHjPCghI7jh43jh47EgMOBx43DgMSSw4nEmsOIxYzDk8eRw5Lgv7/DisyE4bq+4L+/w4rMjOG7gMOKxIHDoceOw6DJkcSTw6nEm8OoxKvDrceQw6zFjcOzx5LDssWrw7rHlMO5x5bHmMeaXCJdLFxuW1wiODhhMVwiLFwix5zDvOC/v8OqzIThur/gv7/DqsyM4buBw6rJoeKPmuKPm1wiXSxcbltcIjg5NDBcIixcIvCqjqnwoYWFXCJdLFxuW1wiODk0M1wiLFwi5pSKXCJdLFxuW1wiODk0NlwiLFwi5Li95rud6bWO6YefXCJdLFxuW1wiODk0Y1wiLFwi8KecteaSkeS8muS8qOS+qOWFluWFtOWGnOWHpOWKoeWKqOWMu+WNjuWPkeWPmOWbouWjsOWkhOWkh+WksuWktOWtpuWunuWun+WymuW6huaAu+aWieafvuaghOahpea1jueCvOeUtee6pOe6rOe6uue7h+e7j+e7n+e8hue8t+iJuuiLj+iNr+inhuiuvuivoui9pui9p+i9rlwiXSxcbltcIjg5YTFcIixcIueQkeezvOe3jealhuerieWIp1wiXSxcbltcIjg5YWJcIixcIumGjOeiuOmFnuiCvFwiXSxcbltcIjg5YjBcIixcIui0i+iDtvCgp6dcIl0sXG5bXCI4OWI1XCIsXCLogp/pu4fks43pt4npuIzksL7wqbe28KeAjum4ivCqhLPjl4FcIl0sXG5bXCI4OWMxXCIsXCLmuproiL7nlJlcIl0sXG5bXCI4OWM1XCIsXCLkpJHpqazpqo/pvpnnpofwqJGs8KG3ivCgl5Dwoqum5Lik5LqB5LqA5LqH5Lq/5Lur5Ly345GM5L6947mI5YCD5YKI45G945KT45Kl5YaG5aSF5Yeb5Ye85YiF5LqJ5Ym55YqQ5Yyn45eH5Y6p45WR5Y6w45WT5Y+C5ZCj45Wt45Wy45qB5ZKT5ZKj5ZK05ZK55ZOQ5ZOv5ZSY5ZSj5ZSo45aY5ZS/45al45a/5ZeX45eFXCJdLFxuW1wiOGE0MFwiLFwi8Ke2hOWUpVwiXSxcbltcIjhhNDNcIixcIvCgsYLwoLSV8KWEq+WWkPCis4bjp6zwoI2B6LmG8KS2uPCpk6XkgZPwqIK+55268KKwuOOotOSflfCohZ3wpqey8KS3quaTnfCgtbzwoL608KCzlfChg7Tmko3oub7woLqW8KCwi/CgvaTworKp8KiJlvCkk5NcIl0sXG5bXCI4YTY0XCIsXCLwoLWG8KmpjfCog6nkn7TwpLqn8KKzgumqsuOpp/Cpl7Tjv63jlIbwpYuH8KmflPCno4jworWE6bWu6aCVXCJdLFxuW1wiOGE3NlwiLFwi5I+Z8KaCpeaStOWTo/CitYzwoq+K8KGBt+Onu/Chga9cIl0sXG5bXCI4YWExXCIsXCLwppua8KaclvCnpqDmk6rwpYGS8KCxg+i5qPCihqHwqK2M8KCcsVwiXSxcbltcIjhhYWNcIixcIuSgi/Cghqnjv7rlobPworaNXCJdLFxuW1wiOGFiMlwiLFwi8KSXiPCgk7zwpoKX8KC9jPCgtpbllbnkgrvkjrpcIl0sXG5bXCI4YWJiXCIsXCLkqrTwoqmm8KGCneiGqumjtfCgtpzmjbnjp77wop216LeA5Zqh5pG847mDXCJdLFxuW1wiOGFjOVwiLFwi8KqYgfCguInwoquP8KKziVwiXSxcbltcIjhhY2VcIixcIvChg4jwo6eC46aS46iG8KiKm+OVuPCluYnwooOH5ZmS8KC8sfCisrLwqZyg45K85rC98KS4u1wiXSxcbltcIjhhZGZcIixcIvCnlbTworqL8KKIiPCqmZvwqLON8KC5uvCgsLTwpqCc576T8KGDj/CioIPwoqS545e78KWHo/CguozwoL6N8KC6quO+k/CgvLDwoLWH8KGFj/CguYxcIl0sXG5bXCI4YWY2XCIsXCLwoLqr8KCuqfCgtYjwoYOA8KGEveO/ufCimpbmkLLwoL6tXCJdLFxuW1wiOGI0MFwiLFwi8KOPtPCnmLnwoq+O8KC1vvCgtb/worGR8KKxleOomPCgupjwoYOH8KC8rvCqmLLwpq2Q8KizkvCotpnwqLOK6Zaq5ZOM6IuE5Za5XCJdLFxuW1wiOGI1NVwiLFwi8Km7g+mwpumqtvCnnZ7woreu54WA6IWt6IOs5bCc8KaVsuiEtOOel+WNn/Cogr3phrbwoLu68KC4j/CgubfwoLu745ed8KS3q+OYifCgs5blmq/wop618KGDifCguJDwoLm48KGBuPChhYjwqIiH8KGRlfCgubnwpLmQ8KK2pOWplPChgJ3woYCe8KGDtfChg7blnpzwoLiRXCJdLFxuW1wiOGJhMVwiLFwi8KealPCoi43woL618KC5u/Clhb7jnIPwoL628KGGgPCli5jwqoq98KSnmvChoLrwpIW38KiJvOWimeWJqOOYmvClnL3nrrLlrajkoIDkrKzpvKfkp6fpsJ/pro3wpa208KOEveWXu+OXsuWaieS4qOWkgvChr4Hwr6G46Z2R8KCChuS5m+S6u+OUvuWwo+W9keW/hOOjuuaJjOaUteatuuawteawuueBrOeIq+S4rOeKrfCko6nnvZLnpLvns7nnvZPwpomq45OBXCJdLFxuW1wiOGJkZVwiLFwi8KaNi+iAguiCgPCmmJLwpqWR5Y2d6KGk6KeB8KeisuiuoOi0nemShemVuOmVv+mXqPCouI/pn6bpobXpo47po57ppaPwqaCQ6bG86bif6buE5q2v76SH5Li38KCCh+mYneaIt+mSolwiXSxcbltcIjhjNDBcIixcIuWAu+a3vvCpsbPpvqbjt4nooo/wpIWO54G35bO15Kyg8KWHjeOVmfCltLDmhKLwqKiy6L6n6Ye254aR5pyZ54668KOKgfCqhIfjsovwoaaA5KyQ56Ok55CC5Yau8Kicj+SAieapo/CqirrkiKPomI/woKmv56iq8Kmlh/Coq6rpnZXngY3ljKTwooG+6Y+055uZ8Kino+m+p+efneS6o+S/sOWCvOS4r+S8l+m+qOWQtOe2i+WikuWjkPChtrblupLlupnlv4LwopyS5paLXCJdLFxuW1wiOGNhMVwiLFwi8KOPueakmeapg/CjsaPms79cIl0sXG5bXCI4Y2E3XCIsXCLniIDwpJSF546M47ub8KSok+WsleeSueiug/ClsqTwpZqV56qT56+s57OD57ms6Iu46JaX6b6p6KKQ6b6q6Lq56b6r6L+P6JWf6aeg6Yih6b6s8Ki2ufChkL/kgbHkiqLlqJpcIl0sXG5bXCI4Y2M5XCIsXCLpoajmnavkibblnL1cIl0sXG5bXCI4Y2NlXCIsXCLol5bwpKW76Iq/8KeEjeSygfCmtbTltbvwpqyV8Ka+vum+rem+ruWulum+r+abp+e5m+a5l+eniuO2iOSTg/CjiZbwop6W5I6a5JS2XCJdLFxuW1wiOGNlNlwiLFwi5bOV8KOsmuirueWxuOO0kvCjlZHltbjpvrLnhZfklZjwpIOs8KG4o+Sxt+OluOORivCghqTwprGB6KuM5L608KCIueWmv+iFrOmhlvCpo7rlvLtcIl0sXG5bXCI4ZDQwXCIsXCLwoK6fXCJdLFxuW1wiOGQ0MlwiLFwi8KKHgfCopa3khILkmrvwqYG547yH6b6z8KqGteSDuOOfluSbt/CmsYbkhbzwqJqy8KePv+SVreOjlPClkprklaHklJvktonksbvktbbkl6rjv4jwpKyP45mh5JOe5JK95Iet5bS+5bWI5bWW47e846CP5bak5ba546Cg46C45bmC5bq95byl5b6D46SI46SU46S/46WN5oOX5oS95bOl46aJ5oa35oa55oeP46a45ois5oqQ5oul5oyY46e45ZqxXCJdLFxuW1wiOGRhMVwiLFwi46iD5o+i5o+75pCH5pGa46mL5pOA5bSV5Zih6b6f46qX5paG46q95pe/5pmT46uy5pqS46yi5pyW462C5p6k5qCA462Y5qGK5qKE462y462x46275qSJ5qWD54mc5qWk5qaf5qaF46685qeW46+d5qml5qm05qmx5qqC46+s5qqZ46+y5qqr5qq15quU5qu25q6B5q+B5q+q5rG15rKq47OL5rSC5rSG5rSm5raB47Ov5rak5rax5riV5riY5rip5rqG8KingOa6u+a7oua7mum9v+a7qOa7qea8pOa8tOO1hvCjvYHmvoHmvr7jtarjtbXnhrflspnjtorngKzjtpHngZDngZTnga/ngb/ngonwoIyl5I+B45ex8KC7mFwiXSxcbltcIjhlNDBcIixcIvCju5flnr7wpruT54S+8KWfoOOZjuamovCor6nlrbTnqYnwpaOh8KmTmeeppeepvfClpqznqrvnqrDnq4Lnq4Pnh5HwppKN5IeK56ua56ud56uq5Iev5ZKy8KWwgeesi+etleesqfCljI7wpbO+566i562v6I6c8KWutPCmsb/nr5DokKHnrpLnrrjwpbSg47at8KWxpeiSkuevuuewhuewtfCls4HnsYTnsoPwpKKC57Km5pm98KSVuOezieezh+ezpuextOezs+ezteezjlwiXSxcbltcIjhlYTFcIixcIue5p+SUnfCmuYTntZ3wpruW55KN57aJ57ar54S157az57eS8KSBl/CmgKnnt6TjtJPnt7XwoZ+557el8KiNree4nfCmhKHwpoWa57mu57qS5Iyr6ZGs57in572A572B572H56S28KaLkOmnoee+l/CmjZHnvqPwoZmh8KCBqOSVnPCjnabklIPwqIy657+68KaSieiAheiAiOiAneiAqOiAr/CqgofwprOD6IC76IC86IGh8KKclOSmifCmmKbwo7ej8KabqOacpeiCp/CoqYjohIfohJrlorDwopu25rG/8KaSmPCkvrjmk6fwoZKK6IiY8KGhnuapk/CkqaXwpKqV5JG66Iip8KCsjfCmqZLwo7W+5L+58KGTveiTouiNovCmrIrwpKan8KOUsPChnbPwo7e46Iqq5qSb8K+mlOSHm1wiXSxcbltcIjhmNDBcIixcIuiVi+iLkOiMmvCguJbwoZ6045uB8KOFvfCjlZroibvoi6LojJjwo7qL8Ka2o/CmrIXwpq6X8KOXjuO2v+iMneWXrOiOheSUi/CmtqXojqzoj4Hoj5Pjkb7wpruU5qmX6JWa45KW8Ka5gvCiu6/okZjwpa+k6JGx47eT5JOk5qqn6JGK8KOyteelmOiSqPCmrpbwprm38Ka5g+iTnuiQj+iOkeSSoOiSk+iTpPClspHkiYDwpbOA5JWD6JS05auy8Ka6meSUp+iVs+SUluaev+iYllwiXSxcbltcIjhmYTFcIixcIvComKXwqJi76JeB8KeCiOiYgvChloLwp4ON8K+msuSVquiYqOOZiPChoqLlj7fwp46a6Jm+6J2x8KqDuOifrvCisKfonrHon5rooI/lmaHomazmoZbkmI/ooYXooYbwp5eg8KO2ufCnl6TooZ7oopzkmZvoorToorXmj4Hoo4Xnnbfwp5yP6KaH6KaK6Kam6Kap6Kan6Ka88Kiopeinp/CnpKTwp6q96Kqc556T6Ye+6KqQ8KepmeerqfCnrLrwo76P5JyT8KesuOeFvOisjOisn/ClkLDwpZWl6Ky/6K2M6K2N6Kqp8KSpuuiukOium+iqr/Chm5/kmJXooY/ospvwp7WU8Ke2j/Cvp5TjnKXwp7WT6LOW8Ke2mPCntr3otJLotIPwoaSQ6LOb54Gc6LSR8KSzieO7kOi1t1wiXSxcbltcIjkwNDBcIixcIui2qfCogILwoYCU8KSmiuOtvPCohrzwp4SM56un6Lqt6Lq26LuD6YuU6LyZ6Lyt8KiNpfCokJLovqXpjIPwqoqf8KCpkOi+s+SkqvCop57wqJS98KO2u+W7uPCjiaLov7nwqoCU8KiavPColIHwooyl46aA8Ka7l+mAt/ColLzwp6q+6YGh8KiVrPComIvpgqjwqJyT6YOE8KibpumCrumDvemFp+OrsOmGqemHhOeyrPCopLPwobqJ6YiO5rKf6YmB6Ymi8KWWuemKufCoq4bwo7Kb8KisjPCll5tcIl0sXG5bXCI5MGExXCIsXCLwoLSx6Yys6Y2r8KirofCor6vngo/lq4PwqKui8KirpeSlpemJhPCor6zwqLC58Kivv+mNs+mRm+i6vOmWhemWpumQpumWoOa/tuSKufCimbrwqJuY8KGJvPCjuK7kp5/msJzpmbvpmpbkhazpmqPwpruV5oea6Zq256O18KiroOmaveWPjOSmofCmsrjwoIm08KaQkPCpgq/wqYOl8KSrkfChpJXwo4yK6Zyx6JmC6Zy25KiP5JS95JaF8KSrqeeBteWtgemcm+mdnPCph5XpnZflrYrwqYer6Z2f6ZCl5YOQ8KOCt/Cjgrzpnonpnp/pnrHpnr7pn4Dpn5Lpn6DwpZGs6Z+u55Cc8KmQs+mfv+mftfCpkJ3wp6W65KuR6aC06aCz6aGL6aGm46yO8KeFteO1kfCgmLDwpIWcXCJdLFxuW1wiOTE0MFwiLFwi8KWchumjiumit+mjiOmjh+Srv/CmtKfwoZuT5Zaw6aOh6aOm6aOs6Y246aS58KSoqeStsvCpoZfwqaSF6ae16aiM6ai76aiQ6amY8KWcpeObhPCpgrHwqa+V6aug6aui8KmshemrtOSwjumslOmsrfComIDlgLTprLTwpqao46OD8KOBvemtkOmtgPCptL7lqYXwoaGj6a6O8KSJi+mwgumvv+mwjPCpuajpt5Twqb638KqGkvCqhqvwqoOh8KqEo/Cqh5/ptb7ptoPwqoS06biO5qKIXCJdLFxuW1wiOTFhMVwiLFwi6beE8KKFm/CqhpPwqoig8KGku/CqiLPptLnwqoK58KqKtOm6kOm6lem6num6ouS0tOm6qum6r/CkjaTpu4HjraDjp6XjtJ3kvLLjnr7wqLCr6byC6byI5K6W6ZCk8Ka2oum8l+m8lum8ueWan+Waium9hemmuPCpgovpn7Lokb/pvaLpvannq5zpvo7niJbkrr7wpKW18KSmu+eFt/Ckp7jwpI2I8KSpkeeOnvCor5rwoaO656af8KilvvCouLbpjanpj7PwqKmE6Yus6Y6B6Y+L8KilrPCkkrnniJfju6vnnbLnqYPng5DwpJGz8KSPuOeFvvChn6/ngqPwoaK+8KOWmeO7h/ChooXwpZCv8KGfuOOcovChm7vwoaC545uh8KGdtPCho5Hwpb2L45yj8KGbgOWdm/CkqKXwoY++8KGKqFwiXSxcbltcIjkyNDBcIixcIvChj4bwoZK26JSD8KOapuiUg+iRlfCkppTwp4Wl8KO4sfCllZzwo7u78KeBkuSTtPCjm67wqaad8Ka8puafueOcs+OwleO3p+WhrPChpKLmoJDkgZfwo5y/8KSDofCkgovwpISP8KawoeWTi+WanvCmmrHlmpLwoL+f8KCuqPCguI3pj4bwqKyT6Y6c5Lu45YSr46CZ8KSQtuS6vPCgkaXwoI2/5L2L5L6K8KWZkeWpqPCghqvwoI+L46aZ8KCMivCgkJTjkLXkvKnwoIuA8Ki6s/CgibXoq5rwoIiM5LqYXCJdLFxuW1wiOTJhMVwiLFwi5YON5YSN5L6i5LyD8KSojvCjuorkvYLlgK7lgazlgoHkv4zkv6XlgZjlg7zlhZnlhZvlhZ3lhZ7mubbwo5aV8KO4ufCjur/mtbLwoaKE8KO6ieWGqOWHg/Cgl6Dkk53woJKj8KCSkvCgkpHotbrwqKqc8KCcjuWJmeWKpPCgobPli6Hpja7kmbrnhozwpI6M8KCwoPCkpqzwoYOk5qeR8KC4neeRueO7nueSmeeQlOeRlueOmOSujvCkqrzwpIKN5Y+Q45aE54iP8KSDieWWtPCgjYXlk43woK+G5Zyd6Ymd6Zu06Y2m5Z+d5Z6N5Z2/45i+5aOL5aqZ8KiphvChm7rwoZ2v8KGckOWorOWmuOmKj+WpvuWrj+WokvClpYbwoaez8KGhofCkipXjm7XmtIXnkYPlqKHwpbqDXCJdLFxuW1wiOTM0MFwiLFwi5aqB8Kivl/CgkJPpj6DnkozwoYyD54SF5KWy6ZCI8Kinu+mOveOeoOWwnuWynuW5nuW5iPChppbwoaW88KOrruW7jeWtj/ChpIPwoaSE45yB8KGioOObnfChm77jm5PohKrwqKmH8KG2uvCjkbLwqKao5byM5byO8KGkp/ChnqvlqavwoZy75a2E6JiU8KeXveihoOaBvvCioaDwopir5b+b47q48KKWr/Cilr7wqYKI8Ka9s+aHgPCggL7woIGG8KKYm+aGmeaGmOaBtfCispvworSH8KSblPCphY1cIl0sXG5bXCI5M2ExXCIsXCLmkbHwpJml8KKtquOoqfCirKLwo5GQ8KmjqvCiubjmjLfwqpGb5pK25oyx5o+R8KSno/CitafmiqTworKh5pC75pWr5qWy46+08KOCjvCjiq3wpKaJ8KOKq+WUjfCji6DwoaOZ8KmQv+abjvCjionwo4az46ug5IaQ8KWWhPCorKLwpZaP8KGbvPCllZvwpZCl56Ou8KOEg/ChoKrwo4i045Gk8KOIj/CjhoLwpIuJ5pqO8Ka0pOaZq+Suk+aYsPCnobDwober5pmj8KOLkvCji6HmmJ7wpaGy46OR8KOguvCjnrzjrpnwo56i8KOPvueTkOOuluaej/CkmKrmorbmoJ7jr4Tmqr7joaPwo5+V8KSSh+aos+apkuarieashfChpJLmlJHmopjmqYzjr5fmqbrmrZfwo7+A8KOymumOoOmLsvCor6rwqKuLXCJdLFxuW1wiOTQ0MFwiLFwi6YqJ8KiAnvCop5zpkafmtqXmvIvwpKes5rWn8KO9v+O2j+a4hPCkgLzlqL3muIrloYfmtKTnoYLnhLvwpIya8KSJtueDseeJkOeKh+eKlPCkno/wpJyl5YW58KSqpPCgl6vnkbrwo7u48KOZn/CkqYrwpKSX8KW/oeO8huO6sfCkq5/wqLCj8KO8teaCp+O7s+eTjOeQvOmOh+eQt+SSn/Cmt6rklZHnloPjvaPwpLOZ8KS0huO9mOeVleeZs/Cql4bjrJnnkajwqKuM8KSmq/Ckpo7jq7tcIl0sXG5bXCI5NGExXCIsXCLjt43wpKmO47u/8KSnhfCko7Pph7rlnLLpjYLwqKuj8KGhpOWDn/CliKHwpYen55248KOIsuecjuecj+edu/Ckmpfwo56B46me8KSjsOeQuOeSm+O6v/CkqrrwpKuH5IOI8KSqlvCmhq7pjIfwpZaB56Ce56KN56KI56OS54+Q56WZ8KedgfClm6PkhI7nppvokpbnpqXmqK3wo7u656i656e05IWu8KGbpuSEsumIteensfCgtYzwpKaM8KCKmfCjtrrwoZ2u45aX5ZWr45Ww45qq8KCHlPCgsI3nq6LlqZnwopu18KWqr/ClqpzlqI3woImb56Ow5aiq8KWvhuervuSHueexneexreSIkfClrrPwpbq88KW6puezjfCkp7nwoZ6w57KO57G857Ku5qqy57ec57iH57eT572O8KaJoVwiXSxcbltcIjk1NDBcIixcIvCmhZzwp62I57aX8KW6guSJqvCmrbXwoKSW5p+W8KCBjvCjl4/ln4TwppCS8KaPuPCkpaLnv53nrKfwoKCs8KWrqfCltYPnrIzwpbiO6aem6JmF6amj5qic8KOQv+OnovCkp7fwppat6aif8KaWoOiSgPCnhKfwprOR5JOq6IS35JCC6IOG6ISJ6IWC8KaetOmjg/CmqYLoiaLoiaXwpqmR6JGT8Ka2p+iYkPCniJvlqobkhb/woaGA5ayr8KGioeWrpPCho5jomqDwr6a88KO2j+igrfCnkKLlqIJcIl0sXG5bXCI5NWExXCIsXCLooa7kvYXooofoor/oo6bopaXopY3wpZqD6KWU8KeehfCnnoTwqK+18KivmfCorpzwqKe547qt6JKj5Ju15JuP45+y6Ki96Kic8KmRiOW9jemIq/CkioTml5TnhKnng4TwoaGF6bWt6LKf6LOp8Ke3nOWmmuefg+WnsOSNruOblOi4qui6p/CksInovLDovYrki7TmsZjmvrvwooyh5KKb5r255rqL8KGfmumvqeOatfCkpK/pgrvpgpfllbHkpIbphrvpkITwqKmL5IGi8KirvOmQp/CosJ3wqLC76JOl6Kir6ZaZ6Zan6ZaX6ZaW8Ki0tOeRheO7gvCko7/wpKmC8KSPquO7p/CjiKXpmo/wqLun8Ki5pvCouaXju4zwpKet8KSpuPCjv67nkJLnkavju7zpnYHwqYKwXCJdLFxuW1wiOTY0MFwiLFwi5qGH5Kid8KmCk/Cln5/pnZ3pjajwqKaJ8KiwpvCorK/wpo6+6Yq65ayR6K2p5KS854+58KSIm+mem+mdsemkuPCgvKblt4HwqK+F8KSqsumgn/Cpk5rpi7bwqZeX6Yel5JOA8KitkPCkqafwqK2k6aOc8KipheO8gOmIquSkpeiQlOmku+mljfCnrIbjt73pppvkra/ppqrpqZzwqK2l8KWjiOaqj+mooeWrvumor/Cpo7HkrpDwqaWI6aa85K695K6X6Y295aGy8KGMguWgovCkprhcIl0sXG5bXCI5NmExXCIsXCLwoZOo56GE8KKcn/Cjtrjmo4Xjtb3pkZjjpKfmhZDwop6B8KKlq+aEh+mxj+mxk+mxu+mwtemwkOmtv+mvj/CpuK3prp/wqoe18KqDvum0oeSyrvCkhITpuJjksrDptIzwqoa08KqDrfCqg7PwqaSv6bal6JK98Ka4kvCmv5/wpq6C6Je85JSz8Ka2pPCmuoTwprew6JCg6Jeu8Ka4gPCjn5fwpoGk56ei8KOWnPCjmYDkpK3wpKee47Wi6Y+b6Yq+6Y2I8KCKv+eiuemJt+mRjeS/pOORgOmBpPCllZ3noL3noZTnorbnoYvwoZ2X8KOHifCkpYHjmprkvbLmv5rmv5nngJ7ngJ7lkJTwpIa15Z675aOz5Z6K6bSW5Z+X54S045Kv8KSGrOeHq/CmsYDwpL6X5ayo8KGetfCoqYlcIl0sXG5bXCI5NzQwXCIsXCLmhIzlq47lqIvkirzwpJKI45ys5K278KinvOmOu+mOuPCho5bwoLyd6JGy8KazgPChkJPwpIu68KKwpvCkj4HlppTwo7a38Kadgee2qPCmhZvwpoKk8KSmufCkpovwqKe66Yul54+i47up55K08Kito/Chop/ju6HwpKqz5quY54+z54+747uW8KSovvCkqpTwoZ+Z8KSppvCgjqfwoZCk8KSnpeeRiPCkpJbngqXwpKW26YqE54+m6Y2f8KCTvumMsfCoq47wqKiW6Y6G8Kivp/Cll5XkpLXwqKqC54WrXCJdLFxuW1wiOTdhMVwiLFwi8KSlg/Cgs7/lmqTwoJia8KCvq/CgsrjllILnp4TwoZ+657e+8KGbgvCkqZDwoaGS5JSu6ZCB45yK8KirgPCkpq3lprDwoaK/8KGig/CnkoTlqqHjm6Lwo7Wb45qw6Ymf5am58KiqgfChoaLpjbTjs43woKq05KqW46aK5YO047Wp47WM8KGOnOeFteSLu/CoiJjmuI/wqYOk5JOr5rWX8Ke5j+eBp+ayr+OzlvCjv63wo7it5riC5ryM47Wv8KCPteeVkeOavOOTiOSagOO7muShseWnhOmJruSkvui9gfCosJzwpq+A5aCS5Z+I45uW8KGRkueDvvCkjaLwpKmx8KK/o/ChirDwoo695qK55qWn8KGOmPCjk6Xwp6+08KObn/CoqoPwo5+W8KOPuvCksp/mqJrwo5qt8Kayt+iQvuSTn+STjlwiXSxcbltcIjk4NDBcIixcIvCmtKbwprWR8KaygvCmv57mvJfwp4SJ6Iy98KGcuuiPrfCmsoDwp4GT8KGfm+WmieWqgvChnrPlqaHlqbHwoaSF8KSHvOOcreWnr/ChnLzjm4fnho7pjpDmmprwpIql5amu5air8KSKk+aoq/Cju7nwp5y28KSRm/Cki4rnhJ3wpImZ8KinoeS+sPCmtKjls4LwpJOO8Ke5jfCkjr3mqIzwpImW8KGMhOeCpueEs/Ckj6njtqXms5/wr6Cl8KSpj+e5peWnq+W0r+O3s+W9nPCkqZ3woZ+f57ak6JCmXCJdLFxuW1wiOThhMVwiLFwi5ZKF8KOruvCjjIDwoIiU5Z2+8KCjlfCgmJnjv6Xwob6e8KqKtueAg/CphZvltbDnjo/ns5PwqKmZ8KmQoOS/iOe/p+eLjeeMkPCnq7TnjLjnjLnwpZu2542B542I47qp8KesmOmBrOeHtfCko7Lnj6Hoh7bju4rnnIzju5HmsqLlm73nkJnnkJ7nkJ/ju6Lju7Dju7Tju7rnk5PjvI7jvZPnlYLnla3nlbLnlo3jvbznl4jnl5zjv4DnmY3jv5fnmbTjv5znmbrwpL2c54aI5Zij6KaA5aGp5ICd552D5IC55p2h5IGF45eb556Y5IGq5IGv5bGe556+55+L5aOy56CY54K556Cc5IKo56C556GH56GR56Gm6JGI8KWUteeks+agg+eksuSEg1wiXSxcbltcIjk5NDBcIixcIuSEieemkeemmei+u+eohui+vOSFp+eqkeSGsueqvOiJueSHhOerj+erm+SHj+S4oeetouetrOetu+ewkuewm+SJoOSJuuexu+eynOSKjOeyuOSKlOezrei+k+eDgPCgs4/nt4/nt5Tnt5Dnt73nvq7nvrTnip/kjpfogKDogKXnrLnogK7ogLHogZTjt4zlnrTngqDogrfog6nkj63ohIznjKrohI7ohJLnlaDohJTkkIHjrLnohZbohZnohZpcIl0sXG5bXCI5OWExXCIsXCLkkJPloLrohbzohoTkkKXohpPkkK3ohqXln6/oh4Hoh6ToiZTkko/oiqboibboi4roi5joi7/kkrDojZfpmanmporokIXng7XokaTmg6PokojklITokr7ok6Hok7jolJDolLjolZLklLvola/olbDol6DklbfombLompLomrLom6/pmYXonovkmIbkmJfooq7oo7/opKTopYfoppHwp6Wn6Kip6Ki46KqU6Kq06LGR6LOU6LOy6LSc5J6Y5aGf6LeD5J+t5Luu6Li65ZeY5Z2U6Lmx5Ze16Lqw5KC36LuO6Lui6Luk6Lut6Luy6L636L+B6L+K6L+M6YCz6aeE5KKt6aOg6YiT5KSe6Yio6YmY6Ymr6Yqx6Yqu6Yq/XCJdLFxuW1wiOWE0MFwiLFwi6Yuj6Yur6Yuz6Yu06Yu96Y2D6Y6E6Y6t5KWF5KWR6bq/6ZCX5YyB6ZCd6ZCt6ZC+5KWq6ZGU6ZG56ZSt6Zai5Kan6Ze06Ziz5Kel5p6g5Kik6Z2A5Ki16Z6y6Z+C5ZmU5Kuk5oOo6aK55KyZ6aOx5aGE6aSO6aSZ5Ya06aSc6aS36aWC6aWd6aWi5K2w6aeF5K6d6ai86ayP56qD6a2p6a6B6a+d6a+x6a+05LGt6bCg452v8KGvgum1iemwulwiXSxcbltcIjlhYTFcIixcIum7vuWZkOm2k+m2vem3gOm3vOmTtui+tum5u+m6rOm6sem6vem7humTnOm7oum7sem7uOeriOm9hPCggpTwoIq38KCOoOakmumTg+WmrPCgk5floYDpk4HjnrnwoJeV8KCYlfCgmbbwoZq65Z2X54Wz8KCrgvCgq43woK6/5ZGq8K+gu/Cgr4vlkp7woK+78KCwu/CgsZPwoLGl8KCxvOaDp/Cgso3lmbrwoLK18KCznfCgs63woLWv8KC2svCgt4jmpZXpsK/onqXwoLiE8KC4jvCgu5fwoL6Q8KC8rfCgubPlsKDwoL685biL8KGBnPChgY/woYG25pye8KGBu/ChgojwoYKW45mH8KGCv/Chg5PwoYSv8KGEu+WNpOiSrfChi6PwoY218KGMtuiugfChlbfwoZiZ8KGfg/Chn4fkubjngrvwoaCt8KGlqlwiXSxcbltcIjliNDBcIixcIvChqK3woamF8KGwqvChsbDwobKs8KG7iOaLg/Chu5XwobyV54aY5qGV8KKBheanqeObiPCiibzwoo+X8KKPuvCinKrwoqGx8KKlj+iLvfCipafwoqaT8KKrleimpfCiq6jovqDwoqyO6Z648KKsv+mhh+mqvfCisYxcIl0sXG5bXCI5YjYyXCIsXCLworKI8KKyt/Clr6jworSI8KK0kvCitrfworaV8KK5gvCivbTwor+M8KOAs/Cjgabwo4yf8KOPnuW+seaZiOaav/Cnqbnwo5Wn8KOXs+eIgfCkprrnn5fwo5ia8KOclue6h/CgjYblorXmnI5cIl0sXG5bXCI5YmExXCIsXCLmpJjwo6qn8KeZl/Clv6Lwo7iR8KO6ufCnl77wooKa5KOQ5Kq48KSEmfCoqprwpIuu8KSMjfCkgLvwpIy08KSOlvCkqYXwoJeK5YeS8KCYkeWmn/Chuqjjrr7wo7O/8KSQhPCkk5blnojwpJm046ab8KScr/Col6jwqaeJ452i8KKHg+itnvCorY7pp5bwpKCS8KSju/CkqJXniInwpKuA8KCxuOWlpfCkuqXwpL6G8KCduei7mvClgKzlio/lnL/nhbHwpYqZ8KWQmfCjvYrwpKqn5Za88KWRhvClka7wpq2S6YeU45Gz8KWUv/CnmLLwpZWe5JyY8KWVovCllabwpZ+H8KSkv/CloZ3lgabjk7vwo4+M5oOe8KWkg+SdvPCopYjwpaqu8KWuifClsIbwobaQ5Z6h54WR5r628KaEgvCnsJLpgZbwpoay8KS+muitovCmkILwppGKXCJdLFxuW1wiOWM0MFwiLFwi5bWb8Kavt+i8tvCmkoTwoaSc6Kuq8KSntvCmkojwo7+v8KaUkuSvgPCmlr/wppq18KKcm+mRpfCln6HmhpXlqKfwr6ON5L675Zq58KSUofCmm7zkuarwpKS06ZmW5raP8KayveOYmOilt/CmnpnwpqGu8KaQkfCmoZ7nh5/wpqOH562C8KmDgPCgqJHwpqSm6YSE8Kakueephem3sPCmp7rpqKbwpqit45mf8KaRqfCggKHnpoPwpqi08Katm+W0rPCjlJnoj4/wpq6d5JuQ8KaypOeUu+ihpfCmtq7lorZcIl0sXG5bXCI5Y2ExXCIsXCLjnJzwopaN8KeBi/Cnh43jsZTwp4qA8KeKhemKgfCihbrwp4qL6Yyw8KeLpvCkp5DmsLnpkp/wp5GQ8KC7uOigp+ijtfCipKbwqJGz8KGesea6uPCkqKrwoaCg46ak45q55bCQ56ej5JS/5pq28KmyrfCpoqTopYPwp5+M8KehmOWbluSDn/ChmIrjpqHwo5yv8KiDqPChj4Xnhq3ojabwp6ed8KmGqOWpp+Syt/Cngq/wqKar8KenvfCnqIrwp6yL8Ke1pvCkhbrnrYPnpb7wqICJ5r618KqLn+aog/CojJjljqLwpriH6Y6/5qC26Z2d8KiFr/CogKPwpqa18KGPrfCjiK/wqIGI5baF8KiwsPCogoPlnJXpoKPwqKWJ5bar8KSmiOaWvuanleWPkvCkqqXwo76B47CR5py28KiCkPCog7TwqISu8KG+ofCohY9cIl0sXG5bXCI5ZDQwXCIsXCLwqIaJ8KiGr/CoiJrwqIyG8KiMr/Cojorjl4rwqJGo8KiaquSjuuaPpvCopZbnoIjpiZXwqKa45I+y8Kinp+SPn/Cop6jwqK2G8KivlOWnuPCosInovIvwqL+F8KmDrOetkfCphJDwqYS847e38KmFnvCkq4rov5Dnio/lmovwqZOn8KmXqfCplrDwqZa48KmcsvCpo5HwqaWJ8KmlqvCpp4Pwqaio8KmsjvCptZrwqbab57qf8Km7uPCpvKPksqTplYfwqoqT54ai8KqLv+S2kemAkvCql4vktpzwoLKc6L6+5ZeBXCJdLFxuW1wiOWRhMVwiLFwi6L668KKSsOi+ufCkqpPklInnub/mvZbmqrHku6rjk6TwqKys8KeineOcuui6gPChn7XwqICk8KitrPCorpnwp6i+8Kaar+O3q/CnmZXwo7K38KWYtfClpZbkuprwpbqB8KaJmOWav/Cgua3ouI7lra3wo7qI8KSynuaPnuaLkPChn7bwoaG75pSw5Zit8KWxiuWQmvCljJHjt4bwqbaY5LG95Zii5Zie572J8KW7mOWltfCjtYDonbDkuJzwoL+q8KC1ifCjmrrohJfptZ7otJjnmLvpsYXnmY7nnrnpjYXlkLLohYjoi7flmKXohLLokJjogr3ll6rnpaLlmYPlkJbwoLqd45eO5ZiF5Zex5pux8KiLouOYreeUtOWXsOWWuuWSl+WVsvCgsYHwoLKW5buQ8KWFiPCgubbworGiXCJdLFxuW1wiOWU0MFwiLFwi8KC6oum6q+e1muWXnvChgbXmip3pna3lkpTos43nh7bphbbmj7zmjrnmj77llanwoq2D6bGy8KK6s+WGmuOTn/CgtqflhqflkY3llJ7llJPnmabouK3wpqKK55ax6IK26KCE6J6G6KOH6Ia26JCc8KGDgeSTrOeMhPCknIblrpDojIvwpqKT5Zm78KKbtPCntK/wpIaj8Ke1s/Cmu5Dwp4q26YWw8KGHmemIiPCjs7zwqpqp8KC6rPCgu7nniabwobKi5J2O8KS/gvCnv7nwoL+r5IO6XCJdLFxuW1wiOWVhMVwiLFwi6bGd5pSf8KK2oOSjs/Ckn6DwqbW88KC/rPCguIrmgaLwp5aj8KC/rVwiXSxcbltcIjllYWRcIixcIvCmgYjwoYaH54aj57qO6bWQ5Lia5LiE45W35ayN5rKy5Y2n45qs46ec5Y2945ql8KSYmOWimvCkra7oiK3lkYvlnqrwpaqV8KCluVwiXSxcbltcIjllYzVcIixcIuOpkvCikaXnjbTwqbqs5LSJ6a+t8KOzvvCpvLDksZvwpL6p8KmWnvCpv57okZzwo7a28KeKsvCmnrPwo5yg5oyu57Sl8KO7t/CjuKzjqKrpgIjli4zjubTjmbrkl6nwoJKO55mA5auw8KC6tuehuvCnvK7loqfkgr/lmbzprovltbTnmZTwqpC06bqF5LOh55e545+75oSZ8KODmvCkj7JcIl0sXG5bXCI5ZWY1XCIsXCLlmZ3woYqp5Z6n8KSlo/CpuIbliLTwp4Ku45at5rGK6bW8XCJdLFxuW1wiOWY0MFwiLFwi57GW6ay55Z+e8KGdrOWxk+aTk/Cpk5Dwpoy18KeFpOiarfCgtKjwprSi8KSrovCgtbFcIl0sXG5bXCI5ZjRmXCIsXCLlh77wobyP5baO6ZyD8KG3kem6gemBjOesn+msguWzkeeuo+aJqOaMtemrv+evj+msquexvumsruexgueyhumwleevvOmsiem8l+mwm/CkpL7pvZrllbPlr4Pkv73pupjkv7LliaDjuIbli5HlnaflgZblprfluJLpn4jptqvovZzlkanpnrTppYDpnrrljKzmhLBcIl0sXG5bXCI5ZmExXCIsXCLmpKzlj5rpsIrptILksLvpmYHmpoDlgqbnlYbwoZ2t6aea5YmzXCJdLFxuW1wiOWZhZVwiLFwi6YWZ6ZqB6YWcXCJdLFxuW1wiOWZiMlwiLFwi6YWR8Ki6l+aNv/CmtKPmq4rlmJHpho7nlbrmioXwoI+8542P57Gw8KWwofCjs71cIl0sXG5bXCI5ZmMxXCIsXCLwpKSZ55uW6a6d5Liq8KCzlOiOvuihglwiXSxcbltcIjlmYzlcIixcIuWxiuangOWDreWduuWIn+W3teS7juawsfCgh7LkvLnlkpzlk5rliprotoLjl77lvIzjl7NcIl0sXG5bXCI5ZmRiXCIsXCLmrZLphbzpvqXprpfpoK7porTpqrrpuqjpuoTnhbrnrJRcIl0sXG5bXCI5ZmU3XCIsXCLmr7rooJjnvbhcIl0sXG5bXCI5ZmViXCIsXCLlmKDwqpmK6Lm36b2TXCJdLFxuW1wiOWZmMFwiLFwi6LeU6LmP6bic6LiB5oqC8KiNvei4qOi5teerk/CkqbfnqL7no5jms6roqafnmIdcIl0sXG5bXCJhMDQwXCIsXCLwqKma6bym5rOO6J+W55eD8KqKsuehk/CvoYDotIzni6LnjbHorK3njILnk7Hos6vwpKq76Jiv5b666KKg5JK3XCJdLFxuW1wiYTA1NVwiLFwi8KGgu/CmuIVcIl0sXG5bXCJhMDU4XCIsXCLoqb7wopSbXCJdLFxuW1wiYTA1YlwiLFwi5oO955mn6auX6bWE6Y2u6a6P6J+1XCJdLFxuW1wiYTA2M1wiLFwi6KCP6LO354ys6Zyh6a6w45eW54qy5LCH57GR6aWK8KaFmeaFmeSwhOm6luaFvVwiXSxcbltcImEwNzNcIixcIuWdn+aFr+aKpuaIueaLjuOpnOaHouWOqvCjj7XmjaTmoILjl5JcIl0sXG5bXCJhMGExXCIsXCLltZfwqK+C6L+a8Ki4uVwiXSxcbltcImEwYTZcIixcIuWDmfChtYbnpIbljLLpmLjwoLy75IGlXCJdLFxuW1wiYTBhZVwiLFwi55++XCJdLFxuW1wiYTBiMFwiLFwi57OC8KW8muezmueoreiBpuiBo+e1jeeUheeTsuimlOiImuacjOiBovCnkobogZvnk7DohIPnnKToponwpp+M55WT8Ka7keieqeifjuiHiOiejOipieiyreitg+ecq+eTuOiTmuOYteamsui2plwiXSxcbltcImEwZDRcIixcIuimqeeRqOa2ueifgfCkgJHnk6fjt5vnhbbmgqTmhpzjs5HnhaLmgbdcIl0sXG5bXCJhMGUyXCIsXCLnvbHwqKyt54mQ5oOp5K2+5Yig47CY8KOzh/Clu5fwp5mW8KWUsfChpYTwoYu+8Kmkg/Cmt5zwp4Kt5bOB8KaGrfCoqI/wo5m38KCDrvCmoYbwpLyO5JWi5ayf8KaNjOm9kOm6pvCmiatcIl0sXG5bXCJhM2MwXCIsXCLikIBcIiwzMSxcIuKQoVwiXSxcbltcImM2YTFcIixcIuKRoFwiLDksXCLikbRcIiw5LFwi4oWwXCIsOSxcIuS4tuS4v+S6heS6oOWGguWGluWGq+WLueWMuOWNqeWOtuWkiuWugOW3m+K8s+W5v+W7tOW9kOW9oeaUtOaXoOeWkueZtui+tematsKoy4bjg73jg77jgp3jgp7jgIPku53jgIXjgIbjgIfjg7zvvLvvvL3inL3jgYFcIiwyM10sXG5bXCJjNzQwXCIsXCLjgZlcIiw1OCxcIuOCoeOCouOCo+OCpFwiXSxcbltcImM3YTFcIixcIuOCpVwiLDgxLFwi0JBcIiw1LFwi0IHQllwiLDRdLFxuW1wiYzg0MFwiLFwi0JtcIiwyNixcItGR0LZcIiwyNSxcIuKHp+KGuOKGueOHj/Cgg4zkuZrwoIKK5YiC5JKRXCJdLFxuW1wiYzhhMVwiLFwi6b6w5YaI6b6x8KeYh1wiXSxcbltcImM4Y2RcIixcIu+/ou+/pO+8h++8guOIseKEluKEoeOCm+OCnOK6gOK6hOK6huK6h+K6iOK6iuK6jOK6jeK6leK6nOK6neK6peK6p+K6quK6rOK6ruK6tuK6vOK6vuK7huK7iuK7jOK7jeK7j+K7luK7l+K7nuK7o1wiXSxcbltcImM4ZjVcIixcIsqDyZDJm8mUybXFk8O4xYvKismqXCJdLFxuW1wiZjlmZVwiLFwi77+tXCJdLFxuW1wiZmE0MFwiLFwi8KCVh+mLm/Cgl5/wo7+F6JWM5Iq154+v5Ya145mJ8KSlgvCop6TpjYTwoaeb6Iuu8KOziOegvOadhOaLn/CkpLPwqKaq8KCKoPCmrrPwoYyF5L6r8KKTreWAiPCmtKnwp6qE8KOYgPCkqrHwopST5YCp8KCNvuW+pPCgjoDwoI2H5rub8KCQn+WBveWEgeORuuWEjumhrOOdg+iQlvCkpqTwoJKH5YWg8KOOtOWFqvCgr7/wooO88KCLpfCilLDwoJaO8KOIs/ChpoPlroLonb3woJaz8KOymeWGsuWGuFwiXSxcbltcImZhYTFcIixcIum0tOWHieWHj+WHkeOznOWHk/CkqqblhrPlh6LljYLlh63oj43mpL7wo5yt5b275YiL5Yim5Yi85Yq15YmX5YqU5Yq55YuF57CV6JWC5Yug6JiN8Kask+WMhfCoq57llYnmu5nwo76A8KCllPCjv6zljLPljYTwoK+i5rOL8KGcpuagm+ePleaBiuO6quOjjPChm6jnh53kkqLlja3ljbTwqJqr5Y2+5Y2/8KGWlvChmJPnn6bljpPwqKqb5Y6g5Y6r5Y6u546n8KWdsuO9meeOnOWPgeWPheaxieS5ieWfvuWPmeOqq/Cgro/lj6Dwo7+r8KK2o+WPtvCgsbflkJPngbnllKvmmZfmtZvlka3wpq2T8KC1tOWVneWSj+WSpOSepvChnI3woLud47a08KC1jVwiXSxcbltcImZiNDBcIixcIvCoprzwopqY5ZWH5LOt5ZCv55CX5ZaG5Zap5ZiF8KGjl/CkgLrklZLwpJC15pqz8KGCtOWYt+abjfCjiormmqTmmq3lmY3lmY/no7Hlm7Hpnoflj77lnIDlm6/lm63wqK2m45ij8KGJj+WdhvCkhqXmsa7ngovlnYLjmrHwprG+5Z+m8KGQluWgg/ChkZTwpI2j5aCm8KSvteWhnOWiquOVoeWjoOWjnPChiLzlo7vlr7/lnYPwqoWQ8KSJuOmPk+OWoeWkn+aipuObg+a5mVwiXSxcbltcImZiYTFcIixcIvChmL7lqKTllZPwoZqS6JSF5aeJ8KC1jvCmsoHwprSq8KGfnOWnmfChn7vwoZ6y8Ka2pua1sfChoKjwoZuV5ae58Ka5heWqq+Wpo+ObpvCkpqnlqbfjnIjlqpbnkaXlq5Pwpr6h8KKVlOO2hfChpJHjnLLwoZq45bqD5YuQ5a225paI5a288KeojuSAhOShnfCgiITlr5XmhaDwoai08KWnjPCglqXlr7Plrp3ktJDlsIXwoa2E5bCT54+O5bCU8KGypfCmrKjlsYnko53lsoXls6nls6/ltovwobe58KG4t+W0kOW0mOW1hvChuqTlsrrlt5foi7zjoK3wpKSB8KKBifCihbPoiofjoLbjr4LluK7mqorlubXlubrwpJK88KCzk+WOpuS6t+W7kOWOqPChnbHluInlu7TwqJKCXCJdLFxuW1wiZmM0MFwiLFwi5bu55bu746Kg5bu85qC+6ZCb5byN8KCHgfCvopTjq57koq7woYy65by68KaiiPCij5DlvZjwopGx5b2j6Z698Ka5ruW9sumNgPCoqLblvqfltrbjtZ/wpYmQ8KG9qvCng7jwopmo6YeW8KCKnvCoqKnmgLHmmoXwoaG346Wj47eH45i55Z6Q8KKetOelseO5gOaCnuaCpOaCs/CkpoLwpKaP8Kepk+eSpOWDoeWqoOaFpOiQpOaFgvCvoqbwpruS5oaB5Ye08KCZluaGh+WuqvCjvrdcIl0sXG5bXCJmY2ExXCIsXCLwoqGf5oeT8KiunfCppZ3mh5DjpLLwoqaA8KKjgeaAo+aFnOaUnuaOi/CghJjmi4XwoZ2w5ouV8KK4jeaNrPCkp5/jqJfmkLjmj7jwoY6O8KGfvOaSkOa+ivCiuLbpoJTwpIKM8KWcneaToeaTpemRu+OppuaQuuOpl+aVjea8lvCkqKjwpKij5paF5pWt5pWf8KOBvuaWtfCkpYDkrLfml5Hkg5jwoaCp5peg5pej5b+f8KOQgOaYmPCjh7fwo4e45pmE8KOGpPCjhqXmmYvwoLm15pmn8KWHpuaZs+aZtPChuL3wo4ix8KiXtPCjh4jwpYyT55+F8KKjt+mmpOacgvCkjpzwpKih46yr5qe68KOfguadnuadp+adovCkh43wqYOt5p+X5JOp5qCi5rmQ6Yi85qCB8KOPpvCmtqDmoZ1cIl0sXG5bXCJmZDQwXCIsXCLwo5Gv5qeh5qiL8Kirn+als+ajg/Cjl43mpIHmpIDjtLLjqIHwo5i8466A5p6s5qWh8KipiuSLvOaktuammOOuofCgj4nojaPlgpDmp7nwo5mZ8KKEquaphfCjnIPmqp3jr7PmnrHmq4jwqYac47CN5qyd8KCko+aDnuasteattPCin43murXwo6ub8KCOtfChpZjjnYDlkKHwo62a5q+h8KO7vOavnOawt/CikovwpKOx8KatkeaxmuiIpuaxufCjtrzkk4Xwo7a98KSGpPCkpIzwpKSAXCJdLFxuW1wiZmRhMVwiLFwi8KOzieObpeOzq/CgtLLproPwo4e58KKSkee+j+agt/CmtKXwprah8Ka3q+a2lua1nOa5vOa8hPCkpb/wpIKF8Ka5suiUs/CmvbTlh4fmspzmuJ3okK7wqKyh5riv8KO4r+eRk/CjvoLnp4zmuY/lqpHwo4GL5r+445yN5r6d8KO4sOa7uvChkpfwpIC95JWV6Y+w5r2E5r2c47WO5r208KmFsOO0u+a+n/CkhYTmv5PwpIKR8KSFlfCkgLnwo7+w8KO+tPCkhL/lh5/wpIWW8KSFl/CkhYDwpoed54GL54G+54Kn54KB54OM54OV54OW54Of5ISE47eo54a054aW8KSJt+eEq+eFheWqiOeFiueFruWynPCkjaXnhY/pjaLwpIuB54Ss8KSRmvCkqKfwpKii54a68KivqOeCveeIjlwiXSxcbltcImZlNDBcIixcIumRgueIleWkkemRg+eIpOmNgfClmIXniK7niYDwpKW05qK954mV54mX47mV8KOBhOagjea8veeKgueMqueMq/CkoKPwqKCr5KOt8KighOeMqOeMruePj+eOqvCgsLrwpqiu54+J55GJ8KSHovChm6fwpKik5pij45uF8KSmt/Ckpo3wpKe754+355CV5qSD8KSopueQufCgl4Pju5fnkZzwoqKt55Gg8Ki6sueRh+ePpOeRtuiOueeRrOOcsOeRtOmPseaorOeSguSlk/CkqoxcIl0sXG5bXCJmZWExXCIsXCLwpIWf8KSpufCoro/lrYbwqLCD8KGinueTiPChpojnlI7nk6nnlJ7wqLuZ8KGpi+Wvl/CouqzpjoXnlY3nlYrnlafnla7wpL6C47yE8KS0k+eWjueRneeWnueWtOeYgueYrOeZkeeZj+eZr+eZtvCmj7XnmpDoh6/jn7jwpqSR8Kakjueaoeeapeeat+ebjPCmvp/okaLwpYKd8KWFvfChuJznnJ7nnKbnnYDmkq/wpYig552Y8KOKrOeer/CopaTwqKWo8KGbgeeftOegifChjbbwpKiS5qOK56Kv56OH56OT6Zql56Su8KWXoOejl+ektOeisfCnmIzovrjoooTwqKyr8KaCg/CimJznpobopIDmpILnpoDwpaGX56ad8KesueekvOemqea4qvCnhKbjuqjnp4bwqYSN56eUXCJdXG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCIwXCIsXCJcXHUwMDAwXCIsMTI3LFwi4oKsXCJdLFxuW1wiODE0MFwiLFwi5LiC5LiE5LiF5LiG5LiP5LiS5LiX5Lif5Lig5Lih5Lij5Lim5Lip5Liu5Liv5Lix5Liz5Li15Li35Li85LmA5LmB5LmC5LmE5LmG5LmK5LmR5LmV5LmX5Lma5Lmb5Lmi5Lmj5Lmk5Lml5Lmn5Lmo5LmqXCIsNSxcIuS5suS5tFwiLDksXCLkub9cIiw2LFwi5LqH5LqKXCJdLFxuW1wiODE4MFwiLFwi5LqQ5LqW5LqX5LqZ5Lqc5Lqd5Lqe5Lqj5Lqq5Lqv5Lqw5Lqx5Lq05Lq25Lq35Lq45Lq55Lq85Lq95Lq+5LuI5LuM5LuP5LuQ5LuS5Lua5Lub5Luc5Lug5Lui5Lum5Lun5Lup5Lut5Luu5Luv5Lux5Lu05Lu45Lu55Lu65Lu85Lu+5LyA5LyCXCIsNixcIuS8i+S8jOS8klwiLDQsXCLkvJzkvJ3kvKHkvKPkvKjkvKnkvKzkvK3kvK7kvLHkvLPkvLXkvLfkvLnkvLvkvL5cIiw0LFwi5L2E5L2F5L2HXCIsNSxcIuS9kuS9lOS9luS9oeS9ouS9puS9qOS9quS9q+S9reS9ruS9seS9suS9teS9t+S9uOS9ueS9uuS9veS+gOS+geS+guS+heS+huS+h+S+iuS+jOS+juS+kOS+kuS+k+S+leS+luS+mOS+meS+muS+nOS+nuS+n+S+oeS+olwiXSxcbltcIjgyNDBcIixcIuS+pOS+q+S+reS+sFwiLDQsXCLkvrZcIiw4LFwi5L+A5L+B5L+C5L+G5L+H5L+I5L+J5L+L5L+M5L+N5L+SXCIsNCxcIuS/meS/m+S/oOS/ouS/pOS/peS/p+S/q+S/rOS/sOS/suS/tOS/teS/tuS/t+S/ueS/u+S/vOS/veS/v1wiLDExXSxcbltcIjgyODBcIixcIuWAi+WAjuWAkOWAkeWAk+WAleWAluWAl+WAm+WAneWAnuWAoOWAouWAo+WApOWAp+WAq+WAr1wiLDEwLFwi5YC75YC95YC/5YGA5YGB5YGC5YGE5YGF5YGG5YGJ5YGK5YGL5YGN5YGQXCIsNCxcIuWBluWBl+WBmOWBmeWBm+WBnVwiLDcsXCLlgaZcIiw1LFwi5YGtXCIsOCxcIuWBuOWBueWBuuWBvOWBveWCgeWCguWCg+WChOWChuWCh+WCieWCiuWCi+WCjOWCjlwiLDIwLFwi5YKk5YKm5YKq5YKr5YKtXCIsNCxcIuWCs1wiLDYsXCLlgrxcIl0sXG5bXCI4MzQwXCIsXCLlgr1cIiwxNyxcIuWDkFwiLDUsXCLlg5flg5jlg5nlg5tcIiwxMCxcIuWDqOWDqeWDquWDq+WDr+WDsOWDseWDsuWDtOWDtlwiLDQsXCLlg7xcIiw5LFwi5YSIXCJdLFxuW1wiODM4MFwiLFwi5YSJ5YSK5YSMXCIsNSxcIuWEk1wiLDEzLFwi5YSiXCIsMjgsXCLlhYLlhYflhYrlhYzlhY7lhY/lhZDlhZLlhZPlhZflhZjlhZnlhZvlhZ1cIiw0LFwi5YWj5YWk5YWm5YWn5YWp5YWq5YWv5YWy5YW65YW+5YW/5YaD5YaE5YaG5YaH5YaK5YaL5YaO5YaP5YaQ5YaR5YaT5YaU5YaY5Yaa5Yad5Yae5Yaf5Yah5Yaj5YamXCIsNCxcIuWGreWGruWGtOWGuOWGueWGuuWGvuWGv+WHgeWHguWHg+WHheWHiOWHiuWHjeWHjuWHkOWHklwiLDVdLFxuW1wiODQ0MFwiLFwi5YeY5YeZ5Yea5Yec5Yee5Yef5Yei5Yej5YelXCIsNSxcIuWHrOWHruWHseWHsuWHtOWHt+WHvuWIhOWIheWIieWIi+WIjOWIj+WIkOWIk+WIlOWIleWInOWInuWIn+WIoeWIouWIo+WIpeWIpuWIp+WIquWIrOWIr+WIseWIsuWItOWIteWIvOWIvuWJhFwiLDUsXCLliYvliY7liY/liZLliZPliZXliZfliZhcIl0sXG5bXCI4NDgwXCIsXCLliZnliZrliZvliZ3liZ/liaDliaLliaPliaTliabliajliavliazlia3lia7libDlibHlibNcIiw5LFwi5Ym+5YqA5YqDXCIsNCxcIuWKiVwiLDYsXCLlipHlipLlipRcIiw2LFwi5Yqc5Yqk5Yql5Yqm5Yqn5Yqu5Yqv5Yqw5Yq0XCIsOSxcIuWLgOWLgeWLguWLhOWLheWLhuWLiOWLiuWLjOWLjeWLjuWLj+WLkeWLk+WLlOWLleWLl+WLmVwiLDUsXCLli6Dli6Hli6Lli6Pli6VcIiwxMCxcIuWLsVwiLDcsXCLli7vli7zli73ljIHljILljIPljITljIfljInljIrljIvljIzljI5cIl0sXG5bXCI4NTQwXCIsXCLljJHljJLljJPljJTljJjljJvljJzljJ7ljJ/ljKLljKTljKXljKfljKjljKnljKvljKzljK3ljK9cIiw5LFwi5Yy85Yy95Y2A5Y2C5Y2E5Y2G5Y2L5Y2M5Y2N5Y2Q5Y2U5Y2Y5Y2Z5Y2b5Y2d5Y2l5Y2o5Y2q5Y2s5Y2t5Y2y5Y225Y255Y275Y285Y295Y2+5Y6A5Y6B5Y6D5Y6H5Y6I5Y6K5Y6O5Y6PXCJdLFxuW1wiODU4MFwiLFwi5Y6QXCIsNCxcIuWOluWOl+WOmeWOm+WOnOWOnuWOoOWOoeWOpOWOp+WOquWOq+WOrOWOreWOr1wiLDYsXCLljrfljrjljrnljrrljrzljr3ljr7lj4Dlj4NcIiw0LFwi5Y+O5Y+P5Y+Q5Y+S5Y+T5Y+V5Y+a5Y+c5Y+d5Y+e5Y+h5Y+i5Y+n5Y+05Y+65Y++5Y+/5ZCA5ZCC5ZCF5ZCH5ZCL5ZCU5ZCY5ZCZ5ZCa5ZCc5ZCi5ZCk5ZCl5ZCq5ZCw5ZCz5ZC25ZC35ZC65ZC95ZC/5ZGB5ZGC5ZGE5ZGF5ZGH5ZGJ5ZGM5ZGN5ZGO5ZGP5ZGR5ZGa5ZGdXCIsNCxcIuWRo+WRpeWRp+WRqVwiLDcsXCLlkbTlkbnlkbrlkb7lkb/lkoHlkoPlkoXlkoflkojlkonlkorlko3lkpHlkpPlkpflkpjlkpzlkp7lkp/lkqDlkqFcIl0sXG5bXCI4NjQwXCIsXCLlkqLlkqXlkq7lkrDlkrLlkrXlkrblkrflkrnlkrrlkrzlkr7lk4Plk4Xlk4rlk4vlk5blk5jlk5vlk6BcIiw0LFwi5ZOr5ZOs5ZOv5ZOw5ZOx5ZO0XCIsNSxcIuWTu+WTvuWUgOWUguWUg+WUhOWUheWUiOWUilwiLDQsXCLllJLllJPllJVcIiw1LFwi5ZSc5ZSd5ZSe5ZSf5ZSh5ZSl5ZSmXCJdLFxuW1wiODY4MFwiLFwi5ZSo5ZSp5ZSr5ZSt5ZSy5ZS05ZS15ZS25ZS45ZS55ZS65ZS75ZS95ZWA5ZWC5ZWF5ZWH5ZWI5ZWLXCIsNCxcIuWVkeWVkuWVk+WVlOWVl1wiLDQsXCLllZ3llZ7llZ/llaDllaLllaPllajllanllavlla9cIiw1LFwi5ZW55ZW65ZW95ZW/5ZaF5ZaG5ZaM5ZaN5ZaO5ZaQ5ZaS5ZaT5ZaV5ZaW5ZaX5Zaa5Zab5Zae5ZagXCIsNixcIuWWqFwiLDgsXCLllrLllrTllrbllrjllrrllrzllr9cIiw0LFwi5ZeG5ZeH5ZeI5ZeK5ZeL5ZeO5ZeP5ZeQ5ZeV5ZeXXCIsNCxcIuWXnuWXoOWXouWXp+WXqeWXreWXruWXsOWXseWXtOWXtuWXuFwiLDQsXCLll7/lmILlmIPlmITlmIVcIl0sXG5bXCI4NzQwXCIsXCLlmIblmIflmIrlmIvlmI3lmJBcIiw3LFwi5ZiZ5Zia5Zic5Zid5Zig5Zih5Zii5Zil5Zim5Zio5Zip5Ziq5Zir5Ziu5Ziv5Ziw5Ziz5Zi15Zi35Zi45Zi65Zi85Zi95Zi+5ZmAXCIsMTEsXCLlmY9cIiw0LFwi5ZmV5ZmW5Zma5Zmb5ZmdXCIsNF0sXG5bXCI4NzgwXCIsXCLlmaPlmaXlmablmaflma3lma7lma/lmbDlmbLlmbPlmbTlmbXlmbflmbjlmbnlmbrlmb1cIiw3LFwi5ZqHXCIsNixcIuWakOWakeWakuWalFwiLDE0LFwi5ZqkXCIsMTAsXCLlmrBcIiw2LFwi5Zq45Zq55Zq65Zq75Zq9XCIsMTIsXCLlm4tcIiw4LFwi5ZuV5ZuW5ZuY5ZuZ5Zuc5Zuj5ZulXCIsNSxcIuWbrOWbruWbr+WbsuWbs+WbtuWbt+WbuOWbu+WbvOWcgOWcgeWcguWcheWch+Wci1wiLDZdLFxuW1wiODg0MFwiLFwi5ZySXCIsOSxcIuWcneWcnuWcoOWcoeWcouWcpOWcpeWcpuWcp+Wcq+WcseWcsuWctFwiLDQsXCLlnLzlnL3lnL/lnYHlnYPlnYTlnYXlnYblnYjlnYnlnYvlnZJcIiw0LFwi5Z2Y5Z2Z5Z2i5Z2j5Z2l5Z2n5Z2s5Z2u5Z2w5Z2x5Z2y5Z205Z215Z245Z255Z265Z295Z2+5Z2/5Z6AXCJdLFxuW1wiODg4MFwiLFwi5Z6B5Z6H5Z6I5Z6J5Z6K5Z6NXCIsNCxcIuWelFwiLDYsXCLlnpzlnp3lnp7lnp/lnqXlnqjlnqrlnqzlnq/lnrDlnrHlnrPlnrXlnrblnrflnrlcIiw4LFwi5Z+EXCIsNixcIuWfjOWfjeWfkOWfkeWfk+WfluWfl+Wfm+WfnOWfnuWfoeWfouWfo+WfpVwiLDcsXCLln67ln7Dln7Hln7Lln7Pln7Xln7bln7fln7vln7zln77ln7/loIHloIPloITloIXloIjloInloIrloIzloI7loI/loJDloJLloJPloJTloJbloJfloJjloJrloJvloJzloJ3loJ/loKLloKPloKVcIiw0LFwi5aCrXCIsNCxcIuWgseWgsuWgs+WgtOWgtlwiLDddLFxuW1wiODk0MFwiLFwi5aC+XCIsNSxcIuWhhVwiLDYsXCLloY7loY/loZDloZLloZPloZXloZbloZfloZlcIiw0LFwi5aGfXCIsNSxcIuWhplwiLDQsXCLloa1cIiwxNixcIuWhv+WiguWihOWihuWih+WiiOWiiuWii+WijFwiXSxcbltcIjg5ODBcIixcIuWijVwiLDQsXCLlopRcIiw0LFwi5aKb5aKc5aKd5aKgXCIsNyxcIuWiqlwiLDE3LFwi5aK95aK+5aK/5aOA5aOC5aOD5aOE5aOGXCIsMTAsXCLlo5Llo5Plo5Tlo5ZcIiwxMyxcIuWjpVwiLDUsXCLlo63lo6/lo7Hlo7Llo7Tlo7Xlo7flo7jlo7pcIiw3LFwi5aSD5aSF5aSG5aSIXCIsNCxcIuWkjuWkkOWkkeWkkuWkk+Wkl+WkmOWkm+WkneWknuWkoOWkoeWkouWko+WkpuWkqOWkrOWksOWksuWks+WkteWktuWku1wiXSxcbltcIjhhNDBcIixcIuWkveWkvuWkv+WlgOWlg+WlheWlhuWliuWljOWljeWlkOWlkuWlk+WlmeWlm1wiLDQsXCLlpaHlpaPlpaTlpaZcIiwxMixcIuWlteWlt+WluuWlu+WlvOWlvuWlv+WmgOWmheWmieWmi+WmjOWmjuWmj+WmkOWmkeWmlOWmleWmmOWmmuWmm+WmnOWmneWmn+WmoOWmoeWmouWmplwiXSxcbltcIjhhODBcIixcIuWmp+WmrOWmreWmsOWmseWms1wiLDUsXCLlprrlprzlpr3lpr9cIiw2LFwi5aeH5aeI5aeJ5aeM5aeN5aeO5aeP5aeV5aeW5aeZ5aeb5aeeXCIsNCxcIuWnpOWnpuWnp+WnqeWnquWnq+WnrVwiLDExLFwi5ae65ae85ae95ae+5aiA5aiC5aiK5aiL5aiN5aiO5aiP5aiQ5aiS5aiU5aiV5aiW5aiX5aiZ5aia5aib5aid5aie5aih5aii5aik5aim5ain5aio5aiqXCIsNixcIuWos+WoteWot1wiLDQsXCLlqL3lqL7lqL/lqYFcIiw0LFwi5amH5amI5amLXCIsOSxcIuWpluWpl+WpmOWpmeWpm1wiLDVdLFxuW1wiOGI0MFwiLFwi5amh5amj5amk5aml5amm5amo5amp5amrXCIsOCxcIuWpuOWpueWpu+WpvOWpveWpvuWqgFwiLDE3LFwi5aqTXCIsNixcIuWqnFwiLDEzLFwi5aqr5aqsXCJdLFxuW1wiOGI4MFwiLFwi5aqtXCIsNCxcIuWqtOWqtuWqt+WquVwiLDQsXCLlqr/lq4Dlq4NcIiw1LFwi5auK5auL5auNXCIsNCxcIuWrk+WrleWrl+WrmeWrmuWrm+WrneWrnuWrn+WrouWrpOWrpeWrp+WrqOWrquWrrFwiLDQsXCLlq7JcIiwyMixcIuWsilwiLDExLFwi5ayYXCIsMjUsXCLlrLPlrLXlrLblrLhcIiw3LFwi5a2BXCIsNl0sXG5bXCI4YzQwXCIsXCLlrYhcIiw3LFwi5a2S5a2W5a2e5a2g5a2h5a2n5a2o5a2r5a2t5a2u5a2v5a2y5a205a225a235a245a255a275a285a2+5a2/5a6C5a6G5a6K5a6N5a6O5a6Q5a6R5a6S5a6U5a6W5a6f5a6n5a6o5a6p5a6s5a6t5a6u5a6v5a6x5a6y5a635a665a675a685a+A5a+B5a+D5a+I5a+J5a+K5a+L5a+N5a+O5a+PXCJdLFxuW1wiOGM4MFwiLFwi5a+R5a+UXCIsOCxcIuWvoOWvouWvo+WvpuWvp+WvqVwiLDQsXCLlr6/lr7FcIiw2LFwi5a+95a++5bCA5bCC5bCD5bCF5bCH5bCI5bCL5bCM5bCN5bCO5bCQ5bCS5bCT5bCX5bCZ5bCb5bCe5bCf5bCg5bCh5bCj5bCm5bCo5bCp5bCq5bCr5bCt5bCu5bCv5bCw5bCy5bCz5bC15bC25bC35bGD5bGE5bGG5bGH5bGM5bGN5bGS5bGT5bGU5bGW5bGX5bGY5bGa5bGb5bGc5bGd5bGf5bGi5bGk5bGnXCIsNixcIuWxsOWxslwiLDYsXCLlsbvlsbzlsb3lsb7lsoDlsoNcIiw0LFwi5bKJ5bKK5bKL5bKO5bKP5bKS5bKT5bKV5bKdXCIsNCxcIuWypFwiLDRdLFxuW1wiOGQ0MFwiLFwi5bKq5bKu5bKv5bKw5bKy5bK05bK25bK55bK65bK75bK85bK+5bOA5bOC5bOD5bOFXCIsNSxcIuWzjFwiLDUsXCLls5NcIiw1LFwi5bOaXCIsNixcIuWzouWzo+Wzp+WzqeWzq+WzrOWzruWzr+WzsVwiLDksXCLls7xcIiw0XSxcbltcIjhkODBcIixcIuW0geW0hOW0heW0iFwiLDUsXCLltI9cIiw0LFwi5bSV5bSX5bSY5bSZ5bSa5bSc5bSd5bSfXCIsNCxcIuW0peW0qOW0quW0q+W0rOW0r1wiLDQsXCLltLVcIiw3LFwi5bS/XCIsNyxcIuW1iOW1ieW1jVwiLDEwLFwi5bWZ5bWa5bWc5bWeXCIsMTAsXCLltarlta3lta7ltbDltbHltbLltbPltbVcIiwxMixcIuW2g1wiLDIxLFwi5baa5bab5bac5bae5baf5bagXCJdLFxuW1wiOGU0MFwiLFwi5bahXCIsMjEsXCLltrhcIiwxMixcIuW3hlwiLDYsXCLlt45cIiwxMixcIuW3nOW3n+W3oOW3o+W3pOW3quW3rOW3rVwiXSxcbltcIjhlODBcIixcIuW3sOW3teW3tuW3uFwiLDQsXCLlt7/luIDluITluIfluInluIrluIvluI3luI7luJLluJPluJfluJ5cIiw3LFwi5bioXCIsNCxcIuW4r+W4sOW4slwiLDQsXCLluLnluLrluL7luL/luYDluYHluYPluYZcIiw1LFwi5bmNXCIsNixcIuW5llwiLDQsXCLluZzluZ3luZ/luaDluaNcIiwxNCxcIuW5teW5t+W5ueW5vuW6geW6guW6g+W6heW6iOW6ieW6jOW6jeW6juW6kuW6mOW6m+W6neW6oeW6ouW6o+W6pOW6qFwiLDQsXCLluq5cIiw0LFwi5bq05bq65bq75bq85bq95bq/XCIsNl0sXG5bXCI4ZjQwXCIsXCLlu4blu4flu4jlu4tcIiw1LFwi5buU5buV5buX5buY5buZ5bua5bucXCIsMTEsXCLlu6nlu6tcIiw4LFwi5bu15bu45bu55bu75bu85bu95byF5byG5byH5byJ5byM5byN5byO5byQ5byS5byU5byW5byZ5bya5byc5byd5bye5byh5byi5byj5bykXCJdLFxuW1wiOGY4MFwiLFwi5byo5byr5bys5byu5byw5byyXCIsNixcIuW8u+W8veW8vuW8v+W9gVwiLDE0LFwi5b2R5b2U5b2Z5b2a5b2b5b2c5b2e5b2f5b2g5b2j5b2l5b2n5b2o5b2r5b2u5b2v5b2y5b205b215b225b245b265b295b2+5b2/5b6D5b6G5b6N5b6O5b6P5b6R5b6T5b6U5b6W5b6a5b6b5b6d5b6e5b6f5b6g5b6iXCIsNSxcIuW+qeW+q+W+rOW+r1wiLDUsXCLlvrblvrjlvrnlvrrlvrvlvr5cIiw0LFwi5b+H5b+I5b+K5b+L5b+O5b+T5b+U5b+V5b+a5b+b5b+c5b+e5b+f5b+i5b+j5b+l5b+m5b+o5b+p5b+s5b+v5b+w5b+y5b+z5b+05b+25b+35b+55b+65b+85oCHXCJdLFxuW1wiOTA0MFwiLFwi5oCI5oCJ5oCL5oCM5oCQ5oCR5oCT5oCX5oCY5oCa5oCe5oCf5oCi5oCj5oCk5oCs5oCt5oCu5oCwXCIsNCxcIuaAtlwiLDQsXCLmgL3mgL7mgYDmgYRcIiw2LFwi5oGM5oGO5oGP5oGR5oGT5oGU5oGW5oGX5oGY5oGb5oGc5oGe5oGf5oGg5oGh5oGl5oGm5oGu5oGx5oGy5oG05oG15oG35oG+5oKAXCJdLFxuW1wiOTA4MFwiLFwi5oKB5oKC5oKF5oKG5oKH5oKI5oKK5oKL5oKO5oKP5oKQ5oKR5oKT5oKV5oKX5oKY5oKZ5oKc5oKe5oKh5oKi5oKk5oKl5oKn5oKp5oKq5oKu5oKw5oKz5oK15oK25oK35oK55oK65oK9XCIsNyxcIuaDh+aDiOaDieaDjFwiLDQsXCLmg5Lmg5Pmg5Tmg5bmg5fmg5nmg5vmg57mg6FcIiw0LFwi5oOq5oOx5oOy5oO15oO35oO45oO7XCIsNCxcIuaEguaEg+aEhOaEheaEh+aEiuaEi+aEjOaEkFwiLDQsXCLmhJbmhJfmhJjmhJnmhJvmhJzmhJ3mhJ7mhKHmhKLmhKXmhKjmhKnmhKrmhKxcIiwxOCxcIuaFgFwiLDZdLFxuW1wiOTE0MFwiLFwi5oWH5oWJ5oWL5oWN5oWP5oWQ5oWS5oWT5oWU5oWWXCIsNixcIuaFnuaFn+aFoOaFoeaFo+aFpOaFpeaFpuaFqVwiLDYsXCLmhbHmhbLmhbPmhbTmhbbmhbhcIiwxOCxcIuaGjOaGjeaGj1wiLDQsXCLmhpVcIl0sXG5bXCI5MTgwXCIsXCLmhpZcIiw2LFwi5oaeXCIsOCxcIuaGquaGq+aGrVwiLDksXCLmhrhcIiw1LFwi5oa/5oeA5oeB5oeDXCIsNCxcIuaHieaHjFwiLDQsXCLmh5Pmh5VcIiwxNixcIuaHp1wiLDEzLFwi5oe2XCIsOCxcIuaIgFwiLDUsXCLmiIfmiInmiJPmiJTmiJnmiJzmiJ3miJ7miKDmiKPmiKbmiKfmiKjmiKnmiKvmiK3miK/miLDmiLHmiLLmiLXmiLbmiLhcIiw0LFwi5omC5omE5omF5omG5omKXCJdLFxuW1wiOTI0MFwiLFwi5omP5omQ5omV5omW5omX5omZ5oma5omcXCIsNixcIuaJpOaJpeaJqOaJseaJsuaJtOaJteaJt+aJuOaJuuaJu+aJveaKgeaKguaKg+aKheaKhuaKh+aKiOaKi1wiLDUsXCLmipTmipnmipzmip3mip7miqPmiqbmiqfmiqnmiqrmiq3miq7miq/mirDmirLmirPmirTmirbmirfmirjmirrmir7mi4Dmi4FcIl0sXG5bXCI5MjgwXCIsXCLmi4Pmi4vmi4/mi5Hmi5Xmi53mi57mi6Dmi6Hmi6Tmi6rmi6vmi7Dmi7Lmi7Xmi7jmi7nmi7rmi7vmjIDmjIPmjITmjIXmjIbmjIrmjIvmjIzmjI3mjI/mjJDmjJLmjJPmjJTmjJXmjJfmjJjmjJnmjJzmjKbmjKfmjKnmjKzmjK3mjK7mjLDmjLHmjLNcIiw1LFwi5oy75oy85oy+5oy/5o2A5o2B5o2E5o2H5o2I5o2K5o2R5o2S5o2T5o2U5o2WXCIsNyxcIuaNoOaNpOaNpeaNpuaNqOaNquaNq+aNrOaNr+aNsOaNsuaNs+aNtOaNteaNuOaNueaNvOaNveaNvuaNv+aOgeaOg+aOhOaOheaOhuaOi+aOjeaOkeaOk+aOlOaOleaOl+aOmVwiLDYsXCLmjqHmjqTmjqbmjqvmjq/mjrHmjrLmjrXmjrbmjrnmjrvmjr3mjr/mj4BcIl0sXG5bXCI5MzQwXCIsXCLmj4Hmj4Lmj4Pmj4Xmj4fmj4jmj4rmj4vmj4zmj5Hmj5Pmj5Tmj5Xmj5dcIiw2LFwi5o+f5o+i5o+kXCIsNCxcIuaPq+aPrOaPruaPr+aPsOaPseaPs+aPteaPt+aPueaPuuaPu+aPvOaPvuaQg+aQhOaQhlwiLDQsXCLmkI3mkI7mkJHmkJLmkJVcIiw1LFwi5pCd5pCf5pCi5pCj5pCkXCJdLFxuW1wiOTM4MFwiLFwi5pCl5pCn5pCo5pCp5pCr5pCuXCIsNSxcIuaQtVwiLDQsXCLmkLvmkLzmkL7mkYDmkYLmkYPmkYnmkYtcIiw2LFwi5pGT5pGV5pGW5pGX5pGZXCIsNCxcIuaRn1wiLDcsXCLmkajmkarmkavmkazmka5cIiw5LFwi5pG7XCIsNixcIuaSg+aShuaSiFwiLDgsXCLmkpPmkpTmkpfmkpjmkprmkpvmkpzmkp3mkp9cIiw0LFwi5pKl5pKm5pKn5pKo5pKq5pKr5pKv5pKx5pKy5pKz5pK05pK25pK55pK75pK95pK+5pK/5pOB5pOD5pOE5pOGXCIsNixcIuaTj+aTkeaTk+aTlOaTleaTluaTmeaTmlwiXSxcbltcIjk0NDBcIixcIuaTm+aTnOaTneaTn+aToOaToeaTo+aTpeaTp1wiLDI0LFwi5pSBXCIsNyxcIuaUilwiLDcsXCLmlJNcIiw0LFwi5pSZXCIsOF0sXG5bXCI5NDgwXCIsXCLmlKLmlKPmlKTmlKZcIiw0LFwi5pSs5pSt5pSw5pSx5pSy5pSz5pS35pS65pS85pS95pWAXCIsNCxcIuaVhuaVh+aViuaVi+aVjeaVjuaVkOaVkuaVk+aVlOaVl+aVmOaVmuaVnOaVn+aVoOaVoeaVpOaVpeaVp+aVqOaVqeaVquaVreaVruaVr+aVseaVs+aVteaVtuaVuFwiLDE0LFwi5paI5paJ5paK5paN5paO5paP5paS5paU5paV5paW5paY5paa5pad5pae5pag5pai5paj5pam5pao5paq5pas5pau5paxXCIsNyxcIuaWuuaWu+aWvuaWv+aXgOaXguaXh+aXiOaXieaXiuaXjeaXkOaXkeaXk+aXlOaXleaXmFwiLDcsXCLml6Hml6Pml6Tml6rml6tcIl0sXG5bXCI5NTQwXCIsXCLml7Lml7Pml7Tml7Xml7jml7nml7tcIiw0LFwi5piB5piE5piF5piH5piI5piJ5piL5piN5piQ5piR5piS5piW5piX5piY5pia5pib5pic5pie5pih5pii5pij5pik5pim5pip5piq5pir5pis5piu5piw5piy5piz5pi3XCIsNCxcIuaYveaYv+aZgOaZguaZhFwiLDYsXCLmmY3mmY7mmZDmmZHmmZhcIl0sXG5bXCI5NTgwXCIsXCLmmZnmmZvmmZzmmZ3mmZ7mmaDmmaLmmaPmmaXmmafmmalcIiw0LFwi5pmx5pmy5pmz5pm15pm45pm55pm75pm85pm95pm/5pqA5pqB5pqD5pqF5pqG5pqI5pqJ5pqK5pqL5pqN5pqO5pqP5pqQ5pqS5pqT5pqU5pqV5pqYXCIsNCxcIuaanlwiLDgsXCLmmqlcIiw0LFwi5pqvXCIsNCxcIuaateaatuaat+aauOaauuaau+aavOaaveaav1wiLDI1LFwi5pua5pueXCIsNyxcIuabp+abqOabqlwiLDUsXCLmm7Hmm7Xmm7bmm7jmm7rmm7vmm73mnIHmnILmnINcIl0sXG5bXCI5NjQwXCIsXCLmnITmnIXmnIbmnIfmnIzmnI7mnI/mnJHmnJLmnJPmnJbmnJjmnJnmnJrmnJzmnJ7mnKBcIiw1LFwi5pyn5pyp5pyu5pyw5pyy5pyz5py25py35py45py55py75py85py+5py/5p2B5p2E5p2F5p2H5p2K5p2L5p2N5p2S5p2U5p2V5p2XXCIsNCxcIuadneadouado+adpOadpuadp+adq+adrOadruadseadtOadtlwiXSxcbltcIjk2ODBcIixcIuaduOadueaduuadu+adveaegOaeguaeg+aeheaehuaeiOaeiuaejOaejeaejuaej+aekeaekuaek+aelOaeluaemeaem+aen+aeoOaeoeaepOaepuaeqeaerOaeruaeseaesuaetOaeuVwiLDcsXCLmn4Lmn4VcIiw5LFwi5p+V5p+W5p+X5p+b5p+f5p+h5p+j5p+k5p+m5p+n5p+o5p+q5p+r5p+t5p+u5p+y5p+1XCIsNyxcIuafvuaggeagguagg+aghOaghuagjeagkOagkuaglOagleagmFwiLDQsXCLmoJ7moJ/moKDmoKJcIiw2LFwi5qCrXCIsNixcIuagtOagteagtuaguuagu+agv+ahh+ahi+ahjeahj+ahkuahllwiLDVdLFxuW1wiOTc0MFwiLFwi5qGc5qGd5qGe5qGf5qGq5qGsXCIsNyxcIuahteahuFwiLDgsXCLmooLmooTmoodcIiw3LFwi5qKQ5qKR5qKS5qKU5qKV5qKW5qKYXCIsOSxcIuaio+aipOaipeaiqeaiquaiq+airOairuaiseaisuaitOaituait+aiuFwiXSxcbltcIjk3ODBcIixcIuaiuVwiLDYsXCLmo4Hmo4NcIiw1LFwi5qOK5qOM5qOO5qOP5qOQ5qOR5qOT5qOU5qOW5qOX5qOZ5qObXCIsNCxcIuajoeajouajpFwiLDksXCLmo6/mo7Lmo7Pmo7Tmo7bmo7fmo7jmo7vmo73mo77mo7/mpIDmpILmpIPmpITmpIZcIiw0LFwi5qSM5qSP5qSR5qSTXCIsMTEsXCLmpKHmpKLmpKPmpKVcIiw3LFwi5qSu5qSv5qSx5qSy5qSz5qS15qS25qS35qS45qS65qS75qS85qS+5qWA5qWB5qWDXCIsMTYsXCLmpZXmpZbmpZjmpZnmpZvmpZzmpZ9cIl0sXG5bXCI5ODQwXCIsXCLmpaHmpaLmpaTmpaXmpafmpajmpanmparmpazmpa3mpa/mpbDmpbJcIiw0LFwi5qW65qW75qW95qW+5qW/5qaB5qaD5qaF5qaK5qaL5qaM5qaOXCIsNSxcIuamluaml+ammeammuamnVwiLDksXCLmpqnmpqrmpqzmpq7mpq/mprDmprLmprPmprXmprbmprjmprnmprrmprzmpr1cIl0sXG5bXCI5ODgwXCIsXCLmpr7mpr/mp4Dmp4JcIiw3LFwi5qeL5qeN5qeP5qeR5qeS5qeT5qeVXCIsNSxcIuannOanneannuanoVwiLDExLFwi5qeu5qev5qew5qex5qezXCIsOSxcIuanvuaogFwiLDksXCLmqItcIiwxMSxcIuaomVwiLDUsXCLmqKDmqKJcIiw1LFwi5qip5qir5qis5qit5qiu5qiw5qiy5qiz5qi05qi2XCIsNixcIuaov1wiLDQsXCLmqYXmqYbmqYhcIiw3LFwi5qmRXCIsNixcIuapmlwiXSxcbltcIjk5NDBcIixcIuapnFwiLDQsXCLmqaLmqaPmqaTmqaZcIiwxMCxcIuapslwiLDYsXCLmqbrmqbvmqb3mqb7mqb/mqoHmqoLmqoPmqoVcIiw4LFwi5qqP5qqSXCIsNCxcIuaqmFwiLDcsXCLmqqFcIiw1XSxcbltcIjk5ODBcIixcIuaqp+aqqOaqquaqrVwiLDExNCxcIuaspeaspuasqFwiLDZdLFxuW1wiOWE0MFwiLFwi5qyv5qyw5qyx5qyz5qy05qy15qy25qy45qy75qy85qy95qy/5q2A5q2B5q2C5q2E5q2F5q2I5q2K5q2L5q2NXCIsMTEsXCLmrZpcIiw3LFwi5q2o5q2p5q2rXCIsMTMsXCLmrbrmrb3mrb7mrb/mroDmroXmrohcIl0sXG5bXCI5YTgwXCIsXCLmrozmro7mro/mrpDmrpHmrpTmrpXmrpfmrpjmrpnmrpxcIiw0LFwi5q6iXCIsNyxcIuauq1wiLDcsXCLmrrbmrrhcIiw2LFwi5q+A5q+D5q+E5q+GXCIsNCxcIuavjOavjuavkOavkeavmOavmuavnFwiLDQsXCLmr6JcIiw3LFwi5q+s5q+t5q+u5q+w5q+x5q+y5q+05q+25q+35q+45q+65q+75q+85q++XCIsNixcIuawiFwiLDQsXCLmsI7msJLmsJfmsJzmsJ3msJ7msKDmsKPmsKXmsKvmsKzmsK3msLHmsLPmsLbmsLfmsLnmsLrmsLvmsLzmsL7msL/msYPmsYTmsYXmsYjmsYtcIiw0LFwi5rGR5rGS5rGT5rGW5rGYXCJdLFxuW1wiOWI0MFwiLFwi5rGZ5rGa5rGi5rGj5rGl5rGm5rGn5rGrXCIsNCxcIuaxseaxs+axteaxt+axuOaxuuaxu+axvOaxv+aygOayhOayh+ayiuayi+ayjeayjuaykeaykuayleayluayl+aymOaymuaynOayneaynuayoOayouayqOayrOayr+aysOaytOayteaytuayt+ayuuazgOazgeazguazg+azhuazh+aziOazi+azjeazjuazj+azkeazkuazmFwiXSxcbltcIjliODBcIixcIuazmeazmuaznOazneazn+azpOazpuazp+azqeazrOazreazsuaztOazueazv+a0gOa0gua0g+a0hea0hua0iOa0iea0iua0jea0j+a0kOa0kea0k+a0lOa0lea0lua0mOa0nOa0nea0n1wiLDUsXCLmtKbmtKjmtKnmtKzmtK3mtK/mtLDmtLTmtLbmtLfmtLjmtLrmtL/mtYDmtYLmtYTmtYnmtYzmtZDmtZXmtZbmtZfmtZjmtZvmtZ3mtZ/mtaHmtaLmtaTmtaXmtafmtajmtavmtazmta3mtbDmtbHmtbLmtbPmtbXmtbbmtbnmtbrmtbvmtb1cIiw0LFwi5raD5raE5raG5raH5raK5raL5raN5raP5raQ5raS5raWXCIsNCxcIua2nOa2oua2pea2rOa2rea2sOa2sea2s+a2tOa2tua2t+a2uVwiLDUsXCLmt4Hmt4Lmt4Pmt4jmt4nmt4pcIl0sXG5bXCI5YzQwXCIsXCLmt43mt47mt4/mt5Dmt5Lmt5Pmt5Tmt5Xmt5fmt5rmt5vmt5zmt5/mt6Lmt6Pmt6Xmt6fmt6jmt6nmt6rmt63mt6/mt7Dmt7Lmt7Tmt7Xmt7bmt7jmt7rmt71cIiw3LFwi5riG5riH5riI5riJ5riL5riP5riS5riT5riV5riY5riZ5rib5ric5rie5rif5rii5rim5rin5rio5riq5ris5riu5riw5rix5riz5ri1XCJdLFxuW1wiOWM4MFwiLFwi5ri25ri35ri55ri7XCIsNyxcIua5hVwiLDcsXCLmuY/muZDmuZHmuZLmuZXmuZfmuZnmuZrmuZzmuZ3muZ7muaBcIiwxMCxcIua5rOa5rea5r1wiLDE0LFwi5rqA5rqB5rqC5rqE5rqH5rqI5rqKXCIsNCxcIua6kVwiLDYsXCLmupnmuprmupvmup3mup7muqDmuqHmuqPmuqTmuqbmuqjmuqnmuqvmuqzmuq3muq7murDmurPmurXmurjmurnmurzmur7mur/mu4Dmu4Pmu4Tmu4Xmu4bmu4jmu4nmu4rmu4zmu43mu47mu5Dmu5Lmu5bmu5jmu5nmu5vmu5zmu53mu6Pmu6fmu6pcIiw1XSxcbltcIjlkNDBcIixcIua7sOa7sea7sua7s+a7tea7tua7t+a7uOa7ulwiLDcsXCLmvIPmvITmvIXmvIfmvIjmvIpcIiw0LFwi5ryQ5ryR5ryS5ryWXCIsOSxcIua8oea8oua8o+a8pea8pua8p+a8qOa8rOa8rua8sOa8sua8tOa8tea8t1wiLDYsXCLmvL/mvYDmvYHmvYJcIl0sXG5bXCI5ZDgwXCIsXCLmvYPmvYTmvYXmvYjmvYnmvYrmvYzmvY5cIiw5LFwi5r2Z5r2a5r2b5r2d5r2f5r2g5r2h5r2j5r2k5r2l5r2nXCIsNSxcIua9r+a9sOa9sea9s+a9tea9tua9t+a9uea9u+a9vVwiLDYsXCLmvoXmvobmvofmvormvovmvo9cIiwxMixcIua+nea+nua+n+a+oOa+olwiLDQsXCLmvqhcIiwxMCxcIua+tOa+tea+t+a+uOa+ulwiLDUsXCLmv4Hmv4NcIiw1LFwi5r+KXCIsNixcIua/k1wiLDEwLFwi5r+f5r+i5r+j5r+k5r+lXCJdLFxuW1wiOWU0MFwiLFwi5r+mXCIsNyxcIua/sFwiLDMyLFwi54CSXCIsNyxcIueAnFwiLDYsXCLngKRcIiw2XSxcbltcIjllODBcIixcIueAq1wiLDksXCLngLbngLfngLjngLpcIiwxNyxcIueBjeeBjueBkFwiLDEzLFwi54GfXCIsMTEsXCLnga7ngbHngbLngbPngbTngbfngbnngbrngbvngb3ngoHngoLngoPngoTngobngofngojngovngozngo3ngo/ngpDngpHngpPngpfngpjngprngpvngp5cIiwxMixcIueCsOeCsueCtOeCteeCtueCuueCvueCv+eDhOeDheeDhueDh+eDieeDi1wiLDEyLFwi54OaXCJdLFxuW1wiOWY0MFwiLFwi54Oc54Od54Oe54Og54Oh54Oi54Oj54Ol54Oq54Ou54OwXCIsNixcIueDuOeDuueDu+eDvOeDvlwiLDEwLFwi54SLXCIsNCxcIueEkeeEkueElOeEl+eEm1wiLDEwLFwi54SnXCIsNyxcIueEsueEs+eEtFwiXSxcbltcIjlmODBcIixcIueEteeEt1wiLDEzLFwi54WG54WH54WI54WJ54WL54WN54WPXCIsMTIsXCLnhZ3nhZ9cIiw0LFwi54Wl54WpXCIsNCxcIueFr+eFsOeFseeFtOeFteeFtueFt+eFueeFu+eFvOeFvlwiLDUsXCLnhoVcIiw0LFwi54aL54aM54aN54aO54aQ54aR54aS54aT54aV54aW54aX54aaXCIsNCxcIueGoVwiLDYsXCLnhqnnhqrnhqvnhq1cIiw1LFwi54a054a254a354a454a6XCIsOCxcIueHhFwiLDksXCLnh49cIiw0XSxcbltcImEwNDBcIixcIueHllwiLDksXCLnh6Hnh6Lnh6Pnh6Tnh6bnh6hcIiw1LFwi54evXCIsOSxcIueHulwiLDExLFwi54iHXCIsMTldLFxuW1wiYTA4MFwiLFwi54ib54ic54ieXCIsOSxcIueIqeeIq+eIreeIrueIr+eIsueIs+eItOeIuueIvOeIvueJgFwiLDYsXCLniYnniYrniYvniY7niY/niZDniZHniZPniZTniZXniZfniZjniZrniZzniZ7niaDniaPniaTniaXniajniarniavniaznia3nibDnibHnibPnibTnibbnibfnibjnibvnibznib3nioLnioPnioVcIiw0LFwi54qM54qO54qQ54qR54qTXCIsMTEsXCLniqBcIiwxMSxcIueKrueKseeKsueKs+eKteeKulwiLDYsXCLni4Xni4bni4fni4nni4rni4vni4zni4/ni5Hni5Pni5Tni5Xni5bni5jni5rni5tcIl0sXG5bXCJhMWExXCIsXCLjgIDjgIHjgILCt8uJy4fCqOOAg+OAheKAlO+9nuKAluKApuKAmOKAmeKAnOKAneOAlOOAleOAiFwiLDcsXCLjgJbjgJfjgJDjgJHCscOXw7fiiLbiiKfiiKjiiJHiiI/iiKriiKniiIjiiLfiiJriiqXiiKXiiKDijJLiipniiKviiK7iiaHiiYziiYjiiL3iiJ3iiaDiia7iia/iiaTiiaXiiJ7iiLXiiLTimYLimYDCsOKAsuKAs+KEg++8hMKk77+g77+h4oCwwqfihJbimIbimIXil4vil4/il47il4fil4bilqHilqDilrPilrLigLvihpLihpDihpHihpPjgJNcIl0sXG5bXCJhMmExXCIsXCLihbBcIiw5XSxcbltcImEyYjFcIixcIuKSiFwiLDE5LFwi4pG0XCIsMTksXCLikaBcIiw5XSxcbltcImEyZTVcIixcIuOIoFwiLDldLFxuW1wiYTJmMVwiLFwi4oWgXCIsMTFdLFxuW1wiYTNhMVwiLFwi77yB77yC77yD77+l77yFXCIsODgsXCLvv6NcIl0sXG5bXCJhNGExXCIsXCLjgYFcIiw4Ml0sXG5bXCJhNWExXCIsXCLjgqFcIiw4NV0sXG5bXCJhNmExXCIsXCLOkVwiLDE2LFwizqNcIiw2XSxcbltcImE2YzFcIixcIs6xXCIsMTYsXCLPg1wiLDZdLFxuW1wiYTZlMFwiLFwi77i177i277i577i677i/77mA77i977i+77mB77mC77mD77mEXCJdLFxuW1wiYTZlZVwiLFwi77i777i877i377i477ixXCJdLFxuW1wiYTZmNFwiLFwi77iz77i0XCJdLFxuW1wiYTdhMVwiLFwi0JBcIiw1LFwi0IHQllwiLDI1XSxcbltcImE3ZDFcIixcItCwXCIsNSxcItGR0LZcIiwyNV0sXG5bXCJhODQwXCIsXCLLisuLy5nigJPigJXigKXigLXihIXihInihpbihpfihpjihpniiJXiiJ/iiKPiiZLiiabiiafiir/ilZBcIiwzNSxcIuKWgVwiLDZdLFxuW1wiYTg4MFwiLFwi4paIXCIsNyxcIuKWk+KWlOKWleKWvOKWveKXouKXo+KXpOKXpeKYieKKleOAkuOAneOAnlwiXSxcbltcImE4YTFcIixcIsSBw6HHjsOgxJPDqcSbw6jEq8Otx5DDrMWNw7PHksOyxavDuseUw7nHlseYx5rHnMO8w6rJkVwiXSxcbltcImE4YmRcIixcIsWExYhcIl0sXG5bXCJhOGMwXCIsXCLJoVwiXSxcbltcImE4YzVcIixcIuOEhVwiLDM2XSxcbltcImE5NDBcIixcIuOAoVwiLDgsXCLjiqPjjo7jjo/jjpzjjp3jjp7jjqHjj4Tjj47jj5Hjj5Ljj5XvuLDvv6Lvv6RcIl0sXG5bXCJhOTU5XCIsXCLihKHjiLFcIl0sXG5bXCJhOTVjXCIsXCLigJBcIl0sXG5bXCJhOTYwXCIsXCLjg7zjgpvjgpzjg73jg77jgIbjgp3jgp7vuYlcIiw5LFwi77mU77mV77mW77mX77mZXCIsOF0sXG5bXCJhOTgwXCIsXCLvuaJcIiw0LFwi77mo77mp77mq77mrXCJdLFxuW1wiYTk5NlwiLFwi44CHXCJdLFxuW1wiYTlhNFwiLFwi4pSAXCIsNzVdLFxuW1wiYWE0MFwiLFwi54uc54ud54uf54uiXCIsNSxcIueLqueLq+eLteeLtueLueeLveeLvueLv+eMgOeMgueMhFwiLDUsXCLnjIvnjIznjI3njI/njJDnjJHnjJLnjJTnjJjnjJnnjJrnjJ/njKDnjKPnjKTnjKbnjKfnjKjnjK3njK/njLDnjLLnjLPnjLXnjLbnjLrnjLvnjLznjL3njYBcIiw4XSxcbltcImFhODBcIixcIueNieeNiueNi+eNjOeNjueNj+eNkeeNk+eNlOeNleeNlueNmFwiLDcsXCLnjaFcIiwxMCxcIueNrueNsOeNsVwiXSxcbltcImFiNDBcIixcIueNslwiLDExLFwi542/XCIsNCxcIueOheeOhueOiOeOiueOjOeOjeeOj+eOkOeOkueOk+eOlOeOleeOl+eOmOeOmeeOmueOnOeOneeOnueOoOeOoeeOo1wiLDUsXCLnjqrnjqznjq3njrHnjrTnjrXnjrbnjrjnjrnnjrznjr3njr7njr/nj4Hnj4NcIiw0XSxcbltcImFiODBcIixcIuePi+ePjOePjuePklwiLDYsXCLnj5rnj5vnj5znj53nj5/nj6Hnj6Lnj6Pnj6Tnj6bnj6jnj6rnj6vnj6znj67nj6/nj7Dnj7Hnj7NcIiw0XSxcbltcImFjNDBcIixcIuePuFwiLDEwLFwi55CE55CH55CI55CL55CM55CN55CO55CRXCIsOCxcIueQnFwiLDUsXCLnkKPnkKTnkKfnkKnnkKvnkK3nkK/nkLHnkLLnkLdcIiw0LFwi55C955C+55C/55GA55GCXCIsMTFdLFxuW1wiYWM4MFwiLFwi55GOXCIsNixcIueRlueRmOeRneeRoFwiLDEyLFwi55Gu55Gv55GxXCIsNCxcIueRuOeRueeRulwiXSxcbltcImFkNDBcIixcIueRu+eRvOeRveeRv+eSgueShOeSheeShueSiOeSieeSiueSjOeSjeeSj+eSkVwiLDEwLFwi55Kd55KfXCIsNyxcIueSqlwiLDE1LFwi55K7XCIsMTJdLFxuW1wiYWQ4MFwiLFwi55OIXCIsOSxcIueTk1wiLDgsXCLnk53nk5/nk6Hnk6Xnk6dcIiw2LFwi55Ow55Ox55OyXCJdLFxuW1wiYWU0MFwiLFwi55Oz55O155O4XCIsNixcIueUgOeUgeeUgueUg+eUhVwiLDcsXCLnlI7nlJDnlJLnlJTnlJXnlJbnlJfnlJvnlJ3nlJ7nlKBcIiw0LFwi55Sm55Sn55Sq55Su55S055S255S555S855S955S/55WB55WC55WD55WE55WG55WH55WJ55WK55WN55WQ55WR55WS55WT55WV55WW55WX55WYXCJdLFxuW1wiYWU4MFwiLFwi55WdXCIsNyxcIueVp+eVqOeVqeeVq1wiLDYsXCLnlbPnlbXnlbbnlbfnlbpcIiw0LFwi55aA55aB55aC55aE55aF55aHXCJdLFxuW1wiYWY0MFwiLFwi55aI55aJ55aK55aM55aN55aO55aQ55aT55aV55aY55ab55ac55ae55ai55amXCIsNCxcIueWreeWtueWt+eWuueWu+eWv+eXgOeXgeeXhueXi+eXjOeXjueXj+eXkOeXkeeXk+eXl+eXmeeXmueXnOeXneeXn+eXoOeXoeeXpeeXqeeXrOeXreeXrueXr+eXsueXs+eXteeXtueXt+eXuOeXuueXu+eXveeXvueYgueYhOeYhueYh1wiXSxcbltcImFmODBcIixcIueYiOeYieeYi+eYjeeYjueYj+eYkeeYkueYk+eYlOeYlueYmueYnOeYneeYnueYoeeYo+eYp+eYqOeYrOeYrueYr+eYseeYsueYtueYt+eYueeYuueYu+eYveeZgeeZgueZhFwiXSxcbltcImIwNDBcIixcIueZhVwiLDYsXCLnmY5cIiw1LFwi55mV55mXXCIsNCxcIueZneeZn+eZoOeZoeeZoueZpFwiLDYsXCLnmaznma3nma7nmbBcIiw3LFwi55m555m655m855m/55qA55qB55qD55qF55qJ55qK55qM55qN55qP55qQ55qS55qU55qV55qX55qY55qa55qbXCJdLFxuW1wiYjA4MFwiLFwi55qcXCIsNyxcIueapVwiLDgsXCLnmq/nmrDnmrPnmrVcIiw5LFwi55uA55uB55uD5ZWK6Zi/5Z+D5oyo5ZOO5ZSJ5ZOA55qR55mM6JS855+u6Im+56KN54ix6ZqY6Z6N5rCo5a6J5L+65oyJ5pqX5bK46IO65qGI6IKu5piC55uO5Ye55pWW54as57+x6KKE5YKy5aWl5oeK5r6z6Iqt5o2M5omS5Y+t5ZCn56yG5YWr55ak5be05ouU6LeL6Z225oqK6ICZ5Z2d6Zy4572i54i455m95p+P55m+5pGG5L2w6LSl5ouc56iX5paR54+t5pCs5omz6Iis6aKB5p2/54mI5omu5ouM5Ly055Oj5Y2K5Yqe57uK6YKm5biu5qKG5qac6IaA57uR5qOS56OF6JqM6ZWR5YKN6LCk6Iue6IOe5YyF6KSS5YmlXCJdLFxuW1wiYjE0MFwiLFwi55uE55uH55uJ55uL55uM55uT55uV55uZ55ua55uc55ud55ue55ugXCIsNCxcIuebplwiLDcsXCLnm7Dnm7Pnm7Xnm7bnm7fnm7rnm7vnm73nm7/nnIDnnILnnIPnnIXnnIbnnIrnnIznnI5cIiwxMCxcIuecm+ecnOecneecnuecoeeco+ecpOecpeecp+ecquecq1wiXSxcbltcImIxODBcIixcIuecrOecruecsFwiLDQsXCLnnLnnnLvnnL3nnL7nnL/nnYLnnYTnnYXnnYbnnYhcIiw3LFwi552SXCIsNyxcIuednOiWhOmbueS/neWgoemlseWuneaKseaKpeaatOixuemyjeeIhuadr+eikeaCsuWNkeWMl+i+iOiDjOi0nemSoeWAjeeLiOWkh+aDq+eEmeiiq+WllOiLr+acrOesqOW0qee7t+eUreaztei5pui/uOmAvOm8u+avlOmEmeeslOW9vOeip+iTluiUveavleavmeavluW4geW6h+eXuemXreaVneW8iuW/hei+n+WjgeiHgumBv+mZm+merei+uee8lui0rOaJgeS+v+WPmOWNnui+qOi+qei+q+mBjeagh+W9quiGmOihqOmzluaGi+WIq+eYquW9rOaWjOa/kua7qOWuvuaRiOWFteWGsOafhOS4meeniemlvOeCs1wiXSxcbltcImIyNDBcIixcIuedneednuedn+edoOedpOedp+edqeedquedrVwiLDExLFwi552655275528556B556C556D556GXCIsNSxcIueej+eekOeek1wiLDExLFwi556h556j556k556m556o556r556t556u556v556x556y55605562XCIsNF0sXG5bXCJiMjgwXCIsXCLnnrznnr7nn4BcIiwxMixcIuefjlwiLDgsXCLnn5jnn5nnn5rnn51cIiw0LFwi55+k55eF5bm254676I+g5pKt5ouo6ZK15rOi5Y2a5YuD5pCP6ZOC566U5Lyv5bib6Ii26ISW6IaK5rik5rOK6amz5o2V5Y2c5ZO66KGl5Z+g5LiN5biD5q2l57C/6YOo5oCW5pOm54yc6KOB5p2Q5omN6LSi552s6Lip6YeH5b2p6I+c6JSh6aSQ5Y+C6JqV5q6L5oOt5oOo54G/6IuN6Iix5LuT5rKn6JeP5pON57OZ5qe95pu56I2J5Y6V562W5L6n5YaM5rWL5bGC6Lmt5o+S5Y+J6Iys6Iy25p+l56K05pC95a+f5bKU5beu6K+n5ouG5p+06LG65pCA5o666J2J6aaL6LCX57yg6ZOy5Lqn6ZiQ6aKk5piM54yWXCJdLFxuW1wiYjM0MFwiLFwi55+m55+o55+q55+v55+w55+x55+y55+055+155+355+555+655+755+856CDXCIsNSxcIuegiuegi+egjuegj+egkOegk+egleegmeegm+egnuegoOegoeegouegpOegqOegquegq+egruegr+egseegsuegs+egteegtuegveegv+ehgeehguehg+ehhOehhuehiOehieehiuehi+ehjeehj+ehkeehk+ehlOehmOehmeehmlwiXSxcbltcImIzODBcIixcIuehm+ehnOehnlwiLDExLFwi56GvXCIsNyxcIuehuOehueehuuehu+ehvVwiLDYsXCLlnLrlsJ3luLjplb/lgb/ogqDljoLmlZ7nlYXllLHlgKHotoXmioTpkp7mnJ3lmLLmva7lt6LlkLXngpLovabmia/mkqTmjqPlvbvmvojpg7Toh6PovrDlsJjmmajlv7HmsonpmYjotoHooazmkpHnp7Dln47mqZnmiJDlkYjkuZjnqIvmg6nmvoTor5rmib/pgJ7pqovnp6TlkIPnl7TmjIHljJnmsaDov5/lvJvpqbDogLvpvb/kvojlsLrotaTnv4XmlqXngr3lhYXlhrLomavltIflrqDmir3phaznlbTouIznqKDmhIHnrbnku4fnu7jnnoXkuJHoh63liJ3lh7rmqbHljqjouofplITpm4/mu4HpmaTmpZpcIl0sXG5bXCJiNDQwXCIsXCLnooTnooXnoobnoojnoornoovnoo/nopDnopLnopTnopXnopbnopnnop3nop7noqDnoqLnoqTnoqbnoqhcIiw3LFwi56K156K256K356K456K656K756K856K956K/56OA56OC56OD56OE56OG56OH56OI56OM56ON56OO56OP56OR56OS56OT56OW56OX56OY56OaXCIsOV0sXG5bXCJiNDgwXCIsXCLno6Tno6Xno6bno6fno6nno6rno6vno61cIiw0LFwi56Oz56O156O256O456O556O7XCIsNSxcIuekguekg+ekhOekhlwiLDYsXCLnoYDlgqjnn5fmkJDop6blpITmj6Plt53nqb/mpL3kvKDoiLnllpjkuLLnlq7nqpfluaLluorpl6/liJvlkLnngormjbbplKTlnoLmmKXmpL/phofllIfmt7Pnuq/ooKLmiLPnu7DnlrXojKjno4Hpm4zovp7mhYjnk7for43mraTliLrotZDmrKHogarokbHlm7HljIbku47kuJvlh5HnspfphovnsIfkv4Poub/nr6HnqpzmkafltJTlgqzohIbnmIHnsrnmt6znv6DmnZHlrZjlr7jno4vmkq7mkJPmjqrmjKvplJnmkK3ovr7nrZTnmKnmiZPlpKflkYbmrbnlgqPmiLTluKbmrobku6PotLfooovlvoXpgK5cIl0sXG5bXCJiNTQwXCIsXCLnpI1cIiw1LFwi56SUXCIsOSxcIuekn1wiLDQsXCLnpKVcIiwxNCxcIuektVwiLDQsXCLnpL3npL/npYLnpYPnpYTnpYXnpYfnpYpcIiw4LFwi56WU56WV56WY56WZ56Wh56WjXCJdLFxuW1wiYjU4MFwiLFwi56Wk56Wm56Wp56Wq56Wr56Ws56Wu56WwXCIsNixcIuelueelu1wiLDQsXCLnpoLnpoPnpobnpofnpojnponnpovnpoznpo3npo7nppDnppHnppLmgKDogL3mi4XkuLnljZXpg7jmjrjog4bml6bmsK7kvYbmg67mt6Hor57lvLnom4vlvZPmjKHlhZrojaHmoaPliIDmjaPouYjlgJLlspvnpbflr7zliLDnqLvmgrzpgZPnm5flvrflvpfnmoTouaznga/nmbvnrYnnnqrlh7PpgpPloKTkvY7mu7Tov6rmlYznrJvni4TmtqTnv5/lq6HmirXlupXlnLDokoLnrKzluJ3lvJ/pgJLnvJTpoqDmjoLmu4fnopjngrnlhbjpnZvlnqvnlLXkvYPnlLjlupfmg6blpaDmt4Dmrr/noonlj7zpm5Xlh4vliIHmjonlkIrpkpPosIPot4zniLnnop/onbbov63osI3lj6BcIl0sXG5bXCJiNjQwXCIsXCLnppNcIiw2LFwi56abXCIsMTEsXCLnpqhcIiwxMCxcIuemtFwiLDQsXCLnprznpr/np4Lnp4Tnp4Xnp4fnp4jnp4rnp4znp47np4/np5Dnp5Pnp5Tnp5bnp5fnp5lcIiw1LFwi56eg56eh56ei56el56eo56eqXCJdLFxuW1wiYjY4MFwiLFwi56es56eu56exXCIsNixcIuenueenuuenvOenvuenv+eogeeohOeoheeoh+eoiOeoieeoiueojOeoj1wiLDQsXCLnqJXnqJbnqJjnqJnnqJvnqJzkuIHnm6/lj67pkonpobbpvI7plK3lrprorqLkuKLkuJzlhqzokaPmh4LliqjmoIvkvpfmgavlhrvmtJ7lhZzmipbmlpfpmaHosYbpgJfnl5jpg73nnaPmr5Lniorni6zor7vloLXnnbnotYzmnZzplYDogprluqbmuKHlppLnq6/nn63plLvmrrXmlq3nvI7loIblhZHpmJ/lr7nloqnlkKjoubLmlabpob/lm6Tpkp3nm77pgYHmjoflk4blpJrlpLrlnpvourLmnLXot7roiLXliYHmg7DloJXom77ls6jpuYXkv4Tpop3orrnlqKXmgbbljoTmibzpgY/phILppb/mganogIzlhL/ogLPlsJTppbXmtLHkuoxcIl0sXG5bXCJiNzQwXCIsXCLnqJ3nqJ/nqKHnqKLnqKRcIiwxNCxcIueotOeoteeotueouOeouueovuepgFwiLDUsXCLnqYdcIiw5LFwi56mSXCIsNCxcIuepmFwiLDE2XSxcbltcImI3ODBcIixcIuepqVwiLDYsXCLnqbHnqbLnqbPnqbXnqbvnqbznqb3nqb7nqoLnqoXnqofnqonnqornqovnqoznqo7nqo/nqpDnqpPnqpTnqpnnqprnqpvnqp7nqqHnqqLotLDlj5HnvZrnrY/kvJDkuY/pmIDms5Xnj5Dol6nluIbnlarnv7vmqIrnn77pkpLnuYHlh6Hng6blj43ov5TojIPotKnniq/ppa3ms5vlnYroirPmlrnogqrmiL/pmLLlpqjku7/orr/nurrmlL7oj7LpnZ7llaHpo57ogqXljKror73lkKDogrrlup/msrjotLnoiqzphZrlkKnmsJvliIbnurflnZ/nhJrmsb7nsonlpYvku73lv7/mhKTnsqrkuLDlsIHmnqvonILls7DplIvpo47nlq/ng73pgKLlhq/nvJ3orr3lpYnlh6TkvZvlkKblpKvmlbfogqTlrbXmibbmi4LovpDluYXmsJ/nrKbkvI/kv5jmnI1cIl0sXG5bXCJiODQwXCIsXCLnqqPnqqTnqqfnqqnnqqrnqqvnqq5cIiw0LFwi56q0XCIsMTAsXCLnq4BcIiwxMCxcIuerjFwiLDksXCLnq5fnq5jnq5rnq5vnq5znq53nq6Hnq6Lnq6Tnq6dcIiw1LFwi56uu56uw56ux56uy56uzXCJdLFxuW1wiYjg4MFwiLFwi56u0XCIsNCxcIueru+ervOervuesgOesgeesguesheesh+esieesjOesjeesjueskOeskuesk+esluesl+esmOesmuesnOesneesn+esoeesoueso+esp+esqeesrea1rua2quemj+iiseW8l+eUq+aKmui+heS/r+mHnOaWp+iEr+iFkeW6nOiFkOi1tOWJr+imhui1i+WkjeWCheS7mOmYnOeItuiFuei0n+WvjOiuo+mZhOWmh+e8muWSkOWZtuWYjuivpeaUueamgumSmeeblua6ieW5sueUmOadhuafkeerv+iCnei1tuaEn+enhuaVoui1o+WGiOWImumSoue8uOiCm+e6suWyl+a4r+adoOevmeeai+mrmOiGj+e+lOezleaQnumVkOeov+WRiuWTpeatjOaQgeaIiOm4veiDs+eWmeWJsumdqeiRm+agvOibpOmYgemalOmTrOS4quWQhOe7meaguei3n+iAleabtOW6mue+uVwiXSxcbltcImI5NDBcIixcIuesr+essOessuestOesteestuest+esueesu+esveesv1wiLDUsXCLnrYbnrYjnrYrnrY3nrY7nrZPnrZXnrZfnrZnnrZznrZ7nrZ/nraHnraNcIiwxMCxcIuetr+etsOets+ettOettuetuOetuuetvOetveetv+eugeeugueug+euhOeuhlwiLDYsXCLnro7nro9cIl0sXG5bXCJiOTgwXCIsXCLnrpHnrpLnrpPnrpbnrpjnrpnnrprnrpvnrp7nrp/nrqDnrqPnrqTnrqXnrq7nrq/nrrDnrrLnrrPnrrXnrrbnrrfnrrlcIiw3LFwi56+C56+D56+E5Z+C6IC/5qKX5bel5pS75Yqf5oGt6b6a5L6b6Lqs5YWs5a6r5byT5bep5rGe5oux6LSh5YWx6ZKp5Yu+5rKf6Iuf54uX5Z6i5p6E6LSt5aSf6L6c6I+H5ZKV566N5Lyw5rK95a2k5aeR6byT5Y+k6JuK6aqo6LC36IKh5pWF6aG+5Zu66ZuH5Yiu55Oc5YmQ5a+h5oyC6KSC5LmW5ouQ5oCq5qO65YWz5a6Y5Yag6KeC566h6aaG572Q5oOv54GM6LSv5YWJ5bm/6YCb55Gw6KeE5Zyt56GF5b2S6b6f6Ze66L2o6ay86K+h55m45qGC5p+c6Leq6LS15Yi96L6K5rua5qON6ZSF6YOt5Zu95p6c6KO56L+H5ZOIXCJdLFxuW1wiYmE0MFwiLFwi56+F56+I56+J56+K56+L56+N56+O56+P56+Q56+S56+UXCIsNCxcIuevm+evnOevnuevn+evoOevouevo+evpOevp+evqOevqeevq+evrOevreevr+evsOevslwiLDQsXCLnr7jnr7nnr7rnr7vnr73nr79cIiw3LFwi57CI57CJ57CK57CN57CO57CQXCIsNSxcIuewl+ewmOewmVwiXSxcbltcImJhODBcIixcIuewmlwiLDQsXCLnsKBcIiw1LFwi57Co57Cp57CrXCIsMTIsXCLnsLlcIiw1LFwi57GC6aq45a2p5rW35rCm5Lql5a6z6aqH6YWj5oao6YKv6Z+p5ZCr5ra15a+S5Ye95ZaK572V57+w5pK85o2N5pex5oa+5oKN54SK5rGX5rGJ5aSv5p2t6Iiq5aOV5ZqO6LGq5q+r6YOd5aW96ICX5Y+35rWp5ZG15Zad6I236I+P5qC456a+5ZKM5L2V5ZCI55uS6LKJ6ZiC5rKz5ra46LWr6KSQ6bmk6LS65Zi/6buR55eV5b6I54ug5oGo5ZO85Lqo5qiq6KGh5oGS6L2w5ZOE54OY6Jm56bi/5rSq5a6P5byY57qi5ZaJ5L6v54y05ZC85Y6a5YCZ5ZCO5ZG85LmO5b+955Ga5aO26JGr6IOh6J2054uQ57OK5rmWXCJdLFxuW1wiYmI0MFwiLFwi57GDXCIsOSxcIuexjlwiLDM2LFwi57G1XCIsNSxcIuexvlwiLDldLFxuW1wiYmI4MFwiLFwi57KI57KKXCIsNixcIueyk+eylOeylueymeeymueym+eyoOeyoeeyo+eypueyp+eyqOeyqeeyq+eyrOeyreeyr+eysOeytFwiLDQsXCLnsrrnsrvlvKfomY7llKzmiqTkupLmsqrmiLfoirHlk5fljY7njL7mu5HnlLvliJLljJbor53mp5DlvormgIDmt67lnY/mrKLnjq/moZPov5jnvJPmjaLmgqPllKTnl6rosaLnhJXmtqPlrqblubvojZLmhYzpu4Tno7ronZfnsKfnmoflh7Dmg7bnhYzmmYPluYzmgY3osI7ngbDmjKXovonlvr3mgaLom5Tlm57mr4HmgpTmhafljYnmg6DmmabotL/np73kvJrng6nmsYforrPor7Lnu5jojaTmmI/lqZrprYLmtZHmt7fosYHmtLvkvJnngavojrfmiJbmg5HpnI3otKfnpbjlh7vlnL7ln7rmnLrnlbjnqL3np6/nrpVcIl0sXG5bXCJiYzQwXCIsXCLnsr/ns4Dns4Lns4Pns4Tns4bns4nns4vns45cIiw2LFwi57OY57Oa57Ob57Od57Oe57OhXCIsNixcIuezqVwiLDUsXCLns7BcIiw3LFwi57O557O657O8XCIsMTMsXCLntItcIiw1XSxcbltcImJjODBcIixcIue0kVwiLDE0LFwi57Sh57Sj57Sk57Sl57Sm57So57Sp57Sq57Ss57St57Su57SwXCIsNixcIuiCjOmlpei/uea/gOiupem4oeWnrOe7qee8ieWQieaegeajmOi+keexjembhuWPiuaApeeWvuaxsuWNs+Wriee6p+aMpOWHoOiEiuW3seiTn+aKgOWGgOWto+S8juelreWJguaCuOa1juWvhOWvguiuoeiusOaXouW/jOmZheWmk+e7p+e6quWYieaet+WkueS9s+WutuWKoOiNmumiiui0vueUsumSvuWBh+eovOS7t+aetumpvuWrgeatvOebkeWdmuWwluesuumXtOeFjuWFvOiCqeiJsOWluOe8hOiMp+ajgOafrOeiseeht+aLo+aNoeeugOS/reWJquWHj+iNkOanm+mJtOi3tei0seingemUrueureS7tlwiXSxcbltcImJkNDBcIixcIue0t1wiLDU0LFwi57WvXCIsN10sXG5bXCJiZDgwXCIsXCLntbhcIiwzMixcIuWBpeiIsOWJkemlr+a4kOa6hea2p+W7uuWDteWnnOWwhua1huaxn+eWhuiSi+ahqOWlluiusuWMoOmFsemZjeiVieakkuekgeeEpuiDtuS6pOmDiua1h+mqhOWoh+WavOaQhemTsOefq+S+peiEmueLoeinkumluue8tOe7nuWJv+aVmemFtei9v+i+g+WPq+eqluaPreaOpeeahuenuOihl+mYtuaIquWKq+iKguahlOadsOaNt+edq+errea0gee7k+ino+WnkOaIkuiXieiKpeeVjOWAn+S7i+eWpeivq+WxiuW3vueti+aWpOmHkeS7iua0peiln+e0p+mUpuS7heiwqOi/m+mds+aZi+emgei/keeDrOa1uFwiXSxcbltcImJlNDBcIixcIue2mVwiLDEyLFwi57anXCIsNixcIue2r1wiLDQyXSxcbltcImJlODBcIixcIue3mlwiLDMyLFwi5bC95Yqy6I2G5YWi6IyO552b5pm26bK45Lqs5oOK57K+57Kz57uP5LqV6K2m5pmv6aKI6Z2Z5aKD5pWs6ZWc5b6E55eJ6Z2W56uf56ue5YeA54Kv56qY5o+q56m257qg546W6Z+t5LmF54G45Lmd6YWS5Y6p5pWR5pen6Ie86IiF5ZKO5bCx55aa6Z6g5ouY54uZ55a95bGF6am56I+K5bGA5ZKA55+p5Li+5rKu6IGa5ouS5o2u5beo5YW36Led6Lie6ZSv5L+x5Y+l5oOn54Ks5Ymn5o2Q6bmD5aif5YCm55y35Y2357ui5pKF5pSr5oqJ5o6Y5YCU54i16KeJ5Yaz6K+A57ud5Z2H6I+M6ZKn5Yab5ZCb5bO7XCJdLFxuW1wiYmY0MFwiLFwi57e7XCIsNjJdLFxuW1wiYmY4MFwiLFwi57i657i8XCIsNCxcIue5glwiLDQsXCLnuYhcIiwyMSxcIuS/iuero+a1mumDoemqj+WWgOWSluWNoeWSr+W8gOaPqealt+WHr+aFqOWIiuWgquWLmOWdjuegjeeci+W6t+aFt+ezoOaJm+aKl+S6oueCleiAg+aLt+eDpOmdoOWdt+iLm+afr+ajteejlemil+enkeWjs+WSs+WPr+a4tOWFi+WIu+WuouivvuiCr+WVg+WepuaBs+WdkeWQreepuuaBkOWtlOaOp+aKoOWPo+aJo+Wvh+aer+WTreeqn+iLpumFt+W6k+ijpOWkuOWeruaMjui3qOiDr+Wdl+ett+S+qeW/q+WuveasvuWMoeetkOeLguahhuefv+ectuaXt+WGteS6j+eblOWyv+eqpeiRteWljumtgeWCgFwiXSxcbltcImMwNDBcIixcIue5nlwiLDM1LFwi57qDXCIsMjMsXCLnupznup3nup5cIl0sXG5bXCJjMDgwXCIsXCLnuq7nurTnurvnurznu5bnu6Tnu6znu7nnvIrnvJDnvJ7nvLfnvLnnvLtcIiw2LFwi572D572GXCIsOSxcIue9kue9k+mmiOaEp+a6g+WdpOaYhuaNhuWbsOaLrOaJqeW7k+mYlOWeg+aLieWWh+icoeiFiui+o+WVpuiOseadpei1luiTneWpquagj+aLpuevrumYkeWFsOa+nOiwsOaPveiniOaHkue8hueDgua7peeQheamlOeLvOW7iumDjuacl+a1quaNnuWKs+eJouiAgeS9rOWnpemFqueDmea2neWLkuS5kOmbt+mVreiVvuejiue0r+WEoeWekuaTguiCi+exu+azquajsealnuWGt+WOmOaiqOeKgem7juevseeLuOemu+a8k+eQhuadjumHjOmypOekvOiOieiNlOWQj+agl+S4veWOieWKseegvuWOhuWIqeWCiOS+i+S/kFwiXSxcbltcImMxNDBcIixcIue9lue9mee9m+e9nOe9nee9nue9oOe9o1wiLDQsXCLnvavnvaznva3nva/nvbDnvbPnvbXnvbbnvbfnvbjnvbrnvbvnvbznvb3nvb/nvoDnvoJcIiw3LFwi576L576N576PXCIsNCxcIue+lVwiLDQsXCLnvpvnvpznvqDnvqLnvqPnvqXnvqbnvqhcIiw2LFwi576xXCJdLFxuW1wiYzE4MFwiLFwi576zXCIsNCxcIue+uue+u+e+vue/gOe/gue/g+e/hOe/hue/h+e/iOe/iee/i+e/jee/j1wiLDQsXCLnv5bnv5fnv5lcIiw1LFwi57+i57+j55ei56uL57KS5rKl6Zq25Yqb55KD5ZOp5L+p6IGU6I6y6L+e6ZWw5buJ5oCc5raf5biY5pWb6IS46ZO+5oGL54K857uD57Ku5YeJ5qKB57Kx6Imv5Lik6L6G6YeP5pm+5Lqu6LCF5pKp6IGK5YOa55aX54eO5a+l6L695r2m5LqG5pKC6ZWj5buW5paZ5YiX6KOC54OI5Yqj54yO55Cz5p6X56O36ZyW5Li06YK76bOe5reL5Yeb6LWB5ZCd5ouO546y6I+x6Zu26b6E6ZOD5Ly2576a5YeM54G16Zm15bKt6aKG5Y+m5Luk5rqc55CJ5qa056Gr6aaP55WZ5YiY55ik5rWB5p+z5YWt6b6Z6IGL5ZKZ56y856q/XCJdLFxuW1wiYzI0MFwiLFwi57+k57+n57+o57+q57+r57+s57+t57+v57+y57+0XCIsNixcIue/vee/vue/v+iAguiAh+iAiOiAieiAiuiAjuiAj+iAkeiAk+iAmuiAm+iAneiAnuiAn+iAoeiAo+iApOiAq1wiLDUsXCLogLLogLTogLnogLrogLzogL7ogYDogYHogYTogYXogYfogYjogYnogY7ogY/ogZDogZHogZPogZXogZbogZdcIl0sXG5bXCJjMjgwXCIsXCLogZnogZtcIiwxMyxcIuiBq1wiLDUsXCLogbJcIiwxMSxcIumahuWehOaLoumZh+alvOWohOaQguevk+a8j+mZi+iKpuWNoumiheW6kOeCieaOs+WNpOiZj+mygem6k+eijOmcsui3r+i1gum5v+a9nuemhOW9lemZhuaIrumptOWQlemTneS+o+aXheWxpeWxoee8leiZkeawr+W+i+eOh+a7pOe7v+WzpuaMm+Wtqua7puWNteS5seaOoOeVpeaKoei9ruS8puS7keaypue6tuiuuuiQneieuue9l+mAu+mUo+euqemqoeijuOiQvea0m+mqhue7nOWmiOm6u+eOm+eggeiagumprOmqguWYm+WQl+Wfi+S5sOm6puWNlui/iOiEieeekummkuibrua7oeiUk+abvOaFoua8q1wiXSxcbltcImMzNDBcIixcIuiBvuiCgeiCguiCheiCiOiCiuiCjVwiLDUsXCLogpTogpXogpfogpnogp7ogqPogqbogqfogqjogqzogrDogrPogrXogrbogrjogrnogrvog4Xog4dcIiw0LFwi6IOPXCIsNixcIuiDmOiDn+iDoOiDouiDo+iDpuiDruiDteiDt+iDueiDu+iDvuiDv+iEgOiEgeiEg+iEhOiEheiEh+iEiOiEi1wiXSxcbltcImMzODBcIixcIuiEjOiEleiEl+iEmeiEm+iEnOiEneiEn1wiLDEyLFwi6ISt6ISu6ISw6ISz6IS06IS16IS36IS5XCIsNCxcIuiEv+iwqeiKkuiMq+ebsuawk+W/meiOveeMq+iMhemUmuavm+efm+mThuWNr+iMguWGkuW4veiyjOi0uOS5iOeOq+aemuaihemFtumcieeFpOayoeecieWqkumVgeavj+e+juaYp+WvkOWmueWqmumXqOmXt+S7rOiQjOiSmeaqrOebn+mUsOeMm+aipuWtn+ecr+mGmumdoeeznOi/t+iwnOW8peexs+enmOinheazjOicnOWvhuW5guajieecoOe7teWGleWFjeWLieWoqee8hemdouiLl+aPj+eehOiXkOenkua4uuW6meWmmeiUkeeBreawkeaKv+eav+aVj+aCr+mXveaYjuien+m4o+mTreWQjeWRveiwrOaRuFwiXSxcbltcImM0NDBcIixcIuiFgFwiLDUsXCLohYfohYnohY3ohY7ohY/ohZLohZbohZfohZjohZtcIiw0LFwi6IWh6IWi6IWj6IWk6IWm6IWo6IWq6IWr6IWs6IWv6IWy6IWz6IW16IW26IW36IW46IaB6IaDXCIsNCxcIuiGieiGi+iGjOiGjeiGjuiGkOiGklwiLDUsXCLohpnohprohp5cIiw0LFwi6Iak6IalXCJdLFxuW1wiYzQ4MFwiLFwi6Ian6Iap6IarXCIsNyxcIuiGtFwiLDUsXCLohrzohr3ohr7ohr/oh4Toh4Xoh4foh4joh4noh4voh41cIiw2LFwi5pG56JiR5qih6Iac56Oo5pGp6a2U5oq55pyr6I6r5aKo6buY5rKr5ryg5a+e6ZmM6LCL54mf5p+Q5ouH54mh5Lqp5aeG5q+N5aKT5pqu5bmV5Yuf5oWV5pyo55uu552m54mn56mG5ou/5ZOq5ZGQ6ZKg6YKj5aic57qz5rCW5LmD5aW26ICQ5aWI5Y2X55S36Zq+5ZuK5oyg6ISR5oG86Ze55reW5ZGi6aaB5YaF5aup6IO95aau6ZyT5YCq5rOl5bC85ouf5L2g5Yy/6IW76YCG5rq66JSr5ouI5bm056K+5pK15o275b+15aiY6YW/6bif5bC/5o2P6IGC5a295ZWu6ZWK6ZWN5raF5oKo5p+g54ue5Yed5a6BXCJdLFxuW1wiYzU0MFwiLFwi6IeUXCIsMTQsXCLoh6Toh6Xoh6boh6joh6noh6voh65cIiw0LFwi6Ie1XCIsNSxcIuiHveiHv+iIg+iIh1wiLDQsXCLoiI7oiI/oiJHoiJPoiJVcIiw1LFwi6Iid6Iig6Iik6Iil6Iim6Iin6Iip6Iiu6Iiy6Ii66Ii86Ii96Ii/XCJdLFxuW1wiYzU4MFwiLFwi6ImA6ImB6ImC6ImD6ImF6ImG6ImI6ImK6ImM6ImN6ImO6ImQXCIsNyxcIuiJmeiJm+iJnOiJneiJnuiJoFwiLDcsXCLoianmi6fms57niZvmia3pkq7nur3ohJPmtZPlhpzlvITlpbTliqrmgJLlpbPmmpbomZDnlp/mjKrmh6bns6/or7rlk6bmrKfpuKXmrrTol5XlkZXlgbbmsqTllarotrTniKzluJXmgJXnkLbmi43mjpLniYzlvpjmuYPmtL7mlIDmvZjnm5jno5Dnm7znlZTliKTlj5vkuZPlup7ml4HogKrog5bmipvlkobliKjngq7ooo3ot5Hms6Hlkbjog5rln7noo7TotZTpmarphY3kvanmspvllrfnm4bnoLDmiqjng7nmvo7lva3ok6zmo5rnobznr7fohqjmnIvpuY/mjafnorDlna/noJLpnLnmibnmiqvliojnkLXmr5dcIl0sXG5bXCJjNjQwXCIsXCLoiaroiavoiazoia3oibHoibXoibboibfoibjoibvoibzoioDoioHoioPoioXoioboiofoionoiozoipDoipPoipToipXoipboiproipvoip7oiqDoiqLoiqPoiqfoirLoirXoirboirroirvoirzoir/oi4Doi4Loi4Poi4Xoi4boi4noi5Doi5boi5noi5roi53oi6Loi6foi6joi6noi6roi6zoi63oi67oi7Doi7Loi7Poi7Xoi7boi7hcIl0sXG5bXCJjNjgwXCIsXCLoi7roi7xcIiw0LFwi6IyK6IyL6IyN6IyQ6IyS6IyT6IyW6IyY6IyZ6IydXCIsOSxcIuiMqeiMquiMruiMsOiMsuiMt+iMu+iMveWVpOiEvueWsuearuWMueeXnuWDu+WxgeitrOevh+WBj+eJh+mql+mjmOa8gueTouelqOaSh+eepeaLvOmikei0q+WTgeiBmOS5kuWdquiLueiQjeW5s+WHreeTtuivhOWxj+WdoeazvOmih+WphuegtOmthOi/q+eyleWJluaJkemTuuS7huiOhuiRoeiPqeiSsuWflOactOWcg+aZrua1puiwseabneeAkeacn+asuuagluaImuWmu+S4g+WHhOa8huafkuayj+WFtuaji+Wlh+atp+eVpuW0juiEkOm9kOaXl+eliOelgemqkei1t+WyguS5nuS8geWQr+WlkeegjOWZqOawlOi/hOW8g+axveazo+iuq+aOkFwiXSxcbltcImM3NDBcIixcIuiMvuiMv+iNgeiNguiNhOiNheiNiOiNilwiLDQsXCLojZPojZVcIiw0LFwi6I2d6I2i6I2wXCIsNixcIuiNueiNuuiNvlwiLDYsXCLojofojojojorojovojozojo3ojo/ojpDojpHojpTojpXojpbojpfojpnojprojp3ojp/ojqFcIiw2LFwi6I6s6I6t6I6uXCJdLFxuW1wiYzc4MFwiLFwi6I6v6I616I676I6+6I6/6I+C6I+D6I+E6I+G6I+I6I+J6I+L6I+N6I+O6I+Q6I+R6I+S6I+T6I+V6I+X6I+Z6I+a6I+b6I+e6I+i6I+j6I+k6I+m6I+n6I+o6I+r6I+s6I+t5oGw5rS954m15omm6ZKO6ZOF5Y2D6L+B562+5Luf6LCm5Lm+6buU6ZKx6ZKz5YmN5r2c6YGj5rWF6LC05aCR5bWM5qyg5q2J5p6q5ZGb6IWU576M5aKZ6JS35by65oqi5qmH6ZS55pWy5oKE5qGl556n5LmU5L6o5ben6Z6Y5pKs57+Y5bOt5L+P56qN5YiH6IyE5LiU5oCv56qD6ZKm5L615Lqy56em55C05Yuk6Iq55pOS56a95a+d5rKB6Z2S6L275rCi5YC+5Y2/5riF5pOO5pm05rCw5oOF6aG36K+35bqG55C856m356eL5LiY6YKx55CD5rGC5Zua6YWL5rOF6LaL5Yy66JuG5puy6Lqv5bGI6amx5rigXCJdLFxuW1wiYzg0MFwiLFwi6I+u6I+v6I+zXCIsNCxcIuiPuuiPu+iPvOiPvuiPv+iQgOiQguiQheiQh+iQiOiQieiQiuiQkOiQklwiLDUsXCLokJnokJrokJvokJ5cIiw1LFwi6JCpXCIsNyxcIuiQslwiLDUsXCLokLnokLrokLvokL5cIiw3LFwi6JGH6JGI6JGJXCJdLFxuW1wiYzg4MFwiLFwi6JGKXCIsNixcIuiRklwiLDQsXCLokZjokZ3okZ7okZ/okaDokaLokaRcIiw0LFwi6JGq6JGu6JGv6JGw6JGy6JG06JG36JG56JG76JG85Y+W5ai26b6L6Laj5Y675ZyI6aKn5p2D6Yab5rOJ5YWo55eK5ouz54qs5Yi45Yqd57y654KU55i45Y206bmK5qa356Gu6ZuA6KOZ576k54S254eD5YaJ5p+T55Ok5aOk5pSY5Zq36K6p6aW25omw57uV5oO554Ot5aOs5LuB5Lq65b+N6Z+n5Lu76K6k5YiD5aaK57qr5omU5LuN5pel5oiO6Iy46JOJ6I2j6J6N54aU5rq25a6557uS5YaX5o+J5p+U6IKJ6Iy56KCV5YSS5a265aaC6L6x5Lmz5rGd5YWl6KSl6L2v6Ziu6JWK55Ge6ZSQ6Zew5ram6Iul5byx5pKS5rSS6JCo6IWu6bOD5aGe6LWb5LiJ5Y+BXCJdLFxuW1wiYzk0MFwiLFwi6JG9XCIsNCxcIuiSg+iShOiSheiShuiSiuiSjeiSj1wiLDcsXCLokpjokprokpvokp3okp7okp/okqDokqJcIiwxMixcIuiSsOiSseiSs+iSteiStuiSt+iSu+iSvOiSvuiTgOiTguiTg+iTheiThuiTh+iTiOiTi+iTjOiTjuiTj+iTkuiTlOiTleiTl1wiXSxcbltcImM5ODBcIixcIuiTmFwiLDQsXCLok57ok6Hok6Lok6Tok6dcIiw0LFwi6JOt6JOu6JOv6JOxXCIsMTAsXCLok73ok77olIDolIHolILkvJ7mlaPmoZHll5PkuKfmkJTpqprmiavlq4LnkZ/oibLmtqnmo67lg6fojo7noILmnYDliLnmspnnurHlgrvllaXnhZ7nrZvmmZLnj4roi6vmnYnlsbHliKDnhb3ooavpl6rpmZXmk4XotaHohrPlloTmsZXmiYfnvK7lopLkvKTllYbotY/mmYzkuIrlsJroo7PmoqLmjY7nqI3ng6foio3li7rpn7blsJHlk6jpgrXnu43lpaLotYrom4foiIzoiI3otabmkYTlsITmhZHmtonnpL7orr7noLfnlLPlkbvkvLjouqvmt7HlqKDnu4XnpZ7msojlrqHlqbbnlJrogr7mhY7muJflo7DnlJ/nlKXnibLljYfnu7NcIl0sXG5bXCJjYTQwXCIsXCLolINcIiw4LFwi6JSN6JSO6JSP6JSQ6JSS6JSU6JSV6JSW6JSY6JSZ6JSb6JSc6JSd6JSe6JSg6JSiXCIsOCxcIuiUrVwiLDksXCLolL5cIiw0LFwi6JWE6JWF6JWG6JWH6JWLXCIsMTBdLFxuW1wiY2E4MFwiLFwi6JWX6JWY6JWa6JWb6JWc6JWd6JWfXCIsNCxcIuiVpeiVpuiVp+iVqVwiLDgsXCLolbPolbXolbbolbfolbjolbzolb3olb/oloDoloHnnIHnm5vlianog5zlnKPluIjlpLHni67mlr3mub/or5flsLjombHljYHnn7Pmi77ml7bku4Dpo5/omoDlrp7or4blj7Lnn6Lkvb/lsY7pqbblp4vlvI/npLrlo6vkuJbmn7/kuovmi63oqpPpgJ3lir/mmK/ll5zlmazpgILku5Xkvo3ph4rppbDmsI/luILmgYPlrqTop4bor5XmlLbmiYvpppblrojlr7/mjojllK7lj5fnmKblhb3olKzmnqLmorPmrormipLovpPlj5ToiJLmt5Hnlo/kuabotY7lrbDnhp/olq/mmpHmm5nnvbLonIDpu43pvKDlsZ7mnK/ov7DmoJHmnZ/miI3nq5blooXlurbmlbDmvLFcIl0sXG5bXCJjYjQwXCIsXCLoloLoloPolobolohcIiw2LFwi6JaQXCIsMTAsXCLolp1cIiw2LFwi6Jal6Jam6Jan6Jap6Jar6Jas6Jat6JaxXCIsNSxcIuiWuOiWulwiLDYsXCLol4JcIiw2LFwi6JeKXCIsNCxcIuiXkeiXklwiXSxcbltcImNiODBcIixcIuiXlOiXllwiLDUsXCLol51cIiw2LFwi6Jel6Jem6Jen6Jeo6JeqXCIsMTQsXCLmgZXliLfogI3mkZToobDnlKnluIXmoJPmi7TpnJzlj4zniL3osIHmsLTnnaHnqI7lkK7nnqzpobroiJzor7TnoZXmnJTng4Hmlq/mkpXlmLbmgJ3np4Hlj7jkuJ3mrbvogoblr7rll6Plm5vkvLrkvLzppbLlt7Pmnb7ogLjmgILpooLpgIHlrovorrzor7XmkJzoiZjmk57ll73oi4/phaXkv5fntKDpgJ/nsp/lg7PloZHmuq/lrr/or4nogoPphbjokpznrpfomb3pmovpmo/nu6Xpq5Pnoo7lsoHnqZfpgYLpmqfnpZ/lrZnmjZ/nrIvok5Hmoq3llIbnvKnnkJDntKLplIHmiYDloYzku5blroPlpbnloZRcIl0sXG5bXCJjYzQwXCIsXCLol7nol7rol7zol73ol77omIBcIiw0LFwi6JiGXCIsMTAsXCLomJLomJPomJTomJXomJdcIiwxNSxcIuiYqOiYqlwiLDEzLFwi6Ji56Ji66Ji76Ji96Ji+6Ji/6JmAXCJdLFxuW1wiY2M4MFwiLFwi6JmBXCIsMTEsXCLomZLomZPomZVcIiw0LFwi6Jmb6Jmc6Jmd6Jmf6Jmg6Jmh6JmjXCIsNyxcIueNreaMnui5i+i4j+iDjuiLlOaKrOWPsOazsOmFnuWkquaAgeaxsOWdjeaRiui0queYq+a7qeWdm+aqgOeXsOa9reiwreiwiOWdpuavr+iikueis+aOouWPueeCreaxpOWhmOaQquWgguajoOiGm+WUkOezluWAmOi6uua3jOi2n+eDq+aOj+a2m+a7lOe7puiQhOahg+mAg+a3mOmZtuiuqOWll+eJueiXpOiFvueWvOiqiuair+WJlOi4oumUkeaPkOmimOi5hOWVvOS9k+abv+Waj+aDlea2leWJg+WxieWkqea3u+Whq+eUsOeUnOaBrOiIlOiFhuaMkeadoei/ouecuui3s+i0tOmTgeW4luWOheWQrOeDg1wiXSxcbltcImNkNDBcIixcIuiZreiZr+iZsOiZslwiLDYsXCLomoNcIiw2LFwi6JqOXCIsNCxcIuialOiallwiLDUsXCLomp5cIiw0LFwi6Jql6Jqm6Jqr6Jqt6Jqu6Jqy6Jqz6Jq36Jq46Jq56Jq7XCIsNCxcIuibgeibguibg+ibheibiOibjOibjeibkuibk+ibleibluibl+ibmuibnFwiXSxcbltcImNkODBcIixcIuibneiboOiboeibouibo+ibpeibpuibp+ibqOibquibq+ibrOibr+ibteibtuibt+ibuuibu+ibvOibveibv+icgeichOicheichuici+icjOicjuicj+ickOickeiclOicluaxgOW7t+WBnOS6reW6reaMuuiJh+mAmuahkOmFruees+WQjOmTnOW9pOerpeahtuaNheetkue7n+eXm+WBt+aKleWktOmAj+WHuOeng+eqgeWbvuW+kumAlOa2guWxoOWcn+WQkOWFlOa5jeWbouaOqOmik+iFv+icleikqumAgOWQnuWxr+iHgOaLluaJmOiEsem4temZgOmprumpvOakreWmpeaLk+WUvuaMluWTh+ibmea0vOWog+eTpuiinOatquWkluixjOW8r+a5vueOqemhveS4uOeDt+WujOeil+aMveaZmuealuaDi+Wum+WpieS4h+iFleaxqueOi+S6oeaeiee9keW+gOaXuuacm+W/mOWmhOWogVwiXSxcbltcImNlNDBcIixcIuicmeicm+icneicn+icoOicpOicpuicp+icqOicquicq+icrOicreicr+icsOicsuics+icteictuicuOicueicuuicvOicveidgFwiLDYsXCLonYronYvonY3onY/onZDonZHonZLonZTonZXonZbonZjonZpcIiw1LFwi6J2h6J2i6J2mXCIsNyxcIuidr+idseidsuids+idtVwiXSxcbltcImNlODBcIixcIuidt+iduOidueiduuidv+iegOiegeiehOiehuieh+ieieieiuiejOiejlwiLDQsXCLonpTonpXonpbonphcIiw2LFwi6J6gXCIsNCxcIuW3jeW+ruWNsemfpui/neahheWbtOWUr+aDn+S4uua9jee7tOiLh+iQjuWnlOS8n+S8quWwvue6rOacquiUmuWRs+eVj+iDg+WWgumtj+S9jea4reiwk+WwieaFsOWNq+eYn+a4qeiaiuaWh+mXu+e6ueWQu+eos+e0iumXruWXoee/geeTruaMneicl+a2oeeqneaIkeaWoeWNp+aPoeayg+W3q+WRnOmSqOS5jOaxoeivrOWxi+aXoOiKnOaip+WQvuWQtOavi+atpuS6lOaNguWNiOiInuS8jeS+ruWdnuaIiumbvuaZpOeJqeWLv+WKoeaCn+ivr+aYlOeGmeaekOilv+ehkuefveaZsOWYu+WQuOmUoeeJulwiXSxcbltcImNmNDBcIixcIuiepeiepuiep+ieqeiequieruiesOieseiesuietOietuiet+ieuOieueieu+ievOievuiev+ifgVwiLDQsXCLon4fon4jon4non4xcIiw0LFwi6J+UXCIsNixcIuifnOifneifnuifn+ifoeifouifo+ifpOifpuifp+ifqOifqeifq+ifrOifreifr1wiLDldLFxuW1wiY2Y4MFwiLFwi6J+66J+76J+86J+96J+/6KCA6KCB6KCC6KCEXCIsNSxcIuigi1wiLDcsXCLooJTooJfooJjooJnooJrooJxcIiw0LFwi6KCj56iA5oGv5biM5oKJ6Iad5aSV5oOc54aE54Ov5rqq5rGQ54qA5qqE6KKt5bit5Lmg5aqz5Zac6ZOj5rSX57O76ZqZ5oiP57uG556O6Jm+5Yyj6Zye6L6W5pqH5bOh5L6g54ut5LiL5Y6m5aSP5ZCT5o6A6ZSo5YWI5LuZ6bKc57qk5ZK46LSk6KGU6Ii36Zey5raO5bym5auM5pi+6Zmp546w54yu5Y6/6IW66aaF576h5a6q6Zm36ZmQ57q/55u45Y6i6ZW26aaZ566x6KWE5rmY5Lmh57+U56Wl6K+m5oOz5ZON5Lqr6aG55be35qmh5YOP5ZCR6LGh6JCn56Gd6ZyE5YmK5ZOu5Zqj6ZSA5raI5a615reG5pmTXCJdLFxuW1wiZDA0MFwiLFwi6KCkXCIsMTMsXCLooLNcIiw1LFwi6KC66KC76KC96KC+6KC/6KGB6KGC6KGD6KGGXCIsNSxcIuihjlwiLDUsXCLooZXooZbooZjooZpcIiw2LFwi6KGm6KGn6KGq6KGt6KGv6KGx6KGz6KG06KG16KG26KG46KG56KG6XCJdLFxuW1wiZDA4MFwiLFwi6KG76KG86KKA6KKD6KKG6KKH6KKJ6KKK6KKM6KKO6KKP6KKQ6KKR6KKT6KKU6KKV6KKXXCIsNCxcIuiinVwiLDQsXCLooqPooqVcIiw1LFwi5bCP5a2d5qCh6IKW5ZW456yR5pWI5qWU5Lqb5q2H6J2O6Z6L5Y2P5oyf5pC66YKq5pac6IOB6LCQ5YaZ5qKw5Y246J+55oeI5rOE5rO76LCi5bGR6Jaq6Iqv6ZSM5qyj6L6b5paw5b+75b+D5L+h6KGF5pif6IWl54yp5oO65YW05YiR5Z6L5b2i6YKi6KGM6YaS5bm45p2P5oCn5aeT5YWE5Ye26IO45YyI5rG56ZuE54aK5LyR5L+u576e5py95ZeF6ZSI56eA6KKW57uj5aKf5oiM6ZyA6Jma5ZiY6aG75b6Q6K646JOE6YWX5Y+Z5pet5bqP55Wc5oGk57Wu5am/57uq57ut6L2p5Zan5a6j5oKs5peL546EXCJdLFxuW1wiZDE0MFwiLFwi6KKs6KKu6KKv6KKw6KKyXCIsNCxcIuiiuOiiueiiuuiiu+iiveiivuiiv+ijgOijg+ijhOijh+ijiOijiuiji+ijjOijjeijj+ijkOijkeijk+ijluijl+ijmlwiLDQsXCLoo6Doo6Hoo6boo6foo6lcIiw2LFwi6KOy6KO16KO26KO36KO66KO76KO96KO/6KSA6KSB6KSDXCIsNV0sXG5bXCJkMTgwXCIsXCLopInopItcIiw0LFwi6KSR6KSUXCIsNCxcIuiknFwiLDQsXCLopKLopKPopKTopKbopKfopKjopKnopKzopK3opK7opK/opLHopLLopLPopLXopLfpgInnmaPnnKnnu5rpnbTolpvlrabnqbTpm6rooYDli4vnho/lvqrml6zor6Llr7vpqa/lt6HmronmsZvorq3orq/pgIrov4XljovmirzpuKbpuK3lkYDkuKvoir3niZnompzltJbooZnmtq/pm4Xlk5HkuprorrbnhInlkr3pmInng5/mt7nnm5DkuKXnoJTonJLlsqnlu7boqIDpopzpmI7ngo7msr/lpYTmjqnnnLzooY3mvJToibPloLDnh5XljoznoJrpm4HllIHlvabnhLDlrrTosJrpqozmroPlpK7puK/np6fmnajmiazkva/nlqHnvormtIvpmLPmsKfku7Dnl5LlhbvmoLfmvL7pgoDohbDlppbnkbZcIl0sXG5bXCJkMjQwXCIsXCLopLhcIiw4LFwi6KWC6KWD6KWFXCIsMjQsXCLopaBcIiw1LFwi6KWnXCIsMTksXCLopbxcIl0sXG5bXCJkMjgwXCIsXCLopb3opb7opoDopoLopoTopoXopodcIiwyNixcIuaRh+Wwp+mBpeeqkeiwo+WnmuWSrOiIgOiNr+imgeiAgOaksOWZjuiAtueIt+mHjuWGtuS5n+mhteaOluS4muWPtuabs+iFi+WknOa2suS4gOWjueWMu+aPlumTseS+neS8iuiho+mikOWkt+mBl+enu+S7quiDsOeWkeayguWunOWnqOW9neakheiageWAmuW3suS5meefo+S7peiJuuaKkeaYk+mCkeWxueS6v+W9ueiHhumAuOiChOeWq+S6puijlOaEj+avheW/huS5ieebiua6ouivo+iuruiwiuivkeW8gue/vOe/jOe7juiMteiNq+WboOaut+mfs+mYtOWnu+WQn+mTtua3q+WvhemlruWwueW8lemakFwiXSxcbltcImQzNDBcIixcIuimolwiLDMwLFwi6KeD6KeN6KeT6KeU6KeV6KeX6KeY6KeZ6Keb6Ked6Kef6Keg6Keh6Kei6Kek6Ken6Keo6Kep6Keq6Kes6Ket6Keu6Kew6Kex6Key6Ke0XCIsNl0sXG5bXCJkMzgwXCIsXCLop7tcIiw0LFwi6KiBXCIsNSxcIuioiFwiLDIxLFwi5Y2w6Iux5qix5am06bmw5bqU57yo6I656JCk6JCl6I2n6J2H6L+O6LWi55uI5b2x6aKW56Gs5pig5ZOf5oul5L2j6IeD55eI5bq46ZuN6LiK6Ju55ZKP5rOz5raM5rC45oG/5YuH55So5bm95LyY5oKg5b+n5bCk55Sx6YKu6ZOA54q55rK55ri46YWJ5pyJ5Y+L5Y+z5L2R6YeJ6K+x5Y+I5bm86L+C5rek5LqO55uC5qaG6Jme5oSa6IiG5L2Z5L+e6YC+6bG85oSJ5rid5riU6ZqF5LqI5aix6Zuo5LiO5bG/56a55a6H6K+t5769546J5Z+f6IqL6YOB5ZCB6YGH5Za75bOq5b6h5oSI5qyy54ux6IKy6KqJXCJdLFxuW1wiZDQ0MFwiLFwi6KieXCIsMzEsXCLoqL9cIiw4LFwi6KmJXCIsMjFdLFxuW1wiZDQ4MFwiLFwi6KmfXCIsMjUsXCLoqbpcIiw2LFwi5rW05a+T6KOV6aKE6LGr6amt6biz5riK5Yak5YWD5Z6j6KKB5Y6f5o+06L6V5Zut5ZGY5ZyG54y/5rqQ57yY6L+c6IuR5oS/5oCo6Zmi5puw57qm6LaK6LeD6ZKl5bKz57Kk5pyI5oKm6ZiF6ICY5LqR6YOn5YyA6Zmo5YWB6L+Q6JW06YWd5pmV6Z+15a2V5Yyd56C45p2C5qC95ZOJ54G+5a6w6L295YaN5Zyo5ZKx5pSS5pqC6LWe6LWD6ISP6JGs6YGt57Of5Ye/6Je75p6j5pep5r6h6Jqk6LqB5Zmq6YCg55qC54G254el6LSj5oup5YiZ5rO96LS85oCO5aKe5oaO5pu+6LWg5omO5Zaz5rij5pyt6L2nXCJdLFxuW1wiZDU0MFwiLFwi6KqBXCIsNyxcIuiqi1wiLDcsXCLoqpRcIiw0Nl0sXG5bXCJkNTgwXCIsXCLoq4NcIiwzMixcIumToemXuOecqOagheamqOWSi+S5jeeCuOiviOaRmOaWi+WuheeqhOWAuuWvqOeeu+avoeipueeymOayvuebj+aWqei+l+W0reWxleiYuOagiOWNoOaImOermea5m+e7veaon+eroOW9sOa8s+W8oOaOjOa2qOadluS4iOW4kOi0puS7l+iDgOeYtOmanOaLm+aYreaJvuayvOi1teeFp+e9qeWFhuiCh+WPrOmBruaKmOWTsuibsOi+meiAhemUl+iUl+i/mea1meePjeaWn+ecn+eUhOegp+iHu+i0numSiOS+puaeleeWueiviumch+aMr+mVh+mYteiSuOaMo+edgeW+geeLsOS6ieaAlOaVtOaLr+ato+aUv1wiXSxcbltcImQ2NDBcIixcIuirpFwiLDM0LFwi6KyIXCIsMjddLFxuW1wiZDY4MFwiLFwi6Kyk6Kyl6KynXCIsMzAsXCLluKfnl4fpg5Hor4Hoip3mnp3mlK/lkLHonJjnn6XogqLohILmsYHkuYvnu4fogYznm7TmpI3mrpbmiaflgLzkvoTlnYDmjIfmraLotr7lj6rml6jnurjlv5fmjJrmjrfoh7Poh7Tnva7luJzls5nliLbmmbrnp6nnqJrotKjngpnnl5Tmu57msrvnqpLkuK3nm4Xlv6Dpkp/oobfnu4jnp43ogr/ph43ku7LkvJfoiJ/lkajlt57mtLLor4znsqXovbTogpjluJrlkpLnmrHlrpnmmLzpqqTnj6DmoKrom5vmnLHnjKror7jor5vpgJDnq7nng5vnha7mi4TnnqnlmLHkuLvokZfmn7Hliqnom4DotK7pk7jnrZFcIl0sXG5bXCJkNzQwXCIsXCLorYZcIiwzMSxcIuitp1wiLDQsXCLora1cIiwyNV0sXG5bXCJkNzgwXCIsXCLorodcIiwyNCxcIuiurOiuseiuu+ivh+ivkOivquiwieiwnuS9j+azqOelnempu+aKk+eIquaLveS4k+eglui9rOaSsOi1muevhuahqeW6hOijheWmhuaSnuWjrueKtuakjumUpei/vei1mOWdoOe8gOiwhuWHhuaNieaLmeWNk+ahjOeQouiMgemFjOWVhOedgOeBvOa1iuWFueWSqOi1hOWnv+a7i+a3hOWtnOe0q+S7lOexvea7k+WtkOiHqua4jeWtl+msg+ajlei4quWul+e7vOaAu+e6temCuei1sOWlj+aPjeenn+i2s+WNkuaXj+elluivhemYu+e7hOmSu+e6guWYtOmGieacgOe9quWwiumBteaYqOW3puS9kOafnuWBmuS9nOWdkOW6p1wiXSxcbltcImQ4NDBcIixcIuiwuFwiLDgsXCLosYLosYPosYTosYXosYjosYrosYvosY1cIiw3LFwi6LGW6LGX6LGY6LGZ6LGbXCIsNSxcIuixo1wiLDYsXCLosaxcIiw2LFwi6LG06LG16LG26LG36LG7XCIsNixcIuiyg+iyhOiyhuiyh1wiXSxcbltcImQ4ODBcIixcIuiyiOiyi+iyjVwiLDYsXCLospXospbospfosplcIiwyMCxcIuS6jeS4jOWFgOS4kOW7v+WNheS4leS6mOS4numssuWtrOWZqeS4qOemuuS4v+WMleS5h+WkreeIu+WNruawkOWbn+iDpOmml+avk+edvum8l+S4tuS6n+m8kOS5nOS5qeS6k+iKiOWtm+WVrOWYj+S7hOWOjeWOneWOo+WOpeWOrumdpei1neWMmuWPteWMpuWMruWMvui1nOWNpuWNo+WIguWIiOWIjuWIreWIs+WIv+WJgOWJjOWJnuWJoeWJnOiSr+WJveWKguWKgeWKkOWKk+WGgue9lOS6u+S7g+S7ieS7guS7qOS7oeS7q+S7nuS8m+S7s+S8ouS9pOS7teS8peS8p+S8ieS8q+S9nuS9p+aUuOS9muS9nVwiXSxcbltcImQ5NDBcIixcIuiyrlwiLDYyXSxcbltcImQ5ODBcIixcIuizrVwiLDMyLFwi5L2f5L2X5Lyy5Ly95L225L205L6R5L6J5L6D5L6P5L2+5L275L6q5L285L6s5L6U5L+m5L+o5L+q5L+F5L+a5L+j5L+c5L+R5L+f5L+45YCp5YGM5L+z5YCs5YCP5YCu5YCt5L++5YCc5YCM5YCl5YCo5YG+5YGD5YGV5YGI5YGO5YGs5YG75YKl5YKn5YKp5YK65YOW5YSG5YOt5YOs5YOm5YOu5YSH5YSL5Lud5rC95L2Y5L2l5L+O6b6g5rGG57G05YWu5be96buJ6aaY5YaB5aSU5Yu55YyN6KiH5YyQ5Yer5aSZ5YWV5Lqg5YWW5Lqz6KGu6KKk5Lq16ISU6KOS56aA5ay06KCD57645Yar5Yax5Ya95Ya8XCJdLFxuW1wiZGE0MFwiLFwi6LSOXCIsMTQsXCLotKDotZHotZLotZfotZ/otaXotajotanotarotazota7ota/otbHotbLotbhcIiw4LFwi6LaC6LaD6LaG6LaH6LaI6LaJ6LaMXCIsNCxcIui2kui2k+i2lVwiLDksXCLotqDotqFcIl0sXG5bXCJkYTgwXCIsXCLotqLotqRcIiwxMixcIui2sui2tui2t+i2uei2u+i2vei3gOi3gei3gui3hei3h+i3iOi3iei3iui3jei3kOi3kui3k+i3lOWHh+WGluWGouWGpeiuoOiupuiup+iuquiutOiuteiut+ivguivg+ivi+ivj+ivjuivkuivk+ivlOivluivmOivmeivnOivn+ivoOivpOivqOivqeivruivsOivs+ivtuivueivvOivv+iwgOiwguiwhOiwh+iwjOiwj+iwkeiwkuiwlOiwleiwluiwmeiwm+iwmOiwneiwn+iwoOiwoeiwpeiwp+iwquiwq+iwruiwr+iwsuiws+iwteiwtuWNqeWNuumYnemYoumYoemYsemYqumYvemYvOmZgumZiemZlOmZn+mZp+mZrOmZsumZtOmaiOmajemal+masOmCl+mCm+mCnemCmemCrOmCoemCtOmCs+mCtumCulwiXSxcbltcImRiNDBcIixcIui3lei3mOi3mei3nOi3oOi3oei3oui3pei3pui3p+i3qei3rei3rui3sOi3sei3sui3tOi3tui3vOi3vlwiLDYsXCLouIbouIfouIjouIvouI3ouI7ouJDouJHouJLouJPouJVcIiw3LFwi6Lig6Lih6LikXCIsNCxcIui4q+i4rei4sOi4sui4s+i4tOi4tui4t+i4uOi4u+i4vOi4vlwiXSxcbltcImRiODBcIixcIui4v+i5g+i5hei5hui5jFwiLDQsXCLouZNcIiw1LFwi6LmaXCIsMTEsXCLouafouajouarouavoua7oubHpgrjpgrDpg4/pg4Xpgr7pg5Dpg4Tpg4fpg5Ppg6bpg6Lpg5zpg5fpg5vpg6vpg6/pg77phITphKLphJ7phKPphLHphK/phLnphYPphYbliI3lpYLliqLliqzliq3lir7lk7/li5Dli5bli7Dlj5/nh67nn43lu7Tlh7Xlh7zprK/ljrblvIHnlZrlt6/lnYzlnqnlnqHlob7lorzlo4Xlo5HlnKnlnKzlnKrlnLPlnLnlnK7lnK/lnZzlnLvlnYLlnanlnoXlnavlnoblnbzlnbvlnajlna3lnbblnbPlnq3lnqTlnozlnrLln4/lnqflnrTlnpPlnqDln5Xln5jln5rln5nln5Llnrjln7Tln6/ln7jln6Tln51cIl0sXG5bXCJkYzQwXCIsXCLoubPoubXoubdcIiw0LFwi6Lm96Lm+6LqA6LqC6LqD6LqE6LqG6LqIXCIsNixcIui6kei6kui6k+i6lVwiLDYsXCLoup3oup9cIiwxMSxcIui6rei6rui6sOi6sei6s1wiLDYsXCLourtcIiw3XSxcbltcImRjODBcIixcIui7g1wiLDEwLFwi6LuPXCIsMjEsXCLloIvloI3ln73ln63loIDloJ7loJnloYTloKDloaXloazlooHloonloprlooDppqjpvJnmh7/oibnoib3oib/oio/oioroiqjoioToio7oipHoipfoipnoiqvoirjoir7oirDoi4joi4roi6Poipjoirfoiq7oi4voi4zoi4HoiqnoirToiqHoiqroip/oi4Toi47oiqToi6HojInoi7foi6TojI/ojIfoi5zoi7Toi5Loi5jojIzoi7voi5PojJHojJrojIbojJTojJXoi6Doi5XojJzojZHojZvojZzojIjojpLojLzojLTojLHojpvojZ7ojK/ojY/ojYfojYPojZ/ojYDojJfojaDojK3ojLrojLPojabojaVcIl0sXG5bXCJkZDQwXCIsXCLou6VcIiw2Ml0sXG5bXCJkZDgwXCIsXCLovKRcIiwzMixcIuiNqOiMm+iNqeiNrOiNquiNreiNruiOsOiNuOiOs+iOtOiOoOiOquiOk+iOnOiOheiNvOiOtuiOqeiNveiOuOiNu+iOmOiOnuiOqOiOuuiOvOiPgeiQgeiPpeiPmOWgh+iQmOiQi+iPneiPveiPluiQnOiQuOiQkeiQhuiPlOiPn+iQj+iQg+iPuOiPueiPquiPheiPgOiQpuiPsOiPoeiRnOiRkeiRmuiRmeiRs+iSh+iSiOiRuuiSieiRuOiQvOiRhuiRqeiRtuiSjOiSjuiQseiRreiTgeiTjeiTkOiTpuiSveiTk+iTiuiSv+iSuuiToOiSoeiSueiStOiSl+iTpeiTo+iUjOeUjeiUuOiTsOiUueiUn+iUulwiXSxcbltcImRlNDBcIixcIui9hVwiLDMyLFwi6L2q6L6A6L6M6L6S6L6d6L6g6L6h6L6i6L6k6L6l6L6m6L6n6L6q6L6s6L6t6L6u6L6v6L6y6L6z6L606L616L636L646L666L676L686L6/6L+A6L+D6L+GXCJdLFxuW1wiZGU4MFwiLFwi6L+JXCIsNCxcIui/j+i/kui/lui/l+i/mui/oOi/oei/o+i/p+i/rOi/r+i/sei/sui/tOi/tei/tui/uui/u+i/vOi/vui/v+mAh+mAiOmAjOmAjumAk+mAlemAmOiVluiUu+iTv+iTvOiVmeiViOiVqOiVpOiVnuiVuueeouiVg+iVsuiVu+iWpOiWqOiWh+iWj+iVueiWruiWnOiWheiWueiWt+iWsOiXk+iXgeiXnOiXv+iYp+iYheiYqeiYluiYvOW7vuW8iOWkvOWlgeiAt+WlleWlmuWlmOWMj+WwouWwpeWwrOWwtOaJjOaJquaKn+aKu+aLiuaLmuaLl+aLruaMouaLtuaMueaNi+aNg+aOreaPtuaNseaNuuaOjuaOtOaNreaOrOaOiuaNqeaOruaOvOaPsuaPuOaPoOaPv+aPhOaPnuaPjuaRkuaPhuaOvuaRheaRgeaQi+aQm+aQoOaQjOaQpuaQoeaRnuaShOaRreaSllwiXSxcbltcImRmNDBcIixcIumAmemAnOmAo+mApOmApemAp1wiLDUsXCLpgLBcIiw0LFwi6YC36YC56YC66YC96YC/6YGA6YGD6YGF6YGG6YGIXCIsNCxcIumBjumBlOmBlemBlumBmemBmumBnFwiLDUsXCLpgaTpgabpgafpganpgarpgavpgazpga9cIiw0LFwi6YG2XCIsNixcIumBvumCgVwiXSxcbltcImRmODBcIixcIumChOmChemChumCh+mCiemCiumCjFwiLDQsXCLpgpLpgpTpgpbpgpjpgprpgpzpgp7pgp/pgqDpgqTpgqXpgqfpgqjpgqnpgqvpgq3pgrLpgrfpgrzpgr3pgr/pg4Dmkbrmkrfmkrjmkpnmkrrmk4Dmk5Dmk5fmk6Tmk6LmlInmlKXmlK7lvIvlv5LnlJnlvJHljZ/lj7Hlj73lj6nlj6jlj7vlkJLlkJblkIblkYvlkZLlkZPlkZTlkZblkYPlkKHlkZflkZnlkKPlkLLlkoLlkpTlkbflkbHlkaTlkprlkpvlkoTlkbblkablkp3lk5Dlkq3lk4LlkrTlk5Llkqflkqblk5Plk5TlkbLlkqPlk5Xlkrvlkr/lk4zlk5nlk5rlk5zlkqnlkqrlkqTlk53lk4/lk57llJvlk6fllKDlk73llJTlk7PllKLllKPllI/llJHllKfllKrllafllo/llrXllYnlla3llYHllZXllL/llZDllLxcIl0sXG5bXCJlMDQwXCIsXCLpg4Lpg4Ppg4bpg4jpg4npg4vpg4zpg43pg5Lpg5Tpg5Xpg5bpg5jpg5npg5rpg57pg5/pg6Dpg6Ppg6Tpg6Xpg6npg6rpg6zpg67pg7Dpg7Hpg7Lpg7Ppg7Xpg7bpg7fpg7npg7rpg7vpg7zpg7/phIDphIHphIPphIVcIiwxOSxcIumEmumEm+mEnFwiXSxcbltcImUwODBcIixcIumEnemEn+mEoOmEoemEpFwiLDEwLFwi6YSw6YSyXCIsNixcIumEulwiLDgsXCLphYTllLfllZbllbXllbbllbfllLPllLDllZzllovll5LlloPllrHllrnllojlloHllp/llb7ll5bllpHllbvll5/llr3llr7llpTllpnll6rll7fll4nlmJ/ll5Hll6vll6zll5Tll6bll53ll4Tll6/ll6Xll7Lll7Pll4zll43ll6jll7Xll6TovpTlmJ7lmIjlmIzlmIHlmKTlmKPll77lmIDlmKflmK3lmZjlmLnlmZflmKzlmY3lmaLlmZnlmZzlmYzlmZTlmoblmaTlmbHlmavlmbvlmbzlmoXlmpPlmq/lm5Tlm5flm53lm6Hlm7Xlm6vlm7nlm7/lnITlnIrlnInlnJzluI/luJnluJTluJHluLHluLvluLxcIl0sXG5bXCJlMTQwXCIsXCLphYXphYfphYjphZHphZPphZTphZXphZbphZjphZnphZvphZzphZ/phaDphabphafphajphavpha3phbPphbrphbvphbzphoBcIiw0LFwi6YaG6YaI6YaK6YaO6YaP6YaTXCIsNixcIumGnFwiLDUsXCLphqRcIiw1LFwi6Yar6Yas6Yaw6Yax6Yay6Yaz6Ya26Ya36Ya46Ya56Ya7XCJdLFxuW1wiZTE4MFwiLFwi6Ya8XCIsMTAsXCLph4jph4vph5Dph5JcIiw5LFwi6YedXCIsOCxcIuW4t+W5hOW5lOW5m+W5nuW5oeWyjOWxuuWyjeWykOWyluWyiOWymOWymeWykeWymuWynOWyteWyouWyveWyrOWyq+WyseWyo+WzgeWyt+WzhOWzkuWzpOWzi+WzpeW0guW0g+W0p+W0puW0ruW0pOW0nuW0huW0m+W1mOW0vuW0tOW0veW1rOW1m+W1r+W1neW1q+W1i+W1iuW1qeW1tOW2guW2meW2neixs+W2t+W3heW9s+W9t+W+guW+h+W+ieW+jOW+leW+meW+nOW+qOW+reW+teW+vOihouW9oeeKreeKsOeKtOeKt+eKuOeLg+eLgeeLjueLjeeLkueLqOeLr+eLqeeLsueLtOeLt+eMgeeLs+eMg+eLulwiXSxcbltcImUyNDBcIixcIumHplwiLDYyXSxcbltcImUyODBcIixcIumIpVwiLDMyLFwi54u754yX54yT54yh54yK54ye54yd54yV54yi54y554yl54ys54y454yx542Q542N542X542g542s542v542+6Iib5aSl6aOn5aSk5aSC6aWj6aWnXCIsNSxcIumltOmlt+mlvemmgOmmhOmmh+mmiummjemmkOmmkemmk+mmlOmmleW6gOW6keW6i+W6luW6peW6oOW6ueW6teW6vuW6s+i1k+W7kuW7keW7m+W7qOW7quiGuuW/hOW/ieW/luW/j+aAg+W/ruaAhOW/oeW/pOW/vuaAheaAhuW/quW/reW/uOaAmeaAteaApuaAm+aAj+aAjeaAqeaAq+aAiuaAv+aAoeaBuOaBueaBu+aBuuaBglwiXSxcbltcImUzNDBcIixcIumJhlwiLDQ1LFwi6Ym1XCIsMTZdLFxuW1wiZTM4MFwiLFwi6YqGXCIsNyxcIumKj1wiLDI0LFwi5oGq5oG95oKW5oKa5oKt5oKd5oKD5oKS5oKM5oKb5oOs5oK75oKx5oOd5oOY5oOG5oOa5oK05oSg5oSm5oSV5oSj5oO05oSA5oSO5oSr5oWK5oW15oas5oaU5oan5oa35oeU5oe15b+d6Zqz6Zep6Zer6Zex6Zez6Ze16Ze26Ze86Ze+6ZiD6ZiE6ZiG6ZiI6ZiK6ZiL6ZiM6ZiN6ZiP6ZiS6ZiV6ZiW6ZiX6ZiZ6Zia5Lis54i/5oiV5rC15rGU5rGc5rGK5rKj5rKF5rKQ5rKU5rKM5rGo5rGp5rG05rG25rKG5rKp5rOQ5rOU5rKt5rO35rO45rOx5rOX5rKy5rOg5rOW5rO65rOr5rOu5rKx5rOT5rOv5rO+XCJdLFxuW1wiZTQ0MFwiLFwi6YqoXCIsNSxcIumKr1wiLDI0LFwi6YuJXCIsMzFdLFxuW1wiZTQ4MFwiLFwi6YupXCIsMzIsXCLmtLnmtKfmtIzmtYPmtYjmtIfmtITmtJnmtI7mtKvmtY3mtK7mtLXmtJrmtY/mtZLmtZTmtLPmtpHmta/mtp7mtqDmtZ7mtpPmtpTmtZzmtaDmtbzmtaPmuJrmt4fmt4Xmt57muI7mtr/mt6DmuJHmt6bmt53mt5nmuJbmtqvmuIzmtq7muKvmua7muY7muavmurLmuZ/muobmuZPmuZTmuLLmuKXmuYTmu5/murHmupjmu6DmvK3mu6LmuqXmuqfmur3murvmurfmu5fmurTmu4/muo/mu4Lmup/mvaLmvYbmvYfmvKTmvJXmu7nmvK/mvLbmvYvmvbTmvKrmvInmvKnmvonmvo3mvozmvbjmvbLmvbzmvbrmv5FcIl0sXG5bXCJlNTQwXCIsXCLpjIpcIiw1MSxcIumMv1wiLDEwXSxcbltcImU1ODBcIixcIumNilwiLDMxLFwi6Y2r5r+J5r6n5r655r625r+C5r+h5r+u5r+e5r+g5r+v54Ca54Cj54Cb54C554C154GP54Ge5a6A5a6E5a6V5a6T5a6l5a6455Sv6aqe5pC05a+k5a+u6KSw5a+w6LmH6KyH6L626L+T6L+V6L+l6L+u6L+k6L+p6L+m6L+z6L+o6YCF6YCE6YCL6YCm6YCR6YCN6YCW6YCh6YC16YC26YCt6YCv6YGE6YGR6YGS6YGQ6YGo6YGY6YGi6YGb5pq56YG06YG96YKC6YKI6YKD6YKL5b2Q5b2X5b2W5b2Y5bC75ZKr5bGQ5bGZ5a2x5bGj5bGm57685byq5byp5byt6Im05by86ay75bGu5aaB5aaD5aaN5aap5aaq5aajXCJdLFxuW1wiZTY0MFwiLFwi6Y2sXCIsMzQsXCLpjpBcIiwyN10sXG5bXCJlNjgwXCIsXCLpjqxcIiwyOSxcIumPi+mPjOmPjeWml+WniuWmq+WmnuWmpOWnkuWmsuWmr+Wnl+WmvuWoheWohuWnneWoiOWno+WnmOWnueWojOWoieWosuWotOWokeWoo+Wok+WpgOWpp+WpiuWpleWovOWpouWpteiDrOWqquWqm+Wpt+WpuuWqvuWrq+WqsuWrkuWrlOWquOWroOWro+WrseWrluWrpuWrmOWrnOWsieWsl+WsluWssuWst+WtgOWwleWwnOWtmuWtpeWts+WtkeWtk+Wtoumptempt+mpuOmpuumpv+mpvemqgOmqgemqhemqiOmqiumqkOmqkumqk+mqlumqmOmqm+mqnOmqnemqn+mqoOmqoumqo+mqpemqp+e6n+e6oee6o+e6pee6qOe6qVwiXSxcbltcImU3NDBcIixcIumPjlwiLDcsXCLpj5dcIiw1NF0sXG5bXCJlNzgwXCIsXCLpkI5cIiwzMixcIue6ree6sOe6vue7gOe7gee7gue7iee7i+e7jOe7kOe7lOe7l+e7m+e7oOe7oee7qOe7q+e7rue7r+e7see7sue8jee7tue7uue7u+e7vue8gee8gue8g+e8h+e8iOe8i+e8jOe8j+e8kee8kue8l+e8mee8nOe8m+e8n+e8oVwiLDYsXCLnvKrnvKvnvKznvK3nvK9cIiw0LFwi57y15bm655W/5beb55S+6YKV546O546R546u546i546f54+P54+C54+R5463546z54+A54+J54+I54+l54+Z6aG855CK54+p54+n54+e546654+y55CP55Cq55Gb55Cm55Cl55Co55Cw55Cu55CsXCJdLFxuW1wiZTg0MFwiLFwi6ZCvXCIsMTQsXCLpkL9cIiw0MyxcIumRrOmRremRrumRr1wiXSxcbltcImU4ODBcIixcIumRsFwiLDIwLFwi6ZKR6ZKW6ZKY6ZOH6ZOP6ZOT6ZOU6ZOa6ZOm6ZO76ZSc6ZSg55Cb55Ca55GB55Gc55GX55GV55GZ55G355Gt55G+55Kc55KO55KA55KB55KH55KL55Ke55Ko55Kp55KQ55Kn55OS55K66Z+q6Z+r6Z+s5p2M5p2T5p2e5p2I5p2p5p6l5p6H5p2q5p2z5p6Y5p6n5p215p6o5p6e5p6t5p6L5p235p285p+w5qCJ5p+Y5qCK5p+p5p6w5qCM5p+Z5p615p+a5p6z5p+d5qCA5p+D5p645p+i5qCO5p+B5p+95qCy5qCz5qGg5qGh5qGO5qGi5qGE5qGk5qKD5qCd5qGV5qGm5qGB5qGn5qGA5qC+5qGK5qGJ5qCp5qK15qKP5qG05qG35qKT5qGr5qOC5qWu5qO85qSf5qSg5qO5XCJdLFxuW1wiZTk0MFwiLFwi6ZSn6ZSz6ZS96ZWD6ZWI6ZWL6ZWV6ZWa6ZWg6ZWu6ZW06ZW16ZW3XCIsNyxcIumWgFwiLDQyXSxcbltcImU5ODBcIixcIumWq1wiLDMyLFwi5qSk5qOw5qSL5qSB5qWX5qOj5qSQ5qWx5qS55qWg5qWC5qWd5qaE5qWr5qaA5qaY5qW45qS05qeM5qaH5qaI5qeO5qaJ5qWm5qWj5qW55qab5qan5qa75qar5qat5qeU5qax5qeB5qeK5qef5qaV5qeg5qaN5qe/5qiv5qet5qiX5qiY5qml5qey5qmE5qi+5qqg5qmQ5qmb5qi15qqO5qm55qi95qio5qmY5qm85qqR5qqQ5qqp5qqX5qqr54y3542S5q6B5q6C5q6H5q6E5q6S5q6T5q6N5q6a5q6b5q6h5q6q6L2r6L2t6L2x6L2y6L2z6L216L226L246L236L256L266L286L2+6L6B6L6C6L6E6L6H6L6LXCJdLFxuW1wiZWE0MFwiLFwi6ZeMXCIsMjcsXCLpl6zpl7/pmIfpmJPpmJjpmJvpmJ7pmKDpmKNcIiw2LFwi6Zir6Zis6Zit6Ziv6Ziw6Zi36Zi46Zi56Zi66Zi+6ZmB6ZmD6ZmK6ZmO6ZmP6ZmR6ZmS6ZmT6ZmW6ZmXXCJdLFxuW1wiZWE4MFwiLFwi6ZmY6ZmZ6Zma6Zmc6Zmd6Zme6Zmg6Zmj6Zml6Zmm6Zmr6ZmtXCIsNCxcIumZs+mZuFwiLDEyLFwi6ZqH6ZqJ6ZqK6L6N6L6O6L6P6L6Y6L6a6LuO5oiL5oiX5oib5oif5oii5oih5oil5oik5ois6Ien55Ov55O055O/55SP55SR55ST5pS05peu5pev5pew5piK5piZ5p2y5piD5piV5piA54KF5pu35pid5pi05pix5pi25pi16ICG5pmf5pmU5pmB5pmP5pmW5pmh5pmX5pm35pqE5pqM5pqn5pqd5pq+5pub5puc5pum5pup6LSy6LSz6LS26LS76LS96LWA6LWF6LWG6LWI6LWJ6LWH6LWN6LWV6LWZ6KeH6KeK6KeL6KeM6KeO6KeP6KeQ6KeR54mu54qf54md54mm54mv54m+54m/54qE54qL54qN54qP54qS5oyI5oyy5o6wXCJdLFxuW1wiZWI0MFwiLFwi6ZqM6ZqO6ZqR6ZqS6ZqT6ZqV6ZqW6Zqa6Zqb6ZqdXCIsOSxcIumaqFwiLDcsXCLpmrHpmrLpmrTpmrXpmrfpmrjpmrrpmrvpmr/pm4Lpm4Ppm4jpm4rpm4vpm5Dpm5Hpm5Ppm5Tpm5ZcIiw5LFwi6ZuhXCIsNixcIumbq1wiXSxcbltcImViODBcIixcIumbrOmbrembrumbsOmbsembsumbtOmbtembuOmbuumbu+mbvOmbvembv+mcgumcg+mchemciumci+mcjOmckOmckemckumclOmclemcl1wiLDQsXCLpnJ3pnJ/pnKDmkL/mk5jogITmr6rmr7Pmr73mr7Xmr7nmsIXmsIfmsIbmsI3msJXmsJjmsJnmsJrmsKHmsKnmsKTmsKrmsLLmlLXmlZXmlavniY3niZLniZbniLDomaLliJbogp/ogpzogpPogrzmnIrogr3ogrHogqvogq3ogrTogrfog6fog6jog6nog6rog5vog4Log4Tog5nog43og5fmnJDog53og6vog7Hog7Tog63ohI3ohI7og7Log7zmnJXohJLosZrohLbohJ7ohKzohJjohLLohYjohYzohZPohbTohZnohZrohbHohaDohanohbzohb3oha3ohafloY3lqrXohojohoLohpHmu5XohqPohqroh4zmnKboh4rohrtcIl0sXG5bXCJlYzQwXCIsXCLpnKFcIiw4LFwi6Zyr6Zys6Zyu6Zyv6Zyx6ZyzXCIsNCxcIumcuumcu+mcvOmcvemcv1wiLDE4LFwi6Z2U6Z2V6Z2X6Z2Y6Z2a6Z2c6Z2d6Z2f6Z2j6Z2k6Z2m6Z2n6Z2o6Z2qXCIsN10sXG5bXCJlYzgwXCIsXCLpnbLpnbXpnbdcIiw0LFwi6Z29XCIsNyxcIumehlwiLDQsXCLpnozpno7pno/pnpDpnpPpnpXpnpbpnpfpnplcIiw0LFwi6IeB6Iam5qyk5qy35qy55q2D5q2G5q2Z6aOR6aOS6aOT6aOV6aOZ6aOa5q6z5b2A5q+C6Kez5paQ6b2R5paT5pa85peG5peE5peD5peM5peO5peS5peW54KA54Kc54KW54Kd54K754OA54K354Kr54Kx54Oo54OK54SQ54ST54SW54Sv54Sx54Wz54Wc54Wo54WF54Wy54WK54W454W654aY54az54a154ao54ag54eg54eU54en54e554id54io54Gs54SY54Wm54a55oi+5oi95omD5omI5omJ56S756WA56WG56WJ56Wb56Wc56WT56Wa56Wi56WX56Wg56Wv56Wn56W656aF56aK56aa56an56az5b+R5b+QXCJdLFxuW1wiZWQ0MFwiLFwi6Z6e6Z6f6Z6h6Z6i6Z6kXCIsNixcIumerOmerumesOmesemes+metVwiLDQ2XSxcbltcImVkODBcIixcIumfpOmfpemfqOmfrlwiLDQsXCLpn7Tpn7dcIiwyMyxcIuaAvOaBneaBmuaBp+aBgeaBmeaBo+aCq+aEhuaEjeaFneaGqeaGneaHi+aHkeaIhuiCgOiBv+ayk+aztua3vOeftuefuOeggOegieegl+egmOegkeaWq+egreegnOegneegueeguuegu+egn+egvOegpeegrOego+egqeehjuehreehluehl+egpuehkOehh+ehjOehqueim+eik+eimueih+einOeioeeio+eisueiueeipeejlOejmeejieejrOejsuekheejtOekk+ekpOeknuektOm+m+m7uem7u+m7vOebseechOecjeebueech+eciOecmuecouecmeecreecpuecteecuOedkOedkeedh+edg+edmuedqFwiXSxcbltcImVlNDBcIixcIumgj1wiLDYyXSxcbltcImVlODBcIixcIumhjlwiLDMyLFwi552i552l552/556N5529556A556M556R556f556g556w5561556955S655WA55WO55WL55WI55Wb55Wy55W555aD572Y572h572f6KmI572o5720572x5725576B572+55uN55ul6KCy6ZKF6ZKG6ZKH6ZKL6ZKK6ZKM6ZKN6ZKP6ZKQ6ZKU6ZKX6ZKV6ZKa6ZKb6ZKc6ZKj6ZKk6ZKr6ZKq6ZKt6ZKs6ZKv6ZKw6ZKy6ZK06ZK2XCIsNCxcIumSvOmSvemSv+mThOmTiFwiLDYsXCLpk5Dpk5Hpk5Lpk5Xpk5bpk5fpk5npk5jpk5vpk57pk5/pk6Dpk6Lpk6Tpk6Xpk6fpk6jpk6pcIl0sXG5bXCJlZjQwXCIsXCLpoa9cIiw1LFwi6aKL6aKO6aKS6aKV6aKZ6aKj6aKoXCIsMzcsXCLpo4/po5Dpo5Tpo5bpo5fpo5vpo5zpo53po6BcIiw0XSxcbltcImVmODBcIixcIumjpemjpumjqVwiLDMwLFwi6ZOp6ZOr6ZOu6ZOv6ZOz6ZO06ZO16ZO36ZO56ZO86ZO96ZO/6ZSD6ZSC6ZSG6ZSH6ZSJ6ZSK6ZSN6ZSO6ZSP6ZSSXCIsNCxcIumUmOmUm+mUnemUnumUn+mUoumUqumUq+mUqemUrOmUsemUsumUtOmUtumUt+mUuOmUvOmUvumUv+mVgumUtemVhOmVhemVhumViemVjOmVjumVj+mVkumVk+mVlOmVlumVl+mVmOmVmemVm+mVnumVn+mVnemVoemVoumVpFwiLDgsXCLpla/plbHplbLplbPplLrnn6fnn6zpm4nnp5Xnp63np6Pnp6vnqIbltYfnqIPnqILnqJ7nqJRcIl0sXG5bXCJmMDQwXCIsXCLppIhcIiw0LFwi6aSO6aSP6aSRXCIsMjgsXCLppK9cIiwyNl0sXG5bXCJmMDgwXCIsXCLppYpcIiw5LFwi6aWWXCIsMTIsXCLppaTppabppbPppbjppbnppbvppb7ppoLppoPpponnqLnnqLfnqZHpu4/ppqXnqbDnmojnmo7nmpPnmpnnmqTnk57nk6DnlKzpuKDpuKLpuKhcIiw0LFwi6biy6bix6bi26bi46bi36bi56bi66bi+6bmB6bmC6bmE6bmG6bmH6bmI6bmJ6bmL6bmM6bmO6bmR6bmV6bmX6bma6bmb6bmc6bme6bmj6bmmXCIsNixcIum5sem5rem5s+eWkueWlOeWlueWoOeWneeWrOeWo+eWs+eWtOeWuOeXhOeWseeWsOeXg+eXgueXlueXjeeXo+eXqOeXpueXpOeXq+eXp+eYg+eXseeXvOeXv+eYkOeYgOeYheeYjOeYl+eYiueYpeeYmOeYleeYmVwiXSxcbltcImYxNDBcIixcIummjOmmjummmlwiLDEwLFwi6aam6aan6aapXCIsNDddLFxuW1wiZjE4MFwiLFwi6aeZXCIsMzIsXCLnmJvnmLznmKLnmKDnmYDnmK3nmLDnmL/nmLXnmYPnmL7nmLPnmY3nmZ7nmZTnmZznmZbnmavnma/nv4rnq6bnqbjnqbnnqoDnqobnqojnqpXnqqbnqqDnqqznqqjnqq3nqrPooaTooanoobLoob3oob/oooLooqLoo4boorfoorzoo4noo6Loo47oo6Poo6Xoo7HopJroo7zoo6joo77oo7DopKHopJnopJPopJvopIropLTopKvopLbopYHopabopbvnlovog6XnmrLnmrTnn5zogJLogJTogJbogJzogKDogKLogKXogKbogKfogKnogKjogLHogIvogLXogYPogYbogY3ogZLoganogbHopoPpobjpooDpooNcIl0sXG5bXCJmMjQwXCIsXCLpp7pcIiw2Ml0sXG5bXCJmMjgwXCIsXCLpqLlcIiwzMixcIumiiemijOmijemij+milOmimumim+minumin+mioemioumipemipuiZjeiZlOiZrOiZruiZv+iZuuiZvOiZu+iaqOiajeiai+iarOianeiap+iao+iaquiak+iaqeiatuibhOiateibjuiasOiauuiaseiar+ibieibj+iatOibqeibseibsuibreibs+ibkOick+ibnuibtOibn+ibmOibkeicg+ich+ibuOiciOiciuicjeicieico+icu+icnuicpeicruicmuicvuidiOictOicseicqeict+icv+ieguicouidveidvuidu+idoOidsOidjOidruiei+idk+ido+idvOidpOidmeidpeiek+ier+ieqOifklwiXSxcbltcImYzNDBcIixcIumpmlwiLDE3LFwi6amy6aqD6aqJ6aqN6aqO6aqU6aqV6aqZ6aqm6aqpXCIsNixcIumqsumqs+mqtOmqtemquemqu+mqvemqvumqv+mrg+mrhOmrhlwiLDQsXCLpq43pq47pq4/pq5Dpq5Lpq5Tpq5Xpq5bpq5fpq5npq5rpq5vpq5xcIl0sXG5bXCJmMzgwXCIsXCLpq53pq57pq6Dpq6Lpq6Ppq6Tpq6Xpq6fpq6jpq6npq6rpq6zpq67pq7BcIiw4LFwi6au66au8XCIsNixcIumshOmshemshuifhuieiOieheiereiel+ieg+ieq+ifpeierOieteies+ifi+ifk+ieveifkeifgOifiuifm+ifquifoOifruigluigk+ifvuigiuigm+igoeigueigvOe8tue9gue9hOe9heiIkOeruuerveesiOesg+eshOesleesiuesq+esj+eth+esuOesquesmeesruesseesoOespeespOess+esvuesnuetmOetmuetheetteetjOetneetoOetruetu+etouetsuetseeukOeupueup+euuOeurOeuneeuqOeuheeuqueunOeuoueuq+eutOevkeevgeevjOevneevmuevpeevpuevquewjOevvuevvOewj+ewluewi1wiXSxcbltcImY0NDBcIixcIumsh+msiVwiLDUsXCLprJDprJHprJLprJRcIiwxMCxcIumsoOmsoemsoumspFwiLDEwLFwi6ayw6ayx6ayzXCIsNyxcIumsvemsvumsv+mtgOmthumtiumti+mtjOmtjumtkOmtkumtk+mtlVwiLDVdLFxuW1wiZjQ4MFwiLFwi6a2bXCIsMzIsXCLnsJ/nsKrnsKbnsLjnsYHnsYDoh77oiIHoiILoiIToh6zooYToiKHoiKLoiKPoiK3oiK/oiKjoiKvoiLjoiLvoiLPoiLToiL7oiYToiYnoiYvoiY/oiZroiZ/oiajoob7oooXooojoo5joo5/opZ7nvp3nvp/nvqfnvq/nvrDnvrLnsbzmlYnnspHnsp3nspznsp7nsqLnsrLnsrznsr3ns4Hns4fns4zns43ns4jns4Xns5fns6joia7mmqjnvr/nv47nv5Xnv6Xnv6Hnv6bnv6nnv67nv7Pns7jntbfntqbntq7nuYfnupvpurjpurTotbPotoTotpTotpHotrHotafota3osYfosYnphYrphZDphY7phY/phaRcIl0sXG5bXCJmNTQwXCIsXCLprbxcIiw2Ml0sXG5bXCJmNTgwXCIsXCLprrtcIiwzMixcIumFoumFoemFsOmFqemFr+mFvemFvumFsumFtOmFuemGjOmGhemGkOmGjemGkemGoumGo+mGqumGremGrumGr+mGtemGtOmGuuixlem5vui2uOi3q+i4hei5mei5qei2tei2v+i2vOi2uui3hOi3lui3l+i3mui3nui3jui3j+i3m+i3hui3rOi3t+i3uOi3o+i3uei3u+i3pOi4iei3vei4lOi4nei4n+i4rOi4rui4o+i4r+i4uui5gOi4uei4tei4vei4sei5iei5gei5gui5kei5kui5iui5sOi5tui5vOi5r+i5tOi6hei6j+i6lOi6kOi6nOi6nuixuOiyguiyiuiyheiymOiylOaWm+inluinnuinmuinnFwiXSxcbltcImY2NDBcIixcIumvnFwiLDYyXSxcbltcImY2ODBcIixcIumwm1wiLDMyLFwi6Kel6Ker6Kev6Ki+6Kym6Z2T6Zup6Zuz6Zuv6ZyG6ZyB6ZyI6ZyP6ZyO6Zyq6Zyt6Zyw6Zy+6b6A6b6D6b6FXCIsNSxcIum+jOm7vum8i+m8jemauemavOmavembjumbkueev+mboOmKjumKrumLiOmMvumNqumPiumOj+mQvumRq+mxv+mygumyhemyhumyh+myiOeoo+myi+myjumykOmykemykumylOmylemymumym+mynlwiLDUsXCLpsqVcIiw0LFwi6bKr6bKt6bKu6bKwXCIsNyxcIumyuumyu+myvOmyvemzhOmzhemzhumzh+mziumzi1wiXSxcbltcImY3NDBcIixcIumwvFwiLDYyXSxcbltcImY3ODBcIixcIumxu+mxvemxvumygOmyg+myhOmyiemyiumyjOmyj+myk+mylumyl+mymOmymemynemyqumyrOmyr+myuemyvlwiLDQsXCLps4jps4nps5Hps5Lps5rps5vps6Dps6Hps4xcIiw0LFwi6bOT6bOU6bOV6bOX6bOY6bOZ6bOc6bOd6bOf6bOi6Z286Z6F6Z6R6Z6S6Z6U6Z6v6Z6r6Z6j6Z6y6Z606aqx6aqw6aq36bmY6aq26aq66aq86auB6auA6auF6auC6auL6auM6auR6a2F6a2D6a2H6a2J6a2I6a2N6a2R6aOo6aSN6aSu6aWV6aWU6auf6auh6aum6auv6aur6au76aut6au56ayI6ayP6ayT6ayf6ayj6bq96bq+57i76bqC6bqH6bqI6bqL6bqS6Y+W6bqd6bqf6bub6buc6bud6bug6buf6bui6bup6bun6bul6buq6buv6byi6bys6byv6by56by36by96by+6b2EXCJdLFxuW1wiZjg0MFwiLFwi6bOjXCIsNjJdLFxuW1wiZjg4MFwiLFwi6bSiXCIsMzJdLFxuW1wiZjk0MFwiLFwi6bWDXCIsNjJdLFxuW1wiZjk4MFwiLFwi6baCXCIsMzJdLFxuW1wiZmE0MFwiLFwi6bajXCIsNjJdLFxuW1wiZmE4MFwiLFwi6beiXCIsMzJdLFxuW1wiZmI0MFwiLFwi6biDXCIsMjcsXCLpuKTpuKfpuK7puLDpuLTpuLvpuLzpuYDpuY3puZDpuZLpuZPpuZTpuZbpuZnpuZ3puZ/puaDpuaHpuaLpuaXpua7pua/pubLpubRcIiw5LFwi6bqAXCJdLFxuW1wiZmI4MFwiLFwi6bqB6bqD6bqE6bqF6bqG6bqJ6bqK6bqMXCIsNSxcIum6lFwiLDgsXCLpup7puqBcIiw1LFwi6bqn6bqo6bqp6bqqXCJdLFxuW1wiZmM0MFwiLFwi6bqrXCIsOCxcIum6tem6tum6t+m6uem6uum6vOm6v1wiLDQsXCLpu4Xpu4bpu4fpu4jpu4rpu4vpu4zpu5Dpu5Lpu5Ppu5Xpu5bpu5fpu5npu5rpu57pu6Hpu6Ppu6Tpu6bpu6jpu6vpu6zpu63pu67pu7BcIiw4LFwi6bu66bu96bu/XCIsNl0sXG5bXCJmYzgwXCIsXCLpvIZcIiw0LFwi6byM6byP6byR6byS6byU6byV6byW6byY6byaXCIsNSxcIum8oem8o1wiLDgsXCLpvK3pvK7pvLDpvLFcIl0sXG5bXCJmZDQwXCIsXCLpvLJcIiw0LFwi6by46by66by86by/XCIsNCxcIum9hVwiLDEwLFwi6b2SXCIsMzhdLFxuW1wiZmQ4MFwiLFwi6b25XCIsNSxcIum+gem+gum+jVwiLDExLFwi6b6c6b6d6b6e6b6hXCIsNCxcIu+krO+lue+mle+np++nsVwiXSxcbltcImZlNDBcIixcIu+ojO+oje+oju+oj++oke+ok++olO+omO+on++ooO+ooe+oo++opO+op++oqO+oqVwiXVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuW1wiMFwiLFwiXFx1MDAwMFwiLDEyN10sXG5bXCI4MTQxXCIsXCLqsILqsIPqsIXqsIbqsItcIiw0LFwi6rCY6rCe6rCf6rCh6rCi6rCj6rClXCIsNixcIuqwruqwsuqws+qwtFwiXSxcbltcIjgxNjFcIixcIuqwteqwtuqwt+qwuuqwu+qwveqwvuqwv+qxgVwiLDksXCLqsYzqsY5cIiw1LFwi6rGVXCJdLFxuW1wiODE4MVwiLFwi6rGW6rGX6rGZ6rGa6rGb6rGdXCIsMTgsXCLqsbLqsbPqsbXqsbbqsbnqsbtcIiw0LFwi6rKC6rKH6rKI6rKN6rKO6rKP6rKR6rKS6rKT6rKVXCIsNixcIuqynuqyolwiLDUsXCLqsqvqsq3qsq7qsrFcIiw2LFwi6rK66rK+6rK/6rOA6rOC6rOD6rOF6rOG6rOH6rOJ6rOK6rOL6rONXCIsNyxcIuqzluqzmFwiLDcsXCLqs6Lqs6Pqs6Xqs6bqs6nqs6vqs63qs67qs7Lqs7Tqs7dcIiw0LFwi6rO+6rO/6rSB6rSC6rSD6rSF6rSHXCIsNCxcIuq0juq0kOq0kuq0k1wiXSxcbltcIjgyNDFcIixcIuq0lOq0leq0luq0l+q0meq0muq0m+q0neq0nuq0n+q0oVwiLDcsXCLqtKrqtKvqtK5cIiw1XSxcbltcIjgyNjFcIixcIuq0tuq0t+q0ueq0uuq0u+q0vVwiLDYsXCLqtYbqtYjqtYpcIiw1LFwi6rWR6rWS6rWT6rWV6rWW6rWXXCJdLFxuW1wiODI4MVwiLFwi6rWZXCIsNyxcIuq1ouq1pFwiLDcsXCLqta7qta/qtbHqtbLqtbfqtbjqtbnqtbrqtb7qtoDqtoNcIiw0LFwi6raK6raL6raN6raO6raP6raRXCIsMTAsXCLqtp5cIiw1LFwi6ralXCIsMTcsXCLqtrhcIiw3LFwi6reC6reD6reF6reG6reH6reJXCIsNixcIuq3kuq3lFwiLDcsXCLqt53qt57qt5/qt6Hqt6Lqt6Pqt6VcIiwxOF0sXG5bXCI4MzQxXCIsXCLqt7rqt7vqt73qt77quIJcIiw1LFwi6riK6riM6riOXCIsNSxcIuq4lVwiLDddLFxuW1wiODM2MVwiLFwi6ridXCIsMTgsXCLquLLquLPquLXquLbquLnquLvquLxcIl0sXG5bXCI4MzgxXCIsXCLquL3quL7quL/quYLquYTquYfquYjquYnquYvquY/quZHquZLquZPquZXquZdcIiw0LFwi6rme6rmi6rmj6rmk6rmm6rmn6rmq6rmr6rmt6rmu6rmv6rmxXCIsNixcIuq5uuq5vlwiLDUsXCLquoZcIiw1LFwi6rqNXCIsNDYsXCLqur/qu4Hqu4Lqu4Pqu4VcIiw2LFwi6ruO6ruSXCIsNSxcIuq7muq7m+q7nVwiLDhdLFxuW1wiODQ0MVwiLFwi6rum6run6rup6ruq6rus6ruuXCIsNSxcIuq7teq7tuq7t+q7ueq7uuq7u+q7vVwiLDhdLFxuW1wiODQ2MVwiLFwi6ryG6ryJ6ryK6ryL6ryM6ryO6ryP6ryRXCIsMThdLFxuW1wiODQ4MVwiLFwi6rykXCIsNyxcIuq8ruq8r+q8seq8s+q8tVwiLDYsXCLqvL7qvYDqvYTqvYXqvYbqvYfqvYpcIiw1LFwi6r2RXCIsMTAsXCLqvZ5cIiw1LFwi6r2mXCIsMTgsXCLqvbpcIiw1LFwi6r6B6r6C6r6D6r6F6r6G6r6H6r6JXCIsNixcIuq+kuq+k+q+lOq+llwiLDUsXCLqvp1cIiwyNixcIuq+uuq+u+q+veq+vlwiXSxcbltcIjg1NDFcIixcIuq+v+q/gVwiLDUsXCLqv4rqv4zqv49cIiw0LFwi6r+VXCIsNixcIuq/nVwiLDRdLFxuW1wiODU2MVwiLFwi6r+iXCIsNSxcIuq/qlwiLDUsXCLqv7Lqv7Pqv7Xqv7bqv7fqv7lcIiw2LFwi64CC64CDXCJdLFxuW1wiODU4MVwiLFwi64CFXCIsNixcIuuAjeuAjuuAj+uAkeuAkuuAk+uAlVwiLDYsXCLrgJ5cIiw5LFwi64CpXCIsMjYsXCLrgYbrgYfrgYnrgYvrgY3rgY/rgZDrgZHrgZLrgZbrgZjrgZrrgZvrgZzrgZ5cIiwyOSxcIuuBvuuBv+uCgeuCguuCg+uChVwiLDYsXCLrgo7rgpDrgpJcIiw1LFwi64Kb64Kd64Ke64Kj64KkXCJdLFxuW1wiODY0MVwiLFwi64Kl64Km64Kn64Kq64Kw64Ky64K264K364K564K664K764K9XCIsNixcIuuDhuuDilwiLDUsXCLrg5JcIl0sXG5bXCI4NjYxXCIsXCLrg5Prg5Xrg5brg5frg5lcIiw2LFwi64Oh64Oi64Oj64Ok64OmXCIsMTBdLFxuW1wiODY4MVwiLFwi64OxXCIsMjIsXCLrhIrrhI3rhI7rhI/rhJHrhJTrhJXrhJbrhJfrhJrrhJ5cIiw0LFwi64Sm64Sn64Sp64Sq64Sr64StXCIsNixcIuuEtuuEulwiLDUsXCLrhYLrhYPrhYXrhYbrhYfrhYlcIiw2LFwi64WS64WT64WW64WX64WZ64Wa64Wb64Wd64We64Wf64WhXCIsMjIsXCLrhbrrhbvrhb3rhb7rhb/rhoHrhoNcIiw0LFwi64aK64aM64aO64aP64aQ64aR64aV64aW64aX64aZ64aa64ab64adXCJdLFxuW1wiODc0MVwiLFwi64aeXCIsOSxcIuuGqVwiLDE1XSxcbltcIjg3NjFcIixcIuuGuVwiLDE4LFwi64eN64eO64eP64eR64eS64eT64eVXCJdLFxuW1wiODc4MVwiLFwi64eWXCIsNSxcIuuHnuuHoFwiLDcsXCLrh6rrh6vrh63rh67rh6/rh7FcIiw3LFwi64e664e864e+XCIsNSxcIuuIhuuIh+uIieuIiuuIjVwiLDYsXCLriJbriJjriJpcIiw1LFwi64ihXCIsMTgsXCLriLVcIiw2LFwi64i9XCIsMjYsXCLriZnriZrriZvriZ3riZ7riZ/riaFcIiw2LFwi64mqXCIsNF0sXG5bXCI4ODQxXCIsXCLria9cIiw0LFwi64m2XCIsNSxcIuuJvVwiLDYsXCLriobriofriojriopcIiw0XSxcbltcIjg4NjFcIixcIuuKj+uKkuuKk+uKleuKluuKl+uKm1wiLDQsXCLriqLriqTriqfriqjriqnriqvriq3riq7riq/rirHrirLrirPrirXrirbrirdcIl0sXG5bXCI4ODgxXCIsXCLrirhcIiwxNSxcIuuLiuuLi+uLjeuLjuuLj+uLkeuLk1wiLDQsXCLri5rri5zri57ri5/ri6Dri6Hri6Pri6fri6nri6rri7Dri7Hri7Lri7bri7zri73ri77rjILrjIPrjIXrjIbrjIfrjIlcIiw2LFwi64yS64yWXCIsNSxcIuuMnVwiLDU0LFwi642X642Z642a642d642g642h642i642jXCJdLFxuW1wiODk0MVwiLFwi642m642o642q642s642t642v642y642z6421642264236425XCIsNixcIuuOguuOhlwiLDUsXCLrjo1cIl0sXG5bXCI4OTYxXCIsXCLrjo7rjo/rjpHrjpLrjpPrjpVcIiwxMCxcIuuOolwiLDUsXCLrjqnrjqrrjqvrjq1cIl0sXG5bXCI4OTgxXCIsXCLrjq5cIiwyMSxcIuuPhuuPh+uPieuPiuuPjeuPj+uPkeuPkuuPk+uPluuPmOuPmuuPnOuPnuuPn+uPoeuPouuPo+uPpeuPpuuPp+uPqVwiLDE4LFwi64+9XCIsMTgsXCLrkJFcIiw2LFwi65CZ65Ca65Cb65Cd65Ce65Cf65ChXCIsNixcIuuQquuQrFwiLDcsXCLrkLVcIiwxNV0sXG5bXCI4YTQxXCIsXCLrkYVcIiwxMCxcIuuRkuuRk+uRleuRluuRl+uRmVwiLDYsXCLrkaLrkaTrkaZcIl0sXG5bXCI4YTYxXCIsXCLrkadcIiw0LFwi65GtXCIsMTgsXCLrkoHrkoJcIl0sXG5bXCI4YTgxXCIsXCLrkoNcIiw0LFwi65KJXCIsMTksXCLrkp5cIiw1LFwi65Kl65Km65Kn65Kp65Kq65Kr65KtXCIsNyxcIuuStuuSuOuSulwiLDUsXCLrk4Hrk4Lrk4Prk4Xrk4brk4frk4lcIiw2LFwi65OR65OS65OT65OU65OWXCIsNSxcIuuTnuuTn+uToeuTouuTpeuTp1wiLDQsXCLrk67rk7Drk7JcIiw1LFwi65O5XCIsMjYsXCLrlJbrlJfrlJnrlJrrlJ1cIl0sXG5bXCI4YjQxXCIsXCLrlJ5cIiw1LFwi65Sm65SrXCIsNCxcIuuUsuuUs+uUteuUtuuUt+uUuVwiLDYsXCLrlYLrlYZcIl0sXG5bXCI4YjYxXCIsXCLrlYfrlYjrlYnrlYrrlY7rlY/rlZHrlZLrlZPrlZVcIiw2LFwi65We65WiXCIsOF0sXG5bXCI4YjgxXCIsXCLrlatcIiw1MixcIuuWouuWo+uWpeuWpuuWp+uWqeuWrOuWreuWruuWr+uWsuuWtlwiLDQsXCLrlr7rlr/rl4Hrl4Lrl4Prl4VcIiw2LFwi65eO65eSXCIsNSxcIuuXmVwiLDE4LFwi65etXCIsMThdLFxuW1wiOGM0MVwiLFwi65iAXCIsMTUsXCLrmJLrmJPrmJXrmJbrmJfrmJlcIiw0XSxcbltcIjhjNjFcIixcIuuYnlwiLDYsXCLrmKZcIiw1LFwi65itXCIsNixcIuuYtVwiLDVdLFxuW1wiOGM4MVwiLFwi65i7XCIsMTIsXCLrmYlcIiwyNixcIuuZpeuZpuuZp+uZqVwiLDUwLFwi65qe65qf65qh65qi65qj65qlXCIsNSxcIuuareuaruuar+uasOuaslwiLDE2XSxcbltcIjhkNDFcIixcIuubg1wiLDE2LFwi65uVXCIsOF0sXG5bXCI4ZDYxXCIsXCLrm55cIiwxNyxcIuubseubsuubs+ubteubtuubt+ubueubulwiXSxcbltcIjhkODFcIixcIuubu1wiLDQsXCLrnILrnIPrnITrnIZcIiwzMyxcIuucquucq+ucreucruucsVwiLDYsXCLrnLrrnLxcIiw3LFwi652F652G652H652J652K652L652NXCIsNixcIuudllwiLDksXCLrnaHrnaLrnaPrnaXrnabrnafrnalcIiw2LFwi652y65206522XCIsNSxcIuudvuudv+uegeueguueg+uehVwiLDYsXCLrno7rnpPrnpTrnpXrnprrnpvrnp3rnp5cIl0sXG5bXCI4ZTQxXCIsXCLrnp/rnqFcIiw2LFwi656q656uXCIsNSxcIuuetuuet+ueuVwiLDhdLFxuW1wiOGU2MVwiLFwi65+CXCIsNCxcIuufiOufilwiLDE5XSxcbltcIjhlODFcIixcIuufnlwiLDEzLFwi65+u65+v65+x65+y65+z65+1XCIsNixcIuufvuugglwiLDQsXCLroIrroIvroI3roI7roI/roJFcIiw2LFwi66Ca66Cc66CeXCIsNSxcIuugpuugp+ugqeugquugq+ugrVwiLDYsXCLroLbroLpcIiw1LFwi66GB66GC66GD66GFXCIsMTEsXCLroZLroZRcIiw3LFwi66Ge66Gf66Gh66Gi66Gj66GlXCIsNixcIuuhruuhsOuhslwiLDUsXCLrobnrobrrobvrob1cIiw3XSxcbltcIjhmNDFcIixcIuuihVwiLDcsXCLroo5cIiwxN10sXG5bXCI4ZjYxXCIsXCLroqBcIiw3LFwi66KpXCIsNixcIuuiseuisuuis+uiteuituuit+uiuVwiLDRdLFxuW1wiOGY4MVwiLFwi66K+66K/66OC66OE66OGXCIsNSxcIuujjeujjuujj+ujkeujkuujk+ujlVwiLDcsXCLro57ro6Dro6JcIiw1LFwi66Oq66Or66Ot66Ou66Ov66OxXCIsNixcIuujuuujvOujvlwiLDUsXCLrpIVcIiwxOCxcIuukmVwiLDYsXCLrpKFcIiwyNixcIuukvuukv+ulgeulguulg+ulhVwiLDYsXCLrpY3rpY7rpZDrpZJcIiw1XSxcbltcIjkwNDFcIixcIuulmuulm+ulneulnuuln+uloVwiLDYsXCLrparrpazrpa5cIiw1LFwi66W266W366W566W666W766W9XCJdLFxuW1wiOTA2MVwiLFwi66W+XCIsNSxcIuumhuumiOumi+umjOumj1wiLDE1XSxcbltcIjkwODFcIixcIuumn1wiLDEyLFwi66au66av66ax66ay66az66a1XCIsNixcIuumvuungOunglwiLDUsXCLrp4rrp4vrp43rp5NcIiw0LFwi66ea66ec66ef66eg66ei66em66en66ep66eq66er66etXCIsNixcIuuntuunu1wiLDQsXCLrqIJcIiw1LFwi66iJXCIsMTEsXCLrqJZcIiwzMyxcIuuouuuou+uoveuovuuov+upgeupg+uphOupheuphlwiXSxcbltcIjkxNDFcIixcIuuph+upiuupjOupj+upkOupkeupkuupluupl+upmeupmuupm+upnVwiLDYsXCLrqabrqapcIiw1XSxcbltcIjkxNjFcIixcIuupsuups+upteuptuupt+upuVwiLDksXCLrqobrqojrqonrqorrqovrqo1cIiw1XSxcbltcIjkxODFcIixcIuuqk1wiLDIwLFwi66qq66qt66qu66qv66qx66qzXCIsNCxcIuuquuuqvOuqvlwiLDUsXCLrq4Xrq4brq4frq4lcIiwxNCxcIuurmlwiLDMzLFwi66u966u+66u/66yB66yC66yD66yFXCIsNyxcIuusjuuskOusklwiLDUsXCLrrJnrrJrrrJvrrJ3rrJ7rrJ/rrKFcIiw2XSxcbltcIjkyNDFcIixcIuusqOusquusrFwiLDcsXCLrrLfrrLnrrLrrrL9cIiw0LFwi662G662I662K662L662M662O662R662SXCJdLFxuW1wiOTI2MVwiLFwi662T662V662W662X662ZXCIsNyxcIuutouutpFwiLDcsXCLrra1cIiw0XSxcbltcIjkyODFcIixcIuutslwiLDIxLFwi666J666K666L666N666O666P666RXCIsMTgsXCLrrqXrrqbrrqfrrqnrrqrrrqvrrq1cIiw2LFwi666166626664XCIsNyxcIuuvgeuvguuvg+uvheuvhuuvh+uviVwiLDYsXCLrr5Hrr5Lrr5RcIiwzNSxcIuuvuuuvu+uvveuvvuuwgVwiXSxcbltcIjkzNDFcIixcIuuwg1wiLDQsXCLrsIrrsI7rsJDrsJLrsJPrsJnrsJrrsKDrsKHrsKLrsKPrsKbrsKjrsKrrsKvrsKzrsK7rsK/rsLLrsLPrsLVcIl0sXG5bXCI5MzYxXCIsXCLrsLbrsLfrsLlcIiw2LFwi67GC67GG67GH67GI67GK67GL67GO67GP67GRXCIsOF0sXG5bXCI5MzgxXCIsXCLrsZrrsZvrsZzrsZ5cIiwzNyxcIuuyhuuyh+uyieuyiuuyjeuyj1wiLDQsXCLrspbrspjrsptcIiw0LFwi67Ki67Kj67Kl67Km67KpXCIsNixcIuuysuuytlwiLDUsXCLrsr7rsr/rs4Hrs4Lrs4Prs4VcIiw3LFwi67OO67OS67OT67OU67OW67OX67OZ67Oa67Ob67OdXCIsMjIsXCLrs7frs7nrs7rrs7vrs71cIl0sXG5bXCI5NDQxXCIsXCLrs75cIiw1LFwi67SG67SI67SKXCIsNSxcIuu0keu0kuu0k+u0lVwiLDhdLFxuW1wiOTQ2MVwiLFwi67SeXCIsNSxcIuu0pVwiLDYsXCLrtK1cIiwxMl0sXG5bXCI5NDgxXCIsXCLrtLpcIiw1LFwi67WBXCIsNixcIuu1iuu1i+u1jeu1juu1j+u1kVwiLDYsXCLrtZpcIiw5LFwi67Wl67Wm67Wn67WpXCIsMjIsXCLrtoLrtoPrtoXrtobrtotcIiw0LFwi67aS67aU67aW67aX67aY67ab67adXCIsNixcIuu2pVwiLDEwLFwi67axXCIsNixcIuu2uVwiLDI0XSxcbltcIjk1NDFcIixcIuu3kuu3k+u3luu3l+u3meu3muu3m+u3nVwiLDExLFwi67eqXCIsNSxcIuu3sVwiXSxcbltcIjk1NjFcIixcIuu3suu3s+u3teu3tuu3t+u3uVwiLDYsXCLruIHruILruITruIZcIiw1LFwi67iO67iP67iR67iS67iTXCJdLFxuW1wiOTU4MVwiLFwi67iVXCIsNixcIuu4nuu4oFwiLDM1LFwi67mG67mH67mJ67mK67mL67mN67mPXCIsNCxcIuu5luu5mOu5nOu5neu5nuu5n+u5ouu5o+u5peu5puu5p+u5qeu5q1wiLDQsXCLrubLrubZcIiw0LFwi67m+67m/67qB67qC67qD67qFXCIsNixcIuu6juu6klwiLDUsXCLruppcIiwxMyxcIuu6qVwiLDE0XSxcbltcIjk2NDFcIixcIuu6uFwiLDIzLFwi67uS67uTXCJdLFxuW1wiOTY2MVwiLFwi67uV67uW67uZXCIsNixcIuu7oeu7ouu7plwiLDUsXCLru61cIiw4XSxcbltcIjk2ODFcIixcIuu7tlwiLDEwLFwi67yCXCIsNSxcIuu8ilwiLDEzLFwi67ya67yeXCIsMzMsXCLrvYLrvYPrvYXrvYbrvYfrvYlcIiw2LFwi672S672T672U672WXCIsNDRdLFxuW1wiOTc0MVwiLFwi676DXCIsMTYsXCLrvpVcIiw4XSxcbltcIjk3NjFcIixcIuu+nlwiLDE3LFwi676xXCIsN10sXG5bXCI5NzgxXCIsXCLrvrlcIiwxMSxcIuu/hlwiLDUsXCLrv47rv4/rv5Hrv5Lrv5Prv5VcIiw2LFwi67+d67+e67+g67+iXCIsODksXCLsgL3sgL7sgL9cIl0sXG5bXCI5ODQxXCIsXCLsgYBcIiwxNixcIuyBklwiLDUsXCLsgZnsgZrsgZtcIl0sXG5bXCI5ODYxXCIsXCLsgZ3sgZ7sgZ/sgaFcIiw2LFwi7IGqXCIsMTVdLFxuW1wiOTg4MVwiLFwi7IG6XCIsMjEsXCLsgpLsgpPsgpXsgpbsgpfsgplcIiw2LFwi7IKi7IKk7IKmXCIsNSxcIuyCruyCseyCsuyCt1wiLDQsXCLsgr7sg4Lsg4Psg4Tsg4bsg4fsg4rsg4vsg43sg47sg4/sg5FcIiw2LFwi7IOa7IOeXCIsNSxcIuyDpuyDp+yDqeyDquyDq+yDrVwiLDYsXCLsg7bsg7jsg7pcIiw1LFwi7ISB7ISC7ISD7ISF7ISG7ISH7ISJXCIsNixcIuyEkeyEkuyEk+yElOyEllwiLDUsXCLshKHshKLshKXshKjshKnshKrshKvshK5cIl0sXG5bXCI5OTQxXCIsXCLshLLshLPshLTshLXshLfshLrshLvshL3shL7shL/shYFcIiw2LFwi7IWK7IWOXCIsNSxcIuyFluyFl1wiXSxcbltcIjk5NjFcIixcIuyFmeyFmuyFm+yFnVwiLDYsXCLshabshapcIiw1LFwi7IWx7IWy7IWz7IW17IW27IW37IW57IW67IW7XCJdLFxuW1wiOTk4MVwiLFwi7IW8XCIsOCxcIuyGhlwiLDUsXCLsho/shpHshpLshpPshpXshpdcIiw0LFwi7Iae7Iag7Iai7Iaj7Iak7Iam7Ian7Iaq7Iar7Iat7Iau7Iav7IaxXCIsMTEsXCLshr5cIiw1LFwi7IeF7IeG7IeH7IeJ7IeK7IeL7IeNXCIsNixcIuyHleyHluyHmVwiLDYsXCLsh6Hsh6Lsh6Psh6Xsh6bsh6fsh6lcIiw2LFwi7Iey7Ie0XCIsNyxcIuyHvuyHv+yIgeyIguyIg+yIhVwiLDYsXCLsiI7siJDsiJJcIiw1LFwi7Iia7Iib7Iid7Iie7Iih7Iii7IijXCJdLFxuW1wiOWE0MVwiLFwi7Iik7Iil7Iim7Iin7Iiq7Iis7Iiu7Iiw7Iiz7Ii1XCIsMTZdLFxuW1wiOWE2MVwiLFwi7ImG7ImH7ImJXCIsNixcIuyJkuyJk+yJleyJluyJl+yJmVwiLDYsXCLsiaHsiaLsiaPsiaTsiaZcIl0sXG5bXCI5YTgxXCIsXCLsiadcIiw0LFwi7Imu7Imv7Imx7Imy7Imz7Im1XCIsNixcIuyJvuyKgOyKglwiLDUsXCLsiopcIiw1LFwi7IqRXCIsNixcIuyKmeyKmuyKnOyKnlwiLDUsXCLsiqbsiqfsiqnsiqrsiqvsiq5cIiw1LFwi7Iq27Iq47Iq6XCIsMzMsXCLsi57si5/si6Hsi6Lsi6VcIiw1LFwi7Iuu7Iuw7Iuy7Iuz7Iu07Iu17Iu37Iu67Iu97Iu+7Iu/7IyBXCIsNixcIuyMiuyMi+yMjuyMj1wiXSxcbltcIjliNDFcIixcIuyMkOyMkeyMkuyMluyMl+yMmeyMmuyMm+yMnVwiLDYsXCLsjKbsjKfsjKpcIiw4XSxcbltcIjliNjFcIixcIuyMs1wiLDE3LFwi7I2GXCIsN10sXG5bXCI5YjgxXCIsXCLsjY5cIiwyNSxcIuyNquyNq+yNreyNruyNr+yNseyNs1wiLDQsXCLsjbrsjbvsjb5cIiw1LFwi7I6F7I6G7I6H7I6J7I6K7I6L7I6NXCIsNTAsXCLsj4FcIiwyMixcIuyPmlwiXSxcbltcIjljNDFcIixcIuyPm+yPneyPnuyPoeyPo1wiLDQsXCLsj6rsj6vsj6zsj65cIiw1LFwi7I+27I+37I+5XCIsNV0sXG5bXCI5YzYxXCIsXCLsj79cIiw4LFwi7JCJXCIsNixcIuyQkVwiLDldLFxuW1wiOWM4MVwiLFwi7JCbXCIsOCxcIuyQpVwiLDYsXCLskK3skK7skK/skLHskLLskLPskLVcIiw2LFwi7JC+XCIsOSxcIuyRiVwiLDI2LFwi7JGm7JGn7JGp7JGq7JGr7JGtXCIsNixcIuyRtuyRt+yRuOyRulwiLDUsXCLskoFcIiwxOCxcIuySlVwiLDYsXCLskp1cIiwxMl0sXG5bXCI5ZDQxXCIsXCLskqpcIiwxMyxcIuySueySuuySu+ySvVwiLDhdLFxuW1wiOWQ2MVwiLFwi7JOGXCIsMjVdLFxuW1wiOWQ4MVwiLFwi7JOgXCIsOCxcIuyTqlwiLDUsXCLsk7Lsk7Psk7Xsk7bsk7fsk7nsk7vsk7zsk73sk77slIJcIiw5LFwi7JSN7JSO7JSP7JSR7JSS7JST7JSVXCIsNixcIuyUnVwiLDEwLFwi7JSq7JSr7JSt7JSu7JSv7JSxXCIsNixcIuyUuuyUvOyUvlwiLDUsXCLslYbslYfslYvslY/slZDslZHslZLslZbslZrslZvslZzslZ/slaLslaPslaXslabslafslalcIiw2LFwi7JWy7JW2XCIsNSxcIuyVvuyVv+yWgeyWguyWg+yWheyWhuyWiOyWieyWiuyWi+yWjuyWkOyWkuyWk+yWlFwiXSxcbltcIjllNDFcIixcIuyWluyWmeyWmuyWm+yWneyWnuyWn+yWoVwiLDcsXCLslqpcIiw5LFwi7Ja2XCJdLFxuW1wiOWU2MVwiLFwi7Ja37Ja67Ja/XCIsNCxcIuyXi+yXjeyXj+yXkuyXk+yXleyXluyXl+yXmVwiLDYsXCLsl6Lsl6Tsl6bsl6dcIl0sXG5bXCI5ZTgxXCIsXCLsl6jsl6nsl6rsl6vsl6/sl7Hsl7Lsl7Psl7Xsl7jsl7nsl7rsl7vsmILsmIPsmITsmInsmIrsmIvsmI3smI7smI/smJFcIiw2LFwi7Jia7JidXCIsNixcIuyYpuyYp+yYqeyYquyYq+yYr+yYseyYsuyYtuyYuOyYuuyYvOyYveyYvuyYv+yZguyZg+yZheyZhuyZh+yZiVwiLDYsXCLsmZLsmZZcIiw1LFwi7Jme7Jmf7JmhXCIsMTAsXCLsma3sma7smbDsmbJcIiw1LFwi7Jm67Jm77Jm97Jm+7Jm/7JqBXCIsNixcIuyaiuyajOyajlwiLDUsXCLsmpbsmpfsmpnsmprsmpvsmp1cIiw2LFwi7JqmXCJdLFxuW1wiOWY0MVwiLFwi7Jqo7JqqXCIsNSxcIuyasuyas+yateyatuyat+yau1wiLDQsXCLsm4Lsm4Tsm4ZcIiw1LFwi7JuOXCJdLFxuW1wiOWY2MVwiLFwi7JuP7JuR7JuS7JuT7JuVXCIsNixcIuybnuybn+ybolwiLDUsXCLsm6rsm6vsm63sm67sm6/sm7Hsm7JcIl0sXG5bXCI5ZjgxXCIsXCLsm7NcIiw0LFwi7Ju67Ju77Ju87Ju+XCIsNSxcIuychuych+ycieyciuyci+ycjVwiLDYsXCLsnJbsnJjsnJpcIiw1LFwi7Jyi7Jyj7Jyl7Jym7Jyn7JypXCIsNixcIuycsuyctOyctuycuOycueycuuycu+ycvuycv+ydgeydguydg+ydhVwiLDQsXCLsnYvsnY7snZDsnZnsnZrsnZvsnZ3snZ7snZ/snaFcIiw2LFwi7J2p7J2q7J2sXCIsNyxcIuydtuydt+ydueyduuydu+ydv+yegOyegeyeguyehuyei+yejOyejeyej+yekuyek+yeleyemeyem1wiLDQsXCLsnqLsnqdcIiw0LFwi7J6u7J6v7J6x7J6y7J6z7J617J627J63XCJdLFxuW1wiYTA0MVwiLFwi7J647J657J667J677J6+7J+CXCIsNSxcIuyfiuyfi+yfjeyfj+yfkVwiLDYsXCLsn5nsn5rsn5vsn5xcIl0sXG5bXCJhMDYxXCIsXCLsn55cIiw1LFwi7J+l7J+m7J+n7J+p7J+q7J+r7J+tXCIsMTNdLFxuW1wiYTA4MVwiLFwi7J+7XCIsNCxcIuygguygg+ygheyghuygh+ygieygi1wiLDQsXCLsoJLsoJTsoJdcIiw0LFwi7KCe7KCf7KCh7KCi7KCj7KClXCIsNixcIuygruygsOygslwiLDUsXCLsoLnsoLrsoLvsoL3soL7soL/soYFcIiw2LFwi7KGK7KGL7KGOXCIsNSxcIuyhlVwiLDI2LFwi7KGy7KGz7KG17KG27KG37KG57KG7XCIsNCxcIuyiguyihOyiiOyiieyiiuyijlwiLDUsXCLsopVcIiw3LFwi7KKe7KKg7KKi7KKj7KKkXCJdLFxuW1wiYTE0MVwiLFwi7KKl7KKm7KKn7KKpXCIsMTgsXCLsor7sor/so4Dso4FcIl0sXG5bXCJhMTYxXCIsXCLso4Lso4Pso4Xso4bso4fso4nso4rso4vso41cIiw2LFwi7KOW7KOY7KOaXCIsNSxcIuyjouyjo+yjpVwiXSxcbltcImExODFcIixcIuyjplwiLDE0LFwi7KO2XCIsNSxcIuyjvuyjv+ykgeykguykg+ykh1wiLDQsXCLspI7jgIDjgIHjgILCt+KApeKApsKo44CDwq3igJXiiKXvvLziiLzigJjigJnigJzigJ3jgJTjgJXjgIhcIiw5LFwiwrHDl8O34omg4omk4oml4oie4oi0wrDigLLigLPihIPihKvvv6Dvv6Hvv6XimYLimYDiiKDiiqXijJLiiILiiIfiiaHiiZLCp+KAu+KYhuKYheKXi+KXj+KXjuKXh+KXhuKWoeKWoOKWs+KWsuKWveKWvOKGkuKGkOKGkeKGk+KGlOOAk+KJquKJq+KImuKIveKIneKIteKIq+KIrOKIiOKIi+KKhuKKh+KKguKKg+KIquKIqeKIp+KIqO+/olwiXSxcbltcImEyNDFcIixcIuykkOykklwiLDUsXCLspJlcIiwxOF0sXG5bXCJhMjYxXCIsXCLspK1cIiw2LFwi7KS1XCIsMThdLFxuW1wiYTI4MVwiLFwi7KWIXCIsNyxcIuylkuylk+ylleylluyll+ylmVwiLDYsXCLspaLspaRcIiw3LFwi7KWt7KWu7KWv4oeS4oeU4oiA4oiDwrTvvZ7Lh8uYy53LmsuZwrjLm8Khwr/LkOKIruKIkeKIj8Kk4oSJ4oCw4peB4peA4pa34pa24pmk4pmg4pmh4pml4pmn4pmj4oqZ4peI4paj4peQ4peR4paS4pak4pal4pao4pan4pam4pap4pmo4piP4piO4pic4piewrbigKDigKHihpXihpfihpnihpbihpjima3imanimarimazjib/jiJzihJbjj4fihKLjj4Ljj5jihKHigqzCrlwiXSxcbltcImEzNDFcIixcIuylseylsuyls+yltVwiLDYsXCLspb1cIiwxMCxcIuymiuymi+ymjeymjuymj1wiXSxcbltcImEzNjFcIixcIuymkVwiLDYsXCLspprsppzspp5cIiwxNl0sXG5bXCJhMzgxXCIsXCLspq9cIiwxNixcIuynguyng+ynheynhuynieyni1wiLDQsXCLsp5Lsp5Tsp5fsp5jsp5vvvIFcIiw1OCxcIu+/pu+8vVwiLDMyLFwi77+jXCJdLFxuW1wiYTQ0MVwiLFwi7Kee7Kef7Keh7Kej7Kel7Kem7Keo7Kep7Keq7Ker7Keu7KeyXCIsNSxcIuynuuynu+ynveynvuynv+yogeyoguyog+yohFwiXSxcbltcImE0NjFcIixcIuyoheyohuyoh+yoiuyojlwiLDUsXCLsqJXsqJbsqJfsqJlcIiwxMl0sXG5bXCJhNDgxXCIsXCLsqKbsqKfsqKjsqKpcIiwyOCxcIuOEsVwiLDkzXSxcbltcImE1NDFcIixcIuyph1wiLDQsXCLsqY7sqY/sqZHsqZLsqZPsqZVcIiw2LFwi7Kme7KmiXCIsNSxcIuypqeypqlwiXSxcbltcImE1NjFcIixcIuypq1wiLDE3LFwi7Km+XCIsNSxcIuyqheyqhlwiXSxcbltcImE1ODFcIixcIuyqh1wiLDE2LFwi7KqZXCIsMTQsXCLihbBcIiw5XSxcbltcImE1YjBcIixcIuKFoFwiLDldLFxuW1wiYTVjMVwiLFwizpFcIiwxNixcIs6jXCIsNl0sXG5bXCJhNWUxXCIsXCLOsVwiLDE2LFwiz4NcIiw2XSxcbltcImE2NDFcIixcIuyqqFwiLDE5LFwi7Kq+7Kq/7KuB7KuC7KuD7KuFXCJdLFxuW1wiYTY2MVwiLFwi7KuGXCIsNSxcIuyrjuyrkOyrkuyrlOyrleyrluyrl+yrmlwiLDUsXCLsq6FcIiw2XSxcbltcImE2ODFcIixcIuyrqOyrqeyrquyrq+yrrVwiLDYsXCLsq7VcIiwxOCxcIuysieysiuKUgOKUguKUjOKUkOKUmOKUlOKUnOKUrOKUpOKUtOKUvOKUgeKUg+KUj+KUk+KUm+KUl+KUo+KUs+KUq+KUu+KVi+KUoOKUr+KUqOKUt+KUv+KUneKUsOKUpeKUuOKVguKUkuKUkeKUmuKUmeKUluKUleKUjuKUjeKUnuKUn+KUoeKUouKUpuKUp+KUqeKUquKUreKUruKUseKUsuKUteKUtuKUueKUuuKUveKUvuKVgOKVgeKVg1wiLDddLFxuW1wiYTc0MVwiLFwi7KyLXCIsNCxcIuyskeyskuysk+ysleysluysl+ysmVwiLDYsXCLsrKJcIiw3XSxcbltcImE3NjFcIixcIuysqlwiLDIyLFwi7K2C7K2D7K2EXCJdLFxuW1wiYTc4MVwiLFwi7K2F7K2G7K2H7K2K7K2L7K2N7K2O7K2P7K2RXCIsNixcIuytmuytm+ytnOytnlwiLDUsXCLsraVcIiw3LFwi446V446W446X4oST446Y44+E446j446k446l446m446ZXCIsOSxcIuOPiuOOjeOOjuOOj+OPj+OOiOOOieOPiOOOp+OOqOOOsFwiLDksXCLjjoBcIiw0LFwi4466XCIsNSxcIuOOkFwiLDQsXCLihKbjj4Djj4Hjjorjjovjjozjj5bjj4Xjjq3jjq7jjq/jj5vjjqnjjqrjjqvjjqzjj53jj5Djj5Pjj4Pjj4njj5zjj4ZcIl0sXG5bXCJhODQxXCIsXCLsra1cIiwxMCxcIuytulwiLDE0XSxcbltcImE4NjFcIixcIuyuiVwiLDE4LFwi7K6dXCIsNl0sXG5bXCJhODgxXCIsXCLsrqRcIiwxOSxcIuyuuVwiLDExLFwiw4bDkMKqxKZcIl0sXG5bXCJhOGE2XCIsXCLEslwiXSxcbltcImE4YThcIixcIsS/xYHDmMWSwrrDnsWmxYpcIl0sXG5bXCJhOGIxXCIsXCLjiaBcIiwyNyxcIuKTkFwiLDI1LFwi4pGgXCIsMTQsXCLCveKFk+KFlMK8wr7ihZvihZzihZ3ihZ5cIl0sXG5bXCJhOTQxXCIsXCLsr4VcIiwxNCxcIuyvlVwiLDEwXSxcbltcImE5NjFcIixcIuyvoOyvoeyvouyvo+yvpeyvpuyvqOyvqlwiLDE4XSxcbltcImE5ODFcIixcIuyvvVwiLDE0LFwi7LCO7LCP7LCR7LCS7LCT7LCVXCIsNixcIuywnuywn+ywoOywo+ywpMOmxJHDsMSnxLHEs8S4xYDFgsO4xZPDn8O+xafFi8WJ44iAXCIsMjcsXCLikpxcIiwyNSxcIuKRtFwiLDE0LFwiwrnCssKz4oG04oG/4oKB4oKC4oKD4oKEXCJdLFxuW1wiYWE0MVwiLFwi7LCl7LCm7LCq7LCr7LCt7LCv7LCxXCIsNixcIuywuuywv1wiLDQsXCLssYbssYfssYnssYrssYvssY3ssY5cIl0sXG5bXCJhYTYxXCIsXCLssY9cIiw0LFwi7LGW7LGaXCIsNSxcIuyxoeyxouyxo+yxpeyxp+yxqVwiLDYsXCLssbHssbJcIl0sXG5bXCJhYTgxXCIsXCLssbPssbTssbZcIiwyOSxcIuOBgVwiLDgyXSxcbltcImFiNDFcIixcIuyylOyyleyyluyyl+yymuyym+yyneyynuyyn+yyoVwiLDYsXCLssqrssq5cIiw1LFwi7LK27LK37LK5XCJdLFxuW1wiYWI2MVwiLFwi7LK67LK77LK9XCIsNixcIuyzhuyziOyzilwiLDUsXCLss5Hss5Lss5Pss5VcIiw1XSxcbltcImFiODFcIixcIuyzm1wiLDgsXCLss6VcIiw2LFwi7LOt7LOu7LOv7LOxXCIsMTIsXCLjgqFcIiw4NV0sXG5bXCJhYzQxXCIsXCLss77ss7/stIDstIJcIiw1LFwi7LSK7LSL7LSN7LSO7LSP7LSRXCIsNixcIuy0muy0nOy0nuy0n+y0oFwiXSxcbltcImFjNjFcIixcIuy0oey0ouy0o+y0pey0puy0p+y0qey0quy0q+y0rVwiLDExLFwi7LS6XCIsNF0sXG5bXCJhYzgxXCIsXCLstL9cIiwyOCxcIuy1ney1nuy1n9CQXCIsNSxcItCB0JZcIiwyNV0sXG5bXCJhY2QxXCIsXCLQsFwiLDUsXCLRkdC2XCIsMjVdLFxuW1wiYWQ0MVwiLFwi7LWh7LWi7LWj7LWlXCIsNixcIuy1ruy1sOy1slwiLDUsXCLstblcIiw3XSxcbltcImFkNjFcIixcIuy2gVwiLDYsXCLstolcIiwxMCxcIuy2luy2l+y2mey2muy2m+y2ney2nuy2n1wiXSxcbltcImFkODFcIixcIuy2oOy2oey2ouy2o+y2puy2qOy2qlwiLDUsXCLstrFcIiwxOCxcIuy3hVwiXSxcbltcImFlNDFcIixcIuy3hlwiLDUsXCLst43st47st4/st5FcIiwxNl0sXG5bXCJhZTYxXCIsXCLst6JcIiw1LFwi7Lep7Leq7Ler7Let7Leu7Lev7LexXCIsNixcIuy3uuy3vOy3vlwiLDRdLFxuW1wiYWU4MVwiLFwi7LiD7LiF7LiG7LiH7LiJ7LiK7LiL7LiNXCIsNixcIuy4ley4luy4l+y4mOy4mlwiLDUsXCLsuKLsuKPsuKXsuKbsuKfsuKnsuKrsuKtcIl0sXG5bXCJhZjQxXCIsXCLsuKzsuK3suK7suK/suLLsuLTsuLZcIiwxOV0sXG5bXCJhZjYxXCIsXCLsuYpcIiwxMyxcIuy5muy5m+y5ney5nuy5olwiLDUsXCLsuarsuaxcIl0sXG5bXCJhZjgxXCIsXCLsua5cIiw1LFwi7Lm27Lm37Lm57Lm67Lm77Lm9XCIsNixcIuy6huy6iOy6ilwiLDUsXCLsupLsupPsupXsupbsupfsuplcIl0sXG5bXCJiMDQxXCIsXCLsuppcIiw1LFwi7Lqi7LqmXCIsNSxcIuy6rlwiLDEyXSxcbltcImIwNjFcIixcIuy6u1wiLDUsXCLsu4JcIiwxOV0sXG5bXCJiMDgxXCIsXCLsu5ZcIiwxMyxcIuy7puy7p+y7qey7quy7rVwiLDYsXCLsu7bsu7pcIiw1LFwi6rCA6rCB6rCE6rCH6rCI6rCJ6rCK6rCQXCIsNyxcIuqwmVwiLDQsXCLqsKDqsKTqsKzqsK3qsK/qsLDqsLHqsLjqsLnqsLzqsYDqsYvqsY3qsZTqsZjqsZzqsbDqsbHqsbTqsbfqsbjqsbrqsoDqsoHqsoPqsoTqsoXqsobqsonqsorqsovqsozqspDqspTqspzqsp3qsp/qsqDqsqHqsqjqsqnqsqrqsqzqsq/qsrDqsrjqsrnqsrvqsrzqsr3qs4Hqs4Tqs4jqs4zqs5Xqs5fqs6Dqs6Hqs6Tqs6fqs6jqs6rqs6zqs6/qs7Dqs7Hqs7Pqs7Xqs7bqs7zqs73qtIDqtITqtIZcIl0sXG5bXCJiMTQxXCIsXCLsvILsvIPsvIXsvIbsvIfsvIlcIiw2LFwi7LyS7LyU7LyWXCIsNSxcIuy8ney8nuy8n+y8oey8ouy8o1wiXSxcbltcImIxNjFcIixcIuy8pVwiLDYsXCLsvK7svLJcIiw1LFwi7Ly5XCIsMTFdLFxuW1wiYjE4MVwiLFwi7L2FXCIsMTQsXCLsvZbsvZfsvZnsvZrsvZvsvZ1cIiw2LFwi7L2m7L2o7L2q7L2r7L2s6rSM6rSN6rSP6rSR6rSY6rSc6rSg6rSp6rSs6rSt6rS06rS16rS46rS86rWE6rWF6rWH6rWJ6rWQ6rWU6rWY6rWh6rWj6rWs6rWt6rWw6rWz6rW06rW16rW26rW76rW86rW96rW/6raB6raC6raI6raJ6raM6raQ6rac6rad6rak6ra36reA6reB6reE6reI6reQ6reR6reT6rec6reg6rek6re46re56re86re/6riA6riB6riI6riJ6riL6riN6riU6riw6rix6ri06ri36ri46ri66rmA6rmB6rmD6rmF6rmG6rmK6rmM6rmN6rmO6rmQ6rmU6rmW6rmc6rmd6rmf6rmg6rmh6rml6rmo6rmp6rms6rmw6rm4XCJdLFxuW1wiYjI0MVwiLFwi7L2t7L2u7L2v7L2y7L2z7L217L227L237L25XCIsNixcIuy+gey+guy+g+y+hOy+hlwiLDUsXCLsvo1cIl0sXG5bXCJiMjYxXCIsXCLsvo5cIiwxOCxcIuy+olwiLDUsXCLsvqlcIl0sXG5bXCJiMjgxXCIsXCLsvqpcIiw1LFwi7L6xXCIsMTgsXCLsv4VcIiw2LFwi6rm56rm76rm86rm96rqE6rqF6rqM6rq86rq96rq+6ruA6ruE6ruM6ruN6ruP6ruQ6ruR6ruY6ruZ6ruc6ruo6rur6rut6ru06ru46ru86ryH6ryI6ryN6ryQ6rys6ryt6ryw6ryy6ry06ry86ry96ry/6r2B6r2C6r2D6r2I6r2J6r2Q6r2c6r2d6r2k6r2l6r256r6A6r6E6r6I6r6Q6r6R6r6V6r6c6r646r656r686r+A6r+H6r+I6r+J6r+L6r+N6r+O6r+U6r+c6r+o6r+p6r+w6r+x6r+06r+464CA64CB64CE64CM64CQ64CU64Cc64Cd64Co64GE64GF64GI64GK64GM64GO64GT64GU64GV64GX64GZXCJdLFxuW1wiYjM0MVwiLFwi7L+MXCIsMTksXCLsv6Lsv6Psv6Xsv6bsv6fsv6lcIl0sXG5bXCJiMzYxXCIsXCLsv6pcIiw1LFwi7L+y7L+07L+2XCIsNSxcIuy/vey/vuy/v+2Age2Agu2Ag+2AhVwiLDVdLFxuW1wiYjM4MVwiLFwi7YCLXCIsNSxcIu2AklwiLDUsXCLtgJlcIiwxOSxcIuuBneuBvOuBveuCgOuChOuCjOuCjeuCj+uCkeuCmOuCmeuCmuuCnOuCn+uCoOuCoeuCouuCqOuCqeuCq1wiLDQsXCLrgrHrgrPrgrTrgrXrgrjrgrzrg4Trg4Xrg4frg4jrg4nrg5Drg5Hrg5Trg5jrg6Drg6XrhIjrhInrhIvrhIzrhJDrhJLrhJPrhJjrhJnrhJvrhJzrhJ3rhKPrhKTrhKXrhKjrhKzrhLTrhLXrhLfrhLjrhLnrhYDrhYHrhYTrhYjrhZDrhZHrhZTrhZXrhZjrhZzrhaDrhbjrhbnrhbzrhoDrhoLrhojrhonrhovrho3rhpLrhpPrhpTrhpjrhpzrhqjrh4zrh5Drh5Trh5zrh51cIl0sXG5bXCJiNDQxXCIsXCLtgK5cIiw1LFwi7YC27YC37YC57YC67YC77YC9XCIsNixcIu2Bhu2BiO2BilwiLDVdLFxuW1wiYjQ2MVwiLFwi7YGR7YGS7YGT7YGV7YGW7YGX7YGZXCIsNixcIu2BoVwiLDEwLFwi7YGu7YGvXCJdLFxuW1wiYjQ4MVwiLFwi7YGx7YGy7YGz7YG1XCIsNixcIu2Bvu2Bv+2CgO2CglwiLDE4LFwi64ef64eo64ep64es64ew64e564e764e964iE64iF64iI64iL64iM64iU64iV64iX64iZ64ig64i064i864mY64mc64mg64mo64mp64m064m164m864qE64qF64qJ64qQ64qR64qU64qY64qZ64qa64qg64qh64qj64ql64qm64qq64qs64qw64q064uI64uJ64uM64uQ64uS64uY64uZ64ub64ud64ui64uk64ul64um64uo64urXCIsNCxcIuuLs+uLtOuLteuLt1wiLDQsXCLri7/rjIDrjIHrjITrjIjrjJDrjJHrjJPrjJTrjJXrjJzrjZTrjZXrjZbrjZjrjZvrjZzrjZ7rjZ/rjaTrjaVcIl0sXG5bXCJiNTQxXCIsXCLtgpVcIiwxNCxcIu2Cpu2Cp+2Cqe2Cqu2Cq+2CrVwiLDVdLFxuW1wiYjU2MVwiLFwi7YKz7YK27YK47YK6XCIsNSxcIu2Dgu2Dg+2Dhe2Dhu2Dh+2DilwiLDUsXCLtg5Ltg5ZcIiw0XSxcbltcImI1ODFcIixcIu2Dm+2Dnu2Dn+2Doe2Dou2Do+2DpVwiLDYsXCLtg67tg7JcIiw1LFwi7YO5XCIsMTEsXCLrjafrjanrjavrja7rjbDrjbHrjbTrjbjrjoDrjoHrjoPrjoTrjoXrjozrjpDrjpTrjqDrjqHrjqjrjqzrj4Trj4Xrj4jrj4vrj4zrj47rj5Drj5Trj5Xrj5frj5nrj5vrj53rj6Drj6Trj6jrj7zrkJDrkJjrkJzrkKDrkKjrkKnrkKvrkLTrkZDrkZHrkZTrkZjrkaDrkaHrkaPrkaXrkazrkoDrkojrkp3rkqTrkqjrkqzrkrXrkrfrkrnrk4Drk4Trk4jrk5Drk5Xrk5zrk53rk6Drk6Prk6Trk6brk6zrk63rk6/rk7Hrk7jrlJTrlJXrlJjrlJvrlJzrlKTrlKXrlKfrlKjrlKnrlKrrlLDrlLHrlLTrlLhcIl0sXG5bXCJiNjQxXCIsXCLthIVcIiw3LFwi7YSOXCIsMTddLFxuW1wiYjY2MVwiLFwi7YSgXCIsMTUsXCLthLLthLPthLXthLbthLfthLnthLvthLzthL3thL5cIl0sXG5bXCJiNjgxXCIsXCLthL/thYLthYZcIiw1LFwi7YWO7YWP7YWR7YWS7YWT7YWVXCIsNixcIu2Fnu2FoO2FolwiLDUsXCLthantharthavtha3rlYDrlYHrlYPrlYTrlYXrlYvrlYzrlY3rlZDrlZTrlZzrlZ3rlZ/rlaDrlaHrlqDrlqHrlqTrlqjrlqrrlqvrlrDrlrHrlrPrlrTrlrXrlrvrlrzrlr3rl4Drl4Trl4zrl43rl4/rl5Drl5Hrl5jrl6zrmJDrmJHrmJTrmJjrmKXrmKzrmLTrmYjrmaTrmajrmpzrmp3rmqDrmqTrmqvrmqzrmrHrm5Trm7Drm7Trm7jrnIDrnIHrnIXrnKjrnKnrnKzrnK/rnLDrnLjrnLnrnLvrnYTrnYjrnYzrnZTrnZXrnaDrnaTrnajrnbDrnbHrnbPrnbXrnbzrnb3rnoDrnoTrnozrno3rno/rnpDrnpHrnpLrnpbrnpdcIl0sXG5bXCJiNzQxXCIsXCLtha5cIiwxMyxcIu2FvVwiLDYsXCLthoXthobthofthonthopcIl0sXG5bXCJiNzYxXCIsXCLthotcIiwyMCxcIu2Gou2Go+2Gpe2Gpu2Gp1wiXSxcbltcImI3ODFcIixcIu2GqVwiLDYsXCLthrLthrTthrbthrfthrjthrnthrvthr3thr7thr/th4FcIiwxNCxcIuuemOuemeuenOueoOueqOueqeueq+uerOuereuetOueteueuOufh+ufieufrOufreufsOuftOufvOufveufv+uggOuggeugh+ugiOugieugjOugkOugmOugmeugm+ugneugpOugpeugqOugrOugtOugteugt+uguOugueuhgOuhhOuhkeuhk+uhnOuhneuhoOuhpOuhrOuhreuhr+uhseuhuOuhvOuijeuiqOuisOuitOuiuOujgOujgeujg+ujheujjOujkOujlOujneujn+ujoeujqOujqeujrOujsOujuOujueuju+ujveukhOukmOukoOukvOukveulgOulhOuljOulj+ulkeulmOulmeulnOuloOulqOulqVwiXSxcbltcImI4NDFcIixcIu2HkFwiLDcsXCLth5lcIiwxN10sXG5bXCJiODYxXCIsXCLth6tcIiw4LFwi7Ye17Ye27Ye37Ye5XCIsMTNdLFxuW1wiYjg4MVwiLFwi7YiI7YiKXCIsNSxcIu2IkVwiLDI0LFwi66Wr66Wt66W066W166W466W866aE66aF66aH66aJ66aK66aN66aO66as66at66aw66a066a866a966a/66eB66eI66eJ66eM66eOXCIsNCxcIuunmOunmeunm+unneunnuunoeuno+unpOunpeunqOunrOuntOunteunt+unuOunueunuuuogOuogeuoiOuoleuouOuoueuovOupgOupguupiOupieupi+upjeupjuupk+uplOupleupmOupnOuppOuppeupp+upqOupqeupsOupseuptOupuOuqg+uqhOuqheuqh+uqjOuqqOuqqeuqq+uqrOuqsOuqsuuquOuqueuqu+uqveurhOuriOurmOurmeurvFwiXSxcbltcImI5NDFcIixcIu2Iqu2Iq+2Iru2Ir+2Ise2Isu2Is+2ItVwiLDYsXCLtiL7tiYDtiYJcIiw1LFwi7YmJ7YmK7YmL7YmMXCJdLFxuW1wiYjk2MVwiLFwi7YmNXCIsMTQsXCLtiZ1cIiw2LFwi7Yml7Ymm7Ymn7YmoXCJdLFxuW1wiYjk4MVwiLFwi7YmpXCIsMjIsXCLtioLtioPtioXtiobtioftiontiortiovtiozrrIDrrITrrI3rrI/rrJHrrJjrrJzrrKDrrKnrrKvrrLTrrLXrrLbrrLjrrLvrrLzrrL3rrL7rrYTrrYXrrYfrrYnrrY3rrY/rrZDrrZTrrZjrraHrraPrrazrrojrrozrrpDrrqTrrqjrrqzrrrTrrrfrr4Drr4Trr4jrr5Drr5Prr7jrr7nrr7zrr7/rsIDrsILrsIjrsInrsIvrsIzrsI3rsI/rsJHrsJRcIiw0LFwi67CbXCIsNCxcIuuwpOuwpeuwp+uwqeuwreuwsOuwseuwtOuwuOuxgOuxgeuxg+uxhOuxheuxieuxjOuxjeuxkOuxneuyhOuyheuyiOuyi+uyjOuyjuuylOuyleuyl1wiXSxcbltcImJhNDFcIixcIu2Kje2Kju2Kj+2Kku2Kk+2KlO2KllwiLDUsXCLtip3tip7tip/tiqHtiqLtiqPtiqVcIiw2LFwi7YqtXCJdLFxuW1wiYmE2MVwiLFwi7Yqu7Yqv7Yqw7YqyXCIsNSxcIu2Kuu2Ku+2Kve2Kvu2Lge2Lg1wiLDQsXCLti4rti4xcIiw1XSxcbltcImJhODFcIixcIu2Lku2Lk+2Lle2Llu2Ll+2Lme2Lmu2Lm+2LnVwiLDYsXCLti6ZcIiw5LFwi7Yuy7Yuz7Yu17Yu27Yu37Yu57Yu667KZ67Ka67Kg67Kh67Kk67Kn67Ko67Kw67Kx67Kz67K067K167K867K967OA67OE67ON67OP67OQ67OR67OV67OY67Oc67O067O167O267O467O867SE67SF67SH67SJ67SQ67SU67Sk67Ss67WA67WI67WJ67WM67WQ67WY67WZ67Wk67Wo67aA67aB67aE67aH67aI67aJ67aK67aQ67aR67aT67aV67aZ67aa67ac67ak67aw67a467eU67eV67eY67ec67ep67ew67e067e467iA67iD67iF67iM67iN67iQ67iU67ic67id67if67mE67mF67mI67mM67mO67mU67mV67mX67mZ67ma67mb67mg67mh67mkXCJdLFxuW1wiYmI0MVwiLFwi7Yu7XCIsNCxcIu2Mgu2MhO2MhlwiLDUsXCLtjI/tjJHtjJLtjJPtjJXtjJdcIiw0LFwi7Yye7Yyi7YyjXCJdLFxuW1wiYmI2MVwiLFwi7Yyk7Yym7Yyn7Yyq7Yyr7Yyt7Yyu7Yyv7YyxXCIsNixcIu2Muu2MvlwiLDUsXCLtjYbtjYftjYjtjYlcIl0sXG5bXCJiYjgxXCIsXCLtjYpcIiwzMSxcIuu5qOu5quu5sOu5seu5s+u5tOu5teu5u+u5vOu5veu6gOu6hOu6jOu6jeu6j+u6kOu6keu6mOu6meu6qOu7kOu7keu7lOu7l+u7mOu7oOu7o+u7pOu7peu7rOu8geu8iOu8ieu8mOu8meu8m+u8nOu8neu9gOu9geu9hOu9iOu9kOu9keu9leu+lOu+sOu/heu/jOu/jeu/kOu/lOu/nOu/n+u/oeyAvOyBkeyBmOyBnOyBoOyBqOyBqeyCkOyCkeyClOyCmOyCoOyCoeyCo+yCpeyCrOyCreyCr+yCsOyCs+yCtOyCteyCtuyCvOyCveyCv+yDgOyDgeyDheyDiOyDieyDjOyDkOyDmOyDmeyDm+yDnOyDneyDpFwiXSxcbltcImJjNDFcIixcIu2NqlwiLDE3LFwi7Y2+7Y2/7Y6B7Y6C7Y6D7Y6F7Y6G7Y6HXCJdLFxuW1wiYmM2MVwiLFwi7Y6I7Y6J7Y6K7Y6L7Y6O7Y6SXCIsNSxcIu2Omu2Om+2One2Onu2On+2OoVwiLDYsXCLtjqrtjqztjq5cIl0sXG5bXCJiYzgxXCIsXCLtjq9cIiw0LFwi7Y617Y627Y637Y657Y667Y677Y69XCIsNixcIu2Phu2Ph+2PilwiLDUsXCLtj5FcIiw1LFwi7IOl7IOo7IOs7IO07IO17IO37IO57ISA7ISE7ISI7ISQ7ISV7IScXCIsNCxcIuyEo+yEpOyEpuyEp+yErOyEreyEr+yEsOyEseyEtuyEuOyEueyEvOyFgOyFiOyFieyFi+yFjOyFjeyFlOyFleyFmOyFnOyFpOyFpeyFp+yFqOyFqeyFsOyFtOyFuOyGheyGjOyGjeyGjuyGkOyGlOyGluyGnOyGneyGn+yGoeyGpeyGqOyGqeyGrOyGsOyGveyHhOyHiOyHjOyHlOyHl+yHmOyHoOyHpOyHqOyHsOyHseyHs+yHvOyHveyIgOyIhOyIjOyIjeyIj+yIkeyImOyImeyInOyIn+yIoOyIqOyIqeyIq+yIrVwiXSxcbltcImJkNDFcIixcIu2Pl+2PmVwiLDcsXCLtj6Ltj6RcIiw3LFwi7Y+u7Y+v7Y+x7Y+y7Y+z7Y+17Y+27Y+3XCJdLFxuW1wiYmQ2MVwiLFwi7Y+47Y+57Y+67Y+77Y++7ZCA7ZCCXCIsNSxcIu2QiVwiLDEzXSxcbltcImJkODFcIixcIu2Ql1wiLDUsXCLtkJ5cIiwyNSxcIuyIr+yIseyIsuyItOyJiOyJkOyJkeyJlOyJmOyJoOyJpeyJrOyJreyJsOyJtOyJvOyJveyJv+yKgeyKiOyKieyKkOyKmOyKm+yKneyKpOyKpeyKqOyKrOyKreyKtOyKteyKt+yKueyLnOyLneyLoOyLo+yLpOyLq+yLrOyLreyLr+yLseyLtuyLuOyLueyLu+yLvOyMgOyMiOyMieyMjOyMjeyMk+yMlOyMleyMmOyMnOyMpOyMpeyMqOyMqeyNheyNqOyNqeyNrOyNsOyNsuyNuOyNueyNvOyNveyOhOyOiOyOjOyPgOyPmOyPmeyPnOyPn+yPoOyPouyPqOyPqeyPreyPtOyPteyPuOyQiOyQkOyQpOyQrOyQsFwiXSxcbltcImJlNDFcIixcIu2QuFwiLDcsXCLtkYHtkYLtkYPtkYVcIiwxNF0sXG5bXCJiZTYxXCIsXCLtkZRcIiw3LFwi7ZGd7ZGe7ZGf7ZGh7ZGi7ZGj7ZGlXCIsNyxcIu2Rru2RsO2Rse2RslwiXSxcbltcImJlODFcIixcIu2Rs1wiLDQsXCLtkbrtkbvtkb3tkb7tkoHtkoNcIiw0LFwi7ZKK7ZKM7ZKOXCIsNSxcIu2SlVwiLDgsXCLskLTskLzskL3skYjskaTskaXskajskazskbTskbXskbnskoDskpTskpzskrjskrzsk6nsk7Dsk7Hsk7Tsk7jsk7rsk7/slIDslIHslIzslJDslJTslJzslKjslKnslKzslLDslLjslLnslLvslL3slYTslYXslYjslYnslYrslYzslY3slY7slZPslZTslZXslZfslZjslZnslZ3slZ7slaDslaHslaTslajslbDslbHslbPslbTslbXslbzslb3sloDsloTslofslozslo3slo/slpHslpXslpfslpjslpzslqDslqnslrTslrXslrjslrnslrvslrzslr3slr7sl4RcIiw2LFwi7JeM7JeOXCJdLFxuW1wiYmY0MVwiLFwi7ZKeXCIsMTAsXCLtkqpcIiwxNF0sXG5bXCJiZjYxXCIsXCLtkrlcIiwxOCxcIu2Tje2Tju2Tj+2Tke2Tku2Tk+2TlVwiXSxcbltcImJmODFcIixcIu2TllwiLDUsXCLtk53tk57tk6BcIiw3LFwi7ZOp7ZOq7ZOr7ZOt7ZOu7ZOv7ZOxXCIsNixcIu2Tue2Tuu2TvOyXkOyXkeyXlOyXmOyXoOyXoeyXo+yXpeyXrOyXreyXruyXsOyXtOyXtuyXt+yXvFwiLDUsXCLsmIXsmIbsmIfsmIjsmIzsmJDsmJjsmJnsmJvsmJzsmKTsmKXsmKjsmKzsmK3smK7smLDsmLPsmLTsmLXsmLfsmLnsmLvsmYDsmYHsmYTsmYjsmZDsmZHsmZPsmZTsmZXsmZzsmZ3smaDsmazsma/smbHsmbjsmbnsmbzsmoDsmojsmonsmovsmo3smpTsmpXsmpjsmpzsmqTsmqXsmqfsmqnsmrDsmrHsmrTsmrjsmrnsmrrsm4Dsm4Hsm4Psm4Xsm4zsm43sm5Dsm5Tsm5zsm53sm6Dsm6Hsm6hcIl0sXG5bXCJjMDQxXCIsXCLtk75cIiw1LFwi7ZSF7ZSG7ZSH7ZSJ7ZSK7ZSL7ZSNXCIsNixcIu2Ulu2UmFwiLDVdLFxuW1wiYzA2MVwiLFwi7ZSeXCIsMjVdLFxuW1wiYzA4MVwiLFwi7ZS47ZS57ZS67ZS77ZS+7ZS/7ZWB7ZWC7ZWD7ZWFXCIsNixcIu2Vju2VkO2VklwiLDUsXCLtlZrtlZvtlZ3tlZ7tlZ/tlaHtlaLtlaPsm6nsm6zsm7Dsm7jsm7nsm73snITsnIXsnIjsnIzsnJTsnJXsnJfsnJnsnKDsnKHsnKTsnKjsnLDsnLHsnLPsnLXsnLfsnLzsnL3snYDsnYTsnYrsnYzsnY3snY/snZFcIiw3LFwi7J2c7J2g7J2o7J2r7J207J217J247J287J297J2+7J6D7J6E7J6F7J6H7J6I7J6J7J6K7J6O7J6Q7J6R7J6U7J6W7J6X7J6Y7J6a7J6g7J6h7J6j7J6k7J6l7J6m7J6s7J6t7J6w7J607J687J697J6/7J+A7J+B7J+I7J+J7J+M7J+O7J+Q7J+Y7J+d7J+k7J+o7J+s7KCA7KCB7KCE7KCI7KCKXCJdLFxuW1wiYzE0MVwiLFwi7ZWk7ZWm7ZWn7ZWq7ZWs7ZWuXCIsNSxcIu2Vtu2Vt+2Vue2Vuu2Vu+2VvVwiLDYsXCLtlobtlortlotcIl0sXG5bXCJjMTYxXCIsXCLtloztlo3tlo7tlo/tlpFcIiwxOSxcIu2Wpu2Wp1wiXSxcbltcImMxODFcIixcIu2WqFwiLDMxLFwi7KCQ7KCR7KCT7KCV7KCW7KCc7KCd7KCg7KCk7KCs7KCt7KCv7KCx7KC47KC87KGA7KGI7KGJ7KGM7KGN7KGU7KGw7KGx7KG07KG47KG67KKA7KKB7KKD7KKF7KKG7KKH7KKL7KKM7KKN7KKU7KKd7KKf7KKh7KKo7KK87KK97KOE7KOI7KOM7KOU7KOV7KOX7KOZ7KOg7KOh7KOk7KO17KO87KO97KSA7KSE7KSF7KSG7KSM7KSN7KSP7KSR7KSY7KSs7KS07KWQ7KWR7KWU7KWY7KWg7KWh7KWj7KWs7KWw7KW07KW87KaI7KaJ7KaM7KaQ7KaY7KaZ7Kab7Kad7KeA7KeB7KeE7KeH7KeI7KeK7KeQ7KeR7KeTXCJdLFxuW1wiYzI0MVwiLFwi7ZeK7ZeL7ZeN7ZeO7ZeP7ZeR7ZeTXCIsNCxcIu2Xmu2XnO2XnlwiLDUsXCLtl6btl6ftl6ntl6rtl6vtl63tl65cIl0sXG5bXCJjMjYxXCIsXCLtl69cIiw0LFwi7Ze27Ze47Ze6XCIsNSxcIu2Ygu2Yg+2Yhe2Yhu2Yh+2YiVwiLDYsXCLtmJJcIl0sXG5bXCJjMjgxXCIsXCLtmJZcIiw1LFwi7Zid7Zie7Zif7Zih7Zii7Zij7ZilXCIsNyxcIu2YrlwiLDksXCLtmLrtmLvsp5Xsp5bsp5nsp5rsp5zsp53sp6Dsp6Lsp6Tsp6fsp6zsp63sp6/sp7Dsp7Hsp7jsp7nsp7zsqIDsqIjsqInsqIvsqIzsqI3sqJTsqJjsqKnsqYzsqY3sqZDsqZTsqZzsqZ3sqZ/sqaDsqaHsqajsqb3sqoTsqpjsqrzsqr3sq4Dsq4Tsq4zsq43sq4/sq5Hsq5Psq5jsq5nsq6Dsq6zsq7TsrIjsrJDsrJTsrJjsrKDsrKHsrYHsrYjsrYnsrYzsrZDsrZjsrZnsrZ3sraTsrbjsrbnsrpzsrrjsr5Tsr6Tsr6fsr6nssIzssI3ssJDssJTssJzssJ3ssKHssKLssKfssKjssKnssKzssK7ssLDssLjssLnssLtcIl0sXG5bXCJjMzQxXCIsXCLtmL3tmL7tmL/tmYHtmYLtmYPtmYTtmYbtmYftmYrtmYztmY7tmY/tmZDtmZLtmZPtmZbtmZftmZntmZrtmZvtmZ1cIiw0XSxcbltcImMzNjFcIixcIu2ZolwiLDQsXCLtmajtmapcIiw1LFwi7Zmy7Zmz7Zm1XCIsMTFdLFxuW1wiYzM4MVwiLFwi7ZqB7ZqC7ZqE7ZqGXCIsNSxcIu2aju2aj+2ake2aku2ak+2alVwiLDcsXCLtmp7tmqDtmqJcIiw1LFwi7Zqp7Zqq7LC87LC97LC+7LGE7LGF7LGI7LGM7LGU7LGV7LGX7LGY7LGZ7LGg7LGk7LGm7LGo7LGw7LG17LKY7LKZ7LKc7LKg7LKo7LKp7LKr7LKs7LKt7LK07LK17LK47LK87LOE7LOF7LOH7LOJ7LOQ7LOU7LOk7LOs7LOw7LSB7LSI7LSJ7LSM7LSQ7LSY7LSZ7LSb7LSd7LSk7LSo7LSs7LS57LWc7LWg7LWk7LWs7LWt7LWv7LWx7LW47LaI7LaU7LaV7LaY7Lac7Lak7Lal7Lan7Lap7Law7LeE7LeM7LeQ7Leo7Les7Lew7Le47Le57Le77Le97LiE7LiI7LiM7LiU7LiZ7Lig7Lih7Lik7Lio7Liw7Lix7Liz7Li1XCJdLFxuW1wiYzQ0MVwiLFwi7Zqr7Zqt7Zqu7Zqv7ZqxXCIsNyxcIu2auu2avFwiLDcsXCLtm4btm4ftm4ntm4rtm4tcIl0sXG5bXCJjNDYxXCIsXCLtm43tm47tm4/tm5Dtm5Ltm5Ptm5Xtm5btm5jtm5pcIiw1LFwi7Zuh7Zui7Zuj7Zul7Zum7Zun7ZupXCIsNF0sXG5bXCJjNDgxXCIsXCLtm67tm6/tm7Htm7Ltm7Ptm7Ttm7ZcIiw1LFwi7Zu+7Zu/7ZyB7ZyC7ZyD7ZyFXCIsMTEsXCLtnJLtnJPtnJTsuZjsuZnsuZzsuZ/suaDsuaHsuajsuansuavsua3subTsubXsubjsubzsuoTsuoXsuofsuonsupDsupHsupTsupjsuqDsuqHsuqPsuqTsuqXsuqzsuq3su4Hsu6Tsu6Xsu6jsu6vsu6zsu7Tsu7Xsu7fsu7jsu7nsvIDsvIHsvITsvIjsvJDsvJHsvJPsvJXsvJzsvKDsvKTsvKzsvK3svK/svLDsvLHsvLjsvZTsvZXsvZjsvZzsvaTsvaXsvafsvansvbDsvbHsvbTsvbjsvoDsvoXsvozsvqHsvqjsvrDsv4Tsv6Dsv6Hsv6Tsv6jsv7Dsv7Hsv7Psv7Xsv7ztgIDtgITtgJHtgJjtgK3tgLTtgLXtgLjtgLxcIl0sXG5bXCJjNTQxXCIsXCLtnJXtnJbtnJftnJrtnJvtnJ3tnJ7tnJ/tnKFcIiw2LFwi7Zyq7Zys7ZyuXCIsNSxcIu2ctu2ct+2cuVwiXSxcbltcImM1NjFcIixcIu2cuu2cu+2cvVwiLDYsXCLtnYXtnYbtnYjtnYpcIiw1LFwi7Z2S7Z2T7Z2V7Z2aXCIsNF0sXG5bXCJjNTgxXCIsXCLtnZ/tnaLtnaTtnabtnaftnajtnartnavtna3tna7tna/tnbHtnbLtnbPtnbVcIiw2LFwi7Z2+7Z2/7Z6A7Z6CXCIsNSxcIu2eiu2ei+2BhO2Bhe2Bh+2Bie2BkO2BlO2BmO2BoO2BrO2Bre2BsO2BtO2BvO2Bve2Cge2CpO2Cpe2CqO2CrO2CtO2Cte2Ct+2Cue2DgO2Dge2DhO2DiO2Die2DkO2Dke2Dk+2DlO2Dle2DnO2Dne2DoO2DpO2DrO2Dre2Dr+2DsO2Dse2DuO2Eje2EsO2Ese2EtO2EuO2Euu2FgO2Fge2Fg+2FhO2Fhe2FjO2Fje2FkO2FlO2FnO2Fne2Fn+2Foe2FqO2FrO2FvO2GhO2GiO2GoO2Goe2GpO2GqO2GsO2Gse2Gs+2Gte2Guu2GvO2HgO2HmO2HtO2HuO2Ih+2Iie2IkO2IrO2Ire2IsO2ItO2IvO2Ive2Iv+2Jge2JiO2JnFwiXSxcbltcImM2NDFcIixcIu2eje2eju2ej+2ekVwiLDYsXCLtnprtnpztnp5cIiw1XSxcbltcImM2YTFcIixcIu2JpO2KgO2Kge2KhO2KiO2KkO2Kke2Kle2KnO2KoO2KpO2KrO2Kse2KuO2Kue2KvO2Kv+2LgO2Lgu2LiO2Lie2Li+2LlO2LmO2LnO2LpO2Lpe2LsO2Lse2LtO2LuO2MgO2Mge2Mg+2Mhe2MjO2Mje2Mju2MkO2MlO2Mlu2MnO2Mne2Mn+2MoO2Moe2Mpe2MqO2Mqe2MrO2MsO2MuO2Mue2Mu+2MvO2Mve2NhO2Nhe2NvO2Nve2OgO2OhO2OjO2Oje2Oj+2OkO2Oke2OmO2Ome2OnO2OoO2OqO2Oqe2Oq+2Ore2OtO2OuO2OvO2PhO2Phe2PiO2Pie2PkO2PmO2Poe2Po+2PrO2Pre2PsO2PtO2PvO2Pve2Pv+2QgVwiXSxcbltcImM3YTFcIixcIu2QiO2Qne2RgO2RhO2RnO2RoO2RpO2Rre2Rr+2RuO2Rue2RvO2Rv+2SgO2Sgu2SiO2Sie2Si+2Sje2SlO2Sqe2TjO2TkO2TlO2TnO2Tn+2TqO2TrO2TsO2TuO2Tu+2Tve2UhO2UiO2UjO2UlO2Ule2Ul+2UvO2Uve2VgO2VhO2VjO2Vje2Vj+2Vke2VmO2Vme2VnO2VoO2Vpe2VqO2Vqe2Vq+2Vre2VtO2Vte2VuO2VvO2WhO2Whe2Wh+2WiO2Wie2WkO2Wpe2XiO2Xie2XjO2XkO2Xku2XmO2Xme2Xm+2Xne2XpO2Xpe2XqO2XrO2XtO2Xte2Xt+2Xue2YgO2Yge2YhO2YiO2YkO2Yke2Yk+2YlO2Yle2YnO2YoFwiXSxcbltcImM4YTFcIixcIu2YpO2Yre2YuO2Yue2YvO2ZgO2Zhe2ZiO2Zie2Zi+2Zje2Zke2ZlO2Zle2ZmO2ZnO2Zp+2Zqe2ZsO2Zse2ZtO2ag+2ahe2ajO2aje2akO2alO2ane2an+2aoe2aqO2arO2asO2aue2au+2bhO2bhe2biO2bjO2bke2blO2bl+2bme2boO2bpO2bqO2bsO2bte2bvO2bve2cgO2chO2cke2cmO2cme2cnO2coO2cqO2cqe2cq+2cre2ctO2cte2cuO2cvO2dhO2dh+2die2dkO2dke2dlO2dlu2dl+2dmO2dme2doO2doe2do+2dpe2dqe2drO2dsO2dtO2dvO2dve2ege2eiO2eie2ejO2ekO2emO2eme2em+2enVwiXSxcbltcImNhYTFcIixcIuS8veS9s+WBh+WDueWKoOWPr+WRteWTpeWYieWrgeWutuaah+aetuaet+afr+atjOePgueXgueovOiLm+iMhOihl+iiiOiotuiziOi3j+i7u+i/pumnleWIu+WNtOWQhOaBquaFpOauvOePj+iEmuimuuinkumWo+S+g+WIiuWivuWluOWnpuW5suW5ueaHh+aPgOadhuafrOahv+a+l+eZjueci+ejteeoiOerv+ewoeiCneiJruiJseirq+mWk+S5q+WWneabt+a4tOeio+erreiRm+ikkOidjumeqOWLmOWdjuWgquW1jOaEn+aGvuaIoeaVouafkeaphOa4m+eUmOeWs+ebo+eesOe0uumCr+mRkemRkum+lVwiXSxcbltcImNiYTFcIixcIuWMo+WyrOeUsuiDm+mJgOmWmOWJm+WgiOWnnOWyoeW0l+W6t+W8uuW9iuaFt+axn+eVuueWhuezoOe1s+e2see+jOiFlOiIoeiWkeilgeism+mLvOmZjemxh+S7i+S7t+WAi+WHseWhj+aEt+aEvuaFqOaUueanqua8keeWpeeahueblueuh+iKpeiTi++kgOmOp+mWi+WWgOWuouWdke+kgeeys+e+uemGteWAqOWOu+WxheW3qOaLkuaNruaTmuaTp+a4oOeCrOelm+i3nei4nu+kgumBvemJhemLuOS5vuS7tuWBpeW3vuW7uuaEhuall+iFseiZlOi5h+mNtemoq+S5nuWCkeadsOahgOWEieWKjeWKkuaqolwiXSxcbltcImNjYTFcIixcIueevOmIkOm7lOWKq+aAr+i/suWBiOaGqeaPreaTiuagvOaqhOa/gOiGiOimoemalOWgheeJveeKrOeUhOe1uee5reiCqeimi+ittOmBo+m1keaKieaxuua9lOe1kOe8uuioo+WFvOaFiueuneismemJl+mOjOS6rOS/k+WAnuWCvuWEhuWLgeWLjeWNv+WdsOWig+W6muW+keaFtuaGrOaTjuaVrOaZr+aau+abtOail+a2h+eCheeDseeSn+eSpeeTiueXmeehrOejrOern+ertue1hee2k+iAleiAv+iEm+iOluitpui8lemAlemPoemgg+mguOmpmumvqOS/guWVk+WguuWlkeWto+WxhuaCuOaIkuahguaisFwiXSxcbltcImNkYTFcIixcIuajqOa6queVjOeZuOejjueoveezu+e5q+e5vOioiOiqoeiwv+majum3hOWPpOWPqeWRiuWRseWbuuWnkeWtpOWwu+W6q+aLt+aUt+aVheaVsuaaoOaer+angeayveeXvOeakOedvueov+e+lOiAg+iCoeiGj+iLpuiLveiPsOiXgeigseiitOiqpe+kg+i+nOmMrumbh+mhp+mrmOm8k+WTreaWm+absuaij+epgOiwt+m1oOWbsOWdpOW0keaYhuaiseajjea7vueQqOiinumvpOaxqO+khOmqqOS+m+WFrOWFseWKn+WtlOW3peaBkOaBreaLseaOp+aUu+ePmeepuuiao+iyoumej+S4suWvoeaIiOaenOeTnFwiXSxcbltcImNlYTFcIixcIuenkeiPk+iqh+iqsui3qOmBjumNi+mhhuW7k+anqOiXv+mDre+kheWGoOWumOWvrOaFo+ajuuasvueBjOeQr+eTmOeuoee9kOiPheingOiyq+mXnOmkqOWIruaBneaLrOmAguS+iuWFieWMoeWjmeW7o+aboOa0uOeCmueLguePluetkOiDsemRm+WNpuaOm+e9q+S5luWCgOWhiuWjnuaAquaEp+aLkOankOmtgeWuj+e0mOiCsei9n+S6pOWDkeWSrOWWrOWsjOW2oOW3p+aUquaVjuagoeapi+eLoeeajuefr+e1nue/ueiGoOiVjuibn+i8g+i9jumDiumkg+mplemuq+S4mOS5heS5neS7h+S/seWFt+WLvlwiXSxcbltcImNmYTFcIixcIuWNgOWPo+WPpeWSjuWYlOWdteWeouWvh+W2h+W7kOaHvOaLmOaVkeaeuOafqeani+atkOavhuavrOaxgua6neeBuOeLl+eOlueQg+eev+efqeeptue1v+iAieiHvOiIheiIiuiLn+ihouiss+izvOi7gOmAkemCsemJpOmKtumnkumphemzqem3l+m+nOWci+WxgOiPiumeoOmeq+m6tOWQm+eqmOe+pOijmei7jemDoeWggOWxiOaOmOeqn+WuruW8k+epueeqruiKjui6rOWApuWIuOWLuOWNt+WciOaLs+aNsuasiua3g+ect+WOpeeNl+iVqOi5tumXleacuuarg+a9sOiprei7jOmli++khuaZt+atuOiytFwiXSxcbltcImQwYTFcIixcIumsvO+kh+WPq+WcreWljuaPhuanu+ePquehheequuerheezvuiRteimj+i1s+mAtemWqOWLu+Wdh+eVh+etoOiPjOmInu+kiOapmOWFi+WJi+WKh+aIn+ajmOaltemameWDheWKpOWLpOaHg+aWpOagueanv+eRvueti+iKueiPq+imsuisuei/kemlie+kieS7iuWml+aTkuaYkeaqjueQtOemgeemveiKqeihvuihv+iln++kiumMpuS8i+WPiuaApeaJseaxsue0mue1puS6mOWFouefnOiCr+S8geS8juWFtuWGgOWXnOWZqOWcu+WfuuWfvOWklOWlh+Wmk+WvhOWykOW0juW3seW5vuW/jOaKgOaXl+aXo1wiXSxcbltcImQxYTFcIixcIuacnuacn+adnuaji+ajhOapn+asuuawo+axveaygua3h+eOmOeQpueQqueSgueSo+eVuOeVv+eigeejr+elgeelh+eliOeluueulee0gOe2uue+iOiAhuiAreiCjOiomOitj+ixiOi1t+mMoemMpOmjoumlkemojumoj+mppem6kue3iuS9tuWQieaLruahlOmHkeWWq+WEuu+ki++kjOWonOaHpu+kjeaLj+aLv++kjlwiLDUsXCLpgqPvpJRcIiw0LFwi6Ku+76SZ76Sa76Sb76Sc5pqW76Sd54WW76Se76Sf6Zuj76Sg5o2P5o265Y2X76Sh5p6P5qWg5rmz76Si55S376Sj76Sk76SlXCJdLFxuW1wiZDJhMVwiLFwi57SN76Sm76Sn6KGy5ZuK5aiY76SoXCIsNCxcIuS5g++kreWFp+WliOafsOiAkO+kruWls+W5tOaSmueniuW/teaBrOaLiOaNu+Wvp+Wvl+WKqu+kr+WltOW8qeaAku+ksO+kse+ksueRme+ks1wiLDUsXCLpp5HvpLlcIiwxMCxcIua/g++lhO+lheiGv+i+suaDse+lhu+lh+iFpu+liO+lieWwv++lilwiLDcsXCLlq6noqKXmnbvntJDvpZJcIiw1LFwi6IO976WY76WZ5bC85rOl5Yy/5rq65aSa6Iy2XCJdLFxuW1wiZDNhMVwiLFwi5Li55Lq25L2G5Zau5ZyY5aOH5b2W5pa35pem5qqA5q615rmN55+t56uv57Ce57ee6JuL6KKS6YSy6Y2b5pK75r6+542655a46YGU5ZWW5Z2N5oa65pOU5puH5reh5rmb5r2t5r6555ew6IGD6Ia96JWB6KaD6KuH6K2a6Yyf5rKT55WT562U6LiP6YGd5ZSQ5aCC5aGY5bmi5oiH5pKe5qOg55W257OW6J6z6buo5Luj5Z6I5Z2u5aSn5bCN5bKx5bi25b6F5oi05pOh546z6Ie66KKL6LK46ZqK6bub5a6F5b635oKz5YCS5YiA5Yiw5ZyW5aC15aGX5bCO5bGg5bO25baL5bqm5b6S5oK85oyR5o6J5pCX5qGDXCJdLFxuW1wiZDRhMVwiLFwi5qO55quC5reY5rih5ruU5r+k54e+55uc552556ax56i76JCE6Kap6LOt6Lez6LmI6YCD6YCU6YGT6YO96Y2N6Zm26Z+c5q+S54CG54mY54qi542o552j56a/56+k57qb6K6A5aKp5oOH5pWm5pe95pq+5rKM54Se54eJ6LGa6aCT5Lmt56qB5Lud5Yas5YeN5YuV5ZCM5oan5p2x5qGQ5qOf5rSe5r2855a8556z56ul6IO06JGj6YqF5YWc5paX5p2c5p6T55eY56uH6I2z76Wa6LGG6YCX6aCt5bGv6IeA6Iqa6YGB6YGv6YiN5b6X5bad5qmZ54eI55m7562J6Jek6KyE6YSn6aiw5ZaH5oe276Wb55mp576FXCJdLFxuW1wiZDVhMVwiLFwi6Ji/6J666KO46YKP76Wc5rSb54OZ54+e57Wh6JC976Wd6YWq6aex76We5LqC5Y215qyE5qyS54C+54ib6Jit6bie5YmM6L6j5bWQ5pOl5pSs5qyW5r+r57GD57qc6JeN6KWk6Ka95ouJ6IeY6KCf5buK5pyX5rWq54u855CF55Gv6J6C6YOe5L6G5bSN5b6g6JCK5Ya35o6g55Wl5Lqu5YCG5YWp5YeJ5qKB5qiR57Ku57Kx57On6Imv6KuS6Lyb6YeP5L625YS35Yu15ZGC5bus5oWu5oi+5peF5qua5r++56Sq6Jec6KCj6Zat6ami6amq6bqX6buO5Yqb5puG5q2354Cd56Sr6L2i6Z2C5oaQ5oiA5pSj5ryjXCJdLFxuW1wiZDZhMVwiLFwi54WJ55KJ57e06IGv6JOu6Lym6YCj6Y2K5Ya95YiX5Yqj5rSM54OI6KOC5buJ5paC5q6u5r+C57C+54215Luk5Ly25Zu576Wf5bK65ba65oCc546y56yt576a57+O6IGG6YCe6Yi06Zu26Z2I6aCY6b2h5L6L5r6n56au6Ya06Zq35Yue76Wg5pKI5pOE5quT5r2e54CY54iQ55un6ICB6JiG6Jmc6Lev6LyF6Zyy6a2v6be66bm156KM56W/57ag6I+J6YyE6bm/6bqT6KuW5aOf5byE5pyn54Cn55OP57Gg6IG+5YSh54Co54mi56OK6LOC6LOa6LO06Zu35LqG5YOa5a+u5buW5paZ54eO55mC556t6IGK6JO8XCJdLFxuW1wiZDdhMVwiLFwi6YG86ayn6b6N5aOY5amB5bGi5qiT5rea5ryP55i757Sv57i36JSe6KS46Y+k6ZmL5YqJ5peS5p+z5qa05rWB5rqc54CP55CJ55Gg55WZ55ik56Gr6Kys6aGe5YWt5oiu6Zm45L6W5YCr5bSZ5req57a46Lyq5b6L5oWE5qCX76Wh6ZqG5YuS6IKL5Yec5YeM5qWe56ic57a+6I+x6Zm15L+a5Yip5Y6Y5ZCP5ZSO5bGl5oKn5p2O5qKo5rWs54qB54u455CG55KD76Wi55ei57Gs572557646I6J6KOP6KOh6YeM6YeQ6Zui6a+J5ZCd5r2+54eQ55KY6Je66Lqq6Zqj6bGX6bqf5p6X5reL55Cz6Ieo6ZyW56CsXCJdLFxuW1wiZDhhMVwiLFwi56uL56yg57KS5pGp55Gq55ey56K856Oo6aas6a2U6bq75a+e5bmV5ryg6Iac6I6r6YKI5LiH5Y2N5aip5beS5b2O5oWi5oy95pmp5pu85ru/5ryr54Gj556e6JCs6JST6KC76LyT6aWF6bC75ZSc5oq55pyr5rKr6IyJ6KWq6Z265Lqh5aaE5b+Y5b+Z5pyb57ay572U6IqS6Iyr6I696Lye6YKZ5Z+L5aa55aqS5a+Q5pin5p6a5qKF5q+P54Wk57216LK36LOj6YKB6a2F6ISI6LKK6ZmM6amA6bql5a2f5rCT54yb55uy55uf6JCM5Yaq6KaT5YWN5YaV5YuJ5qOJ5rKU55yE55yg57a/57es6Z2i6bq15ruFXCJdLFxuW1wiZDlhMVwiLFwi6JSR5Yal5ZCN5ZG95piO5pqd5qSn5rqf55q/556R6IyX6JOC6J6f6YWp6YqY6bO06KKC5L6u5YaS5Yuf5aeG5bi95oWV5pG45pG55pqu5p+Q5qih5q+N5q+b54mf54mh55GB55y455+b6ICX6Iq86IyF6KyA6Kyo6LKM5pyo5rKQ54mn55uu552m56mG6bap5q2/5rKS5aSi5pym6JKZ5Y2v5aKT5aaZ5buf5o+P5pi05p2z5ri654yr56uX6IuX6Yyo5YuZ5ber5oau5oeL5oiK5ouH5pKr5peg5qWZ5q2m5q+L54Sh54+355Wd57mG6Iie6IyC6JWq6Kqj6LK/6Zyn6bWh5aKo6buY5YCR5YiO5ZC75ZWP5paHXCJdLFxuW1wiZGFhMVwiLFwi5rG257SK57SL6IGe6JqK6ZaA6Zuv5Yu/5rKV54mp5ZGz5aqa5bC+5bWL5b2M5b6u5pyq5qK25qWj5ri85rmE55yJ57Gz576O6JaH6KyO6L+36Z2h6bu05bK35oK25oSN5oar5pWP5pe75pe85rCR5rOv546f54+J57eh6ZaU5a+G6Jyc6KyQ5Ymd5Y2a5ouN5pCP5pKy5py05qi45rOK54+A55Ke566U57KV57ib6IaK6Ii26JaE6L+r6Zu56aeB5Ly05Y2K5Y+N5Y+b5ouM5pCs5pSA5paR5qeD5rOu5r2Y54+t55WU55ii55uk55u856OQ56O756Ss57WG6Iis6J+g6L+U6aCS6aOv5YuD5ouU5pKl5rik5r2RXCJdLFxuW1wiZGJhMVwiLFwi55m86LeL6Yax6Ymi6auu6a2D5YCj5YKN5Z2K5aao5bCo5bmH5b235oi/5pS+5pa55peB5piJ5p6L5qac5ruC56OF57Sh6IKq6IaA6Iir6Iqz6JKh6JqM6Kiq6KyX6YKm6Ziy6b6Q5YCN5L+z76Wj5Z+55b6Y5ouc5o6S5p2v5rmD54SZ55uD6IOM6IOa6KO06KO16KSZ6LOg6Lyp6YWN6Zmq5Lyv5L2w5bib5p+P5qCi55m955m+6a2E5bmh5qiK54Wp54eU55Wq76Wk57mB6JWD6Jep6aOc5LyQ562P572w6Zal5Yeh5biG5qK15rC+5rGO5rOb54qv56+E6IyD5rOV55C65YO75YqI5aOB5pOY5qqX55Kn55mWXCJdLFxuW1wiZGNhMVwiLFwi56Kn6JiX6Zei6Zy576Wl5Y2e5byB6K6K6L6o6L6v6YKK5Yil556l6bGJ6byI5LiZ5YCC5YW15bGb5bm35pie5pi65p+E5qOF54Kz55SB55eF56eJ56ud6Lyn6aSg6aiI5L+d5aCh5aCx5a+25pmu5q2l5rSR5rm65r2954+k55Sr6I+p6KOc6KST6K2c6LyU5LyP5YOV5YyQ5Y2c5a6T5b6p5pyN56aP6IW56Iyv6JSU6KSH6KaG6Ly56Ly76aal6bCS5pys5Lm25L+45aWJ5bCB5bOv5bOw5o2n5qOS54O954ai55Cr57ir6JOs6JyC6YCi6YuS6bOz5LiN5LuY5L+v5YKF5YmW5Ymv5ZCm5ZKQ5Z+g5aSr5ammXCJdLFxuW1wiZGRhMVwiLFwi5a2a5a215a+M5bqc76Wm5om25pW35pan5rWu5rql54i256ym57C/57y26IWQ6IWR6Iaa6ImA6IqZ6I6p6KiD6LKg6LOm6LO76LW06La66YOo6Yec6Zic6ZmE6aeZ6bOn5YyX5YiG5ZCp5Zm05aKz5aWU5aWu5b+/5oak5omu5piQ5rG+54Sa55uG57KJ57Oe57Sb6Iqs6LOB6Zuw76Wn5L2b5byX5b2/5ouC5bSp5pyL5qOa56G857mD6bWs5LiV5YKZ5YyV5Yyq5Y2R5aaD5ami5bqH5oKy5oaK5omJ5om55paQ5p6H5qan5q+U5q+W5q+X5q+Y5rK476Wo55C155e656CS56KR56eV56eY57KD57eL57+h6IKlXCJdLFxuW1wiZGVhMVwiLFwi6IS+6IeC6I+y6Jya6KOo6Kq56K2s6LK76YSZ6Z2e6aOb6by75Zqs5ayq5b2s5paM5qqz5q6v5rWc5r+x54CV54md546t6LKn6LOT6aC75oaR5rC36IGY6aiB5LmN5LqL5Lqb5LuV5Ly65Ly85L2/5L+f5YO/5Y+y5Y+45ZSG5Zej5Zub5aOr5aWi5aiR5a+r5a+65bCE5bez5bir5b6Z5oCd5o2o5pac5pav5p+25p+75qKt5q275rKZ5rOX5rij54CJ542F56CC56S+56WA56Wg56eB56+p57SX57Wy6IKG6IiN6I6O6JOR6JuH6KOf6KmQ6Kme6Kyd6LOc6LWm6L6t6YKq6aO86aef6bqd5YmK76Wp5pyU76WqXCJdLFxuW1wiZGZhMVwiLFwi5YKY5Yiq5bGx5pWj5rGV54+K55Sj55ad566X6JKc6YW46Zyw5Lm35pKS5q6654We6Jap5LiJ76Wr5p2J5qOu5riX6Iqf6JSY6KGr5o+35r6B6YiS6aKv5LiK5YK35YOP5YSf5ZWG5Zaq5ZiX5a2A5bCZ5bOg5bi45bqK5bqg5buC5oOz5qGR5qmh5rmY54i954mA54uA55u456Wl566x57+U6KOz6Ke06Kmz6LGh6LOe6Zyc5aGe55K96LO95ZeH76Ws56mh57Si6Imy54my55Sf55Sl76Wt56yZ5aKF5aO75ba85bqP5bq25b6Q5oGV5oqS5o2/5pWN5pqR5puZ5pu45qCW5qOy54qA55Ge562u57Wu57eW572yXCJdLFxuW1wiZTBhMVwiLFwi6IOl6IiS6Jav6KW/6KqT6YCd6Yuk6buN6byg5aSV5aWt5bit5oOc5piU5pmz5p6Q5rGQ5reF5r2f55+z56Kp6JOG6YeL6Yyr5LuZ5YOK5YWI5ZaE5ayL5a6j5omH5pW+5peL5riy54W955CB55GE55KH55K/55ms56aq57ea57mV576o6IW66Iaz6Ii56Jia6J+s6Km16Lej6YG46YqR6ZCl6aWN6a6u5Y2o5bGR5qWU5rOE5rSp5rir6IiM6Jab6KS76Kit6Kqq6Zuq6b2n5Ymh5pq55q6y57qW6J++6LSN6ZaD6Zmd5pSd5raJ54eu76Wu5Z+O5aeT5a6s5oCn5oO65oiQ5pif5pmf54yp54+555ub55yB562sXCJdLFxuW1wiZTFhMVwiLFwi6IGW6IGy6IWl6Kqg6YaS5LiW5Yui5q2y5rSX56iF56y557Sw76Wv6LKw5Y+s5Ziv5aGR5a615bCP5bCR5bei5omA5o6D5pCU5pit5qKz5rK85raI5rqv54Cf54Kk54eS55Sm55aP55aO55iZ56yR56+g57Cr57Sg57S56JSs6JWt6JiH6Ki06YCN6YGh6YK16Yq36Z+26ai35L+X5bGs5p2f5raR57Kf57qM6KyW6LSW6YCf5a2r5be95pCN6JOA6YGc6aOh546H5a6L5oKa5p2+5ree6Kif6Kqm6YCB6aCM5Yi376Ww54GR56KO6Y6W6KGw6YeX5L+u5Y+X5Ze95Zua5Z6C5aO95auC5a6I5bKr5bOA5bil5oSBXCJdLFxuW1wiZTJhMVwiLFwi5oiN5omL5o6I5pCc5pS25pW45qi55q6K5rC05rSZ5ryx54en54up542455CH55Ky55im552h56eA56mX56uq57K557aP57as57mh576e6ISp6Iyx6JKQ6JOa6Jeq6KKW6Kqw6K6Q6Ly46YGC6YKD6YWs6YqW6Yq56ZqL6Zqn6Zqo6ZuW6ZyA6aCI6aaW6auT6aya5Y+U5aG+5aSZ5a2w5a6/5reR5r2a54af55Ch55K56IKF6I+95beh5b6H5b6q5oGC5pes5qCS5qWv5qmT5q6J5rS15rez54+j55u+556s562N57SU6ISj6Iic6I2A6JO06JWj6Kmi6KuE6YaH6Yye6aCG6aa05oiM6KGT6L+w6Yml5bSH5bSnXCJdLFxuW1wiZTNhMVwiLFwi5bWp55Gf6Iad6J2o5r+V5ou+57+S6KS26KWy5Lie5LmY5YOn5Yud5Y2H5om/5piH57mp6KCF6Zme5L6N5YyZ5Zi25aeL5aqk5bC45bGO5bGN5biC5byR5oGD5pa95piv5pmC5p6+5p+054yc55+i56S657+F6JKU6JON6KaW6Kmm6Kmp6Kuh6LGV6LG65Z+05a+U5byP5oGv5out5qSN5q6W5rmc54aE56+S6J2V6K2Y6Lu+6aOf6aO+5Ly45L6B5L+h5ZG75aig5a645oS85paw5pmo54e855Sz56We57Sz6IWO6Iej6I6Y6Jaq6JeO6JyD6KiK6Lqr6L6b76Wx6L+F5aSx5a6k5a+m5oKJ5a+p5bCL5b+D5rKBXCJdLFxuW1wiZTRhMVwiLFwi76Wy5rex54CL55Sa6Iqv6Ku25LuA5Y2B76Wz6ZuZ5rCP5Lqe5L+E5YWS5ZWe5ail5bOo5oiR54mZ6Iq96I6q6Ju+6KGZ6Kid6Zi/6ZuF6aST6bSJ6bWd5aCK5bKz5ba95bmE5oOh5oSV5o+h5qiC5ril6YSC6Y2U6aGO6bCQ6b235a6J5bK45oyJ5pmP5qGI55y86ZuB6Z6N6aGU6a6f5pah6KyB6LuL6Za85ZS15bKp5beW5bq15pqX55mM6I+06ZeH5aOT5oq854uO6bSo5Luw5aSu5oCP5pi75q6D56en6bSm5Y6T5ZOA5Z+D5bSW5oSb5puW5rav56KN6Im+6ZqY6Z2E5Y6E5om85o6W5ray57iK6IWL6aGNXCJdLFxuW1wiZTVhMVwiLFwi5qu7572M6bav6bia5Lmf5YC75Ya25aSc5oO55o+25qSw54i66IC276W06YeO5byx76W176W257SE6Iul6JGv6JK76Jel6LqN76W35L2v76W476W55aOk5a2D5oGZ5o+a5pSY5pWt5pqY76W65qWK5qij5rSL54CB54Ws55eS55iN56az56mw76W7576K76W86KWE76W96K6T6YeA6Zm976W+6aSK5ZyE5b6h5pa85ryB55iA56am6Kqe6aat6a2a6b2s5YSE5oa25oqR5qqN6IeG5YGD5aCw5b2m54SJ6KiA6Ku65a286JiW5L+65YS85Zq05aWE5o6p5re55baq5qWt5YaG5LqI5L2Z76W/76aA76aB5aaC76aCXCJdLFxuW1wiZTZhMVwiLFwi76aD5q2f5rGd76aE55K156SW76aF6IiH6ImF6Iy56Ly/6L2d76aG6aSY76aH76aI76aJ5Lqm76aK5Z+f5b255piT76aL76aM55ar57m56K2v76aN6YCG6amb5Zql5aCn5ae45aif5a6076aO5bu276aP76aQ5o2Q5oy776aR5qS95rKH5rK/5raO5raT5re15ryU76aS54Of54S254WZ76aT54eD54eV76aU56GP56Gv76aV562157ej76aW57iv76aX6KGN6Luf76aY76aZ76aa6Ymb76ab6bO276ac76ad76ae5oKF5raF76af54ax76ag76ah6Zax5Y6t76ai76aj76ak5p+T76al54KO54Sw55Cw6Im26IuSXCJdLFxuW1wiZTdhMVwiLFwi76am6Za76aul6bm95puE76an54eB6JGJ76ao76ap5aGL76aq76ar5ba45b2x76as5pig5pqO5qW55qau5rC45rOz5ri25r2B5r+a54Cb54Cv54WQ54ef542w76at55Gb76au55OU55uI56mO57qT76av76aw6Iux6Kmg6L+O76ax6Y2I76ay6ZyZ76az76a05LmC5YCq76a15YiI5Y+h5puz5rGt5r+K54yK552/56mi6Iqu6Jed6JiC76a26KOU6Kmj6K296LGr76a36Yqz76a46ZyT6aCQ5LqU5LyN5L+J5YKy5Y2I5ZC+5ZCz5Zea5aGi5aK65aWn5aib5a+k5oKf76a55oeK5pWW5pe/5pmk5qKn5rGa5r6zXCJdLFxuW1wiZThhMVwiLFwi54OP54as542S56296JyI6Kqk6bCy6byH5bGL5rKD542E546J6Yi65rqr55Gl55if56mp57iV6JiK5YWA5aOF5pOB55Ou55SV55mw57+B6YKV6ZuN6aWU5rim55Om56qp56qq6Iel6JuZ6J246Kib5amJ5a6M5a6b5qKh5qSA5rWj546p55CT55Cs56KX57ep57+r6ISY6IWV6I6e6LGM6Ziu6aCR5puw5b6A5pe65p6J5rGq546L5YCt5aiD5q2q55+u5aSW5bWs5beN54yl55WP76a676a75YOl5Ye55aCv5aSt5aaW5aea5a+l76a876a95bai5ouX5pCW5pKT5pO+76a+5puc76a/5qmI76eA54e/55Gk76eBXCJdLFxuW1wiZTlhMVwiLFwi56qI56qv57mH57me6ICA6IWw76eC6J+v6KaB6Kyg6YGZ76eD6YKA6aWS5oW+5qyy5rW057if6KSl6L6x5L+R5YKt5YaX5YuH5Z+H5aKJ5a655bq45oWC5qaV5raM5rmn5rq254aU55Gi55So55Ss6IGz6Iy46JOJ6LiK6Y6U6Y+e76eE5LqO5L2R5YG25YSq5Y+I5Y+L5Y+z5a6H5a+T5bCk5oSa5oaC5pe054mb546X55GA55uC56WQ56aR56a557SG57696IqL6JeV6Jme6L+C6YGH6YO16Yeq6ZqF6Zuo6Zup5YuW5b2n5pet5pix5qCv54Wc56i26YOB6aCK5LqR76eF5qmS5q6e5r6Q54aJ6ICY6Iq46JWTXCJdLFxuW1wiZWFhMVwiLFwi6YGL6ZqV6Zuy6Z+76JSa6ayx5LqQ54aK6ZuE5YWD5Y6f5ZOh5ZyT5ZyS5Z6j5aqb5auE5a+D5oCo5oS/5o+05rKF5rS55rmy5rqQ54iw54y/55GX6IuR6KKB6L2F6YGg76eG6Zmi6aGY6bSb5pyI6LaK6Yme5L2N5YGJ5YOe5Y2x5ZyN5aeU5aiB5bCJ5oWw5pqQ5rit54iy55GL57ev6IOD6JCO6JGm6JS/6J2f6KGb6KSY6KyC6YGV6Z+L6a2P5Lmz5L6R5YSS5YWq76eH5ZSv5Zap5a265a6l5bm85bm95bq+5oKg5oOf5oSI5oSJ5o+E5pS45pyJ76eI5p+U5p+a76eJ5qWh5qWi5rK55rSn76eK5ri476eLXCJdLFxuW1wiZWJhMVwiLFwi5r+h54y254y376eM55Gc55Sx76eN55mS76eO76eP57at6Ie+6JC46KOV6KqY6Kub6Kut6Liw6LmC6YGK6YC+6YG66YWJ6YeJ6Y2u76eQ76eR5aCJ76eS5q+T6IKJ6IKy76eT76eU5YWB5aWr5bC576eV76eW5r2k546n6IOk6LSH76eX6YiX6ZaP76eY76eZ76ea76eb6IG/5oiO54Cc57Wo6J6N76ec5Z6g5oGp5oWH5q636Kq+6YqA6Zqx5LmZ5ZCf5rer6JSt6Zmw6Z+z6aOu5o+W5rOj6YKR5Yed5oeJ6Ia66be55L6d5YCa5YSA5a6c5oSP5oe/5pOs5qSF5q+F55aR55+j576p6Imk6JaP6J+76KGj6Kq8XCJdLFxuW1wiZWNhMVwiLFwi6K2w6Yar5LqM5Lul5LyK76ed76ee5aS35aeo76ef5bey5byb5b2b5oCh76eg76eh76ei76ej54i+54+l76ek55Ww55eN76el56e776em6ICM6ICz6IKE6Iuh6I2R76en76eo6LK96LKz6YKH76ep76eq6aO06aSM76er76es54C355uK57+K57+M57+86Kya5Lq65LuB5YiD5Y2w76et5ZK95Zug5ae75a+F5byV5b+N5rmu76eu76ev57Wq6Iy176ew6JqT6KqN76ex6Z2t6Z2376ey76ez5LiA5L2a5L2+5aO55pel5rqi6YC46Y6w6aa55Lu75aOs5aaK5aeZ5oGB76e076e156iU76e26I2P6LOD5YWl5Y2EXCJdLFxuW1wiZWRhMVwiLFwi76e376e476e55LuN5Ymp5a2V6Iq/5LuU5Yi65ZKo5aeJ5ae/5a2Q5a2X5a2c5oGj5oWI5ruL54KZ54Wu546G55O355a156OB57Sr6ICF6Ieq6Iyo6JSX6JeJ6Kuu6LOH6ZuM5L2c5Yu65Zq85par5pio54G854K454i157a96IqN6YWM6ZuA6bWy5a2x5qOn5q6Y5r2655ue5bKR5pqr5r2b566057Cq6KC26Zuc5LiI5LuX5Yyg5aC05aK75aOv5aWs5bCH5biz5bqE5by15o6M5pqy5p2W5qif5qqj5qyM5ry/54mG76e6542Q55KL56ug57Kn6IW46Ief6Ien6I6K6JGs6JSj6JaU6JeP6KOd6LST6Yas6ZW3XCJdLFxuW1wiZWVhMVwiLFwi6Zqc5YaN5ZOJ5Zyo5a6w5omN5p2Q5qC95qKT5ri95ruT54G957ih6KOB6LKh6LyJ6b2L6b2O54it566P6KuN6Yya5L2H5L2O5YSy5ZKA5aeQ5bqV5oq15p215qWu5qiX5rKu5ria54uZ54yq55a9566457S16Iun6I+56JGX6Je36Kmb6LKv6LqH6YCZ6YK46ZuO6b2f5Yuj5ZCK5auh5a+C5pGY5pW15ru054uE76e755qE56mN56yb57GN57i+57+f6I276Kyr6LOK6LWk6Leh6Lmf6L+q6L+56YGp6Y+R5L2D5L265YKz5YWo5YW45YmN5Ymq5aGh5aG85aWg5bCI5bGV5bub5oKb5oiw5qCT5q6/5rCI5r6xXCJdLFxuW1wiZWZhMVwiLFwi54WO55Cg55Sw55S455WR55my562M566L566t56+G57qP6Kmu6Ly+6L2J6Yi/6YqT6Yyi6ZCr6Zu76aGa6aGr6aSe5YiH5oiq5oqY5rWZ55mk56uK56+A57W25Y2g5bK+5bqX5ry454K557KY6ZyR6a6O6bue5o6l5pG66J225LiB5LqV5Lqt5YGc5YG15ZGI5aeD5a6a5bmA5bqt5bu35b6B5oOF5oy65pS/5pW05peM5pm25pm45p++5qWo5qqJ5q2j5rGA5reA5reo5rif5rme54Ce54Kh546O54+955S6552b56KH56aO56iL56m957K+57aO6ImH6KiC6Kuq6LKe6YSt6YWK6YeY6Ymm6YuM6Yyg6ZyG6Z2WXCJdLFxuW1wiZjBhMVwiLFwi6Z2c6aCC6byO5Yi25YqR5ZW85aCk5bid5byf5oKM5o+Q5qKv5r+f56Wt56ys6IeN6Ja66KO96Ku46LmE6YaN6Zmk6Zqb6Zy96aGM6b2K5L+O5YWG5YeL5Yqp5Ziy5byU5b2r5o6q5pON5pep5pmB5pu65pu55pyd5qKd5qOX5qe95ryV5r2u54Wn54el54iq55Kq55y656WW56Wa56ef56ig56qV57KX57Of57WE57mw6IKH6Je76Jqk6KmU6Kq/6LaZ6LqB6YCg6YGt6Yej6Zi76ZuV6bOl5peP57CH6Laz6Y+D5a2Y5bCK5Y2S5ouZ54yd5YCn5a6X5b6e5oKw5oWr5qOV5reZ55Cu56iu57WC57ac57ix6IWrXCJdLFxuW1wiZjFhMVwiLFwi6Liq6Li16Y2+6ZCY5L2Q5Z2Q5bem5bqn5oyr572q5Li75L2P5L6P5YGa5aed6IOE5ZGq5ZGo5Ze+5aWP5a6Z5bee5bua5pmd5pyx5p+x5qCq5rOo5rSy5rmK5r6N54K354+g55aH57GM57SC57Ss57ai6Iif6Jub6Ki76KqF6LWw6LqK6Lyz6YCx6YWO6YWS6ZGE6aeQ56u557Kl5L+K5YSB5YeG5Z+I5a+v5bO75pmZ5qi95rWa5rqW5r+s54SM55Wv56uj6KCi6YCh6YG16ZuL6ae/6IyB5Lit5Luy6KGG6YeN5Y295qub5qWr5rGB6JG65aKe5oaO5pu+5ouv54Od55SR55eH57mS6JK46K2J6LSI5LmL5Y+qXCJdLFxuW1wiZjJhMVwiLFwi5ZKr5Zyw5Z2A5b+X5oyB5oyH5pGv5pSv5peo5pm65p6d5p6z5q2i5rGg5rKa5rys55+l56Cl56WJ56WX57SZ6IKi6ISC6Iez6Iqd6Iq36JyY6KqM76e86LSE6La+6YGy55u056iZ56i357mU6IG35ZSH5ZeU5aG15oyv5pCi5pmJ5pmL5qGt5qab5q6E5rSl5rqx54+N55Go55Kh55Wb55a555uh55ye556L56em57iJ57id6Ie76JSv6KKX6Ki66LOR6Lur6L6w6YCy6Y6t6Zmj6Zmz6ZyH5L6E5Y+x5aeq5auJ5biZ5qGO55OG55a+56ep56qS6Iaj6Jut6LOq6LeM6L+t5paf5pyV76e95Z+35r2X57ed6LyvXCJdLFxuW1wiZjNhMVwiLFwi6Y+26ZuG5b615oey5r6E5LiU5L6Y5YCf5Y+J5Zef5bWv5beu5qyh5q2k56OL566a76e+6LmJ6LuK6YGu5o2J5pC+552A56qE6Yyv6ZG/6b2q5pKw5r6v54em55Ko55Oa56uE57CS57qC57Ky57qY6K6a6LSK6ZG96aSQ6aWM5Yi55a+f5pOm5pyt57Su5YOt5Y+D5aG55oWY5oWZ5oe65pas56uZ6K6S6K6W5YCJ5YCh5Ym15ZSx5ai85bug5b2w5oS05pWe5piM5pi25pqi5qeN5ruE5ryy54yW55ih56qT6IS56ImZ6I+W6JK85YK15Z+w5a+A5a+o5b2p5o6h56Cm57a16I+c6JSh6YeH6Ye15YaK5p+1562WXCJdLFxuW1wiZjRhMVwiLFwi6LKs5YeE5aa75oK96JmV5YCc76e/5YmU5bC65oW95oia5ouT5pOy5pal5ruM55ig6ISK6Lmg6Zmf6Zq75Luf5Y2D5ZaY5aSp5bed5pOF5rOJ5re6546U56m/6Iib6Jam6LOk6LiQ6YG36Yen6Zeh6Zih6Z+G5Ye45ZOy5ZaG5b655pKk5r6I57a06Lyf6L2N6ZC15YOJ5bCW5rK+5re755Sb556757C957Gk6Km56KuC5aCe5aa+5biW5o2354mS55aK552r6Kuc6LK86LyS5buz5pm05re46IG96I+B6KuL6Z2R6a+W76iA5YmD5pu/5raV5ruv57eg6Kum6YCu6YGe6auU5Yid5Ym/5ZOo5oaU5oqE5oub5qKiXCJdLFxuW1wiZjVhMVwiLFwi5qSS5qWa5qi154KS54Sm56Gd56SB56SO56eS56iN6IKW6Im46IuV6I2J6JWJ6LKC6LaF6YWi6YaL6Yau5L+D5ZuR54et55+X6JyA6Ke45a+45b+W5p2R6YKo5Y+i5aGa5a+15oKk5oaB5pGg57i96IGw6JSl6YqD5pKu5YKs5bSU5pyA5aKc5oq95o6o5qSO5qW45qie5rmr55q656eL6Iq76JCp6KuP6Lao6L+96YSS6YWL6Yac6YyQ6YyY6Y6a6Zub6ai26bCN5LiR55Wc56Wd56u6562R56+J57iu6JOE6LmZ6Lm06Lu46YCQ5pil5qS/55GD5Ye65pyu6buc5YWF5b+g5rKW6J+y6KGd6KG35oK06Ia16JCDXCJdLFxuW1wiZjZhMVwiLFwi6LSF5Y+W5ZC55Zi05ai25bCx54KK57+g6IGa6ISG6Iet6Laj6YaJ6amf6bey5YG05LuE5Y6g5oO75ris5bGk5L6I5YCk5Zek5bOZ5bmf5oGl5qKU5rK75reE54a+55eU55e055mh56ia56mJ57eH57e7572u6Ie06Jqp6Lyc6ZuJ6aaz6b2S5YmH5YuF6aOt6Kaq5LiD5p+S5ryG5L615a+i5p6V5rKI5rW455Cb56Cn6Yed6Y286J+E56ek56ix5b+r5LuW5ZKk5ZS+5aKu5aal5oOw5omT5ouW5py25qWV6Ii16ZmA6aax6aed5YCs5Y2T5ZWE5Z2876iB5omY76iC5pOi5pmr5p+d5r+B5r+v55Ci55C46KiXXCJdLFxuW1wiZjdhMVwiLFwi6ZC45ZGR5ZiG5Z2m5b2I5oaa5q2O54GY54Kt57a76KqV5aWq6ISr5o6i55yI6IC96LKq5aGU5pCt5qa75a6V5biR5rmv76iD6JWp5YWM5Y+w5aSq5oCg5oWL5q6G5rGw5rOw56ye6IOO6IuU6LeG6YKw6aKx76iE5pOH5r6k5pKR5pSE5YWO5ZCQ5Zyf6KiO5oWf5qG276iF55eb562S57Wx6YCa5aCG5qeM6IW/6KSq6YCA6aC55YG45aWX5aas5oqV6YCP6ayq5oWd54m56ZeW5Z2h5amG5be05oqK5pKt5pO65p235rOi5rS+54is55C256C057236Iqt6Leb6aCX5Yik5Z2C5p2/54mI55Oj6LKp6L6m6YiRXCJdLFxuW1wiZjhhMVwiLFwi6Ziq5YWr5Y+t5o2M5L2p5ZSE5oKW5pWX5rKb5rW/54mM54u956iX6KaH6LKd5b2t5r6O54O56Iao5oSO5L6/5YGP5omB54mH56+H57eo57+p6YGN6Z6t6aiZ6LK25Z2q5bmz5p6w6JCN6KmV5ZCg5ayW5bmj5bui5byK5paD6IK66JS96ZaJ6Zmb5L2I5YyF5YyN5YyP5ZKG5ZO65ZyD5biD5oCW5oqb5oqx5o2V76iG5rOh5rWm55ax56Cy6IOe6ISv6Iue6JGh6JKy6KKN6KSS6YCL6Yuq6aO96a6R5bmF5pq05pud54CR54iG76iH5L+15Ym95b2q5oWT5p2T5qiZ5ryC55Oi56Wo6KGo6LG56aOH6aOE6amDXCJdLFxuW1wiZjlhMVwiLFwi5ZOB56if5qWT6Ku36LGK6aKo6aau5b285oqr55ay55qu6KKr6YG/6ZmC5Yy55by85b+F5rOM54+M55Wi55aL562G6Iu+6aad5LmP6YC85LiL5L2V5Y6m5aSP5buI5piw5rKz55GV6I236J2m6LOA6YGQ6Zye6bCV5aOR5a246JmQ6KyU6ba05a+S5oGo5oKN5pex5rGX5ryi5r6j54Ca572V57+w6ZaR6ZaS6ZmQ6Z+T5Ymy6L2E5Ye95ZCr5ZK45ZWj5ZaK5qq75ra157eY6Imm6Yqc6Zm36bm55ZCI5ZOI55uS6Juk6Zak6ZeU6Zmc5Lqi5LyJ5aeu5aum5be35oGS5oqX5p2t5qGB5rKG5riv57y46IKb6IiqXCJdLFxuW1wiZmFhMVwiLFwi76iI76iJ6aCF5Lql5YGV5ZKz5Z6T5aWa5a2p5a6z5oeI5qW35rW354Cj6J+56Kej6Kmy6Kun6YKC6aet6aq45Yq+5qC45YCW5bm45p2P6I2H6KGM5Lqr5ZCR5Zqu54+m6YSV6Z+/6aSJ6aWX6aaZ5ZmT5aKf6Jmb6Kix5oay5qu254276LuS5q2H6Zqq6amX5aWV54iA6LWr6Z2p5L+U5bO05bym5oe45pmb5rOr54Kr546E546554++55yp552N57WD57Wi57ij6Ii36KGS76iK6LOi6YmJ6aGv5a2R56m06KGA6aCB5auM5L+g5Y2U5aS+5bO95oy+5rW554u56ISF6ISH6I6i6YuP6aCw5Lqo5YWE5YiR5Z6LXCJdLFxuW1wiZmJhMVwiLFwi5b2i5rOC5ruO54CF54GQ54Kv54aS54+p55Gp6I2K6J6i6KGh6YCI6YKi6Y6j6aao5YWu5b2X5oOg5oWn5pqz6JWZ6LmK6Yav6Z6L5LmO5LqS5ZG85aOV5aO65aW95bK15byn5oi25omI5piK5pmn5q+r5rWp5reP5rmW5ru45r6U5r+g5r+p54Gd54uQ55Cl55Ga55Og55qT56Wc57OK57ie6IOh6Iqm6JGr6JK/6JmO6Jmf6J206K236LGq6Y6s6aCA6aGl5oOR5oiW6YW35ama5piP5re35ri+55C/6a2C5b+95oOa56yP5ZOE5byY5rGe5rOT5rSq54OY57SF6Jm56KiM6bS75YyW5ZKM5ayF5qi654Gr55W1XCJdLFxuW1wiZmNhMVwiLFwi56aN56a+6Iqx6I+v6Kmx6K2B6LKo6Z2076iL5pO05pSr56K656K756mr5Li45Zaa5aWQ5a6m5bm75oKj5o+b5q2h5pml5qGT5riZ54Wl55Kw57SI6YKE6amp6bCl5rS75ruR54y+6LGB6ZeK5Yew5bmM5b6o5oGN5oO25oSw5oWM5pmD5pmE5qal5rOB5rmf5ruJ5r2i54WM55Kc55qH56+B57Cn6I2S6J2X6YGR6ZqN6buD5Yyv5Zue5bu75b6K5oGi5oKU5oe35pmm5pyD5qqc5reu5r6u54Gw542q57mq6Ia+6Iy06JuU6Kqo6LOE5YqD542y5a6W5qmr6ZCE5ZOu5ZqG5a2d5pWI5paF5puJ5qKf5raN5reGXCJdLFxuW1wiZmRhMVwiLFwi54i76IK06YW16amN5L6v5YCZ5Y6a5ZCO5ZC85ZaJ5ZeF5bi/5b6M5py954Wm54+d6YCF5Yub5Yuz5aGk5aOO54SE54aP54e76Jaw6KiT5pqI6Jao5Zan5pqE54WK6JCx5Y2J5ZaZ5q+B5b2Z5b695o+u5pqJ54WH6Kux6Lyd6bq+5LyR5pC654OL55Wm6Jmn5oGk6K2O6be45YWH5Ye25YyI5rS26IO46buR5piV5qyj54KY55eV5ZCD5bG557SH6KiW5qyg5qy95q2G5ZC45oGw5rS957+V6IiI5YOW5Yee5Zac5Zmr5ZuN5aes5ayJ5biM5oaZ5oaY5oix5pme5pum54aZ54a554a654qn56an56iA576y6KmwXCJdXG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCIwXCIsXCJcXHUwMDAwXCIsMTI3XSxcbltcImExNDBcIixcIuOAgO+8jOOAgeOAgu+8juKAp++8m++8mu+8n++8ge+4sOKApuKApe+5kO+5ke+5ksK377mU77mV77mW77mX772c4oCT77ix4oCU77iz4pW077i077mP77yI77yJ77i177i2772b772d77i377i444CU44CV77i577i644CQ44CR77i777i844CK44CL77i977i+44CI44CJ77i/77mA44CM44CN77mB77mC44CO44CP77mD77mE77mZ77maXCJdLFxuW1wiYTFhMVwiLFwi77mb77mc77md77me4oCY4oCZ4oCc4oCd44Cd44Ce4oC14oCy77yD77yG77yK4oC7wqfjgIPil4vil4/ilrPilrLil47imIbimIXil4fil4bilqHilqDilr3ilrzjiqPihIXCr++/o++8v8uN77mJ77mK77mN77mO77mL77mM77mf77mg77mh77yL77yNw5fDt8Kx4oia77yc77ye77yd4omm4omn4omg4oie4omS4omh77miXCIsNCxcIu+9nuKIqeKIquKKpeKIoOKIn+KKv+OPkuOPkeKIq+KIruKIteKItOKZgOKZguKKleKKmeKGkeKGk+KGkOKGkuKGluKGl+KGmeKGmOKIpeKIo++8j1wiXSxcbltcImEyNDBcIixcIu+8vOKIle+5qO+8hO+/peOAku+/oO+/oe+8he+8oOKEg+KEie+5qe+5qu+5q+OPleOOnOOOneOOnuOPjuOOoeOOjuOOj+OPhMKw5YWZ5YWb5YWe5YWd5YWh5YWj5Zen55Op57OO4paBXCIsNyxcIuKWj+KWjuKWjeKWjOKWi+KWiuKWieKUvOKUtOKUrOKUpOKUnOKWlOKUgOKUguKWleKUjOKUkOKUlOKUmOKVrVwiXSxcbltcImEyYTFcIixcIuKVruKVsOKVr+KVkOKVnuKVquKVoeKXouKXo+KXpeKXpOKVseKVsuKVs++8kFwiLDksXCLihaBcIiw5LFwi44ChXCIsOCxcIuWNgeWNhOWNhe+8oVwiLDI1LFwi772BXCIsMjFdLFxuW1wiYTM0MFwiLFwi772X772Y772Z772azpFcIiwxNixcIs6jXCIsNixcIs6xXCIsMTYsXCLPg1wiLDYsXCLjhIVcIiwxMF0sXG5bXCJhM2ExXCIsXCLjhJBcIiwyNSxcIsuZy4nLisuHy4tcIl0sXG5bXCJhM2UxXCIsXCLigqxcIl0sXG5bXCJhNDQwXCIsXCLkuIDkuZnkuIHkuIPkuYPkuZ3kuobkuozkurrlhL/lhaXlhavlh6DliIDliIHlipvljJXljYHljZzlj4jkuInkuIvkuIjkuIrkuKvkuLjlh6HkuYXkuYjkuZ/kuZ7kuo7kuqHlhYDliIPli7rljYPlj4nlj6PlnJ/lo6vlpJXlpKflpbPlrZDlrZHlrZPlr7jlsI/lsKLlsLjlsbHlt53lt6Xlt7Hlt7Llt7Plt77lubLlu77lvIvlvJPmiY1cIl0sXG5bXCJhNGExXCIsXCLkuJHkuJDkuI3kuK3kuLDkuLnkuYvlsLnkuojkupHkupXkupLkupTkuqLku4Hku4Dku4Pku4bku4fku43ku4rku4vku4TlhYPlhYHlhaflha3lha7lhazlhpflh7bliIbliIfliIjli7vli77li7/ljJbljLnljYjljYfljYXljZ7ljoTlj4vlj4rlj43lo6zlpKnlpKvlpKrlpK3lrZTlsJHlsKTlsLrlsa/lt7Tlubvlu7/lvJTlvJXlv4PmiIjmiLbmiYvmiY7mlK/mlofmlpfmlqTmlrnml6Xmm7DmnIjmnKjmrKDmraLmrbnmr4vmr5Tmr5vmsI/msLTngavniKrniLbniLvniYfniZnniZvniqznjovkuJlcIl0sXG5bXCJhNTQwXCIsXCLkuJbkuJXkuJTkuJjkuLvkuY3kuY/kuY7ku6Xku5jku5Tku5Xku5bku5fku6Pku6Tku5nku57lhYXlhYTlhonlhorlhqzlh7nlh7rlh7jliIrliqDlip/ljIXljIbljJfljJ3ku5/ljYrljYnljaHljaDlja/lja7ljrvlj6/lj6Tlj7Plj6zlj67lj6nlj6jlj7zlj7jlj7Xlj6vlj6blj6rlj7Llj7Hlj7Dlj6Xlj63lj7vlm5vlm5rlpJZcIl0sXG5bXCJhNWExXCIsXCLlpK7lpLHlpbTlpbblrZXlroPlsLzlt6jlt6flt6bluILluIPlubPlubzlvIHlvJjlvJflv4XmiIrmiZPmiZTmiZLmiZHmlqXml6bmnK7mnKzmnKrmnKvmnK3mraPmr43msJHmsJDmsLjmsYHmsYDmsL7niq/njoTnjonnk5znk6bnlJjnlJ/nlKjnlKnnlLDnlLHnlLLnlLPnlovnmb3nmq7nmr/nm67nn5vnn6Lnn7PnpLrnpr7nqbTnq4vkuJ7kuJ/kuZLkuZPkuankupnkuqTkuqbkuqXku7/kvInkvJnkvIrkvJXkvI3kvJDkvJHkvI/ku7Lku7bku7vku7Dku7Pku73kvIHkvIvlhYnlhYflhYblhYjlhahcIl0sXG5bXCJhNjQwXCIsXCLlhbHlho3lhrDliJfliJHliJLliI7liJbliqPljIjljKHljKDljbDljbHlkInlkI/lkIzlkIrlkJDlkIHlkIvlkITlkJHlkI3lkIjlkIPlkI7lkIblkJLlm6Dlm57lm53lnLPlnLDlnKjlnK3lnKzlnK/lnKnlpJnlpJrlpLflpLjlpoTlpbjlpoPlpb3lpbnlpoLlpoHlrZflrZjlroflrojlroXlronlr7rlsJblsbnlt57luIblubblubRcIl0sXG5bXCJhNmExXCIsXCLlvI/lvJvlv5nlv5bmiI7miIzmiI3miJDmiaPmiZvmiZjmlLbml6nml6jml6zml63mm7Lmm7PmnInmnL3mnLTmnLHmnLXmrKHmraTmrbvmsJbmsZ3msZfmsZnmsZ/msaDmsZDmsZXmsaHmsZvmsY3msY7ngbDniZ/niZ3nmb7nq7nnsbPns7jnvLbnvornvr3ogIHogIPogIzogJLogLPogb/ogonogovogozoh6Poh6roh7Poh7zoiIzoiJvoiJ/oia7oibLoib7omavooYDooYzooaPopb/pmKHkuLLkuqjkvY3kvY/kvYfkvZfkvZ7kvLTkvZvkvZXkvLDkvZDkvZHkvL3kvLrkvLjkvYPkvZTkvLzkvYbkvaNcIl0sXG5bXCJhNzQwXCIsXCLkvZzkvaDkvK/kvY7kvLbkvZnkvZ3kvYjkvZrlhYzlhYvlhY3lhbXlhrblhrfliKXliKTliKnliKrliKjliqvliqnliqrliqzljKPljbPljbXlkJ3lkK3lkJ7lkL7lkKblkY7lkKflkYblkYPlkLPlkYjlkYLlkJvlkKnlkYrlkLnlkLvlkLjlkK7lkLXlkLblkKDlkLzlkYDlkLHlkKvlkJ/lkKzlm6rlm7Dlm6Tlm6vlnYrlnZHlnYDlnY1cIl0sXG5bXCJhN2ExXCIsXCLlnYflnY7lnL7lnZDlnY/lnLvlo6/lpL7lpp3lppLlpqjlpp7lpqPlppnlppblpo3lpqTlppPlporlpqXlrZ3lrZzlrZrlrZvlrozlrovlro/lsKzlsYDlsYHlsL/lsL7lspDlspHlspTlsozlt6vluIzluo/luofluorlu7flvITlvJ/lvaTlvaLlvbflvbnlv5jlv4zlv5flv43lv7Hlv6vlv7jlv6rmiJLmiJHmioTmipfmipbmioDmibbmionmia3miormibzmib7mibnmibPmipLmia/mipjmia7mipXmipPmipHmiobmlLnmlLvmlLjml7Hmm7TmnZ/mnY7mnY/mnZDmnZHmnZzmnZbmnZ7mnYnmnYbmnaBcIl0sXG5bXCJhODQwXCIsXCLmnZPmnZfmraXmr4/msYLmsZ7mspnmsoHmsojmsonmsoXmspvmsarmsbrmspDmsbDmsozmsajmspbmspLmsb3msoPmsbLmsb7msbTmsobmsbbmso3mspTmspjmsoLngbbngbzngb3ngbjniaLniaHniaDni4Tni4LnjpbnlKznlKvnlLfnlLjnmoLnm6/nn6Pnp4Hnp4Dnpr/nqbbns7vnvZXogpbogpPogp3ogpjogpvogprogrLoia/oipJcIl0sXG5bXCJhOGExXCIsXCLoiovoio3opovop5LoqIDosLfosYbosZXosp3otaTotbDotrPouqvou4rovpvovrDov4Lov4bov4Xov4Tlt6HpgpHpgqLpgqrpgqbpgqPphYnph4bph4zpmLLpmK7pmLHpmKrpmKzkuKbkuZbkubPkuovkupvkup7kuqvkuqzkva/kvp3kvo3kvbPkvb/kvazkvpvkvovkvobkvoPkvbDkvbXkvojkvankvbvkvpbkvb7kvo/kvpHkvbrlhZTlhZLlhZXlhanlhbflhbblhbjlhr3lh73liLvliLjliLfliLrliLDliK7liLbliYHlir7lirvljZLljZTljZPljZHljabljbfljbjljbnlj5blj5Tlj5flkbPlkbVcIl0sXG5bXCJhOTQwXCIsXCLlkpblkbjlkpXlkoDlkbvlkbflkoTlkpLlkoblkbzlkpDlkbHlkbblkozlkprlkaLlkajlkovlkb3lko7lm7rlnoPlnbflnarlnanlnaHlnablnaTlnbzlpJzlpYnlpYflpYjlpYTlpZTlpr7lprvlp5Tlprnlpq7lp5Hlp4blp5Dlp43lp4vlp5Plp4rlpq/lprPlp5Llp4XlrZ/lraTlraPlrpflrprlrpjlrpzlrpnlrpvlsJrlsYjlsYVcIl0sXG5bXCJhOWExXCIsXCLlsYblsrflsqHlsrjlsqnlsqvlsrHlsrPluJjluJrluJbluJXluJvluJHlubjluprlupflupzlupXlupblu7blvKblvKflvKnlvoDlvoHlvb/lvbzlv53lv6Dlv73lv7Xlv7/mgI/mgJTmgK/mgLXmgJbmgKrmgJXmgKHmgKfmgKnmgKvmgJvmiJbmiJXmiL/miL7miYDmib/mi4nmi4zmi4Tmir/mi4Lmirnmi5Lmi5vmiqvmi5Pmi5Tmi4vmi4jmiqjmir3mirzmi5Dmi5nmi4fmi43mirXmi5rmirHmi5jmi5bmi5fmi4bmiqzmi47mlL7mlqfmlrzml7rmmJTmmJPmmIzmmIbmmILmmI7mmIDmmI/mmJXmmIpcIl0sXG5bXCJhYTQwXCIsXCLmmIfmnI3mnIvmna3mnovmnpXmnbHmnpzmnbPmnbfmnofmnp3mnpfmna/mnbDmnb/mnonmnb7mnpDmnbXmnprmnpPmnbzmnarmnbLmrKPmrabmrafmrb/msJPmsJvms6Pms6jms7PmsrHms4zms6XmsrPmsr3msr7msrzms6Lmsqvms5Xms5Pmsrjms4Tmsrnms4Hmsq7ms5fms4Xms7Hmsr/msrvms6Hms5vms4rmsqzms6/ms5zms5bms6BcIl0sXG5bXCJhYWExXCIsXCLngpXngo7ngpLngorngpnniKzniK3niLjniYjniafnianni4Dni47ni5nni5fni5Dnjqnnjqjnjp/njqvnjqXnlL3nlp3nlpnnlprnmoTnm4Lnm7Lnm7Tnn6Xnn73npL7npYDnpYHnp4nnp4jnqbrnqbnnq7rns77nvZTnvoznvovogIXogrrogqXogqLogrHogqHogqvogqnogrTogqrogq/oh6Xoh77oiI3oirPoip3oipnoiq3oir3oip/oirnoirHoiqzoiqXoiq/oirjoiqPoirDoir7oirfomY7ombHliJ3ooajou4vov47ov5Tov5HpgrXpgrjpgrHpgrbph4fph5HplbfploDpmJzpmYDpmL/pmLvpmYRcIl0sXG5bXCJhYjQwXCIsXCLpmYLpmrnpm6jpnZLpnZ7kup/kuq3kuq7kv6HkvrXkvq/kvr/kv6Dkv5Hkv4/kv53kv4Pkvrbkv5jkv5/kv4rkv5fkvq7kv5Dkv4Tkv4Lkv5rkv47kv57kvrflhZflhpLlhpHlhqDliY7liYPliYrliY3liYzliYvliYfli4fli4nli4Pli4HljI3ljZfljbvljprlj5vlkqzlk4Dlkqjlk47lk4nlkrjlkqblkrPlk4flk4Llkr3lkqrlk4FcIl0sXG5bXCJhYmExXCIsXCLlk4Tlk4jlkq/lkqvlkrHlkrvlkqnlkqflkr/lm7/lnoLlnovlnqDlnqPlnqLln47lnq7lnpPlpZXlpZHlpY/lpY7lpZDlp5zlp5jlp7/lp6Plp6jlqIPlp6Xlp6rlp5rlp6blqIHlp7vlranlrqPlrqblrqTlrqLlrqXlsIHlsY7lsY/lsY3lsYvls5nls5Llt7fluJ3luKXluJ/lub3luqDluqblu7rlvIjlvK3lvaXlvojlvoXlvorlvovlvoflvozlvonmgJLmgJ3mgKDmgKXmgI7mgKjmgY3mgbDmgajmgaLmgYbmgYPmgazmgavmgarmgaTmiYHmi5zmjJbmjInmi7zmi63mjIHmi67mi73mjIfmi7Hmi7dcIl0sXG5bXCJhYzQwXCIsXCLmi6/mi6zmi77mi7TmjJHmjILmlL/mlYXmlqvmlr3ml6LmmKXmmK3mmKDmmKfmmK/mmJ/mmKjmmLHmmKTmm7fmn7/mn5Pmn7Hmn5Tmn5Dmn6zmnrbmnq/mn7Xmn6nmn6/mn4Tmn5HmnrTmn5rmn6Xmnrjmn4/mn57mn7PmnrDmn5nmn6Lmn53mn5LmrarmroPmrobmrrXmr5Lmr5fmsJ/ms4nmtIvmtLLmtKrmtYHmtKXmtIzmtLHmtJ7mtJdcIl0sXG5bXCJhY2ExXCIsXCLmtLvmtL3mtL7mtLbmtJvms7XmtLnmtKfmtLjmtKnmtK7mtLXmtI7mtKvngqvngrrngrPngqzngq/ngq3ngrjngq7ngqTniLDnibLnia/nibTni6nni6Dni6Hnjrfnj4rnjrvnjrLnj43nj4DnjrPnlJrnlK3nlY/nlYznlY7nlYvnlqvnlqTnlqXnlqLnlqPnmbjnmobnmofnmojnm4jnm4bnm4Pnm4XnnIHnm7nnm7jnnInnnIvnm77nm7znnIfnn5znoILnoJTnoIznoI3npYbnpYnnpYjnpYfnprnnprrnp5Hnp5Lnp4vnqb/nqoHnq7/nq73nsb3ntILntIXntIDntInntIfntITntIbnvLjnvo7nvr/ogIRcIl0sXG5bXCJhZDQwXCIsXCLogJDogI3ogJHogLbog5bog6Xog5rog4Pog4Tog4zog6Hog5vog47og57og6Tog53oh7ToiKLoi6fojIPojIXoi6Poi5voi6bojIToi6XojILojInoi5Loi5foi7HojIHoi5zoi5Toi5Hoi57oi5Poi5/oi6/ojIbomZDombnombvombrooY3ooavopoHop5ToqIjoqILoqIPosp7osqDotbTotbPotrTou43ou4zov7Dov6bov6Lov6rov6VcIl0sXG5bXCJhZGExXCIsXCLov63ov6vov6Tov6jpg4rpg47pg4Hpg4PphYvphYrph43ploLpmZDpmYvpmYzpmY3pnaLpnanpn4vpn63pn7PpoIHpoqjpo5vpo5/pppbpppnkuZjkurPlgIzlgI3lgKPkv6/lgKblgKXkv7jlgKnlgJblgIblgLzlgJ/lgJrlgJLlgJHkv7rlgIDlgJTlgKjkv7HlgKHlgIvlgJnlgJjkv7Pkv67lgK3lgKrkv77lgKvlgInlhbzlhqTlhqXlhqLlh43lh4zlh4blh4vliZbliZzliZTliZvliZ3ljKrljb/ljp/ljp3lj5/lk6jllJDllIHllLflk7zlk6Xlk7LllIblk7rllJTlk6nlk63lk6HllInlk67lk6pcIl0sXG5bXCJhZTQwXCIsXCLlk6bllKfllIflk73llI/lnIPlnITln4Lln5Tln4vln4PloInlpI/lpZflpZjlpZrlqJHlqJjlqJzlqJ/lqJvlqJPlp6zlqKDlqKPlqKnlqKXlqIzlqInlravlsZjlrrDlrrPlrrblrrTlrq7lrrXlrrnlrrjlsITlsZHlsZXlsZDls63ls73ls7vls6rls6jls7Dls7bltIHls7Tlt67luK3luKvluqvluq3luqflvLHlvpLlvpHlvpDmgZlcIl0sXG5bXCJhZWExXCIsXCLmgaPmgaXmgZDmgZXmga3mganmga/mgoTmgp/mgprmgo3mgpTmgozmgoXmgpbmiYfmi7PmjIjmi7/mjY7mjL7mjK/mjZXmjYLmjYbmjY/mjYnmjLrmjZDmjL3mjKrmjKvmjKjmjY3mjYzmlYjmlYnmlpnml4Hml4XmmYLmmYnmmY/mmYPmmZLmmYzmmYXmmYHmm7jmnJTmnJXmnJfmoKHmoLjmoYjmoYbmoZPmoLnmoYLmoZTmoKnmorPmoJfmoYzmoZHmoL3mn7TmoZDmoYDmoLzmoYPmoKrmoYXmoJPmoJjmoYHmrormronmrrfmsKPmsKfmsKjmsKbmsKTms7DmtarmtpXmtojmtofmtabmtbjmtbfmtZnmtpNcIl0sXG5bXCJhZjQwXCIsXCLmtazmtonmta7mtZrmtbTmtanmtozmtormtbnmtoXmtaXmtpTng4rng5jng6Tng5nng4jng4/niLnnibnni7zni7nni73ni7jni7fnjobnj63nkInnj67nj6Dnj6rnj57nlZTnlZ3nlZznlZrnlZnnlr7nl4Xnl4fnlrLnlrPnlr3nlrznlrnnl4LnlrjnmovnmrDnm4rnm43nm47nnKnnnJ/nnKDnnKjnn6nnoLDnoKfnoLjnoJ3noLTnoLdcIl0sXG5bXCJhZmExXCIsXCLnoKXnoK3noKDnoJ/noLLnpZXnpZDnpaDnpZ/npZbnpZ7npZ3npZfnpZrnp6Tnp6Pnp6fnp5/np6bnp6nnp5jnqoTnqojnq5nnrIbnrJHnsonntKHntJfntIvntIrntKDntKLntJTntJDntJXntJrntJzntI3ntJnntJvnvLrnvZ/nvpTnv4Xnv4HogIbogJjogJXogJnogJfogL3ogL/og7HohILog7DohIXog63og7TohIbog7jog7PohIjog73ohIrog7zog6/oh63oh6zoiIDoiJDoiKroiKvoiKjoiKzoirvojKvojZLojZTojYrojLjojZDojYnojLXojLTojY/ojLLojLnojLbojJfojYDojLHojKjojYNcIl0sXG5bXCJiMDQwXCIsXCLomZTomoromqrompPomqTomqnomozomqPompzoobDoobfoooHoooLoob3oobnoqJjoqJDoqI7oqIzoqJXoqIroqJfoqJPoqJboqI/oqJHosYjosbrosbnosqHosqLotbfouqzou5Lou5Tou4/ovrHpgIHpgIbov7fpgIDov7rov7TpgIPov73pgIXov7jpgpXpg6Hpg53pg6LphZLphY3phYzph5jph53ph5fph5zph5nploPpmaLpmaPpmaFcIl0sXG5bXCJiMGExXCIsXCLpmZvpmZ3pmaTpmZjpmZ7pmrvpo6Lppqzpqqjpq5jprKXprLLprLzkub7lgbrlgb3lgZzlgYflgYPlgYzlgZrlgYnlgaXlgbblgY7lgZXlgbXlgbTlgbflgY/lgI/lga/lga3lhZzlhpXlh7Dliarlia/li5Lli5nli5jli5XljJDljI/ljJnljL/ljYDljL7lj4Pmm7zllYbllarllabllYTllZ7llaHllYPllYrllLHllZbllY/llZXllK/llaTllLjllK7llZzllKzllaPllLPllYHllZflnIjlnIvlnInln5/loIXloIrloIbln6Dln6Tln7rloILloLXln7fln7nlpKDlpaLlqLblqYHlqYnlqablqarlqYBcIl0sXG5bXCJiMTQwXCIsXCLlqLzlqaLlqZrlqYblqYrlrbDlr4flr4Xlr4Tlr4Llrr/lr4blsInlsIjlsIflsaDlsZzlsZ3ltIfltIbltI7ltJvltJbltKLltJHltKnltJTltJnltKTltKfltJflt6LluLjluLbluLPluLflurflurjlurblurXlur7lvLXlvLflvZflvazlvanlvavlvpflvpnlvp7lvpjlvqHlvqDlvpzmgb/mgqPmgonmgqDmgqjmg4vmgrTmg6bmgr1cIl0sXG5bXCJiMWExXCIsXCLmg4XmgrvmgrXmg5zmgrzmg5jmg5Xmg4bmg5/mgrjmg5rmg4fmiJrmiJvmiYjmjqDmjqfmjbLmjpbmjqLmjqXmjbfmjafmjpjmjqrmjbHmjqnmjonmjoPmjpvmjavmjqjmjoTmjojmjpnmjqHmjqzmjpLmjo/mjoDmjbvmjanmjajmjbrmlZ3mlZbmlZHmlZnmlZfllZ/mlY/mlZjmlZXmlZTmlpzmlpvmlqzml4/ml4vml4zml47mmZ3mmZrmmaTmmajmmabmmZ7mm7nli5fmnJvmooHmoq/moqLmopPmorXmob/mobbmorHmoqfmopfmorDmooPmo4Tmoq3moobmooXmopTmop3moqjmop/moqHmooLmrLLmrrpcIl0sXG5bXCJiMjQwXCIsXCLmr6vmr6zmsKvmto7mtrzmt7Pmt5nmtrLmt6Hmt4zmt6Tmt7vmt7rmuIXmt4fmt4vmtq/mt5Hmtq7mt57mt7nmtrjmt7fmt7Xmt4Xmt5LmuJrmtrXmt5rmt6vmt5jmt6rmt7Hmt67mt6jmt4bmt4Tmtqrmt6zmtr/mt6bng7nnhInnhIrng73ng6/niL3nib3nioHnjJznjJvnjJbnjJPnjJnnjofnkIXnkIrnkIPnkIbnj77nkI3nk6Dnk7ZcIl0sXG5bXCJiMmExXCIsXCLnk7fnlJznlKLnlaXnlabnlaLnlbDnlo/nl5Tnl5XnlrXnl4rnl43nmo7nm5Tnm5Lnm5vnnLfnnL7nnLznnLbnnLjnnLrnoavnoYPnoY7npaXnpajnpa3np7vnqpLnqpXnrKDnrKjnrJvnrKznrKbnrJnnrJ7nrK7nspLnspfnspXntYbntYPntbHntK7ntLnntLzntYDntLDntLPntYTntK/ntYLntLLntLHnvL3nvp7nvprnv4znv47nv5LogJzogYrogYbohK/ohJbohKPohKvohKnohLDohKToiILoiLXoiLfoiLboiLnojo7ojp7ojpjojbjojqLojpbojr3ojqvojpLojorojpPojonojqDojbfojbvojbxcIl0sXG5bXCJiMzQwXCIsXCLojobojqfomZXlvarom4fom4Domrbom4TomrXom4bom4vomrHomq/om4nooZPoop7ooojooqvoopLoopbooo3ooovoppPopo/oqKroqJ3oqKPoqKXoqLHoqK3oqJ/oqJvoqKLosYnosZrosqnosqzosqvosqjosqrosqfotafotabotr7otrrou5vou5/pgJnpgI3pgJrpgJfpgKPpgJ/pgJ3pgJDpgJXpgJ7pgKDpgI/pgKLpgJbpgJvpgJRcIl0sXG5bXCJiM2ExXCIsXCLpg6jpg63pg73phZfph47ph7Xph6bph6Pph6fph63ph6nplonpmarpmbXpmbPpmbjpmbDpmbTpmbbpmbfpmazpm4Dpm6rpm6nnq6Dnq5/poILpoIPprZrps6XpubXpub/puqXpurvlgqLlgo3lgoXlgpnlgpHlgoDlgpblgpjlgprmnIDlh7HlibLlibTlibXlianli57li53li5vljZrljqXllbvlloDllqfllbzllorllp3llpjlloLllpzllqrllpTllofllovlloPllrPllq7llp/llL7llrLllprllrvllqzllrHllb7llonllqvllpnlnI3loK/loKrloLTloKTloLDloLHloKHloJ3loKDlo7nlo7rlpaBcIl0sXG5bXCJiNDQwXCIsXCLlqbflqprlqb/lqpLlqpvlqqflrbPlrbHlr5Llr4zlr5Plr5DlsIrlsIvlsLHltYzltZDltLTltYflt73luYXluL3luYDluYPlub7lu4rlu4Hlu4Llu4TlvLzlva3lvqnlvqrlvqjmg5Hmg6HmgrLmgrbmg6DmhJzmhKPmg7rmhJXmg7Dmg7vmg7Tmhajmg7HmhI7mg7bmhInmhIDmhJLmiJ/miYnmjqPmjozmj4/mj4Dmj6nmj4nmj4bmj41cIl0sXG5bXCJiNGExXCIsXCLmj5Lmj6Pmj5Dmj6Hmj5bmj63mj67mjbbmj7Tmj6rmj5vmkZLmj5rmj7nmlZ7mlabmlaLmlaPmlpHmlpDmlq/mma7mmbDmmbTmmbbmma/mmpHmmbrmmb7mmbfmm77mm7/mnJ/mnJ3mo7rmo5Xmo6Dmo5jmo5fmpIXmo5/mo7Xmo67mo6fmo7nmo5Lmo7Lmo6Pmo4vmo43mpI3mpJLmpI7mo4nmo5rmpa7mo7vmrL7mrLrmrL3mrpjmrpbmrrzmr6/msK7msK/msKzmuK/muLjmuZTmuKHmuLLmuafmuYrmuKDmuKXmuKPmuJvmuZvmuZjmuKTmuZbmua7muK3muKbmua/muLTmuY3muLrmuKzmuYPmuJ3muL7mu4tcIl0sXG5bXCJiNTQwXCIsXCLmuonmuJnmuY7muaPmuYTmubLmuanmuZ/nhJnnhJrnhKbnhLDnhKHnhLbnha7nhJzniYznioTnioDnjLbnjKXnjLTnjKnnkLrnkKrnkLPnkKLnkKXnkLXnkLbnkLTnkK/nkJvnkKbnkKjnlKXnlKbnlavnlarnl6Lnl5vnl6Pnl5nnl5jnl57nl6DnmbvnmbznmpbnmpPnmrTnm5znnY/nn63noZ3noaznoa/nqI3nqIjnqIvnqIXnqIDnqphcIl0sXG5bXCJiNWExXCIsXCLnqpfnqpbnq6Xnq6PnrYnnrZbnrYbnrZDnrZLnrZTnrY3nrYvnrY/nrZHnsp/nsqXntZ7ntZDntajntZXntKvnta7ntbLntaHntabntaLntbDntbPlloTnv5Tnv5XogIvogZLogoXohZXohZTohYvohZHohY7ohLnohYbohL7ohYzohZPohbToiJLoiJzoj6nokIPoj7jokI3oj6Doj4XokIvoj4Hoj6/oj7Hoj7TokZfokIroj7DokIzoj4zoj73oj7Loj4rokLjokI7okIToj5zokIfoj5Toj5/omZvom5/om5nom63om5Tom5vom6Tom5Dom57ooZfoo4Hoo4LoorHopoPoppboqLvoqaDoqZXoqZ7oqLzoqYFcIl0sXG5bXCJiNjQwXCIsXCLoqZToqZvoqZDoqYboqLToqLroqLboqZbosaHosoLosq/osrzosrPosr3os4Hosrvos4DosrTosrfosrbosr/osrjotorotoXotoHot47ot53ot4vot5rot5Hot4zot5vot4bou7vou7jou7zovpzpgK7pgLXpgLHpgLjpgLLpgLbphILpg7XphInpg77phaPphaXph4/piJTpiJXpiKPpiInpiJ7piI3piJDpiIfpiJHplpTplo/plovplpFcIl0sXG5bXCJiNmExXCIsXCLplpPplpLplo7pmorpmo7pmovpmb3pmoXpmobpmo3pmbLpmoTpm4Hpm4Xpm4Tpm4bpm4fpm6/pm7Lpn4zpoIXpoIbpoIjpo6fpo6rpo6/po6npo7Lpo63ppq7ppq3pu4Ppu43pu5HkuoLlgq3lgrXlgrLlgrPlg4Xlgr7lgqzlgrflgrvlgq/lg4flib/libflib3li5/li6bli6Tli6Lli6PljK/ll5/ll6jll5Pll6bll47ll5zll4fll5Hll6Pll6Tll6/ll5rll6Hll4Xll4bll6Xll4nlnJLlnJPloZ7loZHloZjloZfloZrloZTloavloYzloa3loYrloaLloZLloYvlpaflq4Hlq4nlq4zlqr7lqr3lqrxcIl0sXG5bXCJiNzQwXCIsXCLlqrPlq4LlqrLltanlta/luYzlubnlu4nlu4jlvJLlvZnlvqzlvq7mhJrmhI/mhYjmhJ/mg7PmhJvmg7nmhIHmhIjmhY7mhYzmhYTmhY3mhL7mhLTmhKfmhI3mhIbmhLfmiKHmiKLmkJPmkL7mkJ7mkKrmkK3mkL3mkKzmkI/mkJzmkJTmkI3mkLbmkJbmkJfmkIbmlazmlp/mlrDmmpfmmonmmofmmojmmpbmmoTmmpjmmo3mnIPmppTmpa1cIl0sXG5bXCJiN2ExXCIsXCLmpZrmpbfmpaDmpZTmpbXmpLDmpoLmpYrmpajmpavmpZ7mpZPmpbnmpobmpZ3mpaPmpZvmrYfmrbLmr4Dmrr/mr5Pmr73muqLmuq/mu5Pmurbmu4LmupDmup3mu4fmu4XmuqXmupjmurzmurrmuqvmu5Hmupbmupzmu4Tmu5TmuqrmuqfmurTnhY7nhZnnhannhaTnhYnnhafnhZznhaznhabnhYznhaXnhZ7nhYbnhajnhZbniLrniZLnjLfnjYXnjL/njL7nka/nkZrnkZXnkZ/nkZ7nkYHnkL/nkZnnkZvnkZznlbbnlbjnmIDnl7DnmIHnl7Lnl7Hnl7rnl7/nl7Tnl7Pnm57nm5/nnZvnnavnnabnnZ7nnaNcIl0sXG5bXCJiODQwXCIsXCLnnbnnnarnnaznnZznnaXnnajnnaLnn67noo7norDnopfnopjnooznoonnobznopHnopPnob/npbrnpb/npoHokKznpr3nqJznqJrnqKDnqJTnqJ/nqJ7nqp/nqqDnrbfnr4DnraDnra7nrafnsrHnsrPnsrXntpPntbnntpHntoHnto/ntZvnva7nvannvarnvbLnvqnnvqjnvqTogZbogZjogobogoTohbHohbDohbjohaXoha7ohbPohatcIl0sXG5bXCJiOGExXCIsXCLohbnohbrohaboiIXoiYfokoLokbfokL3okLHokbXokabokavokYnokazokZvokLzokLXokaHokaPokanoka3okYbomZ7omZzomZ/om7nonJPonIjonIfonIDom77om7vonILonIPonIbonIrooZnoo5/oo5Too5noo5zoo5joo53oo6Hoo4roo5Xoo5Loppzop6PoqavoqbLoqbPoqaboqanoqbDoqofoqbzoqaPoqqDoqbHoqoXoqa3oqaLoqa7oqazoqbnoqbvoqL7oqajosaLosorosonos4ros4fos4jos4TosrLos4Pos4Los4Xot6Hot5/ot6jot6/ot7Pot7rot6rot6Tot6bourLovIPovInou77ovIpcIl0sXG5bXCJiOTQwXCIsXCLovp/ovrLpgYvpgYrpgZPpgYLpgZTpgLzpgZXpgZDpgYfpgY/pgY7pgY3pgZHpgL7pgYHphJLphJfphazpharphanph4npiLfpiZfpiLjpiL3piYDpiL7piZvpiYvpiaTpiZHpiLTpiYnpiY3piYXpiLnpiL/piZrplpjpmpjpmpTpmpXpm43pm4vpm4npm4rpm7fpm7vpm7npm7bpnZbpnbTpnbbpoJDpoJHpoJPpoIrpoJLpoIzpo7zpo7RcIl0sXG5bXCJiOWExXCIsXCLpo73po77pprPpprHpprTpq6Hps6npuoLpvI7pvJPpvKDlg6flg67lg6Xlg5blg63lg5rlg5Xlg4/lg5Hlg7Hlg47lg6nlhaLlh7PlioPlioLljLHljq3ll77lmIDlmJvlmJfll73lmJTlmIblmInlmI3lmI7ll7flmJblmJ/lmIjlmJDll7blnJjlnJblobXlob7looPlopPloorlobnlooXlob3lo73lpKXlpKLlpKTlparlpanlq6Hlq6blq6nlq5flq5blq5jlq6PlrbXlr57lr6flr6Hlr6Xlr6blr6jlr6Llr6Tlr5/lsI3lsaLltoTltofluZvluaPluZXluZfluZTlu5Plu5blvIrlvYblvbDlvrnmhYdcIl0sXG5bXCJiYTQwXCIsXCLmhL/mhYvmhbfmhaLmhaPmhZ/mhZrmhZjmhbXmiKrmkofmkZjmkZTmkqTmkbjmkZ/mkbrmkZHmkafmkLTmka3mkbvmlbLmlqHml5fml5bmmqLmmqjmmp3mppzmpqjmppXmp4Hmpq7mp5Pmp4vmppvmprfmprvmpqvmprTmp5Dmp43mpq3mp4zmpqbmp4PmpqPmrYnmrYzmsLPmvLPmvJTmu77mvJPmu7TmvKnmvL7mvKDmvKzmvI/mvILmvKJcIl0sXG5bXCJiYWExXCIsXCLmu7/mu6/mvIbmvLHmvLjmvLLmvKPmvJXmvKvmvK/mvojmvKrmu6zmvIHmu7Lmu4zmu7fnhpTnhpnnhb3nhornhoTnhpLniL7nipLnipbnjYTnjZDnkaTnkaPnkarnkbDnka3nlITnlpHnmKfnmI3nmIvnmInnmJPnm6Hnm6PnnoTnnb3nnb/nnaHno4Hnop/noqfnorPnoqnnoqPnpo7npo/npo3nqK7nqLHnqqrnqqnnq63nq6/nrqHnrpXnrovnrbXnrpfnrp3nrpTnro/nrrjnrofnroTnsrnnsr3nsr7ntrvntrDntpzntr3ntr7ntqDnt4rntrTntrLntrHntrrntqLntr/ntrXntrjntq3nt5Lnt4fntqxcIl0sXG5bXCJiYjQwXCIsXCLnvbDnv6Dnv6Hnv5/ogZ7ogZrogofohZDohoDoho/ohojohorohb/ohoLoh6foh7roiIfoiJToiJ7oiYvok4nokr/ok4bok4Tokpnokp7okrLokpzok4vokrjok4Dok5PokpDokrzok5Hok4ronL/onJzonLvonKLonKXonLTonJjonZXonLfonKnoo7PopILoo7Too7noo7joo73oo6jopJroo6/oqqboqozoqp7oqqPoqo3oqqHoqpPoqqRcIl0sXG5bXCJiYmExXCIsXCLoqqroqqXoqqjoqpjoqpHoqproqqfosaroso3osozos5Pos5Hos5LotavotpnotpXot7zovJTovJLovJXovJPovqPpgaDpgZjpgZzpgaPpgZnpgZ7pgaLpgZ3pgZvphJnphJjphJ7phbXphbjphbfphbTpibjpioDpioXpipjpipbpibvpipPpipzpiqjpibzpipHplqHplqjplqnplqPplqXplqTpmpnpmpzpmpvpm4zpm5LpnIDpnbzpnoXpn7bpoJfpoJjpoq/porHppIPppIXppIzppInpp4Hpqq/pqrDpq6bprYHprYLps7Tps7bps7PpurzpvLvpvYrlhITlhIDlg7vlg7Xlg7nlhILlhIjlhInlhIXlh5xcIl0sXG5bXCJiYzQwXCIsXCLliofliojlionlio3liorli7DljrLlmK7lmLvlmLnlmLLlmL/lmLTlmKnlmZPlmY7lmZflmbTlmLblmK/lmLDlooDlop/lop7lorPlopzloq7loqnloqblpa3lrInlq7vlrIvlq7XlrIzlrIjlr67lr6zlr6nlr6vlsaTlsaXltp3ltpTluaLluZ/luaHlu6Llu5rlu5/lu53lu6Plu6DlvYjlvbHlvrflvrXmhbbmhafmha7mhZ3mhZXmhoJcIl0sXG5bXCJiY2ExXCIsXCLmhbzmhbDmhavmhb7mhqfmhpDmhqvmho7mhqzmhprmhqTmhpTmhq7miK7mkanmka/mkbnmkp7mkrLmkojmkpDmkrDmkqXmkpPmkpXmkqnmkpLmkq7mkq3mkqvmkprmkqzmkpnmkqLmkrPmlbXmlbfmlbjmmq7mmqvmmrTmmrHmqKPmqJ/mp6jmqIHmqJ7mqJnmp73mqKHmqJPmqIrmp7PmqILmqIXmp63mqJHmrZDmrY7mrqTmr4Xmr4bmvL/mvbzmvoTmvZHmvabmvZTmvobmva3mvZvmvbjmva7mvo7mvbrmvbDmvaTmvpfmvZjmu5Xmva/mvaDmvZ/nhp/nhqznhrHnhqjniZbnipvnjY7njZfnkannkovnkoNcIl0sXG5bXCJiZDQwXCIsXCLnkb7nkoDnlb/nmKDnmKnnmJ/nmKTnmKbnmKHnmKLnmprnmrrnm6Tnno7nnofnnoznnpHnnovno4vno4Xnorrno4rnor7no5Xnorzno5DnqL/nqLznqYDnqL3nqLfnqLvnqq/nqq7nrq3nrrHnr4TnrrTnr4bnr4fnr4HnrqDnr4zns4rnt6Dnt7Tnt6/nt7vnt5jnt6znt53nt6jnt6Pnt5rnt57nt6nntp7nt5nnt7Lnt7nnvbXnvbfnvq9cIl0sXG5bXCJiZGExXCIsXCLnv6nogKbohpvohpzohp3ohqDohprohpjolJfolL3olJrok67olKzolK3olJPolJHolKPolKHolJTok6zolKXok7/olIbonoLonbTonbbonaDonabonbjonajonZnonZfonYzonZPooZvooZ3opJDopIfopJLopJPopJXopIroqrzoq5Loq4foq4ToqpXoq4voq7joqrLoq4noq4Loqr/oqrDoq5boq43oqrboqrnoq5vosYzosY7osazos6Dos57os6bos6Tos6zos63os6Los6Pos5zos6ros6Hota3otp/otqPouKvouJDouJ3ouKLouI/ouKnouJ/ouKHouJ7ourrovJ3ovJvovJ/ovKnovKbovKrovJzovJ5cIl0sXG5bXCJiZTQwXCIsXCLovKXpganpga7pgajpga3pgbfphLDphK3phKfphLHphofphonphovphoPpi4Xpirvpirfpi6rpiqzpi6Tpi4HpirPpirzpi5Lpi4fpi7DpirLplq3plrHpnITpnIbpnIfpnInpnaDpno3pnovpno/poKHpoKvpoJzporPppIrppJPppJLppJjpp53pp5Dpp5/pp5vpp5Hpp5Xpp5Lpp5npqrfpq67pq6/prKfprYXprYTprbfpra/ptIbptIlcIl0sXG5bXCJiZWExXCIsXCLptIPpuqnpur7pu47loqjpvZLlhJLlhJjlhJTlhJDlhJXlhoDlhqrlh53lipHlipPli7PlmZnlmavlmbnlmanlmaTlmbjlmarlmajlmaXlmbHlma/lmazlmaLlmbblo4Hlor7lo4flo4Xlpa7lrJ3lrLTlrbjlr7DlsI7lvYrmhrLmhpHmhqnmhormh43mhrbmhr7mh4rmh4jmiLDmk4Xmk4Hmk4vmkrvmkrzmk5rmk4Tmk4fmk4Lmk43mkr/mk5Lmk5Tmkr7mlbTmm4bmm4nmmrnmm4Tmm4fmmrjmqL3mqLjmqLrmqZnmqavmqZjmqLnmqYTmqaLmqaHmqYvmqYfmqLXmqZ/mqYjmrZnmrbfmsIXmv4LmvrHmvqFcIl0sXG5bXCJiZjQwXCIsXCLmv4PmvqTmv4HmvqfmvrPmv4DmvrnmvrbmvqbmvqDmvrTnhr7nh4nnh5Dnh5Lnh4jnh5Xnhrnnh47nh5nnh5znh4Pnh4TnjajnkpznkqPnkpjnkp/nkp7nk6LnlIznlI3nmLTnmLjnmLrnm6fnm6XnnqDnnp7nnp/nnqXno6jno5rno6zno6fnpqbnqY3nqY7nqYbnqYznqYvnqrrnr5nnsJHnr4nnr6Tnr5vnr6Hnr6nnr6bns5Xns5bnuIpcIl0sXG5bXCJiZmExXCIsXCLnuJHnuIjnuJvnuKPnuJ7nuJ3nuInnuJDnvbnnvrLnv7Dnv7Hnv67ogKjohrPohqnohqjoh7voiIjoiZjoiZnolYrolZnolYjolajolanolYPolYnola3olarolZ7onoPonp/onp7onqLono3ooaHopKropLLopKXopKvopKHopqropqboq6boq7roq6voq7HorIDoq5zoq6foq67oq77orIHorILoq7foq63oq7Poq7boq7zosavosa3ospPos7TouYTouLHouLTouYLouLnouLXovLvovK/ovLjovLPovqjovqbpgbXpgbTpgbjpgbLpgbzpgbrphLTphpLpjKDpjLbpi7jpjLPpjK/pjKLpi7zpjKvpjITpjJpcIl0sXG5bXCJjMDQwXCIsXCLpjJDpjKbpjKHpjJXpjK7pjJnplrvpmqfpmqjpmqrpm5XpnI7pnJHpnJbpnI3pnJPpnI/pnZvpnZzpnabpnpjpoLDpoLjpoLvpoLfpoK3poLnpoKTppJDppKjppJ7ppJvppKHppJrpp63pp6Lpp7Hpqrjpqrzpq7vpq63prKjprpHptJXptKPptKbptKjptJLptJvpu5jpu5Tpvo3pvpzlhKrlhJ/lhKHlhLLli7Xlmo7lmoDlmpDlmoXlmodcIl0sXG5bXCJjMGExXCIsXCLlmo/lo5Xlo5Plo5Hlo47lrLDlrKrlrKTlrbrlsLflsajltrzltrrltr3ltrjluavlvYzlvr3mh4nmh4Lmh4fmh6bmh4vmiLLmiLTmk47mk4rmk5jmk6Dmk7Dmk6bmk6zmk7Hmk6Lmk63mloLmloPmm5nmm5bmqoDmqpTmqoTmqqLmqpzmq5vmqqPmqb7mqpfmqpDmqqDmrZzmrq7mr5rmsIjmv5jmv7Hmv5/mv6Dmv5vmv6Tmv6vmv6/mvoDmv6zmv6Hmv6nmv5Xmv67mv7Dnh6fnh5/nh67nh6bnh6Xnh63nh6znh7Tnh6DniLXniYbnjbDnjbLnkqnnkrDnkqbnkqjnmYbnmYLnmYznm6rnnrPnnqrnnrDnnqxcIl0sXG5bXCJjMTQwXCIsXCLnnqfnnq3nn6/no7fno7rno7Tno6/npIHnpqfnpqrnqZfnqr/nsIfnsI3nr77nr7fnsIznr6Dns6Dns5zns57ns6Lns5/ns5nns53nuK7nuL7nuYbnuLfnuLLnuYPnuKvnuL3nuLHnuYXnuYHnuLTnuLnnuYjnuLXnuL/nuK/nvYTnv7Pnv7zogbHogbLogbDoga/ogbPoh4boh4Pohrroh4Loh4Dohr/ohr3oh4nohr7oh6joiInoibHolqpcIl0sXG5bXCJjMWExXCIsXCLoloTolb7olpzolpHolpTolq/olpvolofolqjoloromafon4Don5HonrPon5Lon4bonqvonrvonrron4jon4vopLvopLbopYTopLjopL3opqzorI7orJforJnorJvorIrorKDorJ3orITorJDosYHosL/osbPos7ros73os7zos7jos7votqjouYnouYvouYjouYrovYTovL7ovYLovYXovL/pgb/pgb3pgoTpgoHpgoLpgoDphLnphqPphp7phpzpjY3pjoLpjKjpjbXpjYrpjaXpjYvpjJjpjb7pjazpjZvpjbDpjZrpjZTpl4rpl4vpl4zpl4jpl4bpmrHpmrjpm5bpnJzpnJ7pnqDpn5PpoYbporbppLXpqIFcIl0sXG5bXCJjMjQwXCIsXCLpp7/prq7prqvprqrprq3ptLvptL/puovpu4/pu57pu5zpu53pu5vpvL7pvYvlj6LlmpXlmq7lo5nlo5jlrLjlvZ3mh6PmiLPmk7Tmk7Lmk77mlIbmk7rmk7vmk7fmlrfmm5zmnKbmqrPmqqzmq4Pmqrvmqrjmq4Lmqq7mqq/mrZ/mrbjmrq/ngInngIvmv77ngIbmv7rngJHngI/nh7vnh7znh77nh7jnjbfnjbXnkqfnkr/nlJXnmZbnmZhcIl0sXG5bXCJjMmExXCIsXCLnmZLnnr3nnr/nnrvnnrznpI7npq7nqaHnqaLnqaDnq4Tnq4XnsKvnsKfnsKrnsJ7nsKPnsKHns6fnuZTnuZXnuZ7nuZrnuaHnuZLnuZnnvYjnv7nnv7vogbfogbboh43oh4/oiIrol4/olqnol43ol5Dol4nolrDolrrolrnolqbon6/on6zon7Lon6DopoboprLop7TorKjorLnorKzorKvosZDotIXouZnouaPouabouaTouZ/ouZXou4DovYnovY3pgofpgoPpgojphqvphqzph5DpjpTpjorpjpbpjqLpjrPpjq7pjqzpjrDpjpjpjprpjpfpl5Tpl5bpl5Dpl5Xpm6Lpm5zpm5npm5vpm57pnKTpnqPpnqZcIl0sXG5bXCJjMzQwXCIsXCLpnq3pn7npoY3poY/poYzpoY7poZPporrppL7ppL/ppL3ppK7ppqXpqI7pq4HprIPprIbprY/prY7prY3pr4rpr4npr73pr4jpr4DptZHptZ3ptaDpu6DpvJXpvKzlhLPlmqXlo57lo5/lo6Llr7XpvpDlu6zmh7Lmh7fmh7bmh7XmlIDmlI/mm6Dmm53mq6Xmq53mq5rmq5PngJvngJ/ngKjngJrngJ3ngJXngJjniIbniI3niZjniqLnjbhcIl0sXG5bXCJjM2ExXCIsXCLnjbrnkr3nk4rnk6PnlofnlobnmZ/nmaHnn4fnpJnnprHnqavnqannsL7nsL/nsLjnsL3nsLfnsYDnuavnua3nubnnuannuarnvoXnubPnvrbnvrnnvrjoh5jol6nol53ol6rol5Xol6Tol6Xol7fon7vooIXooI3on7non77opaDopZ/opZbopZ7orYHorZzorZjorYnorZrorY7orY/orYborZnotIjotIroubzoubLouofoubbouazoubroubTovZTovY7ovq3pgorpgovphrHphq7pj6Hpj5Hpj5/pj4Ppj4jpj5zpj53pj5bpj6Lpj43pj5jpj6Tpj5fpj6jpl5zpmrTpm6PpnKrpnKfpnaHpn5zpn7vpoZ5cIl0sXG5bXCJjNDQwXCIsXCLpoZjpoZvporzppYXppYnpqJbpqJnprI3pr6jpr6fpr5bpr5vptonptaHptbLptarptazpupLpupfpupPpurTli7jlmqjlmrflmrblmrTlmrzlo6TlrYDlrYPlrb3lr7blt4nmh7jmh7rmlJjmlJTmlJnmm6bmnKfmq6zngL7ngLDngLLniJDnjbvnk4/nmaLnmaXnpKbnpKrnpKznpKvnq4fnq7bnsYznsYPnsY3ns6/ns7Dovq7nub3nubxcIl0sXG5bXCJjNGExXCIsXCLnuoLnvYzogIDoh5roiabol7vol7nomJHol7romIbomIvomIfomIrooJTooJXopaToprrop7jorbDorazorabora/orZ/oravotI/otI3ouonouoHouoXouoLphrTph4vpkJjpkIPpj73pl6HpnLDpo4TppZLppZHppqjpqKvpqLDpqLfpqLXpsJPpsI3pubnpurXpu6jpvK/pvZ/pvaPpvaHlhLflhLjlm4Hlm4Dlm4LlpJTlsazlt43mh7zmh77mlJ3mlJzmlpXmm6nmq7vmrITmq7rmrrLngYzniJvniqfnk5bnk5Tnmannn5PnsZDnuo/nuoznvrzomJfomK3omJrooKPooKLooKHooJ/oparopazopr3orbRcIl0sXG5bXCJjNTQwXCIsXCLorbforb3otJPouorouo3ouovovZ/ovq/phrrpkK7pkLPpkLXpkLrpkLjpkLLpkKvpl6LpnLjpnLnpnLLpn7/poafpoaXppZfpqYXpqYPpqYDpqL7pq4/prZTprZHpsK3psKXptq/ptrTpt4Lptrjpup3pu6/pvJnpvZzpvabpvaflhLzlhLvlm4jlm4rlm4nlrb/lt5Tlt5LlvY7mh7/mlKTmrIrmraHngZHngZjnjoDnk6Tnlornma7nmaxcIl0sXG5bXCJjNWExXCIsXCLnprPnsaDnsZ/ogb7ogb3oh5/opbLopa/op7zoroDotJbotJfoupHoupPovaHphYjpkYTpkZHpkZLpnL3pnL7pn4Ppn4HpoavppZXpqZXpqY3pq5LprJrpsYnpsLHpsL7psLvpt5Ppt5fpvLTpvazpvarpvpTlm4zlt5bmiIDmlKPmlKvmlKrmm6zmrJDnk5rnq4rnsaTnsaPnsaXnupPnupbnupToh6LomLjomL/ooLHororpgpDpgo/pkaPpkaDpkaTpnajpoa/ppZzpqZrpqZvpqZfpq5Ppq5Tpq5HpsZTpsZfpsZbpt6Xpup/pu7Tlm5Hlo6nmlKzngZ7nmbHnmbLnn5fnvZDnvojooLbooLnooaLorpPorpJcIl0sXG5bXCJjNjQwXCIsXCLorpboibfotJvph4DpkarpnYLpnYjpnYTpn4bpobDpqZ/prKLprZjpsZ/pt7npt7rpubzpub3pvIfpvbfpvbLlu7PmrJbngaPnsaznsa7ooLvop4DouqHph4HpkbLpkbDpobHppZ7pq5bprKPpu4zngaTnn5rorprpkbfpn4npqaLpqaXnupzorpzouqrph4Xpkb3pkb7pkbzpsbfpsbjpu7fosZTpkb/puJrniKjpqarprLHpuJvpuJ7nsbJcIl0sXG5bXCJjOTQwXCIsXCLkuYLkuZzlh7XljJrljoLkuIfkuIzkuYfkuo3lm5fvqIzlsa7lvbPkuI/lhofkuI7kuK7kupPku4Lku4nku4jlhpjli7zljazljrnlnKDlpIPlpKzlsJDlt7/ml6HmrrPmr4zmsJTniL/kuLHkuLzku6jku5zku6nku6Hku53ku5rliIzljJzljYzlnKLlnKPlpJflpK/lroHlroTlsJLlsLvlsbTlsbPluITluoDluoLlv4nmiInmiZDmsJVcIl0sXG5bXCJjOWExXCIsXCLmsLbmsYPmsL/msLvniq7nirDnjornprjogorpmJ7kvI7kvJjkvKzku7XkvJTku7HkvIDku7fkvIjkvJ3kvILkvIXkvKLkvJPkvITku7TkvJLlhrHliJPliInliJDliqbljKLljJ/ljY3ljorlkIflm6Hlm5/lnK7lnKrlnLTlpLzlpoDlpbzlpoXlpbvlpb7lpbflpb/lrZblsJXlsKXlsbzlsbrlsbvlsb7lt5/lubXluoTlvILlvJrlvbTlv5Xlv5Tlv4/miZzmiZ7miaTmiaHmiabmiaLmiZnmiaDmiZrmiaXml6/ml67mnL7mnLnmnLjmnLvmnLrmnL/mnLzmnLPmsJjmsYbmsZLmsZzmsY/msYrmsZTmsYtcIl0sXG5bXCJjYTQwXCIsXCLmsYzngbHniZ7nirTnirXnjo7nlKrnmb/nqbXnvZHoibjoibzoioDoib3oib/omY3opb7pgpnpgpfpgpjpgpvpgpTpmKLpmKTpmKDpmKPkvZbkvLvkvaLkvYnkvZPkvaTkvL7kvafkvZLkvZ/kvYHkvZjkvK3kvLPkvL/kvaHlho/lhrnliJzliJ7liKHliq3liq7ljInljaPljbLljo7ljo/lkLDlkLflkKrlkZTlkYXlkJnlkJzlkKXlkJhcIl0sXG5bXCJjYWExXCIsXCLlkL3lkY/lkYHlkKjlkKTlkYflm67lm6flm6XlnYHlnYXlnYzlnYnlnYvlnZLlpIblpYDlpqblppjlpqDlppflpo7lpqLlppDlpo/lpqflpqHlro7lrpLlsKjlsKrlso3lso/lsojlsovlsonlspLlsorlsoblspPlspXlt6DluIrluI7luovluonluozluojluo3lvIXlvJ3lvbjlvbblv5Llv5Hlv5Dlv63lv6jlv67lv7Plv6Hlv6Tlv6Plv7rlv6/lv7flv7vmgIDlv7TmiLrmioPmiozmio7mio/mipTmiofmibHmibvmibrmibDmioHmiojmibfmib3mibLmibTmlLfml7Dml7Tml7Pml7Lml7XmnYXmnYdcIl0sXG5bXCJjYjQwXCIsXCLmnZnmnZXmnYzmnYjmnZ3mnY3mnZrmnYvmr5DmsJnmsJrmsbjmsafmsavmsoTmsovmso/msbHmsa/msanmsprmsa3msofmspXmspzmsabmsbPmsaXmsbvmso7ngbTngbrniaPnir/nir3ni4Pni4bni4Hnirrni4XnjpXnjpfnjpPnjpTnjpLnlLrnlLnnlpTnlpXnmoHnpL3ogLTogpXogpnogpDogpLogpzoipDoio/oioXoio7oipHoipNcIl0sXG5bXCJjYmExXCIsXCLoioroioPoioTosbjov4novr/pgp/pgqHpgqXpgp7pgqfpgqDpmLDpmKjpmK/pmK3kuLPkvpjkvbzkvoXkvb3kvoDkvofkvbbkvbTkvonkvoTkvbfkvYzkvpfkvarkvprkvbnkvoHkvbjkvpDkvpzkvpTkvp7kvpLkvoLkvpXkvavkva7lhp7lhrzlhr7liLXliLLliLPliYbliLHlirzljIrljIvljLzljpLljpTlkoflkb/lkoHlkpHlkoLlkojlkavlkbrlkb7lkaXlkazlkbTlkablko3lka/lkaHlkaDlkpjlkaPlkaflkaTlm7flm7nlna/lnbLlna3lnavlnbHlnbDlnbblnoDlnbXlnbvlnbPlnbTlnaJcIl0sXG5bXCJjYzQwXCIsXCLlnajlnb3lpIzlpYXlprXlprrlp4/lp47lprLlp4zlp4Hlprblprzlp4Plp5blprHlpr3lp4Dlp4jlprTlp4flraLlraXlrpPlrpXlsYTlsYflsq7lsqTlsqDlsrXlsq/lsqjlsqzlsp/lsqPlsq3lsqLlsqrlsqflsp3lsqXlsrblsrDlsqbluJfluJTluJnlvKjlvKLlvKPlvKTlvZTlvoLlvb7lvb3lv57lv6XmgK3mgKbmgJnmgLLmgItcIl0sXG5bXCJjY2ExXCIsXCLmgLTmgIrmgJfmgLPmgJrmgJ7mgKzmgKLmgI3mgJDmgK7mgJPmgJHmgIzmgInmgJzmiJTmiL3miq3mirTmi5Hmir7miqrmirbmi4rmiq7mirPmiq/mirvmiqnmirDmirjmlL3mlqjmlrvmmInml7zmmITmmJLmmIjml7vmmIPmmIvmmI3mmIXml73mmJHmmJDmm7bmnIrmnoXmnazmno7mnpLmnbbmnbvmnpjmnobmnoTmnbTmno3mnozmnbrmnp/mnpHmnpnmnoPmnb3mnoHmnbjmnbnmnpTmrKXmroDmrb7mr57msJ3mspPms6zms6vms67ms5nmsrbms5Tmsq3ms6fmsrfms5Dms4Lmsrrms4Pms4bms63ms7JcIl0sXG5bXCJjZDQwXCIsXCLms5Lms53msrTmsormsp3msoDms57ms4DmtLDms43ms4fmsrDms7nms4/ms6nms5HngpTngpjngoXngpPngobngoTngpHngpbngoLngprngoPniarni5bni4vni5jni4nni5zni5Lni5Tni5rni4zni5HnjqTnjqHnjq3njqbnjqLnjqDnjqznjp3nk53nk6jnlL/nlYDnlL7nloznlpjnmq/nm7Pnm7Hnm7Dnm7Xnn7jnn7znn7nnn7vnn7pcIl0sXG5bXCJjZGExXCIsXCLnn7fnpYLnpL/np4Xnqbjnqbvnq7vnsbXns73ogLXogo/ogq7ogqPogrjogrXogq3oiKDoiqDoi4DoiqvoiproipjoipvoirXoiqfoiq7oirzoip7oirroirToiqjoiqHoiqnoi4LoiqToi4PoirboiqLombDoma/oma3oma7osZbov5Lov4vov5Pov43ov5bov5Xov5fpgrLpgrTpgq/pgrPpgrDpmLnpmL3pmLzpmLrpmYPkv43kv4Xkv5PkvrLkv4nkv4vkv4Hkv5Tkv5zkv5nkvrvkvrPkv5vkv4fkv5bkvrrkv4Dkvrnkv6zliYTliYnli4Dli4LljL3ljbzljpfljpbljpnljpjlkrrlkqHlkq3lkqXlk49cIl0sXG5bXCJjZTQwXCIsXCLlk4PojI3lkrflkq7lk5blkrblk4Xlk4blkqDlkbDlkrzlkqLlkr7lkbLlk57lkrDlnrXlnp7lnp/lnqTlnozlnpflnp3lnpvlnpTlnpjlno/lnpnlnqXlnprlnpXlo7TlpI3lpZPlp6Hlp57lp67lqIDlp7Hlp53lp7rlp73lp7zlp7blp6Tlp7Llp7flp5vlp6nlp7Plp7Xlp6Dlp77lp7Tlp63lrqjlsYzls5Dls5jls4zls5fls4vls5tcIl0sXG5bXCJjZWExXCIsXCLls57ls5rls4nls4fls4rls5bls5Pls5Tls4/ls4jls4bls47ls5/ls7jlt7nluKHluKLluKPluKDluKTlurDluqTluqLlupvluqPluqXlvIflvK7lvZblvobmgLfmgLnmgZTmgbLmgZ7mgYXmgZPmgYfmgYnmgZvmgYzmgYDmgYLmgZ/mgKTmgYTmgZjmgabmga7miYLmiYPmi4/mjI3mjIvmi7XmjI7mjIPmi6vmi7nmjI/mjIzmi7jmi7bmjIDmjJPmjJTmi7rmjJXmi7vmi7DmlYHmlYPmlqrmlr/mmLbmmKHmmLLmmLXmmJzmmKbmmKLmmLPmmKvmmLrmmJ3mmLTmmLnmmK7mnI/mnJDmn4Hmn7Lmn4jmnrpcIl0sXG5bXCJjZjQwXCIsXCLmn5zmnrvmn7jmn5jmn4Dmnrfmn4Xmn6vmn6Tmn5/mnrXmn43mnrPmn7fmn7bmn67mn6Pmn4Lmnrnmn47mn6fmn7DmnrLmn7zmn4bmn63mn4zmnq7mn6bmn5vmn7rmn4nmn4rmn4Pmn6rmn4vmrKjmroLmroTmrrbmr5bmr5jmr6DmsKDmsKHmtKjmtLTmtK3mtJ/mtLzmtL/mtJLmtIrms5rmtLPmtITmtJnmtLrmtJrmtJHmtIDmtJ3mtYJcIl0sXG5bXCJjZmExXCIsXCLmtIHmtJjmtLfmtIPmtI/mtYDmtIfmtKDmtKzmtIjmtKLmtInmtJDngrfngp/ngr7ngrHngrDngqHngrTngrXngqnniYHniYnniYrniaznibDnibPnia7ni4rni6Tni6jni6vni5/ni6rni6bni6PnjoXnj4znj4Lnj4jnj4XnjrnnjrbnjrXnjrTnj6vnjr/nj4fnjr7nj4Pnj4bnjrjnj4vnk6znk67nlK7nlYfnlYjnlqfnlqrnmbnnm4TnnIjnnIPnnITnnIXnnIrnm7fnm7vnm7rnn6fnn6jnoIbnoJHnoJLnoIXnoJDnoI/noI7noInnoIPnoJPnpYrnpYznpYvnpYXnpYTnp5Xnp43np4/np5bnp47nqoBcIl0sXG5bXCJkMDQwXCIsXCLnqb7nq5HnrIDnrIHnsbrnsbjnsbnnsb/nsoDnsoHntIPntIjntIHnvZjnvpHnvo3nvr7ogIfogI7ogI/ogJTogLfog5jog4fog6Dog5Hog4jog4Log5Dog4Xog6Pog5nog5zog4rog5Xog4nog4/og5fog6bog43oh7/oiKHoipToi5noi77oi7nojIfoi6jojIDoi5XojLroi6voi5boi7Toi6zoi6Hoi7Loi7XojIzoi7voi7boi7Doi6pcIl0sXG5bXCJkMGExXCIsXCLoi6Toi6Doi7roi7Poi63ombfombTombzombPooYHooY7ooafooarooanop5PoqIToqIfotbLov6Pov6Hov67ov6Dpg7Hpgr3pgr/pg5Xpg4Xpgr7pg4fpg4vpg4jph5Tph5PpmZTpmY/pmZHpmZPpmYrpmY7lgJ7lgIXlgIflgJPlgKLlgLDlgJvkv7Xkv7TlgLPlgLflgKzkv7bkv7flgJflgJzlgKDlgKflgLXlgK/lgLHlgI7lhZrlhpTlhpPlh4rlh4Tlh4Xlh4jlh47liaHliZrliZLliZ7liZ/liZXliaLli43ljI7ljp7llKblk6LllJfllJLlk6flk7Plk6TllJrlk7/llITllIjlk6vllJHllIXlk7FcIl0sXG5bXCJkMTQwXCIsXCLllIrlk7vlk7flk7jlk6DllI7llIPllIvlnIHlnILln4zloLLln5Xln5Llnrrln4blnr3lnrzlnrjlnrblnr/ln4fln5Dlnrnln4HlpI7lpYrlqJnlqJblqK3lqK7lqJXlqI/lqJflqIrlqJ7lqLPlrazlrqflrq3lrqzlsIPlsZblsZTls6zls7/ls67ls7Hls7fltIDls7nluKnluKjluqjluq7luqrluqzlvLPlvLDlvafmgZ3mgZrmgadcIl0sXG5bXCJkMWExXCIsXCLmgYHmgqLmgojmgoDmgpLmgoHmgp3mgoPmgpXmgpvmgpfmgofmgpzmgo7miJnmiYbmi7LmjJDmjZbmjKzmjYTmjYXmjLbmjYPmj6TmjLnmjYvmjYrmjLzmjKnmjYHmjLTmjZjmjZTmjZnmjK3mjYfmjLPmjZrmjZHmjLjmjZfmjYDmjYjmlYrmlYbml4bml4Pml4Tml4LmmYrmmZ/mmYfmmZHmnJLmnJPmoJ/moJrmoYnmoLLmoLPmoLvmoYvmoY/moJbmoLHmoJzmoLXmoKvmoK3moK/moY7moYTmoLTmoJ3moJLmoJTmoKbmoKjmoK7moY3moLrmoKXmoKDmrKzmrK/mrK3mrLHmrLTmra3ogoLmrojmr6bmr6RcIl0sXG5bXCJkMjQwXCIsXCLmr6jmr6Pmr6Lmr6fmsKXmtbrmtaPmtaTmtbbmtI3mtaHmtpLmtZjmtaLmta3mta/mtpHmto3mt6/mtb/mtobmtZ7mtafmtaDmtpfmtbDmtbzmtZ/mtoLmtpjmtK/mtajmtovmtb7mtoDmtoTmtJbmtoPmtbvmtb3mtbXmtpDng5zng5Png5Hng53ng4vnvLnng6Lng5fng5Lng57ng6Dng5Tng43ng4Xng4bng4fng5rng47ng6HniYLnibhcIl0sXG5bXCJkMmExXCIsXCLnibfnibbnjIDni7rni7Tni77ni7bni7Pni7vnjIHnj5Pnj5nnj6Xnj5bnjrznj6fnj6Pnj6nnj5znj5Lnj5vnj5Tnj53nj5rnj5fnj5jnj6jnk57nk5/nk7Tnk7XnlKHnlZvnlZ/nlrDnl4Hnlrvnl4Tnl4Dnlr/nlrbnlrrnmornm4nnnJ3nnJvnnJDnnJPnnJLnnKPnnJHnnJXnnJnnnJrnnKLnnKfnoKPnoKznoKLnoLXnoK/noKjnoK7noKvnoKHnoKnnoLPnoKrnoLHnpZTnpZvnpY/npZznpZPnpZLnpZHnp6vnp6znp6Dnp67np63np6rnp5znp57np53nqobnqonnqoXnqovnqoznqornqofnq5jnrJBcIl0sXG5bXCJkMzQwXCIsXCLnrITnrJPnrIXnrI/nrIjnrIrnrI7nrInnrJLnsoTnspHnsornsoznsojnso3nsoXntJ7ntJ3ntJHntI7ntJjntJbntJPntJ/ntJLntI/ntIznvZznvaHnvZ7nvaDnvZ3nvZvnvpbnvpLnv4Pnv4Lnv4DogJbogL7ogLnog7rog7Log7nog7XohIHog7vohIDoiIHoiK/oiKXojLPojK3ojYTojJnojZHojKXojZbojL/ojYHojKbojJzojKJcIl0sXG5bXCJkM2ExXCIsXCLojYLojY7ojJvojKrojIjojLzojY3ojJbojKTojKDojLfojK/ojKnojYfojYXojYzojZPojJ7ojKzojYvojKfojYjomZPomZLomqLomqjompbomo3ompHomp7omofompfomobomovompromoXomqXompnomqHomqfompXompjomo7omp3ompDompTooYPooYTooa3oobXoobboobLoooDoobHoob/ooa/oooPoob7oobToobzoqJLosYfosZfosbvosqTosqPotbbotbjotrXotrfotrbou5Hou5Pov77ov7XpgILov7/ov7vpgITov7zov7bpg5bpg6Dpg5npg5rpg6Ppg5/pg6Xpg5jpg5vpg5fpg5zpg6TphZBcIl0sXG5bXCJkNDQwXCIsXCLphY7phY/ph5Xph6Lph5rpmZzpmZ/pmrzpo6Ppq5/prK/kub/lgbDlgarlgaHlgZ7lgaDlgZPlgYvlgZ3lgbLlgYjlgY3lgYHlgZvlgYrlgaLlgJXlgYXlgZ/lganlgavlgaPlgaTlgYblgYDlga7lgbPlgZflgZHlh5Dliavlia3liazlia7li5bli5PljK3ljpzllbXllbbllLzllY3llZDllLTllKrllZHllaLllLbllLXllLDllZLllYVcIl0sXG5bXCJkNGExXCIsXCLllIzllLLllaXllY7llLnllYjllK3llLvllYDllYvlnIrlnIfln7vloJTln6Lln7bln5zln7TloIDln63ln73loIjln7jloIvln7Pln4/loIfln67ln6Pln7Lln6Xln6zln6HloI7ln7zloJDln6floIHloIzln7Hln6nln7DloI3loITlpZzlqaDlqZjlqZXlqaflqZ7lqLjlqLXlqa3lqZDlqZ/lqaXlqazlqZPlqaTlqZflqYPlqZ3lqZLlqYTlqZvlqYjlqo7lqL7lqY3lqLnlqYzlqbDlqanlqYflqZHlqZblqYLlqZzlrbLlra7lr4Hlr4DlsZnltJ7ltIvltJ3ltJrltKDltIzltKjltI3ltKbltKXltI9cIl0sXG5bXCJkNTQwXCIsXCLltLDltJLltKPltJ/ltK7luL7luLTlurHlurTlurnlurLlurPlvLblvLjlvpvlvpblvp/mgormgpDmgobmgr7mgrDmgrrmg5Pmg5Tmg4/mg6Tmg5nmg53mg4jmgrHmg5vmgrfmg4rmgr/mg4Pmg43mg4DmjLLmjaXmjormjoLmjb3mjr3mjp7mjq3mjp3mjpfmjqvmjo7mja/mjofmjpDmja7mjq/mjbXmjpzmja3mjq7mjbzmjqTmjLvmjp9cIl0sXG5bXCJkNWExXCIsXCLmjbjmjoXmjoHmjpHmjo3mjbDmlZPml43mmaXmmaHmmZvmmZnmmZzmmaLmnJjmobnmoofmopDmopzmoa3moa7moq7moqvmpZbmoa/moqPmoqzmoqnmobXmobTmorLmoo/mobfmopLmobzmoavmobLmoqrmooDmobHmob7mopvmopbmoovmoqDmoonmoqTmobjmobvmopHmoozmoormob3mrLbmrLPmrLfmrLjmrpHmro/mro3mro7mrozmsKrmt4DmtqvmtrTmtrPmubTmtqzmt6nmt6Lmtrfmt7bmt5TmuIDmt4jmt6Dmt5/mt5bmtr7mt6Xmt5zmt53mt5vmt7Tmt4rmtr3mt63mt7Dmtrrmt5Xmt4Lmt4/mt4lcIl0sXG5bXCJkNjQwXCIsXCLmt5Dmt7Lmt5Pmt73mt5fmt43mt6Pmtrvng7rnhI3ng7fnhJfng7TnhIzng7DnhITng7PnhJDng7zng7/nhIbnhJPnhIDng7jng7bnhIvnhILnhI7nib7nibvnibznib/njJ3njJfnjIfnjJHnjJjnjIrnjIjni7/njI/njJ7njojnj7bnj7jnj7XnkITnkIHnj73nkIfnkIDnj7rnj7znj7/nkIznkIvnj7TnkIjnlaTnlaPnl47nl5Lnl49cIl0sXG5bXCJkNmExXCIsXCLnl4vnl4znl5Hnl5Dnmo/nmonnm5PnnLnnnK/nnK3nnLHnnLLnnLTnnLPnnL3nnKXnnLvnnLXnoYjnoZLnoYnnoY3noYrnoYznoKbnoYXnoZDnpaTnpafnpannparnpaPnpavnpaHnprvnp7rnp7jnp7bnp7fnqo/nqpTnqpDnrLXnrYfnrLTnrKXnrLDnrKLnrKTnrLPnrJjnrKrnrJ3nrLHnrKvnrK3nrK/nrLLnrLjnrJrnrKPnspTnspjnspbnsqPntLXntL3ntLjntLbntLrntYXntKzntKnntYHntYfntL7ntL/ntYrntLvntKjnvaPnvpXnvpznvp3nvpvnv4rnv4vnv43nv5Dnv5Hnv4fnv4/nv4nogJ9cIl0sXG5bXCJkNzQwXCIsXCLogJ7ogJvogYfogYPogYjohJjohKXohJnohJvohK3ohJ/ohKzohJ7ohKHohJXohKfohJ3ohKLoiJHoiLjoiLPoiLroiLToiLLoibTojpDojqPojqjojo3ojbrojbPojqTojbTojo/ojoHojpXojpnojbXojpTojqnojb3ojoPojozojp3ojpvojqrojovojb7ojqXojq/ojojojpfojrDojb/ojqbojofojq7ojbbojpromZnomZbomr/omrdcIl0sXG5bXCJkN2ExXCIsXCLom4Lom4Hom4XomrromrDom4jomrnomrPomrjom4zomrTomrvomrzom4Pomr3omr7ooZLooonoopXooqjooqLooqrooproopHooqHoop/oopjooqfoopnoopvoopfooqTooqzooozoopPooo7opoLop5bop5nop5XoqLDoqKfoqKzoqJ7osLnosLvosZzosZ3osb3osqXotb3otbvotbnotrzot4Lotrnotr/ot4Hou5jou57ou53ou5zou5fou6Dou6HpgKTpgIvpgJHpgJzpgIzpgKHpg6/pg6rpg7Dpg7Tpg7Lpg7Ppg5Tpg6vpg6zpg6nphZbphZjphZrphZPphZXph6zph7Tph7Hph7Pph7jph6Tph7nph6pcIl0sXG5bXCJkODQwXCIsXCLph6vph7fph6jph67plbrplobplojpmbzpma3pmavpmbHpma/pmr/pnarpoITpo6XpppflgpvlgpXlgpTlgp7lgovlgqPlgoPlgozlgo7lgp3lgajlgpzlgpLlgoLlgoflhZ/lh5TljJLljJHljqTljqfllpHllqjllqXllq3llbflmYXllqLllpPllojllo/llrXlloHllqPllpLllqTllb3llozllqbllb/llpXllqHllo7lnIzloKnloLdcIl0sXG5bXCJkOGExXCIsXCLloJnloJ7loKfloKPloKjln7XloYjloKXloJzloJvloLPloL/loLbloK7loLnloLjloK3loKzloLvlpaHlqq/lqpTlqp/lqbrlqqLlqp7lqbjlqqblqbzlqqXlqqzlqpXlqq7lqLflqoTlqorlqpflqoPlqovlqqnlqbvlqb3lqozlqpzlqo/lqpPlqp3lr6rlr43lr4vlr5Tlr5Hlr4rlr47lsIzlsLDltLfltYPltavltYHltYvltL/ltLXltZHltY7ltZXltLPltLrltZLltL3ltLHltZnltYLltLnltYnltLjltLzltLLltLbltYDltYXluYTluYHlvZjlvqblvqXlvqvmg4nmgrnmg4zmg6Lmg47mg4TmhJRcIl0sXG5bXCJkOTQwXCIsXCLmg7LmhIrmhJbmhIXmg7XmhJPmg7jmg7zmg77mg4HmhIPmhJjmhJ3mhJDmg7/mhITmhIvmiYrmjpTmjrHmjrDmj47mj6Xmj6jmj6/mj4Pmkp3mj7Pmj4rmj6Dmj7bmj5Xmj7Lmj7XmkaHmj5/mjr7mj53mj5zmj4Tmj5jmj5Pmj4Lmj4fmj4zmj4vmj4jmj7Dmj5fmj5nmlLLmlafmlarmlaTmlZzmlajmlaXmlozmlp3mlp7mlq7ml5Dml5JcIl0sXG5bXCJkOWExXCIsXCLmmbzmmazmmbvmmoDmmbHmmbnmmarmmbLmnIHmpIzmo5PmpITmo5zmpKrmo6zmo6rmo7HmpI/mo5bmo7fmo6vmo6Tmo7bmpJPmpJDmo7Pmo6HmpIfmo4zmpIjmpbDmorTmpJHmo6/mo4bmpJTmo7jmo5Dmo73mo7zmo6jmpIvmpIrmpJfmo47mo4jmo53mo57mo6bmo7Tmo5HmpIbmo5Tmo6nmpJXmpKXmo4fmrLnmrLvmrL/mrLzmrpTmrpfmrpnmrpXmrr3mr7Dmr7Lmr7PmsLDmt7zmuYbmuYfmuJ/muYnmuojmuLzmuL3muYXmuaLmuKvmuL/muYHmuZ3mubPmuJzmuLPmuYvmuYDmuZHmuLvmuIPmuK7muZ5cIl0sXG5bXCJkYTQwXCIsXCLmuajmuZzmuaHmuLHmuKjmuaDmubHmuavmuLnmuKLmuLDmuZPmuaXmuKfmubjmuaTmubfmuZXmubnmuZLmuabmuLXmuLbmuZrnhKDnhJ7nhK/ng7vnhK7nhLHnhKPnhKXnhKLnhLLnhJ/nhKjnhLrnhJvniYvniZrniojnionniobnioXniovnjJLnjIvnjLDnjKLnjLHnjLPnjKfnjLLnjK3njKbnjKPnjLXnjIznkK7nkKznkLDnkKvnkJZcIl0sXG5bXCJkYWExXCIsXCLnkJrnkKHnkK3nkLHnkKTnkKPnkJ3nkKnnkKDnkLLnk7vnlK/nla/nlaznl6fnl5rnl6Hnl6bnl53nl5/nl6Tnl5fnmpXnmpLnm5rnnYbnnYfnnYTnnY3nnYXnnYrnnY7nnYvnnYznn57nn6znoaDnoaTnoaXnoZznoa3nobHnoarnoa7nobDnoannoajnoZ7noaLnpbTnpbPnpbLnpbDnqILnqIrnqIPnqIznqITnqpnnq6bnq6TnrYrnrLvnrYTnrYjnrYznrY7nrYDnrZjnrYXnsqLnsp7nsqjnsqHntZjnta/ntaPntZPntZbntafntarntY/nta3ntZzntavntZLntZTntanntZHntZ/ntY7nvL7nvL/nvaVcIl0sXG5bXCJkYjQwXCIsXCLnvabnvqLnvqDnvqHnv5fogZHogY/ogZDog77og5TohYPohYrohZLohY/ohYfohL3ohY3ohLroh6boh67oh7foh7joh7noiIToiLzoiL3oiL/oibXojLvoj4/oj7nokKPoj4Doj6jokJLoj6foj6Toj7zoj7bokJDoj4boj4joj6voj6Pojr/okIHoj53oj6Xoj5joj7/oj6Hoj4voj47oj5boj7Xoj4nokInokI/oj57okJHokIboj4Loj7NcIl0sXG5bXCJkYmExXCIsXCLoj5Xoj7roj4foj5Hoj6rokJPoj4Poj6zoj67oj4Toj7voj5foj6LokJvoj5voj77om5jom6Lom6bom5Pom6Pom5rom6rom53om6vom5zom6zom6nom5fom6jom5HooYjooZbooZXoorroo5foornoorjoo4Door7oorboorzoorfoor3oorLopIHoo4noppXoppjoppfop53op5rop5voqY7oqY3oqLnoqZnoqYDoqZfoqZjoqYToqYXoqZLoqYjoqZHoqYroqYzoqY/osZ/osoHosoDosrrosr7osrDosrnosrXotoTotoDotonot5jot5Pot43ot4fot5bot5zot4/ot5Xot5not4jot5fot4Xou6/ou7fou7pcIl0sXG5bXCJkYzQwXCIsXCLou7nou6bou67ou6Xou7Xou6fou6jou7bou6vou7Hou6zou7Tou6npgK3pgLTpgK/phIbphKzphITpg7/pg7zphIjpg7npg7vphIHphIDphIfphIXphIPphaHphaTphZ/phaLphaDpiIHpiIrpiKXpiIPpiJrpiKbpiI/piIzpiIDpiJLph7/ph73piIbpiITpiKfpiILpiJzpiKTpiJnpiJfpiIXpiJbplbvplo3plozplpDpmofpmb7pmohcIl0sXG5bXCJkY2ExXCIsXCLpmonpmoPpmoDpm4Lpm4jpm4Ppm7Hpm7DpnazpnbDpna7poIfpoqnpo6vps6bpu7nkuoPkuoTkurblgr3lgr/lg4blgq7lg4Tlg4rlgrTlg4jlg4LlgrDlg4HlgrrlgrHlg4vlg4nlgrblgrjlh5flibrlibjlibvlibzll4Pll5vll4zll5Dll4vll4rll53ll4Dll5Tll4Tll6nllr/ll5Lllo3ll4/ll5Xll6Lll5bll4jll7Lll43ll5nll4LlnJTloZPloajloaTloY/loY3loYnloa/loZXloY7loZ3loZnloaXloZvloL3loaPlobHlo7zlq4flq4Tlq4vlqrrlqrjlqrHlqrXlqrDlqr/lq4jlqrvlq4ZcIl0sXG5bXCJkZDQwXCIsXCLlqrflq4Dlq4rlqrTlqrblq43lqrnlqpDlr5blr5jlr5nlsJ/lsLPltbHltaPltYrltaXltbLltazltZ7ltajltafltaLlt7DluY/luY7luYrluY3luYvlu4Xlu4zlu4blu4vlu4flvYDlvq/lvq3mg7fmhYnmhYrmhKvmhYXmhLbmhLLmhK7mhYbmhK/mhY/mhKnmhYDmiKDphajmiKPmiKXmiKTmj4Xmj7Hmj6vmkJDmkJLmkInmkKDmkKRcIl0sXG5bXCJkZGExXCIsXCLmkLPmkYPmkJ/mkJXmkJjmkLnmkLfmkKLmkKPmkIzmkKbmkLDmkKjmkYHmkLXmkK/mkIrmkJrmkYDmkKXmkKfmkIvmj6fmkJvmkK7mkKHmkI7mla/mlpLml5PmmobmmozmmpXmmpDmmovmmormmpnmmpTmmbjmnKDmpabmpZ/mpLjmpY7mpaLmpbHmpL/mpYXmparmpLnmpYLmpZfmpZnmpbrmpYjmpYnmpLXmpazmpLPmpL3mpaXmo7DmpbjmpLTmpanmpYDmpa/mpYTmpbbmpZjmpYHmpbTmpYzmpLvmpYvmpLfmpZzmpY/mpZHmpLLmpZLmpK/mpbvmpLzmrYbmrYXmrYPmrYLmrYjmrYHmrpvvqI3mr7vmr7xcIl0sXG5bXCJkZTQwXCIsXCLmr7nmr7fmr7jmupvmu5bmu4jmuo/mu4Dmup/mupPmupTmuqDmurHmurnmu4bmu5Lmur3mu4Hmup7mu4nmurfmurDmu43muqbmu4/murLmur7mu4Pmu5zmu5jmupnmupLmuo7muo3muqTmuqHmur/murPmu5Dmu4rmupfmuq7muqPnhYfnhZTnhZLnhaPnhaDnhYHnhZ3nhaLnhbLnhbjnharnhaHnhYLnhZjnhYPnhYvnhbDnhZ/nhZDnhZNcIl0sXG5bXCJkZWExXCIsXCLnhYTnhY3nhZrniY/nio3nioznipHnipDnio7njLznjYLnjLvnjLrnjYDnjYrnjYnnkYTnkYrnkYvnkZLnkZHnkZfnkYDnkY/nkZDnkY7nkYLnkYbnkY3nkZTnk6Hnk7/nk77nk73nlJ3nlbnnlbfmpoPnl6/nmI/nmIPnl7fnl77nl7znl7nnl7jnmJDnl7vnl7bnl63nl7Xnl73nmpnnmrXnm53nnZXnnZ/nnaDnnZLnnZbnnZrnnannnafnnZTnnZnnna3nn6DnoofnoprnopTnoo/nooTnopXnooXnoobnoqHnooPnobnnopnnooDnopbnobvnpbznpoLnpb3npbnnqJHnqJjnqJnnqJLnqJfnqJXnqKLnqJNcIl0sXG5bXCJkZjQwXCIsXCLnqJvnqJDnqqPnqqLnqp7nq6vnrabnraTnra3nrbTnrannrbLnraXnrbPnrbHnrbDnraHnrbjnrbbnraPnsrLnsrTnsq/ntojntobntoDnto3ntb/ntoXntbrnto7ntbvntoPntbzntozntpTntoTntb3ntpLnva3nvavnvafnvajnvaznvqbnvqXnvqfnv5vnv5zogKHohaTohaDohbfohZzohanohZvohaLohbLmnKHohZ7ohbbohafoha9cIl0sXG5bXCJkZmExXCIsXCLohYTohaHoiJ3oiYnoiYToiYDoiYLoiYXok7HokL/okZbokbbokbnoko/oko3okaXokZHokYDokobokafokLDokY3okb3okZrokZnokbTokbPokZ3olIfokZ7okLfokLrokLTokbrokYPokbjokLLokYXokKnoj5nokYvokK/okYLokK3okZ/okbDokLnokY7okYzokZLoka/ok4Xoko7okLvokYfokLbokLPokajokb7okYTokKvokaDokZToka7okZDonIvonITom7fonIzom7rom5bom7XonY3om7jonI7onInonIHom7bonI3onIXoo5boo4voo43oo47oo57oo5voo5roo4zoo5DopoXoppvop5/op6Xop6RcIl0sXG5bXCJlMDQwXCIsXCLop6Hop6Dop6Lop5zop6boqbboqoboqb/oqaHoqL/oqbfoqoLoqoToqbXoqoPoqoHoqbToqbrosLzosYvosYrosaXosaTosabosobosoTosoXos4zotajotanotpHotozoto7oto/oto3otpPotpTotpDotpLot7Dot6Dot6zot7Hot67ot5Dot6not6Pot6Lot6fot7Lot6vot7TovIbou7/ovIHovIDovIXovIfovIjovILovIvpgZLpgL9cIl0sXG5bXCJlMGExXCIsXCLpgYTpgYnpgL3phJDphI3phI/phJHphJbphJTphIvphI7pha7pha/piYjpiZLpiLDpiLrpiabpiLPpiaXpiZ7pioPpiK7piYrpiYbpia3piazpiY/piaDpiafpia/piLbpiaHpibDpiLHpiZTpiaPpiZDpibLpiY7piZPpiYzpiZbpiLLplp/plpzplp7plpvpmpLpmpPpmpHpmpfpm47pm7rpm73pm7jpm7XpnbPpnbfpnbjpnbLpoI/poI3poI7poqzpo7bpo7nppq/pprLpprDpprXpqq3pqqvprZvps6rps63ps6fpuoDpu73lg6blg5Tlg5flg6jlg7Plg5vlg6rlg53lg6Tlg5Plg6zlg7Dlg6/lg6Plg6BcIl0sXG5bXCJlMTQwXCIsXCLlh5jlioDlioHli6nli6vljLDljqzlmKflmJXlmIzlmJLll7zlmI/lmJzlmIHlmJPlmILll7rlmJ3lmITll7/ll7nloonlobzlopDlopjlooblooHlob/lobTloovlobrlooflopHloo7lobblooLloojlobvlopTloo/lo77lpavlq5zlq67lq6Xlq5Xlq6rlq5rlq63lq6vlq7Plq6Llq6Dlq5vlq6zlq57lq53lq5nlq6jlq5/lrbflr6BcIl0sXG5bXCJlMWExXCIsXCLlr6PlsaPltoLltoDltb3ltobltbrltoHltbfltorltonltojltb7ltbzlto3ltbnltb/luZjluZnluZPlu5jlu5Hlu5flu47lu5zlu5Xlu5nlu5Llu5TlvYTlvYPlva/lvrbmhKzmhKjmhYHmhZ7mhbHmhbPmhZLmhZPmhbLmhazmhoDmhbTmhZTmhbrmhZvmhaXmhLvmharmhaHmhZbmiKnmiKfmiKvmkKvmkY3mkZvmkZ3mkbTmkbbmkbLmkbPmkb3mkbXmkabmkqbmkY7mkoLmkZ7mkZzmkYvmkZPmkaDmkZDmkb/mkL/mkazmkavmkZnmkaXmkbfmlbPmlqDmmqHmmqDmmp/mnIXmnITmnKLmprHmprbmp4lcIl0sXG5bXCJlMjQwXCIsXCLmpqDmp47mppbmprDmpqzmprzmppHmppnmpo7mpqfmpo3mpqnmpr7mpq/mpr/mp4Tmpr3mpqTmp5Tmprnmp4rmpprmp4/mprPmppPmpqrmpqHmpp7mp5nmppfmppDmp4LmprXmpqXmp4bmrYrmrY3mrYvmrp7mrp/mrqDmr4Pmr4Tmr77mu47mu7Xmu7HmvIPmvKXmu7jmvLfmu7vmvK7mvInmvY7mvJnmvJrmvKfmvJjmvLvmvJLmu63mvIpcIl0sXG5bXCJlMmExXCIsXCLmvLbmvbPmu7nmu67mvK3mvYDmvLDmvLzmvLXmu6vmvIfmvI7mvYPmvIXmu73mu7bmvLnmvJzmu7zmvLrmvJ/mvI3mvJ7mvIjmvKHnhofnhpDnhonnhoDnhoXnhoLnho/nhbvnhobnhoHnhpfniYTniZPnipfnipXnipPnjYPnjY3njZHnjYznkaLnkbPnkbHnkbXnkbLnkafnka7nlIDnlILnlIPnlb3nlpDnmJbnmIjnmIznmJXnmJHnmIrnmJTnmrjnnoHnnbznnoXnnoLnna7nnoDnna/nnb7nnoPnorLnoqrnorTnoq3noqjnob7noqvnop7noqXnoqDnoqznoqLnoqTnppjnpornpovnppbnppXnppTnppNcIl0sXG5bXCJlMzQwXCIsXCLnppfnpojnppLnppDnqKvnqYrnqLDnqK/nqKjnqKbnqqjnqqvnqqznq67nrojnrpznrornrpHnrpDnrpbnro3nroznrpvnro7nroXnrpjlioTnrpnnrqTnroLnsrvnsr/nsrznsrrntqfntrfnt4LntqPntqrnt4Hnt4Dnt4Xntp3nt47nt4Tnt4bnt4vnt4zntq/ntrnntpbntrzntp/ntqbntq7ntqnntqHnt4nnvbPnv6Lnv6Pnv6Xnv55cIl0sXG5bXCJlM2ExXCIsXCLogKTogZ3ogZzohonohobohoPohofoho3ohozohovoiJXokpfokqTokqHokp/okrrok47ok4Lokqzokq7okqvokrnokrTok4Hok43okqrokprokrHok5Dokp3okqfokrvokqLokpTok4fok4zokpvokqnokq/okqjok5bokpjokrbok4/okqDok5fok5Tok5Lok5vokrDokpHomaHonLPonKPonKjonavonYDonK7onJ7onKHonJnonJvonYPonKzonYHonL7onYbonKDonLLonKronK3onLzonJLonLronLHonLXonYLonKbonKfonLjonKTonJronLDonJHoo7foo6foo7Hoo7Loo7roo77oo67oo7zoo7boo7tcIl0sXG5bXCJlNDQwXCIsXCLoo7Doo6zoo6vopp3opqHopp/opp7op6nop6vop6joqqvoqpnoqovoqpLoqo/oqpbosL3osajosanos5Xos4/os5fotpbouInouILot7/ouI3ot73ouIrouIPouIfouIbouIXot77ouIDouITovJDovJHovI7ovI3phKPphJzphKDphKLphJ/phJ3phJrphKTphKHphJvphbrphbLphbnphbPpiqXpiqTpibbpipvpibrpiqDpipTpiqrpio1cIl0sXG5bXCJlNGExXCIsXCLpiqbpiprpiqvpibnpipfpib/piqPpi67pio7pioLpipXpiqLpib3piojpiqHpiorpiobpiozpipnpiqfpib7piofpiqnpip3piovpiK3pmp7pmqHpm7/pnZjpnb3pnbrpnb7pnoPpnoDpnoLpnbvpnoTpnoHpnb/pn47pn43poJbpoq3poq7ppILppIDppIfppp3pppzpp4Ppprnpprvpprrpp4Lppr3pp4fpqrHpq6Ppq6fprL7prL/praDpraHprZ/ps7Hps7Lps7Xpuqflg7/lhIPlhLDlg7jlhIblhIflg7blg77lhIvlhIzlg73lhIrliovliozli7Hli6/lmYjlmYLlmYzlmLXlmYHlmYrlmYnlmYblmZhcIl0sXG5bXCJlNTQwXCIsXCLlmZrlmYDlmLPlmL3lmKzlmL7lmLjlmKrlmLrlnJrloqvlop3lorHloqDloqPloq/loqzloqXloqHlo7/lq7/lq7Tlq73lq7flq7blrIPlq7jlrILlq7nlrIHlrIflrIXlrI/lsafltpnltpfltp/ltpLltqLltpPltpXltqDltpzltqHltprltp7luanluZ3luaDluZznt7Plu5vlu57lu6HlvYnlvrLmhovmhoPmhbnmhrHmhrDmhqLmholcIl0sXG5bXCJlNWExXCIsXCLmhpvmhpPmhq/mhq3mhp/mhpLmhqrmhqHmho3mhabmhrPmiK3mka7mkbDmkpbmkqDmkoXmkpfmkpzmko/mkovmkormkozmkqPmkp/mkajmkrHmkpjmlbbmlbrmlbnmlbvmlrLmlrPmmrXmmrDmmqnmmrLmmrfmmqrmmq/mqIDmqIbmqJfmp6Xmp7jmqJXmp7Hmp6TmqKDmp7/mp6zmp6LmqJvmqJ3mp77mqKfmp7Lmp67mqJTmp7fmp6fmqYDmqIjmp6bmp7vmqI3mp7zmp6vmqInmqITmqJjmqKXmqI/mp7bmqKbmqIfmp7TmqJbmrZHmrqXmrqPmrqLmrqbmsIHmsIDmr7/msILmvYHmvKbmvb7mvofmv4bmvpJcIl0sXG5bXCJlNjQwXCIsXCLmvo3mvonmvozmvaLmvY/mvoXmvZrmvpbmvbbmvazmvoLmvZXmvbLmvZLmvZDmvZfmvpTmvpPmvZ3mvIDmvaHmvavmvb3mvafmvpDmvZPmvovmvanmvb/mvpXmvaPmvbfmvarmvbvnhrLnhq/nhpvnhrDnhqDnhprnhqnnhrXnhp3nhqXnhp7nhqTnhqHnhqrnhpznhqfnhrPnipjniprnjZjnjZLnjZ7njZ/njaDnjZ3njZvnjaHnjZrnjZlcIl0sXG5bXCJlNmExXCIsXCLnjaLnkofnkonnkornkobnkoHnkb3nkoXnkojnkbznkbnnlIjnlIfnlb7nmKXnmJ7nmJnnmJ3nmJznmKPnmJrnmKjnmJvnmpznmp3nmp7nmpvnno3nno/nnonnnojno43norvno4/no4zno5Hno47no5Tno4jno4Pno4Tno4nnpprnpqHnpqDnppznpqLnppvmrbbnqLnnqrLnqrTnqrPnrrfnr4vnrr7nrqznr47nrq/nrrnnr4rnrrXns4Xns4jns4zns4vnt7fnt5vnt6rnt6fnt5fnt6HnuIPnt7rnt6bnt7bnt7Hnt7Dnt67nt5/nvbbnvqznvrDnvq3nv63nv6vnv6rnv6znv6bnv6jogaTogafohqPohp9cIl0sXG5bXCJlNzQwXCIsXCLohp7ohpXohqLohpnohpfoiJboiY/oiZPoiZLoiZDoiY7oiZHolKTolLvolI/olIDolKnolI7olInolI3olJ/olIrolKfolJzok7volKvok7rolIjolIzok7TolKrok7LolJXok7fok6vok7Pok7zolJLok6rok6nolJbok77olKjolJ3olK7olILok73olJ7ok7bolLHolKbok6fok6jok7Dok6/ok7nolJjolKDolLDolIvolJnolK/omaJcIl0sXG5bXCJlN2ExXCIsXCLonZbonaPonaTonbfon6HonbPonZjonZTonZvonZLonaHonZronZHonZ7ona3onaronZDonY7onZ/onZ3ona/onazonbrona7onZzonaXonY/onbvonbXonaLonafonanooZropIXopIzopJTopIvopJfopJjopJnopIbopJbopJHopI7opInopqLopqTopqPop63op7Dop6zoq4/oq4boqrjoq5Poq5Hoq5Toq5Xoqrvoq5foqr7oq4Doq4Xoq5joq4Poqrroqr3oq5nosL7osY3oso/os6Xos5/os5nos6jos5ros53os6fotqDotpzotqHotpvouKDouKPouKXouKTouK7ouJXouJvouJbouJHouJnouKbouKdcIl0sXG5bXCJlODQwXCIsXCLouJTouJLouJjouJPouJzouJfouJrovKzovKTovJjovJrovKDovKPovJbovJfpgbPpgbDpga/pgafpgavphK/phKvphKnphKrphLLphKbphK7phoXphobphorphoHphoLphoTphoDpi5Dpi4Ppi4Tpi4Dpi5npirbpi4/pi7Hpi5/pi5jpi6npi5fpi53pi4zpi6/pi4Lpi6jpi4rpi4jpi47pi6bpi43pi5Xpi4npi6Dpi57pi6fpi5Hpi5NcIl0sXG5bXCJlOGExXCIsXCLpirXpi6Hpi4bpirTplbzplqzplqvplq7plrDpmqTpmqLpm5PpnIXpnIjpnILpnZrpnorpno7pnojpn5Dpn4/poJ7poJ3poKbpoKnpoKjpoKDpoJvpoKfporLppIjpo7rppJHppJTppJbppJfppJXpp5zpp43pp4/pp5Ppp5Tpp47pp4npp5bpp5jpp4vpp5fpp4zpqrPpq6zpq6vpq7Ppq7Lpq7HprYbprYPprafprbTprbHprabprbbprbXprbDprajpraTprazps7zps7rps73ps7/ps7fptIfptIDps7nps7vptIjptIXptITpuoPpu5PpvI/pvJDlhJzlhJPlhJflhJrlhJHlh57ljLTlj6HlmbDlmaDlma5cIl0sXG5bXCJlOTQwXCIsXCLlmbPlmablmaPlma3lmbLlmZ7lmbflnJzlnJvlo4jlor3lo4nlor/lorrlo4Llorzlo4blrJflrJnlrJvlrKHlrJTlrJPlrJDlrJblrKjlrJrlrKDlrJ7lr6/ltqzltrHltqnltqfltrXltrDltq7ltqrltqjltrLltq3ltq/ltrTluafluajluablua/lu6nlu6flu6blu6jlu6XlvYvlvrzmhp3mhqjmhpbmh4XmhrTmh4bmh4Hmh4zmhrpcIl0sXG5bXCJlOWExXCIsXCLmhr/mhrjmhozmk5fmk5bmk5Dmk4/mk4nmkr3mkonmk4Pmk5vmk7Pmk5nmlLPmlb/mlbzmlqLmm4jmmr7mm4Dmm4rmm4vmm4/mmr3mmrvmmrrmm4zmnKPmqLTmqabmqYnmqafmqLLmqajmqL7mqZ3mqa3mqbbmqZvmqZHmqKjmqZrmqLvmqL/mqYHmqarmqaTmqZDmqY/mqZTmqa/mqanmqaDmqLzmqZ7mqZbmqZXmqY3mqY7mqYbmrZXmrZTmrZbmrqfmrqrmrqvmr4jmr4fmsITmsIPmsIbmvq3mv4vmvqPmv4fmvrzmv47mv4jmvZ7mv4Tmvr3mvp7mv4rmvqjngITmvqXmvq7mvrrmvqzmvqrmv4/mvr/mvrhcIl0sXG5bXCJlYTQwXCIsXCLmvqLmv4nmvqvmv43mvq/mvrLmvrDnh4Xnh4Lnhr/nhrjnh5bnh4Dnh4Hnh4vnh5Tnh4rnh4fnh4/nhr3nh5jnhrznh4bnh5rnh5vnip3nip7njannjabnjafnjaznjaXnjavnjarnkb/nkprnkqDnkpTnkpLnkpXnkqHnlIvnloDnmK/nmK3nmLHnmL3nmLPnmLznmLXnmLLnmLDnmrvnm6bnnprnnp3nnqHnnpznnpvnnqLnnqPnnpXnnplcIl0sXG5bXCJlYWExXCIsXCLnnpfno53no6nno6Xno6rno57no6Pno5vno6Hno6Lno63no5/no6DnpqTnqYTnqYjnqYfnqrbnqrjnqrXnqrHnqrfnr57nr6Pnr6fnr53nr5Xnr6Xnr5rnr6jnr7nnr5Tnr6rnr6Lnr5znr6vnr5jnr5/ns5Lns5Tns5fns5Dns5HnuJLnuKHnuJfnuIznuJ/nuKDnuJPnuI7nuJznuJXnuJrnuKLnuIvnuI/nuJbnuI3nuJTnuKXnuKTnvYPnvbvnvbznvbrnvrHnv6/ogKrogKnogazohrHohqbohq7ohrnohrXohqvohrDohqzohrTohrLohrfohqfoh7LoiZXoiZboiZfolZbolYXolavolY3olZPolaHolZhcIl0sXG5bXCJlYjQwXCIsXCLolYDolYbolaTolYHolaLolYTolZHolYfolaPolL7olZvolbHolY7ola7olbXolZXolafolaDolozolabolZ3olZTolaXolazomaPomaXomaTonpvono/onpfonpPonpLonojonoHonpbonpjonbnonofonqPonoXonpDonpHonp3onoTonpTonpzonprononopJ7opKbopLDopK3opK7opKfopLHopKLopKnopKPopK/opKzopJ/op7Hoq6BcIl0sXG5bXCJlYmExXCIsXCLoq6Loq7Loq7Toq7Xoq53orJToq6Toq5/oq7Doq4joq57oq6Hoq6joq7/oq6/oq7vospHospLospDos7Xos67os7Hos7Dos7Potazota7otqXotqfouLPouL7ouLjouYDouYXouLbouLzouL3ouYHouLDouL/our3ovLbovK7ovLXovLLovLnovLfovLTpgbbpgbnpgbvpgobpg7rphLPphLXphLbphpPphpDphpHpho3pho/pjKfpjJ7pjIjpjJ/pjIbpjI/pjbrpjLjpjLzpjJvpjKPpjJLpjIHpjYbpjK3pjI7pjI3pi4vpjJ3pi7rpjKXpjJPpi7npi7fpjLTpjILpjKTpi7/pjKnpjLnpjLXpjKrpjJTpjIxcIl0sXG5bXCJlYzQwXCIsXCLpjIvpi77pjInpjIDpi7vpjJbplrzpl43plr7plrnplrrplrbplr/plrXplr3pmqnpm5TpnIvpnJLpnJDpnpnpnpfpnpTpn7Dpn7jpoLXpoK/poLLppKTppJ/ppKfppKnppp7pp67pp6zpp6Xpp6Tpp7Dpp6Ppp6rpp6npp6fpqrnpqr/pqrTpqrvpq7bpq7rpq7npq7fprLPproDproXprofprbzprb7prbvproLprpPprpLprpDprbrprpVcIl0sXG5bXCJlY2ExXCIsXCLprb3projptKXptJfptKDptJ7ptJTptKnptJ3ptJjptKLptJDptJnptJ/puojpuobpuofpuq7puq3pu5Xpu5bpu7rpvJLpvL3lhKblhKXlhKLlhKTlhKDlhKnli7TlmpPlmozlmo3lmoblmoTlmoPlmb7lmoLlmb/lmoHlo5blo5Tlo4/lo5LlrK3lrKXlrLLlrKPlrKzlrKflrKblrK/lrK7lrbvlr7Hlr7Lltrfluazluarlvr7lvrvmh4PmhrXmhrzmh6fmh6Dmh6Xmh6Tmh6jmh57mk6/mk6nmk6Pmk6vmk6Tmk6jmloHmloDmlrbml5rmm5Lmqo3mqpbmqoHmqqXmqonmqp/mqpvmqqHmqp7mqofmqpPmqo5cIl0sXG5bXCJlZDQwXCIsXCLmqpXmqoPmqqjmqqTmqpHmqb/mqqbmqprmqoXmqozmqpLmrZvmrq3msInmv4zmvqnmv7Tmv5Tmv6Pmv5zmv63mv6fmv6bmv57mv7Lmv53mv6Lmv6jnh6Hnh7Hnh6jnh7Lnh6Tnh7Dnh6LnjbPnja7nja/nkpfnkrLnkqvnkpDnkqrnkq3nkrHnkqXnkq/nlJDnlJHnlJLnlI/nloTnmYPnmYjnmYnnmYfnmqTnm6nnnrXnnqvnnrLnnrfnnrZcIl0sXG5bXCJlZGExXCIsXCLnnrTnnrHnnqjnn7Dno7Pno73npILno7vno7zno7LnpIXno7nno77npITnpqvnpqjnqZznqZvnqZbnqZjnqZTnqZrnqr7nq4Dnq4HnsIXnsI/nr7LnsIDnr7/nr7vnsI7nr7TnsIvnr7PnsILnsInnsIPnsIHnr7jnr73nsIbnr7Dnr7HnsJDnsIrns6jnuK3nuLznuYLnuLPpoYjnuLjnuKrnuYnnuYDnuYfnuKnnuYznuLDnuLvnuLbnuYTnuLrnvYXnvb/nvb7nvb3nv7Tnv7LogKzohrvoh4Toh4zoh4roh4Xoh4fohrzoh6noiZvoiZroiZzoloPoloDolo/olqfolpXolqDolovolqPolbvolqTolprolp5cIl0sXG5bXCJlZTQwXCIsXCLolbfolbzolonolqHolbrolbjolZfolo7olpbolobolo3olpnolp3oloHolqLoloLolojoloXolbnolbbolpjolpDolp/omajonr7onqronq3on4XonrDonqzonrnonrXonrzonq7on4non4Pon4Lon4zonrfonq/on4Ton4ronrTonrbonr/onrjonr3on57onrLopLXopLPopLzopL7opYHopZLopLfopYLopq3opq/opq7op7Lop7PorJ5cIl0sXG5bXCJlZWExXCIsXCLorJjorJborJHorIXorIvorKLorI/orJLorJXorIforI3orIjorIborJzorJPorJrosY/osbDosbLosbHosa/ospXospTos7nota/ouY7ouY3ouZPouZDouYzouYfovYPovYDpgoXpgb7phLjphprphqLphpvphpnphp/phqHphp3phqDpjqHpjoPpjq/pjaTpjZbpjYfpjbzpjZjpjZzpjbbpjYnpjZDpjZHpjaDpja3pjo/pjYzpjarpjbnpjZfpjZXpjZLpjY/pjbHpjbfpjbvpjaHpjZ7pjaPpjafpjoDpjY7pjZnpl4fpl4Dpl4npl4Ppl4Xplrfpmq7pmrDpmqzpnKDpnJ/pnJjpnJ3pnJnpnprpnqHpnpxcIl0sXG5bXCJlZjQwXCIsXCLpnp7pnp3pn5Xpn5Tpn7HpoYHpoYTpoYrpoYnpoYXpoYPppKXppKvppKzppKrppLPppLLppK/ppK3ppLHppLDpppjppqPppqHpqILpp7rpp7Tpp7fpp7npp7jpp7bpp7vpp73pp77pp7zpqIPpqr7pq77pq73prIHpq7zprYjprprprqjprp7prpvprqbprqHprqXprqTprobprqLprqDprq/ptLPptYHptafptLbptK7ptK/ptLHptLjptLBcIl0sXG5bXCJlZmExXCIsXCLptYXptYLptYPptL7ptLfptYDptL3nv7XptK3puorpuonpuo3purDpu4jpu5rpu7vpu7/pvKTpvKPpvKLpvZTpvqDlhLHlhK3lhK7lmpjlmpzlmpflmprlmp3lmpnlpbDlrLzlsanlsarlt4Dlua3lua7mh5jmh5/mh63mh67mh7Hmh6rmh7Dmh6vmh5bmh6nmk7/mlITmk73mk7jmlIHmlIPmk7zmlpTml5vmm5rmm5vmm5jmq4Xmqrnmqr3mq6Hmq4bmqrrmqrbmqrfmq4fmqrTmqq3mrZ7mr4nmsIvngIfngIzngI3ngIHngIXngJTngI7mv7/ngIDmv7vngKbmv7zmv7fngIrniIHnh7/nh7nniIPnh73njbZcIl0sXG5bXCJmMDQwXCIsXCLnkrjnk4DnkrXnk4Hnkr7nkrbnkrvnk4LnlJTnlJPnmZznmaTnmZnnmZDnmZPnmZfnmZrnmqbnmr3nm6znn4Lnnrrno7/npIznpJPnpJTnpInnpJDnpJLnpJHnpq3npqznqZ/nsJznsKnnsJnnsKDnsJ/nsK3nsJ3nsKbnsKjnsKLnsKXnsLDnuZznuZDnuZbnuaPnuZjnuaLnuZ/nuZHnuaDnuZfnuZPnvrXnvrPnv7fnv7jogbXoh5Hoh5JcIl0sXG5bXCJmMGExXCIsXCLoh5DoiZ/oiZ7olrTol4bol4Dol4Pol4LolrPolrXolr3ol4fol4Tolr/ol4vol47ol4jol4XolrHolrbol5LomKTolrjolrfolr7omanon6fon6bon6Lon5von6von6ron6Xon5/on7Pon6Ton5Ton5zon5Pon63on5jon6PonqTon5fon5nooIHon7Ton6jon53opZPopYvopY/opYzopYbopZDopZHopYnorKrorKforKPorLPorLDorLXorYforK/orLzorL7orLHorKXorLforKborLborK7orKTorLvorL3orLrosYLosbXospnospjospfos77otITotILotIDouZzouaLouaDouZfouZbouZ7ouaXouadcIl0sXG5bXCJmMTQwXCIsXCLouZvouZrouaHouZ3ouanouZTovYbovYfovYjovYvphKjphLrphLvphL7phqjphqXphqfphq/phqrpjrXpjozpjpLpjrfpjpvpjp3pjonpjqfpjo7pjqrpjp7pjqbpjpXpjojpjpnpjp/pjo3pjrHpjpHpjrLpjqTpjqjpjrTpjqPpjqXpl5Lpl5Ppl5HpmrPpm5fpm5rlt4Lpm5/pm5jpm53pnKPpnKLpnKXpnqzpnq7pnqjpnqvpnqTpnqpcIl0sXG5bXCJmMWExXCIsXCLpnqLpnqXpn5fpn5npn5bpn5jpn7rpoZDpoZHpoZLporjppYHppLzppLrpqI/pqIvpqInpqI3pqITpqJHpqIrpqIXpqIfpqIbpq4Dpq5zprIjprITprIXprKnprLXprYrprYzprYvpr4fpr4bpr4Pprr/pr4HprrXprrjpr5Pprrbpr4Tprrnprr3ptZzptZPptY/ptYrptZvptYvptZnptZbptYzptZfptZLptZTptZ/ptZjptZrpuo7puozpu5/pvIHpvIDpvJbpvKXpvKvpvKrpvKnpvKjpvYzpvZXlhLTlhLXlipbli7fljrTlmqvlmq3lmqblmqflmqrlmqzlo5rlo53lo5vlpJLlrL3lrL7lrL/lt4PlubBcIl0sXG5bXCJmMjQwXCIsXCLlvr/mh7vmlIfmlJDmlI3mlInmlIzmlI7mloTml57ml53mm57mq6fmq6Dmq4zmq5Hmq5nmq4vmq5/mq5zmq5Dmq6vmq4/mq43mq57mraDmrrDmsIzngJnngKfngKDngJbngKvngKHngKLngKPngKnngJfngKTngJzngKrniIzniIrniIfniILniIXniqXniqbniqTniqPniqHnk4vnk4Xnkrfnk4PnlJbnmaDnn4nnn4rnn4Tnn7HnpJ3npJtcIl0sXG5bXCJmMmExXCIsXCLnpKHnpJznpJfnpJ7nprDnqafnqajnsLPnsLznsLnnsKznsLvns6zns6rnubbnubXnubjnubDnubfnua/nubrnubLnubTnuajnvYvnvYrnvoPnvobnvrfnv73nv77ogbjoh5foh5XoiaToiaHoiaPol6vol7Hol63ol5nol6Hol6jol5rol5fol6zol7Lol7jol5jol5/ol6Pol5zol5Hol7Dol6bol6/ol57ol6LooIDon7rooIPon7bon7fooInooIzooIvooIbon7zooIjon7/ooIrooILopaLopZropZvopZfopaHopZzopZjopZ3opZnopojoprfoprbop7borZDorYjorYrorYDorZPorZborZTorYvorZVcIl0sXG5bXCJmMzQwXCIsXCLorZHorYLorZLorZfosYPosbfosbbosprotIbotIfotInotqzotqrotq3otqvoua3oubjoubPouaroua/oubvou4LovZLovZHovY/ovZDovZPovrTphYDphL/phrDphq3pj57pj4fpj4/pj4Lpj5rpj5Dpj7npj6zpj4zpj5npjqnpj6bpj4rpj5Tpj67pj6Ppj5Xpj4Tpj47pj4Dpj5Lpj6fplb3pl5rpl5vpm6HpnKnpnKvpnKzpnKjpnKZcIl0sXG5bXCJmM2ExXCIsXCLpnrPpnrfpnrbpn53pn57pn5/poZzpoZnpoZ3poZfpor/por3porvpor7ppYjppYfppYPppqbppqfpqJrpqJXpqKXpqJ3pqKTpqJvpqKLpqKDpqKfpqKPpqJ7pqJzpqJTpq4LprIvprIrprI7prIzprLfpr6rpr6vpr6Dpr57pr6Tpr6bpr6Lpr7Dpr5Tpr5fpr6zpr5zpr5npr6Xpr5Xpr6Hpr5rptbfptoHptorptoTptojptbHptoDptbjptobptovptozptb3ptavptbTptbXptbDptanptoXptbPptbvptoLpta/ptbnptb/ptofptajpupTpupHpu4Dpu7zpvK3pvYDpvYHpvY3pvZbpvZfpvZjljLflmrJcIl0sXG5bXCJmNDQwXCIsXCLlmrXlmrPlo6PlrYXlt4blt4flu67lu6/lv4Dlv4Hmh7nmlJfmlJbmlJXmlJPml5/mm6jmm6Pmm6Tmq7Pmq7Dmq6rmq6jmq7nmq7Hmq67mq6/ngLzngLXngK/ngLfngLTngLHngYLngLjngL/ngLrngLnngYDngLvngLPngYHniJPniJTniqjnjb3njbznkrrnmqvnmqrnmr7nm63nn4znn47nn4/nn43nn7LnpKXnpKPnpKfnpKjnpKTnpKlcIl0sXG5bXCJmNGExXCIsXCLnprLnqa7nqaznqa3nq7fnsYnnsYjnsYrnsYfnsYXns67nubvnub7nuoHnuoDnvrrnv7/ogbnoh5voh5noiIvoiajoianomKLol7/omIHol77omJvomIDol7bomITomInomIXomIzol73ooJnooJDooJHooJfooJPooJbopaPopaboprnop7foraDorarorZ3orajoraPoraXorafora3otq7ouobouojouoTovZnovZbovZfovZXovZjovZrpgo3phYPphYHphrfphrXphrLphrPpkIvpkJPpj7vpkKDpkI/pkJTpj77pkJXpkJDpkKjpkJnpkI3pj7XpkIDpj7fpkIfpkI7pkJbpkJLpj7rpkInpj7jpkIrpj79cIl0sXG5bXCJmNTQwXCIsXCLpj7zpkIzpj7bpkJHpkIbpl57pl6Dpl5/pnK7pnK/pnrnpnrvpn73pn77poaDpoaLpoaPpoZ/po4Hpo4LppZDppY7ppZnppYzppYvppZPpqLLpqLTpqLHpqKzpqKrpqLbpqKnpqK7pqLjpqK3pq4fpq4rpq4bprJDprJLprJHpsIvpsIjpr7fpsIXpsJLpr7jpsYDpsIfpsI7psIbpsJfpsJTpsInptp/ptpnptqTptp3ptpLptpjptpDptptcIl0sXG5bXCJmNWExXCIsXCLptqDptpTptpzptqrptpfptqHptprptqLptqjptp7ptqPptr/ptqnptpbptqbptqfpupnpupvpuprpu6Xpu6Tpu6fpu6bpvLDpvK7pvZvpvaDpvZ7pvZ3pvZnpvpHlhLrlhLnlipjlipflm4Plmr3lmr7lrYjlrYflt4vlt4/lu7Hmh73mlJvmrILmq7zmrIPmq7jmrIDngYPngYTngYrngYjngYnngYXngYbniJ3niJrniJnnjb7nlJfnmarnn5DnpK3npLHnpK/nsZTnsZPns7Lnuornuofnuojnuovnuobnuo3nvY3nvrvogLDoh53omJjomKromKbomJ/omKPomJzomJnomKfomK7omKHomKDomKnomJ7omKVcIl0sXG5bXCJmNjQwXCIsXCLooKnooJ3ooJvooKDooKTooJzooKvooYropa3opanopa7opavop7rorbnorbjorYXorbrorbvotJDotJTotq/ouo7ouozovZ7ovZvovZ3phYbphYTphYXphrnpkL/pkLvpkLbpkKnpkL3pkLzpkLDpkLnpkKrpkLfpkKzpkYDpkLHpl6Xpl6Tpl6PpnLXpnLrpnr/pn6HpoaTpo4npo4bpo4DppZjppZbpqLnpqL3pqYbpqYTpqYLpqYHpqLpcIl0sXG5bXCJmNmExXCIsXCLpqL/pq43prJXprJfprJjprJbprLrprZLpsKvpsJ3psJzpsKzpsKPpsKjpsKnpsKTpsKHptrfptrbptrzpt4Hpt4fpt4rpt4/ptr7pt4Xpt4PptrvptrXpt47ptrnptrrptqzpt4jptrHptq3pt4zptrPpt43ptrLpubrpupzpu6vpu67pu63pvJvpvJjpvJrpvLHpvY7pvaXpvaTpvpLkurnlm4blm4Xlm4vlpbHlrYvlrYzlt5Xlt5Hlu7LmlKHmlKDmlKbmlKLmrIvmrIjmrInmsI3ngZXngZbngZfngZLniJ7niJ/niqnnjb/nk5jnk5Xnk5nnk5fnma3nmq3npLXnprTnqbDnqbHnsZfnsZznsZnnsZvnsZpcIl0sXG5bXCJmNzQwXCIsXCLns7Tns7HnupHnvY/nvofoh57oiavomLTomLXomLPomKzomLLomLbooKzooKjooKbooKrooKXopbHopr/opr7op7vorb7oroToroLoroboroXorb/otJXoupXoupTouproupLoupDoupboupfovaDovaLphYfpkYzpkZDpkYrpkYvpkY/pkYfpkYXpkYjpkYnpkYbpnL/pn6Ppoarpoanpo4vppZTppZvpqY7pqZPpqZTpqYzpqY/pqYjpqYpcIl0sXG5bXCJmN2ExXCIsXCLpqYnpqZLpqZDpq5DprJnprKvprLvprZbprZXpsYbpsYjpsL/psYTpsLnpsLPpsYHpsLzpsLfpsLTpsLLpsL3psLbpt5vpt5Lpt57pt5rpt4vpt5Dpt5zpt5Hpt5/pt6npt5npt5jpt5bpt7Xpt5Xpt53purbpu7DpvLXpvLPpvLLpvYLpvavpvpXpvqLlhL3lipnlo6jlo6flpbLlrY3lt5jooK/lvY/miIHmiIPmiITmlKnmlKXmlpbmm6vmrJHmrJLmrI/mr4rngZvngZrniKLnjoLnjoHnjoPnmbDnn5TnsafnsabnupXoiazomLromYDomLnomLzomLHomLvomL7ooLDooLLooK7ooLPopbbopbTopbPop75cIl0sXG5bXCJmODQwXCIsXCLorozoro7orovorojosYXotJnoupjovaTovaPphrzpkaLpkZXpkZ3pkZfpkZ7pn4Tpn4XpoIDpqZbpqZnprJ7prJ/prKDpsZLpsZjpsZDpsYrpsY3psYvpsZXpsZnpsYzpsY7pt7vpt7fpt6/pt6Ppt6vpt7jpt6Tpt7bpt6Hpt67pt6bpt7Lpt7Dpt6Lpt6zpt7Tpt7Ppt6jpt63pu4Lpu5Dpu7Lpu7PpvIbpvJzpvLjpvLfpvLbpvYPpvY9cIl0sXG5bXCJmOGExXCIsXCLpvbHpvbDpva7pva/lm5Plm43lrY7lsa3mlK3mm63mm67mrJPngZ/ngaHngZ3ngaDniKPnk5vnk6Xnn5XnpLjnprfnprbnsarnupfnvonoia3omYPooLjooLfooLXooYvorpTorpXoup7oup/ouqDoup3phr7phr3ph4Lpkavpkajpkanpm6XpnYbpnYPpnYfpn4fpn6XpqZ7pq5XprZnpsaPpsafpsabpsaLpsZ7psaDpuILpt77puIfpuIPpuIbpuIXpuIDpuIHpuInpt7/pt73puITpuqDpvJ7pvYbpvbTpvbXpvbblm5TmlK7mlrjmrJjmrJnmrJfmrJrngaLniKbniqrnn5jnn5nnpLnnsannsavns7bnuppcIl0sXG5bXCJmOTQwXCIsXCLnupjnupvnupnoh6Doh6HomYbomYfomYjopbnopbropbzopbvop7/orpjorpnouqXouqTouqPpka7pka3pka/pkbHpkbPpnYnpobLppZ/psajpsa7psa3puIvpuI3puJDpuI/puJLpuJHpuqHpu7XpvInpvYfpvbjpvbvpvbrpvbnlnJ7ngabnsa/ooLzotrLouqbph4PpkbTpkbjpkbbpkbXpqaDpsbTpsbPpsbHpsbXpuJTpuJPpu7bpvIpcIl0sXG5bXCJmOWExXCIsXCLpvqTngajngaXns7fomarooL7ooL3ooL/orp7ospzouqnou4npnYvpobPpobTpo4zppaHppqvpqaTpqabpqafprKTpuJXpuJfpvYjmiIfmrJ7niKfomYzouqjpkoLpkoDpkoHpqanpqajprK7puJnniKnomYvorp/pkoPpsbnpurfnmbXpqavpsbrpuJ3nganngarpuqTpvb7pvYnpvpjnooHpirnoo4/lorvmgZLnsqflq7rilZTilabilZfilaDilazilaPilZrilanilZ3ilZLilaTilZXilZ7ilarilaHilZjilafilZvilZPilaXilZbilZ/ilavilaLilZnilajilZzilZHilZDila3ila7ilbDila/ilpNcIl1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbltcIjBcIixcIlxcdTAwMDBcIiwxMjddLFxuW1wiOGVhMVwiLFwi772hXCIsNjJdLFxuW1wiYTFhMVwiLFwi44CA44CB44CC77yM77yO44O777ya77yb77yf77yB44Kb44KcwrTvvYDCqO+8vu+/o++8v+ODveODvuOCneOCnuOAg+S7neOAheOAhuOAh+ODvOKAleKAkO+8j++8vO+9nuKIpe+9nOKApuKApeKAmOKAmeKAnOKAne+8iO+8ieOAlOOAle+8u++8ve+9m++9neOAiFwiLDksXCLvvIvvvI3CscOXw7fvvJ3iiaDvvJzvvJ7iiabiiafiiJ7iiLTimYLimYDCsOKAsuKAs+KEg++/pe+8hO+/oO+/oe+8he+8g++8hu+8iu+8oMKn4piG4piF4peL4peP4peO4peHXCJdLFxuW1wiYTJhMVwiLFwi4peG4pah4pag4paz4pay4pa94pa84oC744CS4oaS4oaQ4oaR4oaT44CTXCJdLFxuW1wiYTJiYVwiLFwi4oiI4oiL4oqG4oqH4oqC4oqD4oiq4oipXCJdLFxuW1wiYTJjYVwiLFwi4oin4oio77+i4oeS4oeU4oiA4oiDXCJdLFxuW1wiYTJkY1wiLFwi4oig4oql4oyS4oiC4oiH4omh4omS4omq4omr4oia4oi94oid4oi14oir4oisXCJdLFxuW1wiYTJmMlwiLFwi4oSr4oCw4pmv4pmt4pmq4oCg4oChwrZcIl0sXG5bXCJhMmZlXCIsXCLil69cIl0sXG5bXCJhM2IwXCIsXCLvvJBcIiw5XSxcbltcImEzYzFcIixcIu+8oVwiLDI1XSxcbltcImEzZTFcIixcIu+9gVwiLDI1XSxcbltcImE0YTFcIixcIuOBgVwiLDgyXSxcbltcImE1YTFcIixcIuOCoVwiLDg1XSxcbltcImE2YTFcIixcIs6RXCIsMTYsXCLOo1wiLDZdLFxuW1wiYTZjMVwiLFwizrFcIiwxNixcIs+DXCIsNl0sXG5bXCJhN2ExXCIsXCLQkFwiLDUsXCLQgdCWXCIsMjVdLFxuW1wiYTdkMVwiLFwi0LBcIiw1LFwi0ZHQtlwiLDI1XSxcbltcImE4YTFcIixcIuKUgOKUguKUjOKUkOKUmOKUlOKUnOKUrOKUpOKUtOKUvOKUgeKUg+KUj+KUk+KUm+KUl+KUo+KUs+KUq+KUu+KVi+KUoOKUr+KUqOKUt+KUv+KUneKUsOKUpeKUuOKVglwiXSxcbltcImFkYTFcIixcIuKRoFwiLDE5LFwi4oWgXCIsOV0sXG5bXCJhZGMwXCIsXCLjjYnjjJTjjKLjjY3jjJjjjKfjjIPjjLbjjZHjjZfjjI3jjKbjjKPjjKvjjYrjjLvjjpzjjp3jjp7jjo7jjo/jj4TjjqFcIl0sXG5bXCJhZGRmXCIsXCLjjbvjgJ3jgJ/ihJbjj43ihKHjiqRcIiw0LFwi44ix44iy44i5442+442944284omS4omh4oir4oiu4oiR4oia4oql4oig4oif4oq/4oi14oip4oiqXCJdLFxuW1wiYjBhMVwiLFwi5Lqc5ZSW5aiD6Zi/5ZOA5oSb5oyo5ae26YCi6JG16Iyc56mQ5oKq5o+h5ril5pet6JGm6Iqm6a+15qKT5Zyn5pah5omx5a6b5aeQ6Jm76aO057Wi57a+6a6O5oiW57Kf6KK35a6J5bq15oyJ5pqX5qGI6ZeH6Z6N5p2P5Lul5LyK5L2N5L6d5YGJ5Zuy5aS35aeU5aiB5bCJ5oOf5oSP5oWw5piT5qSF54K655WP55Ww56e757at57ev6IOD6JCO6KGj6KyC6YGV6YG65Yy75LqV5Lql5Z+f6IKy6YOB56Ov5LiA5aOx5rqi6YC456iy6Iyo6IqL6bCv5YWB5Y2w5ZK95ZOh5Zug5ae75byV6aOy5rer6IOk6JStXCJdLFxuW1wiYjFhMVwiLFwi6Zmi6Zmw6Zqg6Z+75ZCL5Y+z5a6H54OP57696L+C6Zuo5Y2v6bWc56q65LiR56KT6Ie85rim5ZiY5ZSE5qyd6JSa6bC75ael5Y6p5rWm55Oc6ZaP5ZmC5LqR6YGL6Zuy6I2P6aSM5Y+h5Za25ayw5b2x5pig5puz5qCE5rC45rOz5rSp55Gb55uI56mO6aC06Iux6KGb6Kmg6Yut5ray55ar55uK6aeF5oKm6KyB6LaK6Zay5qaO5Y6t5YaG5ZyS5aCw5aWE5a605bu25oCo5o6p5o+05rK/5ryU54KO54SU54WZ54eV54y/57iB6Im26IuR6JaX6YGg6Ymb6bSb5aGp5pa85rGa55Sl5Ye55aSu5aWl5b6A5b+cXCJdLFxuW1wiYjJhMVwiLFwi5oq85pe65qiq5qyn5q60546L57+B6KWW6bSs6bSO6buE5bKh5rKW6I275YSE5bGL5oa26IeG5qG254mh5LmZ5L+65Y245oGp5rip56mP6Z+z5LiL5YyW5Luu5L2V5Ly95L6h5L2z5Yqg5Y+v5ZiJ5aSP5auB5a625a+h56eR5pqH5p6c5p625q2M5rKz54Gr54+C56aN56a+56i8566H6Iqx6Iub6IyE6I236I+v6I+T6J2m6Kqy5Zip6LKo6L+m6YGO6Zye6JqK5L+E5bOo5oiR54mZ55S76Iel6Iq96Ju+6LOA6ZuF6aST6aeV5LuL5Lya6Kej5Zue5aGK5aOK5bu75b+r5oCq5oKU5oGi5oeQ5oiS5ouQ5pS5XCJdLFxuW1wiYjNhMVwiLFwi6a2B5pmm5qKw5rW354Gw55WM55qG57W16Iql6J+56ZaL6ZqO6LKd5Yex5Yq+5aSW5ZKz5a6z5bSW5oWo5qaC5rav56KN6JOL6KGX6Kmy6Y6n6aq45rWs6aao6JuZ5Z6j5p+/6JuO6YiO5YqD5ZqH5ZCE5buT5ouh5pK55qC85qC45q67542y56K656mr6Kaa6KeS6LWr6LyD6YOt6Zaj6ZqU6Z2p5a2m5bKz5qW96aGN6aGO5o6b56yg5qir5qm/5qK26bCN5r2f5Ymy5Zad5oGw5ous5rS75riH5ruR6JGb6KSQ6L2E5LiU6bC55Y+25qSb5qi66Z6E5qCq5YWc56uD6JKy6Yec6Y6M5Zmb6bSo5qCi6IyF6JCxXCJdLFxuW1wiYjRhMVwiLFwi57Kl5YiI6IuF55Om5Lm+5L6D5Yag5a+S5YiK5YuY5Yun5be75Zaa5aCq5aem5a6M5a6Y5a+b5bmy5bm55oKj5oSf5oWj5oa+5o+b5pWi5p+R5qGT5qO65qy+5q2T5rGX5ryi5r6X5r2F55Kw55SY55uj55yL56u/566h57Ch57ep57y257+w6IKd6Imm6I6e6Kaz6KuM6LKr6YKE6ZGR6ZaT6ZaR6Zai6Zml6Z+T6aSo6IiY5Li45ZCr5bK45beM546p55mM55y85bKp57+r6LSL6ZuB6aCR6aGU6aGY5LyB5LyO5Y2x5Zac5Zmo5Z+65aWH5ayJ5a+E5bKQ5biM5bm+5b+M5o+u5py65peX5pei5pyf5qOL5qOEXCJdLFxuW1wiYjVhMVwiLFwi5qmf5biw5q+F5rCX5rG955W/56WI5a2j56iA57SA5b696KaP6KiY6LK06LW36LuM6Lyd6aOi6aiO6ay85LqA5YG95YSA5aaT5a6c5oiv5oqA5pOs5qy654qg55aR56WH576p6J+76Kq86K2w5o6s6I+K6Z6g5ZCJ5ZCD5Zar5qGU5qmY6Kmw56Cn5p216buN5Y205a6i6ISa6JmQ6YCG5LiY5LmF5LuH5LyR5Y+K5ZC45a6u5byT5oCl5pWR5py95rGC5rGy5rOj54G455CD56m256qu56yI57Sa57O+57Wm5pen54mb5Y675bGF5beo5ouS5oug5oyZ5rig6Jma6Kix6Led6Yu45ryB56am6a2a5Lqo5Lqr5LqsXCJdLFxuW1wiYjZhMVwiLFwi5L6b5L6g5YOR5YWH56u25YWx5Ye25Y2U5Yyh5Y2/5Y+r5Zas5aKD5bOh5by35b2K5oCv5oGQ5oGt5oyf5pWZ5qmL5rOB54uC54ut55+v6IO46ISF6IiI6JWO6YO36Y+h6Z+/6aWX6ama5Luw5Yed5bCt5pqB5qWt5bGA5puy5qW1546J5qGQ57KB5YOF5Yuk5Z2H5be+6Yym5pak5qyj5qy955C056aB56a9562L57eK6Iq56I+M6KG/6KWf6Ky56L+R6YeR5ZCf6YqA5Lmd5YC25Y+l5Yy654uX546W55+p6Ium6Lqv6aeG6aeI6aeS5YW35oSa6Jme5Zaw56m65YG25a+T6YGH6ZqF5Liy5qub6Yen5bGR5bGIXCJdLFxuW1wiYjdhMVwiLFwi5o6Y56qf5rKT6Z206L2h56qq54aK6ZqI57KC5qCX57mw5qGR6Y2s5Yuy5ZCb6Jar6KiT576k6LuN6YOh5Y2m6KKI56WB5L+C5YK+5YiR5YWE5ZWT5Zyt54+q5Z6L5aWR5b2i5b6E5oG15oW25oWn5oap5o6y5pC65pWs5pmv5qGC5riT55Wm56i957O757WM57aZ57mL572r6IyO6I2K6JuN6KiI6Kmj6K2m6Lu96aCa6baP6Iq46L+O6a+o5YqH5oif5pKD5r+A6ZqZ5qGB5YKR5qyg5rG65r2U56m057WQ6KGA6Kij5pyI5Lu25YC55YCm5YGl5YW85Yi45Ymj5Zan5ZyP5aCF5auM5bu65oay5oe45ouz5o2yXCJdLFxuW1wiYjhhMVwiLFwi5qSc5qip54m954qs54yu56CU56Gv57W555yM6IKp6KaL6KyZ6LOi6LuS6YGj6Y216Zm66aGV6aiT6bm45YWD5Y6f5Y6z5bm75bym5rib5rqQ546E54++57WD6Ii36KiA6Ku66ZmQ5LmO5YCL5Y+k5ZG85Zu65aeR5a2k5bex5bqr5byn5oi45pWF5p6v5rmW54uQ57OK6KK06IKh6IOh6I+w6JmO6KqH6Leo6Yi36ZuH6aGn6byT5LqU5LqS5LyN5Y2I5ZGJ5ZC+5aiv5b6M5b6h5oKf5qKn5qqO55Ga56KB6Kqe6Kqk6K236YaQ5Lme6a+J5Lqk5L285L6v5YCZ5YCW5YWJ5YWs5Yqf5Yq55Yu+5Y6a5Y+j5ZCRXCJdLFxuW1wiYjlhMVwiLFwi5ZCO5ZaJ5Z2R5Z6i5aW95a2U5a2d5a6P5bel5ben5be35bm45bqD5bqa5bq35byY5oGS5oWM5oqX5ouY5o6n5pS75piC5pmD5pu05p2t5qCh5qKX5qeL5rGf5rSq5rWp5riv5rqd55Sy55qH56Gs56i/57Og57SF57SY57We57ax6ICV6ICD6IKv6IKx6IWU6IaP6Iiq6I2S6KGM6KGh6Kyb6LKi6LO86YOK6YW16Ymx56C/6Yu86Zak6ZmN6aCF6aaZ6auY6bS75Ymb5Yqr5Y+35ZCI5aOV5ou35r+g6LGq6L2f6bq55YWL5Yi75ZGK5Zu956mA6YW36bWg6buS542E5ryJ6IWw55SR5b+95oOa6aqo54ub6L68XCJdLFxuW1wiYmFhMVwiLFwi5q2k6aCD5LuK5Zuw5Z2k5aK+5ama5oGo5oeH5piP5piG5qC55qKx5re355eV57S66Imu6a2C5Lqb5L2Q5Y+J5ZSG5bWv5bem5beu5p+75rKZ55Gz56CC6KmQ6Y6W6KOf5Z2Q5bqn5oyr5YK15YKs5YaN5pyA5ZOJ5aGe5aa75a6w5b2p5omN5o6h5qC95q2z5riI54G96YeH54qA56CV56Cm56Wt5paO57Sw6I+c6KOB6LyJ6Zqb5Ymk5Zyo5p2Q572q6LKh5Ya05Z2C6Ziq5aC65qaK6IK05ZKy5bSO5Z+856KV6be65L2c5YmK5ZKL5pC+5pio5pyU5p+156qE562W57Si6Yyv5qGc6a6t56y55YyZ5YaK5Yi3XCJdLFxuW1wiYmJhMVwiLFwi5a+f5ou25pKu5pOm5pyt5q666Jap6ZuR55qQ6a+W5o2M6YyG6a6r55q/5pmS5LiJ5YKY5Y+C5bGx5oOo5pKS5pWj5qGf54em54+K55Sj566X57qC6JqV6K6D6LOb6YW46aSQ5pas5pqr5q6L5LuV5LuU5Ly65L2/5Yi65Y+45Y+y5Zej5Zub5aOr5aeL5aeJ5ae/5a2Q5bGN5biC5bir5b+X5oCd5oyH5pSv5a2c5pav5pa95peo5p6d5q2i5q275rCP542F56WJ56eB57O457SZ57Sr6IKi6ISC6Iez6KaW6Kme6Kmp6Kmm6KqM6Kuu6LOH6LOc6ZuM6aO85q2v5LqL5Ly85L6N5YWQ5a2X5a+65oWI5oyB5pmCXCJdLFxuW1wiYmNhMVwiLFwi5qyh5ruL5rK754i+55K955eU56OB56S66ICM6ICz6Ieq6JKU6L6e5rGQ6bm/5byP6K2Y6bSr56u66Lu45a6N6Zur5LiD5Y+x5Z+35aSx5auJ5a6k5oKJ5rm/5ryG55a+6LOq5a6f6JSA56+g5YGy5p+06Iqd5bGh6JWK57ie6IiO5YaZ5bCE5o2o6LWm5pac54Wu56S+57SX6ICF6Kyd6LuK6YGu6JuH6YKq5YCf5Yu65bC65p2T54G854i16YWM6YeI6Yyr6Iul5a+C5byx5oO55Li75Y+W5a6I5omL5pyx5q6K54up54+g56iu6IWr6Laj6YWS6aaW5YSS5Y+X5ZGq5a+/5o6I5qi557as6ZyA5Zua5Y+O5ZGoXCJdLFxuW1wiYmRhMVwiLFwi5a6X5bCx5bee5L+u5oSB5ou+5rSy56eA56eL57WC57mN57+S6Iet6Iif6JKQ6KGG6KWy6K6Q6Lm06Lyv6YCx6YWL6YWs6ZuG6Yac5LuA5L2P5YWF5Y2B5b6T5oiO5p+U5rGB5riL542j57im6YeN6YqD5Y+U5aSZ5a6/5reR56Wd57iu57Kb5aG+54af5Ye66KGT6L+w5L+K5bO75pil556s56uj6Iic6ae/5YeG5b6q5pes5qWv5q6J5rez5rqW5r2k55u+57SU5beh6YG16YaH6aCG5Yem5Yid5omA5pqR5puZ5ria5bq257eS572y5pu46Jav6Je36Ku45Yqp5Y+Z5aWz5bqP5b6Q5oGV6Yuk6Zmk5YK35YSfXCJdLFxuW1wiYmVhMVwiLFwi5Yud5Yyg5Y2H5Y+s5ZOo5ZWG5ZSx5ZiX5aWo5aa+5ai85a615bCG5bCP5bCR5bCa5bqE5bqK5bug5b2w5om/5oqE5oub5o6M5o235piH5piM5pit5pm25p2+5qKi5qif5qi15rK85raI5riJ5rmY54S854Sm54Wn55eH55yB56Gd56SB56Wl56ew56ug56yR57Kn57S56IKW6I+W6JKL6JWJ6KGd6KOz6Kif6Ki86KmU6Kmz6LGh6LOe6Yak6Ymm6Y2+6ZCY6Zqc6Z6Y5LiK5LiI5Lie5LmX5YaX5Ymw5Z+O5aC05aOM5ayi5bi45oOF5pO+5p2h5p2W5rWE54q255Wz56mj6JK46K2y6Ya46Yyg5Zix5Z+06aO+XCJdLFxuW1wiYmZhMVwiLFwi5out5qSN5q6W54et57mU6IG36Imy6Kem6aOf6J2V6L6x5bC75Ly45L+h5L615ZSH5aig5a+d5a+p5b+D5oWO5oyv5paw5pmL5qOu5qab5rW45rex55Sz55a555yf56We56em57Sz6Iej6Iqv6Jaq6Kaq6Ki66Lqr6L6b6YCy6Yed6ZyH5Lq65LuB5YiD5aG15aOs5bCL55Sa5bC96IWO6KiK6L+F6Zmj6Z2t56yl6KuP6aCI6YWi5Zuz5Y6o6YCX5ZC55Z6C5bil5o6o5rC054KK552h57KL57+g6KGw6YGC6YWU6YyQ6YyY6ZqP55Ge6auE5bSH5bWp5pWw5p6i6Lao6Zub5o2u5p2J5qSZ6I+F6aCX6ZuA6KO+XCJdLFxuW1wiYzBhMVwiLFwi5r6E5pG65a+45LiW54Cs55Wd5piv5YeE5Yi25Yui5aeT5b6B5oCn5oiQ5pS/5pW05pif5pm05qOy5qCW5q2j5riF54my55Sf55ub57K+6IGW5aOw6KO96KW/6Kqg6KqT6KuL6YCd6YaS6Z2S6Z2Z5paJ56iO6ISG6Zq75bit5oOc5oia5pal5piU5p6Q55+z56mN57GN57i+6ISK6LKs6LWk6Leh6Lmf56Kp5YiH5ouZ5o6l5pGC5oqY6Kit56qD56+A6Kqs6Zuq57W26IiM6J2J5LuZ5YWI5Y2D5Y2g5a6j5bCC5bCW5bed5oim5omH5pKw5qCT5qC05rOJ5rWF5rSX5p+T5r2c54WO54W95peL56m/566t57eaXCJdLFxuW1wiYzFhMVwiLFwi57mK576o6IW66Iib6Ii56Jam6Kmu6LOO6Le16YG46YG36Yqt6YqR6ZaD6a6u5YmN5ZaE5ry454S25YWo56aF57mV6Iaz57OO5ZmM5aGR5bKo5o6q5pu+5pu95qWa54uZ55aP55aO56SO56WW56ef57KX57Sg57WE6JiH6Ki06Zi76YGh6byg5YOn5Ym15Y+M5Y+i5YCJ5Zaq5aOu5aWP54i95a6L5bGk5Yyd5oOj5oOz5o2c5o6D5oy/5o675pON5pep5pu55bej5qeN5qe95ryV54el5LqJ55ep55u456qT57Of57eP57ac6IGh6I2J6I2Y6JGs6JK86Je76KOF6LWw6YCB6YGt6Y6X6Zyc6aiS5YOP5aKX5oaOXCJdLFxuW1wiYzJhMVwiLFwi6IeT6JS16LSI6YCg5L+D5YG05YmH5Y2z5oGv5o2J5p2f5ris6Laz6YCf5L+X5bGe6LOK5peP57aa5Y2S6KKW5YW25o+D5a2Y5a2r5bCK5pCN5p2R6YGc5LuW5aSa5aSq5rGw6KmR5ZS+5aCV5aal5oOw5omT5p+B6Ii15qWV6ZmA6aeE6aio5L2T5aCG5a++6ICQ5bKx5biv5b6F5oCg5oWL5oi05pu/5rOw5rue6IOO6IW/6IuU6KKL6LK46YCA6YCu6ZqK6bub6a+b5Luj5Y+w5aSn56ys6YaN6aGM6be55rud54Cn5Y2T5ZWE5a6F5omY5oqe5ouT5rKi5r+v55Ci6KiX6ZC45r+B6Ku+6Iy45Yen6Ju45Y+qXCJdLFxuW1wiYzNhMVwiLFwi5Y+p5L2G6YGU6L6w5aWq6ISx5be956uq6L6/5qOa6LC354u46bGI5qi96Kqw5Li55Y2Y5ZiG5Z2m5ouF5o6i5pem5q2O5reh5rmb54Kt55+t56uv566q57a76IC96IOG6JuL6KqV6Y2b5Zuj5aOH5by+5pat5pqW5qqA5q6155S36KuH5YCk55+l5Zyw5byb5oGl5pm65rGg55e056ia572u6Ie06JyY6YGF6aaz56+J55Wc56u5562R6JOE6YCQ56ep56qS6Iy25auh552A5Lit5Luy5a6Z5b+g5oq95pi85p+x5rOo6Jmr6KG36Ki76YWO6Yuz6aeQ5qiX54Cm54yq6Iun6JGX6LKv5LiB5YWG5YeL5ZaL5a+1XCJdLFxuW1wiYzRhMVwiLFwi5biW5biz5bqB5byU5by15b2r5b605oey5oyR5pqi5pyd5r2u54mS55S655y66IG06IS56IW46J226Kq/6Kuc6LaF6Lez6Yqa6ZW36aCC6bOl5YuF5o2X55u05pyV5rKI54+N6LOD6Y6u6Zmz5rSl5aKc5qSO5qeM6L+96Y6a55eb6YCa5aGa5qCC5o605qe75L2D5rys5p+Y6L676JSm57a06Y2U5qS/5r2w5Z2q5aO35ays57Ss54iq5ZCK6Yej6ba05Lqt5L2O5YGc5YG15YmD6LKe5ZGI5aCk5a6a5bid5bqV5bqt5bu35byf5oKM5oq15oy65o+Q5qKv5rGA56KH56aO56iL57eg6ImH6KiC6Kum6LmE6YCTXCJdLFxuW1wiYzVhMVwiLFwi6YK46YSt6YeY6byO5rOl5pGY5pOi5pW15ru055qE56yb6YGp6Y+R5rq65ZOy5b655pKk6L2N6L+t6YmE5YW45aGr5aSp5bGV5bqX5re757qP55Sc6LK86Lui6aGb54K55Lyd5q6/5r6x55Sw6Zu75YWO5ZCQ5aC15aGX5aas5bGg5b6S5paX5p2c5rih55m76I+f6LOt6YCU6YO96Y2N56Cl56C65Yqq5bqm5Zyf5aW05oCS5YCS5YWa5Yas5YeN5YiA5ZSQ5aGU5aGY5aWX5a6V5bO25baL5oK85oqV5pCt5p2x5qGD5qK85qOf55uX5reY5rmv5rab54Gv54eI5b2T55eY56W3562J562U562S57OW57Wx5YiwXCJdLFxuW1wiYzZhMVwiLFwi6JGj6JWp6Jek6KiO6KyE6LGG6LiP6YCD6YCP6ZCZ6Zm26aCt6aiw6ZeY5YON5YuV5ZCM5aCC5bCO5oan5pKe5rSe556z56ul6IO06JCE6YGT6YqF5bOg6bSH5Yy/5b6X5b6z5rac54m5552j56a/56+k5q+S54us6Kqt5qCD5qmh5Ye456qB5qS05bGK6bO26Iur5a+F6YWJ54Ce5Zm45bGv5oOH5pWm5rKM6LGa6YGB6aCT5ZGR5puH6YiN5aWI6YKj5YaF5LmN5Yeq6JaZ6KyO54GY5o266Y2L5qWi6aa057iE55W35Y2X5qWg6Luf6Zuj5rGd5LqM5bC85byQ6L+p5YyC6LOR6IKJ6Jm55bu/5pel5Lmz5YWlXCJdLFxuW1wiYzdhMVwiLFwi5aaC5bC/6Z+u5Lu75aaK5b+N6KqN5r+h56aw56Wi5a+n6JGx54yr54ax5bm05b+15o275pKa54eD57KY5LmD5bu85LmL5Z+c5Zqi5oKp5r+D57SN6IO96ISz6Ia/6L6y6KaX6Jqk5be05oqK5pKt6KaH5p235rOi5rS+55C256C05amG57216Iqt6aas5L+z5buD5oud5o6S5pWX5p2v55uD54mM6IOM6IK66Lyp6YWN5YCN5Z+55aqS5qKF5qWz54Wk54u96LK35aOy6LOg6Zmq6YCZ6J2/56ek55+n6JCp5Lyv5Yml5Y2a5ouN5p+P5rOK55m9566U57KV6Ii26JaE6L+r5pud5ryg54iG57ib6I6r6aeB6bqmXCJdLFxuW1wiYzhhMVwiLFwi5Ye9566x56Gy56646IKH562I5quo5bmh6IKM55WR55Wg5YWr6Ymi5rqM55m66YaX6auq5LyQ572w5oqc562P6Zal6bOp5Zm65aGZ6Juk6Zq85Ly05Yik5Y2K5Y+N5Y+b5biG5pCs5paR5p2/5rC+5rGO54mI54qv54+t55WU57mB6Iis6Jep6LKp56+E6YeG54Wp6aCS6aOv5oy95pmp55Wq55uk56OQ6JWD6Juu5Yyq5Y2R5ZCm5aaD5bqH5b285oKy5omJ5om55oqr5paQ5q+U5rOM55ay55qu56KR56eY57eL57236IKl6KKr6Kq56LK76YG/6Z2e6aOb5qiL57C45YKZ5bC+5b6u5p6H5q+Y55C155yJ576OXCJdLFxuW1wiYzlhMVwiLFwi6by75p+K56iX5Yy555aL6aut5b2m6Iad6I+x6IKY5by85b+F55Wi562G6YC85qGn5aer5aqb57SQ55m+6Kys5L+15b2q5qiZ5rC35ryC55Oi56Wo6KGo6KmV6LG55buf5o+P55eF56eS6IuX6Yyo6Yuy6JKc6Jut6bCt5ZOB5b2s5paM5rWc54CV6LKn6LOT6aC75pWP55O25LiN5LuY5Z+g5aSr5amm5a+M5Yao5biD5bqc5oCW5om25pW35pan5pmu5rWu54i256ym6IWQ6Iaa6IqZ6K2c6LKg6LOm6LW06Zic6ZmE5L6u5pKr5q2m6Iie6JGh6JWq6YOo5bCB5qWT6aKo6JG66JWX5LyP5Ymv5b6p5bmF5pyNXCJdLFxuW1wiY2FhMVwiLFwi56aP6IW56KSH6KaG5re15byX5omV5rK45LuP54mp6a6S5YiG5ZC75Zm05aKz5oak5omu54Sa5aWu57KJ57Oe57Sb6Zuw5paH6IGe5LiZ5L215YW15aGA5bmj5bmz5byK5p+E5Lim6JS96ZaJ6Zmb57Gz6aCB5YO75aOB55mW56Kn5Yil556l6JSR566G5YGP5aSJ54mH56+H57eo6L666L+U6YGN5L6/5YuJ5aip5byB6Z6t5L+d6IiX6Yuq5ZyD5o2V5q2p55Sr6KOc6LyU56mC5Yuf5aKT5oWV5oiK5pqu5q+N57C/6I+p5YCj5L+45YyF5ZGG5aCx5aWJ5a6d5bOw5bOv5bSp5bqW5oqx5o2n5pS+5pa55pyLXCJdLFxuW1wiY2JhMVwiLFwi5rOV5rOh54O556Cy57ir6IOe6Iqz6JCM6JOs6JyC6KSS6Kiq6LGK6YKm6YuS6aO96bOz6bWs5LmP5Lqh5YKN5YmW5Z2K5aao5bi95b+Y5b+Z5oi/5pq05pyb5p+Q5qOS5YaS57Sh6IKq6Iao6KyA6LKM6LK/6Ym+6Ziy5ZCg6aCs5YyX5YOV5Y2c5aKo5pKy5py054mn552m56mG6Yem5YuD5rKh5q6G5aCA5bmM5aWU5pys57+75Yeh55uG5pGp56Oo6a2U6bq75Z+L5aa55pin5p6a5q+O5ZOp5qeZ5bmV6Iac5p6V6a6q5p++6bGS5qGd5Lqm5L+j5Y+I5oq55pyr5rKr6L+E5L6t57mt6bq/5LiH5oWi5rqAXCJdLFxuW1wiY2NhMVwiLFwi5ryr6JST5ZGz5pyq6a2F5bez566V5bKs5a+G6Jyc5rmK6JOR56iU6ISI5aaZ57KN5rCR55yg5YuZ5aSi54Sh54mf55+b6Zyn6bWh5qSL5am/5aiY5Yal5ZCN5ZG95piO55uf6L+36YqY6bO05aeq54md5ruF5YWN5qOJ57a/57es6Z2i6bq65pG45qih6IyC5aaE5a2f5q+b54yb55uy57ay6ICX6JKZ5YSy5pyo6buZ55uu5p2i5Yu/6aSF5bCk5oi757G+6LKw5ZWP5oK257SL6ZaA5YyB5Lmf5Ya25aSc54i66IC26YeO5byl55+i5Y6E5b2557SE6Jas6Kiz6LqN6Z2W5p+z6Jau6ZGT5oSJ5oSI5rK555mSXCJdLFxuW1wiY2RhMVwiLFwi6Kut6Ly45ZSv5L2R5YSq5YuH5Y+L5a6l5bm95oKg5oaC5o+W5pyJ5p+a5rmn5raM54y254y355Sx56WQ6KOV6KqY6YGK6YKR6YO16ZuE6J6N5aSV5LqI5L2Z5LiO6KqJ6Ly/6aCQ5YKt5bm85aaW5a655bq45o+a5o+65pOB5puc5qWK5qeY5rSL5rq254aU55So56qv576K6ICA6JGJ6JOJ6KaB6Kyh6LiK6YGl6Zm96aSK5oW+5oqR5qyy5rKD5rW057+M57+85reA576F6J666KO45p2l6I6x6aC86Zu35rSb57Wh6JC96YWq5Lmx5Y215bWQ5qyE5r+r6JeN6Jit6Kan5Yip5ZCP5bGl5p2O5qKo55CG55KDXCJdLFxuW1wiY2VhMVwiLFwi55ei6KOP6KOh6YeM6Zui6Zm45b6L546H56uL6JGO5o6g55Wl5YqJ5rWB5rqc55CJ55WZ56Gr57KS6ZqG56uc6b6N5L625oWu5peF6Jmc5LqG5Lqu5YOa5Lih5YeM5a+u5paZ5qKB5ra854yf55mC556t56ic57On6Imv6KuS6YG86YeP6Zm16aCY5Yqb57eR5YCr5Y6Y5p6X5reL54eQ55Cz6Ieo6Lyq6Zqj6bGX6bqf55Gg5aGB5raZ57Sv6aGe5Luk5Ly25L6L5Ya35Yqx5ba65oCc546y56S86IuT6Yi06Zq36Zu26ZyK6bqX6b2i5pqm5q205YiX5Yqj54OI6KOC5buJ5oGL5oaQ5ryj54WJ57C+57e06IGvXCJdLFxuW1wiY2ZhMVwiLFwi6JOu6YCj6Yys5ZGC6a2v5quT54KJ6LOC6Lev6Zyy5Yq05amB5buK5byE5pyX5qW85qaU5rWq5ryP54mi54u856+t6ICB6IG+6J2L6YOO5YWt6bqT56aE6IKL6Yyy6KuW5YCt5ZKM6Kmx5q2q6LOE6ISH5oOR5p6g6bey5LqZ5LqY6bCQ6Kmr6JeB6JWo5qSA5rm+56KX6IWVXCJdLFxuW1wiZDBhMVwiLFwi5byM5LiQ5LiV5Liq5Lix5Li25Li85Li/5LmC5LmW5LmY5LqC5LqF6LGr5LqK6IiS5byN5LqO5Lqe5Lqf5Lqg5Lqi5Lqw5Lqz5Lq25LuO5LuN5LuE5LuG5LuC5LuX5Lue5Lut5Luf5Lu35LyJ5L2a5Lyw5L2b5L2d5L2X5L2H5L225L6I5L6P5L6Y5L275L2p5L2w5L6R5L2v5L6G5L6W5YSY5L+U5L+f5L+O5L+Y5L+b5L+R5L+a5L+Q5L+k5L+l5YCa5YCo5YCU5YCq5YCl5YCF5Lyc5L+25YCh5YCp5YCs5L++5L+v5YCR5YCG5YGD5YGH5pyD5YGV5YGQ5YGI5YGa5YGW5YGs5YG45YKA5YKa5YKF5YK05YKyXCJdLFxuW1wiZDFhMVwiLFwi5YOJ5YOK5YKz5YOC5YOW5YOe5YOl5YOt5YOj5YOu5YO55YO15YSJ5YSB5YSC5YSW5YSV5YSU5YSa5YSh5YS65YS35YS85YS75YS/5YWA5YWS5YWM5YWU5YWi56u45YWp5YWq5YWu5YaA5YaC5ZuY5YaM5YaJ5YaP5YaR5YaT5YaV5YaW5Yak5Yam5Yai5Yap5Yaq5Yar5Yaz5Yax5Yay5Yaw5Ya15Ya95YeF5YeJ5Yeb5Yeg6JmV5Yep5Yet5Yew5Ye15Ye+5YiE5YiL5YiU5YiO5Yin5Yiq5Yiu5Yiz5Yi55YmP5YmE5YmL5YmM5Yme5YmU5Ymq5Ym05Ymp5Ymz5Ym/5Ym95YqN5YqU5YqS5Ymx5YqI5YqR6L6oXCJdLFxuW1wiZDJhMVwiLFwi6L6n5Yqs5Yqt5Yq85Yq15YuB5YuN5YuX5Yue5Yuj5Yum6aOt5Yug5Yuz5Yu15Yu45Yu55YyG5YyI55S45YyN5YyQ5YyP5YyV5Yya5Yyj5Yyv5Yyx5Yyz5Yy45Y2A5Y2G5Y2F5LiX5Y2J5Y2N5YeW5Y2e5Y2p5Y2u5aSY5Y275Y235Y6C5Y6W5Y6g5Y6m5Y6l5Y6u5Y6w5Y625Y+D57CS6ZuZ5Y+f5pu854eu5Y+u5Y+o5Y+t5Y+65ZCB5ZC95ZGA5ZCs5ZCt5ZC85ZCu5ZC25ZCp5ZCd5ZGO5ZKP5ZG15ZKO5ZGf5ZGx5ZG35ZGw5ZKS5ZG75ZKA5ZG25ZKE5ZKQ5ZKG5ZOH5ZKi5ZK45ZKl5ZKs5ZOE5ZOI5ZKoXCJdLFxuW1wiZDNhMVwiLFwi5ZKr5ZOC5ZKk5ZK+5ZK85ZOY5ZOl5ZOm5ZSP5ZSU5ZO95ZOu5ZOt5ZO65ZOi5ZS55ZWA5ZWj5ZWM5ZSu5ZWc5ZWF5ZWW5ZWX5ZS45ZSz5ZWd5ZaZ5ZaA5ZKv5ZaK5Zaf5ZW75ZW+5ZaY5Zae5Zau5ZW85ZaD5Zap5ZaH5Zao5Zea5ZeF5Zef5ZeE5Zec5Zek5ZeU5ZiU5Ze35ZiW5Ze+5Ze95Zib5Ze55ZmO5ZmQ54ef5Zi05Zi25Ziy5Zi45Zmr5Zmk5Ziv5Zms5Zmq5ZqG5ZqA5ZqK5Zqg5ZqU5ZqP5Zql5Zqu5Zq25Zq05ZuC5Zq85ZuB5ZuD5ZuA5ZuI5ZuO5ZuR5ZuT5ZuX5Zuu5Zu55ZyA5Zu/5ZyE5ZyJXCJdLFxuW1wiZDRhMVwiLFwi5ZyI5ZyL5ZyN5ZyT5ZyY5ZyW5ZeH5Zyc5Zym5Zy35Zy45Z2O5Zy75Z2A5Z2P5Z2p5Z+A5Z6I5Z2h5Z2/5Z6J5Z6T5Z6g5Z6z5Z6k5Z6q5Z6w5Z+D5Z+G5Z+U5Z+S5Z+T5aCK5Z+W5Z+j5aCL5aCZ5aCd5aGy5aCh5aGi5aGL5aGw5q+A5aGS5aC95aG55aKF5aK55aKf5aKr5aK65aOe5aK75aK45aKu5aOF5aOT5aOR5aOX5aOZ5aOY5aOl5aOc5aOk5aOf5aOv5aO65aO55aO75aO85aO95aSC5aSK5aSQ5aSb5qKm5aSl5aSs5aSt5aSy5aS45aS+56uS5aWV5aWQ5aWO5aWa5aWY5aWi5aWg5aWn5aWs5aWpXCJdLFxuW1wiZDVhMVwiLFwi5aW45aaB5aad5L2e5L6r5aaj5aay5aeG5aeo5aec5aaN5aeZ5aea5ail5aif5aiR5aic5aiJ5aia5amA5ams5amJ5ai15ai25ami5amq5aqa5aq85aq+5auL5auC5aq95auj5auX5aum5aup5auW5au65au75ayM5ayL5ayW5ayy5auQ5ayq5ay25ay+5a2D5a2F5a2A5a2R5a2V5a2a5a2b5a2l5a2p5a2w5a2z5a215a245paI5a265a6A5a6D5a6m5a645a+D5a+H5a+J5a+U5a+Q5a+k5a+m5a+i5a+e5a+l5a+r5a+w5a+25a+z5bCF5bCH5bCI5bCN5bCT5bCg5bCi5bCo5bC45bC55bGB5bGG5bGO5bGTXCJdLFxuW1wiZDZhMVwiLFwi5bGQ5bGP5a2x5bGs5bGu5Lmi5bG25bG55bKM5bKR5bKU5aab5bKr5bK75bK25bK85bK35bOF5bK+5bOH5bOZ5bOp5bO95bO65bOt5baM5bOq5bSL5bSV5bSX5bWc5bSf5bSb5bSR5bSU5bSi5bSa5bSZ5bSY5bWM5bWS5bWO5bWL5bWs5bWz5bW25baH5baE5baC5bai5bad5bas5bau5ba95baQ5ba35ba85beJ5beN5beT5beS5beW5beb5ber5bey5be15biL5bia5biZ5biR5bib5bi25bi35bmE5bmD5bmA5bmO5bmX5bmU5bmf5bmi5bmk5bmH5bm15bm25bm66bq85bm/5bqg5buB5buC5buI5buQ5buPXCJdLFxuW1wiZDdhMVwiLFwi5buW5buj5bud5bua5bub5bui5buh5buo5bup5bus5bux5buz5buw5bu05bu45bu+5byD5byJ5b2d5b2c5byL5byR5byW5byp5byt5by45b2B5b2I5b2M5b2O5byv5b2R5b2W5b2X5b2Z5b2h5b2t5b2z5b235b6D5b6C5b2/5b6K5b6I5b6R5b6H5b6e5b6Z5b6Y5b6g5b6o5b6t5b685b+W5b+75b+k5b+45b+x5b+d5oKz5b+/5oCh5oGg5oCZ5oCQ5oCp5oCO5oCx5oCb5oCV5oCr5oCm5oCP5oC65oGa5oGB5oGq5oG35oGf5oGK5oGG5oGN5oGj5oGD5oGk5oGC5oGs5oGr5oGZ5oKB5oKN5oOn5oKD5oKaXCJdLFxuW1wiZDhhMVwiLFwi5oKE5oKb5oKW5oKX5oKS5oKn5oKL5oOh5oK45oOg5oOT5oK05b+w5oK95oOG5oK15oOY5oWN5oSV5oSG5oO25oO35oSA5oO05oO65oSD5oSh5oO75oOx5oSN5oSO5oWH5oS+5oSo5oSn5oWK5oS/5oS85oSs5oS05oS95oWC5oWE5oWz5oW35oWY5oWZ5oWa5oWr5oW05oWv5oWl5oWx5oWf5oWd5oWT5oW15oaZ5oaW5oaH5oas5oaU5oaa5oaK5oaR5oar5oau5oeM5oeK5oeJ5oe35oeI5oeD5oeG5oa65oeL57255oeN5oem5oej5oe25oe65oe05oe/5oe95oe85oe+5oiA5oiI5oiJ5oiN5oiM5oiU5oibXCJdLFxuW1wiZDlhMVwiLFwi5oie5oih5oiq5oiu5oiw5oiy5oiz5omB5omO5ome5omj5omb5omg5omo5om85oqC5oqJ5om+5oqS5oqT5oqW5ouU5oqD5oqU5ouX5ouR5oq75ouP5ou/5ouG5pOU5ouI5ouc5ouM5ouK5ouC5ouH5oqb5ouJ5oyM5ouu5oux5oyn5oyC5oyI5ouv5ou15o2Q5oy+5o2N5pCc5o2P5o6W5o6O5o6A5o6r5o225o6j5o6P5o6J5o6f5o615o2r5o2p5o6+5o+p5o+A5o+G5o+j5o+J5o+S5o+25o+E5pCW5pC05pCG5pCT5pCm5pC25pSd5pCX5pCo5pCP5pGn5pGv5pG25pGO5pSq5pKV5pKT5pKl5pKp5pKI5pK8XCJdLFxuW1wiZGFhMVwiLFwi5pOa5pOS5pOF5pOH5pK75pOY5pOC5pOx5pOn6IiJ5pOg5pOh5oqs5pOj5pOv5pSs5pO25pO05pOy5pO65pSA5pO95pSY5pSc5pSF5pSk5pSj5pSr5pS05pS15pS35pS25pS455WL5pWI5pWW5pWV5pWN5pWY5pWe5pWd5pWy5pW45paC5paD6K6K5pab5paf5par5pa35peD5peG5peB5peE5peM5peS5peb5peZ5peg5peh5pex5p2y5piK5piD5pe75p2z5pi15pi25pi05pic5pmP5pmE5pmJ5pmB5pme5pmd5pmk5pmn5pmo5pmf5pmi5pmw5pqD5pqI5pqO5pqJ5pqE5pqY5pqd5puB5pq55puJ5pq+5pq8XCJdLFxuW1wiZGJhMVwiLFwi5puE5pq45puW5pua5pug5pi/5pum5pup5puw5pu15pu35pyP5pyW5pye5pym5pyn6Zy45pyu5py/5py25p2B5py45py35p2G5p2e5p2g5p2Z5p2j5p2k5p6J5p2w5p6p5p285p2q5p6M5p6L5p6m5p6h5p6F5p635p+v5p605p+s5p6z5p+p5p645p+k5p+e5p+d5p+i5p+u5p655p+O5p+G5p+n5qqc5qCe5qGG5qCp5qGA5qGN5qCy5qGO5qKz5qCr5qGZ5qGj5qG35qG/5qKf5qKP5qKt5qKU5qKd5qKb5qKD5qqu5qK55qG05qK15qKg5qK65qSP5qKN5qG+5qSB5qOK5qSI5qOY5qSi5qSm5qOh5qSM5qONXCJdLFxuW1wiZGNhMVwiLFwi5qOU5qOn5qOV5qS25qSS5qSE5qOX5qOj5qSl5qO55qOg5qOv5qSo5qSq5qSa5qSj5qSh5qOG5qW55qW35qWc5qW45qWr5qWU5qW+5qWu5qS55qW05qS95qWZ5qSw5qWh5qWe5qWd5qaB5qWq5qay5qau5qeQ5qa/5qeB5qeT5qa+5qeO5a+o5qeK5qed5qa75qeD5qan5qiu5qaR5qag5qac5qaV5qa05qee5qeo5qiC5qib5qe/5qyK5qe55qey5qen5qiF5qax5qie5qet5qiU5qer5qiK5qiS5quB5qij5qiT5qmE5qiM5qmy5qi25qm45qmH5qmi5qmZ5qmm5qmI5qi45qii5qqQ5qqN5qqg5qqE5qqi5qqjXCJdLFxuW1wiZGRhMVwiLFwi5qqX6JiX5qq75quD5quC5qq45qqz5qqs5que5quR5quf5qqq5qua5quq5qu75qyF6JiW5qu65qyS5qyW6ayx5qyf5qy45qy355uc5qy56aOu5q2H5q2D5q2J5q2Q5q2Z5q2U5q2b5q2f5q2h5q245q255q2/5q6A5q6E5q6D5q6N5q6Y5q6V5q6e5q6k5q6q5q6r5q6v5q6y5q6x5q6z5q635q685q+G5q+L5q+T5q+f5q+s5q+r5q+z5q+v6bq+5rCI5rCT5rCU5rCb5rCk5rCj5rGe5rGV5rGi5rGq5rKC5rKN5rKa5rKB5rKb5rG+5rGo5rGz5rKS5rKQ5rOE5rOx5rOT5rK95rOX5rOF5rOd5rKu5rKx5rK+XCJdLFxuW1wiZGVhMVwiLFwi5rK65rOb5rOv5rOZ5rOq5rSf6KGN5rS25rSr5rS95rS45rSZ5rS15rSz5rSS5rSM5rWj5raT5rWk5rWa5rW55rWZ5raO5raV5r+k5raF5re55riV5riK5ra15reH5rem5ra45reG5res5ree5reM5reo5reS5reF5re65reZ5rek5reV5req5reu5rit5rmu5riu5riZ5rmy5rmf5ri+5rij5rmr5rir5rm25rmN5rif5rmD5ri65rmO5rik5ru/5rid5ri45rqC5rqq5rqY5ruJ5rq35ruT5rq95rqv5ruE5rqy5ruU5ruV5rqP5rql5ruC5rqf5r2B5ryR54GM5rus5ru45ru+5ry/5ruy5ryx5ruv5ryy5ruMXCJdLFxuW1wiZGZhMVwiLFwi5ry+5ryT5ru35r6G5r265r245r6B5r6A5r2v5r2b5r+z5r2t5r6C5r285r2Y5r6O5r6R5r+C5r2m5r6z5r6j5r6h5r6k5r655r+G5r6q5r+f5r+V5r+s5r+U5r+Y5r+x5r+u5r+b54CJ54CL5r+654CR54CB54CP5r++54Cb54Ca5r2054Cd54CY54Cf54Cw54C+54Cy54GR54Gj54KZ54KS54Kv54Ox54Ks54K454Kz54Ku54Of54OL54Od54OZ54SJ54O954Sc54SZ54Wl54WV54aI54Wm54Wi54WM54WW54Ws54aP54e754aE54aV54ao54as54eX54a554a+54eS54eJ54eU54eO54eg54es54en54e154e8XCJdLFxuW1wiZTBhMVwiLFwi54e554e/54iN54iQ54ib54io54it54is54iw54iy54i754i854i/54mA54mG54mL54mY54m054m+54qC54qB54qH54qS54qW54qi54qn54q554qy54uD54uG54uE54uO54uS54ui54ug54uh54u554u35YCP54yX54yK54yc54yW54yd54y054yv54yp54yl54y+542O542P6buY542X542q542o542w542454215427542654+I546z54+O546754+A54+l54+u54+e55Ki55CF55Gv55Cl54+455Cy55C655GV55C/55Gf55GZ55GB55Gc55Gp55Gw55Gj55Gq55G255G+55KL55Ke55Kn55OK55OP55OU54+xXCJdLFxuW1wiZTFhMVwiLFwi55Og55Oj55On55Op55Ou55Oy55Ow55Ox55O455O355SE55SD55SF55SM55SO55SN55SV55ST55Se55Sm55Ss55S855WE55WN55WK55WJ55Wb55WG55Wa55Wp55Wk55Wn55Wr55Wt55W455W255aG55aH55W055aK55aJ55aC55aU55aa55ad55al55aj55eC55az55eD55a155a955a455a855ax55eN55eK55eS55eZ55ej55ee55e+55e/55e855iB55ew55e655ey55ez55iL55iN55iJ55if55in55ig55ih55ii55ik55i055iw55i755mH55mI55mG55mc55mY55mh55mi55mo55mp55mq55mn55ms55mwXCJdLFxuW1wiZTJhMVwiLFwi55my55m255m455m855qA55qD55qI55qL55qO55qW55qT55qZ55qa55qw55q055q455q555q655uC55uN55uW55uS55ue55uh55ul55un55uq6Jiv55u755yI55yH55yE55yp55yk55ye55yl55ym55yb55y355y4552H552a552o552r552b552l552/552+5525556O556L556R556g556e556w55625565556/55685569556755+H55+N55+X55+a55+c55+j55+u55+856CM56CS56Sm56Cg56Sq56GF56KO56G056KG56G856Ka56KM56Kj56K156Kq56Kv56OR56OG56OL56OU56K+56K856OF56OK56OsXCJdLFxuW1wiZTNhMVwiLFwi56On56Oa56O956O056SH56SS56SR56SZ56Ss56Sr56WA56Wg56WX56Wf56Wa56WV56WT56W656W/56aK56ad56an6b2L56aq56au56az56a556a656eJ56eV56en56es56eh56ej56iI56iN56iY56iZ56ig56if56aA56ix56i756i+56i356mD56mX56mJ56mh56mi56mp6b6d56mw56m556m956qI56qX56qV56qY56qW56qp56uI56qw56q256uF56uE56q/6YKD56uH56uK56uN56uP56uV56uT56uZ56ua56ud56uh56ui56um56ut56uw56yC56yP56yK56yG56yz56yY56yZ56ye56y156yo56y2562QXCJdLFxuW1wiZTRhMVwiLFwi562656yE562N56yL562M562F5621562l5620562n562w562x562s562u566d566Y566f566N566c566a566L566S566P562d566Z56+L56+B56+M56+P566056+G56+d56+p57CR57CU56+m56+l57Gg57CA57CH57CT56+z56+357CX57CN56+257Cj57Cn57Cq57Cf57C357Cr57C957GM57GD57GU57GP57GA57GQ57GY57Gf57Gk57GW57Gl57Gs57G157KD57KQ57Kk57Kt57Ki57Kr57Kh57Ko57Kz57Ky57Kx57Ku57K557K957OA57OF57OC57OY57OS57Oc57Oi6ay757Ov57Oy57O057O257O657SGXCJdLFxuW1wiZTVhMVwiLFwi57SC57Sc57SV57SK57WF57WL57Su57Sy57S/57S157WG57Wz57WW57WO57Wy57Wo57Wu57WP57Wj57aT57aJ57Wb57aP57W957ab57a657au57aj57a157eH57a957ar57i957ai57av57ec57a457af57aw57eY57ed57ek57ee57e757ey57eh57iF57iK57ij57ih57iS57ix57if57iJ57iL57ii57mG57mm57i757i157i557mD57i357iy57i657mn57md57mW57me57mZ57ma57m557mq57mp57m857m757qD57eV57m96L6u57m/57qI57qJ57qM57qS57qQ57qT57qU57qW57qO57qb57qc57y457y6XCJdLFxuW1wiZTZhMVwiLFwi572F572M572N572O572Q572R572V572U572Y572f572g572o572p572n5724576C576G576D576I576H576M576U576e576d576a576j576v576y5765576u576257646K2x57+F57+G57+K57+V57+U57+h57+m57+p57+z57+56aOc6ICG6ICE6ICL6ICS6ICY6ICZ6ICc6ICh6ICo6IC/6IC76IGK6IGG6IGS6IGY6IGa6IGf6IGi6IGo6IGz6IGy6IGw6IG26IG56IG96IG/6IKE6IKG6IKF6IKb6IKT6IKa6IKt5YaQ6IKs6IOb6IOl6IOZ6IOd6IOE6IOa6IOW6ISJ6IOv6IOx6ISb6ISp6ISj6ISv6IWLXCJdLFxuW1wiZTdhMVwiLFwi6ZqL6IWG6IS+6IWT6IWR6IO86IWx6IWu6IWl6IWm6IW06IaD6IaI6IaK6IaA6IaC6Iag6IaV6Iak6Iaj6IWf6IaT6Iap6Iaw6Ia16Ia+6Ia46Ia96IeA6IeC6Ia66IeJ6IeN6IeR6IeZ6IeY6IeI6Iea6Ief6Ieg6Ien6Ie66Ie76Ie+6IiB6IiC6IiF6IiH6IiK6IiN6IiQ6IiW6Iip6Iir6Ii46Iiz6ImA6ImZ6ImY6Imd6Ima6Imf6Imk6Imi6Imo6Imq6Imr6Iiu6Imx6Im36Im46Im+6IqN6IqS6Iqr6Iqf6Iq76Iqs6Iuh6Iuj6Iuf6IuS6Iu06Iuz6Iu66I6T6IyD6Iu76Iu56Iue6IyG6Iuc6IyJ6IuZXCJdLFxuW1wiZThhMVwiLFwi6Iy16Iy06IyW6Iyy6Iyx6I2A6Iy56I2Q6I2F6Iyv6Iyr6IyX6IyY6I6F6I6a6I6q6I6f6I6i6I6W6Iyj6I6O6I6H6I6K6I286I616I2z6I216I6g6I6J6I6o6I+06JCT6I+r6I+O6I+96JCD6I+Y6JCL6I+B6I+36JCH6I+g6I+y6JCN6JCi6JCg6I696JC46JSG6I+76JGt6JCq6JC86JWa6JKE6JG36JGr6JKt6JGu6JKC6JGp6JGG6JCs6JGv6JG56JC16JOK6JGi6JK56JK/6JKf6JOZ6JON6JK76JOa6JOQ6JOB6JOG6JOW6JKh6JSh6JO/6JO06JSX6JSY6JSs6JSf6JSV6JSU6JO86JWA6JWj6JWY6JWIXCJdLFxuW1wiZTlhMVwiLFwi6JWB6JiC6JWL6JWV6JaA6Jak6JaI6JaR6JaK6Jao6JWt6JaU6Jab6Jeq6JaH6Jac6JW36JW+6JaQ6JeJ6Ja66JeP6Ja56JeQ6JeV6Jed6Jel6Jec6Je56JiK6JiT6JiL6Je+6Je66JiG6Jii6Jia6Jiw6Ji/6JmN5LmV6JmU6Jmf6Jmn6Jmx6JqT6Jqj6Jqp6Jqq6JqL6JqM6Jq26Jqv6JuE6JuG6Jqw6JuJ6KCj6Jqr6JuU6Jue6Jup6Jus6Juf6Jub6Juv6JyS6JyG6JyI6JyA6JyD6Ju76JyR6JyJ6JyN6Ju56JyK6Jy06Jy/6Jy36Jy76Jyl6Jyp6Jya6J2g6J2f6J246J2M6J2O6J206J2X6J2o6J2u6J2ZXCJdLFxuW1wiZWFhMVwiLFwi6J2T6J2j6J2q6KCF6J6i6J6f6J6C6J6v6J+L6J696J+A6J+Q6ZuW6J6r6J+E6J6z6J+H6J+G6J676J+v6J+y6J+g6KCP6KCN6J++6J+26J+36KCO6J+S6KCR6KCW6KCV6KCi6KCh6KCx6KC26KC56KCn6KC76KGE6KGC6KGS6KGZ6KGe6KGi6KGr6KKB6KG+6KKe6KG16KG96KK16KGy6KKC6KKX6KKS6KKu6KKZ6KKi6KKN6KKk6KKw6KK/6KKx6KOD6KOE6KOU6KOY6KOZ6KOd6KO56KSC6KO86KO06KOo6KOy6KSE6KSM6KSK6KST6KWD6KSe6KSl6KSq6KSr6KWB6KWE6KS76KS26KS46KWM6KSd6KWg6KWeXCJdLFxuW1wiZWJhMVwiLFwi6KWm6KWk6KWt6KWq6KWv6KW06KW36KW+6KaD6KaI6KaK6KaT6KaY6Kah6Kap6Kam6Kas6Kav6Kay6Ka66Ka96Ka/6KeA6Kea6Kec6Ked6Ken6Ke06Ke46KiD6KiW6KiQ6KiM6Kib6Kid6Kil6Ki26KmB6Kmb6KmS6KmG6KmI6Km86Kmt6Kms6Kmi6KqF6KqC6KqE6Kqo6Kqh6KqR6Kql6Kqm6Kqa6Kqj6KuE6KuN6KuC6Kua6Kur6Kuz6Kun6Kuk6Kux6KyU6Kug6Kui6Ku36Kue6Kub6KyM6KyH6Kya6Kuh6KyW6KyQ6KyX6Kyg6Kyz6Z6r6Kym6Kyr6Ky+6Kyo6K2B6K2M6K2P6K2O6K2J6K2W6K2b6K2a6K2rXCJdLFxuW1wiZWNhMVwiLFwi6K2f6K2s6K2v6K206K296K6A6K6M6K6O6K6S6K6T6K6W6K6Z6K6a6LC66LGB6LC/6LGI6LGM6LGO6LGQ6LGV6LGi6LGs6LG46LG66LKC6LKJ6LKF6LKK6LKN6LKO6LKU6LG86LKY5oid6LKt6LKq6LK96LKy6LKz6LKu6LK26LOI6LOB6LOk6LOj6LOa6LO96LO66LO76LSE6LSF6LSK6LSH6LSP6LSN6LSQ6b2O6LST6LON6LSU6LSW6LWn6LWt6LWx6LWz6LaB6LaZ6LeC6La+6La66LeP6Lea6LeW6LeM6Leb6LeL6Leq6Ler6Lef6Lej6Le86LiI6LiJ6Le/6Lid6Lie6LiQ6Lif6LmC6Li16Liw6Li06LmKXCJdLFxuW1wiZWRhMVwiLFwi6LmH6LmJ6LmM6LmQ6LmI6LmZ6Lmk6Lmg6Liq6Lmj6LmV6Lm26Lmy6Lm86LqB6LqH6LqF6LqE6LqL6LqK6LqT6LqR6LqU6LqZ6Lqq6Lqh6Lqs6Lqw6LuG6Lqx6Lq+6LuF6LuI6LuL6Lub6Luj6Lu86Lu76Lur6Lu+6LyK6LyF6LyV6LyS6LyZ6LyT6Lyc6Lyf6Lyb6LyM6Lym6Lyz6Ly76Ly56L2F6L2C6Ly+6L2M6L2J6L2G6L2O6L2X6L2c6L2i6L2j6L2k6L6c6L6f6L6j6L6t6L6v6L636L+a6L+l6L+i6L+q6L+v6YKH6L+06YCF6L+56L+66YCR6YCV6YCh6YCN6YCe6YCW6YCL6YCn6YC26YC16YC56L+4XCJdLFxuW1wiZWVhMVwiLFwi6YGP6YGQ6YGR6YGS6YCO6YGJ6YC+6YGW6YGY6YGe6YGo6YGv6YG26Zqo6YGy6YKC6YG96YKB6YKA6YKK6YKJ6YKP6YKo6YKv6YKx6YK16YOi6YOk5omI6YOb6YSC6YSS6YSZ6YSy6YSw6YWK6YWW6YWY6YWj6YWl6YWp6YWz6YWy6YaL6YaJ6YaC6Yai6Yar6Yav6Yaq6Ya16Ya06Ya66YeA6YeB6YeJ6YeL6YeQ6YeW6Yef6Yeh6Yeb6Ye86Ye16Ye26Yie6Ye/6YiU6Yis6YiV6YiR6Yme6YmX6YmF6YmJ6Ymk6YmI6YqV6Yi/6YmL6YmQ6Yqc6YqW6YqT6Yqb6Yma6YuP6Yq56Yq36Yup6YyP6Yu66Y2E6YyuXCJdLFxuW1wiZWZhMVwiLFwi6YyZ6Yyi6Yya6Yyj6Yy66Yy16Yy76Y2c6Y2g6Y286Y2u6Y2W6Y6w6Y6s6Y6t6Y6U6Y656Y+W6Y+X6Y+o6Y+l6Y+Y6Y+D6Y+d6Y+Q6Y+I6Y+k6ZCa6ZCU6ZCT6ZCD6ZCH6ZCQ6ZC26ZCr6ZC16ZCh6ZC66ZGB6ZGS6ZGE6ZGb6ZGg6ZGi6ZGe6ZGq6Yip6ZGw6ZG16ZG36ZG96ZGa6ZG86ZG+6ZKB6ZG/6ZaC6ZaH6ZaK6ZaU6ZaW6ZaY6ZaZ6Zag6Zao6Zan6Zat6Za86Za76Za56Za+6ZeK5r+26ZeD6ZeN6ZeM6ZeV6ZeU6ZeW6Zec6Zeh6Zel6Zei6Zih6Zio6Ziu6Ziv6ZmC6ZmM6ZmP6ZmL6Zm36Zmc6ZmeXCJdLFxuW1wiZjBhMVwiLFwi6Zmd6Zmf6Zmm6Zmy6Zms6ZqN6ZqY6ZqV6ZqX6Zqq6Zqn6Zqx6Zqy6Zqw6Zq06Zq26Zq46Zq56ZuO6ZuL6ZuJ6ZuN6KWN6Zuc6ZyN6ZuV6Zu56ZyE6ZyG6ZyI6ZyT6ZyO6ZyR6ZyP6ZyW6ZyZ6Zyk6Zyq6Zyw6Zy56Zy96Zy+6Z2E6Z2G6Z2I6Z2C6Z2J6Z2c6Z2g6Z2k6Z2m6Z2o5YuS6Z2r6Z2x6Z256Z6F6Z286Z6B6Z266Z6G6Z6L6Z6P6Z6Q6Z6c6Z6o6Z6m6Z6j6Z6z6Z606Z+D6Z+G6Z+I6Z+L6Z+c6Z+t6b2P6Z+y56uf6Z+26Z+16aCP6aCM6aC46aCk6aCh6aC36aC96aGG6aGP6aGL6aGr6aGv6aGwXCJdLFxuW1wiZjFhMVwiLFwi6aGx6aG06aGz6aKq6aKv6aKx6aK26aOE6aOD6aOG6aOp6aOr6aSD6aSJ6aSS6aSU6aSY6aSh6aSd6aSe6aSk6aSg6aSs6aSu6aS96aS+6aWC6aWJ6aWF6aWQ6aWL6aWR6aWS6aWM6aWV6aaX6aaY6aal6aat6aau6aa86aef6aeb6aed6aeY6aeR6aet6aeu6aex6aey6ae76ae46aiB6aiP6aiF6aei6aiZ6air6ai36amF6amC6amA6amD6ai+6amV6amN6amb6amX6amf6ami6aml6amk6amp6amr6amq6aqt6aqw6aq86auA6auP6auR6auT6auU6aue6auf6aui6auj6aum6auv6aur6auu6au06aux6au3XCJdLFxuW1wiZjJhMVwiLFwi6au76ayG6ayY6aya6ayf6ayi6ayj6ayl6ayn6ayo6ayp6ayq6ayu6ayv6ayy6a2E6a2D6a2P6a2N6a2O6a2R6a2Y6a206a6T6a6D6a6R6a6W6a6X6a6f6a6g6a6o6a606a+A6a+K6a656a+G6a+P6a+R6a+S6a+j6a+i6a+k6a+U6a+h6bC66a+y6a+x6a+w6bCV6bCU6bCJ6bCT6bCM6bCG6bCI6bCS6bCK6bCE6bCu6bCb6bCl6bCk6bCh6bCw6bGH6bCy6bGG6bC+6bGa6bGg6bGn6bG26bG46bOn6bOs6bOw6bSJ6bSI6bOr6bSD6bSG6bSq6bSm6bav6bSj6bSf6bWE6bSV6bSS6bWB6bS/6bS+6bWG6bWIXCJdLFxuW1wiZjNhMVwiLFwi6bWd6bWe6bWk6bWR6bWQ6bWZ6bWy6baJ6baH6bar6bWv6bW66baa6bak6bap6bay6beE6beB6ba76ba46ba66beG6beP6beC6beZ6beT6be46bem6bet6bev6be96bia6bib6bie6bm16bm56bm96bqB6bqI6bqL6bqM6bqS6bqV6bqR6bqd6bql6bqp6bq46bqq6bqt6Z2h6buM6buO6buP6buQ6buU6buc6bue6bud6bug6bul6buo6buv6bu06bu26bu36bu56bu76bu86bu96byH6byI55q36byV6byh6bys6by+6b2K6b2S6b2U6b2j6b2f6b2g6b2h6b2m6b2n6b2s6b2q6b236b2y6b226b6V6b6c6b6gXCJdLFxuW1wiZjRhMVwiLFwi5aCv5qeH6YGZ55Gk5Yec54aZXCJdLFxuW1wiZjlhMVwiLFwi57qK6KSc6Y2I6YqI6JOc5L+J54K75pix5qOI6Yu55pu75b2F5Lio5Luh5Lu85LyA5LyD5Ly55L2W5L6S5L6K5L6a5L6U5L+N5YGA5YCi5L+/5YCe5YGG5YGw5YGC5YKU5YO05YOY5YWK5YWk5Yad5Ya+5Yes5YiV5Yqc5Yqm5YuA5Yub5YyA5YyH5Yyk5Y2y5Y6T5Y6y5Y+d76iO5ZKc5ZKK5ZKp5ZO/5ZaG5Z2Z5Z2l5Z6s5Z+I5Z+H76iP76iQ5aKe5aKy5aSL5aWT5aWb5aWd5aWj5aak5aa65a2W5a+A55Sv5a+Y5a+s5bCe5bKm5bK65bO15bSn5bWT76iR5bWC5bWt5ba45ba55beQ5byh5by05b2n5b63XCJdLFxuW1wiZmFhMVwiLFwi5b+e5oGd5oKF5oKK5oOe5oOV5oSg5oOy5oSR5oS35oSw5oaY5oiT5oqm5o+15pGg5pKd5pOO5pWO5piA5piV5pi75piJ5piu5pie5pik5pml5pmX5pmZ76iS5pmz5pqZ5pqg5pqy5pq/5pu65pyO76Sp5p2m5p675qGS5p+A5qCB5qGE5qOP76iT5qWo76iU5qaY5qei5qiw5qmr5qmG5qmz5qm+5qui5quk5q+W5rC/5rGc5rKG5rGv5rOa5rSE5raH5rWv5raW5ras5reP5re45rey5re85ri55rmc5rin5ri85rq/5r6I5r615r+154CF54CH54Co54KF54Kr54SP54SE54Wc54WG54WH76iV54eB54e+54qxXCJdLFxuW1wiZmJhMVwiLFwi54q+54yk76iW5423546954+J54+W54+j54+S55CH54+155Cm55Cq55Cp55Cu55Gi55KJ55Kf55SB55Wv55qC55qc55qe55qb55qm76iX552G5Yqv56Ch56GO56Gk56G656Sw76iY76iZ76ia56aU76ib56ab56uR56un76ic56ur566e76id57WI57Wc57a357ag57eW57mS572H576h76ie6IyB6I2i6I2/6I+H6I+26JGI6JK06JWT6JWZ6JWr76if6Jaw76ig76ih6KCH6KO16KiS6Ki36Km56Kqn6Kq+6Kuf76ii6Ku26K2T6K2/6LOw6LO06LSS6LW276ij6LuP76ik76il6YGn6YOe76im6YSV6YSn6YeaXCJdLFxuW1wiZmNhMVwiLFwi6YeX6Yee6Yet6Yeu6Yek6Yel6YiG6YiQ6YiK6Yi66YmA6Yi86YmO6YmZ6YmR6Yi56Ymn6Yqn6Ym36Ym46Yun6YuX6YuZ6YuQ76in6YuV6Yug6YuT6Yyl6Yyh6Yu776io6Yye6Yu/6Yyd6YyC6Y2w6Y2X6Y6k6Y+G6Y+e6Y+46ZCx6ZGF6ZGI6ZaS76ec76ip6Zqd6Zqv6Zyz6Zy76Z2D6Z2N6Z2P6Z2R6Z2V6aGX6aGl76iq76ir6aSn76is6aae6amO6auZ6auc6a216a2y6a6P6a6x6a676bCA6bWw6bWr76it6biZ6buRXCJdLFxuW1wiZmNmMVwiLFwi4oWwXCIsOSxcIu+/ou+/pO+8h++8glwiXSxcbltcIjhmYTJhZlwiLFwiy5jLh8K4y5nLncKvy5vLmu+9ns6EzoVcIl0sXG5bXCI4ZmEyYzJcIixcIsKhwqbCv1wiXSxcbltcIjhmYTJlYlwiLFwiwrrCqsKpwq7ihKLCpOKEllwiXSxcbltcIjhmYTZlMVwiLFwizobOiM6JzorOqlwiXSxcbltcIjhmYTZlN1wiLFwizoxcIl0sXG5bXCI4ZmE2ZTlcIixcIs6OzqtcIl0sXG5bXCI4ZmE2ZWNcIixcIs6PXCJdLFxuW1wiOGZhNmYxXCIsXCLOrM6tzq7Or8+KzpDPjM+Cz43Pi86wz45cIl0sXG5bXCI4ZmE3YzJcIixcItCCXCIsMTAsXCLQjtCPXCJdLFxuW1wiOGZhN2YyXCIsXCLRklwiLDEwLFwi0Z7Rn1wiXSxcbltcIjhmYTlhMVwiLFwiw4bEkFwiXSxcbltcIjhmYTlhNFwiLFwixKZcIl0sXG5bXCI4ZmE5YTZcIixcIsSyXCJdLFxuW1wiOGZhOWE4XCIsXCLFgcS/XCJdLFxuW1wiOGZhOWFiXCIsXCLFisOYxZJcIl0sXG5bXCI4ZmE5YWZcIixcIsWmw55cIl0sXG5bXCI4ZmE5YzFcIixcIsOmxJHDsMSnxLHEs8S4xYLFgMWJxYvDuMWTw5/Fp8O+XCJdLFxuW1wiOGZhYWExXCIsXCLDgcOAw4TDgsSCx43EgMSEw4XDg8SGxIjEjMOHxIrEjsOJw4jDi8OKxJrElsSSxJhcIl0sXG5bXCI4ZmFhYmFcIixcIsScxJ7EosSgxKTDjcOMw4/DjsePxLDEqsSuxKjEtMS2xLnEvcS7xYPFh8WFw5HDk8OSw5bDlMeRxZDFjMOVxZTFmMWWxZrFnMWgxZ7FpMWiw5rDmcOcw5vFrMeTxbDFqsWyxa7FqMeXx5vHmceVxbTDncW4xbbFucW9xbtcIl0sXG5bXCI4ZmFiYTFcIixcIsOhw6DDpMOixIPHjsSBxIXDpcOjxIfEicSNw6fEi8SPw6nDqMOrw6rEm8SXxJPEmce1xJ3En1wiXSxcbltcIjhmYWJiZFwiLFwixKHEpcOtw6zDr8Oux5BcIl0sXG5bXCI4ZmFiYzVcIixcIsSrxK/EqcS1xLfEusS+xLzFhMWIxYbDscOzw7LDtsO0x5LFkcWNw7XFlcWZxZfFm8WdxaHFn8WlxaPDusO5w7zDu8Wtx5TFscWrxbPFr8Wpx5jHnMeax5bFtcO9w7/Ft8W6xb7FvFwiXSxcbltcIjhmYjBhMVwiLFwi5LiC5LiE5LiF5LiM5LiS5Lif5Lij5Lik5Lio5Lir5Liu5Liv5Liw5Li15LmA5LmB5LmE5LmH5LmR5Lma5Lmc5Lmj5Lmo5Lmp5Lm05Lm15Lm55Lm/5LqN5LqW5LqX5Lqd5Lqv5Lq55LuD5LuQ5Lua5Lub5Lug5Luh5Lui5Luo5Luv5Lux5Luz5Lu15Lu95Lu+5Lu/5LyA5LyC5LyD5LyI5LyL5LyM5LyS5LyV5LyW5LyX5LyZ5Lyu5Lyx5L2g5Lyz5Ly15Ly35Ly55Ly75Ly+5L2A5L2C5L2I5L2J5L2L5L2M5L2S5L2U5L2W5L2Y5L2f5L2j5L2q5L2s5L2u5L2x5L235L245L255L265L295L2+5L6B5L6C5L6EXCJdLFxuW1wiOGZiMWExXCIsXCLkvoXkvonkvorkvozkvo7kvpDkvpLkvpPkvpTkvpfkvpnkvprkvp7kvp/kvrLkvrfkvrnkvrvkvrzkvr3kvr7kv4Dkv4Hkv4Xkv4bkv4jkv4nkv4vkv4zkv43kv4/kv5Lkv5zkv6Dkv6Lkv7Dkv7Lkv7zkv73kv7/lgIDlgIHlgITlgIflgIrlgIzlgI7lgJDlgJPlgJflgJjlgJvlgJzlgJ3lgJ7lgKLlgKflgK7lgLDlgLLlgLPlgLXlgYDlgYHlgYLlgYXlgYblgYrlgYzlgY7lgZHlgZLlgZPlgZflgZnlgZ/lgaDlgaLlgaPlgablgaflgarlga3lgbDlgbHlgLvlgoHlgoPlgoTlgoblgorlgo7lgo/lgpBcIl0sXG5bXCI4ZmIyYTFcIixcIuWCkuWCk+WClOWCluWCm+WCnOWCnlwiLDQsXCLlgqrlgq/lgrDlgrnlgrrlgr3lg4Dlg4Plg4Tlg4flg4zlg47lg5Dlg5Plg5Tlg5jlg5zlg53lg5/lg6Llg6Tlg6blg6jlg6nlg6/lg7Hlg7blg7rlg77lhIPlhIblhIflhIjlhIvlhIzlhI3lhI7lg7LlhJDlhJflhJnlhJvlhJzlhJ3lhJ7lhKPlhKflhKjlhKzlhK3lhK/lhLHlhLPlhLTlhLXlhLjlhLnlhYLlhYrlhY/lhZPlhZXlhZflhZjlhZ/lhaTlhablhb7lhoPlhoTlhovlho7lhpjlhp3lhqHlhqPlhq3lhrjlhrrlhrzlhr7lhr/lh4JcIl0sXG5bXCI4ZmIzYTFcIixcIuWHiOWHj+WHkeWHkuWHk+WHleWHmOWHnuWHouWHpeWHruWHsuWHs+WHtOWHt+WIgeWIguWIheWIkuWIk+WIleWIluWImOWIouWIqOWIseWIsuWIteWIvOWJheWJieWJleWJl+WJmOWJmuWJnOWJn+WJoOWJoeWJpuWJruWJt+WJuOWJueWKgOWKguWKheWKiuWKjOWKk+WKleWKluWKl+WKmOWKmuWKnOWKpOWKpeWKpuWKp+WKr+WKsOWKtuWKt+WKuOWKuuWKu+WKveWLgOWLhOWLhuWLiOWLjOWLj+WLkeWLlOWLluWLm+WLnOWLoeWLpeWLqOWLqeWLquWLrOWLsOWLseWLtOWLtuWLt+WMgOWMg+WMiuWMi1wiXSxcbltcIjhmYjRhMVwiLFwi5YyM5YyR5YyT5YyY5Yyb5Yyc5Yye5Yyf5Yyl5Yyn5Yyo5Yyp5Yyr5Yys5Yyt5Yyw5Yyy5Yy15Yy85Yy95Yy+5Y2C5Y2M5Y2L5Y2Z5Y2b5Y2h5Y2j5Y2l5Y2s5Y2t5Y2y5Y255Y2+5Y6D5Y6H5Y6I5Y6O5Y6T5Y6U5Y6Z5Y6d5Y6h5Y6k5Y6q5Y6r5Y6v5Y6y5Y605Y615Y635Y645Y665Y695Y+A5Y+F5Y+P5Y+S5Y+T5Y+V5Y+a5Y+d5Y+e5Y+g5Y+m5Y+n5Y+15ZCC5ZCT5ZCa5ZCh5ZCn5ZCo5ZCq5ZCv5ZCx5ZC05ZC15ZGD5ZGE5ZGH5ZGN5ZGP5ZGe5ZGi5ZGk5ZGm5ZGn5ZGp5ZGr5ZGt5ZGu5ZG05ZG/XCJdLFxuW1wiOGZiNWExXCIsXCLlkoHlkoPlkoXlkojlkonlko3lkpHlkpXlkpblkpzlkp/lkqHlkqblkqflkqnlkqrlkq3lkq7lkrHlkrflkrnlkrrlkrvlkr/lk4blk4rlk43lk47lk6Dlk6rlk6zlk6/lk7blk7zlk77lk7/llIDllIHllIXllIjllInllIzllI3llI7llJXllKrllKvllLLllLXllLbllLvllLzllL3llYHllYfllYnllYrllY3llZDllZHllZjllZrllZvllZ7llaDllaHllaTllabllb/lloHlloLllobllojllo7llo/llpHllpLllpPllpTllpfllqPllqTllq3llrLllr/ll4Hll4Pll4bll4nll4vll4zll47ll5Hll5JcIl0sXG5bXCI4ZmI2YTFcIixcIuWXk+WXl+WXmOWXm+WXnuWXouWXqeWXtuWXv+WYheWYiOWYiuWYjVwiLDUsXCLlmJnlmKzlmLDlmLPlmLXlmLflmLnlmLvlmLzlmL3lmL/lmYDlmYHlmYPlmYTlmYblmYnlmYvlmY3lmY/lmZTlmZ7lmaDlmaHlmaLlmaPlmablmanlma3lma/lmbHlmbLlmbXlmoTlmoXlmojlmovlmozlmpXlmpnlmprlmp3lmp7lmp/lmqblmqflmqjlmqnlmqvlmqzlmq3lmrHlmrPlmrflmr7lm4Xlm4nlm4rlm4vlm4/lm5Dlm4zlm43lm5nlm5zlm53lm5/lm6Hlm6RcIiw0LFwi5Zux5Zur5ZutXCJdLFxuW1wiOGZiN2ExXCIsXCLlm7blm7flnIHlnILlnIflnIrlnIzlnJHlnJXlnJrlnJvlnJ3lnKDlnKLlnKPlnKTlnKXlnKnlnKrlnKzlnK7lnK/lnLPlnLTlnL3lnL7lnL/lnYXlnYblnYzlnY3lnZLlnaLlnaXlnaflnajlnavlna1cIiw0LFwi5Z2z5Z205Z215Z235Z255Z265Z275Z285Z2+5Z6B5Z6D5Z6M5Z6U5Z6X5Z6Z5Z6a5Z6c5Z6d5Z6e5Z6f5Z6h5Z6V5Z6n5Z6o5Z6p5Z6s5Z645Z695Z+H5Z+I5Z+M5Z+P5Z+V5Z+d5Z+e5Z+k5Z+m5Z+n5Z+p5Z+t5Z+w5Z+15Z+25Z+45Z+95Z++5Z+/5aCD5aCE5aCI5aCJ5Z+hXCJdLFxuW1wiOGZiOGExXCIsXCLloIzloI3loJvloJ7loJ/loKDloKbloKfloK3loLLloLnloL/loYnloYzloY3loY/loZDloZXloZ/loaHloaTloafloajlobjlobzlob/looDlooHloofloojloonloorloozloo3loo/lopDlopTlopblop3loqDloqHloqLloqbloqnlorHlorLlo4Tlorzlo4Llo4jlo43lo47lo5Dlo5Llo5Tlo5blo5rlo53lo6Hlo6Llo6nlo7PlpIXlpIblpIvlpIzlpJLlpJPlpJTomYHlpJ3lpKHlpKPlpKTlpKjlpK/lpLDlpLPlpLXlpLblpL/lpYPlpYblpZLlpZPlpZnlpZvlpZ3lpZ7lpZ/lpaHlpaPlpavlpa1cIl0sXG5bXCI4ZmI5YTFcIixcIuWlr+WlsuWlteWltuWlueWlu+WlvOWmi+WmjOWmjuWmkuWmleWml+Wmn+WmpOWmp+WmreWmruWmr+WmsOWms+Wmt+WmuuWmvOWngeWng+WnhOWniOWniuWnjeWnkuWnneWnnuWnn+Wno+WnpOWnp+WnruWnr+WnseWnsuWntOWnt+WogOWohOWojOWojeWojuWokuWok+WonuWoo+WopOWop+WoqOWoquWoreWosOWphOWpheWph+WpiOWpjOWpkOWpleWpnuWpo+WppeWpp+WpreWpt+WpuuWpu+WpvuWqi+WqkOWqk+WqluWqmeWqnOWqnuWqn+WqoOWqouWqp+WqrOWqseWqsuWqs+WqteWquOWquuWqu+Wqv1wiXSxcbltcIjhmYmFhMVwiLFwi5auE5auG5auI5auP5aua5auc5aug5aul5auq5auu5au15au25au95ayA5ayB5ayI5ayX5ay05ayZ5ayb5ayd5ayh5ayl5ayt5ay45a2B5a2L5a2M5a2S5a2W5a2e5a2o5a2u5a2v5a285a295a2+5a2/5a6B5a6E5a6G5a6K5a6O5a6Q5a6R5a6T5a6U5a6W5a6o5a6p5a6s5a6t5a6v5a6x5a6y5a635a665a685a+A5a+B5a+N5a+P5a+WXCIsNCxcIuWvoOWvr+WvseWvtOWvveWwjOWwl+WwnuWwn+Wwo+WwpuWwqeWwq+WwrOWwruWwsOWwsuWwteWwtuWxmeWxmuWxnOWxouWxo+Wxp+WxqOWxqVwiXSxcbltcIjhmYmJhMVwiLFwi5bGt5bGw5bG05bG15bG65bG75bG85bG95bKH5bKI5bKK5bKP5bKS5bKd5bKf5bKg5bKi5bKj5bKm5bKq5bKy5bK05bK15bK65bOJ5bOL5bOS5bOd5bOX5bOu5bOx5bOy5bO05bSB5bSG5bSN5bSS5bSr5bSj5bSk5bSm5bSn5bSx5bS05bS55bS95bS/5bWC5bWD5bWG5bWI5bWV5bWR5bWZ5bWK5bWf5bWg5bWh5bWi5bWk5bWq5bWt5bWw5bW55bW65bW+5bW/5baB5baD5baI5baK5baS5baT5baU5baV5baZ5bab5baf5bag5ban5bar5baw5ba05ba45ba55beD5beH5beL5beQ5beO5beY5beZ5beg5bekXCJdLFxuW1wiOGZiY2ExXCIsXCLlt6nlt7jlt7nluIDluIfluI3luJLluJTluJXluJjluJ/luKDluK7luKjluLLluLXluL7luYvluZDluYnluZHluZbluZjluZvluZzluZ7luajluapcIiw0LFwi5bmw5bqA5bqL5bqO5bqi5bqk5bql5bqo5bqq5bqs5bqx5bqz5bq95bq+5bq/5buG5buM5buL5buO5buR5buS5buU5buV5buc5bue5bul5bur5byC5byG5byH5byI5byO5byZ5byc5byd5byh5byi5byj5byk5byo5byr5bys5byu5byw5by05by25by75by95by/5b2A5b2E5b2F5b2H5b2N5b2Q5b2U5b2Y5b2b5b2g5b2j5b2k5b2nXCJdLFxuW1wiOGZiZGExXCIsXCLlva/lvbLlvbTlvbXlvbjlvbrlvb3lvb7lvonlvo3lvo/lvpblvpzlvp3lvqLlvqflvqvlvqTlvqzlvq/lvrDlvrHlvrjlv4Tlv4flv4jlv4nlv4vlv5BcIiw0LFwi5b+e5b+h5b+i5b+o5b+p5b+q5b+s5b+t5b+u5b+v5b+y5b+z5b+25b+65b+85oCH5oCK5oCN5oCT5oCU5oCX5oCY5oCa5oCf5oCk5oCt5oCz5oC15oGA5oGH5oGI5oGJ5oGM5oGR5oGU5oGW5oGX5oGd5oGh5oGn5oGx5oG+5oG/5oKC5oKG5oKI5oKK5oKO5oKR5oKT5oKV5oKY5oKd5oKe5oKi5oKk5oKl5oKo5oKw5oKx5oK3XCJdLFxuW1wiOGZiZWExXCIsXCLmgrvmgr7mg4Lmg4Tmg4jmg4nmg4rmg4vmg47mg4/mg5Tmg5Xmg5nmg5vmg53mg57mg6Lmg6Xmg7Lmg7Xmg7jmg7zmg73mhILmhIfmhIrmhIzmhJBcIiw0LFwi5oSW5oSX5oSZ5oSc5oSe5oSi5oSq5oSr5oSw5oSx5oS15oS25oS35oS55oWB5oWF5oWG5oWJ5oWe5oWg5oWs5oWy5oW45oW75oW85oW/5oaA5oaB5oaD5oaE5oaL5oaN5oaS5oaT5oaX5oaY5oac5oad5oaf5oag5oal5oao5oaq5oat5oa45oa55oa85oeA5oeB5oeC5oeO5oeP5oeV5oec5oed5oee5oef5oeh5oei5oen5oep5oelXCJdLFxuW1wiOGZiZmExXCIsXCLmh6zmh63mh6/miIHmiIPmiITmiIfmiJPmiJXmiJzmiKDmiKLmiKPmiKfmiKnmiKvmiLnmiL3miYLmiYPmiYTmiYbmiYzmiZDmiZHmiZLmiZTmiZbmiZrmiZzmiaTmia3mia/mibPmibrmib3mio3mio7mio/mipDmiqbmiqjmirPmirbmirfmirrmir7mir/mi4Tmi47mi5Xmi5bmi5rmi6rmi7Lmi7Tmi7zmi73mjIPmjITmjIrmjIvmjI3mjJDmjJPmjJbmjJjmjKnmjKrmjK3mjLXmjLbmjLnmjLzmjYHmjYLmjYPmjYTmjYbmjYrmjYvmjY7mjZLmjZPmjZTmjZjmjZvmjaXmjabmjazmja3mjbHmjbTmjbVcIl0sXG5bXCI4ZmMwYTFcIixcIuaNuOaNvOaNveaNv+aOguaOhOaOh+aOiuaOkOaOlOaOleaOmeaOmuaOnuaOpOaOpuaOreaOruaOr+aOveaPgeaPheaPiOaPjuaPkeaPk+aPlOaPleaPnOaPoOaPpeaPquaPrOaPsuaPs+aPteaPuOaPueaQieaQiuaQkOaQkuaQlOaQmOaQnuaQoOaQouaQpOaQpeaQqeaQquaQr+aQsOaQteaQveaQv+aRi+aRj+aRkeaRkuaRk+aRlOaRmuaRm+aRnOaRneaRn+aRoOaRoeaRo+aRreaRs+aRtOaRu+aRveaSheaSh+aSj+aSkOaSkeaSmOaSmeaSm+aSneaSn+aSoeaSo+aSpuaSqOaSrOaSs+aSveaSvuaSv1wiXSxcbltcIjhmYzFhMVwiLFwi5pOE5pOJ5pOK5pOL5pOM5pOO5pOQ5pOR5pOV5pOX5pOk5pOl5pOp5pOq5pOt5pOw5pO15pO35pO75pO/5pSB5pSE5pSI5pSJ5pSK5pSP5pST5pSU5pSW5pSZ5pSb5pSe5pSf5pSi5pSm5pSp5pSu5pSx5pS65pS85pS95pWD5pWH5pWJ5pWQ5pWS5pWU5pWf5pWg5pWn5pWr5pW65pW95paB5paF5paK5paS5paV5paY5pad5pag5paj5pam5pau5pay5paz5pa05pa/5peC5peI5peJ5peO5peQ5peU5peW5peY5pef5pew5pey5pe05pe15pe55pe+5pe/5piA5piE5piI5piJ5piN5piR5piS5piV5piW5pidXCJdLFxuW1wiOGZjMmExXCIsXCLmmJ7mmKHmmKLmmKPmmKTmmKbmmKnmmKrmmKvmmKzmmK7mmLDmmLHmmLPmmLnmmLfmmYDmmYXmmYbmmYrmmYzmmZHmmY7mmZfmmZjmmZnmmZvmmZzmmaDmmaHmm7vmmarmmavmmazmmb7mmbPmmbXmmb/mmbfmmbjmmbnmmbvmmoDmmbzmmovmmozmmo3mmpDmmpLmmpnmmprmmpvmmpzmmp/mmqDmmqTmmq3mmrHmmrLmmrXmmrvmmr/mm4Dmm4Lmm4Pmm4jmm4zmm47mm4/mm5Tmm5vmm5/mm6jmm6vmm6zmm67mm7rmnIXmnIfmnI7mnJPmnJnmnJzmnKDmnKLmnLPmnL7mnYXmnYfmnYjmnYzmnZTmnZXmnZ1cIl0sXG5bXCI4ZmMzYTFcIixcIuadpuadrOadruadtOadtuadu+aegeaehOaejuaej+aekeaek+aeluaemOaemeaem+aesOaeseaesuaeteaeu+aevOaeveafueafgOafguafg+afheafiOafieafkuafl+afmeafnOafoeafpuafsOafsuaftuaft+ahkuaglOagmeagneagn+agqOagp+agrOagreagr+agsOagseags+agu+agv+ahhOahheahiuahjOahleahl+ahmOahm+ahq+ahrlwiLDQsXCLmobXmobnmobrmobvmobzmooLmooTmoobmoojmopbmopjmoprmopzmoqHmoqPmoqXmoqnmoqrmoq7morLmorvmo4Xmo4jmo4zmo49cIl0sXG5bXCI4ZmM0YTFcIixcIuajkOajkeajk+ajluajmeajnOajneajpeajqOajquajq+ajrOajreajsOajseajteajtuaju+ajvOajveakhuakieakiuakkOakkeakk+akluakl+akseaks+akteakuOaku+algualhealiealjuall+alm+alo+alpOalpealpualqOalqealrOalsOalsealsualuualu+alv+amgOamjeamkuamluammOamoeampeampuamqOamq+amreamr+amt+amuOamuuamvOanheaniOankeanluanl+anouanpeanruanr+anseans+anteanvuaogOaogeaog+aoj+aokeaoleaomuaoneaooOaopOaoqOaosOaoslwiXSxcbltcIjhmYzVhMVwiLFwi5qi05qi35qi75qi+5qi/5qmF5qmG5qmJ5qmK5qmO5qmQ5qmR5qmS5qmV5qmW5qmb5qmk5qmn5qmq5qmx5qmz5qm+5qqB5qqD5qqG5qqH5qqJ5qqL5qqR5qqb5qqd5qqe5qqf5qql5qqr5qqv5qqw5qqx5qq05qq95qq+5qq/5quG5quJ5quI5quM5quQ5quU5quV5quW5quc5qud5quk5qun5qus5quw5qux5quy5qu85qu95qyC5qyD5qyG5qyH5qyJ5qyP5qyQ5qyR5qyX5qyb5qye5qyk5qyo5qyr5qys5qyv5qy15qy25qy75qy/5q2G5q2K5q2N5q2S5q2W5q2Y5q2d5q2g5q2n5q2r5q2u5q2w5q215q29XCJdLFxuW1wiOGZjNmExXCIsXCLmrb7mroLmroXmrpfmrpvmrp/mrqDmrqLmrqPmrqjmrqnmrqzmrq3mrq7mrrDmrrjmrrnmrr3mrr7mr4Pmr4Tmr4nmr4zmr5bmr5rmr6Hmr6Pmr6bmr6fmr67mr7Hmr7fmr7nmr7/msILmsITmsIXmsInmsI3msI7msJDmsJLmsJnmsJ/msKbmsKfmsKjmsKzmsK7msLPmsLXmsLbmsLrmsLvmsL/msYrmsYvmsY3msY/msZLmsZTmsZnmsZvmsZzmsavmsa3msa/msbTmsbbmsbjmsbnmsbvmsoXmsobmsofmsonmspTmspXmspfmspjmspzmsp/msrDmsrLmsrTms4Lms4bms43ms4/ms5Dms5Hms5Lms5Tms5ZcIl0sXG5bXCI4ZmM3YTFcIixcIuazmuaznOazoOazp+azqeazq+azrOazruazsuaztOa0hOa0h+a0iua0jua0j+a0kea0k+a0mua0pua0p+a0qOaxp+a0rua0r+a0sea0uea0vOa0v+a1l+a1nua1n+a1oea1pea1p+a1r+a1sOa1vOa2gua2h+a2kea2kua2lOa2lua2l+a2mOa2qua2rOa2tOa2t+a2uea2vea2v+a3hOa3iOa3iua3jua3j+a3lua3m+a3nea3n+a3oOa3oua3pea3qea3r+a3sOa3tOa3tua3vOa4gOa4hOa4nua4oua4p+a4sua4tua4uea4u+a4vOa5hOa5hea5iOa5iea5i+a5j+a5kea5kua5k+a5lOa5l+a5nOa5nea5nlwiXSxcbltcIjhmYzhhMVwiLFwi5rmi5rmj5rmo5rmz5rm75rm95rqN5rqT5rqZ5rqg5rqn5rqt5rqu5rqx5rqz5rq75rq/5ruA5ruB5ruD5ruH5ruI5ruK5ruN5ruO5ruP5rur5rut5ruu5ru55ru75ru95ryE5ryI5ryK5ryM5ryN5ryW5ryY5rya5ryb5rym5ryp5ryq5ryv5ryw5ryz5ry25ry75ry85ryt5r2P5r2R5r2S5r2T5r2X5r2Z5r2a5r2d5r2e5r2h5r2i5r2o5r2s5r295r2+5r6D5r6H5r6I5r6L5r6M5r6N5r6Q5r6S5r6T5r6U5r6W5r6a5r6f5r6g5r6l5r6m5r6n5r6o5r6u5r6v5r6w5r615r625r685r+F5r+H5r+I5r+KXCJdLFxuW1wiOGZjOWExXCIsXCLmv5rmv57mv6jmv6nmv7Dmv7Xmv7nmv7zmv73ngIDngIXngIbngIfngI3ngJfngKDngKPngK/ngLTngLfngLnngLzngYPngYTngYjngYnngYrngYvngZTngZXngZ3ngZ7ngY7ngaTngaXngaznga7ngbXngbbngb7ngoHngoXngobngpRcIiw0LFwi54Kb54Kk54Kr54Kw54Kx54K054K354OK54OR54OT54OU54OV54OW54OY54Oc54Ok54O654SDXCIsNCxcIueEi+eEjOeEj+eEnueEoOeEq+eEreeEr+eEsOeEseeEuOeFgeeFheeFhueFh+eFiueFi+eFkOeFkueFl+eFmueFnOeFnueFoFwiXSxcbltcIjhmY2FhMVwiLFwi54Wo54W554aA54aF54aH54aM54aS54aa54ab54ag54ai54av54aw54ay54az54a654a/54eA54eB54eE54eL54eM54eT54eW54eZ54ea54ec54e454e+54iA54iH54iI54iJ54iT54iX54ia54id54if54ik54ir54iv54i054i454i554mB54mC54mD54mF54mO54mP54mQ54mT54mV54mW54ma54mc54me54mg54mj54mo54mr54mu54mv54mx54m354m454m754m854m/54qE54qJ54qN54qO54qT54qb54qo54qt54qu54qx54q054q+54uB54uH54uJ54uM54uV54uW54uY54uf54ul54uz54u054u654u7XCJdLFxuW1wiOGZjYmExXCIsXCLni77njILnjITnjIXnjIfnjIvnjI3njJLnjJPnjJjnjJnnjJ7njKLnjKTnjKfnjKjnjKznjLHnjLLnjLXnjLrnjLvnjL3njYPnjY3njZDnjZLnjZbnjZjnjZ3njZ7njZ/njaDnjabnjafnjannjavnjaznja7nja/njbHnjbfnjbnnjbznjoDnjoHnjoPnjoXnjobnjo7njpDnjpPnjpXnjpfnjpjnjpznjp7njp/njqDnjqLnjqXnjqbnjqrnjqvnjq3njrXnjrfnjrnnjrznjr3njr/nj4Xnj4bnj4nnj4vnj4znj4/nj5Lnj5Pnj5bnj5nnj53nj6Hnj6Pnj6bnj6fnj6nnj7Tnj7Xnj7fnj7nnj7rnj7vnj71cIl0sXG5bXCI4ZmNjYTFcIixcIuePv+eQgOeQgeeQhOeQh+eQiueQkeeQmueQm+eQpOeQpueQqFwiLDksXCLnkLnnkYDnkYPnkYTnkYbnkYfnkYvnkY3nkZHnkZLnkZfnkZ3nkaLnkabnkafnkajnkavnka3nka7nkbHnkbLnkoDnkoHnkoXnkobnkofnkonnko/nkpDnkpHnkpLnkpjnkpnnkprnkpznkp/nkqDnkqHnkqPnkqbnkqjnkqnnkqrnkqvnkq7nkq/nkrHnkrLnkrXnkrnnkrvnkr/nk4jnk4nnk4znk5Dnk5Pnk5jnk5rnk5vnk57nk5/nk6Tnk6jnk6rnk6vnk6/nk7Tnk7rnk7vnk7znk7/nlIZcIl0sXG5bXCI4ZmNkYTFcIixcIueUkueUlueUl+eUoOeUoeeUpOeUp+eUqeeUqueUr+eUtueUueeUveeUvueUv+eVgOeVg+eVh+eViOeVjueVkOeVkueVl+eVnueVn+eVoeeVr+eVseeVuVwiLDUsXCLnloHnloXnlpDnlpLnlpPnlpXnlpnnlpznlqLnlqTnlrTnlrrnlr/nl4Dnl4Hnl4Tnl4bnl4znl47nl4/nl5fnl5znl5/nl6Dnl6Hnl6Tnl6fnl6znl67nl6/nl7Hnl7nnmIDnmILnmIPnmITnmIfnmIjnmIrnmIznmI/nmJLnmJPnmJXnmJbnmJnnmJvnmJznmJ3nmJ7nmKPnmKXnmKbnmKnnmK3nmLLnmLPnmLXnmLjnmLlcIl0sXG5bXCI4ZmNlYTFcIixcIueYuueYvOeZiueZgOeZgeeZg+eZhOeZheeZieeZi+eZleeZmeeZn+eZpOeZpeeZreeZrueZr+eZseeZtOeageeaheeajOeajeealeeam+eanOeaneean+eaoOeaolwiLDYsXCLnmqrnmq3nmr3nm4Hnm4Xnm4nnm4vnm4znm47nm5Tnm5nnm6Dnm6bnm6jnm6znm7Dnm7Hnm7bnm7nnm7znnIDnnIbnnIrnnI7nnJLnnJTnnJXnnJfnnJnnnJrnnJznnKLnnKjnnK3nnK7nnK/nnLTnnLXnnLbnnLnnnL3nnL7nnYLnnYXnnYbnnYrnnY3nnY7nnY/nnZLnnZbnnZfnnZznnZ7nnZ/nnaDnnaJcIl0sXG5bXCI4ZmNmYTFcIixcIuedpOedp+edquedrOedsOedsueds+edtOeduuedveeegOeehOeejOeejeeelOeeleeelueemueen+eeoueep+eequeerueer+eeseeeteeevuefg+efieefkeefkuefleefmeefnuefn+efoOefpOefpuefquefrOefsOefseeftOefuOefu+egheeghuegieegjeegjuegkeegneegoeegouego+egreegruegsOegteegt+ehg+ehhOehh+ehiOehjOehjuehkuehnOehnuehoOehoeeho+ehpOehqOehquehruehuuehvueiiueij+eilOeimOeioeeineeinuein+eipOeiqOeirOeireeisOeiseeisueis1wiXSxcbltcIjhmZDBhMVwiLFwi56K756K956K/56OH56OI56OJ56OM56OO56OS56OT56OV56OW56Ok56Ob56Of56Og56Oh56Om56Oq56Oy56Oz56SA56O256O356O656O756O/56SG56SM56SQ56Sa56Sc56Se56Sf56Sg56Sl56Sn56Sp56St56Sx56S056S156S756S956S/56WE56WF56WG56WK56WL56WP56WR56WU56WY56Wb56Wc56Wn56Wp56Wr56Wy56W556W756W856W+56aL56aM56aR56aT56aU56aV56aW56aY56ab56ac56ah56ao56ap56ar56av56ax56a056a456a756eC56eE56eH56eI56eK56eP56eU56eW56ea56ed56eeXCJdLFxuW1wiOGZkMWExXCIsXCLnp6Dnp6Lnp6Xnp6rnp6vnp63np7Hnp7jnp7znqILnqIPnqIfnqInnqIrnqIznqJHnqJXnqJvnqJ7nqKHnqKfnqKvnqK3nqK/nqLDnqLTnqLXnqLjnqLnnqLrnqYTnqYXnqYfnqYjnqYznqZXnqZbnqZnnqZznqZ3nqZ/nqaDnqaXnqafnqarnqa3nqbXnqbjnqb7nqoDnqoLnqoXnqobnqornqovnqpDnqpHnqpTnqp7nqqDnqqPnqqznqrPnqrXnqrnnqrvnqrznq4bnq4nnq4znq47nq5Hnq5vnq6jnq6nnq6vnq6znq7Hnq7Tnq7vnq73nq77nrIfnrJTnrJ/nrKPnrKfnrKnnrKrnrKvnrK3nrK7nrK/nrLBcIl0sXG5bXCI4ZmQyYTFcIixcIuesseestOesveesv+etgOetgeeth+etjuetleetoOetpOetpuetqeetquetreetr+etsuets+ett+euhOeuieeujueukOeukeeulueum+eunueuoOeupeeurOeur+eusOeusueuteeutueuuueuu+euvOeuveevguevheeviOeviuevlOevluevl+evmeevmuevm+evqOevquevsuevtOevteevuOevueevuuevvOevvuewgeewguewg+ewhOewhuewieewi+ewjOewjuewj+ewmeewm+ewoOewpeewpuewqOewrOewseews+ewtOewtuewueewuuexhuexiuexleexkeexkuexk+exmVwiLDVdLFxuW1wiOGZkM2ExXCIsXCLnsaHnsaPnsafnsannsa3nsa7nsbDnsbLnsbnnsbznsb3nsobnsofnso/nspTnsp7nsqDnsqbnsrDnsrbnsrfnsrrnsrvnsrznsr/ns4Tns4fns4jns4nns43ns4/ns5Pns5Tns5Xns5fns5nns5rns53ns6bns6nns6vns7XntIPntIfntIjntInntI/ntJHntJLntJPntJbntJ3ntJ7ntKPntKbntKrntK3ntLHntLzntL3ntL7ntYDntYHntYfntYjntY3ntZHntZPntZfntZnntZrntZzntZ3ntaXntafntarntbDntbjntbrntbvntb/ntoHntoLntoPntoXntobntojntovntoznto3ntpHntpbntpfntp1cIl0sXG5bXCI4ZmQ0YTFcIixcIue2nue2pue2p+e2que2s+e2tue2t+e2uee3glwiLDQsXCLnt4znt43nt47nt5fnt5nnuIDnt6Lnt6Xnt6bnt6rnt6vnt63nt7Hnt7Xnt7bnt7nnt7rnuIjnuJDnuJHnuJXnuJfnuJznuJ3nuKDnuKfnuKjnuKznuK3nuK/nuLPnuLbnuL/nuYTnuYXnuYfnuY7nuZDnuZLnuZjnuZ/nuaHnuaLnuaXnuavnua7nua/nubPnubjnub7nuoHnuobnuofnuornuo3nupHnupXnupjnuprnup3nup7nvLznvLvnvL3nvL7nvL/nvYPnvYTnvYfnvY/nvZLnvZPnvZvnvZznvZ3nvaHnvaPnvaTnvaXnvabnva1cIl0sXG5bXCI4ZmQ1YTFcIixcIue9see9vee9vue9v+e+gOe+i+e+jee+j+e+kOe+kee+lue+l+e+nOe+oee+oue+pue+que+ree+tOe+vOe+v+e/gOe/g+e/iOe/jue/j+e/m+e/n+e/o+e/pee/qOe/rOe/rue/r+e/sue/uue/vee/vue/v+iAh+iAiOiAiuiAjeiAjuiAj+iAkeiAk+iAlOiAluiAneiAnuiAn+iAoOiApOiApuiArOiAruiAsOiAtOiAteiAt+iAueiAuuiAvOiAvuiBgOiBhOiBoOiBpOiBpuiBreiBseiBteiCgeiCiOiCjuiCnOiCnuiCpuiCp+iCq+iCuOiCueiDiOiDjeiDj+iDkuiDlOiDleiDl+iDmOiDoOiDreiDrlwiXSxcbltcIjhmZDZhMVwiLFwi6IOw6IOy6IOz6IO26IO56IO66IO+6ISD6ISL6ISW6ISX6ISY6ISc6ISe6ISg6ISk6ISn6ISs6ISw6IS16IS66IS86IWF6IWH6IWK6IWM6IWS6IWX6IWg6IWh6IWn6IWo6IWp6IWt6IWv6IW36IaB6IaQ6IaE6IaF6IaG6IaL6IaO6IaW6IaY6Iab6Iae6Iai6Iau6Iay6Ia06Ia76IeL6IeD6IeF6IeK6IeO6IeP6IeV6IeX6Ieb6Ied6Iee6Ieh6Iek6Ier6Ies6Iew6Iex6Iey6Ie16Ie26Ie46Ie56Ie96Ie/6IiA6IiD6IiP6IiT6IiU6IiZ6Iia6Iid6Iih6Iii6Iio6Iiy6Ii06Ii66ImD6ImE6ImF6ImGXCJdLFxuW1wiOGZkN2ExXCIsXCLoiYvoiY7oiY/oiZHoiZboiZzoiaDoiaPoiafoia3oibToibvoib3oib/oioDoioHoioPoioToiofoionoioroio7oipHoipToipboipjoiproipvoiqDoiqHoiqPoiqToiqfoiqjoiqnoiqroiq7oirDoirLoirToirfoirroirzoir7oir/oi4boi5Doi5Xoi5roi6Doi6Loi6Toi6joi6roi63oi6/oi7boi7foi73oi77ojIDojIHojIfojIjojIrojIvojZTojJvojJ3ojJ7ojJ/ojKHojKLojKzojK3ojK7ojLDojLPojLfojLrojLzojL3ojYLojYPojYTojYfojY3ojY7ojZHojZXojZbojZfojbDojbhcIl0sXG5bXCI4ZmQ4YTFcIixcIuiNveiNv+iOgOiOguiOhOiOhuiOjeiOkuiOlOiOleiOmOiOmeiOm+iOnOiOneiOpuiOp+iOqeiOrOiOvuiOv+iPgOiPh+iPieiPj+iPkOiPkeiPlOiPneiNk+iPqOiPquiPtuiPuOiPueiPvOiQgeiQhuiQiuiQj+iQkeiQleiQmeiOreiQr+iQueiRheiRh+iRiOiRiuiRjeiRj+iRkeiRkuiRluiRmOiRmeiRmuiRnOiRoOiRpOiRpeiRp+iRquiRsOiRs+iRtOiRtuiRuOiRvOiRveiSgeiSheiSkuiSk+iSleiSnuiSpuiSqOiSqeiSquiSr+iSseiStOiSuuiSveiSvuiTgOiTguiTh+iTiOiTjOiTj+iTk1wiXSxcbltcIjhmZDlhMVwiLFwi6JOc6JOn6JOq6JOv6JOw6JOx6JOy6JO36JSy6JO66JO76JO96JSC6JSD6JSH6JSM6JSO6JSQ6JSc6JSe6JSi6JSj6JSk6JSl6JSn6JSq6JSr6JSv6JSz6JS06JS26JS/6JWG6JWPXCIsNCxcIuiVluiVmeiVnFwiLDYsXCLolaTolavola/olbnolbrolbvolb3olb/oloHoloXolobolonolovolozolo/olpPolpjolp3olp/olqDolqLolqXolqfolrTolrbolrfolrjolrzolr3olr7olr/ol4Lol4fol4rol4vol47olq3ol5jol5rol5/ol6Dol6bol6jol63ol7Pol7bol7xcIl0sXG5bXCI4ZmRhYTFcIixcIuiXv+iYgOiYhOiYheiYjeiYjuiYkOiYkeiYkuiYmOiYmeiYm+iYnuiYoeiYp+iYqeiYtuiYuOiYuuiYvOiYveiZgOiZguiZhuiZkuiZk+iZluiZl+iZmOiZmeiZneiZoFwiLDQsXCLomanomazoma/ombXombbombfombromo3ompHompbompjomprompzomqHomqbomqfomqjomq3omrHomrPomrTomrXomrfomrjomrnomr/om4Dom4Hom4Pom4Xom5Hom5Lom5Xom5fom5rom5zom6Dom6Pom6Xom6fomojom7rom7zom73onITonIXonIfonIvonI7onI/onJDonJPonJTonJnonJ7onJ/onKHonKNcIl0sXG5bXCI4ZmRiYTFcIixcIuicqOicruicr+icseicsuicueicuuicvOicveicvuidgOidg+idheidjeidmOidneidoeidpOidpeidr+idseidsuidu+ieg1wiLDYsXCLonovonozonpDonpPonpXonpfonpjonpnonp7onqDonqPonqfonqzonq3onq7onrHonrXonr7onr/on4Hon4jon4non4ron47on5Xon5bon5non5ron5zon5/on6Lon6Pon6Ton6ron6von63on7Hon7Pon7jon7ron7/ooIHooIPooIbooInooIrooIvooJDooJnooJLooJPooJTooJjooJrooJvooJzooJ7ooJ/ooKjooK3ooK7ooLDooLLooLVcIl0sXG5bXCI4ZmRjYTFcIixcIuiguuigvOihgeihg+ihheihiOihieihiuihi+ihjuihkeihleihluihmOihmuihnOihn+ihoOihpOihqeihseihueihu+iigOiimOiimuiim+iinOiin+iioOiiqOiiquiiuuiiveiivuijgOijilwiLDQsXCLoo5Hoo5Loo5Poo5voo57oo6foo6/oo7Doo7Hoo7Xoo7fopIHopIbopI3opI7opI/opJXopJbopJjopJnopJropJzopKDopKbopKfopKjopLDopLHopLLopLXopLnopLropL7opYDopYLopYXopYbopYnopY/opZLopZfopZropZvopZzopaHopaLopaPopavopa7opbDopbPopbXopbpcIl0sXG5bXCI4ZmRkYTFcIixcIuilu+ilvOilveimieimjeimkOimlOimleimm+imnOimn+imoOimpeimsOimtOimteimtuimt+imvOinlFwiLDQsXCLop6Xop6nop6vop63op7Hop7Pop7bop7nop73op7/oqIToqIXoqIfoqI/oqJHoqJLoqJToqJXoqJ7oqKDoqKLoqKToqKboqKvoqKzoqK/oqLXoqLfoqL3oqL7oqYDoqYPoqYXoqYfoqYnoqY3oqY7oqZPoqZboqZfoqZjoqZzoqZ3oqaHoqaXoqafoqbXoqbboqbfoqbnoqbroqbvoqb7oqb/oqoDoqoPoqoboqovoqo/oqpDoqpLoqpboqpfoqpnoqp/oqqfoqqnoqq7oqq/oqrNcIl0sXG5bXCI4ZmRlYTFcIixcIuiqtuiqt+iqu+iqvuirg+irhuiriOirieiriuirkeirk+irlOirleirl+irneirn+irrOirsOirtOirteirtuirvOirv+isheishuisi+iskeisnOisnuisn+isiuisreissOist+isvOitglwiLDQsXCLorYjorZLorZPorZTorZnorY3orZ7oraPora3orbborbjorbnorbzorb7oroHoroToroXorovoro3oro/orpTorpXorpzorp7orp/osLjosLnosL3osL7osYXosYfosYnosYvosY/osZHosZPosZTosZfosZjosZvosZ3osZnosaPosaTosabosajosanosa3osbPosbXosbbosbvosb7osoZcIl0sXG5bXCI4ZmRmYTFcIixcIuiyh+iyi+iykOiykuiyk+iymeiym+iynOiypOiyueiyuuizheizhuizieizi+izj+izluizleizmeizneizoeizqOizrOizr+izsOizsuizteizt+izuOizvuizv+i0gei0g+i0iei0kui0l+i0m+i1pei1qei1rOi1rui1v+i2gui2hOi2iOi2jei2kOi2kei2lei2nui2n+i2oOi2pui2q+i2rOi2r+i2sui2tei2t+i2uei2u+i3gOi3hei3hui3h+i3iOi3iui3jui3kei3lOi3lei3l+i3mei3pOi3pei3p+i3rOi3sOi2vOi3sei3sui3tOi3vei4gei4hOi4hei4hui4i+i4kei4lOi4lui4oOi4oei4olwiXSxcbltcIjhmZTBhMVwiLFwi6Lij6Lim6Lin6Lix6Liz6Li26Li36Li46Li56Li96LmA6LmB6LmL6LmN6LmO6LmP6LmU6Lmb6Lmc6Lmd6Lme6Lmh6Lmi6Lmp6Lms6Lmt6Lmv6Lmw6Lmx6Lm56Lm66Lm76LqC6LqD6LqJ6LqQ6LqS6LqV6Lqa6Lqb6Lqd6Lqe6Lqi6Lqn6Lqp6Lqt6Lqu6Lqz6Lq16Lq66Lq76LuA6LuB6LuD6LuE6LuH6LuP6LuR6LuU6Luc6Luo6Luu6Luw6Lux6Lu36Lu56Lu66Lut6LyA6LyC6LyH6LyI6LyP6LyQ6LyW6LyX6LyY6Lye6Lyg6Lyh6Lyj6Lyl6Lyn6Lyo6Lys6Lyt6Lyu6Ly06Ly16Ly26Ly36Ly66L2A6L2BXCJdLFxuW1wiOGZlMWExXCIsXCLovYPovYfovY/ovZFcIiw0LFwi6L2Y6L2d6L2e6L2l6L6d6L6g6L6h6L6k6L6l6L6m6L616L626L646L6+6L+A6L+B6L+G6L+K6L+L6L+N6L+Q6L+S6L+T6L+V6L+g6L+j6L+k6L+o6L+u6L+x6L+16L+26L+76L++6YCC6YCE6YCI6YCM6YCY6YCb6YCo6YCp6YCv6YCq6YCs6YCt6YCz6YC06YC36YC/6YGD6YGE6YGM6YGb6YGd6YGi6YGm6YGn6YGs6YGw6YG06YG56YKF6YKI6YKL6YKM6YKO6YKQ6YKV6YKX6YKY6YKZ6YKb6YKg6YKh6YKi6YKl6YKw6YKy6YKz6YK06YK26YK96YOM6YK+6YODXCJdLFxuW1wiOGZlMmExXCIsXCLpg4Tpg4Xpg4fpg4jpg5Xpg5fpg5jpg5npg5zpg53pg5/pg6Xpg5Lpg7bpg6vpg6/pg7Dpg7Tpg77pg7/phIDphITphIXphIbphIjphI3phJDphJTphJbphJfphJjphJrphJzphJ7phKDphKXphKLphKPphKfphKnphK7phK/phLHphLTphLbphLfphLnphLrphLzphL3phYPphYfphYjphY/phZPphZfphZnphZrphZvphaHphaTphafpha3phbTphbnphbrphbvphoHphoPphoXphobphorpho7phpHphpPphpTphpXphpjphp7phqHphqbphqjphqzphq3phq7phrDphrHphrLphrPphrbphrvphrzphr3phr9cIl0sXG5bXCI4ZmUzYTFcIixcIumHgumHg+mHhemHk+mHlOmHl+mHmemHmumHnumHpOmHpemHqemHqumHrFwiLDUsXCLph7fph7nph7vph73piIDpiIHpiITpiIXpiIbpiIfpiInpiIrpiIzpiJDpiJLpiJPpiJbpiJjpiJzpiJ3piKPpiKTpiKXpiKbpiKjpiK7piK/piLDpiLPpiLXpiLbpiLjpiLnpiLrpiLzpiL7piYDpiYLpiYPpiYbpiYfpiYrpiY3piY7piY/piZHpiZjpiZnpiZzpiZ3piaDpiaHpiaXpiafpiajpianpia7pia/pibDpibVcIiw0LFwi6Ym76Ym86Ym96Ym/6YqI6YqJ6YqK6YqN6YqO6YqS6YqXXCJdLFxuW1wiOGZlNGExXCIsXCLpipnpip/piqDpiqTpiqXpiqfpiqjpiqvpiq/pirLpirbpirjpirrpirvpirzpir3pir9cIiw0LFwi6YuF6YuG6YuH6YuI6YuL6YuM6YuN6YuO6YuQ6YuT6YuV6YuX6YuY6YuZ6Yuc6Yud6Yuf6Yug6Yuh6Yuj6Yul6Yun6Yuo6Yus6Yuu6Yuw6Yu56Yu76Yu/6YyA6YyC6YyI6YyN6YyR6YyU6YyV6Yyc6Yyd6Yye6Yyf6Yyh6Yyk6Yyl6Yyn6Yyp6Yyq6Yyz6Yy06Yy26Yy36Y2H6Y2I6Y2J6Y2Q6Y2R6Y2S6Y2V6Y2X6Y2Y6Y2a6Y2e6Y2k6Y2l6Y2n6Y2p6Y2q6Y2t6Y2v6Y2w6Y2x6Y2z6Y206Y22XCJdLFxuW1wiOGZlNWExXCIsXCLpjbrpjb3pjb/pjoDpjoHpjoLpjojpjorpjovpjo3pjo/pjpLpjpXpjpjpjpvpjp7pjqHpjqPpjqTpjqbpjqjpjqvpjrTpjrXpjrbpjrrpjqnpj4Hpj4Tpj4Xpj4bpj4fpj4lcIiw0LFwi6Y+T6Y+Z6Y+c6Y+e6Y+f6Y+i6Y+m6Y+n6Y+56Y+36Y+46Y+66Y+76Y+96ZCB6ZCC6ZCE6ZCI6ZCJ6ZCN6ZCO6ZCP6ZCV6ZCW6ZCX6ZCf6ZCu6ZCv6ZCx6ZCy6ZCz6ZC06ZC76ZC/6ZC96ZGD6ZGF6ZGI6ZGK6ZGM6ZGV6ZGZ6ZGc6ZGf6ZGh6ZGj6ZGo6ZGr6ZGt6ZGu6ZGv6ZGx6ZGy6ZKE6ZKD6ZW46ZW5XCJdLFxuW1wiOGZlNmExXCIsXCLplb7ploTplojplozplo3plo7plp3plp7plp/plqHplqbplqnplqvplqzplrTplrbplrrplr3plr/pl4bpl4jpl4npl4vpl5Dpl5Hpl5Lpl5Ppl5npl5rpl53pl57pl5/pl6Dpl6Tpl6bpmJ3pmJ7pmKLpmKTpmKXpmKbpmKzpmLHpmLPpmLfpmLjpmLnpmLrpmLzpmL3pmYHpmZLpmZTpmZbpmZfpmZjpmaHpma7pmbTpmbvpmbzpmb7pmb/pmoHpmoLpmoPpmoTpmonpmpHpmpbpmprpmp3pmp/pmqTpmqXpmqbpmqnpmq7pmq/pmrPpmrrpm4rpm5LltrLpm5jpm5rpm53pm57pm5/pm6npm6/pm7Hpm7rpnIJcIl0sXG5bXCI4ZmU3YTFcIixcIumcg+mchemciemcmumcm+mcnemcoemcoumco+mcqOmcsemcs+mdgemdg+mdiumdjumdj+mdlemdl+mdmOmdmumdm+mdo+mdp+mdqumdrumds+mdtumdt+mduOmdu+mdvemdv+megOmeiemelemelumel+memememumenumen+meoumerOmerumesemesumetemetumeuOmeuemeuumevOmevumev+mfgemfhOmfhemfh+mfiemfiumfjOmfjemfjumfkOmfkemflOmfl+mfmOmfmemfnemfnumfoOmfm+mfoemfpOmfr+mfsemftOmft+mfuOmfuumgh+mgiumgmemgjemgjumglOmglumgnOmgnumgoOmgo+mgplwiXSxcbltcIjhmZThhMVwiLFwi6aCr6aCu6aCv6aCw6aCy6aCz6aC16aCl6aC+6aGE6aGH6aGK6aGR6aGS6aGT6aGW6aGX6aGZ6aGa6aGi6aGj6aGl6aGm6aGq6aGs6aKr6aKt6aKu6aKw6aK06aK36aK46aK66aK76aK/6aOC6aOF6aOI6aOM6aOh6aOj6aOl6aOm6aOn6aOq6aOz6aO26aSC6aSH6aSI6aSR6aSV6aSW6aSX6aSa6aSb6aSc6aSf6aSi6aSm6aSn6aSr6aSxXCIsNCxcIumkuemkuumku+mkvOmlgOmlgemlhumlh+mliOmljemljumllOmlmOmlmemlm+mlnOmlnumln+mloOmmm+mmnemmn+mmpummsOmmsemmsummtVwiXSxcbltcIjhmZTlhMVwiLFwi6aa56aa66aa96aa/6aeD6aeJ6aeT6aeU6aeZ6aea6aec6aee6aen6aeq6aer6aes6aew6ae06ae16ae56ae96ae+6aiC6aiD6aiE6aiL6aiM6aiQ6aiR6aiW6aie6aig6aii6aij6aik6ain6ait6aiu6aiz6ai16ai26ai46amH6amB6amE6amK6amL6amM6amO6amR6amU6amW6amd6aqq6aqs6aqu6aqv6aqy6aq06aq16aq26aq56aq76aq+6aq/6auB6auD6auG6auI6auO6auQ6auS6auV6auW6auX6aub6auc6aug6auk6aul6aun6aup6aus6auy6auz6au16au56au66au96au/XCIsNF0sXG5bXCI4ZmVhYTFcIixcIumshOmshemsiOmsiemsi+msjOmsjemsjumskOmskumslumsmemsm+msnOmsoOmspumsq+msremss+mstOmstemst+msuemsuumsvemtiOmti+mtjOmtlemtlumtl+mtm+mtnumtoemto+mtpemtpumtqOmtqlwiLDQsXCLprbPprbXprbfprbjprbnprb/proDproTproXprobprofpronprorprovpro3pro/prpDprpTprprprp3prp7prqbprqfprqnprqzprrDprrHprrLprrfprrjprrvprrzprr7prr/pr4Hpr4fpr4jpr47pr5Dpr5fpr5jpr53pr5/pr6Xpr6fpr6rpr6vpr6/pr7Ppr7fpr7hcIl0sXG5bXCI4ZmViYTFcIixcIumvuemvuumvvemvv+mwgOmwgumwi+mwj+mwkemwlumwmOmwmemwmumwnOmwnumwoumwo+mwplwiLDQsXCLpsLHpsLXpsLbpsLfpsL3psYHpsYPpsYTpsYXpsYnpsYrpsY7psY/psZDpsZPpsZTpsZbpsZjpsZvpsZ3psZ7psZ/psaPpsanpsarpsZzpsavpsajpsa7psbDpsbLpsbXpsbfpsbvps6bps7Lps7fps7nptIvptILptJHptJfptJjptJzptJ3ptJ7ptK/ptLDptLLptLPptLTptLrptLzptYXptL3ptYLptYPptYfptYrptZPptZTptZ/ptaPptaLptaXptanptarptavptbDptbbptbfptbtcIl0sXG5bXCI4ZmVjYTFcIixcIum1vOm1vum2g+m2hOm2hum2ium2jem2jum2kum2k+m2lem2lum2l+m2mOm2oem2qum2rOm2rum2sem2tem2uem2vOm2v+m3g+m3h+m3iem3ium3lOm3lem3lum3l+m3mum3num3n+m3oOm3pem3p+m3qem3q+m3rum3sOm3s+m3tOm3vum4ium4gum4h+m4jum4kOm4kem4kum4lem4lum4mem4nOm4nem5uum5u+m5vOm6gOm6gum6g+m6hOm6hem6h+m6jum6j+m6lum6mOm6m+m6num6pOm6qOm6rOm6rum6r+m6sOm6s+m6tOm6tem7hum7iOm7i+m7lem7n+m7pOm7p+m7rOm7rem7rum7sOm7sem7sum7tVwiXSxcbltcIjhmZWRhMVwiLFwi6bu46bu/6byC6byD6byJ6byP6byQ6byR6byS6byU6byW6byX6byZ6bya6byb6byf6byi6bym6byq6byr6byv6byx6byy6by06by36by56by66by86by96by/6b2B6b2DXCIsNCxcIum9k+m9lem9lum9l+m9mOm9mum9nem9num9qOm9qem9rVwiLDQsXCLpvbPpvbXpvbrpvb3pvo/pvpDpvpHpvpLpvpTpvpbpvpfpvp7pvqHpvqLpvqPpvqVcIl1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPXtcInVDaGFyc1wiOlsxMjgsMTY1LDE2OSwxNzgsMTg0LDIxNiwyMjYsMjM1LDIzOCwyNDQsMjQ4LDI1MSwyNTMsMjU4LDI3NiwyODQsMzAwLDMyNSwzMjksMzM0LDM2NCw0NjMsNDY1LDQ2Nyw0NjksNDcxLDQ3Myw0NzUsNDc3LDUwNiw1OTQsNjEwLDcxMiw3MTYsNzMwLDkzMCw5MzgsOTYyLDk3MCwxMDI2LDExMDQsMTEwNiw4MjA5LDgyMTUsODIxOCw4MjIyLDgyMzEsODI0MSw4MjQ0LDgyNDYsODI1Miw4MzY1LDg0NTIsODQ1NCw4NDU4LDg0NzEsODQ4Miw4NTU2LDg1NzAsODU5Niw4NjAyLDg3MTMsODcyMCw4NzIyLDg3MjYsODczMSw4NzM3LDg3NDAsODc0Miw4NzQ4LDg3NTEsODc2MCw4NzY2LDg3NzcsODc4MSw4Nzg3LDg4MDIsODgwOCw4ODE2LDg4NTQsODg1OCw4ODcwLDg4OTYsODk3OSw5MzIyLDkzNzIsOTU0OCw5NTg4LDk2MTYsOTYyMiw5NjM0LDk2NTIsOTY2Miw5NjcyLDk2NzYsOTY4MCw5NzAyLDk3MzUsOTczOCw5NzkzLDk3OTUsMTE5MDYsMTE5MDksMTE5MTMsMTE5MTcsMTE5MjgsMTE5NDQsMTE5NDcsMTE5NTEsMTE5NTYsMTE5NjAsMTE5NjQsMTE5NzksMTIyODQsMTIyOTIsMTIzMTIsMTIzMTksMTIzMzAsMTIzNTEsMTI0MzYsMTI0NDcsMTI1MzUsMTI1NDMsMTI1ODYsMTI4NDIsMTI4NTAsMTI5NjQsMTMyMDAsMTMyMTUsMTMyMTgsMTMyNTMsMTMyNjMsMTMyNjcsMTMyNzAsMTMzODQsMTM0MjgsMTM3MjcsMTM4MzksMTM4NTEsMTQ2MTcsMTQ3MDMsMTQ4MDEsMTQ4MTYsMTQ5NjQsMTUxODMsMTU0NzEsMTU1ODUsMTY0NzEsMTY3MzYsMTcyMDgsMTczMjUsMTczMzAsMTczNzQsMTc2MjMsMTc5OTcsMTgwMTgsMTgyMTIsMTgyMTgsMTgzMDEsMTgzMTgsMTg3NjAsMTg4MTEsMTg4MTQsMTg4MjAsMTg4MjMsMTg4NDQsMTg4NDgsMTg4NzIsMTk1NzYsMTk2MjAsMTk3MzgsMTk4ODcsNDA4NzAsNTkyNDQsNTkzMzYsNTkzNjcsNTk0MTMsNTk0MTcsNTk0MjMsNTk0MzEsNTk0MzcsNTk0NDMsNTk0NTIsNTk0NjAsNTk0NzgsNTk0OTMsNjM3ODksNjM4NjYsNjM4OTQsNjM5NzYsNjM5ODYsNjQwMTYsNjQwMTgsNjQwMjEsNjQwMjUsNjQwMzQsNjQwMzcsNjQwNDIsNjUwNzQsNjUwOTMsNjUxMDcsNjUxMTIsNjUxMjcsNjUxMzIsNjUzNzUsNjU1MTAsNjU1MzZdLFwiZ2JDaGFyc1wiOlswLDM2LDM4LDQ1LDUwLDgxLDg5LDk1LDk2LDEwMCwxMDMsMTA0LDEwNSwxMDksMTI2LDEzMywxNDgsMTcyLDE3NSwxNzksMjA4LDMwNiwzMDcsMzA4LDMwOSwzMTAsMzExLDMxMiwzMTMsMzQxLDQyOCw0NDMsNTQ0LDU0NSw1NTgsNzQxLDc0Miw3NDksNzUwLDgwNSw4MTksODIwLDc5MjIsNzkyNCw3OTI1LDc5MjcsNzkzNCw3OTQzLDc5NDQsNzk0NSw3OTUwLDgwNjIsODE0OCw4MTQ5LDgxNTIsODE2NCw4MTc0LDgyMzYsODI0MCw4MjYyLDgyNjQsODM3NCw4MzgwLDgzODEsODM4NCw4Mzg4LDgzOTAsODM5Miw4MzkzLDgzOTQsODM5Niw4NDAxLDg0MDYsODQxNiw4NDE5LDg0MjQsODQzNyw4NDM5LDg0NDUsODQ4Miw4NDg1LDg0OTYsODUyMSw4NjAzLDg5MzYsODk0Niw5MDQ2LDkwNTAsOTA2Myw5MDY2LDkwNzYsOTA5Miw5MTAwLDkxMDgsOTExMSw5MTEzLDkxMzEsOTE2Miw5MTY0LDkyMTgsOTIxOSwxMTMyOSwxMTMzMSwxMTMzNCwxMTMzNiwxMTM0NiwxMTM2MSwxMTM2MywxMTM2NiwxMTM3MCwxMTM3MiwxMTM3NSwxMTM4OSwxMTY4MiwxMTY4NiwxMTY4NywxMTY5MiwxMTY5NCwxMTcxNCwxMTcxNiwxMTcyMywxMTcyNSwxMTczMCwxMTczNiwxMTk4MiwxMTk4OSwxMjEwMiwxMjMzNiwxMjM0OCwxMjM1MCwxMjM4NCwxMjM5MywxMjM5NSwxMjM5NywxMjUxMCwxMjU1MywxMjg1MSwxMjk2MiwxMjk3MywxMzczOCwxMzgyMywxMzkxOSwxMzkzMywxNDA4MCwxNDI5OCwxNDU4NSwxNDY5OCwxNTU4MywxNTg0NywxNjMxOCwxNjQzNCwxNjQzOCwxNjQ4MSwxNjcyOSwxNzEwMiwxNzEyMiwxNzMxNSwxNzMyMCwxNzQwMiwxNzQxOCwxNzg1OSwxNzkwOSwxNzkxMSwxNzkxNSwxNzkxNiwxNzkzNiwxNzkzOSwxNzk2MSwxODY2NCwxODcwMywxODgxNCwxODk2MiwxOTA0MywzMzQ2OSwzMzQ3MCwzMzQ3MSwzMzQ4NCwzMzQ4NSwzMzQ5MCwzMzQ5NywzMzUwMSwzMzUwNSwzMzUxMywzMzUyMCwzMzUzNiwzMzU1MCwzNzg0NSwzNzkyMSwzNzk0OCwzODAyOSwzODAzOCwzODA2NCwzODA2NSwzODA2NiwzODA2OSwzODA3NSwzODA3NiwzODA3OCwzOTEwOCwzOTEwOSwzOTExMywzOTExNCwzOTExNSwzOTExNiwzOTI2NSwzOTM5NCwxODkwMDBdfSIsIm1vZHVsZS5leHBvcnRzPVtcbltcImExNDBcIixcIu6ThlwiLDYyXSxcbltcImExODBcIixcIu6UhVwiLDMyXSxcbltcImEyNDBcIixcIu6UplwiLDYyXSxcbltcImEyODBcIixcIu6VpVwiLDMyXSxcbltcImEyYWJcIixcIu6dplwiLDVdLFxuW1wiYTJlM1wiLFwi4oKs7p2tXCJdLFxuW1wiYTJlZlwiLFwi7p2u7p2vXCJdLFxuW1wiYTJmZFwiLFwi7p2w7p2xXCJdLFxuW1wiYTM0MFwiLFwi7paGXCIsNjJdLFxuW1wiYTM4MFwiLFwi7peFXCIsMzEsXCLjgIBcIl0sXG5bXCJhNDQwXCIsXCLul6ZcIiw2Ml0sXG5bXCJhNDgwXCIsXCLumKVcIiwzMl0sXG5bXCJhNGY0XCIsXCLunbJcIiwxMF0sXG5bXCJhNTQwXCIsXCLumYZcIiw2Ml0sXG5bXCJhNTgwXCIsXCLumoVcIiwzMl0sXG5bXCJhNWY3XCIsXCLunb1cIiw3XSxcbltcImE2NDBcIixcIu6aplwiLDYyXSxcbltcImE2ODBcIixcIu6bpVwiLDMyXSxcbltcImE2YjlcIixcIu6ehVwiLDddLFxuW1wiYTZkOVwiLFwi7p6NXCIsNl0sXG5bXCJhNmVjXCIsXCLunpTunpVcIl0sXG5bXCJhNmYzXCIsXCLunpZcIl0sXG5bXCJhNmY2XCIsXCLunpdcIiw4XSxcbltcImE3NDBcIixcIu6chlwiLDYyXSxcbltcImE3ODBcIixcIu6dhVwiLDMyXSxcbltcImE3YzJcIixcIu6eoFwiLDE0XSxcbltcImE3ZjJcIixcIu6er1wiLDEyXSxcbltcImE4OTZcIixcIu6evFwiLDEwXSxcbltcImE4YmNcIixcIu6fh1wiXSxcbltcImE4YmZcIixcIse5XCJdLFxuW1wiYThjMVwiLFwi7p+J7p+K7p+L7p+MXCJdLFxuW1wiYThlYVwiLFwi7p+NXCIsMjBdLFxuW1wiYTk1OFwiLFwi7p+iXCJdLFxuW1wiYTk1YlwiLFwi7p+jXCJdLFxuW1wiYTk1ZFwiLFwi7p+k7p+l7p+mXCJdLFxuW1wiYTk4OVwiLFwi44C+4r+wXCIsMTFdLFxuW1wiYTk5N1wiLFwi7p+0XCIsMTJdLFxuW1wiYTlmMFwiLFwi7qCBXCIsMTRdLFxuW1wiYWFhMVwiLFwi7oCAXCIsOTNdLFxuW1wiYWJhMVwiLFwi7oGeXCIsOTNdLFxuW1wiYWNhMVwiLFwi7oK8XCIsOTNdLFxuW1wiYWRhMVwiLFwi7oSaXCIsOTNdLFxuW1wiYWVhMVwiLFwi7oW4XCIsOTNdLFxuW1wiYWZhMVwiLFwi7oeWXCIsOTNdLFxuW1wiZDdmYVwiLFwi7qCQXCIsNF0sXG5bXCJmOGExXCIsXCLuiLRcIiw5M10sXG5bXCJmOWExXCIsXCLuipJcIiw5M10sXG5bXCJmYWExXCIsXCLui7BcIiw5M10sXG5bXCJmYmExXCIsXCLujY5cIiw5M10sXG5bXCJmY2ExXCIsXCLujqxcIiw5M10sXG5bXCJmZGExXCIsXCLukIpcIiw5M10sXG5bXCJmZTUwXCIsXCLiuoHuoJbuoJfuoJjiuoTjkbPjkYfiuojiuovuoJ7jlp7jmJrjmI7iuoziupfjpa7jpJjuoKbjp4/jp5/jqbPjp5DuoKvuoKzjrY7jsa7js6DiuqfuoLHuoLLiuqrkgZbkhZ/iuq7kjLfiurPiurbiurfuoLvkjrHkjqziurvkj53kk5bkmaHkmYzuoYNcIl0sXG5bXCJmZTgwXCIsXCLknKPknKnknbzkno3iu4rkpYfkpbrkpb3kpoLkpoPkpoXkpobkpp/kppvkprfkprbuoZTuoZXksqPksp/ksqDksqHksbfksqLktJNcIiw2LFwi5Lau7qGk7pGoXCIsOTNdXG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCIwXCIsXCJcXHUwMDAwXCIsMTI4XSxcbltcImExXCIsXCLvvaFcIiw2Ml0sXG5bXCI4MTQwXCIsXCLjgIDjgIHjgILvvIzvvI7jg7vvvJrvvJvvvJ/vvIHjgpvjgpzCtO+9gMKo77y+77+j77y/44O944O+44Kd44Ke44CD5Lud44CF44CG44CH44O84oCV4oCQ77yP77y8772e4oil772c4oCm4oCl4oCY4oCZ4oCc4oCd77yI77yJ44CU44CV77y777y9772b772d44CIXCIsOSxcIu+8i++8jcKxw5dcIl0sXG5bXCI4MTgwXCIsXCLDt++8neKJoO+8nO+8nuKJpuKJp+KInuKItOKZguKZgMKw4oCy4oCz4oSD77+l77yE77+g77+h77yF77yD77yG77yK77ygwqfimIbimIXil4vil4/il47il4fil4bilqHilqDilrPilrLilr3ilrzigLvjgJLihpLihpDihpHihpPjgJNcIl0sXG5bXCI4MWI4XCIsXCLiiIjiiIviiobiiofiioLiioPiiKriiKlcIl0sXG5bXCI4MWM4XCIsXCLiiKfiiKjvv6Lih5Lih5TiiIDiiINcIl0sXG5bXCI4MWRhXCIsXCLiiKDiiqXijJLiiILiiIfiiaHiiZLiiariiaviiJriiL3iiJ3iiLXiiKviiKxcIl0sXG5bXCI4MWYwXCIsXCLihKvigLDima/ima3imarigKDigKHCtlwiXSxcbltcIjgxZmNcIixcIuKXr1wiXSxcbltcIjgyNGZcIixcIu+8kFwiLDldLFxuW1wiODI2MFwiLFwi77yhXCIsMjVdLFxuW1wiODI4MVwiLFwi772BXCIsMjVdLFxuW1wiODI5ZlwiLFwi44GBXCIsODJdLFxuW1wiODM0MFwiLFwi44KhXCIsNjJdLFxuW1wiODM4MFwiLFwi44OgXCIsMjJdLFxuW1wiODM5ZlwiLFwizpFcIiwxNixcIs6jXCIsNl0sXG5bXCI4M2JmXCIsXCLOsVwiLDE2LFwiz4NcIiw2XSxcbltcIjg0NDBcIixcItCQXCIsNSxcItCB0JZcIiwyNV0sXG5bXCI4NDcwXCIsXCLQsFwiLDUsXCLRkdC2XCIsN10sXG5bXCI4NDgwXCIsXCLQvlwiLDE3XSxcbltcIjg0OWZcIixcIuKUgOKUguKUjOKUkOKUmOKUlOKUnOKUrOKUpOKUtOKUvOKUgeKUg+KUj+KUk+KUm+KUl+KUo+KUs+KUq+KUu+KVi+KUoOKUr+KUqOKUt+KUv+KUneKUsOKUpeKUuOKVglwiXSxcbltcIjg3NDBcIixcIuKRoFwiLDE5LFwi4oWgXCIsOV0sXG5bXCI4NzVmXCIsXCLjjYnjjJTjjKLjjY3jjJjjjKfjjIPjjLbjjZHjjZfjjI3jjKbjjKPjjKvjjYrjjLvjjpzjjp3jjp7jjo7jjo/jj4TjjqFcIl0sXG5bXCI4NzdlXCIsXCLjjbtcIl0sXG5bXCI4NzgwXCIsXCLjgJ3jgJ/ihJbjj43ihKHjiqRcIiw0LFwi44ix44iy44i5442+442944284omS4omh4oir4oiu4oiR4oia4oql4oig4oif4oq/4oi14oip4oiqXCJdLFxuW1wiODg5ZlwiLFwi5Lqc5ZSW5aiD6Zi/5ZOA5oSb5oyo5ae26YCi6JG16Iyc56mQ5oKq5o+h5ril5pet6JGm6Iqm6a+15qKT5Zyn5pah5omx5a6b5aeQ6Jm76aO057Wi57a+6a6O5oiW57Kf6KK35a6J5bq15oyJ5pqX5qGI6ZeH6Z6N5p2P5Lul5LyK5L2N5L6d5YGJ5Zuy5aS35aeU5aiB5bCJ5oOf5oSP5oWw5piT5qSF54K655WP55Ww56e757at57ev6IOD6JCO6KGj6KyC6YGV6YG65Yy75LqV5Lql5Z+f6IKy6YOB56Ov5LiA5aOx5rqi6YC456iy6Iyo6IqL6bCv5YWB5Y2w5ZK95ZOh5Zug5ae75byV6aOy5rer6IOk6JStXCJdLFxuW1wiODk0MFwiLFwi6Zmi6Zmw6Zqg6Z+75ZCL5Y+z5a6H54OP57696L+C6Zuo5Y2v6bWc56q65LiR56KT6Ie85rim5ZiY5ZSE5qyd6JSa6bC75ael5Y6p5rWm55Oc6ZaP5ZmC5LqR6YGL6Zuy6I2P6aSM5Y+h5Za25ayw5b2x5pig5puz5qCE5rC45rOz5rSp55Gb55uI56mO6aC06Iux6KGb6Kmg6Yut5ray55ar55uK6aeF5oKm6KyB6LaK6Zay5qaO5Y6t5YaGXCJdLFxuW1wiODk4MFwiLFwi5ZyS5aCw5aWE5a605bu25oCo5o6p5o+05rK/5ryU54KO54SU54WZ54eV54y/57iB6Im26IuR6JaX6YGg6Ymb6bSb5aGp5pa85rGa55Sl5Ye55aSu5aWl5b6A5b+c5oq85pe65qiq5qyn5q60546L57+B6KWW6bSs6bSO6buE5bKh5rKW6I275YSE5bGL5oa26IeG5qG254mh5LmZ5L+65Y245oGp5rip56mP6Z+z5LiL5YyW5Luu5L2V5Ly95L6h5L2z5Yqg5Y+v5ZiJ5aSP5auB5a625a+h56eR5pqH5p6c5p625q2M5rKz54Gr54+C56aN56a+56i8566H6Iqx6Iub6IyE6I236I+v6I+T6J2m6Kqy5Zip6LKo6L+m6YGO6Zye6JqK5L+E5bOo5oiR54mZ55S76Iel6Iq96Ju+6LOA6ZuF6aST6aeV5LuL5Lya6Kej5Zue5aGK5aOK5bu75b+r5oCq5oKU5oGi5oeQ5oiS5ouQ5pS5XCJdLFxuW1wiOGE0MFwiLFwi6a2B5pmm5qKw5rW354Gw55WM55qG57W16Iql6J+56ZaL6ZqO6LKd5Yex5Yq+5aSW5ZKz5a6z5bSW5oWo5qaC5rav56KN6JOL6KGX6Kmy6Y6n6aq45rWs6aao6JuZ5Z6j5p+/6JuO6YiO5YqD5ZqH5ZCE5buT5ouh5pK55qC85qC45q67542y56K656mr6Kaa6KeS6LWr6LyD6YOt6Zaj6ZqU6Z2p5a2m5bKz5qW96aGN6aGO5o6b56yg5qirXCJdLFxuW1wiOGE4MFwiLFwi5qm/5qK26bCN5r2f5Ymy5Zad5oGw5ous5rS75riH5ruR6JGb6KSQ6L2E5LiU6bC55Y+25qSb5qi66Z6E5qCq5YWc56uD6JKy6Yec6Y6M5Zmb6bSo5qCi6IyF6JCx57Kl5YiI6IuF55Om5Lm+5L6D5Yag5a+S5YiK5YuY5Yun5be75Zaa5aCq5aem5a6M5a6Y5a+b5bmy5bm55oKj5oSf5oWj5oa+5o+b5pWi5p+R5qGT5qO65qy+5q2T5rGX5ryi5r6X5r2F55Kw55SY55uj55yL56u/566h57Ch57ep57y257+w6IKd6Imm6I6e6Kaz6KuM6LKr6YKE6ZGR6ZaT6ZaR6Zai6Zml6Z+T6aSo6IiY5Li45ZCr5bK45beM546p55mM55y85bKp57+r6LSL6ZuB6aCR6aGU6aGY5LyB5LyO5Y2x5Zac5Zmo5Z+65aWH5ayJ5a+E5bKQ5biM5bm+5b+M5o+u5py65peX5pei5pyf5qOL5qOEXCJdLFxuW1wiOGI0MFwiLFwi5qmf5biw5q+F5rCX5rG955W/56WI5a2j56iA57SA5b696KaP6KiY6LK06LW36LuM6Lyd6aOi6aiO6ay85LqA5YG95YSA5aaT5a6c5oiv5oqA5pOs5qy654qg55aR56WH576p6J+76Kq86K2w5o6s6I+K6Z6g5ZCJ5ZCD5Zar5qGU5qmY6Kmw56Cn5p216buN5Y205a6i6ISa6JmQ6YCG5LiY5LmF5LuH5LyR5Y+K5ZC45a6u5byT5oCl5pWRXCJdLFxuW1wiOGI4MFwiLFwi5py95rGC5rGy5rOj54G455CD56m256qu56yI57Sa57O+57Wm5pen54mb5Y675bGF5beo5ouS5oug5oyZ5rig6Jma6Kix6Led6Yu45ryB56am6a2a5Lqo5Lqr5Lqs5L6b5L6g5YOR5YWH56u25YWx5Ye25Y2U5Yyh5Y2/5Y+r5Zas5aKD5bOh5by35b2K5oCv5oGQ5oGt5oyf5pWZ5qmL5rOB54uC54ut55+v6IO46ISF6IiI6JWO6YO36Y+h6Z+/6aWX6ama5Luw5Yed5bCt5pqB5qWt5bGA5puy5qW1546J5qGQ57KB5YOF5Yuk5Z2H5be+6Yym5pak5qyj5qy955C056aB56a9562L57eK6Iq56I+M6KG/6KWf6Ky56L+R6YeR5ZCf6YqA5Lmd5YC25Y+l5Yy654uX546W55+p6Ium6Lqv6aeG6aeI6aeS5YW35oSa6Jme5Zaw56m65YG25a+T6YGH6ZqF5Liy5qub6Yen5bGR5bGIXCJdLFxuW1wiOGM0MFwiLFwi5o6Y56qf5rKT6Z206L2h56qq54aK6ZqI57KC5qCX57mw5qGR6Y2s5Yuy5ZCb6Jar6KiT576k6LuN6YOh5Y2m6KKI56WB5L+C5YK+5YiR5YWE5ZWT5Zyt54+q5Z6L5aWR5b2i5b6E5oG15oW25oWn5oap5o6y5pC65pWs5pmv5qGC5riT55Wm56i957O757WM57aZ57mL572r6IyO6I2K6JuN6KiI6Kmj6K2m6Lu96aCa6baP6Iq46L+O6a+oXCJdLFxuW1wiOGM4MFwiLFwi5YqH5oif5pKD5r+A6ZqZ5qGB5YKR5qyg5rG65r2U56m057WQ6KGA6Kij5pyI5Lu25YC55YCm5YGl5YW85Yi45Ymj5Zan5ZyP5aCF5auM5bu65oay5oe45ouz5o2y5qSc5qip54m954qs54yu56CU56Gv57W555yM6IKp6KaL6KyZ6LOi6LuS6YGj6Y216Zm66aGV6aiT6bm45YWD5Y6f5Y6z5bm75bym5rib5rqQ546E54++57WD6Ii36KiA6Ku66ZmQ5LmO5YCL5Y+k5ZG85Zu65aeR5a2k5bex5bqr5byn5oi45pWF5p6v5rmW54uQ57OK6KK06IKh6IOh6I+w6JmO6KqH6Leo6Yi36ZuH6aGn6byT5LqU5LqS5LyN5Y2I5ZGJ5ZC+5aiv5b6M5b6h5oKf5qKn5qqO55Ga56KB6Kqe6Kqk6K236YaQ5Lme6a+J5Lqk5L285L6v5YCZ5YCW5YWJ5YWs5Yqf5Yq55Yu+5Y6a5Y+j5ZCRXCJdLFxuW1wiOGQ0MFwiLFwi5ZCO5ZaJ5Z2R5Z6i5aW95a2U5a2d5a6P5bel5ben5be35bm45bqD5bqa5bq35byY5oGS5oWM5oqX5ouY5o6n5pS75piC5pmD5pu05p2t5qCh5qKX5qeL5rGf5rSq5rWp5riv5rqd55Sy55qH56Gs56i/57Og57SF57SY57We57ax6ICV6ICD6IKv6IKx6IWU6IaP6Iiq6I2S6KGM6KGh6Kyb6LKi6LO86YOK6YW16Ymx56C/6Yu86Zak6ZmNXCJdLFxuW1wiOGQ4MFwiLFwi6aCF6aaZ6auY6bS75Ymb5Yqr5Y+35ZCI5aOV5ou35r+g6LGq6L2f6bq55YWL5Yi75ZGK5Zu956mA6YW36bWg6buS542E5ryJ6IWw55SR5b+95oOa6aqo54ub6L685q2k6aCD5LuK5Zuw5Z2k5aK+5ama5oGo5oeH5piP5piG5qC55qKx5re355eV57S66Imu6a2C5Lqb5L2Q5Y+J5ZSG5bWv5bem5beu5p+75rKZ55Gz56CC6KmQ6Y6W6KOf5Z2Q5bqn5oyr5YK15YKs5YaN5pyA5ZOJ5aGe5aa75a6w5b2p5omN5o6h5qC95q2z5riI54G96YeH54qA56CV56Cm56Wt5paO57Sw6I+c6KOB6LyJ6Zqb5Ymk5Zyo5p2Q572q6LKh5Ya05Z2C6Ziq5aC65qaK6IK05ZKy5bSO5Z+856KV6be65L2c5YmK5ZKL5pC+5pio5pyU5p+156qE562W57Si6Yyv5qGc6a6t56y55YyZ5YaK5Yi3XCJdLFxuW1wiOGU0MFwiLFwi5a+f5ou25pKu5pOm5pyt5q666Jap6ZuR55qQ6a+W5o2M6YyG6a6r55q/5pmS5LiJ5YKY5Y+C5bGx5oOo5pKS5pWj5qGf54em54+K55Sj566X57qC6JqV6K6D6LOb6YW46aSQ5pas5pqr5q6L5LuV5LuU5Ly65L2/5Yi65Y+45Y+y5Zej5Zub5aOr5aeL5aeJ5ae/5a2Q5bGN5biC5bir5b+X5oCd5oyH5pSv5a2c5pav5pa95peo5p6d5q2iXCJdLFxuW1wiOGU4MFwiLFwi5q275rCP542F56WJ56eB57O457SZ57Sr6IKi6ISC6Iez6KaW6Kme6Kmp6Kmm6KqM6Kuu6LOH6LOc6ZuM6aO85q2v5LqL5Ly85L6N5YWQ5a2X5a+65oWI5oyB5pmC5qyh5ruL5rK754i+55K955eU56OB56S66ICM6ICz6Ieq6JKU6L6e5rGQ6bm/5byP6K2Y6bSr56u66Lu45a6N6Zur5LiD5Y+x5Z+35aSx5auJ5a6k5oKJ5rm/5ryG55a+6LOq5a6f6JSA56+g5YGy5p+06Iqd5bGh6JWK57ie6IiO5YaZ5bCE5o2o6LWm5pac54Wu56S+57SX6ICF6Kyd6LuK6YGu6JuH6YKq5YCf5Yu65bC65p2T54G854i16YWM6YeI6Yyr6Iul5a+C5byx5oO55Li75Y+W5a6I5omL5pyx5q6K54up54+g56iu6IWr6Laj6YWS6aaW5YSS5Y+X5ZGq5a+/5o6I5qi557as6ZyA5Zua5Y+O5ZGoXCJdLFxuW1wiOGY0MFwiLFwi5a6X5bCx5bee5L+u5oSB5ou+5rSy56eA56eL57WC57mN57+S6Iet6Iif6JKQ6KGG6KWy6K6Q6Lm06Lyv6YCx6YWL6YWs6ZuG6Yac5LuA5L2P5YWF5Y2B5b6T5oiO5p+U5rGB5riL542j57im6YeN6YqD5Y+U5aSZ5a6/5reR56Wd57iu57Kb5aG+54af5Ye66KGT6L+w5L+K5bO75pil556s56uj6Iic6ae/5YeG5b6q5pes5qWv5q6J5rezXCJdLFxuW1wiOGY4MFwiLFwi5rqW5r2k55u+57SU5beh6YG16YaH6aCG5Yem5Yid5omA5pqR5puZ5ria5bq257eS572y5pu46Jav6Je36Ku45Yqp5Y+Z5aWz5bqP5b6Q5oGV6Yuk6Zmk5YK35YSf5Yud5Yyg5Y2H5Y+s5ZOo5ZWG5ZSx5ZiX5aWo5aa+5ai85a615bCG5bCP5bCR5bCa5bqE5bqK5bug5b2w5om/5oqE5oub5o6M5o235piH5piM5pit5pm25p2+5qKi5qif5qi15rK85raI5riJ5rmY54S854Sm54Wn55eH55yB56Gd56SB56Wl56ew56ug56yR57Kn57S56IKW6I+W6JKL6JWJ6KGd6KOz6Kif6Ki86KmU6Kmz6LGh6LOe6Yak6Ymm6Y2+6ZCY6Zqc6Z6Y5LiK5LiI5Lie5LmX5YaX5Ymw5Z+O5aC05aOM5ayi5bi45oOF5pO+5p2h5p2W5rWE54q255Wz56mj6JK46K2y6Ya46Yyg5Zix5Z+06aO+XCJdLFxuW1wiOTA0MFwiLFwi5out5qSN5q6W54et57mU6IG36Imy6Kem6aOf6J2V6L6x5bC75Ly45L+h5L615ZSH5aig5a+d5a+p5b+D5oWO5oyv5paw5pmL5qOu5qab5rW45rex55Sz55a555yf56We56em57Sz6Iej6Iqv6Jaq6Kaq6Ki66Lqr6L6b6YCy6Yed6ZyH5Lq65LuB5YiD5aG15aOs5bCL55Sa5bC96IWO6KiK6L+F6Zmj6Z2t56yl6KuP6aCI6YWi5Zuz5Y6oXCJdLFxuW1wiOTA4MFwiLFwi6YCX5ZC55Z6C5bil5o6o5rC054KK552h57KL57+g6KGw6YGC6YWU6YyQ6YyY6ZqP55Ge6auE5bSH5bWp5pWw5p6i6Lao6Zub5o2u5p2J5qSZ6I+F6aCX6ZuA6KO+5r6E5pG65a+45LiW54Cs55Wd5piv5YeE5Yi25Yui5aeT5b6B5oCn5oiQ5pS/5pW05pif5pm05qOy5qCW5q2j5riF54my55Sf55ub57K+6IGW5aOw6KO96KW/6Kqg6KqT6KuL6YCd6YaS6Z2S6Z2Z5paJ56iO6ISG6Zq75bit5oOc5oia5pal5piU5p6Q55+z56mN57GN57i+6ISK6LKs6LWk6Leh6Lmf56Kp5YiH5ouZ5o6l5pGC5oqY6Kit56qD56+A6Kqs6Zuq57W26IiM6J2J5LuZ5YWI5Y2D5Y2g5a6j5bCC5bCW5bed5oim5omH5pKw5qCT5qC05rOJ5rWF5rSX5p+T5r2c54WO54W95peL56m/566t57eaXCJdLFxuW1wiOTE0MFwiLFwi57mK576o6IW66Iib6Ii56Jam6Kmu6LOO6Le16YG46YG36Yqt6YqR6ZaD6a6u5YmN5ZaE5ry454S25YWo56aF57mV6Iaz57OO5ZmM5aGR5bKo5o6q5pu+5pu95qWa54uZ55aP55aO56SO56WW56ef57KX57Sg57WE6JiH6Ki06Zi76YGh6byg5YOn5Ym15Y+M5Y+i5YCJ5Zaq5aOu5aWP54i95a6L5bGk5Yyd5oOj5oOz5o2c5o6D5oy/5o67XCJdLFxuW1wiOTE4MFwiLFwi5pON5pep5pu55bej5qeN5qe95ryV54el5LqJ55ep55u456qT57Of57eP57ac6IGh6I2J6I2Y6JGs6JK86Je76KOF6LWw6YCB6YGt6Y6X6Zyc6aiS5YOP5aKX5oaO6IeT6JS16LSI6YCg5L+D5YG05YmH5Y2z5oGv5o2J5p2f5ris6Laz6YCf5L+X5bGe6LOK5peP57aa5Y2S6KKW5YW25o+D5a2Y5a2r5bCK5pCN5p2R6YGc5LuW5aSa5aSq5rGw6KmR5ZS+5aCV5aal5oOw5omT5p+B6Ii15qWV6ZmA6aeE6aio5L2T5aCG5a++6ICQ5bKx5biv5b6F5oCg5oWL5oi05pu/5rOw5rue6IOO6IW/6IuU6KKL6LK46YCA6YCu6ZqK6bub6a+b5Luj5Y+w5aSn56ys6YaN6aGM6be55rud54Cn5Y2T5ZWE5a6F5omY5oqe5ouT5rKi5r+v55Ci6KiX6ZC45r+B6Ku+6Iy45Yen6Ju45Y+qXCJdLFxuW1wiOTI0MFwiLFwi5Y+p5L2G6YGU6L6w5aWq6ISx5be956uq6L6/5qOa6LC354u46bGI5qi96Kqw5Li55Y2Y5ZiG5Z2m5ouF5o6i5pem5q2O5reh5rmb54Kt55+t56uv566q57a76IC96IOG6JuL6KqV6Y2b5Zuj5aOH5by+5pat5pqW5qqA5q6155S36KuH5YCk55+l5Zyw5byb5oGl5pm65rGg55e056ia572u6Ie06JyY6YGF6aaz56+J55Wc56u5562R6JOEXCJdLFxuW1wiOTI4MFwiLFwi6YCQ56ep56qS6Iy25auh552A5Lit5Luy5a6Z5b+g5oq95pi85p+x5rOo6Jmr6KG36Ki76YWO6Yuz6aeQ5qiX54Cm54yq6Iun6JGX6LKv5LiB5YWG5YeL5ZaL5a+15biW5biz5bqB5byU5by15b2r5b605oey5oyR5pqi5pyd5r2u54mS55S655y66IG06IS56IW46J226Kq/6Kuc6LaF6Lez6Yqa6ZW36aCC6bOl5YuF5o2X55u05pyV5rKI54+N6LOD6Y6u6Zmz5rSl5aKc5qSO5qeM6L+96Y6a55eb6YCa5aGa5qCC5o605qe75L2D5rys5p+Y6L676JSm57a06Y2U5qS/5r2w5Z2q5aO35ays57Ss54iq5ZCK6Yej6ba05Lqt5L2O5YGc5YG15YmD6LKe5ZGI5aCk5a6a5bid5bqV5bqt5bu35byf5oKM5oq15oy65o+Q5qKv5rGA56KH56aO56iL57eg6ImH6KiC6Kum6LmE6YCTXCJdLFxuW1wiOTM0MFwiLFwi6YK46YSt6YeY6byO5rOl5pGY5pOi5pW15ru055qE56yb6YGp6Y+R5rq65ZOy5b655pKk6L2N6L+t6YmE5YW45aGr5aSp5bGV5bqX5re757qP55Sc6LK86Lui6aGb54K55Lyd5q6/5r6x55Sw6Zu75YWO5ZCQ5aC15aGX5aas5bGg5b6S5paX5p2c5rih55m76I+f6LOt6YCU6YO96Y2N56Cl56C65Yqq5bqm5Zyf5aW05oCS5YCS5YWa5YasXCJdLFxuW1wiOTM4MFwiLFwi5YeN5YiA5ZSQ5aGU5aGY5aWX5a6V5bO25baL5oK85oqV5pCt5p2x5qGD5qK85qOf55uX5reY5rmv5rab54Gv54eI5b2T55eY56W3562J562U562S57OW57Wx5Yiw6JGj6JWp6Jek6KiO6KyE6LGG6LiP6YCD6YCP6ZCZ6Zm26aCt6aiw6ZeY5YON5YuV5ZCM5aCC5bCO5oan5pKe5rSe556z56ul6IO06JCE6YGT6YqF5bOg6bSH5Yy/5b6X5b6z5rac54m5552j56a/56+k5q+S54us6Kqt5qCD5qmh5Ye456qB5qS05bGK6bO26Iur5a+F6YWJ54Ce5Zm45bGv5oOH5pWm5rKM6LGa6YGB6aCT5ZGR5puH6YiN5aWI6YKj5YaF5LmN5Yeq6JaZ6KyO54GY5o266Y2L5qWi6aa057iE55W35Y2X5qWg6Luf6Zuj5rGd5LqM5bC85byQ6L+p5YyC6LOR6IKJ6Jm55bu/5pel5Lmz5YWlXCJdLFxuW1wiOTQ0MFwiLFwi5aaC5bC/6Z+u5Lu75aaK5b+N6KqN5r+h56aw56Wi5a+n6JGx54yr54ax5bm05b+15o275pKa54eD57KY5LmD5bu85LmL5Z+c5Zqi5oKp5r+D57SN6IO96ISz6Ia/6L6y6KaX6Jqk5be05oqK5pKt6KaH5p235rOi5rS+55C256C05amG57216Iqt6aas5L+z5buD5oud5o6S5pWX5p2v55uD54mM6IOM6IK66Lyp6YWN5YCN5Z+55aqS5qKFXCJdLFxuW1wiOTQ4MFwiLFwi5qWz54Wk54u96LK35aOy6LOg6Zmq6YCZ6J2/56ek55+n6JCp5Lyv5Yml5Y2a5ouN5p+P5rOK55m9566U57KV6Ii26JaE6L+r5pud5ryg54iG57ib6I6r6aeB6bqm5Ye9566x56Gy56646IKH562I5quo5bmh6IKM55WR55Wg5YWr6Ymi5rqM55m66YaX6auq5LyQ572w5oqc562P6Zal6bOp5Zm65aGZ6Juk6Zq85Ly05Yik5Y2K5Y+N5Y+b5biG5pCs5paR5p2/5rC+5rGO54mI54qv54+t55WU57mB6Iis6Jep6LKp56+E6YeG54Wp6aCS6aOv5oy95pmp55Wq55uk56OQ6JWD6Juu5Yyq5Y2R5ZCm5aaD5bqH5b285oKy5omJ5om55oqr5paQ5q+U5rOM55ay55qu56KR56eY57eL57236IKl6KKr6Kq56LK76YG/6Z2e6aOb5qiL57C45YKZ5bC+5b6u5p6H5q+Y55C155yJ576OXCJdLFxuW1wiOTU0MFwiLFwi6by75p+K56iX5Yy555aL6aut5b2m6Iad6I+x6IKY5by85b+F55Wi562G6YC85qGn5aer5aqb57SQ55m+6Kys5L+15b2q5qiZ5rC35ryC55Oi56Wo6KGo6KmV6LG55buf5o+P55eF56eS6IuX6Yyo6Yuy6JKc6Jut6bCt5ZOB5b2s5paM5rWc54CV6LKn6LOT6aC75pWP55O25LiN5LuY5Z+g5aSr5amm5a+M5Yao5biD5bqc5oCW5om25pW3XCJdLFxuW1wiOTU4MFwiLFwi5pan5pmu5rWu54i256ym6IWQ6Iaa6IqZ6K2c6LKg6LOm6LW06Zic6ZmE5L6u5pKr5q2m6Iie6JGh6JWq6YOo5bCB5qWT6aKo6JG66JWX5LyP5Ymv5b6p5bmF5pyN56aP6IW56KSH6KaG5re15byX5omV5rK45LuP54mp6a6S5YiG5ZC75Zm05aKz5oak5omu54Sa5aWu57KJ57Oe57Sb6Zuw5paH6IGe5LiZ5L215YW15aGA5bmj5bmz5byK5p+E5Lim6JS96ZaJ6Zmb57Gz6aCB5YO75aOB55mW56Kn5Yil556l6JSR566G5YGP5aSJ54mH56+H57eo6L666L+U6YGN5L6/5YuJ5aip5byB6Z6t5L+d6IiX6Yuq5ZyD5o2V5q2p55Sr6KOc6LyU56mC5Yuf5aKT5oWV5oiK5pqu5q+N57C/6I+p5YCj5L+45YyF5ZGG5aCx5aWJ5a6d5bOw5bOv5bSp5bqW5oqx5o2n5pS+5pa55pyLXCJdLFxuW1wiOTY0MFwiLFwi5rOV5rOh54O556Cy57ir6IOe6Iqz6JCM6JOs6JyC6KSS6Kiq6LGK6YKm6YuS6aO96bOz6bWs5LmP5Lqh5YKN5YmW5Z2K5aao5bi95b+Y5b+Z5oi/5pq05pyb5p+Q5qOS5YaS57Sh6IKq6Iao6KyA6LKM6LK/6Ym+6Ziy5ZCg6aCs5YyX5YOV5Y2c5aKo5pKy5py054mn552m56mG6Yem5YuD5rKh5q6G5aCA5bmM5aWU5pys57+75Yeh55uGXCJdLFxuW1wiOTY4MFwiLFwi5pGp56Oo6a2U6bq75Z+L5aa55pin5p6a5q+O5ZOp5qeZ5bmV6Iac5p6V6a6q5p++6bGS5qGd5Lqm5L+j5Y+I5oq55pyr5rKr6L+E5L6t57mt6bq/5LiH5oWi5rqA5ryr6JST5ZGz5pyq6a2F5bez566V5bKs5a+G6Jyc5rmK6JOR56iU6ISI5aaZ57KN5rCR55yg5YuZ5aSi54Sh54mf55+b6Zyn6bWh5qSL5am/5aiY5Yal5ZCN5ZG95piO55uf6L+36YqY6bO05aeq54md5ruF5YWN5qOJ57a/57es6Z2i6bq65pG45qih6IyC5aaE5a2f5q+b54yb55uy57ay6ICX6JKZ5YSy5pyo6buZ55uu5p2i5Yu/6aSF5bCk5oi757G+6LKw5ZWP5oK257SL6ZaA5YyB5Lmf5Ya25aSc54i66IC26YeO5byl55+i5Y6E5b2557SE6Jas6Kiz6LqN6Z2W5p+z6Jau6ZGT5oSJ5oSI5rK555mSXCJdLFxuW1wiOTc0MFwiLFwi6Kut6Ly45ZSv5L2R5YSq5YuH5Y+L5a6l5bm95oKg5oaC5o+W5pyJ5p+a5rmn5raM54y254y355Sx56WQ6KOV6KqY6YGK6YKR6YO16ZuE6J6N5aSV5LqI5L2Z5LiO6KqJ6Ly/6aCQ5YKt5bm85aaW5a655bq45o+a5o+65pOB5puc5qWK5qeY5rSL5rq254aU55So56qv576K6ICA6JGJ6JOJ6KaB6Kyh6LiK6YGl6Zm96aSK5oW+5oqR5qyyXCJdLFxuW1wiOTc4MFwiLFwi5rKD5rW057+M57+85reA576F6J666KO45p2l6I6x6aC86Zu35rSb57Wh6JC96YWq5Lmx5Y215bWQ5qyE5r+r6JeN6Jit6Kan5Yip5ZCP5bGl5p2O5qKo55CG55KD55ei6KOP6KOh6YeM6Zui6Zm45b6L546H56uL6JGO5o6g55Wl5YqJ5rWB5rqc55CJ55WZ56Gr57KS6ZqG56uc6b6N5L625oWu5peF6Jmc5LqG5Lqu5YOa5Lih5YeM5a+u5paZ5qKB5ra854yf55mC556t56ic57On6Imv6KuS6YG86YeP6Zm16aCY5Yqb57eR5YCr5Y6Y5p6X5reL54eQ55Cz6Ieo6Lyq6Zqj6bGX6bqf55Gg5aGB5raZ57Sv6aGe5Luk5Ly25L6L5Ya35Yqx5ba65oCc546y56S86IuT6Yi06Zq36Zu26ZyK6bqX6b2i5pqm5q205YiX5Yqj54OI6KOC5buJ5oGL5oaQ5ryj54WJ57C+57e06IGvXCJdLFxuW1wiOTg0MFwiLFwi6JOu6YCj6Yys5ZGC6a2v5quT54KJ6LOC6Lev6Zyy5Yq05amB5buK5byE5pyX5qW85qaU5rWq5ryP54mi54u856+t6ICB6IG+6J2L6YOO5YWt6bqT56aE6IKL6Yyy6KuW5YCt5ZKM6Kmx5q2q6LOE6ISH5oOR5p6g6bey5LqZ5LqY6bCQ6Kmr6JeB6JWo5qSA5rm+56KX6IWVXCJdLFxuW1wiOTg5ZlwiLFwi5byM5LiQ5LiV5Liq5Lix5Li25Li85Li/5LmC5LmW5LmY5LqC5LqF6LGr5LqK6IiS5byN5LqO5Lqe5Lqf5Lqg5Lqi5Lqw5Lqz5Lq25LuO5LuN5LuE5LuG5LuC5LuX5Lue5Lut5Luf5Lu35LyJ5L2a5Lyw5L2b5L2d5L2X5L2H5L225L6I5L6P5L6Y5L275L2p5L2w5L6R5L2v5L6G5L6W5YSY5L+U5L+f5L+O5L+Y5L+b5L+R5L+a5L+Q5L+k5L+l5YCa5YCo5YCU5YCq5YCl5YCF5Lyc5L+25YCh5YCp5YCs5L++5L+v5YCR5YCG5YGD5YGH5pyD5YGV5YGQ5YGI5YGa5YGW5YGs5YG45YKA5YKa5YKF5YK05YKyXCJdLFxuW1wiOTk0MFwiLFwi5YOJ5YOK5YKz5YOC5YOW5YOe5YOl5YOt5YOj5YOu5YO55YO15YSJ5YSB5YSC5YSW5YSV5YSU5YSa5YSh5YS65YS35YS85YS75YS/5YWA5YWS5YWM5YWU5YWi56u45YWp5YWq5YWu5YaA5YaC5ZuY5YaM5YaJ5YaP5YaR5YaT5YaV5YaW5Yak5Yam5Yai5Yap5Yaq5Yar5Yaz5Yax5Yay5Yaw5Ya15Ya95YeF5YeJ5Yeb5Yeg6JmV5Yep5YetXCJdLFxuW1wiOTk4MFwiLFwi5Yew5Ye15Ye+5YiE5YiL5YiU5YiO5Yin5Yiq5Yiu5Yiz5Yi55YmP5YmE5YmL5YmM5Yme5YmU5Ymq5Ym05Ymp5Ymz5Ym/5Ym95YqN5YqU5YqS5Ymx5YqI5YqR6L6o6L6n5Yqs5Yqt5Yq85Yq15YuB5YuN5YuX5Yue5Yuj5Yum6aOt5Yug5Yuz5Yu15Yu45Yu55YyG5YyI55S45YyN5YyQ5YyP5YyV5Yya5Yyj5Yyv5Yyx5Yyz5Yy45Y2A5Y2G5Y2F5LiX5Y2J5Y2N5YeW5Y2e5Y2p5Y2u5aSY5Y275Y235Y6C5Y6W5Y6g5Y6m5Y6l5Y6u5Y6w5Y625Y+D57CS6ZuZ5Y+f5pu854eu5Y+u5Y+o5Y+t5Y+65ZCB5ZC95ZGA5ZCs5ZCt5ZC85ZCu5ZC25ZCp5ZCd5ZGO5ZKP5ZG15ZKO5ZGf5ZGx5ZG35ZGw5ZKS5ZG75ZKA5ZG25ZKE5ZKQ5ZKG5ZOH5ZKi5ZK45ZKl5ZKs5ZOE5ZOI5ZKoXCJdLFxuW1wiOWE0MFwiLFwi5ZKr5ZOC5ZKk5ZK+5ZK85ZOY5ZOl5ZOm5ZSP5ZSU5ZO95ZOu5ZOt5ZO65ZOi5ZS55ZWA5ZWj5ZWM5ZSu5ZWc5ZWF5ZWW5ZWX5ZS45ZSz5ZWd5ZaZ5ZaA5ZKv5ZaK5Zaf5ZW75ZW+5ZaY5Zae5Zau5ZW85ZaD5Zap5ZaH5Zao5Zea5ZeF5Zef5ZeE5Zec5Zek5ZeU5ZiU5Ze35ZiW5Ze+5Ze95Zib5Ze55ZmO5ZmQ54ef5Zi05Zi25Ziy5Zi4XCJdLFxuW1wiOWE4MFwiLFwi5Zmr5Zmk5Ziv5Zms5Zmq5ZqG5ZqA5ZqK5Zqg5ZqU5ZqP5Zql5Zqu5Zq25Zq05ZuC5Zq85ZuB5ZuD5ZuA5ZuI5ZuO5ZuR5ZuT5ZuX5Zuu5Zu55ZyA5Zu/5ZyE5ZyJ5ZyI5ZyL5ZyN5ZyT5ZyY5ZyW5ZeH5Zyc5Zym5Zy35Zy45Z2O5Zy75Z2A5Z2P5Z2p5Z+A5Z6I5Z2h5Z2/5Z6J5Z6T5Z6g5Z6z5Z6k5Z6q5Z6w5Z+D5Z+G5Z+U5Z+S5Z+T5aCK5Z+W5Z+j5aCL5aCZ5aCd5aGy5aCh5aGi5aGL5aGw5q+A5aGS5aC95aG55aKF5aK55aKf5aKr5aK65aOe5aK75aK45aKu5aOF5aOT5aOR5aOX5aOZ5aOY5aOl5aOc5aOk5aOf5aOv5aO65aO55aO75aO85aO95aSC5aSK5aSQ5aSb5qKm5aSl5aSs5aSt5aSy5aS45aS+56uS5aWV5aWQ5aWO5aWa5aWY5aWi5aWg5aWn5aWs5aWpXCJdLFxuW1wiOWI0MFwiLFwi5aW45aaB5aad5L2e5L6r5aaj5aay5aeG5aeo5aec5aaN5aeZ5aea5ail5aif5aiR5aic5aiJ5aia5amA5ams5amJ5ai15ai25ami5amq5aqa5aq85aq+5auL5auC5aq95auj5auX5aum5aup5auW5au65au75ayM5ayL5ayW5ayy5auQ5ayq5ay25ay+5a2D5a2F5a2A5a2R5a2V5a2a5a2b5a2l5a2p5a2w5a2z5a215a245paI5a265a6AXCJdLFxuW1wiOWI4MFwiLFwi5a6D5a6m5a645a+D5a+H5a+J5a+U5a+Q5a+k5a+m5a+i5a+e5a+l5a+r5a+w5a+25a+z5bCF5bCH5bCI5bCN5bCT5bCg5bCi5bCo5bC45bC55bGB5bGG5bGO5bGT5bGQ5bGP5a2x5bGs5bGu5Lmi5bG25bG55bKM5bKR5bKU5aab5bKr5bK75bK25bK85bK35bOF5bK+5bOH5bOZ5bOp5bO95bO65bOt5baM5bOq5bSL5bSV5bSX5bWc5bSf5bSb5bSR5bSU5bSi5bSa5bSZ5bSY5bWM5bWS5bWO5bWL5bWs5bWz5bW25baH5baE5baC5bai5bad5bas5bau5ba95baQ5ba35ba85beJ5beN5beT5beS5beW5beb5ber5bey5be15biL5bia5biZ5biR5bib5bi25bi35bmE5bmD5bmA5bmO5bmX5bmU5bmf5bmi5bmk5bmH5bm15bm25bm66bq85bm/5bqg5buB5buC5buI5buQ5buPXCJdLFxuW1wiOWM0MFwiLFwi5buW5buj5bud5bua5bub5bui5buh5buo5bup5bus5bux5buz5buw5bu05bu45bu+5byD5byJ5b2d5b2c5byL5byR5byW5byp5byt5by45b2B5b2I5b2M5b2O5byv5b2R5b2W5b2X5b2Z5b2h5b2t5b2z5b235b6D5b6C5b2/5b6K5b6I5b6R5b6H5b6e5b6Z5b6Y5b6g5b6o5b6t5b685b+W5b+75b+k5b+45b+x5b+d5oKz5b+/5oCh5oGgXCJdLFxuW1wiOWM4MFwiLFwi5oCZ5oCQ5oCp5oCO5oCx5oCb5oCV5oCr5oCm5oCP5oC65oGa5oGB5oGq5oG35oGf5oGK5oGG5oGN5oGj5oGD5oGk5oGC5oGs5oGr5oGZ5oKB5oKN5oOn5oKD5oKa5oKE5oKb5oKW5oKX5oKS5oKn5oKL5oOh5oK45oOg5oOT5oK05b+w5oK95oOG5oK15oOY5oWN5oSV5oSG5oO25oO35oSA5oO05oO65oSD5oSh5oO75oOx5oSN5oSO5oWH5oS+5oSo5oSn5oWK5oS/5oS85oSs5oS05oS95oWC5oWE5oWz5oW35oWY5oWZ5oWa5oWr5oW05oWv5oWl5oWx5oWf5oWd5oWT5oW15oaZ5oaW5oaH5oas5oaU5oaa5oaK5oaR5oar5oau5oeM5oeK5oeJ5oe35oeI5oeD5oeG5oa65oeL57255oeN5oem5oej5oe25oe65oe05oe/5oe95oe85oe+5oiA5oiI5oiJ5oiN5oiM5oiU5oibXCJdLFxuW1wiOWQ0MFwiLFwi5oie5oih5oiq5oiu5oiw5oiy5oiz5omB5omO5ome5omj5omb5omg5omo5om85oqC5oqJ5om+5oqS5oqT5oqW5ouU5oqD5oqU5ouX5ouR5oq75ouP5ou/5ouG5pOU5ouI5ouc5ouM5ouK5ouC5ouH5oqb5ouJ5oyM5ouu5oux5oyn5oyC5oyI5ouv5ou15o2Q5oy+5o2N5pCc5o2P5o6W5o6O5o6A5o6r5o225o6j5o6P5o6J5o6f5o615o2rXCJdLFxuW1wiOWQ4MFwiLFwi5o2p5o6+5o+p5o+A5o+G5o+j5o+J5o+S5o+25o+E5pCW5pC05pCG5pCT5pCm5pC25pSd5pCX5pCo5pCP5pGn5pGv5pG25pGO5pSq5pKV5pKT5pKl5pKp5pKI5pK85pOa5pOS5pOF5pOH5pK75pOY5pOC5pOx5pOn6IiJ5pOg5pOh5oqs5pOj5pOv5pSs5pO25pO05pOy5pO65pSA5pO95pSY5pSc5pSF5pSk5pSj5pSr5pS05pS15pS35pS25pS455WL5pWI5pWW5pWV5pWN5pWY5pWe5pWd5pWy5pW45paC5paD6K6K5pab5paf5par5pa35peD5peG5peB5peE5peM5peS5peb5peZ5peg5peh5pex5p2y5piK5piD5pe75p2z5pi15pi25pi05pic5pmP5pmE5pmJ5pmB5pme5pmd5pmk5pmn5pmo5pmf5pmi5pmw5pqD5pqI5pqO5pqJ5pqE5pqY5pqd5puB5pq55puJ5pq+5pq8XCJdLFxuW1wiOWU0MFwiLFwi5puE5pq45puW5pua5pug5pi/5pum5pup5puw5pu15pu35pyP5pyW5pye5pym5pyn6Zy45pyu5py/5py25p2B5py45py35p2G5p2e5p2g5p2Z5p2j5p2k5p6J5p2w5p6p5p285p2q5p6M5p6L5p6m5p6h5p6F5p635p+v5p605p+s5p6z5p+p5p645p+k5p+e5p+d5p+i5p+u5p655p+O5p+G5p+n5qqc5qCe5qGG5qCp5qGA5qGN5qCy5qGOXCJdLFxuW1wiOWU4MFwiLFwi5qKz5qCr5qGZ5qGj5qG35qG/5qKf5qKP5qKt5qKU5qKd5qKb5qKD5qqu5qK55qG05qK15qKg5qK65qSP5qKN5qG+5qSB5qOK5qSI5qOY5qSi5qSm5qOh5qSM5qON5qOU5qOn5qOV5qS25qSS5qSE5qOX5qOj5qSl5qO55qOg5qOv5qSo5qSq5qSa5qSj5qSh5qOG5qW55qW35qWc5qW45qWr5qWU5qW+5qWu5qS55qW05qS95qWZ5qSw5qWh5qWe5qWd5qaB5qWq5qay5qau5qeQ5qa/5qeB5qeT5qa+5qeO5a+o5qeK5qed5qa75qeD5qan5qiu5qaR5qag5qac5qaV5qa05qee5qeo5qiC5qib5qe/5qyK5qe55qey5qen5qiF5qax5qie5qet5qiU5qer5qiK5qiS5quB5qij5qiT5qmE5qiM5qmy5qi25qm45qmH5qmi5qmZ5qmm5qmI5qi45qii5qqQ5qqN5qqg5qqE5qqi5qqjXCJdLFxuW1wiOWY0MFwiLFwi5qqX6JiX5qq75quD5quC5qq45qqz5qqs5que5quR5quf5qqq5qua5quq5qu75qyF6JiW5qu65qyS5qyW6ayx5qyf5qy45qy355uc5qy56aOu5q2H5q2D5q2J5q2Q5q2Z5q2U5q2b5q2f5q2h5q245q255q2/5q6A5q6E5q6D5q6N5q6Y5q6V5q6e5q6k5q6q5q6r5q6v5q6y5q6x5q6z5q635q685q+G5q+L5q+T5q+f5q+s5q+r5q+z5q+vXCJdLFxuW1wiOWY4MFwiLFwi6bq+5rCI5rCT5rCU5rCb5rCk5rCj5rGe5rGV5rGi5rGq5rKC5rKN5rKa5rKB5rKb5rG+5rGo5rGz5rKS5rKQ5rOE5rOx5rOT5rK95rOX5rOF5rOd5rKu5rKx5rK+5rK65rOb5rOv5rOZ5rOq5rSf6KGN5rS25rSr5rS95rS45rSZ5rS15rSz5rSS5rSM5rWj5raT5rWk5rWa5rW55rWZ5raO5raV5r+k5raF5re55riV5riK5ra15reH5rem5ra45reG5res5ree5reM5reo5reS5reF5re65reZ5rek5reV5req5reu5rit5rmu5riu5riZ5rmy5rmf5ri+5rij5rmr5rir5rm25rmN5rif5rmD5ri65rmO5rik5ru/5rid5ri45rqC5rqq5rqY5ruJ5rq35ruT5rq95rqv5ruE5rqy5ruU5ruV5rqP5rql5ruC5rqf5r2B5ryR54GM5rus5ru45ru+5ry/5ruy5ryx5ruv5ryy5ruMXCJdLFxuW1wiZTA0MFwiLFwi5ry+5ryT5ru35r6G5r265r245r6B5r6A5r2v5r2b5r+z5r2t5r6C5r285r2Y5r6O5r6R5r+C5r2m5r6z5r6j5r6h5r6k5r655r+G5r6q5r+f5r+V5r+s5r+U5r+Y5r+x5r+u5r+b54CJ54CL5r+654CR54CB54CP5r++54Cb54Ca5r2054Cd54CY54Cf54Cw54C+54Cy54GR54Gj54KZ54KS54Kv54Ox54Ks54K454Kz54Ku54Of54OL54OdXCJdLFxuW1wiZTA4MFwiLFwi54OZ54SJ54O954Sc54SZ54Wl54WV54aI54Wm54Wi54WM54WW54Ws54aP54e754aE54aV54ao54as54eX54a554a+54eS54eJ54eU54eO54eg54es54en54e154e854e554e/54iN54iQ54ib54io54it54is54iw54iy54i754i854i/54mA54mG54mL54mY54m054m+54qC54qB54qH54qS54qW54qi54qn54q554qy54uD54uG54uE54uO54uS54ui54ug54uh54u554u35YCP54yX54yK54yc54yW54yd54y054yv54yp54yl54y+542O542P6buY542X542q542o542w542454215427542654+I546z54+O546754+A54+l54+u54+e55Ki55CF55Gv55Cl54+455Cy55C655GV55C/55Gf55GZ55GB55Gc55Gp55Gw55Gj55Gq55G255G+55KL55Ke55Kn55OK55OP55OU54+xXCJdLFxuW1wiZTE0MFwiLFwi55Og55Oj55On55Op55Ou55Oy55Ow55Ox55O455O355SE55SD55SF55SM55SO55SN55SV55ST55Se55Sm55Ss55S855WE55WN55WK55WJ55Wb55WG55Wa55Wp55Wk55Wn55Wr55Wt55W455W255aG55aH55W055aK55aJ55aC55aU55aa55ad55al55aj55eC55az55eD55a155a955a455a855ax55eN55eK55eS55eZ55ej55ee55e+55e/XCJdLFxuW1wiZTE4MFwiLFwi55e855iB55ew55e655ey55ez55iL55iN55iJ55if55in55ig55ih55ii55ik55i055iw55i755mH55mI55mG55mc55mY55mh55mi55mo55mp55mq55mn55ms55mw55my55m255m455m855qA55qD55qI55qL55qO55qW55qT55qZ55qa55qw55q055q455q555q655uC55uN55uW55uS55ue55uh55ul55un55uq6Jiv55u755yI55yH55yE55yp55yk55ye55yl55ym55yb55y355y4552H552a552o552r552b552l552/552+5525556O556L556R556g556e556w55625565556/55685569556755+H55+N55+X55+a55+c55+j55+u55+856CM56CS56Sm56Cg56Sq56GF56KO56G056KG56G856Ka56KM56Kj56K156Kq56Kv56OR56OG56OL56OU56K+56K856OF56OK56OsXCJdLFxuW1wiZTI0MFwiLFwi56On56Oa56O956O056SH56SS56SR56SZ56Ss56Sr56WA56Wg56WX56Wf56Wa56WV56WT56W656W/56aK56ad56an6b2L56aq56au56az56a556a656eJ56eV56en56es56eh56ej56iI56iN56iY56iZ56ig56if56aA56ix56i756i+56i356mD56mX56mJ56mh56mi56mp6b6d56mw56m556m956qI56qX56qV56qY56qW56qp56uI56qwXCJdLFxuW1wiZTI4MFwiLFwi56q256uF56uE56q/6YKD56uH56uK56uN56uP56uV56uT56uZ56ua56ud56uh56ui56um56ut56uw56yC56yP56yK56yG56yz56yY56yZ56ye56y156yo56y2562Q562656yE562N56yL562M562F5621562l5620562n562w562x562s562u566d566Y566f566N566c566a566L566S566P562d566Z56+L56+B56+M56+P566056+G56+d56+p57CR57CU56+m56+l57Gg57CA57CH57CT56+z56+357CX57CN56+257Cj57Cn57Cq57Cf57C357Cr57C957GM57GD57GU57GP57GA57GQ57GY57Gf57Gk57GW57Gl57Gs57G157KD57KQ57Kk57Kt57Ki57Kr57Kh57Ko57Kz57Ky57Kx57Ku57K557K957OA57OF57OC57OY57OS57Oc57Oi6ay757Ov57Oy57O057O257O657SGXCJdLFxuW1wiZTM0MFwiLFwi57SC57Sc57SV57SK57WF57WL57Su57Sy57S/57S157WG57Wz57WW57WO57Wy57Wo57Wu57WP57Wj57aT57aJ57Wb57aP57W957ab57a657au57aj57a157eH57a957ar57i957ai57av57ec57a457af57aw57eY57ed57ek57ee57e757ey57eh57iF57iK57ij57ih57iS57ix57if57iJ57iL57ii57mG57mm57i757i157i557mD57i3XCJdLFxuW1wiZTM4MFwiLFwi57iy57i657mn57md57mW57me57mZ57ma57m557mq57mp57m857m757qD57eV57m96L6u57m/57qI57qJ57qM57qS57qQ57qT57qU57qW57qO57qb57qc57y457y6572F572M572N572O572Q572R572V572U572Y572f572g572o572p572n5724576C576G576D576I576H576M576U576e576d576a576j576v576y5765576u576257646K2x57+F57+G57+K57+V57+U57+h57+m57+p57+z57+56aOc6ICG6ICE6ICL6ICS6ICY6ICZ6ICc6ICh6ICo6IC/6IC76IGK6IGG6IGS6IGY6IGa6IGf6IGi6IGo6IGz6IGy6IGw6IG26IG56IG96IG/6IKE6IKG6IKF6IKb6IKT6IKa6IKt5YaQ6IKs6IOb6IOl6IOZ6IOd6IOE6IOa6IOW6ISJ6IOv6IOx6ISb6ISp6ISj6ISv6IWLXCJdLFxuW1wiZTQ0MFwiLFwi6ZqL6IWG6IS+6IWT6IWR6IO86IWx6IWu6IWl6IWm6IW06IaD6IaI6IaK6IaA6IaC6Iag6IaV6Iak6Iaj6IWf6IaT6Iap6Iaw6Ia16Ia+6Ia46Ia96IeA6IeC6Ia66IeJ6IeN6IeR6IeZ6IeY6IeI6Iea6Ief6Ieg6Ien6Ie66Ie76Ie+6IiB6IiC6IiF6IiH6IiK6IiN6IiQ6IiW6Iip6Iir6Ii46Iiz6ImA6ImZ6ImY6Imd6Ima6Imf6ImkXCJdLFxuW1wiZTQ4MFwiLFwi6Imi6Imo6Imq6Imr6Iiu6Imx6Im36Im46Im+6IqN6IqS6Iqr6Iqf6Iq76Iqs6Iuh6Iuj6Iuf6IuS6Iu06Iuz6Iu66I6T6IyD6Iu76Iu56Iue6IyG6Iuc6IyJ6IuZ6Iy16Iy06IyW6Iyy6Iyx6I2A6Iy56I2Q6I2F6Iyv6Iyr6IyX6IyY6I6F6I6a6I6q6I6f6I6i6I6W6Iyj6I6O6I6H6I6K6I286I616I2z6I216I6g6I6J6I6o6I+06JCT6I+r6I+O6I+96JCD6I+Y6JCL6I+B6I+36JCH6I+g6I+y6JCN6JCi6JCg6I696JC46JSG6I+76JGt6JCq6JC86JWa6JKE6JG36JGr6JKt6JGu6JKC6JGp6JGG6JCs6JGv6JG56JC16JOK6JGi6JK56JK/6JKf6JOZ6JON6JK76JOa6JOQ6JOB6JOG6JOW6JKh6JSh6JO/6JO06JSX6JSY6JSs6JSf6JSV6JSU6JO86JWA6JWj6JWY6JWIXCJdLFxuW1wiZTU0MFwiLFwi6JWB6JiC6JWL6JWV6JaA6Jak6JaI6JaR6JaK6Jao6JWt6JaU6Jab6Jeq6JaH6Jac6JW36JW+6JaQ6JeJ6Ja66JeP6Ja56JeQ6JeV6Jed6Jel6Jec6Je56JiK6JiT6JiL6Je+6Je66JiG6Jii6Jia6Jiw6Ji/6JmN5LmV6JmU6Jmf6Jmn6Jmx6JqT6Jqj6Jqp6Jqq6JqL6JqM6Jq26Jqv6JuE6JuG6Jqw6JuJ6KCj6Jqr6JuU6Jue6Jup6JusXCJdLFxuW1wiZTU4MFwiLFwi6Juf6Jub6Juv6JyS6JyG6JyI6JyA6JyD6Ju76JyR6JyJ6JyN6Ju56JyK6Jy06Jy/6Jy36Jy76Jyl6Jyp6Jya6J2g6J2f6J246J2M6J2O6J206J2X6J2o6J2u6J2Z6J2T6J2j6J2q6KCF6J6i6J6f6J6C6J6v6J+L6J696J+A6J+Q6ZuW6J6r6J+E6J6z6J+H6J+G6J676J+v6J+y6J+g6KCP6KCN6J++6J+26J+36KCO6J+S6KCR6KCW6KCV6KCi6KCh6KCx6KC26KC56KCn6KC76KGE6KGC6KGS6KGZ6KGe6KGi6KGr6KKB6KG+6KKe6KG16KG96KK16KGy6KKC6KKX6KKS6KKu6KKZ6KKi6KKN6KKk6KKw6KK/6KKx6KOD6KOE6KOU6KOY6KOZ6KOd6KO56KSC6KO86KO06KOo6KOy6KSE6KSM6KSK6KST6KWD6KSe6KSl6KSq6KSr6KWB6KWE6KS76KS26KS46KWM6KSd6KWg6KWeXCJdLFxuW1wiZTY0MFwiLFwi6KWm6KWk6KWt6KWq6KWv6KW06KW36KW+6KaD6KaI6KaK6KaT6KaY6Kah6Kap6Kam6Kas6Kav6Kay6Ka66Ka96Ka/6KeA6Kea6Kec6Ked6Ken6Ke06Ke46KiD6KiW6KiQ6KiM6Kib6Kid6Kil6Ki26KmB6Kmb6KmS6KmG6KmI6Km86Kmt6Kms6Kmi6KqF6KqC6KqE6Kqo6Kqh6KqR6Kql6Kqm6Kqa6Kqj6KuE6KuN6KuC6Kua6Kur6Kuz6KunXCJdLFxuW1wiZTY4MFwiLFwi6Kuk6Kux6KyU6Kug6Kui6Ku36Kue6Kub6KyM6KyH6Kya6Kuh6KyW6KyQ6KyX6Kyg6Kyz6Z6r6Kym6Kyr6Ky+6Kyo6K2B6K2M6K2P6K2O6K2J6K2W6K2b6K2a6K2r6K2f6K2s6K2v6K206K296K6A6K6M6K6O6K6S6K6T6K6W6K6Z6K6a6LC66LGB6LC/6LGI6LGM6LGO6LGQ6LGV6LGi6LGs6LG46LG66LKC6LKJ6LKF6LKK6LKN6LKO6LKU6LG86LKY5oid6LKt6LKq6LK96LKy6LKz6LKu6LK26LOI6LOB6LOk6LOj6LOa6LO96LO66LO76LSE6LSF6LSK6LSH6LSP6LSN6LSQ6b2O6LST6LON6LSU6LSW6LWn6LWt6LWx6LWz6LaB6LaZ6LeC6La+6La66LeP6Lea6LeW6LeM6Leb6LeL6Leq6Ler6Lef6Lej6Le86LiI6LiJ6Le/6Lid6Lie6LiQ6Lif6LmC6Li16Liw6Li06LmKXCJdLFxuW1wiZTc0MFwiLFwi6LmH6LmJ6LmM6LmQ6LmI6LmZ6Lmk6Lmg6Liq6Lmj6LmV6Lm26Lmy6Lm86LqB6LqH6LqF6LqE6LqL6LqK6LqT6LqR6LqU6LqZ6Lqq6Lqh6Lqs6Lqw6LuG6Lqx6Lq+6LuF6LuI6LuL6Lub6Luj6Lu86Lu76Lur6Lu+6LyK6LyF6LyV6LyS6LyZ6LyT6Lyc6Lyf6Lyb6LyM6Lym6Lyz6Ly76Ly56L2F6L2C6Ly+6L2M6L2J6L2G6L2O6L2X6L2cXCJdLFxuW1wiZTc4MFwiLFwi6L2i6L2j6L2k6L6c6L6f6L6j6L6t6L6v6L636L+a6L+l6L+i6L+q6L+v6YKH6L+06YCF6L+56L+66YCR6YCV6YCh6YCN6YCe6YCW6YCL6YCn6YC26YC16YC56L+46YGP6YGQ6YGR6YGS6YCO6YGJ6YC+6YGW6YGY6YGe6YGo6YGv6YG26Zqo6YGy6YKC6YG96YKB6YKA6YKK6YKJ6YKP6YKo6YKv6YKx6YK16YOi6YOk5omI6YOb6YSC6YSS6YSZ6YSy6YSw6YWK6YWW6YWY6YWj6YWl6YWp6YWz6YWy6YaL6YaJ6YaC6Yai6Yar6Yav6Yaq6Ya16Ya06Ya66YeA6YeB6YeJ6YeL6YeQ6YeW6Yef6Yeh6Yeb6Ye86Ye16Ye26Yie6Ye/6YiU6Yis6YiV6YiR6Yme6YmX6YmF6YmJ6Ymk6YmI6YqV6Yi/6YmL6YmQ6Yqc6YqW6YqT6Yqb6Yma6YuP6Yq56Yq36Yup6YyP6Yu66Y2E6YyuXCJdLFxuW1wiZTg0MFwiLFwi6YyZ6Yyi6Yya6Yyj6Yy66Yy16Yy76Y2c6Y2g6Y286Y2u6Y2W6Y6w6Y6s6Y6t6Y6U6Y656Y+W6Y+X6Y+o6Y+l6Y+Y6Y+D6Y+d6Y+Q6Y+I6Y+k6ZCa6ZCU6ZCT6ZCD6ZCH6ZCQ6ZC26ZCr6ZC16ZCh6ZC66ZGB6ZGS6ZGE6ZGb6ZGg6ZGi6ZGe6ZGq6Yip6ZGw6ZG16ZG36ZG96ZGa6ZG86ZG+6ZKB6ZG/6ZaC6ZaH6ZaK6ZaU6ZaW6ZaY6ZaZXCJdLFxuW1wiZTg4MFwiLFwi6Zag6Zao6Zan6Zat6Za86Za76Za56Za+6ZeK5r+26ZeD6ZeN6ZeM6ZeV6ZeU6ZeW6Zec6Zeh6Zel6Zei6Zih6Zio6Ziu6Ziv6ZmC6ZmM6ZmP6ZmL6Zm36Zmc6Zme6Zmd6Zmf6Zmm6Zmy6Zms6ZqN6ZqY6ZqV6ZqX6Zqq6Zqn6Zqx6Zqy6Zqw6Zq06Zq26Zq46Zq56ZuO6ZuL6ZuJ6ZuN6KWN6Zuc6ZyN6ZuV6Zu56ZyE6ZyG6ZyI6ZyT6ZyO6ZyR6ZyP6ZyW6ZyZ6Zyk6Zyq6Zyw6Zy56Zy96Zy+6Z2E6Z2G6Z2I6Z2C6Z2J6Z2c6Z2g6Z2k6Z2m6Z2o5YuS6Z2r6Z2x6Z256Z6F6Z286Z6B6Z266Z6G6Z6L6Z6P6Z6Q6Z6c6Z6o6Z6m6Z6j6Z6z6Z606Z+D6Z+G6Z+I6Z+L6Z+c6Z+t6b2P6Z+y56uf6Z+26Z+16aCP6aCM6aC46aCk6aCh6aC36aC96aGG6aGP6aGL6aGr6aGv6aGwXCJdLFxuW1wiZTk0MFwiLFwi6aGx6aG06aGz6aKq6aKv6aKx6aK26aOE6aOD6aOG6aOp6aOr6aSD6aSJ6aSS6aSU6aSY6aSh6aSd6aSe6aSk6aSg6aSs6aSu6aS96aS+6aWC6aWJ6aWF6aWQ6aWL6aWR6aWS6aWM6aWV6aaX6aaY6aal6aat6aau6aa86aef6aeb6aed6aeY6aeR6aet6aeu6aex6aey6ae76ae46aiB6aiP6aiF6aei6aiZ6air6ai36amF6amC6amA6amDXCJdLFxuW1wiZTk4MFwiLFwi6ai+6amV6amN6amb6amX6amf6ami6aml6amk6amp6amr6amq6aqt6aqw6aq86auA6auP6auR6auT6auU6aue6auf6aui6auj6aum6auv6aur6auu6au06aux6au36au76ayG6ayY6aya6ayf6ayi6ayj6ayl6ayn6ayo6ayp6ayq6ayu6ayv6ayy6a2E6a2D6a2P6a2N6a2O6a2R6a2Y6a206a6T6a6D6a6R6a6W6a6X6a6f6a6g6a6o6a606a+A6a+K6a656a+G6a+P6a+R6a+S6a+j6a+i6a+k6a+U6a+h6bC66a+y6a+x6a+w6bCV6bCU6bCJ6bCT6bCM6bCG6bCI6bCS6bCK6bCE6bCu6bCb6bCl6bCk6bCh6bCw6bGH6bCy6bGG6bC+6bGa6bGg6bGn6bG26bG46bOn6bOs6bOw6bSJ6bSI6bOr6bSD6bSG6bSq6bSm6bav6bSj6bSf6bWE6bSV6bSS6bWB6bS/6bS+6bWG6bWIXCJdLFxuW1wiZWE0MFwiLFwi6bWd6bWe6bWk6bWR6bWQ6bWZ6bWy6baJ6baH6bar6bWv6bW66baa6bak6bap6bay6beE6beB6ba76ba46ba66beG6beP6beC6beZ6beT6be46bem6bet6bev6be96bia6bib6bie6bm16bm56bm96bqB6bqI6bqL6bqM6bqS6bqV6bqR6bqd6bql6bqp6bq46bqq6bqt6Z2h6buM6buO6buP6buQ6buU6buc6bue6bud6bug6bul6buo6buvXCJdLFxuW1wiZWE4MFwiLFwi6bu06bu26bu36bu56bu76bu86bu96byH6byI55q36byV6byh6bys6by+6b2K6b2S6b2U6b2j6b2f6b2g6b2h6b2m6b2n6b2s6b2q6b236b2y6b226b6V6b6c6b6g5aCv5qeH6YGZ55Gk5Yec54aZXCJdLFxuW1wiZWQ0MFwiLFwi57qK6KSc6Y2I6YqI6JOc5L+J54K75pix5qOI6Yu55pu75b2F5Lio5Luh5Lu85LyA5LyD5Ly55L2W5L6S5L6K5L6a5L6U5L+N5YGA5YCi5L+/5YCe5YGG5YGw5YGC5YKU5YO05YOY5YWK5YWk5Yad5Ya+5Yes5YiV5Yqc5Yqm5YuA5Yub5YyA5YyH5Yyk5Y2y5Y6T5Y6y5Y+d76iO5ZKc5ZKK5ZKp5ZO/5ZaG5Z2Z5Z2l5Z6s5Z+I5Z+H76iPXCJdLFxuW1wiZWQ4MFwiLFwi76iQ5aKe5aKy5aSL5aWT5aWb5aWd5aWj5aak5aa65a2W5a+A55Sv5a+Y5a+s5bCe5bKm5bK65bO15bSn5bWT76iR5bWC5bWt5ba45ba55beQ5byh5by05b2n5b635b+e5oGd5oKF5oKK5oOe5oOV5oSg5oOy5oSR5oS35oSw5oaY5oiT5oqm5o+15pGg5pKd5pOO5pWO5piA5piV5pi75piJ5piu5pie5pik5pml5pmX5pmZ76iS5pmz5pqZ5pqg5pqy5pq/5pu65pyO76Sp5p2m5p675qGS5p+A5qCB5qGE5qOP76iT5qWo76iU5qaY5qei5qiw5qmr5qmG5qmz5qm+5qui5quk5q+W5rC/5rGc5rKG5rGv5rOa5rSE5raH5rWv5raW5ras5reP5re45rey5re85ri55rmc5rin5ri85rq/5r6I5r615r+154CF54CH54Co54KF54Kr54SP54SE54Wc54WG54WH76iV54eB54e+54qxXCJdLFxuW1wiZWU0MFwiLFwi54q+54yk76iW5423546954+J54+W54+j54+S55CH54+155Cm55Cq55Cp55Cu55Gi55KJ55Kf55SB55Wv55qC55qc55qe55qb55qm76iX552G5Yqv56Ch56GO56Gk56G656Sw76iY76iZ76ia56aU76ib56ab56uR56un76ic56ur566e76id57WI57Wc57a357ag57eW57mS572H576h76ie6IyB6I2i6I2/6I+H6I+26JGI6JK06JWT6JWZXCJdLFxuW1wiZWU4MFwiLFwi6JWr76if6Jaw76ig76ih6KCH6KO16KiS6Ki36Km56Kqn6Kq+6Kuf76ii6Ku26K2T6K2/6LOw6LO06LSS6LW276ij6LuP76ik76il6YGn6YOe76im6YSV6YSn6Yea6YeX6Yee6Yet6Yeu6Yek6Yel6YiG6YiQ6YiK6Yi66YmA6Yi86YmO6YmZ6YmR6Yi56Ymn6Yqn6Ym36Ym46Yun6YuX6YuZ6YuQ76in6YuV6Yug6YuT6Yyl6Yyh6Yu776io6Yye6Yu/6Yyd6YyC6Y2w6Y2X6Y6k6Y+G6Y+e6Y+46ZCx6ZGF6ZGI6ZaS76ec76ip6Zqd6Zqv6Zyz6Zy76Z2D6Z2N6Z2P6Z2R6Z2V6aGX6aGl76iq76ir6aSn76is6aae6amO6auZ6auc6a216a2y6a6P6a6x6a676bCA6bWw6bWr76it6biZ6buRXCJdLFxuW1wiZWVlZlwiLFwi4oWwXCIsOSxcIu+/ou+/pO+8h++8glwiXSxcbltcImYwNDBcIixcIu6AgFwiLDYyXSxcbltcImYwODBcIixcIu6Av1wiLDEyNF0sXG5bXCJmMTQwXCIsXCLugrxcIiw2Ml0sXG5bXCJmMTgwXCIsXCLug7tcIiwxMjRdLFxuW1wiZjI0MFwiLFwi7oW4XCIsNjJdLFxuW1wiZjI4MFwiLFwi7oa3XCIsMTI0XSxcbltcImYzNDBcIixcIu6ItFwiLDYyXSxcbltcImYzODBcIixcIu6Js1wiLDEyNF0sXG5bXCJmNDQwXCIsXCLui7BcIiw2Ml0sXG5bXCJmNDgwXCIsXCLujK9cIiwxMjRdLFxuW1wiZjU0MFwiLFwi7o6sXCIsNjJdLFxuW1wiZjU4MFwiLFwi7o+rXCIsMTI0XSxcbltcImY2NDBcIixcIu6RqFwiLDYyXSxcbltcImY2ODBcIixcIu6Sp1wiLDEyNF0sXG5bXCJmNzQwXCIsXCLulKRcIiw2Ml0sXG5bXCJmNzgwXCIsXCLulaNcIiwxMjRdLFxuW1wiZjg0MFwiLFwi7pegXCIsNjJdLFxuW1wiZjg4MFwiLFwi7pifXCIsMTI0XSxcbltcImY5NDBcIixcIu6anFwiXSxcbltcImZhNDBcIixcIuKFsFwiLDksXCLihaBcIiw5LFwi77+i77+k77yH77yC44ix4oSW4oSh4oi157qK6KSc6Y2I6YqI6JOc5L+J54K75pix5qOI6Yu55pu75b2F5Lio5Luh5Lu85LyA5LyD5Ly55L2W5L6S5L6K5L6a5L6U5L+N5YGA5YCi5L+/5YCe5YGG5YGw5YGC5YKU5YO05YOY5YWKXCJdLFxuW1wiZmE4MFwiLFwi5YWk5Yad5Ya+5Yes5YiV5Yqc5Yqm5YuA5Yub5YyA5YyH5Yyk5Y2y5Y6T5Y6y5Y+d76iO5ZKc5ZKK5ZKp5ZO/5ZaG5Z2Z5Z2l5Z6s5Z+I5Z+H76iP76iQ5aKe5aKy5aSL5aWT5aWb5aWd5aWj5aak5aa65a2W5a+A55Sv5a+Y5a+s5bCe5bKm5bK65bO15bSn5bWT76iR5bWC5bWt5ba45ba55beQ5byh5by05b2n5b635b+e5oGd5oKF5oKK5oOe5oOV5oSg5oOy5oSR5oS35oSw5oaY5oiT5oqm5o+15pGg5pKd5pOO5pWO5piA5piV5pi75piJ5piu5pie5pik5pml5pmX5pmZ76iS5pmz5pqZ5pqg5pqy5pq/5pu65pyO76Sp5p2m5p675qGS5p+A5qCB5qGE5qOP76iT5qWo76iU5qaY5qei5qiw5qmr5qmG5qmz5qm+5qui5quk5q+W5rC/5rGc5rKG5rGv5rOa5rSE5raH5rWvXCJdLFxuW1wiZmI0MFwiLFwi5raW5ras5reP5re45rey5re85ri55rmc5rin5ri85rq/5r6I5r615r+154CF54CH54Co54KF54Kr54SP54SE54Wc54WG54WH76iV54eB54e+54qx54q+54yk76iW5423546954+J54+W54+j54+S55CH54+155Cm55Cq55Cp55Cu55Gi55KJ55Kf55SB55Wv55qC55qc55qe55qb55qm76iX552G5Yqv56Ch56GO56Gk56G656Sw76iY76iZXCJdLFxuW1wiZmI4MFwiLFwi76ia56aU76ib56ab56uR56un76ic56ur566e76id57WI57Wc57a357ag57eW57mS572H576h76ie6IyB6I2i6I2/6I+H6I+26JGI6JK06JWT6JWZ6JWr76if6Jaw76ig76ih6KCH6KO16KiS6Ki36Km56Kqn6Kq+6Kuf76ii6Ku26K2T6K2/6LOw6LO06LSS6LW276ij6LuP76ik76il6YGn6YOe76im6YSV6YSn6Yea6YeX6Yee6Yet6Yeu6Yek6Yel6YiG6YiQ6YiK6Yi66YmA6Yi86YmO6YmZ6YmR6Yi56Ymn6Yqn6Ym36Ym46Yun6YuX6YuZ6YuQ76in6YuV6Yug6YuT6Yyl6Yyh6Yu776io6Yye6Yu/6Yyd6YyC6Y2w6Y2X6Y6k6Y+G6Y+e6Y+46ZCx6ZGF6ZGI6ZaS76ec76ip6Zqd6Zqv6Zyz6Zy76Z2D6Z2N6Z2P6Z2R6Z2V6aGX6aGl76iq76ir6aSn76is6aae6amO6auZXCJdLFxuW1wiZmM0MFwiLFwi6auc6a216a2y6a6P6a6x6a676bCA6bWw6bWr76it6biZ6buRXCJdXG5dXG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyA9PSBVVEYxNi1CRSBjb2RlYy4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnRzLnV0ZjE2YmUgPSBVdGYxNkJFQ29kZWM7XG5mdW5jdGlvbiBVdGYxNkJFQ29kZWMoKSB7XG59XG5cblV0ZjE2QkVDb2RlYy5wcm90b3R5cGUuZW5jb2RlciA9IFV0ZjE2QkVFbmNvZGVyO1xuVXRmMTZCRUNvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gVXRmMTZCRURlY29kZXI7XG5VdGYxNkJFQ29kZWMucHJvdG90eXBlLmJvbUF3YXJlID0gdHJ1ZTtcblxuXG4vLyAtLSBFbmNvZGluZ1xuXG5mdW5jdGlvbiBVdGYxNkJFRW5jb2RlcigpIHtcbn1cblxuVXRmMTZCRUVuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc3RyLCAndWNzMicpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIHZhciB0bXAgPSBidWZbaV07IGJ1ZltpXSA9IGJ1ZltpKzFdOyBidWZbaSsxXSA9IHRtcDtcbiAgICB9XG4gICAgcmV0dXJuIGJ1Zjtcbn1cblxuVXRmMTZCRUVuY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xufVxuXG5cbi8vIC0tIERlY29kaW5nXG5cbmZ1bmN0aW9uIFV0ZjE2QkVEZWNvZGVyKCkge1xuICAgIHRoaXMub3ZlcmZsb3dCeXRlID0gLTE7XG59XG5cblV0ZjE2QkVEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1Zikge1xuICAgIGlmIChidWYubGVuZ3RoID09IDApXG4gICAgICAgIHJldHVybiAnJztcblxuICAgIHZhciBidWYyID0gbmV3IEJ1ZmZlcihidWYubGVuZ3RoICsgMSksXG4gICAgICAgIGkgPSAwLCBqID0gMDtcblxuICAgIGlmICh0aGlzLm92ZXJmbG93Qnl0ZSAhPT0gLTEpIHtcbiAgICAgICAgYnVmMlswXSA9IGJ1ZlswXTtcbiAgICAgICAgYnVmMlsxXSA9IHRoaXMub3ZlcmZsb3dCeXRlO1xuICAgICAgICBpID0gMTsgaiA9IDI7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBidWYubGVuZ3RoLTE7IGkgKz0gMiwgais9IDIpIHtcbiAgICAgICAgYnVmMltqXSA9IGJ1ZltpKzFdO1xuICAgICAgICBidWYyW2orMV0gPSBidWZbaV07XG4gICAgfVxuXG4gICAgdGhpcy5vdmVyZmxvd0J5dGUgPSAoaSA9PSBidWYubGVuZ3RoLTEpID8gYnVmW2J1Zi5sZW5ndGgtMV0gOiAtMTtcblxuICAgIHJldHVybiBidWYyLnNsaWNlKDAsIGopLnRvU3RyaW5nKCd1Y3MyJyk7XG59XG5cblV0ZjE2QkVEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cblxuXG4vLyA9PSBVVEYtMTYgY29kZWMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRGVjb2RlciBjaG9vc2VzIGF1dG9tYXRpY2FsbHkgZnJvbSBVVEYtMTZMRSBhbmQgVVRGLTE2QkUgdXNpbmcgQk9NIGFuZCBzcGFjZS1iYXNlZCBoZXVyaXN0aWMuXG4vLyBEZWZhdWx0cyB0byBVVEYtMTZMRSwgYXMgaXQncyBwcmV2YWxlbnQgYW5kIGRlZmF1bHQgaW4gTm9kZS5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTE2IGFuZCBodHRwOi8vZW5jb2Rpbmcuc3BlYy53aGF0d2cub3JnLyN1dGYtMTZsZVxuLy8gRGVjb2RlciBkZWZhdWx0IGNhbiBiZSBjaGFuZ2VkOiBpY29udi5kZWNvZGUoYnVmLCAndXRmMTYnLCB7ZGVmYXVsdEVuY29kaW5nOiAndXRmLTE2YmUnfSk7XG5cbi8vIEVuY29kZXIgdXNlcyBVVEYtMTZMRSBhbmQgcHJlcGVuZHMgQk9NICh3aGljaCBjYW4gYmUgb3ZlcnJpZGRlbiB3aXRoIGFkZEJPTTogZmFsc2UpLlxuXG5leHBvcnRzLnV0ZjE2ID0gVXRmMTZDb2RlYztcbmZ1bmN0aW9uIFV0ZjE2Q29kZWMoY29kZWNPcHRpb25zLCBpY29udikge1xuICAgIHRoaXMuaWNvbnYgPSBpY29udjtcbn1cblxuVXRmMTZDb2RlYy5wcm90b3R5cGUuZW5jb2RlciA9IFV0ZjE2RW5jb2RlcjtcblV0ZjE2Q29kZWMucHJvdG90eXBlLmRlY29kZXIgPSBVdGYxNkRlY29kZXI7XG5cblxuLy8gLS0gRW5jb2RpbmcgKHBhc3MtdGhyb3VnaClcblxuZnVuY3Rpb24gVXRmMTZFbmNvZGVyKG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKG9wdGlvbnMuYWRkQk9NID09PSB1bmRlZmluZWQpXG4gICAgICAgIG9wdGlvbnMuYWRkQk9NID0gdHJ1ZTtcbiAgICB0aGlzLmVuY29kZXIgPSBjb2RlYy5pY29udi5nZXRFbmNvZGVyKCd1dGYtMTZsZScsIG9wdGlvbnMpO1xufVxuXG5VdGYxNkVuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rlci53cml0ZShzdHIpO1xufVxuXG5VdGYxNkVuY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuY29kZXIuZW5kKCk7XG59XG5cblxuLy8gLS0gRGVjb2RpbmdcblxuZnVuY3Rpb24gVXRmMTZEZWNvZGVyKG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgdGhpcy5kZWNvZGVyID0gbnVsbDtcbiAgICB0aGlzLmluaXRpYWxCeXRlcyA9IFtdO1xuICAgIHRoaXMuaW5pdGlhbEJ5dGVzTGVuID0gMDtcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5pY29udiA9IGNvZGVjLmljb252O1xufVxuXG5VdGYxNkRlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmKSB7XG4gICAgaWYgKCF0aGlzLmRlY29kZXIpIHtcbiAgICAgICAgLy8gQ29kZWMgaXMgbm90IGNob3NlbiB5ZXQuIEFjY3VtdWxhdGUgaW5pdGlhbCBieXRlcy5cbiAgICAgICAgdGhpcy5pbml0aWFsQnl0ZXMucHVzaChidWYpO1xuICAgICAgICB0aGlzLmluaXRpYWxCeXRlc0xlbiArPSBidWYubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbEJ5dGVzTGVuIDwgMTYpIC8vIFdlIG5lZWQgbW9yZSBieXRlcyB0byB1c2Ugc3BhY2UgaGV1cmlzdGljIChzZWUgYmVsb3cpXG4gICAgICAgICAgICByZXR1cm4gJyc7XG5cbiAgICAgICAgLy8gV2UgaGF2ZSBlbm91Z2ggYnl0ZXMgLT4gZGV0ZWN0IGVuZGlhbm5lc3MuXG4gICAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KHRoaXMuaW5pdGlhbEJ5dGVzKSxcbiAgICAgICAgICAgIGVuY29kaW5nID0gZGV0ZWN0RW5jb2RpbmcoYnVmLCB0aGlzLm9wdGlvbnMuZGVmYXVsdEVuY29kaW5nKTtcbiAgICAgICAgdGhpcy5kZWNvZGVyID0gdGhpcy5pY29udi5nZXREZWNvZGVyKGVuY29kaW5nLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXRpYWxCeXRlcy5sZW5ndGggPSB0aGlzLmluaXRpYWxCeXRlc0xlbiA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGVjb2Rlci53cml0ZShidWYpO1xufVxuXG5VdGYxNkRlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5kZWNvZGVyKSB7XG4gICAgICAgIHZhciBidWYgPSBCdWZmZXIuY29uY2F0KHRoaXMuaW5pdGlhbEJ5dGVzKSxcbiAgICAgICAgICAgIGVuY29kaW5nID0gZGV0ZWN0RW5jb2RpbmcoYnVmLCB0aGlzLm9wdGlvbnMuZGVmYXVsdEVuY29kaW5nKTtcbiAgICAgICAgdGhpcy5kZWNvZGVyID0gdGhpcy5pY29udi5nZXREZWNvZGVyKGVuY29kaW5nLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmRlY29kZXIud3JpdGUoYnVmKSxcbiAgICAgICAgICAgIHRyYWlsID0gdGhpcy5kZWNvZGVyLmVuZCgpO1xuXG4gICAgICAgIHJldHVybiB0cmFpbCA/IChyZXMgKyB0cmFpbCkgOiByZXM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlY29kZXIuZW5kKCk7XG59XG5cbmZ1bmN0aW9uIGRldGVjdEVuY29kaW5nKGJ1ZiwgZGVmYXVsdEVuY29kaW5nKSB7XG4gICAgdmFyIGVuYyA9IGRlZmF1bHRFbmNvZGluZyB8fCAndXRmLTE2bGUnO1xuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPj0gMikge1xuICAgICAgICAvLyBDaGVjayBCT00uXG4gICAgICAgIGlmIChidWZbMF0gPT0gMHhGRSAmJiBidWZbMV0gPT0gMHhGRikgLy8gVVRGLTE2QkUgQk9NXG4gICAgICAgICAgICBlbmMgPSAndXRmLTE2YmUnO1xuICAgICAgICBlbHNlIGlmIChidWZbMF0gPT0gMHhGRiAmJiBidWZbMV0gPT0gMHhGRSkgLy8gVVRGLTE2TEUgQk9NXG4gICAgICAgICAgICBlbmMgPSAndXRmLTE2bGUnO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIEJPTSBmb3VuZC4gVHJ5IHRvIGRlZHVjZSBlbmNvZGluZyBmcm9tIGluaXRpYWwgY29udGVudC5cbiAgICAgICAgICAgIC8vIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZSBjb250ZW50IGhhcyBBU0NJSSBjaGFycyAoVSswMCoqKSwgYnV0IHRoZSBvcHBvc2l0ZSAoVSsqKjAwKSBpcyB1bmNvbW1vbi5cbiAgICAgICAgICAgIC8vIFNvLCB3ZSBjb3VudCBBU0NJSSBhcyBpZiBpdCB3YXMgTEUgb3IgQkUsIGFuZCBkZWNpZGUgZnJvbSB0aGF0LlxuICAgICAgICAgICAgdmFyIGFzY2lpQ2hhcnNMRSA9IDAsIGFzY2lpQ2hhcnNCRSA9IDAsIC8vIENvdW50cyBvZiBjaGFycyBpbiBib3RoIHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIF9sZW4gPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gKGJ1Zi5sZW5ndGggJSAyKSwgNjQpOyAvLyBMZW4gaXMgYWx3YXlzIGV2ZW4uXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2xlbjsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJ1ZltpXSA9PT0gMCAmJiBidWZbaSsxXSAhPT0gMCkgYXNjaWlDaGFyc0JFKys7XG4gICAgICAgICAgICAgICAgaWYgKGJ1ZltpXSAhPT0gMCAmJiBidWZbaSsxXSA9PT0gMCkgYXNjaWlDaGFyc0xFKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhc2NpaUNoYXJzQkUgPiBhc2NpaUNoYXJzTEUpXG4gICAgICAgICAgICAgICAgZW5jID0gJ3V0Zi0xNmJlJztcbiAgICAgICAgICAgIGVsc2UgaWYgKGFzY2lpQ2hhcnNCRSA8IGFzY2lpQ2hhcnNMRSlcbiAgICAgICAgICAgICAgICBlbmMgPSAndXRmLTE2bGUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVuYztcbn1cblxuXG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBVVEYtNyBjb2RlYywgYWNjb3JkaW5nIHRvIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMyMTUyXG4vLyBTZWUgYWxzbyBiZWxvdyBhIFVURi03LUlNQVAgY29kZWMsIGFjY29yZGluZyB0byBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNS4xLjNcblxuZXhwb3J0cy51dGY3ID0gVXRmN0NvZGVjO1xuZXhwb3J0cy51bmljb2RlMTF1dGY3ID0gJ3V0ZjcnOyAvLyBBbGlhcyBVTklDT0RFLTEtMS1VVEYtN1xuZnVuY3Rpb24gVXRmN0NvZGVjKGNvZGVjT3B0aW9ucywgaWNvbnYpIHtcbiAgICB0aGlzLmljb252ID0gaWNvbnY7XG59O1xuXG5VdGY3Q29kZWMucHJvdG90eXBlLmVuY29kZXIgPSBVdGY3RW5jb2RlcjtcblV0ZjdDb2RlYy5wcm90b3R5cGUuZGVjb2RlciA9IFV0ZjdEZWNvZGVyO1xuVXRmN0NvZGVjLnByb3RvdHlwZS5ib21Bd2FyZSA9IHRydWU7XG5cblxuLy8gLS0gRW5jb2RpbmdcblxudmFyIG5vbkRpcmVjdENoYXJzID0gL1teQS1aYS16MC05J1xcKFxcKSwtXFwuXFwvOlxcPyBcXG5cXHJcXHRdKy9nO1xuXG5mdW5jdGlvbiBVdGY3RW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuaWNvbnYgPSBjb2RlYy5pY29udjtcbn1cblxuVXRmN0VuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgLy8gTmFpdmUgaW1wbGVtZW50YXRpb24uXG4gICAgLy8gTm9uLWRpcmVjdCBjaGFycyBhcmUgZW5jb2RlZCBhcyBcIis8YmFzZTY0Pi1cIjsgc2luZ2xlIFwiK1wiIGNoYXIgaXMgZW5jb2RlZCBhcyBcIistXCIuXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3RyLnJlcGxhY2Uobm9uRGlyZWN0Q2hhcnMsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIHJldHVybiBcIitcIiArIChjaHVuayA9PT0gJysnID8gJycgOiBcbiAgICAgICAgICAgIHRoaXMuaWNvbnYuZW5jb2RlKGNodW5rLCAndXRmMTYtYmUnKS50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvPSskLywgJycpKSBcbiAgICAgICAgICAgICsgXCItXCI7XG4gICAgfS5iaW5kKHRoaXMpKSk7XG59XG5cblV0ZjdFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cblxuXG4vLyAtLSBEZWNvZGluZ1xuXG5mdW5jdGlvbiBVdGY3RGVjb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuaWNvbnYgPSBjb2RlYy5pY29udjtcbiAgICB0aGlzLmluQmFzZTY0ID0gZmFsc2U7XG4gICAgdGhpcy5iYXNlNjRBY2N1bSA9ICcnO1xufVxuXG52YXIgYmFzZTY0UmVnZXggPSAvW0EtWmEtejAtOVxcLytdLztcbnZhciBiYXNlNjRDaGFycyA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKylcbiAgICBiYXNlNjRDaGFyc1tpXSA9IGJhc2U2NFJlZ2V4LnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShpKSk7XG5cbnZhciBwbHVzQ2hhciA9ICcrJy5jaGFyQ29kZUF0KDApLCBcbiAgICBtaW51c0NoYXIgPSAnLScuY2hhckNvZGVBdCgwKSxcbiAgICBhbmRDaGFyID0gJyYnLmNoYXJDb2RlQXQoMCk7XG5cblV0ZjdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1Zikge1xuICAgIHZhciByZXMgPSBcIlwiLCBsYXN0SSA9IDAsXG4gICAgICAgIGluQmFzZTY0ID0gdGhpcy5pbkJhc2U2NCxcbiAgICAgICAgYmFzZTY0QWNjdW0gPSB0aGlzLmJhc2U2NEFjY3VtO1xuXG4gICAgLy8gVGhlIGRlY29kZXIgaXMgbW9yZSBpbnZvbHZlZCBhcyB3ZSBtdXN0IGhhbmRsZSBjaHVua3MgaW4gc3RyZWFtLlxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCFpbkJhc2U2NCkgeyAvLyBXZSdyZSBpbiBkaXJlY3QgbW9kZS5cbiAgICAgICAgICAgIC8vIFdyaXRlIGRpcmVjdCBjaGFycyB1bnRpbCAnKydcbiAgICAgICAgICAgIGlmIChidWZbaV0gPT0gcGx1c0NoYXIpIHtcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUoYnVmLnNsaWNlKGxhc3RJLCBpKSwgXCJhc2NpaVwiKTsgLy8gV3JpdGUgZGlyZWN0IGNoYXJzLlxuICAgICAgICAgICAgICAgIGxhc3RJID0gaSsxO1xuICAgICAgICAgICAgICAgIGluQmFzZTY0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gV2UgZGVjb2RlIGJhc2U2NC5cbiAgICAgICAgICAgIGlmICghYmFzZTY0Q2hhcnNbYnVmW2ldXSkgeyAvLyBCYXNlNjQgZW5kZWQuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gbGFzdEkgJiYgYnVmW2ldID09IG1pbnVzQ2hhcikgey8vIFwiKy1cIiAtPiBcIitcIlxuICAgICAgICAgICAgICAgICAgICByZXMgKz0gXCIrXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGI2NHN0ciA9IGJhc2U2NEFjY3VtICsgYnVmLnNsaWNlKGxhc3RJLCBpKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUobmV3IEJ1ZmZlcihiNjRzdHIsICdiYXNlNjQnKSwgXCJ1dGYxNi1iZVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYnVmW2ldICE9IG1pbnVzQ2hhcikgLy8gTWludXMgaXMgYWJzb3JiZWQgYWZ0ZXIgYmFzZTY0LlxuICAgICAgICAgICAgICAgICAgICBpLS07XG5cbiAgICAgICAgICAgICAgICBsYXN0SSA9IGkrMTtcbiAgICAgICAgICAgICAgICBpbkJhc2U2NCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJhc2U2NEFjY3VtID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWluQmFzZTY0KSB7XG4gICAgICAgIHJlcyArPSB0aGlzLmljb252LmRlY29kZShidWYuc2xpY2UobGFzdEkpLCBcImFzY2lpXCIpOyAvLyBXcml0ZSBkaXJlY3QgY2hhcnMuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGI2NHN0ciA9IGJhc2U2NEFjY3VtICsgYnVmLnNsaWNlKGxhc3RJKS50b1N0cmluZygpO1xuXG4gICAgICAgIHZhciBjYW5CZURlY29kZWQgPSBiNjRzdHIubGVuZ3RoIC0gKGI2NHN0ci5sZW5ndGggJSA4KTsgLy8gTWluaW1hbCBjaHVuazogMiBxdWFkcyAtPiAyeDMgYnl0ZXMgLT4gMyBjaGFycy5cbiAgICAgICAgYmFzZTY0QWNjdW0gPSBiNjRzdHIuc2xpY2UoY2FuQmVEZWNvZGVkKTsgLy8gVGhlIHJlc3Qgd2lsbCBiZSBkZWNvZGVkIGluIGZ1dHVyZS5cbiAgICAgICAgYjY0c3RyID0gYjY0c3RyLnNsaWNlKDAsIGNhbkJlRGVjb2RlZCk7XG5cbiAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIoYjY0c3RyLCAnYmFzZTY0JyksIFwidXRmMTYtYmVcIik7XG4gICAgfVxuXG4gICAgdGhpcy5pbkJhc2U2NCA9IGluQmFzZTY0O1xuICAgIHRoaXMuYmFzZTY0QWNjdW0gPSBiYXNlNjRBY2N1bTtcblxuICAgIHJldHVybiByZXM7XG59XG5cblV0ZjdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gXCJcIjtcbiAgICBpZiAodGhpcy5pbkJhc2U2NCAmJiB0aGlzLmJhc2U2NEFjY3VtLmxlbmd0aCA+IDApXG4gICAgICAgIHJlcyA9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIodGhpcy5iYXNlNjRBY2N1bSwgJ2Jhc2U2NCcpLCBcInV0ZjE2LWJlXCIpO1xuXG4gICAgdGhpcy5pbkJhc2U2NCA9IGZhbHNlO1xuICAgIHRoaXMuYmFzZTY0QWNjdW0gPSAnJztcbiAgICByZXR1cm4gcmVzO1xufVxuXG5cbi8vIFVURi03LUlNQVAgY29kZWMuXG4vLyBSRkMzNTAxIFNlYy4gNS4xLjMgTW9kaWZpZWQgVVRGLTcgKGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi01LjEuMylcbi8vIERpZmZlcmVuY2VzOlxuLy8gICogQmFzZTY0IHBhcnQgaXMgc3RhcnRlZCBieSBcIiZcIiBpbnN0ZWFkIG9mIFwiK1wiXG4vLyAgKiBEaXJlY3QgY2hhcmFjdGVycyBhcmUgMHgyMC0weDdFLCBleGNlcHQgXCImXCIgKDB4MjYpXG4vLyAgKiBJbiBCYXNlNjQsIFwiLFwiIGlzIHVzZWQgaW5zdGVhZCBvZiBcIi9cIlxuLy8gICogQmFzZTY0IG11c3Qgbm90IGJlIHVzZWQgdG8gcmVwcmVzZW50IGRpcmVjdCBjaGFyYWN0ZXJzLlxuLy8gICogTm8gaW1wbGljaXQgc2hpZnQgYmFjayBmcm9tIEJhc2U2NCAoc2hvdWxkIGFsd2F5cyBlbmQgd2l0aCAnLScpXG4vLyAgKiBTdHJpbmcgbXVzdCBlbmQgaW4gbm9uLXNoaWZ0ZWQgcG9zaXRpb24uXG4vLyAgKiBcIi0mXCIgd2hpbGUgaW4gYmFzZTY0IGlzIG5vdCBhbGxvd2VkLlxuXG5cbmV4cG9ydHMudXRmN2ltYXAgPSBVdGY3SU1BUENvZGVjO1xuZnVuY3Rpb24gVXRmN0lNQVBDb2RlYyhjb2RlY09wdGlvbnMsIGljb252KSB7XG4gICAgdGhpcy5pY29udiA9IGljb252O1xufTtcblxuVXRmN0lNQVBDb2RlYy5wcm90b3R5cGUuZW5jb2RlciA9IFV0ZjdJTUFQRW5jb2RlcjtcblV0ZjdJTUFQQ29kZWMucHJvdG90eXBlLmRlY29kZXIgPSBVdGY3SU1BUERlY29kZXI7XG5VdGY3SU1BUENvZGVjLnByb3RvdHlwZS5ib21Bd2FyZSA9IHRydWU7XG5cblxuLy8gLS0gRW5jb2RpbmdcblxuZnVuY3Rpb24gVXRmN0lNQVBFbmNvZGVyKG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgdGhpcy5pY29udiA9IGNvZGVjLmljb252O1xuICAgIHRoaXMuaW5CYXNlNjQgPSBmYWxzZTtcbiAgICB0aGlzLmJhc2U2NEFjY3VtID0gbmV3IEJ1ZmZlcig2KTtcbiAgICB0aGlzLmJhc2U2NEFjY3VtSWR4ID0gMDtcbn1cblxuVXRmN0lNQVBFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBpbkJhc2U2NCA9IHRoaXMuaW5CYXNlNjQsXG4gICAgICAgIGJhc2U2NEFjY3VtID0gdGhpcy5iYXNlNjRBY2N1bSxcbiAgICAgICAgYmFzZTY0QWNjdW1JZHggPSB0aGlzLmJhc2U2NEFjY3VtSWR4LFxuICAgICAgICBidWYgPSBuZXcgQnVmZmVyKHN0ci5sZW5ndGgqNSArIDEwKSwgYnVmSWR4ID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB1Q2hhciA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoMHgyMCA8PSB1Q2hhciAmJiB1Q2hhciA8PSAweDdFKSB7IC8vIERpcmVjdCBjaGFyYWN0ZXIgb3IgJyYnLlxuICAgICAgICAgICAgaWYgKGluQmFzZTY0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGJhc2U2NEFjY3VtSWR4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBidWZJZHggKz0gYnVmLndyaXRlKGJhc2U2NEFjY3VtLnNsaWNlKDAsIGJhc2U2NEFjY3VtSWR4KS50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvXFwvL2csICcsJykucmVwbGFjZSgvPSskLywgJycpLCBidWZJZHgpO1xuICAgICAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bUlkeCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IG1pbnVzQ2hhcjsgLy8gV3JpdGUgJy0nLCB0aGVuIGdvIHRvIGRpcmVjdCBtb2RlLlxuICAgICAgICAgICAgICAgIGluQmFzZTY0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaW5CYXNlNjQpIHtcbiAgICAgICAgICAgICAgICBidWZbYnVmSWR4KytdID0gdUNoYXI7IC8vIFdyaXRlIGRpcmVjdCBjaGFyYWN0ZXJcblxuICAgICAgICAgICAgICAgIGlmICh1Q2hhciA9PT0gYW5kQ2hhcikgIC8vIEFtcGVyc2FuZCAtPiAnJi0nXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltidWZJZHgrK10gPSBtaW51c0NoYXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHsgLy8gTm9uLWRpcmVjdCBjaGFyYWN0ZXJcbiAgICAgICAgICAgIGlmICghaW5CYXNlNjQpIHtcbiAgICAgICAgICAgICAgICBidWZbYnVmSWR4KytdID0gYW5kQ2hhcjsgLy8gV3JpdGUgJyYnLCB0aGVuIGdvIHRvIGJhc2U2NCBtb2RlLlxuICAgICAgICAgICAgICAgIGluQmFzZTY0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbkJhc2U2NCkge1xuICAgICAgICAgICAgICAgIGJhc2U2NEFjY3VtW2Jhc2U2NEFjY3VtSWR4KytdID0gdUNoYXIgPj4gODtcbiAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bVtiYXNlNjRBY2N1bUlkeCsrXSA9IHVDaGFyICYgMHhGRjtcblxuICAgICAgICAgICAgICAgIGlmIChiYXNlNjRBY2N1bUlkeCA9PSBiYXNlNjRBY2N1bS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmSWR4ICs9IGJ1Zi53cml0ZShiYXNlNjRBY2N1bS50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvXFwvL2csICcsJyksIGJ1ZklkeCk7XG4gICAgICAgICAgICAgICAgICAgIGJhc2U2NEFjY3VtSWR4ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmluQmFzZTY0ID0gaW5CYXNlNjQ7XG4gICAgdGhpcy5iYXNlNjRBY2N1bUlkeCA9IGJhc2U2NEFjY3VtSWR4O1xuXG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwLCBidWZJZHgpO1xufVxuXG5VdGY3SU1BUEVuY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWYgPSBuZXcgQnVmZmVyKDEwKSwgYnVmSWR4ID0gMDtcbiAgICBpZiAodGhpcy5pbkJhc2U2NCkge1xuICAgICAgICBpZiAodGhpcy5iYXNlNjRBY2N1bUlkeCA+IDApIHtcbiAgICAgICAgICAgIGJ1ZklkeCArPSBidWYud3JpdGUodGhpcy5iYXNlNjRBY2N1bS5zbGljZSgwLCB0aGlzLmJhc2U2NEFjY3VtSWR4KS50b1N0cmluZygnYmFzZTY0JykucmVwbGFjZSgvXFwvL2csICcsJykucmVwbGFjZSgvPSskLywgJycpLCBidWZJZHgpO1xuICAgICAgICAgICAgdGhpcy5iYXNlNjRBY2N1bUlkeCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBidWZbYnVmSWR4KytdID0gbWludXNDaGFyOyAvLyBXcml0ZSAnLScsIHRoZW4gZ28gdG8gZGlyZWN0IG1vZGUuXG4gICAgICAgIHRoaXMuaW5CYXNlNjQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmLnNsaWNlKDAsIGJ1ZklkeCk7XG59XG5cblxuLy8gLS0gRGVjb2RpbmdcblxuZnVuY3Rpb24gVXRmN0lNQVBEZWNvZGVyKG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgdGhpcy5pY29udiA9IGNvZGVjLmljb252O1xuICAgIHRoaXMuaW5CYXNlNjQgPSBmYWxzZTtcbiAgICB0aGlzLmJhc2U2NEFjY3VtID0gJyc7XG59XG5cbnZhciBiYXNlNjRJTUFQQ2hhcnMgPSBiYXNlNjRDaGFycy5zbGljZSgpO1xuYmFzZTY0SU1BUENoYXJzWycsJy5jaGFyQ29kZUF0KDApXSA9IHRydWU7XG5cblV0ZjdJTUFQRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICB2YXIgcmVzID0gXCJcIiwgbGFzdEkgPSAwLFxuICAgICAgICBpbkJhc2U2NCA9IHRoaXMuaW5CYXNlNjQsXG4gICAgICAgIGJhc2U2NEFjY3VtID0gdGhpcy5iYXNlNjRBY2N1bTtcblxuICAgIC8vIFRoZSBkZWNvZGVyIGlzIG1vcmUgaW52b2x2ZWQgYXMgd2UgbXVzdCBoYW5kbGUgY2h1bmtzIGluIHN0cmVhbS5cbiAgICAvLyBJdCBpcyBmb3JnaXZpbmcsIGNsb3NlciB0byBzdGFuZGFyZCBVVEYtNyAoZm9yIGV4YW1wbGUsICctJyBpcyBvcHRpb25hbCBhdCB0aGUgZW5kKS5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaW5CYXNlNjQpIHsgLy8gV2UncmUgaW4gZGlyZWN0IG1vZGUuXG4gICAgICAgICAgICAvLyBXcml0ZSBkaXJlY3QgY2hhcnMgdW50aWwgJyYnXG4gICAgICAgICAgICBpZiAoYnVmW2ldID09IGFuZENoYXIpIHtcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUoYnVmLnNsaWNlKGxhc3RJLCBpKSwgXCJhc2NpaVwiKTsgLy8gV3JpdGUgZGlyZWN0IGNoYXJzLlxuICAgICAgICAgICAgICAgIGxhc3RJID0gaSsxO1xuICAgICAgICAgICAgICAgIGluQmFzZTY0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gV2UgZGVjb2RlIGJhc2U2NC5cbiAgICAgICAgICAgIGlmICghYmFzZTY0SU1BUENoYXJzW2J1ZltpXV0pIHsgLy8gQmFzZTY0IGVuZGVkLlxuICAgICAgICAgICAgICAgIGlmIChpID09IGxhc3RJICYmIGJ1ZltpXSA9PSBtaW51c0NoYXIpIHsgLy8gXCImLVwiIC0+IFwiJlwiXG4gICAgICAgICAgICAgICAgICAgIHJlcyArPSBcIiZcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYjY0c3RyID0gYmFzZTY0QWNjdW0gKyBidWYuc2xpY2UobGFzdEksIGkpLnRvU3RyaW5nKCkucmVwbGFjZSgvLC9nLCAnLycpO1xuICAgICAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUobmV3IEJ1ZmZlcihiNjRzdHIsICdiYXNlNjQnKSwgXCJ1dGYxNi1iZVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYnVmW2ldICE9IG1pbnVzQ2hhcikgLy8gTWludXMgbWF5IGJlIGFic29yYmVkIGFmdGVyIGJhc2U2NC5cbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuXG4gICAgICAgICAgICAgICAgbGFzdEkgPSBpKzE7XG4gICAgICAgICAgICAgICAgaW5CYXNlNjQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpbkJhc2U2NCkge1xuICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUoYnVmLnNsaWNlKGxhc3RJKSwgXCJhc2NpaVwiKTsgLy8gV3JpdGUgZGlyZWN0IGNoYXJzLlxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBiNjRzdHIgPSBiYXNlNjRBY2N1bSArIGJ1Zi5zbGljZShsYXN0SSkudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcvJyk7XG5cbiAgICAgICAgdmFyIGNhbkJlRGVjb2RlZCA9IGI2NHN0ci5sZW5ndGggLSAoYjY0c3RyLmxlbmd0aCAlIDgpOyAvLyBNaW5pbWFsIGNodW5rOiAyIHF1YWRzIC0+IDJ4MyBieXRlcyAtPiAzIGNoYXJzLlxuICAgICAgICBiYXNlNjRBY2N1bSA9IGI2NHN0ci5zbGljZShjYW5CZURlY29kZWQpOyAvLyBUaGUgcmVzdCB3aWxsIGJlIGRlY29kZWQgaW4gZnV0dXJlLlxuICAgICAgICBiNjRzdHIgPSBiNjRzdHIuc2xpY2UoMCwgY2FuQmVEZWNvZGVkKTtcblxuICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUobmV3IEJ1ZmZlcihiNjRzdHIsICdiYXNlNjQnKSwgXCJ1dGYxNi1iZVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmluQmFzZTY0ID0gaW5CYXNlNjQ7XG4gICAgdGhpcy5iYXNlNjRBY2N1bSA9IGJhc2U2NEFjY3VtO1xuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuVXRmN0lNQVBEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gXCJcIjtcbiAgICBpZiAodGhpcy5pbkJhc2U2NCAmJiB0aGlzLmJhc2U2NEFjY3VtLmxlbmd0aCA+IDApXG4gICAgICAgIHJlcyA9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIodGhpcy5iYXNlNjRBY2N1bSwgJ2Jhc2U2NCcpLCBcInV0ZjE2LWJlXCIpO1xuXG4gICAgdGhpcy5pbkJhc2U2NCA9IGZhbHNlO1xuICAgIHRoaXMuYmFzZTY0QWNjdW0gPSAnJztcbiAgICByZXR1cm4gcmVzO1xufVxuXG5cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBCT01DaGFyID0gJ1xcdUZFRkYnO1xuXG5leHBvcnRzLlByZXBlbmRCT00gPSBQcmVwZW5kQk9NV3JhcHBlclxuZnVuY3Rpb24gUHJlcGVuZEJPTVdyYXBwZXIoZW5jb2Rlciwgb3B0aW9ucykge1xuICAgIHRoaXMuZW5jb2RlciA9IGVuY29kZXI7XG4gICAgdGhpcy5hZGRCT00gPSB0cnVlO1xufVxuXG5QcmVwZW5kQk9NV3JhcHBlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAodGhpcy5hZGRCT00pIHtcbiAgICAgICAgc3RyID0gQk9NQ2hhciArIHN0cjtcbiAgICAgICAgdGhpcy5hZGRCT00gPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbmNvZGVyLndyaXRlKHN0cik7XG59XG5cblByZXBlbmRCT01XcmFwcGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGVyLmVuZCgpO1xufVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuU3RyaXBCT00gPSBTdHJpcEJPTVdyYXBwZXI7XG5mdW5jdGlvbiBTdHJpcEJPTVdyYXBwZXIoZGVjb2Rlciwgb3B0aW9ucykge1xuICAgIHRoaXMuZGVjb2RlciA9IGRlY29kZXI7XG4gICAgdGhpcy5wYXNzID0gZmFsc2U7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbn1cblxuU3RyaXBCT01XcmFwcGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1Zikge1xuICAgIHZhciByZXMgPSB0aGlzLmRlY29kZXIud3JpdGUoYnVmKTtcbiAgICBpZiAodGhpcy5wYXNzIHx8ICFyZXMpXG4gICAgICAgIHJldHVybiByZXM7XG5cbiAgICBpZiAocmVzWzBdID09PSBCT01DaGFyKSB7XG4gICAgICAgIHJlcyA9IHJlcy5zbGljZSgxKTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuc3RyaXBCT00gPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RyaXBCT00oKTtcbiAgICB9XG5cbiAgICB0aGlzLnBhc3MgPSB0cnVlO1xuICAgIHJldHVybiByZXM7XG59XG5cblN0cmlwQk9NV3JhcHBlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVjb2Rlci5lbmQoKTtcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gPT0gRXh0ZW5kIE5vZGUgcHJpbWl0aXZlcyB0byB1c2UgaWNvbnYtbGl0ZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaWNvbnYpIHtcbiAgICB2YXIgb3JpZ2luYWwgPSB1bmRlZmluZWQ7IC8vIFBsYWNlIHRvIGtlZXAgb3JpZ2luYWwgbWV0aG9kcy5cblxuICAgIC8vIE5vZGUgYXV0aG9ycyByZXdyb3RlIEJ1ZmZlciBpbnRlcm5hbHMgdG8gbWFrZSBpdCBjb21wYXRpYmxlIHdpdGhcbiAgICAvLyBVaW50OEFycmF5IGFuZCB3ZSBjYW5ub3QgcGF0Y2gga2V5IGZ1bmN0aW9ucyBzaW5jZSB0aGVuLlxuICAgIGljb252LnN1cHBvcnRzTm9kZUVuY29kaW5nc0V4dGVuc2lvbiA9ICEobmV3IEJ1ZmZlcigwKSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpO1xuXG4gICAgaWNvbnYuZXh0ZW5kTm9kZUVuY29kaW5ncyA9IGZ1bmN0aW9uIGV4dGVuZE5vZGVFbmNvZGluZ3MoKSB7XG4gICAgICAgIGlmIChvcmlnaW5hbCkgcmV0dXJuO1xuICAgICAgICBvcmlnaW5hbCA9IHt9O1xuXG4gICAgICAgIGlmICghaWNvbnYuc3VwcG9ydHNOb2RlRW5jb2RpbmdzRXh0ZW5zaW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQUNUSU9OIE5FRURFRDogcmVxdWlyZSgnaWNvbnYtbGl0ZScpLmV4dGVuZE5vZGVFbmNvZGluZ3MoKSBpcyBub3Qgc3VwcG9ydGVkIGluIHlvdXIgdmVyc2lvbiBvZiBOb2RlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNlZSBtb3JlIGluZm8gYXQgaHR0cHM6Ly9naXRodWIuY29tL2FzaHR1Y2hraW4vaWNvbnYtbGl0ZS93aWtpL05vZGUtdjQtY29tcGF0aWJpbGl0eVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2RlTmF0aXZlRW5jb2RpbmdzID0ge1xuICAgICAgICAgICAgJ2hleCc6IHRydWUsICd1dGY4JzogdHJ1ZSwgJ3V0Zi04JzogdHJ1ZSwgJ2FzY2lpJzogdHJ1ZSwgJ2JpbmFyeSc6IHRydWUsIFxuICAgICAgICAgICAgJ2Jhc2U2NCc6IHRydWUsICd1Y3MyJzogdHJ1ZSwgJ3Vjcy0yJzogdHJ1ZSwgJ3V0ZjE2bGUnOiB0cnVlLCAndXRmLTE2bGUnOiB0cnVlLFxuICAgICAgICB9O1xuXG4gICAgICAgIEJ1ZmZlci5pc05hdGl2ZUVuY29kaW5nID0gZnVuY3Rpb24oZW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5jICYmIG5vZGVOYXRpdmVFbmNvZGluZ3NbZW5jLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0gU2xvd0J1ZmZlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB2YXIgU2xvd0J1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLlNsb3dCdWZmZXI7XG5cbiAgICAgICAgb3JpZ2luYWwuU2xvd0J1ZmZlclRvU3RyaW5nID0gU2xvd0J1ZmZlci5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgICAgIFNsb3dCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgLy8gVXNlIG5hdGl2ZSBjb252ZXJzaW9uIHdoZW4gcG9zc2libGVcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyhlbmNvZGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLlNsb3dCdWZmZXJUb1N0cmluZy5jYWxsKHRoaXMsIGVuY29kaW5nLCBzdGFydCwgZW5kKTtcblxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB1c2Ugb3VyIGRlY29kaW5nIG1ldGhvZC5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RhcnQgPT0gJ3VuZGVmaW5lZCcpIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW5kID09ICd1bmRlZmluZWQnKSBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBpY29udi5kZWNvZGUodGhpcy5zbGljZShzdGFydCwgZW5kKSwgZW5jb2RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3JpZ2luYWwuU2xvd0J1ZmZlcldyaXRlID0gU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGU7XG4gICAgICAgIFNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gICAgICAgICAgICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICAgICAgICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICBlbmNvZGluZyA9IGxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICAgICAgICAgICAgICB2YXIgc3dhcCA9IGVuY29kaW5nO1xuICAgICAgICAgICAgICAgIGVuY29kaW5nID0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IGxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSBzd2FwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXQ7XG4gICAgICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIC8vIFVzZSBuYXRpdmUgY29udmVyc2lvbiB3aGVuIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAoQnVmZmVyLmlzTmF0aXZlRW5jb2RpbmcoZW5jb2RpbmcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbC5TbG93QnVmZmVyV3JpdGUuY2FsbCh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZyk7XG5cbiAgICAgICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignYXR0ZW1wdCB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGJvdW5kcycpO1xuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHVzZSBvdXIgZW5jb2RpbmcgbWV0aG9kLlxuICAgICAgICAgICAgdmFyIGJ1ZiA9IGljb252LmVuY29kZShzdHJpbmcsIGVuY29kaW5nKTtcbiAgICAgICAgICAgIGlmIChidWYubGVuZ3RoIDwgbGVuZ3RoKSBsZW5ndGggPSBidWYubGVuZ3RoO1xuICAgICAgICAgICAgYnVmLmNvcHkodGhpcywgb2Zmc2V0LCAwLCBsZW5ndGgpO1xuICAgICAgICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tIEJ1ZmZlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBvcmlnaW5hbC5CdWZmZXJJc0VuY29kaW5nID0gQnVmZmVyLmlzRW5jb2Rpbmc7XG4gICAgICAgIEJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyhlbmNvZGluZykgfHwgaWNvbnYuZW5jb2RpbmdFeGlzdHMoZW5jb2RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3JpZ2luYWwuQnVmZmVyQnl0ZUxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoO1xuICAgICAgICBCdWZmZXIuYnl0ZUxlbmd0aCA9IFNsb3dCdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uKHN0ciwgZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgLy8gVXNlIG5hdGl2ZSBjb252ZXJzaW9uIHdoZW4gcG9zc2libGVcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyhlbmNvZGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLkJ1ZmZlckJ5dGVMZW5ndGguY2FsbCh0aGlzLCBzdHIsIGVuY29kaW5nKTtcblxuICAgICAgICAgICAgLy8gU2xvdywgSSBrbm93LCBidXQgd2UgZG9uJ3QgaGF2ZSBhIGJldHRlciB3YXkgeWV0LlxuICAgICAgICAgICAgcmV0dXJuIGljb252LmVuY29kZShzdHIsIGVuY29kaW5nKS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBvcmlnaW5hbC5CdWZmZXJUb1N0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgICAgIEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbihlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAvLyBVc2UgbmF0aXZlIGNvbnZlcnNpb24gd2hlbiBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKEJ1ZmZlci5pc05hdGl2ZUVuY29kaW5nKGVuY29kaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuQnVmZmVyVG9TdHJpbmcuY2FsbCh0aGlzLCBlbmNvZGluZywgc3RhcnQsIGVuZCk7XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdXNlIG91ciBkZWNvZGluZyBtZXRob2QuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXJ0ID09ICd1bmRlZmluZWQnKSBzdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykgZW5kID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gaWNvbnYuZGVjb2RlKHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCksIGVuY29kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9yaWdpbmFsLkJ1ZmZlcldyaXRlID0gQnVmZmVyLnByb3RvdHlwZS53cml0ZTtcbiAgICAgICAgQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gICAgICAgICAgICB2YXIgX29mZnNldCA9IG9mZnNldCwgX2xlbmd0aCA9IGxlbmd0aCwgX2VuY29kaW5nID0gZW5jb2Rpbmc7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAgICAgICAgICAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgICAgICAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmcgPSBsZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgICAgICAgICAgICAgdmFyIHN3YXAgPSBlbmNvZGluZztcbiAgICAgICAgICAgICAgICBlbmNvZGluZyA9IG9mZnNldDtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBsZW5ndGg7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gc3dhcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAvLyBVc2UgbmF0aXZlIGNvbnZlcnNpb24gd2hlbiBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKEJ1ZmZlci5pc05hdGl2ZUVuY29kaW5nKGVuY29kaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuQnVmZmVyV3JpdGUuY2FsbCh0aGlzLCBzdHJpbmcsIF9vZmZzZXQsIF9sZW5ndGgsIF9lbmNvZGluZyk7XG5cbiAgICAgICAgICAgIG9mZnNldCA9ICtvZmZzZXQgfHwgMDtcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSArbGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoID0gcmVtYWluaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdhdHRlbXB0IHRvIHdyaXRlIGJleW9uZCBidWZmZXIgYm91bmRzJyk7XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdXNlIG91ciBlbmNvZGluZyBtZXRob2QuXG4gICAgICAgICAgICB2YXIgYnVmID0gaWNvbnYuZW5jb2RlKHN0cmluZywgZW5jb2RpbmcpO1xuICAgICAgICAgICAgaWYgKGJ1Zi5sZW5ndGggPCBsZW5ndGgpIGxlbmd0aCA9IGJ1Zi5sZW5ndGg7XG4gICAgICAgICAgICBidWYuY29weSh0aGlzLCBvZmZzZXQsIDAsIGxlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm4gbGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBTZXQgX2NoYXJzV3JpdHRlbi5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0gUmVhZGFibGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBpZiAoaWNvbnYuc3VwcG9ydHNTdHJlYW1zKSB7XG4gICAgICAgICAgICB2YXIgUmVhZGFibGUgPSByZXF1aXJlKCdzdHJlYW0nKS5SZWFkYWJsZTtcblxuICAgICAgICAgICAgb3JpZ2luYWwuUmVhZGFibGVTZXRFbmNvZGluZyA9IFJlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZztcbiAgICAgICAgICAgIFJlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZyA9IGZ1bmN0aW9uIHNldEVuY29kaW5nKGVuYywgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIFVzZSBvdXIgb3duIGRlY29kZXIsIGl0IGhhcyB0aGUgc2FtZSBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgLy8gV2UgY2Fubm90IHVzZSBvcmlnaW5hbCBmdW5jdGlvbiBhcyBpdCBkb2Vzbid0IGhhbmRsZSBCT00tcy5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlY29kZXIgPSBpY29udi5nZXREZWNvZGVyKGVuYywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZyA9IGVuYztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUmVhZGFibGUucHJvdG90eXBlLmNvbGxlY3QgPSBpY29udi5fY29sbGVjdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBpY29udi1saXRlIE5vZGUgcHJpbWl0aXZlIGV4dGVuc2lvbnMuXG4gICAgaWNvbnYudW5kb0V4dGVuZE5vZGVFbmNvZGluZ3MgPSBmdW5jdGlvbiB1bmRvRXh0ZW5kTm9kZUVuY29kaW5ncygpIHtcbiAgICAgICAgaWYgKCFpY29udi5zdXBwb3J0c05vZGVFbmNvZGluZ3NFeHRlbnNpb24pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICghb3JpZ2luYWwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyZXF1aXJlKCdpY29udi1saXRlJykudW5kb0V4dGVuZE5vZGVFbmNvZGluZ3MoKTogTm90aGluZyB0byB1bmRvOyBleHRlbmROb2RlRW5jb2RpbmdzKCkgaXMgbm90IGNhbGxlZC5cIilcblxuICAgICAgICBkZWxldGUgQnVmZmVyLmlzTmF0aXZlRW5jb2Rpbmc7XG5cbiAgICAgICAgdmFyIFNsb3dCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5TbG93QnVmZmVyO1xuXG4gICAgICAgIFNsb3dCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gb3JpZ2luYWwuU2xvd0J1ZmZlclRvU3RyaW5nO1xuICAgICAgICBTbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IG9yaWdpbmFsLlNsb3dCdWZmZXJXcml0ZTtcblxuICAgICAgICBCdWZmZXIuaXNFbmNvZGluZyA9IG9yaWdpbmFsLkJ1ZmZlcklzRW5jb2Rpbmc7XG4gICAgICAgIEJ1ZmZlci5ieXRlTGVuZ3RoID0gb3JpZ2luYWwuQnVmZmVyQnl0ZUxlbmd0aDtcbiAgICAgICAgQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IG9yaWdpbmFsLkJ1ZmZlclRvU3RyaW5nO1xuICAgICAgICBCdWZmZXIucHJvdG90eXBlLndyaXRlID0gb3JpZ2luYWwuQnVmZmVyV3JpdGU7XG5cbiAgICAgICAgaWYgKGljb252LnN1cHBvcnRzU3RyZWFtcykge1xuICAgICAgICAgICAgdmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuUmVhZGFibGU7XG5cbiAgICAgICAgICAgIFJlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZyA9IG9yaWdpbmFsLlJlYWRhYmxlU2V0RW5jb2Rpbmc7XG4gICAgICAgICAgICBkZWxldGUgUmVhZGFibGUucHJvdG90eXBlLmNvbGxlY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBvcmlnaW5hbCA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgYm9tSGFuZGxpbmcgPSByZXF1aXJlKCcuL2JvbS1oYW5kbGluZycpLFxuICAgIGljb252ID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8vIEFsbCBjb2RlY3MgYW5kIGFsaWFzZXMgYXJlIGtlcHQgaGVyZSwga2V5ZWQgYnkgZW5jb2RpbmcgbmFtZS9hbGlhcy5cbi8vIFRoZXkgYXJlIGxhenkgbG9hZGVkIGluIGBpY29udi5nZXRDb2RlY2AgZnJvbSBgZW5jb2RpbmdzL2luZGV4LmpzYC5cbmljb252LmVuY29kaW5ncyA9IG51bGw7XG5cbi8vIENoYXJhY3RlcnMgZW1pdHRlZCBpbiBjYXNlIG9mIGVycm9yLlxuaWNvbnYuZGVmYXVsdENoYXJVbmljb2RlID0gJ++/vSc7XG5pY29udi5kZWZhdWx0Q2hhclNpbmdsZUJ5dGUgPSAnPyc7XG5cbi8vIFB1YmxpYyBBUEkuXG5pY29udi5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoc3RyLCBlbmNvZGluZywgb3B0aW9ucykge1xuICAgIHN0ciA9IFwiXCIgKyAoc3RyIHx8IFwiXCIpOyAvLyBFbnN1cmUgc3RyaW5nLlxuXG4gICAgdmFyIGVuY29kZXIgPSBpY29udi5nZXRFbmNvZGVyKGVuY29kaW5nLCBvcHRpb25zKTtcblxuICAgIHZhciByZXMgPSBlbmNvZGVyLndyaXRlKHN0cik7XG4gICAgdmFyIHRyYWlsID0gZW5jb2Rlci5lbmQoKTtcbiAgICBcbiAgICByZXR1cm4gKHRyYWlsICYmIHRyYWlsLmxlbmd0aCA+IDApID8gQnVmZmVyLmNvbmNhdChbcmVzLCB0cmFpbF0pIDogcmVzO1xufVxuXG5pY29udi5kZWNvZGUgPSBmdW5jdGlvbiBkZWNvZGUoYnVmLCBlbmNvZGluZywgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoIWljb252LnNraXBEZWNvZGVXYXJuaW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJY29udi1saXRlIHdhcm5pbmc6IGRlY29kZSgpLWluZyBzdHJpbmdzIGlzIGRlcHJlY2F0ZWQuIFJlZmVyIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2h0dWNoa2luL2ljb252LWxpdGUvd2lraS9Vc2UtQnVmZmVycy13aGVuLWRlY29kaW5nJyk7XG4gICAgICAgICAgICBpY29udi5za2lwRGVjb2RlV2FybmluZyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBidWYgPSBuZXcgQnVmZmVyKFwiXCIgKyAoYnVmIHx8IFwiXCIpLCBcImJpbmFyeVwiKTsgLy8gRW5zdXJlIGJ1ZmZlci5cbiAgICB9XG5cbiAgICB2YXIgZGVjb2RlciA9IGljb252LmdldERlY29kZXIoZW5jb2RpbmcsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHJlcyA9IGRlY29kZXIud3JpdGUoYnVmKTtcbiAgICB2YXIgdHJhaWwgPSBkZWNvZGVyLmVuZCgpO1xuXG4gICAgcmV0dXJuIHRyYWlsID8gKHJlcyArIHRyYWlsKSA6IHJlcztcbn1cblxuaWNvbnYuZW5jb2RpbmdFeGlzdHMgPSBmdW5jdGlvbiBlbmNvZGluZ0V4aXN0cyhlbmMpIHtcbiAgICB0cnkge1xuICAgICAgICBpY29udi5nZXRDb2RlYyhlbmMpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8vIExlZ2FjeSBhbGlhc2VzIHRvIGNvbnZlcnQgZnVuY3Rpb25zXG5pY29udi50b0VuY29kaW5nID0gaWNvbnYuZW5jb2RlO1xuaWNvbnYuZnJvbUVuY29kaW5nID0gaWNvbnYuZGVjb2RlO1xuXG4vLyBTZWFyY2ggZm9yIGEgY29kZWMgaW4gaWNvbnYuZW5jb2RpbmdzLiBDYWNoZSBjb2RlYyBkYXRhIGluIGljb252Ll9jb2RlY0RhdGFDYWNoZS5cbmljb252Ll9jb2RlY0RhdGFDYWNoZSA9IHt9O1xuaWNvbnYuZ2V0Q29kZWMgPSBmdW5jdGlvbiBnZXRDb2RlYyhlbmNvZGluZykge1xuICAgIGlmICghaWNvbnYuZW5jb2RpbmdzKVxuICAgICAgICBpY29udi5lbmNvZGluZ3MgPSByZXF1aXJlKFwiLi4vZW5jb2RpbmdzXCIpOyAvLyBMYXp5IGxvYWQgYWxsIGVuY29kaW5nIGRlZmluaXRpb25zLlxuICAgIFxuICAgIC8vIENhbm9uaWNhbGl6ZSBlbmNvZGluZyBuYW1lOiBzdHJpcCBhbGwgbm9uLWFscGhhbnVtZXJpYyBjaGFycyBhbmQgYXBwZW5kZWQgeWVhci5cbiAgICB2YXIgZW5jID0gKCcnK2VuY29kaW5nKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1teMC05YS16XXw6XFxkezR9JC9nLCBcIlwiKTtcblxuICAgIC8vIFRyYXZlcnNlIGljb252LmVuY29kaW5ncyB0byBmaW5kIGFjdHVhbCBjb2RlYy5cbiAgICB2YXIgY29kZWNPcHRpb25zID0ge307XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGNvZGVjID0gaWNvbnYuX2NvZGVjRGF0YUNhY2hlW2VuY107XG4gICAgICAgIGlmIChjb2RlYylcbiAgICAgICAgICAgIHJldHVybiBjb2RlYztcblxuICAgICAgICB2YXIgY29kZWNEZWYgPSBpY29udi5lbmNvZGluZ3NbZW5jXTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiBjb2RlY0RlZikge1xuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiAvLyBEaXJlY3QgYWxpYXMgdG8gb3RoZXIgZW5jb2RpbmcuXG4gICAgICAgICAgICAgICAgZW5jID0gY29kZWNEZWY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjogLy8gQWxpYXMgd2l0aCBvcHRpb25zLiBDYW4gYmUgbGF5ZXJlZC5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29kZWNEZWYpXG4gICAgICAgICAgICAgICAgICAgIGNvZGVjT3B0aW9uc1trZXldID0gY29kZWNEZWZba2V5XTtcblxuICAgICAgICAgICAgICAgIGlmICghY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZSA9IGVuYztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbmMgPSBjb2RlY0RlZi50eXBlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIjogLy8gQ29kZWMgaXRzZWxmLlxuICAgICAgICAgICAgICAgIGlmICghY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZSA9IGVuYztcblxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb2RlYyBmdW5jdGlvbiBtdXN0IGxvYWQgYWxsIHRhYmxlcyBhbmQgcmV0dXJuIG9iamVjdCB3aXRoIC5lbmNvZGVyIGFuZCAuZGVjb2RlciBtZXRob2RzLlxuICAgICAgICAgICAgICAgIC8vIEl0J2xsIGJlIGNhbGxlZCBvbmx5IG9uY2UgKGZvciBlYWNoIGRpZmZlcmVudCBvcHRpb25zIG9iamVjdCkuXG4gICAgICAgICAgICAgICAgY29kZWMgPSBuZXcgY29kZWNEZWYoY29kZWNPcHRpb25zLCBpY29udik7XG5cbiAgICAgICAgICAgICAgICBpY29udi5fY29kZWNEYXRhQ2FjaGVbY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZV0gPSBjb2RlYzsgLy8gU2F2ZSBpdCB0byBiZSByZXVzZWQgbGF0ZXIuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvZGVjO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuY29kaW5nIG5vdCByZWNvZ25pemVkOiAnXCIgKyBlbmNvZGluZyArIFwiJyAoc2VhcmNoZWQgYXM6ICdcIitlbmMrXCInKVwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWNvbnYuZ2V0RW5jb2RlciA9IGZ1bmN0aW9uIGdldEVuY29kZXIoZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29kZWMgPSBpY29udi5nZXRDb2RlYyhlbmNvZGluZyksXG4gICAgICAgIGVuY29kZXIgPSBuZXcgY29kZWMuZW5jb2RlcihvcHRpb25zLCBjb2RlYyk7XG5cbiAgICBpZiAoY29kZWMuYm9tQXdhcmUgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmFkZEJPTSlcbiAgICAgICAgZW5jb2RlciA9IG5ldyBib21IYW5kbGluZy5QcmVwZW5kQk9NKGVuY29kZXIsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGVuY29kZXI7XG59XG5cbmljb252LmdldERlY29kZXIgPSBmdW5jdGlvbiBnZXREZWNvZGVyKGVuY29kaW5nLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvZGVjID0gaWNvbnYuZ2V0Q29kZWMoZW5jb2RpbmcpLFxuICAgICAgICBkZWNvZGVyID0gbmV3IGNvZGVjLmRlY29kZXIob3B0aW9ucywgY29kZWMpO1xuXG4gICAgaWYgKGNvZGVjLmJvbUF3YXJlICYmICEob3B0aW9ucyAmJiBvcHRpb25zLnN0cmlwQk9NID09PSBmYWxzZSkpXG4gICAgICAgIGRlY29kZXIgPSBuZXcgYm9tSGFuZGxpbmcuU3RyaXBCT00oZGVjb2Rlciwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gZGVjb2Rlcjtcbn1cblxuXG4vLyBMb2FkIGV4dGVuc2lvbnMgaW4gTm9kZS4gQWxsIG9mIHRoZW0gYXJlIG9taXR0ZWQgaW4gQnJvd3NlcmlmeSBidWlsZCB2aWEgJ2Jyb3dzZXInIGZpZWxkIGluIHBhY2thZ2UuanNvbi5cbnZhciBub2RlVmVyID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlO1xuaWYgKG5vZGVWZXIpIHtcblxuICAgIC8vIExvYWQgc3RyZWFtaW5nIHN1cHBvcnQgaW4gTm9kZSB2MC4xMCtcbiAgICB2YXIgbm9kZVZlckFyciA9IG5vZGVWZXIuc3BsaXQoXCIuXCIpLm1hcChOdW1iZXIpO1xuICAgIGlmIChub2RlVmVyQXJyWzBdID4gMCB8fCBub2RlVmVyQXJyWzFdID49IDEwKSB7XG4gICAgICAgIHJlcXVpcmUoXCIuL3N0cmVhbXNcIikoaWNvbnYpO1xuICAgIH1cblxuICAgIC8vIExvYWQgTm9kZSBwcmltaXRpdmUgZXh0ZW5zaW9ucy5cbiAgICByZXF1aXJlKFwiLi9leHRlbmQtbm9kZVwiKShpY29udik7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKFwic3RyZWFtXCIpLlRyYW5zZm9ybTtcblxuXG4vLyA9PSBFeHBvcnRzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpY29udikge1xuICAgIFxuICAgIC8vIEFkZGl0aW9uYWwgUHVibGljIEFQSS5cbiAgICBpY29udi5lbmNvZGVTdHJlYW0gPSBmdW5jdGlvbiBlbmNvZGVTdHJlYW0oZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJY29udkxpdGVFbmNvZGVyU3RyZWFtKGljb252LmdldEVuY29kZXIoZW5jb2RpbmcsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpY29udi5kZWNvZGVTdHJlYW0gPSBmdW5jdGlvbiBkZWNvZGVTdHJlYW0oZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJY29udkxpdGVEZWNvZGVyU3RyZWFtKGljb252LmdldERlY29kZXIoZW5jb2RpbmcsIG9wdGlvbnMpLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpY29udi5zdXBwb3J0c1N0cmVhbXMgPSB0cnVlO1xuXG5cbiAgICAvLyBOb3QgcHVibGlzaGVkIHlldC5cbiAgICBpY29udi5JY29udkxpdGVFbmNvZGVyU3RyZWFtID0gSWNvbnZMaXRlRW5jb2RlclN0cmVhbTtcbiAgICBpY29udi5JY29udkxpdGVEZWNvZGVyU3RyZWFtID0gSWNvbnZMaXRlRGVjb2RlclN0cmVhbTtcbiAgICBpY29udi5fY29sbGVjdCA9IEljb252TGl0ZURlY29kZXJTdHJlYW0ucHJvdG90eXBlLmNvbGxlY3Q7XG59O1xuXG5cbi8vID09IEVuY29kZXIgc3RyZWFtID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIEljb252TGl0ZUVuY29kZXJTdHJlYW0oY29udiwgb3B0aW9ucykge1xuICAgIHRoaXMuY29udiA9IGNvbnY7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5kZWNvZGVTdHJpbmdzID0gZmFsc2U7IC8vIFdlIGFjY2VwdCBvbmx5IHN0cmluZ3MsIHNvIHdlIGRvbid0IG5lZWQgdG8gZGVjb2RlIHRoZW0uXG4gICAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5cbkljb252TGl0ZUVuY29kZXJTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm0ucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHsgdmFsdWU6IEljb252TGl0ZUVuY29kZXJTdHJlYW0gfVxufSk7XG5cbkljb252TGl0ZUVuY29kZXJTdHJlYW0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGRvbmUpIHtcbiAgICBpZiAodHlwZW9mIGNodW5rICE9ICdzdHJpbmcnKVxuICAgICAgICByZXR1cm4gZG9uZShuZXcgRXJyb3IoXCJJY29udiBlbmNvZGluZyBzdHJlYW0gbmVlZHMgc3RyaW5ncyBhcyBpdHMgaW5wdXQuXCIpKTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5jb252LndyaXRlKGNodW5rKTtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMubGVuZ3RoKSB0aGlzLnB1c2gocmVzKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBkb25lKGUpO1xuICAgIH1cbn1cblxuSWNvbnZMaXRlRW5jb2RlclN0cmVhbS5wcm90b3R5cGUuX2ZsdXNoID0gZnVuY3Rpb24oZG9uZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHZhciByZXMgPSB0aGlzLmNvbnYuZW5kKCk7XG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkgdGhpcy5wdXNoKHJlcyk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZG9uZShlKTtcbiAgICB9XG59XG5cbkljb252TGl0ZUVuY29kZXJTdHJlYW0ucHJvdG90eXBlLmNvbGxlY3QgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBjaHVua3MgPSBbXTtcbiAgICB0aGlzLm9uKCdlcnJvcicsIGNiKTtcbiAgICB0aGlzLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHsgY2h1bmtzLnB1c2goY2h1bmspOyB9KTtcbiAgICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2IobnVsbCwgQnVmZmVyLmNvbmNhdChjaHVua3MpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn1cblxuXG4vLyA9PSBEZWNvZGVyIHN0cmVhbSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBJY29udkxpdGVEZWNvZGVyU3RyZWFtKGNvbnYsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnYgPSBjb252O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuZW5jb2RpbmcgPSB0aGlzLmVuY29kaW5nID0gJ3V0ZjgnOyAvLyBXZSBvdXRwdXQgc3RyaW5ncy5cbiAgICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbn1cblxuSWNvbnZMaXRlRGVjb2RlclN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRyYW5zZm9ybS5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogSWNvbnZMaXRlRGVjb2RlclN0cmVhbSB9XG59KTtcblxuSWNvbnZMaXRlRGVjb2RlclN0cmVhbS5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgZG9uZSkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGNodW5rKSlcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IEVycm9yKFwiSWNvbnYgZGVjb2Rpbmcgc3RyZWFtIG5lZWRzIGJ1ZmZlcnMgYXMgaXRzIGlucHV0LlwiKSk7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuY29udi53cml0ZShjaHVuayk7XG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkgdGhpcy5wdXNoKHJlcywgdGhpcy5lbmNvZGluZyk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZG9uZShlKTtcbiAgICB9XG59XG5cbkljb252TGl0ZURlY29kZXJTdHJlYW0ucHJvdG90eXBlLl9mbHVzaCA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5jb252LmVuZCgpO1xuICAgICAgICBpZiAocmVzICYmIHJlcy5sZW5ndGgpIHRoaXMucHVzaChyZXMsIHRoaXMuZW5jb2RpbmcpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgZG9uZSgpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBkb25lKGUpO1xuICAgIH1cbn1cblxuSWNvbnZMaXRlRGVjb2RlclN0cmVhbS5wcm90b3R5cGUuY29sbGVjdCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIHJlcyA9ICcnO1xuICAgIHRoaXMub24oJ2Vycm9yJywgY2IpO1xuICAgIHRoaXMub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykgeyByZXMgKz0gY2h1bms7IH0pO1xuICAgIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjYihudWxsLCByZXMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1N0cmVhbSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuXHRyZXR1cm4gc3RyZWFtICE9PSBudWxsICYmIHR5cGVvZiBzdHJlYW0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBzdHJlYW0ucGlwZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG5cbmlzU3RyZWFtLndyaXRhYmxlID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuXHRyZXR1cm4gaXNTdHJlYW0oc3RyZWFtKSAmJiBzdHJlYW0ud3JpdGFibGUgIT09IGZhbHNlICYmIHR5cGVvZiBzdHJlYW0uX3dyaXRlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBzdHJlYW0uX3dyaXRhYmxlU3RhdGUgPT09ICdvYmplY3QnO1xufTtcblxuaXNTdHJlYW0ucmVhZGFibGUgPSBmdW5jdGlvbiAoc3RyZWFtKSB7XG5cdHJldHVybiBpc1N0cmVhbShzdHJlYW0pICYmIHN0cmVhbS5yZWFkYWJsZSAhPT0gZmFsc2UgJiYgdHlwZW9mIHN0cmVhbS5fcmVhZCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc3RyZWFtLl9yZWFkYWJsZVN0YXRlID09PSAnb2JqZWN0Jztcbn07XG5cbmlzU3RyZWFtLmR1cGxleCA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcblx0cmV0dXJuIGlzU3RyZWFtLndyaXRhYmxlKHN0cmVhbSkgJiYgaXNTdHJlYW0ucmVhZGFibGUoc3RyZWFtKTtcbn07XG5cbmlzU3RyZWFtLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcblx0cmV0dXJuIGlzU3RyZWFtLmR1cGxleChzdHJlYW0pICYmIHR5cGVvZiBzdHJlYW0uX3RyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZSA9PT0gJ29iamVjdCc7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciByZWFsRmV0Y2ggPSByZXF1aXJlKCdub2RlLWZldGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuXHRpZiAoL15cXC9cXC8vLnRlc3QodXJsKSkge1xuXHRcdHVybCA9ICdodHRwczonICsgdXJsO1xuXHR9XG5cdHJldHVybiByZWFsRmV0Y2guY2FsbCh0aGlzLCB1cmwsIG9wdGlvbnMpO1xufTtcblxuaWYgKCFnbG9iYWwuZmV0Y2gpIHtcblx0Z2xvYmFsLmZldGNoID0gbW9kdWxlLmV4cG9ydHM7XG5cdGdsb2JhbC5SZXNwb25zZSA9IHJlYWxGZXRjaC5SZXNwb25zZTtcblx0Z2xvYmFsLkhlYWRlcnMgPSByZWFsRmV0Y2guSGVhZGVycztcblx0Z2xvYmFsLlJlcXVlc3QgPSByZWFsRmV0Y2guUmVxdWVzdDtcbn1cbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBlbXB0eSBvYmplY3QsIGNvbGxlY3Rpb24sIG1hcCwgb3Igc2V0LlxuICpcbiAqIE9iamVjdHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIG5vIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZFxuICogcHJvcGVydGllcy5cbiAqXG4gKiBBcnJheS1saWtlIHZhbHVlcyBzdWNoIGFzIGBhcmd1bWVudHNgIG9iamVjdHMsIGFycmF5cywgYnVmZmVycywgc3RyaW5ncywgb3JcbiAqIGpRdWVyeS1saWtlIGNvbGxlY3Rpb25zIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBhIGBsZW5ndGhgIG9mIGAwYC5cbiAqIFNpbWlsYXJseSwgbWFwcyBhbmQgc2V0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgc2l6ZWAgb2YgYDBgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgKGlzQXJyYXkodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUuc3BsaWNlID09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgaXNCdWZmZXIodmFsdWUpIHx8IGlzVHlwZWRBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICB9XG4gIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpO1xuICBpZiAodGFnID09IG1hcFRhZyB8fCB0YWcgPT0gc2V0VGFnKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5zaXplO1xuICB9XG4gIGlmIChpc1Byb3RvdHlwZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gIWJhc2VLZXlzKHZhbHVlKS5sZW5ndGg7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbXB0eTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsIlxuLyoqXG4gKiBpbmRleC5qc1xuICpcbiAqIGEgcmVxdWVzdCBBUEkgY29tcGF0aWJsZSB3aXRoIHdpbmRvdy5mZXRjaFxuICovXG5cbnZhciBwYXJzZV91cmwgPSByZXF1aXJlKCd1cmwnKS5wYXJzZTtcbnZhciByZXNvbHZlX3VybCA9IHJlcXVpcmUoJ3VybCcpLnJlc29sdmU7XG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG52YXIgemxpYiA9IHJlcXVpcmUoJ3psaWInKTtcbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcblxudmFyIEJvZHkgPSByZXF1aXJlKCcuL2xpYi9ib2R5Jyk7XG52YXIgUmVzcG9uc2UgPSByZXF1aXJlKCcuL2xpYi9yZXNwb25zZScpO1xudmFyIEhlYWRlcnMgPSByZXF1aXJlKCcuL2xpYi9oZWFkZXJzJyk7XG52YXIgUmVxdWVzdCA9IHJlcXVpcmUoJy4vbGliL3JlcXVlc3QnKTtcbnZhciBGZXRjaEVycm9yID0gcmVxdWlyZSgnLi9saWIvZmV0Y2gtZXJyb3InKTtcblxuLy8gY29tbW9uanNcbm1vZHVsZS5leHBvcnRzID0gRmV0Y2g7XG4vLyBlczYgZGVmYXVsdCBleHBvcnQgY29tcGF0aWJpbGl0eVxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIEZldGNoIGNsYXNzXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICAgdXJsICAgQWJzb2x1dGUgdXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgIG9wdHMgIEZldGNoIG9wdGlvbnNcbiAqIEByZXR1cm4gIFByb21pc2VcbiAqL1xuZnVuY3Rpb24gRmV0Y2godXJsLCBvcHRzKSB7XG5cblx0Ly8gYWxsb3cgY2FsbCBhcyBmdW5jdGlvblxuXHRpZiAoISh0aGlzIGluc3RhbmNlb2YgRmV0Y2gpKVxuXHRcdHJldHVybiBuZXcgRmV0Y2godXJsLCBvcHRzKTtcblxuXHQvLyBhbGxvdyBjdXN0b20gcHJvbWlzZVxuXHRpZiAoIUZldGNoLlByb21pc2UpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ25hdGl2ZSBwcm9taXNlIG1pc3NpbmcsIHNldCBGZXRjaC5Qcm9taXNlIHRvIHlvdXIgZmF2b3JpdGUgYWx0ZXJuYXRpdmUnKTtcblx0fVxuXG5cdEJvZHkuUHJvbWlzZSA9IEZldGNoLlByb21pc2U7XG5cblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdC8vIHdyYXAgaHR0cC5yZXF1ZXN0IGludG8gZmV0Y2hcblx0cmV0dXJuIG5ldyBGZXRjaC5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdC8vIGJ1aWxkIHJlcXVlc3Qgb2JqZWN0XG5cdFx0dmFyIG9wdGlvbnMgPSBuZXcgUmVxdWVzdCh1cmwsIG9wdHMpO1xuXG5cdFx0aWYgKCFvcHRpb25zLnByb3RvY29sIHx8ICFvcHRpb25zLmhvc3RuYW1lKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ29ubHkgYWJzb2x1dGUgdXJscyBhcmUgc3VwcG9ydGVkJyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdGlvbnMucHJvdG9jb2wgIT09ICdodHRwOicgJiYgb3B0aW9ucy5wcm90b2NvbCAhPT0gJ2h0dHBzOicpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignb25seSBodHRwKHMpIHByb3RvY29scyBhcmUgc3VwcG9ydGVkJyk7XG5cdFx0fVxuXG5cdFx0dmFyIHNlbmQ7XG5cdFx0aWYgKG9wdGlvbnMucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG5cdFx0XHRzZW5kID0gaHR0cHMucmVxdWVzdDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2VuZCA9IGh0dHAucmVxdWVzdDtcblx0XHR9XG5cblx0XHQvLyBub3JtYWxpemUgaGVhZGVyc1xuXHRcdHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKTtcblxuXHRcdGlmIChvcHRpb25zLmNvbXByZXNzKSB7XG5cdFx0XHRoZWFkZXJzLnNldCgnYWNjZXB0LWVuY29kaW5nJywgJ2d6aXAsZGVmbGF0ZScpO1xuXHRcdH1cblxuXHRcdGlmICghaGVhZGVycy5oYXMoJ3VzZXItYWdlbnQnKSkge1xuXHRcdFx0aGVhZGVycy5zZXQoJ3VzZXItYWdlbnQnLCAnbm9kZS1mZXRjaC8xLjAgKCtodHRwczovL2dpdGh1Yi5jb20vYml0aW5uL25vZGUtZmV0Y2gpJyk7XG5cdFx0fVxuXG5cdFx0aWYgKCFoZWFkZXJzLmhhcygnY29ubmVjdGlvbicpICYmICFvcHRpb25zLmFnZW50KSB7XG5cdFx0XHRoZWFkZXJzLnNldCgnY29ubmVjdGlvbicsICdjbG9zZScpO1xuXHRcdH1cblxuXHRcdGlmICghaGVhZGVycy5oYXMoJ2FjY2VwdCcpKSB7XG5cdFx0XHRoZWFkZXJzLnNldCgnYWNjZXB0JywgJyovKicpO1xuXHRcdH1cblxuXHRcdC8vIGRldGVjdCBmb3JtIGRhdGEgaW5wdXQgZnJvbSBmb3JtLWRhdGEgbW9kdWxlLCB0aGlzIGhhY2sgYXZvaWQgdGhlIG5lZWQgdG8gcGFzcyBtdWx0aXBhcnQgaGVhZGVyIG1hbnVhbGx5XG5cdFx0aWYgKCFoZWFkZXJzLmhhcygnY29udGVudC10eXBlJykgJiYgb3B0aW9ucy5ib2R5ICYmIHR5cGVvZiBvcHRpb25zLmJvZHkuZ2V0Qm91bmRhcnkgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnbXVsdGlwYXJ0L2Zvcm0tZGF0YTsgYm91bmRhcnk9JyArIG9wdGlvbnMuYm9keS5nZXRCb3VuZGFyeSgpKTtcblx0XHR9XG5cblx0XHQvLyBicmluZyBub2RlLWZldGNoIGNsb3NlciB0byBicm93c2VyIGJlaGF2aW9yIGJ5IHNldHRpbmcgY29udGVudC1sZW5ndGggYXV0b21hdGljYWxseVxuXHRcdGlmICghaGVhZGVycy5oYXMoJ2NvbnRlbnQtbGVuZ3RoJykgJiYgL3Bvc3R8cHV0fHBhdGNofGRlbGV0ZS9pLnRlc3Qob3B0aW9ucy5tZXRob2QpKSB7XG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMuYm9keSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aGVhZGVycy5zZXQoJ2NvbnRlbnQtbGVuZ3RoJywgQnVmZmVyLmJ5dGVMZW5ndGgob3B0aW9ucy5ib2R5KSk7XG5cdFx0XHQvLyBkZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZSwgdGhpcyBoYWNrIGF2b2lkIHRoZSBuZWVkIHRvIGFkZCBjb250ZW50LWxlbmd0aCBoZWFkZXIgbWFudWFsbHlcblx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5ib2R5ICYmIHR5cGVvZiBvcHRpb25zLmJvZHkuZ2V0TGVuZ3RoU3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHQvLyBmb3IgZm9ybS1kYXRhIDEueFxuXHRcdFx0XHRpZiAob3B0aW9ucy5ib2R5Ll9sZW5ndGhSZXRyaWV2ZXJzICYmIG9wdGlvbnMuYm9keS5fbGVuZ3RoUmV0cmlldmVycy5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LWxlbmd0aCcsIG9wdGlvbnMuYm9keS5nZXRMZW5ndGhTeW5jKCkudG9TdHJpbmcoKSk7XG5cdFx0XHRcdC8vIGZvciBmb3JtLWRhdGEgMi54XG5cdFx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5ib2R5Lmhhc0tub3duTGVuZ3RoICYmIG9wdGlvbnMuYm9keS5oYXNLbm93bkxlbmd0aCgpKSB7XG5cdFx0XHRcdFx0aGVhZGVycy5zZXQoJ2NvbnRlbnQtbGVuZ3RoJywgb3B0aW9ucy5ib2R5LmdldExlbmd0aFN5bmMoKS50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0Ly8gdGhpcyBpcyBvbmx5IG5lY2Vzc2FyeSBmb3Igb2xkZXIgbm9kZWpzIHJlbGVhc2VzIChiZWZvcmUgaW9qcyBtZXJnZSlcblx0XHRcdH0gZWxzZSBpZiAob3B0aW9ucy5ib2R5ID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5ib2R5ID09PSBudWxsKSB7XG5cdFx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LWxlbmd0aCcsICcwJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0b3B0aW9ucy5oZWFkZXJzID0gaGVhZGVycy5yYXcoKTtcblxuXHRcdC8vIGh0dHAucmVxdWVzdCBvbmx5IHN1cHBvcnQgc3RyaW5nIGFzIGhvc3QgaGVhZGVyLCB0aGlzIGhhY2sgbWFrZSBjdXN0b20gaG9zdCBoZWFkZXIgcG9zc2libGVcblx0XHRpZiAob3B0aW9ucy5oZWFkZXJzLmhvc3QpIHtcblx0XHRcdG9wdGlvbnMuaGVhZGVycy5ob3N0ID0gb3B0aW9ucy5oZWFkZXJzLmhvc3RbMF07XG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCByZXF1ZXN0XG5cdFx0dmFyIHJlcSA9IHNlbmQob3B0aW9ucyk7XG5cdFx0dmFyIHJlcVRpbWVvdXQ7XG5cblx0XHRpZiAob3B0aW9ucy50aW1lb3V0KSB7XG5cdFx0XHRyZXEub25jZSgnc29ja2V0JywgZnVuY3Rpb24oc29ja2V0KSB7XG5cdFx0XHRcdHJlcVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJlcS5hYm9ydCgpO1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcignbmV0d29yayB0aW1lb3V0IGF0OiAnICsgb3B0aW9ucy51cmwsICdyZXF1ZXN0LXRpbWVvdXQnKSk7XG5cdFx0XHRcdH0sIG9wdGlvbnMudGltZW91dCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXEub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQocmVxVGltZW91dCk7XG5cdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ3JlcXVlc3QgdG8gJyArIG9wdGlvbnMudXJsICsgJyBmYWlsZWQsIHJlYXNvbjogJyArIGVyci5tZXNzYWdlLCAnc3lzdGVtJywgZXJyKSk7XG5cdFx0fSk7XG5cblx0XHRyZXEub24oJ3Jlc3BvbnNlJywgZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQocmVxVGltZW91dCk7XG5cblx0XHRcdC8vIGhhbmRsZSByZWRpcmVjdFxuXHRcdFx0aWYgKHNlbGYuaXNSZWRpcmVjdChyZXMuc3RhdHVzQ29kZSkgJiYgb3B0aW9ucy5yZWRpcmVjdCAhPT0gJ21hbnVhbCcpIHtcblx0XHRcdFx0aWYgKG9wdGlvbnMucmVkaXJlY3QgPT09ICdlcnJvcicpIHtcblx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ3JlZGlyZWN0IG1vZGUgaXMgc2V0IHRvIGVycm9yOiAnICsgb3B0aW9ucy51cmwsICduby1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3B0aW9ucy5jb3VudGVyID49IG9wdGlvbnMuZm9sbG93KSB7XG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdtYXhpbXVtIHJlZGlyZWN0IHJlYWNoZWQgYXQ6ICcgKyBvcHRpb25zLnVybCwgJ21heC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIXJlcy5oZWFkZXJzLmxvY2F0aW9uKSB7XG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdyZWRpcmVjdCBsb2NhdGlvbiBoZWFkZXIgbWlzc2luZyBhdDogJyArIG9wdGlvbnMudXJsLCAnaW52YWxpZC1yZWRpcmVjdCcpKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBwZXIgZmV0Y2ggc3BlYywgZm9yIFBPU1QgcmVxdWVzdCB3aXRoIDMwMS8zMDIgcmVzcG9uc2UsIG9yIGFueSByZXF1ZXN0IHdpdGggMzAzIHJlc3BvbnNlLCB1c2UgR0VUIHdoZW4gZm9sbG93aW5nIHJlZGlyZWN0XG5cdFx0XHRcdGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMzAzXG5cdFx0XHRcdFx0fHwgKChyZXMuc3RhdHVzQ29kZSA9PT0gMzAxIHx8IHJlcy5zdGF0dXNDb2RlID09PSAzMDIpICYmIG9wdGlvbnMubWV0aG9kID09PSAnUE9TVCcpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3B0aW9ucy5tZXRob2QgPSAnR0VUJztcblx0XHRcdFx0XHRkZWxldGUgb3B0aW9ucy5ib2R5O1xuXHRcdFx0XHRcdGRlbGV0ZSBvcHRpb25zLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcHRpb25zLmNvdW50ZXIrKztcblxuXHRcdFx0XHRyZXNvbHZlKEZldGNoKHJlc29sdmVfdXJsKG9wdGlvbnMudXJsLCByZXMuaGVhZGVycy5sb2NhdGlvbiksIG9wdGlvbnMpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBub3JtYWxpemUgbG9jYXRpb24gaGVhZGVyIGZvciBtYW51YWwgcmVkaXJlY3QgbW9kZVxuXHRcdFx0dmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycyhyZXMuaGVhZGVycyk7XG5cdFx0XHRpZiAob3B0aW9ucy5yZWRpcmVjdCA9PT0gJ21hbnVhbCcgJiYgaGVhZGVycy5oYXMoJ2xvY2F0aW9uJykpIHtcblx0XHRcdFx0aGVhZGVycy5zZXQoJ2xvY2F0aW9uJywgcmVzb2x2ZV91cmwob3B0aW9ucy51cmwsIGhlYWRlcnMuZ2V0KCdsb2NhdGlvbicpKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHByZXBhcmUgcmVzcG9uc2Vcblx0XHRcdHZhciBib2R5ID0gcmVzLnBpcGUobmV3IHN0cmVhbS5QYXNzVGhyb3VnaCgpKTtcblx0XHRcdHZhciByZXNwb25zZV9vcHRpb25zID0ge1xuXHRcdFx0XHR1cmw6IG9wdGlvbnMudXJsXG5cdFx0XHRcdCwgc3RhdHVzOiByZXMuc3RhdHVzQ29kZVxuXHRcdFx0XHQsIHN0YXR1c1RleHQ6IHJlcy5zdGF0dXNNZXNzYWdlXG5cdFx0XHRcdCwgaGVhZGVyczogaGVhZGVyc1xuXHRcdFx0XHQsIHNpemU6IG9wdGlvbnMuc2l6ZVxuXHRcdFx0XHQsIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dFxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gcmVzcG9uc2Ugb2JqZWN0XG5cdFx0XHR2YXIgb3V0cHV0O1xuXG5cdFx0XHQvLyBpbiBmb2xsb3dpbmcgc2NlbmFyaW9zIHdlIGlnbm9yZSBjb21wcmVzc2lvbiBzdXBwb3J0XG5cdFx0XHQvLyAxLiBjb21wcmVzc2lvbiBzdXBwb3J0IGlzIGRpc2FibGVkXG5cdFx0XHQvLyAyLiBIRUFEIHJlcXVlc3Rcblx0XHRcdC8vIDMuIG5vIGNvbnRlbnQtZW5jb2RpbmcgaGVhZGVyXG5cdFx0XHQvLyA0LiBubyBjb250ZW50IHJlc3BvbnNlICgyMDQpXG5cdFx0XHQvLyA1LiBjb250ZW50IG5vdCBtb2RpZmllZCByZXNwb25zZSAoMzA0KVxuXHRcdFx0aWYgKCFvcHRpb25zLmNvbXByZXNzIHx8IG9wdGlvbnMubWV0aG9kID09PSAnSEVBRCcgfHwgIWhlYWRlcnMuaGFzKCdjb250ZW50LWVuY29kaW5nJykgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDIwNCB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMzA0KSB7XG5cdFx0XHRcdG91dHB1dCA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShvdXRwdXQpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIG90aGVyd2lzZSwgY2hlY2sgZm9yIGd6aXAgb3IgZGVmbGF0ZVxuXHRcdFx0dmFyIG5hbWUgPSBoZWFkZXJzLmdldCgnY29udGVudC1lbmNvZGluZycpO1xuXG5cdFx0XHQvLyBmb3IgZ3ppcFxuXHRcdFx0aWYgKG5hbWUgPT0gJ2d6aXAnIHx8IG5hbWUgPT0gJ3gtZ3ppcCcpIHtcblx0XHRcdFx0Ym9keSA9IGJvZHkucGlwZSh6bGliLmNyZWF0ZUd1bnppcCgpKTtcblx0XHRcdFx0b3V0cHV0ID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0XHRyZXNvbHZlKG91dHB1dCk7XG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0Ly8gZm9yIGRlZmxhdGVcblx0XHRcdH0gZWxzZSBpZiAobmFtZSA9PSAnZGVmbGF0ZScgfHwgbmFtZSA9PSAneC1kZWZsYXRlJykge1xuXHRcdFx0XHQvLyBoYW5kbGUgdGhlIGluZmFtb3VzIHJhdyBkZWZsYXRlIHJlc3BvbnNlIGZyb20gb2xkIHNlcnZlcnNcblx0XHRcdFx0Ly8gYSBoYWNrIGZvciBvbGQgSUlTIGFuZCBBcGFjaGUgc2VydmVyc1xuXHRcdFx0XHR2YXIgcmF3ID0gcmVzLnBpcGUobmV3IHN0cmVhbS5QYXNzVGhyb3VnaCgpKTtcblx0XHRcdFx0cmF3Lm9uY2UoJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuXHRcdFx0XHRcdC8vIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM3NTE5ODI4XG5cdFx0XHRcdFx0aWYgKChjaHVua1swXSAmIDB4MEYpID09PSAweDA4KSB7XG5cdFx0XHRcdFx0XHRib2R5ID0gYm9keS5waXBlKHpsaWIuY3JlYXRlSW5mbGF0ZSgpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Ym9keSA9IGJvZHkucGlwZSh6bGliLmNyZWF0ZUluZmxhdGVSYXcoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG91dHB1dCA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0XHRyZXNvbHZlKG91dHB1dCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIG90aGVyd2lzZSwgdXNlIHJlc3BvbnNlIGFzLWlzXG5cdFx0XHRvdXRwdXQgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRyZXNvbHZlKG91dHB1dCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSk7XG5cblx0XHQvLyBhY2NlcHQgc3RyaW5nLCBidWZmZXIgb3IgcmVhZGFibGUgc3RyZWFtIGFzIGJvZHlcblx0XHQvLyBwZXIgc3BlYyB3ZSB3aWxsIGNhbGwgdG9zdHJpbmcgb24gbm9uLXN0cmVhbSBvYmplY3RzXG5cdFx0aWYgKHR5cGVvZiBvcHRpb25zLmJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXEud3JpdGUob3B0aW9ucy5ib2R5KTtcblx0XHRcdHJlcS5lbmQoKTtcblx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYm9keSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuXHRcdFx0cmVxLndyaXRlKG9wdGlvbnMuYm9keSk7XG5cdFx0XHRyZXEuZW5kKClcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmJvZHkgPT09ICdvYmplY3QnICYmIG9wdGlvbnMuYm9keS5waXBlKSB7XG5cdFx0XHRvcHRpb25zLmJvZHkucGlwZShyZXEpO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuYm9keSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHJlcS53cml0ZShvcHRpb25zLmJvZHkudG9TdHJpbmcoKSk7XG5cdFx0XHRyZXEuZW5kKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcS5lbmQoKTtcblx0XHR9XG5cdH0pO1xuXG59O1xuXG4vKipcbiAqIFJlZGlyZWN0IGNvZGUgbWF0Y2hpbmdcbiAqXG4gKiBAcGFyYW0gICBOdW1iZXIgICBjb2RlICBTdGF0dXMgY29kZVxuICogQHJldHVybiAgQm9vbGVhblxuICovXG5GZXRjaC5wcm90b3R5cGUuaXNSZWRpcmVjdCA9IGZ1bmN0aW9uKGNvZGUpIHtcblx0cmV0dXJuIGNvZGUgPT09IDMwMSB8fCBjb2RlID09PSAzMDIgfHwgY29kZSA9PT0gMzAzIHx8IGNvZGUgPT09IDMwNyB8fCBjb2RlID09PSAzMDg7XG59XG5cbi8vIGV4cG9zZSBQcm9taXNlXG5GZXRjaC5Qcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5GZXRjaC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuRmV0Y2guSGVhZGVycyA9IEhlYWRlcnM7XG5GZXRjaC5SZXF1ZXN0ID0gUmVxdWVzdDtcbiIsIlxuLyoqXG4gKiBib2R5LmpzXG4gKlxuICogQm9keSBpbnRlcmZhY2UgcHJvdmlkZXMgY29tbW9uIG1ldGhvZHMgZm9yIFJlcXVlc3QgYW5kIFJlc3BvbnNlXG4gKi9cblxudmFyIGNvbnZlcnQgPSByZXF1aXJlKCdlbmNvZGluZycpLmNvbnZlcnQ7XG52YXIgYm9keVN0cmVhbSA9IHJlcXVpcmUoJ2lzLXN0cmVhbScpO1xudmFyIFBhc3NUaHJvdWdoID0gcmVxdWlyZSgnc3RyZWFtJykuUGFzc1Rocm91Z2g7XG52YXIgRmV0Y2hFcnJvciA9IHJlcXVpcmUoJy4vZmV0Y2gtZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb2R5O1xuXG4vKipcbiAqIEJvZHkgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBTdHJlYW0gIGJvZHkgIFJlYWRhYmxlIHN0cmVhbVxuICogQHBhcmFtICAgT2JqZWN0ICBvcHRzICBSZXNwb25zZSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmZ1bmN0aW9uIEJvZHkoYm9keSwgb3B0cykge1xuXG5cdG9wdHMgPSBvcHRzIHx8IHt9O1xuXG5cdHRoaXMuYm9keSA9IGJvZHk7XG5cdHRoaXMuYm9keVVzZWQgPSBmYWxzZTtcblx0dGhpcy5zaXplID0gb3B0cy5zaXplIHx8IDA7XG5cdHRoaXMudGltZW91dCA9IG9wdHMudGltZW91dCB8fCAwO1xuXHR0aGlzLl9yYXcgPSBbXTtcblx0dGhpcy5fYWJvcnQgPSBmYWxzZTtcblxufVxuXG4vKipcbiAqIERlY29kZSByZXNwb25zZSBhcyBqc29uXG4gKlxuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5Cb2R5LnByb3RvdHlwZS5qc29uID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8gZm9yIDIwNCBObyBDb250ZW50IHJlc3BvbnNlLCBidWZmZXIgd2lsbCBiZSBlbXB0eSwgcGFyc2luZyBpdCB3aWxsIHRocm93IGVycm9yXG5cdGlmICh0aGlzLnN0YXR1cyA9PT0gMjA0KSB7XG5cdFx0cmV0dXJuIEJvZHkuUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdHJldHVybiB0aGlzLl9kZWNvZGUoKS50aGVuKGZ1bmN0aW9uKGJ1ZmZlcikge1xuXHRcdHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKTtcblx0fSk7XG5cbn07XG5cbi8qKlxuICogRGVjb2RlIHJlc3BvbnNlIGFzIHRleHRcbiAqXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbkJvZHkucHJvdG90eXBlLnRleHQgPSBmdW5jdGlvbigpIHtcblxuXHRyZXR1cm4gdGhpcy5fZGVjb2RlKCkudGhlbihmdW5jdGlvbihidWZmZXIpIHtcblx0XHRyZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCk7XG5cdH0pO1xuXG59O1xuXG4vKipcbiAqIERlY29kZSByZXNwb25zZSBhcyBidWZmZXIgKG5vbi1zcGVjIGFwaSlcbiAqXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbkJvZHkucHJvdG90eXBlLmJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuXG5cdHJldHVybiB0aGlzLl9kZWNvZGUoKTtcblxufTtcblxuLyoqXG4gKiBEZWNvZGUgYnVmZmVycyBpbnRvIHV0Zi04IHN0cmluZ1xuICpcbiAqIEByZXR1cm4gIFByb21pc2VcbiAqL1xuQm9keS5wcm90b3R5cGUuX2RlY29kZSA9IGZ1bmN0aW9uKCkge1xuXG5cdHZhciBzZWxmID0gdGhpcztcblxuXHRpZiAodGhpcy5ib2R5VXNlZCkge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVqZWN0KG5ldyBFcnJvcignYm9keSB1c2VkIGFscmVhZHkgZm9yOiAnICsgdGhpcy51cmwpKTtcblx0fVxuXG5cdHRoaXMuYm9keVVzZWQgPSB0cnVlO1xuXHR0aGlzLl9ieXRlcyA9IDA7XG5cdHRoaXMuX2Fib3J0ID0gZmFsc2U7XG5cdHRoaXMuX3JhdyA9IFtdO1xuXG5cdHJldHVybiBuZXcgQm9keS5Qcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdHZhciByZXNUaW1lb3V0O1xuXG5cdFx0Ly8gYm9keSBpcyBzdHJpbmdcblx0XHRpZiAodHlwZW9mIHNlbGYuYm9keSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHNlbGYuX2J5dGVzID0gc2VsZi5ib2R5Lmxlbmd0aDtcblx0XHRcdHNlbGYuX3JhdyA9IFtuZXcgQnVmZmVyKHNlbGYuYm9keSldO1xuXHRcdFx0cmV0dXJuIHJlc29sdmUoc2VsZi5fY29udmVydCgpKTtcblx0XHR9XG5cblx0XHQvLyBib2R5IGlzIGJ1ZmZlclxuXHRcdGlmIChzZWxmLmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcblx0XHRcdHNlbGYuX2J5dGVzID0gc2VsZi5ib2R5Lmxlbmd0aDtcblx0XHRcdHNlbGYuX3JhdyA9IFtzZWxmLmJvZHldO1xuXHRcdFx0cmV0dXJuIHJlc29sdmUoc2VsZi5fY29udmVydCgpKTtcblx0XHR9XG5cblx0XHQvLyBhbGxvdyB0aW1lb3V0IG9uIHNsb3cgcmVzcG9uc2UgYm9keVxuXHRcdGlmIChzZWxmLnRpbWVvdXQpIHtcblx0XHRcdHJlc1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZWxmLl9hYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcigncmVzcG9uc2UgdGltZW91dCBhdCAnICsgc2VsZi51cmwgKyAnIG92ZXIgbGltaXQ6ICcgKyBzZWxmLnRpbWVvdXQsICdib2R5LXRpbWVvdXQnKSk7XG5cdFx0XHR9LCBzZWxmLnRpbWVvdXQpO1xuXHRcdH1cblxuXHRcdC8vIGhhbmRsZSBzdHJlYW0gZXJyb3IsIHN1Y2ggYXMgaW5jb3JyZWN0IGNvbnRlbnQtZW5jb2Rpbmdcblx0XHRzZWxmLmJvZHkub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ2ludmFsaWQgcmVzcG9uc2UgYm9keSBhdDogJyArIHNlbGYudXJsICsgJyByZWFzb246ICcgKyBlcnIubWVzc2FnZSwgJ3N5c3RlbScsIGVycikpO1xuXHRcdH0pO1xuXG5cdFx0Ly8gYm9keSBpcyBzdHJlYW1cblx0XHRzZWxmLmJvZHkub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuXHRcdFx0aWYgKHNlbGYuX2Fib3J0IHx8IGNodW5rID09PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNlbGYuc2l6ZSAmJiBzZWxmLl9ieXRlcyArIGNodW5rLmxlbmd0aCA+IHNlbGYuc2l6ZSkge1xuXHRcdFx0XHRzZWxmLl9hYm9ydCA9IHRydWU7XG5cdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcignY29udGVudCBzaXplIGF0ICcgKyBzZWxmLnVybCArICcgb3ZlciBsaW1pdDogJyArIHNlbGYuc2l6ZSwgJ21heC1zaXplJykpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHNlbGYuX2J5dGVzICs9IGNodW5rLmxlbmd0aDtcblx0XHRcdHNlbGYuX3Jhdy5wdXNoKGNodW5rKTtcblx0XHR9KTtcblxuXHRcdHNlbGYuYm9keS5vbignZW5kJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoc2VsZi5fYWJvcnQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRjbGVhclRpbWVvdXQocmVzVGltZW91dCk7XG5cdFx0XHRyZXNvbHZlKHNlbGYuX2NvbnZlcnQoKSk7XG5cdFx0fSk7XG5cdH0pO1xuXG59O1xuXG4vKipcbiAqIERldGVjdCBidWZmZXIgZW5jb2RpbmcgYW5kIGNvbnZlcnQgdG8gdGFyZ2V0IGVuY29kaW5nXG4gKiByZWY6IGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvV0QtaHRtbDUtMjAxMTAxMTMvcGFyc2luZy5odG1sI2RldGVybWluaW5nLXRoZS1jaGFyYWN0ZXItZW5jb2RpbmdcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIGVuY29kaW5nICBUYXJnZXQgZW5jb2RpbmdcbiAqIEByZXR1cm4gIFN0cmluZ1xuICovXG5Cb2R5LnByb3RvdHlwZS5fY29udmVydCA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG5cblx0ZW5jb2RpbmcgPSBlbmNvZGluZyB8fCAndXRmLTgnO1xuXG5cdHZhciBjdCA9IHRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xuXHR2YXIgY2hhcnNldCA9ICd1dGYtOCc7XG5cdHZhciByZXMsIHN0cjtcblxuXHQvLyBoZWFkZXJcblx0aWYgKGN0KSB7XG5cdFx0Ly8gc2tpcCBlbmNvZGluZyBkZXRlY3Rpb24gYWx0b2dldGhlciBpZiBub3QgaHRtbC94bWwvcGxhaW4gdGV4dFxuXHRcdGlmICghL3RleHRcXC9odG1sfHRleHRcXC9wbGFpbnxcXCt4bWx8XFwveG1sL2kudGVzdChjdCkpIHtcblx0XHRcdHJldHVybiBCdWZmZXIuY29uY2F0KHRoaXMuX3Jhdyk7XG5cdFx0fVxuXG5cdFx0cmVzID0gL2NoYXJzZXQ9KFteO10qKS9pLmV4ZWMoY3QpO1xuXHR9XG5cblx0Ly8gbm8gY2hhcnNldCBpbiBjb250ZW50IHR5cGUsIHBlZWsgYXQgcmVzcG9uc2UgYm9keSBmb3IgYXQgbW9zdCAxMDI0IGJ5dGVzXG5cdGlmICghcmVzICYmIHRoaXMuX3Jhdy5sZW5ndGggPiAwKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yYXcubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN0ciArPSB0aGlzLl9yYXdbaV0udG9TdHJpbmcoKVxuXHRcdFx0aWYgKHN0ci5sZW5ndGggPiAxMDI0KSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRzdHIgPSBzdHIuc3Vic3RyKDAsIDEwMjQpO1xuXHR9XG5cblx0Ly8gaHRtbDVcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxtZXRhLis/Y2hhcnNldD0oWydcIl0pKC4rPylcXDEvaS5leGVjKHN0cik7XG5cdH1cblxuXHQvLyBodG1sNFxuXHRpZiAoIXJlcyAmJiBzdHIpIHtcblx0XHRyZXMgPSAvPG1ldGFbXFxzXSs/aHR0cC1lcXVpdj0oWydcIl0pY29udGVudC10eXBlXFwxW1xcc10rP2NvbnRlbnQ9KFsnXCJdKSguKz8pXFwyL2kuZXhlYyhzdHIpO1xuXG5cdFx0aWYgKHJlcykge1xuXHRcdFx0cmVzID0gL2NoYXJzZXQ9KC4qKS9pLmV4ZWMocmVzLnBvcCgpKTtcblx0XHR9XG5cdH1cblxuXHQvLyB4bWxcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxcXD94bWwuKz9lbmNvZGluZz0oWydcIl0pKC4rPylcXDEvaS5leGVjKHN0cik7XG5cdH1cblxuXHQvLyBmb3VuZCBjaGFyc2V0XG5cdGlmIChyZXMpIHtcblx0XHRjaGFyc2V0ID0gcmVzLnBvcCgpO1xuXG5cdFx0Ly8gcHJldmVudCBkZWNvZGUgaXNzdWVzIHdoZW4gc2l0ZXMgdXNlIGluY29ycmVjdCBlbmNvZGluZ1xuXHRcdC8vIHJlZjogaHR0cHM6Ly9oc2l2b25lbi5maS9lbmNvZGluZy1tZW51L1xuXHRcdGlmIChjaGFyc2V0ID09PSAnZ2IyMzEyJyB8fCBjaGFyc2V0ID09PSAnZ2JrJykge1xuXHRcdFx0Y2hhcnNldCA9ICdnYjE4MDMwJztcblx0XHR9XG5cdH1cblxuXHQvLyB0dXJuIHJhdyBidWZmZXJzIGludG8gYSBzaW5nbGUgdXRmLTggYnVmZmVyXG5cdHJldHVybiBjb252ZXJ0KFxuXHRcdEJ1ZmZlci5jb25jYXQodGhpcy5fcmF3KVxuXHRcdCwgZW5jb2Rpbmdcblx0XHQsIGNoYXJzZXRcblx0KTtcblxufTtcblxuLyoqXG4gKiBDbG9uZSBib2R5IGdpdmVuIFJlcy9SZXEgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBNaXhlZCAgaW5zdGFuY2UgIFJlc3BvbnNlIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEByZXR1cm4gIE1peGVkXG4gKi9cbkJvZHkucHJvdG90eXBlLl9jbG9uZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG5cdHZhciBwMSwgcDI7XG5cdHZhciBib2R5ID0gaW5zdGFuY2UuYm9keTtcblxuXHQvLyBkb24ndCBhbGxvdyBjbG9uaW5nIGEgdXNlZCBib2R5XG5cdGlmIChpbnN0YW5jZS5ib2R5VXNlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignY2Fubm90IGNsb25lIGJvZHkgYWZ0ZXIgaXQgaXMgdXNlZCcpO1xuXHR9XG5cblx0Ly8gY2hlY2sgdGhhdCBib2R5IGlzIGEgc3RyZWFtIGFuZCBub3QgZm9ybS1kYXRhIG9iamVjdFxuXHQvLyBub3RlOiB3ZSBjYW4ndCBjbG9uZSB0aGUgZm9ybS1kYXRhIG9iamVjdCB3aXRob3V0IGhhdmluZyBpdCBhcyBhIGRlcGVuZGVuY3lcblx0aWYgKGJvZHlTdHJlYW0oYm9keSkgJiYgdHlwZW9mIGJvZHkuZ2V0Qm91bmRhcnkgIT09ICdmdW5jdGlvbicpIHtcblx0XHQvLyB0ZWUgaW5zdGFuY2UgYm9keVxuXHRcdHAxID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0cDIgPSBuZXcgUGFzc1Rocm91Z2goKTtcblx0XHRib2R5LnBpcGUocDEpO1xuXHRcdGJvZHkucGlwZShwMik7XG5cdFx0Ly8gc2V0IGluc3RhbmNlIGJvZHkgdG8gdGVlZCBib2R5IGFuZCByZXR1cm4gdGhlIG90aGVyIHRlZWQgYm9keVxuXHRcdGluc3RhbmNlLmJvZHkgPSBwMTtcblx0XHRib2R5ID0gcDI7XG5cdH1cblxuXHRyZXR1cm4gYm9keTtcbn1cblxuLy8gZXhwb3NlIFByb21pc2VcbkJvZHkuUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuIiwiXG4vKipcbiAqIGZldGNoLWVycm9yLmpzXG4gKlxuICogRmV0Y2hFcnJvciBpbnRlcmZhY2UgZm9yIG9wZXJhdGlvbmFsIGVycm9yc1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gRmV0Y2hFcnJvcjtcblxuLyoqXG4gKiBDcmVhdGUgRmV0Y2hFcnJvciBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIG1lc3NhZ2UgICAgICBFcnJvciBtZXNzYWdlIGZvciBodW1hblxuICogQHBhcmFtICAgU3RyaW5nICAgICAgdHlwZSAgICAgICAgIEVycm9yIHR5cGUgZm9yIG1hY2hpbmVcbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIHN5c3RlbUVycm9yICBGb3IgTm9kZS5qcyBzeXN0ZW0gZXJyb3JcbiAqIEByZXR1cm4gIEZldGNoRXJyb3JcbiAqL1xuZnVuY3Rpb24gRmV0Y2hFcnJvcihtZXNzYWdlLCB0eXBlLCBzeXN0ZW1FcnJvcikge1xuXG5cdC8vIGhpZGUgY3VzdG9tIGVycm9yIGltcGxlbWVudGF0aW9uIGRldGFpbHMgZnJvbSBlbmQtdXNlcnNcblx0RXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cblx0dGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXG5cdC8vIHdoZW4gZXJyLnR5cGUgaXMgYHN5c3RlbWAsIGVyci5jb2RlIGNvbnRhaW5zIHN5c3RlbSBlcnJvciBjb2RlXG5cdGlmIChzeXN0ZW1FcnJvcikge1xuXHRcdHRoaXMuY29kZSA9IHRoaXMuZXJybm8gPSBzeXN0ZW1FcnJvci5jb2RlO1xuXHR9XG5cbn1cblxucmVxdWlyZSgndXRpbCcpLmluaGVyaXRzKEZldGNoRXJyb3IsIEVycm9yKTtcbiIsIlxuLyoqXG4gKiBoZWFkZXJzLmpzXG4gKlxuICogSGVhZGVycyBjbGFzcyBvZmZlcnMgY29udmVuaWVudCBoZWxwZXJzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBIZWFkZXJzO1xuXG4vKipcbiAqIEhlYWRlcnMgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBPYmplY3QgIGhlYWRlcnMgIFJlc3BvbnNlIGhlYWRlcnNcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG5cblx0dmFyIHNlbGYgPSB0aGlzO1xuXHR0aGlzLl9oZWFkZXJzID0ge307XG5cblx0Ly8gSGVhZGVyc1xuXHRpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcblx0XHRoZWFkZXJzID0gaGVhZGVycy5yYXcoKTtcblx0fVxuXG5cdC8vIHBsYWluIG9iamVjdFxuXHRmb3IgKHZhciBwcm9wIGluIGhlYWRlcnMpIHtcblx0XHRpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgaGVhZGVyc1twcm9wXSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdHRoaXMuc2V0KHByb3AsIGhlYWRlcnNbcHJvcF0pO1xuXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgaGVhZGVyc1twcm9wXSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKGhlYWRlcnNbcHJvcF0pKSB7XG5cdFx0XHR0aGlzLnNldChwcm9wLCBoZWFkZXJzW3Byb3BdLnRvU3RyaW5nKCkpO1xuXG5cdFx0fSBlbHNlIGlmIChoZWFkZXJzW3Byb3BdIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdGhlYWRlcnNbcHJvcF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHNlbGYuYXBwZW5kKHByb3AsIGl0ZW0udG9TdHJpbmcoKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxufVxuXG4vKipcbiAqIFJldHVybiBmaXJzdCBoZWFkZXIgdmFsdWUgZ2l2ZW4gbmFtZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAqIEByZXR1cm4gIE1peGVkXG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0dmFyIGxpc3QgPSB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV07XG5cdHJldHVybiBsaXN0ID8gbGlzdFswXSA6IG51bGw7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbGwgaGVhZGVyIHZhbHVlcyBnaXZlbiBuYW1lXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICBuYW1lICBIZWFkZXIgbmFtZVxuICogQHJldHVybiAgQXJyYXlcbiAqL1xuSGVhZGVycy5wcm90b3R5cGUuZ2V0QWxsID0gZnVuY3Rpb24obmFtZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogSXRlcmF0ZSBvdmVyIGFsbCBoZWFkZXJzXG4gKlxuICogQHBhcmFtICAgRnVuY3Rpb24gIGNhbGxiYWNrICBFeGVjdXRlZCBmb3IgZWFjaCBpdGVtIHdpdGggcGFyYW1ldGVycyAodmFsdWUsIG5hbWUsIHRoaXNBcmcpXG4gKiBAcGFyYW0gICBCb29sZWFuICAgdGhpc0FyZyAgIGB0aGlzYCBjb250ZXh0IGZvciBjYWxsYmFjayBmdW5jdGlvblxuICogQHJldHVybiAgVm9pZFxuICovXG5IZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcblx0T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5faGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG5cdFx0dGhpcy5faGVhZGVyc1tuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKVxuXHRcdH0sIHRoaXMpXG5cdH0sIHRoaXMpXG59XG5cbi8qKlxuICogT3ZlcndyaXRlIGhlYWRlciB2YWx1ZXMgZ2l2ZW4gbmFtZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgIEhlYWRlciBuYW1lXG4gKiBAcGFyYW0gICBTdHJpbmcgIHZhbHVlICBIZWFkZXIgdmFsdWVcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblx0dGhpcy5faGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gW3ZhbHVlXTtcbn07XG5cbi8qKlxuICogQXBwZW5kIGEgdmFsdWUgb250byBleGlzdGluZyBoZWFkZXJcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgICBIZWFkZXIgbmFtZVxuICogQHBhcmFtICAgU3RyaW5nICB2YWx1ZSAgSGVhZGVyIHZhbHVlXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdGlmICghdGhpcy5oYXMobmFtZSkpIHtcblx0XHR0aGlzLnNldChuYW1lLCB2YWx1ZSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5faGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldLnB1c2godmFsdWUpO1xufTtcblxuLyoqXG4gKiBDaGVjayBmb3IgaGVhZGVyIG5hbWUgZXhpc3RlbmNlXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICAgbmFtZSAgSGVhZGVyIG5hbWVcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuXHRyZXR1cm4gdGhpcy5faGVhZGVycy5oYXNPd25Qcm9wZXJ0eShuYW1lLnRvTG93ZXJDYXNlKCkpO1xufTtcblxuLyoqXG4gKiBEZWxldGUgYWxsIGhlYWRlciB2YWx1ZXMgZ2l2ZW4gbmFtZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuXHRkZWxldGUgdGhpcy5faGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gcmF3IGhlYWRlcnMgKG5vbi1zcGVjIGFwaSlcbiAqXG4gKiBAcmV0dXJuICBPYmplY3RcbiAqL1xuSGVhZGVycy5wcm90b3R5cGUucmF3ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9oZWFkZXJzO1xufTtcbiIsIlxuLyoqXG4gKiByZXF1ZXN0LmpzXG4gKlxuICogUmVxdWVzdCBjbGFzcyBjb250YWlucyBzZXJ2ZXIgb25seSBvcHRpb25zXG4gKi9cblxudmFyIHBhcnNlX3VybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlO1xudmFyIEhlYWRlcnMgPSByZXF1aXJlKCcuL2hlYWRlcnMnKTtcbnZhciBCb2R5ID0gcmVxdWlyZSgnLi9ib2R5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdDtcblxuLyoqXG4gKiBSZXF1ZXN0IGNsYXNzXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgICBpbnB1dCAgVXJsIG9yIFJlcXVlc3QgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIE9iamVjdCAgaW5pdCAgIEN1c3RvbSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIGluaXQpIHtcblx0dmFyIHVybCwgdXJsX3BhcnNlZDtcblxuXHQvLyBub3JtYWxpemUgaW5wdXRcblx0aWYgKCEoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSkge1xuXHRcdHVybCA9IGlucHV0O1xuXHRcdHVybF9wYXJzZWQgPSBwYXJzZV91cmwodXJsKTtcblx0XHRpbnB1dCA9IHt9O1xuXHR9IGVsc2Uge1xuXHRcdHVybCA9IGlucHV0LnVybDtcblx0XHR1cmxfcGFyc2VkID0gcGFyc2VfdXJsKHVybCk7XG5cdH1cblxuXHQvLyBub3JtYWxpemUgaW5pdFxuXHRpbml0ID0gaW5pdCB8fCB7fTtcblxuXHQvLyBmZXRjaCBzcGVjIG9wdGlvbnNcblx0dGhpcy5tZXRob2QgPSBpbml0Lm1ldGhvZCB8fCBpbnB1dC5tZXRob2QgfHwgJ0dFVCc7XG5cdHRoaXMucmVkaXJlY3QgPSBpbml0LnJlZGlyZWN0IHx8IGlucHV0LnJlZGlyZWN0IHx8ICdmb2xsb3cnO1xuXHR0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbml0LmhlYWRlcnMgfHwgaW5wdXQuaGVhZGVycyB8fCB7fSk7XG5cdHRoaXMudXJsID0gdXJsO1xuXG5cdC8vIHNlcnZlciBvbmx5IG9wdGlvbnNcblx0dGhpcy5mb2xsb3cgPSBpbml0LmZvbGxvdyAhPT0gdW5kZWZpbmVkID9cblx0XHRpbml0LmZvbGxvdyA6IGlucHV0LmZvbGxvdyAhPT0gdW5kZWZpbmVkID9cblx0XHRpbnB1dC5mb2xsb3cgOiAyMDtcblx0dGhpcy5jb21wcmVzcyA9IGluaXQuY29tcHJlc3MgIT09IHVuZGVmaW5lZCA/XG5cdFx0aW5pdC5jb21wcmVzcyA6IGlucHV0LmNvbXByZXNzICE9PSB1bmRlZmluZWQgP1xuXHRcdGlucHV0LmNvbXByZXNzIDogdHJ1ZTtcblx0dGhpcy5jb3VudGVyID0gaW5pdC5jb3VudGVyIHx8IGlucHV0LmNvdW50ZXIgfHwgMDtcblx0dGhpcy5hZ2VudCA9IGluaXQuYWdlbnQgfHwgaW5wdXQuYWdlbnQ7XG5cblx0Qm9keS5jYWxsKHRoaXMsIGluaXQuYm9keSB8fCB0aGlzLl9jbG9uZShpbnB1dCksIHtcblx0XHR0aW1lb3V0OiBpbml0LnRpbWVvdXQgfHwgaW5wdXQudGltZW91dCB8fCAwLFxuXHRcdHNpemU6IGluaXQuc2l6ZSB8fCBpbnB1dC5zaXplIHx8IDBcblx0fSk7XG5cblx0Ly8gc2VydmVyIHJlcXVlc3Qgb3B0aW9uc1xuXHR0aGlzLnByb3RvY29sID0gdXJsX3BhcnNlZC5wcm90b2NvbDtcblx0dGhpcy5ob3N0bmFtZSA9IHVybF9wYXJzZWQuaG9zdG5hbWU7XG5cdHRoaXMucG9ydCA9IHVybF9wYXJzZWQucG9ydDtcblx0dGhpcy5wYXRoID0gdXJsX3BhcnNlZC5wYXRoO1xuXHR0aGlzLmF1dGggPSB1cmxfcGFyc2VkLmF1dGg7XG59XG5cblJlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCb2R5LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQ2xvbmUgdGhpcyByZXF1ZXN0XG4gKlxuICogQHJldHVybiAgUmVxdWVzdFxuICovXG5SZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFJlcXVlc3QodGhpcyk7XG59O1xuIiwiXG4vKipcbiAqIHJlc3BvbnNlLmpzXG4gKlxuICogUmVzcG9uc2UgY2xhc3MgcHJvdmlkZXMgY29udGVudCBkZWNvZGluZ1xuICovXG5cbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIEhlYWRlcnMgPSByZXF1aXJlKCcuL2hlYWRlcnMnKTtcbnZhciBCb2R5ID0gcmVxdWlyZSgnLi9ib2R5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2U7XG5cbi8qKlxuICogUmVzcG9uc2UgY2xhc3NcbiAqXG4gKiBAcGFyYW0gICBTdHJlYW0gIGJvZHkgIFJlYWRhYmxlIHN0cmVhbVxuICogQHBhcmFtICAgT2JqZWN0ICBvcHRzICBSZXNwb25zZSBvcHRpb25zXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmZ1bmN0aW9uIFJlc3BvbnNlKGJvZHksIG9wdHMpIHtcblxuXHRvcHRzID0gb3B0cyB8fCB7fTtcblxuXHR0aGlzLnVybCA9IG9wdHMudXJsO1xuXHR0aGlzLnN0YXR1cyA9IG9wdHMuc3RhdHVzIHx8IDIwMDtcblx0dGhpcy5zdGF0dXNUZXh0ID0gb3B0cy5zdGF0dXNUZXh0IHx8IGh0dHAuU1RBVFVTX0NPREVTW3RoaXMuc3RhdHVzXTtcblx0dGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0cy5oZWFkZXJzKTtcblx0dGhpcy5vayA9IHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMDtcblxuXHRCb2R5LmNhbGwodGhpcywgYm9keSwgb3B0cyk7XG5cbn1cblxuUmVzcG9uc2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCb2R5LnByb3RvdHlwZSk7XG5cbi8qKlxuICogQ2xvbmUgdGhpcyByZXNwb25zZVxuICpcbiAqIEByZXR1cm4gIFJlc3BvbnNlXG4gKi9cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2Nsb25lKHRoaXMpLCB7XG5cdFx0dXJsOiB0aGlzLnVybFxuXHRcdCwgc3RhdHVzOiB0aGlzLnN0YXR1c1xuXHRcdCwgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0XG5cdFx0LCBoZWFkZXJzOiB0aGlzLmhlYWRlcnNcblx0XHQsIG9rOiB0aGlzLm9rXG5cdH0pO1xufTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3RyaWN0VXJpRW5jb2RlID0gcmVxdWlyZSgnc3RyaWN0LXVyaS1lbmNvZGUnKTtcbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRzKSB7XG5cdHN3aXRjaCAob3B0cy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgaW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSBudWxsID8gW1xuXHRcdFx0XHRcdGVuY29kZShrZXksIG9wdHMpLFxuXHRcdFx0XHRcdCdbJyxcblx0XHRcdFx0XHRpbmRleCxcblx0XHRcdFx0XHQnXSdcblx0XHRcdFx0XS5qb2luKCcnKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnWycsXG5cdFx0XHRcdFx0ZW5jb2RlKGluZGV4LCBvcHRzKSxcblx0XHRcdFx0XHQnXT0nLFxuXHRcdFx0XHRcdGVuY29kZSh2YWx1ZSwgb3B0cylcblx0XHRcdFx0XS5qb2luKCcnKTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdicmFja2V0Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT09IG51bGwgPyBlbmNvZGUoa2V5LCBvcHRzKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnW109Jyxcblx0XHRcdFx0XHRlbmNvZGUodmFsdWUsIG9wdHMpXG5cdFx0XHRcdF0uam9pbignJyk7XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRyZXR1cm4gdmFsdWUgPT09IG51bGwgPyBlbmNvZGUoa2V5LCBvcHRzKSA6IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnPScsXG5cdFx0XHRcdFx0ZW5jb2RlKHZhbHVlLCBvcHRzKVxuXHRcdFx0XHRdLmpvaW4oJycpO1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZXJGb3JBcnJheUZvcm1hdChvcHRzKSB7XG5cdHZhciByZXN1bHQ7XG5cblx0c3dpdGNoIChvcHRzLmFycmF5Rm9ybWF0KSB7XG5cdFx0Y2FzZSAnaW5kZXgnOlxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikge1xuXHRcdFx0XHRyZXN1bHQgPSAvXFxbKFxcZCopXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKl0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0ge307XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldW3Jlc3VsdFsxXV0gPSB2YWx1ZTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdicmFja2V0Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpIHtcblx0XHRcdFx0cmVzdWx0ID0gLyhcXFtdKSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQgfHwgYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbXS5jb25jYXQoYWNjdW11bGF0b3Jba2V5XSwgdmFsdWUpO1xuXHRcdFx0fTtcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSB7XG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IFtdLmNvbmNhdChhY2N1bXVsYXRvcltrZXldLCB2YWx1ZSk7XG5cdFx0XHR9O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWx1ZSwgb3B0cykge1xuXHRpZiAob3B0cy5lbmNvZGUpIHtcblx0XHRyZXR1cm4gb3B0cy5zdHJpY3QgPyBzdHJpY3RVcmlFbmNvZGUodmFsdWUpIDogZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcblx0fVxuXG5cdHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24ga2V5c1NvcnRlcihpbnB1dCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRyZXR1cm4gaW5wdXQuc29ydCgpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcblx0XHRyZXR1cm4ga2V5c1NvcnRlcihPYmplY3Qua2V5cyhpbnB1dCkpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdHJldHVybiBOdW1iZXIoYSkgLSBOdW1iZXIoYik7XG5cdFx0fSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBpbnB1dFtrZXldO1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5leHBvcnRzLmV4dHJhY3QgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiBzdHIuc3BsaXQoJz8nKVsxXSB8fCAnJztcbn07XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoc3RyLCBvcHRzKSB7XG5cdG9wdHMgPSBvYmplY3RBc3NpZ24oe2FycmF5Rm9ybWF0OiAnbm9uZSd9LCBvcHRzKTtcblxuXHR2YXIgZm9ybWF0dGVyID0gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0cyk7XG5cblx0Ly8gQ3JlYXRlIGFuIG9iamVjdCB3aXRoIG5vIHByb3RvdHlwZVxuXHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9pc3N1ZXMvNDdcblx0dmFyIHJldCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cblx0aWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHN0ciA9IHN0ci50cmltKCkucmVwbGFjZSgvXihcXD98I3wmKS8sICcnKTtcblxuXHRpZiAoIXN0cikge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzdHIuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbSkge1xuXHRcdHZhciBwYXJ0cyA9IHBhcmFtLnJlcGxhY2UoL1xcKy9nLCAnICcpLnNwbGl0KCc9Jyk7XG5cdFx0Ly8gRmlyZWZveCAocHJlIDQwKSBkZWNvZGVzIGAlM0RgIHRvIGA9YFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL3B1bGwvMzdcblx0XHR2YXIga2V5ID0gcGFydHMuc2hpZnQoKTtcblx0XHR2YXIgdmFsID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzLmpvaW4oJz0nKSA6IHVuZGVmaW5lZDtcblxuXHRcdC8vIG1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbCA9IHZhbCA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGRlY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuXG5cdFx0Zm9ybWF0dGVyKGRlY29kZVVSSUNvbXBvbmVudChrZXkpLCB2YWwsIHJldCk7XG5cdH0pO1xuXG5cdHJldHVybiBPYmplY3Qua2V5cyhyZXQpLnNvcnQoKS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwga2V5KSB7XG5cdFx0dmFyIHZhbCA9IHJldFtrZXldO1xuXHRcdGlmIChCb29sZWFuKHZhbCkgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsKSkge1xuXHRcdFx0Ly8gU29ydCBvYmplY3Qga2V5cywgbm90IHZhbHVlc1xuXHRcdFx0cmVzdWx0W2tleV0gPSBrZXlzU29ydGVyKHZhbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdFtrZXldID0gdmFsO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiAob2JqLCBvcHRzKSB7XG5cdHZhciBkZWZhdWx0cyA9IHtcblx0XHRlbmNvZGU6IHRydWUsXG5cdFx0c3RyaWN0OiB0cnVlLFxuXHRcdGFycmF5Rm9ybWF0OiAnbm9uZSdcblx0fTtcblxuXHRvcHRzID0gb2JqZWN0QXNzaWduKGRlZmF1bHRzLCBvcHRzKTtcblxuXHR2YXIgZm9ybWF0dGVyID0gZW5jb2RlckZvckFycmF5Rm9ybWF0KG9wdHMpO1xuXG5cdHJldHVybiBvYmogPyBPYmplY3Qua2V5cyhvYmopLnNvcnQoKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuXHRcdHZhciB2YWwgPSBvYmpba2V5XTtcblxuXHRcdGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH1cblxuXHRcdGlmICh2YWwgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBlbmNvZGUoa2V5LCBvcHRzKTtcblx0XHR9XG5cblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRcdHZhbC5zbGljZSgpLmZvckVhY2goZnVuY3Rpb24gKHZhbDIpIHtcblx0XHRcdFx0aWYgKHZhbDIgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdC5wdXNoKGZvcm1hdHRlcihrZXksIHZhbDIsIHJlc3VsdC5sZW5ndGgpKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oJyYnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0cykgKyAnPScgKyBlbmNvZGUodmFsLCBvcHRzKTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG5cdFx0cmV0dXJuIHgubGVuZ3RoID4gMDtcblx0fSkuam9pbignJicpIDogJyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG5cdHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKSpdL2csIGZ1bmN0aW9uIChjKSB7XG5cdFx0cmV0dXJuICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0fSk7XG59O1xuIiwiaW1wb3J0IHtQcm9taXNlfSBmcm9tICdlczYtcHJvbWlzZSc7XG5pbXBvcnQge2ZldGNoUmVxdWVzdH0gZnJvbSAnLi9wcml2YXRlL2ZldGNoUmVxdWVzdC5qcyc7XG5cbmltcG9ydCBpc09iamVjdCBmcm9tICdsb2Rhc2gvaXNPYmplY3QnO1xuXG4vKipcbiAqIEZldGNoZXMgYW4gYXJyYXkgb2YgZGF0YXNvdXJjZXMgZnJvbSBQQy5cbiAqIEBtb2R1bGUgZGF0YVNvdXJjZXNcbiAqL1xuY2xhc3MgZGF0YVNvdXJjZXMgZXh0ZW5kcyBmZXRjaFJlcXVlc3Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICB1c2VyOiBcInBjMnBhdGh3YXlzXCJcbiAgICB9KTtcbiAgICB0aGlzLmNvbW1hbmQgPSBcIm1ldGFkYXRhL2RhdGFzb3VyY2VzXCI7XG4gICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmV0Y2goKTtcblxuICAgIC8vIFByaXZhdGUgZnVuY3Rpb25zXG4gICAgdGhpcy5wcm9taXNpZnlEYXRhID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIHJlc29sdmUodGhpcy5kYXRhKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAqIFB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWdldCBkYXRhIHNvdXJjZXMuXG4gICogQGZ1bmN0aW9uIC0gZmV0Y2hcbiAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHN1cGVyLmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgICByZXNwb25zZVxuICAgICAgICAgIC5maWx0ZXIoc291cmNlID0+IHNvdXJjZS5ub3RQYXRod2F5RGF0YSA9PSBmYWxzZSlcbiAgICAgICAgICAubWFwKChkcykgPT4ge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAoZHMubmFtZS5sZW5ndGggPiAxKSA/IGRzLm5hbWVbMV0gOiBkcy5uYW1lWzBdO1xuICAgICAgICAgICAgb3V0cHV0W2RzLnVyaV0gPSB7XG4gICAgICAgICAgICAgIGlkOiBkcy5pZGVudGlmaWVyLFxuICAgICAgICAgICAgICB1cmk6IGRzLnVyaSxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICB0eXBlOiBkcy50eXBlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRhdGEgPSBvdXRwdXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGEgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm5zIGFycmF5IG9mIGRhdGEgc291cmNlcyBmcm9tIFBDLiBDYWNoZXMgYXJyYXkgZm9yIHVzZSBpbiBsYXRlciBjYWxscy5cbiAgKiBAZnVuY3Rpb24gLSBnZXRcbiAgKiBAcmV0dXJucyB7UHJvbWlzZTxhcnJheT58UHJvbWlzZTxib29sZWFuPn0gLSBSZXR1cm5zIHByb21pc2UgY29udGFpbmluZyBlaXRoZXIgdGhlIGRhdGEgc291cmNlIGFycmF5IG9yIGZhbHNlIGlmIG5vdCBkYXRhIHNvdXJjZSBub3QgYXZhaWxhYmxlXG4gICovXG4gIGdldChjYWxsYmFjaykge1xuICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnByb21pc2lmeURhdGEoKS50aGVuKCgpID0+IGNhbGxiYWNrKHRoaXMuZGF0YSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9taXNpZnlEYXRhKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IGRhdGFTb3VyY2VzKCk7XG4iLCJpbXBvcnQge1Byb21pc2V9IGZyb20gJ2VzNi1wcm9taXNlJztcbmltcG9ydCB7ZmV0Y2hSZXF1ZXN0fSBmcm9tICcuL3ByaXZhdGUvZmV0Y2hSZXF1ZXN0LmpzJztcbmltcG9ydCB7X2J1aWxkVW5pcHJvdFVyaX0gZnJvbSAnLi9wcml2YXRlL2hlbHBlcnMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgR0VUIHdlYiBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKi9cbmNsYXNzIGdldCBleHRlbmRzIGZldGNoUmVxdWVzdCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBnZXQgYW5kIHNldHMgcXVlcnkgb2JqZWN0IGlmIG9uZSBpcyBwcm92aWRlZC4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtvYmplY3R9IFtxdWVyeU9iamVjdF0gLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IocXVlcnlPYmplY3QpIHtcbiAgICBzdXBlcihxdWVyeU9iamVjdCk7XG4gICAgdGhpcy5jb21tYW5kID0gXCJnZXRcIjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVyaSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBnZXQgcmVxdWVzdFxuICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnlPYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHVyaSh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoXCJ1cmlcIiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB1c2luZyB0aGUgdW5pcHJvdCBJRFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1bmlwcm90KHVuaXByb3RJZCkge1xuICAgIHJldHVybiB0aGlzLnVyaShfYnVpbGRVbmlwcm90VXJpKHVuaXByb3RJZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGdldCBhbmQgc2V0cyBxdWVyeSBvYmplY3QgaWYgb25lIGlzIHByb3ZpZGVkXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD58UHJvbWlzZTxib29sZWFuPn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqXG4gICAqL1xuICAvKiogSW5pdGlhbGlzZXMgZ2V0IGFuZCBzZXRzIHF1ZXJ5IG9iamVjdCBpZiBvbmUgaXMgcHJvdmlkZWRcbiAgICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IFtjYWxsYmFja10gLSBUZXJtaW5hdGluZyBjYWxsYmFjaywgc2VlIGJlbG93IGZvciBhcmd1bWVudHNcbiAgICogQHJldHVybiB7dGhpc31cbiAgICovXG4gIGZldGNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHN1cGVyLmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWxsYmFjayBmb3IgZ2V0IGZ1bmN0aW9uLCB3aGljaCBpcyBhbHdheXMgY2FsbGVkIG9uIGNvbXBsZXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQGNhbGxiYWNrIGdldH5yZXF1ZXN0Q2FsbGJhY2tcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fGJvb2xlYW59IHJlc3BvbnNlIC0gUmVzcG9uc2UgdGV4dCBvciBvYmplY3QgcmV0dXJuZWQgZnJvbSBQQyBpZiBhdmFpbGFibGUuIE90aGVyd2lzZSBpZiBubyByZXNwb25zZSByZXR1cm5lZCwgcmV0dXJucyBmYWxzZS4gSWYgdGhlcmUgd2FzIGEgbmV0d29yayBmYWlsdXJlLCBudWxsIHJldHVybmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsIi8qKlxuICogQGZpbGVPdmVydmlldyBQYXRod2F5IENvbW1vbnMgQWNjZXNzIExpYnJhcnkgSW5kZXhcbiAqIEBhdXRob3IgTWFuZnJlZCBDaGV1bmdcbiAqIEB2ZXJzaW9uOiAwLjFcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0OiByZXF1aXJlKCcuL2dldC5qcycpLFxuXHRkYXRhU291cmNlczogcmVxdWlyZSgnLi9kYXRhU291cmNlcy5qcycpLFxuXHRsb2dvVXJsOiByZXF1aXJlKCcuL2xvZ29VcmwuanMnKSxcblx0c2VhcmNoOiByZXF1aXJlKCcuL3NlYXJjaC5qcycpLFxuXHR0cmF2ZXJzZTogcmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpXG59O1xuIiwiLyoqXG4gKiBGZXRjaGVzIHRoZSBsb2dvIGZvciB0aGUgZGF0YXNvdXJjZSB1c2luZyBlaXRoZXIgZGF0YXNvdXJjZXMgVVJJIG9yIG5hbWUuIEludGVuZGVkIHRvIGJlIHVzZWQgdG8gZ2VuZXJhdGUgaW1hZ2UgdGFncy5cbiAqIEBtb2R1bGUgbG9nb1VybFxuICogQHBhcmFtIHtzdHJpbmd9IGxvZ29JZGVudGlmaWVyIC0gRWl0aGVyIFVSSSBvciBuYW1lIG9mIHRoZSBkYXRhIHNvdXJjZVxuICogQHJldHVybiB7c3RyaW5nfSBsb2dvVXJsIC0gVVJMIG9mIGRhdGFzb3VyY2UgaW4gcXVlc3Rpb24sIGVsc2UgZW1wdHkgc3RyaW5nXG4gKi9cbmNvbnN0IGxvZ29VcmwgPSAoZHNVcmlPck5hbWUpID0+IHtcblx0cmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9nb1VybDtcbiIsImltcG9ydCB7UHJvbWlzZX0gZnJvbSAnZXM2LXByb21pc2UnO1xucmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xuXG5pbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2gvaXNBcnJheSc7XG5pbXBvcnQgaXNFbXB0eSBmcm9tICdsb2Rhc2gvaXNFbXB0eSc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnbG9kYXNoL2lzT2JqZWN0JztcbmltcG9ydCB7c3RyaW5naWZ5IGFzIHF1ZXJ5U3RyaW5naWZ5fSBmcm9tICdxdWVyeS1zdHJpbmcnO1xuXG5pbXBvcnQge19wYXJzZVVua25vd25TdHJpbmd9IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbmZldGNoLlByb21pc2UgPSBQcm9taXNlO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciB1c2UgaW4gZmV0Y2ggcmVxdWVzdHMsIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG9uIGl0cyBvd25cbiAqL1xuZXhwb3J0IGNsYXNzIGZldGNoUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5wY1VybCA9IFwiaHR0cDovL3d3dy5wYXRod2F5Y29tbW9ucy5vcmcvcGMyL1wiO1xuICAgIHRoaXMuY29tbWFuZCA9IFwiVE9fQkVfUkVQTEFDRURcIjtcbiAgICB0aGlzLnJlc3BvbnNlVGV4dCA9IFwiXCI7XG4gICAgdGhpcy5xdWVyeU9iamVjdCA9IHt9O1xuICAgIGlmIChxdWVyeU9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0gcXVlcnlPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucXVlcnlPYmplY3QgPSBxdWVyeU9iamVjdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwYXJhbWV0ZXIsIHZhbHVlKSB7XG4gICAgcGFyYW1ldGVyID0gU3RyaW5nKHBhcmFtZXRlcik7XG4gICAgaWYgKHBhcmFtZXRlciAhPT0gXCJcIikge1xuICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IChpc0FycmF5KHZhbHVlKSAmJiAhaXNFbXB0eSh2YWx1ZSkpKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlKHBhcmFtZXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5T2JqZWN0W3BhcmFtZXRlcl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGV0ZShwYXJhbWV0ZXIpIHtcbiAgICBkZWxldGUgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdO1xuICB9XG5cbiAgZmV0Y2goKSB7XG4gICAgdmFyIGZldGNoUHJvbWlzZSA9IGZldGNoKHRoaXMucGNVcmwgKyB0aGlzLmNvbW1hbmQgKyBcIj9cIiArIHF1ZXJ5U3RyaW5naWZ5KHRoaXMucXVlcnlPYmplY3QpKTtcbiAgICB2YXIgcmVzcG9uc2VDb2RlID0gZmV0Y2hQcm9taXNlLnRoZW4oKHJlc3BvbnNlT2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2VPYmplY3Q7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVzcG9uc2VUZXh0ID0gZmV0Y2hQcm9taXNlLnRoZW4oKHJlc3BvbnNlT2JqZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZU9iamVjdC50ZXh0KCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlU3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VUZXh0ID0gcmVzcG9uc2VTdHJpbmc7XG4gICAgICAgIHJldHVybiByZXNwb25zZVN0cmluZztcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtyZXNwb25zZUNvZGUsIHJlc3BvbnNlVGV4dF0pLnRoZW4oKHByb21pc2VBcnJheSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb21pc2VBcnJheVswXS5zdGF0dXMpIHtcbiAgICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAgIHJldHVybiBfcGFyc2VVbmtub3duU3RyaW5nKHByb21pc2VBcnJheVsxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGpzb25TdHJpbmdcbiAqIEByZXR1cm4ge29iamVjdHxzdHJpbmd9IGpzb25PYmplY3QgLSBJZiB2YWxpZCBKU09OIHBhcnNlIGFzIEpTT04gb3RoZXJ3aXNlIHJldHVybiBvcmlnaW5hbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IF9wYXJzZVVua25vd25TdHJpbmcgPSAoc3RyaW5nKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaW5nKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHVuaXByb3RJZFxuICogQHJldHVybiB7c3RyaW5nfSB1bmlwcm90VXJpXG4gKi9cbmV4cG9ydCBjb25zdCBfYnVpbGRVbmlwcm90VXJpID0gKHVuaXByb2RJZCkgPT4ge1xuICByZXR1cm4gXCJodHRwOi8vaWRlbnRpZmllcnMub3JnL3VuaXByb3QvXCIgKyB1bmlwcm9kSWQ7XG59XG4iLCIvKipcbiAqIFBlZm9ybXMgYSBTRUFSQ0ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBtb2R1bGUgc2VhcmNoXG4gKiBAcGFyYW0ge29iamVjdH0gcXVlcnlfb2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHNlYXJjaCBjb21tYW5kLlxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gVGVybWluYXRpbmcgY2FsbGJhY2ssIHNlZSBiZWxvdyBmb3IgYXJndW1lbnRzLlxuICovXG5jb25zdCBzZWFyY2ggPSAocXVlcnlfb2JqZWN0LCBjYWxsYmFjaykgPT4ge1xuXHQvKipcblx0KiBDYWxsYmFjayBmb3Igc2VhcmNoIGZ1bmN0aW9uLCB3aGljaCBpcyBhbHdheXMgY2FsbGVkIG9uIGNvbXBsZXRpb25cblx0KlxuXHQqIEBjYWxsYmFjayByZXF1ZXN0Q2FsbGJhY2tcblx0KiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2VTdGF0dXMgLSBBIHN0cmluZyB3aGljaCBpbmRpY2F0ZXMgZmFpbHVyZSwgbm8gcmVzdWx0cyByZXR1cm5lZCwgb3Igc3VjY2Vzcy5cblx0KiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2VPYmplY3QgLSBBIHBhcnNlZCBKU09OIG9iamVjdCByZXR1cm5lZCBmcm9tIFBDIGlmIGF2YWlsYWJsZSwgZWxzZSBlbXB0eSBvYmplY3QuIFJlc3VsdCBmcm9tIHNlYXJjaCBpcyBhc3N1bWVkIHRvIGJlIGluIEpTT04gZm9ybWF0LlxuXHQqL1xuXHRjYWxsYmFjayhyZXNwb25zZVN0YXR1cywgcmVzcG9uc2VPYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzZWFyY2g7XG4iLCIvKipcbiAqIFBlZm9ybXMgYSBTRUFSQ0ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBtb2R1bGUgdHJhdmVyc2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeV9vYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgdHJhdmVyc2UgY29tbWFuZC5cbiAqIEBwYXJhbSB7cmVxdWVzdENhbGxiYWNrfSBjYWxsYmFjayAtIFRlcm1pbmF0aW5nIGNhbGxiYWNrLCBzZWUgYmVsb3cgZm9yIGFyZ3VtZW50cy5cbiAqL1xuY29uc3QgdHJhdmVyc2UgPSAocXVlcnlfYXJyYXksIGNhbGxiYWNrKSA9PiB7XG5cdC8qKlxuXHQqIENhbGxiYWNrIGZvciB0cmF2ZXJzZSBmdW5jdGlvbiwgd2hpY2ggaXMgYWx3YXlzIGNhbGxlZCBvbiBjb21wbGV0aW9uXG5cdCpcblx0KiBAY2FsbGJhY2sgcmVxdWVzdENhbGxiYWNrXG5cdCogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlU3RhdHVzIC0gQSBzdHJpbmcgd2hpY2ggaW5kaWNhdGVzIGZhaWx1cmUsIG5vIHJlc3VsdHMgcmV0dXJuZWQsIG9yIHN1Y2Nlc3MuXG5cdCogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlT2JqZWN0IC0gQSBwYXJzZWQgSlNPTiBvYmplY3QgcmV0dXJuZWQgZnJvbSBQQyBpZiBhdmFpbGFibGUsIGVsc2UgZW1wdHkgb2JqZWN0LiBSZXN1bHQgZnJvbSB0cmF2ZXJzZSBpcyBhc3N1bWVkIHRvIGJlIGluIEpTT04gZm9ybWF0LlxuXHQqL1xuXHRjYWxsYmFjayhyZXNwb25zZVN0YXR1cywgcmVzcG9uc2VPYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmF2ZXJzZTtcbiJdfQ==
