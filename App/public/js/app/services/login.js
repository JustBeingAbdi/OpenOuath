function Login() {
    document.getElementById("reset_password").style.display = 'none'
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(!email || !password){
        document.getElementById("errortext").textContent = 'Invalid Email or Password';
            return document.getElementById("reset_password").style.display = 'block'
    }

     document.getElementById("errortext").textContent = "Logging in..."

    let request = new XMLHttpRequest();
    request.open('GET', `/backend/db/login?email=${email}&password=${password}`);
    request.send();

    setTimeout(function() {

        let request_respons = request.response;
        let respons = request_respons
        
        

        if(respons === '404'){
            document.getElementById("errortext").textContent = 'Invalid Email or Password';
            return document.getElementById("reset_password").style.display = 'block'
        } else {
            document.getElementById("errortext").textContent = "Logged in! Redirecting...";

            localStorage.setItem("token", respons);
            localStorage.setItem("email", email);
            setTimeout(function() {
                window.location.assign(`/services/login?key=${respons}&host=${window.location.hostname}`);
            }, 1000)
        }
    }, 3500)


    
}


document.getElementById("loginform").addEventListener("submit", function(event) {
    event.preventDefault();
    Login();
});



function Signup() {
    
    document.getElementById("reset_password1").style.display = 'none'
    let email = document.getElementById("semail").value;
    let password = document.getElementById("spassword").value;
    let name = document.getElementById("name").value;

    if(!email || !password || !name){
        document.getElementById("signuptext").textContent = "Fields hasn't been filled out!";
            return document.getElementById("reset_password").style.display = 'block'
    }

     document.getElementById("signuptext").textContent = "Signing in..."

    let request = new XMLHttpRequest();
    request.open('GET', `/backend/db/signup?email=${email}&password=${password}&name=${name}`);
    request.send();

    setTimeout(function() {

        let request_respons = request.response;
        let respons = request_respons
        
        

        if(respons === '404'){
            document.getElementById("signuptext").textContent = 'Email is already used in an account!';
            return document.getElementById("reset_password1").style.display = 'block'
        } else {
            document.getElementById("signuptext").textContent = "Signed in! Redirecting...";

            localStorage.setItem("token", respons);
            localStorage.setItem("email", email);
            let ddcrequest = new XMLHttpRequest();
            let accrequest = new XMLHttpRequest();
            ddcrequest.open("GET", `<%= config.ddc_url %>/services/token?token=${respons}`);
            accrequest.open("GET", `<%= config.accounts_url %>/services/token?token=${respons}`);
            ddcrequest.send();
            accrequest.send();
            setTimeout(function() {
                window.location.assign(`/`);
            }, 1000)
        }
    }, 3500)


    
}

