function writeCookie(name, value, days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function register() {
    var requestedUrl = window.location
    sessionStorage.setItem('requestedURL', requestedUrl)
    window.location = "register.html"
}

function login() {
    var requestedUrl = window.location
    sessionStorage.setItem('requestedURL', requestedUrl)
    window.location = "login.html"
}


var delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

if (readCookie("_sales24JWT") != '') {
    if(document.getElementById('userNotLoggedIn')){
    document.getElementById('userNotLoggedIn').style.display = "none"
    document.getElementById('userLogin').style.display = "block"
    }
    var user_data = JSON.parse(readCookie("_sales24JWT"))
    document.getElementById("userActions").innerHTML = "Hi, " + user_data.fullName,
        document.getElementById("lastLogin").innerHTML = "Last Login: " + user_data.lastLogin
}

function logout() {
    var logout_confirm = confirm("Do you wish to logout?")
    if (logout_confirm) {
        const url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/logout"
        document.getElementById("loader").style.display = "block";
        var logout_operation = async () => await fetch(url, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'GET',
            headers: {
                'Content-Type': 'application/text',
                'Authorization': user_data.Token
            }
        }).then((res) => {
            return res.text().then((data) => {
                alert("You Have successfully Logged out of current session.")
                delete_cookie("_sales24JWT")
                window.location = 'index1.html';
            })
        }).catch((err) => {
            alert("Something went wrong. Please login Again")
            console.log(err)
            // delete_cookie("_sales24JWT")
            // window.location = 'index1.html';
        })
        logout_operation()
    }
}


function logoutAll() {
    var logoutAll_confirm = confirm("Do you wish to logout from All Devices?")
    if (logoutAll_confirm) {
        const url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/logoutall"
        document.getElementById("loader").style.display = "block";
        var logoutAll_operation = async () => await fetch(url, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'GET',
            headers: {
                'Content-Type': 'application/text',
                'Authorization': user_data.Token
            }
        }).then((res) => {
            return res.text().then((data) => {
                alert("You Have successfully Logged out of all devices.")
                delete_cookie("_sales24JWT")
                window.location = 'index1.html';
            })
        }).catch((err) => {
            alert("Something went wrong. Please login Again")
            delete_cookie("_sales24JWT")
            window.location = 'index1.html';
        })
        logoutAll_operation()
    }
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return '';
}

var generateCard = async function (id, name, desc, price, location, src, color, likes, mainhead) {

    var elem = document.createElement('div');
    elem.className = "col-lg-3 col-md-4 col-6"

    var anch = document.createElement('a');
    anch.id = "id"
    anch.className = "d-block mb-4 h-100"
    anch.href = "adDetail1.html?AD_ID=" + id

    var second_div = document.createElement('div')
    second_div.className = "w3-card-4"

    var second_para = document.createElement('p')
    second_para.innerHTML = name + "".italics()
    second_para.className = "text-lg-center"


    var image = document.createElement('img')
    image.className = "w3-image"
    image.id = id
    image.src = src
    image.alt = "avatar"

    var third_para = document.createElement('p')
    third_para.className = "text-lg-center"
    third_para.innerHTML = desc

    var fourth_para = document.createElement('p')
    fourth_para.className = "text-lg-center fa"
    fourth_para.innerHTML = "&#xf041;  " + location.bold()


    var fifth_para = document.createElement('p')
    fifth_para.className = "text-lg-center"
    fifth_para.innerHTML = "&#x20b9 " + price.bold()

    var like_dev = document.createElement('p')
    var i_element = document.createElement('button')
    i_element.className = "fa fa-heart"
    i_element.id = id + "/heart"
    i_element.style.color = color
    i_element.style.fontSize = 24
    i_element.onclick = function () { liked(id + "/heart") };

    var innerSpan=document.createElement('span')
    innerSpan.id=id+"/totalLikes"
    innerSpan.innerText=" "+likes

    like_dev.appendChild(i_element)
    like_dev.appendChild(innerSpan)

    anch.appendChild(second_para)
    anch.appendChild(image)
    anch.appendChild(third_para)
    anch.appendChild(fourth_para)
    anch.appendChild(fifth_para)
    second_div.appendChild(anch)


    second_div.appendChild(like_dev)
    elem.appendChild(second_div)


    document.getElementById("" + mainhead).appendChild(elem)
}

