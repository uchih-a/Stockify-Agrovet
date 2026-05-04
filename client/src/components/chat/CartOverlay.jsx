import { ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { cartSelectors, useCartStore } from '@/store/cartStore';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { useCheckout } from '@/hooks/usePayment';
import useAuthStore from '@/store/authStore';
import { formatKES } from '@/utils/formatters';

export function CartOverlay() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalItems = useCartStore(cartSelectors.totalItems);
  const totalAmount = useCartStore(cartSelectors.totalAmount);
  const createTransaction = useCreateTransaction();

  // ✅ NEW: Stripe checkout hook
  const checkout = useCheckout();

  // ── Cash / in-store purchase (existing flow) ───────────────────────────────
  const handleCashCheckout = async () => {
    try {
      for (const item of items) {
        await createTransaction.mutateAsync({
          productId: item.product._id,
          quantity: item.quantity,
          reference: `FARM-${Date.now()}`,
          type: 'sale',
          unitPrice: item.unitPrice,
          userId: user?._id,
        });
      }
      clearCart();
      closeCart();
      navigate('/farmer/orders');
      toast.success('Purchase completed successfully.');
    } catch (error) {
      toast.error(error?.message || 'Checkout failed.');
    }
  };

  // ── Stripe card payment ────────────────────────────────────────────────────
  const handleStripeCheckout = () => {
    const cartItems = items.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));
    // useCheckout redirects to Stripe; cart is cleared on return via webhook
    checkout.mutate(cartItems);
  };

  const isBusy = createTransaction.isPending || checkout.isPending;

  return (
    <SlidePanel
      footer={
        <div style={{ display: 'grid', gap: 10 }}>
          {/* Subtotal row */}
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Subtotal</span>
            <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 20 }}>
              {formatKES(totalAmount)}
            </strong>
          </div>

          {/* ✅ Stripe card payment button */}
          <Button
            fullWidth
            loading={checkout.isPending}
            disabled={isBusy || items.length === 0}
            onClick={handleStripeCheckout}
            size="lg"
          >
            💳 Pay with Card (Stripe)
          </Button>

          {/* Existing cash / credit purchase button */}
          <Button
            fullWidth
            loading={createTransaction.isPending}
            disabled={isBusy || items.length === 0}
            onClick={handleCashCheckout}
            size="lg"
            variant="secondary"
          >
            🏪 Pay In-Store / Cash
          </Button>

          <Button fullWidth onClick={closeCart} size="sm" variant="tertiary">
            Continue Shopping
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeCart}
      subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`}
      title="Shopping Cart"
      width="md"
    >
      {items.length ? (
        <div style={{ display: 'grid', gap: 14 }}>
          {items.map((item) => (
            <div
              key={item.product._id}
              style={{
                alignItems: 'center',
                display: 'grid',
                gap: 12,
                gridTemplateColumns: '48px minmax(0,1fr) auto auto auto',
                padding: '12px 0',
              }}
            >
              <img
                alt={item.product.name}
                src={
                  item.product.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
                }
                style={{ borderRadius: 8, height: 48, objectFit: 'cover', width: 48 }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.product.name}</div>
                <Badge size="sm" style={{ marginTop: 4 }} variant="neutral">
                  {item.product.category}
                </Badge>
                <div
                  style={{
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  {formatKES(item.unitPrice)}
                </div>
              </div>

              {/* Quantity controls */}
              <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  style={{
                    background: 'var(--color-surface-mid)',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    height: 28,
                    width: 28,
                  }}
                  type="button"
                >
                  −
                </button>
                <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  style={{
                    background: 'var(--color-surface-mid)',
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    height: 28,
                    width: 28,
                  }}
                  type="button"
                >
                  +
                </button>
              </div>

              <strong
                style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-mono)',
                  minWidth: 80,
                  textAlign: 'right',
                }}
              >
                {formatKES(item.quantity * item.unitPrice)}
              </strong>

              <button
                onClick={() => removeItem(item.product._id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-danger-text)',
                  cursor: 'pointer',
                }}
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          action={{
            label: 'Browse Shop',
            onClick: () => {
              closeCart();
              navigate('/farmer/shop');
            },
          }}
          description="Add a few products and they'll appear here for quick checkout."
          icon={<ShoppingBag size={48} />}
          title="Your cart is empty"
        />
      )}
    </SlidePanel>
  );
}

export default CartOverlay;