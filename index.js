const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function (event){
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        const response = await fetch ("https://reqres.in/api/login",{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({username: email,password})
        });

        if(response.ok){
            const data = await response.json();
            const token = data.token;

            localStorage.setItem("token", token);
            window.location.href= "dashboard.html";
        }else{
            console.log("Login Failed")
            alert("Login Failed")
        }
    } catch (error) {
        console.log("error occured", error)
    }
})