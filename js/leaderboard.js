// Leaderboard functionality for the Haunted Mansion game

// In a production environment, this would connect to a backend server
// For this demo, we'll use localStorage to persist scores

// Maximum number of entries to show in the leaderboard
const MAX_LEADERBOARD_ENTRIES = 100;

// Submit a score to the leaderboard
function submitScore(scoreData) {
    // Get existing leaderboard or create a new one
    let leaderboard = getLeaderboard();
    
    // Add the new score
    leaderboard.push({
        name: scoreData.name,
        time: scoreData.time,
        coins: scoreData.coins,
        score: scoreData.score,
        timestamp: Date.now()
    });
    
    // Sort the leaderboard by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only the top entries
    if (leaderboard.length > MAX_LEADERBOARD_ENTRIES) {
        leaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
    }
    
    // Save the updated leaderboard
    saveLeaderboard(leaderboard);
}

// Get the current leaderboard
function getLeaderboard() {
    const savedLeaderboard = localStorage.getItem('hauntedMansionLeaderboard');
    if (savedLeaderboard) {
        try {
            return JSON.parse(savedLeaderboard);
        } catch (error) {
            console.error("Error parsing leaderboard:", error);
            return [];
        }
    }
    return [];
}

// Save the leaderboard
function saveLeaderboard(leaderboard) {
    localStorage.setItem('hauntedMansionLeaderboard', JSON.stringify(leaderboard));
}

// Load and display the leaderboard
function loadLeaderboard() {
    const leaderboard = getLeaderboard();
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // Clear existing entries
    leaderboardBody.innerHTML = '';
    
    // No scores yet
    if (leaderboard.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center;">No scores yet. Be the first!</td>`;
        leaderboardBody.appendChild(row);
        return;
    }
    
    // Add entries
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        // Format the time
        const minutes = Math.floor(entry.time / 60);
        const seconds = entry.time % 60;
        const formattedTime = `${minutes}m ${seconds}s`;
        
        // Create the row
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(entry.name)}</td>
            <td>${formattedTime}</td>
            <td>${entry.coins}</td>
            <td>${entry.score}</td>
        `;
        
        // Highlight the current user's score
        if (entry.name === gameState.username) {
            row.classList.add('current-user');
            row.style.backgroundColor = 'rgba(100, 0, 0, 0.4)';
            row.style.fontWeight = 'bold';
        }
        
        leaderboardBody.appendChild(row);
    });
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// For a production application, we would implement server-side storage and retrieval
// The following functions are placeholders for that functionality

// Simulate fetching leaderboard from server (for future implementation)
function fetchLeaderboardFromServer() {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getLeaderboard());
        }, 500);
    });
}

// Simulate sending score to server (for future implementation)
function sendScoreToServer(scoreData) {
    // In a real application, this would be an API call
    return new Promise((resolve) => {
        setTimeout(() => {
            submitScore(scoreData);
            resolve({ success: true });
        }, 500);
    });
}

// Simulate real-time updates (for future implementation with WebSockets)
function setupRealTimeUpdates() {
    // In a real application, this would set up WebSocket connections
    console.log("Real-time updates would be set up here in a production environment.");
}

// Initialize the leaderboard
document.addEventListener('DOMContentLoaded', () => {
    // Set up any leaderboard-specific event listeners here
    console.log("Leaderboard module initialized");
});