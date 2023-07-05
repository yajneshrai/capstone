import { ArrowBackIcon, ArrowForwardIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, CardHeader, Checkbox, Divider, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { quizActions } from "../../store/quiz-slice";
import { getCurrentDate, unescapeHTML } from "../../util/helpers";
import '../../styles/Quiz.scss';

const SUBMIT_QUIZ = gql`
    mutation SubmitQuiz(
        $email: String!,
        $categoryId: Int!,
        $categoryName: String,
        $amount: Int!,
        $difficulty: String!,
        $type: String!,
        $score: Int!,
        $date: Date) {
            submitQuiz(
                email: $email,
                categoryId: $categoryId,
                categoryName: $categoryName,
                amount: $amount,
                difficulty: $difficulty,
                type: $type,
                score: $score,
                date: $date) {
            success
        }
    }
`;

const QuizQuestions = ({ amount }) => {
    const userEmail = useSelector(state => state.user.profile.email);
    const selectedCategory = useSelector(state => state.quiz.selectedCategory);
    const activeQuestionNo = useSelector(state => state.quiz.activeQuestionNumber);
    const activeQuestion = useSelector(state => state.quiz.activeQuestion);
    const questions = useSelector(state => state.quiz.questions);
    const score = useSelector(state => state.quiz.result.score);

    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();

    let questionNos = [];
    for (let idx=0; idx < amount; idx++) {
        questionNos.push({
            idx,
            answered: questions?.[idx]?.options?.some(option => option.selected)
        });
    }

    const selectQuestion = (questionNo) => {
        dispatch(quizActions.setActiveQuestionNumber(questionNo.idx));
    }

    const optionChangeHandler = (currentOption, event) => {
        dispatch(quizActions.changeAnswerOption({
            checked: event.target.checked,
            currentOption
        }));
    }

    const previousHandler = () => {
        dispatch(quizActions.setActiveQuestionNumber(activeQuestionNo - 1));
    }

    const nextHandler = () => {
        dispatch(quizActions.setActiveQuestionNumber(activeQuestionNo + 1));
    }

    const [sumbitQuiz] = useMutation(SUBMIT_QUIZ, {
        variables: {
            email: userEmail,
            categoryId: +selectedCategory.categoryId,
            categoryName: selectedCategory.categoryName,
            amount: selectedCategory.noOfQuestions,
            difficulty: selectedCategory.difficulty,
            type: selectedCategory.type,
            score,
            date: getCurrentDate()
        },
        onCompleted: (response) => { 
            if (response?.submitQuiz?.success) {
                navigate(`/quiz/${params.id}/result`);
            }
        },
        onError: (error) => { console.log(error) }
    });

    const submitHandler = () => {
        dispatch(quizActions.submitQuiz());
        setTimeout(() => {
            sumbitQuiz()
        }, 0);
    }

    return (
        <>
            <div className="center neg-wrapper" style={{flexWrap: 'wrap'}}>
                {
                    questionNos.map(questionNo => (
                        <Card key={questionNo.idx}
                            className={`f-center q-no-box
                                ${activeQuestionNo === questionNo.idx ? 'active-q-no' : '' }
                                ${questionNo.answered ? 'answered' : ''}
                            `}
                            onClick={selectQuestion.bind(null, questionNo)}>
                            <CardHeader className="f-center">
                                <Heading size='sm'> {questionNo.idx + 1} </Heading>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
            <Card>
                <CardHeader className="center">
                    <Heading size='md'> {unescapeHTML(activeQuestion.question)} </Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                    <SimpleGrid columns={2} spacing={4}>
                        {
                            activeQuestion.options.map((op, idx) => (
                                <Box style={{border: '1px solid #E0E0E0', borderRadius: '1rem'}}
                                    height='60px' className="center" key={idx}>
                                    <Checkbox size='lg' colorScheme='blue' isChecked={op.selected} onChange={optionChangeHandler.bind(null, op)} >
                                        <Text as='b'> {unescapeHTML(op.option)} </Text>
                                    </Checkbox>
                                </Box>
                            ))
                        }
                    </SimpleGrid>
                </CardBody>
            </Card>
            <div className="actions">
                <div className="left">
                    {
                        activeQuestionNo !== 0 && 
                            <Button leftIcon={<ArrowBackIcon />} colorScheme='blackAlpha'
                                variant='outline' onClick={previousHandler}>Previous</Button>
                    }
                    {
                        activeQuestionNo !== questions?.length - 1 &&
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='blackAlpha'
                                variant='outline' onClick={nextHandler}>Next</Button>
                    }
                </div>
                <div className="right">
                    <Button rightIcon={<CheckCircleIcon />} colorScheme='green' onClick={submitHandler}>Submit</Button>
                </div>
            </div>
        </>
    )
};

export default QuizQuestions;

