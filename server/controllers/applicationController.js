const Application = require('../models/Application');

// @desc  Get all applications
// @route GET /api/applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single application
// @route GET /api/applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create application
// @route POST /api/applications
const createApplication = async (req, res) => {
  try {
    const application = new Application({ ...req.body, user: req.user.id });
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update application
// @route PUT /api/applications/:id
const updateApplication = async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete application
// @route DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get upcoming interview rounds (next 7 days)
// @route GET /api/applications/upcoming
const getUpcoming = async (req, res) => {
  try {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    // Find applications that have at least one round in the next 7 days
    const apps = await Application.find({
      user: req.user.id,
      'interviewRounds.date': { $gte: now, $lte: in7Days },
    }).sort({ 'interviewRounds.date': 1 });

    // Flatten into individual upcoming rounds with app context
    const upcomingRounds = [];
    apps.forEach(app => {
      app.interviewRounds.forEach(round => {
        const d = new Date(round.date);
        if (d >= now && d <= in7Days) {
          upcomingRounds.push({
            appId: app._id,
            company: app.company,
            role: app.role,
            status: app.status,
            roundType: round.roundType,
            date: round.date,
            notes: round.notes,
          });
        }
      });
    });

    upcomingRounds.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(upcomingRounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getUpcoming,
};
