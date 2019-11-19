if (readCookie("_sales24JWT")) {
    window.location = 'index1.html';
}
var registerForm = document.getElementById('registerForm')
registerForm.addEventListener('submit', (e) => {
    registerForm.checkValidity()
    var username = document.getElementById('username').value
    var fullname = document.getElementById('fullname').value
    var email = document.getElementById('email').value
    var mobileNumber = document.getElementById('mobileNumber').value
    var password = document.getElementById('password').value
    var city = document.getElementById('city').value
    var country = document.getElementById('country').value
    var gender = "Male";
    if (document.getElementById('female').checked) {
        gender = "Female"
    }

    var user_data = {
        username,
        fullname,
        email,
        mobileNumber,
        password,
        city,
        country,
        gender
    }
    var username_url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/getusername"
    var register_url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/registeruser"
    var register = (async () => {
        document.getElementById("content").style.display = "none"
        document.getElementById("loader").style.display = "block";

        await fetch(username_url, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'POST',
            'body': JSON.stringify({ username }),
            headers: {
                'Content-Type': 'application/text',
            }
        }).then((res) => {
            return res.text().then(async (data) => {
                if (data == "false") {
                    document.getElementById("content").style.display = "block"
                    document.getElementById("loader").style.display = "none";
                    document.getElementById("usernameError").style.display = "block";
                    document.getElementById("usernameGuide").style.display = "none";
                    document.getElementById("usernameError").innerHTML = "Username already registered"
                    return;
                }
                await fetch(register_url, {
                    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
                    method: 'POST',
                    body: JSON.stringify(user_data),
                    headers: {
                        'Content-Type': 'application/text',
                    }
                }).then((res) => {
                    if (res.statusCode == 400) {
                        document.getElementById("content").style.display = "block"
                        document.getElementById("loader").style.display = "none";
                        alert("Something went wrong. Please try again.")
                    }
                    return res.text().then((data) => {
                        data = JSON.parse(data)
                        var JWTdata = JSON.stringify({ "Token": data.Token, "username": username,"fullName":data.FULL_NAME, "lastLogin": data.Last_Login})
                        writeCookie("_sales24JWT", JWTdata, 2)
                        window.location = 'index1.html';
                    })
                }).catch((err) => {
                    document.getElementById("content").style.display = "block"
                    document.getElementById("loader").style.display = "none";
                    alert("Something went wrong. Please try again.")
                })
            })
        }).catch((err) => {
            document.getElementById("content").style.display = "block"
            document.getElementById("loader").style.display = "none";
            alert("Something went wrong. Please try again.")
        })

    })
    register()


})