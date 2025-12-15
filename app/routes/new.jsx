export async function action({ request }) {
  const body = await request.json();
  const rate = body.rate;

  console.log(JSON.stringify(body, null, 2));

  let totalWeightGrams = 0;
  if (rate.items && Array.isArray(rate.items)) {
    rate.items.forEach(item => {
      if (item.grams && item.quantity) {
        totalWeightGrams += item.grams * item.quantity;
      }
    });
  }
  const totalWeightPounds = Math.ceil(totalWeightGrams / 453.592); 

  const subtotalCents = rate.order_totals?.subtotal_price || 0;

  // 5 shipping rates banao
  const rates = [];

  // 1. Free Shipping (agar subtotal > $100 ho to)
  if (subtotalCents > 10000) { // $100 = 10000 cents
    rates.push({
      service_name: "Free Standard Shipping",
      service_code: "FREE",
      total_price: "0",
      currency: "USD",
      description: "Free delivery on orders over $100",
      min_delivery_date: null, // optional
      max_delivery_date: null
    });
  }

  // 2. Standard Ground (flat $10, ya weight-based simple)
  let standardPrice = 1000; // $10 base
  if (totalWeightPounds > 5) {
    standardPrice += (totalWeightPounds - 5) * 200; // extra pounds pe $2
  }
  rates.push({
    service_name: "Standard Ground",
    service_code: "STD_GROUND",
    total_price: standardPrice.toString(),
    currency: "USD",
    description: "5-7 business days"
  });

  // 3. Priority Shipping
  rates.push({
    service_name: "Priority Shipping",
    service_code: "PRIORITY",
    total_price: "2000", // $20
    currency: "USD",
    description: "3-5 business days"
  });

  // 4. Express Shipping
  rates.push({
    service_name: "Express Shipping",
    service_code: "EXPRESS",
    total_price: "3500", // $35
    currency: "USD",
    description: "2-3 business days"
  });

  // 5. Overnight Shipping
  rates.push({
    service_name: "Overnight",
    service_code: "OVERNIGHT",
    total_price: "5000", // $50
    currency: "USD",
    description: "Next day delivery"
  });

  // Agar koi rate nahi to empty array (Shopify fallback rates use karega)
  return rates;
}