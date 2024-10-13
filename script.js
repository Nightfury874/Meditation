// Define the meditation steps with optional multiple audios
const steps = [
    {
        title: "Find a Quiet Space",
        description: "Sit or lie down comfortably in a quiet room. Make sure you won’t be disturbed for the next hour. Dim the lights or close your eyes to reduce external distractions.",
        duration: 5 * 60, // in seconds
        audios: [
            {
                src: "audio/1.mp3",
                startAt: 0 // Start at the beginning
                // duration: 10 // in seconds (optional, if you want to limit the audio length)
            }
        ]
    },
    {
        title: "Progressive Muscle Relaxation",
        description: "Focus on each part of your body, tensing the muscles for 5 seconds, and then slowly releasing the tension. Start with your toes and work your way up to your head: Toes and feet, Calves, Thighs, Stomach, Chest, Arms and hands, Neck and face. Feel the release of tension as you progress through your body, letting go of all stress.",
        duration: 10 * 60,
        audios: [
            {
                src: "audio/2.mp3",
                startAt: 120 // Start at 2 minutes
                // duration: 100 // Optional: limit to 100 seconds
            }
        ]
    },
    {
        title: "Deep Breathing",
        description: "Breathe deeply into your belly, inhaling for a count of 4, holding for 4, and exhaling for 6. Focus on the breath, feeling it fill your lungs and then leave your body slowly. Repeat for 5 minutes, keeping your focus on the rhythm of your breath.",
        duration: 5 * 60,
        audios: [
            {
                src: "audio/3.mp3",
                startAt: 0
                // duration: 30
            }
        ]
    },
    {
        title: "Visualization: A Safe Place",
        description: "Imagine yourself in a place where you feel completely safe and at peace—this could be a beach, a forest, a room you love, or somewhere in nature. Picture every detail: the colors, the smells, the sounds. Feel yourself completely immersed in this space. Let go of any thoughts, worries, or distractions and simply focus on the sense of peace in this environment. Stay in this space for 10-15 minutes.",
        duration: 15 * 60,
        audios: [
            {
                src: "audio/4.mp3",
                startAt: 300 // Start at 5 minutes
                // duration: 50
            }
        ]
    },
    {
        title: "Mindfulness Body Scan",
        description: "Bring your attention back to your body. Slowly scan through it, starting from your feet and working your way up, bringing awareness to each part. Notice any sensations, tension, or relaxation. As you move through your body, let go of any remaining stress. Breathe deeply and relax into the sensation of being fully present in your body.",
        duration: 15 * 60,
        audios: [
            {
                src: "audio/5.mp3",
                startAt: 600 // Start at 10 minutes
                // duration: 60
            }
        ]
    },
    {
        title: "Gratitude Reflection",
        description: "Reflect on three things you're grateful for right now. They can be simple—like having time to reset—or something more significant in your life. Take a few minutes to fully appreciate each one, allowing feelings of gratitude to wash over you. This practice helps shift your mindset from stress to positivity and reminds you of the good in your life.",
        duration: 10 * 60,
        audios: [
            {
                src: "audio/5.mp3",
                startAt: 0
                // duration: 30
            }
        ]
    },
    {
        title: "Closing",
        description: "Slowly bring yourself back to the present moment. Wiggle your fingers and toes, open your eyes, and take a few deep breaths. Take a moment to notice how you feel—more centered, more at peace. Carry this sense of calm and focus into your next task.",
        duration: 5 * 60,
        audios: [
            {
                src: "audio/5.mp3",
                startAt: 0,
                duration: 30
            }
        ]
    }
];

let currentStep = 0;
let timerInterval = null;
let remainingTime = steps[currentStep].duration;
const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
let elapsedDuration = 0;

const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const progressBar = document.getElementById('progress-bar');

let currentAudio = null;
let audioTimeouts = []; // Array to hold multiple audio timeouts
let audioEndTimeout = null; // Timeout to end current audio

function updateStep() {
    if (currentStep >= steps.length) {
        clearInterval(timerInterval);
        timerInterval = null;
        stepTitle.textContent = "Meditation Complete";
        stepDescription.textContent = "You have completed the Full-Body Grounding Meditation. Take a moment to appreciate the calm and focus you've achieved.";
        timerDisplay.textContent = "00:00";
        progressBar.style.width = "100%";
        stopAllAudios();
        return;
    }
    const step = steps[currentStep];
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.description;
    remainingTime = step.duration;
    timerDisplay.textContent = formatTime(remainingTime);
    // Prepare audios for the new step
    if (step.audios && step.audios.length > 0) {
        prepareAudios(step.audios);
    } else {
        // No audios for this step
        stopAllAudios();
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function prepareAudios(audios) {
    // First, clear any existing audio timeouts
    stopAllAudios();

    audios.forEach(audioConfig => {
        // Schedule each audio
        if (audioConfig.startAt < steps[currentStep].duration) {
            const timeout = setTimeout(() => {
                playAudio(audioConfig);
            }, audioConfig.startAt * 1000);
            audioTimeouts.push(timeout);
        }
    });
}

function playAudio(audioConfig) {
    // Stop current audio if any
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    // Create and play new audio
    currentAudio = new Audio(audioConfig.src);
    currentAudio.play().catch(error => {
        console.error("Error playing audio:", error);
    });

    // If duration is specified, schedule to stop the audio
    if (audioConfig.duration) {
        audioEndTimeout = setTimeout(() => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentAudio = null;
            }
        }, audioConfig.duration * 1000);
    }
}

function stopAllAudios() {
    // Stop current audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    // Clear all audio timeouts
    audioTimeouts.forEach(timeout => clearTimeout(timeout));
    audioTimeouts = [];
    // Clear audio end timeout
    if (audioEndTimeout) {
        clearTimeout(audioEndTimeout);
        audioEndTimeout = null;
    }
}

function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
        remainingTime--;
        elapsedDuration++;
        timerDisplay.textContent = formatTime(remainingTime);
        updateProgressBar();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            stopAllAudios();
            currentStep++;
            updateStep();
            startTimer(); // Automatically start next step
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    // Pause current audio if playing
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
    }
    // Clear all scheduled audio timeouts
    audioTimeouts.forEach(timeout => clearTimeout(timeout));
    audioTimeouts = [];
    // Clear audio end timeout
    if (audioEndTimeout) {
        clearTimeout(audioEndTimeout);
        audioEndTimeout = null;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    // Reset audio
    stopAllAudios();
    currentStep = 0;
    elapsedDuration = 0;
    updateStep();
    progressBar.style.width = "0%";
}

function updateProgressBar() {
    const progressPercent = (elapsedDuration / totalDuration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

startButton.addEventListener('click', () => {
    startTimer();
    timerDisplay.classList.add('active');
});

pauseButton.addEventListener('click', () => {
    pauseTimer();
    timerDisplay.classList.remove('active');
});

resetButton.addEventListener('click', () => {
    resetTimer();
    timerDisplay.classList.remove('active');
});

// Initialize first step
updateStep();
