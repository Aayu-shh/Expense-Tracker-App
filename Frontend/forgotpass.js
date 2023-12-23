
document.addEventListener('submit', async (e) => {
    console.log()
    try {
        e.preventDefault();
        const fgresp = await axios.post("http://localhost:2000/password/forgotpassword", { email: document.querySelector('#email').value });
        if(fgresp.data.success==true) alert('Check you email for Password Reset link');
    }
    catch (err) {
        console.log(err);
    }
})
