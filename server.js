const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const db = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium')

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

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes)
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

db.sync()
    .then(() => {
        app.listen(process.env.PORT);
        console.log('Listening to port: ' + process.env.PORT);
        })
        .catch (err => console.log(err));