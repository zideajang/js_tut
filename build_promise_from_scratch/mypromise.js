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
})