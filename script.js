// ==================== Dummy Data ====================
const dummyData = [
    {
        id: 1,
        datetime: "2026-01-14 08:30:15",
        name: "สมชาย ใจดี",
        duration: "2:00",
        avgForce: 485,
        avgRhythm: 108,
        score: 92,
        status: "รอด"
    },
    {
        id: 2,
        datetime: "2026-01-14 09:15:42",
        name: "สมหญิง มีสุข",
        duration: "2:00",
        avgForce: 512,
        avgRhythm: 115,
        score: 88,
        status: "รอด"
    },
    {
        id: 3,
        datetime: "2026-01-14 10:05:28",
        name: "วิชัย สุขสันต์",
        duration: "1:45",
        avgForce: 398,
        avgRhythm: 95,
        score: 58,
        status: "ไม่รอด"
    },
    {
        id: 4,
        datetime: "2026-01-14 10:45:10",
        name: "กนกวรรณ แสงจันทร์",
        duration: "2:00",
        avgForce: 525,
        avgRhythm: 112,
        score: 95,
        status: "รอด"
    },
    {
        id: 5,
        datetime: "2026-01-14 11:20:35",
        name: "ประยุทธ์ วงศ์ษา",
        duration: "1:30",
        avgForce: 445,
        avgRhythm: 88,
        score: 65,
        status: "ไม่รอด"
    },
    {
        id: 6,
        datetime: "2026-01-14 12:10:50",
        name: "อรวรรณ ทองดี",
        duration: "2:00",
        avgForce: 498,
        avgRhythm: 105,
        score: 85,
        status: "รอด"
    },
    {
        id: 7,
        datetime: "2026-01-14 13:30:22",
        name: "สุรชัย ปานกลาง",
        duration: "1:50",
        avgForce: 420,
        avgRhythm: 98,
        score: 72,
        status: "รอด"
    },
    {
        id: 8,
        datetime: "2026-01-14 14:15:18",
        name: "นภัสวรรณ สมบูรณ์",
        duration: "2:00",
        avgForce: 535,
        avgRhythm: 118,
        score: 97,
        status: "รอด"
    },
    {
        id: 9,
        datetime: "2026-01-14 14:50:45",
        name: "จักรพงษ์ วัฒนา",
        duration: "1:20",
        avgForce: 385,
        avgRhythm: 85,
        score: 52,
        status: "ไม่รอด"
    },
    {
        id: 10,
        datetime: "2026-01-14 15:25:33",
        name: "ปิยะนุช ศรีสุข",
        duration: "2:00",
        avgForce: 505,
        avgRhythm: 110,
        score: 90,
        status: "รอด"
    },
    {
        id: 11,
        datetime: "2026-01-14 16:00:12",
        name: "ธนากร พัฒนกิจ",
        duration: "1:55",
        avgForce: 468,
        avgRhythm: 102,
        score: 78,
        status: "รอด"
    },
    {
        id: 12,
        datetime: "2026-01-14 16:40:28",
        name: "รัตนา มั่นคง",
        duration: "2:00",
        avgForce: 515,
        avgRhythm: 113,
        score: 93,
        status: "รอด"
    },
    {
        id: 13,
        datetime: "2026-01-14 17:15:55",
        name: "อนุรักษ์ บุญมี",
        duration: "1:35",
        avgForce: 410,
        avgRhythm: 92,
        score: 62,
        status: "ไม่รอด"
    },
    {
        id: 14,
        datetime: "2026-01-14 18:00:40",
        name: "พัชรินทร์ สว่างชัย",
        duration: "2:00",
        avgForce: 492,
        avgRhythm: 107,
        score: 87,
        status: "รอด"
    },
    {
        id: 15,
        datetime: "2026-01-14 18:45:20",
        name: "เกรียงไกร เจริญสุข",
        duration: "1:40",
        avgForce: 430,
        avgRhythm: 96,
        score: 68,
        status: "ไม่รอด"
    }
];

let currentData = [...dummyData];

// ==================== Initialize on Page Load ====================
document.addEventListener('DOMContentLoaded', function () {
    updateStatistics();
    renderTable();
    initializeCharts();
});

// ==================== Statistics Calculation ====================
function updateStatistics() {
    const totalTests = currentData.length;
    const passCount = currentData.filter(d => d.status === "รอด").length;
    const failCount = totalTests - passCount;
    const passRate = ((passCount / totalTests) * 100).toFixed(1);
    const failRate = ((failCount / totalTests) * 100).toFixed(1);
    const avgScore = (currentData.reduce((sum, d) => sum + d.score, 0) / totalTests).toFixed(1);

    document.getElementById('totalTests').textContent = totalTests;
    document.getElementById('passCount').textContent = passCount;
    document.getElementById('failCount').textContent = failCount;
    document.getElementById('passRate').textContent = passRate + '%';
    document.getElementById('failRate').textContent = failRate + '%';
    document.getElementById('avgScore').textContent = avgScore;
}

// ==================== Render Table ====================
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    currentData.forEach(record => {
        const tr = document.createElement('tr');

        const scoreClass = getScoreClass(record.score);
        const statusClass = record.status === "รอด" ? "status-pass" : "status-fail";

        tr.innerHTML = `
            <td>${record.id}</td>
            <td>${record.datetime}</td>
            <td><strong>${record.name}</strong></td>
            <td>${record.duration} นาที</td>
            <td>${record.avgForce} N</td>
            <td>${record.avgRhythm} ครั้ง/นาที</td>
            <td class="score-cell ${scoreClass}">${record.score}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
        `;

        tbody.appendChild(tr);
    });
}

