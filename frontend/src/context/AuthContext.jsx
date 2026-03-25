import { createContext,useState } from "react";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [isAuthenticated, setisAuthenticated]=useState(!!localStorage.getItem("access"));
    const login=()=>setisAuthenticated(true);
    const logout=()=>{
        localStorage.clear();
        setisAuthenticated(false);
    };
    return(
        <AuthContext.Provider value={{isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};