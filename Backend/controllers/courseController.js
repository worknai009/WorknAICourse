const Course = require("../model/course.model");

const getAllCourses = async (req, res) => {
    try {
        // Build query object
        const queryObj = { ...req.query };

        // Remove fields that are not for filtering
        const excludedFields = ["page", "sort", "limit", "fields", "search"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering (e.g., price[gte]=1000)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Course.find(JSON.parse(queryStr));

        // Search functionality
        if (req.query.search) {
            query = query.find({
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } },
                    { description: { $regex: req.query.search, $options: "i" } },
                    {
                        "syllabusPhases.title": { $regex: req.query.search, $options: "i" },
                    },
                ],
            });
        }

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt"); // Default: newest first
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v"); // Exclude __v by default
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Execute query
        const courses = await query;

        // Get total count for pagination info
        const total = await Course.countDocuments(JSON.parse(queryStr));

        res.status(200).json({
            success: true,
            count: courses.length,
            total,
            pagination: {
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses",
            error: error.message,
        });
    }
};

/**
 * @desc    Get single course by custom ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ id: req.params.id }).select("-__v");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching course",
            error: error.message,
        });
    }
};

/**
 * @desc    Get single course by MongoDB _id
 * @route   GET /api/courses/mongo/:mongoId
 * @access  Public
 */
const getCourseByMongoId = async (req, res) => {
    try {
        const course = await Course.findById(req.params.mongoId).select("-__v");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching course",
            error: error.message,
        });
    }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private/Admin
 */
const createCourse = async (req, res) => {
    try {
        // Check if course with same ID already exists
        const existingCourse = await Course.findOne({ id: req.body.id });

        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "Course with this ID already exists",
            });
        }

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error creating course:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate field value entered",
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message,
        });
    }
};

/**
 * @desc    Update course by custom ID
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            {
                new: true, // Return updated document
                runValidators: true, // Run schema validators
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error updating course:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating course",
            error: error.message,
        });
    }
};

/**
 * @desc    Delete course (soft delete by setting isActive to false)
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 */
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { id: req.params.id },
            { isActive: false },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message,
        });
    }
};

/**
 * @desc    Permanently delete course from database
 * @route   DELETE /api/courses/:id/permanent
 * @access  Private/Admin
 */
const permanentDeleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ id: req.params.id });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course permanently deleted",
            data: course,
        });
    } catch (error) {
        console.error("Error permanently deleting course:", error);
        res.status(500).json({
            success: false,
            message: "Error permanently deleting course",
            error: error.message,
        });
    }
};

/**
 * @desc    Restore soft-deleted course
 * @route   PATCH /api/courses/:id/restore
 * @access  Private/Admin
 */
const restoreCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { id: req.params.id },
            { isActive: true },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course restored successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error restoring course:", error);
        res.status(500).json({
            success: false,
            message: "Error restoring course",
            error: error.message,
        });
    }
};

/**
 * @desc    Get course statistics
 * @route   GET /api/courses/stats
 * @access  Public
 */
const getCourseStats = async (req, res) => {
    try {
        const stats = await Course.aggregate([
            {
                $match: { isActive: true },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    avgOriginalPrice: { $avg: "$originalPrice" },
                    avgDiscountedPrice: { $avg: "$discountedPrice" },
                    minPrice: { $min: "$discountedPrice" },
                    maxPrice: { $max: "$discountedPrice" },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        const totalCourses = await Course.countDocuments({ isActive: true });
        const totalInactive = await Course.countDocuments({ isActive: false });

        res.status(200).json({
            success: true,
            data: {
                total: totalCourses,
                inactive: totalInactive,
                byStatus: stats,
            },
        });
    } catch (error) {
        console.error("Error fetching course stats:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching course statistics",
            error: error.message,
        });
    }
};

/**
 * @desc    Search courses by query string
 * @route   GET /api/courses/search?q=mern
 * @access  Public
 */
const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const courses = await Course.find({
            isActive: true,
            $or: [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { status: { $regex: q, $options: "i" } },
                { language: { $regex: q, $options: "i" } },
                { "syllabusPhases.title": { $regex: q, $options: "i" } },
                { "syllabusPhases.desc": { $regex: q, $options: "i" } },
                { "technicalSpecs.label": { $regex: q, $options: "i" } },
                { "technicalSpecs.value": { $regex: q, $options: "i" } },
            ],
        })
            .select("-__v")
            .limit(20)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            query: q,
            data: courses,
        });
    } catch (error) {
        console.error("Error searching courses:", error);
        res.status(500).json({
            success: false,
            message: "Error searching courses",
            error: error.message,
        });
    }
};

