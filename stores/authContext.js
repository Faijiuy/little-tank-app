import { createContext, useState } from "react";
import SignInOutContainer from "../containers/index";


const AuthContext = createContext({
    user: null,

    authReady: false
})

export const AuthContextProvider = ({ children }) => {
    const [user2, setUser2] = useState(null)

    const [auth, setAuth] = useState(false)

    const context = { user2, setUser2, auth, setAuth }

    return (
        <AuthContext.Provider value={context}>
            {auth ? (children) : <SignInOutContainer/>}
        </AuthContext.Provider>
    )
}

export default AuthContext