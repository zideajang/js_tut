
> 属于自己高考已经过去了很多年，回想起来自己多少还是有些遗憾，所以经常会梦到自己参加补习，因为邻近考试自己还没有准备好而惊醒。步入了大学才发现高中时有学多题用大学方法，无需绕弯迎刃而解。
现在理解为什么班上有些同学会去学习大学的微积分。对于一些无需过程的题，利用大学知识快速给出答案，这样更多时间用于处理其他问题。这些这是一个引子，因为今天的话题，如果我们是一个了解如何解析 js 以及浏览器引擎原理的 Javascript 那么我们遇到一个问题，就会从容给出答案，
这也就是我去用 js 写一个 js 解析器的原因，这也就是就是为什么我会花时间去学习 c++ 原因。

## 只用 JS 自己动手实现一个 Web Component

### web component

聊一聊什么是 web component 以及 web component 有什么优势，以及如何整合现有 web 技术来实现一个 web component

#### 什么是 web component
所谓组件(component)是和平台无关的，也就是组件不受平台所限制。
组件设计初衷是将组件的代码封装成一个漂亮的、可重复使用的包，来实现足够的可用操作性。
也就是我们设计组件最大可能满足不同 team 对组件需求，为不同 team 提供一个同一标准组件供调用

#### 为什么是 web component

为什么是 web component ,也就什么是 web component 的优点。

- **最大化互用性(interoperability)**， 通过 web component 可以对组件进行封装，提供组件行为，对于一个拥有多个产品公司，通过 web component 让用户体验在不同产品上保持一致性，例如登录流程，这样不但节省了团队开发成本，从用户方面来看，因为一些流程或者操作一致性，也节省了用户学习不同产品的成本，从而提供良好的用户体验。
- **更好的性能(better performance)**: 这一点有更容易理解，web component 因为是原生浏览器支持，用 js 直接编写，也就是大力鼓励，浏览器全力支持的技术，相对于框架如 vue、react 和 angular 中的 component 自然有自己的在性能上的优势。因为框架中 component 依赖框架，所以 bundle 文件时需要引入对 component 支持文件所以 bundle 后 js 体积要远远大于原生 js 支持 web component 的体积。
- 封装性(encapsulation): 有关封装这一天在之前 shadow DOM 已经谈了很多这里不想多谈
- **样式化(styling)**: 在今天丰富多彩世界里少不了个性突出的应用， web 应用也和好 app 也好大家，大家都在最求用户体验，当然 app 也要自己风格，自己不同于其他 app 的自己特点，这些不同当然也体现在样式上、风格上，鲜明的主题良好设计势必给用户一个深刻印象。所以今天风格也变得非常重要，

### 基于以下技术得以实现 web component 
#### html 模板(HTML Template)
HTML template(模板)就是可以声明式去定义一个段标签，浏览器可以将其解析为 HTML
`<template><template>`
```html
<template id="card-tmpl">
        <style>
            #card{
                flex-direction: row;
                background-color: lightblue;
            }
            #title{
                align-items: center;
                justify-self: center;
                color: darkslateblue;
            }
        </style>
        <div id="card">
            <h2 id="title">machine learning</h2>
            <div id="content"></div>
        </div>
    </template>
```
在 template 标签内容不会在浏览器加载页面时被渲染出来，不过可以通过`var template = document.getElementById('card-tmpl')`获取 template 标签，在 template DOM 元素有一个属性 `content`,通过该属性可以获取到`template` 标签内的内容，然后可以将这个 DOM 元素 `const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));` 添加到 shadowRoot 下作为作为 shadow DOM 结点。

#### custom element
我们自己定义一个 html 标签，如何创建一个自定义元素，首先创建一个 class 需要让该类继承 `HTMLElement` 然后就可以获取到一下 DOM 生命周期回调函数，在自定义元素添加到 DOM 或者从 DOM 移除时进行一个相应的处理工作。

