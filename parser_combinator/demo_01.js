const A = require('arcsecond');

const stringParser = A.many(A.str('hello'));
const result = stringParser.run(
    "hello helloworld"
)

console.log(result)//{ isError: false, result: [ 'hello' ], index: 5, data: null }