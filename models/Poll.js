// models/Poll.js
import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  options: {
    type: [{
      text: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Option text cannot be empty'],
        maxlength: [100, 'Option text cannot exceed 100 characters']
      },
      votes: {
        type: Number,
        default: 0,
        min: [0, 'Votes cannot be negative']
      }
    }],
    validate: {
      validator: function(options) {
        return options.length > 0;
      },
      message: 'At least one option is required'
    }
  },
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Poll || mongoose.model("Poll", PollSchema);
