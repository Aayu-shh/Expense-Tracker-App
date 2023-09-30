
document.addEventListener('submit', async (e) => {
    console.log()
    try {
        e.preventDefault();
        await axios.post("http://localhost:2000/password/forgotpassword", { email: document.querySelector('#email').value });
        //console.log(resp);
    }
    catch (err) {
        console.log(err);
    }
})
