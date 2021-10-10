let message = document.querySelector(".message");
let options = document.querySelector(".options");
let myValue = localStorage.getItem("myValue");
let myCanvas = document.getElementById("canvas");
var something = true;
let map;

//obrázky
let brick = new Image();
brick.src = "../../images/floor1.png";

let finish = new Image();
finish.src = "../../images/cheese.png";

let start = new Image();
start.src = "../../images/mouse.png";

let c = document.getElementById('canvas');
let ctx = c.getContext('2d');

function mapSelect(myValue) {
    switch (myValue) {
        case "1":
            map = [[0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0],
            [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2]];
            // myCanvas.style.width = "720px";
            // myCanvas.style.height = "560px";
            mazeLength = map[0].length; //18
            mazeHeight = map.length;
            break;
        case "2":
            map = [[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 2]];
            mazeLength = map[0].length; 
            mazeHeight = map.length;
            break;
        case "3":
            map = [[0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
            [0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 2]];
            mazeLength = map[0].length;
            mazeHeight = map.length;
            break;
        default:
            break;
    }
}
//mapa souřadnic bludiště
// let map = [[0, 0, 0, 0, 0, 0, 1, 1, 0],
//            [1, 0, 1, 0, 1, 1, 0, 0, 1],
//            [0, 0, 1, 1, 0, 0, 0, 0, 1],
//            [0, 1, 0, 0, 0, 0, 1, 0, 0],
//            [0, 0, 0, 1, 1, 0, 1, 0, 1],
//            [0, 1, 0, 1, 0, 0, 1, 0, 1],
//            [1, 1, 0, 0, 0, 1, 1, 0, 2]];

let moves = 0;
let stackBox = [];
let titleSize = 80; //velikost překážky px
let mazeLength; //délka 
let mazeHeight; //šířka 

//proměná která zobrazuje hráče v bludišti, start
let player =
{
    x: 0,
    y: 0,
    moveX: 0,
    moveY: 0
}

function checkStackBox() {
    for (i = 0; i < mazeHeight; i++) {
        for (j = 0; j < mazeLength; j++) {
            let a = stackBox[i][j];

            if (player.moveX == a.x && player.moveY == a.y) {
                if (a.status == 1) {
                    //console.log('Tady je překážka!');
                }
                else if (a.status == 2) {
                    //console.log('Vyhrál jsi!');
                    move(player.moveX, player.moveY);
                    message.style.display = "block";
                    options.style.display = "block";
                    moves++;
                    document.querySelector(".score span").innerHTML = moves;
                    something = false;
                    localStorage.setItem("score", moves);
                    //localStorage.clear();
                }
                else {
                    move(player.moveX, player.moveY);
                    moves++;
                    document.querySelector(".score span").innerHTML = moves;
                }
            }
            //pro informace o zdi bludiště
            else if (player.moveX < 0 || player.moveX >= mazeLength * titleSize || player.moveY < 0 || player.moveY >= mazeHeight * titleSize) {
                console.log('Tady je zeď bludiště');
            }
        }
    }
}

//vykreslní bludiště
function drawMaze(map) {
    for (i = 0; i < map.length; i++) {
        stackBox.push([]); //do zásobníku
        for (j = 0; j < map[i].length; j++) {
            if (map[i][j] == 1)//pokud se rovná 1 vykreslí se překážky
            {
                ctx.beginPath();
                //ctx.fillStyle = "#000000";
                //ctx.fillRect(j*titleSize,i*titleSize,titleSize,titleSize);     
                ctx.drawImage(brick, j * titleSize, i * titleSize, titleSize, titleSize);
            }
            else if (map[i][j] == 2) { //pokud 2 vykreslí cíl
                ctx.beginPath();
                //ctx.fillStyle = "#00ff00";
                //ctx.fillRect(j*titleSize,i*titleSize,titleSize,titleSize);
                ctx.drawImage(finish, j * titleSize, i * titleSize, titleSize, titleSize);
            }
            stackBox[i].push(
                { x: j * titleSize, y: i * titleSize, status: map[i][j] == 1 ? 1 : (map[i][j] == 2 ? 2 : 0) });
        }
    }
}

//vykreslení hráče
function drawMe(x, y) {
    ctx.beginPath();
    //ctx.fillStyle = "#FF0000";
    //ctx.fillRect(x,y,titleSize,titleSize);
    ctx.drawImage(start, x, y, titleSize, titleSize);
}

//funkce pro pohyb
function move(x, y) {
    ctx.clearRect(0, 0, mazeLength * titleSize, mazeHeight * titleSize);
    drawMaze(map);
    drawMe(x, y);
    player.x = player.moveX;
    player.y = player.moveY;

    //moves = moves+1;
    document.querySelector(".score span").innerHTML = moves;
}

//funkce pro stisknutí tlačítka
window.onkeydown = function (e) {
    if (something == false) {
        return;
    }
    else {

        switch (e.keyCode) {
            case 37: //šipka doleva

                player.moveX = player.x - titleSize;
                player.moveY = player.y;
                //moves++;

                break;
            case 38: //šipka nahoru

                player.moveY = player.y - titleSize;
                player.moveX = player.x;
                //moves++;

                break;
            case 39: //šipka doprava

                player.moveX = player.x + titleSize;
                player.moveY = player.y;
                //moves++;

                break;
            case 40: //šipka dolů

                player.moveY = player.y + titleSize;
                player.moveX = player.x;
                //moves++;

                break;
            default:
                return;

        }
    }
    checkStackBox();
}


function SubmitScore() {
    var model = {
        value: "moves"
    }


    $.ajax({
        url: "https://localhost:44356",
        type: 'POST',
        data: model,
        success: function (data) {
            alert(data);
            //data = JSON.parse(data);
            //console.log(data);
        },
        error: function (err) {
            console.error(err);
        }
    })
}

//    var xhttp = new XMLHttpRequest();
//    xhttp.open("POST", "https://localhost:44356/api/values", true);
//    xhttp.getResponseHeader("Content-type", "application/json");
//    xhttp.send(JSON.stringify(json));
//    xhttp.onload = function () {
//        if (this.status == 200) {
//            console.log("správně");
//        }
//        else {
//            console.log("špatně");
//        }
//    }

//    //fetch('https://localhost:44356/api/values', {
//    //    method: 'POST',
//    //    headers: {
//    //        'Content-Type': 'application/json'
//    //    },
//    //    body: JSON.stringify({
//    //        value: moves
//    //    })
//    //}).then(res => {
//    //    return res.json()
//    //    })
//    //    .then(data => console.log(data))
//    //    .catch(error => console.log('ERROR'))
//}

const toSend = {
    score: moves
};

//function SubmitScore()
//{
//    const jsonString = JSON.stringify(toSend);
//    const xhr = new XMLHttpRequest();

//    xhr.open("POST", "https://localhost:44356/api/values");
//    xhr.send(jsonString);
//    console.log(jsonString);
//}

//překreslení okna hned po načtení stránky
window.onload = function () {
    mapSelect(myValue);
    drawMaze(map);
    drawMe(player.x, player.y);
    console.log(stackBox);
}
