(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/manfredcheung/pathway-commons/node_modules/lodash/_DataView.js":[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js","./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Map.js":[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js","./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Promise.js":[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js","./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Set.js":[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js","./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Symbol.js":[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_WeakMap.js":[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js","./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseGetTag.js":[function(require,module,exports){
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

},{"./_Symbol":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Symbol.js","./_getRawTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getRawTag.js","./_objectToString":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_objectToString.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsArguments.js":[function(require,module,exports){
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

},{"./_baseGetTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseGetTag.js","./isObjectLike":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObjectLike.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsNative.js":[function(require,module,exports){
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

},{"./_isMasked":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_isMasked.js","./_toSource":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_toSource.js","./isFunction":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isFunction.js","./isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsTypedArray.js":[function(require,module,exports){
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

},{"./_baseGetTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseGetTag.js","./isLength":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isLength.js","./isObjectLike":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObjectLike.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseKeys.js":[function(require,module,exports){
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

},{"./_isPrototype":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_isPrototype.js","./_nativeKeys":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_nativeKeys.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseUnary.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_coreJsData.js":[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_freeGlobal.js":[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getNative.js":[function(require,module,exports){
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

},{"./_baseIsNative":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsNative.js","./_getValue":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getValue.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getRawTag.js":[function(require,module,exports){
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

},{"./_Symbol":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Symbol.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getTag.js":[function(require,module,exports){
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

},{"./_DataView":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_DataView.js","./_Map":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Map.js","./_Promise":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Promise.js","./_Set":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_Set.js","./_WeakMap":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_WeakMap.js","./_baseGetTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseGetTag.js","./_toSource":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_toSource.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getValue.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_isMasked.js":[function(require,module,exports){
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

},{"./_coreJsData":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_coreJsData.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_isPrototype.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_nativeKeys.js":[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_overArg.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_nodeUtil.js":[function(require,module,exports){
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

},{"./_freeGlobal":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_freeGlobal.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_objectToString.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_overArg.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js":[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_freeGlobal.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/_toSource.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArguments.js":[function(require,module,exports){
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

},{"./_baseIsArguments":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsArguments.js","./isObjectLike":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObjectLike.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArray.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArrayLike.js":[function(require,module,exports){
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

},{"./isFunction":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isFunction.js","./isLength":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isLength.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isBuffer.js":[function(require,module,exports){
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

},{"./_root":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_root.js","./stubFalse":"/Users/manfredcheung/pathway-commons/node_modules/lodash/stubFalse.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isEmpty.js":[function(require,module,exports){
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

},{"./_baseKeys":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseKeys.js","./_getTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_getTag.js","./_isPrototype":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_isPrototype.js","./isArguments":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArguments.js","./isArray":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArray.js","./isArrayLike":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArrayLike.js","./isBuffer":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isBuffer.js","./isTypedArray":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isTypedArray.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isFunction.js":[function(require,module,exports){
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

},{"./_baseGetTag":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseGetTag.js","./isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isLength.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObjectLike.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/isTypedArray.js":[function(require,module,exports){
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

},{"./_baseIsTypedArray":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseIsTypedArray.js","./_baseUnary":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_baseUnary.js","./_nodeUtil":"/Users/manfredcheung/pathway-commons/node_modules/lodash/_nodeUtil.js"}],"/Users/manfredcheung/pathway-commons/node_modules/lodash/stubFalse.js":[function(require,module,exports){
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

},{}],"/Users/manfredcheung/pathway-commons/node_modules/uuid/lib/bytesToUuid.js":[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],"/Users/manfredcheung/pathway-commons/node_modules/uuid/lib/rng-browser.js":[function(require,module,exports){
(function (global){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var  rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/manfredcheung/pathway-commons/node_modules/uuid/v4.js":[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":"/Users/manfredcheung/pathway-commons/node_modules/uuid/lib/bytesToUuid.js","./lib/rng":"/Users/manfredcheung/pathway-commons/node_modules/uuid/lib/rng-browser.js"}],"/Users/manfredcheung/pathway-commons/src/datasources.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObject = require('lodash/isObject');

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Fetches an array of datasources from PC.
 * @alias datasources
 */
module.exports = function () {
  /**
   * Initialises datasources and makes a request to PC server fetching datasource data. Chainable.
   * @constructor
   * @returns {this}
   */
  function Datasources() {
    _classCallCheck(this, Datasources);

    this.request = new PcRequest("metadata/datasources", false);
    this.data = this.fetch();
  }

  /**
   * Makes a fetch request to PC requesting data sources. If called after class initialization, purges existing data source cache and makes a call to PC to re-fetch data sources.
   * @method datasources#fetch
   * @returns {Promise<object>} - Returns promise containing either the data source array or null if data source is not available
   */


  _createClass(Datasources, [{
    key: 'fetch',
    value: function fetch() {
      var dataPromise = this.request.fetch().then(function (response) {
        var output = {};
        if (isObject(response)) {
          response.filter(function (source) {
            return source.notPathwayData == false;
          }).map(function (ds) {
            var name = ds.name.length > 1 ? ds.name[1] : ds.name[0];
            output[ds.uri] = {
              id: ds.identifier,
              uri: ds.uri,
              name: name,
              description: ds.description,
              type: ds.type,
              iconUrl: ds.iconUrl
            };
          });
        } else {
          output = null;
        }
        return output;
      }).catch(function () {
        return null;
      });

      this.data = dataPromise;
      return dataPromise;
    }

    /**
     * Returns promise containing data sources from PC.
     * @method datasources#get
     * @returns {Promise<object>} - Returns cached promise from the fetch method
     */

  }, {
    key: 'get',
    value: function get() {
      return this.data;
    }

    /**
     * Fetches the logo for the datasource using either datasources URI or name. Intended to be used to generate image tags for thumbnails.
     * @method datasources#lookupIcon
     * @param {string} dsUriOrName - Either URI or name of the data source
     * @return {Promise<string>} logoUrl - Promise containing URL of datasource in question, else undefined if datasource not found
     */

  }, {
    key: 'lookupIcon',
    value: function lookupIcon(dsUriOrName) {
      dsUriOrName = dsUriOrName || "";
      return this.data.then(function (dataSources) {
        for (var key in dataSources) {
          var ds = dataSources[key];
          if (ds.uri == dsUriOrName || ds.name.toLowerCase() == dsUriOrName.toLowerCase()) {
            return ds.iconUrl;
          }
        }
      });
    }
  }]);

  return Datasources;
}();

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js","lodash/isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js"}],"/Users/manfredcheung/pathway-commons/src/get.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias get
 */
module.exports = function () {
  /**
   * Initialises get. Chainable.
   * @constructor
   * @returns {this}
   */
  function Get() {
    _classCallCheck(this, Get);

    this.request = new PcRequest("get");
  }

  /**
   * Sets all query parameters which are sent with the get request. Will overwrite existing query settings.
   * @method get#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Get, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the get request
     * @method get#uri
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      this.request.set("uri", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the get request
     * @method get#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method get#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Get;
}();

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/graph.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');
var sourceCheck = require('./private/helpers.js').sourceCheck;

/**
 * @class
 * @classdesc Peforms a graph web query to the Pathway Commons web service
 * @alias graph
 */
module.exports = function () {
  /**
   * Initialises graph. Chainable.
   * @constructor
   * @returns {this}
   */
  function Graph() {
    _classCallCheck(this, Graph);

    this.request = new PcRequest("graph");
  }

  /**
   * Sets all query parameters which are sent with the graph request. Will overwrite existing query settings.
   * @method graph#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the graph command.
   * @returns {this}
   */


  _createClass(Graph, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets kind parameter which is to be sent with the graph request
     * @method graph#kind
     * @param {string} value - kind
     * @returns {this}
     */

  }, {
    key: 'kind',
    value: function kind(value) {
      this.request.set("kind", value);

      return this;
    }

    /**
     * Sets source parameter which is to be sent with the graph request
     * @method graph#source
     * @param {string|array} value - source
     * @returns {this}
     */

  }, {
    key: 'source',
    value: function source(value, datasource) {
      if (datasource === undefined || sourceCheck(datasource, value)) {
        this.request.set("source", value);
      } else {
        throw new SyntaxError(value + " is an invalid " + datasource.toUpperCase() + " ID");
      }

      return this;
    }

    /**
     * Sets target parameter which is to be sent with the graph request
     * @method graph#target
     * @param {string|array} value - target
     * @returns {this}
     */

  }, {
    key: 'target',
    value: function target(value, datasource) {
      if (datasource !== undefined) {
        this.request.set("target", value);
      } else {
        sourceCheck(datasource, value) ? this.request.set("target", value) : function () {
          throw new SyntaxError(value + " invalid " + datasource);
        };
      }

      return this;
    }

    /**
     * Sets direction parameter which is to be sent with the graph request
     * @method graph#direction
     * @param {string} value - direction
     * @returns {this}
     */

  }, {
    key: 'direction',
    value: function direction(value) {
      this.request.set("direction", value);

      return this;
    }

    /**
     * Sets limit parameter which is to be sent with the graph request
     * @method graph#limit
     * @param {number} value - limit
     * @returns {this}
     */

  }, {
    key: 'limit',
    value: function limit(value) {
      this.request.set("limit", value);

      return this;
    }

    /**
     * Sets format parameter which is to be sent with the graph request
     * @method graph#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the graph request
     * @method graph#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the graph request
     * @method graph#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method graph#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on response headers
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Graph;
}();

},{"./private/helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js","./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/private/constants.js":[function(require,module,exports){
"use strict";

module.exports = {
  BioPaxClass: ["BindingFeature", "BiochemicalPathwayStep", "BiochemicalReaction", "BioSource", "Catalysis", "CellularLocationVocabulary", "CellVocabulary", "ChemicalStructure", "Complex", "ComplexAssembly", "Control", "ControlledVocabulary", "Conversion", "CovalentBindingFeature", "Degradation", "DeltaG", "Dna", "DnaReference", "DnaRegion", "DnaRegionReference", "Entity", "EntityFeature", "EntityReference", "EntityReferenceTypeVocabulary", "Evidence", "EvidenceCodeVocabulary", "ExperimentalForm", "ExperimentalFormVocabulary", "FragmentFeature", "Gene", "GeneticInteraction", "Interaction", "InteractionVocabulary", "KPrime", "ModificationFeature", "Modulation", "MolecularInteraction", "Named", "Pathway", "PathwayStep", "PhenotypeVocabulary", "PhysicalEntity", "Protein", "ProteinReference", "Provenance", "PublicationXref", "RelationshipTypeVocabulary", "RelationshipXref", "Rna", "RnaReference", "RnaRegion", "RnaRegionReference", "Score", "SequenceInterval", "SequenceLocation", "SequenceModificationVocabulary", "SequenceRegionVocabulary", "SequenceSite", "SimplePhysicalEntity", "SmallMolecule", "SmallMoleculeReference", "Stoichiometry", "TemplateReaction", "TemplateReactionRegulation", "TissueVocabulary", "Transport", "TransportWithBiochemicalReaction", "UnificationXref", "Xref", "XReferrable"],

  pc2Formats: ["BINARY_SIF", "BIOPAX", "EXTENDED_BINARY_SIF", "GSEA", "JSONLD", "SBGN"],

  fileFormats: {
    "BINARY_SIF": "sif",
    "BIOPAX": "owl",
    "EXTENDED_BINARY_SIF": "sif",
    "GSEA": "gsea",
    "JSONLD": "json",
    "SBGN": "sbgn"
  },

  graphKind: ["COMMONSTREAM", "NEIGHBORHOOD", "PATHSBETWEEN", "PATHSFROMTO"],

  graphDirection: ["BOTHSTREAM", "DOWNSTREAM", "UNDIRECTED", "UPSTREAM"]
};

},{}],"/Users/manfredcheung/pathway-commons/src/private/helpers.js":[function(require,module,exports){
'use strict';

var constants = require('./constants.js');

module.exports = {
  /**
   * @private
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if input is a non-empty string else returns false
   */
  validateString: function validateString(string) {
    if (typeof string === "string" && string.length !== 0) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @private
   * @param {string} string - String to be checked
   * @return {boolean} Returns true if string exists in pc2Formats array else returns false
   */
  validateWithConstArray: function validateWithConstArray(constArrayName, string) {
    if (typeof string === "string" && constants[constArrayName].indexOf(string) !== -1) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @private
   * @param {string} sourceName
   * @param {string} id
   * @return {boolean} idValidity
   */
  sourceCheck: function sourceCheck(sourceName, id) {
    var checkFunction = module.exports[sourceName.toLowerCase() + "Check"];
    if (typeof checkFunction === "function" && sourceName !== "source") {
      return checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  },

  /**
   * @private
   * @param {string} uniprotId
   * @return {boolean} idValidity
   */
  uniprotCheck: function uniprotCheck(uniprodId) {
    return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(uniprodId)
    );
  },

  /**
   * @private
   * @param {string} chebiId
   * @return {boolean} idValidity
   */
  chebiCheck: function chebiCheck(chebiId) {
    return (/^CHEBI:\d+$/.test(chebiId) && chebiId.length <= "CHEBI:".length + 6
    );
  },

  /**
   * @private
   * @param {string} hgncId
   * @return {boolean} idValidity
   */
  hgncCheck: function hgncCheck(hgncId) {
    return (/^[A-Za-z-0-9_]+(\@)?$/.test(hgncId)
    );
  }
};

},{"./constants.js":"/Users/manfredcheung/pathway-commons/src/private/constants.js"}],"/Users/manfredcheung/pathway-commons/src/private/pc-request.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fetch = require('fetch-ponyfill')().fetch;
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

var user = require('../user.js');
var validateString = require('./helpers.js').validateString;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = function () {
  function PcRequest(commandValue, submitId) {
    _classCallCheck(this, PcRequest);

    if (!validateString(commandValue)) {
      throw new SyntaxError("PcRequest constructor parameter invalid");
    }
    Object.defineProperty(this, "pcUrl", {
      get: function get() {
        return "http://www.pathwaycommons.org/pc2/";
      }
    });
    Object.defineProperty(this, "submitId", {
      get: function get() {
        return submitId === false ? false : true;
      }
    });
    Object.defineProperty(this, "command", {
      get: function get() {
        return commandValue;
      }
    });

    this.queryObject = {};
    this.formatString = "";
  }

  _createClass(PcRequest, [{
    key: 'query',
    value: function query(queryObject) {
      if (isObject(queryObject)) {
        this.queryObject = queryObject;
      }

      return this;
    }
  }, {
    key: 'set',
    value: function set(parameter, value) {
      parameter = String(parameter);
      if (parameter !== "") {
        if (value === "" || isArray(value) && !isEmpty(value)) {
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

      return this;
    }
  }, {
    key: 'format',
    value: function format(formatString) {
      var acceptedStrings = ["json", "xml", ""];

      if (acceptedStrings.indexOf(formatString) !== -1) {
        this.formatString = formatString;
      }

      return this;
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var url = this.pcUrl + this.command + (this.formatString ? "." + this.formatString : "") + "?" + stringify(Object.assign({}, this.queryObject, this.submitId ? {
        user: user.id()
      } : {}));

      return _fetch(url, { method: 'GET', mode: 'no-cors' }).then(function (res) {
        switch (res.status) {
          case 200:
            // To read headers from both node and browser fetch
            var contentType = res.headers._headers ? res.headers._headers["content-type"][0] : res.headers.map["content-type"];
            return contentType.toLowerCase().indexOf("json") !== -1 ? res.json() : res.text();
          case 500:
            return null;
          default:
            throw new Error(res.status);
        }
      });
    }
  }]);

  return PcRequest;
}();

},{"../user.js":"/Users/manfredcheung/pathway-commons/src/user.js","./helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js","fetch-ponyfill":"fetch-ponyfill","lodash/isArray":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArray.js","lodash/isEmpty":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isEmpty.js","lodash/isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js","query-string":"query-string"}],"/Users/manfredcheung/pathway-commons/src/search.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a search web query to the Pathway Commons web service
 * @alias search
 */
module.exports = function () {
  /**
   * Initialises search. Chainable.
   * @constructor
   * @param {object} [queryObject] - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */
  function Search() {
    _classCallCheck(this, Search);

    this.request = new PcRequest("search").format("json");
  }

  /**
   * Sets all query parameters which are sent with the search request. Will overwrite existing query settings.
   * @method search#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the search command.
   * @returns {this}
   */


  _createClass(Search, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the search request
     * @method search#q
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets page parameter which is to be sent with the search request
     * @method search#page
     * @param {string} value - page
     * @returns {this}
     */

  }, {
    key: 'page',
    value: function page(value) {
      this.request.set("page", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the search request
     * @method search#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the search request
     * @method search#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Sets type parameter which is to be sent with the search request
     * @method search#type
     * @param {string} value - type
     * @returns {this}
     */

  }, {
    key: 'type',
    value: function type(value) {
      this.request.set("type", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method search#format
     * @param {string} formatString
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(formatString) {
      this.request.format(formatString);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method search#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Search;
}();

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/top_pathways.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a get web query to the Pathway Commons web service
 * @alias top_pathways
 */
module.exports = function () {
  /**
   * Initialises top_pathways. Chainable.
   * @constructor
   * @returns {this}
   */
  function Top_Pathways() {
    _classCallCheck(this, Top_Pathways);

    this.request = new PcRequest("top_pathways");
  }

  /**
   * Sets all query parameters which are sent with the request. Will overwrite existing query settings.
   * @method top_pathways#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the get command.
   * @returns {this}
   */


  _createClass(Top_Pathways, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets q parameter which is to be sent with the top_pathways request
     * @method top_pathways#q
     * @param {string} value - q
     * @returns {this}
     */

  }, {
    key: 'q',
    value: function q(value) {
      this.request.set("q", value);

      return this;
    }

    /**
     * Sets datasource parameter which is to be sent with the top_pathways request
     * @method top_pathways#datasource
     * @param {string|array} value - datasource
     * @returns {this}
     */

  }, {
    key: 'datasource',
    value: function datasource(value) {
      this.request.set("datasource", value);

      return this;
    }

    /**
     * Sets organism parameter which is to be sent with the top_pathways request
     * @method top_pathways#organism
     * @param {string} value - organism
     * @returns {this}
     */

  }, {
    key: 'organism',
    value: function organism(value) {
      this.request.set("organism", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method top_pathways#format
     * @param {string} value - format
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(value) {
      this.request.set("format", value);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method top_pathways#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Top_Pathways;
}();

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/traverse.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');

/**
 * @class
 * @classdesc Peforms a traverse query to the Pathway Commons web service
 * @alias traverse
 */
module.exports = function () {
  /**
   * Initialises traverse. Chainable.
   * @constructor
   * @returns {this}
   */
  function Traverse() {
    _classCallCheck(this, Traverse);

    this.request = new PcRequest("traverse");
  }

  /**
   * Sets all query parameters which are sent with the traverse request. Will overwrite existing query settings.
   * @method traverse#query
   * @param {object} queryObject - Object representing the query parameters to be sent along with the traverse command.
   * @returns {this}
   */


  _createClass(Traverse, [{
    key: 'query',
    value: function query(queryObject) {
      this.request.query(queryObject);

      return this;
    }

    /**
     * Sets uri parameter which is to be sent with the traverse request
     * @method traverse#uri
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'uri',
    value: function uri(value) {
      this.request.set("uri", value);

      return this;
    }

    /**
     * Sets path parameter which is to be sent with the traverse request
     * @method traverse#path
     * @param {string} value - uri
     * @returns {this}
     */

  }, {
    key: 'path',
    value: function path(value) {
      this.request.set("path", value);

      return this;
    }

    /**
     * Sets format of returned data
     * @method traverse#format
     * @param {string} formatString
     * @returns {this}
     */

  }, {
    key: 'format',
    value: function format(formatString) {
      this.request.format(formatString);

      return this;
    }

    /**
     * Makes a fetch call to the PC API and return results
     * @method traverse#fetch
     * @return {Promise<string>|Promise<object>} - Promise returning either an object or string depending on format
     */

  }, {
    key: 'fetch',
    value: function fetch() {
      return this.request.fetch();
    }
  }]);

  return Traverse;
}();

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/user.js":[function(require,module,exports){
'use strict';

var uuidV4 = require('uuid/v4');
var validateString = require('./private/helpers.js').validateString;

var idPrefix = "pathwaycommons-js-lib:";

var _id = new WeakMap();

var setId = function setId(userId) {
  if (validateString(userId)) {
    userId = idPrefix + userId;
  } else if (userId === null) {
    userId = "";
  } else {
    userId = idPrefix + uuidV4();
  }

  if (_id.get(undefined) === undefined) {
    _id.set(undefined, userId);
  }
};

module.exports = {
  id: function id(userId) {
    if (!(userId === undefined && _id.get(undefined) !== undefined)) {
      setId(userId);
    }
    return _id.get(undefined);
  }
};

},{"./private/helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js","uuid/v4":"/Users/manfredcheung/pathway-commons/node_modules/uuid/v4.js"}],"/Users/manfredcheung/pathway-commons/src":[function(require,module,exports){
'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  user: require('./user.js'),
  datasources: new (require('./datasources.js'))(),
  get: function get() {
    return new (require('./get.js'))();
  },
  search: function search() {
    return new (require('./search.js'))();
  },
  traverse: function traverse() {
    return new (require('./traverse.js'))();
  },
  graph: function graph() {
    return new (require('./graph.js'))();
  },
  top_pathways: function top_pathways() {
    return new (require('./top_pathways.js'))();
  }
};

},{"./datasources.js":"/Users/manfredcheung/pathway-commons/src/datasources.js","./get.js":"/Users/manfredcheung/pathway-commons/src/get.js","./graph.js":"/Users/manfredcheung/pathway-commons/src/graph.js","./search.js":"/Users/manfredcheung/pathway-commons/src/search.js","./top_pathways.js":"/Users/manfredcheung/pathway-commons/src/top_pathways.js","./traverse.js":"/Users/manfredcheung/pathway-commons/src/traverse.js","./user.js":"/Users/manfredcheung/pathway-commons/src/user.js"}]},{},["/Users/manfredcheung/pathway-commons/src"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJub2RlX21vZHVsZXMvdXVpZC9saWIvcm5nLWJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXVpZC92NC5qcyIsInNyYy9kYXRhc291cmNlcy5qcyIsInNyYy9nZXQuanMiLCJzcmMvZ3JhcGguanMiLCJzcmMvcHJpdmF0ZS9jb25zdGFudHMuanMiLCJzcmMvcHJpdmF0ZS9oZWxwZXJzLmpzIiwic3JjL3ByaXZhdGUvcGMtcmVxdWVzdC5qcyIsInNyYy9zZWFyY2guanMiLCJzcmMvdG9wX3BhdGh3YXlzLmpzIiwic3JjL3RyYXZlcnNlLmpzIiwic3JjL3VzZXIuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDLE1BQUQsRUFBWTtBQUNkLFFBQUcsRUFBRyxXQUFXLFNBQVosSUFBMkIsSUFBSSxHQUFKLGdCQUFrQixTQUEvQyxDQUFILEVBQStEO0FBQzdELFlBQU0sTUFBTjtBQUNEO0FBQ0QsV0FBTyxJQUFJLEdBQUosV0FBUDtBQUNEO0FBTmMsQ0FBakI7OztBQ3pCQTs7QUFFQTs7Ozs7O0FBTUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsUUFBTSxRQUFRLFdBQVIsQ0FEUztBQUVmLGVBQWEsS0FBSSxRQUFRLGtCQUFSLENBQUosR0FGRTtBQUdmLE9BQU07QUFBQSxXQUFNLEtBQUksUUFBUSxVQUFSLENBQUosR0FBTjtBQUFBLEdBSFM7QUFJZixVQUFTO0FBQUEsV0FBTSxLQUFJLFFBQVEsYUFBUixDQUFKLEdBQU47QUFBQSxHQUpNO0FBS2YsWUFBVztBQUFBLFdBQU0sS0FBSSxRQUFRLGVBQVIsQ0FBSixHQUFOO0FBQUEsR0FMSTtBQU1mLFNBQVE7QUFBQSxXQUFNLEtBQUksUUFBUSxZQUFSLENBQUosR0FBTjtBQUFBLEdBTk87QUFPZixnQkFBZTtBQUFBLFdBQU0sS0FBSSxRQUFRLG1CQUFSLENBQUosR0FBTjtBQUFBO0FBUEEsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc01hc2tlZCA9IHJlcXVpcmUoJy4vX2lzTWFza2VkJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hdGl2ZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iLCJ2YXIgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGVtcHR5IG9iamVjdCwgY29sbGVjdGlvbiwgbWFwLCBvciBzZXQuXG4gKlxuICogT2JqZWN0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgbm8gb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkXG4gKiBwcm9wZXJ0aWVzLlxuICpcbiAqIEFycmF5LWxpa2UgdmFsdWVzIHN1Y2ggYXMgYGFyZ3VtZW50c2Agb2JqZWN0cywgYXJyYXlzLCBidWZmZXJzLCBzdHJpbmdzLCBvclxuICogalF1ZXJ5LWxpa2UgY29sbGVjdGlvbnMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYGxlbmd0aGAgb2YgYDBgLlxuICogU2ltaWxhcmx5LCBtYXBzIGFuZCBzZXRzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBhIGBzaXplYCBvZiBgMGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VtcHR5KG51bGwpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSh0cnVlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNFbXB0eSh7ICdhJzogMSB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmXG4gICAgICAoaXNBcnJheSh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICBpc0J1ZmZlcih2YWx1ZSkgfHwgaXNUeXBlZEFycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5sZW5ndGg7XG4gIH1cbiAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSk7XG4gIGlmICh0YWcgPT0gbWFwVGFnIHx8IHRhZyA9PSBzZXRUYWcpIHtcbiAgICByZXR1cm4gIXZhbHVlLnNpemU7XG4gIH1cbiAgaWYgKGlzUHJvdG90eXBlKHZhbHVlKSkge1xuICAgIHJldHVybiAhYmFzZUtleXModmFsdWUpLmxlbmd0aDtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxudmFyIHJuZztcblxudmFyIGNyeXB0byA9IGdsb2JhbC5jcnlwdG8gfHwgZ2xvYmFsLm1zQ3J5cHRvOyAvLyBmb3IgSUUgMTFcbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG4gICAgcmV0dXJuIHJuZHM4O1xuICB9O1xufVxuXG5pZiAoIXJuZykge1xuICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gIC8vXG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gIC8vIHF1YWxpdHkuXG4gIHZhciAgcm5kcyA9IG5ldyBBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJuZztcbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7ICsraWkpIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBieXRlc1RvVXVpZChybmRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2NDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBGZXRjaGVzIGFuIGFycmF5IG9mIGRhdGFzb3VyY2VzIGZyb20gUEMuXG4gKiBAYWxpYXMgZGF0YXNvdXJjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBEYXRhc291cmNlcyB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBkYXRhc291cmNlcyBhbmQgbWFrZXMgYSByZXF1ZXN0IHRvIFBDIHNlcnZlciBmZXRjaGluZyBkYXRhc291cmNlIGRhdGEuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcIm1ldGFkYXRhL2RhdGFzb3VyY2VzXCIsIGZhbHNlKTtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmZldGNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNmZXRjaFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxvYmplY3Q+fSAtIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGVpdGhlciB0aGUgZGF0YSBzb3VyY2UgYXJyYXkgb3IgbnVsbCBpZiBkYXRhIHNvdXJjZSBpcyBub3QgYXZhaWxhYmxlXG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICB2YXIgZGF0YVByb21pc2UgPSB0aGlzLnJlcXVlc3QuZmV0Y2goKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdmFyIG91dHB1dCA9IHt9O1xuICAgICAgaWYgKGlzT2JqZWN0KHJlc3BvbnNlKSkge1xuICAgICAgICByZXNwb25zZVxuICAgICAgICAgIC5maWx0ZXIoc291cmNlID0+IHNvdXJjZS5ub3RQYXRod2F5RGF0YSA9PSBmYWxzZSlcbiAgICAgICAgICAubWFwKChkcykgPT4ge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAoZHMubmFtZS5sZW5ndGggPiAxKSA/IGRzLm5hbWVbMV0gOiBkcy5uYW1lWzBdO1xuICAgICAgICAgICAgb3V0cHV0W2RzLnVyaV0gPSB7XG4gICAgICAgICAgICAgIGlkOiBkcy5pZGVudGlmaWVyLFxuICAgICAgICAgICAgICB1cmk6IGRzLnVyaSxcbiAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGRzLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICB0eXBlOiBkcy50eXBlLFxuICAgICAgICAgICAgICBpY29uVXJsOiBkcy5pY29uVXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhUHJvbWlzZTtcbiAgICByZXR1cm4gZGF0YVByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZGF0YSBzb3VyY2VzIGZyb20gUEMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjZ2V0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoZXMgdGhlIGxvZ28gZm9yIHRoZSBkYXRhc291cmNlIHVzaW5nIGVpdGhlciBkYXRhc291cmNlcyBVUkkgb3IgbmFtZS4gSW50ZW5kZWQgdG8gYmUgdXNlZCB0byBnZW5lcmF0ZSBpbWFnZSB0YWdzIGZvciB0aHVtYm5haWxzLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2xvb2t1cEljb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRzVXJpT3JOYW1lIC0gRWl0aGVyIFVSSSBvciBuYW1lIG9mIHRoZSBkYXRhIHNvdXJjZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59IGxvZ29VcmwgLSBQcm9taXNlIGNvbnRhaW5pbmcgVVJMIG9mIGRhdGFzb3VyY2UgaW4gcXVlc3Rpb24sIGVsc2UgdW5kZWZpbmVkIGlmIGRhdGFzb3VyY2Ugbm90IGZvdW5kXG4gICAqL1xuICBsb29rdXBJY29uKGRzVXJpT3JOYW1lKSB7XG4gICAgZHNVcmlPck5hbWUgPSBkc1VyaU9yTmFtZSB8fCBcIlwiO1xuICAgIHJldHVybiB0aGlzLmRhdGEudGhlbigoZGF0YVNvdXJjZXMpID0+IHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhU291cmNlcykge1xuICAgICAgICB2YXIgZHMgPSBkYXRhU291cmNlc1trZXldO1xuICAgICAgICBpZiAoZHMudXJpID09IGRzVXJpT3JOYW1lIHx8IGRzLm5hbWUudG9Mb3dlckNhc2UoKSA9PSBkc1VyaU9yTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGRzLmljb25Vcmw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdldCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIGdldFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdldCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBnZXQuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcImdldFwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCBnZXQjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdldCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXJpIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I3VyaVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB1cmkodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwidXJpXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdldCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ2V0I2Zvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBmb3JtYXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZm9ybWF0XCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgZmV0Y2ggY2FsbCB0byB0aGUgUEMgQVBJIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgKiBAbWV0aG9kIGdldCNmZXRjaFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz58UHJvbWlzZTxvYmplY3Q+fSAtIFByb21pc2UgcmV0dXJuaW5nIGVpdGhlciBhbiBvYmplY3Qgb3Igc3RyaW5nIGRlcGVuZGluZyBvbiBmb3JtYXRcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuZmV0Y2goKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcbnZhciBzb3VyY2VDaGVjayA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9oZWxwZXJzLmpzJykuc291cmNlQ2hlY2s7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBncmFwaCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIGdyYXBoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR3JhcGgge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgZ3JhcGguIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcImdyYXBoXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2QgZ3JhcGgjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdyYXBoIGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICB0aGlzLnJlcXVlc3QucXVlcnkocXVlcnlPYmplY3QpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBraW5kIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNraW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGtpbmRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBraW5kKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImtpbmRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI3NvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBzb3VyY2UodmFsdWUsIGRhdGFzb3VyY2UpIHtcbiAgICBpZiAoZGF0YXNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IHNvdXJjZUNoZWNrKGRhdGFzb3VyY2UsIHZhbHVlKSkge1xuICAgICAgdGhpcy5yZXF1ZXN0LnNldChcInNvdXJjZVwiLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcih2YWx1ZSArIFwiIGlzIGFuIGludmFsaWQgXCIgKyBkYXRhc291cmNlLnRvVXBwZXJDYXNlKCkgKyBcIiBJRFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRhcmdldCBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjdGFyZ2V0XG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIHRhcmdldFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHRhcmdldCh2YWx1ZSwgZGF0YXNvdXJjZSkge1xuICAgIGlmIChkYXRhc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ0YXJnZXRcIiwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3VyY2VDaGVjayhkYXRhc291cmNlLCB2YWx1ZSkgPyB0aGlzLnJlcXVlc3Quc2V0KFwidGFyZ2V0XCIsIHZhbHVlKSA6ICgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHZhbHVlICsgXCIgaW52YWxpZCBcIiArIGRhdGFzb3VyY2UpXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGlyZWN0aW9uIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNkaXJlY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gZGlyZWN0aW9uXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGlyZWN0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRpcmVjdGlvblwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGxpbWl0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNsaW1pdFxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBsaW1pdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGxpbWl0KHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImxpbWl0XCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gZm9ybWF0XG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZm9ybWF0KHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImZvcm1hdFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGFzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI2RhdGFzb3VyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gZGF0YXNvdXJjZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGRhdGFzb3VyY2UodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZGF0YXNvdXJjZVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIG9yZ2FuaXNtIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCNvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBvcmdhbmlzbVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIG9yZ2FuaXNtKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcIm9yZ2FuaXNtXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgZmV0Y2ggY2FsbCB0byB0aGUgUEMgQVBJIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgKiBAbWV0aG9kIGdyYXBoI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIHJlc3BvbnNlIGhlYWRlcnNcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuZmV0Y2goKTtcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIEJpb1BheENsYXNzOiBbXG4gICAgXCJCaW5kaW5nRmVhdHVyZVwiLFxuICAgIFwiQmlvY2hlbWljYWxQYXRod2F5U3RlcFwiLFxuICAgIFwiQmlvY2hlbWljYWxSZWFjdGlvblwiLFxuICAgIFwiQmlvU291cmNlXCIsXG4gICAgXCJDYXRhbHlzaXNcIixcbiAgICBcIkNlbGx1bGFyTG9jYXRpb25Wb2NhYnVsYXJ5XCIsXG4gICAgXCJDZWxsVm9jYWJ1bGFyeVwiLFxuICAgIFwiQ2hlbWljYWxTdHJ1Y3R1cmVcIixcbiAgICBcIkNvbXBsZXhcIixcbiAgICBcIkNvbXBsZXhBc3NlbWJseVwiLFxuICAgIFwiQ29udHJvbFwiLFxuICAgIFwiQ29udHJvbGxlZFZvY2FidWxhcnlcIixcbiAgICBcIkNvbnZlcnNpb25cIixcbiAgICBcIkNvdmFsZW50QmluZGluZ0ZlYXR1cmVcIixcbiAgICBcIkRlZ3JhZGF0aW9uXCIsXG4gICAgXCJEZWx0YUdcIixcbiAgICBcIkRuYVwiLFxuICAgIFwiRG5hUmVmZXJlbmNlXCIsXG4gICAgXCJEbmFSZWdpb25cIixcbiAgICBcIkRuYVJlZ2lvblJlZmVyZW5jZVwiLFxuICAgIFwiRW50aXR5XCIsXG4gICAgXCJFbnRpdHlGZWF0dXJlXCIsXG4gICAgXCJFbnRpdHlSZWZlcmVuY2VcIixcbiAgICBcIkVudGl0eVJlZmVyZW5jZVR5cGVWb2NhYnVsYXJ5XCIsXG4gICAgXCJFdmlkZW5jZVwiLFxuICAgIFwiRXZpZGVuY2VDb2RlVm9jYWJ1bGFyeVwiLFxuICAgIFwiRXhwZXJpbWVudGFsRm9ybVwiLFxuICAgIFwiRXhwZXJpbWVudGFsRm9ybVZvY2FidWxhcnlcIixcbiAgICBcIkZyYWdtZW50RmVhdHVyZVwiLFxuICAgIFwiR2VuZVwiLFxuICAgIFwiR2VuZXRpY0ludGVyYWN0aW9uXCIsXG4gICAgXCJJbnRlcmFjdGlvblwiLFxuICAgIFwiSW50ZXJhY3Rpb25Wb2NhYnVsYXJ5XCIsXG4gICAgXCJLUHJpbWVcIixcbiAgICBcIk1vZGlmaWNhdGlvbkZlYXR1cmVcIixcbiAgICBcIk1vZHVsYXRpb25cIixcbiAgICBcIk1vbGVjdWxhckludGVyYWN0aW9uXCIsXG4gICAgXCJOYW1lZFwiLFxuICAgIFwiUGF0aHdheVwiLFxuICAgIFwiUGF0aHdheVN0ZXBcIixcbiAgICBcIlBoZW5vdHlwZVZvY2FidWxhcnlcIixcbiAgICBcIlBoeXNpY2FsRW50aXR5XCIsXG4gICAgXCJQcm90ZWluXCIsXG4gICAgXCJQcm90ZWluUmVmZXJlbmNlXCIsXG4gICAgXCJQcm92ZW5hbmNlXCIsXG4gICAgXCJQdWJsaWNhdGlvblhyZWZcIixcbiAgICBcIlJlbGF0aW9uc2hpcFR5cGVWb2NhYnVsYXJ5XCIsXG4gICAgXCJSZWxhdGlvbnNoaXBYcmVmXCIsXG4gICAgXCJSbmFcIixcbiAgICBcIlJuYVJlZmVyZW5jZVwiLFxuICAgIFwiUm5hUmVnaW9uXCIsXG4gICAgXCJSbmFSZWdpb25SZWZlcmVuY2VcIixcbiAgICBcIlNjb3JlXCIsXG4gICAgXCJTZXF1ZW5jZUludGVydmFsXCIsXG4gICAgXCJTZXF1ZW5jZUxvY2F0aW9uXCIsXG4gICAgXCJTZXF1ZW5jZU1vZGlmaWNhdGlvblZvY2FidWxhcnlcIixcbiAgICBcIlNlcXVlbmNlUmVnaW9uVm9jYWJ1bGFyeVwiLFxuICAgIFwiU2VxdWVuY2VTaXRlXCIsXG4gICAgXCJTaW1wbGVQaHlzaWNhbEVudGl0eVwiLFxuICAgIFwiU21hbGxNb2xlY3VsZVwiLFxuICAgIFwiU21hbGxNb2xlY3VsZVJlZmVyZW5jZVwiLFxuICAgIFwiU3RvaWNoaW9tZXRyeVwiLFxuICAgIFwiVGVtcGxhdGVSZWFjdGlvblwiLFxuICAgIFwiVGVtcGxhdGVSZWFjdGlvblJlZ3VsYXRpb25cIixcbiAgICBcIlRpc3N1ZVZvY2FidWxhcnlcIixcbiAgICBcIlRyYW5zcG9ydFwiLFxuICAgIFwiVHJhbnNwb3J0V2l0aEJpb2NoZW1pY2FsUmVhY3Rpb25cIixcbiAgICBcIlVuaWZpY2F0aW9uWHJlZlwiLFxuICAgIFwiWHJlZlwiLFxuICAgIFwiWFJlZmVycmFibGVcIlxuICBdLFxuXG4gIHBjMkZvcm1hdHM6IFtcbiAgICBcIkJJTkFSWV9TSUZcIixcbiAgICBcIkJJT1BBWFwiLFxuICAgIFwiRVhURU5ERURfQklOQVJZX1NJRlwiLFxuICAgIFwiR1NFQVwiLFxuICAgIFwiSlNPTkxEXCIsXG4gICAgXCJTQkdOXCJcbiAgXSxcblxuICBmaWxlRm9ybWF0czoge1xuICAgIFwiQklOQVJZX1NJRlwiOiBcInNpZlwiLFxuICAgIFwiQklPUEFYXCI6IFwib3dsXCIsXG4gICAgXCJFWFRFTkRFRF9CSU5BUllfU0lGXCI6IFwic2lmXCIsXG4gICAgXCJHU0VBXCI6IFwiZ3NlYVwiLFxuICAgIFwiSlNPTkxEXCI6IFwianNvblwiLFxuICAgIFwiU0JHTlwiOiBcInNiZ25cIlxuICB9LFxuXG4gIGdyYXBoS2luZDogW1xuICAgIFwiQ09NTU9OU1RSRUFNXCIsXG4gICAgXCJORUlHSEJPUkhPT0RcIixcbiAgICBcIlBBVEhTQkVUV0VFTlwiLFxuICAgIFwiUEFUSFNGUk9NVE9cIlxuICBdLFxuXG4gIGdyYXBoRGlyZWN0aW9uOiBbXG4gICAgXCJCT1RIU1RSRUFNXCIsXG4gICAgXCJET1dOU1RSRUFNXCIsXG4gICAgXCJVTkRJUkVDVEVEXCIsXG4gICAgXCJVUFNUUkVBTVwiXG4gIF1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGlucHV0IGlzIGEgbm9uLWVtcHR5IHN0cmluZyBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlU3RyaW5nOiAoc3RyaW5nKSA9PiB7XG4gICAgaWYgKCh0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiKSAmJiAoc3RyaW5nLmxlbmd0aCAhPT0gMCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHN0cmluZyBleGlzdHMgaW4gcGMyRm9ybWF0cyBhcnJheSBlbHNlIHJldHVybnMgZmFsc2VcbiAgICovXG4gIHZhbGlkYXRlV2l0aENvbnN0QXJyYXk6IChjb25zdEFycmF5TmFtZSwgc3RyaW5nKSA9PiB7XG4gICAgaWYgKCh0eXBlb2Ygc3RyaW5nID09PSBcInN0cmluZ1wiKSAmJiAoY29uc3RhbnRzW2NvbnN0QXJyYXlOYW1lXS5pbmRleE9mKHN0cmluZykgIT09IC0xKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICBzb3VyY2VDaGVjazogKHNvdXJjZU5hbWUsIGlkKSA9PiB7XG4gICAgdmFyIGNoZWNrRnVuY3Rpb24gPSBtb2R1bGUuZXhwb3J0c1tzb3VyY2VOYW1lLnRvTG93ZXJDYXNlKCkgKyBcIkNoZWNrXCJdO1xuICAgIGlmICgodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikgJiYgKHNvdXJjZU5hbWUgIT09IFwic291cmNlXCIpKSB7XG4gICAgICByZXR1cm4gY2hlY2tGdW5jdGlvbihpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihzb3VyY2VOYW1lICsgXCIgaXMgYW4gaW52YWxpZCBzb3VyY2VcIik7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdW5pcHJvdElkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIHVuaXByb3RDaGVjazogKHVuaXByb2RJZCkgPT4ge1xuICAgIHJldHVybiAvXihbQS1OLFItWl1bMC05XShbQS1aXVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pezEsMn0pfChbTyxQLFFdWzAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSkoXFwuXFxkKyk/JC8udGVzdCh1bmlwcm9kSWQpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hlYmlJZFxuICAgKiBAcmV0dXJuIHtib29sZWFufSBpZFZhbGlkaXR5XG4gICAqL1xuICBjaGViaUNoZWNrOiAoY2hlYmlJZCkgPT4ge1xuICAgIHJldHVybiAvXkNIRUJJOlxcZCskLy50ZXN0KGNoZWJpSWQpICYmIChjaGViaUlkLmxlbmd0aCA8PSAoXCJDSEVCSTpcIi5sZW5ndGggKyA2KSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZ25jSWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gaWRWYWxpZGl0eVxuICAgKi9cbiAgaGduY0NoZWNrOiAoaGduY0lkKSA9PiB7XG4gICAgcmV0dXJuIC9eW0EtWmEtei0wLTlfXSsoXFxAKT8kLy50ZXN0KGhnbmNJZCk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZldGNoID0gcmVxdWlyZSgnZmV0Y2gtcG9ueWZpbGwnKSgpLmZldGNoO1xudmFyIGlzRW1wdHkgPSByZXF1aXJlKCdsb2Rhc2gvaXNFbXB0eScpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdsb2Rhc2gvaXNBcnJheScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoL2lzT2JqZWN0Jyk7XG52YXIgc3RyaW5naWZ5ID0gcmVxdWlyZSgncXVlcnktc3RyaW5nJykuc3RyaW5naWZ5O1xuXG52YXIgdXNlciA9IHJlcXVpcmUoJy4uL3VzZXIuanMnKTtcbnZhciB2YWxpZGF0ZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLnZhbGlkYXRlU3RyaW5nO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBDbGFzcyBmb3IgdXNlIGluIGZldGNoIHJlcXVlc3RzIHRvIFBhdGh3YXkgQ29tbW9uc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBjUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGNvbW1hbmRWYWx1ZSwgc3VibWl0SWQpIHtcbiAgICBpZiAoISh2YWxpZGF0ZVN0cmluZyhjb21tYW5kVmFsdWUpKSkge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiUGNSZXF1ZXN0IGNvbnN0cnVjdG9yIHBhcmFtZXRlciBpbnZhbGlkXCIpO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJwY1VybFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIFwiaHR0cDovL3d3dy5wYXRod2F5Y29tbW9ucy5vcmcvcGMyL1wiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInN1Ym1pdElkXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gKHN1Ym1pdElkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY29tbWFuZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucXVlcnlPYmplY3QgPSB7fTtcbiAgICB0aGlzLmZvcm1hdFN0cmluZyA9IFwiXCI7XG4gIH1cblxuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIGlmIChpc09iamVjdChxdWVyeU9iamVjdCkpIHtcbiAgICAgIHRoaXMucXVlcnlPYmplY3QgPSBxdWVyeU9iamVjdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwYXJhbWV0ZXIsIHZhbHVlKSB7XG4gICAgcGFyYW1ldGVyID0gU3RyaW5nKHBhcmFtZXRlcik7XG4gICAgaWYgKHBhcmFtZXRlciAhPT0gXCJcIikge1xuICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IChpc0FycmF5KHZhbHVlKSAmJiAhaXNFbXB0eSh2YWx1ZSkpKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlKHBhcmFtZXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5T2JqZWN0W3BhcmFtZXRlcl0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRlbGV0ZShwYXJhbWV0ZXIpIHtcbiAgICBkZWxldGUgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmb3JtYXQoZm9ybWF0U3RyaW5nKSB7XG4gICAgY29uc3QgYWNjZXB0ZWRTdHJpbmdzID0gW1xuICAgICAgXCJqc29uXCIsXG4gICAgICBcInhtbFwiLFxuICAgICAgXCJcIlxuICAgIF07XG5cbiAgICBpZiAoYWNjZXB0ZWRTdHJpbmdzLmluZGV4T2YoZm9ybWF0U3RyaW5nKSAhPT0gLTEpIHtcbiAgICAgIHRoaXMuZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZmV0Y2goKSB7XG4gICAgdmFyIHVybCA9IHRoaXMucGNVcmwgKyB0aGlzLmNvbW1hbmQgKyAodGhpcy5mb3JtYXRTdHJpbmcgPyBcIi5cIiArIHRoaXMuZm9ybWF0U3RyaW5nIDogXCJcIikgKyBcIj9cIiArIHN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCB0aGlzLnF1ZXJ5T2JqZWN0LCB0aGlzLnN1Ym1pdElkID8ge1xuICAgICAgdXNlcjogdXNlci5pZCgpXG4gICAgfSA6IHt9KSk7XG5cbiAgICByZXR1cm4gZmV0Y2godXJsLCB7bWV0aG9kOiAnR0VUJywgbW9kZTogJ25vLWNvcnMnfSkudGhlbihyZXMgPT4ge1xuICAgICAgc3dpdGNoIChyZXMuc3RhdHVzKSB7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIC8vIFRvIHJlYWQgaGVhZGVycyBmcm9tIGJvdGggbm9kZSBhbmQgYnJvd3NlciBmZXRjaFxuICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHJlcy5oZWFkZXJzLl9oZWFkZXJzID8gcmVzLmhlYWRlcnMuX2hlYWRlcnNbXCJjb250ZW50LXR5cGVcIl1bMF0gOiByZXMuaGVhZGVycy5tYXBbXCJjb250ZW50LXR5cGVcIl07XG4gICAgICAgICAgcmV0dXJuIGNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImpzb25cIikgIT09IC0xID8gcmVzLmpzb24oKSA6IHJlcy50ZXh0KCk7XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXMuc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUGNSZXF1ZXN0ID0gcmVxdWlyZSgnLi9wcml2YXRlL3BjLXJlcXVlc3QuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIHNlYXJjaCB3ZWIgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHNlYXJjaFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNlYXJjaCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBzZWFyY2guIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbcXVlcnlPYmplY3RdIC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHNlYXJjaCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJzZWFyY2hcIikuZm9ybWF0KFwianNvblwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGFsbCBxdWVyeSBwYXJhbWV0ZXJzIHdoaWNoIGFyZSBzZW50IHdpdGggdGhlIHNlYXJjaCByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCBzZWFyY2gjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHNlYXJjaCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdFxuICAgKiBAbWV0aG9kIHNlYXJjaCNxXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHEodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHBhZ2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjcGFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBwYWdlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcGFnZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJwYWdlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGF0YXNvdXJjZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdFxuICAgKiBAbWV0aG9kIHNlYXJjaCNkYXRhc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIGRhdGFzb3VyY2VcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkYXRhc291cmNlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBvcmdhbmlzbSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdFxuICAgKiBAbWV0aG9kIHNlYXJjaCNvcmdhbmlzbVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBvcmdhbmlzbVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIG9yZ2FuaXNtKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcIm9yZ2FuaXNtXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdHlwZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdFxuICAgKiBAbWV0aG9kIHNlYXJjaCN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHR5cGVcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICB0eXBlKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInR5cGVcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgb2YgcmV0dXJuZWQgZGF0YVxuICAgKiBAbWV0aG9kIHNlYXJjaCNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdChmb3JtYXRTdHJpbmcpIHtcbiAgICB0aGlzLnJlcXVlc3QuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCBzZWFyY2gjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBnZXQgd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyB0b3BfcGF0aHdheXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUb3BfUGF0aHdheXMge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgdG9wX3BhdGh3YXlzLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJ0b3BfcGF0aHdheXNcIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdldCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNxXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHFcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInFcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkYXRhc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRvcF9wYXRod2F5cyByZXF1ZXN0XG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2RhdGFzb3VyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gZGF0YXNvdXJjZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGRhdGFzb3VyY2UodmFsdWUpIHtcblx0dGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG5cdHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9wX3BhdGh3YXlzIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuXHR0aGlzLnJlcXVlc3Quc2V0KFwib3JnYW5pc21cIiwgdmFsdWUpO1xuXG5cdHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgdHJhdmVyc2UgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHRyYXZlcnNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhdmVyc2Uge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgdHJhdmVyc2UuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcInRyYXZlcnNlXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgdHJhdmVyc2UgcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHRyYXZlcnNlIGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcblx0dGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuXHRyZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVyaSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0cmF2ZXJzZSByZXF1ZXN0XG4gICAqIEBtZXRob2QgdHJhdmVyc2UjdXJpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHVyaSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ1cmlcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBwYXRoIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRyYXZlcnNlIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0cmF2ZXJzZSNwYXRoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHBhdGgodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicGF0aFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvcm1hdCBvZiByZXR1cm5lZCBkYXRhXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQoZm9ybWF0U3RyaW5nKSB7XG4gICAgdGhpcy5yZXF1ZXN0LmZvcm1hdChmb3JtYXRTdHJpbmcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKTtcbnZhciB2YWxpZGF0ZVN0cmluZyA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9oZWxwZXJzLmpzJykudmFsaWRhdGVTdHJpbmc7XG5cbmNvbnN0IGlkUHJlZml4ID0gXCJwYXRod2F5Y29tbW9ucy1qcy1saWI6XCI7XG5cbnZhciBfaWQgPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCBzZXRJZCA9ICh1c2VySWQpID0+IHtcbiAgaWYgKHZhbGlkYXRlU3RyaW5nKHVzZXJJZCkpIHtcbiAgICB1c2VySWQgPSBpZFByZWZpeCArIHVzZXJJZDtcbiAgfVxuICBlbHNlIGlmICh1c2VySWQgPT09IG51bGwpIHtcbiAgICB1c2VySWQgPSBcIlwiO1xuICB9XG4gIGVsc2Uge1xuICAgIHVzZXJJZCA9IGlkUHJlZml4ICsgdXVpZFY0KCk7XG4gIH1cblxuICBpZihfaWQuZ2V0KHRoaXMpID09PSB1bmRlZmluZWQpIHtcbiAgICBfaWQuc2V0KHRoaXMsIHVzZXJJZCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlkOiAodXNlcklkKSA9PiB7XG4gICAgaWYoISgodXNlcklkID09PSB1bmRlZmluZWQpICYmIChfaWQuZ2V0KHRoaXMpICE9PSB1bmRlZmluZWQpKSkge1xuICAgICAgc2V0SWQodXNlcklkKTtcbiAgICB9XG4gICAgcmV0dXJuIF9pZC5nZXQodGhpcyk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IFBhdGh3YXkgQ29tbW9ucyBBY2Nlc3MgTGlicmFyeSBJbmRleFxuICogQGF1dGhvciBNYW5mcmVkIENoZXVuZ1xuICogQHZlcnNpb246IDAuMVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1c2VyOiByZXF1aXJlKCcuL3VzZXIuanMnKSxcbiAgZGF0YXNvdXJjZXM6IG5ldyhyZXF1aXJlKCcuL2RhdGFzb3VyY2VzLmpzJykpKCksXG4gIGdldDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dldC5qcycpKSgpKSxcbiAgc2VhcmNoOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vc2VhcmNoLmpzJykpKCkpLFxuICB0cmF2ZXJzZTogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3RyYXZlcnNlLmpzJykpKCkpLFxuICBncmFwaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dyYXBoLmpzJykpKCkpLFxuICB0b3BfcGF0aHdheXM6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90b3BfcGF0aHdheXMuanMnKSkoKSlcbn07XG4iXX0=
