const mongoose = require('mongoose');
const Item = require('../models/Item');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    };
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `${uuid.v4()}.${extension}`;
    const image = await jimp.read(req.file.buffer);
    await image.resize(320, 320);
    await image.write(`../public/images/${req.body.image}`);
    next();
};

exports.createItem = async (req, res) => {
    const item = await (new Item(req.body)).save();
    res.send(item);
};

exports.getItems = async (req, res) => {
    const query = (req.params.id) ? { _id: req.params.id, } : {};
    const itemsPromise = Item.find(query, {
        low: 0,
        createdAt: 0,
        updatedAt: 0
    })
        .where({ low: null });
    const countPromise = Item.count();

    const [items, count] = await Promise.all([itemsPromise, countPromise]);
    console.log('items', items);
    console.log('count', count);
    const result = {
        items,
        count
    }
    res.send(result);
};

exports.updateItem = async (req, res) => {
    console.log('*/*/*/*/*/*');
    console.log(req.params.id);
    const item = await Item.findOneAndupdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    console.log('item', item);
    res.send(item);
};

exports.deleteItem = async (req, res) => {
    const item = await Item.findOneAndUpdate({ _id: req.params.id }, { low: Date.now() }).exec();
    res.send(true);
};