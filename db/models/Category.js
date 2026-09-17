import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      required: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", categorySchema, "categories");

export default Category;
