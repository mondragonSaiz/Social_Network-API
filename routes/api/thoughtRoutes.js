const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  createReaction,
  updateThought,
  deleteThought,
} = require('../../controllers/thoughtController');

// /api/thoughts/
router.route('/').get(getThoughts).post(createThought);

//api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);
router.route('/:thoughtId/reactions').post(createReaction);

module.exports = router;
