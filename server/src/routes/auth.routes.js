const express = require('express');
const { register, login, getMe } = require('../../controllers/auth.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { apiLimiter } = require('../../middlewares/rateLimit.middleware');
const router = express.Router();


router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);


router.get('/me', protect, getMe);

module.exports = router;

