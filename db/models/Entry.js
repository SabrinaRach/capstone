import mongoose from "mongoose";

const { Schema } = mongoose;

const entrySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      /* categories have to be defined later in the app, so that users can choose from a list of categories or add their own */
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },
    steps: {
      type: [{ type: String, trim: true }],
      required: true,
    },
    items: {
      type: [{ type: String, trim: true }],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },

  { timestamps: true },
);

const Entry =
  mongoose.models.Entry || mongoose.model("Entry", entrySchema, "entries");

export default Entry;
