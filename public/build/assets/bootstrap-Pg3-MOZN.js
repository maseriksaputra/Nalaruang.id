//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/axios/lib/helpers/bind.js
/**
* Create a bound version of a function with a specified `this` context
*
* @param {Function} fn - The function to bind
* @param {*} thisArg - The value to be passed as the `this` parameter
* @returns {Function} A new function that will call the original function with the specified `this` context
*/
function bind(fn, thisArg) {
	return function wrap() {
		return fn.apply(thisArg, arguments);
	};
}
//#endregion
//#region node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var kindOf = ((cache) => (thing) => {
	const str = toString.call(thing);
	return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
var kindOfTest = (type) => {
	type = type.toLowerCase();
	return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
/**
* Determine if a value is a non-null object
*
* @param {Object} val The value to test
*
* @returns {boolean} True if value is an Array, otherwise false
*/
var { isArray } = Array;
/**
* Determine if a value is undefined
*
* @param {*} val The value to test
*
* @returns {boolean} True if the value is undefined, otherwise false
*/
var isUndefined = typeOfTest("undefined");
/**
* Determine if a value is a Buffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Buffer, otherwise false
*/
function isBuffer(val) {
	return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
* Determine if a value is an ArrayBuffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is an ArrayBuffer, otherwise false
*/
var isArrayBuffer = kindOfTest("ArrayBuffer");
/**
* Determine if a value is a view on an ArrayBuffer
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
*/
function isArrayBufferView(val) {
	let result;
	if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
	else result = val && val.buffer && isArrayBuffer(val.buffer);
	return result;
}
/**
* Determine if a value is a String
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a String, otherwise false
*/
var isString = typeOfTest("string");
/**
* Determine if a value is a Function
*
* @param {*} val The value to test
* @returns {boolean} True if value is a Function, otherwise false
*/
var isFunction$1 = typeOfTest("function");
/**
* Determine if a value is a Number
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Number, otherwise false
*/
var isNumber = typeOfTest("number");
/**
* Determine if a value is an Object
*
* @param {*} thing The value to test
*
* @returns {boolean} True if value is an Object, otherwise false
*/
var isObject = (thing) => thing !== null && typeof thing === "object";
/**
* Determine if a value is a Boolean
*
* @param {*} thing The value to test
* @returns {boolean} True if value is a Boolean, otherwise false
*/
var isBoolean = (thing) => thing === true || thing === false;
/**
* Determine if a value is a plain Object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a plain Object, otherwise false
*/
var isPlainObject = (val) => {
	if (kindOf(val) !== "object") return false;
	const prototype = getPrototypeOf(val);
	return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};
/**
* Determine if a value is an empty object (safely handles Buffers)
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is an empty object, otherwise false
*/
var isEmptyObject = (val) => {
	if (!isObject(val) || isBuffer(val)) return false;
	try {
		return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
	} catch (e) {
		return false;
	}
};
/**
* Determine if a value is a Date
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Date, otherwise false
*/
var isDate = kindOfTest("Date");
/**
* Determine if a value is a File
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a File, otherwise false
*/
var isFile = kindOfTest("File");
/**
* Determine if a value is a React Native Blob
* React Native "blob": an object with a `uri` attribute. Optionally, it can
* also have a `name` and `type` attribute to specify filename and content type
*
* @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
*
* @param {*} value The value to test
*
* @returns {boolean} True if value is a React Native Blob, otherwise false
*/
var isReactNativeBlob = (value) => {
	return !!(value && typeof value.uri !== "undefined");
};
/**
* Determine if environment is React Native
* ReactNative `FormData` has a non-standard `getParts()` method
*
* @param {*} formData The formData to test
*
* @returns {boolean} True if environment is React Native, otherwise false
*/
var isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
/**
* Determine if a value is a Blob
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Blob, otherwise false
*/
var isBlob = kindOfTest("Blob");
/**
* Determine if a value is a FileList
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a FileList, otherwise false
*/
var isFileList = kindOfTest("FileList");
/**
* Determine if a value is a Stream
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a Stream, otherwise false
*/
var isStream = (val) => isObject(val) && isFunction$1(val.pipe);
/**
* Determine if a value is a FormData
*
* @param {*} thing The value to test
*
* @returns {boolean} True if value is an FormData, otherwise false
*/
function getGlobal() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	return {};
}
var G = getGlobal();
var FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
var isFormData = (thing) => {
	if (!thing) return false;
	if (FormDataCtor && thing instanceof FormDataCtor) return true;
	const proto = getPrototypeOf(thing);
	if (!proto || proto === Object.prototype) return false;
	if (!isFunction$1(thing.append)) return false;
	const kind = kindOf(thing);
	return kind === "formdata" || kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]";
};
/**
* Determine if a value is a URLSearchParams object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a URLSearchParams object, otherwise false
*/
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = [
	"ReadableStream",
	"Request",
	"Response",
	"Headers"
].map(kindOfTest);
/**
* Trim excess whitespace off the beginning and end of a string
*
* @param {String} str The String to trim
*
* @returns {String} The String freed of excess whitespace
*/
var trim = (str) => {
	return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
};
/**
* Iterate over an Array or an Object invoking a function for each item.
*
* If `obj` is an Array callback will be called passing
* the value, index, and complete array for each item.
*
* If 'obj' is an Object callback will be called passing
* the value, key, and complete object for each property.
*
* @param {Object|Array<unknown>} obj The object to iterate
* @param {Function} fn The callback to invoke for each item
*
* @param {Object} [options]
* @param {Boolean} [options.allOwnKeys = false]
* @returns {any}
*/
function forEach(obj, fn, { allOwnKeys = false } = {}) {
	if (obj === null || typeof obj === "undefined") return;
	let i;
	let l;
	if (typeof obj !== "object") obj = [obj];
	if (isArray(obj)) for (i = 0, l = obj.length; i < l; i++) fn.call(null, obj[i], i, obj);
	else {
		if (isBuffer(obj)) return;
		const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
		const len = keys.length;
		let key;
		for (i = 0; i < len; i++) {
			key = keys[i];
			fn.call(null, obj[key], key, obj);
		}
	}
}
/**
* Finds a key in an object, case-insensitive, returning the actual key name.
* Returns null if the object is a Buffer or if no match is found.
*
* @param {Object} obj - The object to search.
* @param {string} key - The key to find (case-insensitive).
* @returns {?string} The actual key name if found, otherwise null.
*/
function findKey(obj, key) {
	if (isBuffer(obj)) return null;
	key = key.toLowerCase();
	const keys = Object.keys(obj);
	let i = keys.length;
	let _key;
	while (i-- > 0) {
		_key = keys[i];
		if (key === _key.toLowerCase()) return _key;
	}
	return null;
}
var _global = (() => {
	if (typeof globalThis !== "undefined") return globalThis;
	return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
/**
* Accepts varargs expecting each argument to be an object, then
* immutably merges the properties of each object and returns result.
*
* When multiple objects contain the same key the later object in
* the arguments list will take precedence.
*
* Example:
*
* ```js
* const result = merge({foo: 123}, {foo: 456});
* console.log(result.foo); // outputs 456
* ```
*
* @param {Object} obj1 Object to merge
*
* @returns {Object} Result of all merge properties
*/
function merge(...objs) {
	const { caseless, skipUndefined } = isContextDefined(this) && this || {};
	const result = {};
	const assignValue = (val, key) => {
		if (key === "__proto__" || key === "constructor" || key === "prototype") return;
		const targetKey = caseless && findKey(result, key) || key;
		const existing = hasOwnProperty(result, targetKey) ? result[targetKey] : void 0;
		if (isPlainObject(existing) && isPlainObject(val)) result[targetKey] = merge(existing, val);
		else if (isPlainObject(val)) result[targetKey] = merge({}, val);
		else if (isArray(val)) result[targetKey] = val.slice();
		else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
	};
	for (let i = 0, l = objs.length; i < l; i++) objs[i] && forEach(objs[i], assignValue);
	return result;
}
/**
* Extends object a by mutably adding to it the properties of object b.
*
* @param {Object} a The object to be extended
* @param {Object} b The object to copy properties from
* @param {Object} thisArg The object to bind function to
*
* @param {Object} [options]
* @param {Boolean} [options.allOwnKeys]
* @returns {Object} The resulting value of object a
*/
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
	forEach(b, (val, key) => {
		if (thisArg && isFunction$1(val)) Object.defineProperty(a, key, {
			__proto__: null,
			value: bind(val, thisArg),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else Object.defineProperty(a, key, {
			__proto__: null,
			value: val,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}, { allOwnKeys });
	return a;
};
/**
* Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
*
* @param {string} content with BOM
*
* @returns {string} content value without BOM
*/
var stripBOM = (content) => {
	if (content.charCodeAt(0) === 65279) content = content.slice(1);
	return content;
};
/**
* Inherit the prototype methods from one constructor into another
* @param {function} constructor
* @param {function} superConstructor
* @param {object} [props]
* @param {object} [descriptors]
*
* @returns {void}
*/
var inherits = (constructor, superConstructor, props, descriptors) => {
	constructor.prototype = Object.create(superConstructor.prototype, descriptors);
	Object.defineProperty(constructor.prototype, "constructor", {
		__proto__: null,
		value: constructor,
		writable: true,
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(constructor, "super", {
		__proto__: null,
		value: superConstructor.prototype
	});
	props && Object.assign(constructor.prototype, props);
};
/**
* Resolve object with deep prototype chain to a flat object
* @param {Object} sourceObj source object
* @param {Object} [destObj]
* @param {Function|Boolean} [filter]
* @param {Function} [propFilter]
*
* @returns {Object}
*/
var toFlatObject = (sourceObj, destObj, filter, propFilter) => {
	let props;
	let i;
	let prop;
	const merged = {};
	destObj = destObj || {};
	if (sourceObj == null) return destObj;
	do {
		props = Object.getOwnPropertyNames(sourceObj);
		i = props.length;
		while (i-- > 0) {
			prop = props[i];
			if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
				destObj[prop] = sourceObj[prop];
				merged[prop] = true;
			}
		}
		sourceObj = filter !== false && getPrototypeOf(sourceObj);
	} while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
	return destObj;
};
/**
* Determines whether a string ends with the characters of a specified string
*
* @param {String} str
* @param {String} searchString
* @param {Number} [position= 0]
*
* @returns {boolean}
*/
var endsWith = (str, searchString, position) => {
	str = String(str);
	if (position === void 0 || position > str.length) position = str.length;
	position -= searchString.length;
	const lastIndex = str.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
};
/**
* Returns new array from array like object or null if failed
*
* @param {*} [thing]
*
* @returns {?Array}
*/
var toArray = (thing) => {
	if (!thing) return null;
	if (isArray(thing)) return thing;
	let i = thing.length;
	if (!isNumber(i)) return null;
	const arr = new Array(i);
	while (i-- > 0) arr[i] = thing[i];
	return arr;
};
/**
* Checking if the Uint8Array exists and if it does, it returns a function that checks if the
* thing passed in is an instance of Uint8Array
*
* @param {TypedArray}
*
* @returns {Array}
*/
var isTypedArray = ((TypedArray) => {
	return (thing) => {
		return TypedArray && thing instanceof TypedArray;
	};
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
/**
* For each entry in the object, call the function with the key and value.
*
* @param {Object<any, any>} obj - The object to iterate over.
* @param {Function} fn - The function to call for each entry.
*
* @returns {void}
*/
var forEachEntry = (obj, fn) => {
	const _iterator = (obj && obj[iterator]).call(obj);
	let result;
	while ((result = _iterator.next()) && !result.done) {
		const pair = result.value;
		fn.call(obj, pair[0], pair[1]);
	}
};
/**
* It takes a regular expression and a string, and returns an array of all the matches
*
* @param {string} regExp - The regular expression to match against.
* @param {string} str - The string to search.
*
* @returns {Array<boolean>}
*/
var matchAll = (regExp, str) => {
	let matches;
	const arr = [];
	while ((matches = regExp.exec(str)) !== null) arr.push(matches);
	return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
	return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
		return p1.toUpperCase() + p2;
	});
};
var hasOwnProperty = (({ hasOwnProperty }) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);
/**
* Determine if a value is a RegExp object
*
* @param {*} val The value to test
*
* @returns {boolean} True if value is a RegExp object, otherwise false
*/
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
	const descriptors = Object.getOwnPropertyDescriptors(obj);
	const reducedDescriptors = {};
	forEach(descriptors, (descriptor, name) => {
		let ret;
		if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
	});
	Object.defineProperties(obj, reducedDescriptors);
};
/**
* Makes all methods read-only
* @param {Object} obj
*/
var freezeMethods = (obj) => {
	reduceDescriptors(obj, (descriptor, name) => {
		if (isFunction$1(obj) && [
			"arguments",
			"caller",
			"callee"
		].includes(name)) return false;
		const value = obj[name];
		if (!isFunction$1(value)) return;
		descriptor.enumerable = false;
		if ("writable" in descriptor) {
			descriptor.writable = false;
			return;
		}
		if (!descriptor.set) descriptor.set = () => {
			throw Error("Can not rewrite read-only method '" + name + "'");
		};
	});
};
/**
* Converts an array or a delimited string into an object set with values as keys and true as values.
* Useful for fast membership checks.
*
* @param {Array|string} arrayOrString - The array or string to convert.
* @param {string} delimiter - The delimiter to use if input is a string.
* @returns {Object} An object with keys from the array or string, values set to true.
*/
var toObjectSet = (arrayOrString, delimiter) => {
	const obj = {};
	const define = (arr) => {
		arr.forEach((value) => {
			obj[value] = true;
		});
	};
	isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
	return obj;
};
var noop = () => {};
var toFiniteNumber = (value, defaultValue) => {
	return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
/**
* If the thing is a FormData object, return true, otherwise return false.
*
* @param {unknown} thing - The thing to check.
*
* @returns {boolean}
*/
function isSpecCompliantForm(thing) {
	return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
/**
* Recursively converts an object to a JSON-compatible object, handling circular references and Buffers.
*
* @param {Object} obj - The object to convert.
* @returns {Object} The JSON-compatible object.
*/
var toJSONObject = (obj) => {
	const visited = /* @__PURE__ */ new WeakSet();
	const visit = (source) => {
		if (isObject(source)) {
			if (visited.has(source)) return;
			if (isBuffer(source)) return source;
			if (!("toJSON" in source)) {
				visited.add(source);
				const target = isArray(source) ? [] : {};
				forEach(source, (value, key) => {
					const reducedValue = visit(value);
					!isUndefined(reducedValue) && (target[key] = reducedValue);
				});
				visited.delete(source);
				return target;
			}
		}
		return source;
	};
	return visit(obj);
};
/**
* Determines if a value is an async function.
*
* @param {*} thing - The value to test.
* @returns {boolean} True if value is an async function, otherwise false.
*/
var isAsyncFn = kindOfTest("AsyncFunction");
/**
* Determines if a value is thenable (has then and catch methods).
*
* @param {*} thing - The value to test.
* @returns {boolean} True if value is thenable, otherwise false.
*/
var isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
/**
* Provides a cross-platform setImmediate implementation.
* Uses native setImmediate if available, otherwise falls back to postMessage or setTimeout.
*
* @param {boolean} setImmediateSupported - Whether setImmediate is supported.
* @param {boolean} postMessageSupported - Whether postMessage is supported.
* @returns {Function} A function to schedule a callback asynchronously.
*/
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
	if (setImmediateSupported) return setImmediate;
	return postMessageSupported ? ((token, callbacks) => {
		_global.addEventListener("message", ({ source, data }) => {
			if (source === _global && data === token) callbacks.length && callbacks.shift()();
		}, false);
		return (cb) => {
			callbacks.push(cb);
			_global.postMessage(token, "*");
		};
	})(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(typeof setImmediate === "function", isFunction$1(_global.postMessage));
/**
* Schedules a microtask or asynchronous callback as soon as possible.
* Uses queueMicrotask if available, otherwise falls back to process.nextTick or _setImmediate.
*
* @type {Function}
*/
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
var utils_default = {
	isArray,
	isArrayBuffer,
	isBuffer,
	isFormData,
	isArrayBufferView,
	isString,
	isNumber,
	isBoolean,
	isObject,
	isPlainObject,
	isEmptyObject,
	isReadableStream,
	isRequest,
	isResponse,
	isHeaders,
	isUndefined,
	isDate,
	isFile,
	isReactNativeBlob,
	isReactNative,
	isBlob,
	isRegExp,
	isFunction: isFunction$1,
	isStream,
	isURLSearchParams,
	isTypedArray,
	isFileList,
	forEach,
	merge,
	extend,
	trim,
	stripBOM,
	inherits,
	toFlatObject,
	kindOf,
	kindOfTest,
	endsWith,
	toArray,
	forEachEntry,
	matchAll,
	isHTMLForm,
	hasOwnProperty,
	hasOwnProp: hasOwnProperty,
	reduceDescriptors,
	freezeMethods,
	toObjectSet,
	toCamelCase,
	noop,
	toFiniteNumber,
	findKey,
	global: _global,
	isContextDefined,
	isSpecCompliantForm,
	toJSONObject,
	isAsyncFn,
	isThenable,
	setImmediate: _setImmediate,
	asap,
	isIterable
};
//#endregion
//#region node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent"
]);
/**
* Parse headers into an object
*
* ```
* Date: Wed, 27 Aug 2014 08:58:49 GMT
* Content-Type: application/json
* Connection: keep-alive
* Transfer-Encoding: chunked
* ```
*
* @param {String} rawHeaders Headers needing to be parsed
*
* @returns {Object} Headers parsed into an object
*/
var parseHeaders_default = (rawHeaders) => {
	const parsed = {};
	let key;
	let val;
	let i;
	rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
		i = line.indexOf(":");
		key = line.substring(0, i).trim().toLowerCase();
		val = line.substring(i + 1).trim();
		if (!key || parsed[key] && ignoreDuplicateOf[key]) return;
		if (key === "set-cookie") if (parsed[key]) parsed[key].push(val);
		else parsed[key] = [val];
		else parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
	});
	return parsed;
};
//#endregion
//#region node_modules/axios/lib/helpers/sanitizeHeaderValue.js
function trimSPorHTAB(str) {
	let start = 0;
	let end = str.length;
	while (start < end) {
		const code = str.charCodeAt(start);
		if (code !== 9 && code !== 32) break;
		start += 1;
	}
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 9 && code !== 32) break;
		end -= 1;
	}
	return start === 0 && end === str.length ? str : str.slice(start, end);
}
var INVALID_UNICODE_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[\\u0000-\\u0008\\u000a-\\u001f\\u007f]+", "g");
var INVALID_BYTE_STRING_HEADER_VALUE_CHARS = /* @__PURE__ */ new RegExp("[^\\u0009\\u0020-\\u007e\\u0080-\\u00ff]+", "g");
function sanitizeValue(value, invalidChars) {
	if (utils_default.isArray(value)) return value.map((item) => sanitizeValue(item, invalidChars));
	return trimSPorHTAB(String(value).replace(invalidChars, ""));
}
var sanitizeHeaderValue = (value) => sanitizeValue(value, INVALID_UNICODE_HEADER_VALUE_CHARS);
var sanitizeByteStringHeaderValue = (value) => sanitizeValue(value, INVALID_BYTE_STRING_HEADER_VALUE_CHARS);
function toByteStringHeaderObject(headers) {
	const byteStringHeaders = Object.create(null);
	utils_default.forEach(headers.toJSON(), (value, header) => {
		byteStringHeaders[header] = sanitizeByteStringHeaderValue(value);
	});
	return byteStringHeaders;
}
//#endregion
//#region node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
	return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
	if (value === false || value == null) return value;
	return utils_default.isArray(value) ? value.map(normalizeValue) : sanitizeHeaderValue(String(value));
}
function parseTokens(str) {
	const tokens = Object.create(null);
	const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
	let match;
	while (match = tokensRE.exec(str)) tokens[match[1]] = match[2];
	return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
	if (utils_default.isFunction(filter)) return filter.call(this, value, header);
	if (isHeaderNameFilter) value = header;
	if (!utils_default.isString(value)) return;
	if (utils_default.isString(filter)) return value.indexOf(filter) !== -1;
	if (utils_default.isRegExp(filter)) return filter.test(value);
}
function formatHeader(header) {
	return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
		return char.toUpperCase() + str;
	});
}
function buildAccessors(obj, header) {
	const accessorName = utils_default.toCamelCase(" " + header);
	[
		"get",
		"set",
		"has"
	].forEach((methodName) => {
		Object.defineProperty(obj, methodName + accessorName, {
			__proto__: null,
			value: function(arg1, arg2, arg3) {
				return this[methodName].call(this, header, arg1, arg2, arg3);
			},
			configurable: true
		});
	});
}
var AxiosHeaders = class {
	constructor(headers) {
		headers && this.set(headers);
	}
	set(header, valueOrRewrite, rewrite) {
		const self = this;
		function setHeader(_value, _header, _rewrite) {
			const lHeader = normalizeHeader(_header);
			if (!lHeader) throw new Error("header name must be a non-empty string");
			const key = utils_default.findKey(self, lHeader);
			if (!key || self[key] === void 0 || _rewrite === true || _rewrite === void 0 && self[key] !== false) self[key || _header] = normalizeValue(_value);
		}
		const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
		if (utils_default.isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
		else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders(parseHeaders_default(header), valueOrRewrite);
		else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
			let obj = {}, dest, key;
			for (const entry of header) {
				if (!utils_default.isArray(entry)) throw TypeError("Object iterator must return a key-value pair");
				obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
			}
			setHeaders(obj, valueOrRewrite);
		} else header != null && setHeader(valueOrRewrite, header, rewrite);
		return this;
	}
	get(header, parser) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			if (key) {
				const value = this[key];
				if (!parser) return value;
				if (parser === true) return parseTokens(value);
				if (utils_default.isFunction(parser)) return parser.call(this, value, key);
				if (utils_default.isRegExp(parser)) return parser.exec(value);
				throw new TypeError("parser must be boolean|regexp|function");
			}
		}
	}
	has(header, matcher) {
		header = normalizeHeader(header);
		if (header) {
			const key = utils_default.findKey(this, header);
			return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
		}
		return false;
	}
	delete(header, matcher) {
		const self = this;
		let deleted = false;
		function deleteHeader(_header) {
			_header = normalizeHeader(_header);
			if (_header) {
				const key = utils_default.findKey(self, _header);
				if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
					delete self[key];
					deleted = true;
				}
			}
		}
		if (utils_default.isArray(header)) header.forEach(deleteHeader);
		else deleteHeader(header);
		return deleted;
	}
	clear(matcher) {
		const keys = Object.keys(this);
		let i = keys.length;
		let deleted = false;
		while (i--) {
			const key = keys[i];
			if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
				delete this[key];
				deleted = true;
			}
		}
		return deleted;
	}
	normalize(format) {
		const self = this;
		const headers = {};
		utils_default.forEach(this, (value, header) => {
			const key = utils_default.findKey(headers, header);
			if (key) {
				self[key] = normalizeValue(value);
				delete self[header];
				return;
			}
			const normalized = format ? formatHeader(header) : String(header).trim();
			if (normalized !== header) delete self[header];
			self[normalized] = normalizeValue(value);
			headers[normalized] = true;
		});
		return this;
	}
	concat(...targets) {
		return this.constructor.concat(this, ...targets);
	}
	toJSON(asStrings) {
		const obj = Object.create(null);
		utils_default.forEach(this, (value, header) => {
			value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
		});
		return obj;
	}
	[Symbol.iterator]() {
		return Object.entries(this.toJSON())[Symbol.iterator]();
	}
	toString() {
		return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
	}
	getSetCookie() {
		return this.get("set-cookie") || [];
	}
	get [Symbol.toStringTag]() {
		return "AxiosHeaders";
	}
	static from(thing) {
		return thing instanceof this ? thing : new this(thing);
	}
	static concat(first, ...targets) {
		const computed = new this(first);
		targets.forEach((target) => computed.set(target));
		return computed;
	}
	static accessor(header) {
		const accessors = (this[$internals] = this[$internals] = { accessors: {} }).accessors;
		const prototype = this.prototype;
		function defineAccessor(_header) {
			const lHeader = normalizeHeader(_header);
			if (!accessors[lHeader]) {
				buildAccessors(prototype, _header);
				accessors[lHeader] = true;
			}
		}
		utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
		return this;
	}
};
AxiosHeaders.accessor([
	"Content-Type",
	"Content-Length",
	"Accept",
	"Accept-Encoding",
	"User-Agent",
	"Authorization"
]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
	let mapped = key[0].toUpperCase() + key.slice(1);
	return {
		get: () => value,
		set(headerValue) {
			this[mapped] = headerValue;
		}
	};
});
utils_default.freezeMethods(AxiosHeaders);
//#endregion
//#region node_modules/axios/lib/core/AxiosError.js
var REDACTED = "[REDACTED ****]";
function hasOwnOrPrototypeToJSON(source) {
	if (utils_default.hasOwnProp(source, "toJSON")) return true;
	let prototype = Object.getPrototypeOf(source);
	while (prototype && prototype !== Object.prototype) {
		if (utils_default.hasOwnProp(prototype, "toJSON")) return true;
		prototype = Object.getPrototypeOf(prototype);
	}
	return false;
}
function redactConfig(config, redactKeys) {
	const lowerKeys = new Set(redactKeys.map((k) => String(k).toLowerCase()));
	const seen = [];
	const visit = (source) => {
		if (source === null || typeof source !== "object") return source;
		if (utils_default.isBuffer(source)) return source;
		if (seen.indexOf(source) !== -1) return void 0;
		if (source instanceof AxiosHeaders) source = source.toJSON();
		seen.push(source);
		let result;
		if (utils_default.isArray(source)) {
			result = [];
			source.forEach((v, i) => {
				const reducedValue = visit(v);
				if (!utils_default.isUndefined(reducedValue)) result[i] = reducedValue;
			});
		} else {
			if (!utils_default.isPlainObject(source) && hasOwnOrPrototypeToJSON(source)) {
				seen.pop();
				return source;
			}
			result = Object.create(null);
			for (const [key, value] of Object.entries(source)) {
				const reducedValue = lowerKeys.has(key.toLowerCase()) ? REDACTED : visit(value);
				if (!utils_default.isUndefined(reducedValue)) result[key] = reducedValue;
			}
		}
		seen.pop();
		return result;
	};
	return visit(config);
}
var AxiosError = class AxiosError extends Error {
	static from(error, code, config, request, response, customProps) {
		const axiosError = new AxiosError(error.message, code || error.code, config, request, response);
		axiosError.cause = error;
		axiosError.name = error.name;
		if (error.status != null && axiosError.status == null) axiosError.status = error.status;
		customProps && Object.assign(axiosError, customProps);
		return axiosError;
	}
	/**
	* Create an Error with the specified message, config, error code, request and response.
	*
	* @param {string} message The error message.
	* @param {string} [code] The error code (for example, 'ECONNABORTED').
	* @param {Object} [config] The config.
	* @param {Object} [request] The request.
	* @param {Object} [response] The response.
	*
	* @returns {Error} The created error.
	*/
	constructor(message, code, config, request, response) {
		super(message);
		Object.defineProperty(this, "message", {
			__proto__: null,
			value: message,
			enumerable: true,
			writable: true,
			configurable: true
		});
		this.name = "AxiosError";
		this.isAxiosError = true;
		code && (this.code = code);
		config && (this.config = config);
		request && (this.request = request);
		if (response) {
			this.response = response;
			this.status = response.status;
		}
	}
	toJSON() {
		const config = this.config;
		const redactKeys = config && utils_default.hasOwnProp(config, "redact") ? config.redact : void 0;
		const serializedConfig = utils_default.isArray(redactKeys) && redactKeys.length > 0 ? redactConfig(config, redactKeys) : utils_default.toJSONObject(config);
		return {
			message: this.message,
			name: this.name,
			description: this.description,
			number: this.number,
			fileName: this.fileName,
			lineNumber: this.lineNumber,
			columnNumber: this.columnNumber,
			stack: this.stack,
			config: serializedConfig,
			code: this.code,
			status: this.status
		};
	}
};
AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
AxiosError.ECONNABORTED = "ECONNABORTED";
AxiosError.ETIMEDOUT = "ETIMEDOUT";
AxiosError.ECONNREFUSED = "ECONNREFUSED";
AxiosError.ERR_NETWORK = "ERR_NETWORK";
AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
AxiosError.ERR_CANCELED = "ERR_CANCELED";
AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED = "ERR_FORM_DATA_DEPTH_EXCEEDED";
//#endregion
//#region node_modules/axios/lib/helpers/toFormData.js
/**
* Determines if the given thing is a array or js object.
*
* @param {string} thing - The object or array to be visited.
*
* @returns {boolean}
*/
function isVisitable(thing) {
	return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
/**
* It removes the brackets from the end of a string
*
* @param {string} key - The key of the parameter.
*
* @returns {string} the key without the brackets.
*/
function removeBrackets(key) {
	return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
/**
* It takes a path, a key, and a boolean, and returns a string
*
* @param {string} path - The path to the current key.
* @param {string} key - The key of the current object being iterated over.
* @param {string} dots - If true, the key will be rendered with dots instead of brackets.
*
* @returns {string} The path to the current key.
*/
function renderKey(path, key, dots) {
	if (!path) return key;
	return path.concat(key).map(function each(token, i) {
		token = removeBrackets(token);
		return !dots && i ? "[" + token + "]" : token;
	}).join(dots ? "." : "");
}
/**
* If the array is an array and none of its elements are visitable, then it's a flat array.
*
* @param {Array<any>} arr - The array to check
*
* @returns {boolean}
*/
function isFlatArray(arr) {
	return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
	return /^is[A-Z]/.test(prop);
});
/**
* Convert a data object to FormData
*
* @param {Object} obj
* @param {?Object} [formData]
* @param {?Object} [options]
* @param {Function} [options.visitor]
* @param {Boolean} [options.metaTokens = true]
* @param {Boolean} [options.dots = false]
* @param {?Boolean} [options.indexes = false]
*
* @returns {Object}
**/
/**
* It converts an object into a FormData object
*
* @param {Object<any, any>} obj - The object to convert to form data.
* @param {string} formData - The FormData object to append to.
* @param {Object<string, any>} options
*
* @returns
*/
function toFormData(obj, formData, options) {
	if (!utils_default.isObject(obj)) throw new TypeError("target must be an object");
	formData = formData || new FormData();
	options = utils_default.toFlatObject(options, {
		metaTokens: true,
		dots: false,
		indexes: false
	}, false, function defined(option, source) {
		return !utils_default.isUndefined(source[option]);
	});
	const metaTokens = options.metaTokens;
	const visitor = options.visitor || defaultVisitor;
	const dots = options.dots;
	const indexes = options.indexes;
	const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
	const maxDepth = options.maxDepth === void 0 ? 100 : options.maxDepth;
	const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
	if (!utils_default.isFunction(visitor)) throw new TypeError("visitor must be a function");
	function convertValue(value) {
		if (value === null) return "";
		if (utils_default.isDate(value)) return value.toISOString();
		if (utils_default.isBoolean(value)) return value.toString();
		if (!useBlob && utils_default.isBlob(value)) throw new AxiosError("Blob is not supported. Use a Buffer instead.");
		if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
		return value;
	}
	/**
	* Default visitor.
	*
	* @param {*} value
	* @param {String|Number} key
	* @param {Array<String|Number>} path
	* @this {FormData}
	*
	* @returns {boolean} return true to visit the each prop of the value recursively
	*/
	function defaultVisitor(value, key, path) {
		let arr = value;
		if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
			formData.append(renderKey(path, key, dots), convertValue(value));
			return false;
		}
		if (value && !path && typeof value === "object") {
			if (utils_default.endsWith(key, "{}")) {
				key = metaTokens ? key : key.slice(0, -2);
				value = JSON.stringify(value);
			} else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
				key = removeBrackets(key);
				arr.forEach(function each(el, index) {
					!(utils_default.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
				});
				return false;
			}
		}
		if (isVisitable(value)) return true;
		formData.append(renderKey(path, key, dots), convertValue(value));
		return false;
	}
	const stack = [];
	const exposedHelpers = Object.assign(predicates, {
		defaultVisitor,
		convertValue,
		isVisitable
	});
	function build(value, path, depth = 0) {
		if (utils_default.isUndefined(value)) return;
		if (depth > maxDepth) throw new AxiosError("Object is too deeply nested (" + depth + " levels). Max depth: " + maxDepth, AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED);
		if (stack.indexOf(value) !== -1) throw Error("Circular reference detected in " + path.join("."));
		stack.push(value);
		utils_default.forEach(value, function each(el, key) {
			if ((!(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers)) === true) build(el, path ? path.concat(key) : [key], depth + 1);
		});
		stack.pop();
	}
	if (!utils_default.isObject(obj)) throw new TypeError("data must be an object");
	build(obj);
	return formData;
}
//#endregion
//#region node_modules/axios/lib/helpers/AxiosURLSearchParams.js
/**
* It encodes a string by replacing all characters that are not in the unreserved set with
* their percent-encoded equivalents
*
* @param {string} str - The string to encode.
*
* @returns {string} The encoded string.
*/
function encode$1(str) {
	const charMap = {
		"!": "%21",
		"'": "%27",
		"(": "%28",
		")": "%29",
		"~": "%7E",
		"%20": "+"
	};
	return encodeURIComponent(str).replace(/[!'()~]|%20/g, function replacer(match) {
		return charMap[match];
	});
}
/**
* It takes a params object and converts it to a FormData object
*
* @param {Object<string, any>} params - The parameters to be converted to a FormData object.
* @param {Object<string, any>} options - The options object passed to the Axios constructor.
*
* @returns {void}
*/
function AxiosURLSearchParams(params, options) {
	this._pairs = [];
	params && toFormData(params, this, options);
}
var prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
	this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
	const _encode = encoder ? function(value) {
		return encoder.call(this, value, encode$1);
	} : encode$1;
	return this._pairs.map(function each(pair) {
		return _encode(pair[0]) + "=" + _encode(pair[1]);
	}, "").join("&");
};
//#endregion
//#region node_modules/axios/lib/helpers/buildURL.js
/**
* It replaces URL-encoded forms of `:`, `$`, `,`, and spaces with
* their plain counterparts (`:`, `$`, `,`, `+`).
*
* @param {string} val The value to be encoded.
*
* @returns {string} The encoded value.
*/
function encode(val) {
	return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
/**
* Build a URL by appending params to the end
*
* @param {string} url The base of the url (e.g., http://www.google.com)
* @param {object} [params] The params to be appended
* @param {?(object|Function)} options
*
* @returns {string} The formatted url
*/
function buildURL(url, params, options) {
	if (!params) return url;
	const _encode = options && options.encode || encode;
	const _options = utils_default.isFunction(options) ? { serialize: options } : options;
	const serializeFn = _options && _options.serialize;
	let serializedParams;
	if (serializeFn) serializedParams = serializeFn(params, _options);
	else serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, _options).toString(_encode);
	if (serializedParams) {
		const hashmarkIndex = url.indexOf("#");
		if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
		url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
	}
	return url;
}
//#endregion
//#region node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
	constructor() {
		this.handlers = [];
	}
	/**
	* Add a new interceptor to the stack
	*
	* @param {Function} fulfilled The function to handle `then` for a `Promise`
	* @param {Function} rejected The function to handle `reject` for a `Promise`
	* @param {Object} options The options for the interceptor, synchronous and runWhen
	*
	* @return {Number} An ID used to remove interceptor later
	*/
	use(fulfilled, rejected, options) {
		this.handlers.push({
			fulfilled,
			rejected,
			synchronous: options ? options.synchronous : false,
			runWhen: options ? options.runWhen : null
		});
		return this.handlers.length - 1;
	}
	/**
	* Remove an interceptor from the stack
	*
	* @param {Number} id The ID that was returned by `use`
	*
	* @returns {void}
	*/
	eject(id) {
		if (this.handlers[id]) this.handlers[id] = null;
	}
	/**
	* Clear all interceptors from the stack
	*
	* @returns {void}
	*/
	clear() {
		if (this.handlers) this.handlers = [];
	}
	/**
	* Iterate over all the registered interceptors
	*
	* This method is particularly useful for skipping over any
	* interceptors that may have become `null` calling `eject`.
	*
	* @param {Function} fn The function to call for each interceptor
	*
	* @returns {void}
	*/
	forEach(fn) {
		utils_default.forEach(this.handlers, function forEachHandler(h) {
			if (h !== null) fn(h);
		});
	}
};
//#endregion
//#region node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
	silentJSONParsing: true,
	forcedJSONParsing: true,
	clarifyTimeoutError: false,
	legacyInterceptorReqResOrdering: true
};
//#endregion
//#region node_modules/axios/lib/platform/browser/index.js
var browser_default = {
	isBrowser: true,
	classes: {
		URLSearchParams: typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams,
		FormData: typeof FormData !== "undefined" ? FormData : null,
		Blob: typeof Blob !== "undefined" ? Blob : null
	},
	protocols: [
		"http",
		"https",
		"file",
		"blob",
		"url",
		"data"
	]
};
//#endregion
//#region node_modules/axios/lib/platform/common/utils.js
var utils_exports = /* @__PURE__ */ __exportAll({
	hasBrowserEnv: () => hasBrowserEnv,
	hasStandardBrowserEnv: () => hasStandardBrowserEnv,
	hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
	navigator: () => _navigator,
	origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
/**
* Determine if we're running in a standard browser environment
*
* This allows axios to run in a web worker, and react-native.
* Both environments support XMLHttpRequest, but not fully standard globals.
*
* web workers:
*  typeof window -> undefined
*  typeof document -> undefined
*
* react-native:
*  navigator.product -> 'ReactNative'
* nativescript
*  navigator.product -> 'NativeScript' or 'NS'
*
* @returns {boolean}
*/
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
	"ReactNative",
	"NativeScript",
	"NS"
].indexOf(_navigator.product) < 0);
/**
* Determine if we're running in a standard browser webWorker environment
*
* Although the `isStandardBrowserEnv` method indicates that
* `allows axios to run in a web worker`, the WebWorker will still be
* filtered out due to its judgment standard
* `typeof window !== 'undefined' && typeof document !== 'undefined'`.
* This leads to a problem when axios post `FormData` in webWorker
*/
var hasStandardBrowserWebWorkerEnv = (() => {
	return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";
//#endregion
//#region node_modules/axios/lib/platform/index.js
var platform_default = {
	...utils_exports,
	...browser_default
};
//#endregion
//#region node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
	return toFormData(data, new platform_default.classes.URLSearchParams(), {
		visitor: function(value, key, path, helpers) {
			if (platform_default.isNode && utils_default.isBuffer(value)) {
				this.append(key, value.toString("base64"));
				return false;
			}
			return helpers.defaultVisitor.apply(this, arguments);
		},
		...options
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/formDataToJSON.js
/**
* It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
*
* @param {string} name - The name of the property to get.
*
* @returns An array of strings.
*/
function parsePropPath(name) {
	return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
		return match[0] === "[]" ? "" : match[1] || match[0];
	});
}
/**
* Convert an array to an object.
*
* @param {Array<any>} arr - The array to convert to an object.
*
* @returns An object with the same keys and values as the array.
*/
function arrayToObject(arr) {
	const obj = {};
	const keys = Object.keys(arr);
	let i;
	const len = keys.length;
	let key;
	for (i = 0; i < len; i++) {
		key = keys[i];
		obj[key] = arr[key];
	}
	return obj;
}
/**
* It takes a FormData object and returns a JavaScript object
*
* @param {string} formData The FormData object to convert to JSON.
*
* @returns {Object<string, any> | null} The converted object.
*/
function formDataToJSON(formData) {
	function buildPath(path, value, target, index) {
		let name = path[index++];
		if (name === "__proto__") return true;
		const isNumericKey = Number.isFinite(+name);
		const isLast = index >= path.length;
		name = !name && utils_default.isArray(target) ? target.length : name;
		if (isLast) {
			if (utils_default.hasOwnProp(target, name)) target[name] = utils_default.isArray(target[name]) ? target[name].concat(value) : [target[name], value];
			else target[name] = value;
			return !isNumericKey;
		}
		if (!utils_default.hasOwnProp(target, name) || !utils_default.isObject(target[name])) target[name] = [];
		if (buildPath(path, value, target[name], index) && utils_default.isArray(target[name])) target[name] = arrayToObject(target[name]);
		return !isNumericKey;
	}
	if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
		const obj = {};
		utils_default.forEachEntry(formData, (name, value) => {
			buildPath(parsePropPath(name), value, obj, 0);
		});
		return obj;
	}
	return null;
}
//#endregion
//#region node_modules/axios/lib/defaults/index.js
var own = (obj, key) => obj != null && utils_default.hasOwnProp(obj, key) ? obj[key] : void 0;
/**
* It takes a string, tries to parse it, and if it fails, it returns the stringified version
* of the input
*
* @param {any} rawValue - The value to be stringified.
* @param {Function} parser - A function that parses a string into a JavaScript object.
* @param {Function} encoder - A function that takes a value and returns a string.
*
* @returns {string} A stringified version of the rawValue.
*/
function stringifySafely(rawValue, parser, encoder) {
	if (utils_default.isString(rawValue)) try {
		(parser || JSON.parse)(rawValue);
		return utils_default.trim(rawValue);
	} catch (e) {
		if (e.name !== "SyntaxError") throw e;
	}
	return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
	transitional: transitional_default,
	adapter: [
		"xhr",
		"http",
		"fetch"
	],
	transformRequest: [function transformRequest(data, headers) {
		const contentType = headers.getContentType() || "";
		const hasJSONContentType = contentType.indexOf("application/json") > -1;
		const isObjectPayload = utils_default.isObject(data);
		if (isObjectPayload && utils_default.isHTMLForm(data)) data = new FormData(data);
		if (utils_default.isFormData(data)) return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
		if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) return data;
		if (utils_default.isArrayBufferView(data)) return data.buffer;
		if (utils_default.isURLSearchParams(data)) {
			headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
			return data.toString();
		}
		let isFileList;
		if (isObjectPayload) {
			const formSerializer = own(this, "formSerializer");
			if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return toURLEncodedForm(data, formSerializer).toString();
			if ((isFileList = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
				const env = own(this, "env");
				const _FormData = env && env.FormData;
				return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData(), formSerializer);
			}
		}
		if (isObjectPayload || hasJSONContentType) {
			headers.setContentType("application/json", false);
			return stringifySafely(data);
		}
		return data;
	}],
	transformResponse: [function transformResponse(data) {
		const transitional = own(this, "transitional") || defaults.transitional;
		const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
		const responseType = own(this, "responseType");
		const JSONRequested = responseType === "json";
		if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) return data;
		if (data && utils_default.isString(data) && (forcedJSONParsing && !responseType || JSONRequested)) {
			const strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
			try {
				return JSON.parse(data, own(this, "parseReviver"));
			} catch (e) {
				if (strictJSONParsing) {
					if (e.name === "SyntaxError") throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, own(this, "response"));
					throw e;
				}
			}
		}
		return data;
	}],
	/**
	* A timeout in milliseconds to abort a request. If set to 0 (default) a
	* timeout is not created.
	*/
	timeout: 0,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
	maxContentLength: -1,
	maxBodyLength: -1,
	env: {
		FormData: platform_default.classes.FormData,
		Blob: platform_default.classes.Blob
	},
	validateStatus: function validateStatus(status) {
		return status >= 200 && status < 300;
	},
	headers: { common: {
		Accept: "application/json, text/plain, */*",
		"Content-Type": void 0
	} }
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"post",
	"put",
	"patch",
	"query"
], (method) => {
	defaults.headers[method] = {};
});
//#endregion
//#region node_modules/axios/lib/core/transformData.js
/**
* Transform the data for a request or a response
*
* @param {Array|Function} fns A single function or Array of functions
* @param {?Object} response The response object
*
* @returns {*} The resulting transformed data
*/
function transformData(fns, response) {
	const config = this || defaults;
	const context = response || config;
	const headers = AxiosHeaders.from(context.headers);
	let data = context.data;
	utils_default.forEach(fns, function transform(fn) {
		data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
	});
	headers.normalize();
	return data;
}
//#endregion
//#region node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
	return !!(value && value.__CANCEL__);
}
//#endregion
//#region node_modules/axios/lib/cancel/CanceledError.js
var CanceledError = class extends AxiosError {
	/**
	* A `CanceledError` is an object that is thrown when an operation is canceled.
	*
	* @param {string=} message The message.
	* @param {Object=} config The config.
	* @param {Object=} request The request.
	*
	* @returns {CanceledError} The created error.
	*/
	constructor(message, config, request) {
		super(message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
		this.name = "CanceledError";
		this.__CANCEL__ = true;
	}
};
//#endregion
//#region node_modules/axios/lib/core/settle.js
/**
* Resolve or reject a Promise based on response status.
*
* @param {Function} resolve A function that resolves the promise.
* @param {Function} reject A function that rejects the promise.
* @param {object} response The response.
*
* @returns {object} The response.
*/
function settle(resolve, reject, response) {
	const validateStatus = response.config.validateStatus;
	if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
	else reject(new AxiosError("Request failed with status code " + response.status, response.status >= 400 && response.status < 500 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE, response.config, response.request, response));
}
//#endregion
//#region node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
	const match = /^([-+\w]{1,25}):(?:\/\/)?/.exec(url);
	return match && match[1] || "";
}
//#endregion
//#region node_modules/axios/lib/helpers/speedometer.js
/**
* Calculate data maxRate
* @param {Number} [samplesCount= 10]
* @param {Number} [min= 1000]
* @returns {Function}
*/
function speedometer(samplesCount, min) {
	samplesCount = samplesCount || 10;
	const bytes = new Array(samplesCount);
	const timestamps = new Array(samplesCount);
	let head = 0;
	let tail = 0;
	let firstSampleTS;
	min = min !== void 0 ? min : 1e3;
	return function push(chunkLength) {
		const now = Date.now();
		const startedAt = timestamps[tail];
		if (!firstSampleTS) firstSampleTS = now;
		bytes[head] = chunkLength;
		timestamps[head] = now;
		let i = tail;
		let bytesCount = 0;
		while (i !== head) {
			bytesCount += bytes[i++];
			i = i % samplesCount;
		}
		head = (head + 1) % samplesCount;
		if (head === tail) tail = (tail + 1) % samplesCount;
		if (now - firstSampleTS < min) return;
		const passed = startedAt && now - startedAt;
		return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/throttle.js
/**
* Throttle decorator
* @param {Function} fn
* @param {Number} freq
* @return {Function}
*/
function throttle(fn, freq) {
	let timestamp = 0;
	let threshold = 1e3 / freq;
	let lastArgs;
	let timer;
	const invoke = (args, now = Date.now()) => {
		timestamp = now;
		lastArgs = null;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		fn(...args);
	};
	const throttled = (...args) => {
		const now = Date.now();
		const passed = now - timestamp;
		if (passed >= threshold) invoke(args, now);
		else {
			lastArgs = args;
			if (!timer) timer = setTimeout(() => {
				timer = null;
				invoke(lastArgs);
			}, threshold - passed);
		}
	};
	const flush = () => lastArgs && invoke(lastArgs);
	return [throttled, flush];
}
//#endregion
//#region node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
	let bytesNotified = 0;
	const _speedometer = speedometer(50, 250);
	return throttle((e) => {
		if (!e || typeof e.loaded !== "number") return;
		const rawLoaded = e.loaded;
		const total = e.lengthComputable ? e.total : void 0;
		const loaded = total != null ? Math.min(rawLoaded, total) : rawLoaded;
		const progressBytes = Math.max(0, loaded - bytesNotified);
		const rate = _speedometer(progressBytes);
		bytesNotified = Math.max(bytesNotified, loaded);
		listener({
			loaded,
			total,
			progress: total ? loaded / total : void 0,
			bytes: progressBytes,
			rate: rate ? rate : void 0,
			estimated: rate && total ? (total - loaded) / rate : void 0,
			event: e,
			lengthComputable: total != null,
			[isDownloadStream ? "download" : "upload"]: true
		});
	}, freq);
};
var progressEventDecorator = (total, throttled) => {
	const lengthComputable = total != null;
	return [(loaded) => throttled[0]({
		lengthComputable,
		total,
		loaded
	}), throttled[1]];
};
var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));
//#endregion
//#region node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
	url = new URL(url, platform_default.origin);
	return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
})(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : () => true;
//#endregion
//#region node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? {
	write(name, value, expires, path, domain, secure, sameSite) {
		if (typeof document === "undefined") return;
		const cookie = [`${name}=${encodeURIComponent(value)}`];
		if (utils_default.isNumber(expires)) cookie.push(`expires=${new Date(expires).toUTCString()}`);
		if (utils_default.isString(path)) cookie.push(`path=${path}`);
		if (utils_default.isString(domain)) cookie.push(`domain=${domain}`);
		if (secure === true) cookie.push("secure");
		if (utils_default.isString(sameSite)) cookie.push(`SameSite=${sameSite}`);
		document.cookie = cookie.join("; ");
	},
	read(name) {
		if (typeof document === "undefined") return null;
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].replace(/^\s+/, "");
			const eq = cookie.indexOf("=");
			if (eq !== -1 && cookie.slice(0, eq) === name) return decodeURIComponent(cookie.slice(eq + 1));
		}
		return null;
	},
	remove(name) {
		this.write(name, "", Date.now() - 864e5, "/");
	}
} : {
	write() {},
	read() {
		return null;
	},
	remove() {}
};
//#endregion
//#region node_modules/axios/lib/helpers/isAbsoluteURL.js
/**
* Determines whether the specified URL is absolute
*
* @param {string} url The URL to test
*
* @returns {boolean} True if the specified URL is absolute, otherwise false
*/
function isAbsoluteURL(url) {
	if (typeof url !== "string") return false;
	return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
//#endregion
//#region node_modules/axios/lib/helpers/combineURLs.js
/**
* Creates a new URL by combining the specified URLs
*
* @param {string} baseURL The base URL
* @param {string} relativeURL The relative URL
*
* @returns {string} The combined URL
*/
function combineURLs(baseURL, relativeURL) {
	return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
//#endregion
//#region node_modules/axios/lib/core/buildFullPath.js
/**
* Creates a new URL by combining the baseURL with the requestedURL,
* only when the requestedURL is not already an absolute URL.
* If the requestURL is absolute, this function returns the requestedURL untouched.
*
* @param {string} baseURL The base URL
* @param {string} requestedURL Absolute or relative URL to combine
*
* @returns {string} The combined full path
*/
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
	let isRelativeUrl = !isAbsoluteURL(requestedURL);
	if (baseURL && (isRelativeUrl || allowAbsoluteUrls === false)) return combineURLs(baseURL, requestedURL);
	return requestedURL;
}
//#endregion
//#region node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
/**
* Config-specific merge-function which creates a new config-object
* by merging two configuration objects together.
*
* @param {Object} config1
* @param {Object} config2
*
* @returns {Object} New object resulting from merging config2 to config1
*/
function mergeConfig(config1, config2) {
	config2 = config2 || {};
	const config = Object.create(null);
	Object.defineProperty(config, "hasOwnProperty", {
		__proto__: null,
		value: Object.prototype.hasOwnProperty,
		enumerable: false,
		writable: true,
		configurable: true
	});
	function getMergedValue(target, source, prop, caseless) {
		if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) return utils_default.merge.call({ caseless }, target, source);
		else if (utils_default.isPlainObject(source)) return utils_default.merge({}, source);
		else if (utils_default.isArray(source)) return source.slice();
		return source;
	}
	function mergeDeepProperties(a, b, prop, caseless) {
		if (!utils_default.isUndefined(b)) return getMergedValue(a, b, prop, caseless);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a, prop, caseless);
	}
	function valueFromConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
	}
	function defaultToConfig2(a, b) {
		if (!utils_default.isUndefined(b)) return getMergedValue(void 0, b);
		else if (!utils_default.isUndefined(a)) return getMergedValue(void 0, a);
	}
	function mergeDirectKeys(a, b, prop) {
		if (utils_default.hasOwnProp(config2, prop)) return getMergedValue(a, b);
		else if (utils_default.hasOwnProp(config1, prop)) return getMergedValue(void 0, a);
	}
	const mergeMap = {
		url: valueFromConfig2,
		method: valueFromConfig2,
		data: valueFromConfig2,
		baseURL: defaultToConfig2,
		transformRequest: defaultToConfig2,
		transformResponse: defaultToConfig2,
		paramsSerializer: defaultToConfig2,
		timeout: defaultToConfig2,
		timeoutMessage: defaultToConfig2,
		withCredentials: defaultToConfig2,
		withXSRFToken: defaultToConfig2,
		adapter: defaultToConfig2,
		responseType: defaultToConfig2,
		xsrfCookieName: defaultToConfig2,
		xsrfHeaderName: defaultToConfig2,
		onUploadProgress: defaultToConfig2,
		onDownloadProgress: defaultToConfig2,
		decompress: defaultToConfig2,
		maxContentLength: defaultToConfig2,
		maxBodyLength: defaultToConfig2,
		beforeRedirect: defaultToConfig2,
		transport: defaultToConfig2,
		httpAgent: defaultToConfig2,
		httpsAgent: defaultToConfig2,
		cancelToken: defaultToConfig2,
		socketPath: defaultToConfig2,
		allowedSocketPaths: defaultToConfig2,
		responseEncoding: defaultToConfig2,
		validateStatus: mergeDirectKeys,
		headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
	};
	utils_default.forEach(Object.keys({
		...config1,
		...config2
	}), function computeConfigValue(prop) {
		if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
		const merge = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
		const configValue = merge(utils_default.hasOwnProp(config1, prop) ? config1[prop] : void 0, utils_default.hasOwnProp(config2, prop) ? config2[prop] : void 0, prop);
		utils_default.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
	});
	return config;
}
//#endregion
//#region node_modules/axios/lib/helpers/resolveConfig.js
var FORM_DATA_CONTENT_HEADERS = ["content-type", "content-length"];
function setFormDataHeaders(headers, formHeaders, policy) {
	if (policy !== "content-only") {
		headers.set(formHeaders);
		return;
	}
	Object.entries(formHeaders).forEach(([key, val]) => {
		if (FORM_DATA_CONTENT_HEADERS.includes(key.toLowerCase())) headers.set(key, val);
	});
}
/**
* Encode a UTF-8 string to a Latin-1 byte string for use with btoa().
* This is a modern replacement for the deprecated unescape(encodeURIComponent(str)) pattern.
*
* @param {string} str The string to encode
*
* @returns {string} UTF-8 bytes as a Latin-1 string
*/
var encodeUTF8 = (str) => encodeURIComponent(str).replace(/%([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
var resolveConfig_default = (config) => {
	const newConfig = mergeConfig({}, config);
	const own = (key) => utils_default.hasOwnProp(newConfig, key) ? newConfig[key] : void 0;
	const data = own("data");
	let withXSRFToken = own("withXSRFToken");
	const xsrfHeaderName = own("xsrfHeaderName");
	const xsrfCookieName = own("xsrfCookieName");
	let headers = own("headers");
	const auth = own("auth");
	const baseURL = own("baseURL");
	const allowAbsoluteUrls = own("allowAbsoluteUrls");
	const url = own("url");
	newConfig.headers = headers = AxiosHeaders.from(headers);
	newConfig.url = buildURL(buildFullPath(baseURL, url, allowAbsoluteUrls), config.params, config.paramsSerializer);
	if (auth) headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? encodeUTF8(auth.password) : "")));
	if (utils_default.isFormData(data)) {
		if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) headers.setContentType(void 0);
		else if (utils_default.isFunction(data.getHeaders)) setFormDataHeaders(headers, data.getHeaders(), own("formDataHeaderPolicy"));
	}
	if (platform_default.hasStandardBrowserEnv) {
		if (utils_default.isFunction(withXSRFToken)) withXSRFToken = withXSRFToken(newConfig);
		if (withXSRFToken === true || withXSRFToken == null && isURLSameOrigin_default(newConfig.url)) {
			const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
			if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
		}
	}
	return newConfig;
};
var xhr_default = typeof XMLHttpRequest !== "undefined" && function(config) {
	return new Promise(function dispatchXhrRequest(resolve, reject) {
		const _config = resolveConfig_default(config);
		let requestData = _config.data;
		const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
		let { responseType, onUploadProgress, onDownloadProgress } = _config;
		let onCanceled;
		let uploadThrottled, downloadThrottled;
		let flushUpload, flushDownload;
		function done() {
			flushUpload && flushUpload();
			flushDownload && flushDownload();
			_config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
			_config.signal && _config.signal.removeEventListener("abort", onCanceled);
		}
		let request = new XMLHttpRequest();
		request.open(_config.method.toUpperCase(), _config.url, true);
		request.timeout = _config.timeout;
		function onloadend() {
			if (!request) return;
			const responseHeaders = AxiosHeaders.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
			settle(function _resolve(value) {
				resolve(value);
				done();
			}, function _reject(err) {
				reject(err);
				done();
			}, {
				data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				config,
				request
			});
			request = null;
		}
		if ("onloadend" in request) request.onloadend = onloadend;
		else request.onreadystatechange = function handleLoad() {
			if (!request || request.readyState !== 4) return;
			if (request.status === 0 && !(request.responseURL && request.responseURL.startsWith("file:"))) return;
			setTimeout(onloadend);
		};
		request.onabort = function handleAbort() {
			if (!request) return;
			reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
			done();
			request = null;
		};
		request.onerror = function handleError(event) {
			const err = new AxiosError(event && event.message ? event.message : "Network Error", AxiosError.ERR_NETWORK, config, request);
			err.event = event || null;
			reject(err);
			done();
			request = null;
		};
		request.ontimeout = function handleTimeout() {
			let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
			const transitional = _config.transitional || transitional_default;
			if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
			reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
			done();
			request = null;
		};
		requestData === void 0 && requestHeaders.setContentType(null);
		if ("setRequestHeader" in request) utils_default.forEach(toByteStringHeaderObject(requestHeaders), function setRequestHeader(val, key) {
			request.setRequestHeader(key, val);
		});
		if (!utils_default.isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
		if (responseType && responseType !== "json") request.responseType = _config.responseType;
		if (onDownloadProgress) {
			[downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
			request.addEventListener("progress", downloadThrottled);
		}
		if (onUploadProgress && request.upload) {
			[uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
			request.upload.addEventListener("progress", uploadThrottled);
			request.upload.addEventListener("loadend", flushUpload);
		}
		if (_config.cancelToken || _config.signal) {
			onCanceled = (cancel) => {
				if (!request) return;
				reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
				request.abort();
				done();
				request = null;
			};
			_config.cancelToken && _config.cancelToken.subscribe(onCanceled);
			if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
		}
		const protocol = parseProtocol(_config.url);
		if (protocol && !platform_default.protocols.includes(protocol)) {
			reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
			return;
		}
		request.send(requestData || null);
	});
};
//#endregion
//#region node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
	signals = signals ? signals.filter(Boolean) : [];
	if (!timeout && !signals.length) return;
	const controller = new AbortController();
	let aborted = false;
	const onabort = function(reason) {
		if (!aborted) {
			aborted = true;
			unsubscribe();
			const err = reason instanceof Error ? reason : this.reason;
			controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
		}
	};
	let timer = timeout && setTimeout(() => {
		timer = null;
		onabort(new AxiosError(`timeout of ${timeout}ms exceeded`, AxiosError.ETIMEDOUT));
	}, timeout);
	const unsubscribe = () => {
		if (!signals) return;
		timer && clearTimeout(timer);
		timer = null;
		signals.forEach((signal) => {
			signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener("abort", onabort);
		});
		signals = null;
	};
	signals.forEach((signal) => signal.addEventListener("abort", onabort));
	const { signal } = controller;
	signal.unsubscribe = () => utils_default.asap(unsubscribe);
	return signal;
};
//#endregion
//#region node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
	let len = chunk.byteLength;
	if (!chunkSize || len < chunkSize) {
		yield chunk;
		return;
	}
	let pos = 0;
	let end;
	while (pos < len) {
		end = pos + chunkSize;
		yield chunk.slice(pos, end);
		pos = end;
	}
};
var readBytes = async function* (iterable, chunkSize) {
	for await (const chunk of readStream(iterable)) yield* streamChunk(chunk, chunkSize);
};
var readStream = async function* (stream) {
	if (stream[Symbol.asyncIterator]) {
		yield* stream;
		return;
	}
	const reader = stream.getReader();
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			yield value;
		}
	} finally {
		await reader.cancel();
	}
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
	const iterator = readBytes(stream, chunkSize);
	let bytes = 0;
	let done;
	let _onFinish = (e) => {
		if (!done) {
			done = true;
			onFinish && onFinish(e);
		}
	};
	return new ReadableStream({
		async pull(controller) {
			try {
				const { done, value } = await iterator.next();
				if (done) {
					_onFinish();
					controller.close();
					return;
				}
				let len = value.byteLength;
				if (onProgress) onProgress(bytes += len);
				controller.enqueue(new Uint8Array(value));
			} catch (err) {
				_onFinish(err);
				throw err;
			}
		},
		cancel(reason) {
			_onFinish(reason);
			return iterator.return();
		}
	}, { highWaterMark: 2 });
};
//#endregion
//#region node_modules/axios/lib/helpers/estimateDataURLDecodedBytes.js
/**
* Estimate decoded byte length of a data:// URL *without* allocating large buffers.
* - For base64: compute exact decoded size using length and padding;
*               handle %XX at the character-count level (no string allocation).
* - For non-base64: use UTF-8 byteLength of the encoded body as a safe upper bound.
*
* @param {string} url
* @returns {number}
*/
function estimateDataURLDecodedBytes(url) {
	if (!url || typeof url !== "string") return 0;
	if (!url.startsWith("data:")) return 0;
	const comma = url.indexOf(",");
	if (comma < 0) return 0;
	const meta = url.slice(5, comma);
	const body = url.slice(comma + 1);
	if (/;base64/i.test(meta)) {
		let effectiveLen = body.length;
		const len = body.length;
		for (let i = 0; i < len; i++) if (body.charCodeAt(i) === 37 && i + 2 < len) {
			const a = body.charCodeAt(i + 1);
			const b = body.charCodeAt(i + 2);
			if ((a >= 48 && a <= 57 || a >= 65 && a <= 70 || a >= 97 && a <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102)) {
				effectiveLen -= 2;
				i += 2;
			}
		}
		let pad = 0;
		let idx = len - 1;
		const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && body.charCodeAt(j - 1) === 51 && (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
		if (idx >= 0) {
			if (body.charCodeAt(idx) === 61) {
				pad++;
				idx--;
			} else if (tailIsPct3D(idx)) {
				pad++;
				idx -= 3;
			}
		}
		if (pad === 1 && idx >= 0) {
			if (body.charCodeAt(idx) === 61) pad++;
			else if (tailIsPct3D(idx)) pad++;
		}
		const bytes = Math.floor(effectiveLen / 4) * 3 - (pad || 0);
		return bytes > 0 ? bytes : 0;
	}
	if (typeof Buffer !== "undefined" && typeof Buffer.byteLength === "function") return Buffer.byteLength(body, "utf8");
	let bytes = 0;
	for (let i = 0, len = body.length; i < len; i++) {
		const c = body.charCodeAt(i);
		if (c < 128) bytes += 1;
		else if (c < 2048) bytes += 2;
		else if (c >= 55296 && c <= 56319 && i + 1 < len) {
			const next = body.charCodeAt(i + 1);
			if (next >= 56320 && next <= 57343) {
				bytes += 4;
				i++;
			} else bytes += 3;
		} else bytes += 3;
	}
	return bytes;
}
//#endregion
//#region node_modules/axios/lib/env/data.js
var VERSION = "1.16.1";
//#endregion
//#region node_modules/axios/lib/adapters/fetch.js
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var { isFunction } = utils_default;
var test = (fn, ...args) => {
	try {
		return !!fn(...args);
	} catch (e) {
		return false;
	}
};
var factory = (env) => {
	const globalObject = utils_default.global !== void 0 && utils_default.global !== null ? utils_default.global : globalThis;
	const { ReadableStream, TextEncoder } = globalObject;
	env = utils_default.merge.call({ skipUndefined: true }, {
		Request: globalObject.Request,
		Response: globalObject.Response
	}, env);
	const { fetch: envFetch, Request, Response } = env;
	const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
	const isRequestSupported = isFunction(Request);
	const isResponseSupported = isFunction(Response);
	if (!isFetchSupported) return false;
	const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream);
	const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
	const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
		let duplexAccessed = false;
		const request = new Request(platform_default.origin, {
			body: new ReadableStream(),
			method: "POST",
			get duplex() {
				duplexAccessed = true;
				return "half";
			}
		});
		const hasContentType = request.headers.has("Content-Type");
		if (request.body != null) request.body.cancel();
		return duplexAccessed && !hasContentType;
	});
	const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
	const resolvers = { stream: supportsResponseStream && ((res) => res.body) };
	isFetchSupported && (() => {
		[
			"text",
			"arrayBuffer",
			"blob",
			"formData",
			"stream"
		].forEach((type) => {
			!resolvers[type] && (resolvers[type] = (res, config) => {
				let method = res && res[type];
				if (method) return method.call(res);
				throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
			});
		});
	})();
	const getBodyLength = async (body) => {
		if (body == null) return 0;
		if (utils_default.isBlob(body)) return body.size;
		if (utils_default.isSpecCompliantForm(body)) return (await new Request(platform_default.origin, {
			method: "POST",
			body
		}).arrayBuffer()).byteLength;
		if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) return body.byteLength;
		if (utils_default.isURLSearchParams(body)) body = body + "";
		if (utils_default.isString(body)) return (await encodeText(body)).byteLength;
	};
	const resolveBodyLength = async (headers, body) => {
		const length = utils_default.toFiniteNumber(headers.getContentLength());
		return length == null ? getBodyLength(body) : length;
	};
	return async (config) => {
		let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = "same-origin", fetchOptions, maxContentLength, maxBodyLength } = resolveConfig_default(config);
		const hasMaxContentLength = utils_default.isNumber(maxContentLength) && maxContentLength > -1;
		const hasMaxBodyLength = utils_default.isNumber(maxBodyLength) && maxBodyLength > -1;
		let _fetch = envFetch || fetch;
		responseType = responseType ? (responseType + "").toLowerCase() : "text";
		let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
		let request = null;
		const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
			composedSignal.unsubscribe();
		});
		let requestContentLength;
		try {
			if (hasMaxContentLength && typeof url === "string" && url.startsWith("data:")) {
				if (estimateDataURLDecodedBytes(url) > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			if (hasMaxBodyLength && method !== "get" && method !== "head") {
				const outboundLength = await resolveBodyLength(headers, data);
				if (typeof outboundLength === "number" && isFinite(outboundLength) && outboundLength > maxBodyLength) throw new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config, request);
			}
			if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
				let _request = new Request(url, {
					method: "POST",
					body: data,
					duplex: "half"
				});
				let contentTypeHeader;
				if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) headers.setContentType(contentTypeHeader);
				if (_request.body) {
					const [onProgress, flush] = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress)));
					data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
				}
			}
			if (!utils_default.isString(withCredentials)) withCredentials = withCredentials ? "include" : "omit";
			const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
			if (utils_default.isFormData(data)) {
				const contentType = headers.getContentType();
				if (contentType && /^multipart\/form-data/i.test(contentType) && !/boundary=/i.test(contentType)) headers.delete("content-type");
			}
			headers.set("User-Agent", "axios/" + VERSION, false);
			const resolvedOptions = {
				...fetchOptions,
				signal: composedSignal,
				method: method.toUpperCase(),
				headers: toByteStringHeaderObject(headers.normalize()),
				body: data,
				duplex: "half",
				credentials: isCredentialsSupported ? withCredentials : void 0
			};
			request = isRequestSupported && new Request(url, resolvedOptions);
			let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
			if (hasMaxContentLength) {
				const declaredLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
				if (declaredLength != null && declaredLength > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
			if (supportsResponseStream && response.body && (onDownloadProgress || hasMaxContentLength || isStreamResponse && unsubscribe)) {
				const options = {};
				[
					"status",
					"statusText",
					"headers"
				].forEach((prop) => {
					options[prop] = response[prop];
				});
				const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
				const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
				let bytesRead = 0;
				const onChunkProgress = (loadedBytes) => {
					if (hasMaxContentLength) {
						bytesRead = loadedBytes;
						if (bytesRead > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
					}
					onProgress && onProgress(loadedBytes);
				};
				response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onChunkProgress, () => {
					flush && flush();
					unsubscribe && unsubscribe();
				}), options);
			}
			responseType = responseType || "text";
			let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
			if (hasMaxContentLength && !supportsResponseStream && !isStreamResponse) {
				let materializedSize;
				if (responseData != null) {
					if (typeof responseData.byteLength === "number") materializedSize = responseData.byteLength;
					else if (typeof responseData.size === "number") materializedSize = responseData.size;
					else if (typeof responseData === "string") materializedSize = typeof TextEncoder === "function" ? new TextEncoder().encode(responseData).byteLength : responseData.length;
				}
				if (typeof materializedSize === "number" && materializedSize > maxContentLength) throw new AxiosError("maxContentLength size of " + maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, request);
			}
			!isStreamResponse && unsubscribe && unsubscribe();
			return await new Promise((resolve, reject) => {
				settle(resolve, reject, {
					data: responseData,
					headers: AxiosHeaders.from(response.headers),
					status: response.status,
					statusText: response.statusText,
					config,
					request
				});
			});
		} catch (err) {
			unsubscribe && unsubscribe();
			if (composedSignal && composedSignal.aborted && composedSignal.reason instanceof AxiosError) {
				const canceledError = composedSignal.reason;
				canceledError.config = config;
				request && (canceledError.request = request);
				err !== canceledError && (canceledError.cause = err);
				throw canceledError;
			}
			if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) throw Object.assign(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request, err && err.response), { cause: err.cause || err });
			throw AxiosError.from(err, err && err.code, config, request, err && err.response);
		}
	};
};
var seedCache = /* @__PURE__ */ new Map();
var getFetch = (config) => {
	let env = config && config.env || {};
	const { fetch, Request, Response } = env;
	const seeds = [
		Request,
		Response,
		fetch
	];
	let i = seeds.length, seed, target, map = seedCache;
	while (i--) {
		seed = seeds[i];
		target = map.get(seed);
		target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
		map = target;
	}
	return target;
};
getFetch();
//#endregion
//#region node_modules/axios/lib/adapters/adapters.js
/**
* Known adapters mapping.
* Provides environment-specific adapters for Axios:
* - `http` for Node.js
* - `xhr` for browsers
* - `fetch` for fetch API-based requests
*
* @type {Object<string, Function|Object>}
*/
var knownAdapters = {
	http: null,
	xhr: xhr_default,
	fetch: { get: getFetch }
};
utils_default.forEach(knownAdapters, (fn, value) => {
	if (fn) {
		try {
			Object.defineProperty(fn, "name", {
				__proto__: null,
				value
			});
		} catch (e) {}
		Object.defineProperty(fn, "adapterName", {
			__proto__: null,
			value
		});
	}
});
/**
* Render a rejection reason string for unknown or unsupported adapters
*
* @param {string} reason
* @returns {string}
*/
var renderReason = (reason) => `- ${reason}`;
/**
* Check if the adapter is resolved (function, null, or false)
*
* @param {Function|null|false} adapter
* @returns {boolean}
*/
var isResolvedHandle = (adapter) => utils_default.isFunction(adapter) || adapter === null || adapter === false;
/**
* Get the first suitable adapter from the provided list.
* Tries each adapter in order until a supported one is found.
* Throws an AxiosError if no adapter is suitable.
*
* @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
* @param {Object} config - Axios request configuration
* @throws {AxiosError} If no suitable adapter is available
* @returns {Function} The resolved adapter function
*/
function getAdapter(adapters, config) {
	adapters = utils_default.isArray(adapters) ? adapters : [adapters];
	const { length } = adapters;
	let nameOrAdapter;
	let adapter;
	const rejectedReasons = {};
	for (let i = 0; i < length; i++) {
		nameOrAdapter = adapters[i];
		let id;
		adapter = nameOrAdapter;
		if (!isResolvedHandle(nameOrAdapter)) {
			adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
			if (adapter === void 0) throw new AxiosError(`Unknown adapter '${id}'`);
		}
		if (adapter && (utils_default.isFunction(adapter) || (adapter = adapter.get(config)))) break;
		rejectedReasons[id || "#" + i] = adapter;
	}
	if (!adapter) {
		const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
		throw new AxiosError(`There is no suitable adapter to dispatch the request ` + (length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT");
	}
	return adapter;
}
/**
* Exports Axios adapters and utility to resolve an adapter
*/
var adapters_default = {
	/**
	* Resolve an adapter from a list of adapter names or functions.
	* @type {Function}
	*/
	getAdapter,
	/**
	* Exposes all known adapters
	* @type {Object<string, Function|Object>}
	*/
	adapters: knownAdapters
};
//#endregion
//#region node_modules/axios/lib/core/dispatchRequest.js
/**
* Throws a `CanceledError` if cancellation has been requested.
*
* @param {Object} config The config that is to be used for the request
*
* @returns {void}
*/
function throwIfCancellationRequested(config) {
	if (config.cancelToken) config.cancelToken.throwIfRequested();
	if (config.signal && config.signal.aborted) throw new CanceledError(null, config);
}
/**
* Dispatch a request to the server using the configured adapter.
*
* @param {object} config The config that is to be used for the request
*
* @returns {Promise} The Promise to be fulfilled
*/
function dispatchRequest(config) {
	throwIfCancellationRequested(config);
	config.headers = AxiosHeaders.from(config.headers);
	config.data = transformData.call(config, config.transformRequest);
	if ([
		"post",
		"put",
		"patch"
	].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
	return adapters_default.getAdapter(config.adapter || defaults.adapter, config)(config).then(function onAdapterResolution(response) {
		throwIfCancellationRequested(config);
		config.response = response;
		try {
			response.data = transformData.call(config, config.transformResponse, response);
		} finally {
			delete config.response;
		}
		response.headers = AxiosHeaders.from(response.headers);
		return response;
	}, function onAdapterRejection(reason) {
		if (!isCancel(reason)) {
			throwIfCancellationRequested(config);
			if (reason && reason.response) {
				config.response = reason.response;
				try {
					reason.response.data = transformData.call(config, config.transformResponse, reason.response);
				} finally {
					delete config.response;
				}
				reason.response.headers = AxiosHeaders.from(reason.response.headers);
			}
		}
		return Promise.reject(reason);
	});
}
//#endregion
//#region node_modules/axios/lib/helpers/validator.js
var validators$1 = {};
[
	"object",
	"boolean",
	"number",
	"function",
	"string",
	"symbol"
].forEach((type, i) => {
	validators$1[type] = function validator(thing) {
		return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
	};
});
var deprecatedWarnings = {};
/**
* Transitional option validator
*
* @param {function|boolean?} validator - set to false if the transitional option has been removed
* @param {string?} version - deprecated version / removed since version
* @param {string?} message - some message with additional info
*
* @returns {function}
*/
validators$1.transitional = function transitional(validator, version, message) {
	function formatMessage(opt, desc) {
		return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
	}
	return (value, opt, opts) => {
		if (validator === false) throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
		if (version && !deprecatedWarnings[opt]) {
			deprecatedWarnings[opt] = true;
			console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
		}
		return validator ? validator(value, opt, opts) : true;
	};
};
validators$1.spelling = function spelling(correctSpelling) {
	return (value, opt) => {
		console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
		return true;
	};
};
/**
* Assert object's properties type
*
* @param {object} options
* @param {object} schema
* @param {boolean?} allowUnknown
*
* @returns {object}
*/
function assertOptions(options, schema, allowUnknown) {
	if (typeof options !== "object") throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
	const keys = Object.keys(options);
	let i = keys.length;
	while (i-- > 0) {
		const opt = keys[i];
		const validator = Object.prototype.hasOwnProperty.call(schema, opt) ? schema[opt] : void 0;
		if (validator) {
			const value = options[opt];
			const result = value === void 0 || validator(value, opt, options);
			if (result !== true) throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
			continue;
		}
		if (allowUnknown !== true) throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
	}
}
var validator_default = {
	assertOptions,
	validators: validators$1
};
//#endregion
//#region node_modules/axios/lib/core/Axios.js
var validators = validator_default.validators;
/**
* Create a new instance of Axios
*
* @param {Object} instanceConfig The default config for the instance
*
* @return {Axios} A new instance of Axios
*/
var Axios = class {
	constructor(instanceConfig) {
		this.defaults = instanceConfig || {};
		this.interceptors = {
			request: new InterceptorManager(),
			response: new InterceptorManager()
		};
	}
	/**
	* Dispatch a request
	*
	* @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
	* @param {?Object} config
	*
	* @returns {Promise} The Promise to be fulfilled
	*/
	async request(configOrUrl, config) {
		try {
			return await this._request(configOrUrl, config);
		} catch (err) {
			if (err instanceof Error) {
				let dummy = {};
				Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = /* @__PURE__ */ new Error();
				const stack = (() => {
					if (!dummy.stack) return "";
					const firstNewlineIndex = dummy.stack.indexOf("\n");
					return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
				})();
				try {
					if (!err.stack) err.stack = stack;
					else if (stack) {
						const firstNewlineIndex = stack.indexOf("\n");
						const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
						const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
						if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) err.stack += "\n" + stack;
					}
				} catch (e) {}
			}
			throw err;
		}
	}
	_request(configOrUrl, config) {
		if (typeof configOrUrl === "string") {
			config = config || {};
			config.url = configOrUrl;
		} else config = configOrUrl || {};
		config = mergeConfig(this.defaults, config);
		const { transitional, paramsSerializer, headers } = config;
		if (transitional !== void 0) validator_default.assertOptions(transitional, {
			silentJSONParsing: validators.transitional(validators.boolean),
			forcedJSONParsing: validators.transitional(validators.boolean),
			clarifyTimeoutError: validators.transitional(validators.boolean),
			legacyInterceptorReqResOrdering: validators.transitional(validators.boolean)
		}, false);
		if (paramsSerializer != null) if (utils_default.isFunction(paramsSerializer)) config.paramsSerializer = { serialize: paramsSerializer };
		else validator_default.assertOptions(paramsSerializer, {
			encode: validators.function,
			serialize: validators.function
		}, true);
		if (config.allowAbsoluteUrls !== void 0) {} else if (this.defaults.allowAbsoluteUrls !== void 0) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
		else config.allowAbsoluteUrls = true;
		validator_default.assertOptions(config, {
			baseUrl: validators.spelling("baseURL"),
			withXsrfToken: validators.spelling("withXSRFToken")
		}, true);
		config.method = (config.method || this.defaults.method || "get").toLowerCase();
		let contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
		headers && utils_default.forEach([
			"delete",
			"get",
			"head",
			"post",
			"put",
			"patch",
			"query",
			"common"
		], (method) => {
			delete headers[method];
		});
		config.headers = AxiosHeaders.concat(contextHeaders, headers);
		const requestInterceptorChain = [];
		let synchronousRequestInterceptors = true;
		this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
			if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
			synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
			const transitional = config.transitional || transitional_default;
			if (transitional && transitional.legacyInterceptorReqResOrdering) requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
			else requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
		});
		const responseInterceptorChain = [];
		this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
			responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
		});
		let promise;
		let i = 0;
		let len;
		if (!synchronousRequestInterceptors) {
			const chain = [dispatchRequest.bind(this), void 0];
			chain.unshift(...requestInterceptorChain);
			chain.push(...responseInterceptorChain);
			len = chain.length;
			promise = Promise.resolve(config);
			while (i < len) promise = promise.then(chain[i++], chain[i++]);
			return promise;
		}
		len = requestInterceptorChain.length;
		let newConfig = config;
		while (i < len) {
			const onFulfilled = requestInterceptorChain[i++];
			const onRejected = requestInterceptorChain[i++];
			try {
				newConfig = onFulfilled(newConfig);
			} catch (error) {
				onRejected.call(this, error);
				break;
			}
		}
		try {
			promise = dispatchRequest.call(this, newConfig);
		} catch (error) {
			return Promise.reject(error);
		}
		i = 0;
		len = responseInterceptorChain.length;
		while (i < len) promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
		return promise;
	}
	getUri(config) {
		config = mergeConfig(this.defaults, config);
		return buildURL(buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls), config.params, config.paramsSerializer);
	}
};
utils_default.forEach([
	"delete",
	"get",
	"head",
	"options"
], function forEachMethodNoData(method) {
	Axios.prototype[method] = function(url, config) {
		return this.request(mergeConfig(config || {}, {
			method,
			url,
			data: (config || {}).data
		}));
	};
});
utils_default.forEach([
	"post",
	"put",
	"patch",
	"query"
], function forEachMethodWithData(method) {
	function generateHTTPMethod(isForm) {
		return function httpMethod(url, data, config) {
			return this.request(mergeConfig(config || {}, {
				method,
				headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
				url,
				data
			}));
		};
	}
	Axios.prototype[method] = generateHTTPMethod();
	if (method !== "query") Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
//#endregion
//#region node_modules/axios/lib/cancel/CancelToken.js
/**
* A `CancelToken` is an object that can be used to request cancellation of an operation.
*
* @param {Function} executor The executor function.
*
* @returns {CancelToken}
*/
var CancelToken = class CancelToken {
	constructor(executor) {
		if (typeof executor !== "function") throw new TypeError("executor must be a function.");
		let resolvePromise;
		this.promise = new Promise(function promiseExecutor(resolve) {
			resolvePromise = resolve;
		});
		const token = this;
		this.promise.then((cancel) => {
			if (!token._listeners) return;
			let i = token._listeners.length;
			while (i-- > 0) token._listeners[i](cancel);
			token._listeners = null;
		});
		this.promise.then = (onfulfilled) => {
			let _resolve;
			const promise = new Promise((resolve) => {
				token.subscribe(resolve);
				_resolve = resolve;
			}).then(onfulfilled);
			promise.cancel = function reject() {
				token.unsubscribe(_resolve);
			};
			return promise;
		};
		executor(function cancel(message, config, request) {
			if (token.reason) return;
			token.reason = new CanceledError(message, config, request);
			resolvePromise(token.reason);
		});
	}
	/**
	* Throws a `CanceledError` if cancellation has been requested.
	*/
	throwIfRequested() {
		if (this.reason) throw this.reason;
	}
	/**
	* Subscribe to the cancel signal
	*/
	subscribe(listener) {
		if (this.reason) {
			listener(this.reason);
			return;
		}
		if (this._listeners) this._listeners.push(listener);
		else this._listeners = [listener];
	}
	/**
	* Unsubscribe from the cancel signal
	*/
	unsubscribe(listener) {
		if (!this._listeners) return;
		const index = this._listeners.indexOf(listener);
		if (index !== -1) this._listeners.splice(index, 1);
	}
	toAbortSignal() {
		const controller = new AbortController();
		const abort = (err) => {
			controller.abort(err);
		};
		this.subscribe(abort);
		controller.signal.unsubscribe = () => this.unsubscribe(abort);
		return controller.signal;
	}
	/**
	* Returns an object that contains a new `CancelToken` and a function that, when called,
	* cancels the `CancelToken`.
	*/
	static source() {
		let cancel;
		return {
			token: new CancelToken(function executor(c) {
				cancel = c;
			}),
			cancel
		};
	}
};
//#endregion
//#region node_modules/axios/lib/helpers/spread.js
/**
* Syntactic sugar for invoking a function and expanding an array for arguments.
*
* Common use case would be to use `Function.prototype.apply`.
*
*  ```js
*  function f(x, y, z) {}
*  const args = [1, 2, 3];
*  f.apply(null, args);
*  ```
*
* With `spread` this example can be re-written.
*
*  ```js
*  spread(function(x, y, z) {})([1, 2, 3]);
*  ```
*
* @param {Function} callback
*
* @returns {Function}
*/
function spread(callback) {
	return function wrap(arr) {
		return callback.apply(null, arr);
	};
}
//#endregion
//#region node_modules/axios/lib/helpers/isAxiosError.js
/**
* Determines whether the payload is an error thrown by Axios
*
* @param {*} payload The value to test
*
* @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
*/
function isAxiosError(payload) {
	return utils_default.isObject(payload) && payload.isAxiosError === true;
}
//#endregion
//#region node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
	Continue: 100,
	SwitchingProtocols: 101,
	Processing: 102,
	EarlyHints: 103,
	Ok: 200,
	Created: 201,
	Accepted: 202,
	NonAuthoritativeInformation: 203,
	NoContent: 204,
	ResetContent: 205,
	PartialContent: 206,
	MultiStatus: 207,
	AlreadyReported: 208,
	ImUsed: 226,
	MultipleChoices: 300,
	MovedPermanently: 301,
	Found: 302,
	SeeOther: 303,
	NotModified: 304,
	UseProxy: 305,
	Unused: 306,
	TemporaryRedirect: 307,
	PermanentRedirect: 308,
	BadRequest: 400,
	Unauthorized: 401,
	PaymentRequired: 402,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405,
	NotAcceptable: 406,
	ProxyAuthenticationRequired: 407,
	RequestTimeout: 408,
	Conflict: 409,
	Gone: 410,
	LengthRequired: 411,
	PreconditionFailed: 412,
	PayloadTooLarge: 413,
	UriTooLong: 414,
	UnsupportedMediaType: 415,
	RangeNotSatisfiable: 416,
	ExpectationFailed: 417,
	ImATeapot: 418,
	MisdirectedRequest: 421,
	UnprocessableEntity: 422,
	Locked: 423,
	FailedDependency: 424,
	TooEarly: 425,
	UpgradeRequired: 426,
	PreconditionRequired: 428,
	TooManyRequests: 429,
	RequestHeaderFieldsTooLarge: 431,
	UnavailableForLegalReasons: 451,
	InternalServerError: 500,
	NotImplemented: 501,
	BadGateway: 502,
	ServiceUnavailable: 503,
	GatewayTimeout: 504,
	HttpVersionNotSupported: 505,
	VariantAlsoNegotiates: 506,
	InsufficientStorage: 507,
	LoopDetected: 508,
	NotExtended: 510,
	NetworkAuthenticationRequired: 511,
	WebServerIsDown: 521,
	ConnectionTimedOut: 522,
	OriginIsUnreachable: 523,
	TimeoutOccurred: 524,
	SslHandshakeFailed: 525,
	InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
	HttpStatusCode[value] = key;
});
//#endregion
//#region node_modules/axios/lib/axios.js
/**
* Create an instance of Axios
*
* @param {Object} defaultConfig The default config for the instance
*
* @returns {Axios} A new instance of Axios
*/
function createInstance(defaultConfig) {
	const context = new Axios(defaultConfig);
	const instance = bind(Axios.prototype.request, context);
	utils_default.extend(instance, Axios.prototype, context, { allOwnKeys: true });
	utils_default.extend(instance, context, null, { allOwnKeys: true });
	instance.create = function create(instanceConfig) {
		return createInstance(mergeConfig(defaultConfig, instanceConfig));
	};
	return instance;
}
var axios = createInstance(defaults);
axios.Axios = Axios;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
	return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders;
