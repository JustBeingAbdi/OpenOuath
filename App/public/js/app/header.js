var tokendata = (localStorage.getItem("token")) || (localStorage.setItem("token", false));


function HeaderAccess(){
    if(tokendata === 'false') return;
    
    let request = new XMLHttpRequest();
    request.open("GET", `/backend/db/verify/header/token?item=${tokendata}`);
    request.send();

    setTimeout(function() {
        let respons = request.response;
        if(respons === '404'){
            return;
        } else {
            document.getElementById("headerloggedin").style.display = 'block';
            document.getElementById("headerlogin").style.display = 'none';
            document.getElementById("account1").href = "/services/redirect?path=accounts/manage";
            document.getElementById("app1").href = "/services/redirect?path=ddc";
            document.getElementById("logout1").href = '/services/logout?network=ddc_redirect&key=' + localStorage.getItem("token");
            setTimeout(function() {
                document.getElementById("header_username").textContent = respons;
            }, 1500)
        }
    }, 1500);
}

HeaderAccess();