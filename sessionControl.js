let inactivityTimer;
let countdownTimer;
const INACTIVITY_LIMIT = 25 * 60 * 1000; // X minutes
let remainingTime = INACTIVITY_LIMIT;
let isLoggedOut = false; // Add a flag to check if the user is already logged out

// Format time as mm:ss
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Update countdown timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.textContent = `Remaining time: ${formatTime(remainingTime)}`;
  }
}

// Countdown function
function startCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    remainingTime -= 1000;
    updateTimerDisplay();

    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      if (!isLoggedOut) {
        logoutUser(); // Trigger logout when time is up
      }
    }
  }, 1000);
}

// Reset timer on user activity
function resetTimer() {
  clearTimeout(inactivityTimer);
  remainingTime = INACTIVITY_LIMIT;
  updateTimerDisplay();
  startCountdown();

  inactivityTimer = setTimeout(logoutUser, INACTIVITY_LIMIT);
}

// Log out user
async function logoutUser() {
  if (isLoggedOut) return; // Prevent multiple logouts
  isLoggedOut = true; // Set the flag to true

  // Hide original content and show logout message
  const appElement = document.getElementById('app');
  const logoutMessageElement = document.getElementById('logoutMessage');
  if (appElement) appElement.style.display = 'none';
  if (logoutMessageElement) logoutMessageElement.style.display = 'block';

  try {
    const response = await fetch('https://nrfsi.intalk.cc/dtr/kbrestapitest.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer KBAG456123' // Ensure correct authorization format
      },
      body: JSON.stringify({
        "username": "PP112444",
        "logout": "Yes"
      })
    });

    if (!response.ok) {
      console.error("Logout failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
}

// Handle logout on tab close using sendBeacon
function handleVisibilityChange() {
  if (document.visibilityState === 'hidden' && !isLoggedOut) {
    isLoggedOut = true; // Set the flag to true
    const data = JSON.stringify({
      "username": "PP112444",
      "logout": "Yes"
    });
    navigator.sendBeacon('https://nrfsi.intalk.cc/dtr/kbrestapitest.php', data);
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange);

// Mock form submission
function submitForm() {
  alert("Form submitted!");
}

// Track user activity to reset timer
window.addEventListener('mousemove', resetTimer);
window.addEventListener('keydown', resetTimer);
window.addEventListener('click', resetTimer);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  startCountdown();
  resetTimer();
});
