// Global game state
const gameState = {
    username: '',
    pinCode: '',
    startTime: null,
    timeRemaining: 3600, // 1 hour in seconds
    coins: 100,
    completedChallenges: new Set(),
    currentChallenge: null,
    timerInterval: null,
    selectedLanguage: 'javascript',
};

// DOM Elements
const elements = {
    // Login screen
    loginScreen: document.getElementById('login-screen'),
    username: document.getElementById('username'),
    pinCode: document.getElementById('pin-code'),
    enterBtn: document.getElementById('enter-btn'),
    
    // Map screen
    mansionMap: document.getElementById('mansion-map'),
    timer: document.getElementById('timer'),
    coins: document.getElementById('coins'),
    playerName: document.getElementById('player-name'),
    doors: document.querySelectorAll('.door'),
    
    // Challenge screen
    challengeScreen: document.getElementById('challenge-screen'),
    challengeTimer: document.getElementById('challenge-timer'),
    languageSelect: document.getElementById('language-select'),
    challengeCoins: document.getElementById('challenge-coins'),
    backToMapBtn: document.getElementById('back-to-map'),
    challengeTitle: document.getElementById('challenge-title'),
    challengeDescription: document.getElementById('challenge-description'),
    codeInput: document.getElementById('code-input'),
    testCasesDisplay: document.getElementById('test-cases-display'),
    hintBtn: document.getElementById('hint-btn'),
    submitBtn: document.getElementById('submit-btn'),
    hintBox: document.getElementById('hint-box'),
    hintText: document.getElementById('hint-text'),
    resultBox: document.getElementById('result-box'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    
    // Success screen
    successScreen: document.getElementById('success-screen'),
    completionTime: document.getElementById('completion-time'),
    finalCoins: document.getElementById('final-coins'),
    viewLeaderboardBtn: document.getElementById('view-leaderboard-btn'),
    
    // Leaderboard screen
    leaderboardScreen: document.getElementById('leaderboard-screen'),
    leaderboardBody: document.getElementById('leaderboard-body'),
    playAgainBtn: document.getElementById('play-again-btn'),
    
    // Game over screen
    gameOverScreen: document.getElementById('game-over-screen'),
    tryAgainBtn: document.getElementById('try-again-btn'),
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    setupEventListeners();
    
    // Check for existing session
    checkExistingSession();
});

// Set up event listeners
function setupEventListeners() {
    // Login screen
    elements.enterBtn.addEventListener('click', handleLogin);
    
    // Map screen
    elements.doors.forEach(door => {
        door.addEventListener('click', () => {
            const doorId = door.getAttribute('data-door');
            openChallenge(doorId);
        });
    });
    
    // Challenge screen
    elements.backToMapBtn.addEventListener('click', returnToMap);
    elements.hintBtn.addEventListener('click', showHint);
    elements.submitBtn.addEventListener('click', submitSolution);
    
    // Language selector
    elements.languageSelect.addEventListener('change', (e) => {
        gameState.selectedLanguage = e.target.value;
    });
    
    // Success screen
    elements.viewLeaderboardBtn.addEventListener('click', showLeaderboard);
    
    // Leaderboard screen
    elements.playAgainBtn.addEventListener('click', resetGame);
    
    // Game over screen
    elements.tryAgainBtn.addEventListener('click', resetGame);
}

// Check for existing session
function checkExistingSession() {
    const savedState = localStorage.getItem('hauntedMansionState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            // Restore session if it's still valid (not expired)
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - parsedState.startTime) / 1000);
            
            if (elapsedTime < 3600) { // If session is still valid
                gameState.username = parsedState.username;
                gameState.pinCode = parsedState.pinCode;
                gameState.startTime = parsedState.startTime;
                gameState.timeRemaining = 3600 - elapsedTime;
                gameState.coins = parsedState.coins;
                gameState.completedChallenges = new Set(parsedState.completedChallenges);
                
                // Start game from the map
                showMansionMap();
                return;
            }
        } catch (error) {
            console.error("Error restoring session:", error);
            // Continue to login screen if there's an error
        }
    }
    
    // If no valid session found, show login screen
    showLoginScreen();
}

