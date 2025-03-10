import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    publishedIn: { type: Date, required: true },
    image: { type: String, required: true },
    totalPages: {
      type: Number,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    library: {
      type: Schema.Types.ObjectId,
      ref: "Library",
      // default: true,
    },
    borrower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      defult: null,
    },
  },
  { timestamps: true }
);
bookSchema.index({ title: 1, author: 1 });
export default model("Book", bookSchema);