function getScoreClass(score) {
    if (score >= 90) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-average';
    return 'score-poor';
}

// ==================== Charts ====================
let scoreChart, passFailChart;

function initializeCharts() {
    // Score Trend Chart
    const scoreCtx = document.getElementById('scoreChart').getContext('2d');
    scoreChart = new Chart(scoreCtx, {
        type: 'line',
        data: {
            labels: currentData.map(d => d.name),
            datasets: [{
                label: 'คะแนนการทดสอบ',
                data: currentData.map(d => d.score),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#000000',
                        font: {
                            family: 'Noto Sans Thai',
                            size: 14,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        family: 'Noto Sans Thai',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Noto Sans Thai',
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#000000',
                        font: {
                            family: 'Noto Sans Thai',
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#000000',
                        font: {
                            family: 'Noto Sans Thai',
                            size: 11,
                            weight: '600'
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        }
    });

    // Pass/Fail Pie Chart
    const passFailCtx = document.getElementById('passFailChart').getContext('2d');
    const passCount = currentData.filter(d => d.status === "รอด").length;
    const failCount = currentData.length - passCount;

    passFailChart = new Chart(passFailCtx, {
        type: 'doughnut',
        data: {
            labels: ['รอด', 'ไม่รอด'],
            datasets: [{
                data: [passCount, failCount],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#000000',
                        font: {
                            family: 'Noto Sans Thai',
                            size: 14,
                            weight: '600'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#06b6d4',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        family: 'Noto Sans Thai',
                        size: 14
                    },
                    bodyFont: {
                        family: 'Noto Sans Thai',
                        size: 13
                    },
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} คน (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==================== Filter Data ====================
function filterData() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    currentData = dummyData.filter(record => {
        const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
        const matchesSearch = record.name.toLowerCase().includes(searchInput);
        return matchesStatus && matchesSearch;
    });

    updateStatistics();
    renderTable();
    updateCharts();
}

// ==================== Sort Data ====================
function sortData() {
    const sortBy = document.getElementById('sortBy').value;

    switch (sortBy) {
        case 'date-desc':
            currentData.sort((a, b) => b.id - a.id);
            break;
        case 'date-asc':
            currentData.sort((a, b) => a.id - b.id);
            break;
        case 'score-desc':
            currentData.sort((a, b) => b.score - a.score);
            break;
        case 'score-asc':
            currentData.sort((a, b) => a.score - b.score);
            break;
        case 'name-asc':
            currentData.sort((a, b) => a.name.localeCompare(b.name, 'th'));
            break;
    }

    renderTable();
    updateCharts();
}

// ==================== Update Charts ====================
function updateCharts() {
    // Update Score Chart
    scoreChart.data.labels = currentData.map(d => d.name);
    scoreChart.data.datasets[0].data = currentData.map(d => d.score);
    scoreChart.update();

    // Update Pass/Fail Chart
    const passCount = currentData.filter(d => d.status === "รอด").length;
    const failCount = currentData.length - passCount;
    passFailChart.data.datasets[0].data = [passCount, failCount];
    passFailChart.update();
}

// ==================== Export to CSV ====================
function exportData() {
    const headers = ['ID', 'วันที่-เวลา', 'ชื่อผู้ทดสอบ', 'เวลาที่ใช้ฝึก', 'เฉลี่ยแรงกด (N)', 'จังหวะ (ครั้ง/นาที)', 'คะแนน', 'สถานะ'];

    const csvContent = [
        headers.join(','),
        ...currentData.map(record => [
            record.id,
            record.datetime,
            record.name,
            record.duration,
            record.avgForce,
            record.avgRhythm,
            record.score,
            record.status
        ].join(','))
    ].join('\n');

    // Add BOM for Thai characters
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `CPR_Training_Data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ==================== Refresh Data ====================
function refreshData() {
    currentData = [...dummyData];
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortBy').value = 'date-desc';

    updateStatistics();
    renderTable();
    updateCharts();

    // Animation feedback
    const btn = event.target.closest('button');
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 600);
}

// ==================== New Test Modal Functions ====================
function showNewTestModal() {
    const modal = document.getElementById('newTestModal');
    modal.classList.add('active');

    // Reset form
    document.getElementById('newTestForm').reset();
}

function closeNewTestModal() {
    const modal = document.getElementById('newTestModal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    const modal = document.getElementById('newTestModal');
    if (event.target === modal) {
        closeNewTestModal();
    }
});

// ==================== Handle New Test Form Submission ====================
function handleNewTest(event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const patientCondition = document.getElementById('patientCondition').value;
    const difficultyLevel = document.getElementById('difficultyLevel').value;

    // Close modal
    closeNewTestModal();

    // Redirect to scenario page with parameters
    const params = new URLSearchParams({
        name: studentName,
        scenario: patientCondition,
        difficulty: difficultyLevel
    });

    window.location.href = `scenario.html?${params.toString()}`;

    // Log for debugging
    console.log('Starting new test:', {
        studentName,
        patientCondition,
        difficultyLevel
    });
}
