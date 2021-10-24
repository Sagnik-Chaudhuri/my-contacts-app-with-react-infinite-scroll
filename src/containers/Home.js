import React, { useEffect, useRef, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import User from '../components/User';
import * as constants from '../constants/index';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import './Home.css';

const Home = (props) => {
    const { isUserAuthenticated, setIsUserAuthenticated } = props;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pageNumber, setPageNumber] = useState(constants.initialPageForRandomUsersURL);
    const [users, setUsers] = useState([]);
    const [lastElement, setLastElement] = useState(null);
    const [logoutButtonLoading, setLogoutButtonLoading] = useState(false);

    const history = useHistory();

    const observer = useRef(
        new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                setPageNumber((pageNumber) => pageNumber + 1);
            }
        }),
    );

    useEffect(() => {
        if (pageNumber <= constants.maxPageForRandomUsersURL && isUserAuthenticated) {
            setLoading(true);
            axios.get(
                `${constants.randomUsersURL}?page=${pageNumber}&results=${constants.maxNumberOfUsersToFetchPerPage}`
            ).then((resp) => {
                setUsers([...new Set([...users, ...resp.data.results])]);
                setLoading(false);
                setError(false);
            }, (err) => {
                console.log('err: ', err)
                setError(true);
            });
        }
    }, [pageNumber]);

    useEffect(() => {
        const currentElement = lastElement;
        const currentObserver = observer.current;
        if (currentElement) {
            currentObserver.observe(currentElement);
        }
        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [lastElement]);

    const handleLogoutButtonClick = () => {
        setLogoutButtonLoading(true);
        setTimeout(() => {
            setIsUserAuthenticated(false);
            history.push(constants.routes.login);
        }, 1000);
    };
    const handleLoginButtonClick = () => {
        history.push(constants.routes.login);
    };

    if (!isUserAuthenticated) {
        return (
            <div className='loginButtonContainer'>
                <Button onClick={() => handleLoginButtonClick()}>
                    Please login to view your contacts
                </Button>
            </div>
        );
    }

    if (error) {
        return <div className='fullScreenError'>Error in fetching your contacts...</div>;
    }

    return (
        <div className='container'>
            <h1 className='text-center'>My Contacts</h1>
            <div>
                {users.length > 0 &&
                    users.map((user, index) => {
                        return index === users.length - 1 &&
                            !loading &&
                            pageNumber <= constants.maxPageForRandomUsersURL ? (
                            <div key={user.login.uuid} ref={setLastElement}>
                                <User data={user} />
                            </div>
                        ) : (
                            <User data={user} key={user.login.uuid} />
                        );
                    })}
            </div>
            {pageNumber !== constants.initialPageForRandomUsersURL && (
                <div className='buttonContainer'>
                    <Button onClick={() => handleLogoutButtonClick()}>
                        {logoutButtonLoading && (
                            <>
                                <Spinner
                                    as='span'
                                    animation='border'
                                    size='sm'
                                    role='status'
                                    aria-hidden='true'
                                />{' '}
                                Please wait...
                            </>
                        )}
                        {!logoutButtonLoading && <>Logout</>}
                    </Button>
                </div>
            )}
            <div className='spinnerClass'>
                {loading && <Spinner animation='border' variant='primary' role='status' />}
            </div>
            {pageNumber - 1 === constants.maxPageForRandomUsersURL && (
                <p className='endOfContacts'>End of contacts</p>
            )}
        </div>
    );
};
export default withRouter(Home);
