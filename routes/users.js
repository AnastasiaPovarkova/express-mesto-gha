const router = require('express').Router();

const {
  getUsers, aboutUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', aboutUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