// Handle login
function handleLogin() {
    const username = elements.username.value.trim();
    const pinCode = elements.pinCode.value.trim();
    
    if (!username) {
        alert("Please enter a username.");
        return;
    }
    
    if (!pinCode) {
        alert("Please enter the pin code.");
        return;
    }
    
    // For this demo, we'll use a hard-coded pin code
    // In a real application, this would be validated against a server
    if (pinCode !== "1234") {
        alert("Invalid pin code. Try again.");
        return;
    }
    
    // Set game state
    gameState.username = username;
    gameState.pinCode = pinCode;
    gameState.startTime = Date.now();
    
    // Start the game
    showMansionMap();
    
    // Save state to local storage
    saveGameState();
}

// Show login screen
function showLoginScreen() {
    hideAllScreens();
    elements.loginScreen.classList.remove('hidden');
}

// Show mansion map
function showMansionMap() {
    hideAllScreens();
    elements.mansionMap.classList.remove('hidden');
    elements.mansionMap.classList.add('fade-in');
    
    // Update UI
    updateUI();
    
    // Start timer if not already running
    if (!gameState.timerInterval) {
        startTimer();
    }
    
    // Update doors to show completed ones
    updateDoors();
}

// Hide all screens
function hideAllScreens() {
    const screens = [
        elements.loginScreen,
        elements.mansionMap,
        elements.challengeScreen,
        elements.successScreen,
        elements.leaderboardScreen,
        elements.gameOverScreen
    ];
    
    screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('fade-in');
    });
}

// Update UI elements with current game state
function updateUI() {
    // Update player name
    elements.playerName.textContent = gameState.username;
    
    // Update timer and coins on all screens
    const formattedTime = formatTime(gameState.timeRemaining);
    elements.timer.textContent = formattedTime;
    elements.challengeTimer.textContent = formattedTime;
    elements.coins.textContent = gameState.coins;
    elements.challengeCoins.textContent = gameState.coins;
}

// Start the timer
function startTimer() {
    clearInterval(gameState.timerInterval);
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        
        if (gameState.timeRemaining <= 0) {
            endGame(false);
            return;
        }
        
        updateUI();
        saveGameState();
    }, 1000);
}

// Format time (seconds) to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update doors to show completed challenges
function updateDoors() {
    elements.doors.forEach(door => {
        const doorId = door.getAttribute('data-door');
        if (gameState.completedChallenges.has(doorId)) {
            door.classList.add('completed');
        }
    });
    
    // Check if all challenges are completed
    if (gameState.completedChallenges.size === 5) {
        // All challenges completed, show success screen after a delay
        setTimeout(() => {
            showSuccessScreen();
        }, 1000);
    }
}

// Open a challenge
function openChallenge(doorId) {
    gameState.currentChallenge = doorId;
    
    // Load challenge details from challenges.js (will be defined in a separate file)
    const challenge = window.challenges[doorId];
    
    elements.challengeTitle.textContent = challenge.title;
    elements.challengeDescription.textContent = challenge.description;
    elements.testCasesDisplay.textContent = challenge.testCasesText;
    
    // Set language to default if not set
    elements.languageSelect.value = gameState.selectedLanguage;
    
    // Pre-populate code input if this challenge was opened before and language matches
    const userCodeKey = `${gameState.selectedLanguage}_userCode`;
    if (challenge[userCodeKey]) {
        elements.codeInput.value = challenge[userCodeKey];
    } else {
        // Provide appropriate starter code based on selected language
        elements.codeInput.value = getStarterCodeForLanguage(challenge, gameState.selectedLanguage);
    }
    
    // Hide hint and result boxes
    elements.hintBox.classList.add('hidden');
    elements.resultBox.classList.add('hidden');
    
    // Show challenge screen
    hideAllScreens();
    elements.challengeScreen.classList.remove('hidden');
    elements.challengeScreen.classList.add('fade-in');
    
    // Update UI
    updateUI();
}

// Return to the map from a challenge
function returnToMap() {
    // Save the current code for this challenge
    if (gameState.currentChallenge) {
        const challenge = window.challenges[gameState.currentChallenge];
        challenge.userCode = elements.codeInput.value;
    }
    
    showMansionMap();
}

// Show hint for current challenge
function showHint() {
    if (gameState.coins < 10) {
        alert("Not enough coins for a hint!");
        return;
    }
    
    // Deduct coins
    gameState.coins -= 10;
    
    // Update UI
    updateUI();
    saveGameState();
    
    // Show hint
    const challenge = window.challenges[gameState.currentChallenge];
    elements.hintText.textContent = challenge.hint;
    elements.hintBox.classList.remove('hidden');
}

