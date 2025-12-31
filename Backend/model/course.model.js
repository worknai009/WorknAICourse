// models/Course.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const weekSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topics: [topicSchema]
});

const syllabusPhaseSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    weeks: [weekSchema]
});

const technicalSpecSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

const courseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Online', 'Offline', 'Hybrid']
    },
    language: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    technicalSpecs: [technicalSpecSchema],
    syllabusPhases: [syllabusPhaseSchema],
    certificateImage: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
courseSchema.index({ id: 1 });
courseSchema.index({ name: 1 });

const Course = mongoose.model('courses', courseSchema);

module.exports = Course;