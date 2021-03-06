### write promise from scratch



> 开始把问题想简单了，觉得自己搞过 javascript 一段时间，通过学习自己写个 promise 应该问题不大，不过开始弄才发现不是那么简单，其中有许多概念还需要好好理解，所以一看不能急于求成，一点一点来吧，还是分成上下两部分来分享吧。

### promise 出现解决了什么样问题
- 解决通过回调实现异步所带来层层嵌套的问题，有了 promise 代码更加清晰，便于阅读
- 合并多个异步请求的结果`promise.all`

在开始写一个 promise 之前，我们先看一看原生 promise 如何使用

```js
const promise = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve("hello promise")
    },1000)
})

promise.then(value=>{
    console.log(value)
});
```



```js
const promise1 = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve("hello promise")
    },1000)
})

const promise2 = promise1.then(value=>{
    console.log(value)
    value = value + " return promise"
    return value
});

promise2.then(value=>{
    console.log(value)
})
```



```js
hello promise
hello promise return promise
```



### 在正式开始 coding 前一点准备

#### 实现  promise 规范


介绍一个完整的，可互操作的 JavaScript 的 Promise 的开放标准，说白了也就是给出你条条框框，只要按条条框框就能实现了一个promise，你也就实现了一个 promise。接下来

一个 promise 代表了一个异步操作的最终对象。与 promise 交互的主要方式是通过 promise 提供 then方法，该方法注册了回调以接收 promise 的成功返回值(value)或 promise 失败返回的原因(reason)。



#### 基于 Promise/A plus 去实现一个 promise

Promises/A+ 的规范详细说明了`then`方法的行为，提供了一个可操作的基础，所有符合 Promises/A+ 的 Promise 实现都可以依赖它来提供。因此，规范应该是非常稳定的， 虽然并不排除 Promises/A+ 组织可能偶尔会用向后兼容而对该规范进行改动来修订本的可能，但是相对来说该规范不会有大的改动。以解决新发现的角落案例，但我们只有在仔细考虑、讨论和测试之后，才会整合大型或向后不兼容的改动。

#### 术语

- **Promise**: 通常是一个具有 then 方法的**对象**或**函数**，其行为符合本规范
- **thenable**: 是一个定义了具有 then 方法的**对象**或**函数**，这里多说两句 able 表示能力，那么也就是我们定义一个函数或者对象具有 then 的能力
- **value** :  可以是任何合法的 JavaScript 值 (包括 undefined，thenable 或者 promise)
- **exception** 使用 throw 语句抛出的信息
- **reason**:  表示一个 Promise 拒绝的原因
- **Execution Contexts** : 当控制权被转移到 ECMAScript 可执行代码时，控制权就进入了一个执行上下文。活动的执行上下文在逻辑上形成一个堆栈。这个逻辑堆栈中的最高执行上下文是运行中的执行上下文。当控制权从与当前运行的执行上下文相关的可执行代码转移到与该执行上下文无关的可执行代码时，就会创建一个新的执行上下文。新创建的执行上下文被推到堆栈上，成为运行中的执行上下文。

When control is transferred to ECMAScript executable code, control is entering an execution context. Active execution contexts logically form a stack. The top execution context on this logical stack is the running execution context. A new execution context is created whenever control is transferred from the executable code associated with the currently running execution context to executable code that is not associated with that execution context. The newly created execution context is pushed onto the stack and becomes the running execution context.

### 开始动手写 promise 了

#### Promise 状态

Promise 具有 3 个状态，分别是 **pending**, **fulfilled** 和 **rejected**  promise 会处于三种状态之一。

- 当处于 pending 状态时，一个promise 下一个状态可能会转移到 fulfilled 或者 rejected。
- 当处于 fulfilled 状态时，Promise 接下来转移任何其他状态，需要具有一个不可变的 value
- 当处于 rejected 状态时，Promise 同样不会转移到其他任何状态，不过此时需要 reason 值

### Then 方法

Promise 需要提供一个 then 方法用来访问返回值或原因值，也就是拒绝的理由，promise 的 then 方法接受两个参数。

```js
promise.then(onFulfilled, onRejected)
```

##### onFulfilled 和 onRejected 都是可选参数
- 如果 `onFulfilled`不是一个函数，需要将其忽略。
- 如果`onRejected`不是一个函数，需要将其忽略。

