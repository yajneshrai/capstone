import { CheckIcon } from "@chakra-ui/icons";
import {
    Button,
    Divider,
    Flex,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Tooltip
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const ADD_QUESTION = gql`
    mutation AddQuestion(
        $categoryId: Int!,
        $categoryName: String!,
        $question: String!,
        $options: [Option!]!,
        $difficulty: String!,
        $type: String!
    ) {
        addQuestion(
            categoryId: $categoryId,
            categoryName: $categoryName,
            question: $question,
            options: $options,
            difficulty:
            $difficulty,
            type: $type) {
            success
        }
    }
`;

const AddQuestionModal = ({ isOpen, onClose, onAdd, categoryId, categoryName, successToast, failureToast }) => {
    const initialMcqValue = [
        { option: '', correct: false, selected: false }, 
        { option: '', correct: false, selected: false }, 
        { option: '', correct: false, selected: false }, 
        { option: '', correct: false, selected: false }, 
    ];

    const initialTfValue = [
        { option: 'True', correct: false, selected: false }, 
        { option: 'False', correct: false, selected: false }
    ];

    const [ question, setQuestion ] = useState('');
    const [ mcqOptions, setMcqOptions ] = useState(initialMcqValue);
    const [ tfOptions, setTfOptions ] = useState(initialTfValue);

    const [ difficulty, setDifficulty ] = useState('easy');
    const [ type, setType ] = useState('multiple');

    const [ addQuestion ] = useMutation(ADD_QUESTION, {
        variables: {
            categoryId,
            categoryName,
            question,
            options: type === 'multiple' ? mcqOptions : tfOptions,
            type,
            difficulty
        },
        onCompleted: (resp) => {
            if (resp.addQuestion.success) {
                onAdd();
                successToast('Success', 'Question added successfully!');
            } else {
                failureToast('Error', 'Failed to add question.');
            }
        },
        onError: (error) => {
            console.error(error);
            failureToast('Error', 'Failed to add question.');
        }
    });

    const questionChangeHandler = (event) => {
        setQuestion(event.target.value);
    }

    const addQuestionHandler = () => {
        addQuestion();
        closeModal();
    }

    const checkDisabled = () => {
        if (!question) {
            return true;
        }
        let options = type === 'multiple' ? mcqOptions : tfOptions;
        const allOptionsFilled = options.every(opt => opt.option);
        const correctOptionsSelected = options.some(opt => opt.correct);
        return !allOptionsFilled || !correctOptionsSelected;
    }

    const correctOptionSelectHandler = (type, idx) => {
        if (type === 'multiple') {
            setMcqOptions((oldMcqOptions) => { 
                const newMcqOptions = [ ...oldMcqOptions ];
                newMcqOptions.forEach(o => o.correct = false);
                newMcqOptions[idx] = {
                    ...newMcqOptions[idx], correct: true
                }
                return newMcqOptions;
            });
        } else {
            setTfOptions((oldTfOptions) => { 
                const newTfOptions = [ ...oldTfOptions ];
                newTfOptions.forEach(o => o.correct = false);
                newTfOptions[idx] = {
                    ...newTfOptions[idx], correct: true
                }
                return newTfOptions;
            });
        }
    }

    const optionChangeHandler = (type, idx, event) => {
        if (type === 'multiple') {
            setMcqOptions((oldMcqOptions) => {
                const newMcqOptions = [ ...oldMcqOptions ];
                newMcqOptions[idx] = {
                    ...newMcqOptions[idx],
                    option: event.target.value
                }
                return newMcqOptions;
            });
        }
    }

    const typeChangeHandler = (typeValue) => {
        setType(typeValue)
    }

    const difficultyChangeHandler = (difficultyValue) => {
        setDifficulty(difficultyValue)
    }

    const closeModal = () => {
        setQuestion('');
        setMcqOptions(initialMcqValue);
        setTfOptions(initialTfValue);
        setType('multiple');
        setDifficulty('easy');
        onClose();
    }

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size='5xl' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a question</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Flex alignItems='center' justifyContent='space-between' mb='5'>
                        <Stack direction='row'>
                            <FormLabel>Type: </FormLabel>
                            <RadioGroup onChange={typeChangeHandler} value={type}>
                                <Stack direction='row' spacing={4}>
                                    <Radio value='multiple'>Multiple choice</Radio>
                                    <Radio value='boolean'>True / False</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>
                        <Stack direction='row'>
                            <FormLabel>Difficulty: </FormLabel>
                            <RadioGroup onChange={difficultyChangeHandler} value={difficulty}>
                                <Stack direction='row' spacing={4}>
                                    <Radio value='easy'>Easy</Radio>
                                    <Radio value='medium'>Medium</Radio>
                                    <Radio value='hard'>Hard</Radio>
                                </Stack>
                            </RadioGroup>
                        </Stack>
                    </Flex>
                    <InputGroup>
                        <InputLeftAddon children='Question' />
                        <Input placeholder="Enter the question here" value={question} autoFocus onChange={questionChangeHandler} />
                    </InputGroup> 

                    <Stack spacing={4} direction='column' mt={10}>
                        {  type=== 'multiple' && 
                            mcqOptions.map((opt, idx) => (
                                <InputGroup key={idx}>
                                    <InputLeftAddon children={`Option ${idx+1}`}  />
                                    <Input placeholder="Enter an option here"
                                        value={opt.option} onChange={optionChangeHandler.bind(null, type, idx)}/>
                                    
                                    <Tooltip label='Mark as correct answer'>
                                        <InputRightElement>
                                            <IconButton
                                                colorScheme={ opt.correct ? 'green' : 'gray' }
                                                aria-label='Correct answer' onClick={correctOptionSelectHandler.bind(null, type, idx)}
                                                icon={<CheckIcon />}/>
                                        </InputRightElement>
                                    </Tooltip>
                                    
                                </InputGroup>
                            ))
                        }
                        {  type=== 'boolean' &&
                            tfOptions.map((opt, idx) => (
                                <InputGroup key={idx}>
                                    <InputLeftAddon children={`Option ${idx+1}`}  />
                                    <Input value={opt.option} onChange={optionChangeHandler.bind(null, type, idx)} isDisabled/>
                                    
                                    <Tooltip label='Mark as correct answer'>
                                        <InputRightElement>
                                            <IconButton
                                                colorScheme={ opt.correct ? 'green' : 'gray' }
                                                aria-label='Correct answer' onClick={correctOptionSelectHandler.bind(null, type, idx)}
                                                icon={<CheckIcon />}/>
                                        </InputRightElement>
                                    </Tooltip>
                                </InputGroup>
                            ))
                        }

                    </Stack>
                    <Divider />
                    <Flex alignItems='center' justifyContent='center' mt={6} mb={-5}>
                        <Text color='gray.500'>Options will be presented in a randomized order while taking the quiz.</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='green' mr={3} isDisabled={checkDisabled()} 
                        leftIcon={<CheckIcon />} onClick={addQuestionHandler}>
                        Add
                    </Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
            
      </Modal>
    );
}

export default AddQuestionModal;