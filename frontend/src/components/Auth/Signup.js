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
    Select,
    Stack,
    Text
} from "@chakra-ui/react";
import { Field, Form, Formik } from 'formik';

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSignup } from "../../store/user-actions";

const Signup = () => {
    const initialValues = { name: '', email: '', password: '', confirmPassword: '', role: 'user' };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateName = (value) => {
        if (!value) {
          return 'Name is required';
        } 
    }

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

    const validateConfirmPassword = (values, value) => {
        if (!value) {
          return 'Confirm password is required';
        } 
        if (values.password && value !== values.password) {
            return 'Passwords do not match!'
        }
    }

    const submitHandler = (values, actions) => {
        setTimeout(() => {
            dispatch(userSignup({
                email: values.email,
                password: values.password,
                role: values.role
            }))
            actions.setSubmitting(false);
            navigate('/');
          }, 1000);
    }

    return (
        <div className="wrapper pad-top--2rem">
            <Center>
                <Card style={{width: '40rem'}}>
                    <CardHeader>
                        <Center>
                            <Heading as='h1' size='2xl' noOfLines={2} className="fw-300">
                                Sign up
                            </Heading>
                        </Center>
                    </CardHeader>

                    <CardBody>
                        <Formik initialValues={initialValues} onSubmit={submitHandler}>
                            {(props) => (
                                <Form>
                                    <Stack spacing='5'>
                                        <Field name='name' validate={validateName}>
                                            {({ field, form }) => (
                                                <FormControl isInvalid={form.errors.email && form.touched.email}>
                                                    <FormLabel>Name</FormLabel>
                                                    <Input type='name' {...field} />
                                                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

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

                                        <Field name='confirmPassword' validate={validateConfirmPassword.bind(null, props.values)}>
                                            {({ field, form }) => (
                                                <FormControl isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}>
                                                    <FormLabel>Confirm password</FormLabel>
                                                    <Input type='password' {...field} />
                                                    <FormErrorMessage>{form.errors.confirmPassword}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name='role'>
                                            {({ field, form }) => (
                                                <FormControl defaultValue={initialValues.role}>
                                                    <FormLabel>
                                                        Role
                                                    </FormLabel>
                                                    <Select {...field} >
                                                        <option value='user'>User</option>
                                                        <option value='admin'>Admin</option>
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </Stack>

                                    <Center mt={10}>
                                        <Button w='7rem' mr={10} colorScheme='gray' type='reset'>
                                            Clear
                                        </Button>
                                        <Button w='7rem' colorScheme='green' isLoading={props.isSubmitting} type='submit'>
                                            Sign up
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
                    Already a member? <Link as={RouterLink} to='/login' color='blue.500'>Log in</Link>
                </Text>
            </Center>
        </div>
    );
};

export default Signup;

