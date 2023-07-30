const name = document.querySelector('#name');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');

document.addEventListener('submit',(e)=>{
    e.preventDefault();
    console.log("the name is: "+name.value+",, And email is: "+email.value+";;\n Password is: "+pass.value);
});
