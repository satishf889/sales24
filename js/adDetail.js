document.getElementById('editButton').addEventListener('click', (e) => {
    e.preventDefault()
    document.getElementById('editButton').style.display = "none"
    document.getElementById('closeButton').style.display = "none"
    document.getElementById('formField').disabled = false
    document.getElementById('submitButton').style.display = "block"
})

document.getElementById('submitButton').addEventListener('click', (e) => {
    e.preventDefault()
    window.location.reload(true);
})

document.getElementById('closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    window.location = 'adsPosted.html'
})

if (readCookie("_sales24JWT") == '') {
    login()
}

var user_data = JSON.parse(readCookie("_sales24JWT"))
document.getElementById("userActions").innerHTML = "Hi, " + user_data.username,
    document.getElementById("lastLogin").innerHTML = "Last Login: " + user_data.lastLogin

var adDetail = async function (AD_KEY) {
    document.getElementById("adDetail").style.display = "none"
    document.getElementById("loader").style.display = "block";
    var adDetail_url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/addetail"
    await fetch(adDetail_url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST',
        'body': JSON.stringify({ AD_KEY }),
        headers: {
            'Content-Type': 'application/text',
            'Authorization': user_data.Token
        }
    }).then((res) => {
        return res.text().then((data) => {
            if (res.statusCode == 400) {
                document.getElementById("adDetail").style.display = "block"
                document.getElementById("loader").style.display = "none";
                alert("Sorry the Ad you are searching is not posted by you.")
                window.location = "index.html"
            }

            if (res.statusCode == 500) {
                document.getElementById("adDetail").style.display = "none"
                document.getElementById("loader").style.display = "none";
                alert("Something went wrong please try again.")
                return;
            }
            data = JSON.parse(data)
            document.getElementById('productImage').src = data.S3_LOCATION
            document.getElementById('pageTitle').innerHTML = data.PRODUCT_NAME
            document.getElementById('productName').value = data.PRODUCT_NAME
            document.getElementById('productDescription').value = data.PRODUCT_DESCRIPTION
            document.getElementById('productBrand').value = data.PRODUCT_BRAND
            document.getElementById('productCategory').value = data.PRODUCT_CATEGORY
            document.getElementById('productPrice').value = data.PRODUCT_PRICE
            document.getElementById('productLocation').value = data.PRODUCT_LOCATION
            document.getElementById('adStatus').value = data.PRODUCT_STATUS
            document.getElementById("adDetail").style.display = "block"
            document.getElementById("loader").style.display = "none";
        }).catch((err) => {
            document.getElementById("adDetail").style.display = "block"
            document.getElementById("loader").style.display = "none";
            alert("Something went wrong. Please try again.")
        })
    })
        .catch((err) => {
            alert("Something went wrong. Please try again.")
            window.location = "index1.html"
        })
}

const params = new URLSearchParams(document.location.search);
const adId = params.get("AD_ID");
if(adId){
adDetail(adId)
}
else{
    window.location="index1.html"
}
var ads_posted = async () => {
    var body = "";
    if (sessionStorage.getItem('lastSearchedKey')) {
        body = JSON.stringify({ "lastScannedIndex": JSON.parse(sessionStorage.getItem('lastSearchedKey')) })
        sessionStorage.removeItem("lastSearchedKey");
    }
    var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/recentlypostedads"
    document.getElementById("mainHead").style.display = "none"
    document.getElementById("loader").style.display = "block";
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST', // or 'PUT',
        body
    }).then((res) => {
        if (res.status == 400) {
            document.getElementById("loader").style.display = "block";
            return res.text().then((data) => {
                alert("Something went wrong. Please try again.")
                document.getElementById("loader").style.display = "none";
                document.getElementById("mainhead").style.display = "block"
            });
        }
        return res.text().then((data) => {
            document.getElementById("mainHead").style.display = "none";
            document.getElementById("loader").style.display = "block"
            var total_data = JSON.parse(data)
            if (total_data.LAST_KEY) {
                sessionStorage.setItem('lastSearchedKey', JSON.stringify(total_data.LAST_KEY))
            }
            total_data = total_data.ITEMS
            if (total_data.length == 0) {
                document.getElementById("mainHead").style.display = "block";
                document.getElementById("loader").style.display = "none"
                document.getElementById("noAds").style.display = "block"
                return;
            }
            for (var i = 0; i < total_data.length; i++) {
                generateCard(total_data[i].AD_KEY, total_data[i].PRODUCT_NAME, total_data[i].PRODUCT_DESCRIPTION, total_data[i].PRODUCT_PRICE, total_data[i].PRODUCT_LOCATION, total_data[i].S3_LOCATION)
                if (i == total_data.length - 1) {
                    document.getElementById("mainHead").style.display = "block";
                    document.getElementById("loader").style.display = "none"
                }
                if (i == 3) {
                    document.getElementById("mainHead").style.display = "block";
                    document.getElementById("loader").style.display = "none"
                    break;
                }
            }
        })
    })
        .catch((err) => {
            alert("Something Went Wrong. Please login again.")
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainHead").style.display = "block"
        })

}