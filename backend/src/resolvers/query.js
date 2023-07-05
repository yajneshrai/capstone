const axios = require('axios');
const logger = require('../logger');

const User = require('../models/user');
const Category = require('../models/category');
const Question = require('../models/question');

const Query = {
    categories: async () => {
        logger.info('GraphQL query request: categories');
        try {
            const response = await axios.get('https://opentdb.com/api_category.php');
            const defaultCategories = response.data?.trivia_categories?.map(category => ({
                categoryId: category.id,
                categoryName: category.name,
                custom: false
            }));

            const storedCategories = await Category.find();
            const disabledDefaultCategoryIds = storedCategories
                .filter(cat => !cat.custom && !cat.enabled)
                .map(cat => cat.categoryId);

            let categories = {
                custom: [ ... storedCategories.filter(cat => cat.custom && !cat.disabled) ],
                default: [ ... defaultCategories.filter(cat => !disabledDefaultCategoryIds.includes(cat.categoryId)) ]
            };

            categories = categories.default.concat(categories.custom);

            return categories;
        } catch (e) {
            logger.error({ error: e }, 'GraphQL query error: categories');
            return [];
        }
    },

    questions: async(root, args) => {
        logger.info({ ... args }, 'GraphQL query request: questions');
        let { categoryId, custom, amount, difficulty, type } = args;
        difficulty = difficulty === 'any' ? '' : difficulty;
        type = type === 'any' ? '' : type;

        if (custom) {
            try {
                let filter = { categoryId };
                if (difficulty) {
                    filter = { ...filter, difficulty };
                }
                if (type) {
                    filter = { ...filter, type };
                }

                let questions = await Question.find(filter).limit(amount);
                
                const categoryName = questions?.[0]?.categoryName;
    
                questions = questions.map((q, qidx) => ({
                    questionId: q._id.toString(),
                    question: q.question,
                    options: shuffleArray([
                        ...q.options.map((opt, oidx) => ({
                            optionId: opt._id.toString(),
                            option: opt.option,
                            correct: opt.correct,
                            selected: false
                        }))
                    ])
                }));

                return {
                    category: {
                        categoryId, categoryName
                    },
                    preference: {
                        amount, difficulty, type
                    },
                    questions
                }
            } catch(e) {
                logger.error({ error: e }, 'GraphQL query error: questions');
            }
        } else {
            let searchString = `category=${categoryId}&amount=${amount}&difficulty=${difficulty}&type=${type}`;

            try {
                const response = await axios.get(`https://opentdb.com/api.php?${searchString}`);
    
                const categoryName = response.data?.results[0]?.category;
    
                const questions = response.data?.results.map((q, qidx) => ({
                    questionId: `question-${qidx}`,
                    question: q.question,
                    options: shuffleArray([ 
                        ...q.incorrect_answers.map(ans => (
                            {
                                option: ans,
                                correct: false,
                                selected: false 
                            })),
                        { 
                            option: q.correct_answer,
                            correct: true,
                            selected: false 
                        }
                    ])
                }));
    
                questions.forEach((question, qidx) => {
                    question.options = question.options.map((opt, oidx) => ({ 
                        optionId: `option-${qidx}-${oidx}`, ... opt
                    }));
                });
    
                return {
                    category: {
                        categoryId, categoryName
                    },
                    preference: {
                        amount, difficulty, type
                    },
                    questions
                }
            } catch (e) {
                logger.error({ error: e }, 'GraphQL query error: questions');
            }
        }

    },

    findUser: async(root, args) => {
        logger.info({ ... args }, 'GraphQL query request: findUser');
        const { email } = args;
        const user = await User.findOne({ email });

        try {
            return user ? user : null;
        } catch(e) {
            logger.error({ error: e }, 'GraphQL query error: findUser');
            return null;
        }
    },

    adminCategory: async (root, args) => {
        logger.info({ ... args }, 'GraphQL query request: adminCategory');
    
        try {
            const { categoryId } = args;
            let category = await Category.findOne({ categoryId });
            let defaultCategory;
            let questions = [];
            
            if (category?.custom) {
                questions = await Question.find({ categoryId });
                questions = questions.map(q => ({
                    questionId: q._id.toString(),
                    question: q.question,
                    options: q.options.map(o => ({
                        optionId: o._id.toString(),
                        option: o.option,
                        correct: o.correct,
                    }))
                }))
            } else {
                let response = await axios.get(`https://opentdb.com/api_count.php?category=${categoryId}`);
                respone = response.data.category_question_count;
                
                if (!category) {
                    category = { 
                        categoryId,
                        custom: false,
                        enabled: true
                    };
                }

                defaultCategory = {
                    categoryId,
                    questionCount: {
                        total: respone.total_question_count,
                        easy: respone.total_easy_question_count,
                        medium: respone.total_medium_question_count,
                        hard: respone.total_hard_question_count,
                    }
                }
            }

            return {
                category,
                default: defaultCategory,
                questions
            }
            
        } catch (e) {
            logger.error({ error: e }, 'GraphQL query error: adminCategory');;
            return null;
        }
    },

    adminCategories: async () => {
        logger.info('GraphQL query request: adminCategories');
        try {
            const response = await axios.get('https://opentdb.com/api_category.php');
            const defaultCategories = response.data?.trivia_categories?.map(category => ({
                categoryId: category.id,
                categoryName: category.name,
                custom: false,
                enabled: true
            }));

            const storedCategories = await Category.find();

            let categories = {
                custom: [],
                default: [ ... defaultCategories ]
            };

            storedCategories.forEach(storedCategory => {
                if (storedCategory.custom) {
                    categories.custom.push(storedCategory);
                } else {
                    const existingCategoryIdx = categories.default.findIndex(c => c.categoryId === storedCategory.categoryId);
                    const existingCategory = {
                        categoryId: storedCategory.categoryId,
                        categoryName: storedCategory.categoryName,
                        custom: storedCategory.custom,
                        enabled: storedCategory.enabled
                    };
                    categories.default.splice(existingCategoryIdx, 1, existingCategory)
                }
            });

            categories = categories.default.concat(categories.custom);
            return categories;
        } catch (e) {
            logger.error({ error: e }, 'GraphQL query error: adminCategories');
            return [];
        }
    }
}

const shuffleArray = (array = []) => {
    for (let idx = 0; idx < array.length; idx++) {
        let temp = Math.floor(Math.random() * (array.length));
        [ array[temp], array[idx] ] = [ array[idx], array[temp] ];
    }
    return array;
}

module.exports = { Query };