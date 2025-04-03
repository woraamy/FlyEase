"use client";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface EmbeddedCheckoutProps {
  clerkUserId: string;
  price: number;
  firstName: string;
  lastName: string;
  selectedSeatClass: string;
  selectedSeatId: string;
  selectedMeal: string;
  selectedService: string;
  SelectedBaggage: string;
  id: number;
  flight_number: string;
  age: number;
  gender: string;
  contactNumber: string;
  email: string;
  passportNumber: string;
  nationality: string;
}

export default function EmbeddedCheckoutForm({
  clerkUserId,
  price,
  firstName,
  lastName,
  selectedSeatClass,
  selectedSeatId,
  selectedMeal,
  selectedService,
  SelectedBaggage,
  id,
  flight_number,
  age,
  gender,
  contactNumber,
  email,
  passportNumber,
  nationality,
}: EmbeddedCheckoutProps) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        passengerInfo: {
          clerkUserId,
          firstName,
          lastName,
          age,
          gender,
          contactNumber,
          email,
          passportNumber,
          nationality,
        },
        flightInfo: {
          id,
          flight_number,
          selectedSeatClass,
          selectedSeatId,
          selectedMeal,
          selectedService,
          SelectedBaggage,
        }
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, [
    clerkUserId,
    price,
    firstName,
    lastName,
    age,
    gender,
    contactNumber,
    email,
    passportNumber,
    nationality,
    id,
    flight_number,
    selectedSeatClass,
    selectedSeatId,
    selectedMeal,
    selectedService,
    SelectedBaggage,
  ]);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    if (!firstName || !lastName) {
      alert("Please provide passenger name information before checkout");
      return;
    }
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };

  return (
    <div id="checkout" className="my-4">
      <button 
        className="btn w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl" 
        onClick={handleCheckoutClick}
        disabled={!firstName || !lastName}
      >
        {!firstName || !lastName ? "Enter Passenger Details" : "Stripe Checkout"}
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="font-bold text-lg">Checkout for {firstName} {lastName}</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}