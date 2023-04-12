import express from "express";
import userController from "../controllers/userController.js"; 
import { verifyJWT } from "../verifyJWT.js";

const router = express.Router();

router.route("/signup").post(userController.createNewUser);

router.use(verifyJWT);

router.route("/")
    .get(userController.getUser)
    .delete(userController.deleteUser);

export default router;