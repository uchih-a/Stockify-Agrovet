import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import useAuthStore from '@/store/authStore';

export function NotFoundPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ alignItems: 'center', background: 'var(--color-bg)', display: 'flex', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden', paddingTop: 120, position: 'relative' }}>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          style={{
            background: 'var(--color-primary)',
            borderRadius: '60% 40% 60% 40%',
            height: 120 + index * 20,
            left: `${index * 22 + 6}%`,
            opacity: 0.06,
            position: 'absolute',
            top: `${index * 18 + 4}%`,
            transform: `rotate(${index * 22}deg)`,
            width: 80 + index * 18,
          }}
        />
      ))}
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontSize: 160, fontWeight: 700, left: '50%', opacity: 0.08, position: 'absolute', top: '50%', transform: 'translate(-50%, -60%)' }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, margin: 0, position: 'relative' }}>Page not found.</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 16, margin: '12px 0 0' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <Button onClick={() => navigate(-1)} variant="secondary">
            ← Go Back
          </Button>
          <Button onClick={() => navigate(user ? (isAdmin ? '/admin' : '/farmer') : '/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
