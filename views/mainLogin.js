const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')
const myDiv = document.querySelector('#myDiv');
myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const existingUserObj = {
        emailed: email.value,
        passed: pass.value
    }
    //console.log("the name is: "+name.value+",, And email is: "+email.value+";;\n Password is: "+pass.value);
    //console.log(existingUserObj);

    axios.post('http://localhost:2000/user/login', (existingUserObj))
        .then(resObj => {
            window.alert('User logged in Successfully');
            console.log(resObj.data);
        })
        .catch(err => {
            myDiv.append(document.createTextNode(err));
            myDiv.classList.add("redText");
        });
});
