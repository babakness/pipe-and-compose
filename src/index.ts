import { PipeFn, ComposeFn, AnyFunction, AnyFunction1, PipelineFn } from 'pipe-and-compose-types'
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
export const pipe: PipeFn =  ( entry: AnyFunction, ...funcs: AnyFunction1[] ) =>  ( 
  ( ...arg: unknown[] ) => funcs.reduce( 
    ( acc, item ) => item.call( item, acc ), entry( ...arg ) 
  ) 
) 

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
export const pipeline: PipelineFn = ( arg: unknown, first: AnyFunction1, ...rest: AnyFunction1[]) => {
  return pipe( first, ...rest )( arg ) 
}

const init = <A>( xs: A[]): A[] => xs.slice(0,-1)
const last = <A>( xs: A[]): A => xs.slice(-1)[0]

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
export const compose: ComposeFn = ( first: AnyFunction1, ...funcs:  AnyFunction[] ): any => {
  /* `any` is used as return type because on compile error we present an object, 
      which will not match this */
  return ( ...arg: unknown[] ) => init( [first, ...funcs] ).reduceRight( 
    (acc, item) => item.call( item, acc ), last(funcs)( ...arg ) 
  )
}


