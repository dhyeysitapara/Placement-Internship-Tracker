const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getUpcoming,
} = require('../controllers/applicationController');

router.get('/upcoming', getUpcoming);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
