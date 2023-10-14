const express = require('express');
const passwordController = require('../controllers/password');
const router = express.Router();

router.post('/forgotpassword', passwordController.forgot)

router.get('/resetpassword/:uuid',passwordController.reset);

router.post('/updatepassword/:uuid',passwordController.update);

module.exports = router;
