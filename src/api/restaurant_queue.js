const express = require('express');
const redis = require('redis');

const client = redis.createClient();

const router = express.Router();

const clientGet = (key) => {
  return new Promise((fullfill,reject)=>{
    client.get(key,(err,data)=>{
      if(err) {
        reject(err);
      }
      else {
        fullfill(data);
      }
    });
  });
}

const clientSet = (key, value) => {
  return new Promise((fullfill,reject)=>{
    client.set(key, value,()=>{
      fullfill({key: value});
    });
  });
}

const clientIncr = (key) => {
    return new Promise((fullfill, reject) => {
        client.incr(key, async (err, data)=>{
            fullfill(await clientGet(key));
        })
    });
}

router.get('/', async (req, res) => {
    res.json({
        a_waiting: await clientGet("a_waiting"),
        b_waiting: await clientGet("b_waiting"),
        c_waiting: await clientGet("c_waiting"),
        d_waiting: await clientGet("d_waiting"),
        a_entered: await clientGet("a_entered"),
        b_entered: await clientGet("b_entered"),
        c_entered: await clientGet("c_entered"),
        d_entered: await clientGet("d_entered"),
  });
});

router.get('/init', async (req, res, next) => {
    await(clientSet("a_waiting", 0),
          clientSet("b_waiting", 0),
          clientSet("c_waiting", 0),
          clientSet("d_waiting", 0),
          clientSet("a_entered", 0),
          clientSet("b_entered", 0),
          clientSet("c_entered", 0),
          clientSet("d_entered", 0)
          )
    res.json({
      message: 'Initialize OK',
    });
});

router.get('/incr/:letter', async (req, res, next) => {
    const {letter} = req.params;
    return res.json(await clientIncr(letter))
});

router.get('/get/:letter', async (req, res, next) => {
  const {letter} = req.params;
  return res.json(await clientGet(letter));
});

router.get('/set/:letter/:value', async (req, res, next) => {
  const {letter, value} = req.params;
  return res.json(await clientSet(letter, value));
});


router.get('/flush', async (req, res, next) => {
    await client.flushdb();
    res.json({
        message: 'Clearing database.',
    });
});

module.exports = router;
