const expenseController = require('../controllers/expense');
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.post('/add', userAuth.authenticate, expenseController.addExpense);

router.get('/', userAuth.authenticate, expenseController.getExpenses);

router.post('/delete', userAuth.authenticate, expenseController.deleteExpense);

module.exports = router;

