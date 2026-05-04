import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { SlidePanel } from '@/components/ui/SlidePanel';
import { Table } from '@/components/ui/Table';
import { UserForm } from '@/components/forms/UserForm';
import { useCreateUser, useDeleteUser, useGetUsers, useUpdateUser } from '@/hooks/useUsers';
import useAuthStore from '@/store/authStore';
import useUiStore from '@/store/uiStore';
import { ROLES } from '@/utils/constants';
import { formatRelative, getInitials, getRoleBadgeVariant } from '@/utils/formatters';

const tabs = [
  { label: 'All Users', value: 'all' },
  { label: 'Admins', value: ROLES.ADMIN },
  { label: 'Farmers', value: ROLES.FARMER },
];

export function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [filters, setFilters] = useState({ page: 1, role: 'all', search: '' });
  const [suspendTarget, setSuspendTarget] = useState(null);

  const apiParams = {
    limit: 10,
    page: filters.page,
    search: filters.search || undefined,
    role: filters.role === 'all' ? undefined : filters.role,
  };

  // ✅ FIX: Destructure isFetching
  const { data, isLoading, isFetching } = useGetUsers(apiParams);
  const users = data?.docs || [];
  const openPanel = useUiStore((state) => state.openPanel);
  const closePanel = useUiStore((state) => state.closePanel);
  const activePanel = useUiStore((state) => state.activePanel);
  const panelData = useUiStore((state) => state.panelData);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return;
    await updateUser.mutateAsync({ id: suspendTarget._id, data: { isActive: !suspendTarget.isActive } });
    setSuspendTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          <Button icon={<Plus size={14} />} onClick={() => openPanel('addUser', null)}>
            Add User
          </Button>
        }
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        <Badge variant="neutral">Total: {data?.totalDocs ?? 0}</Badge>
        <Badge variant="success">Admins: {data?.adminCount ?? 0}</Badge>
        <Badge variant="primary">Farmers: {data?.farmerCount ?? 0}</Badge>
      </div>

      <div style={{ borderBottom: '1px solid rgba(67,72,62,0.08)', display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilters((c) => ({ ...c, page: 1, role: tab.value }))}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: filters.role === tab.value ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: filters.role === tab.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: 14,
              paddingBottom: 10,
              paddingInline: 4,
              transition: 'color 200ms, border-color 200ms',
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <SearchInput
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(value) => setFilters((c) => ({ ...c, page: 1, search: value }))}
        />
      </div>

      {/* ✅ FIX: Dim table on page change instead of flash */}
      <div
        style={{
          opacity: isFetching && !isLoading ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: isFetching ? 'none' : 'auto',
        }}
      >
        <Table
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (row) => (
                <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
                  <span
                    style={{
                      alignItems: 'center',
                      background: row.role === ROLES.ADMIN ? 'var(--color-primary-surface)' : 'var(--color-surface-mid)',
                      borderRadius: '9999px',
                      color: row.role === ROLES.ADMIN ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      display: 'inline-flex',
                      fontSize: 13,
                      fontWeight: 700,
                      height: 36,
                      justifyContent: 'center',
                      width: 36,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(row.name)}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{row.name}</div>
                    <div style={{ color: 'var(--color-text-hint)', fontSize: 12 }}>{row.email}</div>
                  </div>
                </div>
              ),
            },
            { key: 'role', header: 'Role', render: (row) => <Badge variant={getRoleBadgeVariant(row.role)}>{row.role}</Badge> },
            { key: 'phone', header: 'Phone', render: (row) => row.phone || '—' },
            { key: 'location', header: 'County', render: (row) => row.location || '—' },
            { key: 'lastLogin', header: 'Last Login', render: (row) => formatRelative(row.lastLogin) },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Suspended'}</Badge> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => {
                const isSelf = row._id === currentUser?._id;
                return (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openPanel('editUser', row)} style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: 4 }} title="Edit user" type="button">
                      <Pencil size={14} />
                    </button>
                    {!isSelf && (
                      <button onClick={() => setSuspendTarget(row)} style={{ background: 'transparent', border: 'none', color: row.isActive ? 'var(--color-amber)' : 'var(--color-success-text)', cursor: 'pointer', padding: 4 }} title={row.isActive ? 'Suspend user' : 'Activate user'} type="button">
                        <Power size={14} />
                      </button>
                    )}
                    {!isSelf && (
                      <button onClick={() => openPanel('confirmDeleteUser', row)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger-text)', cursor: 'pointer', padding: 4 }} title="Delete user" type="button">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              },
            },
          ]}
          data={users}
          loading={isLoading}
          emptyMessage="No users found for the selected filter."
        />
      </div>

      <Pagination
        currentPage={filters.page}
        limit={10}
        onPageChange={(page) => setFilters((c) => ({ ...c, page }))}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />

      <SlidePanel isOpen={activePanel === 'addUser' || activePanel === 'editUser'} onClose={closePanel} subtitle="Manage farmer and admin accounts" title={activePanel === 'editUser' ? 'Edit User' : 'Add User'}>
        <UserForm
          currentRole={currentUser?.role}
          initialValues={panelData || {}}
          isLoading={createUser.isPending || updateUser.isPending}
          onCancel={closePanel}
          onSubmit={async (values) => {
            if (activePanel === 'editUser') {
              await updateUser.mutateAsync({ data: values, id: panelData._id });
            } else {
              await createUser.mutateAsync(values);
            }
            closePanel();
          }}
        />
      </SlidePanel>

      <ConfirmDialog
        confirmLabel="Delete User"
        confirmVariant="danger"
        description={`This will permanently remove ${panelData?.name || 'this user'}'s account and all their data.`}
        isOpen={activePanel === 'confirmDeleteUser'}
        loading={deleteUser.isPending}
        onCancel={closePanel}
        onConfirm={async () => { await deleteUser.mutateAsync(panelData._id); closePanel(); }}
        title="Delete user?"
      />

      <ConfirmDialog
        confirmLabel={suspendTarget?.isActive ? 'Suspend Account' : 'Activate Account'}
        confirmVariant={suspendTarget?.isActive ? 'danger' : 'primary'}
        description={suspendTarget?.isActive ? `${suspendTarget?.name} will be logged out and unable to access the system.` : `${suspendTarget?.name} will regain access to the system.`}
        isOpen={Boolean(suspendTarget)}
        loading={updateUser.isPending}
        onCancel={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
        title={suspendTarget?.isActive ? 'Suspend user?' : 'Activate user?'}
      />
    </div>
  );
}

export default UsersPage;