const left = 0
const up = 1
const right = 2
const down = 3

var bitField = 0
const KEY_BITS = [4,1,8,2];
const KEY_MASKS = [0b1011,0b1110,0b0111,0b1101]; 
bitField |= KEY_BITS[right];
console.log(bitField)