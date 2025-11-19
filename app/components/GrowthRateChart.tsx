'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getAccountValue,
  calculateGrowthRate,
  type FinancialData,
} from '../utils/financialCalculations';

interface GrowthRateChartProps {
  financialData: FinancialData[];
}

export default function GrowthRateChart({ financialData }: GrowthRateChartProps) {
  // 필요한 계정 값 추출
  const revenueCurrent = getAccountValue(financialData, '매출액', 'thstrm', 'IS');
  const revenuePrev = getAccountValue(financialData, '매출액', 'frmtrm', 'IS');
  const revenuePrevPrev = getAccountValue(financialData, '매출액', 'bfefrmtrm', 'IS');

  const operatingIncomeCurrent = getAccountValue(financialData, '영업이익', 'thstrm', 'IS');
  const operatingIncomePrev = getAccountValue(financialData, '영업이익', 'frmtrm', 'IS');
  const operatingIncomePrevPrev = getAccountValue(financialData, '영업이익', 'bfefrmtrm', 'IS');

  const netIncomeCurrent = getAccountValue(financialData, '당기순이익(손실)', 'thstrm', 'IS');
  const netIncomePrev = getAccountValue(financialData, '당기순이익(손실)', 'frmtrm', 'IS');
  const netIncomePrevPrev = getAccountValue(financialData, '당기순이익(손실)', 'bfefrmtrm', 'IS');

  const assetsCurrent = getAccountValue(financialData, '자산총계', 'thstrm', 'BS');
  const assetsPrev = getAccountValue(financialData, '자산총계', 'frmtrm', 'BS');
  const assetsPrevPrev = getAccountValue(financialData, '자산총계', 'bfefrmtrm', 'BS');

  // 성장률 계산
  const revenueGrowth1 = calculateGrowthRate(revenueCurrent, revenuePrev);
  const revenueGrowth2 = revenuePrevPrev > 0 ? calculateGrowthRate(revenuePrev, revenuePrevPrev) : null;

  const operatingIncomeGrowth1 = calculateGrowthRate(operatingIncomeCurrent, operatingIncomePrev);
  const operatingIncomeGrowth2 = operatingIncomePrevPrev > 0 ? calculateGrowthRate(operatingIncomePrev, operatingIncomePrevPrev) : null;

  const netIncomeGrowth1 = calculateGrowthRate(netIncomeCurrent, netIncomePrev);
  const netIncomeGrowth2 = netIncomePrevPrev > 0 ? calculateGrowthRate(netIncomePrev, netIncomePrevPrev) : null;

  const assetsGrowth1 = calculateGrowthRate(assetsCurrent, assetsPrev);
  const assetsGrowth2 = assetsPrevPrev > 0 ? calculateGrowthRate(assetsPrev, assetsPrevPrev) : null;

  // 차트 데이터 준비
  const hasPrevPrev = revenuePrevPrev > 0 || operatingIncomePrevPrev > 0 || netIncomePrevPrev > 0 || assetsPrevPrev > 0;
  
  const chartData = [];
  
  if (hasPrevPrev && revenueGrowth2 !== null) {
    // 전전기 데이터가 있는 경우 (3개 기간)
    chartData.push({
      period: '전전기→전기',
      매출증가율: revenueGrowth2,
      영업이익증가율: operatingIncomeGrowth2,
      순이익증가율: netIncomeGrowth2,
      자산증가율: assetsGrowth2,
    });
  }
  
  chartData.push({
    period: '전기→당기',
    매출증가율: revenueGrowth1,
    영업이익증가율: operatingIncomeGrowth1,
    순이익증가율: netIncomeGrowth1,
    자산증가율: assetsGrowth1,
  });

  if (chartData.length === 0 || financialData.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        성장률 추이 (YoY)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            className="text-gray-700 dark:text-gray-300"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-gray-700 dark:text-gray-300"
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip
            formatter={(value: number) => {
              if (value === null || isNaN(value) || !isFinite(value)) return '-';
              return `${value.toFixed(2)}%`;
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="매출증가율"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 5 }}
            name="매출 증가율"
          />
          <Line
            type="monotone"
            dataKey="영업이익증가율"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 5 }}
            name="영업이익 증가율"
          />
          <Line
            type="monotone"
            dataKey="순이익증가율"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 5 }}
            name="순이익 증가율"
          />
          <Line
            type="monotone"
            dataKey="자산증가율"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 5 }}
            name="자산 증가율"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>• 양수는 증가, 음수는 감소를 나타냅니다.</p>
        <p>• 전전기 데이터가 있는 경우 3개 기간을 표시합니다.</p>
      </div>
    </div>
  );
}

