class NewLine{
    constructor(paintColor, paintWidth){
        this.x = mouseX;
        this.y = mouseY;
        this.px = pmouseX;
        this.py = pmouseY;
        this.paintColor = paintColor;
        this.paintWidth = paintWidth;
    }
    show(){
        stroke(this.paintColor);
        strokeWeight(this.paintWidth);
        line(this.x, this.y, this.px, this.py);
    }
}