const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.json());

// Simulazione di un database di utenti
const users = [
  {
    username: 'ale',
    password: 'ale123' // Password: "password"
  },
  // Aggiungi altri utenti se necessario
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Cerca l'utente nel database
  const user = users.find(user => user.username === username);

  if (!user) {
    // L'utente non esiste
    return res.status(401).send('Credenziali errate!');
  }

  // Verifica la password
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // La password è corretta
      res.send('Accesso riuscito!');
    } else {
      // La password è errata
      res.status(401).send('Credenziali errate!');
    }
  });
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});