const express = require('express');
const purchaseController = require('../controllers/purchase');
const userAuth = require('../middlewares/auth');

const router = express.Router();

router.get('/premiumMembership',userAuth.authenticate ,purchaseController.purchasePremium);

router.post('/payment', userAuth.authenticate, purchaseController.updatePaymentStatus);

module.exports = router;