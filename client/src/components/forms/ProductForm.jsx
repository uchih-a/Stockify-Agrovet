import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useGetSuppliers } from '@/hooks/useSuppliers';
import { CATEGORY_LABELS, PRODUCT_CATEGORIES, UNITS } from '@/utils/constants';

const schema = z.object({
  batchNumber: z.string().optional(),
  category: z.enum(PRODUCT_CATEGORIES),
  description: z.string().optional(),
  expiryDate: z.string().optional(),
  name: z.string().min(2, 'Product name is required'),
  price: z.coerce.number().positive('Price must be greater than zero'),
  quantity: z.coerce.number().min(0, 'Quantity must be 0 or more'),
  reorderLevel: z.coerce.number().min(1, 'Reorder level must be at least 1'),
  sku: z.string().min(2, 'SKU is required'),
  supplierId: z.string().optional(),
  unit: z.enum(UNITS),
});

export function ProductForm({
  formId = 'product-form',
  initialValues = {},
  isLoading = false,
  onCancel,
  onSubmit,
}) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState(initialValues.images || []);
  const { data: suppliersData } = useGetSuppliers({ limit: 50 });
  const suppliers = suppliersData?.docs || [];
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    defaultValues: {
      batchNumber: initialValues.batchNumber || '',
      category: initialValues.category || 'pesticide',
      description: initialValues.description || '',
      expiryDate: initialValues.expiryDate ? String(initialValues.expiryDate).slice(0, 10) : '',
      name: initialValues.name || '',
      price: initialValues.price || 0,
      quantity: initialValues.quantity || 0,
      reorderLevel: initialValues.reorderLevel || 5,
      sku: initialValues.sku || '',
      supplierId: initialValues.supplierId?._id || initialValues.supplierId || '',
      unit: initialValues.unit || 'kg',
    },
    resolver: zodResolver(schema),
  });

  const handleFiles = (files) => {
    const items = Array.from(files).slice(0, 5).map((file) => ({
      publicId: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
    }));
    setPreviews((current) => [...current, ...items].slice(0, 5));
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((values) =>
        onSubmit?.({
          ...values,
          images: previews,
          sku: values.sku.toUpperCase(),
        }),
      )}
      style={{ display: 'grid', gap: 18 }}
    >
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => event.preventDefault()}
        style={{
          border: '1px dashed var(--color-text-hint)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <Upload size={18} style={{ margin: '0 auto 8px' }} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>Drag & drop images or click to upload</div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 6 }}>
          Max 5 images · JPG/PNG/WebP · 5MB each
        </div>
        <input
          ref={inputRef}
          hidden
          accept="image/*"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          type="file"
        />
      </div>

      {previews.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {previews.map((image) => (
            <div key={image.publicId || image.url} style={{ position: 'relative' }}>
              <img alt="" src={image.url} style={{ borderRadius: 8, height: 64, objectFit: 'cover', width: 64 }} />
              <button
                onClick={() => setPreviews((current) => current.filter((entry) => entry.url !== image.url))}
                style={{ background: 'rgba(27,28,25,0.7)', border: 'none', borderRadius: '9999px', color: '#fff', cursor: 'pointer', position: 'absolute', right: -6, top: -6 }}
                type="button"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Input label="Product Name" error={errors.name?.message} {...register('name')} />
        </div>
        <Input label="SKU" error={errors.sku?.message} style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }} {...register('sku')} />
        <Select
          label="Category"
          error={errors.category?.message}
          options={PRODUCT_CATEGORIES.map((category) => ({ label: CATEGORY_LABELS[category] || category.replaceAll('_', ' '), value: category }))}
          {...register('category')}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <Textarea label="Description" error={errors.description?.message} rows={3} {...register('description')} />
        </div>
        <Input label="Price (KES)" error={errors.price?.message} min="0" step="0.01" type="number" {...register('price')} />
        <Select label="Unit" error={errors.unit?.message} options={UNITS.map((unit) => ({ label: unit, value: unit }))} {...register('unit')} />
        <Input label="Quantity in Stock" error={errors.quantity?.message} min="0" type="number" {...register('quantity')} />
        <Input label="Reorder Level" error={errors.reorderLevel?.message} min="0" type="number" {...register('reorderLevel')} />
        <Input label="Expiry Date" error={errors.expiryDate?.message} type="date" {...register('expiryDate')} />
        <Input label="Batch Number" error={errors.batchNumber?.message} style={{ fontFamily: 'var(--font-mono)' }} {...register('batchNumber')} />
        <div style={{ gridColumn: '1 / -1' }}>
          <Select
            label="Supplier"
            options={suppliers.map((supplier) => ({ label: supplier.name, value: supplier._id }))}
            {...register('supplierId')}
          />
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <button type="submit" />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {onCancel ? (
          <Button disabled={isLoading} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        ) : null}
        <Button disabled={isLoading} icon={<ImagePlus size={14} />} type="submit">
          Save Product
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
