const PropertyModel = require('../../models/propertyModels/property.model');
const CustomError = require('../../utils/customError');


const propertyCreateController = async (req, res, next) => {
    const { title, description, price, location, images } = req.body;
   
    if(!title && !description && !price && !location && !images) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    if (typeof price !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Price must be a number'
        });
    }
   
    const userId = req.user._id; 
 
    try {
        const property = await PropertyModel.create({
            title,
            description,
            price,
            location,
            images,
            host : userId
        });
        if(!property) {
            return next(new CustomError('Property not created', 400));
        }

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data : property
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
}

const propertyReadController = async (req, res, next) => {
    const { id } = req.params;
    if(!id) { 
        return next(new CustomError('Property ID is required', 400))
    }

    try {
        const property = await PropertyModel.findById(id).populate('host', 'username email');
        if (!property) {
            return next(new CustomError('Property not found', 404))
        }
        res.status(200).json({
            success: true,
            message : "Property fetched successfully",
            data : property
        });
    } catch (error) {
        return next(new CustomError('Invalid Property ID format', 400))
    }
}

const propertyUpdateController = async (req, res, next) => {
    const { id } = req.params;

    if(!id) {
        return new CustomError('Property ID is required', 400);
    }

    const { title, description, price, location, images } = req.body;
    
    if(!title && !description && !price && !location && !images) {
        return new CustomError('All fields are required', 400);
    }
    if (typeof price !== 'number') {
        return new CustomError('Price must be a number', 400);
    }
    try {
        const property = await PropertyModel.findByIdAndUpdate(id, {
            title,
            description,
            price,
            location,
            images
        }, 
        { new: true },
        {runvalidators: true } );

        if (!property) {
            return new CustomError('Property not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data : property
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating property',
            error: error.message
        });
    }
}

const propertyDeleteController = async (req, res, next) => {
    const { id } = req.params;
    if(!id) {
        return new CustomError('Property ID is required', 400);
    }

    try {
        const property = await PropertyModel.findByIdAndDelete(id);

        if (!property) {
            return new CustomError('Property not found', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
       next (new CustomError(error.message, 500));
    }
}

const propertyListController = async (req, res, next) => {
    try {
        const properties = await PropertyModel.find().populate('host', 'username email');
        res.status(200).json({
            success: true,
            properties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
}

const searchPropertyController = async (req, res, next) => {
    try {
        const { location, minPrice, maxPrice } = req.body
        const query = {
            ...(location && { location :{ $regex: location, $options: 'i' }}), // i is for case insensitive
            ...(minPrice && { price: { $gte: minPrice }}),
            ...(maxPrice && { price: { $lte: maxPrice }})
        }

        const properties = await PropertyModel.find(query).populate('host', 'username email');
        if (!properties) {
            return next(new CustomError('No properties found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Properties fetched successfully',
            data: properties
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
}


module.exports = {
    propertyCreateController,
    propertyReadController,
    propertyUpdateController,
    propertyDeleteController,
    propertyListController,
    searchPropertyController
}