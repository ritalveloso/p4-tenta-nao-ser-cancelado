const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve os vossos ficheiros HTML/JS

app.post('/gerar', async (req, res) => {
    // Aqui o Pilhas faz a chamada à API da Groq
    // Usando process.env.GROQ_API_KEY para segurança
    res.json({ mensagem: "Servidor a funcionar!" });
});

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
