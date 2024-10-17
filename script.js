const sessionsData = [
    {
        title: "Find a Quiet Space",
        description: "Sit or lie down comfortably in a quiet room. Make sure you won’t be disturbed for the next hour. Dim the lights or close your eyes to reduce external distractions.",
        duration: 5 * 60, // Default duration in seconds
        minDur: 5 * 60,   // Minimum duration in seconds
        maxDur: 10 * 60,  // Maximum duration in seconds
        audios: [
            { src: "audio/1.mp3" }
        ],
        skipped: false
    },
    {
        title: "Progressive Muscle Relaxation",
        description: "Focus on each part of your body, tensing the muscles for 5 seconds, and then slowly releasing the tension. Start with your toes and work your way up to your head: Toes and feet, Calves, Thighs, Stomach, Chest, Arms and hands, Neck and face. Feel the release of tension as you progress through your body, letting go of all stress.",
        duration: 10 * 60,
        minDur: 5 * 60,
        maxDur: 15 * 60,
        audios: [
            { src: "audio/2.mp3" }
        ],
        skipped: false
    },
    {
        title: "Deep Breathing",
        description: "Breathe deeply into your belly, inhaling for a count of 4, holding for 4, and exhaling for 6. Focus on the breath, feeling it fill your lungs and then leave your body slowly. Repeat for 5 minutes, keeping your focus on the rhythm of your breath.",
        duration: 5 * 60,
        minDur: 5 * 60,
        maxDur: 10 * 60,
        audios: [
            { src: "audio/3.mp3" }
        ],
        skipped: false
    },
    {
        title: "Visualization: A Safe Place",
        description: "Imagine yourself in a place where you feel completely safe and at peace—this could be a beach, a forest, a room you love, or somewhere in nature. Picture every detail: the colors, the smells, the sounds. Feel yourself completely immersed in this space. Let go of any thoughts, worries, or distractions and simply focus on the sense of peace in this environment. Stay in this space for 10-15 minutes.",
        duration: 15 * 60,
        minDur: 10 * 60,
        maxDur: 20 * 60,
        audios: [
            { src: "audio/4.mp3" }
        ],
        skipped: false
    },
    {
        title: "Mindfulness Body Scan",
        description: "Bring your attention back to your body. Slowly scan through it, starting from your feet and working your way up, bringing awareness to each part. Notice any sensations, tension, or relaxation. As you move through your body, let go of any remaining stress. Breathe deeply and relax into the sensation of being fully present in your body.",
        duration: 15 * 60,
        minDur: 10 * 60,
        maxDur: 20 * 60,
        audios: [
            { src: "audio/5.mp3" }
        ],
        skipped: false
    },
    {
        title: "Gratitude Reflection",
        description: "Reflect on three things you're grateful for right now. They can be simple—like having time to reset—or something more significant in your life. Take a few minutes to fully appreciate each one, allowing feelings of gratitude to wash over you. This practice helps shift your mindset from stress to positivity and reminds you of the good in your life.",
        duration: 10 * 60,
        minDur: 5 * 60,
        maxDur: 15 * 60,
        audios: [
            { src: "audio/6.mp3" }
        ],
        skipped: false
    },
    {
        title: "Closing",
        description: "Slowly bring yourself back to the present moment. Wiggle your fingers and toes, open your eyes, and take a few deep breaths. Take a moment to notice how you feel—more centered, more at peace. Carry this sense of calm and focus into your next task.",
        duration: 5 * 60,
        minDur: 5 * 60,
        maxDur: 10 * 60,
        audios: [
            { src: "audio/7.mp3" }
        ],
        skipped: false
    }
];

