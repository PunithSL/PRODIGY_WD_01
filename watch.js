const millisecondsDisplay = document.querySelector(".milliseconds");
const secondsDisplay = document.querySelector(".seconds");
const minutesDisplay = document.querySelector(".minutes");
const hoursDisplay = document.querySelector(".hours");
const startbtn = document.querySelector(".control_start_btn");
const resetbtn = document.querySelector(".control_reset_btn");
const lapsbtn = document.querySelector(".control_lap_btn");
const lapsTable = document.getElementById("laps_table");

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let lastTime = performance.now();
let timerRunning = false;
let animationFrameId;
let laps = [];
let lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };

function padNumber(number, length) {
  return number.toString().padStart(length, "0");
}

function updateMilliseconds() {
  if (!timerRunning) return;

  const currentTime = performance.now();
  const elapsed = currentTime - lastTime;

  milliseconds += elapsed;

  if (milliseconds >= 1000) {
    const additionalSeconds = Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;
    seconds += additionalSeconds;
  }

  if (seconds >= 60) {
    const additionalMinutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    minutes += additionalMinutes;
  }

  if (minutes >= 60) {
    const additionalHours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    hours += additionalHours;
  }

  millisecondsDisplay.textContent = padNumber(Math.floor(milliseconds), 3);
  secondsDisplay.textContent = padNumber(seconds, 2);
  minutesDisplay.textContent = padNumber(minutes, 2);
  hoursDisplay.textContent = padNumber(hours, 2);

  lastTime = currentTime;
  animationFrameId = requestAnimationFrame(updateMilliseconds);
}

function startStopTimer() {
  if (timerRunning) {
    timerRunning = false;
    cancelAnimationFrame(animationFrameId);
  } else {
    timerRunning = true;
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(updateMilliseconds);
  }
}

function resetTimer() {
  timerRunning = false;
  cancelAnimationFrame(animationFrameId);
  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  laps = [];
  lastLapTime = { milliseconds: 0, seconds: 0, minutes: 0, hours: 0 };
  millisecondsDisplay.textContent = padNumber(milliseconds, 2);
  secondsDisplay.textContent = padNumber(seconds, 2);
  minutesDisplay.textContent = padNumber(minutes, 2);
  hoursDisplay.textContent = padNumber(hours, 2);
  lapsTable.innerHTML = "";
}

function formatTime(hours, minutes, seconds, milliseconds) {
  return `${padNumber(hours, 2)}:${padNumber(minutes, 2)}:${padNumber(
    seconds,
    2
  )}.${padNumber(milliseconds, 3)}`;
}

function addLap() {
  const currentLapTime = {
    hours,
    minutes,
    seconds,
    milliseconds: Math.floor(milliseconds),
  };
  laps.push(currentLapTime);

  let lapMilliseconds = currentLapTime.milliseconds - lastLapTime.milliseconds;
  let lapSeconds = currentLapTime.seconds - lastLapTime.seconds;
  let lapMinutes = currentLapTime.minutes - lastLapTime.minutes;
  let lapHours = currentLapTime.hours - lastLapTime.hours;

  if (lapMilliseconds < 0) {
    lapMilliseconds += 1000;
    lapSeconds -= 1;
  }
  if (lapSeconds < 0) {
    lapSeconds += 60;
    lapMinutes -= 1;
  }
  if (lapMinutes < 0) {
    lapMinutes += 60;
    lapHours -= 1;
  }

  const lapTime = formatTime(lapHours, lapMinutes, lapSeconds, lapMilliseconds);
  const overallTime = formatTime(
    hours,
    minutes,
    seconds,
    Math.floor(milliseconds)
  );

  const row = document.createElement("tr");
  row.innerHTML = `<td>${laps.length}</td><td>${lapTime}</td><td>${overallTime}</td>`;
  lapsTable.insertBefore(row, lapsTable.firstChild);

  lastLapTime = { ...currentLapTime };
}

startbtn.addEventListener("click", startStopTimer);
resetbtn.addEventListener("click", resetTimer);
lapsbtn.addEventListener("click", addLap);
