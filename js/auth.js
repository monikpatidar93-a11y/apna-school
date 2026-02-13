let users = JSON.parse(localStorage.getItem("users")) || [];
let isLogin = true;

function toggleForm(){
  isLogin = !isLogin;
  if(isLogin){
    formTitle.innerText="Login";
    formBtn.innerText="Login";
    toggleText.innerHTML='Don\'t have an account? <span id="toggleLink" onclick="toggleForm()">Sign Up</span>';
  } else {
    formTitle.innerText="Sign Up";
    formBtn.innerText="Register";
    toggleText.innerHTML='Already have an account? <span id="toggleLink" onclick="toggleForm()">Login</span>';
  }
}

function loginUser(){
  let u = username.value.trim();
  let p = password.value.trim();
  if(u=="" || p==""){ alert("Enter username & password"); return; }

  if(isLogin){
    let found = users.find(x=>x.user==u && x.pass==p);
    if(found){
      localStorage.setItem("loginUser", u);
      window.location="dashboard.html";
    } else alert("Invalid login credentials");
  } else {
    if(users.find(x=>x.user==u)){ alert("Username exists"); return; }
    users.push({user:u, pass:p});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful!");
    toggleForm();
  }
}