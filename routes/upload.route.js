const { Router } = require("express");
const router = Router();
const { S3 } = require("aws-sdk");
const multer = require("multer");
const Art = require("../models/art.model");
const multerConfig = multer.memoryStorage();

const s3Upload = async (file) => {
  const s3 = new S3();
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/image-${Date.now()}-${file.originalname}`,
    Body: file.buffer,
  };
  return await s3.upload(param).promise();
};

const upload = multer({ storage: multerConfig });

const multiUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file3D", maxCount: 1 },
]);

router.post("/add", multiUpload, async (req, res) => {
  try {
    const filesData = req.files;

    const resultImg = await s3Upload(filesData.image[0]);
    const result3D = await s3Upload(filesData.file3D[0]);

    const art = new Art({
      name: req.body.name,
      description: req.body.description,
      pathImage: resultImg.Location,
      path3D: result3D.Location,
      categories: JSON.parse(req.body.categories),
      owner: req.body.owner,
    });

    await art.save(function (err, result) {
      if (err) {
        res.status(500).json({ message: err });
      } else {
        res.status(201).json({ completed: true, ...result });
      }
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
