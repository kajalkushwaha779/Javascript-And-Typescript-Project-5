// ==================TOPIC INFO=========================
const topicInfo = {

    ai: {
        name: "AI & ChatGPT",
        icon: "🤖",
        description: "Explore artificial intelligence, ChatGPT, machine learning and the technology changing our world.",
        difficulty: "Easy"
    },

    gaming: {
        name: "Gaming & Internet",
        icon: "🎮",
        description: "Test your gaming knowledge, internet culture, gaming terms and popular games.",
        difficulty: "Easy"
    },

    cyber: {
        name: "Cybersecurity",
        icon: "🔐",
        description: "Learn about online safety, cyber threats, passwords and digital protection.",
        difficulty: "Medium"
    },

    future: {
        name: "Future Tech",
        icon: "🚀",
        description: "Discover robotics, virtual reality, smart devices and technologies of tomorrow.",
        difficulty: "Medium"
    },

    culture: {
        name: "Pop Culture & World Vibes",
        icon: "🌍",
        description: "Explore fun facts, general knowledge, sports, science and world culture.",
        difficulty: "Easy"
    }

};
// ==============GLOBAL FUNCTIONS AND VARIABLES========================
function $(id) {
    return document.getElementById(id);
}
let currentTopic = "";
let quizDetail = [];
let userAns = [];
let timeLeft = [];
let currentque = 0;
let count = 15;
let stop;
let autoNext;
let isFinished = false;
// ==============CURRENT YEAR========================
let year = $("currentYear");

if (year) {
    year.innerHTML = new Date().getFullYear();
}
// ==============QUIZ BANNER========================
function quizBanner(obj) {

    let info = topicInfo[obj];

    $("detailIcon").innerHTML = info.icon;
    $("detailTitle").innerHTML = info.name;
    $("detailDescription").innerHTML = info.description;

    $("detailQuestions").innerHTML = quizData[obj].length;

    $("detailDuration").innerHTML =
        quizData[obj].length * 15 + " seconds";

    $("detailDifficulty").innerHTML = info.difficulty;
}
// ==============SHOW SCREEN========================
function showScreen(id) {

    $("quizIntro").classList.add("d-none");
    $("quizDetails").classList.add("d-none");
    $("quizPlay").classList.add("d-none");
    $("quizResult").classList.add("d-none");

    $(id).classList.remove("d-none");
}
// ==============RETURN TO HOME========================
function goHome() {
    clearInterval(stop);
    clearTimeout(autoNext);

    showScreen("quizIntro");
    $("topicSelect").value = "";

    currentTopic = "";
    currentque = 0;
    count = 15;

    userAns = [];
    timeLeft = [];
    quizDetail = [];

    isFinished = false;
}
// ==============TOPIC SELECTION========================
$("startBtn").addEventListener("click", function () {

    currentTopic = $("topicSelect").value;

    if (currentTopic === "") {

        alert("Please select a topic first!");

        return;
    }

    quizBanner(currentTopic);

    showScreen("quizDetails");
});
// ==============START QUIZ========================
$("detailStartBtn").addEventListener("click", function () {
    clearInterval(stop);
    clearTimeout(autoNext);

    quizDetail = quizData[currentTopic];

    userAns = [];
    timeLeft = [];

    for (let i = 0; i < quizDetail.length; i++) {

        userAns[i] = null;
        timeLeft[i] = 15;
    }

    currentque = 0;
    count = 15;

    isFinished = false;

    showScreen("quizPlay");

    $("topicBadge").innerHTML = topicInfo[currentTopic].name;

    showQue();
});
// ==============BACK BUTTON========================
$("detailsHomeBtn").addEventListener("click", function () {
    goHome();
});
// ==============SHOW QUESTION========================
function showQue() {

    clearInterval(stop);
    clearTimeout(autoNext);

    if (currentque >= quizDetail.length) {

        finish();

        return;
    }

    count = timeLeft[currentque];

    $("timerValue").classList.remove("timer-warning");

    $("questionCounter").innerHTML =
        "Question " + (currentque + 1) + "/" + quizDetail.length;

    $("answeredCount").innerHTML =
        "Completed: " + userAns.filter(ans => ans !== null).length;

    $("progressBar").style.width =
        ((currentque + 1) / quizDetail.length) * 100 + "%";

    $("questionText").innerHTML =
        quizDetail[currentque].question;

    $("feedbackMessage").innerHTML = "";

    renderOptions();

    if (userAns[currentque] !== null) {

        $("timerValue").innerHTML = "Done";

        if (userAns[currentque] === "skip") {

            $("feedbackMessage").innerHTML =
                "This question was skipped.";

        } else {

            showAns(userAns[currentque]);
        }

    } else {

        $("timerValue").innerHTML = count;

        if (count <= 5) {
            $("timerValue").classList.add("timer-warning");
        }

        countdown();
    }
}
// ==============ATTEMPT ANSWER========================
function attempt(index) {

    if (userAns[currentque] !== null || isFinished) {
        return;
    }

    clearInterval(stop);
    clearTimeout(autoNext);

    userAns[currentque] = index;
    timeLeft[currentque] = 0;

    let correctAnswer = quizDetail[currentque].answer;

    if (index === correctAnswer) {

        $("feedbackMessage").innerHTML =
            "Correct Answer! Well done!";

    } else {

        $("feedbackMessage").innerHTML =
            "Wrong Answer! Correct answer: " +
            quizDetail[currentque].options[correctAnswer];
    }

    $("timerValue").innerHTML = "Done";

    $("timerValue").classList.remove("timer-warning");

    renderOptions();

    $("answeredCount").innerHTML =
        "Completed: " + userAns.filter(ans => ans !== null).length;
}
// ==============SHOW OLD ANSWER========================
function showAns(i) {

    let correctAnswer = quizDetail[currentque].answer;

    if (i === correctAnswer) {

        $("feedbackMessage").innerHTML =
            "Correct Answer! Well done!";

    } else {

        $("feedbackMessage").innerHTML =
            "Wrong Answer! Correct answer: " +
            quizDetail[currentque].options[correctAnswer];
    }
}
// ==============RENDER OPTION========================
function renderOptions() {

    let options = quizDetail[currentque].options;

    let correctAnswer = quizDetail[currentque].answer;

    $("optionsContainer").innerHTML = "";

    options.forEach(function (option, i) {

        let btn = document.createElement("button");

        btn.className = "option-btn";

        btn.innerHTML = option;

        if (userAns[currentque] !== null) {

            btn.disabled = true;

            if (i === correctAnswer) {

                btn.classList.add("correct");
            }

            if (
                i === userAns[currentque] &&
                i !== correctAnswer
            ) {

                btn.classList.add("wrong");
            }

        } else {

            btn.addEventListener("click", function () {

                attempt(i);
            });
        }

        $("optionsContainer").appendChild(btn);
    });
}
// ==============TIMER========================