async function liked(id) {

    if (readCookie("_sales24JWT") == '') {
        login()
        return;
    }
    var likes=document.getElementById(id.replace("/heart", "/totalLikes"))
    var value=parseInt(likes.innerText)
    var heart = document.getElementById(id)
    if (heart.style.color == "grey") {
        document.getElementById(id).style.color = "red"
        likes.innerText=" "+(value+1)
        document.getElementById(id).disabled=true
        await wishlist(id.replace("/heart", ""))
        return
    }
    document.getElementById(id).style.color = "grey"
    likes.innerText=" "+(value-1)
    document.getElementById(id).disabled=true
    await remove_wishlist(id.replace("/heart", ""))
}

var wishlist = async function (id) {
    const url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/wishlistad"
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST',
        body: JSON.stringify({ "AD_KEY": id }),
        headers: {
            'Content-Type': 'application/JSON',
            'Authorization': user_data.Token
        }
    }).then((res) => {
        if (res.status == 400) {
            document.getElementById(id + '/heart').style.color = "grey"
            return
        }
        else if (res.status == 500) {
            alert("Something went wrong.Please try again.")
            return
        }

        return res.text().then((data)=>{
            data=JSON.parse(data)
            document.getElementById(id + '/heart').style.color = "red"
            document.getElementById(id+"/totalLikes").innerText=" "+data.likes
            document.getElementById(id+'/heart').disabled=false
        })
    }).catch((err) => {
        document.getElementById(id + '/heart').style.color = "grey"
        alert("Something went wrong. Please login Again")
        delete_cookie("_sales24JWT")
        window.location = 'login.html';
    })
}


var remove_wishlist = async (id) => {
    const url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/removewishlist"
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST',
        body: JSON.stringify({ "AD_KEY": id }),
        headers: {
            'Content-Type': 'application/JSON',
            'Authorization': user_data.Token
        }
    }).then((res) => {
        if (res.statusCode == 400) {
            console.log(res)
            alert(res)
            document.getElementById(id + '/heart').style.color = "red"
            return
        }
        else if (res.statusCode == 500) {
            alert(res)
            alert("Something went wrong.Please try again.")
            return
        }

        return res.text().then((data)=>{
            data=JSON.parse(data)
            document.getElementById(id + '/heart').style.color = "grey"
            document.getElementById(id+"/totalLikes").innerText=" "+data.likes
            document.getElementById(id+'/heart').disabled=false
        })

    }).catch((err) => {
        document.getElementById(id + '/heart').style.color = "red"
        alert("Something went wrong. Please login Again")
        delete_cookie("_sales24JWT")
        window.location = 'login.html';
    })
}

var recentlyAdsPosted = async () => {
    var body = "";
    if (sessionStorage.getItem('lastSearchedKey') && start == false) {
        body = JSON.stringify({ "lastScannedIndex": JSON.parse(sessionStorage.getItem('lastSearchedKey')) })
        sessionStorage.removeItem("lastSearchedKey");
    }
    var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/recentlypostedads"
    document.getElementById("mainHead").style.display = "block"
    document.getElementById("loader").style.display = "block";
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST', // or 'PUT',
        body
    }).then(async(res) => {
        if (res.status == 400) {
            document.getElementById("loader").style.display = "block";
            return res.text().then((data) => {
                alert("Something went wrong. Please try again.")
                document.getElementById("loader").style.display = "none";
                document.getElementById("mainhead").style.display = "block"
            });
        }
        return res.text().then(async(data) => {
            document.getElementById("mainHead").style.display = "block";
            document.getElementById("loader").style.display = "block"
            var total_data = JSON.parse(data)
            if (total_data.LAST_KEY) {
                sessionStorage.setItem('lastSearchedKey', JSON.stringify(total_data.LAST_KEY))
                document.getElementById('searchMore').style.display = "block"
                start = false
            }
            else {
                document.getElementById('searchMore').style.display = "none"
                document.getElementById('lastAd').style.display = "block"
                start = true
            }
            total_data = total_data.ITEMS
            if (total_data.length == 0) {
                if (starting) {
                    document.getElementById("mainHead").innerHTML = ""
                    starting = false;
                }
                document.getElementById("mainHead").style.display = "block";
                document.getElementById("loader").style.display = "none"
                document.getElementById("lastAd").style.display = "block"
                return;
            }
            if (starting) {
                document.getElementById("mainHead").innerHTML = ""
                starting = false;
            }
            for (var i = 0; i < total_data.length; i++) {
                var color = "grey"
                if (readCookie("_sales24JWT") != '') {
                    var flag=await likedADS(total_data[i].AD_KEY)
                    if (flag=="true") {
                        color = "red"
                    }
                }
                generateCard(total_data[i].AD_KEY, total_data[i].PRODUCT_NAME, total_data[i].PRODUCT_DESCRIPTION, total_data[i].PRODUCT_PRICE, total_data[i].PRODUCT_LOCATION, total_data[i].S3_LOCATION, color, total_data[i].LIKES, 'mainHead')
                if (i == total_data.length - 1) {
                    document.getElementById("mainHead").style.display = "block";
                    document.getElementById("loader").style.display = "none"
                }
                if(limit && i==3)
                {
                    document.getElementById("mainHead").style.display = "block";
                    document.getElementById("loader").style.display = "none"
                    if (total_data.length > i) {
                        document.getElementById("lastAd").style.display = "none"
                        document.getElementById("searchMore").style.display="block"
                    }
                    break;
                }
            }
            // if (sessionStorage.getItem('lastSearchedKey')==null) {
            //     document.getElementById('lastAd').style.display = "block"
            // }
        })
    })
        .catch((err) => {
            alert("Something Went Wrong.")
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainHead").style.display = "block"
            console.log(err)
            // delete_cookie("_sales24JWT")
            // window.location = "index.html"
        })


}

