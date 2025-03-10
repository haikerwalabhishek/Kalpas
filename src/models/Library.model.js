import { Schema, model } from "mongoose";

const librarySchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required:true },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);
librarySchema.index({ name: 1, address: 1 });
export default model("Library", librarySchema);
