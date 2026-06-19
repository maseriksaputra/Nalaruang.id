//#region node_modules/@tsparticles/engine/browser/Core/Utils/Constants.js
var generatedAttribute = "generated";
var defaultCompositeValue = "source-over";
var resizeEvent = "resize";
var visibilityChangeEvent = "visibilitychange";
var half = .5;
var millisecondsToSeconds = 1e3;
var originPoint = {
	x: 0,
	y: 0,
	z: 0
};
var defaultTransform = {
	a: 1,
	b: 0,
	c: 0,
	d: 1
};
var randomColorValue = "random";
var doublePI = Math.PI * 2;
var generatedTrue = "true";
var generatedFalse = "false";
var canvasTag = "canvas";
var quarter = .25;
var threeQuarter = .75;
var loadRandomFactor = 1e4;
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Directions/MoveDirection.js
var MoveDirection;
(function(MoveDirection) {
	MoveDirection["bottom"] = "bottom";
	MoveDirection["bottomLeft"] = "bottom-left";
	MoveDirection["bottomRight"] = "bottom-right";
	MoveDirection["left"] = "left";
	MoveDirection["none"] = "none";
	MoveDirection["right"] = "right";
	MoveDirection["top"] = "top";
	MoveDirection["topLeft"] = "top-left";
	MoveDirection["topRight"] = "top-right";
	MoveDirection["outside"] = "outside";
	MoveDirection["inside"] = "inside";
})(MoveDirection || (MoveDirection = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Core/Utils/Vectors.js
function getZ(source) {
	return "z" in source ? source.z : originPoint.z;
}
var Vector3d = class Vector3d {
	x;
	y;
	z;
	constructor(x = originPoint.x, y = originPoint.y, z = originPoint.z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static get origin() {
		return Vector3d.create(originPoint.x, originPoint.y, originPoint.z);
	}
	get angle() {
		return Math.atan2(this.y, this.x);
	}
	set angle(angle) {
		this.#updateFromAngle(angle, this.length);
	}
	get length() {
		return Math.sqrt(this.getLengthSq());
	}
	set length(length) {
		this.#updateFromAngle(this.angle, length);
	}
	static clone(source) {
		return Vector3d.create(source.x, source.y, getZ(source));
	}
	static create(x, y, z) {
		if (typeof x === "number") return new Vector3d(x, y ?? originPoint.y, z ?? originPoint.z);
		return new Vector3d(x.x, x.y, getZ(x));
	}
	add(v) {
		return Vector3d.create(this.x + v.x, this.y + v.y, this.z + getZ(v));
	}
	addTo(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += getZ(v);
	}
	copy() {
		return Vector3d.clone(this);
	}
	div(n) {
		return Vector3d.create(this.x / n, this.y / n, this.z / n);
	}
	divTo(n) {
		this.x /= n;
		this.y /= n;
		this.z /= n;
	}
	getLengthSq() {
		return this.x ** 2 + this.y ** 2;
	}
	mult(n) {
		return Vector3d.create(this.x * n, this.y * n, this.z * n);
	}
	multTo(n) {
		this.x *= n;
		this.y *= n;
		this.z *= n;
	}
	normalize() {
		const length = this.length;
		if (length != 0) this.multTo(1 / length);
	}
	rotate(angle) {
		return Vector3d.create(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle), originPoint.z);
	}
	setTo(c) {
		this.x = c.x;
		this.y = c.y;
		this.z = getZ(c);
	}
	sub(v) {
		return Vector3d.create(this.x - v.x, this.y - v.y, this.z - getZ(v));
	}
	subFrom(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= getZ(v);
	}
	#updateFromAngle(angle, length) {
		this.x = Math.cos(angle) * length;
		this.y = Math.sin(angle) * length;
	}
};
var Vector = class Vector extends Vector3d {
	constructor(x = originPoint.x, y = originPoint.y) {
		super(x, y, originPoint.z);
	}
	static get origin() {
		return Vector.create(originPoint.x, originPoint.y);
	}
	static clone(source) {
		return Vector.create(source.x, source.y);
	}
	static create(x, y) {
		if (typeof x === "number") return new Vector(x, y ?? originPoint.y);
		return new Vector(x.x, x.y);
	}
};
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/TypeUtils.js
function isBoolean(arg) {
	return typeof arg === "boolean";
}
function isString(arg) {
	return typeof arg === "string";
}
function isNumber(arg) {
	return typeof arg === "number";
}
function isObject(arg) {
	return typeof arg === "object" && arg !== null;
}
function isArray(arg) {
	return Array.isArray(arg);
}
function isNull(arg) {
	return arg === null || arg === void 0;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/MathUtils.js
var degToRadFactor = Math.PI / 180;
var _random = Math.random;
var _animationLoop = {
	nextFrame: (cb) => requestAnimationFrame(cb),
	cancel: (idx) => {
		cancelAnimationFrame(idx);
	}
};
function getRandom() {
	return clamp(_random(), 0, 1 - Number.EPSILON);
}
function getRandomInRange(min, max) {
	return getRandom() * (max - min) + min;
}
function animate(fn) {
	return _animationLoop.nextFrame(fn);
}
function cancelAnimation(handle) {
	_animationLoop.cancel(handle);
}
function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}
function randomInRangeValue(r) {
	const max = getRangeMax(r), minOffset = 0;
	let min = getRangeMin(r);
	if (max === min) min = minOffset;
	return getRandomInRange(min, max);
}
function getRangeValue(value) {
	return isNumber(value) ? value : randomInRangeValue(value);
}
function getRangeMin(value) {
	return isNumber(value) ? value : value.min;
}
function getRangeMax(value) {
	return isNumber(value) ? value : value.max;
}
function setRangeValue(source, value) {
	if (source === value || value === void 0 && isNumber(source)) return source;
	const min = getRangeMin(source), max = getRangeMax(source);
	return value !== void 0 ? {
		min: Math.min(min, value),
		max: Math.max(max, value)
	} : setRangeValue(min, max);
}
function getDistances(pointA, pointB) {
	const dx = pointA.x - pointB.x, dy = pointA.y - pointB.y;
	return {
		dx,
		dy,
		distance: Math.hypot(dx, dy)
	};
}
function getDistanceSq(pointA, pointB) {
	const dx = pointA.x - pointB.x, dy = pointA.y - pointB.y;
	return dx * dx + dy * dy;
}
function getDistance(pointA, pointB) {
	return Math.sqrt(getDistanceSq(pointA, pointB));
}
function checkDistance(pointA, pointB, distance) {
	return getDistanceSq(pointA, pointB) <= distance * distance;
}
function degToRad(degrees) {
	return degrees * degToRadFactor;
}
function getParticleDirectionAngle(direction, position, center) {
	if (isNumber(direction)) return degToRad(direction);
	switch (direction) {
		case MoveDirection.top: return -Math.PI * half;
		case MoveDirection.topRight: return -Math.PI * quarter;
		case MoveDirection.right: return 0;
		case MoveDirection.bottomRight: return Math.PI * quarter;
		case MoveDirection.bottom: return Math.PI * half;
		case MoveDirection.bottomLeft: return Math.PI * threeQuarter;
		case MoveDirection.left: return Math.PI;
		case MoveDirection.topLeft: return -Math.PI * threeQuarter;
		case MoveDirection.inside: return Math.atan2(center.y - position.y, center.x - position.x);
		case MoveDirection.outside: return Math.atan2(position.y - center.y, position.x - center.x);
		default: return getRandom() * doublePI;
	}
}
function getParticleBaseVelocity(direction) {
	const baseVelocity = Vector.origin;
	baseVelocity.length = 1;
	baseVelocity.angle = direction;
	return baseVelocity;
}
function calcExactPositionOrRandomFromSize(data) {
	const { position, size } = data;
	return {
		x: position?.x ?? getRandom() * size.width,
		y: position?.y ?? getRandom() * size.height
	};
}
function parseAlpha(input) {
	const defaultAlpha = 1;
	if (!input) return defaultAlpha;
	return input.endsWith("%") ? parseFloat(input) / 100 : parseFloat(input);
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/AnimationMode.js
var AnimationMode;
(function(AnimationMode) {
	AnimationMode["auto"] = "auto";
	AnimationMode["increase"] = "increase";
	AnimationMode["decrease"] = "decrease";
	AnimationMode["random"] = "random";
})(AnimationMode || (AnimationMode = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/AnimationStatus.js
var AnimationStatus;
(function(AnimationStatus) {
	AnimationStatus["increasing"] = "increasing";
	AnimationStatus["decreasing"] = "decreasing";
})(AnimationStatus || (AnimationStatus = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/DestroyType.js
var DestroyType;
(function(DestroyType) {
	DestroyType["none"] = "none";
	DestroyType["max"] = "max";
	DestroyType["min"] = "min";
})(DestroyType || (DestroyType = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Directions/OutModeDirection.js
var OutModeDirection;
(function(OutModeDirection) {
	OutModeDirection["bottom"] = "bottom";
	OutModeDirection["left"] = "left";
	OutModeDirection["right"] = "right";
	OutModeDirection["top"] = "top";
})(OutModeDirection || (OutModeDirection = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Modes/PixelMode.js
var PixelMode;
(function(PixelMode) {
	PixelMode["precise"] = "precise";
	PixelMode["percent"] = "percent";
})(PixelMode || (PixelMode = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/StartValueType.js
var StartValueType;
(function(StartValueType) {
	StartValueType["max"] = "max";
	StartValueType["min"] = "min";
	StartValueType["random"] = "random";
})(StartValueType || (StartValueType = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/Utils.js
var minRadius = 0, minMemoizeSize = 0;
function memoize(fn, options) {
	const cache = /* @__PURE__ */ new Map(), maxSize = options?.maxSize, ttlMs = options?.ttlMs, keyFn = options?.keyFn, stableStringify = (obj, seen = /* @__PURE__ */ new WeakSet()) => {
		if (obj === null) return "null";
		const t = typeof obj;
		if (t === "undefined") return "undefined";
		if (t === "number" || t === "boolean" || t === "string") return JSON.stringify(obj);
		if (t === "function") try {
			return obj.toString();
		} catch {
			return "\"[Function]\"";
		}
		if (t === "symbol") try {
			return obj.toString();
		} catch {
			return "\"[Symbol]\"";
		}
		if (Array.isArray(obj)) return `[${obj.map((i) => stableStringify(i, seen)).join(",")}]`;
		if (seen.has(obj)) return "\"[Circular]\"";
		seen.add(obj);
		return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k], seen)}`).join(",")}}`;
	}, defaultKeyer = (args) => stableStringify(args), makeKey = (args) => keyFn ? keyFn(args) : defaultKeyer(args), ensureBounds = () => {
		if (typeof maxSize === "number" && maxSize >= minMemoizeSize) while (cache.size > maxSize) {
			const firstKey = cache.keys().next().value;
			if (firstKey === void 0) break;
			cache.delete(firstKey);
		}
	};
	return (...args) => {
		const key = makeKey(args), now = Date.now(), entry = cache.get(key);
		if (entry !== void 0) if (ttlMs && now - entry.ts > ttlMs) cache.delete(key);
		else {
			cache.delete(key);
			cache.set(key, {
				value: entry.value,
				ts: entry.ts
			});
			return entry.value;
		}
		const result = fn(...args);
		cache.set(key, {
			value: result,
			ts: now
		});
		ensureBounds();
		return result;
	};
}
function hasMatchMedia() {
	return typeof matchMedia !== "undefined";
}
function safeDocument() {
	return globalThis.document;
}
function safeMatchMedia(query) {
	if (!hasMatchMedia()) return;
	return matchMedia(query);
}
function safeIntersectionObserver(callback) {
	if (typeof IntersectionObserver === "undefined") return;
	return new IntersectionObserver(callback);
}
function safeMutationObserver(callback) {
	if (typeof MutationObserver === "undefined") return;
	return new MutationObserver(callback);
}
function isInArray(value, array) {
	return value === array || isArray(array) && array.includes(value);
}
function arrayRandomIndex(array) {
	return Math.floor(getRandom() * array.length);
}
function itemFromArray(array, index, useIndex = true) {
	return array[index !== void 0 && useIndex ? index % array.length : arrayRandomIndex(array)];
}
function isPointInside(point, size, offset, radius, direction) {
	return areBoundsInside(calculateBounds(point, radius ?? minRadius), size, offset, direction);
}
function areBoundsInside(bounds, size, offset, direction) {
	let inside = true;
	if (!direction || direction === OutModeDirection.bottom) inside = bounds.top < size.height + offset.x;
	if (inside && (!direction || direction === OutModeDirection.left)) inside = bounds.right > offset.x;
	if (inside && (!direction || direction === OutModeDirection.right)) inside = bounds.left < size.width + offset.y;
	if (inside && (!direction || direction === OutModeDirection.top)) inside = bounds.bottom > offset.y;
	return inside;
}
function calculateBounds(point, radius) {
	return {
		bottom: point.y + radius,
		left: point.x - radius,
		right: point.x + radius,
		top: point.y - radius
	};
}
function deepExtend(destination, ...sources) {
	for (const source of sources) {
		if (isNull(source)) continue;
		if (!isObject(source)) {
			destination = source;
			continue;
		}
		if (Array.isArray(source)) {
			if (!Array.isArray(destination)) destination = [];
		} else if (!isObject(destination) || Array.isArray(destination)) destination = {};
		const sourceKeys = Object.keys(source), dangerousKeys = new Set([
			"__proto__",
			"constructor",
			"prototype"
		]);
		if (!sourceKeys.some((k) => {
			const v = source[k];
			return isObject(v) || Array.isArray(v);
		})) {
			const sourceDict = source, destDict = destination;
			for (const key of sourceKeys) {
				if (dangerousKeys.has(key)) continue;
				if (key in sourceDict) {
					const v = sourceDict[key];
					if (v !== void 0) destDict[key] = v;
				}
			}
			continue;
		}
		for (const key of sourceKeys) {
			if (dangerousKeys.has(key)) continue;
			const sourceDict = source, destDict = destination, value = sourceDict[key];
			destDict[key] = Array.isArray(value) ? value.map((v) => deepExtend(void 0, v)) : deepExtend(destDict[key], value);
		}
	}
	return destination;
}
function executeOnSingleOrMultiple(obj, callback) {
	return isArray(obj) ? obj.map((item, index) => callback(item, index)) : callback(obj, 0);
}
function itemFromSingleOrMultiple(obj, index, useIndex) {
	return isArray(obj) ? itemFromArray(obj, index, useIndex) : obj;
}
function initParticleNumericAnimationValue(options, pxRatio) {
	const valueRange = options.value, animationOptions = options.animation, res = {
		delayTime: getRangeValue(animationOptions.delay) * millisecondsToSeconds,
		enable: animationOptions.enable,
		value: getRangeValue(options.value) * pxRatio,
		max: getRangeMax(valueRange) * pxRatio,
		min: getRangeMin(valueRange) * pxRatio,
		loops: 0,
		maxLoops: getRangeValue(animationOptions.count),
		time: 0
	}, decayOffset = 1;
	if (animationOptions.enable) {
		res.decay = decayOffset - getRangeValue(animationOptions.decay);
		switch (animationOptions.mode) {
			case AnimationMode.increase:
				res.status = AnimationStatus.increasing;
				break;
			case AnimationMode.decrease:
				res.status = AnimationStatus.decreasing;
				break;
			case AnimationMode.random:
				res.status = getRandom() >= .5 ? AnimationStatus.increasing : AnimationStatus.decreasing;
				break;
			default: break;
		}
		const autoStatus = animationOptions.mode === AnimationMode.auto;
		switch (animationOptions.startValue) {
			case StartValueType.min:
				res.value = res.min;
				if (autoStatus) res.status = AnimationStatus.increasing;
				break;
			case StartValueType.max:
				res.value = res.max;
				if (autoStatus) res.status = AnimationStatus.decreasing;
				break;
			case StartValueType.random:
			default:
				res.value = randomInRangeValue(res);
				if (autoStatus) res.status = getRandom() >= .5 ? AnimationStatus.increasing : AnimationStatus.decreasing;
				break;
		}
	}
	res.initialValue = res.value;
	return res;
}
function getPositionOrSize(positionOrSize, canvasSize) {
	if (!(positionOrSize.mode === PixelMode.percent)) {
		const { mode: _, ...rest } = positionOrSize;
		return rest;
	}
	if ("x" in positionOrSize) return {
		x: positionOrSize.x / 100 * canvasSize.width,
		y: positionOrSize.y / 100 * canvasSize.height
	};
	else return {
		width: positionOrSize.width / 100 * canvasSize.width,
		height: positionOrSize.height / 100 * canvasSize.height
	};
}
function getPosition(position, canvasSize) {
	return getPositionOrSize(position, canvasSize);
}
function checkDestroy(particle, destroyType, value, minValue, maxValue) {
	switch (destroyType) {
		case DestroyType.max:
			if (value >= maxValue) particle.destroy();
			break;
		case DestroyType.min:
			if (value <= minValue) particle.destroy();
			break;
		default: break;
	}
}
function updateAnimation(particle, data, changeDirection, destroyType, delta) {
	const minLoops = 0, minDelay = 0, identity = 1, minVelocity = 0, minDecay = 1;
	if (particle.destroyed || !data.enable || (data.maxLoops ?? minLoops) > minLoops && (data.loops ?? minLoops) > (data.maxLoops ?? minLoops)) return;
	const velocity = (data.velocity ?? minVelocity) * delta.factor, minValue = data.min, maxValue = data.max, decay = data.decay ?? minDecay;
	data.time ??= 0;
	if ((data.delayTime ?? minDelay) > minDelay && data.time < (data.delayTime ?? minDelay)) data.time += delta.value;
	if ((data.delayTime ?? minDelay) > minDelay && data.time < (data.delayTime ?? minDelay)) return;
	switch (data.status) {
		case AnimationStatus.increasing:
			data.value += velocity;
			break;
		case AnimationStatus.decreasing:
			data.value -= velocity;
			break;
		default: break;
	}
	if (data.velocity && decay !== identity) data.velocity *= decay;
	switch (data.status) {
		case AnimationStatus.increasing:
			if (data.value >= maxValue) {
				if (changeDirection) data.status = AnimationStatus.decreasing;
				else data.value -= maxValue;
				data.loops ??= minLoops;
				data.loops++;
			}
			break;
		case AnimationStatus.decreasing:
			if (data.value <= minValue) {
				if (changeDirection) data.status = AnimationStatus.increasing;
				else data.value += maxValue;
				data.loops ??= minLoops;
				data.loops++;
			}
			break;
		default: break;
	}
	checkDestroy(particle, destroyType, data.value, minValue, maxValue);
	if (!particle.destroyed) data.value = clamp(data.value, minValue, maxValue);
}
function cloneStyle(style) {
	const clonedStyle = safeDocument().createElement("div").style;
	for (const key in style) {
		const styleKey = style[key];
		if (!(key in style) || isNull(styleKey)) continue;
		const styleValue = style.getPropertyValue?.(styleKey);
		if (!styleValue) continue;
		const stylePriority = style.getPropertyPriority?.(styleKey);
		if (stylePriority) clonedStyle.setProperty(styleKey, styleValue, stylePriority);
		else clonedStyle.setProperty(styleKey, styleValue);
	}
	return clonedStyle;
}
function computeFullScreenStyle(zIndex) {
	const fullScreenStyle = safeDocument().createElement("div").style, radix = 10, style = {
		width: "100%",
		height: "100%",
		margin: "0",
		padding: "0",
		borderWidth: "0",
		position: "fixed",
		zIndex: zIndex.toString(radix),
		"z-index": zIndex.toString(radix),
		top: "0",
		left: "0",
		"pointer-events": "none"
	};
	for (const key in style) {
		const value = style[key];
		if (value === void 0) continue;
		fullScreenStyle.setProperty(key, value);
	}
	return fullScreenStyle;
}
var getFullScreenStyle = memoize(computeFullScreenStyle);
function manageListener(element, event, handler, add, options) {
	if (add) {
		let addOptions = { passive: true };
		if (isBoolean(options)) addOptions.capture = options;
		else if (options !== void 0) addOptions = options;
		element.addEventListener(event, handler, addOptions);
	} else {
		const removeOptions = options;
		element.removeEventListener(event, handler, removeOptions);
	}
}
async function getItemsFromInitializer(container, map, initializers, force = false) {
	let res = map.get(container);
	if (!res || force) {
		res = await Promise.all([...initializers.values()].map((t) => t(container)));
		map.set(container, res);
	}
	return res;
}
async function getItemMapFromInitializer(container, map, initializers, force = false) {
	let res = map.get(container);
	if (!res || force) {
		const entries = await Promise.all([...initializers.entries()].map(([key, initializer]) => initializer(container).then((item) => [key, item])));
		res = new Map(entries);
		map.set(container, res);
	}
	return res;
}
//#endregion
//#region node_modules/@tsparticles/engine/browser/Enums/Types/EventType.js
var EventType;
(function(EventType) {
	EventType["configAdded"] = "configAdded";
	EventType["containerInit"] = "containerInit";
	EventType["particlesSetup"] = "particlesSetup";
	EventType["containerStarted"] = "containerStarted";
	EventType["containerStopped"] = "containerStopped";
	EventType["containerDestroyed"] = "containerDestroyed";
	EventType["containerPaused"] = "containerPaused";
	EventType["containerPlay"] = "containerPlay";
	EventType["containerBuilt"] = "containerBuilt";
	EventType["particleAdded"] = "particleAdded";
	EventType["particleDestroyed"] = "particleDestroyed";
	EventType["particleRemoved"] = "particleRemoved";
})(EventType || (EventType = {}));
//#endregion
//#region node_modules/@tsparticles/engine/browser/Utils/LogUtils.js
var errorPrefix = "tsParticles - Error";
var wrap = (fn) => (...args) => {
	fn(...args);
}, _logger = {
	debug: wrap(console.debug),
	error: (message, ...optionalParams) => {
		console.error(`${errorPrefix} - ${message}`, ...optionalParams);
	},
	info: wrap(console.info),
	log: wrap(console.log),
	trace: wrap(console.trace),
	verbose: wrap(console.log),
	warning: wrap(console.warn)
};
function getLogger() {
	return _logger;
}
//#endregion
export { Vector3d as $, cancelAnimation as A, getRangeMax as B, PixelMode as C, AnimationMode as D, AnimationStatus as E, getDistances as F, setRangeValue as G, getRangeValue as H, getParticleBaseVelocity as I, isNull as J, isArray as K, getParticleDirectionAngle as L, clamp as M, degToRad as N, animate as O, getDistance as P, Vector as Q, getRandom as R, StartValueType as S, DestroyType as T, parseAlpha as U, getRangeMin as V, randomInRangeValue as W, isObject as X, isNumber as Y, isString as Z, safeDocument as _, deepExtend as a, generatedAttribute as at, safeMutationObserver as b, getItemMapFromInitializer as c, half as ct, initParticleNumericAnimationValue as d, originPoint as dt, MoveDirection as et, isInArray as f, randomColorValue as ft, manageListener as g, itemFromSingleOrMultiple as h, cloneStyle as i, doublePI as it, checkDistance as j, calcExactPositionOrRandomFromSize as k, getItemsFromInitializer as l, loadRandomFactor as lt, itemFromArray as m, visibilityChangeEvent as mt, EventType as n, defaultCompositeValue as nt, executeOnSingleOrMultiple as o, generatedFalse as ot, isPointInside as p, resizeEvent as pt, isBoolean as q, calculateBounds as r, defaultTransform as rt, getFullScreenStyle as s, generatedTrue as st, getLogger as t, canvasTag as tt, getPosition as u, millisecondsToSeconds as ut, safeIntersectionObserver as v, OutModeDirection as w, updateAnimation as x, safeMatchMedia as y, getRandomInRange as z };
