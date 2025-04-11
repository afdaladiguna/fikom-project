const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const ProjectSchema = new Schema(
  {
    title: String,
    description: String,
    repository: String,
    category: String,
    images: [ImageSchema],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

//

ProjectSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/projects/${this._id}">${this.title}</a>`;
});

ProjectSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // delete all reviews where their ID field is in
    // the 'doc' or in the deleted campground
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
