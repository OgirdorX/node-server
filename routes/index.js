const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/getItems', catchErrors(itemController.getItems));
router.get('/editItem/:id', catchErrors(itemController.getItems));

router.post('/updateItem/:id', catchErrors(itemController.updateItem));

router.post('/add',
    itemController.upload,
    catchErrors(itemController.resize),
    catchErrors(itemController.createItem)
);


module.exports = router;