import { useEffect, useState } from "react";

const Home =()=>{
    const [data,setData]=useState([]);
    useEffect(()=>{
        fetch(`http://127.0.0.1:8000/api/users/`)
        .then(res=>res.json())
        .then(data=>setData(data))
    },[]);
    console.log(data);
    
    return(
        <>
        <div>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d)=>{
                        return(
                            <tr key={d.id}>
                                <td>{d.id}</td>
                                <td>{d.name}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default Home;