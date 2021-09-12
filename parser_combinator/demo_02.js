const A = require('arcsecond');

const stringParser1 = A.str("hello");
const stringParser2 = A.str("world")



const stringParser3 = A.choice([
    stringParser1,
    stringParser2
])

const stringParser = A.many(stringParser3)

const result = stringParser.run(
    "helloworldhelloworld"
)

console.log(result)//{ isError: false, result: [ 'hello' ], index: 5, data: null }

/**
 * 
 * {
    isError: false,
    result: [ 'hello', 'world', 'hello', 'world' ],
    index: 20,
    data: null
  }
 */

