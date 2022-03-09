localStorage.clear();
var inputs = [document.getElementById('start'), document.getElementById('finish')];
start.onchange = evt => {
    const [file] = start.files
    if (file) {
        startPreview.style.display = "inline";
        startPreview.src = URL.createObjectURL(file)
    }
}
finish.onchange = evt => {
    const [file] = finish.files
    if (file) {
        finishPreview.style.display = "inline";
        finishPreview.src = URL.createObjectURL(file)
    }
}
//Test jestli je nastaveno správně
function isInt(n) {
    if (n % 1 === 0) {
        return true;
    }
    return false
}

function myFunction() {
    let canvasSize = 700;
    let number = document.querySelector('input[name="level"]:checked').value;
    let img = document.getElementById('start');

    let checkNumber = canvasSize / number;

    if (isInt(checkNumber)) {
        localStorage.setItem("Cells", number)
        localStorage.setItem("Canvas", canvasSize)
        //pokud se nevyplní obrázky
        if (inputs[0].value == "") {
            window.location = "Maze"
            var frm = document.getElementsByName('myForm')[0];
            frm.reset();
            return
        }
        for (var i = 0; i < inputs.length; i++) {
            if (i == 0) {
                let reader = new FileReader();
                reader.onload = function () {
                    localStorage.setItem("Start", reader.result)
                }
                reader.readAsDataURL(inputs[0].files[0]);
            }
            if (i == 1) {
                let reader = new FileReader();
                reader.onload = function () {
                    localStorage.setItem("Finish", reader.result)
                }
                reader.readAsDataURL(inputs[1].files[0]);
            }
        }
        window.location = "Maze"
        var frm = document.getElementsByName('myForm')[0];
        //frm.submit(); // Submit the form
        frm.reset();  // Reset all form data
        //return false; // Prevent page refresh
    }
    else {
        alert('Sloupec/Řádek : Velikost bludiště musí být celé číslo! Změnte počet polí nebo velikost!')
        //continue
    }
}