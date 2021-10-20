const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContents = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answers-buttons');
let mixQuestions, actuallyQuestion;
let countRightAnswers = 0;
var gameName = "Kvíz";

const listQuestions = [
    {
        //papírová krabice
        question: { text: '', image: 'url(../images/paper-box.png)', isImage: true },
        answers:
        [
            { text: '', image: 'url(../images/black.png)', isImage: true, success: false},
            { text: '', image: 'url(../images/blue.png)', isImage: true, success: true},
            { text: '', image: 'url(../images/yellow.png)', isImage: true, success: false}
        ],
        
    },
    {
        //pet lahev
        question: {text: '', image: 'url(../images/pet-bottle.png)', isImage: true},
        answers: 
        [
            {text: '', image: 'url(../images/black.png)', isImage: true, success: false},
            {text: '', image: 'url(../images/blue.png)', isImage: true, success: false},
            {text: '', image: 'url(../images/yellow.png)', isImage: true, success: true}
        ]
    },
    {
        //skleněná lahev
        question: { text: '', image: 'url(../images/glass-bottle.png)', isImage: true },
        answers:
            [
                { text: '', image: 'url(../images/green.png)', isImage: true, success: true },
                { text: '', image: 'url(../images/blue.png)', isImage: true, success: false },
                { text: '', image: 'url(../images/yellow.png)', isImage: true, success: false }
            ]
    },
    {
        //kuře
        question: { text: '', image: 'url(../images/chicken.png)', isImage: true },
        answers:
            [
                { text: '', image: 'url(../images/green.png)', isImage: true, success: false },
                { text: '', image: 'url(../images/blue.png)', isImage: true, success: false },
                { text: '', image: 'url(../images/black.png)', isImage: true, success: true }
            ]
    }
]









startButton.addEventListener('click',startGame);
nextButton.addEventListener('click',() => {
    answerButtonsElement.classList.remove('no-click');
    actuallyQuestion++;
    nextQuestion();
})

function startGame()
{
    countRightAnswers = 0;
    document.getElementById('right-answers').innerHTML = countRightAnswers;
    document.body.style.backgroundColor = "hsl(var(--hue), 100%, 20%)";
    answerButtonsElement.classList.remove('no-click');
    answerButtonsElement.classList.remove('hide');
    document.getElementById('result').classList.add('hide');
    document.getElementById('question').classList.remove('hide');
    startButton.classList.add('hide');
    mixQuestions = listQuestions.sort(() => Math.random() - .5);
    actuallyQuestion = 0;
    questionContents.classList.remove('hide');
    nextQuestion();
}

function nextQuestion() 
{
    resetInstance();
    showQuestion(mixQuestions[actuallyQuestion]);
}

function showQuestion(questionIndex) 
{
    //questionElement.innerText = questionIndex.question; //questionIndex == místo otázky a question je naše otázka
    if (questionIndex.question.isImage) 
    {
        questionElement.style.backgroundImage = questionIndex.question.image;
        questionElement.innerText = questionIndex.question.text;
        questionElement.style.height = '200px';
        questionElement.style.width = '200px';
    }
    else
    {
        questionElement.style.width = 'auto';
        questionElement.style.height = 'auto';
        questionElement.style.backgroundImage = 'none';
        questionElement.innerText = questionIndex.question;        
    }
    questionIndex.answers.forEach(answer => 
        {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.success) 
        {
            button.dataset.success = answer.success;    
        }
        button.addEventListener('click',selectAnswer);
        answerButtonsElement.appendChild(button);

        if(answer.isImage)
        {
            button.style.height = '200px';
            button.style.backgroundImage = answer.image;
            button.style.backgroundColor = "transparent";
        }
    });    
}

function selectAnswer(e) 
{
    const selectButton = e.target;
    const success = selectButton.dataset.success;
    setStatusClass(document.body, success);    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.success)
    });
    if (answerButtonsElement.dataset = success) {
        document.getElementById('answers-buttons').classList.add('no-click');
        countRightAnswers++; //počítání správných odpovědí
    }
    if (mixQuestions.length > actuallyQuestion + 1) {
        nextButton.classList.remove('hide');
        document.getElementById('answers-buttons').classList.add('no-click');
    }
    else
    {
        document.getElementById('result').classList.remove('hide');
        document.getElementById('answers-buttons').classList.add('hide');
        document.getElementById('question').classList.add('hide');
        document.getElementById('answers-percent').innerHTML = ((100 * countRightAnswers)/listQuestions.length).toFixed(0);
        document.getElementById('answers-buttons').classList.add('no-click');
        document.getElementById('all-questions').innerHTML = listQuestions.length;
        document.body.style.backgroundColor = "black";
        startButton.innerText = 'Opakovat?';
        startButton.classList.remove('hide');
        SubmitScore();
    }
    document.getElementById('right-answers').innerHTML = countRightAnswers;
}

function setStatusClass(element, success) {
    clearStatusClass(element)
    if (success) {
        element.classList.add('success');
    }
    else{
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('success');
    element.classList.remove('wrong');
}

function resetInstance() 
{
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) 
    {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);    
    }   
}

function SubmitScore() {
    var model = {
        "score": countRightAnswers,
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