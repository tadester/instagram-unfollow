
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/user/data', userController.getUserData);
router.post('/user/unfollow/:userId', userController.unfollowUser);

module.exports = router;
