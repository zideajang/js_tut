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