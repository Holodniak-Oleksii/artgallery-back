const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/user.model");
const Art = require("../models/art.model");

// /api/auth/register
router.post(
  "/register",
  [
    check("email", "Invalid email").isEmail(),
    check(
      "password",
      "The password must contain at least 8 characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect information during registration",
        });
      }

      const { username, email, password } = req.body;

      const candidateEmail = await User.findOne({ email });

      if (candidateEmail) {
        return res
          .status(400)
          .json({ filed: "email", message: "This user already exists" });
      }

      const candidateName = await User.findOne({ username });

      if (candidateName) {
        return res
          .status(400)
          .json({ filed: "username", message: "This user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ username, email, password: hashedPassword });

      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7h",
      });

      res.json({ token, userId: user.id, isAuth: true });
    } catch (e) {
      res
        .status(500)
        .json({ message: `An error occurred, please try again ${e}` });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [check("password", "Enter your password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect information during authorization",
        });
      }

      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ filed: "username", message: "No user found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          filed: "password",
          message: "Incorrect password, please try again",
        });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7h",
      });

      res.json({ token, userId: user.id, isAuth: true });
    } catch (e) {
      res.status(500).json({ message: "An error occurred, please try again" });
    }
  }
);

router.post("/check", async (req, res) => {
  try {
    const token = req.body.ArtGalleryToken;
    if (!token) {
      return res.status(401).json({ token: null, userID: null, isAuth: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.json({ token, userID: decoded.userId, isAuth: true });
  } catch (e) {
    res.status(401).json({ token: null, userID: null, isAuth: false });
  }
});

router.post("/get-user", async (req, res) => {
  try {
    let user = await User.find({ _id: req.body.id });
    let arts = await Art.find({ owner: req.body.id });
    res.json({ ...user[0]._doc, arts: arts });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/get-user-list", async (req, res) => {
  try {
    let users = await User.find({});
    const list = [];
    users.forEach((user) => {
      list.push({ id: user._id });
    });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = router;
