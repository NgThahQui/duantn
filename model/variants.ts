import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  size: [{ type: String }],
  color: [{ type: String }],
  stock_quantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Variant || mongoose.model("Variant", VariantSchema);