// Submit solution for current challenge
function submitSolution() {
    const challenge = window.challenges[gameState.currentChallenge];
    const userCode = elements.codeInput.value;
    
    // Store the code for the specific language
    const userCodeKey = `${gameState.selectedLanguage}_userCode`;
    challenge[userCodeKey] = userCode;
    
    try {
        // Evaluate the solution based on selected language
        const result = evaluateSolution(userCode, challenge, gameState.selectedLanguage);
        
        if (result.success) {
            // Mark challenge as completed
            gameState.completedChallenges.add(gameState.currentChallenge);
            
            // Show success message
            elements.resultBox.classList.remove('hidden');
            elements.resultBox.classList.add('success');
            elements.resultTitle.textContent = "Success!";
            elements.resultMessage.textContent = "You've solved this challenge! Return to the map to continue.";
            
            // Update the door on the map
            updateDoors();
            
            // Save game state
            saveGameState();
        } else {
            // Show failure message
            elements.resultBox.classList.remove('hidden');
            elements.resultBox.classList.remove('success');
            elements.resultBox.classList.add('failure');
            elements.resultTitle.textContent = "Not Quite Right";
            elements.resultMessage.textContent = result.message || "Your solution didn't pass all test cases. Try again!";
        }
    } catch (error) {
        console.error("Error evaluating solution:", error);
        
        // Show error message
        elements.resultBox.classList.remove('hidden');
        elements.resultBox.classList.remove('success');
        elements.resultBox.classList.add('failure');
        elements.resultTitle.textContent = "Error";
        elements.resultMessage.textContent = "There was an error running your code: " + error.message;
    }
}

// Evaluate the solution based on challenge type and programming language
function evaluateSolution(code, challenge, language) {
    // This is a simplified evaluation. In a real app, this would be more robust
    // and potentially use a sandboxed environment for safety or a backend service for non-JS languages
    try {
        let results = [];
        
        switch (language) {
            case 'javascript':
                results = evaluateJavaScript(code, challenge);
                break;
                
            case 'python':
                results = simulatePythonEvaluation(code, challenge);
                break;
                
            case 'c':
                results = simulateCEvaluation(code, challenge);
                break;
                
            case 'cpp':
                results = simulateCppEvaluation(code, challenge);
                break;
                
            case 'java':
                results = simulateJavaEvaluation(code, challenge);
                break;
                
            default:
                results = evaluateJavaScript(code, challenge);
        }
        
        // Check if any test failed
        const failedTest = results.find(result => !result.success);
        if (failedTest) {
            return {
                success: false,
                message: failedTest.message
            };
        }
        
        // All tests passed
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
}

// JavaScript evaluation (actual execution)
function evaluateJavaScript(code, challenge) {
    const results = [];
    
    // Create a function from the user's code
    const userFunction = new Function(...challenge.functionArgs, code);
    
    // Run the tests
    for (const test of challenge.tests) {
        const expectedResult = test.expected;
        const result = userFunction(...test.input);
        
        // Compare the result with the expected output
        if (!compareResults(result, expectedResult)) {
            results.push({
                success: false,
                message: `Test failed: Input: ${JSON.stringify(test.input)}, Expected: ${JSON.stringify(expectedResult)}, Got: ${JSON.stringify(result)}`
            });
        } else {
            results.push({ success: true });
        }
    }
    
    return results;
}

// Simulate Python evaluation (client-side simulation)
function simulatePythonEvaluation(code, challenge) {
    // In a real application, this would send the code to a backend for execution
    // Here we simulate evaluation by checking for expected syntax/patterns
    
    const results = [];
    let basicErrorChecks = validatePythonCode(code);
    
    if (basicErrorChecks.hasError) {
        return [{ success: false, message: basicErrorChecks.errorMessage }];
    }
    
    // Basic simulation - check if code likely contains solution patterns
    for (const test of challenge.tests) {
        let testResult = simulatePythonTestResult(code, test, challenge);
        results.push(testResult);
        
        if (!testResult.success) {
            break; // Stop on first failure for performance
        }
    }
    
    return results;
}

// Simulate C evaluation (client-side simulation)
function simulateCEvaluation(code, challenge) {
    // Similar to Python, this would normally be done server-side
    const results = [];
    let basicErrorChecks = validateCCode(code);
    
    if (basicErrorChecks.hasError) {
        return [{ success: false, message: basicErrorChecks.errorMessage }];
    }
    
    for (const test of challenge.tests) {
        let testResult = simulateCTestResult(code, test, challenge);
        results.push(testResult);
        
        if (!testResult.success) {
            break;
        }
    }
    
    return results;
}

// Simulate C++ evaluation (client-side simulation)
function simulateCppEvaluation(code, challenge) {
    // Similar to other non-JS languages, would be server-side in production
    const results = [];
    let basicErrorChecks = validateCppCode(code);
    
    if (basicErrorChecks.hasError) {
        return [{ success: false, message: basicErrorChecks.errorMessage }];
    }
    
    for (const test of challenge.tests) {
        let testResult = simulateCppTestResult(code, test, challenge);
        results.push(testResult);
        
        if (!testResult.success) {
            break;
        }
    }
    
    return results;
}

// Simulate Java evaluation (client-side simulation)
function simulateJavaEvaluation(code, challenge) {
    // Would be server-side in production
    const results = [];
    let basicErrorChecks = validateJavaCode(code);
    
    if (basicErrorChecks.hasError) {
        return [{ success: false, message: basicErrorChecks.errorMessage }];
    }
    
    for (const test of challenge.tests) {
        let testResult = simulateJavaTestResult(code, test, challenge);
        results.push(testResult);
        
        if (!testResult.success) {
            break;
        }
    }
    
    return results;
}

// Basic validation functions
function validatePythonCode(code) {
    // Check for common Python syntax errors
    if (!code.trim()) {
        return { hasError: true, errorMessage: "Code cannot be empty" };
    }
    
    // Check for mismatched indentation (simplified)
    if ((code.match(/^\s+/gm) || []).some(indent => indent.length % 4 !== 0)) {
        return { hasError: true, errorMessage: "Python indentation must be a multiple of 4 spaces" };
    }
    
    return { hasError: false };
}

function validateCCode(code) {
    // Check for common C syntax errors
    if (!code.trim()) {
        return { hasError: true, errorMessage: "Code cannot be empty" };
    }
    
    // Check for missing semicolons (simplified)
    const lines = code.split('\n').filter(line => !line.trim().startsWith('//'));
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.endsWith(';') && 
            !trimmedLine.endsWith('{') && !trimmedLine.endsWith('}') && 
            !trimmedLine.endsWith(':') && !trimmedLine.match(/^#/)) {
            if (!trimmedLine.endsWith(')')) { // Function declaration line
                return { hasError: true, errorMessage: "Missing semicolon at: " + trimmedLine };
            }
        }
    }
    
    return { hasError: false };
}

