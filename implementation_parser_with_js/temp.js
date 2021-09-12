const input = "7778";

function trace(name,v){
    console.log(name);
    return v;
}

function* lexer(str){
    // let char = str[0];//
    for(let cursor = 0; cursor <= str.length; cursor++){
        const char = str[cursor];
        // swith if if if else
      
        if( trace("check number",(char === '7'))){
            yield{
                type:'number',
                value:7
            }
        }else if(trace("check undefined",(char === undefined))){
            yield {
                type:"EOF"// end of file
            }
        }else{
            throw new SyntaxError(`unexpected character "${char}"`) 
        }
    }
}
for(const token of lexer(input) ){
    console.log(token)
}