// // Koi import nahi chahiye json ke liye!

// export async function action({ request }) {
//   const body = await request.json();
//   const rate = body.rate;

// //   console.log(JSON.stringify(body, null, 2));

//   // Weight calculation
//   let totalWeightGrams = 0;
//   if (rate.items && Array.isArray(rate.items)) {
//     rate.items.forEach(item => {
//       if (item.grams && item.quantity) {
//         totalWeightGrams += item.grams * item.quantity;
//       }
//     });
//   }
//   const totalWeightPounds = Math.ceil(totalWeightGrams / 453.592);

//   const subtotalCents = rate.order_totals?.subtotal_price || 0;

//   const rates = [];

//   // 1. Free Shipping if subtotal >= $100
//   if (subtotalCents >= 10000) {
//     rates.push({
//       service_name: "Free Standard Shipping",
//       service_code: "FREE_STANDARD",
//       total_price: "0",
//       currency: "USD",
//     });
//   }

//   // 2. Standard Ground - weight based
//   let standardPrice = 1000; // $10 base
//   if (totalWeightPounds > 5) {
//     standardPrice += (totalWeightPounds - 5) * 200; // +$2 per extra pound
//   }
//   rates.push({
//     service_name: "Standard Ground",
//     service_code: "STD_GROUND",
//     total_price: standardPrice.toString(),
//     currency: "USD",

//   });

//   // 3. Priority
//   rates.push({
//     service_name: "Priority Shipping",
//     service_code: "PRIORITY",
//     total_price: "2000",
//     currency: "USD",
//   });

//   // 4. Express
//   rates.push({
//     service_name: "Express Shipping",
//     service_code: "EXPRESS",
//     total_price: "3500",
//     currency: "USD",
//   });

//   // 5. Overnight
//   rates.push({
//     service_name: "Overnight Delivery",
//     service_code: "OVERNIGHT",
//     total_price: "5000",
//     currency: "USD",
//   });

//   // YE CORRECT LINE HAI React Router v7 ke liye
//   return Response.json({ rates });
// }

export async function action({ request }) {
  const body = await request.json();
  const rate = body.rate;

  console.log("Shipping Request:", JSON.stringify(body, null, 2));

  // Shop domain nikaalo (Shopify har request mein bhejta hai)
  const url = new URL(request.url);
  const shopDomain = url.searchParams.get("shop");

  let shippingCount = 5; // default

  if (shopDomain) {
    const { ShopSettings } = await import("../models/shopSettings.model.js");
    const settings = await ShopSettings.findOne({ shop: shopDomain });
    if (settings) shippingCount = settings.shippingOptionsCount;
  }

  // Weight calculation
  let totalWeightGrams = 0;
  rate.items?.forEach((item) => {
    if (item.grams && item.quantity) {
      totalWeightGrams += item.grams * item.quantity;
    }
  });
  const totalWeightPounds = Math.ceil(totalWeightGrams / 453.592);
  const subtotalCents = rate.order_totals?.subtotal_price || 0;

  const rates = [];

  // Optional: Free Shipping
  if (subtotalCents >= 10000) {
    rates.push({
      service_name: "Free Standard Shipping",
      service_code: "FREE",
      total_price: "0",
      currency: "USD",
      description: "Free on orders over $100",
    });
  }

  // Pre-defined options (jitne chahiye utne add kar sakte ho)
  const availableOptions = [
    { name: "Standard Ground", price: 1000, desc: "5-7 business days" },
    { name: "Priority Shipping", price: 2000, desc: "3-5 business days" },
    { name: "Express Shipping", price: 3500, desc: "2-3 business days" },
    { name: "Overnight Delivery", price: 5000, desc: "Next day" },
    { name: "Same Day Delivery", price: 8000, desc: "Same day (limited areas)" },
    { name: "Economy Shipping", price: 700, desc: "7-10 business days" },
    { name: "Premium Express", price: 10000, desc: "1-2 days guaranteed" },
  ];

  // Sirf utne options dikhao jitna admin ne set kiya
  for (let i = 0; i < shippingCount && i < availableOptions.length; i++) {
    let price = availableOptions[i].price;

    // Pehle option pe weight-based surcharge laga sakte ho
    if (i === 0 && totalWeightPounds > 5) {
      price += (totalWeightPounds - 5) * 200;
    }

    rates.push({
      service_name: availableOptions[i].name,
      service_code: `RATE_${i + 1}`,
      total_price: price.toString(),
      currency: "USD",
      description: availableOptions[i].desc,
    });
  }

  return Response.json({ rates });
}