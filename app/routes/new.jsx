
export async function action({ request }) {
    const body = await request.json();
    console.log(JSON.stringify(body, null, 2));


    return body;
}


