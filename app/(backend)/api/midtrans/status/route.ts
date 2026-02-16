import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const transaction = await snap.createTransaction(requestBody);

    return new Response(JSON.stringify(transaction), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    return new Response(JSON.stringify({ error: "Failed to create transaction" }), { status: 500 });
  }
}


// const http = require('https');

// const options = {
//   method: 'GET',
//   hostname: 'api.sandbox.midtrans.com',
//   port: null,
//   path: '/v2/order_id/status-1',
//   headers: {
//     accept: 'application/json',
//     authorization: 'Basic U0ItTWlkLXNlcnZlci1XMFYwZDZLSEpDQ3ZrdU0tOEFaQWpic1I6'
//   }
// };

// const req = http.request(options, function (res) {
//   const chunks = [];

//   res.on('data', function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on('end', function () {
//     const body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// req.end();