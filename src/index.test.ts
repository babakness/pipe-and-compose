import { compose, pipe, pipeline } from './index'
// const errorMessage = ''

let errorCount = 0
let totalTests = 0

/* @ts-ignore */
const okLog = <T>( x: T): T => (console.log(x),x)
const errLog = <T>( x: T): T => (errorCount++,console.error(x),x)
const staticType = <T>( x: T ): T => x

const test = ( statement: string, truth: boolean ) => (
  totalTests++,
  truth 
    ? okLog(`✅ PASSED: ${statement}`)
    : errLog(`🚫 FAILED: ${statement}`)
)

/* START `pipe` and `compose` */

const longerWord = ( word1: string, word2: string ) => (
  word1.length > word2.length 
    ? word1 
    : word2
)
const longestWord = ( word: string, ...words: string[]) => (
  [word,...words].reduce(longerWord, '')
)
const length = ( xs: string | unknown[] ) => (
  xs.length
)
const PIPE_longestWordLength = pipe(
  longestWord,
  length,
)


// longestWordLength

const COMPOSE_longestWordLength = compose(
  length,
  longestWord,
)

const PIPE_intersparse = pipe( 
  ( text: string, value: string ): [string[], string] => ([ text.split(''), value ]),
  ( [chars, value]: [ string[], string ] ) => chars.join( value )
)

const COMPOSE_intersparse = compose( 
  ( [chars, value]: [ string[], string ] ) => chars.join( value ),
  ( text: string, value: string ): [string[], string] => ([ text.split(''), value ]),
)

const sum = (xs: number[]) => xs.reduce( (acc,num) => acc + num, 0 )
const PIPE_average = pipe(
  ( xs: number[]): [number,number] => ( [ sum(xs), xs.length ] ),
  ( [ total, length ]: [ number, number ] ) => total / length
)
const PIPE_averageWordLengh = pipe(
  ( ...words: string[] ) => words.map( length ),
  PIPE_average
)

const COMPOSE_averageWordLengh = compose(
  PIPE_average,
  ( ...words: string[] ) => words.map( length ),
)


const PIPE_longComposition = pipe(
  ( n: number) => n * 2,
  ( n: number) => n / 3,
  String,
  ( str: string ) => str.split('').reverse().join('_'),
  ( str: string ) => new Set(str),
  String,
  ( str: string ) => str.match(/(\w+)/g),
  ( xs: string[] | null ) => xs ? xs[1] : null // null for type testing only, theoritically unreachable
)


const COMPOSE_longComposition = compose(
  ( xs: string[] | null ) => xs ? xs[1] : null, // null for type testing only, theoritically unreachable
  ( str: string ) => str.match(/(\w+)/g),
  String,
  ( str: string ) => new Set(str),
  ( str: string ) => str.split('').reverse().join('_'),
  String,
  ( n: number) => n / 3,
  ( n: number) => n * 2,

)

const sentence = 'heaven is a place on earth'
const sentenceSplit = sentence.split(' ')
const sentenseDashBetweenEachCharacter = 'h-e-a-v-e-n- -i-s- -a- -p-l-a-c-e- -o-n- -e-a-r-t-h'

test( 'PIPE_longestNameLength type is correct', !!staticType<(word: string, ...words: string[]) => number>(PIPE_longestWordLength) )
test( 'COMPOSE_longestNameLength type is correct', !!staticType<(word: string, ...words: string[]) => number>(COMPOSE_longestWordLength) )

test( 'PIPE_intersparse type is correct', !!staticType<(text: string, value: string) => string>(PIPE_intersparse) )
test( 'COMPOSE_intersparse type is correct', !!staticType<(text: string, value: string) => string>(COMPOSE_intersparse) )

test( 'Pipe_longComposition type is correct', !!staticType< (n: number) => string | null >(PIPE_longComposition))
test( 'COMPOSE_longComposition type is correct', !!staticType< (n: number) => string | null >(COMPOSE_longComposition))

test( 'pipe longest word rseult', 
  PIPE_longestWordLength( 'follow', 'your', 'heart' ) === 6
)  /*?. $ */

test( 'compose longest word result', 
  COMPOSE_longestWordLength( 'follow', 'your', 'heart' ) === 6
)  /*?. $ */

test( 'pipe longest word rseult', 
  PIPE_intersparse( sentence, '-' ) === sentenseDashBetweenEachCharacter
)  /*?. $ */

test( 'compose longest word result', 
  PIPE_intersparse( sentence, '-' ) === sentenseDashBetweenEachCharacter
)  /*?. $ */

test( 'pipe average word length', 
  PIPE_averageWordLengh( ...sentenceSplit ) === 3.5
) /*?. $ */


test( 'compose average word length', 
  COMPOSE_averageWordLengh( ...sentenceSplit ) === 3.5
) /*?. $ */

test( 'pipe long composition', 
  PIPE_longComposition( 10 ) === 'Set'
) /*?. $ */ 

test( 'compose long composition', 
  COMPOSE_longComposition( 10 ) === 'Set'
) /*?. $ */ 




/* START `pipeline` */

const add = (a: number) => (b: number) => a + b
const multiply = ( a: number ) => (b: number ) => a * b
const double = multiply(2)
const half = multiply(.5)
const ten = pipeline(
  2, 
  add(3), 
  double,
  double,
  half,
)

test( 'pipeline computes correctly', ten === 10 ) /*?. $ */ 


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



console.log( `${ totalTests - errorCount } / ${ totalTests } Passed` )

if(errorCount > 0 && process && process.exit) {
  process.exit(1)
}