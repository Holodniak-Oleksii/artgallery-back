const {Schema, model} = require('mongoose')

const schema = new Schema({
    name:{type: String, required: true},
    pathImage: {type: String, required: true},
    path3D: {type: String, required: true},
})
module.exports = model('Art', schema)