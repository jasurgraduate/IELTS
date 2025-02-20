import { useState, useEffect, useRef } from "react";
import Timer from "../add/tools/Timer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faBookOpen, faCheckCircle, faBrush, faTimes } from '@fortawesome/free-solid-svg-icons';
import "../add/css/answer-sheet.css";
import { handleConfettiClick } from "../add/tools/Confetti";

function ListeningReading() {
    const [activeTab, setActiveTab] = useState("listening");
    const [listeningAnswers, setListeningAnswers] = useState(Array(40).fill(""));
    const [readingAnswers, setReadingAnswers] = useState(Array(40).fill(""));
    const [submitText, setSubmitText] = useState("Submit");
    const [clearText, setClearText] = useState("Clear");
    const firstInputRef = useRef<HTMLInputElement>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const savedListeningAnswers = localStorage.getItem("listeningAnswers");
        const savedReadingAnswers = localStorage.getItem("readingAnswers");
        if (savedListeningAnswers) setListeningAnswers(JSON.parse(savedListeningAnswers));
        if (savedReadingAnswers) setReadingAnswers(JSON.parse(savedReadingAnswers));
    }, []);

    useEffect(() => {
        localStorage.setItem("listeningAnswers", JSON.stringify(listeningAnswers));
    }, [listeningAnswers]);

    useEffect(() => {
        localStorage.setItem("readingAnswers", JSON.stringify(readingAnswers));
    }, [readingAnswers]);

    useEffect(() => {
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, []);

    const handleInputChange = (index: number, value: string) => {
        if (activeTab === "listening") {
            const newAnswers = [...listeningAnswers];
            newAnswers[index] = value;
            setListeningAnswers(newAnswers);
        } else {
            const newAnswers = [...readingAnswers];
            newAnswers[index] = value;
            setReadingAnswers(newAnswers);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (e.shiftKey) {
                const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
                if (prevInput) {
                    prevInput.focus();
                    prevInput.select();
                }
            } else {
                const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        }
    };

    const handleClear = () => {
        if (activeTab === "listening") {
            setListeningAnswers(Array(40).fill(""));
        } else {
            setReadingAnswers(Array(40).fill(""));
        }
        document.querySelectorAll(".checkbox-container input[type='checkbox']").forEach((checkbox) => {
            (checkbox as HTMLInputElement).checked = false;
        });
        setClearText("Cleared!");
        setTimeout(() => setClearText("Clear"), 3000);
    };

    const calculateBandScore = (answers: string[], correctAnswers: string[]) => {
        const score = answers.filter((answer, index) => {
            const checkbox = document.querySelector(`input[data-index="${index}"] + .checkbox-container input[type='checkbox']`) as HTMLInputElement;
            const isFalseChecked = checkbox && checkbox.checked;
            return (answer === correctAnswers[index] && !isFalseChecked) || (isFalseChecked && correctAnswers[index] === "False");
        }).length;
        if (activeTab === "listening") {
            if (score >= 39) return { score, band: 9.0, message: "Excellent! Keep up the great work!" };
            if (score >= 37) return { score, band: 8.5, message: "Great job! You're almost there!" };
            if (score >= 35) return { score, band: 8.0, message: "Very good! Keep pushing forward!" };
            if (score >= 32) return { score, band: 7.5, message: "Good effort! You're doing well!" };
            if (score >= 30) return { score, band: 7.0, message: "Nice work! Keep practicing!" };
            if (score >= 26) return { score, band: 6.5, message: "Not bad! Keep improving!" };
            if (score >= 23) return { score, band: 6.0, message: "Keep trying! You can do it!" };
            if (score >= 18) return { score, band: 5.5, message: "Don't give up! Keep working hard!" };
            if (score >= 16) return { score, band: 5.0, message: "Keep practicing! You can improve!" };
        } else {
            if (score >= 39) return { score, band: 9.0, message: "Excellent! Keep up the great work!" };
            if (score >= 37) return { score, band: 8.5, message: "Great job! You're almost there!" };
            if (score >= 35) return { score, band: 8.0, message: "Very good! Keep pushing forward!" };
            if (score >= 33) return { score, band: 7.5, message: "Good effort! You're doing well!" };
            if (score >= 30) return { score, band: 7.0, message: "Nice work! Keep practicing!" };
            if (score >= 27) return { score, band: 6.5, message: "Not bad! Keep improving!" };
            if (score >= 23) return { score, band: 6.0, message: "Keep trying! You can do it!" };
            if (score >= 19) return { score, band: 5.5, message: "Don't give up! Keep working hard!" };
            if (score >= 15) return { score, band: 5.0, message: "Keep practicing! You can improve!" };
        }
        return { score, band: 0, message: "Keep practicing and you'll get better!" };
    };

    const handleSubmit = () => {
        const correctAnswers = Array(40).fill("");
        const { score, band, message } = calculateBandScore(activeTab === "listening" ? listeningAnswers : readingAnswers, correctAnswers);
        const section = activeTab === "listening" ? "Listening" : "Reading";
        setFeedback(
            `<div class="feedback-columns">
                <div class="feedback-column">You got ${score}/40 correct.</div>
                <div class="feedback-column">Your ${section} Band Score is (~ approx.) ${band}.</div>
                <div class="feedback-column">${message}</div>
            </div>`
        );
        setShowPopup(true);
        if (band >= 7) {
            handleConfettiClick();
        }
        setSubmitText("Submitted!");
        setTimeout(() => setSubmitText("Submit"), 3000);
    };

    const renderColumn = (start: number, end: number, answers: string[]) => (
        <div className="column">
            {answers.slice(start, end).map((answer, index) => (
                <div key={start + index} className="answer-box">
                    <span>{start + index + 1}.</span>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleInputChange(start + index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, start + index)}
                        data-index={start + index}
                        ref={start + index === 0 ? firstInputRef : null}
                    />
                    <label className="checkbox-container">
                        <input type="checkbox" data-index={start + index} />
                        <span className="checkmark"> False</span>
                    </label>
                </div>
            ))}
        </div>
    );

    return (
        <div className="answer-sheet">
            <Timer duration={3600} />
            <div className="tabs">
                <button className={activeTab === "listening" ? "active" : ""} onClick={() => setActiveTab("listening")}>
                    <FontAwesomeIcon className="fa-icon" icon={faHeadphones} /> Listening
                </button>
                <button className={activeTab === "reading" ? "active" : ""} onClick={() => setActiveTab("reading")}>
                    <FontAwesomeIcon className="fa-icon" icon={faBookOpen} /> Reading
                </button>
            </div>
            <div className="answers">
                {activeTab === "listening" && (
                    <>
                        {renderColumn(0, 10, listeningAnswers)}
                        {renderColumn(10, 20, listeningAnswers)}
                        {renderColumn(20, 30, listeningAnswers)}
                        {renderColumn(30, 40, listeningAnswers)}
                    </>
                )}
                {activeTab === "reading" && (
                    <>
                        {renderColumn(0, 10, readingAnswers)}
                        {renderColumn(10, 20, readingAnswers)}
                        {renderColumn(20, 30, readingAnswers)}
                        {renderColumn(30, 40, readingAnswers)}
                    </>
                )}
            </div>
            <div className="buttons">
                <button className="submit" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faCheckCircle} /> {submitText}
                </button>
                <button className="clear" onClick={handleClear}>
                    <FontAwesomeIcon icon={faBrush} /> {clearText}
                </button>
            </div>
            {showPopup && (
                <div className="popup" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={() => setShowPopup(false)}>
                        <button className="close-btn" onClick={() => setShowPopup(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h2>🗨️ Feedback:</h2>
                        <div className="feedback-message" dangerouslySetInnerHTML={{ __html: feedback }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListeningReading;
