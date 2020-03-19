import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeLoggedIn } from './actions';
import axios from "axios";
import functions from "./functions";


class Login extends Component {
    handleLogin = () => {
        axios.get(`${functions.getHref()}auth/vk`, functions.getAxiosHeaders())
            .then(() => {})
            .catch(error => {
                if (error.response && error.response.status === 403)
                    alert('Доступ запрещён');
                else
                    alert('Произошла ошибка');
            });
    };

    render() {
        return (
            <div className="auth">
                <div className="auth-block">
                    <button className="btn-primary" onClick={() => this.handleLogin()}>Войти через Vk</button>
                </div>
            </div>
        )
    }
}


export default connect(
    state => ({
        loggedIn: state.loggedIn
    }),
    changeLoggedIn
)(Login);
