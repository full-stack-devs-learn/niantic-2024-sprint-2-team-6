let questionCount = 1;
let globalId;
let globalTotalQuestions;
let globalQuestionsArray;
let userChoices = {};

async function getQuestions(quizId)
{
    const url = `api/quiz/questions/${quizId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        return 0;
    }

}
function getAnswers(quizId)
{
    const url = `api/quiz/answers/${quizId}`;
    fetch(url)
    .then(response => {return response.json()})
}

function displayQuestion(quizId, currentQuestion, parent)
{
    const url = `/quiz/setup/${quizId}?currentQuestion=${currentQuestion}`;

    fetch(url)
        .then(response => { return response.text() })
        .then( data => {
            parent.innerHTML = data;
        })
    .catch(error => {
        console.error("Something went wrong", error)
    })
}

function answerSelect(event)
{
    console.log(event.target.innerText)
    const rightButton = document.getElementById("right-button");
    const leftButton = document.getElementById("left-button");

    const currentAnswerButton = event.currentTarget;
    currentAnswerButton.classList.add("selected")

    const choice = event.target.innerText;
    const isSelected = true;

    userChoices[questionCount] = choice;

    console.log(userChoices);

    if(isSelected && questionCount >= 1)
    {
        rightButton.disabled = false;

    }

    if(isSelected && questionCount > 1)
    {
        leftButton.disabled = false;
    }

    if(questionCount == 1)
    {
        leftButton.disable = true;
    }
}

function questionNavigation(event)
{
    console.log("pressed button")
    console.log(event.target.innerText);
    const choice = event.target.innerText;
    const parent = document.querySelector(".question-container")
    const counter = document.querySelector(".question-counter")
    const rightButton = document.getElementById("right-button")
    const leftButton = document.getElementById("left-button")
    let answerButtons;

    console.log(answerButtons, "answers")

    if(choice == ">" && questionCount < globalTotalQuestions)
    {
        questionCount++
        counter.innerHTML = `${questionCount}/${globalTotalQuestions}`
        console.log(questionCount)
        displayQuestion(globalId, questionCount, parent)
        console.log("right")
        rightButton.disabled = true
        console.log(answerButtons, "answers")
        if(questionCount == globalTotalQuestions)
                {
                    rightButton.innerText = "Submit";
                }
        else {
            rightButton.innerText = ">";
        }
    }

     if(choice == "<" && questionCount > 1 )
    {
        questionCount--
        counter.innerHTML = `${questionCount}/${globalTotalQuestions}`
        console.log(questionCount)
        displayQuestion(globalId, questionCount, parent)
        console.log("left")
        console.log(answerButtons, "answers")
        if(questionCount == 1)
        {
            leftButton.disabled = true
        }
        if(rightButton.innerText == "Submit")
        {
            rightButton.innerText = ">"
        }
    }

        answerButtons = document.querySelectorAll(".answer-buttons")

        console.log(answerButtons, "test")

//        answerButtons.forEach((answer) => {
//
//            console.log(answer.innerText, "text")
//            if(answer.innerText == userChoices[questionCount])
//            {
//
//                answer.classList.add("selected");
//            }
//        })

}

document.addEventListener("DOMContentLoaded", () => {
    console.log("connected")

    const startButton = document.getElementById("start");

   startButton.addEventListener("click", async (e) =>
   {
        const id = parseInt(e.currentTarget.value); //QuizId
        const questionsArray = await getQuestions(id); //Questions Array
        const currentQuestion = questionsArray[0].questionNumber;
        const totalQuestions = questionsArray.length;

        globalId = id;
        globalTotalQuestions = totalQuestions;
        globalQuestionsArray = questionsArray;

        startButton.remove();

        const parentContainer = document.getElementById("container");
        const buttonContainer = document.getElementById("buttons");


        //Counter
        const questionCounter = document.createElement("div");
        questionCounter.classList.add("question-counter");
        questionCounter.textContent = `${questionCount}/${totalQuestions}`;


        //Container
        const questionContainer = document.createElement("div");
        questionContainer.classList.add("question-container");
        displayQuestion(id, currentQuestion, questionContainer);


        const leftButton = document.createElement("button");
        const rightButton = document.createElement("button");
        leftButton.id = "left-button";
        rightButton.id = "right-button";
        leftButton.disabled = true;
        rightButton.disabled = true;

        leftButton.textContent = "<";
        rightButton.textContent = ">";

        leftButton.addEventListener("click", questionNavigation);
        rightButton.addEventListener("click", questionNavigation);

        buttonContainer.append(leftButton);
        buttonContainer.append(rightButton);

        parentContainer.append(questionCounter)
        parentContainer.append(questionContainer)
        parentContainer.append(buttonContainer)
   })
})