import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as constants from '../constants/index';
import './Login.css';
import { withRouter } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const Login = (props) => {
    const { setIsUserAuthenticated, history } = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const isSubmitButtonDisabled = () => {
        if (username.length <= 0 || password.length <= 0) {
            return true;
        } else {
            return false;
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setTimeout(() => {
            if (
                username === constants.fakeLoginCredentials.username &&
                password === constants.fakeLoginCredentials.password
            ) {
                setIsUserAuthenticated(true);
                setLoading(false);
                history.push(constants.routes.home);
            } else {
                setLoading(false);
                setError(true);
            }
        }, 1000);
    };

    return (
        <div className='container'>
            <Form className='form' onSubmit={(e) => handleSubmit(e)}>
                <Form.Group size='lg' controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group size='lg' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button
                    className='button'
                    size='lg'
                    type='submit'
                    disabled={isSubmitButtonDisabled()}
                >
                    {loading && (
                        <>
                            <Spinner
                                as='span'
                                animation='border'
                                size='sm'
                                role='status'
                                aria-hidden='true'
                            />{' '}
                            Authorizing...
                        </>
                    )}
                    {!loading && <>Login</>}
                </Button>
                {error && <div>Incorrect credentials. Please try again...</div>}
            </Form>
        </div>
    );
};
export default withRouter(Login);
