import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForgotPassword } from '@/hooks/useAuth';
import { AuthLayout } from '@/pages/auth/AuthLayout';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export function ForgotPasswordPage() {
  const [step, setStep] = useState('form');
  const [countdown, setCountdown] = useState(60);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const forgotPassword = useForgotPassword();
  const defaultValues = useMemo(() => ({ email: '' }), []);
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (step !== 'sent' || countdown <= 0) return undefined;
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, step]);

  const sendReset = async (email) => {
    await forgotPassword.mutateAsync(email);
    setSubmittedEmail(email);
    setCountdown(60);
    setStep('sent');
  };

  return (
    <AuthLayout>
      {step === 'form' ? (
        <>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>Reset your password.</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '10px 0 0' }}>
              Enter the email linked to your account and we&apos;ll send a reset link.
            </p>
          </div>
          <form onSubmit={handleSubmit((values) => sendReset(values.email))} style={{ display: 'grid', gap: 18, marginTop: 28 }}>
            <Input label="Email" error={errors.email?.message} prefix={<Mail size={16} />} type="email" {...register('email')} />
            <Button fullWidth loading={forgotPassword.isPending} size="lg" type="submit">
              Send Reset Link
            </Button>
          </form>
          <Link style={{ color: 'var(--color-amber)', display: 'inline-block', marginTop: 20 }} to="/login">
            ← Back to Sign In
          </Link>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 18, justifyItems: 'start' }}>
          <div
            style={{
              alignItems: 'center',
              animation: 'pulse-scale 2s ease-in-out infinite',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              justifyContent: 'center',
            }}
          >
            <Mail size={64} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0 }}>Check your email.</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.7, margin: '10px 0 0' }}>
              We sent a reset link to {submittedEmail}. Check your inbox and spam folder.
            </p>
          </div>
          <Button
            disabled={countdown > 0}
            loading={forgotPassword.isPending}
            onClick={() => sendReset(getValues('email') || submittedEmail)}
            size="md"
            variant="secondary"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Link'}
          </Button>
          <Link style={{ color: 'var(--color-amber)' }} to="/login">
            ← Back to Sign In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
