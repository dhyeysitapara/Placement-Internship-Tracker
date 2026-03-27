const express = require('express');
const router = express.Router();
const { googleLogin, registerUser, loginUser } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
