const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// const ProjectSchema = new Schema(
//   {
//     title: String,
//     description: String,
//     repository: String,
//     category: String,
//     images: [ImageSchema],
//     author: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     reviews: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: 'Review',
//       },
//     ],
//   },
//   opts
// );

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    repository: Joi.string().required().escapeHTML(),
    category: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
