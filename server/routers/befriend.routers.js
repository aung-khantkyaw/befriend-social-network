import express from "express";
import { post } from "../controllers/befriend.controllers.js";
const beFriendRouter = express.Router();

beFriendRouter.get("/", (req, res) => {
  res.send("Welcome to the BeFriend Social Network API");
});

beFriendRouter.get("/posts", post);




export default beFriendRouter;