import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';


const bookingURL = process.env.BOOKING_URL;

export async function POST(request: Request) {
    try {
        const { price, name, seat_number, flight_number } = await request.json();
        if (!price || !name) {
            return NextResponse.json({ message: 'Price and name are required' }, { status: 400 });
        }

        let booking_id: number;
        // create booking without payment 
        try {
            const response = await fetch(`${bookingURL}/booking/check/${seat_number}/${flight_number}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.log('Error please contact support response:', response);
                return NextResponse.json({ message: 'Error fetching booking data' }, { status: 500 });
            }
            
            // Parse the response to get the booking ID
            const data= await response.json();
            booking_id = data.booking_id;

        } catch (error) {
            console.error('Error creating booking:', error);
            return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
        }


        // Create a new product in Stripe
        const { id } = await stripe.prices.create({
            unit_amount: price,
            currency: 'usd',
            product_data: {
                name: name,
              },
            tax_behavior: 'exclusive',
            },
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
            payment_intent_data: {
                metadata: {
                    // define form information here
                    // example
                    booking_id: booking_id,
                    // id_card: id_card,
                    // passport: passport,
                    // first_name: first_name,
                },
            },
            mode: 'payment',
            expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
            return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
        });

        return NextResponse.json({ id: session.id, client_secret: session.client_secret });
    } catch (error: any) {
      console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

