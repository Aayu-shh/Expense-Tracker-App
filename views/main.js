const name = document.querySelector('#name');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')

myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userObj = {
        named: name.value,
        emailed: email.value,
        passed: pass.value
    }
    //console.log("the name is: "+name.value+",, And email is: "+email.value+";;\n Password is: "+pass.value);
    console.log(userObj);
    
    axios.post('http://localhost:2000/user/signup', (userObj))
        .then(resObj => console.log(resObj.data))
        .catch(err => console.log(err));
});
