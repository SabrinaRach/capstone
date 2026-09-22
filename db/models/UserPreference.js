import mongoose from "mongoose";

const { Schema } = mongoose;

const userPreferenceSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    locale: {
      type: String,
      enum: ["de", "en"],
      default: "de",
    },
  },
  { timestamps: true },
);

const UserPreference =
  mongoose.models.UserPreference ||
  mongoose.model("UserPreference", userPreferenceSchema, "userPreferences");

export default UserPreference;
