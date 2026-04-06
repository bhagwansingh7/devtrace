const ApiLog = require('../models/ApiLog');
const ErrorLog = require('../models/ErrorLog');
const { logIngestionLimiter } = require('../middlewares/rateLimit.middleware'); // For incoming logs

exports.receiveApiLog = [
  logIngestionLimiter, // Apply rate limit to incoming logs
  async (req, res, next) => {
    try {
      const { endpoint, method, statusCode, responseTime, ipAddress, userAgent, headers, body } = req.body;
      const newLog = await ApiLog.create({
        projectId: req.project._id, // projectId is set by apiKeyAuth middleware
        endpoint, method, statusCode, responseTime, ipAddress, userAgent, headers, body
      });
      res.status(201).json({ success: true, message: 'API log received', logId: newLog._id });
    } catch (err) {
      next(err);
    }
  }
];

exports.receiveErrorLog = [
  logIngestionLimiter, // Apply rate limit to incoming logs
  async (req, res, next) => {
    try {
      const { endpoint, method, statusCode, errorMessage, stackTrace, ipAddress, userAgent, headers, body } = req.body;
      const newErrorLog = await ErrorLog.create({
        projectId: req.project._id,
        endpoint, method, statusCode, errorMessage, stackTrace, ipAddress, userAgent, headers, body
      });
      res.status(201).json({ success: true, message: 'Error log received', logId: newErrorLog._id });
    } catch (err) {
      next(err);
    }
  }
];

// Dashboard functions for retrieving logs
exports.getApiLogs = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    // Ensure the project belongs to the user
    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const { page = 1, limit = 20, method, statusCode, search, startDate, endDate } = req.query;
    const query = { projectId: projectId };

    if (method) query.method = method;
    if (statusCode) query.statusCode = parseInt(statusCode);
    if (search) query.endpoint = { $regex: search, $options: 'i' }; // Case-insensitive search
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await ApiLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ApiLog.countDocuments(query);

    res.status(200).json({ success: true, count: logs.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: logs });
  } catch (err) {
    next(err);
  }
};

exports.getErrorLogs = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const { page = 1, limit = 20, method, statusCode, search, startDate, endDate } = req.query;
    const query = { projectId: projectId };

    if (method) query.method = method;
    if (statusCode) query.statusCode = parseInt(statusCode);
    if (search) query.errorMessage = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await ErrorLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ErrorLog.countDocuments(query);

    res.status(200).json({ success: true, count: logs.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: logs });
  } catch (err) {
    next(err);
  }
};
