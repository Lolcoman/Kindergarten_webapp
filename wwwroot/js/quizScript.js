var IsSaved = false;
var quizName = document.getElementById('quizName');
var IsDownloaded = false;
var names;
if (confirm('Chcete otázky uložit?')) {
    // Save it!
    quizName.style.display = "block";
    quizName.addEventListener("focusout", disableInput);
    IsSaved = true;
    console.log('Thing was saved to the database.');
} else {
    // Do nothing!
    console.log('Thing was not saved to the database.');
}


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
                alert("Nejsou vybrány všechny obrázky!");
                return
            }
        }
        if (quizName.value == "") {
            alert("Vyplňte jméno kvízu!");
            return
        }
        //Get each of the inputs by id
        var questionInput = document.getElementById("questionInput");
        var correctInput = document.getElementById("correctInput");
        var wrongOneInput = document.getElementById("wrongOneInput");
        var wrongTwoInput = document.getElementById("wrongTwoInput");

        //var quesitonData = imageUploaded(questionInput.files[0]);
        //localStorage.setItem("questionInput",quesitonData);

        // localStorage.setItem("correctInput",correctInput.files[0]);
        // localStorage.setItem("wrongOneInput",wrongOneInput.files[0]);
        // localStorage.setItem("wrongTwoInput",wrongTwoInput.files[0]);
        //pass the values of the inputs into the addQuestion method in the quiz object which will add them to question array
        quiz.addQuestion(questionInput.files[0], correctInput.files[0], wrongOneInput.files[0], wrongTwoInput.files[0]);
        if (IsSaved) {
            post();
        }
        //addQuestionHandler(questionInput.files[0], correctInput.files[0], wrongOneInput.files[0], wrongTwoInput.files[0],correctInput.files[0]);

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

