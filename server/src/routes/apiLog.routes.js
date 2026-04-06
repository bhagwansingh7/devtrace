const express = require('express');
const { receiveApiLog, getApiLogs } = require('../../controllers/apiLog.controller');
const apiKeyAuth = require('../middlewares/apiKeyAuth.middleware');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Route for backend services to SEND logs (requires API Key)
router.post('/api', apiKeyAuth, receiveApiLog);

// Route for dashboard users to VIEW logs (requires JWT auth + project ownership check)
router.get('/api/:projectId', protect, getApiLogs);

module.exports = router;
