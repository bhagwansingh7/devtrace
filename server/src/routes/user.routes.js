import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", isAuth, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  });
});

export default router;