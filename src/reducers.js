import { combineReducers } from 'redux';
import { CHANGE_LOGGED_IN } from './actions';


const loggedInReducer = (state = null, action) => {
    switch (action.type) {
        case CHANGE_LOGGED_IN:
            if (!action.newValue)
                localStorage.removeItem('o2o_access_token');

            return action.newValue;
        default: return state;
    }
};

const reducers = combineReducers({
    loggedIn: loggedInReducer,
});


export default reducers;