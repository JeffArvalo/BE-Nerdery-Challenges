/*
Challenge 2

"Array rotation"
Given an array of numbers and a positive integer n, write a function that rotates the array n positions clockwise.

Requirements:
- The function should handle arrays of any length.
- The array should be rotated in a clockwise direction.
- The rotation should wrap around, meaning the elements at the end of the array should move to the beginning.
- The function should handle cases where n is greater than the length of the array.
- The function should return the rotated array.

Example:cl
rotateArray([1, 2, 3, 4, 5], 2); // Expected output: [3, 4, 5, 1, 2]
rotateArray([1, 2, 3, 4, 5], 7); // Expected output: [3, 4, 5, 1, 2]

*/
const rotateElements = (arr, n) => {
  const last = arr.slice(0, n);
  const first = arr.slice(n);

  return first.concat(last);
};

const rotateArray = (arr, n) => {
  if (arr.length > 1) {
    const position = n % arr.length;
    if (position === 0) {
      return arr;
    }
    return rotateElements(arr, position);
  } else {
    return arr;
  }
};

module.exports = rotateArray;
