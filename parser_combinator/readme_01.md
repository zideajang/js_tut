```js
const str =  s => targetString => {
    if(targetString.startsWith(s)){
        //Success!
        return s;
    }

    throw new Error(`Tried to match${s} but got ${targetString.slice(0,10)}`);
}

const run = (parser, targetString) => {
    return parser(targetString);
}

// and how we use it

const parser = str('hello there!');

console.log(run(parser,'hello there!'))
```