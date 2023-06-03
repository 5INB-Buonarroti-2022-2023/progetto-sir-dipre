const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware per il parsing del corpo della richiesta
app.use(bodyParser.json());

// Endpoint per la gestione del login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Esempio di verifica delle credenziali (da personalizzare con la tua logica di autenticazione)
  if (username === 'ale' && password === 'ale123') {
    res.send('Accesso riuscito!');
  } else {
    res.status(401).send('Credenziali non valide');
  }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});