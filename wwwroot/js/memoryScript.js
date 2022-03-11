var retrievedData = localStorage.getItem("images");
var images = JSON.parse(retrievedData);
var imagesArray = [];

var game = ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8', '9', '9', '10', '10', '11', '11', '12', '12'];
var games = images.length;
var array1 = Array.from(Array(games).keys());
var array2 = Array.from(Array(games).keys());
var arrayConcate = array1.concat(array2);
console.log(arrayConcate);   //[1,2,3,4,5]


var gameCreate = [];
var value = [];
var selectId = [];
var flipped = 0;
var alreadyFlipped = [];
var lockBoard = false;
//var clicking = document.querySelectorAll('onclick');
var clicking = document.querySelectorAll('div');
//var endGame = document.getElementById('message');
let moves = 0;
let badMoves = 0;
var gameName = "Pexeso";

//var retrievedGame = localStorage.getItem("game");
// var retrievedData = localStorage.getItem("images");
// var images = JSON.parse(retrievedData);
// var imagesArray = [];

for (let i = 0; i < images.length; i++) {
    imagesArray[i] = images[i];
}
imagesArray.sort();



function KnuthShuffle(array) {
    let index = array.length, randomIndex;
    while (index != 0) {
        randomIndex = Math.floor(Math.random() * index);
        index--;
        [array[index], array[randomIndex]] = [
            array[randomIndex], array[index]
        ];
    }
    return array;
}

function CreateBoard() {
    flipped = 0;
    var output = '';
    KnuthShuffle(arrayConcate);
    for (let i = 0; i < imagesArray.length * 2; i++) {
        output += '<div id="id' + i + ' "onclick=" FlipCard(this, \'' + arrayConcate[i] + '\') "></div>';
    }
    document.getElementById('game-board').innerHTML = output;
}

function FlipCardBack() {
    var card1 = document.getElementById(selectId[0]); //karta 1
    var card2 = document.getElementById(selectId[1]); //karta 2
    card1.style.backgroundColor = "turquoise";
    card1.style.backgroundImage = "none";
    card1.innerHTML = "";
    card2.style.backgroundColor = "turquoise";
    card2.style.backgroundImage = "none";
    card2.innerHTML = "";
    value = [];
    selectId = [];
}

function FlipCard(card, id) {
    // var gameName = localStorage.getItem("game");
    // var i = 0;
    // var urls = localStorage.getItem(gameName + 0);
    // ++i;

    if (card.innerHTML == "" && value.length < 2 && !lockBoard) //pokud je value.length menší než 2, tj musí se vybrat 2 karty
    {
        if (checkObject(alreadyFlipped, id)) //kontrola už otočené karty
        {
            return;
        }
        card.style.background = '#FFF';
        card.style.backgroundRepeat = "no-repeat";

        //pozadí karty je bíle
        // card.style.backgroundImage = "url('images/sun.png')";
        //card.innerHTML = id; //zobrazí hodnotu karty na pozadí
        //id = card.innerHTML;
        switch (id) {
            case '0':
                //urls = localStorage.getItem(gameName + 0);
                urls = imagesArray[0];
                // var img = "url('data:image/png;base64, "+ urls + "')";
                // card.style.backgroundImage = img;
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '1':
                //urls = localStorage.getItem(gameName + 1);
                urls = imagesArray[1];
                //card.style.backgroundImage = "url('../images/tree.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '2':
                //urls = localStorage.getItem(gameName + 2);
                urls = imagesArray[2];
                //card.style.backgroundImage = "url('../images/house.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '3':
                //urls = localStorage.getItem(gameName + 3);
                urls = imagesArray[3];
                //card.style.backgroundImage = "url('../images/train.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '4':
                //urls = localStorage.getItem(gameName + 4);
                urls = imagesArray[4];
                card.style.backgroundImage = "url('../images/mushroom.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '5':
                //urls = localStorage.getItem(gameName + 5);
                urls = imagesArray[5];
                //card.style.backgroundImage = "url('../images/moon.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '6':
                //urls = localStorage.getItem(gameName + 6);
                urls = imagesArray[6];
                //card.style.backgroundImage = "url('../images/pears.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '7':
                //urls = localStorage.getItem(gameName + 7);
                urls = imagesArray[7];
                //card.style.backgroundImage = "url('../images/balloons.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '8':
                //urls = localStorage.getItem(gameName + 8);
                urls = imagesArray[8];
                //card.style.backgroundImage = "url('../images/hot-balloons.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '9':
                //urls = localStorage.getItem(gameName + 9);
                urls = imagesArray[9];
                //card.style.backgroundImage = "url('../images/airplane.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '10':
                //urls = localStorage.getItem(gameName + 10);
                urls = imagesArray[10];
                //card.style.backgroundImage = "url('../images/sunflower.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            case '11':
                //urls = localStorage.getItem(gameName + 11);
                urls = imagesArray[11];
                //card.style.backgroundImage = "url('../images/ice-cream.png')";
                card.style.backgroundImage = "url('data:image/png;base64, " + urls + "')";
                break;
            default:
                break;
        }
        // if (id == 'sun')
        // {
        //     card.style.backgroundImage = "url('images/sun.png')";
        //     card.style.backgroundRepeat = "no-repeat";
        // }1
        if (value.length == 0) {
            value.push(id); //vloží id karty
            selectId.push(card.id); //vloží hodnotu karty
        }
        else if (value.length == 1) //pokud už jsem jednu otočil, pokračujeme zde
        {
            value.push(id);
            selectId.push(card.id);
            if (value[0] == value[1]) //pokud jsem vybral stejné == shoda) 
            {
                moves++;
                document.querySelector("#score span").innerHTML = moves;
                alreadyFlipped.push(id);
                flipped += 2;
                value = [];
                selectId = [];
                //ukončení hry
                if (flipped == arrayConcate.length) {
                    document.getElementById('message').style.display = "block";
                    document.getElementById('options').style.display = "block";
                    //Uložení skóre do tabulky
                    SubmitScore();
                    //alert('Konec hry!');
                }
            }
            else {
                badMoves++;
                document.querySelector("#bad-score span").innerHTML = badMoves;
                lockBoard = true;
                setTimeout(FlipCardBack, 800);
            }
        }
    }
    lockBoard = false;
}
function checkObject(arr, val) {
    return arr.some(function (arrVal) {
        return val === arrVal;
    });
}


CreateBoard();

function SubmitScore() {
    var model = {
        "score": badMoves,
        "game": gameName
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