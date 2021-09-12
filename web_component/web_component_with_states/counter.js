
// custom element
// 定义一个 class 并且这个类继承 HTMLElment

class MyCounterElement extends HTMLElement{
    constructor(){
        // 调用父类构造方法
        super();
        //添加 shadow DOM， element.add shadow dom shadowRoot
        //形成一个作用域，样式和事件误会影响作用域以外，从而形成封闭
        this.attachShadow({mode:'open'})
        // this.shadowRoot
        // this.template = document.querySelector("#counter");
        // this.template.content;
        // slot 

    }
    get count(){
        return this.getAttribute("count");
    }

    set count(val){
        this.setAttribute('count',val)
    }

    // 静态方法，watch count
    /**
     * 需要注意的是，如果需要在元素属性变化后，触发 attributeChangedCallback()回调函数，
     * 你必须监听这个属性。这可以通过定义observedAttributes() get函数来实现，
     * observedAttributes()函数体内包含一个 return语句，
     * 返回一个数组，包含了需要监听的属性名称
     */
    static get observedAttributes(){
        return ["count"]; // 返回
    }

    bindBtn(){
        let btn = this.shadowRoot.querySelector("#btn");
        btn.addEventListener('click',this.increment.bind(this));
    }

    attributeChangedCallback(prop, oldVal, newOld){
        if (prop === "count"){
            this.render();
            this.bindBtn();
        }
    }

    increment(){
        this.count++;
    }
    //当 custom element首次被插入文档DOM时，被调用。
    connectedCallback(){
        // 渲染
        this.render();
        //绑定事件
        this.bindBtn();
    }

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
    
}

customElements.define('my-counter',MyCounterElement);