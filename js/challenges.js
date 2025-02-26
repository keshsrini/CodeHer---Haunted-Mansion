// Define all challenges for the Haunted Mansion game
window.challenges = {
    '1': {
        title: "Addition Challenge",
        description: "The first door requires you to write a function that adds two numbers together. Complete the function below to escape this room.",
        hint: "Use the '+' operator to add the two parameters together and return the result.",
        functionArgs: ["a", "b"],
        starterCode: "// Write a function that adds two numbers a and b",
        testCasesText: "Test 1: add(2, 3) should return 5\nTest 2: add(0, 0) should return 0\nTest 3: add(-1, 1) should return 0\nTest 4: add(10, 20) should return 30",
        tests: [
            { input: [2, 3], expected: 5 },
            { input: [0, 0], expected: 0 },
            { input: [-1, 1], expected: 0 },
            { input: [10, 20], expected: 30 }
        ],
        userCode: ""
    },
    
    '2': {
        title: "Array Sorting Challenge",
        description: "The second door requires you to sort an array of numbers in ascending order. Complete the function below to escape this room.",
        hint: "You can use JavaScript's built-in sort() method, but remember that it sorts elements as strings by default. You'll need to provide a comparison function.",
        functionArgs: ["arr"],
        starterCode: "// Write a function to sort an array of numbers in ascending order\n// Example: [3, 1, 4, 2] should become [1, 2, 3, 4]\n\n// Your code here:",
        testCasesText: "Test 1: sort([3, 1, 4, 2]) should return [1, 2, 3, 4]\nTest 2: sort([5, 5, 5]) should return [5, 5, 5]\nTest 3: sort([]) should return []\nTest 4: sort([10, -1, 0, 5]) should return [-1, 0, 5, 10]",
        tests: [
            { input: [[3, 1, 4, 2]], expected: [1, 2, 3, 4] },
            { input: [[5, 5, 5]], expected: [5, 5, 5] },
            { input: [[]], expected: [] },
            { input: [[10, -1, 0, 5]], expected: [-1, 0, 5, 10] }
        ],
        userCode: ""
    },
    
    '3': {
        title: "Matrix Transpose Challenge",
        description: "The third door requires you to transpose a matrix (2D array). The transpose of a matrix is a new matrix whose rows are the columns of the original. Complete the function below to escape this room.",
        hint: "Create a new matrix with dimensions reversed from the original. Then fill it by mapping the values from the original matrix, swapping row and column indices.",
        functionArgs: ["matrix"],
        starterCode: "// Write a function to transpose a matrix (2D array)\n// Example: [[1, 2], [3, 4]] should become [[1, 3], [2, 4]]\n\n// Your code here:",
        testCasesText: "Test 1: transpose([[1, 2], [3, 4]]) should return [[1, 3], [2, 4]]\nTest 2: transpose([[1, 2, 3], [4, 5, 6]]) should return [[1, 4], [2, 5], [3, 6]]\nTest 3: transpose([[1], [2], [3]]) should return [[1, 2, 3]]\nTest 4: transpose([[1, 2, 3]]) should return [[1], [2], [3]]",
        tests: [
            { input: [[[1, 2], [3, 4]]], expected: [[1, 3], [2, 4]] },
            { input: [[[1, 2, 3], [4, 5, 6]]], expected: [[1, 4], [2, 5], [3, 6]] },
            { input: [[[1], [2], [3]]], expected: [[1, 2, 3]] },
            { input: [[[1, 2, 3]]], expected: [[1], [2], [3]] }
        ],
        userCode: ""
    },
    
    '4': {
        title: "Debug Linear Search Challenge",
        description: "The fourth door contains a buggy implementation of linear search. Debug the function to correctly find the index of a target element in an array. If the element is not found, return -1. Fix the logic errors in the code below to escape this room.",
        hint: "Check the loop conditions and return statement carefully. Make sure you're returning the correct value when the element is found and when it's not found.",
        functionArgs: ["arr", "target"],
        starterCode: "// Debug this linear search function\n// It should return the index of the target element, or -1 if not found\n\n// Buggy code:\nfor (let i = 0; i <= arr.length; i++) {\n  if (arr[i] === target)\n    return i;\n}\nreturn 0;",
        testCasesText: "Test 1: linearSearch([1, 3, 5, 7], 5) should return 2\nTest 2: linearSearch([1, 2, 3, 4], 6) should return -1\nTest 3: linearSearch([], 5) should return -1\nTest 4: linearSearch([10, 20, 30], 10) should return 0",
        tests: [
            { input: [[1, 3, 5, 7], 5], expected: 2 },
            { input: [[1, 2, 3, 4], 6], expected: -1 },
            { input: [[], 5], expected: -1 },
            { input: [[10, 20, 30], 10], expected: 0 }
        ],
        userCode: ""
    },
    
    '5': {
        title: "Binary Search Challenge",
        description: "The final door requires you to implement binary search on a sorted array. Binary search is more efficient than linear search for sorted arrays. Complete the function to correctly implement binary search, which should return the index of the target element or -1 if not found.",
        hint: "Binary search works by repeatedly dividing the search interval in half. Find the middle element and compare it with the target. If they match, return the index. If the target is less than the middle element, search the left half; otherwise, search the right half.",
        functionArgs: ["sortedArr", "target"],
        starterCode: "// Implement binary search on a sorted array\n// Return the index of the target element, or -1 if not found\n\n// Your code here:\nlet left = 0;\nlet right = sortedArr.length - 1;\n\nwhile (left <= right) {\n  const mid = Math.floor((left + right) / 2);\n  \n  if (sortedArr[mid] === target) {\n    return mid;\n  } else if (sortedArr[mid] < target) {\n    left = mid + 1;\n  } else {\n    right = mid - 1;\n  }\n}\n\nreturn -1;",
        testCasesText: "Test 1: binarySearch([1, 3, 5, 7, 9], 5) should return 2\nTest 2: binarySearch([1, 2, 3, 4, 5], 6) should return -1\nTest 3: binarySearch([1, 2, 3, 4, 5], 1) should return 0\nTest 4: binarySearch([10, 20, 30, 40, 50], 50) should return 4",
        tests: [
            { input: [[1, 3, 5, 7, 9], 5], expected: 2 },
            { input: [[1, 2, 3, 4, 5], 6], expected: -1 },
            { input: [[1, 2, 3, 4, 5], 1], expected: 0 },
            { input: [[10, 20, 30, 40, 50], 50], expected: 4 }
        ],
        userCode: ""
    }
};