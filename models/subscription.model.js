import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  price:{
    type: Number,
    required: [true, "Price is required"],
    minLength:[ 0, 'Price must be greater than 0'],
   
  },
  currency:{ 
    type: String,
    enum: ['USD', 'EUR', 'GBP'],
    default: 'USD',
  },
  frequency:{
    type: String,
    enum: ['daily', 'monthly', 'weekly', 'annually'],

  },
  category:{
    type: String,
    enum : ['Tech', 'Finance', 'News', 'Lifestyle', 'Politics'],
    required: true,
  },
  paymentMethod:{
    type: String,
    required: [true, "Payment method is required"],
    trim: true,

  },
  status:{
    type: String,
    enum:['active', 'cancelled', 'expired'],
    default: 'active'
  },
  startDate:{
    type: Date,
    required: true,
    validate:{
        validator:(value) => value <= new Date(),
        message: 'Start date must be in the past',
    }
  },
  renewalDate:{
    type: Date,
    required: true,
    validate:{
        validator: function(value) {
           return value > this.startDate();
        } ,
        message: 'Start date must be of the future/after start date',
    }
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, {timestamps: true});


//this fnction will auto calculate renewal date if missing
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }; 
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //auto update the status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired'
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;