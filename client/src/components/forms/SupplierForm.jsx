import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { KENYAN_COUNTIES } from '@/utils/constants';

const schema = z.object({
  address: z.string().optional(),
  contactPerson: z.string().min(2, 'Contact person is required'),
  county: z.string().min(1, 'County is required'),
  email: z.string().email('Valid email required'),
  name: z.string().min(2, 'Supplier name is required'),
  notes: z.string().optional(),
  phone: z.string().min(8, 'Phone number is required'),
});

export function SupplierForm({ formId = 'supplier-form', initialValues = {}, isLoading = false, onCancel, onSubmit }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      address: initialValues.address || '',
      contactPerson: initialValues.contactPerson || '',
      county: initialValues.county || '',
      email: initialValues.email || '',
      name: initialValues.name || '',
      notes: initialValues.notes || '',
      phone: initialValues.phone || '',
    },
    resolver: zodResolver(schema),
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>
      <Input label="Supplier Name" error={errors.name?.message} {...register('name')} />
      <Input label="Contact Person" error={errors.contactPerson?.message} {...register('contactPerson')} />
      <Input label="Email" error={errors.email?.message} type="email" {...register('email')} />
      <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
      <Input label="Address" error={errors.address?.message} {...register('address')} />
      <Select
        label="County"
        error={errors.county?.message}
        options={KENYAN_COUNTIES.map((county) => ({ label: county, value: county }))}
        {...register('county')}
      />
      <Textarea label="Notes" error={errors.notes?.message} rows={3} {...register('notes')} />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {onCancel ? (
          <Button disabled={isLoading} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        ) : null}
        <Button disabled={isLoading} type="submit">
          Save Supplier
        </Button>
      </div>
    </form>
  );
}

export default SupplierForm;
