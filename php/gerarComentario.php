<?php
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$input = json_decode(file_get_contents("php://input"), true);
$resumo = $input["resumo"] ?? "";

$prompt = "
Gera um comentário extremamente curto (minimo: 5 palavras, máximo: 10 palavras).
Critica apenas o que o utilizador disse abaixo.
Usa um tom sarcástico, irritado e de hater exagerado, mas sem insultos diretos.
Critica de forma dura e desdenhosa, como alguém que está farto e não tem paciência.
O comentário deve refletir o conteúdo real da resposta do utilizador, nunca faças sobre a pergunta.
Não expliques nada, não dês contexto, não uses prefixos.
Produz apenas a frase final.

Texto do utilizador:
$resumo
";

$apiKey = "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";

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "llama-3.1-8b-instant",
    "messages" => [
        ["role" => "user", "content" => $prompt]
    ],
    "temperature" => 0.9
]));

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);

if (!isset($data["choices"][0]["message"]["content"])) {
    echo json_encode([
        "error" => "Resposta inválida da API",
        "raw" => $data
    ]);
    exit;
}

echo json_encode([
    "comentario" => $data["choices"][0]["message"]["content"]
]);