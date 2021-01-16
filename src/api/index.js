const express = require('express');

const emojis = require('./emojis');
const faqs = require('./faqs');
const redis_test = require('./redis_test');
const facepp = require('./facepp');
const mews = require('./mews');
const restaurant = require('./restaurant_queue');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/faqs', faqs);
router.use('/redis', redis_test);
router.use('/facepp', facepp);
router.use('/mews', mews);
router.use('/restaurant', restaurant);

module.exports = router;
