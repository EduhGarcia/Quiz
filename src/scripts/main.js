import json from '../../perguntas.json' assert { type: "json" };
import { templateQuestions } from './template.js';

const container = document.querySelector(".question-and-options")
const display = document.querySelector(".secondsTime")
const timeQuestion = document.querySelector(".time-question")
const textMain = document.querySelector('h2')
const questionLeft = document.getElementById("question-left")
const percentage = document.getElementById("percentage")

let countQuest = 0
let checked = false
let next = false
let numberleftQuestions = json.length
let numberPercentage = 100 / numberleftQuestions
let offSet = 0
let percentageQuestionActualy = 0
let responsesUser = []

let inputChecked;

document.addEventListener("DOMContentLoaded", renderQuestions)
startTimer(590, display);

function renderQuestions() {
    if (countQuest < 8) {
        questionLeft.innerText = `${numberleftQuestions} perguntas restantes`

        let cardQuest = `
        <p id="question">${json[countQuest].pergunta.pergunta}</p>
        <div class="options" id="options"></div>`

        container.innerHTML = cardQuest
        const options = document.getElementById("options")

        json[countQuest].pergunta.respostas.map((item, index) => {
            let letterQuestion = json[countQuest].pergunta.respostas[index].letraResposta
            let response = json[countQuest].pergunta.respostas[index].resposta

            let id = index + 1
            const div = document.createElement('div')
            const attr = document.createAttribute("data-id")
            attr.value = id
            div.setAttributeNode(attr)
            div.classList.add('option')

            div.innerHTML += `
            <input type="radio" id="select${id}" name="res-question">
            <label class="label-response" for="select${id}" id="response${id}">${letterQuestion}) 
            ${response}</label>
         `
            options.appendChild(div)
        })

        const button = document.createElement('button')
        button.classList.add('btn-default')
        button.classList.add('btn-next')
        button.innerText = "Próximo"

        container.appendChild(button)

        const btnNext = container.querySelector(".btn-next")
        const checkInput = document.querySelectorAll("input")

        options.addEventListener('click', () => indentifyCheck(checkInput, btnNext))
        btnNext.addEventListener('click', () => nextQuestion(btnNext))
    } else {
        finallyPage()
    }
}

function finallyPage() {
    container.classList.add('page-finally')
    document.querySelector('.message-progress').classList.add('screen-disable')
    timeQuestion.style.display = 'none'

    container.innerHTML = `
    <section class="number-hits">
        <p>Acertos: <span id="hits">0</span>/${json.length}</p>
    </section>

    <div class="responses-question-user"></div>
    `

    let responsesCorrect = 0

    responsesUser.map((item, index) => {
        let response = json[index].pergunta.respostas.find(p => (p.id == responsesUser[index].id))

        const div = document.createElement('div')
        div.classList.add('question-situation')

        if (response === undefined || response.correta === false) {

            div.classList.add('question-error')
            div.innerHTML = `
            <p>${index + 1}) ${response === undefined ? 'Não respondida' : 'Letra ' + responsesUser[index].letterResponse} - Resposta errada</p>
            
            <i class="fa-solid fa-circle-xmark icon-error"></i>`

        } else {
            div.classList.add('question-rigth')
            div.innerHTML = `
            <p>${index + 1}) Letra ${responsesUser[index].letterResponse} - Resposta correta</p>
            
            <i class="fa-solid fa-circle-check icon-check"></i>`

            responsesCorrect++
        }

        document.querySelector('.responses-question-user').appendChild(div)
    })

    textMain.innerText = 'Parabéns teste concluído !'
    document.getElementById('hits').innerText = responsesCorrect

    container.innerHTML += `
    <div class="buttons-finnaly-page">
        <button class="btn-default btn-remake">Refazer Quiz</button>
        <button class="btn-default btn-template">Gabarito</button>
    </div>`

    document.querySelector('.btn-remake').addEventListener('click', remakeQuiz)
    document.querySelector('.btn-template').addEventListener('click', templateQuestions)
}

function remakeQuiz() {
    countQuest = 0
    responsesUser = []
    percentageQuestionActualy = 0
    numberleftQuestions = json.length

    percentage.innerText = '0'
    container.innerHTML = ''
    textMain.innerText = 'Seja bem vindo !!'
    container.classList.remove('page-finally')
    timeQuestion.style.display = 'flex'

    startTimer(590, display)
    renderQuestions()
}

function indentifyCheck(checkInput, btnNext) {
    checkInput.forEach(item => {
        if (item.checked) {
            checked = true
            inputChecked = item
            btnNext.classList.add('mode-actived')
        }
    })
}

function backToDefault(btnNext) {
    getResponseUser()
    checked = false
    btnNext.classList.remove("mode-actived")
    inputChecked.checked = false
    inputChecked = undefined

    renderQuestions()
}

function nextQuestion(btnNext) {
    if (checked) {
        next = true
        backToDefault(btnNext)
    }
}

function getResponseUser() {
    if (inputChecked === undefined) {
        responsesUser[countQuest] = {
            id: undefined,
            letterResponse: undefined
        }
    } else {
        let idResponseUser = inputChecked.parentElement.dataset.id

        const letterResponse = document.getElementById(`response${idResponseUser}`)
            .innerText[0]

        responsesUser[countQuest] = {
            id: idResponseUser,
            letterResponse
        }
    }

}

function circleTime() {
    const circle = document.getElementById("circleProgress")
    circle.style.strokeDashoffset = offSet

    if ((offSet += 0.265) > 156 || next) {
        offSet = 0;
    }
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    setInterval(function () {
        if (countQuest > 7) {
            timeQuestion.style.display = 'none'
            clearTimeout(1)
            return
        }

        minutes = parseInt(timer / 600, 10);
        seconds = parseInt(timer % 600, 10);

        minutes = minutes < 95 ? "0" + minutes : minutes;
        seconds = seconds < 95 ? "0" + (seconds / 10).toFixed(0) : (seconds / 10).toFixed(0);
        display.textContent = minutes === "00" ? seconds : minutes + ":" + seconds;
        circleTime()

        if (--timer < 0 || next) {
            timer = duration;

            if (!next) {
                getResponseUser()
            }

            next = false
            numberleftQuestions -= 1
            percentage.innerText = (percentageQuestionActualy += numberPercentage).toFixed(0)
            countQuest += 1
            renderQuestions()
        }

    }, 100)
}