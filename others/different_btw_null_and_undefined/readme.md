
很多程序人虽然用 javascript 一段时间，甚至可以算上是老手了，但是可能对 `undefined` 和 `null` 的区别，以及如何使用他们还不是很清楚，包括我自己，所以这是我今天写这个分享一个动机，我们不仅要放眼未来还要把当前一个问题搞清楚

#### 既然设计了

虽然`undefined` 和 `null` 看似相同，其实还是有着很大区别，今天我们深入探究他们差异性

#### 什么是 `null` 呢
首先对于事物进行定义，也就是把握其特点，这些特点用于与其他事物区分，所以首先了解 `null` 的两个特点
- `null` 是空值一个不存在的值，也就是没有被引用的内存中一个空对象
- 当要删除一个变量时，可以简单将其设置 `null` 来移除
- `null` 表示没有对象，该处不应该有值
- 对于一个有返回函数，当返回没有知道返回值返回给调用者，可以返回`null` 没有使用者要找的值

```js
let a  = null;
console.log(a);//null
```

#### 什么是 `undefined`？
`undefined` 表示"缺少值"，就是此处应该有一个值，不过暂时还没有定义。
- 声明一个变量，但没有赋值，
```js
let b;
console.log(b); //undefined
```
当然也可以显式将 `undefined` 赋值给一个变量

```js
let c = undefined;
console.log(c);//undefined
```
- 访问对象上不存在的属性或者未定义的变量
```js
let tut  = {}
console.log(tut.title) //undefined
```

- 函数定义了形参，但没有传递实参

```js
function updateTut(){
    console.log(tut)
}
updateTut()//undefined
```

- 使用void对表达式求值

#### 为什么会同时存在 `null` 和 `undefined` 
JavaScript 这门动态弱类型语言在设计之处参考了两个强类型语言也就是 c 和 Java 来设计，是不是感觉有点问题呢。参考了 Java 所以设置了 null 表示空对象，有根据 c 语言的传统，null 设计成可以自动转为 0 ，也就是用 `Number(null)` 为 0 。在 Java 语言里一切都是对象，但是在 Javascript 类型分为原始类型和合成类型。感觉 null 表示复合类型的空最好不是对象。而且 JavaScript 在设计之处没有错误处理机制，发生数据类型不匹配就是自动转换类型或者失败，如果 null 自动转为 0，很不容易发现错误。


#### `null` 和 `undefined` 相似点

在 JavaScript 中，只有六个假的值。`null`和`undefined`都是这六个假值中的两个

- false
- 0 (zero)
- “” (空字符)
- null
- undefined
- NaN (Not A Number)

同样在 JavaScript 中，有六个基础类型。`null`和 `undefined` 都是基础类型
- Boolean
- Null
- Undefined
- Number
- String
- Symbol

JavaScript 中除了上面列出基础类型所有其他的值都是对象(对象、函数、数组等)。有趣的是，当使用 `typeof` 来测试 `null`时，返回的是对象。

```js
console.log(typeof(a))//object
```
尝试地去解释一下为什么 `null` 类型返回的是一个 `object` 一方面从逻辑角度来看，null值表示一个空对象指针，它代表的其实就是一个空对象，所以使用typeof操作符检测时返回"object"也是可以理解的。

#### `undefined` 和 `null` 的区别

之前我们提及到了，`undefined`是作为变量原始值，也就是在创建变量后没有赋值时的初始值，而 `null` 是空值，即使是空值也是一个值而不是变量的原始状态，下面用代码来演示简单说明一下。


```js
function updateTut(tut='machine learning'){
    console.log(tut)//undefined
}

updateTut(undefined) //machine learning
updateTut(null)//null

```
上面 `updateTut` 函数接受一个参数 `tut` 当没有输入时候则输出其默认值`'machine learning'` 过程是定义变量 `tut` 如果该变量没有赋值则为 `undefined` 如果 `tut === undefined` 则输出默认值，但是当指定 `tut=null` 也可以理解改变了 `tut` 的初始状态，所以输出为 `null`。从而也就是说明 `undefined !== null` 。

> 在 JavaScript 判断两个值是否相等建议 `===`

#### `null` 和 `defined` 转换成 `number` 类型
```js
console.log(Number(null))
console.log(Number(undefined))
```
为什么会有这样呢? 当初 JavaScript 设计时参考了 Java 引入 null 用于表示空，同时也参考了 c 语言传统，在 c 语言中将 null 设计成可以自动转为 0

### 如何正确地使用 `undefined` 和 `null`
- 推荐使用 `undefined`,而且在为了保证变量所表示的语义，避免显式地给一个变量赋值 `undefined` 
- 


### 小结
- `null` 是一个分配值,
- `undefined` 通常意味着一个变量已经被声明，但还没有被定义，可以理解为给变量默认值，所以我们就无需手动地给一个变量初始值给 `undefined`
- `null`和 `undefined` 是错误的值 
- `null` 和`undefined`都是基元。然而一个错误显示typeof null = object。
- `null !== undefined`，但是 `null == undefined`
