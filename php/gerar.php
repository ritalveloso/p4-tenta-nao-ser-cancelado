<?php

header("Content-Type: application/json; charset=utf-8");

$apiKey = "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";

$input = json_decode(file_get_contents("php://input"), true);
$historico = $input["historico"] ?? [];

array_unshift($historico, [
    "role" => "system",
    "content" => "És um entrevistador profissional especializado em temas polémicos.
Não perguntes ao utilizador qual é o tema — tu é que escolhes. E faz a pergunta inicial super curta.

Quando começares a receber respostas sobre o tema:
1. Analisa a resposta do utilizador.
2. Faz um pequeno comentário curto e direto sobre o que ele disse (1 frase).
3. Termina sempre com uma única pergunta de follow-up simples, direta e curta.

Regras obrigatórias:
- Nunca perguntes “qual é o tema”.
- Nunca peças ao utilizador para escolher o assunto.
- Mantém o mesmo tema enquanto o utilizador falar dele.
- A pergunta final deve vir sempre no fim, separada por uma linha em branco.
- Nunca digas “Vamos começar”, “Estamos prontos” ou frases semelhantes.
- Nunca cries placeholders como “Resposta:”, “(inserir resposta aqui)” ou qualquer texto entre parênteses.
- Nunca cries secções, títulos, listas, travessões ou formatação especial.
- Nunca cries texto que não seja o comentário e a pergunta final.
- Nunca cries texto meta, explicações ou instruções.
- A resposta deve ser sempre apenas: comentário + pergunta final.
"

]);

$data = [
    "model" => "llama-3.1-8b-instant",
    "messages" => $historico
];

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$resposta = curl_exec($ch);

if ($resposta === false) {
    echo json_encode(["error" => ["message" => curl_error($ch)]]);
    curl_close($ch);
    exit;
}

curl_close($ch);
echo $resposta;
