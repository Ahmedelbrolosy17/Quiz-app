// Select Elements
let numOfQues = document.querySelector(".info .questionsNum");
let submit = document.querySelector(".submit");
let bullets = document.querySelector(".track .bullets");
let track = document.querySelector(".track");
let question = document.querySelector(".question");
let answers = document.querySelector(".answers");
let result = document.querySelector(".result");
let countdownElement = document.querySelector(".timeOut");
let current = 0;
let rightAnswers = 0;
let countdownInterval;

function getData() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let questionsArr = JSON.parse(this.responseText);
            createBullets(questionsArr.length);
            createQuest(questionsArr);
            countdown(180, questionsArr.length); // 3 minutes countdown
            submit.onclick = function () {
                let theRightAnswer = questionsArr[current].right_answer;
                checkAnswer(theRightAnswer);

                current++;

                if (current < questionsArr.length) {
                    question.innerHTML = "";
                    answers.innerHTML = "";
                    let bulletArr = Array.from(document.querySelectorAll(".track .bullets span"));
                    bulletArr[current - 1].className = "on";
                    createQuest(questionsArr);
                    clearInterval(countdownInterval); // Clear the previous countdown
                    countdown(180, questionsArr.length); // 3 minutes countdown
                } else {
                    clean(submit, track, question, answers);
                    showResults(questionsArr.length);
                }
            }
        }
    }
    request.open("GET", "questions.json", true);
    request.send();
}

function createBullets(num) {
    numOfQues.textContent = `Questions: ${num}`;
    for (let i = 0; i < num; i++) {
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = 'on';
        }
        bullets.appendChild(bullet);
    }
}

function createQuest(questArray) {
    let quest = document.createElement("h2");
    quest.appendChild(document.createTextNode(questArray[current].Question));
    question.appendChild(quest);

    for (let i = 1; i <= 4; i++) {
        let answer = document.createElement("div");
        answer.classList.add("answer");

        let radio = document.createElement("input");
        radio.type = 'radio';
        radio.id = `answer_${i}`;
        radio.name = 'quest';
        radio.dataset.answer = `${questArray[current][`answer_${i}`]}`;
        if (i == 1) {
            radio.checked = true;
        }
        let label = document.createElement("label");
        label.htmlFor = `answer_${i}`;
        label.appendChild(document.createTextNode(questArray[current][`answer_${i}`]));

        answer.appendChild(radio);
        answer.appendChild(label);

        answers.appendChild(answer);
    }
}

function checkAnswer(right) {
    let answersArr = document.getElementsByName("quest");
    let choosenAnswer;
    answersArr.forEach(ele => {
        if (ele.checked) {
            choosenAnswer = ele.dataset.answer;
        }
    });
    if (choosenAnswer == right) {
        rightAnswers++;
    }
}

function clean(...ele) {
    ele.forEach(element => element.remove());
}

function showResults(totalQuestions) {
    if (rightAnswers > totalQuestions * 0.7) {
        result.innerHTML = `<span>Perfect</span>, you got ${rightAnswers} of ${totalQuestions}`;
    } else if (rightAnswers > totalQuestions * 0.4) {
        result.innerHTML = `<span>Good</span>, you got ${rightAnswers} of ${totalQuestions}`;
    } else {
        result.innerHTML = `<span>Not Good</span>, you got ${rightAnswers} of ${totalQuestions}`;
        let span = document.querySelector(".result span");
        span.style.color = "red";
    }
}

function countdown(duration, count) {
    if (current < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submit.click();
            }
        }, 1000);
    }
}

getData();
