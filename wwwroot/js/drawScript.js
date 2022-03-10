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
//pro kolčeko
var circleOnlyOne = true;
var IsCircleFillShow = false;
var filledCircle = false;
var IsNormalDraw = false;
var IsLineDraw = false;
var cnvBackground;
//pro sprej
var points = 5;
var spread = 20;
var onlyOneSpray = true;
var IsSprayShow = false;
var IsFillShow = false;

function setup() {
    if (window.innerWidth <= 1600) {
        x = 1100;
        y = 600;
    }
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
    var circleDraw = createDiv().parent(settings);
    circleDraw.id('circleDiv');
    var sprayDiv = createDiv().parent(settings);
    sprayDiv.id('sprayDiv');
    var lineDiv = createDiv().parent(settings);
    lineDiv.id('lineDiv');
    var normalDiv = createDiv().parent(settings);
    normalDiv.id('normalDiv');
    var rubberDiv = createDiv().parent(settings);
    rubberDiv.id('rubberDiv');
    createP('Barva štětce &#128396;').parent(settingsTitles).style('margin-left:5px');
    createP('Barva pozadí &#128444;').parent(settingsTitles).style('margin-left:5px');
    createP('Tloušťka štětce &#10687;').parent(settingsTitles).style('margin-left:5px');
    paintColor = createColorPicker('black').parent(settingsValues).style('margin-top:10px;width: 55px; height: 55px');
    backgroundColor = createColorPicker('white').parent(settingsValues).style('margin-top: 10px; width: 55px; height: 55px;');
    backgroundColor.id('background');
    document.getElementById("background").title = 'Pouze před kreslením!';
    //backgroundColor.changed(backgroundChange);
    cnvBackground = document.getElementById('background');
    paintWidth = createSelect(false).parent(settingsValues).style('margin-top: 10px');
    paintWidth.option('4');
    paintWidth.option('8');
    paintWidth.option('12');
    paintWidth.option('16');
    paintWidth.selected('12');
    //sprej
    sprayBtn = createButton('').parent(sprayDiv).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px;backgroundImage: url(../images/spray_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    sprayBtn.id('spray');
    //obrázek čáry
    lineBtn = createButton('').parent(lineDiv).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px; backgroundImage: url(../images/line_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    lineBtn.id('line');
    //normální
    drawBtn = createButton('').parent(normalDiv).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px;backgroundImage: url(../images/normal_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    drawBtn.id('normal');
    //kolečko
    circleBtn = createButton('').parent(circleDiv).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px;backgroundImage: url(../images/circle_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    circleBtn.id('circle');
    //guma
    rubberBtn = createButton('').parent(rubberDiv).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px;backgroundImage: url(../images/rubber_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    rubberBtn.id('rubber');
    //čtverec
    rectBtn = createButton('').parent(rectDraw).style('margin-top: 20px; width: 55px; height: 55px; margin-left: 20px;backgroundImage: url(../images/rect_vector.png);backgroundRepeat: no-repeat;background-position: center;backgroundSize: 50px 50px;');
    rectBtn.id('rect');
    clearBtn = createButton('Smazat').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 175px');
    clearBtn.id('clear');
    downloadBtn = createButton('Stáhnout').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 20px');
    downloadBtn.id('download');
    lastDiv = createDiv('posledni').parent(my_canvas);
    lastDiv.id('lastDiv');
}

function draw() {
    background(backgroundColor.value());
    clearBtn.mousePressed(clearCanvas);
    downloadBtn.mousePressed(saveToFile);

    //normální kreslení
    document.getElementById('normal').onclick = function () {
        if (IsSprayShow) {
            sprayHide();
        }
        if (IsFillShow) {
            fillHide();
        }
        if (IsCircleFillShow) {
            fillCircleHide();
        }
        drawNormal();
    }
    //čára
    document.getElementById('line').onclick = function () {
        if (IsSprayShow) {
            sprayHide();
        }
        if (IsFillShow) {
            fillHide();
        }
        if (IsCircleFillShow) {
            fillCircleHide();
        }
        drawLine();
    }
    //čtverec
    document.getElementById('rect').onclick = function () {
        if (IsSprayShow) {
            sprayHide();
        }
        if (onlyOne) {
            btnFill = createButton('').parent(rectDraw).style('margin-top: 10px; width: 55px; height: 55px; display: block; margin-left: 20px');
            btnFill.id('fillRect');
            fillRect.style.backgroundImage = "url('../images/noFill_vector.png')";
            onlyOne = false;
            IsFillShow = true;
        }
        else {
            fillShow();
        }
        //přepnutí výplně a následné kreslení
        document.getElementById('fillRect').onclick = function () {
            if (filled) {
                filled = false;
                fillRect.style.backgroundImage = "url('../images/noFill_vector.png')";
            }
            else {
                filled = true;
                fillRect.style.backgroundImage = "url('../images/yesFill_vector.png')";
            }
            drawRect();
        };
       drawRect();
    }
    //sprej
    document.getElementById('spray').onclick = function () {
        if (IsFillShow) {
            fillHide();
        }
        if (IsCircleFillShow) {
            fillCircleHide();
        }
        if (onlyOneSpray) {
            IsSprayShow = true;
            sliderPoints = createSlider(0, 30, 5, 5).parent(sprayDiv).style("display:block;margin-left:20px;");
            sliderPoints.id('sliderPoints');
            valueDisplayer = createP().parent(sprayDiv).style("margin-top:0;margin-bottom:0;margin-left:20px;display:block;font-size:18px;");
            valueDisplayer.id('valueDisplayer');
            sliderSpreads = createSlider(0, 40, 20, 5).parent(sprayDiv).style("display:block;margin-left:20px;");
            sliderSpreads.id('sliderSpreads');
            valueDisplayer1 = createP().parent(sprayDiv).style("margin-top:0;margin-bottom:0;margin-left:20px;display:block;font-size:18px;");
            valueDisplayer1.id('valueDisplayer1');
            onlyOneSpray = false;
        }
        else {
            sprayShow();
        }
        spray();
    }
    //guma
    document.getElementById('rubber').onclick = function () {
        if (IsSprayShow) {
            sprayHide();
        }
        if (IsFillShow) {
            fillHide();
        }
        if (IsCircleFillShow) {
            fillCircleHide();
        }
        rubber();
    }
    //kolčeko
    document.getElementById('circle').onclick = function () {
        if (IsSprayShow) {
            sprayHide();
        }
        if (IsFillShow) {
            fillHide();
        }
        if (circleOnlyOne) {
            btnCircleFill = createButton('').parent(circleDiv).style('margin-top: 10px; width: 55px; height: 55px; display: block; margin-left: 20px');
            btnCircleFill.id('fillCircle');
            fillCircle.style.backgroundImage = "url('../images/noFill_vector.png')";
            circleOnlyOne = false;
            IsCircleFillShow = true;
        }
        else {
            fillCircleShow();
        }
        document.getElementById('fillCircle').onclick = function () {
            if (filledCircle) {
                filledCircle = false;
                fillCircle.style.backgroundImage = "url('../images/noFill_vector.png')";
            }
            else {
                filledCircle = true;
                fillCircle.style.backgroundImage = "url('../images/yesFill_vector.png')";
            }
            drawCircle();
        };
        drawCircle();
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
}
//kreslení normální
function drawNormal() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(60);
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            //pokud je pMouseX -1, nastaví se na aktuální
            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
            //pokud jsou nastaveny předchozí hodnoty, nakreslí se čára na aktuální hodnoty myši
            else {
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
        }
        //když se pustí tlačítko, nastaví se hodnoty zpátky na výchozí -1
        else {
            previousMouseX = -1;
            previousMouseY = -1;
        }
    };
}
//kreslení čáry
function drawLine() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(60);
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            //drawBtn.mousePressed(drawNormal);
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
//kreslení čtverce
function drawRect() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(60);
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
//sprej
function spray() { 
    this.draw = function () {
        //výpis hodnoty
        valueDisplayer.html('Tečky: ' + sliderPoints.value());
        valueDisplayer1.html('Velikost: ' + sliderSpreads.value());
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(10);
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            points = sliderPoints.value();
            spread = sliderSpreads.value()
            for (var i = 0; i < points; i++) {
                point(random(mouseX - spread, mouseX + spread), random(mouseY - spread, mouseY + spread));
            }
        }
    };
}
function rubber() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        //pokud je kliknuto na canvas levým tlačítkem, tak se začne kreslit
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(60);
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(backgroundColor.value());
            //pokud je pMouseX -1, nastaví se na aktuální
            if (previousMouseX == -1) {
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
            //pokud jsou nastaveny předchozí hodnoty, nakreslí se čára na aktuální hodnoty myši
            else {
                line(previousMouseX, previousMouseY, mouseX, mouseY);
                previousMouseX = mouseX;
                previousMouseY = mouseY;
            }
        }
        //když se pustí tlačítko, nastaví se hodnoty zpátky na výchozí -1
        else {
            previousMouseX = -1;
            previousMouseY = -1;
        }
    }
}
function drawCircle() {
    this.draw = function () {
        clearBtn.mousePressed(clearCanvas);
        downloadBtn.mousePressed(saveToFile);
        if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
            frameRate(60);
            cnvBackground.disabled = true;
            strokeWeight(paintWidth.value());
            stroke(paintColor.value());
            //nastavení výplně čtverce
            if (filledCircle == true) {
                fill(paintColor.value());
            }
            else {
                noFill();
            }
            if (startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                drawing = true;
                loadPixels();
            }

            else {
                updatePixels();
                ellipse((startMouseX + mouseX) / 2, (startMouseY + mouseY) / 2, startMouseX - mouseX, startMouseY - mouseY);
            }

        }

        else if (drawing) {
            loadPixels();
            drawing = false;
            startMouseX = -1;
            startMouseY = -1;
        }
    };
}
function sprayHide() {
    IsSprayShow = false;
    document.getElementById('sliderPoints').style.display = 'none';
    document.getElementById('valueDisplayer').style.display = 'none';
    document.getElementById('sliderSpreads').style.display = 'none';
    document.getElementById('valueDisplayer1').style.display = 'none';
}
function sprayShow() {
    IsSprayShow = true;
    document.getElementById('sliderPoints').style.display = 'block';
    document.getElementById('valueDisplayer').style.display = 'block';
    document.getElementById('sliderSpreads').style.display = 'block';
    document.getElementById('valueDisplayer1').style.display = 'block';
}
function fillHide() {
    IsFillShow = false;
    document.getElementById('fillRect').style.display = 'none';
}
function fillShow() {
    IsFillShow = true;
    document.getElementById('fillRect').style.display = 'block';
}

function fillCircleHide() {
    IsCircleFillShow = false;
    document.getElementById('fillCircle').style.display = 'none';
}
function fillCircleShow() {
    IsCircleFillShow = true;
    document.getElementById('fillCircle').style.display = 'block';
}