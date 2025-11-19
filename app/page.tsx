'use client';

import { useState } from 'react';
import CompanySearch from './components/CompanySearch';
import FinancialCharts from './components/FinancialCharts';

interface Company {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
}

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            재무 데이터 시각화 분석 서비스
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            회사를 검색하고 재무 데이터를 시각화하고 AI로 분석해보세요
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <CompanySearch onSelectCompany={handleSelectCompany} />
        </div>

        {selectedCompany && (
          <div className="mt-8">
            <FinancialCharts
              corpCode={selectedCompany.corp_code}
              companyName={selectedCompany.corp_name}
            />
          </div>
        )}

        {!selectedCompany && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-4">위에서 회사명을 검색하여 시작하세요</p>
              <p className="text-sm">
                예: 삼성전자, SK하이닉스, 현대자동차 등
              </p>
            </div>
        </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            데이터 제공: 오픈다트(OpenDart) | AI 분석: Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
