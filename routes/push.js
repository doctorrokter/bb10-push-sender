'use strict';

var express = require('express');
var router = express.Router();
var pushLibrary = require('node-bb10');

var initiator = new pushLibrary.PushInitiator('1400-la83B532433iO13y8508o50c3a106a20s92', '6rDQacwP', '1400', false);

function statusMessage(status, message) {
    return {status: status, message: message};
}

router.get('/', function(req, resp, next) {
    resp.render('push', { title: 'Push Service' });
});

router.post('/', function(req, resp, next) {
    var data = req.body;
    var pins = [];
    if (!data.pins.length) {
        pins.push(data.pins);
    } else {
        pins = pins.concat(data.pins);
    }
    console.log(JSON.stringify(data.message));

    if (!data || !data.message || !data.pins) {
        resp.status(400).json(statusMessage(400, 'Params \'message\' and \'pins\' should be provided'));
    } else if (pins.length === 0) {
        resp.status(400).json(statusMessage(400, 'Please provide at least 1 pin'));
    } else {
        var messageID = new Date().getTime();
        var message = new pushLibrary.PushMessage(messageID, JSON.stringify(data.message));
        message.addAllRecipients(pins);
        message.setDeliveryMethod('unconfirmed');
        initiator.push(message, function(err, result) {
            console.log(err);
            console.log(result);
            resp.status(200).json(statusMessage(200, result));
        });
    }
});

module.exports = router;