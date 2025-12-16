const server = "https://carrier-services.onrender.com";

export default class apicall {
    async dataPass(data, shop) {
        console.log(data, shop);
        const url = `${server}/new`;
        const res = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${shop}`
            },
            body: JSON.stringify(data)
        })
        return (await res).json();
    }
}