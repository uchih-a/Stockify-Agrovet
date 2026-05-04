import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, User, ShoppingBag, Receipt, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { useUpdateUser } from '@/hooks/useUsers';
import useAuthStore from '@/store/authStore';
import { KENYAN_COUNTIES } from '@/utils/constants';
import { formatDate, formatKES, getInitials } from '@/utils/formatters';
import { useGetMyTransactions } from '@/hooks/useTransactions';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number is required'),
  county: z.string().min(1, 'County is required'),
});

export function FarmerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const accessToken = useAuthStore((state) => state.accessToken);
  const updateUser = useUpdateUser();
  const [editing, setEditing] = useState(false);

  const { data: transactionsPayload } = useGetMyTransactions({ limit: 100 });
  const allTransactions = transactionsPayload?.docs || [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = allTransactions
    .filter((t) => {
      const d = new Date(t.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

  const totalSpent = allTransactions.reduce(
    (sum, t) => sum + (Number(t.totalAmount) || 0),
    0,
  );

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      county: user?.location || '',
      name: user?.name || '',
      phone: user?.phone || '',
    },
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (values) => {
    try {
      await updateUser.mutateAsync({
        id: user._id,
        data: { name: values.name, phone: values.phone, location: values.county },
      });
      setAuth({ ...user, name: values.name, phone: values.phone, location: values.county }, accessToken);
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch {
      // error handled by hook
    }
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View and update your personal information."
      />

      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          marginBottom: 32,
        }}
      >
        <StatCard
          icon={ShoppingBag}
          label="Total Spent"
          value={formatKES(totalSpent)}
          variant="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Spent This Month"
          value={formatKES(monthlyTotal)}
          variant="amber"
        />
        <StatCard
          icon={Receipt}
          label="Total Orders"
          value={String(allTransactions.length)}
        />
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {/* Profile card */}
        <Card level="elevated" padding={0}>
          <div style={{ padding: '28px 28px 20px' }}>
            {/* Avatar */}
            <div style={{ alignItems: 'center', display: 'flex', gap: 20, marginBottom: 24 }}>
              <div
                style={{
                  alignItems: 'center',
                  background: 'var(--color-primary-surface)',
                  borderRadius: '9999px',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  fontSize: 28,
                  fontWeight: 700,
                  height: 72,
                  justifyContent: 'center',
                  width: 72,
                  flexShrink: 0,
                }}
              >
                {getInitials(user?.name)}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name}
                </div>
                <Badge style={{ marginTop: 6 }} variant="primary">
                  Farmer
                </Badge>
              </div>
            </div>

            {/* Read-only info when not editing */}
            {!editing && (
              <div style={{ display: 'grid', gap: 0 }}>
                {[
                  { icon: Mail, label: 'Email', value: user?.email },
                  { icon: Phone, label: 'Phone', value: user?.phone || '—' },
                  { icon: MapPin, label: 'County', value: user?.location || '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    style={{
                      alignItems: 'center',
                      borderTop: '1px solid var(--color-divider)',
                      display: 'flex',
                      gap: 14,
                      padding: '14px 0',
                    }}
                  >
                    <Icon size={16} style={{ color: 'var(--color-text-hint)', flexShrink: 0 }} />
                    <div>
                      <div
                        style={{
                          color: 'var(--color-text-hint)',
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {label}
                      </div>
                      <div style={{ fontSize: 14, marginTop: 2 }}>{value}</div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    borderTop: '1px solid var(--color-divider)',
                    color: 'var(--color-text-hint)',
                    fontSize: 12,
                    marginTop: 4,
                    paddingTop: 14,
                  }}
                >
                  Member since {formatDate(user?.createdAt)}
                </div>
              </div>
            )}

            {/* Edit form */}
            {editing && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: 'grid', gap: 16 }}
              >
                <Input
                  label="Full Name"
                  error={errors.name?.message}
                  {...register('name')}
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
                  options={KENYAN_COUNTIES.map((c) => ({ label: c, value: c }))}
                  {...register('county')}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <Button
                    disabled={updateUser.isPending}
                    onClick={handleCancel}
                    type="button"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button loading={updateUser.isPending} type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>

          {!editing && (
            <div
              style={{
                background: 'var(--color-surface-low)',
                borderBottomLeftRadius: 'var(--radius-lg)',
                borderBottomRightRadius: 'var(--radius-lg)',
                padding: '14px 28px',
              }}
            >
              <Button
                icon={<User size={14} />}
                onClick={() => setEditing(true)}
                variant="secondary"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </Card>

        {/* Account information card */}
        <Card level="elevated" padding={24}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Account Information
          </h3>
          <div style={{ display: 'grid', gap: 0 }}>
            {[
              { label: 'Account Status', value: user?.isActive ? 'Active' : 'Suspended', highlight: user?.isActive },
              { label: 'Role', value: 'Farmer' },
              { label: 'Email Verified', value: user?.isVerified ? 'Yes' : 'No' },
              { label: 'Last Login', value: formatDate(user?.lastLogin) },
              { label: 'Member Since', value: formatDate(user?.createdAt) },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                style={{
                  borderTop: '1px solid var(--color-divider)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '13px 0',
                }}
              >
                <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{label}</span>
                <span
                  style={{
                    color: highlight === true
                      ? 'var(--color-success-text)'
                      : highlight === false
                      ? 'var(--color-danger-text)'
                      : 'var(--color-text-primary)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FarmerProfilePage;
