import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Radio,
    RadioGroup,
    Select,
    Stack
} from "@chakra-ui/react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quizActions } from "../../store/quiz-slice";

const QuizDetails = () => {
    const categoryName = useSelector(state => state.quiz.selectedCategory.categoryName);
    const [ quizPreference, setQuizPreference ] = useState({ 
        amount: '10',
        difficulty: 'any',
        type: 'any' 
    });

    const dispatch = useDispatch();

    const handleAmountChange = (event) => {
        setQuizPreference((state) => ({ ...state, amount: event.target.value }))
    }

    const handleDifficultyChange = (value) => {
        setQuizPreference((state) => ({ ...state, difficulty: value }))
    }

    const handleTypeChange = (value) => {
        setQuizPreference((state) => ({ ...state, type: value }))
    }

    const [ searchParams ] = useSearchParams();
    const params = useParams();

    const navigate = useNavigate();

    const selectUserPref = (e) => {
        e.preventDefault();
        dispatch(quizActions.setCategoryQuizPreference({
            ...quizPreference 
        }));
        navigate({
            pathname: `/quiz/${params.id}/questions`,
            search: createSearchParams(quizPreference).toString()
        });
    }

    return (
        <div className="wrapper pad-top--2rem">
            <Center>
                <Card style={{width: '50rem'}}>
                    <CardHeader>
                        <Center>
                            <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                                {categoryName || searchParams.get('name')}
                            </Heading>
                        </Center>
                    </CardHeader>

                    <CardBody>
                        <form onSubmit={selectUserPref}>
                            <Stack spacing='10'>
                
                                <FormControl>
                                    <FormLabel>
                                        Number of questions
                                    </FormLabel>
                                    <Select name='amount' onChange={handleAmountChange} defaultValue={quizPreference.amount}>
                                        <option value='10'>10</option>
                                        <option value='15'>15</option>
                                        <option value='20'>20</option>
                                    </Select>
                                </FormControl>

                                <FormControl as='fieldset'>
                                    <FormLabel as='legend'>
                                        Difficulty level
                                    </FormLabel>
                                    <RadioGroup name='difficulty' onChange={handleDifficultyChange} defaultValue={quizPreference.difficulty}>
                                        <HStack spacing='24px'>
                                            <Radio value='any'>Any</Radio>
                                            <Radio value='easy'>Easy</Radio>
                                            <Radio value='medium'>Medium</Radio>
                                            <Radio value='hard'>Hard</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>

                                <FormControl as='fieldset'>
                                    <FormLabel as='legend'>
                                        Question type
                                    </FormLabel>
                                    <RadioGroup name='type' onChange={handleTypeChange} defaultValue={quizPreference.type}>
                                        <HStack spacing='24px'>
                                            <Radio value='any'>Any</Radio>
                                            <Radio value='multiple'>Multiple choice</Radio>
                                            <Radio value='boolean'>True / False</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                            
                                <Button rightIcon={<ArrowForwardIcon />} mt={4} type='submit'>
                                    Start Quiz
                                </Button>
                            </Stack>
                        </form>
                    </CardBody>
                </Card>
            </Center>
        </div>
    );
};

export default QuizDetails;

