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
var IsNormalDraw = false;
var IsLineDraw = false;

function setup() {
    lines = [];
    drawplate = createCanvas(x,y);
    drawplate.id('my_canvas');
    drawplate.position(260, 300,'sticky');
    var settings = createDiv();
    settings.id('settings');
    var settingsTitles = createDiv().parent(settings);
    settingsTitles.id('settingsTitles');
    var settingsValues = createDiv().parent(settings);
    settingsValues.id('settingsValues');
    createP('Barva štětce &#128396;').parent(settingsTitles).style('margin-left:5px');
    createP('Barva pozadí &#128444;').parent(settingsTitles).style('margin-left:5px');
    createP('Tloušťka štětce &#10687;').parent(settingsTitles).style('margin-left:5px');
    paintColor = createColorPicker('white').parent(settingsValues).style('margin-top:10px;width: 50px; height: 50px');
    backgroundColor = createColorPicker('grey').parent(settingsValues).style('margin-top: 10px; width: 50px; height: 50px');
    paintWidth = createSelect(false).parent(settingsValues).style('margin-top: 10px');
    paintWidth.option('4');
    paintWidth.option('8');
    paintWidth.option('12');
    paintWidth.option('16');
    paintWidth.selected('12');
    lineBtn = createButton('čára').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 50px');
    drawBtn = createButton('normální').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 5px');
    clearBtn = createButton('Smazat').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 450px');
    clearBtn.id('clear');
    downloadBtn = createButton('Stáhnout').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 20px');
    downloadBtn.id('download');
}

function draw() {
    background(backgroundColor.value());
    clearBtn.mousePressed(clearCanvas);
    downloadBtn.mousePressed(saveToFile);

    lineBtn.mousePressed(lineToTool);
    drawBtn.mousePressed(drawNormal);

    if (IsLineDraw) {
        for (var element of lines) {
            element.show()
        }
        this.draw = function () {
            //only draw when mouse is clicked
            if (mouseIsPressed) {
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
        };
    }

    if (IsNormalDraw) {
        this.draw = function () {
            if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
                var linee = new NewLine(paintColor.value(), paintWidth.value());
                lines.push(linee);
            }
            for (var element of lines) {
                element.show()
            }
        }
    }
}
    //cyklus pro kliknutí a držení myši na canvasu
    //if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
    //    var linee = new NewLine(paintColor.value(), paintWidth.value());
    //    lines.push(linee);
    //}
    ////vykreslení čar z pole lines na canvas
    //for(var element of lines){
    //    element.show()
    //}
//uložení canaasu jako 'png'
function saveToFile() {
    saveCanvas('mycanvas', 'png')
}
//smazání canvasu
function clearCanvas()
{
    lines = []
}

function drawNormal() {
    IsNormalDraw = true;
    IsLineDraw = false;
    return
}

function lineToTool() {
    IsLineDraw = true;
    IsNormalDraw = false;
}