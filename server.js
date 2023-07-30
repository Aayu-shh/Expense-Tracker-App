const bodyParser = require('body-parser');
const cors = require('cors');
//const db
const Express = require('express');
const app = new Express();

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));

app.post('/user/signup',(req,res)=>{
    console.log("the name is: " + req.body.name + ",, And email is: " + req.body.email + ";;\n Password is: " + req.body.pass);
    res.redirect(__dirname+"/views/login.html")
});

app.listen(2000,()=>{
    console.log('Listening to port: '+2000)
});