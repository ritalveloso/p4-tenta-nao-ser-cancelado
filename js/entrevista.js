let historico = [];
speechSynthesis.cancel();
let start = document.getElementById("start");
let comecou = false;

let reconhecimento = null;
let textoReconhecido = "";


window.onload = () => {
    criarReconhecimento();
};

//inicio
start.addEventListener("click", () => {
    document.querySelector(".botoes").classList.add("esconder");

    document.querySelector(".botoes").addEventListener("transitionend", function (e) {
        if (e.propertyName !== "opacity") return;
        document.getElementById("caixas").classList.remove("inicio");

        document.querySelector(".titulo").addEventListener("transitionend", function (e) {
            if (e.propertyName !== "padding-top") return;
            const caixasZ = document.querySelectorAll(".caixaZ");
            caixasZ[0].classList.remove("esconder");
            caixasZ[1].classList.remove("esconder");
        });
    });

    historico.push({
        role: "user",
        content: "Inicia a entrevista com uma pergunta polémica. Muito curta!"
    });

    gerarPergunta();
    comecou = true;
});

//criar a pergunta
async function gerarPergunta() {
    const texto = document.getElementById("texto").value;
    const resultado = document.getElementById("resultado");

    if (texto.trim() !== "") {
        historico.push({ role: "user", content: texto });
    }

    const resposta = await fetch("../php/gerar.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historico: historico })
    });

    const dados = await resposta.json();

    if (dados.error) {
        resultado.innerHTML = "Erro: " + dados.error.message;
        return;
    }

    const pergunta = dados.choices[0].message.content;

    historico.push({ role: "assistant", content: pergunta });

    resultado.innerHTML = pergunta;

    entrevistador(pergunta);
}

//voz do entrevistador
function entrevistador(texto) {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "pt-PT";

    const caixa = document.getElementById("entrevistador");
    const caixaR = document.getElementById("texto");

    voz.onstart = () => {
        caixa.classList.add("verde");
        caixaR.classList.remove("verde");
    };

    voz.onend = () => {
        caixa.classList.remove("verde");
        caixaR.classList.add("verde");

        ouvir();
    };

    speechSynthesis.speak(voz);
    return voz;
}

//reconhecimento do microfone
function criarReconhecimento() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    reconhecimento = new SpeechRecognition();

    reconhecimento.lang = "pt-PT";
    reconhecimento.interimResults = false;
    reconhecimento.maxAlternatives = 1;

    reconhecimento.onresult = (event) => {
        textoReconhecido = event.results[0][0].transcript;
        document.getElementById("texto").value = textoReconhecido;
        gerarPergunta();
    };
    
}

//para ativar o microfone
function ouvir() {
    textoReconhecido = "";
    reconhecimento.start();
}

//camera
const cameraBox = document.getElementById("cameraBox");

const video = document.createElement("video");
video.autoplay = true;
video.muted = true;
video.playsInline = true;

cameraBox.appendChild(video);

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Erro ao aceder à câmara:", err);
    });

//sobre
const about = document.getElementById("about");
const aboutOverlay = document.getElementById("aboutOverlay");
const closeAbout = document.querySelector(".closeAbout");

about.addEventListener("click", () => {
    aboutOverlay.classList.remove("esconder");
});

closeAbout.addEventListener("click", () => {
    aboutOverlay.classList.add("esconder");
});

//instruções
const instructions = document.getElementById("instructions");
const instructionsOverlay = document.getElementById("instructionsOverlay");
const closeInstructions = document.querySelector(".closeIntructions");

instructions.addEventListener("click", () => {
    instructionsOverlay.classList.remove("esconder");
});

closeInstructions.addEventListener("click", () => {
    instructionsOverlay.classList.add("esconder");
});
