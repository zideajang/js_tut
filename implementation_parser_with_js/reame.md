### 动机
准备写一个 javascript 的解析器，将 javascript 解析成为一个抽象语法树(AST)，准备着手写这个多半是出自兴趣，要写代码首先就需要选择一个语言去实现，原本也是比较理想去用 c++，但是现在时机还不算成熟，对 c++ 语言还不熟练，相比于 c++ 我更熟悉 javascript 来写一个解析器，这里不会依赖于其他 javascript 的库，基本是白手起家。


> 即使是处于兴趣也好，娱乐也好，也希望把这件事做好

### 搭建项目

项目大家很简单，只需要安装当前稳定版本 node 创建一个文件夹后，在文件夹下运行如下命令即可
```js
npm init -y
```
完成后会在项目目录下，自动创建一个`package.json`文件，注意这里进行
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

### 先去实现 lexer 

```js
const input = "";

function lexer(str){

}

console.log(lexer(input));
```
先去实现一个 `lexer` 一切从简单开始，`input` 就是读取 code，我们先以简单开始，用于一个空字符串`""`作为输入。


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

这里输入代码为空`input=""`,lexer 函数读取 code 然后逐一去解析，当解析到字符串为空也就是说明已经读取文件完毕，这里返回的 token 的类型(type)就是 `EOF`.



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

#### 对比 `if else if` 和 `if if`

```js

function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if( trace("checking undefine",(char === undefined))){
            yield {
                type: 'EOF'
            }
        }
        if (trace("checking 7",(char === '7'))){
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

```

```js
checking undefine
checking 7
{ type: 'number', value: 7 }
checking undefine
checking 7
{ type: 'number', value: 7 }
checking undefine
checking 7
{ type: 'number', value: 7 }
checking undefine
checking 7
{ type: 'number', value: 7 }
checking undefine
checking 7
{ type: 'number', value: 7 }
checking undefine
{ type: 'EOF' }
checking 7
```
对于`if` ·和 `if` 这种形式，输出每一次都会确认两次


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

```js
function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if( trace("checking 7",(char === '7'))){
            yield{
                type:'number',
                value:7
            }
        }else if (trace("checking undefines",(char === undefined))){
            
            yield {
                type: 'EOF'
            }
        }
    }
    
}

```

```js
checking 7
{ type: 'number', value: 7 }
checking 7
{ type: 'number', value: 7 }
checking 7
{ type: 'number', value: 7 }
checking 7
{ type: 'number', value: 7 }
checking 7
{ type: 'number', value: 7 }
checking 7
checking undefines
{ type: 'EOF' }
```

#### 异常处理
在解析过程当没有批评的情况这应该抛出一个异常，这里异常类型`SyntaxError`

```js
const input = "78";


function* lexer(str){

    for (let cursor = 0; cursor <= str.length; cursor++) {
        const char = str[cursor];
        if( char === '7'){
            yield{
                type:'number',
                value:7
            }
        }else if (char === undefined){
            
            yield {
                type: 'EOF'
            }
        }else{
            throw new SyntaxError(`unexpected character "${char}"`)
        }
    }
    
}

for(const token of lexer(input)){
    console.log(token)
}

```


```js
SyntaxError: unexpected character "8"
```

```js
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

```