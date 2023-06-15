const Category = require('../Models/category.model');

//Add category
const addCategory = async(req, res) => {
    const { categoryName, categoryType } = req.body;
    const categoryIcon = req.file.filename;

    const insertedIcon = `http://localhost:5000/public/images/${categoryIcon}`;

    if(!req.file || !insertedIcon){
        return res.status(400).json({
            status: 400,
            message: 'Bad request'
        });
    }
    try{
        const category = new Category();
        category.name = categoryName;
        category.icon = insertedIcon;
        category.type = categoryType;
        await category.save();

        return res.status(201).json({
            status: 201,
            message: 'Added category'
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Server error'
        })
    }
}

//Display categories
const displayCategories = async(req, res) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }

    try{
        const categories = await Category.find();
        return res.status(201).json({
            status: 201,
            message: 'Success',
            categories: categories
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Server error'
        });
    }
}


module.exports = { 
    addCategory, 
    displayCategories 
};

