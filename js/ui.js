function toggleDark(){
document.body.classList.toggle("dark");
}

function logout(){
localStorage.removeItem("user");
location="index.html";
}

function format(cmd){
document.execCommand(cmd,false,null);
}