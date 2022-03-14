let test = document.getElementsByClassName("container");
console.log(test)

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
var deleted;
var IsDownloaded = false;

//výběr z dropdown
document.getElementById("gameName").onchange = function () {
    if (window.innerWidth <= 735) {
        document.body.querySelector('footer').style.bottom = "auto";
    }
    var selectValue = document.getElementById("gameName").value;
    deleted = selectValue;
    if (selectValue == "") {
        return;
    }
    if (!IsDownloaded) {
        localStorage.clear();
        info.innerHTML = "Náhled pexesa";

        var del = document.createElement('button');
        del.id = 'btnDelete';
        del.textContent = "Smazat pexeso ";
        del.setAttribute("onclick", "deletePex()");
        del.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-trash-can"></i>');

        var again = document.createElement("button");
        again.textContent = "Znovu ";
        again.id = "btnAgain";
        again.setAttribute("onclick", "again()");
        again.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-repeat"></i>');

        var next = document.createElement("button");
        next.textContent = "Vytvořit";
        next.id = "btnCreate";
        next.setAttribute("onclick", "create()");


        test[0].appendChild(del);
        test[0].appendChild(again);
        test[0].appendChild(next);
        //document.body.appendChild(again);
        //document.body.appendChild(next);

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
        //document.body.onfocus = function () { setTimeout(checkOnCancel(event.target.files[0]), 100); };
        img.src = URL.createObjectURL(event.target.files[0]);
        i++;
    }
}

//změna při onchange eventu
function disableInput() {
    if (k != input) {
        var inp = document.getElementById('inp' + k);
        if (checkOnCancel(inp)) {
            inp.style.display = "none";
            input.disabled = "true";
            var nextInp = document.getElementById('inp' + (k + 1));
            nextInp.style.display = "inline";
            k++;
        }
    }
}
//kontrola zda byl vybrán soubor
function checkOnCancel(fileSelectEle) {
    if (fileSelectEle.value.length == 0) {
        //alert("Nebyl vybrán žádný soubor!");
        swal("Nebyl vybrán žádný soubor!","warning");
        document.body.onfocus = null;
        return false
    }
    else {
        document.body.onfocus = null;
        return true
    }
    //document.body.onfocus = null;
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
            //inputField.onclick = disableInput;

            inputField.onchange = disableInput

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

        document.querySelector("h3").style.display = "none";
        document.getElementById("gameName").style.display = "none";
        document.getElementById("firstLine").style.display = "none";
        document.getElementById("secondLine").style.display = "none";



        //var del = document.createElement('button');
        //del.id = 'btnDelete';
        //del.textContent = "Smazat pexeso ";
        //del.setAttribute("onclick", "deletePex()");
        //del.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-trash-can"></i>');
        //document.body.appendChild(del);

        //! Test btn znovu
        var again = document.createElement("button");
        again.textContent = "Znovu ";
        again.id = "btnAgain";
        again.insertAdjacentHTML("beforeend", '<i class="fa-solid fa-repeat"></i>');
        again.setAttribute("onclick", "again()");
        document.body.appendChild(again);

        //parent.onsubmit = post();
        parent.setAttribute("onsubmit", "post();return false");
        return
    }
}

function again() {
    swal({
        title: "Chcete začít znovu?",
        icon: "info",
        buttons: ["Zrušit", true],
        dangerMode: true,
    })
    .then((willAgain) => {
        if (willAgain) {
            i = 0;
            k = 0;
            location.reload();
        } else {
            return
        }
    });
    //if (confirm('Chcete začít znovu?')) {
    //    i = 0;
    //    k = 0;
    //    location.reload();
    //}
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
            //alert("Nyní vyberte vytvořené pexeso");
            swal({
                title: "Pexeso bylo nahráno!",
                text: "Nyní vyberte vytvořené pexeso",
                type: "success"
            }).then(function () {
                location.reload();
            });
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
    swal({
        title: "Opravdu chcete vytvořit pexeso?",
        icon: "info",
        buttons: ["Zrušit", {
            text: "OK",
            value: true,
            visible: true,
            className: "btn-ok",
            closeModal: true,
        }],
        className: ["class1", "btn-ok"]
    })
    .then((willAgain) => {
        if (willAgain) {
            window.location.href = '/Home/Memory';
        } else {
            return
        }
    });
    //if (confirm('Opravdu chcete vytvořit pexeso?')) {
    //    window.location.href = '/Home/Memory';
    //} else {
    //    return
    //}
}

function deletePex() {
    swal({
        title: "Opravdu chcete pexeso smazat?",
        text: "Změna je nevratná, pexeso nelze obnovit!",
        icon: "warning",
        buttons: ["Zrušit!", true],
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'POST',
                url: '/api/DeleteFile/PexDelete' + "?" + "name=" + deleted,
                timeout: 0,
                success: function (response) {
                    swal("Pexeso bylo smazáno!", {
                        icon: "success",
                    }).then(function () {
                        location.reload();
                    });
                },
                error: function (err) {
                    console.log(err.responseJSON.title);
                    swal({
                        title: "Pexeso nebylo smazáno!",
                        text: err.responseJSON.title,
                        icon: "error",
                    });
                }
            })
        }
    });
}