/**
 * @desc    Get courses by price range
 * @route   GET /api/courses/price-range?min=10000&max=50000
 * @access  Public
 */
const getCoursesByPriceRange = async (req, res) => {
    try {
        const { min = 0, max = 1000000 } = req.query;

        const courses = await Course.find({
            isActive: true,
            discountedPrice: {
                $gte: parseFloat(min),
                $lte: parseFloat(max),
            },
        })
            .select("-__v")
            .sort({ discountedPrice: 1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            priceRange: { min: parseFloat(min), max: parseFloat(max) },
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching courses by price range:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses by price range",
            error: error.message,
        });
    }
};

/**
 * @desc    Get courses by status (Online/Offline/Hybrid)
 * @route   GET /api/courses/status/:status
 * @access  Public
 */
const getCoursesByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        // Validate status
        const validStatuses = ["Online", "Offline", "Hybrid"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
        }

        const courses = await Course.find({
            status,
            isActive: true,
        })
            .select("-__v")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            status,
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching courses by status:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching courses by status",
            error: error.message,
        });
    }
};

/**
 * @desc    Get featured/popular courses
 * @route   GET /api/courses/featured
 * @access  Public
 */
const getFeaturedCourses = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 6;

        // You can add a 'featured' field to your schema later
        // For now, return courses with highest discount percentage
        const courses = await Course.find({ isActive: true })
            .select("-__v")
            .sort({ createdAt: -1 })
            .limit(limit);

        // Calculate discount percentage for each
        const coursesWithDiscount = courses.map((course) => {
            const discountPercent = Math.round(
                ((course.originalPrice - course.discountedPrice) /
                    course.originalPrice) *
                100
            );
            return {
                ...course.toObject(),
                discountPercent,
            };
        });

        // Sort by discount percentage
        coursesWithDiscount.sort((a, b) => b.discountPercent - a.discountPercent);

        res.status(200).json({
            success: true,
            count: coursesWithDiscount.length,
            data: coursesWithDiscount,
        });
    } catch (error) {
        console.error("Error fetching featured courses:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching featured courses",
            error: error.message,
        });
    }
};

/**
 * @desc    Get course syllabus only
 * @route   GET /api/courses/:id/syllabus
 * @access  Public
 */
const getCourseSyllabus = async (req, res) => {
    try {
        const course = await Course.findOne({ id: req.params.id }).select(
            "id name syllabusPhases"
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: course.id,
                name: course.name,
                syllabus: course.syllabusPhases,
            },
        });
    } catch (error) {
        console.error("Error fetching course syllabus:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching course syllabus",
            error: error.message,
        });
    }
};

/**
 * @desc    Bulk create courses
 * @route   POST /api/courses/bulk
 * @access  Private/Admin
 */
const bulkCreateCourses = async (req, res) => {
    try {
        const { courses } = req.body;

        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of courses",
            });
        }

        const createdCourses = await Course.insertMany(courses, {
            ordered: false, // Continue on error
        });

        res.status(201).json({
            success: true,
            message: `${createdCourses.length} courses created successfully`,
            count: createdCourses.length,
            data: createdCourses,
        });
    } catch (error) {
        console.error("Error bulk creating courses:", error);

        // Even if some fail, return what succeeded
        if (error.writeErrors) {
            return res.status(207).json({
                success: true,
                message: "Partial success",
                inserted: error.result.nInserted,
                failed: error.writeErrors.length,
                errors: error.writeErrors,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error bulk creating courses",
            error: error.message,
        });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    getCourseByMongoId,
    createCourse,
    updateCourse,
    deleteCourse,
    permanentDeleteCourse,
    restoreCourse,
    getCourseStats,
    searchCourses,
    getCoursesByPriceRange,
    getCoursesByStatus,
    getFeaturedCourses,
    getCourseSyllabus,
    bulkCreateCourses,
};