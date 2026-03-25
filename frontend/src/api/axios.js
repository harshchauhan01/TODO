import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api=axios.create({
    baseURL:BASE_URL,
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response)=>response,
    async (error)=>{
        const originalRequest = error.config;

        const isUnauthorized = error.response?.status===401;
        const hasRefreshToken = !!localStorage.getItem("refresh");
        const isRefreshCall = originalRequest?.url?.includes("/api/token/refresh/");

        if(isUnauthorized && !originalRequest?._retry && hasRefreshToken && !isRefreshCall){
            originalRequest._retry=true;
            try{
                const refresh=localStorage.getItem('refresh');
                const res=await axios.post(
                    `${BASE_URL}/api/token/refresh/`,
                    {refresh}
                );
                localStorage.setItem("access",res.data.access);
                originalRequest.headers.Authorization=`Bearer ${res.data.access}`;
                return api(originalRequest);
            }catch(err){
                console.log("Refresh Failed");
                localStorage.clear();
                window.location.href="/";
            }
        }
        return Promise.reject(error);
    }
);
export default api;