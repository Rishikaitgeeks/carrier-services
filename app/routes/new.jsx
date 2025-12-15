// Koi import nahi chahiye json ke liye!

export async function action({ request }) {
  const body = await request.json();
  const rate = body.rate;

  console.log(JSON.stringify(body, null, 2));

  // Weight calculation
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

  const rates = [];

  // 1. Free Shipping if subtotal >= $100
  if (subtotalCents >= 10000) {
    rates.push({
      service_name: "Free Standard Shipping",
      service_code: "FREE_STANDARD",
      total_price: "0",
      currency: "USD",
      description: "Free on orders over $100",
    });
  }

  // 2. Standard Ground - weight based
  let standardPrice = 1000; // $10 base
  if (totalWeightPounds > 5) {
    standardPrice += (totalWeightPounds - 5) * 200; // +$2 per extra pound
  }
  rates.push({
    service_name: "Standard Ground",
    service_code: "STD_GROUND",
    total_price: standardPrice.toString(),
    currency: "USD",
    description: "5-7 business days",
  });

  // 3. Priority
  rates.push({
    service_name: "Priority Shipping",
    service_code: "PRIORITY",
    total_price: "2000",
    currency: "USD",
    description: "3-5 business days",
  });

  // 4. Express
  rates.push({
    service_name: "Express Shipping",
    service_code: "EXPRESS",
    total_price: "3500",
    currency: "USD",
    description: "2-3 business days",
  });

  // 5. Overnight
  rates.push({
    service_name: "Overnight Delivery",
    service_code: "OVERNIGHT",
    total_price: "5000",
    currency: "USD",
    description: "Next business day",
  });

  // YE CORRECT LINE HAI React Router v7 ke liye
  return Response.json({ rates });
}