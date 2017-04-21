(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pathwayCommons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/manfredcheung/pathway-commons/node_modules/lodash/_DataView.js":[function(require,module,exports){
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

var constants = require('./private/constants.js');
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

    this.request = new PcRequest("metadata/datasources", false, constants.idPrefix + "datasources");
    this.data = this.refresh();
  }

  /**
   * Makes a fetch request to PC requesting data sources. If called after class initialization, purges existing data source cache and makes a call to PC to re-fetch data sources.
   * @method datasources#refresh
   * @returns {Promise<object>} - Returns promise containing either the data source array or null if data source is not available
   */


  _createClass(Datasources, [{
    key: 'refresh',
    value: function refresh() {
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
     * @method datasources#fetch
     * @returns {Promise<object>} - Returns cached promise from the fetch method
     */

  }, {
    key: 'fetch',
    value: function fetch() {
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

},{"./private/constants.js":"/Users/manfredcheung/pathway-commons/src/private/constants.js","./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js","lodash/isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js"}],"/Users/manfredcheung/pathway-commons/src/get.js":[function(require,module,exports){
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
var sourceCheck = require('./utilities.js').sourceCheck;

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

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js","./utilities.js":"/Users/manfredcheung/pathway-commons/src/utilities.js"}],"/Users/manfredcheung/pathway-commons/src/private/constants.js":[function(require,module,exports){
"use strict";

module.exports = {
  pcAddress: "http://www.pathwaycommons.org/pc2/",

  idPrefix: "pathwaycommons-js-lib:",

  dsIdValidation: {
    uniprot: function uniprot(id) {
      return (/^([A-N,R-Z][0-9]([A-Z][A-Z, 0-9][A-Z, 0-9][0-9]){1,2})|([O,P,Q][0-9][A-Z, 0-9][A-Z, 0-9][A-Z, 0-9][0-9])(\.\d+)?$/.test(id)
      );
    },
    chebi: function chebi(id) {
      return (/^CHEBI:\d+$/.test(id) && id.length <= "CHEBI:".length + 6
      );
    },
    hgnc: function hgnc(id) {
      return (/^[A-Za-z-0-9_]+(\@)?$/.test(id)
      );
    },
    refseq: function refseq(id) {
      return (/^((AC|AP|NC|NG|NM|NP|NR|NT|NW|XM|XP|XR|YP|ZP)_\d+|(NZ\_[A-Z]{4}\d+))(\.\d+)?$/.test(id)
      );
    },
    keggpathway: function keggpathway(id) {
      return (/^\w{2,4}\d{5}$/.test(id)
      );
    },
    keggdrug: function keggdrug(id) {
      return (/^D\d+$/.test(id)
      );
    },
    smpdb: function smpdb(id) {
      return (/^SMP\d{5}$/.test(id)
      );
    },
    drugbank: function drugbank(id) {
      return (/^DB\d{5}$/.test(id)
      );
    }
  }
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
   * @param {string} inputString - String to be checked
   * @return {string} Clean string
   */
  escapeLucene: function escapeLucene(inputString) {
    return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
  }
};

},{"./constants.js":"/Users/manfredcheung/pathway-commons/src/private/constants.js"}],"/Users/manfredcheung/pathway-commons/src/private/pc-request.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('./constants.js');

var _fetch = require('fetch-ponyfill')().fetch;
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var stringify = require('query-string').stringify;

var utilities = require('../utilities.js');
var validateString = require('./helpers.js').validateString;

/**
 * @class
 * @classdesc Class for use in fetch requests to Pathway Commons
 */
module.exports = function () {
  function PcRequest(commandValue, submitId, userOverride) {
    _classCallCheck(this, PcRequest);

    if (!validateString(commandValue)) {
      throw new SyntaxError("PcRequest constructor parameter invalid");
    }
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
    Object.defineProperty(this, "user", {
      get: function get() {
        return userOverride ? userOverride : utilities.user();
      }
    });

    this.queryObject = {};
    this.formatString = "";
  }

  _createClass(PcRequest, [{
    key: 'query',
    value: function query(queryObject) {
      if (isObject(queryObject)) {
        this.queryObject = Object.assign({}, queryObject);
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
      var url = constants.pcAddress + this.command + (this.formatString ? "." + this.formatString : "") + "?" + stringify(Object.assign({}, this.queryObject, this.submitId ? {
        user: this.user
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

},{"../utilities.js":"/Users/manfredcheung/pathway-commons/src/utilities.js","./constants.js":"/Users/manfredcheung/pathway-commons/src/private/constants.js","./helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js","fetch-ponyfill":"fetch-ponyfill","lodash/isArray":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isArray.js","lodash/isEmpty":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isEmpty.js","lodash/isObject":"/Users/manfredcheung/pathway-commons/node_modules/lodash/isObject.js","query-string":"query-string"}],"/Users/manfredcheung/pathway-commons/src/search.js":[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcRequest = require('./private/pc-request.js');
var escapeLucene = require('./private/helpers.js').escapeLucene;

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
     * Escapes whatever value is contained in q at the moment
     * @method search#escape
     * @param {boolean} [toggle=true] - Switches lucene escaping on or off.
     * @returns {this}
     */

  }, {
    key: 'escape',
    value: function escape(toggle) {
      if (toggle === undefined || toggle === true) {
        this.q(escapeLucene(this.request.queryObject.q));
      }

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

},{"./private/helpers.js":"/Users/manfredcheung/pathway-commons/src/private/helpers.js","./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/top_pathways.js":[function(require,module,exports){
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

},{"./private/pc-request.js":"/Users/manfredcheung/pathway-commons/src/private/pc-request.js"}],"/Users/manfredcheung/pathway-commons/src/utilities.js":[function(require,module,exports){
'use strict';

var fetch = require('fetch-ponyfill')().fetch;
var uuidV4 = require('uuid/v4');
var constants = require('./private/constants.js');

// Declare private variables
var _id;

/**
 * @module utilities
 */
module.exports = {
  /**
   * @param {string} [newId] - If given string, sets a new user ID. If null, turns of user id. Else simply returns current ID.
   * @return {string} id - Current user ID
   */
  user: function user(newId) {
    if (_id === undefined || newId !== undefined) {
      if (typeof newId === "string") {
        newId = constants.idPrefix + newId;
      } else if (newId === null) {
        newId = "";
      } else if (newId === undefined) {
        newId = constants.idPrefix + uuidV4();
      }
      _id = newId;
    }
    return _id;
  },

  /**
   * @param {number} [timeout=1000] Sets length of time before timeout in milliseconds
   * @return {boolean} PC2 Status
   */
  pcCheck: function pcCheck(timeout) {
    // timeout is in milliseconds
    var address = constants.pcAddress + "search?q=p53";
    var timeoutValue = Number(timeout != null ? timeout : 0) || 1000; // default timeout is 1000ms
    return new Promise(function (resolve, reject) {
      if (typeof XMLHttpRequest !== "undefined") {
        // Assume browserside: done using xhr because network connections cancellable
        var xhttp = new XMLHttpRequest();
        var timeoutRef = setTimeout(function () {
          xhttp.abort();
          resolve(false);
        }, timeoutValue);
        xhttp.open("GET", address);
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            clearTimeout(timeoutRef);
            resolve(true);
          }
        };
        xhttp.send();
      } else {
        // Assume serverside: done using fetch as ponyfill already available and residual network connections immaterial
        var timeoutRef = setTimeout(function () {
          resolve(false);
        }, timeoutValue);
        fetch(address, {
          method: 'get',
          timeout: timeoutValue
        }).then(function (response) {
          if (response.status === 200) {
            clearTimeout(timeoutRef);
            resolve(true);
          } else {
            clearTimeout(timeoutRef);
            resolve(false);
          }
        }).catch(function (e) {
          clearTimeout(timeoutRef);
          resolve(false);
        });
      }
    });
  },

  /**
   * @param {string} sourceName - Name of source type to validate against (eg. uniprot)
   * @param {string} id - ID to validate
   * @return {boolean} idValidity
   */
  sourceCheck: function sourceCheck(sourceName, id) {
    var checkFunction = constants.dsIdValidation[sourceName.toLowerCase() // Make all lowercase
    .replace(/[^a-zA-Z0-9]/g, "") // Remove any non letter or number symbols
    ];
    if (typeof checkFunction === "function") {
      return checkFunction(id);
    } else {
      throw new SyntaxError(sourceName + " is an invalid source");
    }
  }
};

},{"./private/constants.js":"/Users/manfredcheung/pathway-commons/src/private/constants.js","fetch-ponyfill":"fetch-ponyfill","uuid/v4":"/Users/manfredcheung/pathway-commons/node_modules/uuid/v4.js"}],"/Users/manfredcheung/pathway-commons/src":[function(require,module,exports){
'use strict';

/**
 * @fileOverview Pathway Commons Access Library Index
 * @author Manfred Cheung
 * @version: 0.1
 */

module.exports = {
  utilities: require('./utilities.js'),
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

},{"./datasources.js":"/Users/manfredcheung/pathway-commons/src/datasources.js","./get.js":"/Users/manfredcheung/pathway-commons/src/get.js","./graph.js":"/Users/manfredcheung/pathway-commons/src/graph.js","./search.js":"/Users/manfredcheung/pathway-commons/src/search.js","./top_pathways.js":"/Users/manfredcheung/pathway-commons/src/top_pathways.js","./traverse.js":"/Users/manfredcheung/pathway-commons/src/traverse.js","./utilities.js":"/Users/manfredcheung/pathway-commons/src/utilities.js"}]},{},["/Users/manfredcheung/pathway-commons/src"])("/Users/manfredcheung/pathway-commons/src")
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX01hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc05hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0xlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJub2RlX21vZHVsZXMvdXVpZC9saWIvcm5nLWJyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXVpZC92NC5qcyIsInNyYy9kYXRhc291cmNlcy5qcyIsInNyYy9nZXQuanMiLCJzcmMvZ3JhcGguanMiLCJzcmMvcHJpdmF0ZS9jb25zdGFudHMuanMiLCJzcmMvcHJpdmF0ZS9oZWxwZXJzLmpzIiwic3JjL3ByaXZhdGUvcGMtcmVxdWVzdC5qcyIsInNyYy9zZWFyY2guanMiLCJzcmMvdG9wX3BhdGh3YXlzLmpzIiwic3JjL3RyYXZlcnNlLmpzIiwic3JjL3V0aWxpdGllcy5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RixTQVpILEVBYUcsS0FiSCxDQWFTLGFBQUs7QUFDVix1QkFBYSxVQUFiO0FBQ0Esa0JBQVEsS0FBUjtBQUNELFNBaEJIO0FBaUJEO0FBQ0YsS0FyQ00sQ0FBUDtBQXNDRCxHQWxFYzs7QUFvRWY7Ozs7O0FBS0EsZUFBYSxxQkFBQyxVQUFELEVBQWEsRUFBYixFQUFvQjtBQUMvQixRQUFJLGdCQUFnQixVQUFVLGNBQVYsQ0FDbEIsV0FDRSxXQURGLEdBQ2dCO0FBRGhCLEtBRUUsT0FGRixDQUVVLGVBRlYsRUFFMkIsRUFGM0IsQ0FEa0IsQ0FHYTtBQUhiLEtBQXBCO0FBS0EsUUFBSSxPQUFPLGFBQVAsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkMsYUFBTyxjQUFjLEVBQWQsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU0sSUFBSSxXQUFKLENBQWdCLGFBQWEsdUJBQTdCLENBQU47QUFDRDtBQUNGO0FBcEZjLENBQWpCOzs7QUNYQTs7QUFFQTs7Ozs7O0FBTUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsYUFBVyxRQUFRLGdCQUFSLENBREk7QUFFZixlQUFhLEtBQUksUUFBUSxrQkFBUixDQUFKLEdBRkU7QUFHZixPQUFNO0FBQUEsV0FBTSxLQUFJLFFBQVEsVUFBUixDQUFKLEdBQU47QUFBQSxHQUhTO0FBSWYsVUFBUztBQUFBLFdBQU0sS0FBSSxRQUFRLGFBQVIsQ0FBSixHQUFOO0FBQUEsR0FKTTtBQUtmLFlBQVc7QUFBQSxXQUFNLEtBQUksUUFBUSxlQUFSLENBQUosR0FBTjtBQUFBLEdBTEk7QUFNZixTQUFRO0FBQUEsV0FBTSxLQUFJLFFBQVEsWUFBUixDQUFKLEdBQU47QUFBQSxHQU5PO0FBT2YsZ0JBQWU7QUFBQSxXQUFNLEtBQUksUUFBUSxtQkFBUixDQUFKLEdBQU47QUFBQTtBQVBBLENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBlbXB0eSBvYmplY3QsIGNvbGxlY3Rpb24sIG1hcCwgb3Igc2V0LlxuICpcbiAqIE9iamVjdHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIG5vIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZFxuICogcHJvcGVydGllcy5cbiAqXG4gKiBBcnJheS1saWtlIHZhbHVlcyBzdWNoIGFzIGBhcmd1bWVudHNgIG9iamVjdHMsIGFycmF5cywgYnVmZmVycywgc3RyaW5ncywgb3JcbiAqIGpRdWVyeS1saWtlIGNvbGxlY3Rpb25zIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBhIGBsZW5ndGhgIG9mIGAwYC5cbiAqIFNpbWlsYXJseSwgbWFwcyBhbmQgc2V0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgc2l6ZWAgb2YgYDBgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgKGlzQXJyYXkodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUuc3BsaWNlID09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgaXNCdWZmZXIodmFsdWUpIHx8IGlzVHlwZWRBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICB9XG4gIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpO1xuICBpZiAodGFnID09IG1hcFRhZyB8fCB0YWcgPT0gc2V0VGFnKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5zaXplO1xuICB9XG4gIGlmIChpc1Byb3RvdHlwZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gIWJhc2VLZXlzKHZhbHVlKS5sZW5ndGg7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbXB0eTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuIiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIEluIHRoZVxuLy8gYnJvd3NlciB0aGlzIGlzIGEgbGl0dGxlIGNvbXBsaWNhdGVkIGR1ZSB0byB1bmtub3duIHF1YWxpdHkgb2YgTWF0aC5yYW5kb20oKVxuLy8gYW5kIGluY29uc2lzdGVudCBzdXBwb3J0IGZvciB0aGUgYGNyeXB0b2AgQVBJLiAgV2UgZG8gdGhlIGJlc3Qgd2UgY2FuIHZpYVxuLy8gZmVhdHVyZS1kZXRlY3Rpb25cbnZhciBybmc7XG5cbnZhciBjcnlwdG8gPSBnbG9iYWwuY3J5cHRvIHx8IGdsb2JhbC5tc0NyeXB0bzsgLy8gZm9yIElFIDExXG5pZiAoY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIHZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMocm5kczgpO1xuICAgIHJldHVybiBybmRzODtcbiAgfTtcbn1cblxuaWYgKCFybmcpIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC9pc09iamVjdCcpO1xuXG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEZldGNoZXMgYW4gYXJyYXkgb2YgZGF0YXNvdXJjZXMgZnJvbSBQQy5cbiAqIEBhbGlhcyBkYXRhc291cmNlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIERhdGFzb3VyY2VzIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGRhdGFzb3VyY2VzIGFuZCBtYWtlcyBhIHJlcXVlc3QgdG8gUEMgc2VydmVyIGZldGNoaW5nIGRhdGFzb3VyY2UgZGF0YS4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwibWV0YWRhdGEvZGF0YXNvdXJjZXNcIiwgZmFsc2UsIGNvbnN0YW50cy5pZFByZWZpeCArIFwiZGF0YXNvdXJjZXNcIik7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCByZXF1ZXN0IHRvIFBDIHJlcXVlc3RpbmcgZGF0YSBzb3VyY2VzLiBJZiBjYWxsZWQgYWZ0ZXIgY2xhc3MgaW5pdGlhbGl6YXRpb24sIHB1cmdlcyBleGlzdGluZyBkYXRhIHNvdXJjZSBjYWNoZSBhbmQgbWFrZXMgYSBjYWxsIHRvIFBDIHRvIHJlLWZldGNoIGRhdGEgc291cmNlcy5cbiAgICogQG1ldGhvZCBkYXRhc291cmNlcyNyZWZyZXNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBwcm9taXNlIGNvbnRhaW5pbmcgZWl0aGVyIHRoZSBkYXRhIHNvdXJjZSBhcnJheSBvciBudWxsIGlmIGRhdGEgc291cmNlIGlzIG5vdCBhdmFpbGFibGVcbiAgICovXG4gIHJlZnJlc2goKSB7XG4gICAgdmFyIGRhdGFQcm9taXNlID0gdGhpcy5yZXF1ZXN0LmZldGNoKCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHZhciBvdXRwdXQgPSB7fTtcbiAgICAgIGlmIChpc09iamVjdChyZXNwb25zZSkpIHtcbiAgICAgICAgcmVzcG9uc2VcbiAgICAgICAgICAuZmlsdGVyKHNvdXJjZSA9PiBzb3VyY2Uubm90UGF0aHdheURhdGEgPT0gZmFsc2UpXG4gICAgICAgICAgLm1hcCgoZHMpID0+IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gKGRzLm5hbWUubGVuZ3RoID4gMSkgPyBkcy5uYW1lWzFdIDogZHMubmFtZVswXTtcbiAgICAgICAgICAgIG91dHB1dFtkcy51cmldID0ge1xuICAgICAgICAgICAgICBpZDogZHMuaWRlbnRpZmllcixcbiAgICAgICAgICAgICAgdXJpOiBkcy51cmksXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBkcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgdHlwZTogZHMudHlwZSxcbiAgICAgICAgICAgICAgaWNvblVybDogZHMuaWNvblVybFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YVByb21pc2U7XG4gICAgcmV0dXJuIGRhdGFQcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcHJvbWlzZSBjb250YWluaW5nIGRhdGEgc291cmNlcyBmcm9tIFBDLlxuICAgKiBAbWV0aG9kIGRhdGFzb3VyY2VzI2ZldGNoXG4gICAqIEByZXR1cm5zIHtQcm9taXNlPG9iamVjdD59IC0gUmV0dXJucyBjYWNoZWQgcHJvbWlzZSBmcm9tIHRoZSBmZXRjaCBtZXRob2RcbiAgICovXG4gIGZldGNoKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2hlcyB0aGUgbG9nbyBmb3IgdGhlIGRhdGFzb3VyY2UgdXNpbmcgZWl0aGVyIGRhdGFzb3VyY2VzIFVSSSBvciBuYW1lLiBJbnRlbmRlZCB0byBiZSB1c2VkIHRvIGdlbmVyYXRlIGltYWdlIHRhZ3MgZm9yIHRodW1ibmFpbHMuXG4gICAqIEBtZXRob2QgZGF0YXNvdXJjZXMjbG9va3VwSWNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZHNVcmlPck5hbWUgLSBFaXRoZXIgVVJJIG9yIG5hbWUgb2YgdGhlIGRhdGEgc291cmNlXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gbG9nb1VybCAtIFByb21pc2UgY29udGFpbmluZyBVUkwgb2YgZGF0YXNvdXJjZSBpbiBxdWVzdGlvbiwgZWxzZSB1bmRlZmluZWQgaWYgZGF0YXNvdXJjZSBub3QgZm91bmRcbiAgICovXG4gIGxvb2t1cEljb24oZHNVcmlPck5hbWUpIHtcbiAgICBkc1VyaU9yTmFtZSA9IGRzVXJpT3JOYW1lIHx8IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS50aGVuKChkYXRhU291cmNlcykgPT4ge1xuICAgICAgZm9yICh2YXIga2V5IGluIGRhdGFTb3VyY2VzKSB7XG4gICAgICAgIHZhciBkcyA9IGRhdGFTb3VyY2VzW2tleV07XG4gICAgICAgIGlmIChkcy51cmkgPT0gZHNVcmlPck5hbWUgfHwgZHMubmFtZS50b0xvd2VyQ2FzZSgpID09IGRzVXJpT3JOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICByZXR1cm4gZHMuaWNvblVybDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgZ2V0IHdlYiBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKiBAYWxpYXMgZ2V0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2V0IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpc2VzIGdldC4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwiZ2V0XCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgZ2V0IHJlcXVlc3QuIFdpbGwgb3ZlcndyaXRlIGV4aXN0aW5nIHF1ZXJ5IHNldHRpbmdzLlxuICAgKiBAbWV0aG9kIGdldCNxdWVyeVxuICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnlPYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ2V0IGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcbiAgICB0aGlzLnJlcXVlc3QucXVlcnkocXVlcnlPYmplY3QpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB1cmkgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ2V0IHJlcXVlc3RcbiAgICogQG1ldGhvZCBnZXQjdXJpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHVyaSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ1cmlcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ2V0IHJlcXVlc3RcbiAgICogQG1ldGhvZCBnZXQjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgZ2V0I2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xudmFyIHNvdXJjZUNoZWNrID0gcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKS5zb3VyY2VDaGVjaztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUGVmb3JtcyBhIGdyYXBoIHdlYiBxdWVyeSB0byB0aGUgUGF0aHdheSBDb21tb25zIHdlYiBzZXJ2aWNlXG4gKiBAYWxpYXMgZ3JhcGhcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHcmFwaCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXNlcyBncmFwaC4gQ2hhaW5hYmxlLlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwiZ3JhcGhcIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCBncmFwaCNxdWVyeVxuICAgKiBAcGFyYW0ge29iamVjdH0gcXVlcnlPYmplY3QgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNlbnQgYWxvbmcgd2l0aCB0aGUgZ3JhcGggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGtpbmQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI2tpbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0ga2luZFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGtpbmQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwia2luZFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHNvdXJjZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjc291cmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSB2YWx1ZSAtIHNvdXJjZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHNvdXJjZSh2YWx1ZSwgZGF0YXNvdXJjZSkge1xuICAgIGlmIChkYXRhc291cmNlID09PSB1bmRlZmluZWQgfHwgc291cmNlQ2hlY2soZGF0YXNvdXJjZSwgdmFsdWUpKSB7XG4gICAgICB0aGlzLnJlcXVlc3Quc2V0KFwic291cmNlXCIsIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKHZhbHVlICsgXCIgaXMgYW4gaW52YWxpZCBcIiArIGRhdGFzb3VyY2UudG9VcHBlckNhc2UoKSArIFwiIElEXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGFyZ2V0IHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIGdyYXBoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBncmFwaCN0YXJnZXRcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gdGFyZ2V0XG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgdGFyZ2V0KHZhbHVlLCBkYXRhc291cmNlKSB7XG4gICAgaWYgKGRhdGFzb3VyY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXF1ZXN0LnNldChcInRhcmdldFwiLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvdXJjZUNoZWNrKGRhdGFzb3VyY2UsIHZhbHVlKSA/IHRoaXMucmVxdWVzdC5zZXQoXCJ0YXJnZXRcIiwgdmFsdWUpIDogKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IodmFsdWUgKyBcIiBpbnZhbGlkIFwiICsgZGF0YXNvdXJjZSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkaXJlY3Rpb24gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI2RpcmVjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBkaXJlY3Rpb25cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBkaXJlY3Rpb24odmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZGlyZWN0aW9uXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgbGltaXQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI2xpbWl0XG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIGxpbWl0XG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgbGltaXQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwibGltaXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI2Zvcm1hdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBmb3JtYXRcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwiZm9ybWF0XCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGF0YXNvdXJjZSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSBncmFwaCByZXF1ZXN0XG4gICAqIEBtZXRob2QgZ3JhcGgjZGF0YXNvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBkYXRhc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGF0YXNvdXJjZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkYXRhc291cmNlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgZ3JhcGggcmVxdWVzdFxuICAgKiBAbWV0aG9kIGdyYXBoI29yZ2FuaXNtXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIG9yZ2FuaXNtXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgb3JnYW5pc20odmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwib3JnYW5pc21cIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgZ3JhcGgjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gcmVzcG9uc2UgaGVhZGVyc1xuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGNBZGRyZXNzOiBcImh0dHA6Ly93d3cucGF0aHdheWNvbW1vbnMub3JnL3BjMi9cIixcblxuICBpZFByZWZpeDogXCJwYXRod2F5Y29tbW9ucy1qcy1saWI6XCIsXG5cbiAgZHNJZFZhbGlkYXRpb246IHtcbiAgICB1bmlwcm90OiBpZCA9PiAvXihbQS1OLFItWl1bMC05XShbQS1aXVtBLVosIDAtOV1bQS1aLCAwLTldWzAtOV0pezEsMn0pfChbTyxQLFFdWzAtOV1bQS1aLCAwLTldW0EtWiwgMC05XVtBLVosIDAtOV1bMC05XSkoXFwuXFxkKyk/JC8udGVzdChpZCksXG4gICAgY2hlYmk6IGlkID0+IC9eQ0hFQkk6XFxkKyQvLnRlc3QoaWQpICYmIChpZC5sZW5ndGggPD0gKFwiQ0hFQkk6XCIubGVuZ3RoICsgNikpLFxuICAgIGhnbmM6IGlkID0+IC9eW0EtWmEtei0wLTlfXSsoXFxAKT8kLy50ZXN0KGlkKSxcbiAgICByZWZzZXE6IGlkID0+IC9eKChBQ3xBUHxOQ3xOR3xOTXxOUHxOUnxOVHxOV3xYTXxYUHxYUnxZUHxaUClfXFxkK3woTlpcXF9bQS1aXXs0fVxcZCspKShcXC5cXGQrKT8kLy50ZXN0KGlkKSxcbiAgICBrZWdncGF0aHdheTogaWQgPT4gL15cXHd7Miw0fVxcZHs1fSQvLnRlc3QoaWQpLFxuICAgIGtlZ2dkcnVnOiBpZCA9PiAvXkRcXGQrJC8udGVzdChpZCksXG4gICAgc21wZGI6IGlkID0+IC9eU01QXFxkezV9JC8udGVzdChpZCksXG4gICAgZHJ1Z2Jhbms6IGlkID0+IC9eREJcXGR7NX0kLy50ZXN0KGlkKVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtIFN0cmluZyB0byBiZSBjaGVja2VkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpbnB1dCBpcyBhIG5vbi1lbXB0eSBzdHJpbmcgZWxzZSByZXR1cm5zIGZhbHNlXG4gICAqL1xuICB2YWxpZGF0ZVN0cmluZzogKHN0cmluZykgPT4ge1xuICAgIGlmICgodHlwZW9mIHN0cmluZyA9PT0gXCJzdHJpbmdcIikgJiYgKHN0cmluZy5sZW5ndGggIT09IDApKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlucHV0U3RyaW5nIC0gU3RyaW5nIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7c3RyaW5nfSBDbGVhbiBzdHJpbmdcbiAgICovXG4gIGVzY2FwZUx1Y2VuZTogKGlucHV0U3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIGlucHV0U3RyaW5nLnJlcGxhY2UoLyhbXFwhXFwqXFwrXFwtXFwmXFx8XFwoXFwpXFxbXFxdXFx7XFx9XFxeXFx+XFw/XFw6XFwvXFxcXFwiXSkvZywgXCJcXFxcJDFcIik7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cy5qcycpO1xuXG52YXIgZmV0Y2ggPSByZXF1aXJlKCdmZXRjaC1wb255ZmlsbCcpKCkuZmV0Y2g7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoJ2xvZGFzaC9pc0VtcHR5Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC9pc0FycmF5Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCdsb2Rhc2gvaXNPYmplY3QnKTtcbnZhciBzdHJpbmdpZnkgPSByZXF1aXJlKCdxdWVyeS1zdHJpbmcnKS5zdHJpbmdpZnk7XG5cbnZhciB1dGlsaXRpZXMgPSByZXF1aXJlKCcuLi91dGlsaXRpZXMuanMnKTtcbnZhciB2YWxpZGF0ZVN0cmluZyA9IHJlcXVpcmUoJy4vaGVscGVycy5qcycpLnZhbGlkYXRlU3RyaW5nO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBDbGFzcyBmb3IgdXNlIGluIGZldGNoIHJlcXVlc3RzIHRvIFBhdGh3YXkgQ29tbW9uc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBjUmVxdWVzdCB7XG4gIGNvbnN0cnVjdG9yKGNvbW1hbmRWYWx1ZSwgc3VibWl0SWQsIHVzZXJPdmVycmlkZSkge1xuICAgIGlmICghKHZhbGlkYXRlU3RyaW5nKGNvbW1hbmRWYWx1ZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJQY1JlcXVlc3QgY29uc3RydWN0b3IgcGFyYW1ldGVyIGludmFsaWRcIik7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInN1Ym1pdElkXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gKHN1Ym1pdElkID09PSBmYWxzZSkgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiY29tbWFuZFwiLCB7XG4gICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRWYWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ1c2VyXCIsIHtcbiAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gdXNlck92ZXJyaWRlID8gdXNlck92ZXJyaWRlIDogdXRpbGl0aWVzLnVzZXIoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucXVlcnlPYmplY3QgPSB7fTtcbiAgICB0aGlzLmZvcm1hdFN0cmluZyA9IFwiXCI7XG4gIH1cblxuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIGlmIChpc09iamVjdChxdWVyeU9iamVjdCkpIHtcbiAgICAgIHRoaXMucXVlcnlPYmplY3QgPSBPYmplY3QuYXNzaWduKHt9LCBxdWVyeU9iamVjdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocGFyYW1ldGVyLCB2YWx1ZSkge1xuICAgIHBhcmFtZXRlciA9IFN0cmluZyhwYXJhbWV0ZXIpO1xuICAgIGlmIChwYXJhbWV0ZXIgIT09IFwiXCIpIHtcbiAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCAoaXNBcnJheSh2YWx1ZSkgJiYgIWlzRW1wdHkodmFsdWUpKSkge1xuICAgICAgICB0aGlzLmRlbGV0ZShwYXJhbWV0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeU9iamVjdFtwYXJhbWV0ZXJdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocGFyYW1ldGVyKSB7XG4gICAgZGVsZXRlIHRoaXMucXVlcnlPYmplY3RbcGFyYW1ldGVyXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9ybWF0KGZvcm1hdFN0cmluZykge1xuICAgIGNvbnN0IGFjY2VwdGVkU3RyaW5ncyA9IFtcbiAgICAgIFwianNvblwiLFxuICAgICAgXCJ4bWxcIixcbiAgICAgIFwiXCJcbiAgICBdO1xuXG4gICAgaWYgKGFjY2VwdGVkU3RyaW5ncy5pbmRleE9mKGZvcm1hdFN0cmluZykgIT09IC0xKSB7XG4gICAgICB0aGlzLmZvcm1hdFN0cmluZyA9IGZvcm1hdFN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZldGNoKCkge1xuICAgIHZhciB1cmwgPSBjb25zdGFudHMucGNBZGRyZXNzICsgdGhpcy5jb21tYW5kICsgKHRoaXMuZm9ybWF0U3RyaW5nID8gXCIuXCIgKyB0aGlzLmZvcm1hdFN0cmluZyA6IFwiXCIpICsgXCI/XCIgKyBzdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5xdWVyeU9iamVjdCwgdGhpcy5zdWJtaXRJZCA/IHtcbiAgICAgIHVzZXI6IHRoaXMudXNlclxuICAgIH0gOiB7fSkpO1xuXG4gICAgcmV0dXJuIGZldGNoKHVybCwge21ldGhvZDogJ0dFVCcsIG1vZGU6ICduby1jb3JzJ30pLnRoZW4ocmVzID0+IHtcbiAgICAgIHN3aXRjaCAocmVzLnN0YXR1cykge1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICAvLyBUbyByZWFkIGhlYWRlcnMgZnJvbSBib3RoIG5vZGUgYW5kIGJyb3dzZXIgZmV0Y2hcbiAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSByZXMuaGVhZGVycy5faGVhZGVycyA/IHJlcy5oZWFkZXJzLl9oZWFkZXJzW1wiY29udGVudC10eXBlXCJdWzBdIDogcmVzLmhlYWRlcnMubWFwW1wiY29udGVudC10eXBlXCJdO1xuICAgICAgICAgIHJldHVybiBjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG52YXIgZXNjYXBlTHVjZW5lID0gcmVxdWlyZSgnLi9wcml2YXRlL2hlbHBlcnMuanMnKS5lc2NhcGVMdWNlbmU7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBzZWFyY2ggd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyBzZWFyY2hcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZWFyY2gge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgc2VhcmNoLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge29iamVjdH0gW3F1ZXJ5T2JqZWN0XSAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlcXVlc3QgPSBuZXcgUGNSZXF1ZXN0KFwic2VhcmNoXCIpLmZvcm1hdChcImpzb25cIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSBzZWFyY2ggcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2Qgc2VhcmNoI3F1ZXJ5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBxdWVyeU9iamVjdCAtIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gYmUgc2VudCBhbG9uZyB3aXRoIHRoZSBzZWFyY2ggY29tbWFuZC5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxdWVyeShxdWVyeU9iamVjdCkge1xuICAgIHRoaXMucmVxdWVzdC5xdWVyeShxdWVyeU9iamVjdCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHEgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjcVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB1cmlcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInFcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBwYWdlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHNlYXJjaCByZXF1ZXN0XG4gICAqIEBtZXRob2Qgc2VhcmNoI3BhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gcGFnZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHBhZ2UodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicGFnZVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGFzb3VyY2UgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjZGF0YXNvdXJjZVxuICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gdmFsdWUgLSBkYXRhc291cmNlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgZGF0YXNvdXJjZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJkYXRhc291cmNlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJvcmdhbmlzbVwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHR5cGUgcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgc2VhcmNoIHJlcXVlc3RcbiAgICogQG1ldGhvZCBzZWFyY2gjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB0eXBlXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgdHlwZSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ0eXBlXCIsIHZhbHVlKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEVzY2FwZXMgd2hhdGV2ZXIgdmFsdWUgaXMgY29udGFpbmVkIGluIHEgYXQgdGhlIG1vbWVudFxuICAgKiBAbWV0aG9kIHNlYXJjaCNlc2NhcGVcbiAgICogQHBhcmFtIHtib29sZWFufSBbdG9nZ2xlPXRydWVdIC0gU3dpdGNoZXMgbHVjZW5lIGVzY2FwaW5nIG9uIG9yIG9mZi5cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBlc2NhcGUodG9nZ2xlKSB7XG4gICAgaWYodG9nZ2xlID09PSB1bmRlZmluZWQgfHwgdG9nZ2xlID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnEoZXNjYXBlTHVjZW5lKHRoaXMucmVxdWVzdC5xdWVyeU9iamVjdC5xKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtYXQgb2YgcmV0dXJuZWQgZGF0YVxuICAgKiBAbWV0aG9kIHNlYXJjaCNmb3JtYXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdFN0cmluZ1xuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdChmb3JtYXRTdHJpbmcpIHtcbiAgICB0aGlzLnJlcXVlc3QuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIGZldGNoIGNhbGwgdG8gdGhlIFBDIEFQSSBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICogQG1ldGhvZCBzZWFyY2gjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBjUmVxdWVzdCA9IHJlcXVpcmUoJy4vcHJpdmF0ZS9wYy1yZXF1ZXN0LmpzJyk7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBlZm9ybXMgYSBnZXQgd2ViIHF1ZXJ5IHRvIHRoZSBQYXRod2F5IENvbW1vbnMgd2ViIHNlcnZpY2VcbiAqIEBhbGlhcyB0b3BfcGF0aHdheXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUb3BfUGF0aHdheXMge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgdG9wX3BhdGh3YXlzLiBDaGFpbmFibGUuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVxdWVzdCA9IG5ldyBQY1JlcXVlc3QoXCJ0b3BfcGF0aHdheXNcIik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgcXVlcnkgcGFyYW1ldGVycyB3aGljaCBhcmUgc2VudCB3aXRoIHRoZSByZXF1ZXN0LiBXaWxsIG92ZXJ3cml0ZSBleGlzdGluZyBxdWVyeSBzZXR0aW5ncy5cbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIGdldCBjb21tYW5kLlxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHF1ZXJ5KHF1ZXJ5T2JqZWN0KSB7XG4gICAgdGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgcSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0b3BfcGF0aHdheXMgcmVxdWVzdFxuICAgKiBAbWV0aG9kIHRvcF9wYXRod2F5cyNxXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHFcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBxKHZhbHVlKSB7XG4gICAgdGhpcy5yZXF1ZXN0LnNldChcInFcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkYXRhc291cmNlIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRvcF9wYXRod2F5cyByZXF1ZXN0XG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2RhdGFzb3VyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHZhbHVlIC0gZGF0YXNvdXJjZVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGRhdGFzb3VyY2UodmFsdWUpIHtcblx0dGhpcy5yZXF1ZXN0LnNldChcImRhdGFzb3VyY2VcIiwgdmFsdWUpO1xuXG5cdHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgb3JnYW5pc20gcGFyYW1ldGVyIHdoaWNoIGlzIHRvIGJlIHNlbnQgd2l0aCB0aGUgdG9wX3BhdGh3YXlzIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjb3JnYW5pc21cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gb3JnYW5pc21cbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBvcmdhbmlzbSh2YWx1ZSkge1xuXHR0aGlzLnJlcXVlc3Quc2V0KFwib3JnYW5pc21cIiwgdmFsdWUpO1xuXG5cdHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybWF0IG9mIHJldHVybmVkIGRhdGFcbiAgICogQG1ldGhvZCB0b3BfcGF0aHdheXMjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGZvcm1hdFxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIGZvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJmb3JtYXRcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdG9wX3BhdGh3YXlzI2ZldGNoXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPnxQcm9taXNlPG9iamVjdD59IC0gUHJvbWlzZSByZXR1cm5pbmcgZWl0aGVyIGFuIG9iamVjdCBvciBzdHJpbmcgZGVwZW5kaW5nIG9uIGZvcm1hdFxuICAgKi9cbiAgZmV0Y2goKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdC5mZXRjaCgpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBQY1JlcXVlc3QgPSByZXF1aXJlKCcuL3ByaXZhdGUvcGMtcmVxdWVzdC5qcycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQZWZvcm1zIGEgdHJhdmVyc2UgcXVlcnkgdG8gdGhlIFBhdGh3YXkgQ29tbW9ucyB3ZWIgc2VydmljZVxuICogQGFsaWFzIHRyYXZlcnNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhdmVyc2Uge1xuICAvKipcbiAgICogSW5pdGlhbGlzZXMgdHJhdmVyc2UuIENoYWluYWJsZS5cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXF1ZXN0ID0gbmV3IFBjUmVxdWVzdChcInRyYXZlcnNlXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYWxsIHF1ZXJ5IHBhcmFtZXRlcnMgd2hpY2ggYXJlIHNlbnQgd2l0aCB0aGUgdHJhdmVyc2UgcmVxdWVzdC4gV2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgcXVlcnkgc2V0dGluZ3MuXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjcXVlcnlcbiAgICogQHBhcmFtIHtvYmplY3R9IHF1ZXJ5T2JqZWN0IC0gT2JqZWN0IHJlcHJlc2VudGluZyB0aGUgcXVlcnkgcGFyYW1ldGVycyB0byBiZSBzZW50IGFsb25nIHdpdGggdGhlIHRyYXZlcnNlIGNvbW1hbmQuXG4gICAqIEByZXR1cm5zIHt0aGlzfVxuICAgKi9cbiAgcXVlcnkocXVlcnlPYmplY3QpIHtcblx0dGhpcy5yZXF1ZXN0LnF1ZXJ5KHF1ZXJ5T2JqZWN0KTtcblxuXHRyZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVyaSBwYXJhbWV0ZXIgd2hpY2ggaXMgdG8gYmUgc2VudCB3aXRoIHRoZSB0cmF2ZXJzZSByZXF1ZXN0XG4gICAqIEBtZXRob2QgdHJhdmVyc2UjdXJpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHVyaSh2YWx1ZSkge1xuICAgIHRoaXMucmVxdWVzdC5zZXQoXCJ1cmlcIiwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBwYXRoIHBhcmFtZXRlciB3aGljaCBpcyB0byBiZSBzZW50IHdpdGggdGhlIHRyYXZlcnNlIHJlcXVlc3RcbiAgICogQG1ldGhvZCB0cmF2ZXJzZSNwYXRoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHVyaVxuICAgKiBAcmV0dXJucyB7dGhpc31cbiAgICovXG4gIHBhdGgodmFsdWUpIHtcbiAgICB0aGlzLnJlcXVlc3Quc2V0KFwicGF0aFwiLCB2YWx1ZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvcm1hdCBvZiByZXR1cm5lZCBkYXRhXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjZm9ybWF0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtYXRTdHJpbmdcbiAgICogQHJldHVybnMge3RoaXN9XG4gICAqL1xuICBmb3JtYXQoZm9ybWF0U3RyaW5nKSB7XG4gICAgdGhpcy5yZXF1ZXN0LmZvcm1hdChmb3JtYXRTdHJpbmcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBmZXRjaCBjYWxsIHRvIHRoZSBQQyBBUEkgYW5kIHJldHVybiByZXN1bHRzXG4gICAqIEBtZXRob2QgdHJhdmVyc2UjZmV0Y2hcbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fFByb21pc2U8b2JqZWN0Pn0gLSBQcm9taXNlIHJldHVybmluZyBlaXRoZXIgYW4gb2JqZWN0IG9yIHN0cmluZyBkZXBlbmRpbmcgb24gZm9ybWF0XG4gICAqL1xuICBmZXRjaCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmZldGNoKCk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmZXRjaCA9IHJlcXVpcmUoJ2ZldGNoLXBvbnlmaWxsJykoKS5mZXRjaDtcbnZhciB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0Jyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9wcml2YXRlL2NvbnN0YW50cy5qcycpO1xuXG4vLyBEZWNsYXJlIHByaXZhdGUgdmFyaWFibGVzXG52YXIgX2lkO1xuXG4vKipcbiAqIEBtb2R1bGUgdXRpbGl0aWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtuZXdJZF0gLSBJZiBnaXZlbiBzdHJpbmcsIHNldHMgYSBuZXcgdXNlciBJRC4gSWYgbnVsbCwgdHVybnMgb2YgdXNlciBpZC4gRWxzZSBzaW1wbHkgcmV0dXJucyBjdXJyZW50IElELlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGlkIC0gQ3VycmVudCB1c2VyIElEXG4gICAqL1xuICB1c2VyOiAobmV3SWQpID0+IHtcbiAgICBpZihfaWQgPT09IHVuZGVmaW5lZCB8fCBuZXdJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZih0eXBlb2YgbmV3SWQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgbmV3SWQgPSBjb25zdGFudHMuaWRQcmVmaXggKyBuZXdJZDtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYobmV3SWQgPT09IG51bGwpIHtcbiAgICAgICAgbmV3SWQgPSBcIlwiO1xuICAgICAgfVxuICAgICAgZWxzZSBpZihuZXdJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld0lkID0gY29uc3RhbnRzLmlkUHJlZml4ICsgdXVpZFY0KCk7XG4gICAgICB9XG4gICAgICBfaWQgPSBuZXdJZDtcbiAgICB9XG4gICAgcmV0dXJuIF9pZDtcbiAgfSxcblxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lb3V0PTEwMDBdIFNldHMgbGVuZ3RoIG9mIHRpbWUgYmVmb3JlIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFBDMiBTdGF0dXNcbiAgICovXG4gIHBjQ2hlY2s6ICh0aW1lb3V0KSA9PiB7IC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzXG4gICAgdmFyIGFkZHJlc3MgPSBjb25zdGFudHMucGNBZGRyZXNzICsgXCJzZWFyY2g/cT1wNTNcIjtcbiAgICB2YXIgdGltZW91dFZhbHVlID0gTnVtYmVyKHRpbWVvdXQgIT0gbnVsbCA/IHRpbWVvdXQgOiAwKSB8fCAxMDAwOyAvLyBkZWZhdWx0IHRpbWVvdXQgaXMgMTAwMG1zXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgWE1MSHR0cFJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gQXNzdW1lIGJyb3dzZXJzaWRlOiBkb25lIHVzaW5nIHhociBiZWNhdXNlIG5ldHdvcmsgY29ubmVjdGlvbnMgY2FuY2VsbGFibGVcbiAgICAgICAgdmFyIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB0aW1lb3V0UmVmID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgeGh0dHAuYWJvcnQoKTtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dFZhbHVlKTtcbiAgICAgICAgeGh0dHAub3BlbihcIkdFVFwiLCBhZGRyZXNzKTtcbiAgICAgICAgeGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh4aHR0cC5yZWFkeVN0YXRlID09PSBYTUxIdHRwUmVxdWVzdC5ET05FICYmIHhodHRwLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFJlZik7XG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuICAgICAgfSBlbHNlIHsgLy8gQXNzdW1lIHNlcnZlcnNpZGU6IGRvbmUgdXNpbmcgZmV0Y2ggYXMgcG9ueWZpbGwgYWxyZWFkeSBhdmFpbGFibGUgYW5kIHJlc2lkdWFsIG5ldHdvcmsgY29ubmVjdGlvbnMgaW1tYXRlcmlhbFxuICAgICAgICB2YXIgdGltZW91dFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCB0aW1lb3V0VmFsdWUpO1xuICAgICAgICBmZXRjaChhZGRyZXNzLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dFZhbHVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRSZWYpO1xuICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0UmVmKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc291cmNlTmFtZSAtIE5hbWUgb2Ygc291cmNlIHR5cGUgdG8gdmFsaWRhdGUgYWdhaW5zdCAoZWcuIHVuaXByb3QpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIElEIHRvIHZhbGlkYXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IGlkVmFsaWRpdHlcbiAgICovXG4gIHNvdXJjZUNoZWNrOiAoc291cmNlTmFtZSwgaWQpID0+IHtcbiAgICB2YXIgY2hlY2tGdW5jdGlvbiA9IGNvbnN0YW50cy5kc0lkVmFsaWRhdGlvbltcbiAgICAgIHNvdXJjZU5hbWVcblx0ICAgICAgLnRvTG93ZXJDYXNlKCkgLy8gTWFrZSBhbGwgbG93ZXJjYXNlXG5cdCAgICAgIC5yZXBsYWNlKC9bXmEtekEtWjAtOV0vZywgXCJcIikgLy8gUmVtb3ZlIGFueSBub24gbGV0dGVyIG9yIG51bWJlciBzeW1ib2xzXG4gICAgXTtcbiAgICBpZiAodHlwZW9mIGNoZWNrRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGNoZWNrRnVuY3Rpb24oaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3Ioc291cmNlTmFtZSArIFwiIGlzIGFuIGludmFsaWQgc291cmNlXCIpO1xuICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBmaWxlT3ZlcnZpZXcgUGF0aHdheSBDb21tb25zIEFjY2VzcyBMaWJyYXJ5IEluZGV4XG4gKiBAYXV0aG9yIE1hbmZyZWQgQ2hldW5nXG4gKiBAdmVyc2lvbjogMC4xXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHV0aWxpdGllczogcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKSxcbiAgZGF0YXNvdXJjZXM6IG5ldyhyZXF1aXJlKCcuL2RhdGFzb3VyY2VzLmpzJykpKCksXG4gIGdldDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dldC5qcycpKSgpKSxcbiAgc2VhcmNoOiAoKCkgPT4gbmV3KHJlcXVpcmUoJy4vc2VhcmNoLmpzJykpKCkpLFxuICB0cmF2ZXJzZTogKCgpID0+IG5ldyhyZXF1aXJlKCcuL3RyYXZlcnNlLmpzJykpKCkpLFxuICBncmFwaDogKCgpID0+IG5ldyhyZXF1aXJlKCcuL2dyYXBoLmpzJykpKCkpLFxuICB0b3BfcGF0aHdheXM6ICgoKSA9PiBuZXcocmVxdWlyZSgnLi90b3BfcGF0aHdheXMuanMnKSkoKSlcbn07XG4iXX0=
