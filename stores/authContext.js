import { createContext, useEffect, useState } from "react";
import SignInOutContainer from "../containers/index";
import ReactSession from 'react-client-session';



const AuthContext = createContext({
    user: null,

    authReady: false
})

export const AuthContextProvider = ({ children }) => {

    const [user2, setUser2] = useState(null)

    const [auth, setAuth] = useState(false)

    const [status, setStatus] = useState(null)

    const context = { user2, setUser2, auth, setAuth, status, setStatus }

    useEffect(() => {
        if (sessionStorage.getItem('auth')) {
           setAuth(sessionStorage.getItem('auth'));
           setUser2(sessionStorage.getItem('user2'))
           setStatus(sessionStorage.getItem('status'))
           }
        }, []);
    
     useEffect(() => {
        sessionStorage.setItem('auth', auth);
        sessionStorage.setItem('user2', user2);
        sessionStorage.setItem('status', status);
        
     }, [auth]);

    // sessionStorage.getItem('auth')


    return (
        <AuthContext.Provider value={context}>
           {auth ? (children) : <SignInOutContainer />}  
           {/* {children}   */}
                      {/* {user2 ? (children) : <SignInOutContainer />}   */}


        </AuthContext.Provider>
    )
}

export default AuthContext