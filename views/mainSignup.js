const name = document.querySelector('#name');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const myForm = document.querySelector('#myform')

myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUserObj = {
        named: name.value,
        emailed: email.value,
        passed: pass.value
    }
    //console.log("the name is: "+name.value+",, And email is: "+email.value+";;\n Password is: "+pass.value);
    console.log(newUserObj);
    
    try{
    const resObj = await axios.post('http://localhost:2000/user/signup', (newUserObj))
    //console.log(resObj.data);     -->> Shows for a sec then disappears as Login page is loaded instantly and console for that page comes up

    if(resObj.data.name != 'SequelizeUniqueConstraintError')
        window.alert('Your signup was Success')
        window.location.href = 'login.html';            //navigate to Login Page
    }
    catch(err){
        console.log(err);
    }
});
