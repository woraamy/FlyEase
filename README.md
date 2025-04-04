# FlyEase
An A.I integrated web application for booking flights and finding travel plans


# Project Setup Instructions

This guide provides instructions on how to set up and run the various services for this project.

## Prerequisites

* [Node.js and npm](https://nodejs.org/)
* [Python and pip](https://www.python.org/)
* [Homebrew](https://brew.sh/) (for macOS users installing Stripe CLI)
* Access to the environment variables document (see Environment Variables section).
* Clone the GitHub repository

## 1. Stripe CLI Setup (Optional - If you need to test webhooks locally)

These steps are necessary for testing Stripe webhook integrations locally.

1.  **Install Stripe CLI:**
    * **macOS (using Homebrew):**
        ```bash
        brew install stripe/stripe-cli/stripe
        ```
    * For other operating systems, refer to the [official Stripe CLI installation guide](https://stripe.com/docs/stripe-cli#install).

2.  **Login to Stripe:**
    ```bash
    stripe login
    ```
    Follow the instructions and use the link provided by the CLI to authenticate in your browser. When you login to stripe, accept the invitation we sent you (if you are not Aj. Kundjanasith you don't have to accept the invitation)

3.  **Listen for Webhooks:**
    * **Open a dedicated terminal window.**
    * Run the following command. This will listen for events from your Stripe account and forward them to your local booking service (assuming it runs on port 3001).
        ```bash
        stripe listen --forward-to localhost:3001/api/webhook
        ```
    * Keep this terminal window open while you need webhook forwarding.

## 2. Environment Variables

Each backend service requires specific environment variables to function correctly (e.g., API keys, database credentials).

* **Retrieve the environment variables from the following document:**
    [FlyEase Environment Variables](https://docs.google.com/document/d/1al9kN0XdBYjyy6VdL43bmmRD3346j9yN4jqaoji8w-w/edit?usp=sharing)

* **Configure the variables for each service.** The standard practice is to create a `.env` file in the root directory of *each* service (`backend/booking/`, `backend/flight/`, etc.) and populate it with the corresponding variables from the document in the format `VARIABLE_NAME=value`.


## 3. Running Backend Services

You need to run each of the following services simultaneously. **The typical way to do this is to open a new, separate terminal window for each service.**

1.  **Start the Booking Service (Node.js):**
    * In a new terminal:
        ```bash
        cd backend/booking
        npm install
        npm run dev
        ```
        *(This service likely runs on `localhost:3001` and receives Stripe webhooks)*

2.  **Start the Flight Service (Node.js):**
    * In a new terminal:
        ```bash
        cd backend/flight
        npm install
        npm run dev
        ```

3.  **Start the Chatbot Service (Python/FastAPI):**
    * In a new terminal:
        ```bash
        cd backend/chatbot
        pip install -r requirement.txt
        python -m app.service
        ```
        *(Note: Adapt commands if using Poetry: `poetry install`, `poetry run python -m app.service`)*

4.  **Start the Recommendation Service (Python):**
    * In a new terminal:
        ```bash
        cd backend/recommend
        pip install -r requirements.txt
        python recommendation_service.py
        ```

5.  **Start the Aircraft Service (Node.js):**
    * In a new terminal:
        ```bash
        cd backend/aircraft
        npm install
        npm run dev
        ```

6.  **Start the Travel Plan Service (Node.js):**
    * In a new terminal:
        ```bash
        cd backend/travel-plan
        npm install 
        node server.js
        ```

---

Once all necessary services (steps 1-6 above) are running **in their own terminals**, and the Stripe listener (from Section 1, step 3) is active in its terminal (if needed), the backend system should be operational. Remember to set up the `.env` files correctly for each service as described in Section 2.
