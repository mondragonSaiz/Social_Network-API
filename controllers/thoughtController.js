const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select('-__v');
      if (!thoughts) {
        return res.status(400).json({ message: 'Error : No users Found' });
      }
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createThought(req, res) {
    try {
      const newthought = await Thought.create(req.body);
      if (!newthought) {
        return res.status(400).json({ message: 'Error creating thought' });
      }
      res.status(200).json(newthought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const filter = { _id: req.params.thoughtId }; // Replace 'user_id_here' with the actual user ID you want to update
      const update = {
        thoughtText: req.body.thoughtText,
      }; // Example: Update the email property
      const options = { new: true }; // Optional: Return the updated document

      const existingThought = await Thought.findOneAndUpdate(
        filter,
        update,
        options
      );
      res.status(200).json(existingThought);
    } catch (err) {
      res.status(500).json({ message: 'Error while updating user' });
    }
  },
  async createReaction(req, res) {
    try {
      const filter = { _id: req.params.thoughtId }; // Replace 'user_id_here' with the actual user ID you want to update
      const update = {
        reactions: req.body,
      }; // Example: Update the email property
      const options = { new: true }; // Optional: Return the updated document

      const existingThought = await Thought.findOneAndUpdate(
        filter,
        { $addToSet: update },
        options
      );
      res.status(200).json(existingThought);
    } catch (err) {
      res.status(500).json({ message: 'Error while updating user' });
    }
  },
  // Delete a student and remove them from the course
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with the id provided ' });
      }

      // const thoughts = await Thought.findOneAndUpdate(
      //   { students: req.params.studentId },
      //   { $pull: { students: req.params.studentId } },
      //   { new: true }
      // );

      // if (!course) {
      //   return res.status(404).json({
      //     message: 'Student deleted, but no courses found',
      //   });
      // }

      res.json({ message: 'Student successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async deleteReaction(req, res) {
    try {
      const filter = { _id: req.params.thoughtId };
      const update = {
        reactions: req.body,
      };
      const options = { new: true };

      const existingThought = await Thought.findOneAndUpdate(
        filter,
        { $pull: { reactions: { _id: req.params.reactionId } } }, // Remove the reaction with the specified _id
        options
      );

      res.status(200).json(existingThought);
    } catch (err) {
      res.status(500).json({ message: 'Error while updating thought' });
    }
  },
};
