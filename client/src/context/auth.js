import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

// format for our context object
const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {}
});

const initialState = {
  user: null
};

// checks if a token already exists, and if so, it will assign the user in initialState to the decodedToken
// decodedToken contains our user data
if (localStorage.getItem('authToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('authToken'));
  if (decodedToken.exp * 1000 < Date.now()) { 
    //token expired
    localStorage.removeItem('authToken');
  } else {
    initialState.user = decodedToken;
  }
}

// reducer takes a dispatch which includes action type and payload and updates state accordingly
const authReducer = (state, action) => {
  switch(action.type){
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    default:
      return state;

  }
};


const AuthProvider = (props) => {
  // returns state dispatch
  // pass a reducer and an initial state
  const [state, dispatch] = useReducer(authReducer, initialState);
  // can use dispatch to dispatch an action with a type and a payload to the auth reducer

  // pass data returned from graphQL login mutation which will contain the token
  const login = (userData) => {
    // store the token locally
    localStorage.setItem('authToken', userData.token);
    dispatch({
      // dispatch an login action and attach userData to LOGIN reducer function to add it to the state 
      type: 'LOGIN',
      payload: userData
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({
      type: 'LOGOUT'
    });
  }

  /* render Provider with any props passed from calling component*/
  return (
    <AuthContext.Provider 
      value={{user: state.user, login, logout }}
      { ...props } 
    />
  );
}

// entire application must be wrapped in AuthProvider to be able to use this context across components
export { AuthContext, AuthProvider };