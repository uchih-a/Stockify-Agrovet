import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useGetProducts } from '@/hooks/useProducts';
import { useGetUsers } from '@/hooks/useUsers';
import { formatKES } from '@/utils/formatters';
import { TRANSACTION_TYPES, TYPE_LABELS } from '@/utils/constants';

const schema = z.object({
  notes: z.string().optional(),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  reference: z.string().optional(),
  type: z.enum(TRANSACTION_TYPES),
  unitPrice: z.coerce.number().min(0, 'Unit price must be 0 or more'),
  userId: z.string().optional(),
});

export function TransactionForm({ formId = 'transaction-form', initialValues = {}, isLoading = false, onCancel, onSubmit }) {
  const { data: productsData } = useGetProducts({ limit: 100 });
  const { data: usersData } = useGetUsers({ limit: 100, role: 'farmer' });
  const products = productsData?.docs || [];
  const farmers = usersData?.docs || [];

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      notes: initialValues.notes || '',
      productId: initialValues.productId?._id || initialValues.productId || '',
      quantity: initialValues.quantity || 1,
      reference: initialValues.reference || '',
      type: initialValues.type || 'sale',
      unitPrice: initialValues.unitPrice || 0,
      userId: initialValues.userId?._id || initialValues.userId || '',
    },
    resolver: zodResolver(schema),
  });

  const selectedType = watch('type');
  const selectedProductId = watch('productId');
  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');

  useEffect(() => {
    const selectedProduct = products.find((product) => product._id === selectedProductId);
    if (selectedProduct && !initialValues.unitPrice) {
      setValue('unitPrice', selectedProduct.price);
    }
  }, [initialValues.unitPrice, products, selectedProductId, setValue]);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {TRANSACTION_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setValue('type', type)}
            style={{ background: selectedType === type ? 'var(--color-primary)' : 'var(--color-surface-low)', border: 'none', borderRadius: '9999px', color: selectedType === type ? '#fff' : 'var(--color-text-primary)', cursor: 'pointer', padding: '10px 14px' }}
            type="button"
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>
      <Select
        label="Product"
        error={errors.productId?.message}
        options={products.map((product) => ({ label: product.name, value: product._id }))}
        {...register('productId')}
      />
      {selectedType === 'sale' ? (
        <Select
          label="Farmer"
          error={errors.userId?.message}
          options={farmers.map((farmer) => ({ label: farmer.name, value: farmer._id }))}
          {...register('userId')}
        />
      ) : null}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        <Input label="Quantity" error={errors.quantity?.message} min="1" type="number" {...register('quantity')} />
        <Input label="Unit Price" error={errors.unitPrice?.message} min="0" step="0.01" type="number" {...register('unitPrice')} />
      </div>
      <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontSize: 28, textAlign: 'center' }}>
        Total: {formatKES((Number(quantity) || 0) * (Number(unitPrice) || 0))}
      </div>
      <Input label="Reference #" error={errors.reference?.message} {...register('reference')} />
      <Textarea label="Notes" error={errors.notes?.message} rows={3} {...register('notes')} />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {onCancel ? (
          <Button disabled={isLoading} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        ) : null}
        <Button disabled={isLoading} type="submit">
          Save Transaction
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
