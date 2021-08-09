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

            try {
                
            } catch (error) {
                
            }
            computation(
                this._onFulfilled.bind(this),
                this._onRejected.bind(this)
            )
        }

    }
}

const promise = new APromise((resolve, reject) => {
    setTimeout(()=> resolve("build promise from scratch",1000))
});