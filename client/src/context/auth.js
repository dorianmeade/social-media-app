import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

if (localStorage.getItem('jwtToken')){
    // decode token to compute expiration
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

    if (decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken');
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

//* need to create reducer -> recieve action with type and payload, determines what to do
    //! get familiar with redux patterns
function authReducer(state, action){
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
}

function AuthProvider(props){
    const[state, dispatch] = useReducer(authReducer, initialState);
    // *dispatch any action and attach to it a type and a payload 

    //*on login, trigger function to dispatch login type, data -> set context
    function login(userData){
        localStorage.setItem('jwtToken', userData.token)
        dispatch({
            type: 'LOGIN', 
            payload: userData
        })
    }
    
    function logout(){
        localStorage.removeItem('jwtToken')
        dispatch({ type: 'LOGOUT' })
    }

    return(
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider }