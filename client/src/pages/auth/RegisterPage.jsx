import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useRegister } from '@/hooks/useAuth';
import { AuthLayout } from '@/pages/auth/AuthLayout';
import { KENYAN_COUNTIES } from '@/utils/constants';

const schema = z
  .object({
    confirmPassword: z.string(),
    county: z.string().min(1, 'County is required'),
    email: z.string().email('Enter a valid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number')
      .regex(/[!@#$%^&*]/, 'Include at least one special character'),
    phone: z.string().regex(/^\+254\d{9}$/, 'Use a valid Kenyan number starting with +254'),
    terms: z.boolean().refine(Boolean, 'You must accept the terms'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const passwordScore = (value = '') => {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[!@#$%^&*]/.test(value)) score += 1;
  return score;
};

export function RegisterPage() {
  const registerMutation = useRegister();
  const defaultValues = useMemo(
    () => ({
      confirmPassword: '',
      county: '',
      email: '',
      name: '',
      password: '',
      phone: '+254',
      terms: false,
    }),
    [],
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const password = watch('password');
  const score = passwordScore(password);

  return (
    <AuthLayout>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Start your journey.</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '10px 0 0' }}>
          Create a farmer account in minutes and start buying smarter.
        </p>
      </div>

      <form
        onSubmit={handleSubmit((values) =>
          registerMutation.mutate({
            county: values.county,
            email: values.email,
            location: values.county,
            name: values.name,
            password: values.password,
            phone: values.phone,
          }),
        )}
        style={{ display: 'grid', gap: 18, marginTop: 28 }}
      >
        <Input label="Full Name" error={errors.name?.message} prefix={<User size={16} />} {...register('name')} />
        <Input label="Email" error={errors.email?.message} prefix={<Mail size={16} />} type="email" {...register('email')} />
        <Input
          label="Phone"
          error={errors.phone?.message}
          hint="Format: +254 7XX XXX XXX"
          prefix={<Phone size={16} />}
          {...register('phone')}
        />
        <Select
          label="County"
          error={errors.county?.message}
          options={KENYAN_COUNTIES.map((county) => ({ label: county, value: county }))}
          {...register('county')}
        />
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div>
            <Input label="Password" error={errors.password?.message} prefix={<Lock size={16} />} type="password" {...register('password')} />
            <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
              <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      background:
                        index < score
                          ? score === 1
                            ? 'var(--color-danger-text)'
                            : score === 2
                              ? 'var(--color-amber)'
                              : 'var(--color-primary)'
                          : 'var(--color-surface-mid)',
                      borderRadius: 9999,
                      height: 3,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>
                {['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'][score]}
              </span>
            </div>
          </div>
          <Input
            label="Confirm Pass"
            error={errors.confirmPassword?.message}
            prefix={<ShieldCheck size={16} />}
            type="password"
            {...register('confirmPassword')}
          />
        </div>
        <label style={{ alignItems: 'flex-start', display: 'flex', gap: 10 }}>
          <input {...register('terms')} style={{ accentColor: 'var(--color-primary)', marginTop: 3 }} type="checkbox" />
          <span style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6 }}>
            I agree to the <span style={{ color: 'var(--color-amber)' }}>Terms of Service</span> and{' '}
            <span style={{ color: 'var(--color-amber)' }}>Privacy Policy</span>
          </span>
        </label>
        {errors.terms?.message ? <span style={{ color: 'var(--color-danger-text)', fontSize: 12 }}>{errors.terms.message}</span> : null}
        <Button fullWidth loading={registerMutation.isPending} size="lg" type="submit">
          Create Account
        </Button>
      </form>

      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '22px 0 0' }}>
        Already have an account?{' '}
        <Link style={{ color: 'var(--color-amber)' }} to="/login">
          Sign in →
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
