- token 
- "7778777" loc 对象有 begin 和 end 两个位置

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
    let char = undefined; //字符

    // switch break
    

    function number(){
        let value = ""; //返回 token 的数值
        //内循环
        for(; cursor <= str.length; cursor++){
            // 获取当前字符串 cursor 对所指的字符串中的字符
            char = str[cursor];
            // 判断是否想要提取字符(token)更新 value
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

    /**
     * 循环 str 
     * 将更新 cursor 交给 number() 函数来执行，
     */
    for (;cursor < str.length; ) {
        const token = number()
        if( token ){
            yield token;
            
        }else{ //
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}

```

```js

const input = "8";

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
    let char = undefined; //字符

    // switch break
    

    function number(){
        let value = ""; //返回 token 的数值
        //内循环
        for(; cursor <= str.length; cursor++){
            // 获取当前字符串 cursor 对所指的字符串中的字符
            char = str[cursor];
            // 判断是否想要提取字符(token)更新 value
            if(char === '7'){
                //TODO
                value += char
            }else{ //连续
                break;
            }
        }
        if (value.length >=1 ){
            //返回 token
            return {
                type:'number',
                value,
            };
        }
        
        return null;
        

       
    }

    /**
     * 循环 str 
     * 将更新 cursor 交给 number() 函数来执行，
     */
    for (;cursor < str.length; ) {
        const token = number()
        if( token ){
            yield token;
            
        }else{ //
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
    
}
``` 


```js
SyntaxError: unexpected character "8" at 1
```

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
    let char = undefined; //字符

    // switch break
    

    function number(){
        let value = ""; //返回 token 的数值
        //内循环
        for(; cursor <= str.length; cursor++){
            // 获取当前字符串 cursor 对所指的字符串中的字符
            char = str[cursor];
            // 判断是否想要提取字符(token)更新 value
            if(char === '7'){
                //TODO
                value += char
            }else{ //连续
                break;
            }
        }
        if (value.length >=1 ){
            //返回 token
            return {
                type:'number',
                value,
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
    for (;cursor <= str.length; ) {
        const token = number() || eof();
        if( token ){
            yield token;
            
        }else{ //
            throw new SyntaxError(`unexpected character "${char}" at ${cursor+1}`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
    
}
```