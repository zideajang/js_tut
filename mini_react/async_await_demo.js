// function hello() { return "Hello" };
// console.log(hello());

// async function hello() { return "Hello" };
// console.log(hello());


// function resolveAfter2Seconds() {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve('resolved');
//       }, 2000);
//     });
// }
  
// async function asyncCall() {
//     console.log('calling');
//     const result = await resolveAfter2Seconds();
//     console.log(result);
//     // expected output: "resolved"
// }
  
// asyncCall();

// let hello = async () => { return "Hello" };
// hello().then((value) => console.log(value));


//Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
// let response = await fetch('http://10.1.0.67:5000/one');



// fetch('http://10.1.0.67:5000/get_image')
// .then(response => {
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return response.blob();
// })
// .then(myBlob => {
//   let objectURL = URL.createObjectURL(myBlob);
//   let image = document.createElement('img');
//   image.src = objectURL;
//   document.body.appendChild(image);
// })
// .catch(e => {
//   console.log('There has been a problem with your fetch operation: ' + e.message);
// });


// async function myFetch() {
//     let response = await fetch('http://10.1.0.67:5000/get_image');
  
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
  
//     let myBlob = await response.blob();
  
//     let objectURL = URL.createObjectURL(myBlob);
//     let image = document.createElement('img');
//     image.src = objectURL;
//     document.body.appendChild(image);
//   }
  
//   myFetch()
//   .catch(e => {
//     console.log('There has been a problem with your fetch operation: ' + e.message);
//   });


// async function myFetch() {
//     let response = await fetch('http://10.1.0.67:5000/get_image');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.blob();
  
//   }
  
//   myFetch().then((blob) => {
//     let objectURL = URL.createObjectURL(blob);
//     let image = document.createElement('img');
//     image.src = objectURL;
//     document.body.appendChild(image);
//   }).catch(e => console.log(e));

async function hello(){
   res = await fetch('http://10.1.0.67:5000/one'); 
   console.log(res);
   return res;
}

hello()