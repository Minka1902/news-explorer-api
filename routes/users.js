const router = require('express').Router();
const { getCurrentUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

module.exports = router;
