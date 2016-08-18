//HTTP METHODS
//GET = retrieve a resource
//POST = adding a new resource
//PUT = update a resource
//DELETE = delete a resource





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

        client.query('INSERT INTO books (author, title, published, edition, publisher, genre)' //properties from the database
            +
            'VALUES ($1, $2, $3, $4, $5, $6)', //the bling is a prepared statement
            [book.author, book.title, book.published, book.edition, book.publisher, book.genre], //properties on the object sent to server
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                }

                res.sendStatus(201);
            });

    });
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    var book = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('UPDATE books ' +
            'SET author = $1, ' +
            'title = $2, ' +
            'published = $3, ' +
            'edition = $4, ' +
            'publisher = $5, ' +
            'genre = $6 ' +
            'WHERE id = $7', [book.author, book.title, book.published, book.edition, book.publisher, book.genre, id],
            function(err, result) {
                done();

                if (err) {
                    console.log('err', err)
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('DELETE FROM books ' +
            'WHERE id = $1', [id],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(200);
            });
    });
});

router.get('/:genre', function(req, res) {
    var genre = req.params.genre;
    console.log('this is what was send:', genre);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM books ' +
            'WHERE genre = $1', [genre],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }

            });
    });
});

module.exports = router;
