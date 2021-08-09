
const input = "777787777";

function trace(name,v){
    console.log(name);
    return v;
}



function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if( char === '7'){
            yield{
                type:'number',
                value:7,
                // loc:{
                //     begin:cursor,
                //     end:cursor+1,
                // }
            }
        }else if (char === undefined){
            
            yield {
                type: 'EOF',
                // begin:cursor,
                // end:cursor+1,
            }
        }else{
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}
