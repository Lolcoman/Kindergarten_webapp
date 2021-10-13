var game = ['sun','sun','tree','tree','house','house','train','train','mushroom','mushroom','moon','moon','pears','pears','balloons','balloons','hot-ballons','hot-ballons','airplane','airplane','sunflower','sunflower','ice-cream','ice-cream'];
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

function KnuthShuffle(array)
{
    let index = array.length, randomIndex;
    while (index != 0)
    {
        randomIndex = Math.floor(Math.random()*index);
        index--;
        [array[index], array[randomIndex]] = [
            array[randomIndex], array[index]
        ];
    }
    return array;
}
function CreateBoard()
{
    flipped = 0;
    var output = '';
    KnuthShuffle(game);
    for (let i = 0; i < game.length; i++) {
        output += '<div id="id'+i+' "onclick=" FlipCard(this, \''+game[i]+'\') "></div>';
    }
    document.getElementById('game-board').innerHTML = output;
}
function FlipCardBack(){
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
function FlipCard(card,id)
{
    if(card.innerHTML == "" && value.length < 2 && !lockBoard) //pokud je value.length menší než 2, tj musí se vybrat 2 karty
    {
        if(checkObject(alreadyFlipped,id)) //kontrola už otočené karty
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
            case 'sun':
                card.style.backgroundImage = "url('images/sun.png')";
                break;
            case 'tree':
                card.style.backgroundImage = "url('images/tree.png')";
                break;
            case 'house':
                    card.style.backgroundImage = "url('images/house.png')";
                break;
            case 'train':
                    card.style.backgroundImage = "url('images/train.png')";
                break;
            case 'mushroom':
                    card.style.backgroundImage = "url('images/mushroom.png')";
                break;
            case 'moon':
                card.style.backgroundImage = "url('images/moon.png')";
                break;
            case 'pears':
                card.style.backgroundImage = "url('images/pears.png')";
                break;
            case 'balloons':
                card.style.backgroundImage = "url('images/balloons.png')";
                break;
            case 'hot-ballons':
                card.style.backgroundImage = "url('images/hot-balloons.png')";
                break;
            case 'airplane':
                card.style.backgroundImage = "url('images/airplane.png')";
                break;
            case 'sunflower':
                card.style.backgroundImage = "url('images/sunflower.png')";
                break;  
            case 'ice-cream':
                card.style.backgroundImage = "url('images/ice-cream.png')";
                break; 
            default:
                break;
        }
        // if (id == 'sun')
        // {
        //     card.style.backgroundImage = "url('images/sun.png')";
        //     card.style.backgroundRepeat = "no-repeat";
        // }1
        if(value.length == 0) 
        {
            value.push(id); //vloží id karty
            selectId.push(card.id); //vloží hodnotu karty
        }
        else if(value.length == 1) //pokud už jsem jednu otočil, pokračujeme zde
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
                if (flipped == game.length) 
                {
                    document.getElementById('message').style.display = "block";
                    document.getElementById('options').style.display = "block";
                    //alert('Konec hry!');
                }
            }
            else
            {
                badMoves++;
                document.querySelector("#bad-score span").innerHTML = badMoves;
                lockBoard = true;
                setTimeout(FlipCardBack,600);
            }
        }
    }
    lockBoard = false;
}
function checkObject(arr, val) 
{
    return arr.some(function(arrVal) 
    {
      return val === arrVal;
    });
  }
CreateBoard();
