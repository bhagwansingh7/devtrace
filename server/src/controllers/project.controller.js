const Project = require('../models/Project');
const { generateApiKey } = require('../utils/apiKeyGenerator');

exports.createProject = async (req, res, next) => {
  const { name } = req.body;
  try {
    const { plainKey, hashedKey } = await generateApiKey();
    const project = await Project.create({
      name,
      userId: req.user._id,
      apiKey: hashedKey,
      apiKeyPlain: plainKey // Temporarily store plain key for immediate return
    });
    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project._id,
        name: project.name,
        apiKey: plainKey, // Return the plain key only ONCE
        createdAt: project.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).select('-apiKey -apiKeyPlain'); // Don't return API keys
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id }).select('-apiKey -apiKeyPlain');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // TODO: Also delete all associated API logs and Error logs
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};