axios.formToJSON = (thing) => formDataToJSON(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode;
axios.default = axios;
/*!
* sweetalert2 v11.26.25
* Released under the MIT License.
*/
//#endregion
//#region resources/js/bootstrap.js
var import_sweetalert2_all = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Sweetalert2 = factory());
	})(exports, (function() {
		"use strict";
		function _assertClassBrand(e, t, n) {
			if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
			throw new TypeError("Private element is not present on this object");
		}
		function _checkPrivateRedeclaration(e, t) {
			if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
		}
		function _classPrivateFieldGet2(s, a) {
			return s.get(_assertClassBrand(s, a));
		}
		function _classPrivateFieldInitSpec(e, t, a) {
			_checkPrivateRedeclaration(e, t), t.set(e, a);
		}
		function _classPrivateFieldSet2(s, a, r) {
			return s.set(_assertClassBrand(s, a), r), r;
		}
		const RESTORE_FOCUS_TIMEOUT = 100;
		/** @type {GlobalState} */
		const globalState = {};
		const focusPreviousActiveElement = () => {
			if (globalState.previousActiveElement instanceof HTMLElement) {
				globalState.previousActiveElement.focus();
				globalState.previousActiveElement = null;
			} else if (document.body) document.body.focus();
		};
		/**
		* Restore previous active (focused) element
		*
		* @param {boolean} returnFocus
		* @returns {Promise<void>}
		*/
		const restoreActiveElement = (returnFocus) => {
			return new Promise((resolve) => {
				if (!returnFocus) return resolve();
				const x = window.scrollX;
				const y = window.scrollY;
				globalState.restoreFocusTimeout = setTimeout(() => {
					focusPreviousActiveElement();
					resolve();
				}, RESTORE_FOCUS_TIMEOUT);
				window.scrollTo(x, y);
			});
		};
		const swalPrefix = "swal2-";
		const swalClasses = [
			"container",
			"shown",
			"height-auto",
			"iosfix",
			"popup",
			"modal",
			"no-backdrop",
			"no-transition",
			"toast",
			"toast-shown",
			"show",
			"hide",
			"close",
			"title",
			"html-container",
			"actions",
			"confirm",
			"deny",
			"cancel",
			"footer",
			"icon",
			"icon-content",
			"image",
			"input",
			"file",
			"range",
			"select",
			"radio",
			"checkbox",
			"label",
			"textarea",
			"inputerror",
			"input-label",
			"validation-message",
			"progress-steps",
			"active-progress-step",
			"progress-step",
			"progress-step-line",
			"loader",
			"loading",
			"styled",
			"top",
			"top-start",
			"top-end",
			"top-left",
			"top-right",
			"center",
			"center-start",
			"center-end",
			"center-left",
			"center-right",
			"bottom",
			"bottom-start",
			"bottom-end",
			"bottom-left",
			"bottom-right",
			"grow-row",
			"grow-column",
			"grow-fullscreen",
			"rtl",
			"timer-progress-bar",
			"timer-progress-bar-container",
			"scrollbar-measure",
			"icon-success",
			"icon-warning",
			"icon-info",
			"icon-question",
			"icon-error",
			"draggable",
			"dragging"
		].reduce(
			(acc, className) => {
				acc[className] = swalPrefix + className;
				return acc;
			},
			/** @type {SwalClasses} */
			{}
		);
		const iconTypes = [
			"success",
			"warning",
			"info",
			"question",
			"error"
		].reduce(
			(acc, icon) => {
				acc[icon] = swalPrefix + icon;
				return acc;
			},
			/** @type {SwalIcons} */
			{}
		);
		const consolePrefix = "SweetAlert2:";
		/**
		* Capitalize the first letter of a string
		*
		* @param {string} str
		* @returns {string}
		*/
		const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
		/**
		* Standardize console warnings
		*
		* @param {string | string[]} message
		*/
		const warn = (message) => {
			console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
		};
		/**
		* Standardize console errors
		*
		* @param {string} message
		*/
		const error = (message) => {
			console.error(`${consolePrefix} ${message}`);
		};
		/**
		* Private global state for `warnOnce`
		*
		* @type {string[]}
		* @private
		*/
		const previousWarnOnceMessages = [];
		/**
		* Show a console warning, but only if it hasn't already been shown
		*
		* @param {string} message
		*/
		const warnOnce = (message) => {
			if (!previousWarnOnceMessages.includes(message)) {
				previousWarnOnceMessages.push(message);
				warn(message);
			}
		};
		/**
		* Show a one-time console warning about deprecated params/methods
		*
		* @param {string} deprecatedParam
		* @param {string?} useInstead
		*/
		const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
			warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ""}`);
		};
		/**
		* If `arg` is a function, call it (with no arguments or context) and return the result.
		* Otherwise, just pass the value through
		*
		* @param {(() => *) | *} arg
		* @returns {*}
		*/
		const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
		/**
		* @param {*} arg
		* @returns {boolean}
		*/
		const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
		/**
		* @param {*} arg
		* @returns {Promise<*>}
		*/
		const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
		/**
		* @param {*} arg
		* @returns {boolean}
		*/
		const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
		/**
		* @returns {boolean}
		*/
		const isFirefox = () => navigator.userAgent.includes("Firefox");
		/**
		* Gets the popup container which contains the backdrop and the popup itself.
		*
		* @returns {HTMLElement | null}
		*/
		const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
		/**
		* @param {string} selectorString
		* @returns {HTMLElement | null}
		*/
		const elementBySelector = (selectorString) => {
			const container = getContainer();
			return container ? container.querySelector(selectorString) : null;
		};
		/**
		* @param {string} className
		* @returns {HTMLElement | null}
		*/
		const elementByClass = (className) => {
			return elementBySelector(`.${className}`);
		};
		/**
		* @returns {HTMLElement | null}
		*/
		const getPopup = () => elementByClass(swalClasses.popup);
		/**
		* @returns {HTMLElement | null}
		*/
		const getIcon = () => elementByClass(swalClasses.icon);
		/**
		* @returns {HTMLElement | null}
		*/
		const getIconContent = () => elementByClass(swalClasses["icon-content"]);
		/**
		* @returns {HTMLElement | null}
		*/
		const getTitle = () => elementByClass(swalClasses.title);
		/**
		* @returns {HTMLElement | null}
		*/
		const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
		/**
		* @returns {HTMLElement | null}
		*/
		const getImage = () => elementByClass(swalClasses.image);
		/**
		* @returns {HTMLElement | null}
		*/
		const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
		/**
		* @returns {HTMLElement | null}
		*/
		const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
		/**
		* @returns {HTMLButtonElement | null}
		*/
		const getConfirmButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`);
		/**
		* @returns {HTMLButtonElement | null}
		*/
		const getCancelButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`);
		/**
		* @returns {HTMLButtonElement | null}
		*/
		const getDenyButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`);
		/**
		* @returns {HTMLElement | null}
		*/
		const getInputLabel = () => elementByClass(swalClasses["input-label"]);
		/**
		* @returns {HTMLElement | null}
		*/
		const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
		/**
		* @returns {HTMLElement | null}
		*/
		const getActions = () => elementByClass(swalClasses.actions);
		/**
		* @returns {HTMLElement | null}
		*/
		const getFooter = () => elementByClass(swalClasses.footer);
		/**
		* @returns {HTMLElement | null}
		*/
		const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
		/**
		* @returns {HTMLElement | null}
		*/
		const getCloseButton = () => elementByClass(swalClasses.close);
		const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
		/**
		* @returns {HTMLElement[]}
		*/
		const getFocusableElements = () => {
			const popup = getPopup();
			if (!popup) return [];
			/** @type {NodeListOf<HTMLElement>} */
			const focusableElementsWithTabindex = popup.querySelectorAll("[tabindex]:not([tabindex=\"-1\"]):not([tabindex=\"0\"])");
			const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort((a, b) => {
				const tabindexA = parseInt(a.getAttribute("tabindex") || "0");
				const tabindexB = parseInt(b.getAttribute("tabindex") || "0");
				if (tabindexA > tabindexB) return 1;
				else if (tabindexA < tabindexB) return -1;
				return 0;
			});
			/** @type {NodeListOf<HTMLElement>} */
			const otherFocusableElements = popup.querySelectorAll(focusable);
			const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter((el) => el.getAttribute("tabindex") !== "-1");
			return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) => isVisible$1(el));
		};
		/**
		* @returns {boolean}
		*/
		const isModal = () => {
			return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
		};
		/**
		* @returns {boolean}
		*/
		const isToast = () => {
			const popup = getPopup();
			if (!popup) return false;
			return hasClass(popup, swalClasses.toast);
		};
		/**
		* @returns {boolean}
		*/
		const isLoading = () => {
			const popup = getPopup();
			if (!popup) return false;
			return popup.hasAttribute("data-loading");
		};
		/**
		* Securely set innerHTML of an element
		* https://github.com/sweetalert2/sweetalert2/issues/1926
		*
		* @param {HTMLElement} elem
		* @param {string} html
		*/
		const setInnerHtml = (elem, html) => {
			elem.textContent = "";
			if (html) {
				const parsed = new DOMParser().parseFromString(html, `text/html`);
				const head = parsed.querySelector("head");
				if (head) Array.from(head.childNodes).forEach((child) => {
					elem.appendChild(child);
				});
				const body = parsed.querySelector("body");
				if (body) Array.from(body.childNodes).forEach((child) => {
					if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) elem.appendChild(child.cloneNode(true));
					else elem.appendChild(child);
				});
			}
		};
		/**
		* @param {HTMLElement} elem
		* @param {string} className
		* @returns {boolean}
		*/
		const hasClass = (elem, className) => {
			if (!className) return false;
			return className.split(/\s+/).every((cls) => elem.classList.contains(cls));
		};
		/**
		* @param {HTMLElement} elem
		* @param {SweetAlertOptions} params
		*/
		const removeCustomClasses = (elem, params) => {
			Array.from(elem.classList).forEach((className) => {
				if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) elem.classList.remove(className);
			});
		};
		/**
		* @param {HTMLElement} elem
		* @param {SweetAlertOptions} params
		* @param {string} className
		*/
		const applyCustomClass = (elem, params, className) => {
			removeCustomClasses(elem, params);
			if (!params.customClass) return;
			const customClass = params.customClass[className];
			if (!customClass) return;
			if (typeof customClass !== "string" && !customClass.forEach) {
				warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
				return;
			}
			addClass(elem, customClass);
		};
		/**
		* @param {HTMLElement} popup
		* @param {import('./renderers/renderInput').InputClass | SweetAlertInput} inputClass
		* @returns {HTMLInputElement | null}
		*/
		const getInput$1 = (popup, inputClass) => {
			if (!inputClass) return null;
			switch (inputClass) {
				case "select":
				case "textarea":
				case "file": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
				case "checkbox": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
				case "radio": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
				case "range": return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
				default: return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
			}
		};
		/**
		* @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
		*/
		const focusInput = (input) => {
			input.focus();
			if (input.type !== "file") {
				const val = input.value;
				input.value = "";
				input.value = val;
			}
		};
		/**
		* @param {HTMLElement | HTMLElement[] | null} target
		* @param {string | string[] | readonly string[] | undefined} classList
		* @param {boolean} condition
		*/
		const toggleClass = (target, classList, condition) => {
			if (!target || !classList) return;
			const classes = typeof classList === "string" ? classList.split(/\s+/).filter(Boolean) : classList;
			(Array.isArray(target) ? target : [target]).forEach((elem) => {
				classes.forEach((className) => {
					if (condition) elem.classList.add(className);
					else elem.classList.remove(className);
				});
			});
		};
		/**
		* @param {HTMLElement | HTMLElement[] | null} target
		* @param {string | string[] | readonly string[] | undefined} classList
		*/
		const addClass = (target, classList) => {
			toggleClass(target, classList, true);
		};
		/**
		* @param {HTMLElement | HTMLElement[] | null} target
		* @param {string | string[] | readonly string[] | undefined} classList
		*/
		const removeClass = (target, classList) => {
			toggleClass(target, classList, false);
		};
		/**
		* Get direct child of an element by class name
		*
		* @param {HTMLElement} elem
		* @param {string} className
		* @returns {HTMLElement | undefined}
		*/
		const getDirectChildByClass = (elem, className) => Array.from(elem.children).find((child) => child instanceof HTMLElement && hasClass(child, className));
		/**
		* @param {HTMLElement} elem
		* @param {string} property
		* @param {string | number | null | undefined} value
		*/
		const applyNumericalStyle = (elem, property, value) => {
			if (value === `${parseInt(`${value}`)}`) value = parseInt(value);
			if (value || value === 0) elem.style.setProperty(property, typeof value === "number" ? `${value}px` : 			/** @type {string} */ value);
			else elem.style.removeProperty(property);
		};
		/**
		* @param {HTMLElement | null} elem
		* @param {string} display
		*/
		const show = (elem, display = "flex") => {
			if (!elem) return;
			elem.style.display = display;
		};
		/**
		* @param {HTMLElement | null} elem
		*/
		const hide = (elem) => {
			if (!elem) return;
			elem.style.display = "none";
		};
		/**
		* @param {HTMLElement | null} elem
		* @param {string} display
		*/
		const showWhenInnerHtmlPresent = (elem, display = "block") => {
			if (!elem) return;
			new MutationObserver(() => {
				toggle(elem, elem.innerHTML, display);
			}).observe(elem, {
				childList: true,
				subtree: true
			});
		};
		/**
		* @param {HTMLElement} parent
		* @param {string} selector
		* @param {string} property
		* @param {string} value
		*/
		const setStyle = (parent, selector, property, value) => {
			/** @type {HTMLElement | null} */
			const el = parent.querySelector(selector);
			if (el) el.style.setProperty(property, value);
		};
		/**
		* @param {HTMLElement} elem
		* @param {boolean | string | null | undefined} condition
		* @param {string} display
		*/
		const toggle = (elem, condition, display = "flex") => {
			if (condition) show(elem, display);
			else hide(elem);
		};
		/**
		* borrowed from jquery $(elem).is(':visible') implementation
		*
		* @param {HTMLElement | null} elem
		* @returns {boolean}
		*/
		const isVisible$1 = (elem) => Boolean(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
		/**
		* @returns {boolean}
		*/
		const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
		/**
		* @param {HTMLElement} elem
		* @returns {boolean}
		*/
		const isScrollable = (elem) => Boolean(elem.scrollHeight > elem.clientHeight);
		/**
		* @param {HTMLElement} element
		* @param {HTMLElement} stopElement
		* @returns {boolean}
		*/
		const selfOrParentIsScrollable = (element, stopElement) => {
			let parent = element;
			while (parent && parent !== stopElement) {
				if (isScrollable(parent)) return true;
				parent = parent.parentElement;
			}
			return false;
		};
		/**
		* borrowed from https://stackoverflow.com/a/46352119
		*
		* @param {HTMLElement} elem
		* @returns {boolean}
		*/
		const hasCssAnimation = (elem) => {
			const style = window.getComputedStyle(elem);
			const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
			const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
			return animDuration > 0 || transDuration > 0;
		};
		/**
		* @param {number} timer
		* @param {boolean} reset
		*/
		const animateTimerProgressBar = (timer, reset = false) => {
			const timerProgressBar = getTimerProgressBar();
			if (!timerProgressBar) return;
			if (isVisible$1(timerProgressBar)) {
				if (reset) {
					timerProgressBar.style.transition = "none";
					timerProgressBar.style.width = "100%";
				}
				setTimeout(() => {
					timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
					timerProgressBar.style.width = "0%";
				}, 10);
			}
		};
		const stopTimerProgressBar = () => {
			const timerProgressBar = getTimerProgressBar();
			if (!timerProgressBar) return;
			const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
			timerProgressBar.style.removeProperty("transition");
			timerProgressBar.style.width = "100%";
			const timerProgressBarPercent = timerProgressBarWidth / parseInt(window.getComputedStyle(timerProgressBar).width) * 100;
			timerProgressBar.style.width = `${timerProgressBarPercent}%`;
		};
		/**
		* Detect Node env
		*
		* @returns {boolean}
		*/
		const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
		const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
		/**
		* @returns {boolean}
		*/
		const resetOldContainer = () => {
			const oldContainer = getContainer();
			if (!oldContainer) return false;
			oldContainer.remove();
			removeClass([document.documentElement, document.body], [
				swalClasses["no-backdrop"],
				swalClasses["toast-shown"],
				swalClasses["has-column"]
			]);
			return true;
		};
		const resetValidationMessage$1 = () => {
			if (globalState.currentInstance) globalState.currentInstance.resetValidationMessage();
		};
		const addInputChangeListeners = () => {
			const popup = getPopup();
			if (!popup) return;
			const input = getDirectChildByClass(popup, swalClasses.input);
			const file = getDirectChildByClass(popup, swalClasses.file);
			/** @type {HTMLInputElement | null} */
			const range = popup.querySelector(`.${swalClasses.range} input`);
			/** @type {HTMLOutputElement | null} */
			const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
			const select = getDirectChildByClass(popup, swalClasses.select);
			/** @type {HTMLInputElement | null} */
			const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
			const textarea = getDirectChildByClass(popup, swalClasses.textarea);
			if (input) input.oninput = resetValidationMessage$1;
			if (file) file.onchange = resetValidationMessage$1;
			if (select) select.onchange = resetValidationMessage$1;
			if (checkbox) checkbox.onchange = resetValidationMessage$1;
			if (textarea) textarea.oninput = resetValidationMessage$1;
			if (range && rangeOutput) {
				range.oninput = () => {
					resetValidationMessage$1();
					rangeOutput.value = range.value;
				};
				range.onchange = () => {
					resetValidationMessage$1();
					rangeOutput.value = range.value;
				};
			}
		};
		/**
		* @param {string | HTMLElement} target
		* @returns {HTMLElement}
		*/
		const getTarget = (target) => {
			if (typeof target === "string") {
				const element = document.querySelector(target);
				if (!element) throw new Error(`Target element "${target}" not found`);
				return element;
			}
			return target;
		};
		/**
		* @param {SweetAlertOptions} params
		*/
		const setupAccessibility = (params) => {
			const popup = getPopup();
			if (!popup) return;
			popup.setAttribute("role", params.toast ? "alert" : "dialog");
			popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
			if (!params.toast) popup.setAttribute("aria-modal", "true");
		};
		/**
		* @param {HTMLElement} targetElement
		*/
		const setupRTL = (targetElement) => {
			if (window.getComputedStyle(targetElement).direction === "rtl") {
				addClass(getContainer(), swalClasses.rtl);
				globalState.isRTL = true;
			}
		};
		/**
		* Add modal + backdrop to DOM
		*
		* @param {SweetAlertOptions} params
		*/
		const init = (params) => {
			const oldContainerExisted = resetOldContainer();
			if (isNodeEnv()) {
				error("SweetAlert2 requires document to initialize");
				return;
			}
			const container = document.createElement("div");
			container.className = swalClasses.container;
			if (oldContainerExisted) addClass(container, swalClasses["no-transition"]);
			setInnerHtml(container, sweetHTML);
			container.dataset["swal2Theme"] = params.theme;
			const targetElement = getTarget(params.target || "body");
			targetElement.appendChild(container);
			if (params.topLayer) {
				container.setAttribute("popover", "");
				container.showPopover();
			}
			setupAccessibility(params);
			setupRTL(targetElement);
			addInputChangeListeners();
		};
		/**
		* @param {HTMLElement | object | string} param
		* @param {HTMLElement} target
		*/
		const parseHtmlToContainer = (param, target) => {
			if (param instanceof HTMLElement) target.appendChild(param);
			else if (typeof param === "object") handleObject(param, target);
			else if (param) setInnerHtml(target, param);
		};
		/**
		* @param {object} param
		* @param {HTMLElement} target
		*/
		const handleObject = (param, target) => {
			if ("jquery" in param) handleJqueryElem(target, param);
			else setInnerHtml(target, param.toString());
		};
		/**
		* @param {HTMLElement} target
		* @param {any} elem
		*/
		const handleJqueryElem = (target, elem) => {
			target.textContent = "";
			if (0 in elem) for (let i = 0; i in elem; i++) target.appendChild(elem[i].cloneNode(true));
			else target.appendChild(elem.cloneNode(true));
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderActions = (instance, params) => {
			const actions = getActions();
			const loader = getLoader();
			if (!actions || !loader) return;
			if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) hide(actions);
			else show(actions);
			applyCustomClass(actions, params, "actions");
			renderButtons(actions, loader, params);
			setInnerHtml(loader, params.loaderHtml || "");
			applyCustomClass(loader, params, "loader");
		};
		/**
		* @param {HTMLElement} actions
		* @param {HTMLElement} loader
		* @param {SweetAlertOptions} params
		*/
		function renderButtons(actions, loader, params) {
			const confirmButton = getConfirmButton();
			const denyButton = getDenyButton();
			const cancelButton = getCancelButton();
			if (!confirmButton || !denyButton || !cancelButton) return;
			renderButton(confirmButton, "confirm", params);
			renderButton(denyButton, "deny", params);
			renderButton(cancelButton, "cancel", params);
			handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
			if (params.reverseButtons) if (params.toast) {
				actions.insertBefore(cancelButton, confirmButton);
				actions.insertBefore(denyButton, confirmButton);
			} else {
				actions.insertBefore(cancelButton, loader);
				actions.insertBefore(denyButton, loader);
				actions.insertBefore(confirmButton, loader);
			}
		}
		/**
		* @param {HTMLElement} confirmButton
		* @param {HTMLElement} denyButton
		* @param {HTMLElement} cancelButton
		* @param {SweetAlertOptions} params
		*/
		function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
			if (!params.buttonsStyling) {
				removeClass([
					confirmButton,
					denyButton,
					cancelButton
				], swalClasses.styled);
				return;
			}
			addClass([
				confirmButton,
				denyButton,
				cancelButton
			], swalClasses.styled);
			[
				[
					confirmButton,
					"confirm",
					params.confirmButtonColor
				],
				[
					denyButton,
					"deny",
					params.denyButtonColor
				],
				[
					cancelButton,
					"cancel",
					params.cancelButtonColor
				]
			].forEach(([button, type, color]) => {
				if (color) button.style.setProperty(`--swal2-${type}-button-background-color`, color);
				applyOutlineColor(button);
			});
		}
		/**
		* @param {HTMLElement} button
		*/
		function applyOutlineColor(button) {
			const buttonStyle = window.getComputedStyle(button);
			if (buttonStyle.getPropertyValue("--swal2-action-button-focus-box-shadow")) return;
			const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
			button.style.setProperty("--swal2-action-button-focus-box-shadow", buttonStyle.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${outlineColor}`));
		}
		/**
		* @param {HTMLElement} button
		* @param {'confirm' | 'deny' | 'cancel'} buttonType
		* @param {SweetAlertOptions} params
		*/
		function renderButton(button, buttonType, params) {
			toggle(button, params[`show${capitalizeFirstLetter(buttonType)}Button`], "inline-block");
			setInnerHtml(button, params[`${buttonType}ButtonText`] || "");
			button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`] || "");
			button.className = swalClasses[buttonType];
			applyCustomClass(button, params, `${buttonType}Button`);
		}
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderCloseButton = (instance, params) => {
			const closeButton = getCloseButton();
			if (!closeButton) return;
			setInnerHtml(closeButton, params.closeButtonHtml || "");
			applyCustomClass(closeButton, params, "closeButton");
			toggle(closeButton, params.showCloseButton);
			closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderContainer = (instance, params) => {
			const container = getContainer();
			if (!container) return;
			handleBackdropParam(container, params.backdrop);
			handlePositionParam(container, params.position);
			handleGrowParam(container, params.grow);
			applyCustomClass(container, params, "container");
		};
		/**
		* @param {HTMLElement} container
		* @param {SweetAlertOptions['backdrop']} backdrop
		*/
		function handleBackdropParam(container, backdrop) {
			if (typeof backdrop === "string") container.style.background = backdrop;
			else if (!backdrop) addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
		}
		/**
		* @param {HTMLElement} container
		* @param {SweetAlertOptions['position']} position
		*/
		function handlePositionParam(container, position) {
			if (!position) return;
			if (position in swalClasses) addClass(container, swalClasses[position]);
			else {
				warn("The \"position\" parameter is not valid, defaulting to \"center\"");
				addClass(container, swalClasses.center);
			}
		}
		/**
		* @param {HTMLElement} container
		* @param {SweetAlertOptions['grow']} grow
		*/
		function handleGrowParam(container, grow) {
			if (!grow) return;
			addClass(container, swalClasses[`grow-${grow}`]);
		}
		/**
		* This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
		* For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
		* This is the approach that Babel will probably take to implement private methods/fields
		*   https://github.com/tc39/proposal-private-methods
		*   https://github.com/babel/babel/pull/7555
		* Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
		*   then we can use that language feature.
		*/
		var privateProps = {
			innerParams: /* @__PURE__ */ new WeakMap(),
			domCache: /* @__PURE__ */ new WeakMap(),
			focusedElement: /* @__PURE__ */ new WeakMap()
		};
		/** @type {InputClass[]} */
		const inputClasses = [
			"input",
			"file",
			"range",
			"select",
			"radio",
			"checkbox",
			"textarea"
		];
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderInput = (instance, params) => {
			const popup = getPopup();
			if (!popup) return;
			const innerParams = privateProps.innerParams.get(instance);
			const rerender = !innerParams || params.input !== innerParams.input;
			inputClasses.forEach((inputClass) => {
				const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
				if (!inputContainer) return;
				setAttributes(inputClass, params.inputAttributes);
				inputContainer.className = swalClasses[inputClass];
				if (rerender) hide(inputContainer);
			});
			if (params.input) {
				if (rerender) showInput(params);
				setCustomClass(params);
			}
		};
		/**
		* @param {SweetAlertOptions} params
		*/
		const showInput = (params) => {
			if (!params.input) return;
			if (!renderInputType[params.input]) {
				error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(" | ")}, got "${params.input}"`);
				return;
			}
			const inputContainer = getInputContainer(params.input);
			if (!inputContainer) return;
			const input = renderInputType[params.input](inputContainer, params);
			show(inputContainer);
			if (params.inputAutoFocus) setTimeout(() => {
				focusInput(input);
			});
		};
		/**
		* @param {HTMLInputElement} input
		*/
		const removeAttributes = (input) => {
			for (const { name } of Array.from(input.attributes)) if (![
				"id",
				"type",
				"value",
				"style"
			].includes(name)) input.removeAttribute(name);
		};
		/**
		* @param {InputClass} inputClass
		* @param {SweetAlertOptions['inputAttributes']} inputAttributes
		*/
		const setAttributes = (inputClass, inputAttributes) => {
			const popup = getPopup();
			if (!popup) return;
			const input = getInput$1(popup, inputClass);
			if (!input) return;
			removeAttributes(input);
			for (const attr in inputAttributes) input.setAttribute(attr, inputAttributes[attr]);
		};
		/**
		* @param {SweetAlertOptions} params
		*/
		const setCustomClass = (params) => {
			if (!params.input) return;
			const inputContainer = getInputContainer(params.input);
			if (inputContainer) applyCustomClass(inputContainer, params, "input");
		};
		/**
		* @param {HTMLInputElement | HTMLTextAreaElement} input
		* @param {SweetAlertOptions} params
		*/
		const setInputPlaceholder = (input, params) => {
			if (!input.placeholder && params.inputPlaceholder) input.placeholder = params.inputPlaceholder;
		};
		/**
		* @param {Input} input
		* @param {Input} prependTo
		* @param {SweetAlertOptions} params
		*/
		const setInputLabel = (input, prependTo, params) => {
			if (params.inputLabel) {
				const label = document.createElement("label");
				const labelClass = swalClasses["input-label"];
				label.setAttribute("for", input.id);
				label.className = labelClass;
				if (typeof params.customClass === "object") addClass(label, params.customClass.inputLabel);
				label.innerText = params.inputLabel;
				prependTo.insertAdjacentElement("beforebegin", label);
			}
		};
		/**
		* @param {SweetAlertInput} inputType
		* @returns {HTMLElement | undefined}
		*/
		const getInputContainer = (inputType) => {
			const popup = getPopup();
			if (!popup) return;
			return getDirectChildByClass(popup, swalClasses[inputType] || swalClasses.input);
		};
		/**
		* @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
		* @param {SweetAlertOptions['inputValue']} inputValue
		*/
		const checkAndSetInputValue = (input, inputValue) => {
			if (["string", "number"].includes(typeof inputValue)) input.value = `${inputValue}`;
			else if (!isPromise(inputValue)) warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
		};
		/** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
		const renderInputType = {};
		/**
		* @param {Input | HTMLElement} input
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = (input, params) => {
			const inputElement = input;
			checkAndSetInputValue(inputElement, params.inputValue);
			setInputLabel(inputElement, inputElement, params);
			setInputPlaceholder(inputElement, params);
			inputElement.type = params.input;
			return inputElement;
		};
		/**
		* @param {Input | HTMLElement} input
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.file = (input, params) => {
			const inputElement = input;
			setInputLabel(inputElement, inputElement, params);
			setInputPlaceholder(inputElement, params);
			return inputElement;
		};
		/**
		* @param {Input | HTMLElement} range
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.range = (range, params) => {
			const rangeContainer = range;
			const rangeInput = rangeContainer.querySelector("input");
			const rangeOutput = rangeContainer.querySelector("output");
			if (rangeInput) {
				checkAndSetInputValue(rangeInput, params.inputValue);
				rangeInput.type = params.input;
				setInputLabel(
					rangeInput,
					/** @type {Input} */
					range,
					params
				);
			}
			if (rangeOutput) checkAndSetInputValue(rangeOutput, params.inputValue);
			return range;
		};
		/**
		* @param {Input | HTMLElement} select
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.select = (select, params) => {
			const selectElement = select;
			selectElement.textContent = "";
			if (params.inputPlaceholder) {
				const placeholder = document.createElement("option");
				setInnerHtml(placeholder, params.inputPlaceholder);
				placeholder.value = "";
				placeholder.disabled = true;
				placeholder.selected = true;
				selectElement.appendChild(placeholder);
			}
			setInputLabel(selectElement, selectElement, params);
			return selectElement;
		};
		/**
		* @param {Input | HTMLElement} radio
		* @returns {Input}
		*/
		renderInputType.radio = (radio) => {
			const radioElement = radio;
			radioElement.textContent = "";
			return radio;
		};
		/**
		* @param {Input | HTMLElement} checkboxContainer
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.checkbox = (checkboxContainer, params) => {
			const popup = getPopup();
			if (!popup) throw new Error("Popup not found");
			const checkbox = getInput$1(popup, "checkbox");
			if (!checkbox) throw new Error("Checkbox input not found");
			checkbox.value = "1";
			checkbox.checked = Boolean(params.inputValue);
			const label = checkboxContainer.querySelector("span");
			if (label) {
				const placeholderOrLabel = params.inputPlaceholder || params.inputLabel;
				if (placeholderOrLabel) setInnerHtml(label, placeholderOrLabel);
			}
			return checkbox;
		};
		/**
		* @param {Input | HTMLElement} textarea
		* @param {SweetAlertOptions} params
		* @returns {Input}
		*/
		renderInputType.textarea = (textarea, params) => {
			const textareaElement = textarea;
			checkAndSetInputValue(textareaElement, params.inputValue);
			setInputPlaceholder(textareaElement, params);
			setInputLabel(textareaElement, textareaElement, params);
			/**
			* @param {HTMLElement} el
			* @returns {number}
			*/
			const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
			setTimeout(() => {
				if ("MutationObserver" in window) {
					const popup = getPopup();
					if (!popup) return;
					const initialPopupWidth = parseInt(window.getComputedStyle(popup).width);
					const textareaResizeHandler = () => {
						if (!document.body.contains(textareaElement)) return;
						const textareaWidth = textareaElement.offsetWidth + getMargin(textareaElement);
						const popupElement = getPopup();
						if (popupElement) if (textareaWidth > initialPopupWidth) popupElement.style.width = `${textareaWidth}px`;
						else applyNumericalStyle(popupElement, "width", params.width);
					};
					new MutationObserver(textareaResizeHandler).observe(textareaElement, {
						attributes: true,
						attributeFilter: ["style"]
					});
				}
			});
			return textareaElement;
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderContent = (instance, params) => {
			const htmlContainer = getHtmlContainer();
			if (!htmlContainer) return;
			showWhenInnerHtmlPresent(htmlContainer);
			applyCustomClass(htmlContainer, params, "htmlContainer");
			if (params.html) {
				parseHtmlToContainer(params.html, htmlContainer);
				show(htmlContainer, "block");
			} else if (params.text) {
				htmlContainer.textContent = params.text;
				show(htmlContainer, "block");
			} else hide(htmlContainer);
			renderInput(instance, params);
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderFooter = (instance, params) => {
			const footer = getFooter();
			if (!footer) return;
			showWhenInnerHtmlPresent(footer);
			toggle(footer, Boolean(params.footer), "block");
			if (params.footer) parseHtmlToContainer(params.footer, footer);
			applyCustomClass(footer, params, "footer");
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderIcon = (instance, params) => {
			const innerParams = privateProps.innerParams.get(instance);
			const icon = getIcon();
			if (!icon) return;
			if (innerParams && params.icon === innerParams.icon) {
				setContent(icon, params);
				applyStyles(icon, params);
				return;
			}
			if (!params.icon && !params.iconHtml) {
				hide(icon);
				return;
			}
			if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
				error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
				hide(icon);
				return;
			}
			show(icon);
			setContent(icon, params);
			applyStyles(icon, params);
			addClass(icon, params.showClass && params.showClass.icon);
			window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", adjustSuccessIconBackgroundColor);
		};
		/**
		* @param {HTMLElement} icon
		* @param {SweetAlertOptions} params
		*/
		const applyStyles = (icon, params) => {
			for (const [iconType, iconClassName] of Object.entries(iconTypes)) if (params.icon !== iconType) removeClass(icon, iconClassName);
			addClass(icon, params.icon && iconTypes[params.icon]);
			setColor(icon, params);
			adjustSuccessIconBackgroundColor();
			applyCustomClass(icon, params, "icon");
		};
		const adjustSuccessIconBackgroundColor = () => {
			const popup = getPopup();
			if (!popup) return;
			const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
			popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix").forEach((part) => {
				part.style.backgroundColor = popupBackgroundColor;
			});
		};
		/**
		*
		* @param {SweetAlertOptions} params
		* @returns {string}
		*/
		const successIconHtml = (params) => `
  ${params.animation ? "<div class=\"swal2-success-circular-line-left\"></div>" : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? "<div class=\"swal2-success-fix\"></div>" : ""}
  ${params.animation ? "<div class=\"swal2-success-circular-line-right\"></div>" : ""}
`;
		const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
		/**
		* @param {HTMLElement} icon
		* @param {SweetAlertOptions} params
		*/
		const setContent = (icon, params) => {
			if (!params.icon && !params.iconHtml) return;
			let oldContent = icon.innerHTML;
			let newContent = "";
			if (params.iconHtml) newContent = iconContent(params.iconHtml);
			else if (params.icon === "success") {
				newContent = successIconHtml(params);
				oldContent = oldContent.replace(/ style=".*?"/g, "");
			} else if (params.icon === "error") newContent = errorIconHtml;
			else if (params.icon) newContent = iconContent({
				question: "?",
				warning: "!",
				info: "i"
			}[params.icon]);
			if (oldContent.trim() !== newContent.trim()) setInnerHtml(icon, newContent);
		};
		/**
		* @param {HTMLElement} icon
		* @param {SweetAlertOptions} params
		*/
		const setColor = (icon, params) => {
			if (!params.iconColor) return;
			icon.style.color = params.iconColor;
			icon.style.borderColor = params.iconColor;
			for (const sel of [
				".swal2-success-line-tip",
				".swal2-success-line-long",
				".swal2-x-mark-line-left",
				".swal2-x-mark-line-right"
			]) setStyle(icon, sel, "background-color", params.iconColor);
			setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
		};
		/**
		* @param {string} content
		* @returns {string}
		*/
		const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderImage = (instance, params) => {
			const image = getImage();
			if (!image) return;
			if (!params.imageUrl) {
				hide(image);
				return;
			}
			show(image, "");
			image.setAttribute("src", params.imageUrl);
			image.setAttribute("alt", params.imageAlt || "");
			applyNumericalStyle(image, "width", params.imageWidth);
			applyNumericalStyle(image, "height", params.imageHeight);
			image.className = swalClasses.image;
			applyCustomClass(image, params, "image");
		};
		let dragging = false;
		let mousedownX = 0;
		let mousedownY = 0;
		let initialX = 0;
		let initialY = 0;
		/**
		* @param {HTMLElement} popup
		*/
		const addDraggableListeners = (popup) => {
			popup.addEventListener("mousedown", down);
			document.body.addEventListener("mousemove", move);
			popup.addEventListener("mouseup", up);
			popup.addEventListener("touchstart", down);
			document.body.addEventListener("touchmove", move);
			popup.addEventListener("touchend", up);
		};
		/**
		* @param {HTMLElement} popup
		*/
		const removeDraggableListeners = (popup) => {
			popup.removeEventListener("mousedown", down);
			document.body.removeEventListener("mousemove", move);
			popup.removeEventListener("mouseup", up);
			popup.removeEventListener("touchstart", down);
			document.body.removeEventListener("touchmove", move);
			popup.removeEventListener("touchend", up);
		};
		/**
		* @param {MouseEvent | TouchEvent} event
		*/
		const down = (event) => {
			const popup = getPopup();
			if (!popup) return;
			const icon = getIcon();
			if (event.target === popup || icon && icon.contains(
				/** @type {HTMLElement} */
				event.target
			)) {
				dragging = true;
				const clientXY = getClientXY(event);
				mousedownX = clientXY.clientX;
				mousedownY = clientXY.clientY;
				initialX = parseInt(popup.style.insetInlineStart) || 0;
				initialY = parseInt(popup.style.insetBlockStart) || 0;
				addClass(popup, "swal2-dragging");
			}
		};
		/**
		* @param {MouseEvent | TouchEvent} event
		*/
		const move = (event) => {
			const popup = getPopup();
			if (!popup) return;
			if (dragging) {
				let { clientX, clientY } = getClientXY(event);
				const deltaX = clientX - mousedownX;
				popup.style.insetInlineStart = `${initialX + (globalState.isRTL ? -deltaX : deltaX)}px`;
				popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
			}
		};
		const up = () => {
			const popup = getPopup();
			dragging = false;
			removeClass(popup, "swal2-dragging");
		};
		/**
		* @param {MouseEvent | TouchEvent} event
		* @returns {{ clientX: number, clientY: number }}
		*/
		const getClientXY = (event) => {
			const source = event.type.startsWith("touch") ? event.touches[0] : 			/** @type {MouseEvent} */ event;
			return {
				clientX: source.clientX,
				clientY: source.clientY
			};
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderPopup = (instance, params) => {
			const container = getContainer();
			const popup = getPopup();
			if (!container || !popup) return;
			if (params.toast) {
				applyNumericalStyle(container, "width", params.width);
				popup.style.width = "100%";
				const loader = getLoader();
				if (loader) popup.insertBefore(loader, getIcon());
			} else applyNumericalStyle(popup, "width", params.width);
			applyNumericalStyle(popup, "padding", params.padding);
			if (params.color) popup.style.color = params.color;
			if (params.background) popup.style.background = params.background;
			hide(getValidationMessage());
			addClasses$1(popup, params);
			if (params.draggable && !params.toast) {
				addClass(popup, swalClasses.draggable);
				addDraggableListeners(popup);
			} else {
				removeClass(popup, swalClasses.draggable);
				removeDraggableListeners(popup);
			}
		};
		/**
		* @param {HTMLElement} popup
		* @param {SweetAlertOptions} params
		*/
		const addClasses$1 = (popup, params) => {
			const showClass = params.showClass || {};
			popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ""}`;
			if (params.toast) {
				addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
				addClass(popup, swalClasses.toast);
			} else addClass(popup, swalClasses.modal);
			applyCustomClass(popup, params, "popup");
			if (typeof params.customClass === "string") addClass(popup, params.customClass);
			if (params.icon) addClass(popup, swalClasses[`icon-${params.icon}`]);
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderProgressSteps = (instance, params) => {
			const progressStepsContainer = getProgressSteps();
			if (!progressStepsContainer) return;
			const { progressSteps, currentProgressStep } = params;
			if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
				hide(progressStepsContainer);
				return;
			}
			show(progressStepsContainer);
			progressStepsContainer.textContent = "";
			if (currentProgressStep >= progressSteps.length) warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
			progressSteps.forEach((step, index) => {
				const stepEl = createStepElement(step);
				progressStepsContainer.appendChild(stepEl);
				if (index === currentProgressStep) addClass(stepEl, swalClasses["active-progress-step"]);
				if (index !== progressSteps.length - 1) {
					const lineEl = createLineElement(params);
					progressStepsContainer.appendChild(lineEl);
				}
			});
		};
		/**
		* @param {string} step
		* @returns {HTMLLIElement}
		*/
		const createStepElement = (step) => {
			const stepEl = document.createElement("li");
			addClass(stepEl, swalClasses["progress-step"]);
			setInnerHtml(stepEl, step);
			return stepEl;
		};
		/**
		* @param {SweetAlertOptions} params
		* @returns {HTMLLIElement}
		*/
		const createLineElement = (params) => {
			const lineEl = document.createElement("li");
			addClass(lineEl, swalClasses["progress-step-line"]);
			if (params.progressStepsDistance) applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
			return lineEl;
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const renderTitle = (instance, params) => {
			const title = getTitle();
			if (!title) return;
			showWhenInnerHtmlPresent(title);
			toggle(title, Boolean(params.title || params.titleText), "block");
			if (params.title) parseHtmlToContainer(params.title, title);
			if (params.titleText) title.innerText = params.titleText;
			applyCustomClass(title, params, "title");
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const render = (instance, params) => {
			var _globalState$eventEmi;
			renderPopup(instance, params);
			renderContainer(instance, params);
			renderProgressSteps(instance, params);
			renderIcon(instance, params);
			renderImage(instance, params);
			renderTitle(instance, params);
			renderCloseButton(instance, params);
			renderContent(instance, params);
			renderActions(instance, params);
			renderFooter(instance, params);
			const popup = getPopup();
			if (typeof params.didRender === "function" && popup) params.didRender(popup);
			(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didRender", popup);
		};
		const isVisible = () => {
			return isVisible$1(getPopup());
		};
		const clickConfirm = () => {
			var _dom$getConfirmButton;
			return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
		};
		const clickDeny = () => {
			var _dom$getDenyButton;
			return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
		};
		const clickCancel = () => {
			var _dom$getCancelButton;
			return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
		};
		/** @type {Record<DismissReason, DismissReason>} */
		const DismissReason = Object.freeze({
			cancel: "cancel",
			backdrop: "backdrop",
			close: "close",
			esc: "esc",
			timer: "timer"
		});
		/**
		* @param {GlobalState} globalState
		*/
		const removeKeydownHandler = (globalState) => {
			if (globalState.keydownTarget && globalState.keydownHandlerAdded && globalState.keydownHandler) {
				const handler = globalState.keydownHandler;
				globalState.keydownTarget.removeEventListener("keydown", handler, { capture: globalState.keydownListenerCapture });
				globalState.keydownHandlerAdded = false;
			}
		};
		/**
		* @param {GlobalState} globalState
		* @param {SweetAlertOptions} innerParams
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const addKeydownHandler = (globalState, innerParams, dismissWith) => {
			removeKeydownHandler(globalState);
			if (!innerParams.toast) {
				/** @type {(this: HTMLElement, event: KeyboardEvent) => void} */
				const handler = (e) => keydownHandler(innerParams, e, dismissWith);
				globalState.keydownHandler = handler;
				const target = innerParams.keydownListenerCapture ? window : getPopup();
				if (target) {
					globalState.keydownTarget = target;
					globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
					const eventHandler = handler;
					globalState.keydownTarget.addEventListener("keydown", eventHandler, { capture: globalState.keydownListenerCapture });
					globalState.keydownHandlerAdded = true;
				}
			}
		};
		/**
		* @param {number} index
		* @param {number} increment
		* @returns {boolean} shouldPreventDefault
		*/
		const setFocus = (index, increment) => {
			var _dom$getPopup;
			const focusableElements = getFocusableElements();
			if (focusableElements.length) {
				index = index + increment;
				if (index === -2) index = focusableElements.length - 1;
				if (index === focusableElements.length) index = 0;
				else if (index === -1) index = focusableElements.length - 1;
				focusableElements[index].focus();
				if (isFirefox() && focusableElements[index] instanceof HTMLIFrameElement) return false;
				return true;
			}
			(_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
			return true;
		};
		const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
		const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
		/**
		* @param {SweetAlertOptions} innerParams
		* @param {KeyboardEvent} event
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const keydownHandler = (innerParams, event, dismissWith) => {
			if (!innerParams) return;
			if (event.isComposing || event.keyCode === 229) return;
			if (innerParams.stopKeydownPropagation) event.stopPropagation();
			if (event.key === "Enter") handleEnter(event, innerParams);
			else if (event.key === "Tab") handleTab(event);
			else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) handleArrows(event.key);
			else if (event.key === "Escape") handleEsc(event, innerParams, dismissWith);
		};
		/**
		* @param {KeyboardEvent} event
		* @param {SweetAlertOptions} innerParams
		*/
		const handleEnter = (event, innerParams) => {
			if (!callIfFunction(innerParams.allowEnterKey)) return;
			const popup = getPopup();
			if (!popup || !innerParams.input) return;
			const input = getInput$1(popup, innerParams.input);
			if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
				if (["textarea", "file"].includes(innerParams.input)) return;
				clickConfirm();
				event.preventDefault();
			}
		};
		/**
		* @param {KeyboardEvent} event
		*/
		const handleTab = (event) => {
			const targetElement = event.target;
			const btnIndex = getFocusableElements().findIndex((el) => el === targetElement);
			let shouldPreventDefault = true;
			if (!event.shiftKey) shouldPreventDefault = setFocus(btnIndex, 1);
			else shouldPreventDefault = setFocus(btnIndex, -1);
			event.stopPropagation();
			if (shouldPreventDefault) event.preventDefault();
		};
		/**
		* @param {string} key
		*/
		const handleArrows = (key) => {
			const actions = getActions();
			const confirmButton = getConfirmButton();
			const denyButton = getDenyButton();
			const cancelButton = getCancelButton();
			if (!actions || !confirmButton || !denyButton || !cancelButton) return;
			/** @type HTMLElement[] */
			const buttons = [
				confirmButton,
				denyButton,
				cancelButton
			];
			if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) return;
			const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
			let buttonToFocus = document.activeElement;
			if (!buttonToFocus) return;
			for (let i = 0; i < actions.children.length; i++) {
				buttonToFocus = buttonToFocus[sibling];
				if (!buttonToFocus) return;
				if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) break;
			}
			if (buttonToFocus instanceof HTMLButtonElement) buttonToFocus.focus();
		};
		/**
		* @param {KeyboardEvent} event
		* @param {SweetAlertOptions} innerParams
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const handleEsc = (event, innerParams, dismissWith) => {
			event.preventDefault();
			if (callIfFunction(innerParams.allowEscapeKey)) dismissWith(DismissReason.esc);
		};
		/**
		* This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
		* For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
		* This is the approach that Babel will probably take to implement private methods/fields
		*   https://github.com/tc39/proposal-private-methods
		*   https://github.com/babel/babel/pull/7555
		* Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
		*   then we can use that language feature.
		*/
		var privateMethods = {
			swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
			swalPromiseReject: /* @__PURE__ */ new WeakMap()
		};
		const setAriaHidden = () => {
			const container = getContainer();
			Array.from(document.body.children).forEach((el) => {
				if (el.contains(container)) return;
				if (el.hasAttribute("aria-hidden")) el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
				el.setAttribute("aria-hidden", "true");
			});
		};
		const unsetAriaHidden = () => {
			Array.from(document.body.children).forEach((el) => {
				if (el.hasAttribute("data-previous-aria-hidden")) {
					el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
					el.removeAttribute("data-previous-aria-hidden");
				} else el.removeAttribute("aria-hidden");
			});
		};
		const isSafariOrIOS = typeof window !== "undefined" && Boolean(window.GestureEvent);
		const isIOS = isSafariOrIOS && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		/**
		* Fix iOS scrolling
		* http://stackoverflow.com/q/39626302
		*/
		const iOSfix = () => {
			if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
				const offset = document.body.scrollTop;
				document.body.style.top = `${offset * -1}px`;
				addClass(document.body, swalClasses.iosfix);
				lockBodyScroll();
			}
		};
		/**
		* https://github.com/sweetalert2/sweetalert2/issues/1246
		*/
		const lockBodyScroll = () => {
			const container = getContainer();
			if (!container) return;
			/** @type {boolean} */
			let preventTouchMove;
			/**
			* @param {TouchEvent} event
			*/
			container.ontouchstart = (event) => {
				preventTouchMove = shouldPreventTouchMove(event);
			};
			/**
			* @param {TouchEvent} event
			*/
			container.ontouchmove = (event) => {
				if (preventTouchMove) {
					event.preventDefault();
					event.stopPropagation();
				}
			};
		};
		/**
		* @param {TouchEvent} event
		* @returns {boolean}
		*/
		const shouldPreventTouchMove = (event) => {
			const target = event.target;
			const container = getContainer();
			const htmlContainer = getHtmlContainer();
			if (!container || !htmlContainer) return false;
			if (isStylus(event) || isZoom(event)) return false;
			if (target === container) return true;
			if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !(isScrollable(htmlContainer) && htmlContainer.contains(target))) return true;
			return false;
		};
		/**
		* https://github.com/sweetalert2/sweetalert2/issues/1786
		*
		* @param {TouchEvent} event
		* @returns {boolean}
		*/
		const isStylus = (event) => {
			return Boolean(event.touches && event.touches.length && event.touches[0].touchType === "stylus");
		};
		/**
		* https://github.com/sweetalert2/sweetalert2/issues/1891
		*
		* @param {TouchEvent} event
		* @returns {boolean}
		*/
		const isZoom = (event) => {
			return event.touches && event.touches.length > 1;
		};
		const undoIOSfix = () => {
			if (hasClass(document.body, swalClasses.iosfix)) {
				const offset = parseInt(document.body.style.top, 10);
				removeClass(document.body, swalClasses.iosfix);
				document.body.style.top = "";
				document.body.scrollTop = offset * -1;
			}
		};
		/**
		* Measure scrollbar width for padding body during modal show/hide
		* https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
		*
		* @returns {number}
		*/
		const measureScrollbar = () => {
			const scrollDiv = document.createElement("div");
			scrollDiv.className = swalClasses["scrollbar-measure"];
			document.body.appendChild(scrollDiv);
			const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
			return scrollbarWidth;
		};
		/**
		* Remember state in cases where opening and handling a modal will fiddle with it.
		* @type {number | null}
		*/
		let previousBodyPadding = null;
		/**
		* @param {string} initialBodyOverflow
		*/
		const replaceScrollbarWithPadding = (initialBodyOverflow) => {
			if (previousBodyPadding !== null) return;
			if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
				previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
				document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
			}
		};
		const undoReplaceScrollbarWithPadding = () => {
			if (previousBodyPadding !== null) {
				document.body.style.paddingRight = `${previousBodyPadding}px`;
				previousBodyPadding = null;
			}
		};
		/**
		* @param {SweetAlert} instance
		* @param {HTMLElement} container
		* @param {boolean} returnFocus
		* @param {(() => void) | undefined} didClose
		*/
		function removePopupAndResetState(instance, container, returnFocus, didClose) {
			if (isToast()) triggerDidCloseAndDispose(instance, didClose);
			else {
				restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
				removeKeydownHandler(globalState);
			}
			if (isSafariOrIOS) {
				container.setAttribute("style", "display:none !important");
				container.removeAttribute("class");
				container.innerHTML = "";
			} else container.remove();
			if (isModal()) {
				undoReplaceScrollbarWithPadding();
				undoIOSfix();
				unsetAriaHidden();
			}
			removeBodyClasses();
		}
		/**
		* Remove SweetAlert2 classes from body
		*/
		function removeBodyClasses() {
			removeClass([document.documentElement, document.body], [
				swalClasses.shown,
				swalClasses["height-auto"],
				swalClasses["no-backdrop"],
				swalClasses["toast-shown"]
			]);
		}
		/**
		* Instance method to close sweetAlert
		*
		* @param {SweetAlertResult | undefined} resolveValue
		* @this {SweetAlert}
		*/
		function close(resolveValue) {
			resolveValue = prepareResolveValue(resolveValue);
			const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
			const didClose = triggerClosePopup(this);
			if (this.isAwaitingPromise) {
				if (!resolveValue.isDismissed) {
					handleAwaitingPromise(this);
					swalPromiseResolve(resolveValue);
				}
			} else if (didClose) swalPromiseResolve(resolveValue);
		}
		/**
		* @param {SweetAlert} instance
		* @returns {boolean}
		*/
		const triggerClosePopup = (instance) => {
			const popup = getPopup();
			if (!popup) return false;
			const innerParams = privateProps.innerParams.get(instance);
			if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) return false;
			removeClass(popup, innerParams.showClass.popup);
			addClass(popup, innerParams.hideClass.popup);
			const backdrop = getContainer();
			removeClass(backdrop, innerParams.showClass.backdrop);
			addClass(backdrop, innerParams.hideClass.backdrop);
			handlePopupAnimation(instance, popup, innerParams);
			return true;
		};
		/**
		* @param {Error | string} error
		* @this {SweetAlert}
		*/
		function rejectPromise(error) {
			const rejectPromise = privateMethods.swalPromiseReject.get(this);
			handleAwaitingPromise(this);
			if (rejectPromise) rejectPromise(error);
		}
		/**
		* @param {SweetAlert} instance
		*/
		const handleAwaitingPromise = (instance) => {
			if (instance.isAwaitingPromise) {
				delete instance.isAwaitingPromise;
				if (!privateProps.innerParams.get(instance)) instance._destroy();
			}
		};
		/**
		* @param {SweetAlertResult | undefined} resolveValue
		* @returns {SweetAlertResult}
		*/
		const prepareResolveValue = (resolveValue) => {
			if (typeof resolveValue === "undefined") return {
				isConfirmed: false,
				isDenied: false,
				isDismissed: true
			};
			return Object.assign({
				isConfirmed: false,
				isDenied: false,
				isDismissed: false
			}, resolveValue);
		};
		/**
		* @param {SweetAlert} instance
		* @param {HTMLElement} popup
		* @param {SweetAlertOptions} innerParams
		*/
		const handlePopupAnimation = (instance, popup, innerParams) => {
			var _globalState$eventEmi;
			const container = getContainer();
			const animationIsSupported = hasCssAnimation(popup);
			if (typeof innerParams.willClose === "function") innerParams.willClose(popup);
			(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willClose", popup);
			if (animationIsSupported && container) animatePopup(instance, popup, container, Boolean(innerParams.returnFocus), innerParams.didClose);
			else if (container) removePopupAndResetState(instance, container, Boolean(innerParams.returnFocus), innerParams.didClose);
		};
		/**
		* @param {SweetAlert} instance
		* @param {HTMLElement} popup
		* @param {HTMLElement} container
		* @param {boolean} returnFocus
		* @param {(() => void) | undefined} didClose
		*/
		const animatePopup = (instance, popup, container, returnFocus, didClose) => {
			globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
			/**
			* @param {AnimationEvent | TransitionEvent} e
			*/
			const swalCloseAnimationFinished = function(e) {
				if (e.target === popup) {
					var _globalState$swalClos;
					(_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
					delete globalState.swalCloseEventFinishedCallback;
					popup.removeEventListener("animationend", swalCloseAnimationFinished);
					popup.removeEventListener("transitionend", swalCloseAnimationFinished);
				}
			};
			popup.addEventListener("animationend", swalCloseAnimationFinished);
			popup.addEventListener("transitionend", swalCloseAnimationFinished);
		};
		/**
		* @param {SweetAlert} instance
		* @param {(() => void) | undefined} didClose
		*/
		const triggerDidCloseAndDispose = (instance, didClose) => {
			setTimeout(() => {
				var _globalState$eventEmi2;
				if (typeof didClose === "function") didClose.bind(instance.params)();
				(_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didClose");
				if (instance._destroy) instance._destroy();
			});
		};
		/**
		* Shows loader (spinner), this is useful with AJAX requests.
		* By default the loader be shown instead of the "Confirm" button.
		*
		* @param {HTMLButtonElement | null} [buttonToReplace]
		*/
		const showLoading = (buttonToReplace) => {
			let popup = getPopup();
			if (!popup) new Swal();
			popup = getPopup();
			if (!popup) return;
			const loader = getLoader();
			if (isToast()) hide(getIcon());
			else replaceButton(popup, buttonToReplace);
			show(loader);
			popup.setAttribute("data-loading", "true");
			popup.setAttribute("aria-busy", "true");
			popup.focus();
		};
		/**
		* @param {HTMLElement} popup
		* @param {HTMLButtonElement | null} [buttonToReplace]
		*/
		const replaceButton = (popup, buttonToReplace) => {
			const actions = getActions();
			const loader = getLoader();
			if (!actions || !loader) return;
			if (!buttonToReplace && isVisible$1(getConfirmButton())) buttonToReplace = getConfirmButton();
			show(actions);
			if (buttonToReplace) {
				hide(buttonToReplace);
				loader.setAttribute("data-button-to-replace", buttonToReplace.className);
				actions.insertBefore(loader, buttonToReplace);
			}
			addClass([popup, actions], swalClasses.loading);
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const handleInputOptionsAndValue = (instance, params) => {
			if (params.input === "select" || params.input === "radio") handleInputOptions(instance, params);
			else if ([
				"text",
				"email",
				"number",
				"tel",
				"textarea"
			].some((i) => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
				showLoading(getConfirmButton());
				handleInputValue(instance, params);
			}
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} innerParams
		* @returns {SweetAlertInputValue}
		*/
		const getInputValue = (instance, innerParams) => {
			const input = instance.getInput();
			if (!input) return null;
			switch (innerParams.input) {
				case "checkbox": return getCheckboxValue(input);
				case "radio": return getRadioValue(input);
				case "file": return getFileValue(input);
				default: return innerParams.inputAutoTrim ? input.value.trim() : input.value;
			}
		};
		/**
		* @param {HTMLInputElement} input
		* @returns {number}
		*/
		const getCheckboxValue = (input) => input.checked ? 1 : 0;
		/**
		* @param {HTMLInputElement} input
		* @returns {string | null}
		*/
		const getRadioValue = (input) => input.checked ? input.value : null;
		/**
		* @param {HTMLInputElement} input
		* @returns {FileList | File | null}
		*/
		const getFileValue = (input) => input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const handleInputOptions = (instance, params) => {
			const popup = getPopup();
			if (!popup) return;
			/**
			* @param {*} inputOptions
			*/
			const processInputOptions = (inputOptions) => {
				if (params.input === "select") populateSelectOptions(popup, formatInputOptions(inputOptions), params);
				else if (params.input === "radio") populateRadioOptions(popup, formatInputOptions(inputOptions), params);
			};
			if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
				showLoading(getConfirmButton());
				asPromise(params.inputOptions).then((inputOptions) => {
					instance.hideLoading();
					processInputOptions(inputOptions);
				});
			} else if (typeof params.inputOptions === "object") processInputOptions(params.inputOptions);
			else error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertOptions} params
		*/
		const handleInputValue = (instance, params) => {
			const input = instance.getInput();
			if (!input) return;
			hide(input);
			asPromise(params.inputValue).then((inputValue) => {
				input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
				show(input);
				input.focus();
				instance.hideLoading();
			}).catch((err) => {
				error(`Error in inputValue promise: ${err}`);
				input.value = "";
				show(input);
				input.focus();
				instance.hideLoading();
			});
		};
		/**
		* @param {HTMLElement} popup
		* @param {InputOptionFlattened[]} inputOptions
		* @param {SweetAlertOptions} params
		*/
		function populateSelectOptions(popup, inputOptions, params) {
			const select = getDirectChildByClass(popup, swalClasses.select);
			if (!select) return;
			/**
			* @param {HTMLElement} parent
			* @param {string} optionLabel
			* @param {string} optionValue
			*/
			const renderOption = (parent, optionLabel, optionValue) => {
				const option = document.createElement("option");
				option.value = optionValue;
				setInnerHtml(option, optionLabel);
				option.selected = isSelected(optionValue, params.inputValue);
				parent.appendChild(option);
			};
			inputOptions.forEach((inputOption) => {
				const optionValue = inputOption[0];
				const optionLabel = inputOption[1];
				if (Array.isArray(optionLabel)) {
					const optgroup = document.createElement("optgroup");
					optgroup.label = optionValue;
					optgroup.disabled = false;
					select.appendChild(optgroup);
					optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
				} else renderOption(select, optionLabel, optionValue);
			});
			select.focus();
		}
		/**
		* @param {HTMLElement} popup
		* @param {InputOptionFlattened[]} inputOptions
		* @param {SweetAlertOptions} params
		*/
		function populateRadioOptions(popup, inputOptions, params) {
			const radio = getDirectChildByClass(popup, swalClasses.radio);
			if (!radio) return;
			inputOptions.forEach((inputOption) => {
				const radioValue = inputOption[0];
				const radioLabel = inputOption[1];
				const radioInput = document.createElement("input");
				const radioLabelElement = document.createElement("label");
				radioInput.type = "radio";
				radioInput.name = swalClasses.radio;
				radioInput.value = radioValue;
				if (isSelected(radioValue, params.inputValue)) radioInput.checked = true;
				const label = document.createElement("span");
				setInnerHtml(label, radioLabel);
				label.className = swalClasses.label;
				radioLabelElement.appendChild(radioInput);
				radioLabelElement.appendChild(label);
				radio.appendChild(radioLabelElement);
			});
			const radios = radio.querySelectorAll("input");
			if (radios.length) radios[0].focus();
		}
		/**
		* Converts `inputOptions` into an array of `[value, label]`s
		*
		* @param {*} inputOptions
		* @typedef {string[]} InputOptionFlattened
		* @returns {InputOptionFlattened[]}
		*/
		const formatInputOptions = (inputOptions) => {
			return (inputOptions instanceof Map ? Array.from(inputOptions) : Object.entries(inputOptions)).map(([key, value]) => [key, typeof value === "object" ? formatInputOptions(value) : value]);
		};
		/**
		* @param {string} optionValue
		* @param {SweetAlertInputValue} inputValue
		* @returns {boolean}
		*/
		const isSelected = (optionValue, inputValue) => Boolean(inputValue) && inputValue != null && inputValue.toString() === optionValue.toString();
		/**
		* @param {SweetAlert} instance
		*/
		const handleConfirmButtonClick = (instance) => {
			const innerParams = privateProps.innerParams.get(instance);
			instance.disableButtons();
			if (innerParams.input) handleConfirmOrDenyWithInput(instance, "confirm");
			else confirm(instance, true);
		};
		/**
		* @param {SweetAlert} instance
		*/
		const handleDenyButtonClick = (instance) => {
			const innerParams = privateProps.innerParams.get(instance);
			instance.disableButtons();
			if (innerParams.returnInputValueOnDeny) handleConfirmOrDenyWithInput(instance, "deny");
			else deny(instance, false);
		};
		/**
		* @param {SweetAlert} instance
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const handleCancelButtonClick = (instance, dismissWith) => {
			instance.disableButtons();
			dismissWith(DismissReason.cancel);
		};
		/**
		* @param {SweetAlert} instance
		* @param {'confirm' | 'deny'} type
		*/
		const handleConfirmOrDenyWithInput = (instance, type) => {
			const innerParams = privateProps.innerParams.get(instance);
			if (!innerParams.input) {
				error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
				return;
			}
			const input = instance.getInput();
			const inputValue = getInputValue(instance, innerParams);
			if (innerParams.inputValidator) handleInputValidator(instance, inputValue, type);
			else if (input && !input.checkValidity()) {
				instance.enableButtons();
				instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
			} else if (type === "deny") deny(instance, inputValue);
			else confirm(instance, inputValue);
		};
		/**
		* @param {SweetAlert} instance
		* @param {SweetAlertInputValue} inputValue
		* @param {'confirm' | 'deny'} type
		*/
		const handleInputValidator = (instance, inputValue, type) => {
			const innerParams = privateProps.innerParams.get(instance);
			instance.disableInput();
			Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage))).then((validationMessage) => {
				instance.enableButtons();
				instance.enableInput();
				if (validationMessage) instance.showValidationMessage(validationMessage);
				else if (type === "deny") deny(instance, inputValue);
				else confirm(instance, inputValue);
			});
		};
		/**
		* @param {SweetAlert} instance
		* @param {*} value
		*/
		const deny = (instance, value) => {
			const innerParams = privateProps.innerParams.get(instance);
			if (innerParams.showLoaderOnDeny) showLoading(getDenyButton());
			if (innerParams.preDeny) {
				instance.isAwaitingPromise = true;
				Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage))).then((preDenyValue) => {
					if (preDenyValue === false) {
						instance.hideLoading();
						handleAwaitingPromise(instance);
					} else instance.close(
						/** @type SweetAlertResult */
						{
							isDenied: true,
							value: typeof preDenyValue === "undefined" ? value : preDenyValue
						}
					);
				}).catch((error) => rejectWith(instance, error));
			} else instance.close(
				/** @type SweetAlertResult */
				{
					isDenied: true,
					value
				}
			);
		};
		/**
		* @param {SweetAlert} instance
		* @param {*} value
		*/
		const succeedWith = (instance, value) => {
			instance.close(
				/** @type SweetAlertResult */
				{
					isConfirmed: true,
					value
				}
			);
		};
		/**
		*
		* @param {SweetAlert} instance
		* @param {string} error
		*/
		const rejectWith = (instance, error) => {
			instance.rejectPromise(error);
		};
		/**
		*
		* @param {SweetAlert} instance
		* @param {*} value
		*/
		const confirm = (instance, value) => {
			const innerParams = privateProps.innerParams.get(instance);
			if (innerParams.showLoaderOnConfirm) showLoading();
			if (innerParams.preConfirm) {
				instance.resetValidationMessage();
				instance.isAwaitingPromise = true;
				Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage))).then((preConfirmValue) => {
					if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
						instance.hideLoading();
						handleAwaitingPromise(instance);
					} else succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
				}).catch((error) => rejectWith(instance, error));
			} else succeedWith(instance, value);
		};
		/**
		* Hides loader and shows back the button which was hidden by .showLoading()
		* @this {SweetAlert}
		*/
		function hideLoading() {
			const innerParams = privateProps.innerParams.get(this);
			if (!innerParams) return;
			const domCache = privateProps.domCache.get(this);
			hide(domCache.loader);
			if (isToast()) {
				if (innerParams.icon) show(getIcon());
			} else showRelatedButton(domCache);
			removeClass([domCache.popup, domCache.actions], swalClasses.loading);
			domCache.popup.removeAttribute("aria-busy");
			domCache.popup.removeAttribute("data-loading");
			this.enableButtons();
		}
		/**
		* @param {DomCache} domCache
		*/
		const showRelatedButton = (domCache) => {
			const dataButtonToReplace = domCache.loader.getAttribute("data-button-to-replace");
			const buttonToReplace = dataButtonToReplace ? domCache.popup.getElementsByClassName(dataButtonToReplace) : [];
			if (buttonToReplace.length) show(
				/** @type {HTMLElement} */
				buttonToReplace[0],
				"inline-block"
			);
			else if (allButtonsAreHidden()) hide(domCache.actions);
		};
		/**
		* Gets the input DOM node, this method works with input parameter.
		*
		* @returns {HTMLInputElement | null}
		* @this {SweetAlert}
		*/
		function getInput() {
			const innerParams = privateProps.innerParams.get(this);
			const domCache = privateProps.domCache.get(this);
			if (!domCache) return null;
			return getInput$1(domCache.popup, innerParams.input);
		}
		/**
		* @param {SweetAlert} instance
		* @param {string[]} buttons
		* @param {boolean} disabled
		*/
		function setButtonsDisabled(instance, buttons, disabled) {
			const domCache = privateProps.domCache.get(instance);
			buttons.forEach((button) => {
				domCache[button].disabled = disabled;
			});
		}
		/**
		* @param {HTMLInputElement | null} input
		* @param {boolean} disabled
		*/
		function setInputDisabled(input, disabled) {
			const popup = getPopup();
			if (!popup || !input) return;
			if (input.type === "radio") popup.querySelectorAll(`[name="${swalClasses.radio}"]`).forEach((radio) => {
				radio.disabled = disabled;
			});
			else input.disabled = disabled;
		}
		/**
		* Enable all the buttons
		* @this {SweetAlert}
		*/
		function enableButtons() {
			setButtonsDisabled(this, [
				"confirmButton",
				"denyButton",
				"cancelButton"
			], false);
			const focusedElement = privateProps.focusedElement.get(this);
			if (focusedElement instanceof HTMLElement && document.activeElement === document.body) focusedElement.focus();
			privateProps.focusedElement.delete(this);
		}
		/**
		* Disable all the buttons
		* @this {SweetAlert}
		*/
		function disableButtons() {
			privateProps.focusedElement.set(this, document.activeElement);
			setButtonsDisabled(this, [
				"confirmButton",
				"denyButton",
				"cancelButton"
			], true);
		}
		/**
		* Enable the input field
		* @this {SweetAlert}
		*/
		function enableInput() {
			setInputDisabled(this.getInput(), false);
		}
		/**
		* Disable the input field
		* @this {SweetAlert}
		*/
		function disableInput() {
			setInputDisabled(this.getInput(), true);
		}
		/**
		* Show block with validation message
		*
		* @param {string} error
		* @this {SweetAlert}
		*/
		function showValidationMessage(error) {
			const domCache = privateProps.domCache.get(this);
			const params = privateProps.innerParams.get(this);
			setInnerHtml(domCache.validationMessage, error);
			domCache.validationMessage.className = swalClasses["validation-message"];
			if (params.customClass && params.customClass.validationMessage) addClass(domCache.validationMessage, params.customClass.validationMessage);
			show(domCache.validationMessage);
			const input = this.getInput();
			if (input) {
				input.setAttribute("aria-invalid", "true");
				input.setAttribute("aria-describedby", swalClasses["validation-message"]);
				focusInput(input);
				addClass(input, swalClasses.inputerror);
			}
		}
		/**
		* Hide block with validation message
		*
		* @this {SweetAlert}
		*/
		function resetValidationMessage() {
			const domCache = privateProps.domCache.get(this);
			if (domCache.validationMessage) hide(domCache.validationMessage);
			const input = this.getInput();
			if (input) {
				input.removeAttribute("aria-invalid");
				input.removeAttribute("aria-describedby");
				removeClass(input, swalClasses.inputerror);
			}
		}
		const defaultParams = {
			title: "",
			titleText: "",
			text: "",
			html: "",
			footer: "",
			icon: void 0,
			iconColor: void 0,
			iconHtml: void 0,
			template: void 0,
			toast: false,
			draggable: false,
			animation: true,
			theme: "light",
			showClass: {
				popup: "swal2-show",
				backdrop: "swal2-backdrop-show",
				icon: "swal2-icon-show"
			},
			hideClass: {
				popup: "swal2-hide",
				backdrop: "swal2-backdrop-hide",
				icon: "swal2-icon-hide"
			},
			customClass: {},
			target: "body",
			color: void 0,
			backdrop: true,
			heightAuto: true,
			allowOutsideClick: true,
			allowEscapeKey: true,
			allowEnterKey: true,
			stopKeydownPropagation: true,
			keydownListenerCapture: false,
			showConfirmButton: true,
			showDenyButton: false,
			showCancelButton: false,
			preConfirm: void 0,
			preDeny: void 0,
			confirmButtonText: "OK",
			confirmButtonAriaLabel: "",
			confirmButtonColor: void 0,
			denyButtonText: "No",
			denyButtonAriaLabel: "",
			denyButtonColor: void 0,
			cancelButtonText: "Cancel",
			cancelButtonAriaLabel: "",
			cancelButtonColor: void 0,
			buttonsStyling: true,
			reverseButtons: false,
			focusConfirm: true,
			focusDeny: false,
			focusCancel: false,
			returnFocus: true,
			showCloseButton: false,
			closeButtonHtml: "&times;",
			closeButtonAriaLabel: "Close this dialog",
			loaderHtml: "",
			showLoaderOnConfirm: false,
			showLoaderOnDeny: false,
			imageUrl: void 0,
			imageWidth: void 0,
			imageHeight: void 0,
			imageAlt: "",
			timer: void 0,
			timerProgressBar: false,
			width: void 0,
			padding: void 0,
			background: void 0,
			input: void 0,
			inputPlaceholder: "",
			inputLabel: "",
			inputValue: "",
			inputOptions: {},
			inputAutoFocus: true,
			inputAutoTrim: true,
			inputAttributes: {},
			inputValidator: void 0,
			returnInputValueOnDeny: false,
			validationMessage: void 0,
			grow: false,
			position: "center",
			progressSteps: [],
			currentProgressStep: void 0,
			progressStepsDistance: void 0,
			willOpen: void 0,
			didOpen: void 0,
			didRender: void 0,
			willClose: void 0,
			didClose: void 0,
			didDestroy: void 0,
			scrollbarPadding: true,
			topLayer: false
		};
		const updatableParams = [
			"allowEscapeKey",
			"allowOutsideClick",
			"background",
			"buttonsStyling",
			"cancelButtonAriaLabel",
			"cancelButtonColor",
			"cancelButtonText",
			"closeButtonAriaLabel",
			"closeButtonHtml",
			"color",
			"confirmButtonAriaLabel",
			"confirmButtonColor",
			"confirmButtonText",
			"currentProgressStep",
			"customClass",
			"denyButtonAriaLabel",
			"denyButtonColor",
			"denyButtonText",
			"didClose",
			"didDestroy",
			"draggable",
			"footer",
			"hideClass",
			"html",
			"icon",
			"iconColor",
			"iconHtml",
			"imageAlt",
			"imageHeight",
			"imageUrl",
			"imageWidth",
			"preConfirm",
			"preDeny",
			"progressSteps",
			"returnFocus",
			"reverseButtons",
			"showCancelButton",
			"showCloseButton",
			"showConfirmButton",
			"showDenyButton",
			"text",
			"title",
			"titleText",
			"theme",
			"willClose"
		];
		/** @type {Record<string, string | undefined>} */
		const deprecatedParams = { allowEnterKey: void 0 };
		const toastIncompatibleParams = [
			"allowOutsideClick",
			"allowEnterKey",
			"backdrop",
			"draggable",
			"focusConfirm",
			"focusDeny",
			"focusCancel",
			"returnFocus",
			"heightAuto",
			"keydownListenerCapture"
		];
		/**
		* Is valid parameter
		*
		* @param {string} paramName
		* @returns {boolean}
		*/
		const isValidParameter = (paramName) => {
			return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
		};
		/**
		* Is valid parameter for Swal.update() method
		*
		* @param {string} paramName
		* @returns {boolean}
		*/
		const isUpdatableParameter = (paramName) => {
			return updatableParams.indexOf(paramName) !== -1;
		};
		/**
		* Is deprecated parameter
		*
		* @param {string} paramName
		* @returns {string | undefined}
		*/
		const isDeprecatedParameter = (paramName) => {
			return deprecatedParams[paramName];
		};
		/**
		* @param {string} param
		*/
		const checkIfParamIsValid = (param) => {
			if (!isValidParameter(param)) warn(`Unknown parameter "${param}"`);
		};
		/**
		* @param {string} param
		*/
		const checkIfToastParamIsValid = (param) => {
			if (toastIncompatibleParams.includes(param)) warn(`The parameter "${param}" is incompatible with toasts`);
		};
		/**
		* @param {string} param
		*/
		const checkIfParamIsDeprecated = (param) => {
			const isDeprecated = isDeprecatedParameter(param);
			if (isDeprecated) warnAboutDeprecation(param, isDeprecated);
		};
		/**
		* Show relevant warnings for given params
		*
		* @param {SweetAlertOptions} params
		*/
		const showWarningsForParams = (params) => {
			if (params.backdrop === false && params.allowOutsideClick) warn("\"allowOutsideClick\" parameter requires `backdrop` parameter to be set to `true`");
			if (params.theme && ![
				"light",
				"dark",
				"auto",
				"minimal",
				"borderless",
				"bootstrap-4",
				"bootstrap-4-light",
				"bootstrap-4-dark",
				"bootstrap-5",
				"bootstrap-5-light",
				"bootstrap-5-dark",
				"material-ui",
				"material-ui-light",
				"material-ui-dark",
				"embed-iframe",
				"bulma",
				"bulma-light",
				"bulma-dark"
			].includes(params.theme)) warn(`Invalid theme "${params.theme}"`);
			for (const param in params) {
				checkIfParamIsValid(param);
				if (params.toast) checkIfToastParamIsValid(param);
				checkIfParamIsDeprecated(param);
			}
		};
		/**
		* Updates popup parameters.
		*
		* @this {any}
		* @param {SweetAlertOptions} params
		*/
		function update(params) {
			const container = getContainer();
			const popup = getPopup();
			const innerParams = privateProps.innerParams.get(this);
			if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
				warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
				return;
			}
			const validUpdatableParams = filterValidParams(params);
			const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
			showWarningsForParams(updatedParams);
			if (container) container.dataset["swal2Theme"] = updatedParams.theme;
			render(this, updatedParams);
			privateProps.innerParams.set(this, updatedParams);
			Object.defineProperties(this, { params: {
				value: Object.assign({}, this.params, params),
				writable: false,
				enumerable: true
			} });
		}
		/**
		* @param {SweetAlertOptions} params
		* @returns {SweetAlertOptions}
		*/
		const filterValidParams = (params) => {
			/** @type {Record<string, any>} */
			const validUpdatableParams = {};
			Object.keys(params).forEach((param) => {
				if (isUpdatableParameter(param)) validUpdatableParams[param] = params[param];
				else warn(`Invalid parameter to update: ${param}`);
			});
			return validUpdatableParams;
		};
		/**
		* Dispose the current SweetAlert2 instance
		* @this {SweetAlert}
		*/
		function _destroy() {
			var _globalState$eventEmi;
			const domCache = privateProps.domCache.get(this);
			const innerParams = privateProps.innerParams.get(this);
			if (!innerParams) {
				disposeWeakMaps(this);
				return;
			}
			if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
				globalState.swalCloseEventFinishedCallback();
				delete globalState.swalCloseEventFinishedCallback;
			}
			if (typeof innerParams.didDestroy === "function") innerParams.didDestroy();
			(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("didDestroy");
			disposeSwal(this);
		}
		/**
		* @param {SweetAlert} instance
		*/
		const disposeSwal = (instance) => {
			disposeWeakMaps(instance);
			delete instance.params;
			delete globalState.keydownHandler;
			delete globalState.keydownTarget;
			delete globalState.currentInstance;
		};
		/**
		* @param {SweetAlert} instance
		*/
		const disposeWeakMaps = (instance) => {
			if (instance.isAwaitingPromise) {
				unsetWeakMaps(privateProps, instance);
				instance.isAwaitingPromise = true;
			} else {
				unsetWeakMaps(privateMethods, instance);
				unsetWeakMaps(privateProps, instance);
				delete instance.isAwaitingPromise;
				delete instance.disableButtons;
				delete instance.enableButtons;
				delete instance.getInput;
				delete instance.disableInput;
				delete instance.enableInput;
				delete instance.hideLoading;
				delete instance.disableLoading;
				delete instance.showValidationMessage;
				delete instance.resetValidationMessage;
				delete instance.close;
				delete instance.closePopup;
				delete instance.closeModal;
				delete instance.closeToast;
				delete instance.rejectPromise;
				delete instance.update;
				delete instance._destroy;
			}
		};
		/**
		* @param {Record<string, WeakMap<any, any>>} obj
		* @param {SweetAlert} instance
		*/
		const unsetWeakMaps = (obj, instance) => {
			for (const i in obj) obj[i].delete(instance);
		};
		var instanceMethods = /*#__PURE__*/ Object.freeze({
			__proto__: null,
			_destroy,
			close,
			closeModal: close,
			closePopup: close,
			closeToast: close,
			disableButtons,
			disableInput,
			disableLoading: hideLoading,
			enableButtons,
			enableInput,
			getInput,
			handleAwaitingPromise,
			hideLoading,
			rejectPromise,
			resetValidationMessage,
			showValidationMessage,
			update
		});
		/**
		* @param {SweetAlertOptions} innerParams
		* @param {DomCache} domCache
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const handlePopupClick = (innerParams, domCache, dismissWith) => {
			if (innerParams.toast) handleToastClick(innerParams, domCache, dismissWith);
			else {
				handleModalMousedown(domCache);
				handleContainerMousedown(domCache);
				handleModalClick(innerParams, domCache, dismissWith);
			}
		};
		/**
		* @param {SweetAlertOptions} innerParams
		* @param {DomCache} domCache
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const handleToastClick = (innerParams, domCache, dismissWith) => {
			domCache.popup.onclick = () => {
				if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) return;
				dismissWith(DismissReason.close);
			};
		};
		/**
		* @param {SweetAlertOptions} innerParams
		* @returns {boolean}
		*/
		const isAnyButtonShown = (innerParams) => {
			return Boolean(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
		};
		let ignoreOutsideClick = false;
		/**
		* @param {DomCache} domCache
		*/
		const handleModalMousedown = (domCache) => {
			domCache.popup.onmousedown = () => {
				domCache.container.onmouseup = function(e) {
					domCache.container.onmouseup = () => {};
					if (e.target === domCache.container) ignoreOutsideClick = true;
				};
			};
		};
		/**
		* @param {DomCache} domCache
		*/
		const handleContainerMousedown = (domCache) => {
			domCache.container.onmousedown = (e) => {
				if (e.target === domCache.container) e.preventDefault();
				domCache.popup.onmouseup = function(e) {
					domCache.popup.onmouseup = () => {};
					if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) ignoreOutsideClick = true;
				};
			};
		};
		/**
		* @param {SweetAlertOptions} innerParams
		* @param {DomCache} domCache
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const handleModalClick = (innerParams, domCache, dismissWith) => {
			domCache.container.onclick = (e) => {
				if (ignoreOutsideClick) {
					ignoreOutsideClick = false;
					return;
				}
				if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) dismissWith(DismissReason.backdrop);
			};
		};
		/**
		* @param {unknown} elem
		* @returns {boolean}
		*/
		const isJqueryElement = (elem) => typeof elem === "object" && elem !== null && "jquery" in elem;
		/**
		* @param {unknown} elem
		* @returns {boolean}
		*/
		const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
		/**
		* @param {ReadonlyArray<unknown>} args
		* @returns {SweetAlertOptions}
		*/
		const argsToParams = (args) => {
			/** @type {Record<string, unknown>} */
			const params = {};
			if (typeof args[0] === "object" && !isElement(args[0])) Object.assign(params, args[0]);
			else [
				"title",
				"html",
				"icon"
			].forEach((name, index) => {
				const arg = args[index];
				if (typeof arg === "string" || isElement(arg)) params[name] = arg;
				else if (arg !== void 0) error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
			});
			return params;
		};
		/**
		* Main method to create a new SweetAlert2 popup
		*
		* @this {new (...args: any[]) => any}
		* @param  {...SweetAlertOptions} args
		* @returns {Promise<SweetAlertResult>}
		*/
		function fire(...args) {
			return new this(...args);
		}
		/**
		* Returns an extended version of `Swal` containing `params` as defaults.
		* Useful for reusing Swal configuration.
		*
		* For example:
		*
		* Before:
		* const textPromptOptions = { input: 'text', showCancelButton: true }
		* const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
		* const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
		*
		* After:
		* const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
		* const {value: firstName} = await TextPrompt('What is your first name?')
		* const {value: lastName} = await TextPrompt('What is your last name?')
		*
		* @param {SweetAlertOptions} mixinParams
		* @returns {SweetAlert}
		* @this {typeof import('../SweetAlert.js').SweetAlert}
		*/
		function mixin(mixinParams) {
			class MixinSwal extends this {
				/**
				* @param {any} params
				* @param {any} priorityMixinParams
				*/
				_main(params, priorityMixinParams) {
					return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
				}
			}
			return MixinSwal;
		}
		/**
		* If `timer` parameter is set, returns number of milliseconds of timer remained.
		* Otherwise, returns undefined.
		*
		* @returns {number | undefined}
		*/
		const getTimerLeft = () => {
			return globalState.timeout && globalState.timeout.getTimerLeft();
		};
		/**
		* Stop timer. Returns number of milliseconds of timer remained.
		* If `timer` parameter isn't set, returns undefined.
		*
		* @returns {number | undefined}
		*/
		const stopTimer = () => {
			if (globalState.timeout) {
				stopTimerProgressBar();
				return globalState.timeout.stop();
			}
		};
		/**
		* Resume timer. Returns number of milliseconds of timer remained.
		* If `timer` parameter isn't set, returns undefined.
		*
		* @returns {number | undefined}
		*/
		const resumeTimer = () => {
			if (globalState.timeout) {
				const remaining = globalState.timeout.start();
				animateTimerProgressBar(remaining);
				return remaining;
			}
		};
		/**
		* Resume timer. Returns number of milliseconds of timer remained.
		* If `timer` parameter isn't set, returns undefined.
		*
		* @returns {number | undefined}
		*/
		const toggleTimer = () => {
			const timer = globalState.timeout;
			return timer && (timer.running ? stopTimer() : resumeTimer());
		};
		/**
		* Increase timer. Returns number of milliseconds of an updated timer.
		* If `timer` parameter isn't set, returns undefined.
		*
		* @param {number} ms
		* @returns {number | undefined}
		*/
		const increaseTimer = (ms) => {
			if (globalState.timeout) {
				const remaining = globalState.timeout.increase(ms);
				animateTimerProgressBar(remaining, true);
				return remaining;
			}
		};
		/**
		* Check if timer is running. Returns true if timer is running
		* or false if timer is paused or stopped.
		* If `timer` parameter isn't set, returns undefined
		*
		* @returns {boolean}
		*/
		const isTimerRunning = () => {
			return Boolean(globalState.timeout && globalState.timeout.isRunning());
		};
		let bodyClickListenerAdded = false;
		/** @type {Record<string, any>} */
		const clickHandlers = {};
		/**
		* @this {any}
		* @param {string} attr
		*/
		function bindClickHandler(attr = "data-swal-template") {
			clickHandlers[attr] = this;
			if (!bodyClickListenerAdded) {
				document.body.addEventListener("click", bodyClickListener);
				bodyClickListenerAdded = true;
			}
		}
		/**
		* @param {MouseEvent} event
		*/
		const bodyClickListener = (event) => {
			for (let el = event.target; el && el !== document; el = el.parentNode) for (const attr in clickHandlers) {
				const template = el.getAttribute && el.getAttribute(attr);
				if (template) {
					clickHandlers[attr].fire({ template });
					return;
				}
			}
		};
		class EventEmitter {
			constructor() {
				/** @type {Events} */
				this.events = {};
			}
			/**
			* @param {string} eventName
			* @returns {EventHandlers}
			*/
			_getHandlersByEventName(eventName) {
				if (typeof this.events[eventName] === "undefined") this.events[eventName] = [];
				return this.events[eventName];
			}
			/**
			* @param {string} eventName
			* @param {EventHandler} eventHandler
			*/
			on(eventName, eventHandler) {
				const currentHandlers = this._getHandlersByEventName(eventName);
				if (!currentHandlers.includes(eventHandler)) currentHandlers.push(eventHandler);
			}
			/**
			* @param {string} eventName
			* @param {EventHandler} eventHandler
			*/
			once(eventName, eventHandler) {
				/**
				* @param {...any} args
				*/
				const onceFn = (...args) => {
					this.removeListener(eventName, onceFn);
					eventHandler.apply(this, args);
				};
				this.on(eventName, onceFn);
			}
			/**
			* @param {string} eventName
			* @param {...any} args
			*/
			emit(eventName, ...args) {
				this._getHandlersByEventName(eventName).forEach(
					/**
					* @param {EventHandler} eventHandler
					*/
					(eventHandler) => {
						try {
							eventHandler.apply(this, args);
						} catch (error) {
							console.error(error);
						}
					}
				);
			}
			/**
			* @param {string} eventName
			* @param {EventHandler} eventHandler
			*/
			removeListener(eventName, eventHandler) {
				const currentHandlers = this._getHandlersByEventName(eventName);
				const index = currentHandlers.indexOf(eventHandler);
				if (index > -1) currentHandlers.splice(index, 1);
			}
			/**
			* @param {string} eventName
			*/
			removeAllListeners(eventName) {
				if (this.events[eventName] !== void 0) this.events[eventName].length = 0;
			}
			reset() {
				this.events = {};
			}
		}
		globalState.eventEmitter = new EventEmitter();
		/**
		* @param {string} eventName
		* @param {EventHandler} eventHandler
		*/
		const on = (eventName, eventHandler) => {
			if (globalState.eventEmitter) globalState.eventEmitter.on(eventName, eventHandler);
		};
		/**
		* @param {string} eventName
		* @param {EventHandler} eventHandler
		*/
		const once = (eventName, eventHandler) => {
			if (globalState.eventEmitter) globalState.eventEmitter.once(eventName, eventHandler);
		};
		/**
		* @param {string} [eventName]
		* @param {EventHandler} [eventHandler]
		*/
		const off = (eventName, eventHandler) => {
			if (!globalState.eventEmitter) return;
			if (!eventName) {
				globalState.eventEmitter.reset();
				return;
			}
			if (eventHandler) globalState.eventEmitter.removeListener(eventName, eventHandler);
			else globalState.eventEmitter.removeAllListeners(eventName);
		};
		var staticMethods = /*#__PURE__*/ Object.freeze({
			__proto__: null,
			argsToParams,
			bindClickHandler,
			clickCancel,
			clickConfirm,
			clickDeny,
			enableLoading: showLoading,
			fire,
			getActions,
			getCancelButton,
			getCloseButton,
			getConfirmButton,
			getContainer,
			getDenyButton,
			getFocusableElements,
			getFooter,
			getHtmlContainer,
			getIcon,
			getIconContent,
			getImage,
			getInputLabel,
			getLoader,
			getPopup,
			getProgressSteps,
			getTimerLeft,
			getTimerProgressBar,
			getTitle,
			getValidationMessage,
			increaseTimer,
			isDeprecatedParameter,
			isLoading,
			isTimerRunning,
			isUpdatableParameter,
			isValidParameter,
			isVisible,
			mixin,
			off,
			on,
			once,
			resumeTimer,
			showLoading,
			stopTimer,
			toggleTimer
		});
		class Timer {
			/**
			* @param {() => void} callback
			* @param {number} delay
			*/
			constructor(callback, delay) {
				this.callback = callback;
				this.remaining = delay;
				this.running = false;
				this.start();
			}
			/**
			* @returns {number}
			*/
			start() {
				if (!this.running) {
					this.running = true;
					this.started = /* @__PURE__ */ new Date();
					this.id = setTimeout(this.callback, this.remaining);
				}
				return this.remaining;
			}
			/**
			* @returns {number}
			*/
			stop() {
				if (this.started && this.running) {
					this.running = false;
					clearTimeout(this.id);
					this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
				}
				return this.remaining;
			}
			/**
			* @param {number} n
			* @returns {number}
			*/
			increase(n) {
				const running = this.running;
				if (running) this.stop();
				this.remaining += n;
				if (running) this.start();
				return this.remaining;
			}
			/**
			* @returns {number}
			*/
			getTimerLeft() {
				if (this.running) {
					this.stop();
					this.start();
				}
				return this.remaining;
			}
			/**
			* @returns {boolean}
			*/
			isRunning() {
				return this.running;
			}
		}
		const swalStringParams = [
			"swal-title",
			"swal-html",
			"swal-footer"
		];
		/**
		* @param {SweetAlertOptions} params
		* @returns {SweetAlertOptions}
		*/
		const getTemplateParams = (params) => {
			const template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
			if (!template) return {};
			/** @type {DocumentFragment} */
			const templateContent = template.content;
			showWarningsForElements(templateContent);
			return Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {Record<string, string | boolean | number>}
		*/
		const getSwalParams = (templateContent) => {
			/** @type {Record<string, string | boolean | number>} */
			const result = {};
			Array.from(templateContent.querySelectorAll("swal-param")).forEach((param) => {
				showWarningsForAttributes(param, ["name", "value"]);
				const paramName = param.getAttribute("name");
				const value = param.getAttribute("value");
				if (!paramName || !value) return;
				if (paramName in defaultParams && typeof defaultParams[paramName] === "boolean") result[paramName] = value !== "false";
				else if (paramName in defaultParams && typeof defaultParams[paramName] === "object") result[paramName] = JSON.parse(value);
				else result[paramName] = value;
			});
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {Record<string, () => void>}
		*/
		const getSwalFunctionParams = (templateContent) => {
			/** @type {Record<string, () => void>} */
			const result = {};
			Array.from(templateContent.querySelectorAll("swal-function-param")).forEach((param) => {
				const paramName = param.getAttribute("name");
				const value = param.getAttribute("value");
				if (!paramName || !value) return;
				result[paramName] = new Function(`return ${value}`)();
			});
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {Record<string, string | boolean>}
		*/
		const getSwalButtons = (templateContent) => {
			/** @type {Record<string, string | boolean>} */
			const result = {};
			Array.from(templateContent.querySelectorAll("swal-button")).forEach((button) => {
				showWarningsForAttributes(button, [
					"type",
					"color",
					"aria-label"
				]);
				const type = button.getAttribute("type");
				if (!type || ![
					"confirm",
					"cancel",
					"deny"
				].includes(type)) return;
				result[`${type}ButtonText`] = button.innerHTML;
				result[`show${capitalizeFirstLetter(type)}Button`] = true;
				const color = button.getAttribute("color");
				if (color !== null) result[`${type}ButtonColor`] = color;
				const ariaLabel = button.getAttribute("aria-label");
				if (ariaLabel !== null) result[`${type}ButtonAriaLabel`] = ariaLabel;
			});
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {Pick<SweetAlertOptions, 'imageUrl' | 'imageWidth' | 'imageHeight' | 'imageAlt'>}
		*/
		const getSwalImage = (templateContent) => {
			const result = {};
			/** @type {HTMLElement | null} */
			const image = templateContent.querySelector("swal-image");
			if (image) {
				showWarningsForAttributes(image, [
					"src",
					"width",
					"height",
					"alt"
				]);
				const src = image.getAttribute("src");
				if (src !== null) result.imageUrl = src || void 0;
				const width = image.getAttribute("width");
				if (width !== null) result.imageWidth = width || void 0;
				const height = image.getAttribute("height");
				if (height !== null) result.imageHeight = height || void 0;
				const alt = image.getAttribute("alt");
				if (alt !== null) result.imageAlt = alt || void 0;
			}
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {object}
		*/
		const getSwalIcon = (templateContent) => {
			const result = {};
			/** @type {HTMLElement | null} */
			const icon = templateContent.querySelector("swal-icon");
			if (icon) {
				showWarningsForAttributes(icon, ["type", "color"]);
				if (icon.hasAttribute("type")) result.icon = icon.getAttribute("type");
				if (icon.hasAttribute("color")) result.iconColor = icon.getAttribute("color");
				result.iconHtml = icon.innerHTML;
			}
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @returns {object}
		*/
		const getSwalInput = (templateContent) => {
			/** @type {Record<string, any>} */
			const result = {};
			/** @type {HTMLElement | null} */
			const input = templateContent.querySelector("swal-input");
			if (input) {
				showWarningsForAttributes(input, [
					"type",
					"label",
					"placeholder",
					"value"
				]);
				result.input = input.getAttribute("type") || "text";
				if (input.hasAttribute("label")) result.inputLabel = input.getAttribute("label");
				if (input.hasAttribute("placeholder")) result.inputPlaceholder = input.getAttribute("placeholder");
				if (input.hasAttribute("value")) result.inputValue = input.getAttribute("value");
			}
			/** @type {HTMLElement[]} */
			const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
			if (inputOptions.length) {
				result.inputOptions = {};
				inputOptions.forEach((option) => {
					showWarningsForAttributes(option, ["value"]);
					const optionValue = option.getAttribute("value");
					if (!optionValue) return;
					const optionName = option.innerHTML;
					result.inputOptions[optionValue] = optionName;
				});
			}
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		* @param {string[]} paramNames
		* @returns {Record<string, string>}
		*/
		const getSwalStringParams = (templateContent, paramNames) => {
			/** @type {Record<string, string>} */
			const result = {};
			for (const i in paramNames) {
				const paramName = paramNames[i];
				/** @type {HTMLElement | null} */
				const tag = templateContent.querySelector(paramName);
				if (tag) {
					showWarningsForAttributes(tag, []);
					result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
				}
			}
			return result;
		};
		/**
		* @param {DocumentFragment} templateContent
		*/
		const showWarningsForElements = (templateContent) => {
			const allowedElements = swalStringParams.concat([
				"swal-param",
				"swal-function-param",
				"swal-button",
				"swal-image",
				"swal-icon",
				"swal-input",
				"swal-input-option"
			]);
			Array.from(templateContent.children).forEach((el) => {
				const tagName = el.tagName.toLowerCase();
				if (!allowedElements.includes(tagName)) warn(`Unrecognized element <${tagName}>`);
			});
		};
		/**
		* @param {HTMLElement} el
		* @param {string[]} allowedAttributes
		*/
		const showWarningsForAttributes = (el, allowedAttributes) => {
			Array.from(el.attributes).forEach((attribute) => {
				if (allowedAttributes.indexOf(attribute.name) === -1) warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
			});
		};
		const SHOW_CLASS_TIMEOUT = 10;
		/**
		* Open popup, add necessary classes and styles, fix scrollbar
		*
		* @param {SweetAlertOptions} params
		*/
		const openPopup = (params) => {
			var _globalState$eventEmi, _globalState$eventEmi2;
			const container = getContainer();
			const popup = getPopup();
			if (!container || !popup) return;
			if (typeof params.willOpen === "function") params.willOpen(popup);
			(_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willOpen", popup);
			const initialBodyOverflow = window.getComputedStyle(document.body).overflowY;
			addClasses(container, popup, params);
			setTimeout(() => {
				setScrollingVisibility(container, popup);
			}, SHOW_CLASS_TIMEOUT);
			if (isModal()) {
				fixScrollContainer(container, params.scrollbarPadding !== void 0 ? params.scrollbarPadding : false, initialBodyOverflow);
				setAriaHidden();
			}
			if (isIOS && params.backdrop === false && popup.scrollHeight > container.clientHeight) container.style.pointerEvents = "auto";
			if (!isToast() && !globalState.previousActiveElement) globalState.previousActiveElement = document.activeElement;
			if (typeof params.didOpen === "function") {
				const didOpen = params.didOpen;
				setTimeout(() => didOpen(popup));
			}
			(_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didOpen", popup);
		};
		/**
		* @param {Event} event
		*/
		const swalOpenAnimationFinished = (event) => {
			const popup = getPopup();
			if (!popup || event.target !== popup) return;
			const container = getContainer();
			if (!container) return;
			popup.removeEventListener("animationend", swalOpenAnimationFinished);
			popup.removeEventListener("transitionend", swalOpenAnimationFinished);
			container.style.overflowY = "auto";
			removeClass(container, swalClasses["no-transition"]);
		};
		/**
		* @param {HTMLElement} container
		* @param {HTMLElement} popup
		*/
		const setScrollingVisibility = (container, popup) => {
			if (hasCssAnimation(popup)) {
				container.style.overflowY = "hidden";
				popup.addEventListener("animationend", swalOpenAnimationFinished);
				popup.addEventListener("transitionend", swalOpenAnimationFinished);
			} else container.style.overflowY = "auto";
		};
		/**
		* @param {HTMLElement} container
		* @param {boolean} scrollbarPadding
		* @param {string} initialBodyOverflow
		*/
		const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
			iOSfix();
			if (scrollbarPadding && initialBodyOverflow !== "hidden") replaceScrollbarWithPadding(initialBodyOverflow);
			setTimeout(() => {
				container.scrollTop = 0;
			});
		};
		/**
		* @param {HTMLElement} container
		* @param {HTMLElement} popup
		* @param {SweetAlertOptions} params
		*/
		const addClasses = (container, popup, params) => {
			var _params$showClass;
			if ((_params$showClass = params.showClass) !== null && _params$showClass !== void 0 && _params$showClass.backdrop) addClass(container, params.showClass.backdrop);
			if (params.animation) {
				popup.style.setProperty("opacity", "0", "important");
				show(popup, "grid");
				setTimeout(() => {
					var _params$showClass2;
					if ((_params$showClass2 = params.showClass) !== null && _params$showClass2 !== void 0 && _params$showClass2.popup) addClass(popup, params.showClass.popup);
					popup.style.removeProperty("opacity");
				}, SHOW_CLASS_TIMEOUT);
			} else show(popup, "grid");
			addClass([document.documentElement, document.body], swalClasses.shown);
			if (params.heightAuto && params.backdrop && !params.toast) addClass([document.documentElement, document.body], swalClasses["height-auto"]);
		};
		var defaultInputValidators = {
			/**
			* @param {string} string
			* @param {string} [validationMessage]
			* @returns {Promise<string | void>}
			*/
			email: (string, validationMessage) => {
				return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
			},
			/**
			* @param {string} string
			* @param {string} [validationMessage]
			* @returns {Promise<string | void>}
			*/
			url: (string, validationMessage) => {
				return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
			}
		};
		/**
		* @param {SweetAlertOptions} params
		*/
		function setDefaultInputValidators(params) {
			if (params.inputValidator) return;
			if (params.input === "email") params.inputValidator = defaultInputValidators["email"];
			if (params.input === "url") params.inputValidator = defaultInputValidators["url"];
		}
		/**
		* @param {SweetAlertOptions} params
		*/
		function validateCustomTargetElement(params) {
			if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
				warn("Target parameter is not valid, defaulting to \"body\"");
				params.target = "body";
			}
		}
		/**
		* Set type, text and actions on popup
		*
		* @param {SweetAlertOptions} params
		*/
		function setParameters(params) {
			setDefaultInputValidators(params);
			if (params.showLoaderOnConfirm && !params.preConfirm) warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
			validateCustomTargetElement(params);
			if (typeof params.title === "string") params.title = params.title.split("\n").join("<br />");
			init(params);
		}
		/** @type {SweetAlert} */
		let currentInstance;
		var _promise = /*#__PURE__*/ new WeakMap();
		class SweetAlert {
			/**
			* @param {...(SweetAlertOptions | string)} args
			* @this {SweetAlert}
			*/
			constructor(...args) {
				/**
				* @type {Promise<SweetAlertResult>}
				*/
				_classPrivateFieldInitSpec(this, _promise, Promise.resolve({
					isConfirmed: false,
					isDenied: false,
					isDismissed: true
				}));
				if (typeof window === "undefined") return;
				currentInstance = this;
				const outerParams = Object.freeze(this.constructor.argsToParams(args));
				/** @type {Readonly<SweetAlertOptions>} */
				this.params = outerParams;
				/** @type {boolean} */
				this.isAwaitingPromise = false;
				_classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
			}
			/**
			* @param {any} userParams
			* @param {any} mixinParams
			*/
			_main(userParams, mixinParams = {}) {
				showWarningsForParams(Object.assign({}, mixinParams, userParams));
				if (globalState.currentInstance) {
					const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
					const { isAwaitingPromise } = globalState.currentInstance;
					globalState.currentInstance._destroy();
					if (!isAwaitingPromise) swalPromiseResolve({ isDismissed: true });
					if (isModal()) unsetAriaHidden();
				}
				globalState.currentInstance = currentInstance;
				const innerParams = prepareParams(userParams, mixinParams);
				setParameters(innerParams);
				Object.freeze(innerParams);
				if (globalState.timeout) {
					globalState.timeout.stop();
					delete globalState.timeout;
				}
				clearTimeout(globalState.restoreFocusTimeout);
				const domCache = populateDomCache(currentInstance);
				render(currentInstance, innerParams);
				privateProps.innerParams.set(currentInstance, innerParams);
				return swalPromise(currentInstance, domCache, innerParams);
			}
			/**
			* @param {any} onFulfilled
			*/
			then(onFulfilled) {
				return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
			}
			/**
			* @param {any} onFinally
			*/
			finally(onFinally) {
				return _classPrivateFieldGet2(_promise, this).finally(onFinally);
			}
		}
		/**
		* @param {SweetAlert} instance
		* @param {DomCache} domCache
		* @param {SweetAlertOptions} innerParams
		* @returns {Promise<SweetAlertResult>}
		*/
		const swalPromise = (instance, domCache, innerParams) => {
			return new Promise((resolve, reject) => {
				/**
				* @param {DismissReason} dismiss
				*/
				const dismissWith = (dismiss) => {
					instance.close({
						isDismissed: true,
						dismiss,
						isConfirmed: false,
						isDenied: false
					});
				};
				privateMethods.swalPromiseResolve.set(instance, resolve);
				privateMethods.swalPromiseReject.set(instance, reject);
				domCache.confirmButton.onclick = () => {
					handleConfirmButtonClick(instance);
				};
				domCache.denyButton.onclick = () => {
					handleDenyButtonClick(instance);
				};
				domCache.cancelButton.onclick = () => {
					handleCancelButtonClick(instance, dismissWith);
				};
				domCache.closeButton.onclick = () => {
					dismissWith(DismissReason.close);
				};
				handlePopupClick(innerParams, domCache, dismissWith);
				addKeydownHandler(globalState, innerParams, dismissWith);
				handleInputOptionsAndValue(instance, innerParams);
				openPopup(innerParams);
				setupTimer(globalState, innerParams, dismissWith);
				initFocus(domCache, innerParams);
				setTimeout(() => {
					domCache.container.scrollTop = 0;
				});
			});
		};
		/**
		* @param {SweetAlertOptions} userParams
		* @param {SweetAlertOptions} mixinParams
		* @returns {SweetAlertOptions}
		*/
		const prepareParams = (userParams, mixinParams) => {
			const templateParams = getTemplateParams(userParams);
			const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
			params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
			params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
			if (params.animation === false) {
				params.showClass = { backdrop: "swal2-noanimation" };
				params.hideClass = {};
			}
			return params;
		};
		/**
		* @param {SweetAlert} instance
		* @returns {DomCache}
		*/
		const populateDomCache = (instance) => {
			const domCache = (			/** @type {DomCache} */ {
				popup: getPopup(),
				container: getContainer(),
				actions: getActions(),
				confirmButton: getConfirmButton(),
				denyButton: getDenyButton(),
				cancelButton: getCancelButton(),
				loader: getLoader(),
				closeButton: getCloseButton(),
				validationMessage: getValidationMessage(),
				progressSteps: getProgressSteps()
			});
			privateProps.domCache.set(instance, domCache);
			return domCache;
		};
		/**
		* @param {GlobalState} globalState
		* @param {SweetAlertOptions} innerParams
		* @param {(dismiss: DismissReason) => void} dismissWith
		*/
		const setupTimer = (globalState, innerParams, dismissWith) => {
			const timerProgressBar = getTimerProgressBar();
			hide(timerProgressBar);
			if (innerParams.timer) {
				globalState.timeout = new Timer(() => {
					dismissWith("timer");
					delete globalState.timeout;
				}, innerParams.timer);
				if (innerParams.timerProgressBar && timerProgressBar) {
					show(timerProgressBar);
					applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
					setTimeout(() => {
						if (globalState.timeout && globalState.timeout.running) animateTimerProgressBar(
							/** @type {number} */
							innerParams.timer
						);
					});
				}
			}
		};
		/**
		* Initialize focus in the popup:
		*
		* 1. If `toast` is `true`, don't steal focus from the document.
		* 2. Else if there is an [autofocus] element, focus it.
		* 3. Else if `focusConfirm` is `true` and confirm button is visible, focus it.
		* 4. Else if `focusDeny` is `true` and deny button is visible, focus it.
		* 5. Else if `focusCancel` is `true` and cancel button is visible, focus it.
		* 6. Else focus the first focusable element in a popup (if any).
		*
		* @param {DomCache} domCache
		* @param {SweetAlertOptions} innerParams
		*/
		const initFocus = (domCache, innerParams) => {
			if (innerParams.toast) return;
			if (!callIfFunction(innerParams.allowEnterKey)) {
				warnAboutDeprecation("allowEnterKey", "preConfirm: () => false");
				domCache.popup.focus();
				return;
			}
			if (focusAutofocus(domCache)) return;
			if (focusButton(domCache, innerParams)) return;
			setFocus(-1, 1);
		};
		/**
		* @param {DomCache} domCache
		* @returns {boolean}
		*/
		const focusAutofocus = (domCache) => {
			const autofocusElements = Array.from(domCache.popup.querySelectorAll("[autofocus]"));
			for (const autofocusElement of autofocusElements) if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
				autofocusElement.focus();
				return true;
			}
			return false;
		};
		/**
		* @param {DomCache} domCache
		* @param {SweetAlertOptions} innerParams
		* @returns {boolean}
		*/
		const focusButton = (domCache, innerParams) => {
			if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
				domCache.denyButton.focus();
				return true;
			}
			if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
				domCache.cancelButton.focus();
				return true;
			}
			if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
				domCache.confirmButton.focus();
				return true;
			}
			return false;
		};
		SweetAlert.prototype.disableButtons = disableButtons;
		SweetAlert.prototype.enableButtons = enableButtons;
		SweetAlert.prototype.getInput = getInput;
		SweetAlert.prototype.disableInput = disableInput;
		SweetAlert.prototype.enableInput = enableInput;
		SweetAlert.prototype.hideLoading = hideLoading;
		SweetAlert.prototype.disableLoading = hideLoading;
		SweetAlert.prototype.showValidationMessage = showValidationMessage;
		SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
		SweetAlert.prototype.close = close;
		SweetAlert.prototype.closePopup = close;
		SweetAlert.prototype.closeModal = close;
		SweetAlert.prototype.closeToast = close;
		SweetAlert.prototype.rejectPromise = rejectPromise;
		SweetAlert.prototype.update = update;
		SweetAlert.prototype._destroy = _destroy;
		Object.assign(SweetAlert, staticMethods);
		Object.keys(instanceMethods).forEach((key) => {
			/**
			* @param {...(SweetAlertOptions | string | undefined)} args
			* @returns {SweetAlertResult | Promise<SweetAlertResult> | undefined}
			*/
			SweetAlert[key] = function(...args) {
				if (currentInstance && currentInstance[key]) return currentInstance[key](...args);
			};
		});
		SweetAlert.DismissReason = DismissReason;
		SweetAlert.version = "11.26.25";
		const Swal = SweetAlert;
		Swal.default = Swal;
		return Swal;
	}));
	if (typeof exports !== "undefined" && exports.Sweetalert2) exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
	"undefined" != typeof document && function(e, t) {
		var n = e.createElement("style");
		if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t);
		else try {
			n.innerHTML = t;
		} catch (e) {
			n.innerText = t;
		}
	}(document, ":root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:auto}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:auto}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}");
})))(), 1);
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.Swal = import_sweetalert2_all.default;
window.alert = function(message) {
	const isDark = document.documentElement.classList.contains("dark");
	import_sweetalert2_all.default.fire({
		text: message,
		icon: "info",
		buttonsStyling: false,
		background: isDark ? "#1e293b" : "#ffffff",
		color: isDark ? "#f8fafc" : "#1e293b",
		padding: "1.5em",
		width: "24em",
		customClass: {
			popup: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans",
			htmlContainer: "text-sm text-gray-600 dark:text-gray-300 font-sans mt-2",
			confirmButton: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors text-sm mt-5"
		}
	});
};
window.confirmAsync = async function(message, title = "Konfirmasi", isDestructive = true) {
	const isDark = document.documentElement.classList.contains("dark");
	const confirmButtonClass = isDestructive ? "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm" : "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm";
	return (await import_sweetalert2_all.default.fire({
		title,
		text: message,
		icon: isDestructive ? "warning" : "question",
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: isDestructive ? "Ya, Hapus" : "Ya, Lanjutkan",
		cancelButtonText: "Batal",
		background: isDark ? "#1e293b" : "#ffffff",
		color: isDark ? "#f8fafc" : "#1e293b",
		padding: "1.5em",
		width: "24em",
		customClass: {
			popup: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans",
			title: "text-lg font-bold font-sans mt-2",
			htmlContainer: "text-sm text-gray-500 dark:text-gray-400 font-sans",
			actions: "mt-6 flex justify-center gap-3",
			confirmButton: confirmButtonClass,
			cancelButton: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm"
		}
	})).isConfirmed;
};
window.promptAsync = async function(message, defaultValue = "") {
	const isDark = document.documentElement.classList.contains("dark");
	const result = await import_sweetalert2_all.default.fire({
		title: message,
		input: "text",
		inputValue: defaultValue,
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: "Simpan",
		cancelButtonText: "Batal",
		background: isDark ? "#1e293b" : "#ffffff",
		color: isDark ? "#f8fafc" : "#1e293b",
		padding: "1.5em",
		width: "26em",
		customClass: {
			popup: "rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 font-sans",
			title: "text-lg font-bold font-sans mt-2",
			input: "w-full text-sm font-sans border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all",
			actions: "mt-6 flex justify-center gap-3",
			confirmButton: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm",
			cancelButton: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600 font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm"
		}
	});
	return result.isConfirmed ? result.value : null;
};
//#endregion
export { __toESM as i, __commonJSMin as n, __exportAll as r, axios as t };
