import { createContext, useEffect, useState } from "react";
import SignInOutContainer from "../containers/index";
import LoginForm from "../components/loginForm";
import Admin from "../layouts/Admin"
import Normal from "../layouts/Normal"




const AuthContext = createContext({
    user: null,

    authReady: false
})

export const AuthContextProvider = ({ children }) => {

    console.log("children: ", children.type.name)

    const [user_id, setUser_id] = useState(null)

    const [auth, setAuth] = useState(false)

    const [status, setStatus] = useState(null)

    const context = { user_id, setUser_id, auth, setAuth, status, setStatus }

    useEffect(() => {
        if (sessionStorage.getItem('auth')) {
           setAuth(sessionStorage.getItem('auth'));
           setUser_id(sessionStorage.getItem('user_id'))
           setStatus(sessionStorage.getItem('status'))
           }
        }, []);
    
     useEffect(() => {
        sessionStorage.setItem('auth', auth);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('status', status);
        
     }, [auth]);

    // sessionStorage.getItem('auth')
    
    const Layout = status === "admin" ? Admin : Normal

    return (
        <AuthContext.Provider value={context}>
           {auth ?
           children.type.name !== "PrintPage" ? 
            <Layout>
                {children} 
            </Layout>  : 
            children
           
           : <LoginForm />}  
           {/* {children}   */}
                      {/* {user2 ? (children) : <SignInOutContainer />}   */}


        </AuthContext.Provider>
    )
}

export default AuthContext