let a  = null;
console.log(a);//null
// @ts-check
/** @type {number} */
let b;
console.log(b); //undefined

let c = undefined;
console.log(c);//undefined

let tut  = {}
console.log(tut.title)

function updateTut(tut='machine learning'){
    console.log(tut)//undefined
}

updateTut(undefined)
updateTut(null)

console.log(null === false)

// let a = null;
console.log(typeof(a))

// console.log(typeof(null))

console.log(Number(null))
console.log(Number(undefined))