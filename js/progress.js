/***********************************
  ADVANCED PROGRESS TRACKER
***********************************/

// Redirect to dashboard
function goDashboard() {
    window.location = "dashboard.html";
}

// Get current user
let loginUser = localStorage.getItem("loginUser");
if (!loginUser) window.location = "index.html";

// Get topics and completed topics
let topics = JSON.parse(localStorage.getItem("topics")) || [];
let completed = JSON.parse(localStorage.getItem("completed")) || [];

const progressList = document.getElementById("progressList");

// Load topics with progress
function loadProgress() {
    progressList.innerHTML = "";

    if (topics.length === 0) {
        progressList.innerHTML = "<p>No topics added yet!</p>";
        return;
    }

    topics.forEach(t => {
        let done = completed.includes(t) ? 1 : 0;

        // Topic Box
        let topicDiv = document.createElement("div");
        topicDiv.classList.add("topic-progress-box");
        topicDiv.innerHTML = `
            <h3>${t}</h3>
            <div class="progress-wrapper-small">
                <svg class="progress-ring" width="80" height="80">
                    <circle class="progress-ring__circle" stroke="#2563eb" stroke-width="6" fill="transparent" r="36" cx="40" cy="40"/>
                </svg>
                <div class="progress-text-small">${done ? "100%" : "0%"}</div>
            </div>
            <button onclick="markComplete('${t}')">${done ? "Completed" : "Mark Complete"}</button>
        `;
        progressList.appendChild(topicDiv);

        // Set initial progress
        let percent = done ? 100 : 0;
        const circle = topicDiv.querySelector(".progress-ring__circle");
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        topicDiv.querySelector(".progress-text-small").innerText = percent + "%";
    });
}

// Mark a topic as completed
function markComplete(t) {
    if (!completed.includes(t)) {
        completed.push(t);
        localStorage.setItem("completed", JSON.stringify(completed));
    }
    loadProgress();
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    loadProgress();
});