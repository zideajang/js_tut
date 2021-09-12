const A = require("arcsecond");

const stringParser = A.str("hello").map(result=>result.toUpperCase()) 

result = stringParser.run("world")
console.log(result)//{ isError: false, result: 'HELLO', index: 5, data: null }
