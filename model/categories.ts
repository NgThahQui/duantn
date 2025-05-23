import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String }, 
  isActive: { type: Boolean, default: true},  
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
