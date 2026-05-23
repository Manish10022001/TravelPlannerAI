const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  generate,
  getAll,
  getOne,
  deleteOne,
  share,
} = require('../controllers/itineraryController');

router.post('/generate', protect, generate);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.delete('/:id', protect, deleteOne);
router.post('/:id/share', protect, share);

module.exports = router;