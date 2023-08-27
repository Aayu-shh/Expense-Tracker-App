const expenseController = require('../controllers/expense');
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.post('/expense/addExpense', userAuth.authenticate, expenseController.addExpense);

router.get('/expense/getExpenses', userAuth.authenticate, expenseController.getExpenses);

router.post('/expense/deleteExpense', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;

