/**
* * významné
* ! důležité
* todo: dodělat
* ? zamyslet se
*/
localStorage.clear();
const info = document.getElementById("info");
const idname = document.getElementById("idname");
const name = document.getElementById("name");
const inpFile = document.getElementById("inpFile");
var btnUpload;
const btnDownload = document.getElementById("btnDownload");
var btnNumber = document.getElementById("btnNumber");
var gameName;
var downloadImg;
//var frame = document.getElementById("frame");
var input;
const parent = document.getElementById("form");
var IsCreated = false;
var i = 0;
var k = 0;
var names;
var IsDownloaded = false;

//výběr z dropdown
document.getElementById("gameName").onchange = function () {
    var selectValue = document.getElementById("gameName").value;
    if (selectValue == "") {
        return;
    }
    if (!IsDownloaded) {
        localStorage.clear();
        info.innerHTML = "Náhled pexesa";
        var again = document.createElement("button");
        again.textContent = "Znovu?";
        again.id = "btnAgain";
        again.setAttribute("onclick", "again()");
        var next = document.createElement("button");
        next.textContent = "Vytvořit";
        next.id = "btnCreate";
        next.setAttribute("onclick", "create()");

        document.body.appendChild(again);
        document.body.appendChild(next);

        btnNumber.style.display = "none";
        idname.style.display = "none";
        name.style.display = "none";
        names = selectValue;
        download();
        IsDownloaded = true;
        //alert(selectValue);
    }
    else {
        localStorage.clear();
        document.querySelectorAll("img").forEach(img => img.remove());
        names = selectValue;
        download();
    }
}

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
    //debugger;
    var number = document.getElementById("idname").value;
    if (IsCreated != true) {
        for (let i = 0; i < number; i++) {
            //* VYTVOŘENÍ DIVU 
            var iDiv = document.createElement('div');
            iDiv.id = 'block'
            //iDiv.className = 'item';
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
            inputField.required = true;
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

            input = document.querySelectorAll('input[type=file]');
            var nextInp = document.getElementById('inp' + k);
            nextInp.style.display = "inline";
        }
        IsCreated = true;

        //*TEST SUBMIT buttonu
        var sumbitBtn = document.createElement("input");
        sumbitBtn.setAttribute("type", "submit");
        sumbitBtn.id = "btnUpload";
        sumbitBtn.value = "Nahrát soubory";
        parent.appendChild(sumbitBtn);
        btnUpload = document.getElementById("btnUpload");
        //! Schová btn pro vytvoření
        btnNumber.style.display = "none";
        //! Test btn znovu
        var again = document.createElement("button");
        again.textContent = "Znovu?";
        again.id = "btnAgain";
        again.setAttribute("onclick", "again()")
        document.body.appendChild(again);

        //parent.onsubmit = post();
        parent.setAttribute("onsubmit", "post();return false");
        return
    }
}

function again() {
    if (confirm('Chcete začít znovu?')) {
        i = 0;
        k = 0;
        location.reload();
    }
}


function post() {
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
    localStorage.setItem("images", data);
    gameName = document.getElementById('name').value;
    data.append("name", gameName);
    console.log(data.getAll('files'));

    $.ajax({
        type: 'POST',
        url: '/api/fileupload/upload',
        cache: false,
        processData: false,
        timeout: 0,
        data: data,
        enctype: "multipart/form-data",
        contentType: false,
        success: function (result) {
            console.log(result);
            alert("Nyní vyberte vytvořené pexeso");
            location.reload();
            //localStorage.setItem("game", name);
            //localStorage.setItem("images", JSON.stringify(response));
            //window.location.href = '/Home/Memory';
        },
        error: function (err) {
            console.log(err);
        }
    })
    console.log(data);
}

function download() {
    $.ajax({
        type: 'GET',
        url: '/api/fileupload/download' + "?" + "name=" + names,
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
                img.src = "data:image/png;base64," + response[i];
                img.style.height = "100px";
                img.style.width = "100px";
                parent.appendChild(img);
                //localStorage.setItem(names + i, response[i]);
                localStorage.setItem("game", name);
                localStorage.setItem("images", JSON.stringify(response));
                //window.location.href = '/Home/Memory';
                //createImage(response[i])
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function create() {
    if (confirm('Opravdu chcete vytvořit pexeso?')) {
        // Save it!
        window.location.href = '/Home/Memory';
    } else {
        // Do nothing!
        return
    }
}
