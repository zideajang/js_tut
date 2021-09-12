```js

const input = "777";

/**
 * 
 * @param {*} name 
 * @param {*} v 
 * @returns 
 */
function trace(name,v){
    console.log(name);
    return v;
}


function* lexer(str){

    let cursor = 0; //读取文本的指针
    let char = str[cursor]; //字符

    // switch break

    function next(){
        cursor++;
        char = str[cursor];
    }
    

    function number(){
        let buffer = ""; //返回 token 的数值
        //内循环
        while(char==='7'){
    
            buffer += char;
            next();
            
        }
        if (buffer.length >=1 ){
            //返回 token
            return {
                type:'number',
                value:buffer,
            };
        }
        
        return null;
    }
    /**
     * 
     * @returns 
     */
    function eof(){
        char = str[cursor]
        if(char === undefined){
            cursor++;
            return{
                type:"EOF",
            };
        }

        return null;
    }

    /**
     * 循环 str 
     * 将更新 cursor 交给 number() 函数来执行，
     */
    for (;;) {
        const token = number() || eof();
        if( token ){
            yield token;

            if(token.type === "EOF"){
                break;
            }
            
        }else{ //
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
    
}

```