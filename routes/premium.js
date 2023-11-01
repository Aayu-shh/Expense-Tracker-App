const premiumController = require('../controllers/premium')
const userAuth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

router.get('/leaderBoard', userAuth.authenticate, premiumController.getLeaderBoard);

router.get('/reports', userAuth.authenticate, premiumController.getReports);

router.get('/reportTable/:type',userAuth.authenticate,premiumController.getReportTable);

router.get('/download',userAuth.authenticate,premiumController.downloadReport);

module.exports = router;