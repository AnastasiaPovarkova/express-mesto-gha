const router = require('express').Router();

const {
  getUsers, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
