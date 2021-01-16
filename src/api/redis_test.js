/*
Example CRUD Routes for redis
POST /key/:id
GET /key
PUT /key/:id
DELETE /key
DELETE /
*/
const express = require('express');
const redis = require('redis');

const client = redis.createClient();

const router = express.Router();

//Get a value from database
const clientGet = (key)=>{
  return new Promise((fullfill,reject)=>{
    client.get(key,(err,data)=>{
      if(err) {
        reject(err);
      }
      else {
        fullfill([key,data]);
      }
    });
  });
}

//Set a key value pair in database
const clientSet = (dataFromGet)=>{
  return new Promise((fullfill,reject)=>{
    let message,data = dataFromGet;
    client.set(message,data,()=>{
      fullfill(message);
    });
  });
}

//Set expire time for a key in database
const clientExpire = (key, expire = 10)=>{
  return new Promise((fullfill,reject)=>{
    client.expire(key,expire, (err, data) => {
      fullfill(data);
    });
  });
}

//Return all keys available in database
const clientKeys = () => {
  return new Promise((resolve, reject) => {
    client.keys("*", (err, data) => {
      resolve(data);
    });
  });
}

//Check if a key exist in database
const clientKey = (key) => {
  return new Promise((resolve, reject) => {
    client.keys(key, (err, data) => {
      if ((data.length === 1) && (data[0] === key)) {
        resolve(true);
      } else {
        resolve(false);
      }      
    })
  });
}

const clientExists = (key) => {
  return new Promise((resolve, reject) => {
    client.exists(key, (err, data) => {
      if(data) {
        resolve(true); //Data is "1" if key exists
      } else {
        resolve (false); //Data is "0" if key not exist
      }
    });
  });
}

const clientDelete = (message) => {
  return new Promise((resolve, reject) => {
    client.del(message, (err, data) => {
      resolve(data);
    });
  });
}

//This does not work
const oldClientFlush = () => {
  return new Promise((fulfill, reject) => {
    client.flushdb();
    fulfill();
  });
}

//This works
const clientFlush = () => {
  return new Promise((fulfill, reject) =>{
    client.flushdb((err, data) => {
      fulfill(data);
    });
  });
}

//Get all
router.get('/', async (req, res, next) => {
  try {
    res.json({
      message: 'GET "*"/OK',
      keys: await clientKeys()
    });
  } catch (error) {
    next(error);
  }
});

//Get one
router.get('/:name', async (req, res, next) => {
  try {
    const {name} = req.params;
    // await client.incr(name);
    let [ _, val ] = await clientGet(name);
    if(val === null) {
      throw new Error('KeyError: Key is not found in database');
    }
    return res.json(
        {
            message: "GET/OK",
            count: val
        });
  } catch (error) {
    next(error);
  }
});



router.put('/:name/:id?', async (req, res, next) => {
  try {
    const {name, id} = req.params;
    if(id) {
      await client.set(name, id);  
    } else {
      await client.incr(name);
    }
    let [ _, val ] = await clientGet(name);
    return res.json({
      message: 'PUT/OK',
      value: val
    });
  } catch (error) {
    next(error);
  }
});


//Delete all
router.delete('/', async (req, res, next) => {
  try {
    return res.json({
      message: 'DELETE/OK',
      result: await clientFlush()
    });
  } catch (error) {
    next(error);
  }
});


//Delete one
router.delete('/:name', async (req, res, next) => {
  try {
    const {name} = req.params;
    return res.json({
      message: 'OK',
      result: await clientDelete(name)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
