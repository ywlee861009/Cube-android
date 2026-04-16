var _cubingSolverSetup = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __await = function(promise, isYieldStar) {
    this[0] = promise;
    this[1] = isYieldStar;
  };
  var __yieldStar = (value) => {
    var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
    if (obj == null) {
      obj = value[__knownSymbol("iterator")]();
      method = (k) => it[k] = (x) => obj[k](x);
    } else {
      obj = obj.call(value);
      method = (k) => it[k] = (v) => {
        if (isAwait) {
          isAwait = false;
          if (k === "throw") throw v;
          return v;
        }
        isAwait = true;
        return {
          done: false,
          value: new __await(new Promise((resolve) => {
            var x = obj[k](v);
            if (!(x instanceof Object)) __typeError("Object expected");
            resolve(x);
          }), 1)
        };
      };
    }
    return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
      throw x;
    }, "return" in obj && method("return"), it;
  };

  // node_modules/cubing/dist/esm/chunk-WO2AXYFE.js
  var __accessCheck, __privateGet, __privateAdd, __privateSet, __privateWrapper, __privateMethod;
  var init_chunk_WO2AXYFE = __esm({
    "node_modules/cubing/dist/esm/chunk-WO2AXYFE.js"() {
      __accessCheck = (obj, member, msg) => {
        if (!member.has(obj))
          throw TypeError("Cannot " + msg);
      };
      __privateGet = (obj, member, getter) => {
        __accessCheck(obj, member, "read from private field");
        return getter ? getter.call(obj) : member.get(obj);
      };
      __privateAdd = (obj, member, value) => {
        if (member.has(obj))
          throw TypeError("Cannot add the same private member more than once");
        member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
      };
      __privateSet = (obj, member, value, setter) => {
        __accessCheck(obj, member, "write to private field");
        setter ? setter.call(obj, value) : member.set(obj, value);
        return value;
      };
      __privateWrapper = (obj, member, setter, getter) => {
        return {
          set _(value) {
            __privateSet(obj, member, value, setter);
          },
          get _() {
            return __privateGet(obj, member, getter);
          }
        };
      };
      __privateMethod = (obj, member, method) => {
        __accessCheck(obj, member, "access private method");
        return method;
      };
    }
  });

  // node_modules/cubing/dist/esm/chunk-EWRBHQFX.js
  function toggleDirection(iterationDirection, flip = true) {
    if (!flip) {
      return iterationDirection;
    }
    switch (iterationDirection) {
      case 1:
        return -1;
      case -1:
        return 1;
    }
  }
  function direct(g, iterDir) {
    return iterDir === -1 ? Array.from(g).reverse() : g;
  }
  function reverse(g) {
    return Array.from(g).reverse();
  }
  function parseIntWithEmptyFallback(n, emptyFallback) {
    return n ? parseInt(n) : emptyFallback;
  }
  function parseAlg(s) {
    return new AlgParser().parseAlg(s);
  }
  function parseMove(s) {
    return new AlgParser().parseMove(s);
  }
  function parseQuantumMove(s) {
    return new AlgParser().parseQuantumMove(s);
  }
  function addCharIndices(t, startCharIndex, endCharIndex) {
    const parsedT = t;
    parsedT.startCharIndex = startCharIndex;
    parsedT.endCharIndex = endCharIndex;
    return parsedT;
  }
  function transferCharIndex(from, to) {
    if ("startCharIndex" in from) {
      to.startCharIndex = from.startCharIndex;
    }
    if ("endCharIndex" in from) {
      to.endCharIndex = from.endCharIndex;
    }
    return to;
  }
  function warnOnce(s) {
    if (!warned.has(s)) {
      console.warn(s);
      warned.add(s);
    }
  }
  function experimentalIs(v, c) {
    return v instanceof c;
  }
  function experimentalIsUnit(v) {
    return experimentalIs(v, Grouping) || experimentalIs(v, LineComment) || experimentalIs(v, Commutator) || experimentalIs(v, Conjugate) || experimentalIs(v, Move) || experimentalIs(v, Newline) || experimentalIs(v, Pause);
  }
  function dispatch(t, unit, dataDown) {
    if (unit.is(Grouping)) {
      return t.traverseGrouping(unit, dataDown);
    }
    if (unit.is(Move)) {
      return t.traverseMove(unit, dataDown);
    }
    if (unit.is(Commutator)) {
      return t.traverseCommutator(unit, dataDown);
    }
    if (unit.is(Conjugate)) {
      return t.traverseConjugate(unit, dataDown);
    }
    if (unit.is(Pause)) {
      return t.traversePause(unit, dataDown);
    }
    if (unit.is(Newline)) {
      return t.traverseNewline(unit, dataDown);
    }
    if (unit.is(LineComment)) {
      return t.traverseLineComment(unit, dataDown);
    }
    throw new Error(`unknown unit`);
  }
  function assertIsUnit(t) {
    if (t.is(Grouping) || t.is(Move) || t.is(Commutator) || t.is(Conjugate) || t.is(Pause) || t.is(Newline) || t.is(LineComment)) {
      return t;
    }
    throw "internal error: expected unit";
  }
  function toIterable(input) {
    if (!input) {
      return [];
    }
    if (experimentalIs(input, Alg)) {
      return input.units();
    }
    if (typeof input === "string") {
      return parseAlg(input).units();
    }
    const iter = input;
    if (typeof iter[Symbol.iterator] === "function") {
      return iter;
    }
    throw "Invalid unit";
  }
  function experimentalEnsureAlg(alg) {
    if (experimentalIs(alg, Alg)) {
      return alg;
    }
    return new Alg(alg);
  }
  function spaceBetween(u1, u2) {
    if (u1.is(Newline) || u2.is(Newline)) {
      return "";
    }
    if (u1.is(LineComment) && !u2.is(Newline)) {
      return "\n";
    }
    return " ";
  }
  var writeAlgDebugField, Comparable, AlgCommon, IterationDirection, MAX_INT, MAX_INT_DESCRIPTION, MIN_INT, _units, AlgBuilder, _A, _B, _Commutator, Commutator, _A2, _B2, _Conjugate, Conjugate, _text, _LineComment, LineComment, Newline, Pause, amountRegex, moveStartRegex, quantumMoveRegex, commentTextRegex, square1PairStart, square1PairEnd, _input, _idx, AlgParser, warned, QuantumWithAmount, _family, _innerLayer, _outerLayer, _QuantumMove, QuantumMove, _quantumWithAmount, _Move, Move, Square1TupleFormatter, square1TupleFormatterInstance, _quantumWithAmount2, _Grouping, Grouping, TraversalDownUp, _newAmount, newAmount_fn, _Simplify, Simplify, simplifyInstance, simplify, _units2, _Alg, Alg, Example, cubeKeyMapping;
  var init_chunk_EWRBHQFX = __esm({
    "node_modules/cubing/dist/esm/chunk-EWRBHQFX.js"() {
      init_chunk_WO2AXYFE();
      writeAlgDebugField = false;
      Comparable = class {
        is(c) {
          return this instanceof c;
        }
        as(c) {
          return this instanceof c ? this : null;
        }
      };
      AlgCommon = class extends Comparable {
        constructor() {
          super();
          if (writeAlgDebugField) {
            Object.defineProperty(this, "_debugStr", {
              get: () => {
                return this.toString();
              }
            });
          }
        }
        get log() {
          return console.log.bind(console, this, this.toString());
        }
      };
      (function(IterationDirection3) {
        IterationDirection3[IterationDirection3["Forwards"] = 1] = "Forwards";
        IterationDirection3[IterationDirection3["Backwards"] = -1] = "Backwards";
      })(IterationDirection || (IterationDirection = {}));
      MAX_INT = 2147483647;
      MAX_INT_DESCRIPTION = "2^31 - 1";
      MIN_INT = -2147483648;
      AlgBuilder = class {
        constructor() {
          __privateAdd(this, _units, []);
        }
        push(u) {
          __privateGet(this, _units).push(u);
        }
        experimentalPushAlg(alg) {
          for (const u of alg.units()) {
            this.push(u);
          }
        }
        experimentalNumUnits() {
          return __privateGet(this, _units).length;
        }
        toAlg() {
          return new Alg(__privateGet(this, _units));
        }
        reset() {
          __privateSet(this, _units, []);
        }
      };
      _units = /* @__PURE__ */ new WeakMap();
      _Commutator = class extends AlgCommon {
        constructor(aSource, bSource) {
          super();
          __privateAdd(this, _A, void 0);
          __privateAdd(this, _B, void 0);
          __privateSet(this, _A, experimentalEnsureAlg(aSource));
          __privateSet(this, _B, experimentalEnsureAlg(bSource));
        }
        get A() {
          return __privateGet(this, _A);
        }
        get B() {
          return __privateGet(this, _B);
        }
        isIdentical(other) {
          const otherAsCommutator = other.as(_Commutator);
          return !!((otherAsCommutator == null ? void 0 : otherAsCommutator.A.isIdentical(this.A)) && (otherAsCommutator == null ? void 0 : otherAsCommutator.B.isIdentical(this.B)));
        }
        invert() {
          return new _Commutator(__privateGet(this, _B), __privateGet(this, _A));
        }
        *experimentalExpand(iterDir = IterationDirection.Forwards, depth) {
          depth != null ? depth : depth = Infinity;
          if (depth === 0) {
            yield iterDir === IterationDirection.Forwards ? this : this.invert();
          } else {
            if (iterDir === IterationDirection.Forwards) {
              yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Forwards, depth - 1));
              yield* __yieldStar(this.B.experimentalExpand(IterationDirection.Forwards, depth - 1));
              yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Backwards, depth - 1));
              yield* __yieldStar(this.B.experimentalExpand(IterationDirection.Backwards, depth - 1));
            } else {
              yield* __yieldStar(this.B.experimentalExpand(IterationDirection.Forwards, depth - 1));
              yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Forwards, depth - 1));
              yield* __yieldStar(this.B.experimentalExpand(IterationDirection.Backwards, depth - 1));
              yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Backwards, depth - 1));
            }
          }
        }
        toString() {
          return `[${__privateGet(this, _A).toString()}, ${__privateGet(this, _B).toString()}]`;
        }
      };
      Commutator = _Commutator;
      _A = /* @__PURE__ */ new WeakMap();
      _B = /* @__PURE__ */ new WeakMap();
      _Conjugate = class extends AlgCommon {
        constructor(aSource, bSource) {
          super();
          __privateAdd(this, _A2, void 0);
          __privateAdd(this, _B2, void 0);
          __privateSet(this, _A2, experimentalEnsureAlg(aSource));
          __privateSet(this, _B2, experimentalEnsureAlg(bSource));
        }
        get A() {
          return __privateGet(this, _A2);
        }
        get B() {
          return __privateGet(this, _B2);
        }
        isIdentical(other) {
          const otherAsConjugate = other.as(_Conjugate);
          return !!((otherAsConjugate == null ? void 0 : otherAsConjugate.A.isIdentical(this.A)) && (otherAsConjugate == null ? void 0 : otherAsConjugate.B.isIdentical(this.B)));
        }
        invert() {
          return new _Conjugate(__privateGet(this, _A2), __privateGet(this, _B2).invert());
        }
        *experimentalExpand(iterDir, depth) {
          depth != null ? depth : depth = Infinity;
          if (depth === 0) {
            yield iterDir === IterationDirection.Forwards ? this : this.invert();
          } else {
            yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Forwards, depth - 1));
            yield* __yieldStar(this.B.experimentalExpand(iterDir, depth - 1));
            yield* __yieldStar(this.A.experimentalExpand(IterationDirection.Backwards, depth - 1));
          }
        }
        toString() {
          return `[${this.A}: ${this.B}]`;
        }
      };
      Conjugate = _Conjugate;
      _A2 = /* @__PURE__ */ new WeakMap();
      _B2 = /* @__PURE__ */ new WeakMap();
      _LineComment = class extends AlgCommon {
        constructor(commentText) {
          super();
          __privateAdd(this, _text, void 0);
          if (commentText.includes("\n") || commentText.includes("\r")) {
            throw new Error("LineComment cannot contain newline");
          }
          __privateSet(this, _text, commentText);
        }
        get text() {
          return __privateGet(this, _text);
        }
        isIdentical(other) {
          const otherAsLineComment = other;
          return other.is(_LineComment) && __privateGet(this, _text) === __privateGet(otherAsLineComment, _text);
        }
        invert() {
          return this;
        }
        *experimentalExpand(_iterDir = IterationDirection.Forwards, _depth = Infinity) {
          yield this;
        }
        toString() {
          return `//${__privateGet(this, _text)}`;
        }
      };
      LineComment = _LineComment;
      _text = /* @__PURE__ */ new WeakMap();
      Newline = class extends AlgCommon {
        toString() {
          return `
`;
        }
        isIdentical(other) {
          return other.is(Newline);
        }
        invert() {
          return this;
        }
        *experimentalExpand(_iterDir = IterationDirection.Forwards, _depth = Infinity) {
          yield this;
        }
      };
      Pause = class extends AlgCommon {
        toString() {
          return `.`;
        }
        isIdentical(other) {
          return other.is(Pause);
        }
        invert() {
          return this;
        }
        *experimentalExpand(_iterDir = IterationDirection.Forwards, _depth = Infinity) {
          yield this;
        }
      };
      amountRegex = /^(\d+)?('?)/;
      moveStartRegex = /^[_\dA-Za-z]/;
      quantumMoveRegex = /^((([1-9]\d*)-)?([1-9]\d*))?([_A-Za-z]+)?/;
      commentTextRegex = /^[^\n]*/;
      square1PairStart = /^(-?\d+), ?/;
      square1PairEnd = /^(-?\d+)\)/;
      AlgParser = class {
        constructor() {
          __privateAdd(this, _input, "");
          __privateAdd(this, _idx, 0);
        }
        parseAlg(input) {
          __privateSet(this, _input, input);
          __privateSet(this, _idx, 0);
          const alg = this.parseAlgWithStopping([]);
          this.mustBeAtEndOfInput();
          return alg;
        }
        parseMove(input) {
          __privateSet(this, _input, input);
          __privateSet(this, _idx, 0);
          const move = this.parseMoveImpl();
          this.mustBeAtEndOfInput();
          return move;
        }
        parseQuantumMove(input) {
          __privateSet(this, _input, input);
          __privateSet(this, _idx, 0);
          const quantumMove = this.parseQuantumMoveImpl();
          this.mustBeAtEndOfInput();
          return quantumMove;
        }
        mustBeAtEndOfInput() {
          if (__privateGet(this, _idx) !== __privateGet(this, _input).length) {
            throw new Error("parsing unexpectedly ended early");
          }
        }
        parseAlgWithStopping(stopBefore) {
          let algStartIdx = __privateGet(this, _idx);
          let algEndIdx = __privateGet(this, _idx);
          const algBuilder = new AlgBuilder();
          let crowded = false;
          const mustNotBeCrowded = (idx) => {
            if (crowded) {
              throw new Error(`Unexpected character at index ${idx}. Are you missing a space?`);
            }
          };
          mainLoop:
            while (__privateGet(this, _idx) < __privateGet(this, _input).length) {
              const savedCharIndex = __privateGet(this, _idx);
              if (stopBefore.includes(__privateGet(this, _input)[__privateGet(this, _idx)])) {
                return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
              }
              if (this.tryConsumeNext(" ")) {
                crowded = false;
                if (algBuilder.experimentalNumUnits() === 0) {
                  algStartIdx = __privateGet(this, _idx);
                }
                continue mainLoop;
              } else if (moveStartRegex.test(__privateGet(this, _input)[__privateGet(this, _idx)])) {
                mustNotBeCrowded(savedCharIndex);
                const move = this.parseMoveImpl();
                algBuilder.push(move);
                crowded = true;
                algEndIdx = __privateGet(this, _idx);
                continue mainLoop;
              } else if (this.tryConsumeNext("(")) {
                mustNotBeCrowded(savedCharIndex);
                const sq1PairStartMatch = this.tryRegex(square1PairStart);
                if (sq1PairStartMatch) {
                  const topAmountString = sq1PairStartMatch[1];
                  const savedCharIndexD = __privateGet(this, _idx);
                  const sq1PairEndMatch = this.parseRegex(square1PairEnd);
                  const uMove = addCharIndices(new Move(new QuantumMove("U_SQ_"), parseInt(topAmountString)), savedCharIndex + 1, savedCharIndex + 1 + topAmountString.length);
                  const dMove = addCharIndices(new Move(new QuantumMove("D_SQ_"), parseInt(sq1PairEndMatch[1])), savedCharIndexD, __privateGet(this, _idx) - 1);
                  const alg = addCharIndices(new Alg([uMove, dMove]), savedCharIndex + 1, __privateGet(this, _idx) - 1);
                  algBuilder.push(addCharIndices(new Grouping(alg), savedCharIndex, __privateGet(this, _idx)));
                  crowded = true;
                  algEndIdx = __privateGet(this, _idx);
                  continue mainLoop;
                } else {
                  const alg = this.parseAlgWithStopping([")"]);
                  this.mustConsumeNext(")");
                  const amount = this.parseAmount();
                  algBuilder.push(addCharIndices(new Grouping(alg, amount), savedCharIndex, __privateGet(this, _idx)));
                  crowded = true;
                  algEndIdx = __privateGet(this, _idx);
                  continue mainLoop;
                }
              } else if (this.tryConsumeNext("[")) {
                mustNotBeCrowded(savedCharIndex);
                const A = this.parseAlgWithStopping([",", ":"]);
                const separator = this.popNext();
                const B = this.parseAlgWithStopping(["]"]);
                this.mustConsumeNext("]");
                switch (separator) {
                  case ":":
                    algBuilder.push(addCharIndices(new Conjugate(A, B), savedCharIndex, __privateGet(this, _idx)));
                    crowded = true;
                    algEndIdx = __privateGet(this, _idx);
                    continue mainLoop;
                  case ",":
                    algBuilder.push(addCharIndices(new Commutator(A, B), savedCharIndex, __privateGet(this, _idx)));
                    crowded = true;
                    algEndIdx = __privateGet(this, _idx);
                    continue mainLoop;
                  default:
                    throw "unexpected parsing error";
                }
              } else if (this.tryConsumeNext("\n")) {
                algBuilder.push(addCharIndices(new Newline(), savedCharIndex, __privateGet(this, _idx)));
                crowded = false;
                algEndIdx = __privateGet(this, _idx);
                continue mainLoop;
              } else if (this.tryConsumeNext("/")) {
                if (this.tryConsumeNext("/")) {
                  mustNotBeCrowded(savedCharIndex);
                  const [text] = this.parseRegex(commentTextRegex);
                  algBuilder.push(addCharIndices(new LineComment(text), savedCharIndex, __privateGet(this, _idx)));
                  crowded = false;
                  algEndIdx = __privateGet(this, _idx);
                  continue mainLoop;
                } else {
                  algBuilder.push(addCharIndices(new Move("_SLASH_"), savedCharIndex, __privateGet(this, _idx)));
                  crowded = true;
                  algEndIdx = __privateGet(this, _idx);
                  continue mainLoop;
                }
              } else if (this.tryConsumeNext(".")) {
                mustNotBeCrowded(savedCharIndex);
                algBuilder.push(addCharIndices(new Pause(), savedCharIndex, __privateGet(this, _idx)));
                crowded = true;
                algEndIdx = __privateGet(this, _idx);
                continue mainLoop;
              } else {
                throw new Error(`Unexpected character: ${this.popNext()}`);
              }
            }
          if (__privateGet(this, _idx) !== __privateGet(this, _input).length) {
            throw new Error("did not finish parsing?");
          }
          if (stopBefore.length > 0) {
            throw new Error("expected stopping");
          }
          return addCharIndices(algBuilder.toAlg(), algStartIdx, algEndIdx);
        }
        parseQuantumMoveImpl() {
          const [, , , outerLayerStr, innerLayerStr, family] = this.parseRegex(quantumMoveRegex);
          return new QuantumMove(family, parseIntWithEmptyFallback(innerLayerStr, void 0), parseIntWithEmptyFallback(outerLayerStr, void 0));
        }
        parseMoveImpl() {
          const savedCharIndex = __privateGet(this, _idx);
          if (this.tryConsumeNext("/")) {
            return addCharIndices(new Move("_SLASH_"), savedCharIndex, __privateGet(this, _idx));
          }
          let quantumMove = this.parseQuantumMoveImpl();
          let [amount, hadEmptyAbsAmount] = this.parseAmountAndTrackEmptyAbsAmount();
          const suffix = this.parseMoveSuffix();
          if (suffix) {
            if (amount < 0) {
              throw new Error("uh-oh");
            }
            if ((suffix === "++" || suffix === "--") && amount !== 1) {
              throw new Error("Pochmann ++ or -- moves cannot have an amount other than 1.");
            }
            if ((suffix === "++" || suffix === "--") && !hadEmptyAbsAmount) {
              throw new Error("Pochmann ++ or -- moves cannot have an amount written as a number.");
            }
            if ((suffix === "+" || suffix === "-") && hadEmptyAbsAmount) {
              throw new Error("Clock dial moves must have an amount written as a natural number followed by + or -.");
            }
            if (suffix.startsWith("+")) {
              quantumMove = quantumMove.modified({
                family: `${quantumMove.family}_${suffix === "+" ? "PLUS" : "PLUSPLUS"}_`
              });
            }
            if (suffix.startsWith("-")) {
              quantumMove = quantumMove.modified({
                family: `${quantumMove.family}_${suffix === "-" ? "PLUS" : "PLUSPLUS"}_`
              });
              amount *= -1;
            }
          }
          const move = addCharIndices(new Move(quantumMove, amount), savedCharIndex, __privateGet(this, _idx));
          return move;
        }
        parseMoveSuffix() {
          if (this.tryConsumeNext("+")) {
            if (this.tryConsumeNext("+")) {
              return "++";
            }
            return "+";
          }
          if (this.tryConsumeNext("-")) {
            if (this.tryConsumeNext("-")) {
              return "--";
            }
            return "-";
          }
          return null;
        }
        parseAmountAndTrackEmptyAbsAmount() {
          const savedIdx = __privateGet(this, _idx);
          const [, absAmountStr, primeStr] = this.parseRegex(amountRegex);
          if ((absAmountStr == null ? void 0 : absAmountStr.startsWith("0")) && absAmountStr !== "0") {
            throw new Error(`Error at char index ${savedIdx}: An amount can only start with 0 if it's exactly the digit 0.`);
          }
          return [
            parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1),
            !absAmountStr
          ];
        }
        parseAmount() {
          const savedIdx = __privateGet(this, _idx);
          const [, absAmountStr, primeStr] = this.parseRegex(amountRegex);
          if ((absAmountStr == null ? void 0 : absAmountStr.startsWith("0")) && absAmountStr !== "0") {
            throw new Error(`Error at char index ${savedIdx}: An amount number can only start with 0 if it's exactly the digit 0.`);
          }
          return parseIntWithEmptyFallback(absAmountStr, 1) * (primeStr === "'" ? -1 : 1);
        }
        parseRegex(regex) {
          const arr = regex.exec(this.remaining());
          if (arr === null) {
            throw new Error("internal parsing error");
          }
          __privateSet(this, _idx, __privateGet(this, _idx) + arr[0].length);
          return arr;
        }
        tryRegex(regex) {
          const arr = regex.exec(this.remaining());
          if (arr === null) {
            return null;
          }
          __privateSet(this, _idx, __privateGet(this, _idx) + arr[0].length);
          return arr;
        }
        remaining() {
          return __privateGet(this, _input).slice(__privateGet(this, _idx));
        }
        popNext() {
          const next = __privateGet(this, _input)[__privateGet(this, _idx)];
          __privateWrapper(this, _idx)._++;
          return next;
        }
        tryConsumeNext(expected) {
          if (__privateGet(this, _input)[__privateGet(this, _idx)] === expected) {
            __privateWrapper(this, _idx)._++;
            return true;
          }
          return false;
        }
        mustConsumeNext(expected) {
          const next = this.popNext();
          if (next !== expected) {
            throw new Error(`expected \`${expected}\` while parsing, encountered ${next}`);
          }
          return next;
        }
      };
      _input = /* @__PURE__ */ new WeakMap();
      _idx = /* @__PURE__ */ new WeakMap();
      warned = /* @__PURE__ */ new Set();
      QuantumWithAmount = class {
        constructor(quantum, amount = 1) {
          this.quantum = quantum;
          this.amount = amount;
          if (!Number.isInteger(this.amount) || this.amount < MIN_INT || this.amount > MAX_INT) {
            throw new Error(`Unit amount absolute value must be a non-negative integer from ${MAX_INT_DESCRIPTION} to ${MAX_INT_DESCRIPTION}.`);
          }
        }
        suffix() {
          let s = "";
          const absAmount = Math.abs(this.amount);
          if (absAmount !== 1) {
            s += absAmount;
          }
          if (this.amount < 0) {
            s += "'";
          }
          return s;
        }
        isIdentical(other) {
          return this.quantum.isIdentical(other.quantum) && this.amount === other.amount;
        }
        *experimentalExpand(iterDir, depth) {
          const absAmount = Math.abs(this.amount);
          const newIterDir = toggleDirection(iterDir, this.amount < 0);
          for (let i2 = 0; i2 < absAmount; i2++) {
            yield* __yieldStar(this.quantum.experimentalExpand(newIterDir, depth));
          }
        }
      };
      _QuantumMove = class extends Comparable {
        constructor(family, innerLayer, outerLayer) {
          super();
          __privateAdd(this, _family, void 0);
          __privateAdd(this, _innerLayer, void 0);
          __privateAdd(this, _outerLayer, void 0);
          __privateSet(this, _family, family);
          __privateSet(this, _innerLayer, innerLayer != null ? innerLayer : null);
          __privateSet(this, _outerLayer, outerLayer != null ? outerLayer : null);
          Object.freeze(this);
          if (__privateGet(this, _innerLayer) !== null && (!Number.isInteger(__privateGet(this, _innerLayer)) || __privateGet(this, _innerLayer) < 1 || __privateGet(this, _innerLayer) > MAX_INT)) {
            throw new Error(`QuantumMove inner layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`);
          }
          if (__privateGet(this, _outerLayer) !== null && (!Number.isInteger(__privateGet(this, _outerLayer)) || __privateGet(this, _outerLayer) < 1 || __privateGet(this, _outerLayer) > MAX_INT)) {
            throw new Error(`QuantumMove outer layer must be a positive integer below ${MAX_INT_DESCRIPTION}.`);
          }
          if (__privateGet(this, _outerLayer) !== null && __privateGet(this, _innerLayer) !== null && __privateGet(this, _innerLayer) <= __privateGet(this, _outerLayer)) {
            throw new Error("QuantumMove outer layer must be smaller than inner layer.");
          }
          if (__privateGet(this, _outerLayer) !== null && __privateGet(this, _innerLayer) === null) {
            throw new Error("QuantumMove with an outer layer must have an inner layer");
          }
        }
        static fromString(s) {
          return parseQuantumMove(s);
        }
        modified(modifications) {
          var _a, _b, _c;
          return new _QuantumMove((_a = modifications.family) != null ? _a : __privateGet(this, _family), (_b = modifications.innerLayer) != null ? _b : __privateGet(this, _innerLayer), (_c = modifications.outerLayer) != null ? _c : __privateGet(this, _outerLayer));
        }
        isIdentical(other) {
          const otherAsQuantumMove = other;
          return other.is(_QuantumMove) && __privateGet(this, _family) === __privateGet(otherAsQuantumMove, _family) && __privateGet(this, _innerLayer) === __privateGet(otherAsQuantumMove, _innerLayer) && __privateGet(this, _outerLayer) === __privateGet(otherAsQuantumMove, _outerLayer);
        }
        get family() {
          return __privateGet(this, _family);
        }
        get outerLayer() {
          return __privateGet(this, _outerLayer);
        }
        get innerLayer() {
          return __privateGet(this, _innerLayer);
        }
        experimentalExpand() {
          throw new Error("experimentalExpand() cannot be called on a `QuantumMove` directly.");
        }
        toString() {
          let s = __privateGet(this, _family);
          if (__privateGet(this, _innerLayer) !== null) {
            s = String(__privateGet(this, _innerLayer)) + s;
            if (__privateGet(this, _outerLayer) !== null) {
              s = String(__privateGet(this, _outerLayer)) + "-" + s;
            }
          }
          return s;
        }
      };
      QuantumMove = _QuantumMove;
      _family = /* @__PURE__ */ new WeakMap();
      _innerLayer = /* @__PURE__ */ new WeakMap();
      _outerLayer = /* @__PURE__ */ new WeakMap();
      _Move = class extends AlgCommon {
        constructor(...args) {
          var _a;
          super();
          __privateAdd(this, _quantumWithAmount, void 0);
          if (typeof args[0] === "string") {
            if ((_a = args[1]) != null ? _a : null) {
              __privateSet(this, _quantumWithAmount, new QuantumWithAmount(QuantumMove.fromString(args[0]), args[1]));
              return;
            } else {
              return _Move.fromString(args[0]);
            }
          }
          __privateSet(this, _quantumWithAmount, new QuantumWithAmount(args[0], args[1]));
        }
        isIdentical(other) {
          const otherAsMove = other.as(_Move);
          return !!otherAsMove && __privateGet(this, _quantumWithAmount).isIdentical(__privateGet(otherAsMove, _quantumWithAmount));
        }
        invert() {
          return transferCharIndex(this, new _Move(__privateGet(this, _quantumWithAmount).quantum, -this.amount));
        }
        *experimentalExpand(iterDir = IterationDirection.Forwards) {
          if (iterDir === IterationDirection.Forwards) {
            yield this;
          } else {
            yield this.modified({
              amount: -this.amount
            });
          }
        }
        get quantum() {
          return __privateGet(this, _quantumWithAmount).quantum;
        }
        modified(modifications) {
          var _a;
          return new _Move(__privateGet(this, _quantumWithAmount).quantum.modified(modifications), (_a = modifications.amount) != null ? _a : this.amount);
        }
        static fromString(s) {
          return parseMove(s);
        }
        get amount() {
          return __privateGet(this, _quantumWithAmount).amount;
        }
        get type() {
          warnOnce("deprecated: type");
          return "blockMove";
        }
        get family() {
          var _a;
          return (_a = __privateGet(this, _quantumWithAmount).quantum.family) != null ? _a : void 0;
        }
        get outerLayer() {
          var _a;
          return (_a = __privateGet(this, _quantumWithAmount).quantum.outerLayer) != null ? _a : void 0;
        }
        get innerLayer() {
          var _a;
          return (_a = __privateGet(this, _quantumWithAmount).quantum.innerLayer) != null ? _a : void 0;
        }
        toString() {
          if (this.family === "_SLASH_") {
            return "/";
          }
          if (this.family.endsWith("_PLUS_")) {
            return __privateGet(this, _quantumWithAmount).quantum.toString().slice(0, -6) + Math.abs(this.amount) + (this.amount < 0 ? "-" : "+");
          }
          if (this.family.endsWith("_PLUSPLUS_")) {
            const absAmount = Math.abs(this.amount);
            return __privateGet(this, _quantumWithAmount).quantum.toString().slice(0, -10) + (absAmount === 1 ? "" : absAmount) + (this.amount < 0 ? "--" : "++");
          }
          return __privateGet(this, _quantumWithAmount).quantum.toString() + __privateGet(this, _quantumWithAmount).suffix();
        }
      };
      Move = _Move;
      _quantumWithAmount = /* @__PURE__ */ new WeakMap();
      Square1TupleFormatter = class {
        constructor() {
          this.quantumU_SQ_ = null;
          this.quantumD_SQ_ = null;
        }
        format(grouping) {
          const amounts = this.tuple(grouping);
          if (!amounts) {
            return null;
          }
          return `(${amounts.map((move) => move.amount).join(", ")})`;
        }
        tuple(grouping) {
          var _a, _b;
          this.quantumU_SQ_ || (this.quantumU_SQ_ = new QuantumMove("U_SQ_"));
          this.quantumD_SQ_ || (this.quantumD_SQ_ = new QuantumMove("D_SQ_"));
          const quantumAlg = grouping.alg;
          if (quantumAlg.experimentalNumUnits() === 2) {
            const [U, D] = quantumAlg.units();
            if (((_a = U.as(Move)) == null ? void 0 : _a.quantum.isIdentical(this.quantumU_SQ_)) && ((_b = D.as(Move)) == null ? void 0 : _b.quantum.isIdentical(this.quantumD_SQ_))) {
              if (grouping.amount !== 1) {
                throw new Error("Square-1 tuples cannot have an amount other than 1.");
              }
              return [U, D];
            }
          }
          return null;
        }
      };
      square1TupleFormatterInstance = new Square1TupleFormatter();
      _Grouping = class extends AlgCommon {
        constructor(algSource, amount) {
          super();
          __privateAdd(this, _quantumWithAmount2, void 0);
          const alg = experimentalEnsureAlg(algSource);
          __privateSet(this, _quantumWithAmount2, new QuantumWithAmount(alg, amount));
        }
        isIdentical(other) {
          const otherAsGrouping = other;
          return other.is(_Grouping) && __privateGet(this, _quantumWithAmount2).isIdentical(__privateGet(otherAsGrouping, _quantumWithAmount2));
        }
        get alg() {
          return __privateGet(this, _quantumWithAmount2).quantum;
        }
        get amount() {
          return __privateGet(this, _quantumWithAmount2).amount;
        }
        get experimentalRepetitionSuffix() {
          return __privateGet(this, _quantumWithAmount2).suffix();
        }
        invert() {
          return new _Grouping(__privateGet(this, _quantumWithAmount2).quantum, -__privateGet(this, _quantumWithAmount2).amount);
        }
        *experimentalExpand(iterDir = IterationDirection.Forwards, depth) {
          depth != null ? depth : depth = Infinity;
          if (depth === 0) {
            yield iterDir === IterationDirection.Forwards ? this : this.invert();
          } else {
            yield* __yieldStar(__privateGet(this, _quantumWithAmount2).experimentalExpand(iterDir, depth - 1));
          }
        }
        static fromString() {
          throw new Error("unimplemented");
        }
        toString() {
          var _a;
          return (_a = square1TupleFormatterInstance.format(this)) != null ? _a : `(${__privateGet(this, _quantumWithAmount2).quantum.toString()})${__privateGet(this, _quantumWithAmount2).suffix()}`;
        }
        experimentalAsSquare1Tuple() {
          return square1TupleFormatterInstance.tuple(this);
        }
      };
      Grouping = _Grouping;
      _quantumWithAmount2 = /* @__PURE__ */ new WeakMap();
      TraversalDownUp = class {
        traverseUnit(unit, dataDown) {
          return dispatch(this, unit, dataDown);
        }
        traverseIntoUnit(unit, dataDown) {
          return assertIsUnit(this.traverseUnit(unit, dataDown));
        }
      };
      _Simplify = class extends TraversalDownUp {
        *traverseAlg(alg, options) {
          var _a;
          if (options.depth === 0) {
            yield* __yieldStar(alg.units());
            return;
          }
          const newUnits = [];
          let lastUnit = null;
          const collapseMoves = (_a = options == null ? void 0 : options.collapseMoves) != null ? _a : true;
          function appendMoveWithNewAmount(move, deltaAmount) {
            var _a2;
            const newAmount = __privateMethod(_a2 = _Simplify, _newAmount, newAmount_fn).call(_a2, move, deltaAmount, options);
            if (newAmount === 0) {
              return false;
            }
            const newMove = new Move(move.quantum, newAmount);
            newUnits.push(newMove);
            lastUnit = newMove;
            return true;
          }
          function appendCollapsed(newUnit) {
            if (collapseMoves && (lastUnit == null ? void 0 : lastUnit.is(Move)) && newUnit.is(Move) && lastUnit.quantum.isIdentical(newUnit.quantum)) {
              newUnits.pop();
              if (!appendMoveWithNewAmount(lastUnit, newUnit.amount)) {
                lastUnit = newUnits.slice(-1)[0];
              }
            } else {
              if (newUnit.is(Move)) {
                appendMoveWithNewAmount(newUnit, 0);
              } else {
                newUnits.push(newUnit);
                lastUnit = newUnit;
              }
            }
          }
          const newOptions = {
            depth: options.depth ? options.depth - 1 : null
          };
          for (const unit of alg.units()) {
            for (const ancestorUnit of this.traverseUnit(unit, newOptions)) {
              appendCollapsed(ancestorUnit);
            }
          }
          for (const unit of newUnits) {
            yield unit;
          }
        }
        *traverseGrouping(grouping, options) {
          if (options.depth === 0) {
            yield grouping;
            return;
          }
          const newOptions = {
            depth: options.depth ? options.depth - 1 : null
          };
          yield new Grouping(this.traverseAlg(grouping.alg, newOptions));
        }
        *traverseMove(move, _options) {
          yield move;
        }
        *traverseCommutator(commutator, options) {
          if (options.depth === 0) {
            yield commutator;
            return;
          }
          const newOptions = {
            depth: options.depth ? options.depth - 1 : null
          };
          yield new Commutator(this.traverseAlg(commutator.A, newOptions), this.traverseAlg(commutator.B, newOptions));
        }
        *traverseConjugate(conjugate, options) {
          if (options.depth === 0) {
            yield conjugate;
            return;
          }
          const newOptions = {
            depth: options.depth ? options.depth - 1 : null
          };
          yield new Conjugate(this.traverseAlg(conjugate.A, newOptions), this.traverseAlg(conjugate.B, newOptions));
        }
        *traversePause(pause, _options) {
          yield pause;
        }
        *traverseNewline(newline, _options) {
          yield newline;
        }
        *traverseLineComment(comment, _options) {
          yield comment;
        }
      };
      Simplify = _Simplify;
      _newAmount = /* @__PURE__ */ new WeakSet();
      newAmount_fn = function(move, deltaAmount, options) {
        let newAmount = move.amount + deltaAmount;
        if (options == null ? void 0 : options.quantumMoveOrder) {
          const order = options.quantumMoveOrder(move.quantum);
          const min = Math.floor(order / 2) + 1 - order;
          newAmount = (newAmount % order + order - min) % order + min;
        }
        return newAmount;
      };
      __privateAdd(Simplify, _newAmount);
      simplifyInstance = new Simplify();
      simplify = simplifyInstance.traverseAlg.bind(simplifyInstance);
      _Alg = class extends AlgCommon {
        constructor(alg) {
          super();
          __privateAdd(this, _units2, void 0);
          __privateSet(this, _units2, Array.from(toIterable(alg)));
          for (const unit of __privateGet(this, _units2)) {
            if (!experimentalIsUnit(unit)) {
              throw new Error("An alg can only contain units.");
            }
          }
        }
        isIdentical(other) {
          const otherAsAlg = other;
          if (!other.is(_Alg)) {
            return false;
          }
          const l1 = Array.from(__privateGet(this, _units2));
          const l2 = Array.from(__privateGet(otherAsAlg, _units2));
          if (l1.length !== l2.length) {
            return false;
          }
          for (let i2 = 0; i2 < l1.length; i2++) {
            if (!l1[i2].isIdentical(l2[i2])) {
              return false;
            }
          }
          return true;
        }
        invert() {
          return new _Alg(reverse(Array.from(__privateGet(this, _units2)).map((u) => u.invert())));
        }
        *experimentalExpand(iterDir = IterationDirection.Forwards, depth) {
          depth != null ? depth : depth = Infinity;
          for (const unit of direct(__privateGet(this, _units2), iterDir)) {
            yield* __yieldStar(unit.experimentalExpand(iterDir, depth));
          }
        }
        expand(options) {
          var _a;
          return new _Alg(this.experimentalExpand(IterationDirection.Forwards, (_a = options == null ? void 0 : options.depth) != null ? _a : Infinity));
        }
        *experimentalLeafMoves() {
          for (const leaf of this.experimentalExpand()) {
            if (leaf.is(Move)) {
              yield leaf;
            }
          }
        }
        concat(input) {
          return new _Alg(Array.from(__privateGet(this, _units2)).concat(Array.from(toIterable(input))));
        }
        experimentalIsEmpty() {
          for (const _2 of __privateGet(this, _units2)) {
            return false;
          }
          return true;
        }
        static fromString(s) {
          return parseAlg(s);
        }
        *units() {
          for (const unit of __privateGet(this, _units2)) {
            yield unit;
          }
        }
        experimentalNumUnits() {
          return Array.from(__privateGet(this, _units2)).length;
        }
        get type() {
          warnOnce("deprecated: type");
          return "sequence";
        }
        toString() {
          let output = "";
          let previousUnit = null;
          for (const unit of __privateGet(this, _units2)) {
            if (previousUnit) {
              output += spaceBetween(previousUnit, unit);
            }
            output += unit.toString();
            previousUnit = unit;
          }
          return output;
        }
        simplify(options) {
          return new _Alg(simplify(this, options != null ? options : {}));
        }
      };
      Alg = _Alg;
      _units2 = /* @__PURE__ */ new WeakMap();
      Example = {
        Sune: new Alg([
          new Move("R", 1),
          new Move("U", 1),
          new Move("R", -1),
          new Move("U", 1),
          new Move("R", 1),
          new Move("U", -2),
          new Move("R", -1)
        ]),
        AntiSune: new Alg([
          new Move("R", 1),
          new Move("U", 2),
          new Move("R", -1),
          new Move("U", -1),
          new Move("R", 1),
          new Move("U", -1),
          new Move("R", -1)
        ]),
        SuneCommutator: new Alg([
          new Commutator(new Alg([new Move("R", 1), new Move("U", 1), new Move("R", -2)]), new Alg([
            new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
          ]))
        ]),
        Niklas: new Alg([
          new Move("R", 1),
          new Move("U", -1),
          new Move("L", -1),
          new Move("U", 1),
          new Move("R", -1),
          new Move("U", -1),
          new Move("L", 1),
          new Move("U", 1)
        ]),
        EPerm: new Alg([
          new Move("x", -1),
          new Commutator(new Alg([
            new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", -1)]))
          ]), new Alg([new Move("D", 1)])),
          new Commutator(new Alg([
            new Conjugate(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
          ]), new Alg([new Move("D", 1)])),
          new Move("x", 1)
        ]),
        FURURFCompact: new Alg([
          new Conjugate(new Alg([new Move("F", 1)]), new Alg([
            new Commutator(new Alg([new Move("U", 1)]), new Alg([new Move("R", 1)]))
          ]))
        ]),
        APermCompact: new Alg([
          new Conjugate(new Alg([new Move("R", 2)]), new Alg([
            new Commutator(new Alg([new Move("F", 2)]), new Alg([new Move("R", -1), new Move("B", -1), new Move("R", 1)]))
          ]))
        ]),
        FURURFMoves: new Alg([
          new Move("F", 1),
          new Move("U", 1),
          new Move("R", 1),
          new Move("U", -1),
          new Move("R", -1),
          new Move("F", -1)
        ]),
        TPerm: new Alg([
          new Move("R", 1),
          new Move("U", 1),
          new Move("R", -1),
          new Move("U", -1),
          new Move("R", -1),
          new Move("F", 1),
          new Move("R", 2),
          new Move("U", -1),
          new Move("R", -1),
          new Move("U", -1),
          new Move("R", 1),
          new Move("U", 1),
          new Move("R", -1),
          new Move("F", -1)
        ]),
        HeadlightSwaps: new Alg([
          new Conjugate(new Alg([new Move("F", 1)]), new Alg([
            new Grouping(new Alg([
              new Commutator(new Alg([new Move("R", 1)]), new Alg([new Move("U", 1)]))
            ]), 3)
          ]))
        ]),
        TriplePause: new Alg([new Pause(), new Pause(), new Pause()])
      };
      cubeKeyMapping = {
        73: new Move("R"),
        75: new Move("R'"),
        87: new Move("B"),
        79: new Move("B'"),
        83: new Move("D"),
        76: new Move("D'"),
        68: new Move("L"),
        69: new Move("L'"),
        74: new Move("U"),
        70: new Move("U'"),
        72: new Move("F"),
        71: new Move("F'"),
        78: new Move("x'"),
        67: new Move("l"),
        82: new Move("l'"),
        85: new Move("r"),
        77: new Move("r'"),
        88: new Move("d"),
        188: new Move("d'"),
        84: new Move("x"),
        89: new Move("x"),
        66: new Move("x'"),
        186: new Move("y"),
        59: new Move("y"),
        65: new Move("y'"),
        80: new Move("z"),
        81: new Move("z'"),
        90: new Move("M'"),
        190: new Move("M'")
      };
    }
  });

  // node_modules/cubing/dist/esm/puzzle-geometry/index.js
  var puzzle_geometry_exports = {};
  __export(puzzle_geometry_exports, {
    PuzzleGeometry: () => PuzzleGeometry,
    Quat: () => Quat,
    getPG3DNamedPuzzles: () => getPG3DNamedPuzzles,
    getPuzzleDescriptionString: () => getPuzzleDescriptionString,
    getPuzzleGeometryByDesc: () => getPuzzleGeometryByDesc,
    getPuzzleGeometryByName: () => getPuzzleGeometryByName,
    parseOptions: () => parseOptions,
    parsePuzzleDescription: () => parsePuzzleDescription,
    schreierSims: () => schreierSims
  });
  function parseOptions(argv) {
    let argp = 0;
    const options = {};
    while (argp < argv.length && argv[argp][0] === "-") {
      const option = argv[argp++];
      if (option === "--rotations") {
        options.addRotations = true;
      } else if (option === "--allmoves") {
        options.allMoves = true;
      } else if (option === "--outerblockmoves") {
        options.outerBlockMoves = true;
      } else if (option === "--vertexmoves") {
        options.vertexMoves = true;
      } else if (option === "--nocorners") {
        options.includeCornerOrbits = false;
      } else if (option === "--noedges") {
        options.includeEdgeOrbits = false;
      } else if (option === "--noorientation") {
        options.fixedOrientation = true;
      } else if (option === "--nocenters") {
        options.includeCenterOrbits = false;
      } else if (option === "--omit") {
        options.excludeOrbits = argv[argp].split(",");
        argp++;
      } else if (option === "--moves") {
        options.moveList = argv[argp].split(",");
        argp++;
      } else if (option === "--optimize") {
        options.optimizeOrbits = true;
      } else if (option === "--scramble") {
        options.scrambleAmount = 100;
      } else if (option === "--fixcorner") {
        options.fixedPieceType = "v";
      } else if (option === "--fixedge") {
        options.fixedPieceType = "e";
      } else if (option === "--fixcenter") {
        options.fixedPieceType = "f";
      } else if (option === "--orientcenters") {
        options.orientCenters = true;
      } else if (option === "--puzzleorientation") {
        options.puzzleOrientation = JSON.parse(argv[argp]);
        argp++;
      } else {
        throw new Error("Bad option: " + option);
      }
    }
    const puzzleDescription = parsePuzzleDescription(argv.slice(argp).join(" "));
    return { puzzleDescription, options };
  }
  function zeros(n) {
    if (!zeroCache[n]) {
      const c = Array(n);
      for (let i2 = 0; i2 < n; i2++) {
        c[i2] = 0;
      }
      zeroCache[n] = c;
    }
    return zeroCache[n];
  }
  function iota(n) {
    if (!iotaCache[n]) {
      const c = Array(n);
      for (let i2 = 0; i2 < n; i2++) {
        c[i2] = i2;
      }
      iotaCache[n] = c;
    }
    return iotaCache[n];
  }
  function identity(n) {
    return new Perm(iota(n));
  }
  function factorial(a) {
    let r2 = 1;
    while (a > 1) {
      r2 *= a;
      a--;
    }
    return r2;
  }
  function gcd(a, b) {
    if (a > b) {
      const t = a;
      a = b;
      b = t;
    }
    while (a > 0) {
      const m = b % a;
      b = a;
      a = m;
    }
    return b;
  }
  function lcm(a, b) {
    return a / gcd(a, b) * b;
  }
  function externalName(mapper, moveString) {
    const mv = Move.fromString(moveString);
    const mv2 = mapper.notationToExternal(mv);
    if (mv2 === null || mv === mv2) {
      return moveString;
    }
    return mv2.toString();
  }
  function showcanon(g, disp) {
    const n = g.moveops.length;
    if (n > 30) {
      throw new Error("Canon info too big for bitmask");
    }
    const orders = [];
    const commutes = [];
    for (let i2 = 0; i2 < n; i2++) {
      const permA = g.moveops[i2];
      orders.push(permA.order());
      let bits = 0;
      for (let j = 0; j < n; j++) {
        if (j === i2) {
          continue;
        }
        const permB = g.moveops[j];
        if (permA.mul(permB).equal(permB.mul(permA))) {
          bits |= 1 << j;
        }
      }
      commutes.push(bits);
    }
    let curlev = {};
    curlev[0] = 1;
    for (let d2 = 0; d2 < 100; d2++) {
      let sum = 0;
      const nextlev = {};
      let uniq = 0;
      for (const sti in curlev) {
        const st = +sti;
        const cnt = curlev[st];
        sum += cnt;
        uniq++;
        for (let mv = 0; mv < orders.length; mv++) {
          if ((st >> mv & 1) === 0 && (st & commutes[mv] & (1 << mv) - 1) === 0) {
            const nst = st & commutes[mv] | 1 << mv;
            if (nextlev[nst] === void 0) {
              nextlev[nst] = 0;
            }
            nextlev[nst] += (orders[mv] - 1) * cnt;
          }
        }
      }
      disp(`${d2}: canonseq ${sum} states ${uniq}`);
      curlev = nextlev;
    }
  }
  function centermassface(face) {
    let s = new Quat(0, 0, 0, 0);
    for (let i2 = 0; i2 < face.length; i2++) {
      s = s.sum(face[i2]);
    }
    return s.smul(1 / face.length);
  }
  function solvethreeplanes(p1, p2, p3, planes) {
    const p = planes[p1].intersect3(planes[p2], planes[p3]);
    if (!p) {
      return p;
    }
    for (let i2 = 0; i2 < planes.length; i2++) {
      if (i2 !== p1 && i2 !== p2 && i2 !== p3) {
        const dt = planes[i2].b * p.b + planes[i2].c * p.c + planes[i2].d * p.d;
        if (planes[i2].a > 0 && dt > planes[i2].a || planes[i2].a < 0 && dt < planes[i2].a) {
          return false;
        }
      }
    }
    return p;
  }
  function cube() {
    const s5 = Math.sqrt(0.5);
    return [new Quat(s5, s5, 0, 0), new Quat(s5, 0, s5, 0)];
  }
  function tetrahedron() {
    return [new Quat(0.5, 0.5, 0.5, 0.5), new Quat(0.5, 0.5, 0.5, -0.5)];
  }
  function dodecahedron() {
    const d36 = 2 * Math.PI / 10;
    let dx = 0.5 + 0.3 * Math.sqrt(5);
    let dy = 0.5 + 0.1 * Math.sqrt(5);
    const dd = Math.sqrt(dx * dx + dy * dy);
    dx /= dd;
    dy /= dd;
    return [
      new Quat(Math.cos(d36), dx * Math.sin(d36), dy * Math.sin(d36), 0),
      new Quat(0.5, 0.5, 0.5, 0.5)
    ];
  }
  function icosahedron() {
    let dx = 1 / 6 + Math.sqrt(5) / 6;
    let dy = 2 / 3 + Math.sqrt(5) / 3;
    const dd = Math.sqrt(dx * dx + dy * dy);
    dx /= dd;
    dy /= dd;
    const ang = 2 * Math.PI / 6;
    return [
      new Quat(Math.cos(ang), dx * Math.sin(ang), dy * Math.sin(ang), 0),
      new Quat(Math.cos(ang), -dx * Math.sin(ang), dy * Math.sin(ang), 0)
    ];
  }
  function octahedron() {
    const s5 = Math.sqrt(0.5);
    return [new Quat(0.5, 0.5, 0.5, 0.5), new Quat(s5, 0, 0, s5)];
  }
  function closure(g) {
    const q = [new Quat(1, 0, 0, 0)];
    for (let i2 = 0; i2 < q.length; i2++) {
      for (let j = 0; j < g.length; j++) {
        const ns = g[j].mul(q[i2]);
        const negns = ns.smul(-1);
        let wasseen = false;
        for (let k = 0; k < q.length; k++) {
          if (ns.dist(q[k]) < eps2 || negns.dist(q[k]) < eps2) {
            wasseen = true;
            break;
          }
        }
        if (!wasseen) {
          q.push(ns);
        }
      }
    }
    return q;
  }
  function uniqueplanes(p, g) {
    const planes = [];
    const planerot = [];
    for (let i2 = 0; i2 < g.length; i2++) {
      const p2 = p.rotateplane(g[i2]);
      let wasseen = false;
      for (let j = 0; j < planes.length; j++) {
        if (p2.dist(planes[j]) < eps2) {
          wasseen = true;
          break;
        }
      }
      if (!wasseen) {
        planes.push(p2);
        planerot.push(g[i2]);
      }
    }
    return planerot;
  }
  function getface(planes) {
    const face = [];
    for (let i2 = 1; i2 < planes.length; i2++) {
      for (let j = i2 + 1; j < planes.length; j++) {
        const p = solvethreeplanes(0, i2, j, planes);
        if (p) {
          let wasseen = false;
          for (let k = 0; k < face.length; k++) {
            if (p.dist(face[k]) < eps2) {
              wasseen = true;
              break;
            }
          }
          if (!wasseen) {
            face.push(p);
          }
        }
      }
    }
    for (; ; ) {
      let changed = false;
      for (let i2 = 0; i2 < face.length; i2++) {
        const j = (i2 + 1) % face.length;
        if (planes[0].dot(face[i2].cross(face[j])) < 0) {
          const t = face[i2];
          face[i2] = face[j];
          face[j] = t;
          changed = true;
        }
      }
      if (!changed) {
        break;
      }
    }
    return face;
  }
  function schreierSims(g, disp) {
    const n = g[0].p.length;
    const e = identity(n);
    let sgs = [];
    let sgsi = [];
    let sgslen = [];
    let Tk = [];
    let Tklen = [];
    function resolve(p) {
      for (let i2 = p.p.length - 1; i2 >= 0; i2--) {
        const j = p.p[i2];
        if (j !== i2) {
          if (!sgs[i2][j]) {
            return false;
          }
          p = p.mul(sgsi[i2][j]);
        }
      }
      return true;
    }
    function knutha(k, p, len) {
      Tk[k].push(p);
      Tklen[k].push(len);
      for (let i2 = 0; i2 < sgs[k].length; i2++) {
        if (sgs[k][i2]) {
          knuthb(k, sgs[k][i2].mul(p), len + sgslen[k][i2]);
        }
      }
    }
    function knuthb(k, p, len) {
      const j = p.p[k];
      if (!sgs[k][j]) {
        sgs[k][j] = p;
        sgsi[k][j] = p.inv();
        sgslen[k][j] = len;
        for (let i2 = 0; i2 < Tk[k].length; i2++) {
          knuthb(k, p.mul(Tk[k][i2]), len + Tklen[k][i2]);
        }
        return;
      }
      const p2 = p.mul(sgsi[k][j]);
      if (!resolve(p2)) {
        knutha(k - 1, p2, len + sgslen[k][j]);
      }
    }
    function getsgs() {
      sgs = [];
      sgsi = [];
      Tk = [];
      sgslen = [];
      Tklen = [];
      for (let i2 = 0; i2 < n; i2++) {
        sgs.push([]);
        sgsi.push([]);
        sgslen.push([]);
        Tk.push([]);
        Tklen.push([]);
        sgs[i2][i2] = e;
        sgsi[i2][i2] = e;
        sgslen[i2][i2] = 0;
      }
      let none = 0;
      let sz = 1;
      for (let i2 = 0; i2 < g.length; i2++) {
        knutha(n - 1, g[i2], 1);
        sz = 1;
        let tks = 0;
        let sollen = 0;
        const avgs = [];
        const mults = new FactoredNumber();
        for (let j = 0; j < n; j++) {
          let cnt = 0;
          let lensum = 0;
          for (let k = 0; k < n; k++) {
            if (sgs[j][k]) {
              cnt++;
              lensum += sgslen[j][k];
              if (j !== k) {
                none++;
              }
            }
          }
          tks += Tk[j].length;
          sz *= cnt;
          if (cnt > 1) {
            mults.multiply(cnt);
          }
          const avg = lensum / cnt;
          avgs.push(avg);
          sollen += avg;
        }
        disp(`${i2}: sz ${sz} T ${tks} sol ${sollen} none ${none} mults ${mults.toString()}`);
      }
      return sz;
    }
    return getsgs();
  }
  function tstart(s) {
    return s;
  }
  function tend(_2) {
  }
  function expandfaces(rots, faces) {
    const nfaces = [];
    for (const rot of rots) {
      for (const face of faces) {
        nfaces.push(face.rotate(rot));
      }
    }
    return nfaces;
  }
  function defaultnets() {
    return {
      4: [["F", "D", "L", "R"]],
      6: [
        ["F", "D", "L", "U", "R"],
        ["R", "F", "", "B", ""]
      ],
      8: [
        ["F", "D", "L", "R"],
        ["D", "F", "BR", ""],
        ["BR", "D", "", "BB"],
        ["BB", "BR", "U", "BL"]
      ],
      12: [
        ["U", "F", "", "", "", ""],
        ["F", "U", "R", "C", "A", "L"],
        ["R", "F", "", "", "E", ""],
        ["E", "R", "", "BF", "", ""],
        ["BF", "E", "BR", "BL", "I", "D"]
      ],
      20: [
        ["R", "C", "F", "E"],
        ["F", "R", "L", "U"],
        ["L", "F", "A", ""],
        ["E", "R", "G", "I"],
        ["I", "E", "S", "H"],
        ["S", "I", "J", "B"],
        ["B", "S", "K", "D"],
        ["K", "B", "M", "O"],
        ["O", "K", "P", "N"],
        ["P", "O", "Q", ""]
      ]
    };
  }
  function defaultcolors() {
    return {
      4: { F: "#00ff00", D: "#ffff00", L: "#ff0000", R: "#0000ff" },
      6: {
        U: "#ffffff",
        F: "#00ff00",
        R: "#ff0000",
        D: "#ffff00",
        B: "#0000ff",
        L: "#ff8000"
      },
      8: {
        U: "#ffffff",
        F: "#ff0000",
        R: "#00bb00",
        D: "#ffff00",
        BB: "#1122ff",
        L: "#9524c5",
        BL: "#ff8800",
        BR: "#aaaaaa"
      },
      12: {
        U: "#ffffff",
        F: "#006633",
        R: "#ff0000",
        C: "#ffffd0",
        A: "#3399ff",
        L: "#660099",
        E: "#ff66cc",
        BF: "#99ff00",
        BR: "#0000ff",
        BL: "#ffff00",
        I: "#ff6633",
        D: "#999999"
      },
      20: {
        R: "#db69f0",
        C: "#178fde",
        F: "#23238b",
        E: "#9cc726",
        L: "#2c212d",
        U: "#177fa7",
        A: "#e0de7f",
        G: "#2b57c0",
        I: "#41126b",
        S: "#4b8c28",
        H: "#7c098d",
        J: "#7fe7b4",
        B: "#85fb74",
        K: "#3f4bc3",
        D: "#0ff555",
        M: "#f1c2c8",
        O: "#58d340",
        P: "#c514f2",
        N: "#14494e",
        Q: "#8b1be1"
      }
    };
  }
  function defaultfaceorders() {
    return {
      4: ["F", "D", "L", "R"],
      6: ["U", "D", "F", "B", "L", "R"],
      8: ["F", "BB", "D", "U", "BR", "L", "R", "BL"],
      12: ["L", "E", "F", "BF", "R", "I", "U", "D", "BR", "A", "BL", "C"],
      20: [
        "L",
        "S",
        "E",
        "O",
        "F",
        "B",
        "I",
        "P",
        "R",
        "K",
        "U",
        "D",
        "J",
        "A",
        "Q",
        "H",
        "G",
        "N",
        "M",
        "C"
      ]
    };
  }
  function defaultOrientations() {
    return {
      4: [
        ["FLR", [0, 1, 0]],
        ["F", [0, 0, 1]]
      ],
      6: [
        ["U", [0, 1, 0]],
        ["F", [0, 0, 1]]
      ],
      8: [
        ["U", [0, 1, 0]],
        ["F", [0, 0, 1]]
      ],
      12: [
        ["U", [0, 1, 0]],
        ["F", [0, 0, 1]]
      ],
      20: [
        ["GUQMJ", [0, 1, 0]],
        ["F", [0, 0, 1]]
      ]
    };
  }
  function findelement(a, p) {
    for (let i2 = 0; i2 < a.length; i2++) {
      if (a[i2][0].dist(p) < eps3) {
        return i2;
      }
    }
    throw new Error("Element not found");
  }
  function getPG3DNamedPuzzles() {
    return PGPuzzles;
  }
  function getPuzzleDescriptionString(puzzleName) {
    return PGPuzzles[puzzleName];
  }
  function parsePuzzleDescription(s) {
    const a = s.split(/ /).filter(Boolean);
    if (a.length % 2 === 0) {
      return null;
    }
    const shape = a[0];
    if (shape !== "o" && shape !== "c" && shape !== "i" && shape !== "d" && shape !== "t") {
      return null;
    }
    const cuts = [];
    for (let i2 = 1; i2 < a.length; i2 += 2) {
      if (a[i2] !== "f" && a[i2] !== "v" && a[i2] !== "e") {
        return null;
      }
      cuts.push({ cutType: a[i2], distance: parseFloat(a[i2 + 1]) });
    }
    return { shape, cuts };
  }
  function getPuzzleGeometryByDesc(desc, options = {}) {
    const parsed = parsePuzzleDescription(desc);
    if (parsed === null) {
      throw new Error("Could not parse the puzzle description");
    }
    const pg = new PuzzleGeometry(parsed, Object.assign({}, { allMoves: true }, options));
    pg.allstickers();
    pg.genperms();
    return pg;
  }
  function getPuzzleGeometryByName(puzzleName, options) {
    return getPuzzleGeometryByDesc(PGPuzzles[puzzleName], options);
  }
  function getmovename(geo, bits, slices) {
    let inverted = false;
    if (slices - bits[1] < bits[0]) {
      geo = [geo[2], geo[3], geo[0], geo[1]];
      bits = [slices - bits[1], slices - bits[0]];
      inverted = true;
    }
    let movenameFamily = geo[0];
    let movenamePrefix = "";
    if (bits[0] === 0 && bits[1] === slices) {
      movenameFamily = movenameFamily + "v";
    } else if (bits[0] === bits[1]) {
      if (bits[1] > 0) {
        movenamePrefix = String(bits[1] + 1);
      }
    } else if (bits[0] === 0) {
      movenameFamily = movenameFamily.toLowerCase();
      if (bits[1] > 1) {
        movenamePrefix = String(bits[1] + 1);
      }
    } else {
      throw `We only support slice and outer block moves right now. ${bits}`;
    }
    return [movenamePrefix + movenameFamily, inverted];
  }
  function splitByFaceNames(s, facenames) {
    const r2 = [];
    let at = 0;
    while (at < s.length) {
      if (at > 0 && at < s.length && s[at] === "_") {
        at++;
      }
      let currentMatch = "";
      for (const facename of facenames) {
        if (s.substr(at).startsWith(facename[1]) && facename[1].length > currentMatch.length) {
          currentMatch = facename[1];
        }
      }
      if (currentMatch !== "") {
        r2.push(currentMatch);
        at += currentMatch.length;
      } else {
        throw new Error("Could not split " + s + " into face names.");
      }
    }
    return r2;
  }
  function toCoords(q, maxdist) {
    return [q.b / maxdist, -q.c / maxdist, q.d / maxdist];
  }
  function toFaceCoords(q, maxdist) {
    const r2 = [];
    const n = q.length;
    for (let i2 = 0; i2 < n; i2++) {
      const pt = toCoords(q.get(n - i2 - 1), maxdist);
      r2[3 * i2] = pt[0];
      r2[3 * i2 + 1] = pt[1];
      r2[3 * i2 + 2] = pt[2];
    }
    return r2;
  }
  var FaceNameSwizzler, NullMapper, FTONotationMapper, FaceRenamingMapper, MegaminxScramblingNotationMapper, NxNxNCubeMapper, pyraminxFamilyMap, tetraminxFamilyMap, pyraminxFamilyMapWCA, pyraminxExternalQuantumY, pyraminxInternalQuantumY, PyraminxNotationMapper, TetraminxNotationMapper, skewbFamilyMap, skewbExternalQuantumX, skewbInternalQuantumX, skewbExternalQuantumY, skewbInternalQuantumY, skewbExternalQuantumZ, skewbInternalQuantumZ, SkewbNotationMapper, PuzzleGeometryFullOptions, zeroCache, iotaCache, Perm, PGOrbitDef, PGOrbitsDef, _PGOrbit, PGOrbit, PGTransformBase, PGTransform, VisibleState, DisjointUnion, PGPuzzles, eps, Quat, eps2, FactoredNumber, Face, FaceTree, eps3, copyright, permissivieMoveParsing, PuzzleGeometry, PGNotation;
  var init_puzzle_geometry = __esm({
    "node_modules/cubing/dist/esm/puzzle-geometry/index.js"() {
      init_chunk_EWRBHQFX();
      init_chunk_WO2AXYFE();
      FaceNameSwizzler = class {
        constructor(facenames, gripnames_arg) {
          this.facenames = facenames;
          this.prefixFree = true;
          this.gripnames = [];
          if (gripnames_arg) {
            this.gripnames = gripnames_arg;
          }
          for (let i2 = 0; this.prefixFree && i2 < facenames.length; i2++) {
            for (let j = 0; this.prefixFree && j < facenames.length; j++) {
              if (i2 !== j && facenames[i2].startsWith(facenames[j])) {
                this.prefixFree = false;
              }
            }
          }
        }
        setGripNames(names) {
          this.gripnames = names;
        }
        splitByFaceNames(s) {
          const r2 = [];
          let at = 0;
          while (at < s.length) {
            if (at > 0 && at < s.length && s[at] === "_") {
              at++;
            }
            let currentMatch = -1;
            for (let i2 = 0; i2 < this.facenames.length; i2++) {
              if (s.substr(at).startsWith(this.facenames[i2]) && (currentMatch < 0 || this.facenames[i2].length > this.facenames[currentMatch].length)) {
                currentMatch = i2;
              }
            }
            if (currentMatch >= 0) {
              r2.push(currentMatch);
              at += this.facenames[currentMatch].length;
            } else {
              throw new Error("Could not split " + s + " into face names.");
            }
          }
          return r2;
        }
        joinByFaceIndices(list) {
          let sep = "";
          const r2 = [];
          for (let i2 = 0; i2 < list.length; i2++) {
            r2.push(sep);
            r2.push(this.facenames[list[i2]]);
            if (!this.prefixFree) {
              sep = "_";
            }
          }
          return r2.join("");
        }
        spinmatch(userinput, longname) {
          if (userinput === longname) {
            return true;
          }
          try {
            const e1 = this.splitByFaceNames(userinput);
            const e2 = this.splitByFaceNames(longname);
            if (e1.length !== e2.length && e1.length < 3) {
              return false;
            }
            for (let i2 = 0; i2 < e1.length; i2++) {
              for (let j = 0; j < i2; j++) {
                if (e1[i2] === e1[j]) {
                  return false;
                }
              }
              let found = false;
              for (let j = 0; j < e2.length; j++) {
                if (e1[i2] === e2[j]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                return false;
              }
            }
            return true;
          } catch (e) {
            return false;
          }
        }
        unswizzle(s) {
          if ((s.endsWith("v") || s.endsWith("w")) && s[0] <= "Z") {
            s = s.slice(0, s.length - 1);
          }
          const upperCaseGrip = s.toUpperCase();
          for (let i2 = 0; i2 < this.gripnames.length; i2++) {
            const g = this.gripnames[i2];
            if (this.spinmatch(upperCaseGrip, g)) {
              return g;
            }
          }
          return s;
        }
      };
      NullMapper = class {
        notationToInternal(move) {
          return move;
        }
        notationToExternal(move) {
          return move;
        }
      };
      FTONotationMapper = class {
        constructor(child, sw) {
          this.child = child;
          this.sw = sw;
        }
        notationToInternal(move) {
          if (move.family === "T" && move.innerLayer === void 0 && move.outerLayer === void 0) {
            return new Move(new QuantumMove("FLRv", move.innerLayer, move.outerLayer), move.amount);
          } else {
            const r2 = this.child.notationToInternal(move);
            return r2;
          }
        }
        notationToExternal(move) {
          let fam = move.family;
          if (fam.length > 0 && fam[fam.length - 1] === "v") {
            fam = fam.substring(0, fam.length - 1);
          }
          if (this.sw.spinmatch(fam, "FLUR")) {
            return new Move(new QuantumMove("T", move.innerLayer, move.outerLayer), move.amount);
          }
          return this.child.notationToExternal(move);
        }
      };
      FaceRenamingMapper = class {
        constructor(internalNames, externalNames) {
          this.internalNames = internalNames;
          this.externalNames = externalNames;
        }
        convertString(grip, a, b) {
          let suffix = "";
          if ((grip.endsWith("v") || grip.endsWith("v")) && grip <= "_") {
            suffix = grip.slice(grip.length - 1);
            grip = grip.slice(0, grip.length - 1);
          }
          const upper = grip.toUpperCase();
          let isLowerCase = false;
          if (grip !== upper) {
            isLowerCase = true;
            grip = upper;
          }
          grip = b.joinByFaceIndices(a.splitByFaceNames(grip));
          if (isLowerCase) {
            grip = grip.toLowerCase();
          }
          return grip + suffix;
        }
        convert(move, a, b) {
          const grip = move.family;
          const ngrip = this.convertString(grip, a, b);
          if (grip === ngrip) {
            return move;
          } else {
            return new Move(new QuantumMove(ngrip, move.innerLayer, move.outerLayer), move.amount);
          }
        }
        notationToInternal(move) {
          const r2 = this.convert(move, this.externalNames, this.internalNames);
          return r2;
        }
        notationToExternal(move) {
          return this.convert(move, this.internalNames, this.externalNames);
        }
      };
      MegaminxScramblingNotationMapper = class {
        constructor(child) {
          this.child = child;
        }
        notationToInternal(move) {
          if (move.innerLayer === void 0 && move.outerLayer === void 0) {
            if (Math.abs(move.amount) === 1) {
              if (move.family === "R++") {
                return new Move(new QuantumMove("L", 3, 2), -2 * move.amount);
              } else if (move.family === "R--") {
                return new Move(new QuantumMove("L", 3, 2), 2 * move.amount);
              } else if (move.family === "D++") {
                return new Move(new QuantumMove("U", 3, 2), -2 * move.amount);
              } else if (move.family === "D--") {
                return new Move(new QuantumMove("U", 3, 2), 2 * move.amount);
              }
              if (move.family === "R_PLUSPLUS_") {
                return new Move(new QuantumMove("L", 3, 2), -2 * move.amount);
              } else if (move.family === "D_PLUSPLUS_") {
                return new Move(new QuantumMove("U", 3, 2), -2 * move.amount);
              }
            }
            if (move.family === "y") {
              return new Move("Uv", move.amount);
            }
          }
          return this.child.notationToInternal(move);
        }
        notationToExternal(move) {
          if (move.family === "Uv") {
            return new Move(new QuantumMove("y", move.innerLayer, move.outerLayer), move.amount);
          }
          if (move.family === "Dv") {
            return new Move("y", -move.amount);
          }
          return this.child.notationToExternal(move);
        }
      };
      NxNxNCubeMapper = class {
        constructor(slices) {
          this.slices = slices;
        }
        notationToInternal(move) {
          const grip = move.family;
          if (!move.innerLayer && !move.outerLayer) {
            if (grip === "x") {
              move = new Move("Rv", move.amount);
            } else if (grip === "y") {
              move = new Move("Uv", move.amount);
            } else if (grip === "z") {
              move = new Move("Fv", move.amount);
            }
            if ((this.slices & 1) === 1) {
              if (grip === "E") {
                move = new Move(new QuantumMove("D", (this.slices + 1) / 2), move.amount);
              } else if (grip === "M") {
                move = new Move(new QuantumMove("L", (this.slices + 1) / 2), move.amount);
              } else if (grip === "S") {
                move = new Move(new QuantumMove("F", (this.slices + 1) / 2), move.amount);
              }
            }
            if (this.slices > 2) {
              if (grip === "e") {
                move = new Move(new QuantumMove("D", this.slices - 1, 2), move.amount);
              } else if (grip === "m") {
                move = new Move(new QuantumMove("L", this.slices - 1, 2), move.amount);
              } else if (grip === "s") {
                move = new Move(new QuantumMove("F", this.slices - 1, 2), move.amount);
              }
            }
          }
          return move;
        }
        notationToExternal(move) {
          const grip = move.family;
          if (!move.innerLayer && !move.outerLayer) {
            if (grip === "Rv") {
              return new Move("x", move.amount);
            } else if (grip === "Uv") {
              return new Move("y", move.amount);
            } else if (grip === "Fv") {
              return new Move("z", move.amount);
            } else if (grip === "Lv") {
              return new Move("x", -move.amount);
            } else if (grip === "Dv") {
              return new Move("y", -move.amount);
            } else if (grip === "Bv") {
              return new Move("z", -move.amount);
            }
          }
          return move;
        }
      };
      pyraminxFamilyMap = {
        U: "frl",
        L: "fld",
        R: "fdr",
        B: "dlr",
        u: "FRL",
        l: "FLD",
        r: "FDR",
        b: "DLR",
        Uv: "FRLv",
        Lv: "FLDv",
        Rv: "FDRv",
        Bv: "DLRv",
        D: "D",
        F: "F",
        BL: "L",
        BR: "R"
      };
      tetraminxFamilyMap = {
        U: "FRL",
        L: "FLD",
        R: "FDR",
        B: "DLR",
        u: "frl",
        l: "fld",
        r: "fdr",
        b: "dlr",
        Uv: "FRLv",
        Lv: "FLDv",
        Rv: "FDRv",
        Bv: "DLRv",
        D: "D",
        F: "F",
        BL: "L",
        BR: "R",
        d: "d",
        f: "f",
        bl: "l",
        br: "r"
      };
      pyraminxFamilyMapWCA = {
        U: "FRL",
        L: "FLD",
        R: "FDR",
        B: "DLR"
      };
      pyraminxExternalQuantumY = new QuantumMove("y");
      pyraminxInternalQuantumY = new QuantumMove("Dv");
      PyraminxNotationMapper = class {
        constructor(child) {
          this.child = child;
          this.wcaHack = false;
          this.map = pyraminxFamilyMap;
        }
        notationToInternal(move) {
          if (this.wcaHack && move.innerLayer === 2 && move.outerLayer === null) {
            const newFamilyWCA = pyraminxFamilyMapWCA[move.family];
            if (newFamilyWCA) {
              return new Move(new QuantumMove(newFamilyWCA, move.innerLayer, move.outerLayer), move.amount);
            }
          }
          const newFamily = this.map[move.family];
          if (newFamily) {
            return new Move(new QuantumMove(newFamily, move.innerLayer, move.outerLayer), move.amount);
          } else if (pyraminxExternalQuantumY.isIdentical(move.quantum)) {
            return new Move(pyraminxInternalQuantumY, -move.amount);
          } else {
            return null;
          }
        }
        notationToExternal(move) {
          if (this.wcaHack && move.innerLayer === 2 && move.outerLayer === null) {
            for (const [external, internal] of Object.entries(pyraminxFamilyMapWCA)) {
              if (this.child.spinmatch(move.family, internal)) {
                return new Move(new QuantumMove(external, move.innerLayer, move.outerLayer), move.amount);
              }
            }
          }
          for (const [external, internal] of Object.entries(this.map)) {
            if (this.child.spinmatch(move.family, internal)) {
              return new Move(new QuantumMove(external, move.innerLayer, move.outerLayer), move.amount);
            }
          }
          if (pyraminxInternalQuantumY.isIdentical(move.quantum)) {
            return new Move(pyraminxExternalQuantumY, -move.amount);
          } else {
            return null;
          }
        }
      };
      TetraminxNotationMapper = class extends PyraminxNotationMapper {
        constructor(child) {
          super(child);
          this.map = tetraminxFamilyMap;
        }
      };
      skewbFamilyMap = {
        U: "UBL",
        UL: "ULF",
        F: "UFR",
        UR: "URB",
        B: "DBL",
        D: "DFR",
        L: "DLF",
        R: "DRB",
        Uv: "UBLv",
        ULv: "ULFv",
        Fv: "UFRv",
        URv: "URBv",
        Bv: "DBLv",
        Dv: "DFRv",
        Lv: "DLFv",
        Rv: "DRBv"
      };
      skewbExternalQuantumX = new QuantumMove("x");
      skewbInternalQuantumX = new QuantumMove("Rv");
      skewbExternalQuantumY = new QuantumMove("y");
      skewbInternalQuantumY = new QuantumMove("Uv");
      skewbExternalQuantumZ = new QuantumMove("z");
      skewbInternalQuantumZ = new QuantumMove("Fv");
      SkewbNotationMapper = class {
        constructor(child) {
          this.child = child;
        }
        notationToInternal(move) {
          if (move.innerLayer || move.outerLayer) {
            return null;
          }
          const newFamily = skewbFamilyMap[move.family];
          if (newFamily) {
            return new Move(new QuantumMove(newFamily, move.outerLayer, move.innerLayer), move.amount);
          }
          if (skewbExternalQuantumX.isIdentical(move.quantum)) {
            return new Move(skewbInternalQuantumX, move.amount);
          }
          if (skewbExternalQuantumY.isIdentical(move.quantum)) {
            return new Move(skewbInternalQuantumY, move.amount);
          }
          if (skewbExternalQuantumZ.isIdentical(move.quantum)) {
            return new Move(skewbInternalQuantumZ, move.amount);
          }
          return null;
        }
        notationToExternal(move) {
          for (const [external, internal] of Object.entries(skewbFamilyMap)) {
            if (this.child.spinmatch(move.family, internal)) {
              return new Move(new QuantumMove(external, move.innerLayer, move.outerLayer), move.amount);
            }
          }
          if (skewbInternalQuantumX.isIdentical(move.quantum)) {
            return new Move(skewbExternalQuantumX, move.amount);
          }
          if (skewbInternalQuantumY.isIdentical(move.quantum)) {
            return new Move(skewbExternalQuantumY, move.amount);
          }
          if (skewbInternalQuantumZ.isIdentical(move.quantum)) {
            return new Move(skewbExternalQuantumZ, move.amount);
          }
          return null;
        }
      };
      PuzzleGeometryFullOptions = class {
        constructor(options = {}) {
          this.verbosity = 0;
          this.allMoves = false;
          this.vertexMoves = false;
          this.addRotations = false;
          this.moveList = null;
          this.fixedOrientation = false;
          this.fixedPieceType = null;
          this.orientCenters = false;
          this.includeCornerOrbits = true;
          this.includeCenterOrbits = true;
          this.includeEdgeOrbits = true;
          this.excludeOrbits = [];
          this.optimizeOrbits = false;
          this.grayCorners = false;
          this.grayCenters = false;
          this.grayEdges = false;
          this.puzzleOrientation = null;
          this.puzzleOrientations = null;
          this.scrambleAmount = 0;
          Object.assign(this, options);
        }
      };
      zeroCache = [];
      iotaCache = [];
      Perm = class {
        constructor(a) {
          this.n = a.length;
          this.p = a;
        }
        toString() {
          return "Perm[" + this.p.join(" ") + "]";
        }
        mul(p2) {
          const c = Array(this.n);
          for (let i2 = 0; i2 < this.n; i2++) {
            c[i2] = p2.p[this.p[i2]];
          }
          return new Perm(c);
        }
        rmul(p2) {
          const c = Array(this.n);
          for (let i2 = 0; i2 < this.n; i2++) {
            c[i2] = this.p[p2.p[i2]];
          }
          return new Perm(c);
        }
        inv() {
          const c = Array(this.n);
          for (let i2 = 0; i2 < this.n; i2++) {
            c[this.p[i2]] = i2;
          }
          return new Perm(c);
        }
        compareTo(p2) {
          for (let i2 = 0; i2 < this.n; i2++) {
            if (this.p[i2] !== p2.p[i2]) {
              return this.p[i2] - p2.p[i2];
            }
          }
          return 0;
        }
        toGap() {
          const cyc = new Array();
          const seen = new Array(this.n);
          for (let i2 = 0; i2 < this.p.length; i2++) {
            if (seen[i2] || this.p[i2] === i2) {
              continue;
            }
            const incyc = new Array();
            for (let j = i2; !seen[j]; j = this.p[j]) {
              incyc.push(1 + j);
              seen[j] = true;
            }
            cyc.push("(" + incyc.join(",") + ")");
          }
          return cyc.join("");
        }
        order() {
          let r2 = 1;
          const seen = new Array(this.n);
          for (let i2 = 0; i2 < this.p.length; i2++) {
            if (seen[i2] || this.p[i2] === i2) {
              continue;
            }
            let cs = 0;
            for (let j = i2; !seen[j]; j = this.p[j]) {
              cs++;
              seen[j] = true;
            }
            r2 = lcm(r2, cs);
          }
          return r2;
        }
      };
      PGOrbitDef = class {
        constructor(size, mod) {
          this.size = size;
          this.mod = mod;
        }
        reassemblySize() {
          return factorial(this.size) * Math.pow(this.mod, this.size);
        }
      };
      PGOrbitsDef = class {
        constructor(orbitnames, orbitdefs, solved, movenames, moveops) {
          this.orbitnames = orbitnames;
          this.orbitdefs = orbitdefs;
          this.solved = solved;
          this.movenames = movenames;
          this.moveops = moveops;
        }
        transformToKPuzzle(t) {
          const mp = {};
          for (let j = 0; j < this.orbitnames.length; j++) {
            mp[this.orbitnames[j]] = t.orbits[j].toKPuzzle();
          }
          return mp;
        }
        static transformToKPuzzle(orbitnames, t) {
          const mp = {};
          for (let j = 0; j < orbitnames.length; j++) {
            mp[orbitnames[j]] = t.orbits[j].toKPuzzle();
          }
          return mp;
        }
        toKsolve(name, mapper = new NullMapper()) {
          const result = [];
          result.push("Name " + name);
          result.push("");
          for (let i2 = 0; i2 < this.orbitnames.length; i2++) {
            result.push(`Set ${this.orbitnames[i2]} ${this.orbitdefs[i2].size} ${this.orbitdefs[i2].mod}`);
          }
          result.push("");
          result.push("Solved");
          for (let i2 = 0; i2 < this.orbitnames.length; i2++) {
            this.solved.orbits[i2].appendDefinition(result, this.orbitnames[i2], false, false);
          }
          result.push("End");
          for (let i2 = 0; i2 < this.movenames.length; i2++) {
            result.push("");
            let name2 = externalName(mapper, this.movenames[i2]);
            let doinv = false;
            if (name2[name2.length - 1] === "'") {
              doinv = true;
              name2 = name2.substring(0, name2.length - 1);
            }
            result.push("Move " + name2);
            for (let j = 0; j < this.orbitnames.length; j++) {
              if (doinv) {
                this.moveops[i2].orbits[j].inv().appendDefinition(result, this.orbitnames[j], true);
              } else {
                this.moveops[i2].orbits[j].appendDefinition(result, this.orbitnames[j], true);
              }
            }
            result.push("End");
          }
          return result;
        }
        toKPuzzle(includemoves) {
          const orbits = {};
          const start = {};
          for (let i2 = 0; i2 < this.orbitnames.length; i2++) {
            orbits[this.orbitnames[i2]] = {
              numPieces: this.orbitdefs[i2].size,
              orientations: this.orbitdefs[i2].mod
            };
            start[this.orbitnames[i2]] = this.solved.orbits[i2].toKPuzzle();
          }
          const moves = {};
          if (includemoves) {
            for (let i2 = 0; i2 < this.movenames.length; i2++) {
              moves[this.movenames[i2]] = this.transformToKPuzzle(this.moveops[i2]);
            }
          }
          return { name: "PG3D", orbits, startPieces: start, moves };
        }
        optimize() {
          const neworbitnames = [];
          const neworbitdefs = [];
          const newsolved = [];
          const newmoveops = [];
          for (let j = 0; j < this.moveops.length; j++) {
            newmoveops.push([]);
          }
          for (let i2 = 0; i2 < this.orbitdefs.length; i2++) {
            const om = this.orbitdefs[i2].mod;
            const n = this.orbitdefs[i2].size;
            const du = new DisjointUnion(n);
            const changed = new Array(this.orbitdefs[i2].size);
            for (let k = 0; k < n; k++) {
              changed[k] = false;
            }
            for (let j = 0; j < this.moveops.length; j++) {
              for (let k = 0; k < n; k++) {
                if (this.moveops[j].orbits[i2].perm[k] !== k || this.moveops[j].orbits[i2].ori[k] !== 0) {
                  changed[k] = true;
                  du.union(k, this.moveops[j].orbits[i2].perm[k]);
                }
              }
            }
            let keepori = true;
            if (om > 1) {
              keepori = false;
              const duo = new DisjointUnion(this.orbitdefs[i2].size * om);
              for (let j = 0; j < this.moveops.length; j++) {
                for (let k = 0; k < n; k++) {
                  if (this.moveops[j].orbits[i2].perm[k] !== k || this.moveops[j].orbits[i2].ori[k] !== 0) {
                    for (let o2 = 0; o2 < om; o2++) {
                      duo.union(k * om + o2, this.moveops[j].orbits[i2].perm[k] * om + (o2 + this.moveops[j].orbits[i2].ori[k]) % om);
                    }
                  }
                }
              }
              for (let j = 0; !keepori && j < n; j++) {
                for (let o2 = 1; o2 < om; o2++) {
                  if (duo.find(j * om) === duo.find(j * om + o2)) {
                    keepori = true;
                  }
                }
              }
              for (let j = 0; !keepori && j < n; j++) {
                for (let k = 0; k < j; k++) {
                  if (this.solved.orbits[i2].perm[j] === this.solved.orbits[i2].perm[k]) {
                    keepori = true;
                  }
                }
              }
            }
            let nontriv = -1;
            let multiple = false;
            for (let j = 0; j < this.orbitdefs[i2].size; j++) {
              if (changed[j]) {
                const h = du.find(j);
                if (nontriv < 0) {
                  nontriv = h;
                } else if (nontriv !== h) {
                  multiple = true;
                }
              }
            }
            for (let j = 0; j < this.orbitdefs[i2].size; j++) {
              if (!changed[j]) {
                continue;
              }
              const h = du.find(j);
              if (h !== j) {
                continue;
              }
              const no = [];
              const on = [];
              let nv = 0;
              for (let k = 0; k < this.orbitdefs[i2].size; k++) {
                if (du.find(k) === j) {
                  no[nv] = k;
                  on[k] = nv;
                  nv++;
                }
              }
              if (multiple) {
                neworbitnames.push(`${this.orbitnames[i2]}_p${j}`);
              } else {
                neworbitnames.push(this.orbitnames[i2]);
              }
              if (keepori) {
                neworbitdefs.push(new PGOrbitDef(nv, this.orbitdefs[i2].mod));
                newsolved.push(this.solved.orbits[i2].remapVS(no, nv));
                for (let k = 0; k < this.moveops.length; k++) {
                  newmoveops[k].push(this.moveops[k].orbits[i2].remap(no, on, nv));
                }
              } else {
                neworbitdefs.push(new PGOrbitDef(nv, 1));
                newsolved.push(this.solved.orbits[i2].remapVS(no, nv).killOri());
                for (let k = 0; k < this.moveops.length; k++) {
                  newmoveops[k].push(this.moveops[k].orbits[i2].remap(no, on, nv).killOri());
                }
              }
            }
          }
          return new PGOrbitsDef(neworbitnames, neworbitdefs, new VisibleState(newsolved), this.movenames, newmoveops.map((_2) => new PGTransform(_2)));
        }
        scramble(n) {
          const pool = [];
          for (let i2 = 0; i2 < this.moveops.length; i2++) {
            pool[i2] = this.moveops[i2];
          }
          for (let i2 = 0; i2 < pool.length; i2++) {
            const j = Math.floor(Math.random() * pool.length);
            const t = pool[i2];
            pool[i2] = pool[j];
            pool[j] = t;
          }
          if (n < pool.length) {
            n = pool.length;
          }
          for (let i2 = 0; i2 < n; i2++) {
            const ri = Math.floor(Math.random() * pool.length);
            const rj = Math.floor(Math.random() * pool.length);
            const rm = Math.floor(Math.random() * this.moveops.length);
            pool[ri] = pool[ri].mul(pool[rj]).mul(this.moveops[rm]);
            if (Math.random() < 0.1) {
              pool[ri] = pool[ri].mul(this.moveops[rm]);
            }
          }
          let s = pool[0];
          for (let i2 = 1; i2 < pool.length; i2++) {
            s = s.mul(pool[i2]);
          }
          this.solved = this.solved.mul(s);
        }
        reassemblySize() {
          let n = 1;
          for (let i2 = 0; i2 < this.orbitdefs.length; i2++) {
            n *= this.orbitdefs[i2].reassemblySize();
          }
          return n;
        }
      };
      _PGOrbit = class {
        constructor(perm, ori, orimod) {
          this.perm = perm;
          this.ori = ori;
          this.orimod = orimod;
        }
        static e(n, mod) {
          return new _PGOrbit(iota(n), zeros(n), mod);
        }
        mul(b) {
          const n = this.perm.length;
          const newPerm = new Array(n);
          if (this.orimod === 1) {
            for (let i2 = 0; i2 < n; i2++) {
              newPerm[i2] = this.perm[b.perm[i2]];
            }
            return new _PGOrbit(newPerm, this.ori, this.orimod);
          } else {
            const newOri = new Array(n);
            for (let i2 = 0; i2 < n; i2++) {
              newPerm[i2] = this.perm[b.perm[i2]];
              newOri[i2] = (this.ori[b.perm[i2]] + b.ori[i2]) % this.orimod;
            }
            return new _PGOrbit(newPerm, newOri, this.orimod);
          }
        }
        inv() {
          const n = this.perm.length;
          const newPerm = new Array(n);
          const newOri = new Array(n);
          for (let i2 = 0; i2 < n; i2++) {
            newPerm[this.perm[i2]] = i2;
            newOri[this.perm[i2]] = (this.orimod - this.ori[i2]) % this.orimod;
          }
          return new _PGOrbit(newPerm, newOri, this.orimod);
        }
        equal(b) {
          const n = this.perm.length;
          for (let i2 = 0; i2 < n; i2++) {
            if (this.perm[i2] !== b.perm[i2] || this.ori[i2] !== b.ori[i2]) {
              return false;
            }
          }
          return true;
        }
        killOri() {
          const n = this.perm.length;
          for (let i2 = 0; i2 < n; i2++) {
            this.ori[i2] = 0;
          }
          this.orimod = 1;
          return this;
        }
        toPerm() {
          const o2 = this.orimod;
          if (o2 === 1) {
            return new Perm(this.perm);
          }
          const n = this.perm.length;
          const newPerm = new Array(n * o2);
          for (let i2 = 0; i2 < n; i2++) {
            for (let j = 0; j < o2; j++) {
              newPerm[i2 * o2 + j] = o2 * this.perm[i2] + (this.ori[i2] + j) % o2;
            }
          }
          return new Perm(newPerm);
        }
        identicalPieces() {
          const done = [];
          const n = this.perm.length;
          const r2 = [];
          for (let i2 = 0; i2 < n; i2++) {
            const v = this.perm[i2];
            if (done[v] === void 0) {
              const s = [i2];
              done[v] = true;
              for (let j = i2 + 1; j < n; j++) {
                if (this.perm[j] === v) {
                  s.push(j);
                }
              }
              r2.push(s);
            }
          }
          return r2;
        }
        order() {
          return this.toPerm().order();
        }
        isIdentity() {
          const n = this.perm.length;
          if (this.perm === iota(n) && this.ori === zeros(n)) {
            return true;
          }
          for (let i2 = 0; i2 < n; i2++) {
            if (this.perm[i2] !== i2 || this.ori[i2] !== 0) {
              return false;
            }
          }
          return true;
        }
        zeroOris() {
          const n = this.perm.length;
          if (this.ori === zeros(n)) {
            return true;
          }
          for (let i2 = 0; i2 < n; i2++) {
            if (this.ori[i2] !== 0) {
              return false;
            }
          }
          return true;
        }
        remap(no, on, nv) {
          const newPerm = new Array(nv);
          const newOri = new Array(nv);
          for (let i2 = 0; i2 < nv; i2++) {
            newPerm[i2] = on[this.perm[no[i2]]];
            newOri[i2] = this.ori[no[i2]];
          }
          return new _PGOrbit(newPerm, newOri, this.orimod);
        }
        remapVS(no, nv) {
          const newPerm = new Array(nv);
          const newOri = new Array(nv);
          let nextNew = 0;
          const reassign = [];
          for (let i2 = 0; i2 < nv; i2++) {
            const ov = this.perm[no[i2]];
            if (reassign[ov] === void 0) {
              reassign[ov] = nextNew++;
            }
            newPerm[i2] = reassign[ov];
            newOri[i2] = this.ori[no[i2]];
          }
          return new _PGOrbit(newPerm, newOri, this.orimod);
        }
        appendDefinition(result, name, useVS, concise = true) {
          if (concise && this.isIdentity()) {
            return;
          }
          result.push(name);
          result.push(this.perm.map((_2) => _2 + 1).join(" "));
          if (!this.zeroOris()) {
            if (useVS) {
              const newori = new Array(this.ori.length);
              for (let i2 = 0; i2 < newori.length; i2++) {
                newori[this.perm[i2]] = this.ori[i2];
              }
              result.push(newori.join(" "));
            } else {
              result.push(this.ori.join(" "));
            }
          }
        }
        toKPuzzle() {
          const n = this.perm.length;
          if (this.isIdentity()) {
            if (!_PGOrbit.kcache[n]) {
              _PGOrbit.kcache[n] = { permutation: iota(n), orientation: zeros(n) };
            }
            return _PGOrbit.kcache[n];
          } else {
            return { permutation: this.perm, orientation: this.ori };
          }
        }
      };
      PGOrbit = _PGOrbit;
      PGOrbit.kcache = [];
      PGTransformBase = class {
        constructor(orbits) {
          this.orbits = orbits;
        }
        internalMul(b) {
          const newOrbits = [];
          for (let i2 = 0; i2 < this.orbits.length; i2++) {
            newOrbits.push(this.orbits[i2].mul(b.orbits[i2]));
          }
          return newOrbits;
        }
        internalInv() {
          const newOrbits = [];
          for (const orbit of this.orbits) {
            newOrbits.push(orbit.inv());
          }
          return newOrbits;
        }
        equal(b) {
          for (let i2 = 0; i2 < this.orbits.length; i2++) {
            if (!this.orbits[i2].equal(b.orbits[i2])) {
              return false;
            }
          }
          return true;
        }
        killOri() {
          for (const orbit of this.orbits) {
            orbit.killOri();
          }
          return this;
        }
        toPerm() {
          const perms = new Array();
          let n = 0;
          for (const orbit of this.orbits) {
            const p = orbit.toPerm();
            perms.push(p);
            n += p.n;
          }
          const newPerm = new Array(n);
          n = 0;
          for (const p of perms) {
            for (let j = 0; j < p.n; j++) {
              newPerm[n + j] = n + p.p[j];
            }
            n += p.n;
          }
          return new Perm(newPerm);
        }
        identicalPieces() {
          const r2 = [];
          let n = 0;
          for (const orbit of this.orbits) {
            const o2 = orbit.orimod;
            const s = orbit.identicalPieces();
            for (let j = 0; j < s.length; j++) {
              r2.push(s[j].map((_2) => _2 * o2 + n));
            }
            n += o2 * orbit.perm.length;
          }
          return r2;
        }
        order() {
          let r2 = 1;
          for (const orbit of this.orbits) {
            r2 = lcm(r2, orbit.order());
          }
          return r2;
        }
      };
      PGTransform = class extends PGTransformBase {
        constructor(orbits) {
          super(orbits);
        }
        mul(b) {
          return new PGTransform(this.internalMul(b));
        }
        mulScalar(n) {
          if (n === 0) {
            return this.e();
          }
          let t = this;
          if (n < 0) {
            t = t.inv();
            n = -n;
          }
          while ((n & 1) === 0) {
            t = t.mul(t);
            n >>= 1;
          }
          if (n === 1) {
            return t;
          }
          let s = t;
          let r2 = this.e();
          while (n > 0) {
            if (n & 1) {
              r2 = r2.mul(s);
            }
            if (n > 1) {
              s = s.mul(s);
            }
            n >>= 1;
          }
          return r2;
        }
        inv() {
          return new PGTransform(this.internalInv());
        }
        e() {
          return new PGTransform(this.orbits.map((_2) => PGOrbit.e(_2.perm.length, _2.orimod)));
        }
      };
      VisibleState = class extends PGTransformBase {
        constructor(orbits) {
          super(orbits);
        }
        mul(b) {
          return new VisibleState(this.internalMul(b));
        }
      };
      DisjointUnion = class {
        constructor(n) {
          this.n = n;
          this.heads = new Array(n);
          for (let i2 = 0; i2 < n; i2++) {
            this.heads[i2] = i2;
          }
        }
        find(v) {
          let h = this.heads[v];
          if (this.heads[h] === h) {
            return h;
          }
          h = this.find(this.heads[h]);
          this.heads[v] = h;
          return h;
        }
        union(a, b) {
          const ah = this.find(a);
          const bh = this.find(b);
          if (ah < bh) {
            this.heads[bh] = ah;
          } else if (ah > bh) {
            this.heads[ah] = bh;
          }
        }
      };
      PGPuzzles = {
        "2x2x2": "c f 0",
        "3x3x3": "c f 0.333333333333333",
        "4x4x4": "c f 0.5 f 0",
        "5x5x5": "c f 0.6 f 0.2",
        "6x6x6": "c f 0.666666666666667 f 0.333333333333333 f 0",
        "7x7x7": "c f 0.714285714285714 f 0.428571428571429 f 0.142857142857143",
        "8x8x8": "c f 0.75 f 0.5 f 0.25 f 0",
        "9x9x9": "c f 0.777777777777778 f 0.555555555555556 f 0.333333333333333 f 0.111111111111111",
        "10x10x10": "c f 0.8 f 0.6 f 0.4 f 0.2 f 0",
        "11x11x11": "c f 0.818181818181818 f 0.636363636363636 f 0.454545454545455 f 0.272727272727273 f 0.0909090909090909",
        "12x12x12": "c f 0.833333333333333 f 0.666666666666667 f 0.5 f 0.333333333333333 f 0.166666666666667 f 0",
        "13x13x13": "c f 0.846153846153846 f 0.692307692307692 f 0.538461538461538 f 0.384615384615385 f 0.230769230769231 f 0.0769230769230769",
        "20x20x20": "c f 0 f .1 f .2 f .3 f .4 f .5 f .6 f .7 f .8 f .9",
        "30x30x30": "c f 0 f .066667 f .133333 f .2 f .266667 f .333333 f .4 f .466667 f .533333 f .6 f .666667 f .733333 f .8 f .866667 f .933333",
        "40x40x40": "c f 0 f .05 f .1 f .15 f .2 f .25 f .3 f .35 f .4 f .45 f .5 f .55 f .6 f .65 f .7 f .75 f .8 f .85 f .9 f .95",
        "skewb": "c v 0",
        "master skewb": "c v 0.275",
        "professor skewb": "c v 0 v 0.38",
        "compy cube": "c v 0.915641442663986",
        "helicopter": "c e 0.707106781186547",
        "curvy copter": "c e 0.83",
        "dino": "c v 0.577350269189626",
        "little chop": "c e 0",
        "pyramorphix": "t e 0",
        "mastermorphix": "t e 0.346184634065199",
        "pyraminx": "t v 0.333333333333333 v 1.66666666666667",
        "tetraminx": "t v 0.333333333333333",
        "master pyraminx": "t v 0 v 1 v 2",
        "master tetraminx": "t v 0 v 1",
        "professor pyraminx": "t v -0.2 v 0.6 v 1.4 v 2.2",
        "professor tetraminx": "t v -0.2 v 0.6 v 1.4",
        "Jing pyraminx": "t f 0",
        "master pyramorphix": "t e 0.866025403784437",
        "megaminx": "d f 0.7",
        "gigaminx": "d f 0.64 f 0.82",
        "teraminx": "d f 0.64 f 0.76 f 0.88",
        "petaminx": "d f 0.64 f 0.73 f 0.82 f 0.91",
        "examinx": "d f 0.64 f 0.712 f 0.784 f 0.856 f 0.928",
        "zetaminx": "d f 0.64 f 0.7 f 0.76 f 0.82 f 0.88 f 0.94",
        "yottaminx": "d f 0.64 f 0.6914 f 0.7429 f 0.7943 f 0.8457 f 0.8971 f 0.9486",
        "pentultimate": "d f 0",
        "master pentultimate": "d f 0.1",
        "elite pentultimate": "d f 0 f 0.145905",
        "starminx": "d v 0.937962370425399",
        "starminx 2": "d f 0.23606797749979",
        "pyraminx crystal": "d f 0.447213595499989",
        "chopasaurus": "d v 0",
        "big chop": "d e 0",
        "skewb diamond": "o f 0",
        "FTO": "o f 0.333333333333333",
        "master FTO": "o f 0.5 f 0",
        "Christopher's jewel": "o v 0.577350269189626",
        "octastar": "o e 0",
        "Trajber's octahedron": "o v 0.433012701892219",
        "radio chop": "i f 0",
        "icosamate": "i v 0",
        "icosahedron 2": "i v 0.18759247376021",
        "icosahedron 3": "i v 0.18759247376021 e 0",
        "icosahedron static faces": "i v 0.84",
        "icosahedron moving faces": "i v 0.73",
        "Eitan's star": "i f 0.61803398874989",
        "2x2x2 + dino": "c f 0 v 0.577350269189626",
        "2x2x2 + little chop": "c f 0 e 0",
        "dino + little chop": "c v 0.577350269189626 e 0",
        "2x2x2 + dino + little chop": "c f 0 v 0.577350269189626 e 0",
        "megaminx + chopasaurus": "d f 0.61803398875 v 0",
        "starminx combo": "d f 0.23606797749979 v 0.937962370425399"
      };
      eps = 1e-9;
      Quat = class {
        constructor(a, b, c, d2) {
          this.a = a;
          this.b = b;
          this.c = c;
          this.d = d2;
        }
        mul(q) {
          return new Quat(this.a * q.a - this.b * q.b - this.c * q.c - this.d * q.d, this.a * q.b + this.b * q.a + this.c * q.d - this.d * q.c, this.a * q.c - this.b * q.d + this.c * q.a + this.d * q.b, this.a * q.d + this.b * q.c - this.c * q.b + this.d * q.a);
        }
        toString() {
          return `Q[${this.a},${this.b},${this.c},${this.d}]`;
        }
        dist(q) {
          return Math.hypot(this.a - q.a, this.b - q.b, this.c - q.c, this.d - q.d);
        }
        len() {
          return Math.hypot(this.a, this.b, this.c, this.d);
        }
        cross(q) {
          return new Quat(0, this.c * q.d - this.d * q.c, this.d * q.b - this.b * q.d, this.b * q.c - this.c * q.b);
        }
        dot(q) {
          return this.b * q.b + this.c * q.c + this.d * q.d;
        }
        normalize() {
          const d2 = Math.sqrt(this.dot(this));
          return new Quat(this.a / d2, this.b / d2, this.c / d2, this.d / d2);
        }
        makenormal() {
          return new Quat(0, this.b, this.c, this.d).normalize();
        }
        normalizeplane() {
          const d2 = Math.hypot(this.b, this.c, this.d);
          return new Quat(this.a / d2, this.b / d2, this.c / d2, this.d / d2);
        }
        smul(m) {
          return new Quat(this.a * m, this.b * m, this.c * m, this.d * m);
        }
        sum(q) {
          return new Quat(this.a + q.a, this.b + q.b, this.c + q.c, this.d + q.d);
        }
        sub(q) {
          return new Quat(this.a - q.a, this.b - q.b, this.c - q.c, this.d - q.d);
        }
        angle() {
          return 2 * Math.acos(this.a);
        }
        invrot() {
          return new Quat(this.a, -this.b, -this.c, -this.d);
        }
        det3x3(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
          return a00 * (a11 * a22 - a12 * a21) + a01 * (a12 * a20 - a10 * a22) + a02 * (a10 * a21 - a11 * a20);
        }
        rotateplane(q) {
          const t = q.mul(new Quat(0, this.b, this.c, this.d)).mul(q.invrot());
          t.a = this.a;
          return t;
        }
        orthogonal() {
          const ab = Math.abs(this.b);
          const ac = Math.abs(this.c);
          const ad = Math.abs(this.d);
          if (ab < ac && ab < ad) {
            return this.cross(new Quat(0, 1, 0, 0)).normalize();
          } else if (ac < ab && ac < ad) {
            return this.cross(new Quat(0, 0, 1, 0)).normalize();
          } else {
            return this.cross(new Quat(0, 0, 0, 1)).normalize();
          }
        }
        pointrotation(b) {
          const a = this.normalize();
          b = b.normalize();
          if (a.sub(b).len() < eps) {
            return new Quat(1, 0, 0, 0);
          }
          let h = a.sum(b);
          if (h.len() < eps) {
            h = h.orthogonal();
          } else {
            h = h.normalize();
          }
          const r2 = a.cross(h);
          r2.a = a.dot(h);
          return r2;
        }
        unproject(b) {
          return this.sum(b.smul(-this.dot(b) / (this.len() * b.len())));
        }
        rotatepoint(q) {
          return q.mul(this).mul(q.invrot());
        }
        rotateface(face) {
          return face.map((_2) => _2.rotatepoint(this));
        }
        intersect3(p2, p3) {
          const det = this.det3x3(this.b, this.c, this.d, p2.b, p2.c, p2.d, p3.b, p3.c, p3.d);
          if (Math.abs(det) < eps) {
            return false;
          }
          return new Quat(0, this.det3x3(this.a, this.c, this.d, p2.a, p2.c, p2.d, p3.a, p3.c, p3.d) / det, this.det3x3(this.b, this.a, this.d, p2.b, p2.a, p2.d, p3.b, p3.a, p3.d) / det, this.det3x3(this.b, this.c, this.a, p2.b, p2.c, p2.a, p3.b, p3.c, p3.a) / det);
        }
        side(x) {
          if (x > eps) {
            return 1;
          }
          if (x < -eps) {
            return -1;
          }
          return 0;
        }
        cutface(face) {
          const d2 = this.a;
          let seen = 0;
          let r2 = null;
          for (let i2 = 0; i2 < face.length; i2++) {
            seen |= 1 << this.side(face[i2].dot(this) - d2) + 1;
          }
          if ((seen & 5) === 5) {
            r2 = [];
            const inout = face.map((_2) => this.side(_2.dot(this) - d2));
            for (let s = -1; s <= 1; s += 2) {
              const nface = [];
              for (let k = 0; k < face.length; k++) {
                if (inout[k] === s || inout[k] === 0) {
                  nface.push(face[k]);
                }
                const kk = (k + 1) % face.length;
                if (inout[k] + inout[kk] === 0 && inout[k] !== 0) {
                  const vk = face[k].dot(this) - d2;
                  const vkk = face[kk].dot(this) - d2;
                  const r22 = vk / (vk - vkk);
                  const pt = face[k].smul(1 - r22).sum(face[kk].smul(r22));
                  nface.push(pt);
                }
              }
              r2.push(nface);
            }
          }
          return r2;
        }
        cutfaces(faces) {
          const nfaces = [];
          for (let j = 0; j < faces.length; j++) {
            const face = faces[j];
            const t = this.cutface(face);
            if (t) {
              nfaces.push(t[0]);
              nfaces.push(t[1]);
            } else {
              nfaces.push(face);
            }
          }
          return nfaces;
        }
        faceside(face) {
          const d2 = this.a;
          for (let i2 = 0; i2 < face.length; i2++) {
            const s = this.side(face[i2].dot(this) - d2);
            if (s !== 0) {
              return s;
            }
          }
          throw new Error("Could not determine side of plane in faceside");
        }
        sameplane(p) {
          const a = this.normalize();
          const b = p.normalize();
          return a.dist(b) < eps || a.dist(b.smul(-1)) < eps;
        }
        makecut(r2) {
          return new Quat(r2, this.b, this.c, this.d);
        }
      };
      eps2 = 1e-9;
      FactoredNumber = class {
        constructor() {
          this.mult = [];
        }
        multiply(n) {
          for (let f = 2; f * f <= n; f++) {
            while (n % f === 0) {
              if (this.mult[f] !== void 0) {
                this.mult[f]++;
              } else {
                this.mult[f] = 1;
              }
              n /= f;
            }
          }
          if (n > 1) {
            if (this.mult[n] !== void 0) {
              this.mult[n]++;
            } else {
              this.mult[n] = 1;
            }
          }
        }
        toString() {
          let r2 = "";
          for (let i2 = 0; i2 < this.mult.length; i2++) {
            if (this.mult[i2] !== void 0) {
              if (r2 !== "") {
                r2 += "*";
              }
              r2 += i2;
              if (this.mult[i2] > 1) {
                r2 += `^${this.mult[i2]}`;
              }
            }
          }
          return r2;
        }
      };
      Face = class {
        constructor(q) {
          this.coords = new Array(q.length * 3);
          for (let i2 = 0; i2 < q.length; i2++) {
            this.coords[3 * i2] = q[i2].b;
            this.coords[3 * i2 + 1] = q[i2].c;
            this.coords[3 * i2 + 2] = q[i2].d;
          }
          this.length = q.length;
        }
        get(off) {
          return new Quat(0, this.coords[3 * off], this.coords[3 * off + 1], this.coords[3 * off + 2]);
        }
        centermass() {
          let sx = 0;
          let sy = 0;
          let sz = 0;
          for (let i2 = 0; i2 < this.length; i2++) {
            sx += this.coords[3 * i2];
            sy += this.coords[3 * i2 + 1];
            sz += this.coords[3 * i2 + 2];
          }
          return new Quat(0, sx / this.length, sy / this.length, sz / this.length);
        }
        rotate(q) {
          const a = [];
          for (let i2 = 0; i2 < this.length; i2++) {
            a.push(this.get(i2).rotatepoint(q));
          }
          return new Face(a);
        }
        rotateforward() {
          const a = [];
          for (let i2 = 1; i2 < this.length; i2++) {
            a.push(this.get(i2));
          }
          a.push(this.get(0));
          return new Face(a);
        }
      };
      FaceTree = class {
        constructor(face, left, right) {
          this.face = face;
          this.left = left;
          this.right = right;
        }
        split(q) {
          var _a, _b;
          const t = q.cutface(this.face);
          if (t !== null) {
            if (this.left === void 0) {
              this.left = new FaceTree(t[0]);
              this.right = new FaceTree(t[1]);
            } else {
              this.left = (_a = this.left) == null ? void 0 : _a.split(q);
              this.right = (_b = this.right) == null ? void 0 : _b.split(q);
            }
          }
          return this;
        }
        collect(arr, leftfirst) {
          var _a, _b, _c, _d;
          if (this.left === void 0) {
            arr.push(new Face(this.face));
          } else if (leftfirst) {
            (_a = this.left) == null ? void 0 : _a.collect(arr, false);
            (_b = this.right) == null ? void 0 : _b.collect(arr, true);
          } else {
            (_c = this.right) == null ? void 0 : _c.collect(arr, false);
            (_d = this.left) == null ? void 0 : _d.collect(arr, true);
          }
          return arr;
        }
      };
      eps3 = 1e-9;
      copyright = "PuzzleGeometry 0.1 Copyright 2018 Tomas Rokicki.";
      permissivieMoveParsing = false;
      PuzzleGeometry = class {
        constructor(puzzleDescription, options) {
          this.cmovesbyslice = [];
          this.duplicatedFaces = [];
          this.duplicatedCubies = [];
          this.fixedCubie = -1;
          this.net = [];
          this.colors = [];
          this.faceorder = [];
          this.faceprecedence = [];
          this.notationMapper = new NullMapper();
          this.addNotationMapper = "";
          this.setReidOrder = false;
          const t1 = tstart("genperms");
          this.options = new PuzzleGeometryFullOptions(options);
          if (this.options.verbosity > 0) {
            console.log(this.header("# "));
          }
          this.create(puzzleDescription);
          tend(t1);
        }
        create(puzzleDescription) {
          const { shape, cuts } = puzzleDescription;
          this.moveplanes = [];
          this.moveplanes2 = [];
          this.faces = [];
          this.cubies = [];
          let g = null;
          switch (shape) {
            case "c":
              g = cube();
              break;
            case "o":
              g = octahedron();
              break;
            case "i":
              g = icosahedron();
              break;
            case "t":
              g = tetrahedron();
              break;
            case "d":
              g = dodecahedron();
              break;
            default:
              throw new Error("Bad shape argument: " + shape);
          }
          this.rotations = closure(g);
          if (this.options.verbosity) {
            console.log("# Rotations: " + this.rotations.length);
          }
          const baseplane = g[0];
          this.baseplanerot = uniqueplanes(baseplane, this.rotations);
          const baseplanes = this.baseplanerot.map((_2) => baseplane.rotateplane(_2));
          this.baseplanes = baseplanes;
          this.baseFaceCount = baseplanes.length;
          const net = defaultnets()[baseplanes.length];
          this.net = net;
          this.colors = defaultcolors()[baseplanes.length];
          this.faceorder = defaultfaceorders()[baseplanes.length];
          if (this.options.verbosity > 0) {
            console.log("# Base planes: " + baseplanes.length);
          }
          const baseface = getface(baseplanes);
          const zero = new Quat(0, 0, 0, 0);
          if (this.options.verbosity > 0) {
            console.log("# Face vertices: " + baseface.length);
          }
          const facenormal = baseplanes[0].makenormal();
          const edgenormal = baseface[0].sum(baseface[1]).makenormal();
          const vertexnormal = baseface[0].makenormal();
          const boundary = new Quat(1, facenormal.b, facenormal.c, facenormal.d);
          if (this.options.verbosity > 0) {
            console.log("# Boundary is " + boundary);
          }
          const planerot = uniqueplanes(boundary, this.rotations);
          const planes = planerot.map((_2) => boundary.rotateplane(_2));
          const firstface = getface(planes);
          this.edgedistance = firstface[0].sum(firstface[1]).smul(0.5).dist(zero);
          this.vertexdistance = firstface[0].dist(zero);
          const cutplanes = [];
          const intersects = [];
          let sawface = false;
          let sawedge = false;
          let sawvertex = false;
          for (const cut of cuts) {
            let normal = null;
            let distance = 0;
            switch (cut.cutType) {
              case "f":
                normal = facenormal;
                distance = 1;
                sawface = true;
                break;
              case "v":
                normal = vertexnormal;
                distance = this.vertexdistance;
                sawvertex = true;
                break;
              case "e":
                normal = edgenormal;
                distance = this.edgedistance;
                sawedge = true;
                break;
              default:
                throw new Error("Bad cut argument: " + cut.cutType);
            }
            cutplanes.push(normal.makecut(cut.distance));
            intersects.push(cut.distance < distance);
          }
          if (this.options.addRotations) {
            if (!sawface) {
              cutplanes.push(facenormal.makecut(10));
            }
            if (!sawvertex) {
              cutplanes.push(vertexnormal.makecut(10));
            }
            if (!sawedge) {
              cutplanes.push(edgenormal.makecut(10));
            }
          }
          this.basefaces = [];
          for (const baseplanerot of this.baseplanerot) {
            const face = baseplanerot.rotateface(firstface);
            this.basefaces.push(new Face(face));
          }
          const facenames = [];
          const faceplanes = [];
          const vertexnames = [];
          const edgenames = [];
          const edgesperface = firstface.length;
          function searchaddelement(a, p, name) {
            for (const el of a) {
              if (el[0].dist(p) < eps3) {
                el.push(name);
                return;
              }
            }
            a.push([p, name]);
          }
          for (let i2 = 0; i2 < this.baseplanerot.length; i2++) {
            const face = this.baseplanerot[i2].rotateface(firstface);
            for (let j = 0; j < face.length; j++) {
              const jj = (j + 1) % face.length;
              const midpoint = face[j].sum(face[jj]).smul(0.5);
              searchaddelement(edgenames, midpoint, i2);
            }
          }
          const otherfaces = [];
          for (let i2 = 0; i2 < this.baseplanerot.length; i2++) {
            const face = this.baseplanerot[i2].rotateface(firstface);
            const facelist = [];
            for (let j = 0; j < face.length; j++) {
              const jj = (j + 1) % face.length;
              const midpoint = face[j].sum(face[jj]).smul(0.5);
              const el = edgenames[findelement(edgenames, midpoint)];
              if (i2 === el[1]) {
                facelist.push(el[2]);
              } else if (i2 === el[2]) {
                facelist.push(el[1]);
              } else {
                throw new Error("Could not find edge");
              }
            }
            otherfaces.push(facelist);
          }
          const facenametoindex = {};
          const faceindextoname = [];
          faceindextoname.push(net[0][0]);
          facenametoindex[net[0][0]] = 0;
          faceindextoname[otherfaces[0][0]] = net[0][1];
          facenametoindex[net[0][1]] = otherfaces[0][0];
          for (const neti of net) {
            const f0 = neti[0];
            const fi = facenametoindex[f0];
            if (fi === void 0) {
              throw new Error("Bad edge description; first edge not connected");
            }
            let ii = -1;
            for (let j = 0; j < otherfaces[fi].length; j++) {
              const fn2 = faceindextoname[otherfaces[fi][j]];
              if (fn2 !== void 0 && fn2 === neti[1]) {
                ii = j;
                break;
              }
            }
            if (ii < 0) {
              throw new Error("First element of a net not known");
            }
            for (let j = 2; j < neti.length; j++) {
              if (neti[j] === "") {
                continue;
              }
              const of = otherfaces[fi][(j + ii - 1) % edgesperface];
              const fn2 = faceindextoname[of];
              if (fn2 !== void 0 && fn2 !== neti[j]) {
                throw new Error("Face mismatch in net");
              }
              faceindextoname[of] = neti[j];
              facenametoindex[neti[j]] = of;
            }
          }
          for (let i2 = 0; i2 < faceindextoname.length; i2++) {
            let found = false;
            for (let j = 0; j < this.faceorder.length; j++) {
              if (faceindextoname[i2] === this.faceorder[j]) {
                this.faceprecedence[i2] = j;
                found = true;
                break;
              }
            }
            if (!found) {
              throw new Error("Could not find face " + faceindextoname[i2] + " in face order list " + this.faceorder);
            }
          }
          for (let i2 = 0; i2 < this.baseplanerot.length; i2++) {
            const face = this.baseplanerot[i2].rotateface(firstface);
            const faceplane = boundary.rotateplane(this.baseplanerot[i2]);
            const facename = faceindextoname[i2];
            facenames.push([face, facename]);
            faceplanes.push([faceplane, facename]);
          }
          for (let i2 = 0; i2 < this.baseplanerot.length; i2++) {
            const face = this.baseplanerot[i2].rotateface(firstface);
            const facename = faceindextoname[i2];
            for (let j = 0; j < face.length; j++) {
              const jj = (j + 1) % face.length;
              const midpoint = face[j].sum(face[jj]).smul(0.5);
              const jjj = (j + 2) % face.length;
              const midpoint2 = face[jj].sum(face[jjj]).smul(0.5);
              const e1 = findelement(edgenames, midpoint);
              const e2 = findelement(edgenames, midpoint2);
              searchaddelement(vertexnames, face[jj], [facename, e2, e1]);
            }
          }
          this.swizzler = new FaceNameSwizzler(facenames.map((_2) => _2[1]));
          const sep = this.swizzler.prefixFree ? "" : "_";
          for (let i2 = 0; i2 < edgenames.length; i2++) {
            if (edgenames[i2].length !== 3) {
              throw new Error("Bad length in edge names " + edgenames[i2]);
            }
            let c1 = faceindextoname[edgenames[i2][1]];
            const c2 = faceindextoname[edgenames[i2][2]];
            if (this.faceprecedence[edgenames[i2][1]] < this.faceprecedence[edgenames[i2][2]]) {
              c1 = c1 + sep + c2;
            } else {
              c1 = c2 + sep + c1;
            }
            edgenames[i2] = [edgenames[i2][0], c1];
          }
          for (let i2 = 0; i2 < vertexnames.length; i2++) {
            if (vertexnames[i2].length < 4) {
              throw new Error("Bad length in vertex names");
            }
            let st = 1;
            for (let j = 2; j < vertexnames[i2].length; j++) {
              if (this.faceprecedence[facenametoindex[vertexnames[i2][j][0]]] < this.faceprecedence[facenametoindex[vertexnames[i2][st][0]]]) {
                st = j;
              }
            }
            let r2 = "";
            for (let j = 1; j < vertexnames[i2].length; j++) {
              if (j === 1) {
                r2 = vertexnames[i2][st][0];
              } else {
                r2 = r2 + sep + vertexnames[i2][st][0];
              }
              for (let k = 1; k < vertexnames[i2].length; k++) {
                if (vertexnames[i2][st][1] === vertexnames[i2][k][2]) {
                  st = k;
                  break;
                }
              }
            }
            vertexnames[i2] = [vertexnames[i2][0], r2];
          }
          if (this.options.verbosity > 1) {
            console.log("# Face precedence list: " + this.faceorder.join(" "));
            console.log("# Face names: " + facenames.map((_2) => _2[1]).join(" "));
            console.log("# Edge names: " + edgenames.map((_2) => _2[1]).join(" "));
            console.log("# Vertex names: " + vertexnames.map((_2) => _2[1]).join(" "));
          }
          const geonormals = [];
          for (const faceplane of faceplanes) {
            geonormals.push([faceplane[0].makenormal(), faceplane[1], "f"]);
          }
          for (const edgename of edgenames) {
            geonormals.push([edgename[0].makenormal(), edgename[1], "e"]);
          }
          for (const vertexname of vertexnames) {
            geonormals.push([vertexname[0].makenormal(), vertexname[1], "v"]);
          }
          this.facenames = facenames;
          this.faceplanes = faceplanes;
          this.edgenames = edgenames;
          this.vertexnames = vertexnames;
          this.geonormals = geonormals;
          const geonormalnames = geonormals.map((_2) => _2[1]);
          this.swizzler.setGripNames(geonormalnames);
          if (this.options.verbosity > 0) {
            console.log("# Distances: face 1 edge " + this.edgedistance + " vertex " + this.vertexdistance);
          }
          for (let c = 0; c < cutplanes.length; c++) {
            for (const rotation of this.rotations) {
              const q = cutplanes[c].rotateplane(rotation);
              let wasseen = false;
              for (const moveplane of this.moveplanes) {
                if (q.sameplane(moveplane)) {
                  wasseen = true;
                  break;
                }
              }
              if (!wasseen) {
                this.moveplanes.push(q);
                if (intersects[c]) {
                  this.moveplanes2.push(q);
                }
              }
            }
          }
          let ft = new FaceTree(firstface);
          const tar = this.moveplanes2.slice();
          let rval = 31;
          for (let i2 = 0; i2 < tar.length; i2++) {
            const j = i2 + Math.floor((tar.length - i2) * (rval / 65536));
            ft = ft.split(tar[j]);
            tar[j] = tar[i2];
            rval = (rval * 1657 + 101) % 65536;
          }
          const faces = ft.collect([], true);
          this.faces = faces;
          if (this.options.verbosity > 0) {
            console.log("# Faces is now " + faces.length);
          }
          this.stickersperface = faces.length;
          const simplerot = [];
          const cm = centermassface(firstface);
          for (const rotation of this.rotations) {
            const f = rotation.rotateface(firstface);
            if (cm.dist(centermassface(f)) < eps3) {
              simplerot.push(rotation);
            }
          }
          const finished = new Array(faces.length);
          const sortme = [];
          for (let i2 = 0; i2 < faces.length; i2++) {
            const cm2 = faces[i2].centermass();
            sortme.push([cm.dist(cm2), cm2, i2]);
          }
          sortme.sort((a, b) => a[0] - b[0]);
          for (let ii = 0; ii < faces.length; ii++) {
            const i2 = sortme[ii][2];
            if (!finished[i2]) {
              finished[i2] = true;
              for (const rot of simplerot) {
                const f2 = faces[i2].rotate(rot);
                const cm2 = f2.centermass();
                for (let kk = ii + 1; kk < faces.length; kk++) {
                  if (sortme[kk][0] - sortme[ii][0] > eps3) {
                    break;
                  }
                  const k = sortme[kk][2];
                  if (!finished[k] && cm2.dist(sortme[kk][1]) < eps3) {
                    finished[k] = true;
                    faces[k] = f2;
                    break;
                  }
                }
              }
            }
          }
          this.shortedge = 1e99;
          for (const face of faces) {
            for (let j = 0; j < face.length; j++) {
              const k = (j + 1) % face.length;
              const t = face.get(j).dist(face.get(k));
              if (t < this.shortedge) {
                this.shortedge = t;
              }
            }
          }
          if (this.options.verbosity > 0) {
            console.log("# Short edge is " + this.shortedge);
          }
          if (shape === "c" && sawface && !sawedge && !sawvertex) {
            this.addNotationMapper = "NxNxNCubeMapper";
            this.setReidOrder = true;
          }
          if (shape === "c" && sawvertex && !sawface && !sawedge) {
            this.addNotationMapper = "SkewbMapper";
          }
          if (shape === "t" && (sawvertex || sawface) && !sawedge) {
            this.addNotationMapper = "PyraminxOrTetraminxMapper";
          }
          if (shape === "o" && sawface) {
            this.notationMapper = new FaceRenamingMapper(this.swizzler, new FaceNameSwizzler(["F", "D", "L", "BL", "R", "U", "BR", "B"]));
            if (!sawedge && !sawvertex) {
              this.addNotationMapper = "FTOMapper";
            }
          }
          if (shape === "d" && sawface) {
            this.addNotationMapper = "MegaminxMapper";
            this.notationMapper = new FaceRenamingMapper(this.swizzler, new FaceNameSwizzler([
              "U",
              "F",
              "L",
              "BL",
              "BR",
              "R",
              "FR",
              "FL",
              "DL",
              "B",
              "DR",
              "D"
            ]));
          }
        }
        keyface(face) {
          return this.keyface2(face.centermass());
        }
        keyface2(cm) {
          let s = "";
          const sfcc = String.fromCharCode;
          for (const moveplaneset of this.moveplanesets) {
            if (moveplaneset.length > 0) {
              const dv = cm.dot(moveplaneset[0]);
              let t = 0;
              let b = 1;
              while (b * 2 <= moveplaneset.length) {
                b *= 2;
              }
              for (; b > 0; b >>= 1) {
                if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                  t += b;
                }
              }
              if (t < 47) {
                s = s + sfcc(33 + t);
              } else if (t < 47 + 47 * 47) {
                s = s + sfcc(33 + 47 + Math.floor(t / 47) - 1) + sfcc(33 + t % 47);
              } else if (t < 47 + 47 * 47 + 47 * 47 * 47) {
                s = s + sfcc(33 + 47 + Math.floor((t - 47) / (47 * 47) - 1)) + sfcc(33 + 47 + Math.floor((t - 47) / 47) % 47) + sfcc(33 + t % 47);
              } else {
                throw Error("Too many slices for cubie encoding");
              }
            }
          }
          return s;
        }
        keyface3(face) {
          const cm = face.centermass();
          const r2 = [];
          for (const moveplaneset of this.moveplanesets) {
            if (moveplaneset.length > 0) {
              const dv = cm.dot(moveplaneset[0]);
              let t = 0;
              let b = 1;
              while (b * 2 <= moveplaneset.length) {
                b *= 2;
              }
              for (; b > 0; b >>= 1) {
                if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                  t += b;
                }
              }
              r2.push(t);
            }
          }
          return r2;
        }
        findface(cm) {
          const key = this.keyface2(cm);
          const arr = this.facelisthash.get(key);
          if (arr.length === 1) {
            return arr[0];
          }
          for (let i2 = 0; i2 + 1 < arr.length; i2++) {
            const face2 = this.facelisthash.get(key)[i2];
            if (Math.abs(cm.dist(this.facecentermass[face2])) < eps3) {
              return face2;
            }
          }
          return arr[arr.length - 1];
        }
        project2d(facen, edgen, targvec) {
          const face = this.facenames[facen][0];
          const edgen2 = (edgen + 1) % face.length;
          const plane = this.baseplanes[facen];
          let x0 = face[edgen2].sub(face[edgen]);
          const olen = x0.len();
          x0 = x0.normalize();
          const y0 = x0.cross(plane).normalize();
          let delta = targvec[1].sub(targvec[0]);
          const len = delta.len() / olen;
          delta = delta.normalize();
          const cosr = delta.b;
          const sinr = delta.c;
          const x1 = x0.smul(cosr).sub(y0.smul(sinr)).smul(len);
          const y1 = y0.smul(cosr).sum(x0.smul(sinr)).smul(len);
          const off = new Quat(0, targvec[0].b - x1.dot(face[edgen]), targvec[0].c - y1.dot(face[edgen]), 0);
          return [x1, y1, off];
        }
        allstickers() {
          const t1 = tstart("allstickers");
          this.faces = expandfaces(this.baseplanerot, this.faces);
          if (this.options.verbosity > 0) {
            console.log("# Total stickers is now " + this.faces.length);
          }
          this.facecentermass = new Array(this.faces.length);
          for (let i2 = 0; i2 < this.faces.length; i2++) {
            this.facecentermass[i2] = this.faces[i2].centermass();
          }
          const moveplanesets = [];
          const moveplanenormals = [];
          for (const q of this.moveplanes) {
            const qnormal = q.makenormal();
            let wasseen = false;
            for (const moveplanenormal of moveplanenormals) {
              if (qnormal.sameplane(moveplanenormal.makenormal())) {
                wasseen = true;
              }
            }
            if (!wasseen) {
              moveplanenormals.push(qnormal);
              moveplanesets.push([]);
            }
          }
          for (const q of this.moveplanes2) {
            const qnormal = q.makenormal();
            for (let j = 0; j < moveplanenormals.length; j++) {
              if (qnormal.sameplane(moveplanenormals[j])) {
                moveplanesets[j].push(q);
                break;
              }
            }
          }
          for (let i2 = 0; i2 < moveplanesets.length; i2++) {
            const q = moveplanesets[i2].map((_2) => _2.normalizeplane());
            const goodnormal = moveplanenormals[i2];
            for (let j = 0; j < q.length; j++) {
              if (q[j].makenormal().dist(goodnormal) > eps3) {
                q[j] = q[j].smul(-1);
              }
            }
            q.sort((a, b) => a.a - b.a);
            moveplanesets[i2] = q;
          }
          this.moveplanesets = moveplanesets;
          this.moveplanenormals = moveplanenormals;
          const sizes = moveplanesets.map((_2) => _2.length);
          if (this.options.verbosity > 0) {
            console.log("# Move plane sets: " + sizes);
          }
          const moverotations = [];
          for (let i2 = 0; i2 < moveplanesets.length; i2++) {
            moverotations.push([]);
          }
          for (const q of this.rotations) {
            if (Math.abs(Math.abs(q.a) - 1) < eps3) {
              continue;
            }
            const qnormal = q.makenormal();
            for (let j = 0; j < moveplanesets.length; j++) {
              if (qnormal.sameplane(moveplanenormals[j])) {
                moverotations[j].push(q);
                break;
              }
            }
          }
          this.moverotations = moverotations;
          for (let i2 = 0; i2 < moverotations.length; i2++) {
            const r2 = moverotations[i2];
            const goodnormal = r2[0].makenormal();
            for (let j = 0; j < r2.length; j++) {
              if (goodnormal.dist(r2[j].makenormal()) > eps3) {
                r2[j] = r2[j].smul(-1);
              }
            }
            r2.sort((a, b) => a.angle() - b.angle());
            if (moverotations[i2][0].dot(moveplanenormals[i2]) < 0) {
              r2.reverse();
            }
          }
          const sizes2 = moverotations.map((_2) => 1 + _2.length);
          this.movesetorders = sizes2;
          const movesetgeos = [];
          let gtype = "?";
          for (let i2 = 0; i2 < moveplanesets.length; i2++) {
            const p0 = moveplanenormals[i2];
            let neg = null;
            let pos = null;
            for (const geonormal of this.geonormals) {
              const d2 = p0.dot(geonormal[0]);
              if (Math.abs(d2 - 1) < eps3) {
                pos = [geonormal[1], geonormal[2]];
                gtype = geonormal[2];
              } else if (Math.abs(d2 + 1) < eps3) {
                neg = [geonormal[1], geonormal[2]];
                gtype = geonormal[2];
              }
            }
            if (pos === null || neg === null) {
              throw new Error("Saw positive or negative sides as null");
            }
            movesetgeos.push([
              pos[0],
              pos[1],
              neg[0],
              neg[1],
              1 + moveplanesets[i2].length
            ]);
            if (this.addNotationMapper === "NxNxNCubeMapper" && gtype === "f") {
              this.notationMapper = new NxNxNCubeMapper(1 + moveplanesets[i2].length);
              this.addNotationMapper = "";
            }
            if (this.addNotationMapper === "SkewbMapper" && moveplanesets[0].length === 1) {
              this.notationMapper = new SkewbNotationMapper(this.swizzler);
              this.addNotationMapper = "";
            }
            if (this.addNotationMapper === "PyraminxOrTetraminxMapper") {
              if (moveplanesets[0].length === 2 && moveplanesets[0][0].a === 0.333333333333333 && moveplanesets[0][1].a === 1.66666666666667) {
                this.notationMapper = new PyraminxNotationMapper(this.swizzler);
                this.addNotationMapper = "";
              } else {
                this.notationMapper = new TetraminxNotationMapper(this.swizzler);
                this.addNotationMapper = "";
              }
            }
            if (this.addNotationMapper === "MegaminxMapper" && gtype === "f") {
              if (1 + moveplanesets[i2].length === 3) {
                this.notationMapper = new MegaminxScramblingNotationMapper(this.notationMapper);
              }
              this.addNotationMapper = "";
            }
            if (this.addNotationMapper === "FTOMapper" && gtype === "f") {
              if (1 + moveplanesets[i2].length === 3) {
                this.notationMapper = new FTONotationMapper(this.notationMapper, this.swizzler);
              }
              this.addNotationMapper = "";
            }
          }
          this.movesetgeos = movesetgeos;
          const facelisthash = /* @__PURE__ */ new Map();
          const faces = this.faces;
          for (let i2 = 0; i2 < faces.length; i2++) {
            const face = faces[i2];
            const s = this.keyface(face);
            if (!facelisthash.get(s)) {
              facelisthash.set(s, [i2]);
            } else {
              const arr = facelisthash.get(s);
              arr.push(i2);
              if (arr.length === this.baseFaceCount) {
                if (this.options.verbosity > 0) {
                  console.log("# Splitting core.");
                }
                for (let suff = 0; suff < arr.length; suff++) {
                  const s2 = s + " " + suff;
                  facelisthash.set(s2, [arr[suff]]);
                }
              }
            }
          }
          this.facelisthash = facelisthash;
          if (this.options.verbosity > 0) {
            console.log("# Cubies: " + facelisthash.size);
          }
          const cubies = [];
          const facetocubie = [];
          const facetoord = [];
          for (const facelist of facelisthash.values()) {
            if (facelist.length === this.baseFaceCount) {
              continue;
            }
            if (facelist.length > 1) {
              const cm = facelist.map((_2) => faces[_2].centermass());
              const cmall = centermassface(cm);
              for (let looplimit = 0; facelist.length > 2; looplimit++) {
                let changed = false;
                for (let i2 = 0; i2 < facelist.length; i2++) {
                  const j = (i2 + 1) % facelist.length;
                  if (cmall.dot(cm[i2].cross(cm[j])) < 0) {
                    const u = cm[i2];
                    cm[i2] = cm[j];
                    cm[j] = u;
                    const v = facelist[i2];
                    facelist[i2] = facelist[j];
                    facelist[j] = v;
                    changed = true;
                  }
                }
                if (!changed) {
                  break;
                }
                if (looplimit > 1e3) {
                  throw new Error("Bad epsilon math; too close to border");
                }
              }
              let mini = 0;
              let minf = facelist[mini];
              for (let i2 = 1; i2 < facelist.length; i2++) {
                const temp = facelist[i2];
                if (this.faceprecedence[this.getfaceindex(temp)] < this.faceprecedence[this.getfaceindex(minf)]) {
                  mini = i2;
                  minf = temp;
                }
              }
              if (mini !== 0) {
                const ofacelist = facelist.slice();
                for (let i2 = 0; i2 < facelist.length; i2++) {
                  facelist[i2] = ofacelist[(mini + i2) % facelist.length];
                }
              }
            }
            for (let j = 0; j < facelist.length; j++) {
              const k = facelist[j];
              facetocubie[k] = cubies.length;
              facetoord[k] = j;
            }
            cubies.push(facelist);
          }
          this.cubies = cubies;
          this.facetocubie = facetocubie;
          this.facetoord = facetoord;
          const typenames = ["?", "CENTERS", "EDGES", "CORNERS", "C4RNER", "C5RNER"];
          const cubiesetnames = [];
          const cubietypecounts = [0, 0, 0, 0, 0, 0];
          const orbitoris = [];
          const seen = [];
          let cubiesetnum = 0;
          const cubiesetnums = [];
          const cubieordnums = [];
          const cubieords = [];
          const cubievaluemap = [];
          const getcolorkey = (cubienum) => {
            return cubies[cubienum].map((_2) => this.getfaceindex(_2)).join(" ");
          };
          const cubiesetcubies = [];
          for (let i2 = 0; i2 < cubies.length; i2++) {
            if (seen[i2]) {
              continue;
            }
            const cubie = cubies[i2];
            if (cubie.length === 0) {
              continue;
            }
            const cubiekeymap = {};
            let cubievalueid = 0;
            cubieords.push(0);
            cubiesetcubies.push([]);
            const facecnt = cubie.length;
            const typectr = cubietypecounts[facecnt]++;
            let typename = typenames[facecnt];
            if (typename === void 0 || facecnt === this.baseFaceCount) {
              typename = "CORE";
            }
            typename = typename + (typectr === 0 ? "" : typectr + 1);
            cubiesetnames[cubiesetnum] = typename;
            orbitoris[cubiesetnum] = facecnt;
            const queue = [i2];
            let qg = 0;
            seen[i2] = true;
            while (qg < queue.length) {
              const cind = queue[qg++];
              const cubiecolorkey = getcolorkey(cind);
              if (cubie.length > 1 || cubiekeymap[cubiecolorkey] === void 0) {
                cubiekeymap[cubiecolorkey] = cubievalueid++;
              }
              cubievaluemap[cind] = cubiekeymap[cubiecolorkey];
              cubiesetnums[cind] = cubiesetnum;
              cubiesetcubies[cubiesetnum].push(cind);
              cubieordnums[cind] = cubieords[cubiesetnum]++;
              if (queue.length < this.rotations.length) {
                const cm = this.facecentermass[cubies[cind][0]];
                for (const moverotation of moverotations) {
                  const tq = this.facetocubie[this.findface(cm.rotatepoint(moverotation[0]))];
                  if (!seen[tq]) {
                    queue.push(tq);
                    seen[tq] = true;
                  }
                }
              }
            }
            cubiesetnum++;
          }
          if (this.setReidOrder && 4 <= this.stickersperface && this.stickersperface <= 9) {
            const reidorder = [
              [
                "UF",
                "UR",
                "UB",
                "UL",
                "DF",
                "DR",
                "DB",
                "DL",
                "FR",
                "FL",
                "BR",
                "BL"
              ],
              ["UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"],
              ["U", "L", "F", "R", "B", "D"]
            ];
            const reidmap = {};
            for (const cubie of reidorder) {
              for (let j = 0; j < cubie.length; j++) {
                let mask = 0;
                for (let k = 0; k < cubie[j].length; k++) {
                  mask |= 1 << cubie[j].charCodeAt(k) - 65;
                }
                reidmap[mask] = j;
              }
            }
            for (const cubieset of cubiesetcubies) {
              for (const cubienum of cubieset) {
                let mask = 0;
                for (const cubie of cubies[cubienum]) {
                  mask |= 1 << this.facenames[this.getfaceindex(cubie)][1].charCodeAt(0) - 65;
                }
                cubieordnums[cubienum] = reidmap[mask];
              }
            }
          }
          this.cubiesetnums = cubiesetnums;
          this.cubieordnums = cubieordnums;
          this.cubiesetnames = cubiesetnames;
          this.cubieords = cubieords;
          this.orbitoris = orbitoris;
          this.cubievaluemap = cubievaluemap;
          this.cubiesetcubies = cubiesetcubies;
          if (this.options.fixedPieceType !== null) {
            for (let i2 = 0; i2 < cubies.length; i2++) {
              if (this.options.fixedPieceType === "v" && cubies[i2].length > 2 || this.options.fixedPieceType === "e" && cubies[i2].length === 2 || this.options.fixedPieceType === "f" && cubies[i2].length === 1) {
                this.fixedCubie = i2;
                break;
              }
            }
            if (this.fixedCubie < 0) {
              throw new Error("Could not find a cubie of type " + this.options.fixedPieceType + " to fix.");
            }
          }
          if (this.options.verbosity > 0) {
            console.log("# Cubie orbit sizes " + cubieords);
          }
          tend(t1);
        }
        unswizzle(mv) {
          const newmv = this.notationMapper.notationToInternal(mv);
          if (newmv === null) {
            return "";
          }
          return this.swizzler.unswizzle(newmv.family);
        }
        stringToBlockMove(mv) {
          const re = RegExp("^(([0-9]+)-)?([0-9]+)?([^0-9]+)([0-9]+'?)?$");
          const p = mv.match(re);
          if (p === null) {
            throw new Error("Bad move passed " + mv);
          }
          const grip = p[4];
          let loslice = void 0;
          let hislice = void 0;
          if (p[2] !== void 0) {
            if (p[3] === void 0) {
              throw new Error("Missing second number in range");
            }
            loslice = parseInt(p[2], 10);
          }
          if (p[3] !== void 0) {
            hislice = parseInt(p[3], 10);
          }
          let amountstr = "1";
          let amount = 1;
          if (p[5] !== void 0) {
            amountstr = p[5];
            if (amountstr[0] === "'") {
              amountstr = "-" + amountstr.substring(1);
            }
            amount = parseInt(amountstr, 10);
          }
          return new Move(new QuantumMove(grip, hislice, loslice), amount);
        }
        parseMove(move) {
          const bm = this.notationMapper.notationToInternal(move);
          if (bm === null) {
            throw new Error("Bad move " + move.family);
          }
          move = bm;
          let grip = move.family;
          let fullrotation = false;
          if (grip.endsWith("v") && grip[0] <= "Z") {
            if (move.innerLayer !== void 0 || move.outerLayer !== void 0) {
              throw new Error("Cannot use a prefix with full cube rotations");
            }
            grip = grip.slice(0, -1);
            fullrotation = true;
          }
          if (grip.endsWith("w") && grip[0] <= "Z") {
            grip = grip.slice(0, -1).toLowerCase();
          }
          let geo;
          let msi = -1;
          const geoname = this.swizzler.unswizzle(grip);
          let firstgrip = false;
          for (let i2 = 0; i2 < this.movesetgeos.length; i2++) {
            const g = this.movesetgeos[i2];
            if (geoname === g[0]) {
              firstgrip = true;
              geo = g;
              msi = i2;
            }
            if (geoname === g[2]) {
              firstgrip = false;
              geo = g;
              msi = i2;
            }
          }
          let loslice = 1;
          let hislice = 1;
          if (grip.toUpperCase() !== grip) {
            hislice = 2;
          }
          if (geo === void 0) {
            throw new Error("Bad grip in move " + move.family);
          }
          if (move.outerLayer !== void 0) {
            loslice = move.outerLayer;
          }
          if (move.innerLayer !== void 0) {
            if (move.outerLayer === void 0) {
              hislice = move.innerLayer;
              if (grip <= "Z") {
                loslice = hislice;
              } else {
                loslice = 1;
              }
            } else {
              hislice = move.innerLayer;
            }
          }
          loslice--;
          hislice--;
          if (fullrotation) {
            loslice = 0;
            hislice = this.moveplanesets[msi].length;
          }
          if (loslice < 0 || loslice > this.moveplanesets[msi].length || hislice < 0 || hislice > this.moveplanesets[msi].length) {
            throw new Error("Bad slice spec " + loslice + " " + hislice + " vs " + this.moveplanesets[msi].length);
          }
          if (!permissivieMoveParsing && loslice === 0 && hislice === this.moveplanesets[msi].length && !fullrotation) {
            throw new Error("! full puzzle rotations must be specified with v suffix.");
          }
          return [void 0, msi, loslice, hislice, firstgrip, move.amount];
        }
        parsemove(mv) {
          const r2 = this.parseMove(this.stringToBlockMove(mv));
          r2[0] = mv;
          return r2;
        }
        genperms() {
          const t1 = tstart("genperms");
          if (this.cmovesbyslice.length > 0) {
            return;
          }
          const cmovesbyslice = [];
          if (this.options.orientCenters) {
            for (let k = 0; k < this.cubies.length; k++) {
              if (this.cubies[k].length === 1) {
                const kk = this.cubies[k][0];
                const i2 = this.getfaceindex(kk);
                if (this.basefaces[i2].centermass().dist(this.facecentermass[kk]) < eps3) {
                  const o2 = this.basefaces[i2].length;
                  for (let m = 1; m < o2; m++) {
                    this.cubies[k].push(this.cubies[k][m - 1]);
                  }
                  this.duplicatedFaces[kk] = o2;
                  this.duplicatedCubies[k] = o2;
                  this.orbitoris[this.cubiesetnums[k]] = o2;
                }
              }
            }
          }
          for (let k = 0; k < this.moveplanesets.length; k++) {
            const moveplaneset = this.moveplanesets[k];
            const slicenum = [];
            const slicecnts = [moveplaneset.length + 1, 0];
            let bhi = 1;
            while (bhi * 2 <= moveplaneset.length) {
              bhi *= 2;
            }
            for (let i2 = 0; i2 < this.faces.length; i2++) {
              let t = 0;
              if (moveplaneset.length > 0) {
                const dv = this.facecentermass[i2].dot(moveplaneset[0]);
                for (let b = bhi; b > 0; b >>= 1) {
                  if (t + b <= moveplaneset.length && dv > moveplaneset[t + b - 1].a) {
                    t += b;
                  }
                }
                t = moveplaneset.length - t;
              }
              slicenum.push(t);
              while (slicecnts.length <= t) {
                slicecnts.push(0);
              }
              slicecnts[t]++;
            }
            const axiscmoves = new Array(slicecnts.length);
            for (let sc = 0; sc < slicecnts.length; sc++) {
              axiscmoves[sc] = [];
            }
            const cubiedone = [];
            for (let i2 = 0; i2 < this.faces.length; i2++) {
              if (slicenum[i2] < 0) {
                continue;
              }
              const b = [this.facetocubie[i2], this.facetoord[i2]];
              let cm = this.facecentermass[i2];
              const ocm = cm;
              let fi2 = i2;
              const sc = slicenum[fi2];
              for (; ; ) {
                slicenum[fi2] = -1;
                const cm2 = cm.rotatepoint(this.moverotations[k][0]);
                if (cm2.dist(ocm) < eps3) {
                  break;
                }
                fi2 = this.findface(cm2);
                b.push(this.facetocubie[fi2], this.facetoord[fi2]);
                cm = cm2;
              }
              if (b.length > 2 && this.options.orientCenters && (this.cubies[b[0]].length === 1 || this.duplicatedCubies[b[0]] > 1)) {
                if (this.facecentermass[i2].dist(this.basefaces[this.getfaceindex(i2)].centermass()) < eps3) {
                  let face1 = this.faces[this.cubies[b[0]][0]];
                  for (let ii = 0; ii < b.length; ii += 2) {
                    const face0 = this.faces[this.cubies[b[ii]][0]];
                    let o2 = -1;
                    for (let jj = 0; jj < face1.length; jj++) {
                      if (face0.get(jj).dist(face1.get(0)) < eps3) {
                        o2 = jj;
                        break;
                      }
                    }
                    if (o2 < 0) {
                      throw new Error("Couldn't find rotation of center faces; ignoring for now.");
                    } else {
                      b[ii + 1] = o2;
                      face1 = face1.rotate(this.moverotations[k][0]);
                    }
                  }
                }
              }
              if (b.length === 2 && this.options.orientCenters) {
                for (let ii = 1; ii < this.movesetorders[k]; ii++) {
                  if (sc === 0) {
                    b.push(b[0], ii);
                  } else {
                    b.push(b[0], (this.movesetorders[k] - ii) % this.movesetorders[k]);
                  }
                }
              }
              if (b.length > 2 && !cubiedone[b[0]]) {
                if (b.length !== 2 * this.movesetorders[k]) {
                  throw new Error("Bad length in perm gen");
                }
                for (const v of b) {
                  axiscmoves[sc].push(v);
                }
              }
              for (let j = 0; j < b.length; j += 2) {
                cubiedone[b[j]] = true;
              }
            }
            for (let kk = 0; kk < axiscmoves.length; kk++) {
              axiscmoves[kk] = axiscmoves[kk].slice();
            }
            cmovesbyslice.push(axiscmoves);
          }
          this.cmovesbyslice = cmovesbyslice;
          if (this.options.moveList) {
            const parsedmovelist = [];
            for (const moveString of this.options.moveList) {
              parsedmovelist.push(this.parsemove(moveString));
            }
            this.parsedmovelist = parsedmovelist;
          }
          this.facelisthash.clear();
          this.facecentermass = [];
          tend(t1);
        }
        getboundarygeometry() {
          return {
            baseplanes: this.baseplanes,
            facenames: this.facenames,
            faceplanes: this.faceplanes,
            vertexnames: this.vertexnames,
            edgenames: this.edgenames,
            geonormals: this.geonormals
          };
        }
        getmovesets(k) {
          const slices = this.moveplanesets[k].length;
          let r2 = [];
          if (this.parsedmovelist !== void 0) {
            for (const parsedmove of this.parsedmovelist) {
              if (parsedmove[1] !== k) {
                continue;
              }
              if (parsedmove[4]) {
                r2.push([parsedmove[2], parsedmove[3]]);
              } else {
                r2.push([slices - parsedmove[3], slices - parsedmove[2]]);
              }
              r2.push(parsedmove[5]);
            }
          } else if (this.options.vertexMoves && !this.options.allMoves) {
            const msg = this.movesetgeos[k];
            if (msg[1] !== msg[3]) {
              for (let i2 = 0; i2 < slices; i2++) {
                if (msg[1] !== "v") {
                  if (this.options.outerBlockMoves) {
                    r2.push([i2 + 1, slices]);
                  } else {
                    r2.push([i2 + 1]);
                  }
                  r2.push(1);
                } else {
                  if (this.options.outerBlockMoves) {
                    r2.push([0, i2]);
                  } else {
                    r2.push([i2, i2]);
                  }
                  r2.push(1);
                }
              }
            }
          } else {
            for (let i2 = 0; i2 <= slices; i2++) {
              if (!this.options.allMoves && i2 + i2 === slices) {
                continue;
              }
              if (this.options.outerBlockMoves) {
                if (i2 + i2 > slices) {
                  r2.push([i2, slices]);
                } else {
                  r2.push([0, i2]);
                }
              } else {
                r2.push([i2, i2]);
              }
              r2.push(1);
            }
          }
          if (this.fixedCubie >= 0) {
            const dep = this.keyface3(this.faces[this.cubies[this.fixedCubie][0]])[k];
            const newr = [];
            for (let i2 = 0; i2 < r2.length; i2 += 2) {
              let o2 = r2[i2];
              if (dep >= o2[0] && dep <= o2[1]) {
                if (o2[0] === 0) {
                  o2 = [o2[1] + 1, slices];
                } else if (slices === o2[1]) {
                  o2 = [0, o2[0] - 1];
                } else {
                  throw Error("fixed cubie option would disconnect move");
                }
              }
              let found = false;
              for (let j = 0; j < newr.length; j += 2) {
                if (newr[j][0] === o2[0] && newr[j][1] === o2[1] && newr[j + 1] === r2[i2 + 1]) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                newr.push(o2);
                newr.push(r2[i2 + 1]);
              }
            }
            r2 = newr;
          }
          return r2;
        }
        graybyori(cubie) {
          let ori = this.cubies[cubie].length;
          if (this.duplicatedCubies[cubie]) {
            ori = 1;
          }
          return ori === 1 && (this.options.grayCenters || !this.options.includeCenterOrbits) || ori === 2 && (this.options.grayEdges || !this.options.includeEdgeOrbits) || ori > 2 && (this.options.grayCorners || !this.options.includeCornerOrbits);
        }
        skipbyori(cubie) {
          let ori = this.cubies[cubie].length;
          if (this.duplicatedCubies[cubie]) {
            ori = 1;
          }
          return ori === 1 && !this.options.includeCenterOrbits || ori === 2 && !this.options.includeEdgeOrbits || ori > 2 && !this.options.includeCornerOrbits;
        }
        skipcubie(fi) {
          return this.skipbyori(fi);
        }
        header(comment) {
          return comment + copyright + "\n" + comment + "\n";
        }
        writegap() {
          const os = this.getOrbitsDef(false);
          const r2 = [];
          const mvs = [];
          for (let i2 = 0; i2 < os.moveops.length; i2++) {
            let movename = "M_" + externalName(this.notationMapper, os.movenames[i2]);
            let doinv = false;
            if (movename[movename.length - 1] === "'") {
              movename = movename.substring(0, movename.length - 1);
              doinv = true;
            }
            mvs.push(movename);
            if (doinv) {
              r2.push(movename + ":=" + os.moveops[i2].toPerm().inv().toGap() + ";");
            } else {
              r2.push(movename + ":=" + os.moveops[i2].toPerm().toGap() + ";");
            }
          }
          r2.push("Gen:=[");
          r2.push(mvs.join(","));
          r2.push("];");
          const ip = os.solved.identicalPieces();
          r2.push("ip:=[" + ip.map((_2) => "[" + _2.map((__) => __ + 1).join(",") + "]").join(",") + "];");
          r2.push("# Size(Group(Gen));");
          r2.push("# Size(Stabilizer(Group(Gen), ip, OnTuplesSets));");
          r2.push("");
          return this.header("# ") + r2.join("\n");
        }
        writeksolve(name = "PuzzleGeometryPuzzle") {
          const od = this.getOrbitsDef(false);
          return this.header("# ") + od.toKsolve(name, this.notationMapper).join("\n");
        }
        writekpuzzle(fortwisty = true, includemoves = true) {
          const od = this.getOrbitsDef(fortwisty, includemoves);
          const r2 = od.toKPuzzle(includemoves);
          if (!r2) {
            throw new Error("Missing definition!");
          }
          r2.moveNotation = new PGNotation(this, od);
          return r2;
        }
        getMoveFromBits(moverange, amount, inverted, axiscmoves, setmoves, movesetorder) {
          const moveorbits = [];
          const perms = [];
          const oris = [];
          for (const len of this.cubieords) {
            perms.push(iota(len));
            oris.push(zeros(len));
          }
          for (let m = moverange[0]; m <= moverange[1]; m++) {
            const slicecmoves = axiscmoves[m];
            for (let j = 0; j < slicecmoves.length; j += 2 * movesetorder) {
              const mperm = slicecmoves.slice(j, j + 2 * movesetorder);
              const setnum = this.cubiesetnums[mperm[0]];
              for (let ii = 0; ii < mperm.length; ii += 2) {
                mperm[ii] = this.cubieordnums[mperm[ii]];
              }
              let inc = 2;
              let oinc = 3;
              if (inverted) {
                inc = mperm.length - 2;
                oinc = mperm.length - 1;
              }
              if (perms[setnum] === iota(this.cubieords[setnum])) {
                perms[setnum] = perms[setnum].slice();
                if (this.orbitoris[setnum] > 1 && !this.options.fixedOrientation) {
                  oris[setnum] = oris[setnum].slice();
                }
              }
              for (let ii = 0; ii < mperm.length; ii += 2) {
                perms[setnum][mperm[(ii + inc) % mperm.length]] = mperm[ii];
                if (this.orbitoris[setnum] > 1 && !this.options.fixedOrientation) {
                  oris[setnum][mperm[ii]] = (mperm[(ii + oinc) % mperm.length] - mperm[(ii + 1) % mperm.length] + 2 * this.orbitoris[setnum]) % this.orbitoris[setnum];
                }
              }
            }
          }
          let lastId = new PGOrbit(iota(24), zeros(24), 1);
          for (let ii = 0; ii < this.cubiesetnames.length; ii++) {
            if (setmoves && !setmoves[ii]) {
              continue;
            }
            if (this.orbitoris[ii] === 1 || this.options.fixedOrientation) {
              if (perms[ii] === iota(lastId.perm.length)) {
                if (perms[ii] !== lastId.perm) {
                  lastId = new PGOrbit(perms[ii], oris[ii], 1);
                }
                moveorbits.push(lastId);
              } else {
                moveorbits.push(new PGOrbit(perms[ii], oris[ii], 1));
              }
            } else {
              const no = new Array(oris[ii].length);
              for (let jj = 0; jj < perms[ii].length; jj++) {
                no[jj] = oris[ii][perms[ii][jj]];
              }
              moveorbits.push(new PGOrbit(perms[ii], no, this.orbitoris[ii]));
            }
          }
          let mv = new PGTransform(moveorbits);
          if (amount !== 1) {
            mv = mv.mulScalar(amount);
          }
          return mv;
        }
        omitSet(name) {
          for (const excludedSet of this.options.excludeOrbits) {
            if (excludedSet === name) {
              return true;
            }
          }
          return false;
        }
        diffmvsets(a, b, slices, neg) {
          for (let i2 = 0; i2 < a.length; i2 += 2) {
            let found = false;
            for (let j = 0; !found && j < b.length; j += 2) {
              if (neg) {
                if (a[i2][0] + b[j][1] === slices && a[i2][1] + b[j][0] === slices && a[i2 + 1] === b[j + 1]) {
                  found = true;
                }
              } else {
                if (a[i2][0] === b[j][0] && a[i2][1] === b[j][1] && a[i2 + 1] === b[j + 1]) {
                  found = true;
                }
              }
            }
            if (!found) {
              return true;
            }
          }
          return false;
        }
        getOrbitsDef(fortwisty, includemoves = true) {
          const setmoves = [];
          if (fortwisty) {
            for (let i2 = 0; i2 < this.cubiesetnames.length; i2++) {
              setmoves.push(1);
            }
          }
          const setnames = [];
          const setdefs = [];
          const mps = [];
          const addrot = [];
          for (let k = 0; k < this.moveplanesets.length; k++) {
            const moveset = this.getmovesets(k);
            mps.push(moveset);
            if (this.options.addRotations) {
              addrot.push(1);
            } else {
              addrot.push(0);
            }
          }
          if (this.options.moveList && this.options.addRotations) {
            for (let i2 = 0; i2 < this.moverotations.length; i2++) {
              addrot[i2] = 0;
            }
            for (let k = 0; k < this.moveplanesets.length; k++) {
              for (let i2 = 0; i2 < this.moverotations.length; i2++) {
                let nn = this.moveplanenormals[k];
                for (let ii = 1; ii * 2 <= this.movesetorders[i2]; ii++) {
                  nn = nn.rotatepoint(this.moverotations[i2][0]);
                  if (addrot[i2] & ii) {
                    continue;
                  }
                  let found = -1;
                  let neg = false;
                  for (let j = 0; j < this.moveplanenormals.length; j++) {
                    if (nn.dist(this.moveplanenormals[j]) < eps3) {
                      found = j;
                      break;
                    } else if (nn.dist(this.moveplanenormals[j].smul(-1)) < eps3) {
                      found = j;
                      neg = true;
                      break;
                    }
                  }
                  if (found < 0) {
                    throw new Error("Could not find rotation");
                  }
                  const cmp = mps[found];
                  if (cmp.length !== mps[k].length || this.moveplanesets[k].length !== this.moveplanesets[found].length || this.diffmvsets(cmp, mps[k], this.moveplanesets[found].length, neg)) {
                    addrot[i2] |= ii;
                  }
                }
              }
            }
            for (let i2 = 0; i2 < this.moverotations.length; i2++) {
              if (addrot[i2] === 0) {
                addrot[i2] = 1;
              } else if (addrot[i2] === 1) {
                if (this.movesetorders[i2] > 3) {
                  addrot[i2] = 2;
                } else {
                  addrot[i2] = 0;
                }
              } else if (addrot[i2] === 3) {
                addrot[i2] = 0;
              } else {
                throw new Error("Impossible addrot val");
              }
            }
          }
          for (let k = 0; k < this.moveplanesets.length; k++) {
            if (addrot[k] !== 0) {
              mps[k].push([0, this.moveplanesets[k].length]);
              mps[k].push(addrot[k]);
            }
          }
          for (let k = 0; k < this.moveplanesets.length; k++) {
            const moveset = mps[k];
            const movesetorder = this.movesetorders[k];
            for (let i2 = 0; i2 < moveset.length; i2 += 2) {
              for (let j = 0; j < i2; j += 2) {
                if (moveset[i2] === moveset[j] && moveset[i2 + 1] === moveset[j + 1]) {
                  throw new Error("Redundant moves in moveset.");
                }
              }
            }
            const allbits = [];
            for (let i2 = 0; i2 < moveset.length; i2 += 2) {
              for (let j = moveset[i2][0]; j <= moveset[i2][1]; j++) {
                allbits[j] = 1;
              }
            }
            const axiscmoves = this.cmovesbyslice[k];
            for (let i2 = 0; i2 < axiscmoves.length; i2++) {
              if (allbits[i2] !== 1) {
                continue;
              }
              const slicecmoves = axiscmoves[i2];
              for (let j = 0; j < slicecmoves.length; j += 2 * movesetorder) {
                if (this.skipcubie(slicecmoves[j])) {
                  continue;
                }
                const ind = this.cubiesetnums[slicecmoves[j]];
                setmoves[ind] = 1;
              }
            }
          }
          for (let i2 = 0; i2 < this.cubiesetnames.length; i2++) {
            if (!setmoves[i2]) {
              continue;
            }
            if (this.omitSet(this.cubiesetnames[i2])) {
              setmoves[i2] = 0;
              continue;
            }
            setnames.push(this.cubiesetnames[i2]);
            setdefs.push(new PGOrbitDef(this.cubieords[i2], this.options.fixedOrientation ? 1 : this.orbitoris[i2]));
          }
          const solved = [];
          for (let i2 = 0; i2 < this.cubiesetnames.length; i2++) {
            if (!setmoves[i2]) {
              continue;
            }
            if (this.omitSet(this.cubiesetnames[i2])) {
              continue;
            }
            const p = [];
            const o2 = [];
            for (let j = 0; j < this.cubieords[i2]; j++) {
              if (fortwisty) {
                p.push(j);
              } else {
                const cubie = this.cubiesetcubies[i2][j];
                p.push(this.cubievaluemap[cubie]);
              }
              o2.push(0);
            }
            solved.push(new PGOrbit(p, o2, this.options.fixedOrientation ? 1 : this.orbitoris[i2]));
          }
          const movenames = [];
          const moves = [];
          if (includemoves) {
            for (let k = 0; k < this.moveplanesets.length; k++) {
              const moveplaneset = this.moveplanesets[k];
              const slices = moveplaneset.length;
              const moveset = mps[k];
              const movesetgeo = this.movesetgeos[k];
              for (let i2 = 0; i2 < moveset.length; i2 += 2) {
                const movebits = moveset[i2];
                const mna = getmovename(movesetgeo, movebits, slices);
                const movename = mna[0];
                const inverted = mna[1];
                if (moveset[i2 + 1] === 1) {
                  movenames.push(movename);
                } else {
                  movenames.push(movename + moveset[i2 + 1]);
                }
                const mv = this.getMoveFromBits(movebits, moveset[i2 + 1], inverted, this.cmovesbyslice[k], setmoves, this.movesetorders[k]);
                moves.push(mv);
              }
            }
          }
          let r2 = new PGOrbitsDef(setnames, setdefs, new VisibleState(solved), movenames, moves);
          if (this.options.optimizeOrbits) {
            r2 = r2.optimize();
          }
          if (this.options.scrambleAmount !== 0) {
            r2.scramble(this.options.scrambleAmount);
          }
          return r2;
        }
        getMovesAsPerms() {
          return this.getOrbitsDef(false).moveops.map((_2) => _2.toPerm());
        }
        showcanon(disp) {
          showcanon(this.getOrbitsDef(false), disp);
        }
        getsolved() {
          const r2 = [];
          for (let i2 = 0; i2 < this.baseFaceCount; i2++) {
            for (let j = 0; j < this.stickersperface; j++) {
              r2.push(i2);
            }
          }
          return new Perm(r2);
        }
        getOrientationRotation(desiredRotation) {
          const [feature1name, [x1, y1, z1]] = desiredRotation[0];
          const direction1 = new Quat(0, x1, -y1, z1);
          const [feature2name, [x2, y2, z2]] = desiredRotation[1];
          const direction2 = new Quat(0, x2, -y2, z2);
          let feature1 = null;
          let feature2 = null;
          const feature1geoname = this.swizzler.unswizzle(feature1name);
          const feature2geoname = this.swizzler.unswizzle(feature2name);
          for (const gn of this.geonormals) {
            if (feature1geoname === gn[1]) {
              feature1 = gn[0];
            }
            if (feature2geoname === gn[1]) {
              feature2 = gn[0];
            }
          }
          if (!feature1) {
            throw new Error("Could not find feature " + feature1name);
          }
          if (!feature2) {
            throw new Error("Could not find feature " + feature2name);
          }
          const r1 = feature1.pointrotation(direction1);
          const feature2rot = feature2.rotatepoint(r1);
          const r2 = feature2rot.unproject(direction1).pointrotation(direction2.unproject(direction1));
          return r2.mul(r1);
        }
        getInitial3DRotation() {
          const basefacecount = this.baseFaceCount;
          let orientationDescription = null;
          if (this.options.puzzleOrientation) {
            orientationDescription = this.options.puzzleOrientation;
          } else if (this.options.puzzleOrientations) {
            orientationDescription = this.options.puzzleOrientations[basefacecount];
          }
          if (!orientationDescription) {
            orientationDescription = defaultOrientations()[basefacecount];
          }
          if (!orientationDescription) {
            throw new Error("No default orientation?");
          }
          return this.getOrientationRotation(orientationDescription);
        }
        generate2dmapping(w = 800, h = 500, trim = 10, threed = false, twodshrink = 0.92) {
          w -= 2 * trim;
          h -= 2 * trim;
          function extendedges(a, n) {
            let dx = a[1][0] - a[0][0];
            let dy = a[1][1] - a[0][1];
            const ang = 2 * Math.PI / n;
            const cosa = Math.cos(ang);
            const sina = Math.sin(ang);
            for (let i2 = 2; i2 < n; i2++) {
              const ndx = dx * cosa + dy * sina;
              dy = dy * cosa - dx * sina;
              dx = ndx;
              a.push([a[i2 - 1][0] + dx, a[i2 - 1][1] + dy]);
            }
          }
          this.genperms();
          const boundarygeo = this.getboundarygeometry();
          const face0 = boundarygeo.facenames[0][0];
          const polyn = face0.length;
          const net = this.net;
          if (net === null) {
            throw new Error("No net?");
          }
          const edges = {};
          let minx = 0;
          let miny = 0;
          let maxx = 1;
          let maxy = 0;
          edges[net[0][0]] = [
            [1, 0],
            [0, 0]
          ];
          extendedges(edges[net[0][0]], polyn);
          for (const neti of net) {
            const f0 = neti[0];
            if (!edges[f0]) {
              throw new Error("Bad edge description; first edge not connected.");
            }
            for (let j = 1; j < neti.length; j++) {
              const f1 = neti[j];
              if (f1 === "" || edges[f1]) {
                continue;
              }
              edges[f1] = [edges[f0][j % polyn], edges[f0][(j + polyn - 1) % polyn]];
              extendedges(edges[f1], polyn);
            }
          }
          for (const f in edges) {
            const es = edges[f];
            for (const esi of es) {
              minx = Math.min(minx, esi[0]);
              maxx = Math.max(maxx, esi[0]);
              miny = Math.min(miny, esi[1]);
              maxy = Math.max(maxy, esi[1]);
            }
          }
          const sc = Math.min(w / (maxx - minx), h / (maxy - miny));
          const xoff = 0.5 * (w - sc * (maxx + minx));
          const yoff = 0.5 * (h - sc * (maxy + miny));
          const geos = {};
          const bg = this.getboundarygeometry();
          const edges2 = {};
          const initv = [
            [sc + xoff, yoff],
            [xoff, yoff]
          ];
          edges2[net[0][0]] = initv;
          extendedges(edges2[net[0][0]], polyn);
          geos[this.facenames[0][1]] = this.project2d(0, 0, [
            new Quat(0, initv[0][0], initv[0][1], 0),
            new Quat(0, initv[1][0], initv[1][1], 0)
          ]);
          const connectat = [];
          connectat[0] = 0;
          for (const neti of net) {
            const f0 = neti[0];
            if (!edges2[f0]) {
              throw new Error("Bad edge description; first edge not connected.");
            }
            let gfi = -1;
            for (let j = 0; j < bg.facenames.length; j++) {
              if (f0 === bg.facenames[j][1]) {
                gfi = j;
                break;
              }
            }
            if (gfi < 0) {
              throw new Error("Could not find first face name " + f0);
            }
            const thisface = bg.facenames[gfi][0];
            for (let j = 1; j < neti.length; j++) {
              const f1 = neti[j];
              if (f1 === "" || edges2[f1]) {
                continue;
              }
              edges2[f1] = [
                edges2[f0][j % polyn],
                edges2[f0][(j + polyn - 1) % polyn]
              ];
              extendedges(edges2[f1], polyn);
              const caf0 = connectat[gfi];
              const mp = thisface[(caf0 + j) % polyn].sum(thisface[(caf0 + j + polyn - 1) % polyn]).smul(0.5);
              const epi = findelement(bg.edgenames, mp);
              const edgename = bg.edgenames[epi][1];
              const el = splitByFaceNames(edgename, this.facenames);
              const gf1 = el[f0 === el[0] ? 1 : 0];
              let gf1i = -1;
              for (let k = 0; k < bg.facenames.length; k++) {
                if (gf1 === bg.facenames[k][1]) {
                  gf1i = k;
                  break;
                }
              }
              if (gf1i < 0) {
                throw new Error("Could not find second face name");
              }
              const otherface = bg.facenames[gf1i][0];
              for (let k = 0; k < otherface.length; k++) {
                const mp2 = otherface[k].sum(otherface[(k + 1) % polyn]).smul(0.5);
                if (mp2.dist(mp) <= eps3) {
                  const p1 = edges2[f0][(j + polyn - 1) % polyn];
                  const p2 = edges2[f0][j % polyn];
                  connectat[gf1i] = k;
                  geos[gf1] = this.project2d(gf1i, k, [
                    new Quat(0, p2[0], p2[1], 0),
                    new Quat(0, p1[0], p1[1], 0)
                  ]);
                  break;
                }
              }
            }
          }
          let hix = 0;
          let hiy = 0;
          const rot = this.getInitial3DRotation();
          for (let face of this.faces) {
            if (threed) {
              face = face.rotate(rot);
            }
            for (let j = 0; j < face.length; j++) {
              hix = Math.max(hix, Math.abs(face.get(j).b));
              hiy = Math.max(hiy, Math.abs(face.get(j).c));
            }
          }
          const sc2 = Math.min(h / hiy / 2, (w - trim) / hix / 4);
          const mappt2d = (fn, q) => {
            if (threed) {
              q = q.rotatepoint(rot);
              const xoff2 = 0.5 * trim + 0.25 * w;
              const xmul = this.baseplanes[fn].rotateplane(rot).d < 0 ? 1 : -1;
              return [
                trim + w * 0.5 + xmul * (xoff2 - q.b * sc2),
                trim + h * 0.5 + q.c * sc2
              ];
            } else {
              const g = geos[this.facenames[fn][1]];
              return [
                trim + twodshrink * q.dot(g[0]) + g[2].b,
                trim + h - twodshrink * q.dot(g[1]) - g[2].c
              ];
            }
          };
          return mappt2d;
        }
        generatesvg(w = 800, h = 500, trim = 10, threed = false) {
          const mappt2d = this.generate2dmapping(w, h, trim, threed);
          function drawedges(id, pts, color) {
            return '<polygon id="' + id + '" class="sticker" style="fill: ' + color + '" points="' + pts.map((p) => p[0] + " " + p[1]).join(" ") + '"/>\n';
          }
          const pos = this.getsolved();
          const colormap = [];
          const facegeo = [];
          for (let i2 = 0; i2 < this.baseFaceCount; i2++) {
            colormap[i2] = this.colors[this.facenames[i2][1]];
          }
          for (let i2 = 0; i2 < this.faces.length; i2++) {
            const face = this.faces[i2];
            const facenum = Math.floor(i2 / this.stickersperface);
            const fg = [];
            for (let j = 0; j < face.length; j++) {
              fg.push(mappt2d(facenum, face.get(j)));
            }
            facegeo.push(fg);
          }
          const svg = [];
          for (let j = 0; j < this.baseFaceCount; j++) {
            svg.push("<g>");
            svg.push("<title>" + this.facenames[j][1] + "</title>\n");
            for (let ii = 0; ii < this.stickersperface; ii++) {
              const i2 = j * this.stickersperface + ii;
              const cubie = this.facetocubie[i2];
              const cubieori = this.facetoord[i2];
              const cubiesetnum = this.cubiesetnums[cubie];
              const cubieord = this.cubieordnums[cubie];
              const color = this.graybyori(cubie) ? "#808080" : colormap[pos.p[i2]];
              let id = this.cubiesetnames[cubiesetnum] + "-l" + cubieord + "-o" + cubieori;
              svg.push(drawedges(id, facegeo[i2], color));
              if (this.duplicatedFaces[i2]) {
                for (let jj = 1; jj < this.duplicatedFaces[i2]; jj++) {
                  id = this.cubiesetnames[cubiesetnum] + "-l" + cubieord + "-o" + jj;
                  svg.push(drawedges(id, facegeo[i2], color));
                }
              }
            }
            svg.push("</g>");
          }
          const html = '<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 500">\n<style type="text/css"><![CDATA[.sticker { stroke: #000000; stroke-width: 1px; }]]></style>\n' + svg.join("") + "</svg>";
          return html;
        }
        get3d(options) {
          const stickers = [];
          const rot = this.getInitial3DRotation();
          const faces = [];
          const maxdist = 0.52 * this.basefaces[0].get(0).len();
          for (let i2 = 0; i2 < this.basefaces.length; i2++) {
            const coords = this.basefaces[i2].rotate(rot);
            const name = this.facenames[i2][1];
            faces.push({ coords: toFaceCoords(coords, maxdist), name });
          }
          for (let i2 = 0; i2 < this.faces.length; i2++) {
            const facenum = Math.floor(i2 / this.stickersperface);
            const cubie = this.facetocubie[i2];
            const cubieori = this.facetoord[i2];
            const cubiesetnum = this.cubiesetnums[cubie];
            const cubieord = this.cubieordnums[cubie];
            let color = this.graybyori(cubie) ? "#808080" : this.colors[this.facenames[facenum][1]];
            if (options == null ? void 0 : options.stickerColors) {
              color = options.stickerColors[i2];
            }
            const coords = this.faces[i2].rotate(rot);
            stickers.push({
              coords: toFaceCoords(coords, maxdist),
              color,
              orbit: this.cubiesetnames[cubiesetnum],
              ord: cubieord,
              ori: cubieori,
              face: facenum
            });
            let fcoords = coords;
            if (this.duplicatedFaces[i2]) {
              const rotdist = fcoords.length / this.duplicatedFaces[i2];
              for (let jj = 1; jj < this.duplicatedFaces[i2]; jj++) {
                for (let k = 0; k < rotdist; k++) {
                  fcoords = fcoords.rotateforward();
                }
                stickers.push({
                  coords: toFaceCoords(fcoords, maxdist),
                  color,
                  orbit: this.cubiesetnames[cubiesetnum],
                  ord: cubieord,
                  ori: jj,
                  face: facenum,
                  isDup: true
                });
              }
            }
          }
          const grips = [];
          for (let i2 = 0; i2 < this.movesetgeos.length; i2++) {
            const msg = this.movesetgeos[i2];
            const order = this.movesetorders[i2];
            for (const gn of this.geonormals) {
              if (msg[0] === gn[1] && msg[1] === gn[2]) {
                grips.push({
                  coordinates: toCoords(gn[0].rotatepoint(rot), 1),
                  quantumMove: new Move(msg[0]),
                  order
                });
                grips.push({
                  coordinates: toCoords(gn[0].rotatepoint(rot).smul(-1), 1),
                  quantumMove: new Move(msg[2]),
                  order
                });
              }
            }
          }
          const twodmapper = this.generate2dmapping(2880, 2160, 0, false, 1);
          const g = function() {
            const irot = rot.invrot();
            return function(facenum, coords) {
              let q = new Quat(0, coords[0] * maxdist, -coords[1] * maxdist, coords[2] * maxdist);
              q = q.rotatepoint(irot);
              const x = twodmapper(facenum, q);
              x[0] /= 2880;
              x[1] = 1 - x[1] / 2160;
              return x;
            };
          }().bind(this);
          return {
            stickers,
            faces,
            axis: grips,
            unswizzle: this.unswizzle.bind(this),
            notationMapper: this.notationMapper,
            textureMapper: { getuv: g }
          };
        }
        getGeoNormal(geoname) {
          const rot = this.getInitial3DRotation();
          const grip = this.swizzler.unswizzle(geoname);
          for (const gn of this.geonormals) {
            if (grip === gn[1]) {
              const r2 = toCoords(gn[0].rotatepoint(rot), 1);
              if (Math.abs(r2[0]) < eps3 && Math.abs(r2[2]) < eps3) {
                r2[0] = 0;
                r2[2] = 1e-6;
              }
              return r2;
            }
          }
          return void 0;
        }
        getfaceindex(facenum) {
          const divid = this.stickersperface;
          return Math.floor(facenum / divid);
        }
        textForTwizzleExplorer() {
          return `Faces ${this.baseplanerot.length}
Stickers per face ${this.stickersperface}
Short edge ${this.shortedge}
Cubies ${this.cubies.length}
Edge distance ${this.edgedistance}
Vertex distance ${this.vertexdistance}`;
        }
        writeSchreierSims(tw) {
          const os = this.getOrbitsDef(false);
          const as = os.reassemblySize();
          tw(`Reassembly size is ${as}`);
          const ss = schreierSims(this.getMovesAsPerms(), tw);
          const r2 = as / ss;
          tw(`Ratio is ${r2}`);
        }
      };
      PGNotation = class {
        constructor(pg, od) {
          this.pg = pg;
          this.cache = {};
          this.orbitNames = od.orbitnames;
        }
        lookupMove(move) {
          const key = this.moveToKeyString(move);
          if (key in this.cache) {
            return this.cache[key];
          }
          const mv = this.pg.parseMove(move);
          if (this.pg.parsedmovelist) {
            let found = false;
            for (const parsedmove of this.pg.parsedmovelist) {
              if (parsedmove[1] === mv[1] && parsedmove[2] === mv[2] && parsedmove[3] === mv[3] && parsedmove[4] === mv[4]) {
                found = true;
              }
            }
            if (!found) {
              return void 0;
            }
          }
          let bits = [mv[2], mv[3]];
          if (!mv[4]) {
            const slices = this.pg.moveplanesets[mv[1]].length;
            bits = [slices - mv[3], slices - mv[2]];
          }
          const pgmv = this.pg.getMoveFromBits(bits, mv[5], !mv[4], this.pg.cmovesbyslice[mv[1]], void 0, this.pg.movesetorders[mv[1]]);
          const r2 = PGOrbitsDef.transformToKPuzzle(this.orbitNames, pgmv);
          this.cache[key] = r2;
          return r2;
        }
        moveToKeyString(move) {
          let r2 = "";
          if (move.outerLayer) {
            r2 = r2 + move.outerLayer + ",";
          }
          if (move.innerLayer) {
            r2 = r2 + move.innerLayer + ",";
          }
          r2 = r2 + move.family + "," + move.amount;
          return r2;
        }
      };
    }
  });

  // node_modules/cubing/dist/esm/2x2x2.kpuzzle.json-JOGUSQ4N.js
  var x2x2_kpuzzle_json_JOGUSQ4N_exports = {};
  __export(x2x2_kpuzzle_json_JOGUSQ4N_exports, {
    cube2x2x2KPuzzle: () => cube2x2x2KPuzzle
  });
  var cube2x2x2KPuzzle;
  var init_x2x2_kpuzzle_json_JOGUSQ4N = __esm({
    "node_modules/cubing/dist/esm/2x2x2.kpuzzle.json-JOGUSQ4N.js"() {
      init_chunk_WO2AXYFE();
      cube2x2x2KPuzzle = {
        name: "2x2x2",
        orbits: {
          CORNERS: { numPieces: 8, orientations: 3 }
        },
        startPieces: {
          CORNERS: {
            permutation: [0, 1, 2, 3, 4, 5, 6, 7],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        },
        moves: {
          U: {
            CORNERS: {
              permutation: [1, 2, 3, 0, 4, 5, 6, 7],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          y: {
            CORNERS: {
              permutation: [1, 2, 3, 0, 7, 4, 5, 6],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          x: {
            CORNERS: {
              permutation: [4, 0, 3, 5, 7, 6, 2, 1],
              orientation: [2, 1, 2, 1, 1, 2, 1, 2]
            }
          },
          L: {
            CORNERS: {
              permutation: [0, 1, 6, 2, 4, 3, 5, 7],
              orientation: [0, 0, 2, 1, 0, 2, 1, 0]
            }
          },
          F: {
            CORNERS: {
              permutation: [3, 1, 2, 5, 0, 4, 6, 7],
              orientation: [1, 0, 0, 2, 2, 1, 0, 0]
            }
          },
          R: {
            CORNERS: {
              permutation: [4, 0, 2, 3, 7, 5, 6, 1],
              orientation: [2, 1, 0, 0, 1, 0, 0, 2]
            }
          },
          B: {
            CORNERS: {
              permutation: [0, 7, 1, 3, 4, 5, 2, 6],
              orientation: [0, 2, 1, 0, 0, 0, 2, 1]
            }
          },
          D: {
            CORNERS: {
              permutation: [0, 1, 2, 3, 5, 6, 7, 4],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0]
            }
          },
          z: {
            CORNERS: {
              permutation: [3, 2, 6, 5, 0, 4, 7, 1],
              orientation: [1, 2, 1, 2, 2, 1, 2, 1]
            }
          }
        }
      };
      cube2x2x2KPuzzle.moves["Rv"] = cube2x2x2KPuzzle.moves["x"];
      cube2x2x2KPuzzle.moves["Uv"] = cube2x2x2KPuzzle.moves["y"];
      cube2x2x2KPuzzle.moves["Fv"] = cube2x2x2KPuzzle.moves["z"];
      cube2x2x2KPuzzle.moves["Lv"] = {
        CORNERS: {
          permutation: [1, 7, 6, 2, 0, 3, 5, 4],
          orientation: [2, 1, 2, 1, 1, 2, 1, 2]
        }
      };
      cube2x2x2KPuzzle.moves["Dv"] = {
        CORNERS: {
          permutation: [3, 0, 1, 2, 5, 6, 7, 4],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        }
      };
      cube2x2x2KPuzzle.moves["Bv"] = {
        CORNERS: {
          permutation: [4, 7, 1, 0, 5, 3, 2, 6],
          orientation: [1, 2, 1, 2, 2, 1, 2, 1]
        }
      };
    }
  });

  // node_modules/cubing/dist/esm/2x2x2.kpuzzle.svg-CQF2FTV7.js
  var x2x2_kpuzzle_svg_CQF2FTV7_exports = {};
  __export(x2x2_kpuzzle_svg_CQF2FTV7_exports, {
    default: () => x2x2_kpuzzle_svg_default
  });
  var x2x2_kpuzzle_svg_default;
  var init_x2x2_kpuzzle_svg_CQF2FTV7 = __esm({
    "node_modules/cubing/dist/esm/2x2x2.kpuzzle.svg-CQF2FTV7.js"() {
      init_chunk_WO2AXYFE();
      x2x2_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 520 394" preserveAspectRatio="xMidYMid meet">
  <title>2x2x2</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="puzzle" transform="translate(5, 5) scale(60)">
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(3.2, 1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(4.4, 2.2)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(3.2, 2.2)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(3.2, 0)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(6.6, 2.2)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(5.4, 2.2)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(2.2, 0)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0, 2.2)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(7.6, 2.2)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(2.2, 1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(2.2, 2.2)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(1, 2.2)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(3.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(3.2, 3.2)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(4.4, 3.2)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(2.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(1, 3.2)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(2.2, 3.2)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(2.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(7.6, 3.2)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0, 3.2)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(3.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(5.4, 3.2)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(6.6, 3.2)" style="fill: #26f"/>
  </g>

</svg>`;
    }
  });

  // node_modules/cubing/dist/esm/3x3x3.kpuzzle.svg-ERSSH66P.js
  var x3x3_kpuzzle_svg_ERSSH66P_exports = {};
  __export(x3x3_kpuzzle_svg_ERSSH66P_exports, {
    default: () => x3x3_kpuzzle_svg_default
  });
  var x3x3_kpuzzle_svg_default;
  var init_x3x3_kpuzzle_svg_ERSSH66P = __esm({
    "node_modules/cubing/dist/esm/3x3x3.kpuzzle.svg-ERSSH66P.js"() {
      init_chunk_WO2AXYFE();
      x3x3_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 518 392" preserveAspectRatio="xMidYMid meet">
  <title>3x3x3</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10 11  -->
<!--        | | | | | | | | | | | |<-  -->
<!--    0 -       . . .                -->
<!--    1 -       . . .                -->
<!--    2 -       . . .                -->
<!--    3 - . . . . . . . . . . . .    -->
<!--    4 - . . . . . . . . . . . .    -->
<!--    5 - . . . . . . . . . . . .    -->
<!--    6 -       . . .                -->
<!--    7 -       . . .                -->
<!--    8 -       . . .                -->

  <g id="puzzle" transform="translate(5,5) scale(40)">
    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(5.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(6.5,3.3)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(5.3,3.3)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(5.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(9.7,3.3)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(8.5,3.3)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(3.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0.1,3.3)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(11.7,3.3)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(3.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(3.3,3.3)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(2.1,3.3)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(5.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(5.3,5.3)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(6.5,5.3)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(3.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(2.1,5.3)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(3.3,5.3)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(3.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(11.7,5.3)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0.1,5.3)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(5.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(8.5,5.3)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(9.7,5.3)" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0"  xlink:href="#sticker" transform="translate(4.3,2.1)" style="fill: white"/>
    <use id="EDGES-l0-o1"  xlink:href="#sticker" transform="translate(4.3,3.3)" style="fill: limegreen"/>

    <use id="EDGES-l1-o0"  xlink:href="#sticker" transform="translate(5.3,1.1)" style="fill: white"/>
    <use id="EDGES-l1-o1"  xlink:href="#sticker" transform="translate(7.5,3.3)" style="fill: red"/>

    <use id="EDGES-l2-o0"  xlink:href="#sticker" transform="translate(4.3,0.1)" style="fill: white"/>
    <use id="EDGES-l2-o1"  xlink:href="#sticker" transform="translate(10.7,3.3)" style="fill: #26f"/>

    <use id="EDGES-l3-o0"  xlink:href="#sticker" transform="translate(3.3,1.1)" style="fill: white"/>
    <use id="EDGES-l3-o1"  xlink:href="#sticker" transform="translate(1.1,3.3)" style="fill: orange"/>

    <use id="EDGES-l4-o0"  xlink:href="#sticker" transform="translate(4.3,6.5)" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" transform="translate(4.3,5.3)" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" transform="translate(5.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" transform="translate(7.5,5.3)" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" transform="translate(4.3,8.5)" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" transform="translate(10.7,5.3)" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" transform="translate(3.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" transform="translate(1.1,5.3)" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" transform="translate(5.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" transform="translate(6.5,4.3)" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" transform="translate(3.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" transform="translate(2.1,4.3)" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" transform="translate(9.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" transform="translate(8.5,4.3)" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" transform="translate(11.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" transform="translate(0.1,4.3)" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l0-o0" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o1" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o2" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o3" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>

    <use id="CENTERS-l1-o0" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
  </g>

</svg>`;
    }
  });

  // node_modules/cubing/dist/esm/3x3x3-ll.kpuzzle.svg-53CBPG5O.js
  var x3x3_ll_kpuzzle_svg_53CBPG5O_exports = {};
  __export(x3x3_ll_kpuzzle_svg_53CBPG5O_exports, {
    default: () => x3x3_ll_kpuzzle_svg_default
  });
  var x3x3_ll_kpuzzle_svg_default;
  var init_x3x3_ll_kpuzzle_svg_53CBPG5O = __esm({
    "node_modules/cubing/dist/esm/3x3x3-ll.kpuzzle.svg-53CBPG5O.js"() {
      init_chunk_WO2AXYFE();
      x3x3_ll_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="288px" height="288px" viewBox="-16 -16 288 288" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>3x3x3 LL</title>
  <defs>
    <g id="sticker">
        <rect x="-10" y="-10" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="3x3x3-LL" stroke="none" stroke-width="4" style="none" stroke-linejoin="round">
    <rect id="CENTERS-l0-o0" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o1" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o2" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o3" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>

    <rect    id="CORNERS-l0-o0" stroke="#000000" style="fill: white" x="160" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l0-o1" stroke="#000000" style="fill: red" points="224 160 252 160 252 252 224 224"></polygon>
    <polygon id="CORNERS-l0-o2" stroke="#000000" style="fill: limegreen" transform="translate(206, 238) scale(1, -1) rotate(-90) translate(-206, -238) " points="192 192 220 192 220 284 192 256"></polygon>
    <rect    id="CORNERS-l1-o0" stroke="#000000" style="fill: white" x="160" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l1-o1" stroke="#000000" style="fill: #26f" transform="translate(206, 18) rotate(-90) translate(-206, -18) " points="192 -28 220 -28 220 64 192 36"></polygon>
    <polygon id="CORNERS-l1-o2" stroke="#000000" style="fill: red" transform="translate(238, 50) scale(1, -1) translate(-238, -50) " points="224 4 252 4 252 96 224 68"></polygon>
    <rect    id="CORNERS-l2-o0" stroke="#000000" style="fill: white" x="32" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l2-o1" stroke="#000000" style="fill: orange" transform="translate(18, 50) scale(-1, -1) translate(-18, -50) " points="4 4 32 4 32 96 4 68"></polygon>
    <polygon id="CORNERS-l2-o2" stroke="#000000" style="fill: #26f" transform="translate(50, 18) scale(1, -1) rotate(90) translate(-50, -18) " points="36 -28 64 -28 64 64 36 36"></polygon>
    <rect    id="CORNERS-l3-o0" stroke="#000000" style="fill: white" x="32" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l3-o1" stroke="#000000" style="fill: limegreen" transform="translate(50, 238) rotate(90) translate(-50, -238) " points="36 192 64 192 64 284 36 256"></polygon>
    <polygon id="CORNERS-l3-o2" stroke="#000000" style="fill: orange" transform="translate(18, 206) scale(-1, 1) translate(-18, -206) " points="4 160 32 160 32 252 4 224"></polygon>

    <rect id="EDGES-l0-o0" stroke="#000000" style="fill: white" x="96" y="160" width="64" height="64"></rect>
    <rect id="EDGES-l0-o1" stroke="#000000" style="fill: limegreen" transform="translate(128, 238) scale(1, -1) rotate(90) translate(-128, -238) " x="114" y="206" width="28" height="64"></rect>
    <rect id="EDGES-l1-o0" stroke="#000000" style="fill: white" x="160" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l1-o1" stroke="#000000" style="fill: red" x="224" y="96" width="28" height="64"></rect>
    <rect id="EDGES-l2-o0" stroke="#000000" style="fill: white" x="96" y="32" width="64" height="64"></rect>
    <rect id="EDGES-l2-o1" stroke="#000000" style="fill: #26f" transform="translate(128, 18) scale(1, -1) rotate(90) translate(-128, -18) " x="114" y="-14" width="28" height="64"></rect>
    <rect id="EDGES-l3-o0" stroke="#000000" style="fill: white" x="32" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l3-o1" stroke="#000000" style="fill: orange" x="4" y="96" width="28" height="64"></rect>

  </g>
  <g style="opacity: 0">
    <!-- CORNERS -->
    <use id="CORNERS-l4-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l4-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l1-o0" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" style="fill: yellow"/>
  </g>
</svg>`;
    }
  });

  // node_modules/cubing/dist/esm/clock.kpuzzle.json-EKWRMHJM.js
  var clock_kpuzzle_json_EKWRMHJM_exports = {};
  __export(clock_kpuzzle_json_EKWRMHJM_exports, {
    clockKPuzzle: () => clockKPuzzle
  });
  var clockKPuzzle;
  var init_clock_kpuzzle_json_EKWRMHJM = __esm({
    "node_modules/cubing/dist/esm/clock.kpuzzle.json-EKWRMHJM.js"() {
      init_chunk_WO2AXYFE();
      clockKPuzzle = {
        name: "Clock",
        orbits: {
          DIALS: { numPieces: 18, orientations: 12 },
          FACES: { numPieces: 18, orientations: 1 },
          FRAME: { numPieces: 1, orientations: 2 }
        },
        startPieces: {
          DIALS: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FACES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17
            ],
            orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          FRAME: { permutation: [0], orientation: [0] }
        },
        moves: {
          UR_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 1, 1, 0, 1, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          DR_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          DL_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          UL_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          U_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [1, 1, 1, 1, 1, 1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          R_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 1, 1, 0, 1, 1, 0, 1, 1, -1, 0, 0, 0, 0, 0, -1, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          D_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, -1, 0, -1]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          L_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          ALL_PLUS_: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 0, -1, 0, 0, 0, -1, 0, -1]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          y2: {
            DIALS: {
              permutation: [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [1] }
          },
          UL: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          UR: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          DL: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          },
          DR: {
            DIALS: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FACES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17
              ],
              orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            FRAME: { permutation: [0], orientation: [0] }
          }
        }
      };
    }
  });

  // node_modules/cubing/dist/esm/clock.kpuzzle.svg-B7TMN3SY.js
  var clock_kpuzzle_svg_B7TMN3SY_exports = {};
  __export(clock_kpuzzle_svg_B7TMN3SY_exports, {
    default: () => clock_kpuzzle_svg_default
  });
  var clock_kpuzzle_svg_default;
  var init_clock_kpuzzle_svg_B7TMN3SY = __esm({
    "node_modules/cubing/dist/esm/clock.kpuzzle.svg-B7TMN3SY.js"() {
      init_chunk_WO2AXYFE();
      clock_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet">
  <title>clock</title>
  <defs>
    <g id="hand" transform="translate(-20, -20)">
      <path d="M19.9995197,2.22079449 L23.8791657,19.0203611 C23.9580836,19.3338406 24,19.6620253 24,20 C24,22.209139 22.209139,24 20,24 C17.790861,24 16,22.209139 16,20 C16,19.6620253 16.0419164,19.3338406 16.1208343,19.0203611 L19.9995197,2.22079449 Z"></path>
    </g>
    <g id="cardinal_hours" style="fill: #FFFFFF">
      <circle cx="0" cy="24" r="2"></circle>
      <circle cx="-24" cy="0" r="2"></circle>
      <circle cx="24" cy="0" r="2"></circle>
      <circle cx="0" cy="-24" r="2"></circle>
    </g>
    <g id="face_hours">
      <g>
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g transform="rotate(30)">
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g  transform="rotate(60)">
        <use xlink:href="#cardinal_hours"/>
      </g>
    </g>
    <g id="pegs" stroke="#000000" style="fill: #FFD000">
      <circle id="PEG4" cx="90" cy="90" r="10"></circle>
      <circle id="PEG3" cx="30" cy="90" r="10"></circle>
      <circle id="PEG2" cx="90" cy="30" r="10"></circle>
      <circle id="PEG1" cx="30" cy="30" r="10"></circle>
    </g>
    <g id="frame" transform="translate(-24, -24)">
      <path stroke="#000000" d="M120,20 C137.495665,20 153.941932,24.4930026 168.247913,32.3881183 C171.855881,30.8514056 175.828512,30 180,30 C196.568542,30 210,43.4314575 210,60 C210,64.1714878 209.148594,68.1441192 207.610077,71.7536009 C215.506997,86.0580678 220,102.504335 220,120 C220,137.495665 215.506997,153.941932 207.611882,168.247913 C209.148594,171.855881 210,175.828512 210,180 C210,196.568542 196.568542,210 180,210 C175.828512,210 171.855881,209.148594 168.246399,207.610077 C153.941932,215.506997 137.495665,220 120,220 C102.504335,220 86.0580678,215.506997 71.7520869,207.611882 C68.1441192,209.148594 64.1714878,210 60,210 C43.4314575,210 30,196.568542 30,180 C30,175.828512 30.8514056,171.855881 32.3899234,168.246399 C24.4930026,153.941932 20,137.495665 20,120 C20,102.504335 24.4930026,86.0580678 32.3881183,71.7520869 C30.8514056,68.1441192 30,64.1714878 30,60 C30,43.4314575 43.4314575,30 60,30 C64.1714878,30 68.1441192,30.8514056 71.7536009,32.3899234 C86.0580678,24.4930026 102.504335,20 120,20 Z"></path>
    </g>
  </defs>
  <g>
    <g transform="translate(24, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o0" style="fill: #0C5093"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l0-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l0-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l0-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l0-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l0-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l0-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l0-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l0-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l0-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l0-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l0-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l0-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l0-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l1-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l1-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l1-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l1-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l1-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l1-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l1-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l1-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l1-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l1-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l1-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l1-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l1-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l2-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l2-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l2-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l2-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l2-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l2-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l2-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l2-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l2-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l2-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l2-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l2-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l2-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l3-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l3-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l3-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l3-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l3-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l3-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l3-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l3-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l3-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l3-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l3-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l3-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l3-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l4-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l4-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l4-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l4-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l4-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l4-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l4-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l4-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l4-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l4-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l4-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l4-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l4-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l5-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l5-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l5-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l5-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l5-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l5-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l5-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l5-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l5-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l5-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l5-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l5-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l5-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l6-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l6-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l6-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l6-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l6-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l6-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l6-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l6-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l6-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l6-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l6-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l6-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l6-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l7-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l7-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l7-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l7-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l7-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l7-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l7-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l7-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l7-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l7-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l7-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l7-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l7-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l8-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l8-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l8-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l8-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l8-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l8-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l8-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l8-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l8-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l8-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l8-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l8-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l8-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
    <g transform="translate(264, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o1" style="fill: #90B8DF"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l9-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l9-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l9-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l9-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l9-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l9-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l9-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l9-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l9-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l9-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l9-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l9-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l9-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l10-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l10-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l10-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l10-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l10-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l10-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l10-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l10-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l10-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l10-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l10-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l10-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l10-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l11-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l11-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l11-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l11-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l11-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l11-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l11-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l11-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l11-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l11-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l11-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l11-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l11-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l12-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l12-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l12-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l12-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l12-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l12-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l12-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l12-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l12-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l12-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l12-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l12-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l12-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l13-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l13-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l13-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l13-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l13-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l13-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l13-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l13-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l13-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l13-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l13-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l13-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l13-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l14-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l14-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l14-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l14-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l14-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l14-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l14-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l14-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l14-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l14-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l14-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l14-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l14-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l15-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l15-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l15-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l15-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l15-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l15-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l15-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l15-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l15-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l15-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l15-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l15-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l15-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l16-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l16-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l16-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l16-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l16-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l16-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l16-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l16-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l16-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l16-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l16-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l16-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l16-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l17-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l17-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l17-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l17-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l17-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l17-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l17-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l17-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l17-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l17-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l17-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l17-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l17-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
  </g>
</svg>`;
    }
  });

  // node_modules/cubing/dist/esm/pyraminx.kpuzzle.svg-QBBMZVDY.js
  var pyraminx_kpuzzle_svg_QBBMZVDY_exports = {};
  __export(pyraminx_kpuzzle_svg_QBBMZVDY_exports, {
    default: () => pyraminx_kpuzzle_svg_default
  });
  var pyraminx_kpuzzle_svg_default;
  var init_pyraminx_kpuzzle_svg_QBBMZVDY = __esm({
    "node_modules/cubing/dist/esm/pyraminx.kpuzzle.svg-QBBMZVDY.js"() {
      init_chunk_WO2AXYFE();
      pyraminx_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-20 -20 546 480" preserveAspectRatio="xMidYMid meet">
  <defs>
  </defs>
  <title>pyraminx</title>
  <defs>
    <g id="stickerA" transform="scale(1, 0.577350269)">
      <path
         d="m 0,1.732050808 1,-1.732050808 1,1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
    <g id="stickerV" transform="scale(1, 0.577350269)">
      <path
         d="m 0,0 1,1.732050808 1,-1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10   -->
<!--        | | | | | | | | | | |    -->
<!--    0 - L L L L L F R R R R R    -->
<!--    1 -   L L L F F F R R R      -->
<!--    2 -     L F F F F F R        -->
<!--    3 -       D D D D D          -->
<!--    4 -         D D D            -->
<!--    5 -           D              -->

  <g id="puzzle" transform="translate(5, 5) scale(40, 69.28203232)">
    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#stickerV" transform="translate(5.2, 1.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l0-o1" xlink:href="#stickerA" transform="translate(3, 0)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#stickerA" transform="translate(7.4, 0)" style="fill: blue"/>

    <use id="CORNERS-l3-o0" xlink:href="#stickerV" transform="translate(4.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o1" xlink:href="#stickerA" transform="translate(4.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS-l3-o2" xlink:href="#stickerA" transform="translate(2, 1)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#stickerV" transform="translate(6.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l2-o1" xlink:href="#stickerA" transform="translate(8.4, 1)" style="fill: blue"/>
    <use id="CORNERS-l2-o2" xlink:href="#stickerA" transform="translate(6.2, 3.2)" style="fill: yellow"/>

    <use id="CORNERS-l1-o1" xlink:href="#stickerA" transform="translate(9.4, 0)" style="fill: blue"/>
    <use id="CORNERS-l1-o2" xlink:href="#stickerA" transform="translate(1, 0)" style="fill: red"/>
    <use id="CORNERS-l1-o0" xlink:href="#stickerA" transform="translate(5.2, 4.2)" style="fill: yellow"/>

    <!-- "TIPS" -->
    <!-- CORNERS2 -->
    <use id="CORNERS2-l0-o0" xlink:href="#stickerA" transform="translate(5.2, 0.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l0-o1" xlink:href="#stickerV" transform="translate(4, 0)" style="fill: red"/>
    <use id="CORNERS2-l0-o2" xlink:href="#stickerV" transform="translate(6.4, 0)" style="fill: blue"/>

    <use id="CORNERS2-l3-o0" xlink:href="#stickerA" transform="translate(3.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l3-o1" xlink:href="#stickerV" transform="translate(3.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l3-o2" xlink:href="#stickerV" transform="translate(2, 2)" style="fill: red"/>

    <use id="CORNERS2-l2-o1" xlink:href="#stickerV" transform="translate(8.4, 2)" style="fill: blue"/>
    <use id="CORNERS2-l2-o2" xlink:href="#stickerV" transform="translate(7.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l2-o0" xlink:href="#stickerA" transform="translate(7.2, 2.066666667)" style="fill: limegreen"/>

    <use id="CORNERS2-l1-o1" xlink:href="#stickerV" transform="translate(10.4,0)" style="fill: blue"/>
    <use id="CORNERS2-l1-o2" xlink:href="#stickerV" transform="translate(0, 0)" style="fill: red"/>
    <use id="CORNERS2-l1-o0" xlink:href="#stickerV" transform="translate(5.2, 5.2)" style="fill: yellow"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0" xlink:href="#stickerA" transform="translate(4.2, 1.066666667)" style="fill: limegreen"/>
    <use id="EDGES-l0-o1" xlink:href="#stickerV" transform="translate(3, 1)" style="fill: red"/>

    <use id="EDGES-l5-o0" xlink:href="#stickerA" transform="translate(6.2, 1.066666667)" style="fill: limegreen"/>
    <use id="EDGES-l5-o1" xlink:href="#stickerV" transform="translate(7.4, 1)" style="fill: blue"/>

    <use id="EDGES-l1-o1" xlink:href="#stickerV" transform="translate(8.4, 0)" style="fill: blue"/>
    <use id="EDGES-l1-o0" xlink:href="#stickerV" transform="translate(2, 0)" style="fill: red"/>

    <use id="EDGES-l2-o1" xlink:href="#stickerV" transform="translate(5.2, 3.2)" style="fill: yellow"/>
    <use id="EDGES-l2-o0" xlink:href="#stickerA" transform="translate(5.2, 2.066666667)" style="fill: limegreen"/>

    <use id="EDGES-l3-o0" xlink:href="#stickerV" transform="translate(6.2, 4.2)" style="fill: yellow"/>
    <use id="EDGES-l3-o1" xlink:href="#stickerV" transform="translate(9.4, 1)" style="fill: blue"/>

    <use id="EDGES-l4-o0" xlink:href="#stickerV" transform="translate(4.2, 4.2)" style="fill: yellow"/>
    <use id="EDGES-l4-o1" xlink:href="#stickerV" transform="translate(1, 1)" style="fill: red"/>
  </g>

</svg>`;
    }
  });

  // node_modules/cubing/dist/esm/sq1-hyperorbit.kpuzzle.json-N3FGCPML.js
  var sq1_hyperorbit_kpuzzle_json_N3FGCPML_exports = {};
  __export(sq1_hyperorbit_kpuzzle_json_N3FGCPML_exports, {
    sq1HyperOrbitKPuzzle: () => sq1HyperOrbitKPuzzle
  });
  var sq1HyperOrbitKPuzzle;
  var init_sq1_hyperorbit_kpuzzle_json_N3FGCPML = __esm({
    "node_modules/cubing/dist/esm/sq1-hyperorbit.kpuzzle.json-N3FGCPML.js"() {
      init_chunk_WO2AXYFE();
      sq1HyperOrbitKPuzzle = {
        name: "Square-1",
        orbits: {
          WEDGES: { numPieces: 24, orientations: 9 },
          EQUATOR: { numPieces: 2, orientations: 6 }
        },
        startPieces: {
          WEDGES: {
            permutation: [
              0,
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13,
              14,
              15,
              16,
              17,
              18,
              19,
              20,
              21,
              22,
              23
            ],
            orientation: [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ]
          },
          EQUATOR: { permutation: [0, 1], orientation: [0, 0] }
        },
        moves: {
          U_SQ_: {
            WEDGES: {
              permutation: [
                11,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23
              ],
              orientation: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]
            },
            EQUATOR: { permutation: [0, 1], orientation: [0, 0] }
          },
          D_SQ_: {
            WEDGES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                23,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22
              ],
              orientation: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]
            },
            EQUATOR: { permutation: [0, 1], orientation: [0, 0] }
          },
          _SLASH_: {
            WEDGES: {
              permutation: [
                0,
                1,
                2,
                3,
                4,
                5,
                12,
                13,
                14,
                15,
                16,
                17,
                6,
                7,
                8,
                9,
                10,
                11,
                18,
                19,
                20,
                21,
                22,
                23
              ],
              orientation: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]
            },
            EQUATOR: { permutation: [0, 1], orientation: [0, 3] }
          }
        }
      };
    }
  });

  // node_modules/cubing/dist/esm/sq1-hyperorbit.kpuzzle.svg-ID57EER7.js
  var sq1_hyperorbit_kpuzzle_svg_ID57EER7_exports = {};
  __export(sq1_hyperorbit_kpuzzle_svg_ID57EER7_exports, {
    default: () => sq1_hyperorbit_kpuzzle_svg_default
  });
  var sq1_hyperorbit_kpuzzle_svg_default;
  var init_sq1_hyperorbit_kpuzzle_svg_ID57EER7 = __esm({
    "node_modules/cubing/dist/esm/sq1-hyperorbit.kpuzzle.svg-ID57EER7.js"() {
      init_chunk_WO2AXYFE();
      sq1_hyperorbit_kpuzzle_svg_default = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="360px" height="552px" viewBox="0 0 360 552" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 59.1 (86144) - https://sketch.com -->
    <title>sq1-fancy</title>
    <desc>Created with Sketch.</desc>
    <!-- stroke="none" -->
    <g id="sq1-fancy" stroke="#888" stroke-width="0.25" fill="none" fill-rule="evenodd">
        <g id="EQUATOR" transform="translate(24.000000, 264.000000)">
            <rect id="EQUATOR-l1-o3" style="fill: red" x="168" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o4" style="fill: red" x="192" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o5" style="fill: limegreen" x="216" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o2" style="fill: limegreen" x="240" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o1" style="fill: limegreen" x="264" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o0" style="fill: orange" x="288" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o3" style="fill: orange" x="0" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o4" style="fill: orange" x="24" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o5" style="fill: limegreen" x="48" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o2" style="fill: limegreen" x="72" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o1" style="fill: limegreen" x="96" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o0" style="fill: red" x="120" y="0" width="24" height="24"></rect>
        </g>
        <g id="BOTTOM" transform="translate(41.000000, 257.000000)" stroke-linejoin="round">
            <g id="WEDGES-23" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l23-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l23-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l23-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l23-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l23-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l23-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l23-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-22" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l22-o8" style="fill: blue" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l22-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l22-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l22-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l22-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l22-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l22-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-21" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l21-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l21-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l21-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l21-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l21-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l21-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l21-o2" style="fill: blue" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-20" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l20-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l20-o7" style="fill: blue" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l20-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l20-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l20-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l20-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l20-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-19" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l19-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l19-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l19-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l19-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l19-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l19-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l19-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-18" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l18-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l18-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l18-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l18-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l18-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l18-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l18-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-17" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l17-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l17-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l17-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l17-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l17-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l17-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l17-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-16" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l16-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l16-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l16-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l16-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l16-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l16-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l16-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-15" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l15-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l15-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l15-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l15-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l15-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l15-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l15-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-14" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l14-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l14-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l14-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l14-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l14-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l14-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l14-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-13" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l13-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l13-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l13-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l13-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l13-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l13-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l13-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-12" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l12-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l12-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l12-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l12-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l12-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l12-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l12-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="TOP" transform="translate(41.000000, -31.000000)" stroke-linejoin="round">
            <g id="WEDGES-11" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l11-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l11-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l11-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l11-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l11-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l11-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l11-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-10" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l10-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l10-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l10-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l10-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l10-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l10-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l10-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-9" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l9-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l9-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l9-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l9-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l9-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l9-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l9-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-8" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l8-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l8-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l8-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l8-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l8-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l8-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l8-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-7" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l7-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l7-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l7-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l7-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l7-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l7-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l7-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-6" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l6-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l6-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l6-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l6-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l6-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l6-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l6-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-5" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l5-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l5-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l5-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l5-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l5-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l5-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l5-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-4" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l4-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l4-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l4-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l4-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l4-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l4-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l4-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-3" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l3-o8" style="fill: blue" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l3-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l3-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l3-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l3-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l3-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l3-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-2" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l2-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l2-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l2-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l2-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l2-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l2-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l2-o2" style="fill: blue" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-1" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l1-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l1-o7" style="fill: blue" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l1-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l1-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l1-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l1-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l1-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-0" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l0-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l0-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l0-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l0-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l0-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l0-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l0-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="DIAGONALS" transform="translate(168.861561, 1.019238)" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <line x1="0" y1="287.842323" x2="70.2768775" y2="550.119201" id="BOTTOM"></line>
            <line x1="0.15767665" y1="262.276878" x2="70.4345542" y2="2.27488928e-16" id="TOP"></line>
        </g>
    </g>
</svg>`;
    }
  });

  // node-stub:crypto
  var crypto_exports = {};
  __export(crypto_exports, {
    default: () => crypto_default,
    webcrypto: () => webcrypto
  });
  var webcrypto, crypto_default;
  var init_crypto = __esm({
    "node-stub:crypto"() {
      webcrypto = globalThis.crypto;
      crypto_default = { webcrypto: globalThis.crypto };
    }
  });

  // node-stub:worker_threads
  var worker_threads_exports = {};
  __export(worker_threads_exports, {
    Worker: () => Worker,
    default: () => worker_threads_default
  });
  var Worker, worker_threads_default;
  var init_worker_threads = __esm({
    "node-stub:worker_threads"() {
      Worker = void 0;
      worker_threads_default = {};
    }
  });

  // node-stub:node-adapter
  var node_adapter_exports = {};
  __export(node_adapter_exports, {
    Worker: () => Worker2,
    default: () => node_adapter_default
  });
  var Worker2, node_adapter_default;
  var init_node_adapter = __esm({
    "node-stub:node-adapter"() {
      Worker2 = void 0;
      node_adapter_default = {};
    }
  });

  // node_modules/cubing/dist/esm/node-HFBX5WHK.js
  var node_HFBX5WHK_exports = {};
  __export(node_HFBX5WHK_exports, {
    NodeWorkerStringWrapper: () => NodeWorkerStringWrapper,
    NodeWorkerWrapper: () => NodeWorkerWrapper
  });
  async function getImports() {
    return {
      NodeWorker: (await Promise.resolve().then(() => (init_worker_threads(), worker_threads_exports))).Worker,
      nodeEndpoint: (await Promise.resolve().then(() => (init_node_adapter(), node_adapter_exports))).default
    };
  }
  function construct(imports, url, nodeOptions) {
    const worker = new imports.NodeWorker(url, nodeOptions);
    worker.unref();
    const wrappedWorker = imports.nodeEndpoint(worker);
    return wrappedWorker;
  }
  async function NodeWorkerWrapper() {
    const imports = await getImports();
    return cachedNodeWorkerWrapper || (cachedNodeWorkerWrapper = class {
      constructor(url, _options) {
        return construct(imports, url);
      }
    });
  }
  async function NodeWorkerStringWrapper() {
    const imports = await getImports();
    return cachedNodeWorkerStringWrapper || (cachedNodeWorkerStringWrapper = class {
      constructor(url, _options) {
        return construct(imports, url, { eval: true });
      }
    });
  }
  var cachedNodeWorkerWrapper, cachedNodeWorkerStringWrapper;
  var init_node_HFBX5WHK = __esm({
    "node_modules/cubing/dist/esm/node-HFBX5WHK.js"() {
      init_chunk_WO2AXYFE();
      cachedNodeWorkerWrapper = null;
      cachedNodeWorkerStringWrapper = null;
    }
  });

  // node_modules/cubing/dist/esm/worker-inside-generated-string-RQYYANYQ.js
  var worker_inside_generated_string_RQYYANYQ_exports = {};
  __export(worker_inside_generated_string_RQYYANYQ_exports, {
    workerSource: () => workerSource
  });
  var workerSource;
  var init_worker_inside_generated_string_RQYYANYQ = __esm({
    "node_modules/cubing/dist/esm/worker-inside-generated-string-RQYYANYQ.js"() {
      init_chunk_WO2AXYFE();
      workerSource = `var D1=Object.create;var Eo=Object.defineProperty;var F1=Object.getOwnPropertyDescriptor;var y1=Object.getOwnPropertyNames;var B1=Object.getPrototypeOf,b1=Object.prototype.hasOwnProperty;var pa=e=>Eo(e,"__esModule",{value:!0});var S=(e,t)=>()=>(e&&(t=e(e=0)),t);var ke=(e,t)=>{pa(e);for(var r in t)Eo(e,r,{get:t[r],enumerable:!0})},x1=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of y1(t))!b1.call(e,n)&&n!=="default"&&Eo(e,n,{get:()=>t[n],enumerable:!(r=F1(t,n))||r.enumerable});return e},da=e=>x1(pa(Eo(e!=null?D1(B1(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var ni=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)};var R=(e,t,r)=>(ni(e,t,"read from private field"),r?r.call(e):t.get(e)),de=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},ie=(e,t,r,n)=>(ni(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),oi=(e,t,r,n)=>({set _(o){ie(e,t,o,r)},get _(){return R(e,t,n)}}),La=(e,t,r)=>(ni(e,t,"access private method"),r);var h=(e,t,r)=>new Promise((n,o)=>{var l=u=>{try{s(r.next(u))}catch(a){o(a)}},i=u=>{try{s(r.throw(u))}catch(a){o(a)}},s=u=>u.done?n(u.value):Promise.resolve(u.value).then(l,i);s((r=r.apply(e,t)).next())});var Ba={};ke(Ba,{default:()=>G1});function I1(e){let t=new WeakMap;return{postMessage:e.postMessage.bind(e),addEventListener:(r,n)=>{let o=l=>{"handleEvent"in n?n.handleEvent({data:l}):n({data:l})};e.on("message",o),t.set(n,o)},removeEventListener:(r,n)=>{let o=t.get(n);!o||(e.off("message",o),t.delete(n))},start:e.start&&e.start.bind(e)}}var G1,ba=S(()=>{G1=I1});var xa={};ke(xa,{port:()=>T1});function T1(){return h(this,null,function*(){let{parentPort:e}=yield import("worker_threads").catch();return(yield Promise.resolve().then(()=>(ba(),Ba))).default(e)})}var Sa=S(()=>{});var _1,zo,ze,It=S(()=>{_1=!1,zo=class{is(t){return this instanceof t}as(t){return this instanceof t?this:null}},ze=class extends zo{constructor(){super();_1&&Object.defineProperty(this,"_debugStr",{get:()=>this.toString()})}get log(){return console.log.bind(console,this,this.toString())}}});function wa(e,t=!0){if(!t)return e;switch(e){case 1:return-1;case-1:return 1}}function ai(e,t){return t===-1?Array.from(e).reverse():e}function Ua(e){return Array.from(e).reverse()}var j,dt=S(()=>{(function(r){r[r.Forwards=1]="Forwards",r[r.Backwards=-1]="Backwards"})(j||(j={}))});var Mn,Nr,Ea,ui=S(()=>{Mn=2147483647,Nr="2^31 - 1",Ea=-2147483648});var Lr,ut,fi=S(()=>{Gt();ut=class{constructor(){de(this,Lr,[])}push(t){R(this,Lr).push(t)}experimentalPushAlg(t){for(let r of t.units())this.push(r)}experimentalNumUnits(){return R(this,Lr).length}toAlg(){return new z(R(this,Lr))}reset(){ie(this,Lr,[])}};Lr=new WeakMap});var hr,Ar,Co,Ce,In=S(()=>{Gt();It();dt();Co=class extends ze{constructor(t,r){super();de(this,hr,void 0);de(this,Ar,void 0);ie(this,hr,Zt(t)),ie(this,Ar,Zt(r))}get A(){return R(this,hr)}get B(){return R(this,Ar)}isIdentical(t){let r=t.as(Co);return!!((r==null?void 0:r.A.isIdentical(this.A))&&(r==null?void 0:r.B.isIdentical(this.B)))}invert(){return new Co(R(this,Ar),R(this,hr))}*experimentalExpand(t=j.Forwards,r){r!=null||(r=1/0),r===0?yield t===j.Forwards?this:this.invert():t===j.Forwards?(yield*this.A.experimentalExpand(j.Forwards,r-1),yield*this.B.experimentalExpand(j.Forwards,r-1),yield*this.A.experimentalExpand(j.Backwards,r-1),yield*this.B.experimentalExpand(j.Backwards,r-1)):(yield*this.B.experimentalExpand(j.Forwards,r-1),yield*this.A.experimentalExpand(j.Forwards,r-1),yield*this.B.experimentalExpand(j.Backwards,r-1),yield*this.A.experimentalExpand(j.Backwards,r-1))}toString(){return\`[\${R(this,hr).toString()}, \${R(this,Ar).toString()}]\`}},Ce=Co;hr=new WeakMap,Ar=new WeakMap});var _r,Or,Po,Pe,Gn=S(()=>{Gt();It();dt();Po=class extends ze{constructor(t,r){super();de(this,_r,void 0);de(this,Or,void 0);ie(this,_r,Zt(t)),ie(this,Or,Zt(r))}get A(){return R(this,_r)}get B(){return R(this,Or)}isIdentical(t){let r=t.as(Po);return!!((r==null?void 0:r.A.isIdentical(this.A))&&(r==null?void 0:r.B.isIdentical(this.B)))}invert(){return new Po(R(this,_r),R(this,Or).invert())}*experimentalExpand(t,r){r!=null||(r=1/0),r===0?yield t===j.Forwards?this:this.invert():(yield*this.A.experimentalExpand(j.Forwards,r-1),yield*this.B.experimentalExpand(t,r-1),yield*this.A.experimentalExpand(j.Backwards,r-1))}toString(){return\`[\${this.A}: \${this.B}]\`}},Pe=Po;_r=new WeakMap,Or=new WeakMap});var Xt,gi,Lt,Tn=S(()=>{It();dt();gi=class extends ze{constructor(t){super();de(this,Xt,void 0);if(t.includes(\`
\`)||t.includes("\\r"))throw new Error("LineComment cannot contain newline");ie(this,Xt,t)}get text(){return R(this,Xt)}isIdentical(t){let r=t;return t.is(gi)&&R(this,Xt)===R(r,Xt)}invert(){return this}*experimentalExpand(t=j.Forwards,r=1/0){yield this}toString(){return\`//\${R(this,Xt)}\`}},Lt=gi;Xt=new WeakMap});var We,Nn=S(()=>{It();dt();We=class extends ze{toString(){return\`
\`}isIdentical(t){return t.is(We)}invert(){return this}*experimentalExpand(t=j.Forwards,r=1/0){yield this}}});var Qe,_n=S(()=>{It();dt();Qe=class extends ze{toString(){return"."}isIdentical(t){return t.is(Qe)}invert(){return this}*experimentalExpand(t=j.Forwards,r=1/0){yield this}}});function Mo(e,t){return e?parseInt(e):t}function ci(e){return new Io().parseAlg(e)}function za(e){return new Io().parseMove(e)}function Ca(e){return new Io().parseQuantumMove(e)}function qe(e,t,r){let n=e;return n.startCharIndex=t,n.endCharIndex=r,n}function Pa(e,t){return"startCharIndex"in e&&(t.startCharIndex=e.startCharIndex),"endCharIndex"in e&&(t.endCharIndex=e.endCharIndex),t}var ka,O1,W1,Q1,q1,j1,Ye,O,Io,mi=S(()=>{Gt();fi();In();Gn();Go();Tn();Tt();Nn();_n();ka=/^(\\d+)?('?)/,O1=/^[_\\dA-Za-z]/,W1=/^((([1-9]\\d*)-)?([1-9]\\d*))?([_A-Za-z]+)?/,Q1=/^[^\\n]*/,q1=/^(-?\\d+), ?/,j1=/^(-?\\d+)\\)/;Io=class{constructor(){de(this,Ye,"");de(this,O,0)}parseAlg(t){ie(this,Ye,t),ie(this,O,0);let r=this.parseAlgWithStopping([]);return this.mustBeAtEndOfInput(),r}parseMove(t){ie(this,Ye,t),ie(this,O,0);let r=this.parseMoveImpl();return this.mustBeAtEndOfInput(),r}parseQuantumMove(t){ie(this,Ye,t),ie(this,O,0);let r=this.parseQuantumMoveImpl();return this.mustBeAtEndOfInput(),r}mustBeAtEndOfInput(){if(R(this,O)!==R(this,Ye).length)throw new Error("parsing unexpectedly ended early")}parseAlgWithStopping(t){let r=R(this,O),n=R(this,O),o=new ut,l=!1,i=s=>{if(l)throw new Error(\`Unexpected character at index \${s}. Are you missing a space?\`)};e:for(;R(this,O)<R(this,Ye).length;){let s=R(this,O);if(t.includes(R(this,Ye)[R(this,O)]))return qe(o.toAlg(),r,n);if(this.tryConsumeNext(" ")){l=!1,o.experimentalNumUnits()===0&&(r=R(this,O));continue e}else if(O1.test(R(this,Ye)[R(this,O)])){i(s);let u=this.parseMoveImpl();o.push(u),l=!0,n=R(this,O);continue e}else if(this.tryConsumeNext("(")){i(s);let u=this.tryRegex(q1);if(u){let a=u[1],f=R(this,O),g=this.parseRegex(j1),c=qe(new d(new G("U_SQ_"),parseInt(a)),s+1,s+1+a.length),m=qe(new d(new G("D_SQ_"),parseInt(g[1])),f,R(this,O)-1),L=qe(new z([c,m]),s+1,R(this,O)-1);o.push(qe(new ot(L),s,R(this,O))),l=!0,n=R(this,O);continue e}else{let a=this.parseAlgWithStopping([")"]);this.mustConsumeNext(")");let f=this.parseAmount();o.push(qe(new ot(a,f),s,R(this,O))),l=!0,n=R(this,O);continue e}}else if(this.tryConsumeNext("[")){i(s);let u=this.parseAlgWithStopping([",",":"]),a=this.popNext(),f=this.parseAlgWithStopping(["]"]);switch(this.mustConsumeNext("]"),a){case":":o.push(qe(new Pe(u,f),s,R(this,O))),l=!0,n=R(this,O);continue e;case",":o.push(qe(new Ce(u,f),s,R(this,O))),l=!0,n=R(this,O);continue e;default:throw"unexpected parsing error"}}else if(this.tryConsumeNext(\`
\`)){o.push(qe(new We,s,R(this,O))),l=!1,n=R(this,O);continue e}else if(this.tryConsumeNext("/"))if(this.tryConsumeNext("/")){i(s);let[u]=this.parseRegex(Q1);o.push(qe(new Lt(u),s,R(this,O))),l=!1,n=R(this,O);continue e}else{o.push(qe(new d("_SLASH_"),s,R(this,O))),l=!0,n=R(this,O);continue e}else if(this.tryConsumeNext(".")){i(s),o.push(qe(new Qe,s,R(this,O))),l=!0,n=R(this,O);continue e}else throw new Error(\`Unexpected character: \${this.popNext()}\`)}if(R(this,O)!==R(this,Ye).length)throw new Error("did not finish parsing?");if(t.length>0)throw new Error("expected stopping");return qe(o.toAlg(),r,n)}parseQuantumMoveImpl(){let[,,,t,r,n]=this.parseRegex(W1);return new G(n,Mo(r,void 0),Mo(t,void 0))}parseMoveImpl(){let t=R(this,O);if(this.tryConsumeNext("/"))return qe(new d("_SLASH_"),t,R(this,O));let r=this.parseQuantumMoveImpl(),[n,o]=this.parseAmountAndTrackEmptyAbsAmount(),l=this.parseMoveSuffix();if(l){if(n<0)throw new Error("uh-oh");if((l==="++"||l==="--")&&n!==1)throw new Error("Pochmann ++ or -- moves cannot have an amount other than 1.");if((l==="++"||l==="--")&&!o)throw new Error("Pochmann ++ or -- moves cannot have an amount written as a number.");if((l==="+"||l==="-")&&o)throw new Error("Clock dial moves must have an amount written as a natural number followed by + or -.");l.startsWith("+")&&(r=r.modified({family:\`\${r.family}_\${l==="+"?"PLUS":"PLUSPLUS"}_\`})),l.startsWith("-")&&(r=r.modified({family:\`\${r.family}_\${l==="-"?"PLUS":"PLUSPLUS"}_\`}),n*=-1)}return qe(new d(r,n),t,R(this,O))}parseMoveSuffix(){return this.tryConsumeNext("+")?this.tryConsumeNext("+")?"++":"+":this.tryConsumeNext("-")?this.tryConsumeNext("-")?"--":"-":null}parseAmountAndTrackEmptyAbsAmount(){let t=R(this,O),[,r,n]=this.parseRegex(ka);if((r==null?void 0:r.startsWith("0"))&&r!=="0")throw new Error(\`Error at char index \${t}: An amount can only start with 0 if it's exactly the digit 0.\`);return[Mo(r,1)*(n==="'"?-1:1),!r]}parseAmount(){let t=R(this,O),[,r,n]=this.parseRegex(ka);if((r==null?void 0:r.startsWith("0"))&&r!=="0")throw new Error(\`Error at char index \${t}: An amount number can only start with 0 if it's exactly the digit 0.\`);return Mo(r,1)*(n==="'"?-1:1)}parseRegex(t){let r=t.exec(this.remaining());if(r===null)throw new Error("internal parsing error");return ie(this,O,R(this,O)+r[0].length),r}tryRegex(t){let r=t.exec(this.remaining());return r===null?null:(ie(this,O,R(this,O)+r[0].length),r)}remaining(){return R(this,Ye).slice(R(this,O))}popNext(){let t=R(this,Ye)[R(this,O)];return oi(this,O)._++,t}tryConsumeNext(t){return R(this,Ye)[R(this,O)]===t?(oi(this,O)._++,!0):!1}mustConsumeNext(t){let r=this.popNext();if(r!==t)throw new Error(\`expected \\\`\${t}\\\` while parsing, encountered \${r}\`);return r}};Ye=new WeakMap,O=new WeakMap});function To(e){Ma.has(e)||(console.warn(e),Ma.add(e))}var Ma,pi=S(()=>{Ma=new Set});var Wr,di=S(()=>{dt();ui();Wr=class{constructor(t,r=1){if(this.quantum=t,this.amount=r,!Number.isInteger(this.amount)||this.amount<Ea||this.amount>Mn)throw new Error(\`Unit amount absolute value must be a non-negative integer from \${Nr} to \${Nr}.\`)}suffix(){let t="",r=Math.abs(this.amount);return r!==1&&(t+=r),this.amount<0&&(t+="'"),t}isIdentical(t){return this.quantum.isIdentical(t.quantum)&&this.amount===t.amount}*experimentalExpand(t,r){let n=Math.abs(this.amount),o=wa(t,this.amount<0);for(let l=0;l<n;l++)yield*this.quantum.experimentalExpand(o,r)}}});var Nt,Me,Ie,No,G,Se,Qr,d,Tt=S(()=>{It();dt();ui();mi();pi();di();No=class extends zo{constructor(t,r,n){super();de(this,Nt,void 0);de(this,Me,void 0);de(this,Ie,void 0);if(ie(this,Nt,t),ie(this,Me,r!=null?r:null),ie(this,Ie,n!=null?n:null),Object.freeze(this),R(this,Me)!==null&&(!Number.isInteger(R(this,Me))||R(this,Me)<1||R(this,Me)>Mn))throw new Error(\`QuantumMove inner layer must be a positive integer below \${Nr}.\`);if(R(this,Ie)!==null&&(!Number.isInteger(R(this,Ie))||R(this,Ie)<1||R(this,Ie)>Mn))throw new Error(\`QuantumMove outer layer must be a positive integer below \${Nr}.\`);if(R(this,Ie)!==null&&R(this,Me)!==null&&R(this,Me)<=R(this,Ie))throw new Error("QuantumMove outer layer must be smaller than inner layer.");if(R(this,Ie)!==null&&R(this,Me)===null)throw new Error("QuantumMove with an outer layer must have an inner layer")}static fromString(t){return Ca(t)}modified(t){var r,n,o;return new No((r=t.family)!=null?r:R(this,Nt),(n=t.innerLayer)!=null?n:R(this,Me),(o=t.outerLayer)!=null?o:R(this,Ie))}isIdentical(t){let r=t;return t.is(No)&&R(this,Nt)===R(r,Nt)&&R(this,Me)===R(r,Me)&&R(this,Ie)===R(r,Ie)}get family(){return R(this,Nt)}get outerLayer(){return R(this,Ie)}get innerLayer(){return R(this,Me)}experimentalExpand(){throw new Error("experimentalExpand() cannot be called on a \`QuantumMove\` directly.")}toString(){let t=R(this,Nt);return R(this,Me)!==null&&(t=String(R(this,Me))+t,R(this,Ie)!==null&&(t=String(R(this,Ie))+"-"+t)),t}},G=No;Nt=new WeakMap,Me=new WeakMap,Ie=new WeakMap;Qr=class extends ze{constructor(...t){super();de(this,Se,void 0);var r;if(typeof t[0]=="string")if((r=t[1])!=null?r:null){ie(this,Se,new Wr(G.fromString(t[0]),t[1]));return}else return Qr.fromString(t[0]);ie(this,Se,new Wr(t[0],t[1]))}isIdentical(t){let r=t.as(Qr);return!!r&&R(this,Se).isIdentical(R(r,Se))}invert(){return Pa(this,new Qr(R(this,Se).quantum,-this.amount))}*experimentalExpand(t=j.Forwards){t===j.Forwards?yield this:yield this.modified({amount:-this.amount})}get quantum(){return R(this,Se).quantum}modified(t){var r;return new Qr(R(this,Se).quantum.modified(t),(r=t.amount)!=null?r:this.amount)}static fromString(t){return za(t)}get amount(){return R(this,Se).amount}get type(){return To("deprecated: type"),"blockMove"}get family(){var t;return(t=R(this,Se).quantum.family)!=null?t:void 0}get outerLayer(){var t;return(t=R(this,Se).quantum.outerLayer)!=null?t:void 0}get innerLayer(){var t;return(t=R(this,Se).quantum.innerLayer)!=null?t:void 0}toString(){if(this.family==="_SLASH_")return"/";if(this.family.endsWith("_PLUS_"))return R(this,Se).quantum.toString().slice(0,-6)+Math.abs(this.amount)+(this.amount<0?"-":"+");if(this.family.endsWith("_PLUSPLUS_")){let t=Math.abs(this.amount);return R(this,Se).quantum.toString().slice(0,-10)+(t===1?"":t)+(this.amount<0?"--":"++")}return R(this,Se).quantum.toString()+R(this,Se).suffix()}},d=Qr;Se=new WeakMap});var Ia,Ga,Ze,_o,ot,Go=S(()=>{Gt();It();dt();Tt();di();Ia=class{constructor(){this.quantumU_SQ_=null;this.quantumD_SQ_=null}format(t){let r=this.tuple(t);return r?\`(\${r.map(n=>n.amount).join(", ")})\`:null}tuple(t){var n,o;this.quantumU_SQ_||(this.quantumU_SQ_=new G("U_SQ_")),this.quantumD_SQ_||(this.quantumD_SQ_=new G("D_SQ_"));let r=t.alg;if(r.experimentalNumUnits()===2){let[l,i]=r.units();if(((n=l.as(d))==null?void 0:n.quantum.isIdentical(this.quantumU_SQ_))&&((o=i.as(d))==null?void 0:o.quantum.isIdentical(this.quantumD_SQ_))){if(t.amount!==1)throw new Error("Square-1 tuples cannot have an amount other than 1.");return[l,i]}}return null}},Ga=new Ia,_o=class extends ze{constructor(t,r){super();de(this,Ze,void 0);let n=Zt(t);ie(this,Ze,new Wr(n,r))}isIdentical(t){let r=t;return t.is(_o)&&R(this,Ze).isIdentical(R(r,Ze))}get alg(){return R(this,Ze).quantum}get amount(){return R(this,Ze).amount}get experimentalRepetitionSuffix(){return R(this,Ze).suffix()}invert(){return new _o(R(this,Ze).quantum,-R(this,Ze).amount)}*experimentalExpand(t=j.Forwards,r){r!=null||(r=1/0),r===0?yield t===j.Forwards?this:this.invert():yield*R(this,Ze).experimentalExpand(t,r-1)}static fromString(){throw new Error("unimplemented")}toString(){var t;return(t=Ga.format(this))!=null?t:\`(\${R(this,Ze).quantum.toString()})\${R(this,Ze).suffix()}\`}experimentalAsSquare1Tuple(){return Ga.tuple(this)}},ot=_o;Ze=new WeakMap});var Oo=S(()=>{Go();Tn();In();Gn();Tt();Nn();_n()});function lt(e,t){return e instanceof t}function Ta(e){return lt(e,ot)||lt(e,Lt)||lt(e,Ce)||lt(e,Pe)||lt(e,d)||lt(e,We)||lt(e,Qe)}var Li=S(()=>{Oo()});function Na(e,t,r){if(t.is(ot))return e.traverseGrouping(t,r);if(t.is(d))return e.traverseMove(t,r);if(t.is(Ce))return e.traverseCommutator(t,r);if(t.is(Pe))return e.traverseConjugate(t,r);if(t.is(Qe))return e.traversePause(t,r);if(t.is(We))return e.traverseNewline(t,r);if(t.is(Lt))return e.traverseLineComment(t,r);throw new Error("unknown unit")}function _a(e){if(e.is(ot)||e.is(d)||e.is(Ce)||e.is(Pe)||e.is(Qe)||e.is(We)||e.is(Lt))return e;throw"internal error: expected unit"}var Wo,qr,Qo,K1,Ai,hi,Oa,Wa,Ri=S(()=>{Go();In();Tt();Nn();_n();Gn();Tn();Wo=class{traverseUnit(t,r){return Na(this,t,r)}traverseIntoUnit(t,r){return _a(this.traverseUnit(t,r))}},qr=class extends Wo{traverseUnit(t){return Na(this,t,void 0)}traverseIntoUnit(t){return _a(this.traverseUnit(t))}},Ai=class extends Wo{*traverseAlg(t,r){var a;if(r.depth===0){yield*t.units();return}let n=[],o=null,l=(a=r==null?void 0:r.collapseMoves)!=null?a:!0;function i(f,g){var L;let c=La(L=Ai,Qo,K1).call(L,f,g,r);if(c===0)return!1;let m=new d(f.quantum,c);return n.push(m),o=m,!0}function s(f){l&&(o==null?void 0:o.is(d))&&f.is(d)&&o.quantum.isIdentical(f.quantum)?(n.pop(),i(o,f.amount)||(o=n.slice(-1)[0])):f.is(d)?i(f,0):(n.push(f),o=f)}let u={depth:r.depth?r.depth-1:null};for(let f of t.units())for(let g of this.traverseUnit(f,u))s(g);for(let f of n)yield f}*traverseGrouping(t,r){if(r.depth===0){yield t;return}let n={depth:r.depth?r.depth-1:null};yield new ot(this.traverseAlg(t.alg,n))}*traverseMove(t,r){yield t}*traverseCommutator(t,r){if(r.depth===0){yield t;return}let n={depth:r.depth?r.depth-1:null};yield new Ce(this.traverseAlg(t.A,n),this.traverseAlg(t.B,n))}*traverseConjugate(t,r){if(r.depth===0){yield t;return}let n={depth:r.depth?r.depth-1:null};yield new Pe(this.traverseAlg(t.A,n),this.traverseAlg(t.B,n))}*traversePause(t,r){yield t}*traverseNewline(t,r){yield t}*traverseLineComment(t,r){yield t}},hi=Ai;Qo=new WeakSet,K1=function(t,r,n){let o=t.amount+r;if(n==null?void 0:n.quantumMoveOrder){let l=n.quantumMoveOrder(t.quantum),i=Math.floor(l/2)+1-l;o=(o%l+l-i)%l+i}return o},de(hi,Qo);Oa=new hi,Wa=Oa.traverseAlg.bind(Oa)});function Qa(e){if(!e)return[];if(lt(e,z))return e.units();if(typeof e=="string")return ci(e).units();let t=e;if(typeof t[Symbol.iterator]=="function")return t;throw"Invalid unit"}function Zt(e){return lt(e,z)?e:new z(e)}function V1(e,t){return e.is(We)||t.is(We)?"":e.is(Lt)&&!t.is(We)?\`
\`:" "}var Xe,Rr,z,Gt=S(()=>{It();Li();dt();mi();Ri();Tn();Tt();Nn();pi();Rr=class extends ze{constructor(t){super();de(this,Xe,void 0);ie(this,Xe,Array.from(Qa(t)));for(let r of R(this,Xe))if(!Ta(r))throw new Error("An alg can only contain units.")}isIdentical(t){let r=t;if(!t.is(Rr))return!1;let n=Array.from(R(this,Xe)),o=Array.from(R(r,Xe));if(n.length!==o.length)return!1;for(let l=0;l<n.length;l++)if(!n[l].isIdentical(o[l]))return!1;return!0}invert(){return new Rr(Ua(Array.from(R(this,Xe)).map(t=>t.invert())))}*experimentalExpand(t=j.Forwards,r){r!=null||(r=1/0);for(let n of ai(R(this,Xe),t))yield*n.experimentalExpand(t,r)}expand(t){var r;return new Rr(this.experimentalExpand(j.Forwards,(r=t==null?void 0:t.depth)!=null?r:1/0))}*experimentalLeafMoves(){for(let t of this.experimentalExpand())t.is(d)&&(yield t)}concat(t){return new Rr(Array.from(R(this,Xe)).concat(Array.from(Qa(t))))}experimentalIsEmpty(){for(let t of R(this,Xe))return!1;return!0}static fromString(t){return ci(t)}*units(){for(let t of R(this,Xe))yield t}experimentalNumUnits(){return Array.from(R(this,Xe)).length}get type(){return To("deprecated: type"),"sequence"}toString(){let t="",r=null;for(let n of R(this,Xe))r&&(t+=V1(r,n)),t+=n.toString(),r=n;return t}simplify(t){return new Rr(Wa(this,t!=null?t:{}))}},z=Rr;Xe=new WeakMap});var H1,qa=S(()=>{Gt();Oo();In();Gn();Tt();_n();H1={Sune:new z([new d("R",1),new d("U",1),new d("R",-1),new d("U",1),new d("R",1),new d("U",-2),new d("R",-1)]),AntiSune:new z([new d("R",1),new d("U",2),new d("R",-1),new d("U",-1),new d("R",1),new d("U",-1),new d("R",-1)]),SuneCommutator:new z([new Ce(new z([new d("R",1),new d("U",1),new d("R",-2)]),new z([new Pe(new z([new d("R",1)]),new z([new d("U",1)]))]))]),Niklas:new z([new d("R",1),new d("U",-1),new d("L",-1),new d("U",1),new d("R",-1),new d("U",-1),new d("L",1),new d("U",1)]),EPerm:new z([new d("x",-1),new Ce(new z([new Pe(new z([new d("R",1)]),new z([new d("U",-1)]))]),new z([new d("D",1)])),new Ce(new z([new Pe(new z([new d("R",1)]),new z([new d("U",1)]))]),new z([new d("D",1)])),new d("x",1)]),FURURFCompact:new z([new Pe(new z([new d("F",1)]),new z([new Ce(new z([new d("U",1)]),new z([new d("R",1)]))]))]),APermCompact:new z([new Pe(new z([new d("R",2)]),new z([new Ce(new z([new d("F",2)]),new z([new d("R",-1),new d("B",-1),new d("R",1)]))]))]),FURURFMoves:new z([new d("F",1),new d("U",1),new d("R",1),new d("U",-1),new d("R",-1),new d("F",-1)]),TPerm:new z([new d("R",1),new d("U",1),new d("R",-1),new d("U",-1),new d("R",-1),new d("F",1),new d("R",2),new d("U",-1),new d("R",-1),new d("U",-1),new d("R",1),new d("U",1),new d("R",-1),new d("F",-1)]),HeadlightSwaps:new z([new Pe(new z([new d("F",1)]),new z([new ot(new z([new Ce(new z([new d("R",1)]),new z([new d("U",1)]))]),3)]))]),TriplePause:new z([new Qe,new Qe,new Qe])}});var jL,ja=S(()=>{Tt();jL={73:new d("R"),75:new d("R'"),87:new d("B"),79:new d("B'"),83:new d("D"),76:new d("D'"),68:new d("L"),69:new d("L'"),74:new d("U"),70:new d("U'"),72:new d("F"),71:new d("F'"),78:new d("x'"),67:new d("l"),82:new d("l'"),85:new d("r"),77:new d("r'"),88:new d("d"),188:new d("d'"),84:new d("x"),89:new d("x"),66:new d("x'"),186:new d("y"),59:new d("y"),65:new d("y'"),80:new d("z"),81:new d("z'"),90:new d("M'"),190:new d("M'")}});var Ka=S(()=>{});var Va=S(()=>{Gt()});var he=S(()=>{Gt();fi();Ri();qa();ja();Oo();Tt();Ka();Va();Li();dt()});function Di(e,t){if(t===jr)return!0;let r=t.permutation,n=r.length;for(let o=0;o<n;o++)if(r[o]!==o)return!1;if(e>1){let o=t.orientation;for(let l=0;l<n;l++)if(o[l]!==0)return!1}return jr=t,!0}function it(e,t,r){let n={};for(let o in e.orbits){let l=e.orbits[o],i=t[o],s=r[o];if(Di(l.orientations,s))n[o]=i;else if(Di(l.orientations,i))n[o]=s;else{let u=new Array(l.numPieces);if(l.orientations===1){for(let a=0;a<l.numPieces;a++)u[a]=i.permutation[s.permutation[a]];n[o]={permutation:u,orientation:i.orientation}}else{let a=new Array(l.numPieces);for(let f=0;f<l.numPieces;f++)a[f]=(i.orientation[s.permutation[f]]+s.orientation[f])%l.orientations,u[f]=i.permutation[s.permutation[f]];n[o]={permutation:u,orientation:a}}}}return n}function Kr(e,t,r){if(r<0)return Kr(e,_t(e,t),-r);if(r===0)return ht(e);if(r===1)return t;let n=t;r!==2&&(n=Kr(e,t,Math.floor(r/2)));let o=it(e,n,n);return r%2==0?o:it(e,t,o)}function ht(e){let t={};for(let r in e.orbits){let n=e.orbits[r];if(!jr||jr.permutation.length!==n.numPieces){let o=new Array(n.numPieces),l=new Array(n.numPieces);for(let s=0;s<n.numPieces;s++)o[s]=s,l[s]=0;jr={permutation:o,orientation:l}}t[r]=jr}return t}function _t(e,t){let r={};for(let n in e.orbits){let o=e.orbits[n],l=t[n];if(Di(o.orientations,l))r[n]=l;else if(o.orientations===1){let i=new Array(o.numPieces);for(let s=0;s<o.numPieces;s++)i[l.permutation[s]]=s;r[n]={permutation:i,orientation:l.orientation}}else{let i=new Array(o.numPieces),s=new Array(o.numPieces);for(let u=0;u<o.numPieces;u++){let a=l.permutation[u];i[a]=u,s[a]=(o.orientations-l.orientation[u]+o.orientations)%o.orientations}r[n]={permutation:i,orientation:s}}}return r}function On(e,t,r,n,o={}){let l=e.orbits[t],i=r[t],s=n[t];for(let u=0;u<l.numPieces;u++)if(!(o==null?void 0:o.ignoreOrientation)&&i.orientation[u]!==s.orientation[u]||!(o==null?void 0:o.ignorePermutation)&&i.permutation[u]!==s.permutation[u])return!1;return!0}function qo(e,t,r){for(let n in e.orbits)if(!On(e,n,t,r))return!1;return!0}function Fi(e,t,r){return qo(e,it(e,e.startPieces,t),it(e,e.startPieces,r))}var jr,Wn=S(()=>{});function jo(e,t){let r=Y1(e).lookupMove(t);if(!r)throw new Error("Unknown move: "+t.toString());return r}function Y1(e){return e.moveNotation||(e.moveNotation=new Ha(e)),e.moveNotation}var Ha,Je,yi=S(()=>{he();Wn();Ha=class{constructor(t){this.def=t;this.cache={}}lookupMove(t){let r=t.toString(),n=this.cache[r];if(n)return n;let o=t.quantum.toString();return n=this.def.moves[o],n?(n=Kr(this.def,n,t.amount),this.cache[r]=n):(n=this.def.moves[t.toString()],n?this.cache[r]=n:(n=this.def.moves[t.invert().toString()],n&&(n=Kr(this.def,n,-1),this.cache[r]=n))),n}},Je=class{constructor(t){this.definition=t;this.state=ht(t)}reset(){this.state=ht(this.definition)}serialize(){let t="";for(let r in this.definition.orbits)t+=r+\`
\`,t+=this.state[r].permutation.join(" ")+\`
\`,t+=this.state[r].orientation.join(" ")+\`
\`;return t=t.slice(0,t.length-1),t}applyMove(t){this.state=it(this.definition,this.state,jo(this.definition,t))}applyAlg(t){for(let r of t.experimentalLeafMoves())this.applyMove(r)}}});var Ya=S(()=>{Wn()});function Z1(e,t){function r(){this.constructor=e}r.prototype=t.prototype,e.prototype=new r}function Bi(e,t,r,n){this.message=e,this.expected=t,this.found=r,this.location=n,this.name="SyntaxError",typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,Bi)}var Za=S(()=>{Z1(Bi,Error);Bi.buildMessage=function(e,t){var r={literal:function(a){return'"'+o(a.text)+'"'},class:function(a){var f=a.parts.map(function(g){return Array.isArray(g)?l(g[0])+"-"+l(g[1]):l(g)});return"["+(a.inverted?"^":"")+f+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(a){return a.description}};function n(a){return a.charCodeAt(0).toString(16).toUpperCase()}function o(a){return a.replace(/\\\\/g,"\\\\\\\\").replace(/"/g,'\\\\"').replace(/\\0/g,"\\\\0").replace(/\\t/g,"\\\\t").replace(/\\n/g,"\\\\n").replace(/\\r/g,"\\\\r").replace(/[\\x00-\\x0F]/g,function(f){return"\\\\x0"+n(f)}).replace(/[\\x10-\\x1F\\x7F-\\x9F]/g,function(f){return"\\\\x"+n(f)})}function l(a){return a.replace(/\\\\/g,"\\\\\\\\").replace(/\\]/g,"\\\\]").replace(/\\^/g,"\\\\^").replace(/-/g,"\\\\-").replace(/\\0/g,"\\\\0").replace(/\\t/g,"\\\\t").replace(/\\n/g,"\\\\n").replace(/\\r/g,"\\\\r").replace(/[\\x00-\\x0F]/g,function(f){return"\\\\x0"+n(f)}).replace(/[\\x10-\\x1F\\x7F-\\x9F]/g,function(f){return"\\\\x"+n(f)})}function i(a){return r[a.type](a)}function s(a){var f=a.map(i),g,c;if(f.sort(),f.length>0){for(g=1,c=1;g<f.length;g++)f[g-1]!==f[g]&&(f[c]=f[g],c++);f.length=c}switch(f.length){case 1:return f[0];case 2:return f[0]+" or "+f[1];default:return f.slice(0,-1).join(", ")+", or "+f[f.length-1]}}function u(a){return a?'"'+o(a)+'"':"end of input"}return"Expected "+s(e)+" but "+u(t)+" found."}});var Xa=S(()=>{Za()});var Ja=S(()=>{Xa()});var $a=S(()=>{});var ue,bi=S(()=>{ue={name:"3x3x3",orbits:{EDGES:{numPieces:12,orientations:2},CORNERS:{numPieces:8,orientations:3},CENTERS:{numPieces:6,orientations:4}},startPieces:{EDGES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11],orientation:[0,0,0,0,0,0,0,0,0,0,0,0]},CORNERS:{permutation:[0,1,2,3,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,0,0,0,0,0]}},moves:{U:{EDGES:{permutation:[1,2,3,0,4,5,6,7,8,9,10,11],orientation:[0,0,0,0,0,0,0,0,0,0,0,0]},CORNERS:{permutation:[1,2,3,0,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[1,0,0,0,0,0]}},y:{EDGES:{permutation:[1,2,3,0,5,6,7,4,10,8,11,9],orientation:[0,0,0,0,0,0,0,0,1,1,1,1]},CORNERS:{permutation:[1,2,3,0,7,4,5,6],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,2,3,4,1,5],orientation:[1,0,0,0,0,3]}},x:{EDGES:{permutation:[4,8,0,9,6,10,2,11,5,7,1,3],orientation:[1,0,1,0,1,0,1,0,0,0,0,0]},CORNERS:{permutation:[4,0,3,5,7,6,2,1],orientation:[2,1,2,1,1,2,1,2]},CENTERS:{permutation:[2,1,5,3,0,4],orientation:[0,3,0,1,2,2]}},L:{EDGES:{permutation:[0,1,2,11,4,5,6,9,8,3,10,7],orientation:[0,0,0,0,0,0,0,0,0,0,0,0]},CORNERS:{permutation:[0,1,6,2,4,3,5,7],orientation:[0,0,2,1,0,2,1,0]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,1,0,0,0,0]}},F:{EDGES:{permutation:[9,1,2,3,8,5,6,7,0,4,10,11],orientation:[1,0,0,0,1,0,0,0,1,1,0,0]},CORNERS:{permutation:[3,1,2,5,0,4,6,7],orientation:[1,0,0,2,2,1,0,0]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,0,1,0,0,0]}},R:{EDGES:{permutation:[0,8,2,3,4,10,6,7,5,9,1,11],orientation:[0,0,0,0,0,0,0,0,0,0,0,0]},CORNERS:{permutation:[4,0,2,3,7,5,6,1],orientation:[2,1,0,0,1,0,0,2]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,0,0,1,0,0]}},B:{EDGES:{permutation:[0,1,10,3,4,5,11,7,8,9,6,2],orientation:[0,0,1,0,0,0,1,0,0,0,1,1]},CORNERS:{permutation:[0,7,1,3,4,5,2,6],orientation:[0,2,1,0,0,0,2,1]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,0,0,0,1,0]}},D:{EDGES:{permutation:[0,1,2,3,7,4,5,6,8,9,10,11],orientation:[0,0,0,0,0,0,0,0,0,0,0,0]},CORNERS:{permutation:[0,1,2,3,5,6,7,4],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,1,2,3,4,5],orientation:[0,0,0,0,0,1]}},z:{EDGES:{permutation:[9,3,11,7,8,1,10,5,0,4,2,6],orientation:[1,1,1,1,1,1,1,1,1,1,1,1]},CORNERS:{permutation:[3,2,6,5,0,4,7,1],orientation:[1,2,1,2,2,1,2,1]},CENTERS:{permutation:[1,5,2,0,4,3],orientation:[1,1,1,1,3,1]}},M:{EDGES:{permutation:[2,1,6,3,0,5,4,7,8,9,10,11],orientation:[1,0,1,0,1,0,1,0,0,0,0,0]},CORNERS:{permutation:[0,1,2,3,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[4,1,0,3,5,2],orientation:[2,0,0,0,2,0]}},E:{EDGES:{permutation:[0,1,2,3,4,5,6,7,9,11,8,10],orientation:[0,0,0,0,0,0,0,0,1,1,1,1]},CORNERS:{permutation:[0,1,2,3,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,4,1,2,3,5],orientation:[0,0,0,0,0,0]}},S:{EDGES:{permutation:[0,3,2,7,4,1,6,5,8,9,10,11],orientation:[0,1,0,1,0,1,0,1,0,0,0,0]},CORNERS:{permutation:[0,1,2,3,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[1,5,2,0,4,3],orientation:[1,1,0,1,0,1]}},u:{EDGES:{permutation:[1,2,3,0,4,5,6,7,10,8,11,9],orientation:[0,0,0,0,0,0,0,0,1,1,1,1]},CORNERS:{permutation:[1,2,3,0,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,2,3,4,1,5],orientation:[1,0,0,0,0,0]}},l:{EDGES:{permutation:[2,1,6,11,0,5,4,9,8,3,10,7],orientation:[1,0,1,0,1,0,1,0,0,0,0,0]},CORNERS:{permutation:[0,1,6,2,4,3,5,7],orientation:[0,0,2,1,0,2,1,0]},CENTERS:{permutation:[4,1,0,3,5,2],orientation:[2,1,0,0,2,0]}},f:{EDGES:{permutation:[9,3,2,7,8,1,6,5,0,4,10,11],orientation:[1,1,0,1,1,1,0,1,1,1,0,0]},CORNERS:{permutation:[3,1,2,5,0,4,6,7],orientation:[1,0,0,2,2,1,0,0]},CENTERS:{permutation:[1,5,2,0,4,3],orientation:[1,1,1,1,0,1]}},r:{EDGES:{permutation:[4,8,0,3,6,10,2,7,5,9,1,11],orientation:[1,0,1,0,1,0,1,0,0,0,0,0]},CORNERS:{permutation:[4,0,2,3,7,5,6,1],orientation:[2,1,0,0,1,0,0,2]},CENTERS:{permutation:[2,1,5,3,0,4],orientation:[0,0,0,1,2,2]}},b:{EDGES:{permutation:[0,5,10,1,4,7,11,3,8,9,6,2],orientation:[0,1,1,1,0,1,1,1,0,0,1,1]},CORNERS:{permutation:[0,7,1,3,4,5,2,6],orientation:[0,2,1,0,0,0,2,1]},CENTERS:{permutation:[3,0,2,5,4,1],orientation:[3,3,0,3,1,3]}},d:{EDGES:{permutation:[0,1,2,3,7,4,5,6,9,11,8,10],orientation:[0,0,0,0,0,0,0,0,1,1,1,1]},CORNERS:{permutation:[0,1,2,3,5,6,7,4],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,4,1,2,3,5],orientation:[0,0,0,0,0,1]}}}};ue.moves.Uw=ue.moves.u;ue.moves.Lw=ue.moves.l;ue.moves.Fw=ue.moves.f;ue.moves.Rw=ue.moves.r;ue.moves.Bw=ue.moves.b;ue.moves.Dw=ue.moves.d;ue.moves.Rv=ue.moves.x;ue.moves.Uv=ue.moves.y;ue.moves.Fv=ue.moves.z;ue.moves.Lv={EDGES:{permutation:[2,10,6,11,0,8,4,9,1,3,5,7],orientation:[1,0,1,0,1,0,1,0,0,0,0,0]},CORNERS:{permutation:[1,7,6,2,0,3,5,4],orientation:[2,1,2,1,1,2,1,2]},CENTERS:{permutation:[4,1,0,3,5,2],orientation:[2,1,0,3,2,0]}};ue.moves.Dv={EDGES:{permutation:[3,0,1,2,7,4,5,6,9,11,8,10],orientation:[0,0,0,0,0,0,0,0,1,1,1,1]},CORNERS:{permutation:[3,0,1,2,5,6,7,4],orientation:[0,0,0,0,0,0,0,0]},CENTERS:{permutation:[0,4,1,2,3,5],orientation:[3,0,0,0,0,1]}};ue.moves.Bv={EDGES:{permutation:[8,5,10,1,9,7,11,3,4,0,6,2],orientation:[1,1,1,1,1,1,1,1,1,1,1,1]},CORNERS:{permutation:[4,7,1,0,5,3,2,6],orientation:[1,2,1,2,2,1,2,1]},CENTERS:{permutation:[3,0,2,5,4,1],orientation:[3,3,3,3,1,3]}}});var e0=S(()=>{});function t0(e){let t=e.CENTERS.permutation[0],r=e.CENTERS.permutation[5],n=e.CENTERS.permutation[1],o=n;return t<n&&o--,r<n&&o--,[t,o]}var J1,xi=S(()=>{he();At();At();J1=new Array(6).fill(0).map(()=>new Array(6));{let e=new Je(ue),t=["","z","x","z'","x'","x2"].map(n=>z.fromString(n)),r=new z("y");for(let n of t){e.reset(),e.applyAlg(n);for(let o=0;o<4;o++){e.applyAlg(r);let[l,i]=t0(e.state);J1[l][i]=_t(ue,e.state)}}}});var Si=S(()=>{e0();xi()});var n0=S(()=>{});var o0=S(()=>{Si();n0();xi();Si()});var l0=S(()=>{o0();bi();Wn()});var At=S(()=>{yi();Ya();Wn();Ja();$a();bi();l0();yi()});var i0=S(()=>{});function ag(e){switch(e){case v.Regular:return $1;case v.Dim:return lg;case v.Ignored:return eg;case v.OrientationStickers:return tg;case v.Invisible:return rg;case v.IgnoreNonPrimary:return ng;case v.PermuteNonPrimary:return og;case v.Ignoriented:return ig;case v.OrientationWithoutPermutation:return sg}}var v,Vr,Ut,Ge,Hr,Ko,Dr,$1,eg,tg,rg,ng,og,lg,ig,sg,Qn,qn,jn=S(()=>{he();he();At();(function(a){a.Regular="Regular",a.Dim="Dim",a.Ignored="Ignored",a.OrientationStickers="OrientationStickers",a.Invisible="Invisible",a.Ignoriented="Ignoriented",a.IgnoreNonPrimary="IgnoreNonPrimary",a.PermuteNonPrimary="PermuteNonPrimary",a.OrientationWithoutPermutation="OrientationWithoutPermutation"})(v||(v={}));Vr=class{constructor(t,r){this.stickerings=new Map;for(let[n,o]of Object.entries(t.orbits))this.stickerings.set(n,new Array(o.numPieces).fill(r))}},Ut="regular",Ge="ignored",Hr="oriented",Ko="invisible",Dr="dim",$1={facelets:[Ut,Ut,Ut,Ut,Ut]},eg={facelets:[Ge,Ge,Ge,Ge,Ge]},tg={facelets:[Hr,Hr,Hr,Hr,Hr]},rg={facelets:[Ko,Ko,Ko,Ko]},ng={facelets:[Ut,Ge,Ge,Ge,Ge]},og={facelets:[Dr,Ut,Ut,Ut,Ut]},lg={facelets:[Dr,Dr,Dr,Dr,Dr]},ig={facelets:[Dr,Ge,Ge,Ge,Ge]},sg={facelets:[Hr,Ge,Ge,Ge,Ge]};Qn=class extends Vr{constructor(t){super(t,v.Regular)}set(t,r){for(let[n,o]of this.stickerings.entries())for(let l=0;l<o.length;l++)t.stickerings.get(n)[l]&&(o[l]=r);return this}toAppearance(){let t={orbits:{}};for(let[r,n]of this.stickerings.entries()){let o=[],l={pieces:o};t.orbits[r]=l;for(let i of n)o.push(ag(i))}return t}},qn=class{constructor(t){this.def=t}and(t){let r=new Vr(this.def,!1);for(let[n,o]of Object.entries(this.def.orbits)){e:for(let l=0;l<o.numPieces;l++){r.stickerings.get(n)[l]=!0;for(let i of t)if(!i.stickerings.get(n)[l]){r.stickerings.get(n)[l]=!1;continue e}}}return r}or(t){let r=new Vr(this.def,!1);for(let[n,o]of Object.entries(this.def.orbits)){e:for(let l=0;l<o.numPieces;l++){r.stickerings.get(n)[l]=!1;for(let i of t)if(i.stickerings.get(n)[l]){r.stickerings.get(n)[l]=!0;continue e}}}return r}not(t){let r=new Vr(this.def,!1);for(let[n,o]of Object.entries(this.def.orbits))for(let l=0;l<o.numPieces;l++)r.stickerings.get(n)[l]=!t.stickerings.get(n)[l];return r}all(){return this.and(this.moves([]))}move(t){let r=jo(this.def,lt(t,d)?t:d.fromString(t)),n=new Vr(this.def,!1);for(let[o,l]of Object.entries(this.def.orbits))for(let i=0;i<l.numPieces;i++)(r[o].permutation[i]!==i||r[o].orientation[i]!==0)&&(n.stickerings.get(o)[i]=!0);return n}moves(t){return t.map(r=>this.move(r))}}});function ug(e){(()=>h(this,null,function*(){s0=e;let t=Array.from(document.body.querySelectorAll("twisty-player"));console.log(\`Setting the custom stickering for \${t.length} players!\`);let r=[];for(let n of t)r.push((()=>h(this,null,function*(){let o=yield n.experimentalModel.stickeringProp.get();n.experimentalStickering=o==="experimental-global-custom-1"?"experimental-global-custom-2":"experimental-global-custom-1"}))());yield Promise.all(r),console.log("Success!")}))()}function a0(e,t){s0(e,t)}var s0,u0=S(()=>{jn();s0=()=>{};globalThis.location&&new URL(location.href).searchParams.get("global-custom-stickerer")==="true"&&(window.setGlobalCustomStickerer=ug,window.PieceStickering=v,console.log("Global custom stickerer enabled! (using: global-custom-stickerer=true)"),console.log("Look here for inspiration:","https://github.com/cubing/cubing.js/blob/81b5cab3e27d8defb39dd1e0a10bc9e8ba894d26/src/cubing/puzzles/stickerings/cube-stickerings.ts#L67"))});function Rt(e,t){return h(this,null,function*(){let r=yield e.def(),n=new Qn(r),o=new qn(r),l=()=>o.move("U"),i=()=>o.or(o.moves(["U","D"])),s=()=>o.not(i()),u=()=>o.or(o.moves(["L","R"])),a=()=>o.not(u()),f=()=>o.or(o.moves(["F","B"])),g=()=>o.not(f()),c=()=>o.not(l()),m=()=>o.and([l(),a(),g()]),L=()=>o.and([o.and(o.moves(["F","R"])),o.not(i())]),p=()=>o.and(o.moves(["D","R","F"])),F=()=>o.or([p(),L()]),y=()=>o.or([o.and([a(),s()]),o.and([a(),g()]),o.and([s(),g()])]),x=()=>o.or([o.and([a(),i(),f()]),o.and([s(),u(),f()]),o.and([g(),i(),u()])]),B=()=>o.not(o.or([y(),x()])),P=()=>o.or([a(),o.and([l(),x()])]);function k(){n.set(c(),v.Dim)}function K(){n.set(l(),v.PermuteNonPrimary),n.set(m(),v.Dim)}function te(){n.set(l(),v.IgnoreNonPrimary),n.set(m(),v.Regular)}function N(){n.set(l(),v.Ignoriented),n.set(m(),v.Dim)}switch(t){case"full":break;case"PLL":k(),K();break;case"CLS":k(),n.set(o.and(o.moves(["D","R","F"])),v.Regular),n.set(l(),v.Ignoriented),n.set(o.and([l(),B()]),v.IgnoreNonPrimary);break;case"OLL":k(),te();break;case"COLL":k(),K(),n.set(o.and([l(),B()]),v.Regular);break;case"OCLL":k(),N(),n.set(o.and([l(),B()]),v.IgnoreNonPrimary);break;case"CLL":k(),n.set(o.not(o.and([B(),l()])),v.Dim);break;case"ELL":k(),n.set(l(),v.Dim),n.set(o.and([l(),x()]),v.Regular);break;case"ELS":k(),te(),n.set(o.and([l(),B()]),v.Ignored),n.set(L(),v.Regular),n.set(p(),v.Ignored);break;case"LL":k();break;case"F2L":n.set(l(),v.Ignored);break;case"ZBLL":k(),n.set(l(),v.PermuteNonPrimary),n.set(m(),v.Dim),n.set(o.and([l(),B()]),v.Regular);break;case"ZBLS":k(),n.set(F(),v.Regular),te(),n.set(o.and([l(),B()]),v.Ignored);break;case"WVLS":case"VLS":k(),n.set(F(),v.Regular),te();break;case"LS":k(),n.set(F(),v.Regular),n.set(l(),v.Ignored),n.set(m(),v.Dim);break;case"EO":n.set(B(),v.Ignored),n.set(x(),v.OrientationWithoutPermutation);break;case"EOline":n.set(B(),v.Ignored),n.set(x(),v.OrientationWithoutPermutation),n.set(o.and(o.moves(["D","M"])),v.Regular);break;case"EOcross":n.set(x(),v.OrientationWithoutPermutation),n.set(o.move("D"),v.Regular),n.set(B(),v.Ignored);break;case"CMLL":n.set(c(),v.Dim),n.set(P(),v.Ignored),n.set(o.and([l(),B()]),v.Regular);break;case"L6E":n.set(o.not(P()),v.Dim);break;case"L6EO":n.set(o.not(P()),v.Dim),n.set(P(),v.OrientationWithoutPermutation),n.set(o.and([y(),i()]),v.OrientationStickers);break;case"Daisy":n.set(o.all(),v.Ignored),n.set(y(),v.Dim),n.set(o.and([o.move("D"),y()]),v.Regular),n.set(o.and([o.move("U"),x()]),v.IgnoreNonPrimary);break;case"Cross":n.set(o.all(),v.Ignored),n.set(y(),v.Dim),n.set(o.and([o.move("D"),y()]),v.Regular),n.set(o.and([o.move("D"),x()]),v.Regular);break;case"2x2x2":n.set(o.or(o.moves(["U","F","R"])),v.Ignored),n.set(o.and([o.or(o.moves(["U","F","R"])),y()]),v.Dim);break;case"2x2x3":n.set(o.all(),v.Dim),n.set(o.or(o.moves(["U","F","R"])),v.Ignored),n.set(o.and([o.or(o.moves(["U","F","R"])),y()]),v.Dim),n.set(o.and([o.move("F"),o.not(o.or(o.moves(["U","R"])))]),v.Regular);break;case"Void Cube":n.set(y(),v.Invisible);break;case"picture":case"invisible":n.set(o.all(),v.Invisible);break;case"centers-only":n.set(o.not(y()),v.Ignored);break;case"experimental-global-custom-1":case"experimental-global-custom-2":a0(n,o);break;default:console.warn(\`Unsupported stickering for \${e.id}: \${t}. Setting all pieces to dim.\`),n.set(o.and(o.moves([])),v.Dim)}return n.toAppearance()})}function Yr(){return h(this,null,function*(){return["full","PLL","CLS","OLL","COLL","OCLL","ELL","ELS","LL","F2L","ZBLL","ZBLS","WVLS","VLS","LS","EO","EOline","EOcross","CMLL","L6E","L6EO","Daisy","Cross","2x2x2","2x2x3","Void Cube","picture","invisible","centers-only","experimental-global-custom-1","experimental-global-custom-2"]})}var Zr=S(()=>{jn();u0()});var Kn,f0=S(()=>{Kn=class{constructor(t,r){this.facenames=t;this.prefixFree=!0;this.gripnames=[];r&&(this.gripnames=r);for(let n=0;this.prefixFree&&n<t.length;n++)for(let o=0;this.prefixFree&&o<t.length;o++)n!==o&&t[n].startsWith(t[o])&&(this.prefixFree=!1)}setGripNames(t){this.gripnames=t}splitByFaceNames(t){let r=[],n=0;for(;n<t.length;){n>0&&n<t.length&&t[n]==="_"&&n++;let o=-1;for(let l=0;l<this.facenames.length;l++)t.substr(n).startsWith(this.facenames[l])&&(o<0||this.facenames[l].length>this.facenames[o].length)&&(o=l);if(o>=0)r.push(o),n+=this.facenames[o].length;else throw new Error("Could not split "+t+" into face names.")}return r}joinByFaceIndices(t){let r="",n=[];for(let o=0;o<t.length;o++)n.push(r),n.push(this.facenames[t[o]]),this.prefixFree||(r="_");return n.join("")}spinmatch(t,r){if(t===r)return!0;try{let n=this.splitByFaceNames(t),o=this.splitByFaceNames(r);if(n.length!==o.length&&n.length<3)return!1;for(let l=0;l<n.length;l++){for(let s=0;s<l;s++)if(n[l]===n[s])return!1;let i=!1;for(let s=0;s<o.length;s++)if(n[l]===o[s]){i=!0;break}if(!i)return!1}return!0}catch(n){return!1}}unswizzle(t){(t.endsWith("v")||t.endsWith("w"))&&t[0]<="Z"&&(t=t.slice(0,t.length-1));let r=t.toUpperCase();for(let n=0;n<this.gripnames.length;n++){let o=this.gripnames[n];if(this.spinmatch(r,o))return o}return t}}});var Xr,g0=S(()=>{Xr=class{notationToInternal(t){return t}notationToExternal(t){return t}}});var Vo,c0=S(()=>{he();Vo=class{constructor(t,r){this.child=t;this.sw=r}notationToInternal(t){return t.family==="T"&&t.innerLayer===void 0&&t.outerLayer===void 0?new d(new G("FLRv",t.innerLayer,t.outerLayer),t.amount):this.child.notationToInternal(t)}notationToExternal(t){let r=t.family;return r.length>0&&r[r.length-1]==="v"&&(r=r.substring(0,r.length-1)),this.sw.spinmatch(r,"FLUR")?new d(new G("T",t.innerLayer,t.outerLayer),t.amount):this.child.notationToExternal(t)}}});var Vn,m0=S(()=>{he();Vn=class{constructor(t,r){this.internalNames=t;this.externalNames=r}convertString(t,r,n){let o="";(t.endsWith("v")||t.endsWith("v"))&&t<="_"&&(o=t.slice(t.length-1),t=t.slice(0,t.length-1));let l=t.toUpperCase(),i=!1;return t!==l&&(i=!0,t=l),t=n.joinByFaceIndices(r.splitByFaceNames(t)),i&&(t=t.toLowerCase()),t+o}convert(t,r,n){let o=t.family,l=this.convertString(o,r,n);return o===l?t:new d(new G(l,t.innerLayer,t.outerLayer),t.amount)}notationToInternal(t){return this.convert(t,this.externalNames,this.internalNames)}notationToExternal(t){return this.convert(t,this.internalNames,this.externalNames)}}});var Ho,p0=S(()=>{he();Ho=class{constructor(t){this.child=t}notationToInternal(t){if(t.innerLayer===void 0&&t.outerLayer===void 0){if(Math.abs(t.amount)===1){if(t.family==="R++")return new d(new G("L",3,2),-2*t.amount);if(t.family==="R--")return new d(new G("L",3,2),2*t.amount);if(t.family==="D++")return new d(new G("U",3,2),-2*t.amount);if(t.family==="D--")return new d(new G("U",3,2),2*t.amount);if(t.family==="R_PLUSPLUS_")return new d(new G("L",3,2),-2*t.amount);if(t.family==="D_PLUSPLUS_")return new d(new G("U",3,2),-2*t.amount)}if(t.family==="y")return new d("Uv",t.amount)}return this.child.notationToInternal(t)}notationToExternal(t){return t.family==="Uv"?new d(new G("y",t.innerLayer,t.outerLayer),t.amount):t.family==="Dv"?new d("y",-t.amount):this.child.notationToExternal(t)}}});var Yo,d0=S(()=>{he();Yo=class{constructor(t){this.slices=t}notationToInternal(t){let r=t.family;return!t.innerLayer&&!t.outerLayer&&(r==="x"?t=new d("Rv",t.amount):r==="y"?t=new d("Uv",t.amount):r==="z"&&(t=new d("Fv",t.amount)),(this.slices&1)==1&&(r==="E"?t=new d(new G("D",(this.slices+1)/2),t.amount):r==="M"?t=new d(new G("L",(this.slices+1)/2),t.amount):r==="S"&&(t=new d(new G("F",(this.slices+1)/2),t.amount))),this.slices>2&&(r==="e"?t=new d(new G("D",this.slices-1,2),t.amount):r==="m"?t=new d(new G("L",this.slices-1,2),t.amount):r==="s"&&(t=new d(new G("F",this.slices-1,2),t.amount)))),t}notationToExternal(t){let r=t.family;if(!t.innerLayer&&!t.outerLayer){if(r==="Rv")return new d("x",t.amount);if(r==="Uv")return new d("y",t.amount);if(r==="Fv")return new d("z",t.amount);if(r==="Lv")return new d("x",-t.amount);if(r==="Dv")return new d("y",-t.amount);if(r==="Bv")return new d("z",-t.amount)}return t}}});var fg,gg,L0,h0,A0,Hn,Zo,R0=S(()=>{he();fg={U:"frl",L:"fld",R:"fdr",B:"dlr",u:"FRL",l:"FLD",r:"FDR",b:"DLR",Uv:"FRLv",Lv:"FLDv",Rv:"FDRv",Bv:"DLRv",D:"D",F:"F",BL:"L",BR:"R"},gg={U:"FRL",L:"FLD",R:"FDR",B:"DLR",u:"frl",l:"fld",r:"fdr",b:"dlr",Uv:"FRLv",Lv:"FLDv",Rv:"FDRv",Bv:"DLRv",D:"D",F:"F",BL:"L",BR:"R",d:"d",f:"f",bl:"l",br:"r"},L0={U:"FRL",L:"FLD",R:"FDR",B:"DLR"},h0=new G("y"),A0=new G("Dv"),Hn=class{constructor(t){this.child=t;this.wcaHack=!1;this.map=fg}notationToInternal(t){if(this.wcaHack&&t.innerLayer===2&&t.outerLayer===null){let n=L0[t.family];if(n)return new d(new G(n,t.innerLayer,t.outerLayer),t.amount)}let r=this.map[t.family];return r?new d(new G(r,t.innerLayer,t.outerLayer),t.amount):h0.isIdentical(t.quantum)?new d(A0,-t.amount):null}notationToExternal(t){if(this.wcaHack&&t.innerLayer===2&&t.outerLayer===null){for(let[r,n]of Object.entries(L0))if(this.child.spinmatch(t.family,n))return new d(new G(r,t.innerLayer,t.outerLayer),t.amount)}for(let[r,n]of Object.entries(this.map))if(this.child.spinmatch(t.family,n))return new d(new G(r,t.innerLayer,t.outerLayer),t.amount);return A0.isIdentical(t.quantum)?new d(h0,-t.amount):null}},Zo=class extends Hn{constructor(t){super(t);this.map=gg}}});var D0,F0,y0,B0,b0,x0,S0,Xo,v0=S(()=>{he();D0={U:"UBL",UL:"ULF",F:"UFR",UR:"URB",B:"DBL",D:"DFR",L:"DLF",R:"DRB",Uv:"UBLv",ULv:"ULFv",Fv:"UFRv",URv:"URBv",Bv:"DBLv",Dv:"DFRv",Lv:"DLFv",Rv:"DRBv"},F0=new G("x"),y0=new G("Rv"),B0=new G("y"),b0=new G("Uv"),x0=new G("z"),S0=new G("Fv"),Xo=class{constructor(t){this.child=t}notationToInternal(t){if(t.innerLayer||t.outerLayer)return null;let r=D0[t.family];return r?new d(new G(r,t.outerLayer,t.innerLayer),t.amount):F0.isIdentical(t.quantum)?new d(y0,t.amount):B0.isIdentical(t.quantum)?new d(b0,t.amount):x0.isIdentical(t.quantum)?new d(S0,t.amount):null}notationToExternal(t){for(let[r,n]of Object.entries(D0))if(this.child.spinmatch(t.family,n))return new d(new G(r,t.innerLayer,t.outerLayer),t.amount);return y0.isIdentical(t.quantum)?new d(F0,t.amount):b0.isIdentical(t.quantum)?new d(B0,t.amount):S0.isIdentical(t.quantum)?new d(x0,t.amount):null}}});var vi=S(()=>{g0();c0();m0();p0();d0();R0();v0()});function w0(e){let t=0,r={};for(;t<e.length&&e[t][0]==="-";){let o=e[t++];if(o==="--rotations")r.addRotations=!0;else if(o==="--allmoves")r.allMoves=!0;else if(o==="--outerblockmoves")r.outerBlockMoves=!0;else if(o==="--vertexmoves")r.vertexMoves=!0;else if(o==="--nocorners")r.includeCornerOrbits=!1;else if(o==="--noedges")r.includeEdgeOrbits=!1;else if(o==="--noorientation")r.fixedOrientation=!0;else if(o==="--nocenters")r.includeCenterOrbits=!1;else if(o==="--omit")r.excludeOrbits=e[t].split(","),t++;else if(o==="--moves")r.moveList=e[t].split(","),t++;else if(o==="--optimize")r.optimizeOrbits=!0;else if(o==="--scramble")r.scrambleAmount=100;else if(o==="--fixcorner")r.fixedPieceType="v";else if(o==="--fixedge")r.fixedPieceType="e";else if(o==="--fixcenter")r.fixedPieceType="f";else if(o==="--orientcenters")r.orientCenters=!0;else if(o==="--puzzleorientation")r.puzzleOrientation=JSON.parse(e[t]),t++;else throw new Error("Bad option: "+o)}return{puzzleDescription:Yn(e.slice(t).join(" ")),options:r}}var wi,Ui=S(()=>{Ei();wi=class{constructor(t={}){this.verbosity=0;this.allMoves=!1;this.vertexMoves=!1;this.addRotations=!1;this.moveList=null;this.fixedOrientation=!1;this.fixedPieceType=null;this.orientCenters=!1;this.includeCornerOrbits=!0;this.includeCenterOrbits=!0;this.includeEdgeOrbits=!0;this.excludeOrbits=[];this.optimizeOrbits=!1;this.grayCorners=!1;this.grayCenters=!1;this.grayEdges=!1;this.puzzleOrientation=null;this.puzzleOrientations=null;this.scrambleAmount=0;Object.assign(this,t)}}});function Jt(e){if(!ki[e]){let t=Array(e);for(let r=0;r<e;r++)t[r]=0;ki[e]=t}return ki[e]}function Et(e){if(!zi[e]){let t=Array(e);for(let r=0;r<e;r++)t[r]=r;zi[e]=t}return zi[e]}function U0(e){return new ft(Et(e))}function E0(e){let t=1;for(;e>1;)t*=e,e--;return t}function cg(e,t){if(e>t){let r=e;e=t,t=r}for(;e>0;){let r=t%e;t=e,e=r}return t}function Ci(e,t){return e/cg(e,t)*t}var ki,zi,ft,Jo=S(()=>{ki=[],zi=[];ft=class{constructor(t){this.n=t.length,this.p=t}toString(){return"Perm["+this.p.join(" ")+"]"}mul(t){let r=Array(this.n);for(let n=0;n<this.n;n++)r[n]=t.p[this.p[n]];return new ft(r)}rmul(t){let r=Array(this.n);for(let n=0;n<this.n;n++)r[n]=this.p[t.p[n]];return new ft(r)}inv(){let t=Array(this.n);for(let r=0;r<this.n;r++)t[this.p[r]]=r;return new ft(t)}compareTo(t){for(let r=0;r<this.n;r++)if(this.p[r]!==t.p[r])return this.p[r]-t.p[r];return 0}toGap(){let t=new Array,r=new Array(this.n);for(let n=0;n<this.p.length;n++){if(r[n]||this.p[n]===n)continue;let o=new Array;for(let l=n;!r[l];l=this.p[l])o.push(1+l),r[l]=!0;t.push("("+o.join(",")+")")}return t.join("")}order(){let t=1,r=new Array(this.n);for(let n=0;n<this.p.length;n++){if(r[n]||this.p[n]===n)continue;let o=0;for(let l=n;!r[l];l=this.p[l])o++,r[l]=!0;t=Ci(t,o)}return t}}});function Pi(e,t){let r=d.fromString(t),n=e.notationToExternal(r);return n===null||r===n?t:n.toString()}function k0(e,t){let r=e.moveops.length;if(r>30)throw new Error("Canon info too big for bitmask");let n=[],o=[];for(let i=0;i<r;i++){let s=e.moveops[i];n.push(s.order());let u=0;for(let a=0;a<r;a++){if(a===i)continue;let f=e.moveops[a];s.mul(f).equal(f.mul(s))&&(u|=1<<a)}o.push(u)}let l={};l[0]=1;for(let i=0;i<100;i++){let s=0,u={},a=0;for(let f in l){let g=+f,c=l[g];s+=c,a++;for(let m=0;m<n.length;m++)if((g>>m&1)==0&&(g&o[m]&(1<<m)-1)==0){let L=g&o[m]|1<<m;u[L]===void 0&&(u[L]=0),u[L]+=(n[m]-1)*c}}t(\`\${i}: canonseq \${s} states \${a}\`),l=u}}var Zn,Jr,Dt,Ot,Mi,$t,$r,Ii,z0=S(()=>{he();vi();Jo();Zn=class{constructor(t,r){this.size=t;this.mod=r}reassemblySize(){return E0(this.size)*Math.pow(this.mod,this.size)}};Jr=class{constructor(t,r,n,o,l){this.orbitnames=t;this.orbitdefs=r;this.solved=n;this.movenames=o;this.moveops=l}transformToKPuzzle(t){let r={};for(let n=0;n<this.orbitnames.length;n++)r[this.orbitnames[n]]=t.orbits[n].toKPuzzle();return r}static transformToKPuzzle(t,r){let n={};for(let o=0;o<t.length;o++)n[t[o]]=r.orbits[o].toKPuzzle();return n}toKsolve(t,r=new Xr){let n=[];n.push("Name "+t),n.push("");for(let o=0;o<this.orbitnames.length;o++)n.push(\`Set \${this.orbitnames[o]} \${this.orbitdefs[o].size} \${this.orbitdefs[o].mod}\`);n.push(""),n.push("Solved");for(let o=0;o<this.orbitnames.length;o++)this.solved.orbits[o].appendDefinition(n,this.orbitnames[o],!1,!1);n.push("End");for(let o=0;o<this.movenames.length;o++){n.push("");let l=Pi(r,this.movenames[o]),i=!1;l[l.length-1]==="'"&&(i=!0,l=l.substring(0,l.length-1)),n.push("Move "+l);for(let s=0;s<this.orbitnames.length;s++)i?this.moveops[o].orbits[s].inv().appendDefinition(n,this.orbitnames[s],!0):this.moveops[o].orbits[s].appendDefinition(n,this.orbitnames[s],!0);n.push("End")}return n}toKPuzzle(t){let r={},n={};for(let l=0;l<this.orbitnames.length;l++)r[this.orbitnames[l]]={numPieces:this.orbitdefs[l].size,orientations:this.orbitdefs[l].mod},n[this.orbitnames[l]]=this.solved.orbits[l].toKPuzzle();let o={};if(t)for(let l=0;l<this.movenames.length;l++)o[this.movenames[l]]=this.transformToKPuzzle(this.moveops[l]);return{name:"PG3D",orbits:r,startPieces:n,moves:o}}optimize(){let t=[],r=[],n=[],o=[];for(let l=0;l<this.moveops.length;l++)o.push([]);for(let l=0;l<this.orbitdefs.length;l++){let i=this.orbitdefs[l].mod,s=this.orbitdefs[l].size,u=new Ii(s),a=new Array(this.orbitdefs[l].size);for(let m=0;m<s;m++)a[m]=!1;for(let m=0;m<this.moveops.length;m++)for(let L=0;L<s;L++)(this.moveops[m].orbits[l].perm[L]!==L||this.moveops[m].orbits[l].ori[L]!==0)&&(a[L]=!0,u.union(L,this.moveops[m].orbits[l].perm[L]));let f=!0;if(i>1){f=!1;let m=new Ii(this.orbitdefs[l].size*i);for(let L=0;L<this.moveops.length;L++)for(let p=0;p<s;p++)if(this.moveops[L].orbits[l].perm[p]!==p||this.moveops[L].orbits[l].ori[p]!==0)for(let F=0;F<i;F++)m.union(p*i+F,this.moveops[L].orbits[l].perm[p]*i+(F+this.moveops[L].orbits[l].ori[p])%i);for(let L=0;!f&&L<s;L++)for(let p=1;p<i;p++)m.find(L*i)===m.find(L*i+p)&&(f=!0);for(let L=0;!f&&L<s;L++)for(let p=0;p<L;p++)this.solved.orbits[l].perm[L]===this.solved.orbits[l].perm[p]&&(f=!0)}let g=-1,c=!1;for(let m=0;m<this.orbitdefs[l].size;m++)if(a[m]){let L=u.find(m);g<0?g=L:g!==L&&(c=!0)}for(let m=0;m<this.orbitdefs[l].size;m++){if(!a[m]||u.find(m)!==m)continue;let p=[],F=[],y=0;for(let x=0;x<this.orbitdefs[l].size;x++)u.find(x)===m&&(p[y]=x,F[x]=y,y++);if(c?t.push(\`\${this.orbitnames[l]}_p\${m}\`):t.push(this.orbitnames[l]),f){r.push(new Zn(y,this.orbitdefs[l].mod)),n.push(this.solved.orbits[l].remapVS(p,y));for(let x=0;x<this.moveops.length;x++)o[x].push(this.moveops[x].orbits[l].remap(p,F,y))}else{r.push(new Zn(y,1)),n.push(this.solved.orbits[l].remapVS(p,y).killOri());for(let x=0;x<this.moveops.length;x++)o[x].push(this.moveops[x].orbits[l].remap(p,F,y).killOri())}}}return new Jr(t,r,new $r(n),this.movenames,o.map(l=>new $t(l)))}scramble(t){let r=[];for(let o=0;o<this.moveops.length;o++)r[o]=this.moveops[o];for(let o=0;o<r.length;o++){let l=Math.floor(Math.random()*r.length),i=r[o];r[o]=r[l],r[l]=i}t<r.length&&(t=r.length);for(let o=0;o<t;o++){let l=Math.floor(Math.random()*r.length),i=Math.floor(Math.random()*r.length),s=Math.floor(Math.random()*this.moveops.length);r[l]=r[l].mul(r[i]).mul(this.moveops[s]),Math.random()<.1&&(r[l]=r[l].mul(this.moveops[s]))}let n=r[0];for(let o=1;o<r.length;o++)n=n.mul(r[o]);this.solved=this.solved.mul(n)}reassemblySize(){let t=1;for(let r=0;r<this.orbitdefs.length;r++)t*=this.orbitdefs[r].reassemblySize();return t}},Dt=class{constructor(t,r,n){this.perm=t;this.ori=r;this.orimod=n}static e(t,r){return new Dt(Et(t),Jt(t),r)}mul(t){let r=this.perm.length,n=new Array(r);if(this.orimod===1){for(let o=0;o<r;o++)n[o]=this.perm[t.perm[o]];return new Dt(n,this.ori,this.orimod)}else{let o=new Array(r);for(let l=0;l<r;l++)n[l]=this.perm[t.perm[l]],o[l]=(this.ori[t.perm[l]]+t.ori[l])%this.orimod;return new Dt(n,o,this.orimod)}}inv(){let t=this.perm.length,r=new Array(t),n=new Array(t);for(let o=0;o<t;o++)r[this.perm[o]]=o,n[this.perm[o]]=(this.orimod-this.ori[o])%this.orimod;return new Dt(r,n,this.orimod)}equal(t){let r=this.perm.length;for(let n=0;n<r;n++)if(this.perm[n]!==t.perm[n]||this.ori[n]!==t.ori[n])return!1;return!0}killOri(){let t=this.perm.length;for(let r=0;r<t;r++)this.ori[r]=0;return this.orimod=1,this}toPerm(){let t=this.orimod;if(t===1)return new ft(this.perm);let r=this.perm.length,n=new Array(r*t);for(let o=0;o<r;o++)for(let l=0;l<t;l++)n[o*t+l]=t*this.perm[o]+(this.ori[o]+l)%t;return new ft(n)}identicalPieces(){let t=[],r=this.perm.length,n=[];for(let o=0;o<r;o++){let l=this.perm[o];if(t[l]===void 0){let i=[o];t[l]=!0;for(let s=o+1;s<r;s++)this.perm[s]===l&&i.push(s);n.push(i)}}return n}order(){return this.toPerm().order()}isIdentity(){let t=this.perm.length;if(this.perm===Et(t)&&this.ori===Jt(t))return!0;for(let r=0;r<t;r++)if(this.perm[r]!==r||this.ori[r]!==0)return!1;return!0}zeroOris(){let t=this.perm.length;if(this.ori===Jt(t))return!0;for(let r=0;r<t;r++)if(this.ori[r]!==0)return!1;return!0}remap(t,r,n){let o=new Array(n),l=new Array(n);for(let i=0;i<n;i++)o[i]=r[this.perm[t[i]]],l[i]=this.ori[t[i]];return new Dt(o,l,this.orimod)}remapVS(t,r){let n=new Array(r),o=new Array(r),l=0,i=[];for(let s=0;s<r;s++){let u=this.perm[t[s]];i[u]===void 0&&(i[u]=l++),n[s]=i[u],o[s]=this.ori[t[s]]}return new Dt(n,o,this.orimod)}appendDefinition(t,r,n,o=!0){if(!(o&&this.isIdentity())&&(t.push(r),t.push(this.perm.map(l=>l+1).join(" ")),!this.zeroOris()))if(n){let l=new Array(this.ori.length);for(let i=0;i<l.length;i++)l[this.perm[i]]=this.ori[i];t.push(l.join(" "))}else t.push(this.ori.join(" "))}toKPuzzle(){let t=this.perm.length;return this.isIdentity()?(Dt.kcache[t]||(Dt.kcache[t]={permutation:Et(t),orientation:Jt(t)}),Dt.kcache[t]):{permutation:this.perm,orientation:this.ori}}},Ot=Dt;Ot.kcache=[];Mi=class{constructor(t){this.orbits=t}internalMul(t){let r=[];for(let n=0;n<this.orbits.length;n++)r.push(this.orbits[n].mul(t.orbits[n]));return r}internalInv(){let t=[];for(let r of this.orbits)t.push(r.inv());return t}equal(t){for(let r=0;r<this.orbits.length;r++)if(!this.orbits[r].equal(t.orbits[r]))return!1;return!0}killOri(){for(let t of this.orbits)t.killOri();return this}toPerm(){let t=new Array,r=0;for(let o of this.orbits){let l=o.toPerm();t.push(l),r+=l.n}let n=new Array(r);r=0;for(let o of t){for(let l=0;l<o.n;l++)n[r+l]=r+o.p[l];r+=o.n}return new ft(n)}identicalPieces(){let t=[],r=0;for(let n of this.orbits){let o=n.orimod,l=n.identicalPieces();for(let i=0;i<l.length;i++)t.push(l[i].map(s=>s*o+r));r+=o*n.perm.length}return t}order(){let t=1;for(let r of this.orbits)t=Ci(t,r.order());return t}},$t=class extends Mi{constructor(t){super(t)}mul(t){return new $t(this.internalMul(t))}mulScalar(t){if(t===0)return this.e();let r=this;for(t<0&&(r=r.inv(),t=-t);(t&1)==0;)r=r.mul(r),t>>=1;if(t===1)return r;let n=r,o=this.e();for(;t>0;)t&1&&(o=o.mul(n)),t>1&&(n=n.mul(n)),t>>=1;return o}inv(){return new $t(this.internalInv())}e(){return new $t(this.orbits.map(t=>Ot.e(t.perm.length,t.orimod)))}},$r=class extends Mi{constructor(t){super(t)}mul(t){return new $r(this.internalMul(t))}},Ii=class{constructor(t){this.n=t;this.heads=new Array(t);for(let r=0;r<t;r++)this.heads[r]=r}find(t){let r=this.heads[t];return this.heads[r]===r||(r=this.find(this.heads[r]),this.heads[t]=r),r}union(t,r){let n=this.find(t),o=this.find(r);n<o?this.heads[o]=n:n>o&&(this.heads[n]=o)}}});var $o,C0=S(()=>{$o={"2x2x2":"c f 0","3x3x3":"c f 0.333333333333333","4x4x4":"c f 0.5 f 0","5x5x5":"c f 0.6 f 0.2","6x6x6":"c f 0.666666666666667 f 0.333333333333333 f 0","7x7x7":"c f 0.714285714285714 f 0.428571428571429 f 0.142857142857143","8x8x8":"c f 0.75 f 0.5 f 0.25 f 0","9x9x9":"c f 0.777777777777778 f 0.555555555555556 f 0.333333333333333 f 0.111111111111111","10x10x10":"c f 0.8 f 0.6 f 0.4 f 0.2 f 0","11x11x11":"c f 0.818181818181818 f 0.636363636363636 f 0.454545454545455 f 0.272727272727273 f 0.0909090909090909","12x12x12":"c f 0.833333333333333 f 0.666666666666667 f 0.5 f 0.333333333333333 f 0.166666666666667 f 0","13x13x13":"c f 0.846153846153846 f 0.692307692307692 f 0.538461538461538 f 0.384615384615385 f 0.230769230769231 f 0.0769230769230769","20x20x20":"c f 0 f .1 f .2 f .3 f .4 f .5 f .6 f .7 f .8 f .9","30x30x30":"c f 0 f .066667 f .133333 f .2 f .266667 f .333333 f .4 f .466667 f .533333 f .6 f .666667 f .733333 f .8 f .866667 f .933333","40x40x40":"c f 0 f .05 f .1 f .15 f .2 f .25 f .3 f .35 f .4 f .45 f .5 f .55 f .6 f .65 f .7 f .75 f .8 f .85 f .9 f .95",skewb:"c v 0","master skewb":"c v 0.275","professor skewb":"c v 0 v 0.38","compy cube":"c v 0.915641442663986",helicopter:"c e 0.707106781186547","curvy copter":"c e 0.83",dino:"c v 0.577350269189626","little chop":"c e 0",pyramorphix:"t e 0",mastermorphix:"t e 0.346184634065199",pyraminx:"t v 0.333333333333333 v 1.66666666666667",tetraminx:"t v 0.333333333333333","master pyraminx":"t v 0 v 1 v 2","master tetraminx":"t v 0 v 1","professor pyraminx":"t v -0.2 v 0.6 v 1.4 v 2.2","professor tetraminx":"t v -0.2 v 0.6 v 1.4","Jing pyraminx":"t f 0","master pyramorphix":"t e 0.866025403784437",megaminx:"d f 0.7",gigaminx:"d f 0.64 f 0.82",teraminx:"d f 0.64 f 0.76 f 0.88",petaminx:"d f 0.64 f 0.73 f 0.82 f 0.91",examinx:"d f 0.64 f 0.712 f 0.784 f 0.856 f 0.928",zetaminx:"d f 0.64 f 0.7 f 0.76 f 0.82 f 0.88 f 0.94",yottaminx:"d f 0.64 f 0.6914 f 0.7429 f 0.7943 f 0.8457 f 0.8971 f 0.9486",pentultimate:"d f 0","master pentultimate":"d f 0.1","elite pentultimate":"d f 0 f 0.145905",starminx:"d v 0.937962370425399","starminx 2":"d f 0.23606797749979","pyraminx crystal":"d f 0.447213595499989",chopasaurus:"d v 0","big chop":"d e 0","skewb diamond":"o f 0",FTO:"o f 0.333333333333333","master FTO":"o f 0.5 f 0","Christopher's jewel":"o v 0.577350269189626",octastar:"o e 0","Trajber's octahedron":"o v 0.433012701892219","radio chop":"i f 0",icosamate:"i v 0","icosahedron 2":"i v 0.18759247376021","icosahedron 3":"i v 0.18759247376021 e 0","icosahedron static faces":"i v 0.84","icosahedron moving faces":"i v 0.73","Eitan's star":"i f 0.61803398874989","2x2x2 + dino":"c f 0 v 0.577350269189626","2x2x2 + little chop":"c f 0 e 0","dino + little chop":"c v 0.577350269189626 e 0","2x2x2 + dino + little chop":"c f 0 v 0.577350269189626 e 0","megaminx + chopasaurus":"d f 0.61803398875 v 0","starminx combo":"d f 0.23606797749979 v 0.937962370425399"}});function el(e){let t=new W(0,0,0,0);for(let r=0;r<e.length;r++)t=t.sum(e[r]);return t.smul(1/e.length)}function P0(e,t,r,n){let o=n[e].intersect3(n[t],n[r]);if(!o)return o;for(let l=0;l<n.length;l++)if(l!==e&&l!==t&&l!==r){let i=n[l].b*o.b+n[l].c*o.c+n[l].d*o.d;if(n[l].a>0&&i>n[l].a||n[l].a<0&&i<n[l].a)return!1}return o}var Fr,W,tl=S(()=>{Fr=1e-9;W=class{constructor(t,r,n,o){this.a=t;this.b=r;this.c=n;this.d=o}mul(t){return new W(this.a*t.a-this.b*t.b-this.c*t.c-this.d*t.d,this.a*t.b+this.b*t.a+this.c*t.d-this.d*t.c,this.a*t.c-this.b*t.d+this.c*t.a+this.d*t.b,this.a*t.d+this.b*t.c-this.c*t.b+this.d*t.a)}toString(){return\`Q[\${this.a},\${this.b},\${this.c},\${this.d}]\`}dist(t){return Math.hypot(this.a-t.a,this.b-t.b,this.c-t.c,this.d-t.d)}len(){return Math.hypot(this.a,this.b,this.c,this.d)}cross(t){return new W(0,this.c*t.d-this.d*t.c,this.d*t.b-this.b*t.d,this.b*t.c-this.c*t.b)}dot(t){return this.b*t.b+this.c*t.c+this.d*t.d}normalize(){let t=Math.sqrt(this.dot(this));return new W(this.a/t,this.b/t,this.c/t,this.d/t)}makenormal(){return new W(0,this.b,this.c,this.d).normalize()}normalizeplane(){let t=Math.hypot(this.b,this.c,this.d);return new W(this.a/t,this.b/t,this.c/t,this.d/t)}smul(t){return new W(this.a*t,this.b*t,this.c*t,this.d*t)}sum(t){return new W(this.a+t.a,this.b+t.b,this.c+t.c,this.d+t.d)}sub(t){return new W(this.a-t.a,this.b-t.b,this.c-t.c,this.d-t.d)}angle(){return 2*Math.acos(this.a)}invrot(){return new W(this.a,-this.b,-this.c,-this.d)}det3x3(t,r,n,o,l,i,s,u,a){return t*(l*a-i*u)+r*(i*s-o*a)+n*(o*u-l*s)}rotateplane(t){let r=t.mul(new W(0,this.b,this.c,this.d)).mul(t.invrot());return r.a=this.a,r}orthogonal(){let t=Math.abs(this.b),r=Math.abs(this.c),n=Math.abs(this.d);return t<r&&t<n?this.cross(new W(0,1,0,0)).normalize():r<t&&r<n?this.cross(new W(0,0,1,0)).normalize():this.cross(new W(0,0,0,1)).normalize()}pointrotation(t){let r=this.normalize();if(t=t.normalize(),r.sub(t).len()<Fr)return new W(1,0,0,0);let n=r.sum(t);n.len()<Fr?n=n.orthogonal():n=n.normalize();let o=r.cross(n);return o.a=r.dot(n),o}unproject(t){return this.sum(t.smul(-this.dot(t)/(this.len()*t.len())))}rotatepoint(t){return t.mul(this).mul(t.invrot())}rotateface(t){return t.map(r=>r.rotatepoint(this))}intersect3(t,r){let n=this.det3x3(this.b,this.c,this.d,t.b,t.c,t.d,r.b,r.c,r.d);return Math.abs(n)<Fr?!1:new W(0,this.det3x3(this.a,this.c,this.d,t.a,t.c,t.d,r.a,r.c,r.d)/n,this.det3x3(this.b,this.a,this.d,t.b,t.a,t.d,r.b,r.a,r.d)/n,this.det3x3(this.b,this.c,this.a,t.b,t.c,t.a,r.b,r.c,r.a)/n)}side(t){return t>Fr?1:t<-Fr?-1:0}cutface(t){let r=this.a,n=0,o=null;for(let l=0;l<t.length;l++)n|=1<<this.side(t[l].dot(this)-r)+1;if((n&5)==5){o=[];let l=t.map(i=>this.side(i.dot(this)-r));for(let i=-1;i<=1;i+=2){let s=[];for(let u=0;u<t.length;u++){(l[u]===i||l[u]===0)&&s.push(t[u]);let a=(u+1)%t.length;if(l[u]+l[a]===0&&l[u]!==0){let f=t[u].dot(this)-r,g=t[a].dot(this)-r,c=f/(f-g),m=t[u].smul(1-c).sum(t[a].smul(c));s.push(m)}}o.push(s)}}return o}cutfaces(t){let r=[];for(let n=0;n<t.length;n++){let o=t[n],l=this.cutface(o);l?(r.push(l[0]),r.push(l[1])):r.push(o)}return r}faceside(t){let r=this.a;for(let n=0;n<t.length;n++){let o=this.side(t[n].dot(this)-r);if(o!==0)return o}throw new Error("Could not determine side of plane in faceside")}sameplane(t){let r=this.normalize(),n=t.normalize();return r.dist(n)<Fr||r.dist(n.smul(-1))<Fr}makecut(t){return new W(t,this.b,this.c,this.d)}}});function M0(){let e=Math.sqrt(.5);return[new W(e,e,0,0),new W(e,0,e,0)]}function I0(){return[new W(.5,.5,.5,.5),new W(.5,.5,.5,-.5)]}function G0(){let e=2*Math.PI/10,t=.5+.3*Math.sqrt(5),r=.5+.1*Math.sqrt(5),n=Math.sqrt(t*t+r*r);return t/=n,r/=n,[new W(Math.cos(e),t*Math.sin(e),r*Math.sin(e),0),new W(.5,.5,.5,.5)]}function T0(){let e=1/6+Math.sqrt(5)/6,t=2/3+Math.sqrt(5)/3,r=Math.sqrt(e*e+t*t);e/=r,t/=r;let n=2*Math.PI/6;return[new W(Math.cos(n),e*Math.sin(n),t*Math.sin(n),0),new W(Math.cos(n),-e*Math.sin(n),t*Math.sin(n),0)]}function N0(){let e=Math.sqrt(.5);return[new W(.5,.5,.5,.5),new W(e,0,0,e)]}function _0(e){let t=[new W(1,0,0,0)];for(let r=0;r<t.length;r++)for(let n=0;n<e.length;n++){let o=e[n].mul(t[r]),l=o.smul(-1),i=!1;for(let s=0;s<t.length;s++)if(o.dist(t[s])<rl||l.dist(t[s])<rl){i=!0;break}i||t.push(o)}return t}function Gi(e,t){let r=[],n=[];for(let o=0;o<t.length;o++){let l=e.rotateplane(t[o]),i=!1;for(let s=0;s<r.length;s++)if(l.dist(r[s])<rl){i=!0;break}i||(r.push(l),n.push(t[o]))}return n}function Ti(e){let t=[];for(let r=1;r<e.length;r++)for(let n=r+1;n<e.length;n++){let o=P0(0,r,n,e);if(o){let l=!1;for(let i=0;i<t.length;i++)if(o.dist(t[i])<rl){l=!0;break}l||t.push(o)}}for(;;){let r=!1;for(let n=0;n<t.length;n++){let o=(n+1)%t.length;if(e[0].dot(t[n].cross(t[o]))<0){let l=t[n];t[n]=t[o],t[o]=l,r=!0}}if(!r)break}return t}var rl,O0=S(()=>{tl();rl=1e-9});function nl(e,t){let r=e[0].p.length,n=U0(r),o=[],l=[],i=[],s=[],u=[];function a(m){for(let L=m.p.length-1;L>=0;L--){let p=m.p[L];if(p!==L){if(!o[L][p])return!1;m=m.mul(l[L][p])}}return!0}function f(m,L,p){s[m].push(L),u[m].push(p);for(let F=0;F<o[m].length;F++)o[m][F]&&g(m,o[m][F].mul(L),p+i[m][F])}function g(m,L,p){let F=L.p[m];if(!o[m][F]){o[m][F]=L,l[m][F]=L.inv(),i[m][F]=p;for(let x=0;x<s[m].length;x++)g(m,L.mul(s[m][x]),p+u[m][x]);return}let y=L.mul(l[m][F]);a(y)||f(m-1,y,p+i[m][F])}function c(){o=[],l=[],s=[],i=[],u=[];for(let p=0;p<r;p++)o.push([]),l.push([]),i.push([]),s.push([]),u.push([]),o[p][p]=n,l[p][p]=n,i[p][p]=0;let m=0,L=1;for(let p=0;p<e.length;p++){f(r-1,e[p],1),L=1;let F=0,y=0,x=[],B=new W0;for(let P=0;P<r;P++){let k=0,K=0;for(let N=0;N<r;N++)o[P][N]&&(k++,K+=i[P][N],P!==N&&m++);F+=s[P].length,L*=k,k>1&&B.multiply(k);let te=K/k;x.push(te),y+=te}t(\`\${p}: sz \${L} T \${F} sol \${y} none \${m} mults \${B.toString()}\`)}return L}return c()}var W0,Ni=S(()=>{Jo();W0=class{constructor(){this.mult=[]}multiply(t){for(let r=2;r*r<=t;r++)for(;t%r==0;)this.mult[r]!==void 0?this.mult[r]++:this.mult[r]=1,t/=r;t>1&&(this.mult[t]!==void 0?this.mult[t]++:this.mult[t]=1)}toString(){let t="";for(let r=0;r<this.mult.length;r++)this.mult[r]!==void 0&&(t!==""&&(t+="*"),t+=r,this.mult[r]>1&&(t+=\`^\${this.mult[r]}\`));return t}}});function _i(e){return e}function Oi(e){}function mg(e,t){let r=[];for(let n of e)for(let o of t)r.push(o.rotate(n));return r}function Lg(){return{4:[["F","D","L","R"]],6:[["F","D","L","U","R"],["R","F","","B",""]],8:[["F","D","L","R"],["D","F","BR",""],["BR","D","","BB"],["BB","BR","U","BL"]],12:[["U","F","","","",""],["F","U","R","C","A","L"],["R","F","","","E",""],["E","R","","BF","",""],["BF","E","BR","BL","I","D"]],20:[["R","C","F","E"],["F","R","L","U"],["L","F","A",""],["E","R","G","I"],["I","E","S","H"],["S","I","J","B"],["B","S","K","D"],["K","B","M","O"],["O","K","P","N"],["P","O","Q",""]]}}function hg(){return{4:{F:"#00ff00",D:"#ffff00",L:"#ff0000",R:"#0000ff"},6:{U:"#ffffff",F:"#00ff00",R:"#ff0000",D:"#ffff00",B:"#0000ff",L:"#ff8000"},8:{U:"#ffffff",F:"#ff0000",R:"#00bb00",D:"#ffff00",BB:"#1122ff",L:"#9524c5",BL:"#ff8800",BR:"#aaaaaa"},12:{U:"#ffffff",F:"#006633",R:"#ff0000",C:"#ffffd0",A:"#3399ff",L:"#660099",E:"#ff66cc",BF:"#99ff00",BR:"#0000ff",BL:"#ffff00",I:"#ff6633",D:"#999999"},20:{R:"#db69f0",C:"#178fde",F:"#23238b",E:"#9cc726",L:"#2c212d",U:"#177fa7",A:"#e0de7f",G:"#2b57c0",I:"#41126b",S:"#4b8c28",H:"#7c098d",J:"#7fe7b4",B:"#85fb74",K:"#3f4bc3",D:"#0ff555",M:"#f1c2c8",O:"#58d340",P:"#c514f2",N:"#14494e",Q:"#8b1be1"}}}function Ag(){return{4:["F","D","L","R"],6:["U","D","F","B","L","R"],8:["F","BB","D","U","BR","L","R","BL"],12:["L","E","F","BF","R","I","U","D","BR","A","BL","C"],20:["L","S","E","O","F","B","I","P","R","K","U","D","J","A","Q","H","G","N","M","C"]}}function Rg(){return{4:[["FLR",[0,1,0]],["F",[0,0,1]]],6:[["U",[0,1,0]],["F",[0,0,1]]],8:[["U",[0,1,0]],["F",[0,0,1]]],12:[["U",[0,1,0]],["F",[0,0,1]]],20:[["GUQMJ",[0,1,0]],["F",[0,0,1]]]}}function ol(e,t){for(let r=0;r<e.length;r++)if(e[r][0].dist(t)<Be)return r;throw new Error("Element not found")}function Q0(){return $o}function q0(e){return $o[e]}function Yn(e){let t=e.split(/ /).filter(Boolean);if(t.length%2==0)return null;let r=t[0];if(r!=="o"&&r!=="c"&&r!=="i"&&r!=="d"&&r!=="t")return null;let n=[];for(let o=1;o<t.length;o+=2){if(t[o]!=="f"&&t[o]!=="v"&&t[o]!=="e")return null;n.push({cutType:t[o],distance:parseFloat(t[o+1])})}return{shape:r,cuts:n}}function Wi(e,t={}){let r=Yn(e);if(r===null)throw new Error("Could not parse the puzzle description");let n=new il(r,Object.assign({},{allMoves:!0},t));return n.allstickers(),n.genperms(),n}function er(e,t){return Wi($o[e],t)}function Dg(e,t,r){let n=!1;r-t[1]<t[0]&&(e=[e[2],e[3],e[0],e[1]],t=[r-t[1],r-t[0]],n=!0);let o=e[0],l="";if(t[0]===0&&t[1]===r)o=o+"v";else if(t[0]===t[1])t[1]>0&&(l=String(t[1]+1));else if(t[0]===0)o=o.toLowerCase(),t[1]>1&&(l=String(t[1]+1));else throw\`We only support slice and outer block moves right now. \${t}\`;return[l+o,n]}function Fg(e,t){let r=[],n=0;for(;n<e.length;){n>0&&n<e.length&&e[n]==="_"&&n++;let o="";for(let l of t)e.substr(n).startsWith(l[1])&&l[1].length>o.length&&(o=l[1]);if(o!=="")r.push(o),n+=o.length;else throw new Error("Could not split "+e+" into face names.")}return r}function ll(e,t){return[e.b/t,-e.c/t,e.d/t]}function Qi(e,t){let r=[],n=e.length;for(let o=0;o<n;o++){let l=ll(e.get(n-o-1),t);r[3*o]=l[0],r[3*o+1]=l[1],r[3*o+2]=l[2]}return r}var en,Xn,Be,pg,dg,il,j0,Ei=S(()=>{he();f0();vi();Ui();Jo();z0();C0();O0();tl();Ni();en=class{constructor(t){this.coords=new Array(t.length*3);for(let r=0;r<t.length;r++)this.coords[3*r]=t[r].b,this.coords[3*r+1]=t[r].c,this.coords[3*r+2]=t[r].d;this.length=t.length}get(t){return new W(0,this.coords[3*t],this.coords[3*t+1],this.coords[3*t+2])}centermass(){let t=0,r=0,n=0;for(let o=0;o<this.length;o++)t+=this.coords[3*o],r+=this.coords[3*o+1],n+=this.coords[3*o+2];return new W(0,t/this.length,r/this.length,n/this.length)}rotate(t){let r=[];for(let n=0;n<this.length;n++)r.push(this.get(n).rotatepoint(t));return new en(r)}rotateforward(){let t=[];for(let r=1;r<this.length;r++)t.push(this.get(r));return t.push(this.get(0)),new en(t)}},Xn=class{constructor(t,r,n){this.face=t;this.left=r;this.right=n}split(t){var n,o;let r=t.cutface(this.face);return r!==null&&(this.left===void 0?(this.left=new Xn(r[0]),this.right=new Xn(r[1])):(this.left=(n=this.left)==null?void 0:n.split(t),this.right=(o=this.right)==null?void 0:o.split(t))),this}collect(t,r){var n,o,l,i;return this.left===void 0?t.push(new en(this.face)):r?((n=this.left)==null||n.collect(t,!1),(o=this.right)==null||o.collect(t,!0)):((l=this.right)==null||l.collect(t,!1),(i=this.left)==null||i.collect(t,!0)),t}};Be=1e-9,pg="PuzzleGeometry 0.1 Copyright 2018 Tomas Rokicki.",dg=!1;il=class{constructor(t,r){this.cmovesbyslice=[];this.duplicatedFaces=[];this.duplicatedCubies=[];this.fixedCubie=-1;this.net=[];this.colors=[];this.faceorder=[];this.faceprecedence=[];this.notationMapper=new Xr;this.addNotationMapper="";this.setReidOrder=!1;let n=_i("genperms");this.options=new wi(r),this.options.verbosity>0&&console.log(this.header("# ")),this.create(t),Oi(n)}create(t){let{shape:r,cuts:n}=t;this.moveplanes=[],this.moveplanes2=[],this.faces=[],this.cubies=[];let o=null;switch(r){case"c":o=M0();break;case"o":o=N0();break;case"i":o=T0();break;case"t":o=I0();break;case"d":o=G0();break;default:throw new Error("Bad shape argument: "+r)}this.rotations=_0(o),this.options.verbosity&&console.log("# Rotations: "+this.rotations.length);let l=o[0];this.baseplanerot=Gi(l,this.rotations);let i=this.baseplanerot.map(D=>l.rotateplane(D));this.baseplanes=i,this.baseFaceCount=i.length;let s=Lg()[i.length];this.net=s,this.colors=hg()[i.length],this.faceorder=Ag()[i.length],this.options.verbosity>0&&console.log("# Base planes: "+i.length);let u=Ti(i),a=new W(0,0,0,0);this.options.verbosity>0&&console.log("# Face vertices: "+u.length);let f=i[0].makenormal(),g=u[0].sum(u[1]).makenormal(),c=u[0].makenormal(),m=new W(1,f.b,f.c,f.d);this.options.verbosity>0&&console.log("# Boundary is "+m);let p=Gi(m,this.rotations).map(D=>m.rotateplane(D)),F=Ti(p);this.edgedistance=F[0].sum(F[1]).smul(.5).dist(a),this.vertexdistance=F[0].dist(a);let y=[],x=[],B=!1,P=!1,k=!1;for(let D of n){let E=null,_=0;switch(D.cutType){case"f":E=f,_=1,B=!0;break;case"v":E=c,_=this.vertexdistance,k=!0;break;case"e":E=g,_=this.edgedistance,P=!0;break;default:throw new Error("Bad cut argument: "+D.cutType)}y.push(E.makecut(D.distance)),x.push(D.distance<_)}this.options.addRotations&&(B||y.push(f.makecut(10)),k||y.push(c.makecut(10)),P||y.push(g.makecut(10))),this.basefaces=[];for(let D of this.baseplanerot){let E=D.rotateface(F);this.basefaces.push(new en(E))}let K=[],te=[],N=[],re=[],b=F.length;function C(D,E,_){for(let Q of D)if(Q[0].dist(E)<Be){Q.push(_);return}D.push([E,_])}for(let D=0;D<this.baseplanerot.length;D++){let E=this.baseplanerot[D].rotateface(F);for(let _=0;_<E.length;_++){let Q=(_+1)%E.length,ne=E[_].sum(E[Q]).smul(.5);C(re,ne,D)}}let I=[];for(let D=0;D<this.baseplanerot.length;D++){let E=this.baseplanerot[D].rotateface(F),_=[];for(let Q=0;Q<E.length;Q++){let ne=(Q+1)%E.length,_e=E[Q].sum(E[ne]).smul(.5),nt=re[ol(re,_e)];if(D===nt[1])_.push(nt[2]);else if(D===nt[2])_.push(nt[1]);else throw new Error("Could not find edge")}I.push(_)}let w={},U=[];U.push(s[0][0]),w[s[0][0]]=0,U[I[0][0]]=s[0][1],w[s[0][1]]=I[0][0];for(let D of s){let E=D[0],_=w[E];if(_===void 0)throw new Error("Bad edge description; first edge not connected");let Q=-1;for(let ne=0;ne<I[_].length;ne++){let _e=U[I[_][ne]];if(_e!==void 0&&_e===D[1]){Q=ne;break}}if(Q<0)throw new Error("First element of a net not known");for(let ne=2;ne<D.length;ne++){if(D[ne]==="")continue;let _e=I[_][(ne+Q-1)%b],nt=U[_e];if(nt!==void 0&&nt!==D[ne])throw new Error("Face mismatch in net");U[_e]=D[ne],w[D[ne]]=_e}}for(let D=0;D<U.length;D++){let E=!1;for(let _=0;_<this.faceorder.length;_++)if(U[D]===this.faceorder[_]){this.faceprecedence[D]=_,E=!0;break}if(!E)throw new Error("Could not find face "+U[D]+" in face order list "+this.faceorder)}for(let D=0;D<this.baseplanerot.length;D++){let E=this.baseplanerot[D].rotateface(F),_=m.rotateplane(this.baseplanerot[D]),Q=U[D];K.push([E,Q]),te.push([_,Q])}for(let D=0;D<this.baseplanerot.length;D++){let E=this.baseplanerot[D].rotateface(F),_=U[D];for(let Q=0;Q<E.length;Q++){let ne=(Q+1)%E.length,_e=E[Q].sum(E[ne]).smul(.5),nt=(Q+2)%E.length,h1=E[ne].sum(E[nt]).smul(.5),A1=ol(re,_e),R1=ol(re,h1);C(N,E[ne],[_,R1,A1])}}this.swizzler=new Kn(K.map(D=>D[1]));let M=this.swizzler.prefixFree?"":"_";for(let D=0;D<re.length;D++){if(re[D].length!==3)throw new Error("Bad length in edge names "+re[D]);let E=U[re[D][1]],_=U[re[D][2]];this.faceprecedence[re[D][1]]<this.faceprecedence[re[D][2]]?E=E+M+_:E=_+M+E,re[D]=[re[D][0],E]}for(let D=0;D<N.length;D++){if(N[D].length<4)throw new Error("Bad length in vertex names");let E=1;for(let Q=2;Q<N[D].length;Q++)this.faceprecedence[w[N[D][Q][0]]]<this.faceprecedence[w[N[D][E][0]]]&&(E=Q);let _="";for(let Q=1;Q<N[D].length;Q++){Q===1?_=N[D][E][0]:_=_+M+N[D][E][0];for(let ne=1;ne<N[D].length;ne++)if(N[D][E][1]===N[D][ne][2]){E=ne;break}}N[D]=[N[D][0],_]}this.options.verbosity>1&&(console.log("# Face precedence list: "+this.faceorder.join(" ")),console.log("# Face names: "+K.map(D=>D[1]).join(" ")),console.log("# Edge names: "+re.map(D=>D[1]).join(" ")),console.log("# Vertex names: "+N.map(D=>D[1]).join(" ")));let q=[];for(let D of te)q.push([D[0].makenormal(),D[1],"f"]);for(let D of re)q.push([D[0].makenormal(),D[1],"e"]);for(let D of N)q.push([D[0].makenormal(),D[1],"v"]);this.facenames=K,this.faceplanes=te,this.edgenames=re,this.vertexnames=N,this.geonormals=q;let Y=q.map(D=>D[1]);this.swizzler.setGripNames(Y),this.options.verbosity>0&&console.log("# Distances: face "+1+" edge "+this.edgedistance+" vertex "+this.vertexdistance);for(let D=0;D<y.length;D++)for(let E of this.rotations){let _=y[D].rotateplane(E),Q=!1;for(let ne of this.moveplanes)if(_.sameplane(ne)){Q=!0;break}Q||(this.moveplanes.push(_),x[D]&&this.moveplanes2.push(_))}let ce=new Xn(F),pe=this.moveplanes2.slice(),Fe=31;for(let D=0;D<pe.length;D++){let E=D+Math.floor((pe.length-D)*(Fe/65536));ce=ce.split(pe[E]),pe[E]=pe[D],Fe=(Fe*1657+101)%65536}let ye=ce.collect([],!0);this.faces=ye,this.options.verbosity>0&&console.log("# Faces is now "+ye.length),this.stickersperface=ye.length;let wt=[],Ee=el(F);for(let D of this.rotations){let E=D.rotateface(F);Ee.dist(el(E))<Be&&wt.push(D)}let He=new Array(ye.length),xe=[];for(let D=0;D<ye.length;D++){let E=ye[D].centermass();xe.push([Ee.dist(E),E,D])}xe.sort((D,E)=>D[0]-E[0]);for(let D=0;D<ye.length;D++){let E=xe[D][2];if(!He[E]){He[E]=!0;for(let _ of wt){let Q=ye[E].rotate(_),ne=Q.centermass();for(let _e=D+1;_e<ye.length&&!(xe[_e][0]-xe[D][0]>Be);_e++){let nt=xe[_e][2];if(!He[nt]&&ne.dist(xe[_e][1])<Be){He[nt]=!0,ye[nt]=Q;break}}}}}this.shortedge=1e99;for(let D of ye)for(let E=0;E<D.length;E++){let _=(E+1)%D.length,Q=D.get(E).dist(D.get(_));Q<this.shortedge&&(this.shortedge=Q)}this.options.verbosity>0&&console.log("# Short edge is "+this.shortedge),r==="c"&&B&&!P&&!k&&(this.addNotationMapper="NxNxNCubeMapper",this.setReidOrder=!0),r==="c"&&k&&!B&&!P&&(this.addNotationMapper="SkewbMapper"),r==="t"&&(k||B)&&!P&&(this.addNotationMapper="PyraminxOrTetraminxMapper"),r==="o"&&B&&(this.notationMapper=new Vn(this.swizzler,new Kn(["F","D","L","BL","R","U","BR","B"])),!P&&!k&&(this.addNotationMapper="FTOMapper")),r==="d"&&B&&(this.addNotationMapper="MegaminxMapper",this.notationMapper=new Vn(this.swizzler,new Kn(["U","F","L","BL","BR","R","FR","FL","DL","B","DR","D"])))}keyface(t){return this.keyface2(t.centermass())}keyface2(t){let r="",n=String.fromCharCode;for(let o of this.moveplanesets)if(o.length>0){let l=t.dot(o[0]),i=0,s=1;for(;s*2<=o.length;)s*=2;for(;s>0;s>>=1)i+s<=o.length&&l>o[i+s-1].a&&(i+=s);if(i<47)r=r+n(33+i);else if(i<47+47*47)r=r+n(33+47+Math.floor(i/47)-1)+n(33+i%47);else if(i<47+47*47+47*47*47)r=r+n(33+47+Math.floor((i-47)/(47*47)-1))+n(33+47+Math.floor((i-47)/47)%47)+n(33+i%47);else throw Error("Too many slices for cubie encoding")}return r}keyface3(t){let r=t.centermass(),n=[];for(let o of this.moveplanesets)if(o.length>0){let l=r.dot(o[0]),i=0,s=1;for(;s*2<=o.length;)s*=2;for(;s>0;s>>=1)i+s<=o.length&&l>o[i+s-1].a&&(i+=s);n.push(i)}return n}findface(t){let r=this.keyface2(t),n=this.facelisthash.get(r);if(n.length===1)return n[0];for(let o=0;o+1<n.length;o++){let l=this.facelisthash.get(r)[o];if(Math.abs(t.dist(this.facecentermass[l]))<Be)return l}return n[n.length-1]}project2d(t,r,n){let o=this.facenames[t][0],l=(r+1)%o.length,i=this.baseplanes[t],s=o[l].sub(o[r]),u=s.len();s=s.normalize();let a=s.cross(i).normalize(),f=n[1].sub(n[0]),g=f.len()/u;f=f.normalize();let c=f.b,m=f.c,L=s.smul(c).sub(a.smul(m)).smul(g),p=a.smul(c).sum(s.smul(m)).smul(g),F=new W(0,n[0].b-L.dot(o[r]),n[0].c-p.dot(o[r]),0);return[L,p,F]}allstickers(){let t=_i("allstickers");this.faces=mg(this.baseplanerot,this.faces),this.options.verbosity>0&&console.log("# Total stickers is now "+this.faces.length),this.facecentermass=new Array(this.faces.length);for(let b=0;b<this.faces.length;b++)this.facecentermass[b]=this.faces[b].centermass();let r=[],n=[];for(let b of this.moveplanes){let C=b.makenormal(),I=!1;for(let w of n)C.sameplane(w.makenormal())&&(I=!0);I||(n.push(C),r.push([]))}for(let b of this.moveplanes2){let C=b.makenormal();for(let I=0;I<n.length;I++)if(C.sameplane(n[I])){r[I].push(b);break}}for(let b=0;b<r.length;b++){let C=r[b].map(w=>w.normalizeplane()),I=n[b];for(let w=0;w<C.length;w++)C[w].makenormal().dist(I)>Be&&(C[w]=C[w].smul(-1));C.sort((w,U)=>w.a-U.a),r[b]=C}this.moveplanesets=r,this.moveplanenormals=n;let o=r.map(b=>b.length);this.options.verbosity>0&&console.log("# Move plane sets: "+o);let l=[];for(let b=0;b<r.length;b++)l.push([]);for(let b of this.rotations){if(Math.abs(Math.abs(b.a)-1)<Be)continue;let C=b.makenormal();for(let I=0;I<r.length;I++)if(C.sameplane(n[I])){l[I].push(b);break}}this.moverotations=l;for(let b=0;b<l.length;b++){let C=l[b],I=C[0].makenormal();for(let w=0;w<C.length;w++)I.dist(C[w].makenormal())>Be&&(C[w]=C[w].smul(-1));C.sort((w,U)=>w.angle()-U.angle()),l[b][0].dot(n[b])<0&&C.reverse()}let i=l.map(b=>1+b.length);this.movesetorders=i;let s=[],u="?";for(let b=0;b<r.length;b++){let C=n[b],I=null,w=null;for(let U of this.geonormals){let M=C.dot(U[0]);Math.abs(M-1)<Be?(w=[U[1],U[2]],u=U[2]):Math.abs(M+1)<Be&&(I=[U[1],U[2]],u=U[2])}if(w===null||I===null)throw new Error("Saw positive or negative sides as null");s.push([w[0],w[1],I[0],I[1],1+r[b].length]),this.addNotationMapper==="NxNxNCubeMapper"&&u==="f"&&(this.notationMapper=new Yo(1+r[b].length),this.addNotationMapper=""),this.addNotationMapper==="SkewbMapper"&&r[0].length===1&&(this.notationMapper=new Xo(this.swizzler),this.addNotationMapper=""),this.addNotationMapper==="PyraminxOrTetraminxMapper"&&(r[0].length===2&&r[0][0].a===.333333333333333&&r[0][1].a===1.66666666666667?(this.notationMapper=new Hn(this.swizzler),this.addNotationMapper=""):(this.notationMapper=new Zo(this.swizzler),this.addNotationMapper="")),this.addNotationMapper==="MegaminxMapper"&&u==="f"&&(1+r[b].length===3&&(this.notationMapper=new Ho(this.notationMapper)),this.addNotationMapper=""),this.addNotationMapper==="FTOMapper"&&u==="f"&&(1+r[b].length===3&&(this.notationMapper=new Vo(this.notationMapper,this.swizzler)),this.addNotationMapper="")}this.movesetgeos=s;let a=new Map,f=this.faces;for(let b=0;b<f.length;b++){let C=f[b],I=this.keyface(C);if(!a.get(I))a.set(I,[b]);else{let w=a.get(I);if(w.push(b),w.length===this.baseFaceCount){this.options.verbosity>0&&console.log("# Splitting core.");for(let U=0;U<w.length;U++){let M=I+" "+U;a.set(M,[w[U]])}}}}this.facelisthash=a,this.options.verbosity>0&&console.log("# Cubies: "+a.size);let g=[],c=[],m=[];for(let b of a.values())if(b.length!==this.baseFaceCount){if(b.length>1){let C=b.map(M=>f[M].centermass()),I=el(C);for(let M=0;b.length>2;M++){let q=!1;for(let Y=0;Y<b.length;Y++){let ce=(Y+1)%b.length;if(I.dot(C[Y].cross(C[ce]))<0){let pe=C[Y];C[Y]=C[ce],C[ce]=pe;let Fe=b[Y];b[Y]=b[ce],b[ce]=Fe,q=!0}}if(!q)break;if(M>1e3)throw new Error("Bad epsilon math; too close to border")}let w=0,U=b[w];for(let M=1;M<b.length;M++){let q=b[M];this.faceprecedence[this.getfaceindex(q)]<this.faceprecedence[this.getfaceindex(U)]&&(w=M,U=q)}if(w!==0){let M=b.slice();for(let q=0;q<b.length;q++)b[q]=M[(w+q)%b.length]}}for(let C=0;C<b.length;C++){let I=b[C];c[I]=g.length,m[I]=C}g.push(b)}this.cubies=g,this.facetocubie=c,this.facetoord=m;let L=["?","CENTERS","EDGES","CORNERS","C4RNER","C5RNER"],p=[],F=[0,0,0,0,0,0],y=[],x=[],B=0,P=[],k=[],K=[],te=[],N=b=>g[b].map(C=>this.getfaceindex(C)).join(" "),re=[];for(let b=0;b<g.length;b++){if(x[b])continue;let C=g[b];if(C.length===0)continue;let I={},w=0;K.push(0),re.push([]);let U=C.length,M=F[U]++,q=L[U];(q===void 0||U===this.baseFaceCount)&&(q="CORE"),q=q+(M===0?"":M+1),p[B]=q,y[B]=U;let Y=[b],ce=0;for(x[b]=!0;ce<Y.length;){let pe=Y[ce++],Fe=N(pe);if((C.length>1||I[Fe]===void 0)&&(I[Fe]=w++),te[pe]=I[Fe],P[pe]=B,re[B].push(pe),k[pe]=K[B]++,Y.length<this.rotations.length){let ye=this.facecentermass[g[pe][0]];for(let wt of l){let Ee=this.facetocubie[this.findface(ye.rotatepoint(wt[0]))];x[Ee]||(Y.push(Ee),x[Ee]=!0)}}}B++}if(this.setReidOrder&&4<=this.stickersperface&&this.stickersperface<=9){let b=[["UF","UR","UB","UL","DF","DR","DB","DL","FR","FL","BR","BL"],["UFR","URB","UBL","ULF","DRF","DFL","DLB","DBR"],["U","L","F","R","B","D"]],C={};for(let I of b)for(let w=0;w<I.length;w++){let U=0;for(let M=0;M<I[w].length;M++)U|=1<<I[w].charCodeAt(M)-65;C[U]=w}for(let I of re)for(let w of I){let U=0;for(let M of g[w])U|=1<<this.facenames[this.getfaceindex(M)][1].charCodeAt(0)-65;k[w]=C[U]}}if(this.cubiesetnums=P,this.cubieordnums=k,this.cubiesetnames=p,this.cubieords=K,this.orbitoris=y,this.cubievaluemap=te,this.cubiesetcubies=re,this.options.fixedPieceType!==null){for(let b=0;b<g.length;b++)if(this.options.fixedPieceType==="v"&&g[b].length>2||this.options.fixedPieceType==="e"&&g[b].length===2||this.options.fixedPieceType==="f"&&g[b].length===1){this.fixedCubie=b;break}if(this.fixedCubie<0)throw new Error("Could not find a cubie of type "+this.options.fixedPieceType+" to fix.")}this.options.verbosity>0&&console.log("# Cubie orbit sizes "+K),Oi(t)}unswizzle(t){let r=this.notationMapper.notationToInternal(t);return r===null?"":this.swizzler.unswizzle(r.family)}stringToBlockMove(t){let r=RegExp("^(([0-9]+)-)?([0-9]+)?([^0-9]+)([0-9]+'?)?$"),n=t.match(r);if(n===null)throw new Error("Bad move passed "+t);let o=n[4],l,i;if(n[2]!==void 0){if(n[3]===void 0)throw new Error("Missing second number in range");l=parseInt(n[2],10)}n[3]!==void 0&&(i=parseInt(n[3],10));let s="1",u=1;return n[5]!==void 0&&(s=n[5],s[0]==="'"&&(s="-"+s.substring(1)),u=parseInt(s,10)),new d(new G(o,i,l),u)}parseMove(t){let r=this.notationMapper.notationToInternal(t);if(r===null)throw new Error("Bad move "+t.family);t=r;let n=t.family,o=!1;if(n.endsWith("v")&&n[0]<="Z"){if(t.innerLayer!==void 0||t.outerLayer!==void 0)throw new Error("Cannot use a prefix with full cube rotations");n=n.slice(0,-1),o=!0}n.endsWith("w")&&n[0]<="Z"&&(n=n.slice(0,-1).toLowerCase());let l,i=-1,s=this.swizzler.unswizzle(n),u=!1;for(let g=0;g<this.movesetgeos.length;g++){let c=this.movesetgeos[g];s===c[0]&&(u=!0,l=c,i=g),s===c[2]&&(u=!1,l=c,i=g)}let a=1,f=1;if(n.toUpperCase()!==n&&(f=2),l===void 0)throw new Error("Bad grip in move "+t.family);if(t.outerLayer!==void 0&&(a=t.outerLayer),t.innerLayer!==void 0&&(t.outerLayer===void 0?(f=t.innerLayer,n<="Z"?a=f:a=1):f=t.innerLayer),a--,f--,o&&(a=0,f=this.moveplanesets[i].length),a<0||a>this.moveplanesets[i].length||f<0||f>this.moveplanesets[i].length)throw new Error("Bad slice spec "+a+" "+f+" vs "+this.moveplanesets[i].length);if(!dg&&a===0&&f===this.moveplanesets[i].length&&!o)throw new Error("! full puzzle rotations must be specified with v suffix.");return[void 0,i,a,f,u,t.amount]}parsemove(t){let r=this.parseMove(this.stringToBlockMove(t));return r[0]=t,r}genperms(){let t=_i("genperms");if(this.cmovesbyslice.length>0)return;let r=[];if(this.options.orientCenters){for(let n=0;n<this.cubies.length;n++)if(this.cubies[n].length===1){let o=this.cubies[n][0],l=this.getfaceindex(o);if(this.basefaces[l].centermass().dist(this.facecentermass[o])<Be){let i=this.basefaces[l].length;for(let s=1;s<i;s++)this.cubies[n].push(this.cubies[n][s-1]);this.duplicatedFaces[o]=i,this.duplicatedCubies[n]=i,this.orbitoris[this.cubiesetnums[n]]=i}}}for(let n=0;n<this.moveplanesets.length;n++){let o=this.moveplanesets[n],l=[],i=[o.length+1,0],s=1;for(;s*2<=o.length;)s*=2;for(let f=0;f<this.faces.length;f++){let g=0;if(o.length>0){let c=this.facecentermass[f].dot(o[0]);for(let m=s;m>0;m>>=1)g+m<=o.length&&c>o[g+m-1].a&&(g+=m);g=o.length-g}for(l.push(g);i.length<=g;)i.push(0);i[g]++}let u=new Array(i.length);for(let f=0;f<i.length;f++)u[f]=[];let a=[];for(let f=0;f<this.faces.length;f++){if(l[f]<0)continue;let g=[this.facetocubie[f],this.facetoord[f]],c=this.facecentermass[f],m=c,L=f,p=l[L];for(;;){l[L]=-1;let F=c.rotatepoint(this.moverotations[n][0]);if(F.dist(m)<Be)break;L=this.findface(F),g.push(this.facetocubie[L],this.facetoord[L]),c=F}if(g.length>2&&this.options.orientCenters&&(this.cubies[g[0]].length===1||this.duplicatedCubies[g[0]]>1)&&this.facecentermass[f].dist(this.basefaces[this.getfaceindex(f)].centermass())<Be){let F=this.faces[this.cubies[g[0]][0]];for(let y=0;y<g.length;y+=2){let x=this.faces[this.cubies[g[y]][0]],B=-1;for(let P=0;P<F.length;P++)if(x.get(P).dist(F.get(0))<Be){B=P;break}if(B<0)throw new Error("Couldn't find rotation of center faces; ignoring for now.");g[y+1]=B,F=F.rotate(this.moverotations[n][0])}}if(g.length===2&&this.options.orientCenters)for(let F=1;F<this.movesetorders[n];F++)p===0?g.push(g[0],F):g.push(g[0],(this.movesetorders[n]-F)%this.movesetorders[n]);if(g.length>2&&!a[g[0]]){if(g.length!==2*this.movesetorders[n])throw new Error("Bad length in perm gen");for(let F of g)u[p].push(F)}for(let F=0;F<g.length;F+=2)a[g[F]]=!0}for(let f=0;f<u.length;f++)u[f]=u[f].slice();r.push(u)}if(this.cmovesbyslice=r,this.options.moveList){let n=[];for(let o of this.options.moveList)n.push(this.parsemove(o));this.parsedmovelist=n}this.facelisthash.clear(),this.facecentermass=[],Oi(t)}getboundarygeometry(){return{baseplanes:this.baseplanes,facenames:this.facenames,faceplanes:this.faceplanes,vertexnames:this.vertexnames,edgenames:this.edgenames,geonormals:this.geonormals}}getmovesets(t){let r=this.moveplanesets[t].length,n=[];if(this.parsedmovelist!==void 0)for(let o of this.parsedmovelist)o[1]===t&&(o[4]?n.push([o[2],o[3]]):n.push([r-o[3],r-o[2]]),n.push(o[5]));else if(this.options.vertexMoves&&!this.options.allMoves){let o=this.movesetgeos[t];if(o[1]!==o[3])for(let l=0;l<r;l++)o[1]!=="v"?(this.options.outerBlockMoves?n.push([l+1,r]):n.push([l+1]),n.push(1)):(this.options.outerBlockMoves?n.push([0,l]):n.push([l,l]),n.push(1))}else for(let o=0;o<=r;o++)!this.options.allMoves&&o+o===r||(this.options.outerBlockMoves?o+o>r?n.push([o,r]):n.push([0,o]):n.push([o,o]),n.push(1));if(this.fixedCubie>=0){let o=this.keyface3(this.faces[this.cubies[this.fixedCubie][0]])[t],l=[];for(let i=0;i<n.length;i+=2){let s=n[i];if(o>=s[0]&&o<=s[1])if(s[0]===0)s=[s[1]+1,r];else if(r===s[1])s=[0,s[0]-1];else throw Error("fixed cubie option would disconnect move");let u=!1;for(let a=0;a<l.length;a+=2)if(l[a][0]===s[0]&&l[a][1]===s[1]&&l[a+1]===n[i+1]){u=!0;break}u||(l.push(s),l.push(n[i+1]))}n=l}return n}graybyori(t){let r=this.cubies[t].length;return this.duplicatedCubies[t]&&(r=1),r===1&&(this.options.grayCenters||!this.options.includeCenterOrbits)||r===2&&(this.options.grayEdges||!this.options.includeEdgeOrbits)||r>2&&(this.options.grayCorners||!this.options.includeCornerOrbits)}skipbyori(t){let r=this.cubies[t].length;return this.duplicatedCubies[t]&&(r=1),r===1&&!this.options.includeCenterOrbits||r===2&&!this.options.includeEdgeOrbits||r>2&&!this.options.includeCornerOrbits}skipcubie(t){return this.skipbyori(t)}header(t){return t+pg+\`
\`+t+\`
\`}writegap(){let t=this.getOrbitsDef(!1),r=[],n=[];for(let l=0;l<t.moveops.length;l++){let i="M_"+Pi(this.notationMapper,t.movenames[l]),s=!1;i[i.length-1]==="'"&&(i=i.substring(0,i.length-1),s=!0),n.push(i),s?r.push(i+":="+t.moveops[l].toPerm().inv().toGap()+";"):r.push(i+":="+t.moveops[l].toPerm().toGap()+";")}r.push("Gen:=["),r.push(n.join(",")),r.push("];");let o=t.solved.identicalPieces();return r.push("ip:=["+o.map(l=>"["+l.map(i=>i+1).join(",")+"]").join(",")+"];"),r.push("# Size(Group(Gen));"),r.push("# Size(Stabilizer(Group(Gen), ip, OnTuplesSets));"),r.push(""),this.header("# ")+r.join(\`
\`)}writeksolve(t="PuzzleGeometryPuzzle"){let r=this.getOrbitsDef(!1);return this.header("# ")+r.toKsolve(t,this.notationMapper).join(\`
\`)}writekpuzzle(t=!0,r=!0){let n=this.getOrbitsDef(t,r),o=n.toKPuzzle(r);if(!o)throw new Error("Missing definition!");return o.moveNotation=new j0(this,n),o}getMoveFromBits(t,r,n,o,l,i){let s=[],u=[],a=[];for(let c of this.cubieords)u.push(Et(c)),a.push(Jt(c));for(let c=t[0];c<=t[1];c++){let m=o[c];for(let L=0;L<m.length;L+=2*i){let p=m.slice(L,L+2*i),F=this.cubiesetnums[p[0]];for(let B=0;B<p.length;B+=2)p[B]=this.cubieordnums[p[B]];let y=2,x=3;n&&(y=p.length-2,x=p.length-1),u[F]===Et(this.cubieords[F])&&(u[F]=u[F].slice(),this.orbitoris[F]>1&&!this.options.fixedOrientation&&(a[F]=a[F].slice()));for(let B=0;B<p.length;B+=2)u[F][p[(B+y)%p.length]]=p[B],this.orbitoris[F]>1&&!this.options.fixedOrientation&&(a[F][p[B]]=(p[(B+x)%p.length]-p[(B+1)%p.length]+2*this.orbitoris[F])%this.orbitoris[F])}}let f=new Ot(Et(24),Jt(24),1);for(let c=0;c<this.cubiesetnames.length;c++)if(!(l&&!l[c]))if(this.orbitoris[c]===1||this.options.fixedOrientation)u[c]===Et(f.perm.length)?(u[c]!==f.perm&&(f=new Ot(u[c],a[c],1)),s.push(f)):s.push(new Ot(u[c],a[c],1));else{let m=new Array(a[c].length);for(let L=0;L<u[c].length;L++)m[L]=a[c][u[c][L]];s.push(new Ot(u[c],m,this.orbitoris[c]))}let g=new $t(s);return r!==1&&(g=g.mulScalar(r)),g}omitSet(t){for(let r of this.options.excludeOrbits)if(r===t)return!0;return!1}diffmvsets(t,r,n,o){for(let l=0;l<t.length;l+=2){let i=!1;for(let s=0;!i&&s<r.length;s+=2)o?t[l][0]+r[s][1]===n&&t[l][1]+r[s][0]===n&&t[l+1]===r[s+1]&&(i=!0):t[l][0]===r[s][0]&&t[l][1]===r[s][1]&&t[l+1]===r[s+1]&&(i=!0);if(!i)return!0}return!1}getOrbitsDef(t,r=!0){let n=[];if(t)for(let c=0;c<this.cubiesetnames.length;c++)n.push(1);let o=[],l=[],i=[],s=[];for(let c=0;c<this.moveplanesets.length;c++){let m=this.getmovesets(c);i.push(m),this.options.addRotations?s.push(1):s.push(0)}if(this.options.moveList&&this.options.addRotations){for(let c=0;c<this.moverotations.length;c++)s[c]=0;for(let c=0;c<this.moveplanesets.length;c++)for(let m=0;m<this.moverotations.length;m++){let L=this.moveplanenormals[c];for(let p=1;p*2<=this.movesetorders[m];p++){if(L=L.rotatepoint(this.moverotations[m][0]),s[m]&p)continue;let F=-1,y=!1;for(let B=0;B<this.moveplanenormals.length;B++)if(L.dist(this.moveplanenormals[B])<Be){F=B;break}else if(L.dist(this.moveplanenormals[B].smul(-1))<Be){F=B,y=!0;break}if(F<0)throw new Error("Could not find rotation");let x=i[F];(x.length!==i[c].length||this.moveplanesets[c].length!==this.moveplanesets[F].length||this.diffmvsets(x,i[c],this.moveplanesets[F].length,y))&&(s[m]|=p)}}for(let c=0;c<this.moverotations.length;c++)if(s[c]===0)s[c]=1;else if(s[c]===1)this.movesetorders[c]>3?s[c]=2:s[c]=0;else if(s[c]===3)s[c]=0;else throw new Error("Impossible addrot val")}for(let c=0;c<this.moveplanesets.length;c++)s[c]!==0&&(i[c].push([0,this.moveplanesets[c].length]),i[c].push(s[c]));for(let c=0;c<this.moveplanesets.length;c++){let m=i[c],L=this.movesetorders[c];for(let y=0;y<m.length;y+=2)for(let x=0;x<y;x+=2)if(m[y]===m[x]&&m[y+1]===m[x+1])throw new Error("Redundant moves in moveset.");let p=[];for(let y=0;y<m.length;y+=2)for(let x=m[y][0];x<=m[y][1];x++)p[x]=1;let F=this.cmovesbyslice[c];for(let y=0;y<F.length;y++){if(p[y]!==1)continue;let x=F[y];for(let B=0;B<x.length;B+=2*L){if(this.skipcubie(x[B]))continue;let P=this.cubiesetnums[x[B]];n[P]=1}}}for(let c=0;c<this.cubiesetnames.length;c++)if(!!n[c]){if(this.omitSet(this.cubiesetnames[c])){n[c]=0;continue}o.push(this.cubiesetnames[c]),l.push(new Zn(this.cubieords[c],this.options.fixedOrientation?1:this.orbitoris[c]))}let u=[];for(let c=0;c<this.cubiesetnames.length;c++){if(!n[c]||this.omitSet(this.cubiesetnames[c]))continue;let m=[],L=[];for(let p=0;p<this.cubieords[c];p++){if(t)m.push(p);else{let F=this.cubiesetcubies[c][p];m.push(this.cubievaluemap[F])}L.push(0)}u.push(new Ot(m,L,this.options.fixedOrientation?1:this.orbitoris[c]))}let a=[],f=[];if(r)for(let c=0;c<this.moveplanesets.length;c++){let L=this.moveplanesets[c].length,p=i[c],F=this.movesetgeos[c];for(let y=0;y<p.length;y+=2){let x=p[y],B=Dg(F,x,L),P=B[0],k=B[1];p[y+1]===1?a.push(P):a.push(P+p[y+1]);let K=this.getMoveFromBits(x,p[y+1],k,this.cmovesbyslice[c],n,this.movesetorders[c]);f.push(K)}}let g=new Jr(o,l,new $r(u),a,f);return this.options.optimizeOrbits&&(g=g.optimize()),this.options.scrambleAmount!==0&&g.scramble(this.options.scrambleAmount),g}getMovesAsPerms(){return this.getOrbitsDef(!1).moveops.map(t=>t.toPerm())}showcanon(t){k0(this.getOrbitsDef(!1),t)}getsolved(){let t=[];for(let r=0;r<this.baseFaceCount;r++)for(let n=0;n<this.stickersperface;n++)t.push(r);return new ft(t)}getOrientationRotation(t){let[r,[n,o,l]]=t[0],i=new W(0,n,-o,l),[s,[u,a,f]]=t[1],g=new W(0,u,-a,f),c=null,m=null,L=this.swizzler.unswizzle(r),p=this.swizzler.unswizzle(s);for(let B of this.geonormals)L===B[1]&&(c=B[0]),p===B[1]&&(m=B[0]);if(!c)throw new Error("Could not find feature "+r);if(!m)throw new Error("Could not find feature "+s);let F=c.pointrotation(i);return m.rotatepoint(F).unproject(i).pointrotation(g.unproject(i)).mul(F)}getInitial3DRotation(){let t=this.baseFaceCount,r=null;if(this.options.puzzleOrientation?r=this.options.puzzleOrientation:this.options.puzzleOrientations&&(r=this.options.puzzleOrientations[t]),r||(r=Rg()[t]),!r)throw new Error("No default orientation?");return this.getOrientationRotation(r)}generate2dmapping(t=800,r=500,n=10,o=!1,l=.92){t-=2*n,r-=2*n;function i(w,U){let M=w[1][0]-w[0][0],q=w[1][1]-w[0][1],Y=2*Math.PI/U,ce=Math.cos(Y),pe=Math.sin(Y);for(let Fe=2;Fe<U;Fe++){let ye=M*ce+q*pe;q=q*ce-M*pe,M=ye,w.push([w[Fe-1][0]+M,w[Fe-1][1]+q])}}this.genperms();let a=this.getboundarygeometry().facenames[0][0].length,f=this.net;if(f===null)throw new Error("No net?");let g={},c=0,m=0,L=1,p=0;g[f[0][0]]=[[1,0],[0,0]],i(g[f[0][0]],a);for(let w of f){let U=w[0];if(!g[U])throw new Error("Bad edge description; first edge not connected.");for(let M=1;M<w.length;M++){let q=w[M];q===""||g[q]||(g[q]=[g[U][M%a],g[U][(M+a-1)%a]],i(g[q],a))}}for(let w in g){let U=g[w];for(let M of U)c=Math.min(c,M[0]),L=Math.max(L,M[0]),m=Math.min(m,M[1]),p=Math.max(p,M[1])}let F=Math.min(t/(L-c),r/(p-m)),y=.5*(t-F*(L+c)),x=.5*(r-F*(p+m)),B={},P=this.getboundarygeometry(),k={},K=[[F+y,x],[y,x]];k[f[0][0]]=K,i(k[f[0][0]],a),B[this.facenames[0][1]]=this.project2d(0,0,[new W(0,K[0][0],K[0][1],0),new W(0,K[1][0],K[1][1],0)]);let te=[];te[0]=0;for(let w of f){let U=w[0];if(!k[U])throw new Error("Bad edge description; first edge not connected.");let M=-1;for(let Y=0;Y<P.facenames.length;Y++)if(U===P.facenames[Y][1]){M=Y;break}if(M<0)throw new Error("Could not find first face name "+U);let q=P.facenames[M][0];for(let Y=1;Y<w.length;Y++){let ce=w[Y];if(ce===""||k[ce])continue;k[ce]=[k[U][Y%a],k[U][(Y+a-1)%a]],i(k[ce],a);let pe=te[M],Fe=q[(pe+Y)%a].sum(q[(pe+Y+a-1)%a]).smul(.5),ye=ol(P.edgenames,Fe),wt=P.edgenames[ye][1],Ee=Fg(wt,this.facenames),He=Ee[U===Ee[0]?1:0],xe=-1;for(let E=0;E<P.facenames.length;E++)if(He===P.facenames[E][1]){xe=E;break}if(xe<0)throw new Error("Could not find second face name");let D=P.facenames[xe][0];for(let E=0;E<D.length;E++)if(D[E].sum(D[(E+1)%a]).smul(.5).dist(Fe)<=Be){let Q=k[U][(Y+a-1)%a],ne=k[U][Y%a];te[xe]=E,B[He]=this.project2d(xe,E,[new W(0,ne[0],ne[1],0),new W(0,Q[0],Q[1],0)]);break}}}let N=0,re=0,b=this.getInitial3DRotation();for(let w of this.faces){o&&(w=w.rotate(b));for(let U=0;U<w.length;U++)N=Math.max(N,Math.abs(w.get(U).b)),re=Math.max(re,Math.abs(w.get(U).c))}let C=Math.min(r/re/2,(t-n)/N/4);return(w,U)=>{if(o){U=U.rotatepoint(b);let M=.5*n+.25*t,q=this.baseplanes[w].rotateplane(b).d<0?1:-1;return[n+t*.5+q*(M-U.b*C),n+r*.5+U.c*C]}else{let M=B[this.facenames[w][1]];return[n+l*U.dot(M[0])+M[2].b,n+r-l*U.dot(M[1])-M[2].c]}}}generatesvg(t=800,r=500,n=10,o=!1){let l=this.generate2dmapping(t,r,n,o);function i(c,m,L){return'<polygon id="'+c+'" class="sticker" style="fill: '+L+'" points="'+m.map(p=>p[0]+" "+p[1]).join(" ")+\`"/>
\`}let s=this.getsolved(),u=[],a=[];for(let c=0;c<this.baseFaceCount;c++)u[c]=this.colors[this.facenames[c][1]];for(let c=0;c<this.faces.length;c++){let m=this.faces[c],L=Math.floor(c/this.stickersperface),p=[];for(let F=0;F<m.length;F++)p.push(l(L,m.get(F)));a.push(p)}let f=[];for(let c=0;c<this.baseFaceCount;c++){f.push("<g>"),f.push("<title>"+this.facenames[c][1]+\`</title>
\`);for(let m=0;m<this.stickersperface;m++){let L=c*this.stickersperface+m,p=this.facetocubie[L],F=this.facetoord[L],y=this.cubiesetnums[p],x=this.cubieordnums[p],B=this.graybyori(p)?"#808080":u[s.p[L]],P=this.cubiesetnames[y]+"-l"+x+"-o"+F;if(f.push(i(P,a[L],B)),this.duplicatedFaces[L])for(let k=1;k<this.duplicatedFaces[L];k++)P=this.cubiesetnames[y]+"-l"+x+"-o"+k,f.push(i(P,a[L],B))}f.push("</g>")}return\`<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 500">
<style type="text/css"><![CDATA[.sticker { stroke: #000000; stroke-width: 1px; }]]></style>
\`+f.join("")+"</svg>"}get3d(t){let r=[],n=this.getInitial3DRotation(),o=[],l=.52*this.basefaces[0].get(0).len();for(let a=0;a<this.basefaces.length;a++){let f=this.basefaces[a].rotate(n),g=this.facenames[a][1];o.push({coords:Qi(f,l),name:g})}for(let a=0;a<this.faces.length;a++){let f=Math.floor(a/this.stickersperface),g=this.facetocubie[a],c=this.facetoord[a],m=this.cubiesetnums[g],L=this.cubieordnums[g],p=this.graybyori(g)?"#808080":this.colors[this.facenames[f][1]];(t==null?void 0:t.stickerColors)&&(p=t.stickerColors[a]);let F=this.faces[a].rotate(n);r.push({coords:Qi(F,l),color:p,orbit:this.cubiesetnames[m],ord:L,ori:c,face:f});let y=F;if(this.duplicatedFaces[a]){let x=y.length/this.duplicatedFaces[a];for(let B=1;B<this.duplicatedFaces[a];B++){for(let P=0;P<x;P++)y=y.rotateforward();r.push({coords:Qi(y,l),color:p,orbit:this.cubiesetnames[m],ord:L,ori:B,face:f,isDup:!0})}}}let i=[];for(let a=0;a<this.movesetgeos.length;a++){let f=this.movesetgeos[a],g=this.movesetorders[a];for(let c of this.geonormals)f[0]===c[1]&&f[1]===c[2]&&(i.push({coordinates:ll(c[0].rotatepoint(n),1),quantumMove:new d(f[0]),order:g}),i.push({coordinates:ll(c[0].rotatepoint(n).smul(-1),1),quantumMove:new d(f[2]),order:g}))}let s=this.generate2dmapping(2880,2160,0,!1,1),u=function(){let a=n.invrot();return function(f,g){let c=new W(0,g[0]*l,-g[1]*l,g[2]*l);c=c.rotatepoint(a);let m=s(f,c);return m[0]/=2880,m[1]=1-m[1]/2160,m}}().bind(this);return{stickers:r,faces:o,axis:i,unswizzle:this.unswizzle.bind(this),notationMapper:this.notationMapper,textureMapper:{getuv:u}}}getGeoNormal(t){let r=this.getInitial3DRotation(),n=this.swizzler.unswizzle(t);for(let o of this.geonormals)if(n===o[1]){let l=ll(o[0].rotatepoint(r),1);return Math.abs(l[0])<Be&&Math.abs(l[2])<Be&&(l[0]=0,l[2]=1e-6),l}}getfaceindex(t){let r=this.stickersperface;return Math.floor(t/r)}textForTwizzleExplorer(){return\`Faces \${this.baseplanerot.length}
Stickers per face \${this.stickersperface}
Short edge \${this.shortedge}
Cubies \${this.cubies.length}
Edge distance \${this.edgedistance}
Vertex distance \${this.vertexdistance}\`}writeSchreierSims(t){let n=this.getOrbitsDef(!1).reassemblySize();t(\`Reassembly size is \${n}\`);let o=nl(this.getMovesAsPerms(),t),l=n/o;t(\`Ratio is \${l}\`)}},j0=class{constructor(t,r){this.pg=t;this.cache={};this.orbitNames=r.orbitnames}lookupMove(t){let r=this.moveToKeyString(t);if(r in this.cache)return this.cache[r];let n=this.pg.parseMove(t);if(this.pg.parsedmovelist){let s=!1;for(let u of this.pg.parsedmovelist)u[1]===n[1]&&u[2]===n[2]&&u[3]===n[3]&&u[4]===n[4]&&(s=!0);if(!s)return}let o=[n[2],n[3]];if(!n[4]){let s=this.pg.moveplanesets[n[1]].length;o=[s-n[3],s-n[2]]}let l=this.pg.getMoveFromBits(o,n[5],!n[4],this.pg.cmovesbyslice[n[1]],void 0,this.pg.movesetorders[n[1]]),i=Jr.transformToKPuzzle(this.orbitNames,l);return this.cache[r]=i,i}moveToKeyString(t){let r="";return t.outerLayer&&(r=r+t.outerLayer+","),t.innerLayer&&(r=r+t.innerLayer+","),r=r+t.family+","+t.amount,r}}});var K0={};ke(K0,{PuzzleGeometry:()=>il,Quat:()=>W,getPG3DNamedPuzzles:()=>Q0,getPuzzleDescriptionString:()=>q0,getPuzzleGeometryByDesc:()=>Wi,getPuzzleGeometryByName:()=>er,parseOptions:()=>w0,parsePuzzleDescription:()=>Yn,schreierSims:()=>nl});var Jn=S(()=>{Ei();Ui();tl();Ni()});function gt(e){return h(this,null,function*(){return(yield Promise.resolve().then(()=>(Jn(),K0))).getPuzzleGeometryByName(e,{allMoves:!0,orientCenters:!0,addRotations:!0})})}function $n(e){return h(this,null,function*(){return(yield gt(e)).writekpuzzle(!0)})}function yr(e,t,r){let n={id:e,fullName:t,def:()=>h(this,null,function*(){return $n(e)}),svg:()=>h(this,null,function*(){return(yield gt(e)).generatesvg()}),pg:()=>h(this,null,function*(){return gt(e)})};return(r==null?void 0:r.inventedBy)&&(n.inventedBy=r.inventedBy),(r==null?void 0:r.inventionYear)&&(n.inventionYear=r.inventionYear),n}function tn(e,t,r){let n=yr(e,t,r);return n.appearance=Rt.bind(Rt,n),n.stickerings=Yr,n}var Br=S(()=>{Zr()});var V0={};ke(V0,{cube2x2x2KPuzzle:()=>kt});var kt,H0=S(()=>{kt={name:"2x2x2",orbits:{CORNERS:{numPieces:8,orientations:3}},startPieces:{CORNERS:{permutation:[0,1,2,3,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]}},moves:{U:{CORNERS:{permutation:[1,2,3,0,4,5,6,7],orientation:[0,0,0,0,0,0,0,0]}},y:{CORNERS:{permutation:[1,2,3,0,7,4,5,6],orientation:[0,0,0,0,0,0,0,0]}},x:{CORNERS:{permutation:[4,0,3,5,7,6,2,1],orientation:[2,1,2,1,1,2,1,2]}},L:{CORNERS:{permutation:[0,1,6,2,4,3,5,7],orientation:[0,0,2,1,0,2,1,0]}},F:{CORNERS:{permutation:[3,1,2,5,0,4,6,7],orientation:[1,0,0,2,2,1,0,0]}},R:{CORNERS:{permutation:[4,0,2,3,7,5,6,1],orientation:[2,1,0,0,1,0,0,2]}},B:{CORNERS:{permutation:[0,7,1,3,4,5,2,6],orientation:[0,2,1,0,0,0,2,1]}},D:{CORNERS:{permutation:[0,1,2,3,5,6,7,4],orientation:[0,0,0,0,0,0,0,0]}},z:{CORNERS:{permutation:[3,2,6,5,0,4,7,1],orientation:[1,2,1,2,2,1,2,1]}}}};kt.moves.Rv=kt.moves.x;kt.moves.Uv=kt.moves.y;kt.moves.Fv=kt.moves.z;kt.moves.Lv={CORNERS:{permutation:[1,7,6,2,0,3,5,4],orientation:[2,1,2,1,1,2,1,2]}};kt.moves.Dv={CORNERS:{permutation:[3,0,1,2,5,6,7,4],orientation:[0,0,0,0,0,0,0,0]}};kt.moves.Bv={CORNERS:{permutation:[4,7,1,0,5,3,2,6],orientation:[1,2,1,2,2,1,2,1]}}});var Y0={};ke(Y0,{default:()=>yg});var yg,Z0=S(()=>{yg=\`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 520 394" preserveAspectRatio="xMidYMid meet">
  <title>2x2x2</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="puzzle" transform="translate(5, 5) scale(60)">
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(3.2, 1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(4.4, 2.2)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(3.2, 2.2)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(3.2, 0)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(6.6, 2.2)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(5.4, 2.2)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(2.2, 0)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0, 2.2)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(7.6, 2.2)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(2.2, 1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(2.2, 2.2)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(1, 2.2)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(3.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(3.2, 3.2)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(4.4, 3.2)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(2.2, 4.4)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(1, 3.2)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(2.2, 3.2)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(2.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(7.6, 3.2)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0, 3.2)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(3.2, 5.4)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(5.4, 3.2)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(6.6, 3.2)" style="fill: #26f"/>
  </g>

</svg>\`});var eo,X0=S(()=>{Br();Zr();eo={id:"2x2x2",fullName:"2\\xD72\\xD72 Cube",def:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(H0(),V0))).cube2x2x2KPuzzle}),svg:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(Z0(),Y0))).default}),pg:()=>h(void 0,null,function*(){return gt("2x2x2")}),appearance:e=>Rt(eo,e),stickerings:Yr}});var J0={};ke(J0,{default:()=>Bg});var Bg,$0=S(()=>{Bg=\`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 518 392" preserveAspectRatio="xMidYMid meet">
  <title>3x3x3</title>
  <defs>
    <g id="sticker">
        <rect x="0" y="0" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10 11  -->
<!--        | | | | | | | | | | | |<-  -->
<!--    0 -       . . .                -->
<!--    1 -       . . .                -->
<!--    2 -       . . .                -->
<!--    3 - . . . . . . . . . . . .    -->
<!--    4 - . . . . . . . . . . . .    -->
<!--    5 - . . . . . . . . . . . .    -->
<!--    6 -       . . .                -->
<!--    7 -       . . .                -->
<!--    8 -       . . .                -->

  <g id="puzzle" transform="translate(5,5) scale(40)">
    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#sticker" transform="translate(5.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l0-o1" xlink:href="#sticker" transform="translate(6.5,3.3)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#sticker" transform="translate(5.3,3.3)" style="fill: limegreen"/>

    <use id="CORNERS-l1-o0" xlink:href="#sticker" transform="translate(5.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l1-o1" xlink:href="#sticker" transform="translate(9.7,3.3)" style="fill: #26f"/>
    <use id="CORNERS-l1-o2" xlink:href="#sticker" transform="translate(8.5,3.3)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#sticker" transform="translate(3.3,0.1)" style="fill: white"/>
    <use id="CORNERS-l2-o1" xlink:href="#sticker" transform="translate(0.1,3.3)" style="fill: orange"/>
    <use id="CORNERS-l2-o2" xlink:href="#sticker" transform="translate(11.7,3.3)" style="fill: #26f"/>

    <use id="CORNERS-l3-o0" xlink:href="#sticker" transform="translate(3.3,2.1)" style="fill: white"/>
    <use id="CORNERS-l3-o1" xlink:href="#sticker" transform="translate(3.3,3.3)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o2" xlink:href="#sticker" transform="translate(2.1,3.3)" style="fill: orange"/>

    <use id="CORNERS-l4-o0" xlink:href="#sticker" transform="translate(5.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" transform="translate(5.3,5.3)" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" transform="translate(6.5,5.3)" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" transform="translate(3.3,6.5)" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" transform="translate(2.1,5.3)" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" transform="translate(3.3,5.3)" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" transform="translate(3.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" transform="translate(11.7,5.3)" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker" transform="translate(0.1,5.3)"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" transform="translate(5.3,8.5)" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" transform="translate(8.5,5.3)" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" transform="translate(9.7,5.3)" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0"  xlink:href="#sticker" transform="translate(4.3,2.1)" style="fill: white"/>
    <use id="EDGES-l0-o1"  xlink:href="#sticker" transform="translate(4.3,3.3)" style="fill: limegreen"/>

    <use id="EDGES-l1-o0"  xlink:href="#sticker" transform="translate(5.3,1.1)" style="fill: white"/>
    <use id="EDGES-l1-o1"  xlink:href="#sticker" transform="translate(7.5,3.3)" style="fill: red"/>

    <use id="EDGES-l2-o0"  xlink:href="#sticker" transform="translate(4.3,0.1)" style="fill: white"/>
    <use id="EDGES-l2-o1"  xlink:href="#sticker" transform="translate(10.7,3.3)" style="fill: #26f"/>

    <use id="EDGES-l3-o0"  xlink:href="#sticker" transform="translate(3.3,1.1)" style="fill: white"/>
    <use id="EDGES-l3-o1"  xlink:href="#sticker" transform="translate(1.1,3.3)" style="fill: orange"/>

    <use id="EDGES-l4-o0"  xlink:href="#sticker" transform="translate(4.3,6.5)" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" transform="translate(4.3,5.3)" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" transform="translate(5.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" transform="translate(7.5,5.3)" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" transform="translate(4.3,8.5)" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" transform="translate(10.7,5.3)" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" transform="translate(3.3,7.5)" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" transform="translate(1.1,5.3)" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" transform="translate(5.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" transform="translate(6.5,4.3)" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" transform="translate(3.3,4.3)" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" transform="translate(2.1,4.3)" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" transform="translate(9.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" transform="translate(8.5,4.3)" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" transform="translate(11.7,4.3)" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" transform="translate(0.1,4.3)" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l0-o0" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o1" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o2" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>
    <use id="CENTERS-l0-o3" xlink:href="#sticker" transform="translate(4.3,1.1)" style="fill: white"/>

    <use id="CENTERS-l1-o0" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" transform="translate(1.1,4.3)" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" transform="translate(4.3,4.3)" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" transform="translate(7.5,4.3)" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" transform="translate(10.7,4.3)" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" transform="translate(4.3,7.5)" style="fill: yellow"/>
  </g>

</svg>\`});var e2={};ke(e2,{default:()=>bg});var bg,t2=S(()=>{bg=\`<?xml version="1.0" encoding="UTF-8"?>
<svg width="288px" height="288px" viewBox="-16 -16 288 288" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>3x3x3 LL</title>
  <defs>
    <g id="sticker">
        <rect x="-10" y="-10" width="1" height="1" stroke="black" stroke-width="0.04px" />
    </g>
  </defs>
  <g id="3x3x3-LL" stroke="none" stroke-width="4" style="none" stroke-linejoin="round">
    <rect id="CENTERS-l0-o0" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o1" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o2" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>
    <rect id="CENTERS-l0-o3" stroke="#000000" style="fill: white" x="96" y="96" width="64" height="64"></rect>

    <rect    id="CORNERS-l0-o0" stroke="#000000" style="fill: white" x="160" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l0-o1" stroke="#000000" style="fill: red" points="224 160 252 160 252 252 224 224"></polygon>
    <polygon id="CORNERS-l0-o2" stroke="#000000" style="fill: limegreen" transform="translate(206, 238) scale(1, -1) rotate(-90) translate(-206, -238) " points="192 192 220 192 220 284 192 256"></polygon>
    <rect    id="CORNERS-l1-o0" stroke="#000000" style="fill: white" x="160" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l1-o1" stroke="#000000" style="fill: #26f" transform="translate(206, 18) rotate(-90) translate(-206, -18) " points="192 -28 220 -28 220 64 192 36"></polygon>
    <polygon id="CORNERS-l1-o2" stroke="#000000" style="fill: red" transform="translate(238, 50) scale(1, -1) translate(-238, -50) " points="224 4 252 4 252 96 224 68"></polygon>
    <rect    id="CORNERS-l2-o0" stroke="#000000" style="fill: white" x="32" y="32" width="64" height="64"></rect>
    <polygon id="CORNERS-l2-o1" stroke="#000000" style="fill: orange" transform="translate(18, 50) scale(-1, -1) translate(-18, -50) " points="4 4 32 4 32 96 4 68"></polygon>
    <polygon id="CORNERS-l2-o2" stroke="#000000" style="fill: #26f" transform="translate(50, 18) scale(1, -1) rotate(90) translate(-50, -18) " points="36 -28 64 -28 64 64 36 36"></polygon>
    <rect    id="CORNERS-l3-o0" stroke="#000000" style="fill: white" x="32" y="160" width="64" height="64"></rect>
    <polygon id="CORNERS-l3-o1" stroke="#000000" style="fill: limegreen" transform="translate(50, 238) rotate(90) translate(-50, -238) " points="36 192 64 192 64 284 36 256"></polygon>
    <polygon id="CORNERS-l3-o2" stroke="#000000" style="fill: orange" transform="translate(18, 206) scale(-1, 1) translate(-18, -206) " points="4 160 32 160 32 252 4 224"></polygon>

    <rect id="EDGES-l0-o0" stroke="#000000" style="fill: white" x="96" y="160" width="64" height="64"></rect>
    <rect id="EDGES-l0-o1" stroke="#000000" style="fill: limegreen" transform="translate(128, 238) scale(1, -1) rotate(90) translate(-128, -238) " x="114" y="206" width="28" height="64"></rect>
    <rect id="EDGES-l1-o0" stroke="#000000" style="fill: white" x="160" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l1-o1" stroke="#000000" style="fill: red" x="224" y="96" width="28" height="64"></rect>
    <rect id="EDGES-l2-o0" stroke="#000000" style="fill: white" x="96" y="32" width="64" height="64"></rect>
    <rect id="EDGES-l2-o1" stroke="#000000" style="fill: #26f" transform="translate(128, 18) scale(1, -1) rotate(90) translate(-128, -18) " x="114" y="-14" width="28" height="64"></rect>
    <rect id="EDGES-l3-o0" stroke="#000000" style="fill: white" x="32" y="96" width="64" height="64"></rect>
    <rect id="EDGES-l3-o1" stroke="#000000" style="fill: orange" x="4" y="96" width="28" height="64"></rect>

  </g>
  <g style="opacity: 0">
    <!-- CORNERS -->
    <use id="CORNERS-l4-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l4-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CORNERS-l4-o2" xlink:href="#sticker" style="fill: red"/>

    <use id="CORNERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l5-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CORNERS-l5-o2" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CORNERS-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l6-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CORNERS-l6-o2" xlink:href="#sticker"  style="fill: orange"/>

    <use id="CORNERS-l7-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CORNERS-l7-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CORNERS-l7-o2" xlink:href="#sticker" style="fill: #26f"/>

    <!-- EDGES -->
    <use id="EDGES-l4-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l4-o1"  xlink:href="#sticker" style="fill: limegreen"/>

    <use id="EDGES-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l5-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l6-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l6-o1" xlink:href="#sticker" style="fill: #26f"/>

    <use id="EDGES-l7-o0"  xlink:href="#sticker" style="fill: yellow"/>
    <use id="EDGES-l7-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l8-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l8-o1"  xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l9-o0"  xlink:href="#sticker" style="fill: limegreen"/>
    <use id="EDGES-l9-o1"  xlink:href="#sticker" style="fill: orange"/>

    <use id="EDGES-l10-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l10-o1" xlink:href="#sticker" style="fill: red"/>

    <use id="EDGES-l11-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="EDGES-l11-o1" xlink:href="#sticker" style="fill: orange"/>

    <!-- CENTERS -->
    <!-- TODO: Allow the same sticker to be reused for multiple orientations -->
    <use id="CENTERS-l1-o0" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o1" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o2" xlink:href="#sticker" style="fill: orange"/>
    <use id="CENTERS-l1-o3" xlink:href="#sticker" style="fill: orange"/>

    <use id="CENTERS-l2-o0" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o1" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o2" xlink:href="#sticker" style="fill: limegreen"/>
    <use id="CENTERS-l2-o3" xlink:href="#sticker" style="fill: limegreen"/>

    <use id="CENTERS-l3-o0" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o1" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o2" xlink:href="#sticker" style="fill: red"/>
    <use id="CENTERS-l3-o3" xlink:href="#sticker" style="fill: red"/>

    <use id="CENTERS-l4-o0" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o1" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o2" xlink:href="#sticker" style="fill: #26f"/>
    <use id="CENTERS-l4-o3" xlink:href="#sticker" style="fill: #26f"/>

    <use id="CENTERS-l5-o0" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o1" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o2" xlink:href="#sticker" style="fill: yellow"/>
    <use id="CENTERS-l5-o3" xlink:href="#sticker" style="fill: yellow"/>
  </g>
</svg>\`});var qi,r2=S(()=>{At();Br();Zr();qi={id:"3x3x3",fullName:"3\\xD73\\xD73 Cube",inventedBy:["Ern\\u0151 Rubik"],inventionYear:1974,def:()=>h(void 0,null,function*(){return ue}),svg:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>($0(),J0))).default}),llSVG:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(t2(),e2))).default}),pg:()=>h(void 0,null,function*(){return gt("3x3x3")}),appearance:e=>Rt(qi,e),stickerings:Yr}});var n2={};ke(n2,{clockKPuzzle:()=>xg});var xg,o2=S(()=>{xg={name:"Clock",orbits:{DIALS:{numPieces:18,orientations:12},FACES:{numPieces:18,orientations:1},FRAME:{numPieces:1,orientations:2}},startPieces:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},moves:{UR_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,1,1,0,1,1,0,0,0,-1,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},DR_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,-1,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},DL_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,-1]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},UL_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[1,1,0,1,1,0,0,0,0,0,0,-1,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},U_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[1,1,1,1,1,1,0,0,0,-1,0,-1,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},R_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,1,1,0,1,1,0,1,1,-1,0,0,0,0,0,-1,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},D_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,-1,0,-1]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},L_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[1,1,0,1,1,0,1,1,0,0,0,-1,0,0,0,0,0,-1]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},ALL_PLUS_:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[1,1,1,1,1,1,1,1,1,-1,0,-1,0,0,0,-1,0,-1]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},y2:{DIALS:{permutation:[9,10,11,12,13,14,15,16,17,0,1,2,3,4,5,6,7,8],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[9,10,11,12,13,14,15,16,17,0,1,2,3,4,5,6,7,8],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[1]}},UL:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},UR:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},DL:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}},DR:{DIALS:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FACES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},FRAME:{permutation:[0],orientation:[0]}}}}});var l2={};ke(l2,{default:()=>Sg});var Sg,i2=S(()=>{Sg=\`<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet">
  <title>clock</title>
  <defs>
    <g id="hand" transform="translate(-20, -20)">
      <path d="M19.9995197,2.22079449 L23.8791657,19.0203611 C23.9580836,19.3338406 24,19.6620253 24,20 C24,22.209139 22.209139,24 20,24 C17.790861,24 16,22.209139 16,20 C16,19.6620253 16.0419164,19.3338406 16.1208343,19.0203611 L19.9995197,2.22079449 Z"></path>
    </g>
    <g id="cardinal_hours" style="fill: #FFFFFF">
      <circle cx="0" cy="24" r="2"></circle>
      <circle cx="-24" cy="0" r="2"></circle>
      <circle cx="24" cy="0" r="2"></circle>
      <circle cx="0" cy="-24" r="2"></circle>
    </g>
    <g id="face_hours">
      <g>
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g transform="rotate(30)">
        <use xlink:href="#cardinal_hours"/>
      </g>
      <g  transform="rotate(60)">
        <use xlink:href="#cardinal_hours"/>
      </g>
    </g>
    <g id="pegs" stroke="#000000" style="fill: #FFD000">
      <circle id="PEG4" cx="90" cy="90" r="10"></circle>
      <circle id="PEG3" cx="30" cy="90" r="10"></circle>
      <circle id="PEG2" cx="90" cy="30" r="10"></circle>
      <circle id="PEG1" cx="30" cy="30" r="10"></circle>
    </g>
    <g id="frame" transform="translate(-24, -24)">
      <path stroke="#000000" d="M120,20 C137.495665,20 153.941932,24.4930026 168.247913,32.3881183 C171.855881,30.8514056 175.828512,30 180,30 C196.568542,30 210,43.4314575 210,60 C210,64.1714878 209.148594,68.1441192 207.610077,71.7536009 C215.506997,86.0580678 220,102.504335 220,120 C220,137.495665 215.506997,153.941932 207.611882,168.247913 C209.148594,171.855881 210,175.828512 210,180 C210,196.568542 196.568542,210 180,210 C175.828512,210 171.855881,209.148594 168.246399,207.610077 C153.941932,215.506997 137.495665,220 120,220 C102.504335,220 86.0580678,215.506997 71.7520869,207.611882 C68.1441192,209.148594 64.1714878,210 60,210 C43.4314575,210 30,196.568542 30,180 C30,175.828512 30.8514056,171.855881 32.3899234,168.246399 C24.4930026,153.941932 20,137.495665 20,120 C20,102.504335 24.4930026,86.0580678 32.3881183,71.7520869 C30.8514056,68.1441192 30,64.1714878 30,60 C30,43.4314575 43.4314575,30 60,30 C64.1714878,30 68.1441192,30.8514056 71.7536009,32.3899234 C86.0580678,24.4930026 102.504335,20 120,20 Z"></path>
    </g>
  </defs>
  <g>
    <g transform="translate(24, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o0" style="fill: #0C5093"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l0-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l0-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l0-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l0-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l0-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l0-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l0-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l0-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l0-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l0-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l0-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l0-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l0-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l1-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l1-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l1-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l1-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l1-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l1-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l1-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l1-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l1-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l1-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l1-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l1-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l1-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l2-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l2-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l2-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l2-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l2-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l2-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l2-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l2-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l2-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l2-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l2-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l2-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l2-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l3-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l3-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l3-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l3-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l3-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l3-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l3-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l3-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l3-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l3-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l3-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l3-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l3-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l4-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l4-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l4-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l4-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l4-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l4-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l4-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l4-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l4-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l4-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l4-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l4-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l4-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l5-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l5-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l5-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l5-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l5-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l5-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l5-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l5-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l5-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l5-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l5-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l5-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l5-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l6-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l6-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l6-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l6-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l6-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l6-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l6-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l6-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l6-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l6-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l6-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l6-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l6-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l7-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l7-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l7-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l7-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l7-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l7-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l7-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l7-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l7-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l7-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l7-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l7-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l7-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l8-o0" stroke="#000000" style="fill: #90B8DF" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l8-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l8-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l8-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l8-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l8-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l8-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l8-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l8-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l8-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l8-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l8-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l8-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
    <g transform="translate(264, 24)">
      <use xlink:href="#frame" id="FRAME-l0-o1" style="fill: #90B8DF"/>
      <use xlink:href="#pegs" transform="translate(36, 36)"/>
      <g transform="translate(36, 36)">
        <circle id="FACES-l9-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l9-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l9-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l9-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l9-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l9-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l9-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l9-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l9-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l9-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l9-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l9-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l9-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 36)">
        <circle id="FACES-l10-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l10-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l10-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l10-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l10-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l10-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l10-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l10-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l10-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l10-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l10-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l10-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l10-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 36)">
        <circle id="FACES-l11-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l11-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l11-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l11-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l11-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l11-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l11-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l11-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l11-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l11-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l11-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l11-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l11-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 96)">
        <circle id="FACES-l12-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l12-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l12-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l12-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l12-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l12-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l12-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l12-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l12-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l12-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l12-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l12-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l12-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 96)">
        <circle id="FACES-l13-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l13-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l13-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l13-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l13-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l13-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l13-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l13-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l13-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l13-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l13-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l13-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l13-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 96)">
        <circle id="FACES-l14-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l14-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l14-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l14-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l14-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l14-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l14-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l14-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l14-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l14-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l14-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l14-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l14-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(36, 156)">
        <circle id="FACES-l15-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l15-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l15-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l15-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l15-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l15-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l15-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l15-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l15-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l15-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l15-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l15-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l15-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(96, 156)">
        <circle id="FACES-l16-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l16-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l16-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l16-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l16-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l16-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l16-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l16-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l16-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l16-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l16-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l16-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l16-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
      <g transform="translate(156, 156)">
        <circle id="FACES-l17-o0" stroke="#000000" style="fill: #0C5093" r="20"></circle>
        <use xlink:href="#face_hours"/>
        <g>
          <use id="DIALS-l17-o0"  xlink:href="#hand" transform="rotate(0)" style="fill: #FFD000"/>
          <use id="DIALS-l17-o1"  xlink:href="#hand" transform="rotate(30)" style="fill: #0000"/>
          <use id="DIALS-l17-o2"  xlink:href="#hand" transform="rotate(60)" style="fill: #0000"/>
          <use id="DIALS-l17-o3"  xlink:href="#hand" transform="rotate(90)" style="fill: #0000"/>
          <use id="DIALS-l17-o4"  xlink:href="#hand" transform="rotate(120)" style="fill: #0000"/>
          <use id="DIALS-l17-o5"  xlink:href="#hand" transform="rotate(150)" style="fill: #0000"/>
          <use id="DIALS-l17-o6"  xlink:href="#hand" transform="rotate(180)" style="fill: #0000"/>
          <use id="DIALS-l17-o7"  xlink:href="#hand" transform="rotate(210)" style="fill: #0000"/>
          <use id="DIALS-l17-o8"  xlink:href="#hand" transform="rotate(240)" style="fill: #0000"/>
          <use id="DIALS-l17-o9"  xlink:href="#hand" transform="rotate(270)" style="fill: #0000"/>
          <use id="DIALS-l17-o10" xlink:href="#hand" transform="rotate(300)" style="fill: #0000"/>
          <use id="DIALS-l17-o11" xlink:href="#hand" transform="rotate(330)" style="fill: #0000"/>
        </g>
      </g>
    </g>
  </g>
</svg>\`});var s2,a2=S(()=>{s2={id:"clock",fullName:"Clock",inventedBy:["Christopher C. Wiggs","Christopher J. Taylor"],inventionYear:1988,def:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(o2(),n2))).clockKPuzzle}),svg:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(i2(),l2))).default})}});function u2(e,t){return h(this,null,function*(){let r=yield e.def(),n=new Qn(r),o=new qn(r),l=()=>o.and([o.move("U"),o.not(o.or(o.moves(["F","BL","BR"])))]),i=()=>o.and([o.move("U"),o.not(o.move("F"))]),s=()=>o.or([i(),o.and([o.move("F"),o.not(o.or(o.moves(["U","BL","BR"])))])]),u=()=>o.not(o.or([o.and([o.move("U"),o.move("F")]),o.and([o.move("F"),o.move("BL")]),o.and([o.move("F"),o.move("BR")]),o.and([o.move("BL"),o.move("BR")])])),a=()=>o.not(o.or([o.and([o.move("F"),o.move("BL")]),o.and([o.move("F"),o.move("BR")]),o.and([o.move("BL"),o.move("BR")])]));switch(t){case"full":break;case"experimental-fto-fc":n.set(o.not(l()),v.Ignored);break;case"experimental-fto-f2t":n.set(o.not(i()),v.Ignored),n.set(l(),v.Dim);break;case"experimental-fto-sc":n.set(o.not(s()),v.Ignored),n.set(i(),v.Dim);break;case"experimental-fto-l2c":n.set(o.not(u()),v.Ignored),n.set(s(),v.Dim);break;case"experimental-fto-lbt":n.set(o.not(a()),v.Ignored),n.set(u(),v.Dim);break;case"experimental-fto-l3t":n.set(a(),v.Dim);break;default:console.warn(\`Unsupported stickering for \${e.id}: \${t}. Setting all pieces to dim.\`),n.set(o.and(o.moves([])),v.Dim)}return n.toAppearance()})}function f2(){return h(this,null,function*(){return["full","experimental-fto-fc","experimental-fto-f2t","experimental-fto-sc","experimental-fto-l2c","experimental-fto-lbt","experimental-fto-l3t"]})}var g2=S(()=>{jn()});var ji,c2=S(()=>{Br();g2();ji={id:"fto",fullName:"Face-Turning Octahedron",inventedBy:["Karl Rohrbach","David Pitcher"],inventionYear:1983,def:()=>h(void 0,null,function*(){return $n("FTO")}),svg:()=>h(void 0,null,function*(){return(yield gt("FTO")).generatesvg()}),pg:()=>h(void 0,null,function*(){return gt("FTO")}),appearance:e=>u2(ji,e),stickerings:f2}});function m2(e,t){return h(this,null,function*(){switch(t){case"full":case"F2L":case"LL":return Rt(e,t);default:console.warn(\`Unsupported stickering for \${e.id}: \${t}. Setting all pieces to dim.\`)}return Rt(e,"full")})}function p2(){return h(this,null,function*(){return["full","F2L","LL"]})}var d2=S(()=>{Zr()});var to,L2=S(()=>{Br();d2();to=yr("megaminx","Megaminx",{inventionYear:1981});to.appearance=e=>m2(to,e);to.stickerings=p2});var h2={};ke(h2,{default:()=>vg});var vg,A2=S(()=>{vg=\`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN"
       "http://www.w3.org/TR/2001/REC-SVG-20050904/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-20 -20 546 480" preserveAspectRatio="xMidYMid meet">
  <defs>
  </defs>
  <title>pyraminx</title>
  <defs>
    <g id="stickerA" transform="scale(1, 0.577350269)">
      <path
         d="m 0,1.732050808 1,-1.732050808 1,1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
    <g id="stickerV" transform="scale(1, 0.577350269)">
      <path
         d="m 0,0 1,1.732050808 1,-1.732050808 z"
         stroke="black" stroke-width="0.04px" stroke-linecap="butt" stroke-linejoin="round"
      />
    </g>
  </defs>

<!--        0 1 2 3 4 5 6 7 8 9 10   -->
<!--        | | | | | | | | | | |    -->
<!--    0 - L L L L L F R R R R R    -->
<!--    1 -   L L L F F F R R R      -->
<!--    2 -     L F F F F F R        -->
<!--    3 -       D D D D D          -->
<!--    4 -         D D D            -->
<!--    5 -           D              -->

  <g id="puzzle" transform="translate(5, 5) scale(40, 69.28203232)">
    <!-- CORNERS -->
    <use id="CORNERS-l0-o0" xlink:href="#stickerV" transform="translate(5.2, 1.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l0-o1" xlink:href="#stickerA" transform="translate(3, 0)" style="fill: red"/>
    <use id="CORNERS-l0-o2" xlink:href="#stickerA" transform="translate(7.4, 0)" style="fill: blue"/>

    <use id="CORNERS-l3-o0" xlink:href="#stickerV" transform="translate(4.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l3-o1" xlink:href="#stickerA" transform="translate(4.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS-l3-o2" xlink:href="#stickerA" transform="translate(2, 1)" style="fill: red"/>

    <use id="CORNERS-l2-o0" xlink:href="#stickerV" transform="translate(6.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS-l2-o1" xlink:href="#stickerA" transform="translate(8.4, 1)" style="fill: blue"/>
    <use id="CORNERS-l2-o2" xlink:href="#stickerA" transform="translate(6.2, 3.2)" style="fill: yellow"/>

    <use id="CORNERS-l1-o1" xlink:href="#stickerA" transform="translate(9.4, 0)" style="fill: blue"/>
    <use id="CORNERS-l1-o2" xlink:href="#stickerA" transform="translate(1, 0)" style="fill: red"/>
    <use id="CORNERS-l1-o0" xlink:href="#stickerA" transform="translate(5.2, 4.2)" style="fill: yellow"/>

    <!-- "TIPS" -->
    <!-- CORNERS2 -->
    <use id="CORNERS2-l0-o0" xlink:href="#stickerA" transform="translate(5.2, 0.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l0-o1" xlink:href="#stickerV" transform="translate(4, 0)" style="fill: red"/>
    <use id="CORNERS2-l0-o2" xlink:href="#stickerV" transform="translate(6.4, 0)" style="fill: blue"/>

    <use id="CORNERS2-l3-o0" xlink:href="#stickerA" transform="translate(3.2, 2.066666667)" style="fill: limegreen"/>
    <use id="CORNERS2-l3-o1" xlink:href="#stickerV" transform="translate(3.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l3-o2" xlink:href="#stickerV" transform="translate(2, 2)" style="fill: red"/>

    <use id="CORNERS2-l2-o1" xlink:href="#stickerV" transform="translate(8.4, 2)" style="fill: blue"/>
    <use id="CORNERS2-l2-o2" xlink:href="#stickerV" transform="translate(7.2, 3.2)" style="fill: yellow"/>
    <use id="CORNERS2-l2-o0" xlink:href="#stickerA" transform="translate(7.2, 2.066666667)" style="fill: limegreen"/>

    <use id="CORNERS2-l1-o1" xlink:href="#stickerV" transform="translate(10.4,0)" style="fill: blue"/>
    <use id="CORNERS2-l1-o2" xlink:href="#stickerV" transform="translate(0, 0)" style="fill: red"/>
    <use id="CORNERS2-l1-o0" xlink:href="#stickerV" transform="translate(5.2, 5.2)" style="fill: yellow"/>

    <!-- EDGES -->
    <use id="EDGES-l0-o0" xlink:href="#stickerA" transform="translate(4.2, 1.066666667)" style="fill: limegreen"/>
    <use id="EDGES-l0-o1" xlink:href="#stickerV" transform="translate(3, 1)" style="fill: red"/>

    <use id="EDGES-l5-o0" xlink:href="#stickerA" transform="translate(6.2, 1.066666667)" style="fill: limegreen"/>
    <use id="EDGES-l5-o1" xlink:href="#stickerV" transform="translate(7.4, 1)" style="fill: blue"/>

    <use id="EDGES-l1-o1" xlink:href="#stickerV" transform="translate(8.4, 0)" style="fill: blue"/>
    <use id="EDGES-l1-o0" xlink:href="#stickerV" transform="translate(2, 0)" style="fill: red"/>

    <use id="EDGES-l2-o1" xlink:href="#stickerV" transform="translate(5.2, 3.2)" style="fill: yellow"/>
    <use id="EDGES-l2-o0" xlink:href="#stickerA" transform="translate(5.2, 2.066666667)" style="fill: limegreen"/>

    <use id="EDGES-l3-o0" xlink:href="#stickerV" transform="translate(6.2, 4.2)" style="fill: yellow"/>
    <use id="EDGES-l3-o1" xlink:href="#stickerV" transform="translate(9.4, 1)" style="fill: blue"/>

    <use id="EDGES-l4-o0" xlink:href="#stickerV" transform="translate(4.2, 4.2)" style="fill: yellow"/>
    <use id="EDGES-l4-o1" xlink:href="#stickerV" transform="translate(1, 1)" style="fill: red"/>
  </g>

</svg>\`});var R2,D2=S(()=>{Br();R2={id:"pyraminx",fullName:"Pyraminx",inventedBy:["Uwe Meffert"],inventionYear:1970,def:()=>h(void 0,null,function*(){return $n("pyraminx")}),svg:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(A2(),h2))).default}),pg:()=>h(void 0,null,function*(){return gt("pyraminx")})}});var F2={};ke(F2,{sq1HyperOrbitKPuzzle:()=>wg});var wg,y2=S(()=>{wg={name:"Square-1",orbits:{WEDGES:{numPieces:24,orientations:9},EQUATOR:{numPieces:2,orientations:6}},startPieces:{WEDGES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},EQUATOR:{permutation:[0,1],orientation:[0,0]}},moves:{U_SQ_:{WEDGES:{permutation:[11,0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,22,23],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},EQUATOR:{permutation:[0,1],orientation:[0,0]}},D_SQ_:{WEDGES:{permutation:[0,1,2,3,4,5,6,7,8,9,10,11,23,12,13,14,15,16,17,18,19,20,21,22],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},EQUATOR:{permutation:[0,1],orientation:[0,0]}},_SLASH_:{WEDGES:{permutation:[0,1,2,3,4,5,12,13,14,15,16,17,6,7,8,9,10,11,18,19,20,21,22,23],orientation:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},EQUATOR:{permutation:[0,1],orientation:[0,3]}}}}});var B2={};ke(B2,{default:()=>Ug});var Ug,b2=S(()=>{Ug=\`<?xml version="1.0" encoding="UTF-8"?>
<svg width="360px" height="552px" viewBox="0 0 360 552" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 59.1 (86144) - https://sketch.com -->
    <title>sq1-fancy</title>
    <desc>Created with Sketch.</desc>
    <!-- stroke="none" -->
    <g id="sq1-fancy" stroke="#888" stroke-width="0.25" fill="none" fill-rule="evenodd">
        <g id="EQUATOR" transform="translate(24.000000, 264.000000)">
            <rect id="EQUATOR-l1-o3" style="fill: red" x="168" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o4" style="fill: red" x="192" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o5" style="fill: limegreen" x="216" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o2" style="fill: limegreen" x="240" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o1" style="fill: limegreen" x="264" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l1-o0" style="fill: orange" x="288" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o3" style="fill: orange" x="0" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o4" style="fill: orange" x="24" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o5" style="fill: limegreen" x="48" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o2" style="fill: limegreen" x="72" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o1" style="fill: limegreen" x="96" y="0" width="24" height="24"></rect>
            <rect id="EQUATOR-l0-o0" style="fill: red" x="120" y="0" width="24" height="24"></rect>
        </g>
        <g id="BOTTOM" transform="translate(41.000000, 257.000000)" stroke-linejoin="round">
            <g id="WEDGES-23" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l23-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l23-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l23-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l23-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l23-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l23-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l23-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l23-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-22" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l22-o8" style="fill: blue" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l22-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l22-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l22-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l22-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l22-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l22-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l22-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-21" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l21-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l21-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l21-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l21-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l21-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l21-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l21-o2" style="fill: blue" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l21-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-20" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l20-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l20-o7" style="fill: blue" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l20-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l20-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l20-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l20-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l20-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l20-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-19" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l19-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l19-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l19-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l19-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l19-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l19-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l19-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l19-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-18" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l18-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l18-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l18-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l18-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l18-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l18-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l18-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l18-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-17" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l17-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l17-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l17-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l17-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l17-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l17-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l17-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l17-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-16" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l16-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l16-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l16-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l16-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l16-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l16-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l16-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l16-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-15" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l15-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l15-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l15-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l15-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l15-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l15-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l15-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l15-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-14" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l14-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l14-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l14-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l14-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l14-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l14-o3" style="fill: white" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l14-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l14-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-13" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l13-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l13-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l13-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l13-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l13-o4" style="fill: white" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l13-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l13-o2" style="fill: white" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l13-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-12" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l12-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l12-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l12-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l12-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l12-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l12-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l12-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o1" style="fill: white" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l12-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="TOP" transform="translate(41.000000, -31.000000)" stroke-linejoin="round">
            <g id="WEDGES-11" transform="translate(154.588457, 244.315353) scale(-1, -1) rotate(150.000000) translate(-154.588457, -244.315353) translate(106.588457, 178.315353)">
                <polygon id="WEDGES-l11-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l11-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l11-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l11-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l11-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l11-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l11-o2" style="fill: red" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l11-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-10" transform="translate(196.315353, 237.726896) scale(-1, -1) rotate(120.000000) translate(-196.315353, -237.726896) translate(148.315353, 171.726896)">
                <polygon id="WEDGES-l10-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l10-o7" style="fill: red" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l10-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l10-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l10-o4" style="fill: red" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l10-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l10-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l10-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-9" transform="translate(229.157677, 211.157677) scale(-1, -1) rotate(90.000000) translate(-229.157677, -211.157677) translate(181.157677, 145.157677)">
                <polygon id="WEDGES-l9-o8" style="fill: limegreen" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l9-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l9-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l9-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l9-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l9-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l9-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l9-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-8" transform="translate(244.315353, 171.726896) scale(-1, -1) rotate(60.000000) translate(-244.315353, -171.726896) translate(196.315353, 105.726896)">
                <polygon id="WEDGES-l8-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l8-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l8-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l8-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l8-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l8-o3" style="fill: limegreen" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l8-o2" style="fill: limegreen" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l8-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-7" transform="translate(237.726896, 130.000000) scale(-1, -1) rotate(30.000000) translate(-237.726896, -130.000000) translate(189.726896, 64.000000)">
                <polygon id="WEDGES-l7-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l7-o7" style="fill: limegreen" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l7-o6" style="fill: limegreen" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l7-o5" style="fill: limegreen" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l7-o4" style="fill: limegreen" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l7-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l7-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l7-o0" style="fill: limegreen" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-6" transform="translate(211.157677, 97.157677) scale(-1, -1) translate(-211.157677, -97.157677) translate(163.157677, 31.157677)">
                <polygon id="WEDGES-l6-o8" style="fill: orange" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l6-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l6-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l6-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l6-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l6-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l6-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l6-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-5" transform="translate(171.726896, 82.000000) rotate(150.000000) translate(-171.726896, -82.000000) translate(123.726896, 16.000000)">
                <polygon id="WEDGES-l5-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l5-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l5-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l5-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l5-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l5-o3" style="fill: orange" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l5-o2" style="fill: orange" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l5-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-4" transform="translate(130.000000, 88.588457) rotate(120.000000) translate(-130.000000, -88.588457) translate(82.000000, 22.588457)">
                <polygon id="WEDGES-l4-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l4-o7" style="fill: orange" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l4-o6" style="fill: orange" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l4-o5" style="fill: orange" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l4-o4" style="fill: orange" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l4-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l4-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l4-o0" style="fill: orange" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-3" transform="translate(97.157677, 115.157677) rotate(90.000000) translate(-97.157677, -115.157677) translate(49.157677, 49.157677)">
                <polygon id="WEDGES-l3-o8" style="fill: blue" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l3-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l3-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l3-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l3-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l3-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l3-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l3-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-2" transform="translate(82.000000, 154.588457) rotate(60.000000) translate(-82.000000, -154.588457) translate(34.000000, 88.588457)">
                <polygon id="WEDGES-l2-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l2-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l2-o6" style="fill: #D8D8D8" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l2-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l2-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l2-o3" style="fill: blue" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l2-o2" style="fill: blue" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l2-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-1" transform="translate(88.588457, 196.315353) rotate(30.000000) translate(-88.588457, -196.315353) translate(40.588457, 130.315353)">
                <polygon id="WEDGES-l1-o8" style="fill: #D8D8D8" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l1-o7" style="fill: blue" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l1-o6" style="fill: blue" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l1-o5" style="fill: blue" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l1-o4" style="fill: blue" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l1-o3" style="fill: yellow" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l1-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l1-o0" style="fill: blue" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
            <g id="WEDGES-0" transform="translate(67.157677, 163.157677)">
                <polygon id="WEDGES-l0-o8" style="fill: red" points="25.723 70.277 40.574 95.999 -2.27373675e-13 96"></polygon>
                <polygon id="WEDGES-l0-o7" style="fill: #D8D8D8" points="70.2768775 96 60.8615612 131.138439 40.5741225 95.9988775"></polygon>
                <polygon id="WEDGES-l0-o6" style="fill: red" points="70.2768775 96 40.574 95.999 25.7231225 70.2768775"></polygon>
                <polygon id="WEDGES-l0-o5" style="fill: red" points="48.0001225 47.9995 68.287 47.9995 78.4307806 65.5692194"></polygon>
                <polygon id="WEDGES-l0-o4" style="fill: yellow" points="60.8615 35.1385 68.287 47.9995 48 48"></polygon>
                <polygon id="WEDGES-l0-o3" style="fill: red" points="83.1384388 48 78.4307806 65.5692194 68.2870612 47.9994388"></polygon>
                <polygon id="WEDGES-l0-o2" style="fill: yellow" points="83.1384388 48 68.287 47.9995 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o1" style="fill: yellow" points="96 0 83.1384388 48 60.8615612 35.1384388"></polygon>
                <polygon id="WEDGES-l0-o0" style="fill: red" points="70.2768775 96 25.7231225 70.2768775 48.0001225 47.9995 78.4307806 65.5692194"></polygon>
            </g>
        </g>
        <g id="DIAGONALS" transform="translate(168.861561, 1.019238)" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <line x1="0" y1="287.842323" x2="70.2768775" y2="550.119201" id="BOTTOM"></line>
            <line x1="0.15767665" y1="262.276878" x2="70.4345542" y2="2.27488928e-16" id="TOP"></line>
        </g>
    </g>
</svg>\`});var x2,S2=S(()=>{x2={id:"square1",fullName:"Square-1",inventedBy:["Karel Hr\\u0161el","Vojtech Kopsk\\xFD"],inventionYear:1990,def:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(y2(),F2))).sq1HyperOrbitKPuzzle}),svg:()=>h(void 0,null,function*(){return(yield Promise.resolve().then(()=>(b2(),B2))).default})}});var zt,rn=S(()=>{i0();At();Zr();Br();X0();r2();a2();c2();L2();D2();S2();jn();zt={"3x3x3":qi,"2x2x2":eo,"4x4x4":tn("4x4x4","4\\xD74\\xD74 Cube"),"5x5x5":tn("5x5x5","5\\xD75\\xD75 Cube"),"6x6x6":tn("6x6x6","6\\xD76\\xD76 Cube"),"7x7x7":tn("7x7x7","7\\xD77\\xD77 Cube"),"40x40x40":tn("40x40x40","40\\xD740\\xD740 Cube"),clock:s2,megaminx:to,pyraminx:R2,skewb:yr("skewb","Skewb",{inventedBy:["Tony Durham"]}),square1:x2,fto:ji,gigaminx:yr("gigaminx","Gigaminx",{inventedBy:["Tyler Fox"],inventionYear:2006}),master_tetraminx:yr("master tetraminx","Master Tetraminx",{inventedBy:["Katsuhiko Okamoto"],inventionYear:2002})}});function Ct(e,t){let r=[],n=[];for(let f of t.split(\`
\`)){let g=f.split(" ");if(!f.startsWith("SetOrder ")){if(f.startsWith("Alg ")){let c=z.fromString(f.substring(4)),m=new Je(e);m.reset(),m.applyAlg(c),n.push({alg:c,transformation:m.state})}else if(f.startsWith("SubgroupSizes "))for(let c=1;c<g.length;c++)r.push(parseInt(g[c]))}}let o={ordering:new Array(r.length)},l=[],i=0;l.push(0);let s=z.fromString(""),u=ht(e);for(let f=0;f<r.length;f++)i+=r[f],l.push(i),n.splice(i-1,0,{alg:s,transformation:u});if(n.length!==i)throw Error(\`Bad sgs; expected \${i-r.length} algs but saw \${n.length-r.length}\`);let a={};for(let f in e.orbits){let g=e.orbits[f];a[f]=new Array(g.numPieces).fill(!1)}for(let f=r.length-1;f>=0;f--){let g=[];for(let m=l[f];m<l[f+1];m++){let L=n[m].transformation;for(let p in e.orbits){let F=e.orbits[p];for(let y=0;y<F.numPieces;y++)(L[p].permutation[y]!==y||L[p].orientation[y]!==0)&&(a[p][y]||(g.push({orbitName:p,permutationIdx:y}),a[p][y]=!0))}}let c={};for(let m=l[f];m<l[f+1];m++){let L=_t(e,n[m].transformation),p="";for(let F=0;F<g.length;F++){let y=g[F];p=\`\${p} \${L[y.orbitName].permutation[y.permutationIdx]} \${L[y.orbitName].orientation[y.permutationIdx]}\`}c[p]=n[m],n[m].alg=n[m].alg.invert(),n[m].transformation=_t(e,n[m].transformation)}o.ordering[f]={pieceOrdering:g,lookup:c}}return o}var on=S(()=>{he();At()});var G2={};ke(G2,{cachedData222:()=>Wg,data222:()=>I2});function Wg(){return h(this,null,function*(){return Hi!=null?Hi:Hi=I2()})}function I2(){return h(this,null,function*(){return Ct(yield eo.def(),\`SubgroupSizes 24 21 18 15 12 9 6

Alg F
Alg F2
Alg F'
Alg D
Alg D2
Alg D'
Alg L
Alg L2
Alg L'
Alg F U
Alg F U2
Alg F U'
Alg F L
Alg F L2
Alg F L'
Alg F2 U
Alg F2 U'
Alg F2 R
Alg F2 R'
Alg F' D
Alg F' D'
Alg F' R
Alg F' R'
Alg B
Alg B2
Alg B'
Alg B R
Alg B R2
Alg B R'
Alg B2 U
Alg B2 U2
Alg B2 U'
Alg B2 R
Alg B2 R2
Alg B2 R'
Alg B' U
Alg B' U'
Alg F D' F'
Alg F2 L F2
Alg B R' B2
Alg B R' U2
Alg B2 U R'
Alg B2 R B'
Alg R
Alg R2
Alg R'
Alg R2 U
Alg R2 U2
Alg R2 U'
Alg R' U
Alg R' U2
Alg R' U'
Alg F R F'
Alg F R2 F'
Alg L2 D' L2
Alg L' B L
Alg R2 U' R
Alg R' U R2
Alg R' U R'
Alg F R F' U2
Alg F' U F
Alg F' U2 F
Alg F' U' F
Alg L F L'
Alg L F2 L'
Alg L F' L'
Alg F' D R D'
Alg F' U2 F U'
Alg F D2 B D2 F'
Alg F2 D' L2 D F2
Alg F2 L F L' F
Alg L' F2 L' F2 L
Alg F L' U' L2 F L'
Alg F2 L F L' U2 F
Alg U
Alg U2
Alg U'
Alg F2 D2 B D2 F2
Alg F2 D2 B' D2 F2
Alg L2 D2 R D2 L2
Alg L2 D2 R' D2 L2
Alg F2 D2 B D2 F2 U
Alg F2 D2 B D2 F2 U'
Alg U F2 D2 B D2 F2
Alg U F2 D2 B' D2 F2
Alg F D B D' R' F' U
Alg F' D L F U B' L'
Alg F' L' F U L U L'
Alg D' L F D R' U' F'
Alg L F L' U' F' U' F
Alg L D' F' L' U' R F
Alg F D F U F' L' F' R'
Alg F2 D' F L F2 D F' R'
Alg F D' F L' D F R2 U2 F' U'
Alg F D' L D' L F D2 L2 B' R'
Alg F L' D F R2 D2 L D F' U2
Alg F L' D F2 D' L F L2 F2 U
Alg F D F' D L2 F R' F' D' B2 U'\`)})}var Hi,T2=S(()=>{rn();on();Hi=null});var Wf={};ke(Wf,{cachedMegaminxDefWithoutMO:()=>Jl,cachedSGSDataMegaminx:()=>np,sgsDataMegaminx:()=>Of});function rp(){return h(this,null,function*(){return er("megaminx",{allMoves:!0,addRotations:!0}).writekpuzzle(!0)})}function Jl(){return h(this,null,function*(){return Ks!=null?Ks:Ks=rp()})}function np(){return h(this,null,function*(){return Vs!=null?Vs:Vs=Of()})}function Of(){return h(this,null,function*(){return Ct(yield Jl(),\`SubgroupSizes 12 5 60 58 60 56 54 57 52 50 54 48 46 51 44 42 48 40 45 38 36 42 34 32 39 30 36 28 26 33 24 30 22 20 27 18 24 16 14 21 12 18 10 15 8 6 2 12 9 3

Alg Rv
Alg Rv2
Alg Rv2'
Alg Rv'
Alg Lv'
Alg Lv2
Alg Lv2'
Alg Fv
Alg Fv'
Alg BRv2
Alg Lv2 Rv'

Alg Uv
Alg Uv2
Alg Uv2'
Alg Uv'

Alg D
Alg D2
Alg D2'
Alg D'
Alg B
Alg B2
Alg B2'
Alg B'
Alg D DL
Alg D DL2
Alg D DL2'
Alg D DL'
Alg D2 FL
Alg D2 FL2
Alg D2 FL2'
Alg D2 FL'
Alg D2' FR
Alg D2' FR2
Alg D2' FR2'
Alg D2' FR'
Alg D' DR
Alg D' DR2
Alg D' DR2'
Alg D' DR'
Alg B DR
Alg B DR2'
Alg B DR'
Alg B2 BR2
Alg B2 BR2'
Alg B2 BR'
Alg B2' BL
Alg B2' BL2
Alg B2' BL2'
Alg B' DL
Alg B' DL2
Alg B' DL'
Alg D DL B
Alg D DL B2'
Alg D DL B'
Alg D DL2' L
Alg D DL2' L2
Alg D DL2' L2'
Alg D DL' FL
Alg D DL' FL2
Alg D DL' FL'
Alg D2 FL2' F
Alg D2 FL2' F2
Alg D2 FL2' F2'
Alg D2 FL' FR
Alg D2 FL' FR2
Alg D2 FL' FR'
Alg D2' FR2' R
Alg D2' FR2' R2
Alg D2' FR2' R2'
Alg B DR2' R2'
Alg B DR' BR2
Alg B2 BR' BL
Alg B2' BL2' L
Alg D DL2' L2' F
Alg DL
Alg DL2
Alg DL2'
Alg DL'
Alg DL BL
Alg DL BL2
Alg DL BL2'
Alg DL BL'
Alg DL2 L
Alg DL2 L2
Alg DL2 L2'
Alg DL2 L'
Alg DL2' FL
Alg DL2' FL2
Alg DL2' FL2'
Alg DL2' FL'
Alg D B D'
Alg D B2 D'
Alg D B2' D'
Alg D B' D'
Alg D2 B D2'
Alg D2 DL' D2'
Alg D2' DL' D2
Alg D' B D
Alg D' DL' D
Alg B2 DR2 B2'
Alg B2 DR2' B2'
Alg B2 DR' B2'
Alg B2' BR B2
Alg B2' BR2 B2
Alg B2' BR2' B2
Alg B' BL B
Alg B' BL2 B
Alg B' BL' B
Alg DL BL2' U
Alg DL BL2' U2
Alg DL BL2' U2'
Alg DL BL' L
Alg DL BL' L2
Alg DL BL' L'
Alg DL2 L2' F
Alg DL2 L2' F2
Alg DL2 L2' F2'
Alg DL2 L' FL
Alg DL2 L' FL2
Alg DL2 L' FL'
Alg DL2' FL2' FR
Alg DL2' FL2' FR2
Alg DL2' FL2' FR2'
Alg D B D' DR2
Alg D B D' DR'
Alg D2 B D2' FR2'
Alg D' B D DL
Alg B2 DR' B2' BR
Alg B2 DR' B2' BR'
Alg B2' BR2' B2 U
Alg DL BL2' U2' F
Alg D FL D'
Alg D FL2 D'
Alg D FL2' D'
Alg D FL' D'
Alg D2 FR D2'
Alg D2 FR2 D2'
Alg D2 FR2' D2'
Alg D2' DR D2
Alg D2' DR2 D2
Alg D2' DR2' D2
Alg DL2 BL DL2'
Alg DL2 BL2 DL2'
Alg DL2 BL2' DL2'
Alg DL2 BL' DL2'
Alg DL2' L2 DL2
Alg DL2' L2' DL2
Alg DL' FL2 DL
Alg DL' FL' DL
Alg D FL D' FL2'
Alg D FL L D'
Alg D FL L2 D'
Alg D FL L2' D'
Alg D FL2 F D'
Alg D FL2 F2 D'
Alg D FL2 F2' D'
Alg D FL2 L D'
Alg D FL2 L2 D'
Alg D FL2' D' FR
Alg D FL2' D' FR2
Alg D FL2' D' FR2'
Alg D FL2' F D'
Alg D FL2' F2' D'
Alg D FL2' FR2' D'
Alg D FL2' FR' D'
Alg D FL' D' FL
Alg D FL' FR D'
Alg D2 FR D2' FR2'
Alg D2 FR2 R D2'
Alg D2 FR2 R2 D2'
Alg D2 FR2 R2' D2'
Alg D2 FR2' D2' DR
Alg D2 FR2' D2' DR2
Alg D2 FR2' D2' DR2'
Alg D2 FR2' D2' DR'
Alg D2 FR2' R2' D2'
Alg D2 FR' DR2' D2'
Alg D2' DR D2 DR2'
Alg D2' DR2 BR D2
Alg D2' DR2 BR2' D2
Alg D2' DR2' BR2' D2
Alg D2' DR2' BR' D2
Alg DL2 BL2 DL2' BL'
Alg DL2 BL2 DL2' BR'
Alg DL2 BL' DL2' L'
Alg DL2' L2 DL2 BL2
Alg D FL L2 BL2 D'
Alg D FL L' FL2' D'
Alg D FL2 L FL' D'
Alg D FL2' D' FR2 DR2'
Alg B DL B'
Alg B DL2 B'
Alg B DL2' B'
Alg B DL' B'
Alg B2 D B2'
Alg B2 D2 B2'
Alg B2 D2' B2'
Alg B2 D' B2'
Alg B2 DL B2'
Alg B2' D' B2
Alg B2' DL B2
Alg B' D' B
Alg B DL B' BL
Alg B DL B' BL2
Alg B DL B' BL2'
Alg B DL B' BL'
Alg B DL2 B' BL2
Alg B DL2 B' BL2'
Alg B DL2 B' BL'
Alg B DL2' L2 B'
Alg B DL2' L2' B'
Alg B DL2' L' B'
Alg B DL' FL B'
Alg B DL' FL2 B'
Alg B DL' FL2' B'
Alg B DL' FL' B'
Alg B2 D FL B2'
Alg B2 D FL2' B2'
Alg B2 D FL' B2'
Alg B2 D2 FR2 B2'
Alg B2 D2 FR2' B2'
Alg B2 D2 FR' B2'
Alg B2 D2' B2' DR
Alg B2 D2' B2' DR2
Alg B2 D2' B2' DR2'
Alg B2 DL B2' BR
Alg B2 DL B2' BR2
Alg B2 DL B2' BR2'
Alg B2' D' B2 BR2
Alg B2' D' B2 BR2'
Alg B' D' B DR
Alg B' D' B DR2'
Alg D FL' D FR D2'
Alg D DL FL DL' D'
Alg D2' FR DR FR' D2
Alg B DL B D B2'
Alg B DL B D2' B2'
Alg B DL B' BL2 U2
Alg B DL B' BL2 U2'
Alg B DL B' BL2 U'
Alg B DL2 B' BL2' U2
Alg B DL2 B' BL2' U2'
Alg B DL2 B' BL' L2
Alg B DL2' L2' B' F2
Alg B2 D FL2' B2' F2'
Alg DR
Alg DR2
Alg DR2'
Alg DR'
Alg DR2 FR
Alg DR2 FR2
Alg DR2 FR2'
Alg DR2 FR'
Alg DR2' R
Alg DR2' R2
Alg DR2' R2'
Alg DR2' R'
Alg DR' BR
Alg DR' BR2
Alg DR' BR2'
Alg DR' BR'
Alg D DR D'
Alg D2 DR D2'
Alg B BR B'
Alg B BR2' B'
Alg B BR' B'
Alg B2 BL2 B2'
Alg B2 BL2' B2'
Alg B2 BL' B2'
Alg DR2 FR2 FL2
Alg DR2 FR2 FL2'
Alg DR2 FR2 FL'
Alg DR2 FR2' F
Alg DR2 FR2' F2
Alg DR2 FR2' F2'
Alg DR2 FR' R
Alg DR2 FR' R2
Alg DR2 FR' R'
Alg DR2' R FR
Alg DR2' R FR2'
Alg DR2' R FR'
Alg DR2' R2' U
Alg DR2' R2' U2
Alg DR2' R2' U2'
Alg DR2' R' BR2'
Alg DR' BR2' BL'
Alg D DR2 FR D'
Alg B BR B' DR
Alg B BR B' DR2
Alg B BR2' B' U2'
Alg B BR' B' BL2
Alg B BR' B' BL2'
Alg B BR' B' BL'
Alg B2 BL2' L' B2'
Alg DR2 FR2 FL' F
Alg DR2 FR2' F FL2'
Alg DR2 FR2' F FL'
Alg B BR2' U2' L2' B'
Alg D2' FL D2
Alg D2' FL2 D2
Alg D2' FL2' D2
Alg D2' FL' D2
Alg D' FR2 D
Alg D' FR2' D
Alg D' FR' D
Alg DR FR DR'
Alg DR FR2' DR'
Alg DR FR' DR'
Alg DR2 R2 DR2'
Alg DR2 R2' DR2'
Alg DR2' BR DR2
Alg DR2' BR2 DR2
Alg DR2' BR2' DR2
Alg D DR2 D' DR2'
Alg D DR2' D' DR2
Alg D2' FL D2 FR'
Alg D2' FL2 D2 FL2'
Alg D2' FL2 D2 FL'
Alg D2' FL2 L D2
Alg D2' FL2 L2 D2
Alg D2' FL2 L2' D2
Alg D2' FL2 L' D2
Alg D2' FL2' F D2
Alg D2' FL2' F2 D2
Alg D2' FL2' F2' D2
Alg D2' FL2' L D2
Alg D2' FL2' L2 D2
Alg D2' FL2' L2' D2
Alg D2' FL2' L' D2
Alg D2' FL' F D2
Alg D2' FL' F2' D2
Alg D' FR FL' D
Alg D' FR2 D FR'
Alg D' FR2 D FL2
Alg D' FR2 D FL2'
Alg D' FR2 FL D
Alg D' FR2' R2' D
Alg D' FR' R2' D
Alg DR2 R2 DR2' U2'
Alg DR2 R2' DR2' BR
Alg DR2 R2' DR2' BR2
Alg DR2 R2' DR2' BR2'
Alg DR2 R2' DR2' BR'
Alg DR2 R' BR2' DR2'
Alg DR2' BR DR2 BR2'
Alg DR2' BR2 BL DR2
Alg DR2' BR2 BL2' DR2
Alg DR2' BR2' BL' DR2
Alg D B2' BL2' B2 D'
Alg D2 B2 DL2 B2' D2'
Alg D2' FL2 L' FL2 D2
Alg D2' FL2' L D2 FL'
Alg D2' FL2' L FL2' D2
Alg D2' FL2' L2' BL2 D2
Alg B2' DR B2
Alg B2' DR2 B2
Alg B2' DR2' B2
Alg B2' DR' B2
Alg B' DR' B
Alg B2' DR FR B2
Alg B2' DR FR2 B2
Alg B2' DR FR2' B2
Alg B2' DR FR' B2
Alg B2' DR2 R B2
Alg B2' DR2 R2 B2
Alg B2' DR2 R2' B2
Alg B2' DR2 R' B2
Alg B2' DR2' B2 BR
Alg B2' DR2' B2 BR2
Alg B2' DR2' B2 BR2'
Alg B2' DR2' B2 BR'
Alg B2' DR' B2 BL2
Alg B2' DR' B2 BL2'
Alg B2' DR' B2 BL'
Alg B' DR2' BR' B
Alg B' DR' B BR
Alg B' DR' B BR2'
Alg B' DR' B BR'
Alg D2' FR2' FL FR2 D2
Alg D2' FR2' FL2 FR2 D2
Alg D2' FR2' FL2' FR2 D2
Alg D' DR2' FR DR2 D
Alg D' DR2' FR2 DR2 D
Alg D' DR' FR' DR D
Alg D' FR D' FL' D2
Alg B2 D2 DL2 D2' B2'
Alg B2 D2 DL2' D2' B2'
Alg B2 D2 DL' D2' B2'
Alg B2 D' FR' D B2'
Alg B2 DL D2' DL' B2'
Alg B2 DL D' DL' B2'
Alg B2' DR FR2' B2 F2
Alg B2' DR FR2' B2 F2'
Alg B2' DR FR' R B2
Alg B2' DR FR' R2 B2
Alg B2' DR2 R2' B2 U
Alg B2' DR2 R2' B2 U2
Alg B2' DR2 R2' B2 U2'
Alg B2' DR' B2 BL2 U'
Alg B' DR2' BR' B BL2'
Alg DR D FR D' DR'
Alg DL2' B D B' DL2
Alg D2' FR2' FL2' FR2 F D2
Alg D' DR2' FR DR2 D FL2'
Alg B2 D B D' DR B2
Alg FR
Alg FR2
Alg FR2'
Alg FR'
Alg FR2 FL
Alg FR2 FL2
Alg FR2 FL2'
Alg FR2 FL'
Alg FR2' F
Alg FR2' F2
Alg FR2' F2'
Alg FR2' F'
Alg FR' R
Alg FR' R2
Alg FR' R2'
Alg FR' R'
Alg D FR D'
Alg DR R DR'
Alg DR R2' DR'
Alg DR R' DR'
Alg DR2 BR2 DR2'
Alg DR2 BR2' DR2'
Alg DR2 BR' DR2'
Alg FR2 FL2' L
Alg FR2 FL2' L2
Alg FR2 FL2' L2'
Alg FR2 FL' F
Alg FR2 FL' F2
Alg FR2 FL' F'
Alg FR2' F FL
Alg FR2' F FL2'
Alg FR2' F FL'
Alg FR2' F2' U
Alg FR2' F2' U2
Alg FR2' F2' U2'
Alg FR2' F' R2'
Alg FR' R2' BR'
Alg DR R DR' FR
Alg DR R DR' FR2
Alg DR R2' DR' U2'
Alg DR R' DR' BR2
Alg DR R' DR' BR2'
Alg DR R' DR' BR'
Alg DR2 BR2' BL2' DR2'
Alg DR2 BR2' BL' DR2'
Alg FR2 FL' F L2
Alg FR2 FL' F L2'
Alg B' DR2 BR' DR2' B
Alg DR R2' U2' BL2 DR'
Alg D' FL D
Alg D' FL2 D
Alg D' FL2' D
Alg D' FL' D
Alg FR FL FR'
Alg FR FL2 FR'
Alg FR FL2' FR'
Alg FR FL' FR'
Alg FR2 F2 FR2'
Alg FR2 F2' FR2'
Alg FR2' R FR2
Alg FR2' R2 FR2
Alg FR2' R2' FR2
Alg D FR2 D' FR2'
Alg D FR2' D' FR2
Alg D' FL D FL'
Alg D' FL2 D FL'
Alg D' FL2 L D
Alg D' FL2 L2 D
Alg D' FL2 L2' D
Alg D' FL2 L' D
Alg D' FL2' F2' D
Alg D' FL2' L2 D
Alg D' FL2' L2' D
Alg D' FL2' L' D
Alg D' FL' F2' D
Alg FR FL2' F' FR'
Alg FR FL2' FR' L
Alg FR FL2' FR' L2
Alg FR FL2' FR' L2'
Alg FR2 F2 FR2' U2
Alg FR2 F2 FR2' U2'
Alg FR2 F2' FR2' U2'
Alg FR2 F2' FR2' R
Alg FR2 F2' FR2' R2
Alg FR2 F2' FR2' R2'
Alg FR2 F2' FR2' R'
Alg FR2 F' R2' FR2'
Alg FR2' R FR2 R2'
Alg FR2' R2 BR FR2
Alg FR2' R2 BR2 FR2
Alg FR2' R2 BR2' FR2
Alg FR2' R2' BR2' FR2
Alg FR2' R2' BR' FR2
Alg D DR2' BR2' DR2 D'
Alg D FR2' D' FR2 FL2
Alg D2' B DL B' D2
Alg D2' B2' D' B2 D2'
Alg D' FL2 L BL D
Alg D' FL2 L' FL2 D
Alg D' FL2' F2' R' D
Alg D' FL2' L FL2' D
Alg D' FL2' L2' BL2 D
Alg DR2' FR DR2
Alg DR2' FR2 DR2
Alg DR2' FR2' DR2
Alg DR2' FR' DR2
Alg DR' FR' DR
Alg DR2' FR FL DR2
Alg DR2' FR FL2 DR2
Alg DR2' FR FL2' DR2
Alg DR2' FR FL' DR2
Alg DR2' FR2 DR2 F
Alg DR2' FR2 DR2 F2
Alg DR2' FR2 DR2 F2'
Alg DR2' FR2 DR2 F'
Alg DR2' FR2' DR2 R
Alg DR2' FR2' DR2 R2
Alg DR2' FR2' DR2 R2'
Alg DR2' FR2' DR2 R'
Alg DR2' FR' DR2 BR2
Alg DR2' FR' DR2 BR2'
Alg DR2' FR' DR2 BR'
Alg DR' FR2' R' DR
Alg DR' FR' DR R
Alg DR' FR' DR R2'
Alg DR' FR' DR R'
Alg D' FR2' FL FR2 D
Alg D' FR2' FL2 FR2 D
Alg D' FR' FL' FR D
Alg B2' DR2 FR' DR2' B2
Alg B' DR2 FR' DR2' B
Alg DR2 D' FL' D DR2'
Alg DR2' FR FL2' DR2 L
Alg DR2' FR FL2' DR2 L2
Alg DR2' FR FL2' DR2 L2'
Alg DR2' FR FL' DR2 F
Alg DR2' FR FL' DR2 F2
Alg DR2' FR2 F FL2 DR2
Alg DR2' FR2 DR2 F2' U
Alg DR2' FR2 DR2 F2' U2
Alg DR2' FR2 DR2 F2' U2'
Alg DR2' FR' DR2 BR2 U'
Alg DR2' FR' DR2 BR2' BL2'
Alg DR' FR2' R' DR BR2'
Alg D' FR2' FL2 FR2 L D
Alg D' FR2' FL2 FR2 L2 D
Alg B2' DR2' FR2' R' DR2 B2
Alg DR2 D DR D' FR DR2
Alg DR2' FR' DR2 BR2 U' BL2
Alg FL
Alg FL2
Alg FL2'
Alg FL'
Alg FL L
Alg FL L2
Alg FL L2'
Alg FL L'
Alg FL2 F
Alg FL2 F2
Alg FL2 F2'
Alg FL2 F'
Alg FR2' FL2' FR2
Alg FR' FL2' FR
Alg FL L2 BL
Alg FL L2 BL2
Alg FL L2 BL2'
Alg FL L2 BL'
Alg FL L2' U
Alg FL L2' U2
Alg FL L2' U2'
Alg FL L' F
Alg FL L' F2
Alg FL L' F'
Alg FL2 F L
Alg FL2 F L2
Alg FL2 F L2'
Alg FL2 F L'
Alg FL2 F2' R
Alg FL2 F2' R2
Alg FL2 F2' R2'
Alg FR' FL2 F' FR
Alg FL L2 BL2' BR
Alg FL L2 BL2' BR2
Alg FL L2 BL' U
Alg FL L2' U BL2
Alg FL L2' U BL2'
Alg FL L2' U BL'
Alg FL L2' U2' R
Alg FL L2' U2' R2
Alg FL L' F' FL
Alg FL L' F' FL2
Alg FL L' F' FL2'
Alg B DL2' BL DL2 B'
Alg FL L2 BL' U BR2'
Alg FL2 L FL2'
Alg FL2 L2 FL2'
Alg FL2 L2' FL2'
Alg FL2 L' FL2'
Alg FL2' F2 FL2
Alg FL2' F2' FL2
Alg FL2' F' FL2
Alg FR2' FL' FR2 FL
Alg FL2 L2 FL2' L2'
Alg FL2 L2 FL2' L'
Alg FL2 L2 FL2' BL
Alg FL2 L2 FL2' BL2
Alg FL2 L2 FL2' BL2'
Alg FL2 L2 FL2' BL'
Alg FL2 L2' FL2' U
Alg FL2 L2' FL2' U2
Alg FL2 L2' FL2' U2'
Alg FL2 L2' FL2' BL
Alg FL2 L2' FL2' BL2
Alg FL2 L2' FL2' BL2'
Alg FL2 L2' FL2' BL'
Alg FL2 L' FL2' U
Alg FL2 L' FL2' U2'
Alg FL2 L' FL2' F
Alg FL2 L' FL2' F2
Alg FL2 L' FL2' F2'
Alg FL2 L' FL2' F'
Alg FL2' F L FL2
Alg FL2' F L' FL2
Alg FL2' F2 L FL2
Alg FL2' F2 L2 FL2
Alg FL2' F2 L2' FL2
Alg FL2' F2 FL2 F'
Alg FL2' F2 FL2 L2
Alg FL2' F2' R FL2
Alg FL2' F2' R2 FL2
Alg FL2' F2' R2' FL2
Alg FL2' F' R2' FL2
Alg FL2' F' R' FL2
Alg FL' FR2' FL FR2
Alg D DR2' FR2' DR2 D'
Alg D FR2' R' FR2 D'
Alg D' DL2 BL2 DL2' D
Alg B2 D2' B D2 B2
Alg DR2 D2 DR D2' DR2
Alg FR2 D FR D' FR2
Alg FL2 L2 BL' L2 FL2'
Alg FL2 L2 FL2' BL2 BR
Alg FL2 L2' BL L2' FL2'
Alg FL2 L2' FL2' BL L'
Alg DL FL DL'
Alg DL FL2 DL'
Alg DL FL2' DL'
Alg DL FL' DL'
Alg DL2 FL DL2'
Alg DL FL DL' L
Alg DL FL DL' L2
Alg DL FL DL' L2'
Alg DL FL DL' L'
Alg DL FL2 L DL'
Alg DL FL2 L2 DL'
Alg DL FL2 L2' DL'
Alg DL FL2 L' DL'
Alg DL FL2 DL' L
Alg DL FL2' DL' F2
Alg DL FL2' DL' F2'
Alg DL FL2' DL' F'
Alg DL2 FL DL2' BL
Alg DL2 FL DL2' BL2
Alg DL2 FL DL2' BL2'
Alg B DL2' FL DL2 B'
Alg B2 DL2' FL DL2 B2'
Alg FL2 F2 L' F2' FL2'
Alg FL2 F2' L' F2 FL2'
Alg FL2 F' L' F FL2'
Alg FL2' FR2' FL FR2 FL2
Alg FL2' FR' F' FR FL2
Alg DL FL DL' L BL2'
Alg DL FL DL' L BL'
Alg DL FL DL' L2 U2
Alg DL FL DL' L2 U2'
Alg DL FL2 L2' DL' U2
Alg DL FL2 L2' DL' U2'
Alg DL FL2 L' DL' F'
Alg DL FL2' DL' F2' R2
Alg DL FL2' DL' F2' R2'
Alg DL2 FL DL2' BL2 BR2
Alg B DL2 FL DL2' BL B'
Alg FL2 F2' L' F2 R2 FL2'
Alg FL2 F2' L' F2 R2' FL2'
Alg FL2' FR' F FR L FL2
Alg DL FL DL' L BL2' BR2
Alg DL FL2 L DL FL' DL2'
Alg FR F FR'
Alg FR F2 FR'
Alg FR F2' FR'
Alg FR F' FR'
Alg FR2 R FR2'
Alg FR2 R2 FR2'
Alg FR2 R2' FR2'
Alg FR2 R' FR2'
Alg FL2' L FL2
Alg FL2' L2 FL2
Alg FL2' L2' FL2
Alg FL' F FL
Alg FL' F2 FL
Alg FL' F' FL
Alg FR F FR' F'
Alg FR F2 FR' L
Alg FR F2' FR' U
Alg FR F2' FR' U2
Alg FR F2' FR' U2'
Alg FR F' FR' R
Alg FR F' FR' R2
Alg FR F' FR' R2'
Alg FR F' FR' R'
Alg FR2 R FR2' F2
Alg FR2 R FR2' R'
Alg FR2 R2' BR FR2'
Alg FR2 R2' BR2 FR2'
Alg FR2 R2' BR2' FR2'
Alg FR2 R2' BR' FR2'
Alg FL2' L2 FL2 BL
Alg FL2' L2 FL2 BL2
Alg FL2' L2' FL2 U
Alg FL' F L2 FL
Alg FL' F L2' FL
Alg FL' F FL L
Alg DR' FR2 R' FR2' DR
Alg FR F2' U2' BR FR'
Alg FR F2' U2' BR2 FR'
Alg FR F' FR R' FR2'
Alg FL2' L2' FL2 U BL2
Alg FL2' L2' FL2 U BL2'
Alg FR F L F' FR'
Alg FR F L2 F' FR'
Alg FR F L2' F' FR'
Alg FR F L' F' FR'
Alg FR F2 U F2' FR'
Alg FR F2 U2 F2' FR'
Alg FR F2 U2' F2' FR'
Alg FR F2' R F2 FR'
Alg FR F2' R2 F2 FR'
Alg FR F2' R2' F2 FR'
Alg FR FL' L FL FR'
Alg FR FL' L2 FL FR'
Alg FR FL' L' FL FR'
Alg FR2 F2' L F2 FR2'
Alg FR2 F2' L2 F2 FR2'
Alg FR2 F' U2 F FR2'
Alg FR2 F' U2' F FR2'
Alg FR2 R U R' FR2'
Alg FR2 R U' R' FR2'
Alg FR2 R2 BR2 R2' FR2'
Alg FR2 R2 BR2' R2' FR2'
Alg FR2' DR BR DR' FR2
Alg FR2' R2' U R2 FR2
Alg FR2' R2' U2 R2 FR2
Alg FR2' R' BR2 R FR2
Alg FR2' R' BR2' R FR2
Alg FR2' R' BR' R FR2
Alg FL2 L BL L' FL2'
Alg FL2 L2 U2' L2' FL2'
Alg FL2 DL' BL2 DL FL2'
Alg FL2' F2 R2' F2' FL2
Alg FL2' L2' BL2 L2 FL2
Alg FL' F2 L F2' FL
Alg FL' F2 L2 F2' FL
Alg FL' F' R' F FL
Alg FL' FR R' FR' FL
Alg FR F L2' F' FR' BL
Alg FR F L2' F' FR' BL2
Alg FR F L' F' FR' F'
Alg FR F2 U2 BR2 F2' FR'
Alg FR F2 U2 BR2' F2' FR'
Alg FR F2' R F2 R2' FR'
Alg FR F2' R2' F2 FR' R'
Alg FR FL' L FL FR' F'
Alg FR2 F' U2 F FR2' L2'
Alg FR F L2 BL' L2 F' FR'
Alg FR F L2' F U' F2' FR'
Alg R
Alg R2
Alg R2'
Alg R'
Alg R2 F
Alg R2 F2
Alg R2 F2'
Alg R2 F'
Alg R2' U
Alg R2' U2
Alg R2' U2'
Alg R2' U'
Alg R' BR
Alg R' BR2
Alg R' BR2'
Alg R' BR'
Alg DR BR DR'
Alg DR BR2' DR'
Alg DR BR' DR'
Alg FR R FR'
Alg R2 F2' L
Alg R2 F2' L2
Alg R2 F2' L2'
Alg R2 F' U
Alg R2 F' U2
Alg R2 F' U'
Alg R2' U F
Alg R2' U F2'
Alg R2' U F'
Alg R2' U2' BL
Alg R2' U2' BL2
Alg R2' U2' BL2'
Alg R2' U' BR2'
Alg DR BR DR' R
Alg DR BR DR' R2
Alg DR BR2' BL2' DR'
Alg DR BR2' BL' DR'
Alg R2 F' U L2
Alg R2 F' U L2'
Alg FR' F FR
Alg FR' F2 FR
Alg FR' F2' FR
Alg FR' F' FR
Alg R F R'
Alg R F2 R'
Alg R F2' R'
Alg R F' R'
Alg R2 U2 R2'
Alg R2 U2' R2'
Alg R2' BR R2
Alg R2' BR2 R2
Alg R2' BR2' R2
Alg FR R2 FR' R2'
Alg FR R2' FR' R2
Alg FR' F FR F'
Alg FR' F2 FR F'
Alg FR' F2 FR L
Alg FR' F2 FR L2
Alg FR' F2 FR L2'
Alg FR' F2 FR L'
Alg FR' F2' FR U2'
Alg FR' F2' FR L2
Alg FR' F2' FR L2'
Alg FR' F2' FR L'
Alg FR' F' FR U2'
Alg R F2' U' R'
Alg R F2' R' L
Alg R F2' R' L2
Alg R F2' R' L2'
Alg R2 U2 R2' BL2
Alg R2 U2 R2' BL2'
Alg R2 U2' BR R2'
Alg R2 U2' BR2 R2'
Alg R2 U2' R2' BL2'
Alg R2 U2' R2' BR2'
Alg R2 U2' R2' BR'
Alg R2 U' BR2' R2'
Alg R2' BR R2 BR2'
Alg DR BR2 BL2' BR2' DR'
Alg FR R2' FR' R2 F2
Alg FR' F2 L' F2 FR
Alg FR' F2' U2' BR' FR
Alg FR' F2' L F2' FR
Alg DR' R DR
Alg DR' R2 DR
Alg DR' R2' DR
Alg DR' R' DR
Alg DR' R DR F
Alg DR' R DR F2
Alg DR' R DR F2'
Alg DR' R DR F'
Alg DR' R2 DR U
Alg DR' R2 DR U2
Alg DR' R2 DR U2'
Alg DR' R2 DR U'
Alg DR' R2' DR BR
Alg DR' R2' DR BR2
Alg DR' R2' DR BR2'
Alg DR' R2' DR BR'
Alg DR' R' DR BR
Alg DR' R' DR BR2'
Alg DR' R' DR BR'
Alg B2' DR2' R' DR2 B2
Alg DR2' FR' F FR DR2
Alg DR2' FR' F2 FR DR2
Alg DR2' FR' F' FR DR2
Alg DR' R DR F2' L
Alg DR' R DR F2' L2
Alg DR' R DR F2' L2'
Alg DR' R DR F' U
Alg DR' R DR F' U2
Alg DR' R DR F' U'
Alg DR' R2 U2' BL DR
Alg DR' R2 U2' BL2 DR
Alg DR' R2 U2' BL2' DR
Alg DR' R2 DR U F2
Alg DR' R' DR BR2' BL2'
Alg DR2' FR' F2 FR DR2 L
Alg DR2' FR' F2 FR DR2 L2
Alg DR' FR' F' FR R' DR
Alg BR
Alg BR2
Alg BR2'
Alg BR'
Alg BR2' U
Alg BR2' U2
Alg BR2' U2'
Alg BR2' U'
Alg BR' BL
Alg BR' BL2
Alg BR' BL2'
Alg BR' BL'
Alg B BL B'
Alg B BL2' B'
Alg B BL' B'
Alg BR2' U2 F
Alg BR2' U2 F2
Alg BR2' U2 F2'
Alg BR2' U2 F'
Alg BR2' U2' L
Alg BR2' U2' L2
Alg BR2' U2' L2'
Alg BR2' U' BL2'
Alg BR' BL U
Alg BR' BL U2
Alg BR' BL U2'
Alg BR' BL U'
Alg B BL B' BR
Alg B BL B' BR2
Alg B BL B' BR2'
Alg B BL2' L2' B'
Alg B BL2' L' B'
Alg BR2' U2' L F2
Alg BR2' U2' L F2'
Alg BR2' U2' L F'
Alg BR2 U BR2'
Alg BR2 U2 BR2'
Alg BR2 U2' BR2'
Alg BR2 U' BR2'
Alg BR2' BL BR2
Alg BR2' BL2 BR2
Alg BR2' BL2' BR2
Alg BR R BR' R'
Alg BR2 U BR2' U2'
Alg BR2 U BR2' U'
Alg BR2 U BR2' F
Alg BR2 U BR2' F2
Alg BR2 U BR2' F2'
Alg BR2 U BR2' F'
Alg BR2 U2 BR2' F
Alg BR2 U2 BR2' F2
Alg BR2 U2 BR2' F2'
Alg BR2 U2 BR2' F'
Alg BR2 U2 BR2' L
Alg BR2 U2 BR2' L2
Alg BR2 U2 BR2' L2'
Alg BR2 U2' BL BR2'
Alg BR2 U2' BL2 BR2'
Alg BR2 U2' BL' BR2'
Alg BR2 U2' BR2' L
Alg BR2 U2' BR2' L2'
Alg BR2 U2' BR2' BL2'
Alg BR2 U2' BR2' BL'
Alg BR2 U' BL BR2'
Alg BR2 U' BL2' BR2'
Alg BR2 U' BL' BR2'
Alg BR2' BL BR2 U2
Alg BR2' BL BR2 U2'
Alg BR2' BL BR2 BL2'
Alg BR2' BL BR2 BL'
Alg B BL2 L2' BL2' B'
Alg DR' R2 F R2' DR
Alg BR2 U F' U2' BR2'
Alg BR2 U BR2' U2' BL'
Alg BR2 U2 F U' BR2'
Alg BR2 U2 BR2' L F2'
Alg B' BR B
Alg B' BR2 B
Alg B' BR2' B
Alg B' BR' B
Alg B' BR2 B U
Alg B' BR2 B U2
Alg B' BR2 B U2'
Alg B' BR2 B U'
Alg B' BR2' B BL
Alg B' BR2' B BL2
Alg B' BR2' B BL2'
Alg B' BR2' B BL'
Alg B' BR' B BL
Alg B' BR' B BL2'
Alg B' BR' B BL'
Alg B' BR2 U2' L B
Alg B' BR2 U2' L2 B
Alg B' BR2 U2' L2' B
Alg B' BR2 B U2 F
Alg B' BR2 B U2 F2
Alg B' BR2 B U2 F2'
Alg B' BR2 B U2 F'
Alg B' BR2' B BL U
Alg B' BR2' B BL U2
Alg B' BR2' B BL U2'
Alg B' BR2' B BL U'
Alg B' BR' B BL2' L2'
Alg B' BR' B BL2' L'
Alg BR2 R U R' BR2'
Alg B' BR2 U2' L B F2'
Alg B' BR2 U2' L B F'
Alg B' BR' B BR2 BL BR2'
Alg B' BR2 U R BR' R' B
Alg BR U BR'
Alg BR U2 BR'
Alg BR U2' BR'
Alg BR U' BR'
Alg BR2 BL BR2'
Alg BR2 BL2 BR2'
Alg BR2 BL2' BR2'
Alg BR2 BL' BR2'
Alg R2' F R2
Alg R2' F2 R2
Alg R2' F2' R2
Alg R' U R
Alg R' U2 R
Alg R' U' R
Alg BR U BR' U'
Alg BR U2 BR' F
Alg BR U2' BR' L
Alg BR U2' BR' L2
Alg BR U2' BR' L2'
Alg BR U' BL BR'
Alg BR U' BL2 BR'
Alg BR U' BL2' BR'
Alg BR U' BR' BL'
Alg BR2 BL BR2' U2
Alg BR2 BL BR2' BL'
Alg R2' F2' R2 L
Alg R2' F2' R2 L2
Alg R' U F2 R
Alg R' U F2' R
Alg R' U R F
Alg BR U' BR BL' BR2'
Alg BR U F U' BR'
Alg BR U F2 U' BR'
Alg BR U F2' U' BR'
Alg BR U F' U' BR'
Alg BR U2 L U2' BR'
Alg BR U2 L2 U2' BR'
Alg BR U2 L2' U2' BR'
Alg BR U2' BL U2 BR'
Alg BR U2' BL2 U2 BR'
Alg BR U2' BL2' U2 BR'
Alg BR R' F R BR'
Alg BR R' F2 R BR'
Alg BR R' F' R BR'
Alg BR2 U2' F U2 BR2'
Alg BR2 U2' F2 U2 BR2'
Alg BR2 U' L2 U BR2'
Alg BR2 U' L2' U BR2'
Alg BR2 BL L BL' BR2'
Alg BR2 BL L' BL' BR2'
Alg BR2' BL2' L BL2 BR2
Alg BR2' BL2' L2 BL2 BR2
Alg R2 F2 L F2' R2'
Alg R2 F2 L2 F2' R2'
Alg R2 F2 L2' F2' R2'
Alg R2' U2 BL2' U2' R2
Alg R' U2 F U2' R
Alg R' U2 F2 U2' R
Alg R' U' BL' U R
Alg R' BR BL' BR' R
Alg BR U F' U' BR' U'
Alg BR U2 L' BL2 U2' BR'
Alg BR U2' BL U2 BL2' BR'
Alg BR U2' BL2' U2 BR' BL'
Alg BR R' F R BR' U'
Alg BR2 U' L2 U BR2' F2'
Alg BR2 U' L2 U BR2' F'
Alg BR U F2' U L' U2' BR'
Alg BR U F2' L' F U' BR'
Alg F
Alg F2
Alg F2'
Alg F'
Alg F L
Alg F L2
Alg F L2'
Alg F L'
Alg F2 U
Alg F2 U2
Alg F2 U2'
Alg F2 U'
Alg F L2' BL
Alg F L2' BL2
Alg F L2' BL2'
Alg F L' U
Alg F L' U2
Alg F L' U2'
Alg F L' U'
Alg F2 U L
Alg F2 U L2
Alg F2 U L2'
Alg F2 U L'
Alg F L' U BL2
Alg F L' U BL2'
Alg F L' U BL'
Alg F L' U' F
Alg F L' U' F2
Alg F L' U' F2'
Alg F2 L F2'
Alg F2 L2 F2'
Alg F2 L2' F2'
Alg F2 L' F2'
Alg F2' U2 F2
Alg F2' U2' F2
Alg F2' U' F2
Alg F2 L2 F2' L2'
Alg F2 L2 F2' L'
Alg F2 L2' BL F2'
Alg F2 L2' BL2 F2'
Alg F2 L2' BL2' F2'
Alg F2 L' F2' U
Alg F2 L' F2' U2
Alg F2 L' F2' U2'
Alg F2 L' F2' U'
Alg F2 L' BL F2'
Alg F2 L' BL2 F2'
Alg F2 L' BL2' F2'
Alg F2' U L F2
Alg F2' U L2 F2
Alg F2' U L' F2
Alg F2' U2 F2 U2'
Alg F2' U2 F2 U'
Alg F2' U2 F2 L2
Alg F2' U2 F2 L2'
Alg F2' U2 F2 L'
Alg F2' U2 L F2
Alg F' R' F R
Alg F L2 BL L2' F'
Alg F L2 BL2 L2' F'
Alg F2 L2 F2' L2' U2'
Alg F2 L2' BL' L F2'
Alg F2 L' F U2' F2
Alg F2 L' F' U' F'
Alg FL F FL'
Alg FL F2 FL'
Alg FL F2' FL'
Alg FL F' FL'
Alg FL F FL' L
Alg FL F FL' L2
Alg FL F FL' L2'
Alg FL F FL' L'
Alg FL F2 FL' L
Alg FL F2 FL' L2
Alg FL F2 FL' L2'
Alg FL F2 FL' L'
Alg FL F2' FL' U2
Alg FL F2' FL' U2'
Alg FL F2' FL' U'
Alg F2 U2 L' U2' F2'
Alg F2 U2' L' U2 F2'
Alg F2 U' L' U F2'
Alg FL F FL' L2 BL
Alg FL F FL' L2 BL2
Alg FL F FL' L2 BL2'
Alg FL F2 FL' L2' BL
Alg FL F2 FL' L2' BL2
Alg FL F2 FL' L2' BL2'
Alg FL F2 FL' L' U'
Alg FL F FL' F2' L' F2
Alg F2 U F U L U2' F2'
Alg F2' L F2
Alg F2' L2 F2
Alg F2' L2' F2
Alg F2' L' F2
Alg F' U F
Alg F' U2 F
Alg F' U2' F
Alg F' U' F
Alg R U R'
Alg R U2' R'
Alg R U' R'
Alg F R' F' R
Alg F2' L F2 L'
Alg F2' L2' BL F2
Alg F2' L2' BL2 F2
Alg F2' L2' BL2' F2
Alg F' U F U'
Alg F' U F L
Alg F' U F L2
Alg F' U F L2'
Alg F' U F L'
Alg R U2' R' BL2
Alg R U2' R' BL2'
Alg R U2' R' BL'
Alg F2' L' F U' F
Alg F2 L2 BL L2' F2'
Alg F2 L2 BL2 L2' F2'
Alg F2 L2 BL2' L2' F2'
Alg F2 L2 BL' L2' F2'
Alg F2' U BL U' F2
Alg F2' U BL' U' F2
Alg F2' L' BL L F2
Alg F2' L' BL2 L F2
Alg F2' L' BL2' L F2
Alg F2' L' BL' L F2
Alg F' U2 L U2' F
Alg F' U2 L2 U2' F
Alg F' U2 L2' U2' F
Alg F' U2' BL2 U2 F
Alg R U L U' R'
Alg R U L' U' R'
Alg R F' L F R'
Alg R2 U2' L2 U2 R2'
Alg R2 U' BL2 U R2'
Alg R2 U' BL2' U R2'
Alg R2 U' BL' U R2'
Alg R2 BR BL' BR' R2'
Alg F2 L2 BL2' L2' F2' U2
Alg F2' U BL U' F2 L
Alg F2' U BL' U' F2 L2
Alg F2' U BL' U' F2 L2'
Alg F2' L' BL L F2 U2
Alg F2' L' BL L F2 U2'
Alg F2' L' BL' L F2 U
Alg F2' L' BL' L F2 U2
Alg F' U2 L' U BL2' U2 F
Alg F' U2' BL L' BL2' U2 F
Alg U
Alg U2
Alg U2'
Alg U'
Alg U L
Alg U L2
Alg U L2'
Alg U L'
Alg U2 BL
Alg U2 BL2
Alg U2 BL2'
Alg U2 BL'
Alg U L' BL
Alg U L' BL2
Alg U L' BL2'
Alg U L' BL'
Alg U2 BL L
Alg U2 BL L2
Alg U2 BL L2'
Alg U2 BL L'
Alg U F' L F
Alg U L' BL' U
Alg U L' BL' U2
Alg U2 L U2'
Alg U2 L2 U2'
Alg U2 L2' U2'
Alg U2 L' U2'
Alg U2' BL2 U2
Alg U2' BL2' U2
Alg U2' BL' U2
Alg U2 L2 U2' L2'
Alg U2 L2 U2' L'
Alg U2 L' U2' BL
Alg U2 L' U2' BL2
Alg U2 L' U2' BL2'
Alg U2 L' U2' BL'
Alg U2' BL L U2
Alg U2' BL L2 U2
Alg U2' BL L2' U2
Alg U2' BL L' U2
Alg U2' BL2 U2 L2
Alg U2' BL2 U2 L2'
Alg U2' BL2 U2 L'
Alg U2' BL2 U2 BL2'
Alg U2' BL2 U2 BL'
Alg U2' BL2 L U2
Alg U' BR' U BR
Alg U2 L' U BL2' U2
Alg U2 L2' U2' L2 BL2
Alg U2 L2' U2' L2 BL2'
Alg U2 L' U' BL' U'
Alg U2' BL2 U' L U2'
Alg F U F'
Alg F U2 F'
Alg F U2' F'
Alg F U' F'
Alg F U F' L
Alg F U F' L2
Alg F U F' L2'
Alg F U F' L'
Alg F U2 F' L
Alg F U2 F' L2
Alg F U2 F' L2'
Alg F U2 F' L'
Alg F U2' BL2 F'
Alg F U2' BL2' F'
Alg F U2' BL' F'
Alg U2 BL2 L' BL2' U2'
Alg U2 BL' L' BL U2'
Alg U2 BL2' L' BL2 U2'
Alg F U2 F' L' BL'
Alg F U F' U2' L' U2
Alg U2 L U2 L2' U' BL' U2
Alg U2' L U2
Alg U2' L2 U2
Alg U2' L2' U2
Alg U2' L' U2
Alg U' BL U
Alg U' BL2 U
Alg U' BL2' U
Alg U' BL' U
Alg BR BL BR'
Alg BR BL2' BR'
Alg BR BL' BR'
Alg U BR' U' BR
Alg U2' L U2 L'
Alg U' BL U L
Alg U' BL U L2
Alg U' BL U L2'
Alg U' BL U L'
Alg U' BL U BL'
Alg U2' L' U BL' U
Alg U' BL2 L BL2' U
Alg U' BL2 L2 BL2' U
Alg U' BL2 L2' BL2' U
Alg U' BL2 L' BL2' U
Alg BR U' L U BR'
Alg BR U' L2 U BR'
Alg BR U' L2' U BR'
Alg BR U' L' U BR'
Alg BR BL L BL' BR'
Alg BR BL L' BL' BR'
Alg BR2 BL2' L BL2 BR2'
Alg BR2 BL2' L2 BL2 BR2'
Alg U2' L BL2' L' BL2 U2
Alg U2' L2 F' L2' F U2
Alg U2' L' DL L DL' U2
Alg U2' BL2' L BL2 L' U2
Alg U2' BL2' L2 BL2 L2' U2
Alg U' BL2 L BL2' U BL
Alg U' BL2 L2 BL2' U L
Alg U' BL2 L2 BL2' U BL2'
Alg U' BL2 L2 BL2' U BL'
Alg U' BL2 L2 BL2' L2' U
Alg BR BL L' BL' BR' BL2'
Alg BR BL L' BL' BR' BL'
Alg U' BL U BL U' L2' BL2' U
Alg U' BL2 U' L2 U L' BL2' U
Alg L
Alg L2
Alg L2'
Alg L'
Alg L' BL
Alg L' BL2
Alg L' BL2'
Alg L' BL'
Alg U BL U'
Alg U BL2 U'
Alg U BL2' U'
Alg U BL' U'
Alg U BL U' L
Alg U BL U' L2
Alg U BL U' L2'
Alg U BL U' L'
Alg U BL U' BL'
Alg L2' BL L2
Alg L2' BL2 L2
Alg L2' BL2' L2
Alg L2' BL' L2
Alg L2 DL L2' DL'
Alg L2' BL L2 BL2'
Alg L2' BL L2 BL'
Alg F' L2 BL L2' F
Alg F' L2 BL2 L2' F
Alg F' L2 BL2' L2' F
Alg F' L2 BL' L2' F
Alg L2 DL L' DL' L'
Alg L2' U BL2' U' L2
Alg L2' BL L2' BL2' L'
Alg L2' BL L' BL2' L2'
Alg L2' DL L' DL' L2
Alg L' U' L' U L2
Alg U L' DL L DL' U'
Alg F' L2 BL L2' BL2' F
Alg L2 DL' BL DL2 L2' DL'
Alg L2' U BL2' U' BL L2
Alg L2' BL' U BL' U' L2
Alg L2' BL' L2 U' L' U
Alg U' L U
Alg U' L2 U
Alg U' L2' U
Alg U' L' U
Alg U' L2' U BL
Alg U' L2' U BL2
Alg U' L2' U BL2'
Alg U' L2' U BL'
Alg U' L' U BL
Alg U' L' U BL2
Alg U' L' U BL2'
Alg U' L' U BL'
Alg U' L' U L BL L'
Alg U' L' U L2 BL L2'
Alg U' L' U BL U' L2 U
Alg L2 BL L2'
Alg L2 BL2 L2'
Alg L2 BL2' L2'
Alg L2 BL' L2'
Alg L2 BL L2' BL'
Alg L DL L' DL'
Alg DL L DL' L'
Alg L U' L2 U L2
Alg L DL' BL DL L'
Alg L DL' BL2 DL L'
Alg L DL' BL' DL L'
Alg DL L DL' L' BL'
Alg L2 BL L' DL L' DL'
Alg FL' L BL L' FL
Alg FL' L BL2 L' FL
Alg FL' L BL2' L' FL
Alg FL' L BL' L' FL
Alg FL' DL' BL DL FL
Alg FL' DL' BL2 DL FL
Alg FL' DL' BL2' DL FL
Alg FL' DL' BL' DL FL
Alg L2 BL2' U BL2 U' L2'
Alg FL' L BL L' FL BL2'
Alg FL' L BL' L' FL BL
Alg U' F U BL U' F' U
Alg U' F U BL2 U' F' U
Alg U' F U BL2' U' F' U
Alg F' FL2' DL' BL' DL FL2 F
Alg L2' BL2 L2' BL' L2 BL' L2
Alg DL L DL2' BL' DL2 L' DL'
Alg DL2 FL2' DL2 BL' DL2' FL2 DL2'
Alg FL' L U BL2' U' BL L' FL
Alg FL' L2 U' L' U BL2 L' FL
Alg L BL L'
Alg L BL2 L'
Alg L BL2' L'
Alg L BL' L'
Alg DL' BL DL
Alg DL' BL2 DL
Alg DL' BL2' DL
Alg DL' BL' DL
Alg L BL L' BL'
Alg L' DL L DL'
Alg L BL2 L' DL' BL' DL
Alg L U BL2' U' BL2 L'
Alg L BL2' U BL2 U' L'
Alg DL' B' BL2 B BL2' DL
Alg DL' BL2 B' BL2' B DL
Alg U BL2' DL2' BL2 U' BL2' DL2
Alg B' BL2 L2 BL2' B BL2 L2'
Alg L U BL2' U' BL2 L' BL2'
Alg L U BL2' U' BL2 L' BL'
Alg L BL B BL' L' BL B'
Alg L BL2' U BL2 U' L' BL2
Alg L BL' U BL2 U' BL L'
Alg L BL' U BL2' U' BL L'
Alg L BL' U BL' U' BL L'
Alg L2 BL2 L2' BL' L2 BL' L2'
Alg DL' BL B' BL2' B BL' DL
Alg L BL2' L U2 BR' U' BR U' L2'
Alg L BL2' L BL L' BL L BL2' L2'
Alg BL
Alg BL2
Alg BL2'
Alg BL'
Alg U BR BL2 BR' BL2' U'
Alg B BL DL BL' DL' B'
Alg L' BL2' DL' BL2 DL L
Alg BR B BL B' BL' BR'
Alg U BR BL2 BR' BL2' U' BL2
Alg U BL BR BL' BR' U'
Alg U BR BL BR' BL' U'
Alg U' L' BL2' L BL2 U
Alg B' BR' BL2' BR BL2 B
Alg L BL2 U BL2' U' L'
Alg BR B BL2 B' BL2' BR'
Alg U BL2 U' BL' U BL' U'
Alg B BL DL BL DL' BL2' B'
Alg B BL2 DL BL' DL' BL' B'
Alg B' BL' B BL2' B' BL2' B
Alg U BL U' BL2 U BL2 U' BL2
Alg U BR2 B' BR2' U' BR B BR'
Alg BL2 BR B DL' B DL B2' BR'
Alg B BL2' B2' BR B BR' B BL2 B'
Alg U' BL' L' BL L U BL
Alg B' BL2 B BL B' BL2 B
Alg B' BL2' B BL' B' BL2' B
Alg B' BL' BR' BL' BR BL2 B
Alg B' BL2' BR' BL BR BL B
Alg U' BL' L' BL' L BL2 U BL'
Alg L' BL' L' DL L DL' BL L BL
Alg L U BL U' BL' L'
Alg L BL U BL' U' L'
Alg BR' U' BL' U BL BR
Alg L U2 BR' U' BR U' L'
Alg U BL U2' L U L2' BL L BL2'
Alg U' L2 F' L' F2 U' F' U2 L'
Alg U BR' U' L U BR U' L'
Alg U BR B BR' U' BR B' BR'
Alg U' L U BR' U' L' U BR
Alg B DL' B' BR B DL B' BR'
Alg L' DL' B DL L DL' B' DL
Alg BR B BR' U BR B' BR' U'
Alg BR B DL' B' BR' B DL B'
Alg U BR2' U2 L2 U2' BR2 U2 L2' U2
Alg U2' L2 U2' BR2' U2 L2' U2' BR2 U'
Alg U BL' B' BL U' L U2 BL' B BL U2' L'
Alg U BR' U' L F' L2' U BR U' L2 F L'
Alg U BR U' L U BR' U' L'
Alg U' BL2 B BL2' U BL2 B' BL2'
Alg L U BR U' L' U BR' U'
Alg L BL2' B' BL2 L' BL2' B BL2
Alg U BR' U2 L2 U2' BR U2 L2' U2
Alg L' BL2 L2' F' L2 BL2' L2' F L2'
Alg U BL2' U R U' BL2 U' L U2 R' U2' L'
Alg U BR U' L2 F L' U BR' U' L F' L2'
Alg U L' BL2 L' FL' L BL2' L U' L2' FL L2
Alg U BR2' U R' U2' L U2 R U' BR2 U' L'\`)})}var Ks,Vs,Hs=S(()=>{Jn();on();Ks=null;Vs=null});var Kf={};ke(Kf,{sgsDataPyraminx:()=>jf,sgsDataPyraminxFixedOrientation:()=>Zs});function jf(){return h(this,null,function*(){return Ys!=null?Ys:Ys=ip()})}function Zs(){return h(this,null,function*(){return{ordering:(yield jf()).ordering.slice(2)}})}function ip(){return h(this,null,function*(){return Ct(yield zt.pyraminx.def(),\`SubgroupSizes 12 9 12 3 10 3 8 6 2 3 3 3 3

Alg B
Alg B'
Alg y
Alg B y
Alg B' y
Alg y'
Alg B y'
Alg B' y'
Alg BR'
Alg B BR'
Alg B' BR'

Alg L
Alg L'
Alg L F
Alg L' F
Alg F
Alg L F'
Alg L' F'
Alg F'

Alg L B' U L' B
Alg L U L'
Alg L U' L'
Alg L U L' U'
Alg B' U B
Alg B' U' B
Alg B' U' B U
Alg L U' L' R
Alg L U' L' R'
Alg L' R' L
Alg L' R' L R

Alg R
Alg R'

Alg R' U R
Alg R' U' R
Alg R' U R U'
Alg B U B'
Alg B U' B'
Alg R B' R' B
Alg L R L' R U' R
Alg R L R' L'
Alg L' R' U R L

Alg U
Alg U'

Alg R U R' U'
Alg U R U' R'
Alg L' U' L U
Alg U' L' U L
Alg U L R' L' R U'
Alg U' R' L R L' U
Alg L' U' L U' R U' R'

Alg R U' R' U
Alg L' U L U'
Alg U' R U R'
Alg U L' U' L
Alg L R' L' R L' U L U'

Alg L' U L U' L R' L' R

Alg b
Alg b'

Alg l
Alg l'

Alg r
Alg r'

Alg u
Alg u'\`)})}var Ys,Xs=S(()=>{rn();on();Ys=null});var Zf={};ke(Zf,{sgsDataSkewb:()=>Yf,sgsDataSkewbFixedCorner:()=>ta,skewbDefWithoutMOCached:()=>$l});function fp(){return h(this,null,function*(){return er("skewb",{allMoves:!0,addRotations:!0}).writekpuzzle(!0)})}function $l(){return h(this,null,function*(){return $s!=null?$s:$s=fp()})}function Yf(){return h(this,null,function*(){return ea!=null?ea:ea=gp()})}function ta(){return h(this,null,function*(){return{ordering:(yield Yf()).ordering.slice(1)}})}function gp(){return h(this,null,function*(){return Ct(yield $l(),\`SubgroupSizes 24 6 5 12 9 3 4 9 3 3

Alg y
Alg y2
Alg y'
Alg F
Alg F'
Alg y U
Alg y U'
Alg y L
Alg y L'
Alg y F
Alg y F'
Alg y2 U
Alg y2 U'
Alg y2 B
Alg y2 B'
Alg y' U
Alg y' F'
Alg y U L'
Alg y U B
Alg y2 U B
Alg y2 U B'
Alg y2 U' B
Alg y2 U' B'

Alg U
Alg U'
Alg U L
Alg U L'
Alg U' R'

Alg R
Alg R'
Alg R B
Alg R' L'

Alg U B' U
Alg U' L U
Alg U' L' U
Alg U' B U'
Alg R L R'
Alg R B' R
Alg U B L U'
Alg U B' U B'
Alg U B' L' U
Alg U' L B U'
Alg R' B L' R'

Alg L
Alg L'
Alg L B
Alg L B'
Alg L B L
Alg L B L'
Alg L B' L
Alg L B' L'

Alg B
Alg B'

Alg L' B L
Alg L' B' L
Alg R' L' B L R

Alg B L' B L B'
Alg B L' B' L B'
Alg U L U B U' L' U'
Alg R L R' B' R L' R'
Alg U B' R L R' B' U B
Alg U' B U L U' B' U L'
Alg L U' B U L' U' B' U
Alg R B' U R B L U' B

Alg U L U' B' U L' U' B
Alg U' B L U L B' U' L'

Alg U R' U' L B R' B' R
Alg R' U' R U B' U' B L\`)})}var $s,ea,ra=S(()=>{Jn();on();$s=null;ea=null});var ga={};ke(ga,{ftoDef:()=>g1,sgsDataFTO:()=>Wp});function g1(){return h(this,null,function*(){return er("FTO",{allMoves:!0,orientCenters:!0,addRotations:!0}).writekpuzzle(!0)})}function Wp(){return h(this,null,function*(){return fa!=null?fa:fa=Qp()})}function Qp(){return h(this,null,function*(){return Ct(yield g1(),\`SubgroupSizes 24 12 11 12 12 11 10 9 11 8 10 9 7 8 10 10 6 9 8 5 7 6 5 4 4 8 7 3 6 6 2 5 3 4 3

Alg T
Alg B
Alg B T
Alg B'
Alg B' T
Alg U
Alg U T
Alg U'
Alg U' T
Alg B BL
Alg B BL T
Alg B BL'
Alg B BL' T
Alg B' BR
Alg B' BR T
Alg B' BR'
Alg B' BR' T
Alg U R'
Alg U R' T
Alg U' L
Alg U' L T
Alg B BL' D
Alg B BL' D T

Alg R
Alg R'
Alg R D
Alg R D'
Alg R BR
Alg R BR'
Alg R' F
Alg R' L
Alg R' L'
Alg B L B'
Alg U L' U'

Alg B U B'
Alg B U' B'
Alg B R B'
Alg B R' B'
Alg B' U' B
Alg B' U B L
Alg B' U B L'
Alg B' U' B BL'
Alg B U' B' BR
Alg B' R' B F

Alg BR
Alg BR'
Alg BR BL
Alg BR BL'
Alg BR' F
Alg BR' F'
Alg BR' D
Alg B BR B'
Alg U F U'
Alg BR BL L
Alg BR' D BR'

Alg B' BL B
Alg B' BL' B
Alg BR D' BR'
Alg B' BL B D'
Alg B' BL B BL
Alg B' BL B BL'
Alg B' BL L B
Alg B' BL' B F'
Alg B' BL' B L'
Alg B' BL' B BL'
Alg B' BL' L BL' B

Alg R' BR R
Alg R' BR' R
Alg BR BL' D BR
Alg R' BR D R
Alg R' BR D' R
Alg R' BR R BL
Alg B' D' BL D B
Alg BR B D' B' BR'
Alg BR BL' D BR L'
Alg BR BL' D BL BR

Alg U BR U'
Alg U BR' U'
Alg U' R U
Alg U' R' U
Alg U BR B' U'
Alg U BR' U' D
Alg U BR' U' D'
Alg U' R F' U
Alg U' R' U L'

Alg U B U'
Alg U B' U'
Alg U B U' L
Alg U B U' L'
Alg U B' U' BL'
Alg U B U' L F
Alg U B U' L F'
Alg U B' U' BL' D'

Alg B BL' L BL B'
Alg B BL' L' BL B'
Alg U B' D B U'
Alg U B' D' B U'
Alg U R D R' U'
Alg U R D' R' U'
Alg R' F L F' R
Alg R' F L' F' R
Alg B L' B F' D B
Alg U B' D' B U' D

Alg F
Alg F'
Alg F D
Alg F D'
Alg F' L
Alg F' L'
Alg F D' BL

Alg F BL F'
Alg F BL' F'
Alg BR' BL BR
Alg BR' BL' BR
Alg F BR F' BR'
Alg F BL F' BL'
Alg F BL' F' L
Alg F BL' L' F'
Alg F BR' BL BR F'

Alg F' BL F
Alg F' BL' F
Alg U BL U'
Alg U BL' U'
Alg F U' F' U
Alg F' BL F D'
Alg F' BL F BL'
Alg F' BL D F

Alg L
Alg L'
Alg L BL
Alg L BL'
Alg F' D F
Alg L BL D

Alg L' BL L
Alg L' BL' L
Alg L' BL D L
Alg L' BL D' L
Alg L' BL L BL'
Alg L' BL D' L BL
Alg L' BL D' L BL'

Alg L D L'
Alg L D' L'
Alg R' D R
Alg R' D' R
Alg L D L' D'
Alg L R L' R'
Alg L' B' L B
Alg R' D R BL
Alg L BL' L' BL L'

Alg U L' D L U'
Alg U B D B' U'
Alg U L' D' L U'
Alg U B D' B' U'
Alg R' D' BL' D R
Alg U B D' B' U' D
Alg U B' L B L' U'
Alg U B D B' U' BL'
Alg U B D' B' L' D' L U'

Alg F L F'
Alg F L' F'
Alg F L F' D
Alg F L F' D'
Alg F L' F' BL'

Alg L BL' D BL L'
Alg L BL' D' BL L'
Alg F D L D' L' F'
Alg F L D L' D' F'
Alg F L' B' L B F'
Alg F' D' R' D R F
Alg F D L D' L' F' BL'
Alg F' R' B' R' B R' F

Alg B D B'
Alg B D' B'
Alg L' D L
Alg L' D' L
Alg B D B' D'
Alg B' L B L'
Alg B D B' D' BL

Alg D
Alg D'
Alg D BL
Alg D BL'

Alg D BL' D BL D'
Alg D BL' D' BL D'
Alg B D R D' R' B'
Alg B R D R' D' B'
Alg D BL' D BL D' BL
Alg D BL' D BL D' BL'

Alg D BL D BL' D'
Alg D BL D' BL' D'
Alg B' BL' B BR D' BR'
Alg D BL D BL' D' BL
Alg D BL D BL' D' BL'

Alg D' BL D
Alg D' BL' D
Alg D' BL D BL
Alg D' BL D BL'

Alg B D' B' BL B D B'
Alg B D' B' BL' B D B'
Alg D' BL' D BL D' BL D

Alg B R' B' BL B R B'
Alg B R' B' BL' B R B'
Alg L R L' BL' L R' L'

Alg F BL' B' BL F' BL' B
Alg F' R' F BL F' R F
Alg F' R' F BL' F' R F
Alg BR R BR' BL' BR R' BR'
Alg F L' BL U BL' U' L F'
Alg F' U' F D F' U F D'
Alg F BL F' D F BL' F' BL D'

Alg F D F U' F' U D' F'
Alg F D F' BL F BL' D' F'
Alg F U D BL' U' BL D' F'
Alg F U' D F U F' D' F'
Alg F' BR L F BR' F' L' F
Alg U R BL' F BL F' R' U'

Alg BL
Alg BL'

Alg F U BL U' BL' F'
Alg F BL U BL' U' F'
Alg U BL BR BL' BR' U'
Alg BR F BL F' BL' BR'
Alg F U' F' U BL' U BL U'

Alg F U' F' D F U F' D'
Alg B' U' F U B U' F' U
Alg D F U' F' D' F U F'
Alg BR' U BR D' BR' U' BR D
Alg D' BR BL' F BL' F' BL BR' BL D

Alg U BR' U' BR BL' BR BL BR'

Alg F L F' BL D F' D' F BL' L'
Alg F' BR F BR' L BL' BR' BL BR L'
Alg B BR' U R BR' R' BR U' B' BR
Alg U BR' U' BR L' BL BR BL' BR' L

Alg B' F' BR' L R' BL U R BL' BR L' B' F BL' B'
Alg B BL F' B L BR' BL R' U' BL' R L' BR F B

Alg F' D BR F' R F R' BR' F D'
Alg B BL U' L U L' BL' U B' U'
Alg U B U' BL L U' L' U BL' B'

Alg F BL F' BL' B F' BR F BR' B'
Alg B BR F' BR' B' F BL F BL' F'
\`)})}var fa,ca=S(()=>{Jn();on();fa=null});var ha=Symbol("Comlink.proxy"),S1=Symbol("Comlink.endpoint"),v1=Symbol("Comlink.releaseProxy"),li=Symbol("Comlink.thrown"),Aa=e=>typeof e=="object"&&e!==null||typeof e=="function",w1={canHandle:e=>Aa(e)&&e[ha],serialize(e){let{port1:t,port2:r}=new MessageChannel;return Pn(e,t),[r,[r]]},deserialize(e){return e.start(),k1(e)}},U1={canHandle:e=>Aa(e)&&li in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},Ra=new Map([["proxy",w1],["throw",U1]]);function Pn(e,t=self){t.addEventListener("message",function r(n){if(!n||!n.data)return;let{id:o,type:l,path:i}=Object.assign({path:[]},n.data),s=(n.data.argumentList||[]).map(dr),u;try{let a=i.slice(0,-1).reduce((g,c)=>g[c],e),f=i.reduce((g,c)=>g[c],e);switch(l){case"GET":u=f;break;case"SET":a[i.slice(-1)[0]]=dr(n.data.value),u=!0;break;case"APPLY":u=f.apply(a,s);break;case"CONSTRUCT":{let g=new f(...s);u=P1(g)}break;case"ENDPOINT":{let{port1:g,port2:c}=new MessageChannel;Pn(e,c),u=C1(g,[g])}break;case"RELEASE":u=void 0;break;default:return}}catch(a){u={value:a,[li]:0}}Promise.resolve(u).catch(a=>({value:a,[li]:0})).then(a=>{let[f,g]=si(a);t.postMessage(Object.assign(Object.assign({},f),{id:o}),g),l==="RELEASE"&&(t.removeEventListener("message",r),Da(t))})}),t.start&&t.start()}function E1(e){return e.constructor.name==="MessagePort"}function Da(e){E1(e)&&e.close()}function k1(e,t){return ii(e,[],t)}function ko(e){if(e)throw new Error("Proxy has been released and is not useable")}function ii(e,t=[],r=function(){}){let n=!1,o=new Proxy(r,{get(l,i){if(ko(n),i===v1)return()=>Tr(e,{type:"RELEASE",path:t.map(s=>s.toString())}).then(()=>{Da(e),n=!0});if(i==="then"){if(t.length===0)return{then:()=>o};let s=Tr(e,{type:"GET",path:t.map(u=>u.toString())}).then(dr);return s.then.bind(s)}return ii(e,[...t,i])},set(l,i,s){ko(n);let[u,a]=si(s);return Tr(e,{type:"SET",path:[...t,i].map(f=>f.toString()),value:u},a).then(dr)},apply(l,i,s){ko(n);let u=t[t.length-1];if(u===S1)return Tr(e,{type:"ENDPOINT"}).then(dr);if(u==="bind")return ii(e,t.slice(0,-1));let[a,f]=Fa(s);return Tr(e,{type:"APPLY",path:t.map(g=>g.toString()),argumentList:a},f).then(dr)},construct(l,i){ko(n);let[s,u]=Fa(i);return Tr(e,{type:"CONSTRUCT",path:t.map(a=>a.toString()),argumentList:s},u).then(dr)}});return o}function z1(e){return Array.prototype.concat.apply([],e)}function Fa(e){let t=e.map(si);return[t.map(r=>r[0]),z1(t.map(r=>r[1]))]}var ya=new WeakMap;function C1(e,t){return ya.set(e,t),e}function P1(e){return Object.assign(e,{[ha]:!0})}function si(e){for(let[t,r]of Ra)if(r.canHandle(e)){let[n,o]=r.serialize(e);return[{type:"HANDLER",name:t,value:n},o]}return[{type:"RAW",value:e},ya.get(e)||[]]}function dr(e){switch(e.type){case"HANDLER":return Ra.get(e.name).deserialize(e.value);case"RAW":return e.value}}function Tr(e,t,r){return new Promise(n=>{let o=M1();e.addEventListener("message",function l(i){!i.data||!i.data.id||i.data.id!==o||(e.removeEventListener("message",l),n(i.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),r)})}function M1(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var N1=typeof globalThis.Worker=="undefined"&&typeof globalThis.WorkerNavigator=="undefined";function va(e){N1?(()=>h(this,null,function*(){let{port:t}=yield Promise.resolve().then(()=>(Sa(),xa));Pn(e,yield t())}))():Pn(e)}At();rn();var v2=!1;function w2(e){v2=e}function $e(){if(!v2)throw new Error("Must be called from inside a worker, to avoid impact on page performance. Try importing from the top level of \`cubing/solve\`?")}var Ki=null;function U2(){return h(this,null,function*(){var e;return((e=globalThis==null?void 0:globalThis.crypto)==null?void 0:e.getRandomValues)?crypto.getRandomValues.bind(crypto):(yield Ki!=null?Ki:Ki=import("crypto")).webcrypto.getRandomValues})}var E2=9007199254740992,Eg=2097152,kg=2048;function zg(e){let t=new Uint32Array(2);e(t);let r=t[0],n=t[1];return Math.floor(r*Eg)+Math.floor(n/kg)}function Cg(e){if(typeof e!="number"||e<0||Math.floor(e)!==e)throw new Error("randomInt.below() not called with a positive integer value.");if(e>E2)throw new Error(\`Called randomInt.below() with max == \${e}, which is larger than Javascript can handle with integer precision.\`)}function st(){return h(this,null,function*(){let e=yield U2(),t=r=>{Cg(r);let n=zg(e),o=Math.floor(E2/r)*r;return n<o?n%r:t(r)};return t})}function Wt(){return h(this,null,function*(){let e=yield st();return t=>t[e(t.length)]})}var Pg=st();function k2(e){return h(this,null,function*(){for(let t=1;t<e.length;t++){let r=(yield Pg)(t);[e[t],e[r]]=[e[r],e[t]]}})}he();At();he();var z2=class extends qr{constructor(t){super();this.metric=t}traverseAlg(t){let r=0;for(let n of t.units())r+=this.traverseUnit(n);return r}traverseGrouping(t){let r=t.alg;return this.traverseAlg(r)*Math.abs(t.amount)}traverseMove(t){return this.metric(t)}traverseCommutator(t){return 2*(this.traverseAlg(t.A)+this.traverseAlg(t.B))}traverseConjugate(t){return 2*this.traverseAlg(t.A)+this.traverseAlg(t.B)}traversePause(t){return 0}traverseNewline(t){return 0}traverseLineComment(t){return 0}};function Mg(e){return"A"<=e&&e<="Z"}function Ig(e){let t=e.family;return Mg(t[0])&&t[t.length-1]==="v"||t==="x"||t==="y"||t==="z"||t==="T"?0:1}var C2=new z2(Ig),Vi=C2.traverseAlg.bind(C2);he();var P2=class extends qr{traverseAlg(t){let r=0;for(let n of t.units())r+=this.traverseUnit(n);return r}traverseGrouping(t){return this.traverseAlg(t.alg)*Math.abs(t.amount)}traverseMove(t){return 1}traverseCommutator(t){return 2*(this.traverseAlg(t.A)+this.traverseAlg(t.B))}traverseConjugate(t){return 2*this.traverseAlg(t.A)+this.traverseAlg(t.B)}traversePause(t){return 1}traverseNewline(t){return 0}traverseLineComment(t){return 0}},M2=new P2,Gg=M2.traverseAlg.bind(M2);var Tg=2,Ng=!0,_g=!1;function Og(e,t){let r=[],n=new Je(e);return t.forEach(function(o){let l=new d(o);if(l.amount!==1)throw new Error("SGS cannot handle def moves with an amount other than 1 yet.");n.reset();for(let i=1;n.applyMove(l),!Fi(e,n.state,ht(e));i++)r.push({move:l.modified({amount:i}),transformation:n.state})}),r}var Ft=class{constructor(t,r,n){this.def=t;this.sgs=r;this.searchMoves=Og(this.def,n!=null?n:Object.keys(this.def.moves))}solve(o){return h(this,arguments,function*(t,r=Tg,n){let l=null,i=1e6,s=(u,a,f)=>{if(a===0){let g=this.sgsPhaseSolve(u,i);if(!g)return;let c=f.concat(g).simplify({collapseMoves:!0,quantumMoveOrder:n}),m=Vi(c);(l===null||m<i)&&(_g&&(console.log(\`New best (\${m} moves): \${c.toString()}\`),console.log(\`Tremble moves are: \${f.toString()}\`)),l=c,i=m);return}for(let g of this.searchMoves)s(it(this.def,u,g.transformation),a-1,f.concat([g.move]))};for(let u=0;u<=r;u++)s(t,u,new z);if(l===null)throw new Error("SGS search failed.");return l})}sgsPhaseSolve(t,r){let n=new ut,o=t;for(let l of this.sgs.ordering){let i=l.pieceOrdering,s="",u=_t(this.def,o);for(let f=0;f<i.length;f++){let g=i[f],c=g.orbitName,m=g.permutationIdx;s+=\` \${u[c].permutation[m]} \${u[c].orientation[m]}\`}let a=l.lookup[s];if(!a)throw new Error("Missing algorithm in sgs or esgs?");if(n.experimentalPushAlg(a.alg),n.experimentalNumUnits()>=r)return null;if(o=it(this.def,o,a.transformation),Ng)for(let f=0;f<i.length;f++){let g=i[f],c=g.orbitName,m=g.permutationIdx;if(o[c].permutation[m]!==m||o[c].orientation[m]!==0)throw new Error("bad SGS :-(")}}return n.toAlg()}};function nn(e,t){return h(this,null,function*(){let r=yield Wt(),n=ht(e);for(let o of t.ordering){let l=r(Object.values(o.lookup));n=it(e,n,l.transformation)}return n})}var Qg=3,N2=null;function _2(){return h(this,null,function*(){return N2||(N2=(()=>h(this,null,function*(){let e=yield(yield Promise.resolve().then(()=>(T2(),G2))).cachedData222();return new Ft(yield zt["2x2x2"].def(),e,"URFLBD".split(""))}))())})}function O2(){return h(this,null,function*(){yield _2()})}function Yi(e){return h(this,null,function*(){return $e(),yield(yield _2()).solve(e,Qg,()=>4)})}function qg(e,t,r,n){return h(this,null,function*(){let o=yield st();yield k2(r[t].permutation);let l=e.orbits[t],i=r[t].orientation,s=0;for(let u=0;u<l.numPieces;u++){let a=o(l.orientations);i[u]=a,s+=a}n&&"orientationSum"in n&&(i[0]=((i[0]+n.orientationSum-s)%l.orientations+l.orientations)%l.orientations)})}function jg(){return h(this,null,function*(){let e=yield zt["2x2x2"].def(),t=Object.assign({},e),r=new Je(t),n=JSON.parse(JSON.stringify(r.state));return yield qg(t,"CORNERS",n,{orientationSum:0}),n})}function W2(){return h(this,null,function*(){return yield Yi(yield jg())})}he();At();rn();he();function ln(e,t){return h(this,null,function*(){let r=new ut;r.experimentalPushAlg(e);for(let n of t){let o=(yield Wt())(n);o!==null&&r.push(d.fromString(o))}return r.toAlg()})}var Kg="UF UR UB UL DF DR DB DL FR FL BR BL".split(" "),Vg="UFR URB UBL ULF DRF DFL DLB DBR".split(" "),Hg="U L F R B D".split(" "),Yg=[[1,2,0],[0,2,0],[1,1,0],[0,3,0],[2,0,0],[0,1,0],[1,3,0],[0,0,0],[1,0,0],[1,0,2],[0,1,1],[1,1,1],[0,8,1],[2,3,0],[0,10,1],[1,4,1],[0,5,1],[1,7,2],[1,3,2],[0,0,1],[1,0,1],[0,9,0],[2,2,0],[0,8,0],[1,5,1],[0,4,1],[1,4,2],[1,5,0],[0,4,0],[1,4,0],[0,7,0],[2,5,0],[0,5,0],[1,6,0],[0,6,0],[1,7,0],[1,2,2],[0,3,1],[1,3,1],[0,11,1],[2,1,0],[0,9,1],[1,6,1],[0,7,1],[1,5,2],[1,1,2],[0,2,1],[1,2,1],[0,10,0],[2,4,0],[0,11,0],[1,7,1],[0,6,1],[1,6,2]];function Q2(e,t){return e.slice(t)+e.slice(0,t)}function Zg(e){let t=[[],[]];for(let r=0;r<6;r++)if(e.CENTERS.permutation[r]!==r)throw new Error("non-oriented puzzles are not supported");for(let r=0;r<12;r++)t[0].push(Q2(Kg[e.EDGES.permutation[r]],e.EDGES.orientation[r]));for(let r=0;r<8;r++)t[1].push(Q2(Vg[e.CORNERS.permutation[r]],e.CORNERS.orientation[r]));return t.push(Hg),t}function q2(e){let t=Zg(e);return Yg.map(([r,n,o])=>t[r][n][o]).join("")}he();At();function j2(e,t,r){for(let n in e.orbits)if(!On(e,n,t,r,{ignoreOrientation:n==="CENTERS"}))return!1;return!0}function K2(e,t){let r=new Je(e);if(j2(e,r.state,t))return!1;for(let n of"ULFRBD")for(let o=1;o<4;o++)if(r.reset(),r.applyMove(new d(n,o)),j2(e,r.state,t))return!1;return!0}var V2=[["R U'","R2 B","D2 B2","D' L B'","R' U'","B","D B2","R' B","L' U","L2 B'","B2","D L B'","L U","B'","U'","R B","D' B2","L B'","U2","U L' B'","","U' L' B'","U","L' B'"],["F2 L2","F' L'","R' F L2","D' L2","F L2","F2 L'","R' F' L'","R2 F L2","R2 F2 L'","L2","F L'","D' L","D2 L2","R2 F' L'","D L","","L2 F L'","L F' L2","L F L'","F' L2","L'","D L2","D F L'","L"],["R B U2 B'","R2 B U' B'","F2 B U B'","F B2 L' B2","B2 L B2","B U' B'","R2 B U2 B'","R' B U' B'","B2 L' B2","F B U B'","B2 U' B2","B' L B","L F' B D' B'","B' U' B2 D B'","B U2 B'","R B U' B'","B2 L2 B2","D' B' L B","B U B'","F' B2 L' B2","","B2 L' B' U' B'"],["U F2 L2 U'","F' U L' U'","F2 U L' U'","U F L2 U'","U2 B2 U2","R' U' B U","D2 U L U'","D U2 B' U2","U L2 U'","F U L' U'","D U L U'","U2 B' U2","","U2 B' U' L' U'","U2 L' U2","U' B U","U L U'","D' U2 B' U2","U L' U'","U2 B U2"],["R' D' F2","F'","F2","D R F'","R D' F2","R2 F'","D' F2","R F'","F2 R' D' F2","F","D2 F2","D' R F'","R2 D' F2","R' F'","D F2","D2 R F'","","F R' D' F2"],["R' D2 F' D F","R F2 R2 F2","R2 F' D2 F","F' R2 D2 F","L D' L'","D F' D2 F","F2 R2 F2","R F' D2 F","F' R2 D' F","F' R' D2 F","F2 R' F2","L D L'","F' R D' F","F2 R F2","F' D2 F","","L D2 R D' L'","F' D2 F' R F2","D2 R2 F2 R2 F2","D F' D' F","F' D F"],["U F2 U'","R U F' U'","D R U F2 U'","U F U'","R2 U F2 U'","R' U F' U'","R U F2 U'","R2 U F' U'","","U L D L' F U'","F2 D' R D F2","D2 U F U'","R' U F2 U'","U F' U'","F2 D2 R D2 F2","D U F U'"],["R2","R' B' D B","D R'","F' R2 F","","R B' D B","R'","B' D B","D' R'","D2 F' R2 F","R","R2 B' D B","D2 R'","B' D' B"],["R2 D' R2","F' R' F R","R D' R2 D R'","D2 R2 D2 R2","R' D' F' R F","U F D F' U'","","R2 D2 B R' B' R'","R' F D' F2 R F","R2 D R2","F2 U F U' F","R' D F' R F","D R2 D2 R2","U F D' F' U'","D R' D2 F' R F","R2 D2 R2","U F D2 F' U'","R' D2 F' R F"],["B R B'","F D F' B R2 B'","D B R2 B'","D2 B R' B'","B R2 B'","D B R' B'","D' B R2 B'","B R' B'","","B R2 B' D B R' B'","D2 B R2 B'","D' B R' B'"],["","R' D R F D2 F'","R' D R","D F D' F'","R F' R' F","F D' F'","R' D' R","F D2 F'","R' D2 R","F D F'"],["","F2 D2 R F' R' D2 F' D2 F'","F2 D2 F' D' F D' F' D2 F'","F2 D F2 D F2 D2 F2","D2 F L D2 L' D2 F'","D F D2 L D2 L' F'","R' D B' D2 B D' R","R' D2 B' D2 B R","F D2 F' D F D F'","F D' L D2 L' D F'","B D' F D B' D' F'","F D2 L D2 L' F'","F D' L D L' D F'","F L D2 L' D2 F'","R' B' D2 B D2 R"],["D'","F L D L' D' F'","D2","L B D B' D' L'","D","B' L' D' L D B","","D F L D L' D' F'"],["F' D2 F D F' D F","F' D' R' D R F","F' R' D' R D F","B D R D' R' B'","","D B' D' L' D L B"],["D F D F' D F D2 F'","F' U2 B' R' B U2 F' L F' L' F'","","D2 L D L2 F L F2 D F"],["L B' L' F L B L' F'","F2 U F' D2 F U' F' D2 F'","D' F' D B D' F D B'","F L2 F R2 F' L2 F R2 F2","D B D' F' D B' D' F","R F L F' R' F L' F'","","D2 B L' U2 L B' D2 B L' U2 L B'","D2 F R' U2 R F' D2 F R' U2 R F'","R F L' F' R' F L F'","D F D' B' D F' D' B","L2 F2 L' B2 L F2 L' B2 L'"],["L B R' B' L' B R B'","R' B R F' R' B' R F","L D2 L U L' D2 L U' L2","","D2 B' D2 F D' L2 F L2 F' D2 B D' F'","D2 F' R' F R2 B' D2 B D2 R' F D2 F'","L B L' F L B' L' F'","F' D2 F' U' F D2 F' U F2","D' B' D F D' B D F'"],["","D2 F' L U2 L' F D2 F' L U2 L' F","D2 B' R U2 R' B D2 B' R U2 R' B"]];var se={3:1},je=4194303,tr=1048575,Xg=524288,Te=65535,Ae={11:1,3:1},ve={17:1,3:1},Zi=14540032,ro=286331153,le={10:1,3:1},V,sl={};function H2(){}function Jg(e){function t(){}return t.prototype=e||{},new t}function $g(e){return e instanceof Array?e[0]:null}function no(e,t,r){var n=sl,o=ec,l=$g,i=n[e],s=l(i);i&&!s?V=i:(V=n[e]=t?o(t):{},V.castableTypeMap$=r,V.constructor=V,!t&&(V.typeMarker$=H2));for(var u=3;u<arguments.length;++u)arguments[u].prototype=V;s&&(V.___clazz$=s)}function ec(e){var t=sl;return Jg(t[e])}function tc(){}no(1,null,{},tc);function al(e){return e<<24>>24}function Xi(){this.typeName=null,this.simpleName=null,this.packageName=null,this.compoundName=null,this.canonicalName=null,this.typeId=null,this.arrayLiterals=null}function Ji(e,t){var r;return r=new Xi,r.packageName=e,r.compoundName=t,r}function rr(e,t,r){var n;return n=Ji(e,t),oc(r,n),n}function rc(e,t){var r;return r=Ji(e,t),r.modifiers=2,r}function ul(e,t){var r;return r=Ji("",e),r.typeId=t,r.modifiers=1,r}function Y2(e,t){var r=e.arrayLiterals=e.arrayLiterals||[];return r[t]||(r[t]=e.createClassLiteralForArray(t))}function nc(e){if(e.isPrimitive())return null;var t=e.typeId,r=sl[t];return r}function oc(e,t){if(!!e){t.typeId=e;var r=nc(t);if(!r){sl[e]=[t];return}r.___clazz$=t}}no(79,1,{},Xi);V.createClassLiteralForArray=function(t){var r;return r=new Xi,r.modifiers=4,t>1?r.componentType=Y2(this,t-1):r.componentType=this,r};V.isPrimitive=function(){return(this.modifiers&1)!=0};function J(e,t){return Y2(e,t)}function Z(e,t,r,n,o,l){var i;return i=X2(o,n),$(J(e,l),t,r,o,i),i}function Ke(e,t,r,n,o,l){return Z2(e,t,r,n,o,0,l)}function Z2(e,t,r,n,o,l,i){var s,u,a,f,g;if(f=o[l],a=l==i-1,s=a?n:0,g=X2(s,f),$(J(e,i-l),t[l],r[l],s,g),!a)for(++l,u=0;u<f;++u)g[u]=Z2(e,t,r,n,o,l,i);return g}function $(e,t,r,n,o){return o.___clazz$=e,o.castableTypeMap$=t,o.typeMarker$=H2,o.__elementTypeId$=r,o.__elementTypeCategory$=n,o}function X2(e,t){var r=new Array(t),n;switch(e){case 6:n={l:0,m:0,h:0};break;case 7:n=0;break;case 8:n=!1;break;default:return r}for(var o=0;o<t;++o)r[o]=n;return r}function J2(e){var t,r,n;return t=e&je,r=e>>22&je,n=e<0?tr:0,lc(t,r,n)}function lc(e,t,r){return{l:e,m:t,h:r}}function ic(e,t){var r,n,o;return r=e.l+t.l,n=e.m+t.m+(r>>22),o=e.h+t.h+(n>>22),{l:r&je,m:n&je,h:o&tr}}function Pt(e,t){return{l:e.l&t.l,m:e.m&t.m,h:e.h&t.h}}function $i(e){var t,r;return e>-129&&e<128?(t=e+128,gl==null&&(gl=Z(Tc,se,293,256,0,1)),r=gl[t],!r&&(r=gl[t]=J2(e)),r):J2(e)}function $2(e,t){var r,n;return r=e.h>>19,n=t.h>>19,r==0?n!=0||e.h>t.h||e.h==t.h&&e.m>t.m||e.h==t.h&&e.m==t.m&&e.l>=t.l:!(n==0||e.h<t.h||e.h==t.h&&e.m<t.m||e.h==t.h&&e.m==t.m&&e.l<t.l)}function es(e,t){return e.l!=t.l||e.m!=t.m||e.h!=t.h}function ts(e,t){return{l:e.l|t.l,m:e.m|t.m,h:e.h|t.h}}function fl(e,t){var r,n,o;return t&=63,t<22?(r=e.l<<t,n=e.m<<t|e.l>>22-t,o=e.h<<t|e.m>>22-t):t<44?(r=0,n=e.l<<t-22,o=e.m<<t-22|e.l>>44-t):(r=0,n=0,o=e.l<<t-44),{l:r&je,m:n&je,h:o&tr}}function br(e,t){var r,n,o,l,i;return t&=63,r=e.h,n=(r&Xg)!=0,n&&(r|=-1048576),t<22?(i=r>>t,l=e.m>>t|r<<22-t,o=e.l>>t|e.m<<22-t):t<44?(i=n?tr:0,l=r>>t-22,o=e.m>>t-22|r<<44-t):(i=n?tr:0,l=n?je:0,o=r>>t-44),{l:o&je,m:l&je,h:i&tr}}function eu(e,t){var r,n,o;return r=e.l-t.l,n=e.m-t.m+(r>>22),o=e.h-t.h+(n>>22),{l:r&je,m:n&je,h:o&tr}}function xr(e){return e.l|e.m<<22}var gl;function sc(e){this.string=e}function nr(e,t){return e>t?e:t}function rs(e,t){return e<t?e:t}function ac(e,t){return e.indexOf(t)}function uc(e){return fc(e,0,e.length)}function fc(e,t,r){for(var n="",o=t;o<r;){var l=Math.min(o+1e4,r);n+=String.fromCharCode.apply(null,e.slice(o,l)),o=l}return n}function gc(e){return String.fromCharCode(e&Te)}var cc=rr("java.lang","String",2);function tu(e){return e.string+=" ",e}function ru(e,t){return e.string+=t,e}function mc(){sc.call(this,"")}function cl(e,t){var r;if(e===t)return!0;if(e.length!=t.length)return!1;for(r=0;r<e.length;++r)if(e[r]!=t[r])return!1;return!0}var nu=!1;function Sr(){nu||(nu=!0,lr=Ke(Re,[se,Ae],[11,0],7,[495,18],2),mn=Ke(Re,[se,Ae],[11,0],7,[324,18],2),fn=Ke(Re,[se,Ae],[11,0],7,[336,18],2),or=Ke(Re,[se,Ae],[11,0],7,[495,8],2),dl=Z(we,ve,0,20048,7,1),pl=Z(we,ve,0,20791,7,1),cn=Z(we,ve,0,82945,7,1),sn=Ke(Re,[se,Ae],[11,0],7,[2768,10],2),un=Ke(Re,[se,Ae],[11,0],7,[2768,10],2),gn=Ke(Re,[se,Ae],[11,0],7,[24,10],2),io=Ke(Re,[se,Ae],[11,0],7,[24,16],2),vr=Ke(Re,[se,Ae],[11,0],7,[140,16],2),ml=Z(we,ve,0,8305,7,1),an=Z(we,ve,0,48441,7,1))}function pc(e,t,r){return e.slice_0=lr[t.slice_0][r],e.flip=fn[t.flip][(X(),Ur)[r<<3|t.fsym]],e.fsym=e.flip&7^t.fsym,e.flip>>=3,e.twist=mn[t.twist][Ur[r<<3|t.tsym]],e.tsym=e.twist&7^t.tsym,e.twist>>=3,e.prun=nr(nr(et(dl,e.twist*495+or[e.slice_0][e.tsym]),et(pl,e.flip*495+or[e.slice_0][e.fsym])),et(cn,e.twist<<11|ar[e.flip<<3|e.fsym^e.tsym])),e.prun}function dc(e,t,r){return r=(X(),uo)[3][r],e.flipc=fn[t.flipc>>3][Ur[r<<3|t.flipc&7]]^t.flipc&7,e.twistc=mn[t.twistc>>3][Ur[r<<3|t.twistc&7]]^t.twistc&7,et(cn,e.twistc>>3<<11|ar[e.flipc^e.twistc&7])}function ou(e,t,r){var n;return e.twist=(X(),fo)[Rl(t)],e.flip=wr[Al(t)],e.tsym=e.twist&7,e.twist=e.twist>>3,e.prun=et(cn,e.twist<<11|ar[e.flip^e.tsym]),e.prun>r||(e.fsym=e.flip&7,e.flip=e.flip>>3,e.slice_0=494-Ln(t.ea,8,!0),e.prun=nr(e.prun,nr(et(dl,e.twist*495+or[e.slice_0][e.tsym]),et(pl,e.flip*495+or[e.slice_0][e.fsym]))),e.prun>r)?!1:(n=new fe,so(t,1,n),ao(t,1,n),e.twistc=fo[Rl(n)],e.flipc=wr[Al(n)],e.prun=nr(e.prun,et(cn,e.twistc>>3<<11|ar[e.flipc^e.twistc&7])),e.prun<=r)}function oo(){Sr()}function et(e,t){return Sr(),e[t>>3]>>(t<<2)&15}function lu(e){Sr(),!(Ll==2||Ll==1&&!e)&&(Ll==0&&(wc(),Lc(),Ac(),Dc(),hc(),X(),as(2048,us,wr,cu=Z(Re,Ae,0,336,7,1),0),as(2187,ms,fo,cs=Z(Re,Ae,0,324,7,1),1),Rc(),Fc(),yc()),lo(ml,gn,io,sn,(X(),gs),584244,e),lo(an,ns,vr,un,gs,514084,e),lo(dl,lr,or,mn,cs,431619,e),lo(pl,lr,or,fn,cu,431619,e),lo(cn,null,null,mn,cs,103939,e),Ll=e?2:1)}function Lc(){var e,t,r,n;for(e=new fe,t=new fe,r=0;r<2768;r++)for(xc(e,(X(),pn)[r]),n=0;n<10;n++)ir(e,ge[(Oe(),Bt)[n]],t),sn[r][n]=yl(qt[rt(t.ca,8,!1)])&Te}function hc(){var e,t,r,n,o;for(e=new fe,t=new fe,ns=Ke(Re,[se,Ae],[11,0],7,[140,10],2),r=0;r<140;r++){for(Fu(e.ca,r%70,0,!1),o=0;o<10;o++)ir(e,(X(),ge)[(Oe(),Bt)[o]],t),ns[r][o]=Ln(t.ca,0,!1)+70*(165>>o&1^~~(r/70))&Te;for(n=0;n<16;n++)so(e,(X(),tt)[0][n],t),vr[r][n]=Ln(t.ca,0,!1)+70*~~(r/70)&Te}}function Ac(){var e,t,r,n;for(e=new fe,t=new fe,r=0;r<2768;r++)for(uu(e,(X(),pn)[r]),n=0;n<10;n++)ct(e,ge[(Oe(),Bt)[n]],t),un[r][n]=qt[rt(t.ea,8,!0)]}function Rc(){var e,t,r,n;for(e=new fe,t=new fe,r=0;r<336;r++)for(is(e,(X(),us)[r]),n=0;n<18;n++)ct(e,ge[n],t),fn[r][n]=wr[Al(t)]}function Dc(){var e,t,r,n,o;for(e=new fe,t=new fe,r=0;r<24;r++){for(Er(e.ea,r,12,!0),o=0;o<10;o++)ct(e,(X(),ge)[(Oe(),Bt)[o]],t),gn[r][o]=rt(t.ea,12,!0)%24&Te;for(n=0;n<16;n++)ao(e,(X(),tt)[0][n],t),io[r][n]=rt(t.ea,12,!0)%24&Te}}function lo(e,t,r,n,o,l,i){var s,u,a,f,g,c,m,L,p,F,y,x,B,P,k,K,te,N,re,b,C,I,w,U,M,q,Y,ce,pe,Fe,ye,wt,Ee,He,xe,D;if(B=l&15,y=(l>>4&1)==1?Zi:0,a=(l>>5&1)==1,s=l>>8&15,f=l>>12&15,g=l>>16&15,F=i?f:g,x=(1<<B)-1,u=t==null,L=u?2048:t.length,p=L*n.length,m=a?10:18,c=m==10?66:599186,k=(e[p>>3]>>(p<<2)&15)-1,k==-1){for(N=0;N<~~(p/8)+1;N++)e[N]=ro;e[0]^=1,k=0}for(;k<F;){for(M=(k+1)*ro^-1,re=0;re<e.length;re++)xe=e[re]^M,xe&=xe>>1,e[re]+=xe&xe>>2&ro;for(I=k>s,Fe=I?k+2:k,pe=Fe*ro,P=I?k:k+2,++k,D=k^k+1,He=0,N=0;N<p;++N,He>>=4){if((N&7)==0&&(He=e[N>>3],((He^pe)-ro&~(He^pe)&-2004318072)==0)){N+=7;continue}if((He&15)==Fe)for(Y=N%L,ye=~~(N/L),K=0,te=0,u&&(K=(X(),wr)[Y],te=K&7,K>>=3),U=0;U<m;U++){if(Ee=n[ye][U],u?ce=(X(),ar)[fn[K][Ur[U<<3|te]]^te^Ee&x]:ce=r[t[Y][U]][Ee&x],Ee>>=B,b=Ee*L+ce,q=e[b>>3]>>(b<<2)&15,q!=P){q<k-1&&(U+=c>>U&3);continue}if(I){e[N>>3]^=D<<(N<<2);break}for(e[b>>3]^=D<<(b<<2),w=1,wt=o[Ee];(wt>>=1)!=0;w++)(wt&1)==1&&(C=Ee*L,u?C+=(X(),ar)[wr[ce]^w]:C+=r[ce][w^y>>(w<<1)&3],(e[C>>3]>>(C<<2)&15)==P&&(e[C>>3]^=D<<(C<<2)))}}}}function Fc(){var e,t,r,n;for(e=new fe,t=new fe,r=0;r<324;r++)for(ss(e,(X(),ms)[r]),n=0;n<18;n++)ir(e,ge[n],t),mn[r][n]=fo[Rl(t)]}function yc(){var e,t,r,n,o,l,i,s;for(e=new fe,t=new fe,n=0;n<495;n++){for(Fu(e.ea,494-n,8,!0),l=0;l<18;l+=3)ct(e,(X(),ge)[l],t),lr[n][l]=494-Ln(t.ea,8,!0)&Te;for(o=0;o<16;o+=2)ao(e,(X(),tt)[0][o],t),or[n][o>>1]=494-Ln(t.ea,8,!0)&Te}for(r=0;r<495;r++)for(o=0;o<18;o+=3)for(s=lr[r][o],i=1;i<3;i++)s=lr[s][o],lr[r][o+i]=s&Te}no(31,1,{31:1},oo);V.flip=0;V.flipc=0;V.fsym=0;V.prun=0;V.slice_0=0;V.tsym=0;V.twist=0;V.twistc=0;var vr,ns,sn,an,un,fn,ml,io,gn,cn,mn,or,pl,lr,dl,Ll=0,hl=rr("org.cubing.min2phase.client","CoordCube",31),iu=!1;function X(){iu||(iu=!0,Qt=Z(go,se,7,16,0,1),ge=Z(go,se,7,18,0,1),bl=Z(Nc,se,0,18,6,1),mu=Z(we,ve,0,48,7,1),jt=Ke(we,[se,ve],[17,0],7,[16,16],2),tt=Ke(we,[se,ve],[17,0],7,[16,16],2),uo=Ke(we,[se,ve],[17,0],7,[16,18],2),Ur=Z(we,ve,0,144,7,1),ur=Ke(we,[se,ve],[17,0],7,[16,18],2),us=Z(Re,Ae,0,336,7,1),ms=Z(Re,Ae,0,324,7,1),pn=Z(Re,Ae,0,2768,7,1),dn=Z(ee,le,0,2768,7,1),fs=Z(Re,Ae,0,2768,7,1),Bl=Z(ee,le,0,24,7,1),wr=Z(Re,Ae,0,2048,7,1),fo=Z(Re,Ae,0,2187,7,1),qt=Z(Re,Ae,0,40320,7,1),ar=Z(Re,Ae,0,2688,7,1),ps=new yt(2531,1373,67026819,1367),ds=new yt(2089,1906,322752913,2040),xl=$(J(ee,2),se,10,0,[$(J(ee,1),le,0,7,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),$(J(ee,1),le,0,7,[6,7,8,0,1,2,3,4,5,15,16,17,9,10,11,12,13,14]),$(J(ee,1),le,0,7,[3,4,5,6,7,8,0,1,2,12,13,14,15,16,17,9,10,11]),$(J(ee,1),le,0,7,[2,1,0,5,4,3,8,7,6,11,10,9,14,13,12,17,16,15]),$(J(ee,1),le,0,7,[8,7,6,2,1,0,5,4,3,17,16,15,11,10,9,14,13,12]),$(J(ee,1),le,0,7,[5,4,3,8,7,6,2,1,0,14,13,12,17,16,15,11,10,9])]),vc(),Uc())}function os(e){e.ca=$(J(ee,1),le,0,7,[0,1,2,3,4,5,6,7]),e.ea=$(J(ee,1),le,0,7,[0,2,4,6,8,10,12,14,16,18,20,22])}function su(e){!e.temps&&(e.temps=new fe),ir(ds,e,e.temps),ir(e.temps,ps,e),ct(ds,e,e.temps),ct(e.temps,ps,e)}function ls(e,t){var r,n;for(n=0;n<8;n++)e.ca[n]=t.ca[n];for(r=0;r<12;r++)e.ea[r]=t.ea[r]}function Bc(e){return yl(qt[rt(e.ca,8,!1)])}function bc(e){return qt[rt(e.ea,8,!0)]}function Al(e){var t,r;for(r=0,t=0;t<11;t++)r=r<<1|e.ea[t]&1;return r}function Rl(e){var t,r;for(r=0,t=0;t<7;t++)r+=(r<<1)+(e.ca[t]>>3);return r}function Dl(e){var t,r;for(!e.temps&&(e.temps=new fe),r=0;r<12;r++)e.temps.ea[e.ea[r]>>1]=(r<<1|e.ea[r]&1)<<24>>24;for(t=0;t<8;t++)e.temps.ca[e.ca[t]&7]=(t|32>>(e.ca[t]>>3)&24)<<24>>24;ls(e,e.temps)}function au(e){var t,r,n,o,l,i,s;for(t=new fu(e),o=new fe,r=yl(qt[rt(t.ca,8,!1)])>>4,i={l:0,m:0,h:0},s=0;s<6;s++){if(n=yl(qt[rt(t.ca,8,!1)])>>4,r==n)for(l=0;l<16;l++)so(t,tt[0][l],o),cl(o.ca,e.ca)&&(ao(t,tt[0][l],o),cl(o.ea,e.ea)&&(i=ts(i,fl({l:1,m:0,h:0},(s<<4|l)<48?s<<4|l:48))));su(t),s%3==2&&Dl(t)}return i}function xc(e,t){Er(e.ca,t,8,!1)}function uu(e,t){Er(e.ea,t,8,!0)}function is(e,t){var r,n,o;for(n=0,r=10;r>=0;--r,t>>=1)n^=o=t&1,e.ea[r]=(e.ea[r]&-2|o)<<24>>24;e.ea[11]=(e.ea[11]&-2|n)<<24>>24}function ss(e,t){var r,n,o;for(n=15,r=6;r>=0;--r,t=~~(t/3))n-=o=t%3,e.ca[r]=(e.ca[r]&7|o<<3)<<24>>24;e.ca[7]=(e.ca[7]&7|n%3<<3)<<24>>24}function Sc(e){var t,r,n,o,l;for(l=0,o=0,n=0;n<12;n++)o|=1<<(e.ea[n]>>1),l^=e.ea[n]&1;if(o!=4095)return-2;if(l!=0)return-3;for(r=0,l=0,t=0;t<8;t++)r|=1<<(e.ca[t]&7),l+=e.ca[t]>>3;return r!=255?-4:l%3!=0?-5:(hs(rt(e.ea,12,!0),12)^hs(rt(e.ca,8,!1),8))!=0?-6:0}function so(e,t,r){X();var n,o,l,i,s,u;for(u=Qt[tt[0][t]],s=Qt[t],n=0;n<8;n++)l=u.ca[e.ca[s.ca[n]&7]&7]>>3,i=e.ca[s.ca[n]&7]>>3,o=l<3?i:(3-i)%3,r.ca[n]=(u.ca[e.ca[s.ca[n]&7]&7]&7|o<<3)<<24>>24}function ir(e,t,r){X();var n,o,l;for(n=0;n<8;n++)o=e.ca[t.ca[n]&7]>>3,l=t.ca[n]>>3,r.ca[n]=(e.ca[t.ca[n]&7]&7|(o+l)%3<<3)<<24>>24}function Fl(e,t,r){var n,o,l,i;for(n=0;n<8;n++)l=e.ca[t.ca[n]&7]>>3,i=t.ca[n]>>3,o=l+(l<3?i:6-i),o=o%3+(l<3==i<3?0:3),r.ca[n]=(e.ca[t.ca[n]&7]&7|o<<3)<<24>>24}function fe(){X(),os(this)}function yt(e,t,r,n){os(this),Er(this.ca,e,8,!1),ss(this,t),Er(this.ea,r,12,!0),is(this,n)}function fu(e){os(this),ls(this,e)}function yl(e){return X(),e^Zi>>((e&15)<<1)&3}function ao(e,t,r){X();var n,o,l;for(l=Qt[tt[0][t]],o=Qt[t],n=0;n<12;n++)r.ea[n]=(l.ea[e.ea[o.ea[n]>>1]>>1]^e.ea[o.ea[n]>>1]&1^o.ea[n]&1)<<24>>24}function ct(e,t,r){X();var n;for(n=0;n<12;n++)r.ea[n]=(e.ea[t.ea[n]>>1]^t.ea[n]&1)<<24>>24}function sr(e,t,r){X();var n;return n=fs[e],r&&(n=n^Zi>>((n&15)<<1)&3),n&65520|jt[n&15][t]}function gu(){return X(),0}function vc(){var e,t;for(ge[0]=new yt(15120,0,119750400,0),ge[3]=new yt(21021,1494,323403417,0),ge[6]=new yt(8064,1236,29441808,550),ge[9]=new yt(9,0,5880,0),ge[12]=new yt(1230,412,2949660,0),ge[15]=new yt(224,137,328552,137),e=0;e<18;e+=3)for(t=0;t<2;t++)ge[e+t+1]=new fe,ct(ge[e+t],ge[e],ge[e+t+1]),ir(ge[e+t],ge[e],ge[e+t+1])}function wc(){X();var e,t,r;for(as(40320,pn,qt,gs=Z(Re,Ae,0,2768,7,1),2),e=new fe,r=0;r<2768;r++)uu(e,pn[r]),dn[r]=Ln(e.ea,0,!0)+hs(pn[r],8)*70<<24>>24,Dl(e),fs[r]=qt[rt(e.ea,8,!0)];for(t=0;t<24;t++)Er(e.ea,t,12,!0),Dl(e),Bl[t]=rt(e.ea,12,!0)%24<<24>>24}function Uc(){var e,t,r,n,o,l,i,s,u,a,f,g,c,m,L,p;for(e=new fe,t=new fe,r=new yt(28783,0,259268407,0),p=new yt(15138,0,119765538,7),g=new yt(5167,0,83473207,0),o=0;o<8;o++)g.ca[o]=al(g.ca[o]|24);for(l=0;l<16;l++)Qt[l]=new fu(e),Fl(e,p,t),ct(e,p,t),L=t,t=e,e=L,l%4==3&&(Fl(L,g,t),ct(L,g,t),L=t,t=e,e=L),l%8==7&&(Fl(L,r,t),ct(L,r,t),L=t,t=e,e=L);for(i=0;i<16;i++)for(u=0;u<16;u++)for(Fl(Qt[i],Qt[u],e),f=0;f<16;f++)if(cl(Qt[f].ca,e.ca)){jt[i][u]=f,tt[f][u]=i;break}for(a=0;a<18;a++)for(m=0;m<16;m++){for(so(ge[a],tt[0][m],e),c=0;c<18;c++)if(cl(ge[c].ca,e.ca)){uo[m][a]=c,ur[m][(Oe(),hn)[a]]=hn[c];break}m%2==0&&(Ur[a<<3|m>>1]=uo[m][a])}for(n=0;n<18;n++)for(bl[n]=au(ge[n]),s=n,m=0;m<48;m++)uo[m%16][s]<n&&(mu[m]|=1<<n),m%16==15&&(s=xl[2][s])}function as(e,t,r,n,o){X();var l,i,s,u,a,f,g,c,m;for(l=new fe,s=new fe,i=0,a=0,m=o>=2?1:2,f=o!=1,u=0;u<e;u++)if(r[u]==0){switch(o){case 0:is(l,u);break;case 1:ss(l,u);break;case 2:Er(l.ea,u,8,!0)}for(g=0;g<16;g+=m){switch(f?ao(l,g,s):so(l,g,s),o){case 0:a=Al(s);break;case 1:a=Rl(s);break;case 2:a=rt(s.ea,8,!0)}o==0&&(ar[i<<3|g>>1]=a&Te),a==u&&(n[i]=(n[i]|1<<~~(g/m))&Te),c=~~((i<<4|g)/m),r[a]=c&Te}t[i++]=u&Te}return i}var Qt,qt,pn,wr,us,ar,Bl,dn,fs,Ur,uo,ur,jt,tt,cu,gs,cs,fo,ms,mu,ge,bl,ps,ds,xl,go=rr("org.cubing.min2phase.client","CubieCube",7);function Ec(e,t,r,n,o,l,i,s){var u,a,f,g,c;if(g=nr(et((Sr(),an),(i>>4)*140+vr[(X(),dn)[s>>4]&255][tt[i&15][s&15]]),nr(et(an,n*140+vr[dn[t]&255][tt[o][r]]),et(ml,t*24+io[l][r]))),g>e.maxDep2)return g-e.maxDep2;for(u=e.maxDep2;u>=g&&(c=Lu(e,n,o,t,r,l,u,e.depth1,10),!(c<0));u--){for(u-=c,e.solLen=0,e.solution=new bu,Gc(e.solution,e.verbose,e.urfIdx,e.depth1),f=0;f<e.depth1+u;f++)yu(e.solution,e.move[f]);for(a=e.preMoveLen-1;a>=0;a--)yu(e.solution,e.preMoves[a]);e.solLen=e.solution.length_0}return u!=e.maxDep2?(e.maxDep2=rs(Au,e.solLen-e.length1-1),$2(e.probe,e.probeMin)?0:1):1}function kc(e){var t,r,n,o,l,i,s,u,a,f,g,c,m,L,p;if(e.isRec=!1,$2(e.probe,e.solution?e.probeMin:e.probeMax))return 0;for(e.probe=ic(e.probe,{l:1,m:0,h:0}),n=e.valid1;n<e.depth1;n++)ir(e.phase1Cubie[n],(X(),ge)[e.move[n]],e.phase1Cubie[n+1]),ct(e.phase1Cubie[n],ge[e.move[n]],e.phase1Cubie[n+1]);for(e.valid1=e.depth1,s=Bc(e.phase1Cubie[e.depth1]),u=s&15,s>>=4,a=bc(e.phase1Cubie[e.depth1]),f=a&15,a>>=4,g=rt(e.phase1Cubie[e.depth1].ea,12,!0)%24,r=sr(a,f,!1),t=sr(s,u,!0),o=e.depth1==0?-1:e.move[e.depth1-1],l=e.preMoveLen==0?-1:e.preMoves[e.preMoveLen-1],p=0,L=(e.preMoveLen==0?1:2)*(e.depth1==0?1:2),c=0,m=(1<<L)-1;c<L;c++){if((m>>c&1)!=0){if(m&=~(1<<c),p=Ec(e,s,u,a,f,g,r,t),p==0||p>2)break;p==2&&(m&=4<<c)}if(m==0)break;(c&1)==0&&e.depth1>0?(i=(Oe(),hn)[~~(o/3)*3+1],e.move[e.depth1-1]=Bt[i]*2-e.move[e.depth1-1],g=(Sr(),gn)[g][i],s=sn[s][(X(),ur)[u][i]],u=jt[s&15][u],s>>=4,a=un[a][ur[f][i]],f=jt[a&15][f],a>>=4,t=sr(s,u,!0),r=sr(a,f,!1)):e.preMoveLen>0&&(i=(Oe(),hn)[~~(l/3)*3+1],e.preMoves[e.preMoveLen-1]=Bt[i]*2-e.preMoves[e.preMoveLen-1],g=(X(),Bl)[(Sr(),gn)[Bl[g]][i]],s=sn[t>>4][ur[t&15][i]],t=s&-16|jt[s&15][t&15],s=sr(t>>4,t&15,!0),u=s&15,s>>=4,a=un[r>>4][ur[r&15][i]],r=a&-16|jt[a&15][r&15],a=sr(r>>4,r&15,!1),f=a&15,a>>=4)}return e.depth1>0&&(e.move[e.depth1-1]=o),e.preMoveLen>0&&(e.preMoves[e.preMoveLen-1]=l),p==0?0:2}function zc(e){var t;for(e.conjMask=0,e.selfSym=au(e.cc),e.conjMask|=es(Pt(br(e.selfSym,16),{l:Te,m:0,h:0}),{l:0,m:0,h:0})?18:0,e.conjMask|=es(Pt(br(e.selfSym,32),{l:Te,m:0,h:0}),{l:0,m:0,h:0})?36:0,e.conjMask|=es(Pt(br(e.selfSym,48),{l:Te,m:0,h:0}),{l:0,m:0,h:0})?56:0,e.selfSym=Pt(e.selfSym,{l:je,m:je,h:15}),e.maxPreMoves=e.conjMask>7?0:20,t=0;t<6;t++)ls(e.urfCubieCube[t],e.cc),ou(e.urfCoordCube[t],e.urfCubieCube[t],20),su(e.cc),t%3==2&&Dl(e.cc)}function pu(e,t,r,n,o){var l,i,s,u,a,f;if(t.prun==0&&n<5)return e.allowShorter||n==0?(e.depth1-=n,a=kc(e),e.depth1+=n,a):1;for(f=gu($i(r)),l=0;l<18;l+=3)if(!(l==o||l==o-9)){for(s=0;s<3;s++)if(i=l+s,!(e.isRec&&i!=e.move[e.depth1-n]||f!=0&&(f&1<<i)!=0)){if(u=pc(e.nodeUD[n],t,i),u>n)break;if(u==n)continue;if(u=dc(e.nodeUD[n],t,i),u>n)break;if(u==n)continue;if(e.move[e.depth1-n]=i,e.valid1=rs(e.valid1,e.depth1-n),a=pu(e,e.nodeUD[n],r&xr((X(),bl)[i]),n-1,l),a==0)return 0;if(a>=2)break}}return 1}function du(e,t,r,n,o){var l,i,s;if(e.preMoveLen=e.maxPreMoves-t,(e.isRec?e.depth1==e.length1-e.preMoveLen:e.preMoveLen==0||(225207>>r&1)==0)&&(e.depth1=e.length1-e.preMoveLen,e.phase1Cubie[0]=n,e.allowShorter=e.depth1==Ls&&e.preMoveLen!=0,ou(e.nodeUD[e.depth1+1],n,e.depth1)&&pu(e,e.nodeUD[e.depth1+1],o,e.depth1,-1)==0))return 0;if(t==0||e.preMoveLen+Ls>=e.length1)return 1;for(s=gu($i(o)),(t==1||e.preMoveLen+1+Ls>=e.length1)&&(s|=225207),r=~~(r/3)*3,l=0;l<18;l++){if(l==r||l==r-9||l==r+9){l+=2;continue}if(!(e.isRec&&l!=e.preMoves[e.maxPreMoves-t]||(s&1<<l)!=0)&&(ir((X(),ge)[l],n,e.preMoveCubes[t]),ct(ge[l],n,e.preMoveCubes[t]),e.preMoves[e.maxPreMoves-t]=l,i=du(e,t-1,l,e.preMoveCubes[t],o&xr(bl[l])),i==0))return 0}return 1}function Lu(e,t,r,n,o,l,i,s,u){var a,f,g,c,m,L,p,F,y,x,B;if(t==0&&n==0&&l==0)return i;for(y=(Oe(),co)[u],p=0;p<10;p++){if((y>>p&1)!=0){p+=66>>p&3;continue}if(F=(Sr(),gn)[l][p],f=sn[n][(X(),ur)[o][p]],g=jt[f&15][o],f>>=4,m=un[t][ur[r][p]],L=jt[m&15][r],m>>=4,c=sr(m,L,!1),a=sr(f,g,!0),x=et(an,(c>>4)*140+vr[dn[a>>4]&255][tt[c&15][a&15]]),x>i+1)return i-x+1;if(x>=i){p+=66>>p&3&i-x;continue}if(x=nr(et(ml,f*24+io[F][g]),et(an,m*140+vr[dn[f]&255][tt[L][g]])),x>=i){p+=66>>p&3&i-x;continue}if(B=Lu(e,m,L,f,g,F,i-1,s+1,p),B>=0)return e.move[s]=Bt[p],B;if(B<-2)break;B<-1&&(p+=66>>p&3)}return-1}function Cc(e){for(e.length1=e.isRec?e.length1:0;e.length1<e.solLen;e.length1++)for(e.maxDep2=rs(Au,e.solLen-e.length1-1),e.urfIdx=e.isRec?e.urfIdx:0;e.urfIdx<6;e.urfIdx++)if((e.conjMask&1<<e.urfIdx)==0&&du(e,e.maxPreMoves,-30,e.urfCubieCube[e.urfIdx],xr(Pt(e.selfSym,{l:Te,m:0,h:0})))==0)return e.solution?Bu(e.solution):"Error 8";return e.solution?Bu(e.solution):"Error 7"}function Pc(e,t){var r;return r=Mc(e,t),r!=0?"Error "+(r<0?-r:r):(e.solLen=22,e.probe={l:0,m:0,h:0},e.probeMax={l:3531008,m:23,h:0},e.probeMin={l:0,m:0,h:0},e.verbose=0,e.solution=null,e.isRec=!1,lu(!1),zc(e),Cc(e))}function Mc(e,t){var r,n,o,l;for(n=0,o=Z(ee,le,0,54,7,1),r=uc($(J(Re,1),Ae,0,7,[t.charCodeAt(4),t.charCodeAt(13),t.charCodeAt(22),t.charCodeAt(31),t.charCodeAt(40),t.charCodeAt(49)])),l=0;l<54;l++){if(o[l]=ac(r,gc(t.charCodeAt(l)))<<24>>24,o[l]==-1)return-1;n+=1<<(o[l]<<2)}return n!=10066329?-1:(Ic(o,e.cc),Sc(e.cc))}function hu(){var e,t,r;for(this.move=Z(we,ve,0,31,7,1),this.nodeUD=Z(hl,se,31,21,0,1),this.nodeRL=Z(hl,se,31,21,0,1),this.nodeFB=Z(hl,se,31,21,0,1),this.cc=new fe,this.urfCubieCube=Z(go,se,7,6,0,1),this.urfCoordCube=Z(hl,se,31,6,0,1),this.phase1Cubie=Z(go,se,7,21,0,1),this.preMoveCubes=Z(go,se,7,21,0,1),this.preMoves=Z(we,ve,0,20,7,1),t=0;t<21;t++)this.nodeUD[t]=new oo,this.nodeRL[t]=new oo,this.nodeFB[t]=new oo,this.phase1Cubie[t]=new fe;for(r=0;r<6;r++)this.urfCubieCube[r]=new fe,this.urfCoordCube[r]=new oo;for(e=0;e<20;e++)this.preMoveCubes[e+1]=new fe}no(72,1,{},hu);V.allowShorter=!1;V.conjMask=0;V.depth1=0;V.isRec=!1;V.length1=0;V.maxDep2=0;V.maxPreMoves=0;V.preMoveLen=0;V.probe={l:0,m:0,h:0};V.probeMax={l:0,m:0,h:0};V.probeMin={l:0,m:0,h:0};V.selfSym={l:0,m:0,h:0};V.solLen=0;V.urfIdx=0;V.valid1=0;V.verbose=0;var Au=12,Ls=7,Ru=!1;function Oe(){if(!Ru){Ru=!0;var e,t,r,n,o,l;for(kr=$(J(ee,2),se,10,0,[$(J(ee,1),le,0,7,[8,9,20]),$(J(ee,1),le,0,7,[6,18,38]),$(J(ee,1),le,0,7,[0,36,47]),$(J(ee,1),le,0,7,[2,45,11]),$(J(ee,1),le,0,7,[29,26,15]),$(J(ee,1),le,0,7,[27,44,24]),$(J(ee,1),le,0,7,[33,53,42]),$(J(ee,1),le,0,7,[35,17,51])]),Vt=$(J(ee,2),se,10,0,[$(J(ee,1),le,0,7,[5,10]),$(J(ee,1),le,0,7,[7,19]),$(J(ee,1),le,0,7,[3,37]),$(J(ee,1),le,0,7,[1,46]),$(J(ee,1),le,0,7,[32,16]),$(J(ee,1),le,0,7,[28,25]),$(J(ee,1),le,0,7,[30,43]),$(J(ee,1),le,0,7,[34,52]),$(J(ee,1),le,0,7,[23,12]),$(J(ee,1),le,0,7,[21,41]),$(J(ee,1),le,0,7,[50,39]),$(J(ee,1),le,0,7,[48,14])]),Kt=Ke(we,[se,ve],[17,0],7,[13,13],2),As=$(J(cc,1),se,2,4,["U ","U2","U'","R ","R2","R'","F ","F2","F'","D ","D2","D'","L ","L2","L'","B ","B2","B'"]),Bt=$(J(we,1),ve,0,7,[0,1,2,4,7,9,10,11,13,16,3,5,6,8,12,14,15,17]),hn=Z(we,ve,0,18,7,1),co=Z(we,ve,0,11,7,1),t=0;t<18;t++)hn[Bt[t]]=t;for(r=0;r<10;r++)for(n=~~(Bt[r]/3),co[r]=0,o=0;o<10;o++)l=~~(Bt[o]/3),co[r]|=(n==l||n%3==l%3&&n>=l?1:0)<<o;for(co[10]=0,e=0;e<13;e++)for(Kt[e][0]=Kt[e][e]=1,o=1;o<e;o++)Kt[e][o]=Kt[e-1][o-1]+Kt[e-1][o]}}function Ln(e,t,r){Oe();var n,o,l,i,s;for(n=e.length-1,l=0,s=4,o=n;o>=0;o--)i=Du(e[o],r),(i&12)==t&&(l+=Kt[o][s--]);return l}function hs(e,t){Oe();var r,n;for(n=0,r=t-2;r>=0;r--)n^=e%(t-r),e=~~(e/(t-r));return n&1}function rt(e,t,r){Oe();var n,o,l,i;for(o=0,i={l:1323536,m:2777561,h:1043915},n=0;n<t-1;n++)l=Du(e[n],r)<<2,o=(t-n)*o+xr(Pt(br(i,l),{l:15,m:0,h:0})),i=eu(i,fl({l:1118480,m:279620,h:69905},l));return o}function Du(e,t){return t?e>>1:e&7}function Fu(e,t,r,n){Oe();var o,l,i,s;for(o=e.length-1,s=4,l=o,i=o;i>=0;i--)t>=Kt[i][s]?(t-=Kt[i][s--],e[i]=Sl(e[i],s|r,n)):((l&12)==r&&(l-=4),e[i]=Sl(e[i],l--,n))}function Er(e,t,r,n){Oe();var o,l,i,s,u,a;for(a={l:1323536,m:2777561,h:1043915},o={l:0,m:0,h:0},s=2;s<=r;s++)o=ts(fl(o,4),$i(t%s)),t=~~(t/s);for(l=0;l<r-1;l++)u=(xr(o)&15)<<2,o=br(o,4),e[l]=Sl(e[l],xr(Pt(br(a,u),{l:15,m:0,h:0})),n),i=eu(fl({l:1,m:0,h:0},u),{l:1,m:0,h:0}),a=ts(Pt(a,i),Pt(br(a,4),{l:~i.l&je,m:~i.m&je,h:~i.h&tr}));e[r-1]=Sl(e[r-1],xr(Pt(a,{l:15,m:0,h:0})),n)}function Sl(e,t,r){return(r?t<<1|e&1:t|e&-8)<<24>>24}function Ic(e,t){Oe();var r,n,o,l,i,s,u,a;for(l=0;l<8;l++)t.ca[l]=0;for(i=0;i<12;i++)t.ea[i]=0;for(s=0;s<8;s++){for(a=0;a<3&&!(e[kr[s][a]]==0||e[kr[s][a]]==3);a++);for(r=e[kr[s][(a+1)%3]],n=e[kr[s][(a+2)%3]],u=0;u<8;u++)if(r==~~(kr[u][1]/9)&&n==~~(kr[u][2]/9)){t.ca[s]=al(a%3<<3|u);break}}for(o=0;o<12;o++)for(u=0;u<12;u++){if(e[Vt[o][0]]==~~(Vt[u][0]/9)&&e[Vt[o][1]]==~~(Vt[u][1]/9)){t.ea[o]=al(u<<1);break}if(e[Vt[o][0]]==~~(Vt[u][1]/9)&&e[Vt[o][1]]==~~(Vt[u][0]/9)){t.ea[o]=al(u<<1|1);break}}}var Kt,co,kr,Vt,As,hn,Bt;function yu(e,t){var r,n,o;if(e.length_0==0){e.moves[e.length_0++]=t;return}if(r=~~(t/3),n=~~(e.moves[e.length_0-1]/3),r==n){o=(t%3+e.moves[e.length_0-1]%3+1)%4,o==3?--e.length_0:e.moves[e.length_0-1]=r*3+o;return}if(e.length_0>1&&r%3==n%3&&r==~~(e.moves[e.length_0-2]/3)){o=(t%3+e.moves[e.length_0-2]%3+1)%4,o==3?(e.moves[e.length_0-2]=e.moves[e.length_0-1],--e.length_0):e.moves[e.length_0-2]=r*3+o;return}e.moves[e.length_0++]=t}function Gc(e,t,r,n){e.verbose=t,e.urfIdx=r,e.depth1=n}function Bu(e){var t,r,n;if(r=new mc,n=(e.verbose&2)!=0?(e.urfIdx+3)%6:e.urfIdx,n<3)for(t=0;t<e.length_0;t++)(e.verbose&1)!=0&&t==e.depth1&&(r.string+=".  "),tu(ru(r,(Oe(),As)[(X(),xl)[n][e.moves[t]]]));else for(t=e.length_0-1;t>=0;t--)tu(ru(r,(Oe(),As)[(X(),xl)[n][e.moves[t]]])),(e.verbose&1)!=0&&t==e.depth1&&(r.string+=".  ");return r.string}function bu(){this.moves=Z(we,ve,0,31,7,1)}no(150,1,{},bu);V.depth1=0;V.length_0=0;V.urfIdx=0;V.verbose=0;var we=ul("int","I");rr("com.google.gwt.lang","CollapsedPropertyHolder",252);rr("com.google.gwt.lang","JavaClassHierarchySetupUtil",254);var Tc=rr("com.google.gwt.lang","LongLibBase/LongEmul",null);rr("com.google.gwt.lang","ModuleUtils",257);var ee=ul("byte","B"),Nc=ul("long","J"),Re=ul("char","C");rr("com.google.gwt.user.client.rpc","XsrfToken",null),rc("java.util","Map/Entry");var xu=function(){lu(!1)},Su=function(e){return Pc(new hu,e)};function vu(){return h(this,null,function*(){let e=yield zt["3x3x3"].def(),t=new Je(e);for(let r of V2)t.applyAlg(z.fromString((yield Wt())(r)));return K2(e,t.state)?t.state:vu()})}function Rs(e){return h(this,null,function*(){return $e(),z.fromString(Su(q2(e)))})}function An(){return h(this,null,function*(){return Rs(yield vu())})}function wu(){return h(this,null,function*(){xu()})}var _c=[[null,"Rw","Rw2","Rw'","Fw","Fw'"],[null,"Dw","Dw2","Dw'"]];function Uu(){return h(this,null,function*(){return ln(yield An(),_c)})}var Eu=new z("R' U' F");function ku(){return h(this,null,function*(){let e=new ut,t=yield An();return e.experimentalPushAlg(Eu),e.experimentalPushAlg(t),e.experimentalPushAlg(Eu),e.toAlg()})}he();var me=[],Ds=[1];for(let e=0;e<32;++e){me[e]=[];for(let t=0;t<32;++t)me[e][t]=0}for(let e=0;e<32;++e){me[e][0]=me[e][e]=1,Ds[e+1]=Ds[e]*(e+1);for(let t=1;t<e;++t)me[e][t]=me[e-1][t-1]+me[e-1][t]}function ae(e,...t){let r=t.length,n=e[t[r-1]];for(let o=r;o>0;o--)e[t[o]]=e[t[o-1]];return e[t[0]]=n,ae}function zu(e,t,r,n){r=(r||8)-1;let o=1985229328,l=0;n!=null||(n=0),n<0&&(t<<=1);for(let i=0;i<r;++i){let s=Ds[r-i],u=~~(t/s);l^=u,t%=s,u<<=2,e[i]=o>>u&7;let a=(1<<u)-1;o=(o&a)+(o>>4&~a)}return n<0&&(l&1)!=0?(e[r]=e[r-1],e[r-1]=o&7):e[r]=o&7,e}function T(e,t){let r=new Array(e);if(t!==void 0)for(let n=0;n<e;n++)r[n]=new Array(t);return r}var H,mo={},Oc={},Cu=0,Fs=30,Pu=21,Wc=22,Qc=23,Mu=24,qc=25,jc=34,Kc=26,ys=40;function Vc(e){return new mo[e]}function at(e,t,r,...n){let o=mo[e];o&&!o.___clazz$?H=o.prototype:(!o&&(o=mo[e]=function(){}),H=o.prototype=t<0?{}:Vc(t),H.castableTypeMap$=r);for(let l of n)l.prototype=H;o.___clazz$&&(H.___clazz$=o.___clazz$,o.___clazz$=null)}function fr(e){let t={};for(let r=0,n=e.length;r<n;++r)t[e[r]]=1;return t}at(1,-1,Oc);H.value=null;function Iu(){}function Hc(e,t){let r=Gu(0,t);return Tu(e.___clazz$,e.castableTypeMap$,e.queryId$,r),r}function Gu(e,t){let r=new Array(t);if(e===3)for(let n=0;n<t;++n){let o={m:0,l:0,h:0};o.l=o.m=o.h=0,r[n]=o}else if(e>0){let n=[null,0,!1][e];for(let o=0;o<t;++o)r[o]=n}return r}function Bs(e,t,r,n,o){let l=Gu(o,n);return Tu(e,t,r,l),l}function Tu(e,t,r,n){return _u(),Zc(n,bs,xs),n.___clazz$=e,n.castableTypeMap$=t,n.queryId$=r,n}function vl(e,t,r){return e[t]=r}at(73,1,{},Iu);H.queryId$=0;var Nu=!1;function _u(){Nu||(Nu=!0,bs=[],xs=[],Yc(new Iu,bs,xs))}function Yc(e,t,r){let n=0,o;for(let l in e)(o=e[l])&&(t[n]=l,r[n]=o,++n)}function Zc(e,t,r){_u();for(let n=0,o=t.length;n<o;++n)e[t[n]]=r[n]}var bs,xs;function Xc(e,t){return e.castableTypeMap$&&!!e.castableTypeMap$[t]}function Jc(e,t){return e!==null&&Xc(e,t)}var Ou=!1;function $c(){if(Ou)return!1;Ou=!0,zl=T(15582,36),Cl=T(15582),xt=T(15582),Fn=T(48,48),St=T(48,36),Dn=T(48),ws=T(48)}function Ss(e){e.ct=T(24)}function Wu(e,t){let r,n;if(Jc(t,Pu)){for(r=t,n=0;n<24;++n)if(e.ct[n]!==r.ct[n])return!1;return!0}return!1}function wl(e){let t,r,n;for(r=0,n=8,t=23;t>=0;--t)e.ct[t]===1&&(r+=me[t][n--]);return r}function Ul(e){let t,r;if(Rn!==null)return Rn[wl(e)];for(r=0;r<48;++r){if(t=lm(wl(e)),t!==-1)return t*64+r;oe(e,0),r%2==1&&oe(e,1),r%8==7&&oe(e,2),r%16==15&&oe(e,3)}}function bt(e,t){let r=t%3;switch(t=~~(t/3),t){case 0:A(e.ct,0,1,2,3,r);break;case 1:A(e.ct,16,17,18,19,r);break;case 2:A(e.ct,8,9,10,11,r);break;case 3:A(e.ct,4,5,6,7,r);break;case 4:A(e.ct,20,21,22,23,r);break;case 5:A(e.ct,12,13,14,15,r);break;case 6:A(e.ct,0,1,2,3,r),A(e.ct,8,20,12,16,r),A(e.ct,9,21,13,17,r);break;case 7:A(e.ct,16,17,18,19,r),A(e.ct,1,15,5,9,r),A(e.ct,2,12,6,10,r);break;case 8:A(e.ct,8,9,10,11,r),A(e.ct,2,19,4,21,r),A(e.ct,3,16,5,22,r);break;case 9:A(e.ct,4,5,6,7,r),A(e.ct,10,18,14,22,r),A(e.ct,11,19,15,23,r);break;case 10:A(e.ct,20,21,22,23,r),A(e.ct,0,8,4,14,r),A(e.ct,3,11,7,13,r);break;case 11:A(e.ct,12,13,14,15,r),A(e.ct,1,20,7,18,r),A(e.ct,0,23,6,17,r)}}function oe(e,t){switch(t){case 0:bt(e,19),bt(e,28);break;case 1:bt(e,21),bt(e,32);break;case 2:A(e.ct,0,3,1,2,1),A(e.ct,8,11,9,10,1),A(e.ct,4,7,5,6,1),A(e.ct,12,15,13,14,1),A(e.ct,16,19,21,22,1),A(e.ct,17,18,20,23,1);break;case 3:bt(e,18),bt(e,29),bt(e,24),bt(e,35)}}function Qu(e,t){let r;for(r=0;r<t;++r)oe(e,0),r%2==1&&oe(e,1),r%8==7&&oe(e,2),r%16==15&&oe(e,3)}function vs(e,t){let r,n;for(n=8,r=23;r>=0;--r)e.ct[r]=0,t>=me[r][n]&&(t-=me[r][n--],e.ct[r]=1)}function El(e,t){let r;for(r=0;r<24;++r)e.ct[r]=t.ct[r]}function po(){let e;for(Ss(this),e=0;e<8;++e)this.ct[e]=1;for(e=8;e<24;++e)this.ct[e]=0}function kl(e,t){let r;for(Ss(this),r=0;r<24;++r)this.ct[r]=~~(e.ct[r]/2)===t?1:0}function Lo(e){let t;for(Ss(this),t=0;t<24;++t)this.ct[t]=e[t]}function em(){let e,t,r=new po,n=new po;for(e=0;e<15582;++e)for(vs(n,Cl[e]),t=0;t<36;++t)El(r,n),bt(r,t),zl[e][t]=Ul(r)}function tm(){let e,t,r,n,o,l,i,s;for(Xl(xt),xt[0]=0,t=0,r=1;r!==15582;)for(l=t>4,s=l?-1:t,e=l?t:-1,++t,n=0;n<15582;++n)if(xt[n]===s){for(i=0;i<27;++i)if(o=~~zl[n][i]>>>6,xt[o]===e)if(++r,l){xt[n]=t;break}else xt[o]=t}}function rm(e){let t,r,n,o=new Lo(e.ct);for(n=0;n<48;++n){for(t=!0,r=0;r<24;++r)if(o.ct[r]!==~~(r/4)){t=!1;break}if(t)return n;oe(o,0),n%2==1&&oe(o,1),n%8==7&&oe(o,2),n%16==15&&oe(o,3)}return-1}function nm(){let e,t,r,n=new po;for(e=0;e<24;++e)n.ct[e]=e;let o=new Lo(n.ct),l=new Lo(n.ct),i=new Lo(n.ct);for(e=0;e<48;++e){for(t=0;t<48;++t){for(r=0;r<48;++r)Wu(n,o)&&(Fn[e][t]=r,r===0&&(Dn[e]=t)),oe(o,0),r%2==1&&oe(o,1),r%8==7&&oe(o,2),r%16==15&&oe(o,3);oe(n,0),t%2==1&&oe(n,1),t%8==7&&oe(n,2),t%16==15&&oe(n,3)}oe(n,0),e%2==1&&oe(n,1),e%8==7&&oe(n,2),e%16==15&&oe(n,3)}for(e=0;e<48;++e)for(El(n,l),Qu(n,Dn[e]),t=0;t<36;++t)for(El(o,n),bt(o,t),Qu(o,e),r=0;r<36;++r)if(El(i,l),bt(i,r),Wu(i,o)){St[e][t]=r;break}for(vs(n,0),e=0;e<48;++e)ws[Dn[e]]=wl(n),oe(n,0),e%2==1&&oe(n,1),e%8==7&&oe(n,2),e%16==15&&oe(n,3)}function om(){let e,t,r,n,o=new po,l=T(22984);for(t=0;t<22984;t++)l[t]=0;for(e=0,t=0;t<735471;++t)if((l[~~t>>>5]&1<<(t&31))==0){for(vs(o,t),n=0;n<48;++n)r=wl(o),l[~~r>>>5]|=1<<(r&31),Rn!==null&&(Rn[r]=e<<6|Dn[n]),oe(o,0),n%2==1&&oe(o,1),n%8==7&&oe(o,2),n%16==15&&oe(o,3);Cl[e++]=t}}function lm(e){let t=Km(Cl,e);return t>=0?t:-1}at(153,1,fr([Pu]),po,kl,Lo);var xt,zl,ws,Rn=null,Cl,Dn,St,Fn,qu=!1;function im(){qu||(qu=!0,Gl=T(70,28),Il=T(6435,28),Zu=T(70,16),Hu=T(6435,16),Ve=T(450450),Yu=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0])}function Pl(e){let t,r,n;for(r=0,n=8,t=14;t>=0;--t)e.ct[t]!==e.ct[15]&&(r+=me[t][n--]);return r}function Ml(e){let t,r,n;for(r=0,n=4,t=6;t>=0;--t)e.rl[t]!==e.rl[7]&&(r+=me[t][n--]);return r*2+e.parity}function yn(e,t){e.parity^=Yu[t];let r=t%3;switch(t=~~(t/3),t){case 0:A(e.ct,0,1,2,3,r);break;case 1:A(e.rl,0,1,2,3,r);break;case 2:A(e.ct,8,9,10,11,r);break;case 3:A(e.ct,4,5,6,7,r);break;case 4:A(e.rl,4,5,6,7,r);break;case 5:A(e.ct,12,13,14,15,r);break;case 6:A(e.ct,0,1,2,3,r),A(e.rl,0,5,4,1,r),A(e.ct,8,9,12,13,r);break;case 7:A(e.rl,0,1,2,3,r),A(e.ct,1,15,5,9,r),A(e.ct,2,12,6,10,r);break;case 8:A(e.ct,8,9,10,11,r),A(e.rl,0,3,6,5,r),A(e.ct,3,2,5,4,r);break;case 9:A(e.ct,4,5,6,7,r),A(e.rl,3,2,7,6,r),A(e.ct,11,10,15,14,r);break;case 10:A(e.rl,4,5,6,7,r),A(e.ct,0,8,4,14,r),A(e.ct,3,11,7,13,r);break;case 11:A(e.ct,12,13,14,15,r),A(e.rl,1,4,7,2,r),A(e.ct,1,0,7,6,r)}}function Bn(e,t){switch(t){case 0:yn(e,19),yn(e,28);break;case 1:yn(e,21),yn(e,32);break;case 2:A(e.ct,0,3,1,2,1),A(e.ct,8,11,9,10,1),A(e.ct,4,7,5,6,1),A(e.ct,12,15,13,14,1),A(e.rl,0,3,5,6,1),A(e.rl,1,2,4,7,1)}}function ju(e,t,r){let n;for(n=0;n<16;++n)e.ct[n]=~~(t.ct[n]/2);for(n=0;n<8;++n)e.rl[n]=t.ct[n+16];e.parity=r}function Ku(e,t){let r,n;for(n=8,e.ct[15]=0,r=14;r>=0;--r)t>=me[r][n]?(t-=me[r][n--],e.ct[r]=1):e.ct[r]=0}function Vu(e,t){let r,n;for(e.parity=t&1,t>>>=1,n=4,e.rl[7]=0,r=6;r>=0;--r)t>=me[r][n]?(t-=me[r][n--],e.rl[r]=1):e.rl[r]=0}function Us(){this.rl=T(8),this.ct=T(16)}function sm(){let e,t,r,n,o,l,i,s,u,a,f=new Us;for(o=0;o<70;++o)for(s=0;s<28;++s)Vu(f,o),yn(f,Cr[s]),Gl[o][s]=Ml(f);for(o=0;o<70;++o)for(Vu(f,o),i=0;i<16;++i)Zu[o][i]=Ml(f),Bn(f,0),i%2==1&&Bn(f,1),i%8==7&&Bn(f,2);for(o=0;o<6435;++o)for(Ku(f,o),i=0;i<16;++i)Hu[o][i]=Pl(f)&65535,Bn(f,0),i%2==1&&Bn(f,1),i%8==7&&Bn(f,2);for(o=0;o<6435;++o)for(s=0;s<28;++s)Ku(f,o),yn(f,Cr[s]),Il[o][s]=Pl(f)&65535;for(Xl(Ve),Ve[0]=Ve[18]=Ve[28]=Ve[46]=Ve[54]=Ve[56]=0,r=0,n=6;n!==450450;){let g=r>6,c=g?-1:r,m=g?r:-1;for(++r,o=0;o<450450;++o)if(Ve[o]===c){for(e=~~(o/70),u=o%70,s=0;s<23;++s)if(t=Il[e][s],a=Gl[u][s],l=t*70+a,Ve[l]===m)if(++n,g){Ve[o]=r;break}else Ve[l]=r}}}at(154,1,{},Us);H.parity=0;var Il,Ve,Hu,Yu,Gl,Zu,Xu=!1;function am(){Xu||(Xu=!0,ho=T(29400,20),$u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],gr=T(29400),zs=[0,9,14,23,27,28,41,42,46,55,60,69],Cs=T(70))}function Es(e){let t,r,n,o;for(r=0,o=4,t=6;t>=0;--t)e.ud[t]!==e.ud[7]&&(r+=me[t][o--]);for(r*=35,o=4,t=6;t>=0;--t)e.fb[t]!==e.fb[7]&&(r+=me[t][o--]);r*=12;let l=e.fb[7]^e.ud[7];for(n=0,o=4,t=7;t>=0;--t)e.rl[t]!==l&&(n+=me[t][o--]);return e.parity+2*(r+Cs[n])}function um(e,t){switch(e.parity^=$u[t],t){case 0:case 1:case 2:A(e.ud,0,1,2,3,t%3);break;case 3:A(e.rl,0,1,2,3,1);break;case 4:case 5:case 6:A(e.fb,0,1,2,3,(t-1)%3);break;case 7:case 8:case 9:A(e.ud,4,5,6,7,(t-1)%3);break;case 10:A(e.rl,4,5,6,7,1);break;case 11:case 12:case 13:A(e.fb,4,5,6,7,(t+1)%3);break;case 14:A(e.ud,0,1,2,3,1),A(e.rl,0,5,4,1,1),A(e.fb,0,5,4,1,1);break;case 15:A(e.rl,0,1,2,3,1),A(e.fb,1,4,7,2,1),A(e.ud,1,6,5,2,1);break;case 16:A(e.fb,0,1,2,3,1),A(e.ud,3,2,5,4,1),A(e.rl,0,3,6,5,1);break;case 17:A(e.ud,4,5,6,7,1),A(e.rl,3,2,7,6,1),A(e.fb,3,2,7,6,1);break;case 18:A(e.rl,4,5,6,7,1),A(e.fb,0,3,6,5,1),A(e.ud,0,3,4,7,1);break;case 19:A(e.fb,4,5,6,7,1),A(e.ud,0,7,6,1,1),A(e.rl,1,4,7,2,1)}}function Ju(e,t,r){let n,o=(t.ct[0]>t.ct[8]?1:0)^(t.ct[8]>t.ct[16]?1:0)^(t.ct[0]>t.ct[16]?1:0)?1:0;for(n=0;n<8;++n)e.ud[n]=t.ct[n]&1^1,e.fb[n]=t.ct[n+8]&1^1,e.rl[n]=t.ct[n+16]&1^1^o;e.parity=o^r}function fm(e,t){let r,n,o,l;for(e.parity=t&1,t>>>=1,o=zs[t%12],t=~~(t/12),l=4,r=7;r>=0;--r)e.rl[r]=0,o>=me[r][l]&&(o-=me[r][l--],e.rl[r]=1);for(n=t%35,t=~~(t/35),l=4,e.fb[7]=0,r=6;r>=0;--r)n>=me[r][l]?(n-=me[r][l--],e.fb[r]=1):e.fb[r]=0;for(l=4,e.ud[7]=0,r=6;r>=0;--r)t>=me[r][l]?(t-=me[r][l--],e.ud[r]=1):e.ud[r]=0}function ks(){this.ud=T(8),this.rl=T(8),this.fb=T(8)}function gm(){let e,t,r,n;for(r=0;r<12;++r)Cs[zs[r]]=r;let o=new ks;for(r=0;r<29400;++r)for(n=0;n<20;++n)fm(o,r),um(o,n),ho[r][n]=Es(o)&65535;for(Xl(gr),gr[0]=0,e=0,t=1;t!==29400;){for(r=0;r<29400;++r)if(gr[r]===e)for(n=0;n<17;++n)gr[ho[r][n]]===-1&&(gr[ho[r][n]]=e+1,++t);++e}}at(155,1,{},ks);H.parity=0;var ho,$u,gr,zs,Cs;function cm(e,t){let r;for(r=0;r<24;++r)e.ct[r]=t.ct[r]}function mm(e,t){let r=t%3;switch(t=~~(t/3),t){case 0:A(e.ct,0,1,2,3,r);break;case 1:A(e.ct,16,17,18,19,r);break;case 2:A(e.ct,8,9,10,11,r);break;case 3:A(e.ct,4,5,6,7,r);break;case 4:A(e.ct,20,21,22,23,r);break;case 5:A(e.ct,12,13,14,15,r);break;case 6:A(e.ct,0,1,2,3,r),A(e.ct,8,20,12,16,r),A(e.ct,9,21,13,17,r);break;case 7:A(e.ct,16,17,18,19,r),A(e.ct,1,15,5,9,r),A(e.ct,2,12,6,10,r);break;case 8:A(e.ct,8,9,10,11,r),A(e.ct,2,19,4,21,r),A(e.ct,3,16,5,22,r);break;case 9:A(e.ct,4,5,6,7,r),A(e.ct,10,18,14,22,r),A(e.ct,11,19,15,23,r);break;case 10:A(e.ct,20,21,22,23,r),A(e.ct,0,8,4,14,r),A(e.ct,3,11,7,13,r);break;case 11:A(e.ct,12,13,14,15,r),A(e.ct,1,20,7,18,r),A(e.ct,0,23,6,17,r)}}function Ps(){let e;for(this.ct=T(24),e=0;e<24;++e)this.ct[e]=~~(e/4)}function ef(e){let t,r,n;for(Ps.call(this),t=0;t<23;++t)n=t+e(24-t),this.ct[n]!==this.ct[t]&&(r=this.ct[t],this.ct[t]=this.ct[n],this.ct[n]=r)}at(156,1,{},Ps,ef);var tf=!1;function pm(){tf||(tf=!0,mt=T(18),hm())}function rf(e){e.cp=[0,1,2,3,4,5,6,7],e.co=[0,0,0,0,0,0,0,0]}function nf(e,t){let r;for(r=0;r<8;++r)e.cp[r]=t.cp[r],e.co[r]=t.co[r]}function dm(e,t){!e.temps&&(e.temps=new Tl),of(e,mt[t],e.temps),nf(e,e.temps)}function Lm(e,t){let r,n;for(n=0,r=6;r>=0;--r)n+=e.co[r]=t%3,t=~~(t/3);e.co[7]=(15-n)%3}function of(e,t,r){let n,o,l,i;for(n=0;n<8;++n)r.cp[n]=e.cp[t.cp[n]],l=e.co[t.cp[n]],i=t.co[n],o=l,o=o+(l<3?i:6-i),o=o%3,(l>=3?1:0)^(i>=3?1:0)&&(o=o+3),r.co[n]=o}function Tl(){rf(this)}function cr(e,t){rf(this),zu(this.cp,e),Lm(this,t)}function lf(e){cr.call(this,e(40320),e(2187))}function hm(){let e,t;for(mt[0]=new cr(15120,0),mt[3]=new cr(21021,1494),mt[6]=new cr(8064,1236),mt[9]=new cr(9,0),mt[12]=new cr(1230,412),mt[15]=new cr(224,137),e=0;e<18;e+=3)for(t=0;t<2;++t)mt[e+t+1]=new Tl,of(mt[e+t],mt[e],mt[e+t+1])}at(157,1,fr([Wc]),Tl,cr,lf);H.temps=null;var mt,sf=!1;function Am(){sf||(sf=!0,vt=T(1937880),Wl=T(1538),Ql=T(1538),wn=T(11880),mf=[0,1,6,3,4,5,2,7],Ts=T(160,12),Ns=T(160,12),Gs=[1,1,1,3,12,60,360,2520,20160,181440,1814400,19958400,239500800],Is=[0,2,4,6,1,3,7,5,8,9,10,11])}function bn(e,t,r,n,o){let l=e.edgeo[o];e.edgeo[o]=e.edge[n],e.edge[n]=e.edgeo[r],e.edgeo[r]=e.edge[t],e.edge[t]=l}function xn(e,t){let r,n,o,l,i;for(e.isStd||gf(e),n=0,i=1985229328,l=47768,r=0;r<t;++r)o=e.edge[r]<<2,n*=12-r,o>=32?(n+=l>>o-32&15,l-=4368<<o-32):(n+=i>>o&15,l-=4369,i-=286331152<<o);return n}function af(e){let t,r=xn(e,4);t=wn[r];let n=t&7;t>>=3,_l(e,n);let o=xn(e,10)%20160;return t*20160+o}function Nl(e,t){switch(e.isStd=!1,t){case 0:ae(e.edge,0,4,1,5),ae(e.edgeo,0,4,1,5);break;case 1:Le(e.edge,0,4,1,5),Le(e.edgeo,0,4,1,5);break;case 2:ae(e.edge,0,5,1,4),ae(e.edgeo,0,5,1,4);break;case 3:Le(e.edge,5,10,6,11),Le(e.edgeo,5,10,6,11);break;case 4:ae(e.edge,0,11,3,8),ae(e.edgeo,0,11,3,8);break;case 5:Le(e.edge,0,11,3,8),Le(e.edgeo,0,11,3,8);break;case 6:ae(e.edge,0,8,3,11),ae(e.edgeo,0,8,3,11);break;case 7:ae(e.edge,2,7,3,6),ae(e.edgeo,2,7,3,6);break;case 8:Le(e.edge,2,7,3,6),Le(e.edgeo,2,7,3,6);break;case 9:ae(e.edge,2,6,3,7),ae(e.edgeo,2,6,3,7);break;case 10:Le(e.edge,4,8,7,9),Le(e.edgeo,4,8,7,9);break;case 11:ae(e.edge,1,9,2,10),ae(e.edgeo,1,9,2,10);break;case 12:Le(e.edge,1,9,2,10),Le(e.edgeo,1,9,2,10);break;case 13:ae(e.edge,1,10,2,9),ae(e.edgeo,1,10,2,9);break;case 14:Le(e.edge,0,4,1,5),Le(e.edgeo,0,4,1,5),ae(e.edge,9,11),ae(e.edgeo,8,10);break;case 15:Le(e.edge,5,10,6,11),Le(e.edgeo,5,10,6,11),ae(e.edge,1,3),ae(e.edgeo,0,2);break;case 16:Le(e.edge,0,11,3,8),Le(e.edgeo,0,11,3,8),ae(e.edge,5,7),ae(e.edgeo,4,6);break;case 17:Le(e.edge,2,7,3,6),Le(e.edgeo,2,7,3,6),ae(e.edge,8,10),ae(e.edgeo,9,11);break;case 18:Le(e.edge,4,8,7,9),Le(e.edgeo,4,8,7,9),ae(e.edge,0,2),ae(e.edgeo,1,3);break;case 19:Le(e.edge,1,9,2,10),Le(e.edgeo,1,9,2,10),ae(e.edge,4,6),ae(e.edgeo,5,7)}}function Sn(e,t){switch(e.isStd=!1,t){case 0:Nl(e,14),Nl(e,17);break;case 1:bn(e,11,5,10,6),bn(e,5,10,6,11),bn(e,1,2,3,0),bn(e,4,9,7,8),bn(e,8,4,9,7),bn(e,0,1,2,3);break;case 2:pt(e,4,5),pt(e,5,4),pt(e,11,8),pt(e,8,11),pt(e,7,6),pt(e,6,7),pt(e,9,10),pt(e,10,9),pt(e,1,1),pt(e,0,0),pt(e,3,3),pt(e,2,2)}}function _l(e,t){for(;t>=2;)t-=2,Sn(e,1),Sn(e,2);t!==0&&Sn(e,0)}function Ao(e,t){let r,n,o,l,i,s;for(i=1985229328,s=47768,o=0,r=0;r<11;++r)if(n=Gs[11-r],l=~~(t/n),t=t%n,o^=l,l<<=2,l>=32){l=l-32,e.edge[r]=s>>l&15;let u=(1<<l)-1;s=(s&u)+(s>>4&~u)}else{e.edge[r]=i>>l&15;let u=(1<<l)-1;i=(i&u)+(i>>>4&~u)+(s<<28),s=s>>4}for((o&1)==0?e.edge[11]=i:(e.edge[11]=e.edge[10],e.edge[10]=i),r=0;r<12;++r)e.edgeo[r]=r;e.isStd=!0}function uf(e,t){let r;for(r=0;r<12;++r)e.edge[r]=t.edge[r],e.edgeo[r]=t.edgeo[r];e.isStd=t.isStd}function ff(e,t){let r,n,o,l;for(e.temp===null&&(e.temp=T(12)),r=0;r<12;++r)e.temp[r]=r,e.edge[r]=t.ep[Is[r]+12]%12;for(n=1,r=0;r<12;++r)for(;e.edge[r]!==r;)l=e.edge[r],e.edge[r]=e.edge[l],e.edge[l]=l,o=e.temp[r],e.temp[r]=e.temp[l],e.temp[l]=o,n^=1;for(r=0;r<12;++r)e.edge[r]=e.temp[t.ep[Is[r]]%12];return n}function gf(e){let t;for(e.temp===null&&(e.temp=T(12)),t=0;t<12;++t)e.temp[e.edgeo[t]]=t;for(t=0;t<12;++t)e.edge[t]=e.temp[e.edge[t]],e.edgeo[t]=t;e.isStd=!0}function Le(e,t,r,n,o){let l;l=e[t],e[t]=e[n],e[n]=l,l=e[r],e[r]=e[o],e[o]=l}function pt(e,t,r){let n=e.edge[t];e.edge[t]=e.edgeo[r],e.edgeo[r]=n}function Ht(){this.edge=T(12),this.edgeo=T(12)}function Rm(){let e,t,r,n,o,l,i,s,u,a,f,g,c,m,L,p,F,y,x,B,P,k,K=new Ht,te=new Ht,N=new Ht;for(Xl(vt),s=0,Ol=1,Ms(vt,0,0);Ol!==31006080&&(L=s>9,i=s%3,l=(s+1)%3,a=L?3:i,e=L?i:3,!(s>=9));){for(g=0;g<31006080;g+=16)if(k=vt[~~g>>4],!(!L&&k===-1)){for(f=g,u=g+16;f<u;++f,k>>=2)if((k&3)===a){for(x=~~(f/20160),t=Wl[x],n=f%20160,Ao(K,t*20160+n),F=0;F<17;++F)if(r=vn(K.edge,F<<3,4),B=wn[r],P=B&7,B>>=3,o=vn(K.edge,F<<3|P,10)%20160,c=B*20160+o,Ro(vt,c)===e){if(Ms(vt,L?f:c,l),++Ol,L)break;if(y=Ql[B],y!==1)for(uf(te,K),Nl(te,F),_l(te,P),p=1;(y=~~y>>1&65535)!=0;++p)(y&1)==1&&(uf(N,te),_l(N,p),m=B*20160+xn(N,10)%20160,Ro(vt,m)===e&&(Ms(vt,m,l),++Ol))}}}++s}}function Ro(e,t){return e[t>>4]>>((t&15)<<1)&3}function vn(e,t,r){let n,o,l,i,s,u=Ns[t],a=Ts[t];for(o=0,s=1985229328,i=47768,n=0;n<r;++n)l=u[e[a[n]]]<<2,o*=12-n,l>=32?(o+=i>>l-32&15,i-=4368<<l-32):(o+=s>>l&15,i-=4369,s-=286331152<<l);return o}function cf(e){let t,r,n,o,l,i,s,u,a,f,g,c=new Ht;if(i=0,l=Ro(vt,e),l===3)return 10;for(;e!==0;)for(l===0?l=2:--l,a=~~(e/20160),t=Wl[a],n=e%20160,Ao(c,t*20160+n),u=0;u<17;++u)if(r=vn(c.edge,u<<3,4),f=wn[r],g=f&7,f>>=3,o=vn(c.edge,u<<3|g,10)%20160,s=f*20160+o,Ro(vt,s)===l){++i,e=s;break}return i}function Dm(e,t){let r=Ro(vt,e);return r===3?10:(1227133513<<r>>t&3)+t-1}function Fm(){let e,t,r,n=new Ht;for(t=0;t<20;++t)for(r=0;r<8;++r){for(Ao(n,0),Nl(n,t),_l(n,r),e=0;e<12;++e)Ts[t<<3|r][e]=n.edge[e];for(gf(n),e=0;e<12;++e)Ns[t<<3|r][e]=n.temp[e]}}function ym(){let e,t,r,n,o=new Ht,l=T(1485);for(t=0;t<1485;t++)l[t]=0;for(e=0,t=0;t<11880;++t)if((l[~~t>>>3]&1<<(t&7))==0){for(Ao(o,t*Gs[8]),n=0;n<8;++n)r=xn(o,4),r===t&&(Ql[e]=(Ql[e]|1<<n)&65535),l[~~r>>3]=l[~~r>>3]|1<<(r&7),wn[r]=e<<3|mf[n],Sn(o,0),n%2==1&&(Sn(o,1),Sn(o,2));Wl[e++]=t}}function Ms(e,t,r){e[t>>4]^=(3^r)<<((t&15)<<1)}at(158,1,fr([Qc]),Ht);H.isStd=!0;H.temp=null;var Is,Ol=0,vt,Gs,Ts,Ns,wn,Wl,mf,Ql,pf=!1;function Bm(){pf||(pf=!0)}function bm(e){let t,r,n;for(t=0,n=!1,r=0;r<12;++r)t|=1<<e.ep[r],n=n!==e.ep[r]>=12;return t&=~~t>>12,t===0&&!n}function xm(e,t){let r;for(r=0;r<24;++r)e.ep[r]=t.ep[r]}function Sm(e,t){let r=t%3;switch(t=~~(t/3),t){case 0:A(e.ep,0,1,2,3,r),A(e.ep,12,13,14,15,r);break;case 1:A(e.ep,11,15,10,19,r),A(e.ep,23,3,22,7,r);break;case 2:A(e.ep,0,11,6,8,r),A(e.ep,12,23,18,20,r);break;case 3:A(e.ep,4,5,6,7,r),A(e.ep,16,17,18,19,r);break;case 4:A(e.ep,1,20,5,21,r),A(e.ep,13,8,17,9,r);break;case 5:A(e.ep,2,9,4,10,r),A(e.ep,14,21,16,22,r);break;case 6:A(e.ep,0,1,2,3,r),A(e.ep,12,13,14,15,r),A(e.ep,9,22,11,20,r);break;case 7:A(e.ep,11,15,10,19,r),A(e.ep,23,3,22,7,r),A(e.ep,2,16,6,12,r);break;case 8:A(e.ep,0,11,6,8,r),A(e.ep,12,23,18,20,r),A(e.ep,3,19,5,13,r);break;case 9:A(e.ep,4,5,6,7,r),A(e.ep,16,17,18,19,r),A(e.ep,8,23,10,21,r);break;case 10:A(e.ep,1,20,5,21,r),A(e.ep,13,8,17,9,r),A(e.ep,14,0,18,4,r);break;case 11:A(e.ep,2,9,4,10,r),A(e.ep,14,21,16,22,r),A(e.ep,7,15,1,17,r)}}function _s(){let e;for(this.ep=T(24),e=0;e<24;++e)this.ep[e]=e}function df(e){let t,r,n;for(_s.call(this),t=0;t<23;++t)n=t+e(24-t),n!==t&&(r=this.ep[t],this.ep[t]=this.ep[n],this.ep[n]=r)}at(159,1,{},_s,df);var Lf=!1;function vm(){Lf||(Lf=!0,Os=[35,1,34,2,4,6,22,5,19])}function hf(e){e.moveBuffer=T(60)}function wm(e,t){return e.value-t.value}function Un(e,t){let r;for(xm(e.edge,t.edge),cm(e.center,t.center),nf(e.corner,t.corner),e.value=t.value,e.add1=t.add1,e.length1=t.length1,e.length2=t.length2,e.length3=t.length3,e.sym=t.sym,r=0;r<60;++r)e.moveBuffer[r]=t.moveBuffer[r];e.moveLength=t.moveLength,e.edgeAvail=t.edgeAvail,e.centerAvail=t.centerAvail,e.cornerAvail=t.cornerAvail}function mr(e){for(;e.centerAvail<e.moveLength;)mm(e.center,e.moveBuffer[e.centerAvail++]);return e.center}function Af(e){for(;e.cornerAvail<e.moveLength;)dm(e.corner,e.moveBuffer[e.cornerAvail++]%18);return e.corner}function Do(e){for(;e.edgeAvail<e.moveLength;)Sm(e.edge,e.moveBuffer[e.edgeAvail++]);return e.edge}function Um(e){let t,r,n,o,l,i,s=new Array(e.moveLength-(e.add1?2:0));for(r=0,t=0;t<e.length1;++t)s[r++]=e.moveBuffer[t];for(i=e.sym,t=e.length1+(e.add1?2:0);t<e.moveLength;++t)St[i][e.moveBuffer[t]]>=27?(s[r++]=St[i][e.moveBuffer[t]]-9,o=Os[St[i][e.moveBuffer[t]]-27],i=Fn[i][o]):s[r++]=St[i][e.moveBuffer[t]];let u=Fn[Dn[i]][rm(mr(e))];for(l="",i=u,t=r-1;t>=0;--t)n=s[t],n=~~(n/3)*3+(2-n%3),St[i][n]>=27?(l=l+Ws[St[i][n]-9]+" ",o=Os[St[i][n]-27],i=Fn[i][o]):l=l+Ws[St[i][n]]+" ";return l}function zr(e,t){e.moveBuffer[e.moveLength++]=t}function ql(){hf(this),this.edge=new _s,this.center=new Ps,this.corner=new Tl}function jl(e){ql.call(this),Un(this,e)}function Rf(e){hf(this),this.edge=new df(e),this.center=new ef(e),this.corner=new lf(e)}at(160,1,fr([Mu,jc]),ql,jl,Rf);H.compareTo$=function(t){return wm(this,t)};H.add1=!1;H.center=null;H.centerAvail=0;H.corner=null;H.cornerAvail=0;H.edge=null;H.edgeAvail=0;H.length1=0;H.length2=0;H.length3=0;H.moveLength=0;H.sym=0;H.value=0;var Os;function Em(e,t){return t.value-e.value}function Kl(e,t){return Em(e,t)}function Df(){}at(161,1,{},Df);H.compare=function(t,r){return Kl(t,r)};var Ff=!1;function km(){if(Ff)return;Ff=!0;let e,t;for(Ws=["U  ","U2 ","U' ","R  ","R2 ","R' ","F  ","F2 ","F' ","D  ","D2 ","D' ","L  ","L2 ","L' ","B  ","B2 ","B' ","Uw ","Uw2","Uw'","Rw ","Rw2","Rw'","Fw ","Fw2","Fw'","Dw ","Dw2","Dw'","Lw ","Lw2","Lw'","Bw ","Bw2","Bw'"],Cr=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,21,22,23,25,28,30,31,32,34,36],Fo=[0,1,2,4,6,7,8,9,10,11,13,15,16,17,19,22,25,28,31,34,36],yf=T(37),Bf=T(37),En=T(37,36),Vl=T(29,28),Hl=T(21,20),Qs=T(36),yo=T(28),kn=T(20),e=0;e<29;++e)yf[Cr[e]]=e;for(e=0;e<21;++e)Bf[Fo[e]]=e;for(e=0;e<36;++e){for(t=0;t<36;++t)En[e][t]=~~(e/3)==~~(t/3)||~~(e/3)%3==~~(t/3)%3&&e>t;En[36][e]=!1}for(e=0;e<29;++e)for(t=0;t<28;++t)Vl[e][t]=En[Cr[e]][Cr[t]];for(e=0;e<21;++e)for(t=0;t<20;++t)Hl[e][t]=En[Fo[e]][Fo[t]];for(e=0;e<36;++e)for(Qs[e]=36,t=e;t<36;++t)if(!En[e][t]){Qs[e]=t-1;break}for(e=0;e<28;++e)for(yo[e]=28,t=e;t<28;++t)if(!Vl[e][t]){yo[e]=t-1;break}for(e=0;e<20;++e)for(kn[e]=20,t=e;t<20;++t)if(!Hl[e][t]){kn[e]=t-1;break}}var En,Vl,Hl,Cr,Ws,Fo,Qs,yo,kn,yf,Bf;function zm(e){let t,r,n,o,l,i,s,u,a,f,g,c;e.solution="";let m=Ul(new kl(mr(e.c),0)),L=Ul(new kl(mr(e.c),1)),p=Ul(new kl(mr(e.c),2)),F=xt[~~m>>6],y=xt[~~L>>6],x=xt[~~p>>6];for(e.p1SolsCnt=0,e.arr2idx=0,Om(e.p1sols.heap),e.length1=(F<y?F:y)<x?F<y?F:y:x;e.length1<100&&!(x<=e.length1&&Yl(e,~~p>>>6,p&63,e.length1,-1,0)||F<=e.length1&&Yl(e,~~m>>>6,m&63,e.length1,-1,0)||y<=e.length1&&Yl(e,~~L>>>6,L&63,e.length1,-1,0));++e.length1);let B=Jm(e.p1sols,Bs(ep,fr([qc,Fs,ys]),Mu,0,0));B.sort(function(K,te){return K.value-te.value}),t=9;do{e:for(u=B[0].value;u<100;++u)for(i=0;i<B.length&&!(B[i].value>u);++i)if(!(u-B[i].length1>t)&&(Un(e.c1,B[i]),ju(e.ct2,mr(e.c1),Zl(Do(e.c1).ep)),g=Pl(e.ct2),c=Ml(e.ct2),e.length1=B[i].length1,e.length2=u-B[i].length1,bf(e,g,c,e.length2,28,0)))break e;++t}while(u===100);e.arr2.sort(function(K,te){return K.value-te.value}),s=0,r=13;do{e:for(a=e.arr2[0].value;a<100;++a)for(i=0;i<Math.min(e.arr2idx,100)&&!(e.arr2[i].value>a);++i)if(!(a-e.arr2[i].length1-e.arr2[i].length2>r)&&(l=ff(e.e12,Do(e.arr2[i])),Ju(e.ct3,mr(e.arr2[i]),l^Zl(Af(e.arr2[i]).cp)),n=Es(e.ct3),o=xn(e.e12,10),f=cf(af(e.e12)),f<=a-e.arr2[i].length1-e.arr2[i].length2&&xf(e,o,n,f,a-e.arr2[i].length1-e.arr2[i].length2,20,0))){s=i;break e}++r}while(a===100);let P=new jl(e.arr2[s]);e.length1=P.length1,e.length2=P.length2;let k=a-e.length1-e.length2;for(i=0;i<k;++i)zr(P,Fo[e.move3[i]]);e.solution=Um(P)}function Cm(e,t){let r,n;for(Un(e.c1,e.c),r=0;r<e.length1;++r)zr(e.c1,e.move1[r]);switch(ws[t]){case 0:zr(e.c1,24),zr(e.c1,35),e.move1[e.length1]=24,e.move1[e.length1+1]=35,e.add1=!0,t=19;break;case 12869:zr(e.c1,18),zr(e.c1,29),e.move1[e.length1]=18,e.move1[e.length1+1]=29,e.add1=!0,t=34;break;case 735470:e.add1=!1,t=0}ju(e.ct2,mr(e.c1),Zl(Do(e.c1).ep));let o=Pl(e.ct2),l=Ml(e.ct2),i=Ve[o*70+l];return e.c1.value=i+e.length1,e.c1.length1=e.length1,e.c1.add1=e.add1,e.c1.sym=t,++e.p1SolsCnt,e.p1sols.heap.size<500?n=new jl(e.c1):(n=Zm(e.p1sols),n.value>e.c1.value&&Un(n,e.c1)),Tm(e.p1sols,n),e.p1SolsCnt===1e4}function Pm(e){let t;for(Un(e.c2,e.c1),t=0;t<e.length2;++t)zr(e.c2,e.move2[t]);if(!bm(Do(e.c2)))return!1;let r=ff(e.e12,Do(e.c2));Ju(e.ct3,mr(e.c2),r^Zl(Af(e.c2).cp));let n=Es(e.ct3);xn(e.e12,10);let o=cf(af(e.e12));return e.arr2[e.arr2idx]?Un(e.arr2[e.arr2idx],e.c2):e.arr2[e.arr2idx]=new jl(e.c2),e.arr2[e.arr2idx].value=e.length1+e.length2+Math.max(o,gr[n]),e.arr2[e.arr2idx].length2=e.length2,++e.arr2idx,e.arr2idx===e.arr2.length}function Mm(e,t){return vf(),e.c=new Rf(t),zm(e),e.solution}function Yl(e,t,r,n,o,l){let i,s,u,a,f,g;if(t===0)return n===0&&Cm(e,r);for(i=0;i<27;i+=3)if(!(i===o||i===o-9||i===o-18))for(a=0;a<3;++a){if(u=i+a,s=zl[t][St[r][u]],f=xt[~~s>>>6],f>=n){if(f>n)break;continue}if(g=Fn[r][s&63],s>>>=6,e.move1[l]=u,Yl(e,s,g,n-1,i,l+1))return!0}return!1}function bf(e,t,r,n,o,l){let i,s,u,a;if(t===0&&Ve[r]===0)return n===0&&Pm(e);for(s=0;s<23;++s){if(Vl[o][s]){s=yo[s];continue}if(i=Il[t][s],a=Gl[r][s],u=Ve[i*70+a],u>=n){u>n&&(s=yo[s]);continue}if(e.move2[l]=Cr[s],bf(e,i,a,n-1,s,l+1))return!0}return!1}function xf(e,t,r,n,o,l,i){let s,u,a,f,g,c,m,L,p;if(o===0)return t===0&&r===0;for(Ao(e.tempe[i],t),g=0;g<17;++g){if(Hl[l][g]){g=kn[g];continue}if(a=ho[r][g],c=gr[a],c>=o){c>o&&g<14&&(g=kn[g]);continue}if(f=vn(e.tempe[i].edge,g<<3,10),s=~~(f/20160),L=wn[s],p=L&7,L>>=3,u=vn(e.tempe[i].edge,g<<3|p,10)%20160,m=Dm(L*20160+u,n),m>=o){m>o&&g<14&&(g=kn[g]);continue}if(xf(e,f,a,m,o-1,g,i+1))return e.move3[i]=g,!0}return!1}function Sf(){let e;for(this.p1sols=new Mf(new Df),this.move1=T(15),this.move2=T(20),this.move3=T(20),this.c1=new ql,this.c2=new ql,this.ct2=new Us,this.ct3=new ks,this.e12=new Ht,this.tempe=T(20),this.arr2=T(100),e=0;e<20;++e)this.tempe[e]=new Ht}function vf(){wf||(nm(),Rn=T(735471),om(),em(),Rn=null,tm(),sm(),gm(),Fm(),ym(),Rm(),wf=!0)}at(163,1,fr([Kc]),Sf);H.add1=!1;H.arr2idx=0;H.c=null;H.length1=0;H.length2=0;H.p1SolsCnt=0;H.solution="";var wf=!1,Uf=!1;function Im(){Uf||(Uf=!0)}function Zl(e){let t,r,n,o;for(o=0,t=0,n=e.length;t<n;++t)for(r=t;r<n;++r)e[t]>e[r]&&(o^=1);return o}function A(e,t,r,n,o,l){let i;switch(l){case 0:i=e[o],e[o]=e[n],e[n]=e[r],e[r]=e[t],e[t]=i;return;case 1:i=e[t],e[t]=e[n],e[n]=i,i=e[r],e[r]=e[o],e[o]=i;return;case 2:i=e[t],e[t]=e[r],e[r]=e[n],e[n]=e[o],e[o]=i;return}}function Ef(){}function kf(e,t,r,n){let o=new Ef;return o.typeName=e+t,Cf(r!==0?-r:0)&&Pf(r!==0?-r:0,o),o.modifiers=4,o.superclass=qs,o.componentType=n,o}function zf(e,t,r,n){let o=new Ef;return o.typeName=e+t,Cf(r)&&Pf(r,o),o.superclass=n,o}function Gm(e){let t=mo[e.seedId];return e=null,t}function Cf(e){return typeof e=="number"&&e>0}function Pf(e,t){let r;if(t.seedId=e,e===2)r=String.prototype;else if(e>0){let n=Gm(t);if(n)r=n.prototype;else{n=mo[e]=function(){},n.___clazz$=t;return}}else return;r.___clazz$=t}H.val$outerIter=null;function Tm(e,t){if(Ym(e,t))return!0}function Nm(e){e.array=Bs(If,fr([Fs,ys]),Cu,0,0)}function _m(e,t){return vl(e.array,e.size++,t),!0}function Om(e){e.array=Bs(If,fr([Fs,ys]),Cu,0,0),e.size=0}function pr(e,t){return e.array[t]}function Wm(e,t){let r=e.array[t];return jm(e.array,t,1),--e.size,r}function zn(e,t,r){let n=e.array[t];return vl(e.array,t,r),n}function Qm(e,t){let r;for(t.length<e.size&&(t=Hc(t,e.size)),r=0;r<e.size;++r)vl(t,r,e.array[r]);return t.length>e.size&&vl(t,e.size,null),t}function qm(){Nm(this),this.array.length=500}function jm(e,t,r){e.splice(t,r)}H.size=0;function Km(e,t){let r,n,o,l;for(n=0,r=e.length-1;n<=r;)if(o=n+(~~(r-n)>>1),l=e[o],l<t)n=o+1;else if(l>t)r=o-1;else return o;return-n-1}function Xl(e){Vm(e,e.length)}function Vm(e,t){let r;for(r=0;r<t;++r)e[r]=-1}function Hm(e,t){let r,n,o,l,i=e.heap.size,s=pr(e.heap,t);for(;t*2+1<i&&(r=(n=2*t+1,o=n+1,l=n,o<i&&Kl(pr(e.heap,o),pr(e.heap,n))<0&&(l=o),l),!(Kl(s,pr(e.heap,r))<0));)zn(e.heap,t,pr(e.heap,r)),t=r;zn(e.heap,t,s)}function Ym(e,t){let r,n;for(n=e.heap.size,_m(e.heap,t);n>0;){if(r=n,n=~~((n-1)/2),Kl(pr(e.heap,n),t)<=0)return zn(e.heap,r,t),!0;zn(e.heap,r,pr(e.heap,n))}return zn(e.heap,n,t),!0}function Zm(e){if(e.heap.size===0)return null;let t=pr(e.heap,0);return Xm(e),t}function Xm(e){let t=Wm(e.heap,e.heap.size-1);0<e.heap.size&&(zn(e.heap,0,t),Hm(e,0))}function Jm(e,t){return Qm(e.heap,t)}function Mf(e){this.heap=new qm,this.cmp=e}at(239,1,{},Mf);H.cmp=null;H.heap=null;var qs=zf("java.lang.","Object",1,null),If=kf("[Ljava.lang.","Object;",356,qs),$m=zf("cs.threephase.","FullCube",160,qs),ep=kf("[Lcs.threephase.","FullCube;",381,$m),Gf,Tf=!1;function Nf(){Tf||(Tf=!0,km(),Im(),$c(),im(),am(),Am(),pm(),Bm(),vm(),Gf=new Sf)}function js(){Nf(),vf()}function Bo(){return h(this,null,function*(){$e(),Nf();let e=z.fromString(Mm(Gf,yield st()));return(yield An()).concat(e)})}var tp=[[null,"x","x2","x'","z","z'"],[null,"y","y2","y'"]];function _f(){return h(this,null,function*(){return ln(yield Bo(),tp)})}Hs();var op=2,Qf=null;function lp(){return h(this,null,function*(){return Qf||(Qf=(()=>h(this,null,function*(){let t=yield(yield Promise.resolve().then(()=>(Hs(),Wf))).cachedSGSDataMegaminx();return new Ft(yield Jl(),t,["U","R","F","L","BR","BL","FR","FL","DR","DL","B","D"])}))())})}function qf(e){return h(this,null,function*(){$e();let t=yield lp(),r=JSON.parse(JSON.stringify(e));return r.CENTERS.orientation=new Array(12).fill(0),yield t.solve(r,op,()=>5)})}rn();Xs();var sp=3,Vf=null;function ap(){return h(this,null,function*(){return Vf||(Vf=(()=>h(this,null,function*(){let t=yield(yield Promise.resolve().then(()=>(Xs(),Kf))).sgsDataPyraminx();return new Ft(yield zt.pyraminx.def(),t,"RLUB".split(""))}))())})}function Js(e){return h(this,null,function*(){return $e(),yield(yield ap()).solve(e,sp,()=>3)})}function up(){return h(this,null,function*(){return nn(yield zt.pyraminx.def(),yield Zs())})}function Hf(){return h(this,null,function*(){return Js(yield up())})}ra();var cp=3,Xf=null;function mp(){return h(this,null,function*(){return Xf||(Xf=(()=>h(this,null,function*(){let e=yield Promise.resolve().then(()=>(ra(),Zf)),t=yield e.sgsDataSkewb();return new Ft(yield e.skewbDefWithoutMOCached(),t,"RLUB".split(""))}))())})}function pp(e){return{CORNERS:e.CORNERS,CENTERS:{permutation:e.CENTERS.permutation,orientation:new Array(6).fill(0)}}}function na(e){return h(this,null,function*(){return $e(),yield(yield mp()).solve(pp(e),cp,n=>n.family==="y"?4:3)})}function dp(){return h(this,null,function*(){return nn(yield $l(),yield ta())})}function Jf(){return h(this,null,function*(){return na(yield dp())})}he();function Lp(e){switch(e){case 5:return 60;case 6:return 80;default:return 100}}var hp=[["U","D"],["L","R"],["F","B"]],$f=new Map;function Ap(e){let t=$f.get(e);if(t)return t;let r=[];for(let n of hp){let o=[];r.push(o);for(let l of n){o.push(new G(l)),e>3&&o.push(new G(\`\${l}w\`));for(let i=3;i<=e/2;i++)o.push(new G(\`\${l}w\`,i))}}return $f.set(e,r),r}function Yt(e){return h(this,null,function*(){let t=yield st(),r=yield Wt(),n=r,o=Ap(e),l=Lp(e),i=new ut,s=0,u=new Set;for(;i.experimentalNumUnits()<l;){let a=t(3);a!==s&&u.clear(),s=a;let f=r(o[s]),g=f.toString();u.has(g)||(u.add(g),i.push(new d(f,n([1,2,-1]))))}return i.toAlg()})}var Rp=[[null,"3Rw","3Rw2","3Rw'","3Fw","3Fw'"],[null,"3Dw","3Dw2","3Dw'"]];function e1(){return h(this,null,function*(){return ln(yield Yt(5),Rp)})}he();function Dp(e,t){e.ul=t.ul,e.ur=t.ur,e.dl=t.dl,e.dr=t.dr,e.ml=t.ml}function t1(e,t){var r;t<<=2,t>24?(t=48-t,r=e.ul,e.ul=(~~e.ul>>t|e.ur<<24-t)&16777215,e.ur=(~~e.ur>>t|r<<24-t)&16777215):t>0?(r=e.ul,e.ul=(e.ul<<t|~~e.ur>>24-t)&16777215,e.ur=(e.ur<<t|~~r>>24-t)&16777215):t==0?(r=e.ur,e.ur=e.dl,e.dl=r,e.ml=1-e.ml):t>=-24?(t=-t,r=e.dl,e.dl=(e.dl<<t|~~e.dr>>24-t)&16777215,e.dr=(e.dr<<t|~~r>>24-t)&16777215):t<-24&&(t=48+t,r=e.dl,e.dl=(~~e.dl>>t|e.dr<<24-t)&16777215,e.dr=(~~e.dr>>t|r<<24-t)&16777215)}function Fp(e){var t,r,n,o,l;for(n=0,e.arr[0]=Mt(e,0),o=1;o<24;++o)Mt(e,o)!=e.arr[n]&&(e.arr[++n]=Mt(e,o));for(l=0,t=0;t<16;++t)for(r=t+1;r<16;++r)e.arr[t]>e.arr[r]&&(l^=1);return l}function yp(e){var t,r,n,o;return o=e.ur&1118481,o|=~~o>>3,o|=~~o>>6,o=o&15|~~o>>12&48,n=e.ul&1118481,n|=~~n>>3,n|=~~n>>6,n=n&15|~~n>>12&48,r=e.dr&1118481,r|=~~r>>3,r|=~~r>>6,r=r&15|~~r>>12&48,t=e.dl&1118481,t|=~~t>>3,t|=~~t>>6,t=t&15|~~t>>12&48,bo(Fp(e)<<24|n<<18|o<<12|t<<6|r)}function Bp(e,t){var r,n;for(r=0;r<8;++r)e.prm[r]=~~(~~Mt(e,r*3+1)>>1<<24)>>24;for(t.cornperm=wo(e.prm),t.topEdgeFirst=Mt(e,0)==Mt(e,1),r=t.topEdgeFirst?2:0,n=0;n<4;r+=3,++n)e.prm[n]=~~(~~Mt(e,r)>>1<<24)>>24;for(t.botEdgeFirst=Mt(e,12)==Mt(e,13),r=t.botEdgeFirst?14:12;n<8;r+=3,++n)e.prm[n]=~~(~~Mt(e,r)>>1<<24)>>24;t.edgeperm=wo(e.prm),t.ml=e.ml}function Mt(e,t){var r;return t<6?r=~~e.ul>>(5-t<<2):t<12?r=~~e.ur>>(11-t<<2):t<18?r=~~e.dl>>(17-t<<2):r=~~e.dr>>(23-t<<2),~~((r&15)<<24)>>24}function oa(e,t,r){t<6?(e.ul&=~(15<<(5-t<<2)),e.ul|=r<<(5-t<<2)):t<12?(e.ur&=~(15<<(11-t<<2)),e.ur|=r<<(11-t<<2)):t<18?(e.dl&=~(15<<(17-t<<2)),e.dl|=r<<(17-t<<2)):(e.dr&=~(15<<(23-t<<2)),e.dr|=r<<(23-t<<2))}function la(){this.arr=[],this.prm=[]}function bp(){return h(this,null,function*(){let e=yield st();var t,r,n,o,l,i,s,u,a;for(t=new la,n=Cn[e(3678)],l=19088743<<1|286331153,o=19088743<<1,s=i=8,r=0;r<24;r++)(n>>r&1)==0?(u=e(i)<<2,oa(t,23-r,o>>u&15),a=(1<<u)-1,o=(o&a)+(o>>4&~a),--i):(u=e(s)<<2,oa(t,23-r,l>>u&15),oa(t,22-r,l>>u&15),a=(1<<u)-1,l=(l&a)+(l>>4&~a),--s,++r);return t.ml=e(2),t})}function xp(){}var be=la.prototype=xp.prototype;be.dl=10062778;be.dr=14536702;be.ml=0;be.ul=70195;be.ur=4544119;function Sp(e){var t,r,n,o,l,i;for(Dp(e.Search_d,e.Search_c),n=0;n<e.Search_length1;++n)t1(e.Search_d,e.Search_move[n]);for(Bp(e.Search_d,e.Search_sq),r=e.Search_sq.edgeperm,t=e.Search_sq.cornperm,l=e.Search_sq.ml,i=Math.max(De[e.Search_sq.edgeperm<<1|l],De[e.Search_sq.cornperm<<1|l]),n=i;n<e.Search_maxlen2;++n)if(ti(e,r,t,e.Search_sq.topEdgeFirst,e.Search_sq.botEdgeFirst,l,n,e.Search_length1,0)){for(o=0;o<n;++o)t1(e.Search_d,e.Search_move[e.Search_length1+o]);return e.Search_sol_string=vp(e,n+e.Search_length1),!0}return!1}function vp(e,t){for(var r="",n=0,o=0,l=t-1;l>=0;l--){var i=e.Search_move[l];i>0?(i=12-i,n=i>6?i-12:i):i<0?(i=12+i,o=i>6?i-12:i):(n==0&&o==0?r+=" / ":r+="("+n+", "+o+") / ",n=o=0)}return(n!==0||o!==0)&&(r+="("+n+", "+o+")"),r}function ei(e,t,r,n,o,l){var i,s,u;if(r==0&&n<4)return n==0&&Sp(e);if(l!=0&&(u=ri[t],s=Ue[u],s<n&&(e.Search_move[o]=0,ei(e,u,s,n-1,o+1,0))))return!0;if(u=t,l<=0){for(i=0;i+=So[u],u=~~i>>4,i&=15,!(i>=12||(s=Ue[u],s>n));)if(s<n&&(e.Search_move[o]=i,ei(e,u,s,n-1,o+1,1)))return!0}if(u=t,l<=1){for(i=0;i+=xo[u],u=~~i>>4,i&=15,!(i>=6||(s=Ue[u],s>n));)if(s<n&&(e.Search_move[o]=-i,ei(e,u,s,n-1,o+1,2)))return!0}return!1}function ti(e,t,r,n,o,l,i,s,u){var a,f,g,c,m,L,p;if(i==0&&!n&&o||u!=0&&n==o&&(g=Uo[t],f=Uo[r],De[g<<1|1-l]<i&&De[f<<1|1-l]<i&&(e.Search_move[s]=0,ti(e,g,f,n,o,1-l,i-1,s+1,0))))return!0;if(u<=0)for(p=!n,g=p?Ir[t]:t,f=p?r:Ir[r],c=p?1:2,m=De[g<<1|l],L=De[f<<1|l];c<12&&m<=i&&m<=i;){if(m<i&&L<i&&(e.Search_move[s]=c,ti(e,g,f,p,o,l,i-1,s+1,1)))return!0;p=!p,p?(g=Ir[g],m=De[g<<1|l],c+=1):(f=Ir[f],L=De[f<<1|l],c+=2)}if(u<=1)for(a=!o,g=a?Pr[t]:t,f=a?r:Pr[r],c=a?1:2,m=De[g<<1|l],L=De[f<<1|l];c<(i>3?6:12)&&m<=i&&m<=i;){if(m<i&&L<i&&(e.Search_move[s]=-c,ti(e,g,f,n,a,l,i-1,s+1,2)))return!0;a=!a,a?(g=Pr[g],m=De[g<<1|l],c+=1):(f=Pr[f],L=De[f<<1|l],c+=2)}return!1}function wp(e,t){var r;for(e.Search_c=t,r=yp(t),e.Search_length1=Ue[r];e.Search_length1<100&&(e.Search_maxlen2=Math.min(31-e.Search_length1,17),!ei(e,r,Ue[r],e.Search_length1,0,-1));++e.Search_length1);return e.Search_sol_string}function r1(){this.Search_move=[],this.Search_d=new la,this.Search_sq=new i1}function Up(){}be=r1.prototype=Up.prototype;be.Search_c=null;be.Search_length1=0;be.Search_maxlen2=0;be.Search_sol_string=null;var n1=!1;function Ep(){n1||(n1=!0,vo=[0,3,6,12,15,24,27,30,48,51,54,60,63],Cn=[],Ue=[],So=[],xo=[],ri=[],Cp())}function kp(e){var t,r;t=0,r=0;do(e.bottom&2048)==0?(t+=1,e.bottom=e.bottom<<1):(t+=2,e.bottom=e.bottom<<2^12291),r=1-r;while((Gr(e.bottom&63)&1)!=0);return(Gr(e.bottom)&2)==0&&(e.Shape_parity^=r),t}function ia(e){var t;return t=a1(Cn,e.top<<12|e.bottom)<<1|e.Shape_parity,t}function sa(e,t){e.Shape_parity=t&1,e.top=Cn[~~t>>1],e.bottom=e.top&4095,e.top>>=12}function zp(e){var t,r;t=0,r=0;do(e.top&2048)==0?(t+=1,e.top=e.top<<1):(t+=2,e.top=e.top<<2^12291),r=1-r;while((Gr(e.top&63)&1)!=0);return(Gr(e.top)&2)==0&&(e.Shape_parity^=r),t}function o1(){}function bo(e){var t;return t=a1(Cn,e&16777215)<<1|~~e>>24,t}function Cp(){var e,t,r,n,o,l,i,s,u,a,f,g,c,m,L,p;for(e=0,i=0;i<28561;++i)l=vo[i%13],r=vo[~~(i/13)%13],g=vo[~~(~~(i/13)/13)%13],f=vo[~~(~~(~~(i/13)/13)/13)],c=f<<18|g<<12|r<<6|l,Gr(c)==16&&(Cn[e++]=c);for(a=new o1,i=0;i<7356;++i)sa(a,i),So[i]=zp(a),So[i]|=ia(a)<<4,sa(a,i),xo[i]=kp(a),xo[i]|=ia(a)<<4,sa(a,i),p=a.top&63,m=Gr(p),L=Gr(a.bottom&4032),a.Shape_parity^=1&~~(m&L)>>1,a.top=a.top&4032|~~a.bottom>>6&63,a.bottom=a.bottom&63|p<<6,ri[i]=ia(a);for(i=0;i<7536;++i)Ue[i]=-1;for(Ue[bo(14378715)]=0,Ue[bo(31157686)]=0,Ue[bo(23967451)]=0,Ue[bo(7191990)]=0,n=4,o=0,t=-1;n!=o;)for(o=n,++t,i=0;i<7536;++i)if(Ue[i]==t){u=0,s=i;do s=So[s],u+=s&15,s>>=4,Ue[s]==-1&&(++n,Ue[s]=t+1);while(u!=12);u=0,s=i;do s=xo[s],u+=s&15,s>>=4,Ue[s]==-1&&(++n,Ue[s]=t+1);while(u!=12);s=ri[i],Ue[s]==-1&&(++n,Ue[s]=t+1)}}function Pp(){}be=o1.prototype=Pp.prototype;be.bottom=0;be.Shape_parity=0;be.top=0;var xo,Cn,Ue,So,ri,vo,l1=!1;function Mp(){if(!l1){l1=!0,De=[],Uo=[],Ir=[],Pr=[],s1=[1,1,2,6,24,120,720,5040],Mr=[];for(var e=0;e<12;++e)Mr[e]=[];Ip()}}function i1(){}function wo(e){var t,r,n,o;for(r=0,o=1985229328,t=0;t<7;++t)n=e[t]<<2,r=(8-t)*r+(~~o>>n&7),o-=286331152<<n;return r&65535}function Ip(){var e,t,r,n,o,l,i,s,u,a,f,g,c;for(o=0;o<12;++o)for(Mr[o][0]=1,Mr[o][o]=1,u=1;u<o;++u)Mr[o][u]=Mr[o-1][u-1]+Mr[o-1][u];for(g=[],o=0;o<40320;++o)aa(g,o),c=g[2],g[2]=g[4],g[4]=c,c=g[3],g[3]=g[5],g[5]=c,Uo[o]=wo(g),aa(g,o),c=g[0],g[0]=g[1],g[1]=g[2],g[2]=g[3],g[3]=c,Ir[o]=wo(g),aa(g,o),c=g[4],g[4]=g[5],g[5]=g[6],g[6]=g[7],g[7]=c,Pr[o]=wo(g);for(o=0;o<80640;++o)De[o]=-1;for(De[0]=0,t=0,r=1;r<80640;){s=t>=11,n=s?-1:t,e=s?t:-1,++t;e:for(o=0;o<80640;++o)if(De[o]==n){if(l=~~o>>1,f=o&1,i=Uo[l]<<1|1-f,De[i]==e&&(++r,De[s?o:i]=~~(t<<24)>>24,s))continue e;for(i=l,a=0;a<4;++a)if(i=Ir[i],De[i<<1|f]==e&&(++r,De[s?o:i<<1|f]=~~(t<<24)>>24,s))continue e;for(a=0;a<4;++a)if(i=Pr[i],De[i<<1|f]==e&&(++r,De[s?o:i<<1|f]=~~(t<<24)>>24,s))continue e}}}function aa(e,t){var r,n,o,l,i;for(i=1985229328,r=0;r<7;++r)o=s1[7-r],l=~~(t/o),t-=l*o,l<<=2,e[r]=~~((~~i>>l&7)<<24)>>24,n=(1<<l)-1,i=(i&n)+(~~i>>4&~n);e[7]=~~(i<<24)>>24}function Gp(){}be=i1.prototype=Gp.prototype;be.botEdgeFirst=!1;be.cornperm=0;be.edgeperm=0;be.ml=0;be.topEdgeFirst=!1;var Pr,Mr,De,Ir,Uo,s1;function Gr(e){return e-=~~e>>1&1431655765,e=(~~e>>2&858993459)+(e&858993459),e=(~~e>>4)+e&252645135,e+=~~e>>8,e+=~~e>>16,e&63}function a1(e,t){var r,n,o,l;for(n=0,r=e.length-1;n<=r;)if(o=n+(~~(r-n)>>1),l=e[o],l<t)n=o+1;else if(l>t)r=o-1;else return o;return-n-1}var ua=!1,Tp=function(e,t,r){ua||(Ep(),Mp()),r&&r("Done initializing Square-1."),ua=!0,e!=null&&e()},Np=function(){return h(this,null,function*(){return ua||Tp(),bp()})},_p=function(e){var t=new r1;return wp(t,e)},Op=function(){return h(this,null,function*(){var e=yield Np(),t=_p(e);return{state:e,scramble_string:t}})};function u1(){return h(this,null,function*(){return(yield Op()).scramble_string})}function f1(){return h(this,null,function*(){return z.fromString(yield u1())})}var qp=3,c1=null;function jp(){return h(this,null,function*(){return c1||(c1=(()=>h(this,null,function*(){let e=yield Promise.resolve().then(()=>(ca(),ga)),t=yield e.sgsDataFTO();return new Ft(yield e.ftoDef(),t,["U","R","F","L","D","B","BR","BL"])}))())})}function Kp(e){return h(this,null,function*(){return $e(),yield(yield jp()).solve(e,qp,()=>3)})}var m1=!1;function p1(){return h(this,null,function*(){m1||(console.warn("FTO scrambles are not yet optimized. They may be much too long (\\u224890 moves)."),m1=!0);let e=yield Promise.resolve().then(()=>(ca(),ga));return Kp(yield nn(yield e.ftoDef(),yield e.sgsDataFTO()))})}w2(!0);var d1=!0;function Vp(e){d1=e}function L1(){return(typeof performance=="undefined"?Date:performance).now()}function Ne(e,t){return h(this,null,function*(){if(!d1)return t();let r=L1(),n=t();(n==null?void 0:n.then)&&(yield n);let o=L1();return console.warn(\`\${e}: \${Math.round(o-r)}ms\`),n})}var ma={initialize:e=>h(void 0,null,function*(){switch(e){case"222":return Ne("preInitialize222",O2);case"333":case"333oh":case"333ft":return Ne("initialize333",wu);case"444":return Ne("initialize444",js);default:throw new Error(\`unsupported event: \${e}\`)}}),randomScrambleForEvent:e=>h(void 0,null,function*(){switch(e){case"222":return Ne("random222Scramble",W2);case"333":case"333oh":case"333ft":return Ne("random333Scramble",An);case"333fm":return Ne("random333FewestMovesScramble",ku);case"333bf":case"333mb":return Ne("random333OrientedScramble",Uu);case"444":return Ne("random444Scramble",Bo);case"444bf":return Ne("random444OrientedScramble",_f);case"555":return Ne("bigCubeScramble(5)",Yt.bind(Yt,5));case"555bf":return Ne("oriented555RandomMoves",e1);case"666":return Ne("bigCubeScramble(6)",Yt.bind(Yt,6));case"777":return Ne("bigCubeScramble(7)",Yt.bind(Yt,7));case"skewb":return Ne("randomSkewbFixedCornerScramble",Jf);case"pyram":return Ne("randomPyraminxScrambleFixedOrientation",Hf);case"sq1":return Ne("getRandomSquare1Scramble",f1);case"fto":return Ne("randomFTOScramble",p1);default:throw new Error(\`unsupported event: \${e}\`)}}),randomScrambleStringForEvent:e=>h(void 0,null,function*(){return(yield ma.randomScrambleForEvent(e)).toString()}),solve333ToString:e=>h(void 0,null,function*(){return(yield Rs(e)).toString()}),solve222ToString:e=>h(void 0,null,function*(){return(yield Yi(e)).toString()}),solveSkewbToString:e=>h(void 0,null,function*(){return(yield na(e)).toString()}),solvePyraminxToString:e=>h(void 0,null,function*(){return(yield Js(e)).toString()}),solveMegaminxToString:e=>h(void 0,null,function*(){return(yield qf(e)).toString()}),setDebugMeasurePerf:e=>h(void 0,null,function*(){Vp(e)})};va(ma);
`;
    }
  });

  // node_modules/cubing/dist/esm/chunk-X6JHXPDX.js
  init_chunk_EWRBHQFX();
  var lasto;
  function isIdentity(omod, o2) {
    if (o2 === lasto) {
      return true;
    }
    const perm = o2.permutation;
    const n = perm.length;
    for (let idx = 0; idx < n; idx++) {
      if (perm[idx] !== idx) {
        return false;
      }
    }
    if (omod > 1) {
      const ori = o2.orientation;
      for (let idx = 0; idx < n; idx++) {
        if (ori[idx] !== 0) {
          return false;
        }
      }
    }
    lasto = o2;
    return true;
  }
  function combineTransformations(def, t1, t2) {
    const newTrans = {};
    for (const orbitName in def.orbits) {
      const oDef = def.orbits[orbitName];
      const o1 = t1[orbitName];
      const o2 = t2[orbitName];
      if (isIdentity(oDef.orientations, o2)) {
        newTrans[orbitName] = o1;
      } else if (isIdentity(oDef.orientations, o1)) {
        newTrans[orbitName] = o2;
      } else {
        const newPerm = new Array(oDef.numPieces);
        if (oDef.orientations === 1) {
          for (let idx = 0; idx < oDef.numPieces; idx++) {
            newPerm[idx] = o1.permutation[o2.permutation[idx]];
          }
          newTrans[orbitName] = {
            permutation: newPerm,
            orientation: o1.orientation
          };
        } else {
          const newOri = new Array(oDef.numPieces);
          for (let idx = 0; idx < oDef.numPieces; idx++) {
            newOri[idx] = (o1.orientation[o2.permutation[idx]] + o2.orientation[idx]) % oDef.orientations;
            newPerm[idx] = o1.permutation[o2.permutation[idx]];
          }
          newTrans[orbitName] = { permutation: newPerm, orientation: newOri };
        }
      }
    }
    return newTrans;
  }
  function multiplyTransformations(def, t, amount) {
    if (amount < 0) {
      return multiplyTransformations(def, invertTransformation(def, t), -amount);
    }
    if (amount === 0) {
      return identityTransformation(def);
    }
    if (amount === 1) {
      return t;
    }
    let halfish = t;
    if (amount !== 2) {
      halfish = multiplyTransformations(def, t, Math.floor(amount / 2));
    }
    const twiceHalfish = combineTransformations(def, halfish, halfish);
    if (amount % 2 === 0) {
      return twiceHalfish;
    } else {
      return combineTransformations(def, t, twiceHalfish);
    }
  }
  function identityTransformation(definition) {
    const transformation = {};
    for (const orbitName in definition.orbits) {
      const orbitDefinition = definition.orbits[orbitName];
      if (!lasto || lasto.permutation.length !== orbitDefinition.numPieces) {
        const newPermutation = new Array(orbitDefinition.numPieces);
        const newOrientation = new Array(orbitDefinition.numPieces);
        for (let i2 = 0; i2 < orbitDefinition.numPieces; i2++) {
          newPermutation[i2] = i2;
          newOrientation[i2] = 0;
        }
        const orbitTransformation = {
          permutation: newPermutation,
          orientation: newOrientation
        };
        lasto = orbitTransformation;
      }
      transformation[orbitName] = lasto;
    }
    return transformation;
  }
  function invertTransformation(def, t) {
    const newTrans = {};
    for (const orbitName in def.orbits) {
      const oDef = def.orbits[orbitName];
      const o2 = t[orbitName];
      if (isIdentity(oDef.orientations, o2)) {
        newTrans[orbitName] = o2;
      } else if (oDef.orientations === 1) {
        const newPerm = new Array(oDef.numPieces);
        for (let idx = 0; idx < oDef.numPieces; idx++) {
          newPerm[o2.permutation[idx]] = idx;
        }
        newTrans[orbitName] = {
          permutation: newPerm,
          orientation: o2.orientation
        };
      } else {
        const newPerm = new Array(oDef.numPieces);
        const newOri = new Array(oDef.numPieces);
        for (let idx = 0; idx < oDef.numPieces; idx++) {
          const fromIdx = o2.permutation[idx];
          newPerm[fromIdx] = idx;
          newOri[fromIdx] = (oDef.orientations - o2.orientation[idx] + oDef.orientations) % oDef.orientations;
        }
        newTrans[orbitName] = { permutation: newPerm, orientation: newOri };
      }
    }
    return newTrans;
  }
  function transformationForMove(def, move) {
    const transformation = getNotationLayer(def).lookupMove(move);
    if (!transformation) {
      throw new Error("Unknown move: " + move.toString());
    }
    return transformation;
  }
  function getNotationLayer(def) {
    if (!def.moveNotation) {
      def.moveNotation = new KPuzzleMoveNotation(def);
    }
    return def.moveNotation;
  }
  var KPuzzleMoveNotation = class {
    constructor(def) {
      this.def = def;
      this.cache = {};
    }
    lookupMove(move) {
      const key = move.toString();
      let r2 = this.cache[key];
      if (r2) {
        return r2;
      }
      const quantumKey = move.quantum.toString();
      r2 = this.def.moves[quantumKey];
      if (r2) {
        r2 = multiplyTransformations(this.def, r2, move.amount);
        this.cache[key] = r2;
      } else {
        r2 = this.def.moves[move.toString()];
        if (r2) {
          this.cache[key] = r2;
        } else {
          r2 = this.def.moves[move.invert().toString()];
          if (r2) {
            r2 = multiplyTransformations(this.def, r2, -1);
            this.cache[key] = r2;
          }
        }
      }
      return r2;
    }
  };
  var KPuzzle = class {
    constructor(definition) {
      this.definition = definition;
      this.state = identityTransformation(definition);
    }
    reset() {
      this.state = identityTransformation(this.definition);
    }
    serialize() {
      let output = "";
      for (const orbitName in this.definition.orbits) {
        output += orbitName + "\n";
        output += this.state[orbitName].permutation.join(" ") + "\n";
        output += this.state[orbitName].orientation.join(" ") + "\n";
      }
      output = output.slice(0, output.length - 1);
      return output;
    }
    applyMove(move) {
      this.state = combineTransformations(this.definition, this.state, transformationForMove(this.definition, move));
    }
    applyAlg(alg) {
      for (const move of alg.experimentalLeafMoves()) {
        this.applyMove(move);
      }
    }
  };
  function peg$subclass(child, parent) {
    function C() {
      this.constructor = child;
    }
    C.prototype = parent.prototype;
    child.prototype = new C();
  }
  function peg$SyntaxError(message, expected, found, location2) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location2;
    this.name = "SyntaxError";
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }
  peg$subclass(peg$SyntaxError, Error);
  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
      literal: function(expectation) {
        return '"' + literalEscape(expectation.text) + '"';
      },
      class: function(expectation) {
        var escapedParts = expectation.parts.map(function(part) {
          return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
        });
        return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
      },
      any: function() {
        return "any character";
      },
      end: function() {
        return "end of input";
      },
      other: function(expectation) {
        return expectation.description;
      }
    };
    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }
    function literalEscape(s) {
      return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
        return "\\x0" + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return "\\x" + hex(ch);
      });
    }
    function classEscape(s) {
      return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
        return "\\x0" + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
        return "\\x" + hex(ch);
      });
    }
    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected2) {
      var descriptions = expected2.map(describeExpectation);
      var i2, j;
      descriptions.sort();
      if (descriptions.length > 0) {
        for (i2 = 1, j = 1; i2 < descriptions.length; i2++) {
          if (descriptions[i2 - 1] !== descriptions[i2]) {
            descriptions[j] = descriptions[i2];
            j++;
          }
        }
        descriptions.length = j;
      }
      switch (descriptions.length) {
        case 1:
          return descriptions[0];
        case 2:
          return descriptions[0] + " or " + descriptions[1];
        default:
          return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
      }
    }
    function describeFound(found2) {
      return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };
  var cube3x3x3KPuzzle = {
    name: "3x3x3",
    orbits: {
      EDGES: { numPieces: 12, orientations: 2 },
      CORNERS: { numPieces: 8, orientations: 3 },
      CENTERS: { numPieces: 6, orientations: 4 }
    },
    startPieces: {
      EDGES: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      CORNERS: {
        permutation: [0, 1, 2, 3, 4, 5, 6, 7],
        orientation: [0, 0, 0, 0, 0, 0, 0, 0]
      },
      CENTERS: {
        permutation: [0, 1, 2, 3, 4, 5],
        orientation: [0, 0, 0, 0, 0, 0]
      }
    },
    moves: {
      U: {
        EDGES: {
          permutation: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [1, 2, 3, 0, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [1, 0, 0, 0, 0, 0]
        }
      },
      y: {
        EDGES: {
          permutation: [1, 2, 3, 0, 5, 6, 7, 4, 10, 8, 11, 9],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        },
        CORNERS: {
          permutation: [1, 2, 3, 0, 7, 4, 5, 6],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 2, 3, 4, 1, 5],
          orientation: [1, 0, 0, 0, 0, 3]
        }
      },
      x: {
        EDGES: {
          permutation: [4, 8, 0, 9, 6, 10, 2, 11, 5, 7, 1, 3],
          orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [4, 0, 3, 5, 7, 6, 2, 1],
          orientation: [2, 1, 2, 1, 1, 2, 1, 2]
        },
        CENTERS: {
          permutation: [2, 1, 5, 3, 0, 4],
          orientation: [0, 3, 0, 1, 2, 2]
        }
      },
      L: {
        EDGES: {
          permutation: [0, 1, 2, 11, 4, 5, 6, 9, 8, 3, 10, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [0, 1, 6, 2, 4, 3, 5, 7],
          orientation: [0, 0, 2, 1, 0, 2, 1, 0]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [0, 1, 0, 0, 0, 0]
        }
      },
      F: {
        EDGES: {
          permutation: [9, 1, 2, 3, 8, 5, 6, 7, 0, 4, 10, 11],
          orientation: [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0]
        },
        CORNERS: {
          permutation: [3, 1, 2, 5, 0, 4, 6, 7],
          orientation: [1, 0, 0, 2, 2, 1, 0, 0]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [0, 0, 1, 0, 0, 0]
        }
      },
      R: {
        EDGES: {
          permutation: [0, 8, 2, 3, 4, 10, 6, 7, 5, 9, 1, 11],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [4, 0, 2, 3, 7, 5, 6, 1],
          orientation: [2, 1, 0, 0, 1, 0, 0, 2]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [0, 0, 0, 1, 0, 0]
        }
      },
      B: {
        EDGES: {
          permutation: [0, 1, 10, 3, 4, 5, 11, 7, 8, 9, 6, 2],
          orientation: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1]
        },
        CORNERS: {
          permutation: [0, 7, 1, 3, 4, 5, 2, 6],
          orientation: [0, 2, 1, 0, 0, 0, 2, 1]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [0, 0, 0, 0, 1, 0]
        }
      },
      D: {
        EDGES: {
          permutation: [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [0, 1, 2, 3, 5, 6, 7, 4],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 1, 2, 3, 4, 5],
          orientation: [0, 0, 0, 0, 0, 1]
        }
      },
      z: {
        EDGES: {
          permutation: [9, 3, 11, 7, 8, 1, 10, 5, 0, 4, 2, 6],
          orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        },
        CORNERS: {
          permutation: [3, 2, 6, 5, 0, 4, 7, 1],
          orientation: [1, 2, 1, 2, 2, 1, 2, 1]
        },
        CENTERS: {
          permutation: [1, 5, 2, 0, 4, 3],
          orientation: [1, 1, 1, 1, 3, 1]
        }
      },
      M: {
        EDGES: {
          permutation: [2, 1, 6, 3, 0, 5, 4, 7, 8, 9, 10, 11],
          orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [0, 1, 2, 3, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [4, 1, 0, 3, 5, 2],
          orientation: [2, 0, 0, 0, 2, 0]
        }
      },
      E: {
        EDGES: {
          permutation: [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 8, 10],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        },
        CORNERS: {
          permutation: [0, 1, 2, 3, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 4, 1, 2, 3, 5],
          orientation: [0, 0, 0, 0, 0, 0]
        }
      },
      S: {
        EDGES: {
          permutation: [0, 3, 2, 7, 4, 1, 6, 5, 8, 9, 10, 11],
          orientation: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [0, 1, 2, 3, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [1, 5, 2, 0, 4, 3],
          orientation: [1, 1, 0, 1, 0, 1]
        }
      },
      u: {
        EDGES: {
          permutation: [1, 2, 3, 0, 4, 5, 6, 7, 10, 8, 11, 9],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        },
        CORNERS: {
          permutation: [1, 2, 3, 0, 4, 5, 6, 7],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 2, 3, 4, 1, 5],
          orientation: [1, 0, 0, 0, 0, 0]
        }
      },
      l: {
        EDGES: {
          permutation: [2, 1, 6, 11, 0, 5, 4, 9, 8, 3, 10, 7],
          orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [0, 1, 6, 2, 4, 3, 5, 7],
          orientation: [0, 0, 2, 1, 0, 2, 1, 0]
        },
        CENTERS: {
          permutation: [4, 1, 0, 3, 5, 2],
          orientation: [2, 1, 0, 0, 2, 0]
        }
      },
      f: {
        EDGES: {
          permutation: [9, 3, 2, 7, 8, 1, 6, 5, 0, 4, 10, 11],
          orientation: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0]
        },
        CORNERS: {
          permutation: [3, 1, 2, 5, 0, 4, 6, 7],
          orientation: [1, 0, 0, 2, 2, 1, 0, 0]
        },
        CENTERS: {
          permutation: [1, 5, 2, 0, 4, 3],
          orientation: [1, 1, 1, 1, 0, 1]
        }
      },
      r: {
        EDGES: {
          permutation: [4, 8, 0, 3, 6, 10, 2, 7, 5, 9, 1, 11],
          orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
        },
        CORNERS: {
          permutation: [4, 0, 2, 3, 7, 5, 6, 1],
          orientation: [2, 1, 0, 0, 1, 0, 0, 2]
        },
        CENTERS: {
          permutation: [2, 1, 5, 3, 0, 4],
          orientation: [0, 0, 0, 1, 2, 2]
        }
      },
      b: {
        EDGES: {
          permutation: [0, 5, 10, 1, 4, 7, 11, 3, 8, 9, 6, 2],
          orientation: [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1]
        },
        CORNERS: {
          permutation: [0, 7, 1, 3, 4, 5, 2, 6],
          orientation: [0, 2, 1, 0, 0, 0, 2, 1]
        },
        CENTERS: {
          permutation: [3, 0, 2, 5, 4, 1],
          orientation: [3, 3, 0, 3, 1, 3]
        }
      },
      d: {
        EDGES: {
          permutation: [0, 1, 2, 3, 7, 4, 5, 6, 9, 11, 8, 10],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
        },
        CORNERS: {
          permutation: [0, 1, 2, 3, 5, 6, 7, 4],
          orientation: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        CENTERS: {
          permutation: [0, 4, 1, 2, 3, 5],
          orientation: [0, 0, 0, 0, 0, 1]
        }
      }
    }
  };
  cube3x3x3KPuzzle.moves["Uw"] = cube3x3x3KPuzzle.moves["u"];
  cube3x3x3KPuzzle.moves["Lw"] = cube3x3x3KPuzzle.moves["l"];
  cube3x3x3KPuzzle.moves["Fw"] = cube3x3x3KPuzzle.moves["f"];
  cube3x3x3KPuzzle.moves["Rw"] = cube3x3x3KPuzzle.moves["r"];
  cube3x3x3KPuzzle.moves["Bw"] = cube3x3x3KPuzzle.moves["b"];
  cube3x3x3KPuzzle.moves["Dw"] = cube3x3x3KPuzzle.moves["d"];
  cube3x3x3KPuzzle.moves["Rv"] = cube3x3x3KPuzzle.moves["x"];
  cube3x3x3KPuzzle.moves["Uv"] = cube3x3x3KPuzzle.moves["y"];
  cube3x3x3KPuzzle.moves["Fv"] = cube3x3x3KPuzzle.moves["z"];
  cube3x3x3KPuzzle.moves["Lv"] = {
    EDGES: {
      permutation: [2, 10, 6, 11, 0, 8, 4, 9, 1, 3, 5, 7],
      orientation: [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
    },
    CORNERS: {
      permutation: [1, 7, 6, 2, 0, 3, 5, 4],
      orientation: [2, 1, 2, 1, 1, 2, 1, 2]
    },
    CENTERS: {
      permutation: [4, 1, 0, 3, 5, 2],
      orientation: [2, 1, 0, 3, 2, 0]
    }
  };
  cube3x3x3KPuzzle.moves["Dv"] = {
    EDGES: {
      permutation: [3, 0, 1, 2, 7, 4, 5, 6, 9, 11, 8, 10],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
    },
    CORNERS: {
      permutation: [3, 0, 1, 2, 5, 6, 7, 4],
      orientation: [0, 0, 0, 0, 0, 0, 0, 0]
    },
    CENTERS: {
      permutation: [0, 4, 1, 2, 3, 5],
      orientation: [3, 0, 0, 0, 0, 1]
    }
  };
  cube3x3x3KPuzzle.moves["Bv"] = {
    EDGES: {
      permutation: [8, 5, 10, 1, 9, 7, 11, 3, 4, 0, 6, 2],
      orientation: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    CORNERS: {
      permutation: [4, 7, 1, 0, 5, 3, 2, 6],
      orientation: [1, 2, 1, 2, 2, 1, 2, 1]
    },
    CENTERS: {
      permutation: [3, 0, 2, 5, 4, 1],
      orientation: [3, 3, 3, 3, 1, 3]
    }
  };
  function puzzleOrientationIdx(state) {
    const idxU = state["CENTERS"].permutation[0];
    const idxD = state["CENTERS"].permutation[5];
    const unadjustedIdxL = state["CENTERS"].permutation[1];
    let idxL = unadjustedIdxL;
    if (idxU < unadjustedIdxL) {
      idxL--;
    }
    if (idxD < unadjustedIdxL) {
      idxL--;
    }
    return [idxU, idxL];
  }
  var puzzleOrientationCache = new Array(6).fill(0).map(() => {
    return new Array(6);
  });
  {
    const orientationKpuzzle = new KPuzzle(cube3x3x3KPuzzle);
    const uAlgs = ["", "z", "x", "z'", "x'", "x2"].map((s) => Alg.fromString(s));
    const yAlg = new Alg("y");
    for (const uAlg of uAlgs) {
      orientationKpuzzle.reset();
      orientationKpuzzle.applyAlg(uAlg);
      for (let i2 = 0; i2 < 4; i2++) {
        orientationKpuzzle.applyAlg(yAlg);
        const [idxU, idxL] = puzzleOrientationIdx(orientationKpuzzle.state);
        puzzleOrientationCache[idxU][idxL] = invertTransformation(cube3x3x3KPuzzle, orientationKpuzzle.state);
      }
    }
  }

  // node_modules/cubing/dist/esm/chunk-R3HRHYIW.js
  init_chunk_EWRBHQFX();
  var PieceStickering;
  (function(PieceStickering2) {
    PieceStickering2["Regular"] = "Regular";
    PieceStickering2["Dim"] = "Dim";
    PieceStickering2["Ignored"] = "Ignored";
    PieceStickering2["OrientationStickers"] = "OrientationStickers";
    PieceStickering2["Invisible"] = "Invisible";
    PieceStickering2["Ignoriented"] = "Ignoriented";
    PieceStickering2["IgnoreNonPrimary"] = "IgnoreNonPrimary";
    PieceStickering2["PermuteNonPrimary"] = "PermuteNonPrimary";
    PieceStickering2["OrientationWithoutPermutation"] = "OrientationWithoutPermutation";
  })(PieceStickering || (PieceStickering = {}));
  var PieceAnnotation = class {
    constructor(def, defaultValue) {
      this.stickerings = /* @__PURE__ */ new Map();
      for (const [orbitName, orbitDef] of Object.entries(def.orbits)) {
        this.stickerings.set(orbitName, new Array(orbitDef.numPieces).fill(defaultValue));
      }
    }
  };
  var regular = "regular";
  var ignored = "ignored";
  var oriented = "oriented";
  var invisible = "invisible";
  var dim = "dim";
  var r = {
    facelets: [regular, regular, regular, regular, regular]
  };
  var i = {
    facelets: [ignored, ignored, ignored, ignored, ignored]
  };
  var o = {
    facelets: [oriented, oriented, oriented, oriented, oriented]
  };
  var invisiblePiece = {
    facelets: [invisible, invisible, invisible, invisible]
  };
  var riiii = {
    facelets: [regular, ignored, ignored, ignored, ignored]
  };
  var drrrr = {
    facelets: [dim, regular, regular, regular, regular]
  };
  var d = {
    facelets: [dim, dim, dim, dim, dim]
  };
  var diiii = {
    facelets: [dim, ignored, ignored, ignored, ignored]
  };
  var oiiii = {
    facelets: [oriented, ignored, ignored, ignored, ignored]
  };
  function getPieceAppearance(pieceStickering) {
    switch (pieceStickering) {
      case PieceStickering.Regular:
        return r;
      case PieceStickering.Dim:
        return d;
      case PieceStickering.Ignored:
        return i;
      case PieceStickering.OrientationStickers:
        return o;
      case PieceStickering.Invisible:
        return invisiblePiece;
      case PieceStickering.IgnoreNonPrimary:
        return riiii;
      case PieceStickering.PermuteNonPrimary:
        return drrrr;
      case PieceStickering.Ignoriented:
        return diiii;
      case PieceStickering.OrientationWithoutPermutation:
        return oiiii;
    }
  }
  var PuzzleStickering = class extends PieceAnnotation {
    constructor(def) {
      super(def, PieceStickering.Regular);
    }
    set(pieceSet, pieceStickering) {
      for (const [orbitName, pieces] of this.stickerings.entries()) {
        for (let i2 = 0; i2 < pieces.length; i2++) {
          if (pieceSet.stickerings.get(orbitName)[i2]) {
            pieces[i2] = pieceStickering;
          }
        }
      }
      return this;
    }
    toAppearance() {
      const appearance = { orbits: {} };
      for (const [orbitName, pieceStickerings] of this.stickerings.entries()) {
        const pieces = [];
        const orbitAppearance = {
          pieces
        };
        appearance.orbits[orbitName] = orbitAppearance;
        for (const pieceStickering of pieceStickerings) {
          pieces.push(getPieceAppearance(pieceStickering));
        }
      }
      return appearance;
    }
  };
  var StickeringManager = class {
    constructor(def) {
      this.def = def;
    }
    and(pieceSets) {
      const newPieceSet = new PieceAnnotation(this.def, false);
      for (const [orbitName, orbitDef] of Object.entries(this.def.orbits)) {
        pieceLoop:
          for (let i2 = 0; i2 < orbitDef.numPieces; i2++) {
            newPieceSet.stickerings.get(orbitName)[i2] = true;
            for (const pieceSet of pieceSets) {
              if (!pieceSet.stickerings.get(orbitName)[i2]) {
                newPieceSet.stickerings.get(orbitName)[i2] = false;
                continue pieceLoop;
              }
            }
          }
      }
      return newPieceSet;
    }
    or(pieceSets) {
      const newPieceSet = new PieceAnnotation(this.def, false);
      for (const [orbitName, orbitDef] of Object.entries(this.def.orbits)) {
        pieceLoop:
          for (let i2 = 0; i2 < orbitDef.numPieces; i2++) {
            newPieceSet.stickerings.get(orbitName)[i2] = false;
            for (const pieceSet of pieceSets) {
              if (pieceSet.stickerings.get(orbitName)[i2]) {
                newPieceSet.stickerings.get(orbitName)[i2] = true;
                continue pieceLoop;
              }
            }
          }
      }
      return newPieceSet;
    }
    not(pieceSet) {
      const newPieceSet = new PieceAnnotation(this.def, false);
      for (const [orbitName, orbitDef] of Object.entries(this.def.orbits)) {
        for (let i2 = 0; i2 < orbitDef.numPieces; i2++) {
          newPieceSet.stickerings.get(orbitName)[i2] = !pieceSet.stickerings.get(orbitName)[i2];
        }
      }
      return newPieceSet;
    }
    all() {
      return this.and(this.moves([]));
    }
    move(moveSource) {
      const transformation = transformationForMove(this.def, experimentalIs(moveSource, Move) ? moveSource : Move.fromString(moveSource));
      const newPieceSet = new PieceAnnotation(this.def, false);
      for (const [orbitName, orbitDef] of Object.entries(this.def.orbits)) {
        for (let i2 = 0; i2 < orbitDef.numPieces; i2++) {
          if (transformation[orbitName].permutation[i2] !== i2 || transformation[orbitName].orientation[i2] !== 0) {
            newPieceSet.stickerings.get(orbitName)[i2] = true;
          }
        }
      }
      return newPieceSet;
    }
    moves(moveSources) {
      return moveSources.map((moveSource) => this.move(moveSource));
    }
  };
  var globalCustomStickerer = () => {
  };
  function setGlobalCustomStickerer(stickerer) {
    (async () => {
      globalCustomStickerer = stickerer;
      const players = Array.from(document.body.querySelectorAll("twisty-player"));
      console.log(`Setting the custom stickering for ${players.length} players!`);
      const successPromises = [];
      for (const player of players) {
        successPromises.push((async () => {
          const stickering = await player.experimentalModel.stickeringProp.get();
          player.experimentalStickering = stickering === "experimental-global-custom-1" ? "experimental-global-custom-2" : "experimental-global-custom-1";
        })());
      }
      await Promise.all(successPromises);
      console.log("Success!");
    })();
  }
  function useGlobalCustomStickerer(puzzleStickering, m) {
    globalCustomStickerer(puzzleStickering, m);
  }
  if (globalThis.location && new URL(location.href).searchParams.get("global-custom-stickerer") === "true") {
    window.setGlobalCustomStickerer = setGlobalCustomStickerer;
    window.PieceStickering = PieceStickering;
    console.log("Global custom stickerer enabled! (using: global-custom-stickerer=true)");
    console.log("Look here for inspiration:", "https://github.com/cubing/cubing.js/blob/81b5cab3e27d8defb39dd1e0a10bc9e8ba894d26/src/cubing/puzzles/stickerings/cube-stickerings.ts#L67");
  }
  async function cubeAppearance(puzzleLoader, stickering) {
    const def = await puzzleLoader.def();
    const puzzleStickering = new PuzzleStickering(def);
    const m = new StickeringManager(def);
    const LL = () => m.move("U");
    const orUD = () => m.or(m.moves(["U", "D"]));
    const E = () => m.not(orUD());
    const orLR = () => m.or(m.moves(["L", "R"]));
    const M = () => m.not(orLR());
    const orFB = () => m.or(m.moves(["F", "B"]));
    const S = () => m.not(orFB());
    const F2L = () => m.not(LL());
    const centerU = () => m.and([LL(), M(), S()]);
    const edgeFR = () => m.and([m.and(m.moves(["F", "R"])), m.not(orUD())]);
    const cornerDFR = () => m.and(m.moves(["D", "R", "F"]));
    const slotFR = () => m.or([cornerDFR(), edgeFR()]);
    const CENTERS = () => m.or([m.and([M(), E()]), m.and([M(), S()]), m.and([E(), S()])]);
    const EDGES = () => m.or([
      m.and([M(), orUD(), orFB()]),
      m.and([E(), orLR(), orFB()]),
      m.and([S(), orUD(), orLR()])
    ]);
    const CORNERS = () => m.not(m.or([CENTERS(), EDGES()]));
    const L6E = () => m.or([M(), m.and([LL(), EDGES()])]);
    function dimF2L() {
      puzzleStickering.set(F2L(), PieceStickering.Dim);
    }
    function setPLL() {
      puzzleStickering.set(LL(), PieceStickering.PermuteNonPrimary);
      puzzleStickering.set(centerU(), PieceStickering.Dim);
    }
    function setOLL() {
      puzzleStickering.set(LL(), PieceStickering.IgnoreNonPrimary);
      puzzleStickering.set(centerU(), PieceStickering.Regular);
    }
    function dimOLL() {
      puzzleStickering.set(LL(), PieceStickering.Ignoriented);
      puzzleStickering.set(centerU(), PieceStickering.Dim);
    }
    switch (stickering) {
      case "full":
        break;
      case "PLL":
        dimF2L();
        setPLL();
        break;
      case "CLS":
        dimF2L();
        puzzleStickering.set(m.and(m.moves(["D", "R", "F"])), PieceStickering.Regular);
        puzzleStickering.set(LL(), PieceStickering.Ignoriented);
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.IgnoreNonPrimary);
        break;
      case "OLL":
        dimF2L();
        setOLL();
        break;
      case "COLL":
        dimF2L();
        setPLL();
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.Regular);
        break;
      case "OCLL":
        dimF2L();
        dimOLL();
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.IgnoreNonPrimary);
        break;
      case "CLL":
        dimF2L();
        puzzleStickering.set(m.not(m.and([CORNERS(), LL()])), PieceStickering.Dim);
        break;
      case "ELL":
        dimF2L();
        puzzleStickering.set(LL(), PieceStickering.Dim);
        puzzleStickering.set(m.and([LL(), EDGES()]), PieceStickering.Regular);
        break;
      case "ELS":
        dimF2L();
        setOLL();
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.Ignored);
        puzzleStickering.set(edgeFR(), PieceStickering.Regular);
        puzzleStickering.set(cornerDFR(), PieceStickering.Ignored);
        break;
      case "LL":
        dimF2L();
        break;
      case "F2L":
        puzzleStickering.set(LL(), PieceStickering.Ignored);
        break;
      case "ZBLL":
        dimF2L();
        puzzleStickering.set(LL(), PieceStickering.PermuteNonPrimary);
        puzzleStickering.set(centerU(), PieceStickering.Dim);
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.Regular);
        break;
      case "ZBLS":
        dimF2L();
        puzzleStickering.set(slotFR(), PieceStickering.Regular);
        setOLL();
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.Ignored);
        break;
      case "WVLS":
      case "VLS":
        dimF2L();
        puzzleStickering.set(slotFR(), PieceStickering.Regular);
        setOLL();
        break;
      case "LS":
        dimF2L();
        puzzleStickering.set(slotFR(), PieceStickering.Regular);
        puzzleStickering.set(LL(), PieceStickering.Ignored);
        puzzleStickering.set(centerU(), PieceStickering.Dim);
        break;
      case "EO":
        puzzleStickering.set(CORNERS(), PieceStickering.Ignored);
        puzzleStickering.set(EDGES(), PieceStickering.OrientationWithoutPermutation);
        break;
      case "EOline":
        puzzleStickering.set(CORNERS(), PieceStickering.Ignored);
        puzzleStickering.set(EDGES(), PieceStickering.OrientationWithoutPermutation);
        puzzleStickering.set(m.and(m.moves(["D", "M"])), PieceStickering.Regular);
        break;
      case "EOcross":
        puzzleStickering.set(EDGES(), PieceStickering.OrientationWithoutPermutation);
        puzzleStickering.set(m.move("D"), PieceStickering.Regular);
        puzzleStickering.set(CORNERS(), PieceStickering.Ignored);
        break;
      case "CMLL":
        puzzleStickering.set(F2L(), PieceStickering.Dim);
        puzzleStickering.set(L6E(), PieceStickering.Ignored);
        puzzleStickering.set(m.and([LL(), CORNERS()]), PieceStickering.Regular);
        break;
      case "L6E":
        puzzleStickering.set(m.not(L6E()), PieceStickering.Dim);
        break;
      case "L6EO":
        puzzleStickering.set(m.not(L6E()), PieceStickering.Dim);
        puzzleStickering.set(L6E(), PieceStickering.OrientationWithoutPermutation);
        puzzleStickering.set(m.and([CENTERS(), orUD()]), PieceStickering.OrientationStickers);
        break;
      case "Daisy":
        puzzleStickering.set(m.all(), PieceStickering.Ignored);
        puzzleStickering.set(CENTERS(), PieceStickering.Dim);
        puzzleStickering.set(m.and([m.move("D"), CENTERS()]), PieceStickering.Regular);
        puzzleStickering.set(m.and([m.move("U"), EDGES()]), PieceStickering.IgnoreNonPrimary);
        break;
      case "Cross":
        puzzleStickering.set(m.all(), PieceStickering.Ignored);
        puzzleStickering.set(CENTERS(), PieceStickering.Dim);
        puzzleStickering.set(m.and([m.move("D"), CENTERS()]), PieceStickering.Regular);
        puzzleStickering.set(m.and([m.move("D"), EDGES()]), PieceStickering.Regular);
        break;
      case "2x2x2":
        puzzleStickering.set(m.or(m.moves(["U", "F", "R"])), PieceStickering.Ignored);
        puzzleStickering.set(m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]), PieceStickering.Dim);
        break;
      case "2x2x3":
        puzzleStickering.set(m.all(), PieceStickering.Dim);
        puzzleStickering.set(m.or(m.moves(["U", "F", "R"])), PieceStickering.Ignored);
        puzzleStickering.set(m.and([m.or(m.moves(["U", "F", "R"])), CENTERS()]), PieceStickering.Dim);
        puzzleStickering.set(m.and([m.move("F"), m.not(m.or(m.moves(["U", "R"])))]), PieceStickering.Regular);
        break;
      case "Void Cube":
        puzzleStickering.set(CENTERS(), PieceStickering.Invisible);
        break;
      case "picture":
      case "invisible":
        puzzleStickering.set(m.all(), PieceStickering.Invisible);
        break;
      case "centers-only":
        puzzleStickering.set(m.not(CENTERS()), PieceStickering.Ignored);
        break;
      case "experimental-global-custom-1":
      case "experimental-global-custom-2":
        useGlobalCustomStickerer(puzzleStickering, m);
        break;
      default:
        console.warn(`Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`);
        puzzleStickering.set(m.and(m.moves([])), PieceStickering.Dim);
    }
    return puzzleStickering.toAppearance();
  }
  async function cubeStickerings() {
    return [
      "full",
      "PLL",
      "CLS",
      "OLL",
      "COLL",
      "OCLL",
      "ELL",
      "ELS",
      "LL",
      "F2L",
      "ZBLL",
      "ZBLS",
      "WVLS",
      "VLS",
      "LS",
      "EO",
      "EOline",
      "EOcross",
      "CMLL",
      "L6E",
      "L6EO",
      "Daisy",
      "Cross",
      "2x2x2",
      "2x2x3",
      "Void Cube",
      "picture",
      "invisible",
      "centers-only",
      "experimental-global-custom-1",
      "experimental-global-custom-2"
    ];
  }
  async function asyncGetPuzzleGeometry(puzzleName) {
    const puzzleGeometry = await Promise.resolve().then(() => (init_puzzle_geometry(), puzzle_geometry_exports));
    return puzzleGeometry.getPuzzleGeometryByName(puzzleName, {
      allMoves: true,
      orientCenters: true,
      addRotations: true
    });
  }
  async function asyncGetDef(puzzleName) {
    return (await asyncGetPuzzleGeometry(puzzleName)).writekpuzzle(true);
  }
  function genericPGPuzzleLoader(id, fullName, info) {
    const puzzleLoader = {
      id,
      fullName,
      def: async () => {
        return asyncGetDef(id);
      },
      svg: async () => {
        const pg = await asyncGetPuzzleGeometry(id);
        return pg.generatesvg();
      },
      pg: async () => {
        return asyncGetPuzzleGeometry(id);
      }
    };
    if (info == null ? void 0 : info.inventedBy) {
      puzzleLoader.inventedBy = info.inventedBy;
    }
    if (info == null ? void 0 : info.inventionYear) {
      puzzleLoader.inventionYear = info.inventionYear;
    }
    return puzzleLoader;
  }
  function cubePGPuzzleLoader(id, fullName, info) {
    const puzzleLoader = genericPGPuzzleLoader(id, fullName, info);
    puzzleLoader.appearance = cubeAppearance.bind(cubeAppearance, puzzleLoader);
    puzzleLoader.stickerings = cubeStickerings;
    return puzzleLoader;
  }
  var cube2x2x2 = {
    id: "2x2x2",
    fullName: "2\xD72\xD72 Cube",
    def: async () => {
      return (await Promise.resolve().then(() => (init_x2x2_kpuzzle_json_JOGUSQ4N(), x2x2_kpuzzle_json_JOGUSQ4N_exports))).cube2x2x2KPuzzle;
    },
    svg: async () => {
      return (await Promise.resolve().then(() => (init_x2x2_kpuzzle_svg_CQF2FTV7(), x2x2_kpuzzle_svg_CQF2FTV7_exports))).default;
    },
    pg: async () => {
      return asyncGetPuzzleGeometry("2x2x2");
    },
    appearance: (stickering) => cubeAppearance(cube2x2x2, stickering),
    stickerings: cubeStickerings
  };
  var cube3x3x3 = {
    id: "3x3x3",
    fullName: "3\xD73\xD73 Cube",
    inventedBy: ["Ern\u0151 Rubik"],
    inventionYear: 1974,
    def: async () => {
      return cube3x3x3KPuzzle;
    },
    svg: async () => {
      return (await Promise.resolve().then(() => (init_x3x3_kpuzzle_svg_ERSSH66P(), x3x3_kpuzzle_svg_ERSSH66P_exports))).default;
    },
    llSVG: async () => {
      return (await Promise.resolve().then(() => (init_x3x3_ll_kpuzzle_svg_53CBPG5O(), x3x3_ll_kpuzzle_svg_53CBPG5O_exports))).default;
    },
    pg: async () => {
      return asyncGetPuzzleGeometry("3x3x3");
    },
    appearance: (stickering) => cubeAppearance(cube3x3x3, stickering),
    stickerings: cubeStickerings
  };
  var clock = {
    id: "clock",
    fullName: "Clock",
    inventedBy: ["Christopher C. Wiggs", "Christopher J. Taylor"],
    inventionYear: 1988,
    def: async () => {
      return (await Promise.resolve().then(() => (init_clock_kpuzzle_json_EKWRMHJM(), clock_kpuzzle_json_EKWRMHJM_exports))).clockKPuzzle;
    },
    svg: async () => {
      return (await Promise.resolve().then(() => (init_clock_kpuzzle_svg_B7TMN3SY(), clock_kpuzzle_svg_B7TMN3SY_exports))).default;
    }
  };
  async function ftoStickering(puzzleLoader, stickering) {
    const def = await puzzleLoader.def();
    const puzzleStickering = new PuzzleStickering(def);
    const m = new StickeringManager(def);
    const experimentalFTO_FC = () => m.and([m.move("U"), m.not(m.or(m.moves(["F", "BL", "BR"])))]);
    const experimentalFTO_F2T = () => m.and([m.move("U"), m.not(m.move("F"))]);
    const experimentalFTO_SC = () => m.or([
      experimentalFTO_F2T(),
      m.and([m.move("F"), m.not(m.or(m.moves(["U", "BL", "BR"])))])
    ]);
    const experimentalFTO_L2C = () => m.not(m.or([
      m.and([m.move("U"), m.move("F")]),
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ]));
    const experimentalFTO_LBT = () => m.not(m.or([
      m.and([m.move("F"), m.move("BL")]),
      m.and([m.move("F"), m.move("BR")]),
      m.and([m.move("BL"), m.move("BR")])
    ]));
    switch (stickering) {
      case "full":
        break;
      case "experimental-fto-fc":
        puzzleStickering.set(m.not(experimentalFTO_FC()), PieceStickering.Ignored);
        break;
      case "experimental-fto-f2t":
        puzzleStickering.set(m.not(experimentalFTO_F2T()), PieceStickering.Ignored);
        puzzleStickering.set(experimentalFTO_FC(), PieceStickering.Dim);
        break;
      case "experimental-fto-sc":
        puzzleStickering.set(m.not(experimentalFTO_SC()), PieceStickering.Ignored);
        puzzleStickering.set(experimentalFTO_F2T(), PieceStickering.Dim);
        break;
      case "experimental-fto-l2c":
        puzzleStickering.set(m.not(experimentalFTO_L2C()), PieceStickering.Ignored);
        puzzleStickering.set(experimentalFTO_SC(), PieceStickering.Dim);
        break;
      case "experimental-fto-lbt":
        puzzleStickering.set(m.not(experimentalFTO_LBT()), PieceStickering.Ignored);
        puzzleStickering.set(experimentalFTO_L2C(), PieceStickering.Dim);
        break;
      case "experimental-fto-l3t":
        puzzleStickering.set(experimentalFTO_LBT(), PieceStickering.Dim);
        break;
      default:
        console.warn(`Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`);
        puzzleStickering.set(m.and(m.moves([])), PieceStickering.Dim);
    }
    return puzzleStickering.toAppearance();
  }
  async function ftoStickerings() {
    return [
      "full",
      "experimental-fto-fc",
      "experimental-fto-f2t",
      "experimental-fto-sc",
      "experimental-fto-l2c",
      "experimental-fto-lbt",
      "experimental-fto-l3t"
    ];
  }
  var fto = {
    id: "fto",
    fullName: "Face-Turning Octahedron",
    inventedBy: ["Karl Rohrbach", "David Pitcher"],
    inventionYear: 1983,
    def: async () => {
      return asyncGetDef("FTO");
    },
    svg: async () => {
      const pg = await asyncGetPuzzleGeometry("FTO");
      return pg.generatesvg();
    },
    pg: async () => {
      return asyncGetPuzzleGeometry("FTO");
    },
    appearance: (stickering) => ftoStickering(fto, stickering),
    stickerings: ftoStickerings
  };
  async function megaminxAppearance(puzzleLoader, stickering) {
    switch (stickering) {
      case "full":
      case "F2L":
      case "LL":
        return cubeAppearance(puzzleLoader, stickering);
      default:
        console.warn(`Unsupported stickering for ${puzzleLoader.id}: ${stickering}. Setting all pieces to dim.`);
    }
    return cubeAppearance(puzzleLoader, "full");
  }
  async function megaminxStickerings() {
    return ["full", "F2L", "LL"];
  }
  var megaminx = genericPGPuzzleLoader("megaminx", "Megaminx", {
    inventionYear: 1981
  });
  megaminx.appearance = (stickering) => megaminxAppearance(megaminx, stickering);
  megaminx.stickerings = megaminxStickerings;
  var pyraminx = {
    id: "pyraminx",
    fullName: "Pyraminx",
    inventedBy: ["Uwe Meffert"],
    inventionYear: 1970,
    def: async () => {
      return asyncGetDef("pyraminx");
    },
    svg: async () => {
      return (await Promise.resolve().then(() => (init_pyraminx_kpuzzle_svg_QBBMZVDY(), pyraminx_kpuzzle_svg_QBBMZVDY_exports))).default;
    },
    pg: async () => {
      return asyncGetPuzzleGeometry("pyraminx");
    }
  };
  var square1 = {
    id: "square1",
    fullName: "Square-1",
    inventedBy: ["Karel Hr\u0161el", "Vojtech Kopsk\xFD"],
    inventionYear: 1990,
    def: async () => {
      return (await Promise.resolve().then(() => (init_sq1_hyperorbit_kpuzzle_json_N3FGCPML(), sq1_hyperorbit_kpuzzle_json_N3FGCPML_exports))).sq1HyperOrbitKPuzzle;
    },
    svg: async () => {
      return (await Promise.resolve().then(() => (init_sq1_hyperorbit_kpuzzle_svg_ID57EER7(), sq1_hyperorbit_kpuzzle_svg_ID57EER7_exports))).default;
    }
  };
  var puzzles = {
    "3x3x3": cube3x3x3,
    "2x2x2": cube2x2x2,
    "4x4x4": cubePGPuzzleLoader("4x4x4", "4\xD74\xD74 Cube"),
    "5x5x5": cubePGPuzzleLoader("5x5x5", "5\xD75\xD75 Cube"),
    "6x6x6": cubePGPuzzleLoader("6x6x6", "6\xD76\xD76 Cube"),
    "7x7x7": cubePGPuzzleLoader("7x7x7", "7\xD77\xD77 Cube"),
    "40x40x40": cubePGPuzzleLoader("40x40x40", "40\xD740\xD740 Cube"),
    clock,
    "megaminx": megaminx,
    pyraminx,
    "skewb": genericPGPuzzleLoader("skewb", "Skewb", {
      inventedBy: ["Tony Durham"]
    }),
    square1,
    "fto": fto,
    "gigaminx": genericPGPuzzleLoader("gigaminx", "Gigaminx", {
      inventedBy: ["Tyler Fox"],
      inventionYear: 2006
    }),
    "master_tetraminx": genericPGPuzzleLoader("master tetraminx", "Master Tetraminx", {
      inventedBy: ["Katsuhiko Okamoto"],
      inventionYear: 2002
    })
  };

  // node_modules/cubing/dist/esm/chunk-6BZSKSG7.js
  init_chunk_EWRBHQFX();

  // node_modules/comlink/dist/esm/comlink.mjs
  var proxyMarker = Symbol("Comlink.proxy");
  var createEndpoint = Symbol("Comlink.endpoint");
  var releaseProxy = Symbol("Comlink.releaseProxy");
  var finalizer = Symbol("Comlink.finalizer");
  var throwMarker = Symbol("Comlink.thrown");
  var isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
  var proxyTransferHandler = {
    canHandle: (val) => isObject(val) && val[proxyMarker],
    serialize(obj) {
      const { port1, port2 } = new MessageChannel();
      expose(obj, port1);
      return [port2, [port2]];
    },
    deserialize(port) {
      port.start();
      return wrap(port);
    }
  };
  var throwTransferHandler = {
    canHandle: (value) => isObject(value) && throwMarker in value,
    serialize({ value }) {
      let serialized;
      if (value instanceof Error) {
        serialized = {
          isError: true,
          value: {
            message: value.message,
            name: value.name,
            stack: value.stack
          }
        };
      } else {
        serialized = { isError: false, value };
      }
      return [serialized, []];
    },
    deserialize(serialized) {
      if (serialized.isError) {
        throw Object.assign(new Error(serialized.value.message), serialized.value);
      }
      throw serialized.value;
    }
  };
  var transferHandlers = /* @__PURE__ */ new Map([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler]
  ]);
  function isAllowedOrigin(allowedOrigins, origin) {
    for (const allowedOrigin of allowedOrigins) {
      if (origin === allowedOrigin || allowedOrigin === "*") {
        return true;
      }
      if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
        return true;
      }
    }
    return false;
  }
  function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
    ep.addEventListener("message", function callback(ev) {
      if (!ev || !ev.data) {
        return;
      }
      if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
        console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
        return;
      }
      const { id, type, path } = Object.assign({ path: [] }, ev.data);
      const argumentList = (ev.data.argumentList || []).map(fromWireValue);
      let returnValue;
      try {
        const parent = path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
        const rawValue = path.reduce((obj2, prop) => obj2[prop], obj);
        switch (type) {
          case "GET":
            {
              returnValue = rawValue;
            }
            break;
          case "SET":
            {
              parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
              returnValue = true;
            }
            break;
          case "APPLY":
            {
              returnValue = rawValue.apply(parent, argumentList);
            }
            break;
          case "CONSTRUCT":
            {
              const value = new rawValue(...argumentList);
              returnValue = proxy(value);
            }
            break;
          case "ENDPOINT":
            {
              const { port1, port2 } = new MessageChannel();
              expose(obj, port2);
              returnValue = transfer(port1, [port1]);
            }
            break;
          case "RELEASE":
            {
              returnValue = void 0;
            }
            break;
          default:
            return;
        }
      } catch (value) {
        returnValue = { value, [throwMarker]: 0 };
      }
      Promise.resolve(returnValue).catch((value) => {
        return { value, [throwMarker]: 0 };
      }).then((returnValue2) => {
        const [wireValue, transferables] = toWireValue(returnValue2);
        ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
        if (type === "RELEASE") {
          ep.removeEventListener("message", callback);
          closeEndPoint(ep);
          if (finalizer in obj && typeof obj[finalizer] === "function") {
            obj[finalizer]();
          }
        }
      }).catch((error) => {
        const [wireValue, transferables] = toWireValue({
          value: new TypeError("Unserializable return value"),
          [throwMarker]: 0
        });
        ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      });
    });
    if (ep.start) {
      ep.start();
    }
  }
  function isMessagePort(endpoint) {
    return endpoint.constructor.name === "MessagePort";
  }
  function closeEndPoint(endpoint) {
    if (isMessagePort(endpoint))
      endpoint.close();
  }
  function wrap(ep, target) {
    const pendingListeners = /* @__PURE__ */ new Map();
    ep.addEventListener("message", function handleMessage(ev) {
      const { data } = ev;
      if (!data || !data.id) {
        return;
      }
      const resolver = pendingListeners.get(data.id);
      if (!resolver) {
        return;
      }
      try {
        resolver(data);
      } finally {
        pendingListeners.delete(data.id);
      }
    });
    return createProxy(ep, pendingListeners, [], target);
  }
  function throwIfProxyReleased(isReleased) {
    if (isReleased) {
      throw new Error("Proxy has been released and is not useable");
    }
  }
  function releaseEndpoint(ep) {
    return requestResponseMessage(ep, /* @__PURE__ */ new Map(), {
      type: "RELEASE"
    }).then(() => {
      closeEndPoint(ep);
    });
  }
  var proxyCounter = /* @__PURE__ */ new WeakMap();
  var proxyFinalizers = "FinalizationRegistry" in globalThis && new FinalizationRegistry((ep) => {
    const newCount = (proxyCounter.get(ep) || 0) - 1;
    proxyCounter.set(ep, newCount);
    if (newCount === 0) {
      releaseEndpoint(ep);
    }
  });
  function registerProxy(proxy2, ep) {
    const newCount = (proxyCounter.get(ep) || 0) + 1;
    proxyCounter.set(ep, newCount);
    if (proxyFinalizers) {
      proxyFinalizers.register(proxy2, ep, proxy2);
    }
  }
  function unregisterProxy(proxy2) {
    if (proxyFinalizers) {
      proxyFinalizers.unregister(proxy2);
    }
  }
  function createProxy(ep, pendingListeners, path = [], target = function() {
  }) {
    let isProxyReleased = false;
    const proxy2 = new Proxy(target, {
      get(_target, prop) {
        throwIfProxyReleased(isProxyReleased);
        if (prop === releaseProxy) {
          return () => {
            unregisterProxy(proxy2);
            releaseEndpoint(ep);
            pendingListeners.clear();
            isProxyReleased = true;
          };
        }
        if (prop === "then") {
          if (path.length === 0) {
            return { then: () => proxy2 };
          }
          const r2 = requestResponseMessage(ep, pendingListeners, {
            type: "GET",
            path: path.map((p) => p.toString())
          }).then(fromWireValue);
          return r2.then.bind(r2);
        }
        return createProxy(ep, pendingListeners, [...path, prop]);
      },
      set(_target, prop, rawValue) {
        throwIfProxyReleased(isProxyReleased);
        const [value, transferables] = toWireValue(rawValue);
        return requestResponseMessage(ep, pendingListeners, {
          type: "SET",
          path: [...path, prop].map((p) => p.toString()),
          value
        }, transferables).then(fromWireValue);
      },
      apply(_target, _thisArg, rawArgumentList) {
        throwIfProxyReleased(isProxyReleased);
        const last = path[path.length - 1];
        if (last === createEndpoint) {
          return requestResponseMessage(ep, pendingListeners, {
            type: "ENDPOINT"
          }).then(fromWireValue);
        }
        if (last === "bind") {
          return createProxy(ep, pendingListeners, path.slice(0, -1));
        }
        const [argumentList, transferables] = processArguments(rawArgumentList);
        return requestResponseMessage(ep, pendingListeners, {
          type: "APPLY",
          path: path.map((p) => p.toString()),
          argumentList
        }, transferables).then(fromWireValue);
      },
      construct(_target, rawArgumentList) {
        throwIfProxyReleased(isProxyReleased);
        const [argumentList, transferables] = processArguments(rawArgumentList);
        return requestResponseMessage(ep, pendingListeners, {
          type: "CONSTRUCT",
          path: path.map((p) => p.toString()),
          argumentList
        }, transferables).then(fromWireValue);
      }
    });
    registerProxy(proxy2, ep);
    return proxy2;
  }
  function myFlat(arr) {
    return Array.prototype.concat.apply([], arr);
  }
  function processArguments(argumentList) {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
  }
  var transferCache = /* @__PURE__ */ new WeakMap();
  function transfer(obj, transfers) {
    transferCache.set(obj, transfers);
    return obj;
  }
  function proxy(obj) {
    return Object.assign(obj, { [proxyMarker]: true });
  }
  function toWireValue(value) {
    for (const [name, handler] of transferHandlers) {
      if (handler.canHandle(value)) {
        const [serializedValue, transferables] = handler.serialize(value);
        return [
          {
            type: "HANDLER",
            name,
            value: serializedValue
          },
          transferables
        ];
      }
    }
    return [
      {
        type: "RAW",
        value
      },
      transferCache.get(value) || []
    ];
  }
  function fromWireValue(value) {
    switch (value.type) {
      case "HANDLER":
        return transferHandlers.get(value.name).deserialize(value.value);
      case "RAW":
        return value.value;
    }
  }
  function requestResponseMessage(ep, pendingListeners, msg, transfers) {
    return new Promise((resolve) => {
      const id = generateUUID();
      pendingListeners.set(id, resolve);
      if (ep.start) {
        ep.start();
      }
      ep.postMessage(Object.assign({ id }, msg), transfers);
    });
  }
  function generateUUID() {
    return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
  }

  // node_modules/cubing/dist/esm/chunk-6BZSKSG7.js
  var import_meta = {};
  var cryptoPromise = null;
  async function getRandomValuesFactory() {
    var _a;
    if (!((_a = globalThis == null ? void 0 : globalThis.crypto) == null ? void 0 : _a.getRandomValues)) {
      const nodeWebcrypto = (await (cryptoPromise != null ? cryptoPromise : cryptoPromise = Promise.resolve().then(() => (init_crypto(), crypto_exports)))).webcrypto;
      return nodeWebcrypto.getRandomValues;
    } else {
      return crypto.getRandomValues.bind(crypto);
    }
  }
  var MAX_JS_PRECISE_INT = 9007199254740992;
  var UPPER_HALF_MULTIPLIER = 2097152;
  var LOWER_HALF_DIVIDER = 2048;
  function random53BitValue(getRandomValues) {
    const arr = new Uint32Array(2);
    getRandomValues(arr);
    const upper = arr[0];
    const lower = arr[1];
    return Math.floor(upper * UPPER_HALF_MULTIPLIER) + Math.floor(lower / LOWER_HALF_DIVIDER);
  }
  function validateMax(max) {
    if (typeof max !== "number" || max < 0 || Math.floor(max) !== max) {
      throw new Error("randomInt.below() not called with a positive integer value.");
    }
    if (max > MAX_JS_PRECISE_INT) {
      throw new Error(`Called randomInt.below() with max == ${max}, which is larger than Javascript can handle with integer precision.`);
    }
  }
  async function randomUIntBelowFactory() {
    const getRandomValues = await getRandomValuesFactory();
    const randomUIntBelow = (max) => {
      validateMax(max);
      const val = random53BitValue(getRandomValues);
      const maxUniformSamplingRange = Math.floor(MAX_JS_PRECISE_INT / max) * max;
      if (val < maxUniformSamplingRange) {
        return val % max;
      } else {
        return randomUIntBelow(max);
      }
    };
    return randomUIntBelow;
  }
  var randomUIntBelowPromise = randomUIntBelowFactory();
  var pins = ["UR", "DR", "DL", "UL"];
  var backMoves = ["U", "R", "D", "L", "ALL"];
  var frontMoves = pins.concat(backMoves);
  var randomUIntBelowPromise2 = randomUIntBelowFactory();
  var randomUIntBelowPromise3 = randomUIntBelowFactory();
  var useNodeWorkarounds = typeof globalThis.Worker === "undefined" && typeof globalThis.WorkerNavigator === "undefined";
  async function workerFileConstructor() {
    if (useNodeWorkarounds) {
      return await (await Promise.resolve().then(() => (init_node_HFBX5WHK(), node_HFBX5WHK_exports))).NodeWorkerWrapper();
    } else {
      return globalThis.Worker;
    }
  }
  async function constructWorkerFromString(stringSource, options) {
    let worker;
    if (useNodeWorkarounds) {
      const constructor = await (await Promise.resolve().then(() => (init_node_HFBX5WHK(), node_HFBX5WHK_exports))).NodeWorkerStringWrapper();
      const worker2 = new constructor(stringSource);
      return worker2;
    } else {
      const blob = new Blob([stringSource], { type: "application/javascript" });
      const workerURL = URL.createObjectURL(blob);
      worker = new globalThis.Worker(workerURL, {
        type: options ? options.type : void 0
      });
    }
    return worker;
  }
  var TEST_RELATIVE_URL_WORKER = false;
  async function instantiateRelativeURLWorker() {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        reject();
      }, 1e3);
      const Worker3 = await workerFileConstructor();
      const worker = new Worker3(new URL("./esm-test-worker.js", import_meta.url));
      const api = wrap(worker);
      if (await api.test("to worker") === "from worker") {
        resolve();
      } else {
        reject();
      }
    });
  }
  async function relativeURLWorkerTest() {
    try {
      await instantiateRelativeURLWorker();
      console.info("Successful relative URL worker instantiation.");
    } catch (e) {
      console.warn("WARNING: Could not instantiate and communicate with a relative URL worker. This means that your app may have issues with `cubing/solve` in the future.");
    }
  }
  async function instantiateWorker() {
    const { workerSource: workerSource2 } = await Promise.resolve().then(() => (init_worker_inside_generated_string_RQYYANYQ(), worker_inside_generated_string_RQYYANYQ_exports));
    const worker = await constructWorkerFromString(workerSource2);
    if (TEST_RELATIVE_URL_WORKER) {
      relativeURLWorkerTest();
    }
    return wrap(worker);
  }
  var cachedWorkerInstance = null;
  async function getCachedWorkerInstance() {
    return await (cachedWorkerInstance != null ? cachedWorkerInstance : cachedWorkerInstance = instantiateWorker());
  }
  async function experimentalSolve3x3x3IgnoringCenters(s) {
    const cwi = await getCachedWorkerInstance();
    return Alg.fromString(await cwi.solve333ToString(s));
  }
  var reidEdgeOrder = "UF UR UB UL DF DR DB DL FR FL BR BL".split(" ");
  var reidCornerOrder = "UFR URB UBL ULF DRF DFL DLB DBR".split(" ");
  var centerOrder = "U L F R B D".split(" ");
  var $intern_3 = { 3: 1 };
  var $intern_9 = 4194303;
  var $intern_10 = 1048575;
  var $intern_11 = 524288;
  var $intern_26 = { 11: 1, 3: 1 };
  var $intern_27 = { 17: 1, 3: 1 };
  var $intern_28 = 14540032;
  var $intern_30 = { 10: 1, 3: 1 };
  var _;
  var prototypesByTypeId_0 = {};
  function typeMarkerFn() {
  }
  function portableObjCreate(obj) {
    function F() {
    }
    F.prototype = obj || {};
    return new F();
  }
  function maybeGetClassLiteralFromPlaceHolder_0(entry) {
    return entry instanceof Array ? entry[0] : null;
  }
  function defineClass(typeId, superTypeId, castableTypeMap) {
    var prototypesByTypeId = prototypesByTypeId_0;
    var createSubclassPrototype = createSubclassPrototype_0;
    var maybeGetClassLiteralFromPlaceHolder = maybeGetClassLiteralFromPlaceHolder_0;
    var prototype_0 = prototypesByTypeId[typeId];
    var clazz = maybeGetClassLiteralFromPlaceHolder(prototype_0);
    if (prototype_0 && !clazz) {
      _ = prototype_0;
    } else {
      _ = prototypesByTypeId[typeId] = !superTypeId ? {} : createSubclassPrototype(superTypeId);
      _.castableTypeMap$ = castableTypeMap;
      _.constructor = _;
      !superTypeId && (_.typeMarker$ = typeMarkerFn);
    }
    for (var i2 = 3; i2 < arguments.length; ++i2) {
      arguments[i2].prototype = _;
    }
    clazz && (_.___clazz$ = clazz);
  }
  function createSubclassPrototype_0(superTypeId) {
    var prototypesByTypeId = prototypesByTypeId_0;
    return portableObjCreate(prototypesByTypeId[superTypeId]);
  }
  function Object_0() {
  }
  defineClass(1, null, {}, Object_0);
  function narrow_byte(x_0) {
    return x_0 << 24 >> 24;
  }
  function Class() {
    this.typeName = null;
    this.simpleName = null;
    this.packageName = null;
    this.compoundName = null;
    this.canonicalName = null;
    this.typeId = null;
    this.arrayLiterals = null;
  }
  function createClassObject(packageName, compoundClassName) {
    var clazz;
    clazz = new Class();
    clazz.packageName = packageName;
    clazz.compoundName = compoundClassName;
    return clazz;
  }
  function createForClass(packageName, compoundClassName, typeId) {
    var clazz;
    clazz = createClassObject(packageName, compoundClassName);
    maybeSetClassLiteral(typeId, clazz);
    return clazz;
  }
  function createForInterface(packageName, compoundClassName) {
    var clazz;
    clazz = createClassObject(packageName, compoundClassName);
    clazz.modifiers = 2;
    return clazz;
  }
  function createForPrimitive(className, primitiveTypeId) {
    var clazz;
    clazz = createClassObject("", className);
    clazz.typeId = primitiveTypeId;
    clazz.modifiers = 1;
    return clazz;
  }
  function getClassLiteralForArray_0(leafClass, dimensions) {
    var arrayLiterals = leafClass.arrayLiterals = leafClass.arrayLiterals || [];
    return arrayLiterals[dimensions] || (arrayLiterals[dimensions] = leafClass.createClassLiteralForArray(dimensions));
  }
  function getPrototypeForClass(clazz) {
    if (clazz.isPrimitive()) {
      return null;
    }
    var typeId = clazz.typeId;
    var prototype_0 = prototypesByTypeId_0[typeId];
    return prototype_0;
  }
  function maybeSetClassLiteral(typeId, clazz) {
    if (!typeId) {
      return;
    }
    clazz.typeId = typeId;
    var prototype_0 = getPrototypeForClass(clazz);
    if (!prototype_0) {
      prototypesByTypeId_0[typeId] = [clazz];
      return;
    }
    prototype_0.___clazz$ = clazz;
  }
  defineClass(79, 1, {}, Class);
  _.createClassLiteralForArray = function createClassLiteralForArray(dimensions) {
    var clazz;
    clazz = new Class();
    clazz.modifiers = 4;
    dimensions > 1 ? clazz.componentType = getClassLiteralForArray_0(this, dimensions - 1) : clazz.componentType = this;
    return clazz;
  };
  _.isPrimitive = function isPrimitive() {
    return (this.modifiers & 1) != 0;
  };
  function getClassLiteralForArray(clazz, dimensions) {
    return getClassLiteralForArray_0(clazz, dimensions);
  }
  function initDim(leafClassLiteral, castableTypeMap, elementTypeId, length_0, elementTypeCategory, dimensions) {
    var result;
    result = initializeArrayElementsWithDefaults(elementTypeCategory, length_0);
    initValues(getClassLiteralForArray(leafClassLiteral, dimensions), castableTypeMap, elementTypeId, elementTypeCategory, result);
    return result;
  }
  function initDims(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, count) {
    return initDims_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, 0, count);
  }
  function initDims_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, index_0, count) {
    var elementTypeCategory, i2, isLastDim, length_0, result;
    length_0 = dimExprs[index_0];
    isLastDim = index_0 == count - 1;
    elementTypeCategory = isLastDim ? leafElementTypeCategory : 0;
    result = initializeArrayElementsWithDefaults(elementTypeCategory, length_0);
    initValues(getClassLiteralForArray(leafClassLiteral, count - index_0), castableTypeMapExprs[index_0], elementTypeIds[index_0], elementTypeCategory, result);
    if (!isLastDim) {
      ++index_0;
      for (i2 = 0; i2 < length_0; ++i2) {
        result[i2] = initDims_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, index_0, count);
      }
    }
    return result;
  }
  function initValues(arrayClass, castableTypeMap, elementTypeId, elementTypeCategory, array) {
    array.___clazz$ = arrayClass;
    array.castableTypeMap$ = castableTypeMap;
    array.typeMarker$ = typeMarkerFn;
    array.__elementTypeId$ = elementTypeId;
    array.__elementTypeCategory$ = elementTypeCategory;
    return array;
  }
  function initializeArrayElementsWithDefaults(elementTypeCategory, length_0) {
    var array = new Array(length_0);
    var initValue;
    switch (elementTypeCategory) {
      case 6:
        initValue = { l: 0, m: 0, h: 0 };
        break;
      case 7:
        initValue = 0;
        break;
      case 8:
        initValue = false;
        break;
      default:
        return array;
    }
    for (var i2 = 0; i2 < length_0; ++i2) {
      array[i2] = initValue;
    }
    return array;
  }
  function create(value_0) {
    var a0, a1, a2;
    a0 = value_0 & $intern_9;
    a1 = value_0 >> 22 & $intern_9;
    a2 = value_0 < 0 ? $intern_10 : 0;
    return create0(a0, a1, a2);
  }
  function create0(l, m, h) {
    return { l, m, h };
  }
  function and(a, b) {
    return { l: a.l & b.l, m: a.m & b.m, h: a.h & b.h };
  }
  function fromInt(value_0) {
    var rebase, result;
    if (value_0 > -129 && value_0 < 128) {
      rebase = value_0 + 128;
      boxedValues == null && (boxedValues = initDim(Lcom_google_gwt_lang_LongLibBase$LongEmul_2_classLit, $intern_3, 293, 256, 0, 1));
      result = boxedValues[rebase];
      !result && (result = boxedValues[rebase] = create(value_0));
      return result;
    }
    return create(value_0);
  }
  function or(a, b) {
    return { l: a.l | b.l, m: a.m | b.m, h: a.h | b.h };
  }
  function shl(a, n) {
    var res0, res1, res2;
    n &= 63;
    if (n < 22) {
      res0 = a.l << n;
      res1 = a.m << n | a.l >> 22 - n;
      res2 = a.h << n | a.m >> 22 - n;
    } else if (n < 44) {
      res0 = 0;
      res1 = a.l << n - 22;
      res2 = a.m << n - 22 | a.l >> 44 - n;
    } else {
      res0 = 0;
      res1 = 0;
      res2 = a.l << n - 44;
    }
    return { l: res0 & $intern_9, m: res1 & $intern_9, h: res2 & $intern_10 };
  }
  function shr(a, n) {
    var a2, negative, res0, res1, res2;
    n &= 63;
    a2 = a.h;
    negative = (a2 & $intern_11) != 0;
    negative && (a2 |= -1048576);
    if (n < 22) {
      res2 = a2 >> n;
      res1 = a.m >> n | a2 << 22 - n;
      res0 = a.l >> n | a.m << 22 - n;
    } else if (n < 44) {
      res2 = negative ? $intern_10 : 0;
      res1 = a2 >> n - 22;
      res0 = a.m >> n - 22 | a2 << 44 - n;
    } else {
      res2 = negative ? $intern_10 : 0;
      res1 = negative ? $intern_9 : 0;
      res0 = a2 >> n - 44;
    }
    return { l: res0 & $intern_9, m: res1 & $intern_9, h: res2 & $intern_10 };
  }
  function sub_0(a, b) {
    var sum0, sum1, sum2;
    sum0 = a.l - b.l;
    sum1 = a.m - b.m + (sum0 >> 22);
    sum2 = a.h - b.h + (sum1 >> 22);
    return { l: sum0 & $intern_9, m: sum1 & $intern_9, h: sum2 & $intern_10 };
  }
  function toInt(a) {
    return a.l | a.m << 22;
  }
  var boxedValues;
  var Ljava_lang_String_2_classLit = createForClass("java.lang", "String", 2);
  function equals_7(array1, array2) {
    var i2;
    if (array1 === array2) {
      return true;
    }
    if (array1.length != array2.length) {
      return false;
    }
    for (i2 = 0; i2 < array1.length; ++i2) {
      if (array1[i2] != array2[i2]) {
        return false;
      }
    }
    return true;
  }
  var $clinit_CoordCube_ran = false;
  function $clinit_CoordCube() {
    if ($clinit_CoordCube_ran) {
      return;
    }
    $clinit_CoordCube_ran = true;
    UDSliceMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [495, 18], 2);
    TwistMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [324, 18], 2);
    FlipMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [336, 18], 2);
    UDSliceConj = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [495, 8], 2);
    UDSliceTwistPrun = initDim(I_classLit, $intern_27, 0, 20048, 7, 1);
    UDSliceFlipPrun = initDim(I_classLit, $intern_27, 0, 20791, 7, 1);
    TwistFlipPrun = initDim(I_classLit, $intern_27, 0, 82945, 7, 1);
    CPermMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [2768, 10], 2);
    EPermMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [2768, 10], 2);
    MPermMove = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [24, 10], 2);
    MPermConj = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [24, 16], 2);
    CCombPConj = initDims(C_classLit, [$intern_3, $intern_26], [11, 0], 7, [140, 16], 2);
    MCPermPrun = initDim(I_classLit, $intern_27, 0, 8305, 7, 1);
    EPermCCombPPrun = initDim(I_classLit, $intern_27, 0, 48441, 7, 1);
  }
  function CoordCube() {
    $clinit_CoordCube();
  }
  defineClass(31, 1, { 31: 1 }, CoordCube);
  _.flip = 0;
  _.flipc = 0;
  _.fsym = 0;
  _.prun = 0;
  _.slice_0 = 0;
  _.tsym = 0;
  _.twist = 0;
  _.twistc = 0;
  var CCombPConj;
  var CPermMove;
  var EPermCCombPPrun;
  var EPermMove;
  var FlipMove;
  var MCPermPrun;
  var MPermConj;
  var MPermMove;
  var TwistFlipPrun;
  var TwistMove;
  var UDSliceConj;
  var UDSliceFlipPrun;
  var UDSliceMove;
  var UDSliceTwistPrun;
  var Lorg_cubing_min2phase_client_CoordCube_2_classLit = createForClass("org.cubing.min2phase.client", "CoordCube", 31);
  var $clinit_CubieCube_ran = false;
  function $clinit_CubieCube() {
    if ($clinit_CubieCube_ran) {
      return;
    }
    $clinit_CubieCube_ran = true;
    CubeSym = initDim(Lorg_cubing_min2phase_client_CubieCube_2_classLit, $intern_3, 7, 16, 0, 1);
    moveCube = initDim(Lorg_cubing_min2phase_client_CubieCube_2_classLit, $intern_3, 7, 18, 0, 1);
    moveCubeSym = initDim(J_classLit, $intern_3, 0, 18, 6, 1);
    firstMoveSym = initDim(I_classLit, $intern_27, 0, 48, 7, 1);
    SymMult = initDims(I_classLit, [$intern_3, $intern_27], [17, 0], 7, [16, 16], 2);
    SymMultInv = initDims(I_classLit, [$intern_3, $intern_27], [17, 0], 7, [16, 16], 2);
    SymMove_0 = initDims(I_classLit, [$intern_3, $intern_27], [17, 0], 7, [16, 18], 2);
    Sym8Move = initDim(I_classLit, $intern_27, 0, 144, 7, 1);
    SymMoveUD = initDims(I_classLit, [$intern_3, $intern_27], [17, 0], 7, [16, 18], 2);
    FlipS2R = initDim(C_classLit, $intern_26, 0, 336, 7, 1);
    TwistS2R = initDim(C_classLit, $intern_26, 0, 324, 7, 1);
    EPermS2R = initDim(C_classLit, $intern_26, 0, 2768, 7, 1);
    Perm2CombP = initDim(B_classLit, $intern_30, 0, 2768, 7, 1);
    PermInvEdgeSym = initDim(C_classLit, $intern_26, 0, 2768, 7, 1);
    MPermInv = initDim(B_classLit, $intern_30, 0, 24, 7, 1);
    FlipR2S = initDim(C_classLit, $intern_26, 0, 2048, 7, 1);
    TwistR2S = initDim(C_classLit, $intern_26, 0, 2187, 7, 1);
    EPermR2S = initDim(C_classLit, $intern_26, 0, 40320, 7, 1);
    FlipS2RF = initDim(C_classLit, $intern_26, 0, 2688, 7, 1);
    urf1 = new CubieCube_0(2531, 1373, 67026819, 1367);
    urf2 = new CubieCube_0(2089, 1906, 322752913, 2040);
    urfMove = initValues(getClassLiteralForArray(B_classLit, 2), $intern_3, 10, 0, [
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9])
    ]);
    initMove();
    initSym();
  }
  function $$init(this$static) {
    this$static.ca = initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [0, 1, 2, 3, 4, 5, 6, 7]);
    this$static.ea = initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]);
  }
  function $URFConjugate(this$static) {
    !this$static.temps && (this$static.temps = new CubieCube());
    CornMult(urf2, this$static, this$static.temps);
    CornMult(this$static.temps, urf1, this$static);
    EdgeMult(urf2, this$static, this$static.temps);
    EdgeMult(this$static.temps, urf1, this$static);
  }
  function $copy(this$static, c) {
    var i2, i0;
    for (i0 = 0; i0 < 8; i0++) {
      this$static.ca[i0] = c.ca[i0];
    }
    for (i2 = 0; i2 < 12; i2++) {
      this$static.ea[i2] = c.ea[i2];
    }
  }
  function $invCubieCube(this$static) {
    var corn, edge;
    !this$static.temps && (this$static.temps = new CubieCube());
    for (edge = 0; edge < 12; edge++) {
      this$static.temps.ea[this$static.ea[edge] >> 1] = (edge << 1 | this$static.ea[edge] & 1) << 24 >> 24;
    }
    for (corn = 0; corn < 8; corn++) {
      this$static.temps.ca[this$static.ca[corn] & 7] = (corn | 32 >> (this$static.ca[corn] >> 3) & 24) << 24 >> 24;
    }
    $copy(this$static, this$static.temps);
  }
  function $selfSymmetry(this$static) {
    var c, cperm, cpermx, d2, i2, sym, urfInv;
    c = new CubieCube_1(this$static);
    d2 = new CubieCube();
    cperm = ESym2CSym(EPermR2S[getNPerm(c.ca, 8, false)]) >> 4;
    sym = { l: 0, m: 0, h: 0 };
    for (urfInv = 0; urfInv < 6; urfInv++) {
      cpermx = ESym2CSym(EPermR2S[getNPerm(c.ca, 8, false)]) >> 4;
      if (cperm == cpermx) {
        for (i2 = 0; i2 < 16; i2++) {
          CornConjugate(c, SymMultInv[0][i2], d2);
          if (equals_7(d2.ca, this$static.ca)) {
            EdgeConjugate(c, SymMultInv[0][i2], d2);
            equals_7(d2.ea, this$static.ea) && (sym = or(sym, shl({ l: 1, m: 0, h: 0 }, (urfInv << 4 | i2) < 48 ? urfInv << 4 | i2 : 48)));
          }
        }
      }
      $URFConjugate(c);
      urfInv % 3 == 2 && $invCubieCube(c);
    }
    return sym;
  }
  function $setFlip(this$static, idx) {
    var i2, parity, val;
    parity = 0;
    for (i2 = 10; i2 >= 0; --i2, idx >>= 1) {
      parity ^= val = idx & 1;
      this$static.ea[i2] = (this$static.ea[i2] & -2 | val) << 24 >> 24;
    }
    this$static.ea[11] = (this$static.ea[11] & -2 | parity) << 24 >> 24;
  }
  function $setTwist(this$static, idx) {
    var i2, twst, val;
    twst = 15;
    for (i2 = 6; i2 >= 0; --i2, idx = ~~(idx / 3)) {
      twst -= val = idx % 3;
      this$static.ca[i2] = (this$static.ca[i2] & 7 | val << 3) << 24 >> 24;
    }
    this$static.ca[7] = (this$static.ca[7] & 7 | twst % 3 << 3) << 24 >> 24;
  }
  function CornConjugate(a, idx, b) {
    $clinit_CubieCube();
    var corn, ori, oriA, oriB, s, sinv;
    sinv = CubeSym[SymMultInv[0][idx]];
    s = CubeSym[idx];
    for (corn = 0; corn < 8; corn++) {
      oriA = sinv.ca[a.ca[s.ca[corn] & 7] & 7] >> 3;
      oriB = a.ca[s.ca[corn] & 7] >> 3;
      ori = oriA < 3 ? oriB : (3 - oriB) % 3;
      b.ca[corn] = (sinv.ca[a.ca[s.ca[corn] & 7] & 7] & 7 | ori << 3) << 24 >> 24;
    }
  }
  function CornMult(a, b, prod) {
    $clinit_CubieCube();
    var corn, oriA, oriB;
    for (corn = 0; corn < 8; corn++) {
      oriA = a.ca[b.ca[corn] & 7] >> 3;
      oriB = b.ca[corn] >> 3;
      prod.ca[corn] = (a.ca[b.ca[corn] & 7] & 7 | (oriA + oriB) % 3 << 3) << 24 >> 24;
    }
  }
  function CornMultFull(a, b, prod) {
    var corn, ori, oriA, oriB;
    for (corn = 0; corn < 8; corn++) {
      oriA = a.ca[b.ca[corn] & 7] >> 3;
      oriB = b.ca[corn] >> 3;
      ori = oriA + (oriA < 3 ? oriB : 6 - oriB);
      ori = ori % 3 + (oriA < 3 == oriB < 3 ? 0 : 3);
      prod.ca[corn] = (a.ca[b.ca[corn] & 7] & 7 | ori << 3) << 24 >> 24;
    }
  }
  function CubieCube() {
    $clinit_CubieCube();
    $$init(this);
  }
  function CubieCube_0(cperm, twist, eperm, flip) {
    $$init(this);
    setNPerm(this.ca, cperm, 8, false);
    $setTwist(this, twist);
    setNPerm(this.ea, eperm, 12, true);
    $setFlip(this, flip);
  }
  function CubieCube_1(c) {
    $$init(this);
    $copy(this, c);
  }
  function ESym2CSym(idx) {
    $clinit_CubieCube();
    return idx ^ $intern_28 >> ((idx & 15) << 1) & 3;
  }
  function EdgeConjugate(a, idx, b) {
    $clinit_CubieCube();
    var ed, s, sinv;
    sinv = CubeSym[SymMultInv[0][idx]];
    s = CubeSym[idx];
    for (ed = 0; ed < 12; ed++) {
      b.ea[ed] = (sinv.ea[a.ea[s.ea[ed] >> 1] >> 1] ^ a.ea[s.ea[ed] >> 1] & 1 ^ s.ea[ed] & 1) << 24 >> 24;
    }
  }
  function EdgeMult(a, b, prod) {
    $clinit_CubieCube();
    var ed;
    for (ed = 0; ed < 12; ed++) {
      prod.ea[ed] = (a.ea[b.ea[ed] >> 1] ^ b.ea[ed] & 1) << 24 >> 24;
    }
  }
  function initMove() {
    var a, p;
    moveCube[0] = new CubieCube_0(15120, 0, 119750400, 0);
    moveCube[3] = new CubieCube_0(21021, 1494, 323403417, 0);
    moveCube[6] = new CubieCube_0(8064, 1236, 29441808, 550);
    moveCube[9] = new CubieCube_0(9, 0, 5880, 0);
    moveCube[12] = new CubieCube_0(1230, 412, 2949660, 0);
    moveCube[15] = new CubieCube_0(224, 137, 328552, 137);
    for (a = 0; a < 18; a += 3) {
      for (p = 0; p < 2; p++) {
        moveCube[a + p + 1] = new CubieCube();
        EdgeMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
        CornMult(moveCube[a + p], moveCube[a], moveCube[a + p + 1]);
      }
    }
  }
  function initSym() {
    var c, d2, f2, i2, i0, i1, i22, j, j0, j1, k, lr2, m, s, t, u4;
    c = new CubieCube();
    d2 = new CubieCube();
    f2 = new CubieCube_0(28783, 0, 259268407, 0);
    u4 = new CubieCube_0(15138, 0, 119765538, 7);
    lr2 = new CubieCube_0(5167, 0, 83473207, 0);
    for (i0 = 0; i0 < 8; i0++) {
      lr2.ca[i0] = narrow_byte(lr2.ca[i0] | 24);
    }
    for (i1 = 0; i1 < 16; i1++) {
      CubeSym[i1] = new CubieCube_1(c);
      CornMultFull(c, u4, d2);
      EdgeMult(c, u4, d2);
      t = d2;
      d2 = c;
      c = t;
      if (i1 % 4 == 3) {
        CornMultFull(t, lr2, d2);
        EdgeMult(t, lr2, d2);
        t = d2;
        d2 = c;
        c = t;
      }
      if (i1 % 8 == 7) {
        CornMultFull(t, f2, d2);
        EdgeMult(t, f2, d2);
        t = d2;
        d2 = c;
        c = t;
      }
    }
    for (i22 = 0; i22 < 16; i22++) {
      for (j0 = 0; j0 < 16; j0++) {
        CornMultFull(CubeSym[i22], CubeSym[j0], c);
        for (k = 0; k < 16; k++) {
          if (equals_7(CubeSym[k].ca, c.ca)) {
            SymMult[i22][j0] = k;
            SymMultInv[k][j0] = i22;
            break;
          }
        }
      }
    }
    for (j1 = 0; j1 < 18; j1++) {
      for (s = 0; s < 16; s++) {
        CornConjugate(moveCube[j1], SymMultInv[0][s], c);
        for (m = 0; m < 18; m++) {
          if (equals_7(moveCube[m].ca, c.ca)) {
            SymMove_0[s][j1] = m;
            SymMoveUD[s][($clinit_Util(), std2ud)[j1]] = std2ud[m];
            break;
          }
        }
        s % 2 == 0 && (Sym8Move[j1 << 3 | s >> 1] = SymMove_0[s][j1]);
      }
    }
    for (i2 = 0; i2 < 18; i2++) {
      moveCubeSym[i2] = $selfSymmetry(moveCube[i2]);
      j = i2;
      for (s = 0; s < 48; s++) {
        SymMove_0[s % 16][j] < i2 && (firstMoveSym[s] |= 1 << i2);
        s % 16 == 15 && (j = urfMove[2][j]);
      }
    }
  }
  var CubeSym;
  var EPermR2S;
  var EPermS2R;
  var FlipR2S;
  var FlipS2R;
  var FlipS2RF;
  var MPermInv;
  var Perm2CombP;
  var PermInvEdgeSym;
  var Sym8Move;
  var SymMove_0;
  var SymMoveUD;
  var SymMult;
  var SymMultInv;
  var TwistR2S;
  var TwistS2R;
  var firstMoveSym;
  var moveCube;
  var moveCubeSym;
  var urf1;
  var urf2;
  var urfMove;
  var Lorg_cubing_min2phase_client_CubieCube_2_classLit = createForClass("org.cubing.min2phase.client", "CubieCube", 7);
  function Search() {
    var i2, i0, i1;
    this.move = initDim(I_classLit, $intern_27, 0, 31, 7, 1);
    this.nodeUD = initDim(Lorg_cubing_min2phase_client_CoordCube_2_classLit, $intern_3, 31, 21, 0, 1);
    this.nodeRL = initDim(Lorg_cubing_min2phase_client_CoordCube_2_classLit, $intern_3, 31, 21, 0, 1);
    this.nodeFB = initDim(Lorg_cubing_min2phase_client_CoordCube_2_classLit, $intern_3, 31, 21, 0, 1);
    this.cc = new CubieCube();
    this.urfCubieCube = initDim(Lorg_cubing_min2phase_client_CubieCube_2_classLit, $intern_3, 7, 6, 0, 1);
    this.urfCoordCube = initDim(Lorg_cubing_min2phase_client_CoordCube_2_classLit, $intern_3, 31, 6, 0, 1);
    this.phase1Cubie = initDim(Lorg_cubing_min2phase_client_CubieCube_2_classLit, $intern_3, 7, 21, 0, 1);
    this.preMoveCubes = initDim(Lorg_cubing_min2phase_client_CubieCube_2_classLit, $intern_3, 7, 21, 0, 1);
    this.preMoves = initDim(I_classLit, $intern_27, 0, 20, 7, 1);
    for (i0 = 0; i0 < 21; i0++) {
      this.nodeUD[i0] = new CoordCube();
      this.nodeRL[i0] = new CoordCube();
      this.nodeFB[i0] = new CoordCube();
      this.phase1Cubie[i0] = new CubieCube();
    }
    for (i1 = 0; i1 < 6; i1++) {
      this.urfCubieCube[i1] = new CubieCube();
      this.urfCoordCube[i1] = new CoordCube();
    }
    for (i2 = 0; i2 < 20; i2++) {
      this.preMoveCubes[i2 + 1] = new CubieCube();
    }
  }
  defineClass(72, 1, {}, Search);
  _.allowShorter = false;
  _.conjMask = 0;
  _.depth1 = 0;
  _.isRec = false;
  _.length1 = 0;
  _.maxDep2 = 0;
  _.maxPreMoves = 0;
  _.preMoveLen = 0;
  _.probe = { l: 0, m: 0, h: 0 };
  _.probeMax = { l: 0, m: 0, h: 0 };
  _.probeMin = { l: 0, m: 0, h: 0 };
  _.selfSym = { l: 0, m: 0, h: 0 };
  _.solLen = 0;
  _.urfIdx = 0;
  _.valid1 = 0;
  _.verbose = 0;
  var $clinit_Util_ran = false;
  function $clinit_Util() {
    if ($clinit_Util_ran) {
      return;
    }
    $clinit_Util_ran = true;
    var i2, i0, i1, ix, j, jx;
    cornerFacelet = initValues(getClassLiteralForArray(B_classLit, 2), $intern_3, 10, 0, [
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [8, 9, 20]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [6, 18, 38]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [0, 36, 47]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [2, 45, 11]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [29, 26, 15]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [27, 44, 24]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [33, 53, 42]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [35, 17, 51])
    ]);
    edgeFacelet = initValues(getClassLiteralForArray(B_classLit, 2), $intern_3, 10, 0, [
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [5, 10]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [7, 19]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [3, 37]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [1, 46]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [32, 16]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [28, 25]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [30, 43]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [34, 52]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [23, 12]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [21, 41]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [50, 39]),
      initValues(getClassLiteralForArray(B_classLit, 1), $intern_30, 0, 7, [48, 14])
    ]);
    Cnk = initDims(I_classLit, [$intern_3, $intern_27], [17, 0], 7, [13, 13], 2);
    move2str = initValues(getClassLiteralForArray(Ljava_lang_String_2_classLit, 1), $intern_3, 2, 4, [
      "U ",
      "U2",
      "U'",
      "R ",
      "R2",
      "R'",
      "F ",
      "F2",
      "F'",
      "D ",
      "D2",
      "D'",
      "L ",
      "L2",
      "L'",
      "B ",
      "B2",
      "B'"
    ]);
    ud2std = initValues(getClassLiteralForArray(I_classLit, 1), $intern_27, 0, 7, [0, 1, 2, 4, 7, 9, 10, 11, 13, 16, 3, 5, 6, 8, 12, 14, 15, 17]);
    std2ud = initDim(I_classLit, $intern_27, 0, 18, 7, 1);
    ckmv2bit = initDim(I_classLit, $intern_27, 0, 11, 7, 1);
    for (i0 = 0; i0 < 18; i0++) {
      std2ud[ud2std[i0]] = i0;
    }
    for (i1 = 0; i1 < 10; i1++) {
      ix = ~~(ud2std[i1] / 3);
      ckmv2bit[i1] = 0;
      for (j = 0; j < 10; j++) {
        jx = ~~(ud2std[j] / 3);
        ckmv2bit[i1] |= (ix == jx || ix % 3 == jx % 3 && ix >= jx ? 1 : 0) << j;
      }
    }
    ckmv2bit[10] = 0;
    for (i2 = 0; i2 < 13; i2++) {
      Cnk[i2][0] = Cnk[i2][i2] = 1;
      for (j = 1; j < i2; j++) {
        Cnk[i2][j] = Cnk[i2 - 1][j - 1] + Cnk[i2 - 1][j];
      }
    }
  }
  function getNPerm(arr, n, isEdge) {
    $clinit_Util();
    var i2, idx, v, val;
    idx = 0;
    val = { l: 1323536, m: 2777561, h: 1043915 };
    for (i2 = 0; i2 < n - 1; i2++) {
      v = getVal(arr[i2], isEdge) << 2;
      idx = (n - i2) * idx + toInt(and(shr(val, v), { l: 15, m: 0, h: 0 }));
      val = sub_0(val, shl({ l: 1118480, m: 279620, h: 69905 }, v));
    }
    return idx;
  }
  function getVal(val0, isEdge) {
    return isEdge ? val0 >> 1 : val0 & 7;
  }
  function setNPerm(arr, idx, n, isEdge) {
    $clinit_Util();
    var extract, i2, m, p, v, val;
    val = { l: 1323536, m: 2777561, h: 1043915 };
    extract = { l: 0, m: 0, h: 0 };
    for (p = 2; p <= n; p++) {
      extract = or(shl(extract, 4), fromInt(idx % p));
      idx = ~~(idx / p);
    }
    for (i2 = 0; i2 < n - 1; i2++) {
      v = (toInt(extract) & 15) << 2;
      extract = shr(extract, 4);
      arr[i2] = setVal(arr[i2], toInt(and(shr(val, v), { l: 15, m: 0, h: 0 })), isEdge);
      m = sub_0(shl({ l: 1, m: 0, h: 0 }, v), { l: 1, m: 0, h: 0 });
      val = or(and(val, m), and(shr(val, 4), {
        l: ~m.l & $intern_9,
        m: ~m.m & $intern_9,
        h: ~m.h & $intern_10
      }));
    }
    arr[n - 1] = setVal(arr[n - 1], toInt(and(val, { l: 15, m: 0, h: 0 })), isEdge);
  }
  function setVal(val0, val, isEdge) {
    return (isEdge ? val << 1 | val0 & 1 : val | val0 & -8) << 24 >> 24;
  }
  var Cnk;
  var ckmv2bit;
  var cornerFacelet;
  var edgeFacelet;
  var move2str;
  var std2ud;
  var ud2std;
  function Util$Solution() {
    this.moves = initDim(I_classLit, $intern_27, 0, 31, 7, 1);
  }
  defineClass(150, 1, {}, Util$Solution);
  _.depth1 = 0;
  _.length_0 = 0;
  _.urfIdx = 0;
  _.verbose = 0;
  var I_classLit = createForPrimitive("int", "I");
  createForClass("com.google.gwt.lang", "CollapsedPropertyHolder", 252);
  createForClass("com.google.gwt.lang", "JavaClassHierarchySetupUtil", 254);
  var Lcom_google_gwt_lang_LongLibBase$LongEmul_2_classLit = createForClass("com.google.gwt.lang", "LongLibBase/LongEmul", null);
  createForClass("com.google.gwt.lang", "ModuleUtils", 257);
  var B_classLit = createForPrimitive("byte", "B");
  var J_classLit = createForPrimitive("long", "J");
  var C_classLit = createForPrimitive("char", "C");
  createForClass("com.google.gwt.user.client.rpc", "XsrfToken", null), createForInterface("java.util", "Map/Entry");
  var extraBit = new Alg("R' U' F");

  // node_modules/cubing/dist/esm/search/index.js
  init_chunk_EWRBHQFX();
  init_chunk_WO2AXYFE();

  // node_modules/cubing/dist/esm/kpuzzle/index.js
  init_chunk_EWRBHQFX();
  init_chunk_WO2AXYFE();

  // node_modules/cubing/dist/esm/alg/index.js
  init_chunk_EWRBHQFX();
  init_chunk_WO2AXYFE();

  // entry.js
  async function solveFromFacelets(facelets) {
    const state = faceletsToKPuzzleState(facelets);
    const solution = await experimentalSolve3x3x3IgnoringCenters(state);
    return solution.toString();
  }
  function faceletsToKPuzzleState(f) {
    const CORNER_STICKERS = [
      [8, 20, 9],
      // UFR: [U[8], F[2], R[0]]
      [2, 11, 45],
      // UBR: [U[2], R[2], B[0]]
      [0, 47, 36],
      // UBL: [U[0], B[2], L[0]]
      [6, 38, 18],
      // UFL: [U[6], L[2], F[0]]
      [29, 15, 26],
      // DFR: [D[2], R[6], F[8]]
      [27, 24, 44],
      // DFL: [D[0], F[6], L[8]]
      [33, 42, 53],
      // DBL: [D[6], L[6], B[8]]
      [35, 51, 17]
      // DBR: [D[8], B[6], R[8]]
    ];
    const CORNER_FACE_CYCLES = [
      [0, 2, 1],
      // UFR: [U, F, R]
      [0, 1, 5],
      // UBR: [U, R, B]
      [0, 5, 4],
      // UBL: [U, B, L]
      [0, 4, 2],
      // UFL: [U, L, F]
      [3, 1, 2],
      // DFR: [D, R, F]
      [3, 2, 4],
      // DFL: [D, F, L]
      [3, 4, 5],
      // DBL: [D, L, B]
      [3, 5, 1]
      // DBR: [D, B, R]
    ];
    const EDGE_STICKERS = [
      [7, 19],
      // UF:  U[7],  F[1]
      [5, 10],
      // UR:  U[5],  R[1]
      [1, 46],
      // UB:  U[1],  B[1]
      [3, 37],
      // UL:  U[3],  L[1]
      [28, 25],
      // DF:  D[1],  F[7]
      [32, 16],
      // DR:  D[5],  R[7]
      [34, 52],
      // DB:  D[7],  B[7]
      [30, 43],
      // DL:  D[3],  L[7]
      [23, 12],
      // FR:  F[5],  R[3]
      [21, 41],
      // FL:  F[3],  L[5]
      [48, 14],
      // BR:  B[3],  R[5]
      [50, 39]
      // BL:  B[5],  L[3]
    ];
    const EDGE_FACE_CYCLES = [
      [0, 2],
      [0, 1],
      [0, 5],
      [0, 4],
      // UF, UR, UB, UL
      [3, 2],
      [3, 1],
      [3, 5],
      [3, 4],
      // DF, DR, DB, DL
      [2, 1],
      [2, 4],
      [5, 1],
      [5, 4]
      // FR, FL, BR, BL
    ];
    const cornerPermutation = new Array(8);
    const cornerOrientation = new Array(8);
    for (let pos = 0; pos < 8; pos++) {
      const [s0, s1, s2] = CORNER_STICKERS[pos];
      const colors = [f[s0], f[s1], f[s2]];
      const udIdx = colors.findIndex((c) => c === 0 || c === 3);
      cornerOrientation[pos] = (3 - udIdx) % 3;
      const normColors = [
        colors[udIdx],
        colors[(udIdx + 1) % 3],
        colors[(udIdx + 2) % 3]
      ];
      let pieceIdx = -1;
      for (let p = 0; p < 8; p++) {
        const fc = CORNER_FACE_CYCLES[p];
        if (fc[0] === normColors[0] && fc[1] === normColors[1] && fc[2] === normColors[2]) {
          pieceIdx = p;
          break;
        }
      }
      cornerPermutation[pos] = pieceIdx;
    }
    const edgePermutation = new Array(12);
    const edgeOrientation = new Array(12);
    for (let pos = 0; pos < 12; pos++) {
      const [s0, s1] = EDGE_STICKERS[pos];
      const c0 = f[s0], c1 = f[s1];
      let piecePrimary;
      if (c0 === 0 || c0 === 3 || c1 === 0 || c1 === 3) {
        piecePrimary = c0 === 0 || c0 === 3 ? c0 : c1;
      } else {
        piecePrimary = c0 === 2 || c0 === 5 ? c0 : c1;
      }
      const ori = piecePrimary === c0 ? 0 : 1;
      edgeOrientation[pos] = ori;
      const normC0 = ori === 0 ? c0 : c1;
      const normC1 = ori === 0 ? c1 : c0;
      let pieceIdx = -1;
      for (let p = 0; p < 12; p++) {
        if (EDGE_FACE_CYCLES[p][0] === normC0 && EDGE_FACE_CYCLES[p][1] === normC1) {
          pieceIdx = p;
          break;
        }
      }
      edgePermutation[pos] = pieceIdx;
    }
    const centerPermutation = [0, 1, 2, 3, 4, 5];
    const centerOrientation = [0, 0, 0, 0, 0, 0];
    return {
      CORNERS: { permutation: cornerPermutation, orientation: cornerOrientation },
      EDGES: { permutation: edgePermutation, orientation: edgeOrientation },
      CENTERS: { permutation: centerPermutation, orientation: centerOrientation }
    };
  }
  self.CubingSolver = { solveFromFacelets };
})();
/*! Bundled license information:

comlink/dist/esm/comlink.mjs:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
