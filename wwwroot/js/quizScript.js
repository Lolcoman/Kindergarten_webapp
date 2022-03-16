var IsSaved = true;
var quizName = document.getElementById('quizName');
var IsDownloaded = false;
var names;
var IsLoaded = false;
var IsAgainSelect = false;
var correctAnswers = 0;
var deleted;


function disableInput() {
    quizName.style.color = "gray";
    quizName.readOnly = true;
}

var quiz = {
    //Array for questions
    questions: [],

    //Add questions as objects to array
    addQuestion: function (question, correct, wrongOne, wrongTwo) {
        this.questions.push({
            question: question,
            correct: correct,
            wrongOne: wrongOne,
            wrongTwo: wrongTwo
        });
        //upadate number of questions each time you add one
        view.displayNumberOfQuestions();
    },

    movingToNextQuestion: function () {
        //find all next buttons and add event lisener to them
        var nextButton = document.querySelectorAll(".nextButton");
        for (i = 0; i < nextButton.length; i++) {
            nextButton[i].addEventListener("click", function (event) {
                //Find the element that was clicked
                var elementClicked = event.target;
                if (elementClicked.textContent == "Konec") {
                    SubmitScore();  
                    swal({
                        title:"Uložení výsledků",
                        text: "Výsledky budou uloženy, pokud jste přihlášen\nVýsledky: správné odpovědi " + correctAnswers + " z " + quiz.questions.length,
                        icon: "success",
                    }).then(function () {
                        location.reload();
                    });
                    //continue;
                }
                //If it was a next button then remove the is-active class from it parent
                if (elementClicked.className === "nextButton") {
                    elementClicked.parentNode.classList.remove("is-active");
                    //If there isnt a next sibling then reshow the options to add questions and the info div
                    if (elementClicked.parentNode.nextElementSibling === null) {
                        var showAdd = document.querySelector(".addQuestions");
                        var showInfo = document.querySelector(".info");
                        showAdd.style.display = "block";
                        showInfo.style.display = "block";
                    } else {
                        //If there is a next siblng then add the is-active class to it
                        elementClicked.parentNode.nextElementSibling.classList.add("is-active");
                    }
                }
            });
        };
    }
};

var handlers = {
    //This runs when you click add question button
    addQuestion: function () {
        //Kontrola zda uživatel vyplnil všechny obrázky
        var inputs = document.querySelectorAll("input[type=file")
        for (i = 0; i < inputs.length; i++) {
            if (inputs[i].files.length == 0 && inputs[i].value.length == 0) {
                swal({
                    text: "Nejsou vybrány všechny obrázky!",
                    icon: "error",
                });
                return
            }
        }
        if (quizName.value == "" && IsSaved) {
            swal({
                text: "Vyplňte jméno kvízu!",
                icon: "error",
            });
            return
        }
        //Get each of the inputs by id
        var questionInput = document.getElementById("questionInput");
        var correctInput = document.getElementById("correctInput");
        var wrongOneInput = document.getElementById("wrongOneInput");
        var wrongTwoInput = document.getElementById("wrongTwoInput");
        quiz.addQuestion(questionInput.files[0], correctInput.files[0], wrongOneInput.files[0], wrongTwoInput.files[0]);
        if (IsSaved)
        {
            post();

            //clear the inputs
            questionInput.value = "";
            correctInput.value = "";
            wrongOneInput.value = "";
            wrongTwoInput.value = "";
            let allImg = document.querySelectorAll('img');
            for (i = 0; i < allImg.length; i++) {
                allImg[i].src = "#";
            }
        }
    }
}