function validateCppCode(code) {
    // Similar to C validation with C++ specifics
    return validateCCode(code); // Simplified for this example
}

function validateJavaCode(code) {
    // Check for common Java syntax errors
    if (!code.trim()) {
        return { hasError: true, errorMessage: "Code cannot be empty" };
    }
    
    // Check for missing class structure (simplified)
    if (!code.match(/public\s+(static\s+)?\w+/)) {
        return { hasError: true, errorMessage: "Java code should contain public methods/classes" };
    }
    
    return { hasError: false };
}

// Simulation helpers
function simulatePythonTestResult(code, test, challenge) {
    // Very basic simulation based on pattern matching
    // In a real app, this would be done server-side
    
    // Does the code contain operations that might solve the challenge?
    // Checking for common patterns based on input/output
    
    if (challenge.title.includes("Addition") || challenge.title.includes("Add")) {
        if (!code.includes('+')) {
            return { 
                success: false, 
                message: `Test failed: Your code doesn't seem to use addition.`
            };
        }
    }
    
    if (challenge.title.includes("Sort")) {
        if (!code.includes('sort') && !code.includes('sorted')) {
            return { 
                success: false, 
                message: `Test failed: Your code doesn't seem to use sort functions.`
            };
        }
    }
    
    if (challenge.title.includes("Binary Search")) {
        if (!code.includes('mid') && !code.includes('middle')) {
            return { 
                success: false, 
                message: `Test failed: Binary search typically uses a midpoint calculation.` 
            };
        }
    }
    
    // If we haven't found a reason to fail, assume it passes
    return { success: true };
}

function simulateCTestResult(code, test, challenge) {
    // Similar logic to Python but with C syntax
    
    if (challenge.title.includes("Addition") || challenge.title.includes("Add")) {
        if (!code.includes('+')) {
            return { 
                success: false, 
                message: `Test failed: Your code doesn't seem to use addition.`
            };
        }
    }
    
    // Simplified for demo
    return { success: true };
}

