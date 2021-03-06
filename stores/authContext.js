import { createContext, useEffect, useState } from "react";
import LoginForm from "../components/LITTLE_TANK_COMPONENTS/LOGIN/loginForm";
import Admin from "../layouts/Admin"
import Normal from "../layouts/Normal"


const AuthContext = createContext({
    user: null,

    authReady: false
})

export const AuthContextProvider = ({ children }) => {
    console.log("children: ", children)
    console.log("children.type.name: ", children.type.name)
    console.log("children.type.length: ", children.type.length)
    
    const [user_id, setUser_id] = useState(null)

    const [auth, setAuth] = useState(false)

    const [status, setStatus] = useState(null)

    const [loading, setLoading] = useState(true)

    const context = { user_id, setUser_id, auth, setAuth, status, setStatus, setLoading }
    
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000);
        
        console.log(sessionStorage.getItem('auth'))
        if (sessionStorage.getItem('auth') === 'true') {
            console.log('should work')

            setAuth(true);
            setUser_id(sessionStorage.getItem('user_id'))
            setStatus(sessionStorage.getItem('status'))

            sessionStorage.setItem('auth', true);
            sessionStorage.setItem('user_id', sessionStorage.getItem('user_id'));
            sessionStorage.setItem('status', sessionStorage.getItem('status'));
        }
    }, []);
    
    const Layout = status === "admin" ? Admin : Normal

    console.log('result: ', (children.type.name === "" && children.type.length === 0 ))

    return (
        <AuthContext.Provider value={context}>
           {auth ?
           (children.type.name === "" && children.type.length === 0 ) ? children : <Layout>{children}</Layout>  
           
            : loading ? <h1>Loading</h1> : 
            <div>
                <h2 style={{alignContent: 'center', justifyContent: 'center', display: 'flex', fontWeight: 'bold'}}>Little-Tank Coupon Management</h2>
                <LoginForm />
            </div>}  

        </AuthContext.Provider>
    )
}

export default AuthContext