var view = {
    //This runs when you click start quiz
    displayQuestions: function () {
        if (IsDownloaded)
        {
            if (!IsLoaded)
            {
                return
            }
        }
        if (quiz.questions.length == 0) {
            swal({
                text: "Nejsou vybrány všechny obrázky!",
                icon: "error",
            });
            return
        }
        //Skryje možnost přidání další otázky a info
        //var hideh1 = document.querySelector("h1");
        var hideAdd = document.querySelector(".addQuestions");
        var hideInfo = document.querySelector(".info");
        hideAdd.style.display = "none";
        hideInfo.style.display = "none";
        //hideh1.style.display = "none";
        //Vyčistí quesitons wrapper
        var questionsWrapper = document.querySelector(".questionsWrapper");
        questionsWrapper.innerHTML = "";

        //každá otázka musí obsahovat třídu pro identifikaci
        quiz.questions.forEach(function (question, index) {
            var questionDiv = document.createElement("div");
            questionDiv.setAttribute("class", "questionDiv");
            var nextButton = document.createElement("button");
            nextButton.setAttribute("class", "nextButton");
            //! Otázka
            var questionLi = document.createElement("li");
            var questionImg = document.createElement('img');
            questionImg.width = 250;
            questionImg.height = 250;
            questionLi.appendChild(questionImg);
            if (IsDownloaded) {
                questionImg.src = "data:image/png;base64," + (question.question);
            }
            else {
                questionImg.src = URL.createObjectURL(question.question);
            }
            //questionImg.onload = function () {
            //    context.drawImage(questionImg, 175, 175);
            //};
            //questionImg.src = URL.createObjectURL(question.question);
            var elementHr = document.createElement('hr');
            questionLi.id = "questionLi"
            questionLi.appendChild(elementHr);

            //! Správná odpověď
            var correctLi = document.createElement("li");
            correctLi.id = "correctLi"
            //correctLi.setAttribute("class", "correct");
            var correctImg = document.createElement('img');
            //correctImg.className = "correct";
            correctLi.setAttribute("class", "correct")
            correctImg.width = 250;
            correctImg.height = 250;
            correctLi.appendChild(correctImg)
            //correctLi.nextSibling(image);
            if (IsDownloaded) {
                correctImg.src = "data:image/png;base64," + (question.correct);
                //IsDownloaded = false;
            }
            else {
                correctImg.src = URL.createObjectURL(question.correct);
            }
            //correctImg.src = URL.createObjectURL(question.correct);
            //! Špatná odpověď
            var wrongOneLi = document.createElement("li");
            wrongOneLi.id = "wrongOneLi";
            //wrongOneLi.setAttribute("class", "wrong");
            var wrongOneImg = document.createElement('img');
            //wrongOneImg.className = "wrong"
            wrongOneLi.setAttribute("class", "wrong");
            wrongOneImg.width = 250;
            wrongOneImg.height = 250;
            wrongOneLi.appendChild(wrongOneImg)
            //correctLi.nextSibling(image);
            if (IsDownloaded) {
                wrongOneImg.src = "data:image/png;base64," + (question.wrongOne);
            }
            else {
                wrongOneImg.src = URL.createObjectURL(question.wrongOne);
            }
            //wrongOneImg.src = URL.createObjectURL(question.wrongOne);

            //! Špatná odpověď
            var wrongTwoLi = document.createElement("li");
            wrongTwoLi.id = "wrongTwoLi";
            //wrongTwoLi.setAttribute("class", "wrong");
            var wrongTwoImg = document.createElement('img');
            //wrongTwoImg.className = "wrong"
            wrongTwoLi.setAttribute("class", "wrong");
            wrongTwoImg.width = 250;
            wrongTwoImg.height = 250;
            wrongTwoLi.appendChild(wrongTwoImg);
            if (IsDownloaded) {
                wrongTwoImg.src = "data:image/png;base64," + (question.wrongTwo);
            }
            else {
                wrongTwoImg.src = URL.createObjectURL(question.wrongTwo);
            }
            //wrongTwoImg.src = URL.createObjectURL(question.wrongTwo);

            //přidání každé otázky do question wrapperu
            questionsWrapper.appendChild(questionDiv);

            questionsWrapper.firstChild.classList.add("is-active");

            //add the text to the inputs the values in the questions array
            //questionLi.textContent = question.question;
            //correctLi.textContent = question.correct;
            //image.nextSibling.textContent = question.correct;
            //wrongOneLi.textContent = question.wrongOne;
            //wrongTwoLi.textContent = question.wrongTwo;

            //Pokud je poslední otázka button ukáže konec
            if (index === quiz.questions.length - 1) {
                nextButton.textContent = "Konec";
            } else {
                nextButton.textContent = "Další";
            }

            //Připojí elements do div
            questionDiv.appendChild(questionLi);

            //Proházení otázek
            var array = [correctLi, wrongOneLi, wrongTwoLi];
            array.sort(function (a, b) { return 0.5 - Math.random() });
            array.forEach(function (item) {
                questionDiv.appendChild(item);
            });

            questionDiv.appendChild(nextButton);

            this.displayAnswersCorrect();
            quiz.movingToNextQuestion();


        }, this);
    },

    displayAnswersCorrect: function () {
        var questionDiv = document.querySelectorAll(".questionDiv");
        var answersCorrect = document.querySelector(".answersCorrect");
        var questions = questionDiv.length;
        var quizQuestions = document.querySelector(".quizQuestions");
        quizQuestions.textContent = "Počet zbývajících otázek: " + questions;
        answersCorrect.textContent = "Správné odpovědi: " + correctAnswers;
        var selectAnswer = document.querySelector(".selectAnswer");
        selectAnswer.style.borderBottom = "3px solid black";
        selectAnswer.style.padding = "2px";
        selectAnswer.style.display = "inline";
        selectAnswer.textContent = "Vyberte správný obrázek ";
        selectAnswer.insertAdjacentHTML("beforeend", '<i class="fas fa-check-circle fa-lg"></i>');

        for (var i = 0; i < questionDiv.length; i++) {
            questionDiv[i].onclick = function () {
                /*event = event || window.event;*/
                /*window.onclick = function (event) {*/
                    let itemChildren;
                    //načtení rodičů po kliku na odpoveď, nastavení barvy a smazaní tříd
                    if (event.target.className === "correct" || event.target.parentNode.className === "correct") {
                        if (event.target.parentNode.className === "correct") {
                            itemChildren = event.target.parentNode.parentNode.children;
                        } else {
                            itemChildren = event.target.parentNode.children;
                        }
                        correctAnswers++;
                        answersCorrect.textContent = "Správné odpovědi: " + correctAnswers;
                        quizQuestions.textContent = "Počet zbývajících otázek: " + --questions;
                        let correct = document.querySelector(".correct");
                        correct.style.backgroundColor = "green";
                    } else if (event.target.className === "wrong" || event.target.parentNode.className === "wrong") {
                        if (event.target.parentNode.className === "wrong") {
                            itemChildren = event.target.parentNode.parentNode.children;
                            event.target.parentNode.style.backgroundColor = "#fc5b56";
                        } else {
                            itemChildren = event.target.parentNode.children;
                            event.target.style.backgroundColor = "#fc5b56";
                        }
                        quizQuestions.textContent = "Počet zbývajících otázek: " + --questions;

                    }
                    //smazání tříd
                    for (i = 0; i < itemChildren.length; i++) {
                        itemChildren[i].classList.remove("correct");
                        itemChildren[i].classList.remove("wrong");
                    }
                //}
            }
        }
    },
    //Ukážet počet otázek v kvízu
    displayNumberOfQuestions: function () {
        var numberLi = document.getElementById("NumberQuestionsInQuiz");
        if (IsDownloaded) {
            numberLi.textContent = "Počet otázek v kvízu je " + quiz.questions.length;
        }
        else {
            if (quiz.questions.length === 1) {
                numberLi.textContent = "Počet otázek v kvízu je " + quiz.questions.length;
            } else {
                numberLi.textContent = "Počet otázek v kvízu je " + quiz.questions.length;
            }
        }
    }
}

