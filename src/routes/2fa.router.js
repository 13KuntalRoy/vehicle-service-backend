const express = require('express');
const router = express.Router();
const _2fa = require('../controllers/2fa.controller');
 
router.post('/enable-2fa',_2fa.enable_2fa);
router.post('/verify-2fa',_2fa.verify_2fa);

module.exports = router;
