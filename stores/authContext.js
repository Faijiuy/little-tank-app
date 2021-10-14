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
    
    console.log("children: ", children.type)

    // let test = children.type.toString().replace(/\/\*[\s\S]*?\*\//g, '')
    //             .replace(/\/\/(.)*/g, '')        
    //             .replace(/{[\s\S]*}/, '')
    //             .replace(/=>/g, '')
    //             .trim();

    // console.log("test: ", test)

    // var start = test.indexOf("(") + 1;
 
    // // End parameter names is just before last ')'
    // var end = test.length - 1;
 
    // var result = test.substring(start, end).split(", ");
 
    // var params = [];
 
    // result.forEach(element => {
         
    //     // Removing any default value
    //     element = element.replace(/=[\s\S]*/g, '').trim();
 
    //     if(element.length > 0)
    //         params.push(element);
    // });

    // console.log("params: ", params)


    const [user_id, setUser_id] = useState(null)

    const [auth, setAuth] = useState(false)

    const [status, setStatus] = useState(null)

    const [loading, setLoading] = useState(true)

    const context = { user_id, setUser_id, auth, setAuth, status, setStatus, setLoading }

    useEffect(() => {
        

        if (sessionStorage.getItem('auth')) {
           setAuth(sessionStorage.getItem('auth'));
           setUser_id(sessionStorage.getItem('user_id'))
           setStatus(sessionStorage.getItem('status'))
           }
        }, []);
    
     useEffect(() => {
        // setLoading(true)

        setTimeout(() => {
            setLoading(false)
        }, 1000);


        sessionStorage.setItem('auth', auth);
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('status', status);
        
     }, [auth]);

    // sessionStorage.getItem('auth')
    
    const Layout = status === "admin" ? Admin : Normal

    return (
        <AuthContext.Provider value={context}>
           {auth ?
           (children.type.name !== "" ) ? 
            <Layout>
                {children} 
            </Layout>  
            : 
            children
           
           : loading ? <h1>Loading</h1> : <LoginForm />}  
           {/* {children}   */}
                      {/* {user2 ? (children) : <SignInOutContainer />}   */}


        </AuthContext.Provider>
    )
}

export default AuthContext