var view = {
    //This runs when you click start quiz
    displayQuestions: function () {
        if (quiz.questions.length == 0) {
            return
        }
        //Hide the options to add questions and the info
        //var hideh1 = document.querySelector("h1");
        var hideAdd = document.querySelector(".addQuestions");
        var hideInfo = document.querySelector(".info");
        hideAdd.style.display = "none";
        hideInfo.style.display = "none";
        //hideh1.style.display = "none";
        //Clear the quesitons wrapper
        var questionsWrapper = document.querySelector(".questionsWrapper");
        questionsWrapper.innerHTML = "";

        //for each quesiton in array create elements neede and give classes
        quiz.questions.forEach(function (question, index) {
            var questionDiv = document.createElement("div");
            questionDiv.setAttribute("class", "questionDiv");
            var nextButton = document.createElement("button");
            nextButton.setAttribute("class", "nextButton");
            //! Otázka
            var questionLi = document.createElement("li");
            var questionImg = document.createElement('img');
            questionImg.width = 175;
            questionImg.height = 175;
            questionLi.appendChild(questionImg);
            questionImg.src = URL.createObjectURL(question.question);
            var elementHr = document.createElement('hr');
            questionLi.appendChild(elementHr);
            //! Správná odpověď
            var correctLi = document.createElement("li");
            //correctLi.setAttribute("class", "correct");
            var correctImg = document.createElement('img');
            //correctImg.className = "correct";
            correctLi.setAttribute("class", "correct")
            correctImg.width = 175;
            correctImg.height = 175;
            correctLi.appendChild(correctImg)
            //correctLi.nextSibling(image);
            correctImg.src = URL.createObjectURL(question.correct);
            //! Špatná odpověď
            var wrongOneLi = document.createElement("li");
            //wrongOneLi.setAttribute("class", "wrong");
            var wrongOneImg = document.createElement('img');
            //wrongOneImg.className = "wrong"
            wrongOneLi.setAttribute("class", "wrong");
            wrongOneImg.width = 175;
            wrongOneImg.height = 175;
            wrongOneLi.appendChild(wrongOneImg)
            //correctLi.nextSibling(image);
            wrongOneImg.src = URL.createObjectURL(question.wrongOne);

            //! Špatná odpověď
            var wrongTwoLi = document.createElement("li");
            //wrongTwoLi.setAttribute("class", "wrong");
            var wrongTwoImg = document.createElement('img');
            //wrongTwoImg.className = "wrong"
            wrongTwoLi.setAttribute("class", "wrong");
            wrongTwoImg.width = 175;
            wrongTwoImg.height = 175;
            wrongTwoLi.appendChild(wrongTwoImg);
            wrongTwoImg.src = URL.createObjectURL(question.wrongTwo);

            //add each question div to the question wrapper
            questionsWrapper.appendChild(questionDiv);

            questionsWrapper.firstChild.classList.add("is-active");

            //add the text to the inputs the values in the questions array
            //questionLi.textContent = question.question;
            //correctLi.textContent = question.correct;
            //image.nextSibling.textContent = question.correct;
            //wrongOneLi.textContent = question.wrongOne;
            //wrongTwoLi.textContent = question.wrongTwo;

            //If its the last question the button should say finish if not it should say next
            if (index === quiz.questions.length - 1) {
                nextButton.textContent = "Konec";
            } else {
                nextButton.textContent = "Další";
            }

            //Append elements to div
            questionDiv.appendChild(questionLi);

            //put the answers in a random order before apprending them so correct isnt always 1st
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
        var correctAnswers = 0;
        var answersCorrect = document.querySelector(".answersCorrect");
        answersCorrect.textContent = "Správné odpovědi: " + correctAnswers;

        //add click event to each question div if the element clicked has class correct then add 1 to correctAnswers and change the color of element to green.
        //Else change the color of element to red and find the elemtn with correct class and make it green
        for (var i = 0; i < questionDiv.length; i++) {
            questionDiv[i].onclick = function (event) {
                event = event || window.event;
                if (event.target.className === "correct" || event.target.parentNode.className === "correct") {
                    correctAnswers++;
                    answersCorrect.textContent = "Správné odpovědi: " + correctAnswers;
                    //event.target.style.color = "#2ecc71";
                    let correct = document.querySelector(".correct");
                    correct.style.backgroundColor = "green";
                    //event.target.style.backgroundColor = "green";
                } else if (event.target.className === "wrong") {
                    //document.body.style.background = "#fc5b56";
                    questionDiv = document.getElementsByClassName("questionDiv");
                    questionDiv[0].style.backgroundColor = "#fc5b56";
                    //event.target.style.color = "#e74c3c";
                    // for (i = 0; i < itemChildren.length; i++) {
                    //   if (itemChildren[i].classList.contains("correct")) {
                    //     itemChildren[i].style.color = "#2ecc71";
                    //   }
                    // }
                }
                //Remove correct and wrong classes so the same question the score cant go up and colors cant chaneg
                // var itemChildren = event.target.parentNode.parentNode.children;
                //? tohle asi není potřeba
                // let allImg = document.querySelectorAll('img');
                // for (i = 0; i < allImg.length; i++) {
                //   allImg[i].classList.remove("correct");
                //   allImg[i].classList.remove("wrong");  
                // }
                let itemChildren = event.target.parentNode.parentNode.children;
                for (i = 0; i < itemChildren.length; i++) {
                    itemChildren[i].classList.remove("correct");
                    itemChildren[i].classList.remove("wrong");
                }
                // let allImg = document.querySelectorAll('img');
                // allImg.classList.remove("correct");
                // allImg.classList.remove("wrong");

            }
        }

    },

    //count objects in array to show how many questions added to screen
    displayNumberOfQuestions: function () {
        var numberLi = document.getElementById("NumberQuestionsInQuiz");
        if (IsDownloaded) {
            numberLi.textContent = "Počet otázek v kvízu je " + $("#customInput").data("value");
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

function post() {
    var data = new FormData();
    // for (let i = 0; i < input.length; i++) {
    //     let file = input[i].files[0];
    //     //use file
    //     data.append('file', file);
    // }
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
        url: 'https://localhost:44356/api/Quiz/QuizUpload',
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
    if (selectValue == "") {
        return;
    }
    if (!IsDownloaded) {
        names = selectValue;
        IsDownloaded = true;
        view.displayNumberOfQuestions();
        quiz.addQuestion(questionInput.files[0], correctInput.files[0], wrongOneInput.files[0], wrongTwoInput.files[0]);
        //alert(selectValue);
    }
}
function download() {
    $.ajax({
        type: 'GET',
        url: '/api/fileupload/QuizDownload' + "?" + "name=" + names,
        timeout: 0,
        success: function (response) {
            for (var i = 0; i < response.length; i++) {
                console.log(response[i]);
                //console.log(JSON.stringify(response[i]));
                //console.log(JSON.stringify(response[i]));
                //var actual = JSON.parse(atob(response[i]));
                //console.log(actual);
                var img = new Image();
                //img[i] = response[i];
                //var Img = document.createElement('img');
                img.src = "data:image/png;base64," + response[i];
                img.style.height = "100px";
                img.style.width = "100px";
                parent.appendChild(img);
                //localStorage.setItem(names + i, response[i]);
                localStorage.setItem("game", name);
                localStorage.setItem("images", JSON.stringify(response));
                //window.location.href = '/Home/Memory';
                //createImage(response[i])
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}