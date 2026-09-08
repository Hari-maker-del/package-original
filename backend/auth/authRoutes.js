const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe
} = require("./authController");

const authenticateToken = require("./authMiddleware");

const validate = require("./validationMiddleware");
const rateLimit = require("../app/rateLimit");

const {
  signupSchema,
  loginSchema
} = require("./authValidation");

router.post(
  "/signup",
  rateLimit({max:10,windowMs:15*60*1000,keyGenerator:(req)=>`signup:${req.ip||"unknown"}`}),
  validate(signupSchema),
  signup
);

router.post(
  "/login",
  rateLimit({max:20,windowMs:15*60*1000,keyGenerator:(req)=>`login:${req.ip||"unknown"}`}),
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authenticateToken,
  getMe
);

module.exports = router;