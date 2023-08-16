const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  addFriend,
  removeFriend,
  deleteUser,
} = require('../../controllers/userController');

// /api/courses
router.route('/').get(getUsers).post(createUser);

//api/courses/:courseId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);
module.exports = router;
