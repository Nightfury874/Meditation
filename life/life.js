// script.js

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const proceedButton = document.getElementById('proceed-button');
    const customizeButton = document.getElementById('customize-button');
    const placeholderImageContainer = document.getElementById('placeholder-image-container');
    const meditationSession = document.getElementById('meditation-session');
    const endSessionButton = document.getElementById('end-session-button');
    const reportSection = document.getElementById('report');
    const restartButton = document.getElementById('restart-button');

    // Proceed Button Click Handler
    proceedButton.addEventListener('click', () => {
        // Hide the placeholder image and buttons
        placeholderImageContainer.classList.add('hidden');
        proceedButton.classList.add('hidden');
        customizeButton.classList.add('hidden');

        // Show the meditation session
        meditationSession.classList.remove('hidden');

        // Optionally, start a timer for the meditation session
        startMeditationTimer(10 * 60); // 10 minutes in seconds
    });

    // End Session Button Click Handler
    endSessionButton.addEventListener('click', () => {
        // Hide the meditation session
        meditationSession.classList.add('hidden');

        // Show the report section
        reportSection.classList.remove('hidden');
    });

    // Restart Button Click Handler
    restartButton.addEventListener('click', () => {
        // Hide the report section
        reportSection.classList.add('hidden');

        // Show the placeholder image and buttons again
        placeholderImageContainer.classList.remove('hidden');
        proceedButton.classList.remove('hidden');
        customizeButton.classList.remove('hidden');
    });

    // Function to start the meditation timer
    function startMeditationTimer(duration) {
        const timerDisplay = document.getElementById('time-remaining');
        let timeRemaining = duration;
        const timerInterval = setInterval(() => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
            timeRemaining--;

            if (timeRemaining < 0) {
                clearInterval(timerInterval);
                // Optionally, automatically end the session when the timer reaches zero
                endSessionButton.click();
            }
        }, 1000);
    }

    // Helper function to pad numbers with leading zeros
    function padZero(number) {
        return number < 10 ? `0${number}` : number;
    }
});
