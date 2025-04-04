import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

const bookingURL = process.env.NEXT_PUBLIC_BOOKING_URL;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!bookingURL) {
    throw new Error('Env BOOKING_URL is not defined');
}

if (!endpointSecret) {
    throw new Error('Env STRIPE_WEBHOOK_SECRET is not defined');
}

export async function POST(request: Request) {
    const sig = request.headers.get('Stripe-Signature') || '';
    
    const body = await request.text();
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
    } catch (err) {
        console.log(`Error message: ${(err as Error).message}`);
        return NextResponse.json({ message: `Webhook Error ${(err as Error).message}` }, { status: 400 });
    }
    
    switch (event.type) {
            // reserved spot status confirmed
        case 'payment_intent.succeeded':
            console.log("POST /success begin")
            const paymentIntent = event.data.object.metadata;

            // Handle successful payment intent here
            await fetch(`${bookingURL}/booking/success`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({paymentIntent}),
            })
            .then((response) => {
                if (!response.ok) {
                    console.log('Error please contact support response:', response);
                    console.log('Error please contact support body:', response.body);
                    return
                }
                
                console.log('Payment intent succeeded successfully');
                console.log(response.body)
            }
            )
            break;

        case 'checkout.session.expired':
            const session = event.data.object.metadata;;
            // delete reserved spot
            console.log(`Session expired!`);
            await fetch(`${bookingURL}/booking/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({session}),
            })
        default:
            break;
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
}