import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({ top, bot }) => {
    const [time, setTime] = useState({
        minutes: 1,
        seconds: 0
    });
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

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
        <div className="timer" style={{ top: `${top}px`, bottom: `${bot}px`, right: '20px' }}>
            <div>
                {`${time.minutes < 10 ? '0' : ''}${time.minutes}:${time.seconds < 10 ? '0' : ''}${time.seconds}`}
            </div>
            <div>
                {!isRunning && (
                    <button onClick={startTimer}>Start</button>
                )}
                {isRunning && (
                    <button onClick={pauseTimer}>Pause</button>
                )}
                <button onClick={stopTimer}>Stop</button>
            </div>
        </div>
    );
};

export default Timer;
