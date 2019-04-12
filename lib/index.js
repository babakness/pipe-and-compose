"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `pipe` composes a series of functions passing the output of on function into the input of the next.
 * The first function provided to pipe can of any arity, however, each subsequent function can only accept
 * one parameter. Functions are read from right to left.
 *
 * In the event that the outgoing type doesn't match in the next functions incoming type, a compiler
 * error is raised and the type of the assigned object will have information on where the error occurred.
 * In an TypeScript aware editor, mouse over the object assigned to the `pipe` composition outcome to see result.
 * @example
 * const longerWord = ( word1: string, word2: string ) => word1.length > word2.length ? word1 : word2
 * const longestWord = ( name: string, ...names: string[]) => [name,...names].reduce(longerWord, '')
 * const length = ( xs: string | unknown[] ) => xs.length
 * const longestNameLength = pipe(
 *  longestWord,
 *  length,
 * )
 */
exports.pipe = function (entry) {
    var funcs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        funcs[_i - 1] = arguments[_i];
    }
    return (function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        return funcs.reduce(function (acc, item) { return item.call(item, acc); }, entry.apply(void 0, __spread(arg)));
    });
};
/**
 * Pipeline is simply pipe immediately invoked. The benefit is moving the
 * parameter passed to `pipe` to the first parameter rather than the last.
 * The improves readability. Data flows from the top to the bottom.
 *
 * Like `pipe` in the event of a compiler error arising from a type mismatch in the
 * provided function's input or output, the returned type will be an object
 * which explains where the error occurs.
 * @example
 * const add = (a: number) => (b: number) => a + b
 * const multiply = ( a: number ) => (b: number ) => a * b
 * const double = multiply(2)
 * const half = multiply(.5)
 * const ten = pipeline(
 *   2,
 *   add(3),
 *   double,
 *   double,
 *   half,
 * )
 */
exports.pipeline = function (arg, first) {
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    return exports.pipe.apply(void 0, __spread([first], rest))(arg);
};
var init = function (xs) { return xs.slice(0, -1); };
var last = function (xs) { return xs.slice(-1)[0]; };
/**
 * `compose` composes a series of functions passing the output of on function into the input of the next.
 * The last function provided to pipe can of any arity, however, each subsequent function can only accept
 * one parameter. Functions are read from left to right.
 *
 * In the event that the outgoing type doesn't match in the next functions incoming type, a compiler
 * error is raised and the type of the assigned object will have information on where the error occurred.
 * In an TypeScript aware editor, mouse over the object assigned to the `compose` composition outcome to see result.
 * @example
 * const longerWord = ( word1: string, word2: string ) => word1.length > word2.length ? word1 : word2
 * const longestWord = ( name: string, ...names: string[]) => [name,...names].reduce(longerWord, '')
 * const length = ( xs: string | unknown[] ) => xs.length
 * const longestNameLength = pipe(
 *  length,
 *  longestWord,
 * )
 */
exports.compose = function (first) {
    var funcs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        funcs[_i - 1] = arguments[_i];
    }
    /* `any` is used as return type because on compile error we present an object,
        which will not match this */
    return function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        return init(__spread([first], funcs)).reduceRight(function (acc, item) { return item.call(item, acc); }, last(funcs).apply(void 0, __spread(arg)));
    };
};
