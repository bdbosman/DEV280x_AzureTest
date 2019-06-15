'use strict'
const app = require('express')();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('Quotes.db');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => res.send('helo n00b'));

app.get('/quotes', (req, res) => {
    if (req.query.year) return db.all(
        'SELECT * FROM quotes WHERE year = ?', [req.query.year], 
        (err, rows) => err ? res.send(err.message) : res.json(rows));

    return db.all(
        'SELECT * FROM quotes', 
        (err, rows) => err ? res.send(err.message) : res.json(rows));
});

app.get('/quotes/:id', (req, res) => db.get(
    'SELECT * FROM quotes WHERE id = ?', [req.params.id], 
    (err, row) => err ? res.send(err.message) : res.json(row || {})));


app.post('/quotes', (req, res) => {
    db.run(
        'INSERT INTO Quotes (Quote, Author, Year) VALUES (?, ?, ?)', 
        [req.body.quote, req.body.author, req.body.year],
        function(err){
            return err ? res.send(err.message) : res.send('Succesfully inserted quote with id: ' + this.lastID);
        })
});

app.listen(3000, () => console.log('Listening on port 3000'));