const { Router } = require('express');
const route = Router();
const { addCategory, displayCategories } = require('../Controllers/category.controllers');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/categories/')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage
});

route.post('/addCategory', upload.single('categoryIcon') ,addCategory);
route.get('/displayCategory', displayCategories);

module.exports = route