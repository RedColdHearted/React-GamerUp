import axios from 'axios';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    LOGOUT
} from './types';
import store from '../reducers/index'

export const load_user = () => async ()=> {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    
            store.dispatch({
                type: USER_LOADED_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            store.dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        store.dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

export const googleAuthenticate = (state, code) => async () => {
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?${formBody}`, config);

            store.dispatch({
                type: GOOGLE_AUTH_SUCCESS,
                payload: res.data
            });

            store.dispatch(load_user());
        } catch (err) {
            store.dispatch({
                type: GOOGLE_AUTH_FAIL
            });
        }
    }
};

export const facebookAuthenticate = (state, code) => async () => {
    if (state && code && !localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const details = {
            'state': state,
            'code': code
        };

        const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?${formBody}`, config);

            store.dispatch({
                type: FACEBOOK_AUTH_SUCCESS,
                payload: res.data
            });

            store.dispatch(load_user());
        } catch (err) {
            store.dispatch({
                type: FACEBOOK_AUTH_FAIL
            });
        }
    }
};

export const checkAuthenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }; 

        const body = JSON.stringify({ token: localStorage.getItem('access') });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config)

            if (res.data.code !== 'token_not_valid') {
                store.dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                store.dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch (err) {
            store.dispatch({
                type: AUTHENTICATED_FAIL
            });
        }

    } else {
        store.dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        store.dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        store.dispatch(load_user());
    } catch (err) {
        store.dispatch({
            type: LOGIN_FAIL
        })
    }
};

export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ first_name, last_name, email, password, re_password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);

        store.dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        store.dispatch({
            type: SIGNUP_FAIL
        })
    }
};

export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);

        store.dispatch({
            type: ACTIVATION_SUCCESS,
        });
    } catch (err) {
        store.dispatch({
            type: ACTIVATION_FAIL
        })
    }
};

export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

        store.dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch (err) {
        store.dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);

        store.dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        store.dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
};

export const logout = () => dispatch => {
    store.dispatch({
        type: LOGOUT
    });
};
