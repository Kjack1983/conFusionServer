const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/dishes')
.get((req, res, next) => {
    Dishes.find({})
    .then(dishes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, error => next(error))
    .catch(error => next(error));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then(dish => {
        console.log('dish created:', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, error => next(error))
    .catch(error => next(error));   
})
.put((req, res, next) => {
    res.end('Put operation not supported on dishes');
    res.statusCode = 403; // not supported.
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error));
})

dishRouter.route('/dishes/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        console.log('dish created:', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, error => next(error))
    .catch(error => next(error));
})
.post((req, res, next) => {
    res.statusCode = 403; // not supported.
    res.end('Post operation not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then(dish => {
        console.log('dish created:', dish);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dish);
    }, error => next(error))
    .catch(error => next(error));
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error));
})

module.exports = dishRouter;