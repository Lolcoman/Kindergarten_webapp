﻿/**
* * významné
* ! důležité
* todo: dodělat
* ? zamyslet se
*/

const inpFile = document.getElementById("inpFile");
const btnUpload = document.getElementById("btnUpload");
const btnDownload = document.getElementById("btnDownload");
var downloadImg;
//var frame = document.getElementById("frame");
var input;
const parent = document.getElementById("form");
var IsCreated = false;
var i = 0;
var k = 0;
//! DODĚLAT VSTUP PRO NÁZEV PEXESA

//* Náhled obrázku
function preview() {
    if (i != input) {
        var img = document.getElementById('frame' + i);
        img.src = URL.createObjectURL(event.target.files[0]);
        i++;
    }
}

//? asi OK
function disableInput() {
    //if (k == 0) {
    if (k != input) {
        var inp = document.getElementById('inp' + k);
        //var nextInp = document.getElementById('inp' + (k + 1));
        //nextInp.style.display = "none";
        inp.style.display = "none";
        input.disabled = "true";
        var nextInp = document.getElementById('inp' + (k + 1));
        nextInp.style.display = "inline";
        k++;
        //textfield.style.display = "none";
    }
    // }
    // else{
    //     alert("Nahrávní funguje pouze popořadě")
    // }
}

//*VYTVOŘENÍ POČTU PÁRŮ
function CreateNew() {
    var number = document.getElementById("idname").value;
    if (IsCreated != true) {
        for (let i = 0; i < number; i++) {
            //* VYTVOŘENÍ DIVU 
            var iDiv = document.createElement('div');
            iDiv.id = 'block'
            //iDiv.className = 'block';
            parent.appendChild(iDiv);

            //*VYTVOŘENÍ NÁHLEDU
            var newImg = document.createElement("img");
            newImg.id = "frame" + i;
            newImg.src = "";
            newImg.style.width = "100px";
            newImg.style.height = "100px";

            //*VYTVOŘENÍ VSTUPU
            var inputField = document.createElement("input");
            inputField.id = "inp" + i;
            inputField.type = "file";
            inputField.value = "";
            inputField.style.display = "none";
            inputField.accept = "image/png,image/jpeg";
            inputField.oninput = preview;

            inputField.onclick = disableInput;
            //iDiv.appendChild(textfield);

            //*VYTVOŘENÍ POPISU
            var newlabel = document.createElement("Label");
            newlabel.setAttribute("for", inputField);
            newlabel.innerHTML = "Pár " + (i + 1) + " ";
            //textfield.appendChild(newlabel);
            // iDiv.appendChild(newlabel);
            // iDiv.appendChild(textfield);

            iDiv.appendChild(newlabel);
            iDiv.appendChild(inputField);
            iDiv.appendChild(newImg);


            var frame = document.getElementById("frame");

            input = document.querySelectorAll('input[type=file]');
            var nextInp = document.getElementById('inp' + k);
            nextInp.style.display = "inline";
        }
        IsCreated = true;
        return
    }

    if (IsCreated) {
        if (confirm('Chcete začít znovu?')) {
            IsCreated = false;
            //location.reload();
            //iDiv.remove();
            $("div").remove();
            //location.reload();
            i = 0;
            k = 0;
            //newlabel.remove();
            CreateNew();
        }
    }
    else {
        return
    }
}

//* Nahrávní souboru do databáze přes API
btnUpload.addEventListener('click', function () {
    var data = new FormData();
    // for (let i = 0; i < input.length; i++) {
    //     let file = input[i].files[0];
    //     //use file
    //     data.append('file', file);
    // }
    for (let i = 0; i < input.length; i++) {
        //console.log(input[i].files);
        data.append("files", input[i].files[0]);
    }
    data.append("name", "Vánoce");
    console.log(data.getAll('files'));

    $.ajax({
        type: 'POST',
        url: 'https://localhost:44356/api/fileupload/upload',
        cache: false,
        processData: false,
        timeout: 0,
        data: data,
        enctype: "multipart/form-data",
        contentType: false,
        success: function (result) {
            alert(result);
        },
        error: function (err) {
            alert(err);
        }
    })
    console.log(data);
});










btnDownload.addEventListener('click', function () {
    var name = "Vánoce";
    $.ajax({
        type: 'GET',
        url: '/api/fileupload/download' + "?" + "name=" + name,
        timeout: 0,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                console.log(response[i]);
                //console.log(JSON.stringify(response[i]));
                //console.log(JSON.stringify(response[i]));
                //var actual = JSON.parse(atob(response[i]));
                //console.log(actual);
                var img = new Image();
                //img[i] = response[i];
                //var Img = document.createElement('img');
                img.src = "data:image/png;base64,"+ response[i];
                img.style.height = "100px";
                img.style.width = "100px";
                parent.appendChild(img);
                //createImage(response[i])
            }
        },
        error: function (err) {
            console.log(err);
        }
    })

    //var url = "/api/fileupload/download?" + $.param({ name: "Vánoce" })
    //var xmlHTTP = new XMLHttpRequest();
    //xmlHTTP.open('GET', url, true);
    //xmlHTTP.responseType = 'arraybuffer';
    //xmlHTTP.onload = function (e) {
    //    var arr = new Uint8Array(this.response);
    //    var raw = String.fromCharCode.apply(null, arr);
    //    var b64 = btoa(raw);
    //    var dataURL = "data:image/png;base64," + b64;
    //    console.log(b64);
    //    var img = document.createElement('img');
    //    img.style.height = "100px";
    //    img.style.width = "100px";
    //    img.src = dataURL;
    //    parent.appendChild(img);
    //};
    //xmlHTTP.send();
})