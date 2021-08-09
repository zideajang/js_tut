
const input = "77777";

function trace(name,v){
    console.log(name);
    return v;
}

function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if (trace("checking 7",(char === '7'))){
            yield{
                type:'number',
                value:7
            }
        }else if( trace("checking undefine",(char === undefined))){
            yield {
                type: 'EOF'
            }
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}
