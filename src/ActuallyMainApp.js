import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './App';
import Login from "./Login";



const LoginRequiredRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => <Component {...props} />} />
);


class ActuallyMainApp extends Component {
    render() {
        return (
            <Switch>
                <Route path={'/login'} component={Login} />
                <LoginRequiredRoute component={App} />
            </Switch>
        )
    }
}


export default ActuallyMainApp