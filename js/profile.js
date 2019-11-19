if (readCookie("_sales24JWT") == '') {
    var requestedUrl=window.location
  sessionStorage.setItem('requestedURL',requestedUrl)
  window.location="login.html"
}

var user_data = JSON.parse(readCookie("_sales24JWT"))
document.getElementById("userActions").innerHTML = "Hi, " + user_data.fullName,
    document.getElementById("lastLogin").innerHTML = "Last Login: " + user_data.lastLogin


var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me"
document.getElementById("userProfile").style.display = "none"
document.getElementById("loader").style.display = "block";
var profile_details = async () => await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: 'GET',
    headers: {
        'Content-Type': 'application/text',
        'Authorization': user_data.Token
    }
}).then((res) => {
    return res.text().then((data) => {
        data = JSON.parse(data)
        document.getElementById("username").innerHTML = data.USERNAME
        document.getElementById("name").innerHTML = data.NAME
        document.getElementById("email").innerHTML = data.EMAIL
        document.getElementById("mobileNumber").innerHTML = data.MOBILE_NUMBER
        document.getElementById("totalAdsPosted").innerHTML = data.TOTAL_ADS_POSTED
        document.getElementById("LastLogin").innerHTML = data.LAST_LOGIN
        document.getElementById("userProfile").style.display = "block"
        document.getElementById("loader").style.display = "none";
    })
}).catch((err) => {
    alert("Something went wrong. Please login Again")
    delete_cookie("_sales24JWT")
    login()
})
profile_details()
document.getElementById('closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    window.location = 'index1.html';
})