function simulateCppTestResult(code, test, challenge) {
    // Specific C++ checks
    
    if (challenge.title.includes("Sort")) {
        if (!code.includes('sort(') && !code.includes('std::sort')) {
            return { 
                success: false, 
                message: `Test failed: C++ sorting typically uses std::sort.`
            };
        }
    }
    
    // Simplified for demo
    return { success: true };
}

function simulateJavaTestResult(code, test, challenge) {
    // Java-specific checks
    
    if (challenge.title.includes("Sort")) {
        if (!code.includes('Arrays.sort') && !code.includes('Collections.sort')) {
            return { 
                success: false, 
                message: `Test failed: Java sorting typically uses Arrays.sort() or Collections.sort().`
            };
        }
    }
    
    // Simplified for demo
    return { success: true };
}

// Compare results (handles arrays and objects)
function compareResults(result, expected) {
    if (Array.isArray(result) && Array.isArray(expected)) {
        if (result.length !== expected.length) return false;
        for (let i = 0; i < result.length; i++) {
            if (!compareResults(result[i], expected[i])) return false;
        }
        return true;
    } else if (typeof result === 'object' && result !== null && typeof expected === 'object' && expected !== null) {
        const resultKeys = Object.keys(result);
        const expectedKeys = Object.keys(expected);
        if (resultKeys.length !== expectedKeys.length) return false;
        for (const key of resultKeys) {
            if (!expectedKeys.includes(key) || !compareResults(result[key], expected[key])) return false;
        }
        return true;
    } else {
        return result === expected;
    }
}

// Show success screen
function showSuccessScreen() {
    // Stop the timer
    clearInterval(gameState.timerInterval);
    
    // Calculate completion time
    const totalTimeSeconds = 3600 - gameState.timeRemaining;
    const minutes = Math.floor(totalTimeSeconds / 60);
    const seconds = totalTimeSeconds % 60;
    const formattedTime = `${minutes}m ${seconds}s`;
    
    // Update UI
    elements.completionTime.textContent = formattedTime;
    elements.finalCoins.textContent = gameState.coins;
    
    // Show screen
    hideAllScreens();
    elements.successScreen.classList.remove('hidden');
    elements.successScreen.classList.add('fade-in');
    
    // Submit score to leaderboard
    submitScore({
        name: gameState.username,
        time: totalTimeSeconds,
        coins: gameState.coins,
        score: calculateScore(totalTimeSeconds, gameState.coins)
    });
}

// Calculate score based on time and coins
function calculateScore(timeSeconds, coins) {
    // Score formula: (3600 - timeSeconds) + (coins * 10)
    // This rewards faster completion and more remaining coins
    return (3600 - timeSeconds) + (coins * 10);
}

// Show leaderboard
function showLeaderboard() {
    hideAllScreens();
    elements.leaderboardScreen.classList.remove('hidden');
    elements.leaderboardScreen.classList.add('fade-in');
    
    // Load leaderboard data
    loadLeaderboard();
}

// End game (success = true for win, false for loss)
function endGame(success) {
    // Stop the timer
    clearInterval(gameState.timerInterval);
    
    if (success) {
        showSuccessScreen();
    } else {
        // Game over - time's up
        hideAllScreens();
        elements.gameOverScreen.classList.remove('hidden');
        elements.gameOverScreen.classList.add('fade-in');
    }
    
    // Clear saved game state
    localStorage.removeItem('hauntedMansionState');
}

// Reset game
function resetGame() {
    // Reset game state
    gameState.completedChallenges = new Set();
    gameState.coins = 100;
    gameState.timeRemaining = 3600;
    gameState.currentChallenge = null;
    
    // Clear timer
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
    
    // Reset challenges
    for (const challenge of Object.values(window.challenges)) {
        challenge.userCode = '';
    }
    
    // Go to login screen
    showLoginScreen();
    
    // Clear local storage
    localStorage.removeItem('hauntedMansionState');
}

// Save game state to local storage
function saveGameState() {
    const stateToSave = {
        username: gameState.username,
        pinCode: gameState.pinCode,
        startTime: gameState.startTime,
        timeRemaining: gameState.timeRemaining,
        coins: gameState.coins,
        completedChallenges: Array.from(gameState.completedChallenges),
    };
    
    localStorage.setItem('hauntedMansionState', JSON.stringify(stateToSave));
}
