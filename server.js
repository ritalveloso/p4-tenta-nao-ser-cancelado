const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

app.post('/php/gerar.php', async (req, res) => {  
    res.json({ mensagem: "Servidor a funcionar!" });
});

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
