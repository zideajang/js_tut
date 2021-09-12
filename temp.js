function func(){}
console.log(func.name)
console.log(typeof(func))
func.someproperty = 'some property'
console.log(func.someproperty);


function Tut(title,lesson){
    console.log("do something");
    this.title = title;
    this.lesson = lesson
}

Tut.prototype.methodOfTut =()=>{
    console.log(this.lesson)
}



const tut1 = new Tut("machine leanring",12);
tut1.methodOfTut()
console.log(tut1)
console.log(Tut.prototype.methodOfTut())


const tut2 = Tut("machine leanring",12);
console.log(tut2)

let a = {
    someWords :' world'
}

function greet() {
    console.log( `hello ${this.someWords}`);
}
greet.apply(a);