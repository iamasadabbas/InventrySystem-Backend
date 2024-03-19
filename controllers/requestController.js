const ErrorHandler= require("../utils/errorHandler");
const catchAsyncError=require("../middlewares/catchAsyncError")

const Request= require("../models/request/productRequestModel");
const UserProduct=require("../models/request/userProductModel");
const { sendMessage } = require("./notificationController");

// get Product Request
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductRequest = catchAsyncError(async (req, res, next) => {
   const id=req.params.user
  
    try {
       // const request= await Request.find({user_id:id}).populate({path:"product_id._id",populate:{path:"company_id"}}).populate('user_id')
       const request= await Request.find({user_id:id}).populate('user_id').populate({path:'request_id',populate:{path:"product_id._id",model:'Product'}})
       if(request.length!=0)
       {
      res.status(200).json({
        success: true,
       request
      });
    }
    } catch (error) {
      console.log(error);
    }
  });
  //////////////////////////////////////////////////////////////////////////////////////////////
  
// Add Product Request
/////////////////////////////////////////////////////////////////////////////////////////////
exports.productRequest = catchAsyncError(async (req, res, next) => {
  const {user_id,product_id} = req.body;
  

  // Generate a unique request number
  const lastRequest = await Request.findOne({}, {}, { sort: { 'createdAt': -1 } });
  let requestNumber='0001';
  if(lastRequest)
  {
    const lastRequestNumber= lastRequest.request_number || '0000';
    console.log(lastRequestNumber);
    const nextNumber= parseInt(lastRequestNumber,10)+1;
    requestNumber= padZeros(nextNumber,4);
  }

  const userProduct= await UserProduct.create({
      user_id,
      product_id
    })

  if(userProduct){
    const request= await  Request.create({
      request_id:userProduct._id,
      user_id,
      request_number:requestNumber
    })
    
    if(request){
      console.log(requestNumber)
      res.status(200).json({ 
       message:"Request Created Successfully"
      });
      sendMessage();
    }
    }
  
  
});
//////////////////////////////////////////////////////////////////////////////////////////////

const padZeros = (number, length) => {
  return String(number).padStart(length, '0');
};