import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useGetProducts } from '@/hooks/useProducts';
import { CATEGORY_LABELS, PRODUCT_CATEGORIES } from '@/utils/constants';
import { ShoppingBag } from 'lucide-react';

const sortOptions = [
  { label: 'Name A-Z', value: 'name' },
  { label: 'Price ↑', value: 'price' },
  { label: 'Price ↓', value: '-price' },
  { label: 'Newest', value: '-createdAt' },
];

const LIMIT = 8;

export function ShopPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);

  const queryParams = {
    category: category === 'all' ? undefined : category,
    limit: LIMIT,
    page,
    search: search || undefined,
    sort,
  };

  // ✅ FIX: Destructure isFetching separately from isLoading
  const { data, isLoading, isFetching } = useGetProducts(queryParams);
  const products = data?.docs || [];

  const handleSearch = (value) => { setSearch(value); setPage(1); };
  const handleCategory = (value) => { setCategory(value); setPage(1); };
  const handleSort = (e) => { setSort(e.target.value); setPage(1); };
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Sticky filter bar */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-float)',
          display: 'grid',
          gap: 16,
          marginBottom: 28,
          padding: '16px 20px',
          position: 'sticky',
          top: 76,
          zIndex: 20,
        }}
      >
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0,1fr) 220px' }}>
          <SearchInput placeholder="Search products..." value={search} onChange={handleSearch} />
          <Select options={sortOptions} value={sort} onChange={handleSort} />
        </div>

        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button onClick={() => handleCategory('all')} size="sm" variant={category === 'all' ? 'primary' : 'secondary'}>
              All
            </Button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Button key={cat} onClick={() => handleCategory(cat)} size="sm" variant={category === cat ? 'primary' : 'secondary'}>
                {CATEGORY_LABELS[cat] || cat.replaceAll('_', ' ')}
              </Button>
            ))}
          </div>
          <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
            {data?.totalDocs ?? 0} results
          </span>
        </div>
      </div>

      {/* ✅ FIX: Only show skeleton on FIRST load (isLoading).
          On page-change, dim with opacity instead of flashing to skeleton */}
      <div
        style={{
          display: 'grid',
          gap: '24px 16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          minHeight: 200,
          opacity: isFetching && !isLoading ? 0.5 : 1,
          transition: 'opacity 0.2s ease',
          pointerEvents: isFetching && !isLoading ? 'none' : 'auto',
        }}
      >
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, index) => (
              <div key={index} style={{ display: 'grid', gap: 12 }}>
                <Skeleton height={220} rounded="lg" />
                <Skeleton height={18} width="70%" />
                <Skeleton height={18} width="46%" />
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <EmptyState
          icon={<ShoppingBag size={48} />}
          title="No products found"
          description="Try adjusting your search or category filter."
          action={{
            label: 'Clear Filters',
            onClick: () => { setSearch(''); setCategory('all'); setPage(1); },
          }}
        />
      )}

      <Pagination
        currentPage={page}
        limit={LIMIT}
        onPageChange={handlePageChange}
        totalDocs={data?.totalDocs || 0}
        totalPages={data?.totalPages || 1}
      />
    </div>
  );
}

export default ShopPage;