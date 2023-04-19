import express from "express";
import productController from "../controllers/productController.js";
import { verifyJWT } from "../verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/category/:category")
    .get(productController.getCategoryProduct);

router.route("/:id")
    .get(productController.getProduct);

router.route("/")
    .post(productController.createProduct)
    .delete(productController.deleteProduct);

export default router;