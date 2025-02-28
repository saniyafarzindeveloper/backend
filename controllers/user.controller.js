//AUTH HANDLING

import User from "../models/user.model.js";

//get ALL USERS
export const getUsers = async (req, res, next) => {
    try {
        //try fetching the users
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
       const user = await User.findById(req.params.id).select('-password'); //fetch by ID
       if(!user){
        const error = new Error('User not found :(');
        error.statusCode = 404;
        throw error
       }

       //if user is found
       res.status(200).json({
        success: true,
        data: user,
    })
    } catch (error) {
        next(error);
    }
}