const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    categoryId: {
        type: Number,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    custom: {
        type: Boolean
    },
    enabled: {
        type: Boolean
    },
    addedOn: {
        type: Date
    },
    addedBy: {
        type: String
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;