
const input = "777";

function trace(name,v){
    console.log(name);
    return v;
}



function* lexer(str){

    let cursor = 0;
    let char = undefined;

    function number(){
        let value = ""

        for(; cursor <= str.length; cursor++){
            
            char = str[cursor];

            if(char === '7'){
                //TODO
                value += char
            }else{
                break;
            }
        }

        return {
            type:'number',
            value,
        }
    }

    for (;cursor < str.length; ) {
        const token = number()
        if( token ){
            yield token
        // }else if (char === undefined){
            
        //     yield {
        //         type: 'EOF',
        //     }
        }else{
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}
