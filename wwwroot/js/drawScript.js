var lines = [] //pole pro čáry
var paintColor; //barva štětce
var backgroundColor; //barva pozadí
var paintWidth; //tloušťka štetce
var clearBtn; //btn smazání
var drawplate; //canvas
var x = 1400; //šířka canvasu
var y = 700; //výška canvasu
var startMouseX = -1;
var startMouseY = -1;
var drawing = false;
var self = this;
var filled = false;
var onlyOne = true;
var IsNormalDraw = false;
var IsLineDraw = false;
var cnvBackground;

function setup() {
    lines = [];
    drawplate = createCanvas(x, y);
    drawplate.id('my_canvas');
    drawplate.position(260, 300,'sticky');
    var settings = createDiv();
    settings.id('settings');
    var settingsTitles = createDiv().parent(settings);
    settingsTitles.id('settingsTitles');
    var settingsValues = createDiv().parent(settings);
    settingsValues.id('settingsValues');
    var rectDraw = createDiv().parent(settings);
    rectDraw.id('rectDraw');
    createP('Barva štětce &#128396;').parent(settingsTitles).style('margin-left:5px');
    createP('Barva pozadí &#128444;').parent(settingsTitles).style('margin-left:5px');
    createP('Tloušťka štětce &#10687;').parent(settingsTitles).style('margin-left:5px');
    paintColor = createColorPicker('white').parent(settingsValues).style('margin-top:10px;width: 55px; height: 55px');
    backgroundColor = createColorPicker('grey').parent(settingsValues).style('margin-top: 10px; width: 55px; height: 55px');
    backgroundColor.id('background');
    //backgroundColor.changed(backgroundChange);
    cnvBackground = document.getElementById('background');
    paintWidth = createSelect(false).parent(settingsValues).style('margin-top: 10px');
    paintWidth.option('4');
    paintWidth.option('8');
    paintWidth.option('12');
    paintWidth.option('16');
    paintWidth.selected('12');
    //obrázek čáry
    lineBtn = createButton('').parent(settings).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 5px; backgroundImage: url(../images/line.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    lineBtn.id('line');
    //normální
    drawBtn = createButton('').parent(settings).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 5px;backgroundImage: url(../images/normal.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    drawBtn.id('normal');
    //čtverec
    rectBtn = createButton('').parent(rectDraw).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 5px;backgroundImage: url(../images/rect.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    rectBtn.id('rect');
    clearBtn = createButton('Smazat').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 450px');
    clearBtn.id('clear');
    downloadBtn = createButton('Stáhnout').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 20px');
    downloadBtn.id('download');
}

function draw() {
    background(backgroundColor.value());
    clearBtn.mousePressed(clearCanvas);
    downloadBtn.mousePressed(saveToFile);

    //normální kreslení
    document.getElementById('normal').onclick = function () {
        drawNormal();
    }
    //čára
    document.getElementById('line').onclick = function () {
        drawLine();
    }
    //čtverec
    document.getElementById('rect').onclick = function () {
        if (onlyOne) {
            btnFill = createButton('').parent(rectDraw).style('margin-top: 10px; width: 55px; height: 55px; display: block; margin-left: 5px');
            btnFill.id('fillRect')
            fillRect.style.backgroundImage = "url('../images/rect.png')";
            onlyOne = false;
        }
        //přepnutí výplně a následné kreslení
        document.getElementById('fillRect').addEventListener('click', function () {
            if (filled) {
                filled = false;
                fillRect.style.backgroundImage = "url('../images/rect.png')";
            }
            else {
                filled = true;
                fillRect.style.backgroundImage = "url('../images/rectFill.png')";
            }
            drawRect();
        });
        drawRect();
    }
}
//uložení canvasu jako 'png'
function saveToFile() {
    saveCanvas('mycanvas', 'png')
}
//smazání canvasu
function clearCanvas()
{
    clear();
    background(backgroundColor.value());
    cnvBackground.disabled = false;
    lines = []
}
//kreslení normální
function drawNormal() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit

        //KLIKNUTÍ PRAVÝM
        if (mouseButton == RIGHT && mouseX < x && mouseY < y) {
            return false;
        }
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            cnvBackground.disabled = true;
            var linee = new NewLine(paintColor.value(), paintWidth.value());
            lines.push(linee);
        }
        for (var element of lines) {
            element.show()
        }
    }
}
//kreslení čáry
function drawLine() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            drawBtn.mousePressed(drawNormal);
            //if it's the start of drawing a new line
            if (startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                drawing = true;
                //uložení do pixel array
                loadPixels();
            }

            else {
                //načtení pixel array
                updatePixels();
                //kreslení čáry
                line(startMouseX, startMouseY, mouseX, mouseY);
            }
        }
        else if (drawing) {
            //načtení pixel array
            loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
    }
}

function drawRect() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            //nastavení výplně čtverce
            if (filled == true) {
                fill(paintColor.value());
            }
            else {
                noFill();
            }
            if (startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                drawing = true;
                //načtení pixel array
                loadPixels();
            }

            else {
                //načtení pixel array
                updatePixels();
                //kreslení čtverce
                rect(startMouseX, startMouseY, mouseX - startMouseX, mouseY - startMouseY);
            }

        }
        else if (drawing) {
            //načtení pixel array
            loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
    }
}