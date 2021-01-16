const express = require('express');
const monk = require('monk');

const db = monk("localhost/meower");

const mews = db.get('mews');

const router = express.Router();

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
    mew.content && mew.content.toString().trim() !== '';
}

router.get('/mews', (req, res, next) => {
    mews.find()
    .then((mews) => {
        res.json(mews);
    });
});

router.get('/mews_async', async (req, res, next) => {
    let mew = await mews.find();
    res.json(mew);
});

router.post('/mews', (req, res, next) => {
    if (isValidMew(req.body)) {
        const mew = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date(),
        }
        mews.insert(mew)
        .then(createdMew => {
            res.json(createdMew);
        });
    } else {
        res.status(422);
        res.json({
            message: 'Request could not be understood'
        });
    }
});

module.exports = router;
