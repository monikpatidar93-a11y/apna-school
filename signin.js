document.getElementById("signin-btn").onclick = ()=>{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(!username || !password) return alert("Fill all fields");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u=>u.username===username && u.password===password);
    if(found){
        localStorage.setItem("currentUser",JSON.stringify(found));
        alert("Logged in");
        window.location.href="index.html";
    } else alert("Invalid credentials");
}