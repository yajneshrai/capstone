const mongoose = require('mongoose');
const { Schema } = mongoose;

const OptionSchema = new Schema({
    option: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    }
});

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    categoryId: {
        type: Number,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    options: {
        type: [ OptionSchema ],
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    addedOn: {
        type: Date
    },
    addedBy: {
        type: String
    }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;