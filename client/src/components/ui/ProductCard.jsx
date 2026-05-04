import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cartSelectors, useCartStore } from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { CATEGORY_LABELS, ROLES } from '@/utils/constants';
import { formatKES, getStockVariant } from '@/utils/formatters';

export function ProductCard({ onAdd, product }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const isInCart = useCartStore(cartSelectors.isInCart(product?._id));

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart.`);
    onAdd?.(product);
  };

  const handleCardClick = () => {
    // Farmers stay on the farmer shop — no detail page for them yet
    if (user?.role === ROLES.ADMIN) {
      navigate(`/admin/inventory/${product._id}`);
    }
  };

  const stockVariant = getStockVariant(product.quantity, product.reorderLevel);
  const outOfStock = product.quantity <= 0;
  const categoryLabel =
    CATEGORY_LABELS[product.category] ||
    product.category?.replaceAll('_', ' ');

  return (
    <Card
      level="elevated"
      padding={0}
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          aspectRatio: '4 / 3',
          background: 'var(--color-surface-low)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          alt={product.name}
          src={
            product.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
          }
          style={{ height: '100%', objectFit: 'cover', width: '100%' }}
        />
        <Badge size="sm" style={{ left: 8, position: 'absolute', top: 8 }} variant="primary">
          {categoryLabel}
        </Badge>
        {outOfStock && (
          <div
            style={{
              alignItems: 'center',
              background: 'rgba(27,28,25,0.6)',
              color: '#fff',
              display: 'flex',
              fontSize: 14,
              inset: 0,
              justifyContent: 'center',
              position: 'absolute',
            }}
          >
            Out of Stock
          </div>
        )}
        <div style={{ bottom: 0, insetInline: 0, padding: 12, position: 'absolute' }}>
          <Button
            disabled={outOfStock}
            fullWidth
            icon={<ShoppingCart size={16} />}
            onClick={handleAdd}
            variant={isInCart ? 'secondary' : 'primary'}
          >
            {outOfStock ? 'Out of Stock' : isInCart ? 'In Cart ✓' : 'Add to Cart'}
          </Button>
        </div>
      </div>

      <button
        onClick={handleCardClick}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: user?.role === ROLES.ADMIN ? 'pointer' : 'default',
          display: 'block',
          padding: 16,
          textAlign: 'left',
          width: '100%',
        }}
        type="button"
      >
        <h3 className="clamp-2" style={{ fontSize: 14, margin: 0 }}>
          {product.name}
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: '8px 0 0' }}>
          per {product.unit}
        </p>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <span
            style={{
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {formatKES(product.price)}
          </span>
          <Badge variant={stockVariant}>{stockVariant.replace('_', ' ')}</Badge>
        </div>
      </button>
    </Card>
  );
}

export default ProductCard;
