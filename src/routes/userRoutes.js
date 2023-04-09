import express from "express";
import userController from "../controllers/userController.js"; 

const router = express.Router()
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .delete(userController.deleteUser);

export { router };