##### 当 `onFulfilled`是一个函数
- 必须在 `promise` 已经处于`fulfiled`才被调用，并以 promise 的值作为该函数的第一个参数
- 不能在 `promise` 处于 `fulfilled` 状态之前被调用
- 不可多次调用`onFulfilled` 方法

##### 当`onRejected`是一个函数:
- 必须在 promise 处于 `rejected`后才可以调用，并以 promise 的 reason 作为其第一个参数
- `onRejected`不能在 promise 处于 `rejected`状态之前被调用
- `onRejected` 不得被多次调用

#### onFulfilled 或 onRejected 
- onFulfilled 或 onRejected 不能被调用，直到执行上下文栈(context )只包含**平台代码(platform code)**
- 什么又是平台代码(platform code)

#### onFulfilled 和 onRejected 必须作为函数被调用（即没有这个值）。[3.2]
#### then 可以在同一个 promise 上被多次调用。
- 如果/当承诺被履行时，所有各自的onFulfilled回调必须按照它们对then的原始调用顺序执行。
- 如果/当承诺被拒绝时，所有各自的onRejected回调必须按照它们对then的调用顺序执行。

onFulfilled和onRejected必须作为函数被调用（即没有这个值）。[3.2]
onFulfilled和onReject必须作为函数被调用（即没有this值）。
当 promise 处于 fulfilled 状态时，所有调用 then 的onFulfilled回调必须按照对 `then` 的最开始调用的顺序执行。
当 promise 处于 rejected 状态时，所有调用 then 的 onRejected 回调必须按照对 `then` 的调用顺序执行。

#### then 返回一个 promise [3.3]。
如果 `onFulfilled` 或 `onRejected` 返回一个值x，运行Promise Resolution程序[[Resolve]](promise2, x)。
如果 `onFulfilled` 或 `onRejected` 抛出一个异常 e，promise2必须以e为理由被拒绝。
如果 `onFulfilled`不是一个函数，并且promise1被履行了，promise2必须以与promise1相同的值被履行。
如果 `onRejected` 不是一个函数，并且promise1被拒绝，promise2必须被拒绝，理由与promise1相同。

Here “platform code” means engine, environment, and promise implementation code. In practice, this requirement ensures that onFulfilled and onRejected execute asynchronously, after the event loop turn in which then is called, and with a fresh stack. This can be implemented with either a “macro-task” mechanism such as setTimeout or setImmediate, or with a “micro-task” mechanism such as MutationObserver or process.nextTick. Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.





#### then 返回 promise

- promise2 = promise1.then(onFulfilled, onRejected)。
- 如果onFulfilled或onRejected返回一个值x，运行 promise 解析过程
- 如果 onFulfilled 或onRejected 抛出一个异常e，promise2 必须以 e 为 reason 被拒绝。
- 当 onFulfilled 不是一个函数，并且 promise1 被履行了，promise2 必须以与promise1相同的值被履行。
- 当 onRejected 不是一个函数，并且 promise1 被拒绝，promise2必须被拒绝，理由与promise1相同。





### 注意

- 这里的 "平台代码 "是指引擎、环境和 promise 的实现代码。在实现过程中，这一要求确保 `onFulfilled` 和 `onRejected` 异步执行，在调用事件循环(event loop)之后，并使用新的堆栈。这可以通过 "宏观任务 "机制(如setTimeout或setImmediate)或 "微观任务 "机制(如MutationObserver或process.nextTick)实现。由于 promise 的实现被认为是平台代码，它本身可能包含一个任务调度队列或 "蹦床"，其中的处理程序被调用。

- 也就是说，在严格模式下，这将是它们内部的未定义对象；在马虎模式下，这将是全局对象。

- 实现可以允许 promise2 === promise1，只要实现满足所有的要求。每个实现都应该记录它是否能产生 promise2 === promise1，以及在什么条件下产生。

- 一般来说，只有当x来自当前的实现时，才会知道它是一个真正的承诺。本条款允许使用特定于实现的方法来采用已知符合条件的承诺的状态。

- 这种首先存储对x.then的引用，然后测试该引用，再调用该引用的程序，避免了对x.then属性的多次访问。这样的预防措施对于确保访问器属性的一致性是很重要的，因为访问器属性的值可能在检索之间发生变化。

- promise 不应该对 thenable 链的深度做任意的限制，只有超过这个任意的限制，递归才将是无限的。循环才会导致TypeError，当遇到一个无限的不同的 thenable 链，一直递归下去可以理解为是正确的行为。




