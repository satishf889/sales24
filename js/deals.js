var start = true;
var starting=true;
var starting_category=true;
document.getElementById("searchMoreCategory").addEventListener('click',(e)=>{
    e.preventDefault()
    var url="adSearch.html?category="+(document.getElementById("productCategory").value)
    window.location=url
})

document.getElementById("closeButton").onclick = function() {
    window.location = "index1.html";
  };
  
document.getElementById('productCategory').addEventListener('change', (e) => {
    e.preventDefault()
    var category = document.getElementById('productCategory').value
    document.getElementById('mainHeadCategory').innerHTML = ""
    postByCategory(category)
})


function seeMore(id) {
    var url = "adSearch.html?key=" + id
    window.location = url
}

var categoryStart = true
var limit=true
postByCategory("Electronics")
recentlyAdsPosted()
sessionStorage.removeItem("lastSearchedKey");