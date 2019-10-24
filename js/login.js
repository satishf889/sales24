if (readCookie("_sales24JWT")) {
    window.location = 'index1.html';
}
var form = document.getElementById("login-form")

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    if (username == '' || password == '') {
        return;
    }
    if (username.length < 6) {
        alert("Username cannot be less than 6 characters")
        return;
    }

    const url = 'https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/login';
    const data = { username, password };

    (async () => {
        document.getElementById("login-form").style.display = "none"
        document.getElementById("loader").style.display = "block";
        await fetch(url, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/text',
            }
        }).then((res) => {
            if (res.status == 400) {
                document.getElementById("loader").style.display = "block";
                return res.text().then((data) => {
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("login-form").style.display = "block"
                    document.getElementById("loginError").style.display = "block";
                    document.getElementById("loginError").innerHTML = data;
                });
            }
            return res.text().then((data) => {
                document.getElementById("login-form").style.display = "none";
                document.getElementById("loader").style.display = "block"
                data = JSON.parse(data)
                var JWTdata = JSON.stringify({ "Token": data.Token, "username": username,"fullName":data.FULL_NAME, "lastLogin": data.Last_Login})

                delete_cookie("_sales24JWT")
                writeCookie("_sales24JWT", JWTdata, 2)
                var url=sessionStorage.getItem('requestedURL')
                sessionStorage.removeItem('requestedURL')
                if(url==null){
                    url="index1.html"
                }
                window.location = url;
            })
        })
            .catch((err) => {
                alert("Something Went Wrong. Try again.")
                document.getElementById("loader").style.display = "none";
                document.getElementById("login-form").style.display = "block"
                console.log(err)
            })

    })()
})