function countdown() {

    clearInterval(stop);

    stop = setInterval(function () {

        count--;

        timeLeft[currentque] = count;

        $("timerValue").innerHTML = count;

        if (count <= 5) {

            $("timerValue").classList.add("timer-warning");

        } else {

            $("timerValue").classList.remove("timer-warning");
        }

        if (count <= 0) {

            clearInterval(stop);

            if (userAns[currentque] !== null || isFinished) {
                return;
            }

            userAns[currentque] = "skip";

            timeLeft[currentque] = 0;

            renderOptions();

            $("feedbackMessage").innerHTML =
                "Time's up! Correct answer: " +
                quizDetail[currentque].options[
                    quizDetail[currentque].answer
                ];

            $("timerValue").innerHTML = "0";

            $("answeredCount").innerHTML =
                "Completed: " +
                userAns.filter(ans => ans !== null).length;

            autoNext = setTimeout(function () {

                nextQue();

            }, 1500);
        }

    }, 1000);
}
// ==============SKIP QUESTION========================
function skipQuestion() {

    if (isFinished) {
        return;
    }

    clearInterval(stop);
    clearTimeout(autoNext);

    if (userAns[currentque] === null) {
        userAns[currentque] = "skip";
    }

    nextQue();
}
// ==============SCORE CHECKER========================
function scoreChecker() {

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    userAns.forEach(function (ans, i) {

        if (ans === null || ans === "skip") {

            skipped++;

        } else if (ans === quizDetail[i].answer) {

            correct++;

        } else {

            wrong++;
        }
    });

    return {
        correct,
        wrong,
        skipped
    };
}
// ==============RESULT MESSAGE========================
function resultMessage(score, total) {

    let percentage = (score / total) * 100;

    if (percentage === 100) {

        return "Perfect score! You're a QuizVerse legend!";

    } else if (percentage >= 80) {

        return "Excellent work! Your knowledge is impressive!";

    } else if (percentage >= 60) {

        return "Great job! Keep learning and improving!";

    } else if (percentage >= 40) {

        return "Good attempt! Practice makes you better!";

    } else {

        return "Keep practicing! You will improve with every quiz!";
    }
}
// ==============FINISH QUIZ========================
function finish() {

    if (isFinished) {

        return;
    }

    isFinished = true;

    clearInterval(stop);
    clearTimeout(autoNext);

    let result = scoreChecker();

    let total = quizDetail.length;

    let attempted = result.correct + result.wrong;

    $("finalScore").innerHTML =
        result.correct + "/" + total;

    $("resultTitle").innerHTML =
        "Quiz Completed!";

    $("resultMessage").innerHTML =
        resultMessage(result.correct, total);

    $("correctCount").innerHTML =
        result.correct;

    $("wrongCount").innerHTML =
        result.wrong;

    $("skippedCount").innerHTML =
        result.skipped;

    $("totalAnswered").innerHTML =
        attempted;

    $("progressBar").style.width = "100%";

    showScreen("quizResult");
}
// ==============NEXT QUESTION========================
function nextQue() {

    if (isFinished) {

        return;
    }

    clearInterval(stop);
    clearTimeout(autoNext);

    if (currentque < quizDetail.length - 1) {

        currentque++;

        showQue();

    } else {

        finish();
    }
}
// ==============PREVIOUS QUESTION========================
function previousque() {

    if (currentque > 0 && !isFinished) {

        clearInterval(stop);
        clearTimeout(autoNext);

        currentque--;

        showQue();
    }
}
// ==============RESTART QUIZ========================

function restartQuiz() {
    clearInterval(stop);
    clearTimeout(autoNext);
    userAns = [];
    timeLeft = [];
    for (let i = 0; i < quizDetail.length; i++) {
        userAns[i] = null;
        timeLeft[i] = 15;
    }
    currentque = 0;
    count = 15;
    isFinished = false;
    showScreen("quizPlay");
    showQue();
}
// ============== BUTTON EVENTS========================

$("skipBtn").addEventListener("click", skipQuestion);

$("nextBtn").addEventListener("click", nextQue);

$("previousBtn").addEventListener("click", previousque);

$("homeBtn").addEventListener("click", goHome);

$("restartBtn").addEventListener("click", restartQuiz);

$("resultHomeBtn").addEventListener("click", goHome);
