const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    categoryId: {
        type: Number,
        required: true
    },
    categoryName: {
        type: String
    }
});

const PreferenceSchema = new Schema({
    amount: {
        type: Number
    },
    difficulty: {
        type: String
    },
    type: {
        type: String
    }
});

const AttempedQuiz = new Schema({
    category: {
        type: CategorySchema
    },
    preference: {
        type: PreferenceSchema
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }

});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    attemptedQuizzes: {
        type: [ AttempedQuiz ]
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;