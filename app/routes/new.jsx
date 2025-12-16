export default function loader({ request }) {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },

        })

    }
}


export async function action({ request }) {
    const body = await request.json();
    console.log(body, "nksafnkjsafkjsfkjaskjfkjfkjsaa");
    const attribute = body.rate.attributes;


    console.log("Response", JSON.stringify(body, null, 2));
    console.log("Attribute", attribute);



    const rates = [];

    rates.push({
        service_name: "Free Standard Shipping",
        service_code: "FREE_STANDARD",
        total_price: "0",
        currency: "USD",
    });


    rates.push({
        service_name: "Standard Ground",
        service_code: "STD_GROUND",
        total_price: "1000",
        currency: "USD",

    });


    rates.push({
        service_name: "Priority Shipping",
        service_code: "PRIORITY",
        total_price: "2000",
        currency: "USD",
    });


    rates.push({
        service_name: "Express Shipping",
        service_code: "EXPRESS",
        total_price: "3500",
        currency: "USD",
    });


    rates.push({
        service_name: "Overnight Delivery",
        service_code: "OVERNIGHT",
        total_price: "5000",
        currency: "USD",
    });

    return Response.json({ rates });
}