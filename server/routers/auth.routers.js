import express from "express";

import {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  forgotPassword,
  resetPassword,
  getUserData,
  logout,
  accountDelete,
  updateProfile,
  updatePassword,
  addLink,
  updateAvatar,
  verify,
} from "../controllers/auth.controllers.js";

import { auth } from "../middlewares/auth.js";

import multer from "multer";

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.send("Welcome to the Auth API");
});
authRouter.post("/register", register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-verification-email", resendVerificationEmail);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.post("/logout", logout);
authRouter.post("/accountDelete", accountDelete);
authRouter.post("/update-profile", updateProfile);
authRouter.post("/update-password", updatePassword);
authRouter.post("/add-link", addLink);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Add timestamp for unique filenames
  },
});

const upload = multer({ storage });

authRouter.post("/update-avarter", upload.single("newImageUrl"), updateAvatar);

authRouter.get("/getUserData/:username", getUserData);
authRouter.get("/verify", auth, verify);

export default authRouter;
