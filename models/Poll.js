import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    options: [
      {
        text: String,
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Poll || mongoose.model("Poll", PollSchema);
