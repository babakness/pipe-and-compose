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
var index_1 = require("./index");
// const errorMessage = ''
var errorCount = 0;
var totalTests = 0;
/* @ts-ignore */
var okLog = function (x) { return (console.log(x), x); };
var errLog = function (x) { return (errorCount++, console.error(x), x); };
var staticType = function (x) { return x; };
var test = function (statement, truth) { return (totalTests++,
    truth
        ? okLog("\u2705 PASSED: " + statement)
        : errLog("\uD83D\uDEAB FAILED: " + statement)); };
/* START `pipe` and `compose` */
var longerWord = function (word1, word2) { return word1.length > word2.length ? word1 : word2; };
var longestWord = function (word) {
    var words = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        words[_i - 1] = arguments[_i];
    }
    return __spread([word], words).reduce(longerWord, '');
};
var length = function (xs) { return xs.length; };
var PIPE_longestNameLength = index_1.pipe(longestWord, length);
var COMPOSE_longestNameLength = index_1.compose(length, longestWord);
var PIPE_intersparse = index_1.pipe(function (text, value) { return ([text.split(''), value]); }, function (_a) {
    var _b = __read(_a, 2), chars = _b[0], value = _b[1];
    return chars.join(value);
});
var COMPOSE_intersparse = index_1.compose(function (_a) {
    var _b = __read(_a, 2), chars = _b[0], value = _b[1];
    return chars.join(value);
}, function (text, value) { return ([text.split(''), value]); });
var sum = function (xs) { return xs.reduce(function (acc, num) { return acc + num; }, 0); };
var PIPE_average = index_1.pipe(function (xs) { return ([sum(xs), xs.length]); }, function (_a) {
    var _b = __read(_a, 2), total = _b[0], length = _b[1];
    return total / length;
});
var PIPE_averageWordLengh = index_1.pipe(function () {
    var words = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        words[_i] = arguments[_i];
    }
    return words.map(length);
}, PIPE_average);
var COMPOSE_averageWordLengh = index_1.compose(PIPE_average, function () {
    var words = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        words[_i] = arguments[_i];
    }
    return words.map(length);
});
var PIPE_longComposition = index_1.pipe(function (n) { return n * 2; }, function (n) { return n / 3; }, String, function (str) { return str.split('').reverse().join('_'); }, function (str) { return new Set(str); }, String, function (str) { return str.match(/(\w+)/g); }, function (xs) { return xs ? xs[1] : null; } // null for type testing only, theoritically unreachable
);
var COMPOSE_longComposition = index_1.compose(function (xs) { return xs ? xs[1] : null; }, // null for type testing only, theoritically unreachable
function (str) { return str.match(/(\w+)/g); }, String, function (str) { return new Set(str); }, function (str) { return str.split('').reverse().join('_'); }, String, function (n) { return n / 3; }, function (n) { return n * 2; });
var sentence = 'heaven is a place on earth';
var sentenceSplit = sentence.split(' ');
var sentenseDashBetweenEachCharacter = 'h-e-a-v-e-n- -i-s- -a- -p-l-a-c-e- -o-n- -e-a-r-t-h';
test('PIPE_longestNameLength type is correct', !!staticType(PIPE_longestNameLength));
test('COMPOSE_longestNameLength type is correct', !!staticType(COMPOSE_longestNameLength));
test('PIPE_intersparse type is correct', !!staticType(PIPE_intersparse));
test('COMPOSE_intersparse type is correct', !!staticType(COMPOSE_intersparse));
test('Pipe_longComposition type is correct', !!staticType(PIPE_longComposition));
test('COMPOSE_longComposition type is correct', !!staticType(COMPOSE_longComposition));
test('pipe longest word rseult', PIPE_longestNameLength('follow', 'your', 'heart') === 6); /*?. $ */
test('compose longest word result', COMPOSE_longestNameLength('follow', 'your', 'heart') === 6); /*?. $ */
test('pipe longest word rseult', PIPE_intersparse(sentence, '-') === sentenseDashBetweenEachCharacter); /*?. $ */
test('compose longest word result', PIPE_intersparse(sentence, '-') === sentenseDashBetweenEachCharacter); /*?. $ */
test('pipe average word length', PIPE_averageWordLengh.apply(void 0, __spread(sentenceSplit)) === 3.5); /*?. $ */
test('compose average word length', COMPOSE_averageWordLengh.apply(void 0, __spread(sentenceSplit)) === 3.5); /*?. $ */
test('pipe long composition', PIPE_longComposition(10) === 'Set'); /*?. $ */
test('compose long composition', COMPOSE_longComposition(10) === 'Set'); /*?. $ */
/* START `pipeline` */
var add = function (a) { return function (b) { return a + b; }; };
var multiply = function (a) { return function (b) { return a * b; }; };
var double = multiply(2);
var half = multiply(.5);
var ten = index_1.pipeline(2, add(3), double, double, half);
test('pipeline computes correctly', ten === 10); /*?. $ */
/* END */
// const catchRuntimeError = ( expectedError: string, statement: string,  wrappedFn: () => unknown  ) => {
//   try {
//     wrappedFn()
//   } catch (e) {
//     return test( `RUNTIME ERROR CHECK: ${statement}`, e.message === expectedError )
//   }
//   return test( `RUNTIME ERROR CHECK: ${statement}`, false )
// }
// const catchFixedRuntimeError = catchRuntimeError.bind( undefined, errorMessage )
console.log(totalTests - errorCount + " / " + totalTests + " Passed");
if (errorCount > 0 && process && process.exit) {
    process.exit(1);
}
