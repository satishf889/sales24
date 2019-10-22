var myIndex = 0;
  carousel();

  document.getElementById('searchMore').addEventListener('click', (e) => {
    e.preventDefault()
    window.location = "adSearch.html?key=recent"
  })
  
  function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) { myIndex = 1 }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 2000); // Change image every 2 seconds
  }
 var start = true;
var starting=true;
var limit=true
 recentlyAdsPosted()