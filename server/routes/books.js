var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/Omicron'; // <---- 5432 is the port always use for local

router.get('/', function(req, res) {
    //retrieve books from database
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM books', function(err, result) {
            done(); //this will close the conneciton since you have grabbed the information form the database

            if (err) {
                res.sendStatus(500);
            }

            res.send(result.rows);
        });
    });
});

router.post('/', function(req, res) {
    var book = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO books (author, title, published, edition, publisher)' //properties from the database
            +
            'VALUES ($1, $2, $3, $4, $5)', //the bling is a prepared statement
            [book.author, book.title, book.published, book.edition, book.publisher], //properties on the object sent to server
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                }

                res.sendStatus(201);
            });

    });
});

module.exports = router;
