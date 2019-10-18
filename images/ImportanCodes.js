 //getting image data
 var image_data = async function (key) {
        var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/getimage"
        fetch(url, {
            Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
            method: 'POST', // or 'PUT'
            body: JSON.stringify({ key }),
            headers: {
                'Authorization': user_data.Token
            }
        }).then((res) => {
            return res.text().then((data) => {
                document.getElementById(key).src = data
            }).catch((err)=>{
                return err
            })})
    .catch((err) => {
            alert("Something went wrong.Please login again.")
            delete_cookie("_sales24JWT")
            window.location="login.html"
        })
    }