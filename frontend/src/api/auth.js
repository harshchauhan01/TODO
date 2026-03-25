import axios from 'axios';
import api from './axios';

export const LoginUser=async (username, password)=>{
    const res = await api.post("/api/token/",{
        username,
        password,
    });
    const {access, refresh} = res.data;
    localStorage.setItem("access",access);
    localStorage.setItem("refresh",refresh);
    return res.data;
};

export const RegisterUser = async (data) =>{
    await api.post("/api/register/",data);
};

export const LogoutUser=()=>{
    localStorage.clear();
};