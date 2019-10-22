document.getElementById('closeButton').onclick = function(){
    window.location="index1.html"
};

if (readCookie("_sales24JWT") == '') {
    login()
}

var user_data = JSON.parse(readCookie("_sales24JWT"))
document.getElementById("userActions").innerHTML = "Hi, " + user_data.username,
    document.getElementById("lastLogin").innerHTML = "Last Login: " + user_data.lastLogin


var generateCardUser = async function (id, name, desc, price,src) {

    var elem = document.createElement('div');
    elem.className = "col-lg-3 col-md-4 col-6"
    var anch = document.createElement('a');
    anch.id = "id"
    anch.className = "d-block mb-4 h-100"
    anch.href="adDetail.html?AD_ID="+id

    var second_div = document.createElement('div')
    second_div.className = "w3-card-4"

    var second_para = document.createElement('p')
    second_para.innerHTML = name + "".italics()
    second_para.className = "text-lg-center"


    var image = document.createElement('img')
    image.className = "w3-image"
    image.id = id
    image.src = src
    image.alt = "images/logo.png"

    var third_para = document.createElement('p')
    third_para.className = "text-lg-center"
    third_para.innerHTML = desc

    var fourth_para = document.createElement('p')
    fourth_para.className = "text-lg-center"
    fourth_para.innerHTML = "&#x20b9 " + price.bold()

    second_div.appendChild(second_para)
    second_div.appendChild(image)
    second_div.appendChild(third_para)
    second_div.appendChild(fourth_para)

    anch.appendChild(second_div)
    elem.appendChild(anch)
    

    document.getElementById("mainHead").appendChild(elem)
}

function adDetail(id){
    alert(id)
    return true;
}

var adsPostedUser = async () => {
    var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/retrieveads"
    document.getElementById("mainHead").style.display = "block"
    document.getElementById("loader").style.display = "block";
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'GET', // or 'PUT'
        headers: {
            'Authorization': user_data.Token
        }
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
            document.getElementById("mainHead").style.display = "block";
            document.getElementById("loader").style.display = "block"
            
            var total_data = JSON.parse(data)
            document.getElementById("totalAds").innerHTML="You have posted "+total_data.length+" Ads."
            if(total_data.length==0){
                document.getElementById("mainHead").innerHTML=""
                document.getElementById("mainHead").style.display = "block";
            document.getElementById("loader").style.display = "none"
            document.getElementById("noAds").style.display="block"
                return;
            }
            document.getElementById("mainHead").innerHTML=""
            for (var i = 0; i < total_data.length; i++) {
                generateCardUser(total_data[i].AD_KEY, total_data[i].PRODUCT_NAME, total_data[i].PRODUCT_DESCRIPTION, total_data[i].PRODUCT_PRICE,total_data[i].S3_LOCATION)
                if (i == total_data.length - 1) {
                    document.getElementById("mainHead").style.display = "block";
                    document.getElementById("loader").style.display = "none"
                }
            }
        })
    })
        .catch((err) => {
            alert("Something Went Wrong. Please login again.")
            document.getElementById("loader").style.display = "none";
            document.getElementById("mainHead").style.display = "block"
            delete_cookie("_sales24JWT")
            window.location = "login.html"
        })

}
adsPostedUser()
