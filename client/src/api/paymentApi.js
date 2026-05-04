import axiosInstance from './axiosInstance';

/**
 * Payment API — wraps Stripe-related endpoints.
 */
const paymentApi = {
  /**
   * Create a Stripe Checkout Session.
   * @param {Array<{ productId: string, quantity: number }>} items
   * @returns {{ url: string, sessionId: string }}
   */
  createCheckoutSession: (items) =>
    axiosInstance
      .post('/payments/create-checkout-session', { items })
      .then((res) => res.data.data),

  /**
   * Check whether a Stripe session was paid.
   * Call this on the success redirect to verify before showing confirmation.
   * @param {string} sessionId  — the ?session_id= query param from Stripe
   * @returns {{ status: string, amountTotal: number, currency: string }}
   */
  getPaymentStatus: (sessionId) =>
    axiosInstance
      .get(`/payments/status/${sessionId}`)
      .then((res) => res.data.data),
};

export default paymentApi;
