import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { useSocket } from "@/hook/SocketHook";
import { useSession } from "@/hook/AuthHook";
import { useRouter } from "next/navigation";
import axios from "axios";
import { match } from "assert";
import './Timer.css';

const Timer = React.forwardRef(( props, ref) => {
    const {timercolor, currentUser, setLoser} = props
    const [time, setTime] = useState({
        minutes: 10,
        seconds: 0
    });
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    // socket
    const matchData = useSocket((state) => state.matchData);
	const socket = useSocket((state) => state.socket);
	const user = useSession((state) => state.user);
    // socket
    useEffect(() => {
        console.log(currentUser)
        console.log(timercolor)
        return () => {
            clearInterval(intervalRef.current);
            setTime({minutes: matchData?.user1?.min, seconds: 0});
        };
    }, []);

   

    const startTimer = () => {
            setIsRunning(true);
            console.log("Helu")
            intervalRef.current = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime.minutes === 0 && prevTime.seconds === 0) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        return prevTime;
                    }
                    if (prevTime.seconds === 0) {
                        return {
                            minutes: prevTime.minutes - 1,
                            seconds: 59
                        };
                    } else {
                        return {
                            minutes: prevTime.minutes,
                            seconds: prevTime.seconds - 1
                        };
                    }
                });
            }, 1000);
    };

    

    const pauseTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const timesUp = () => {
        if(time.minutes === 0 && time.seconds === 0){
            return true;
        }
        return false
    };

    useEffect(()=>{
        if(timercolor==currentUser && timesUp()){
            setLoser(true)
        }
    },[time])

    useImperativeHandle(ref,()=>({
        startTimer,
        pauseTimer,
        timesUp
    }))

    return (
        <div className={`timer ${timercolor}`}>
            <div>
                {`${time.minutes < 10 ? '0' : ''}${time.minutes}:${time.seconds < 10 ? '0' : ''}${time.seconds}`}
            </div>
        </div>
    );
});

export default Timer;
