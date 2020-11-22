import axios from 'axios';
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";


function setAxiosToken (token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials) {

    return axios.post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token)
            setAxiosToken(token);
            return true
        });
}

function register (user) {

    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password
    }

    return axios
        .post(LOGIN_API, data)
        .then(response => response.data)
}

function setup() {
    const token = window.localStorage.getItem("authToken")

    if (token) {
        const jwtData = jwtDecode(token);
        const expiration = jwtData.exp * 1000
        if (expiration > new Date().getTime()) {
            setAxiosToken(token)
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken")

    if (token) {
        const jwtData = jwtDecode(token);
        const expiration = jwtData.exp * 1000
        if (expiration > new Date().getTime()) {
            return true
        }
    }
    return false
}

function connectedUser() {
    const token = window.localStorage.getItem("authToken")
    if (token) {
        const jwtData = jwtDecode(token)
        return jwtData
    }
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated,
    register,
    connectedUser
};
