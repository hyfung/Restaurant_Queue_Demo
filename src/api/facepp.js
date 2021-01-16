const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/query', (req, res) => {
    let queryString = req.query
    return res.json({
        'message': 'OK',
        'queryString': queryString,
    });
});

router.get('/body', (req, res) => {
    let queryString = req.query
    return res.json({
        'message': 'OK',
        'queryString': queryString,
    });
});

router.get('/json', (req, res) => {
    let queryString = req.query
    return res.json({
        'message': 'OK',
        'queryString': queryString,
    });
});

router.get('/formdata', (req, res) => {
    let x = 0;
});

module.exports = router;
