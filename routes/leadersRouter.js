const express = require('express');
const bodyParser = require('body-parser');

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter.route('/leaders')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the leaders to you');
})
.post((req, res, next) => {
    let { name, description } = req.body;
    res.end('Will add the leader: ' + name + ' with details: ' + description);
})
.put((req, res, next) => {
    res.end('Put operation not supported on leaders');
    res.statusCode = 403; // not supported.
})
.delete((req, res, next) => {
    res.end('Delete all the leaders');
})

leadersRouter.route('/leaders/:leaderId')
.get((req, res) => {
    let { leaderId } = req.params;
    res.end('Will send details of the leader: '+ leaderId + ' to you !');
})
.post((req, res, next) => {
    res.end('Post operation not supported on /leaders/' + leaderId);
    res.statusCode = 403; // not supported.
})
.put((req, res, next) => {
    let { name,  description} = req.body;
    res.write('Updating the leader:'+ req.params.leaderId + '\n');
    res.end('Will update the leaderId: '
        + name + ' with details: ' 
        + description);
})
.delete((req, res, next) => {
    res.end('Deleting the leaderId: ' + req.params.leaderId);
})

module.exports = leadersRouter;