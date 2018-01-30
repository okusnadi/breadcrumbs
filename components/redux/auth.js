import axios from 'axios';

import { create as createUser } from './users';

/* -----------------    ACTION TYPES    ------------------ */

const SET_CURRENT_USER = 'SET_CURRENT_USER';
const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

/* ------------     ACTION CREATORS      ------------------ */

const setCurrentUser = user => ({ type: SET_CURRENT_USER, user });
const removeCurrentUser = () => ({ type: REMOVE_CURRENT_USER });

/* ------------          REDUCER         ------------------ */

export default function reducer (currentUser = {}, action) {
  switch (action.type) {

    case SET_CURRENT_USER:
      return action.user;

    case REMOVE_CURRENT_USER:
      return {};

    default:
      return currentUser;
  }
}

/* ------------       THUNK CREATORS     ------------------ */

export const login = (credentials, navigation) => dispatch => {
  axios.put('http://localhost:1337/auth/login', credentials)
    .then(res => setUserAndRedirect(res.data, navigation, dispatch))
    .catch(() => navigation.navigate('SignedOut', {error: 'Unsuccessful!'}));
};

export const logout = navigation => dispatch => {
  axios.delete('http://localhost:1337/auth/logout')
    .then(res => dispatch(removeCurrentUser(res.data)))
    .then(() => navigation.navigate('SignedOut', {error: 'Come back soon!'}))
    .catch(err => console.error('Logging out was unsuccesful', err));
};

export const signup = (credentials, navigation) => dispatch => {
  axios.post('http://localhost:1337/auth/signup', credentials)
    .then(res => {
      setUserAndRedirect(res.data, navigation, dispatch);
      dispatch(createUser(res.data));
    })
    .catch(() => navigation.navigate('SignedOut', {error: 'Unsuccesful!'}));
};

export const fetchCurrentUser = () => dispatch => {
  axios.get('http://localhost:1337/auth/me')
    .then(res => dispatch(setCurrentUser(res.data)))
    .catch(err => console.error('Fetching current user failed', err));
};

/* ------------      HELPER FUNCTIONS     ------------------ */

function setUserAndRedirect (user, navigation, dispatch) {
  dispatch(setCurrentUser(user));
  navigation.navigate('SignedIn');
}
