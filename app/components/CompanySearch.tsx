'use client';

import { useState, useEffect, useCallback } from 'react';

interface Company {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
}

interface CompanySearchProps {
  onSelectCompany: (company: Company) => void;
}

export default function CompanySearch({ onSelectCompany }: CompanySearchProps) {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const searchCompanies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setCompanies([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Search error:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCompanies(query);
      } else {
        setCompanies([]);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query, searchCompanies]);

  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    setQuery(company.corp_name);
    setCompanies([]);
    onSelectCompany(company);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="회사명을 검색하세요 (예: 삼성전자, Samsung 등)"
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {companies.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
          {companies.map((company) => (
            <button
              key={company.corp_code}
              onClick={() => handleSelect(company)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {company.corp_name}
              </div>
              {company.corp_eng_name && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {company.corp_eng_name}
                </div>
              )}
              {company.stock_code && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  종목코드: {company.stock_code}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedCompany && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <div className="font-semibold text-blue-900 dark:text-blue-100">
            선택된 회사: {selectedCompany.corp_name}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            고유번호: {selectedCompany.corp_code}
          </div>
        </div>
      )}
    </div>
  );
}

