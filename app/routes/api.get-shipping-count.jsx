import { json } from "@react-router/node"; // ye safe hai loader mein
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const { ShopSettings } = await import("../../models/shopSettings.model.js");

  const settings = await ShopSettings.findOne({ shop: session.shop });

  return json({
    count: settings?.shippingOptionsCount || 5,
  });
};