function readURL(input, img_id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + img_id).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$(".img-up").change(function () {
    readURL(this, $(this).attr('data-id'));
});

function SubmitScore() {
    var model = {
        "correctAnswer": correctAnswers,
        "question": quiz.questions.length,
        "game": "Kvíz"
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

function post() {
    var data = new FormData();
    for (let i = 0; i < quiz.questions.length; i++) {
        //console.log(input[i].files);
        data.append("files", quiz.questions[0].question);
        data.append("files", quiz.questions[0].correct);
        data.append("files", quiz.questions[0].wrongOne);
        data.append("files", quiz.questions[0].wrongTwo);
    }
    gameName = document.getElementById('quizName').value;
    data.append("name", gameName);
    console.log(data.getAll('files'));

    $.ajax({
        type: 'POST',
        url: '/api/Quiz/QuizUpload',
        cache: false,
        processData: false,
        timeout: 0,
        data: data,
        enctype: "multipart/form-data",
        contentType: false,
        success: function (result) {
            console.log(result);
        },
        error: function (err) {
            console.log(err);
        }
    })
    console.log(data);
}
//výběr z dropdown
document.getElementById("gameName").onchange = function () {
    var selectValue = document.getElementById("gameName").value;
    deleted = selectValue;
    //schová možnosti přidat otázku
    hideAll();
    if (selectValue == "") {
        return;
    }
    if (!IsAgainSelect) {
        IsAgainSelect = true;
        document.getElementById('startQuiz').style.display = 'none';
        names = selectValue;
        IsDownloaded = true;
        download();
    }
}
function download() {
    $.ajax({
        type: 'GET',
        url: '/api/Quiz/QuizDownload' + "?" + "name=" + names,
        timeout: 0,
        success: function (response) {
            quiz.questions = [];
            for (var i = 0; i < response.length; i++) {
                console.log(response[i].correct);
                quiz.addQuestion(response[i].question, response[i].correct, response[i].wrongOne, response[i].wrongTwo)
            }
            view.displayNumberOfQuestions();
            console.log(quiz.questions.length)
        },
        error: function (err) {
            console.log(err);
        }
    })
}
$(document).ajaxStop(function () {
    // This function will be triggered every time any ajax request is requested and completed
    //alert('All Ajax done with success!')
    view.displayNumberOfQuestions();
    IsLoaded = true;
    document.getElementById('startQuiz').style.display = 'inline';
    if (deleted != null) {
        document.getElementById('btnDelete').style.display = 'inline';
        document.getElementById('btnAgain').innerHTML = 'Znovu <i class="fa-solid fa-repeat"></i>';
    } else {
        document.getElementById('btnAgain').innerHTML = 'Konec nahrávání <i class="fa-solid fa-flag-checkered"></i>';
    }
    document.getElementById('btnAgain').style.display = 'inline';
    //IsDownloaded = false;
    IsAgainSelect = false;
});

function hideAll() {
    if (document.querySelector('#quizName')) {
        // Exists.
        document.querySelector('#quizName').style.display = 'none';
    }
    if (document.querySelector('[for="wrongOneInput"]')) {
        // Exists.
        document.querySelector('[for="wrongOneInput"]').style.display = 'none';
    }
    if (document.querySelector('[for="wrongTwoInput"]')) {
        // Exists.
        document.querySelector('[for="wrongTwoInput"]').style.display = 'none';
    }
    if (document.querySelector('[for="questionInput"]')) {
        // Exists.
        document.querySelector('[for="questionInput"]').style.display = 'none';
    }
    if (document.querySelector('[for="correctInput"]')) {
        // Exists.
        document.querySelector('[for="correctInput"]').style.display = 'none';
    }
    if (document.querySelectorAll('[class="images"')) {
        // Exists.
        var imgList = document.querySelectorAll('[class="images"');
        for (var x = 0; x < imgList.length; x++) {
            imgList[x].style.display = 'none';
        }
    }
    if (document.querySelector('button')) {
        // Exists.
        document.querySelector('button').style.display = 'none';
    }
}
function deleteQuiz() {
    swal({
        title: "Opravdu chcete kvíz smazat?",
        text: "Změna je nevratná, kvíz nelze obnovit!",
        icon: "warning",
        buttons: ["Zrušit!", true],
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'POST',
                url: '/api/DeleteFile/QuizDelete' + "?" + "name=" + deleted,
                timeout: 0,
                success: function (response) {
                    swal("Kvíz byl smazán!", {
                        icon: "success",
                    }).then(function () {
                        location.reload();
                    });
                },
                error: function (err) {
                    console.log(err.responseJSON.title);
                    swal({
                        title: "Pexeso nebylo smazáno!",
                        text: err.responseJSON.title,
                        icon: "error",
                    });
                }
            })
        }
    });
}