var prepinac = document.getElementById("btnPlay");
var audioElements = document.getElementsByTagName('audio');


function prepni() {
    sessionStorage.setItem("audio", "play");
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
    if (sessionStorage.getItem("audio") == "play") {
        prepinac.src = "../../images/volume.png";
        for (var i = 0; i < audioElements.length; ++i) {
            audioElements[i].muted = false;
        }
    }

    prepinac.onclick = prepni;
}

$("#pigLink").mouseenter(function () {
    timer = setTimeout(function () {
        document.getElementById('pigAudio').play();
    }, 1000);
})
$("#pigLink").mouseleave(function () {
    clearTimeout(timer);
})

$("#chickenLink").mouseenter(function () {
    timer = setTimeout(function () {
        document.getElementById('chickenAudio').play();
    }, 1000);
})
$("#chickenLink").mouseleave(function () {
    clearTimeout(timer);
})

$("#dogLink").mouseenter(function () {
    timer = setTimeout(function () {
        document.getElementById('dogAudio').play();
    }, 1000);
})
$("#dogLink").mouseleave(function () {
    clearTimeout(timer);
})

$("#frogLink").mouseenter(function () {
    timer = setTimeout(function () {
        document.getElementById('frogAudio').play();
    }, 1000);
})
$("#frogLink").mouseleave(function () {
    clearTimeout(timer);
})