document.getElementById("closeButton").addEventListener("click", e => {
  e.preventDefault();
  window.location = "index1.html";
});

var getAdDetail = async function(id) {
  document.addEventListener("click", handler, true);

  function handler(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  var url = "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/adinfo";
  await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: "POST",
    body: JSON.stringify({ AD_KEY: id }),
    headers: {
      "Content-Type": "application/JSON"
    }
  })
    .then(res => {
      if (res.status == 400) {
        delete_cookie("_sales24JWT");
        login();
        return;
      } else if (res.status == 500) {
        alert("Please try again.");
        return;
      }

      return res.text().then(data => {
        data = JSON.parse(data);
        let productDetail = data.productDetail;
        document.getElementById("productNameHead").innerText =
          productDetail.PRODUCT_NAME;
        document.getElementById("productName").innerText =
          productDetail.PRODUCT_NAME;
        document.getElementById("productPrice").innerText =
          productDetail.PRODUCT_PRICE;
        document.getElementById("productLocation").innerText =
          " " + productDetail.PRODUCT_LOCATION;
        document.getElementById("productDescription").innerText =
          productDetail.PRODUCT_DESCRIPTION;
        document.getElementById("productCategory").innerText =
          productDetail.PRODUCT_CATEGORY;
        document.getElementById("productBrand").innerText =
          productDetail.PRODUCT_BRAND;
        document.getElementById("productUsername").innerText = data.fullName;
        document.getElementById("productImage").src = productDetail.S3_LOCATION;
        document.removeEventListener("click", handler, true);
      });
    })
    .catch(err => {
      alert("Something went wrong. Please login Again");
      delete_cookie("_sales24JWT");
      window.location = "login.html";
    });
};

const params = new URLSearchParams(document.location.search);
const adId = params.get("AD_ID");
if (adId) {
  getAdDetail(adId);
} else {
  window.location = "index1.html";
}

if (readCookie("_sales24JWT") != "") {
  (async () => {
    var flag = (await likedADS(adId)) == "true";
    if (flag) {
      document.getElementById("likeButton").style.color = "red";
    }
  })();
}

var productWishlist = async function(AD_ID, id) {
  const url =
    "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/wishlistad";
  await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: "POST",
    body: JSON.stringify({ AD_KEY: AD_ID }),
    headers: {
      "Content-Type": "application/JSON",
      Authorization: user_data.Token
    }
  })
    .then(res => {
      if (res.status == 400) {
        document.getElementById(id).style.color = "grey";
        return;
      } else if (res.status == 500) {
        alert("Something went wrong.Please try again.");
        return;
      }

      return res.text().then(data => {
        data = JSON.parse(data);
        document.getElementById(id).style.color = "red";
        document.getElementById(id).disabled = false;
      });
    })
    .catch(err => {
      document.getElementById(id).style.color = "grey";
      alert("Something went wrong. Please login Again");
      delete_cookie("_sales24JWT");
      window.location = "login.html";
    });
};

var removeProductWishlist = async (AD_ID, id) => {
  const url =
    "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/removewishlist";
  await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: "POST",
    body: JSON.stringify({ AD_KEY: AD_ID }),
    headers: {
      "Content-Type": "application/JSON",
      Authorization: user_data.Token
    }
  })
    .then(res => {
      if (res.status == 400) {
        document.getElementById(id).style.color = "red";
        return;
      } else if (res.status == 500) {
        alert("Something went wrong.Please try again.");
        return;
      }

      return res.text().then(data => {
        data = JSON.parse(data);
        document.getElementById(id).style.color = "grey";
        document.getElementById(id).disabled = false;
      });
    })
    .catch(err => {
      document.getElementById(id).style.color = "red";
      alert("Something went wrong. Please login Again");
      console.log(err);
      delete_cookie("_sales24JWT");
      window.location = "login.html";
    });
};

document.getElementById("likeButton").addEventListener("click", e => {
  if (readCookie("_sales24JWT") == "") {
    login();
    return;
  }
  var likeButton = document.getElementById("likeButton");
  if (likeButton.style.color == "grey") {
    likeButton.style.color = "red";
    likeButton.disabled = true;
    productWishlist(adId, "likeButton");
    return;
  }
  likeButton.style.color = "grey";
  likeButton.disabled = true;
  removeProductWishlist(adId, "likeButton");
});

var getNumber = async function() {
  if (readCookie("_sales24JWT") == "") {
    login();
    return;
  }
  profile_details();
};

var url =
  "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/me/getmobilenumber";
var profile_details = async () =>{
    document.addEventListener("click", handler, true);

  function handler(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: "POST",
    headers: {
      "Content-Type": "application/text",
      Authorization: user_data.Token
    },
    body: JSON.stringify({ AD_KEY: adId}),
  })
    .then(res => {
      return res.text().then(data => {
        data = JSON.parse(data);
        document.getElementById("mobileNumber").innerText = data.mobileNumber;
        document.getElementById("numberText").style.display = "none";
        document.removeEventListener("click", handler, true);
      });
    })
    .catch(err => {
      alert("Something went wrong. Please login Again");
      console.log(err);
      delete_cookie("_sales24JWT");
      login();
    });
}