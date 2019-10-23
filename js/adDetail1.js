document.getElementById('closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    window.location = 'index1.html'
})

var getAdDetail=async function(id){
    var url="https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/adinfo"
    await fetch(url, {
        Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
        method: 'POST',
        body: JSON.stringify({ "AD_KEY": id }),
        headers: {
            'Content-Type': 'application/JSON',
        }
    }).then((res) => {
        if (res.status == 400) {
            delete_cookie("_sales24JWT")
            login()
            return
        }
        else if (res.status == 500) {
            alert("Please try again.")
            return
        }

        return res.text().then((data)=>{
            data=JSON.parse(data)
            console.log(data.productDetail)
            let productDetail=data.productDetail
            document.getElementById('productNameHead').innerText=productDetail.PRODUCT_NAME
            document.getElementById('productName').innerText=productDetail.PRODUCT_NAME
            document.getElementById('productPrice').innerText=productDetail.PRODUCT_PRICE
            document.getElementById('productLocation').innerText=" "+productDetail.PRODUCT_LOCATION
            document.getElementById('productDescription').innerText=productDetail.PRODUCT_DESCRIPTION
            document.getElementById('productCategory').innerText=productDetail.PRODUCT_CATEGORY
            document.getElementById('productBrand').innerText=productDetail.PRODUCT_BRAND
            document.getElementById('productUsername').innerText=id.split('/')[0]
            document.getElementById('productImage').src=productDetail.S3_LOCATION
        })
    }).catch((err) => {
        alert("Something went wrong. Please login Again")
        console.log(err)
        //delete_cookie("_sales24JWT")
        //window.location = 'login.html';
    })
}


const params = new URLSearchParams(document.location.search);
const adId = params.get("AD_ID");
if(adId){
getAdDetail(adId)
}
// else{
//     window.location="index1.html"
// }

if(readCookie('_sales24JWT')!=''){
    if(likedADS(adId)=="true"){
        document.getElementById('likeButton').style.color=red
    }
}

document.getElementById('likeButton').addEventListener('click',(e)=>{
    liked(adId)
})