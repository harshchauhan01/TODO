import { useEffect, useRef, useState } from "react";


const LiveClock=()=>{
    
    const [time, setTime] = useState(new Date());
    
    useEffect(()=>{
        const interval = setInterval(()=>{
            setTime(new Date());
        },1000);
        return ()=>clearInterval(interval);
    },[]);
    return(
        <div className="text-center">
            <h2 className="text-3xl font-bold">
                {time.toLocaleTimeString()}
            </h2>
        </div>
    );
};

const StopWatch=()=>{
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef(null);

    const start = () =>{
        if(intervalRef.current) return;
        intervalRef.current = setInterval(()=>{
            setSeconds(prev=>prev+1);
        },1000);

    };

    const stop = () =>{
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    const reset = () =>{
        stop();
        setSeconds(0);
    }

    const formatTime = () =>{
        const mins = Math.floor(seconds/60);
        const secs = seconds%60;
        return `${mins}:${secs<10 ? "0":""}${secs}`;
    };

    return(
        <div className="text-center mt-10">
            <h2 className="text-3xl font-bold">{formatTime()}</h2>

            <div className="mt-4 space-x-4">
                <button onClick={start} className="bg-green-500 px-4 py-2 text-white">Start</button>
                <button onClick={stop} className="bg-red-500 px-4 py-2 text-white">Stop</button>
                <button onClick={reset} className="bg-gray-500 px-4 py-2 text-white">Reset</button>
            </div>
        </div>
    );
};

const ClockPage = () =>{
    return(
        <>
            <LiveClock/>
            <StopWatch/>
        </>
    );
};

export default ClockPage;