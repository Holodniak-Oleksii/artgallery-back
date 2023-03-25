const { Router } = require("express");
const router = Router();
const Art = require("../models/art.model");

router.get("/all", async (req, res) => {
  try {
    const arts = await Art.find({});
    res.json(arts);
  } catch (e) {
    res.status(500).json({ message: "Невдалося дістати дані" });
  }
});

router.post("/detail", async (req, res) => {
  try {
    let art = await Art.find({ _id: req.body.id });
    res.json(art[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
