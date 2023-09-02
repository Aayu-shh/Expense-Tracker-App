const premiumController = require('../controllers/premium')
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.get('/getLeaderBoard', userAuth.authenticate, premiumController.getLeaderBoard);

module.exports = router;