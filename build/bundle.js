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
    * Calls this.fetch if cache is not available and uses cached data if it is. Returns Promise with data in both cases. Note: While this function is meant to be private there is no way of enforcing it using ES6 JS.
    * @private
    * @function - _promisifyData
    * @returns {Promise}
    */

  }, {
    key: '_promisifyData',
    value: function _promisifyData() {
      var _this3 = this;

      if (this.data !== undefined) {
        return new _es6Promise.Promise(function (resolve) {
          resolve(_this3.data);
        });
      } else {
        return this.fetch().then(function () {
          return _this3.data;
        });
      }
    }

    /**
    * Returns array of data sources from PC. Caches array for use in later calls.
    * @function - get
    * @returns {Promise<array>|Promise<boolean>} - Returns promise containing either the data source array or false if not data source not available
    */

  }, {
    key: 'get',
    value: function get(callback) {
      var _this4 = this;

      if (callback !== undefined) {
        this._promisifyData().then(function () {
          return callback(_this4.data);
        });
      } else {
        return this._promisifyData();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZW5jb2RpbmcvbGliL2VuY29kaW5nLmpzIiwibm9kZV9tb2R1bGVzL2VuY29kaW5nL2xpYi9pY29udi1sb2FkZXIuanMiLCJub2RlX21vZHVsZXMvZXM2LXByb21pc2UvZGlzdC9lczYtcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9kYmNzLWNvZGVjLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL2RiY3MtZGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9pY29udi1saXRlL2VuY29kaW5ncy9zYmNzLWNvZGVjLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3NiY3MtZGF0YS1nZW5lcmF0ZWQuanMiLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3Mvc2Jjcy1kYXRhLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3RhYmxlcy9iaWc1LWFkZGVkLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTM2Lmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTQ5Lmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2NwOTUwLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2V1Y2pwLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2diMTgwMzAtcmFuZ2VzLmpzb24iLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9lbmNvZGluZ3MvdGFibGVzL2diay1hZGRlZC5qc29uIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3RhYmxlcy9zaGlmdGppcy5qc29uIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3V0ZjE2LmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvZW5jb2RpbmdzL3V0ZjcuanMiLCJub2RlX21vZHVsZXMvaWNvbnYtbGl0ZS9saWIvYm9tLWhhbmRsaW5nLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL2V4dGVuZC1ub2RlLmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ljb252LWxpdGUvbGliL3N0cmVhbXMuanMiLCJub2RlX21vZHVsZXMvaXMtc3RyZWFtL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzb21vcnBoaWMtZmV0Y2gvZmV0Y2gtbnBtLW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2xpYi9ib2R5LmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvbGliL2ZldGNoLWVycm9yLmpzIiwibm9kZV9tb2R1bGVzL25vZGUtZmV0Y2gvbGliL2hlYWRlcnMuanMiLCJub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9saWIvcmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLWZldGNoL2xpYi9yZXNwb25zZS5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3F1ZXJ5LXN0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpY3QtdXJpLWVuY29kZS9pbmRleC5qcyIsInNyYy9kYXRhU291cmNlcy5qcyIsInNyYy9nZXQuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbG9nb1VybC5qcyIsInNyYy9wcml2YXRlL2ZldGNoUmVxdWVzdC5qcyIsInNyYy9wcml2YXRlL2hlbHBlcnMuanMiLCJzcmMvc2VhcmNoLmpzIiwic3JjL3RyYXZlcnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNOQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7SUFJTSxXOzs7QUFDSix5QkFBYztBQUFBOztBQUFBOztBQUFBLDBIQUNOO0FBQ0osWUFBTTtBQURGLEtBRE07O0FBSVosVUFBSyxPQUFMLEdBQWUsc0JBQWY7QUFDQSxVQUFLLElBQUwsR0FBWSxTQUFaO0FBQ0EsVUFBSyxLQUFMOztBQUVBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzRCQUlRO0FBQUE7O0FBQ04sYUFBTyxnSEFBYyxJQUFkLENBQW1CLFVBQUMsUUFBRCxFQUFjO0FBQ3RDLFlBQUksd0JBQVMsUUFBVCxDQUFKLEVBQXdCO0FBQ3RCLGNBQUksU0FBUyxFQUFiO0FBQ0EsbUJBQ0csTUFESCxDQUNVO0FBQUEsbUJBQVUsT0FBTyxjQUFQLElBQXlCLEtBQW5DO0FBQUEsV0FEVixFQUVHLEdBRkgsQ0FFTyxVQUFDLEVBQUQsRUFBUTtBQUNYLGdCQUFJLE9BQVEsR0FBRyxJQUFILENBQVEsTUFBUixHQUFpQixDQUFsQixHQUF1QixHQUFHLElBQUgsQ0FBUSxDQUFSLENBQXZCLEdBQW9DLEdBQUcsSUFBSCxDQUFRLENBQVIsQ0FBL0M7QUFDQSxtQkFBTyxHQUFHLEdBQVYsSUFBaUI7QUFDZixrQkFBSSxHQUFHLFVBRFE7QUFFZixtQkFBSyxHQUFHLEdBRk87QUFHZixvQkFBTSxJQUhTO0FBSWYsMkJBQWEsR0FBRyxXQUpEO0FBS2Ysb0JBQU0sR0FBRztBQUxNLGFBQWpCO0FBT0QsV0FYSDtBQVlBLGlCQUFLLElBQUwsR0FBWSxNQUFaO0FBQ0QsU0FmRCxNQWVPO0FBQ0wsaUJBQUssSUFBTCxHQUFZLEtBQVo7QUFDRDtBQUNELGVBQU8sT0FBSyxJQUFaO0FBQ0QsT0FwQk0sQ0FBUDtBQXFCRDs7QUFFRDs7Ozs7Ozs7O3FDQU1pQjtBQUFBOztBQUNmLFVBQUksS0FBSyxJQUFMLEtBQWMsU0FBbEIsRUFBNkI7QUFDM0IsZUFBTyx3QkFBWSxVQUFDLE9BQUQsRUFBYTtBQUM5QixrQkFBUSxPQUFLLElBQWI7QUFDRCxTQUZNLENBQVA7QUFHRCxPQUpELE1BSU87QUFDTCxlQUFPLEtBQUssS0FBTCxHQUFhLElBQWIsQ0FBa0IsWUFBTTtBQUM3QixpQkFBTyxPQUFLLElBQVo7QUFDRCxTQUZNLENBQVA7QUFHRDtBQUNGOztBQUVEOzs7Ozs7Ozt3QkFLSSxRLEVBQVU7QUFBQTs7QUFDWixVQUFJLGFBQWEsU0FBakIsRUFBNEI7QUFDMUIsYUFBSyxjQUFMLEdBQXNCLElBQXRCLENBQTJCO0FBQUEsaUJBQU0sU0FBUyxPQUFLLElBQWQsQ0FBTjtBQUFBLFNBQTNCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTyxLQUFLLGNBQUwsRUFBUDtBQUNEO0FBQ0Y7Ozs7OztBQUdILE9BQU8sT0FBUCxHQUFpQixJQUFJLFdBQUosRUFBakI7Ozs7Ozs7OztBQ2pGQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQTs7OztJQUlNLEc7OztBQUNKOzs7Ozs7QUFNQSxlQUFZLFdBQVosRUFBeUI7QUFBQTs7QUFBQTs7QUFBQSwwR0FDakIsV0FEaUI7O0FBRXZCLFVBQUssT0FBTCxHQUFlLEtBQWY7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7MEJBS00sVyxFQUFhO0FBQ2pCLDZHQUFtQixXQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLSSxLLEVBQU87QUFDVCwyR0FBaUIsS0FBakIsRUFBd0IsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7NEJBS1EsUyxFQUFXO0FBQ2pCLGFBQU8sS0FBSyxHQUFMLENBQVMsK0JBQWlCLFNBQWpCLENBQVQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLTyxLLEVBQU87QUFDWiwyR0FBaUIsUUFBakIsRUFBMkIsS0FBM0I7QUFDRDs7QUFFRDs7Ozs7QUFLQTs7Ozs7OzswQkFJTSxRLEVBQVU7QUFBQTs7QUFDZCxhQUFPLGdHQUFjLElBQWQsQ0FBbUIsVUFBQyxRQUFELEVBQWM7QUFDdEMsWUFBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCOzs7Ozs7QUFNQSxtQkFBUyxRQUFUO0FBQ0E7QUFDRCxTQVRELE1BU087QUFDTCxpQkFBTyxRQUFQO0FBQ0Q7QUFDRixPQWJNLENBQVA7QUFjRDs7Ozs7O0FBR0gsT0FBTyxPQUFQLEdBQWlCLEdBQWpCOzs7OztBQ3BGQTs7Ozs7O0FBTUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLE1BQUssUUFBUSxVQUFSLENBRFc7QUFFaEIsY0FBYSxRQUFRLGtCQUFSLENBRkc7QUFHaEIsVUFBUyxRQUFRLGNBQVIsQ0FITztBQUloQixTQUFRLFFBQVEsYUFBUixDQUpRO0FBS2hCLFdBQVUsUUFBUSxlQUFSO0FBTE0sQ0FBakI7Ozs7Ozs7O0FDTkE7Ozs7OztBQU1BLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxXQUFELEVBQWlCO0FBQ2hDLFNBQU8sTUFBUDtBQUNBLENBRkQ7O2tCQUllLE87Ozs7Ozs7Ozs7OztBQ1ZmOztBQUdBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7Ozs7QUFQQSxRQUFRLGtCQUFSOztBQVNBLE1BQU0sT0FBTjs7QUFFQTs7Ozs7SUFJYSxZLFdBQUEsWTtBQUNYLHdCQUFZLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBSyxLQUFMLEdBQWEsb0NBQWI7QUFDQSxTQUFLLE9BQUwsR0FBZSxnQkFBZjtBQUNBLFNBQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLFNBQUssV0FBTCxHQUFtQixFQUFuQjtBQUNBLFFBQUksZ0JBQWdCLFNBQXBCLEVBQStCO0FBQzdCLFdBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNEOzs7OzBCQUVLLFcsRUFBYTtBQUNqQixXQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDQSxhQUFPLElBQVA7QUFDRDs7O3dCQUVHLFMsRUFBVyxLLEVBQU87QUFDcEIsa0JBQVksT0FBTyxTQUFQLENBQVo7QUFDQSxVQUFJLGNBQWMsRUFBbEIsRUFBc0I7QUFDcEIsWUFBSSxVQUFVLEVBQVYsSUFBaUIsdUJBQVEsS0FBUixLQUFrQixDQUFDLHVCQUFRLEtBQVIsQ0FBeEMsRUFBeUQ7QUFDdkQsZUFBSyxNQUFMLENBQVksU0FBWjtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUssV0FBTCxDQUFpQixTQUFqQixJQUE4QixLQUE5QjtBQUNEO0FBQ0Y7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7Ozs0QkFFTSxTLEVBQVc7QUFDaEIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7O2tCQUVPO0FBQUE7O0FBQ04sVUFBSSxlQUFlLE1BQU0sS0FBSyxLQUFMLEdBQWEsS0FBSyxPQUFsQixHQUE0QixHQUE1QixHQUFrQyw0QkFBZSxLQUFLLFdBQXBCLENBQXhDLENBQW5CO0FBQ0EsVUFBSSxlQUFlLGFBQWEsSUFBYixDQUFrQixVQUFDLGNBQUQsRUFBb0I7QUFDdkQsZUFBTyxjQUFQO0FBQ0QsT0FGa0IsQ0FBbkI7O0FBSUEsVUFBSSxlQUFlLGFBQWEsSUFBYixDQUFrQixVQUFDLGNBQUQsRUFBb0I7QUFDckQsZUFBTyxlQUFlLElBQWYsRUFBUDtBQUNELE9BRmdCLEVBR2hCLElBSGdCLENBR1gsVUFBQyxjQUFELEVBQW9CO0FBQ3hCLGNBQUssWUFBTCxHQUFvQixjQUFwQjtBQUNBLGVBQU8sY0FBUDtBQUNELE9BTmdCLENBQW5COztBQVFBLGFBQU8sb0JBQVEsR0FBUixDQUFZLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBWixFQUEwQyxJQUExQyxDQUErQyxVQUFDLFlBQUQsRUFBa0I7QUFDcEUsZ0JBQVEsYUFBYSxDQUFiLEVBQWdCLE1BQXhCO0FBQ0UsZUFBSyxHQUFMO0FBQ0UsbUJBQU8sa0NBQW9CLGFBQWEsQ0FBYixDQUFwQixDQUFQO0FBQ0E7QUFDRixlQUFLLEdBQUw7QUFDRSxtQkFBTyxLQUFQO0FBQ0E7QUFDRjtBQUNFLG1CQUFPLElBQVA7QUFSSjtBQVVELE9BWEksRUFZSixLQVpJLENBWUUsVUFBQyxLQUFELEVBQVc7QUFDaEIsZUFBTyxJQUFQO0FBQ0QsT0FkSSxDQUFQO0FBZUQsSzs7Ozs7Ozs7Ozs7O0FDaEZIOzs7OztBQUtPLElBQU0sb0RBQXNCLFNBQXRCLG1CQUFzQixDQUFDLE1BQUQsRUFBWTtBQUM3QyxNQUFJO0FBQ0YsV0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQVA7QUFDRCxHQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDVixXQUFPLE1BQVA7QUFDRDtBQUNGLENBTk07O0FBUVA7Ozs7O0FBS08sSUFBTSw4Q0FBbUIsU0FBbkIsZ0JBQW1CLENBQUMsU0FBRCxFQUFlO0FBQzdDLFNBQU8sb0NBQW9DLFNBQTNDO0FBQ0QsQ0FGTTs7Ozs7Ozs7QUNsQlA7Ozs7OztBQU1BLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBQyxZQUFELEVBQWUsUUFBZixFQUE0QjtBQUMxQzs7Ozs7OztBQU9BLFVBQVMsY0FBVCxFQUF5QixjQUF6QjtBQUNBLENBVEQ7O2tCQVdlLE07Ozs7Ozs7O0FDakJmOzs7Ozs7QUFNQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBMkI7QUFDM0M7Ozs7Ozs7QUFPQSxVQUFTLGNBQVQsRUFBeUIsY0FBekI7QUFDQSxDQVREOztrQkFXZSxRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGljb252TGl0ZSA9IHJlcXVpcmUoJ2ljb252LWxpdGUnKTtcbi8vIExvYWQgSWNvbnYgZnJvbSBhbiBleHRlcm5hbCBmaWxlIHRvIGJlIGFibGUgdG8gZGlzYWJsZSBJY29udiBmb3Igd2VicGFja1xuLy8gQWRkIC9cXC9pY29udi1sb2FkZXIkLyB0byB3ZWJwYWNrLklnbm9yZVBsdWdpbiB0byBpZ25vcmUgaXRcbnZhciBJY29udiA9IHJlcXVpcmUoJy4vaWNvbnYtbG9hZGVyJyk7XG5cbi8vIEV4cG9zZSB0byB0aGUgd29ybGRcbm1vZHVsZS5leHBvcnRzLmNvbnZlcnQgPSBjb252ZXJ0O1xuXG4vKipcbiAqIENvbnZlcnQgZW5jb2Rpbmcgb2YgYW4gVVRGLTggc3RyaW5nIG9yIGEgYnVmZmVyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8QnVmZmVyfSBzdHIgU3RyaW5nIHRvIGJlIGNvbnZlcnRlZFxuICogQHBhcmFtIHtTdHJpbmd9IHRvIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCB0b1xuICogQHBhcmFtIHtTdHJpbmd9IFtmcm9tPSdVVEYtOCddIEVuY29kaW5nIHRvIGJlIGNvbnZlcnRlZCBmcm9tXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVzZUxpdGUgSWYgc2V0IHRvIHR1cmUsIGZvcmNlIHRvIHVzZSBpY29udkxpdGVcbiAqIEByZXR1cm4ge0J1ZmZlcn0gRW5jb2RlZCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gY29udmVydChzdHIsIHRvLCBmcm9tLCB1c2VMaXRlKSB7XG4gICAgZnJvbSA9IGNoZWNrRW5jb2RpbmcoZnJvbSB8fCAnVVRGLTgnKTtcbiAgICB0byA9IGNoZWNrRW5jb2RpbmcodG8gfHwgJ1VURi04Jyk7XG4gICAgc3RyID0gc3RyIHx8ICcnO1xuXG4gICAgdmFyIHJlc3VsdDtcblxuICAgIGlmIChmcm9tICE9PSAnVVRGLTgnICYmIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHN0ciA9IG5ldyBCdWZmZXIoc3RyLCAnYmluYXJ5Jyk7XG4gICAgfVxuXG4gICAgaWYgKGZyb20gPT09IHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gbmV3IEJ1ZmZlcihzdHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gc3RyO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChJY29udiAmJiAhdXNlTGl0ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gY29udmVydEljb252KHN0ciwgdG8sIGZyb20pO1xuICAgICAgICB9IGNhdGNoIChFKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKEUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBjb252ZXJ0SWNvbnZMaXRlKHN0ciwgdG8sIGZyb20pO1xuICAgICAgICAgICAgfSBjYXRjaCAoRSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoRSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNvbnZlcnRJY29udkxpdGUoc3RyLCB0bywgZnJvbSk7XG4gICAgICAgIH0gY2F0Y2ggKEUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoRSk7XG4gICAgICAgICAgICByZXN1bHQgPSBzdHI7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXN1bHQgPSBuZXcgQnVmZmVyKHJlc3VsdCwgJ3V0Zi04Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGVuY29kaW5nIG9mIGEgc3RyaW5nIHdpdGggbm9kZS1pY29udiAoaWYgYXZhaWxhYmxlKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEJ1ZmZlcn0gc3RyIFN0cmluZyB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0byBFbmNvZGluZyB0byBiZSBjb252ZXJ0ZWQgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbZnJvbT0nVVRGLTgnXSBFbmNvZGluZyB0byBiZSBjb252ZXJ0ZWQgZnJvbVxuICogQHJldHVybiB7QnVmZmVyfSBFbmNvZGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBjb252ZXJ0SWNvbnYoc3RyLCB0bywgZnJvbSkge1xuICAgIHZhciByZXNwb25zZSwgaWNvbnY7XG4gICAgaWNvbnYgPSBuZXcgSWNvbnYoZnJvbSwgdG8gKyAnLy9UUkFOU0xJVC8vSUdOT1JFJyk7XG4gICAgcmVzcG9uc2UgPSBpY29udi5jb252ZXJ0KHN0cik7XG4gICAgcmV0dXJuIHJlc3BvbnNlLnNsaWNlKDAsIHJlc3BvbnNlLmxlbmd0aCk7XG59XG5cbi8qKlxuICogQ29udmVydCBlbmNvZGluZyBvZiBhc3RyaW5nIHdpdGggaWNvbnYtbGl0ZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEJ1ZmZlcn0gc3RyIFN0cmluZyB0byBiZSBjb252ZXJ0ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0byBFbmNvZGluZyB0byBiZSBjb252ZXJ0ZWQgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSBbZnJvbT0nVVRGLTgnXSBFbmNvZGluZyB0byBiZSBjb252ZXJ0ZWQgZnJvbVxuICogQHJldHVybiB7QnVmZmVyfSBFbmNvZGVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBjb252ZXJ0SWNvbnZMaXRlKHN0ciwgdG8sIGZyb20pIHtcbiAgICBpZiAodG8gPT09ICdVVEYtOCcpIHtcbiAgICAgICAgcmV0dXJuIGljb252TGl0ZS5kZWNvZGUoc3RyLCBmcm9tKTtcbiAgICB9IGVsc2UgaWYgKGZyb20gPT09ICdVVEYtOCcpIHtcbiAgICAgICAgcmV0dXJuIGljb252TGl0ZS5lbmNvZGUoc3RyLCB0byk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGljb252TGl0ZS5lbmNvZGUoaWNvbnZMaXRlLmRlY29kZShzdHIsIGZyb20pLCB0byk7XG4gICAgfVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGNoYXJzZXQgbmFtZSBpZiBuZWVkZWRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBDaGFyYWN0ZXIgc2V0XG4gKiBAcmV0dXJuIHtTdHJpbmd9IENoYXJhY3RlciBzZXQgbmFtZVxuICovXG5mdW5jdGlvbiBjaGVja0VuY29kaW5nKG5hbWUpIHtcbiAgICByZXR1cm4gKG5hbWUgfHwgJycpLnRvU3RyaW5nKCkudHJpbSgpLlxuICAgIHJlcGxhY2UoL15sYXRpbltcXC1fXT8oXFxkKykkL2ksICdJU08tODg1OS0kMScpLlxuICAgIHJlcGxhY2UoL153aW4oPzpkb3dzKT9bXFwtX10/KFxcZCspJC9pLCAnV0lORE9XUy0kMScpLlxuICAgIHJlcGxhY2UoL151dGZbXFwtX10/KFxcZCspJC9pLCAnVVRGLSQxJykuXG4gICAgcmVwbGFjZSgvXmtzX2NfNTYwMVxcLTE5ODckL2ksICdDUDk0OScpLlxuICAgIHJlcGxhY2UoL151c1tcXC1fXT9hc2NpaSQvaSwgJ0FTQ0lJJykuXG4gICAgdG9VcHBlckNhc2UoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGljb252X3BhY2thZ2U7XG52YXIgSWNvbnY7XG5cbnRyeSB7XG4gICAgLy8gdGhpcyBpcyB0byBmb29sIGJyb3dzZXJpZnkgc28gaXQgZG9lc24ndCB0cnkgKGluIHZhaW4pIHRvIGluc3RhbGwgaWNvbnYuXG4gICAgaWNvbnZfcGFja2FnZSA9ICdpY29udic7XG4gICAgSWNvbnYgPSByZXF1aXJlKGljb252X3BhY2thZ2UpLkljb252O1xufSBjYXRjaCAoRSkge1xuICAgIC8vIG5vZGUtaWNvbnYgbm90IHByZXNlbnRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJY29udjtcbiIsIi8qIVxuICogQG92ZXJ2aWV3IGVzNi1wcm9taXNlIC0gYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIFByb21pc2VzL0ErLlxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTQgWWVodWRhIEthdHosIFRvbSBEYWxlLCBTdGVmYW4gUGVubmVyIGFuZCBjb250cmlidXRvcnMgKENvbnZlcnNpb24gdG8gRVM2IEFQSSBieSBKYWtlIEFyY2hpYmFsZClcbiAqIEBsaWNlbnNlICAgTGljZW5zZWQgdW5kZXIgTUlUIGxpY2Vuc2VcbiAqICAgICAgICAgICAgU2VlIGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9zdGVmYW5wZW5uZXIvZXM2LXByb21pc2UvbWFzdGVyL0xJQ0VOU0VcbiAqIEB2ZXJzaW9uICAgNC4wLjVcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIChnbG9iYWwuRVM2UHJvbWlzZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gb2JqZWN0T3JGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih4KSB7XG4gIHJldHVybiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxudmFyIF9pc0FycmF5ID0gdW5kZWZpbmVkO1xuaWYgKCFBcnJheS5pc0FycmF5KSB7XG4gIF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xufSBlbHNlIHtcbiAgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xufVxuXG52YXIgaXNBcnJheSA9IF9pc0FycmF5O1xuXG52YXIgbGVuID0gMDtcbnZhciB2ZXJ0eE5leHQgPSB1bmRlZmluZWQ7XG52YXIgY3VzdG9tU2NoZWR1bGVyRm4gPSB1bmRlZmluZWQ7XG5cbnZhciBhc2FwID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gIHF1ZXVlW2xlbl0gPSBjYWxsYmFjaztcbiAgcXVldWVbbGVuICsgMV0gPSBhcmc7XG4gIGxlbiArPSAyO1xuICBpZiAobGVuID09PSAyKSB7XG4gICAgLy8gSWYgbGVuIGlzIDIsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgIC8vIElmIGFkZGl0aW9uYWwgY2FsbGJhY2tzIGFyZSBxdWV1ZWQgYmVmb3JlIHRoZSBxdWV1ZSBpcyBmbHVzaGVkLCB0aGV5XG4gICAgLy8gd2lsbCBiZSBwcm9jZXNzZWQgYnkgdGhpcyBmbHVzaCB0aGF0IHdlIGFyZSBzY2hlZHVsaW5nLlxuICAgIGlmIChjdXN0b21TY2hlZHVsZXJGbikge1xuICAgICAgY3VzdG9tU2NoZWR1bGVyRm4oZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXRTY2hlZHVsZXIoc2NoZWR1bGVGbikge1xuICBjdXN0b21TY2hlZHVsZXJGbiA9IHNjaGVkdWxlRm47XG59XG5cbmZ1bmN0aW9uIHNldEFzYXAoYXNhcEZuKSB7XG4gIGFzYXAgPSBhc2FwRm47XG59XG5cbnZhciBicm93c2VyV2luZG93ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG52YXIgYnJvd3Nlckdsb2JhbCA9IGJyb3dzZXJXaW5kb3cgfHwge307XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIGlzTm9kZSA9IHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHt9KS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXSc7XG5cbi8vIHRlc3QgZm9yIHdlYiB3b3JrZXIgYnV0IG5vdCBpbiBJRTEwXG52YXIgaXNXb3JrZXIgPSB0eXBlb2YgVWludDhDbGFtcGVkQXJyYXkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBub2RlXG5mdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgLy8gbm9kZSB2ZXJzaW9uIDAuMTAueCBkaXNwbGF5cyBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgd2hlbiBuZXh0VGljayBpcyB1c2VkIHJlY3Vyc2l2ZWx5XG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vY3Vqb2pzL3doZW4vaXNzdWVzLzQxMCBmb3IgZGV0YWlsc1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbn1cblxuLy8gdmVydHhcbmZ1bmN0aW9uIHVzZVZlcnR4VGltZXIoKSB7XG4gIGlmICh0eXBlb2YgdmVydHhOZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2ZXJ0eE5leHQoZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIG5vZGUuZGF0YSA9IGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyO1xuICB9O1xufVxuXG4vLyB3ZWIgd29ya2VyXG5mdW5jdGlvbiB1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmbHVzaDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gZXM2LXByb21pc2Ugd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgZ2xvYmFsU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGdsb2JhbFNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICB9O1xufVxuXG52YXIgcXVldWUgPSBuZXcgQXJyYXkoMTAwMCk7XG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgIHZhciBhcmcgPSBxdWV1ZVtpICsgMV07XG5cbiAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgcXVldWVbaSArIDFdID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgbGVuID0gMDtcbn1cblxuZnVuY3Rpb24gYXR0ZW1wdFZlcnR4KCkge1xuICB0cnkge1xuICAgIHZhciByID0gcmVxdWlyZTtcbiAgICB2YXIgdmVydHggPSByKCd2ZXJ0eCcpO1xuICAgIHZlcnR4TmV4dCA9IHZlcnR4LnJ1bk9uTG9vcCB8fCB2ZXJ0eC5ydW5PbkNvbnRleHQ7XG4gICAgcmV0dXJuIHVzZVZlcnR4VGltZXIoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbn1cblxudmFyIHNjaGVkdWxlRmx1c2ggPSB1bmRlZmluZWQ7XG4vLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuaWYgKGlzTm9kZSkge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbn0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbn0gZWxzZSBpZiAoaXNXb3JrZXIpIHtcbiAgc2NoZWR1bGVGbHVzaCA9IHVzZU1lc3NhZ2VDaGFubmVsKCk7XG59IGVsc2UgaWYgKGJyb3dzZXJXaW5kb3cgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICBzY2hlZHVsZUZsdXNoID0gYXR0ZW1wdFZlcnR4KCk7XG59IGVsc2Uge1xuICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xufVxuXG5mdW5jdGlvbiB0aGVuKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuXG4gIHZhciBwYXJlbnQgPSB0aGlzO1xuXG4gIHZhciBjaGlsZCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGlmIChjaGlsZFtQUk9NSVNFX0lEXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbWFrZVByb21pc2UoY2hpbGQpO1xuICB9XG5cbiAgdmFyIF9zdGF0ZSA9IHBhcmVudC5fc3RhdGU7XG5cbiAgaWYgKF9zdGF0ZSkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2FsbGJhY2sgPSBfYXJndW1lbnRzW19zdGF0ZSAtIDFdO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2VDYWxsYmFjayhfc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcGFyZW50Ll9yZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSkoKTtcbiAgfSBlbHNlIHtcbiAgICBzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkO1xufVxuXG4vKipcbiAgYFByb21pc2UucmVzb2x2ZWAgcmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlY29tZSByZXNvbHZlZCB3aXRoIHRoZVxuICBwYXNzZWQgYHZhbHVlYC4gSXQgaXMgc2hvcnRoYW5kIGZvciB0aGUgZm9sbG93aW5nOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHJlc29sdmUoMSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEluc3RlYWQgb2Ygd3JpdGluZyB0aGUgYWJvdmUsIHlvdXIgY29kZSBub3cgc2ltcGx5IGJlY29tZXMgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKDEpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gdmFsdWUgPT09IDFcbiAgfSk7XG4gIGBgYFxuXG4gIEBtZXRob2QgcmVzb2x2ZVxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSB2YWx1ZSB2YWx1ZSB0aGF0IHRoZSByZXR1cm5lZCBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aFxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB0aGF0IHdpbGwgYmVjb21lIGZ1bGZpbGxlZCB3aXRoIHRoZSBnaXZlblxuICBgdmFsdWVgXG4qL1xuZnVuY3Rpb24gcmVzb2x2ZShvYmplY3QpIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuICBpZiAob2JqZWN0ICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZXNvbHZlKHByb21pc2UsIG9iamVjdCk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG52YXIgUFJPTUlTRV9JRCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygxNik7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgUEVORElORyA9IHZvaWQgMDtcbnZhciBGVUxGSUxMRUQgPSAxO1xudmFyIFJFSkVDVEVEID0gMjtcblxudmFyIEdFVF9USEVOX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHNlbGZGdWxmaWxsbWVudCgpIHtcbiAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xufVxuXG5mdW5jdGlvbiBjYW5ub3RSZXR1cm5Pd24oKSB7XG4gIHJldHVybiBuZXcgVHlwZUVycm9yKCdBIHByb21pc2VzIGNhbGxiYWNrIGNhbm5vdCByZXR1cm4gdGhhdCBzYW1lIHByb21pc2UuJyk7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW4ocHJvbWlzZSkge1xuICB0cnkge1xuICAgIHJldHVybiBwcm9taXNlLnRoZW47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgR0VUX1RIRU5fRVJST1IuZXJyb3IgPSBlcnJvcjtcbiAgICByZXR1cm4gR0VUX1RIRU5fRVJST1I7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJ5VGhlbih0aGVuLCB2YWx1ZSwgZnVsZmlsbG1lbnRIYW5kbGVyLCByZWplY3Rpb25IYW5kbGVyKSB7XG4gIHRyeSB7XG4gICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlLCB0aGVuKSB7XG4gIGFzYXAoZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgdmFyIGVycm9yID0gdHJ5VGhlbih0aGVuLCB0aGVuYWJsZSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoc2VhbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIGlmIChzZWFsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0sICdTZXR0bGU6ICcgKyAocHJvbWlzZS5fbGFiZWwgfHwgJyB1bmtub3duIHByb21pc2UnKSk7XG5cbiAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH1cbiAgfSwgcHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU93blRoZW5hYmxlKHByb21pc2UsIHRoZW5hYmxlKSB7XG4gIGlmICh0aGVuYWJsZS5fc3RhdGUgPT09IEZVTEZJTExFRCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSBpZiAodGhlbmFibGUuX3N0YXRlID09PSBSRUpFQ1RFRCkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgdGhlbmFibGUuX3Jlc3VsdCk7XG4gIH0gZWxzZSB7XG4gICAgc3Vic2NyaWJlKHRoZW5hYmxlLCB1bmRlZmluZWQsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbiQkKSB7XG4gIGlmIChtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yID09PSBwcm9taXNlLmNvbnN0cnVjdG9yICYmIHRoZW4kJCA9PT0gdGhlbiAmJiBtYXliZVRoZW5hYmxlLmNvbnN0cnVjdG9yLnJlc29sdmUgPT09IHJlc29sdmUpIHtcbiAgICBoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhlbiQkID09PSBHRVRfVEhFTl9FUlJPUikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGVuJCQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZnVsZmlsbChwcm9taXNlLCBtYXliZVRoZW5hYmxlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odGhlbiQkKSkge1xuICAgICAgaGFuZGxlRm9yZWlnblRoZW5hYmxlKHByb21pc2UsIG1heWJlVGhlbmFibGUsIHRoZW4kJCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKSB7XG4gIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgIF9yZWplY3QocHJvbWlzZSwgc2VsZkZ1bGZpbGxtZW50KCkpO1xuICB9IGVsc2UgaWYgKG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCB2YWx1ZSwgZ2V0VGhlbih2YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hSZWplY3Rpb24ocHJvbWlzZSkge1xuICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgIHByb21pc2UuX29uZXJyb3IocHJvbWlzZS5fcmVzdWx0KTtcbiAgfVxuXG4gIHB1Ymxpc2gocHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpIHtcbiAgaWYgKHByb21pc2UuX3N0YXRlICE9PSBQRU5ESU5HKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvbWlzZS5fcmVzdWx0ID0gdmFsdWU7XG4gIHByb21pc2UuX3N0YXRlID0gRlVMRklMTEVEO1xuXG4gIGlmIChwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggIT09IDApIHtcbiAgICBhc2FwKHB1Ymxpc2gsIHByb21pc2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKSB7XG4gIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gUEVORElORykge1xuICAgIHJldHVybjtcbiAgfVxuICBwcm9taXNlLl9zdGF0ZSA9IFJFSkVDVEVEO1xuICBwcm9taXNlLl9yZXN1bHQgPSByZWFzb247XG5cbiAgYXNhcChwdWJsaXNoUmVqZWN0aW9uLCBwcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gIHZhciBfc3Vic2NyaWJlcnMgPSBwYXJlbnQuX3N1YnNjcmliZXJzO1xuICB2YXIgbGVuZ3RoID0gX3N1YnNjcmliZXJzLmxlbmd0aDtcblxuICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gIF9zdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gIF9zdWJzY3JpYmVyc1tsZW5ndGggKyBGVUxGSUxMRURdID0gb25GdWxmaWxsbWVudDtcbiAgX3N1YnNjcmliZXJzW2xlbmd0aCArIFJFSkVDVEVEXSA9IG9uUmVqZWN0aW9uO1xuXG4gIGlmIChsZW5ndGggPT09IDAgJiYgcGFyZW50Ll9zdGF0ZSkge1xuICAgIGFzYXAocHVibGlzaCwgcGFyZW50KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdWJsaXNoKHByb21pc2UpIHtcbiAgdmFyIHN1YnNjcmliZXJzID0gcHJvbWlzZS5fc3Vic2NyaWJlcnM7XG4gIHZhciBzZXR0bGVkID0gcHJvbWlzZS5fc3RhdGU7XG5cbiAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBjaGlsZCA9IHVuZGVmaW5lZCxcbiAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkLFxuICAgICAgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDMpIHtcbiAgICBjaGlsZCA9IHN1YnNjcmliZXJzW2ldO1xuICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKGRldGFpbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gRXJyb3JPYmplY3QoKSB7XG4gIHRoaXMuZXJyb3IgPSBudWxsO1xufVxuXG52YXIgVFJZX0NBVENIX0VSUk9SID0gbmV3IEVycm9yT2JqZWN0KCk7XG5cbmZ1bmN0aW9uIHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soZGV0YWlsKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIFRSWV9DQVRDSF9FUlJPUi5lcnJvciA9IGU7XG4gICAgcmV0dXJuIFRSWV9DQVRDSF9FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBwcm9taXNlLCBjYWxsYmFjaywgZGV0YWlsKSB7XG4gIHZhciBoYXNDYWxsYmFjayA9IGlzRnVuY3Rpb24oY2FsbGJhY2spLFxuICAgICAgdmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICBlcnJvciA9IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2NlZWRlZCA9IHVuZGVmaW5lZCxcbiAgICAgIGZhaWxlZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoaGFzQ2FsbGJhY2spIHtcbiAgICB2YWx1ZSA9IHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgaWYgKHZhbHVlID09PSBUUllfQ0FUQ0hfRVJST1IpIHtcbiAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICBlcnJvciA9IHZhbHVlLmVycm9yO1xuICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWNjZWVkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgX3JlamVjdChwcm9taXNlLCBjYW5ub3RSZXR1cm5Pd24oKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbHVlID0gZGV0YWlsO1xuICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gIH1cblxuICBpZiAocHJvbWlzZS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAvLyBub29wXG4gIH0gZWxzZSBpZiAoaGFzQ2FsbGJhY2sgJiYgc3VjY2VlZGVkKSB7XG4gICAgICBfcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgIF9yZWplY3QocHJvbWlzZSwgZXJyb3IpO1xuICAgIH0gZWxzZSBpZiAoc2V0dGxlZCA9PT0gRlVMRklMTEVEKSB7XG4gICAgICBmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gIHRyeSB7XG4gICAgcmVzb2x2ZXIoZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UodmFsdWUpIHtcbiAgICAgIF9yZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgX3JlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgX3JlamVjdChwcm9taXNlLCBlKTtcbiAgfVxufVxuXG52YXIgaWQgPSAwO1xuZnVuY3Rpb24gbmV4dElkKCkge1xuICByZXR1cm4gaWQrKztcbn1cblxuZnVuY3Rpb24gbWFrZVByb21pc2UocHJvbWlzZSkge1xuICBwcm9taXNlW1BST01JU0VfSURdID0gaWQrKztcbiAgcHJvbWlzZS5fc3RhdGUgPSB1bmRlZmluZWQ7XG4gIHByb21pc2UuX3Jlc3VsdCA9IHVuZGVmaW5lZDtcbiAgcHJvbWlzZS5fc3Vic2NyaWJlcnMgPSBbXTtcbn1cblxuZnVuY3Rpb24gRW51bWVyYXRvcihDb25zdHJ1Y3RvciwgaW5wdXQpIHtcbiAgdGhpcy5faW5zdGFuY2VDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICB0aGlzLnByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG5cbiAgaWYgKCF0aGlzLnByb21pc2VbUFJPTUlTRV9JRF0pIHtcbiAgICBtYWtlUHJvbWlzZSh0aGlzLnByb21pc2UpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICB0aGlzLl9yZXN1bHQgPSBuZXcgQXJyYXkodGhpcy5sZW5ndGgpO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmxlbmd0aCB8fCAwO1xuICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgIGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBfcmVqZWN0KHRoaXMucHJvbWlzZSwgdmFsaWRhdGlvbkVycm9yKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRpb25FcnJvcigpIHtcbiAgcmV0dXJuIG5ldyBFcnJvcignQXJyYXkgTWV0aG9kcyBtdXN0IGJlIHByb3ZpZGVkIGFuIEFycmF5Jyk7XG59O1xuXG5FbnVtZXJhdG9yLnByb3RvdHlwZS5fZW51bWVyYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gIHZhciBfaW5wdXQgPSB0aGlzLl9pbnB1dDtcblxuICBmb3IgKHZhciBpID0gMDsgdGhpcy5fc3RhdGUgPT09IFBFTkRJTkcgJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdGhpcy5fZWFjaEVudHJ5KF9pbnB1dFtpXSwgaSk7XG4gIH1cbn07XG5cbkVudW1lcmF0b3IucHJvdG90eXBlLl9lYWNoRW50cnkgPSBmdW5jdGlvbiAoZW50cnksIGkpIHtcbiAgdmFyIGMgPSB0aGlzLl9pbnN0YW5jZUNvbnN0cnVjdG9yO1xuICB2YXIgcmVzb2x2ZSQkID0gYy5yZXNvbHZlO1xuXG4gIGlmIChyZXNvbHZlJCQgPT09IHJlc29sdmUpIHtcbiAgICB2YXIgX3RoZW4gPSBnZXRUaGVuKGVudHJ5KTtcblxuICAgIGlmIChfdGhlbiA9PT0gdGhlbiAmJiBlbnRyeS5fc3RhdGUgIT09IFBFTkRJTkcpIHtcbiAgICAgIHRoaXMuX3NldHRsZWRBdChlbnRyeS5fc3RhdGUsIGksIGVudHJ5Ll9yZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGVuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9yZW1haW5pbmctLTtcbiAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IGVudHJ5O1xuICAgIH0gZWxzZSBpZiAoYyA9PT0gUHJvbWlzZSkge1xuICAgICAgdmFyIHByb21pc2UgPSBuZXcgYyhub29wKTtcbiAgICAgIGhhbmRsZU1heWJlVGhlbmFibGUocHJvbWlzZSwgZW50cnksIF90aGVuKTtcbiAgICAgIHRoaXMuX3dpbGxTZXR0bGVBdChwcm9taXNlLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fd2lsbFNldHRsZUF0KG5ldyBjKGZ1bmN0aW9uIChyZXNvbHZlJCQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUkJChlbnRyeSk7XG4gICAgICB9KSwgaSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX3dpbGxTZXR0bGVBdChyZXNvbHZlJCQoZW50cnkpLCBpKTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uIChzdGF0ZSwgaSwgdmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgaWYgKHByb21pc2UuX3N0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XG4gICAgICBfcmVqZWN0KHByb21pc2UsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVzdWx0W2ldID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgIGZ1bGZpbGwocHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgfVxufTtcblxuRW51bWVyYXRvci5wcm90b3R5cGUuX3dpbGxTZXR0bGVBdCA9IGZ1bmN0aW9uIChwcm9taXNlLCBpKSB7XG4gIHZhciBlbnVtZXJhdG9yID0gdGhpcztcblxuICBzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW51bWVyYXRvci5fc2V0dGxlZEF0KEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIGVudW1lcmF0b3IuX3NldHRsZWRBdChSRUpFQ1RFRCwgaSwgcmVhc29uKTtcbiAgfSk7XG59O1xuXG4vKipcbiAgYFByb21pc2UuYWxsYCBhY2NlcHRzIGFuIGFycmF5IG9mIHByb21pc2VzLCBhbmQgcmV0dXJucyBhIG5ldyBwcm9taXNlIHdoaWNoXG4gIGlzIGZ1bGZpbGxlZCB3aXRoIGFuIGFycmF5IG9mIGZ1bGZpbGxtZW50IHZhbHVlcyBmb3IgdGhlIHBhc3NlZCBwcm9taXNlcywgb3JcbiAgcmVqZWN0ZWQgd2l0aCB0aGUgcmVhc29uIG9mIHRoZSBmaXJzdCBwYXNzZWQgcHJvbWlzZSB0byBiZSByZWplY3RlZC4gSXQgY2FzdHMgYWxsXG4gIGVsZW1lbnRzIG9mIHRoZSBwYXNzZWQgaXRlcmFibGUgdG8gcHJvbWlzZXMgYXMgaXQgcnVucyB0aGlzIGFsZ29yaXRobS5cblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVzb2x2ZSgyKTtcbiAgbGV0IHByb21pc2UzID0gcmVzb2x2ZSgzKTtcbiAgbGV0IHByb21pc2VzID0gWyBwcm9taXNlMSwgcHJvbWlzZTIsIHByb21pc2UzIF07XG5cbiAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24oYXJyYXkpe1xuICAgIC8vIFRoZSBhcnJheSBoZXJlIHdvdWxkIGJlIFsgMSwgMiwgMyBdO1xuICB9KTtcbiAgYGBgXG5cbiAgSWYgYW55IG9mIHRoZSBgcHJvbWlzZXNgIGdpdmVuIHRvIGBhbGxgIGFyZSByZWplY3RlZCwgdGhlIGZpcnN0IHByb21pc2VcbiAgdGhhdCBpcyByZWplY3RlZCB3aWxsIGJlIGdpdmVuIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSByZXR1cm5lZCBwcm9taXNlcydzXG4gIHJlamVjdGlvbiBoYW5kbGVyLiBGb3IgZXhhbXBsZTpcblxuICBFeGFtcGxlOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgbGV0IHByb21pc2UxID0gcmVzb2x2ZSgxKTtcbiAgbGV0IHByb21pc2UyID0gcmVqZWN0KG5ldyBFcnJvcihcIjJcIikpO1xuICBsZXQgcHJvbWlzZTMgPSByZWplY3QobmV3IEVycm9yKFwiM1wiKSk7XG4gIGxldCBwcm9taXNlcyA9IFsgcHJvbWlzZTEsIHByb21pc2UyLCBwcm9taXNlMyBdO1xuXG4gIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uKGFycmF5KXtcbiAgICAvLyBDb2RlIGhlcmUgbmV2ZXIgcnVucyBiZWNhdXNlIHRoZXJlIGFyZSByZWplY3RlZCBwcm9taXNlcyFcbiAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAvLyBlcnJvci5tZXNzYWdlID09PSBcIjJcIlxuICB9KTtcbiAgYGBgXG5cbiAgQG1ldGhvZCBhbGxcbiAgQHN0YXRpY1xuICBAcGFyYW0ge0FycmF5fSBlbnRyaWVzIGFycmF5IG9mIHByb21pc2VzXG4gIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCBvcHRpb25hbCBzdHJpbmcgZm9yIGxhYmVsaW5nIHRoZSBwcm9taXNlLlxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCBpcyBmdWxmaWxsZWQgd2hlbiBhbGwgYHByb21pc2VzYCBoYXZlIGJlZW5cbiAgZnVsZmlsbGVkLCBvciByZWplY3RlZCBpZiBhbnkgb2YgdGhlbSBiZWNvbWUgcmVqZWN0ZWQuXG4gIEBzdGF0aWNcbiovXG5mdW5jdGlvbiBhbGwoZW50cmllcykge1xuICByZXR1cm4gbmV3IEVudW1lcmF0b3IodGhpcywgZW50cmllcykucHJvbWlzZTtcbn1cblxuLyoqXG4gIGBQcm9taXNlLnJhY2VgIHJldHVybnMgYSBuZXcgcHJvbWlzZSB3aGljaCBpcyBzZXR0bGVkIGluIHRoZSBzYW1lIHdheSBhcyB0aGVcbiAgZmlyc3QgcGFzc2VkIHByb21pc2UgdG8gc2V0dGxlLlxuXG4gIEV4YW1wbGU6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZTEgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJlc29sdmUoJ3Byb21pc2UgMScpO1xuICAgIH0sIDIwMCk7XG4gIH0pO1xuXG4gIGxldCBwcm9taXNlMiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAyJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gcmVzdWx0ID09PSAncHJvbWlzZSAyJyBiZWNhdXNlIGl0IHdhcyByZXNvbHZlZCBiZWZvcmUgcHJvbWlzZTFcbiAgICAvLyB3YXMgcmVzb2x2ZWQuXG4gIH0pO1xuICBgYGBcblxuICBgUHJvbWlzZS5yYWNlYCBpcyBkZXRlcm1pbmlzdGljIGluIHRoYXQgb25seSB0aGUgc3RhdGUgb2YgdGhlIGZpcnN0XG4gIHNldHRsZWQgcHJvbWlzZSBtYXR0ZXJzLiBGb3IgZXhhbXBsZSwgZXZlbiBpZiBvdGhlciBwcm9taXNlcyBnaXZlbiB0byB0aGVcbiAgYHByb21pc2VzYCBhcnJheSBhcmd1bWVudCBhcmUgcmVzb2x2ZWQsIGJ1dCB0aGUgZmlyc3Qgc2V0dGxlZCBwcm9taXNlIGhhc1xuICBiZWNvbWUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBvdGhlciBwcm9taXNlcyBiZWNhbWUgZnVsZmlsbGVkLCB0aGUgcmV0dXJuZWRcbiAgcHJvbWlzZSB3aWxsIGJlY29tZSByZWplY3RlZDpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlMSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCl7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmVzb2x2ZSgncHJvbWlzZSAxJyk7XG4gICAgfSwgMjAwKTtcbiAgfSk7XG5cbiAgbGV0IHByb21pc2UyID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZWplY3QobmV3IEVycm9yKCdwcm9taXNlIDInKSk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgUHJvbWlzZS5yYWNlKFtwcm9taXNlMSwgcHJvbWlzZTJdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgLy8gQ29kZSBoZXJlIG5ldmVyIHJ1bnNcbiAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAvLyByZWFzb24ubWVzc2FnZSA9PT0gJ3Byb21pc2UgMicgYmVjYXVzZSBwcm9taXNlIDIgYmVjYW1lIHJlamVjdGVkIGJlZm9yZVxuICAgIC8vIHByb21pc2UgMSBiZWNhbWUgZnVsZmlsbGVkXG4gIH0pO1xuICBgYGBcblxuICBBbiBleGFtcGxlIHJlYWwtd29ybGQgdXNlIGNhc2UgaXMgaW1wbGVtZW50aW5nIHRpbWVvdXRzOlxuXG4gIGBgYGphdmFzY3JpcHRcbiAgUHJvbWlzZS5yYWNlKFthamF4KCdmb28uanNvbicpLCB0aW1lb3V0KDUwMDApXSlcbiAgYGBgXG5cbiAgQG1ldGhvZCByYWNlXG4gIEBzdGF0aWNcbiAgQHBhcmFtIHtBcnJheX0gcHJvbWlzZXMgYXJyYXkgb2YgcHJvbWlzZXMgdG8gb2JzZXJ2ZVxuICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gIEByZXR1cm4ge1Byb21pc2V9IGEgcHJvbWlzZSB3aGljaCBzZXR0bGVzIGluIHRoZSBzYW1lIHdheSBhcyB0aGUgZmlyc3QgcGFzc2VkXG4gIHByb21pc2UgdG8gc2V0dGxlLlxuKi9cbmZ1bmN0aW9uIHJhY2UoZW50cmllcykge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gIGlmICghaXNBcnJheShlbnRyaWVzKSkge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKF8sIHJlamVjdCkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAgYFByb21pc2UucmVqZWN0YCByZXR1cm5zIGEgcHJvbWlzZSByZWplY3RlZCB3aXRoIHRoZSBwYXNzZWQgYHJlYXNvbmAuXG4gIEl0IGlzIHNob3J0aGFuZCBmb3IgdGhlIGZvbGxvd2luZzpcblxuICBgYGBqYXZhc2NyaXB0XG4gIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICByZWplY3QobmV3IEVycm9yKCdXSE9PUFMnKSk7XG4gIH0pO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBJbnN0ZWFkIG9mIHdyaXRpbmcgdGhlIGFib3ZlLCB5b3VyIGNvZGUgbm93IHNpbXBseSBiZWNvbWVzIHRoZSBmb2xsb3dpbmc6XG5cbiAgYGBgamF2YXNjcmlwdFxuICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignV0hPT1BTJykpO1xuXG4gIHByb21pc2UudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgLy8gQ29kZSBoZXJlIGRvZXNuJ3QgcnVuIGJlY2F1c2UgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQhXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgLy8gcmVhc29uLm1lc3NhZ2UgPT09ICdXSE9PUFMnXG4gIH0pO1xuICBgYGBcblxuICBAbWV0aG9kIHJlamVjdFxuICBAc3RhdGljXG4gIEBwYXJhbSB7QW55fSByZWFzb24gdmFsdWUgdGhhdCB0aGUgcmV0dXJuZWQgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGguXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHJlamVjdGVkIHdpdGggdGhlIGdpdmVuIGByZWFzb25gLlxuKi9cbmZ1bmN0aW9uIHJlamVjdChyZWFzb24pIHtcbiAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgdmFyIHByb21pc2UgPSBuZXcgQ29uc3RydWN0b3Iobm9vcCk7XG4gIF9yZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgcmV0dXJuIHByb21pc2U7XG59XG5cbmZ1bmN0aW9uIG5lZWRzUmVzb2x2ZXIoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSByZXNvbHZlciBmdW5jdGlvbiBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIHByb21pc2UgY29uc3RydWN0b3InKTtcbn1cblxuZnVuY3Rpb24gbmVlZHNOZXcoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG59XG5cbi8qKlxuICBQcm9taXNlIG9iamVjdHMgcmVwcmVzZW50IHRoZSBldmVudHVhbCByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi4gVGhlXG4gIHByaW1hcnkgd2F5IG9mIGludGVyYWN0aW5nIHdpdGggYSBwcm9taXNlIGlzIHRocm91Z2ggaXRzIGB0aGVuYCBtZXRob2QsIHdoaWNoXG4gIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNlJ3MgZXZlbnR1YWwgdmFsdWUgb3IgdGhlIHJlYXNvblxuICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICBUZXJtaW5vbG9neVxuICAtLS0tLS0tLS0tLVxuXG4gIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gIC0gYHRoZW5hYmxlYCBpcyBhbiBvYmplY3Qgb3IgZnVuY3Rpb24gdGhhdCBkZWZpbmVzIGEgYHRoZW5gIG1ldGhvZC5cbiAgLSBgdmFsdWVgIGlzIGFueSBsZWdhbCBKYXZhU2NyaXB0IHZhbHVlIChpbmNsdWRpbmcgdW5kZWZpbmVkLCBhIHRoZW5hYmxlLCBvciBhIHByb21pc2UpLlxuICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgLSBgcmVhc29uYCBpcyBhIHZhbHVlIHRoYXQgaW5kaWNhdGVzIHdoeSBhIHByb21pc2Ugd2FzIHJlamVjdGVkLlxuICAtIGBzZXR0bGVkYCB0aGUgZmluYWwgcmVzdGluZyBzdGF0ZSBvZiBhIHByb21pc2UsIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cblxuICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgUHJvbWlzZXMgdGhhdCBhcmUgZnVsZmlsbGVkIGhhdmUgYSBmdWxmaWxsbWVudCB2YWx1ZSBhbmQgYXJlIGluIHRoZSBmdWxmaWxsZWRcbiAgc3RhdGUuICBQcm9taXNlcyB0aGF0IGFyZSByZWplY3RlZCBoYXZlIGEgcmVqZWN0aW9uIHJlYXNvbiBhbmQgYXJlIGluIHRoZVxuICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICBQcm9taXNlcyBjYW4gYWxzbyBiZSBzYWlkIHRvICpyZXNvbHZlKiBhIHZhbHVlLiAgSWYgdGhpcyB2YWx1ZSBpcyBhbHNvIGFcbiAgcHJvbWlzZSwgdGhlbiB0aGUgb3JpZ2luYWwgcHJvbWlzZSdzIHNldHRsZWQgc3RhdGUgd2lsbCBtYXRjaCB0aGUgdmFsdWUnc1xuICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgaXRzZWxmIHJlamVjdCwgYW5kIGEgcHJvbWlzZSB0aGF0ICpyZXNvbHZlcyogYSBwcm9taXNlIHRoYXQgZnVsZmlsbHMgd2lsbFxuICBpdHNlbGYgZnVsZmlsbC5cblxuXG4gIEJhc2ljIFVzYWdlOlxuICAtLS0tLS0tLS0tLS1cblxuICBgYGBqc1xuICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIC8vIG9uIHN1Y2Nlc3NcbiAgICByZXNvbHZlKHZhbHVlKTtcblxuICAgIC8vIG9uIGZhaWx1cmVcbiAgICByZWplY3QocmVhc29uKTtcbiAgfSk7XG5cbiAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgLy8gb24gcmVqZWN0aW9uXG4gIH0pO1xuICBgYGBcblxuICBBZHZhbmNlZCBVc2FnZTpcbiAgLS0tLS0tLS0tLS0tLS0tXG5cbiAgUHJvbWlzZXMgc2hpbmUgd2hlbiBhYnN0cmFjdGluZyBhd2F5IGFzeW5jaHJvbm91cyBpbnRlcmFjdGlvbnMgc3VjaCBhc1xuICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICBgYGBqc1xuICBmdW5jdGlvbiBnZXRKU09OKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gdGhpcy5ET05FKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAvLyBvbiBmdWxmaWxsbWVudFxuICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAvLyBvbiByZWplY3Rpb25cbiAgfSk7XG4gIGBgYFxuXG4gIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgYGBganNcbiAgUHJvbWlzZS5hbGwoW1xuICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgIGdldEpTT04oJy9jb21tZW50cycpXG4gIF0pLnRoZW4oZnVuY3Rpb24odmFsdWVzKXtcbiAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgdmFsdWVzWzFdIC8vID0+IGNvbW1lbnRzSlNPTlxuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfSk7XG4gIGBgYFxuXG4gIEBjbGFzcyBQcm9taXNlXG4gIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgQGNvbnN0cnVjdG9yXG4qL1xuZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICB0aGlzW1BST01JU0VfSURdID0gbmV4dElkKCk7XG4gIHRoaXMuX3Jlc3VsdCA9IHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICB0aGlzLl9zdWJzY3JpYmVycyA9IFtdO1xuXG4gIGlmIChub29wICE9PSByZXNvbHZlcikge1xuICAgIHR5cGVvZiByZXNvbHZlciAhPT0gJ2Z1bmN0aW9uJyAmJiBuZWVkc1Jlc29sdmVyKCk7XG4gICAgdGhpcyBpbnN0YW5jZW9mIFByb21pc2UgPyBpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcikgOiBuZWVkc05ldygpO1xuICB9XG59XG5cblByb21pc2UuYWxsID0gYWxsO1xuUHJvbWlzZS5yYWNlID0gcmFjZTtcblByb21pc2UucmVzb2x2ZSA9IHJlc29sdmU7XG5Qcm9taXNlLnJlamVjdCA9IHJlamVjdDtcblByb21pc2UuX3NldFNjaGVkdWxlciA9IHNldFNjaGVkdWxlcjtcblByb21pc2UuX3NldEFzYXAgPSBzZXRBc2FwO1xuUHJvbWlzZS5fYXNhcCA9IGFzYXA7XG5cblByb21pc2UucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogUHJvbWlzZSxcblxuICAvKipcbiAgICBUaGUgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCxcbiAgICB3aGljaCByZWdpc3RlcnMgY2FsbGJhY2tzIHRvIHJlY2VpdmUgZWl0aGVyIGEgcHJvbWlzZSdzIGV2ZW50dWFsIHZhbHVlIG9yIHRoZVxuICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAvLyB1c2VyIGlzIGF2YWlsYWJsZVxuICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyB1c2VyIGlzIHVuYXZhaWxhYmxlLCBhbmQgeW91IGFyZSBnaXZlbiB0aGUgcmVhc29uIHdoeVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBDaGFpbmluZ1xuICAgIC0tLS0tLS0tXG4gIFxuICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgYHRoZW5gIGlzIGl0c2VsZiBhIHByb21pc2UuICBUaGlzIHNlY29uZCwgJ2Rvd25zdHJlYW0nXG4gICAgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZpcnN0IHByb21pc2UncyBmdWxmaWxsbWVudFxuICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICBcbiAgICBgYGBqc1xuICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXIubmFtZTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICByZXR1cm4gJ2RlZmF1bHQgbmFtZSc7XG4gICAgfSkudGhlbihmdW5jdGlvbiAodXNlck5hbWUpIHtcbiAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgIC8vIHdpbGwgYmUgYCdkZWZhdWx0IG5hbWUnYFxuICAgIH0pO1xuICBcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAvLyBJZiBgZmluZFVzZXJgIHJlamVjdGVkLCBgcmVhc29uYCB3aWxsIGJlICdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jy5cbiAgICB9KTtcbiAgICBgYGBcbiAgICBJZiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIGRvZXMgbm90IHNwZWNpZnkgYSByZWplY3Rpb24gaGFuZGxlciwgcmVqZWN0aW9uIHJlYXNvbnMgd2lsbCBiZSBwcm9wYWdhdGVkIGZ1cnRoZXIgZG93bnN0cmVhbS5cbiAgXG4gICAgYGBganNcbiAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgLy8gbmV2ZXIgcmVhY2hlZFxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgQXNzaW1pbGF0aW9uXG4gICAgLS0tLS0tLS0tLS0tXG4gIFxuICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgcmV0cmlldmVkIGFzeW5jaHJvbm91c2x5LiBUaGlzIGNhbiBiZSBhY2hpZXZlZCBieSByZXR1cm5pbmcgYSBwcm9taXNlIGluIHRoZVxuICAgIGZ1bGZpbGxtZW50IG9yIHJlamVjdGlvbiBoYW5kbGVyLiBUaGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgdGhlbiBiZSBwZW5kaW5nXG4gICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIFRoZSB1c2VyJ3MgY29tbWVudHMgYXJlIG5vdyBhdmFpbGFibGVcbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICByZXR1cm4gZmluZENvbW1lbnRzQnlBdXRob3IodXNlcik7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgIC8vIElmIGBmaW5kQ29tbWVudHNCeUF1dGhvcmAgZnVsZmlsbHMsIHdlJ2xsIGhhdmUgdGhlIHZhbHVlIGhlcmVcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIFNpbXBsZSBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IHJlc3VsdDtcbiAgXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGZpbmRSZXN1bHQoKTtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH1cbiAgICBgYGBcbiAgXG4gICAgRXJyYmFjayBFeGFtcGxlXG4gIFxuICAgIGBgYGpzXG4gICAgZmluZFJlc3VsdChmdW5jdGlvbihyZXN1bHQsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH1cbiAgICB9KTtcbiAgICBgYGBcbiAgXG4gICAgUHJvbWlzZSBFeGFtcGxlO1xuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgZmluZFJlc3VsdCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIC8vIHN1Y2Nlc3NcbiAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgLy8gZmFpbHVyZVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgLS0tLS0tLS0tLS0tLS1cbiAgXG4gICAgU3luY2hyb25vdXMgRXhhbXBsZVxuICBcbiAgICBgYGBqYXZhc2NyaXB0XG4gICAgbGV0IGF1dGhvciwgYm9va3M7XG4gIFxuICAgIHRyeSB7XG4gICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICBib29rcyAgPSBmaW5kQm9va3NCeUF1dGhvcihhdXRob3IpO1xuICAgICAgLy8gc3VjY2Vzc1xuICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAvLyBmYWlsdXJlXG4gICAgfVxuICAgIGBgYFxuICBcbiAgICBFcnJiYWNrIEV4YW1wbGVcbiAgXG4gICAgYGBganNcbiAgXG4gICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuICBcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG4gIFxuICAgIH1cbiAgXG4gICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGZhaWx1cmUoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm91bmRCb29rcyhib29rcyk7XG4gICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgZmFpbHVyZShyZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgfVxuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBQcm9taXNlIEV4YW1wbGU7XG4gIFxuICAgIGBgYGphdmFzY3JpcHRcbiAgICBmaW5kQXV0aG9yKCkuXG4gICAgICB0aGVuKGZpbmRCb29rc0J5QXV0aG9yKS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oYm9va3Mpe1xuICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAvLyBzb21ldGhpbmcgd2VudCB3cm9uZ1xuICAgIH0pO1xuICAgIGBgYFxuICBcbiAgICBAbWV0aG9kIHRoZW5cbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZ1bGZpbGxlZFxuICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgQHJldHVybiB7UHJvbWlzZX1cbiAgKi9cbiAgdGhlbjogdGhlbixcblxuICAvKipcbiAgICBgY2F0Y2hgIGlzIHNpbXBseSBzdWdhciBmb3IgYHRoZW4odW5kZWZpbmVkLCBvblJlamVjdGlvbilgIHdoaWNoIG1ha2VzIGl0IHRoZSBzYW1lXG4gICAgYXMgdGhlIGNhdGNoIGJsb2NrIG9mIGEgdHJ5L2NhdGNoIHN0YXRlbWVudC5cbiAgXG4gICAgYGBganNcbiAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkbid0IGZpbmQgdGhhdCBhdXRob3InKTtcbiAgICB9XG4gIFxuICAgIC8vIHN5bmNocm9ub3VzXG4gICAgdHJ5IHtcbiAgICAgIGZpbmRBdXRob3IoKTtcbiAgICB9IGNhdGNoKHJlYXNvbikge1xuICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICB9XG4gIFxuICAgIC8vIGFzeW5jIHdpdGggcHJvbWlzZXNcbiAgICBmaW5kQXV0aG9yKCkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgfSk7XG4gICAgYGBgXG4gIFxuICAgIEBtZXRob2QgY2F0Y2hcbiAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICBAcmV0dXJuIHtQcm9taXNlfVxuICAqL1xuICAnY2F0Y2gnOiBmdW5jdGlvbiBfY2F0Y2gob25SZWplY3Rpb24pIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgdmFyIGxvY2FsID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gZ2xvYmFsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGxvY2FsID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbG9jYWwgPSBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHlmaWxsIGZhaWxlZCBiZWNhdXNlIGdsb2JhbCBvYmplY3QgaXMgdW5hdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFAgPSBsb2NhbC5Qcm9taXNlO1xuXG4gICAgaWYgKFApIHtcbiAgICAgICAgdmFyIHByb21pc2VUb1N0cmluZyA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoUC5yZXNvbHZlKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBzaWxlbnRseSBpZ25vcmVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvbWlzZVRvU3RyaW5nID09PSAnW29iamVjdCBQcm9taXNlXScgJiYgIVAuY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWwuUHJvbWlzZSA9IFByb21pc2U7XG59XG5cbi8vIFN0cmFuZ2UgY29tcGF0Li5cblByb21pc2UucG9seWZpbGwgPSBwb2x5ZmlsbDtcblByb21pc2UuUHJvbWlzZSA9IFByb21pc2U7XG5cbnJldHVybiBQcm9taXNlO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXM2LXByb21pc2UubWFwIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gTXVsdGlieXRlIGNvZGVjLiBJbiB0aGlzIHNjaGVtZSwgYSBjaGFyYWN0ZXIgaXMgcmVwcmVzZW50ZWQgYnkgMSBvciBtb3JlIGJ5dGVzLlxuLy8gT3VyIGNvZGVjIHN1cHBvcnRzIFVURi0xNiBzdXJyb2dhdGVzLCBleHRlbnNpb25zIGZvciBHQjE4MDMwIGFuZCB1bmljb2RlIHNlcXVlbmNlcy5cbi8vIFRvIHNhdmUgbWVtb3J5IGFuZCBsb2FkaW5nIHRpbWUsIHdlIHJlYWQgdGFibGUgZmlsZXMgb25seSB3aGVuIHJlcXVlc3RlZC5cblxuZXhwb3J0cy5fZGJjcyA9IERCQ1NDb2RlYztcblxudmFyIFVOQVNTSUdORUQgPSAtMSxcbiAgICBHQjE4MDMwX0NPREUgPSAtMixcbiAgICBTRVFfU1RBUlQgID0gLTEwLFxuICAgIE5PREVfU1RBUlQgPSAtMTAwMCxcbiAgICBVTkFTU0lHTkVEX05PREUgPSBuZXcgQXJyYXkoMHgxMDApLFxuICAgIERFRl9DSEFSID0gLTE7XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgMHgxMDA7IGkrKylcbiAgICBVTkFTU0lHTkVEX05PREVbaV0gPSBVTkFTU0lHTkVEO1xuXG5cbi8vIENsYXNzIERCQ1NDb2RlYyByZWFkcyBhbmQgaW5pdGlhbGl6ZXMgbWFwcGluZyB0YWJsZXMuXG5mdW5jdGlvbiBEQkNTQ29kZWMoY29kZWNPcHRpb25zLCBpY29udikge1xuICAgIHRoaXMuZW5jb2RpbmdOYW1lID0gY29kZWNPcHRpb25zLmVuY29kaW5nTmFtZTtcbiAgICBpZiAoIWNvZGVjT3B0aW9ucylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREJDUyBjb2RlYyBpcyBjYWxsZWQgd2l0aG91dCB0aGUgZGF0YS5cIilcbiAgICBpZiAoIWNvZGVjT3B0aW9ucy50YWJsZSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5jb2RpbmcgJ1wiICsgdGhpcy5lbmNvZGluZ05hbWUgKyBcIicgaGFzIG5vIGRhdGEuXCIpO1xuXG4gICAgLy8gTG9hZCB0YWJsZXMuXG4gICAgdmFyIG1hcHBpbmdUYWJsZSA9IGNvZGVjT3B0aW9ucy50YWJsZSgpO1xuXG5cbiAgICAvLyBEZWNvZGUgdGFibGVzOiBNQkNTIC0+IFVuaWNvZGUuXG5cbiAgICAvLyBkZWNvZGVUYWJsZXMgaXMgYSB0cmllLCBlbmNvZGVkIGFzIGFuIGFycmF5IG9mIGFycmF5cyBvZiBpbnRlZ2Vycy4gSW50ZXJuYWwgYXJyYXlzIGFyZSB0cmllIG5vZGVzIGFuZCBhbGwgaGF2ZSBsZW4gPSAyNTYuXG4gICAgLy8gVHJpZSByb290IGlzIGRlY29kZVRhYmxlc1swXS5cbiAgICAvLyBWYWx1ZXM6ID49ICAwIC0+IHVuaWNvZGUgY2hhcmFjdGVyIGNvZGUuIGNhbiBiZSA+IDB4RkZGRlxuICAgIC8vICAgICAgICAgPT0gVU5BU1NJR05FRCAtPiB1bmtub3duL3VuYXNzaWduZWQgc2VxdWVuY2UuXG4gICAgLy8gICAgICAgICA9PSBHQjE4MDMwX0NPREUgLT4gdGhpcyBpcyB0aGUgZW5kIG9mIGEgR0IxODAzMCA0LWJ5dGUgc2VxdWVuY2UuXG4gICAgLy8gICAgICAgICA8PSBOT0RFX1NUQVJUIC0+IGluZGV4IG9mIHRoZSBuZXh0IG5vZGUgaW4gb3VyIHRyaWUgdG8gcHJvY2VzcyBuZXh0IGJ5dGUuXG4gICAgLy8gICAgICAgICA8PSBTRVFfU1RBUlQgIC0+IGluZGV4IG9mIHRoZSBzdGFydCBvZiBhIGNoYXJhY3RlciBjb2RlIHNlcXVlbmNlLCBpbiBkZWNvZGVUYWJsZVNlcS5cbiAgICB0aGlzLmRlY29kZVRhYmxlcyA9IFtdO1xuICAgIHRoaXMuZGVjb2RlVGFibGVzWzBdID0gVU5BU1NJR05FRF9OT0RFLnNsaWNlKDApOyAvLyBDcmVhdGUgcm9vdCBub2RlLlxuXG4gICAgLy8gU29tZXRpbWVzIGEgTUJDUyBjaGFyIGNvcnJlc3BvbmRzIHRvIGEgc2VxdWVuY2Ugb2YgdW5pY29kZSBjaGFycy4gV2Ugc3RvcmUgdGhlbSBhcyBhcnJheXMgb2YgaW50ZWdlcnMgaGVyZS4gXG4gICAgdGhpcy5kZWNvZGVUYWJsZVNlcSA9IFtdO1xuXG4gICAgLy8gQWN0dWFsIG1hcHBpbmcgdGFibGVzIGNvbnNpc3Qgb2YgY2h1bmtzLiBVc2UgdGhlbSB0byBmaWxsIHVwIGRlY29kZSB0YWJsZXMuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXBwaW5nVGFibGUubGVuZ3RoOyBpKyspXG4gICAgICAgIHRoaXMuX2FkZERlY29kZUNodW5rKG1hcHBpbmdUYWJsZVtpXSk7XG5cbiAgICB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZSA9IGljb252LmRlZmF1bHRDaGFyVW5pY29kZTtcblxuICAgIFxuICAgIC8vIEVuY29kZSB0YWJsZXM6IFVuaWNvZGUgLT4gREJDUy5cblxuICAgIC8vIGBlbmNvZGVUYWJsZWAgaXMgYXJyYXkgbWFwcGluZyBmcm9tIHVuaWNvZGUgY2hhciB0byBlbmNvZGVkIGNoYXIuIEFsbCBpdHMgdmFsdWVzIGFyZSBpbnRlZ2VycyBmb3IgcGVyZm9ybWFuY2UuXG4gICAgLy8gQmVjYXVzZSBpdCBjYW4gYmUgc3BhcnNlLCBpdCBpcyByZXByZXNlbnRlZCBhcyBhcnJheSBvZiBidWNrZXRzIGJ5IDI1NiBjaGFycyBlYWNoLiBCdWNrZXQgY2FuIGJlIG51bGwuXG4gICAgLy8gVmFsdWVzOiA+PSAgMCAtPiBpdCBpcyBhIG5vcm1hbCBjaGFyLiBXcml0ZSB0aGUgdmFsdWUgKGlmIDw9MjU2IHRoZW4gMSBieXRlLCBpZiA8PTY1NTM2IHRoZW4gMiBieXRlcywgZXRjLikuXG4gICAgLy8gICAgICAgICA9PSBVTkFTU0lHTkVEIC0+IG5vIGNvbnZlcnNpb24gZm91bmQuIE91dHB1dCBhIGRlZmF1bHQgY2hhci5cbiAgICAvLyAgICAgICAgIDw9IFNFUV9TVEFSVCAgLT4gaXQncyBhbiBpbmRleCBpbiBlbmNvZGVUYWJsZVNlcSwgc2VlIGJlbG93LiBUaGUgY2hhcmFjdGVyIHN0YXJ0cyBhIHNlcXVlbmNlLlxuICAgIHRoaXMuZW5jb2RlVGFibGUgPSBbXTtcbiAgICBcbiAgICAvLyBgZW5jb2RlVGFibGVTZXFgIGlzIHVzZWQgd2hlbiBhIHNlcXVlbmNlIG9mIHVuaWNvZGUgY2hhcmFjdGVycyBpcyBlbmNvZGVkIGFzIGEgc2luZ2xlIGNvZGUuIFdlIHVzZSBhIHRyZWUgb2ZcbiAgICAvLyBvYmplY3RzIHdoZXJlIGtleXMgY29ycmVzcG9uZCB0byBjaGFyYWN0ZXJzIGluIHNlcXVlbmNlIGFuZCBsZWFmcyBhcmUgdGhlIGVuY29kZWQgZGJjcyB2YWx1ZXMuIEEgc3BlY2lhbCBERUZfQ0hBUiBrZXlcbiAgICAvLyBtZWFucyBlbmQgb2Ygc2VxdWVuY2UgKG5lZWRlZCB3aGVuIG9uZSBzZXF1ZW5jZSBpcyBhIHN0cmljdCBzdWJzZXF1ZW5jZSBvZiBhbm90aGVyKS5cbiAgICAvLyBPYmplY3RzIGFyZSBrZXB0IHNlcGFyYXRlbHkgZnJvbSBlbmNvZGVUYWJsZSB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZS5cbiAgICB0aGlzLmVuY29kZVRhYmxlU2VxID0gW107XG5cbiAgICAvLyBTb21lIGNoYXJzIGNhbiBiZSBkZWNvZGVkLCBidXQgbmVlZCBub3QgYmUgZW5jb2RlZC5cbiAgICB2YXIgc2tpcEVuY29kZUNoYXJzID0ge307XG4gICAgaWYgKGNvZGVjT3B0aW9ucy5lbmNvZGVTa2lwVmFscylcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlY09wdGlvbnMuZW5jb2RlU2tpcFZhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBjb2RlY09wdGlvbnMuZW5jb2RlU2tpcFZhbHNbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgc2tpcEVuY29kZUNoYXJzW3ZhbF0gPSB0cnVlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSB2YWwuZnJvbTsgaiA8PSB2YWwudG87IGorKylcbiAgICAgICAgICAgICAgICAgICAgc2tpcEVuY29kZUNoYXJzW2pdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAvLyBVc2UgZGVjb2RlIHRyaWUgdG8gcmVjdXJzaXZlbHkgZmlsbCBvdXQgZW5jb2RlIHRhYmxlcy5cbiAgICB0aGlzLl9maWxsRW5jb2RlVGFibGUoMCwgMCwgc2tpcEVuY29kZUNoYXJzKTtcblxuICAgIC8vIEFkZCBtb3JlIGVuY29kaW5nIHBhaXJzIHdoZW4gbmVlZGVkLlxuICAgIGlmIChjb2RlY09wdGlvbnMuZW5jb2RlQWRkKSB7XG4gICAgICAgIGZvciAodmFyIHVDaGFyIGluIGNvZGVjT3B0aW9ucy5lbmNvZGVBZGQpXG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvZGVjT3B0aW9ucy5lbmNvZGVBZGQsIHVDaGFyKSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRFbmNvZGVDaGFyKHVDaGFyLmNoYXJDb2RlQXQoMCksIGNvZGVjT3B0aW9ucy5lbmNvZGVBZGRbdUNoYXJdKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlZkNoYXJTQiAgPSB0aGlzLmVuY29kZVRhYmxlWzBdW2ljb252LmRlZmF1bHRDaGFyU2luZ2xlQnl0ZS5jaGFyQ29kZUF0KDApXTtcbiAgICBpZiAodGhpcy5kZWZDaGFyU0IgPT09IFVOQVNTSUdORUQpIHRoaXMuZGVmQ2hhclNCID0gdGhpcy5lbmNvZGVUYWJsZVswXVsnPyddO1xuICAgIGlmICh0aGlzLmRlZkNoYXJTQiA9PT0gVU5BU1NJR05FRCkgdGhpcy5kZWZDaGFyU0IgPSBcIj9cIi5jaGFyQ29kZUF0KDApO1xuXG5cbiAgICAvLyBMb2FkICYgY3JlYXRlIEdCMTgwMzAgdGFibGVzIHdoZW4gbmVlZGVkLlxuICAgIGlmICh0eXBlb2YgY29kZWNPcHRpb25zLmdiMTgwMzAgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5nYjE4MDMwID0gY29kZWNPcHRpb25zLmdiMTgwMzAoKTsgLy8gTG9hZCBHQjE4MDMwIHJhbmdlcy5cblxuICAgICAgICAvLyBBZGQgR0IxODAzMCBkZWNvZGUgdGFibGVzLlxuICAgICAgICB2YXIgdGhpcmRCeXRlTm9kZUlkeCA9IHRoaXMuZGVjb2RlVGFibGVzLmxlbmd0aDtcbiAgICAgICAgdmFyIHRoaXJkQnl0ZU5vZGUgPSB0aGlzLmRlY29kZVRhYmxlc1t0aGlyZEJ5dGVOb2RlSWR4XSA9IFVOQVNTSUdORURfTk9ERS5zbGljZSgwKTtcblxuICAgICAgICB2YXIgZm91cnRoQnl0ZU5vZGVJZHggPSB0aGlzLmRlY29kZVRhYmxlcy5sZW5ndGg7XG4gICAgICAgIHZhciBmb3VydGhCeXRlTm9kZSA9IHRoaXMuZGVjb2RlVGFibGVzW2ZvdXJ0aEJ5dGVOb2RlSWR4XSA9IFVOQVNTSUdORURfTk9ERS5zbGljZSgwKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMHg4MTsgaSA8PSAweEZFOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzZWNvbmRCeXRlTm9kZUlkeCA9IE5PREVfU1RBUlQgLSB0aGlzLmRlY29kZVRhYmxlc1swXVtpXTtcbiAgICAgICAgICAgIHZhciBzZWNvbmRCeXRlTm9kZSA9IHRoaXMuZGVjb2RlVGFibGVzW3NlY29uZEJ5dGVOb2RlSWR4XTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAweDMwOyBqIDw9IDB4Mzk7IGorKylcbiAgICAgICAgICAgICAgICBzZWNvbmRCeXRlTm9kZVtqXSA9IE5PREVfU1RBUlQgLSB0aGlyZEJ5dGVOb2RlSWR4O1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAweDgxOyBpIDw9IDB4RkU7IGkrKylcbiAgICAgICAgICAgIHRoaXJkQnl0ZU5vZGVbaV0gPSBOT0RFX1NUQVJUIC0gZm91cnRoQnl0ZU5vZGVJZHg7XG4gICAgICAgIGZvciAodmFyIGkgPSAweDMwOyBpIDw9IDB4Mzk7IGkrKylcbiAgICAgICAgICAgIGZvdXJ0aEJ5dGVOb2RlW2ldID0gR0IxODAzMF9DT0RFXG4gICAgfSAgICAgICAgXG59XG5cbkRCQ1NDb2RlYy5wcm90b3R5cGUuZW5jb2RlciA9IERCQ1NFbmNvZGVyO1xuREJDU0NvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gREJDU0RlY29kZXI7XG5cbi8vIERlY29kZXIgaGVscGVyc1xuREJDU0NvZGVjLnByb3RvdHlwZS5fZ2V0RGVjb2RlVHJpZU5vZGUgPSBmdW5jdGlvbihhZGRyKSB7XG4gICAgdmFyIGJ5dGVzID0gW107XG4gICAgZm9yICg7IGFkZHIgPiAwOyBhZGRyID4+PSA4KVxuICAgICAgICBieXRlcy5wdXNoKGFkZHIgJiAweEZGKTtcbiAgICBpZiAoYnl0ZXMubGVuZ3RoID09IDApXG4gICAgICAgIGJ5dGVzLnB1c2goMCk7XG5cbiAgICB2YXIgbm9kZSA9IHRoaXMuZGVjb2RlVGFibGVzWzBdO1xuICAgIGZvciAodmFyIGkgPSBieXRlcy5sZW5ndGgtMTsgaSA+IDA7IGktLSkgeyAvLyBUcmF2ZXJzZSBub2RlcyBkZWVwZXIgaW50byB0aGUgdHJpZS5cbiAgICAgICAgdmFyIHZhbCA9IG5vZGVbYnl0ZXNbaV1dO1xuXG4gICAgICAgIGlmICh2YWwgPT0gVU5BU1NJR05FRCkgeyAvLyBDcmVhdGUgbmV3IG5vZGUuXG4gICAgICAgICAgICBub2RlW2J5dGVzW2ldXSA9IE5PREVfU1RBUlQgLSB0aGlzLmRlY29kZVRhYmxlcy5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmRlY29kZVRhYmxlcy5wdXNoKG5vZGUgPSBVTkFTU0lHTkVEX05PREUuc2xpY2UoMCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbCA8PSBOT0RFX1NUQVJUKSB7IC8vIEV4aXN0aW5nIG5vZGUuXG4gICAgICAgICAgICBub2RlID0gdGhpcy5kZWNvZGVUYWJsZXNbTk9ERV9TVEFSVCAtIHZhbF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT3ZlcndyaXRlIGJ5dGUgaW4gXCIgKyB0aGlzLmVuY29kaW5nTmFtZSArIFwiLCBhZGRyOiBcIiArIGFkZHIudG9TdHJpbmcoMTYpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cblxuREJDU0NvZGVjLnByb3RvdHlwZS5fYWRkRGVjb2RlQ2h1bmsgPSBmdW5jdGlvbihjaHVuaykge1xuICAgIC8vIEZpcnN0IGVsZW1lbnQgb2YgY2h1bmsgaXMgdGhlIGhleCBtYmNzIGNvZGUgd2hlcmUgd2Ugc3RhcnQuXG4gICAgdmFyIGN1ckFkZHIgPSBwYXJzZUludChjaHVua1swXSwgMTYpO1xuXG4gICAgLy8gQ2hvb3NlIHRoZSBkZWNvZGluZyBub2RlIHdoZXJlIHdlJ2xsIHdyaXRlIG91ciBjaGFycy5cbiAgICB2YXIgd3JpdGVUYWJsZSA9IHRoaXMuX2dldERlY29kZVRyaWVOb2RlKGN1ckFkZHIpO1xuICAgIGN1ckFkZHIgPSBjdXJBZGRyICYgMHhGRjtcblxuICAgIC8vIFdyaXRlIGFsbCBvdGhlciBlbGVtZW50cyBvZiB0aGUgY2h1bmsgdG8gdGhlIHRhYmxlLlxuICAgIGZvciAodmFyIGsgPSAxOyBrIDwgY2h1bmsubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSBjaHVua1trXTtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJ0ID09PSBcInN0cmluZ1wiKSB7IC8vIFN0cmluZywgd3JpdGUgYXMtaXMuXG4gICAgICAgICAgICBmb3IgKHZhciBsID0gMDsgbCA8IHBhcnQubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgIHZhciBjb2RlID0gcGFydC5jaGFyQ29kZUF0KGwrKyk7XG4gICAgICAgICAgICAgICAgaWYgKDB4RDgwMCA8PSBjb2RlICYmIGNvZGUgPCAweERDMDApIHsgLy8gRGVjb2RlIHN1cnJvZ2F0ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZVRyYWlsID0gcGFydC5jaGFyQ29kZUF0KGwrKyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgweERDMDAgPD0gY29kZVRyYWlsICYmIGNvZGVUcmFpbCA8IDB4RTAwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRlVGFibGVbY3VyQWRkcisrXSA9IDB4MTAwMDAgKyAoY29kZSAtIDB4RDgwMCkgKiAweDQwMCArIChjb2RlVHJhaWwgLSAweERDMDApO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbmNvcnJlY3Qgc3Vycm9nYXRlIHBhaXIgaW4gXCIgICsgdGhpcy5lbmNvZGluZ05hbWUgKyBcIiBhdCBjaHVuayBcIiArIGNodW5rWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoMHgwRkYwIDwgY29kZSAmJiBjb2RlIDw9IDB4MEZGRikgeyAvLyBDaGFyYWN0ZXIgc2VxdWVuY2UgKG91ciBvd24gZW5jb2RpbmcgdXNlZClcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IDB4RkZGIC0gY29kZSArIDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCBsZW47IG0rKylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5wdXNoKHBhcnQuY2hhckNvZGVBdChsKyspKTsgLy8gU2ltcGxlIHZhcmlhdGlvbjogZG9uJ3Qgc3VwcG9ydCBzdXJyb2dhdGVzIG9yIHN1YnNlcXVlbmNlcyBpbiBzZXEuXG5cbiAgICAgICAgICAgICAgICAgICAgd3JpdGVUYWJsZVtjdXJBZGRyKytdID0gU0VRX1NUQVJUIC0gdGhpcy5kZWNvZGVUYWJsZVNlcS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVjb2RlVGFibGVTZXEucHVzaChzZXEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHdyaXRlVGFibGVbY3VyQWRkcisrXSA9IGNvZGU7IC8vIEJhc2ljIGNoYXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcnQgPT09IFwibnVtYmVyXCIpIHsgLy8gSW50ZWdlciwgbWVhbmluZyBpbmNyZWFzaW5nIHNlcXVlbmNlIHN0YXJ0aW5nIHdpdGggcHJldiBjaGFyYWN0ZXIuXG4gICAgICAgICAgICB2YXIgY2hhckNvZGUgPSB3cml0ZVRhYmxlW2N1ckFkZHIgLSAxXSArIDE7XG4gICAgICAgICAgICBmb3IgKHZhciBsID0gMDsgbCA8IHBhcnQ7IGwrKylcbiAgICAgICAgICAgICAgICB3cml0ZVRhYmxlW2N1ckFkZHIrK10gPSBjaGFyQ29kZSsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluY29ycmVjdCB0eXBlICdcIiArIHR5cGVvZiBwYXJ0ICsgXCInIGdpdmVuIGluIFwiICArIHRoaXMuZW5jb2RpbmdOYW1lICsgXCIgYXQgY2h1bmsgXCIgKyBjaHVua1swXSk7XG4gICAgfVxuICAgIGlmIChjdXJBZGRyID4gMHhGRilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5jb3JyZWN0IGNodW5rIGluIFwiICArIHRoaXMuZW5jb2RpbmdOYW1lICsgXCIgYXQgYWRkciBcIiArIGNodW5rWzBdICsgXCI6IHRvbyBsb25nXCIgKyBjdXJBZGRyKTtcbn1cblxuLy8gRW5jb2RlciBoZWxwZXJzXG5EQkNTQ29kZWMucHJvdG90eXBlLl9nZXRFbmNvZGVCdWNrZXQgPSBmdW5jdGlvbih1Q29kZSkge1xuICAgIHZhciBoaWdoID0gdUNvZGUgPj4gODsgLy8gVGhpcyBjb3VsZCBiZSA+IDB4RkYgYmVjYXVzZSBvZiBhc3RyYWwgY2hhcmFjdGVycy5cbiAgICBpZiAodGhpcy5lbmNvZGVUYWJsZVtoaWdoXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLmVuY29kZVRhYmxlW2hpZ2hdID0gVU5BU1NJR05FRF9OT0RFLnNsaWNlKDApOyAvLyBDcmVhdGUgYnVja2V0IG9uIGRlbWFuZC5cbiAgICByZXR1cm4gdGhpcy5lbmNvZGVUYWJsZVtoaWdoXTtcbn1cblxuREJDU0NvZGVjLnByb3RvdHlwZS5fc2V0RW5jb2RlQ2hhciA9IGZ1bmN0aW9uKHVDb2RlLCBkYmNzQ29kZSkge1xuICAgIHZhciBidWNrZXQgPSB0aGlzLl9nZXRFbmNvZGVCdWNrZXQodUNvZGUpO1xuICAgIHZhciBsb3cgPSB1Q29kZSAmIDB4RkY7XG4gICAgaWYgKGJ1Y2tldFtsb3ddIDw9IFNFUV9TVEFSVClcbiAgICAgICAgdGhpcy5lbmNvZGVUYWJsZVNlcVtTRVFfU1RBUlQtYnVja2V0W2xvd11dW0RFRl9DSEFSXSA9IGRiY3NDb2RlOyAvLyBUaGVyZSdzIGFscmVhZHkgYSBzZXF1ZW5jZSwgc2V0IGEgc2luZ2xlLWNoYXIgc3Vic2VxdWVuY2Ugb2YgaXQuXG4gICAgZWxzZSBpZiAoYnVja2V0W2xvd10gPT0gVU5BU1NJR05FRClcbiAgICAgICAgYnVja2V0W2xvd10gPSBkYmNzQ29kZTtcbn1cblxuREJDU0NvZGVjLnByb3RvdHlwZS5fc2V0RW5jb2RlU2VxdWVuY2UgPSBmdW5jdGlvbihzZXEsIGRiY3NDb2RlKSB7XG4gICAgXG4gICAgLy8gR2V0IHRoZSByb290IG9mIGNoYXJhY3RlciB0cmVlIGFjY29yZGluZyB0byBmaXJzdCBjaGFyYWN0ZXIgb2YgdGhlIHNlcXVlbmNlLlxuICAgIHZhciB1Q29kZSA9IHNlcVswXTtcbiAgICB2YXIgYnVja2V0ID0gdGhpcy5fZ2V0RW5jb2RlQnVja2V0KHVDb2RlKTtcbiAgICB2YXIgbG93ID0gdUNvZGUgJiAweEZGO1xuXG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKGJ1Y2tldFtsb3ddIDw9IFNFUV9TVEFSVCkge1xuICAgICAgICAvLyBUaGVyZSdzIGFscmVhZHkgYSBzZXF1ZW5jZSB3aXRoICAtIHVzZSBpdC5cbiAgICAgICAgbm9kZSA9IHRoaXMuZW5jb2RlVGFibGVTZXFbU0VRX1NUQVJULWJ1Y2tldFtsb3ddXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFRoZXJlIHdhcyBubyBzZXF1ZW5jZSBvYmplY3QgLSBhbGxvY2F0ZSBhIG5ldyBvbmUuXG4gICAgICAgIG5vZGUgPSB7fTtcbiAgICAgICAgaWYgKGJ1Y2tldFtsb3ddICE9PSBVTkFTU0lHTkVEKSBub2RlW0RFRl9DSEFSXSA9IGJ1Y2tldFtsb3ddOyAvLyBJZiBhIGNoYXIgd2FzIHNldCBiZWZvcmUgLSBtYWtlIGl0IGEgc2luZ2xlLWNoYXIgc3Vic2VxdWVuY2UuXG4gICAgICAgIGJ1Y2tldFtsb3ddID0gU0VRX1NUQVJUIC0gdGhpcy5lbmNvZGVUYWJsZVNlcS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZW5jb2RlVGFibGVTZXEucHVzaChub2RlKTtcbiAgICB9XG5cbiAgICAvLyBUcmF2ZXJzZSB0aGUgY2hhcmFjdGVyIHRyZWUsIGFsbG9jYXRpbmcgbmV3IG5vZGVzIGFzIG5lZWRlZC5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8IHNlcS5sZW5ndGgtMTsgaisrKSB7XG4gICAgICAgIHZhciBvbGRWYWwgPSBub2RlW3VDb2RlXTtcbiAgICAgICAgaWYgKHR5cGVvZiBvbGRWYWwgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgbm9kZSA9IG9sZFZhbDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZVt1Q29kZV0gPSB7fVxuICAgICAgICAgICAgaWYgKG9sZFZhbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG5vZGVbREVGX0NIQVJdID0gb2xkVmFsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGxlYWYgdG8gZ2l2ZW4gZGJjc0NvZGUuXG4gICAgdUNvZGUgPSBzZXFbc2VxLmxlbmd0aC0xXTtcbiAgICBub2RlW3VDb2RlXSA9IGRiY3NDb2RlO1xufVxuXG5EQkNTQ29kZWMucHJvdG90eXBlLl9maWxsRW5jb2RlVGFibGUgPSBmdW5jdGlvbihub2RlSWR4LCBwcmVmaXgsIHNraXBFbmNvZGVDaGFycykge1xuICAgIHZhciBub2RlID0gdGhpcy5kZWNvZGVUYWJsZXNbbm9kZUlkeF07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAweDEwMDsgaSsrKSB7XG4gICAgICAgIHZhciB1Q29kZSA9IG5vZGVbaV07XG4gICAgICAgIHZhciBtYkNvZGUgPSBwcmVmaXggKyBpO1xuICAgICAgICBpZiAoc2tpcEVuY29kZUNoYXJzW21iQ29kZV0pXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBpZiAodUNvZGUgPj0gMClcbiAgICAgICAgICAgIHRoaXMuX3NldEVuY29kZUNoYXIodUNvZGUsIG1iQ29kZSk7XG4gICAgICAgIGVsc2UgaWYgKHVDb2RlIDw9IE5PREVfU1RBUlQpXG4gICAgICAgICAgICB0aGlzLl9maWxsRW5jb2RlVGFibGUoTk9ERV9TVEFSVCAtIHVDb2RlLCBtYkNvZGUgPDwgOCwgc2tpcEVuY29kZUNoYXJzKTtcbiAgICAgICAgZWxzZSBpZiAodUNvZGUgPD0gU0VRX1NUQVJUKVxuICAgICAgICAgICAgdGhpcy5fc2V0RW5jb2RlU2VxdWVuY2UodGhpcy5kZWNvZGVUYWJsZVNlcVtTRVFfU1RBUlQgLSB1Q29kZV0sIG1iQ29kZSk7XG4gICAgfVxufVxuXG5cblxuLy8gPT0gRW5jb2RlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gREJDU0VuY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICAvLyBFbmNvZGVyIHN0YXRlXG4gICAgdGhpcy5sZWFkU3Vycm9nYXRlID0gLTE7XG4gICAgdGhpcy5zZXFPYmogPSB1bmRlZmluZWQ7XG4gICAgXG4gICAgLy8gU3RhdGljIGRhdGFcbiAgICB0aGlzLmVuY29kZVRhYmxlID0gY29kZWMuZW5jb2RlVGFibGU7XG4gICAgdGhpcy5lbmNvZGVUYWJsZVNlcSA9IGNvZGVjLmVuY29kZVRhYmxlU2VxO1xuICAgIHRoaXMuZGVmYXVsdENoYXJTaW5nbGVCeXRlID0gY29kZWMuZGVmQ2hhclNCO1xuICAgIHRoaXMuZ2IxODAzMCA9IGNvZGVjLmdiMTgwMzA7XG59XG5cbkRCQ1NFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHN0ci5sZW5ndGggKiAodGhpcy5nYjE4MDMwID8gNCA6IDMpKSwgXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSB0aGlzLmxlYWRTdXJyb2dhdGUsXG4gICAgICAgIHNlcU9iaiA9IHRoaXMuc2VxT2JqLCBuZXh0Q2hhciA9IC0xLFxuICAgICAgICBpID0gMCwgaiA9IDA7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvLyAwLiBHZXQgbmV4dCBjaGFyYWN0ZXIuXG4gICAgICAgIGlmIChuZXh0Q2hhciA9PT0gLTEpIHtcbiAgICAgICAgICAgIGlmIChpID09IHN0ci5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgdmFyIHVDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB1Q29kZSA9IG5leHRDaGFyO1xuICAgICAgICAgICAgbmV4dENoYXIgPSAtMTsgICAgXG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiBIYW5kbGUgc3Vycm9nYXRlcy5cbiAgICAgICAgaWYgKDB4RDgwMCA8PSB1Q29kZSAmJiB1Q29kZSA8IDB4RTAwMCkgeyAvLyBDaGFyIGlzIG9uZSBvZiBzdXJyb2dhdGVzLlxuICAgICAgICAgICAgaWYgKHVDb2RlIDwgMHhEQzAwKSB7IC8vIFdlJ3ZlIGdvdCBsZWFkIHN1cnJvZ2F0ZS5cbiAgICAgICAgICAgICAgICBpZiAobGVhZFN1cnJvZ2F0ZSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IHVDb2RlO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZWFkU3Vycm9nYXRlID0gdUNvZGU7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvdWJsZSBsZWFkIHN1cnJvZ2F0ZSBmb3VuZC5cbiAgICAgICAgICAgICAgICAgICAgdUNvZGUgPSBVTkFTU0lHTkVEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFdlJ3ZlIGdvdCB0cmFpbCBzdXJyb2dhdGUuXG4gICAgICAgICAgICAgICAgaWYgKGxlYWRTdXJyb2dhdGUgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHVDb2RlID0gMHgxMDAwMCArIChsZWFkU3Vycm9nYXRlIC0gMHhEODAwKSAqIDB4NDAwICsgKHVDb2RlIC0gMHhEQzAwKTtcbiAgICAgICAgICAgICAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IC0xO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluY29tcGxldGUgc3Vycm9nYXRlIHBhaXIgLSBvbmx5IHRyYWlsIHN1cnJvZ2F0ZSBmb3VuZC5cbiAgICAgICAgICAgICAgICAgICAgdUNvZGUgPSBVTkFTU0lHTkVEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsZWFkU3Vycm9nYXRlICE9PSAtMSkge1xuICAgICAgICAgICAgLy8gSW5jb21wbGV0ZSBzdXJyb2dhdGUgcGFpciAtIG9ubHkgbGVhZCBzdXJyb2dhdGUgZm91bmQuXG4gICAgICAgICAgICBuZXh0Q2hhciA9IHVDb2RlOyB1Q29kZSA9IFVOQVNTSUdORUQ7IC8vIFdyaXRlIGFuIGVycm9yLCB0aGVuIGN1cnJlbnQgY2hhci5cbiAgICAgICAgICAgIGxlYWRTdXJyb2dhdGUgPSAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIENvbnZlcnQgdUNvZGUgY2hhcmFjdGVyLlxuICAgICAgICB2YXIgZGJjc0NvZGUgPSBVTkFTU0lHTkVEO1xuICAgICAgICBpZiAoc2VxT2JqICE9PSB1bmRlZmluZWQgJiYgdUNvZGUgIT0gVU5BU1NJR05FRCkgeyAvLyBXZSBhcmUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgc2VxdWVuY2VcbiAgICAgICAgICAgIHZhciByZXNDb2RlID0gc2VxT2JqW3VDb2RlXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzQ29kZSA9PT0gJ29iamVjdCcpIHsgLy8gU2VxdWVuY2UgY29udGludWVzLlxuICAgICAgICAgICAgICAgIHNlcU9iaiA9IHJlc0NvZGU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc0NvZGUgPT0gJ251bWJlcicpIHsgLy8gU2VxdWVuY2UgZmluaXNoZWQuIFdyaXRlIGl0LlxuICAgICAgICAgICAgICAgIGRiY3NDb2RlID0gcmVzQ29kZTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNDb2RlID09IHVuZGVmaW5lZCkgeyAvLyBDdXJyZW50IGNoYXJhY3RlciBpcyBub3QgcGFydCBvZiB0aGUgc2VxdWVuY2UuXG5cbiAgICAgICAgICAgICAgICAvLyBUcnkgZGVmYXVsdCBjaGFyYWN0ZXIgZm9yIHRoaXMgc2VxdWVuY2VcbiAgICAgICAgICAgICAgICByZXNDb2RlID0gc2VxT2JqW0RFRl9DSEFSXTtcbiAgICAgICAgICAgICAgICBpZiAocmVzQ29kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRiY3NDb2RlID0gcmVzQ29kZTsgLy8gRm91bmQuIFdyaXRlIGl0LlxuICAgICAgICAgICAgICAgICAgICBuZXh0Q2hhciA9IHVDb2RlOyAvLyBDdXJyZW50IGNoYXJhY3RlciB3aWxsIGJlIHdyaXR0ZW4gdG9vIGluIHRoZSBuZXh0IGl0ZXJhdGlvbi5cblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IFdoYXQgaWYgd2UgaGF2ZSBubyBkZWZhdWx0PyAocmVzQ29kZSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZW4sIHdlIHNob3VsZCB3cml0ZSBmaXJzdCBjaGFyIG9mIHRoZSBzZXF1ZW5jZSBhcy1pcyBhbmQgdHJ5IHRoZSByZXN0IHJlY3Vyc2l2ZWx5LlxuICAgICAgICAgICAgICAgICAgICAvLyBEaWRuJ3QgZG8gaXQgZm9yIG5vdyBiZWNhdXNlIG5vIGVuY29kaW5nIGhhcyB0aGlzIHNpdHVhdGlvbiB5ZXQuXG4gICAgICAgICAgICAgICAgICAgIC8vIEN1cnJlbnRseSwganVzdCBza2lwIHRoZSBzZXF1ZW5jZSBhbmQgd3JpdGUgY3VycmVudCBjaGFyLlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlcU9iaiA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1Q29kZSA+PSAwKSB7ICAvLyBSZWd1bGFyIGNoYXJhY3RlclxuICAgICAgICAgICAgdmFyIHN1YnRhYmxlID0gdGhpcy5lbmNvZGVUYWJsZVt1Q29kZSA+PiA4XTtcbiAgICAgICAgICAgIGlmIChzdWJ0YWJsZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGRiY3NDb2RlID0gc3VidGFibGVbdUNvZGUgJiAweEZGXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRiY3NDb2RlIDw9IFNFUV9TVEFSVCkgeyAvLyBTZXF1ZW5jZSBzdGFydFxuICAgICAgICAgICAgICAgIHNlcU9iaiA9IHRoaXMuZW5jb2RlVGFibGVTZXFbU0VRX1NUQVJULWRiY3NDb2RlXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRiY3NDb2RlID09IFVOQVNTSUdORUQgJiYgdGhpcy5nYjE4MDMwKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlIEdCMTgwMzAgYWxnb3JpdGhtIHRvIGZpbmQgY2hhcmFjdGVyKHMpIHRvIHdyaXRlLlxuICAgICAgICAgICAgICAgIHZhciBpZHggPSBmaW5kSWR4KHRoaXMuZ2IxODAzMC51Q2hhcnMsIHVDb2RlKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYmNzQ29kZSA9IHRoaXMuZ2IxODAzMC5nYkNoYXJzW2lkeF0gKyAodUNvZGUgLSB0aGlzLmdiMTgwMzAudUNoYXJzW2lkeF0pO1xuICAgICAgICAgICAgICAgICAgICBuZXdCdWZbaisrXSA9IDB4ODEgKyBNYXRoLmZsb29yKGRiY3NDb2RlIC8gMTI2MDApOyBkYmNzQ29kZSA9IGRiY3NDb2RlICUgMTI2MDA7XG4gICAgICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gMHgzMCArIE1hdGguZmxvb3IoZGJjc0NvZGUgLyAxMjYwKTsgZGJjc0NvZGUgPSBkYmNzQ29kZSAlIDEyNjA7XG4gICAgICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gMHg4MSArIE1hdGguZmxvb3IoZGJjc0NvZGUgLyAxMCk7IGRiY3NDb2RlID0gZGJjc0NvZGUgJSAxMDtcbiAgICAgICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSAweDMwICsgZGJjc0NvZGU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIFdyaXRlIGRiY3NDb2RlIGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKGRiY3NDb2RlID09PSBVTkFTU0lHTkVEKVxuICAgICAgICAgICAgZGJjc0NvZGUgPSB0aGlzLmRlZmF1bHRDaGFyU2luZ2xlQnl0ZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkYmNzQ29kZSA8IDB4MTAwKSB7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRiY3NDb2RlIDwgMHgxMDAwMCkge1xuICAgICAgICAgICAgbmV3QnVmW2orK10gPSBkYmNzQ29kZSA+PiA4OyAgIC8vIGhpZ2ggYnl0ZVxuICAgICAgICAgICAgbmV3QnVmW2orK10gPSBkYmNzQ29kZSAmIDB4RkY7IC8vIGxvdyBieXRlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlID4+IDE2O1xuICAgICAgICAgICAgbmV3QnVmW2orK10gPSAoZGJjc0NvZGUgPj4gOCkgJiAweEZGO1xuICAgICAgICAgICAgbmV3QnVmW2orK10gPSBkYmNzQ29kZSAmIDB4RkY7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNlcU9iaiA9IHNlcU9iajtcbiAgICB0aGlzLmxlYWRTdXJyb2dhdGUgPSBsZWFkU3Vycm9nYXRlO1xuICAgIHJldHVybiBuZXdCdWYuc2xpY2UoMCwgaik7XG59XG5cbkRCQ1NFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5sZWFkU3Vycm9nYXRlID09PSAtMSAmJiB0aGlzLnNlcU9iaiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm47IC8vIEFsbCBjbGVhbi4gTW9zdCBvZnRlbiBjYXNlLlxuXG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoMTApLCBqID0gMDtcblxuICAgIGlmICh0aGlzLnNlcU9iaikgeyAvLyBXZSdyZSBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICAgIHZhciBkYmNzQ29kZSA9IHRoaXMuc2VxT2JqW0RFRl9DSEFSXTtcbiAgICAgICAgaWYgKGRiY3NDb2RlICE9PSB1bmRlZmluZWQpIHsgLy8gV3JpdGUgYmVnaW5uaW5nIG9mIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAgICAgIGlmIChkYmNzQ29kZSA8IDB4MTAwKSB7XG4gICAgICAgICAgICAgICAgbmV3QnVmW2orK10gPSBkYmNzQ29kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gZGJjc0NvZGUgPj4gODsgICAvLyBoaWdoIGJ5dGVcbiAgICAgICAgICAgICAgICBuZXdCdWZbaisrXSA9IGRiY3NDb2RlICYgMHhGRjsgLy8gbG93IGJ5dGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNlZSB0b2RvIGFib3ZlLlxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VxT2JqID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxlYWRTdXJyb2dhdGUgIT09IC0xKSB7XG4gICAgICAgIC8vIEluY29tcGxldGUgc3Vycm9nYXRlIHBhaXIgLSBvbmx5IGxlYWQgc3Vycm9nYXRlIGZvdW5kLlxuICAgICAgICBuZXdCdWZbaisrXSA9IHRoaXMuZGVmYXVsdENoYXJTaW5nbGVCeXRlO1xuICAgICAgICB0aGlzLmxlYWRTdXJyb2dhdGUgPSAtMTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG5ld0J1Zi5zbGljZSgwLCBqKTtcbn1cblxuLy8gRXhwb3J0IGZvciB0ZXN0aW5nXG5EQkNTRW5jb2Rlci5wcm90b3R5cGUuZmluZElkeCA9IGZpbmRJZHg7XG5cblxuLy8gPT0gRGVjb2RlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gREJDU0RlY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICAvLyBEZWNvZGVyIHN0YXRlXG4gICAgdGhpcy5ub2RlSWR4ID0gMDtcbiAgICB0aGlzLnByZXZCdWYgPSBuZXcgQnVmZmVyKDApO1xuXG4gICAgLy8gU3RhdGljIGRhdGFcbiAgICB0aGlzLmRlY29kZVRhYmxlcyA9IGNvZGVjLmRlY29kZVRhYmxlcztcbiAgICB0aGlzLmRlY29kZVRhYmxlU2VxID0gY29kZWMuZGVjb2RlVGFibGVTZXE7XG4gICAgdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGUgPSBjb2RlYy5kZWZhdWx0Q2hhclVuaWNvZGU7XG4gICAgdGhpcy5nYjE4MDMwID0gY29kZWMuZ2IxODAzMDtcbn1cblxuREJDU0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmKSB7XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoYnVmLmxlbmd0aCoyKSxcbiAgICAgICAgbm9kZUlkeCA9IHRoaXMubm9kZUlkeCwgXG4gICAgICAgIHByZXZCdWYgPSB0aGlzLnByZXZCdWYsIHByZXZCdWZPZmZzZXQgPSB0aGlzLnByZXZCdWYubGVuZ3RoLFxuICAgICAgICBzZXFTdGFydCA9IC10aGlzLnByZXZCdWYubGVuZ3RoLCAvLyBpZHggb2YgdGhlIHN0YXJ0IG9mIGN1cnJlbnQgcGFyc2VkIHNlcXVlbmNlLlxuICAgICAgICB1Q29kZTtcblxuICAgIGlmIChwcmV2QnVmT2Zmc2V0ID4gMCkgLy8gTWFrZSBwcmV2IGJ1ZiBvdmVybGFwIGEgbGl0dGxlIHRvIG1ha2UgaXQgZWFzaWVyIHRvIHNsaWNlIGxhdGVyLlxuICAgICAgICBwcmV2QnVmID0gQnVmZmVyLmNvbmNhdChbcHJldkJ1ZiwgYnVmLnNsaWNlKDAsIDEwKV0pO1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAwLCBqID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY3VyQnl0ZSA9IChpID49IDApID8gYnVmW2ldIDogcHJldkJ1ZltpICsgcHJldkJ1Zk9mZnNldF07XG5cbiAgICAgICAgLy8gTG9va3VwIGluIGN1cnJlbnQgdHJpZSBub2RlLlxuICAgICAgICB2YXIgdUNvZGUgPSB0aGlzLmRlY29kZVRhYmxlc1tub2RlSWR4XVtjdXJCeXRlXTtcblxuICAgICAgICBpZiAodUNvZGUgPj0gMCkgeyBcbiAgICAgICAgICAgIC8vIE5vcm1hbCBjaGFyYWN0ZXIsIGp1c3QgdXNlIGl0LlxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVDb2RlID09PSBVTkFTU0lHTkVEKSB7IC8vIFVua25vd24gY2hhci5cbiAgICAgICAgICAgIC8vIFRPRE86IENhbGxiYWNrIHdpdGggc2VxLlxuICAgICAgICAgICAgLy92YXIgY3VyU2VxID0gKHNlcVN0YXJ0ID49IDApID8gYnVmLnNsaWNlKHNlcVN0YXJ0LCBpKzEpIDogcHJldkJ1Zi5zbGljZShzZXFTdGFydCArIHByZXZCdWZPZmZzZXQsIGkrMSArIHByZXZCdWZPZmZzZXQpO1xuICAgICAgICAgICAgaSA9IHNlcVN0YXJ0OyAvLyBUcnkgdG8gcGFyc2UgYWdhaW4sIGFmdGVyIHNraXBwaW5nIGZpcnN0IGJ5dGUgb2YgdGhlIHNlcXVlbmNlICgnaScgd2lsbCBiZSBpbmNyZW1lbnRlZCBieSAnZm9yJyBjeWNsZSkuXG4gICAgICAgICAgICB1Q29kZSA9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodUNvZGUgPT09IEdCMTgwMzBfQ09ERSkge1xuICAgICAgICAgICAgdmFyIGN1clNlcSA9IChzZXFTdGFydCA+PSAwKSA/IGJ1Zi5zbGljZShzZXFTdGFydCwgaSsxKSA6IHByZXZCdWYuc2xpY2Uoc2VxU3RhcnQgKyBwcmV2QnVmT2Zmc2V0LCBpKzEgKyBwcmV2QnVmT2Zmc2V0KTtcbiAgICAgICAgICAgIHZhciBwdHIgPSAoY3VyU2VxWzBdLTB4ODEpKjEyNjAwICsgKGN1clNlcVsxXS0weDMwKSoxMjYwICsgKGN1clNlcVsyXS0weDgxKSoxMCArIChjdXJTZXFbM10tMHgzMCk7XG4gICAgICAgICAgICB2YXIgaWR4ID0gZmluZElkeCh0aGlzLmdiMTgwMzAuZ2JDaGFycywgcHRyKTtcbiAgICAgICAgICAgIHVDb2RlID0gdGhpcy5nYjE4MDMwLnVDaGFyc1tpZHhdICsgcHRyIC0gdGhpcy5nYjE4MDMwLmdiQ2hhcnNbaWR4XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1Q29kZSA8PSBOT0RFX1NUQVJUKSB7IC8vIEdvIHRvIG5leHQgdHJpZSBub2RlLlxuICAgICAgICAgICAgbm9kZUlkeCA9IE5PREVfU1RBUlQgLSB1Q29kZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVDb2RlIDw9IFNFUV9TVEFSVCkgeyAvLyBPdXRwdXQgYSBzZXF1ZW5jZSBvZiBjaGFycy5cbiAgICAgICAgICAgIHZhciBzZXEgPSB0aGlzLmRlY29kZVRhYmxlU2VxW1NFUV9TVEFSVCAtIHVDb2RlXTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc2VxLmxlbmd0aCAtIDE7IGsrKykge1xuICAgICAgICAgICAgICAgIHVDb2RlID0gc2VxW2tdO1xuICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gdUNvZGUgJiAweEZGO1xuICAgICAgICAgICAgICAgIG5ld0J1ZltqKytdID0gdUNvZGUgPj4gODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVDb2RlID0gc2VxW3NlcS5sZW5ndGgtMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWNvbnYtbGl0ZSBpbnRlcm5hbCBlcnJvcjogaW52YWxpZCBkZWNvZGluZyB0YWJsZSB2YWx1ZSBcIiArIHVDb2RlICsgXCIgYXQgXCIgKyBub2RlSWR4ICsgXCIvXCIgKyBjdXJCeXRlKTtcblxuICAgICAgICAvLyBXcml0ZSB0aGUgY2hhcmFjdGVyIHRvIGJ1ZmZlciwgaGFuZGxpbmcgaGlnaGVyIHBsYW5lcyB1c2luZyBzdXJyb2dhdGUgcGFpci5cbiAgICAgICAgaWYgKHVDb2RlID4gMHhGRkZGKSB7IFxuICAgICAgICAgICAgdUNvZGUgLT0gMHgxMDAwMDtcbiAgICAgICAgICAgIHZhciB1Q29kZUxlYWQgPSAweEQ4MDAgKyBNYXRoLmZsb29yKHVDb2RlIC8gMHg0MDApO1xuICAgICAgICAgICAgbmV3QnVmW2orK10gPSB1Q29kZUxlYWQgJiAweEZGO1xuICAgICAgICAgICAgbmV3QnVmW2orK10gPSB1Q29kZUxlYWQgPj4gODtcblxuICAgICAgICAgICAgdUNvZGUgPSAweERDMDAgKyB1Q29kZSAlIDB4NDAwO1xuICAgICAgICB9XG4gICAgICAgIG5ld0J1ZltqKytdID0gdUNvZGUgJiAweEZGO1xuICAgICAgICBuZXdCdWZbaisrXSA9IHVDb2RlID4+IDg7XG5cbiAgICAgICAgLy8gUmVzZXQgdHJpZSBub2RlLlxuICAgICAgICBub2RlSWR4ID0gMDsgc2VxU3RhcnQgPSBpKzE7XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlSWR4ID0gbm9kZUlkeDtcbiAgICB0aGlzLnByZXZCdWYgPSAoc2VxU3RhcnQgPj0gMCkgPyBidWYuc2xpY2Uoc2VxU3RhcnQpIDogcHJldkJ1Zi5zbGljZShzZXFTdGFydCArIHByZXZCdWZPZmZzZXQpO1xuICAgIHJldHVybiBuZXdCdWYuc2xpY2UoMCwgaikudG9TdHJpbmcoJ3VjczInKTtcbn1cblxuREJDU0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXQgPSAnJztcblxuICAgIC8vIFRyeSB0byBwYXJzZSBhbGwgcmVtYWluaW5nIGNoYXJzLlxuICAgIHdoaWxlICh0aGlzLnByZXZCdWYubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBTa2lwIDEgY2hhcmFjdGVyIGluIHRoZSBidWZmZXIuXG4gICAgICAgIHJldCArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICAgICAgdmFyIGJ1ZiA9IHRoaXMucHJldkJ1Zi5zbGljZSgxKTtcblxuICAgICAgICAvLyBQYXJzZSByZW1haW5pbmcgYXMgdXN1YWwuXG4gICAgICAgIHRoaXMucHJldkJ1ZiA9IG5ldyBCdWZmZXIoMCk7XG4gICAgICAgIHRoaXMubm9kZUlkeCA9IDA7XG4gICAgICAgIGlmIChidWYubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldCArPSB0aGlzLndyaXRlKGJ1Zik7XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlSWR4ID0gMDtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBCaW5hcnkgc2VhcmNoIGZvciBHQjE4MDMwLiBSZXR1cm5zIGxhcmdlc3QgaSBzdWNoIHRoYXQgdGFibGVbaV0gPD0gdmFsLlxuZnVuY3Rpb24gZmluZElkeCh0YWJsZSwgdmFsKSB7XG4gICAgaWYgKHRhYmxlWzBdID4gdmFsKVxuICAgICAgICByZXR1cm4gLTE7XG5cbiAgICB2YXIgbCA9IDAsIHIgPSB0YWJsZS5sZW5ndGg7XG4gICAgd2hpbGUgKGwgPCByLTEpIHsgLy8gYWx3YXlzIHRhYmxlW2xdIDw9IHZhbCA8IHRhYmxlW3JdXG4gICAgICAgIHZhciBtaWQgPSBsICsgTWF0aC5mbG9vcigoci1sKzEpLzIpO1xuICAgICAgICBpZiAodGFibGVbbWlkXSA8PSB2YWwpXG4gICAgICAgICAgICBsID0gbWlkO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbDtcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gRGVzY3JpcHRpb24gb2Ygc3VwcG9ydGVkIGRvdWJsZSBieXRlIGVuY29kaW5ncyBhbmQgYWxpYXNlcy5cbi8vIFRhYmxlcyBhcmUgbm90IHJlcXVpcmUoKS1kIHVudGlsIHRoZXkgYXJlIG5lZWRlZCB0byBzcGVlZCB1cCBsaWJyYXJ5IGxvYWQuXG4vLyByZXF1aXJlKCktcyBhcmUgZGlyZWN0IHRvIHN1cHBvcnQgQnJvd3NlcmlmeS5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgXG4gICAgLy8gPT0gSmFwYW5lc2UvU2hpZnRKSVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEFsbCBqYXBhbmVzZSBlbmNvZGluZ3MgYXJlIGJhc2VkIG9uIEpJUyBYIHNldCBvZiBzdGFuZGFyZHM6XG4gICAgLy8gSklTIFggMDIwMSAtIFNpbmdsZS1ieXRlIGVuY29kaW5nIG9mIEFTQ0lJICsgwqUgKyBLYW5hIGNoYXJzIGF0IDB4QTEtMHhERi5cbiAgICAvLyBKSVMgWCAwMjA4IC0gTWFpbiBzZXQgb2YgNjg3OSBjaGFyYWN0ZXJzLCBwbGFjZWQgaW4gOTR4OTQgcGxhbmUsIHRvIGJlIGVuY29kZWQgYnkgMiBieXRlcy4gXG4gICAgLy8gICAgICAgICAgICAgIEhhcyBzZXZlcmFsIHZhcmlhdGlvbnMgaW4gMTk3OCwgMTk4MywgMTk5MCBhbmQgMTk5Ny5cbiAgICAvLyBKSVMgWCAwMjEyIC0gU3VwcGxlbWVudGFyeSBwbGFuZSBvZiA2MDY3IGNoYXJzIGluIDk0eDk0IHBsYW5lLiAxOTkwLiBFZmZlY3RpdmVseSBkZWFkLlxuICAgIC8vIEpJUyBYIDAyMTMgLSBFeHRlbnNpb24gYW5kIG1vZGVybiByZXBsYWNlbWVudCBvZiAwMjA4IGFuZCAwMjEyLiBUb3RhbCBjaGFyczogMTEyMzMuXG4gICAgLy8gICAgICAgICAgICAgIDIgcGxhbmVzLCBmaXJzdCBpcyBzdXBlcnNldCBvZiAwMjA4LCBzZWNvbmQgLSByZXZpc2VkIDAyMTIuXG4gICAgLy8gICAgICAgICAgICAgIEludHJvZHVjZWQgaW4gMjAwMCwgcmV2aXNlZCAyMDA0LiBTb21lIGNoYXJhY3RlcnMgYXJlIGluIFVuaWNvZGUgUGxhbmUgMiAoMHgyeHh4eClcblxuICAgIC8vIEJ5dGUgZW5jb2RpbmdzIGFyZTpcbiAgICAvLyAgKiBTaGlmdF9KSVM6IENvbXBhdGlibGUgd2l0aCAwMjAxLCB1c2VzIG5vdCBkZWZpbmVkIGNoYXJzIGluIHRvcCBoYWxmIGFzIGxlYWQgYnl0ZXMgZm9yIGRvdWJsZS1ieXRlXG4gICAgLy8gICAgICAgICAgICAgICBlbmNvZGluZyBvZiAwMjA4LiBMZWFkIGJ5dGUgcmFuZ2VzOiAweDgxLTB4OUYsIDB4RTAtMHhFRjsgVHJhaWwgYnl0ZSByYW5nZXM6IDB4NDAtMHg3RSwgMHg4MC0weDlFLCAweDlGLTB4RkMuXG4gICAgLy8gICAgICAgICAgICAgICBXaW5kb3dzIENQOTMyIGlzIGEgc3VwZXJzZXQgb2YgU2hpZnRfSklTLiBTb21lIGNvbXBhbmllcyBhZGRlZCBtb3JlIGNoYXJzLCBub3RhYmx5IEtEREkuXG4gICAgLy8gICogRVVDLUpQOiAgICBVcCB0byAzIGJ5dGVzIHBlciBjaGFyYWN0ZXIuIFVzZWQgbW9zdGx5IG9uICpuaXhlcy5cbiAgICAvLyAgICAgICAgICAgICAgIDB4MDAtMHg3RiAgICAgICAtIGxvd2VyIHBhcnQgb2YgMDIwMVxuICAgIC8vICAgICAgICAgICAgICAgMHg4RSwgMHhBMS0weERGIC0gdXBwZXIgcGFydCBvZiAwMjAxXG4gICAgLy8gICAgICAgICAgICAgICAoMHhBMS0weEZFKXgyICAgLSAwMjA4IHBsYW5lICg5NHg5NCkuXG4gICAgLy8gICAgICAgICAgICAgICAweDhGLCAoMHhBMS0weEZFKXgyIC0gMDIxMiBwbGFuZSAoOTR4OTQpLlxuICAgIC8vICAqIEpJUyBYIDIwODogNy1iaXQsIGRpcmVjdCBlbmNvZGluZyBvZiAwMjA4LiBCeXRlIHJhbmdlczogMHgyMS0weDdFICg5NCB2YWx1ZXMpLiBVbmNvbW1vbi5cbiAgICAvLyAgICAgICAgICAgICAgIFVzZWQgYXMtaXMgaW4gSVNPMjAyMiBmYW1pbHkuXG4gICAgLy8gICogSVNPMjAyMi1KUDogU3RhdGVmdWwgZW5jb2RpbmcsIHdpdGggZXNjYXBlIHNlcXVlbmNlcyB0byBzd2l0Y2ggYmV0d2VlbiBBU0NJSSwgXG4gICAgLy8gICAgICAgICAgICAgICAgMDIwMS0xOTc2IFJvbWFuLCAwMjA4LTE5NzgsIDAyMDgtMTk4My5cbiAgICAvLyAgKiBJU08yMDIyLUpQLTE6IEFkZHMgZXNjIHNlcSBmb3IgMDIxMi0xOTkwLlxuICAgIC8vICAqIElTTzIwMjItSlAtMjogQWRkcyBlc2Mgc2VxIGZvciBHQjIzMTMtMTk4MCwgS1NYMTAwMS0xOTkyLCBJU084ODU5LTEsIElTTzg4NTktNy5cbiAgICAvLyAgKiBJU08yMDIyLUpQLTM6IEFkZHMgZXNjIHNlcSBmb3IgMDIwMS0xOTc2IEthbmEgc2V0LCAwMjEzLTIwMDAgUGxhbmVzIDEsIDIuXG4gICAgLy8gICogSVNPMjAyMi1KUC0yMDA0OiBBZGRzIDAyMTMtMjAwNCBQbGFuZSAxLlxuICAgIC8vXG4gICAgLy8gQWZ0ZXIgSklTIFggMDIxMyBhcHBlYXJlZCwgU2hpZnRfSklTLTIwMDQsIEVVQy1KSVNYMDIxMyBhbmQgSVNPMjAyMi1KUC0yMDA0IGZvbGxvd2VkLCB3aXRoIGp1c3QgY2hhbmdpbmcgdGhlIHBsYW5lcy5cbiAgICAvL1xuICAgIC8vIE92ZXJhbGwsIGl0IHNlZW1zIHRoYXQgaXQncyBhIG1lc3MgOiggaHR0cDovL3d3dzgucGxhbGEub3IuanAvdGt1Ym90YTEvdW5pY29kZS1zeW1ib2xzLW1hcDIuaHRtbFxuXG5cbiAgICAnc2hpZnRqaXMnOiB7XG4gICAgICAgIHR5cGU6ICdfZGJjcycsXG4gICAgICAgIHRhYmxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL3NoaWZ0amlzLmpzb24nKSB9LFxuICAgICAgICBlbmNvZGVBZGQ6IHsnXFx1MDBhNSc6IDB4NUMsICdcXHUyMDNFJzogMHg3RX0sXG4gICAgICAgIGVuY29kZVNraXBWYWxzOiBbe2Zyb206IDB4RUQ0MCwgdG86IDB4Rjk0MH1dLFxuICAgIH0sXG4gICAgJ2Nzc2hpZnRqaXMnOiAnc2hpZnRqaXMnLFxuICAgICdtc2thbmppJzogJ3NoaWZ0amlzJyxcbiAgICAnc2ppcyc6ICdzaGlmdGppcycsXG4gICAgJ3dpbmRvd3MzMWonOiAnc2hpZnRqaXMnLFxuICAgICd4c2ppcyc6ICdzaGlmdGppcycsXG4gICAgJ3dpbmRvd3M5MzInOiAnc2hpZnRqaXMnLFxuICAgICc5MzInOiAnc2hpZnRqaXMnLFxuICAgICdjcDkzMic6ICdzaGlmdGppcycsXG5cbiAgICAnZXVjanAnOiB7XG4gICAgICAgIHR5cGU6ICdfZGJjcycsXG4gICAgICAgIHRhYmxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL2V1Y2pwLmpzb24nKSB9LFxuICAgICAgICBlbmNvZGVBZGQ6IHsnXFx1MDBhNSc6IDB4NUMsICdcXHUyMDNFJzogMHg3RX0sXG4gICAgfSxcblxuICAgIC8vIFRPRE86IEtEREkgZXh0ZW5zaW9uIHRvIFNoaWZ0X0pJU1xuICAgIC8vIFRPRE86IElCTSBDQ1NJRCA5NDIgPSBDUDkzMiwgYnV0IEYwLUY5IGN1c3RvbSBjaGFycyBhbmQgb3RoZXIgY2hhciBjaGFuZ2VzLlxuICAgIC8vIFRPRE86IElCTSBDQ1NJRCA5NDMgPSBTaGlmdF9KSVMgPSBDUDkzMiB3aXRoIG9yaWdpbmFsIFNoaWZ0X0pJUyBsb3dlciAxMjggY2hhcnMuXG5cbiAgICAvLyA9PSBDaGluZXNlL0dCSyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9HQktcblxuICAgIC8vIE9sZGVzdCBHQjIzMTIgKDE5ODEsIH43NjAwIGNoYXJzKSBpcyBhIHN1YnNldCBvZiBDUDkzNlxuICAgICdnYjIzMTInOiAnY3A5MzYnLFxuICAgICdnYjIzMTI4MCc6ICdjcDkzNicsXG4gICAgJ2diMjMxMjE5ODAnOiAnY3A5MzYnLFxuICAgICdjc2diMjMxMic6ICdjcDkzNicsXG4gICAgJ2NzaXNvNThnYjIzMTI4MCc6ICdjcDkzNicsXG4gICAgJ2V1Y2NuJzogJ2NwOTM2JyxcbiAgICAnaXNvaXI1OCc6ICdnYmsnLFxuXG4gICAgLy8gTWljcm9zb2Z0J3MgQ1A5MzYgaXMgYSBzdWJzZXQgYW5kIGFwcHJveGltYXRpb24gb2YgR0JLLlxuICAgIC8vIFRPRE86IEV1cm8gPSAweDgwIGluIGNwOTM2LCBidXQgbm90IGluIEdCSyAod2hlcmUgaXQncyB2YWxpZCBidXQgdW5kZWZpbmVkKVxuICAgICd3aW5kb3dzOTM2JzogJ2NwOTM2JyxcbiAgICAnOTM2JzogJ2NwOTM2JyxcbiAgICAnY3A5MzYnOiB7XG4gICAgICAgIHR5cGU6ICdfZGJjcycsXG4gICAgICAgIHRhYmxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL2NwOTM2Lmpzb24nKSB9LFxuICAgIH0sXG5cbiAgICAvLyBHQksgKH4yMjAwMCBjaGFycykgaXMgYW4gZXh0ZW5zaW9uIG9mIENQOTM2IHRoYXQgYWRkZWQgdXNlci1tYXBwZWQgY2hhcnMgYW5kIHNvbWUgb3RoZXIuXG4gICAgJ2diayc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5MzYuanNvbicpLmNvbmNhdChyZXF1aXJlKCcuL3RhYmxlcy9nYmstYWRkZWQuanNvbicpKSB9LFxuICAgIH0sXG4gICAgJ3hnYmsnOiAnZ2JrJyxcblxuICAgIC8vIEdCMTgwMzAgaXMgYW4gYWxnb3JpdGhtaWMgZXh0ZW5zaW9uIG9mIEdCSy5cbiAgICAnZ2IxODAzMCc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5MzYuanNvbicpLmNvbmNhdChyZXF1aXJlKCcuL3RhYmxlcy9nYmstYWRkZWQuanNvbicpKSB9LFxuICAgICAgICBnYjE4MDMwOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL2diMTgwMzAtcmFuZ2VzLmpzb24nKSB9LFxuICAgIH0sXG5cbiAgICAnY2hpbmVzZSc6ICdnYjE4MDMwJyxcblxuICAgIC8vIFRPRE86IFN1cHBvcnQgR0IxODAzMCAofjI3MDAwIGNoYXJzICsgd2hvbGUgdW5pY29kZSBtYXBwaW5nLCBjcDU0OTM2KVxuICAgIC8vIGh0dHA6Ly9pY3UtcHJvamVjdC5vcmcvZG9jcy9wYXBlcnMvZ2IxODAzMC5odG1sXG4gICAgLy8gaHR0cDovL3NvdXJjZS5pY3UtcHJvamVjdC5vcmcvcmVwb3MvaWN1L2RhdGEvdHJ1bmsvY2hhcnNldC9kYXRhL3htbC9nYi0xODAzMC0yMDAwLnhtbFxuICAgIC8vIGh0dHA6Ly93d3cua2huZ2FpLmNvbS9jaGluZXNlL2NoYXJtYXAvdGJsZ2JrLnBocD9wYWdlPTBcblxuICAgIC8vID09IEtvcmVhbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBFVUMtS1IsIEtTX0NfNTYwMSBhbmQgS1MgWCAxMDAxIGFyZSBleGFjdGx5IHRoZSBzYW1lLlxuICAgICd3aW5kb3dzOTQ5JzogJ2NwOTQ5JyxcbiAgICAnOTQ5JzogJ2NwOTQ5JyxcbiAgICAnY3A5NDknOiB7XG4gICAgICAgIHR5cGU6ICdfZGJjcycsXG4gICAgICAgIHRhYmxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL2NwOTQ5Lmpzb24nKSB9LFxuICAgIH0sXG5cbiAgICAnY3NldWNrcic6ICdjcDk0OScsXG4gICAgJ2Nza3NjNTYwMTE5ODcnOiAnY3A5NDknLFxuICAgICdldWNrcic6ICdjcDk0OScsXG4gICAgJ2lzb2lyMTQ5JzogJ2NwOTQ5JyxcbiAgICAna29yZWFuJzogJ2NwOTQ5JyxcbiAgICAna3NjNTYwMTE5ODcnOiAnY3A5NDknLFxuICAgICdrc2M1NjAxMTk4OSc6ICdjcDk0OScsXG4gICAgJ2tzYzU2MDEnOiAnY3A5NDknLFxuXG5cbiAgICAvLyA9PSBCaWc1L1RhaXdhbi9Ib25nIEtvbmcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gVGhlcmUgYXJlIGxvdHMgb2YgdGFibGVzIGZvciBCaWc1IGFuZCBjcDk1MC4gUGxlYXNlIHNlZSB0aGUgZm9sbG93aW5nIGxpbmtzIGZvciBoaXN0b3J5OlxuICAgIC8vIGh0dHA6Ly9tb3p0dy5vcmcvZG9jcy9iaWc1LyAgaHR0cDovL3d3dy5oYWlibGUuZGUvYnJ1bm8vY2hhcnNldHMvY29udmVyc2lvbi10YWJsZXMvQmlnNS5odG1sXG4gICAgLy8gVmFyaWF0aW9ucywgaW4gcm91Z2hseSBudW1iZXIgb2YgZGVmaW5lZCBjaGFyczpcbiAgICAvLyAgKiBXaW5kb3dzIENQIDk1MDogTWljcm9zb2Z0IHZhcmlhbnQgb2YgQmlnNS4gQ2Fub25pY2FsOiBodHRwOi8vd3d3LnVuaWNvZGUub3JnL1B1YmxpYy9NQVBQSU5HUy9WRU5ET1JTL01JQ1NGVC9XSU5ET1dTL0NQOTUwLlRYVFxuICAgIC8vICAqIFdpbmRvd3MgQ1AgOTUxOiBNaWNyb3NvZnQgdmFyaWFudCBvZiBCaWc1LUhLU0NTLTIwMDEuIFNlZW1zIHRvIGJlIG5ldmVyIHB1YmxpYy4gaHR0cDovL21lLmFiZWxjaGV1bmcub3JnL2FydGljbGVzL3Jlc2VhcmNoL3doYXQtaXMtY3A5NTEvXG4gICAgLy8gICogQmlnNS0yMDAzIChUYWl3YW4gc3RhbmRhcmQpIGFsbW9zdCBzdXBlcnNldCBvZiBjcDk1MC5cbiAgICAvLyAgKiBVbmljb2RlLWF0LW9uIChVQU8pIC8gTW96aWxsYSAxLjguIEZhbGxpbmcgb3V0IG9mIHVzZSBvbiB0aGUgV2ViLiBOb3Qgc3VwcG9ydGVkIGJ5IG90aGVyIGJyb3dzZXJzLlxuICAgIC8vICAqIEJpZzUtSEtTQ1MgKC0yMDAxLCAtMjAwNCwgLTIwMDgpLiBIb25nIEtvbmcgc3RhbmRhcmQuIFxuICAgIC8vICAgIG1hbnkgdW5pY29kZSBjb2RlIHBvaW50cyBtb3ZlZCBmcm9tIFBVQSB0byBTdXBwbGVtZW50YXJ5IHBsYW5lIChVKzJYWFhYKSBvdmVyIHRoZSB5ZWFycy5cbiAgICAvLyAgICBQbHVzLCBpdCBoYXMgNCBjb21iaW5pbmcgc2VxdWVuY2VzLlxuICAgIC8vICAgIFNlZW1zIHRoYXQgTW96aWxsYSByZWZ1c2VkIHRvIHN1cHBvcnQgaXQgZm9yIDEwIHlycy4gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTYyNDMxIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTMxMDI5OVxuICAgIC8vICAgIGJlY2F1c2UgYmlnNS1oa3NjcyBpcyB0aGUgb25seSBlbmNvZGluZyB0byBpbmNsdWRlIGFzdHJhbCBjaGFyYWN0ZXJzIGluIG5vbi1hbGdvcml0aG1pYyB3YXkuXG4gICAgLy8gICAgSW1wbGVtZW50YXRpb25zIGFyZSBub3QgY29uc2lzdGVudCB3aXRoaW4gYnJvd3NlcnM7IHNvbWV0aW1lcyBsYWJlbGVkIGFzIGp1c3QgYmlnNS5cbiAgICAvLyAgICBNUyBJbnRlcm5ldCBFeHBsb3JlciBzd2l0Y2hlcyBmcm9tIGJpZzUgdG8gYmlnNS1oa3NjcyB3aGVuIGEgcGF0Y2ggYXBwbGllZC5cbiAgICAvLyAgICBHcmVhdCBkaXNjdXNzaW9uICYgcmVjYXAgb2Ygd2hhdCdzIGdvaW5nIG9uIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTkxMjQ3MCNjMzFcbiAgICAvLyAgICBJbiB0aGUgZW5jb2RlciwgaXQgbWlnaHQgbWFrZSBzZW5zZSB0byBzdXBwb3J0IGVuY29kaW5nIG9sZCBQVUEgbWFwcGluZ3MgdG8gQmlnNSBieXRlcyBzZXEtcy5cbiAgICAvLyAgICBPZmZpY2lhbCBzcGVjOiBodHRwOi8vd3d3Lm9nY2lvLmdvdi5oay9lbi9idXNpbmVzcy90ZWNoX3Byb21vdGlvbi9jY2xpL3Rlcm1zL2RvYy8yMDAzY21wXzIwMDgudHh0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgaHR0cDovL3d3dy5vZ2Npby5nb3YuaGsvdGMvYnVzaW5lc3MvdGVjaF9wcm9tb3Rpb24vY2NsaS90ZXJtcy9kb2MvaGtzY3MtMjAwOC1iaWc1LWlzby50eHRcbiAgICAvLyBcbiAgICAvLyBDdXJyZW50IHVuZGVyc3RhbmRpbmcgb2YgaG93IHRvIGRlYWwgd2l0aCBCaWc1KC1IS1NDUykgaXMgaW4gdGhlIEVuY29kaW5nIFN0YW5kYXJkLCBodHRwOi8vZW5jb2Rpbmcuc3BlYy53aGF0d2cub3JnLyNiaWc1LWVuY29kZXJcbiAgICAvLyBVbmljb2RlIG1hcHBpbmcgKGh0dHA6Ly93d3cudW5pY29kZS5vcmcvUHVibGljL01BUFBJTkdTL09CU09MRVRFL0VBU1RBU0lBL09USEVSL0JJRzUuVFhUKSBpcyBzYWlkIHRvIGJlIHdyb25nLlxuXG4gICAgJ3dpbmRvd3M5NTAnOiAnY3A5NTAnLFxuICAgICc5NTAnOiAnY3A5NTAnLFxuICAgICdjcDk1MCc6IHtcbiAgICAgICAgdHlwZTogJ19kYmNzJyxcbiAgICAgICAgdGFibGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcmVxdWlyZSgnLi90YWJsZXMvY3A5NTAuanNvbicpIH0sXG4gICAgfSxcblxuICAgIC8vIEJpZzUgaGFzIG1hbnkgdmFyaWF0aW9ucyBhbmQgaXMgYW4gZXh0ZW5zaW9uIG9mIGNwOTUwLiBXZSB1c2UgRW5jb2RpbmcgU3RhbmRhcmQncyBhcyBhIGNvbnNlbnN1cy5cbiAgICAnYmlnNSc6ICdiaWc1aGtzY3MnLFxuICAgICdiaWc1aGtzY3MnOiB7XG4gICAgICAgIHR5cGU6ICdfZGJjcycsXG4gICAgICAgIHRhYmxlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHJlcXVpcmUoJy4vdGFibGVzL2NwOTUwLmpzb24nKS5jb25jYXQocmVxdWlyZSgnLi90YWJsZXMvYmlnNS1hZGRlZC5qc29uJykpIH0sXG4gICAgICAgIGVuY29kZVNraXBWYWxzOiBbMHhhMmNjXSxcbiAgICB9LFxuXG4gICAgJ2NuYmlnNSc6ICdiaWc1aGtzY3MnLFxuICAgICdjc2JpZzUnOiAnYmlnNWhrc2NzJyxcbiAgICAneHhiaWc1JzogJ2JpZzVoa3NjcycsXG5cbn07XG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBVcGRhdGUgdGhpcyBhcnJheSBpZiB5b3UgYWRkL3JlbmFtZS9yZW1vdmUgZmlsZXMgaW4gdGhpcyBkaXJlY3RvcnkuXG4vLyBXZSBzdXBwb3J0IEJyb3dzZXJpZnkgYnkgc2tpcHBpbmcgYXV0b21hdGljIG1vZHVsZSBkaXNjb3ZlcnkgYW5kIHJlcXVpcmluZyBtb2R1bGVzIGRpcmVjdGx5LlxudmFyIG1vZHVsZXMgPSBbXG4gICAgcmVxdWlyZShcIi4vaW50ZXJuYWxcIiksXG4gICAgcmVxdWlyZShcIi4vdXRmMTZcIiksXG4gICAgcmVxdWlyZShcIi4vdXRmN1wiKSxcbiAgICByZXF1aXJlKFwiLi9zYmNzLWNvZGVjXCIpLFxuICAgIHJlcXVpcmUoXCIuL3NiY3MtZGF0YVwiKSxcbiAgICByZXF1aXJlKFwiLi9zYmNzLWRhdGEtZ2VuZXJhdGVkXCIpLFxuICAgIHJlcXVpcmUoXCIuL2RiY3MtY29kZWNcIiksXG4gICAgcmVxdWlyZShcIi4vZGJjcy1kYXRhXCIpLFxuXTtcblxuLy8gUHV0IGFsbCBlbmNvZGluZy9hbGlhcy9jb2RlYyBkZWZpbml0aW9ucyB0byBzaW5nbGUgb2JqZWN0IGFuZCBleHBvcnQgaXQuIFxuZm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1vZHVsZSA9IG1vZHVsZXNbaV07XG4gICAgZm9yICh2YXIgZW5jIGluIG1vZHVsZSlcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2R1bGUsIGVuYykpXG4gICAgICAgICAgICBleHBvcnRzW2VuY10gPSBtb2R1bGVbZW5jXTtcbn1cbiIsIlwidXNlIHN0cmljdFwiXG5cbi8vIEV4cG9ydCBOb2RlLmpzIGludGVybmFsIGVuY29kaW5ncy5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLy8gRW5jb2RpbmdzXG4gICAgdXRmODogICB7IHR5cGU6IFwiX2ludGVybmFsXCIsIGJvbUF3YXJlOiB0cnVlfSxcbiAgICBjZXN1ODogIHsgdHlwZTogXCJfaW50ZXJuYWxcIiwgYm9tQXdhcmU6IHRydWV9LFxuICAgIHVuaWNvZGUxMXV0Zjg6IFwidXRmOFwiLFxuXG4gICAgdWNzMjogICB7IHR5cGU6IFwiX2ludGVybmFsXCIsIGJvbUF3YXJlOiB0cnVlfSxcbiAgICB1dGYxNmxlOiBcInVjczJcIixcblxuICAgIGJpbmFyeTogeyB0eXBlOiBcIl9pbnRlcm5hbFwiIH0sXG4gICAgYmFzZTY0OiB7IHR5cGU6IFwiX2ludGVybmFsXCIgfSxcbiAgICBoZXg6ICAgIHsgdHlwZTogXCJfaW50ZXJuYWxcIiB9LFxuXG4gICAgLy8gQ29kZWMuXG4gICAgX2ludGVybmFsOiBJbnRlcm5hbENvZGVjLFxufTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJuYWxDb2RlYyhjb2RlY09wdGlvbnMsIGljb252KSB7XG4gICAgdGhpcy5lbmMgPSBjb2RlY09wdGlvbnMuZW5jb2RpbmdOYW1lO1xuICAgIHRoaXMuYm9tQXdhcmUgPSBjb2RlY09wdGlvbnMuYm9tQXdhcmU7XG5cbiAgICBpZiAodGhpcy5lbmMgPT09IFwiYmFzZTY0XCIpXG4gICAgICAgIHRoaXMuZW5jb2RlciA9IEludGVybmFsRW5jb2RlckJhc2U2NDtcbiAgICBlbHNlIGlmICh0aGlzLmVuYyA9PT0gXCJjZXN1OFwiKSB7XG4gICAgICAgIHRoaXMuZW5jID0gXCJ1dGY4XCI7IC8vIFVzZSB1dGY4IGZvciBkZWNvZGluZy5cbiAgICAgICAgdGhpcy5lbmNvZGVyID0gSW50ZXJuYWxFbmNvZGVyQ2VzdTg7XG5cbiAgICAgICAgLy8gQWRkIGRlY29kZXIgZm9yIHZlcnNpb25zIG9mIE5vZGUgbm90IHN1cHBvcnRpbmcgQ0VTVS04XG4gICAgICAgIGlmIChuZXcgQnVmZmVyKFwiZWRhMDgwXCIsICdoZXgnKS50b1N0cmluZygpLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29kZXIgPSBJbnRlcm5hbERlY29kZXJDZXN1ODtcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdENoYXJVbmljb2RlID0gaWNvbnYuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5JbnRlcm5hbENvZGVjLnByb3RvdHlwZS5lbmNvZGVyID0gSW50ZXJuYWxFbmNvZGVyO1xuSW50ZXJuYWxDb2RlYy5wcm90b3R5cGUuZGVjb2RlciA9IEludGVybmFsRGVjb2RlcjtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gV2UgdXNlIG5vZGUuanMgaW50ZXJuYWwgZGVjb2Rlci4gSXRzIHNpZ25hdHVyZSBpcyB0aGUgc2FtZSBhcyBvdXJzLlxudmFyIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2RlcicpLlN0cmluZ0RlY29kZXI7XG5cbmlmICghU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kKSAvLyBOb2RlIHYwLjggZG9lc24ndCBoYXZlIHRoaXMgbWV0aG9kLlxuICAgIFN0cmluZ0RlY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge307XG5cblxuZnVuY3Rpb24gSW50ZXJuYWxEZWNvZGVyKG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgU3RyaW5nRGVjb2Rlci5jYWxsKHRoaXMsIGNvZGVjLmVuYyk7XG59XG5cbkludGVybmFsRGVjb2Rlci5wcm90b3R5cGUgPSBTdHJpbmdEZWNvZGVyLnByb3RvdHlwZTtcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRW5jb2RlciBpcyBtb3N0bHkgdHJpdmlhbFxuXG5mdW5jdGlvbiBJbnRlcm5hbEVuY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmVuYyA9IGNvZGVjLmVuYztcbn1cblxuSW50ZXJuYWxFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKHN0ciwgdGhpcy5lbmMpO1xufVxuXG5JbnRlcm5hbEVuY29kZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xufVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeGNlcHQgYmFzZTY0IGVuY29kZXIsIHdoaWNoIG11c3Qga2VlcCBpdHMgc3RhdGUuXG5cbmZ1bmN0aW9uIEludGVybmFsRW5jb2RlckJhc2U2NChvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMucHJldlN0ciA9ICcnO1xufVxuXG5JbnRlcm5hbEVuY29kZXJCYXNlNjQucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgc3RyID0gdGhpcy5wcmV2U3RyICsgc3RyO1xuICAgIHZhciBjb21wbGV0ZVF1YWRzID0gc3RyLmxlbmd0aCAtIChzdHIubGVuZ3RoICUgNCk7XG4gICAgdGhpcy5wcmV2U3RyID0gc3RyLnNsaWNlKGNvbXBsZXRlUXVhZHMpO1xuICAgIHN0ciA9IHN0ci5zbGljZSgwLCBjb21wbGV0ZVF1YWRzKTtcblxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN0ciwgXCJiYXNlNjRcIik7XG59XG5cbkludGVybmFsRW5jb2RlckJhc2U2NC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIodGhpcy5wcmV2U3RyLCBcImJhc2U2NFwiKTtcbn1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ0VTVS04IGVuY29kZXIgaXMgYWxzbyBzcGVjaWFsLlxuXG5mdW5jdGlvbiBJbnRlcm5hbEVuY29kZXJDZXN1OChvcHRpb25zLCBjb2RlYykge1xufVxuXG5JbnRlcm5hbEVuY29kZXJDZXN1OC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihzdHIubGVuZ3RoICogMyksIGJ1ZklkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYXJDb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIC8vIE5haXZlIGltcGxlbWVudGF0aW9uLCBidXQgaXQgd29ya3MgYmVjYXVzZSBDRVNVLTggaXMgZXNwZWNpYWxseSBlYXN5XG4gICAgICAgIC8vIHRvIGNvbnZlcnQgZnJvbSBVVEYtMTYgKHdoaWNoIGFsbCBKUyBzdHJpbmdzIGFyZSBlbmNvZGVkIGluKS5cbiAgICAgICAgaWYgKGNoYXJDb2RlIDwgMHg4MClcbiAgICAgICAgICAgIGJ1ZltidWZJZHgrK10gPSBjaGFyQ29kZTtcbiAgICAgICAgZWxzZSBpZiAoY2hhckNvZGUgPCAweDgwMCkge1xuICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IDB4QzAgKyAoY2hhckNvZGUgPj4+IDYpO1xuICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IDB4ODAgKyAoY2hhckNvZGUgJiAweDNmKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gY2hhckNvZGUgd2lsbCBhbHdheXMgYmUgPCAweDEwMDAwIGluIGphdmFzY3JpcHQuXG4gICAgICAgICAgICBidWZbYnVmSWR4KytdID0gMHhFMCArIChjaGFyQ29kZSA+Pj4gMTIpO1xuICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IDB4ODAgKyAoKGNoYXJDb2RlID4+PiA2KSAmIDB4M2YpO1xuICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IDB4ODAgKyAoY2hhckNvZGUgJiAweDNmKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYnVmLnNsaWNlKDAsIGJ1ZklkeCk7XG59XG5cbkludGVybmFsRW5jb2RlckNlc3U4LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENFU1UtOCBkZWNvZGVyIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiBOb2RlIHY0LjArXG5cbmZ1bmN0aW9uIEludGVybmFsRGVjb2RlckNlc3U4KG9wdGlvbnMsIGNvZGVjKSB7XG4gICAgdGhpcy5hY2MgPSAwO1xuICAgIHRoaXMuY29udEJ5dGVzID0gMDtcbiAgICB0aGlzLmFjY0J5dGVzID0gMDtcbiAgICB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZSA9IGNvZGVjLmRlZmF1bHRDaGFyVW5pY29kZTtcbn1cblxuSW50ZXJuYWxEZWNvZGVyQ2VzdTgucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmKSB7XG4gICAgdmFyIGFjYyA9IHRoaXMuYWNjLCBjb250Qnl0ZXMgPSB0aGlzLmNvbnRCeXRlcywgYWNjQnl0ZXMgPSB0aGlzLmFjY0J5dGVzLCBcbiAgICAgICAgcmVzID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGN1ckJ5dGUgPSBidWZbaV07XG4gICAgICAgIGlmICgoY3VyQnl0ZSAmIDB4QzApICE9PSAweDgwKSB7IC8vIExlYWRpbmcgYnl0ZVxuICAgICAgICAgICAgaWYgKGNvbnRCeXRlcyA+IDApIHsgLy8gUHJldmlvdXMgY29kZSBpcyBpbnZhbGlkXG4gICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuZGVmYXVsdENoYXJVbmljb2RlO1xuICAgICAgICAgICAgICAgIGNvbnRCeXRlcyA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJCeXRlIDwgMHg4MCkgeyAvLyBTaW5nbGUtYnl0ZSBjb2RlXG4gICAgICAgICAgICAgICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY3VyQnl0ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckJ5dGUgPCAweEUwKSB7IC8vIFR3by1ieXRlIGNvZGVcbiAgICAgICAgICAgICAgICBhY2MgPSBjdXJCeXRlICYgMHgxRjtcbiAgICAgICAgICAgICAgICBjb250Qnl0ZXMgPSAxOyBhY2NCeXRlcyA9IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckJ5dGUgPCAweEYwKSB7IC8vIFRocmVlLWJ5dGUgY29kZVxuICAgICAgICAgICAgICAgIGFjYyA9IGN1ckJ5dGUgJiAweDBGO1xuICAgICAgICAgICAgICAgIGNvbnRCeXRlcyA9IDI7IGFjY0J5dGVzID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIEZvdXIgb3IgbW9yZSBhcmUgbm90IHN1cHBvcnRlZCBmb3IgQ0VTVS04LlxuICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gQ29udGludWF0aW9uIGJ5dGVcbiAgICAgICAgICAgIGlmIChjb250Qnl0ZXMgPiAwKSB7IC8vIFdlJ3JlIHdhaXRpbmcgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGFjYyA9IChhY2MgPDwgNikgfCAoY3VyQnl0ZSAmIDB4M2YpO1xuICAgICAgICAgICAgICAgIGNvbnRCeXRlcy0tOyBhY2NCeXRlcysrO1xuICAgICAgICAgICAgICAgIGlmIChjb250Qnl0ZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIG92ZXJsb25nIGVuY29kaW5nLCBidXQgc3VwcG9ydCBNb2RpZmllZCBVVEYtOCAoZW5jb2RpbmcgTlVMTCBhcyBDMCA4MClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjY0J5dGVzID09PSAyICYmIGFjYyA8IDB4ODAgJiYgYWNjID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYWNjQnl0ZXMgPT09IDMgJiYgYWNjIDwgMHg4MDApXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFjdHVhbGx5IGFkZCBjaGFyYWN0ZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShhY2MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIFVuZXhwZWN0ZWQgY29udGludWF0aW9uIGJ5dGVcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5kZWZhdWx0Q2hhclVuaWNvZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hY2MgPSBhY2M7IHRoaXMuY29udEJ5dGVzID0gY29udEJ5dGVzOyB0aGlzLmFjY0J5dGVzID0gYWNjQnl0ZXM7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuSW50ZXJuYWxEZWNvZGVyQ2VzdTgucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSAwO1xuICAgIGlmICh0aGlzLmNvbnRCeXRlcyA+IDApXG4gICAgICAgIHJlcyArPSB0aGlzLmRlZmF1bHRDaGFyVW5pY29kZTtcbiAgICByZXR1cm4gcmVzO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gU2luZ2xlLWJ5dGUgY29kZWMuIE5lZWRzIGEgJ2NoYXJzJyBzdHJpbmcgcGFyYW1ldGVyIHRoYXQgY29udGFpbnMgMjU2IG9yIDEyOCBjaGFycyB0aGF0XG4vLyBjb3JyZXNwb25kIHRvIGVuY29kZWQgYnl0ZXMgKGlmIDEyOCAtIHRoZW4gbG93ZXIgaGFsZiBpcyBBU0NJSSkuIFxuXG5leHBvcnRzLl9zYmNzID0gU0JDU0NvZGVjO1xuZnVuY3Rpb24gU0JDU0NvZGVjKGNvZGVjT3B0aW9ucywgaWNvbnYpIHtcbiAgICBpZiAoIWNvZGVjT3B0aW9ucylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU0JDUyBjb2RlYyBpcyBjYWxsZWQgd2l0aG91dCB0aGUgZGF0YS5cIilcbiAgICBcbiAgICAvLyBQcmVwYXJlIGNoYXIgYnVmZmVyIGZvciBkZWNvZGluZy5cbiAgICBpZiAoIWNvZGVjT3B0aW9ucy5jaGFycyB8fCAoY29kZWNPcHRpb25zLmNoYXJzLmxlbmd0aCAhPT0gMTI4ICYmIGNvZGVjT3B0aW9ucy5jaGFycy5sZW5ndGggIT09IDI1NikpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuY29kaW5nICdcIitjb2RlY09wdGlvbnMudHlwZStcIicgaGFzIGluY29ycmVjdCAnY2hhcnMnIChtdXN0IGJlIG9mIGxlbiAxMjggb3IgMjU2KVwiKTtcbiAgICBcbiAgICBpZiAoY29kZWNPcHRpb25zLmNoYXJzLmxlbmd0aCA9PT0gMTI4KSB7XG4gICAgICAgIHZhciBhc2NpaVN0cmluZyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI4OyBpKyspXG4gICAgICAgICAgICBhc2NpaVN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgICAgICBjb2RlY09wdGlvbnMuY2hhcnMgPSBhc2NpaVN0cmluZyArIGNvZGVjT3B0aW9ucy5jaGFycztcbiAgICB9XG5cbiAgICB0aGlzLmRlY29kZUJ1ZiA9IG5ldyBCdWZmZXIoY29kZWNPcHRpb25zLmNoYXJzLCAndWNzMicpO1xuICAgIFxuICAgIC8vIEVuY29kaW5nIGJ1ZmZlci5cbiAgICB2YXIgZW5jb2RlQnVmID0gbmV3IEJ1ZmZlcig2NTUzNik7XG4gICAgZW5jb2RlQnVmLmZpbGwoaWNvbnYuZGVmYXVsdENoYXJTaW5nbGVCeXRlLmNoYXJDb2RlQXQoMCkpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2RlY09wdGlvbnMuY2hhcnMubGVuZ3RoOyBpKyspXG4gICAgICAgIGVuY29kZUJ1Zltjb2RlY09wdGlvbnMuY2hhcnMuY2hhckNvZGVBdChpKV0gPSBpO1xuXG4gICAgdGhpcy5lbmNvZGVCdWYgPSBlbmNvZGVCdWY7XG59XG5cblNCQ1NDb2RlYy5wcm90b3R5cGUuZW5jb2RlciA9IFNCQ1NFbmNvZGVyO1xuU0JDU0NvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gU0JDU0RlY29kZXI7XG5cblxuZnVuY3Rpb24gU0JDU0VuY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmVuY29kZUJ1ZiA9IGNvZGVjLmVuY29kZUJ1Zjtcbn1cblxuU0JDU0VuY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc3RyLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspXG4gICAgICAgIGJ1ZltpXSA9IHRoaXMuZW5jb2RlQnVmW3N0ci5jaGFyQ29kZUF0KGkpXTtcbiAgICBcbiAgICByZXR1cm4gYnVmO1xufVxuXG5TQkNTRW5jb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG59XG5cblxuZnVuY3Rpb24gU0JDU0RlY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmRlY29kZUJ1ZiA9IGNvZGVjLmRlY29kZUJ1Zjtcbn1cblxuU0JDU0RlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmKSB7XG4gICAgLy8gU3RyaW5ncyBhcmUgaW1tdXRhYmxlIGluIEpTIC0+IHdlIHVzZSB1Y3MyIGJ1ZmZlciB0byBzcGVlZCB1cCBjb21wdXRhdGlvbnMuXG4gICAgdmFyIGRlY29kZUJ1ZiA9IHRoaXMuZGVjb2RlQnVmO1xuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKGJ1Zi5sZW5ndGgqMik7XG4gICAgdmFyIGlkeDEgPSAwLCBpZHgyID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZHgxID0gYnVmW2ldKjI7IGlkeDIgPSBpKjI7XG4gICAgICAgIG5ld0J1ZltpZHgyXSA9IGRlY29kZUJ1ZltpZHgxXTtcbiAgICAgICAgbmV3QnVmW2lkeDIrMV0gPSBkZWNvZGVCdWZbaWR4MSsxXTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1Zi50b1N0cmluZygndWNzMicpO1xufVxuXG5TQkNTRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG59XG4iLCJcInVzZSBzdHJpY3RcIlxuXG4vLyBHZW5lcmF0ZWQgZGF0YSBmb3Igc2JjcyBjb2RlYy4gRG9uJ3QgZWRpdCBtYW51YWxseS4gUmVnZW5lcmF0ZSB1c2luZyBnZW5lcmF0aW9uL2dlbi1zYmNzLmpzIHNjcmlwdC5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBcIjQzN1wiOiBcImNwNDM3XCIsXG4gIFwiNzM3XCI6IFwiY3A3MzdcIixcbiAgXCI3NzVcIjogXCJjcDc3NVwiLFxuICBcIjg1MFwiOiBcImNwODUwXCIsXG4gIFwiODUyXCI6IFwiY3A4NTJcIixcbiAgXCI4NTVcIjogXCJjcDg1NVwiLFxuICBcIjg1NlwiOiBcImNwODU2XCIsXG4gIFwiODU3XCI6IFwiY3A4NTdcIixcbiAgXCI4NThcIjogXCJjcDg1OFwiLFxuICBcIjg2MFwiOiBcImNwODYwXCIsXG4gIFwiODYxXCI6IFwiY3A4NjFcIixcbiAgXCI4NjJcIjogXCJjcDg2MlwiLFxuICBcIjg2M1wiOiBcImNwODYzXCIsXG4gIFwiODY0XCI6IFwiY3A4NjRcIixcbiAgXCI4NjVcIjogXCJjcDg2NVwiLFxuICBcIjg2NlwiOiBcImNwODY2XCIsXG4gIFwiODY5XCI6IFwiY3A4NjlcIixcbiAgXCI4NzRcIjogXCJ3aW5kb3dzODc0XCIsXG4gIFwiOTIyXCI6IFwiY3A5MjJcIixcbiAgXCIxMDQ2XCI6IFwiY3AxMDQ2XCIsXG4gIFwiMTEyNFwiOiBcImNwMTEyNFwiLFxuICBcIjExMjVcIjogXCJjcDExMjVcIixcbiAgXCIxMTI5XCI6IFwiY3AxMTI5XCIsXG4gIFwiMTEzM1wiOiBcImNwMTEzM1wiLFxuICBcIjExNjFcIjogXCJjcDExNjFcIixcbiAgXCIxMTYyXCI6IFwiY3AxMTYyXCIsXG4gIFwiMTE2M1wiOiBcImNwMTE2M1wiLFxuICBcIjEyNTBcIjogXCJ3aW5kb3dzMTI1MFwiLFxuICBcIjEyNTFcIjogXCJ3aW5kb3dzMTI1MVwiLFxuICBcIjEyNTJcIjogXCJ3aW5kb3dzMTI1MlwiLFxuICBcIjEyNTNcIjogXCJ3aW5kb3dzMTI1M1wiLFxuICBcIjEyNTRcIjogXCJ3aW5kb3dzMTI1NFwiLFxuICBcIjEyNTVcIjogXCJ3aW5kb3dzMTI1NVwiLFxuICBcIjEyNTZcIjogXCJ3aW5kb3dzMTI1NlwiLFxuICBcIjEyNTdcIjogXCJ3aW5kb3dzMTI1N1wiLFxuICBcIjEyNThcIjogXCJ3aW5kb3dzMTI1OFwiLFxuICBcIjI4NTkxXCI6IFwiaXNvODg1OTFcIixcbiAgXCIyODU5MlwiOiBcImlzbzg4NTkyXCIsXG4gIFwiMjg1OTNcIjogXCJpc284ODU5M1wiLFxuICBcIjI4NTk0XCI6IFwiaXNvODg1OTRcIixcbiAgXCIyODU5NVwiOiBcImlzbzg4NTk1XCIsXG4gIFwiMjg1OTZcIjogXCJpc284ODU5NlwiLFxuICBcIjI4NTk3XCI6IFwiaXNvODg1OTdcIixcbiAgXCIyODU5OFwiOiBcImlzbzg4NTk4XCIsXG4gIFwiMjg1OTlcIjogXCJpc284ODU5OVwiLFxuICBcIjI4NjAwXCI6IFwiaXNvODg1OTEwXCIsXG4gIFwiMjg2MDFcIjogXCJpc284ODU5MTFcIixcbiAgXCIyODYwM1wiOiBcImlzbzg4NTkxM1wiLFxuICBcIjI4NjA0XCI6IFwiaXNvODg1OTE0XCIsXG4gIFwiMjg2MDVcIjogXCJpc284ODU5MTVcIixcbiAgXCIyODYwNlwiOiBcImlzbzg4NTkxNlwiLFxuICBcIndpbmRvd3M4NzRcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrO+/ve+/ve+/ve+/veKApu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/veKAmOKAmeKAnOKAneKAouKAk+KAlO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vcKg4LiB4LiC4LiD4LiE4LiF4LiG4LiH4LiI4LiJ4LiK4LiL4LiM4LiN4LiO4LiP4LiQ4LiR4LiS4LiT4LiU4LiV4LiW4LiX4LiY4LiZ4Lia4Lib4Lic4Lid4Lie4Lif4Lig4Lih4Lii4Lij4Lik4Lil4Lim4Lin4Lio4Lip4Liq4Lir4Lis4Lit4Liu4Liv4Liw4Lix4Liy4Liz4Li04Li14Li24Li34Li44Li54Li677+977+977+977+94Li/4LmA4LmB4LmC4LmD4LmE4LmF4LmG4LmH4LmI4LmJ4LmK4LmL4LmM4LmN4LmO4LmP4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZ4Lma4Lmb77+977+977+977+9XCJcbiAgfSxcbiAgXCJ3aW44NzRcIjogXCJ3aW5kb3dzODc0XCIsXG4gIFwiY3A4NzRcIjogXCJ3aW5kb3dzODc0XCIsXG4gIFwid2luZG93czEyNTBcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrO+/veKAmu+/veKAnuKApuKAoOKAoe+/veKAsMWg4oC5xZrFpMW9xbnvv73igJjigJnigJzigJ3igKLigJPigJTvv73ihKLFoeKAusWbxaXFvsW6wqDLh8uYxYHCpMSEwqbCp8KowqnFnsKrwqzCrcKuxbvCsMKxy5vFgsK0wrXCtsK3wrjEhcWfwrvEvcudxL7FvMWUw4HDgsSCw4TEucSGw4fEjMOJxJjDi8Saw43DjsSOxJDFg8WHw5PDlMWQw5bDl8WYxa7DmsWww5zDncWiw5/FlcOhw6LEg8OkxLrEh8OnxI3DqcSZw6vEm8Otw67Ej8SRxYTFiMOzw7TFkcO2w7fFmcWvw7rFscO8w73Fo8uZXCJcbiAgfSxcbiAgXCJ3aW4xMjUwXCI6IFwid2luZG93czEyNTBcIixcbiAgXCJjcDEyNTBcIjogXCJ3aW5kb3dzMTI1MFwiLFxuICBcIndpbmRvd3MxMjUxXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLQgtCD4oCa0ZPigJ7igKbigKDigKHigqzigLDQieKAudCK0IzQi9CP0ZLigJjigJnigJzigJ3igKLigJPigJTvv73ihKLRmeKAutGa0ZzRm9GfwqDQjtGe0IjCpNKQwqbCp9CBwqnQhMKrwqzCrcKu0IfCsMKx0IbRltKRwrXCtsK30ZHihJbRlMK70ZjQhdGV0ZfQkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/RgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7Rj1wiXG4gIH0sXG4gIFwid2luMTI1MVwiOiBcIndpbmRvd3MxMjUxXCIsXG4gIFwiY3AxMjUxXCI6IFwid2luZG93czEyNTFcIixcbiAgXCJ3aW5kb3dzMTI1MlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCaxpLigJ7igKbigKDigKHLhuKAsMWg4oC5xZLvv73Fve+/ve+/veKAmOKAmeKAnOKAneKAouKAk+KAlMuc4oSixaHigLrFk++/vcW+xbjCoMKhwqLCo8KkwqXCpsKnwqjCqcKqwqvCrMKtwq7Cr8KwwrHCssKzwrTCtcK2wrfCuMK5wrrCu8K8wr3CvsK/w4DDgcOCw4PDhMOFw4bDh8OIw4nDisOLw4zDjcOOw4/DkMORw5LDk8OUw5XDlsOXw5jDmcOaw5vDnMOdw57Dn8Ogw6HDosOjw6TDpcOmw6fDqMOpw6rDq8Osw63DrsOvw7DDscOyw7PDtMO1w7bDt8O4w7nDusO7w7zDvcO+w79cIlxuICB9LFxuICBcIndpbjEyNTJcIjogXCJ3aW5kb3dzMTI1MlwiLFxuICBcImNwMTI1MlwiOiBcIndpbmRvd3MxMjUyXCIsXG4gIFwid2luZG93czEyNTNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrO+/veKAmsaS4oCe4oCm4oCg4oCh77+94oCw77+94oC577+977+977+977+977+94oCY4oCZ4oCc4oCd4oCi4oCT4oCU77+94oSi77+94oC677+977+977+977+9wqDOhc6GwqPCpMKlwqbCp8Kowqnvv73Cq8Kswq3CruKAlcKwwrHCssKzzoTCtcK2wrfOiM6JzorCu86Mwr3Ojs6PzpDOkc6SzpPOlM6VzpbOl86YzpnOms6bzpzOnc6ezp/OoM6h77+9zqPOpM6lzqbOp86ozqnOqs6rzqzOrc6uzq/OsM6xzrLOs860zrXOts63zrjOuc66zrvOvM69zr7Ov8+Az4HPgs+Dz4TPhc+Gz4fPiM+Jz4rPi8+Mz43Pju+/vVwiXG4gIH0sXG4gIFwid2luMTI1M1wiOiBcIndpbmRvd3MxMjUzXCIsXG4gIFwiY3AxMjUzXCI6IFwid2luZG93czEyNTNcIixcbiAgXCJ3aW5kb3dzMTI1NFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCaxpLigJ7igKbigKDigKHLhuKAsMWg4oC5xZLvv73vv73vv73vv73igJjigJnigJzigJ3igKLigJPigJTLnOKEosWh4oC6xZPvv73vv73FuMKgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnCusK7wrzCvcK+wr/DgMOBw4LDg8OEw4XDhsOHw4jDicOKw4vDjMONw47Dj8Sew5HDksOTw5TDlcOWw5fDmMOZw5rDm8OcxLDFnsOfw6DDocOiw6PDpMOlw6bDp8Oow6nDqsOrw6zDrcOuw6/En8Oxw7LDs8O0w7XDtsO3w7jDucO6w7vDvMSxxZ/Dv1wiXG4gIH0sXG4gIFwid2luMTI1NFwiOiBcIndpbmRvd3MxMjU0XCIsXG4gIFwiY3AxMjU0XCI6IFwid2luZG93czEyNTRcIixcbiAgXCJ3aW5kb3dzMTI1NVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCaxpLigJ7igKbigKDigKHLhuKAsO+/veKAue+/ve+/ve+/ve+/ve+/veKAmOKAmeKAnOKAneKAouKAk+KAlMuc4oSi77+94oC677+977+977+977+9wqDCocKiwqPigqrCpcKmwqfCqMKpw5fCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnDt8K7wrzCvcK+wr/WsNax1rLWs9a01rXWtta31rjWue+/vda71rzWvda+1r/XgNeB14LXg9ew17HXstez17Tvv73vv73vv73vv73vv73vv73vv73XkNeR15LXk9eU15XXlteX15jXmdea15vXnNed157Xn9eg16HXotej16TXpdem16fXqNep16rvv73vv73igI7igI/vv71cIlxuICB9LFxuICBcIndpbjEyNTVcIjogXCJ3aW5kb3dzMTI1NVwiLFxuICBcImNwMTI1NVwiOiBcIndpbmRvd3MxMjU1XCIsXG4gIFwid2luZG93czEyNTZcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrNm+4oCaxpLigJ7igKbigKDigKHLhuKAsNm54oC5xZLahtqY2ojar+KAmOKAmeKAnOKAneKAouKAk+KAlNqp4oSi2pHigLrFk+KAjOKAjdq6wqDYjMKiwqPCpMKlwqbCp8KowqnavsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCudibwrvCvMK9wr7Yn9uB2KHYotij2KTYpdim2KfYqNip2KrYq9is2K3Yrtiv2LDYsdiy2LPYtNi12LbDl9i32LjYudi62YDZgdmC2YPDoNmEw6LZhdmG2YfZiMOnw6jDqcOqw6vZidmKw67Dr9mL2YzZjdmOw7TZj9mQw7fZkcO52ZLDu8O84oCO4oCP25JcIlxuICB9LFxuICBcIndpbjEyNTZcIjogXCJ3aW5kb3dzMTI1NlwiLFxuICBcImNwMTI1NlwiOiBcIndpbmRvd3MxMjU2XCIsXG4gIFwid2luZG93czEyNTdcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKCrO+/veKAmu+/veKAnuKApuKAoOKAoe+/veKAsO+/veKAue+/vcKoy4fCuO+/veKAmOKAmeKAnOKAneKAouKAk+KAlO+/veKEou+/veKAuu+/vcKvy5vvv73CoO+/vcKiwqPCpO+/vcKmwqfDmMKpxZbCq8Kswq3CrsOGwrDCscKywrPCtMK1wrbCt8O4wrnFl8K7wrzCvcK+w6bEhMSuxIDEhsOEw4XEmMSSxIzDicW5xJbEosS2xKrEu8WgxYPFhcOTxYzDlcOWw5fFssWBxZrFqsOcxbvFvcOfxIXEr8SBxIfDpMOlxJnEk8SNw6nFusSXxKPEt8SrxLzFocWExYbDs8WNw7XDtsO3xbPFgsWbxavDvMW8xb7LmVwiXG4gIH0sXG4gIFwid2luMTI1N1wiOiBcIndpbmRvd3MxMjU3XCIsXG4gIFwiY3AxMjU3XCI6IFwid2luZG93czEyNTdcIixcbiAgXCJ3aW5kb3dzMTI1OFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4oKs77+94oCaxpLigJ7igKbigKDigKHLhuKAsO+/veKAucWS77+977+977+977+94oCY4oCZ4oCc4oCd4oCi4oCT4oCUy5zihKLvv73igLrFk++/ve+/vcW4wqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv8OAw4HDgsSCw4TDhcOGw4fDiMOJw4rDi8yAw43DjsOPxJDDkcyJw5PDlMagw5bDl8OYw5nDmsObw5zGr8yDw5/DoMOhw6LEg8Okw6XDpsOnw6jDqcOqw6vMgcOtw67Dr8SRw7HMo8Ozw7TGocO2w7fDuMO5w7rDu8O8xrDigqvDv1wiXG4gIH0sXG4gIFwid2luMTI1OFwiOiBcIndpbmRvd3MxMjU4XCIsXG4gIFwiY3AxMjU4XCI6IFwid2luZG93czEyNThcIixcbiAgXCJpc284ODU5MVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnCusK7wrzCvcK+wr/DgMOBw4LDg8OEw4XDhsOHw4jDicOKw4vDjMONw47Dj8OQw5HDksOTw5TDlcOWw5fDmMOZw5rDm8Ocw53DnsOfw6DDocOiw6PDpMOlw6bDp8Oow6nDqsOrw6zDrcOuw6/DsMOxw7LDs8O0w7XDtsO3w7jDucO6w7vDvMO9w77Dv1wiXG4gIH0sXG4gIFwiY3AyODU5MVwiOiBcImlzbzg4NTkxXCIsXG4gIFwiaXNvODg1OTJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMSEy5jFgcKkxL3FmsKnwqjFoMWexaTFucKtxb3Fu8KwxIXLm8WCwrTEvsWby4fCuMWhxZ/FpcW6y53FvsW8xZTDgcOCxILDhMS5xIbDh8SMw4nEmMOLxJrDjcOOxI7EkMWDxYfDk8OUxZDDlsOXxZjFrsOaxbDDnMOdxaLDn8WVw6HDosSDw6TEusSHw6fEjcOpxJnDq8Sbw63DrsSPxJHFhMWIw7PDtMWRw7bDt8WZxa/DusWxw7zDvcWjy5lcIlxuICB9LFxuICBcImNwMjg1OTJcIjogXCJpc284ODU5MlwiLFxuICBcImlzbzg4NTkzXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDEpsuYwqPCpO+/vcSkwqfCqMSwxZ7EnsS0wq3vv73Fu8KwxKfCssKzwrTCtcSlwrfCuMSxxZ/En8S1wr3vv73FvMOAw4HDgu+/vcOExIrEiMOHw4jDicOKw4vDjMONw47Dj++/vcORw5LDk8OUxKDDlsOXxJzDmcOaw5vDnMWsxZzDn8Ogw6HDou+/vcOkxIvEicOnw6jDqcOqw6vDrMOtw67Dr++/vcOxw7LDs8O0xKHDtsO3xJ3DucO6w7vDvMWtxZ3LmVwiXG4gIH0sXG4gIFwiY3AyODU5M1wiOiBcImlzbzg4NTkzXCIsXG4gIFwiaXNvODg1OTRcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMSExLjFlsKkxKjEu8KnwqjFoMSSxKLFpsKtxb3Cr8KwxIXLm8WXwrTEqcS8y4fCuMWhxJPEo8WnxYrFvsWLxIDDgcOCw4PDhMOFw4bErsSMw4nEmMOLxJbDjcOOxKrEkMWFxYzEtsOUw5XDlsOXw5jFssOaw5vDnMWoxarDn8SBw6HDosOjw6TDpcOmxK/EjcOpxJnDq8SXw63DrsSrxJHFhsWNxLfDtMO1w7bDt8O4xbPDusO7w7zFqcWry5lcIlxuICB9LFxuICBcImNwMjg1OTRcIjogXCJpc284ODU5NFwiLFxuICBcImlzbzg4NTk1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDQgdCC0IPQhNCF0IbQh9CI0InQitCL0IzCrdCO0I/QkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/RgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7Rj+KEltGR0ZLRk9GU0ZXRltGX0ZjRmdGa0ZvRnMKn0Z7Rn1wiXG4gIH0sXG4gIFwiY3AyODU5NVwiOiBcImlzbzg4NTk1XCIsXG4gIFwiaXNvODg1OTZcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoO+/ve+/ve+/vcKk77+977+977+977+977+977+977+92IzCre+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vdib77+977+977+92J/vv73Yodii2KPYpNil2KbYp9io2KnYqtir2KzYrdiu2K/YsNix2LLYs9i02LXYtti32LjYudi677+977+977+977+977+92YDZgdmC2YPZhNmF2YbZh9mI2YnZitmL2YzZjdmO2Y/ZkNmR2ZLvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv71cIlxuICB9LFxuICBcImNwMjg1OTZcIjogXCJpc284ODU5NlwiLFxuICBcImlzbzg4NTk3XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDigJjigJnCo+KCrOKCr8KmwqfCqMKpzbrCq8Kswq3vv73igJXCsMKxwrLCs86EzoXOhsK3zojOic6KwrvOjMK9zo7Oj86QzpHOks6TzpTOlc6WzpfOmM6ZzprOm86czp3Ons6fzqDOoe+/vc6jzqTOpc6mzqfOqM6pzqrOq86szq3Ors6vzrDOsc6yzrPOtM61zrbOt864zrnOus67zrzOvc6+zr/PgM+Bz4LPg8+Ez4XPhs+Hz4jPic+Kz4vPjM+Nz47vv71cIlxuICB9LFxuICBcImNwMjg1OTdcIjogXCJpc284ODU5N1wiLFxuICBcImlzbzg4NTk4XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDvv73CosKjwqTCpcKmwqfCqMKpw5fCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnDt8K7wrzCvcK+77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+94oCX15DXkdeS15PXlNeV15bXl9eY15nXmteb15zXndee15/XoNeh16LXo9ek16XXpten16jXqdeq77+977+94oCO4oCP77+9XCJcbiAgfSxcbiAgXCJjcDI4NTk4XCI6IFwiaXNvODg1OThcIixcbiAgXCJpc284ODU5OVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8KgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnCusK7wrzCvcK+wr/DgMOBw4LDg8OEw4XDhsOHw4jDicOKw4vDjMONw47Dj8Sew5HDksOTw5TDlcOWw5fDmMOZw5rDm8OcxLDFnsOfw6DDocOiw6PDpMOlw6bDp8Oow6nDqsOrw6zDrcOuw6/En8Oxw7LDs8O0w7XDtsO3w7jDucO6w7vDvMSxxZ/Dv1wiXG4gIH0sXG4gIFwiY3AyODU5OVwiOiBcImlzbzg4NTk5XCIsXG4gIFwiaXNvODg1OTEwXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDEhMSSxKLEqsSoxLbCp8S7xJDFoMWmxb3CrcWqxYrCsMSFxJPEo8SrxKnEt8K3xLzEkcWhxafFvuKAlcWrxYvEgMOBw4LDg8OEw4XDhsSuxIzDicSYw4vElsONw47Dj8OQxYXFjMOTw5TDlcOWxajDmMWyw5rDm8Ocw53DnsOfxIHDocOiw6PDpMOlw6bEr8SNw6nEmcOrxJfDrcOuw6/DsMWGxY3Ds8O0w7XDtsWpw7jFs8O6w7vDvMO9w77EuFwiXG4gIH0sXG4gIFwiY3AyODYwMFwiOiBcImlzbzg4NTkxMFwiLFxuICBcImlzbzg4NTkxMVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kg4LiB4LiC4LiD4LiE4LiF4LiG4LiH4LiI4LiJ4LiK4LiL4LiM4LiN4LiO4LiP4LiQ4LiR4LiS4LiT4LiU4LiV4LiW4LiX4LiY4LiZ4Lia4Lib4Lic4Lid4Lie4Lif4Lig4Lih4Lii4Lij4Lik4Lil4Lim4Lin4Lio4Lip4Liq4Lir4Lis4Lit4Liu4Liv4Liw4Lix4Liy4Liz4Li04Li14Li24Li34Li44Li54Li677+977+977+977+94Li/4LmA4LmB4LmC4LmD4LmE4LmF4LmG4LmH4LmI4LmJ4LmK4LmL4LmM4LmN4LmO4LmP4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZ4Lma4Lmb77+977+977+977+9XCJcbiAgfSxcbiAgXCJjcDI4NjAxXCI6IFwiaXNvODg1OTExXCIsXG4gIFwiaXNvODg1OTEzXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDigJ3CosKjwqTigJ7CpsKnw5jCqcWWwqvCrMKtwq7DhsKwwrHCssKz4oCcwrXCtsK3w7jCucWXwrvCvMK9wr7DpsSExK7EgMSGw4TDhcSYxJLEjMOJxbnElsSixLbEqsS7xaDFg8WFw5PFjMOVw5bDl8WyxYHFmsWqw5zFu8W9w5/EhcSvxIHEh8Okw6XEmcSTxI3DqcW6xJfEo8S3xKvEvMWhxYTFhsOzxY3DtcO2w7fFs8WCxZvFq8O8xbzFvuKAmVwiXG4gIH0sXG4gIFwiY3AyODYwM1wiOiBcImlzbzg4NTkxM1wiLFxuICBcImlzbzg4NTkxNFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kg4biC4biDwqPEisSL4biKwqfhuoDCqeG6guG4i+G7ssKtwq7FuOG4nuG4n8SgxKHhuYDhuYHCtuG5luG6geG5l+G6g+G5oOG7s+G6hOG6heG5ocOAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPxbTDkcOSw5PDlMOVw5bhuarDmMOZw5rDm8Ocw53FtsOfw6DDocOiw6PDpMOlw6bDp8Oow6nDqsOrw6zDrcOuw6/FtcOxw7LDs8O0w7XDtuG5q8O4w7nDusO7w7zDvcW3w79cIlxuICB9LFxuICBcImNwMjg2MDRcIjogXCJpc284ODU5MTRcIixcbiAgXCJpc284ODU5MTVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMKhwqLCo+KCrMKlxaDCp8WhwqnCqsKrwqzCrcKuwq/CsMKxwrLCs8W9wrXCtsK3xb7CucK6wrvFksWTxbjCv8OAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPw5DDkcOSw5PDlMOVw5bDl8OYw5nDmsObw5zDncOew5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8Oww7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8w73DvsO/XCJcbiAgfSxcbiAgXCJjcDI4NjA1XCI6IFwiaXNvODg1OTE1XCIsXG4gIFwiaXNvODg1OTE2XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDEhMSFxYHigqzigJ7FoMKnxaHCqciYwqvFucKtxbrFu8KwwrHEjMWCxb3igJ3CtsK3xb7EjciZwrvFksWTxbjFvMOAw4HDgsSCw4TEhsOGw4fDiMOJw4rDi8OMw43DjsOPxJDFg8OSw5PDlMWQw5bFmsWww5nDmsObw5zEmMiaw5/DoMOhw6LEg8OkxIfDpsOnw6jDqcOqw6vDrMOtw67Dr8SRxYTDssOzw7TFkcO2xZvFscO5w7rDu8O8xJnIm8O/XCJcbiAgfSxcbiAgXCJjcDI4NjA2XCI6IFwiaXNvODg1OTE2XCIsXG4gIFwiY3A0MzdcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6TDoMOlw6fDqsOrw6jDr8Ouw6zDhMOFw4nDpsOGw7TDtsOyw7vDucO/w5bDnMKiwqPCpeKCp8aSw6HDrcOzw7rDscORwqrCusK/4oyQwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtNDM3XCI6IFwiY3A0MzdcIixcbiAgXCJjc2libTQzN1wiOiBcImNwNDM3XCIsXG4gIFwiY3A3MzdcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIs6RzpLOk86UzpXOls6XzpjOmc6azpvOnM6dzp7On86gzqHOo86kzqXOps6nzqjOqc6xzrLOs860zrXOts63zrjOuc66zrvOvM69zr7Ov8+Az4HPg8+Cz4TPhc+Gz4fPiOKWkeKWkuKWk+KUguKUpOKVoeKVouKVluKVleKVo+KVkeKVl+KVneKVnOKVm+KUkOKUlOKUtOKUrOKUnOKUgOKUvOKVnuKVn+KVmuKVlOKVqeKVpuKVoOKVkOKVrOKVp+KVqOKVpOKVpeKVmeKVmOKVkuKVk+KVq+KVquKUmOKUjOKWiOKWhOKWjOKWkOKWgM+JzqzOrc6uz4rOr8+Mz43Pi8+OzobOiM6JzorOjM6Ozo/CseKJpeKJpM6qzqvDt+KJiMKw4oiZwrfiiJrigb/CsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm03MzdcIjogXCJjcDczN1wiLFxuICBcImNzaWJtNzM3XCI6IFwiY3A3MzdcIixcbiAgXCJjcDc3NVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwixIbDvMOpxIHDpMSjw6XEh8WCxJPFlsWXxKvFucOEw4XDicOmw4bFjcO2xKLCosWaxZvDlsOcw7jCo8OYw5fCpMSAxKrDs8W7xbzFuuKAncKmwqnCrsKswr3CvMWBwqvCu+KWkeKWkuKWk+KUguKUpMSExIzEmMSW4pWj4pWR4pWX4pWdxK7FoOKUkOKUlOKUtOKUrOKUnOKUgOKUvMWyxarilZrilZTilanilabilaDilZDilazFvcSFxI3EmcSXxK/FocWzxavFvuKUmOKUjOKWiOKWhOKWjOKWkOKWgMOTw5/FjMWDw7XDlcK1xYTEtsS3xLvEvMWGxJLFheKAmcKtwrHigJzCvsK2wqfDt+KAnsKw4oiZwrfCucKzwrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtNzc1XCI6IFwiY3A3NzVcIixcbiAgXCJjc2libTc3NVwiOiBcImNwNzc1XCIsXG4gIFwiY3A4NTBcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6TDoMOlw6fDqsOrw6jDr8Ouw6zDhMOFw4nDpsOGw7TDtsOyw7vDucO/w5bDnMO4wqPDmMOXxpLDocOtw7PDusOxw5HCqsK6wr/CrsKswr3CvMKhwqvCu+KWkeKWkuKWk+KUguKUpMOBw4LDgMKp4pWj4pWR4pWX4pWdwqLCpeKUkOKUlOKUtOKUrOKUnOKUgOKUvMOjw4PilZrilZTilanilabilaDilZDilazCpMOww5DDisOLw4jEscONw47Dj+KUmOKUjOKWiOKWhMKmw4ziloDDk8Ofw5TDksO1w5XCtcO+w57DmsObw5nDvcOdwq/CtMKtwrHigJfCvsK2wqfDt8K4wrDCqMK3wrnCs8Ky4pagwqBcIlxuICB9LFxuICBcImlibTg1MFwiOiBcImNwODUwXCIsXG4gIFwiY3NpYm04NTBcIjogXCJjcDg1MFwiLFxuICBcImNwODUyXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDh8O8w6nDosOkxa/Eh8OnxYLDq8WQxZHDrsW5w4TEhsOJxLnEusO0w7bEvcS+xZrFm8OWw5zFpMWlxYHDl8SNw6HDrcOzw7rEhMSFxb3FvsSYxJnCrMW6xIzFn8KrwrvilpHilpLilpPilILilKTDgcOCxJrFnuKVo+KVkeKVl+KVncW7xbzilJDilJTilLTilKzilJzilIDilLzEgsSD4pWa4pWU4pWp4pWm4pWg4pWQ4pWswqTEkcSQxI7Di8SPxYfDjcOOxJvilJjilIzilojiloTFosWu4paAw5PDn8OUxYPFhMWIxaDFocWUw5rFlcWww73DncWjwrTCrcudy5vLh8uYwqfDt8K4wrDCqMuZxbHFmMWZ4pagwqBcIlxuICB9LFxuICBcImlibTg1MlwiOiBcImNwODUyXCIsXG4gIFwiY3NpYm04NTJcIjogXCJjcDg1MlwiLFxuICBcImNwODU1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLRktCC0ZPQg9GR0IHRlNCE0ZXQhdGW0IbRl9CH0ZjQiNGZ0InRmtCK0ZvQi9Gc0IzRntCO0Z/Qj9GO0K7RitCq0LDQkNCx0JHRhtCm0LTQlNC10JXRhNCk0LPQk8KrwrvilpHilpLilpPilILilKTRhdCl0LjQmOKVo+KVkeKVl+KVndC50JnilJDilJTilLTilKzilJzilIDilLzQutCa4pWa4pWU4pWp4pWm4pWg4pWQ4pWswqTQu9Cb0LzQnNC90J3QvtCe0L/ilJjilIzilojiloTQn9GP4paA0K/RgNCg0YHQodGC0KLRg9Cj0LbQltCy0JLRjNCs4oSWwq3Ri9Cr0LfQl9GI0KjRjdCt0YnQqdGH0KfCp+KWoMKgXCJcbiAgfSxcbiAgXCJpYm04NTVcIjogXCJjcDg1NVwiLFxuICBcImNzaWJtODU1XCI6IFwiY3A4NTVcIixcbiAgXCJjcDg1NlwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi15DXkdeS15PXlNeV15bXl9eY15nXmteb15zXndee15/XoNeh16LXo9ek16XXpten16jXqdeq77+9wqPvv73Dl++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vcKuwqzCvcK877+9wqvCu+KWkeKWkuKWk+KUguKUpO+/ve+/ve+/vcKp4pWj4pWR4pWX4pWdwqLCpeKUkOKUlOKUtOKUrOKUnOKUgOKUvO+/ve+/veKVmuKVlOKVqeKVpuKVoOKVkOKVrMKk77+977+977+977+977+977+977+977+977+94pSY4pSM4paI4paEwqbvv73iloDvv73vv73vv73vv73vv73vv73Cte+/ve+/ve+/ve+/ve+/ve+/ve+/vcKvwrTCrcKx4oCXwr7CtsKnw7fCuMKwwqjCt8K5wrPCsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NTZcIjogXCJjcDg1NlwiLFxuICBcImNzaWJtODU2XCI6IFwiY3A4NTZcIixcbiAgXCJjcDg1N1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDpMOgw6XDp8Oqw6vDqMOvw67EscOEw4XDicOmw4bDtMO2w7LDu8O5xLDDlsOcw7jCo8OYxZ7Fn8Ohw63Ds8O6w7HDkcSexJ/Cv8KuwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSkw4HDgsOAwqnilaPilZHilZfilZ3CosKl4pSQ4pSU4pS04pSs4pSc4pSA4pS8w6PDg+KVmuKVlOKVqeKVpuKVoOKVkOKVrMKkwrrCqsOKw4vDiO+/vcONw47Dj+KUmOKUjOKWiOKWhMKmw4ziloDDk8Ofw5TDksO1w5XCte+/vcOXw5rDm8OZw6zDv8KvwrTCrcKx77+9wr7CtsKnw7fCuMKwwqjCt8K5wrPCsuKWoMKgXCJcbiAgfSxcbiAgXCJpYm04NTdcIjogXCJjcDg1N1wiLFxuICBcImNzaWJtODU3XCI6IFwiY3A4NTdcIixcbiAgXCJjcDg1OFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4fDvMOpw6LDpMOgw6XDp8Oqw6vDqMOvw67DrMOEw4XDicOmw4bDtMO2w7LDu8O5w7/DlsOcw7jCo8OYw5fGksOhw63Ds8O6w7HDkcKqwrrCv8KuwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSkw4HDgsOAwqnilaPilZHilZfilZ3CosKl4pSQ4pSU4pS04pSs4pSc4pSA4pS8w6PDg+KVmuKVlOKVqeKVpuKVoOKVkOKVrMKkw7DDkMOKw4vDiOKCrMONw47Dj+KUmOKUjOKWiOKWhMKmw4ziloDDk8Ofw5TDksO1w5XCtcO+w57DmsObw5nDvcOdwq/CtMKtwrHigJfCvsK2wqfDt8K4wrDCqMK3wrnCs8Ky4pagwqBcIlxuICB9LFxuICBcImlibTg1OFwiOiBcImNwODU4XCIsXG4gIFwiY3NpYm04NThcIjogXCJjcDg1OFwiLFxuICBcImNwODYwXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDh8O8w6nDosOjw6DDgcOnw6rDisOow43DlMOsw4PDgsOJw4DDiMO0w7XDssOaw7nDjMOVw5zCosKjw5nigqfDk8Ohw63Ds8O6w7HDkcKqwrrCv8OSwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODYwXCI6IFwiY3A4NjBcIixcbiAgXCJjc2libTg2MFwiOiBcImNwODYwXCIsXG4gIFwiY3A4NjFcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw6TDoMOlw6fDqsOrw6jDkMOww57DhMOFw4nDpsOGw7TDtsO+w7vDncO9w5bDnMO4wqPDmOKCp8aSw6HDrcOzw7rDgcONw5PDmsK/4oyQwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODYxXCI6IFwiY3A4NjFcIixcbiAgXCJjc2libTg2MVwiOiBcImNwODYxXCIsXG4gIFwiY3A4NjJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIteQ15HXkteT15TXldeW15fXmNeZ15rXm9ec153Xntef16DXodei16PXpNel16bXp9eo16nXqsKiwqPCpeKCp8aSw6HDrcOzw7rDscORwqrCusK/4oyQwqzCvcK8wqHCq8K74paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODYyXCI6IFwiY3A4NjJcIixcbiAgXCJjc2libTg2MlwiOiBcImNwODYyXCIsXG4gIFwiY3A4NjNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOHw7zDqcOiw4LDoMK2w6fDqsOrw6jDr8Ou4oCXw4DCp8OJw4jDisO0w4vDj8O7w7nCpMOUw5zCosKjw5nDm8aSwqbCtMOzw7rCqMK4wrPCr8OO4oyQwqzCvcK8wr7Cq8K74paR4paS4paT4pSC4pSk4pWh4pWi4pWW4pWV4pWj4pWR4pWX4pWd4pWc4pWb4pSQ4pSU4pS04pSs4pSc4pSA4pS84pWe4pWf4pWa4pWU4pWp4pWm4pWg4pWQ4pWs4pWn4pWo4pWk4pWl4pWZ4pWY4pWS4pWT4pWr4pWq4pSY4pSM4paI4paE4paM4paQ4paAzrHDn86Tz4DOo8+DwrXPhM6mzpjOqc604oiez4bOteKIqeKJocKx4oml4omk4oyg4oyhw7fiiYjCsOKImcK34oia4oG/wrLilqDCoFwiXG4gIH0sXG4gIFwiaWJtODYzXCI6IFwiY3A4NjNcIixcbiAgXCJjc2libTg2M1wiOiBcImNwODYzXCIsXG4gIFwiY3A4NjRcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIlxcdTAwMDBcXHUwMDAxXFx1MDAwMlxcdTAwMDNcXHUwMDA0XFx1MDAwNVxcdTAwMDZcXHUwMDA3XFxiXFx0XFxuXFx1MDAwYlxcZlxcclxcdTAwMGVcXHUwMDBmXFx1MDAxMFxcdTAwMTFcXHUwMDEyXFx1MDAxM1xcdTAwMTRcXHUwMDE1XFx1MDAxNlxcdTAwMTdcXHUwMDE4XFx1MDAxOVxcdTAwMWFcXHUwMDFiXFx1MDAxY1xcdTAwMWRcXHUwMDFlXFx1MDAxZiAhXFxcIiMk2aomJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXFxcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn/CsMK34oiZ4oia4paS4pSA4pSC4pS84pSk4pSs4pSc4pS04pSQ4pSM4pSU4pSYzrLiiJ7PhsKxwr3CvOKJiMKrwrvvu7fvu7jvv73vv73vu7vvu7zvv73CoMKt77qCwqPCpO+6hO+/ve+/ve+6ju+6j++6le+6mdiM77qd77qh77ql2aDZodmi2aPZpNml2abZp9mo2anvu5HYm++6se+6te+6udifwqLvuoDvuoHvuoPvuoXvu4rvuovvuo3vupHvupPvupfvupvvup/vuqPvuqfvuqnvuqvvuq3vuq/vurPvurfvurvvur/vu4Hvu4Xvu4vvu4/CpsKsw7fDl++7idmA77uT77uX77ub77uf77uj77un77ur77ut77uv77uz77q977uM77uO77uN77uh77m92ZHvu6Xvu6nvu6zvu7Dvu7Lvu5Dvu5Xvu7Xvu7bvu53vu5nvu7HilqDvv71cIlxuICB9LFxuICBcImlibTg2NFwiOiBcImNwODY0XCIsXG4gIFwiY3NpYm04NjRcIjogXCJjcDg2NFwiLFxuICBcImNwODY1XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDh8O8w6nDosOkw6DDpcOnw6rDq8Oow6/DrsOsw4TDhcOJw6bDhsO0w7bDssO7w7nDv8OWw5zDuMKjw5jigqfGksOhw63Ds8O6w7HDkcKqwrrCv+KMkMKswr3CvMKhwqvCpOKWkeKWkuKWk+KUguKUpOKVoeKVouKVluKVleKVo+KVkeKVl+KVneKVnOKVm+KUkOKUlOKUtOKUrOKUnOKUgOKUvOKVnuKVn+KVmuKVlOKVqeKVpuKVoOKVkOKVrOKVp+KVqOKVpOKVpeKVmeKVmOKVkuKVk+KVq+KVquKUmOKUjOKWiOKWhOKWjOKWkOKWgM6xw5/Ok8+AzqPPg8K1z4TOps6YzqnOtOKIns+GzrXiiKniiaHCseKJpeKJpOKMoOKMocO34omIwrDiiJnCt+KImuKBv8Ky4pagwqBcIlxuICB9LFxuICBcImlibTg2NVwiOiBcImNwODY1XCIsXG4gIFwiY3NpYm04NjVcIjogXCJjcDg2NVwiLFxuICBcImNwODY2XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLQkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/ilpHilpLilpPilILilKTilaHilaLilZbilZXilaPilZHilZfilZ3ilZzilZvilJDilJTilLTilKzilJzilIDilLzilZ7ilZ/ilZrilZTilanilabilaDilZDilazilafilajilaTilaXilZnilZjilZLilZPilavilarilJjilIzilojiloTilozilpDiloDRgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7Rj9CB0ZHQhNGU0IfRl9CO0Z7CsOKImcK34oia4oSWwqTilqDCoFwiXG4gIH0sXG4gIFwiaWJtODY2XCI6IFwiY3A4NjZcIixcbiAgXCJjc2libTg2NlwiOiBcImNwODY2XCIsXG4gIFwiY3A4NjlcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIu+/ve+/ve+/ve+/ve+/ve+/vc6G77+9wrfCrMKm4oCY4oCZzojigJXOic6KzqrOjO+/ve+/vc6OzqvCqc6PwrLCs86swqPOrc6uzq/Pis6Qz4zPjc6RzpLOk86UzpXOls6Xwr3OmM6ZwqvCu+KWkeKWkuKWk+KUguKUpM6azpvOnM6d4pWj4pWR4pWX4pWdzp7On+KUkOKUlOKUtOKUrOKUnOKUgOKUvM6gzqHilZrilZTilanilabilaDilZDilazOo86kzqXOps6nzqjOqc6xzrLOs+KUmOKUjOKWiOKWhM60zrXiloDOts63zrjOuc66zrvOvM69zr7Ov8+Az4HPg8+Cz4TOhMKtwrHPhc+Gz4fCp8+IzoXCsMKoz4nPi86wz47ilqDCoFwiXG4gIH0sXG4gIFwiaWJtODY5XCI6IFwiY3A4NjlcIixcbiAgXCJjc2libTg2OVwiOiBcImNwODY5XCIsXG4gIFwiY3A5MjJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMKhwqLCo8KkwqXCpsKnwqjCqcKqwqvCrMKtwq7igL7CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv8OAw4HDgsODw4TDhcOGw4fDiMOJw4rDi8OMw43DjsOPxaDDkcOSw5PDlMOVw5bDl8OYw5nDmsObw5zDncW9w5/DoMOhw6LDo8Okw6XDpsOnw6jDqcOqw6vDrMOtw67Dr8Whw7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8w73FvsO/XCJcbiAgfSxcbiAgXCJpYm05MjJcIjogXCJjcDkyMlwiLFxuICBcImNzaWJtOTIyXCI6IFwiY3A5MjJcIixcbiAgXCJjcDEwNDZcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIu+6iMOXw7fvo7bvo7Xvo7Tvo7fvubHCiOKWoOKUguKUgOKUkOKUjOKUlOKUmO+5ue+5u++5ve+5v++5t++6iu+7sO+7s++7su+7ju+7j++7kO+7tu+7uO+7uu+7vMKg76O676O576O4wqTvo7vvuovvupHvupfvupvvup/vuqPYjMKt77qn77qz2aDZodmi2aPZpNml2abZp9mo2anvurfYm++6u++6v++7itif77uL2KHYotij2KTYpdim2KfYqNip2KrYq9is2K3Yrtiv2LDYsdiy2LPYtNi12LbYt++7h9i52Lrvu4zvuoLvuoTvuo7vu5PZgNmB2YLZg9mE2YXZhtmH2YjZidmK2YvZjNmN2Y7Zj9mQ2ZHZku+7l++7m++7n++jvO+7te+7t++7ue+7u++7o++7p++7rO+7qe+/vVwiXG4gIH0sXG4gIFwiaWJtMTA0NlwiOiBcImNwMTA0NlwiLFxuICBcImNzaWJtMTA0NlwiOiBcImNwMTA0NlwiLFxuICBcImNwMTEyNFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kg0IHQgtKQ0ITQhdCG0IfQiNCJ0IrQi9CMwq3QjtCP0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGO0Y/ihJbRkdGS0pHRlNGV0ZbRl9GY0ZnRmtGb0ZzCp9Ge0Z9cIlxuICB9LFxuICBcImlibTExMjRcIjogXCJjcDExMjRcIixcbiAgXCJjc2libTExMjRcIjogXCJjcDExMjRcIixcbiAgXCJjcDExMjVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItCQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv+KWkeKWkuKWk+KUguKUpOKVoeKVouKVluKVleKVo+KVkeKVl+KVneKVnOKVm+KUkOKUlOKUtOKUrOKUnOKUgOKUvOKVnuKVn+KVmuKVlOKVqeKVpuKVoOKVkOKVrOKVp+KVqOKVpOKVpeKVmeKVmOKVkuKVk+KVq+KVquKUmOKUjOKWiOKWhOKWjOKWkOKWgNGA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGP0IHRkdKQ0pHQhNGU0IbRltCH0ZfCt+KImuKElsKk4pagwqBcIlxuICB9LFxuICBcImlibTExMjVcIjogXCJjcDExMjVcIixcbiAgXCJjc2libTExMjVcIjogXCJjcDExMjVcIixcbiAgXCJjcDExMjlcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMKhwqLCo8KkwqXCpsKnxZPCqcKqwqvCrMKtwq7Cr8KwwrHCssKzxbjCtcK2wrfFksK5wrrCu8K8wr3CvsK/w4DDgcOCxILDhMOFw4bDh8OIw4nDisOLzIDDjcOOw4/EkMORzInDk8OUxqDDlsOXw5jDmcOaw5vDnMavzIPDn8Ogw6HDosSDw6TDpcOmw6fDqMOpw6rDq8yBw63DrsOvxJHDscyjw7PDtMahw7bDt8O4w7nDusO7w7zGsOKCq8O/XCJcbiAgfSxcbiAgXCJpYm0xMTI5XCI6IFwiY3AxMTI5XCIsXG4gIFwiY3NpYm0xMTI5XCI6IFwiY3AxMTI5XCIsXG4gIFwiY3AxMTMzXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKBwoLCg8KEwoXChsKHwojCicKKwovCjMKNwo7Cj8KQwpHCksKTwpTClcKWwpfCmMKZwprCm8Kcwp3CnsKfwqDguoHguoLguoTguofguojguqrguorguo3gupTgupXgupbgupfgupnguprgupvgupzgup3gup7gup/guqHguqLguqPguqXguqfguqvguq3guq7vv73vv73vv73guq/gurDgurLgurPgurTgurXgurbgurfgurjgurngurzgurHgurvgur3vv73vv73vv73gu4Dgu4Hgu4Lgu4Pgu4Tgu4jgu4ngu4rgu4vgu4zgu43gu4bvv73gu5zgu53igq3vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73gu5Dgu5Hgu5Lgu5Pgu5Tgu5Xgu5bgu5fgu5jgu5nvv73vv73CosKswqbvv71cIlxuICB9LFxuICBcImlibTExMzNcIjogXCJjcDExMzNcIixcbiAgXCJjc2libTExMzNcIjogXCJjcDExMzNcIixcbiAgXCJjcDExNjFcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/veC5iOC4geC4guC4g+C4hOC4heC4huC4h+C4iOC4ieC4iuC4i+C4jOC4jeC4juC4j+C4kOC4keC4kuC4k+C4lOC4leC4luC4l+C4mOC4meC4muC4m+C4nOC4neC4nuC4n+C4oOC4oeC4ouC4o+C4pOC4peC4puC4p+C4qOC4qeC4quC4q+C4rOC4reC4ruC4r+C4sOC4seC4suC4s+C4tOC4teC4tuC4t+C4uOC4ueC4uuC5ieC5iuC5i+KCrOC4v+C5gOC5geC5guC5g+C5hOC5heC5huC5h+C5iOC5ieC5iuC5i+C5jOC5jeC5juC5j+C5kOC5keC5kuC5k+C5lOC5leC5luC5l+C5mOC5meC5muC5m8KiwqzCpsKgXCJcbiAgfSxcbiAgXCJpYm0xMTYxXCI6IFwiY3AxMTYxXCIsXG4gIFwiY3NpYm0xMTYxXCI6IFwiY3AxMTYxXCIsXG4gIFwiY3AxMTYyXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLigqzCgcKCwoPChOKApsKGwofCiMKJworCi8KMwo3CjsKPwpDigJjigJnigJzigJ3igKLigJPigJTCmMKZwprCm8Kcwp3CnsKfwqDguIHguILguIPguITguIXguIbguIfguIjguInguIrguIvguIzguI3guI7guI/guJDguJHguJLguJPguJTguJXguJbguJfguJjguJnguJrguJvguJzguJ3guJ7guJ/guKDguKHguKLguKPguKTguKXguKbguKfguKjguKnguKrguKvguKzguK3guK7guK/guLDguLHguLLguLPguLTguLXguLbguLfguLjguLnguLrvv73vv73vv73vv73guL/guYDguYHguYLguYPguYTguYXguYbguYfguYjguYnguYrguYvguYzguY3guY7guY/guZDguZHguZLguZPguZTguZXguZbguZfguZjguZnguZrguZvvv73vv73vv73vv71cIlxuICB9LFxuICBcImlibTExNjJcIjogXCJjcDExNjJcIixcbiAgXCJjc2libTExNjJcIjogXCJjcDExNjJcIixcbiAgXCJjcDExNjNcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMKhwqLCo+KCrMKlwqbCp8WTwqnCqsKrwqzCrcKuwq/CsMKxwrLCs8W4wrXCtsK3xZLCucK6wrvCvMK9wr7Cv8OAw4HDgsSCw4TDhcOGw4fDiMOJw4rDi8yAw43DjsOPxJDDkcyJw5PDlMagw5bDl8OYw5nDmsObw5zGr8yDw5/DoMOhw6LEg8Okw6XDpsOnw6jDqcOqw6vMgcOtw67Dr8SRw7HMo8Ozw7TGocO2w7fDuMO5w7rDu8O8xrDigqvDv1wiXG4gIH0sXG4gIFwiaWJtMTE2M1wiOiBcImNwMTE2M1wiLFxuICBcImNzaWJtMTE2M1wiOiBcImNwMTE2M1wiLFxuICBcIm1hY2Nyb2F0aWFuXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDhMOFw4fDicORw5bDnMOhw6DDosOkw6PDpcOnw6nDqMOqw6vDrcOsw67Dr8Oxw7PDssO0w7bDtcO6w7nDu8O84oCgwrDCosKjwqfigKLCtsOfwq7FoOKEosK0wqjiiaDFvcOY4oiewrHiiaTiiaXiiIbCteKIguKIkeKIj8Wh4oirwqrCuuKEpsW+w7jCv8KhwqziiJrGkuKJiMSGwqvEjOKApsKgw4DDg8OVxZLFk8SQ4oCU4oCc4oCd4oCY4oCZw7fil4rvv73CqeKBhMKk4oC54oC6w4bCu+KAk8K34oCa4oCe4oCww4LEh8OBxI3DiMONw47Dj8OMw5PDlMSRw5LDmsObw5nEscuGy5zCr8+Aw4vLmsK4w4rDpsuHXCJcbiAgfSxcbiAgXCJtYWNjeXJpbGxpY1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr+KAoMKwwqLCo8Kn4oCiwrbQhsKuwqnihKLQgtGS4omg0IPRk+KInsKx4omk4oml0ZbCteKIgtCI0ITRlNCH0ZfQidGZ0IrRmtGY0IXCrOKImsaS4omI4oiGwqvCu+KApsKg0IvRm9CM0ZzRleKAk+KAlOKAnOKAneKAmOKAmcO34oCe0I7RntCP0Z/ihJbQgdGR0Y/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv9GA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjsKkXCJcbiAgfSxcbiAgXCJtYWNncmVla1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4TCucKyw4nCs8OWw5zOhcOgw6LDpM6EwqjDp8Opw6jDqsOrwqPihKLDrsOv4oCiwr3igLDDtMO2wqbCrcO5w7vDvOKAoM6TzpTOmM6bzp7OoMOfwq7Cqc6jzqrCp+KJoMKwzofOkcKx4omk4omlwqXOks6VzpbOl86ZzprOnM6mzqvOqM6pzqzOncKszp/OoeKJiM6kwqvCu+KApsKgzqXOp86GzojFk+KAk+KAleKAnOKAneKAmOKAmcO3zonOis6Mzo7Orc6uzq/PjM6Pz43Osc6yz4jOtM61z4bOs863zrnOvs66zrvOvM69zr/PgM+Oz4HPg8+EzrjPic+Cz4fPhc62z4rPi86QzrDvv71cIlxuICB9LFxuICBcIm1hY2ljZWxhbmRcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOEw4XDh8OJw5HDlsOcw6HDoMOiw6TDo8Olw6fDqcOow6rDq8Otw6zDrsOvw7HDs8Oyw7TDtsO1w7rDucO7w7zDncKwwqLCo8Kn4oCiwrbDn8KuwqnihKLCtMKo4omgw4bDmOKInsKx4omk4omlwqXCteKIguKIkeKIj8+A4oirwqrCuuKEpsOmw7jCv8KhwqziiJrGkuKJiOKIhsKrwrvigKbCoMOAw4PDlcWSxZPigJPigJTigJzigJ3igJjigJnDt+KXisO/xbjigYTCpMOQw7DDnsO+w73Ct+KAmuKAnuKAsMOCw4rDgcOLw4jDjcOOw4/DjMOTw5Tvv73DksOaw5vDmcSxy4bLnMKvy5jLmcuawrjLncuby4dcIlxuICB9LFxuICBcIm1hY3JvbWFuXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDhMOFw4fDicORw5bDnMOhw6DDosOkw6PDpcOnw6nDqMOqw6vDrcOsw67Dr8Oxw7PDssO0w7bDtcO6w7nDu8O84oCgwrDCosKjwqfigKLCtsOfwq7CqeKEosK0wqjiiaDDhsOY4oiewrHiiaTiiaXCpcK14oiC4oiR4oiPz4DiiKvCqsK64oSmw6bDuMK/wqHCrOKImsaS4omI4oiGwqvCu+KApsKgw4DDg8OVxZLFk+KAk+KAlOKAnOKAneKAmOKAmcO34peKw7/FuOKBhMKk4oC54oC676yB76yC4oChwrfigJrigJ7igLDDgsOKw4HDi8OIw43DjsOPw4zDk8OU77+9w5LDmsObw5nEscuGy5zCr8uYy5nLmsK4y53Lm8uHXCJcbiAgfSxcbiAgXCJtYWNyb21hbmlhXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLDhMOFw4fDicORw5bDnMOhw6DDosOkw6PDpcOnw6nDqMOqw6vDrcOsw67Dr8Oxw7PDssO0w7bDtcO6w7nDu8O84oCgwrDCosKjwqfigKLCtsOfwq7CqeKEosK0wqjiiaDEgsWe4oiewrHiiaTiiaXCpcK14oiC4oiR4oiPz4DiiKvCqsK64oSmxIPFn8K/wqHCrOKImsaS4omI4oiGwqvCu+KApsKgw4DDg8OVxZLFk+KAk+KAlOKAnOKAneKAmOKAmcO34peKw7/FuOKBhMKk4oC54oC6xaLFo+KAocK34oCa4oCe4oCww4LDisOBw4vDiMONw47Dj8OMw5PDlO+/vcOSw5rDm8OZxLHLhsucwq/LmMuZy5rCuMudy5vLh1wiXG4gIH0sXG4gIFwibWFjdGhhaVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwqvCu+KApu+ijO+ij++iku+ile+imO+ii++iju+ike+ilO+il+KAnOKAne+ime+/veKAou+ihO+iie+ihe+ihu+ih++iiO+iiu+ije+ikO+ik++iluKAmOKAme+/vcKg4LiB4LiC4LiD4LiE4LiF4LiG4LiH4LiI4LiJ4LiK4LiL4LiM4LiN4LiO4LiP4LiQ4LiR4LiS4LiT4LiU4LiV4LiW4LiX4LiY4LiZ4Lia4Lib4Lic4Lid4Lie4Lif4Lig4Lih4Lii4Lij4Lik4Lil4Lim4Lin4Lio4Lip4Liq4Lir4Lis4Lit4Liu4Liv4Liw4Lix4Liy4Liz4Li04Li14Li24Li34Li44Li54Li677u/4oCL4oCT4oCU4Li/4LmA4LmB4LmC4LmD4LmE4LmF4LmG4LmH4LmI4LmJ4LmK4LmL4LmM4LmN4oSi4LmP4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZwq7Cqe+/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwibWFjdHVya2lzaFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiw4TDhcOHw4nDkcOWw5zDocOgw6LDpMOjw6XDp8Opw6jDqsOrw63DrMOuw6/DscOzw7LDtMO2w7XDusO5w7vDvOKAoMKwwqLCo8Kn4oCiwrbDn8KuwqnihKLCtMKo4omgw4bDmOKInsKx4omk4omlwqXCteKIguKIkeKIj8+A4oirwqrCuuKEpsOmw7jCv8KhwqziiJrGkuKJiOKIhsKrwrvigKbCoMOAw4PDlcWSxZPigJPigJTigJzigJ3igJjigJnDt+KXisO/xbjEnsSfxLDEscWexZ/igKHCt+KAmuKAnuKAsMOCw4rDgcOLw4jDjcOOw4/DjMOTw5Tvv73DksOaw5vDme+/vcuGy5zCr8uYy5nLmsK4y53Lm8uHXCJcbiAgfSxcbiAgXCJtYWN1a3JhaW5lXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLQkNCR0JLQk9CU0JXQltCX0JjQmdCa0JvQnNCd0J7Qn9Cg0KHQotCj0KTQpdCm0KfQqNCp0KrQq9Cs0K3QrtCv4oCgwrDSkMKjwqfigKLCttCGwq7CqeKEotCC0ZLiiaDQg9GT4oiewrHiiaTiiaXRlsK10pHQiNCE0ZTQh9GX0InRmdCK0ZrRmNCFwqziiJrGkuKJiOKIhsKrwrvigKbCoNCL0ZvQjNGc0ZXigJPigJTigJzigJ3igJjigJnDt+KAntCO0Z7Qj9Gf4oSW0IHRkdGP0LDQsdCy0LPQtNC10LbQt9C40LnQutC70LzQvdC+0L/RgNGB0YLRg9GE0YXRhtGH0YjRidGK0YvRjNGN0Y7CpFwiXG4gIH0sXG4gIFwia29pOHJcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKUgOKUguKUjOKUkOKUlOKUmOKUnOKUpOKUrOKUtOKUvOKWgOKWhOKWiOKWjOKWkOKWkeKWkuKWk+KMoOKWoOKImeKImuKJiOKJpOKJpcKg4oyhwrDCssK3w7filZDilZHilZLRkeKVk+KVlOKVleKVluKVl+KVmOKVmeKVmuKVm+KVnOKVneKVnuKVn+KVoOKVodCB4pWi4pWj4pWk4pWl4pWm4pWn4pWo4pWp4pWq4pWr4pWswqnRjtCw0LHRhtC00LXRhNCz0YXQuNC50LrQu9C80L3QvtC/0Y/RgNGB0YLRg9C20LLRjNGL0LfRiNGN0YnRh9GK0K7QkNCR0KbQlNCV0KTQk9Cl0JjQmdCa0JvQnNCd0J7Qn9Cv0KDQodCi0KPQltCS0KzQq9CX0KjQrdCp0KfQqlwiXG4gIH0sXG4gIFwia29pOHVcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIuKUgOKUguKUjOKUkOKUlOKUmOKUnOKUpOKUrOKUtOKUvOKWgOKWhOKWiOKWjOKWkOKWkeKWkuKWk+KMoOKWoOKImeKImuKJiOKJpOKJpcKg4oyhwrDCssK3w7filZDilZHilZLRkdGU4pWU0ZbRl+KVl+KVmOKVmeKVmuKVm9KR4pWd4pWe4pWf4pWg4pWh0IHQhOKVo9CG0IfilabilafilajilanilarSkOKVrMKp0Y7QsNCx0YbQtNC10YTQs9GF0LjQudC60LvQvNC90L7Qv9GP0YDRgdGC0YPQttCy0YzRi9C30YjRjdGJ0YfRitCu0JDQkdCm0JTQldCk0JPQpdCY0JnQmtCb0JzQndCe0J/Qr9Cg0KHQotCj0JbQktCs0KvQl9Co0K3QqdCn0KpcIlxuICB9LFxuICBcImtvaThydVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi4pSA4pSC4pSM4pSQ4pSU4pSY4pSc4pSk4pSs4pS04pS84paA4paE4paI4paM4paQ4paR4paS4paT4oyg4pag4oiZ4oia4omI4omk4omlwqDijKHCsMKywrfDt+KVkOKVkeKVktGR0ZTilZTRltGX4pWX4pWY4pWZ4pWa4pWb0pHRnuKVnuKVn+KVoOKVodCB0ITilaPQhtCH4pWm4pWn4pWo4pWp4pWq0pDQjsKp0Y7QsNCx0YbQtNC10YTQs9GF0LjQudC60LvQvNC90L7Qv9GP0YDRgdGC0YPQttCy0YzRi9C30YjRjdGJ0YfRitCu0JDQkdCm0JTQldCk0JPQpdCY0JnQmtCb0JzQndCe0J/Qr9Cg0KHQotCj0JbQktCs0KvQl9Co0K3QqdCn0KpcIlxuICB9LFxuICBcImtvaTh0XCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLSm9KT4oCa0pLigJ7igKbigKDigKHvv73igLDSs+KAudKy0rfStu+/vdKa4oCY4oCZ4oCc4oCd4oCi4oCT4oCU77+94oSi77+94oC677+977+977+977+977+906/TrtGRwqTTo8Kmwqfvv73vv73vv73Cq8Kswq3Cru+/vcKwwrHCstCB77+906LCtsK377+94oSW77+9wrvvv73vv73vv73CqdGO0LDQsdGG0LTQtdGE0LPRhdC40LnQutC70LzQvdC+0L/Rj9GA0YHRgtGD0LbQstGM0YvQt9GI0Y3RidGH0YrQrtCQ0JHQptCU0JXQpNCT0KXQmNCZ0JrQm9Cc0J3QntCf0K/QoNCh0KLQo9CW0JLQrNCr0JfQqNCt0KnQp9CqXCJcbiAgfSxcbiAgXCJhcm1zY2lpOFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiwoDCgcKCwoPChMKFwobCh8KIwonCisKLwozCjcKOwo/CkMKRwpLCk8KUwpXClsKXwpjCmcKawpvCnMKdwp7Cn8Kg77+91ofWiSkowrvCq+KAlC7VnSwt1origKbVnNWb1Z7UsdWh1LLVotSz1aPUtNWk1LXVpdS21abUt9Wn1LjVqNS51anUutWq1LvVq9S81azUvdWt1L7VrtS/1a/VgNWw1YHVsdWC1bLVg9Wz1YTVtNWF1bXVhtW21YfVt9WI1bjVidW51YrVutWL1bvVjNW81Y3VvdWO1b7Vj9W/1ZDWgNWR1oHVktaC1ZPWg9WU1oTVldaF1ZbWhtWa77+9XCJcbiAgfSxcbiAgXCJyazEwNDhcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcItCC0IPigJrRk+KAnuKApuKAoOKAoeKCrOKAsNCJ4oC50IrSmtK60I/RkuKAmOKAmeKAnOKAneKAouKAk+KAlO+/veKEotGZ4oC60ZrSm9K70Z/CoNKw0rHTmMKk06jCpsKn0IHCqdKSwqvCrMKtwq7SrsKwwrHQhtGW06nCtcK2wrfRkeKEltKTwrvTmdKi0qPSr9CQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv9GA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGPXCJcbiAgfSxcbiAgXCJ0Y3ZuXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCJcXHUwMDAww5rhu6RcXHUwMDAz4buq4bus4buuXFx1MDAwN1xcYlxcdFxcblxcdTAwMGJcXGZcXHJcXHUwMDBlXFx1MDAwZlxcdTAwMTDhu6jhu7Dhu7Lhu7bhu7jDneG7tFxcdTAwMThcXHUwMDE5XFx1MDAxYVxcdTAwMWJcXHUwMDFjXFx1MDAxZFxcdTAwMWVcXHUwMDFmICFcXFwiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXFxcXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/w4DhuqLDg8OB4bqg4bq24bqsw4jhurrhurzDieG6uOG7hsOM4buIxKjDjeG7isOS4buOw5XDk+G7jOG7mOG7nOG7nuG7oOG7muG7osOZ4bumxajCoMSCw4LDisOUxqDGr8SQxIPDosOqw7TGocawxJHhurDMgMyJzIPMgcyjw6DhuqPDo8Oh4bqh4bqy4bqx4bqz4bq14bqv4bq04bqu4bqm4bqo4bqq4bqk4buA4bq34bqn4bqp4bqr4bql4bqtw6jhu4Lhurvhur3DqeG6ueG7geG7g+G7heG6v+G7h8Os4buJ4buE4bq+4buSxKnDreG7i8Oy4buU4buPw7XDs+G7jeG7k+G7leG7l+G7keG7meG7neG7n+G7oeG7m+G7o8O54buW4bunxanDuuG7peG7q+G7reG7r+G7qeG7seG7s+G7t+G7ucO94bu14buQXCJcbiAgfSxcbiAgXCJnZW9yZ2lhbmFjYWRlbXlcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHigJrGkuKAnuKApuKAoOKAocuG4oCwxaDigLnFksKNwo7Cj8KQ4oCY4oCZ4oCc4oCd4oCi4oCT4oCUy5zihKLFoeKAusWTwp3CnsW4wqDCocKiwqPCpMKlwqbCp8KowqnCqsKrwqzCrcKuwq/CsMKxwrLCs8K0wrXCtsK3wrjCucK6wrvCvMK9wr7Cv+GDkOGDkeGDkuGDk+GDlOGDleGDluGDl+GDmOGDmeGDmuGDm+GDnOGDneGDnuGDn+GDoOGDoeGDouGDo+GDpOGDpeGDpuGDp+GDqOGDqeGDquGDq+GDrOGDreGDruGDr+GDsOGDseGDsuGDs+GDtOGDteGDtsOnw6jDqcOqw6vDrMOtw67Dr8Oww7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8w73DvsO/XCJcbiAgfSxcbiAgXCJnZW9yZ2lhbnBzXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLCgMKB4oCaxpLigJ7igKbigKDigKHLhuKAsMWg4oC5xZLCjcKOwo/CkOKAmOKAmeKAnOKAneKAouKAk+KAlMuc4oSixaHigLrFk8Kdwp7FuMKgwqHCosKjwqTCpcKmwqfCqMKpwqrCq8Kswq3CrsKvwrDCscKywrPCtMK1wrbCt8K4wrnCusK7wrzCvcK+wr/hg5Dhg5Hhg5Lhg5Phg5Thg5Xhg5bhg7Hhg5fhg5jhg5nhg5rhg5vhg5zhg7Lhg53hg57hg5/hg6Dhg6Hhg6Lhg7Phg6Phg6Thg6Xhg6bhg6fhg6jhg6nhg6rhg6vhg6zhg63hg67hg7Thg6/hg7Dhg7XDpsOnw6jDqcOqw6vDrMOtw67Dr8Oww7HDssOzw7TDtcO2w7fDuMO5w7rDu8O8w73DvsO/XCJcbiAgfSxcbiAgXCJwdDE1NFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi0pbSktOu0pPigJ7igKbSttKu0rLSr9Kg06LSotKa0rrSuNKX4oCY4oCZ4oCc4oCd4oCi4oCT4oCU0rPSt9Kh06PSo9Kb0rvSucKg0I7RntCI06jSmNKwwqfQgcKp05jCq8Ks06/CrtKcwrDSsdCG0ZbSmdOpwrbCt9GR4oSW05nCu9GY0qrSq9Kd0JDQkdCS0JPQlNCV0JbQl9CY0JnQmtCb0JzQndCe0J/QoNCh0KLQo9Ck0KXQptCn0KjQqdCq0KvQrNCt0K7Qr9Cw0LHQstCz0LTQtdC20LfQuNC50LrQu9C80L3QvtC/0YDRgdGC0YPRhNGF0YbRh9GI0YnRitGL0YzRjdGO0Y9cIlxuICB9LFxuICBcInZpc2NpaVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwiXFx1MDAwMFxcdTAwMDHhurJcXHUwMDAzXFx1MDAwNOG6tOG6qlxcdTAwMDdcXGJcXHRcXG5cXHUwMDBiXFxmXFxyXFx1MDAwZVxcdTAwMGZcXHUwMDEwXFx1MDAxMVxcdTAwMTJcXHUwMDEz4bu2XFx1MDAxNVxcdTAwMTZcXHUwMDE3XFx1MDAxOOG7uFxcdTAwMWFcXHUwMDFiXFx1MDAxY1xcdTAwMWThu7RcXHUwMDFmICFcXFwiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXFxcXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/4bqg4bqu4bqw4bq24bqk4bqm4bqo4bqs4bq84bq44bq+4buA4buC4buE4buG4buQ4buS4buU4buW4buY4bui4bua4buc4bue4buK4buO4buM4buI4bumxajhu6Thu7LDleG6r+G6seG6t+G6peG6p+G6qeG6reG6veG6ueG6v+G7geG7g+G7heG7h+G7keG7k+G7leG7l+G7oMag4buZ4bud4buf4buL4buw4buo4buq4busxqHhu5vGr8OAw4HDgsOD4bqixILhurPhurXDiMOJw4rhurrDjMONxKjhu7PEkOG7qcOSw5PDlOG6oeG7t+G7q+G7rcOZw5rhu7nhu7XDneG7ocaww6DDocOiw6PhuqPEg+G7r+G6q8Oow6nDquG6u8Osw63EqeG7icSR4buxw7LDs8O0w7Xhu4/hu43hu6XDucO6xanhu6fDveG7o+G7rlwiXG4gIH0sXG4gIFwiaXNvNjQ2Y25cIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIlxcdTAwMDBcXHUwMDAxXFx1MDAwMlxcdTAwMDNcXHUwMDA0XFx1MDAwNVxcdTAwMDZcXHUwMDA3XFxiXFx0XFxuXFx1MDAwYlxcZlxcclxcdTAwMGVcXHUwMDBmXFx1MDAxMFxcdTAwMTFcXHUwMDEyXFx1MDAxM1xcdTAwMTRcXHUwMDE1XFx1MDAxNlxcdTAwMTdcXHUwMDE4XFx1MDAxOVxcdTAwMWFcXHUwMDFiXFx1MDAxY1xcdTAwMWRcXHUwMDFlXFx1MDAxZiAhXFxcIiPCpSUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXFxcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x94oC+f++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwiaXNvNjQ2anBcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIlxcdTAwMDBcXHUwMDAxXFx1MDAwMlxcdTAwMDNcXHUwMDA0XFx1MDAwNVxcdTAwMDZcXHUwMDA3XFxiXFx0XFxuXFx1MDAwYlxcZlxcclxcdTAwMGVcXHUwMDBmXFx1MDAxMFxcdTAwMTFcXHUwMDEyXFx1MDAxM1xcdTAwMTRcXHUwMDE1XFx1MDAxNlxcdTAwMTdcXHUwMDE4XFx1MDAxOVxcdTAwMWFcXHUwMDFiXFx1MDAxY1xcdTAwMWRcXHUwMDFlXFx1MDAxZiAhXFxcIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW8KlXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x94oC+f++/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vVwiXG4gIH0sXG4gIFwiaHByb21hbjhcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsKAwoHCgsKDwoTChcKGwofCiMKJworCi8KMwo3CjsKPwpDCkcKSwpPClMKVwpbCl8KYwpnCmsKbwpzCncKewp/CoMOAw4LDiMOKw4vDjsOPwrTLi8uGwqjLnMOZw5vigqTCr8Odw73CsMOHw6fDkcOxwqHCv8KkwqPCpcKnxpLCosOiw6rDtMO7w6HDqcOzw7rDoMOow7LDucOkw6vDtsO8w4XDrsOYw4bDpcOtw7jDpsOEw6zDlsOcw4nDr8Ofw5TDgcODw6PDkMOww43DjMOTw5LDlcO1xaDFocOaxbjDv8Oew77Ct8K1wrbCvuKAlMK8wr3CqsK6wqvilqDCu8Kx77+9XCJcbiAgfSxcbiAgXCJtYWNpbnRvc2hcIjoge1xuICAgIFwidHlwZVwiOiBcIl9zYmNzXCIsXG4gICAgXCJjaGFyc1wiOiBcIsOEw4XDh8OJw5HDlsOcw6HDoMOiw6TDo8Olw6fDqcOow6rDq8Otw6zDrsOvw7HDs8Oyw7TDtsO1w7rDucO7w7zigKDCsMKiwqPCp+KAosK2w5/CrsKp4oSiwrTCqOKJoMOGw5jiiJ7CseKJpOKJpcKlwrXiiILiiJHiiI/PgOKIq8KqwrrihKbDpsO4wr/CocKs4oiaxpLiiYjiiIbCq8K74oCmwqDDgMODw5XFksWT4oCT4oCU4oCc4oCd4oCY4oCZw7fil4rDv8W44oGEwqTigLnigLrvrIHvrILigKHCt+KAmuKAnuKAsMOCw4rDgcOLw4jDjcOOw4/DjMOTw5Tvv73DksOaw5vDmcSxy4bLnMKvy5jLmcuawrjLncuby4dcIlxuICB9LFxuICBcImFzY2lpXCI6IHtcbiAgICBcInR5cGVcIjogXCJfc2Jjc1wiLFxuICAgIFwiY2hhcnNcIjogXCLvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv71cIlxuICB9LFxuICBcInRpczYyMFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICBcImNoYXJzXCI6IFwi77+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+977+94LiB4LiC4LiD4LiE4LiF4LiG4LiH4LiI4LiJ4LiK4LiL4LiM4LiN4LiO4LiP4LiQ4LiR4LiS4LiT4LiU4LiV4LiW4LiX4LiY4LiZ4Lia4Lib4Lic4Lid4Lie4Lif4Lig4Lih4Lii4Lij4Lik4Lil4Lim4Lin4Lio4Lip4Liq4Lir4Lis4Lit4Liu4Liv4Liw4Lix4Liy4Liz4Li04Li14Li24Li34Li44Li54Li677+977+977+977+94Li/4LmA4LmB4LmC4LmD4LmE4LmF4LmG4LmH4LmI4LmJ4LmK4LmL4LmM4LmN4LmO4LmP4LmQ4LmR4LmS4LmT4LmU4LmV4LmW4LmX4LmY4LmZ4Lma4Lmb77+977+977+977+9XCJcbiAgfVxufSIsIlwidXNlIHN0cmljdFwiXG5cbi8vIE1hbnVhbGx5IGFkZGVkIGRhdGEgdG8gYmUgdXNlZCBieSBzYmNzIGNvZGVjIGluIGFkZGl0aW9uIHRvIGdlbmVyYXRlZCBvbmUuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIE5vdCBzdXBwb3J0ZWQgYnkgaWNvbnYsIG5vdCBzdXJlIHdoeS5cbiAgICBcIjEwMDI5XCI6IFwibWFjY2VudGV1cm9cIixcbiAgICBcIm1hY2NlbnRldXJvXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICAgICAgXCJjaGFyc1wiOiBcIsOExIDEgcOJxITDlsOcw6HEhcSMw6TEjcSGxIfDqcW5xbrEjsOtxI/EksSTxJbDs8SXw7TDtsO1w7rEmsSbw7zigKDCsMSYwqPCp+KAosK2w5/CrsKp4oSixJnCqOKJoMSjxK7Er8Sq4omk4omlxKvEtuKIguKIkcWCxLvEvMS9xL7EucS6xYXFhsWDwqziiJrFhMWH4oiGwqvCu+KApsKgxYjFkMOVxZHFjOKAk+KAlOKAnOKAneKAmOKAmcO34peKxY3FlMWVxZjigLnigLrFmcWWxZfFoOKAmuKAnsWhxZrFm8OBxaTFpcONxb3FvsWqw5PDlMWrxa7DmsWvxbDFscWyxbPDncO9xLfFu8WBxbzEosuHXCJcbiAgICB9LFxuXG4gICAgXCI4MDhcIjogXCJjcDgwOFwiLFxuICAgIFwiaWJtODA4XCI6IFwiY3A4MDhcIixcbiAgICBcImNwODA4XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiX3NiY3NcIixcbiAgICAgICAgXCJjaGFyc1wiOiBcItCQ0JHQktCT0JTQldCW0JfQmNCZ0JrQm9Cc0J3QntCf0KDQodCi0KPQpNCl0KbQp9Co0KnQqtCr0KzQrdCu0K/QsNCx0LLQs9C00LXQttC30LjQudC60LvQvNC90L7Qv+KWkeKWkuKWk+KUguKUpOKVoeKVouKVluKVleKVo+KVkeKVl+KVneKVnOKVm+KUkOKUlOKUtOKUrOKUnOKUgOKUvOKVnuKVn+KVmuKVlOKVqeKVpuKVoOKVkOKVrOKVp+KVqOKVpOKVpeKVmeKVmOKVkuKVk+KVq+KVquKUmOKUjOKWiOKWhOKWjOKWkOKWgNGA0YHRgtGD0YTRhdGG0YfRiNGJ0YrRi9GM0Y3RjtGP0IHRkdCE0ZTQh9GX0I7RnsKw4oiZwrfiiJrihJbigqzilqDCoFwiXG4gICAgfSxcblxuICAgIC8vIEFsaWFzZXMgb2YgZ2VuZXJhdGVkIGVuY29kaW5ncy5cbiAgICBcImFzY2lpOGJpdFwiOiBcImFzY2lpXCIsXG4gICAgXCJ1c2FzY2lpXCI6IFwiYXNjaWlcIixcbiAgICBcImFuc2l4MzRcIjogXCJhc2NpaVwiLFxuICAgIFwiYW5zaXgzNDE5NjhcIjogXCJhc2NpaVwiLFxuICAgIFwiYW5zaXgzNDE5ODZcIjogXCJhc2NpaVwiLFxuICAgIFwiY3Nhc2NpaVwiOiBcImFzY2lpXCIsXG4gICAgXCJjcDM2N1wiOiBcImFzY2lpXCIsXG4gICAgXCJpYm0zNjdcIjogXCJhc2NpaVwiLFxuICAgIFwiaXNvaXI2XCI6IFwiYXNjaWlcIixcbiAgICBcImlzbzY0NnVzXCI6IFwiYXNjaWlcIixcbiAgICBcImlzbzY0NmlydlwiOiBcImFzY2lpXCIsXG4gICAgXCJ1c1wiOiBcImFzY2lpXCIsXG5cbiAgICBcImxhdGluMVwiOiBcImlzbzg4NTkxXCIsXG4gICAgXCJsYXRpbjJcIjogXCJpc284ODU5MlwiLFxuICAgIFwibGF0aW4zXCI6IFwiaXNvODg1OTNcIixcbiAgICBcImxhdGluNFwiOiBcImlzbzg4NTk0XCIsXG4gICAgXCJsYXRpbjVcIjogXCJpc284ODU5OVwiLFxuICAgIFwibGF0aW42XCI6IFwiaXNvODg1OTEwXCIsXG4gICAgXCJsYXRpbjdcIjogXCJpc284ODU5MTNcIixcbiAgICBcImxhdGluOFwiOiBcImlzbzg4NTkxNFwiLFxuICAgIFwibGF0aW45XCI6IFwiaXNvODg1OTE1XCIsXG4gICAgXCJsYXRpbjEwXCI6IFwiaXNvODg1OTE2XCIsXG5cbiAgICBcImNzaXNvbGF0aW4xXCI6IFwiaXNvODg1OTFcIixcbiAgICBcImNzaXNvbGF0aW4yXCI6IFwiaXNvODg1OTJcIixcbiAgICBcImNzaXNvbGF0aW4zXCI6IFwiaXNvODg1OTNcIixcbiAgICBcImNzaXNvbGF0aW40XCI6IFwiaXNvODg1OTRcIixcbiAgICBcImNzaXNvbGF0aW5jeXJpbGxpY1wiOiBcImlzbzg4NTk1XCIsXG4gICAgXCJjc2lzb2xhdGluYXJhYmljXCI6IFwiaXNvODg1OTZcIixcbiAgICBcImNzaXNvbGF0aW5ncmVla1wiIDogXCJpc284ODU5N1wiLFxuICAgIFwiY3Npc29sYXRpbmhlYnJld1wiOiBcImlzbzg4NTk4XCIsXG4gICAgXCJjc2lzb2xhdGluNVwiOiBcImlzbzg4NTk5XCIsXG4gICAgXCJjc2lzb2xhdGluNlwiOiBcImlzbzg4NTkxMFwiLFxuXG4gICAgXCJsMVwiOiBcImlzbzg4NTkxXCIsXG4gICAgXCJsMlwiOiBcImlzbzg4NTkyXCIsXG4gICAgXCJsM1wiOiBcImlzbzg4NTkzXCIsXG4gICAgXCJsNFwiOiBcImlzbzg4NTk0XCIsXG4gICAgXCJsNVwiOiBcImlzbzg4NTk5XCIsXG4gICAgXCJsNlwiOiBcImlzbzg4NTkxMFwiLFxuICAgIFwibDdcIjogXCJpc284ODU5MTNcIixcbiAgICBcImw4XCI6IFwiaXNvODg1OTE0XCIsXG4gICAgXCJsOVwiOiBcImlzbzg4NTkxNVwiLFxuICAgIFwibDEwXCI6IFwiaXNvODg1OTE2XCIsXG5cbiAgICBcImlzb2lyMTRcIjogXCJpc282NDZqcFwiLFxuICAgIFwiaXNvaXI1N1wiOiBcImlzbzY0NmNuXCIsXG4gICAgXCJpc29pcjEwMFwiOiBcImlzbzg4NTkxXCIsXG4gICAgXCJpc29pcjEwMVwiOiBcImlzbzg4NTkyXCIsXG4gICAgXCJpc29pcjEwOVwiOiBcImlzbzg4NTkzXCIsXG4gICAgXCJpc29pcjExMFwiOiBcImlzbzg4NTk0XCIsXG4gICAgXCJpc29pcjE0NFwiOiBcImlzbzg4NTk1XCIsXG4gICAgXCJpc29pcjEyN1wiOiBcImlzbzg4NTk2XCIsXG4gICAgXCJpc29pcjEyNlwiOiBcImlzbzg4NTk3XCIsXG4gICAgXCJpc29pcjEzOFwiOiBcImlzbzg4NTk4XCIsXG4gICAgXCJpc29pcjE0OFwiOiBcImlzbzg4NTk5XCIsXG4gICAgXCJpc29pcjE1N1wiOiBcImlzbzg4NTkxMFwiLFxuICAgIFwiaXNvaXIxNjZcIjogXCJ0aXM2MjBcIixcbiAgICBcImlzb2lyMTc5XCI6IFwiaXNvODg1OTEzXCIsXG4gICAgXCJpc29pcjE5OVwiOiBcImlzbzg4NTkxNFwiLFxuICAgIFwiaXNvaXIyMDNcIjogXCJpc284ODU5MTVcIixcbiAgICBcImlzb2lyMjI2XCI6IFwiaXNvODg1OTE2XCIsXG5cbiAgICBcImNwODE5XCI6IFwiaXNvODg1OTFcIixcbiAgICBcImlibTgxOVwiOiBcImlzbzg4NTkxXCIsXG5cbiAgICBcImN5cmlsbGljXCI6IFwiaXNvODg1OTVcIixcblxuICAgIFwiYXJhYmljXCI6IFwiaXNvODg1OTZcIixcbiAgICBcImFyYWJpYzhcIjogXCJpc284ODU5NlwiLFxuICAgIFwiZWNtYTExNFwiOiBcImlzbzg4NTk2XCIsXG4gICAgXCJhc21vNzA4XCI6IFwiaXNvODg1OTZcIixcblxuICAgIFwiZ3JlZWtcIiA6IFwiaXNvODg1OTdcIixcbiAgICBcImdyZWVrOFwiIDogXCJpc284ODU5N1wiLFxuICAgIFwiZWNtYTExOFwiIDogXCJpc284ODU5N1wiLFxuICAgIFwiZWxvdDkyOFwiIDogXCJpc284ODU5N1wiLFxuXG4gICAgXCJoZWJyZXdcIjogXCJpc284ODU5OFwiLFxuICAgIFwiaGVicmV3OFwiOiBcImlzbzg4NTk4XCIsXG5cbiAgICBcInR1cmtpc2hcIjogXCJpc284ODU5OVwiLFxuICAgIFwidHVya2lzaDhcIjogXCJpc284ODU5OVwiLFxuXG4gICAgXCJ0aGFpXCI6IFwiaXNvODg1OTExXCIsXG4gICAgXCJ0aGFpOFwiOiBcImlzbzg4NTkxMVwiLFxuXG4gICAgXCJjZWx0aWNcIjogXCJpc284ODU5MTRcIixcbiAgICBcImNlbHRpYzhcIjogXCJpc284ODU5MTRcIixcbiAgICBcImlzb2NlbHRpY1wiOiBcImlzbzg4NTkxNFwiLFxuXG4gICAgXCJ0aXM2MjAwXCI6IFwidGlzNjIwXCIsXG4gICAgXCJ0aXM2MjAyNTI5MVwiOiBcInRpczYyMFwiLFxuICAgIFwidGlzNjIwMjUzMzBcIjogXCJ0aXM2MjBcIixcblxuICAgIFwiMTAwMDBcIjogXCJtYWNyb21hblwiLFxuICAgIFwiMTAwMDZcIjogXCJtYWNncmVla1wiLFxuICAgIFwiMTAwMDdcIjogXCJtYWNjeXJpbGxpY1wiLFxuICAgIFwiMTAwNzlcIjogXCJtYWNpY2VsYW5kXCIsXG4gICAgXCIxMDA4MVwiOiBcIm1hY3R1cmtpc2hcIixcblxuICAgIFwiY3NwYzhjb2RlcGFnZTQzN1wiOiBcImNwNDM3XCIsXG4gICAgXCJjc3BjNzc1YmFsdGljXCI6IFwiY3A3NzVcIixcbiAgICBcImNzcGM4NTBtdWx0aWxpbmd1YWxcIjogXCJjcDg1MFwiLFxuICAgIFwiY3NwY3A4NTJcIjogXCJjcDg1MlwiLFxuICAgIFwiY3NwYzg2MmxhdGluaGVicmV3XCI6IFwiY3A4NjJcIixcbiAgICBcImNwZ3JcIjogXCJjcDg2OVwiLFxuXG4gICAgXCJtc2VlXCI6IFwiY3AxMjUwXCIsXG4gICAgXCJtc2N5cmxcIjogXCJjcDEyNTFcIixcbiAgICBcIm1zYW5zaVwiOiBcImNwMTI1MlwiLFxuICAgIFwibXNncmVla1wiOiBcImNwMTI1M1wiLFxuICAgIFwibXN0dXJrXCI6IFwiY3AxMjU0XCIsXG4gICAgXCJtc2hlYnJcIjogXCJjcDEyNTVcIixcbiAgICBcIm1zYXJhYlwiOiBcImNwMTI1NlwiLFxuICAgIFwid2luYmFsdHJpbVwiOiBcImNwMTI1N1wiLFxuXG4gICAgXCJjcDIwODY2XCI6IFwia29pOHJcIixcbiAgICBcIjIwODY2XCI6IFwia29pOHJcIixcbiAgICBcImlibTg3OFwiOiBcImtvaThyXCIsXG4gICAgXCJjc2tvaThyXCI6IFwia29pOHJcIixcblxuICAgIFwiY3AyMTg2NlwiOiBcImtvaTh1XCIsXG4gICAgXCIyMTg2NlwiOiBcImtvaTh1XCIsXG4gICAgXCJpYm0xMTY4XCI6IFwia29pOHVcIixcblxuICAgIFwic3RyazEwNDgyMDAyXCI6IFwicmsxMDQ4XCIsXG5cbiAgICBcInRjdm41NzEyXCI6IFwidGN2blwiLFxuICAgIFwidGN2bjU3MTIxXCI6IFwidGN2blwiLFxuXG4gICAgXCJnYjE5ODg4MFwiOiBcImlzbzY0NmNuXCIsXG4gICAgXCJjblwiOiBcImlzbzY0NmNuXCIsXG5cbiAgICBcImNzaXNvMTRqaXNjNjIyMHJvXCI6IFwiaXNvNjQ2anBcIixcbiAgICBcImppc2M2MjIwMTk2OXJvXCI6IFwiaXNvNjQ2anBcIixcbiAgICBcImpwXCI6IFwiaXNvNjQ2anBcIixcblxuICAgIFwiY3NocHJvbWFuOFwiOiBcImhwcm9tYW44XCIsXG4gICAgXCJyOFwiOiBcImhwcm9tYW44XCIsXG4gICAgXCJyb21hbjhcIjogXCJocHJvbWFuOFwiLFxuICAgIFwieHJvbWFuOFwiOiBcImhwcm9tYW44XCIsXG4gICAgXCJpYm0xMDUxXCI6IFwiaHByb21hbjhcIixcblxuICAgIFwibWFjXCI6IFwibWFjaW50b3NoXCIsXG4gICAgXCJjc21hY2ludG9zaFwiOiBcIm1hY2ludG9zaFwiLFxufTtcblxuIiwibW9kdWxlLmV4cG9ydHM9W1xuW1wiODc0MFwiLFwi5I+w5LCy5JiD5Jam5JW48KeJp+S1t+SWs/CnsrHks6Lwp7OF466V5Jy25J2E5LGH5LGA8KSKv/CjmJfwp42S8Ka6i/Cng5LksZfwqo2R5J2P5Jea5LKF8KexrOS0h+SqpOSaofCmrKPniKXwpamU8KGpo/CjuIbwo72h5pmN5Zu7XCJdLFxuW1wiODc2N1wiLFwi57aV5aSd8KiuueO3tOmctPCnr6/lr5vwobWe5aqk45il8Km6sOWrkeWut+WzvOadruiWk/CppYXnkaHnkp3jobXwobWT8KOanvCmgKHju6xcIl0sXG5bXCI4N2ExXCIsXCLwpaOe46u156u86b6X8KSFofCopI3wo4eq8KCqivCjiZ7kjIrokoTpvpbpkK/kpLDomJPlopbpnYrpiJjnp5DnqLLmmaDmqKnoop3nkYznr4XmnoLnqKzliY/pgYbjk6bnj4Twpba555OG6b+H5Z6z5KSv5ZGM5ISx8KOajuWgmOepsvCnraXoro/kmq7wprqI5IaB8KW2meeurvCikrzpv4jwopOB8KKTifCik4zpv4nolITwo5a75IK06b+K5JOh8Kq3v+aLgeeBrum/i1wiXSxcbltcIjg4NDBcIixcIuOHgFwiLDQsXCLwoISM44eF8KCDkfCgg43jh4bjh4fwoIOL8KG/qOOHiPCgg4rjh4njh4rjh4vjh4zwoISO44eN44eOxIDDgceNw4DEksOJxJrDiMWMw5PHkcOS4L+/w4rMhOG6vuC/v8OKzIzhu4DDisSBw6HHjsOgyZHEk8OpxJvDqMSrw63HkMOsxY3Ds8eSw7LFq8O6x5TDuceWx5jHmlwiXSxcbltcIjg4YTFcIixcIsecw7zgv7/DqsyE4bq/4L+/w6rMjOG7gcOqyaHij5rij5tcIl0sXG5bXCI4OTQwXCIsXCLwqo6p8KGFhVwiXSxcbltcIjg5NDNcIixcIuaUilwiXSxcbltcIjg5NDZcIixcIuS4vea7nem1jumHn1wiXSxcbltcIjg5NGNcIixcIvCnnLXmkpHkvJrkvKjkvqjlhZblhbTlhpzlh6TliqHliqjljLvljY7lj5Hlj5jlm6Llo7DlpITlpIflpLLlpLTlrablrp7lrp/lsprluobmgLvmlonmn77moITmoaXmtY7ngrznlLXnuqTnuqznurrnu4fnu4/nu5/nvIbnvLfoibroi4/oja/op4borr7or6Lovabovafova5cIl0sXG5bXCI4OWExXCIsXCLnkJHns7znt43mpYbnq4nliKdcIl0sXG5bXCI4OWFiXCIsXCLphoznorjphZ7ogrxcIl0sXG5bXCI4OWIwXCIsXCLotIvog7bwoKenXCJdLFxuW1wiODliNVwiLFwi6IKf6buH5LON6beJ6biM5LC+8Km3tvCngI7puIrwqoSz45eBXCJdLFxuW1wiODljMVwiLFwi5rqa6Ii+55SZXCJdLFxuW1wiODljNVwiLFwi5KSR6ams6aqP6b6Z56aH8KiRrPCht4rwoJeQ8KKrpuS4pOS6geS6gOS6h+S6v+S7q+S8t+ORjOS+veO5iOWAg+WCiOORveOSk+OSpeWGhuWkheWHm+WHvOWIheS6ieWJueWKkOWMp+OXh+WOqeOVkeWOsOOVk+WPguWQo+OVreOVsuOageWSk+WSo+WStOWSueWTkOWTr+WUmOWUo+WUqOOWmOWUv+OWpeOWv+WXl+OXhVwiXSxcbltcIjhhNDBcIixcIvCntoTllKVcIl0sXG5bXCI4YTQzXCIsXCLwoLGC8KC0lfClhKvllpDworOG46es8KCNgei5hvCktrjwqZOl5IGT8KiCvueduvCisLjjqLTkn5XwqIWd8KansvCkt6rmk53woLW88KC+tPCgs5XwoYO05pKN6Lm+8KC6lvCgsIvwoL2k8KKyqfCoiZbwpJOTXCJdLFxuW1wiOGE2NFwiLFwi8KC1hvCpqY3wqIOp5J+08KS6p/Cis4LpqrLjqafwqZe047+t45SG8KWLh/Cpn5Twp6OI8KK1hOm1rumglVwiXSxcbltcIjhhNzZcIixcIuSPmfCmgqXmkrTlk6PworWM8KKvivChgbfjp7vwoYGvXCJdLFxuW1wiOGFhMVwiLFwi8KabmvCmnJbwp6ag5pOq8KWBkvCgsYPouajwooah8KitjPCgnLFcIl0sXG5bXCI4YWFjXCIsXCLkoIvwoIap47+65aGz8KK2jVwiXSxcbltcIjhhYjJcIixcIvCkl4jwoJO88KaCl/CgvYzwoLaW5ZW55IK75I66XCJdLFxuW1wiOGFiYlwiLFwi5Kq08KKppvChgp3ohqrpo7XwoLac5o2546e+8KKdtei3gOWaoeaRvOO5g1wiXSxcbltcIjhhYzlcIixcIvCqmIHwoLiJ8KKrj/Cis4lcIl0sXG5bXCI4YWNlXCIsXCLwoYOI8KOnguOmkuOohvCoipvjlbjwpbmJ8KKDh+WZkvCgvLHworKy8KmcoOOSvOawvfCkuLtcIl0sXG5bXCI4YWRmXCIsXCLwp5W08KK6i/CiiIjwqpmb8KizjfCgubrwoLC08KagnOe+k/Chg4/woqCD8KKkueOXu/Clh6PwoLqM8KC+jfCguqrjvpPwoLyw8KC1h/ChhY/woLmMXCJdLFxuW1wiOGFmNlwiLFwi8KC6q/CgrqnwoLWI8KGDgPChhL3jv7nwopqW5pCy8KC+rVwiXSxcbltcIjhiNDBcIixcIvCjj7Twp5i58KKvjvCgtb7woLW/8KKxkfCisZXjqJjwoLqY8KGDh/CgvK7wqpiy8KatkPCos5LwqLaZ8KiziumWquWTjOiLhOWWuVwiXSxcbltcIjhiNTVcIixcIvCpu4PpsKbpqrbwp52e8KK3rueFgOiFreiDrOWwnPCmlbLohLTjnpfljZ/wqIK96Ya28KC7uvCguI/woLm38KC7u+OXnfCkt6vjmInwoLOW5Zqv8KKetfChg4nwoLiQ8KC5uPChgbjwoYWI8KiIh/ChkZXwoLm58KS5kPCitqTlqZTwoYCd8KGAnvChg7XwoYO25Z6c8KC4kVwiXSxcbltcIjhiYTFcIixcIvCnmpTwqIuN8KC+tfCgubvwpYW+45yD8KC+tvChhoDwpYuY8KqKvfCkp5rwoaC68KSFt/CoibzlopnliajjmJrwpZy9566y5a2o5KCA5Kys6byn5Ken6bCf6a6N8KWttPCjhL3ll7vjl7LlmonkuKjlpILwoa+B8K+huOmdkfCggobkuZvkurvjlL7lsKPlvZHlv4Tjo7rmiYzmlLXmrbrmsLXmsLrngazniKvkuKzniq3wpKOp572S56S757O5572T8KaJquOTgVwiXSxcbltcIjhiZGVcIixcIvCmjYvogILogoDwppiS8KalkeWNneihpOingfCnorLorqDotJ3pkoXplbjplb/pl6jwqLiP6Z+m6aG16aOO6aOe6aWj8KmgkOmxvOm4n+m7hOatr++kh+S4t/CggofpmJ3miLfpkqJcIl0sXG5bXCI4YzQwXCIsXCLlgLvmt77wqbGz6b6m47eJ6KKP8KSFjueBt+WzteSsoPClh43jlZnwpbSw5oSi8Kiosui+p+mHtueGkeacmeeOuvCjioHwqoSH47KL8KGmgOSskOejpOeQguWGrvConI/kgInmqaPwqoq65Iij6JiP8KCpr+eoqvCppYfwqKuq6Z2V54GN5Yyk8KKBvumPtOebmfCop6Ppvqfnn53kuqPkv7DlgrzkuK/kvJfpvqjlkLTntovlopLlo5Dwoba25bqS5bqZ5b+C8KKckuaWi1wiXSxcbltcIjhjYTFcIixcIvCjj7nmpJnmqYPwo7Gj5rO/XCJdLFxuW1wiOGNhN1wiLFwi54iA8KSUheeOjOO7m/CkqJPlrJXnkrnoroPwpbKk8KWaleeqk+evrOezg+e5rOiLuOiWl+m+qeiikOm+qui6uem+q+i/j+iVn+mnoOmIoem+rPCotrnwoZC/5IGx5Iqi5aiaXCJdLFxuW1wiOGNjOVwiLFwi6aGo5p2r5Im25Zy9XCJdLFxuW1wiOGNjZVwiLFwi6JeW8KSlu+iKv/CnhI3ksoHwprW05bW78KaslfCmvr7pvq3pvq7lrpbpvq/mm6fnuZvmuZfnp4rjtojkk4Pwo4mW8KKeluSOmuSUtlwiXSxcbltcIjhjZTZcIixcIuWzlfCjrJroq7nlsbjjtJLwo5WR5bW46b6y54WX5JWY8KSDrPChuKPksbfjpbjjkYrwoIak8KaxgeirjOS+tPCgiLnlpr/ohazpoZbwqaO65by7XCJdLFxuW1wiOGQ0MFwiLFwi8KCun1wiXSxcbltcIjhkNDJcIixcIvCih4HwqKWt5ISC5Jq78KmBueO8h+m+s/CqhrXkg7jjn5bkm7fwprGG5IW88KiasvCnj7/kla3jo5TwpZKa5JWh5JSb5LaJ5LG75LW25Jeq47+I8KSsj+OZoeSTnuSSveSHreW0vuW1iOW1luO3vOOgj+W2pOW2ueOgoOOguOW5guW6veW8peW+g+OkiOOklOOkv+OljeaDl+aEveWzpeOmieaGt+aGueaHj+OmuOaIrOaKkOaLpeaMmOOnuOWasVwiXSxcbltcIjhkYTFcIixcIuOog+aPouaPu+aQh+aRmuOpi+aTgOW0leWYoem+n+Oql+aWhuOqveaXv+aZk+OrsuaakuOsouacluOtguaepOaggOOtmOahiuaihOOtsuOtseOtu+akiealg+eJnOalpOamn+amheOuvOanluOvneappeaptOapseaqguOvrOaqmeOvsuaqq+aqtearlOartuaugeavgeavquaxteayquOzi+a0gua0hua0pua2geOzr+a2pOa2sea4lea4mOa4qea6hvCop4Dmurvmu6Lmu5rpvb/mu6jmu6nmvKTmvLTjtYbwo72B5r6B5r6+47Wq47W154a35bKZ47aK54Cs47aR54GQ54GU54Gv54G/54KJ8KCMpeSPgeOXsfCgu5hcIl0sXG5bXCI4ZTQwXCIsXCLwo7uX5Z6+8Ka7k+eEvvCln6DjmY7mpqLwqK+p5a2056mJ8KWjofCpk5nnqaXnqb3wpaas56q756qw56uC56uD54eR8KaSjeSHiuermuerneerquSHr+WSsvClsIHnrIvnrZXnrKnwpYyO8KWzvueuouetr+iOnPClrrTwprG/56+Q6JCh566S56648KW0oOO2rfClsaXokpLnr7rnsIbnsLXwpbOB57GE57KD8KSigueypuaZvfCklbjns4nns4fns6bnsbTns7Pns7Xns45cIl0sXG5bXCI4ZWExXCIsXCLnuafklJ3wprmE57Wd8Ka7lueSjee2iee2q+eEtee2s+e3kvCkgZfwpoCp57ek47ST57e18KGfuee3pfCoja3nuJ3wpoSh8KaFmue5rue6kuSMq+mRrOe4p+e9gOe9gee9h+ektvCmi5Dpp6Hnvpfwpo2R576j8KGZofCggajklZzwo52m5JSD8KiMuue/uvCmkonogIXogIjogJ3ogKjogK/wqoKH8Kazg+iAu+iAvOiBofCinJTkponwppim8KO3o/Cmm6jmnKXogqfwqKmI6ISH6ISa5aKw8KKbtuaxv/CmkpjwpL645pOn8KGSiuiImPChoZ7mqZPwpKml8KSqleSRuuiIqfCgrI3wpqmS8KO1vuS/ufChk73ok6LojaLwpqyK8KSmp/CjlLDwoZ2z8KO3uOiKquakm/CvppTkh5tcIl0sXG5bXCI4ZjQwXCIsXCLolYvoi5DojJrwoLiW8KGetOObgfCjhb3wo5Wa6Im76Iui6IyY8KO6i/CmtqPwpqyF8Kaul/Cjl47jtr/ojJ3ll6zojoXklIvwpral6I6s6I+B6I+T45G+8Ka7lOapl+iVmuOSlvCmuYLworuv6JGY8KWvpOiRseO3k+STpOaqp+iRivCjsrXnpZjokqjwpq6W8Ka5t/CmuYPok57okI/ojpHkkqDokpPok6TwpbKR5ImA8KWzgOSVg+iUtOWrsvCmupnklKfolbPklJbmnr/omJZcIl0sXG5bXCI4ZmExXCIsXCLwqJil8KiYu+iXgfCngojomILwoZaC8KeDjfCvprLklaromKjjmYjwoaKi5Y+38KeOmuiZvuidsfCqg7jon67worCn6J6x6J+a6KCP5Zmh6Jms5qGW5JiP6KGF6KGG8KeXoPCjtrnwp5ek6KGe6KKc5Jmb6KK06KK15o+B6KOF55238Kecj+imh+imiuimpuimqeimp+imvPCoqKXop6fwp6Sk8KeqveiqnOeek+mHvuiqkPCnqZnnq6nwp6y68KO+j+Sck/CnrLjnhbzorIzorJ/wpZCw8KWVpeisv+itjOitjeiqqfCkqbrorpDorpvoqq/woZuf5JiV6KGP6LKb8Ke1lPCnto/wr6eU45yl8Ke1k+izlvCntpjwp7a96LSS6LSD8KGkkOizm+eBnOi0kfCks4nju5DotbdcIl0sXG5bXCI5MDQwXCIsXCLotqnwqICC8KGAlPCkporjrbzwqIa88KeEjOerp+i6rei6tui7g+mLlOi8mei8rfCojaXwqJCS6L6l6YyD8KqKn/CgqZDovrPkpKrwqKee8KiUvfCjtrvlu7jwo4mi6L+58KqAlPComrzwqJSB8KKMpeOmgPCmu5fpgLfwqJS88KeqvumBofColazwqJiL6YKo8Kick+mDhPCom6bpgq7pg73phafjq7Dphqnph4TnsqzwqKSz8KG6iemIjuayn+mJgemJovCllrnpirnwqKuG8KOym/CorIzwpZebXCJdLFxuW1wiOTBhMVwiLFwi8KC0semMrOmNq/Coq6HwqK+r54KP5auD8KirovCoq6XkpaXpiYTwqK+s8KiwufCor7/pjbPpkZvourzploXplqbpkKbplqDmv7bkirnwopm68KibmPChibzwo7iu5Kef5rCc6Zm76ZqW5IWs6Zqj8Ka7leaHmumatuejtfCoq6Dpmr3lj4zkpqHwprK48KCJtPCmkJDwqYKv8KmDpfCkq5HwoaSV8KOMiumcseiZgumctuSoj+SUveSWhfCkq6nngbXlrYHpnJvpnZzwqYeV6Z2X5a2K8KmHq+mdn+mQpeWDkPCjgrfwo4K86Z6J6Z6f6Z6x6Z6+6Z+A6Z+S6Z+g8KWRrOmfrueQnPCpkLPpn7/pn7XwqZCd8KeluuSrkemgtOmgs+mhi+mhpuOsjvCnhbXjtZHwoJiw8KSFnFwiXSxcbltcIjkxNDBcIixcIvClnIbpo4rporfpo4jpo4fkq7/wprSn8KGbk+WWsOmjoemjpumjrOmNuOmkufCkqKnkrbLwqaGX8KmkhemntemojOmou+mokOmpmPClnKXjm4TwqYKx8KmvlemroOmrovCprIXpq7TksI7prJTprK3wqJiA5YC06ay08KamqOOjg/Cjgb3prZDprYDwqbS+5amF8KGho+mujvCkiYvpsILpr7/psIzwqbmo6beU8Km+t/CqhpLwqoar8KqDofCqhKPwqoef6bW+6baD8KqEtOm4juaiiFwiXSxcbltcIjkxYTFcIixcIum3hPCihZvwqoaT8KqIoPChpLvwqoiz6bS58KqCufCqirTpupDpupXpup7puqLktLTpuqrpuq/wpI2k6buB462g46el47Sd5Lyy456+8Kiwq+m8gum8iOSulumQpPCmtqLpvJfpvJbpvLnlmp/lmorpvYXpprjwqYKL6Z+y6JG/6b2i6b2p56uc6b6O54iW5K6+8KSltfCkprvnhbfwpKe48KSNiPCkqZHnjp7wqK+a8KGjuuemn/Copb7wqLi26Y2p6Y+z8KiphOmLrOmOgemPi/CopazwpJK554iX47ur552y56mD54OQ8KSRs/Ckj7jnhb7woZ+v54Kj8KGivvCjlpnju4fwoaKF8KWQr/Chn7jjnKLwoZu78KGgueObofChnbTwoaOR8KW9i+Oco/Chm4DlnZvwpKil8KGPvvChiqhcIl0sXG5bXCI5MjQwXCIsXCLwoY+G8KGStuiUg/CjmqbolIPokZXwpKaU8KeFpfCjuLHwpZWc8KO7u/CngZLkk7Two5uu8KmmnfCmvKbmn7njnLPjsJXjt6floazwoaSi5qCQ5IGX8KOcv/Ckg6HwpIKL8KSEj/CmsKHlk4vlmp7wppqx5ZqS8KC/n/CgrqjwoLiN6Y+G8Kisk+mOnOS7uOWEq+OgmfCkkLbkurzwoJGl8KCNv+S9i+S+ivClmZHlqajwoIar8KCPi+OmmfCgjIrwoJCU45C15Lyp8KCLgPCourPwoIm16Kua8KCIjOS6mFwiXSxcbltcIjkyYTFcIixcIuWDjeWEjeS+ouS8g/CkqI7wo7qK5L2C5YCu5YGs5YKB5L+M5L+l5YGY5YO85YWZ5YWb5YWd5YWe5rm28KOWlfCjuLnwo7q/5rWy8KGihPCjuonlhqjlh4PwoJeg5JOd8KCSo/CgkpLwoJKR6LW68KiqnPCgnI7liZnliqTwoKGz5Yuh6Y2u5Jm654aM8KSOjPCgsKDwpKas8KGDpOankfCguJ3nkbnju57nkpnnkJTnkZbnjpjkro7wpKq88KSCjeWPkOOWhOeIj/Ckg4nllrTwoI2F5ZON8KCvhuWcnemJnembtOmNpuWfneWejeWdv+OYvuWji+WqmfCoqYbwoZu68KGdr/ChnJDlqKzlprjpio/lqb7lq4/lqJLwpaWG8KGns/ChoaHwpIqV45u15rSF55GD5aih8KW6g1wiXSxcbltcIjkzNDBcIixcIuWqgfCor5fwoJCT6Y+g55KM8KGMg+eEheSlsumQiPCop7vpjr3jnqDlsJ7lsp7luZ7luYjwoaaW8KGlvPCjq67lu43lrY/woaSD8KGkhOOcgfChoqDjm53woZu+45uT6ISq8Kiph/Chtrrwo5Gy8KimqOW8jOW8jvChpKfwoZ6r5amr8KGcu+WthOiYlPCnl73ooaDmgb7woqGg8KKYq+W/m+O6uPCilq/wopa+8KmCiPCmvbPmh4DwoIC+8KCBhvCimJvmhpnmhpjmgbXworKb8KK0h/Ckm5TwqYWNXCJdLFxuW1wiOTNhMVwiLFwi5pGx8KSZpfCirarjqKnwoqyi8KORkPCpo6rworm45oy38KqRm+aStuaMseaPkfCkp6PworWn5oqk8KKyoeaQu+aVq+alsuOvtPCjgo7wo4qt8KSmifCjiqvllI3wo4ug8KGjmfCpkL/mm47wo4qJ8KOGs+OroOSGkPClloTwqKyi8KWWj/Chm7zwpZWb8KWQpeejrvCjhIPwoaCq8KOItOORpPCjiI/wo4aC8KSLieaajvCmtKTmmavkrpPmmLDwp6Gw8KG3q+aZo/Cji5Lwo4uh5pie8KWhsuOjkfCjoLrwo568466Z8KOeovCjj77nk5Djrpbmno/wpJiq5qK25qCe46+E5qq+46Gj8KOflfCkkofmqLPmqZLmq4nmrIXwoaSS5pSR5qKY5qmM46+X5qm65q2X8KO/gPCjsprpjqDpi7LwqK+q8Kiri1wiXSxcbltcIjk0NDBcIixcIumKifCogJ7wqKec6ZGn5ral5ryL8KSnrOa1p/Cjvb/jto/muITwpIC85ai95riK5aGH5rSk56GC54S78KSMmvCkibbng7HniZDniofnipTwpJ6P8KScpeWFufCkqqTwoJer55G68KO7uPCjmZ/wpKmK8KSkl/Clv6HjvIbjurHwpKuf8Kiwo/CjvLXmgqfju7Pnk4znkLzpjofnkLfkkp/wpreq5JWR55aD472j8KSzmfCktIbjvZjnlZXnmbPwqpeG46yZ55Go8KirjPCkpqvwpKaO46u7XCJdLFxuW1wiOTRhMVwiLFwi47eN8KSpjuO7v/Ckp4XwpKOz6Ye65Zyy6Y2C8Kiro/ChoaTlg5/wpYih8KWHp+eduPCjiLLnnI7nnI/nnbvwpJqX8KOegeOpnvCko7DnkLjnkpvjur/wpKq68KSrh+SDiPCkqpbwpoau6YyH8KWWgeegnueijeeiiOejkuePkOelmfCnnYHwpZuj5ISO56ab6JKW56al5qit8KO7uueouuentOSFrvChm6bkhLLpiLXnp7HwoLWM8KSmjPCgipnwo7a68KGdruOWl+WVq+OVsOOaqvCgh5TwoLCN56ui5amZ8KKbtfClqq/wpaqc5aiN8KCJm+ejsOWoqvClr4bnq77kh7nnsZ3nsa3kiJHwpa6z8KW6vPCluqbns43wpKe58KGesOeyjuexvOeyruaqsue3nOe4h+e3k+e9jvCmiaFcIl0sXG5bXCI5NTQwXCIsXCLwpoWc8KetiOe2l/CluoLkiarwpq218KCkluaflvCggY7wo5eP5Z+E8KaQkvCmj7jwpKWi57+d56yn8KCgrPClq6nwpbWD56yM8KW4jumnpuiZhempo+aonPCjkL/jp6LwpKe38KaWremon/CmlqDokoDwp4Sn8KazkeSTquiEt+SQguiDhuiEieiFgvCmnrTpo4PwpqmC6Imi6Iml8KapkeiRk/CmtqfomJDwp4ib5aqG5IW/8KGhgOWsq/ChoqHlq6TwoaOY6Jqg8K+mvPCjto/ooK3wp5Ci5aiCXCJdLFxuW1wiOTVhMVwiLFwi6KGu5L2F6KKH6KK/6KOm6KWl6KWN8KWag+illPCnnoXwp56E8KivtfCor5nwqK6c8KinueO6reiSo+SbteSbj+OfsuioveionPCpkYjlvY3piKvwpIqE5peU54Sp54OE8KGhhem1reiyn+izqfCnt5zlpprnn4Plp7Dkja7jm5TouKrouqfwpLCJ6Lyw6L2K5Iu05rGY5r678KKMoeSim+a9uea6i/Chn5rpr6njmrXwpKSv6YK76YKX5ZWx5KSG6Ya76ZCE8Kipi+SBovCoq7zpkKfwqLCd8Kiwu+iTpeioq+mWmemWp+mWl+mWlvCotLTnkYXju4LwpKO/8KSpgvCkj6rju6fwo4il6ZqP8Ki7p/CouabwqLml47uM8KSnrfCkqbjwo7+u55CS55Gr47u86Z2B8KmCsFwiXSxcbltcIjk2NDBcIixcIuahh+SonfCpgpPwpZ+f6Z2d6Y2o8KimifCosKbwqKyv8KaOvumKuuWskeitqeSkvOePufCkiJvpnpvpnbHppLjwoLym5beB8KivhfCkqrLpoJ/wqZOa6Yu28KmXl+mHpeSTgPCorZDwpKmn8KitpOmjnPCoqYXjvIDpiKrkpKXokJTppLvppY3wp6yG47e96aab5K2v6aaq6amc8KitpfClo4jmqo/pqKHlq77pqK/wqaOx5K6Q8KmliOmmvOSuveSul+mNveWhsvChjILloKLwpKa4XCJdLFxuW1wiOTZhMVwiLFwi8KGTqOehhPCinJ/wo7a45qOF47W96ZGY46Sn5oWQ8KKegfCipavmhIfpsY/psZPpsbvpsLXpsJDprb/pr4/wqbit6a6f8KqHtfCqg77ptKHksq7wpISE6biY5LKw6bSM8KqGtPCqg63wqoOz8Kmkr+m2peiSvfCmuJLwpr+f8KauguiXvOSUs/CmtqTwprqE8Ka3sOiQoOiXrvCmuIDwo5+X8KaBpOenovCjlpzwo5mA5KSt8KSnnuO1oumPm+mKvumNiPCgir/nornpibfpkY3kv6TjkYDpgaTwpZWd56C956GU56K256GL8KGdl/Cjh4nwpKWB45qa5L2y5r+a5r+Z54Ce54Ce5ZCU8KSGteWeu+Wjs+Weium0luWfl+eEtOOSr/Ckhqznh6vwprGA8KS+l+WsqPChnrXwqKmJXCJdLFxuW1wiOTc0MFwiLFwi5oSM5auO5aiL5Iq88KSSiOOcrOStu/Cop7zpjrvpjrjwoaOW8KC8neiRsvCms4DwoZCT8KSLuvCisKbwpI+B5aaU8KO2t/CmnYHntqjwpoWb8KaCpPCkprnwpKaL8KinuumLpeePouO7qeeStPCoraPwoaKf47uh8KSqs+armOePs+ePu+O7lvCkqL7wpKqU8KGfmfCkqabwoI6n8KGQpPCkp6XnkYjwpKSW54Kl8KSltumKhOePpumNn/Cgk77pjLHwqKuO8KiolumOhvCor6fwpZeV5KS18KiqgueFq1wiXSxcbltcIjk3YTFcIixcIvCkpYPwoLO/5Zqk8KCYmvCgr6vwoLK45ZSC56eE8KGfuue3vvChm4LwpKmQ8KGhkuSUrumQgeOcivCoq4DwpKat5aaw8KGiv/ChooPwp5KE5aqh45ui8KO1m+OasOmJn+WpufCoqoHwoaGi6Y2047ON8KCqtOSqluOmiuWDtOO1qeO1jPChjpznhbXki7vwqIiY5riP8KmDpOSTq+a1l/CnuY/ngafmsq/js5bwo7+t8KO4rea4gua8jOO1r/Cgj7XnlZHjmrzjk4jkmoDju5rkobHlp4Tpia7kpL7ovYHwqLCc8KavgOWgkuWfiOOblvChkZLng77wpI2i8KSpsfCiv6PwoYqw8KKOveaiuealp/Chjpjwo5Ol8KevtPCjm5/wqKqD8KOflvCjj7rwpLKf5qia8KOarfCmsrfokL7kk5/kk45cIl0sXG5bXCI5ODQwXCIsXCLwprSm8Ka1kfCmsoLwpr+e5ryX8KeEieiMvfChnLroj63wprKA8KeBk/Chn5vlponlqoLwoZ6z5amh5amx8KGkhfCkh7zjnK3lp6/woZy845uH54aO6Y6Q5pqa8KSKpeWpruWoq/CkipPmqKvwo7u58KectvCkkZvwpIuK54Sd8KSJmfCop6HkvrDwprSo5bOC8KSTjvCnuY3wpI695qiM8KSJlvChjITngqbnhLPwpI+p47al5rOf8K+gpfCkqY/nuaXlp6vltK/jt7PlvZzwpKmd8KGfn+e2pOiQplwiXSxcbltcIjk4YTFcIixcIuWShfCjq7rwo4yA8KCIlOWdvvCgo5XwoJiZ47+l8KG+nvCqirbngIPwqYWb5bWw546P57OT8KipmfCpkKDkv4jnv6fni43njJDwp6u054y454y58KWbtueNgeeNiOO6qfCnrJjpgaznh7XwpKOy54+h6Ie247uK55yM47uR5rKi5Zu955CZ55Ce55Cf47ui47uw47u047u655OT47yO472T55WC55Wt55Wy55aN472855eI55ec47+A55mN47+X55m047+c55m68KS9nOeGiOWYo+imgOWhqeSAneedg+SAueadoeSBheOXm+eemOSBquSBr+Wxnueevuefi+WjsuegmOeCueegnOSCqOegueehh+ehkeehpuiRiPCllLXnpLPmoIPnpLLkhINcIl0sXG5bXCI5OTQwXCIsXCLkhInnppHnppnovrvnqIbovrzkhafnqpHkhrLnqrzoibnkh4Tnq4/nq5vkh4/kuKHnraLnraznrbvnsJLnsJvkiaDkibrnsbvnspzkioznsrjkipTns63ovpPng4DwoLOP57eP57eU57eQ57e9576u576054qf5I6X6ICg6ICl56y56ICu6ICx6IGU47eM5Z6054Kg6IK36IOp5I+t6ISM54yq6ISO6ISS55Wg6ISU5JCB46y56IWW6IWZ6IWaXCJdLFxuW1wiOTlhMVwiLFwi5JCT5aC66IW86IaE5JCl6IaT5JCt6Ial5Z+v6IeB6Iek6ImU5JKP6Iqm6Im26IuK6IuY6Iu/5JKw6I2X6Zmp5qaK6JCF54O16JGk5oOj6JKI5JSE6JK+6JOh6JO46JSQ6JS46JWS5JS76JWv6JWw6Jeg5JW36Jmy6JqS6Jqy6Juv6ZmF6J6L5JiG5JiX6KKu6KO/6KSk6KWH6KaR8Kelp+ioqeiouOiqlOiqtOixkeizlOizsui0nOSemOWhn+i3g+SfreS7rui4uuWXmOWdlOi5seWXtei6sOSgt+i7jui7oui7pOi7rei7sui+t+i/gei/iui/jOmAs+mnhOSiremjoOmIk+SknumIqOmJmOmJq+mKsemKrumKv1wiXSxcbltcIjlhNDBcIixcIumLo+mLq+mLs+mLtOmLvemNg+mOhOmOreSlheSlkem6v+mQl+WMgemQnemQremQvuSlqumRlOmRuemUremWouSmp+mXtOmYs+SnpeaeoOSopOmdgOSotemesumfguWZlOSrpOaDqOmiueSsmemjseWhhOmkjumkmeWGtOmknOmkt+mlgumlnemlouStsOmnheSunemovOmsj+eqg+mtqemugemvnemvsemvtOSxremwoOOdr/Chr4LptYnpsLpcIl0sXG5bXCI5YWExXCIsXCLpu77lmZDptpPptr3pt4Dpt7zpk7bovrbpubvpuqzpurHpur3pu4bpk5zpu6Lpu7Hpu7jnq4jpvYTwoIKU8KCKt/CgjqDmpJrpk4PlpqzwoJOX5aGA6ZOB45658KCXlfCgmJXwoJm28KGauuWdl+eFs/Cgq4LwoKuN8KCuv+WRqvCvoLvwoK+L5ZKe8KCvu/CgsLvwoLGT8KCxpfCgsbzmg6fwoLKN5Zm68KCytfCgs53woLOt8KC1r/CgtrLwoLeI5qWV6bCv6J6l8KC4hPCguI7woLuX8KC+kPCgvK3woLmz5bCg8KC+vOW4i/ChgZzwoYGP8KGBtuacnvChgbvwoYKI8KGCluOZh/Chgr/woYOT8KGEr/ChhLvljaTokq3woYuj8KGNtfChjLboroHwoZW38KGYmfChn4PwoZ+H5Lm454K78KGgrfChpapcIl0sXG5bXCI5YjQwXCIsXCLwoait8KGphfChsKrwobGw8KGyrPChu4jmi4PwobuV8KG8leeGmOahlfCigYXmp6njm4jwoom88KKPl/Cij7rwopyq8KKhsfCipY/oi73woqWn8KKmk/Ciq5XopqXwoquo6L6g8KKsjumeuPCirL/poYfpqr3worGMXCJdLFxuW1wiOWI2MlwiLFwi8KKyiPCisrfwpa+o8KK0iPCitJLwora38KK2lfCiuYLwor208KK/jPCjgLPwo4Gm8KOMn/Cjj57lvrHmmYjmmr/wp6m58KOVp/Cjl7PniIHwpKa655+X8KOYmvCjnJbnuofwoI2G5aK15pyOXCJdLFxuW1wiOWJhMVwiLFwi5qSY8KOqp/CnmZfwpb+i8KO4kfCjurnwp5e+8KKCmuSjkOSquPCkhJnwqKqa8KSLrvCkjI3wpIC78KSMtPCkjpbwpKmF8KCXiuWHkvCgmJHlpp/wobqo466+8KOzv/CkkITwpJOW5Z6I8KSZtOOmm/CknK/wqJeo8KmnieOdovCih4PorZ7wqK2O6aeW8KSgkvCko7vwpKiV54iJ8KSrgPCgsbjlpaXwpLql8KS+hvCgnbnou5rwpYCs5YqP5Zy/54Wx8KWKmfClkJnwo72K8KSqp+WWvPClkYbwpZGu8KatkumHlOORs/CllL/wp5iy8KWVnuScmPCllaLwpZWm8KWfh/CkpL/wpaGd5YGm45O78KOPjOaDnvClpIPknbzwqKWI8KWqrvClronwpbCG8KG2kOWeoeeFkea+tvCmhILwp7CS6YGW8KaGsvCkvproraLwppCC8KaRilwiXSxcbltcIjljNDBcIixcIuW1m/Cmr7fovLbwppKE8KGknOirqvCkp7bwppKI8KO/r/CmlJLkr4Dwppa/8KaatfCinJvpkaXwpZ+h5oaV5ain8K+jjeS+u+WaufCklKHwppu85Lmq8KSktOmZlua2j/Cmsr3jmJjopbfwpp6Z8KahrvCmkJHwpqGe54ef8Kajh+etgvCpg4DwoKiR8KakpumEhPCmpLnnqYXpt7Dwpqe66aim8KaoreOZn/CmkanwoICh56aD8KaotPCmrZvltKzwo5SZ6I+P8KauneSbkPCmsqTnlLvooaXwprau5aK2XCJdLFxuW1wiOWNhMVwiLFwi45yc8KKWjfCngYvwp4eN47GU8KeKgPCnioXpioHwooW68KeKi+mMsPCni6bwpKeQ5rC56ZKf8KeRkPCgu7jooKfoo7XwoqSm8KiRs/ChnrHmurjwpKiq8KGgoOOmpOOaueWwkOeno+SUv+aatvCpsq3wqaKk6KWD8KefjPCnoZjlm5bkg5/woZiK46ah8KOcr/Cog6jwoY+F54at6I2m8KennfCphqjlqafksrfwp4Kv8Kimq/Cnp73wp6iK8Kesi/CntabwpIW6562D56W+8KiAiea+tfCqi5/mqIPwqIyY5Y6i8Ka4h+mOv+agtumdnfCoha/wqICj8KamtfChj63wo4iv8KiBiOW2hfCosLDwqIKD5ZyV6aCj8KilieW2q/Ckpojmlr7mp5Xlj5LwpKql8KO+geOwkeactvCogpDwqIO08KiErvChvqHwqIWPXCJdLFxuW1wiOWQ0MFwiLFwi8KiGifCohq/wqIia8KiMhvCojK/wqI6K45eK8KiRqPComqrko7rmj6bwqKWW56CI6YmV8KimuOSPsvCop6fkj5/wqKeo8KithvCor5Tlp7jwqLCJ6LyL8Ki/hfCpg6znrZHwqYSQ8KmEvOO3t/CphZ7wpKuK6L+Q54qP5ZqL8KmTp/Cpl6nwqZaw8KmWuPCpnLLwqaOR8KmlifCpparwqaeD8KmoqPCprI7wqbWa8Km2m+e6n/Cpu7jwqbyj5LKk6ZWH8KqKk+eGovCqi7/ktpHpgJLwqpeL5Lac8KCynOi+vuWXgVwiXSxcbltcIjlkYTFcIixcIui+uvCikrDovrnwpKqT5JSJ57m/5r2W5qqx5Luq45Ok8KisrPCnop3jnLrouoDwoZ+18KiApPCorazwqK6Z8KeovvCmmq/jt6vwp5mV8KOyt/ClmLXwpaWW5Lqa8KW6gfCmiZjlmr/woLmt6LiO5a2t8KO6iPCksp7mj57mi5DwoZ+28KGhu+aUsOWYrfClsYrlkJrwpYyR47eG8Km2mOSxveWYouWYnue9ifClu5jlpbXwo7WA6J2w5Lic8KC/qvCgtYnwo5q66ISX6bWe6LSY55i76bGF55mO55656Y2F5ZCy6IWI6Iu35Zil6ISy6JCY6IK95Zeq56Wi5ZmD5ZCW8KC6neOXjuWYheWXseabsfCoi6LjmK3nlLTll7DllrrlkpfllbLwoLGB8KCyluW7kPClhYjwoLm28KKxolwiXSxcbltcIjllNDBcIixcIvCguqLpuqvntZrll57woYG15oqd6Z2t5ZKU6LON54e26YW25o+85o655o++5ZWp8KKtg+mxsvCiurPlhprjk5/woLan5Yan5ZGN5ZSe5ZST55mm6Lit8KaiiueWseiCtuighOiehuijh+iGtuiQnPChg4Hkk6znjITwpJyG5a6Q6IyL8Kaik+WZu/Cim7Twp7Sv8KSGo/CntbPwpruQ8KeKtumFsPChh5npiIjwo7O88KqaqfCguqzwoLu554mm8KGyouSdjvCkv4Lwp7+58KC/q+SDulwiXSxcbltcIjllYTFcIixcIumxneaUn/CitqDko7PwpJ+g8Km1vPCgv6zwoLiK5oGi8KeWo/Cgv61cIl0sXG5bXCI5ZWFkXCIsXCLwpoGI8KGGh+eGo+e6jum1kOS4muS4hOOVt+WsjeaysuWNp+OarOOnnOWNveOapfCkmJjloprwpK2u6Iit5ZGL5Z6q8KWqlfCgpblcIl0sXG5bXCI5ZWM1XCIsXCLjqZLwopGl54208Km6rOS0iemvrfCjs77wqbyw5LGb8KS+qfCplp7wqb+e6JGc8KO2tvCnirLwpp6z8KOcoOaMrue0pfCju7fwo7is46iq6YCI5YuM47m045m65Jep8KCSjueZgOWrsPCgurbnobrwp7yu5aKn5IK/5Zm86a6L5bW055mU8KqQtOm6heSzoeeXueOfu+aEmfCjg5rwpI+yXCJdLFxuW1wiOWVmNVwiLFwi5Zmd8KGKqeWep/CkpaPwqbiG5Yi08KeCruOWreaxium1vFwiXSxcbltcIjlmNDBcIixcIuexlumsueWfnvChnazlsZPmk5PwqZOQ8KaMtfCnhaTomq3woLSo8Ka0ovCkq6LwoLWxXCJdLFxuW1wiOWY0ZlwiLFwi5Ye+8KG8j+W2jumcg/Cht5HpuoHpgYznrJ/prILls5HnrqPmiajmjLXpq7/nr4/prKrnsb7prK7nsYLnsobpsJXnr7zprInpvJfpsJvwpKS+6b2a5ZWz5a+D5L+96bqY5L+y5Ymg47iG5YuR5Z2n5YGW5aa35biS6Z+I6bar6L2c5ZGp6Z606aWA6Z665Yys5oSwXCJdLFxuW1wiOWZhMVwiLFwi5qSs5Y+a6bCK6bSC5LC76ZmB5qaA5YKm55WG8KGdremnmuWJs1wiXSxcbltcIjlmYWVcIixcIumFmemagemFnFwiXSxcbltcIjlmYjJcIixcIumFkfCoupfmjb/wprSj5quK5ZiR6YaO55W65oqF8KCPvOeNj+exsPClsKHwo7O9XCJdLFxuW1wiOWZjMVwiLFwi8KSkmeeblumuneS4qvCgs5Tojr7ooYJcIl0sXG5bXCI5ZmM5XCIsXCLlsYrmp4Dlg63lnbrliJ/lt7Xku47msLHwoIey5Ly55ZKc5ZOa5Yqa6LaC45e+5byM45ezXCJdLFxuW1wiOWZkYlwiLFwi5q2S6YW86b6l6a6X6aCu6aK06aq66bqo6bqE54W656yUXCJdLFxuW1wiOWZlN1wiLFwi5q+66KCY5724XCJdLFxuW1wiOWZlYlwiLFwi5Zig8KqZiui5t+m9k1wiXSxcbltcIjlmZjBcIixcIui3lOi5j+m4nOi4geaKgvCojb3ouKjoubXnq5PwpKm356i+56OY5rOq6Kmn55iHXCJdLFxuW1wiYTA0MFwiLFwi8Kipmum8puazjuiflueXg/CqirLnoZPwr6GA6LSM54ui542x6Kyt54yC55Ox6LOr8KSqu+iYr+W+uuiioOSSt1wiXSxcbltcImEwNTVcIixcIvChoLvwpriFXCJdLFxuW1wiYTA1OFwiLFwi6Km+8KKUm1wiXSxcbltcImEwNWJcIixcIuaDveeZp+mrl+m1hOmNrumuj+iftVwiXSxcbltcImEwNjNcIixcIuigj+izt+eMrOmcoemusOOXlueKsuSwh+exkemlivCmhZnmhZnksITpupbmhb1cIl0sXG5bXCJhMDczXCIsXCLlnZ/mha/miqbmiLnmi47jqZzmh6Lljqrwo4+15o2k5qCC45eSXCJdLFxuW1wiYTBhMVwiLFwi5bWX8Kivgui/mvCouLlcIl0sXG5bXCJhMGE2XCIsXCLlg5nwobWG56SG5Yyy6Zi48KC8u+SBpVwiXSxcbltcImEwYWVcIixcIuefvlwiXSxcbltcImEwYjBcIixcIuezgvClvJrns5rnqK3ogabogaPntY3nlIXnk7LoppToiJrmnIzogaLwp5KG6IGb55Ow6ISD55yk6KaJ8KafjOeVk/Cmu5Honqnon47oh4jonozoqYnosq3orYPnnKvnk7jok5rjmLXmprLotqZcIl0sXG5bXCJhMGQ0XCIsXCLopqnnkajmtrnon4HwpICR55On47eb54W25oKk5oac47OR54Wi5oG3XCJdLFxuW1wiYTBlMlwiLFwi572x8KisreeJkOaDqeStvuWIoOOwmPCjs4fwpbuX8KeZlvCllLHwoaWE8KGLvvCppIPwprec8KeCreWzgfCmhq3wqKiP8KOZt/Cgg67wpqGG8KS8juSVouWsn/CmjYzpvZDpuqbwpomrXCJdLFxuW1wiYTNjMFwiLFwi4pCAXCIsMzEsXCLikKFcIl0sXG5bXCJjNmExXCIsXCLikaBcIiw5LFwi4pG0XCIsOSxcIuKFsFwiLDksXCLkuLbkuL/kuoXkuqDlhoLlhpblhqvli7nljLjljanljrblpIrlroDlt5vivLPlub/lu7TlvZDlvaHmlLTml6DnlpLnmbbovrXpmrbCqMuG44O944O+44Kd44Ke44CD5Lud44CF44CG44CH44O877y777y94py944GBXCIsMjNdLFxuW1wiYzc0MFwiLFwi44GZXCIsNTgsXCLjgqHjgqLjgqPjgqRcIl0sXG5bXCJjN2ExXCIsXCLjgqVcIiw4MSxcItCQXCIsNSxcItCB0JZcIiw0XSxcbltcImM4NDBcIixcItCbXCIsMjYsXCLRkdC2XCIsMjUsXCLih6fihrjihrnjh4/woIOM5Lma8KCCiuWIguSSkVwiXSxcbltcImM4YTFcIixcIum+sOWGiOm+sfCnmIdcIl0sXG5bXCJjOGNkXCIsXCLvv6Lvv6TvvIfvvILjiLHihJbihKHjgpvjgpziuoDiuoTiuobiuofiuojiuoriuoziuo3iupXiupziup3iuqXiuqfiuqriuqziuq7iurbiurziur7iu4biu4riu4ziu43iu4/iu5biu5fiu57iu6NcIl0sXG5bXCJjOGY1XCIsXCLKg8mQyZvJlMm1xZPDuMWLyorJqlwiXSxcbltcImY5ZmVcIixcIu+/rVwiXSxcbltcImZhNDBcIixcIvCglYfpi5vwoJef8KO/heiVjOSKteePr+WGteOZifCkpYLwqKek6Y2E8KGnm+iLrvCjs4jnoLzmnYTmi5/wpKSz8KimqvCgiqDwpq6z8KGMheS+q/Cik63lgIjwprSp8KeqhPCjmIDwpKqx8KKUk+WAqfCgjb7lvqTwoI6A8KCNh+a7m/CgkJ/lgb3lhIHjkbrlhI7poazjnYPokJbwpKak8KCSh+WFoPCjjrTlharwoK+/8KKDvPCgi6XwopSw8KCWjvCjiLPwoaaD5a6C6J298KCWs/CjspnlhrLlhrhcIl0sXG5bXCJmYWExXCIsXCLptLTlh4nlh4/lh5Hjs5zlh5PwpKqm5Yaz5Yei5Y2C5Yet6I+N5qS+8KOcreW9u+WIi+WIpuWIvOWKteWJl+WKlOWKueWLheewleiVguWLoOiYjfCmrJPljIXwqKue5ZWJ5ruZ8KO+gPCgpZTwo7+s5Yyz5Y2E8KCvouazi/ChnKbmoJvnj5XmgYrjuqrjo4zwoZuo54ed5JKi5Y2t5Y208Kiaq+WNvuWNv/ChlpbwoZiT55+m5Y6T8Kiqm+WOoOWOq+WOrueOp/ClnbLjvZnnjpzlj4Hlj4XmsYnkuYnln77lj5njqqvwoK6P5Y+g8KO/q/CitqPlj7bwoLG35ZCT54G55ZSr5pmX5rWb5ZGt8Katk/CgtbTllZ3lko/lkqTknqbwoZyN8KC7neO2tPCgtY1cIl0sXG5bXCJmYjQwXCIsXCLwqKa88KKamOWVh+SzreWQr+eQl+WWhuWWqeWYhfCho5fwpIC65JWS8KSQteaas/ChgrTlmLfmm43wo4qK5pqk5pqt5ZmN5ZmP56Ox5Zux6Z6H5Y++5ZyA5Zuv5Zut8KitpuOYo/ChiY/lnYbwpIal5rGu54KL5Z2C45qx8KaxvuWfpvChkJbloIPwoZGU8KSNo+WgpvCkr7XloZzloqrjlaHlo6Dlo5zwoYi85aO75a+/5Z2D8KqFkPCkibjpj5PjlqHlpJ/moqbjm4PmuZlcIl0sXG5bXCJmYmExXCIsXCLwoZi+5aik5ZWT8KGakuiUheWnifCgtY7wprKB8Ka0qvChn5zlp5nwoZ+78KGesvCmtqbmtbHwoaCo8KGbleWnufCmuYXlqqvlqaPjm6bwpKap5am345yI5aqW55Gl5auT8Ka+ofCilZTjtoXwoaSR45yy8KGauOW6g+WLkOWttuaWiOWtvPCnqI7kgITkoZ3woIiE5a+V5oWg8KGotPClp4zwoJal5a+z5a6d5LSQ5bCF8KGthOWwk+ePjuWwlPChsqXwpqyo5bGJ5KOd5bKF5bOp5bOv5baL8KG3ufChuLfltJDltJjltYbwobqk5bK65beX6Iu846Ct8KSkgfCigYnwooWz6IqH46C246+C5biu5qqK5bm15bm68KSSvPCgs5Pljqbkurflu5DljqjwoZ2x5biJ5bu08KiSglwiXSxcbltcImZjNDBcIixcIuW7ueW7u+OioOW7vOagvumQm+W8jfCgh4Hwr6KU46ue5KKu8KGMuuW8uvCmoojwoo+Q5b2Y8KKRseW9o+mevfCmua7lvbLpjYDwqKi25b6n5ba247Wf8KWJkPChvarwp4O48KKZqOmHlvCgip7wqKip5oCx5pqF8KGht+Olo+O3h+OYueWekPCinrTnpbHjuYDmgp7mgqTmgrPwpKaC8KSmj/CnqZPnkqTlg6HlqqDmhaTokKTmhYLwr6Km8Ka7kuaGgeWHtPCgmZbmhoflrqrwo763XCJdLFxuW1wiZmNhMVwiLFwi8KKhn+aHk/Corp3wqaWd5oeQ46Sy8KKmgPCio4HmgKPmhZzmlJ7mjovwoISY5ouF8KGdsOaLlfCiuI3mjazwpKef46iX5pC45o+48KGOjvChn7zmkpDmvorwori26aCU8KSCjPClnJ3mk6Hmk6XpkbvjqabmkLrjqZfmlY3mvJbwpKio8KSoo+aWheaVreaVn/Cjgb7mlrXwpKWA5Ky35peR5IOY8KGgqeaXoOaXo+W/n/CjkIDmmJjwo4e38KOHuOaZhPCjhqTwo4al5pmL8KC5teaZp/Clh6bmmbPmmbTwobi98KOIsfCol7Two4eI8KWMk+efhfCio7fppqTmnILwpI6c8KSooeOsq+anuvCjn4LmnZ7mnafmnaLwpIeN8KmDreafl+STqeagoua5kOmIvOaggfCjj6bwprag5qGdXCJdLFxuW1wiZmQ0MFwiLFwi8KORr+anoeaoi/Coq5/mpbPmo4Pwo5eN5qSB5qSA47Sy46iB8KOYvOOugOaerOalofCoqYrki7zmpLbmppjjrqHwoI+J6I2j5YKQ5qe58KOZmfCihKrmqYXwo5yD5qqd46+z5p6x5quI8KmGnOOwjeasnfCgpKPmg57mrLXmrbTwop+N5rq18KOrm/CgjrXwoaWY452A5ZCh8KOtmuavofCju7zmr5zmsLfwopKL8KSjsfCmrZHmsZroiKbmsbnwo7a85JOF8KO2vfCkhqTwpKSM8KSkgFwiXSxcbltcImZkYTFcIixcIvCjs4njm6Xjs6vwoLSy6a6D8KOHufCikpHnvo/moLfwprSl8Ka2ofCmt6vmtpbmtZzmubzmvITwpKW/8KSChfCmubLolLPwpr205YeH5rKc5rid6JCu8Kisoea4r/CjuK/nkZPwo76C56eM5rmP5aqR8KOBi+a/uOOcjea+nfCjuLDmu7rwoZKX8KSAveSVlemPsOa9hOa9nOO1jua9tPCphbDjtLvmvp/wpIWE5r+T8KSCkfCkhZXwpIC58KO/sPCjvrTwpIS/5Yef8KSFlvCkhZfwpIWA8KaHneeBi+eBvueCp+eCgeeDjOeDleeDlueDn+SEhOO3qOeGtOeGlvCkibfnhKvnhYXlqojnhYrnha7lspzwpI2l54WP6Y2i8KSLgeeErPCkkZrwpKin8KSooueGuvCor6jngr3niI5cIl0sXG5bXCJmZTQwXCIsXCLpkYLniJXlpJHpkYPniKTpjYHwpZiF54iu54mA8KSltOaiveeJleeJl+O5lfCjgYTmoI3mvL3nioLnjKrnjKvwpKCj8Kigq+SjrfCooITnjKjnjK7nj4/njqrwoLC68KaoruePieeRifCkh6LwoZun8KSopOaYo+ObhfCkprfwpKaN8KSnu+ePt+eQleakg/CkqKbnkLnwoJeD47uX55Gc8KKireeRoPCourLnkYfnj6TnkbbojrnnkazjnLDnkbTpj7HmqKznkoLkpZPwpKqMXCJdLFxuW1wiZmVhMVwiLFwi8KSFn/CkqbnwqK6P5a2G8Kiwg/Chop7nk4jwoaaI55SO55Op55Se8Ki7mfChqYvlr5fwqLqs6Y6F55WN55WK55Wn55Wu8KS+guO8hPCktJPnlo7nkZ3nlp7nlrTnmILnmKznmZHnmY/nma/nmbbwpo+155qQ6Iev45+48KakkfCmpI7nmqHnmqXnmrfnm4zwpr6f6JGi8KWCnfClhb3wobic55ye55ym552A5pKv8KWIoOedmPCjiqznnq/wqKWk8KilqPChm4Hnn7TnoInwoY228KSokuajiueir+ejh+ejk+mapeekrvCll6Dno5fnpLTnorHwp5iM6L646KKE8Kisq/CmgoPwopic56aG6KSA5qSC56aA8KWhl+emnfCnrLnnpLznpqnmuKrwp4Sm47qo56eG8KmEjeenlFwiXVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuW1wiMFwiLFwiXFx1MDAwMFwiLDEyNyxcIuKCrFwiXSxcbltcIjgxNDBcIixcIuS4guS4hOS4heS4huS4j+S4kuS4l+S4n+S4oOS4oeS4o+S4puS4qeS4ruS4r+S4seS4s+S4teS4t+S4vOS5gOS5geS5guS5hOS5huS5iuS5keS5leS5l+S5muS5m+S5ouS5o+S5pOS5peS5p+S5qOS5qlwiLDUsXCLkubLkubRcIiw5LFwi5Lm/XCIsNixcIuS6h+S6ilwiXSxcbltcIjgxODBcIixcIuS6kOS6luS6l+S6meS6nOS6neS6nuS6o+S6quS6r+S6sOS6seS6tOS6tuS6t+S6uOS6ueS6vOS6veS6vuS7iOS7jOS7j+S7kOS7kuS7muS7m+S7nOS7oOS7ouS7puS7p+S7qeS7reS7ruS7r+S7seS7tOS7uOS7ueS7uuS7vOS7vuS8gOS8glwiLDYsXCLkvIvkvIzkvJJcIiw0LFwi5Lyc5Lyd5Lyh5Lyj5Lyo5Lyp5Lys5Lyt5Lyu5Lyx5Lyz5Ly15Ly35Ly55Ly75Ly+XCIsNCxcIuS9hOS9heS9h1wiLDUsXCLkvZLkvZTkvZbkvaHkvaLkvabkvajkvarkvavkva3kva7kvbHkvbLkvbXkvbfkvbjkvbnkvbrkvb3kvoDkvoHkvoLkvoXkvobkvofkvorkvozkvo7kvpDkvpLkvpPkvpXkvpbkvpjkvpnkvprkvpzkvp7kvp/kvqHkvqJcIl0sXG5bXCI4MjQwXCIsXCLkvqTkvqvkvq3kvrBcIiw0LFwi5L62XCIsOCxcIuS/gOS/geS/guS/huS/h+S/iOS/ieS/i+S/jOS/jeS/klwiLDQsXCLkv5nkv5vkv6Dkv6Lkv6Tkv6Xkv6fkv6vkv6zkv7Dkv7Lkv7Tkv7Xkv7bkv7fkv7nkv7vkv7zkv73kv79cIiwxMV0sXG5bXCI4MjgwXCIsXCLlgIvlgI7lgJDlgJHlgJPlgJXlgJblgJflgJvlgJ3lgJ7lgKDlgKLlgKPlgKTlgKflgKvlgK9cIiwxMCxcIuWAu+WAveWAv+WBgOWBgeWBguWBhOWBheWBhuWBieWBiuWBi+WBjeWBkFwiLDQsXCLlgZblgZflgZjlgZnlgZvlgZ1cIiw3LFwi5YGmXCIsNSxcIuWBrVwiLDgsXCLlgbjlgbnlgbrlgbzlgb3lgoHlgoLlgoPlgoTlgoblgoflgonlgorlgovlgozlgo5cIiwyMCxcIuWCpOWCpuWCquWCq+WCrVwiLDQsXCLlgrNcIiw2LFwi5YK8XCJdLFxuW1wiODM0MFwiLFwi5YK9XCIsMTcsXCLlg5BcIiw1LFwi5YOX5YOY5YOZ5YObXCIsMTAsXCLlg6jlg6nlg6rlg6vlg6/lg7Dlg7Hlg7Llg7Tlg7ZcIiw0LFwi5YO8XCIsOSxcIuWEiFwiXSxcbltcIjgzODBcIixcIuWEieWEiuWEjFwiLDUsXCLlhJNcIiwxMyxcIuWEolwiLDI4LFwi5YWC5YWH5YWK5YWM5YWO5YWP5YWQ5YWS5YWT5YWX5YWY5YWZ5YWb5YWdXCIsNCxcIuWFo+WFpOWFpuWFp+WFqeWFquWFr+WFsuWFuuWFvuWFv+WGg+WGhOWGhuWGh+WGiuWGi+WGjuWGj+WGkOWGkeWGk+WGlOWGmOWGmuWGneWGnuWGn+WGoeWGo+WGplwiLDQsXCLlhq3lhq7lhrTlhrjlhrnlhrrlhr7lhr/lh4Hlh4Llh4Plh4Xlh4jlh4rlh43lh47lh5Dlh5JcIiw1XSxcbltcIjg0NDBcIixcIuWHmOWHmeWHmuWHnOWHnuWHn+WHouWHo+WHpVwiLDUsXCLlh6zlh67lh7Hlh7Llh7Tlh7flh77liITliIXliInliIvliIzliI/liJDliJPliJTliJXliJzliJ7liJ/liKHliKLliKPliKXliKbliKfliKrliKzliK/liLHliLLliLTliLXliLzliL7liYRcIiw1LFwi5YmL5YmO5YmP5YmS5YmT5YmV5YmX5YmYXCJdLFxuW1wiODQ4MFwiLFwi5YmZ5Yma5Ymb5Ymd5Ymf5Ymg5Ymi5Ymj5Ymk5Ymm5Ymo5Ymr5Yms5Ymt5Ymu5Ymw5Ymx5YmzXCIsOSxcIuWJvuWKgOWKg1wiLDQsXCLliolcIiw2LFwi5YqR5YqS5YqUXCIsNixcIuWKnOWKpOWKpeWKpuWKp+WKruWKr+WKsOWKtFwiLDksXCLli4Dli4Hli4Lli4Tli4Xli4bli4jli4rli4zli43li47li4/li5Hli5Pli5Tli5Xli5fli5lcIiw1LFwi5Yug5Yuh5Yui5Yuj5YulXCIsMTAsXCLli7FcIiw3LFwi5Yu75Yu85Yu95YyB5YyC5YyD5YyE5YyH5YyJ5YyK5YyL5YyM5YyOXCJdLFxuW1wiODU0MFwiLFwi5YyR5YyS5YyT5YyU5YyY5Yyb5Yyc5Yye5Yyf5Yyi5Yyk5Yyl5Yyn5Yyo5Yyp5Yyr5Yys5Yyt5YyvXCIsOSxcIuWMvOWMveWNgOWNguWNhOWNhuWNi+WNjOWNjeWNkOWNlOWNmOWNmeWNm+WNneWNpeWNqOWNquWNrOWNreWNsuWNtuWNueWNu+WNvOWNveWNvuWOgOWOgeWOg+WOh+WOiOWOiuWOjuWOj1wiXSxcbltcIjg1ODBcIixcIuWOkFwiLDQsXCLljpbljpfljpnljpvljpzljp7ljqDljqHljqTljqfljqrljqvljqzljq3ljq9cIiw2LFwi5Y635Y645Y655Y665Y685Y695Y6+5Y+A5Y+DXCIsNCxcIuWPjuWPj+WPkOWPkuWPk+WPleWPmuWPnOWPneWPnuWPoeWPouWPp+WPtOWPuuWPvuWPv+WQgOWQguWQheWQh+WQi+WQlOWQmOWQmeWQmuWQnOWQouWQpOWQpeWQquWQsOWQs+WQtuWQt+WQuuWQveWQv+WRgeWRguWRhOWRheWRh+WRieWRjOWRjeWRjuWRj+WRkeWRmuWRnVwiLDQsXCLlkaPlkaXlkaflkalcIiw3LFwi5ZG05ZG55ZG65ZG+5ZG/5ZKB5ZKD5ZKF5ZKH5ZKI5ZKJ5ZKK5ZKN5ZKR5ZKT5ZKX5ZKY5ZKc5ZKe5ZKf5ZKg5ZKhXCJdLFxuW1wiODY0MFwiLFwi5ZKi5ZKl5ZKu5ZKw5ZKy5ZK15ZK25ZK35ZK55ZK65ZK85ZK+5ZOD5ZOF5ZOK5ZOL5ZOW5ZOY5ZOb5ZOgXCIsNCxcIuWTq+WTrOWTr+WTsOWTseWTtFwiLDUsXCLlk7vlk77llIDllILllIPllITllIXllIjllIpcIiw0LFwi5ZSS5ZST5ZSVXCIsNSxcIuWUnOWUneWUnuWUn+WUoeWUpeWUplwiXSxcbltcIjg2ODBcIixcIuWUqOWUqeWUq+WUreWUsuWUtOWUteWUtuWUuOWUueWUuuWUu+WUveWVgOWVguWVheWVh+WViOWVi1wiLDQsXCLllZHllZLllZPllZTllZdcIiw0LFwi5ZWd5ZWe5ZWf5ZWg5ZWi5ZWj5ZWo5ZWp5ZWr5ZWvXCIsNSxcIuWVueWVuuWVveWVv+WWheWWhuWWjOWWjeWWjuWWkOWWkuWWk+WWleWWluWWl+WWmuWWm+WWnuWWoFwiLDYsXCLllqhcIiw4LFwi5Zay5Za05Za25Za45Za65Za85Za/XCIsNCxcIuWXhuWXh+WXiOWXiuWXi+WXjuWXj+WXkOWXleWXl1wiLDQsXCLll57ll6Dll6Lll6fll6nll63ll67ll7Dll7Hll7Tll7bll7hcIiw0LFwi5Ze/5ZiC5ZiD5ZiE5ZiFXCJdLFxuW1wiODc0MFwiLFwi5ZiG5ZiH5ZiK5ZiL5ZiN5ZiQXCIsNyxcIuWYmeWYmuWYnOWYneWYoOWYoeWYouWYpeWYpuWYqOWYqeWYquWYq+WYruWYr+WYsOWYs+WYteWYt+WYuOWYuuWYvOWYveWYvuWZgFwiLDExLFwi5ZmPXCIsNCxcIuWZleWZluWZmuWZm+WZnVwiLDRdLFxuW1wiODc4MFwiLFwi5Zmj5Zml5Zmm5Zmn5Zmt5Zmu5Zmv5Zmw5Zmy5Zmz5Zm05Zm15Zm35Zm45Zm55Zm65Zm9XCIsNyxcIuWah1wiLDYsXCLlmpDlmpHlmpLlmpRcIiwxNCxcIuWapFwiLDEwLFwi5ZqwXCIsNixcIuWauOWaueWauuWau+WavVwiLDEyLFwi5ZuLXCIsOCxcIuWbleWbluWbmOWbmeWbnOWbo+WbpVwiLDUsXCLlm6zlm67lm6/lm7Llm7Plm7blm7flm7jlm7vlm7zlnIDlnIHlnILlnIXlnIflnItcIiw2XSxcbltcIjg4NDBcIixcIuWcklwiLDksXCLlnJ3lnJ7lnKDlnKHlnKLlnKTlnKXlnKblnKflnKvlnLHlnLLlnLRcIiw0LFwi5Zy85Zy95Zy/5Z2B5Z2D5Z2E5Z2F5Z2G5Z2I5Z2J5Z2L5Z2SXCIsNCxcIuWdmOWdmeWdouWdo+WdpeWdp+WdrOWdruWdsOWdseWdsuWdtOWdteWduOWdueWduuWdveWdvuWdv+WegFwiXSxcbltcIjg4ODBcIixcIuWegeWeh+WeiOWeieWeiuWejVwiLDQsXCLlnpRcIiw2LFwi5Z6c5Z6d5Z6e5Z6f5Z6l5Z6o5Z6q5Z6s5Z6v5Z6w5Z6x5Z6z5Z615Z625Z635Z65XCIsOCxcIuWfhFwiLDYsXCLln4zln43ln5Dln5Hln5Pln5bln5fln5vln5zln57ln6Hln6Lln6Pln6VcIiw3LFwi5Z+u5Z+w5Z+x5Z+y5Z+z5Z+15Z+25Z+35Z+75Z+85Z++5Z+/5aCB5aCD5aCE5aCF5aCI5aCJ5aCK5aCM5aCO5aCP5aCQ5aCS5aCT5aCU5aCW5aCX5aCY5aCa5aCb5aCc5aCd5aCf5aCi5aCj5aClXCIsNCxcIuWgq1wiLDQsXCLloLHloLLloLPloLTloLZcIiw3XSxcbltcIjg5NDBcIixcIuWgvlwiLDUsXCLloYVcIiw2LFwi5aGO5aGP5aGQ5aGS5aGT5aGV5aGW5aGX5aGZXCIsNCxcIuWhn1wiLDUsXCLloaZcIiw0LFwi5aGtXCIsMTYsXCLlob/looLlooTloobloofloojloorloovlooxcIl0sXG5bXCI4OTgwXCIsXCLloo1cIiw0LFwi5aKUXCIsNCxcIuWim+WinOWineWioFwiLDcsXCLloqpcIiwxNyxcIuWiveWivuWiv+WjgOWjguWjg+WjhOWjhlwiLDEwLFwi5aOS5aOT5aOU5aOWXCIsMTMsXCLlo6VcIiw1LFwi5aOt5aOv5aOx5aOy5aO05aO15aO35aO45aO6XCIsNyxcIuWkg+WkheWkhuWkiFwiLDQsXCLlpI7lpJDlpJHlpJLlpJPlpJflpJjlpJvlpJ3lpJ7lpKDlpKHlpKLlpKPlpKblpKjlpKzlpLDlpLLlpLPlpLXlpLblpLtcIl0sXG5bXCI4YTQwXCIsXCLlpL3lpL7lpL/lpYDlpYPlpYXlpYblpYrlpYzlpY3lpZDlpZLlpZPlpZnlpZtcIiw0LFwi5aWh5aWj5aWk5aWmXCIsMTIsXCLlpbXlpbflpbrlpbvlpbzlpb7lpb/lpoDlpoXlponlpovlpozlpo7lpo/lppDlppHlppTlppXlppjlpprlppvlppzlpp3lpp/lpqDlpqHlpqLlpqZcIl0sXG5bXCI4YTgwXCIsXCLlpqflpqzlpq3lprDlprHlprNcIiw1LFwi5aa65aa85aa95aa/XCIsNixcIuWnh+WniOWnieWnjOWnjeWnjuWnj+WnleWnluWnmeWnm+WnnlwiLDQsXCLlp6Tlp6blp6flp6nlp6rlp6vlp61cIiwxMSxcIuWnuuWnvOWnveWnvuWogOWoguWoiuWoi+WojeWojuWoj+WokOWokuWolOWoleWoluWol+WomeWomuWom+WoneWonuWooeWoouWopOWopuWop+WoqOWoqlwiLDYsXCLlqLPlqLXlqLdcIiw0LFwi5ai95ai+5ai/5amBXCIsNCxcIuWph+WpiOWpi1wiLDksXCLlqZblqZflqZjlqZnlqZtcIiw1XSxcbltcIjhiNDBcIixcIuWpoeWpo+WppOWppeWppuWpqOWpqeWpq1wiLDgsXCLlqbjlqbnlqbvlqbzlqb3lqb7lqoBcIiwxNyxcIuWqk1wiLDYsXCLlqpxcIiwxMyxcIuWqq+WqrFwiXSxcbltcIjhiODBcIixcIuWqrVwiLDQsXCLlqrTlqrblqrflqrlcIiw0LFwi5aq/5auA5auDXCIsNSxcIuWriuWri+WrjVwiLDQsXCLlq5Plq5Xlq5flq5nlq5rlq5vlq53lq57lq5/lq6Llq6Tlq6Xlq6flq6jlq6rlq6xcIiw0LFwi5auyXCIsMjIsXCLlrIpcIiwxMSxcIuWsmFwiLDI1LFwi5ayz5ay15ay25ay4XCIsNyxcIuWtgVwiLDZdLFxuW1wiOGM0MFwiLFwi5a2IXCIsNyxcIuWtkuWtluWtnuWtoOWtoeWtp+WtqOWtq+WtreWtruWtr+WtsuWttOWttuWtt+WtuOWtueWtu+WtvOWtvuWtv+WuguWuhuWuiuWujeWujuWukOWukeWukuWulOWuluWun+Wup+WuqOWuqeWurOWureWuruWur+WuseWusuWut+WuuuWuu+WuvOWvgOWvgeWvg+WviOWvieWviuWvi+WvjeWvjuWvj1wiXSxcbltcIjhjODBcIixcIuWvkeWvlFwiLDgsXCLlr6Dlr6Llr6Plr6blr6flr6lcIiw0LFwi5a+v5a+xXCIsNixcIuWvveWvvuWwgOWwguWwg+WwheWwh+WwiOWwi+WwjOWwjeWwjuWwkOWwkuWwk+Wwl+WwmeWwm+WwnuWwn+WwoOWwoeWwo+WwpuWwqOWwqeWwquWwq+WwreWwruWwr+WwsOWwsuWws+WwteWwtuWwt+Wxg+WxhOWxhuWxh+WxjOWxjeWxkuWxk+WxlOWxluWxl+WxmOWxmuWxm+WxnOWxneWxn+WxouWxpOWxp1wiLDYsXCLlsbDlsbJcIiw2LFwi5bG75bG85bG95bG+5bKA5bKDXCIsNCxcIuWyieWyiuWyi+WyjuWyj+WykuWyk+WyleWynVwiLDQsXCLlsqRcIiw0XSxcbltcIjhkNDBcIixcIuWyquWyruWyr+WysOWysuWytOWytuWyueWyuuWyu+WyvOWyvuWzgOWzguWzg+WzhVwiLDUsXCLls4xcIiw1LFwi5bOTXCIsNSxcIuWzmlwiLDYsXCLls6Lls6Pls6fls6nls6vls6zls67ls6/ls7FcIiw5LFwi5bO8XCIsNF0sXG5bXCI4ZDgwXCIsXCLltIHltITltIXltIhcIiw1LFwi5bSPXCIsNCxcIuW0leW0l+W0mOW0meW0muW0nOW0neW0n1wiLDQsXCLltKXltKjltKrltKvltKzltK9cIiw0LFwi5bS1XCIsNyxcIuW0v1wiLDcsXCLltYjltYnltY1cIiwxMCxcIuW1meW1muW1nOW1nlwiLDEwLFwi5bWq5bWt5bWu5bWw5bWx5bWy5bWz5bW1XCIsMTIsXCLltoNcIiwyMSxcIuW2muW2m+W2nOW2nuW2n+W2oFwiXSxcbltcIjhlNDBcIixcIuW2oVwiLDIxLFwi5ba4XCIsMTIsXCLlt4ZcIiw2LFwi5beOXCIsMTIsXCLlt5zlt5/lt6Dlt6Plt6Tlt6rlt6zlt61cIl0sXG5bXCI4ZTgwXCIsXCLlt7Dlt7Xlt7blt7hcIiw0LFwi5be/5biA5biE5biH5biJ5biK5biL5biN5biO5biS5biT5biX5bieXCIsNyxcIuW4qFwiLDQsXCLluK/luLDluLJcIiw0LFwi5bi55bi65bi+5bi/5bmA5bmB5bmD5bmGXCIsNSxcIuW5jVwiLDYsXCLluZZcIiw0LFwi5bmc5bmd5bmf5bmg5bmjXCIsMTQsXCLlubXlubflubnlub7luoHluoLluoPluoXluojluonluozluo3luo7lupLlupjlupvlup3luqHluqLluqPluqTluqhcIiw0LFwi5bquXCIsNCxcIuW6tOW6uuW6u+W6vOW6veW6v1wiLDZdLFxuW1wiOGY0MFwiLFwi5buG5buH5buI5buLXCIsNSxcIuW7lOW7leW7l+W7mOW7meW7muW7nFwiLDExLFwi5bup5burXCIsOCxcIuW7teW7uOW7ueW7u+W7vOW7veW8heW8huW8h+W8ieW8jOW8jeW8juW8kOW8kuW8lOW8luW8meW8muW8nOW8neW8nuW8oeW8ouW8o+W8pFwiXSxcbltcIjhmODBcIixcIuW8qOW8q+W8rOW8ruW8sOW8slwiLDYsXCLlvLvlvL3lvL7lvL/lvYFcIiwxNCxcIuW9keW9lOW9meW9muW9m+W9nOW9nuW9n+W9oOW9o+W9peW9p+W9qOW9q+W9ruW9r+W9suW9tOW9teW9tuW9uOW9uuW9veW9vuW9v+W+g+W+huW+jeW+juW+j+W+keW+k+W+lOW+luW+muW+m+W+neW+nuW+n+W+oOW+olwiLDUsXCLlvqnlvqvlvqzlvq9cIiw1LFwi5b625b645b655b665b675b6+XCIsNCxcIuW/h+W/iOW/iuW/i+W/juW/k+W/lOW/leW/muW/m+W/nOW/nuW/n+W/ouW/o+W/peW/puW/qOW/qeW/rOW/r+W/sOW/suW/s+W/tOW/tuW/t+W/ueW/uuW/vOaAh1wiXSxcbltcIjkwNDBcIixcIuaAiOaAieaAi+aAjOaAkOaAkeaAk+aAl+aAmOaAmuaAnuaAn+aAouaAo+aApOaArOaAreaAruaAsFwiLDQsXCLmgLZcIiw0LFwi5oC95oC+5oGA5oGEXCIsNixcIuaBjOaBjuaBj+aBkeaBk+aBlOaBluaBl+aBmOaBm+aBnOaBnuaBn+aBoOaBoeaBpeaBpuaBruaBseaBsuaBtOaBteaBt+aBvuaCgFwiXSxcbltcIjkwODBcIixcIuaCgeaCguaCheaChuaCh+aCiOaCiuaCi+aCjuaCj+aCkOaCkeaCk+aCleaCl+aCmOaCmeaCnOaCnuaCoeaCouaCpOaCpeaCp+aCqeaCquaCruaCsOaCs+aCteaCtuaCt+aCueaCuuaCvVwiLDcsXCLmg4fmg4jmg4nmg4xcIiw0LFwi5oOS5oOT5oOU5oOW5oOX5oOZ5oOb5oOe5oOhXCIsNCxcIuaDquaDseaDsuaDteaDt+aDuOaDu1wiLDQsXCLmhILmhIPmhITmhIXmhIfmhIrmhIvmhIzmhJBcIiw0LFwi5oSW5oSX5oSY5oSZ5oSb5oSc5oSd5oSe5oSh5oSi5oSl5oSo5oSp5oSq5oSsXCIsMTgsXCLmhYBcIiw2XSxcbltcIjkxNDBcIixcIuaFh+aFieaFi+aFjeaFj+aFkOaFkuaFk+aFlOaFllwiLDYsXCLmhZ7mhZ/mhaDmhaHmhaPmhaTmhaXmhabmhalcIiw2LFwi5oWx5oWy5oWz5oW05oW25oW4XCIsMTgsXCLmhozmho3mho9cIiw0LFwi5oaVXCJdLFxuW1wiOTE4MFwiLFwi5oaWXCIsNixcIuaGnlwiLDgsXCLmhqrmhqvmhq1cIiw5LFwi5oa4XCIsNSxcIuaGv+aHgOaHgeaHg1wiLDQsXCLmh4nmh4xcIiw0LFwi5oeT5oeVXCIsMTYsXCLmh6dcIiwxMyxcIuaHtlwiLDgsXCLmiIBcIiw1LFwi5oiH5oiJ5oiT5oiU5oiZ5oic5oid5oie5oig5oij5oim5oin5oio5oip5oir5oit5oiv5oiw5oix5oiy5oi15oi25oi4XCIsNCxcIuaJguaJhOaJheaJhuaJilwiXSxcbltcIjkyNDBcIixcIuaJj+aJkOaJleaJluaJl+aJmeaJmuaJnFwiLDYsXCLmiaTmiaXmiajmibHmibLmibTmibXmibfmibjmibrmibvmib3mioHmioLmioPmioXmiobmiofmiojmiotcIiw1LFwi5oqU5oqZ5oqc5oqd5oqe5oqj5oqm5oqn5oqp5oqq5oqt5oqu5oqv5oqw5oqy5oqz5oq05oq25oq35oq45oq65oq+5ouA5ouBXCJdLFxuW1wiOTI4MFwiLFwi5ouD5ouL5ouP5ouR5ouV5oud5oue5oug5ouh5ouk5ouq5our5ouw5ouy5ou15ou45ou55ou65ou75oyA5oyD5oyE5oyF5oyG5oyK5oyL5oyM5oyN5oyP5oyQ5oyS5oyT5oyU5oyV5oyX5oyY5oyZ5oyc5oym5oyn5oyp5oys5oyt5oyu5oyw5oyx5oyzXCIsNSxcIuaMu+aMvOaMvuaMv+aNgOaNgeaNhOaNh+aNiOaNiuaNkeaNkuaNk+aNlOaNllwiLDcsXCLmjaDmjaTmjaXmjabmjajmjarmjavmjazmja/mjbDmjbLmjbPmjbTmjbXmjbjmjbnmjbzmjb3mjb7mjb/mjoHmjoPmjoTmjoXmjobmjovmjo3mjpHmjpPmjpTmjpXmjpfmjplcIiw2LFwi5o6h5o6k5o6m5o6r5o6v5o6x5o6y5o615o625o655o675o695o6/5o+AXCJdLFxuW1wiOTM0MFwiLFwi5o+B5o+C5o+D5o+F5o+H5o+I5o+K5o+L5o+M5o+R5o+T5o+U5o+V5o+XXCIsNixcIuaPn+aPouaPpFwiLDQsXCLmj6vmj6zmj67mj6/mj7Dmj7Hmj7Pmj7Xmj7fmj7nmj7rmj7vmj7zmj77mkIPmkITmkIZcIiw0LFwi5pCN5pCO5pCR5pCS5pCVXCIsNSxcIuaQneaQn+aQouaQo+aQpFwiXSxcbltcIjkzODBcIixcIuaQpeaQp+aQqOaQqeaQq+aQrlwiLDUsXCLmkLVcIiw0LFwi5pC75pC85pC+5pGA5pGC5pGD5pGJ5pGLXCIsNixcIuaRk+aRleaRluaRl+aRmVwiLDQsXCLmkZ9cIiw3LFwi5pGo5pGq5pGr5pGs5pGuXCIsOSxcIuaRu1wiLDYsXCLmkoPmkobmkohcIiw4LFwi5pKT5pKU5pKX5pKY5pKa5pKb5pKc5pKd5pKfXCIsNCxcIuaSpeaSpuaSp+aSqOaSquaSq+aSr+aSseaSsuaSs+aStOaStuaSueaSu+aSveaSvuaSv+aTgeaTg+aThOaThlwiLDYsXCLmk4/mk5Hmk5Pmk5Tmk5Xmk5bmk5nmk5pcIl0sXG5bXCI5NDQwXCIsXCLmk5vmk5zmk53mk5/mk6Dmk6Hmk6Pmk6Xmk6dcIiwyNCxcIuaUgVwiLDcsXCLmlIpcIiw3LFwi5pSTXCIsNCxcIuaUmVwiLDhdLFxuW1wiOTQ4MFwiLFwi5pSi5pSj5pSk5pSmXCIsNCxcIuaUrOaUreaUsOaUseaUsuaUs+aUt+aUuuaUvOaUveaVgFwiLDQsXCLmlYbmlYfmlYrmlYvmlY3mlY7mlZDmlZLmlZPmlZTmlZfmlZjmlZrmlZzmlZ/mlaDmlaHmlaTmlaXmlafmlajmlanmlarmla3mla7mla/mlbHmlbPmlbXmlbbmlbhcIiwxNCxcIuaWiOaWieaWiuaWjeaWjuaWj+aWkuaWlOaWleaWluaWmOaWmuaWneaWnuaWoOaWouaWo+aWpuaWqOaWquaWrOaWruaWsVwiLDcsXCLmlrrmlrvmlr7mlr/ml4Dml4Lml4fml4jml4nml4rml43ml5Dml5Hml5Pml5Tml5Xml5hcIiw3LFwi5peh5pej5pek5peq5perXCJdLFxuW1wiOTU0MFwiLFwi5pey5pez5pe05pe15pe45pe55pe7XCIsNCxcIuaYgeaYhOaYheaYh+aYiOaYieaYi+aYjeaYkOaYkeaYkuaYluaYl+aYmOaYmuaYm+aYnOaYnuaYoeaYouaYo+aYpOaYpuaYqeaYquaYq+aYrOaYruaYsOaYsuaYs+aYt1wiLDQsXCLmmL3mmL/mmYDmmYLmmYRcIiw2LFwi5pmN5pmO5pmQ5pmR5pmYXCJdLFxuW1wiOTU4MFwiLFwi5pmZ5pmb5pmc5pmd5pme5pmg5pmi5pmj5pml5pmn5pmpXCIsNCxcIuaZseaZsuaZs+aZteaZuOaZueaZu+aZvOaZveaZv+aagOaageaag+aaheaahuaaiOaaieaaiuaai+aajeaajuaaj+aakOaakuaak+aalOaaleaamFwiLDQsXCLmmp5cIiw4LFwi5pqpXCIsNCxcIuaar1wiLDQsXCLmmrXmmrbmmrfmmrjmmrrmmrvmmrzmmr3mmr9cIiwyNSxcIuabmuabnlwiLDcsXCLmm6fmm6jmm6pcIiw1LFwi5pux5pu15pu25pu45pu65pu75pu95pyB5pyC5pyDXCJdLFxuW1wiOTY0MFwiLFwi5pyE5pyF5pyG5pyH5pyM5pyO5pyP5pyR5pyS5pyT5pyW5pyY5pyZ5pya5pyc5pye5pygXCIsNSxcIuacp+acqeacruacsOacsuacs+actuact+acuOacueacu+acvOacvuacv+adgeadhOadheadh+adiuadi+adjeadkuadlOadleadl1wiLDQsXCLmnZ3mnaLmnaPmnaTmnabmnafmnavmnazmna7mnbHmnbTmnbZcIl0sXG5bXCI5NjgwXCIsXCLmnbjmnbnmnbrmnbvmnb3mnoDmnoLmnoPmnoXmnobmnojmnormnozmno3mno7mno/mnpHmnpLmnpPmnpTmnpbmnpnmnpvmnp/mnqDmnqHmnqTmnqbmnqnmnqzmnq7mnrHmnrLmnrTmnrlcIiw3LFwi5p+C5p+FXCIsOSxcIuafleafluafl+afm+afn+afoeafo+afpOafpuafp+afqOafquafq+afreafruafsuaftVwiLDcsXCLmn77moIHmoILmoIPmoITmoIbmoI3moJDmoJLmoJTmoJXmoJhcIiw0LFwi5qCe5qCf5qCg5qCiXCIsNixcIuagq1wiLDYsXCLmoLTmoLXmoLbmoLrmoLvmoL/moYfmoYvmoY3moY/moZLmoZZcIiw1XSxcbltcIjk3NDBcIixcIuahnOahneahnuahn+ahquahrFwiLDcsXCLmobXmobhcIiw4LFwi5qKC5qKE5qKHXCIsNyxcIuaikOaikeaikuailOaileailuaimFwiLDksXCLmoqPmoqTmoqXmoqnmoqrmoqvmoqzmoq7morHmorLmorTmorbmorfmorhcIl0sXG5bXCI5NzgwXCIsXCLmorlcIiw2LFwi5qOB5qODXCIsNSxcIuajiuajjOajjuajj+ajkOajkeajk+ajlOajluajl+ajmeajm1wiLDQsXCLmo6Hmo6Lmo6RcIiw5LFwi5qOv5qOy5qOz5qO05qO25qO35qO45qO75qO95qO+5qO/5qSA5qSC5qSD5qSE5qSGXCIsNCxcIuakjOakj+akkeakk1wiLDExLFwi5qSh5qSi5qSj5qSlXCIsNyxcIuakruakr+akseaksuaks+akteaktuakt+akuOakuuaku+akvOakvualgOalgealg1wiLDE2LFwi5qWV5qWW5qWY5qWZ5qWb5qWc5qWfXCJdLFxuW1wiOTg0MFwiLFwi5qWh5qWi5qWk5qWl5qWn5qWo5qWp5qWq5qWs5qWt5qWv5qWw5qWyXCIsNCxcIualuualu+alvealvualv+amgeamg+amheamiuami+amjOamjlwiLDUsXCLmppbmppfmppnmpprmpp1cIiw5LFwi5qap5qaq5qas5qau5qav5qaw5qay5qaz5qa15qa25qa45qa55qa65qa85qa9XCJdLFxuW1wiOTg4MFwiLFwi5qa+5qa/5qeA5qeCXCIsNyxcIuani+anjeanj+ankeankuank+anlVwiLDUsXCLmp5zmp53mp57mp6FcIiwxMSxcIuanruanr+ansOanseans1wiLDksXCLmp77mqIBcIiw5LFwi5qiLXCIsMTEsXCLmqJlcIiw1LFwi5qig5qiiXCIsNSxcIuaoqeaoq+aorOaoreaoruaosOaosuaos+aotOaotlwiLDYsXCLmqL9cIiw0LFwi5qmF5qmG5qmIXCIsNyxcIuapkVwiLDYsXCLmqZpcIl0sXG5bXCI5OTQwXCIsXCLmqZxcIiw0LFwi5qmi5qmj5qmk5qmmXCIsMTAsXCLmqbJcIiw2LFwi5qm65qm75qm95qm+5qm/5qqB5qqC5qqD5qqFXCIsOCxcIuaqj+aqklwiLDQsXCLmqphcIiw3LFwi5qqhXCIsNV0sXG5bXCI5OTgwXCIsXCLmqqfmqqjmqqrmqq1cIiwxMTQsXCLmrKXmrKbmrKhcIiw2XSxcbltcIjlhNDBcIixcIuasr+assOasseass+astOasteastuasuOasu+asvOasveasv+atgOatgeatguathOatheatiOatiuati+atjVwiLDExLFwi5q2aXCIsNyxcIuatqOatqeatq1wiLDEzLFwi5q265q295q2+5q2/5q6A5q6F5q6IXCJdLFxuW1wiOWE4MFwiLFwi5q6M5q6O5q6P5q6Q5q6R5q6U5q6V5q6X5q6Y5q6Z5q6cXCIsNCxcIuauolwiLDcsXCLmrqtcIiw3LFwi5q625q64XCIsNixcIuavgOavg+avhOavhlwiLDQsXCLmr4zmr47mr5Dmr5Hmr5jmr5rmr5xcIiw0LFwi5q+iXCIsNyxcIuavrOavreavruavsOavseavsuavtOavtuavt+avuOavuuavu+avvOavvlwiLDYsXCLmsIhcIiw0LFwi5rCO5rCS5rCX5rCc5rCd5rCe5rCg5rCj5rCl5rCr5rCs5rCt5rCx5rCz5rC25rC35rC55rC65rC75rC85rC+5rC/5rGD5rGE5rGF5rGI5rGLXCIsNCxcIuaxkeaxkuaxk+axluaxmFwiXSxcbltcIjliNDBcIixcIuaxmeaxmuaxouaxo+axpeaxpuaxp+axq1wiLDQsXCLmsbHmsbPmsbXmsbfmsbjmsbrmsbvmsbzmsb/msoDmsoTmsofmsormsovmso3mso7mspHmspLmspXmspbmspfmspjmsprmspzmsp3msp7msqDmsqLmsqjmsqzmsq/msrDmsrTmsrXmsrbmsrfmsrrms4Dms4Hms4Lms4Pms4bms4fms4jms4vms43ms47ms4/ms5Hms5Lms5hcIl0sXG5bXCI5YjgwXCIsXCLms5nms5rms5zms53ms5/ms6Tms6bms6fms6nms6zms63ms7Lms7Tms7nms7/mtIDmtILmtIPmtIXmtIbmtIjmtInmtIrmtI3mtI/mtJDmtJHmtJPmtJTmtJXmtJbmtJjmtJzmtJ3mtJ9cIiw1LFwi5rSm5rSo5rSp5rSs5rSt5rSv5rSw5rS05rS25rS35rS45rS65rS/5rWA5rWC5rWE5rWJ5rWM5rWQ5rWV5rWW5rWX5rWY5rWb5rWd5rWf5rWh5rWi5rWk5rWl5rWn5rWo5rWr5rWs5rWt5rWw5rWx5rWy5rWz5rW15rW25rW55rW65rW75rW9XCIsNCxcIua2g+a2hOa2hua2h+a2iua2i+a2jea2j+a2kOa2kua2llwiLDQsXCLmtpzmtqLmtqXmtqzmtq3mtrDmtrHmtrPmtrTmtrbmtrfmtrlcIiw1LFwi5reB5reC5reD5reI5reJ5reKXCJdLFxuW1wiOWM0MFwiLFwi5reN5reO5reP5reQ5reS5reT5reU5reV5reX5rea5reb5rec5ref5rei5rej5rel5ren5reo5rep5req5ret5rev5rew5rey5re05re15re25re45re65re9XCIsNyxcIua4hua4h+a4iOa4iea4i+a4j+a4kua4k+a4lea4mOa4mea4m+a4nOa4nua4n+a4oua4pua4p+a4qOa4qua4rOa4rua4sOa4sea4s+a4tVwiXSxcbltcIjljODBcIixcIua4tua4t+a4uea4u1wiLDcsXCLmuYVcIiw3LFwi5rmP5rmQ5rmR5rmS5rmV5rmX5rmZ5rma5rmc5rmd5rme5rmgXCIsMTAsXCLmuazmua3mua9cIiwxNCxcIua6gOa6gea6gua6hOa6h+a6iOa6ilwiLDQsXCLmupFcIiw2LFwi5rqZ5rqa5rqb5rqd5rqe5rqg5rqh5rqj5rqk5rqm5rqo5rqp5rqr5rqs5rqt5rqu5rqw5rqz5rq15rq45rq55rq85rq+5rq/5ruA5ruD5ruE5ruF5ruG5ruI5ruJ5ruK5ruM5ruN5ruO5ruQ5ruS5ruW5ruY5ruZ5rub5ruc5rud5ruj5run5ruqXCIsNV0sXG5bXCI5ZDQwXCIsXCLmu7Dmu7Hmu7Lmu7Pmu7Xmu7bmu7fmu7jmu7pcIiw3LFwi5ryD5ryE5ryF5ryH5ryI5ryKXCIsNCxcIua8kOa8kea8kua8llwiLDksXCLmvKHmvKLmvKPmvKXmvKbmvKfmvKjmvKzmvK7mvLDmvLLmvLTmvLXmvLdcIiw2LFwi5ry/5r2A5r2B5r2CXCJdLFxuW1wiOWQ4MFwiLFwi5r2D5r2E5r2F5r2I5r2J5r2K5r2M5r2OXCIsOSxcIua9mea9mua9m+a9nea9n+a9oOa9oea9o+a9pOa9pea9p1wiLDUsXCLmva/mvbDmvbHmvbPmvbXmvbbmvbfmvbnmvbvmvb1cIiw2LFwi5r6F5r6G5r6H5r6K5r6L5r6PXCIsMTIsXCLmvp3mvp7mvp/mvqDmvqJcIiw0LFwi5r6oXCIsMTAsXCLmvrTmvrXmvrfmvrjmvrpcIiw1LFwi5r+B5r+DXCIsNSxcIua/ilwiLDYsXCLmv5NcIiwxMCxcIua/n+a/oua/o+a/pOa/pVwiXSxcbltcIjllNDBcIixcIua/plwiLDcsXCLmv7BcIiwzMixcIueAklwiLDcsXCLngJxcIiw2LFwi54CkXCIsNl0sXG5bXCI5ZTgwXCIsXCLngKtcIiw5LFwi54C254C354C454C6XCIsMTcsXCLngY3ngY7ngZBcIiwxMyxcIueBn1wiLDExLFwi54Gu54Gx54Gy54Gz54G054G354G554G654G754G954KB54KC54KD54KE54KG54KH54KI54KL54KM54KN54KP54KQ54KR54KT54KX54KY54Ka54Kb54KeXCIsMTIsXCLngrDngrLngrTngrXngrbngrrngr7ngr/ng4Tng4Xng4bng4fng4nng4tcIiwxMixcIueDmlwiXSxcbltcIjlmNDBcIixcIueDnOeDneeDnueDoOeDoeeDoueDo+eDpeeDqueDrueDsFwiLDYsXCLng7jng7rng7vng7zng75cIiwxMCxcIueEi1wiLDQsXCLnhJHnhJLnhJTnhJfnhJtcIiwxMCxcIueEp1wiLDcsXCLnhLLnhLPnhLRcIl0sXG5bXCI5ZjgwXCIsXCLnhLXnhLdcIiwxMyxcIueFhueFh+eFiOeFieeFi+eFjeeFj1wiLDEyLFwi54Wd54WfXCIsNCxcIueFpeeFqVwiLDQsXCLnha/nhbDnhbHnhbTnhbXnhbbnhbfnhbnnhbvnhbznhb5cIiw1LFwi54aFXCIsNCxcIueGi+eGjOeGjeeGjueGkOeGkeeGkueGk+eGleeGlueGl+eGmlwiLDQsXCLnhqFcIiw2LFwi54ap54aq54ar54atXCIsNSxcIueGtOeGtueGt+eGuOeGulwiLDgsXCLnh4RcIiw5LFwi54ePXCIsNF0sXG5bXCJhMDQwXCIsXCLnh5ZcIiw5LFwi54eh54ei54ej54ek54em54eoXCIsNSxcIueHr1wiLDksXCLnh7pcIiwxMSxcIueIh1wiLDE5XSxcbltcImEwODBcIixcIueIm+eInOeInlwiLDksXCLniKnniKvniK3niK7niK/niLLniLPniLTniLrniLzniL7niYBcIiw2LFwi54mJ54mK54mL54mO54mP54mQ54mR54mT54mU54mV54mX54mY54ma54mc54me54mg54mj54mk54ml54mo54mq54mr54ms54mt54mw54mx54mz54m054m254m354m454m754m854m954qC54qD54qFXCIsNCxcIueKjOeKjueKkOeKkeeKk1wiLDExLFwi54qgXCIsMTEsXCLniq7nirHnirLnirPnirXnirpcIiw2LFwi54uF54uG54uH54uJ54uK54uL54uM54uP54uR54uT54uU54uV54uW54uY54ua54ubXCJdLFxuW1wiYTFhMVwiLFwi44CA44CB44CCwrfLicuHwqjjgIPjgIXigJTvvZ7igJbigKbigJjigJnigJzigJ3jgJTjgJXjgIhcIiw3LFwi44CW44CX44CQ44CRwrHDl8O34oi24oin4oio4oiR4oiP4oiq4oip4oiI4oi34oia4oql4oil4oig4oyS4oqZ4oir4oiu4omh4omM4omI4oi94oid4omg4omu4omv4omk4oml4oie4oi14oi04pmC4pmAwrDigLLigLPihIPvvITCpO+/oO+/oeKAsMKn4oSW4piG4piF4peL4peP4peO4peH4peG4pah4pag4paz4pay4oC74oaS4oaQ4oaR4oaT44CTXCJdLFxuW1wiYTJhMVwiLFwi4oWwXCIsOV0sXG5bXCJhMmIxXCIsXCLikohcIiwxOSxcIuKRtFwiLDE5LFwi4pGgXCIsOV0sXG5bXCJhMmU1XCIsXCLjiKBcIiw5XSxcbltcImEyZjFcIixcIuKFoFwiLDExXSxcbltcImEzYTFcIixcIu+8ge+8gu+8g++/pe+8hVwiLDg4LFwi77+jXCJdLFxuW1wiYTRhMVwiLFwi44GBXCIsODJdLFxuW1wiYTVhMVwiLFwi44KhXCIsODVdLFxuW1wiYTZhMVwiLFwizpFcIiwxNixcIs6jXCIsNl0sXG5bXCJhNmMxXCIsXCLOsVwiLDE2LFwiz4NcIiw2XSxcbltcImE2ZTBcIixcIu+4te+4tu+4ue+4uu+4v++5gO+4ve+4vu+5ge+5gu+5g++5hFwiXSxcbltcImE2ZWVcIixcIu+4u++4vO+4t++4uO+4sVwiXSxcbltcImE2ZjRcIixcIu+4s++4tFwiXSxcbltcImE3YTFcIixcItCQXCIsNSxcItCB0JZcIiwyNV0sXG5bXCJhN2QxXCIsXCLQsFwiLDUsXCLRkdC2XCIsMjVdLFxuW1wiYTg0MFwiLFwiy4rLi8uZ4oCT4oCV4oCl4oC14oSF4oSJ4oaW4oaX4oaY4oaZ4oiV4oif4oij4omS4omm4omn4oq/4pWQXCIsMzUsXCLiloFcIiw2XSxcbltcImE4ODBcIixcIuKWiFwiLDcsXCLilpPilpTilpXilrzilr3il6Lil6Pil6Til6XimIniipXjgJLjgJ3jgJ5cIl0sXG5bXCJhOGExXCIsXCLEgcOhx47DoMSTw6nEm8OoxKvDrceQw6zFjcOzx5LDssWrw7rHlMO5x5bHmMeax5zDvMOqyZFcIl0sXG5bXCJhOGJkXCIsXCLFhMWIXCJdLFxuW1wiYThjMFwiLFwiyaFcIl0sXG5bXCJhOGM1XCIsXCLjhIVcIiwzNl0sXG5bXCJhOTQwXCIsXCLjgKFcIiw4LFwi44qj446O446P446c446d446e446h44+E44+O44+R44+S44+V77iw77+i77+kXCJdLFxuW1wiYTk1OVwiLFwi4oSh44ixXCJdLFxuW1wiYTk1Y1wiLFwi4oCQXCJdLFxuW1wiYTk2MFwiLFwi44O844Kb44Kc44O944O+44CG44Kd44Ke77mJXCIsOSxcIu+5lO+5le+5lu+5l++5mVwiLDhdLFxuW1wiYTk4MFwiLFwi77miXCIsNCxcIu+5qO+5qe+5qu+5q1wiXSxcbltcImE5OTZcIixcIuOAh1wiXSxcbltcImE5YTRcIixcIuKUgFwiLDc1XSxcbltcImFhNDBcIixcIueLnOeLneeLn+eLolwiLDUsXCLni6rni6vni7Xni7bni7nni73ni77ni7/njIDnjILnjIRcIiw1LFwi54yL54yM54yN54yP54yQ54yR54yS54yU54yY54yZ54ya54yf54yg54yj54yk54ym54yn54yo54yt54yv54yw54yy54yz54y154y254y654y754y854y9542AXCIsOF0sXG5bXCJhYTgwXCIsXCLnjYnnjYrnjYvnjYznjY7njY/njZHnjZPnjZTnjZXnjZbnjZhcIiw3LFwi542hXCIsMTAsXCLnja7njbDnjbFcIl0sXG5bXCJhYjQwXCIsXCLnjbJcIiwxMSxcIueNv1wiLDQsXCLnjoXnjobnjojnjornjoznjo3njo/njpDnjpLnjpPnjpTnjpXnjpfnjpjnjpnnjprnjpznjp3njp7njqDnjqHnjqNcIiw1LFwi546q546s546t546x5460546154625464546554685469546+546/54+B54+DXCIsNF0sXG5bXCJhYjgwXCIsXCLnj4vnj4znj47nj5JcIiw2LFwi54+a54+b54+c54+d54+f54+h54+i54+j54+k54+m54+o54+q54+r54+s54+u54+v54+w54+x54+zXCIsNF0sXG5bXCJhYzQwXCIsXCLnj7hcIiwxMCxcIueQhOeQh+eQiOeQi+eQjOeQjeeQjueQkVwiLDgsXCLnkJxcIiw1LFwi55Cj55Ck55Cn55Cp55Cr55Ct55Cv55Cx55Cy55C3XCIsNCxcIueQveeQvueQv+eRgOeRglwiLDExXSxcbltcImFjODBcIixcIueRjlwiLDYsXCLnkZbnkZjnkZ3nkaBcIiwxMixcIueRrueRr+eRsVwiLDQsXCLnkbjnkbnnkbpcIl0sXG5bXCJhZDQwXCIsXCLnkbvnkbznkb3nkb/nkoLnkoTnkoXnkobnkojnkonnkornkoznko3nko/nkpFcIiwxMCxcIueSneeSn1wiLDcsXCLnkqpcIiwxNSxcIueSu1wiLDEyXSxcbltcImFkODBcIixcIueTiFwiLDksXCLnk5NcIiw4LFwi55Od55Of55Oh55Ol55OnXCIsNixcIueTsOeTseeTslwiXSxcbltcImFlNDBcIixcIueTs+eTteeTuFwiLDYsXCLnlIDnlIHnlILnlIPnlIVcIiw3LFwi55SO55SQ55SS55SU55SV55SW55SX55Sb55Sd55Se55SgXCIsNCxcIueUpueUp+eUqueUrueUtOeUtueUueeUvOeUveeUv+eVgeeVgueVg+eVhOeVhueVh+eVieeViueVjeeVkOeVkeeVkueVk+eVleeVlueVl+eVmFwiXSxcbltcImFlODBcIixcIueVnVwiLDcsXCLnlafnlajnlannlatcIiw2LFwi55Wz55W155W255W355W6XCIsNCxcIueWgOeWgeeWgueWhOeWheeWh1wiXSxcbltcImFmNDBcIixcIueWiOeWieeWiueWjOeWjeeWjueWkOeWk+eWleeWmOeWm+eWnOeWnueWoueWplwiLDQsXCLnlq3nlrbnlrfnlrrnlrvnlr/nl4Dnl4Hnl4bnl4vnl4znl47nl4/nl5Dnl5Hnl5Pnl5fnl5nnl5rnl5znl53nl5/nl6Dnl6Hnl6Xnl6nnl6znl63nl67nl6/nl7Lnl7Pnl7Xnl7bnl7fnl7jnl7rnl7vnl73nl77nmILnmITnmIbnmIdcIl0sXG5bXCJhZjgwXCIsXCLnmIjnmInnmIvnmI3nmI7nmI/nmJHnmJLnmJPnmJTnmJbnmJrnmJznmJ3nmJ7nmKHnmKPnmKfnmKjnmKznmK7nmK/nmLHnmLLnmLbnmLfnmLnnmLrnmLvnmL3nmYHnmYLnmYRcIl0sXG5bXCJiMDQwXCIsXCLnmYVcIiw2LFwi55mOXCIsNSxcIueZleeZl1wiLDQsXCLnmZ3nmZ/nmaDnmaHnmaLnmaRcIiw2LFwi55ms55mt55mu55mwXCIsNyxcIueZueeZuueZvOeZv+eagOeageeag+eaheeaieeaiueajOeajeeaj+eakOeakuealOealeeal+eamOeamueam1wiXSxcbltcImIwODBcIixcIueanFwiLDcsXCLnmqVcIiw4LFwi55qv55qw55qz55q1XCIsOSxcIuebgOebgeebg+WViumYv+Wfg+aMqOWTjuWUieWTgOeakeeZjOiUvOefruiJvueijeeIsemamOmejeawqOWuieS/uuaMieaal+WyuOiDuuahiOiCruaYguebjuWHueaVlueGrOe/seiihOWCsuWlpeaHiua+s+iKreaNjOaJkuWPreWQp+eshuWFq+eWpOW3tOaLlOi3i+mdtuaKiuiAmeWdnemcuOe9oueIuOeZveafj+eZvuaRhuS9sOi0peaLnOeol+aWkeePreaQrOaJs+iIrOmigeadv+eJiOaJruaLjOS8tOeTo+WNiuWKnue7iumCpuW4ruaihuamnOiGgOe7keajkuejheiajOmVkeWCjeiwpOiLnuiDnuWMheikkuWJpVwiXSxcbltcImIxNDBcIixcIuebhOebh+ebieebi+ebjOebk+ebleebmeebmuebnOebneebnueboFwiLDQsXCLnm6ZcIiw3LFwi55uw55uz55u155u255u355u655u755u955u/55yA55yC55yD55yF55yG55yK55yM55yOXCIsMTAsXCLnnJvnnJznnJ3nnJ7nnKHnnKPnnKTnnKXnnKfnnKrnnKtcIl0sXG5bXCJiMTgwXCIsXCLnnKznnK7nnLBcIiw0LFwi55y555y755y955y+55y/552C552E552F552G552IXCIsNyxcIuedklwiLDcsXCLnnZzoloTpm7nkv53loKHppbHlrp3mirHmiqXmmrTosbnpso3niIbmna/nopHmgrLljZHljJfovojog4zotJ3pkqHlgI3ni4jlpIfmg6vnhJnooqvlpZToi6/mnKznrKjltKnnu7fnlK3ms7Xouabov7jpgLzpvLvmr5TphJnnrJTlvbznoqfok5bolL3mr5Xmr5nmr5bluIHluofnl7npl63mlZ3lvIrlv4Xovp/lo4Hoh4Lpgb/pmZvpnq3ovrnnvJbotKzmiYHkvr/lj5jljZ7ovqjovqnovqvpgY3moIflvarohpjooajps5bmhovliKvnmKrlvazmlozmv5Lmu6jlrr7mkYjlhbXlhrDmn4TkuJnnp4nppbzngrNcIl0sXG5bXCJiMjQwXCIsXCLnnZ3nnZ7nnZ/nnaDnnaTnnafnnannnarnna1cIiwxMSxcIueduuedu+edvOeegeeegueeg+eehlwiLDUsXCLnno/nnpDnnpNcIiwxMSxcIueeoeeeo+eepOeepueeqOeeq+eereeerueer+eeseeesueetOeetlwiLDRdLFxuW1wiYjI4MFwiLFwi5568556+55+AXCIsMTIsXCLnn45cIiw4LFwi55+Y55+Z55+a55+dXCIsNCxcIuefpOeXheW5tueOu+iPoOaSreaLqOmSteazouWNmuWLg+aQj+mTgueulOS8r+W4m+iItuiEluiGiua4pOaziumps+aNleWNnOWTuuihpeWfoOS4jeW4g+atpeewv+mDqOaAluaTpueMnOijgeadkOaJjei0ouedrOi4qemHh+W9qeiPnOiUoemkkOWPguialeaui+aDreaDqOeBv+iLjeiIseS7k+ayp+iXj+aTjeezmeanveabueiNieWOleetluS+p+WGjOa1i+Wxgui5reaPkuWPieiMrOiMtuafpeeitOaQveWvn+WylOW3ruivp+aLhuaftOixuuaQgOaOuuidiemmi+iwl+e8oOmTsuS6p+mYkOmipOaYjOeMllwiXSxcbltcImIzNDBcIixcIuefpuefqOefquefr+efsOefseefsueftOefteeft+efueefuuefu+efvOegg1wiLDUsXCLnoIrnoIvnoI7noI/noJDnoJPnoJXnoJnnoJvnoJ7noKDnoKHnoKLnoKTnoKjnoKrnoKvnoK7noK/noLHnoLLnoLPnoLXnoLbnoL3noL/noYHnoYLnoYPnoYTnoYbnoYjnoYnnoYrnoYvnoY3noY/noZHnoZPnoZTnoZjnoZnnoZpcIl0sXG5bXCJiMzgwXCIsXCLnoZvnoZznoZ5cIiwxMSxcIuehr1wiLDcsXCLnobjnobnnobrnobvnob1cIiw2LFwi5Zy65bCd5bi46ZW/5YG/6IKg5Y6C5pWe55WF5ZSx5YCh6LaF5oqE6ZKe5pyd5Ziy5r2u5bei5ZC154KS6L2m5omv5pKk5o6j5b275r6I6YO06Iej6L6w5bCY5pmo5b+x5rKJ6ZmI6LaB6KGs5pKR56ew5Z+O5qmZ5oiQ5ZGI5LmY56iL5oOp5r6E6K+a5om/6YCe6aqL56ek5ZCD55e05oyB5YyZ5rGg6L+f5byb6amw6IC76b2/5L6I5bC66LWk57+F5pal54K95YWF5Yay6Jmr5bSH5a6g5oq96YWs55W06LiM56ig5oSB56255LuH57u4556F5LiR6Iet5Yid5Ye65qmx5Y6o6LqH6ZSE6ZuP5ruB6Zmk5qWaXCJdLFxuW1wiYjQ0MFwiLFwi56KE56KF56KG56KI56KK56KL56KP56KQ56KS56KU56KV56KW56KZ56Kd56Ke56Kg56Ki56Kk56Km56KoXCIsNyxcIueiteeitueit+eiuOeiuueiu+eivOeiveeiv+ejgOejguejg+ejhOejhuejh+ejiOejjOejjeejjuejj+ejkeejkuejk+ejluejl+ejmOejmlwiLDldLFxuW1wiYjQ4MFwiLFwi56Ok56Ol56Om56On56Op56Oq56Or56OtXCIsNCxcIuejs+ejteejtuejuOejueeju1wiLDUsXCLnpILnpIPnpITnpIZcIiw2LFwi56GA5YKo55+X5pCQ6Kem5aSE5o+j5bed56m/5qS95Lyg6Ii55ZaY5Liy55au56qX5bmi5bqK6Zev5Yib5ZC554KK5o226ZSk5Z6C5pil5qS/6YaH5ZSH5rez57qv6KCi5oiz57uw55a16Iyo56OB6ZuM6L6e5oWI55O36K+N5q2k5Yi66LWQ5qyh6IGq6JGx5Zux5YyG5LuO5Lib5YeR57KX6YaL57CH5L+D6Lm/56+h56qc5pGn5bSU5YKs6ISG55iB57K55res57+g5p2R5a2Y5a+456OL5pKu5pCT5o6q5oyr6ZSZ5pCt6L6+562U55ip5omT5aSn5ZGG5q255YKj5oi05bim5q6G5Luj6LS36KKL5b6F6YCuXCJdLFxuW1wiYjU0MFwiLFwi56SNXCIsNSxcIueklFwiLDksXCLnpJ9cIiw0LFwi56SlXCIsMTQsXCLnpLVcIiw0LFwi56S956S/56WC56WD56WE56WF56WH56WKXCIsOCxcIuellOelleelmOelmeeloeelo1wiXSxcbltcImI1ODBcIixcIuelpOelpuelqeelquelq+elrOelruelsFwiLDYsXCLnpbnnpbtcIiw0LFwi56aC56aD56aG56aH56aI56aJ56aL56aM56aN56aO56aQ56aR56aS5oCg6IC95ouF5Li55Y2V6YO45o646IOG5pem5rCu5L2G5oOu5reh6K+e5by56JuL5b2T5oyh5YWa6I2h5qGj5YiA5o2j6LmI5YCS5bKb56W35a+85Yiw56i75oK86YGT55uX5b635b6X55qE6Lms54Gv55m7562J556q5Yez6YKT5aCk5L2O5ru06L+q5pWM56yb54uE5rak57+f5auh5oq15bqV5Zyw6JKC56ys5bid5byf6YCS57yU6aKg5o6C5ruH56KY54K55YW46Z2b5Z6r55S15L2D55S45bqX5oOm5aWg5reA5q6/56KJ5Y+86ZuV5YeL5YiB5o6J5ZCK6ZKT6LCD6LeM54i556Kf6J226L+t6LCN5Y+gXCJdLFxuW1wiYjY0MFwiLFwi56aTXCIsNixcIuemm1wiLDExLFwi56aoXCIsMTAsXCLnprRcIiw0LFwi56a856a/56eC56eE56eF56eH56eI56eK56eM56eO56eP56eQ56eT56eU56eW56eX56eZXCIsNSxcIuenoOenoeenouenpeenqOenqlwiXSxcbltcImI2ODBcIixcIuenrOenruensVwiLDYsXCLnp7nnp7rnp7znp77np7/nqIHnqITnqIXnqIfnqIjnqInnqIrnqIznqI9cIiw0LFwi56iV56iW56iY56iZ56ib56ic5LiB55uv5Y+u6ZKJ6aG26byO6ZSt5a6a6K6i5Lii5Lic5Yas6JGj5oeC5Yqo5qCL5L6X5oGr5Ya75rSe5YWc5oqW5paX6Zmh6LGG6YCX55eY6YO9552j5q+S54qK54us6K+75aC155256LWM5p2c6ZWA6IKa5bqm5rih5aaS56uv55+t6ZS75q615pat57yO5aCG5YWR6Zif5a+55aKp5ZCo6Lmy5pWm6aG/5Zuk6ZKd55u+6YGB5o6H5ZOG5aSa5aS65Z6b6Lqy5py16Le66Ii15YmB5oOw5aCV6Ju+5bOo6bmF5L+E6aKd6K655ail5oG25Y6E5om86YGP6YSC6aW/5oGp6ICM5YS/6ICz5bCU6aW15rSx5LqMXCJdLFxuW1wiYjc0MFwiLFwi56id56if56ih56ii56ikXCIsMTQsXCLnqLTnqLXnqLbnqLjnqLrnqL7nqYBcIiw1LFwi56mHXCIsOSxcIuepklwiLDQsXCLnqZhcIiwxNl0sXG5bXCJiNzgwXCIsXCLnqalcIiw2LFwi56mx56my56mz56m156m756m856m956m+56qC56qF56qH56qJ56qK56qL56qM56qO56qP56qQ56qT56qU56qZ56qa56qb56qe56qh56qi6LSw5Y+R572a562P5LyQ5LmP6ZiA5rOV54+Q6Jep5biG55Wq57+75qiK55++6ZKS57mB5Yeh54Om5Y+N6L+U6IyD6LSp54qv6aWt5rOb5Z2K6Iqz5pa56IKq5oi/6Ziy5aao5Lu/6K6/57q65pS+6I+y6Z2e5ZWh6aOe6IKl5Yyq6K+95ZCg6IK65bqf5rK46LS56Iqs6YWa5ZCp5rCb5YiG57q35Z2f54Sa5rG+57KJ5aWL5Lu95b+/5oSk57Kq5Liw5bCB5p6r6JyC5bOw6ZSL6aOO55av54O96YCi5Yav57yd6K695aWJ5Yek5L2b5ZCm5aSr5pW36IKk5a215om25ouC6L6Q5bmF5rCf56ym5LyP5L+Y5pyNXCJdLFxuW1wiYjg0MFwiLFwi56qj56qk56qn56qp56qq56qr56quXCIsNCxcIueqtFwiLDEwLFwi56uAXCIsMTAsXCLnq4xcIiw5LFwi56uX56uY56ua56ub56uc56ud56uh56ui56uk56unXCIsNSxcIuerruersOerseersuers1wiXSxcbltcImI4ODBcIixcIuertFwiLDQsXCLnq7vnq7znq77nrIDnrIHnrILnrIXnrIfnrInnrIznrI3nrI7nrJDnrJLnrJPnrJbnrJfnrJjnrJrnrJznrJ3nrJ/nrKHnrKLnrKPnrKfnrKnnrK3mta7mtqrnpo/oorHlvJfnlKvmiprovoXkv6/ph5zmlqfohK/ohZHlupzohZDotbTlia/opobotYvlpI3lgoXku5jpmJzniLbohbnotJ/lr4zorqPpmYTlpofnvJrlkpDlmbblmI7or6XmlLnmpoLpkpnnm5bmuonlubLnlJjmnYbmn5Hnq7/ogp3otbbmhJ/np4bmlaLotaPlhojliJrpkqLnvLjogpvnurLlspfmuK/mnaDnr5nnmovpq5joho/nvpTns5XmkJ7plZDnqL/lkYrlk6XmrYzmkIHmiIjpuL3og7PnlpnlibLpnanokZvmoLzom6TpmIHpmpTpk6zkuKrlkITnu5nmoLnot5/ogJXmm7TluprnvrlcIl0sXG5bXCJiOTQwXCIsXCLnrK/nrLDnrLLnrLTnrLXnrLbnrLfnrLnnrLvnrL3nrL9cIiw1LFwi562G562I562K562N562O562T562V562X562Z562c562e562f562h562jXCIsMTAsXCLnra/nrbDnrbPnrbTnrbbnrbjnrbrnrbznrb3nrb/nroHnroLnroPnroTnroZcIiw2LFwi566O566PXCJdLFxuW1wiYjk4MFwiLFwi566R566S566T566W566Y566Z566a566b566e566f566g566j566k566l566u566v566w566y566z5661566256635665XCIsNyxcIuevguevg+evhOWfguiAv+ail+W3peaUu+WKn+aBrem+muS+m+i6rOWFrOWuq+W8k+W3qeaxnuaLsei0oeWFsemSqeWLvuayn+iLn+eLl+WeouaehOi0reWkn+i+nOiPh+WSleeujeS8sOayveWtpOWnkem8k+WPpOibiumqqOiwt+iCoeaVhemhvuWbuumbh+WIrueTnOWJkOWvoeaMguikguS5luaLkOaAquajuuWFs+WumOWGoOingueuoemmhue9kOaDr+eBjOi0r+WFieW5v+mAm+eRsOinhOWcreehheW9kum+n+mXuui9qOmsvOivoeeZuOahguafnOi3qui0teWIvei+iua7muajjemUhemDreWbveaenOijuei/h+WTiFwiXSxcbltcImJhNDBcIixcIuevheeviOevieeviuevi+evjeevjuevj+evkOevkuevlFwiLDQsXCLnr5vnr5znr57nr5/nr6Dnr6Lnr6Pnr6Tnr6fnr6jnr6nnr6vnr6znr63nr6/nr7Dnr7JcIiw0LFwi56+456+556+656+756+956+/XCIsNyxcIuewiOewieewiuewjeewjuewkFwiLDUsXCLnsJfnsJjnsJlcIl0sXG5bXCJiYTgwXCIsXCLnsJpcIiw0LFwi57CgXCIsNSxcIuewqOewqeewq1wiLDEyLFwi57C5XCIsNSxcIuexgumquOWtqea1t+awpuS6peWus+mqh+mFo+aGqOmCr+mfqeWQq+a2teWvkuWHveWWiue9lee/sOaSvOaNjeaXseaGvuaCjeeEiuaxl+axieWkr+adreiIquWjleWajuixquavq+mDneWlveiAl+WPt+a1qeWRteWWneiNt+iPj+aguOemvuWSjOS9leWQiOebkuiyiemYguays+a2uOi1q+ikkOm5pOi0uuWYv+m7keeXleW+iOeLoOaBqOWTvOS6qOaoquihoeaBkui9sOWThOeDmOiZuem4v+a0quWuj+W8mOe6ouWWieS+r+eMtOWQvOWOmuWAmeWQjuWRvOS5juW/veeRmuWjtuiRq+iDoeidtOeLkOeziua5llwiXSxcbltcImJiNDBcIixcIuexg1wiLDksXCLnsY5cIiwzNixcIuextVwiLDUsXCLnsb5cIiw5XSxcbltcImJiODBcIixcIueyiOeyilwiLDYsXCLnspPnspTnspbnspnnsprnspvnsqDnsqHnsqPnsqbnsqfnsqjnsqnnsqvnsqznsq3nsq/nsrDnsrRcIiw0LFwi57K657K75byn6JmO5ZSs5oqk5LqS5rKq5oi36Iqx5ZOX5Y2O54y+5ruR55S75YiS5YyW6K+d5qeQ5b6K5oCA5reu5Z2P5qyi546v5qGT6L+Y57yT5o2i5oKj5ZSk55eq6LGi54SV5raj5a6m5bm76I2S5oWM6buE56O66J2X57Cn55qH5Yew5oO254WM5pmD5bmM5oGN6LCO54Gw5oyl6L6J5b695oGi6JuU5Zue5q+B5oKU5oWn5Y2J5oOg5pmm6LS/56e95Lya54Op5rGH6K6z6K+y57uY6I2k5piP5ama6a2C5rWR5re36LGB5rS75LyZ54Gr6I635oiW5oOR6ZyN6LSn56W45Ye75Zy+5Z+65py655W456i956ev566VXCJdLFxuW1wiYmM0MFwiLFwi57K/57OA57OC57OD57OE57OG57OJ57OL57OOXCIsNixcIuezmOezmuezm+ezneeznuezoVwiLDYsXCLns6lcIiw1LFwi57OwXCIsNyxcIuezueezuuezvFwiLDEzLFwi57SLXCIsNV0sXG5bXCJiYzgwXCIsXCLntJFcIiwxNCxcIue0oee0o+e0pOe0pee0pue0qOe0qee0que0rOe0ree0rue0sFwiLDYsXCLogozppaXov7nmv4DorqXpuKHlp6znu6nnvInlkInmnoHmo5jovpHnsY3pm4blj4rmgKXnlr7msbLljbPlq4nnuqfmjKTlh6DohIrlt7Hok5/mioDlhoDlraPkvI7npa3liYLmgrjmtY7lr4Tlr4LorqHorrDml6Llv4zpmYXlppPnu6fnuqrlmInmnrflpLnkvbPlrrbliqDojZrpoorotL7nlLLpkr7lgYfnqLzku7fmnrbpqb7lq4Hmrbznm5HlnZrlsJbnrLrpl7TnhY7lhbzogqnoibDlpbjnvITojKfmo4Dmn6znorHnobfmi6PmjaHnroDkv63liarlh4/ojZDmp5vpibTot7XotLHop4HplK7nrq3ku7ZcIl0sXG5bXCJiZDQwXCIsXCLntLdcIiw1NCxcIue1r1wiLDddLFxuW1wiYmQ4MFwiLFwi57W4XCIsMzIsXCLlgaXoiLDliZHppa/muJDmuoXmtqflu7rlg7Xlp5zlsIbmtYbmsZ/nlobokovmoajlpZborrLljKDphbHpmY3olYnmpJLnpIHnhKbog7bkuqTpg4rmtYfpqoTlqIflmrzmkIXpk7Dnn6vkvqXohJrni6Hop5LppbrnvLTnu57lib/mlZnphbXovb/ovoPlj6vnqpbmj63mjqXnmobnp7jooZfpmLbmiKrliqvoioLmoZTmnbDmjbfnnavnq63mtIHnu5Pop6Plp5DmiJLol4noiqXnlYzlgJ/ku4vnlqXor6vlsYrlt77nrYvmlqTph5Hku4rmtKXopZ/ntKfplKbku4XosKjov5vpnbPmmYvnpoHov5Hng6zmtbhcIl0sXG5bXCJiZTQwXCIsXCLntplcIiwxMixcIue2p1wiLDYsXCLntq9cIiw0Ml0sXG5bXCJiZTgwXCIsXCLnt5pcIiwzMixcIuWwveWKsuiNhuWFouiMjuedm+aZtumyuOS6rOaDiueyvueys+e7j+S6leitpuaZr+miiOmdmeWig+aVrOmVnOW+hOeXiemdluern+ernuWHgOeCr+eqmOaPqueptue6oOeOlumfreS5heeBuOS5nemFkuWOqeaVkeaXp+iHvOiIheWSjuWwseeWmumeoOaLmOeLmeeWveWxhempueiPiuWxgOWSgOefqeS4vuayruiBmuaLkuaNruW3qOWFt+i3nei4numUr+S/seWPpeaDp+eCrOWJp+aNkOm5g+Won+WApuect+WNt+e7ouaSheaUq+aKieaOmOWAlOeIteinieWGs+ivgOe7neWdh+iPjOmSp+WGm+WQm+Wzu1wiXSxcbltcImJmNDBcIixcIue3u1wiLDYyXSxcbltcImJmODBcIixcIue4uue4vFwiLDQsXCLnuYJcIiw0LFwi57mIXCIsMjEsXCLkv4rnq6PmtZrpg6Hpqo/lloDlkpbljaHlkq/lvIDmj6nmpbflh6/mhajliIrloKrli5jlnY7noI3nnIvlurfmhbfns6DmiZvmipfkuqLngpXogIPmi7fng6TpnaDlnbfoi5vmn6/mo7Xno5Xpopfnp5Hlo7PlkrPlj6/muLTlhYvliLvlrqLor77ogq/llYPlnqbmgbPlnZHlkK3nqbrmgZDlrZTmjqfmiqDlj6PmiaPlr4fmnq/lk63nqp/oi6bphbflupPoo6TlpLjlnq7mjI7ot6jog6/lnZfnrbfkvqnlv6vlrr3mrL7ljKHnrZDni4LmoYbnn7/nnLbml7flhrXkuo/nm5Tlsr/nqqXokbXlpY7prYHlgoBcIl0sXG5bXCJjMDQwXCIsXCLnuZ5cIiwzNSxcIue6g1wiLDIzLFwi57qc57qd57qeXCJdLFxuW1wiYzA4MFwiLFwi57qu57q057q757q857uW57uk57us57u557yK57yQ57ye57y357y557y7XCIsNixcIue9g+e9hlwiLDksXCLnvZLnvZPppojmhKfmuoPlnaTmmIbmjYblm7Dmi6zmianlu5PpmJTlnoPmi4nllofonKHohYrovqPllabojrHmnaXotZbok53lqarmoI/mi6bnr67pmJHlhbDmvpzosLDmj73op4jmh5LnvIbng4Lmu6XnkIXmppTni7zlu4rpg47mnJfmtarmjZ7lirPniaLogIHkvazlp6Xpharng5nmtp3li5LkuZDpm7fpla3olb7no4rntK/lhKHlnpLmk4Logovnsbvms6rmo7HmpZ7lhrfljpjmoqjnioHpu47nr7Hni7jnprvmvJPnkIbmnY7ph4zpsqTnpLzojonojZTlkI/moJfkuL3ljonlirHnoL7ljobliKnlgojkvovkv5BcIl0sXG5bXCJjMTQwXCIsXCLnvZbnvZnnvZvnvZznvZ3nvZ7nvaDnvaNcIiw0LFwi572r572s572t572v572w572z57215722572357245726572757285729572/576A576CXCIsNyxcIue+i+e+jee+j1wiLDQsXCLnvpVcIiw0LFwi576b576c576g576i576j576l576m576oXCIsNixcIue+sVwiXSxcbltcImMxODBcIixcIue+s1wiLDQsXCLnvrrnvrvnvr7nv4Dnv4Lnv4Pnv4Tnv4bnv4fnv4jnv4nnv4vnv43nv49cIiw0LFwi57+W57+X57+ZXCIsNSxcIue/oue/o+eXoueri+eykuaypematuWKm+eSg+WTqeS/qeiBlOiOsui/numVsOW7ieaAnOa2n+W4mOaVm+iEuOmTvuaBi+eCvOe7g+eyruWHieaigeeyseiJr+S4pOi+humHj+aZvuS6ruiwheaSqeiBiuWDmueWl+eHjuWvpei+vea9puS6huaSgumVo+W7luaWmeWIl+ijgueDiOWKo+eMjueQs+ael+ejt+mcluS4tOmCu+mznua3i+WHm+i1geWQneaLjueOsuiPsembtum+hOmTg+S8tue+muWHjOeBtemZteWyremihuWPpuS7pOa6nOeQieamtOehq+mmj+eVmeWImOeYpOa1geafs+WFrem+meiBi+WSmeesvOeqv1wiXSxcbltcImMyNDBcIixcIue/pOe/p+e/qOe/que/q+e/rOe/ree/r+e/sue/tFwiLDYsXCLnv73nv77nv7/ogILogIfogIjogInogIrogI7ogI/ogJHogJPogJrogJvogJ3ogJ7ogJ/ogKHogKPogKTogKtcIiw1LFwi6ICy6IC06IC56IC66IC86IC+6IGA6IGB6IGE6IGF6IGH6IGI6IGJ6IGO6IGP6IGQ6IGR6IGT6IGV6IGW6IGXXCJdLFxuW1wiYzI4MFwiLFwi6IGZ6IGbXCIsMTMsXCLogatcIiw1LFwi6IGyXCIsMTEsXCLpmoblnoTmi6LpmYfmpbzlqITmkILnr5PmvI/pmYvoiqbljaLpooXlupDngonmjrPljaTomY/psoHpupPnoozpnLLot6/otYLpub/mvZ7npoTlvZXpmYbmiK7pqbTlkJXpk53kvqPml4XlsaXlsaHnvJXomZHmsK/lvovnjofmu6Tnu7/ls6bmjJvlrarmu6bljbXkubHmjqDnlaXmiqHova7kvKbku5HmsqbnurborrrokJ3onrrnvZfpgLvplKPnrqnpqqHoo7jokL3mtJvpqobnu5zlpojpurvnjpvnoIHomoLpqazpqoLlmJvlkJfln4vkubDpuqbljZbov4johInnnpLpppLom67mu6HolJPmm7zmhaLmvKtcIl0sXG5bXCJjMzQwXCIsXCLogb7ogoHogoLogoXogojogorogo1cIiw1LFwi6IKU6IKV6IKX6IKZ6IKe6IKj6IKm6IKn6IKo6IKs6IKw6IKz6IK16IK26IK46IK56IK76IOF6IOHXCIsNCxcIuiDj1wiLDYsXCLog5jog5/og6Dog6Log6Pog6bog67og7Xog7fog7nog7vog77og7/ohIDohIHohIPohITohIXohIfohIjohItcIl0sXG5bXCJjMzgwXCIsXCLohIzohJXohJfohJnohJvohJzohJ3ohJ9cIiwxMixcIuiEreiEruiEsOiEs+iEtOiEteiEt+iEuVwiLDQsXCLohL/osKnoipLojKvnm7LmsJPlv5nojr3njKvojIXplJrmr5vnn5vpk4blja/ojILlhpLluL3osozotLjkuYjnjqvmnprmooXphbbpnInnhaTmsqHnnInlqpLplYHmr4/nvo7mmKflr5Dlprnlqprpl6jpl7fku6zokIzokpnmqqznm5/plLDnjJvmoqblrZ/nnK/phprpnaHns5zov7fosJzlvKXnsbPnp5jop4Xms4zonJzlr4bluYLmo4nnnKDnu7XlhpXlhY3li4nlqKnnvIXpnaLoi5fmj4/nnoTol5Dnp5LmuLrlupnlppnolJHnga3msJHmir/nmr/mlY/mgq/pl73mmI7onp/puKPpk63lkI3lkb3osKzmkbhcIl0sXG5bXCJjNDQwXCIsXCLohYBcIiw1LFwi6IWH6IWJ6IWN6IWO6IWP6IWS6IWW6IWX6IWY6IWbXCIsNCxcIuiFoeiFouiFo+iFpOiFpuiFqOiFquiFq+iFrOiFr+iFsuiFs+iFteiFtuiFt+iFuOiGgeiGg1wiLDQsXCLohonohovohozoho3oho7ohpDohpJcIiw1LFwi6IaZ6Iaa6IaeXCIsNCxcIuiGpOiGpVwiXSxcbltcImM0ODBcIixcIuiGp+iGqeiGq1wiLDcsXCLohrRcIiw1LFwi6Ia86Ia96Ia+6Ia/6IeE6IeF6IeH6IeI6IeJ6IeL6IeNXCIsNixcIuaRueiYkeaooeiGnOejqOaRqemtlOaKueacq+iOq+WiqOm7mOayq+a8oOWvnumZjOiwi+eJn+afkOaLh+eJoeS6qeWnhuavjeWik+aaruW5leWLn+aFleacqOebruedpueJp+ephuaLv+WTquWRkOmSoOmCo+WonOe6s+awluS5g+WltuiAkOWliOWNl+eUt+mavuWbiuaMoOiEkeaBvOmXuea3luWRoummgeWGheWrqeiDveWmrumck+WAquazpeWwvOaLn+S9oOWMv+iFu+mAhua6uuiUq+aLiOW5tOeivuaSteaNu+W/teWomOmFv+m4n+Wwv+aNj+iBguWtveWVrumViumVjea2heaCqOafoOeLnuWHneWugVwiXSxcbltcImM1NDBcIixcIuiHlFwiLDE0LFwi6Iek6Iel6Iem6Ieo6Iep6Ier6IeuXCIsNCxcIuiHtVwiLDUsXCLoh73oh7/oiIPoiIdcIiw0LFwi6IiO6IiP6IiR6IiT6IiVXCIsNSxcIuiIneiIoOiIpOiIpeiIpuiIp+iIqeiIruiIsuiIuuiIvOiIveiIv1wiXSxcbltcImM1ODBcIixcIuiJgOiJgeiJguiJg+iJheiJhuiJiOiJiuiJjOiJjeiJjuiJkFwiLDcsXCLoiZnoiZvoiZzoiZ3oiZ7oiaBcIiw3LFwi6Imp5oun5rOe54mb5omt6ZKu57q96IST5rWT5Yac5byE5aW05Yqq5oCS5aWz5pqW6JmQ55af5oyq5oem57Ov6K+65ZOm5qyn6bil5q606JeV5ZGV5YG25rKk5ZWq6La054is5biV5oCV55C25ouN5o6S54mM5b6Y5rmD5rS+5pSA5r2Y55uY56OQ55u855WU5Yik5Y+b5LmT5bqe5peB6ICq6IOW5oqb5ZKG5Yio54Ku6KKN6LeR5rOh5ZG46IOa5Z+56KO06LWU6Zmq6YWN5L2p5rKb5Za355uG56Cw5oqo54O55r6O5b2t6JOs5qOa56G856+36Iao5pyL6bmP5o2n56Kw5Z2v56CS6Zy55om55oqr5YqI55C15q+XXCJdLFxuW1wiYzY0MFwiLFwi6Imq6Imr6Ims6Imt6Imx6Im16Im26Im36Im46Im76Im86IqA6IqB6IqD6IqF6IqG6IqH6IqJ6IqM6IqQ6IqT6IqU6IqV6IqW6Iqa6Iqb6Iqe6Iqg6Iqi6Iqj6Iqn6Iqy6Iq16Iq26Iq66Iq76Iq86Iq/6IuA6IuC6IuD6IuF6IuG6IuJ6IuQ6IuW6IuZ6Iua6Iud6Iui6Iun6Iuo6Iup6Iuq6Ius6Iut6Iuu6Iuw6Iuy6Iuz6Iu16Iu26Iu4XCJdLFxuW1wiYzY4MFwiLFwi6Iu66Iu8XCIsNCxcIuiMiuiMi+iMjeiMkOiMkuiMk+iMluiMmOiMmeiMnVwiLDksXCLojKnojKrojK7ojLDojLLojLfojLvojL3llaTohL7nlrLnmq7ljLnnl57lg7vlsYHoraznr4flgY/niYfpqpfpo5jmvILnk6LnpajmkofnnqXmi7zpopHotKvlk4HogZjkuZLlnaroi7nokI3lubPlh63nk7bor4TlsY/lnaHms7zpooflqYbnoLTprYTov6vnspXliZbmiZHpk7rku4bojobokaHoj6nokrLln5TmnLTlnIPmma7mtabosLHmm53ngJHmnJ/mrLrmoJbmiJrlprvkuIPlh4TmvIbmn5Lmso/lhbbmo4vlpYfmrafnlabltI7ohJDpvZDml5fnpYjnpYHpqpHotbflsoLkuZ7kvIHlkK/lpZHnoIzlmajmsJTov4TlvIPmsb3ms6PorqvmjpBcIl0sXG5bXCJjNzQwXCIsXCLojL7ojL/ojYHojYLojYTojYXojYjojYpcIiw0LFwi6I2T6I2VXCIsNCxcIuiNneiNouiNsFwiLDYsXCLojbnojbrojb5cIiw2LFwi6I6H6I6I6I6K6I6L6I6M6I6N6I6P6I6Q6I6R6I6U6I6V6I6W6I6X6I6Z6I6a6I6d6I6f6I6hXCIsNixcIuiOrOiOreiOrlwiXSxcbltcImM3ODBcIixcIuiOr+iOteiOu+iOvuiOv+iPguiPg+iPhOiPhuiPiOiPieiPi+iPjeiPjuiPkOiPkeiPkuiPk+iPleiPl+iPmeiPmuiPm+iPnuiPouiPo+iPpOiPpuiPp+iPqOiPq+iPrOiPreaBsOa0veeJteaJpumSjumTheWNg+i/geetvuS7n+iwpuS5vum7lOmSsemSs+WJjea9nOmBo+a1heiwtOWgkeW1jOasoOatieaequWRm+iFlOe+jOWimeiUt+W8uuaKouaph+mUueaVsuaChOahpeeep+S5lOS+qOW3p+memOaSrOe/mOWzreS/j+eqjeWIh+iMhOS4lOaAr+eqg+mSpuS+teS6suenpueQtOWLpOiKueaTkuemveWvneaygemdkui9u+awouWAvuWNv+a4heaTjuaZtOawsOaDhemht+ivt+W6hueQvOept+eni+S4mOmCseeQg+axguWbmumFi+azhei2i+WMuuibhuabsui6r+WxiOmpsea4oFwiXSxcbltcImM4NDBcIixcIuiPruiPr+iPs1wiLDQsXCLoj7roj7voj7zoj77oj7/okIDokILokIXokIfokIjokInokIrokJDokJJcIiw1LFwi6JCZ6JCa6JCb6JCeXCIsNSxcIuiQqVwiLDcsXCLokLJcIiw1LFwi6JC56JC66JC76JC+XCIsNyxcIuiRh+iRiOiRiVwiXSxcbltcImM4ODBcIixcIuiRilwiLDYsXCLokZJcIiw0LFwi6JGY6JGd6JGe6JGf6JGg6JGi6JGkXCIsNCxcIuiRquiRruiRr+iRsOiRsuiRtOiRt+iRueiRu+iRvOWPluWotum+i+i2o+WOu+WciOmip+adg+mGm+azieWFqOeXiuaLs+eKrOWIuOWKnee8uueClOeYuOWNtOm5iuamt+ehrumbgOijmee+pOeEtueHg+WGieafk+eTpOWjpOaUmOWat+iuqemltuaJsOe7leaDueeDreWjrOS7geS6uuW/jemfp+S7u+iupOWIg+Wmiue6q+aJlOS7jeaXpeaIjuiMuOiTieiNo+iejeeGlOa6tuWuuee7kuWGl+aPieaflOiCieiMueigleWEkuWtuuWmgui+seS5s+axneWFpeikpei9r+mYruiViueRnumUkOmXsOa2puiLpeW8seaSkua0kuiQqOiFrumzg+Whnui1m+S4ieWPgVwiXSxcbltcImM5NDBcIixcIuiRvVwiLDQsXCLokoPokoTokoXokobokoroko3oko9cIiw3LFwi6JKY6JKa6JKb6JKd6JKe6JKf6JKg6JKiXCIsMTIsXCLokrDokrHokrPokrXokrbokrfokrvokrzokr7ok4Dok4Lok4Pok4Xok4bok4fok4jok4vok4zok47ok4/ok5Lok5Tok5Xok5dcIl0sXG5bXCJjOTgwXCIsXCLok5hcIiw0LFwi6JOe6JOh6JOi6JOk6JOnXCIsNCxcIuiTreiTruiTr+iTsVwiLDEwLFwi6JO96JO+6JSA6JSB6JSC5Lye5pWj5qGR5ZeT5Lin5pCU6aqa5omr5auC55Gf6Imy5rap5qOu5YOn6I6O56CC5p2A5Yi55rKZ57qx5YK75ZWl54We562b5pmS54+K6Iur5p2J5bGx5Yig54W96KGr6Zeq6ZmV5pOF6LWh6Iaz5ZaE5rGV5omH57yu5aKS5Lyk5ZWG6LWP5pmM5LiK5bCa6KOz5qKi5o2O56iN54On6IqN5Yu66Z+25bCR5ZOo6YK157uN5aWi6LWK6JuH6IiM6IiN6LWm5pGE5bCE5oWR5raJ56S+6K6+56C355Sz5ZG75Ly46Lqr5rex5aig57uF56We5rKI5a6h5am255Sa6IK+5oWO5riX5aOw55Sf55Sl54my5Y2H57uzXCJdLFxuW1wiY2E0MFwiLFwi6JSDXCIsOCxcIuiUjeiUjuiUj+iUkOiUkuiUlOiUleiUluiUmOiUmeiUm+iUnOiUneiUnuiUoOiUolwiLDgsXCLolK1cIiw5LFwi6JS+XCIsNCxcIuiVhOiVheiVhuiVh+iVi1wiLDEwXSxcbltcImNhODBcIixcIuiVl+iVmOiVmuiVm+iVnOiVneiVn1wiLDQsXCLolaXolabolafolalcIiw4LFwi6JWz6JW16JW26JW36JW46JW86JW96JW/6JaA6JaB55yB55ub5Ymp6IOc5Zyj5biI5aSx54uu5pa95rm/6K+X5bC46Jmx5Y2B55+z5ou+5pe25LuA6aOf6JqA5a6e6K+G5Y+y55+i5L2/5bGO6am25aeL5byP56S65aOr5LiW5p+/5LqL5out6KqT6YCd5Yq/5piv5Zec5Zms6YCC5LuV5L6N6YeK6aWw5rCP5biC5oGD5a6k6KeG6K+V5pS25omL6aaW5a6I5a+/5o6I5ZSu5Y+X55im5YW96JSs5p6i5qKz5q6K5oqS6L6T5Y+U6IiS5reR55aP5Lmm6LWO5a2w54af6Jav5pqR5puZ572y6JyA6buN6byg5bGe5pyv6L+w5qCR5p2f5oiN56uW5aKF5bq25pWw5ryxXCJdLFxuW1wiY2I0MFwiLFwi6JaC6JaD6JaG6JaIXCIsNixcIuiWkFwiLDEwLFwi6JadXCIsNixcIuiWpeiWpuiWp+iWqeiWq+iWrOiWreiWsVwiLDUsXCLolrjolrpcIiw2LFwi6JeCXCIsNixcIuiXilwiLDQsXCLol5Hol5JcIl0sXG5bXCJjYjgwXCIsXCLol5Tol5ZcIiw1LFwi6JedXCIsNixcIuiXpeiXpuiXp+iXqOiXqlwiLDE0LFwi5oGV5Yi36ICN5pGU6KGw55Sp5biF5qCT5ou06Zyc5Y+M54i96LCB5rC0552h56iO5ZCu556s6aG66Iic6K+056GV5pyU54OB5pav5pKV5Zi25oCd56eB5Y+45Lid5q276IKG5a+65Zej5Zub5Ly65Ly86aWy5bez5p2+6IC45oCC6aKC6YCB5a6L6K686K+15pCc6ImY5pOe5Ze96IuP6YWl5L+X57Sg6YCf57Kf5YOz5aGR5rqv5a6/6K+J6IKD6YW46JKc566X6Jm96ZqL6ZqP57ul6auT56KO5bKB56mX6YGC6Zqn56Wf5a2Z5o2f56yL6JOR5qKt5ZSG57yp55CQ57Si6ZSB5omA5aGM5LuW5a6D5aW55aGUXCJdLFxuW1wiY2M0MFwiLFwi6Je56Je66Je86Je96Je+6JiAXCIsNCxcIuiYhlwiLDEwLFwi6JiS6JiT6JiU6JiV6JiXXCIsMTUsXCLomKjomKpcIiwxMyxcIuiYueiYuuiYu+iYveiYvuiYv+iZgFwiXSxcbltcImNjODBcIixcIuiZgVwiLDExLFwi6JmS6JmT6JmVXCIsNCxcIuiZm+iZnOiZneiZn+iZoOiZoeiZo1wiLDcsXCLnja3mjJ7ouYvouI/og47oi5Tmiqzlj7Dms7DphZ7lpKrmgIHmsbDlnY3mkYrotKrnmKvmu6nlnZvmqoDnl7Dmva3osK3osIjlnabmr6/oopLnorPmjqLlj7nngq3msaTloZjmkKrloILmo6DohpvllJDns5blgJjourrmt4zotp/ng6vmjo/mtpvmu5Tnu6bokITmoYPpgIPmt5jpmbborqjlpZfnibnol6Tohb7nlrzoqormoq/liZTouKLplJHmj5DpopjouYTllbzkvZPmm7/lmo/mg5XmtpXliYPlsYnlpKnmt7vloavnlLDnlJzmgazoiJTohYbmjJHmnaHov6LnnLrot7PotLTpk4HluJbljoXlkKzng4NcIl0sXG5bXCJjZDQwXCIsXCLoma3oma/ombDombJcIiw2LFwi6JqDXCIsNixcIuiajlwiLDQsXCLompTompZcIiw1LFwi6JqeXCIsNCxcIuiapeiapuiaq+iareiaruiasuias+iat+iauOiaueiau1wiLDQsXCLom4Hom4Lom4Pom4Xom4jom4zom43om5Lom5Pom5Xom5bom5fom5rom5xcIl0sXG5bXCJjZDgwXCIsXCLom53om6Dom6Hom6Lom6Pom6Xom6bom6fom6jom6rom6vom6zom6/om7Xom7bom7fom7rom7vom7zom73om7/onIHonITonIXonIbonIvonIzonI7onI/onJDonJHonJTonJbmsYDlu7flgZzkuq3luq3mjLroiYfpgJrmoZDpha7nnrPlkIzpk5zlvaTnq6XmobbmjYXnrZLnu5/nl5vlgbfmipXlpLTpgI/lh7jnp4PnqoHlm77lvpLpgJTmtoLlsaDlnJ/lkJDlhZTmuY3lm6LmjqjpopPohb/onJXopKrpgIDlkJ7lsa/oh4Dmi5bmiZjohLHpuLXpmYDpqa7pqbzmpK3lpqXmi5PllL7mjJblk4fom5nmtLzlqIPnk6boopzmrarlpJbosYzlvK/mub7njqnpob3kuLjng7flroznopfmjL3mmZrnmpbmg4vlrpvlqYnkuIfohZXmsarnjovkuqHmnonnvZHlvoDml7rmnJvlv5jlpoTlqIFcIl0sXG5bXCJjZTQwXCIsXCLonJnonJvonJ3onJ/onKDonKTonKbonKfonKjonKronKvonKzonK3onK/onLDonLLonLPonLXonLbonLjonLnonLronLzonL3onYBcIiw2LFwi6J2K6J2L6J2N6J2P6J2Q6J2R6J2S6J2U6J2V6J2W6J2Y6J2aXCIsNSxcIuidoeidouidplwiLDcsXCLona/onbHonbLonbPonbVcIl0sXG5bXCJjZTgwXCIsXCLonbfonbjonbnonbronb/onoDonoHonoTonobonofonononoronozono5cIiw0LFwi6J6U6J6V6J6W6J6YXCIsNixcIuieoFwiLDQsXCLlt43lvq7ljbHpn6bov53moYXlm7TllK/mg5/kuLrmvY3nu7Toi4fokI7lp5TkvJ/kvKrlsL7nuqzmnKrolJrlkbPnlY/og4PlloLprY/kvY3muK3osJPlsInmhbDljavnmJ/muKnomormlofpl7vnurnlkLvnqLPntIrpl67ll6Hnv4Hnk67mjJ3onJfmtqHnqp3miJHmlqHljafmj6HmsoPlt6vlkZzpkqjkuYzmsaHor6zlsYvml6DoipzmoqflkL7lkLTmr4vmrabkupTmjYLljYjoiJ7kvI3kvq7lnZ7miIrpm77mmaTnianli7/liqHmgp/or6/mmJTnhpnmnpDopb/noZLnn73mmbDlmLvlkLjplKHnibpcIl0sXG5bXCJjZjQwXCIsXCLonqXonqbonqfonqnonqronq7onrDonrHonrLonrTonrbonrfonrjonrnonrvonrzonr7onr/on4FcIiw0LFwi6J+H6J+I6J+J6J+MXCIsNCxcIuiflFwiLDYsXCLon5zon53on57on5/on6Hon6Lon6Pon6Ton6bon6fon6jon6non6von6zon63on69cIiw5XSxcbltcImNmODBcIixcIuifuuifu+ifvOifveifv+iggOiggeigguighFwiLDUsXCLooItcIiw3LFwi6KCU6KCX6KCY6KCZ6KCa6KCcXCIsNCxcIuigo+eogOaBr+W4jOaCieiGneWkleaDnOeGhOeDr+a6quaxkOeKgOaqhOiireW4reS5oOWqs+WWnOmTo+a0l+ezu+mameaIj+e7hueejuiZvuWMo+mcnui+luaah+WzoeS+oOeLreS4i+WOpuWkj+WQk+aOgOmUqOWFiOS7memynOe6pOWSuOi0pOihlOiIt+mXsua2juW8puWrjOaYvumZqeeOsOeMruWOv+iFuummhee+oeWuqumZt+mZkOe6v+ebuOWOoumVtummmeeuseilhOa5mOS5oee/lOelpeivpuaDs+WTjeS6q+mhueW3t+apoeWDj+WQkeixoeiQp+ehnemchOWJiuWTruWao+mUgOa2iOWutea3huaZk1wiXSxcbltcImQwNDBcIixcIuigpFwiLDEzLFwi6KCzXCIsNSxcIuiguuigu+igveigvuigv+ihgeihguihg+ihhlwiLDUsXCLooY5cIiw1LFwi6KGV6KGW6KGY6KGaXCIsNixcIuihpuihp+ihquihreihr+ihseihs+ihtOihteihtuihuOihueihulwiXSxcbltcImQwODBcIixcIuihu+ihvOiigOiig+iihuiih+iiieiiiuiijOiijuiij+iikOiikeiik+iilOiileiil1wiLDQsXCLoop1cIiw0LFwi6KKj6KKlXCIsNSxcIuWwj+WtneagoeiCluWVuOeskeaViOallOS6m+ath+idjumei+WNj+aMn+aQuumCquaWnOiDgeiwkOWGmeaisOWNuOifueaHiOazhOazu+iwouWxkeiWquiKr+mUjOaso+i+m+aWsOW/u+W/g+S/oeihheaYn+iFpeeMqeaDuuWFtOWIkeWei+W9oumCouihjOmGkuW5uOadj+aAp+Wnk+WFhOWHtuiDuOWMiOaxuembhOeGiuS8keS/rue+nuacveWXhemUiOengOiilue7o+Win+aIjOmcgOiZmuWYmOmhu+W+kOiuuOiThOmFl+WPmeaXreW6j+eVnOaBpOe1ruWpv+e7que7rei9qeWWp+Wuo+aCrOaXi+eOhFwiXSxcbltcImQxNDBcIixcIuiirOiiruiir+iisOiislwiLDQsXCLoorjoornoorroorvoor3oor7oor/oo4Doo4Poo4Too4foo4joo4roo4voo4zoo43oo4/oo5Doo5Hoo5Poo5boo5foo5pcIiw0LFwi6KOg6KOh6KOm6KOn6KOpXCIsNixcIuijsuijteijtuijt+ijuuiju+ijveijv+ikgOikgeikg1wiLDVdLFxuW1wiZDE4MFwiLFwi6KSJ6KSLXCIsNCxcIuikkeiklFwiLDQsXCLopJxcIiw0LFwi6KSi6KSj6KSk6KSm6KSn6KSo6KSp6KSs6KSt6KSu6KSv6KSx6KSy6KSz6KS16KS36YCJ55mj55yp57ua6Z206Jab5a2m56m06Zuq6KGA5YuL54aP5b6q5pes6K+i5a+76amv5beh5q6J5rGb6K6t6K6v6YCK6L+F5Y6L5oq86bim6bit5ZGA5Lir6Iq954mZ6Jqc5bSW6KGZ5rav6ZuF5ZOR5Lqa6K6254SJ5ZK96ZiJ54Of5re555uQ5Lil56CU6JyS5bKp5bu26KiA6aKc6ZiO54KO5rK/5aWE5o6p55y86KGN5ryU6Imz5aCw54eV5Y6M56Ca6ZuB5ZSB5b2m54Sw5a606LCa6aqM5q6D5aSu6biv56en5p2o5oms5L2v55ah576K5rSL6Ziz5rCn5Luw55eS5YW75qC35ry+6YKA6IWw5aaW55G2XCJdLFxuW1wiZDI0MFwiLFwi6KS4XCIsOCxcIuilguilg+ilhVwiLDI0LFwi6KWgXCIsNSxcIuilp1wiLDE5LFwi6KW8XCJdLFxuW1wiZDI4MFwiLFwi6KW96KW+6KaA6KaC6KaE6KaF6KaHXCIsMjYsXCLmkYflsKfpgaXnqpHosKPlp5rlkqzoiIDoja/opoHogIDmpLDlmY7ogLbniLfph47lhrbkuZ/pobXmjpbkuJrlj7bmm7PohYvlpJzmtrLkuIDlo7nljLvmj5bpk7Hkvp3kvIrooaPpopDlpLfpgZfnp7vku6rog7DnlpHmsoLlrpzlp6jlvZ3mpIXomoHlgJrlt7LkuZnnn6Pku6XoibrmipHmmJPpgpHlsbnkur/lvbnoh4bpgLjogoTnlqvkuqboo5TmhI/mr4Xlv4bkuYnnm4rmuqLor6Porq7osIror5HlvILnv7znv4znu47ojLXojavlm6Dmrrfpn7PpmLTlp7vlkJ/pk7bmt6vlr4Xppa7lsLnlvJXpmpBcIl0sXG5bXCJkMzQwXCIsXCLopqJcIiwzMCxcIuing+injeink+inlOinleinl+inmOinmeinm+inneinn+inoOinoeinouinpOinp+inqOinqeinquinrOinreinruinsOinseinsuintFwiLDZdLFxuW1wiZDM4MFwiLFwi6Ke7XCIsNCxcIuiogVwiLDUsXCLoqIhcIiwyMSxcIuWNsOiLseaoseWptOm5sOW6lOe8qOiOueiQpOiQpeiNp+idh+i/jui1ouebiOW9semiluehrOaYoOWTn+aLpeS9o+iHg+eXiOW6uOmbjei4iuibueWSj+azs+a2jOawuOaBv+WLh+eUqOW5veS8mOaCoOW/p+WwpOeUsemCrumTgOeKueayuea4uOmFieacieWPi+WPs+S9kemHieivseWPiOW5vOi/gua3pOS6juebguamhuiZnuaEmuiIhuS9meS/numAvumxvOaEiea4nea4lOmaheS6iOWosembqOS4juWxv+emueWuh+ivree+veeOieWfn+iKi+mDgeWQgemBh+WWu+WzquW+oeaEiOassueLseiCsuiqiVwiXSxcbltcImQ0NDBcIixcIuionlwiLDMxLFwi6Ki/XCIsOCxcIuipiVwiLDIxXSxcbltcImQ0ODBcIixcIuipn1wiLDI1LFwi6Km6XCIsNixcIua1tOWvk+ijlemihOixq+mprem4s+a4iuWGpOWFg+Weo+iigeWOn+aPtOi+leWbreWRmOWchueMv+a6kOe8mOi/nOiLkeaEv+aAqOmZouabsOe6pui2iui3g+mSpeWys+eypOaciOaCpumYheiAmOS6kemDp+WMgOmZqOWFgei/kOiVtOmFneaZlemfteWtleWMneeguOadguagveWTieeBvuWusOi9veWGjeWcqOWSseaUkuaagui1nui1g+iEj+iRrOmBreezn+WHv+iXu+aeo+aXqea+oeiapOi6geWZqumAoOeagueBtueHpei0o+aLqeWImeazvei0vOaAjuWinuaGjuabvui1oOaJjuWWs+a4o+acrei9p1wiXSxcbltcImQ1NDBcIixcIuiqgVwiLDcsXCLoqotcIiw3LFwi6KqUXCIsNDZdLFxuW1wiZDU4MFwiLFwi6KuDXCIsMzIsXCLpk6Hpl7jnnKjmoIXmpqjlkovkuY3ngrjor4jmkZjmlovlroXnqoTlgLrlr6jnnrvmr6Hoqbnnspjmsr7nm4/mlqnovpfltK3lsZXomLjmoIjljaDmiJjnq5nmuZvnu73mqJ/nq6DlvbDmvLPlvKDmjozmtqjmnZbkuIjluJDotKbku5fog4DnmLTpmpzmi5vmmK3mib7msrzotbXnhafnvanlhYbogoflj6zpga7mipjlk7Lom7DovpnogIXplJfolJfov5nmtZnnj43mlp/nnJ/nlITnoKfoh7votJ7pkojkvqbmnpXnlrnor4rpnIfmjK/plYfpmLXokrjmjKPnnYHlvoHni7DkuonmgJTmlbTmi6/mraPmlL9cIl0sXG5bXCJkNjQwXCIsXCLoq6RcIiwzNCxcIuisiFwiLDI3XSxcbltcImQ2ODBcIixcIuispOispeisp1wiLDMwLFwi5bin55eH6YOR6K+B6Iqd5p6d5pSv5ZCx6JyY55+l6IKi6ISC5rGB5LmL57uH6IGM55u05qSN5q6W5omn5YC85L6E5Z2A5oyH5q2i6La+5Y+q5peo57q45b+X5oya5o636Iez6Ie0572u5bic5bOZ5Yi25pm656ep56ia6LSo54KZ55eU5rue5rK756qS5Lit55uF5b+g6ZKf6KG357uI56eN6IK/6YeN5Luy5LyX6Iif5ZGo5bee5rSy6K+M57Kl6L206IKY5bia5ZKS55qx5a6Z5pi86aqk54+g5qCq6Jub5pyx54yq6K+46K+b6YCQ56u554Ob54Wu5ouE556p5Zix5Li76JGX5p+x5Yqp6JuA6LSu6ZO4562RXCJdLFxuW1wiZDc0MFwiLFwi6K2GXCIsMzEsXCLoradcIiw0LFwi6K2tXCIsMjVdLFxuW1wiZDc4MFwiLFwi6K6HXCIsMjQsXCLorqzorrHorrvor4for5Dor6rosInosJ7kvY/ms6jnpZ3pqbvmipPniKrmi73kuJPnoJbovazmkrDotZrnr4bmoanluoToo4Xlpobmkp7lo67nirbmpI7plKXov73otZjlnaDnvIDosIblh4bmjYnmi5nljZPmoYznkKLojIHphYzllYTnnYDngbzmtYrlhbnlkqjotYTlp7/mu4vmt4TlrZzntKvku5Tnsb3mu5PlrZDoh6rmuI3lrZfprIPmo5XouKrlrpfnu7zmgLvnurXpgrnotbDlpY/mj43np5/otrPljZLml4/npZbor4XpmLvnu4TpkrvnuoLlmLTphonmnIDnvarlsIrpgbXmmKjlt6bkvZDmn57lgZrkvZzlnZDluqdcIl0sXG5bXCJkODQwXCIsXCLosLhcIiw4LFwi6LGC6LGD6LGE6LGF6LGI6LGK6LGL6LGNXCIsNyxcIuixluixl+ixmOixmeixm1wiLDUsXCLosaNcIiw2LFwi6LGsXCIsNixcIuixtOixteixtuixt+ixu1wiLDYsXCLosoPosoTosobosodcIl0sXG5bXCJkODgwXCIsXCLosojosovoso1cIiw2LFwi6LKV6LKW6LKX6LKZXCIsMjAsXCLkuo3kuIzlhYDkuJDlu7/ljYXkuJXkupjkuJ7prLLlrazlmankuKjnprrkuL/ljJXkuYflpK3niLvlja7msJDlm5/og6Tpppfmr5Pnnb7pvJfkuLbkup/pvJDkuZzkuankupPoiojlrZvllazlmI/ku4Tljo3ljp3ljqPljqXljq7pnaXotZ3ljJrlj7XljKbljK7ljL7otZzljabljaPliILliIjliI7liK3liLPliL/liYDliYzliZ7liaHliZzokq/lib3lioLlioHlipDlipPlhoLnvZTkurvku4Pku4nku4Lku6jku6Hku6vku57kvJvku7PkvKLkvaTku7XkvKXkvKfkvInkvKvkvZ7kvafmlLjkvZrkvZ1cIl0sXG5bXCJkOTQwXCIsXCLosq5cIiw2Ml0sXG5bXCJkOTgwXCIsXCLos61cIiwzMixcIuS9n+S9l+S8suS8veS9tuS9tOS+keS+ieS+g+S+j+S9vuS9u+S+quS9vOS+rOS+lOS/puS/qOS/quS/heS/muS/o+S/nOS/keS/n+S/uOWAqeWBjOS/s+WArOWAj+WAruWAreS/vuWAnOWAjOWApeWAqOWBvuWBg+WBleWBiOWBjuWBrOWBu+WCpeWCp+WCqeWCuuWDluWEhuWDreWDrOWDpuWDruWEh+WEi+S7neawveS9mOS9peS/jum+oOaxhuextOWFruW3vem7iemmmOWGgeWklOWLueWMjeioh+WMkOWHq+WkmeWFleS6oOWFluS6s+ihruiipOS6teiElOijkuemgOWstOigg+e+uOWGq+WGseWGveWGvFwiXSxcbltcImRhNDBcIixcIui0jlwiLDE0LFwi6LSg6LWR6LWS6LWX6LWf6LWl6LWo6LWp6LWq6LWs6LWu6LWv6LWx6LWy6LW4XCIsOCxcIui2gui2g+i2hui2h+i2iOi2iei2jFwiLDQsXCLotpLotpPotpVcIiw5LFwi6Lag6LahXCJdLFxuW1wiZGE4MFwiLFwi6Lai6LakXCIsMTIsXCLotrLotrbotrfotrnotrvotr3ot4Dot4Hot4Lot4Xot4fot4jot4not4rot43ot5Dot5Lot5Pot5Tlh4flhpblhqLlhqXorqDorqborqforqrorrTorrXorrfor4Lor4Por4vor4/or47or5Lor5Por5Tor5bor5jor5nor5zor5/or6Dor6Tor6jor6nor67or7Dor7Por7bor7nor7zor7/osIDosILosITosIfosIzosI/osJHosJLosJTosJXosJbosJnosJvosJjosJ3osJ/osKDosKHosKXosKfosKrosKvosK7osK/osLLosLPosLXosLbljanljbrpmJ3pmKLpmKHpmLHpmKrpmL3pmLzpmYLpmYnpmZTpmZ/pmafpmazpmbLpmbTpmojpmo3pmpfpmrDpgpfpgpvpgp3pgpnpgqzpgqHpgrTpgrPpgrbpgrpcIl0sXG5bXCJkYjQwXCIsXCLot5Xot5jot5not5zot6Dot6Hot6Lot6Xot6bot6fot6not63ot67ot7Dot7Hot7Lot7Tot7bot7zot75cIiw2LFwi6LiG6LiH6LiI6LiL6LiN6LiO6LiQ6LiR6LiS6LiT6LiVXCIsNyxcIui4oOi4oei4pFwiLDQsXCLouKvouK3ouLDouLLouLPouLTouLbouLfouLjouLvouLzouL5cIl0sXG5bXCJkYjgwXCIsXCLouL/ouYPouYXouYbouYxcIiw0LFwi6LmTXCIsNSxcIui5mlwiLDExLFwi6Lmn6Lmo6Lmq6Lmr6Lmu6Lmx6YK46YKw6YOP6YOF6YK+6YOQ6YOE6YOH6YOT6YOm6YOi6YOc6YOX6YOb6YOr6YOv6YO+6YSE6YSi6YSe6YSj6YSx6YSv6YS56YWD6YWG5YiN5aWC5Yqi5Yqs5Yqt5Yq+5ZO/5YuQ5YuW5Yuw5Y+f54eu55+N5bu05Ye15Ye86ayv5Y625byB55Wa5bev5Z2M5Z6p5Z6h5aG+5aK85aOF5aOR5Zyp5Zys5Zyq5Zyz5Zy55Zyu5Zyv5Z2c5Zy75Z2C5Z2p5Z6F5Z2r5Z6G5Z285Z275Z2o5Z2t5Z225Z2z5Z6t5Z6k5Z6M5Z6y5Z+P5Z6n5Z605Z6T5Z6g5Z+V5Z+Y5Z+a5Z+Z5Z+S5Z645Z+05Z+v5Z+45Z+k5Z+dXCJdLFxuW1wiZGM0MFwiLFwi6Lmz6Lm16Lm3XCIsNCxcIui5vei5vui6gOi6gui6g+i6hOi6hui6iFwiLDYsXCLoupHoupLoupPoupVcIiw2LFwi6Lqd6LqfXCIsMTEsXCLouq3ouq7ourDourHourNcIiw2LFwi6Lq7XCIsN10sXG5bXCJkYzgwXCIsXCLou4NcIiwxMCxcIui7j1wiLDIxLFwi5aCL5aCN5Z+95Z+t5aCA5aCe5aCZ5aGE5aCg5aGl5aGs5aKB5aKJ5aKa5aKA6aao6byZ5oe/6Im56Im96Im/6IqP6IqK6Iqo6IqE6IqO6IqR6IqX6IqZ6Iqr6Iq46Iq+6Iqw6IuI6IuK6Iuj6IqY6Iq36Iqu6IuL6IuM6IuB6Iqp6Iq06Iqh6Iqq6Iqf6IuE6IuO6Iqk6Iuh6IyJ6Iu36Iuk6IyP6IyH6Iuc6Iu06IuS6IuY6IyM6Iu76IuT6IyR6Iya6IyG6IyU6IyV6Iug6IuV6Iyc6I2R6I2b6I2c6IyI6I6S6Iy86Iy06Iyx6I6b6I2e6Iyv6I2P6I2H6I2D6I2f6I2A6IyX6I2g6Iyt6Iy66Iyz6I2m6I2lXCJdLFxuW1wiZGQ0MFwiLFwi6LulXCIsNjJdLFxuW1wiZGQ4MFwiLFwi6LykXCIsMzIsXCLojajojJvojanojazojaroja3oja7ojrDojbjojrPojrTojqDojqrojpPojpzojoXojbzojrbojqnojb3ojrjojbvojpjojp7ojqjojrrojrzoj4HokIHoj6Xoj5jloIfokJjokIvoj53oj73oj5bokJzokLjokJHokIboj5Toj5/okI/okIPoj7joj7noj6roj4Xoj4DokKboj7Doj6HokZzokZHokZrokZnokbPokofokojokbrokonokbjokLzokYbokanokbbokozoko7okLHoka3ok4Hok43ok5Dok6bokr3ok5Pok4rokr/okrrok6DokqHokrnokrTokpfok6Xok6PolIznlI3olLjok7DolLnolJ/olLpcIl0sXG5bXCJkZTQwXCIsXCLovYVcIiwzMixcIui9qui+gOi+jOi+kui+nei+oOi+oei+oui+pOi+pei+pui+p+i+qui+rOi+rei+rui+r+i+sui+s+i+tOi+tei+t+i+uOi+uui+u+i+vOi+v+i/gOi/g+i/hlwiXSxcbltcImRlODBcIixcIui/iVwiLDQsXCLov4/ov5Lov5bov5fov5rov6Dov6Hov6Pov6fov6zov6/ov7Hov7Lov7Tov7Xov7bov7rov7vov7zov77ov7/pgIfpgIjpgIzpgI7pgJPpgJXpgJjolZbolLvok7/ok7zolZnolYjolajolaTolZ7olbrnnqLolYPolbLolbvolqTolqjolofolo/olbnolq7olpzoloXolrnolrfolrDol5Pol4Hol5zol7/omKfomIXomKnomJbomLzlu77lvIjlpLzlpYHogLflpZXlpZrlpZjljI/lsKLlsKXlsKzlsLTmiYzmiarmip/mirvmi4rmi5rmi5fmi67mjKLmi7bmjLnmjYvmjYPmjq3mj7bmjbHmjbrmjo7mjrTmja3mjqzmjormjanmjq7mjrzmj7Lmj7jmj6Dmj7/mj4Tmj57mj47mkZLmj4bmjr7mkYXmkYHmkIvmkJvmkKDmkIzmkKbmkKHmkZ7mkoTmka3mkpZcIl0sXG5bXCJkZjQwXCIsXCLpgJnpgJzpgKPpgKTpgKXpgKdcIiw1LFwi6YCwXCIsNCxcIumAt+mAuemAuumAvemAv+mBgOmBg+mBhemBhumBiFwiLDQsXCLpgY7pgZTpgZXpgZbpgZnpgZrpgZxcIiw1LFwi6YGk6YGm6YGn6YGp6YGq6YGr6YGs6YGvXCIsNCxcIumBtlwiLDYsXCLpgb7pgoFcIl0sXG5bXCJkZjgwXCIsXCLpgoTpgoXpgobpgofpgonpgorpgoxcIiw0LFwi6YKS6YKU6YKW6YKY6YKa6YKc6YKe6YKf6YKg6YKk6YKl6YKn6YKo6YKp6YKr6YKt6YKy6YK36YK86YK96YK/6YOA5pG65pK35pK45pKZ5pK65pOA5pOQ5pOX5pOk5pOi5pSJ5pSl5pSu5byL5b+S55SZ5byR5Y2f5Y+x5Y+95Y+p5Y+o5Y+75ZCS5ZCW5ZCG5ZGL5ZGS5ZGT5ZGU5ZGW5ZGD5ZCh5ZGX5ZGZ5ZCj5ZCy5ZKC5ZKU5ZG35ZGx5ZGk5ZKa5ZKb5ZKE5ZG25ZGm5ZKd5ZOQ5ZKt5ZOC5ZK05ZOS5ZKn5ZKm5ZOT5ZOU5ZGy5ZKj5ZOV5ZK75ZK/5ZOM5ZOZ5ZOa5ZOc5ZKp5ZKq5ZKk5ZOd5ZOP5ZOe5ZSb5ZOn5ZSg5ZO95ZSU5ZOz5ZSi5ZSj5ZSP5ZSR5ZSn5ZSq5ZWn5ZaP5Za15ZWJ5ZWt5ZWB5ZWV5ZS/5ZWQ5ZS8XCJdLFxuW1wiZTA0MFwiLFwi6YOC6YOD6YOG6YOI6YOJ6YOL6YOM6YON6YOS6YOU6YOV6YOW6YOY6YOZ6YOa6YOe6YOf6YOg6YOj6YOk6YOl6YOp6YOq6YOs6YOu6YOw6YOx6YOy6YOz6YO16YO26YO36YO56YO66YO76YO86YO/6YSA6YSB6YSD6YSFXCIsMTksXCLphJrphJvphJxcIl0sXG5bXCJlMDgwXCIsXCLphJ3phJ/phKDphKHphKRcIiwxMCxcIumEsOmEslwiLDYsXCLphLpcIiw4LFwi6YWE5ZS35ZWW5ZW15ZW25ZW35ZSz5ZSw5ZWc5ZaL5ZeS5ZaD5Zax5Za55ZaI5ZaB5Zaf5ZW+5ZeW5ZaR5ZW75Zef5Za95Za+5ZaU5ZaZ5Zeq5Ze35ZeJ5Zif5ZeR5Zer5Zes5ZeU5Zem5Zed5ZeE5Zev5Zel5Zey5Zez5ZeM5ZeN5Zeo5Ze15Zek6L6U5Zie5ZiI5ZiM5ZiB5Zik5Zij5Ze+5ZiA5Zin5Zit5ZmY5Zi55ZmX5Zis5ZmN5Zmi5ZmZ5Zmc5ZmM5ZmU5ZqG5Zmk5Zmx5Zmr5Zm75Zm85ZqF5ZqT5Zqv5ZuU5ZuX5Zud5Zuh5Zu15Zur5Zu55Zu/5ZyE5ZyK5ZyJ5Zyc5biP5biZ5biU5biR5bix5bi75bi8XCJdLFxuW1wiZTE0MFwiLFwi6YWF6YWH6YWI6YWR6YWT6YWU6YWV6YWW6YWY6YWZ6YWb6YWc6YWf6YWg6YWm6YWn6YWo6YWr6YWt6YWz6YW66YW76YW86YaAXCIsNCxcIumGhumGiOmGiumGjumGj+mGk1wiLDYsXCLphpxcIiw1LFwi6YakXCIsNSxcIumGq+mGrOmGsOmGsemGsumGs+mGtumGt+mGuOmGuemGu1wiXSxcbltcImUxODBcIixcIumGvFwiLDEwLFwi6YeI6YeL6YeQ6YeSXCIsOSxcIumHnVwiLDgsXCLluLfluYTluZTluZvluZ7luaHlsozlsbrlso3lspDlspblsojlspjlspnlspHlsprlspzlsrXlsqLlsr3lsqzlsqvlsrHlsqPls4Hlsrfls4Tls5Lls6Tls4vls6XltILltIPltKfltKbltK7ltKTltJ7ltIbltJvltZjltL7ltLTltL3ltazltZvlta/ltZ3ltavltYvltYrltanltbTltoLltpnltp3osbPltrflt4XlvbPlvbflvoLlvoflvonlvozlvpXlvpnlvpzlvqjlvq3lvrXlvrzooaLlvaHniq3nirDnirTnirfnirjni4Pni4Hni47ni43ni5Lni6jni6/ni6nni7Lni7Tni7fnjIHni7PnjIPni7pcIl0sXG5bXCJlMjQwXCIsXCLph6ZcIiw2Ml0sXG5bXCJlMjgwXCIsXCLpiKVcIiwzMixcIueLu+eMl+eMk+eMoeeMiueMnueMneeMleeMoueMueeMpeeMrOeMuOeMseeNkOeNjeeNl+eNoOeNrOeNr+eNvuiIm+Wkpemjp+WkpOWkgumlo+mlp1wiLDUsXCLppbTppbfppb3ppoDppoTppofpporppo3pppDpppHpppPpppTpppXluoDlupHluovlupbluqXluqDlurnlurXlur7lurPotZPlu5Llu5Hlu5vlu6jlu6rohrrlv4Tlv4nlv5blv4/mgIPlv67mgITlv6Hlv6Tlv77mgIXmgIblv6rlv63lv7jmgJnmgLXmgKbmgJvmgI/mgI3mgKnmgKvmgIrmgL/mgKHmgbjmgbnmgbvmgbrmgYJcIl0sXG5bXCJlMzQwXCIsXCLpiYZcIiw0NSxcIumJtVwiLDE2XSxcbltcImUzODBcIixcIumKhlwiLDcsXCLpio9cIiwyNCxcIuaBquaBveaCluaCmuaCreaCneaCg+aCkuaCjOaCm+aDrOaCu+aCseaDneaDmOaDhuaDmuaCtOaEoOaEpuaEleaEo+aDtOaEgOaEjuaEq+aFiuaFteaGrOaGlOaGp+aGt+aHlOaHteW/nemas+mXqemXq+mXsemXs+mXtemXtumXvOmXvumYg+mYhOmYhumYiOmYiumYi+mYjOmYjemYj+mYkumYlemYlumYl+mYmemYmuS4rOeIv+aIleawteaxlOaxnOaxiuayo+ayheaykOaylOayjOaxqOaxqeaxtOaxtuayhuayqeazkOazlOayreazt+azuOazseazl+aysuazoOazluazuuazq+azruayseazk+azr+azvlwiXSxcbltcImU0NDBcIixcIumKqFwiLDUsXCLpiq9cIiwyNCxcIumLiVwiLDMxXSxcbltcImU0ODBcIixcIumLqVwiLDMyLFwi5rS55rSn5rSM5rWD5rWI5rSH5rSE5rSZ5rSO5rSr5rWN5rSu5rS15rSa5rWP5rWS5rWU5rSz5raR5rWv5rae5rag5rWe5raT5raU5rWc5rWg5rW85rWj5ria5reH5reF5ree5riO5ra/5reg5riR5rem5red5reZ5riW5rar5riM5rau5rir5rmu5rmO5rmr5rqy5rmf5rqG5rmT5rmU5riy5ril5rmE5ruf5rqx5rqY5rug5ryt5rui5rql5rqn5rq95rq75rq35ruX5rq05ruP5rqP5ruC5rqf5r2i5r2G5r2H5ryk5ryV5ru55ryv5ry25r2L5r205ryq5ryJ5ryp5r6J5r6N5r6M5r245r2y5r285r265r+RXCJdLFxuW1wiZTU0MFwiLFwi6YyKXCIsNTEsXCLpjL9cIiwxMF0sXG5bXCJlNTgwXCIsXCLpjYpcIiwzMSxcIumNq+a/iea+p+a+uea+tua/gua/oea/rua/nua/oOa/r+eAmueAo+eAm+eAueeAteeBj+eBnuWugOWuhOWuleWuk+WupeWuuOeUr+mqnuaQtOWvpOWvruiksOWvsOi5h+ish+i+tui/k+i/lei/pei/rui/pOi/qei/pui/s+i/qOmAhemAhOmAi+mApumAkemAjemAlumAoemAtemAtumAremAr+mBhOmBkemBkumBkOmBqOmBmOmBoumBm+aauemBtOmBvemCgumCiOmCg+mCi+W9kOW9l+W9luW9mOWwu+WSq+WxkOWxmeWtseWxo+Wxpue+vOW8quW8qeW8reiJtOW8vOmsu+WxruWmgeWmg+WmjeWmqeWmquWmo1wiXSxcbltcImU2NDBcIixcIumNrFwiLDM0LFwi6Y6QXCIsMjddLFxuW1wiZTY4MFwiLFwi6Y6sXCIsMjksXCLpj4vpj4zpj43lppflp4rlpqvlpp7lpqTlp5LlprLlpq/lp5flpr7lqIXlqIblp53lqIjlp6Plp5jlp7nlqIzlqInlqLLlqLTlqJHlqKPlqJPlqYDlqaflqYrlqZXlqLzlqaLlqbXog6zlqqrlqpvlqbflqbrlqr7lq6vlqrLlq5Llq5Tlqrjlq6Dlq6Plq7Hlq5blq6blq5jlq5zlrInlrJflrJblrLLlrLflrYDlsJXlsJzlrZrlraXlrbPlrZHlrZPlraLpqbXpqbfpqbjpqbrpqb/pqb3pqoDpqoHpqoXpqojpqorpqpDpqpLpqpPpqpbpqpjpqpvpqpzpqp3pqp/pqqDpqqLpqqPpqqXpqqfnup/nuqHnuqPnuqXnuqjnuqlcIl0sXG5bXCJlNzQwXCIsXCLpj45cIiw3LFwi6Y+XXCIsNTRdLFxuW1wiZTc4MFwiLFwi6ZCOXCIsMzIsXCLnuq3nurDnur7nu4Dnu4Hnu4Lnu4nnu4vnu4znu5Dnu5Tnu5fnu5vnu6Dnu6Hnu6jnu6vnu67nu6/nu7Hnu7LnvI3nu7bnu7rnu7vnu77nvIHnvILnvIPnvIfnvIjnvIvnvIznvI/nvJHnvJLnvJfnvJnnvJznvJvnvJ/nvKFcIiw2LFwi57yq57yr57ys57yt57yvXCIsNCxcIue8teW5uueVv+W3m+eUvumCleeOjueOkeeOrueOoueOn+ePj+ePguePkeeOt+eOs+ePgOePieePiOePpeePmemhvOeQiuePqeePp+ePnueOuuePsueQj+eQqueRm+eQpueQpeeQqOeQsOeQrueQrFwiXSxcbltcImU4NDBcIixcIumQr1wiLDE0LFwi6ZC/XCIsNDMsXCLpkazpka3pka7pka9cIl0sXG5bXCJlODgwXCIsXCLpkbBcIiwyMCxcIumSkemSlumSmOmTh+mTj+mTk+mTlOmTmumTpumTu+mUnOmUoOeQm+eQmueRgeeRnOeRl+eRleeRmeeRt+eRreeRvueSnOeSjueSgOeSgeeSh+eSi+eSnueSqOeSqeeSkOeSp+eTkueSuumfqumfq+mfrOadjOadk+adnuadiOadqeaepeaeh+adquads+aemOaep+adteaeqOaenuaereaei+adt+advOafsOagieafmOagiuafqeaesOagjOafmeaeteafmuaes+afneaggOafg+aeuOafouagjuafgeafveagsuags+ahoOahoeahjuahouahhOahpOaig+agneahleahpuahgeahp+ahgOagvuahiuahieagqeaiteaij+ahtOaht+aik+ahq+ajgualruajvOakn+akoOajuVwiXSxcbltcImU5NDBcIixcIumUp+mUs+mUvemVg+mViOmVi+mVlemVmumVoOmVrumVtOmVtemVt1wiLDcsXCLploBcIiw0Ml0sXG5bXCJlOTgwXCIsXCLplqtcIiwzMixcIuakpOajsOaki+akgeall+ajo+akkOalseakuealoOalgualneamhOalq+amgOammOaluOaktOanjOamh+amiOanjuamiealpualo+alueamm+amp+amu+amq+amreanlOamseangeaniuann+amleanoOamjeanv+aor+anreaol+aomOappeansuaphOaovuaqoOapkOapm+aoteaqjuapueaoveaoqOapmOapvOaqkeaqkOaqqeaql+aqq+eMt+eNkuaugeauguauh+auhOaukuauk+aujeaumuaum+auoeauqui9q+i9rei9sei9sui9s+i9tei9tui9uOi9t+i9uei9uui9vOi9vui+gei+gui+hOi+h+i+i1wiXSxcbltcImVhNDBcIixcIumXjFwiLDI3LFwi6Zes6Ze/6ZiH6ZiT6ZiY6Zib6Zie6Zig6ZijXCIsNixcIumYq+mYrOmYremYr+mYsOmYt+mYuOmYuemYuumYvumZgemZg+mZiumZjumZj+mZkemZkumZk+mZlumZl1wiXSxcbltcImVhODBcIixcIumZmOmZmemZmumZnOmZnemZnumZoOmZo+mZpemZpumZq+mZrVwiLDQsXCLpmbPpmbhcIiwxMixcIumah+maiemaiui+jei+jui+j+i+mOi+mui7juaIi+aIl+aIm+aIn+aIouaIoeaIpeaIpOaIrOiHp+eTr+eTtOeTv+eUj+eUkeeUk+aUtOaXruaXr+aXsOaYiuaYmeadsuaYg+aYleaYgOeCheabt+aYneaYtOaYseaYtuaYteiAhuaZn+aZlOaZgeaZj+aZluaZoeaZl+aZt+aahOaajOaap+aaneaavuabm+abnOabpuabqei0sui0s+i0tui0u+i0vei1gOi1hei1hui1iOi1iei1h+i1jei1lei1meinh+iniuini+injOinjuinj+inkOinkeeJrueKn+eJneeJpueJr+eJvueJv+eKhOeKi+eKjeeKj+eKkuaMiOaMsuaOsFwiXSxcbltcImViNDBcIixcIumajOmajumakemakumak+malemalumamumam+manVwiLDksXCLpmqhcIiw3LFwi6Zqx6Zqy6Zq06Zq16Zq36Zq46Zq66Zq76Zq/6ZuC6ZuD6ZuI6ZuK6ZuL6ZuQ6ZuR6ZuT6ZuU6ZuWXCIsOSxcIumboVwiLDYsXCLpm6tcIl0sXG5bXCJlYjgwXCIsXCLpm6zpm63pm67pm7Dpm7Hpm7Lpm7Tpm7Xpm7jpm7rpm7vpm7zpm73pm7/pnILpnIPpnIXpnIrpnIvpnIzpnJDpnJHpnJLpnJTpnJXpnJdcIiw0LFwi6Zyd6Zyf6Zyg5pC/5pOY6ICE5q+q5q+z5q+95q+15q+55rCF5rCH5rCG5rCN5rCV5rCY5rCZ5rCa5rCh5rCp5rCk5rCq5rCy5pS15pWV5pWr54mN54mS54mW54iw6Jmi5YiW6IKf6IKc6IKT6IK85pyK6IK96IKx6IKr6IKt6IK06IK36IOn6IOo6IOp6IOq6IOb6IOC6IOE6IOZ6ION6IOX5pyQ6IOd6IOr6IOx6IO06IOt6ISN6ISO6IOy6IO85pyV6ISS6LGa6IS26ISe6ISs6ISY6ISy6IWI6IWM6IWT6IW06IWZ6IWa6IWx6IWg6IWp6IW86IW96IWt6IWn5aGN5aq16IaI6IaC6IaR5ruV6Iaj6Iaq6IeM5pym6IeK6Ia7XCJdLFxuW1wiZWM0MFwiLFwi6ZyhXCIsOCxcIumcq+mcrOmcrumcr+mcsemcs1wiLDQsXCLpnLrpnLvpnLzpnL3pnL9cIiwxOCxcIumdlOmdlemdl+mdmOmdmumdnOmdnemdn+mdo+mdpOmdpumdp+mdqOmdqlwiLDddLFxuW1wiZWM4MFwiLFwi6Z2y6Z216Z23XCIsNCxcIumdvVwiLDcsXCLpnoZcIiw0LFwi6Z6M6Z6O6Z6P6Z6Q6Z6T6Z6V6Z6W6Z6X6Z6ZXCIsNCxcIuiHgeiGpuaspOast+asueatg+athuatmemjkemjkumjk+mjlemjmemjmuaus+W9gOavguins+aWkOm9keaWk+aWvOaXhuaXhOaXg+aXjOaXjuaXkuaXlueCgOeCnOeClueCneeCu+eDgOeCt+eCq+eCseeDqOeDiueEkOeEk+eElueEr+eEseeFs+eFnOeFqOeFheeFsueFiueFuOeFuueGmOeGs+eGteeGqOeGoOeHoOeHlOeHp+eHueeIneeIqOeBrOeEmOeFpueGueaIvuaIveaJg+aJiOaJieeku+elgOelhuelieelm+elnOelk+elmuelouell+eloOelr+elp+eluuemheemiuemmuemp+ems+W/keW/kFwiXSxcbltcImVkNDBcIixcIumenumen+meoemeoumepFwiLDYsXCLpnqzpnq7pnrDpnrHpnrPpnrVcIiw0Nl0sXG5bXCJlZDgwXCIsXCLpn6Tpn6Xpn6jpn65cIiw0LFwi6Z+06Z+3XCIsMjMsXCLmgLzmgZ3mgZrmgafmgYHmgZnmgaPmgqvmhIbmhI3mhZ3mhqnmhp3mh4vmh5HmiIbogoDogb/mspPms7bmt7znn7bnn7jnoIDnoInnoJfnoJjnoJHmlqvnoK3noJznoJ3noLnnoLrnoLvnoJ/noLznoKXnoKznoKPnoKnnoY7noa3noZbnoZfnoKbnoZDnoYfnoYznoarnopvnopPnoprnoofnopznoqHnoqPnorLnornnoqXno5Tno5nno4nno6zno7LnpIXno7TnpJPnpKTnpJ7npLTpvpvpu7npu7vpu7znm7HnnITnnI3nm7nnnIfnnIjnnJrnnKLnnJnnnK3nnKbnnLXnnLjnnZDnnZHnnYfnnYPnnZrnnahcIl0sXG5bXCJlZTQwXCIsXCLpoI9cIiw2Ml0sXG5bXCJlZTgwXCIsXCLpoY5cIiwzMixcIuedouedpeedv+eejeedveeegOeejOeekeeen+eeoOeesOeeteeeveeUuueVgOeVjueVi+eViOeVm+eVsueVueeWg+e9mOe9oee9n+ipiOe9qOe9tOe9see9uee+gee9vuebjeebpeigsumShemShumSh+mSi+mSiumSjOmSjemSj+mSkOmSlOmSl+mSlemSmumSm+mSnOmSo+mSpOmSq+mSqumSremSrOmSr+mSsOmSsumStOmStlwiLDQsXCLpkrzpkr3pkr/pk4Tpk4hcIiw2LFwi6ZOQ6ZOR6ZOS6ZOV6ZOW6ZOX6ZOZ6ZOY6ZOb6ZOe6ZOf6ZOg6ZOi6ZOk6ZOl6ZOn6ZOo6ZOqXCJdLFxuW1wiZWY0MFwiLFwi6aGvXCIsNSxcIumii+mijumikumilemimemio+miqFwiLDM3LFwi6aOP6aOQ6aOU6aOW6aOX6aOb6aOc6aOd6aOgXCIsNF0sXG5bXCJlZjgwXCIsXCLpo6Xpo6bpo6lcIiwzMCxcIumTqemTq+mTrumTr+mTs+mTtOmTtemTt+mTuemTvOmTvemTv+mUg+mUgumUhumUh+mUiemUiumUjemUjumUj+mUklwiLDQsXCLplJjplJvplJ3plJ7plJ/plKLplKrplKvplKnplKzplLHplLLplLTplLbplLfplLjplLzplL7plL/plYLplLXplYTplYXplYbplYnplYzplY7plY/plZLplZPplZTplZbplZfplZjplZnplZvplZ7plZ/plZ3plaHplaLplaRcIiw4LFwi6ZWv6ZWx6ZWy6ZWz6ZS655+n55+s6ZuJ56eV56et56ej56er56iG5bWH56iD56iC56ie56iUXCJdLFxuW1wiZjA0MFwiLFwi6aSIXCIsNCxcIumkjumkj+mkkVwiLDI4LFwi6aSvXCIsMjZdLFxuW1wiZjA4MFwiLFwi6aWKXCIsOSxcIumlllwiLDEyLFwi6aWk6aWm6aWz6aW46aW56aW76aW+6aaC6aaD6aaJ56i556i356mR6buP6aal56mw55qI55qO55qT55qZ55qk55Oe55Og55Ss6big6bii6bioXCIsNCxcIum4sum4sem4tum4uOm4t+m4uem4uum4vum5gem5gum5hOm5hum5h+m5iOm5iem5i+m5jOm5jum5kem5lem5l+m5mum5m+m5nOm5num5o+m5plwiLDYsXCLpubHpua3pubPnlpLnlpTnlpbnlqDnlp3nlqznlqPnlrPnlrTnlrjnl4TnlrHnlrDnl4Pnl4Lnl5bnl43nl6Pnl6jnl6bnl6Tnl6vnl6fnmIPnl7Hnl7znl7/nmJDnmIDnmIXnmIznmJfnmIrnmKXnmJjnmJXnmJlcIl0sXG5bXCJmMTQwXCIsXCLppozppo7ppppcIiwxMCxcIummpummp+mmqVwiLDQ3XSxcbltcImYxODBcIixcIumnmVwiLDMyLFwi55ib55i855ii55ig55mA55it55iw55i/55i155mD55i+55iz55mN55me55mU55mc55mW55mr55mv57+K56um56m456m556qA56qG56qI56qV56qm56qg56qs56qo56qt56qz6KGk6KGp6KGy6KG96KG/6KKC6KKi6KOG6KK36KK86KOJ6KOi6KOO6KOj6KOl6KOx6KSa6KO86KOo6KO+6KOw6KSh6KSZ6KST6KSb6KSK6KS06KSr6KS26KWB6KWm6KW755aL6IOl55qy55q055+c6ICS6ICU6ICW6ICc6ICg6ICi6ICl6ICm6ICn6ICp6ICo6ICx6ICL6IC16IGD6IGG6IGN6IGS6IGp6IGx6KaD6aG46aKA6aKDXCJdLFxuW1wiZjI0MFwiLFwi6ae6XCIsNjJdLFxuW1wiZjI4MFwiLFwi6ai5XCIsMzIsXCLpoonpoozpoo3poo/popTpoprpopvpop7pop/poqHpoqLpoqXpoqbomY3omZTomazoma7omb/ombrombzombvomqjomo3omovomqzomp3omqfomqPomqrompPomqnomrbom4TomrXom47omrDomrromrHomq/om4nom4/omrTom6nom7Hom7Lom63om7Pom5DonJPom57om7Tom5/om5jom5HonIPonIfom7jonIjonIronI3onInonKPonLvonJ7onKXonK7onJronL7onYjonLTonLHonKnonLfonL/onoLonKLonb3onb7onbvonaDonbDonYzona7onovonZPonaPonbzonaTonZnonaXonpPonq/onqjon5JcIl0sXG5bXCJmMzQwXCIsXCLpqZpcIiwxNyxcIumpsumqg+mqiemqjemqjumqlOmqlemqmemqpumqqVwiLDYsXCLpqrLpqrPpqrTpqrXpqrnpqrvpqr3pqr7pqr/pq4Ppq4Tpq4ZcIiw0LFwi6auN6auO6auP6auQ6auS6auU6auV6auW6auX6auZ6aua6aub6aucXCJdLFxuW1wiZjM4MFwiLFwi6aud6aue6aug6aui6auj6auk6aul6aun6auo6aup6auq6aus6auu6auwXCIsOCxcIumruumrvFwiLDYsXCLprITprIXprIbon4bonojonoXonq3onpfonoPonqvon6XonqzonrXonrPon4von5Ponr3on5Hon4Don4ron5von6ron6Don67ooJbooJPon77ooIrooJvooKHooLnooLznvLbnvYLnvYTnvYXoiJDnq7rnq73nrIjnrIPnrITnrJXnrIrnrKvnrI/nrYfnrLjnrKrnrJnnrK7nrLHnrKDnrKXnrKTnrLPnrL7nrJ7nrZjnrZrnrYXnrbXnrYznrZ3nraDnra7nrbvnraLnrbLnrbHnrpDnrqbnrqfnrrjnrqznrp3nrqjnroXnrqrnrpznrqLnrqvnrrTnr5Hnr4Hnr4znr53nr5rnr6Xnr6bnr6rnsIznr77nr7znsI/nsJbnsItcIl0sXG5bXCJmNDQwXCIsXCLprIfprIlcIiw1LFwi6ayQ6ayR6ayS6ayUXCIsMTAsXCLprKDprKHprKLprKRcIiwxMCxcIumssOmssemss1wiLDcsXCLprL3prL7prL/prYDprYbprYrprYvprYzprY7prZDprZLprZPprZVcIiw1XSxcbltcImY0ODBcIixcIumtm1wiLDMyLFwi57Cf57Cq57Cm57C457GB57GA6Ie+6IiB6IiC6IiE6Ies6KGE6Iih6Iii6Iij6Iit6Iiv6Iio6Iir6Ii46Ii76Iiz6Ii06Ii+6ImE6ImJ6ImL6ImP6Ima6Imf6Imo6KG+6KKF6KKI6KOY6KOf6KWe576d576f576n576v576w576y57G85pWJ57KR57Kd57Kc57Ke57Ki57Ky57K857K957OB57OH57OM57ON57OI57OF57OX57Oo6Imu5pqo576/57+O57+V57+l57+h57+m57+p57+u57+z57O457W357am57au57mH57qb6bq46bq06LWz6LaE6LaU6LaR6Lax6LWn6LWt6LGH6LGJ6YWK6YWQ6YWO6YWP6YWkXCJdLFxuW1wiZjU0MFwiLFwi6a28XCIsNjJdLFxuW1wiZjU4MFwiLFwi6a67XCIsMzIsXCLphaLphaHphbDphanpha/phb3phb7phbLphbTphbnphozphoXphpDpho3phpHphqLphqPphqrphq3phq7phq/phrXphrTphrrosZXpub7otrjot6vouIXouZnouanotrXotr/otrzotrrot4Tot5bot5fot5rot57ot47ot4/ot5vot4bot6zot7fot7jot6Pot7not7vot6TouInot73ouJTouJ3ouJ/ouKzouK7ouKPouK/ouLrouYDouLnouLXouL3ouLHouYnouYHouYLouZHouZLouYroubDoubboubzoua/oubTouoXouo/oupToupDoupzoup7osbjosoLosorosoXospjospTmlpvop5bop57op5rop5xcIl0sXG5bXCJmNjQwXCIsXCLpr5xcIiw2Ml0sXG5bXCJmNjgwXCIsXCLpsJtcIiwzMixcIuinpeinq+inr+iovuispumdk+mbqembs+mbr+mchumcgemciOmcj+mcjumcqumcremcsOmcvum+gOm+g+m+hVwiLDUsXCLpvozpu77pvIvpvI3pmrnpmrzpmr3pm47pm5Lnnr/pm6Dpio7piq7pi4jpjL7pjarpj4rpjo/pkL7pkavpsb/psoLpsoXpsobpsofpsojnqKPpsovpso7pspDpspHpspLpspTpspXpsprpspvpsp5cIiw1LFwi6bKlXCIsNCxcIumyq+myremyrumysFwiLDcsXCLpsrrpsrvpsrzpsr3ps4Tps4Xps4bps4fps4rps4tcIl0sXG5bXCJmNzQwXCIsXCLpsLxcIiw2Ml0sXG5bXCJmNzgwXCIsXCLpsbvpsb3psb7psoDpsoPpsoTpsonpsorpsozpso/pspPpspbpspfpspjpspnpsp3psqrpsqzpsq/psrnpsr5cIiw0LFwi6bOI6bOJ6bOR6bOS6bOa6bOb6bOg6bOh6bOMXCIsNCxcIumzk+mzlOmzlemzl+mzmOmzmemznOmznemzn+mzoumdvOmehemekemekumelOmer+meq+meo+mesumetOmqsemqsOmqt+m5mOmqtumquumqvOmrgemrgOmrhemrgumri+mrjOmrkemthemtg+mth+mtiemtiOmtjemtkemjqOmkjemkrumllemllOmrn+mroemrpumrr+mrq+mru+mrremruemsiOmsj+msk+msn+mso+m6vem6vue4u+m6gum6h+m6iOm6i+m6kumPlum6nem6n+m7m+m7nOm7nem7oOm7n+m7oum7qem7p+m7pem7qum7r+m8oum8rOm8r+m8uem8t+m8vem8vum9hFwiXSxcbltcImY4NDBcIixcIumzo1wiLDYyXSxcbltcImY4ODBcIixcIum0olwiLDMyXSxcbltcImY5NDBcIixcIum1g1wiLDYyXSxcbltcImY5ODBcIixcIum2glwiLDMyXSxcbltcImZhNDBcIixcIum2o1wiLDYyXSxcbltcImZhODBcIixcIum3olwiLDMyXSxcbltcImZiNDBcIixcIum4g1wiLDI3LFwi6bik6bin6biu6biw6bi06bi76bi86bmA6bmN6bmQ6bmS6bmT6bmU6bmW6bmZ6bmd6bmf6bmg6bmh6bmi6bml6bmu6bmv6bmy6bm0XCIsOSxcIum6gFwiXSxcbltcImZiODBcIixcIum6gem6g+m6hOm6hem6hum6iem6ium6jFwiLDUsXCLpupRcIiw4LFwi6bqe6bqgXCIsNSxcIum6p+m6qOm6qem6qlwiXSxcbltcImZjNDBcIixcIum6q1wiLDgsXCLpurXpurbpurfpurnpurrpurzpur9cIiw0LFwi6buF6buG6buH6buI6buK6buL6buM6buQ6buS6buT6buV6buW6buX6buZ6bua6bue6buh6buj6buk6bum6buo6bur6bus6but6buu6buwXCIsOCxcIum7uum7vem7v1wiLDZdLFxuW1wiZmM4MFwiLFwi6byGXCIsNCxcIum8jOm8j+m8kem8kum8lOm8lem8lum8mOm8mlwiLDUsXCLpvKHpvKNcIiw4LFwi6byt6byu6byw6byxXCJdLFxuW1wiZmQ0MFwiLFwi6byyXCIsNCxcIum8uOm8uum8vOm8v1wiLDQsXCLpvYVcIiwxMCxcIum9klwiLDM4XSxcbltcImZkODBcIixcIum9uVwiLDUsXCLpvoHpvoLpvo1cIiwxMSxcIum+nOm+nem+num+oVwiLDQsXCLvpKzvpbnvppXvp6fvp7FcIl0sXG5bXCJmZTQwXCIsXCLvqIzvqI3vqI7vqI/vqJHvqJPvqJTvqJjvqJ/vqKDvqKHvqKPvqKTvqKfvqKjvqKlcIl1cbl1cbiIsIm1vZHVsZS5leHBvcnRzPVtcbltcIjBcIixcIlxcdTAwMDBcIiwxMjddLFxuW1wiODE0MVwiLFwi6rCC6rCD6rCF6rCG6rCLXCIsNCxcIuqwmOqwnuqwn+qwoeqwouqwo+qwpVwiLDYsXCLqsK7qsLLqsLPqsLRcIl0sXG5bXCI4MTYxXCIsXCLqsLXqsLbqsLfqsLrqsLvqsL3qsL7qsL/qsYFcIiw5LFwi6rGM6rGOXCIsNSxcIuqxlVwiXSxcbltcIjgxODFcIixcIuqxluqxl+qxmeqxmuqxm+qxnVwiLDE4LFwi6rGy6rGz6rG16rG26rG56rG7XCIsNCxcIuqyguqyh+qyiOqyjeqyjuqyj+qykeqykuqyk+qylVwiLDYsXCLqsp7qsqJcIiw1LFwi6rKr6rKt6rKu6rKxXCIsNixcIuqyuuqyvuqyv+qzgOqzguqzg+qzheqzhuqzh+qzieqziuqzi+qzjVwiLDcsXCLqs5bqs5hcIiw3LFwi6rOi6rOj6rOl6rOm6rOp6rOr6rOt6rOu6rOy6rO06rO3XCIsNCxcIuqzvuqzv+q0geq0guq0g+q0heq0h1wiLDQsXCLqtI7qtJDqtJLqtJNcIl0sXG5bXCI4MjQxXCIsXCLqtJTqtJXqtJbqtJfqtJnqtJrqtJvqtJ3qtJ7qtJ/qtKFcIiw3LFwi6rSq6rSr6rSuXCIsNV0sXG5bXCI4MjYxXCIsXCLqtLbqtLfqtLnqtLrqtLvqtL1cIiw2LFwi6rWG6rWI6rWKXCIsNSxcIuq1keq1kuq1k+q1leq1luq1l1wiXSxcbltcIjgyODFcIixcIuq1mVwiLDcsXCLqtaLqtaRcIiw3LFwi6rWu6rWv6rWx6rWy6rW36rW46rW56rW66rW+6raA6raDXCIsNCxcIuq2iuq2i+q2jeq2juq2j+q2kVwiLDEwLFwi6raeXCIsNSxcIuq2pVwiLDE3LFwi6ra4XCIsNyxcIuq3guq3g+q3heq3huq3h+q3iVwiLDYsXCLqt5Lqt5RcIiw3LFwi6red6ree6ref6reh6rei6rej6relXCIsMThdLFxuW1wiODM0MVwiLFwi6re66re76re96re+6riCXCIsNSxcIuq4iuq4jOq4jlwiLDUsXCLquJVcIiw3XSxcbltcIjgzNjFcIixcIuq4nVwiLDE4LFwi6riy6riz6ri16ri26ri56ri76ri8XCJdLFxuW1wiODM4MVwiLFwi6ri96ri+6ri/6rmC6rmE6rmH6rmI6rmJ6rmL6rmP6rmR6rmS6rmT6rmV6rmXXCIsNCxcIuq5nuq5ouq5o+q5pOq5puq5p+q5quq5q+q5req5ruq5r+q5sVwiLDYsXCLqubrqub5cIiw1LFwi6rqGXCIsNSxcIuq6jVwiLDQ2LFwi6rq/6ruB6ruC6ruD6ruFXCIsNixcIuq7juq7klwiLDUsXCLqu5rqu5vqu51cIiw4XSxcbltcIjg0NDFcIixcIuq7puq7p+q7qeq7quq7rOq7rlwiLDUsXCLqu7Xqu7bqu7fqu7nqu7rqu7vqu71cIiw4XSxcbltcIjg0NjFcIixcIuq8huq8ieq8iuq8i+q8jOq8juq8j+q8kVwiLDE4XSxcbltcIjg0ODFcIixcIuq8pFwiLDcsXCLqvK7qvK/qvLHqvLPqvLVcIiw2LFwi6ry+6r2A6r2E6r2F6r2G6r2H6r2KXCIsNSxcIuq9kVwiLDEwLFwi6r2eXCIsNSxcIuq9plwiLDE4LFwi6r26XCIsNSxcIuq+geq+guq+g+q+heq+huq+h+q+iVwiLDYsXCLqvpLqvpPqvpTqvpZcIiw1LFwi6r6dXCIsMjYsXCLqvrrqvrvqvr3qvr5cIl0sXG5bXCI4NTQxXCIsXCLqvr/qv4FcIiw1LFwi6r+K6r+M6r+PXCIsNCxcIuq/lVwiLDYsXCLqv51cIiw0XSxcbltcIjg1NjFcIixcIuq/olwiLDUsXCLqv6pcIiw1LFwi6r+y6r+z6r+16r+26r+36r+5XCIsNixcIuuAguuAg1wiXSxcbltcIjg1ODFcIixcIuuAhVwiLDYsXCLrgI3rgI7rgI/rgJHrgJLrgJPrgJVcIiw2LFwi64CeXCIsOSxcIuuAqVwiLDI2LFwi64GG64GH64GJ64GL64GN64GP64GQ64GR64GS64GW64GY64Ga64Gb64Gc64GeXCIsMjksXCLrgb7rgb/rgoHrgoLrgoPrgoVcIiw2LFwi64KO64KQ64KSXCIsNSxcIuuCm+uCneuCnuuCo+uCpFwiXSxcbltcIjg2NDFcIixcIuuCpeuCpuuCp+uCquuCsOuCsuuCtuuCt+uCueuCuuuCu+uCvVwiLDYsXCLrg4brg4pcIiw1LFwi64OSXCJdLFxuW1wiODY2MVwiLFwi64OT64OV64OW64OX64OZXCIsNixcIuuDoeuDouuDo+uDpOuDplwiLDEwXSxcbltcIjg2ODFcIixcIuuDsVwiLDIyLFwi64SK64SN64SO64SP64SR64SU64SV64SW64SX64Sa64SeXCIsNCxcIuuEpuuEp+uEqeuEquuEq+uErVwiLDYsXCLrhLbrhLpcIiw1LFwi64WC64WD64WF64WG64WH64WJXCIsNixcIuuFkuuFk+uFluuFl+uFmeuFmuuFm+uFneuFnuuFn+uFoVwiLDIyLFwi64W664W764W964W+64W/64aB64aDXCIsNCxcIuuGiuuGjOuGjuuGj+uGkOuGkeuGleuGluuGl+uGmeuGmuuGm+uGnVwiXSxcbltcIjg3NDFcIixcIuuGnlwiLDksXCLrhqlcIiwxNV0sXG5bXCI4NzYxXCIsXCLrhrlcIiwxOCxcIuuHjeuHjuuHj+uHkeuHkuuHk+uHlVwiXSxcbltcIjg3ODFcIixcIuuHllwiLDUsXCLrh57rh6BcIiw3LFwi64eq64er64et64eu64ev64exXCIsNyxcIuuHuuuHvOuHvlwiLDUsXCLriIbriIfriInriIrriI1cIiw2LFwi64iW64iY64iaXCIsNSxcIuuIoVwiLDE4LFwi64i1XCIsNixcIuuIvVwiLDI2LFwi64mZ64ma64mb64md64me64mf64mhXCIsNixcIuuJqlwiLDRdLFxuW1wiODg0MVwiLFwi64mvXCIsNCxcIuuJtlwiLDUsXCLrib1cIiw2LFwi64qG64qH64qI64qKXCIsNF0sXG5bXCI4ODYxXCIsXCLrio/ripLripPripXripbripfriptcIiw0LFwi64qi64qk64qn64qo64qp64qr64qt64qu64qv64qx64qy64qz64q164q264q3XCJdLFxuW1wiODg4MVwiLFwi64q4XCIsMTUsXCLri4rri4vri43ri47ri4/ri5Hri5NcIiw0LFwi64ua64uc64ue64uf64ug64uh64uj64un64up64uq64uw64ux64uy64u264u864u964u+64yC64yD64yF64yG64yH64yJXCIsNixcIuuMkuuMllwiLDUsXCLrjJ1cIiw1NCxcIuuNl+uNmeuNmuuNneuNoOuNoeuNouuNo1wiXSxcbltcIjg5NDFcIixcIuuNpuuNqOuNquuNrOuNreuNr+uNsuuNs+uNteuNtuuNt+uNuVwiLDYsXCLrjoLrjoZcIiw1LFwi646NXCJdLFxuW1wiODk2MVwiLFwi646O646P646R646S646T646VXCIsMTAsXCLrjqJcIiw1LFwi646p646q646r646tXCJdLFxuW1wiODk4MVwiLFwi646uXCIsMjEsXCLrj4brj4frj4nrj4rrj43rj4/rj5Hrj5Lrj5Prj5brj5jrj5rrj5zrj57rj5/rj6Hrj6Lrj6Prj6Xrj6brj6frj6lcIiwxOCxcIuuPvVwiLDE4LFwi65CRXCIsNixcIuuQmeuQmuuQm+uQneuQnuuQn+uQoVwiLDYsXCLrkKrrkKxcIiw3LFwi65C1XCIsMTVdLFxuW1wiOGE0MVwiLFwi65GFXCIsMTAsXCLrkZLrkZPrkZXrkZbrkZfrkZlcIiw2LFwi65Gi65Gk65GmXCJdLFxuW1wiOGE2MVwiLFwi65GnXCIsNCxcIuuRrVwiLDE4LFwi65KB65KCXCJdLFxuW1wiOGE4MVwiLFwi65KDXCIsNCxcIuuSiVwiLDE5LFwi65KeXCIsNSxcIuuSpeuSpuuSp+uSqeuSquuSq+uSrVwiLDcsXCLrkrbrkrjrkrpcIiw1LFwi65OB65OC65OD65OF65OG65OH65OJXCIsNixcIuuTkeuTkuuTk+uTlOuTllwiLDUsXCLrk57rk5/rk6Hrk6Lrk6Xrk6dcIiw0LFwi65Ou65Ow65OyXCIsNSxcIuuTuVwiLDI2LFwi65SW65SX65SZ65Sa65SdXCJdLFxuW1wiOGI0MVwiLFwi65SeXCIsNSxcIuuUpuuUq1wiLDQsXCLrlLLrlLPrlLXrlLbrlLfrlLlcIiw2LFwi65WC65WGXCJdLFxuW1wiOGI2MVwiLFwi65WH65WI65WJ65WK65WO65WP65WR65WS65WT65WVXCIsNixcIuuVnuuVolwiLDhdLFxuW1wiOGI4MVwiLFwi65WrXCIsNTIsXCLrlqLrlqPrlqXrlqbrlqfrlqnrlqzrlq3rlq7rlq/rlrLrlrZcIiw0LFwi65a+65a/65eB65eC65eD65eFXCIsNixcIuuXjuuXklwiLDUsXCLrl5lcIiwxOCxcIuuXrVwiLDE4XSxcbltcIjhjNDFcIixcIuuYgFwiLDE1LFwi65iS65iT65iV65iW65iX65iZXCIsNF0sXG5bXCI4YzYxXCIsXCLrmJ5cIiw2LFwi65imXCIsNSxcIuuYrVwiLDYsXCLrmLVcIiw1XSxcbltcIjhjODFcIixcIuuYu1wiLDEyLFwi65mJXCIsMjYsXCLrmaXrmabrmafrmalcIiw1MCxcIuuanuuan+uaoeuaouuao+uapVwiLDUsXCLrmq3rmq7rmq/rmrDrmrJcIiwxNl0sXG5bXCI4ZDQxXCIsXCLrm4NcIiwxNixcIuublVwiLDhdLFxuW1wiOGQ2MVwiLFwi65ueXCIsMTcsXCLrm7Hrm7Lrm7Prm7Xrm7brm7frm7nrm7pcIl0sXG5bXCI4ZDgxXCIsXCLrm7tcIiw0LFwi65yC65yD65yE65yGXCIsMzMsXCLrnKrrnKvrnK3rnK7rnLFcIiw2LFwi65y665y8XCIsNyxcIuudheudhuudh+udieudiuudi+udjVwiLDYsXCLrnZZcIiw5LFwi652h652i652j652l652m652n652pXCIsNixcIuudsuudtOudtlwiLDUsXCLrnb7rnb/rnoHrnoLrnoPrnoVcIiw2LFwi656O656T656U656V656a656b656d656eXCJdLFxuW1wiOGU0MVwiLFwi656f656hXCIsNixcIuuequuerlwiLDUsXCLrnrbrnrfrnrlcIiw4XSxcbltcIjhlNjFcIixcIuufglwiLDQsXCLrn4jrn4pcIiwxOV0sXG5bXCI4ZTgxXCIsXCLrn55cIiwxMyxcIuufruufr+ufseufsuufs+uftVwiLDYsXCLrn77roIJcIiw0LFwi66CK66CL66CN66CO66CP66CRXCIsNixcIuugmuugnOugnlwiLDUsXCLroKbroKfroKnroKrroKvroK1cIiw2LFwi66C266C6XCIsNSxcIuuhgeuhguuhg+uhhVwiLDExLFwi66GS66GUXCIsNyxcIuuhnuuhn+uhoeuhouuho+uhpVwiLDYsXCLroa7robDrobJcIiw1LFwi66G566G666G766G9XCIsN10sXG5bXCI4ZjQxXCIsXCLrooVcIiw3LFwi66KOXCIsMTddLFxuW1wiOGY2MVwiLFwi66KgXCIsNyxcIuuiqVwiLDYsXCLrorHrorLrorProrXrorbrorfrorlcIiw0XSxcbltcIjhmODFcIixcIuuivuuiv+ujguujhOujhlwiLDUsXCLro43ro47ro4/ro5Hro5Lro5Pro5VcIiw3LFwi66Oe66Og66OiXCIsNSxcIuujquujq+ujreujruujr+ujsVwiLDYsXCLro7rro7zro75cIiw1LFwi66SFXCIsMTgsXCLrpJlcIiw2LFwi66ShXCIsMjYsXCLrpL7rpL/rpYHrpYLrpYPrpYVcIiw2LFwi66WN66WO66WQ66WSXCIsNV0sXG5bXCI5MDQxXCIsXCLrpZrrpZvrpZ3rpZ7rpZ/rpaFcIiw2LFwi66Wq66Ws66WuXCIsNSxcIuultuult+ulueuluuulu+ulvVwiXSxcbltcIjkwNjFcIixcIuulvlwiLDUsXCLrpobrpojrpovrpozrpo9cIiwxNV0sXG5bXCI5MDgxXCIsXCLrpp9cIiwxMixcIuumruumr+umseumsuums+umtVwiLDYsXCLrpr7rp4Drp4JcIiw1LFwi66eK66eL66eN66eTXCIsNCxcIuunmuunnOunn+unoOunouunpuunp+unqeunquunq+unrVwiLDYsXCLrp7brp7tcIiw0LFwi66iCXCIsNSxcIuuoiVwiLDExLFwi66iWXCIsMzMsXCLrqLrrqLvrqL3rqL7rqL/rqYHrqYPrqYTrqYXrqYZcIl0sXG5bXCI5MTQxXCIsXCLrqYfrqYrrqYzrqY/rqZDrqZHrqZLrqZbrqZfrqZnrqZrrqZvrqZ1cIiw2LFwi66mm66mqXCIsNV0sXG5bXCI5MTYxXCIsXCLrqbLrqbPrqbXrqbbrqbfrqblcIiw5LFwi66qG66qI66qJ66qK66qL66qNXCIsNV0sXG5bXCI5MTgxXCIsXCLrqpNcIiwyMCxcIuuqquuqreuqruuqr+uqseuqs1wiLDQsXCLrqrrrqrzrqr5cIiw1LFwi66uF66uG66uH66uJXCIsMTQsXCLrq5pcIiwzMyxcIuurveurvuurv+usgeusguusg+ushVwiLDcsXCLrrI7rrJDrrJJcIiw1LFwi66yZ66ya66yb66yd66ye66yf66yhXCIsNl0sXG5bXCI5MjQxXCIsXCLrrKjrrKrrrKxcIiw3LFwi66y366y566y666y/XCIsNCxcIuuthuutiOutiuuti+utjOutjuutkeutklwiXSxcbltcIjkyNjFcIixcIuutk+utleutluutl+utmVwiLDcsXCLrraLrraRcIiw3LFwi662tXCIsNF0sXG5bXCI5MjgxXCIsXCLrrbJcIiwyMSxcIuuuieuuiuuui+uujeuujuuuj+uukVwiLDE4LFwi666l666m666n666p666q666r666tXCIsNixcIuuuteuutuuuuFwiLDcsXCLrr4Hrr4Lrr4Prr4Xrr4brr4frr4lcIiw2LFwi66+R66+S66+UXCIsMzUsXCLrr7rrr7vrr73rr77rsIFcIl0sXG5bXCI5MzQxXCIsXCLrsINcIiw0LFwi67CK67CO67CQ67CS67CT67CZ67Ca67Cg67Ch67Ci67Cj67Cm67Co67Cq67Cr67Cs67Cu67Cv67Cy67Cz67C1XCJdLFxuW1wiOTM2MVwiLFwi67C267C367C5XCIsNixcIuuxguuxhuuxh+uxiOuxiuuxi+uxjuuxj+uxkVwiLDhdLFxuW1wiOTM4MVwiLFwi67Ga67Gb67Gc67GeXCIsMzcsXCLrsobrsofrsonrsorrso3rso9cIiw0LFwi67KW67KY67KbXCIsNCxcIuuyouuyo+uypeuypuuyqVwiLDYsXCLrsrLrsrZcIiw1LFwi67K+67K/67OB67OC67OD67OFXCIsNyxcIuuzjuuzkuuzk+uzlOuzluuzl+uzmeuzmuuzm+uznVwiLDIyLFwi67O367O567O667O767O9XCJdLFxuW1wiOTQ0MVwiLFwi67O+XCIsNSxcIuu0huu0iOu0ilwiLDUsXCLrtJHrtJLrtJPrtJVcIiw4XSxcbltcIjk0NjFcIixcIuu0nlwiLDUsXCLrtKVcIiw2LFwi67StXCIsMTJdLFxuW1wiOTQ4MVwiLFwi67S6XCIsNSxcIuu1gVwiLDYsXCLrtYrrtYvrtY3rtY7rtY/rtZFcIiw2LFwi67WaXCIsOSxcIuu1peu1puu1p+u1qVwiLDIyLFwi67aC67aD67aF67aG67aLXCIsNCxcIuu2kuu2lOu2luu2l+u2mOu2m+u2nVwiLDYsXCLrtqVcIiwxMCxcIuu2sVwiLDYsXCLrtrlcIiwyNF0sXG5bXCI5NTQxXCIsXCLrt5Lrt5Prt5brt5frt5nrt5rrt5vrt51cIiwxMSxcIuu3qlwiLDUsXCLrt7FcIl0sXG5bXCI5NTYxXCIsXCLrt7Lrt7Prt7Xrt7brt7frt7lcIiw2LFwi67iB67iC67iE67iGXCIsNSxcIuu4juu4j+u4keu4kuu4k1wiXSxcbltcIjk1ODFcIixcIuu4lVwiLDYsXCLruJ7ruKBcIiwzNSxcIuu5huu5h+u5ieu5iuu5i+u5jeu5j1wiLDQsXCLruZbruZjruZzruZ3ruZ7ruZ/ruaLruaPruaXruabruafruanruatcIiw0LFwi67my67m2XCIsNCxcIuu5vuu5v+u6geu6guu6g+u6hVwiLDYsXCLruo7rupJcIiw1LFwi67qaXCIsMTMsXCLruqlcIiwxNF0sXG5bXCI5NjQxXCIsXCLrurhcIiwyMyxcIuu7kuu7k1wiXSxcbltcIjk2NjFcIixcIuu7leu7luu7mVwiLDYsXCLru6Hru6Lru6ZcIiw1LFwi67utXCIsOF0sXG5bXCI5NjgxXCIsXCLru7ZcIiwxMCxcIuu8glwiLDUsXCLrvIpcIiwxMyxcIuu8muu8nlwiLDMzLFwi672C672D672F672G672H672JXCIsNixcIuu9kuu9k+u9lOu9llwiLDQ0XSxcbltcIjk3NDFcIixcIuu+g1wiLDE2LFwi676VXCIsOF0sXG5bXCI5NzYxXCIsXCLrvp5cIiwxNyxcIuu+sVwiLDddLFxuW1wiOTc4MVwiLFwi6765XCIsMTEsXCLrv4ZcIiw1LFwi67+O67+P67+R67+S67+T67+VXCIsNixcIuu/neu/nuu/oOu/olwiLDg5LFwi7IC97IC+7IC/XCJdLFxuW1wiOTg0MVwiLFwi7IGAXCIsMTYsXCLsgZJcIiw1LFwi7IGZ7IGa7IGbXCJdLFxuW1wiOTg2MVwiLFwi7IGd7IGe7IGf7IGhXCIsNixcIuyBqlwiLDE1XSxcbltcIjk4ODFcIixcIuyBulwiLDIxLFwi7IKS7IKT7IKV7IKW7IKX7IKZXCIsNixcIuyCouyCpOyCplwiLDUsXCLsgq7sgrHsgrLsgrdcIiw0LFwi7IK+7IOC7IOD7IOE7IOG7IOH7IOK7IOL7ION7IOO7IOP7IORXCIsNixcIuyDmuyDnlwiLDUsXCLsg6bsg6fsg6nsg6rsg6vsg61cIiw2LFwi7IO27IO47IO6XCIsNSxcIuyEgeyEguyEg+yEheyEhuyEh+yEiVwiLDYsXCLshJHshJLshJPshJTshJZcIiw1LFwi7ISh7ISi7ISl7ISo7ISp7ISq7ISr7ISuXCJdLFxuW1wiOTk0MVwiLFwi7ISy7ISz7IS07IS17IS37IS67IS77IS97IS+7IS/7IWBXCIsNixcIuyFiuyFjlwiLDUsXCLshZbshZdcIl0sXG5bXCI5OTYxXCIsXCLshZnshZrshZvshZ1cIiw2LFwi7IWm7IWqXCIsNSxcIuyFseyFsuyFs+yFteyFtuyFt+yFueyFuuyFu1wiXSxcbltcIjk5ODFcIixcIuyFvFwiLDgsXCLshoZcIiw1LFwi7IaP7IaR7IaS7IaT7IaV7IaXXCIsNCxcIuyGnuyGoOyGouyGo+yGpOyGpuyGp+yGquyGq+yGreyGruyGr+yGsVwiLDExLFwi7Ia+XCIsNSxcIuyHheyHhuyHh+yHieyHiuyHi+yHjVwiLDYsXCLsh5Xsh5bsh5lcIiw2LFwi7Ieh7Iei7Iej7Iel7Iem7Ien7IepXCIsNixcIuyHsuyHtFwiLDcsXCLsh77sh7/siIHsiILsiIPsiIVcIiw2LFwi7IiO7IiQ7IiSXCIsNSxcIuyImuyIm+yIneyInuyIoeyIouyIo1wiXSxcbltcIjlhNDFcIixcIuyIpOyIpeyIpuyIp+yIquyIrOyIruyIsOyIs+yItVwiLDE2XSxcbltcIjlhNjFcIixcIuyJhuyJh+yJiVwiLDYsXCLsiZLsiZPsiZXsiZbsiZfsiZlcIiw2LFwi7Imh7Imi7Imj7Imk7ImmXCJdLFxuW1wiOWE4MVwiLFwi7ImnXCIsNCxcIuyJruyJr+yJseyJsuyJs+yJtVwiLDYsXCLsib7sioDsioJcIiw1LFwi7IqKXCIsNSxcIuyKkVwiLDYsXCLsipnsiprsipzsip5cIiw1LFwi7Iqm7Iqn7Iqp7Iqq7Iqr7IquXCIsNSxcIuyKtuyKuOyKulwiLDMzLFwi7Iue7Iuf7Iuh7Iui7IulXCIsNSxcIuyLruyLsOyLsuyLs+yLtOyLteyLt+yLuuyLveyLvuyLv+yMgVwiLDYsXCLsjIrsjIvsjI7sjI9cIl0sXG5bXCI5YjQxXCIsXCLsjJDsjJHsjJLsjJbsjJfsjJnsjJrsjJvsjJ1cIiw2LFwi7Iym7Iyn7IyqXCIsOF0sXG5bXCI5YjYxXCIsXCLsjLNcIiwxNyxcIuyNhlwiLDddLFxuW1wiOWI4MVwiLFwi7I2OXCIsMjUsXCLsjarsjavsja3sja7sja/sjbHsjbNcIiw0LFwi7I267I277I2+XCIsNSxcIuyOheyOhuyOh+yOieyOiuyOi+yOjVwiLDUwLFwi7I+BXCIsMjIsXCLsj5pcIl0sXG5bXCI5YzQxXCIsXCLsj5vsj53sj57sj6Hsj6NcIiw0LFwi7I+q7I+r7I+s7I+uXCIsNSxcIuyPtuyPt+yPuVwiLDVdLFxuW1wiOWM2MVwiLFwi7I+/XCIsOCxcIuyQiVwiLDYsXCLskJFcIiw5XSxcbltcIjljODFcIixcIuyQm1wiLDgsXCLskKVcIiw2LFwi7JCt7JCu7JCv7JCx7JCy7JCz7JC1XCIsNixcIuyQvlwiLDksXCLskYlcIiwyNixcIuyRpuyRp+yRqeyRquyRq+yRrVwiLDYsXCLskbbskbfskbjskbpcIiw1LFwi7JKBXCIsMTgsXCLskpVcIiw2LFwi7JKdXCIsMTJdLFxuW1wiOWQ0MVwiLFwi7JKqXCIsMTMsXCLskrnskrrskrvskr1cIiw4XSxcbltcIjlkNjFcIixcIuyThlwiLDI1XSxcbltcIjlkODFcIixcIuyToFwiLDgsXCLsk6pcIiw1LFwi7JOy7JOz7JO17JO27JO37JO57JO77JO87JO97JO+7JSCXCIsOSxcIuyUjeyUjuyUj+yUkeyUkuyUk+yUlVwiLDYsXCLslJ1cIiwxMCxcIuyUquyUq+yUreyUruyUr+yUsVwiLDYsXCLslLrslLzslL5cIiw1LFwi7JWG7JWH7JWL7JWP7JWQ7JWR7JWS7JWW7JWa7JWb7JWc7JWf7JWi7JWj7JWl7JWm7JWn7JWpXCIsNixcIuyVsuyVtlwiLDUsXCLslb7slb/sloHsloLsloPsloXslobslojslonslorslovslo7slpDslpLslpPslpRcIl0sXG5bXCI5ZTQxXCIsXCLslpbslpnslprslpvslp3slp7slp/slqFcIiw3LFwi7JaqXCIsOSxcIuyWtlwiXSxcbltcIjllNjFcIixcIuyWt+yWuuyWv1wiLDQsXCLsl4vsl43sl4/sl5Lsl5Psl5Xsl5bsl5fsl5lcIiw2LFwi7Jei7Jek7Jem7JenXCJdLFxuW1wiOWU4MVwiLFwi7Jeo7Jep7Jeq7Jer7Jev7Jex7Jey7Jez7Je17Je47Je57Je67Je77JiC7JiD7JiE7JiJ7JiK7JiL7JiN7JiO7JiP7JiRXCIsNixcIuyYmuyYnVwiLDYsXCLsmKbsmKfsmKnsmKrsmKvsmK/smLHsmLLsmLbsmLjsmLrsmLzsmL3smL7smL/smYLsmYPsmYXsmYbsmYfsmYlcIiw2LFwi7JmS7JmWXCIsNSxcIuyZnuyZn+yZoVwiLDEwLFwi7Jmt7Jmu7Jmw7JmyXCIsNSxcIuyZuuyZu+yZveyZvuyZv+yagVwiLDYsXCLsmorsmozsmo5cIiw1LFwi7JqW7JqX7JqZ7Jqa7Jqb7JqdXCIsNixcIuyaplwiXSxcbltcIjlmNDFcIixcIuyaqOyaqlwiLDUsXCLsmrLsmrPsmrXsmrbsmrfsmrtcIiw0LFwi7JuC7JuE7JuGXCIsNSxcIuybjlwiXSxcbltcIjlmNjFcIixcIuybj+ybkeybkuybk+yblVwiLDYsXCLsm57sm5/sm6JcIiw1LFwi7Juq7Jur7Jut7Juu7Juv7Jux7JuyXCJdLFxuW1wiOWY4MVwiLFwi7JuzXCIsNCxcIuybuuybu+ybvOybvlwiLDUsXCLsnIbsnIfsnInsnIrsnIvsnI1cIiw2LFwi7JyW7JyY7JyaXCIsNSxcIuycouyco+ycpeycpuycp+ycqVwiLDYsXCLsnLLsnLTsnLbsnLjsnLnsnLrsnLvsnL7snL/snYHsnYLsnYPsnYVcIiw0LFwi7J2L7J2O7J2Q7J2Z7J2a7J2b7J2d7J2e7J2f7J2hXCIsNixcIuydqeydquydrFwiLDcsXCLsnbbsnbfsnbnsnbrsnbvsnb/snoDsnoHsnoLsnobsnovsnozsno3sno/snpLsnpPsnpXsnpnsnptcIiw0LFwi7J6i7J6nXCIsNCxcIuyeruyer+yeseyesuyes+yeteyetuyet1wiXSxcbltcImEwNDFcIixcIuyeuOyeueyeuuyeu+yevuyfglwiLDUsXCLsn4rsn4vsn43sn4/sn5FcIiw2LFwi7J+Z7J+a7J+b7J+cXCJdLFxuW1wiYTA2MVwiLFwi7J+eXCIsNSxcIuyfpeyfpuyfp+yfqeyfquyfq+yfrVwiLDEzXSxcbltcImEwODFcIixcIuyfu1wiLDQsXCLsoILsoIPsoIXsoIbsoIfsoInsoItcIiw0LFwi7KCS7KCU7KCXXCIsNCxcIuygnuygn+ygoeygouygo+ygpVwiLDYsXCLsoK7soLDsoLJcIiw1LFwi7KC57KC67KC77KC97KC+7KC/7KGBXCIsNixcIuyhiuyhi+yhjlwiLDUsXCLsoZVcIiwyNixcIuyhsuyhs+yhteyhtuyht+yhueyhu1wiLDQsXCLsooLsooTsoojsoonsoorsoo5cIiw1LFwi7KKVXCIsNyxcIuyinuyioOyiouyio+yipFwiXSxcbltcImExNDFcIixcIuyipeyipuyip+yiqVwiLDE4LFwi7KK+7KK/7KOA7KOBXCJdLFxuW1wiYTE2MVwiLFwi7KOC7KOD7KOF7KOG7KOH7KOJ7KOK7KOL7KONXCIsNixcIuyjluyjmOyjmlwiLDUsXCLso6Lso6Pso6VcIl0sXG5bXCJhMTgxXCIsXCLso6ZcIiwxNCxcIuyjtlwiLDUsXCLso77so7/spIHspILspIPspIdcIiw0LFwi7KSO44CA44CB44CCwrfigKXigKbCqOOAg8Kt4oCV4oil77y84oi84oCY4oCZ4oCc4oCd44CU44CV44CIXCIsOSxcIsKxw5fDt+KJoOKJpOKJpeKInuKItMKw4oCy4oCz4oSD4oSr77+g77+h77+l4pmC4pmA4oig4oql4oyS4oiC4oiH4omh4omSwqfigLvimIbimIXil4vil4/il47il4fil4bilqHilqDilrPilrLilr3ilrzihpLihpDihpHihpPihpTjgJPiiariiaviiJriiL3iiJ3iiLXiiKviiKziiIjiiIviiobiiofiioLiioPiiKriiKniiKfiiKjvv6JcIl0sXG5bXCJhMjQxXCIsXCLspJDspJJcIiw1LFwi7KSZXCIsMThdLFxuW1wiYTI2MVwiLFwi7KStXCIsNixcIuyktVwiLDE4XSxcbltcImEyODFcIixcIuyliFwiLDcsXCLspZLspZPspZXspZbspZfspZlcIiw2LFwi7KWi7KWkXCIsNyxcIuylreylruylr+KHkuKHlOKIgOKIg8K0772ey4fLmMudy5rLmcK4y5vCocK/y5DiiK7iiJHiiI/CpOKEieKAsOKXgeKXgOKWt+KWtuKZpOKZoOKZoeKZpeKZp+KZo+KKmeKXiOKWo+KXkOKXkeKWkuKWpOKWpeKWqOKWp+KWpuKWqeKZqOKYj+KYjuKYnOKYnsK24oCg4oCh4oaV4oaX4oaZ4oaW4oaY4pmt4pmp4pmq4pms44m/44ic4oSW44+H4oSi44+C44+Y4oSh4oKswq5cIl0sXG5bXCJhMzQxXCIsXCLspbHspbLspbPspbVcIiw2LFwi7KW9XCIsMTAsXCLsporspovspo3spo7spo9cIl0sXG5bXCJhMzYxXCIsXCLsppFcIiw2LFwi7Kaa7Kac7KaeXCIsMTZdLFxuW1wiYTM4MVwiLFwi7KavXCIsMTYsXCLsp4Lsp4Psp4Xsp4bsp4nsp4tcIiw0LFwi7KeS7KeU7KeX7KeY7Keb77yBXCIsNTgsXCLvv6bvvL1cIiwzMixcIu+/o1wiXSxcbltcImE0NDFcIixcIuynnuynn+ynoeyno+ynpeynpuynqOynqeynquynq+ynruynslwiLDUsXCLsp7rsp7vsp73sp77sp7/sqIHsqILsqIPsqIRcIl0sXG5bXCJhNDYxXCIsXCLsqIXsqIbsqIfsqIrsqI5cIiw1LFwi7KiV7KiW7KiX7KiZXCIsMTJdLFxuW1wiYTQ4MVwiLFwi7Kim7Kin7Kio7KiqXCIsMjgsXCLjhLFcIiw5M10sXG5bXCJhNTQxXCIsXCLsqYdcIiw0LFwi7KmO7KmP7KmR7KmS7KmT7KmVXCIsNixcIuypnuypolwiLDUsXCLsqansqapcIl0sXG5bXCJhNTYxXCIsXCLsqatcIiwxNyxcIuypvlwiLDUsXCLsqoXsqoZcIl0sXG5bXCJhNTgxXCIsXCLsqodcIiwxNixcIuyqmVwiLDE0LFwi4oWwXCIsOV0sXG5bXCJhNWIwXCIsXCLihaBcIiw5XSxcbltcImE1YzFcIixcIs6RXCIsMTYsXCLOo1wiLDZdLFxuW1wiYTVlMVwiLFwizrFcIiwxNixcIs+DXCIsNl0sXG5bXCJhNjQxXCIsXCLsqqhcIiwxOSxcIuyqvuyqv+yrgeyrguyrg+yrhVwiXSxcbltcImE2NjFcIixcIuyrhlwiLDUsXCLsq47sq5Dsq5Lsq5Tsq5Xsq5bsq5fsq5pcIiw1LFwi7KuhXCIsNl0sXG5bXCJhNjgxXCIsXCLsq6jsq6nsq6rsq6vsq61cIiw2LFwi7Ku1XCIsMTgsXCLsrInsrIrilIDilILilIzilJDilJjilJTilJzilKzilKTilLTilLzilIHilIPilI/ilJPilJvilJfilKPilLPilKvilLvilYvilKDilK/ilKjilLfilL/ilJ3ilLDilKXilLjilYLilJLilJHilJrilJnilJbilJXilI7ilI3ilJ7ilJ/ilKHilKLilKbilKfilKnilKrilK3ilK7ilLHilLLilLXilLbilLnilLrilL3ilL7ilYDilYHilYNcIiw3XSxcbltcImE3NDFcIixcIuysi1wiLDQsXCLsrJHsrJLsrJPsrJXsrJbsrJfsrJlcIiw2LFwi7KyiXCIsN10sXG5bXCJhNzYxXCIsXCLsrKpcIiwyMixcIuytguytg+ythFwiXSxcbltcImE3ODFcIixcIuytheythuyth+ytiuyti+ytjeytjuytj+ytkVwiLDYsXCLsrZrsrZvsrZzsrZ5cIiw1LFwi7K2lXCIsNyxcIuOOleOOluOOl+KEk+OOmOOPhOOOo+OOpOOOpeOOpuOOmVwiLDksXCLjj4rjjo3jjo7jjo/jj4/jjojjjonjj4jjjqfjjqjjjrBcIiw5LFwi446AXCIsNCxcIuOOulwiLDUsXCLjjpBcIiw0LFwi4oSm44+A44+B446K446L446M44+W44+F446t446u446v44+b446p446q446r446s44+d44+Q44+T44+D44+J44+c44+GXCJdLFxuW1wiYTg0MVwiLFwi7K2tXCIsMTAsXCLsrbpcIiwxNF0sXG5bXCJhODYxXCIsXCLsrolcIiwxOCxcIuyunVwiLDZdLFxuW1wiYTg4MVwiLFwi7K6kXCIsMTksXCLsrrlcIiwxMSxcIsOGw5DCqsSmXCJdLFxuW1wiYThhNlwiLFwixLJcIl0sXG5bXCJhOGE4XCIsXCLEv8WBw5jFksK6w57FpsWKXCJdLFxuW1wiYThiMVwiLFwi44mgXCIsMjcsXCLik5BcIiwyNSxcIuKRoFwiLDE0LFwiwr3ihZPihZTCvMK+4oWb4oWc4oWd4oWeXCJdLFxuW1wiYTk0MVwiLFwi7K+FXCIsMTQsXCLsr5VcIiwxMF0sXG5bXCJhOTYxXCIsXCLsr6Dsr6Hsr6Lsr6Psr6Xsr6bsr6jsr6pcIiwxOF0sXG5bXCJhOTgxXCIsXCLsr71cIiwxNCxcIuywjuywj+ywkeywkuywk+ywlVwiLDYsXCLssJ7ssJ/ssKDssKPssKTDpsSRw7DEp8SxxLPEuMWAxYLDuMWTw5/DvsWnxYvFieOIgFwiLDI3LFwi4pKcXCIsMjUsXCLikbRcIiwxNCxcIsK5wrLCs+KBtOKBv+KCgeKCguKCg+KChFwiXSxcbltcImFhNDFcIixcIuywpeywpuywquywq+ywreywr+ywsVwiLDYsXCLssLrssL9cIiw0LFwi7LGG7LGH7LGJ7LGK7LGL7LGN7LGOXCJdLFxuW1wiYWE2MVwiLFwi7LGPXCIsNCxcIuyxluyxmlwiLDUsXCLssaHssaLssaPssaXssafssalcIiw2LFwi7LGx7LGyXCJdLFxuW1wiYWE4MVwiLFwi7LGz7LG07LG2XCIsMjksXCLjgYFcIiw4Ml0sXG5bXCJhYjQxXCIsXCLsspTsspXsspbsspfssprsspvssp3ssp7ssp/ssqFcIiw2LFwi7LKq7LKuXCIsNSxcIuyytuyyt+yyuVwiXSxcbltcImFiNjFcIixcIuyyuuyyu+yyvVwiLDYsXCLss4bss4jss4pcIiw1LFwi7LOR7LOS7LOT7LOVXCIsNV0sXG5bXCJhYjgxXCIsXCLss5tcIiw4LFwi7LOlXCIsNixcIuyzreyzruyzr+yzsVwiLDEyLFwi44KhXCIsODVdLFxuW1wiYWM0MVwiLFwi7LO+7LO/7LSA7LSCXCIsNSxcIuy0iuy0i+y0jey0juy0j+y0kVwiLDYsXCLstJrstJzstJ7stJ/stKBcIl0sXG5bXCJhYzYxXCIsXCLstKHstKLstKPstKXstKbstKfstKnstKrstKvstK1cIiwxMSxcIuy0ulwiLDRdLFxuW1wiYWM4MVwiLFwi7LS/XCIsMjgsXCLstZ3stZ7stZ/QkFwiLDUsXCLQgdCWXCIsMjVdLFxuW1wiYWNkMVwiLFwi0LBcIiw1LFwi0ZHQtlwiLDI1XSxcbltcImFkNDFcIixcIuy1oey1ouy1o+y1pVwiLDYsXCLsta7stbDstbJcIiw1LFwi7LW5XCIsN10sXG5bXCJhZDYxXCIsXCLstoFcIiw2LFwi7LaJXCIsMTAsXCLstpbstpfstpnstprstpvstp3stp7stp9cIl0sXG5bXCJhZDgxXCIsXCLstqDstqHstqLstqPstqbstqjstqpcIiw1LFwi7LaxXCIsMTgsXCLst4VcIl0sXG5bXCJhZTQxXCIsXCLst4ZcIiw1LFwi7LeN7LeO7LeP7LeRXCIsMTZdLFxuW1wiYWU2MVwiLFwi7LeiXCIsNSxcIuy3qey3quy3q+y3rey3ruy3r+y3sVwiLDYsXCLst7rst7zst75cIiw0XSxcbltcImFlODFcIixcIuy4g+y4hey4huy4h+y4iey4iuy4i+y4jVwiLDYsXCLsuJXsuJbsuJfsuJjsuJpcIiw1LFwi7Lii7Lij7Lil7Lim7Lin7Lip7Liq7LirXCJdLFxuW1wiYWY0MVwiLFwi7Lis7Lit7Liu7Liv7Liy7Li07Li2XCIsMTldLFxuW1wiYWY2MVwiLFwi7LmKXCIsMTMsXCLsuZrsuZvsuZ3suZ7suaJcIiw1LFwi7Lmq7LmsXCJdLFxuW1wiYWY4MVwiLFwi7LmuXCIsNSxcIuy5tuy5t+y5uey5uuy5u+y5vVwiLDYsXCLsuobsuojsuopcIiw1LFwi7LqS7LqT7LqV7LqW7LqX7LqZXCJdLFxuW1wiYjA0MVwiLFwi7LqaXCIsNSxcIuy6ouy6plwiLDUsXCLsuq5cIiwxMl0sXG5bXCJiMDYxXCIsXCLsurtcIiw1LFwi7LuCXCIsMTldLFxuW1wiYjA4MVwiLFwi7LuWXCIsMTMsXCLsu6bsu6fsu6nsu6rsu61cIiw2LFwi7Lu27Lu6XCIsNSxcIuqwgOqwgeqwhOqwh+qwiOqwieqwiuqwkFwiLDcsXCLqsJlcIiw0LFwi6rCg6rCk6rCs6rCt6rCv6rCw6rCx6rC46rC56rC86rGA6rGL6rGN6rGU6rGY6rGc6rGw6rGx6rG06rG36rG46rG66rKA6rKB6rKD6rKE6rKF6rKG6rKJ6rKK6rKL6rKM6rKQ6rKU6rKc6rKd6rKf6rKg6rKh6rKo6rKp6rKq6rKs6rKv6rKw6rK46rK56rK76rK86rK96rOB6rOE6rOI6rOM6rOV6rOX6rOg6rOh6rOk6rOn6rOo6rOq6rOs6rOv6rOw6rOx6rOz6rO16rO26rO86rO96rSA6rSE6rSGXCJdLFxuW1wiYjE0MVwiLFwi7LyC7LyD7LyF7LyG7LyH7LyJXCIsNixcIuy8kuy8lOy8llwiLDUsXCLsvJ3svJ7svJ/svKHsvKLsvKNcIl0sXG5bXCJiMTYxXCIsXCLsvKVcIiw2LFwi7Lyu7LyyXCIsNSxcIuy8uVwiLDExXSxcbltcImIxODFcIixcIuy9hVwiLDE0LFwi7L2W7L2X7L2Z7L2a7L2b7L2dXCIsNixcIuy9puy9qOy9quy9q+y9rOq0jOq0jeq0j+q0keq0mOq0nOq0oOq0qeq0rOq0req0tOq0teq0uOq0vOq1hOq1heq1h+q1ieq1kOq1lOq1mOq1oeq1o+q1rOq1req1sOq1s+q1tOq1teq1tuq1u+q1vOq1veq1v+q2geq2guq2iOq2ieq2jOq2kOq2nOq2neq2pOq2t+q3gOq3geq3hOq3iOq3kOq3keq3k+q3nOq3oOq3pOq3uOq3ueq3vOq3v+q4gOq4geq4iOq4ieq4i+q4jeq4lOq4sOq4seq4tOq4t+q4uOq4uuq5gOq5geq5g+q5heq5huq5iuq5jOq5jeq5juq5kOq5lOq5luq5nOq5neq5n+q5oOq5oeq5peq5qOq5qeq5rOq5sOq5uFwiXSxcbltcImIyNDFcIixcIuy9rey9ruy9r+y9suy9s+y9tey9tuy9t+y9uVwiLDYsXCLsvoHsvoLsvoPsvoTsvoZcIiw1LFwi7L6NXCJdLFxuW1wiYjI2MVwiLFwi7L6OXCIsMTgsXCLsvqJcIiw1LFwi7L6pXCJdLFxuW1wiYjI4MVwiLFwi7L6qXCIsNSxcIuy+sVwiLDE4LFwi7L+FXCIsNixcIuq5ueq5u+q5vOq5veq6hOq6heq6jOq6vOq6veq6vuq7gOq7hOq7jOq7jeq7j+q7kOq7keq7mOq7meq7nOq7qOq7q+q7req7tOq7uOq7vOq8h+q8iOq8jeq8kOq8rOq8req8sOq8suq8tOq8vOq8veq8v+q9geq9guq9g+q9iOq9ieq9kOq9nOq9neq9pOq9peq9ueq+gOq+hOq+iOq+kOq+keq+leq+nOq+uOq+ueq+vOq/gOq/h+q/iOq/ieq/i+q/jeq/juq/lOq/nOq/qOq/qeq/sOq/seq/tOq/uOuAgOuAgeuAhOuAjOuAkOuAlOuAnOuAneuAqOuBhOuBheuBiOuBiuuBjOuBjuuBk+uBlOuBleuBl+uBmVwiXSxcbltcImIzNDFcIixcIuy/jFwiLDE5LFwi7L+i7L+j7L+l7L+m7L+n7L+pXCJdLFxuW1wiYjM2MVwiLFwi7L+qXCIsNSxcIuy/suy/tOy/tlwiLDUsXCLsv73sv77sv7/tgIHtgILtgIPtgIVcIiw1XSxcbltcImIzODFcIixcIu2Ai1wiLDUsXCLtgJJcIiw1LFwi7YCZXCIsMTksXCLrgZ3rgbzrgb3rgoDrgoTrgozrgo3rgo/rgpHrgpjrgpnrgprrgpzrgp/rgqDrgqHrgqLrgqjrgqnrgqtcIiw0LFwi64Kx64Kz64K064K164K464K864OE64OF64OH64OI64OJ64OQ64OR64OU64OY64Og64Ol64SI64SJ64SL64SM64SQ64SS64ST64SY64SZ64Sb64Sc64Sd64Sj64Sk64Sl64So64Ss64S064S164S364S464S564WA64WB64WE64WI64WQ64WR64WU64WV64WY64Wc64Wg64W464W564W864aA64aC64aI64aJ64aL64aN64aS64aT64aU64aY64ac64ao64eM64eQ64eU64ec64edXCJdLFxuW1wiYjQ0MVwiLFwi7YCuXCIsNSxcIu2Atu2At+2Aue2Auu2Au+2AvVwiLDYsXCLtgYbtgYjtgYpcIiw1XSxcbltcImI0NjFcIixcIu2Bke2Bku2Bk+2Ble2Blu2Bl+2BmVwiLDYsXCLtgaFcIiwxMCxcIu2Bru2Br1wiXSxcbltcImI0ODFcIixcIu2Bse2Bsu2Bs+2BtVwiLDYsXCLtgb7tgb/tgoDtgoJcIiwxOCxcIuuHn+uHqOuHqeuHrOuHsOuHueuHu+uHveuIhOuIheuIiOuIi+uIjOuIlOuIleuIl+uImeuIoOuItOuIvOuJmOuJnOuJoOuJqOuJqeuJtOuJteuJvOuKhOuKheuKieuKkOuKkeuKlOuKmOuKmeuKmuuKoOuKoeuKo+uKpeuKpuuKquuKrOuKsOuKtOuLiOuLieuLjOuLkOuLkuuLmOuLmeuLm+uLneuLouuLpOuLpeuLpuuLqOuLq1wiLDQsXCLri7Pri7Tri7Xri7dcIiw0LFwi64u/64yA64yB64yE64yI64yQ64yR64yT64yU64yV64yc642U642V642W642Y642b642c642e642f642k642lXCJdLFxuW1wiYjU0MVwiLFwi7YKVXCIsMTQsXCLtgqbtgqftgqntgqrtgqvtgq1cIiw1XSxcbltcImI1NjFcIixcIu2Cs+2Ctu2CuO2CulwiLDUsXCLtg4Ltg4Ptg4Xtg4btg4ftg4pcIiw1LFwi7YOS7YOWXCIsNF0sXG5bXCJiNTgxXCIsXCLtg5vtg57tg5/tg6Htg6Ltg6Ptg6VcIiw2LFwi7YOu7YOyXCIsNSxcIu2DuVwiLDExLFwi642n642p642r642u642w642x64206424646A646B646D646E646F646M646Q646U646g646h646o646s64+E64+F64+I64+L64+M64+O64+Q64+U64+V64+X64+Z64+b64+d64+g64+k64+o64+865CQ65CY65Cc65Cg65Co65Cp65Cr65C065GQ65GR65GU65GY65Gg65Gh65Gj65Gl65Gs65KA65KI65Kd65Kk65Ko65Ks65K165K365K565OA65OE65OI65OQ65OV65Oc65Od65Og65Oj65Ok65Om65Os65Ot65Ov65Ox65O465SU65SV65SY65Sb65Sc65Sk65Sl65Sn65So65Sp65Sq65Sw65Sx65S065S4XCJdLFxuW1wiYjY0MVwiLFwi7YSFXCIsNyxcIu2EjlwiLDE3XSxcbltcImI2NjFcIixcIu2EoFwiLDE1LFwi7YSy7YSz7YS17YS27YS37YS57YS77YS87YS97YS+XCJdLFxuW1wiYjY4MVwiLFwi7YS/7YWC7YWGXCIsNSxcIu2Fju2Fj+2Fke2Fku2Fk+2FlVwiLDYsXCLthZ7thaDthaJcIiw1LFwi7YWp7YWq7YWr7YWt65WA65WB65WD65WE65WF65WL65WM65WN65WQ65WU65Wc65Wd65Wf65Wg65Wh65ag65ah65ak65ao65aq65ar65aw65ax65az65a065a165a765a865a965eA65eE65eM65eN65eP65eQ65eR65eY65es65iQ65iR65iU65iY65il65is65i065mI65mk65mo65qc65qd65qg65qk65qr65qs65qx65uU65uw65u065u465yA65yB65yF65yo65yp65ys65yv65yw65y465y565y7652E652I652M652U652V652g652k652o652w652x652z652165286529656A656E656M656N656P656Q656R656S656W656XXCJdLFxuW1wiYjc0MVwiLFwi7YWuXCIsMTMsXCLthb1cIiw2LFwi7YaF7YaG7YaH7YaJ7YaKXCJdLFxuW1wiYjc2MVwiLFwi7YaLXCIsMjAsXCLthqLthqPthqXthqbthqdcIl0sXG5bXCJiNzgxXCIsXCLthqlcIiw2LFwi7Yay7Ya07Ya27Ya37Ya47Ya57Ya77Ya97Ya+7Ya/7YeBXCIsMTQsXCLrnpjrnpnrnpzrnqDrnqjrnqnrnqvrnqzrnq3rnrTrnrXrnrjrn4frn4nrn6zrn63rn7Drn7Trn7zrn73rn7/roIDroIHroIfroIjroInroIzroJDroJjroJnroJvroJ3roKTroKXroKjroKzroLTroLXroLfroLjroLnroYDroYTroZHroZProZzroZ3roaDroaTroazroa3roa/robHrobjrobzroo3roqjrorDrorTrorjro4Dro4Hro4Pro4Xro4zro5Dro5Tro53ro5/ro6Hro6jro6nro6zro7Dro7jro7nro7vro73rpITrpJjrpKDrpLzrpL3rpYDrpYTrpYzrpY/rpZHrpZjrpZnrpZzrpaDrpajrpalcIl0sXG5bXCJiODQxXCIsXCLth5BcIiw3LFwi7YeZXCIsMTddLFxuW1wiYjg2MVwiLFwi7YerXCIsOCxcIu2Hte2Htu2Ht+2HuVwiLDEzXSxcbltcImI4ODFcIixcIu2IiO2IilwiLDUsXCLtiJFcIiwyNCxcIuulq+ulreultOulteuluOulvOumhOumheumh+umieumiuumjeumjuumrOumreumsOumtOumvOumveumv+ungeuniOunieunjOunjlwiLDQsXCLrp5jrp5nrp5vrp53rp57rp6Hrp6Prp6Trp6Xrp6jrp6zrp7Trp7Xrp7frp7jrp7nrp7rrqIDrqIHrqIjrqJXrqLjrqLnrqLzrqYDrqYLrqYjrqYnrqYvrqY3rqY7rqZPrqZTrqZXrqZjrqZzrqaTrqaXrqafrqajrqanrqbDrqbHrqbTrqbjrqoPrqoTrqoXrqofrqozrqqjrqqnrqqvrqqzrqrDrqrLrqrjrqrnrqrvrqr3rq4Trq4jrq5jrq5nrq7xcIl0sXG5bXCJiOTQxXCIsXCLtiKrtiKvtiK7tiK/tiLHtiLLtiLPtiLVcIiw2LFwi7Yi+7YmA7YmCXCIsNSxcIu2Jie2Jiu2Ji+2JjFwiXSxcbltcImI5NjFcIixcIu2JjVwiLDE0LFwi7YmdXCIsNixcIu2Jpe2Jpu2Jp+2JqFwiXSxcbltcImI5ODFcIixcIu2JqVwiLDIyLFwi7YqC7YqD7YqF7YqG7YqH7YqJ7YqK7YqL7YqM66yA66yE66yN66yP66yR66yY66yc66yg66yp66yr66y066y166y266y466y766y866y966y+662E662F662H662J662N662P662Q662U662Y662h662j662s666I666M666Q666k666o666s6660666366+A66+E66+I66+Q66+T66+466+566+866+/67CA67CC67CI67CJ67CL67CM67CN67CP67CR67CUXCIsNCxcIuuwm1wiLDQsXCLrsKTrsKXrsKfrsKnrsK3rsLDrsLHrsLTrsLjrsYDrsYHrsYPrsYTrsYXrsYnrsYzrsY3rsZDrsZ3rsoTrsoXrsojrsovrsozrso7rspTrspXrspdcIl0sXG5bXCJiYTQxXCIsXCLtio3tio7tio/tipLtipPtipTtipZcIiw1LFwi7Yqd7Yqe7Yqf7Yqh7Yqi7Yqj7YqlXCIsNixcIu2KrVwiXSxcbltcImJhNjFcIixcIu2Kru2Kr+2KsO2KslwiLDUsXCLtirrtirvtir3tir7ti4Hti4NcIiw0LFwi7YuK7YuMXCIsNV0sXG5bXCJiYTgxXCIsXCLti5Lti5Pti5Xti5bti5fti5nti5rti5vti51cIiw2LFwi7YumXCIsOSxcIu2Lsu2Ls+2Lte2Ltu2Lt+2Lue2LuuuymeuymuuyoOuyoeuypOuyp+uyqOuysOuyseuys+uytOuyteuyvOuyveuzgOuzhOuzjeuzj+uzkOuzkeuzleuzmOuznOuztOuzteuztuuzuOuzvOu0hOu0heu0h+u0ieu0kOu0lOu0pOu0rOu1gOu1iOu1ieu1jOu1kOu1mOu1meu1pOu1qOu2gOu2geu2hOu2h+u2iOu2ieu2iuu2kOu2keu2k+u2leu2meu2muu2nOu2pOu2sOu2uOu3lOu3leu3mOu3nOu3qeu3sOu3tOu3uOu4gOu4g+u4heu4jOu4jeu4kOu4lOu4nOu4neu4n+u5hOu5heu5iOu5jOu5juu5lOu5leu5l+u5meu5muu5m+u5oOu5oeu5pFwiXSxcbltcImJiNDFcIixcIu2Lu1wiLDQsXCLtjILtjITtjIZcIiw1LFwi7YyP7YyR7YyS7YyT7YyV7YyXXCIsNCxcIu2Mnu2Mou2Mo1wiXSxcbltcImJiNjFcIixcIu2MpO2Mpu2Mp+2Mqu2Mq+2Mre2Mru2Mr+2MsVwiLDYsXCLtjLrtjL5cIiw1LFwi7Y2G7Y2H7Y2I7Y2JXCJdLFxuW1wiYmI4MVwiLFwi7Y2KXCIsMzEsXCLruajruarrubDrubHrubPrubTrubXrubvrubzrub3ruoDruoTruozruo3ruo/rupDrupHrupjrupnruqjru5Dru5Hru5Tru5fru5jru6Dru6Pru6Tru6Xru6zrvIHrvIjrvInrvJjrvJnrvJvrvJzrvJ3rvYDrvYHrvYTrvYjrvZDrvZHrvZXrvpTrvrDrv4Xrv4zrv43rv5Drv5Trv5zrv5/rv6HsgLzsgZHsgZjsgZzsgaDsgajsgansgpDsgpHsgpTsgpjsgqDsgqHsgqPsgqXsgqzsgq3sgq/sgrDsgrPsgrTsgrXsgrbsgrzsgr3sgr/sg4Dsg4Hsg4Xsg4jsg4nsg4zsg5Dsg5jsg5nsg5vsg5zsg53sg6RcIl0sXG5bXCJiYzQxXCIsXCLtjapcIiwxNyxcIu2Nvu2Nv+2Oge2Ogu2Og+2Ohe2Ohu2Oh1wiXSxcbltcImJjNjFcIixcIu2OiO2Oie2Oiu2Oi+2Oju2OklwiLDUsXCLtjprtjpvtjp3tjp7tjp/tjqFcIiw2LFwi7Y6q7Y6s7Y6uXCJdLFxuW1wiYmM4MVwiLFwi7Y6vXCIsNCxcIu2Ote2Otu2Ot+2Oue2Ouu2Ou+2OvVwiLDYsXCLtj4btj4ftj4pcIiw1LFwi7Y+RXCIsNSxcIuyDpeyDqOyDrOyDtOyDteyDt+yDueyEgOyEhOyEiOyEkOyEleyEnFwiLDQsXCLshKPshKTshKbshKfshKzshK3shK/shLDshLHshLbshLjshLnshLzshYDshYjshYnshYvshYzshY3shZTshZXshZjshZzshaTshaXshafshajshanshbDshbTshbjshoXshozsho3sho7shpDshpTshpbshpzshp3shp/shqHshqXshqjshqnshqzshrDshr3sh4Tsh4jsh4zsh5Tsh5fsh5jsh6Dsh6Tsh6jsh7Dsh7Hsh7Psh7zsh73siIDsiITsiIzsiI3siI/siJHsiJjsiJnsiJzsiJ/siKDsiKjsiKnsiKvsiK1cIl0sXG5bXCJiZDQxXCIsXCLtj5ftj5lcIiw3LFwi7Y+i7Y+kXCIsNyxcIu2Pru2Pr+2Pse2Psu2Ps+2Pte2Ptu2Pt1wiXSxcbltcImJkNjFcIixcIu2PuO2Pue2Puu2Pu+2Pvu2QgO2QglwiLDUsXCLtkIlcIiwxM10sXG5bXCJiZDgxXCIsXCLtkJdcIiw1LFwi7ZCeXCIsMjUsXCLsiK/siLHsiLLsiLTsiYjsiZDsiZHsiZTsiZjsiaDsiaXsiazsia3sibDsibTsibzsib3sib/sioHsiojsionsipDsipjsipvsip3siqTsiqXsiqjsiqzsiq3sirTsirXsirfsirnsi5zsi53si6Dsi6Psi6Tsi6vsi6zsi63si6/si7Hsi7bsi7jsi7nsi7vsi7zsjIDsjIjsjInsjIzsjI3sjJPsjJTsjJXsjJjsjJzsjKTsjKXsjKjsjKnsjYXsjajsjansjazsjbDsjbLsjbjsjbnsjbzsjb3sjoTsjojsjozsj4Dsj5jsj5nsj5zsj5/sj6Dsj6Lsj6jsj6nsj63sj7Tsj7Xsj7jskIjskJDskKTskKzskLBcIl0sXG5bXCJiZTQxXCIsXCLtkLhcIiw3LFwi7ZGB7ZGC7ZGD7ZGFXCIsMTRdLFxuW1wiYmU2MVwiLFwi7ZGUXCIsNyxcIu2Rne2Rnu2Rn+2Roe2Rou2Ro+2RpVwiLDcsXCLtka7tkbDtkbHtkbJcIl0sXG5bXCJiZTgxXCIsXCLtkbNcIiw0LFwi7ZG67ZG77ZG97ZG+7ZKB7ZKDXCIsNCxcIu2Siu2SjO2SjlwiLDUsXCLtkpVcIiw4LFwi7JC07JC87JC97JGI7JGk7JGl7JGo7JGs7JG07JG17JG57JKA7JKU7JKc7JK47JK87JOp7JOw7JOx7JO07JO47JO67JO/7JSA7JSB7JSM7JSQ7JSU7JSc7JSo7JSp7JSs7JSw7JS47JS57JS77JS97JWE7JWF7JWI7JWJ7JWK7JWM7JWN7JWO7JWT7JWU7JWV7JWX7JWY7JWZ7JWd7JWe7JWg7JWh7JWk7JWo7JWw7JWx7JWz7JW07JW17JW87JW97JaA7JaE7JaH7JaM7JaN7JaP7JaR7JaV7JaX7JaY7Jac7Jag7Jap7Ja07Ja17Ja47Ja57Ja77Ja87Ja97Ja+7JeEXCIsNixcIuyXjOyXjlwiXSxcbltcImJmNDFcIixcIu2SnlwiLDEwLFwi7ZKqXCIsMTRdLFxuW1wiYmY2MVwiLFwi7ZK5XCIsMTgsXCLtk43tk47tk4/tk5Htk5Ltk5Ptk5VcIl0sXG5bXCJiZjgxXCIsXCLtk5ZcIiw1LFwi7ZOd7ZOe7ZOgXCIsNyxcIu2Tqe2Tqu2Tq+2Tre2Tru2Tr+2TsVwiLDYsXCLtk7ntk7rtk7zsl5Dsl5Hsl5Tsl5jsl6Dsl6Hsl6Psl6Xsl6zsl63sl67sl7Dsl7Tsl7bsl7fsl7xcIiw1LFwi7JiF7JiG7JiH7JiI7JiM7JiQ7JiY7JiZ7Jib7Jic7Jik7Jil7Jio7Jis7Jit7Jiu7Jiw7Jiz7Ji07Ji17Ji37Ji57Ji77JmA7JmB7JmE7JmI7JmQ7JmR7JmT7JmU7JmV7Jmc7Jmd7Jmg7Jms7Jmv7Jmx7Jm47Jm57Jm87JqA7JqI7JqJ7JqL7JqN7JqU7JqV7JqY7Jqc7Jqk7Jql7Jqn7Jqp7Jqw7Jqx7Jq07Jq47Jq57Jq67JuA7JuB7JuD7JuF7JuM7JuN7JuQ7JuU7Juc7Jud7Jug7Juh7JuoXCJdLFxuW1wiYzA0MVwiLFwi7ZO+XCIsNSxcIu2Uhe2Uhu2Uh+2Uie2Uiu2Ui+2UjVwiLDYsXCLtlJbtlJhcIiw1XSxcbltcImMwNjFcIixcIu2UnlwiLDI1XSxcbltcImMwODFcIixcIu2UuO2Uue2Uuu2Uu+2Uvu2Uv+2Vge2Vgu2Vg+2VhVwiLDYsXCLtlY7tlZDtlZJcIiw1LFwi7ZWa7ZWb7ZWd7ZWe7ZWf7ZWh7ZWi7ZWj7Jup7Jus7Juw7Ju47Ju57Ju97JyE7JyF7JyI7JyM7JyU7JyV7JyX7JyZ7Jyg7Jyh7Jyk7Jyo7Jyw7Jyx7Jyz7Jy17Jy37Jy87Jy97J2A7J2E7J2K7J2M7J2N7J2P7J2RXCIsNyxcIuydnOydoOydqOydq+ydtOydteyduOydvOydveydvuyeg+yehOyeheyeh+yeiOyeieyeiuyejuyekOyekeyelOyeluyel+yemOyemuyeoOyeoeyeo+yepOyepeyepuyerOyereyesOyetOyevOyeveyev+yfgOyfgeyfiOyfieyfjOyfjuyfkOyfmOyfneyfpOyfqOyfrOyggOyggeyghOygiOygilwiXSxcbltcImMxNDFcIixcIu2VpO2Vpu2Vp+2Vqu2VrO2VrlwiLDUsXCLtlbbtlbftlbntlbrtlbvtlb1cIiw2LFwi7ZaG7ZaK7ZaLXCJdLFxuW1wiYzE2MVwiLFwi7ZaM7ZaN7ZaO7ZaP7ZaRXCIsMTksXCLtlqbtlqdcIl0sXG5bXCJjMTgxXCIsXCLtlqhcIiwzMSxcIuygkOygkeygk+ygleygluygnOygneygoOygpOygrOygreygr+ygseyguOygvOyhgOyhiOyhieyhjOyhjeyhlOyhsOyhseyhtOyhuOyhuuyigOyigeyig+yiheyihuyih+yii+yijOyijeyilOyineyin+yioeyiqOyivOyiveyjhOyjiOyjjOyjlOyjleyjl+yjmeyjoOyjoeyjpOyjteyjvOyjveykgOykhOykheykhuykjOykjeykj+ykkeykmOykrOyktOylkOylkeyllOylmOyloOyloeylo+ylrOylsOyltOylvOymiOymieymjOymkOymmOymmeymm+ymneyngOyngeynhOynh+yniOyniuynkOynkeynk1wiXSxcbltcImMyNDFcIixcIu2Xiu2Xi+2Xje2Xju2Xj+2Xke2Xk1wiLDQsXCLtl5rtl5ztl55cIiw1LFwi7Zem7Zen7Zep7Zeq7Zer7Zet7ZeuXCJdLFxuW1wiYzI2MVwiLFwi7ZevXCIsNCxcIu2Xtu2XuO2XulwiLDUsXCLtmILtmIPtmIXtmIbtmIftmIlcIiw2LFwi7ZiSXCJdLFxuW1wiYzI4MVwiLFwi7ZiWXCIsNSxcIu2Yne2Ynu2Yn+2Yoe2You2Yo+2YpVwiLDcsXCLtmK5cIiw5LFwi7Zi67Zi77KeV7KeW7KeZ7Kea7Kec7Ked7Keg7Kei7Kek7Ken7Kes7Ket7Kev7Kew7Kex7Ke47Ke57Ke87KiA7KiI7KiJ7KiL7KiM7KiN7KiU7KiY7Kip7KmM7KmN7KmQ7KmU7Kmc7Kmd7Kmf7Kmg7Kmh7Kmo7Km97KqE7KqY7Kq87Kq97KuA7KuE7KuM7KuN7KuP7KuR7KuT7KuY7KuZ7Kug7Kus7Ku07KyI7KyQ7KyU7KyY7Kyg7Kyh7K2B7K2I7K2J7K2M7K2Q7K2Y7K2Z7K2d7K2k7K247K257K6c7K647K+U7K+k7K+n7K+p7LCM7LCN7LCQ7LCU7LCc7LCd7LCh7LCi7LCn7LCo7LCp7LCs7LCu7LCw7LC47LC57LC7XCJdLFxuW1wiYzM0MVwiLFwi7Zi97Zi+7Zi/7ZmB7ZmC7ZmD7ZmE7ZmG7ZmH7ZmK7ZmM7ZmO7ZmP7ZmQ7ZmS7ZmT7ZmW7ZmX7ZmZ7Zma7Zmb7ZmdXCIsNF0sXG5bXCJjMzYxXCIsXCLtmaJcIiw0LFwi7Zmo7ZmqXCIsNSxcIu2Zsu2Zs+2ZtVwiLDExXSxcbltcImMzODFcIixcIu2age2agu2ahO2ahlwiLDUsXCLtmo7tmo/tmpHtmpLtmpPtmpVcIiw3LFwi7Zqe7Zqg7ZqiXCIsNSxcIu2aqe2aquywvOywveywvuyxhOyxheyxiOyxjOyxlOyxleyxl+yxmOyxmeyxoOyxpOyxpuyxqOyxsOyxteyymOyymeyynOyyoOyyqOyyqeyyq+yyrOyyreyytOyyteyyuOyyvOyzhOyzheyzh+yzieyzkOyzlOyzpOyzrOyzsOy0gey0iOy0iey0jOy0kOy0mOy0mey0m+y0ney0pOy0qOy0rOy0uey1nOy1oOy1pOy1rOy1rey1r+y1sey1uOy2iOy2lOy2ley2mOy2nOy2pOy2pey2p+y2qey2sOy3hOy3jOy3kOy3qOy3rOy3sOy3uOy3uey3u+y3vey4hOy4iOy4jOy4lOy4mey4oOy4oey4pOy4qOy4sOy4sey4s+y4tVwiXSxcbltcImM0NDFcIixcIu2aq+2are2aru2ar+2asVwiLDcsXCLtmrrtmrxcIiw3LFwi7ZuG7ZuH7ZuJ7ZuK7ZuLXCJdLFxuW1wiYzQ2MVwiLFwi7ZuN7ZuO7ZuP7ZuQ7ZuS7ZuT7ZuV7ZuW7ZuY7ZuaXCIsNSxcIu2boe2bou2bo+2bpe2bpu2bp+2bqVwiLDRdLFxuW1wiYzQ4MVwiLFwi7Zuu7Zuv7Zux7Zuy7Zuz7Zu07Zu2XCIsNSxcIu2bvu2bv+2cge2cgu2cg+2chVwiLDExLFwi7ZyS7ZyT7ZyU7LmY7LmZ7Lmc7Lmf7Lmg7Lmh7Lmo7Lmp7Lmr7Lmt7Lm07Lm17Lm47Lm87LqE7LqF7LqH7LqJ7LqQ7LqR7LqU7LqY7Lqg7Lqh7Lqj7Lqk7Lql7Lqs7Lqt7LuB7Luk7Lul7Luo7Lur7Lus7Lu07Lu17Lu37Lu47Lu57LyA7LyB7LyE7LyI7LyQ7LyR7LyT7LyV7Lyc7Lyg7Lyk7Lys7Lyt7Lyv7Lyw7Lyx7Ly47L2U7L2V7L2Y7L2c7L2k7L2l7L2n7L2p7L2w7L2x7L207L247L6A7L6F7L6M7L6h7L6o7L6w7L+E7L+g7L+h7L+k7L+o7L+w7L+x7L+z7L+17L+87YCA7YCE7YCR7YCY7YCt7YC07YC17YC47YC8XCJdLFxuW1wiYzU0MVwiLFwi7ZyV7ZyW7ZyX7Zya7Zyb7Zyd7Zye7Zyf7ZyhXCIsNixcIu2cqu2crO2crlwiLDUsXCLtnLbtnLftnLlcIl0sXG5bXCJjNTYxXCIsXCLtnLrtnLvtnL1cIiw2LFwi7Z2F7Z2G7Z2I7Z2KXCIsNSxcIu2dku2dk+2dle2dmlwiLDRdLFxuW1wiYzU4MVwiLFwi7Z2f7Z2i7Z2k7Z2m7Z2n7Z2o7Z2q7Z2r7Z2t7Z2u7Z2v7Z2x7Z2y7Z2z7Z21XCIsNixcIu2dvu2dv+2egO2eglwiLDUsXCLtnortnovtgYTtgYXtgYftgYntgZDtgZTtgZjtgaDtgaztga3tgbDtgbTtgbztgb3tgoHtgqTtgqXtgqjtgqztgrTtgrXtgrftgrntg4Dtg4Htg4Ttg4jtg4ntg5Dtg5Htg5Ptg5Ttg5Xtg5ztg53tg6Dtg6Ttg6ztg63tg6/tg7Dtg7Htg7jthI3thLDthLHthLTthLjthLrthYDthYHthYPthYTthYXthYzthY3thZDthZTthZzthZ3thZ/thaHthajthazthbzthoTthojthqDthqHthqTthqjthrDthrHthrPthrXthrrthrzth4Dth5jth7Tth7jtiIftiIntiJDtiKztiK3tiLDtiLTtiLztiL3tiL/tiYHtiYjtiZxcIl0sXG5bXCJjNjQxXCIsXCLtno3tno7tno/tnpFcIiw2LFwi7Z6a7Z6c7Z6eXCIsNV0sXG5bXCJjNmExXCIsXCLtiaTtioDtioHtioTtiojtipDtipHtipXtipztiqDtiqTtiqztirHtirjtirntirztir/ti4Dti4Lti4jti4nti4vti5Tti5jti5zti6Tti6Xti7Dti7Hti7Tti7jtjIDtjIHtjIPtjIXtjIztjI3tjI7tjJDtjJTtjJbtjJztjJ3tjJ/tjKDtjKHtjKXtjKjtjKntjKztjLDtjLjtjLntjLvtjLztjL3tjYTtjYXtjbztjb3tjoDtjoTtjoztjo3tjo/tjpDtjpHtjpjtjpntjpztjqDtjqjtjqntjqvtjq3tjrTtjrjtjrztj4Ttj4Xtj4jtj4ntj5Dtj5jtj6Htj6Ptj6ztj63tj7Dtj7Ttj7ztj73tj7/tkIFcIl0sXG5bXCJjN2ExXCIsXCLtkIjtkJ3tkYDtkYTtkZztkaDtkaTtka3tka/tkbjtkbntkbztkb/tkoDtkoLtkojtkontkovtko3tkpTtkqntk4ztk5Dtk5Ttk5ztk5/tk6jtk6ztk7Dtk7jtk7vtk73tlITtlIjtlIztlJTtlJXtlJftlLztlL3tlYDtlYTtlYztlY3tlY/tlZHtlZjtlZntlZztlaDtlaXtlajtlantlavtla3tlbTtlbXtlbjtlbztloTtloXtloftlojtlontlpDtlqXtl4jtl4ntl4ztl5Dtl5Ltl5jtl5ntl5vtl53tl6Ttl6Xtl6jtl6ztl7Ttl7Xtl7ftl7ntmIDtmIHtmITtmIjtmJDtmJHtmJPtmJTtmJXtmJztmKBcIl0sXG5bXCJjOGExXCIsXCLtmKTtmK3tmLjtmLntmLztmYDtmYXtmYjtmYntmYvtmY3tmZHtmZTtmZXtmZjtmZztmaftmantmbDtmbHtmbTtmoPtmoXtmoztmo3tmpDtmpTtmp3tmp/tmqHtmqjtmqztmrDtmrntmrvtm4Ttm4Xtm4jtm4ztm5Htm5Ttm5ftm5ntm6Dtm6Ttm6jtm7Dtm7Xtm7ztm73tnIDtnITtnJHtnJjtnJntnJztnKDtnKjtnKntnKvtnK3tnLTtnLXtnLjtnLztnYTtnYftnYntnZDtnZHtnZTtnZbtnZftnZjtnZntnaDtnaHtnaPtnaXtnantnaztnbDtnbTtnbztnb3tnoHtnojtnontnoztnpDtnpjtnpntnpvtnp1cIl0sXG5bXCJjYWExXCIsXCLkvL3kvbPlgYflg7nliqDlj6/lkbXlk6XlmInlq4Hlrrbmmofmnrbmnrfmn6/mrYznj4Lnl4LnqLzoi5vojITooZfooojoqLbos4jot4/ou7vov6bpp5XliLvljbTlkITmgarmhaTmrrznj4/ohJroprrop5LplqPkvoPliIrlor7lpbjlp6blubLlubnmh4fmj4DmnYbmn6zmob/mvpfnmY7nnIvno7XnqIjnq7/nsKHogp3oia7oibHoq6vplpPkuavllp3mm7fmuLTnoqPnq63okZvopJDonY7pnqjli5jlnY7loKrltYzmhJ/mhr7miKHmlaLmn5HmqYTmuJvnlJjnlrPnm6PnnrDntLrpgq/pkZHpkZLpvpVcIl0sXG5bXCJjYmExXCIsXCLljKPlsqznlLLog5vpiYDplpjliZvloIjlp5zlsqHltJflurflvLrlvYrmhbfmsZ/nlbrnlobns6DntbPntrHnvozohZToiKHolpHopYHorJvpi7zpmY3psYfku4vku7flgIvlh7HloY/mhLfmhL7mhajmlLnmp6rmvJHnlqXnmobnm5bnrofoiqXok4vvpIDpjqfplovlloDlrqLlnZHvpIHnsrPnvrnphrXlgKjljrvlsYXlt6jmi5Lmja7mk5rmk6fmuKDngqznpZvot53ouJ7vpILpgb3piYXpi7jkub7ku7blgaXlt77lu7rmhIbmpZfohbHomZTouYfpjbXpqKvkuZ7lgpHmnbDmoYDlhInlio3lipLmqqJcIl0sXG5bXCJjY2ExXCIsXCLnnrzpiJDpu5TliqvmgK/ov7LlgYjmhqnmj63mk4rmoLzmqoTmv4DohojopqHpmpTloIXnib3niqznlITntbnnua3ogqnopovorbTpgaPptZHmionmsbrmvZTntZDnvLroqKPlhbzmhYrnrp3orJnpiZfpjozkuqzkv5PlgJ7lgr7lhIbli4Hli43ljb/lnbDlooPluprlvpHmhbbmhqzmk47mlazmma/mmrvmm7TmopfmtofngoXng7Hnkp/nkqXnk4rnl5nnoazno6znq5/nq7bntYXntpPogJXogL/ohJvojpborabovJXpgJXpj6HpoIPpoLjpqZrpr6jkv4LllZPloLrlpZHlraPlsYbmgrjmiJLmoYLmorBcIl0sXG5bXCJjZGExXCIsXCLmo6jmuqrnlYznmbjno47nqL3ns7vnuavnubzoqIjoqqHosL/pmo7pt4Tlj6Tlj6nlkYrlkbHlm7rlp5HlraTlsLvluqvmi7fmlLfmlYXmlbLmmqDmnq/mp4Hmsr3nl7znmpDnnb7nqL/nvpTogIPogqHoho/oi6boi73oj7Dol4HooLHoorToqqXvpIPovpzpjK7pm4fpoafpq5jpvJPlk63mlpvmm7Lmoo/nqYDosLfptaDlm7DlnaTltJHmmIbmorHmo43mu77nkKjoop7pr6TmsajvpITpqqjkvpvlhazlhbHlip/lrZTlt6XmgZDmga3mi7HmjqfmlLvnj5nnqbromqPosqLpno/kuLLlr6HmiIjmnpznk5xcIl0sXG5bXCJjZWExXCIsXCLnp5Hoj5PoqofoqrLot6jpgY7pjYvpoYblu5Pmp6jol7/pg63vpIXlhqDlrpjlr6zmhaPmo7rmrL7ngYznkK/nk5jnrqHnvZDoj4Xop4Dosqvpl5zppKjliK7mgZ3mi6zpgILkvorlhYnljKHlo5nlu6Pmm6DmtLjngprni4Lnj5bnrZDog7HpkZvljabmjpvnvavkuZblgoDloYrlo57mgKrmhKfmi5Dmp5DprYHlro/ntJjogrHovZ/kuqTlg5HlkqzllqzlrIzltqDlt6fmlKrmlY7moKHmqYvni6Hnmo7nn6/ntZ7nv7nohqDolY7om5/ovIPovY7pg4rppIPpqZXprqvkuJjkuYXkuZ3ku4fkv7Hlhbfli75cIl0sXG5bXCJjZmExXCIsXCLljYDlj6Plj6Xlko7lmJTlnbXlnqLlr4fltoflu5Dmh7zmi5jmlZHmnrjmn6nmp4vmrZDmr4bmr6zmsYLmup3ngbjni5fnjpbnkIPnnr/nn6nnqbbntb/ogInoh7zoiIXoiIroi5/ooaLorLPos7zou4DpgJHpgrHpiaTpirbpp5LpqYXps6npt5fpvpzlnIvlsYDoj4rpnqDpnqvpurTlkJvnqpjnvqToo5nou43pg6HloIDlsYjmjpjnqp/lrq7lvJPnqbnnqq7oio7ouqzlgKbliLjli7jljbflnIjmi7PmjbLmrIrmt4PnnLfljqXnjZfolajoubbpl5XmnLrmq4PmvbDoqa3ou4zppYvvpIbmmbfmrbjosrRcIl0sXG5bXCJkMGExXCIsXCLprLzvpIflj6vlnK3lpY7mj4bmp7vnj6rnoYXnqrrnq4Xns77okbXopo/otbPpgLXplqjli7vlnYfnlYfnraDoj4zpiJ7vpIjmqZjlhYvliYvliofmiJ/mo5jmpbXpmpnlg4XliqTli6Tmh4PmlqTmoLnmp7/nkb7nrYvoirnoj6voprLorLnov5HppYnvpInku4rlppfmk5LmmJHmqo7nkLTnpoHnpr3oiqnoob7oob/opZ/vpIrpjKbkvIvlj4rmgKXmibHmsbLntJrntabkupjlhaLnn5zogq/kvIHkvI7lhbblhoDll5zlmajlnLvln7rln7zlpJTlpYflppPlr4TlspDltI7lt7Hlub7lv4zmioDml5fml6NcIl0sXG5bXCJkMWExXCIsXCLmnJ7mnJ/mnZ7mo4vmo4TmqZ/mrLrmsKPmsb3msoLmt4fnjpjnkKbnkKrnkoLnkqPnlbjnlb/nooHno6/npYHnpYfnpYjnpbrnrpXntIDntrrnvojogIbogK3ogozoqJjorY/osYjotbfpjKHpjKTpo6LppZHpqI7pqI/pqaXpupLnt4rkvbblkInmi67moZTph5HllqvlhLrvpIvvpIzlqJzmh6bvpI3mi4/mi7/vpI5cIiw1LFwi6YKj76SUXCIsNCxcIuirvu+kme+kmu+km++knOaalu+kneeFlu+knu+kn+mbo++koOaNj+aNuuWNl++koeaej+aloOa5s++koueUt++ko++kpO+kpVwiXSxcbltcImQyYTFcIixcIue0je+kpu+kp+ihsuWbiuWomO+kqFwiLDQsXCLkuYPvpK3lhaflpYjmn7DogJDvpK7lpbPlubTmkprnp4rlv7Xmgazmi4jmjbvlr6flr5fliqrvpK/lpbTlvKnmgJLvpLDvpLHvpLLnkZnvpLNcIiw1LFwi6aeR76S5XCIsMTAsXCLmv4PvpYTvpYXohr/ovrLmg7HvpYbvpYfohabvpYjvpYnlsL/vpYpcIiw3LFwi5aup6Kil5p2757SQ76WSXCIsNSxcIuiDve+lmO+lmeWwvOazpeWMv+a6uuWkmuiMtlwiXSxcbltcImQzYTFcIixcIuS4ueS6tuS9huWWruWcmOWjh+W9luaWt+aXpuaqgOautea5jeefreerr+ewnue3nuibi+iikumEsumNm+aSu+a+vueNuueWuOmBlOWVluWdjeaGuuaTlOabh+a3oea5m+a9rea+ueeXsOiBg+iGveiVgeimg+irh+itmumMn+ayk+eVk+etlOi4j+mBneWUkOWgguWhmOW5ouaIh+aSnuajoOeVtuezluies+m7qOS7o+WeiOWdruWkp+WwjeWyseW4tuW+heaItOaToeeOs+iHuuiii+iyuOmaium7m+WuheW+t+aCs+WAkuWIgOWIsOWcluWgteWhl+WwjuWxoOWztuW2i+W6puW+kuaCvOaMkeaOieaQl+ahg1wiXSxcbltcImQ0YTFcIixcIuajueargua3mOa4oea7lOa/pOeHvuebnOedueemseeou+iQhOimqeizrei3s+i5iOmAg+mAlOmBk+mDvemNjemZtumfnOavkueAhueJmOeKoueNqOedo+emv+evpOe6m+iugOWiqeaDh+aVpuaXveaavuayjOeEnueHieixmumgk+S5reeqgeS7neWGrOWHjeWLleWQjOaGp+adseahkOajn+a0nua9vOeWvOees+erpeiDtOiRo+mKheWFnOaWl+adnOaek+eXmOerh+iNs++lmuixhumAl+mgreWxr+iHgOiKmumBgemBr+mIjeW+l+W2neapmeeHiOeZu+etieiXpOishOmEp+mosOWWh+aHtu+lm+eZqee+hVwiXSxcbltcImQ1YTFcIixcIuiYv+ieuuijuOmCj++lnOa0m+eDmeePnue1oeiQve+lnemFqumnse+lnuS6guWNteashOaskueAvueIm+iYrem4nuWJjOi+o+W1kOaTpeaUrOaslua/q+exg+e6nOiXjeilpOimveaLieiHmOign+W7iuacl+a1queLvOeQheeRr+iegumDnuS+huW0jeW+oOiQiuWGt+aOoOeVpeS6ruWAhuWFqeWHieaigeaokeeyrueyseezp+iJr+irkui8m+mHj+S+tuWEt+WLteWRguW7rOaFruaIvuaXhearmua/vuekquiXnOigo+mWrempoumpqum6l+m7juWKm+abhuatt+eAneekq+i9oumdguaGkOaIgOaUo+a8o1wiXSxcbltcImQ2YTFcIixcIueFieeSiee3tOiBr+iTrui8pumAo+mNiuWGveWIl+WKo+a0jOeDiOijguW7ieaWguaurua/guewvueNteS7pOS8tuWbue+ln+WyuuW2uuaAnOeOsuesree+mue/juiBhumAnumItOmbtumdiOmgmOm9oeS+i+a+p+emrumGtOmat+WLnu+loOaSiOaThOark+a9nueAmOeIkOebp+iAgeiYhuiZnOi3r+i8hemcsumtr+m3uum5teeijOelv+e2oOiPiemMhOm5v+m6k+irluWjn+W8hOacp+eAp+eTj+exoOiBvuWEoeeAqOeJouejiuizguizmuiztOmbt+S6huWDmuWvruW7luaWmeeHjueZgueereiBiuiTvFwiXSxcbltcImQ3YTFcIixcIumBvOmsp+m+jeWjmOWpgeWxouaok+a3mua8j+eYu+e0r+e4t+iUnuikuOmPpOmZi+WKieaXkuafs+amtOa1gea6nOeAj+eQieeRoOeVmeeYpOehq+isrOmhnuWFreaIrumZuOS+luWAq+W0mea3que2uOi8quW+i+aFhOagl++loemahuWLkuiCi+WHnOWHjOalnueonOe2vuiPsemZteS/muWIqeWOmOWQj+WUjuWxpeaCp+adjuaiqOa1rOeKgeeLuOeQhueSg++loueXouexrOe9uee+uOiOieijj+ijoemHjOmHkOmboumvieWQnea9vueHkOeSmOiXuui6qumao+mxl+m6n+ael+a3i+eQs+iHqOmcluegrFwiXSxcbltcImQ4YTFcIixcIueri+esoOeykuaRqeeRqueXsueivOejqOmmrOmtlOm6u+WvnuW5lea8oOiGnOiOq+mCiOS4h+WNjeWoqeW3kuW9juaFouaMveaZqeabvOa7v+a8q+eBo+eenuiQrOiUk+igu+i8k+mlhemwu+WUnOaKueacq+ayq+iMieilqumduuS6oeWmhOW/mOW/meacm+e2sue9lOiKkuiMq+iOvei8numCmeWfi+WmueWqkuWvkOaYp+aemuaiheavj+eFpOe9teiyt+izo+mCgemtheiEiOiyiumZjOmpgOm6peWtn+awk+eMm+ebsuebn+iQjOWGquimk+WFjeWGleWLieajieaylOechOecoOe2v+e3rOmdoum6tea7hVwiXSxcbltcImQ5YTFcIixcIuiUkeWGpeWQjeWRveaYjuaaneakp+a6n+eav+eekeiMl+iTguien+mFqemKmOmztOiiguS+ruWGkuWLn+WnhuW4veaFleaRuOaRueaaruafkOaooeavjeavm+eJn+eJoeeRgeecuOefm+iAl+iKvOiMheisgOisqOiyjOacqOaykOeJp+ebruedpuephum2qeatv+aykuWkouacpuiSmeWNr+Wik+WmmeW7n+aPj+aYtOads+a4uueMq+erl+iLl+mMqOWLmeW3q+aGruaHi+aIiuaLh+aSq+aXoOalmeatpuavi+eEoeePt+eVnee5huiInuiMguiVquiqo+iyv+mcp+m1oeWiqOm7mOWAkeWIjuWQu+WVj+aWh1wiXSxcbltcImRhYTFcIixcIuaxtue0iue0i+iBnuiaiumWgOmbr+WLv+ayleeJqeWRs+WqmuWwvuW1i+W9jOW+ruacquaitualo+a4vOa5hOecieexs+e+juiWh+isjui/t+mdoem7tOWyt+aCtuaEjeaGq+aVj+aXu+aXvOawkeazr+eOn+ePiee3oemWlOWvhuicnOiskOWJneWNmuaLjeaQj+aSsuactOaouOaziuePgOeSnueulOeylee4m+iGiuiItuiWhOi/q+mbuemngeS8tOWNiuWPjeWPm+aLjOaQrOaUgOaWkeang+azrua9mOePreeVlOeYouebpOebvOejkOeju+ekrOe1huiIrOifoOi/lOmgkumjr+WLg+aLlOaSpea4pOa9kVwiXSxcbltcImRiYTFcIixcIueZvOi3i+mGsemJoumrrumtg+WAo+WCjeWdiuWmqOWwqOW5h+W9t+aIv+aUvuaWueaXgeaYieaei+amnOa7guejhee0oeiCquiGgOiIq+iKs+iSoeiajOioquisl+mCpumYsum+kOWAjeS/s++lo+WfueW+mOaLnOaOkuadr+a5g+eEmeebg+iDjOiDmuijtOijteikmeizoOi8qemFjemZquS8r+S9sOW4m+afj+agoueZveeZvumthOW5oeaoiueFqeeHlOeVqu+lpOe5geiVg+iXqemjnOS8kOetj+e9sOmWpeWHoeW4huaiteawvuaxjuazm+eKr+evhOiMg+azleeQuuWDu+WKiOWjgeaTmOaql+eSp+eZllwiXSxcbltcImRjYTFcIixcIueip+iYl+mXoumcue+lpeWNnuW8geiuiui+qOi+r+mCiuWIpeeepemxiem8iOS4meWAguWFteWxm+W5t+aYnuaYuuafhOajheeCs+eUgeeXheenieernei8p+mkoOmoiOS/neWgoeWgseWvtuaZruatpea0kea5uua9veePpOeUq+iPqeijnOikk+itnOi8lOS8j+WDleWMkOWNnOWuk+W+qeacjeemj+iFueiMr+iUlOikh+imhui8uei8u+mmpemwkuacrOS5tuS/uOWlieWwgeWzr+WzsOaNp+ajkueDveeGoueQq+e4q+iTrOicgumAoumLkumzs+S4jeS7mOS/r+WCheWJluWJr+WQpuWSkOWfoOWkq+WpplwiXSxcbltcImRkYTFcIixcIuWtmuWtteWvjOW6nO+lpuaJtuaVt+aWp+a1rua6peeItuespuewv+e8tuiFkOiFkeiGmuiJgOiKmeiOqeiog+iyoOizpuizu+i1tOi2uumDqOmHnOmYnOmZhOmnmemzp+WMl+WIhuWQqeWZtOWis+WllOWlruW/v+aGpOaJruaYkOaxvueEmuebhueyieeznue0m+iKrOizgembsO+lp+S9m+W8l+W9v+aLguW0qeaci+ajmuehvOe5g+m1rOS4leWCmeWMleWMquWNkeWmg+WpouW6h+aCsuaGiuaJieaJueaWkOaeh+amp+avlOavluavl+avmOayuO+lqOeQteeXuuegkueikeenleenmOeyg+e3i+e/oeiCpVwiXSxcbltcImRlYTFcIixcIuiEvuiHguiPsuicmuijqOiqueitrOiyu+mEmemdnumjm+m8u+WarOWsquW9rOaWjOaqs+aur+a1nOa/seeAleeJneeOreiyp+izk+mgu+aGkeawt+iBmOmogeS5jeS6i+S6m+S7leS8uuS8vOS9v+S/n+WDv+WPsuWPuOWUhuWXo+Wbm+Wjq+WlouWokeWvq+WvuuWwhOW3s+W4q+W+meaAneaNqOaWnOaWr+aftuafu+aireatu+aymeazl+a4o+eAieeNheegguekvuelgOeloOengeevqee0l+e1suiChuiIjeiOjuiTkeibh+ijn+ipkOipnuisneiznOi1pui+remCqumjvOmnn+m6neWJiu+lqeaclO+lqlwiXSxcbltcImRmYTFcIixcIuWCmOWIquWxseaVo+axleePiueUo+eWneeul+iSnOmFuOmcsOS5t+aSkuauuueFnuiWqeS4ie+lq+adieajrua4l+iKn+iUmOihq+aPt+a+gemIkumir+S4iuWCt+WDj+WEn+WVhuWWquWYl+WtgOWwmeWzoOW4uOW6iuW6oOW7guaDs+ahkeapoea5mOeIveeJgOeLgOebuOelpeeusee/lOijs+intOips+ixoeiznumcnOWhnueSveizveWXh++lrOepoee0ouiJsueJsueUn+eUpe+lreesmeWiheWju+W2vOW6j+W6tuW+kOaBleaKkuaNv+aVjeaakeabmeabuOagluajsueKgOeRnuetrue1rue3lue9slwiXSxcbltcImUwYTFcIixcIuiDpeiIkuiWr+ilv+iqk+mAnemLpOm7jem8oOWkleWlreW4reaDnOaYlOaZs+aekOaxkOa3hea9n+efs+eiqeiThumHi+mMq+S7meWDiuWFiOWWhOWsi+Wuo+aJh+aVvuaXi+a4sueFveeQgeeRhOeSh+eSv+eZrOemque3mue5lee+qOiFuuiGs+iIueiYmuifrOiptei3o+mBuOmKkemQpemljemuruWNqOWxkeallOazhOa0qea4q+iIjOiWm+iku+ioreiqqumbqum9p+WJoeaaueausue6luifvui0jemWg+mZneaUnea2ieeHru+lruWfjuWnk+WurOaAp+aDuuaIkOaYn+aZn+eMqeePueebm+ecgeetrFwiXSxcbltcImUxYTFcIixcIuiBluiBsuiFpeiqoOmGkuS4luWLouatsua0l+eoheesuee0sO+lr+iysOWPrOWYr+WhkeWuteWwj+WwkeW3ouaJgOaOg+aQlOaYreais+ayvOa2iOa6r+eAn+eCpOeHkueUpueWj+eWjueYmeeskeevoOewq+e0oOe0ueiUrOiVreiYh+iotOmAjemBoemCtemKt+mftumot+S/l+WxrOadn+a2keeyn+e6jOislui0lumAn+Wtq+W3veaQjeiTgOmBnOmjoeeOh+Wui+aCmuadvua3nuion+iqpumAgemgjOWIt++lsOeBkeeijumOluihsOmHl+S/ruWPl+WXveWbmuWeguWjveWrguWuiOWyq+WzgOW4peaEgVwiXSxcbltcImUyYTFcIixcIuaIjeaJi+aOiOaQnOaUtuaVuOaoueauiuawtOa0mea8seeHp+eLqeeNuOeQh+eSsueYpuedoeengOepl+erqueyuee2j+e2rOe5oee+nuiEqeiMseiSkOiTmuiXquiiluiqsOiukOi8uOmBgumCg+mFrOmKlumKuemai+map+maqOmblumcgOmgiOmmlumrk+msmuWPlOWhvuWkmeWtsOWuv+a3kea9mueGn+eQoeeSueiCheiPveW3oeW+h+W+quaBguaXrOagkualr+apk+auiea0tea3s+ePo+ebvueerOetjee0lOiEo+iInOiNgOiTtOiVo+ipouirhOmGh+mMnumghummtOaIjOihk+i/sOmJpeW0h+W0p1wiXSxcbltcImUzYTFcIixcIuW1qeeRn+iGneidqOa/leaLvue/kuiktuilsuS4nuS5mOWDp+WLneWNh+aJv+aYh+e5qeighemZnuS+jeWMmeWYtuWni+WqpOWwuOWxjuWxjeW4guW8keaBg+aWveaYr+aZguaevuaftOeMnOefouekuue/heiSlOiTjeimluippuipqeiroeixleixuuWftOWvlOW8j+aBr+aLreakjeaulua5nOeGhOevkuidleitmOi7vumjn+mjvuS8uOS+geS/oeWRu+WooOWuuOaEvOaWsOaZqOeHvOeUs+elnue0s+iFjuiHo+iOmOiWquiXjuicg+ioiui6q+i+m++lsei/heWkseWupOWvpuaCieWvqeWwi+W/g+aygVwiXSxcbltcImU0YTFcIixcIu+lsua3seeAi+eUmuiKr+irtuS7gOWNge+ls+mbmeawj+S6nuS/hOWFkuWVnuWopeWzqOaIkeeJmeiKveiOquibvuihmeionemYv+mbhemkk+m0iem1neWgiuWys+W2veW5hOaDoeaEleaPoeaogua4pemEgumNlOmhjumwkOm9t+WuieWyuOaMieaZj+ahiOecvOmbgemejemhlOmun+aWoeisgei7i+mWvOWUteWyqeW3luW6teaal+eZjOiPtOmXh+Wjk+aKvOeLjum0qOS7sOWkruaAj+aYu+aug+enp+m0puWOk+WTgOWfg+W0luaEm+ablua2r+eijeiJvumamOmdhOWOhOaJvOaOlua2sue4iuiFi+mhjVwiXSxcbltcImU1YTFcIixcIuaru+e9jOm2r+m4muS5n+WAu+WGtuWknOaDueaPtuaksOeIuuiAtu+ltOmHjuW8se+lte+ltue0hOiLpeiRr+iSu+iXpei6je+lt+S9r++luO+lueWjpOWtg+aBmeaPmuaUmOaVreaamO+luualiuaoo+a0i+eAgeeFrOeXkueYjeems+epsO+lu+e+iu+lvOilhO+lveiuk+mHgOmZve+lvumkiuWchOW+oeaWvOa8geeYgOempuiqnummremtmum9rOWEhOaGtuaKkeaqjeiHhuWBg+WgsOW9pueEieiogOiruuWtvOiYluS/uuWEvOWatOWlhOaOqea3ueW2qualreWGhuS6iOS9me+lv++mgO+mgeWmgu+mglwiXSxcbltcImU2YTFcIixcIu+mg+atn+axne+mhOeSteeklu+mheiIh+iJheiMuei8v+i9ne+mhumkmO+mh++miO+mieS6pu+miuWfn+W9ueaYk++mi++mjOeWq+e5ueitr++mjemAhumpm+WapeWgp+WnuOWon+WutO+mjuW7tu+mj++mkOaNkOaMu++mkeakveayh+ayv+a2jua2k+a3tea8lO+mkueDn+eEtueFme+mk+eHg+eHle+mlOehj+ehr++mleettee3o++mlue4r++ml+ihjei7n++mmO+mme+mmumJm++mm+mztu+mnO+mne+mnuaChea2he+mn+eGse+moO+moemWseWOre+mou+mo++mpOafk++mpeeCjueEsOeQsOiJtuiLklwiXSxcbltcImU3YTFcIixcIu+mpumWu+mrpem5veabhO+mp+eHgeiRie+mqO+mqeWhi++mqu+mq+W2uOW9se+mrOaYoOaajualueamruawuOazs+a4tua9gea/mueAm+eAr+eFkOeHn+eNsO+mreeRm++mrueTlOebiOepjue6k++mr++msOiLseipoOi/ju+msemNiO+msumcme+ms++mtOS5guWAqu+mteWIiOWPoeabs+axrea/iueMiuedv+epouiKruiXneiYgu+mtuijlOipo+itveixq++mt+mKs++muOmck+mgkOS6lOS8jeS/ieWCsuWNiOWQvuWQs+WXmuWhouWiuuWlp+Wom+WvpOaCn++mueaHiuaVluaXv+aZpOaip+axmua+s1wiXSxcbltcImU4YTFcIixcIueDj+eGrOeNkuetveiciOiqpOmwsum8h+Wxi+ayg+eNhOeOiemIuua6q+eRpeeYn+epqee4leiYiuWFgOWjheaTgeeTrueUleeZsOe/gemClembjemllOa4pueTpueqqeeqquiHpeibmeiduOiom+WpieWujOWum+aioeakgOa1o+eOqeeQk+eQrOeil+e3qee/q+iEmOiFleiOnuixjOmYrumgkeabsOW+gOaXuuaeieaxqueOi+WAreWog+atquefruWkluW1rOW3jeeMpeeVj++muu+mu+WDpeWHueWgr+WkreWmluWnmuWvpe+mvO+mveW2ouaLl+aQluaSk+aTvu+mvuabnO+mv+apiO+ngOeHv+eRpO+ngVwiXSxcbltcImU5YTFcIixcIueqiOeqr+e5h+e5nuiAgOiFsO+nguifr+imgeisoOmBme+ng+mCgOmlkuaFvuassua1tOe4n+ikpei+seS/keWCreWGl+WLh+Wfh+WiieWuueW6uOaFguamlea2jOa5p+a6tueGlOeRoueUqOeUrOiBs+iMuOiTiei4iumOlOmPnu+nhOS6juS9keWBtuWEquWPiOWPi+WPs+Wuh+Wvk+WwpOaEmuaGguaXtOeJm+eOl+eRgOebguelkOemkeemuee0hue+veiKi+iXleiZnui/gumBh+mDtemHqumahembqOmbqeWLluW9p+aXreaYseagr+eFnOeotumDgemgiuS6ke+nheapkuaunua+kOeGieiAmOiKuOiVk1wiXSxcbltcImVhYTFcIixcIumBi+malembsumfu+iUmumsseS6kOeGiumbhOWFg+WOn+WToeWck+WckuWeo+Wqm+WrhOWvg+aAqOaEv+aPtOayhea0uea5sua6kOeIsOeMv+eRl+iLkeiigei9hemBoO+nhumZoumhmOm0m+aciOi2iumJnuS9jeWBieWDnuWNseWcjeWnlOWogeWwieaFsOaakOa4reeIsueRi+e3r+iDg+iQjuiRpuiUv+idn+ihm+ikmOisgumBlemfi+mtj+S5s+S+keWEkuWFqu+nh+WUr+WWqeWtuuWupeW5vOW5veW6vuaCoOaDn+aEiOaEieaPhOaUuOacie+niOaflOafmu+niealoealouayuea0p++niua4uO+ni1wiXSxcbltcImViYTFcIixcIua/oeeMtueMt++njOeRnOeUse+njeeZku+nju+nj+e2reiHvuiQuOijleiqmOirm+irrei4sOi5gumBiumAvumBuumFiemHiemNru+nkO+nkeWgie+nkuavk+iCieiCsu+nk++nlOWFgeWlq+Wwue+nle+nlua9pOeOp+iDpOi0h++nl+mIl+mWj++nmO+nme+nmu+nm+iBv+aIjueAnOe1qOieje+nnOWeoOaBqeaFh+aut+iqvumKgOmaseS5meWQn+a3q+iUremZsOmfs+mjruaPluazo+mCkeWHneaHieiGuum3ueS+neWAmuWEgOWunOaEj+aHv+aTrOakheavheeWkeefo+e+qeiJpOiWj+ifu+iho+iqvFwiXSxcbltcImVjYTFcIixcIuitsOmGq+S6jOS7peS8iu+nne+nnuWkt+WnqO+nn+W3suW8m+W9m+aAoe+noO+noe+nou+no+eIvuePpe+npOeVsOeXje+npeenu++npuiAjOiAs+iChOiLoeiNke+np++nqOiyveiys+mCh++nqe+nqumjtOmkjO+nq++nrOeAt+ebiue/iue/jOe/vOismuS6uuS7geWIg+WNsO+nreWSveWboOWnu+WvheW8leW/jea5ru+nru+nr+e1quiMte+nsOiak+iqje+nsemdremdt++nsu+ns+S4gOS9muS9vuWjueaXpea6oumAuOmOsOmmueS7u+WjrOWmiuWnmeaBge+ntO+nteeolO+ntuiNj+izg+WFpeWNhFwiXSxcbltcImVkYTFcIixcIu+nt++nuO+nueS7jeWJqeWtleiKv+S7lOWIuuWSqOWnieWnv+WtkOWtl+WtnOaBo+aFiOa7i+eCmeeFrueOhueTt+eWteejgee0q+iAheiHquiMqOiUl+iXieirruizh+mbjOS9nOWLuuWavOaWq+aYqOeBvOeCuOeItee2veiKjemFjOmbgOm1suWtseajp+aumOa9uuebnuWykeaaq+a9m+eutOewquigtumbnOS4iOS7l+WMoOWgtOWiu+Wjr+WlrOWwh+W4s+W6hOW8teaOjOaasuadluaon+aqo+asjOa8v+eJhu+nuueNkOeSi+eroOeyp+iFuOiHn+iHp+iOiuiRrOiUo+iWlOiXj+ijnei0k+mGrOmVt1wiXSxcbltcImVlYTFcIixcIumanOWGjeWTieWcqOWusOaJjeadkOagveaik+a4vea7k+eBvee4oeijgeiyoei8iem9i+m9jueIreeuj+irjemMmuS9h+S9juWEsuWSgOWnkOW6leaKteadtealruaol+ayrua4mueLmeeMqueWveeuuOe0teiLp+iPueiRl+iXt+ipm+iyr+i6h+mAmemCuOmbjum9n+WLo+WQiuWroeWvguaRmOaVtea7tOeLhO+nu+eahOepjeesm+exjee4vue/n+iNu+isq+iziui1pOi3oei5n+i/qui/uemBqemPkeS9g+S9uuWCs+WFqOWFuOWJjeWJquWhoeWhvOWloOWwiOWxleW7m+aCm+aIsOagk+auv+awiOa+sVwiXSxcbltcImVmYTFcIixcIueFjueQoOeUsOeUuOeVkeeZsuetjOeui+eureevhue6j+iprui8vui9iemIv+mKk+mMoumQq+mbu+mhmumhq+mknuWIh+aIquaKmOa1meeZpOeriuevgOe1tuWNoOWyvuW6l+a8uOeCueeymOmckemujum7nuaOpeaRuuidtuS4geS6leS6reWBnOWBteWRiOWng+WumuW5gOW6reW7t+W+geaDheaMuuaUv+aVtOaXjOaZtuaZuOafvualqOaqieato+axgOa3gOa3qOa4n+a5nueAnueCoeeOjuePveeUuuedm+eih+emjueoi+epveeyvue2juiJh+ioguirquiynumEremFiumHmOmJpumLjOmMoOmchumdllwiXSxcbltcImYwYTFcIixcIumdnOmggum8juWItuWKkeWVvOWgpOW4neW8n+aCjOaPkOair+a/n+elreesrOiHjeiWuuijveiruOi5hOmGjemZpOmam+mcvemhjOm9iuS/juWFhuWHi+WKqeWYsuW8lOW9q+aOquaTjeaXqeaZgeabuuabueacneaineajl+anvea8lea9rueFp+eHpeeIqueSquecuuelluelmuenn+eooOeqleeyl+ezn+e1hOe5sOiCh+iXu+iapOiplOiqv+i2mei6gemAoOmBremHo+mYu+mblemzpeaXj+ewh+i2s+mPg+WtmOWwiuWNkuaLmeeMneWAp+Wul+W+nuaCsOaFq+ajlea3meeQrueorue1gue2nOe4seiFq1wiXSxcbltcImYxYTFcIixcIui4qui4temNvumQmOS9kOWdkOW3puW6p+aMq+e9quS4u+S9j+S+j+WBmuWnneiDhOWRquWRqOWXvuWlj+WumeW3nuW7muaZneacseafseagquazqOa0sua5iua+jeeCt+ePoOeWh+exjOe0gue0rOe2ouiIn+ibm+iou+iqhei1sOi6iui8s+mAsemFjumFkumRhOmnkOerueeypeS/iuWEgeWHhuWfiOWvr+Wzu+aZmeaovea1mua6lua/rOeEjOeVr+ero+igoumAoemBtembi+mnv+iMgeS4reS7suihhumHjeWNvearm+alq+axgeiRuuWinuaGjuabvuaLr+eDneeUkeeXh+e5kuiSuOitiei0iOS5i+WPqlwiXSxcbltcImYyYTFcIixcIuWSq+WcsOWdgOW/l+aMgeaMh+aRr+aUr+aXqOaZuuaeneaes+atouaxoOaymua8rOefpeegpeelieell+e0meiCouiEguiHs+iKneiKt+icmOiqjO+nvOi0hOi2vumBsuebtOeomeeot+e5lOiBt+WUh+WXlOWhteaMr+aQouaZieaZi+ahreamm+auhOa0pea6seePjeeRqOeSoeeVm+eWueeboeecnueei+enpue4iee4neiHu+iUr+iil+iouuizkei7q+i+sOmAsumOremZo+mZs+mch+S+hOWPseWnquWrieW4meahjueThueWvuenqeeqkuiGo+ibreizqui3jOi/reaWn+acle+nveWft+a9l+e3nei8r1wiXSxcbltcImYzYTFcIixcIumPtumbhuW+teaHsua+hOS4lOS+mOWAn+WPieWXn+W1r+W3ruasoeatpOeji+eumu+nvui5iei7iumBruaNieaQvuedgOeqhOmMr+mRv+m9quaSsOa+r+eHpueSqOeTmuerhOewkue6gueysue6mOiumui0iumRvemkkOmljOWIueWvn+aTpuacree0ruWDreWPg+WhueaFmOaFmeaHuuaWrOermeiukuiuluWAieWAoeWJteWUseWovOW7oOW9sOaEtOaVnuaYjOaYtuaaouanjea7hOa8sueMlueYoeeqk+iEueiJmeiPluiSvOWCteWfsOWvgOWvqOW9qeaOoeegpue2teiPnOiUoemHh+mHteWGiuafteetllwiXSxcbltcImY0YTFcIixcIuiyrOWHhOWmu+aCveiZleWAnO+nv+WJlOWwuuaFveaImuaLk+aTsuaWpea7jOeYoOiEiui5oOmZn+mau+S7n+WNg+WWmOWkqeW3neaTheaziea3uueOlOepv+iIm+iWpuizpOi4kOmBt+mHp+mXoemYoemfhuWHuOWTsuWWhuW+ueaSpOa+iOe2tOi8n+i9jemQteWDieWwluayvua3u+eUm+eeu+ewveexpOipueirguWgnuWmvuW4luaNt+eJkueWiuedq+irnOiyvOi8kuW7s+aZtOa3uOiBveiPgeiri+mdkemvlu+ogOWJg+abv+a2lea7r+e3oOirpumArumBnumrlOWIneWJv+WTqOaGlOaKhOaLm+aiolwiXSxcbltcImY1YTFcIixcIuakkualmuaoteeCkueEpuehneekgeekjuenkueojeiCluiJuOiLleiNieiVieiygui2hemFoumGi+mGruS/g+WbkeeHreefl+icgOinuOWvuOW/luadkemCqOWPouWhmuWvteaCpOaGgeaRoOe4veiBsOiUpemKg+aSruWCrOW0lOacgOWinOaKveaOqOakjualuOaonua5q+eauueni+iKu+iQqeirj+i2qOi/vemEkumFi+mGnOmMkOmMmOmOmumbm+motumwjeS4keeVnOelneeruuetkeeviee4ruiThOi5mei5tOi7uOmAkOaYpeakv+eRg+WHuuacrum7nOWFheW/oOayluifsuihneiht+aCtOiGteiQg1wiXSxcbltcImY2YTFcIixcIui0heWPluWQueWYtOWotuWwseeCiue/oOiBmuiEhuiHrei2o+mGiempn+m3suWBtOS7hOWOoOaDu+a4rOWxpOS+iOWApOWXpOWzmeW5n+aBpeailOayu+a3hOeGvueXlOeXtOeZoeeomuepiee3h+e3u+e9ruiHtOiaqei8nOmbiemms+m9kuWJh+WLhemjreimquS4g+afkua8huS+teWvouaeleayiOa1uOeQm+egp+mHnemNvOifhOenpOeoseW/q+S7luWSpOWUvuWiruWmpeaDsOaJk+aLluactualleiItemZgOmmsemnneWArOWNk+WVhOWdvO+ogeaJmO+oguaTouaZq+afnea/gea/r+eQoueQuOiol1wiXSxcbltcImY3YTFcIixcIumQuOWRkeWYhuWdpuW9iOaGmuatjueBmOeCree2u+iqleWlquiEq+aOoueciOiAveiyquWhlOaQreamu+WuleW4kea5r++og+iVqeWFjOWPsOWkquaAoOaFi+auhuaxsOazsOesnuiDjuiLlOi3humCsOmise+ohOaTh+a+pOaSkeaUhOWFjuWQkOWcn+iojuaFn+ahtu+oheeXm+etkue1semAmuWghuanjOiFv+ikqumAgOmgueWBuOWll+WmrOaKlemAj+msquaFneeJuemXluWdoeWphuW3tOaKiuaSreaTuuadt+azoua0vueIrOeQtuegtOe9t+iKrei3m+mgl+WIpOWdguadv+eJiOeTo+iyqei+pumIkVwiXSxcbltcImY4YTFcIixcIumYquWFq+WPreaNjOS9qeWUhOaCluaVl+aym+a1v+eJjOeLveeol+imh+iyneW9rea+jueDueiGqOaEjuS+v+WBj+aJgeeJh+evh+e3qOe/qemBjemeremomeiytuWdquW5s+aesOiQjeipleWQoOWsluW5o+W7ouW8iuaWg+iCuuiUvemWiemZm+S9iOWMheWMjeWMj+WShuWTuuWcg+W4g+aAluaKm+aKseaNle+ohuazoea1pueWseegsuiDnuiEr+iLnuiRoeiSsuiijeikkumAi+mLqumjvemukeW5heaatOabneeAkeeIhu+oh+S/teWJveW9quaFk+adk+aomea8gueTouelqOihqOixuemjh+mjhOmpg1wiXSxcbltcImY5YTFcIixcIuWTgeeon+alk+irt+ixiumiqOmmruW9vOaKq+eWsuearuiiq+mBv+mZguWMueW8vOW/heazjOePjOeVoueWi+ethuiLvummneS5j+mAvOS4i+S9leWOpuWkj+W7iOaYsOays+eRleiNt+idpuizgOmBkOmcnumwleWjkeWtuOiZkOislOm2tOWvkuaBqOaCjeaXseaxl+a8oua+o+eAmue9lee/sOmWkemWkumZkOmfk+WJsui9hOWHveWQq+WSuOWVo+WWiuaqu+a2tee3mOiJpumKnOmZt+m5ueWQiOWTiOebkuibpOmWpOmXlOmZnOS6ouS8ieWnruWrpuW3t+aBkuaKl+adreahgeayhua4r+e8uOiCm+iIqlwiXSxcbltcImZhYTFcIixcIu+oiO+oiemgheS6peWBleWSs+Wek+WlmuWtqeWus+aHiOalt+a1t+eAo+ifueino+ipsuirp+mCgumnremquOWKvuaguOWAluW5uOadj+iNh+ihjOS6q+WQkeWaruePpumElemfv+mkiemll+mmmeWZk+Win+iZm+ioseaGsuartueNu+i7kuath+maqumpl+WlleeIgOi1q+mdqeS/lOWztOW8puaHuOaZm+azq+eCq+eOhOeOueePvuecqeedjee1g+e1oue4o+iIt+ihku+oiuizoumJiemhr+WtkeeptOihgOmggeWrjOS/oOWNlOWkvuWzveaMvua1ueeLueiEheiEh+iOoumLj+mgsOS6qOWFhOWIkeWei1wiXSxcbltcImZiYTFcIixcIuW9ouazgua7jueAheeBkOeCr+eGkuePqeeRqeiNiuieouihoemAiOmCoumOo+mmqOWFruW9l+aDoOaFp+aas+iVmei5iumGr+mei+S5juS6kuWRvOWjleWjuuWlveWyteW8p+aItuaJiOaYiuaZp+avq+a1qea3j+a5lua7uOa+lOa/oOa/qeeBneeLkOeQpeeRmueToOeak+elnOeziue4nuiDoeiKpuiRq+iSv+iZjuiZn+idtOitt+ixqumOrOmggOmhpeaDkeaIlumFt+WpmuaYj+a3t+a4vueQv+mtguW/veaDmuesj+WThOW8mOaxnuazk+a0queDmOe0heiZueiojOm0u+WMluWSjOWsheaouueBq+eVtVwiXSxcbltcImZjYTFcIixcIuemjeemvuiKseiPr+ipseitgeiyqOmdtO+oi+aTtOaUq+eiuueiu+epq+S4uOWWmuWlkOWupuW5u+aCo+aPm+atoeaZpeahk+a4meeFpeeSsOe0iOmChOmpqemwpea0u+a7keeMvuixgemXiuWHsOW5jOW+qOaBjeaDtuaEsOaFjOaZg+aZhOampeazgea5n+a7iea9oueFjOeSnOeah+evgeewp+iNkuidl+mBkemajem7g+WMr+WbnuW7u+W+iuaBouaClOaHt+aZpuacg+aqnOa3rua+rueBsOeNque5quiGvuiMtOiblOiqqOizhOWKg+eNsuWuluapq+mQhOWTruWahuWtneaViOaWheabieain+a2jea3hlwiXSxcbltcImZkYTFcIixcIueIu+iCtOmFtempjeS+r+WAmeWOmuWQjuWQvOWWieWXheW4v+W+jOacveeFpuePnemAheWLm+WLs+WhpOWjjueEhOeGj+eHu+iWsOiok+aaiOiWqOWWp+aahOeFiuiQseWNieWWmeavgeW9meW+veaPruaaieeFh+irsei8nem6vuS8keaQuueDi+eVpuiZp+aBpOitjum3uOWFh+WHtuWMiOa0tuiDuOm7keaYleaso+eCmOeXleWQg+Wxuee0h+ioluasoOasveathuWQuOaBsOa0vee/leiIiOWDluWHnuWWnOWZq+WbjeWnrOWsieW4jOaGmeaGmOaIseaZnuabpueGmeeGueeGuueKp+emp+eogOe+suipsFwiXVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuW1wiMFwiLFwiXFx1MDAwMFwiLDEyN10sXG5bXCJhMTQwXCIsXCLjgIDvvIzjgIHjgILvvI7igKfvvJvvvJrvvJ/vvIHvuLDigKbigKXvuZDvuZHvuZLCt++5lO+5le+5lu+5l++9nOKAk++4seKAlO+4s+KVtO+4tO+5j++8iO+8ie+4te+4tu+9m++9ne+4t++4uOOAlOOAle+4ue+4uuOAkOOAke+4u++4vOOAiuOAi++4ve+4vuOAiOOAie+4v++5gOOAjOOAje+5ge+5guOAjuOAj++5g++5hO+5me+5mlwiXSxcbltcImExYTFcIixcIu+5m++5nO+5ne+5nuKAmOKAmeKAnOKAneOAneOAnuKAteKAsu+8g++8hu+8iuKAu8Kn44CD4peL4peP4paz4pay4peO4piG4piF4peH4peG4pah4pag4pa94pa844qj4oSFwq/vv6PvvL/Lje+5ie+5iu+5je+5ju+5i++5jO+5n++5oO+5oe+8i++8jcOXw7fCseKImu+8nO+8nu+8neKJpuKJp+KJoOKInuKJkuKJoe+5olwiLDQsXCLvvZ7iiKniiKriiqXiiKDiiJ/iir/jj5Ljj5HiiKviiK7iiLXiiLTimYDimYLiipXiipnihpHihpPihpDihpLihpbihpfihpnihpjiiKXiiKPvvI9cIl0sXG5bXCJhMjQwXCIsXCLvvLziiJXvuajvvITvv6XjgJLvv6Dvv6HvvIXvvKDihIPihInvuanvuarvuavjj5Xjjpzjjp3jjp7jj47jjqHjjo7jjo/jj4TCsOWFmeWFm+WFnuWFneWFoeWFo+WXp+eTqeezjuKWgVwiLDcsXCLilo/ilo7ilo3ilozilovilorilonilLzilLTilKzilKTilJzilpTilIDilILilpXilIzilJDilJTilJjila1cIl0sXG5bXCJhMmExXCIsXCLila7ilbDila/ilZDilZ7ilarilaHil6Lil6Pil6Xil6TilbHilbLilbPvvJBcIiw5LFwi4oWgXCIsOSxcIuOAoVwiLDgsXCLljYHljYTljYXvvKFcIiwyNSxcIu+9gVwiLDIxXSxcbltcImEzNDBcIixcIu+9l++9mO+9me+9ms6RXCIsMTYsXCLOo1wiLDYsXCLOsVwiLDE2LFwiz4NcIiw2LFwi44SFXCIsMTBdLFxuW1wiYTNhMVwiLFwi44SQXCIsMjUsXCLLmcuJy4rLh8uLXCJdLFxuW1wiYTNlMVwiLFwi4oKsXCJdLFxuW1wiYTQ0MFwiLFwi5LiA5LmZ5LiB5LiD5LmD5Lmd5LqG5LqM5Lq65YS/5YWl5YWr5Yeg5YiA5YiB5Yqb5YyV5Y2B5Y2c5Y+I5LiJ5LiL5LiI5LiK5Lir5Li45Yeh5LmF5LmI5Lmf5Lme5LqO5Lqh5YWA5YiD5Yu65Y2D5Y+J5Y+j5Zyf5aOr5aSV5aSn5aWz5a2Q5a2R5a2T5a+45bCP5bCi5bC45bGx5bed5bel5bex5bey5bez5be+5bmy5bu+5byL5byT5omNXCJdLFxuW1wiYTRhMVwiLFwi5LiR5LiQ5LiN5Lit5Liw5Li55LmL5bC55LqI5LqR5LqV5LqS5LqU5Lqi5LuB5LuA5LuD5LuG5LuH5LuN5LuK5LuL5LuE5YWD5YWB5YWn5YWt5YWu5YWs5YaX5Ye25YiG5YiH5YiI5Yu75Yu+5Yu/5YyW5Yy55Y2I5Y2H5Y2F5Y2e5Y6E5Y+L5Y+K5Y+N5aOs5aSp5aSr5aSq5aSt5a2U5bCR5bCk5bC65bGv5be05bm75bu/5byU5byV5b+D5oiI5oi25omL5omO5pSv5paH5paX5pak5pa55pel5puw5pyI5pyo5qyg5q2i5q255q+L5q+U5q+b5rCP5rC054Gr54iq54i254i754mH54mZ54mb54qs546L5LiZXCJdLFxuW1wiYTU0MFwiLFwi5LiW5LiV5LiU5LiY5Li75LmN5LmP5LmO5Lul5LuY5LuU5LuV5LuW5LuX5Luj5Luk5LuZ5Lue5YWF5YWE5YaJ5YaK5Yas5Ye55Ye65Ye45YiK5Yqg5Yqf5YyF5YyG5YyX5Yyd5Luf5Y2K5Y2J5Y2h5Y2g5Y2v5Y2u5Y675Y+v5Y+k5Y+z5Y+s5Y+u5Y+p5Y+o5Y+85Y+45Y+15Y+r5Y+m5Y+q5Y+y5Y+x5Y+w5Y+l5Y+t5Y+75Zub5Zua5aSWXCJdLFxuW1wiYTVhMVwiLFwi5aSu5aSx5aW05aW25a2V5a6D5bC85beo5ben5bem5biC5biD5bmz5bm85byB5byY5byX5b+F5oiK5omT5omU5omS5omR5pal5pem5pyu5pys5pyq5pyr5pyt5q2j5q+N5rCR5rCQ5rC45rGB5rGA5rC+54qv546E546J55Oc55Om55SY55Sf55So55Sp55Sw55Sx55Sy55Sz55aL55m955qu55q/55uu55+b55+i55+z56S656a+56m056uL5Lie5Lif5LmS5LmT5Lmp5LqZ5Lqk5Lqm5Lql5Lu/5LyJ5LyZ5LyK5LyV5LyN5LyQ5LyR5LyP5Luy5Lu25Lu75Luw5Luz5Lu95LyB5LyL5YWJ5YWH5YWG5YWI5YWoXCJdLFxuW1wiYTY0MFwiLFwi5YWx5YaN5Yaw5YiX5YiR5YiS5YiO5YiW5Yqj5YyI5Yyh5Yyg5Y2w5Y2x5ZCJ5ZCP5ZCM5ZCK5ZCQ5ZCB5ZCL5ZCE5ZCR5ZCN5ZCI5ZCD5ZCO5ZCG5ZCS5Zug5Zue5Zud5Zyz5Zyw5Zyo5Zyt5Zys5Zyv5Zyp5aSZ5aSa5aS35aS45aaE5aW45aaD5aW95aW55aaC5aaB5a2X5a2Y5a6H5a6I5a6F5a6J5a+65bCW5bG55bee5biG5bm25bm0XCJdLFxuW1wiYTZhMVwiLFwi5byP5byb5b+Z5b+W5oiO5oiM5oiN5oiQ5omj5omb5omY5pS25pep5peo5pes5pet5puy5puz5pyJ5py95py05pyx5py15qyh5q2k5q275rCW5rGd5rGX5rGZ5rGf5rGg5rGQ5rGV5rGh5rGb5rGN5rGO54Gw54mf54md55m+56u557Gz57O457y2576K57696ICB6ICD6ICM6ICS6ICz6IG/6IKJ6IKL6IKM6Iej6Ieq6Iez6Ie86IiM6Iib6Iif6Imu6Imy6Im+6Jmr6KGA6KGM6KGj6KW/6Zih5Liy5Lqo5L2N5L2P5L2H5L2X5L2e5Ly05L2b5L2V5Lyw5L2Q5L2R5Ly95Ly65Ly45L2D5L2U5Ly85L2G5L2jXCJdLFxuW1wiYTc0MFwiLFwi5L2c5L2g5Lyv5L2O5Ly25L2Z5L2d5L2I5L2a5YWM5YWL5YWN5YW15Ya25Ya35Yil5Yik5Yip5Yiq5Yio5Yqr5Yqp5Yqq5Yqs5Yyj5Y2z5Y215ZCd5ZCt5ZCe5ZC+5ZCm5ZGO5ZCn5ZGG5ZGD5ZCz5ZGI5ZGC5ZCb5ZCp5ZGK5ZC55ZC75ZC45ZCu5ZC15ZC25ZCg5ZC85ZGA5ZCx5ZCr5ZCf5ZCs5Zuq5Zuw5Zuk5Zur5Z2K5Z2R5Z2A5Z2NXCJdLFxuW1wiYTdhMVwiLFwi5Z2H5Z2O5Zy+5Z2Q5Z2P5Zy75aOv5aS+5aad5aaS5aao5aae5aaj5aaZ5aaW5aaN5aak5aaT5aaK5aal5a2d5a2c5a2a5a2b5a6M5a6L5a6P5bCs5bGA5bGB5bC/5bC+5bKQ5bKR5bKU5bKM5ber5biM5bqP5bqH5bqK5bu35byE5byf5b2k5b2i5b235b255b+Y5b+M5b+X5b+N5b+x5b+r5b+45b+q5oiS5oiR5oqE5oqX5oqW5oqA5om25oqJ5omt5oqK5om85om+5om55omz5oqS5omv5oqY5omu5oqV5oqT5oqR5oqG5pS55pS75pS45pex5pu05p2f5p2O5p2P5p2Q5p2R5p2c5p2W5p2e5p2J5p2G5p2gXCJdLFxuW1wiYTg0MFwiLFwi5p2T5p2X5q2l5q+P5rGC5rGe5rKZ5rKB5rKI5rKJ5rKF5rKb5rGq5rG65rKQ5rGw5rKM5rGo5rKW5rKS5rG95rKD5rGy5rG+5rG05rKG5rG25rKN5rKU5rKY5rKC54G254G854G954G454mi54mh54mg54uE54uC546W55Ss55Sr55S355S455qC55uv55+j56eB56eA56a/56m257O7572V6IKW6IKT6IKd6IKY6IKb6IKa6IKy6Imv6IqSXCJdLFxuW1wiYThhMVwiLFwi6IqL6IqN6KaL6KeS6KiA6LC36LGG6LGV6LKd6LWk6LWw6Laz6Lqr6LuK6L6b6L6w6L+C6L+G6L+F6L+E5beh6YKR6YKi6YKq6YKm6YKj6YWJ6YeG6YeM6Ziy6Ziu6Zix6Ziq6Zis5Lim5LmW5Lmz5LqL5Lqb5Lqe5Lqr5Lqs5L2v5L6d5L6N5L2z5L2/5L2s5L6b5L6L5L6G5L6D5L2w5L215L6I5L2p5L275L6W5L2+5L6P5L6R5L265YWU5YWS5YWV5YWp5YW35YW25YW45Ya95Ye95Yi75Yi45Yi35Yi65Yiw5Yiu5Yi25YmB5Yq+5Yq75Y2S5Y2U5Y2T5Y2R5Y2m5Y235Y245Y255Y+W5Y+U5Y+X5ZGz5ZG1XCJdLFxuW1wiYTk0MFwiLFwi5ZKW5ZG45ZKV5ZKA5ZG75ZG35ZKE5ZKS5ZKG5ZG85ZKQ5ZGx5ZG25ZKM5ZKa5ZGi5ZGo5ZKL5ZG95ZKO5Zu65Z6D5Z235Z2q5Z2p5Z2h5Z2m5Z2k5Z285aSc5aWJ5aWH5aWI5aWE5aWU5aa+5aa75aeU5aa55aau5aeR5aeG5aeQ5aeN5aeL5aeT5aeK5aav5aaz5aeS5aeF5a2f5a2k5a2j5a6X5a6a5a6Y5a6c5a6Z5a6b5bCa5bGI5bGFXCJdLFxuW1wiYTlhMVwiLFwi5bGG5bK35bKh5bK45bKp5bKr5bKx5bKz5biY5bia5biW5biV5bib5biR5bm45bqa5bqX5bqc5bqV5bqW5bu25bym5byn5byp5b6A5b6B5b2/5b285b+d5b+g5b+95b+15b+/5oCP5oCU5oCv5oC15oCW5oCq5oCV5oCh5oCn5oCp5oCr5oCb5oiW5oiV5oi/5oi+5omA5om/5ouJ5ouM5ouE5oq/5ouC5oq55ouS5oub5oqr5ouT5ouU5ouL5ouI5oqo5oq95oq85ouQ5ouZ5ouH5ouN5oq15oua5oqx5ouY5ouW5ouX5ouG5oqs5ouO5pS+5pan5pa85pe65piU5piT5piM5piG5piC5piO5piA5piP5piV5piKXCJdLFxuW1wiYWE0MFwiLFwi5piH5pyN5pyL5p2t5p6L5p6V5p2x5p6c5p2z5p235p6H5p6d5p6X5p2v5p2w5p2/5p6J5p2+5p6Q5p215p6a5p6T5p285p2q5p2y5qyj5q2m5q2n5q2/5rCT5rCb5rOj5rOo5rOz5rKx5rOM5rOl5rKz5rK95rK+5rK85rOi5rKr5rOV5rOT5rK45rOE5rK55rOB5rKu5rOX5rOF5rOx5rK/5rK75rOh5rOb5rOK5rKs5rOv5rOc5rOW5rOgXCJdLFxuW1wiYWFhMVwiLFwi54KV54KO54KS54KK54KZ54is54it54i454mI54mn54mp54uA54uO54uZ54uX54uQ546p546o546f546r546l55S955ad55aZ55aa55qE55uC55uy55u055+l55+956S+56WA56WB56eJ56eI56m656m556u657O+572U576M576L6ICF6IK66IKl6IKi6IKx6IKh6IKr6IKp6IK06IKq6IKv6Iel6Ie+6IiN6Iqz6Iqd6IqZ6Iqt6Iq96Iqf6Iq56Iqx6Iqs6Iql6Iqv6Iq46Iqj6Iqw6Iq+6Iq36JmO6Jmx5Yid6KGo6LuL6L+O6L+U6L+R6YK16YK46YKx6YK26YeH6YeR6ZW36ZaA6Zic6ZmA6Zi/6Zi76ZmEXCJdLFxuW1wiYWI0MFwiLFwi6ZmC6Zq56Zuo6Z2S6Z2e5Lqf5Lqt5Lqu5L+h5L615L6v5L6/5L+g5L+R5L+P5L+d5L+D5L625L+Y5L+f5L+K5L+X5L6u5L+Q5L+E5L+C5L+a5L+O5L+e5L635YWX5YaS5YaR5Yag5YmO5YmD5YmK5YmN5YmM5YmL5YmH5YuH5YuJ5YuD5YuB5YyN5Y2X5Y275Y6a5Y+b5ZKs5ZOA5ZKo5ZOO5ZOJ5ZK45ZKm5ZKz5ZOH5ZOC5ZK95ZKq5ZOBXCJdLFxuW1wiYWJhMVwiLFwi5ZOE5ZOI5ZKv5ZKr5ZKx5ZK75ZKp5ZKn5ZK/5Zu/5Z6C5Z6L5Z6g5Z6j5Z6i5Z+O5Z6u5Z6T5aWV5aWR5aWP5aWO5aWQ5aec5aeY5ae/5aej5aeo5aiD5ael5aeq5aea5aem5aiB5ae75a2p5a6j5a6m5a6k5a6i5a6l5bCB5bGO5bGP5bGN5bGL5bOZ5bOS5be35bid5bil5bif5bm95bqg5bqm5bu65byI5byt5b2l5b6I5b6F5b6K5b6L5b6H5b6M5b6J5oCS5oCd5oCg5oCl5oCO5oCo5oGN5oGw5oGo5oGi5oGG5oGD5oGs5oGr5oGq5oGk5omB5ouc5oyW5oyJ5ou85out5oyB5ouu5ou95oyH5oux5ou3XCJdLFxuW1wiYWM0MFwiLFwi5ouv5ous5ou+5ou05oyR5oyC5pS/5pWF5par5pa95pei5pil5pit5pig5pin5piv5pif5pio5pix5pik5pu35p+/5p+T5p+x5p+U5p+Q5p+s5p625p6v5p+15p+p5p+v5p+E5p+R5p605p+a5p+l5p645p+P5p+e5p+z5p6w5p+Z5p+i5p+d5p+S5q2q5q6D5q6G5q615q+S5q+X5rCf5rOJ5rSL5rSy5rSq5rWB5rSl5rSM5rSx5rSe5rSXXCJdLFxuW1wiYWNhMVwiLFwi5rS75rS95rS+5rS25rSb5rO15rS55rSn5rS45rSp5rSu5rS15rSO5rSr54Kr54K654Kz54Ks54Kv54Kt54K454Ku54Kk54iw54my54mv54m054up54ug54uh546354+K5467546y54+N54+A546z55Sa55St55WP55WM55WO55WL55ar55ak55al55ai55aj55m455qG55qH55qI55uI55uG55uD55uF55yB55u555u455yJ55yL55u+55u855yH55+c56CC56CU56CM56CN56WG56WJ56WI56WH56a556a656eR56eS56eL56m/56qB56u/56u957G957SC57SF57SA57SJ57SH57SE57SG57y4576O576/6ICEXCJdLFxuW1wiYWQ0MFwiLFwi6ICQ6ICN6ICR6IC26IOW6IOl6IOa6IOD6IOE6IOM6IOh6IOb6IOO6IOe6IOk6IOd6Ie06Iii6Iun6IyD6IyF6Iuj6Iub6Ium6IyE6Iul6IyC6IyJ6IuS6IuX6Iux6IyB6Iuc6IuU6IuR6Iue6IuT6Iuf6Iuv6IyG6JmQ6Jm56Jm76Jm66KGN6KGr6KaB6KeU6KiI6KiC6KiD6LKe6LKg6LW06LWz6La06LuN6LuM6L+w6L+m6L+i6L+q6L+lXCJdLFxuW1wiYWRhMVwiLFwi6L+t6L+r6L+k6L+o6YOK6YOO6YOB6YOD6YWL6YWK6YeN6ZaC6ZmQ6ZmL6ZmM6ZmN6Z2i6Z2p6Z+L6Z+t6Z+z6aCB6aKo6aOb6aOf6aaW6aaZ5LmY5Lqz5YCM5YCN5YCj5L+v5YCm5YCl5L+45YCp5YCW5YCG5YC85YCf5YCa5YCS5YCR5L+65YCA5YCU5YCo5L+x5YCh5YCL5YCZ5YCY5L+z5L+u5YCt5YCq5L++5YCr5YCJ5YW85Yak5Yal5Yai5YeN5YeM5YeG5YeL5YmW5Ymc5YmU5Ymb5Ymd5Yyq5Y2/5Y6f5Y6d5Y+f5ZOo5ZSQ5ZSB5ZS35ZO85ZOl5ZOy5ZSG5ZO65ZSU5ZOp5ZOt5ZOh5ZSJ5ZOu5ZOqXCJdLFxuW1wiYWU0MFwiLFwi5ZOm5ZSn5ZSH5ZO95ZSP5ZyD5ZyE5Z+C5Z+U5Z+L5Z+D5aCJ5aSP5aWX5aWY5aWa5aiR5aiY5aic5aif5aib5aiT5aes5aig5aij5aip5ail5aiM5aiJ5a2r5bGY5a6w5a6z5a625a605a6u5a615a655a645bCE5bGR5bGV5bGQ5bOt5bO95bO75bOq5bOo5bOw5bO25bSB5bO05beu5bit5bir5bqr5bqt5bqn5byx5b6S5b6R5b6Q5oGZXCJdLFxuW1wiYWVhMVwiLFwi5oGj5oGl5oGQ5oGV5oGt5oGp5oGv5oKE5oKf5oKa5oKN5oKU5oKM5oKF5oKW5omH5ouz5oyI5ou/5o2O5oy+5oyv5o2V5o2C5o2G5o2P5o2J5oy65o2Q5oy95oyq5oyr5oyo5o2N5o2M5pWI5pWJ5paZ5peB5peF5pmC5pmJ5pmP5pmD5pmS5pmM5pmF5pmB5pu45pyU5pyV5pyX5qCh5qC45qGI5qGG5qGT5qC55qGC5qGU5qCp5qKz5qCX5qGM5qGR5qC95p+05qGQ5qGA5qC85qGD5qCq5qGF5qCT5qCY5qGB5q6K5q6J5q635rCj5rCn5rCo5rCm5rCk5rOw5rWq5raV5raI5raH5rWm5rW45rW35rWZ5raTXCJdLFxuW1wiYWY0MFwiLFwi5rWs5raJ5rWu5rWa5rW05rWp5raM5raK5rW55raF5rWl5raU54OK54OY54Ok54OZ54OI54OP54i554m554u854u554u954u454u3546G54+t55CJ54+u54+g54+q54+e55WU55Wd55Wc55Wa55WZ55a+55eF55eH55ay55az55a955a855a555eC55a455qL55qw55uK55uN55uO55yp55yf55yg55yo55+p56Cw56Cn56C456Cd56C056C3XCJdLFxuW1wiYWZhMVwiLFwi56Cl56Ct56Cg56Cf56Cy56WV56WQ56Wg56Wf56WW56We56Wd56WX56Wa56ek56ej56en56ef56em56ep56eY56qE56qI56uZ56yG56yR57KJ57Sh57SX57SL57SK57Sg57Si57SU57SQ57SV57Sa57Sc57SN57SZ57Sb57y6572f576U57+F57+B6ICG6ICY6ICV6ICZ6ICX6IC96IC/6IOx6ISC6IOw6ISF6IOt6IO06ISG6IO46IOz6ISI6IO96ISK6IO86IOv6Iet6Ies6IiA6IiQ6Iiq6Iir6Iio6Iis6Iq76Iyr6I2S6I2U6I2K6Iy46I2Q6I2J6Iy16Iy06I2P6Iyy6Iy56Iy26IyX6I2A6Iyx6Iyo6I2DXCJdLFxuW1wiYjA0MFwiLFwi6JmU6JqK6Jqq6JqT6Jqk6Jqp6JqM6Jqj6Jqc6KGw6KG36KKB6KKC6KG96KG56KiY6KiQ6KiO6KiM6KiV6KiK6KiX6KiT6KiW6KiP6KiR6LGI6LG66LG56LKh6LKi6LW36Lqs6LuS6LuU6LuP6L6x6YCB6YCG6L+36YCA6L+66L+06YCD6L+96YCF6L+46YKV6YOh6YOd6YOi6YWS6YWN6YWM6YeY6Yed6YeX6Yec6YeZ6ZaD6Zmi6Zmj6ZmhXCJdLFxuW1wiYjBhMVwiLFwi6Zmb6Zmd6Zmk6ZmY6Zme6Zq76aOi6aas6aqo6auY6ayl6ayy6ay85Lm+5YG65YG95YGc5YGH5YGD5YGM5YGa5YGJ5YGl5YG25YGO5YGV5YG15YG05YG35YGP5YCP5YGv5YGt5YWc5YaV5Yew5Ymq5Ymv5YuS5YuZ5YuY5YuV5YyQ5YyP5YyZ5Yy/5Y2A5Yy+5Y+D5pu85ZWG5ZWq5ZWm5ZWE5ZWe5ZWh5ZWD5ZWK5ZSx5ZWW5ZWP5ZWV5ZSv5ZWk5ZS45ZSu5ZWc5ZSs5ZWj5ZSz5ZWB5ZWX5ZyI5ZyL5ZyJ5Z+f5aCF5aCK5aCG5Z+g5Z+k5Z+65aCC5aC15Z+35Z+55aSg5aWi5ai25amB5amJ5amm5amq5amAXCJdLFxuW1wiYjE0MFwiLFwi5ai85ami5ama5amG5amK5a2w5a+H5a+F5a+E5a+C5a6/5a+G5bCJ5bCI5bCH5bGg5bGc5bGd5bSH5bSG5bSO5bSb5bSW5bSi5bSR5bSp5bSU5bSZ5bSk5bSn5bSX5bei5bi45bi25biz5bi35bq35bq45bq25bq15bq+5by15by35b2X5b2s5b2p5b2r5b6X5b6Z5b6e5b6Y5b6h5b6g5b6c5oG/5oKj5oKJ5oKg5oKo5oOL5oK05oOm5oK9XCJdLFxuW1wiYjFhMVwiLFwi5oOF5oK75oK15oOc5oK85oOY5oOV5oOG5oOf5oK45oOa5oOH5oia5oib5omI5o6g5o6n5o2y5o6W5o6i5o6l5o235o2n5o6Y5o6q5o2x5o6p5o6J5o6D5o6b5o2r5o6o5o6E5o6I5o6Z5o6h5o6s5o6S5o6P5o6A5o275o2p5o2o5o265pWd5pWW5pWR5pWZ5pWX5ZWf5pWP5pWY5pWV5pWU5pac5pab5pas5peP5peL5peM5peO5pmd5pma5pmk5pmo5pmm5pme5pu55YuX5pyb5qKB5qKv5qKi5qKT5qK15qG/5qG25qKx5qKn5qKX5qKw5qKD5qOE5qKt5qKG5qKF5qKU5qKd5qKo5qKf5qKh5qKC5qyy5q66XCJdLFxuW1wiYjI0MFwiLFwi5q+r5q+s5rCr5raO5ra85rez5reZ5ray5reh5reM5rek5re75re65riF5reH5reL5rav5reR5rau5ree5re55ra45re35re15reF5reS5ria5ra15rea5rer5reY5req5rex5reu5reo5reG5reE5raq5res5ra/5rem54O554SJ54SK54O954Ov54i954m954qB54yc54yb54yW54yT54yZ546H55CF55CK55CD55CG54++55CN55Og55O2XCJdLFxuW1wiYjJhMVwiLFwi55O355Sc55Si55Wl55Wm55Wi55Ww55aP55eU55eV55a155eK55eN55qO55uU55uS55ub55y355y+55y855y255y455y656Gr56GD56GO56Wl56Wo56Wt56e756qS56qV56yg56yo56yb56ys56ym56yZ56ye56yu57KS57KX57KV57WG57WD57Wx57Su57S557S857WA57Sw57Sz57WE57Sv57WC57Sy57Sx57y9576e576a57+M57+O57+S6ICc6IGK6IGG6ISv6ISW6ISj6ISr6ISp6ISw6ISk6IiC6Ii16Ii36Ii26Ii56I6O6I6e6I6Y6I246I6i6I6W6I696I6r6I6S6I6K6I6T6I6J6I6g6I236I276I28XCJdLFxuW1wiYjM0MFwiLFwi6I6G6I6n6JmV5b2q6JuH6JuA6Jq26JuE6Jq16JuG6JuL6Jqx6Jqv6JuJ6KGT6KKe6KKI6KKr6KKS6KKW6KKN6KKL6KaT6KaP6Kiq6Kid6Kij6Kil6Kix6Kit6Kif6Kib6Kii6LGJ6LGa6LKp6LKs6LKr6LKo6LKq6LKn6LWn6LWm6La+6La66Lub6Luf6YCZ6YCN6YCa6YCX6YCj6YCf6YCd6YCQ6YCV6YCe6YCg6YCP6YCi6YCW6YCb6YCUXCJdLFxuW1wiYjNhMVwiLFwi6YOo6YOt6YO96YWX6YeO6Ye16Yem6Yej6Yen6Yet6Yep6ZaJ6Zmq6Zm16Zmz6Zm46Zmw6Zm06Zm26Zm36Zms6ZuA6Zuq6Zup56ug56uf6aCC6aCD6a2a6bOl6bm16bm/6bql6bq75YKi5YKN5YKF5YKZ5YKR5YKA5YKW5YKY5YKa5pyA5Yex5Ymy5Ym05Ym15Ymp5Yue5Yud5Yub5Y2a5Y6l5ZW75ZaA5Zan5ZW85ZaK5Zad5ZaY5ZaC5Zac5Zaq5ZaU5ZaH5ZaL5ZaD5Zaz5Zau5Zaf5ZS+5Zay5Zaa5Za75Zas5Zax5ZW+5ZaJ5Zar5ZaZ5ZyN5aCv5aCq5aC05aCk5aCw5aCx5aCh5aCd5aCg5aO55aO65aWgXCJdLFxuW1wiYjQ0MFwiLFwi5am35aqa5am/5aqS5aqb5aqn5a2z5a2x5a+S5a+M5a+T5a+Q5bCK5bCL5bCx5bWM5bWQ5bS05bWH5be95bmF5bi95bmA5bmD5bm+5buK5buB5buC5buE5by85b2t5b6p5b6q5b6o5oOR5oOh5oKy5oK25oOg5oSc5oSj5oO65oSV5oOw5oO75oO05oWo5oOx5oSO5oO25oSJ5oSA5oSS5oif5omJ5o6j5o6M5o+P5o+A5o+p5o+J5o+G5o+NXCJdLFxuW1wiYjRhMVwiLFwi5o+S5o+j5o+Q5o+h5o+W5o+t5o+u5o225o+05o+q5o+b5pGS5o+a5o+55pWe5pWm5pWi5pWj5paR5paQ5pav5pmu5pmw5pm05pm25pmv5pqR5pm65pm+5pm35pu+5pu/5pyf5pyd5qO65qOV5qOg5qOY5qOX5qSF5qOf5qO15qOu5qOn5qO55qOS5qOy5qOj5qOL5qON5qSN5qSS5qSO5qOJ5qOa5qWu5qO75qy+5qy65qy95q6Y5q6W5q685q+v5rCu5rCv5rCs5riv5ri45rmU5rih5riy5rmn5rmK5rig5ril5rij5rib5rmb5rmY5rik5rmW5rmu5rit5rim5rmv5ri05rmN5ri65ris5rmD5rid5ri+5ruLXCJdLFxuW1wiYjU0MFwiLFwi5rqJ5riZ5rmO5rmj5rmE5rmy5rmp5rmf54SZ54Sa54Sm54Sw54Sh54S254Wu54Sc54mM54qE54qA54y254yl54y054yp55C655Cq55Cz55Ci55Cl55C155C255C055Cv55Cb55Cm55Co55Sl55Sm55Wr55Wq55ei55eb55ej55eZ55eY55ee55eg55m755m855qW55qT55q055uc552P55+t56Gd56Gs56Gv56iN56iI56iL56iF56iA56qYXCJdLFxuW1wiYjVhMVwiLFwi56qX56qW56ul56uj562J562W562G562Q562S562U562N562L562P562R57Kf57Kl57We57WQ57Wo57WV57Sr57Wu57Wy57Wh57Wm57Wi57Ww57Wz5ZaE57+U57+V6ICL6IGS6IKF6IWV6IWU6IWL6IWR6IWO6IS56IWG6IS+6IWM6IWT6IW06IiS6Iic6I+p6JCD6I+46JCN6I+g6I+F6JCL6I+B6I+v6I+x6I+06JGX6JCK6I+w6JCM6I+M6I+96I+y6I+K6JC46JCO6JCE6I+c6JCH6I+U6I+f6Jmb6Juf6JuZ6Jut6JuU6Jub6Juk6JuQ6Jue6KGX6KOB6KOC6KKx6KaD6KaW6Ki76Kmg6KmV6Kme6Ki86KmBXCJdLFxuW1wiYjY0MFwiLFwi6KmU6Kmb6KmQ6KmG6Ki06Ki66Ki26KmW6LGh6LKC6LKv6LK86LKz6LK96LOB6LK76LOA6LK06LK36LK26LK/6LK46LaK6LaF6LaB6LeO6Led6LeL6Lea6LeR6LeM6Leb6LeG6Lu76Lu46Lu86L6c6YCu6YC16YCx6YC46YCy6YC26YSC6YO16YSJ6YO+6YWj6YWl6YeP6YiU6YiV6Yij6YiJ6Yie6YiN6YiQ6YiH6YiR6ZaU6ZaP6ZaL6ZaRXCJdLFxuW1wiYjZhMVwiLFwi6ZaT6ZaS6ZaO6ZqK6ZqO6ZqL6Zm96ZqF6ZqG6ZqN6Zmy6ZqE6ZuB6ZuF6ZuE6ZuG6ZuH6Zuv6Zuy6Z+M6aCF6aCG6aCI6aOn6aOq6aOv6aOp6aOy6aOt6aau6aat6buD6buN6buR5LqC5YKt5YK15YKy5YKz5YOF5YK+5YKs5YK35YK75YKv5YOH5Ym/5Ym35Ym95Yuf5Yum5Yuk5Yui5Yuj5Yyv5Zef5Zeo5ZeT5Zem5ZeO5Zec5ZeH5ZeR5Zej5Zek5Zev5Zea5Zeh5ZeF5ZeG5Zel5ZeJ5ZyS5ZyT5aGe5aGR5aGY5aGX5aGa5aGU5aGr5aGM5aGt5aGK5aGi5aGS5aGL5aWn5auB5auJ5auM5aq+5aq95aq8XCJdLFxuW1wiYjc0MFwiLFwi5aqz5auC5aqy5bWp5bWv5bmM5bm55buJ5buI5byS5b2Z5b6s5b6u5oSa5oSP5oWI5oSf5oOz5oSb5oO55oSB5oSI5oWO5oWM5oWE5oWN5oS+5oS05oSn5oSN5oSG5oS35oih5oii5pCT5pC+5pCe5pCq5pCt5pC95pCs5pCP5pCc5pCU5pCN5pC25pCW5pCX5pCG5pWs5paf5paw5pqX5pqJ5pqH5pqI5pqW5pqE5pqY5pqN5pyD5qaU5qWtXCJdLFxuW1wiYjdhMVwiLFwi5qWa5qW35qWg5qWU5qW15qSw5qaC5qWK5qWo5qWr5qWe5qWT5qW55qaG5qWd5qWj5qWb5q2H5q2y5q+A5q6/5q+T5q+95rqi5rqv5ruT5rq25ruC5rqQ5rqd5ruH5ruF5rql5rqY5rq85rq65rqr5ruR5rqW5rqc5ruE5ruU5rqq5rqn5rq054WO54WZ54Wp54Wk54WJ54Wn54Wc54Ws54Wm54WM54Wl54We54WG54Wo54WW54i654mS54y3542F54y/54y+55Gv55Ga55GV55Gf55Ge55GB55C/55GZ55Gb55Gc55W255W455iA55ew55iB55ey55ex55e655e/55e055ez55ue55uf552b552r552m552e552jXCJdLFxuW1wiYjg0MFwiLFwi5525552q552s552c552l552o552i55+u56KO56Kw56KX56KY56KM56KJ56G856KR56KT56G/56W656W/56aB6JCs56a956ic56ia56ig56iU56if56ie56qf56qg562356+A562g562u562n57Kx57Kz57K157aT57W557aR57aB57aP57Wb572u572p572q572y576p576o576k6IGW6IGY6IKG6IKE6IWx6IWw6IW46IWl6IWu6IWz6IWrXCJdLFxuW1wiYjhhMVwiLFwi6IW56IW66IWm6IiF6ImH6JKC6JG36JC96JCx6JG16JGm6JGr6JGJ6JGs6JGb6JC86JC16JGh6JGj6JGp6JGt6JGG6Jme6Jmc6Jmf6Ju56JyT6JyI6JyH6JyA6Ju+6Ju76JyC6JyD6JyG6JyK6KGZ6KOf6KOU6KOZ6KOc6KOY6KOd6KOh6KOK6KOV6KOS6Kac6Kej6Kmr6Kmy6Kmz6Kmm6Kmp6Kmw6KqH6Km86Kmj6Kqg6Kmx6KqF6Kmt6Kmi6Kmu6Kms6Km56Km76Ki+6Kmo6LGi6LKK6LKJ6LOK6LOH6LOI6LOE6LKy6LOD6LOC6LOF6Leh6Lef6Leo6Lev6Lez6Le66Leq6Lek6Lem6Lqy6LyD6LyJ6Lu+6LyKXCJdLFxuW1wiYjk0MFwiLFwi6L6f6L6y6YGL6YGK6YGT6YGC6YGU6YC86YGV6YGQ6YGH6YGP6YGO6YGN6YGR6YC+6YGB6YSS6YSX6YWs6YWq6YWp6YeJ6Yi36YmX6Yi46Yi96YmA6Yi+6Ymb6YmL6Ymk6YmR6Yi06YmJ6YmN6YmF6Yi56Yi/6Yma6ZaY6ZqY6ZqU6ZqV6ZuN6ZuL6ZuJ6ZuK6Zu36Zu76Zu56Zu26Z2W6Z206Z226aCQ6aCR6aCT6aCK6aCS6aCM6aO86aO0XCJdLFxuW1wiYjlhMVwiLFwi6aO96aO+6aaz6aax6aa06auh6bOp6bqC6byO6byT6byg5YOn5YOu5YOl5YOW5YOt5YOa5YOV5YOP5YOR5YOx5YOO5YOp5YWi5Yez5YqD5YqC5Yyx5Y6t5Ze+5ZiA5Zib5ZiX5Ze95ZiU5ZiG5ZiJ5ZiN5ZiO5Ze35ZiW5Zif5ZiI5ZiQ5Ze25ZyY5ZyW5aG15aG+5aKD5aKT5aKK5aG55aKF5aG95aO95aSl5aSi5aSk5aWq5aWp5auh5aum5aup5auX5auW5auY5auj5a215a+e5a+n5a+h5a+l5a+m5a+o5a+i5a+k5a+f5bCN5bGi5baE5baH5bmb5bmj5bmV5bmX5bmU5buT5buW5byK5b2G5b2w5b655oWHXCJdLFxuW1wiYmE0MFwiLFwi5oS/5oWL5oW35oWi5oWj5oWf5oWa5oWY5oW15oiq5pKH5pGY5pGU5pKk5pG45pGf5pG65pGR5pGn5pC05pGt5pG75pWy5pah5peX5peW5pqi5pqo5pqd5qac5qao5qaV5qeB5qau5qeT5qeL5qab5qa35qa75qar5qa05qeQ5qeN5qat5qeM5qam5qeD5qaj5q2J5q2M5rCz5ryz5ryU5ru+5ryT5ru05ryp5ry+5ryg5rys5ryP5ryC5ryiXCJdLFxuW1wiYmFhMVwiLFwi5ru/5ruv5ryG5ryx5ry45ryy5ryj5ryV5ryr5ryv5r6I5ryq5rus5ryB5ruy5ruM5ru354aU54aZ54W954aK54aE54aS54i+54qS54qW542E542Q55Gk55Gj55Gq55Gw55Gt55SE55aR55in55iN55iL55iJ55iT55uh55uj556E5529552/552h56OB56Kf56Kn56Kz56Kp56Kj56aO56aP56aN56iu56ix56qq56qp56ut56uv566h566V566L5621566X566d566U566P5664566H566E57K557K957K+57a757aw57ac57a957a+57ag57eK57a057ay57ax57a657ai57a/57a157a457at57eS57eH57asXCJdLFxuW1wiYmI0MFwiLFwi572w57+g57+h57+f6IGe6IGa6IKH6IWQ6IaA6IaP6IaI6IaK6IW/6IaC6Ien6Ie66IiH6IiU6Iie6ImL6JOJ6JK/6JOG6JOE6JKZ6JKe6JKy6JKc6JOL6JK46JOA6JOT6JKQ6JK86JOR6JOK6Jy/6Jyc6Jy76Jyi6Jyl6Jy06JyY6J2V6Jy36Jyp6KOz6KSC6KO06KO56KO46KO96KOo6KSa6KOv6Kqm6KqM6Kqe6Kqj6KqN6Kqh6KqT6KqkXCJdLFxuW1wiYmJhMVwiLFwi6Kqq6Kql6Kqo6KqY6KqR6Kqa6Kqn6LGq6LKN6LKM6LOT6LOR6LOS6LWr6LaZ6LaV6Le86LyU6LyS6LyV6LyT6L6j6YGg6YGY6YGc6YGj6YGZ6YGe6YGi6YGd6YGb6YSZ6YSY6YSe6YW16YW46YW36YW06Ym46YqA6YqF6YqY6YqW6Ym76YqT6Yqc6Yqo6Ym86YqR6Zah6Zao6Zap6Zaj6Zal6Zak6ZqZ6Zqc6Zqb6ZuM6ZuS6ZyA6Z286Z6F6Z+26aCX6aCY6aKv6aKx6aSD6aSF6aSM6aSJ6aeB6aqv6aqw6aum6a2B6a2C6bO06bO26bOz6bq86by76b2K5YSE5YSA5YO75YO15YO55YSC5YSI5YSJ5YSF5YecXCJdLFxuW1wiYmM0MFwiLFwi5YqH5YqI5YqJ5YqN5YqK5Yuw5Y6y5Ziu5Zi75Zi55Ziy5Zi/5Zi05Zip5ZmT5ZmO5ZmX5Zm05Zi25Ziv5Ziw5aKA5aKf5aKe5aKz5aKc5aKu5aKp5aKm5aWt5ayJ5au75ayL5au15ayM5ayI5a+u5a+s5a+p5a+r5bGk5bGl5bad5baU5bmi5bmf5bmh5bui5bua5buf5bud5buj5bug5b2I5b2x5b635b615oW25oWn5oWu5oWd5oWV5oaCXCJdLFxuW1wiYmNhMVwiLFwi5oW85oWw5oWr5oW+5oan5oaQ5oar5oaO5oas5oaa5oak5oaU5oau5oiu5pGp5pGv5pG55pKe5pKy5pKI5pKQ5pKw5pKl5pKT5pKV5pKp5pKS5pKu5pKt5pKr5pKa5pKs5pKZ5pKi5pKz5pW15pW35pW45pqu5pqr5pq05pqx5qij5qif5qeo5qiB5qie5qiZ5qe95qih5qiT5qiK5qez5qiC5qiF5qet5qiR5q2Q5q2O5q6k5q+F5q+G5ry/5r285r6E5r2R5r2m5r2U5r6G5r2t5r2b5r245r2u5r6O5r265r2w5r2k5r6X5r2Y5ruV5r2v5r2g5r2f54af54as54ax54ao54mW54qb542O542X55Gp55KL55KDXCJdLFxuW1wiYmQ0MFwiLFwi55G+55KA55W/55ig55ip55if55ik55im55ih55ii55qa55q655uk556O556H556M556R556L56OL56OF56K656OK56K+56OV56K856OQ56i/56i856mA56i956i356i756qv56qu566t566x56+E566056+G56+H56+B566g56+M57OK57eg57e057ev57e757eY57es57ed57eo57ej57ea57ee57ep57ae57eZ57ey57e557215723576vXCJdLFxuW1wiYmRhMVwiLFwi57+p6ICm6Iab6Iac6Iad6Iag6Iaa6IaY6JSX6JS96JSa6JOu6JSs6JSt6JST6JSR6JSj6JSh6JSU6JOs6JSl6JO/6JSG6J6C6J206J226J2g6J2m6J246J2o6J2Z6J2X6J2M6J2T6KGb6KGd6KSQ6KSH6KSS6KST6KSV6KSK6Kq86KuS6KuH6KuE6KqV6KuL6Ku46Kqy6KuJ6KuC6Kq/6Kqw6KuW6KuN6Kq26Kq56Kub6LGM6LGO6LGs6LOg6LOe6LOm6LOk6LOs6LOt6LOi6LOj6LOc6LOq6LOh6LWt6Laf6Laj6Lir6LiQ6Lid6Lii6LiP6Lip6Lif6Lih6Lie6Lq66Lyd6Lyb6Lyf6Lyp6Lym6Lyq6Lyc6LyeXCJdLFxuW1wiYmU0MFwiLFwi6Lyl6YGp6YGu6YGo6YGt6YG36YSw6YSt6YSn6YSx6YaH6YaJ6YaL6YaD6YuF6Yq76Yq36Yuq6Yqs6Yuk6YuB6Yqz6Yq86YuS6YuH6Yuw6Yqy6Zat6Zax6ZyE6ZyG6ZyH6ZyJ6Z2g6Z6N6Z6L6Z6P6aCh6aCr6aCc6aKz6aSK6aST6aSS6aSY6aed6aeQ6aef6aeb6aeR6aeV6aeS6aeZ6aq36auu6auv6ayn6a2F6a2E6a236a2v6bSG6bSJXCJdLFxuW1wiYmVhMVwiLFwi6bSD6bqp6bq+6buO5aKo6b2S5YSS5YSY5YSU5YSQ5YSV5YaA5Yaq5Yed5YqR5YqT5Yuz5ZmZ5Zmr5Zm55Zmp5Zmk5Zm45Zmq5Zmo5Zml5Zmx5Zmv5Zms5Zmi5Zm25aOB5aK+5aOH5aOF5aWu5ayd5ay05a245a+w5bCO5b2K5oay5oaR5oap5oaK5oeN5oa25oa+5oeK5oeI5oiw5pOF5pOB5pOL5pK75pK85pOa5pOE5pOH5pOC5pON5pK/5pOS5pOU5pK+5pW05puG5puJ5pq55puE5puH5pq45qi95qi45qi65qmZ5qmr5qmY5qi55qmE5qmi5qmh5qmL5qmH5qi15qmf5qmI5q2Z5q235rCF5r+C5r6x5r6hXCJdLFxuW1wiYmY0MFwiLFwi5r+D5r6k5r+B5r6n5r6z5r+A5r655r625r6m5r6g5r6054a+54eJ54eQ54eS54eI54eV54a554eO54eZ54ec54eD54eE542o55Kc55Kj55KY55Kf55Ke55Oi55SM55SN55i055i455i655un55ul556g556e556f556l56Oo56Oa56Os56On56am56mN56mO56mG56mM56mL56q656+Z57CR56+J56+k56+b56+h56+p56+m57OV57OW57iKXCJdLFxuW1wiYmZhMVwiLFwi57iR57iI57ib57ij57ie57id57iJ57iQ5725576y57+w57+x57+u6ICo6Iaz6Iap6Iao6Ie76IiI6ImY6ImZ6JWK6JWZ6JWI6JWo6JWp6JWD6JWJ6JWt6JWq6JWe6J6D6J6f6J6e6J6i6J6N6KGh6KSq6KSy6KSl6KSr6KSh6Kaq6Kam6Kum6Ku66Kur6Kux6KyA6Kuc6Kun6Kuu6Ku+6KyB6KyC6Ku36Kut6Kuz6Ku26Ku86LGr6LGt6LKT6LO06LmE6Lix6Li06LmC6Li56Li16Ly76Lyv6Ly46Lyz6L6o6L6m6YG16YG06YG46YGy6YG86YG66YS06YaS6Yyg6Yy26Yu46Yyz6Yyv6Yyi6Yu86Yyr6YyE6YyaXCJdLFxuW1wiYzA0MFwiLFwi6YyQ6Yym6Yyh6YyV6Yyu6YyZ6Za76Zqn6Zqo6Zqq6ZuV6ZyO6ZyR6ZyW6ZyN6ZyT6ZyP6Z2b6Z2c6Z2m6Z6Y6aCw6aC46aC76aC36aCt6aC56aCk6aSQ6aSo6aSe6aSb6aSh6aSa6aet6aei6aex6aq46aq86au76aut6ayo6a6R6bSV6bSj6bSm6bSo6bSS6bSb6buY6buU6b6N6b6c5YSq5YSf5YSh5YSy5Yu15ZqO5ZqA5ZqQ5ZqF5ZqHXCJdLFxuW1wiYzBhMVwiLFwi5ZqP5aOV5aOT5aOR5aOO5ayw5ayq5ayk5a265bC35bGo5ba85ba65ba95ba45bmr5b2M5b695oeJ5oeC5oeH5oem5oeL5oiy5oi05pOO5pOK5pOY5pOg5pOw5pOm5pOs5pOx5pOi5pOt5paC5paD5puZ5puW5qqA5qqU5qqE5qqi5qqc5qub5qqj5qm+5qqX5qqQ5qqg5q2c5q6u5q+a5rCI5r+Y5r+x5r+f5r+g5r+b5r+k5r+r5r+v5r6A5r+s5r+h5r+p5r+V5r+u5r+w54en54ef54eu54em54el54et54es54e054eg54i154mG542w542y55Kp55Kw55Km55Ko55mG55mC55mM55uq556z556q556w556sXCJdLFxuW1wiYzE0MFwiLFwi556n556t55+v56O356O656O056Ov56SB56an56aq56mX56q/57CH57CN56++56+357CM56+g57Og57Oc57Oe57Oi57Of57OZ57Od57iu57i+57mG57i357iy57mD57ir57i957ix57mF57mB57i057i557mI57i157i/57iv572E57+z57+86IGx6IGy6IGw6IGv6IGz6IeG6IeD6Ia66IeC6IeA6Ia/6Ia96IeJ6Ia+6Ieo6IiJ6Imx6JaqXCJdLFxuW1wiYzFhMVwiLFwi6JaE6JW+6Jac6JaR6JaU6Jav6Jab6JaH6Jao6JaK6Jmn6J+A6J+R6J6z6J+S6J+G6J6r6J676J666J+I6J+L6KS76KS26KWE6KS46KS96Kas6KyO6KyX6KyZ6Kyb6KyK6Kyg6Kyd6KyE6KyQ6LGB6LC/6LGz6LO66LO96LO86LO46LO76Lao6LmJ6LmL6LmI6LmK6L2E6Ly+6L2C6L2F6Ly/6YG/6YG96YKE6YKB6YKC6YKA6YS56Yaj6Yae6Yac6Y2N6Y6C6Yyo6Y216Y2K6Y2l6Y2L6YyY6Y2+6Y2s6Y2b6Y2w6Y2a6Y2U6ZeK6ZeL6ZeM6ZeI6ZeG6Zqx6Zq46ZuW6Zyc6Zye6Z6g6Z+T6aGG6aK26aS16aiBXCJdLFxuW1wiYzI0MFwiLFwi6ae/6a6u6a6r6a6q6a6t6bS76bS/6bqL6buP6bue6buc6bud6bub6by+6b2L5Y+i5ZqV5Zqu5aOZ5aOY5ay45b2d5oej5oiz5pO05pOy5pO+5pSG5pO65pO75pO35pa35puc5pym5qqz5qqs5quD5qq75qq45quC5qqu5qqv5q2f5q245q6v54CJ54CL5r++54CG5r+654CR54CP54e754e854e+54e45423542155Kn55K/55SV55mW55mYXCJdLFxuW1wiYzJhMVwiLFwi55mS5569556/5567556856SO56au56mh56mi56mg56uE56uF57Cr57Cn57Cq57Ce57Cj57Ch57On57mU57mV57me57ma57mh57mS57mZ572I57+557+76IG36IG26IeN6IeP6IiK6JeP6Jap6JeN6JeQ6JeJ6Jaw6Ja66Ja56Jam6J+v6J+s6J+y6J+g6KaG6Kay6Ke06Kyo6Ky56Kys6Kyr6LGQ6LSF6LmZ6Lmj6Lmm6Lmk6Lmf6LmV6LuA6L2J6L2N6YKH6YKD6YKI6Yar6Yas6YeQ6Y6U6Y6K6Y6W6Y6i6Y6z6Y6u6Y6s6Y6w6Y6Y6Y6a6Y6X6ZeU6ZeW6ZeQ6ZeV6Zui6Zuc6ZuZ6Zub6Zue6Zyk6Z6j6Z6mXCJdLFxuW1wiYzM0MFwiLFwi6Z6t6Z+56aGN6aGP6aGM6aGO6aGT6aK66aS+6aS/6aS96aSu6aal6aiO6auB6ayD6ayG6a2P6a2O6a2N6a+K6a+J6a+96a+I6a+A6bWR6bWd6bWg6bug6byV6bys5YSz5Zql5aOe5aOf5aOi5a+16b6Q5bus5oey5oe35oe25oe15pSA5pSP5pug5pud5qul5qud5qua5quT54Cb54Cf54Co54Ca54Cd54CV54CY54iG54iN54mY54qi5424XCJdLFxuW1wiYzNhMVwiLFwi542655K955OK55Oj55aH55aG55mf55mh55+H56SZ56ax56mr56mp57C+57C/57C457C957C357GA57mr57mt57m557mp57mq576F57mz5762576557646IeY6Jep6Jed6Jeq6JeV6Jek6Jel6Je36J+76KCF6KCN6J+56J++6KWg6KWf6KWW6KWe6K2B6K2c6K2Y6K2J6K2a6K2O6K2P6K2G6K2Z6LSI6LSK6Lm86Lmy6LqH6Lm26Lms6Lm66Lm06L2U6L2O6L6t6YKK6YKL6Yax6Yau6Y+h6Y+R6Y+f6Y+D6Y+I6Y+c6Y+d6Y+W6Y+i6Y+N6Y+Y6Y+k6Y+X6Y+o6Zec6Zq06Zuj6Zyq6Zyn6Z2h6Z+c6Z+76aGeXCJdLFxuW1wiYzQ0MFwiLFwi6aGY6aGb6aK86aWF6aWJ6aiW6aiZ6ayN6a+o6a+n6a+W6a+b6baJ6bWh6bWy6bWq6bWs6bqS6bqX6bqT6bq05Yu45Zqo5Zq35Zq25Zq05Zq85aOk5a2A5a2D5a295a+25beJ5oe45oe65pSY5pSU5pSZ5pum5pyn5qus54C+54Cw54Cy54iQ542755OP55mi55ml56Sm56Sq56Ss56Sr56uH56u257GM57GD57GN57Ov57Ow6L6u57m957m8XCJdLFxuW1wiYzRhMVwiLFwi57qC572M6ICA6Iea6Imm6Je76Je56JiR6Je66JiG6JiL6JiH6JiK6KCU6KCV6KWk6Ka66Ke46K2w6K2s6K2m6K2v6K2f6K2r6LSP6LSN6LqJ6LqB6LqF6LqC6Ya06YeL6ZCY6ZCD6Y+96Zeh6Zyw6aOE6aWS6aWR6aao6air6aiw6ai36ai16bCT6bCN6bm56bq16buo6byv6b2f6b2j6b2h5YS35YS45ZuB5ZuA5ZuC5aSU5bGs5beN5oe85oe+5pSd5pSc5paV5pup5qu75qyE5qu65q6y54GM54ib54qn55OW55OU55mp55+T57GQ57qP57qM57686JiX6Jit6Jia6KCj6KCi6KCh6KCf6KWq6KWs6Ka96K20XCJdLFxuW1wiYzU0MFwiLFwi6K236K296LST6LqK6LqN6LqL6L2f6L6v6Ya66ZCu6ZCz6ZC16ZC66ZC46ZCy6ZCr6Zei6Zy46Zy56Zyy6Z+/6aGn6aGl6aWX6amF6amD6amA6ai+6auP6a2U6a2R6bCt6bCl6bav6ba06beC6ba46bqd6buv6byZ6b2c6b2m6b2n5YS85YS75ZuI5ZuK5ZuJ5a2/5beU5beS5b2O5oe/5pSk5qyK5q2h54GR54GY546A55Ok55aK55mu55msXCJdLFxuW1wiYzVhMVwiLFwi56az57Gg57Gf6IG+6IG96Ief6KWy6KWv6Ke86K6A6LSW6LSX6LqR6LqT6L2h6YWI6ZGE6ZGR6ZGS6Zy96Zy+6Z+D6Z+B6aGr6aWV6amV6amN6auS6aya6bGJ6bCx6bC+6bC76beT6beX6by06b2s6b2q6b6U5ZuM5beW5oiA5pSj5pSr5pSq5pus5qyQ55Oa56uK57Gk57Gj57Gl57qT57qW57qU6Iei6Ji46Ji/6KCx6K6K6YKQ6YKP6ZGj6ZGg6ZGk6Z2o6aGv6aWc6ama6amb6amX6auT6auU6auR6bGU6bGX6bGW6bel6bqf6bu05ZuR5aOp5pSs54Ge55mx55my55+X572Q576I6KC26KC56KGi6K6T6K6SXCJdLFxuW1wiYzY0MFwiLFwi6K6W6Im36LSb6YeA6ZGq6Z2C6Z2I6Z2E6Z+G6aGw6amf6ayi6a2Y6bGf6be56be66bm86bm96byH6b236b2y5buz5qyW54Gj57Gs57Gu6KC76KeA6Lqh6YeB6ZGy6ZGw6aGx6aWe6auW6ayj6buM54Gk55+a6K6a6ZG36Z+J6ami6aml57qc6K6c6Lqq6YeF6ZG96ZG+6ZG86bG36bG46bu36LGU6ZG/6bia54io6amq6ayx6bib6bie57GyXCJdLFxuW1wiYzk0MFwiLFwi5LmC5Lmc5Ye15Yya5Y6C5LiH5LiM5LmH5LqN5ZuX76iM5bGu5b2z5LiP5YaH5LiO5Liu5LqT5LuC5LuJ5LuI5YaY5Yu85Y2s5Y655Zyg5aSD5aSs5bCQ5be/5peh5q6z5q+M5rCU54i/5Lix5Li85Luo5Luc5Lup5Luh5Lud5Lua5YiM5Yyc5Y2M5Zyi5Zyj5aSX5aSv5a6B5a6E5bCS5bC75bG05bGz5biE5bqA5bqC5b+J5oiJ5omQ5rCVXCJdLFxuW1wiYzlhMVwiLFwi5rC25rGD5rC/5rC754qu54qw546K56a46IKK6Zie5LyO5LyY5Lys5Lu15LyU5Lux5LyA5Lu35LyI5Lyd5LyC5LyF5Lyi5LyT5LyE5Lu05LyS5Yax5YiT5YiJ5YiQ5Yqm5Yyi5Yyf5Y2N5Y6K5ZCH5Zuh5Zuf5Zyu5Zyq5Zy05aS85aaA5aW85aaF5aW75aW+5aW35aW/5a2W5bCV5bCl5bG85bG65bG75bG+5bef5bm15bqE5byC5bya5b205b+V5b+U5b+P5omc5ome5omk5omh5omm5omi5omZ5omg5oma5oml5pev5peu5py+5py55py45py75py65py/5py85pyz5rCY5rGG5rGS5rGc5rGP5rGK5rGU5rGLXCJdLFxuW1wiY2E0MFwiLFwi5rGM54Gx54me54q054q1546O55Sq55m/56m1572R6Im46Im86IqA6Im96Im/6JmN6KW+6YKZ6YKX6YKY6YKb6YKU6Zii6Zik6Zig6Zij5L2W5Ly75L2i5L2J5L2T5L2k5Ly+5L2n5L2S5L2f5L2B5L2Y5Lyt5Lyz5Ly/5L2h5YaP5Ya55Yic5Yie5Yih5Yqt5Yqu5YyJ5Y2j5Y2y5Y6O5Y6P5ZCw5ZC35ZCq5ZGU5ZGF5ZCZ5ZCc5ZCl5ZCYXCJdLFxuW1wiY2FhMVwiLFwi5ZC95ZGP5ZGB5ZCo5ZCk5ZGH5Zuu5Zun5Zul5Z2B5Z2F5Z2M5Z2J5Z2L5Z2S5aSG5aWA5aam5aaY5aag5aaX5aaO5aai5aaQ5aaP5aan5aah5a6O5a6S5bCo5bCq5bKN5bKP5bKI5bKL5bKJ5bKS5bKK5bKG5bKT5bKV5beg5biK5biO5bqL5bqJ5bqM5bqI5bqN5byF5byd5b245b225b+S5b+R5b+Q5b+t5b+o5b+u5b+z5b+h5b+k5b+j5b+65b+v5b+35b+75oCA5b+05oi65oqD5oqM5oqO5oqP5oqU5oqH5omx5om75om65omw5oqB5oqI5om35om95omy5om05pS35pew5pe05pez5pey5pe15p2F5p2HXCJdLFxuW1wiY2I0MFwiLFwi5p2Z5p2V5p2M5p2I5p2d5p2N5p2a5p2L5q+Q5rCZ5rCa5rG45rGn5rGr5rKE5rKL5rKP5rGx5rGv5rGp5rKa5rGt5rKH5rKV5rKc5rGm5rGz5rGl5rG75rKO54G054G654mj54q/54q954uD54uG54uB54q654uF546V546X546T546U546S55S655S555aU55aV55qB56S96IC06IKV6IKZ6IKQ6IKS6IKc6IqQ6IqP6IqF6IqO6IqR6IqTXCJdLFxuW1wiY2JhMVwiLFwi6IqK6IqD6IqE6LG46L+J6L6/6YKf6YKh6YKl6YKe6YKn6YKg6Ziw6Zio6Ziv6Zit5Liz5L6Y5L285L6F5L295L6A5L6H5L225L205L6J5L6E5L235L2M5L6X5L2q5L6a5L255L6B5L245L6Q5L6c5L6U5L6e5L6S5L6C5L6V5L2r5L2u5Yae5Ya85Ya+5Yi15Yiy5Yiz5YmG5Yix5Yq85YyK5YyL5Yy85Y6S5Y6U5ZKH5ZG/5ZKB5ZKR5ZKC5ZKI5ZGr5ZG65ZG+5ZGl5ZGs5ZG05ZGm5ZKN5ZGv5ZGh5ZGg5ZKY5ZGj5ZGn5ZGk5Zu35Zu55Z2v5Z2y5Z2t5Z2r5Z2x5Z2w5Z225Z6A5Z215Z275Z2z5Z205Z2iXCJdLFxuW1wiY2M0MFwiLFwi5Z2o5Z295aSM5aWF5aa15aa65aeP5aeO5aay5aeM5aeB5aa25aa85aeD5aeW5aax5aa95aeA5aeI5aa05aeH5a2i5a2l5a6T5a6V5bGE5bGH5bKu5bKk5bKg5bK15bKv5bKo5bKs5bKf5bKj5bKt5bKi5bKq5bKn5bKd5bKl5bK25bKw5bKm5biX5biU5biZ5byo5byi5byj5byk5b2U5b6C5b2+5b295b+e5b+l5oCt5oCm5oCZ5oCy5oCLXCJdLFxuW1wiY2NhMVwiLFwi5oC05oCK5oCX5oCz5oCa5oCe5oCs5oCi5oCN5oCQ5oCu5oCT5oCR5oCM5oCJ5oCc5oiU5oi95oqt5oq05ouR5oq+5oqq5oq25ouK5oqu5oqz5oqv5oq75oqp5oqw5oq45pS95pao5pa75piJ5pe85piE5piS5piI5pe75piD5piL5piN5piF5pe95piR5piQ5pu25pyK5p6F5p2s5p6O5p6S5p225p275p6Y5p6G5p6E5p205p6N5p6M5p265p6f5p6R5p6Z5p6D5p295p6B5p245p255p6U5qyl5q6A5q2+5q+e5rCd5rKT5rOs5rOr5rOu5rOZ5rK25rOU5rKt5rOn5rK35rOQ5rOC5rK65rOD5rOG5rOt5rOyXCJdLFxuW1wiY2Q0MFwiLFwi5rOS5rOd5rK05rKK5rKd5rKA5rOe5rOA5rSw5rON5rOH5rKw5rO55rOP5rOp5rOR54KU54KY54KF54KT54KG54KE54KR54KW54KC54Ka54KD54mq54uW54uL54uY54uJ54uc54uS54uU54ua54uM54uR546k546h546t546m546i546g546s546d55Od55Oo55S/55WA55S+55aM55aY55qv55uz55ux55uw55u155+455+855+555+755+6XCJdLFxuW1wiY2RhMVwiLFwi55+356WC56S/56eF56m456m756u757G157O96IC16IKP6IKu6IKj6IK46IK16IKt6Iig6Iqg6IuA6Iqr6Iqa6IqY6Iqb6Iq16Iqn6Iqu6Iq86Iqe6Iq66Iq06Iqo6Iqh6Iqp6IuC6Iqk6IuD6Iq26Iqi6Jmw6Jmv6Jmt6Jmu6LGW6L+S6L+L6L+T6L+N6L+W6L+V6L+X6YKy6YK06YKv6YKz6YKw6Zi56Zi96Zi86Zi66ZmD5L+N5L+F5L+T5L6y5L+J5L+L5L+B5L+U5L+c5L+Z5L675L6z5L+b5L+H5L+W5L665L+A5L655L+s5YmE5YmJ5YuA5YuC5Yy95Y285Y6X5Y6W5Y6Z5Y6Y5ZK65ZKh5ZKt5ZKl5ZOPXCJdLFxuW1wiY2U0MFwiLFwi5ZOD6IyN5ZK35ZKu5ZOW5ZK25ZOF5ZOG5ZKg5ZGw5ZK85ZKi5ZK+5ZGy5ZOe5ZKw5Z615Z6e5Z6f5Z6k5Z6M5Z6X5Z6d5Z6b5Z6U5Z6Y5Z6P5Z6Z5Z6l5Z6a5Z6V5aO05aSN5aWT5aeh5aee5aeu5aiA5aex5aed5ae65ae95ae85ae25aek5aey5ae35aeb5aep5aez5ae15aeg5ae+5ae05aet5a6o5bGM5bOQ5bOY5bOM5bOX5bOL5bObXCJdLFxuW1wiY2VhMVwiLFwi5bOe5bOa5bOJ5bOH5bOK5bOW5bOT5bOU5bOP5bOI5bOG5bOO5bOf5bO45be55bih5bii5bij5big5bik5bqw5bqk5bqi5bqb5bqj5bql5byH5byu5b2W5b6G5oC35oC55oGU5oGy5oGe5oGF5oGT5oGH5oGJ5oGb5oGM5oGA5oGC5oGf5oCk5oGE5oGY5oGm5oGu5omC5omD5ouP5oyN5oyL5ou15oyO5oyD5our5ou55oyP5oyM5ou45ou25oyA5oyT5oyU5ou65oyV5ou75ouw5pWB5pWD5paq5pa/5pi25pih5piy5pi15pic5pim5pii5piz5pir5pi65pid5pi05pi55piu5pyP5pyQ5p+B5p+y5p+I5p66XCJdLFxuW1wiY2Y0MFwiLFwi5p+c5p675p+45p+Y5p+A5p635p+F5p+r5p+k5p+f5p615p+N5p6z5p+35p+25p+u5p+j5p+C5p655p+O5p+n5p+w5p6y5p+85p+G5p+t5p+M5p6u5p+m5p+b5p+65p+J5p+K5p+D5p+q5p+L5qyo5q6C5q6E5q625q+W5q+Y5q+g5rCg5rCh5rSo5rS05rSt5rSf5rS85rS/5rSS5rSK5rOa5rSz5rSE5rSZ5rS65rSa5rSR5rSA5rSd5rWCXCJdLFxuW1wiY2ZhMVwiLFwi5rSB5rSY5rS35rSD5rSP5rWA5rSH5rSg5rSs5rSI5rSi5rSJ5rSQ54K354Kf54K+54Kx54Kw54Kh54K054K154Kp54mB54mJ54mK54ms54mw54mz54mu54uK54uk54uo54ur54uf54uq54um54uj546F54+M54+C54+I54+F546554625461546054+r546/54+H546+54+D54+G546454+L55Os55Ou55Su55WH55WI55an55aq55m555uE55yI55yD55yE55yF55yK55u355u755u655+n55+o56CG56CR56CS56CF56CQ56CP56CO56CJ56CD56CT56WK56WM56WL56WF56WE56eV56eN56eP56eW56eO56qAXCJdLFxuW1wiZDA0MFwiLFwi56m+56uR56yA56yB57G657G457G557G/57KA57KB57SD57SI57SB572Y576R576N576+6ICH6ICO6ICP6ICU6IC36IOY6IOH6IOg6IOR6IOI6IOC6IOQ6IOF6IOj6IOZ6IOc6IOK6IOV6IOJ6IOP6IOX6IOm6ION6Ie/6Iih6IqU6IuZ6Iu+6Iu56IyH6Iuo6IyA6IuV6Iy66Iur6IuW6Iu06Ius6Iuh6Iuy6Iu16IyM6Iu76Iu26Iuw6IuqXCJdLFxuW1wiZDBhMVwiLFwi6Iuk6Iug6Iu66Iuz6Iut6Jm36Jm06Jm86Jmz6KGB6KGO6KGn6KGq6KGp6KeT6KiE6KiH6LWy6L+j6L+h6L+u6L+g6YOx6YK96YK/6YOV6YOF6YK+6YOH6YOL6YOI6YeU6YeT6ZmU6ZmP6ZmR6ZmT6ZmK6ZmO5YCe5YCF5YCH5YCT5YCi5YCw5YCb5L+15L+05YCz5YC35YCs5L+25L+35YCX5YCc5YCg5YCn5YC15YCv5YCx5YCO5YWa5YaU5YaT5YeK5YeE5YeF5YeI5YeO5Ymh5Yma5YmS5Yme5Ymf5YmV5Ymi5YuN5YyO5Y6e5ZSm5ZOi5ZSX5ZSS5ZOn5ZOz5ZOk5ZSa5ZO/5ZSE5ZSI5ZOr5ZSR5ZSF5ZOxXCJdLFxuW1wiZDE0MFwiLFwi5ZSK5ZO75ZO35ZO45ZOg5ZSO5ZSD5ZSL5ZyB5ZyC5Z+M5aCy5Z+V5Z+S5Z665Z+G5Z695Z685Z645Z625Z6/5Z+H5Z+Q5Z655Z+B5aSO5aWK5aiZ5aiW5ait5aiu5aiV5aiP5aiX5aiK5aie5aiz5a2s5a6n5a6t5a6s5bCD5bGW5bGU5bOs5bO/5bOu5bOx5bO35bSA5bO55bip5bio5bqo5bqu5bqq5bqs5byz5byw5b2n5oGd5oGa5oGnXCJdLFxuW1wiZDFhMVwiLFwi5oGB5oKi5oKI5oKA5oKS5oKB5oKd5oKD5oKV5oKb5oKX5oKH5oKc5oKO5oiZ5omG5ouy5oyQ5o2W5oys5o2E5o2F5oy25o2D5o+k5oy55o2L5o2K5oy85oyp5o2B5oy05o2Y5o2U5o2Z5oyt5o2H5oyz5o2a5o2R5oy45o2X5o2A5o2I5pWK5pWG5peG5peD5peE5peC5pmK5pmf5pmH5pmR5pyS5pyT5qCf5qCa5qGJ5qCy5qCz5qC75qGL5qGP5qCW5qCx5qCc5qC15qCr5qCt5qCv5qGO5qGE5qC05qCd5qCS5qCU5qCm5qCo5qCu5qGN5qC65qCl5qCg5qys5qyv5qyt5qyx5qy05q2t6IKC5q6I5q+m5q+kXCJdLFxuW1wiZDI0MFwiLFwi5q+o5q+j5q+i5q+n5rCl5rW65rWj5rWk5rW25rSN5rWh5raS5rWY5rWi5rWt5rWv5raR5raN5rev5rW/5raG5rWe5rWn5rWg5raX5rWw5rW85rWf5raC5raY5rSv5rWo5raL5rW+5raA5raE5rSW5raD5rW75rW95rW15raQ54Oc54OT54OR54Od54OL57y554Oi54OX54OS54Oe54Og54OU54ON54OF54OG54OH54Oa54OO54Oh54mC54m4XCJdLFxuW1wiZDJhMVwiLFwi54m354m254yA54u654u054u+54u254uz54u754yB54+T54+Z54+l54+W546854+n54+j54+p54+c54+S54+b54+U54+d54+a54+X54+Y54+o55Oe55Of55O055O155Sh55Wb55Wf55aw55eB55a755eE55eA55a/55a255a655qK55uJ55yd55yb55yQ55yT55yS55yj55yR55yV55yZ55ya55yi55yn56Cj56Cs56Ci56C156Cv56Co56Cu56Cr56Ch56Cp56Cz56Cq56Cx56WU56Wb56WP56Wc56WT56WS56WR56er56es56eg56eu56et56eq56ec56ee56ed56qG56qJ56qF56qL56qM56qK56qH56uY56yQXCJdLFxuW1wiZDM0MFwiLFwi56yE56yT56yF56yP56yI56yK56yO56yJ56yS57KE57KR57KK57KM57KI57KN57KF57Se57Sd57SR57SO57SY57SW57ST57Sf57SS57SP57SM572c572h572e572g572d572b576W576S57+D57+C57+A6ICW6IC+6IC56IO66IOy6IO56IO16ISB6IO76ISA6IiB6Iiv6Iil6Iyz6Iyt6I2E6IyZ6I2R6Iyl6I2W6Iy/6I2B6Iym6Iyc6IyiXCJdLFxuW1wiZDNhMVwiLFwi6I2C6I2O6Iyb6Iyq6IyI6Iy86I2N6IyW6Iyk6Iyg6Iy36Iyv6Iyp6I2H6I2F6I2M6I2T6Iye6Iys6I2L6Iyn6I2I6JmT6JmS6Jqi6Jqo6JqW6JqN6JqR6Jqe6JqH6JqX6JqG6JqL6Jqa6JqF6Jql6JqZ6Jqh6Jqn6JqV6JqY6JqO6Jqd6JqQ6JqU6KGD6KGE6KGt6KG16KG26KGy6KKA6KGx6KG/6KGv6KKD6KG+6KG06KG86KiS6LGH6LGX6LG76LKk6LKj6LW26LW46La16La36La26LuR6LuT6L++6L+16YCC6L+/6L+76YCE6L+86L+26YOW6YOg6YOZ6YOa6YOj6YOf6YOl6YOY6YOb6YOX6YOc6YOk6YWQXCJdLFxuW1wiZDQ0MFwiLFwi6YWO6YWP6YeV6Yei6Yea6Zmc6Zmf6Zq86aOj6auf6ayv5Lm/5YGw5YGq5YGh5YGe5YGg5YGT5YGL5YGd5YGy5YGI5YGN5YGB5YGb5YGK5YGi5YCV5YGF5YGf5YGp5YGr5YGj5YGk5YGG5YGA5YGu5YGz5YGX5YGR5YeQ5Ymr5Ymt5Yms5Ymu5YuW5YuT5Yyt5Y6c5ZW15ZW25ZS85ZWN5ZWQ5ZS05ZSq5ZWR5ZWi5ZS25ZS15ZSw5ZWS5ZWFXCJdLFxuW1wiZDRhMVwiLFwi5ZSM5ZSy5ZWl5ZWO5ZS55ZWI5ZSt5ZS75ZWA5ZWL5ZyK5ZyH5Z+75aCU5Z+i5Z+25Z+c5Z+05aCA5Z+t5Z+95aCI5Z+45aCL5Z+z5Z+P5aCH5Z+u5Z+j5Z+y5Z+l5Z+s5Z+h5aCO5Z+85aCQ5Z+n5aCB5aCM5Z+x5Z+p5Z+w5aCN5aCE5aWc5amg5amY5amV5amn5ame5ai45ai15amt5amQ5amf5aml5ams5amT5amk5amX5amD5amd5amS5amE5amb5amI5aqO5ai+5amN5ai55amM5amw5amp5amH5amR5amW5amC5amc5a2y5a2u5a+B5a+A5bGZ5bSe5bSL5bSd5bSa5bSg5bSM5bSo5bSN5bSm5bSl5bSPXCJdLFxuW1wiZDU0MFwiLFwi5bSw5bSS5bSj5bSf5bSu5bi+5bi05bqx5bq05bq55bqy5bqz5by25by45b6b5b6W5b6f5oKK5oKQ5oKG5oK+5oKw5oK65oOT5oOU5oOP5oOk5oOZ5oOd5oOI5oKx5oOb5oK35oOK5oK/5oOD5oON5oOA5oyy5o2l5o6K5o6C5o295o695o6e5o6t5o6d5o6X5o6r5o6O5o2v5o6H5o6Q5o2u5o6v5o215o6c5o2t5o6u5o285o6k5oy75o6fXCJdLFxuW1wiZDVhMVwiLFwi5o245o6F5o6B5o6R5o6N5o2w5pWT5peN5pml5pmh5pmb5pmZ5pmc5pmi5pyY5qG55qKH5qKQ5qKc5qGt5qGu5qKu5qKr5qWW5qGv5qKj5qKs5qKp5qG15qG05qKy5qKP5qG35qKS5qG85qGr5qGy5qKq5qKA5qGx5qG+5qKb5qKW5qKL5qKg5qKJ5qKk5qG45qG75qKR5qKM5qKK5qG95qy25qyz5qy35qy45q6R5q6P5q6N5q6O5q6M5rCq5reA5rar5ra05raz5rm05ras5rep5rei5ra35re25reU5riA5reI5reg5ref5reW5ra+5rel5rec5red5reb5re05reK5ra95ret5rew5ra65reV5reC5reP5reJXCJdLFxuW1wiZDY0MFwiLFwi5reQ5rey5reT5re95reX5reN5rej5ra754O654SN54O354SX54O054SM54Ow54SE54Oz54SQ54O854O/54SG54ST54SA54O454O254SL54SC54SO54m+54m754m854m/54yd54yX54yH54yR54yY54yK54yI54u/54yP54ye546I54+254+454+155CE55CB54+955CH55CA54+654+854+/55CM55CL54+055CI55Wk55Wj55eO55eS55ePXCJdLFxuW1wiZDZhMVwiLFwi55eL55eM55eR55eQ55qP55qJ55uT55y555yv55yt55yx55yy55y055yz55y955yl55y755y156GI56GS56GJ56GN56GK56GM56Cm56GF56GQ56Wk56Wn56Wp56Wq56Wj56Wr56Wh56a756e656e456e256e356qP56qU56qQ56y1562H56y056yl56yw56yi56yk56yz56yY56yq56yd56yx56yr56yt56yv56yy56y456ya56yj57KU57KY57KW57Kj57S157S957S457S257S657WF57Ss57Sp57WB57WH57S+57S/57WK57S757So572j576V576c576d576b57+K57+L57+N57+Q57+R57+H57+P57+J6ICfXCJdLFxuW1wiZDc0MFwiLFwi6ICe6ICb6IGH6IGD6IGI6ISY6ISl6ISZ6ISb6ISt6ISf6ISs6ISe6ISh6ISV6ISn6ISd6ISi6IiR6Ii46Iiz6Ii66Ii06Iiy6Im06I6Q6I6j6I6o6I6N6I266I2z6I6k6I206I6P6I6B6I6V6I6Z6I216I6U6I6p6I296I6D6I6M6I6d6I6b6I6q6I6L6I2+6I6l6I6v6I6I6I6X6I6w6I2/6I6m6I6H6I6u6I226I6a6JmZ6JmW6Jq/6Jq3XCJdLFxuW1wiZDdhMVwiLFwi6JuC6JuB6JuF6Jq66Jqw6JuI6Jq56Jqz6Jq46JuM6Jq06Jq76Jq86JuD6Jq96Jq+6KGS6KKJ6KKV6KKo6KKi6KKq6KKa6KKR6KKh6KKf6KKY6KKn6KKZ6KKb6KKX6KKk6KKs6KKM6KKT6KKO6KaC6KeW6KeZ6KeV6Kiw6Kin6Kis6Kie6LC56LC76LGc6LGd6LG96LKl6LW96LW76LW56La86LeC6La56La/6LeB6LuY6Lue6Lud6Luc6LuX6Lug6Luh6YCk6YCL6YCR6YCc6YCM6YCh6YOv6YOq6YOw6YO06YOy6YOz6YOU6YOr6YOs6YOp6YWW6YWY6YWa6YWT6YWV6Yes6Ye06Yex6Yez6Ye46Yek6Ye56YeqXCJdLFxuW1wiZDg0MFwiLFwi6Yer6Ye36Yeo6Yeu6ZW66ZaG6ZaI6Zm86Zmt6Zmr6Zmx6Zmv6Zq/6Z2q6aCE6aOl6aaX5YKb5YKV5YKU5YKe5YKL5YKj5YKD5YKM5YKO5YKd5YGo5YKc5YKS5YKC5YKH5YWf5YeU5YyS5YyR5Y6k5Y6n5ZaR5Zao5Zal5Zat5ZW35ZmF5Zai5ZaT5ZaI5ZaP5Za15ZaB5Zaj5ZaS5Zak5ZW95ZaM5Zam5ZW/5ZaV5Zah5ZaO5ZyM5aCp5aC3XCJdLFxuW1wiZDhhMVwiLFwi5aCZ5aCe5aCn5aCj5aCo5Z+15aGI5aCl5aCc5aCb5aCz5aC/5aC25aCu5aC55aC45aCt5aCs5aC75aWh5aqv5aqU5aqf5am65aqi5aqe5am45aqm5am85aql5aqs5aqV5aqu5ai35aqE5aqK5aqX5aqD5aqL5aqp5am75am95aqM5aqc5aqP5aqT5aqd5a+q5a+N5a+L5a+U5a+R5a+K5a+O5bCM5bCw5bS35bWD5bWr5bWB5bWL5bS/5bS15bWR5bWO5bWV5bSz5bS65bWS5bS95bSx5bWZ5bWC5bS55bWJ5bS45bS85bSy5bS25bWA5bWF5bmE5bmB5b2Y5b6m5b6l5b6r5oOJ5oK55oOM5oOi5oOO5oOE5oSUXCJdLFxuW1wiZDk0MFwiLFwi5oOy5oSK5oSW5oSF5oO15oST5oO45oO85oO+5oOB5oSD5oSY5oSd5oSQ5oO/5oSE5oSL5omK5o6U5o6x5o6w5o+O5o+l5o+o5o+v5o+D5pKd5o+z5o+K5o+g5o+25o+V5o+y5o+15pGh5o+f5o6+5o+d5o+c5o+E5o+Y5o+T5o+C5o+H5o+M5o+L5o+I5o+w5o+X5o+Z5pSy5pWn5pWq5pWk5pWc5pWo5pWl5paM5pad5pae5pau5peQ5peSXCJdLFxuW1wiZDlhMVwiLFwi5pm85pms5pm75pqA5pmx5pm55pmq5pmy5pyB5qSM5qOT5qSE5qOc5qSq5qOs5qOq5qOx5qSP5qOW5qO35qOr5qOk5qO25qST5qSQ5qOz5qOh5qSH5qOM5qSI5qWw5qK05qSR5qOv5qOG5qSU5qO45qOQ5qO95qO85qOo5qSL5qSK5qSX5qOO5qOI5qOd5qOe5qOm5qO05qOR5qSG5qOU5qOp5qSV5qSl5qOH5qy55qy75qy/5qy85q6U5q6X5q6Z5q6V5q695q+w5q+y5q+z5rCw5re85rmG5rmH5rif5rmJ5rqI5ri85ri95rmF5rmi5rir5ri/5rmB5rmd5rmz5ric5riz5rmL5rmA5rmR5ri75riD5riu5rmeXCJdLFxuW1wiZGE0MFwiLFwi5rmo5rmc5rmh5rix5rio5rmg5rmx5rmr5ri55rii5riw5rmT5rml5rin5rm45rmk5rm35rmV5rm55rmS5rmm5ri15ri25rma54Sg54Se54Sv54O754Su54Sx54Sj54Sl54Si54Sy54Sf54So54S654Sb54mL54ma54qI54qJ54qG54qF54qL54yS54yL54yw54yi54yx54yz54yn54yy54yt54ym54yj54y154yM55Cu55Cs55Cw55Cr55CWXCJdLFxuW1wiZGFhMVwiLFwi55Ca55Ch55Ct55Cx55Ck55Cj55Cd55Cp55Cg55Cy55O755Sv55Wv55Ws55en55ea55eh55em55ed55ef55ek55eX55qV55qS55ua552G552H552E552N552F552K552O552L552M55+e55+s56Gg56Gk56Gl56Gc56Gt56Gx56Gq56Gu56Gw56Gp56Go56Ge56Gi56W056Wz56Wy56Ww56iC56iK56iD56iM56iE56qZ56um56uk562K56y7562E562I562M562O562A562Y562F57Ki57Ke57Ko57Kh57WY57Wv57Wj57WT57WW57Wn57Wq57WP57Wt57Wc57Wr57WS57WU57Wp57WR57Wf57WO57y+57y/572lXCJdLFxuW1wiZGI0MFwiLFwi572m576i576g576h57+X6IGR6IGP6IGQ6IO+6IOU6IWD6IWK6IWS6IWP6IWH6IS96IWN6IS66Iem6Ieu6Ie36Ie46Ie56IiE6Ii86Ii96Ii/6Im16Iy76I+P6I+56JCj6I+A6I+o6JCS6I+n6I+k6I+86I+26JCQ6I+G6I+I6I+r6I+j6I6/6JCB6I+d6I+l6I+Y6I+/6I+h6I+L6I+O6I+W6I+16I+J6JCJ6JCP6I+e6JCR6JCG6I+C6I+zXCJdLFxuW1wiZGJhMVwiLFwi6I+V6I+66I+H6I+R6I+q6JCT6I+D6I+s6I+u6I+E6I+76I+X6I+i6JCb6I+b6I++6JuY6Jui6Jum6JuT6Juj6Jua6Juq6Jud6Jur6Juc6Jus6Jup6JuX6Juo6JuR6KGI6KGW6KGV6KK66KOX6KK56KK46KOA6KK+6KK26KK86KK36KK96KKy6KSB6KOJ6KaV6KaY6KaX6Ked6Kea6Keb6KmO6KmN6Ki56KmZ6KmA6KmX6KmY6KmE6KmF6KmS6KmI6KmR6KmK6KmM6KmP6LGf6LKB6LKA6LK66LK+6LKw6LK56LK16LaE6LaA6LaJ6LeY6LeT6LeN6LeH6LeW6Lec6LeP6LeV6LeZ6LeI6LeX6LeF6Luv6Lu36Lu6XCJdLFxuW1wiZGM0MFwiLFwi6Lu56Lum6Luu6Lul6Lu16Lun6Luo6Lu26Lur6Lux6Lus6Lu06Lup6YCt6YC06YCv6YSG6YSs6YSE6YO/6YO86YSI6YO56YO76YSB6YSA6YSH6YSF6YSD6YWh6YWk6YWf6YWi6YWg6YiB6YiK6Yil6YiD6Yia6Yim6YiP6YiM6YiA6YiS6Ye/6Ye96YiG6YiE6Yin6YiC6Yic6Yik6YiZ6YiX6YiF6YiW6ZW76ZaN6ZaM6ZaQ6ZqH6Zm+6ZqIXCJdLFxuW1wiZGNhMVwiLFwi6ZqJ6ZqD6ZqA6ZuC6ZuI6ZuD6Zux6Zuw6Z2s6Z2w6Z2u6aCH6aKp6aOr6bOm6bu55LqD5LqE5Lq25YK95YK/5YOG5YKu5YOE5YOK5YK05YOI5YOC5YKw5YOB5YK65YKx5YOL5YOJ5YK25YK45YeX5Ym65Ym45Ym75Ym85ZeD5Zeb5ZeM5ZeQ5ZeL5ZeK5Zed5ZeA5ZeU5ZeE5Zep5Za/5ZeS5ZaN5ZeP5ZeV5Zei5ZeW5ZeI5Zey5ZeN5ZeZ5ZeC5ZyU5aGT5aGo5aGk5aGP5aGN5aGJ5aGv5aGV5aGO5aGd5aGZ5aGl5aGb5aC95aGj5aGx5aO85auH5auE5auL5aq65aq45aqx5aq15aqw5aq/5auI5aq75auGXCJdLFxuW1wiZGQ0MFwiLFwi5aq35auA5auK5aq05aq25auN5aq55aqQ5a+W5a+Y5a+Z5bCf5bCz5bWx5bWj5bWK5bWl5bWy5bWs5bWe5bWo5bWn5bWi5bew5bmP5bmO5bmK5bmN5bmL5buF5buM5buG5buL5buH5b2A5b6v5b6t5oO35oWJ5oWK5oSr5oWF5oS25oSy5oSu5oWG5oSv5oWP5oSp5oWA5oig6YWo5oij5oil5oik5o+F5o+x5o+r5pCQ5pCS5pCJ5pCg5pCkXCJdLFxuW1wiZGRhMVwiLFwi5pCz5pGD5pCf5pCV5pCY5pC55pC35pCi5pCj5pCM5pCm5pCw5pCo5pGB5pC15pCv5pCK5pCa5pGA5pCl5pCn5pCL5o+n5pCb5pCu5pCh5pCO5pWv5paS5peT5pqG5pqM5pqV5pqQ5pqL5pqK5pqZ5pqU5pm45pyg5qWm5qWf5qS45qWO5qWi5qWx5qS/5qWF5qWq5qS55qWC5qWX5qWZ5qW65qWI5qWJ5qS15qWs5qSz5qS95qWl5qOw5qW45qS05qWp5qWA5qWv5qWE5qW25qWY5qWB5qW05qWM5qS75qWL5qS35qWc5qWP5qWR5qSy5qWS5qSv5qW75qS85q2G5q2F5q2D5q2C5q2I5q2B5q6b76iN5q+75q+8XCJdLFxuW1wiZGU0MFwiLFwi5q+55q+35q+45rqb5ruW5ruI5rqP5ruA5rqf5rqT5rqU5rqg5rqx5rq55ruG5ruS5rq95ruB5rqe5ruJ5rq35rqw5ruN5rqm5ruP5rqy5rq+5ruD5ruc5ruY5rqZ5rqS5rqO5rqN5rqk5rqh5rq/5rqz5ruQ5ruK5rqX5rqu5rqj54WH54WU54WS54Wj54Wg54WB54Wd54Wi54Wy54W454Wq54Wh54WC54WY54WD54WL54Ww54Wf54WQ54WTXCJdLFxuW1wiZGVhMVwiLFwi54WE54WN54Wa54mP54qN54qM54qR54qQ54qO54y8542C54y754y6542A542K542J55GE55GK55GL55GS55GR55GX55GA55GP55GQ55GO55GC55GG55GN55GU55Oh55O/55O+55O955Sd55W555W35qaD55ev55iP55iD55e355e+55e855e555e455iQ55e755e255et55e155e955qZ55q155ud552V552f552g552S552W552a552p552n552U552Z552t55+g56KH56Ka56KU56KP56KE56KV56KF56KG56Kh56KD56G556KZ56KA56KW56G756W856aC56W956W556iR56iY56iZ56iS56iX56iV56ii56iTXCJdLFxuW1wiZGY0MFwiLFwi56ib56iQ56qj56qi56qe56ur562m562k562t5620562p562y562l562z562x562w562h56245622562j57Ky57K057Kv57aI57aG57aA57aN57W/57aF57W657aO57W757aD57W857aM57aU57aE57W957aS572t572r572n572o572s576m576l576n57+b57+c6ICh6IWk6IWg6IW36IWc6IWp6IWb6IWi6IWy5pyh6IWe6IW26IWn6IWvXCJdLFxuW1wiZGZhMVwiLFwi6IWE6IWh6Iid6ImJ6ImE6ImA6ImC6ImF6JOx6JC/6JGW6JG26JG56JKP6JKN6JGl6JGR6JGA6JKG6JGn6JCw6JGN6JG96JGa6JGZ6JG06JGz6JGd6JSH6JGe6JC36JC66JC06JG66JGD6JG46JCy6JGF6JCp6I+Z6JGL6JCv6JGC6JCt6JGf6JGw6JC56JGO6JGM6JGS6JGv6JOF6JKO6JC76JGH6JC26JCz6JGo6JG+6JGE6JCr6JGg6JGU6JGu6JGQ6JyL6JyE6Ju36JyM6Ju66JuW6Ju16J2N6Ju46JyO6JyJ6JyB6Ju26JyN6JyF6KOW6KOL6KON6KOO6KOe6KOb6KOa6KOM6KOQ6KaF6Kab6Kef6Kel6KekXCJdLFxuW1wiZTA0MFwiLFwi6Keh6Keg6Kei6Kec6Kem6Km26KqG6Km/6Kmh6Ki/6Km36KqC6KqE6Km16KqD6KqB6Km06Km66LC86LGL6LGK6LGl6LGk6LGm6LKG6LKE6LKF6LOM6LWo6LWp6LaR6LaM6LaO6LaP6LaN6LaT6LaU6LaQ6LaS6Lew6Leg6Les6Lex6Leu6LeQ6Lep6Lej6Lei6Len6Ley6Ler6Le06LyG6Lu/6LyB6LyA6LyF6LyH6LyI6LyC6LyL6YGS6YC/XCJdLFxuW1wiZTBhMVwiLFwi6YGE6YGJ6YC96YSQ6YSN6YSP6YSR6YSW6YSU6YSL6YSO6YWu6YWv6YmI6YmS6Yiw6Yi66Ymm6Yiz6Yml6Yme6YqD6Yiu6YmK6YmG6Ymt6Yms6YmP6Ymg6Ymn6Ymv6Yi26Ymh6Ymw6Yix6YmU6Ymj6YmQ6Ymy6YmO6YmT6YmM6YmW6Yiy6Zaf6Zac6Zae6Zab6ZqS6ZqT6ZqR6ZqX6ZuO6Zu66Zu96Zu46Zu16Z2z6Z236Z246Z2y6aCP6aCN6aCO6aKs6aO26aO56aav6aay6aaw6aa16aqt6aqr6a2b6bOq6bOt6bOn6bqA6bu95YOm5YOU5YOX5YOo5YOz5YOb5YOq5YOd5YOk5YOT5YOs5YOw5YOv5YOj5YOgXCJdLFxuW1wiZTE0MFwiLFwi5YeY5YqA5YqB5Yup5Yur5Yyw5Y6s5Zin5ZiV5ZiM5ZiS5Ze85ZiP5Zic5ZiB5ZiT5ZiC5Ze65Zid5ZiE5Ze/5Ze55aKJ5aG85aKQ5aKY5aKG5aKB5aG/5aG05aKL5aG65aKH5aKR5aKO5aG25aKC5aKI5aG75aKU5aKP5aO+5aWr5auc5auu5aul5auV5auq5aua5aut5aur5auz5aui5aug5aub5aus5aue5aud5auZ5auo5auf5a235a+gXCJdLFxuW1wiZTFhMVwiLFwi5a+j5bGj5baC5baA5bW95baG5bW65baB5bW35baK5baJ5baI5bW+5bW85baN5bW55bW/5bmY5bmZ5bmT5buY5buR5buX5buO5buc5buV5buZ5buS5buU5b2E5b2D5b2v5b625oSs5oSo5oWB5oWe5oWx5oWz5oWS5oWT5oWy5oWs5oaA5oW05oWU5oW65oWb5oWl5oS75oWq5oWh5oWW5oip5oin5oir5pCr5pGN5pGb5pGd5pG05pG25pGy5pGz5pG95pG15pGm5pKm5pGO5pKC5pGe5pGc5pGL5pGT5pGg5pGQ5pG/5pC/5pGs5pGr5pGZ5pGl5pG35pWz5pag5pqh5pqg5pqf5pyF5pyE5pyi5qax5qa25qeJXCJdLFxuW1wiZTI0MFwiLFwi5qag5qeO5qaW5qaw5qas5qa85qaR5qaZ5qaO5qan5qaN5qap5qa+5qav5qa/5qeE5qa95qak5qeU5qa55qeK5qaa5qeP5qaz5qaT5qaq5qah5qae5qeZ5qaX5qaQ5qeC5qa15qal5qeG5q2K5q2N5q2L5q6e5q6f5q6g5q+D5q+E5q++5ruO5ru15rux5ryD5ryl5ru45ry35ru75ryu5ryJ5r2O5ryZ5rya5ryn5ryY5ry75ryS5rut5ryKXCJdLFxuW1wiZTJhMVwiLFwi5ry25r2z5ru55ruu5ryt5r2A5ryw5ry85ry15rur5ryH5ryO5r2D5ryF5ru95ru25ry55ryc5ru85ry65ryf5ryN5rye5ryI5ryh54aH54aQ54aJ54aA54aF54aC54aP54W754aG54aB54aX54mE54mT54qX54qV54qT542D542N542R542M55Gi55Gz55Gx55G155Gy55Gn55Gu55SA55SC55SD55W955aQ55iW55iI55iM55iV55iR55iK55iU55q4556B5528556F556C552u556A552v552+556D56Ky56Kq56K056Kt56Ko56G+56Kr56Ke56Kl56Kg56Ks56Ki56Kk56aY56aK56aL56aW56aV56aU56aTXCJdLFxuW1wiZTM0MFwiLFwi56aX56aI56aS56aQ56ir56mK56iw56iv56io56im56qo56qr56qs56uu566I566c566K566R566Q566W566N566M566b566O566F566Y5YqE566Z566k566C57K757K/57K857K657an57a357eC57aj57aq57eB57eA57eF57ad57eO57eE57eG57eL57eM57av57a557aW57a857af57am57au57ap57ah57eJ572z57+i57+j57+l57+eXCJdLFxuW1wiZTNhMVwiLFwi6ICk6IGd6IGc6IaJ6IaG6IaD6IaH6IaN6IaM6IaL6IiV6JKX6JKk6JKh6JKf6JK66JOO6JOC6JKs6JKu6JKr6JK56JK06JOB6JON6JKq6JKa6JKx6JOQ6JKd6JKn6JK76JKi6JKU6JOH6JOM6JKb6JKp6JKv6JKo6JOW6JKY6JK26JOP6JKg6JOX6JOU6JOS6JOb6JKw6JKR6Jmh6Jyz6Jyj6Jyo6J2r6J2A6Jyu6Jye6Jyh6JyZ6Jyb6J2D6Jys6J2B6Jy+6J2G6Jyg6Jyy6Jyq6Jyt6Jy86JyS6Jy66Jyx6Jy16J2C6Jym6Jyn6Jy46Jyk6Jya6Jyw6JyR6KO36KOn6KOx6KOy6KO66KO+6KOu6KO86KO26KO7XCJdLFxuW1wiZTQ0MFwiLFwi6KOw6KOs6KOr6Kad6Kah6Kaf6Kae6Kep6Ker6Keo6Kqr6KqZ6KqL6KqS6KqP6KqW6LC96LGo6LGp6LOV6LOP6LOX6LaW6LiJ6LiC6Le/6LiN6Le96LiK6LiD6LiH6LiG6LiF6Le+6LiA6LiE6LyQ6LyR6LyO6LyN6YSj6YSc6YSg6YSi6YSf6YSd6YSa6YSk6YSh6YSb6YW66YWy6YW56YWz6Yql6Yqk6Ym26Yqb6Ym66Yqg6YqU6Yqq6YqNXCJdLFxuW1wiZTRhMVwiLFwi6Yqm6Yqa6Yqr6Ym56YqX6Ym/6Yqj6Yuu6YqO6YqC6YqV6Yqi6Ym96YqI6Yqh6YqK6YqG6YqM6YqZ6Yqn6Ym+6YqH6Yqp6Yqd6YqL6Yit6Zqe6Zqh6Zu/6Z2Y6Z296Z266Z2+6Z6D6Z6A6Z6C6Z276Z6E6Z6B6Z2/6Z+O6Z+N6aCW6aKt6aKu6aSC6aSA6aSH6aad6aac6aeD6aa56aa76aa66aeC6aa96aeH6aqx6auj6aun6ay+6ay/6a2g6a2h6a2f6bOx6bOy6bO16bqn5YO/5YSD5YSw5YO45YSG5YSH5YO25YO+5YSL5YSM5YO95YSK5YqL5YqM5Yux5Yuv5ZmI5ZmC5ZmM5Zi15ZmB5ZmK5ZmJ5ZmG5ZmYXCJdLFxuW1wiZTU0MFwiLFwi5Zma5ZmA5Ziz5Zi95Zis5Zi+5Zi45Ziq5Zi65Zya5aKr5aKd5aKx5aKg5aKj5aKv5aKs5aKl5aKh5aO/5au/5au05au95au35au25ayD5au45ayC5au55ayB5ayH5ayF5ayP5bGn5baZ5baX5baf5baS5bai5baT5baV5bag5bac5bah5baa5bae5bmp5bmd5bmg5bmc57ez5bub5bue5buh5b2J5b6y5oaL5oaD5oW55oax5oaw5oai5oaJXCJdLFxuW1wiZTVhMVwiLFwi5oab5oaT5oav5oat5oaf5oaS5oaq5oah5oaN5oWm5oaz5oit5pGu5pGw5pKW5pKg5pKF5pKX5pKc5pKP5pKL5pKK5pKM5pKj5pKf5pGo5pKx5pKY5pW25pW65pW55pW75pay5paz5pq15pqw5pqp5pqy5pq35pqq5pqv5qiA5qiG5qiX5qel5qe45qiV5qex5qek5qig5qe/5qes5qei5qib5qid5qe+5qin5qey5qeu5qiU5qe35qen5qmA5qiI5qem5qe75qiN5qe85qer5qiJ5qiE5qiY5qil5qiP5qe25qim5qiH5qe05qiW5q2R5q6l5q6j5q6i5q6m5rCB5rCA5q+/5rCC5r2B5rym5r2+5r6H5r+G5r6SXCJdLFxuW1wiZTY0MFwiLFwi5r6N5r6J5r6M5r2i5r2P5r6F5r2a5r6W5r225r2s5r6C5r2V5r2y5r2S5r2Q5r2X5r6U5r6T5r2d5ryA5r2h5r2r5r295r2n5r6Q5r2T5r6L5r2p5r2/5r6V5r2j5r235r2q5r2754ay54av54ab54aw54ag54aa54ap54a154ad54al54ae54ak54ah54aq54ac54an54az54qY54qa542Y542S542e542f542g542d542b542h542a542ZXCJdLFxuW1wiZTZhMVwiLFwi542i55KH55KJ55KK55KG55KB55G955KF55KI55G855G555SI55SH55W+55il55ie55iZ55id55ic55ij55ia55io55ib55qc55qd55qe55qb556N556P556J556I56ON56K756OP56OM56OR56OO56OU56OI56OD56OE56OJ56aa56ah56ag56ac56ai56ab5q2256i556qy56q056qz566356+L566+566s56+O566v566556+K566157OF57OI57OM57OL57e357eb57eq57en57eX57eh57iD57e657em57e257ex57ew57eu57ef5722576s576w576t57+t57+r57+q57+s57+m57+o6IGk6IGn6Iaj6IafXCJdLFxuW1wiZTc0MFwiLFwi6Iae6IaV6Iai6IaZ6IaX6IiW6ImP6ImT6ImS6ImQ6ImO6ImR6JSk6JS76JSP6JSA6JSp6JSO6JSJ6JSN6JSf6JSK6JSn6JSc6JO76JSr6JO66JSI6JSM6JO06JSq6JOy6JSV6JO36JOr6JOz6JO86JSS6JOq6JOp6JSW6JO+6JSo6JSd6JSu6JSC6JO96JSe6JO26JSx6JSm6JOn6JOo6JOw6JOv6JO56JSY6JSg6JSw6JSL6JSZ6JSv6JmiXCJdLFxuW1wiZTdhMVwiLFwi6J2W6J2j6J2k6J236J+h6J2z6J2Y6J2U6J2b6J2S6J2h6J2a6J2R6J2e6J2t6J2q6J2Q6J2O6J2f6J2d6J2v6J2s6J266J2u6J2c6J2l6J2P6J276J216J2i6J2n6J2p6KGa6KSF6KSM6KSU6KSL6KSX6KSY6KSZ6KSG6KSW6KSR6KSO6KSJ6Kai6Kak6Kaj6Ket6Kew6Kes6KuP6KuG6Kq46KuT6KuR6KuU6KuV6Kq76KuX6Kq+6KuA6KuF6KuY6KuD6Kq66Kq96KuZ6LC+6LGN6LKP6LOl6LOf6LOZ6LOo6LOa6LOd6LOn6Lag6Lac6Lah6Lab6Lig6Lij6Lil6Lik6Liu6LiV6Lib6LiW6LiR6LiZ6Lim6LinXCJdLFxuW1wiZTg0MFwiLFwi6LiU6LiS6LiY6LiT6Lic6LiX6Lia6Lys6Lyk6LyY6Lya6Lyg6Lyj6LyW6LyX6YGz6YGw6YGv6YGn6YGr6YSv6YSr6YSp6YSq6YSy6YSm6YSu6YaF6YaG6YaK6YaB6YaC6YaE6YaA6YuQ6YuD6YuE6YuA6YuZ6Yq26YuP6Yux6Yuf6YuY6Yup6YuX6Yud6YuM6Yuv6YuC6Yuo6YuK6YuI6YuO6Yum6YuN6YuV6YuJ6Yug6Yue6Yun6YuR6YuTXCJdLFxuW1wiZThhMVwiLFwi6Yq16Yuh6YuG6Yq06ZW86Zas6Zar6Zau6Zaw6Zqk6Zqi6ZuT6ZyF6ZyI6ZyC6Z2a6Z6K6Z6O6Z6I6Z+Q6Z+P6aCe6aCd6aCm6aCp6aCo6aCg6aCb6aCn6aKy6aSI6aO66aSR6aSU6aSW6aSX6aSV6aec6aeN6aeP6aeT6aeU6aeO6aeJ6aeW6aeY6aeL6aeX6aeM6aqz6aus6aur6auz6auy6aux6a2G6a2D6a2n6a206a2x6a2m6a226a216a2w6a2o6a2k6a2s6bO86bO66bO96bO/6bO36bSH6bSA6bO56bO76bSI6bSF6bSE6bqD6buT6byP6byQ5YSc5YST5YSX5YSa5YSR5Yee5Yy05Y+h5Zmw5Zmg5ZmuXCJdLFxuW1wiZTk0MFwiLFwi5Zmz5Zmm5Zmj5Zmt5Zmy5Zme5Zm35Zyc5Zyb5aOI5aK95aOJ5aK/5aK65aOC5aK85aOG5ayX5ayZ5ayb5ayh5ayU5ayT5ayQ5ayW5ayo5aya5ayg5aye5a+v5bas5bax5bap5ban5ba15baw5bau5baq5bao5bay5bat5bav5ba05bmn5bmo5bmm5bmv5bup5bun5bum5buo5bul5b2L5b685oad5oao5oaW5oeF5oa05oeG5oeB5oeM5oa6XCJdLFxuW1wiZTlhMVwiLFwi5oa/5oa45oaM5pOX5pOW5pOQ5pOP5pOJ5pK95pKJ5pOD5pOb5pOz5pOZ5pSz5pW/5pW85pai5puI5pq+5puA5puK5puL5puP5pq95pq75pq65puM5pyj5qi05qmm5qmJ5qmn5qiy5qmo5qi+5qmd5qmt5qm25qmb5qmR5qio5qma5qi75qi/5qmB5qmq5qmk5qmQ5qmP5qmU5qmv5qmp5qmg5qi85qme5qmW5qmV5qmN5qmO5qmG5q2V5q2U5q2W5q6n5q6q5q6r5q+I5q+H5rCE5rCD5rCG5r6t5r+L5r6j5r+H5r685r+O5r+I5r2e5r+E5r695r6e5r+K5r6o54CE5r6l5r6u5r665r6s5r6q5r+P5r6/5r64XCJdLFxuW1wiZWE0MFwiLFwi5r6i5r+J5r6r5r+N5r6v5r6y5r6w54eF54eC54a/54a454eW54eA54eB54eL54eU54eK54eH54eP54a954eY54a854eG54ea54eb54qd54qe542p542m542n542s542l542r542q55G/55Ka55Kg55KU55KS55KV55Kh55SL55aA55iv55it55ix55i955iz55i855i155iy55iw55q755um556a556d556h556c556b556i556j556V556ZXCJdLFxuW1wiZWFhMVwiLFwi556X56Od56Op56Ol56Oq56Oe56Oj56Ob56Oh56Oi56Ot56Of56Og56ak56mE56mI56mH56q256q456q156qx56q356+e56+j56+n56+d56+V56+l56+a56+o56+556+U56+q56+i56+c56+r56+Y56+f57OS57OU57OX57OQ57OR57iS57ih57iX57iM57if57ig57iT57iO57ic57iV57ia57ii57iL57iP57iW57iN57iU57il57ik572D572757285726576x57+v6ICq6ICp6IGs6Iax6Iam6Iau6Ia56Ia16Iar6Iaw6Ias6Ia06Iay6Ia36Ian6Iey6ImV6ImW6ImX6JWW6JWF6JWr6JWN6JWT6JWh6JWYXCJdLFxuW1wiZWI0MFwiLFwi6JWA6JWG6JWk6JWB6JWi6JWE6JWR6JWH6JWj6JS+6JWb6JWx6JWO6JWu6JW16JWV6JWn6JWg6JaM6JWm6JWd6JWU6JWl6JWs6Jmj6Jml6Jmk6J6b6J6P6J6X6J6T6J6S6J6I6J6B6J6W6J6Y6J256J6H6J6j6J6F6J6Q6J6R6J6d6J6E6J6U6J6c6J6a6J6J6KSe6KSm6KSw6KSt6KSu6KSn6KSx6KSi6KSp6KSj6KSv6KSs6KSf6Kex6KugXCJdLFxuW1wiZWJhMVwiLFwi6Kui6Kuy6Ku06Ku16Kud6KyU6Kuk6Kuf6Kuw6KuI6Kue6Kuh6Kuo6Ku/6Kuv6Ku76LKR6LKS6LKQ6LO16LOu6LOx6LOw6LOz6LWs6LWu6Lal6Lan6Liz6Li+6Li46LmA6LmF6Li26Li86Li96LmB6Liw6Li/6Lq96Ly26Lyu6Ly16Lyy6Ly56Ly36Ly06YG26YG56YG76YKG6YO66YSz6YS16YS26YaT6YaQ6YaR6YaN6YaP6Yyn6Yye6YyI6Yyf6YyG6YyP6Y266Yy46Yy86Yyb6Yyj6YyS6YyB6Y2G6Yyt6YyO6YyN6YuL6Yyd6Yu66Yyl6YyT6Yu56Yu36Yy06YyC6Yyk6Yu/6Yyp6Yy56Yy16Yyq6YyU6YyMXCJdLFxuW1wiZWM0MFwiLFwi6YyL6Yu+6YyJ6YyA6Yu76YyW6Za86ZeN6Za+6Za56Za66Za26Za/6Za16Za96Zqp6ZuU6ZyL6ZyS6ZyQ6Z6Z6Z6X6Z6U6Z+w6Z+46aC16aCv6aCy6aSk6aSf6aSn6aSp6aae6aeu6aes6ael6aek6aew6aej6aeq6aep6aen6aq56aq/6aq06aq76au26au66au56au36ayz6a6A6a6F6a6H6a286a2+6a276a6C6a6T6a6S6a6Q6a266a6VXCJdLFxuW1wiZWNhMVwiLFwi6a296a6I6bSl6bSX6bSg6bSe6bSU6bSp6bSd6bSY6bSi6bSQ6bSZ6bSf6bqI6bqG6bqH6bqu6bqt6buV6buW6bu66byS6by95YSm5YSl5YSi5YSk5YSg5YSp5Yu05ZqT5ZqM5ZqN5ZqG5ZqE5ZqD5Zm+5ZqC5Zm/5ZqB5aOW5aOU5aOP5aOS5ayt5ayl5ayy5ayj5ays5ayn5aym5ayv5ayu5a275a+x5a+y5ba35bms5bmq5b6+5b675oeD5oa15oa85oen5oeg5oel5oek5oeo5oee5pOv5pOp5pOj5pOr5pOk5pOo5paB5paA5pa25pea5puS5qqN5qqW5qqB5qql5qqJ5qqf5qqb5qqh5qqe5qqH5qqT5qqOXCJdLFxuW1wiZWQ0MFwiLFwi5qqV5qqD5qqo5qqk5qqR5qm/5qqm5qqa5qqF5qqM5qqS5q2b5q6t5rCJ5r+M5r6p5r+05r+U5r+j5r+c5r+t5r+n5r+m5r+e5r+y5r+d5r+i5r+o54eh54ex54eo54ey54ek54ew54ei542z542u542v55KX55Ky55Kr55KQ55Kq55Kt55Kx55Kl55Kv55SQ55SR55SS55SP55aE55mD55mI55mJ55mH55qk55up5561556r556y55635562XCJdLFxuW1wiZWRhMVwiLFwi5560556x556o55+w56Oz56O956SC56O756O856Oy56SF56O556O+56SE56ar56ao56mc56mb56mW56mY56mU56ma56q+56uA56uB57CF57CP56+y57CA56+/56+757CO56+057CL56+z57CC57CJ57CD57CB56+456+957CG56+w56+x57CQ57CK57Oo57it57i857mC57iz6aGI57i457iq57mJ57mA57mH57ip57mM57iw57i757i257mE57i6572F572/572+572957+057+y6ICs6Ia76IeE6IeM6IeK6IeF6IeH6Ia86Iep6Imb6Ima6Imc6JaD6JaA6JaP6Jan6JaV6Jag6JaL6Jaj6JW76Jak6Jaa6JaeXCJdLFxuW1wiZWU0MFwiLFwi6JW36JW86JaJ6Jah6JW66JW46JWX6JaO6JaW6JaG6JaN6JaZ6Jad6JaB6Jai6JaC6JaI6JaF6JW56JW26JaY6JaQ6Jaf6Jmo6J6+6J6q6J6t6J+F6J6w6J6s6J656J616J686J6u6J+J6J+D6J+C6J+M6J636J6v6J+E6J+K6J606J626J6/6J646J696J+e6J6y6KS16KSz6KS86KS+6KWB6KWS6KS36KWC6Kat6Kav6Kau6Key6Kez6KyeXCJdLFxuW1wiZWVhMVwiLFwi6KyY6KyW6KyR6KyF6KyL6Kyi6KyP6KyS6KyV6KyH6KyN6KyI6KyG6Kyc6KyT6Kya6LGP6LGw6LGy6LGx6LGv6LKV6LKU6LO56LWv6LmO6LmN6LmT6LmQ6LmM6LmH6L2D6L2A6YKF6YG+6YS46Yaa6Yai6Yab6YaZ6Yaf6Yah6Yad6Yag6Y6h6Y6D6Y6v6Y2k6Y2W6Y2H6Y286Y2Y6Y2c6Y226Y2J6Y2Q6Y2R6Y2g6Y2t6Y6P6Y2M6Y2q6Y256Y2X6Y2V6Y2S6Y2P6Y2x6Y236Y276Y2h6Y2e6Y2j6Y2n6Y6A6Y2O6Y2Z6ZeH6ZeA6ZeJ6ZeD6ZeF6Za36Zqu6Zqw6Zqs6Zyg6Zyf6ZyY6Zyd6ZyZ6Z6a6Z6h6Z6cXCJdLFxuW1wiZWY0MFwiLFwi6Z6e6Z6d6Z+V6Z+U6Z+x6aGB6aGE6aGK6aGJ6aGF6aGD6aSl6aSr6aSs6aSq6aSz6aSy6aSv6aSt6aSx6aSw6aaY6aaj6aah6aiC6ae66ae06ae36ae56ae46ae26ae76ae96ae+6ae86aiD6aq+6au+6au96ayB6au86a2I6a6a6a6o6a6e6a6b6a6m6a6h6a6l6a6k6a6G6a6i6a6g6a6v6bSz6bWB6bWn6bS26bSu6bSv6bSx6bS46bSwXCJdLFxuW1wiZWZhMVwiLFwi6bWF6bWC6bWD6bS+6bS36bWA6bS957+16bSt6bqK6bqJ6bqN6bqw6buI6bua6bu76bu/6byk6byj6byi6b2U6b6g5YSx5YSt5YSu5ZqY5Zqc5ZqX5Zqa5Zqd5ZqZ5aWw5ay85bGp5bGq5beA5bmt5bmu5oeY5oef5oet5oeu5oex5oeq5oew5oer5oeW5oep5pO/5pSE5pO95pO45pSB5pSD5pO85paU5peb5pua5pub5puY5quF5qq55qq95quh5quG5qq65qq25qq35quH5qq05qqt5q2e5q+J5rCL54CH54CM54CN54CB54CF54CU54CO5r+/54CA5r+754Cm5r+85r+354CK54iB54e/54e554iD54e95422XCJdLFxuW1wiZjA0MFwiLFwi55K455OA55K155OB55K+55K255K755OC55SU55ST55mc55mk55mZ55mQ55mT55mX55ma55qm55q955us55+C556656O/56SM56ST56SU56SJ56SQ56SS56SR56at56as56mf57Cc57Cp57CZ57Cg57Cf57Ct57Cd57Cm57Co57Ci57Cl57Cw57mc57mQ57mW57mj57mY57mi57mf57mR57mg57mX57mT5761576z57+357+46IG16IeR6IeSXCJdLFxuW1wiZjBhMVwiLFwi6IeQ6Imf6Ime6Ja06JeG6JeA6JeD6JeC6Jaz6Ja16Ja96JeH6JeE6Ja/6JeL6JeO6JeI6JeF6Jax6Ja26JeS6Jik6Ja46Ja36Ja+6Jmp6J+n6J+m6J+i6J+b6J+r6J+q6J+l6J+f6J+z6J+k6J+U6J+c6J+T6J+t6J+Y6J+j6J6k6J+X6J+Z6KCB6J+06J+o6J+d6KWT6KWL6KWP6KWM6KWG6KWQ6KWR6KWJ6Kyq6Kyn6Kyj6Kyz6Kyw6Ky16K2H6Kyv6Ky86Ky+6Kyx6Kyl6Ky36Kym6Ky26Kyu6Kyk6Ky76Ky96Ky66LGC6LG16LKZ6LKY6LKX6LO+6LSE6LSC6LSA6Lmc6Lmi6Lmg6LmX6LmW6Lme6Lml6LmnXCJdLFxuW1wiZjE0MFwiLFwi6Lmb6Lma6Lmh6Lmd6Lmp6LmU6L2G6L2H6L2I6L2L6YSo6YS66YS76YS+6Yao6Yal6Yan6Yav6Yaq6Y616Y6M6Y6S6Y636Y6b6Y6d6Y6J6Y6n6Y6O6Y6q6Y6e6Y6m6Y6V6Y6I6Y6Z6Y6f6Y6N6Y6x6Y6R6Y6y6Y6k6Y6o6Y606Y6j6Y6l6ZeS6ZeT6ZeR6Zqz6ZuX6Zua5beC6Zuf6ZuY6Zud6Zyj6Zyi6Zyl6Z6s6Z6u6Z6o6Z6r6Z6k6Z6qXCJdLFxuW1wiZjFhMVwiLFwi6Z6i6Z6l6Z+X6Z+Z6Z+W6Z+Y6Z+66aGQ6aGR6aGS6aK46aWB6aS86aS66aiP6aiL6aiJ6aiN6aiE6aiR6aiK6aiF6aiH6aiG6auA6auc6ayI6ayE6ayF6ayp6ay16a2K6a2M6a2L6a+H6a+G6a+D6a6/6a+B6a616a646a+T6a626a+E6a656a696bWc6bWT6bWP6bWK6bWb6bWL6bWZ6bWW6bWM6bWX6bWS6bWU6bWf6bWY6bWa6bqO6bqM6buf6byB6byA6byW6byl6byr6byq6byp6byo6b2M6b2V5YS05YS15YqW5Yu35Y605Zqr5Zqt5Zqm5Zqn5Zqq5Zqs5aOa5aOd5aOb5aSS5ay95ay+5ay/5beD5bmwXCJdLFxuW1wiZjI0MFwiLFwi5b6/5oe75pSH5pSQ5pSN5pSJ5pSM5pSO5paE5pee5ped5pue5qun5qug5quM5quR5quZ5quL5quf5quc5quQ5qur5quP5quN5que5q2g5q6w5rCM54CZ54Cn54Cg54CW54Cr54Ch54Ci54Cj54Cp54CX54Ck54Cc54Cq54iM54iK54iH54iC54iF54ql54qm54qk54qj54qh55OL55OF55K355OD55SW55mg55+J55+K55+E55+x56Sd56SbXCJdLFxuW1wiZjJhMVwiLFwi56Sh56Sc56SX56Se56aw56mn56mo57Cz57C857C557Cs57C757Os57Oq57m257m157m457mw57m357mv57m657my57m057mo572L572K576D576G576357+957++6IG46IeX6IeV6Imk6Imh6Imj6Jer6Jex6Jet6JeZ6Jeh6Jeo6Jea6JeX6Jes6Jey6Je46JeY6Jef6Jej6Jec6JeR6Jew6Jem6Jev6Jee6Jei6KCA6J+66KCD6J+26J+36KCJ6KCM6KCL6KCG6J+86KCI6J+/6KCK6KCC6KWi6KWa6KWb6KWX6KWh6KWc6KWY6KWd6KWZ6KaI6Ka36Ka26Ke26K2Q6K2I6K2K6K2A6K2T6K2W6K2U6K2L6K2VXCJdLFxuW1wiZjM0MFwiLFwi6K2R6K2C6K2S6K2X6LGD6LG36LG26LKa6LSG6LSH6LSJ6Las6Laq6Lat6Lar6Lmt6Lm46Lmz6Lmq6Lmv6Lm76LuC6L2S6L2R6L2P6L2Q6L2T6L606YWA6YS/6Yaw6Yat6Y+e6Y+H6Y+P6Y+C6Y+a6Y+Q6Y+56Y+s6Y+M6Y+Z6Y6p6Y+m6Y+K6Y+U6Y+u6Y+j6Y+V6Y+E6Y+O6Y+A6Y+S6Y+n6ZW96Zea6Zeb6Zuh6Zyp6Zyr6Zys6Zyo6ZymXCJdLFxuW1wiZjNhMVwiLFwi6Z6z6Z636Z626Z+d6Z+e6Z+f6aGc6aGZ6aGd6aGX6aK/6aK96aK76aK+6aWI6aWH6aWD6aam6aan6aia6aiV6ail6aid6aik6aib6aii6aig6ain6aij6aie6aic6aiU6auC6ayL6ayK6ayO6ayM6ay36a+q6a+r6a+g6a+e6a+k6a+m6a+i6a+w6a+U6a+X6a+s6a+c6a+Z6a+l6a+V6a+h6a+a6bW36baB6baK6baE6baI6bWx6baA6bW46baG6baL6baM6bW96bWr6bW06bW16bWw6bWp6baF6bWz6bW76baC6bWv6bW56bW/6baH6bWo6bqU6bqR6buA6bu86byt6b2A6b2B6b2N6b2W6b2X6b2Y5Yy35ZqyXCJdLFxuW1wiZjQ0MFwiLFwi5Zq15Zqz5aOj5a2F5beG5beH5buu5buv5b+A5b+B5oe55pSX5pSW5pSV5pST5pef5puo5puj5puk5quz5quw5quq5quo5qu55qux5quu5quv54C854C154Cv54C354C054Cx54GC54C454C/54C654C554GA54C754Cz54GB54iT54iU54qo5429542855K655qr55qq55q+55ut55+M55+O55+P55+N55+y56Sl56Sj56Sn56So56Sk56SpXCJdLFxuW1wiZjRhMVwiLFwi56ay56mu56ms56mt56u357GJ57GI57GK57GH57GF57Ou57m757m+57qB57qA576657+/6IG56Ieb6IeZ6IiL6Imo6Imp6Jii6Je/6JiB6Je+6Jib6JiA6Je26JiE6JiJ6JiF6JiM6Je96KCZ6KCQ6KCR6KCX6KCT6KCW6KWj6KWm6Ka56Ke36K2g6K2q6K2d6K2o6K2j6K2l6K2n6K2t6Lau6LqG6LqI6LqE6L2Z6L2W6L2X6L2V6L2Y6L2a6YKN6YWD6YWB6Ya36Ya16Yay6Yaz6ZCL6ZCT6Y+76ZCg6ZCP6ZCU6Y++6ZCV6ZCQ6ZCo6ZCZ6ZCN6Y+16ZCA6Y+36ZCH6ZCO6ZCW6ZCS6Y+66ZCJ6Y+46ZCK6Y+/XCJdLFxuW1wiZjU0MFwiLFwi6Y+86ZCM6Y+26ZCR6ZCG6Zee6Zeg6Zef6Zyu6Zyv6Z656Z676Z+96Z++6aGg6aGi6aGj6aGf6aOB6aOC6aWQ6aWO6aWZ6aWM6aWL6aWT6aiy6ai06aix6ais6aiq6ai26aip6aiu6ai46ait6auH6auK6auG6ayQ6ayS6ayR6bCL6bCI6a+36bCF6bCS6a+46bGA6bCH6bCO6bCG6bCX6bCU6bCJ6baf6baZ6bak6bad6baS6baY6baQ6babXCJdLFxuW1wiZjVhMVwiLFwi6bag6baU6bac6baq6baX6bah6baa6bai6bao6bae6baj6ba/6bap6baW6bam6ban6bqZ6bqb6bqa6bul6buk6bun6bum6byw6byu6b2b6b2g6b2e6b2d6b2Z6b6R5YS65YS55YqY5YqX5ZuD5Zq95Zq+5a2I5a2H5beL5beP5bux5oe95pSb5qyC5qu85qyD5qu45qyA54GD54GE54GK54GI54GJ54GF54GG54id54ia54iZ542+55SX55mq55+Q56St56Sx56Sv57GU57GT57Oy57qK57qH57qI57qL57qG57qN572N57676ICw6Ied6JiY6Jiq6Jim6Jif6Jij6Jic6JiZ6Jin6Jiu6Jih6Jig6Jip6Jie6JilXCJdLFxuW1wiZjY0MFwiLFwi6KCp6KCd6KCb6KCg6KCk6KCc6KCr6KGK6KWt6KWp6KWu6KWr6Ke66K256K246K2F6K266K276LSQ6LSU6Lav6LqO6LqM6L2e6L2b6L2d6YWG6YWE6YWF6Ya56ZC/6ZC76ZC26ZCp6ZC96ZC86ZCw6ZC56ZCq6ZC36ZCs6ZGA6ZCx6Zel6Zek6Zej6Zy16Zy66Z6/6Z+h6aGk6aOJ6aOG6aOA6aWY6aWW6ai56ai96amG6amE6amC6amB6ai6XCJdLFxuW1wiZjZhMVwiLFwi6ai/6auN6ayV6ayX6ayY6ayW6ay66a2S6bCr6bCd6bCc6bCs6bCj6bCo6bCp6bCk6bCh6ba36ba26ba86beB6beH6beK6beP6ba+6beF6beD6ba76ba16beO6ba56ba66bas6beI6bax6bat6beM6baz6beN6bay6bm66bqc6bur6buu6but6byb6byY6bya6byx6b2O6b2l6b2k6b6S5Lq55ZuG5ZuF5ZuL5aWx5a2L5a2M5beV5beR5buy5pSh5pSg5pSm5pSi5qyL5qyI5qyJ5rCN54GV54GW54GX54GS54ie54if54qp542/55OY55OV55OZ55OX55mt55qt56S156a056mw56mx57GX57Gc57GZ57Gb57GaXCJdLFxuW1wiZjc0MFwiLFwi57O057Ox57qR572P576H6Iee6Imr6Ji06Ji16Jiz6Jis6Jiy6Ji26KCs6KCo6KCm6KCq6KCl6KWx6Ka/6Ka+6Ke76K2+6K6E6K6C6K6G6K6F6K2/6LSV6LqV6LqU6Lqa6LqS6LqQ6LqW6LqX6L2g6L2i6YWH6ZGM6ZGQ6ZGK6ZGL6ZGP6ZGH6ZGF6ZGI6ZGJ6ZGG6Zy/6Z+j6aGq6aGp6aOL6aWU6aWb6amO6amT6amU6amM6amP6amI6amKXCJdLFxuW1wiZjdhMVwiLFwi6amJ6amS6amQ6auQ6ayZ6ayr6ay76a2W6a2V6bGG6bGI6bC/6bGE6bC56bCz6bGB6bC86bC36bC06bCy6bC96bC26beb6beS6bee6bea6beL6beQ6bec6beR6bef6bep6beZ6beY6beW6be16beV6bed6bq26buw6by16byz6byy6b2C6b2r6b6V6b6i5YS95YqZ5aOo5aOn5aWy5a2N5beY6KCv5b2P5oiB5oiD5oiE5pSp5pSl5paW5pur5qyR5qyS5qyP5q+K54Gb54Ga54ii546C546B546D55mw55+U57Gn57Gm57qV6Ims6Ji66JmA6Ji56Ji86Jix6Ji76Ji+6KCw6KCy6KCu6KCz6KW26KW06KWz6Ke+XCJdLFxuW1wiZjg0MFwiLFwi6K6M6K6O6K6L6K6I6LGF6LSZ6LqY6L2k6L2j6Ya86ZGi6ZGV6ZGd6ZGX6ZGe6Z+E6Z+F6aCA6amW6amZ6aye6ayf6ayg6bGS6bGY6bGQ6bGK6bGN6bGL6bGV6bGZ6bGM6bGO6be76be36bev6bej6ber6be46bek6be26beh6beu6bem6bey6bew6bei6bes6be06bez6beo6bet6buC6buQ6buy6buz6byG6byc6by46by36by26b2D6b2PXCJdLFxuW1wiZjhhMVwiLFwi6b2x6b2w6b2u6b2v5ZuT5ZuN5a2O5bGt5pSt5put5puu5qyT54Gf54Gh54Gd54Gg54ij55Ob55Ol55+V56S456a356a257Gq57qX576J6Imt6JmD6KC46KC36KC16KGL6K6U6K6V6Lqe6Lqf6Lqg6Lqd6Ya+6Ya96YeC6ZGr6ZGo6ZGp6Zul6Z2G6Z2D6Z2H6Z+H6Z+l6ame6auV6a2Z6bGj6bGn6bGm6bGi6bGe6bGg6biC6be+6biH6biD6biG6biF6biA6biB6biJ6be/6be96biE6bqg6bye6b2G6b206b216b225ZuU5pSu5pa45qyY5qyZ5qyX5qya54Gi54im54qq55+Y55+Z56S557Gp57Gr57O257qaXCJdLFxuW1wiZjk0MFwiLFwi57qY57qb57qZ6Ieg6Ieh6JmG6JmH6JmI6KW56KW66KW86KW76Ke/6K6Y6K6Z6Lql6Lqk6Lqj6ZGu6ZGt6ZGv6ZGx6ZGz6Z2J6aGy6aWf6bGo6bGu6bGt6biL6biN6biQ6biP6biS6biR6bqh6bu16byJ6b2H6b246b276b266b255Zye54Gm57Gv6KC86Lay6Lqm6YeD6ZG06ZG46ZG26ZG16amg6bG06bGz6bGx6bG16biU6biT6bu26byKXCJdLFxuW1wiZjlhMVwiLFwi6b6k54Go54Gl57O36Jmq6KC+6KC96KC/6K6e6LKc6Lqp6LuJ6Z2L6aGz6aG06aOM6aWh6aar6amk6amm6amn6ayk6biV6biX6b2I5oiH5qye54in6JmM6Lqo6ZKC6ZKA6ZKB6amp6amo6ayu6biZ54ip6JmL6K6f6ZKD6bG56bq355m16amr6bG66bid54Gp54Gq6bqk6b2+6b2J6b6Y56KB6Yq56KOP5aK75oGS57Kn5au64pWU4pWm4pWX4pWg4pWs4pWj4pWa4pWp4pWd4pWS4pWk4pWV4pWe4pWq4pWh4pWY4pWn4pWb4pWT4pWl4pWW4pWf4pWr4pWi4pWZ4pWo4pWc4pWR4pWQ4pWt4pWu4pWw4pWv4paTXCJdXG5dXG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCIwXCIsXCJcXHUwMDAwXCIsMTI3XSxcbltcIjhlYTFcIixcIu+9oVwiLDYyXSxcbltcImExYTFcIixcIuOAgOOAgeOAgu+8jO+8juODu++8mu+8m++8n++8geOCm+OCnMK0772AwqjvvL7vv6PvvL/jg73jg77jgp3jgp7jgIPku53jgIXjgIbjgIfjg7zigJXigJDvvI/vvLzvvZ7iiKXvvZzigKbigKXigJjigJnigJzigJ3vvIjvvInjgJTjgJXvvLvvvL3vvZvvvZ3jgIhcIiw5LFwi77yL77yNwrHDl8O377yd4omg77yc77ye4omm4omn4oie4oi04pmC4pmAwrDigLLigLPihIPvv6XvvITvv6Dvv6HvvIXvvIPvvIbvvIrvvKDCp+KYhuKYheKXi+KXj+KXjuKXh1wiXSxcbltcImEyYTFcIixcIuKXhuKWoeKWoOKWs+KWsuKWveKWvOKAu+OAkuKGkuKGkOKGkeKGk+OAk1wiXSxcbltcImEyYmFcIixcIuKIiOKIi+KKhuKKh+KKguKKg+KIquKIqVwiXSxcbltcImEyY2FcIixcIuKIp+KIqO+/ouKHkuKHlOKIgOKIg1wiXSxcbltcImEyZGNcIixcIuKIoOKKpeKMkuKIguKIh+KJoeKJkuKJquKJq+KImuKIveKIneKIteKIq+KIrFwiXSxcbltcImEyZjJcIixcIuKEq+KAsOKZr+KZreKZquKAoOKAocK2XCJdLFxuW1wiYTJmZVwiLFwi4pevXCJdLFxuW1wiYTNiMFwiLFwi77yQXCIsOV0sXG5bXCJhM2MxXCIsXCLvvKFcIiwyNV0sXG5bXCJhM2UxXCIsXCLvvYFcIiwyNV0sXG5bXCJhNGExXCIsXCLjgYFcIiw4Ml0sXG5bXCJhNWExXCIsXCLjgqFcIiw4NV0sXG5bXCJhNmExXCIsXCLOkVwiLDE2LFwizqNcIiw2XSxcbltcImE2YzFcIixcIs6xXCIsMTYsXCLPg1wiLDZdLFxuW1wiYTdhMVwiLFwi0JBcIiw1LFwi0IHQllwiLDI1XSxcbltcImE3ZDFcIixcItCwXCIsNSxcItGR0LZcIiwyNV0sXG5bXCJhOGExXCIsXCLilIDilILilIzilJDilJjilJTilJzilKzilKTilLTilLzilIHilIPilI/ilJPilJvilJfilKPilLPilKvilLvilYvilKDilK/ilKjilLfilL/ilJ3ilLDilKXilLjilYJcIl0sXG5bXCJhZGExXCIsXCLikaBcIiwxOSxcIuKFoFwiLDldLFxuW1wiYWRjMFwiLFwi442J44yU44yi442N44yY44yn44yD44y2442R442X44yN44ym44yj44yr442K44y7446c446d446e446O446P44+E446hXCJdLFxuW1wiYWRkZlwiLFwi442744Cd44Cf4oSW44+N4oSh44qkXCIsNCxcIuOIseOIsuOIueONvuONveONvOKJkuKJoeKIq+KIruKIkeKImuKKpeKIoOKIn+KKv+KIteKIqeKIqlwiXSxcbltcImIwYTFcIixcIuS6nOWUluWog+mYv+WTgOaEm+aMqOWntumAouiRteiMnOepkOaCquaPoea4peaXreiRpuiKpumvteaik+Wcp+aWoeaJseWum+WnkOiZu+mjtOe1oue2vumujuaIlueyn+iit+WuieW6teaMieaal+ahiOmXh+mejeadj+S7peS8iuS9jeS+neWBieWbsuWkt+WnlOWogeWwieaDn+aEj+aFsOaYk+akheeCuueVj+eVsOenu+e2ree3r+iDg+iQjuiho+isgumBlemBuuWMu+S6leS6peWfn+iCsumDgeejr+S4gOWjsea6oumAuOeosuiMqOiKi+mwr+WFgeWNsOWSveWToeWboOWnu+W8lemjsua3q+iDpOiUrVwiXSxcbltcImIxYTFcIixcIumZoumZsOmaoOmfu+WQi+WPs+Wuh+eDj+e+vei/gumbqOWNr+m1nOequuS4keeik+iHvOa4puWYmOWUhOasneiUmumwu+WnpeWOqea1pueTnOmWj+WZguS6kemBi+mbsuiNj+mkjOWPoeWWtuWssOW9seaYoOabs+aghOawuOazs+a0qeeRm+ebiOepjumgtOiLseihm+ipoOmLrea2sueWq+ebiumnheaCpuisgei2iumWsuamjuWOreWGhuWckuWgsOWlhOWutOW7tuaAqOaOqeaPtOayv+a8lOeCjueElOeFmeeHleeMv+e4geiJtuiLkeiWl+mBoOmJm+m0m+WhqeaWvOaxmueUpeWHueWkruWlpeW+gOW/nFwiXSxcbltcImIyYTFcIixcIuaKvOaXuuaoquasp+autOeOi+e/geillum0rOm0jum7hOWyoeayluiNu+WEhOWxi+aGtuiHhuahtueJoeS5meS/uuWNuOaBqea4qeepj+mfs+S4i+WMluS7ruS9leS8veS+oeS9s+WKoOWPr+WYieWkj+WrgeWutuWvoeenkeaah+aenOaetuatjOays+eBq+ePguemjeemvueovOeuh+iKseiLm+iMhOiNt+iPr+iPk+idpuiqsuWYqeiyqOi/pumBjumcnuiaiuS/hOWzqOaIkeeJmeeUu+iHpeiKveibvuizgOmbhemkk+mnleS7i+S8muino+WbnuWhiuWjiuW7u+W/q+aAquaClOaBouaHkOaIkuaLkOaUuVwiXSxcbltcImIzYTFcIixcIumtgeaZpuaisOa1t+eBsOeVjOeahue1teiKpeifuemWi+majuiyneWHseWKvuWkluWSs+Wus+W0luaFqOamgua2r+eijeiTi+ihl+ipsumOp+mquOa1rOmmqOibmeWeo+afv+ibjumIjuWKg+Wah+WQhOW7k+aLoeaSueagvOaguOauu+eNsueiuuepq+immuinkui1q+i8g+mDremWo+malOmdqeWtpuWys+alvemhjemhjuaOm+esoOaoq+apv+aitumwjea9n+WJsuWWneaBsOaLrOa0u+a4h+a7keiRm+ikkOi9hOS4lOmwueWPtuakm+aouumehOagquWFnOerg+iSsumHnOmOjOWZm+m0qOagouiMheiQsVwiXSxcbltcImI0YTFcIixcIueypeWIiOiLheeTpuS5vuS+g+WGoOWvkuWIiuWLmOWLp+W3u+WWmuWgquWnpuWujOWumOWvm+W5suW5ueaCo+aEn+aFo+aGvuaPm+aVouafkeahk+ajuuasvuatk+axl+a8oua+l+a9heeSsOeUmOebo+eci+erv+euoeewoee3qee8tue/sOiCneiJpuiOnuims+irjOiyq+mChOmRkemWk+mWkemWoumZpemfk+mkqOiImOS4uOWQq+WyuOW3jOeOqeeZjOecvOWyqee/q+i0i+mbgemgkemhlOmhmOS8geS8juWNseWWnOWZqOWfuuWlh+WsieWvhOWykOW4jOW5vuW/jOaPruacuuaXl+aXouacn+aji+ajhFwiXSxcbltcImI1YTFcIixcIuapn+W4sOavheawl+axveeVv+eliOWto+eogOe0gOW+veimj+iomOiytOi1t+i7jOi8nemjoumojumsvOS6gOWBveWEgOWmk+WunOaIr+aKgOaTrOasuueKoOeWkeelh+e+qeifu+iqvOitsOaOrOiPiumeoOWQieWQg+WWq+ahlOapmOipsOegp+adtem7jeWNtOWuouiEmuiZkOmAhuS4mOS5heS7h+S8keWPiuWQuOWuruW8k+aApeaVkeacveaxguaxsuazo+eBuOeQg+eptueqruesiOe0muezvue1puaXp+eJm+WOu+WxheW3qOaLkuaLoOaMmea4oOiZmuiosei3nemLuOa8geempumtmuS6qOS6q+S6rFwiXSxcbltcImI2YTFcIixcIuS+m+S+oOWDkeWFh+ertuWFseWHtuWNlOWMoeWNv+WPq+WWrOWig+WzoeW8t+W9iuaAr+aBkOaBreaMn+aVmeapi+azgeeLgueLreefr+iDuOiEheiIiOiVjumDt+mPoemfv+mll+mpmuS7sOWHneWwreaagealreWxgOabsualteeOieahkOeygeWDheWLpOWdh+W3vumMpuaWpOaso+asveeQtOemgeemveeti+e3iuiKueiPjOihv+iln+isuei/kemHkeWQn+mKgOS5neWAtuWPpeWMuueLl+eOluefqeiLpui6r+mnhumniOmnkuWFt+aEmuiZnuWWsOepuuWBtuWvk+mBh+maheS4suarm+mHp+WxkeWxiFwiXSxcbltcImI3YTFcIixcIuaOmOeqn+ayk+mdtOi9oeeqqueGiumaiOeyguagl+e5sOahkemNrOWLsuWQm+iWq+iok+e+pOi7jemDoeWNpuiiiOelgeS/guWCvuWIkeWFhOWVk+WcreePquWei+WlkeW9ouW+hOaBteaFtuaFp+aGqeaOsuaQuuaVrOaZr+ahgua4k+eVpueoveezu+e1jOe2mee5i+e9q+iMjuiNiuibjeioiOipo+itpui7vemgmum2j+iKuOi/jumvqOWKh+aIn+aSg+a/gOmameahgeWCkeasoOaxuua9lOeptOe1kOihgOioo+aciOS7tuWAueWApuWBpeWFvOWIuOWJo+WWp+Wcj+WgheWrjOW7uuaGsuaHuOaLs+aNslwiXSxcbltcImI4YTFcIixcIuaknOaoqeeJveeKrOeMrueglOehr+e1ueecjOiCqeimi+ismeizoui7kumBo+mNtemZuumhlemok+m5uOWFg+WOn+WOs+W5u+W8pua4m+a6kOeOhOePvue1g+iIt+iogOiruumZkOS5juWAi+WPpOWRvOWbuuWnkeWtpOW3seW6q+W8p+aIuOaVheaer+a5lueLkOeziuiitOiCoeiDoeiPsOiZjuiqh+i3qOmIt+mbh+mhp+m8k+S6lOS6kuS8jeWNiOWRieWQvuWor+W+jOW+oeaCn+aip+aqjueRmueigeiqnuiqpOitt+mGkOS5numvieS6pOS9vOS+r+WAmeWAluWFieWFrOWKn+WKueWLvuWOmuWPo+WQkVwiXSxcbltcImI5YTFcIixcIuWQjuWWieWdkeWeouWlveWtlOWtneWuj+W3peW3p+W3t+W5uOW6g+W6muW6t+W8mOaBkuaFjOaKl+aLmOaOp+aUu+aYguaZg+abtOadreagoeail+ani+axn+a0qua1qea4r+a6neeUsueah+ehrOeov+ezoOe0hee0mOe1nue2seiAleiAg+iCr+iCseiFlOiGj+iIquiNkuihjOihoeism+iyouizvOmDiumFtemJseegv+mLvOmWpOmZjemghemmmemrmOm0u+WJm+WKq+WPt+WQiOWjleaLt+a/oOixqui9n+m6ueWFi+WIu+WRiuWbveepgOmFt+m1oOm7kueNhOa8ieiFsOeUkeW/veaDmumqqOeLm+i+vFwiXSxcbltcImJhYTFcIixcIuatpOmgg+S7iuWbsOWdpOWivuWpmuaBqOaHh+aYj+aYhuagueaisea3t+eXlee0uuiJrumtguS6m+S9kOWPieWUhuW1r+W3puW3ruafu+aymeeRs+egguipkOmOluijn+WdkOW6p+aMq+WCteWCrOWGjeacgOWTieWhnuWmu+WusOW9qeaJjeaOoeagveats+a4iOeBvemHh+eKgOegleegpuelreaWjue0sOiPnOijgei8iemam+WJpOWcqOadkOe9quiyoeWGtOWdgumYquWguuamiuiCtOWSsuW0juWfvOeilem3uuS9nOWJiuWSi+aQvuaYqOaclOafteeqhOetlue0oumMr+ahnOmureesueWMmeWGiuWIt1wiXSxcbltcImJiYTFcIixcIuWvn+aLtuaSruaTpuacreauuuiWqembkeeakOmvluaNjOmMhumuq+eav+aZkuS4ieWCmOWPguWxseaDqOaSkuaVo+ahn+eHpuePiueUo+eul+e6guialeiug+izm+mFuOmkkOaWrOaaq+aui+S7leS7lOS8uuS9v+WIuuWPuOWPsuWXo+Wbm+Wjq+Wni+WnieWnv+WtkOWxjeW4guW4q+W/l+aAneaMh+aUr+WtnOaWr+aWveaXqOaeneatouatu+awj+eNheelieengeezuOe0mee0q+iCouiEguiHs+imluipnuipqeippuiqjOirruizh+iznOmbjOmjvOatr+S6i+S8vOS+jeWFkOWtl+WvuuaFiOaMgeaZglwiXSxcbltcImJjYTFcIixcIuasoea7i+ayu+eIvueSveeXlOejgeekuuiAjOiAs+iHquiSlOi+nuaxkOm5v+W8j+itmOm0q+eruui7uOWujembq+S4g+WPseWft+WkseWrieWupOaCiea5v+a8hueWvuizquWun+iUgOevoOWBsuaftOiKneWxoeiViue4nuiIjuWGmeWwhOaNqOi1puaWnOeFruekvue0l+iAheisnei7iumBruibh+mCquWAn+WLuuWwuuadk+eBvOeItemFjOmHiOmMq+iLpeWvguW8seaDueS4u+WPluWuiOaJi+acseauiueLqeePoOeoruiFq+i2o+mFkummluWEkuWPl+WRquWvv+aOiOaouee2rOmcgOWbmuWPjuWRqFwiXSxcbltcImJkYTFcIixcIuWul+WwseW3nuS/ruaEgeaLvua0suengOeni+e1gue5jee/kuiHreiIn+iSkOihhuilsuiukOi5tOi8r+mAsemFi+mFrOmbhumGnOS7gOS9j+WFheWNgeW+k+aIjuaflOaxgea4i+eNo+e4pumHjemKg+WPlOWkmeWuv+a3keelnee4rueym+WhvueGn+WHuuihk+i/sOS/iuWzu+aYpeeerOero+iInOmnv+WHhuW+quaXrOalr+auiea3s+a6lua9pOebvue0lOW3oemBtemGh+mghuWHpuWIneaJgOaakeabmea4muW6tue3kue9suabuOiWr+iXt+iruOWKqeWPmeWls+W6j+W+kOaBlemLpOmZpOWCt+WEn1wiXSxcbltcImJlYTFcIixcIuWLneWMoOWNh+WPrOWTqOWVhuWUseWYl+WlqOWmvuWovOWuteWwhuWwj+WwkeWwmuW6hOW6iuW7oOW9sOaJv+aKhOaLm+aOjOaNt+aYh+aYjOaYreaZtuadvuaiouaon+aoteayvOa2iOa4iea5mOeEvOeEpueFp+eXh+ecgeehneekgeelpeensOeroOeskeeyp+e0ueiCluiPluiSi+iVieihneijs+ion+iovOiplOips+ixoeiznumGpOmJpumNvumQmOmanOmemOS4iuS4iOS4nuS5l+WGl+WJsOWfjuWgtOWjjOWsouW4uOaDheaTvuadoeadlua1hOeKtueVs+epo+iSuOitsumGuOmMoOWYseWftOmjvlwiXSxcbltcImJmYTFcIixcIuaLreakjeaulueHree5lOiBt+iJsuinpumjn+idlei+seWwu+S8uOS/oeS+teWUh+WooOWvneWvqeW/g+aFjuaMr+aWsOaZi+ajruamm+a1uOa3seeUs+eWueecn+elnuenpue0s+iHo+iKr+iWquimquiouui6q+i+m+mAsumHnemch+S6uuS7geWIg+WhteWjrOWwi+eUmuWwveiFjuioiui/hemZo+mdreespeirj+mgiOmFouWbs+WOqOmAl+WQueWeguW4peaOqOawtOeCiuedoeeyi+e/oOihsOmBgumFlOmMkOmMmOmaj+eRnumrhOW0h+W1qeaVsOaeoui2qOmbm+aNruadieakmeiPhemgl+mbgOijvlwiXSxcbltcImMwYTFcIixcIua+hOaRuuWvuOS4lueArOeVneaYr+WHhOWItuWLouWnk+W+geaAp+aIkOaUv+aVtOaYn+aZtOajsuagluato+a4heeJsueUn+ebm+eyvuiBluWjsOijveilv+iqoOiqk+iri+mAnemGkumdkumdmeaWieeojuiEhumau+W4reaDnOaImuaWpeaYlOaekOefs+epjeexjee4vuiEiuiyrOi1pOi3oei5n+eiqeWIh+aLmeaOpeaRguaKmOioreeqg+evgOiqrOmbque1tuiIjOidieS7meWFiOWNg+WNoOWuo+WwguWwluW3neaIpuaJh+aSsOagk+agtOaziea1hea0l+afk+a9nOeFjueFveaXi+epv+euree3mlwiXSxcbltcImMxYTFcIixcIue5iue+qOiFuuiIm+iIueiWpuipruizjui3temBuOmBt+mKremKkemWg+muruWJjeWWhOa8uOeEtuWFqOemhee5leiGs+ezjuWZjOWhkeWyqOaOquabvuabvealmueLmeeWj+eWjuekjuelluenn+eyl+e0oOe1hOiYh+iotOmYu+mBoem8oOWDp+WJteWPjOWPouWAieWWquWjruWlj+eIveWui+WxpOWMneaDo+aDs+aNnOaOg+aMv+aOu+aTjeaXqeabueW3o+anjeanvea8leeHpeS6ieeXqeebuOeqk+ezn+e3j+e2nOiBoeiNieiNmOiRrOiSvOiXu+ijhei1sOmAgemBremOl+mcnOmokuWDj+Wil+aGjlwiXSxcbltcImMyYTFcIixcIuiHk+iUtei0iOmAoOS/g+WBtOWJh+WNs+aBr+aNieadn+a4rOi2s+mAn+S/l+WxnuiziuaXj+e2muWNkuiiluWFtuaPg+WtmOWtq+WwiuaQjeadkemBnOS7luWkmuWkquaxsOipkeWUvuWgleWmpeaDsOaJk+afgeiIteallemZgOmnhOmoqOS9k+WghuWvvuiAkOWyseW4r+W+heaAoOaFi+aItOabv+azsOa7nuiDjuiFv+iLlOiii+iyuOmAgOmArumaium7m+mvm+S7o+WPsOWkp+esrOmGjemhjOm3uea7neeAp+WNk+WVhOWuheaJmOaKnuaLk+ayoua/r+eQouiol+mQuOa/geirvuiMuOWHp+ibuOWPqlwiXSxcbltcImMzYTFcIixcIuWPqeS9humBlOi+sOWlquiEseW3veerqui+v+ajmuiwt+eLuOmxiOaoveiqsOS4ueWNmOWYhuWdpuaLheaOouaXpuatjua3oea5m+eCreefreerr+euque2u+iAveiDhuibi+iqlemNm+Wbo+Wjh+W8vuaWreaaluaqgOauteeUt+irh+WApOefpeWcsOW8m+aBpeaZuuaxoOeXtOeomue9ruiHtOicmOmBhemms+evieeVnOerueetkeiThOmAkOenqeeqkuiMtuWroeedgOS4reS7suWumeW/oOaKveaYvOafseazqOiZq+iht+iou+mFjumLs+mnkOaol+eApueMquiLp+iRl+iyr+S4geWFhuWHi+WWi+WvtVwiXSxcbltcImM0YTFcIixcIuW4luW4s+W6geW8lOW8teW9q+W+tOaHsuaMkeaaouacnea9rueJkueUuuecuuiBtOiEueiFuOidtuiqv+irnOi2hei3s+mKmumVt+mggumzpeWLheaNl+ebtOacleayiOePjeizg+mOrumZs+a0peWinOakjuanjOi/vemOmueXm+mAmuWhmuagguaOtOanu+S9g+a8rOafmOi+u+iUpue2tOmNlOakv+a9sOWdquWjt+WsrOe0rOeIquWQiumHo+m2tOS6reS9juWBnOWBteWJg+iynuWRiOWgpOWumuW4neW6leW6reW7t+W8n+aCjOaKteaMuuaPkOair+axgOeih+emjueoi+e3oOiJh+ioguirpui5hOmAk1wiXSxcbltcImM1YTFcIixcIumCuOmEremHmOm8juazpeaRmOaTouaVtea7tOeahOesm+mBqemPkea6uuWTsuW+ueaSpOi9jei/remJhOWFuOWhq+WkqeWxleW6l+a3u+e6j+eUnOiyvOi7oumhm+eCueS8neauv+a+seeUsOmbu+WFjuWQkOWgteWhl+WmrOWxoOW+kuaWl+adnOa4oeeZu+iPn+izremAlOmDvemNjeegpeeguuWKquW6puWcn+WltOaAkuWAkuWFmuWGrOWHjeWIgOWUkOWhlOWhmOWll+WuleWztuW2i+aCvOaKleaQreadseahg+aivOajn+ebl+a3mOa5r+a2m+eBr+eHiOW9k+eXmOelt+etieetlOetkuezlue1seWIsFwiXSxcbltcImM2YTFcIixcIuiRo+iVqeiXpOiojuishOixhui4j+mAg+mAj+mQmemZtumgremosOmXmOWDjeWLleWQjOWgguWwjuaGp+aSnua0nuees+erpeiDtOiQhOmBk+mKheWzoOm0h+WMv+W+l+W+s+a2nOeJueedo+emv+evpOavkueLrOiqreagg+apoeWHuOeqgeaktOWxiumztuiLq+WvhemFieeAnuWZuOWxr+aDh+aVpuayjOixmumBgemgk+WRkeabh+mIjeWliOmCo+WGheS5jeWHquiWmeisjueBmOaNuumNi+aloummtOe4hOeVt+WNl+aloOi7n+mbo+axneS6jOWwvOW8kOi/qeWMguizkeiCieiZueW7v+aXpeS5s+WFpVwiXSxcbltcImM3YTFcIixcIuWmguWwv+mfruS7u+WmiuW/jeiqjea/oeemsOelouWvp+iRseeMq+eGseW5tOW/teaNu+aSmueHg+eymOS5g+W7vOS5i+WfnOWaouaCqea/g+e0jeiDveiEs+iGv+i+suiml+iapOW3tOaKiuaSreimh+adt+azoua0vueQtuegtOWphue9teiKremmrOS/s+W7g+aLneaOkuaVl+adr+ebg+eJjOiDjOiCuui8qemFjeWAjeWfueWqkuaiheals+eFpOeLveiyt+WjsuizoOmZqumAmeidv+enpOefp+iQqeS8r+WJpeWNmuaLjeafj+aziueZveeulOeyleiItuiWhOi/q+abnea8oOeIhue4m+iOq+mngem6plwiXSxcbltcImM4YTFcIixcIuWHveeuseehsueuuOiCh+etiOarqOW5oeiCjOeVkeeVoOWFq+mJoua6jOeZuumGl+mrquS8kOe9sOaKnOetj+mWpemzqeWZuuWhmeibpOmavOS8tOWIpOWNiuWPjeWPm+W4huaQrOaWkeadv+awvuaxjueJiOeKr+ePreeVlOe5geiIrOiXqeiyqeevhOmHhueFqemgkumjr+aMveaZqeeVquebpOejkOiVg+ibruWMquWNkeWQpuWmg+W6h+W9vOaCsuaJieaJueaKq+aWkOavlOazjOeWsuearueikeenmOe3i+e9t+iCpeiiq+iqueiyu+mBv+mdnumjm+aoi+ewuOWCmeWwvuW+ruaeh+avmOeQteeciee+jlwiXSxcbltcImM5YTFcIixcIum8u+afiueol+WMueeWi+mrreW9puiGneiPseiCmOW8vOW/heeVouethumAvOahp+Wnq+Wqm+e0kOeZvuisrOS/teW9quaomeawt+a8gueTouelqOihqOipleixueW7n+aPj+eXheenkuiLl+mMqOmLsuiSnOibremwreWTgeW9rOaWjOa1nOeAleiyp+izk+mgu+aVj+eTtuS4jeS7mOWfoOWkq+WppuWvjOWGqOW4g+W6nOaAluaJtuaVt+aWp+aZrua1rueItuespuiFkOiGmuiKmeitnOiyoOizpui1tOmYnOmZhOS+ruaSq+atpuiInuiRoeiVqumDqOWwgealk+miqOiRuuiVl+S8j+WJr+W+qeW5heacjVwiXSxcbltcImNhYTFcIixcIuemj+iFueikh+imhua3teW8l+aJleayuOS7j+eJqemukuWIhuWQu+WZtOWis+aGpOaJrueEmuWlrueyieeznue0m+mbsOaWh+iBnuS4meS9teWFteWhgOW5o+W5s+W8iuafhOS4puiUvemWiemZm+exs+mggeWDu+WjgeeZlueip+WIpeeepeiUkeeuhuWBj+WkieeJh+evh+e3qOi+uui/lOmBjeS+v+WLieWoqeW8gemereS/neiIl+mLquWcg+aNleatqeeUq+ijnOi8lOepguWLn+Wik+aFleaIiuaaruavjeewv+iPqeWAo+S/uOWMheWRhuWgseWlieWuneWzsOWzr+W0qeW6luaKseaNp+aUvuaWueaci1wiXSxcbltcImNiYTFcIixcIuazleazoeeDueegsue4q+iDnuiKs+iQjOiTrOicguikkuioquixiumCpumLkumjvemzs+m1rOS5j+S6oeWCjeWJluWdiuWmqOW4veW/mOW/meaIv+aatOacm+afkOajkuWGkue0oeiCquiGqOisgOiyjOiyv+mJvumYsuWQoOmgrOWMl+WDleWNnOWiqOaSsuactOeJp+edpuephumHpuWLg+ayoeauhuWggOW5jOWllOacrOe/u+WHoeebhuaRqeejqOmtlOm6u+Wfi+WmueaYp+aemuavjuWTqeanmeW5leiGnOaelemuquafvumxkuahneS6puS/o+WPiOaKueacq+ayq+i/hOS+ree5rem6v+S4h+aFoua6gFwiXSxcbltcImNjYTFcIixcIua8q+iUk+WRs+acqumtheW3s+euleWyrOWvhuicnOa5iuiTkeeolOiEiOWmmeeyjeawkeecoOWLmeWkoueEoeeJn+efm+mcp+m1oeaki+Wpv+WomOWGpeWQjeWRveaYjuebn+i/t+mKmOmztOWnqueJnea7heWFjeajiee2v+e3rOmdoum6uuaRuOaooeiMguWmhOWtn+avm+eMm+ebsue2suiAl+iSmeWEsuacqOm7meebruadouWLv+mkheWwpOaIu+exvuiysOWVj+aCtue0i+mWgOWMgeS5n+WGtuWknOeIuuiAtumHjuW8peefouWOhOW9uee0hOiWrOios+i6jemdluafs+iWrumRk+aEieaEiOayueeZklwiXSxcbltcImNkYTFcIixcIuirrei8uOWUr+S9keWEquWLh+WPi+WupeW5veaCoOaGguaPluacieafmua5p+a2jOeMtueMt+eUseelkOijleiqmOmBiumCkemDtembhOiejeWkleS6iOS9meS4juiqiei8v+mgkOWCreW5vOWmluWuueW6uOaPmuaPuuaTgeabnOaliuanmOa0i+a6tueGlOeUqOeqr+e+iuiAgOiRieiTieimgeisoei4iumBpemZvemkiuaFvuaKkeassuayg+a1tOe/jOe/vOa3gOe+heieuuijuOadpeiOsemgvOmbt+a0m+e1oeiQvemFquS5seWNteW1kOashOa/q+iXjeiYreimp+WIqeWQj+WxpeadjuaiqOeQhueSg1wiXSxcbltcImNlYTFcIixcIueXouijj+ijoemHjOmboumZuOW+i+eOh+eri+iRjuaOoOeVpeWKiea1gea6nOeQieeVmeehq+eykumahuernOm+jeS+tuaFruaXheiZnOS6huS6ruWDmuS4oeWHjOWvruaWmeaigea2vOeMn+eZgueereeonOezp+iJr+irkumBvOmHj+mZtemgmOWKm+e3keWAq+WOmOael+a3i+eHkOeQs+iHqOi8qumao+mxl+m6n+eRoOWhgea2mee0r+mhnuS7pOS8tuS+i+WGt+WKseW2uuaAnOeOsuekvOiLk+mItOmat+mbtumcium6l+m9ouaapuattOWIl+WKo+eDiOijguW7ieaBi+aGkOa8o+eFieewvue3tOiBr1wiXSxcbltcImNmYTFcIixcIuiTrumAo+mMrOWRgumtr+ark+eCieizgui3r+mcsuWKtOWpgeW7iuW8hOacl+alvOamlOa1qua8j+eJoueLvOevreiAgeiBvuidi+mDjuWFrem6k+emhOiCi+mMsuirluWAreWSjOipseatquizhOiEh+aDkeaeoOm3suS6meS6mOmwkOipq+iXgeiVqOakgOa5vueil+iFlVwiXSxcbltcImQwYTFcIixcIuW8jOS4kOS4leS4quS4seS4tuS4vOS4v+S5guS5luS5mOS6guS6heixq+S6iuiIkuW8jeS6juS6nuS6n+S6oOS6ouS6sOS6s+S6tuS7juS7jeS7hOS7huS7guS7l+S7nuS7reS7n+S7t+S8ieS9muS8sOS9m+S9neS9l+S9h+S9tuS+iOS+j+S+mOS9u+S9qeS9sOS+keS9r+S+huS+luWEmOS/lOS/n+S/juS/mOS/m+S/keS/muS/kOS/pOS/peWAmuWAqOWAlOWAquWApeWAheS8nOS/tuWAoeWAqeWArOS/vuS/r+WAkeWAhuWBg+WBh+acg+WBleWBkOWBiOWBmuWBluWBrOWBuOWCgOWCmuWCheWCtOWCslwiXSxcbltcImQxYTFcIixcIuWDieWDiuWCs+WDguWDluWDnuWDpeWDreWDo+WDruWDueWDteWEieWEgeWEguWEluWEleWElOWEmuWEoeWEuuWEt+WEvOWEu+WEv+WFgOWFkuWFjOWFlOWFoueruOWFqeWFquWFruWGgOWGguWbmOWGjOWGieWGj+WGkeWGk+WGleWGluWGpOWGpuWGouWGqeWGquWGq+WGs+WGseWGsuWGsOWGteWGveWHheWHieWHm+WHoOiZleWHqeWHreWHsOWHteWHvuWIhOWIi+WIlOWIjuWIp+WIquWIruWIs+WIueWJj+WJhOWJi+WJjOWJnuWJlOWJquWJtOWJqeWJs+WJv+WJveWKjeWKlOWKkuWJseWKiOWKkei+qFwiXSxcbltcImQyYTFcIixcIui+p+WKrOWKreWKvOWKteWLgeWLjeWLl+WLnuWLo+WLpumjreWLoOWLs+WLteWLuOWLueWMhuWMiOeUuOWMjeWMkOWMj+WMleWMmuWMo+WMr+WMseWMs+WMuOWNgOWNhuWNheS4l+WNieWNjeWHluWNnuWNqeWNruWkmOWNu+WNt+WOguWOluWOoOWOpuWOpeWOruWOsOWOtuWPg+ewkumbmeWPn+abvOeHruWPruWPqOWPreWPuuWQgeWQveWRgOWQrOWQreWQvOWQruWQtuWQqeWQneWRjuWSj+WRteWSjuWRn+WRseWRt+WRsOWSkuWRu+WSgOWRtuWShOWSkOWShuWTh+WSouWSuOWSpeWSrOWThOWTiOWSqFwiXSxcbltcImQzYTFcIixcIuWSq+WTguWSpOWSvuWSvOWTmOWTpeWTpuWUj+WUlOWTveWTruWTreWTuuWTouWUueWVgOWVo+WVjOWUruWVnOWVheWVluWVl+WUuOWUs+WVneWWmeWWgOWSr+WWiuWWn+WVu+WVvuWWmOWWnuWWruWVvOWWg+WWqeWWh+WWqOWXmuWXheWXn+WXhOWXnOWXpOWXlOWYlOWXt+WYluWXvuWXveWYm+WXueWZjuWZkOeHn+WYtOWYtuWYsuWYuOWZq+WZpOWYr+WZrOWZquWahuWagOWaiuWaoOWalOWaj+WapeWaruWatuWatOWbguWavOWbgeWbg+WbgOWbiOWbjuWbkeWbk+Wbl+WbruWbueWcgOWbv+WchOWciVwiXSxcbltcImQ0YTFcIixcIuWciOWci+WcjeWck+WcmOWcluWXh+WcnOWcpuWct+WcuOWdjuWcu+WdgOWdj+WdqeWfgOWeiOWdoeWdv+WeieWek+WeoOWes+WepOWequWesOWfg+WfhuWflOWfkuWfk+WgiuWfluWfo+Wgi+WgmeWgneWhsuWgoeWhouWhi+WhsOavgOWhkuWgveWhueWiheWiueWin+Wiq+WiuuWjnuWiu+WiuOWiruWjheWjk+WjkeWjl+WjmeWjmOWjpeWjnOWjpOWjn+Wjr+WjuuWjueWju+WjvOWjveWkguWkiuWkkOWkm+aipuWkpeWkrOWkreWksuWkuOWkvuerkuWlleWlkOWljuWlmuWlmOWlouWloOWlp+WlrOWlqVwiXSxcbltcImQ1YTFcIixcIuWluOWmgeWmneS9nuS+q+Wmo+WmsuWnhuWnqOWnnOWmjeWnmeWnmuWopeWon+WokeWonOWoieWomuWpgOWprOWpieWoteWotuWpouWpquWqmuWqvOWqvuWri+WrguWqveWro+Wrl+WrpuWrqeWrluWruuWru+WsjOWsi+WsluWssuWrkOWsquWstuWsvuWtg+WtheWtgOWtkeWtleWtmuWtm+WtpeWtqeWtsOWts+WtteWtuOaWiOWtuuWugOWug+WupuWuuOWvg+Wvh+WvieWvlOWvkOWvpOWvpuWvouWvnuWvpeWvq+WvsOWvtuWvs+WwheWwh+WwiOWwjeWwk+WwoOWwouWwqOWwuOWwueWxgeWxhuWxjuWxk1wiXSxcbltcImQ2YTFcIixcIuWxkOWxj+WtseWxrOWxruS5ouWxtuWxueWyjOWykeWylOWmm+Wyq+Wyu+WytuWyvOWyt+WzheWyvuWzh+WzmeWzqeWzveWzuuWzreW2jOWzquW0i+W0leW0l+W1nOW0n+W0m+W0keW0lOW0ouW0muW0meW0mOW1jOW1kuW1juW1i+W1rOW1s+W1tuW2h+W2hOW2guW2ouW2neW2rOW2ruW2veW2kOW2t+W2vOW3ieW3jeW3k+W3kuW3luW3m+W3q+W3suW3teW4i+W4muW4meW4keW4m+W4tuW4t+W5hOW5g+W5gOW5juW5l+W5lOW5n+W5ouW5pOW5h+W5teW5tuW5uum6vOW5v+W6oOW7geW7guW7iOW7kOW7j1wiXSxcbltcImQ3YTFcIixcIuW7luW7o+W7neW7muW7m+W7ouW7oeW7qOW7qeW7rOW7seW7s+W7sOW7tOW7uOW7vuW8g+W8ieW9neW9nOW8i+W8keW8luW8qeW8reW8uOW9geW9iOW9jOW9juW8r+W9keW9luW9l+W9meW9oeW9reW9s+W9t+W+g+W+guW9v+W+iuW+iOW+keW+h+W+nuW+meW+mOW+oOW+qOW+reW+vOW/luW/u+W/pOW/uOW/seW/neaCs+W/v+aAoeaBoOaAmeaAkOaAqeaAjuaAseaAm+aAleaAq+aApuaAj+aAuuaBmuaBgeaBquaBt+aBn+aBiuaBhuaBjeaBo+aBg+aBpOaBguaBrOaBq+aBmeaCgeaCjeaDp+aCg+aCmlwiXSxcbltcImQ4YTFcIixcIuaChOaCm+aCluaCl+aCkuaCp+aCi+aDoeaCuOaDoOaDk+aCtOW/sOaCveaDhuaCteaDmOaFjeaEleaEhuaDtuaDt+aEgOaDtOaDuuaEg+aEoeaDu+aDseaEjeaEjuaFh+aEvuaEqOaEp+aFiuaEv+aEvOaErOaEtOaEveaFguaFhOaFs+aFt+aFmOaFmeaFmuaFq+aFtOaFr+aFpeaFseaFn+aFneaFk+aFteaGmeaGluaGh+aGrOaGlOaGmuaGiuaGkeaGq+aGruaHjOaHiuaHieaHt+aHiOaHg+aHhuaGuuaHi+e9ueaHjeaHpuaHo+aHtuaHuuaHtOaHv+aHveaHvOaHvuaIgOaIiOaIieaIjeaIjOaIlOaIm1wiXSxcbltcImQ5YTFcIixcIuaInuaIoeaIquaIruaIsOaIsuaIs+aJgeaJjuaJnuaJo+aJm+aJoOaJqOaJvOaKguaKieaJvuaKkuaKk+aKluaLlOaKg+aKlOaLl+aLkeaKu+aLj+aLv+aLhuaTlOaLiOaLnOaLjOaLiuaLguaLh+aKm+aLieaMjOaLruaLseaMp+aMguaMiOaLr+aLteaNkOaMvuaNjeaQnOaNj+aOluaOjuaOgOaOq+aNtuaOo+aOj+aOieaOn+aOteaNq+aNqeaOvuaPqeaPgOaPhuaPo+aPieaPkuaPtuaPhOaQluaQtOaQhuaQk+aQpuaQtuaUneaQl+aQqOaQj+aRp+aRr+aRtuaRjuaUquaSleaSk+aSpeaSqeaSiOaSvFwiXSxcbltcImRhYTFcIixcIuaTmuaTkuaTheaTh+aSu+aTmOaTguaTseaTp+iIieaToOaToeaKrOaTo+aTr+aUrOaTtuaTtOaTsuaTuuaUgOaTveaUmOaUnOaUheaUpOaUo+aUq+aUtOaUteaUt+aUtuaUuOeVi+aViOaVluaVleaVjeaVmOaVnuaVneaVsuaVuOaWguaWg+iuiuaWm+aWn+aWq+aWt+aXg+aXhuaXgeaXhOaXjOaXkuaXm+aXmeaXoOaXoeaXseadsuaYiuaYg+aXu+ads+aYteaYtuaYtOaYnOaZj+aZhOaZieaZgeaZnuaZneaZpOaZp+aZqOaZn+aZouaZsOaag+aaiOaajuaaieaahOaamOaaneabgeaaueabieaavuaavFwiXSxcbltcImRiYTFcIixcIuabhOaauOabluabmuaboOaYv+abpuabqeabsOabteabt+acj+acluacnuacpuacp+mcuOacruacv+actuadgeacuOact+adhuadnuadoOadmeado+adpOaeieadsOaeqeadvOadquaejOaei+aepuaeoeaeheaet+afr+aetOafrOaes+afqeaeuOafpOafnuafneafouafruaeueafjuafhuafp+aqnOagnuahhuagqeahgOahjeagsuahjuais+agq+ahmeaho+aht+ahv+ain+aij+aireailOaineaim+aig+aqruaiueahtOaiteaioOaiuuakj+aijeahvuakgeajiuakiOajmOakouakpuajoeakjOajjVwiXSxcbltcImRjYTFcIixcIuajlOajp+ajleaktuakkuakhOajl+ajo+akpeajueajoOajr+akqOakquakmuako+akoeajhualuealt+alnOaluOalq+allOalvualruakuealtOakvealmeaksOaloealnualneamgealquamsuamruankOamv+angeank+amvuanjuWvqOaniuanneamu+ang+amp+aoruamkeamoOamnOamleamtOannuanqOaoguaom+anv+asiuanueansuanp+aoheamseaonuanreaolOanq+aoiuaokuargeaoo+aok+aphOaojOapsuaotuapuOaph+apouapmeappuapiOaouOaoouaqkOaqjeaqoOaqhOaqouaqo1wiXSxcbltcImRkYTFcIixcIuaql+iYl+aqu+arg+arguaquOaqs+aqrOarnuarkearn+aqquarmuarquaru+asheiYluaruuaskuaslumsseasn+asuOast+ebnOasuemjruath+atg+atieatkOatmeatlOatm+atn+atoeatuOatueatv+augOauhOaug+aujeaumOauleaunuaupOauquauq+aur+ausuauseaus+aut+auvOavhuavi+avk+avn+avrOavq+avs+avr+m6vuawiOawk+awlOawm+awpOawo+axnuaxleaxouaxquayguayjeaymuaygeaym+axvuaxqOaxs+aykuaykOazhOazseazk+ayveazl+azheazneayruayseayvlwiXSxcbltcImRlYTFcIixcIuayuuazm+azr+azmeazqua0n+ihjea0tua0q+a0vea0uOa0mea0tea0s+a0kua0jOa1o+a2k+a1pOa1mua1uea1mea2jua2lea/pOa2hea3uea4lea4iua2tea3h+a3pua2uOa3hua3rOa3nua3jOa3qOa3kua3hea3uua3mea3pOa3lea3qua3rua4rea5rua4rua4mea5sua5n+a4vua4o+a5q+a4q+a5tua5jea4n+a5g+a4uua5jua4pOa7v+a4nea4uOa6gua6qua6mOa7iea6t+a7k+a6vea6r+a7hOa6sua7lOa7lea6j+a6pea7gua6n+a9gea8keeBjOa7rOa7uOa7vua8v+a7sua8sea7r+a8sua7jFwiXSxcbltcImRmYTFcIixcIua8vua8k+a7t+a+hua9uua9uOa+gea+gOa9r+a9m+a/s+a9rea+gua9vOa9mOa+jua+kea/gua9pua+s+a+o+a+oea+pOa+uea/hua+qua/n+a/lea/rOa/lOa/mOa/sea/rua/m+eAieeAi+a/uueAkeeAgeeAj+a/vueAm+eAmua9tOeAneeAmOeAn+eAsOeAvueAsueBkeeBo+eCmeeCkueCr+eDseeCrOeCuOeCs+eCrueDn+eDi+eDneeDmeeEieeDveeEnOeEmeeFpeeFleeGiOeFpueFoueFjOeFlueFrOeGj+eHu+eGhOeGleeGqOeGrOeHl+eGueeGvueHkueHieeHlOeHjueHoOeHrOeHp+eHteeHvFwiXSxcbltcImUwYTFcIixcIueHueeHv+eIjeeIkOeIm+eIqOeIreeIrOeIsOeIsueIu+eIvOeIv+eJgOeJhueJi+eJmOeJtOeJvueKgueKgeeKh+eKkueKlueKoueKp+eKueeKsueLg+eLhueLhOeLjueLkueLoueLoOeLoeeLueeLt+WAj+eMl+eMiueMnOeMlueMneeMtOeMr+eMqeeMpeeMvueNjueNj+m7mOeNl+eNqueNqOeNsOeNuOeNteeNu+eNuuePiOeOs+ePjueOu+ePgOePpeePruePnueSoueQheeRr+eQpeePuOeQsueQuueRleeQv+eRn+eRmeeRgeeRnOeRqeeRsOeRo+eRqueRtueRvueSi+eSnueSp+eTiueTj+eTlOePsVwiXSxcbltcImUxYTFcIixcIueToOeTo+eTp+eTqeeTrueTsueTsOeTseeTuOeTt+eUhOeUg+eUheeUjOeUjueUjeeUleeUk+eUnueUpueUrOeUvOeVhOeVjeeViueVieeVm+eVhueVmueVqeeVpOeVp+eVq+eVreeVuOeVtueWhueWh+eVtOeWiueWieeWgueWlOeWmueWneeWpeeWo+eXgueWs+eXg+eWteeWveeWuOeWvOeWseeXjeeXiueXkueXmeeXo+eXnueXvueXv+eXvOeYgeeXsOeXuueXsueXs+eYi+eYjeeYieeYn+eYp+eYoOeYoeeYoueYpOeYtOeYsOeYu+eZh+eZiOeZhueZnOeZmOeZoeeZoueZqOeZqeeZqueZp+eZrOeZsFwiXSxcbltcImUyYTFcIixcIueZsueZtueZuOeZvOeagOeag+eaiOeai+eajuealueak+eameeamueasOeatOeauOeaueeauuebguebjeebluebkuebnueboeebpeebp+ebquiYr+ebu+eciOech+echOecqeecpOecnuecpeecpuecm+ect+ecuOedh+edmuedqOedq+edm+edpeedv+edvuedueeejueei+eekeeeoOeenueesOeetueeueeev+eevOeeveeeu+efh+efjeefl+efmuefnOefo+efruefvOegjOegkuekpuegoOekquehheeijuehtOeihuehvOeimueijOeio+eiteeiqueir+ejkeejhueji+ejlOeivueivOejheejiuejrFwiXSxcbltcImUzYTFcIixcIuejp+ejmuejveejtOekh+ekkuekkeekmeekrOekq+elgOeloOell+eln+elmuelleelk+eluuelv+emiuemneemp+m9i+emquemruems+emueemuuenieenleenp+enrOenoeeno+eoiOeojeeomOeomeeooOeon+emgOeoseeou+eovueot+epg+epl+epieepoeepouepqem+neepsOepueepveeqiOeql+eqleeqmOeqlueqqeeriOeqsOeqtuerheerhOeqv+mCg+erh+eriuerjeerj+erleerk+ermeermuerneeroeerouerpuerreersOesguesj+esiueshuess+esmOesmeesnuesteesqOestuetkFwiXSxcbltcImU0YTFcIixcIuetuueshOetjeesi+etjOetheetteetpeettOetp+etsOetseetrOetrueuneeumOeun+eujeeunOeumueui+eukueuj+etneeumeevi+evgeevjOevj+eutOevhuevneevqeewkeewlOevpuevpeexoOewgOewh+ewk+evs+evt+ewl+ewjeevtuewo+ewp+ewquewn+ewt+ewq+ewveexjOexg+exlOexj+exgOexkOexmOexn+expOexluexpeexrOexteeyg+eykOeypOeyreeyoueyq+eyoeeyqOeys+eysueyseeyrueyueeyveezgOezheezguezmOezkueznOezoumsu+ezr+ezsueztOeztuezuue0hlwiXSxcbltcImU1YTFcIixcIue0gue0nOe0lee0iue1hee1i+e0rue0sue0v+e0tee1hue1s+e1lue1jue1sue1qOe1rue1j+e1o+e2k+e2iee1m+e2j+e1vee2m+e2uue2rue2o+e2tee3h+e2vee2q+e4vee2oue2r+e3nOe2uOe2n+e2sOe3mOe3nee3pOe3nue3u+e3sue3oee4hee4iue4o+e4oee4kue4see4n+e4iee4i+e4oue5hue5pue4u+e4tee4uee5g+e4t+e4sue4uue5p+e5nee5lue5nue5mee5mue5uee5que5qee5vOe5u+e6g+e3lee5vei+rue5v+e6iOe6iee6jOe6kue6kOe6k+e6lOe6lue6jue6m+e6nOe8uOe8ulwiXSxcbltcImU2YTFcIixcIue9hee9jOe9jee9jue9kOe9kee9lee9lOe9mOe9n+e9oOe9qOe9qee9p+e9uOe+gue+hue+g+e+iOe+h+e+jOe+lOe+nue+nee+mue+o+e+r+e+sue+uee+rue+tue+uOitsee/hee/hue/iue/lee/lOe/oee/pue/qee/s+e/uemjnOiAhuiAhOiAi+iAkuiAmOiAmeiAnOiAoeiAqOiAv+iAu+iBiuiBhuiBkuiBmOiBmuiBn+iBouiBqOiBs+iBsuiBsOiBtuiBueiBveiBv+iChOiChuiCheiCm+iCk+iCmuiCreWGkOiCrOiDm+iDpeiDmeiDneiDhOiDmuiDluiEieiDr+iDseiEm+iEqeiEo+iEr+iFi1wiXSxcbltcImU3YTFcIixcIumai+iFhuiEvuiFk+iFkeiDvOiFseiFruiFpeiFpuiFtOiGg+iGiOiGiuiGgOiGguiGoOiGleiGpOiGo+iFn+iGk+iGqeiGsOiGteiGvuiGuOiGveiHgOiHguiGuuiHieiHjeiHkeiHmeiHmOiHiOiHmuiHn+iHoOiHp+iHuuiHu+iHvuiIgeiIguiIheiIh+iIiuiIjeiIkOiIluiIqeiIq+iIuOiIs+iJgOiJmeiJmOiJneiJmuiJn+iJpOiJouiJqOiJquiJq+iIruiJseiJt+iJuOiJvuiKjeiKkuiKq+iKn+iKu+iKrOiLoeiLo+iLn+iLkuiLtOiLs+iLuuiOk+iMg+iLu+iLueiLnuiMhuiLnOiMieiLmVwiXSxcbltcImU4YTFcIixcIuiMteiMtOiMluiMsuiMseiNgOiMueiNkOiNheiMr+iMq+iMl+iMmOiOheiOmuiOquiOn+iOouiOluiMo+iOjuiOh+iOiuiNvOiOteiNs+iNteiOoOiOieiOqOiPtOiQk+iPq+iPjuiPveiQg+iPmOiQi+iPgeiPt+iQh+iPoOiPsuiQjeiQouiQoOiOveiQuOiUhuiPu+iRreiQquiQvOiVmuiShOiRt+iRq+iSreiRruiSguiRqeiRhuiQrOiRr+iRueiQteiTiuiRouiSueiSv+iSn+iTmeiTjeiSu+iTmuiTkOiTgeiThuiTluiSoeiUoeiTv+iTtOiUl+iUmOiUrOiUn+iUleiUlOiTvOiVgOiVo+iVmOiViFwiXSxcbltcImU5YTFcIixcIuiVgeiYguiVi+iVleiWgOiWpOiWiOiWkeiWiuiWqOiVreiWlOiWm+iXquiWh+iWnOiVt+iVvuiWkOiXieiWuuiXj+iWueiXkOiXleiXneiXpeiXnOiXueiYiuiYk+iYi+iXvuiXuuiYhuiYouiYmuiYsOiYv+iZjeS5leiZlOiZn+iZp+iZseiak+iao+iaqeiaquiai+iajOiatuiar+ibhOibhuiasOibieigo+iaq+iblOibnuibqeibrOibn+ibm+ibr+ickuichuiciOicgOicg+ibu+ickeicieicjeibueiciuictOicv+ict+icu+icpeicqeicmuidoOidn+iduOidjOidjuidtOidl+idqOidruidmVwiXSxcbltcImVhYTFcIixcIuidk+ido+idquigheieouien+ieguier+ifi+ieveifgOifkOmbluieq+ifhOies+ifh+ifhuieu+ifr+ifsuifoOigj+igjeifvuiftuift+igjuifkuigkeigluigleigouigoeigseigtuigueigp+igu+ihhOihguihkuihmeihnuihouihq+iigeihvuiinuihteihveiiteihsuiiguiil+iikuiiruiimeiiouiijeiipOiisOiiv+iiseijg+ijhOijlOijmOijmeijneijueikguijvOijtOijqOijsuikhOikjOikiuikk+ilg+iknuikpeikquikq+ilgeilhOiku+iktuikuOiljOikneiloOilnlwiXSxcbltcImViYTFcIixcIuilpuilpOilreilquilr+iltOilt+ilvuimg+imiOimiuimk+immOimoeimqeimpuimrOimr+imsuimuuimveimv+ingOinmuinnOinneinp+intOinuOiog+ioluiokOiojOiom+ioneiopeiotuipgeipm+ipkuiphuipiOipvOipreiprOipouiqheiqguiqhOiqqOiqoeiqkeiqpeiqpuiqmuiqo+irhOirjeirguirmuirq+irs+irp+irpOirseislOiroOirouirt+irnuirm+isjOish+ismuiroeisluiskOisl+isoOiss+meq+ispuisq+isvuisqOitgeitjOitj+itjuitieitluitm+itmuitq1wiXSxcbltcImVjYTFcIixcIuitn+itrOitr+ittOitveiugOiujOiujuiukuiuk+iuluiumeiumuiwuuixgeiwv+ixiOixjOixjuixkOixleixouixrOixuOixuuiyguiyieiyheiyiuiyjeiyjuiylOixvOiymOaIneiyreiyquiyveiysuiys+iyruiytuiziOizgeizpOizo+izmuizveizuuizu+i0hOi0hei0iui0h+i0j+i0jei0kOm9jui0k+izjei0lOi0lui1p+i1rei1sei1s+i2gei2mei3gui2vui2uui3j+i3mui3lui3jOi3m+i3i+i3qui3q+i3n+i3o+i3vOi4iOi4iei3v+i4nei4nui4kOi4n+i5gui4tei4sOi4tOi5ilwiXSxcbltcImVkYTFcIixcIui5h+i5iei5jOi5kOi5iOi5mei5pOi5oOi4qui5o+i5lei5tui5sui5vOi6gei6h+i6hei6hOi6i+i6iui6k+i6kei6lOi6mei6qui6oei6rOi6sOi7hui6sei6vui7hei7iOi7i+i7m+i7o+i7vOi7u+i7q+i7vui8iui8hei8lei8kui8mei8k+i8nOi8n+i8m+i8jOi8pui8s+i8u+i8uei9hei9gui8vui9jOi9iei9hui9jui9l+i9nOi9oui9o+i9pOi+nOi+n+i+o+i+rei+r+i+t+i/mui/pei/oui/qui/r+mCh+i/tOmAhei/uei/uumAkemAlemAoemAjemAnumAlumAi+mAp+mAtumAtemAuei/uFwiXSxcbltcImVlYTFcIixcIumBj+mBkOmBkemBkumAjumBiemAvumBlumBmOmBnumBqOmBr+mBtumaqOmBsumCgumBvemCgemCgOmCiumCiemCj+mCqOmCr+mCsemCtemDoumDpOaJiOmDm+mEgumEkumEmemEsumEsOmFiumFlumFmOmFo+mFpemFqemFs+mFsumGi+mGiemGgumGoumGq+mGr+mGqumGtemGtOmGuumHgOmHgemHiemHi+mHkOmHlumHn+mHoemHm+mHvOmHtemHtumInumHv+mIlOmIrOmIlemIkemJnumJl+mJhemJiemJpOmJiOmKlemIv+mJi+mJkOmKnOmKlumKk+mKm+mJmumLj+mKuemKt+mLqemMj+mLuumNhOmMrlwiXSxcbltcImVmYTFcIixcIumMmemMoumMmumMo+mMuumMtemMu+mNnOmNoOmNvOmNrumNlumOsOmOrOmOremOlOmOuemPlumPl+mPqOmPpemPmOmPg+mPnemPkOmPiOmPpOmQmumQlOmQk+mQg+mQh+mQkOmQtumQq+mQtemQoemQuumRgemRkumRhOmRm+mRoOmRoumRnumRqumIqemRsOmRtemRt+mRvemRmumRvOmRvumSgemRv+mWgumWh+mWiumWlOmWlumWmOmWmemWoOmWqOmWp+mWremWvOmWu+mWuemWvumXiua/tumXg+mXjemXjOmXlemXlOmXlumXnOmXoemXpemXoumYoemYqOmYrumYr+mZgumZjOmZj+mZi+mZt+mZnOmZnlwiXSxcbltcImYwYTFcIixcIumZnemZn+mZpumZsumZrOmajemamOmalemal+maqumap+masemasumasOmatOmatumauOmauembjumbi+mbiembjeiljembnOmcjemblembuemchOmchumciOmck+mcjumckemcj+mclumcmemcpOmcqumcsOmcuemcvemcvumdhOmdhumdiOmdgumdiemdnOmdoOmdpOmdpumdqOWLkumdq+mdsemduemehemdvOmegemduumehumei+mej+mekOmenOmeqOmepumeo+mes+metOmfg+mfhumfiOmfi+mfnOmfrem9j+mfsuern+mftumftemgj+mgjOmguOmgpOmgoemgt+mgvemhhumhj+mhi+mhq+mhr+mhsFwiXSxcbltcImYxYTFcIixcIumhsemhtOmhs+miqumir+misemitumjhOmjg+mjhumjqemjq+mkg+mkiemkkumklOmkmOmkoemknemknumkpOmkoOmkrOmkrumkvemkvumlgumliemlhemlkOmli+mlkemlkumljOmllemml+mmmOmmpemmremmrummvOmnn+mnm+mnnemnmOmnkemnremnrumnsemnsumnu+mnuOmogemoj+mohemnoumomemoq+mot+mphempgumpgOmpg+movumplempjempm+mpl+mpn+mpoumppemppOmpqempq+mpqumqremqsOmqvOmrgOmrj+mrkemrk+mrlOmrnumrn+mroumro+mrpumrr+mrq+mrrumrtOmrsemrt1wiXSxcbltcImYyYTFcIixcIumru+mshumsmOmsmumsn+msoumso+mspemsp+msqOmsqemsqumsrumsr+mssumthOmtg+mtj+mtjemtjumtkemtmOmttOmuk+mug+mukemulumul+mun+muoOmuqOmutOmvgOmviumuuemvhumvj+mvkemvkumvo+mvoumvpOmvlOmvoemwuumvsumvsemvsOmwlemwlOmwiemwk+mwjOmwhumwiOmwkumwiumwhOmwrumwm+mwpemwpOmwoemwsOmxh+mwsumxhumwvumxmumxoOmxp+mxtumxuOmzp+mzrOmzsOm0iem0iOmzq+m0g+m0hum0qum0pum2r+m0o+m0n+m1hOm0lem0kum1gem0v+m0vum1hum1iFwiXSxcbltcImYzYTFcIixcIum1nem1num1pOm1kem1kOm1mem1sum2iem2h+m2q+m1r+m1uum2mum2pOm2qem2sum3hOm3gem2u+m2uOm2uum3hum3j+m3gum3mem3k+m3uOm3pum3rem3r+m3vem4mum4m+m4num5tem5uem5vem6gem6iOm6i+m6jOm6kum6lem6kem6nem6pem6qem6uOm6qum6remdoem7jOm7jum7j+m7kOm7lOm7nOm7num7nem7oOm7pem7qOm7r+m7tOm7tum7t+m7uem7u+m7vOm7vem8h+m8iOeat+m8lem8oem8rOm8vum9ium9kum9lOm9o+m9n+m9oOm9oem9pum9p+m9rOm9qum9t+m9sum9tum+lem+nOm+oFwiXSxcbltcImY0YTFcIixcIuWgr+anh+mBmeeRpOWHnOeGmVwiXSxcbltcImY5YTFcIixcIue6iuiknOmNiOmKiOiTnOS/ieeCu+aYseajiOmLueabu+W9heS4qOS7oeS7vOS8gOS8g+S8ueS9luS+kuS+iuS+muS+lOS/jeWBgOWAouS/v+WAnuWBhuWBsOWBguWClOWDtOWDmOWFiuWFpOWGneWGvuWHrOWIleWKnOWKpuWLgOWLm+WMgOWMh+WMpOWNsuWOk+WOsuWPne+ojuWSnOWSiuWSqeWTv+WWhuWdmeWdpeWerOWfiOWfh++oj++okOWinuWisuWki+Wlk+Wlm+WlneWlo+WmpOWmuuWtluWvgOeUr+WvmOWvrOWwnuWypuWyuuWzteW0p+W1k++okeW1guW1reW2uOW2ueW3kOW8oeW8tOW9p+W+t1wiXSxcbltcImZhYTFcIixcIuW/nuaBneaCheaCiuaDnuaDleaEoOaDsuaEkeaEt+aEsOaGmOaIk+aKpuaPteaRoOaSneaTjuaVjuaYgOaYleaYu+aYieaYruaYnuaYpOaZpeaZl+aZme+okuaZs+aameaaoOaasuaav+abuuacju+kqeadpuaeu+ahkuafgOaggeahhOajj++ok+alqO+olOammOanouaosOapq+aphuaps+apvuarouarpOavluawv+axnOayhuaxr+azmua0hOa2h+a1r+a2lua2rOa3j+a3uOa3sua3vOa4uea5nOa4p+a4vOa6v+a+iOa+tea/teeAheeAh+eAqOeCheeCq+eEj+eEhOeFnOeFhueFh++oleeHgeeHvueKsVwiXSxcbltcImZiYTFcIixcIueKvueMpO+olueNt+eOveePieePluePo+ePkueQh+ePteeQpueQqueQqeeQrueRoueSieeSn+eUgeeVr+eagueanOeanueam+eapu+ol+edhuWKr+egoeehjuehpOehuueksO+omO+ome+omuemlO+om+emm+erkeerp++onOerq+eunu+onee1iOe1nOe2t+e2oOe3lue5kue9h+e+oe+onuiMgeiNouiNv+iPh+iPtuiRiOiStOiVk+iVmeiVq++on+iWsO+ooO+ooeigh+ijteiokuiot+ipueiqp+iqvuirn++oouirtuitk+itv+izsOiztOi0kui1tu+oo+i7j++opO+opemBp+mDnu+opumElemEp+mHmlwiXSxcbltcImZjYTFcIixcIumHl+mHnumHremHrumHpOmHpemIhumIkOmIiumIuumJgOmIvOmJjumJmemJkemIuemJp+mKp+mJt+mJuOmLp+mLl+mLmemLkO+op+mLlemLoOmLk+mMpemMoemLu++oqOmMnumLv+mMnemMgumNsOmNl+mOpOmPhumPnumPuOmQsemRhemRiOmWku+nnO+oqemanemar+mcs+mcu+mdg+mdjemdj+mdkemdlemhl+mhpe+oqu+oq+mkp++orOmmnumpjumrmemrnOmttemtsumuj+musemuu+mwgOm1sOm1q++orem4mem7kVwiXSxcbltcImZjZjFcIixcIuKFsFwiLDksXCLvv6Lvv6TvvIfvvIJcIl0sXG5bXCI4ZmEyYWZcIixcIsuYy4fCuMuZy53Cr8uby5rvvZ7OhM6FXCJdLFxuW1wiOGZhMmMyXCIsXCLCocKmwr9cIl0sXG5bXCI4ZmEyZWJcIixcIsK6wqrCqcKu4oSiwqTihJZcIl0sXG5bXCI4ZmE2ZTFcIixcIs6GzojOic6KzqpcIl0sXG5bXCI4ZmE2ZTdcIixcIs6MXCJdLFxuW1wiOGZhNmU5XCIsXCLOjs6rXCJdLFxuW1wiOGZhNmVjXCIsXCLOj1wiXSxcbltcIjhmYTZmMVwiLFwizqzOrc6uzq/Pis6Qz4zPgs+Nz4vOsM+OXCJdLFxuW1wiOGZhN2MyXCIsXCLQglwiLDEwLFwi0I7Qj1wiXSxcbltcIjhmYTdmMlwiLFwi0ZJcIiwxMCxcItGe0Z9cIl0sXG5bXCI4ZmE5YTFcIixcIsOGxJBcIl0sXG5bXCI4ZmE5YTRcIixcIsSmXCJdLFxuW1wiOGZhOWE2XCIsXCLEslwiXSxcbltcIjhmYTlhOFwiLFwixYHEv1wiXSxcbltcIjhmYTlhYlwiLFwixYrDmMWSXCJdLFxuW1wiOGZhOWFmXCIsXCLFpsOeXCJdLFxuW1wiOGZhOWMxXCIsXCLDpsSRw7DEp8SxxLPEuMWCxYDFicWLw7jFk8OfxafDvlwiXSxcbltcIjhmYWFhMVwiLFwiw4HDgMOEw4LEgseNxIDEhMOFw4PEhsSIxIzDh8SKxI7DicOIw4vDisSaxJbEksSYXCJdLFxuW1wiOGZhYWJhXCIsXCLEnMSexKLEoMSkw43DjMOPw47Hj8SwxKrErsSoxLTEtsS5xL3Eu8WDxYfFhcORw5PDksOWw5THkcWQxYzDlcWUxZjFlsWaxZzFoMWexaTFosOaw5nDnMObxazHk8WwxarFssWuxajHl8ebx5nHlcW0w53FuMW2xbnFvcW7XCJdLFxuW1wiOGZhYmExXCIsXCLDocOgw6TDosSDx47EgcSFw6XDo8SHxInEjcOnxIvEj8Opw6jDq8OqxJvEl8STxJnHtcSdxJ9cIl0sXG5bXCI4ZmFiYmRcIixcIsShxKXDrcOsw6/DrseQXCJdLFxuW1wiOGZhYmM1XCIsXCLEq8SvxKnEtcS3xLrEvsS8xYTFiMWGw7HDs8Oyw7bDtMeSxZHFjcO1xZXFmcWXxZvFncWhxZ/FpcWjw7rDucO8w7vFrceUxbHFq8Wzxa/FqceYx5zHmseWxbXDvcO/xbfFusW+xbxcIl0sXG5bXCI4ZmIwYTFcIixcIuS4guS4hOS4heS4jOS4kuS4n+S4o+S4pOS4qOS4q+S4ruS4r+S4sOS4teS5gOS5geS5hOS5h+S5keS5muS5nOS5o+S5qOS5qeS5tOS5teS5ueS5v+S6jeS6luS6l+S6neS6r+S6ueS7g+S7kOS7muS7m+S7oOS7oeS7ouS7qOS7r+S7seS7s+S7teS7veS7vuS7v+S8gOS8guS8g+S8iOS8i+S8jOS8kuS8leS8luS8l+S8meS8ruS8seS9oOS8s+S8teS8t+S8ueS8u+S8vuS9gOS9guS9iOS9ieS9i+S9jOS9kuS9lOS9luS9mOS9n+S9o+S9quS9rOS9ruS9seS9t+S9uOS9ueS9uuS9veS9vuS+geS+guS+hFwiXSxcbltcIjhmYjFhMVwiLFwi5L6F5L6J5L6K5L6M5L6O5L6Q5L6S5L6T5L6U5L6X5L6Z5L6a5L6e5L6f5L6y5L635L655L675L685L695L6+5L+A5L+B5L+F5L+G5L+I5L+J5L+L5L+M5L+N5L+P5L+S5L+c5L+g5L+i5L+w5L+y5L+85L+95L+/5YCA5YCB5YCE5YCH5YCK5YCM5YCO5YCQ5YCT5YCX5YCY5YCb5YCc5YCd5YCe5YCi5YCn5YCu5YCw5YCy5YCz5YC15YGA5YGB5YGC5YGF5YGG5YGK5YGM5YGO5YGR5YGS5YGT5YGX5YGZ5YGf5YGg5YGi5YGj5YGm5YGn5YGq5YGt5YGw5YGx5YC75YKB5YKD5YKE5YKG5YKK5YKO5YKP5YKQXCJdLFxuW1wiOGZiMmExXCIsXCLlgpLlgpPlgpTlgpblgpvlgpzlgp5cIiw0LFwi5YKq5YKv5YKw5YK55YK65YK95YOA5YOD5YOE5YOH5YOM5YOO5YOQ5YOT5YOU5YOY5YOc5YOd5YOf5YOi5YOk5YOm5YOo5YOp5YOv5YOx5YO25YO65YO+5YSD5YSG5YSH5YSI5YSL5YSM5YSN5YSO5YOy5YSQ5YSX5YSZ5YSb5YSc5YSd5YSe5YSj5YSn5YSo5YSs5YSt5YSv5YSx5YSz5YS05YS15YS45YS55YWC5YWK5YWP5YWT5YWV5YWX5YWY5YWf5YWk5YWm5YW+5YaD5YaE5YaL5YaO5YaY5Yad5Yah5Yaj5Yat5Ya45Ya65Ya85Ya+5Ya/5YeCXCJdLFxuW1wiOGZiM2ExXCIsXCLlh4jlh4/lh5Hlh5Llh5Plh5Xlh5jlh57lh6Llh6Xlh67lh7Llh7Plh7Tlh7fliIHliILliIXliJLliJPliJXliJbliJjliKLliKjliLHliLLliLXliLzliYXliYnliZXliZfliZjliZrliZzliZ/liaDliaHliablia7libflibjlibnlioDlioLlioXliorliozlipPlipXlipblipflipjliprlipzliqTliqXliqbliqfliq/lirDlirblirflirjlirrlirvlir3li4Dli4Tli4bli4jli4zli4/li5Hli5Tli5bli5vli5zli6Hli6Xli6jli6nli6rli6zli7Dli7Hli7Tli7bli7fljIDljIPljIrljItcIl0sXG5bXCI4ZmI0YTFcIixcIuWMjOWMkeWMk+WMmOWMm+WMnOWMnuWMn+WMpeWMp+WMqOWMqeWMq+WMrOWMreWMsOWMsuWMteWMvOWMveWMvuWNguWNjOWNi+WNmeWNm+WNoeWNo+WNpeWNrOWNreWNsuWNueWNvuWOg+WOh+WOiOWOjuWOk+WOlOWOmeWOneWOoeWOpOWOquWOq+WOr+WOsuWOtOWOteWOt+WOuOWOuuWOveWPgOWPheWPj+WPkuWPk+WPleWPmuWPneWPnuWPoOWPpuWPp+WPteWQguWQk+WQmuWQoeWQp+WQqOWQquWQr+WQseWQtOWQteWRg+WRhOWRh+WRjeWRj+WRnuWRouWRpOWRpuWRp+WRqeWRq+WRreWRruWRtOWRv1wiXSxcbltcIjhmYjVhMVwiLFwi5ZKB5ZKD5ZKF5ZKI5ZKJ5ZKN5ZKR5ZKV5ZKW5ZKc5ZKf5ZKh5ZKm5ZKn5ZKp5ZKq5ZKt5ZKu5ZKx5ZK35ZK55ZK65ZK75ZK/5ZOG5ZOK5ZON5ZOO5ZOg5ZOq5ZOs5ZOv5ZO25ZO85ZO+5ZO/5ZSA5ZSB5ZSF5ZSI5ZSJ5ZSM5ZSN5ZSO5ZSV5ZSq5ZSr5ZSy5ZS15ZS25ZS75ZS85ZS95ZWB5ZWH5ZWJ5ZWK5ZWN5ZWQ5ZWR5ZWY5ZWa5ZWb5ZWe5ZWg5ZWh5ZWk5ZWm5ZW/5ZaB5ZaC5ZaG5ZaI5ZaO5ZaP5ZaR5ZaS5ZaT5ZaU5ZaX5Zaj5Zak5Zat5Zay5Za/5ZeB5ZeD5ZeG5ZeJ5ZeL5ZeM5ZeO5ZeR5ZeSXCJdLFxuW1wiOGZiNmExXCIsXCLll5Pll5fll5jll5vll57ll6Lll6nll7bll7/lmIXlmIjlmIrlmI1cIiw1LFwi5ZiZ5Zis5Ziw5Ziz5Zi15Zi35Zi55Zi75Zi85Zi95Zi/5ZmA5ZmB5ZmD5ZmE5ZmG5ZmJ5ZmL5ZmN5ZmP5ZmU5Zme5Zmg5Zmh5Zmi5Zmj5Zmm5Zmp5Zmt5Zmv5Zmx5Zmy5Zm15ZqE5ZqF5ZqI5ZqL5ZqM5ZqV5ZqZ5Zqa5Zqd5Zqe5Zqf5Zqm5Zqn5Zqo5Zqp5Zqr5Zqs5Zqt5Zqx5Zqz5Zq35Zq+5ZuF5ZuJ5ZuK5ZuL5ZuP5ZuQ5ZuM5ZuN5ZuZ5Zuc5Zud5Zuf5Zuh5ZukXCIsNCxcIuWbseWbq+WbrVwiXSxcbltcIjhmYjdhMVwiLFwi5Zu25Zu35ZyB5ZyC5ZyH5ZyK5ZyM5ZyR5ZyV5Zya5Zyb5Zyd5Zyg5Zyi5Zyj5Zyk5Zyl5Zyp5Zyq5Zys5Zyu5Zyv5Zyz5Zy05Zy95Zy+5Zy/5Z2F5Z2G5Z2M5Z2N5Z2S5Z2i5Z2l5Z2n5Z2o5Z2r5Z2tXCIsNCxcIuWds+WdtOWdteWdt+WdueWduuWdu+WdvOWdvuWegeWeg+WejOWelOWel+WemeWemuWenOWeneWenuWen+WeoeWeleWep+WeqOWeqeWerOWeuOWeveWfh+WfiOWfjOWfj+WfleWfneWfnuWfpOWfpuWfp+WfqeWfreWfsOWfteWftuWfuOWfveWfvuWfv+Wgg+WghOWgiOWgieWfoVwiXSxcbltcIjhmYjhhMVwiLFwi5aCM5aCN5aCb5aCe5aCf5aCg5aCm5aCn5aCt5aCy5aC55aC/5aGJ5aGM5aGN5aGP5aGQ5aGV5aGf5aGh5aGk5aGn5aGo5aG45aG85aG/5aKA5aKB5aKH5aKI5aKJ5aKK5aKM5aKN5aKP5aKQ5aKU5aKW5aKd5aKg5aKh5aKi5aKm5aKp5aKx5aKy5aOE5aK85aOC5aOI5aON5aOO5aOQ5aOS5aOU5aOW5aOa5aOd5aOh5aOi5aOp5aOz5aSF5aSG5aSL5aSM5aSS5aST5aSU6JmB5aSd5aSh5aSj5aSk5aSo5aSv5aSw5aSz5aS15aS25aS/5aWD5aWG5aWS5aWT5aWZ5aWb5aWd5aWe5aWf5aWh5aWj5aWr5aWtXCJdLFxuW1wiOGZiOWExXCIsXCLlpa/lpbLlpbXlpbblpbnlpbvlpbzlpovlpozlpo7lppLlppXlppflpp/lpqTlpqflpq3lpq7lpq/lprDlprPlprflprrlprzlp4Hlp4Plp4Tlp4jlp4rlp43lp5Llp53lp57lp5/lp6Plp6Tlp6flp67lp6/lp7Hlp7Llp7Tlp7flqIDlqITlqIzlqI3lqI7lqJLlqJPlqJ7lqKPlqKTlqKflqKjlqKrlqK3lqLDlqYTlqYXlqYflqYjlqYzlqZDlqZXlqZ7lqaPlqaXlqaflqa3lqbflqbrlqbvlqb7lqovlqpDlqpPlqpblqpnlqpzlqp7lqp/lqqDlqqLlqqflqqzlqrHlqrLlqrPlqrXlqrjlqrrlqrvlqr9cIl0sXG5bXCI4ZmJhYTFcIixcIuWrhOWrhuWriOWrj+WrmuWrnOWroOWrpeWrquWrruWrteWrtuWrveWsgOWsgeWsiOWsl+WstOWsmeWsm+WsneWsoeWspeWsreWsuOWtgeWti+WtjOWtkuWtluWtnuWtqOWtruWtr+WtvOWtveWtvuWtv+WugeWuhOWuhuWuiuWujuWukOWukeWuk+WulOWuluWuqOWuqeWurOWureWur+WuseWusuWut+WuuuWuvOWvgOWvgeWvjeWvj+WvllwiLDQsXCLlr6Dlr6/lr7Hlr7Tlr73lsIzlsJflsJ7lsJ/lsKPlsKblsKnlsKvlsKzlsK7lsLDlsLLlsLXlsLblsZnlsZrlsZzlsaLlsaPlsaflsajlsalcIl0sXG5bXCI4ZmJiYTFcIixcIuWxreWxsOWxtOWxteWxuuWxu+WxvOWxveWyh+WyiOWyiuWyj+WykuWyneWyn+WyoOWyouWyo+WypuWyquWysuWytOWyteWyuuWzieWzi+WzkuWzneWzl+WzruWzseWzsuWztOW0geW0huW0jeW0kuW0q+W0o+W0pOW0puW0p+W0seW0tOW0ueW0veW0v+W1guW1g+W1huW1iOW1leW1keW1meW1iuW1n+W1oOW1oeW1ouW1pOW1quW1reW1sOW1ueW1uuW1vuW1v+W2geW2g+W2iOW2iuW2kuW2k+W2lOW2leW2meW2m+W2n+W2oOW2p+W2q+W2sOW2tOW2uOW2ueW3g+W3h+W3i+W3kOW3juW3mOW3meW3oOW3pFwiXSxcbltcIjhmYmNhMVwiLFwi5bep5be45be55biA5biH5biN5biS5biU5biV5biY5bif5big5biu5bio5biy5bi15bi+5bmL5bmQ5bmJ5bmR5bmW5bmY5bmb5bmc5bme5bmo5bmqXCIsNCxcIuW5sOW6gOW6i+W6juW6ouW6pOW6peW6qOW6quW6rOW6seW6s+W6veW6vuW6v+W7huW7jOW7i+W7juW7keW7kuW7lOW7leW7nOW7nuW7peW7q+W8guW8huW8h+W8iOW8juW8meW8nOW8neW8oeW8ouW8o+W8pOW8qOW8q+W8rOW8ruW8sOW8tOW8tuW8u+W8veW8v+W9gOW9hOW9heW9h+W9jeW9kOW9lOW9mOW9m+W9oOW9o+W9pOW9p1wiXSxcbltcIjhmYmRhMVwiLFwi5b2v5b2y5b205b215b245b265b295b2+5b6J5b6N5b6P5b6W5b6c5b6d5b6i5b6n5b6r5b6k5b6s5b6v5b6w5b6x5b645b+E5b+H5b+I5b+J5b+L5b+QXCIsNCxcIuW/nuW/oeW/ouW/qOW/qeW/quW/rOW/reW/ruW/r+W/suW/s+W/tuW/uuW/vOaAh+aAiuaAjeaAk+aAlOaAl+aAmOaAmuaAn+aApOaAreaAs+aAteaBgOaBh+aBiOaBieaBjOaBkeaBlOaBluaBl+aBneaBoeaBp+aBseaBvuaBv+aCguaChuaCiOaCiuaCjuaCkeaCk+aCleaCmOaCneaCnuaCouaCpOaCpeaCqOaCsOaCseaCt1wiXSxcbltcIjhmYmVhMVwiLFwi5oK75oK+5oOC5oOE5oOI5oOJ5oOK5oOL5oOO5oOP5oOU5oOV5oOZ5oOb5oOd5oOe5oOi5oOl5oOy5oO15oO45oO85oO95oSC5oSH5oSK5oSM5oSQXCIsNCxcIuaEluaEl+aEmeaEnOaEnuaEouaEquaEq+aEsOaEseaEteaEtuaEt+aEueaFgeaFheaFhuaFieaFnuaFoOaFrOaFsuaFuOaFu+aFvOaFv+aGgOaGgeaGg+aGhOaGi+aGjeaGkuaGk+aGl+aGmOaGnOaGneaGn+aGoOaGpeaGqOaGquaGreaGuOaGueaGvOaHgOaHgeaHguaHjuaHj+aHleaHnOaHneaHnuaHn+aHoeaHouaHp+aHqeaHpVwiXSxcbltcIjhmYmZhMVwiLFwi5oes5oet5oev5oiB5oiD5oiE5oiH5oiT5oiV5oic5oig5oii5oij5oin5oip5oir5oi55oi95omC5omD5omE5omG5omM5omQ5omR5omS5omU5omW5oma5omc5omk5omt5omv5omz5om65om95oqN5oqO5oqP5oqQ5oqm5oqo5oqz5oq25oq35oq65oq+5oq/5ouE5ouO5ouV5ouW5oua5ouq5ouy5ou05ou85ou95oyD5oyE5oyK5oyL5oyN5oyQ5oyT5oyW5oyY5oyp5oyq5oyt5oy15oy25oy55oy85o2B5o2C5o2D5o2E5o2G5o2K5o2L5o2O5o2S5o2T5o2U5o2Y5o2b5o2l5o2m5o2s5o2t5o2x5o205o21XCJdLFxuW1wiOGZjMGExXCIsXCLmjbjmjbzmjb3mjb/mjoLmjoTmjofmjormjpDmjpTmjpXmjpnmjprmjp7mjqTmjqbmjq3mjq7mjq/mjr3mj4Hmj4Xmj4jmj47mj5Hmj5Pmj5Tmj5Xmj5zmj6Dmj6Xmj6rmj6zmj7Lmj7Pmj7Xmj7jmj7nmkInmkIrmkJDmkJLmkJTmkJjmkJ7mkKDmkKLmkKTmkKXmkKnmkKrmkK/mkLDmkLXmkL3mkL/mkYvmkY/mkZHmkZLmkZPmkZTmkZrmkZvmkZzmkZ3mkZ/mkaDmkaHmkaPmka3mkbPmkbTmkbvmkb3mkoXmkofmko/mkpDmkpHmkpjmkpnmkpvmkp3mkp/mkqHmkqPmkqbmkqjmkqzmkrPmkr3mkr7mkr9cIl0sXG5bXCI4ZmMxYTFcIixcIuaThOaTieaTiuaTi+aTjOaTjuaTkOaTkeaTleaTl+aTpOaTpeaTqeaTquaTreaTsOaTteaTt+aTu+aTv+aUgeaUhOaUiOaUieaUiuaUj+aUk+aUlOaUluaUmeaUm+aUnuaUn+aUouaUpuaUqeaUruaUseaUuuaUvOaUveaVg+aVh+aVieaVkOaVkuaVlOaVn+aVoOaVp+aVq+aVuuaVveaWgeaWheaWiuaWkuaWleaWmOaWneaWoOaWo+aWpuaWruaWsuaWs+aWtOaWv+aXguaXiOaXieaXjuaXkOaXlOaXluaXmOaXn+aXsOaXsuaXtOaXteaXueaXvuaXv+aYgOaYhOaYiOaYieaYjeaYkeaYkuaYleaYluaYnVwiXSxcbltcIjhmYzJhMVwiLFwi5pie5pih5pii5pij5pik5pim5pip5piq5pir5pis5piu5piw5pix5piz5pi55pi35pmA5pmF5pmG5pmK5pmM5pmR5pmO5pmX5pmY5pmZ5pmb5pmc5pmg5pmh5pu75pmq5pmr5pms5pm+5pmz5pm15pm/5pm35pm45pm55pm75pqA5pm85pqL5pqM5pqN5pqQ5pqS5pqZ5pqa5pqb5pqc5pqf5pqg5pqk5pqt5pqx5pqy5pq15pq75pq/5puA5puC5puD5puI5puM5puO5puP5puU5pub5puf5puo5pur5pus5puu5pu65pyF5pyH5pyO5pyT5pyZ5pyc5pyg5pyi5pyz5py+5p2F5p2H5p2I5p2M5p2U5p2V5p2dXCJdLFxuW1wiOGZjM2ExXCIsXCLmnabmnazmna7mnbTmnbbmnbvmnoHmnoTmno7mno/mnpHmnpPmnpbmnpjmnpnmnpvmnrDmnrHmnrLmnrXmnrvmnrzmnr3mn7nmn4Dmn4Lmn4Pmn4Xmn4jmn4nmn5Lmn5fmn5nmn5zmn6Hmn6bmn7Dmn7Lmn7bmn7fmoZLmoJTmoJnmoJ3moJ/moKjmoKfmoKzmoK3moK/moLDmoLHmoLPmoLvmoL/moYTmoYXmoYrmoYzmoZXmoZfmoZjmoZvmoavmoa5cIiw0LFwi5qG15qG55qG65qG75qG85qKC5qKE5qKG5qKI5qKW5qKY5qKa5qKc5qKh5qKj5qKl5qKp5qKq5qKu5qKy5qK75qOF5qOI5qOM5qOPXCJdLFxuW1wiOGZjNGExXCIsXCLmo5Dmo5Hmo5Pmo5bmo5nmo5zmo53mo6Xmo6jmo6rmo6vmo6zmo63mo7Dmo7Hmo7Xmo7bmo7vmo7zmo73mpIbmpInmpIrmpJDmpJHmpJPmpJbmpJfmpLHmpLPmpLXmpLjmpLvmpYLmpYXmpYnmpY7mpZfmpZvmpaPmpaTmpaXmpabmpajmpanmpazmpbDmpbHmpbLmpbrmpbvmpb/mpoDmpo3mppLmppbmppjmpqHmpqXmpqbmpqjmpqvmpq3mpq/mprfmprjmprrmprzmp4Xmp4jmp5Hmp5bmp5fmp6Lmp6Xmp67mp6/mp7Hmp7Pmp7Xmp77mqIDmqIHmqIPmqI/mqJHmqJXmqJrmqJ3mqKDmqKTmqKjmqLDmqLJcIl0sXG5bXCI4ZmM1YTFcIixcIuaotOaot+aou+aovuaov+apheaphuapieapiuapjuapkOapkeapkuapleapluapm+appOapp+apquapseaps+apvuaqgeaqg+aqhuaqh+aqieaqi+aqkeaqm+aqneaqnuaqn+aqpeaqq+aqr+aqsOaqseaqtOaqveaqvuaqv+arhuarieariOarjOarkOarlOarlearluarnOarnearpOarp+arrOarsOarsearsuarvOarveasguasg+ashuash+asieasj+askOaskeasl+asm+asnuaspOasqOasq+asrOasr+asteastuasu+asv+athuatiuatjeatkuatluatmOatneatoOatp+atq+atruatsOatteatvVwiXSxcbltcIjhmYzZhMVwiLFwi5q2+5q6C5q6F5q6X5q6b5q6f5q6g5q6i5q6j5q6o5q6p5q6s5q6t5q6u5q6w5q645q655q695q6+5q+D5q+E5q+J5q+M5q+W5q+a5q+h5q+j5q+m5q+n5q+u5q+x5q+35q+55q+/5rCC5rCE5rCF5rCJ5rCN5rCO5rCQ5rCS5rCZ5rCf5rCm5rCn5rCo5rCs5rCu5rCz5rC15rC25rC65rC75rC/5rGK5rGL5rGN5rGP5rGS5rGU5rGZ5rGb5rGc5rGr5rGt5rGv5rG05rG25rG45rG55rG75rKF5rKG5rKH5rKJ5rKU5rKV5rKX5rKY5rKc5rKf5rKw5rKy5rK05rOC5rOG5rON5rOP5rOQ5rOR5rOS5rOU5rOWXCJdLFxuW1wiOGZjN2ExXCIsXCLms5rms5zms6Dms6fms6nms6vms6zms67ms7Lms7TmtITmtIfmtIrmtI7mtI/mtJHmtJPmtJrmtKbmtKfmtKjmsafmtK7mtK/mtLHmtLnmtLzmtL/mtZfmtZ7mtZ/mtaHmtaXmtafmta/mtbDmtbzmtoLmtofmtpHmtpLmtpTmtpbmtpfmtpjmtqrmtqzmtrTmtrfmtrnmtr3mtr/mt4Tmt4jmt4rmt47mt4/mt5bmt5vmt53mt5/mt6Dmt6Lmt6Xmt6nmt6/mt7Dmt7Tmt7bmt7zmuIDmuITmuJ7muKLmuKfmuLLmuLbmuLnmuLvmuLzmuYTmuYXmuYjmuYnmuYvmuY/muZHmuZLmuZPmuZTmuZfmuZzmuZ3muZ5cIl0sXG5bXCI4ZmM4YTFcIixcIua5oua5o+a5qOa5s+a5u+a5vea6jea6k+a6mea6oOa6p+a6rea6rua6sea6s+a6u+a6v+a7gOa7gea7g+a7h+a7iOa7iua7jea7jua7j+a7q+a7rea7rua7uea7u+a7vea8hOa8iOa8iua8jOa8jea8lua8mOa8mua8m+a8pua8qea8qua8r+a8sOa8s+a8tua8u+a8vOa8rea9j+a9kea9kua9k+a9l+a9mea9mua9nea9nua9oea9oua9qOa9rOa9vea9vua+g+a+h+a+iOa+i+a+jOa+jea+kOa+kua+k+a+lOa+lua+mua+n+a+oOa+pea+pua+p+a+qOa+rua+r+a+sOa+tea+tua+vOa/hea/h+a/iOa/ilwiXSxcbltcIjhmYzlhMVwiLFwi5r+a5r+e5r+o5r+p5r+w5r+15r+55r+85r+954CA54CF54CG54CH54CN54CX54Cg54Cj54Cv54C054C354C554C854GD54GE54GI54GJ54GK54GL54GU54GV54Gd54Ge54GO54Gk54Gl54Gs54Gu54G154G254G+54KB54KF54KG54KUXCIsNCxcIueCm+eCpOeCq+eCsOeCseeCtOeCt+eDiueDkeeDk+eDlOeDleeDlueDmOeDnOeDpOeDuueEg1wiLDQsXCLnhIvnhIznhI/nhJ7nhKDnhKvnhK3nhK/nhLDnhLHnhLjnhYHnhYXnhYbnhYfnhYrnhYvnhZDnhZLnhZfnhZrnhZznhZ7nhaBcIl0sXG5bXCI4ZmNhYTFcIixcIueFqOeFueeGgOeGheeGh+eGjOeGkueGmueGm+eGoOeGoueGr+eGsOeGsueGs+eGuueGv+eHgOeHgeeHhOeHi+eHjOeHk+eHlueHmeeHmueHnOeHuOeHvueIgOeIh+eIiOeIieeIk+eIl+eImueIneeIn+eIpOeIq+eIr+eItOeIuOeIueeJgeeJgueJg+eJheeJjueJj+eJkOeJk+eJleeJlueJmueJnOeJnueJoOeJo+eJqOeJq+eJrueJr+eJseeJt+eJuOeJu+eJvOeJv+eKhOeKieeKjeeKjueKk+eKm+eKqOeKreeKrueKseeKtOeKvueLgeeLh+eLieeLjOeLleeLlueLmOeLn+eLpeeLs+eLtOeLuueLu1wiXSxcbltcIjhmY2JhMVwiLFwi54u+54yC54yE54yF54yH54yL54yN54yS54yT54yY54yZ54ye54yi54yk54yn54yo54ys54yx54yy54y154y654y754y9542D542N542Q542S542W542Y542d542e542f542g542m542n542p542r542s542u542v542x542354255428546A546B546D546F546G546O546Q546T546V546X546Y546c546e546f546g546i546l546m546q546r546t54615463546554685469546/54+F54+G54+J54+L54+M54+P54+S54+T54+W54+Z54+d54+h54+j54+m54+n54+p54+054+154+354+554+654+754+9XCJdLFxuW1wiOGZjY2ExXCIsXCLnj7/nkIDnkIHnkITnkIfnkIrnkJHnkJrnkJvnkKTnkKbnkKhcIiw5LFwi55C555GA55GD55GE55GG55GH55GL55GN55GR55GS55GX55Gd55Gi55Gm55Gn55Go55Gr55Gt55Gu55Gx55Gy55KA55KB55KF55KG55KH55KJ55KP55KQ55KR55KS55KY55KZ55Ka55Kc55Kf55Kg55Kh55Kj55Km55Ko55Kp55Kq55Kr55Ku55Kv55Kx55Ky55K155K555K755K/55OI55OJ55OM55OQ55OT55OY55Oa55Ob55Oe55Of55Ok55Oo55Oq55Or55Ov55O055O655O755O855O/55SGXCJdLFxuW1wiOGZjZGExXCIsXCLnlJLnlJbnlJfnlKDnlKHnlKTnlKfnlKnnlKrnlK/nlLbnlLnnlL3nlL7nlL/nlYDnlYPnlYfnlYjnlY7nlZDnlZLnlZfnlZ7nlZ/nlaHnla/nlbHnlblcIiw1LFwi55aB55aF55aQ55aS55aT55aV55aZ55ac55ai55ak55a055a655a/55eA55eB55eE55eG55eM55eO55eP55eX55ec55ef55eg55eh55ek55en55es55eu55ev55ex55e555iA55iC55iD55iE55iH55iI55iK55iM55iP55iS55iT55iV55iW55iZ55ib55ic55id55ie55ij55il55im55ip55it55iy55iz55i155i455i5XCJdLFxuW1wiOGZjZWExXCIsXCLnmLrnmLznmYrnmYDnmYHnmYPnmYTnmYXnmYnnmYvnmZXnmZnnmZ/nmaTnmaXnma3nma7nma/nmbHnmbTnmoHnmoXnmoznmo3nmpXnmpvnmpznmp3nmp/nmqDnmqJcIiw2LFwi55qq55qt55q955uB55uF55uJ55uL55uM55uO55uU55uZ55ug55um55uo55us55uw55ux55u255u555u855yA55yG55yK55yO55yS55yU55yV55yX55yZ55ya55yc55yi55yo55yt55yu55yv55y055y155y255y555y955y+552C552F552G552K552N552O552P552S552W552X552c552e552f552g552iXCJdLFxuW1wiOGZjZmExXCIsXCLnnaTnnafnnarnnaznnbDnnbLnnbPnnbTnnbrnnb3nnoDnnoTnnoznno3nnpTnnpXnnpbnnprnnp/nnqLnnqfnnqrnnq7nnq/nnrHnnrXnnr7nn4Pnn4nnn5Hnn5Lnn5Xnn5nnn57nn5/nn6Dnn6Tnn6bnn6rnn6znn7Dnn7Hnn7Tnn7jnn7vnoIXnoIbnoInnoI3noI7noJHnoJ3noKHnoKLnoKPnoK3noK7noLDnoLXnoLfnoYPnoYTnoYfnoYjnoYznoY7noZLnoZznoZ7noaDnoaHnoaPnoaTnoajnoarnoa7nobrnob7noornoo/nopTnopjnoqHnop3nop7nop/noqTnoqjnoqznoq3norDnorHnorLnorNcIl0sXG5bXCI4ZmQwYTFcIixcIueiu+eiveeiv+ejh+ejiOejieejjOejjuejkuejk+ejleejluejpOejm+ejn+ejoOejoeejpuejquejsuejs+ekgOejtuejt+ejuueju+ejv+ekhuekjOekkOekmueknOeknuekn+ekoOekpeekp+ekqeekreekseektOekteeku+ekveekv+elhOelheelhueliueli+elj+elkeellOelmOelm+elnOelp+elqeelq+elsuelueelu+elvOelvuemi+emjOemkeemk+emlOemleemluemmOemm+emnOemoeemqOemqeemq+emr+emseemtOemuOemu+enguenhOenh+eniOeniuenj+enlOenluenmuenneennlwiXSxcbltcIjhmZDFhMVwiLFwi56eg56ei56el56eq56er56et56ex56e456e856iC56iD56iH56iJ56iK56iM56iR56iV56ib56ie56ih56in56ir56it56iv56iw56i056i156i456i556i656mE56mF56mH56mI56mM56mV56mW56mZ56mc56md56mf56mg56ml56mn56mq56mt56m156m456m+56qA56qC56qF56qG56qK56qL56qQ56qR56qU56qe56qg56qj56qs56qz56q156q556q756q856uG56uJ56uM56uO56uR56ub56uo56up56ur56us56ux56u056u756u956u+56yH56yU56yf56yj56yn56yp56yq56yr56yt56yu56yv56ywXCJdLFxuW1wiOGZkMmExXCIsXCLnrLHnrLTnrL3nrL/nrYDnrYHnrYfnrY7nrZXnraDnraTnrabnrannrarnra3nra/nrbLnrbPnrbfnroTnronnro7nrpDnrpHnrpbnrpvnrp7nrqDnrqXnrqznrq/nrrDnrrLnrrXnrrbnrrrnrrvnrrznrr3nr4Lnr4Xnr4jnr4rnr5Tnr5bnr5fnr5nnr5rnr5vnr6jnr6rnr7Lnr7Tnr7Xnr7jnr7nnr7rnr7znr77nsIHnsILnsIPnsITnsIbnsInnsIvnsIznsI7nsI/nsJnnsJvnsKDnsKXnsKbnsKjnsKznsLHnsLPnsLTnsLbnsLnnsLrnsYbnsYrnsZXnsZHnsZLnsZPnsZlcIiw1XSxcbltcIjhmZDNhMVwiLFwi57Gh57Gj57Gn57Gp57Gt57Gu57Gw57Gy57G557G857G957KG57KH57KP57KU57Ke57Kg57Km57Kw57K257K357K657K757K857K/57OE57OH57OI57OJ57ON57OP57OT57OU57OV57OX57OZ57Oa57Od57Om57Op57Or57O157SD57SH57SI57SJ57SP57SR57SS57ST57SW57Sd57Se57Sj57Sm57Sq57St57Sx57S857S957S+57WA57WB57WH57WI57WN57WR57WT57WX57WZ57Wa57Wc57Wd57Wl57Wn57Wq57Ww57W457W657W757W/57aB57aC57aD57aF57aG57aI57aL57aM57aN57aR57aW57aX57adXCJdLFxuW1wiOGZkNGExXCIsXCLntp7ntqbntqfntqrntrPntrbntrfntrnnt4JcIiw0LFwi57eM57eN57eO57eX57eZ57iA57ei57el57em57eq57er57et57ex57e157e257e557e657iI57iQ57iR57iV57iX57ic57id57ig57in57io57is57it57iv57iz57i257i/57mE57mF57mH57mO57mQ57mS57mY57mf57mh57mi57ml57mr57mu57mv57mz57m457m+57qB57qG57qH57qK57qN57qR57qV57qY57qa57qd57qe57y857y757y957y+57y/572D572E572H572P572S572T572b572c572d572h572j572k572l572m572tXCJdLFxuW1wiOGZkNWExXCIsXCLnvbHnvb3nvb7nvb/nvoDnvovnvo3nvo/nvpDnvpHnvpbnvpfnvpznvqHnvqLnvqbnvqrnvq3nvrTnvrznvr/nv4Dnv4Pnv4jnv47nv4/nv5vnv5/nv6Pnv6Xnv6jnv6znv67nv6/nv7Lnv7rnv73nv77nv7/ogIfogIjogIrogI3ogI7ogI/ogJHogJPogJTogJbogJ3ogJ7ogJ/ogKDogKTogKbogKzogK7ogLDogLTogLXogLfogLnogLrogLzogL7ogYDogYTogaDogaTogaboga3ogbHogbXogoHogojogo7ogpzogp7ogqbogqfogqvogrjogrnog4jog43og4/og5Log5Tog5Xog5fog5jog6Dog63og65cIl0sXG5bXCI4ZmQ2YTFcIixcIuiDsOiDsuiDs+iDtuiDueiDuuiDvuiEg+iEi+iEluiEl+iEmOiEnOiEnuiEoOiEpOiEp+iErOiEsOiEteiEuuiEvOiFheiFh+iFiuiFjOiFkuiFl+iFoOiFoeiFp+iFqOiFqeiFreiFr+iFt+iGgeiGkOiGhOiGheiGhuiGi+iGjuiGluiGmOiGm+iGnuiGouiGruiGsuiGtOiGu+iHi+iHg+iHheiHiuiHjuiHj+iHleiHl+iHm+iHneiHnuiHoeiHpOiHq+iHrOiHsOiHseiHsuiHteiHtuiHuOiHueiHveiHv+iIgOiIg+iIj+iIk+iIlOiImeiImuiIneiIoeiIouiIqOiIsuiItOiIuuiJg+iJhOiJheiJhlwiXSxcbltcIjhmZDdhMVwiLFwi6ImL6ImO6ImP6ImR6ImW6Imc6Img6Imj6Imn6Imt6Im06Im76Im96Im/6IqA6IqB6IqD6IqE6IqH6IqJ6IqK6IqO6IqR6IqU6IqW6IqY6Iqa6Iqb6Iqg6Iqh6Iqj6Iqk6Iqn6Iqo6Iqp6Iqq6Iqu6Iqw6Iqy6Iq06Iq36Iq66Iq86Iq+6Iq/6IuG6IuQ6IuV6Iua6Iug6Iui6Iuk6Iuo6Iuq6Iut6Iuv6Iu26Iu36Iu96Iu+6IyA6IyB6IyH6IyI6IyK6IyL6I2U6Iyb6Iyd6Iye6Iyf6Iyh6Iyi6Iys6Iyt6Iyu6Iyw6Iyz6Iy36Iy66Iy86Iy96I2C6I2D6I2E6I2H6I2N6I2O6I2R6I2V6I2W6I2X6I2w6I24XCJdLFxuW1wiOGZkOGExXCIsXCLojb3ojb/ojoDojoLojoTojobojo3ojpLojpTojpXojpjojpnojpvojpzojp3ojqbojqfojqnojqzojr7ojr/oj4Doj4foj4noj4/oj5Doj5Hoj5Toj53ojZPoj6joj6roj7boj7joj7noj7zokIHokIbokIrokI/okJHokJXokJnojq3okK/okLnokYXokYfokYjokYrokY3okY/okZHokZLokZbokZjokZnokZrokZzokaDokaTokaXokafokarokbDokbPokbTokbbokbjokbzokb3okoHokoXokpLokpPokpXokp7okqbokqjokqnokqrokq/okrHokrTokrrokr3okr7ok4Dok4Lok4fok4jok4zok4/ok5NcIl0sXG5bXCI4ZmQ5YTFcIixcIuiTnOiTp+iTquiTr+iTsOiTseiTsuiTt+iUsuiTuuiTu+iTveiUguiUg+iUh+iUjOiUjuiUkOiUnOiUnuiUouiUo+iUpOiUpeiUp+iUquiUq+iUr+iUs+iUtOiUtuiUv+iVhuiVj1wiLDQsXCLolZbolZnolZxcIiw2LFwi6JWk6JWr6JWv6JW56JW66JW76JW96JW/6JaB6JaF6JaG6JaJ6JaL6JaM6JaP6JaT6JaY6Jad6Jaf6Jag6Jai6Jal6Jan6Ja06Ja26Ja36Ja46Ja86Ja96Ja+6Ja/6JeC6JeH6JeK6JeL6JeO6Jat6JeY6Jea6Jef6Jeg6Jem6Jeo6Jet6Jez6Je26Je8XCJdLFxuW1wiOGZkYWExXCIsXCLol7/omIDomITomIXomI3omI7omJDomJHomJLomJjomJnomJvomJ7omKHomKfomKnomLbomLjomLromLzomL3omYDomYLomYbomZLomZPomZbomZfomZjomZnomZ3omaBcIiw0LFwi6Jmp6Jms6Jmv6Jm16Jm26Jm36Jm66JqN6JqR6JqW6JqY6Jqa6Jqc6Jqh6Jqm6Jqn6Jqo6Jqt6Jqx6Jqz6Jq06Jq16Jq36Jq46Jq56Jq/6JuA6JuB6JuD6JuF6JuR6JuS6JuV6JuX6Jua6Juc6Jug6Juj6Jul6Jun6JqI6Ju66Ju86Ju96JyE6JyF6JyH6JyL6JyO6JyP6JyQ6JyT6JyU6JyZ6Jye6Jyf6Jyh6JyjXCJdLFxuW1wiOGZkYmExXCIsXCLonKjonK7onK/onLHonLLonLnonLronLzonL3onL7onYDonYPonYXonY3onZjonZ3onaHonaTonaXona/onbHonbLonbvonoNcIiw2LFwi6J6L6J6M6J6Q6J6T6J6V6J6X6J6Y6J6Z6J6e6J6g6J6j6J6n6J6s6J6t6J6u6J6x6J616J6+6J6/6J+B6J+I6J+J6J+K6J+O6J+V6J+W6J+Z6J+a6J+c6J+f6J+i6J+j6J+k6J+q6J+r6J+t6J+x6J+z6J+46J+66J+/6KCB6KCD6KCG6KCJ6KCK6KCL6KCQ6KCZ6KCS6KCT6KCU6KCY6KCa6KCb6KCc6KCe6KCf6KCo6KCt6KCu6KCw6KCy6KC1XCJdLFxuW1wiOGZkY2ExXCIsXCLooLrooLzooYHooYPooYXooYjooYnooYrooYvooY7ooZHooZXooZbooZjooZrooZzooZ/ooaDooaTooanoobHoobnoobvoooDoopjooproopvoopzoop/ooqDooqjooqroorroor3oor7oo4Doo4pcIiw0LFwi6KOR6KOS6KOT6KOb6KOe6KOn6KOv6KOw6KOx6KO16KO36KSB6KSG6KSN6KSO6KSP6KSV6KSW6KSY6KSZ6KSa6KSc6KSg6KSm6KSn6KSo6KSw6KSx6KSy6KS16KS56KS66KS+6KWA6KWC6KWF6KWG6KWJ6KWP6KWS6KWX6KWa6KWb6KWc6KWh6KWi6KWj6KWr6KWu6KWw6KWz6KW16KW6XCJdLFxuW1wiOGZkZGExXCIsXCLopbvopbzopb3oponopo3oppDoppToppXoppvoppzopp/opqDopqXoprDoprToprXoprboprfoprzop5RcIiw0LFwi6Kel6Kep6Ker6Ket6Kex6Kez6Ke26Ke56Ke96Ke/6KiE6KiF6KiH6KiP6KiR6KiS6KiU6KiV6Kie6Kig6Kii6Kik6Kim6Kir6Kis6Kiv6Ki16Ki36Ki96Ki+6KmA6KmD6KmF6KmH6KmJ6KmN6KmO6KmT6KmW6KmX6KmY6Kmc6Kmd6Kmh6Kml6Kmn6Km16Km26Km36Km56Km66Km76Km+6Km/6KqA6KqD6KqG6KqL6KqP6KqQ6KqS6KqW6KqX6KqZ6Kqf6Kqn6Kqp6Kqu6Kqv6KqzXCJdLFxuW1wiOGZkZWExXCIsXCLoqrboqrfoqrvoqr7oq4Poq4boq4joq4noq4roq5Hoq5Poq5Toq5Xoq5foq53oq5/oq6zoq7Doq7Toq7Xoq7boq7zoq7/orIXorIborIvorJHorJzorJ7orJ/orIrorK3orLDorLforLzorYJcIiw0LFwi6K2I6K2S6K2T6K2U6K2Z6K2N6K2e6K2j6K2t6K226K246K256K286K2+6K6B6K6E6K6F6K6L6K6N6K6P6K6U6K6V6K6c6K6e6K6f6LC46LC56LC96LC+6LGF6LGH6LGJ6LGL6LGP6LGR6LGT6LGU6LGX6LGY6LGb6LGd6LGZ6LGj6LGk6LGm6LGo6LGp6LGt6LGz6LG16LG26LG76LG+6LKGXCJdLFxuW1wiOGZkZmExXCIsXCLosofosovospDospLospPospnospvospzosqTosrnosrros4Xos4bos4nos4vos4/os5bos5Xos5nos53os6Hos6jos6zos6/os7Dos7Los7Xos7fos7jos77os7/otIHotIPotInotJLotJfotJvotaXotanotazota7otb/otoLotoTotojoto3otpDotpHotpXotp7otp/otqDotqbotqvotqzotq/otrLotrXotrfotrnotrvot4Dot4Xot4bot4fot4jot4rot47ot5Hot5Tot5Xot5fot5not6Tot6Xot6fot6zot7Dotrzot7Hot7Lot7Tot73ouIHouITouIXouIbouIvouJHouJTouJbouKDouKHouKJcIl0sXG5bXCI4ZmUwYTFcIixcIui4o+i4pui4p+i4sei4s+i4tui4t+i4uOi4uei4vei5gOi5gei5i+i5jei5jui5j+i5lOi5m+i5nOi5nei5nui5oei5oui5qei5rOi5rei5r+i5sOi5sei5uei5uui5u+i6gui6g+i6iei6kOi6kui6lei6mui6m+i6nei6nui6oui6p+i6qei6rei6rui6s+i6tei6uui6u+i7gOi7gei7g+i7hOi7h+i7j+i7kei7lOi7nOi7qOi7rui7sOi7sei7t+i7uei7uui7rei8gOi8gui8h+i8iOi8j+i8kOi8lui8l+i8mOi8nui8oOi8oei8o+i8pei8p+i8qOi8rOi8rei8rui8tOi8tei8tui8t+i8uui9gOi9gVwiXSxcbltcIjhmZTFhMVwiLFwi6L2D6L2H6L2P6L2RXCIsNCxcIui9mOi9nei9nui9pei+nei+oOi+oei+pOi+pei+pui+tei+tui+uOi+vui/gOi/gei/hui/iui/i+i/jei/kOi/kui/k+i/lei/oOi/o+i/pOi/qOi/rui/sei/tei/tui/u+i/vumAgumAhOmAiOmAjOmAmOmAm+mAqOmAqemAr+mAqumArOmAremAs+mAtOmAt+mAv+mBg+mBhOmBjOmBm+mBnemBoumBpumBp+mBrOmBsOmBtOmBuemChemCiOmCi+mCjOmCjumCkOmClemCl+mCmOmCmemCm+mCoOmCoemCoumCpemCsOmCsumCs+mCtOmCtumCvemDjOmCvumDg1wiXSxcbltcIjhmZTJhMVwiLFwi6YOE6YOF6YOH6YOI6YOV6YOX6YOY6YOZ6YOc6YOd6YOf6YOl6YOS6YO26YOr6YOv6YOw6YO06YO+6YO/6YSA6YSE6YSF6YSG6YSI6YSN6YSQ6YSU6YSW6YSX6YSY6YSa6YSc6YSe6YSg6YSl6YSi6YSj6YSn6YSp6YSu6YSv6YSx6YS06YS26YS36YS56YS66YS86YS96YWD6YWH6YWI6YWP6YWT6YWX6YWZ6YWa6YWb6YWh6YWk6YWn6YWt6YW06YW56YW66YW76YaB6YaD6YaF6YaG6YaK6YaO6YaR6YaT6YaU6YaV6YaY6Yae6Yah6Yam6Yao6Yas6Yat6Yau6Yaw6Yax6Yay6Yaz6Ya26Ya76Ya86Ya96Ya/XCJdLFxuW1wiOGZlM2ExXCIsXCLph4Lph4Pph4Xph5Pph5Tph5fph5nph5rph57ph6Tph6Xph6nph6rph6xcIiw1LFwi6Ye36Ye56Ye76Ye96YiA6YiB6YiE6YiF6YiG6YiH6YiJ6YiK6YiM6YiQ6YiS6YiT6YiW6YiY6Yic6Yid6Yij6Yik6Yil6Yim6Yio6Yiu6Yiv6Yiw6Yiz6Yi16Yi26Yi46Yi56Yi66Yi86Yi+6YmA6YmC6YmD6YmG6YmH6YmK6YmN6YmO6YmP6YmR6YmY6YmZ6Ymc6Ymd6Ymg6Ymh6Yml6Ymn6Ymo6Ymp6Ymu6Ymv6Ymw6Ym1XCIsNCxcIumJu+mJvOmJvemJv+mKiOmKiemKiumKjemKjumKkumKl1wiXSxcbltcIjhmZTRhMVwiLFwi6YqZ6Yqf6Yqg6Yqk6Yql6Yqn6Yqo6Yqr6Yqv6Yqy6Yq26Yq46Yq66Yq76Yq86Yq96Yq/XCIsNCxcIumLhemLhumLh+mLiOmLi+mLjOmLjemLjumLkOmLk+mLlemLl+mLmOmLmemLnOmLnemLn+mLoOmLoemLo+mLpemLp+mLqOmLrOmLrumLsOmLuemLu+mLv+mMgOmMgumMiOmMjemMkemMlOmMlemMnOmMnemMnumMn+mMoemMpOmMpemMp+mMqemMqumMs+mMtOmMtumMt+mNh+mNiOmNiemNkOmNkemNkumNlemNl+mNmOmNmumNnumNpOmNpemNp+mNqemNqumNremNr+mNsOmNsemNs+mNtOmNtlwiXSxcbltcIjhmZTVhMVwiLFwi6Y266Y296Y2/6Y6A6Y6B6Y6C6Y6I6Y6K6Y6L6Y6N6Y6P6Y6S6Y6V6Y6Y6Y6b6Y6e6Y6h6Y6j6Y6k6Y6m6Y6o6Y6r6Y606Y616Y626Y666Y6p6Y+B6Y+E6Y+F6Y+G6Y+H6Y+JXCIsNCxcIumPk+mPmemPnOmPnumPn+mPoumPpumPp+mPuemPt+mPuOmPuumPu+mPvemQgemQgumQhOmQiOmQiemQjemQjumQj+mQlemQlumQl+mQn+mQrumQr+mQsemQsumQs+mQtOmQu+mQv+mQvemRg+mRhemRiOmRiumRjOmRlemRmemRnOmRn+mRoemRo+mRqOmRq+mRremRrumRr+mRsemRsumShOmSg+mVuOmVuVwiXSxcbltcIjhmZTZhMVwiLFwi6ZW+6ZaE6ZaI6ZaM6ZaN6ZaO6Zad6Zae6Zaf6Zah6Zam6Zap6Zar6Zas6Za06Za26Za66Za96Za/6ZeG6ZeI6ZeJ6ZeL6ZeQ6ZeR6ZeS6ZeT6ZeZ6Zea6Zed6Zee6Zef6Zeg6Zek6Zem6Zid6Zie6Zii6Zik6Zil6Zim6Zis6Zix6Ziz6Zi36Zi46Zi56Zi66Zi86Zi96ZmB6ZmS6ZmU6ZmW6ZmX6ZmY6Zmh6Zmu6Zm06Zm76Zm86Zm+6Zm/6ZqB6ZqC6ZqD6ZqE6ZqJ6ZqR6ZqW6Zqa6Zqd6Zqf6Zqk6Zql6Zqm6Zqp6Zqu6Zqv6Zqz6Zq66ZuK6ZuS5bay6ZuY6Zua6Zud6Zue6Zuf6Zup6Zuv6Zux6Zu66ZyCXCJdLFxuW1wiOGZlN2ExXCIsXCLpnIPpnIXpnInpnJrpnJvpnJ3pnKHpnKLpnKPpnKjpnLHpnLPpnYHpnYPpnYrpnY7pnY/pnZXpnZfpnZjpnZrpnZvpnaPpnafpnarpna7pnbPpnbbpnbfpnbjpnbvpnb3pnb/pnoDpnonpnpXpnpbpnpfpnpnpnprpnp7pnp/pnqLpnqzpnq7pnrHpnrLpnrXpnrbpnrjpnrnpnrrpnrzpnr7pnr/pn4Hpn4Tpn4Xpn4fpn4npn4rpn4zpn43pn47pn5Dpn5Hpn5Tpn5fpn5jpn5npn53pn57pn6Dpn5vpn6Hpn6Tpn6/pn7Hpn7Tpn7fpn7jpn7rpoIfpoIrpoJnpoI3poI7poJTpoJbpoJzpoJ7poKDpoKPpoKZcIl0sXG5bXCI4ZmU4YTFcIixcIumgq+mgrumgr+mgsOmgsumgs+mgtemgpemgvumhhOmhh+mhiumhkemhkumhk+mhlumhl+mhmemhmumhoumho+mhpemhpumhqumhrOmiq+miremirumisOmitOmit+miuOmiuumiu+miv+mjgumjhemjiOmjjOmjoemjo+mjpemjpumjp+mjqumjs+mjtumkgumkh+mkiOmkkemklemklumkl+mkmumkm+mknOmkn+mkoumkpumkp+mkq+mksVwiLDQsXCLppLnppLrppLvppLzppYDppYHppYbppYfppYjppY3ppY7ppZTppZjppZnppZvppZzppZ7ppZ/ppaDpppvppp3ppp/ppqbpprDpprHpprLpprVcIl0sXG5bXCI4ZmU5YTFcIixcIummuemmuummvemmv+mng+mniemnk+mnlOmnmemnmumnnOmnnumnp+mnqumnq+mnrOmnsOmntOmntemnuemnvemnvumogumog+mohOmoi+mojOmokOmokemolumonumooOmooumoo+mopOmop+moremorumos+motemotumouOmph+mpgemphOmpiumpi+mpjOmpjumpkemplOmplumpnemqqumqrOmqrumqr+mqsumqtOmqtemqtumquemqu+mqvumqv+mrgemrg+mrhumriOmrjumrkOmrkumrlemrlumrl+mrm+mrnOmroOmrpOmrpemrp+mrqemrrOmrsumrs+mrtemruemruumrvemrv1wiLDRdLFxuW1wiOGZlYWExXCIsXCLprITprIXprIjprInprIvprIzprI3prI7prJDprJLprJbprJnprJvprJzprKDprKbprKvprK3prLPprLTprLXprLfprLnprLrprL3prYjprYvprYzprZXprZbprZfprZvprZ7praHpraPpraXprabprajprapcIiw0LFwi6a2z6a216a236a246a256a2/6a6A6a6E6a6F6a6G6a6H6a6J6a6K6a6L6a6N6a6P6a6Q6a6U6a6a6a6d6a6e6a6m6a6n6a6p6a6s6a6w6a6x6a6y6a636a646a676a686a6+6a6/6a+B6a+H6a+I6a+O6a+Q6a+X6a+Y6a+d6a+f6a+l6a+n6a+q6a+r6a+v6a+z6a+36a+4XCJdLFxuW1wiOGZlYmExXCIsXCLpr7npr7rpr73pr7/psIDpsILpsIvpsI/psJHpsJbpsJjpsJnpsJrpsJzpsJ7psKLpsKPpsKZcIiw0LFwi6bCx6bC16bC26bC36bC96bGB6bGD6bGE6bGF6bGJ6bGK6bGO6bGP6bGQ6bGT6bGU6bGW6bGY6bGb6bGd6bGe6bGf6bGj6bGp6bGq6bGc6bGr6bGo6bGu6bGw6bGy6bG16bG36bG76bOm6bOy6bO36bO56bSL6bSC6bSR6bSX6bSY6bSc6bSd6bSe6bSv6bSw6bSy6bSz6bS06bS66bS86bWF6bS96bWC6bWD6bWH6bWK6bWT6bWU6bWf6bWj6bWi6bWl6bWp6bWq6bWr6bWw6bW26bW36bW7XCJdLFxuW1wiOGZlY2ExXCIsXCLptbzptb7ptoPptoTptobptorpto3pto7ptpLptpPptpXptpbptpfptpjptqHptqrptqzptq7ptrHptrXptrnptrzptr/pt4Ppt4fpt4npt4rpt5Tpt5Xpt5bpt5fpt5rpt57pt5/pt6Dpt6Xpt6fpt6npt6vpt67pt7Dpt7Ppt7Tpt77puIrpuILpuIfpuI7puJDpuJHpuJLpuJXpuJbpuJnpuJzpuJ3pubrpubvpubzpuoDpuoLpuoPpuoTpuoXpuofpuo7puo/pupbpupjpupvpup7puqTpuqjpuqzpuq7puq/purDpurPpurTpurXpu4bpu4jpu4vpu5Xpu5/pu6Tpu6fpu6zpu63pu67pu7Dpu7Hpu7Lpu7VcIl0sXG5bXCI4ZmVkYTFcIixcIum7uOm7v+m8gum8g+m8iem8j+m8kOm8kem8kum8lOm8lum8l+m8mem8mum8m+m8n+m8oum8pum8qum8q+m8r+m8sem8sum8tOm8t+m8uem8uum8vOm8vem8v+m9gem9g1wiLDQsXCLpvZPpvZXpvZbpvZfpvZjpvZrpvZ3pvZ7pvajpvanpva1cIiw0LFwi6b2z6b216b266b296b6P6b6Q6b6R6b6S6b6U6b6W6b6X6b6e6b6h6b6i6b6j6b6lXCJdXG5dXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJ1Q2hhcnNcIjpbMTI4LDE2NSwxNjksMTc4LDE4NCwyMTYsMjI2LDIzNSwyMzgsMjQ0LDI0OCwyNTEsMjUzLDI1OCwyNzYsMjg0LDMwMCwzMjUsMzI5LDMzNCwzNjQsNDYzLDQ2NSw0NjcsNDY5LDQ3MSw0NzMsNDc1LDQ3Nyw1MDYsNTk0LDYxMCw3MTIsNzE2LDczMCw5MzAsOTM4LDk2Miw5NzAsMTAyNiwxMTA0LDExMDYsODIwOSw4MjE1LDgyMTgsODIyMiw4MjMxLDgyNDEsODI0NCw4MjQ2LDgyNTIsODM2NSw4NDUyLDg0NTQsODQ1OCw4NDcxLDg0ODIsODU1Niw4NTcwLDg1OTYsODYwMiw4NzEzLDg3MjAsODcyMiw4NzI2LDg3MzEsODczNyw4NzQwLDg3NDIsODc0OCw4NzUxLDg3NjAsODc2Niw4Nzc3LDg3ODEsODc4Nyw4ODAyLDg4MDgsODgxNiw4ODU0LDg4NTgsODg3MCw4ODk2LDg5NzksOTMyMiw5MzcyLDk1NDgsOTU4OCw5NjE2LDk2MjIsOTYzNCw5NjUyLDk2NjIsOTY3Miw5Njc2LDk2ODAsOTcwMiw5NzM1LDk3MzgsOTc5Myw5Nzk1LDExOTA2LDExOTA5LDExOTEzLDExOTE3LDExOTI4LDExOTQ0LDExOTQ3LDExOTUxLDExOTU2LDExOTYwLDExOTY0LDExOTc5LDEyMjg0LDEyMjkyLDEyMzEyLDEyMzE5LDEyMzMwLDEyMzUxLDEyNDM2LDEyNDQ3LDEyNTM1LDEyNTQzLDEyNTg2LDEyODQyLDEyODUwLDEyOTY0LDEzMjAwLDEzMjE1LDEzMjE4LDEzMjUzLDEzMjYzLDEzMjY3LDEzMjcwLDEzMzg0LDEzNDI4LDEzNzI3LDEzODM5LDEzODUxLDE0NjE3LDE0NzAzLDE0ODAxLDE0ODE2LDE0OTY0LDE1MTgzLDE1NDcxLDE1NTg1LDE2NDcxLDE2NzM2LDE3MjA4LDE3MzI1LDE3MzMwLDE3Mzc0LDE3NjIzLDE3OTk3LDE4MDE4LDE4MjEyLDE4MjE4LDE4MzAxLDE4MzE4LDE4NzYwLDE4ODExLDE4ODE0LDE4ODIwLDE4ODIzLDE4ODQ0LDE4ODQ4LDE4ODcyLDE5NTc2LDE5NjIwLDE5NzM4LDE5ODg3LDQwODcwLDU5MjQ0LDU5MzM2LDU5MzY3LDU5NDEzLDU5NDE3LDU5NDIzLDU5NDMxLDU5NDM3LDU5NDQzLDU5NDUyLDU5NDYwLDU5NDc4LDU5NDkzLDYzNzg5LDYzODY2LDYzODk0LDYzOTc2LDYzOTg2LDY0MDE2LDY0MDE4LDY0MDIxLDY0MDI1LDY0MDM0LDY0MDM3LDY0MDQyLDY1MDc0LDY1MDkzLDY1MTA3LDY1MTEyLDY1MTI3LDY1MTMyLDY1Mzc1LDY1NTEwLDY1NTM2XSxcImdiQ2hhcnNcIjpbMCwzNiwzOCw0NSw1MCw4MSw4OSw5NSw5NiwxMDAsMTAzLDEwNCwxMDUsMTA5LDEyNiwxMzMsMTQ4LDE3MiwxNzUsMTc5LDIwOCwzMDYsMzA3LDMwOCwzMDksMzEwLDMxMSwzMTIsMzEzLDM0MSw0MjgsNDQzLDU0NCw1NDUsNTU4LDc0MSw3NDIsNzQ5LDc1MCw4MDUsODE5LDgyMCw3OTIyLDc5MjQsNzkyNSw3OTI3LDc5MzQsNzk0Myw3OTQ0LDc5NDUsNzk1MCw4MDYyLDgxNDgsODE0OSw4MTUyLDgxNjQsODE3NCw4MjM2LDgyNDAsODI2Miw4MjY0LDgzNzQsODM4MCw4MzgxLDgzODQsODM4OCw4MzkwLDgzOTIsODM5Myw4Mzk0LDgzOTYsODQwMSw4NDA2LDg0MTYsODQxOSw4NDI0LDg0MzcsODQzOSw4NDQ1LDg0ODIsODQ4NSw4NDk2LDg1MjEsODYwMyw4OTM2LDg5NDYsOTA0Niw5MDUwLDkwNjMsOTA2Niw5MDc2LDkwOTIsOTEwMCw5MTA4LDkxMTEsOTExMyw5MTMxLDkxNjIsOTE2NCw5MjE4LDkyMTksMTEzMjksMTEzMzEsMTEzMzQsMTEzMzYsMTEzNDYsMTEzNjEsMTEzNjMsMTEzNjYsMTEzNzAsMTEzNzIsMTEzNzUsMTEzODksMTE2ODIsMTE2ODYsMTE2ODcsMTE2OTIsMTE2OTQsMTE3MTQsMTE3MTYsMTE3MjMsMTE3MjUsMTE3MzAsMTE3MzYsMTE5ODIsMTE5ODksMTIxMDIsMTIzMzYsMTIzNDgsMTIzNTAsMTIzODQsMTIzOTMsMTIzOTUsMTIzOTcsMTI1MTAsMTI1NTMsMTI4NTEsMTI5NjIsMTI5NzMsMTM3MzgsMTM4MjMsMTM5MTksMTM5MzMsMTQwODAsMTQyOTgsMTQ1ODUsMTQ2OTgsMTU1ODMsMTU4NDcsMTYzMTgsMTY0MzQsMTY0MzgsMTY0ODEsMTY3MjksMTcxMDIsMTcxMjIsMTczMTUsMTczMjAsMTc0MDIsMTc0MTgsMTc4NTksMTc5MDksMTc5MTEsMTc5MTUsMTc5MTYsMTc5MzYsMTc5MzksMTc5NjEsMTg2NjQsMTg3MDMsMTg4MTQsMTg5NjIsMTkwNDMsMzM0NjksMzM0NzAsMzM0NzEsMzM0ODQsMzM0ODUsMzM0OTAsMzM0OTcsMzM1MDEsMzM1MDUsMzM1MTMsMzM1MjAsMzM1MzYsMzM1NTAsMzc4NDUsMzc5MjEsMzc5NDgsMzgwMjksMzgwMzgsMzgwNjQsMzgwNjUsMzgwNjYsMzgwNjksMzgwNzUsMzgwNzYsMzgwNzgsMzkxMDgsMzkxMDksMzkxMTMsMzkxMTQsMzkxMTUsMzkxMTYsMzkyNjUsMzkzOTQsMTg5MDAwXX0iLCJtb2R1bGUuZXhwb3J0cz1bXG5bXCJhMTQwXCIsXCLuk4ZcIiw2Ml0sXG5bXCJhMTgwXCIsXCLulIVcIiwzMl0sXG5bXCJhMjQwXCIsXCLulKZcIiw2Ml0sXG5bXCJhMjgwXCIsXCLulaVcIiwzMl0sXG5bXCJhMmFiXCIsXCLunaZcIiw1XSxcbltcImEyZTNcIixcIuKCrO6drVwiXSxcbltcImEyZWZcIixcIu6dru6dr1wiXSxcbltcImEyZmRcIixcIu6dsO6dsVwiXSxcbltcImEzNDBcIixcIu6WhlwiLDYyXSxcbltcImEzODBcIixcIu6XhVwiLDMxLFwi44CAXCJdLFxuW1wiYTQ0MFwiLFwi7pemXCIsNjJdLFxuW1wiYTQ4MFwiLFwi7pilXCIsMzJdLFxuW1wiYTRmNFwiLFwi7p2yXCIsMTBdLFxuW1wiYTU0MFwiLFwi7pmGXCIsNjJdLFxuW1wiYTU4MFwiLFwi7pqFXCIsMzJdLFxuW1wiYTVmN1wiLFwi7p29XCIsN10sXG5bXCJhNjQwXCIsXCLumqZcIiw2Ml0sXG5bXCJhNjgwXCIsXCLum6VcIiwzMl0sXG5bXCJhNmI5XCIsXCLunoVcIiw3XSxcbltcImE2ZDlcIixcIu6ejVwiLDZdLFxuW1wiYTZlY1wiLFwi7p6U7p6VXCJdLFxuW1wiYTZmM1wiLFwi7p6WXCJdLFxuW1wiYTZmNlwiLFwi7p6XXCIsOF0sXG5bXCJhNzQwXCIsXCLunIZcIiw2Ml0sXG5bXCJhNzgwXCIsXCLunYVcIiwzMl0sXG5bXCJhN2MyXCIsXCLunqBcIiwxNF0sXG5bXCJhN2YyXCIsXCLunq9cIiwxMl0sXG5bXCJhODk2XCIsXCLunrxcIiwxMF0sXG5bXCJhOGJjXCIsXCLun4dcIl0sXG5bXCJhOGJmXCIsXCLHuVwiXSxcbltcImE4YzFcIixcIu6fie6fiu6fi+6fjFwiXSxcbltcImE4ZWFcIixcIu6fjVwiLDIwXSxcbltcImE5NThcIixcIu6folwiXSxcbltcImE5NWJcIixcIu6fo1wiXSxcbltcImE5NWRcIixcIu6fpO6fpe6fplwiXSxcbltcImE5ODlcIixcIuOAvuK/sFwiLDExXSxcbltcImE5OTdcIixcIu6ftFwiLDEyXSxcbltcImE5ZjBcIixcIu6ggVwiLDE0XSxcbltcImFhYTFcIixcIu6AgFwiLDkzXSxcbltcImFiYTFcIixcIu6BnlwiLDkzXSxcbltcImFjYTFcIixcIu6CvFwiLDkzXSxcbltcImFkYTFcIixcIu6EmlwiLDkzXSxcbltcImFlYTFcIixcIu6FuFwiLDkzXSxcbltcImFmYTFcIixcIu6HllwiLDkzXSxcbltcImQ3ZmFcIixcIu6gkFwiLDRdLFxuW1wiZjhhMVwiLFwi7oi0XCIsOTNdLFxuW1wiZjlhMVwiLFwi7oqSXCIsOTNdLFxuW1wiZmFhMVwiLFwi7ouwXCIsOTNdLFxuW1wiZmJhMVwiLFwi7o2OXCIsOTNdLFxuW1wiZmNhMVwiLFwi7o6sXCIsOTNdLFxuW1wiZmRhMVwiLFwi7pCKXCIsOTNdLFxuW1wiZmU1MFwiLFwi4rqB7qCW7qCX7qCY4rqE45Gz45GH4rqI4rqL7qCe45ae45ia45iO4rqM4rqX46Wu46SY7qCm46eP46ef46mz46eQ7qCr7qCs462O47Gu47Og4rqn7qCx7qCy4rqq5IGW5IWf4rqu5Iy34rqz4rq24rq37qC75I6x5I6s4rq75I+d5JOW5Jmh5JmM7qGDXCJdLFxuW1wiZmU4MFwiLFwi5Jyj5Jyp5J285J6N4ruK5KWH5KW65KW95KaC5KaD5KaF5KaG5Kaf5Kab5Ka35Ka27qGU7qGV5LKj5LKf5LKg5LKh5LG35LKi5LSTXCIsNixcIuS2ru6hpO6RqFwiLDkzXVxuXVxuIiwibW9kdWxlLmV4cG9ydHM9W1xuW1wiMFwiLFwiXFx1MDAwMFwiLDEyOF0sXG5bXCJhMVwiLFwi772hXCIsNjJdLFxuW1wiODE0MFwiLFwi44CA44CB44CC77yM77yO44O777ya77yb77yf77yB44Kb44KcwrTvvYDCqO+8vu+/o++8v+ODveODvuOCneOCnuOAg+S7neOAheOAhuOAh+ODvOKAleKAkO+8j++8vO+9nuKIpe+9nOKApuKApeKAmOKAmeKAnOKAne+8iO+8ieOAlOOAle+8u++8ve+9m++9neOAiFwiLDksXCLvvIvvvI3CscOXXCJdLFxuW1wiODE4MFwiLFwiw7fvvJ3iiaDvvJzvvJ7iiabiiafiiJ7iiLTimYLimYDCsOKAsuKAs+KEg++/pe+8hO+/oO+/oe+8he+8g++8hu+8iu+8oMKn4piG4piF4peL4peP4peO4peH4peG4pah4pag4paz4pay4pa94pa84oC744CS4oaS4oaQ4oaR4oaT44CTXCJdLFxuW1wiODFiOFwiLFwi4oiI4oiL4oqG4oqH4oqC4oqD4oiq4oipXCJdLFxuW1wiODFjOFwiLFwi4oin4oio77+i4oeS4oeU4oiA4oiDXCJdLFxuW1wiODFkYVwiLFwi4oig4oql4oyS4oiC4oiH4omh4omS4omq4omr4oia4oi94oid4oi14oir4oisXCJdLFxuW1wiODFmMFwiLFwi4oSr4oCw4pmv4pmt4pmq4oCg4oChwrZcIl0sXG5bXCI4MWZjXCIsXCLil69cIl0sXG5bXCI4MjRmXCIsXCLvvJBcIiw5XSxcbltcIjgyNjBcIixcIu+8oVwiLDI1XSxcbltcIjgyODFcIixcIu+9gVwiLDI1XSxcbltcIjgyOWZcIixcIuOBgVwiLDgyXSxcbltcIjgzNDBcIixcIuOCoVwiLDYyXSxcbltcIjgzODBcIixcIuODoFwiLDIyXSxcbltcIjgzOWZcIixcIs6RXCIsMTYsXCLOo1wiLDZdLFxuW1wiODNiZlwiLFwizrFcIiwxNixcIs+DXCIsNl0sXG5bXCI4NDQwXCIsXCLQkFwiLDUsXCLQgdCWXCIsMjVdLFxuW1wiODQ3MFwiLFwi0LBcIiw1LFwi0ZHQtlwiLDddLFxuW1wiODQ4MFwiLFwi0L5cIiwxN10sXG5bXCI4NDlmXCIsXCLilIDilILilIzilJDilJjilJTilJzilKzilKTilLTilLzilIHilIPilI/ilJPilJvilJfilKPilLPilKvilLvilYvilKDilK/ilKjilLfilL/ilJ3ilLDilKXilLjilYJcIl0sXG5bXCI4NzQwXCIsXCLikaBcIiwxOSxcIuKFoFwiLDldLFxuW1wiODc1ZlwiLFwi442J44yU44yi442N44yY44yn44yD44y2442R442X44yN44ym44yj44yr442K44y7446c446d446e446O446P44+E446hXCJdLFxuW1wiODc3ZVwiLFwi4427XCJdLFxuW1wiODc4MFwiLFwi44Cd44Cf4oSW44+N4oSh44qkXCIsNCxcIuOIseOIsuOIueONvuONveONvOKJkuKJoeKIq+KIruKIkeKImuKKpeKIoOKIn+KKv+KIteKIqeKIqlwiXSxcbltcIjg4OWZcIixcIuS6nOWUluWog+mYv+WTgOaEm+aMqOWntumAouiRteiMnOepkOaCquaPoea4peaXreiRpuiKpumvteaik+Wcp+aWoeaJseWum+WnkOiZu+mjtOe1oue2vumujuaIlueyn+iit+WuieW6teaMieaal+ahiOmXh+mejeadj+S7peS8iuS9jeS+neWBieWbsuWkt+WnlOWogeWwieaDn+aEj+aFsOaYk+akheeCuueVj+eVsOenu+e2ree3r+iDg+iQjuiho+isgumBlemBuuWMu+S6leS6peWfn+iCsumDgeejr+S4gOWjsea6oumAuOeosuiMqOiKi+mwr+WFgeWNsOWSveWToeWboOWnu+W8lemjsua3q+iDpOiUrVwiXSxcbltcIjg5NDBcIixcIumZoumZsOmaoOmfu+WQi+WPs+Wuh+eDj+e+vei/gumbqOWNr+m1nOequuS4keeik+iHvOa4puWYmOWUhOasneiUmumwu+WnpeWOqea1pueTnOmWj+WZguS6kemBi+mbsuiNj+mkjOWPoeWWtuWssOW9seaYoOabs+aghOawuOazs+a0qeeRm+ebiOepjumgtOiLseihm+ipoOmLrea2sueWq+ebiumnheaCpuisgei2iumWsuamjuWOreWGhlwiXSxcbltcIjg5ODBcIixcIuWckuWgsOWlhOWutOW7tuaAqOaOqeaPtOayv+a8lOeCjueElOeFmeeHleeMv+e4geiJtuiLkeiWl+mBoOmJm+m0m+WhqeaWvOaxmueUpeWHueWkruWlpeW+gOW/nOaKvOaXuuaoquasp+autOeOi+e/geillum0rOm0jum7hOWyoeayluiNu+WEhOWxi+aGtuiHhuahtueJoeS5meS/uuWNuOaBqea4qeepj+mfs+S4i+WMluS7ruS9leS8veS+oeS9s+WKoOWPr+WYieWkj+WrgeWutuWvoeenkeaah+aenOaetuatjOays+eBq+ePguemjeemvueovOeuh+iKseiLm+iMhOiNt+iPr+iPk+idpuiqsuWYqeiyqOi/pumBjumcnuiaiuS/hOWzqOaIkeeJmeeUu+iHpeiKveibvuizgOmbhemkk+mnleS7i+S8muino+WbnuWhiuWjiuW7u+W/q+aAquaClOaBouaHkOaIkuaLkOaUuVwiXSxcbltcIjhhNDBcIixcIumtgeaZpuaisOa1t+eBsOeVjOeahue1teiKpeifuemWi+majuiyneWHseWKvuWkluWSs+Wus+W0luaFqOamgua2r+eijeiTi+ihl+ipsumOp+mquOa1rOmmqOibmeWeo+afv+ibjumIjuWKg+Wah+WQhOW7k+aLoeaSueagvOaguOauu+eNsueiuuepq+immuinkui1q+i8g+mDremWo+malOmdqeWtpuWys+alvemhjemhjuaOm+esoOaoq1wiXSxcbltcIjhhODBcIixcIuapv+aitumwjea9n+WJsuWWneaBsOaLrOa0u+a4h+a7keiRm+ikkOi9hOS4lOmwueWPtuakm+aouumehOagquWFnOerg+iSsumHnOmOjOWZm+m0qOagouiMheiQseeypeWIiOiLheeTpuS5vuS+g+WGoOWvkuWIiuWLmOWLp+W3u+WWmuWgquWnpuWujOWumOWvm+W5suW5ueaCo+aEn+aFo+aGvuaPm+aVouafkeahk+ajuuasvuatk+axl+a8oua+l+a9heeSsOeUmOebo+eci+erv+euoeewoee3qee8tue/sOiCneiJpuiOnuims+irjOiyq+mChOmRkemWk+mWkemWoumZpemfk+mkqOiImOS4uOWQq+WyuOW3jOeOqeeZjOecvOWyqee/q+i0i+mbgemgkemhlOmhmOS8geS8juWNseWWnOWZqOWfuuWlh+WsieWvhOWykOW4jOW5vuW/jOaPruacuuaXl+aXouacn+aji+ajhFwiXSxcbltcIjhiNDBcIixcIuapn+W4sOavheawl+axveeVv+eliOWto+eogOe0gOW+veimj+iomOiytOi1t+i7jOi8nemjoumojumsvOS6gOWBveWEgOWmk+WunOaIr+aKgOaTrOasuueKoOeWkeelh+e+qeifu+iqvOitsOaOrOiPiumeoOWQieWQg+WWq+ahlOapmOipsOegp+adtem7jeWNtOWuouiEmuiZkOmAhuS4mOS5heS7h+S8keWPiuWQuOWuruW8k+aApeaVkVwiXSxcbltcIjhiODBcIixcIuacveaxguaxsuazo+eBuOeQg+eptueqruesiOe0muezvue1puaXp+eJm+WOu+WxheW3qOaLkuaLoOaMmea4oOiZmuiosei3nemLuOa8geempumtmuS6qOS6q+S6rOS+m+S+oOWDkeWFh+ertuWFseWHtuWNlOWMoeWNv+WPq+WWrOWig+WzoeW8t+W9iuaAr+aBkOaBreaMn+aVmeapi+azgeeLgueLreefr+iDuOiEheiIiOiVjumDt+mPoemfv+mll+mpmuS7sOWHneWwreaagealreWxgOabsualteeOieahkOeygeWDheWLpOWdh+W3vumMpuaWpOaso+asveeQtOemgeemveeti+e3iuiKueiPjOihv+iln+isuei/kemHkeWQn+mKgOS5neWAtuWPpeWMuueLl+eOluefqeiLpui6r+mnhumniOmnkuWFt+aEmuiZnuWWsOepuuWBtuWvk+mBh+maheS4suarm+mHp+WxkeWxiFwiXSxcbltcIjhjNDBcIixcIuaOmOeqn+ayk+mdtOi9oeeqqueGiumaiOeyguagl+e5sOahkemNrOWLsuWQm+iWq+iok+e+pOi7jemDoeWNpuiiiOelgeS/guWCvuWIkeWFhOWVk+WcreePquWei+WlkeW9ouW+hOaBteaFtuaFp+aGqeaOsuaQuuaVrOaZr+ahgua4k+eVpueoveezu+e1jOe2mee5i+e9q+iMjuiNiuibjeioiOipo+itpui7vemgmum2j+iKuOi/jumvqFwiXSxcbltcIjhjODBcIixcIuWKh+aIn+aSg+a/gOmameahgeWCkeasoOaxuua9lOeptOe1kOihgOioo+aciOS7tuWAueWApuWBpeWFvOWIuOWJo+WWp+Wcj+WgheWrjOW7uuaGsuaHuOaLs+aNsuaknOaoqeeJveeKrOeMrueglOehr+e1ueecjOiCqeimi+ismeizoui7kumBo+mNtemZuumhlemok+m5uOWFg+WOn+WOs+W5u+W8pua4m+a6kOeOhOePvue1g+iIt+iogOiruumZkOS5juWAi+WPpOWRvOWbuuWnkeWtpOW3seW6q+W8p+aIuOaVheaer+a5lueLkOeziuiitOiCoeiDoeiPsOiZjuiqh+i3qOmIt+mbh+mhp+m8k+S6lOS6kuS8jeWNiOWRieWQvuWor+W+jOW+oeaCn+aip+aqjueRmueigeiqnuiqpOitt+mGkOS5numvieS6pOS9vOS+r+WAmeWAluWFieWFrOWKn+WKueWLvuWOmuWPo+WQkVwiXSxcbltcIjhkNDBcIixcIuWQjuWWieWdkeWeouWlveWtlOWtneWuj+W3peW3p+W3t+W5uOW6g+W6muW6t+W8mOaBkuaFjOaKl+aLmOaOp+aUu+aYguaZg+abtOadreagoeail+ani+axn+a0qua1qea4r+a6neeUsueah+ehrOeov+ezoOe0hee0mOe1nue2seiAleiAg+iCr+iCseiFlOiGj+iIquiNkuihjOihoeism+iyouizvOmDiumFtemJseegv+mLvOmWpOmZjVwiXSxcbltcIjhkODBcIixcIumghemmmemrmOm0u+WJm+WKq+WPt+WQiOWjleaLt+a/oOixqui9n+m6ueWFi+WIu+WRiuWbveepgOmFt+m1oOm7kueNhOa8ieiFsOeUkeW/veaDmumqqOeLm+i+vOatpOmgg+S7iuWbsOWdpOWivuWpmuaBqOaHh+aYj+aYhuagueaisea3t+eXlee0uuiJrumtguS6m+S9kOWPieWUhuW1r+W3puW3ruafu+aymeeRs+egguipkOmOluijn+WdkOW6p+aMq+WCteWCrOWGjeacgOWTieWhnuWmu+WusOW9qeaJjeaOoeagveats+a4iOeBvemHh+eKgOegleegpuelreaWjue0sOiPnOijgei8iemam+WJpOWcqOadkOe9quiyoeWGtOWdgumYquWguuamiuiCtOWSsuW0juWfvOeilem3uuS9nOWJiuWSi+aQvuaYqOaclOafteeqhOetlue0oumMr+ahnOmureesueWMmeWGiuWIt1wiXSxcbltcIjhlNDBcIixcIuWvn+aLtuaSruaTpuacreauuuiWqembkeeakOmvluaNjOmMhumuq+eav+aZkuS4ieWCmOWPguWxseaDqOaSkuaVo+ahn+eHpuePiueUo+eul+e6guialeiug+izm+mFuOmkkOaWrOaaq+aui+S7leS7lOS8uuS9v+WIuuWPuOWPsuWXo+Wbm+Wjq+Wni+WnieWnv+WtkOWxjeW4guW4q+W/l+aAneaMh+aUr+WtnOaWr+aWveaXqOaeneatolwiXSxcbltcIjhlODBcIixcIuatu+awj+eNheelieengeezuOe0mee0q+iCouiEguiHs+imluipnuipqeippuiqjOirruizh+iznOmbjOmjvOatr+S6i+S8vOS+jeWFkOWtl+WvuuaFiOaMgeaZguasoea7i+ayu+eIvueSveeXlOejgeekuuiAjOiAs+iHquiSlOi+nuaxkOm5v+W8j+itmOm0q+eruui7uOWujembq+S4g+WPseWft+WkseWrieWupOaCiea5v+a8hueWvuizquWun+iUgOevoOWBsuaftOiKneWxoeiViue4nuiIjuWGmeWwhOaNqOi1puaWnOeFruekvue0l+iAheisnei7iumBruibh+mCquWAn+WLuuWwuuadk+eBvOeItemFjOmHiOmMq+iLpeWvguW8seaDueS4u+WPluWuiOaJi+acseauiueLqeePoOeoruiFq+i2o+mFkummluWEkuWPl+WRquWvv+aOiOaouee2rOmcgOWbmuWPjuWRqFwiXSxcbltcIjhmNDBcIixcIuWul+WwseW3nuS/ruaEgeaLvua0suengOeni+e1gue5jee/kuiHreiIn+iSkOihhuilsuiukOi5tOi8r+mAsemFi+mFrOmbhumGnOS7gOS9j+WFheWNgeW+k+aIjuaflOaxgea4i+eNo+e4pumHjemKg+WPlOWkmeWuv+a3keelnee4rueym+WhvueGn+WHuuihk+i/sOS/iuWzu+aYpeeerOero+iInOmnv+WHhuW+quaXrOalr+auiea3s1wiXSxcbltcIjhmODBcIixcIua6lua9pOebvue0lOW3oemBtemGh+mghuWHpuWIneaJgOaakeabmea4muW6tue3kue9suabuOiWr+iXt+iruOWKqeWPmeWls+W6j+W+kOaBlemLpOmZpOWCt+WEn+WLneWMoOWNh+WPrOWTqOWVhuWUseWYl+WlqOWmvuWovOWuteWwhuWwj+WwkeWwmuW6hOW6iuW7oOW9sOaJv+aKhOaLm+aOjOaNt+aYh+aYjOaYreaZtuadvuaiouaon+aoteayvOa2iOa4iea5mOeEvOeEpueFp+eXh+ecgeehneekgeelpeensOeroOeskeeyp+e0ueiCluiPluiSi+iVieihneijs+ion+iovOiplOips+ixoeiznumGpOmJpumNvumQmOmanOmemOS4iuS4iOS4nuS5l+WGl+WJsOWfjuWgtOWjjOWsouW4uOaDheaTvuadoeadlua1hOeKtueVs+epo+iSuOitsumGuOmMoOWYseWftOmjvlwiXSxcbltcIjkwNDBcIixcIuaLreakjeaulueHree5lOiBt+iJsuinpumjn+idlei+seWwu+S8uOS/oeS+teWUh+WooOWvneWvqeW/g+aFjuaMr+aWsOaZi+ajruamm+a1uOa3seeUs+eWueecn+elnuenpue0s+iHo+iKr+iWquimquiouui6q+i+m+mAsumHnemch+S6uuS7geWIg+WhteWjrOWwi+eUmuWwveiFjuioiui/hemZo+mdreespeirj+mgiOmFouWbs+WOqFwiXSxcbltcIjkwODBcIixcIumAl+WQueWeguW4peaOqOawtOeCiuedoeeyi+e/oOihsOmBgumFlOmMkOmMmOmaj+eRnumrhOW0h+W1qeaVsOaeoui2qOmbm+aNruadieakmeiPhemgl+mbgOijvua+hOaRuuWvuOS4lueArOeVneaYr+WHhOWItuWLouWnk+W+geaAp+aIkOaUv+aVtOaYn+aZtOajsuagluato+a4heeJsueUn+ebm+eyvuiBluWjsOijveilv+iqoOiqk+iri+mAnemGkumdkumdmeaWieeojuiEhumau+W4reaDnOaImuaWpeaYlOaekOefs+epjeexjee4vuiEiuiyrOi1pOi3oei5n+eiqeWIh+aLmeaOpeaRguaKmOioreeqg+evgOiqrOmbque1tuiIjOidieS7meWFiOWNg+WNoOWuo+WwguWwluW3neaIpuaJh+aSsOagk+agtOaziea1hea0l+afk+a9nOeFjueFveaXi+epv+euree3mlwiXSxcbltcIjkxNDBcIixcIue5iue+qOiFuuiIm+iIueiWpuipruizjui3temBuOmBt+mKremKkemWg+muruWJjeWWhOa8uOeEtuWFqOemhee5leiGs+ezjuWZjOWhkeWyqOaOquabvuabvealmueLmeeWj+eWjuekjuelluenn+eyl+e0oOe1hOiYh+iotOmYu+mBoem8oOWDp+WJteWPjOWPouWAieWWquWjruWlj+eIveWui+WxpOWMneaDo+aDs+aNnOaOg+aMv+aOu1wiXSxcbltcIjkxODBcIixcIuaTjeaXqeabueW3o+anjeanvea8leeHpeS6ieeXqeebuOeqk+ezn+e3j+e2nOiBoeiNieiNmOiRrOiSvOiXu+ijhei1sOmAgemBremOl+mcnOmokuWDj+Wil+aGjuiHk+iUtei0iOmAoOS/g+WBtOWJh+WNs+aBr+aNieadn+a4rOi2s+mAn+S/l+WxnuiziuaXj+e2muWNkuiiluWFtuaPg+WtmOWtq+WwiuaQjeadkemBnOS7luWkmuWkquaxsOipkeWUvuWgleWmpeaDsOaJk+afgeiIteallemZgOmnhOmoqOS9k+WghuWvvuiAkOWyseW4r+W+heaAoOaFi+aItOabv+azsOa7nuiDjuiFv+iLlOiii+iyuOmAgOmArumaium7m+mvm+S7o+WPsOWkp+esrOmGjemhjOm3uea7neeAp+WNk+WVhOWuheaJmOaKnuaLk+ayoua/r+eQouiol+mQuOa/geirvuiMuOWHp+ibuOWPqlwiXSxcbltcIjkyNDBcIixcIuWPqeS9humBlOi+sOWlquiEseW3veerqui+v+ajmuiwt+eLuOmxiOaoveiqsOS4ueWNmOWYhuWdpuaLheaOouaXpuatjua3oea5m+eCreefreerr+euque2u+iAveiDhuibi+iqlemNm+Wbo+Wjh+W8vuaWreaaluaqgOauteeUt+irh+WApOefpeWcsOW8m+aBpeaZuuaxoOeXtOeomue9ruiHtOicmOmBhemms+evieeVnOerueetkeiThFwiXSxcbltcIjkyODBcIixcIumAkOenqeeqkuiMtuWroeedgOS4reS7suWumeW/oOaKveaYvOafseazqOiZq+iht+iou+mFjumLs+mnkOaol+eApueMquiLp+iRl+iyr+S4geWFhuWHi+WWi+WvteW4luW4s+W6geW8lOW8teW9q+W+tOaHsuaMkeaaouacnea9rueJkueUuuecuuiBtOiEueiFuOidtuiqv+irnOi2hei3s+mKmumVt+mggumzpeWLheaNl+ebtOacleayiOePjeizg+mOrumZs+a0peWinOakjuanjOi/vemOmueXm+mAmuWhmuagguaOtOanu+S9g+a8rOafmOi+u+iUpue2tOmNlOakv+a9sOWdquWjt+WsrOe0rOeIquWQiumHo+m2tOS6reS9juWBnOWBteWJg+iynuWRiOWgpOWumuW4neW6leW6reW7t+W8n+aCjOaKteaMuuaPkOair+axgOeih+emjueoi+e3oOiJh+ioguirpui5hOmAk1wiXSxcbltcIjkzNDBcIixcIumCuOmEremHmOm8juazpeaRmOaTouaVtea7tOeahOesm+mBqemPkea6uuWTsuW+ueaSpOi9jei/remJhOWFuOWhq+WkqeWxleW6l+a3u+e6j+eUnOiyvOi7oumhm+eCueS8neauv+a+seeUsOmbu+WFjuWQkOWgteWhl+WmrOWxoOW+kuaWl+adnOa4oeeZu+iPn+izremAlOmDvemNjeegpeeguuWKquW6puWcn+WltOaAkuWAkuWFmuWGrFwiXSxcbltcIjkzODBcIixcIuWHjeWIgOWUkOWhlOWhmOWll+WuleWztuW2i+aCvOaKleaQreadseahg+aivOajn+ebl+a3mOa5r+a2m+eBr+eHiOW9k+eXmOelt+etieetlOetkuezlue1seWIsOiRo+iVqeiXpOiojuishOixhui4j+mAg+mAj+mQmemZtumgremosOmXmOWDjeWLleWQjOWgguWwjuaGp+aSnua0nuees+erpeiDtOiQhOmBk+mKheWzoOm0h+WMv+W+l+W+s+a2nOeJueedo+emv+evpOavkueLrOiqreagg+apoeWHuOeqgeaktOWxiumztuiLq+WvhemFieeAnuWZuOWxr+aDh+aVpuayjOixmumBgemgk+WRkeabh+mIjeWliOmCo+WGheS5jeWHquiWmeisjueBmOaNuumNi+aloummtOe4hOeVt+WNl+aloOi7n+mbo+axneS6jOWwvOW8kOi/qeWMguizkeiCieiZueW7v+aXpeS5s+WFpVwiXSxcbltcIjk0NDBcIixcIuWmguWwv+mfruS7u+WmiuW/jeiqjea/oeemsOelouWvp+iRseeMq+eGseW5tOW/teaNu+aSmueHg+eymOS5g+W7vOS5i+WfnOWaouaCqea/g+e0jeiDveiEs+iGv+i+suiml+iapOW3tOaKiuaSreimh+adt+azoua0vueQtuegtOWphue9teiKremmrOS/s+W7g+aLneaOkuaVl+adr+ebg+eJjOiDjOiCuui8qemFjeWAjeWfueWqkuaihVwiXSxcbltcIjk0ODBcIixcIuals+eFpOeLveiyt+WjsuizoOmZqumAmeidv+enpOefp+iQqeS8r+WJpeWNmuaLjeafj+aziueZveeulOeyleiItuiWhOi/q+abnea8oOeIhue4m+iOq+mngem6puWHveeuseehsueuuOiCh+etiOarqOW5oeiCjOeVkeeVoOWFq+mJoua6jOeZuumGl+mrquS8kOe9sOaKnOetj+mWpemzqeWZuuWhmeibpOmavOS8tOWIpOWNiuWPjeWPm+W4huaQrOaWkeadv+awvuaxjueJiOeKr+ePreeVlOe5geiIrOiXqeiyqeevhOmHhueFqemgkumjr+aMveaZqeeVquebpOejkOiVg+ibruWMquWNkeWQpuWmg+W6h+W9vOaCsuaJieaJueaKq+aWkOavlOazjOeWsuearueikeenmOe3i+e9t+iCpeiiq+iqueiyu+mBv+mdnumjm+aoi+ewuOWCmeWwvuW+ruaeh+avmOeQteeciee+jlwiXSxcbltcIjk1NDBcIixcIum8u+afiueol+WMueeWi+mrreW9puiGneiPseiCmOW8vOW/heeVouethumAvOahp+Wnq+Wqm+e0kOeZvuisrOS/teW9quaomeawt+a8gueTouelqOihqOipleixueW7n+aPj+eXheenkuiLl+mMqOmLsuiSnOibremwreWTgeW9rOaWjOa1nOeAleiyp+izk+mgu+aVj+eTtuS4jeS7mOWfoOWkq+WppuWvjOWGqOW4g+W6nOaAluaJtuaVt1wiXSxcbltcIjk1ODBcIixcIuaWp+aZrua1rueItuespuiFkOiGmuiKmeitnOiyoOizpui1tOmYnOmZhOS+ruaSq+atpuiInuiRoeiVqumDqOWwgealk+miqOiRuuiVl+S8j+WJr+W+qeW5heacjeemj+iFueikh+imhua3teW8l+aJleayuOS7j+eJqemukuWIhuWQu+WZtOWis+aGpOaJrueEmuWlrueyieeznue0m+mbsOaWh+iBnuS4meS9teWFteWhgOW5o+W5s+W8iuafhOS4puiUvemWiemZm+exs+mggeWDu+WjgeeZlueip+WIpeeepeiUkeeuhuWBj+WkieeJh+evh+e3qOi+uui/lOmBjeS+v+WLieWoqeW8gemereS/neiIl+mLquWcg+aNleatqeeUq+ijnOi8lOepguWLn+Wik+aFleaIiuaaruavjeewv+iPqeWAo+S/uOWMheWRhuWgseWlieWuneWzsOWzr+W0qeW6luaKseaNp+aUvuaWueaci1wiXSxcbltcIjk2NDBcIixcIuazleazoeeDueegsue4q+iDnuiKs+iQjOiTrOicguikkuioquixiumCpumLkumjvemzs+m1rOS5j+S6oeWCjeWJluWdiuWmqOW4veW/mOW/meaIv+aatOacm+afkOajkuWGkue0oeiCquiGqOisgOiyjOiyv+mJvumYsuWQoOmgrOWMl+WDleWNnOWiqOaSsuactOeJp+edpuephumHpuWLg+ayoeauhuWggOW5jOWllOacrOe/u+WHoeebhlwiXSxcbltcIjk2ODBcIixcIuaRqeejqOmtlOm6u+Wfi+WmueaYp+aemuavjuWTqeanmeW5leiGnOaelemuquafvumxkuahneS6puS/o+WPiOaKueacq+ayq+i/hOS+ree5rem6v+S4h+aFoua6gOa8q+iUk+WRs+acqumtheW3s+euleWyrOWvhuicnOa5iuiTkeeolOiEiOWmmeeyjeawkeecoOWLmeWkoueEoeeJn+efm+mcp+m1oeaki+Wpv+WomOWGpeWQjeWRveaYjuebn+i/t+mKmOmztOWnqueJnea7heWFjeajiee2v+e3rOmdoum6uuaRuOaooeiMguWmhOWtn+avm+eMm+ebsue2suiAl+iSmeWEsuacqOm7meebruadouWLv+mkheWwpOaIu+exvuiysOWVj+aCtue0i+mWgOWMgeS5n+WGtuWknOeIuuiAtumHjuW8peefouWOhOW9uee0hOiWrOios+i6jemdluafs+iWrumRk+aEieaEiOayueeZklwiXSxcbltcIjk3NDBcIixcIuirrei8uOWUr+S9keWEquWLh+WPi+WupeW5veaCoOaGguaPluacieafmua5p+a2jOeMtueMt+eUseelkOijleiqmOmBiumCkemDtembhOiejeWkleS6iOS9meS4juiqiei8v+mgkOWCreW5vOWmluWuueW6uOaPmuaPuuaTgeabnOaliuanmOa0i+a6tueGlOeUqOeqr+e+iuiAgOiRieiTieimgeisoei4iumBpemZvemkiuaFvuaKkeasslwiXSxcbltcIjk3ODBcIixcIuayg+a1tOe/jOe/vOa3gOe+heieuuijuOadpeiOsemgvOmbt+a0m+e1oeiQvemFquS5seWNteW1kOashOa/q+iXjeiYreimp+WIqeWQj+WxpeadjuaiqOeQhueSg+eXouijj+ijoemHjOmboumZuOW+i+eOh+eri+iRjuaOoOeVpeWKiea1gea6nOeQieeVmeehq+eykumahuernOm+jeS+tuaFruaXheiZnOS6huS6ruWDmuS4oeWHjOWvruaWmeaigea2vOeMn+eZgueereeonOezp+iJr+irkumBvOmHj+mZtemgmOWKm+e3keWAq+WOmOael+a3i+eHkOeQs+iHqOi8qumao+mxl+m6n+eRoOWhgea2mee0r+mhnuS7pOS8tuS+i+WGt+WKseW2uuaAnOeOsuekvOiLk+mItOmat+mbtumcium6l+m9ouaapuattOWIl+WKo+eDiOijguW7ieaBi+aGkOa8o+eFieewvue3tOiBr1wiXSxcbltcIjk4NDBcIixcIuiTrumAo+mMrOWRgumtr+ark+eCieizgui3r+mcsuWKtOWpgeW7iuW8hOacl+alvOamlOa1qua8j+eJoueLvOevreiAgeiBvuidi+mDjuWFrem6k+emhOiCi+mMsuirluWAreWSjOipseatquizhOiEh+aDkeaeoOm3suS6meS6mOmwkOipq+iXgeiVqOakgOa5vueil+iFlVwiXSxcbltcIjk4OWZcIixcIuW8jOS4kOS4leS4quS4seS4tuS4vOS4v+S5guS5luS5mOS6guS6heixq+S6iuiIkuW8jeS6juS6nuS6n+S6oOS6ouS6sOS6s+S6tuS7juS7jeS7hOS7huS7guS7l+S7nuS7reS7n+S7t+S8ieS9muS8sOS9m+S9neS9l+S9h+S9tuS+iOS+j+S+mOS9u+S9qeS9sOS+keS9r+S+huS+luWEmOS/lOS/n+S/juS/mOS/m+S/keS/muS/kOS/pOS/peWAmuWAqOWAlOWAquWApeWAheS8nOS/tuWAoeWAqeWArOS/vuS/r+WAkeWAhuWBg+WBh+acg+WBleWBkOWBiOWBmuWBluWBrOWBuOWCgOWCmuWCheWCtOWCslwiXSxcbltcIjk5NDBcIixcIuWDieWDiuWCs+WDguWDluWDnuWDpeWDreWDo+WDruWDueWDteWEieWEgeWEguWEluWEleWElOWEmuWEoeWEuuWEt+WEvOWEu+WEv+WFgOWFkuWFjOWFlOWFoueruOWFqeWFquWFruWGgOWGguWbmOWGjOWGieWGj+WGkeWGk+WGleWGluWGpOWGpuWGouWGqeWGquWGq+WGs+WGseWGsuWGsOWGteWGveWHheWHieWHm+WHoOiZleWHqeWHrVwiXSxcbltcIjk5ODBcIixcIuWHsOWHteWHvuWIhOWIi+WIlOWIjuWIp+WIquWIruWIs+WIueWJj+WJhOWJi+WJjOWJnuWJlOWJquWJtOWJqeWJs+WJv+WJveWKjeWKlOWKkuWJseWKiOWKkei+qOi+p+WKrOWKreWKvOWKteWLgeWLjeWLl+WLnuWLo+WLpumjreWLoOWLs+WLteWLuOWLueWMhuWMiOeUuOWMjeWMkOWMj+WMleWMmuWMo+WMr+WMseWMs+WMuOWNgOWNhuWNheS4l+WNieWNjeWHluWNnuWNqeWNruWkmOWNu+WNt+WOguWOluWOoOWOpuWOpeWOruWOsOWOtuWPg+ewkumbmeWPn+abvOeHruWPruWPqOWPreWPuuWQgeWQveWRgOWQrOWQreWQvOWQruWQtuWQqeWQneWRjuWSj+WRteWSjuWRn+WRseWRt+WRsOWSkuWRu+WSgOWRtuWShOWSkOWShuWTh+WSouWSuOWSpeWSrOWThOWTiOWSqFwiXSxcbltcIjlhNDBcIixcIuWSq+WTguWSpOWSvuWSvOWTmOWTpeWTpuWUj+WUlOWTveWTruWTreWTuuWTouWUueWVgOWVo+WVjOWUruWVnOWVheWVluWVl+WUuOWUs+WVneWWmeWWgOWSr+WWiuWWn+WVu+WVvuWWmOWWnuWWruWVvOWWg+WWqeWWh+WWqOWXmuWXheWXn+WXhOWXnOWXpOWXlOWYlOWXt+WYluWXvuWXveWYm+WXueWZjuWZkOeHn+WYtOWYtuWYsuWYuFwiXSxcbltcIjlhODBcIixcIuWZq+WZpOWYr+WZrOWZquWahuWagOWaiuWaoOWalOWaj+WapeWaruWatuWatOWbguWavOWbgeWbg+WbgOWbiOWbjuWbkeWbk+Wbl+WbruWbueWcgOWbv+WchOWcieWciOWci+WcjeWck+WcmOWcluWXh+WcnOWcpuWct+WcuOWdjuWcu+WdgOWdj+WdqeWfgOWeiOWdoeWdv+WeieWek+WeoOWes+WepOWequWesOWfg+WfhuWflOWfkuWfk+WgiuWfluWfo+Wgi+WgmeWgneWhsuWgoeWhouWhi+WhsOavgOWhkuWgveWhueWiheWiueWin+Wiq+WiuuWjnuWiu+WiuOWiruWjheWjk+WjkeWjl+WjmeWjmOWjpeWjnOWjpOWjn+Wjr+WjuuWjueWju+WjvOWjveWkguWkiuWkkOWkm+aipuWkpeWkrOWkreWksuWkuOWkvuerkuWlleWlkOWljuWlmuWlmOWlouWloOWlp+WlrOWlqVwiXSxcbltcIjliNDBcIixcIuWluOWmgeWmneS9nuS+q+Wmo+WmsuWnhuWnqOWnnOWmjeWnmeWnmuWopeWon+WokeWonOWoieWomuWpgOWprOWpieWoteWotuWpouWpquWqmuWqvOWqvuWri+WrguWqveWro+Wrl+WrpuWrqeWrluWruuWru+WsjOWsi+WsluWssuWrkOWsquWstuWsvuWtg+WtheWtgOWtkeWtleWtmuWtm+WtpeWtqeWtsOWts+WtteWtuOaWiOWtuuWugFwiXSxcbltcIjliODBcIixcIuWug+WupuWuuOWvg+Wvh+WvieWvlOWvkOWvpOWvpuWvouWvnuWvpeWvq+WvsOWvtuWvs+WwheWwh+WwiOWwjeWwk+WwoOWwouWwqOWwuOWwueWxgeWxhuWxjuWxk+WxkOWxj+WtseWxrOWxruS5ouWxtuWxueWyjOWykeWylOWmm+Wyq+Wyu+WytuWyvOWyt+WzheWyvuWzh+WzmeWzqeWzveWzuuWzreW2jOWzquW0i+W0leW0l+W1nOW0n+W0m+W0keW0lOW0ouW0muW0meW0mOW1jOW1kuW1juW1i+W1rOW1s+W1tuW2h+W2hOW2guW2ouW2neW2rOW2ruW2veW2kOW2t+W2vOW3ieW3jeW3k+W3kuW3luW3m+W3q+W3suW3teW4i+W4muW4meW4keW4m+W4tuW4t+W5hOW5g+W5gOW5juW5l+W5lOW5n+W5ouW5pOW5h+W5teW5tuW5uum6vOW5v+W6oOW7geW7guW7iOW7kOW7j1wiXSxcbltcIjljNDBcIixcIuW7luW7o+W7neW7muW7m+W7ouW7oeW7qOW7qeW7rOW7seW7s+W7sOW7tOW7uOW7vuW8g+W8ieW9neW9nOW8i+W8keW8luW8qeW8reW8uOW9geW9iOW9jOW9juW8r+W9keW9luW9l+W9meW9oeW9reW9s+W9t+W+g+W+guW9v+W+iuW+iOW+keW+h+W+nuW+meW+mOW+oOW+qOW+reW+vOW/luW/u+W/pOW/uOW/seW/neaCs+W/v+aAoeaBoFwiXSxcbltcIjljODBcIixcIuaAmeaAkOaAqeaAjuaAseaAm+aAleaAq+aApuaAj+aAuuaBmuaBgeaBquaBt+aBn+aBiuaBhuaBjeaBo+aBg+aBpOaBguaBrOaBq+aBmeaCgeaCjeaDp+aCg+aCmuaChOaCm+aCluaCl+aCkuaCp+aCi+aDoeaCuOaDoOaDk+aCtOW/sOaCveaDhuaCteaDmOaFjeaEleaEhuaDtuaDt+aEgOaDtOaDuuaEg+aEoeaDu+aDseaEjeaEjuaFh+aEvuaEqOaEp+aFiuaEv+aEvOaErOaEtOaEveaFguaFhOaFs+aFt+aFmOaFmeaFmuaFq+aFtOaFr+aFpeaFseaFn+aFneaFk+aFteaGmeaGluaGh+aGrOaGlOaGmuaGiuaGkeaGq+aGruaHjOaHiuaHieaHt+aHiOaHg+aHhuaGuuaHi+e9ueaHjeaHpuaHo+aHtuaHuuaHtOaHv+aHveaHvOaHvuaIgOaIiOaIieaIjeaIjOaIlOaIm1wiXSxcbltcIjlkNDBcIixcIuaInuaIoeaIquaIruaIsOaIsuaIs+aJgeaJjuaJnuaJo+aJm+aJoOaJqOaJvOaKguaKieaJvuaKkuaKk+aKluaLlOaKg+aKlOaLl+aLkeaKu+aLj+aLv+aLhuaTlOaLiOaLnOaLjOaLiuaLguaLh+aKm+aLieaMjOaLruaLseaMp+aMguaMiOaLr+aLteaNkOaMvuaNjeaQnOaNj+aOluaOjuaOgOaOq+aNtuaOo+aOj+aOieaOn+aOteaNq1wiXSxcbltcIjlkODBcIixcIuaNqeaOvuaPqeaPgOaPhuaPo+aPieaPkuaPtuaPhOaQluaQtOaQhuaQk+aQpuaQtuaUneaQl+aQqOaQj+aRp+aRr+aRtuaRjuaUquaSleaSk+aSpeaSqeaSiOaSvOaTmuaTkuaTheaTh+aSu+aTmOaTguaTseaTp+iIieaToOaToeaKrOaTo+aTr+aUrOaTtuaTtOaTsuaTuuaUgOaTveaUmOaUnOaUheaUpOaUo+aUq+aUtOaUteaUt+aUtuaUuOeVi+aViOaVluaVleaVjeaVmOaVnuaVneaVsuaVuOaWguaWg+iuiuaWm+aWn+aWq+aWt+aXg+aXhuaXgeaXhOaXjOaXkuaXm+aXmeaXoOaXoeaXseadsuaYiuaYg+aXu+ads+aYteaYtuaYtOaYnOaZj+aZhOaZieaZgeaZnuaZneaZpOaZp+aZqOaZn+aZouaZsOaag+aaiOaajuaaieaahOaamOaaneabgeaaueabieaavuaavFwiXSxcbltcIjllNDBcIixcIuabhOaauOabluabmuaboOaYv+abpuabqeabsOabteabt+acj+acluacnuacpuacp+mcuOacruacv+actuadgeacuOact+adhuadnuadoOadmeado+adpOaeieadsOaeqeadvOadquaejOaei+aepuaeoeaeheaet+afr+aetOafrOaes+afqeaeuOafpOafnuafneafouafruaeueafjuafhuafp+aqnOagnuahhuagqeahgOahjeagsuahjlwiXSxcbltcIjllODBcIixcIuais+agq+ahmeaho+aht+ahv+ain+aij+aireailOaineaim+aig+aqruaiueahtOaiteaioOaiuuakj+aijeahvuakgeajiuakiOajmOakouakpuajoeakjOajjeajlOajp+ajleaktuakkuakhOajl+ajo+akpeajueajoOajr+akqOakquakmuako+akoeajhualuealt+alnOaluOalq+allOalvualruakuealtOakvealmeaksOaloealnualneamgealquamsuamruankOamv+angeank+amvuanjuWvqOaniuanneamu+ang+amp+aoruamkeamoOamnOamleamtOannuanqOaoguaom+anv+asiuanueansuanp+aoheamseaonuanreaolOanq+aoiuaokuargeaoo+aok+aphOaojOapsuaotuapuOaph+apouapmeappuapiOaouOaoouaqkOaqjeaqoOaqhOaqouaqo1wiXSxcbltcIjlmNDBcIixcIuaql+iYl+aqu+arg+arguaquOaqs+aqrOarnuarkearn+aqquarmuarquaru+asheiYluaruuaskuaslumsseasn+asuOast+ebnOasuemjruath+atg+atieatkOatmeatlOatm+atn+atoeatuOatueatv+augOauhOaug+aujeaumOauleaunuaupOauquauq+aur+ausuauseaus+aut+auvOavhuavi+avk+avn+avrOavq+avs+avr1wiXSxcbltcIjlmODBcIixcIum6vuawiOawk+awlOawm+awpOawo+axnuaxleaxouaxquayguayjeaymuaygeaym+axvuaxqOaxs+aykuaykOazhOazseazk+ayveazl+azheazneayruayseayvuayuuazm+azr+azmeazqua0n+ihjea0tua0q+a0vea0uOa0mea0tea0s+a0kua0jOa1o+a2k+a1pOa1mua1uea1mea2jua2lea/pOa2hea3uea4lea4iua2tea3h+a3pua2uOa3hua3rOa3nua3jOa3qOa3kua3hea3uua3mea3pOa3lea3qua3rua4rea5rua4rua4mea5sua5n+a4vua4o+a5q+a4q+a5tua5jea4n+a5g+a4uua5jua4pOa7v+a4nea4uOa6gua6qua6mOa7iea6t+a7k+a6vea6r+a7hOa6sua7lOa7lea6j+a6pea7gua6n+a9gea8keeBjOa7rOa7uOa7vua8v+a7sua8sea7r+a8sua7jFwiXSxcbltcImUwNDBcIixcIua8vua8k+a7t+a+hua9uua9uOa+gea+gOa9r+a9m+a/s+a9rea+gua9vOa9mOa+jua+kea/gua9pua+s+a+o+a+oea+pOa+uea/hua+qua/n+a/lea/rOa/lOa/mOa/sea/rua/m+eAieeAi+a/uueAkeeAgeeAj+a/vueAm+eAmua9tOeAneeAmOeAn+eAsOeAvueAsueBkeeBo+eCmeeCkueCr+eDseeCrOeCuOeCs+eCrueDn+eDi+eDnVwiXSxcbltcImUwODBcIixcIueDmeeEieeDveeEnOeEmeeFpeeFleeGiOeFpueFoueFjOeFlueFrOeGj+eHu+eGhOeGleeGqOeGrOeHl+eGueeGvueHkueHieeHlOeHjueHoOeHrOeHp+eHteeHvOeHueeHv+eIjeeIkOeIm+eIqOeIreeIrOeIsOeIsueIu+eIvOeIv+eJgOeJhueJi+eJmOeJtOeJvueKgueKgeeKh+eKkueKlueKoueKp+eKueeKsueLg+eLhueLhOeLjueLkueLoueLoOeLoeeLueeLt+WAj+eMl+eMiueMnOeMlueMneeMtOeMr+eMqeeMpeeMvueNjueNj+m7mOeNl+eNqueNqOeNsOeNuOeNteeNu+eNuuePiOeOs+ePjueOu+ePgOePpeePruePnueSoueQheeRr+eQpeePuOeQsueQuueRleeQv+eRn+eRmeeRgeeRnOeRqeeRsOeRo+eRqueRtueRvueSi+eSnueSp+eTiueTj+eTlOePsVwiXSxcbltcImUxNDBcIixcIueToOeTo+eTp+eTqeeTrueTsueTsOeTseeTuOeTt+eUhOeUg+eUheeUjOeUjueUjeeUleeUk+eUnueUpueUrOeUvOeVhOeVjeeViueVieeVm+eVhueVmueVqeeVpOeVp+eVq+eVreeVuOeVtueWhueWh+eVtOeWiueWieeWgueWlOeWmueWneeWpeeWo+eXgueWs+eXg+eWteeWveeWuOeWvOeWseeXjeeXiueXkueXmeeXo+eXnueXvueXv1wiXSxcbltcImUxODBcIixcIueXvOeYgeeXsOeXuueXsueXs+eYi+eYjeeYieeYn+eYp+eYoOeYoeeYoueYpOeYtOeYsOeYu+eZh+eZiOeZhueZnOeZmOeZoeeZoueZqOeZqeeZqueZp+eZrOeZsOeZsueZtueZuOeZvOeagOeag+eaiOeai+eajuealueak+eameeamueasOeatOeauOeaueeauuebguebjeebluebkuebnueboeebpeebp+ebquiYr+ebu+eciOech+echOecqeecpOecnuecpeecpuecm+ect+ecuOedh+edmuedqOedq+edm+edpeedv+edvuedueeejueei+eekeeeoOeenueesOeetueeueeev+eevOeeveeeu+efh+efjeefl+efmuefnOefo+efruefvOegjOegkuekpuegoOekquehheeijuehtOeihuehvOeimueijOeio+eiteeiqueir+ejkeejhueji+ejlOeivueivOejheejiuejrFwiXSxcbltcImUyNDBcIixcIuejp+ejmuejveejtOekh+ekkuekkeekmeekrOekq+elgOeloOell+eln+elmuelleelk+eluuelv+emiuemneemp+m9i+emquemruems+emueemuuenieenleenp+enrOenoeeno+eoiOeojeeomOeomeeooOeon+emgOeoseeou+eovueot+epg+epl+epieepoeepouepqem+neepsOepueepveeqiOeql+eqleeqmOeqlueqqeeriOeqsFwiXSxcbltcImUyODBcIixcIueqtuerheerhOeqv+mCg+erh+eriuerjeerj+erleerk+ermeermuerneeroeerouerpuerreersOesguesj+esiueshuess+esmOesmeesnuesteesqOestuetkOetuueshOetjeesi+etjOetheetteetpeettOetp+etsOetseetrOetrueuneeumOeun+eujeeunOeumueui+eukueuj+etneeumeevi+evgeevjOevj+eutOevhuevneevqeewkeewlOevpuevpeexoOewgOewh+ewk+evs+evt+ewl+ewjeevtuewo+ewp+ewquewn+ewt+ewq+ewveexjOexg+exlOexj+exgOexkOexmOexn+expOexluexpeexrOexteeyg+eykOeypOeyreeyoueyq+eyoeeyqOeys+eysueyseeyrueyueeyveezgOezheezguezmOezkueznOezoumsu+ezr+ezsueztOeztuezuue0hlwiXSxcbltcImUzNDBcIixcIue0gue0nOe0lee0iue1hee1i+e0rue0sue0v+e0tee1hue1s+e1lue1jue1sue1qOe1rue1j+e1o+e2k+e2iee1m+e2j+e1vee2m+e2uue2rue2o+e2tee3h+e2vee2q+e4vee2oue2r+e3nOe2uOe2n+e2sOe3mOe3nee3pOe3nue3u+e3sue3oee4hee4iue4o+e4oee4kue4see4n+e4iee4i+e4oue5hue5pue4u+e4tee4uee5g+e4t1wiXSxcbltcImUzODBcIixcIue4sue4uue5p+e5nee5lue5nue5mee5mue5uee5que5qee5vOe5u+e6g+e3lee5vei+rue5v+e6iOe6iee6jOe6kue6kOe6k+e6lOe6lue6jue6m+e6nOe8uOe8uue9hee9jOe9jee9jue9kOe9kee9lee9lOe9mOe9n+e9oOe9qOe9qee9p+e9uOe+gue+hue+g+e+iOe+h+e+jOe+lOe+nue+nee+mue+o+e+r+e+sue+uee+rue+tue+uOitsee/hee/hue/iue/lee/lOe/oee/pue/qee/s+e/uemjnOiAhuiAhOiAi+iAkuiAmOiAmeiAnOiAoeiAqOiAv+iAu+iBiuiBhuiBkuiBmOiBmuiBn+iBouiBqOiBs+iBsuiBsOiBtuiBueiBveiBv+iChOiChuiCheiCm+iCk+iCmuiCreWGkOiCrOiDm+iDpeiDmeiDneiDhOiDmuiDluiEieiDr+iDseiEm+iEqeiEo+iEr+iFi1wiXSxcbltcImU0NDBcIixcIumai+iFhuiEvuiFk+iFkeiDvOiFseiFruiFpeiFpuiFtOiGg+iGiOiGiuiGgOiGguiGoOiGleiGpOiGo+iFn+iGk+iGqeiGsOiGteiGvuiGuOiGveiHgOiHguiGuuiHieiHjeiHkeiHmeiHmOiHiOiHmuiHn+iHoOiHp+iHuuiHu+iHvuiIgeiIguiIheiIh+iIiuiIjeiIkOiIluiIqeiIq+iIuOiIs+iJgOiJmeiJmOiJneiJmuiJn+iJpFwiXSxcbltcImU0ODBcIixcIuiJouiJqOiJquiJq+iIruiJseiJt+iJuOiJvuiKjeiKkuiKq+iKn+iKu+iKrOiLoeiLo+iLn+iLkuiLtOiLs+iLuuiOk+iMg+iLu+iLueiLnuiMhuiLnOiMieiLmeiMteiMtOiMluiMsuiMseiNgOiMueiNkOiNheiMr+iMq+iMl+iMmOiOheiOmuiOquiOn+iOouiOluiMo+iOjuiOh+iOiuiNvOiOteiNs+iNteiOoOiOieiOqOiPtOiQk+iPq+iPjuiPveiQg+iPmOiQi+iPgeiPt+iQh+iPoOiPsuiQjeiQouiQoOiOveiQuOiUhuiPu+iRreiQquiQvOiVmuiShOiRt+iRq+iSreiRruiSguiRqeiRhuiQrOiRr+iRueiQteiTiuiRouiSueiSv+iSn+iTmeiTjeiSu+iTmuiTkOiTgeiThuiTluiSoeiUoeiTv+iTtOiUl+iUmOiUrOiUn+iUleiUlOiTvOiVgOiVo+iVmOiViFwiXSxcbltcImU1NDBcIixcIuiVgeiYguiVi+iVleiWgOiWpOiWiOiWkeiWiuiWqOiVreiWlOiWm+iXquiWh+iWnOiVt+iVvuiWkOiXieiWuuiXj+iWueiXkOiXleiXneiXpeiXnOiXueiYiuiYk+iYi+iXvuiXuuiYhuiYouiYmuiYsOiYv+iZjeS5leiZlOiZn+iZp+iZseiak+iao+iaqeiaquiai+iajOiatuiar+ibhOibhuiasOibieigo+iaq+iblOibnuibqeibrFwiXSxcbltcImU1ODBcIixcIuibn+ibm+ibr+ickuichuiciOicgOicg+ibu+ickeicieicjeibueiciuictOicv+ict+icu+icpeicqeicmuidoOidn+iduOidjOidjuidtOidl+idqOidruidmeidk+ido+idquigheieouien+ieguier+ifi+ieveifgOifkOmbluieq+ifhOies+ifh+ifhuieu+ifr+ifsuifoOigj+igjeifvuiftuift+igjuifkuigkeigluigleigouigoeigseigtuigueigp+igu+ihhOihguihkuihmeihnuihouihq+iigeihvuiinuihteihveiiteihsuiiguiil+iikuiiruiimeiiouiijeiipOiisOiiv+iiseijg+ijhOijlOijmOijmeijneijueikguijvOijtOijqOijsuikhOikjOikiuikk+ilg+iknuikpeikquikq+ilgeilhOiku+iktuikuOiljOikneiloOilnlwiXSxcbltcImU2NDBcIixcIuilpuilpOilreilquilr+iltOilt+ilvuimg+imiOimiuimk+immOimoeimqeimpuimrOimr+imsuimuuimveimv+ingOinmuinnOinneinp+intOinuOiog+ioluiokOiojOiom+ioneiopeiotuipgeipm+ipkuiphuipiOipvOipreiprOipouiqheiqguiqhOiqqOiqoeiqkeiqpeiqpuiqmuiqo+irhOirjeirguirmuirq+irs+irp1wiXSxcbltcImU2ODBcIixcIuirpOirseislOiroOirouirt+irnuirm+isjOish+ismuiroeisluiskOisl+isoOiss+meq+ispuisq+isvuisqOitgeitjOitj+itjuitieitluitm+itmuitq+itn+itrOitr+ittOitveiugOiujOiujuiukuiuk+iuluiumeiumuiwuuixgeiwv+ixiOixjOixjuixkOixleixouixrOixuOixuuiyguiyieiyheiyiuiyjeiyjuiylOixvOiymOaIneiyreiyquiyveiysuiys+iyruiytuiziOizgeizpOizo+izmuizveizuuizu+i0hOi0hei0iui0h+i0j+i0jei0kOm9jui0k+izjei0lOi0lui1p+i1rei1sei1s+i2gei2mei3gui2vui2uui3j+i3mui3lui3jOi3m+i3i+i3qui3q+i3n+i3o+i3vOi4iOi4iei3v+i4nei4nui4kOi4n+i5gui4tei4sOi4tOi5ilwiXSxcbltcImU3NDBcIixcIui5h+i5iei5jOi5kOi5iOi5mei5pOi5oOi4qui5o+i5lei5tui5sui5vOi6gei6h+i6hei6hOi6i+i6iui6k+i6kei6lOi6mei6qui6oei6rOi6sOi7hui6sei6vui7hei7iOi7i+i7m+i7o+i7vOi7u+i7q+i7vui8iui8hei8lei8kui8mei8k+i8nOi8n+i8m+i8jOi8pui8s+i8u+i8uei9hei9gui8vui9jOi9iei9hui9jui9l+i9nFwiXSxcbltcImU3ODBcIixcIui9oui9o+i9pOi+nOi+n+i+o+i+rei+r+i+t+i/mui/pei/oui/qui/r+mCh+i/tOmAhei/uei/uumAkemAlemAoemAjemAnumAlumAi+mAp+mAtumAtemAuei/uOmBj+mBkOmBkemBkumAjumBiemAvumBlumBmOmBnumBqOmBr+mBtumaqOmBsumCgumBvemCgemCgOmCiumCiemCj+mCqOmCr+mCsemCtemDoumDpOaJiOmDm+mEgumEkumEmemEsumEsOmFiumFlumFmOmFo+mFpemFqemFs+mFsumGi+mGiemGgumGoumGq+mGr+mGqumGtemGtOmGuumHgOmHgemHiemHi+mHkOmHlumHn+mHoemHm+mHvOmHtemHtumInumHv+mIlOmIrOmIlemIkemJnumJl+mJhemJiemJpOmJiOmKlemIv+mJi+mJkOmKnOmKlumKk+mKm+mJmumLj+mKuemKt+mLqemMj+mLuumNhOmMrlwiXSxcbltcImU4NDBcIixcIumMmemMoumMmumMo+mMuumMtemMu+mNnOmNoOmNvOmNrumNlumOsOmOrOmOremOlOmOuemPlumPl+mPqOmPpemPmOmPg+mPnemPkOmPiOmPpOmQmumQlOmQk+mQg+mQh+mQkOmQtumQq+mQtemQoemQuumRgemRkumRhOmRm+mRoOmRoumRnumRqumIqemRsOmRtemRt+mRvemRmumRvOmRvumSgemRv+mWgumWh+mWiumWlOmWlumWmOmWmVwiXSxcbltcImU4ODBcIixcIumWoOmWqOmWp+mWremWvOmWu+mWuemWvumXiua/tumXg+mXjemXjOmXlemXlOmXlumXnOmXoemXpemXoumYoemYqOmYrumYr+mZgumZjOmZj+mZi+mZt+mZnOmZnumZnemZn+mZpumZsumZrOmajemamOmalemal+maqumap+masemasumasOmatOmatumauOmauembjumbi+mbiembjeiljembnOmcjemblembuemchOmchumciOmck+mcjumckemcj+mclumcmemcpOmcqumcsOmcuemcvemcvumdhOmdhumdiOmdgumdiemdnOmdoOmdpOmdpumdqOWLkumdq+mdsemduemehemdvOmegemduumehumei+mej+mekOmenOmeqOmepumeo+mes+metOmfg+mfhumfiOmfi+mfnOmfrem9j+mfsuern+mftumftemgj+mgjOmguOmgpOmgoemgt+mgvemhhumhj+mhi+mhq+mhr+mhsFwiXSxcbltcImU5NDBcIixcIumhsemhtOmhs+miqumir+misemitumjhOmjg+mjhumjqemjq+mkg+mkiemkkumklOmkmOmkoemknemknumkpOmkoOmkrOmkrumkvemkvumlgumliemlhemlkOmli+mlkemlkumljOmllemml+mmmOmmpemmremmrummvOmnn+mnm+mnnemnmOmnkemnremnrumnsemnsumnu+mnuOmogemoj+mohemnoumomemoq+mot+mphempgumpgOmpg1wiXSxcbltcImU5ODBcIixcIumovumplempjempm+mpl+mpn+mpoumppemppOmpqempq+mpqumqremqsOmqvOmrgOmrj+mrkemrk+mrlOmrnumrn+mroumro+mrpumrr+mrq+mrrumrtOmrsemrt+mru+mshumsmOmsmumsn+msoumso+mspemsp+msqOmsqemsqumsrumsr+mssumthOmtg+mtj+mtjemtjumtkemtmOmttOmuk+mug+mukemulumul+mun+muoOmuqOmutOmvgOmviumuuemvhumvj+mvkemvkumvo+mvoumvpOmvlOmvoemwuumvsumvsemvsOmwlemwlOmwiemwk+mwjOmwhumwiOmwkumwiumwhOmwrumwm+mwpemwpOmwoemwsOmxh+mwsumxhumwvumxmumxoOmxp+mxtumxuOmzp+mzrOmzsOm0iem0iOmzq+m0g+m0hum0qum0pum2r+m0o+m0n+m1hOm0lem0kum1gem0v+m0vum1hum1iFwiXSxcbltcImVhNDBcIixcIum1nem1num1pOm1kem1kOm1mem1sum2iem2h+m2q+m1r+m1uum2mum2pOm2qem2sum3hOm3gem2u+m2uOm2uum3hum3j+m3gum3mem3k+m3uOm3pum3rem3r+m3vem4mum4m+m4num5tem5uem5vem6gem6iOm6i+m6jOm6kum6lem6kem6nem6pem6qem6uOm6qum6remdoem7jOm7jum7j+m7kOm7lOm7nOm7num7nem7oOm7pem7qOm7r1wiXSxcbltcImVhODBcIixcIum7tOm7tum7t+m7uem7u+m7vOm7vem8h+m8iOeat+m8lem8oem8rOm8vum9ium9kum9lOm9o+m9n+m9oOm9oem9pum9p+m9rOm9qum9t+m9sum9tum+lem+nOm+oOWgr+anh+mBmeeRpOWHnOeGmVwiXSxcbltcImVkNDBcIixcIue6iuiknOmNiOmKiOiTnOS/ieeCu+aYseajiOmLueabu+W9heS4qOS7oeS7vOS8gOS8g+S8ueS9luS+kuS+iuS+muS+lOS/jeWBgOWAouS/v+WAnuWBhuWBsOWBguWClOWDtOWDmOWFiuWFpOWGneWGvuWHrOWIleWKnOWKpuWLgOWLm+WMgOWMh+WMpOWNsuWOk+WOsuWPne+ojuWSnOWSiuWSqeWTv+WWhuWdmeWdpeWerOWfiOWfh++oj1wiXSxcbltcImVkODBcIixcIu+okOWinuWisuWki+Wlk+Wlm+WlneWlo+WmpOWmuuWtluWvgOeUr+WvmOWvrOWwnuWypuWyuuWzteW0p+W1k++okeW1guW1reW2uOW2ueW3kOW8oeW8tOW9p+W+t+W/nuaBneaCheaCiuaDnuaDleaEoOaDsuaEkeaEt+aEsOaGmOaIk+aKpuaPteaRoOaSneaTjuaVjuaYgOaYleaYu+aYieaYruaYnuaYpOaZpeaZl+aZme+okuaZs+aameaaoOaasuaav+abuuacju+kqeadpuaeu+ahkuafgOaggeahhOajj++ok+alqO+olOammOanouaosOapq+aphuaps+apvuarouarpOavluawv+axnOayhuaxr+azmua0hOa2h+a1r+a2lua2rOa3j+a3uOa3sua3vOa4uea5nOa4p+a4vOa6v+a+iOa+tea/teeAheeAh+eAqOeCheeCq+eEj+eEhOeFnOeFhueFh++oleeHgeeHvueKsVwiXSxcbltcImVlNDBcIixcIueKvueMpO+olueNt+eOveePieePluePo+ePkueQh+ePteeQpueQqueQqeeQrueRoueSieeSn+eUgeeVr+eagueanOeanueam+eapu+ol+edhuWKr+egoeehjuehpOehuueksO+omO+ome+omuemlO+om+emm+erkeerp++onOerq+eunu+onee1iOe1nOe2t+e2oOe3lue5kue9h+e+oe+onuiMgeiNouiNv+iPh+iPtuiRiOiStOiVk+iVmVwiXSxcbltcImVlODBcIixcIuiVq++on+iWsO+ooO+ooeigh+ijteiokuiot+ipueiqp+iqvuirn++oouirtuitk+itv+izsOiztOi0kui1tu+oo+i7j++opO+opemBp+mDnu+opumElemEp+mHmumHl+mHnumHremHrumHpOmHpemIhumIkOmIiumIuumJgOmIvOmJjumJmemJkemIuemJp+mKp+mJt+mJuOmLp+mLl+mLmemLkO+op+mLlemLoOmLk+mMpemMoemLu++oqOmMnumLv+mMnemMgumNsOmNl+mOpOmPhumPnumPuOmQsemRhemRiOmWku+nnO+oqemanemar+mcs+mcu+mdg+mdjemdj+mdkemdlemhl+mhpe+oqu+oq+mkp++orOmmnumpjumrmemrnOmttemtsumuj+musemuu+mwgOm1sOm1q++orem4mem7kVwiXSxcbltcImVlZWZcIixcIuKFsFwiLDksXCLvv6Lvv6TvvIfvvIJcIl0sXG5bXCJmMDQwXCIsXCLugIBcIiw2Ml0sXG5bXCJmMDgwXCIsXCLugL9cIiwxMjRdLFxuW1wiZjE0MFwiLFwi7oK8XCIsNjJdLFxuW1wiZjE4MFwiLFwi7oO7XCIsMTI0XSxcbltcImYyNDBcIixcIu6FuFwiLDYyXSxcbltcImYyODBcIixcIu6Gt1wiLDEyNF0sXG5bXCJmMzQwXCIsXCLuiLRcIiw2Ml0sXG5bXCJmMzgwXCIsXCLuibNcIiwxMjRdLFxuW1wiZjQ0MFwiLFwi7ouwXCIsNjJdLFxuW1wiZjQ4MFwiLFwi7oyvXCIsMTI0XSxcbltcImY1NDBcIixcIu6OrFwiLDYyXSxcbltcImY1ODBcIixcIu6Pq1wiLDEyNF0sXG5bXCJmNjQwXCIsXCLukahcIiw2Ml0sXG5bXCJmNjgwXCIsXCLukqdcIiwxMjRdLFxuW1wiZjc0MFwiLFwi7pSkXCIsNjJdLFxuW1wiZjc4MFwiLFwi7pWjXCIsMTI0XSxcbltcImY4NDBcIixcIu6XoFwiLDYyXSxcbltcImY4ODBcIixcIu6Yn1wiLDEyNF0sXG5bXCJmOTQwXCIsXCLumpxcIl0sXG5bXCJmYTQwXCIsXCLihbBcIiw5LFwi4oWgXCIsOSxcIu+/ou+/pO+8h++8guOIseKEluKEoeKItee6iuiknOmNiOmKiOiTnOS/ieeCu+aYseajiOmLueabu+W9heS4qOS7oeS7vOS8gOS8g+S8ueS9luS+kuS+iuS+muS+lOS/jeWBgOWAouS/v+WAnuWBhuWBsOWBguWClOWDtOWDmOWFilwiXSxcbltcImZhODBcIixcIuWFpOWGneWGvuWHrOWIleWKnOWKpuWLgOWLm+WMgOWMh+WMpOWNsuWOk+WOsuWPne+ojuWSnOWSiuWSqeWTv+WWhuWdmeWdpeWerOWfiOWfh++oj++okOWinuWisuWki+Wlk+Wlm+WlneWlo+WmpOWmuuWtluWvgOeUr+WvmOWvrOWwnuWypuWyuuWzteW0p+W1k++okeW1guW1reW2uOW2ueW3kOW8oeW8tOW9p+W+t+W/nuaBneaCheaCiuaDnuaDleaEoOaDsuaEkeaEt+aEsOaGmOaIk+aKpuaPteaRoOaSneaTjuaVjuaYgOaYleaYu+aYieaYruaYnuaYpOaZpeaZl+aZme+okuaZs+aameaaoOaasuaav+abuuacju+kqeadpuaeu+ahkuafgOaggeahhOajj++ok+alqO+olOammOanouaosOapq+aphuaps+apvuarouarpOavluawv+axnOayhuaxr+azmua0hOa2h+a1r1wiXSxcbltcImZiNDBcIixcIua2lua2rOa3j+a3uOa3sua3vOa4uea5nOa4p+a4vOa6v+a+iOa+tea/teeAheeAh+eAqOeCheeCq+eEj+eEhOeFnOeFhueFh++oleeHgeeHvueKseeKvueMpO+olueNt+eOveePieePluePo+ePkueQh+ePteeQpueQqueQqeeQrueRoueSieeSn+eUgeeVr+eagueanOeanueam+eapu+ol+edhuWKr+egoeehjuehpOehuueksO+omO+omVwiXSxcbltcImZiODBcIixcIu+omuemlO+om+emm+erkeerp++onOerq+eunu+onee1iOe1nOe2t+e2oOe3lue5kue9h+e+oe+onuiMgeiNouiNv+iPh+iPtuiRiOiStOiVk+iVmeiVq++on+iWsO+ooO+ooeigh+ijteiokuiot+ipueiqp+iqvuirn++oouirtuitk+itv+izsOiztOi0kui1tu+oo+i7j++opO+opemBp+mDnu+opumElemEp+mHmumHl+mHnumHremHrumHpOmHpemIhumIkOmIiumIuumJgOmIvOmJjumJmemJkemIuemJp+mKp+mJt+mJuOmLp+mLl+mLmemLkO+op+mLlemLoOmLk+mMpemMoemLu++oqOmMnumLv+mMnemMgumNsOmNl+mOpOmPhumPnumPuOmQsemRhemRiOmWku+nnO+oqemanemar+mcs+mcu+mdg+mdjemdj+mdkemdlemhl+mhpe+oqu+oq+mkp++orOmmnumpjumrmVwiXSxcbltcImZjNDBcIixcIumrnOmttemtsumuj+musemuu+mwgOm1sOm1q++orem4mem7kVwiXVxuXVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gPT0gVVRGMTYtQkUgY29kZWMuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZXhwb3J0cy51dGYxNmJlID0gVXRmMTZCRUNvZGVjO1xuZnVuY3Rpb24gVXRmMTZCRUNvZGVjKCkge1xufVxuXG5VdGYxNkJFQ29kZWMucHJvdG90eXBlLmVuY29kZXIgPSBVdGYxNkJFRW5jb2RlcjtcblV0ZjE2QkVDb2RlYy5wcm90b3R5cGUuZGVjb2RlciA9IFV0ZjE2QkVEZWNvZGVyO1xuVXRmMTZCRUNvZGVjLnByb3RvdHlwZS5ib21Bd2FyZSA9IHRydWU7XG5cblxuLy8gLS0gRW5jb2RpbmdcblxuZnVuY3Rpb24gVXRmMTZCRUVuY29kZXIoKSB7XG59XG5cblV0ZjE2QkVFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBidWYgPSBuZXcgQnVmZmVyKHN0ciwgJ3VjczInKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICB2YXIgdG1wID0gYnVmW2ldOyBidWZbaV0gPSBidWZbaSsxXTsgYnVmW2krMV0gPSB0bXA7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG59XG5cblV0ZjE2QkVFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbn1cblxuXG4vLyAtLSBEZWNvZGluZ1xuXG5mdW5jdGlvbiBVdGYxNkJFRGVjb2RlcigpIHtcbiAgICB0aGlzLm92ZXJmbG93Qnl0ZSA9IC0xO1xufVxuXG5VdGYxNkJFRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICBpZiAoYnVmLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4gJyc7XG5cbiAgICB2YXIgYnVmMiA9IG5ldyBCdWZmZXIoYnVmLmxlbmd0aCArIDEpLFxuICAgICAgICBpID0gMCwgaiA9IDA7XG5cbiAgICBpZiAodGhpcy5vdmVyZmxvd0J5dGUgIT09IC0xKSB7XG4gICAgICAgIGJ1ZjJbMF0gPSBidWZbMF07XG4gICAgICAgIGJ1ZjJbMV0gPSB0aGlzLm92ZXJmbG93Qnl0ZTtcbiAgICAgICAgaSA9IDE7IGogPSAyO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgYnVmLmxlbmd0aC0xOyBpICs9IDIsIGorPSAyKSB7XG4gICAgICAgIGJ1ZjJbal0gPSBidWZbaSsxXTtcbiAgICAgICAgYnVmMltqKzFdID0gYnVmW2ldO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmZsb3dCeXRlID0gKGkgPT0gYnVmLmxlbmd0aC0xKSA/IGJ1ZltidWYubGVuZ3RoLTFdIDogLTE7XG5cbiAgICByZXR1cm4gYnVmMi5zbGljZSgwLCBqKS50b1N0cmluZygndWNzMicpO1xufVxuXG5VdGYxNkJFRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG59XG5cblxuLy8gPT0gVVRGLTE2IGNvZGVjID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERlY29kZXIgY2hvb3NlcyBhdXRvbWF0aWNhbGx5IGZyb20gVVRGLTE2TEUgYW5kIFVURi0xNkJFIHVzaW5nIEJPTSBhbmQgc3BhY2UtYmFzZWQgaGV1cmlzdGljLlxuLy8gRGVmYXVsdHMgdG8gVVRGLTE2TEUsIGFzIGl0J3MgcHJldmFsZW50IGFuZCBkZWZhdWx0IGluIE5vZGUuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1VURi0xNiBhbmQgaHR0cDovL2VuY29kaW5nLnNwZWMud2hhdHdnLm9yZy8jdXRmLTE2bGVcbi8vIERlY29kZXIgZGVmYXVsdCBjYW4gYmUgY2hhbmdlZDogaWNvbnYuZGVjb2RlKGJ1ZiwgJ3V0ZjE2Jywge2RlZmF1bHRFbmNvZGluZzogJ3V0Zi0xNmJlJ30pO1xuXG4vLyBFbmNvZGVyIHVzZXMgVVRGLTE2TEUgYW5kIHByZXBlbmRzIEJPTSAod2hpY2ggY2FuIGJlIG92ZXJyaWRkZW4gd2l0aCBhZGRCT006IGZhbHNlKS5cblxuZXhwb3J0cy51dGYxNiA9IFV0ZjE2Q29kZWM7XG5mdW5jdGlvbiBVdGYxNkNvZGVjKGNvZGVjT3B0aW9ucywgaWNvbnYpIHtcbiAgICB0aGlzLmljb252ID0gaWNvbnY7XG59XG5cblV0ZjE2Q29kZWMucHJvdG90eXBlLmVuY29kZXIgPSBVdGYxNkVuY29kZXI7XG5VdGYxNkNvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gVXRmMTZEZWNvZGVyO1xuXG5cbi8vIC0tIEVuY29kaW5nIChwYXNzLXRocm91Z2gpXG5cbmZ1bmN0aW9uIFV0ZjE2RW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLmFkZEJPTSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBvcHRpb25zLmFkZEJPTSA9IHRydWU7XG4gICAgdGhpcy5lbmNvZGVyID0gY29kZWMuaWNvbnYuZ2V0RW5jb2RlcigndXRmLTE2bGUnLCBvcHRpb25zKTtcbn1cblxuVXRmMTZFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiB0aGlzLmVuY29kZXIud3JpdGUoc3RyKTtcbn1cblxuVXRmMTZFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmNvZGVyLmVuZCgpO1xufVxuXG5cbi8vIC0tIERlY29kaW5nXG5cbmZ1bmN0aW9uIFV0ZjE2RGVjb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuZGVjb2RlciA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsQnl0ZXMgPSBbXTtcbiAgICB0aGlzLmluaXRpYWxCeXRlc0xlbiA9IDA7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuaWNvbnYgPSBjb2RlYy5pY29udjtcbn1cblxuVXRmMTZEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGJ1Zikge1xuICAgIGlmICghdGhpcy5kZWNvZGVyKSB7XG4gICAgICAgIC8vIENvZGVjIGlzIG5vdCBjaG9zZW4geWV0LiBBY2N1bXVsYXRlIGluaXRpYWwgYnl0ZXMuXG4gICAgICAgIHRoaXMuaW5pdGlhbEJ5dGVzLnB1c2goYnVmKTtcbiAgICAgICAgdGhpcy5pbml0aWFsQnl0ZXNMZW4gKz0gYnVmLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxCeXRlc0xlbiA8IDE2KSAvLyBXZSBuZWVkIG1vcmUgYnl0ZXMgdG8gdXNlIHNwYWNlIGhldXJpc3RpYyAoc2VlIGJlbG93KVxuICAgICAgICAgICAgcmV0dXJuICcnO1xuXG4gICAgICAgIC8vIFdlIGhhdmUgZW5vdWdoIGJ5dGVzIC0+IGRldGVjdCBlbmRpYW5uZXNzLlxuICAgICAgICB2YXIgYnVmID0gQnVmZmVyLmNvbmNhdCh0aGlzLmluaXRpYWxCeXRlcyksXG4gICAgICAgICAgICBlbmNvZGluZyA9IGRldGVjdEVuY29kaW5nKGJ1ZiwgdGhpcy5vcHRpb25zLmRlZmF1bHRFbmNvZGluZyk7XG4gICAgICAgIHRoaXMuZGVjb2RlciA9IHRoaXMuaWNvbnYuZ2V0RGVjb2RlcihlbmNvZGluZywgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5pbml0aWFsQnl0ZXMubGVuZ3RoID0gdGhpcy5pbml0aWFsQnl0ZXNMZW4gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmRlY29kZXIud3JpdGUoYnVmKTtcbn1cblxuVXRmMTZEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuZGVjb2Rlcikge1xuICAgICAgICB2YXIgYnVmID0gQnVmZmVyLmNvbmNhdCh0aGlzLmluaXRpYWxCeXRlcyksXG4gICAgICAgICAgICBlbmNvZGluZyA9IGRldGVjdEVuY29kaW5nKGJ1ZiwgdGhpcy5vcHRpb25zLmRlZmF1bHRFbmNvZGluZyk7XG4gICAgICAgIHRoaXMuZGVjb2RlciA9IHRoaXMuaWNvbnYuZ2V0RGVjb2RlcihlbmNvZGluZywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICB2YXIgcmVzID0gdGhpcy5kZWNvZGVyLndyaXRlKGJ1ZiksXG4gICAgICAgICAgICB0cmFpbCA9IHRoaXMuZGVjb2Rlci5lbmQoKTtcblxuICAgICAgICByZXR1cm4gdHJhaWwgPyAocmVzICsgdHJhaWwpIDogcmVzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZWNvZGVyLmVuZCgpO1xufVxuXG5mdW5jdGlvbiBkZXRlY3RFbmNvZGluZyhidWYsIGRlZmF1bHRFbmNvZGluZykge1xuICAgIHZhciBlbmMgPSBkZWZhdWx0RW5jb2RpbmcgfHwgJ3V0Zi0xNmxlJztcblxuICAgIGlmIChidWYubGVuZ3RoID49IDIpIHtcbiAgICAgICAgLy8gQ2hlY2sgQk9NLlxuICAgICAgICBpZiAoYnVmWzBdID09IDB4RkUgJiYgYnVmWzFdID09IDB4RkYpIC8vIFVURi0xNkJFIEJPTVxuICAgICAgICAgICAgZW5jID0gJ3V0Zi0xNmJlJztcbiAgICAgICAgZWxzZSBpZiAoYnVmWzBdID09IDB4RkYgJiYgYnVmWzFdID09IDB4RkUpIC8vIFVURi0xNkxFIEJPTVxuICAgICAgICAgICAgZW5jID0gJ3V0Zi0xNmxlJztcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBObyBCT00gZm91bmQuIFRyeSB0byBkZWR1Y2UgZW5jb2RpbmcgZnJvbSBpbml0aWFsIGNvbnRlbnQuXG4gICAgICAgICAgICAvLyBNb3N0IG9mIHRoZSB0aW1lLCB0aGUgY29udGVudCBoYXMgQVNDSUkgY2hhcnMgKFUrMDAqKiksIGJ1dCB0aGUgb3Bwb3NpdGUgKFUrKiowMCkgaXMgdW5jb21tb24uXG4gICAgICAgICAgICAvLyBTbywgd2UgY291bnQgQVNDSUkgYXMgaWYgaXQgd2FzIExFIG9yIEJFLCBhbmQgZGVjaWRlIGZyb20gdGhhdC5cbiAgICAgICAgICAgIHZhciBhc2NpaUNoYXJzTEUgPSAwLCBhc2NpaUNoYXJzQkUgPSAwLCAvLyBDb3VudHMgb2YgY2hhcnMgaW4gYm90aCBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICBfbGVuID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIChidWYubGVuZ3RoICUgMiksIDY0KTsgLy8gTGVuIGlzIGFsd2F5cyBldmVuLlxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9sZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIGlmIChidWZbaV0gPT09IDAgJiYgYnVmW2krMV0gIT09IDApIGFzY2lpQ2hhcnNCRSsrO1xuICAgICAgICAgICAgICAgIGlmIChidWZbaV0gIT09IDAgJiYgYnVmW2krMV0gPT09IDApIGFzY2lpQ2hhcnNMRSsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXNjaWlDaGFyc0JFID4gYXNjaWlDaGFyc0xFKVxuICAgICAgICAgICAgICAgIGVuYyA9ICd1dGYtMTZiZSc7XG4gICAgICAgICAgICBlbHNlIGlmIChhc2NpaUNoYXJzQkUgPCBhc2NpaUNoYXJzTEUpXG4gICAgICAgICAgICAgICAgZW5jID0gJ3V0Zi0xNmxlJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbmM7XG59XG5cblxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxuLy8gVVRGLTcgY29kZWMsIGFjY29yZGluZyB0byBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjE1MlxuLy8gU2VlIGFsc28gYmVsb3cgYSBVVEYtNy1JTUFQIGNvZGVjLCBhY2NvcmRpbmcgdG8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzUwMSNzZWN0aW9uLTUuMS4zXG5cbmV4cG9ydHMudXRmNyA9IFV0ZjdDb2RlYztcbmV4cG9ydHMudW5pY29kZTExdXRmNyA9ICd1dGY3JzsgLy8gQWxpYXMgVU5JQ09ERS0xLTEtVVRGLTdcbmZ1bmN0aW9uIFV0ZjdDb2RlYyhjb2RlY09wdGlvbnMsIGljb252KSB7XG4gICAgdGhpcy5pY29udiA9IGljb252O1xufTtcblxuVXRmN0NvZGVjLnByb3RvdHlwZS5lbmNvZGVyID0gVXRmN0VuY29kZXI7XG5VdGY3Q29kZWMucHJvdG90eXBlLmRlY29kZXIgPSBVdGY3RGVjb2RlcjtcblV0ZjdDb2RlYy5wcm90b3R5cGUuYm9tQXdhcmUgPSB0cnVlO1xuXG5cbi8vIC0tIEVuY29kaW5nXG5cbnZhciBub25EaXJlY3RDaGFycyA9IC9bXkEtWmEtejAtOSdcXChcXCksLVxcLlxcLzpcXD8gXFxuXFxyXFx0XSsvZztcblxuZnVuY3Rpb24gVXRmN0VuY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmljb252ID0gY29kZWMuaWNvbnY7XG59XG5cblV0ZjdFbmNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIC8vIE5haXZlIGltcGxlbWVudGF0aW9uLlxuICAgIC8vIE5vbi1kaXJlY3QgY2hhcnMgYXJlIGVuY29kZWQgYXMgXCIrPGJhc2U2ND4tXCI7IHNpbmdsZSBcIitcIiBjaGFyIGlzIGVuY29kZWQgYXMgXCIrLVwiLlxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN0ci5yZXBsYWNlKG5vbkRpcmVjdENoYXJzLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgICByZXR1cm4gXCIrXCIgKyAoY2h1bmsgPT09ICcrJyA/ICcnIDogXG4gICAgICAgICAgICB0aGlzLmljb252LmVuY29kZShjaHVuaywgJ3V0ZjE2LWJlJykudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoLz0rJC8sICcnKSkgXG4gICAgICAgICAgICArIFwiLVwiO1xuICAgIH0uYmluZCh0aGlzKSkpO1xufVxuXG5VdGY3RW5jb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG59XG5cblxuLy8gLS0gRGVjb2RpbmdcblxuZnVuY3Rpb24gVXRmN0RlY29kZXIob3B0aW9ucywgY29kZWMpIHtcbiAgICB0aGlzLmljb252ID0gY29kZWMuaWNvbnY7XG4gICAgdGhpcy5pbkJhc2U2NCA9IGZhbHNlO1xuICAgIHRoaXMuYmFzZTY0QWNjdW0gPSAnJztcbn1cblxudmFyIGJhc2U2NFJlZ2V4ID0gL1tBLVphLXowLTlcXC8rXS87XG52YXIgYmFzZTY0Q2hhcnMgPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspXG4gICAgYmFzZTY0Q2hhcnNbaV0gPSBiYXNlNjRSZWdleC50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpO1xuXG52YXIgcGx1c0NoYXIgPSAnKycuY2hhckNvZGVBdCgwKSwgXG4gICAgbWludXNDaGFyID0gJy0nLmNoYXJDb2RlQXQoMCksXG4gICAgYW5kQ2hhciA9ICcmJy5jaGFyQ29kZUF0KDApO1xuXG5VdGY3RGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICB2YXIgcmVzID0gXCJcIiwgbGFzdEkgPSAwLFxuICAgICAgICBpbkJhc2U2NCA9IHRoaXMuaW5CYXNlNjQsXG4gICAgICAgIGJhc2U2NEFjY3VtID0gdGhpcy5iYXNlNjRBY2N1bTtcblxuICAgIC8vIFRoZSBkZWNvZGVyIGlzIG1vcmUgaW52b2x2ZWQgYXMgd2UgbXVzdCBoYW5kbGUgY2h1bmtzIGluIHN0cmVhbS5cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghaW5CYXNlNjQpIHsgLy8gV2UncmUgaW4gZGlyZWN0IG1vZGUuXG4gICAgICAgICAgICAvLyBXcml0ZSBkaXJlY3QgY2hhcnMgdW50aWwgJysnXG4gICAgICAgICAgICBpZiAoYnVmW2ldID09IHBsdXNDaGFyKSB7XG4gICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKGJ1Zi5zbGljZShsYXN0SSwgaSksIFwiYXNjaWlcIik7IC8vIFdyaXRlIGRpcmVjdCBjaGFycy5cbiAgICAgICAgICAgICAgICBsYXN0SSA9IGkrMTtcbiAgICAgICAgICAgICAgICBpbkJhc2U2NCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIFdlIGRlY29kZSBiYXNlNjQuXG4gICAgICAgICAgICBpZiAoIWJhc2U2NENoYXJzW2J1ZltpXV0pIHsgLy8gQmFzZTY0IGVuZGVkLlxuICAgICAgICAgICAgICAgIGlmIChpID09IGxhc3RJICYmIGJ1ZltpXSA9PSBtaW51c0NoYXIpIHsvLyBcIistXCIgLT4gXCIrXCJcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9IFwiK1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBiNjRzdHIgPSBiYXNlNjRBY2N1bSArIGJ1Zi5zbGljZShsYXN0SSwgaSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIoYjY0c3RyLCAnYmFzZTY0JyksIFwidXRmMTYtYmVcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZltpXSAhPSBtaW51c0NoYXIpIC8vIE1pbnVzIGlzIGFic29yYmVkIGFmdGVyIGJhc2U2NC5cbiAgICAgICAgICAgICAgICAgICAgaS0tO1xuXG4gICAgICAgICAgICAgICAgbGFzdEkgPSBpKzE7XG4gICAgICAgICAgICAgICAgaW5CYXNlNjQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpbkJhc2U2NCkge1xuICAgICAgICByZXMgKz0gdGhpcy5pY29udi5kZWNvZGUoYnVmLnNsaWNlKGxhc3RJKSwgXCJhc2NpaVwiKTsgLy8gV3JpdGUgZGlyZWN0IGNoYXJzLlxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBiNjRzdHIgPSBiYXNlNjRBY2N1bSArIGJ1Zi5zbGljZShsYXN0SSkudG9TdHJpbmcoKTtcblxuICAgICAgICB2YXIgY2FuQmVEZWNvZGVkID0gYjY0c3RyLmxlbmd0aCAtIChiNjRzdHIubGVuZ3RoICUgOCk7IC8vIE1pbmltYWwgY2h1bms6IDIgcXVhZHMgLT4gMngzIGJ5dGVzIC0+IDMgY2hhcnMuXG4gICAgICAgIGJhc2U2NEFjY3VtID0gYjY0c3RyLnNsaWNlKGNhbkJlRGVjb2RlZCk7IC8vIFRoZSByZXN0IHdpbGwgYmUgZGVjb2RlZCBpbiBmdXR1cmUuXG4gICAgICAgIGI2NHN0ciA9IGI2NHN0ci5zbGljZSgwLCBjYW5CZURlY29kZWQpO1xuXG4gICAgICAgIHJlcyArPSB0aGlzLmljb252LmRlY29kZShuZXcgQnVmZmVyKGI2NHN0ciwgJ2Jhc2U2NCcpLCBcInV0ZjE2LWJlXCIpO1xuICAgIH1cblxuICAgIHRoaXMuaW5CYXNlNjQgPSBpbkJhc2U2NDtcbiAgICB0aGlzLmJhc2U2NEFjY3VtID0gYmFzZTY0QWNjdW07XG5cbiAgICByZXR1cm4gcmVzO1xufVxuXG5VdGY3RGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IFwiXCI7XG4gICAgaWYgKHRoaXMuaW5CYXNlNjQgJiYgdGhpcy5iYXNlNjRBY2N1bS5sZW5ndGggPiAwKVxuICAgICAgICByZXMgPSB0aGlzLmljb252LmRlY29kZShuZXcgQnVmZmVyKHRoaXMuYmFzZTY0QWNjdW0sICdiYXNlNjQnKSwgXCJ1dGYxNi1iZVwiKTtcblxuICAgIHRoaXMuaW5CYXNlNjQgPSBmYWxzZTtcbiAgICB0aGlzLmJhc2U2NEFjY3VtID0gJyc7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuXG4vLyBVVEYtNy1JTUFQIGNvZGVjLlxuLy8gUkZDMzUwMSBTZWMuIDUuMS4zIE1vZGlmaWVkIFVURi03IChodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tNS4xLjMpXG4vLyBEaWZmZXJlbmNlczpcbi8vICAqIEJhc2U2NCBwYXJ0IGlzIHN0YXJ0ZWQgYnkgXCImXCIgaW5zdGVhZCBvZiBcIitcIlxuLy8gICogRGlyZWN0IGNoYXJhY3RlcnMgYXJlIDB4MjAtMHg3RSwgZXhjZXB0IFwiJlwiICgweDI2KVxuLy8gICogSW4gQmFzZTY0LCBcIixcIiBpcyB1c2VkIGluc3RlYWQgb2YgXCIvXCJcbi8vICAqIEJhc2U2NCBtdXN0IG5vdCBiZSB1c2VkIHRvIHJlcHJlc2VudCBkaXJlY3QgY2hhcmFjdGVycy5cbi8vICAqIE5vIGltcGxpY2l0IHNoaWZ0IGJhY2sgZnJvbSBCYXNlNjQgKHNob3VsZCBhbHdheXMgZW5kIHdpdGggJy0nKVxuLy8gICogU3RyaW5nIG11c3QgZW5kIGluIG5vbi1zaGlmdGVkIHBvc2l0aW9uLlxuLy8gICogXCItJlwiIHdoaWxlIGluIGJhc2U2NCBpcyBub3QgYWxsb3dlZC5cblxuXG5leHBvcnRzLnV0ZjdpbWFwID0gVXRmN0lNQVBDb2RlYztcbmZ1bmN0aW9uIFV0ZjdJTUFQQ29kZWMoY29kZWNPcHRpb25zLCBpY29udikge1xuICAgIHRoaXMuaWNvbnYgPSBpY29udjtcbn07XG5cblV0ZjdJTUFQQ29kZWMucHJvdG90eXBlLmVuY29kZXIgPSBVdGY3SU1BUEVuY29kZXI7XG5VdGY3SU1BUENvZGVjLnByb3RvdHlwZS5kZWNvZGVyID0gVXRmN0lNQVBEZWNvZGVyO1xuVXRmN0lNQVBDb2RlYy5wcm90b3R5cGUuYm9tQXdhcmUgPSB0cnVlO1xuXG5cbi8vIC0tIEVuY29kaW5nXG5cbmZ1bmN0aW9uIFV0ZjdJTUFQRW5jb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuaWNvbnYgPSBjb2RlYy5pY29udjtcbiAgICB0aGlzLmluQmFzZTY0ID0gZmFsc2U7XG4gICAgdGhpcy5iYXNlNjRBY2N1bSA9IG5ldyBCdWZmZXIoNik7XG4gICAgdGhpcy5iYXNlNjRBY2N1bUlkeCA9IDA7XG59XG5cblV0ZjdJTUFQRW5jb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgaW5CYXNlNjQgPSB0aGlzLmluQmFzZTY0LFxuICAgICAgICBiYXNlNjRBY2N1bSA9IHRoaXMuYmFzZTY0QWNjdW0sXG4gICAgICAgIGJhc2U2NEFjY3VtSWR4ID0gdGhpcy5iYXNlNjRBY2N1bUlkeCxcbiAgICAgICAgYnVmID0gbmV3IEJ1ZmZlcihzdHIubGVuZ3RoKjUgKyAxMCksIGJ1ZklkeCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdUNoYXIgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKDB4MjAgPD0gdUNoYXIgJiYgdUNoYXIgPD0gMHg3RSkgeyAvLyBEaXJlY3QgY2hhcmFjdGVyIG9yICcmJy5cbiAgICAgICAgICAgIGlmIChpbkJhc2U2NCkge1xuICAgICAgICAgICAgICAgIGlmIChiYXNlNjRBY2N1bUlkeCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnVmSWR4ICs9IGJ1Zi53cml0ZShiYXNlNjRBY2N1bS5zbGljZSgwLCBiYXNlNjRBY2N1bUlkeCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoL1xcLy9nLCAnLCcpLnJlcGxhY2UoLz0rJC8sICcnKSwgYnVmSWR4KTtcbiAgICAgICAgICAgICAgICAgICAgYmFzZTY0QWNjdW1JZHggPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJ1ZltidWZJZHgrK10gPSBtaW51c0NoYXI7IC8vIFdyaXRlICctJywgdGhlbiBnbyB0byBkaXJlY3QgbW9kZS5cbiAgICAgICAgICAgICAgICBpbkJhc2U2NCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWluQmFzZTY0KSB7XG4gICAgICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IHVDaGFyOyAvLyBXcml0ZSBkaXJlY3QgY2hhcmFjdGVyXG5cbiAgICAgICAgICAgICAgICBpZiAodUNoYXIgPT09IGFuZENoYXIpICAvLyBBbXBlcnNhbmQgLT4gJyYtJ1xuICAgICAgICAgICAgICAgICAgICBidWZbYnVmSWR4KytdID0gbWludXNDaGFyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7IC8vIE5vbi1kaXJlY3QgY2hhcmFjdGVyXG4gICAgICAgICAgICBpZiAoIWluQmFzZTY0KSB7XG4gICAgICAgICAgICAgICAgYnVmW2J1ZklkeCsrXSA9IGFuZENoYXI7IC8vIFdyaXRlICcmJywgdGhlbiBnbyB0byBiYXNlNjQgbW9kZS5cbiAgICAgICAgICAgICAgICBpbkJhc2U2NCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5CYXNlNjQpIHtcbiAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bVtiYXNlNjRBY2N1bUlkeCsrXSA9IHVDaGFyID4+IDg7XG4gICAgICAgICAgICAgICAgYmFzZTY0QWNjdW1bYmFzZTY0QWNjdW1JZHgrK10gPSB1Q2hhciAmIDB4RkY7XG5cbiAgICAgICAgICAgICAgICBpZiAoYmFzZTY0QWNjdW1JZHggPT0gYmFzZTY0QWNjdW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZklkeCArPSBidWYud3JpdGUoYmFzZTY0QWNjdW0udG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoL1xcLy9nLCAnLCcpLCBidWZJZHgpO1xuICAgICAgICAgICAgICAgICAgICBiYXNlNjRBY2N1bUlkeCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbkJhc2U2NCA9IGluQmFzZTY0O1xuICAgIHRoaXMuYmFzZTY0QWNjdW1JZHggPSBiYXNlNjRBY2N1bUlkeDtcblxuICAgIHJldHVybiBidWYuc2xpY2UoMCwgYnVmSWR4KTtcbn1cblxuVXRmN0lNQVBFbmNvZGVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmID0gbmV3IEJ1ZmZlcigxMCksIGJ1ZklkeCA9IDA7XG4gICAgaWYgKHRoaXMuaW5CYXNlNjQpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFzZTY0QWNjdW1JZHggPiAwKSB7XG4gICAgICAgICAgICBidWZJZHggKz0gYnVmLndyaXRlKHRoaXMuYmFzZTY0QWNjdW0uc2xpY2UoMCwgdGhpcy5iYXNlNjRBY2N1bUlkeCkudG9TdHJpbmcoJ2Jhc2U2NCcpLnJlcGxhY2UoL1xcLy9nLCAnLCcpLnJlcGxhY2UoLz0rJC8sICcnKSwgYnVmSWR4KTtcbiAgICAgICAgICAgIHRoaXMuYmFzZTY0QWNjdW1JZHggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVmW2J1ZklkeCsrXSA9IG1pbnVzQ2hhcjsgLy8gV3JpdGUgJy0nLCB0aGVuIGdvIHRvIGRpcmVjdCBtb2RlLlxuICAgICAgICB0aGlzLmluQmFzZTY0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwLCBidWZJZHgpO1xufVxuXG5cbi8vIC0tIERlY29kaW5nXG5cbmZ1bmN0aW9uIFV0ZjdJTUFQRGVjb2RlcihvcHRpb25zLCBjb2RlYykge1xuICAgIHRoaXMuaWNvbnYgPSBjb2RlYy5pY29udjtcbiAgICB0aGlzLmluQmFzZTY0ID0gZmFsc2U7XG4gICAgdGhpcy5iYXNlNjRBY2N1bSA9ICcnO1xufVxuXG52YXIgYmFzZTY0SU1BUENoYXJzID0gYmFzZTY0Q2hhcnMuc2xpY2UoKTtcbmJhc2U2NElNQVBDaGFyc1snLCcuY2hhckNvZGVBdCgwKV0gPSB0cnVlO1xuXG5VdGY3SU1BUERlY29kZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oYnVmKSB7XG4gICAgdmFyIHJlcyA9IFwiXCIsIGxhc3RJID0gMCxcbiAgICAgICAgaW5CYXNlNjQgPSB0aGlzLmluQmFzZTY0LFxuICAgICAgICBiYXNlNjRBY2N1bSA9IHRoaXMuYmFzZTY0QWNjdW07XG5cbiAgICAvLyBUaGUgZGVjb2RlciBpcyBtb3JlIGludm9sdmVkIGFzIHdlIG11c3QgaGFuZGxlIGNodW5rcyBpbiBzdHJlYW0uXG4gICAgLy8gSXQgaXMgZm9yZ2l2aW5nLCBjbG9zZXIgdG8gc3RhbmRhcmQgVVRGLTcgKGZvciBleGFtcGxlLCAnLScgaXMgb3B0aW9uYWwgYXQgdGhlIGVuZCkuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWluQmFzZTY0KSB7IC8vIFdlJ3JlIGluIGRpcmVjdCBtb2RlLlxuICAgICAgICAgICAgLy8gV3JpdGUgZGlyZWN0IGNoYXJzIHVudGlsICcmJ1xuICAgICAgICAgICAgaWYgKGJ1ZltpXSA9PSBhbmRDaGFyKSB7XG4gICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKGJ1Zi5zbGljZShsYXN0SSwgaSksIFwiYXNjaWlcIik7IC8vIFdyaXRlIGRpcmVjdCBjaGFycy5cbiAgICAgICAgICAgICAgICBsYXN0SSA9IGkrMTtcbiAgICAgICAgICAgICAgICBpbkJhc2U2NCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIFdlIGRlY29kZSBiYXNlNjQuXG4gICAgICAgICAgICBpZiAoIWJhc2U2NElNQVBDaGFyc1tidWZbaV1dKSB7IC8vIEJhc2U2NCBlbmRlZC5cbiAgICAgICAgICAgICAgICBpZiAoaSA9PSBsYXN0SSAmJiBidWZbaV0gPT0gbWludXNDaGFyKSB7IC8vIFwiJi1cIiAtPiBcIiZcIlxuICAgICAgICAgICAgICAgICAgICByZXMgKz0gXCImXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGI2NHN0ciA9IGJhc2U2NEFjY3VtICsgYnVmLnNsaWNlKGxhc3RJLCBpKS50b1N0cmluZygpLnJlcGxhY2UoLywvZywgJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIoYjY0c3RyLCAnYmFzZTY0JyksIFwidXRmMTYtYmVcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZltpXSAhPSBtaW51c0NoYXIpIC8vIE1pbnVzIG1heSBiZSBhYnNvcmJlZCBhZnRlciBiYXNlNjQuXG4gICAgICAgICAgICAgICAgICAgIGktLTtcblxuICAgICAgICAgICAgICAgIGxhc3RJID0gaSsxO1xuICAgICAgICAgICAgICAgIGluQmFzZTY0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYmFzZTY0QWNjdW0gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaW5CYXNlNjQpIHtcbiAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKGJ1Zi5zbGljZShsYXN0SSksIFwiYXNjaWlcIik7IC8vIFdyaXRlIGRpcmVjdCBjaGFycy5cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYjY0c3RyID0gYmFzZTY0QWNjdW0gKyBidWYuc2xpY2UobGFzdEkpLnRvU3RyaW5nKCkucmVwbGFjZSgvLC9nLCAnLycpO1xuXG4gICAgICAgIHZhciBjYW5CZURlY29kZWQgPSBiNjRzdHIubGVuZ3RoIC0gKGI2NHN0ci5sZW5ndGggJSA4KTsgLy8gTWluaW1hbCBjaHVuazogMiBxdWFkcyAtPiAyeDMgYnl0ZXMgLT4gMyBjaGFycy5cbiAgICAgICAgYmFzZTY0QWNjdW0gPSBiNjRzdHIuc2xpY2UoY2FuQmVEZWNvZGVkKTsgLy8gVGhlIHJlc3Qgd2lsbCBiZSBkZWNvZGVkIGluIGZ1dHVyZS5cbiAgICAgICAgYjY0c3RyID0gYjY0c3RyLnNsaWNlKDAsIGNhbkJlRGVjb2RlZCk7XG5cbiAgICAgICAgcmVzICs9IHRoaXMuaWNvbnYuZGVjb2RlKG5ldyBCdWZmZXIoYjY0c3RyLCAnYmFzZTY0JyksIFwidXRmMTYtYmVcIik7XG4gICAgfVxuXG4gICAgdGhpcy5pbkJhc2U2NCA9IGluQmFzZTY0O1xuICAgIHRoaXMuYmFzZTY0QWNjdW0gPSBiYXNlNjRBY2N1bTtcblxuICAgIHJldHVybiByZXM7XG59XG5cblV0ZjdJTUFQRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IFwiXCI7XG4gICAgaWYgKHRoaXMuaW5CYXNlNjQgJiYgdGhpcy5iYXNlNjRBY2N1bS5sZW5ndGggPiAwKVxuICAgICAgICByZXMgPSB0aGlzLmljb252LmRlY29kZShuZXcgQnVmZmVyKHRoaXMuYmFzZTY0QWNjdW0sICdiYXNlNjQnKSwgXCJ1dGYxNi1iZVwiKTtcblxuICAgIHRoaXMuaW5CYXNlNjQgPSBmYWxzZTtcbiAgICB0aGlzLmJhc2U2NEFjY3VtID0gJyc7XG4gICAgcmV0dXJuIHJlcztcbn1cblxuXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgQk9NQ2hhciA9ICdcXHVGRUZGJztcblxuZXhwb3J0cy5QcmVwZW5kQk9NID0gUHJlcGVuZEJPTVdyYXBwZXJcbmZ1bmN0aW9uIFByZXBlbmRCT01XcmFwcGVyKGVuY29kZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVuY29kZXIgPSBlbmNvZGVyO1xuICAgIHRoaXMuYWRkQk9NID0gdHJ1ZTtcbn1cblxuUHJlcGVuZEJPTVdyYXBwZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHRoaXMuYWRkQk9NKSB7XG4gICAgICAgIHN0ciA9IEJPTUNoYXIgKyBzdHI7XG4gICAgICAgIHRoaXMuYWRkQk9NID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rlci53cml0ZShzdHIpO1xufVxuXG5QcmVwZW5kQk9NV3JhcHBlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW5jb2Rlci5lbmQoKTtcbn1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlN0cmlwQk9NID0gU3RyaXBCT01XcmFwcGVyO1xuZnVuY3Rpb24gU3RyaXBCT01XcmFwcGVyKGRlY29kZXIsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmRlY29kZXIgPSBkZWNvZGVyO1xuICAgIHRoaXMucGFzcyA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG59XG5cblN0cmlwQk9NV3JhcHBlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWYpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5kZWNvZGVyLndyaXRlKGJ1Zik7XG4gICAgaWYgKHRoaXMucGFzcyB8fCAhcmVzKVxuICAgICAgICByZXR1cm4gcmVzO1xuXG4gICAgaWYgKHJlc1swXSA9PT0gQk9NQ2hhcikge1xuICAgICAgICByZXMgPSByZXMuc2xpY2UoMSk7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnN0cmlwQk9NID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnN0cmlwQk9NKCk7XG4gICAgfVxuXG4gICAgdGhpcy5wYXNzID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzO1xufVxuXG5TdHJpcEJPTVdyYXBwZXIucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRlY29kZXIuZW5kKCk7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiXG5cbi8vID09IEV4dGVuZCBOb2RlIHByaW1pdGl2ZXMgdG8gdXNlIGljb252LWxpdGUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGljb252KSB7XG4gICAgdmFyIG9yaWdpbmFsID0gdW5kZWZpbmVkOyAvLyBQbGFjZSB0byBrZWVwIG9yaWdpbmFsIG1ldGhvZHMuXG5cbiAgICAvLyBOb2RlIGF1dGhvcnMgcmV3cm90ZSBCdWZmZXIgaW50ZXJuYWxzIHRvIG1ha2UgaXQgY29tcGF0aWJsZSB3aXRoXG4gICAgLy8gVWludDhBcnJheSBhbmQgd2UgY2Fubm90IHBhdGNoIGtleSBmdW5jdGlvbnMgc2luY2UgdGhlbi5cbiAgICBpY29udi5zdXBwb3J0c05vZGVFbmNvZGluZ3NFeHRlbnNpb24gPSAhKG5ldyBCdWZmZXIoMCkgaW5zdGFuY2VvZiBVaW50OEFycmF5KTtcblxuICAgIGljb252LmV4dGVuZE5vZGVFbmNvZGluZ3MgPSBmdW5jdGlvbiBleHRlbmROb2RlRW5jb2RpbmdzKCkge1xuICAgICAgICBpZiAob3JpZ2luYWwpIHJldHVybjtcbiAgICAgICAgb3JpZ2luYWwgPSB7fTtcblxuICAgICAgICBpZiAoIWljb252LnN1cHBvcnRzTm9kZUVuY29kaW5nc0V4dGVuc2lvbikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkFDVElPTiBORUVERUQ6IHJlcXVpcmUoJ2ljb252LWxpdGUnKS5leHRlbmROb2RlRW5jb2RpbmdzKCkgaXMgbm90IHN1cHBvcnRlZCBpbiB5b3VyIHZlcnNpb24gb2YgTm9kZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTZWUgbW9yZSBpbmZvIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9hc2h0dWNoa2luL2ljb252LWxpdGUvd2lraS9Ob2RlLXY0LWNvbXBhdGliaWxpdHlcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbm9kZU5hdGl2ZUVuY29kaW5ncyA9IHtcbiAgICAgICAgICAgICdoZXgnOiB0cnVlLCAndXRmOCc6IHRydWUsICd1dGYtOCc6IHRydWUsICdhc2NpaSc6IHRydWUsICdiaW5hcnknOiB0cnVlLCBcbiAgICAgICAgICAgICdiYXNlNjQnOiB0cnVlLCAndWNzMic6IHRydWUsICd1Y3MtMic6IHRydWUsICd1dGYxNmxlJzogdHJ1ZSwgJ3V0Zi0xNmxlJzogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyA9IGZ1bmN0aW9uKGVuYykge1xuICAgICAgICAgICAgcmV0dXJuIGVuYyAmJiBub2RlTmF0aXZlRW5jb2RpbmdzW2VuYy50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tIFNsb3dCdWZmZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgdmFyIFNsb3dCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5TbG93QnVmZmVyO1xuXG4gICAgICAgIG9yaWdpbmFsLlNsb3dCdWZmZXJUb1N0cmluZyA9IFNsb3dCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgICAgICBTbG93QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIC8vIFVzZSBuYXRpdmUgY29udmVyc2lvbiB3aGVuIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAoQnVmZmVyLmlzTmF0aXZlRW5jb2RpbmcoZW5jb2RpbmcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbC5TbG93QnVmZmVyVG9TdHJpbmcuY2FsbCh0aGlzLCBlbmNvZGluZywgc3RhcnQsIGVuZCk7XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdXNlIG91ciBkZWNvZGluZyBtZXRob2QuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN0YXJ0ID09ICd1bmRlZmluZWQnKSBzdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykgZW5kID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gaWNvbnYuZGVjb2RlKHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCksIGVuY29kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9yaWdpbmFsLlNsb3dCdWZmZXJXcml0ZSA9IFNsb3dCdWZmZXIucHJvdG90eXBlLndyaXRlO1xuICAgICAgICBTbG93QnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gICAgICAgICAgICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAgICAgICAgICAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgICAgICAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5jb2RpbmcgPSBsZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgICAgICAgICAgICAgdmFyIHN3YXAgPSBlbmNvZGluZztcbiAgICAgICAgICAgICAgICBlbmNvZGluZyA9IG9mZnNldDtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBsZW5ndGg7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gc3dhcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb2Zmc2V0ID0gK29mZnNldCB8fCAwO1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0O1xuICAgICAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9ICtsZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAvLyBVc2UgbmF0aXZlIGNvbnZlcnNpb24gd2hlbiBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKEJ1ZmZlci5pc05hdGl2ZUVuY29kaW5nKGVuY29kaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwuU2xvd0J1ZmZlcldyaXRlLmNhbGwodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpO1xuXG4gICAgICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBib3VuZHMnKTtcblxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB1c2Ugb3VyIGVuY29kaW5nIG1ldGhvZC5cbiAgICAgICAgICAgIHZhciBidWYgPSBpY29udi5lbmNvZGUoc3RyaW5nLCBlbmNvZGluZyk7XG4gICAgICAgICAgICBpZiAoYnVmLmxlbmd0aCA8IGxlbmd0aCkgbGVuZ3RoID0gYnVmLmxlbmd0aDtcbiAgICAgICAgICAgIGJ1Zi5jb3B5KHRoaXMsIG9mZnNldCwgMCwgbGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLSBCdWZmZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgb3JpZ2luYWwuQnVmZmVySXNFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nO1xuICAgICAgICBCdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gQnVmZmVyLmlzTmF0aXZlRW5jb2RpbmcoZW5jb2RpbmcpIHx8IGljb252LmVuY29kaW5nRXhpc3RzKGVuY29kaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9yaWdpbmFsLkJ1ZmZlckJ5dGVMZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aDtcbiAgICAgICAgQnVmZmVyLmJ5dGVMZW5ndGggPSBTbG93QnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbihzdHIsIGVuY29kaW5nKSB7XG4gICAgICAgICAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIC8vIFVzZSBuYXRpdmUgY29udmVyc2lvbiB3aGVuIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAoQnVmZmVyLmlzTmF0aXZlRW5jb2RpbmcoZW5jb2RpbmcpKVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbC5CdWZmZXJCeXRlTGVuZ3RoLmNhbGwodGhpcywgc3RyLCBlbmNvZGluZyk7XG5cbiAgICAgICAgICAgIC8vIFNsb3csIEkga25vdywgYnV0IHdlIGRvbid0IGhhdmUgYSBiZXR0ZXIgd2F5IHlldC5cbiAgICAgICAgICAgIHJldHVybiBpY29udi5lbmNvZGUoc3RyLCBlbmNvZGluZykubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgb3JpZ2luYWwuQnVmZmVyVG9TdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgICAgICBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgLy8gVXNlIG5hdGl2ZSBjb252ZXJzaW9uIHdoZW4gcG9zc2libGVcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyhlbmNvZGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLkJ1ZmZlclRvU3RyaW5nLmNhbGwodGhpcywgZW5jb2RpbmcsIHN0YXJ0LCBlbmQpO1xuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHVzZSBvdXIgZGVjb2RpbmcgbWV0aG9kLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydCA9PSAndW5kZWZpbmVkJykgc3RhcnQgPSAwO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcpIGVuZCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIGljb252LmRlY29kZSh0aGlzLnNsaWNlKHN0YXJ0LCBlbmQpLCBlbmNvZGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBvcmlnaW5hbC5CdWZmZXJXcml0ZSA9IEJ1ZmZlci5wcm90b3R5cGUud3JpdGU7XG4gICAgICAgIEJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAgICAgICAgICAgdmFyIF9vZmZzZXQgPSBvZmZzZXQsIF9sZW5ndGggPSBsZW5ndGgsIF9lbmNvZGluZyA9IGVuY29kaW5nO1xuICAgICAgICAgICAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgICAgICAgICAgIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgICAgICAgIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsZW5ndGggPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgICAgICAgICAgICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgICAgICAgICAgICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHN3YXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgLy8gVXNlIG5hdGl2ZSBjb252ZXJzaW9uIHdoZW4gcG9zc2libGVcbiAgICAgICAgICAgIGlmIChCdWZmZXIuaXNOYXRpdmVFbmNvZGluZyhlbmNvZGluZykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLkJ1ZmZlcldyaXRlLmNhbGwodGhpcywgc3RyaW5nLCBfb2Zmc2V0LCBfbGVuZ3RoLCBfZW5jb2RpbmcpO1xuXG4gICAgICAgICAgICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXQ7XG4gICAgICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignYXR0ZW1wdCB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGJvdW5kcycpO1xuXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHVzZSBvdXIgZW5jb2RpbmcgbWV0aG9kLlxuICAgICAgICAgICAgdmFyIGJ1ZiA9IGljb252LmVuY29kZShzdHJpbmcsIGVuY29kaW5nKTtcbiAgICAgICAgICAgIGlmIChidWYubGVuZ3RoIDwgbGVuZ3RoKSBsZW5ndGggPSBidWYubGVuZ3RoO1xuICAgICAgICAgICAgYnVmLmNvcHkodGhpcywgb2Zmc2V0LCAwLCBsZW5ndGgpO1xuICAgICAgICAgICAgcmV0dXJuIGxlbmd0aDtcblxuICAgICAgICAgICAgLy8gVE9ETzogU2V0IF9jaGFyc1dyaXR0ZW4uXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIC0tIFJlYWRhYmxlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgaWYgKGljb252LnN1cHBvcnRzU3RyZWFtcykge1xuICAgICAgICAgICAgdmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuUmVhZGFibGU7XG5cbiAgICAgICAgICAgIG9yaWdpbmFsLlJlYWRhYmxlU2V0RW5jb2RpbmcgPSBSZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2Rpbmc7XG4gICAgICAgICAgICBSZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbiBzZXRFbmNvZGluZyhlbmMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAvLyBVc2Ugb3VyIG93biBkZWNvZGVyLCBpdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlLlxuICAgICAgICAgICAgICAgIC8vIFdlIGNhbm5vdCB1c2Ugb3JpZ2luYWwgZnVuY3Rpb24gYXMgaXQgZG9lc24ndCBoYW5kbGUgQk9NLXMuXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyID0gaWNvbnYuZ2V0RGVjb2RlcihlbmMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2RpbmcgPSBlbmM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFJlYWRhYmxlLnByb3RvdHlwZS5jb2xsZWN0ID0gaWNvbnYuX2NvbGxlY3Q7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgaWNvbnYtbGl0ZSBOb2RlIHByaW1pdGl2ZSBleHRlbnNpb25zLlxuICAgIGljb252LnVuZG9FeHRlbmROb2RlRW5jb2RpbmdzID0gZnVuY3Rpb24gdW5kb0V4dGVuZE5vZGVFbmNvZGluZ3MoKSB7XG4gICAgICAgIGlmICghaWNvbnYuc3VwcG9ydHNOb2RlRW5jb2RpbmdzRXh0ZW5zaW9uKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoIW9yaWdpbmFsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicmVxdWlyZSgnaWNvbnYtbGl0ZScpLnVuZG9FeHRlbmROb2RlRW5jb2RpbmdzKCk6IE5vdGhpbmcgdG8gdW5kbzsgZXh0ZW5kTm9kZUVuY29kaW5ncygpIGlzIG5vdCBjYWxsZWQuXCIpXG5cbiAgICAgICAgZGVsZXRlIEJ1ZmZlci5pc05hdGl2ZUVuY29kaW5nO1xuXG4gICAgICAgIHZhciBTbG93QnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJykuU2xvd0J1ZmZlcjtcblxuICAgICAgICBTbG93QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IG9yaWdpbmFsLlNsb3dCdWZmZXJUb1N0cmluZztcbiAgICAgICAgU2xvd0J1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBvcmlnaW5hbC5TbG93QnVmZmVyV3JpdGU7XG5cbiAgICAgICAgQnVmZmVyLmlzRW5jb2RpbmcgPSBvcmlnaW5hbC5CdWZmZXJJc0VuY29kaW5nO1xuICAgICAgICBCdWZmZXIuYnl0ZUxlbmd0aCA9IG9yaWdpbmFsLkJ1ZmZlckJ5dGVMZW5ndGg7XG4gICAgICAgIEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBvcmlnaW5hbC5CdWZmZXJUb1N0cmluZztcbiAgICAgICAgQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IG9yaWdpbmFsLkJ1ZmZlcldyaXRlO1xuXG4gICAgICAgIGlmIChpY29udi5zdXBwb3J0c1N0cmVhbXMpIHtcbiAgICAgICAgICAgIHZhciBSZWFkYWJsZSA9IHJlcXVpcmUoJ3N0cmVhbScpLlJlYWRhYmxlO1xuXG4gICAgICAgICAgICBSZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBvcmlnaW5hbC5SZWFkYWJsZVNldEVuY29kaW5nO1xuICAgICAgICAgICAgZGVsZXRlIFJlYWRhYmxlLnByb3RvdHlwZS5jb2xsZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgb3JpZ2luYWwgPSB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGJvbUhhbmRsaW5nID0gcmVxdWlyZSgnLi9ib20taGFuZGxpbmcnKSxcbiAgICBpY29udiA9IG1vZHVsZS5leHBvcnRzO1xuXG4vLyBBbGwgY29kZWNzIGFuZCBhbGlhc2VzIGFyZSBrZXB0IGhlcmUsIGtleWVkIGJ5IGVuY29kaW5nIG5hbWUvYWxpYXMuXG4vLyBUaGV5IGFyZSBsYXp5IGxvYWRlZCBpbiBgaWNvbnYuZ2V0Q29kZWNgIGZyb20gYGVuY29kaW5ncy9pbmRleC5qc2AuXG5pY29udi5lbmNvZGluZ3MgPSBudWxsO1xuXG4vLyBDaGFyYWN0ZXJzIGVtaXR0ZWQgaW4gY2FzZSBvZiBlcnJvci5cbmljb252LmRlZmF1bHRDaGFyVW5pY29kZSA9ICfvv70nO1xuaWNvbnYuZGVmYXVsdENoYXJTaW5nbGVCeXRlID0gJz8nO1xuXG4vLyBQdWJsaWMgQVBJLlxuaWNvbnYuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKHN0ciwgZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICBzdHIgPSBcIlwiICsgKHN0ciB8fCBcIlwiKTsgLy8gRW5zdXJlIHN0cmluZy5cblxuICAgIHZhciBlbmNvZGVyID0gaWNvbnYuZ2V0RW5jb2RlcihlbmNvZGluZywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzID0gZW5jb2Rlci53cml0ZShzdHIpO1xuICAgIHZhciB0cmFpbCA9IGVuY29kZXIuZW5kKCk7XG4gICAgXG4gICAgcmV0dXJuICh0cmFpbCAmJiB0cmFpbC5sZW5ndGggPiAwKSA/IEJ1ZmZlci5jb25jYXQoW3JlcywgdHJhaWxdKSA6IHJlcztcbn1cblxuaWNvbnYuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKGJ1ZiwgZW5jb2RpbmcsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIGJ1ZiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCFpY29udi5za2lwRGVjb2RlV2FybmluZykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignSWNvbnYtbGl0ZSB3YXJuaW5nOiBkZWNvZGUoKS1pbmcgc3RyaW5ncyBpcyBkZXByZWNhdGVkLiBSZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vYXNodHVjaGtpbi9pY29udi1saXRlL3dpa2kvVXNlLUJ1ZmZlcnMtd2hlbi1kZWNvZGluZycpO1xuICAgICAgICAgICAgaWNvbnYuc2tpcERlY29kZVdhcm5pbmcgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVmID0gbmV3IEJ1ZmZlcihcIlwiICsgKGJ1ZiB8fCBcIlwiKSwgXCJiaW5hcnlcIik7IC8vIEVuc3VyZSBidWZmZXIuXG4gICAgfVxuXG4gICAgdmFyIGRlY29kZXIgPSBpY29udi5nZXREZWNvZGVyKGVuY29kaW5nLCBvcHRpb25zKTtcblxuICAgIHZhciByZXMgPSBkZWNvZGVyLndyaXRlKGJ1Zik7XG4gICAgdmFyIHRyYWlsID0gZGVjb2Rlci5lbmQoKTtcblxuICAgIHJldHVybiB0cmFpbCA/IChyZXMgKyB0cmFpbCkgOiByZXM7XG59XG5cbmljb252LmVuY29kaW5nRXhpc3RzID0gZnVuY3Rpb24gZW5jb2RpbmdFeGlzdHMoZW5jKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWNvbnYuZ2V0Q29kZWMoZW5jKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vLyBMZWdhY3kgYWxpYXNlcyB0byBjb252ZXJ0IGZ1bmN0aW9uc1xuaWNvbnYudG9FbmNvZGluZyA9IGljb252LmVuY29kZTtcbmljb252LmZyb21FbmNvZGluZyA9IGljb252LmRlY29kZTtcblxuLy8gU2VhcmNoIGZvciBhIGNvZGVjIGluIGljb252LmVuY29kaW5ncy4gQ2FjaGUgY29kZWMgZGF0YSBpbiBpY29udi5fY29kZWNEYXRhQ2FjaGUuXG5pY29udi5fY29kZWNEYXRhQ2FjaGUgPSB7fTtcbmljb252LmdldENvZGVjID0gZnVuY3Rpb24gZ2V0Q29kZWMoZW5jb2RpbmcpIHtcbiAgICBpZiAoIWljb252LmVuY29kaW5ncylcbiAgICAgICAgaWNvbnYuZW5jb2RpbmdzID0gcmVxdWlyZShcIi4uL2VuY29kaW5nc1wiKTsgLy8gTGF6eSBsb2FkIGFsbCBlbmNvZGluZyBkZWZpbml0aW9ucy5cbiAgICBcbiAgICAvLyBDYW5vbmljYWxpemUgZW5jb2RpbmcgbmFtZTogc3RyaXAgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcnMgYW5kIGFwcGVuZGVkIHllYXIuXG4gICAgdmFyIGVuYyA9ICgnJytlbmNvZGluZykudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9bXjAtOWEtel18OlxcZHs0fSQvZywgXCJcIik7XG5cbiAgICAvLyBUcmF2ZXJzZSBpY29udi5lbmNvZGluZ3MgdG8gZmluZCBhY3R1YWwgY29kZWMuXG4gICAgdmFyIGNvZGVjT3B0aW9ucyA9IHt9O1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBjb2RlYyA9IGljb252Ll9jb2RlY0RhdGFDYWNoZVtlbmNdO1xuICAgICAgICBpZiAoY29kZWMpXG4gICAgICAgICAgICByZXR1cm4gY29kZWM7XG5cbiAgICAgICAgdmFyIGNvZGVjRGVmID0gaWNvbnYuZW5jb2RpbmdzW2VuY107XG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgY29kZWNEZWYpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjogLy8gRGlyZWN0IGFsaWFzIHRvIG90aGVyIGVuY29kaW5nLlxuICAgICAgICAgICAgICAgIGVuYyA9IGNvZGVjRGVmO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6IC8vIEFsaWFzIHdpdGggb3B0aW9ucy4gQ2FuIGJlIGxheWVyZWQuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvZGVjRGVmKVxuICAgICAgICAgICAgICAgICAgICBjb2RlY09wdGlvbnNba2V5XSA9IGNvZGVjRGVmW2tleV07XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWUpXG4gICAgICAgICAgICAgICAgICAgIGNvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWUgPSBlbmM7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZW5jID0gY29kZWNEZWYudHlwZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6IC8vIENvZGVjIGl0c2VsZi5cbiAgICAgICAgICAgICAgICBpZiAoIWNvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWUpXG4gICAgICAgICAgICAgICAgICAgIGNvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWUgPSBlbmM7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY29kZWMgZnVuY3Rpb24gbXVzdCBsb2FkIGFsbCB0YWJsZXMgYW5kIHJldHVybiBvYmplY3Qgd2l0aCAuZW5jb2RlciBhbmQgLmRlY29kZXIgbWV0aG9kcy5cbiAgICAgICAgICAgICAgICAvLyBJdCdsbCBiZSBjYWxsZWQgb25seSBvbmNlIChmb3IgZWFjaCBkaWZmZXJlbnQgb3B0aW9ucyBvYmplY3QpLlxuICAgICAgICAgICAgICAgIGNvZGVjID0gbmV3IGNvZGVjRGVmKGNvZGVjT3B0aW9ucywgaWNvbnYpO1xuXG4gICAgICAgICAgICAgICAgaWNvbnYuX2NvZGVjRGF0YUNhY2hlW2NvZGVjT3B0aW9ucy5lbmNvZGluZ05hbWVdID0gY29kZWM7IC8vIFNhdmUgaXQgdG8gYmUgcmV1c2VkIGxhdGVyLlxuICAgICAgICAgICAgICAgIHJldHVybiBjb2RlYztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbmNvZGluZyBub3QgcmVjb2duaXplZDogJ1wiICsgZW5jb2RpbmcgKyBcIicgKHNlYXJjaGVkIGFzOiAnXCIrZW5jK1wiJylcIik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmljb252LmdldEVuY29kZXIgPSBmdW5jdGlvbiBnZXRFbmNvZGVyKGVuY29kaW5nLCBvcHRpb25zKSB7XG4gICAgdmFyIGNvZGVjID0gaWNvbnYuZ2V0Q29kZWMoZW5jb2RpbmcpLFxuICAgICAgICBlbmNvZGVyID0gbmV3IGNvZGVjLmVuY29kZXIob3B0aW9ucywgY29kZWMpO1xuXG4gICAgaWYgKGNvZGVjLmJvbUF3YXJlICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5hZGRCT00pXG4gICAgICAgIGVuY29kZXIgPSBuZXcgYm9tSGFuZGxpbmcuUHJlcGVuZEJPTShlbmNvZGVyLCBvcHRpb25zKTtcblxuICAgIHJldHVybiBlbmNvZGVyO1xufVxuXG5pY29udi5nZXREZWNvZGVyID0gZnVuY3Rpb24gZ2V0RGVjb2RlcihlbmNvZGluZywgb3B0aW9ucykge1xuICAgIHZhciBjb2RlYyA9IGljb252LmdldENvZGVjKGVuY29kaW5nKSxcbiAgICAgICAgZGVjb2RlciA9IG5ldyBjb2RlYy5kZWNvZGVyKG9wdGlvbnMsIGNvZGVjKTtcblxuICAgIGlmIChjb2RlYy5ib21Bd2FyZSAmJiAhKG9wdGlvbnMgJiYgb3B0aW9ucy5zdHJpcEJPTSA9PT0gZmFsc2UpKVxuICAgICAgICBkZWNvZGVyID0gbmV3IGJvbUhhbmRsaW5nLlN0cmlwQk9NKGRlY29kZXIsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGRlY29kZXI7XG59XG5cblxuLy8gTG9hZCBleHRlbnNpb25zIGluIE5vZGUuIEFsbCBvZiB0aGVtIGFyZSBvbWl0dGVkIGluIEJyb3dzZXJpZnkgYnVpbGQgdmlhICdicm93c2VyJyBmaWVsZCBpbiBwYWNrYWdlLmpzb24uXG52YXIgbm9kZVZlciA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnMubm9kZTtcbmlmIChub2RlVmVyKSB7XG5cbiAgICAvLyBMb2FkIHN0cmVhbWluZyBzdXBwb3J0IGluIE5vZGUgdjAuMTArXG4gICAgdmFyIG5vZGVWZXJBcnIgPSBub2RlVmVyLnNwbGl0KFwiLlwiKS5tYXAoTnVtYmVyKTtcbiAgICBpZiAobm9kZVZlckFyclswXSA+IDAgfHwgbm9kZVZlckFyclsxXSA+PSAxMCkge1xuICAgICAgICByZXF1aXJlKFwiLi9zdHJlYW1zXCIpKGljb252KTtcbiAgICB9XG5cbiAgICAvLyBMb2FkIE5vZGUgcHJpbWl0aXZlIGV4dGVuc2lvbnMuXG4gICAgcmVxdWlyZShcIi4vZXh0ZW5kLW5vZGVcIikoaWNvbnYpO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZShcInN0cmVhbVwiKS5UcmFuc2Zvcm07XG5cblxuLy8gPT0gRXhwb3J0cyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaWNvbnYpIHtcbiAgICBcbiAgICAvLyBBZGRpdGlvbmFsIFB1YmxpYyBBUEkuXG4gICAgaWNvbnYuZW5jb2RlU3RyZWFtID0gZnVuY3Rpb24gZW5jb2RlU3RyZWFtKGVuY29kaW5nLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuZXcgSWNvbnZMaXRlRW5jb2RlclN0cmVhbShpY29udi5nZXRFbmNvZGVyKGVuY29kaW5nLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWNvbnYuZGVjb2RlU3RyZWFtID0gZnVuY3Rpb24gZGVjb2RlU3RyZWFtKGVuY29kaW5nLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuZXcgSWNvbnZMaXRlRGVjb2RlclN0cmVhbShpY29udi5nZXREZWNvZGVyKGVuY29kaW5nLCBvcHRpb25zKSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgaWNvbnYuc3VwcG9ydHNTdHJlYW1zID0gdHJ1ZTtcblxuXG4gICAgLy8gTm90IHB1Ymxpc2hlZCB5ZXQuXG4gICAgaWNvbnYuSWNvbnZMaXRlRW5jb2RlclN0cmVhbSA9IEljb252TGl0ZUVuY29kZXJTdHJlYW07XG4gICAgaWNvbnYuSWNvbnZMaXRlRGVjb2RlclN0cmVhbSA9IEljb252TGl0ZURlY29kZXJTdHJlYW07XG4gICAgaWNvbnYuX2NvbGxlY3QgPSBJY29udkxpdGVEZWNvZGVyU3RyZWFtLnByb3RvdHlwZS5jb2xsZWN0O1xufTtcblxuXG4vLyA9PSBFbmNvZGVyIHN0cmVhbSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBJY29udkxpdGVFbmNvZGVyU3RyZWFtKGNvbnYsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnYgPSBjb252O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMuZGVjb2RlU3RyaW5ncyA9IGZhbHNlOyAvLyBXZSBhY2NlcHQgb25seSBzdHJpbmdzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGRlY29kZSB0aGVtLlxuICAgIFRyYW5zZm9ybS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xufVxuXG5JY29udkxpdGVFbmNvZGVyU3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVHJhbnNmb3JtLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBJY29udkxpdGVFbmNvZGVyU3RyZWFtIH1cbn0pO1xuXG5JY29udkxpdGVFbmNvZGVyU3RyZWFtLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBkb25lKSB7XG4gICAgaWYgKHR5cGVvZiBjaHVuayAhPSAnc3RyaW5nJylcbiAgICAgICAgcmV0dXJuIGRvbmUobmV3IEVycm9yKFwiSWNvbnYgZW5jb2Rpbmcgc3RyZWFtIG5lZWRzIHN0cmluZ3MgYXMgaXRzIGlucHV0LlwiKSk7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuY29udi53cml0ZShjaHVuayk7XG4gICAgICAgIGlmIChyZXMgJiYgcmVzLmxlbmd0aCkgdGhpcy5wdXNoKHJlcyk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZG9uZShlKTtcbiAgICB9XG59XG5cbkljb252TGl0ZUVuY29kZXJTdHJlYW0ucHJvdG90eXBlLl9mbHVzaCA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5jb252LmVuZCgpO1xuICAgICAgICBpZiAocmVzICYmIHJlcy5sZW5ndGgpIHRoaXMucHVzaChyZXMpO1xuICAgICAgICBkb25lKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGRvbmUoZSk7XG4gICAgfVxufVxuXG5JY29udkxpdGVFbmNvZGVyU3RyZWFtLnByb3RvdHlwZS5jb2xsZWN0ID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgY2h1bmtzID0gW107XG4gICAgdGhpcy5vbignZXJyb3InLCBjYik7XG4gICAgdGhpcy5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7IGNodW5rcy5wdXNoKGNodW5rKTsgfSk7XG4gICAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNiKG51bGwsIEJ1ZmZlci5jb25jYXQoY2h1bmtzKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cblxuLy8gPT0gRGVjb2RlciBzdHJlYW0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZnVuY3Rpb24gSWNvbnZMaXRlRGVjb2RlclN0cmVhbShjb252LCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb252ID0gY29udjtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLmVuY29kaW5nID0gdGhpcy5lbmNvZGluZyA9ICd1dGY4JzsgLy8gV2Ugb3V0cHV0IHN0cmluZ3MuXG4gICAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5cbkljb252TGl0ZURlY29kZXJTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUcmFuc2Zvcm0ucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHsgdmFsdWU6IEljb252TGl0ZURlY29kZXJTdHJlYW0gfVxufSk7XG5cbkljb252TGl0ZURlY29kZXJTdHJlYW0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGRvbmUpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpXG4gICAgICAgIHJldHVybiBkb25lKG5ldyBFcnJvcihcIkljb252IGRlY29kaW5nIHN0cmVhbSBuZWVkcyBidWZmZXJzIGFzIGl0cyBpbnB1dC5cIikpO1xuICAgIHRyeSB7XG4gICAgICAgIHZhciByZXMgPSB0aGlzLmNvbnYud3JpdGUoY2h1bmspO1xuICAgICAgICBpZiAocmVzICYmIHJlcy5sZW5ndGgpIHRoaXMucHVzaChyZXMsIHRoaXMuZW5jb2RpbmcpO1xuICAgICAgICBkb25lKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGRvbmUoZSk7XG4gICAgfVxufVxuXG5JY29udkxpdGVEZWNvZGVyU3RyZWFtLnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbihkb25lKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuY29udi5lbmQoKTtcbiAgICAgICAgaWYgKHJlcyAmJiByZXMubGVuZ3RoKSB0aGlzLnB1c2gocmVzLCB0aGlzLmVuY29kaW5nKTsgICAgICAgICAgICAgICAgXG4gICAgICAgIGRvbmUoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZG9uZShlKTtcbiAgICB9XG59XG5cbkljb252TGl0ZURlY29kZXJTdHJlYW0ucHJvdG90eXBlLmNvbGxlY3QgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciByZXMgPSAnJztcbiAgICB0aGlzLm9uKCdlcnJvcicsIGNiKTtcbiAgICB0aGlzLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHsgcmVzICs9IGNodW5rOyB9KTtcbiAgICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY2IobnVsbCwgcmVzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNTdHJlYW0gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcblx0cmV0dXJuIHN0cmVhbSAhPT0gbnVsbCAmJiB0eXBlb2Ygc3RyZWFtID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RyZWFtLnBpcGUgPT09ICdmdW5jdGlvbic7XG59O1xuXG5pc1N0cmVhbS53cml0YWJsZSA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcblx0cmV0dXJuIGlzU3RyZWFtKHN0cmVhbSkgJiYgc3RyZWFtLndyaXRhYmxlICE9PSBmYWxzZSAmJiB0eXBlb2Ygc3RyZWFtLl93cml0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygc3RyZWFtLl93cml0YWJsZVN0YXRlID09PSAnb2JqZWN0Jztcbn07XG5cbmlzU3RyZWFtLnJlYWRhYmxlID0gZnVuY3Rpb24gKHN0cmVhbSkge1xuXHRyZXR1cm4gaXNTdHJlYW0oc3RyZWFtKSAmJiBzdHJlYW0ucmVhZGFibGUgIT09IGZhbHNlICYmIHR5cGVvZiBzdHJlYW0uX3JlYWQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHN0cmVhbS5fcmVhZGFibGVTdGF0ZSA9PT0gJ29iamVjdCc7XG59O1xuXG5pc1N0cmVhbS5kdXBsZXggPSBmdW5jdGlvbiAoc3RyZWFtKSB7XG5cdHJldHVybiBpc1N0cmVhbS53cml0YWJsZShzdHJlYW0pICYmIGlzU3RyZWFtLnJlYWRhYmxlKHN0cmVhbSk7XG59O1xuXG5pc1N0cmVhbS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoc3RyZWFtKSB7XG5cdHJldHVybiBpc1N0cmVhbS5kdXBsZXgoc3RyZWFtKSAmJiB0eXBlb2Ygc3RyZWFtLl90cmFuc2Zvcm0gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHN0cmVhbS5fdHJhbnNmb3JtU3RhdGUgPT09ICdvYmplY3QnO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgcmVhbEZldGNoID0gcmVxdWlyZSgnbm9kZS1mZXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcblx0aWYgKC9eXFwvXFwvLy50ZXN0KHVybCkpIHtcblx0XHR1cmwgPSAnaHR0cHM6JyArIHVybDtcblx0fVxuXHRyZXR1cm4gcmVhbEZldGNoLmNhbGwodGhpcywgdXJsLCBvcHRpb25zKTtcbn07XG5cbmlmICghZ2xvYmFsLmZldGNoKSB7XG5cdGdsb2JhbC5mZXRjaCA9IG1vZHVsZS5leHBvcnRzO1xuXHRnbG9iYWwuUmVzcG9uc2UgPSByZWFsRmV0Y2guUmVzcG9uc2U7XG5cdGdsb2JhbC5IZWFkZXJzID0gcmVhbEZldGNoLkhlYWRlcnM7XG5cdGdsb2JhbC5SZXF1ZXN0ID0gcmVhbEZldGNoLlJlcXVlc3Q7XG59XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZTtcbiIsInZhciBjb3JlSnNEYXRhID0gcmVxdWlyZSgnLi9fY29yZUpzRGF0YScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAqXG4gKiBPYmplY3RzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBubyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWRcbiAqIHByb3BlcnRpZXMuXG4gKlxuICogQXJyYXktbGlrZSB2YWx1ZXMgc3VjaCBhcyBgYXJndW1lbnRzYCBvYmplY3RzLCBhcnJheXMsIGJ1ZmZlcnMsIHN0cmluZ3MsIG9yXG4gKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICAgIChpc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlLnNwbGljZSA9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIGlzQnVmZmVyKHZhbHVlKSB8fCBpc1R5cGVkQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKTtcbiAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgIHJldHVybiAhdmFsdWUuc2l6ZTtcbiAgfVxuICBpZiAoaXNQcm90b3R5cGUodmFsdWUpKSB7XG4gICAgcmV0dXJuICFiYXNlS2V5cyh2YWx1ZSkubGVuZ3RoO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJcbi8qKlxuICogaW5kZXguanNcbiAqXG4gKiBhIHJlcXVlc3QgQVBJIGNvbXBhdGlibGUgd2l0aCB3aW5kb3cuZmV0Y2hcbiAqL1xuXG52YXIgcGFyc2VfdXJsID0gcmVxdWlyZSgndXJsJykucGFyc2U7XG52YXIgcmVzb2x2ZV91cmwgPSByZXF1aXJlKCd1cmwnKS5yZXNvbHZlO1xudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG52YXIgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpO1xudmFyIHpsaWIgPSByZXF1aXJlKCd6bGliJyk7XG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cbnZhciBCb2R5ID0gcmVxdWlyZSgnLi9saWIvYm9keScpO1xudmFyIFJlc3BvbnNlID0gcmVxdWlyZSgnLi9saWIvcmVzcG9uc2UnKTtcbnZhciBIZWFkZXJzID0gcmVxdWlyZSgnLi9saWIvaGVhZGVycycpO1xudmFyIFJlcXVlc3QgPSByZXF1aXJlKCcuL2xpYi9yZXF1ZXN0Jyk7XG52YXIgRmV0Y2hFcnJvciA9IHJlcXVpcmUoJy4vbGliL2ZldGNoLWVycm9yJyk7XG5cbi8vIGNvbW1vbmpzXG5tb2R1bGUuZXhwb3J0cyA9IEZldGNoO1xuLy8gZXM2IGRlZmF1bHQgZXhwb3J0IGNvbXBhdGliaWxpdHlcbm1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBtb2R1bGUuZXhwb3J0cztcblxuLyoqXG4gKiBGZXRjaCBjbGFzc1xuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgIHVybCAgIEFic29sdXRlIHVybCBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICBPYmplY3QgICBvcHRzICBGZXRjaCBvcHRpb25zXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbmZ1bmN0aW9uIEZldGNoKHVybCwgb3B0cykge1xuXG5cdC8vIGFsbG93IGNhbGwgYXMgZnVuY3Rpb25cblx0aWYgKCEodGhpcyBpbnN0YW5jZW9mIEZldGNoKSlcblx0XHRyZXR1cm4gbmV3IEZldGNoKHVybCwgb3B0cyk7XG5cblx0Ly8gYWxsb3cgY3VzdG9tIHByb21pc2Vcblx0aWYgKCFGZXRjaC5Qcm9taXNlKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCduYXRpdmUgcHJvbWlzZSBtaXNzaW5nLCBzZXQgRmV0Y2guUHJvbWlzZSB0byB5b3VyIGZhdm9yaXRlIGFsdGVybmF0aXZlJyk7XG5cdH1cblxuXHRCb2R5LlByb21pc2UgPSBGZXRjaC5Qcm9taXNlO1xuXG5cdHZhciBzZWxmID0gdGhpcztcblxuXHQvLyB3cmFwIGh0dHAucmVxdWVzdCBpbnRvIGZldGNoXG5cdHJldHVybiBuZXcgRmV0Y2guUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHQvLyBidWlsZCByZXF1ZXN0IG9iamVjdFxuXHRcdHZhciBvcHRpb25zID0gbmV3IFJlcXVlc3QodXJsLCBvcHRzKTtcblxuXHRcdGlmICghb3B0aW9ucy5wcm90b2NvbCB8fCAhb3B0aW9ucy5ob3N0bmFtZSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdvbmx5IGFic29sdXRlIHVybHMgYXJlIHN1cHBvcnRlZCcpO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLnByb3RvY29sICE9PSAnaHR0cDonICYmIG9wdGlvbnMucHJvdG9jb2wgIT09ICdodHRwczonKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ29ubHkgaHR0cChzKSBwcm90b2NvbHMgYXJlIHN1cHBvcnRlZCcpO1xuXHRcdH1cblxuXHRcdHZhciBzZW5kO1xuXHRcdGlmIChvcHRpb25zLnByb3RvY29sID09PSAnaHR0cHM6Jykge1xuXHRcdFx0c2VuZCA9IGh0dHBzLnJlcXVlc3Q7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNlbmQgPSBodHRwLnJlcXVlc3Q7XG5cdFx0fVxuXG5cdFx0Ly8gbm9ybWFsaXplIGhlYWRlcnNcblx0XHR2YXIgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyk7XG5cblx0XHRpZiAob3B0aW9ucy5jb21wcmVzcykge1xuXHRcdFx0aGVhZGVycy5zZXQoJ2FjY2VwdC1lbmNvZGluZycsICdnemlwLGRlZmxhdGUnKTtcblx0XHR9XG5cblx0XHRpZiAoIWhlYWRlcnMuaGFzKCd1c2VyLWFnZW50JykpIHtcblx0XHRcdGhlYWRlcnMuc2V0KCd1c2VyLWFnZW50JywgJ25vZGUtZmV0Y2gvMS4wICgraHR0cHM6Ly9naXRodWIuY29tL2JpdGlubi9ub2RlLWZldGNoKScpO1xuXHRcdH1cblxuXHRcdGlmICghaGVhZGVycy5oYXMoJ2Nvbm5lY3Rpb24nKSAmJiAhb3B0aW9ucy5hZ2VudCkge1xuXHRcdFx0aGVhZGVycy5zZXQoJ2Nvbm5lY3Rpb24nLCAnY2xvc2UnKTtcblx0XHR9XG5cblx0XHRpZiAoIWhlYWRlcnMuaGFzKCdhY2NlcHQnKSkge1xuXHRcdFx0aGVhZGVycy5zZXQoJ2FjY2VwdCcsICcqLyonKTtcblx0XHR9XG5cblx0XHQvLyBkZXRlY3QgZm9ybSBkYXRhIGlucHV0IGZyb20gZm9ybS1kYXRhIG1vZHVsZSwgdGhpcyBoYWNrIGF2b2lkIHRoZSBuZWVkIHRvIHBhc3MgbXVsdGlwYXJ0IGhlYWRlciBtYW51YWxseVxuXHRcdGlmICghaGVhZGVycy5oYXMoJ2NvbnRlbnQtdHlwZScpICYmIG9wdGlvbnMuYm9keSAmJiB0eXBlb2Ygb3B0aW9ucy5ib2R5LmdldEJvdW5kYXJ5ID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRoZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ211bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PScgKyBvcHRpb25zLmJvZHkuZ2V0Qm91bmRhcnkoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gYnJpbmcgbm9kZS1mZXRjaCBjbG9zZXIgdG8gYnJvd3NlciBiZWhhdmlvciBieSBzZXR0aW5nIGNvbnRlbnQtbGVuZ3RoIGF1dG9tYXRpY2FsbHlcblx0XHRpZiAoIWhlYWRlcnMuaGFzKCdjb250ZW50LWxlbmd0aCcpICYmIC9wb3N0fHB1dHxwYXRjaHxkZWxldGUvaS50ZXN0KG9wdGlvbnMubWV0aG9kKSkge1xuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LWxlbmd0aCcsIEJ1ZmZlci5ieXRlTGVuZ3RoKG9wdGlvbnMuYm9keSkpO1xuXHRcdFx0Ly8gZGV0ZWN0IGZvcm0gZGF0YSBpbnB1dCBmcm9tIGZvcm0tZGF0YSBtb2R1bGUsIHRoaXMgaGFjayBhdm9pZCB0aGUgbmVlZCB0byBhZGQgY29udGVudC1sZW5ndGggaGVhZGVyIG1hbnVhbGx5XG5cdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYm9keSAmJiB0eXBlb2Ygb3B0aW9ucy5ib2R5LmdldExlbmd0aFN5bmMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Ly8gZm9yIGZvcm0tZGF0YSAxLnhcblx0XHRcdFx0aWYgKG9wdGlvbnMuYm9keS5fbGVuZ3RoUmV0cmlldmVycyAmJiBvcHRpb25zLmJvZHkuX2xlbmd0aFJldHJpZXZlcnMubGVuZ3RoID09IDApIHtcblx0XHRcdFx0XHRoZWFkZXJzLnNldCgnY29udGVudC1sZW5ndGgnLCBvcHRpb25zLmJvZHkuZ2V0TGVuZ3RoU3luYygpLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHQvLyBmb3IgZm9ybS1kYXRhIDIueFxuXHRcdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYm9keS5oYXNLbm93bkxlbmd0aCAmJiBvcHRpb25zLmJvZHkuaGFzS25vd25MZW5ndGgoKSkge1xuXHRcdFx0XHRcdGhlYWRlcnMuc2V0KCdjb250ZW50LWxlbmd0aCcsIG9wdGlvbnMuYm9keS5nZXRMZW5ndGhTeW5jKCkudG9TdHJpbmcoKSk7XG5cdFx0XHRcdH1cblx0XHRcdC8vIHRoaXMgaXMgb25seSBuZWNlc3NhcnkgZm9yIG9sZGVyIG5vZGVqcyByZWxlYXNlcyAoYmVmb3JlIGlvanMgbWVyZ2UpXG5cdFx0XHR9IGVsc2UgaWYgKG9wdGlvbnMuYm9keSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuYm9keSA9PT0gbnVsbCkge1xuXHRcdFx0XHRoZWFkZXJzLnNldCgnY29udGVudC1sZW5ndGgnLCAnMCcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG9wdGlvbnMuaGVhZGVycyA9IGhlYWRlcnMucmF3KCk7XG5cblx0XHQvLyBodHRwLnJlcXVlc3Qgb25seSBzdXBwb3J0IHN0cmluZyBhcyBob3N0IGhlYWRlciwgdGhpcyBoYWNrIG1ha2UgY3VzdG9tIGhvc3QgaGVhZGVyIHBvc3NpYmxlXG5cdFx0aWYgKG9wdGlvbnMuaGVhZGVycy5ob3N0KSB7XG5cdFx0XHRvcHRpb25zLmhlYWRlcnMuaG9zdCA9IG9wdGlvbnMuaGVhZGVycy5ob3N0WzBdO1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgcmVxdWVzdFxuXHRcdHZhciByZXEgPSBzZW5kKG9wdGlvbnMpO1xuXHRcdHZhciByZXFUaW1lb3V0O1xuXG5cdFx0aWYgKG9wdGlvbnMudGltZW91dCkge1xuXHRcdFx0cmVxLm9uY2UoJ3NvY2tldCcsIGZ1bmN0aW9uKHNvY2tldCkge1xuXHRcdFx0XHRyZXFUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXEuYWJvcnQoKTtcblx0XHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ25ldHdvcmsgdGltZW91dCBhdDogJyArIG9wdGlvbnMudXJsLCAncmVxdWVzdC10aW1lb3V0JykpO1xuXHRcdFx0XHR9LCBvcHRpb25zLnRpbWVvdXQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmVxLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdyZXF1ZXN0IHRvICcgKyBvcHRpb25zLnVybCArICcgZmFpbGVkLCByZWFzb246ICcgKyBlcnIubWVzc2FnZSwgJ3N5c3RlbScsIGVycikpO1xuXHRcdH0pO1xuXG5cdFx0cmVxLm9uKCdyZXNwb25zZScsIGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlcVRpbWVvdXQpO1xuXG5cdFx0XHQvLyBoYW5kbGUgcmVkaXJlY3Rcblx0XHRcdGlmIChzZWxmLmlzUmVkaXJlY3QocmVzLnN0YXR1c0NvZGUpICYmIG9wdGlvbnMucmVkaXJlY3QgIT09ICdtYW51YWwnKSB7XG5cdFx0XHRcdGlmIChvcHRpb25zLnJlZGlyZWN0ID09PSAnZXJyb3InKSB7XG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdyZWRpcmVjdCBtb2RlIGlzIHNldCB0byBlcnJvcjogJyArIG9wdGlvbnMudXJsLCAnbm8tcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9wdGlvbnMuY291bnRlciA+PSBvcHRpb25zLmZvbGxvdykge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcignbWF4aW11bSByZWRpcmVjdCByZWFjaGVkIGF0OiAnICsgb3B0aW9ucy51cmwsICdtYXgtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFyZXMuaGVhZGVycy5sb2NhdGlvbikge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRmV0Y2hFcnJvcigncmVkaXJlY3QgbG9jYXRpb24gaGVhZGVyIG1pc3NpbmcgYXQ6ICcgKyBvcHRpb25zLnVybCwgJ2ludmFsaWQtcmVkaXJlY3QnKSk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcGVyIGZldGNoIHNwZWMsIGZvciBQT1NUIHJlcXVlc3Qgd2l0aCAzMDEvMzAyIHJlc3BvbnNlLCBvciBhbnkgcmVxdWVzdCB3aXRoIDMwMyByZXNwb25zZSwgdXNlIEdFVCB3aGVuIGZvbGxvd2luZyByZWRpcmVjdFxuXHRcdFx0XHRpZiAocmVzLnN0YXR1c0NvZGUgPT09IDMwM1xuXHRcdFx0XHRcdHx8ICgocmVzLnN0YXR1c0NvZGUgPT09IDMwMSB8fCByZXMuc3RhdHVzQ29kZSA9PT0gMzAyKSAmJiBvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG5cdFx0XHRcdFx0ZGVsZXRlIG9wdGlvbnMuYm9keTtcblx0XHRcdFx0XHRkZWxldGUgb3B0aW9ucy5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b3B0aW9ucy5jb3VudGVyKys7XG5cblx0XHRcdFx0cmVzb2x2ZShGZXRjaChyZXNvbHZlX3VybChvcHRpb25zLnVybCwgcmVzLmhlYWRlcnMubG9jYXRpb24pLCBvcHRpb25zKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gbm9ybWFsaXplIGxvY2F0aW9uIGhlYWRlciBmb3IgbWFudWFsIHJlZGlyZWN0IG1vZGVcblx0XHRcdHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMocmVzLmhlYWRlcnMpO1xuXHRcdFx0aWYgKG9wdGlvbnMucmVkaXJlY3QgPT09ICdtYW51YWwnICYmIGhlYWRlcnMuaGFzKCdsb2NhdGlvbicpKSB7XG5cdFx0XHRcdGhlYWRlcnMuc2V0KCdsb2NhdGlvbicsIHJlc29sdmVfdXJsKG9wdGlvbnMudXJsLCBoZWFkZXJzLmdldCgnbG9jYXRpb24nKSkpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwcmVwYXJlIHJlc3BvbnNlXG5cdFx0XHR2YXIgYm9keSA9IHJlcy5waXBlKG5ldyBzdHJlYW0uUGFzc1Rocm91Z2goKSk7XG5cdFx0XHR2YXIgcmVzcG9uc2Vfb3B0aW9ucyA9IHtcblx0XHRcdFx0dXJsOiBvcHRpb25zLnVybFxuXHRcdFx0XHQsIHN0YXR1czogcmVzLnN0YXR1c0NvZGVcblx0XHRcdFx0LCBzdGF0dXNUZXh0OiByZXMuc3RhdHVzTWVzc2FnZVxuXHRcdFx0XHQsIGhlYWRlcnM6IGhlYWRlcnNcblx0XHRcdFx0LCBzaXplOiBvcHRpb25zLnNpemVcblx0XHRcdFx0LCB0aW1lb3V0OiBvcHRpb25zLnRpbWVvdXRcblx0XHRcdH07XG5cblx0XHRcdC8vIHJlc3BvbnNlIG9iamVjdFxuXHRcdFx0dmFyIG91dHB1dDtcblxuXHRcdFx0Ly8gaW4gZm9sbG93aW5nIHNjZW5hcmlvcyB3ZSBpZ25vcmUgY29tcHJlc3Npb24gc3VwcG9ydFxuXHRcdFx0Ly8gMS4gY29tcHJlc3Npb24gc3VwcG9ydCBpcyBkaXNhYmxlZFxuXHRcdFx0Ly8gMi4gSEVBRCByZXF1ZXN0XG5cdFx0XHQvLyAzLiBubyBjb250ZW50LWVuY29kaW5nIGhlYWRlclxuXHRcdFx0Ly8gNC4gbm8gY29udGVudCByZXNwb25zZSAoMjA0KVxuXHRcdFx0Ly8gNS4gY29udGVudCBub3QgbW9kaWZpZWQgcmVzcG9uc2UgKDMwNClcblx0XHRcdGlmICghb3B0aW9ucy5jb21wcmVzcyB8fCBvcHRpb25zLm1ldGhvZCA9PT0gJ0hFQUQnIHx8ICFoZWFkZXJzLmhhcygnY29udGVudC1lbmNvZGluZycpIHx8IHJlcy5zdGF0dXNDb2RlID09PSAyMDQgfHwgcmVzLnN0YXR1c0NvZGUgPT09IDMwNCkge1xuXHRcdFx0XHRvdXRwdXQgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdHJlc29sdmUob3V0cHV0KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvdGhlcndpc2UsIGNoZWNrIGZvciBnemlwIG9yIGRlZmxhdGVcblx0XHRcdHZhciBuYW1lID0gaGVhZGVycy5nZXQoJ2NvbnRlbnQtZW5jb2RpbmcnKTtcblxuXHRcdFx0Ly8gZm9yIGd6aXBcblx0XHRcdGlmIChuYW1lID09ICdnemlwJyB8fCBuYW1lID09ICd4LWd6aXAnKSB7XG5cdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVHdW56aXAoKSk7XG5cdFx0XHRcdG91dHB1dCA9IG5ldyBSZXNwb25zZShib2R5LCByZXNwb25zZV9vcHRpb25zKTtcblx0XHRcdFx0cmVzb2x2ZShvdXRwdXQpO1xuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdC8vIGZvciBkZWZsYXRlXG5cdFx0XHR9IGVsc2UgaWYgKG5hbWUgPT0gJ2RlZmxhdGUnIHx8IG5hbWUgPT0gJ3gtZGVmbGF0ZScpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIHRoZSBpbmZhbW91cyByYXcgZGVmbGF0ZSByZXNwb25zZSBmcm9tIG9sZCBzZXJ2ZXJzXG5cdFx0XHRcdC8vIGEgaGFjayBmb3Igb2xkIElJUyBhbmQgQXBhY2hlIHNlcnZlcnNcblx0XHRcdFx0dmFyIHJhdyA9IHJlcy5waXBlKG5ldyBzdHJlYW0uUGFzc1Rocm91Z2goKSk7XG5cdFx0XHRcdHJhdy5vbmNlKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcblx0XHRcdFx0XHQvLyBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNzUxOTgyOFxuXHRcdFx0XHRcdGlmICgoY2h1bmtbMF0gJiAweDBGKSA9PT0gMHgwOCkge1xuXHRcdFx0XHRcdFx0Ym9keSA9IGJvZHkucGlwZSh6bGliLmNyZWF0ZUluZmxhdGUoKSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJvZHkgPSBib2R5LnBpcGUoemxpYi5jcmVhdGVJbmZsYXRlUmF3KCkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvdXRwdXQgPSBuZXcgUmVzcG9uc2UoYm9keSwgcmVzcG9uc2Vfb3B0aW9ucyk7XG5cdFx0XHRcdFx0cmVzb2x2ZShvdXRwdXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvdGhlcndpc2UsIHVzZSByZXNwb25zZSBhcy1pc1xuXHRcdFx0b3V0cHV0ID0gbmV3IFJlc3BvbnNlKGJvZHksIHJlc3BvbnNlX29wdGlvbnMpO1xuXHRcdFx0cmVzb2x2ZShvdXRwdXQpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH0pO1xuXG5cdFx0Ly8gYWNjZXB0IHN0cmluZywgYnVmZmVyIG9yIHJlYWRhYmxlIHN0cmVhbSBhcyBib2R5XG5cdFx0Ly8gcGVyIHNwZWMgd2Ugd2lsbCBjYWxsIHRvc3RyaW5nIG9uIG5vbi1zdHJlYW0gb2JqZWN0c1xuXHRcdGlmICh0eXBlb2Ygb3B0aW9ucy5ib2R5ID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmVxLndyaXRlKG9wdGlvbnMuYm9keSk7XG5cdFx0XHRyZXEuZW5kKCk7XG5cdFx0fSBlbHNlIGlmIChvcHRpb25zLmJvZHkgaW5zdGFuY2VvZiBCdWZmZXIpIHtcblx0XHRcdHJlcS53cml0ZShvcHRpb25zLmJvZHkpO1xuXHRcdFx0cmVxLmVuZCgpXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5ib2R5ID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLmJvZHkucGlwZSkge1xuXHRcdFx0b3B0aW9ucy5ib2R5LnBpcGUocmVxKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmJvZHkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRyZXEud3JpdGUob3B0aW9ucy5ib2R5LnRvU3RyaW5nKCkpO1xuXHRcdFx0cmVxLmVuZCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXEuZW5kKCk7XG5cdFx0fVxuXHR9KTtcblxufTtcblxuLyoqXG4gKiBSZWRpcmVjdCBjb2RlIG1hdGNoaW5nXG4gKlxuICogQHBhcmFtICAgTnVtYmVyICAgY29kZSAgU3RhdHVzIGNvZGVcbiAqIEByZXR1cm4gIEJvb2xlYW5cbiAqL1xuRmV0Y2gucHJvdG90eXBlLmlzUmVkaXJlY3QgPSBmdW5jdGlvbihjb2RlKSB7XG5cdHJldHVybiBjb2RlID09PSAzMDEgfHwgY29kZSA9PT0gMzAyIHx8IGNvZGUgPT09IDMwMyB8fCBjb2RlID09PSAzMDcgfHwgY29kZSA9PT0gMzA4O1xufVxuXG4vLyBleHBvc2UgUHJvbWlzZVxuRmV0Y2guUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuRmV0Y2guUmVzcG9uc2UgPSBSZXNwb25zZTtcbkZldGNoLkhlYWRlcnMgPSBIZWFkZXJzO1xuRmV0Y2guUmVxdWVzdCA9IFJlcXVlc3Q7XG4iLCJcbi8qKlxuICogYm9keS5qc1xuICpcbiAqIEJvZHkgaW50ZXJmYWNlIHByb3ZpZGVzIGNvbW1vbiBtZXRob2RzIGZvciBSZXF1ZXN0IGFuZCBSZXNwb25zZVxuICovXG5cbnZhciBjb252ZXJ0ID0gcmVxdWlyZSgnZW5jb2RpbmcnKS5jb252ZXJ0O1xudmFyIGJvZHlTdHJlYW0gPSByZXF1aXJlKCdpcy1zdHJlYW0nKTtcbnZhciBQYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ3N0cmVhbScpLlBhc3NUaHJvdWdoO1xudmFyIEZldGNoRXJyb3IgPSByZXF1aXJlKCcuL2ZldGNoLWVycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQm9keTtcblxuLyoqXG4gKiBCb2R5IGNsYXNzXG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5mdW5jdGlvbiBCb2R5KGJvZHksIG9wdHMpIHtcblxuXHRvcHRzID0gb3B0cyB8fCB7fTtcblxuXHR0aGlzLmJvZHkgPSBib2R5O1xuXHR0aGlzLmJvZHlVc2VkID0gZmFsc2U7XG5cdHRoaXMuc2l6ZSA9IG9wdHMuc2l6ZSB8fCAwO1xuXHR0aGlzLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQgfHwgMDtcblx0dGhpcy5fcmF3ID0gW107XG5cdHRoaXMuX2Fib3J0ID0gZmFsc2U7XG5cbn1cblxuLyoqXG4gKiBEZWNvZGUgcmVzcG9uc2UgYXMganNvblxuICpcbiAqIEByZXR1cm4gIFByb21pc2VcbiAqL1xuQm9keS5wcm90b3R5cGUuanNvbiA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIGZvciAyMDQgTm8gQ29udGVudCByZXNwb25zZSwgYnVmZmVyIHdpbGwgYmUgZW1wdHksIHBhcnNpbmcgaXQgd2lsbCB0aHJvdyBlcnJvclxuXHRpZiAodGhpcy5zdGF0dXMgPT09IDIwNCkge1xuXHRcdHJldHVybiBCb2R5LlByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5fZGVjb2RlKCkudGhlbihmdW5jdGlvbihidWZmZXIpIHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShidWZmZXIudG9TdHJpbmcoKSk7XG5cdH0pO1xuXG59O1xuXG4vKipcbiAqIERlY29kZSByZXNwb25zZSBhcyB0ZXh0XG4gKlxuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5Cb2R5LnByb3RvdHlwZS50ZXh0ID0gZnVuY3Rpb24oKSB7XG5cblx0cmV0dXJuIHRoaXMuX2RlY29kZSgpLnRoZW4oZnVuY3Rpb24oYnVmZmVyKSB7XG5cdFx0cmV0dXJuIGJ1ZmZlci50b1N0cmluZygpO1xuXHR9KTtcblxufTtcblxuLyoqXG4gKiBEZWNvZGUgcmVzcG9uc2UgYXMgYnVmZmVyIChub24tc3BlYyBhcGkpXG4gKlxuICogQHJldHVybiAgUHJvbWlzZVxuICovXG5Cb2R5LnByb3RvdHlwZS5idWZmZXIgPSBmdW5jdGlvbigpIHtcblxuXHRyZXR1cm4gdGhpcy5fZGVjb2RlKCk7XG5cbn07XG5cbi8qKlxuICogRGVjb2RlIGJ1ZmZlcnMgaW50byB1dGYtOCBzdHJpbmdcbiAqXG4gKiBAcmV0dXJuICBQcm9taXNlXG4gKi9cbkJvZHkucHJvdG90eXBlLl9kZWNvZGUgPSBmdW5jdGlvbigpIHtcblxuXHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0aWYgKHRoaXMuYm9keVVzZWQpIHtcblx0XHRyZXR1cm4gQm9keS5Qcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2JvZHkgdXNlZCBhbHJlYWR5IGZvcjogJyArIHRoaXMudXJsKSk7XG5cdH1cblxuXHR0aGlzLmJvZHlVc2VkID0gdHJ1ZTtcblx0dGhpcy5fYnl0ZXMgPSAwO1xuXHR0aGlzLl9hYm9ydCA9IGZhbHNlO1xuXHR0aGlzLl9yYXcgPSBbXTtcblxuXHRyZXR1cm4gbmV3IEJvZHkuUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblx0XHR2YXIgcmVzVGltZW91dDtcblxuXHRcdC8vIGJvZHkgaXMgc3RyaW5nXG5cdFx0aWYgKHR5cGVvZiBzZWxmLmJvZHkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRzZWxmLl9ieXRlcyA9IHNlbGYuYm9keS5sZW5ndGg7XG5cdFx0XHRzZWxmLl9yYXcgPSBbbmV3IEJ1ZmZlcihzZWxmLmJvZHkpXTtcblx0XHRcdHJldHVybiByZXNvbHZlKHNlbGYuX2NvbnZlcnQoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gYm9keSBpcyBidWZmZXJcblx0XHRpZiAoc2VsZi5ib2R5IGluc3RhbmNlb2YgQnVmZmVyKSB7XG5cdFx0XHRzZWxmLl9ieXRlcyA9IHNlbGYuYm9keS5sZW5ndGg7XG5cdFx0XHRzZWxmLl9yYXcgPSBbc2VsZi5ib2R5XTtcblx0XHRcdHJldHVybiByZXNvbHZlKHNlbGYuX2NvbnZlcnQoKSk7XG5cdFx0fVxuXG5cdFx0Ly8gYWxsb3cgdGltZW91dCBvbiBzbG93IHJlc3BvbnNlIGJvZHlcblx0XHRpZiAoc2VsZi50aW1lb3V0KSB7XG5cdFx0XHRyZXNUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5fYWJvcnQgPSB0cnVlO1xuXHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ3Jlc3BvbnNlIHRpbWVvdXQgYXQgJyArIHNlbGYudXJsICsgJyBvdmVyIGxpbWl0OiAnICsgc2VsZi50aW1lb3V0LCAnYm9keS10aW1lb3V0JykpO1xuXHRcdFx0fSwgc2VsZi50aW1lb3V0KTtcblx0XHR9XG5cblx0XHQvLyBoYW5kbGUgc3RyZWFtIGVycm9yLCBzdWNoIGFzIGluY29ycmVjdCBjb250ZW50LWVuY29kaW5nXG5cdFx0c2VsZi5ib2R5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuXHRcdFx0cmVqZWN0KG5ldyBGZXRjaEVycm9yKCdpbnZhbGlkIHJlc3BvbnNlIGJvZHkgYXQ6ICcgKyBzZWxmLnVybCArICcgcmVhc29uOiAnICsgZXJyLm1lc3NhZ2UsICdzeXN0ZW0nLCBlcnIpKTtcblx0XHR9KTtcblxuXHRcdC8vIGJvZHkgaXMgc3RyZWFtXG5cdFx0c2VsZi5ib2R5Lm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcblx0XHRcdGlmIChzZWxmLl9hYm9ydCB8fCBjaHVuayA9PT0gbnVsbCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZWxmLnNpemUgJiYgc2VsZi5fYnl0ZXMgKyBjaHVuay5sZW5ndGggPiBzZWxmLnNpemUpIHtcblx0XHRcdFx0c2VsZi5fYWJvcnQgPSB0cnVlO1xuXHRcdFx0XHRyZWplY3QobmV3IEZldGNoRXJyb3IoJ2NvbnRlbnQgc2l6ZSBhdCAnICsgc2VsZi51cmwgKyAnIG92ZXIgbGltaXQ6ICcgKyBzZWxmLnNpemUsICdtYXgtc2l6ZScpKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxmLl9ieXRlcyArPSBjaHVuay5sZW5ndGg7XG5cdFx0XHRzZWxmLl9yYXcucHVzaChjaHVuayk7XG5cdFx0fSk7XG5cblx0XHRzZWxmLmJvZHkub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHNlbGYuX2Fib3J0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Y2xlYXJUaW1lb3V0KHJlc1RpbWVvdXQpO1xuXHRcdFx0cmVzb2x2ZShzZWxmLl9jb252ZXJ0KCkpO1xuXHRcdH0pO1xuXHR9KTtcblxufTtcblxuLyoqXG4gKiBEZXRlY3QgYnVmZmVyIGVuY29kaW5nIGFuZCBjb252ZXJ0IHRvIHRhcmdldCBlbmNvZGluZ1xuICogcmVmOiBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1dELWh0bWw1LTIwMTEwMTEzL3BhcnNpbmcuaHRtbCNkZXRlcm1pbmluZy10aGUtY2hhcmFjdGVyLWVuY29kaW5nXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICBlbmNvZGluZyAgVGFyZ2V0IGVuY29kaW5nXG4gKiBAcmV0dXJuICBTdHJpbmdcbiAqL1xuQm9keS5wcm90b3R5cGUuX2NvbnZlcnQgPSBmdW5jdGlvbihlbmNvZGluZykge1xuXG5cdGVuY29kaW5nID0gZW5jb2RpbmcgfHwgJ3V0Zi04JztcblxuXHR2YXIgY3QgPSB0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcblx0dmFyIGNoYXJzZXQgPSAndXRmLTgnO1xuXHR2YXIgcmVzLCBzdHI7XG5cblx0Ly8gaGVhZGVyXG5cdGlmIChjdCkge1xuXHRcdC8vIHNraXAgZW5jb2RpbmcgZGV0ZWN0aW9uIGFsdG9nZXRoZXIgaWYgbm90IGh0bWwveG1sL3BsYWluIHRleHRcblx0XHRpZiAoIS90ZXh0XFwvaHRtbHx0ZXh0XFwvcGxhaW58XFwreG1sfFxcL3htbC9pLnRlc3QoY3QpKSB7XG5cdFx0XHRyZXR1cm4gQnVmZmVyLmNvbmNhdCh0aGlzLl9yYXcpO1xuXHRcdH1cblxuXHRcdHJlcyA9IC9jaGFyc2V0PShbXjtdKikvaS5leGVjKGN0KTtcblx0fVxuXG5cdC8vIG5vIGNoYXJzZXQgaW4gY29udGVudCB0eXBlLCBwZWVrIGF0IHJlc3BvbnNlIGJvZHkgZm9yIGF0IG1vc3QgMTAyNCBieXRlc1xuXHRpZiAoIXJlcyAmJiB0aGlzLl9yYXcubGVuZ3RoID4gMCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcmF3Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzdHIgKz0gdGhpcy5fcmF3W2ldLnRvU3RyaW5nKClcblx0XHRcdGlmIChzdHIubGVuZ3RoID4gMTAyNCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0c3RyID0gc3RyLnN1YnN0cigwLCAxMDI0KTtcblx0fVxuXG5cdC8vIGh0bWw1XG5cdGlmICghcmVzICYmIHN0cikge1xuXHRcdHJlcyA9IC88bWV0YS4rP2NoYXJzZXQ9KFsnXCJdKSguKz8pXFwxL2kuZXhlYyhzdHIpO1xuXHR9XG5cblx0Ly8gaHRtbDRcblx0aWYgKCFyZXMgJiYgc3RyKSB7XG5cdFx0cmVzID0gLzxtZXRhW1xcc10rP2h0dHAtZXF1aXY9KFsnXCJdKWNvbnRlbnQtdHlwZVxcMVtcXHNdKz9jb250ZW50PShbJ1wiXSkoLis/KVxcMi9pLmV4ZWMoc3RyKTtcblxuXHRcdGlmIChyZXMpIHtcblx0XHRcdHJlcyA9IC9jaGFyc2V0PSguKikvaS5leGVjKHJlcy5wb3AoKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8geG1sXG5cdGlmICghcmVzICYmIHN0cikge1xuXHRcdHJlcyA9IC88XFw/eG1sLis/ZW5jb2Rpbmc9KFsnXCJdKSguKz8pXFwxL2kuZXhlYyhzdHIpO1xuXHR9XG5cblx0Ly8gZm91bmQgY2hhcnNldFxuXHRpZiAocmVzKSB7XG5cdFx0Y2hhcnNldCA9IHJlcy5wb3AoKTtcblxuXHRcdC8vIHByZXZlbnQgZGVjb2RlIGlzc3VlcyB3aGVuIHNpdGVzIHVzZSBpbmNvcnJlY3QgZW5jb2Rpbmdcblx0XHQvLyByZWY6IGh0dHBzOi8vaHNpdm9uZW4uZmkvZW5jb2RpbmctbWVudS9cblx0XHRpZiAoY2hhcnNldCA9PT0gJ2diMjMxMicgfHwgY2hhcnNldCA9PT0gJ2diaycpIHtcblx0XHRcdGNoYXJzZXQgPSAnZ2IxODAzMCc7XG5cdFx0fVxuXHR9XG5cblx0Ly8gdHVybiByYXcgYnVmZmVycyBpbnRvIGEgc2luZ2xlIHV0Zi04IGJ1ZmZlclxuXHRyZXR1cm4gY29udmVydChcblx0XHRCdWZmZXIuY29uY2F0KHRoaXMuX3Jhdylcblx0XHQsIGVuY29kaW5nXG5cdFx0LCBjaGFyc2V0XG5cdCk7XG5cbn07XG5cbi8qKlxuICogQ2xvbmUgYm9keSBnaXZlbiBSZXMvUmVxIGluc3RhbmNlXG4gKlxuICogQHBhcmFtICAgTWl4ZWQgIGluc3RhbmNlICBSZXNwb25zZSBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcmV0dXJuICBNaXhlZFxuICovXG5Cb2R5LnByb3RvdHlwZS5fY2xvbmUgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuXHR2YXIgcDEsIHAyO1xuXHR2YXIgYm9keSA9IGluc3RhbmNlLmJvZHk7XG5cblx0Ly8gZG9uJ3QgYWxsb3cgY2xvbmluZyBhIHVzZWQgYm9keVxuXHRpZiAoaW5zdGFuY2UuYm9keVVzZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBjbG9uZSBib2R5IGFmdGVyIGl0IGlzIHVzZWQnKTtcblx0fVxuXG5cdC8vIGNoZWNrIHRoYXQgYm9keSBpcyBhIHN0cmVhbSBhbmQgbm90IGZvcm0tZGF0YSBvYmplY3Rcblx0Ly8gbm90ZTogd2UgY2FuJ3QgY2xvbmUgdGhlIGZvcm0tZGF0YSBvYmplY3Qgd2l0aG91dCBoYXZpbmcgaXQgYXMgYSBkZXBlbmRlbmN5XG5cdGlmIChib2R5U3RyZWFtKGJvZHkpICYmIHR5cGVvZiBib2R5LmdldEJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gdGVlIGluc3RhbmNlIGJvZHlcblx0XHRwMSA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuXHRcdHAyID0gbmV3IFBhc3NUaHJvdWdoKCk7XG5cdFx0Ym9keS5waXBlKHAxKTtcblx0XHRib2R5LnBpcGUocDIpO1xuXHRcdC8vIHNldCBpbnN0YW5jZSBib2R5IHRvIHRlZWQgYm9keSBhbmQgcmV0dXJuIHRoZSBvdGhlciB0ZWVkIGJvZHlcblx0XHRpbnN0YW5jZS5ib2R5ID0gcDE7XG5cdFx0Ym9keSA9IHAyO1xuXHR9XG5cblx0cmV0dXJuIGJvZHk7XG59XG5cbi8vIGV4cG9zZSBQcm9taXNlXG5Cb2R5LlByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbiIsIlxuLyoqXG4gKiBmZXRjaC1lcnJvci5qc1xuICpcbiAqIEZldGNoRXJyb3IgaW50ZXJmYWNlIGZvciBvcGVyYXRpb25hbCBlcnJvcnNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZldGNoRXJyb3I7XG5cbi8qKlxuICogQ3JlYXRlIEZldGNoRXJyb3IgaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBtZXNzYWdlICAgICAgRXJyb3IgbWVzc2FnZSBmb3IgaHVtYW5cbiAqIEBwYXJhbSAgIFN0cmluZyAgICAgIHR5cGUgICAgICAgICBFcnJvciB0eXBlIGZvciBtYWNoaW5lXG4gKiBAcGFyYW0gICBTdHJpbmcgICAgICBzeXN0ZW1FcnJvciAgRm9yIE5vZGUuanMgc3lzdGVtIGVycm9yXG4gKiBAcmV0dXJuICBGZXRjaEVycm9yXG4gKi9cbmZ1bmN0aW9uIEZldGNoRXJyb3IobWVzc2FnZSwgdHlwZSwgc3lzdGVtRXJyb3IpIHtcblxuXHQvLyBoaWRlIGN1c3RvbSBlcnJvciBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIGZyb20gZW5kLXVzZXJzXG5cdEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG5cdHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHQvLyB3aGVuIGVyci50eXBlIGlzIGBzeXN0ZW1gLCBlcnIuY29kZSBjb250YWlucyBzeXN0ZW0gZXJyb3IgY29kZVxuXHRpZiAoc3lzdGVtRXJyb3IpIHtcblx0XHR0aGlzLmNvZGUgPSB0aGlzLmVycm5vID0gc3lzdGVtRXJyb3IuY29kZTtcblx0fVxuXG59XG5cbnJlcXVpcmUoJ3V0aWwnKS5pbmhlcml0cyhGZXRjaEVycm9yLCBFcnJvcik7XG4iLCJcbi8qKlxuICogaGVhZGVycy5qc1xuICpcbiAqIEhlYWRlcnMgY2xhc3Mgb2ZmZXJzIGNvbnZlbmllbnQgaGVscGVyc1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZGVycztcblxuLyoqXG4gKiBIZWFkZXJzIGNsYXNzXG4gKlxuICogQHBhcmFtICAgT2JqZWN0ICBoZWFkZXJzICBSZXNwb25zZSBoZWFkZXJzXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbmZ1bmN0aW9uIEhlYWRlcnMoaGVhZGVycykge1xuXG5cdHZhciBzZWxmID0gdGhpcztcblx0dGhpcy5faGVhZGVycyA9IHt9O1xuXG5cdC8vIEhlYWRlcnNcblx0aWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG5cdFx0aGVhZGVycyA9IGhlYWRlcnMucmF3KCk7XG5cdH1cblxuXHQvLyBwbGFpbiBvYmplY3Rcblx0Zm9yICh2YXIgcHJvcCBpbiBoZWFkZXJzKSB7XG5cdFx0aWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIGhlYWRlcnNbcHJvcF0gPT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aGlzLnNldChwcm9wLCBoZWFkZXJzW3Byb3BdKTtcblxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGhlYWRlcnNbcHJvcF0gPT09ICdudW1iZXInICYmICFpc05hTihoZWFkZXJzW3Byb3BdKSkge1xuXHRcdFx0dGhpcy5zZXQocHJvcCwgaGVhZGVyc1twcm9wXS50b1N0cmluZygpKTtcblxuXHRcdH0gZWxzZSBpZiAoaGVhZGVyc1twcm9wXSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRoZWFkZXJzW3Byb3BdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRzZWxmLmFwcGVuZChwcm9wLCBpdGVtLnRvU3RyaW5nKCkpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cbn1cblxuLyoqXG4gKiBSZXR1cm4gZmlyc3QgaGVhZGVyIHZhbHVlIGdpdmVuIG5hbWVcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgIEhlYWRlciBuYW1lXG4gKiBAcmV0dXJuICBNaXhlZFxuICovXG5IZWFkZXJzLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG5cdHZhciBsaXN0ID0gdGhpcy5faGVhZGVyc1tuYW1lLnRvTG93ZXJDYXNlKCldO1xuXHRyZXR1cm4gbGlzdCA/IGxpc3RbMF0gOiBudWxsO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYWxsIGhlYWRlciB2YWx1ZXMgZ2l2ZW4gbmFtZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgbmFtZSAgSGVhZGVyIG5hbWVcbiAqIEByZXR1cm4gIEFycmF5XG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0aWYgKCF0aGlzLmhhcyhuYW1lKSkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHJldHVybiB0aGlzLl9oZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbGwgaGVhZGVyc1xuICpcbiAqIEBwYXJhbSAgIEZ1bmN0aW9uICBjYWxsYmFjayAgRXhlY3V0ZWQgZm9yIGVhY2ggaXRlbSB3aXRoIHBhcmFtZXRlcnMgKHZhbHVlLCBuYW1lLCB0aGlzQXJnKVxuICogQHBhcmFtICAgQm9vbGVhbiAgIHRoaXNBcmcgICBgdGhpc2AgY29udGV4dCBmb3IgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm4gIFZvaWRcbiAqL1xuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX2hlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdHRoaXMuX2hlYWRlcnNbbmFtZV0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0Y2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcylcblx0XHR9LCB0aGlzKVxuXHR9LCB0aGlzKVxufVxuXG4vKipcbiAqIE92ZXJ3cml0ZSBoZWFkZXIgdmFsdWVzIGdpdmVuIG5hbWVcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgICBIZWFkZXIgbmFtZVxuICogQHBhcmFtICAgU3RyaW5nICB2YWx1ZSAgSGVhZGVyIHZhbHVlXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG5cdHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFt2YWx1ZV07XG59O1xuXG4vKipcbiAqIEFwcGVuZCBhIHZhbHVlIG9udG8gZXhpc3RpbmcgaGVhZGVyXG4gKlxuICogQHBhcmFtICAgU3RyaW5nICBuYW1lICAgSGVhZGVyIG5hbWVcbiAqIEBwYXJhbSAgIFN0cmluZyAgdmFsdWUgIEhlYWRlciB2YWx1ZVxuICogQHJldHVybiAgVm9pZFxuICovXG5IZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuXHRpZiAoIXRoaXMuaGFzKG5hbWUpKSB7XG5cdFx0dGhpcy5zZXQobmFtZSwgdmFsdWUpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXS5wdXNoKHZhbHVlKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgZm9yIGhlYWRlciBuYW1lIGV4aXN0ZW5jZVxuICpcbiAqIEBwYXJhbSAgIFN0cmluZyAgIG5hbWUgIEhlYWRlciBuYW1lXG4gKiBAcmV0dXJuICBCb29sZWFuXG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0cmV0dXJuIHRoaXMuX2hlYWRlcnMuaGFzT3duUHJvcGVydHkobmFtZS50b0xvd2VyQ2FzZSgpKTtcbn07XG5cbi8qKlxuICogRGVsZXRlIGFsbCBoZWFkZXIgdmFsdWVzIGdpdmVuIG5hbWVcbiAqXG4gKiBAcGFyYW0gICBTdHJpbmcgIG5hbWUgIEhlYWRlciBuYW1lXG4gKiBAcmV0dXJuICBWb2lkXG4gKi9cbkhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0ZGVsZXRlIHRoaXMuX2hlYWRlcnNbbmFtZS50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHJhdyBoZWFkZXJzIChub24tc3BlYyBhcGkpXG4gKlxuICogQHJldHVybiAgT2JqZWN0XG4gKi9cbkhlYWRlcnMucHJvdG90eXBlLnJhdyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5faGVhZGVycztcbn07XG4iLCJcbi8qKlxuICogcmVxdWVzdC5qc1xuICpcbiAqIFJlcXVlc3QgY2xhc3MgY29udGFpbnMgc2VydmVyIG9ubHkgb3B0aW9uc1xuICovXG5cbnZhciBwYXJzZV91cmwgPSByZXF1aXJlKCd1cmwnKS5wYXJzZTtcbnZhciBIZWFkZXJzID0gcmVxdWlyZSgnLi9oZWFkZXJzJyk7XG52YXIgQm9keSA9IHJlcXVpcmUoJy4vYm9keScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3Q7XG5cbi8qKlxuICogUmVxdWVzdCBjbGFzc1xuICpcbiAqIEBwYXJhbSAgIE1peGVkICAgaW5wdXQgIFVybCBvciBSZXF1ZXN0IGluc3RhbmNlXG4gKiBAcGFyYW0gICBPYmplY3QgIGluaXQgICBDdXN0b20gb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5mdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBpbml0KSB7XG5cdHZhciB1cmwsIHVybF9wYXJzZWQ7XG5cblx0Ly8gbm9ybWFsaXplIGlucHV0XG5cdGlmICghKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkpIHtcblx0XHR1cmwgPSBpbnB1dDtcblx0XHR1cmxfcGFyc2VkID0gcGFyc2VfdXJsKHVybCk7XG5cdFx0aW5wdXQgPSB7fTtcblx0fSBlbHNlIHtcblx0XHR1cmwgPSBpbnB1dC51cmw7XG5cdFx0dXJsX3BhcnNlZCA9IHBhcnNlX3VybCh1cmwpO1xuXHR9XG5cblx0Ly8gbm9ybWFsaXplIGluaXRcblx0aW5pdCA9IGluaXQgfHwge307XG5cblx0Ly8gZmV0Y2ggc3BlYyBvcHRpb25zXG5cdHRoaXMubWV0aG9kID0gaW5pdC5tZXRob2QgfHwgaW5wdXQubWV0aG9kIHx8ICdHRVQnO1xuXHR0aGlzLnJlZGlyZWN0ID0gaW5pdC5yZWRpcmVjdCB8fCBpbnB1dC5yZWRpcmVjdCB8fCAnZm9sbG93Jztcblx0dGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMoaW5pdC5oZWFkZXJzIHx8IGlucHV0LmhlYWRlcnMgfHwge30pO1xuXHR0aGlzLnVybCA9IHVybDtcblxuXHQvLyBzZXJ2ZXIgb25seSBvcHRpb25zXG5cdHRoaXMuZm9sbG93ID0gaW5pdC5mb2xsb3cgIT09IHVuZGVmaW5lZCA/XG5cdFx0aW5pdC5mb2xsb3cgOiBpbnB1dC5mb2xsb3cgIT09IHVuZGVmaW5lZCA/XG5cdFx0aW5wdXQuZm9sbG93IDogMjA7XG5cdHRoaXMuY29tcHJlc3MgPSBpbml0LmNvbXByZXNzICE9PSB1bmRlZmluZWQgP1xuXHRcdGluaXQuY29tcHJlc3MgOiBpbnB1dC5jb21wcmVzcyAhPT0gdW5kZWZpbmVkID9cblx0XHRpbnB1dC5jb21wcmVzcyA6IHRydWU7XG5cdHRoaXMuY291bnRlciA9IGluaXQuY291bnRlciB8fCBpbnB1dC5jb3VudGVyIHx8IDA7XG5cdHRoaXMuYWdlbnQgPSBpbml0LmFnZW50IHx8IGlucHV0LmFnZW50O1xuXG5cdEJvZHkuY2FsbCh0aGlzLCBpbml0LmJvZHkgfHwgdGhpcy5fY2xvbmUoaW5wdXQpLCB7XG5cdFx0dGltZW91dDogaW5pdC50aW1lb3V0IHx8IGlucHV0LnRpbWVvdXQgfHwgMCxcblx0XHRzaXplOiBpbml0LnNpemUgfHwgaW5wdXQuc2l6ZSB8fCAwXG5cdH0pO1xuXG5cdC8vIHNlcnZlciByZXF1ZXN0IG9wdGlvbnNcblx0dGhpcy5wcm90b2NvbCA9IHVybF9wYXJzZWQucHJvdG9jb2w7XG5cdHRoaXMuaG9zdG5hbWUgPSB1cmxfcGFyc2VkLmhvc3RuYW1lO1xuXHR0aGlzLnBvcnQgPSB1cmxfcGFyc2VkLnBvcnQ7XG5cdHRoaXMucGF0aCA9IHVybF9wYXJzZWQucGF0aDtcblx0dGhpcy5hdXRoID0gdXJsX3BhcnNlZC5hdXRoO1xufVxuXG5SZXF1ZXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQm9keS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIENsb25lIHRoaXMgcmVxdWVzdFxuICpcbiAqIEByZXR1cm4gIFJlcXVlc3RcbiAqL1xuUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBSZXF1ZXN0KHRoaXMpO1xufTtcbiIsIlxuLyoqXG4gKiByZXNwb25zZS5qc1xuICpcbiAqIFJlc3BvbnNlIGNsYXNzIHByb3ZpZGVzIGNvbnRlbnQgZGVjb2RpbmdcbiAqL1xuXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcbnZhciBIZWFkZXJzID0gcmVxdWlyZSgnLi9oZWFkZXJzJyk7XG52YXIgQm9keSA9IHJlcXVpcmUoJy4vYm9keScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIFJlc3BvbnNlIGNsYXNzXG4gKlxuICogQHBhcmFtICAgU3RyZWFtICBib2R5ICBSZWFkYWJsZSBzdHJlYW1cbiAqIEBwYXJhbSAgIE9iamVjdCAgb3B0cyAgUmVzcG9uc2Ugb3B0aW9uc1xuICogQHJldHVybiAgVm9pZFxuICovXG5mdW5jdGlvbiBSZXNwb25zZShib2R5LCBvcHRzKSB7XG5cblx0b3B0cyA9IG9wdHMgfHwge307XG5cblx0dGhpcy51cmwgPSBvcHRzLnVybDtcblx0dGhpcy5zdGF0dXMgPSBvcHRzLnN0YXR1cyB8fCAyMDA7XG5cdHRoaXMuc3RhdHVzVGV4dCA9IG9wdHMuc3RhdHVzVGV4dCB8fCBodHRwLlNUQVRVU19DT0RFU1t0aGlzLnN0YXR1c107XG5cdHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdHMuaGVhZGVycyk7XG5cdHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDA7XG5cblx0Qm9keS5jYWxsKHRoaXMsIGJvZHksIG9wdHMpO1xuXG59XG5cblJlc3BvbnNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQm9keS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIENsb25lIHRoaXMgcmVzcG9uc2VcbiAqXG4gKiBAcmV0dXJuICBSZXNwb25zZVxuICovXG5SZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9jbG9uZSh0aGlzKSwge1xuXHRcdHVybDogdGhpcy51cmxcblx0XHQsIHN0YXR1czogdGhpcy5zdGF0dXNcblx0XHQsIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dFxuXHRcdCwgaGVhZGVyczogdGhpcy5oZWFkZXJzXG5cdFx0LCBvazogdGhpcy5va1xuXHR9KTtcbn07XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cmljdFVyaUVuY29kZSA9IHJlcXVpcmUoJ3N0cmljdC11cmktZW5jb2RlJyk7XG52YXIgb2JqZWN0QXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG5mdW5jdGlvbiBlbmNvZGVyRm9yQXJyYXlGb3JtYXQob3B0cykge1xuXHRzd2l0Y2ggKG9wdHMuYXJyYXlGb3JtYXQpIHtcblx0XHRjYXNlICdpbmRleCc6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGluZGV4KSB7XG5cdFx0XHRcdHJldHVybiB2YWx1ZSA9PT0gbnVsbCA/IFtcblx0XHRcdFx0XHRlbmNvZGUoa2V5LCBvcHRzKSxcblx0XHRcdFx0XHQnWycsXG5cdFx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdFx0J10nXG5cdFx0XHRcdF0uam9pbignJykgOiBbXG5cdFx0XHRcdFx0ZW5jb2RlKGtleSwgb3B0cyksXG5cdFx0XHRcdFx0J1snLFxuXHRcdFx0XHRcdGVuY29kZShpbmRleCwgb3B0cyksXG5cdFx0XHRcdFx0J109Jyxcblx0XHRcdFx0XHRlbmNvZGUodmFsdWUsIG9wdHMpXG5cdFx0XHRcdF0uam9pbignJyk7XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnYnJhY2tldCc6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSBudWxsID8gZW5jb2RlKGtleSwgb3B0cykgOiBbXG5cdFx0XHRcdFx0ZW5jb2RlKGtleSwgb3B0cyksXG5cdFx0XHRcdFx0J1tdPScsXG5cdFx0XHRcdFx0ZW5jb2RlKHZhbHVlLCBvcHRzKVxuXHRcdFx0XHRdLmpvaW4oJycpO1xuXHRcdFx0fTtcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIHZhbHVlID09PSBudWxsID8gZW5jb2RlKGtleSwgb3B0cykgOiBbXG5cdFx0XHRcdFx0ZW5jb2RlKGtleSwgb3B0cyksXG5cdFx0XHRcdFx0Jz0nLFxuXHRcdFx0XHRcdGVuY29kZSh2YWx1ZSwgb3B0cylcblx0XHRcdFx0XS5qb2luKCcnKTtcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0cykge1xuXHR2YXIgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0cy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpIHtcblx0XHRcdFx0cmVzdWx0ID0gL1xcWyhcXGQqKV0kLy5leGVjKGtleSk7XG5cblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW1xcZCpdJC8sICcnKTtcblxuXHRcdFx0XHRpZiAoIXJlc3VsdCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHt9O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XVtyZXN1bHRbMV1dID0gdmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnYnJhY2tldCc6XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSB7XG5cdFx0XHRcdHJlc3VsdCA9IC8oXFxbXSkkLy5leGVjKGtleSk7XG5cblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoL1xcW10kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0IHx8IGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW10uY29uY2F0KGFjY3VtdWxhdG9yW2tleV0sIHZhbHVlKTtcblx0XHRcdH07XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikge1xuXHRcdFx0XHRpZiAoYWNjdW11bGF0b3Jba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSBbXS5jb25jYXQoYWNjdW11bGF0b3Jba2V5XSwgdmFsdWUpO1xuXHRcdFx0fTtcblx0fVxufVxuXG5mdW5jdGlvbiBlbmNvZGUodmFsdWUsIG9wdHMpIHtcblx0aWYgKG9wdHMuZW5jb2RlKSB7XG5cdFx0cmV0dXJuIG9wdHMuc3RyaWN0ID8gc3RyaWN0VXJpRW5jb2RlKHZhbHVlKSA6IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleXNTb3J0ZXIoaW5wdXQpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0LnNvcnQoKTtcblx0fSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGtleXNTb3J0ZXIoT2JqZWN0LmtleXMoaW5wdXQpKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKGEpIC0gTnVtYmVyKGIpO1xuXHRcdH0pLm1hcChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRyZXR1cm4gaW5wdXRba2V5XTtcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiBpbnB1dDtcbn1cblxuZXhwb3J0cy5leHRyYWN0ID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gc3RyLnNwbGl0KCc/JylbMV0gfHwgJyc7XG59O1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHN0ciwgb3B0cykge1xuXHRvcHRzID0gb2JqZWN0QXNzaWduKHthcnJheUZvcm1hdDogJ25vbmUnfSwgb3B0cyk7XG5cblx0dmFyIGZvcm1hdHRlciA9IHBhcnNlckZvckFycmF5Rm9ybWF0KG9wdHMpO1xuXG5cdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2l0aCBubyBwcm90b3R5cGVcblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9xdWVyeS1zdHJpbmcvaXNzdWVzLzQ3XG5cdHZhciByZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoL14oXFw/fCN8JikvLCAnJyk7XG5cblx0aWYgKCFzdHIpIHtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0c3RyLnNwbGl0KCcmJykuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcblx0XHR2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKS5zcGxpdCgnPScpO1xuXHRcdC8vIEZpcmVmb3ggKHByZSA0MCkgZGVjb2RlcyBgJTNEYCB0byBgPWBcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9wdWxsLzM3XG5cdFx0dmFyIGtleSA9IHBhcnRzLnNoaWZ0KCk7XG5cdFx0dmFyIHZhbCA9IHBhcnRzLmxlbmd0aCA+IDAgPyBwYXJ0cy5qb2luKCc9JykgOiB1bmRlZmluZWQ7XG5cblx0XHQvLyBtaXNzaW5nIGA9YCBzaG91bGQgYmUgYG51bGxgOlxuXHRcdC8vIGh0dHA6Ly93My5vcmcvVFIvMjAxMi9XRC11cmwtMjAxMjA1MjQvI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcblx0XHR2YWwgPSB2YWwgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcblxuXHRcdGZvcm1hdHRlcihkZWNvZGVVUklDb21wb25lbnQoa2V5KSwgdmFsLCByZXQpO1xuXHR9KTtcblxuXHRyZXR1cm4gT2JqZWN0LmtleXMocmV0KS5zb3J0KCkucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGtleSkge1xuXHRcdHZhciB2YWwgPSByZXRba2V5XTtcblx0XHRpZiAoQm9vbGVhbih2YWwpICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbCkpIHtcblx0XHRcdC8vIFNvcnQgb2JqZWN0IGtleXMsIG5vdCB2YWx1ZXNcblx0XHRcdHJlc3VsdFtrZXldID0ga2V5c1NvcnRlcih2YWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRba2V5XSA9IHZhbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LCBPYmplY3QuY3JlYXRlKG51bGwpKTtcbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG9iaiwgb3B0cykge1xuXHR2YXIgZGVmYXVsdHMgPSB7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnXG5cdH07XG5cblx0b3B0cyA9IG9iamVjdEFzc2lnbihkZWZhdWx0cywgb3B0cyk7XG5cblx0dmFyIGZvcm1hdHRlciA9IGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRzKTtcblxuXHRyZXR1cm4gb2JqID8gT2JqZWN0LmtleXMob2JqKS5zb3J0KCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcblx0XHR2YXIgdmFsID0gb2JqW2tleV07XG5cblx0XHRpZiAodmFsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiAnJztcblx0XHR9XG5cblx0XHRpZiAodmFsID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0cyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IFtdO1xuXG5cdFx0XHR2YWwuc2xpY2UoKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwyKSB7XG5cdFx0XHRcdGlmICh2YWwyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHQucHVzaChmb3JtYXR0ZXIoa2V5LCB2YWwyLCByZXN1bHQubGVuZ3RoKSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHJlc3VsdC5qb2luKCcmJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdHMpICsgJz0nICsgZW5jb2RlKHZhbCwgb3B0cyk7XG5cdH0pLmZpbHRlcihmdW5jdGlvbiAoeCkge1xuXHRcdHJldHVybiB4Lmxlbmd0aCA+IDA7XG5cdH0pLmpvaW4oJyYnKSA6ICcnO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuXHRyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cikucmVwbGFjZSgvWyEnKCkqXS9nLCBmdW5jdGlvbiAoYykge1xuXHRcdHJldHVybiAnJScgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufTtcbiIsImltcG9ydCB7UHJvbWlzZX0gZnJvbSAnZXM2LXByb21pc2UnO1xuaW1wb3J0IHtmZXRjaFJlcXVlc3R9IGZyb20gJy4vcHJpdmF0ZS9mZXRjaFJlcXVlc3QuanMnO1xuXG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnbG9kYXNoL2lzT2JqZWN0JztcblxuLyoqXG4gKiBGZXRjaGVzIGFuIGFycmF5IG9mIGRhdGFzb3VyY2VzIGZyb20gUEMuXG4gKiBAbW9kdWxlIGRhdGFTb3VyY2VzXG4gKi9cbmNsYXNzIGRhdGFTb3VyY2VzIGV4dGVuZHMgZmV0Y2hSZXF1ZXN0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgdXNlcjogXCJwYzJwYXRod2F5c1wiXG4gICAgfSk7XG4gICAgdGhpcy5jb21tYW5kID0gXCJtZXRhZGF0YS9kYXRhc291cmNlc1wiO1xuICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZldGNoKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAqIFB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWdldCBkYXRhIHNvdXJjZXMuXG4gICogQGZ1bmN0aW9uIC0gZmV0Y2hcbiAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHN1cGVyLmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgICByZXNwb25zZVxuICAgICAgICAgIC5maWx0ZXIoc291cmNlID0+IHNvdXJjZS5ub3RQYXRod2F5RGF0YSA9PSBmYWxzZSlcbiAgICAgICAgICAubWFwKChkcykgPT4ge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAoZHMubmFtZS5sZW5ndGggPiAxKSA/IGRzLm5hbWVbMV0gOiBkcy5uYW1lWzBdO1xuICAgICAgICAgICAgb3V0cHV0W2RzLnVyaV0gPSB7XG4gICAgICAgICAgICAgIGlkOiBkcy5pZGVudGlmaWVyLFxuICAgICAgICAgICAgICB1cmk6IGRzLnVyaSxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICB0eXBlOiBkcy50eXBlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRhdGEgPSBvdXRwdXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGEgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgKiBDYWxscyB0aGlzLmZldGNoIGlmIGNhY2hlIGlzIG5vdCBhdmFpbGFibGUgYW5kIHVzZXMgY2FjaGVkIGRhdGEgaWYgaXQgaXMuIFJldHVybnMgUHJvbWlzZSB3aXRoIGRhdGEgaW4gYm90aCBjYXNlcy4gTm90ZTogV2hpbGUgdGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBwcml2YXRlIHRoZXJlIGlzIG5vIHdheSBvZiBlbmZvcmNpbmcgaXQgdXNpbmcgRVM2IEpTLlxuICAqIEBwcml2YXRlXG4gICogQGZ1bmN0aW9uIC0gX3Byb21pc2lmeURhdGFcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgKi9cbiAgX3Byb21pc2lmeURhdGEoKSB7XG4gICAgaWYgKHRoaXMuZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLmRhdGEpXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmV0Y2goKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogUmV0dXJucyBhcnJheSBvZiBkYXRhIHNvdXJjZXMgZnJvbSBQQy4gQ2FjaGVzIGFycmF5IGZvciB1c2UgaW4gbGF0ZXIgY2FsbHMuXG4gICogQGZ1bmN0aW9uIC0gZ2V0XG4gICogQHJldHVybnMge1Byb21pc2U8YXJyYXk+fFByb21pc2U8Ym9vbGVhbj59IC0gUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZWl0aGVyIHRoZSBkYXRhIHNvdXJjZSBhcnJheSBvciBmYWxzZSBpZiBub3QgZGF0YSBzb3VyY2Ugbm90IGF2YWlsYWJsZVxuICAqL1xuICBnZXQoY2FsbGJhY2spIHtcbiAgICBpZiAoY2FsbGJhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fcHJvbWlzaWZ5RGF0YSgpLnRoZW4oKCkgPT4gY2FsbGJhY2sodGhpcy5kYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9wcm9taXNpZnlEYXRhKCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IGRhdGFTb3VyY2VzKCk7XG4iLCJpbXBvcnQge1Byb21pc2V9IGZyb20gJ2VzNi1wcm9taXNlJztcbmltcG9ydCB7ZmV0Y2hSZXF1ZXN0fSBmcm9tICcuL3ByaXZhdGUvZmV0Y2hSZXF1ZXN0LmpzJztcbmltcG9ydCB7X2J1aWxkVW5pcHJvdFVyaX0gZnJvbSAnLi9wcml2YXRlL2hlbHBlcnMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgR0VUIHdlYiBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKi9cbmNsYXNzIGdldCBleHRlbmRzIGZldGNoUmVxdWVzdCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBnZXQgYW5kIHNldHMgcXVlcnkgb2JqZWN0IGlmIG9uZSBpcyBwcm92aWRlZC4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtvYmplY3R9IFtxdWVyeU9iamVjdF0gLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IocXVlcnlPYmplY3QpIHtcbiAgICBzdXBlcihxdWVyeU9iamVjdCk7XG4gICAgdGhpcy5jb21tYW5kID0gXCJnZXRcIjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVyaSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBnZXQgcmVxdWVzdFxuICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnlPYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICByZXR1cm4gc3VwZXIucXVlcnkocXVlcnlPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHVyaSh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoXCJ1cmlcIiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB1c2luZyB0aGUgdW5pcHJvdCBJRFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1bmlwcm90KHVuaXByb3RJZCkge1xuICAgIHJldHVybiB0aGlzLnVyaShfYnVpbGRVbmlwcm90VXJpKHVuaXByb3RJZCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGdldCBhbmQgc2V0cyBxdWVyeSBvYmplY3QgaWYgb25lIGlzIHByb3ZpZGVkXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD58UHJvbWlzZTxib29sZWFuPn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqXG4gICAqL1xuICAvKiogSW5pdGlhbGlzZXMgZ2V0IGFuZCBzZXRzIHF1ZXJ5IG9iamVjdCBpZiBvbmUgaXMgcHJvdmlkZWRcbiAgICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IFtjYWxsYmFja10gLSBUZXJtaW5hdGluZyBjYWxsYmFjaywgc2VlIGJlbG93IGZvciBhcmd1bWVudHNcbiAgICogQHJldHVybiB7dGhpc31cbiAgICovXG4gIGZldGNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHN1cGVyLmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIGlmIChjYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWxsYmFjayBmb3IgZ2V0IGZ1bmN0aW9uLCB3aGljaCBpcyBhbHdheXMgY2FsbGVkIG9uIGNvbXBsZXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQGNhbGxiYWNrIGdldH5yZXF1ZXN0Q2FsbGJhY2tcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fGJvb2xlYW59IHJlc3BvbnNlIC0gUmVzcG9uc2UgdGV4dCBvciBvYmplY3QgcmV0dXJuZWQgZnJvbSBQQyBpZiBhdmFpbGFibGUuIE90aGVyd2lzZSBpZiBubyByZXNwb25zZSByZXR1cm5lZCwgcmV0dXJucyBmYWxzZS4gSWYgdGhlcmUgd2FzIGEgbmV0d29yayBmYWlsdXJlLCBudWxsIHJldHVybmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsIi8qKlxuICogQGZpbGVPdmVydmlldyBQYXRod2F5IENvbW1vbnMgQWNjZXNzIExpYnJhcnkgSW5kZXhcbiAqIEBhdXRob3IgTWFuZnJlZCBDaGV1bmdcbiAqIEB2ZXJzaW9uOiAwLjFcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0OiByZXF1aXJlKCcuL2dldC5qcycpLFxuXHRkYXRhU291cmNlczogcmVxdWlyZSgnLi9kYXRhU291cmNlcy5qcycpLFxuXHRsb2dvVXJsOiByZXF1aXJlKCcuL2xvZ29VcmwuanMnKSxcblx0c2VhcmNoOiByZXF1aXJlKCcuL3NlYXJjaC5qcycpLFxuXHR0cmF2ZXJzZTogcmVxdWlyZSgnLi90cmF2ZXJzZS5qcycpXG59O1xuIiwiLyoqXG4gKiBGZXRjaGVzIHRoZSBsb2dvIGZvciB0aGUgZGF0YXNvdXJjZSB1c2luZyBlaXRoZXIgZGF0YXNvdXJjZXMgVVJJIG9yIG5hbWUuIEludGVuZGVkIHRvIGJlIHVzZWQgdG8gZ2VuZXJhdGUgaW1hZ2UgdGFncy5cbiAqIEBtb2R1bGUgbG9nb1VybFxuICogQHBhcmFtIHtzdHJpbmd9IGxvZ29JZGVudGlmaWVyIC0gRWl0aGVyIFVSSSBvciBuYW1lIG9mIHRoZSBkYXRhIHNvdXJjZVxuICogQHJldHVybiB7c3RyaW5nfSBsb2dvVXJsIC0gVVJMIG9mIGRhdGFzb3VyY2UgaW4gcXVlc3Rpb24sIGVsc2UgZW1wdHkgc3RyaW5nXG4gKi9cbmNvbnN0IGxvZ29VcmwgPSAoZHNVcmlPck5hbWUpID0+IHtcblx0cmV0dXJuIHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgbG9nb1VybDtcbiIsImltcG9ydCB7UHJvbWlzZX0gZnJvbSAnZXM2LXByb21pc2UnO1xucmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xuXG5pbXBvcnQgaXNBcnJheSBmcm9tICdsb2Rhc2gvaXNBcnJheSc7XG5pbXBvcnQgaXNFbXB0eSBmcm9tICdsb2Rhc2gvaXNFbXB0eSc7XG5pbXBvcnQgaXNPYmplY3QgZnJvbSAnbG9kYXNoL2lzT2JqZWN0JztcbmltcG9ydCB7c3RyaW5naWZ5IGFzIHF1ZXJ5U3RyaW5naWZ5fSBmcm9tICdxdWVyeS1zdHJpbmcnO1xuXG5pbXBvcnQge19wYXJzZVVua25vd25TdHJpbmd9IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbmZldGNoLlByb21pc2UgPSBQcm9taXNlO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBCYXNlIGNsYXNzIGZvciB1c2UgaW4gZmV0Y2ggcmVxdWVzdHMsIG5vdCBpbnRlbmRlZCB0byBiZSB1c2VkIG9uIGl0cyBvd25cbiAqL1xuZXhwb3J0IGNsYXNzIGZldGNoUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5wY1VybCA9IFwiaHR0cDovL3d3dy5wYXRod2F5Y29tbW9ucy5vcmcvcGMyL1wiO1xuICAgIHRoaXMuY29tbWFuZCA9IFwiVE9fQkVfUkVQTEFDRURcIjtcbiAgICB0aGlzLnJlc3BvbnNlVGV4dCA9IFwiXCI7XG4gICAgdGhpcy5xdWVyeU9iamVjdCA9IHt9O1xuICAgIGlmIChxdWVyeU9iamVjdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0ID0gcXVlcnlPYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucXVlcnlPYmplY3QgPSBxdWVyeU9iamVjdDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwYXJhbWV0ZXIsIHZhbHVlKSB7XG4gICAgcGFyYW1ldGVyID0gU3RyaW5nKHBhcmFtZXRlcik7XG4gICAgaWYgKHBhcmFtZXRlciAhPT0gXCJcIikge1xuICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IChpc0FycmF5KHZhbHVlKSAmJiAhaXNFbXB0eSh2YWx1ZSkpKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlKHBhcmFtZXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5T2JqZWN0W3BhcmFtZXRlcl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGV0ZShwYXJhbWV0ZXIpIHtcbiAgICBkZWxldGUgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdO1xuICB9XG5cbiAgZmV0Y2goKSB7XG4gICAgdmFyIGZldGNoUHJvbWlzZSA9IGZldGNoKHRoaXMucGNVcmwgKyB0aGlzLmNvbW1hbmQgKyBcIj9cIiArIHF1ZXJ5U3RyaW5naWZ5KHRoaXMucXVlcnlPYmplY3QpKTtcbiAgICB2YXIgcmVzcG9uc2VDb2RlID0gZmV0Y2hQcm9taXNlLnRoZW4oKHJlc3BvbnNlT2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gcmVzcG9uc2VPYmplY3Q7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVzcG9uc2VUZXh0ID0gZmV0Y2hQcm9taXNlLnRoZW4oKHJlc3BvbnNlT2JqZWN0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZU9iamVjdC50ZXh0KCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKHJlc3BvbnNlU3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VUZXh0ID0gcmVzcG9uc2VTdHJpbmc7XG4gICAgICAgIHJldHVybiByZXNwb25zZVN0cmluZztcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtyZXNwb25zZUNvZGUsIHJlc3BvbnNlVGV4dF0pLnRoZW4oKHByb21pc2VBcnJheSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb21pc2VBcnJheVswXS5zdGF0dXMpIHtcbiAgICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAgIHJldHVybiBfcGFyc2VVbmtub3duU3RyaW5nKHByb21pc2VBcnJheVsxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGpzb25TdHJpbmdcbiAqIEByZXR1cm4ge29iamVjdHxzdHJpbmd9IGpzb25PYmplY3QgLSBJZiB2YWxpZCBKU09OIHBhcnNlIGFzIEpTT04gb3RoZXJ3aXNlIHJldHVybiBvcmlnaW5hbCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IF9wYXJzZVVua25vd25TdHJpbmcgPSAoc3RyaW5nKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaW5nKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHVuaXByb3RJZFxuICogQHJldHVybiB7c3RyaW5nfSB1bmlwcm90VXJpXG4gKi9cbmV4cG9ydCBjb25zdCBfYnVpbGRVbmlwcm90VXJpID0gKHVuaXByb2RJZCkgPT4ge1xuICByZXR1cm4gXCJodHRwOi8vaWRlbnRpZmllcnMub3JnL3VuaXByb3QvXCIgKyB1bmlwcm9kSWQ7XG59XG4iLCIvKipcbiAqIFBlZm9ybXMgYSBTRUFSQ0ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBtb2R1bGUgc2VhcmNoXG4gKiBAcGFyYW0ge29iamVjdH0gcXVlcnlfb2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHNlYXJjaCBjb21tYW5kLlxuICogQHBhcmFtIHtyZXF1ZXN0Q2FsbGJhY2t9IGNhbGxiYWNrIC0gVGVybWluYXRpbmcgY2FsbGJhY2ssIHNlZSBiZWxvdyBmb3IgYXJndW1lbnRzLlxuICovXG5jb25zdCBzZWFyY2ggPSAocXVlcnlfb2JqZWN0LCBjYWxsYmFjaykgPT4ge1xuXHQvKipcblx0KiBDYWxsYmFjayBmb3Igc2VhcmNoIGZ1bmN0aW9uLCB3aGljaCBpcyBhbHdheXMgY2FsbGVkIG9uIGNvbXBsZXRpb25cblx0KlxuXHQqIEBjYWxsYmFjayByZXF1ZXN0Q2FsbGJhY2tcblx0KiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2VTdGF0dXMgLSBBIHN0cmluZyB3aGljaCBpbmRpY2F0ZXMgZmFpbHVyZSwgbm8gcmVzdWx0cyByZXR1cm5lZCwgb3Igc3VjY2Vzcy5cblx0KiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2VPYmplY3QgLSBBIHBhcnNlZCBKU09OIG9iamVjdCByZXR1cm5lZCBmcm9tIFBDIGlmIGF2YWlsYWJsZSwgZWxzZSBlbXB0eSBvYmplY3QuIFJlc3VsdCBmcm9tIHNlYXJjaCBpcyBhc3N1bWVkIHRvIGJlIGluIEpTT04gZm9ybWF0LlxuXHQqL1xuXHRjYWxsYmFjayhyZXNwb25zZVN0YXR1cywgcmVzcG9uc2VPYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBzZWFyY2g7XG4iLCIvKipcbiAqIFBlZm9ybXMgYSBTRUFSQ0ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBtb2R1bGUgdHJhdmVyc2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeV9vYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgdHJhdmVyc2UgY29tbWFuZC5cbiAqIEBwYXJhbSB7cmVxdWVzdENhbGxiYWNrfSBjYWxsYmFjayAtIFRlcm1pbmF0aW5nIGNhbGxiYWNrLCBzZWUgYmVsb3cgZm9yIGFyZ3VtZW50cy5cbiAqL1xuY29uc3QgdHJhdmVyc2UgPSAocXVlcnlfYXJyYXksIGNhbGxiYWNrKSA9PiB7XG5cdC8qKlxuXHQqIENhbGxiYWNrIGZvciB0cmF2ZXJzZSBmdW5jdGlvbiwgd2hpY2ggaXMgYWx3YXlzIGNhbGxlZCBvbiBjb21wbGV0aW9uXG5cdCpcblx0KiBAY2FsbGJhY2sgcmVxdWVzdENhbGxiYWNrXG5cdCogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlU3RhdHVzIC0gQSBzdHJpbmcgd2hpY2ggaW5kaWNhdGVzIGZhaWx1cmUsIG5vIHJlc3VsdHMgcmV0dXJuZWQsIG9yIHN1Y2Nlc3MuXG5cdCogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlT2JqZWN0IC0gQSBwYXJzZWQgSlNPTiBvYmplY3QgcmV0dXJuZWQgZnJvbSBQQyBpZiBhdmFpbGFibGUsIGVsc2UgZW1wdHkgb2JqZWN0LiBSZXN1bHQgZnJvbSB0cmF2ZXJzZSBpcyBhc3N1bWVkIHRvIGJlIGluIEpTT04gZm9ybWF0LlxuXHQqL1xuXHRjYWxsYmFjayhyZXNwb25zZVN0YXR1cywgcmVzcG9uc2VPYmplY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB0cmF2ZXJzZTtcbiJdfQ==
