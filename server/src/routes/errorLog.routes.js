const express = require('express');
const { receiveErrorLog, getErrorLogs } = require('../controllers/apiLog.controller'); // errorLog controller is inside apiLog controller
const apiKeyAuth = require('../middlewares/apiKeyAuth.middleware');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route for backend services to SEND error logs (requires API Key)
router.post('/error', apiKeyAuth, receiveErrorLog);

// Route for dashboard users to VIEW error logs (requires JWT auth + project ownership check)
router.get('/error/:projectId', protect, getErrorLogs);

module.exports = router;
