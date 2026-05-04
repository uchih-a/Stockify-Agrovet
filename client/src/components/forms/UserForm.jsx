import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { KENYAN_COUNTIES, ROLES } from '@/utils/constants';

const createSchema = (editing) =>
  z.object({
    county: z.string().min(1, 'County is required'),
    email: z.string().email('Valid email required'),
    isActive: z.boolean().default(true),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: editing
      ? z.string().optional()
      : z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string().min(10, 'Phone number is required'),
    // Only admin and farmer roles — staff removed
    role: z.enum([ROLES.ADMIN, ROLES.FARMER]),
  });

export function UserForm({
  currentRole = ROLES.ADMIN,
  formId = 'user-form',
  initialValues = {},
  isLoading = false,
  onCancel,
  onSubmit,
}) {
  const editing = Boolean(initialValues._id);

  // Admin can assign admin or farmer. No staff.
  const roles = [
    { label: 'Admin', value: ROLES.ADMIN },
    { label: 'Farmer', value: ROLES.FARMER },
  ];

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      county: initialValues.location || initialValues.county || '',
      email: initialValues.email || '',
      isActive: initialValues.isActive ?? true,
      name: initialValues.name || '',
      password: '',
      phone: initialValues.phone || '',
      role: initialValues.role || ROLES.FARMER,
    },
    resolver: zodResolver(createSchema(editing)),
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((values) =>
        onSubmit?.({
          ...values,
          location: values.county,
        }),
      )}
      style={{ display: 'grid', gap: 16 }}
    >
      <Input label="Full Name" error={errors.name?.message} {...register('name')} />
      <Input
        label="Email Address"
        error={errors.email?.message}
        type="email"
        {...register('email')}
      />
      <Input
        label="Phone Number"
        error={errors.phone?.message}
        placeholder="+254 7XX XXX XXX"
        {...register('phone')}
      />
      <Select
        label="County"
        error={errors.county?.message}
        options={KENYAN_COUNTIES.map((county) => ({ label: county, value: county }))}
        {...register('county')}
      />
      <Select
        label="Role"
        error={errors.role?.message}
        options={roles}
        {...register('role')}
      />
      {!editing && (
        <Input
          label="Password"
          error={errors.password?.message}
          type="password"
          {...register('password')}
        />
      )}
      <label style={{ alignItems: 'center', display: 'flex', gap: 10, fontSize: 14 }}>
        <input
          {...register('isActive')}
          style={{ accentColor: 'var(--color-primary)', height: 16, width: 16 }}
          type="checkbox"
        />
        <span>Active account</span>
      </label>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
        {onCancel && (
          <Button disabled={isLoading} onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        )}
        <Button loading={isLoading} type="submit">
          {editing ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
