let interval;
let timerRunning = false;
let remainingTime = 3600; // 1 hour in seconds
let endTime;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function startTimer() {
    const now = Date.now();
    endTime = now + remainingTime * 1000; // set end time as current time plus duration
    interval = setInterval(updateTimer, 1000); // Update every second
    timerRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = true;
}

function stopTimer() {
    clearInterval(interval);
    timerRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = false;
}

function resetTimer() {
    stopTimer();
    remainingTime = 3600;
    updateTimerDisplay(remainingTime);
}

function updateTimer() {
    const now = Date.now();
    remainingTime = Math.round((endTime - now) / 1000); // calculate remaining time based on end time and current time
    if (remainingTime < 0) {
        stopTimer();
        updateTimerDisplay(0); // Ensure timer display shows 00:00:00 when time is up
    } else {
        updateTimerDisplay(remainingTime); // Update timer display with remaining time
    }
}

function updateTimerDisplay(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(number) {
    return (number < 10) ? `0${number}` : number;
}

startBtn.addEventListener('click', () => {
    if (!timerRunning) {
        startTimer();
    }
});

stopBtn.addEventListener('click', () => {
    if (timerRunning) {
        stopTimer();
    }
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

// Ensure initial timer display is set correctly
updateTimerDisplay(remainingTime);

// Current Year
document.getElementById('current-year').textContent = new Date().getFullYear();
