const router = require('express').Router();

const { getCurrentUserInfo } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Retrieve current user profile for the User Context
router.get('/users/me', auth, getCurrentUserInfo);

module.exports = router;
