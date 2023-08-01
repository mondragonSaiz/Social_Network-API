const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate('thoughts')
        .populate('friends')
        .select('-__v');
      if (!users) {
        return res
          .status(400)
          .json({ message: 'Something went wrong: No users found' });
      }
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({
        _id: req.params.userId,
      })
        .populate('thoughts')
        .populate('friends')
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
      const filter = { _id: req.params.userId };
      const update = {
        friends: req.params.friendId,
      };
      const existingUser = await User.findOneAndUpdate(
        filter,
        {
          $addToSet: update,
        },
        { new: true }
      );
      res.status(200).json(existingUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const filter = { _id: req.params.userId }; // Replace 'user_id_here' with the actual user ID you want to update
      const update = { username: req.body.username, email: req.body.email }; // Example: Update the email property
      const options = { new: true }; // Optional: Return the updated document

      const existingUser = await User.findOneAndUpdate(filter, update, options);
      res.status(200).json(existingUser);
    } catch (err) {
      res.status(500).json({ message: 'Error while updating user' });
    }
  },

  // Delete a user and remove
  async deleteUser(req, res) {
    try {
      const existingUser = await User.findById(req.params.userId).exec();
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Existing User:', existingUser);

      // Remove all thoughts associated with this user
      await Thought.deleteMany({ username: existingUser.username });

      // Trigger the 'remove' middleware by calling the deleteOne() method on the user document
      const removedUser = await existingUser.deleteOne();

      console.log(
        'User and associated thoughts have been removed:',
        removedUser
      );
      res.status(200).json(removedUser);
    } catch (err) {
      console.error('Error while removing user:', err);
      res.status(500).json({ error: 'Error while removing user' });
    }
  },
};
