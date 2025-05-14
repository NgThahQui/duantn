import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  price: { type: Number},
  name: { type: String },   
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
