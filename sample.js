async function apiIntergration(){
    const res= fetch("https://jsonplaceholder.typicode.com/users").then(res=>res.json()).then(data=>{console.log(data)});
}
apiIntergration();