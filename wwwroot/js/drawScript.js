var lines = [] //pole pro čáry
var paintColor; //barva štětce
var backgroundColor; //barva pozadí
var paintWidth; //tloušťka štetce
var clearBtn; //btn smazání
var drawplate; //canvas
var x = 1400; //šířka canvasu
var y = 700; //výška canvasu

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
    clearBtn = createButton('Smazat').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 450px');
    clearBtn.id('clear');
    downloadBtn = createButton('Stáhnout').parent(settings).style('margin-top: 20px; width: 150px; height: 50px; margin-left: 20px');
    downloadBtn.id('download');
}

function draw() {
    background(backgroundColor.value());
    clearBtn.mousePressed(clearCanvas);
    downloadBtn.mousePressed(saveToFile);
    //cyklus pro kliknutí a držení myši na canvasu
    if (mouseIsPressed && mouseX < x && mouseY < y && mouseButton == LEFT) {
        var line = new NewLine(paintColor.value(), paintWidth.value());
        lines.push(line);
    }
    //vykreslení čar z pole lines na canvas
    for(var element of lines){
        element.show()
    }
}
//uložení canaasu jako 'png'
function saveToFile() {
    saveCanvas('mycanvas', 'png')
}
//smazání canvasu
function clearCanvas()
{
    lines = []
}