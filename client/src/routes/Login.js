import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks';

function Login(props) {
    const context = useContext(AuthContext); //get context access
    const [errors, setErrors] = useState('');
    
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: '',
    });

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, {data: {login: userData}}){
            //console.log(result.data.login)
            context.login(userData)
            props.history.push('/'); // after submit, redirect to home page
        }, // triggered on function execute
        onError(err){ // set front end errors to back end errors
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    });

    function loginUserCallback(){
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input 
                    label="Username"
                    placeholder="Username.."
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input 
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form> 
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// write graphql mutation 
const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`;

export default Login;
