'use client';

import { useState } from 'react';

interface FinancialData {
  account_nm: string;
  sj_div: string;
  sj_nm: string;
  thstrm_amount: string;
  frmtrm_amount: string;
  bfefrmtrm_amount?: string;
}

interface AIAnalysisProps {
  financialData: FinancialData[];
  companyName: string;
}

export default function AIAnalysis({ financialData, companyName }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (financialData.length === 0) {
      setError('재무 데이터가 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          financialData,
          companyName,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data.analysis);
      }
    } catch (err: any) {
      setError(err.message || 'AI 분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          AI 재무 분석
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading || financialData.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '분석 중...' : '분석 시작'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {analysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="prose max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {analysis}
            </div>
          </div>
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          재무 데이터를 분석하려면 '분석 시작' 버튼을 클릭하세요.
        </div>
      )}
    </div>
  );
}

