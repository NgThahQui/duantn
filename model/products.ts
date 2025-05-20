import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: [{ type: String }], 
  product_hot: { type: Number, default: 0 },
  product_new: { type: Number, default: 0 },
  sale: { type: Number, default: 0 }, 
  isActive: { type: Boolean, default: true }, 
  description: { type: String },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
