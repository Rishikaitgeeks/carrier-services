import mongoose from "mongoose";

const shopSettingsSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true }, // myshop.myshopify.com
  shippingOptionsCount: { type: Number, default: 5 },
  updatedAt: { type: Date, default: Date.now },
});

export const ShopSettings =
  mongoose.models.ShopSettings || mongoose.model("ShopSettings", shopSettingsSchema);