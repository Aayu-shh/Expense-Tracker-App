const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

//const path = require('./util/path');
const db = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const userController = require('./controllers/user')
const app = express();

app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'views')));
//app.set('views','views');

app.get('/',(req,res,next)=>{
    //console.log('in Login Page middleware /');
    console.log(path);
    res.redirect('/login.html');
});

app.post('/user/signup', userController.signup);

app.post('/user/login', userController.login);

app.post('/expense/addExpense',userController.addExpense);

app.get('/expense/getExpenses', userController.getExpenses);

app.post('/expense/deleteExpense',userController.deleteExpense)

app.listen(2000, () => {
    db.sync()
        .then(() =>
            console.log('Listening to port: ' + 2000))
        .catch(err => console.log(err));

});