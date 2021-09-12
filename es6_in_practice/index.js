// ECMAScript1
// ECMAScript2
// ECMAScript3
// ECMAScript4
// ECMAScript3.1
// ECMAScript5
// ECMAScript 2015

// bower
// grunt
// gulp
// 


let foo = 'bar', bar = 'baz'

let obj = {
    foo,
    bar(){
        return this(bar)
    },
    [bar]:'bim'
}

console.log(obj.foo);
console.log(obj.bar);

// Dylan Israel
// Template string literal

let tutName = 'machine learning';
let lesson = 12

const tutDescription = `${tutName}`
console.log(tutDescription);

let  num1 = 2;
let num2 = 3;

console.log(`${ num1 + num2}`)

const example = `
hello
world
`

// document.getElementById("example").innerText = example

const tutDetail = {
    title:"machine learning",
    subTitle:"decision tree",
    content:"some content"
}

const {title} = tutDescription
// example = ttle

let tuts = ['linear regression','logistic regression','naive bayse','svm','decision tree'];

let [...firsttut] = tuts
console.log(firsttut)

// object literal

function upateTut(title,description){
    const tut = {title,description}
    return tut
}

console.log(upateTut('machine leanring','machine learning description...'));

//Object 


// function category 

