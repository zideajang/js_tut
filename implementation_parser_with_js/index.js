
const input = "777";

function trace(name,v){
    console.log(name);
    return v;
}



function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        let char = str[cursor];

        function number(){
            let value = ""

            for(; cursor <= str.length; cursor++){
                char = str[cursor];
                if(char === '7'){
                    //TODO
                    value +=7
                }else{
                    break;
                }
            }

            return {
                type:'number',
                value,
            }
        }

        if( char === '7'){
            yield number()
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
