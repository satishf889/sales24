document.getElementById('closeButton').addEventListener('click', (e) => {
    e.preventDefault()
    window.location = 'index1.html'
})

const params = new URLSearchParams(document.location.search);
const adId = params.get("AD_ID");
// if(adId){
// adSearch(adId)
// }
// else{
//     window.location="index1.html"
// }
