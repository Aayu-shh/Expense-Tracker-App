const bodyParser = require('body-parser');
const cors = require('cors');
const Express = require('express');
const path = require('path');

const db = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const userController = require('./controllers/user')
const app = new Express();

app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',(req,res,next)=>{
    //console.log('in Login Page middleware /');
    res.sendFile(path.join(__dirname,'views','login.html'));
});

app.post('/user/signup', userController.signup);

app.post('/user/login', userController.login);

app.listen(2000, () => {
    db.sync()
        .then(() =>
            console.log('Listening to port: ' + 2000))
        .catch(err => console.log(err));

});