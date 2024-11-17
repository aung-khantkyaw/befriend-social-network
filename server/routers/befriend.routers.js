import express from "express";
import {
  post,
  createPost,
  likePost,
  unlikePost,
} from "../controllers/befriend.controllers.js";

import multer from "multer";

const beFriendRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

beFriendRouter.get("/", (req, res) => {
  res.send("Welcome to the BeFriend Social Network API");
});

beFriendRouter.get("/posts", post);
beFriendRouter.post("/create-post", upload.array("mediaFiles", 6), createPost);

beFriendRouter.post("/like", likePost);
beFriendRouter.post("/unlike", unlikePost);

export default beFriendRouter;
