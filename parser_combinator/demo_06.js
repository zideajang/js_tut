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


A.choice([1,2,3])