```js
class APromise{
    constructor(computation){

    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve("build promise from scratch",1000))
});

```
- take a computation function in the constructor
- computation receives resolved function and reject function as parameters
- promise states pending fulfilled rejected

```js
const states = {
    PENDING:'pending',
    FULFILLED:'fulfilled',
    REJECTED:'rejected'
};


class APromise{
    constructor(computation){
        this._state = states.PENDING;

    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve("build promise from scratch",1000))
});
```

- will keep track of and control the mechanics the first of these state
- fulfilled and rejected belong to settled
- the main way we interact with a promise is by calling its dot then both these end up creating new promise


```js
const states = {
    PENDING:'pending',
    FULFILLED:'fulfilled',
    REJECTED:'rejected'
};


class APromise{
    constructor(computation){
        this._state = states.PENDING;

        this._value = undefined;
        this._reason = undefined;

        this._thenQueue = [];
        this._finallyQueue = [];

    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve("build promise from scratch",1000))
});
```

- onFulfilled or onRejected must not be called until the execution context stack contains only platform code

```js
const states = {
    PENDING:'pending',
    FULFILLED:'fulfilled',
    REJECTED:'rejected'
};


class APromise{
    constructor(computation){
        this._state = states.PENDING;

        this._value = undefined;
        this._reason = undefined;

        this._thenQueue = [];
        this._finallyQueue = [];

        if(typeof computation === 'function'){
            setTimeout(()=>{
                try {
                    computation(
                        this._onFulfilled.bind(this),
                        this._onRejected.bind(this)
                    )
                } catch (error) {
                    
                }
            })
        }

    }

    then(){
        

    }
    catch(){

    }
    finally(){

    }

    _propagateFulfilled(){

    }

    _propagateRejected(){
        
    }

    _onFulfilled(value){
        // console.log(value);
        if(this._state == states.PENDING){

            this._state = states.FULFILLED;
            this._value = value
            this._propagateFulfilled();
        }
    }

    _onRejected(reason){
        if(this._state == states.PENDING){

            this._state = states.REJECTED;
            this._reason = reason
            this._propagateRejected();
        }
    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve("build promise from scratch",1000))
});
```

```js
const states = {
    PENDING:'pending',
    FULFILLED:'fulfilled',
    REJECTED:'rejected'
};

const isThenable = maybePromise => maybePromise && typeof maybePromise.then === 'function';

class APromise{
    constructor(computation){
        this._state = states.PENDING;

        this._value = undefined;
        this._reason = undefined;

        this._thenQueue = [];
        this._finallyQueue = [];

        if(typeof computation === 'function'){
            setTimeout(()=>{
                try {
                    computation(
                        this._onFulfilled.bind(this),
                        this._onRejected.bind(this)
                    )
                } catch (error) {
                    
                }
            })
        }

    }

    then(fulfilledFn,catchFn){
        const controlledPromise = new APromise();
        this._thenQueue.push([controlledPromise, fulfilledFn, catchFn]);

        if(this._state === states.FULFILLED){
            this._propagateFulfilled();
        }else if(this._state === states.REJECTED){
            this._propagateRejected();
        }

        return controlledPromise;
    }
    catch(){
        

    }
    finally(){

    }

    _propagateFulfilled(){
        this._thenQueue.forEach(([controlledPromise, fulfilledFn])=>{
            if(typeof fulfilledFn === 'function'){
                const valueOrPromise = fulfilledFn(this._value);
                if(isThenable(valueOrPromise)){
                    valueOrPromise.then(
                        value=>controlledPromise._onFulfilled(value),
                        reason=> controlledPromise._onRejected(reason)
                    )
                }else{
                    controlledPromise._onFulfilled(valueOrPromise);
                }
            }else{
                return controlledPromise._onRejected(this._value);
            }
        });

        this._thenQueue = [];
    }

    _propagateRejected(){

    }

    _onFulfilled(value){
        // console.log(value);
        if(this._state == states.PENDING){

            this._state = states.FULFILLED;
            this._value = value
            this._propagateFulfilled();
        }
    }

    _onRejected(reason){
        if(this._state == states.PENDING){

            this._state = states.REJECTED;
            this._reason = reason
            this._propagateRejected();
        }
    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve(62,1000))
});

const firstThen = promise.then(value => {
    console.log(`Got value: ${value}`);
    return value + 1;
});

const secondThen = firstThen.then(value=>{
    console.log(`Got value: ${value}`);
    return value + 1;
});
```