/* =====================
   GLOBAL VARIABLES
=====================*/

let courses = JSON.parse(localStorage.getItem("courses")) || [
  {name:"HTML", topics:["Introduction","Elements","Forms"], notes:["","<p>HTML Elements Notes</p>","<p>Forms Notes</p>"]},
  {name:"CSS", topics:["Selectors","Flexbox","Grid"], notes:["","<p>Selectors Notes</p>","<p>Flexbox Notes</p>"]},
  {name:"JavaScript", topics:["Variables","Functions","DOM"], notes:["","<p>Variables Notes</p>","<p>Functions Notes</p>"]},
  {name:"Python", topics:["Variables","Loops","Functions"], notes:["","<p>Python Variables Notes</p>","<p>Loops Notes</p>"]}
];

let selectedCourseIndex = null;
let editor = document.getElementById("editor");

/* =====================
   LOGIN FUNCTIONS
=====================*/

if(localStorage.getItem("rememberUser")){
  window.location="dashboard.html";
}

let attempts = Number(localStorage.getItem("loginAttempts")) || 0;
const maxAttempts = 3;

if(!localStorage.getItem("userPassword")){
  localStorage.setItem("userPassword","1234");
}

const security = { question:"What is your pet's name?", answer:"tom" };

function login(){
  let user=document.getElementById("username").value;
  let pass=document.getElementById("password").value;
  let remember=document.getElementById("remember").checked;
  let msg=document.getElementById("msg");
  let storedPass=localStorage.getItem("userPassword");

  if(attempts>=maxAttempts){
    msg.innerText="Too many attempts! Try again later.";
    return;
  }

  if(user==="admin" && pass===storedPass){
    localStorage.setItem("loginUser",user);
    if(remember) localStorage.setItem("rememberUser",user);
    else localStorage.removeItem("rememberUser");
    localStorage.removeItem("loginAttempts");
    window.location="dashboard.html";
  } else{
    attempts++;
    localStorage.setItem("loginAttempts",attempts);
    msg.innerText=`Wrong Username or Password. Attempts left: ${maxAttempts - attempts}`;
  }
}

function forgotPassword(){
  let ans = prompt(security.question);
  if(ans===null) return;
  if(ans.toLowerCase()===security.answer.toLowerCase()){
    alert("Your password is: "+localStorage.getItem("userPassword"));
  }else alert("Incorrect answer");
}

function changePassword(){
  let current = prompt("Enter current password:");
  if(current===null) return;
  let storedPass = localStorage.getItem("userPassword");
  if(current !== storedPass){ alert("Incorrect current password"); return; }
  let newPass = prompt("Enter new password:");
  if(newPass===null || newPass==="") return;
  localStorage.setItem("userPassword",newPass);
  alert("Password changed successfully!");
}

/* =====================
   DASHBOARD FUNCTIONS
=====================*/

function logout(){
  localStorage.removeItem("loginUser");
  window.location="index.html";
}

function loadUserPhoto(){
  let photo = localStorage.getItem("profilePhoto");
  if(photo) document.getElementById("userPhoto").src = photo;
}

function loadCourses(){
  let box="";
  courses.forEach((c,i)=>{
    box+=`<div class="box" onclick="openCourse(${i})"><h3>${c.name}</h3></div>`;
  });
  document.getElementById("courseBox").innerHTML=box;
}

function openCourse(i){
  selectedCourseIndex=i;
  document.getElementById("topicArea").style.display="block";
  document.getElementById("courseName").innerText = courses[i].name;
  loadTopics();
}

function addTopic(){
  if(selectedCourseIndex===null){
    alert("Select a course first!");
    return;
  }
  let name=prompt("Enter topic name");
  if(!name) return;
  if(!courses[selectedCourseIndex].topics) courses[selectedCourseIndex].topics=[];
  if(!courses[selectedCourseIndex].notes) courses[selectedCourseIndex].notes=[];
  courses[selectedCourseIndex].topics.push(name);
  courses[selectedCourseIndex].notes.push("");
  loadTopics();
}

function renameTopic(i){
  let newName = prompt("Enter new topic name");
  if(!newName) return;
  courses[selectedCourseIndex].topics[i]=newName;
  loadTopics();
}

function deleteTopic(i){
  if(confirm("Delete this topic?")){
    courses[selectedCourseIndex].topics.splice(i,1);
    courses[selectedCourseIndex].notes.splice(i,1);
    loadTopics();
  }
}

function loadTopics(){
  if(selectedCourseIndex===null) return;
  let topics=courses[selectedCourseIndex].topics||[];
  let list="";
  topics.forEach((t,i)=>{
    list+=`<div class="topic" draggable="true">
      <span onclick="openNotes(${i})">${t}</span>
      <div>
        <button class="edit-btn" onclick="renameTopic(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteTopic(${i})">X</button>
      </div>
    </div>`;
  });
  document.getElementById("topicList").innerHTML=list;
  saveData();
}

function openNotes(i){
  localStorage.setItem("currentTopic",i);
  localStorage.setItem("currentCourse",selectedCourseIndex);
  window.location="notes.html";
}

/* =====================
   SAVE DATA
=====================*/
function saveData(){
  localStorage.setItem("courses",JSON.stringify(courses));
}

/* =====================
   DARK MODE
=====================*/
function toggleDarkMode(){
  document.body.classList.toggle("dark");
}