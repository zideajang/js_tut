## 动手写一个 javascript 代码解析器

### 动机

想自己尝试去写一个 javascript 的解析器和解释器，javascript 是自己的第一门语言，如果不把 html 看成语言的话，也是我们进入到编程行业的敲门砖。之前 javascript 也写了 2, 3 年，但是对于 web 工程师，之前还重来没想过自己去写解析器，直到接触了 类似webpack、vue-cli前端自动化的工具，翻阅资料来知道 AST 。 其实 AST 在日常业务中也许很难涉及到，但当你不止于想做一个工程师，首先如果想要写出更优雅和高性能的 code 我们就不能不了解 AST，或者更大胆想象一下，自己也实现框架，或者一些批量处理的小工具，那你必须懂得AST。AST 的能力十分强大，且能帮你真正吃透 javascript 的语言精髓。可以点击[探险 AST](https://astexplorer.net/)，然后在左侧输入 javascript 代码，在右侧窗口中对应生成 AST 树，在正式开始之前大家体验一下。



但是在网上有关这部分内容并不多见，所以想自己收集一些资料，整理一下分享给大家，由于个人认识有效，所以可能存在不足，还希望大家多多参与评论和讨论。



#### 什么是 AST

AST 是 Abstract Syntax Tree(抽象语法树)的缩写。

#### 分词和解析

生成抽象语法树需要经过两个阶段，分词（tokenize）和语义分析(parse)。分词是将源码source code分割成语法单元，语义分析是在分词结果之上分析这些语法单元之间的关系。

### 最佳实践

#### ESLint

ESLint是一个用来检查和报告 JavaScript 编写规范的插件化工具，通过配置规则来规范代码，[高质量 developer 写高质量 code(javascript 版)](https://juejin.cn/post/6988025519556001800) 这篇分享提到这个工具

#### Vue-cli

在使用 Vue-cli 

#### webpack



### 解析器

#### 

此外，网上关于语言解析器的组合器的大多数资源对初学者来说可能比较晦涩难懂。这是因为大部分的这些都是面向那些对 Haskell 这门函数式编程语言有所了解的人，因为是语言解析器的组合用这种语言实现的。那么对于那些不熟悉Haskell的人来说，要理解如何实现解析器组合器就比较困难。

其实解析器组合器背后的想法很简单。对于一个初学者来说，只需几百行代码就能在 Javascript 这样的高级语言中实现一个解析器组合库，这是完全可能的，通过本次分享，你完全可以发明解析器组合器。

从一个函数开始，从一些输入中读取第一个字符。如果这个第一个字符是a，那么就返回a，并将输入的字符向前推进一个。如果不是，就不推进输入，并返回失败的结果。



想要自己写一个 parser 还是先去看一看别人是怎么实现 parser 以及如何使用解析器的组合器。



```javascript
const A = require('arcsecond');

const stringParser = A.str('hello');
const result = stringParser.run(
    "hello"
)

console.log(result)//{ isError: false, result: 'hello', index: 5, data: null }
```



`A.str` 创建一个文本解析器，具体作用有点类似正则匹配，调用该方法是传入一个要匹配的文本，然后返回一个解析器用于提取该字符串，` stringParser.run( "hello")` 调用解析器 `run`方法，传入要在其中匹配字符串,后会返回一个对象。

- isError 表示是否解析到字符串
- result: 返回解析结构
- index: 返回解析后索引位置
- data: 数据



```js
const stringParser = A.str("hello");

resstringParser.run("world")
```

在这个例子中，没有字符串中没有要解析的字符串情况，则返回的对象`isError` 字段为 true 然后 `error`	提示错误信息，用于分析原因。

```js
{
  isError: true,
  error: "ParseError (position 0): Expecting string 'hello', got 'world...'",
  index: 0,
  data: null
}
```



#### 解析组合器

有时候我们可以用 arcsecond 提供`many` 方法，然后将`A.str("hello")` 这个解析器作为参数传入到`many` 方法中，会返回一可以从字符串中解析出多个 `hello`的解析器，这就是一个解析器组合。

```js
const A = require('arcsecond');

const stringParser = A.many(A.str('hello'));
const result = stringParser.run(
    "hellohelloworld"
)

console.log(result)//{ isError: false, result: [ 'hello', 'hello' ], index: 10, data: null }
```



>  通常我们字符串进行匹配时，会考虑空格，空格也做字符用于匹配，例如下面代码因为 hello 与 hello 之间有空格，所以结果就只会返回一个 `['hello']`

```js
const stringParser = A.many(A.str('hello'));
const result = stringParser.run(
    "hello helloworld"
)

console.log(result)//{ isError: false, result: [ 'hello' ], index: 5, data: null }
```



好上面例子中，定义一个文本解析器组合器可以从文本解析出多个 hello 然后返回一个数组。那么如果我们想从字符串中解析出多个单词，而不仅仅就是`hello` 同时还想解析出`word`，就可以使用 `A.choice` 接受一个数组，数组每一个元素都是一个解析器，这里我们创建 2 个字符串解析器分别对应 hello 和 world。

```js
const A = require('arcsecond');

const stringParser1 = A.str("hello");
const stringParser2 = A.str("world")

const stringParser3 = A.choice([
    stringParser1,
    stringParser2
])

const stringParser = A.many(stringParser3)

const result = stringParser.run(
    "helloworldhelloworld"
)

console.log(result)//{ isError: false, result: [ 'hello' ], index: 5, data: null }

/**
 * 
 * {
    isError: false,
    result: [ 'hello', 'world', 'hello', 'world' ],
    index: 20,
    data: null
  }
 */

```



在返回结果还可以进行进一步操作，例如用 map 将字母转换为大小字母等操作。

```js
const stringParser = A.str("hello").map(result=>result.toUpperCase()) 

result = stringParser.run("hello")
console.log(result)//{ isError: false, result: 'HELLO', index: 5, data: null }
```



这里先自己简单实现一个



```js
const A = {
    str: function(str){
        return (function(input) {
            var r = inputRead(input);
            if (r == str) {
                inputAdvance(input, 1);
                return r;
            } else {
                return failure;
            }
        });
    },
    choice: function(str){
        return (function (input) {
            result = []
            for (parser in arr){
                let res  = parser(input);
                if(res != parser(input)){
                    result.push(res)
                }
            
            }
            if(result.length > 0){
                return result
            }else{
                return failure
            }
        });

    }
}
```

