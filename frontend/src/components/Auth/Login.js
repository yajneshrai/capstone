import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Text
} from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/user-actions";
import { useEffect } from "react";


const Login = () => {
    const initialValues = { email: '', password: '' };

    const [ searchParams ] = useSearchParams();
    const redirectTo = searchParams.get('to');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(state => state.user.isLoggedIn);

    const validateEmail = (value) => {
        if (!value) {
          return 'Email is required';
        } 
    }

    const validatePassword = (value) => {
        if (!value) {
          return 'Password is required';
        } 
    }

    useEffect(() => {
        if (isLoggedIn) {
            if (redirectTo) {
                navigate(`/${redirectTo}`);
            } else {
                navigate('/');
            }
        }
    }, [isLoggedIn, navigate, redirectTo]);

    const submitHandler = (values, actions) => {
        dispatch(userLogin({
            email: values.email,
            password: values.password
        }));
        actions.setSubmitting(false);
    }

    return (
        <div className="wrapper pad-top--2rem">
            <Center>
                <Card style={{width: '40rem'}}>
                    <CardHeader>
                        <Center>
                            <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                                Log in
                            </Heading>
                        </Center>
                    </CardHeader>

                    <CardBody>
                        <Formik initialValues={initialValues} onSubmit={submitHandler}>
                            {(props) => (
                                <Form>
                                    <Stack spacing='5'>
                                        <Field name='email' validate={validateEmail}>
                                            {({ field, form }) => (
                                                <FormControl isInvalid={form.errors.email && form.touched.email}>
                                                    <FormLabel>Email</FormLabel>
                                                    <Input type='email' {...field} />
                                                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name='password' validate={validatePassword}>
                                            {({ field, form }) => (
                                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                                    <FormLabel>Password</FormLabel>
                                                    <Input type='password' {...field} />
                                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                    </Stack>

                                    <Center>
                                        <Button w='7rem' mt={10} colorScheme='green' isLoading={props.isSubmitting} type='submit'>
                                            Log in
                                        </Button>
                                    </Center>
                                    
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Center>
            <Center mt={5}>
                <Text>
                    Not a member? <Link as={RouterLink} to='/signup' color='blue.500'>Sign up</Link>
                </Text>
            </Center>
        </div>
    );
};

export default Login;

