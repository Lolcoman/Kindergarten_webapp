var prepinac = document.getElementById("btnPlay");
var audioElements = document.getElementsByTagName('audio');
//$('#btnPlay').click(function () {
//    for (var i = 0; i < audioElements.length; ++i) {
//        audioElements[i].muted = false;
//        //audioElements[i].play();
//    }
//})

$("#pigLink").mouseenter(function () {
    document.getElementById('pigAudio').play();
})
$("#chickenLink").mouseenter(function () {
    document.getElementById('chickenAudio').play();
})
$("#dogLink").mouseenter(function () {
    document.getElementById('dogAudio').play();
})
$("#frogLink").mouseenter(function () {
    document.getElementById('frogAudio').play();
})

function prepni() {
    let string = prepinac.getAttribute('src');

    if ((string === "../../images/volume_mute.png") || (string === "images/volume_mute.png") || (string === "/images/volume_mute.png")){
        prepinac.src = "../../images/volume.png";
        for (var i = 0; i < audioElements.length; ++i) {
            audioElements[i].muted = false;
        }
    }
    else{
        prepinac.src = "../../images/volume_mute.png";
        for (var i = 0; i < audioElements.length; ++i) {
            audioElements[i].muted = true;
        }
    }
}
window.onload = function () {
    prepinac.onclick = prepni;
}