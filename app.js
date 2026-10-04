/* ---------------- Search ---------------- */

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    window.location.href =
        "https://www.google.com/search?q=" +
        encodeURIComponent(query);
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "/" &&
        document.activeElement !== searchInput
    ) {
        event.preventDefault();
        searchInput.focus();
    }
});

/* ---------------- Top status ---------------- */

const focusValue = document.getElementById("focusValue");
let focusSeconds = Number(localStorage.getItem("focusSeconds") || 0);

function renderFocus() {
    const minutes = Math.floor(focusSeconds / 60);
    focusValue.textContent = `${minutes}m`;
}

renderFocus();

function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

    const day = now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
    });

    document.getElementById("timeValue").textContent = time;
    document.getElementById("dayLabel").textContent = day;
}

updateClock();
setInterval(updateClock, 1000);

/* ---------------- Tabs ---------------- */

const tabs = document.querySelectorAll(".tab");
const homeView = document.getElementById("homeView");
const projectsView = document.getElementById("projectsView");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const view = tab.dataset.view;
        homeView.style.display = view === "home" ? "block" : "none";
        projectsView.classList.toggle("active", view === "projects");
    });
});

/* ---------------- Calendar ---------------- */

const monthTitle = document.getElementById("monthTitle");
const calendarDays = document.getElementById("calendarDays");

let calendarDate = new Date();

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthTitle.textContent = new Date(year, month, 1).toLocaleDateString([], {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({
            day: prevLastDate - i,
            muted: true
        });
    }

    for (let day = 1; day <= lastDate; day++) {
        cells.push({
            day,
            muted: false
        });
    }

    while (cells.length % 7 !== 0) {
        cells.push({
            day: cells.length - lastDate - firstDay + 1,
            muted: true
        });
    }

    calendarDays.innerHTML = "";

    cells.forEach((cell) => {
        const el = document.createElement("div");
        el.className = "day" + (cell.muted ? " muted" : "");

        if (
            !cell.muted &&
            cell.day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear()
        ) {
            el.classList.add("today");
        }

        el.textContent = cell.day;
        calendarDays.appendChild(el);
    });
}

document.getElementById("prevMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

/* ---------------- Pomodoro ---------------- */

const timerDisplay = document.getElementById("timer");
const startTimer = document.getElementById("startTimer");
const resetTimer = document.getElementById("resetTimer");
const skipTimer = document.getElementById("skipTimer");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const pomoTabs = document.querySelectorAll(".pomo-tab");

let selectedMinutes = 25;
let remainingSeconds = selectedMinutes * 60;
let timerId = null;
let focusRunningSeconds = 0;

function renderTimer() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    timerDisplay.textContent =
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setPlaying(playing) {
    playIcon.style.display = playing ? "none" : "block";
    pauseIcon.style.display = playing ? "block" : "none";
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
    setPlaying(false);
}

function startOrPause() {
    if (timerId) {
        stopTimer();
        return;
    }

    timerId = setInterval(() => {
        remainingSeconds--;

        if (selectedMinutes === 25) {
            focusRunningSeconds++;
            focusSeconds++;
            localStorage.setItem("focusSeconds", String(focusSeconds));
            renderFocus();
        }

        if (remainingSeconds <= 0) {
            remainingSeconds = selectedMinutes * 60;
            stopTimer();
        }

        renderTimer();
    }, 1000);

    setPlaying(true);
}

function resetCurrentTimer() {
    stopTimer();
    remainingSeconds = selectedMinutes * 60;
    renderTimer();
}

function changeMode(minutes, button) {
    selectedMinutes = minutes;

    pomoTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    resetCurrentTimer();
}

pomoTabs.forEach((button) => {
    button.addEventListener("click", () => {
        changeMode(Number(button.dataset.minutes), button);
    });
});

startTimer.addEventListener("click", startOrPause);
resetTimer.addEventListener("click", resetCurrentTimer);

skipTimer.addEventListener("click", () => {
    remainingSeconds = 0;
    stopTimer();
    renderTimer();
});

renderTimer();

/* ---------------- Buttons ---------------- */

document.getElementById("addProject").addEventListener("click", () => {
    alert("You can add more tabs later by editing the project section.");
});

document.getElementById("menuButton").addEventListener("click", () => {
    document.querySelector(".page").classList.toggle("menu-open");
});

document.getElementById("settingsButton").addEventListener("click", () => {
    alert(
        "Settings are kept simple for now. Edit the categories, links, accent color and wallpaper path directly in index.html."
    );
});
