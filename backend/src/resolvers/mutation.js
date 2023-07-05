const User = require('../models/user');
const Category = require('../models/category');
const Question = require('../models/question');

const logger = require('../logger');

const Mutation = {
    submitQuiz: async (parent, args, context, info) => {
        logger.info({ ... args }, 'GraphQL mutation request: submitQuiz');
        const { email, categoryId, categoryName, amount, difficulty, type, score, date } = args;
        const updateDoc = {
            category: {
                categoryId,
                categoryName
            },
            preference: {
                amount,
                difficulty,
                type
            },
            score,
            date
        };

        try {
            const doc = await User.findOneAndUpdate(
                { email },
                { $push: { attemptedQuizzes: updateDoc } }, 
                { new: true }
            );
            return { success: (doc ? true : false) };
        } catch (e) {
            logger.error({ error: e }, 'GraphQL mutation error: submitQuiz');
            return {  success: false };
        }
    },

    addCategory: async (parent, args, context, info) => {
        logger.info({ ... args }, 'GraphQL mutation request: addCategory');
        const { categoryName, addedOn, addedBy } = args;
        const CUSTOM_CATEGORY_INIT_IDX = 1000;

        try {
            const customCategories = await Category.find({ custom: true });

            const categoryId = CUSTOM_CATEGORY_INIT_IDX + (customCategories.length + 1);
            const newCategory = new Category({
                categoryId,
                categoryName,
                custom: true,
                enabled: true,
                addedOn,
                addedBy
            });
    
            const response = await newCategory.save();
            return { success: (response ? true : false) };
        } catch(e) {
            logger.error({ error: e }, 'GraphQL mutation error: addCategory');
            return {  success: false };
        }
    },

    toggleCategoryActive: async (parent, args, context, info) => {
        logger.info({ ... args }, 'GraphQL mutation request: toggleCategoryActive');
        const { categoryId, categoryName, enabled } = args;

        try {
            const category = await Category.findOne({ categoryId });

            if (!category) {
                const categoryEntry = new Category({
                    categoryId,
                    categoryName,
                    custom: false,
                    enabled
                });
                const response = await categoryEntry.save();
                return { success: (response.enabled === enabled ? true : false) };
            } else {
                const category = await Category.findOneAndUpdate(
                    { categoryId },
                    { enabled },
                    { new: true }
                );
                return { success: (category.enabled === enabled ? true : false) };
            }
        } catch(e) {
            logger.error({ error: e }, 'GraphQL mutation error: toggleCategoryActive');
            return {  success: false };
        }
    },

    addQuestion: async (parent, args, context, info) => {
        logger.info({ ... args }, 'GraphQL mutation request: addQuestion');
        const { categoryId, categoryName, question, options, type, difficulty } = args;

        const newQuestion = new Question({
            categoryId,
            categoryName,
            question,
            options,
            type,
            difficulty
        });

        try {
            const response = await newQuestion.save();
            return { success: (response._id ? true: false) };
        } catch (e) {
            logger.error({ error: e }, 'GraphQL mutation error: addQuestion');
            return {  success: false };
        }
    }
}

module.exports = { Mutation };