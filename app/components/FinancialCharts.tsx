'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AIAnalysis from './AIAnalysis';
import FinancialRatios from './FinancialRatios';
import GrowthRateChart from './GrowthRateChart';
import AssetStructureChart from './AssetStructureChart';

interface FinancialData {
  account_nm: string;
  sj_div: string;
  sj_nm: string;
  fs_div: string;
  thstrm_amount: string;
  frmtrm_amount: string;
  bfefrmtrm_amount?: string;
  thstrm_nm: string;
  frmtrm_nm: string;
  bfefrmtrm_nm?: string;
}

interface FinancialChartsProps {
  corpCode: string;
  companyName: string;
}

export default function FinancialCharts({ corpCode, companyName }: FinancialChartsProps) {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 기본 연도를 작년으로 설정 (올해 데이터가 아직 없을 수 있음)
  const [bsnsYear, setBsnsYear] = useState((new Date().getFullYear() - 1).toString());
  const [reprtCode, setReprtCode] = useState('11011');

  const fetchFinancialData = async () => {
    if (!corpCode) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/financial?corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`
      );
      const data = await response.json();

      if (data.error) {
        const errorMessage = data.details 
          ? `${data.error} (${data.details})`
          : data.error;
        setError(errorMessage);
        setFinancialData([]);
      } else {
        setFinancialData(data.data || []);
      }
    } catch (err: any) {
      setError(err.message || '재무 데이터를 가져오는데 실패했습니다.');
      setFinancialData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (corpCode) {
      fetchFinancialData();
    }
  }, [corpCode, bsnsYear, reprtCode]);

  // Format number for display
  const formatNumber = (value: string) => {
    const num = parseInt(value || '0', 10);
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(1)}조`;
    } else if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만`;
    }
    return num.toLocaleString();
  };

  // Prepare data for charts
  const prepareChartData = () => {
    const balanceSheet = financialData.filter((item) => item.sj_div === 'BS');
    const incomeStatement = financialData.filter((item) => item.sj_div === 'IS');

    // Key accounts to display
    const keyAccounts = [
      '자산총계',
      '부채총계',
      '자본총계',
      '유동자산',
      '비유동자산',
      '매출액',
      '영업이익',
      '당기순이익(손실)',
    ];

    const chartData: any[] = [];

    keyAccounts.forEach((accountName) => {
      const account = [...balanceSheet, ...incomeStatement].find(
        (item) => item.account_nm === accountName
      );
      if (account) {
        chartData.push({
          name: accountName,
          당기: parseInt(account.thstrm_amount || '0', 10),
          전기: parseInt(account.frmtrm_amount || '0', 10),
          전전기: account.bfefrmtrm_amount
            ? parseInt(account.bfefrmtrm_amount, 10)
            : null,
        });
      }
    });

    return chartData;
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (financialData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        재무 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {companyName} 재무 데이터
        </h2>
        <div className="flex gap-4">
          <select
            value={bsnsYear}
            onChange={(e) => setBsnsYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            {Array.from({ length: 5 }, (_, i) => {
              // 작년부터 5년 전까지
              const year = new Date().getFullYear() - 1 - i;
              return (
                <option key={year} value={year.toString()}>
                  {year}년
                </option>
              );
            })}
          </select>
          <select
            value={reprtCode}
            onChange={(e) => setReprtCode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="11011">사업보고서</option>
            <option value="11013">1분기보고서</option>
            <option value="11012">반기보고서</option>
            <option value="11014">3분기보고서</option>
          </select>
        </div>
      </div>

      {chartData.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              주요 재무 지표 추이
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => formatNumber(value.toString())}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value.toString())}
                />
                <Legend />
                <Bar dataKey="당기" fill="#3b82f6" />
                <Bar dataKey="전기" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              주요 계정 추이 (라인 차트)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => formatNumber(value.toString())}
                />
                <Tooltip
                  formatter={(value: number) => formatNumber(value.toString())}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="당기"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="전기"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          상세 재무 데이터
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  계정명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  재무제표
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  당기금액
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  전기금액
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {financialData.slice(0, 50).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.account_nm}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.sj_nm}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {formatNumber(item.thstrm_amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {formatNumber(item.frmtrm_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {financialData.length > 0 && (
        <>
          {/* 재무 비율 대시보드 */}
          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <FinancialRatios financialData={financialData} />
          </div>

          {/* 성장률 추이 */}
          <GrowthRateChart financialData={financialData} />

          {/* 자산 구조 분석 */}
          <AssetStructureChart financialData={financialData} />

          {/* AI 분석 */}
          <div className="mt-8">
            <AIAnalysis financialData={financialData} companyName={companyName} />
          </div>
        </>
      )}
    </div>
  );
}

