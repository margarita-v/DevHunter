import uuid from 'uuid/v4';
import mongoose, { Schema } from 'mongoose';

const CvSchema = new Schema({
    userHash: {
        type: String,
        required: 'User hash is required',
    },
    hash: {
        type: String,
        unique: 'Hash must be unique',
    },
    title: {
        trim: true,
        type: String,
        required: 'Title is required',
    },
    description: {
        trim: true,
        type: String,
        required: 'Description is required',
    },
    tags: {
        trim: true,
        type: [String],
        required: true,
        validate: [(tags) => tags.length > 0, 'Tags are required'],
    },
    phone: {
        trim: true,
        type: String,
    },
    skype: {
        trim: true,
        type: String,
    },
    jobHistory: [{
        companyName: {
            trim: true,
            type: String,
            required: 'Company name is required',
        },
        jobName: {
            trim: true,
            type: String,
            required: 'Job name is required',
        },
        description: {
            trim: true,
            type: String,
            required: 'Description is required',
        },
        date: {
            start: {
                type: Date,
                required: 'Start date is required',
            },
            end: {
                type: Date,
            },
        },
        isCurrentJob: {
            type: Boolean,
            default: false,
        },
    }],
});

/**
 * Static parameters for a model which will return an array of fields for a CV creation
 */
CvSchema.statics.createFields =
    ['hash', 'title', 'description', 'tags', 'phone', 'skype', 'jobHistory'];

/**
 * Handler for a CV creation
 */
CvSchema.pre('save', function(next) {
    if (!this.hash) {
        this.hash = uuid();
    }
    next();
});


export default mongoose.model('cv', CvSchema);
