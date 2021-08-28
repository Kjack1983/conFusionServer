const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders')
const authenticate = require('../authenticate');
const cors = require('./cors');

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter.route('/leaders')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Leaders.find({})
    .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, error => next(error))
    .catch(error => next(error));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
    }, error => next(error))
    .catch(error => next(error));   
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Put operation not supported on leaders');
    res.statusCode = 403; // not supported.
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error))
})

leadersRouter.route('/leaders/:leaderId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res) => {
    let { leaderId } = req.params;
    Leaders.findById(req.params.leaderId)
    .then(leader => {
        if(leader !== null) {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(leader);
        } else {
            error = new Error('leaders id' + req.params.leaderId + 'not found');
            res.statusCode = 404;
            return next(error);
        }
    }, error => next(error))
    .catch(error => next(error))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Post operation not supported on /leaders/' + req.params.leaderId);
    res.statusCode = 403; // not supported.
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
    }, error => next(error))
    .catch(error => next(error));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error));
})

module.exports = leadersRouter;