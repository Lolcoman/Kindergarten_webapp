var imageString;
var moves = 0;
//* rows = řádek
//* cols = sloupec
var cols, rows;
var w = localStorage.getItem("Cells")
var x = localStorage.getItem("Canvas")
w = parseInt(w);
var grid = [];
var img;
var img1;
var check = 0;
var stack = [];
//*aktuální cell
var current;
var a = false;
var message = document.querySelector(".message");
var options = document.querySelector(".options");
var something = true;
var find = false;

//*vytvoří canvas
function setup() {
    createCanvas(x, x);
    cols = floor(width / w);
    rows = floor(height / w);
    frameRate();
    img = loadImage(localStorage.getItem("Start"));
    img1 = loadImage(localStorage.getItem("Finish"));

    //* vytvoření pro každý řádek pole
    for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
            var cell = new Cell(i, j);
            grid.push(cell);
        }
    }

    //!začátek hledání
    //current = grid[0];
    current = grid[floor(random(0, grid.length))];
}

//! HLAVNÍ PROGRAM
function draw() {
    background(51);
    for (var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    var pos = 1;
    //grid[0].show(255, 0, 0, 200);
    grid[grid.length - 1].highlight(pos);
    //grid[grid.length - 1].texture(img1);


    //current.visited = true;
    current.highlight();
    if (check != 2) {
        current.visited = true;
        current.highlight()
        //Krok 1
        var next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            //Krok 2 - vložení aktuálního na zásobník
            stack.push(current);
            //Krok 3 - odstranění zdi
            removeWalls(current, next);
            //Krok 4
            current = next;
        } else if (stack.length != 0) {
            current = stack.pop();
        }
    }
    if (stack.length === 0 && !a) {
        if (current != grid[0] && check != 1) {
            current = grid[0];
            check = 1;
        }
        playGame();
    }
    if (a && stack.length === 0 && current != grid[grid.length - 1]) {
        find = true;
        autoPlay();
        finish();
    }
}

function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}



class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.traversed = false;

        this.checkNeighbors = function () {
            var neighbors = [];

            var top = grid[index(i, j - 1)];
            var right = grid[index(i + 1, j)];
            var bottom = grid[index(i, j + 1)];
            var left = grid[index(i - 1, j)];

            if (top && !top.visited) {
                neighbors.push(top);
            }
            if (right && !right.visited) {
                neighbors.push(right);
            }
            if (bottom && !bottom.visited) {
                neighbors.push(bottom);
            }
            if (left && !left.visited) {
                neighbors.push(left);
            }

            if (neighbors.length > 0) {
                var r = floor(random(0, neighbors.length));
                return neighbors[r];
            } else {
                return undefined;
            }
        };
        this.highlight = function (pos) {
            var x = this.i * w;
            var y = this.j * w;
            //noStroke();
            //image(img,0,0);
            //fill(0, 0, 255, 100);
            //noFill();
            image(img, x, y, w, w);
            noFill();
            rect(x, y, w, w);
            if (pos == 1) {
                image(img1, x, y, w, w);
                noFill();
                rect(x, y, w, w);
            }
        };


        //*ukáztka toho co se už prošlo
        this.show = function (r = 100, g = 0, b = 128, a = 100) {
            var x = this.i * w;
            var y = this.j * w;
            stroke(255);
            if (this.walls[0]) {
                line(x, y, x + w, y);
            }
            if (this.walls[1]) {
                line(x + w, y, x + w, y + w);
            }
            if (this.walls[2]) {
                line(x + w, y + w, x, y + w);
            }
            if (this.walls[3]) {
                line(x, y + w, x, y);
            }
            if (!this.visited) {
                noStroke();
                fill(0, 0, 0, 0);
                rect(x, y, w, w);
            }
            if (this.visited) {
                noStroke();
                fill(r, g, b, a);
                rect(x, y, w, w);
            }
        }
    }
}

function removeWalls(a, b) {
    var x = a.i - b.i;
    if (x == 1) {
        a.walls[3] = false;
        b.walls[1] = false;
        console.log(a);
    } else if (x == -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }

    var y = a.j - b.j;
    if (y == 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y == -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function playGame() {
    if (current === grid[grid.length - 1]) {
        return 1;
    }
    else {
        document.onkeydown = function (event) {
            if (something == false) {
                return
            }
            switch (event.keyCode) {
                case 37://left
                    if (current.walls[3] === false) {
                        moves++;
                        document.querySelector(".score span").innerHTML = moves;
                        current = grid[index(current.i - 1, current.j)];
                        current.highlight();
                        if (current === grid[grid.length - 1]) {
                            finish();
                        }
                    }
                    break;
                case 38://top
                    if (current.walls[0] === false) {
                        moves++;
                        document.querySelector(".score span").innerHTML = moves;
                        current = grid[index(current.i, current.j - 1)];
                        current.highlight();
                        if (current === grid[grid.length - 1]) {
                            finish();
                        }
                    }
                    break;
                case 39://right
                    if (current.walls[1] === false) {
                        moves++;
                        document.querySelector(".score span").innerHTML = moves;
                        current = grid[index(current.i + 1, current.j)];
                        current.highlight();
                        if (current === grid[grid.length - 1]) {
                            finish();
                        }
                    }
                    break;
                case 40://bottom
                    if (current.walls[2] === false) {
                        moves++;
                        document.querySelector(".score span").innerHTML = moves;
                        current = grid[index(current.i, current.j + 1)];
                        current.highlight();
                        if (current === grid[grid.length - 1]) {
                            finish();
                        }
                    }
                    break;
            }
        };
    }
}

function finish() {
    if (find == true) {
        document.getElementById("findPath").style.display = "none";
        message.style.display = "block";
        options.style.display = "block";
        moves++;
        document.querySelector(".score span").innerHTML = moves;
        something = false;
    }
    else {
        document.getElementById("findPath").style.display = "none";
        message.style.display = "block";
        options.style.display = "block";
        moves++;
        document.querySelector(".score span").innerHTML = moves;
        something = false;
        SubmitScore();
    }

}
function SubmitScore() {
    var model = {
        "score": moves,
        "game": "Bludiště"
    };


    $.ajax({
        url: "/api/Score/Save",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(model),
        success: function (data) {
            alert(data);
            //data = JSON.parse(data);
            //console.log(data);
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            //alert('Error - ' + errorMessage);
        }
    })

}
