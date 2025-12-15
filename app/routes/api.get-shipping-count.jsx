
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const { ShopSettings } = await import("../models/shopSettings.model");

  const settings = await ShopSettings.findOne({ shop: session.shop });

  return Response.json({
    count: settings?.shippingOptionsCount || 5,
  });
};