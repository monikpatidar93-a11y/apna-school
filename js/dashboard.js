let courses = JSON.parse(localStorage.getItem("courses")) || [];

/******** CREATE COURSE ********/
function createCourse(){
let name = courseName.value.trim();
if(name=="") return;

courses.push(name);
localStorage.setItem("courses",JSON.stringify(courses));
courseName.value="";
showCourses();
}

/******** SHOW COURSES ********/
function showCourses(){
courseList.innerHTML="";
courses.forEach(c=>{
courseList.innerHTML+=`
<li>
<span onclick="openCourse('${c}')">${c}</span>
<button onclick="deleteCourse('${c}')">🗑</button>
</li>`;
});
}
showCourses();

/******** OPEN COURSE ********/
function openCourse(c){
localStorage.setItem("currentCourse",c);
location="course.html";
}

/******** DELETE COURSE ********/
function deleteCourse(c){
if(!confirm("Delete course?")) return;

courses = courses.filter(x=>x!=c);
localStorage.setItem("courses",JSON.stringify(courses));

localStorage.removeItem("topics_"+c);
localStorage.removeItem("completed_"+c);

showCourses();
}