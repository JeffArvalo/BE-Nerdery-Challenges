/*
Challenge 1

"Time difference calculator"

The function timeDifference accepts two positive numbers representing time in seconds. You should modify the function to return the difference between the two times in a human-readable format HH:MM:SS.

Requirements:
- The function should accept two positive numbers representing time in seconds.
- The function should return the absolute difference between the two times.
- The result should be formatted as HH:MM:SS.

Example:

timeDifference(7200, 3400); // Expected output: "01:03:20"

*/

const formatTime = (num) => {
  num = Math.floor(num);
  return num < 10 ? `0${num}` : `${num}`;
};

const timeDifference = (a, b) => {
  let diff = a > b ? a - b : b - a;
  let hours = diff / 3600;
  let mins = (diff % 3600) / 60;
  let sec = diff % 60;
  return `${formatTime(hours)}:${formatTime(mins)}:${formatTime(sec)}`;
};

module.exports = timeDifference;
