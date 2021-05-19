const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
     required: true
    },
     imageId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Image'
      },
      imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Gallery',gallerySchema);