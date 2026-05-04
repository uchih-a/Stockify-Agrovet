import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthLayout } from '@/pages/auth/AuthLayout';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();
  const defaultValues = useMemo(() => ({ email: '', password: '' }), []);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Welcome back.</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '10px 0 0' }}>
          Sign in to manage inventory, serve farmers, and review today&apos;s performance.
        </p>
      </div>

      <form onSubmit={handleSubmit((values) => login.mutate(values))} style={{ display: 'grid', gap: 18, marginTop: 28 }}>
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          prefix={<Mail size={16} />}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          error={errors.password?.message}
          prefix={<Lock size={16} />}
          suffix={
            <button
              onClick={() => setShowPassword((value) => !value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-hint)', cursor: 'pointer', padding: 0 }}
              type="button"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('password')}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link style={{ color: 'var(--color-amber)', fontSize: 14 }} to="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <Button fullWidth loading={login.isPending} size="lg" type="submit">
          Sign In
        </Button>
      </form>

      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '22px 0 0' }}>
        New to AgroVet?{' '}
        <Link style={{ color: 'var(--color-amber)' }} to="/register">
          Create an account →
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
