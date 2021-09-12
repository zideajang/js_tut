const str =  s => (targetString,index) => {
    if(targetString.slice(index).startsWith(s)){
        //Success!
        return s;
    }

    throw new Error(`Tried to match${s} but got ${targetString.slice(index,index + 10)}`);
}

const run = (parser, targetString) => {
    return parser(targetString);
}

// and how we use it

const parser = str('hello there!');

console.log(run(parser,'hello not correct!'))