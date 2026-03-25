import { createContext,useState } from "react";
import {LoginUser, RegisterUser, LogoutUser} from "../api/auth";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [isAuthenticated, setisAuthenticated]=useState(!!localStorage.getItem("access"));
    const login = async (form)=>{
        await LoginUser(form.username, form.password);
        setisAuthenticated(true);
    };
    const register = async (form) =>{
        await RegisterUser(form);
        await LoginUser(form.username, form.password);
        setisAuthenticated(true);
    }

    const logout=()=>{
        LogoutUser();
        setisAuthenticated(false);
    };
    return(
        <AuthContext.Provider value={{isAuthenticated,login, register,logout}}>
            {children}
        </AuthContext.Provider>
    );
};