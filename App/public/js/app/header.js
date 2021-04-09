var tokendata = (localStorage.getItem("token")) || (localStorage.setItem("token", false));


function HeaderAccess(){
    if(tokendata === 'false') return;
    
    let request = new XMLHttpRequest();
    request.open("GET", `https://v2.openouath.cf/backend/db/verify/header/token?item=${tokendata}`);
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
            document.getElementById("logout1").addEventListener("click", function(event) {
                localStorage.setItem("token", false);
                localStorage.setItem("email", false);
            })
            setTimeout(function() {
                document.getElementById("header_username").textContent = respons;
                let fullname = respons + ''.split(" ")
                let name1 = fullname[0].split("");
                let name2 = fullname[1].split("");
                let name = name1 + name2;
                let avatar = generateAvatar(`${!name ? 'U' : name}`, "white", "#009578");
                document.getElementById("avatar").src = avatar;
            }, 1500)
        }
    }, 1500);
}

HeaderAccess();



function generateAvatar(text, foregroundColor, backgroundColor) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 100px Assistant";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
}