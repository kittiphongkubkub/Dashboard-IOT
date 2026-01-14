// CPR Training System - Main Logic
// ระบบการฝึกปั้มหัวใจ CPR

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const studentName = urlParams.get('name') || 'ไม่ระบุ';
const scenario = urlParams.get('scenario') || 'ทั่วไป';
const difficulty = urlParams.get('difficulty') || 'beginner';

// Training state
let isRunning = true;
let isPaused = false;
let soundEnabled = false;
let startTime = Date.now();
let elapsedSeconds = 0;
let timerInterval;

// Compression tracking
let compressionCount = 0;
let currentSet = 0;
let cycleNumber = 1;
let lastCompressionTime = null;
let compressionTimes = [];
let depthValues = [];

// BPM calculation
let currentBPM = 0;
let bpmHistory = [];

// Audio context for metronome
let audioContext = null;
let metronomeTick = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    startTimer();
    setupKeyboardControls();
});

function initializePage() {
    // Display session info
    document.getElementById('studentName').textContent = studentName;
    document.getElementById('scenarioType').textContent = scenario;
    document.getElementById('difficultyLevel').textContent =
        difficulty === 'beginner' ? 'เริ่มต้น (ระดับ 2 ขวบ)' : 'ขั้นสูง (ระดับ 4 ขวบ)';
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused && isRunning) {
            elapsedSeconds++;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

function simulateCompression() {
    if (isPaused || !isRunning) return;

    compressionCount++;
    currentSet++;

    // Animate heart
    animateHeart();

    // Calculate BPM
    const now = Date.now();
    if (lastCompressionTime) {
        const interval = now - lastCompressionTime;
        currentBPM = Math.round(60000 / interval); // Convert to BPM
        bpmHistory.push(currentBPM);
        compressionTimes.push(interval);

        // Keep only last 10 compressions for average
        if (bpmHistory.length > 10) {
            bpmHistory.shift();
            compressionTimes.shift();
        }
    }
    lastCompressionTime = now;

    // Simulate depth (random between 4-7cm for testing)
    const depth = (Math.random() * 3 + 4).toFixed(1);
    depthValues.push(parseFloat(depth));
    if (depthValues.length > 10) {
        depthValues.shift();
    }

    // Check if set is complete (30 compressions)
    if (currentSet >= 30) {
        currentSet = 0;
        cycleNumber++;
    }

    // Update UI
    updateMetrics();

    // Play sound if enabled
    if (soundEnabled) {
        playMetronomeSound();
    }
}

function animateHeart() {
    const heart = document.getElementById('heartIcon');
    const animation = document.querySelector('.cpr-animation');

    // Add compress class
    heart.classList.add('compress');

    // Create wave effect
    const wave = document.createElement('div');
    wave.className = 'compression-wave';
    animation.appendChild(wave);

    // Remove after animation
    setTimeout(() => {
        heart.classList.remove('compress');
    }, 150);

    setTimeout(() => {
        wave.remove();
    }, 1000);
}

function updateMetrics() {
    // Update compression counter
    document.getElementById('compressionCount').textContent = compressionCount;
    document.getElementById('currentSet').textContent = currentSet;
    document.getElementById('cycleNumber').textContent = cycleNumber;

    // Update progress bar (30 compressions per set)
    const progress = (currentSet / 30) * 100;
    document.getElementById('compressionProgress').style.width = progress + '%';

    // Update compression status
    const compressionStatus = document.getElementById('compressionStatus');
    if (compressionCount === 0) {
        compressionStatus.textContent = 'เริ่มต้น';
        compressionStatus.className = 'metric-status status-good';
    } else if (currentSet < 10) {
        compressionStatus.textContent = '✅ เริ่มต้นดี';
        compressionStatus.className = 'metric-status status-good';
    } else if (currentSet < 20) {
        compressionStatus.textContent = '✅ ทำได้ดี';
        compressionStatus.className = 'metric-status status-good';
    } else {
        compressionStatus.textContent = '⚡ ใกล้ครบรอบ';
        compressionStatus.className = 'metric-status status-warning';
    }

    // Update BPM
    const avgBPM = bpmHistory.length > 0
        ? Math.round(bpmHistory.reduce((a, b) => a + b, 0) / bpmHistory.length)
        : currentBPM;

    document.getElementById('bpmValue').textContent = avgBPM + ' BPM';

    const bpmStatus = document.getElementById('bpmStatus');
    if (compressionCount === 0) {
        bpmStatus.textContent = 'รอการกด';
        bpmStatus.className = 'metric-status status-good';
    } else if (avgBPM >= 100 && avgBPM <= 120) {
        bpmStatus.textContent = '✅ จังหวะดีมาก';
        bpmStatus.className = 'metric-status status-good';
    } else if (avgBPM >= 90 && avgBPM < 100) {
        bpmStatus.textContent = '⚠️ ช้าไป เพิ่มความถี่';
        bpmStatus.className = 'metric-status status-warning';
    } else if (avgBPM > 120 && avgBPM <= 130) {
        bpmStatus.textContent = '⚠️ เร็วไป ลดความถี่';
        bpmStatus.className = 'metric-status status-warning';
    } else if (avgBPM > 130) {
        bpmStatus.textContent = '❌ เร็วเกินไป!';
        bpmStatus.className = 'metric-status status-danger';
    } else {
        bpmStatus.textContent = '❌ ช้าเกินไป!';
        bpmStatus.className = 'metric-status status-danger';
    }

    // Update depth
    const avgDepth = depthValues.length > 0
        ? (depthValues.reduce((a, b) => a + b, 0) / depthValues.length).toFixed(1)
        : 0;

    document.getElementById('depthValue').textContent = avgDepth + ' cm';

    const depthProgress = Math.min((avgDepth / 6) * 100, 100);
    document.getElementById('depthProgress').style.width = depthProgress + '%';

    const depthStatus = document.getElementById('depthStatus');
    if (compressionCount === 0) {
        depthStatus.textContent = 'รอการกด';
        depthStatus.className = 'metric-status status-good';
    } else if (avgDepth >= 5 && avgDepth <= 6) {
        depthStatus.textContent = '✅ ความลึกพอดี';
        depthStatus.className = 'metric-status status-good';
    } else if (avgDepth >= 4 && avgDepth < 5) {
        depthStatus.textContent = '⚠️ ตื้นไป เพิ่มแรง';
        depthStatus.className = 'metric-status status-warning';
    } else if (avgDepth > 6 && avgDepth <= 7) {
        depthStatus.textContent = '⚠️ ลึกไป ลดแรง';
        depthStatus.className = 'metric-status status-warning';
    } else if (avgDepth > 7) {
        depthStatus.textContent = '❌ ลึกเกินไป!';
        depthStatus.className = 'metric-status status-danger';
    } else {
        depthStatus.textContent = '❌ ตื้นเกินไป!';
        depthStatus.className = 'metric-status status-danger';
    }
}

function togglePause() {
    isPaused = !isPaused;
    const pauseIcon = document.getElementById('pauseIcon');
    const pauseText = document.getElementById('pauseText');

    if (isPaused) {
        pauseIcon.textContent = '▶️';
        pauseText.textContent = 'เล่นต่อ';
    } else {
        pauseIcon.textContent = '⏸️';
        pauseText.textContent = 'หยุดชั่วคราว';
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('soundIcon');

    if (soundEnabled) {
        soundIcon.textContent = '🔊';
        initAudioContext();
    } else {
        soundIcon.textContent = '🔇';
    }
}

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playMetronomeSound() {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function finishTraining() {
    isRunning = false;
    clearInterval(timerInterval);
    showSummary();
}

function showSummary() {
    const modal = document.getElementById('summaryModal');

    // Calculate statistics
    const avgBPM = bpmHistory.length > 0
        ? Math.round(bpmHistory.reduce((a, b) => a + b, 0) / bpmHistory.length)
        : 0;

    const avgDepth = depthValues.length > 0
        ? (depthValues.reduce((a, b) => a + b, 0) / depthValues.length).toFixed(1)
        : 0;

    // Calculate consistency score (based on variance)
    const consistency = calculateConsistency();

    // Calculate performance rating
    const rating = calculatePerformanceRating(avgBPM, avgDepth, consistency, elapsedSeconds);

    // Update summary
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    document.getElementById('summaryTime').textContent =
        `${minutes} นาที ${seconds} วินาที`;

    document.getElementById('summaryCompressions').textContent =
        `${compressionCount} ครั้ง`;

    document.getElementById('summaryBPM').textContent =
        `${avgBPM} BPM ${avgBPM >= 100 && avgBPM <= 120 ? '✅' : '⚠️'}`;

    document.getElementById('summaryDepth').textContent =
        `${avgDepth} cm ${avgDepth >= 5 && avgDepth <= 6 ? '✅' : '⚠️'}`;

    document.getElementById('summaryConsistency').textContent =
        `${consistency}%`;

    // Display rating
    displayRating(rating);

    modal.classList.add('active');
}

function calculateConsistency() {
    if (compressionTimes.length < 2) return 100;

    const avg = compressionTimes.reduce((a, b) => a + b, 0) / compressionTimes.length;
    const variance = compressionTimes.reduce((sum, val) =>
        sum + Math.pow(val - avg, 2), 0) / compressionTimes.length;
    const stdDev = Math.sqrt(variance);

    // Convert to percentage (lower variance = higher consistency)
    const consistency = Math.max(0, 100 - (stdDev / avg * 100));
    return Math.round(consistency);
}

function calculatePerformanceRating(bpm, depth, consistency, time) {
    let score = 0;

    // BPM score (30 points)
    if (bpm >= 100 && bpm <= 120) score += 30;
    else if (bpm >= 90 && bpm <= 130) score += 20;
    else score += 10;

    // Depth score (30 points)
    if (depth >= 5 && depth <= 6) score += 30;
    else if (depth >= 4 && depth <= 7) score += 20;
    else score += 10;

    // Consistency score (20 points)
    score += consistency * 0.2;

    // Time score (20 points) - at least 2 minutes
    if (time >= 120) score += 20;
    else score += (time / 120) * 20;

    return Math.round(score);
}

function displayRating(score) {
    const ratingEl = document.getElementById('performanceRating');
    const textEl = document.getElementById('performanceText');

    if (score >= 90) {
        ratingEl.textContent = '⭐⭐⭐⭐⭐';
        textEl.textContent = 'ผลการปฏิบัติ: ดีเยี่ยม!';
        textEl.style.color = '#22c55e';
    } else if (score >= 75) {
        ratingEl.textContent = '⭐⭐⭐⭐';
        textEl.textContent = 'ผลการปฏิบัติ: ดีมาก';
        textEl.style.color = '#22c55e';
    } else if (score >= 60) {
        ratingEl.textContent = '⭐⭐⭐';
        textEl.textContent = 'ผลการปฏิบัติ: ดี';
        textEl.style.color = '#eab308';
    } else if (score >= 40) {
        ratingEl.textContent = '⭐⭐';
        textEl.textContent = 'ผลการปฏิบัติ: พอใช้';
        textEl.style.color = '#eab308';
    } else {
        ratingEl.textContent = '⭐';
        textEl.textContent = 'ผลการปฏิบัติ: ควรฝึกฝนเพิ่มเติม';
        textEl.style.color = '#ef4444';
    }
}

function closeSummary() {
    document.getElementById('summaryModal').classList.remove('active');
    isRunning = true;
    isPaused = false;
    startTimer();
}

function backToDashboard() {
    window.location.href = 'index.html';
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // Prevent default if it's one of our control keys
        if (['Space', 'KeyP', 'KeyF'].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case 'Space':
                simulateCompression();
                break;
            case 'KeyP':
                togglePause();
                break;
            case 'KeyF':
                finishTraining();
                break;
        }
    });
}

// Allow clicking heart to compress (for touch/mouse input)
document.addEventListener('DOMContentLoaded', () => {
    const heart = document.getElementById('heartIcon');
    if (heart) {
        heart.style.cursor = 'pointer';
        heart.addEventListener('click', simulateCompression);
    }
});
