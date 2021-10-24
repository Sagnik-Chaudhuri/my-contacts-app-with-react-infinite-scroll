import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import * as constants from './constants/index';
import { Home, Login } from './containers/index';

const Routes = (props) => {
    // using an authenticated state of Routes for now, instead of a global store
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    return (
        <Switch>
            <Route exact path={constants.routes.defaultPath}>
                <Redirect to={constants.routes.login} />
            </Route>
            <Route path={constants.routes.login}>
                <Login setIsUserAuthenticated={setIsUserAuthenticated} />
            </Route>
            <Route path={constants.routes.home}>
                <Home
                    isUserAuthenticated={isUserAuthenticated}
                    setIsUserAuthenticated={setIsUserAuthenticated}
                />
            </Route>
        </Switch>
    );
};

export default Routes;
