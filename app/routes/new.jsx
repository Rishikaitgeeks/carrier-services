export async function action({ request }) {
  const body = await request.json();
  console.log("Response", JSON.stringify(body, null, 2));

  const shippingNote = Number(body?.rate?.items?.[0]?.properties?.shipping_note) || 0;
  console.log("Shipping Note:", shippingNote);

  // Base rates
  const rates = [
    { service_name: "Free Standard Shipping", service_code: "FREE_STANDARD", total_price: 0, currency: "USD" },
    { service_name: "Standard Ground", service_code: "STD_GROUND", total_price: 1000, currency: "USD" },
    { service_name: "Priority Shipping", service_code: "PRIORITY", total_price: 2000, currency: "USD" },
    { service_name: "Express Shipping", service_code: "EXPRESS", total_price: 3500, currency: "USD" },
    { service_name: "Overnight Delivery", service_code: "OVERNIGHT", total_price: 5000, currency: "USD" },
  ];

  // Adjust total_price based on shippingNote
  if (shippingNote > 0) {
    const multiplier = shippingNote + 1; // add 1 as per your requirement
    rates.forEach(rate => {
      rate.total_price = rate.total_price * multiplier;
    });
  }

  return Response.json({ rates });
}
