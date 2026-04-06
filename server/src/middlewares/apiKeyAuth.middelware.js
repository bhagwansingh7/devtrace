const Project = require('../models/Project');
const { compareApiKey } = require('../utils/apiKeyGenerator');

const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key missing' });
  }

  try {
    // Find project by hashed API key (requires iterating through all projects or a better indexing strategy)
    // For production, consider storing a derived part of the key for quick lookup
    const projects = await Project.find({});
    let project = null;

    for (const proj of projects) {
      if (await compareApiKey(apiKey, proj.apiKey)) {
        project = proj;
        break;
      }
    }

    if (!project) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }

    req.project = project; // Attach project to request
    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({ message: 'Internal Server Error during API Key validation' });
  }
};

module.exports = apiKeyAuth;