let totalTimeSpent = 0;
let currentSessionIndex = 0;
let backgroundAudio = null;
let sessionAudio = null;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    const sessionsContainer = document.getElementById('sessions');

    sessionsData.forEach((session, index) => {
        const sessionItem = document.createElement('div');
        sessionItem.classList.add('session-item');

        const title = document.createElement('h3');
        title.textContent = session.title;

        const durationControls = document.createElement('div');
        durationControls.classList.add('duration-controls');

        const durationLabel = document.createElement('label');
        durationLabel.textContent = `Duration (${session.minDur / 60}-${session.maxDur / 60} min):`;

        const durationSlider = document.createElement('input');
        durationSlider.type = 'range';
        durationSlider.min = session.minDur / 60;
        durationSlider.max = session.maxDur / 60;
        durationSlider.value = session.duration / 60;
        durationSlider.step = 1;
        durationSlider.classList.add('duration-slider');
        durationSlider.dataset.index = index;

        const durationValue = document.createElement('span');
        durationValue.classList.add('duration-value');
        durationValue.textContent = `${durationSlider.value} min`;

        durationSlider.addEventListener('input', function() {
            durationValue.textContent = `${durationSlider.value} min`;
            sessionsData[index].duration = parseInt(durationSlider.value) * 60;
        });

        durationControls.appendChild(durationLabel);
        durationControls.appendChild(durationSlider);
        durationControls.appendChild(durationValue);

        // Skip Toggle
        const skipToggle = document.createElement('div');
        skipToggle.classList.add('skip-toggle');

        const skipInput = document.createElement('input');
        skipInput.type = 'checkbox';
        skipInput.id = `skip-${index}`;
        skipInput.dataset.index = index;

        skipInput.addEventListener('change', function() {
            sessionsData[index].skipped = skipInput.checked;
        });

        const skipLabel = document.createElement('label');
        skipLabel.htmlFor = `skip-${index}`;
        skipLabel.textContent = 'Skip this';

        skipToggle.appendChild(skipInput);
        skipToggle.appendChild(skipLabel);

        sessionItem.appendChild(title);
        sessionItem.appendChild(durationControls);
        sessionItem.appendChild(skipToggle);

        sessionsContainer.appendChild(sessionItem);
    });

    const proceedButton = document.getElementById('proceed-button');
    proceedButton.addEventListener('click', startMeditation);
})

function startMeditation() {
    document.getElementById('session-setup').style.display = 'none';
    document.getElementById('meditation-session').style.display = 'block';
    startBackgroundSound();
    startSession();
}

function startBackgroundSound() {
    backgroundAudio = new Audio('audio/bgsound.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.5; // Adjust volume as needed
    backgroundAudio.play();
}

function startSession() {
    if (currentSessionIndex >= sessionsData.length) {
        endMeditation();
        return;
    }

    const session = sessionsData[currentSessionIndex];

    if (session.skipped) {
        currentSessionIndex++;
        startSession();
        return;
    }

    const currentTitle = document.getElementById('current-title');
    const currentDescription = document.getElementById('current-description');
    const timeRemaining = document.getElementById('time-remaining');
    const endSessionButton = document.getElementById('end-session-button');

    currentTitle.textContent = session.title;
    currentDescription.textContent = session.description;
    timeRemaining.textContent = formatTime(session.duration);

    // Play session audio over background sound
    sessionAudio = new Audio(session.audios[0].src);
    sessionAudio.play();

    let timeLeft = session.duration;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeRemaining.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            sessionAudio.pause();
            totalTimeSpent += session.duration;
            currentSessionIndex++;
            startSession();
        }
    }, 1000);

    // Handle End Session Button
    endSessionButton.onclick = function() {
        clearInterval(timerInterval);
        if (sessionAudio) sessionAudio.pause();
        if (backgroundAudio) backgroundAudio.pause();
        endMeditation();
    };
}

function endMeditation() {
    if (backgroundAudio) backgroundAudio.pause();
    if (sessionAudio) sessionAudio.pause();
    clearInterval(timerInterval);

    document.getElementById('meditation-session').style.display = 'none';
    document.getElementById('report').style.display = 'block';

    const reportContent = document.getElementById('report-content');
    const completedSessions = sessionsData.filter(session => !session.skipped).length;
    reportContent.innerHTML = `
        <p>You have completed the meditation session.</p>
        <p>Total time spent: ${Math.floor(totalTimeSpent / 60)} minutes.</p>
        <p>Sessions done: ${completedSessions} out of ${sessionsData.length}</p>
    `;

    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', function() {
        location.reload();
    });
}

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    if (secs < 10) secs = '0' + secs;
    return `${mins}:${secs}`;
}
