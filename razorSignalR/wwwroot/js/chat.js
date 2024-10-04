"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("connectButton").disabled = true;

connection.on("ReceiveGroupMessage", function (target, message) {
    var sessionInputId = document.getElementById("sessionInput").value;
    let messageJson = JSON.parse(message);

    if (target == `${sessionInputId}_questions`) {    
        BindQuestion(messageJson);
    }
    if (target == `${sessionInputId}_participantion`) {      
        BindPartipation(messageJson);
    }
});

connection.start().then(function () {
    document.getElementById("connectButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("connectButton").addEventListener("click", function (event) {
    let sessionInputId = document.getElementById("sessionInput").value;
    let userName = document.getElementById("nameInput").value;

    $.ajax({
        type: "POST",
        url: `https://localhost:7116/quizz/${sessionInputId}/participations`, success: function (result) {
            connection.invoke("AddToGroup", sessionInputId).catch(function (err) {
                return console.error(err.toString());
            });
            GetLeaderboard(sessionInputId);
            document.getElementById("connectButton").disabled = true;
        },
        data: JSON.stringify({ name: userName }),
        contentType: "application/json"
    });
    event.preventDefault();
});

function GetLeaderboard(sessionInputId) {
    $.ajax({
        url: `https://localhost:7116/quizz/${sessionInputId}/leader-board`, success: function (result) {
            for (var index = 0; index < result.Participants.length; index++) {                
                BindPartipation(result.Participants[index]);
            }
        }
    });
} 

function BindPartipation(item) {
    let li = document.createElement("li");
    document.getElementById("participantion").appendChild(li);
    li.textContent += `Name: ${item.Name}. Score:${item.Score ?? 0}`;
}

function BindQuestion(quizzSession) {
    for (let index = 0; index < quizzSession.QuizzSessionQuestions.length; index++) {
        let question = quizzSession.QuizzSessionQuestions[index];
        let questionLi = document.createElement("li");
        questionLi.textContent = `Question: ${question.Description}`;
        document.getElementById("questions").appendChild(questionLi);
        let answersUl = document.createElement("ul");

        for (let answerIndex = 0; answerIndex < question.QuizzSessionQuestionAnswers.length; answerIndex++) {
            let answer = question.QuizzSessionQuestionAnswers[answerIndex];

            let answerLi = document.createElement("li");
            answerLi.textContent = `${String.fromCharCode(97 + answerIndex)}. ${answer.Description}`; // a, b, c, ...
            answersUl.appendChild(answerLi);
        }
        questionLi.appendChild(answersUl);
    }  

} 
