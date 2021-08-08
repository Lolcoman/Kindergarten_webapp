let c = document.getElementById('canvas');
let ctx = c.getContext('2d');
//mapa souřadnic bludiště
let map = [[0, 1, 0, 1, 0, 0, 0, 1],
           [0, 1, 0, 0, 0, 1, 0, 1],
           [0, 1, 1, 0, 1, 1, 0, 0],
           [0, 0, 0, 0, 0, 1, 1, 0],
           [1, 1, 1, 0, 0, 1, 1, 2]];

let stackBox = [];
let titleSize = 50;
let mazeLength = map[0].length;
let mazeHeight = map.length;
//proměná která zobrazuje hráče v bludišti
let player =
{
    x: 0,
    y: 0,
    moveX: 0,
    moveY: 0
}

function checkStackBox() 
{
    for (i = 0; i < mazeHeight; i++) 
    {
        for (j = 0; j < mazeLength; j++) 
        {
            let a = stackBox[i][j];

            if (player.moveX == a.x && player.moveY == a.y) 
            {
                if (a.status == 1) 
                {
                    console.log('Tady je překážka!');
                }
                else if(a.status == 2) 
                {
                    console.log('Vyhrál jsi!');
                    move(player.moveX, player.moveY);
                }
                else
                {
                    move(player.moveX, player.moveY);
                }
            }
            else if(player.moveX < 0 || player.moveX >= mazeLength*titleSize || player.moveY < 0 || player.moveY >= mazeHeight*titleSize)
            {
                console.log('Tady je zeď bludiště');
            } 
        }        
    }
}

function drawMaze(m) 
{
    for (i = 0; i < m.length; i++) 
    {
        stackBox.push([]);
        for (j = 0; j < m[i].length; j++) 
        {
            if (m[i][j] == 1) 
            {
                ctx.beginPath();
                ctx.fillStyle = "#000000";
                ctx.fillRect(j*titleSize,i*titleSize,titleSize,titleSize);     
            }
            else if(m[i][j] == 2)
            {
                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.fillRect(j*titleSize,i*titleSize,titleSize,titleSize);
            }
            stackBox[i].push(
                {x: j*titleSize, y: i*titleSize, status: m[i][j] == 1 ? 1 : (m[i][j] == 2 ? 2 : 0)});   
        }
    }    
}

//vykreslení hráče
function drawMe(x,y)
{
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x,y,titleSize,titleSize);
}

//funkce pro pohyb
function move(x,y) 
{
    ctx.clearRect(0,0,mazeLength*titleSize,mazeHeight*titleSize);
    drawMe(x,y);
    drawMaze(map);

    player.x = player.moveX;    
    player.y = player.moveY;    
}
//funkce pro stisknutí tlačítka
window.onkeydown = function(e) 
{
    if (e.keyCode == 37) 
    {
        player.moveX = player.x - titleSize;
        player.moveY = player.y;

        console.log('šipka doleva');
    }
    if (e.keyCode == 38) 
    {
        player.moveY = player.y - titleSize;
        player.moveX = player.x;

        console.log('šipka nahoru');
    }
    if(e.keyCode == 39)
    {
        player.moveX = player.x + titleSize;
        player.moveY = player.y;

        console.log('šipka doprava')
    }
    if (e.keyCode == 40) 
    {
        player.moveY = player.y + titleSize;
        player.moveX = player.x;

        console.log('šipka dolu');
    }
    checkStackBox();
    console.log(player);    
}

//překreslení okna hned po načtení stránky
window.onload = function() 
{
    drawMaze(map);
    drawMe(player.x,player.y);
    console.log(stackBox);
}