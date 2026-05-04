import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

export function Table({
  columns = [],
  data = [],
  emptyMessage = 'No records found.',
  loading = false,
  onRowClick,
}) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
        <thead style={{ background: 'var(--color-surface-mid)' }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  color: 'var(--color-text-hint)',
                  fontSize: 11,
                  fontWeight: 700,
                  height: 44,
                  letterSpacing: '0.06em',
                  padding: '0 16px',
                  textAlign: column.align || 'left',
                  textTransform: 'uppercase',
                  width: column.width,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="row-alt">
                  {columns.map((column) => (
                    <td key={column.key} style={{ height: 56, padding: '0 16px' }}>
                      <Skeleton
                        height={14}
                        rounded="sm"
                        width={typeof column.width === 'number' ? Math.max(48, column.width - 24) : '70%'}
                      />
                    </td>
                  ))}
                </tr>
              ))
            : null}
          {!loading && data.length
            ? data.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  className="row-alt"
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{
                        fontSize: 14,
                        height: 56,
                        padding: '0 16px',
                        textAlign: column.align || 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            : null}
        </tbody>
      </table>
      {!loading && !data.length ? (
        <EmptyState
          description={emptyMessage}
          icon={<Inbox size={48} />}
          title="Nothing here yet"
        />
      ) : null}
    </div>
  );
}

export default Table;
