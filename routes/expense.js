const expenseController = require('../controllers/expense');
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.post('/addExpense', userAuth.authenticate, expenseController.addExpense);

router.get('/getExpenses', userAuth.authenticate, expenseController.getExpenses);

router.get('/getLdrbrdData', userAuth.authenticate, expenseController.getLdrbrdData);

router.post('/deleteExpense', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;

