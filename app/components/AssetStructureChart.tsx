'use client';

import { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getAccountValue, type FinancialData } from '../utils/financialCalculations';

interface AssetStructureChartProps {
  financialData: FinancialData[];
}

interface AssetItem {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = {
  current: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'], // 파란색 계열
  nonCurrent: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'], // 녹색 계열
};

export default function AssetStructureChart({ financialData }: AssetStructureChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'current' | 'nonCurrent'>('all');

  // 재무상태표 데이터만 필터링
  const balanceSheetData = useMemo(() => {
    return financialData.filter((item) => item.sj_div === 'BS');
  }, [financialData]);

  // 유동자산과 비유동자산 추출
  const currentAssets = getAccountValue(financialData, '유동자산', 'thstrm', 'BS');
  const nonCurrentAssets = getAccountValue(financialData, '비유동자산', 'thstrm', 'BS');
  const totalAssets = currentAssets + nonCurrentAssets;

  // 유동자산 세부 항목 추출 (일반적인 계정명들)
  const currentAssetDetails: AssetItem[] = useMemo(() => {
    const details: AssetItem[] = [];
    const accountNames = [
      '현금및현금성자산',
      '단기투자자산',
      '매출채권',
      '재고자산',
      '기타유동자산',
    ];

    accountNames.forEach((name) => {
      const value = getAccountValue(balanceSheetData, name, 'thstrm', 'BS');
      if (value > 0) {
        details.push({
          name,
          value,
          percentage: currentAssets > 0 ? (value / currentAssets) * 100 : 0,
        });
      }
    });

    // 나머지 유동자산
    const accountedValue = details.reduce((sum, item) => sum + item.value, 0);
    const remaining = currentAssets - accountedValue;
    if (remaining > 0 && currentAssets > 0) {
      details.push({
        name: '기타',
        value: remaining,
        percentage: (remaining / currentAssets) * 100,
      });
    }

    return details;
  }, [balanceSheetData, currentAssets]);

  // 비유동자산 세부 항목 추출
  const nonCurrentAssetDetails: AssetItem[] = useMemo(() => {
    const details: AssetItem[] = [];
    const accountNames = [
      '유형자산',
      '무형자산',
      '장기투자자산',
      '기타비유동자산',
    ];

    accountNames.forEach((name) => {
      const value = getAccountValue(balanceSheetData, name, 'thstrm', 'BS');
      if (value > 0) {
        details.push({
          name,
          value,
          percentage: nonCurrentAssets > 0 ? (value / nonCurrentAssets) * 100 : 0,
        });
      }
    });

    // 나머지 비유동자산
    const accountedValue = details.reduce((sum, item) => sum + item.value, 0);
    const remaining = nonCurrentAssets - accountedValue;
    if (remaining > 0 && nonCurrentAssets > 0) {
      details.push({
        name: '기타',
        value: remaining,
        percentage: (remaining / nonCurrentAssets) * 100,
      });
    }

    return details;
  }, [balanceSheetData, nonCurrentAssets]);

  // 메인 차트 데이터 (유동 vs 비유동)
  const mainChartData = useMemo(() => {
    if (totalAssets === 0) return [];
    return [
      {
        name: '유동자산',
        value: currentAssets,
        percentage: (currentAssets / totalAssets) * 100,
      },
      {
        name: '비유동자산',
        value: nonCurrentAssets,
        percentage: (nonCurrentAssets / totalAssets) * 100,
      },
    ].filter((item) => item.value > 0);
  }, [currentAssets, nonCurrentAssets, totalAssets]);

  // 표시할 차트 데이터 결정
  const displayData = useMemo(() => {
    if (selectedCategory === 'current') {
      return currentAssetDetails;
    } else if (selectedCategory === 'nonCurrent') {
      return nonCurrentAssetDetails;
    }
    return mainChartData;
  }, [selectedCategory, mainChartData, currentAssetDetails, nonCurrentAssetDetails]);

  const formatNumber = (value: number): string => {
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(1)}조`;
    } else if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}만`;
    }
    return value.toLocaleString();
  };

  const getColor = (index: number, category: string): string => {
    const colorArray = category === 'current' || selectedCategory === 'current' 
      ? COLORS.current 
      : COLORS.nonCurrent;
    return colorArray[index % colorArray.length];
  };

  if (financialData.length === 0 || totalAssets === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          자산 구조 분석
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedCategory('current')}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            유동자산
          </button>
          <button
            onClick={() => setSelectedCategory('nonCurrent')}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === 'nonCurrent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            비유동자산
          </button>
        </div>
      </div>

      {displayData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={displayData as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${entry.percentage.toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(index, selectedCategory)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => {
                  return `${formatNumber(value)}원 (${((value / (selectedCategory === 'all' ? totalAssets : selectedCategory === 'current' ? currentAssets : nonCurrentAssets)) * 100).toFixed(2)}%)`;
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              상세 내역
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      항목
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      금액
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      비율
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {displayData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatNumber(item.value)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          자산 구조 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}

