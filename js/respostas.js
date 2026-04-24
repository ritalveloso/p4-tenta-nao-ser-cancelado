window.addEventListener("load", () => {

    const container = document.getElementById("caixas");

    function tempoAleatorio() {
        const caixas = document.querySelectorAll(".caixaR");
        let min = 10000;
        let max = 15000;
        const tempo = Math.random() * (max - min) + min;

        setTimeout(() => {
            if (caixas.length < 10 && comecou) {
                gerarComentarioC().then(comentario => {
                    const novaCaixa = criarCaixa();
                    container.append(novaCaixa);
                    const texto = novaCaixa.querySelector(".texto");
                    texto.innerHTML = comentario;
                    inicializarCaixas();
                });
            }
            tempoAleatorio();
        }, tempo);
    }

    tempoAleatorio();
});

function criarCaixa() {
    const caixa = document.createElement("div");
    caixa.classList.add("caixaR");

    caixa.innerHTML = `
        <div class="username">@user1234</div>
        <div class="tempo">agora</div>
        <br>
        <div class="texto"></div>

        <div class="bolinhas">
            <div class="responder bolas"></div>
            <div class="denunciar bolas"></div>
            <div class="apagar bolas"></div>
        </div>
                
        </div>
        <div class="textoD desativado">Comentário Denunciado</div>
    `;

    caixa.style.left = (window.innerWidth / 1.5 * Math.random()) + "px";
    caixa.style.top = (window.innerHeight / 1.5 * Math.random()) + "px";

    return caixa;
}

function gerarComentarioC() {
    let resumo = historico.map(item =>
        `${item.role === "assistant" ? "Pergunta" : "Resposta"}: ${item.content}`
    ).join("\n\n");

    return gerarComentario(resumo);
}

function inicializarCaixas() {
    const caixas = document.querySelectorAll(".caixaR");

    caixas.forEach(caixa => {
        let textoD = caixa.querySelector(".textoD");
        let bolinhas = caixa.querySelector(".bolinhas");
        let denunciar = caixa.querySelector(".denunciar");
        let responder = caixa.querySelector(".responder");
        let apagar = caixa.querySelector(".apagar");

        apagar.addEventListener("click", () => {
            if (apagar.style.display !== "none") {
                if (Math.random() > 0.7) {
                    caixa.remove();
                } else {
                    apagar.style.display = "none";
                }
            }
        });

        denunciar.addEventListener("click", () => {
            if (denunciar.style.display !== "none") {
                if (Math.random() > 0.7) {
                    bolinhas.style.opacity = "0";
                    textoD.classList.remove("desativado");
                    setTimeout(() => {
                        caixa.remove();
                    }, 2000);
                } else {
                    denunciar.style.display = "none";
                }
            }
        });

        responder.addEventListener("click", () => {

        });
    });
}

async function gerarComentario(texto) {
    const resposta = await fetch("../php/gerarComentario.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({resumo: texto})
    });

    const dados = await resposta.json();
    return dados.comentario;
}