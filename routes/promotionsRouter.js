const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

promotionsRouter.route('/promotions')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Promotions.find({})
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, error => next(error))
    .catch(error => next(error));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotion);
    }, error => next(error))
    .catch(error => next(error));   
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Put operation not supported on promotions');
    res.statusCode = 403; // not supported.
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error))
})

promotionsRouter.route('/promotions/:promotionId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promotionId)
    .then(promotion => {
        console.log(promotion);
        if(promotion !== null) {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(promotion);
        } else {
            error = new Error('promotion id' + req.params.promotionId + 'not found');
            res.statusCode = 404;
            return next(error);
        }
    }, error => next(error))
    .catch(error => next(error))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Post operation not supported on /promotions/' + req.params.promotionId);
    res.statusCode = 403; // not supported.
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let { promotionId } = req.params;
    Dishes.findByIdAndUpdate(promotionId, {
        $set: req.body
    }, { new: true })
    .then(promotion => {
        console.log('promotions created:', promotion);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotion);
    }, error => next(error))
    .catch(error => next(error));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let { promotionId } = req.params; 
    Promotions.findByIdAndRemove(promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, error => next(error))
    .catch(error => next(error));
})

module.exports = promotionsRouter;