const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorite: [{ type: Types.ObjectId, ref: "Art" }],
  arts: [{ type: Types.ObjectId, ref: "Art" }],
});
module.exports = model("User", schema);
