import Subscription from '../models/subscription.model.js'
// import {workflowClient} from '../config/upstash.js'

export const createSubscription = async(req, res, next) =>{
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });
        // await workflowClient.triggger({url, body, headers, workflowRunId, retries}: {
        //     url: 
        // })
        res.status(201).json({
            success: true,
             data: subscription,
        });
    } catch (error) {
        next(error);
    }
}


export const getUserSubscriptions = async(req, res, next) => {
    try {
        //check if the user is same as the one in token
        if(req.user.id !== req.params.id){
            const error = new Error('Unauthorised access for some other user detected!');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.id});
        res.status(200).json({success: true, data: subscriptions});
    } catch (error) {
        next(error);
    }
}