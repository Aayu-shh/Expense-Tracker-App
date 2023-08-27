const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

const db = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();

app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
//app.set('views','views');

app.get('/', (req, res, next) => {
    //console.log('in Login Page middleware /');
    console.log(path);
    res.redirect('/login.html');
});

app.use(userRoutes);

app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

db.sync()
    .then(() => {
        app.listen(2000);
        console.log('Listening to port: ' + 2000);
        })
        .catch (err => console.log(err));