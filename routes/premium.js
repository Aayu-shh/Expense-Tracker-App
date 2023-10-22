const premiumController = require('../controllers/premium')
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.get('/leaderBoard', userAuth.authenticate, premiumController.getLeaderBoard);

//yet to hit from frontend
router.get('/report', userAuth.authenticate, premiumController.getReport);

router.get('/download',userAuth.authenticate,premiumController.downloadReport);

module.exports = router;