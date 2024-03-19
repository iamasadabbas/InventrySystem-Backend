const express = require("express");
const { getProductRequest, productRequest } = require("../controllers/requestController");
const router = express.Router();

router.route("/getProductRequest/:user").get(getProductRequest)
router.route("/productRequest").post(productRequest);

module.exports = router;