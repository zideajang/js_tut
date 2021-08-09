### 动机
这个分享多半是出自兴趣，相比于 c++ 我更熟悉 javascript 来写一个解析器，这里不会依赖于其他 javascript 的库，基本是白手起家。

```js
{
  "name": "implementation_parser_with_js",
  "type":"module",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

```js
const input = "";

function lexer(str){

}

console.log(lexer(input));
```

```js
const input = "";

function lexer(str){
    let c = str[0];
    if(c === undefined){
        return {
            type: 'EOF'
        }
    }
}

console.log(lexer(input));
```
这里输入代码为空`input=""`,lexer 函数读取 code 然后逐一去解析，当解析到字符串为空也就是说明已经读取文件完毕，这里返回的 token 的类型就是 `EOF`.



```js
const input = "7";

function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if(char === undefined){
            yield {
                type: 'EOF'
            }
        }else if(char === '7'){
            yield{
                type:'number',
                value:7
            }
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}

// console.log(lexer(input));
```

```js
{ type: 'number', value: 7 }
{ type: 'EOF' }
```

```js

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

```