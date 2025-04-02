import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const { price, name } = await request.json();
        if (!price || !name) {
            return NextResponse.json({ message: 'Price and name are required' }, { status: 400 });
        }

        // Create a new product in Stripe
        const { id } = await stripe.prices.create({
            unit_amount: Math.round(price * 100),
            currency: 'usd',
            product_data: {
                name: 'name',
              },
            tax_behavior: 'exclusive',
            }
        );

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        return NextResponse.json({ id: session.id, client_secret: session.client_secret });
    } catch (error: any) {
      console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

