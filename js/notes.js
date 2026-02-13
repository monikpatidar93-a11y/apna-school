/***********************************
  SIMPLE NOTES SYSTEM
***********************************/

// Redirect to dashboard
function goDashboard() {
    window.location = "dashboard.html";
}

// Get current user
let loginUser = localStorage.getItem("loginUser");
if (!loginUser) window.location = "index.html";

// Topics
let topics = JSON.parse(localStorage.getItem("topics")) || [];
let currentNotesTopic = null;

const notesTopic = document.getElementById("notesTopic");
const notesEditor = document.getElementById("notesEditor");

// Load topics into dropdown
function loadTopicsDropdown() {
    notesTopic.innerHTML = "";
    topics.forEach(t => {
        let opt = document.createElement("option");
        opt.value = t;
        opt.innerText = t;
        notesTopic.appendChild(opt);
    });
    if (topics.length > 0) {
        currentNotesTopic = topics[0];
        notesTopic.value = currentNotesTopic;
        loadNotes();
    }
}

// Load notes for selected topic
function loadNotes() {
    currentNotesTopic = notesTopic.value;
    notesEditor.value = localStorage.getItem("note_" + currentNotesTopic) || "";
}

// Save notes
function saveNotes() {
    if (!currentNotesTopic) { alert("Select a topic first"); return; }
    localStorage.setItem("note_" + currentNotesTopic, notesEditor.value);
    alert("Notes saved!");
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    loadTopicsDropdown();
});