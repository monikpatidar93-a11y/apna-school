function downloadBackup(){
let data={};
for(let k in localStorage){
if(k.endsWith("_courses")){
data[k]=localStorage.getItem(k);
}
}
let blob=new Blob([JSON.stringify(data)],{type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="backup.json";
a.click();
}

function restoreBackup(input){
let file=input.files[0];
let r=new FileReader();
r.onload=function(){
let data=JSON.parse(r.result);
for(let k in data){
localStorage.setItem(k,data[k]);
}
alert("Restore Complete");
};
r.readAsText(file);
}