import { useState, useEffect, useRef } from "react";
import "../css/timer.css";

interface TimerProps {
    duration: number;
    storageKey: string;
}

function Timer({ duration, storageKey }: TimerProps) {
    const [time, setTime] = useState(() => {
        const savedTime = localStorage.getItem(storageKey);
        return savedTime ? parseInt(savedTime, 10) : duration;
    });
    const [running, setRunning] = useState(false);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (running) {
            if (startTimeRef.current === null) {
                startTimeRef.current = Date.now();
            }
            interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
                const newTime = Math.max(0, time - elapsed);
                setTime(newTime);
                localStorage.setItem(storageKey, newTime.toString());
            }, 1000);
        }
        return () => {
            clearInterval(interval);
            startTimeRef.current = null;
        };
    }, [running, time, storageKey]);

    const startTimer = () => {
        if (!running) {
            setRunning(true);
        }
    };

    const togglePauseResume = () => {
        setRunning((prevRunning) => !prevRunning);
    };

    const resetTimer = () => {
        setRunning(false);
        setTime(duration);
        localStorage.removeItem(storageKey);
        startTimeRef.current = null;
    };

    return (
        <div className="timer-container">
            <h2 className="timer-display">{`${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`}</h2>
            <div className="button-group">
                <button
                    onClick={startTimer}
                    className={`timer-button ${running ? "disabled" : ""}`}
                    disabled={running}
                >
                    {running ? "Running" : "Start"}
                </button>
                <button
                    onClick={togglePauseResume}
                    className={`timer-button ${time === duration ? "disabled" : ""}`}
                    disabled={time === duration}
                >
                    {running ? "Pause" : "Resume"}
                </button>
                <button
                    onClick={resetTimer}
                    className={`timer-button ${!running && time === duration ? "disabled" : ""}`}
                    disabled={!running && time === duration}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

export default Timer;

