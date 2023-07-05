import { Button, Card, Center, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';

import Loading from "../../components/Layout/Loading";
import QuizQuestions from "../../components/Quiz/Questions";
import { quizActions } from "../../store/quiz-slice";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const GET_QUESTIONS = gql`
    query QuestionsQuery(
        $categoryId: Int!,
        $custom: Boolean,
        $amount: Int!,
        $difficulty: String!,
        $type: String!
    ) {
        questions(categoryId: $categoryId, custom: $custom, amount: $amount, type: $type, difficulty: $difficulty) {
            category {
                categoryId
                categoryName
            }
            preference {
                amount
                difficulty
                type
            }
            questions {
                questionId
                question,
                options {
                    optionId
                    option
                    selected
                    correct
                }
            }
        }
    }
`;

const QuizQuestionsPage = () => {
    const selectedCategory = useSelector(state => state.quiz.selectedCategory);
    const dispatch = useDispatch();

    const params = useParams();
    const [ searchParams ] = useSearchParams();
    
    const amount = +searchParams.get('amount');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');

    const [skip, setSkip] = useState(false)
    const [ questions, setQuestions ] = useState([]);

    const { loading, data } = useQuery(GET_QUESTIONS, { 
        skip,
        variables: {
            categoryId: +selectedCategory.categoryId,
            custom: selectedCategory.custom,
            amount,
            type,
            difficulty
        }
    });

    useEffect(() => {
        if (!loading && data) {
            setSkip(true);
            setQuestions(data.questions.questions);

            if (data.questions.questions.length > 0) {
                dispatch(quizActions.setQuestions({
                    questions: data.questions.questions
                }));
                
                if (data.questions.questions.length < amount) {
                    dispatch(quizActions.setCategoryQuizPreference({
                        amount: data.questions.questions.length,
                        type,
                        difficulty
                    })); 
                }
                dispatch(quizActions.setActiveQuestionNumber(0));
            }
        }
    }, [loading, data, questions, dispatch, amount, type, difficulty]);

    return (
        <div className="wrapper pad-top--2rem">
            <Center>
                <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                    {selectedCategory.categoryName || params.id}
                </Heading>              
            </Center>
            { loading && <Loading /> }
            { !loading && questions.length > 0 && <QuizQuestions amount={questions.length} /> }
            { !loading && questions.length === 0 && 
                <Center mt='2rem'>
                    <Card w='40rem' p='1rem' align='center'>
                        <Text fontSize='2xl' mb='2rem'>No questions found!</Text>
                        <Link to='/quiz/categories'>
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='blackAlpha'
                                variant='outline'>Explore different categories</Button>
                        </Link>
                    </Card>
                </Center>
            }
        </div>
    )
};

export default QuizQuestionsPage;