- connectedCallback：当 custom element首次被插入文档DOM时的回调函数。
- disconnectedCallback：当 custom element从文档DOM中删除时的回调函数
- adoptedCallback：当 custom element被移动到新的文档时的回调函数
- attributeChangedCallback: 当 custom element增加、删除、修改自身属性时的回调被调用

而且需要自定义元素的构造函数调用一下其父类构造方法`super()`, 有时候我们需要在元素监听一下元素上某一个自定义属性，
```
<my-counter style="--background-bg-color: lightblue; --btn-width:600px;" id="counter" count="10"></my-counter>
```
如果要监听 `count` 属性的变化，我们就需要在自定义元素中定义以下静态方法

```js
static get observedAttributes(){
        return ["count"]; // 返回
    }
```
需要注意的是，如果需要在元素属性变化后，触发 attributeChangedCallback()回调函数，必须监听这个属性。这可以通过定义observedAttributes() get函数来实现，observedAttributes()函数体内包含一个 return语句，返回一个数组，包含了需要监听的属性名称。还需要实现一下有关 count 这个属性 set 和 get 方法。

```js
    get count(){
        return this.getAttribute("count");
    }

    set count(val){
        this.setAttribute('count',val)
    }
```

#### shadow DOM
[Web Compoent 系列—shadow DOM(1)](https://juejin.cn/post/6993238862805860366)

#### ES6 module
有关模块化，在 ES6 上也十分简单
```js
<script type="module" src="counter.js"></script>
```

如果几年前你和人提起 web component，大家对这个技术可能还会抱有怀疑态度，因为大多数浏览器版本对这个新兴 API 支持还不算好
为此需要做大量额外工作以让你定义 web component every where，不过我们再看今天，几乎所有的浏览器都提供对 web component 良好的支持。


### 样式化(Styling)
#### 通过 CSS 中 var 将样式定义交个使用者
我们希望将一些样式的修改权交个使用该组件的用户，这个可以通过`var`来实现，然后在自定标签的`style`属性来对这些变量进行赋值从而控制。
```html
#btn{
  outline:None;
  color:white;
  max-width:var(--btn-width,200px);
  background-color:var(--background-bg-color,green);
  border: 0px;
  padding:20px;
  font-size:1.2em;
  border-radius:10px;
	text-align: center;
}
```
```html
<my-counter style="--background-bg-color: lightblue; --btn-width:600px;" id="counter" count="10"></my-counter>
```


#### 通过 CSS 中 part 将 shadow DOM 样式暴露给外部

引入 shadow DOM 就是为了让我们组件内部 html 和 CSS 有自己独立空间，外面的定义样式不会影响到自定义元素内部，这里

```html
h1{
	color: dodgerblue;
}
```
不会影响到 shadow DOM 下面 h1 元素的样式 `<h1>计数器</h1>` 如果想要在外面影响 shadow DOM 元素样式可以通过 CSS part 方式来解决问题，也就是`<h1 part="title">计数器</h1>` 给 shadow DOM 中 h1 标签添加`part="title"` 然后就可以外部样式表通过`my-counter::part(title)` 

```js
my-counter::part(title){
	color: dodgerblue;
}
```

```javascript
render(){
        
        this.shadowRoot.innerHTML = `
        <style>
        *{
            box-sizing: border-box;
            margin:0;
            padding:0;
            box-sizing: border-box;
        }
        .container{
            display:flex;
            flex-direction:column;
            align-items: center;
            justify-content: center;
        }
        
        #btn{
            outline:None;
            color:white;
            max-width:var(--btn-width,200px);
            background-color:var(--background-bg-color,green);
            border: 0px;
            padding:20px;
            font-size:1.2em;
            border-radius:10px;
            text-align: center;
        }
        span{
            font-size:2.75em;
            font-weight:bold;
        }
        </style>
        <div class="container">
        <h1 part="title">计数器</h1>
        <span>${this.count}</span>
        <button id="btn">Increment</button> 
        </div>
        `
    }
```



