import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Button,
    Card,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { unescapeHTML } from "../../util/helpers";
import '../../styles/Quiz.scss';

const QuizResult = () => {
    const selectedCategory = useSelector(state => state.quiz.selectedCategory);
    const questions = useSelector(state => state.quiz.questions);
    const score = useSelector(state => state.quiz.result.score);

    const percentage = Math.floor((score * 100) / selectedCategory.noOfQuestions);

    const getUserAnswer = (options = []) =>{
        return options.find(op => op.selected === true)?.option || '';
    }

    const getCorrectAnswer = (options = []) =>{
        return options.find(op => op.correct === true)?.option || '';
    }

    return (
        <>
            <div className="wrapper pad-top--2rem result">
                <Center>
                    <Heading as='h1' size='xl' noOfLines={2} className="fw-300">
                        Your quiz result
                    </Heading>
                </Center>
                <Center>
                    <Card style={{minWidth: '50rem', padding: '1rem'}} className="center"> 
                        <TableContainer className="score">
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Category</Th>
                                        <Th>Difficulty Level</Th>
                                        <Th>Question Type</Th>
                                        <Th>Score</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>{selectedCategory.categoryName}</Td>
                                        <Td style={{textTransform: 'capitalize'}}>
                                            { selectedCategory.difficulty }
                                        </Td>
                                        <Td style={{textTransform: 'capitalize'}}>
                                            { 
                                                selectedCategory.type === 'multiple' ?  'Multiple choice' :
                                                    selectedCategory.type === 'boolean' ? 'True / False' :  selectedCategory.type
                                            }
                                        </Td>
                                        <Td>{score} / {selectedCategory.noOfQuestions}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <CircularProgress size='150px' value={percentage} color='green.400' className="circle">
                            <CircularProgressLabel>{percentage}%</CircularProgressLabel>
                        </CircularProgress>

                        <Link to='/quiz/categories'>
                            <Button rightIcon={<ArrowForwardIcon />} colorScheme='blackAlpha'
                                variant='outline' >Explore more categories</Button>
                        </Link>
                    </Card>
                </Center>
                <Card className="correct-ans">
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>No</Th>
                                    <Th>Question</Th>
                                    <Th>Correct Answer</Th>
                                    <Th>Your answer</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    questions.map((q, idx) => {
                                        const userAnswer = unescapeHTML(getUserAnswer(q.options));
                                        const correctAnswer = unescapeHTML(getCorrectAnswer(q.options));
                                        return <Tr key={idx}>
                                            <Td>{idx + 1}</Td>
                                            <Td>{ unescapeHTML(q.question) }</Td>
                                            <Td>{ correctAnswer }</Td>
                                            <Td>
                                                { !userAnswer && '-' }
                                                {
                                                    userAnswer &&
                                                    correctAnswer === userAnswer &&
                                                    <>
                                                        <CheckIcon w={3} h={3} color="green"/> 
                                                        <span style={{marginLeft: '1rem'}}> { userAnswer} </span>
                                                    </>
                                                }
                                                {
                                                    userAnswer &&
                                                    correctAnswer !== userAnswer &&
                                                    <>
                                                        <CloseIcon w={3} h={3} color="red.500"/> 
                                                        <span style={{marginLeft: '1rem'}}> { userAnswer} </span>
                                                    </>
                                                    
                                                }
                                            </Td>
                                        </Tr>
                                    })
                                }
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </div>
        </>
    )
};

export default QuizResult;

