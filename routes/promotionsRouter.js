const express = require('express');
const bodyParser = require('body-parser');

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

promotionsRouter.route('/promotions')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the promotions to you');
})
.post((req, res, next) => {
    let { name, description } = req.body;
    res.end('Will add the promotion: ' + name + ' with details: ' + description);
})
.put((req, res, next) => {
    res.end('Put operation not supported on promotions');
    res.statusCode = 403; // not supported.
})
.delete((req, res, next) => {
    res.end('Delete all the promotions');
})

promotionsRouter.route('/promotions/:promotionId')
.get((req, res) => {
    let { promotionId } = req.params;
    res.end('Will send details of the promotion: '+ promotionId + ' to you !');
})
.post((req, res, next) => {
    res.end('Post operation not supported on /promotions/' + promotionId);
    res.statusCode = 403; // not supported.
})
.put((req, res, next) => {
    let { name,  description} = req.body;
    res.write('Updating the promotion:'+ req.params.promotionId + '\n');
    res.end('Will update the promotionId: '
        + name + ' with details: ' 
        + description);
})
.delete((req, res, next) => {
    res.end('Deleting the promotionId: ' + req.params.promotionId);
})

module.exports = promotionsRouter;