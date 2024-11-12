// models/Poll.js
import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [{ text: String, votes: Number }],
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Poll || mongoose.model("Poll", PollSchema);
