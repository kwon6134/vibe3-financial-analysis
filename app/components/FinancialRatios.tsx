'use client';

import {
  getAccountValue,
  calculateROE,
  calculateROA,
  calculateDebtRatio,
  calculateCurrentRatio,
  calculateOperatingMargin,
  calculateNetMargin,
  calculateGrowthRate,
  getRatioStatus,
  getStatusColor,
  type FinancialData,
} from '../utils/financialCalculations';

interface FinancialRatiosProps {
  financialData: FinancialData[];
}

interface RatioCard {
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  thresholds: [number, number];
  isReverse?: boolean; // 부채비율처럼 낮을수록 좋은 경우
}

export default function FinancialRatios({ financialData }: FinancialRatiosProps) {
  // 필요한 계정 값 추출
  const netIncome = getAccountValue(financialData, '당기순이익(손실)', 'thstrm', 'IS');
  const netIncomePrev = getAccountValue(financialData, '당기순이익(손실)', 'frmtrm', 'IS');
  const equity = getAccountValue(financialData, '자본총계', 'thstrm', 'BS');
  const equityPrev = getAccountValue(financialData, '자본총계', 'frmtrm', 'BS');
  const assets = getAccountValue(financialData, '자산총계', 'thstrm', 'BS');
  const debt = getAccountValue(financialData, '부채총계', 'thstrm', 'BS');
  const debtPrev = getAccountValue(financialData, '부채총계', 'frmtrm', 'BS');
  const currentAssets = getAccountValue(financialData, '유동자산', 'thstrm', 'BS');
  const currentLiabilities = getAccountValue(financialData, '유동부채', 'thstrm', 'BS');
  const currentLiabilitiesPrev = getAccountValue(financialData, '유동부채', 'frmtrm', 'BS');
  const operatingIncome = getAccountValue(financialData, '영업이익', 'thstrm', 'IS');
  const operatingIncomePrev = getAccountValue(financialData, '영업이익', 'frmtrm', 'IS');
  const revenue = getAccountValue(financialData, '매출액', 'thstrm', 'IS');
  const revenuePrev = getAccountValue(financialData, '매출액', 'frmtrm', 'IS');

  // 비율 계산
  const roe = calculateROE(netIncome, equity);
  const roePrev = calculateROE(netIncomePrev, equityPrev);
  const roa = calculateROA(netIncome, assets);
  const roaPrev = calculateROA(netIncomePrev, assets);
  const debtRatio = calculateDebtRatio(debt, equity);
  const debtRatioPrev = calculateDebtRatio(debtPrev, equityPrev);
  const currentRatio = calculateCurrentRatio(currentAssets, currentLiabilities);
  const currentRatioPrev = calculateCurrentRatio(
    currentAssets,
    currentLiabilitiesPrev
  );
  const operatingMargin = calculateOperatingMargin(operatingIncome, revenue);
  const operatingMarginPrev = calculateOperatingMargin(operatingIncomePrev, revenuePrev);
  const netMargin = calculateNetMargin(netIncome, revenue);
  const netMarginPrev = calculateNetMargin(netIncomePrev, revenuePrev);

  // 비율 카드 데이터
  const ratios: RatioCard[] = [
    {
      name: 'ROE',
      value: roe,
      previousValue: roePrev,
      unit: '%',
      thresholds: [15, 10],
    },
    {
      name: 'ROA',
      value: roa,
      previousValue: roaPrev,
      unit: '%',
      thresholds: [10, 5],
    },
    {
      name: '부채비율',
      value: debtRatio,
      previousValue: debtRatioPrev,
      unit: '%',
      thresholds: [100, 200],
      isReverse: true, // 낮을수록 좋음
    },
    {
      name: '유동비율',
      value: currentRatio,
      previousValue: currentRatioPrev,
      unit: '',
      thresholds: [1.5, 1.0],
    },
    {
      name: '영업이익률',
      value: operatingMargin,
      previousValue: operatingMarginPrev,
      unit: '%',
      thresholds: [10, 5],
    },
    {
      name: '순이익률',
      value: netMargin,
      previousValue: netMarginPrev,
      unit: '%',
      thresholds: [10, 5],
    },
  ];

  const formatValue = (value: number, unit: string): string => {
    if (isNaN(value) || !isFinite(value)) return '-';
    return `${value.toFixed(2)}${unit}`;
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (isNaN(current) || isNaN(previous) || previous === 0) return null;
    const change = current - previous;
    if (change > 0) {
      return { text: `+${change.toFixed(2)}%p`, color: 'text-green-600 dark:text-green-400' };
    } else if (change < 0) {
      return { text: `${change.toFixed(2)}%p`, color: 'text-red-600 dark:text-red-400' };
    }
    return { text: '0.00%p', color: 'text-gray-600 dark:text-gray-400' };
  };

  const getStatus = (ratio: RatioCard): 'good' | 'warning' | 'danger' => {
    if (isNaN(ratio.value) || !isFinite(ratio.value)) return 'danger';
    
    if (ratio.isReverse) {
      // 부채비율처럼 낮을수록 좋은 경우
      if (ratio.value <= ratio.thresholds[0]) return 'good';
      if (ratio.value <= ratio.thresholds[1]) return 'warning';
      return 'danger';
    } else {
      // 높을수록 좋은 경우
      return getRatioStatus(ratio.value, ratio.thresholds);
    }
  };

  if (financialData.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        재무 비율 분석
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratios.map((ratio) => {
          const status = getStatus(ratio);
          const statusColor = getStatusColor(status);
          const change = getChangeIndicator(ratio.value, ratio.previousValue);

          return (
            <div
              key={ratio.name}
              className={`p-6 rounded-lg border-2 ${statusColor} transition-all hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold">{ratio.name}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    status === 'good'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : status === 'warning'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {status === 'good' ? '양호' : status === 'warning' ? '보통' : '주의'}
                </span>
              </div>
              <div className="text-3xl font-bold mb-2">
                {formatValue(ratio.value, ratio.unit)}
              </div>
              {change && (
                <div className="flex items-center gap-2 text-sm">
                  <span className={change.color}>
                    {change.text}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    (전기 대비)
                  </span>
                </div>
              )}
              {isNaN(ratio.value) && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  데이터 없음
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

