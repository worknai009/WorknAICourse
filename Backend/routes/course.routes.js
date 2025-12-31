// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses
} = require('../controllers/courseController');

// Public routes
router.get('/search', searchCourses);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes (add authentication middleware as needed)
// router.use(authenticate); // Uncomment when you have auth middleware
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;