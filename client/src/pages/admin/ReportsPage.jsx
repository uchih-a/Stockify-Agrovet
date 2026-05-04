import { Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { FarmerActivityChart } from '@/components/charts/FarmerActivityChart';
import { MonthlySalesChart } from '@/components/charts/MonthlySalesChart';
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart';
import { TopProductsBarChart } from '@/components/charts/TopProductsBarChart';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import { useGetChatbotStats, useGetFarmerActivityReport, useGetGeminiInsights, useGetInventorySnapshot, useGetSalesSummary } from '@/hooks/useReports';
import { formatDate, formatKES } from '@/utils/formatters';

const tabs = ['Sales', 'Inventory', 'Farmers', 'Chatbot', 'AI Insights'];

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Sales');
  const [dateRange, setDateRange] = useState({ endDate: '', startDate: '' });
  const params = useMemo(() => ({ endDate: dateRange.endDate, startDate: dateRange.startDate }), [dateRange]);
  const { data: sales } = useGetSalesSummary(params);
  const { data: inventory } = useGetInventorySnapshot();
  const { data: farmers } = useGetFarmerActivityReport(params);
  const { data: chatbot } = useGetChatbotStats();
  const insightsQuery = useGetGeminiInsights();

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Understand revenue, stock health, farmer behaviour, and AgroBot usage." />
      <Card level="low" padding={16}>
        <DateRangePicker
          endDate={dateRange.endDate}
          onEndChange={(value) => setDateRange((current) => ({ ...current, endDate: value }))}
          onStartChange={(value) => setDateRange((current) => ({ ...current, startDate: value }))}
          startDate={dateRange.startDate}
        />
      </Card>
      <div style={{ borderBottom: '1px solid rgba(67,72,62,0.08)', display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 20, paddingBottom: 12 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', paddingBottom: 10 }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Sales' ? (
        <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <StatCard label="Total Revenue" value={formatKES(sales?.totalRevenue || 0)} variant="primary" />
            <StatCard label="Total Units Sold" value={sales?.totalUnitsSold || 0} />
            <StatCard label="Transaction Count" value={sales?.totalTransactions || 0} />
          </div>
          <Card level="elevated">
            <RevenueAreaChart data={sales?.dailyRevenue || []} />
          </Card>
          <Card level="elevated">
            <h3 style={{ fontSize: 14, margin: 0 }}>Top 10 Products</h3>
            <div style={{ marginTop: 16 }}>
              <TopProductsBarChart data={sales?.topProducts || []} />
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === 'Inventory' ? (
        <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <StatCard label="Total Value" value={formatKES(inventory?.totalStockValue || 0)} variant="primary" />
            <StatCard label="Active Products" value={inventory?.totalProducts || 0} />
            <StatCard label="Low Stock" value={inventory?.lowStockCount || 0} variant="amber" />
            <StatCard label="Expired" value={inventory?.expiredCount || 0} variant="danger" />
          </div>
          <Card level="elevated">
            <CategoryDonutChart data={inventory?.byCategory || []} />
          </Card>
          <Card level="elevated">
            <h3 style={{ fontSize: 14, margin: 0 }}>Expiring Soon</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {(inventory?.expiringSoon || []).map((product) => (
                <div key={product._id} style={{ alignItems: 'center', background: 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0,1fr) auto auto', padding: 14 }}>
                  <span>{product.name}</span>
                  <span>{product.quantity}</span>
                  <span>{formatDate(product.expiryDate)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === 'Farmers' ? (
        <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <StatCard label="Total Farmers" value={farmers?.totalFarmers || 0} />
            <StatCard label="Active This Month" value={farmers?.activeThisMonth || 0} variant="primary" />
            <StatCard label="New This Month" value={farmers?.newThisMonth || 0} />
          </div>
          <Card level="elevated">
            <FarmerActivityChart data={farmers?.monthlyActivity || []} />
          </Card>
          <Card level="elevated">
            <h3 style={{ fontSize: 14, margin: 0 }}>Top Buyers</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {(farmers?.topBuyers || []).slice(0, 10).map((farmer, index) => (
                <div key={farmer._id} style={{ alignItems: 'center', background: 'var(--color-surface-low)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 12, gridTemplateColumns: '32px minmax(0,1fr) auto auto', padding: 14 }}>
                  <span>{index + 1}</span>
                  <span>{farmer.name}</span>
                  <span>{farmer.purchases}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{formatKES(farmer.totalSpent)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {activeTab === 'Chatbot' ? (
        <div style={{ display: 'grid', gap: 24, marginTop: 20 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <StatCard label="Total Messages" value={chatbot?.totalMessages || 0} variant="primary" />
            <StatCard label="Unique Users" value={chatbot?.uniqueUsers || 0} />
            <StatCard label="Avg Messages/Session" value={(chatbot?.averageMessagesPerSession || 0).toFixed(1)} />
          </div>
          <Card level="elevated">
            <MonthlySalesChart data={chatbot?.dailyCounts || []} />
          </Card>
          <Card level="elevated">
            <h3 style={{ fontSize: 14, margin: 0 }}>Top Questions</h3>
            <ol style={{ color: 'var(--color-text-muted)', display: 'grid', gap: 10, marginTop: 16, paddingLeft: 18 }}>
              {(chatbot?.topQuestions || []).map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </Card>
        </div>
      ) : null}

      {activeTab === 'AI Insights' ? (
        <div style={{ margin: '24px auto 0', maxWidth: 700 }}>
          {!insightsQuery.data && !insightsQuery.isFetching ? (
            <EmptyState
              action={{ label: 'Generate Insights', onClick: () => insightsQuery.refetch() }}
              description="AgroBot will analyse your current inventory and generate actionable business insights."
              icon={<Sparkles size={40} color="var(--color-amber)" />}
              title="Generate AI Insights"
            />
          ) : null}
          {insightsQuery.isFetching ? (
            <div style={{ display: 'grid', gap: 16 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} height={120} rounded="lg" />
              ))}
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>AgroBot is analysing your inventory...</p>
            </div>
          ) : null}
          {insightsQuery.data?.insights ? (
            <div style={{ display: 'grid', gap: 14 }}>
              {insightsQuery.data.insights.map((insight, index) => (
                <Card key={insight.title || index} level="base" padding={24} style={{ animation: `fade-in 300ms ${index * 100}ms both`, background: 'var(--color-primary-surface)', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ alignItems: 'center', color: 'var(--color-amber)', display: 'flex', gap: 8 }}>
                    <Sparkles size={18} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: 0 }}>
                      {insight.title || `Insight ${index + 1}`}
                    </h3>
                  </div>
                  <p style={{ lineHeight: 1.7, margin: '10px 0 0' }}>{insight.description || insight.insight}</p>
                </Card>
              ))}
            </div>
          ) : null}
          <Button disabled style={{ marginTop: 20 }} variant="secondary">
            Export Full Report (PDF)
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ReportsPage;
