import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Link,
    Spacer,
    Stack,
    StackDivider,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import AddQuestionModal from "./AddQuestionModal";


const CategoryDetails = ({
        categoryDetails,
        defaultCategory,
        questions,
        categoryName,
        onToggleCategory,
        onAddQuestion,
        successToast,
        failureToast
    }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ enabled, setEnabled ] = useState(categoryDetails.enabled);

    const addQuestionHandler = () => {
        onAddQuestion();
    }

    const categoryToggleHandler = (event) => {
        const checked = event.target.checked;
        setEnabled(checked);
        onToggleCategory(checked);
    }

    return (
        <div className="wrapper">
            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <HStack gap='7rem'>
                    <Badge ml='1' fontSize='1em' colorScheme={categoryDetails.custom ? 'green' : 'yellow'} variant='solid'>
                        {categoryDetails.custom ? 'Custom category' : 'Default category'}
                    </Badge>
                    <FormControl display='flex' alignItems='center'>
                        <Switch id='email-alerts' size='lg' colorScheme='green'
                            isChecked={enabled} onChange={categoryToggleHandler}/>
                        <FormLabel htmlFor='email-alerts' mb='0' fontSize='1.1rem' ml='5'>
                            Show category to user
                        </FormLabel>
                    </FormControl>
                </HStack>
                <Spacer />
                {
                    categoryDetails.custom && 
                    <>
                        <Button leftIcon={<AddIcon />} colorScheme='green' onClick={onOpen}>Add question</Button>
                        <AddQuestionModal isOpen={isOpen} onClose={onClose} onAdd={addQuestionHandler} 
                            categoryId={+categoryDetails.categoryId} categoryName={categoryName} 
                            successToast={successToast} failureToast={failureToast}/>
                    </>
                }
            </Flex>
            { 
                !categoryDetails.custom && <>
                    <Card mt={10} size='md'>
                        <CardHeader className="f-center">
                            <Heading size='md' className="fw-300">Category details</Heading>
                        </CardHeader>
                        <CardBody className='f-center'>
                            <TableContainer w='80rem'>
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Category ID</Th>
                                            <Th>Category Name</Th>
                                            <Th>Easy Questions</Th>
                                            <Th>Medium Questions</Th>
                                            <Th>Hard Questions</Th>
                                            <Th>Total Questions available</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>{defaultCategory.categoryId}</Td>
                                            <Td>{categoryName}</Td>
                                            <Td>{defaultCategory.questionCount.easy}</Td>
                                            <Td>{defaultCategory.questionCount.medium}</Td>
                                            <Td>{defaultCategory.questionCount.hard}</Td>
                                            <Td>{defaultCategory.questionCount.total}</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                        <Divider />
                        <CardFooter className="f-center">
                            <Text>
                                This is a default category, hence adding questions via CapStoneQz! is not supported. Please visit 
                                <Link href='https://opentdb.com/' isExternal ml={2} color='blue.500'>
                                    Open Trivia Database<ExternalLinkIcon ml='5px' mb='3px' />
                                </Link>
                            </Text>
                        </CardFooter>
                    </Card>
                </>
            }
            {
                categoryDetails.custom && questions.length > 0 && <>
                    <Card mt={10}>
                        <CardHeader>
                            <Heading size='md'>Questions</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                {
                                    questions.map((q, qidx) => (
                                        <Box key={q.questionId}>
                                            <Text fontSize='md'>
                                                {qidx + 1}. { q.question }
                                            </Text>
                                            <Stack gap='10rem' direction='row'>
                                                {
                                                    q.options.map((opt, oidx) => (
                                                        <Text key={opt.optionId} pt='2' fontSize='sm' 
                                                            fontWeight={ opt.correct ? 'bold' : 'normal' }
                                                            color={ opt.correct ? 'green' : 'initial' }>
                                                            {oidx + 1}. { opt.option }
                                                        </Text>
                                                    ))
                                                }
                                            </Stack>
                                            
                                        </Box>
                                    ))
                                }
                            </Stack>
                        </CardBody>
                    </Card>
                </>
            }
            {
                categoryDetails.custom && questions.length === 0 && 
                <Text fontSize='lg' align='center' mt='5rem'>No questions in this category yet!</Text>
            }
            
        </div>
    );
};

export default CategoryDetails;