var postByCategory = async (category) => {
    var body = JSON.stringify({ "lastScannedIndex": false, category });
    if (sessionStorage.getItem('lastSearchedKey') && categoryStart == false) {
        body = JSON.stringify({ "lastScannedIndex": JSON.parse(sessionStorage.getItem('lastSearchedKey')), category })
        sessionStorage.removeItem("lastSearchedKey");
    }
    var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/adspostedbycategory"
    document.getElementById("mainHeadCategory").style.display = "block"
    document.getElementById("loaderCategory").style.display = "block";
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST', // or 'PUT',
        body
    }).then((res) => {
        if (res.status == 400) {
            document.getElementById("mainHeadCategory").style.display = "block";
            document.getElementById("loaderCategory").style.display = "block";
            return res.text().then((data) => {
                alert("Something went wrong. Please try again.")
                document.getElementById("loaderCategory").style.display = "none";
                document.getElementById("mainheadCategory").style.display = "block"
            });
        }
        return res.text().then(async (data) => {
            document.getElementById("mainHeadCategory").style.display = "block";
            document.getElementById("loaderCategory").style.display = "block"
            var total_data = JSON.parse(data)
            total_data = total_data.ITEMS
            if (total_data.length == 0) {
                if (starting_category) {
                    document.getElementById("mainHeadCategory").innerHTML = ""
                    starting_category = false;
                }
                document.getElementById("mainHeadCategory").style.display = "block";
                document.getElementById("loaderCategory").style.display = "none"
                document.getElementById("lastAdCategory").style.display = "block"
                return;
            }
            if (starting_category) {
                document.getElementById("mainHeadCategory").innerHTML = ""
                starting_category = false;
            }

            for (var i = 0; i < total_data.length; i++) {
                var color = "grey";
                if (readCookie("_sales24JWT") != '') {
                    var flag=await likedADS(total_data[i].AD_KEY)
                    if (flag=="true") {
                        color = "red"
                    }
                }
                generateCard(total_data[i].AD_KEY, total_data[i].PRODUCT_NAME, total_data[i].PRODUCT_DESCRIPTION, total_data[i].PRODUCT_PRICE, total_data[i].PRODUCT_LOCATION, total_data[i].S3_LOCATION, color, total_data[i].LIKES, 'mainHeadCategory')

                if (i == total_data.length - 1) {
                    document.getElementById("mainHeadCategory").style.display = "block";
                    document.getElementById("loaderCategory").style.display = "none"
                }
                if (i == 3) {
                    document.getElementById("mainHeadCategory").style.display = "block";
                    document.getElementById("loaderCategory").style.display = "none"
                    if (total_data.length > i) {
                        document.getElementById("searchMoreCategory").style.display = "block"
                        document.getElementById('lastAdCategory').style.display="none"
                    }
                    break
                }
            }
            // if (sessionStorage.getItem('lastSearchedKey')==null) {
            //     document.getElementById('lastAdCategory').style.display = "block"
            // }
        })
    })
        .catch((err) => {
            alert("Something Went Wrong. Please login again.")
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainHead").style.display = "block"
            delete_cookie("_sales24JWT")
            window.location = "index.html"
        })

}

var likedADS=async function(ad_key){
    var url="https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/likedads"
    let color = await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST', // or 'PUT',
        body: JSON.stringify({"AD_KEY":ad_key}),
        headers: {
            'Content-Type': 'application/text',
            'Authorization': user_data.Token
        }
    });
    
    return color.text().then((data)=>{
        return data
    }).catch((err)=>{
        console.log(err)
    })
}