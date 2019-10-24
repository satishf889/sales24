if (readCookie("_sales24JWT") =='') {
    login();
}

var user_data = JSON.parse(readCookie("_sales24JWT"))
document.getElementById("userActions").innerHTML = "Hi, " + user_data.username,
    document.getElementById("lastLogin").innerHTML = "Last Login: " + user_data.lastLogin

var postAdForm = document.getElementById("postAdForm")

postAdForm.addEventListener('submit', async (e) => {
    var productName = document.getElementById('productName').value
    var productDescription = document.getElementById('productDescription').value
    var productCategory = document.getElementById('productCategory').value
    var productPrice = document.getElementById('productPrice').value
    var productLocation = document.getElementById('productLocation').value
    var productBrand = document.getElementById('productBrand').value
    var input = document.querySelector('input[type=file]');
    var file = input.files[0],
        reader = new FileReader();

    var productImage = "";
    document.getElementById("postAdForm").style.display = "none"
    document.getElementById("loader").style.display = "block";
    function image() {
        return new Promise((resolve, reject) => {
            reader.onloadend = function () {
                // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
                var b64 = reader.result.replace(/^data:.+;base64,/, '');
                //console.log(b64); //-> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
                resolve(b64)
            }
            reader.readAsDataURL(file)
        })
    };

    var image_data = await image().then((res) => productImage = res)
    var postUrl = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/postad"
    var post_product = (async () => {
        var body = {
            productName,
            productDescription,
            productCategory,
            productPrice,
            productLocation,
            productImage,
            productBrand
        }
        document.getElementById("postAdForm").style.display = "none"
        document.getElementById("loader").style.display = "block";

        await fetch(postUrl, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'POST',
            'body': JSON.stringify(body),
            headers: {
                'Content-Type': 'application/text',
                'Authorization': user_data.Token,
            }
        }).then((res) => {
            if (res.statusCode == 400) {
                alert("Something went wrong please try again.")
                document.getElementById("postAdForm").style.display = "block"
                document.getElementById("loader").style.display = "none";
                return;
            }
            return res.text().then((data) => {
                alert("Add posted successfully.")
                window.location = 'adsPosted.html'
            })

        }).catch((err) => {
            alert("Something went wrong. Please try again.")
            document.getElementById("postAdForm").style.display = "block"
            document.getElementById("loader").style.display = "none";
            return;

        })
    })
    await post_product()
})
