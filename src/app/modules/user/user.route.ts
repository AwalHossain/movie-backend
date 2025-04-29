import express from "express";
import passport from "passport";

import { sendResponse } from "../../../shared/sendResponse";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const router = express.Router();

router.post("/register", UserController.registrationUser);
router.post("/login", UserController.loginUser);
router.post("/refresh-token", UserController.refreshToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", passport.authenticate("google"), (req, _res) => {
  console.log(req.user, "req.user");

  const user = {
    statusCode: 200,
    success: true,
    message: "Google Logged In Successfully!",
    data: {
      ...(req.user as any).toObject(),
      // accessToken: token,
    },
  };
  sendResponse(_res, user);
});

router.get("/check-session", isAuthenticated, async (req, res) => {
  const id = (req.user as any).id;
  console.log("check session", id);
  const user = await UserService.getUserById(id);
  console.log("user", user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Session is active !",
    data: user,
  });
});


export const UserRoutes = router;
