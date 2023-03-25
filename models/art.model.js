const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  pathImage: { type: String, required: true },
  path3D: { type: String, required: true },
  categories: { type: Array, required: true, default: [] },
  owner: { type: Types.ObjectId, ref: "User" },
});
module.exports = model("Art", schema);
