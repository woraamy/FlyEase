import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

const bookingURL = process.env.BOOKING_URL;
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
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent was successful!`);
            // Handle successful payment intent here
            await fetch(`${bookingURL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_intent: paymentIntent,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Payment intent processed successfully');
            }
            )

            break;
        
            // release reserved spot
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object;
            await fetch(`${bookingURL}/payment-failed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_intent: paymentFailed,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Payment intent failed successfully');
            }
            )
            break;

            // reserved spot
        case 'payment_intent.created':
            const paymentCreated = event.data.object;
            await fetch(`${bookingURL}/payment-created`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_intent: paymentCreated,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Payment intent created successfully');
            }
            )
            break;
        default:
            break;
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
}