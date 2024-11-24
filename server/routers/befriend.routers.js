import express from "express";
import {
  getPosts,
  getFriendsPosts,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsSuggestions,
  getNotis,
  unfriend,
  markAsRead,
} from "../controllers/befriend.controllers.js";

import multer from "multer";
import { auth, isOwner } from "../middlewares/auth.js";

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

beFriendRouter.get("/get-posts", getPosts);
beFriendRouter.get("/getFriendPosts/:userId", getFriendsPosts);
beFriendRouter.post("/create-post", upload.array("mediaFiles", 6), createPost);
// beFriendRouter.put("/edit-post/:id", auth, isOwner("posts"), createPost);
beFriendRouter.delete("/delete-post/:id", auth, isOwner("posts"), deletePost);

beFriendRouter.post("/like", likePost);
beFriendRouter.post("/unlike", unlikePost);

beFriendRouter.get("/get-friends/:userId", getFriends);
beFriendRouter.get("/get-friend-requests/:userId", getFriendRequests);
beFriendRouter.post("/send-friend-request/:userId", sendFriendRequest);
beFriendRouter.put("/accept-friend-request/:friendshipId", acceptFriendRequest);
beFriendRouter.delete("/unfriend/:friendshipId", unfriend);
beFriendRouter.get("/get-friends-suggestions/:userId", getFriendsSuggestions);

beFriendRouter.get("/notis", auth, getNotis);
beFriendRouter.put("/mark-as-read/:notiId", auth, markAsRead);

export default beFriendRouter;
