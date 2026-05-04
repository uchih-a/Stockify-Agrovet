import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const buildPages = (currentPage, totalPages) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('ellipsis-left');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis-right');
    pages.push(totalPages);
  }

  return pages;
};

export function Pagination({
  currentPage = 1,
  limit = 10,
  onPageChange,
  totalDocs = 0,
  totalPages = 1,
}) {
  const start = totalDocs === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(totalDocs, currentPage * limit);
  const pages = buildPages(currentPage, totalPages);

  if (totalDocs === 0) return null;
  if (totalPages <= 1) return (
    <div style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 16 }}>
      Showing {totalDocs} result{totalDocs !== 1 ? 's' : ''}
    </div>
  );

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
        marginTop: 20,
      }}
    >
      <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
        Showing {start}-{end} of {totalDocs} results
      </span>
      <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          size="sm"
          variant="secondary"
        >
          <ChevronLeft size={14} />
        </Button>
        {pages.map((page) =>
          typeof page === 'string' ? (
            <span key={page} style={{ color: 'var(--color-text-hint)', fontSize: 13 }}>
              ...
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange?.(page)}
              size="sm"
              variant={page === currentPage ? 'primary' : 'secondary'}
            >
              {page}
            </Button>
          ),
        )}
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          size="sm"
          variant="secondary"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
