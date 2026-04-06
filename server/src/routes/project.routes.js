const express = require('express');
const { createProject, getProjects, getProjectById, deleteProject } = require('../../controllers/project.controller');
const { getProjectAnalytics } = require('../services/analytics.service');
const { getSuspiciousActivity } = require('../services/detection.service');
const { protect } = require('../../middlewares/auth.middleware');
const { createProjectLimiter } = require('../../middlewares/rateLimit.middleware');
const router = express.Router();

router.use(protect); // All project routes are protected

router.post('/', createProjectLimiter, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);

// Analytics routes (nested)
router.get('/:projectId/analytics', getProjectAnalytics);
router.get('/:projectId/suspicious', getSuspiciousActivity); // Example

module.exports = router;
