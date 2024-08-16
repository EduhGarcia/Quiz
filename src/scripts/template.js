import { json } from './perguntas.js';

export function templateQuestions() {
    const template = document.querySelector('.template')
    const sectionCenter = document.querySelector('.section-center')

    template.classList.remove('screen-disable')
    sectionCenter.style.filter = 'blur(4px)'

    template.innerHTML = `
    <h2>Gabarito<h2>
    <i class="fa-regular fa-circle-xmark icon-exit"></i>
    `

    json.map((item, index) => {
        let templateResponses = json[index].pergunta.respostas.find(p => (p.correta == true))

        template.innerHTML += `
        <div class="template-response">
            <p>${index + 1}) ${templateResponses.letraResposta} - ${templateResponses.resposta}</p>
        </div>`
    })

    template.querySelector('.icon-exit').addEventListener('click', () => {
        template.classList.add('screen-disable')
        sectionCenter.style.filter = 'blur(0)'
    })
}
