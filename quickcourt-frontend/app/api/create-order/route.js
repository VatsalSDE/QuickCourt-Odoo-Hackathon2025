import Razorpay from "razorpay";

export async function POST(request) {
  const body = await request.json();
  const { amount } = body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (error) {
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}