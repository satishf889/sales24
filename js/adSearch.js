var start = true;
var starting = true;
var limit = false;
sessionStorage.removeItem("lastScannedIndex");
document.getElementById("closeButton").onclick = function() {
  window.location = "index1.html";
};

var categoryStart = true;
var postByCategory = async category => {
  var body = JSON.stringify({ lastScannedIndex: false, category });
  if (sessionStorage.getItem("lastSearchedKey") && starting == false) {
    body = JSON.stringify({
      lastScannedIndex: JSON.parse(sessionStorage.getItem("lastSearchedKey")),
      category
    });
    sessionStorage.removeItem("lastSearchedKey");
  }
  var url =
    "https://8xmv9zllk6.execute-api.us-east-1.amazonaws.com/DEV/adspostedbycategory";
  document.getElementById("mainHead").style.display = "block";
  document.getElementById("loader").style.display = "block";
  await fetch(url, {
    Host: "8xmv9zllk6.execute-api.us-east-1.amazonaws.com",
    method: "POST", // or 'PUT',
    body
  })
    .then(res => {
      if (res.status == 400) {
        document.getElementById("mainHead").style.display = "block";
        document.getElementById("loader").style.display = "block";
        return res.text().then(data => {
          document.getElementById("loader").style.display = "none";
          document.getElementById("mainHead").style.display = "block";
        });
      }
      return res.text().then(async data => {
        document.getElementById("mainHead").style.display = "block";
        document.getElementById("loader").style.display = "block";
        var total_data = JSON.parse(data);
        total_data = total_data.ITEMS;
        document.getElementById("lastAd").style.display = "none";
        if (total_data.length == 0) {
          if (starting) {
            document.getElementById("mainHeadCategory").innerHTML = "";
            starting = false;
          }
          document.getElementById("mainHead").style.display = "block";
          document.getElementById("loader").style.display = "none";
          document.getElementById("lastAd").style.display = "block";
          return;
        }
        if (starting) {
          document.getElementById("mainHead").innerHTML = "";
          starting = false;
        }
        var i;
        for (i = 0; i < total_data.length; i++) {
          var color = "grey";
          if (readCookie("_sales24JWT") != "") {
            var flag = await likedADS(total_data[i].AD_KEY);
            if (flag == "true") {
              color = "red";
            }
          }
          generateCard(
            total_data[i].AD_KEY,
            total_data[i].PRODUCT_NAME,
            total_data[i].PRODUCT_DESCRIPTION,
            total_data[i].PRODUCT_PRICE,
            total_data[i].PRODUCT_LOCATION,
            total_data[i].S3_LOCATION,
            color,
            total_data[i].LIKES,
            "mainHead"
          );

          if (i == total_data.length - 1) {
            document.getElementById("mainHead").style.display = "block";
            document.getElementById("loader").style.display = "none";
          }
          if (limit && i == 3) {
            document.getElementById("mainHead").style.display = "block";
            document.getElementById("loader").style.display = "none";
            if (total_data.length > i) {
              document.getElementById("lastAd").style.display = "block";
              document.getElementById("searchMore").style.display = "none";
            }
            break;
          }
        }
        document.getElementById("lastAd").style.display = "block";
        if (sessionStorage.getItem("lastSearchedKey") != null) {
          document.getElementById("lastAd").style.display = "none";
          document.getElementById("searchMore").style.display = "block";
        }
      });
    })
    .catch(err => {
      alert("Something Went Wrong.");
      document.getElementById("loader").style.display = "none";
      document.getElementById("mainHead").style.display = "block";
      window.location = "index1.html";
    });
};

const params = new URLSearchParams(document.location.search);
const adId = params.get("key");
const category = params.get("category");
document.getElementById("productCategory").addEventListener("change", e => {
  e.preventDefault();
  sessionStorage.removeItem("lastSearchedKey");
  var category = document.getElementById("productCategory").value;
  document.getElementById("mainHead").innerHTML = "";
  postByCategory(category);
});
if (adId == "recent") {
  document.getElementById("pageHeading").innerText = "Recently Posted ADs";
  sessionStorage.removeItem("lastSearchedKey");
  recentlyAdsPosted();
} else if (category) {
  var all_categories = [
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Two Wheeler",
    "Four Wheeler",
    "Other"
  ];
  var flag = false;
  sessionStorage.removeItem("lastSearchedKey");
  all_categories.filter(array_category => {
    if (array_category == category) {
      flag = true;
    }
  });
  if (!flag) {
    alert("Searched Category not available");
    window.location = "index1.html";
  }
  document.getElementById("productCategoryDiv").style.display = "block";
  document.getElementById("pageHeading").innerText =
    "ADs Posted in " + category;
  postByCategory(category);
} else {
  alert("Could not find page.");
  window.location = "index1.html";
}

document.getElementById("searchMore").addEventListener("click", e => {
  if (adId) {
    recentlyAdsPosted();
  } else {
    postByCategory(category);
  }
});
