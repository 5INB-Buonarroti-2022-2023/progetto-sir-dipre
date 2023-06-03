/* // Server.js

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
}); */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware per il parsing del corpo della richiesta
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware per la gestione delle sessioni
app.use(session({
  secret: 'supersegreto', // Cambia questa stringa con un valore univoco
  resave: false,
  saveUninitialized: false
}));

// Configurazione del database SQLite
const db = new sqlite3.Database(':memory:'); // Usa un database in-memory per l'esempio

// Creazione della tabella "users" nel database
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
  const username = 'ale';
  const password = 'ale123';
  
  // Utilizzo di bcrypt per crittografare la password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
    } else {
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Utente inserito correttamente');
        }
      });
    }
  });
});

// Pagina di login
app.get('/', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Accedi</button>
    </form>
  `);
});

// Endpoint per il login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Controllo se l'utente esiste nel database
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Errore del server');
    } else if (!row) {
      res.status(401).send('Credenziali non valide');
    } else {
      // Verifica la password
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Errore del server');
        } else if (result) {
          // Autenticazione riuscita, impostare una variabile di sessione
          req.session.username = username;
          res.send('Accesso riuscito!');
        } else {
          res.status(401).send('Credenziali non valide');
        }
      });
    }
  });
});

// Middleware per la verifica dell'autenticazione
const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(401).send('Accesso non autorizzato');
  }
};

// Pagina protetta
app.get('/protected', isAuthenticated, (req, res) => {
  res.send(`Benvenuto, ${req.session.username}! Questa è una pagina protetta.`);
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
