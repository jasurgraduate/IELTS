import { useState, useEffect, useRef } from "react";
import "../css/timer.css";

interface TimerProps {
    duration: number;
}

function Timer({ duration }: TimerProps) {
    const [time, setTime] = useState(duration);
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
                setTime(Math.max(0, duration - elapsed));
            }, 1000);
        }
        return () => {
            clearInterval(interval);
            startTimeRef.current = null;
        };
    }, [running, duration]);

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

