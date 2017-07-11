'use strict';

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const {BlogPost} = require('./models');
const {PORT, DATABASE_URL} = require('./config');

mongoose.Promise = global.Promise;

app.use(jsonParser);

// endpoints

app.get('/blog-posts', (req, res) => {
  BlogPost
    .find()
    .exec()
    .then(resultObject => {
      res.send(resultObject);
    })
    .catch(err => {
      res.status(500).json('bad query');
      console.error(err);
    });
});

app.get('/blog-posts/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .exec()
    .then(resultObject => {
      res.send(resultObject);
    })
    .catch(err => {
      res.status(500).json('bad query');
      console.error(err);
    });
});

app.post('/blog-posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      console.error('error');
      res.status(400).send('missing fields');
    }
  }
  BlogPost
    .create({
      title: req.body.title,
      content: req.body.content,
      author: {firstName: req.body.author.firstName,
              lastName: req.body.author.lastName
      }
    })
    .then(resultObject => {
      res.status(201).json(resultObject.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('server error');
    })
});

app.put('/blog-posts/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    console.error('error');
    res.status(400).send('missing fields');
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .exec()
    .then(resultObject => {
      res.status(200).send(resultObject); // returns object before editing
    });
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPost
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(resultObject => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json('no id');
    });
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// 596518148ed0ed499c5242b7

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};