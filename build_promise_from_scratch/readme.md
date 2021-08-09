### write promise from scratch

- "promise" is an object or function with a then method whose behavior conforms to this specification
- "thenable" is an object or function that defines a then method
- "value" is any legal JavaScript value(including undefined, a thenable or a promise)
- "exception" is a value that is thrown using the throw statement
- "reason" is a value that indicates why a promise was rejected

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

