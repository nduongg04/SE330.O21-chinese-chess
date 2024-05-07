import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ top, left }) => {
    const [time, setTime] = useState({
        minutes: 1,
        seconds: 0
    });

    useEffect(() => {
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const startTimer = () => {
        if (!isRunning) {
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

    const stopTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        setTime({
            minutes: 1,
            seconds: 0
        });
    };

    return (
        <div className="timer" style={{ top: `${top}px`, left: `${left}px` }}>
            {`${time.minutes < 10 ? '0' : ''}${time.minutes}:${time.seconds < 10 ? '0' : ''}${time.seconds}`}
        </div>
    );
};

export default Timer;

