import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import paymentApi from '@/api/paymentApi';

/**
 * useCheckout
 * Sends cart items to the server, gets a Stripe Checkout URL, and redirects.
 *
 * Usage in CartOverlay.jsx:
 *   const checkout = useCheckout();
 *   <Button loading={checkout.isPending} onClick={() => checkout.mutate(cartItems)}>
 *     Pay with Card
 *   </Button>
 *
 * cartItems shape: [{ productId: string, quantity: number }]
 */
export const useCheckout = () =>
  useMutation({
    mutationFn: async (cartItems) => {
      const { url } = await paymentApi.createCheckoutSession(cartItems);
      // Redirect to Stripe-hosted Checkout page
      window.location.href = url;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Payment failed. Please try again.';
      toast.error(message);
    },
  });

/**
 * usePaymentStatus
 * Verifies a Stripe session after the farmer is redirected back to the app.
 * Pass the session_id query param from the URL.
 *
 * Usage in OrdersPage.jsx:
 *   const sessionId = searchParams.get('session_id');
 *   const { data } = usePaymentStatus(sessionId);
 */
export const usePaymentStatus = (sessionId) =>
  useQuery({
    queryKey: ['payment', 'status', sessionId],
    queryFn: () => paymentApi.getPaymentStatus(sessionId),
    enabled: Boolean(sessionId),
    retry: false,
  });
