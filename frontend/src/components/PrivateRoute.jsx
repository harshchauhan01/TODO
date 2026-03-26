import {Navigate} from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute=({children})=>{
    const token=localStorage.getItem("access");
    if(!token){
        toast.error("Please Log in first");
    }
    return token?children:<Navigate to="/"/>
};
export default PrivateRoute;