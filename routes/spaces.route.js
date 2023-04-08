const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const Art = require("../models/art.model");
const User = require("../models/user.model");

router.get("/all", async (req, res) => {
  try {
    const arts = await Art.find({});
    res.json(arts);
  } catch (e) {
    res.status(500).json({});
  }
});

router.post("/filter", async (req, res) => {
  try {
    if (
      !req.body.search &&
      (!req.body.category || req.body.category === "all")
    ) {
      const result = await Art.find({});
      res.json(result);
    } else {
      if (req.body.category === "all") {
        const result = await Art.find({
          name: {
            $regex: req.body.search,
            $options: "i",
          },
        });
        res.json(result);
      } else {
        const result = await Art.find({
          categories: {
            $in: [req.body.category],
          },
          name: {
            $regex: req.body.search,
            $options: "i",
          },
        });
        res.json(result);
      }
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/detail", async (req, res) => {
  try {
    let art = await Art.find({ _id: mongoose.Types.ObjectId(req.body.id) });
    let owner = await User.find({
      _id: mongoose.Types.ObjectId(art[0]._doc.owner),
    });

    const data = {
      ...art[0]._doc,
      owner: owner[0].username,
      ownerId: owner[0]._id,
    };

    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
