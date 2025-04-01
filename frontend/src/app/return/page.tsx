import { stripe } from "@/lib/stripe";

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId!);
  return session;
}

export default async function CheckoutReturn({ searchParams }: { searchParams: { session_id: string } }) {
    const { session_id } = await searchParams;
    const session = await getSession(session_id);

    console.log(session);

    if (session?.status === "open") {
        return <p>Payment did not work.</p>;
    }

    if (session?.status === "complete") {
        return (
        <h3>
            We appreciate your business! Your invoice will be sent to
            <strong> {session?.customer_details?.email as string}</strong>
        </h3>
        );
    }

    return null;
}