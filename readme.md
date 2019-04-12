# Introduction

This exposes a `pipe`, `compose` and `pipeline` function. It implements the function types from `pipe-and-compose-types`. The benefits of this is:

* parameter name preservation
* theoritically unlimited functions can be composed (recursive)
* variadic input for both `Pipe` and `Compose`   
* friendly messages on error, pointing to the problem

https://raw.githubusercontent.com/babakness/pipe-and-compose/master/.github/images/preserve-parameters.png

https://raw.githubusercontent.com/babakness/pipe-and-compose/master/.github/images/helpful-errors.gif

See tests for more examples

# Installation

`npm install pipe-and-compose`

# Usage

Parameter names perserved 
```ts
const longerWord = ( word1: string, word2: string ) => word1.length > word2.length ? word1 : word2
const longestWord = ( word: string, ...words: string[]) => [word,...words].reduce(longerWord, '')
const length = ( xs: string | unknown[] ) => xs.length
const PIPE_longestWordLength = pipe(
  longestWord,
  length,
) // ( word: string, ...words: string[] ) => number
```

Works with `compose` as well
```ts
const PIPE_longestWordLength = compose(
  length,
  longestWord,
) // ( word1: string, word2: string ) => number
```

Read more at https://dev.to/babak/introducing-the-recursive-pipe-and-compose-types-3g9o