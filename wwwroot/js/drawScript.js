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
        //přepnutí výplně
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

function drawNormal() {
    this.draw = function () {
        //background(backgroundColor.value());

        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //background(backgroundColor.value());
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            cnvBackground.disabled = true;
            //background(backgroundColor.value());
            var linee = new NewLine(paintColor.value(), paintWidth.value());
            lines.push(linee);
        }
        for (var element of lines) {
            element.show()
        }
        //background(backgroundColor.value());
    }
}

function drawLine() {
    this.draw = function () {
        //background(backgroundColor.value());
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //only draw when mouse is clicked
        if (mouseIsPressed) {
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());

            //background(backgroundColor.value());

            drawBtn.mousePressed(drawNormal);
            //if it's the start of drawing a new line
            if (startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                drawing = true;
                //save the current pixel Array
                loadPixels();
            }

            else {
                //update the screen with the saved pixels to hide any previous
                //line between mouse pressed and released
                updatePixels();
                //draw the line
                line(startMouseX, startMouseY, mouseX, mouseY);
            }
        }
        else if (drawing) {
            //save the pixels with the most recent line and reset the
            //drawing bool and start locations
            loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
        //background(backgroundColor.value());
    }
}

function drawRect() {
    this.draw = function () {
        //background(backgroundColor.value());
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);

        //only draw when mouse is clicked
        if (mouseIsPressed) {
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            //background(backgroundColor.value());
            if (filled == true) {
                fill(paintColor.value());
            }
            else {
                noFill();
            }

            //if it's the start of drawing a new rectangle
            if (startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                drawing = true;
                //save the current pixel Array
                loadPixels();
            }

            else {
                //update the screen with the saved pixels to hide any previous rectangles
                updatePixels();
                //draw the rectangle
                rect(startMouseX, startMouseY, mouseX - startMouseX, mouseY - startMouseY);
            }

        }

        else if (drawing) {
            //save the pixels with the most recent rectangle and reset the
            //drawing bool and start locations
            loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
        //background(backgroundColor.value());
    }
}