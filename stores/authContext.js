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

   

    // sessionStorage.getItem('auth')


    return (
        <AuthContext.Provider value={context}>
           {children}  
        </AuthContext.Provider>
    )
}

export default AuthContext