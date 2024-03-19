const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/product/productModel");
const ProductType = require("../models/product/productTypeModel");
const ProductCompany = require("../models/product/productCompanyModel");
const ProductRequest = require("../models/request/productRequestModel");
const { sendMessage } = require("./notificationController");




/////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product
///////////////////////////////////////////////////////////////////////////////////////////////
exports.addProduct = catchAsyncError(async (req, res, next) => {
  const { name, product_code, type_id, company_id, description, quantity } = req.body;

  try {
    // Check if the product already exists by name and product code
    const existingProduct = await Product.findOne({ name, product_code,company_id });

    if (existingProduct) {
      // If the product exists, update the quantity
      existingProduct.quantity += quantity;
      await existingProduct.save();

      return res.status(200).json({
        message: "Quantity Updated Successfully",
      });
    } else {
      // If the product doesn't exist, create a new one
      const newProduct = await Product.create({
        name,
        product_code,
        type_id,
        company_id,
        description,
        quantity,
      });

      return res.status(200).json({
        message: "Product Added Successfully",
      });
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product Type
///////////////////////////////////////////////////////////////////////////////////////////////
exports.addProductType = catchAsyncError(async (req, res, next) => {
  const { name, subType } = req.body;

  console.log(req.body);
  try {
    const product = await ProductType.create({
      name,
      subType,
    });

    res.status(200).json({
      message: "Product Type Add Successfully",
    });
  } catch (error) {}
});
////////////////////////////////////////////////////////////////////////////////////////////////

//Add Product Company
///////////////////////////////////////////////////////////////////////////////////////////////
exports.addProductCompany = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  console.log(req.body);
  try {
    const product = await ProductCompany.create({
      name,
      description,
    });

    res.status(200).json({
      message: "Product Company Add Successfully",
    });
  } catch (error) {}
});
////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// Get All Product
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const product = await Product.find({ type_id: id })
      .populate("company_id")
      .populate("type_id");
    console.log(product);
    if (product == "") {
      res.json({ success: false, product: "No Item Found" });
    } else {
      res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////



// Get Product Type
/////////////////////////////////////////////////////////////////////////////////////////////
exports.getProductType = catchAsyncError(async (req, res, next) => {
  try {
    const product = await ProductType.find();
    console.log(product)

    if(product.length!=0)
    {
    res.status(200).json({
      success: true,
      product,
    });
  }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////
