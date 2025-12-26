document.getElementById("signup-btn").onclick = ()=>{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if(!username || !password) return alert("Fill all fields");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find(u=>u.username===username)) return alert("Username exists");
    users.push({username,password});
    localStorage.setItem("users",JSON.stringify(users));
    alert("Signup successful");
    window.location.href="signin.html";
}