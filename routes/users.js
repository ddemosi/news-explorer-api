const router = require('express').Router();

const { getCurrentUserInfo, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

// Retrieve current user profile for the User Context
router.get('/users/me', auth, getCurrentUserInfo);

router.get('/users/logout', auth, logout);

module.exports = router;
