import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from "@/hook/SocketHook";
import { useSession } from "@/hook/AuthHook";
import { useRouter } from "next/navigation";
import axios from "axios";
import { match } from "assert";
import './Timer.css';

const Timer = ({ timercolor }) => {
    const [time, setTime] = useState({
        minutes: 10,
        seconds: 0
    });
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const [isYourTurn, setIsYourTurn] = useState(false);
    // socket
    const matchData = useSocket((state) => state.matchData);
	const socket = useSocket((state) => state.socket);
	const user = useSession((state) => state.user);
    // socket
    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
            setTime({minutes: matchData.user1.min, seconds: 0});
        };
    }, []);

    const myColor = () => {
		if (matchData?.user1?.user?.id == user?.id) {
			return matchData?.user1?.color;
		}
		return matchData?.user2?.color;
	};
	const color = myColor();

    useEffect(() => {    
		if (color === "red") setIsYourTurn(true);
	},[]);

    const startTimer = () => {
        if (!isRunning && isYourTurn) {
            setIsRunning(true);
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
        }
    };

    const pauseTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const timesUp = () => {
        if(time.minutes === 0 && time.seconds === 0){
            pauseTimer();
            return color;
        }
    };

    return (
        <div className={`timer ${timercolor}`}>
            <div>
                {`${time.minutes < 10 ? '0' : ''}${time.minutes}:${time.seconds < 10 ? '0' : ''}${time.seconds}`}
            </div>
        </div>
    );
};

export default Timer;
