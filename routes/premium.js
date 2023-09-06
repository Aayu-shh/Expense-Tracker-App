const premiumController = require('../controllers/premium')
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.get('/leaderBoard', userAuth.authenticate, premiumController.getLeaderBoard);

module.exports = router;