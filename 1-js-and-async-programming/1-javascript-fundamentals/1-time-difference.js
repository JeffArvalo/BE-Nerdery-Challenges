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

const formatNumToTwoDigits = (num) => {
  const calculateTime = Math.floor(num).toString();
  return calculateTime.padStart(2, "0");
};

const timeDifference = (a, b) => {
  const diff = Math.abs(a - b);
  const hours = formatNumToTwoDigits(diff / 3600);
  const mins = formatNumToTwoDigits((diff % 3600) / 60);
  const sec = formatNumToTwoDigits(diff % 60);
  return `${hours}:${mins}:${sec}`;
};

module.exports = timeDifference;
