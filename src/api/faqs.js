const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');

const db = monk(process.env.MONGODB_URI);
const faqs = db.get('faqs');

const schema = Joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    video_url: Joi.string().uri(),
});

const router = express.Router();

//Post one route
router.post('/', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const inserted = await faqs.insert(value);
        return res.json(inserted);
    } catch (error) {
        next(error);
    }
});

//Get all route
router.get('/', async (req, res, next) => {
    try {
        const items = await faqs.find({});
        console.log(items);
        res.json(items);
    } catch (error) {
        next(error);
    }
});

//Get one route
router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        console.log(id);
        const faq = await faqs.findOne({
            _id: id
        });
        if(!faq) {
            return next();
        }
        return res.json(faq);
    } catch (error) {
        next(error);
    }
});


//Update one route
router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const value = await schema.validateAsync(req.body);
        const faq = await faqs.findOne({
            _id: id
        });
        if(!faq) {
            return next();
        }
        const updated = await faqs.update({
            _id: id
        }, {
            $set: value
        });
        return res.json({
            updated: updated,
            value: await faqs.findOne({_id: id})
        });
    } catch (error) {
        next(error);
    }
});

//Delete one
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const faq = await faqs.remove({_id: id});
        // return res.json(faq);
        return res.status(200).json({
            message: 'Succeed',
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;
