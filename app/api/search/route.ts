import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Company {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query) {
      return NextResponse.json({ companies: [] });
    }

    // Read the JSON data file
    const filePath = path.join(process.cwd(), 'data', 'corp-data.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const companies: Company[] = JSON.parse(fileContents);

    // Search companies by name (Korean or English)
    const searchTerm = query.toLowerCase();
    const filtered = companies.filter(
      (company) =>
        company.corp_name.toLowerCase().includes(searchTerm) ||
        company.corp_eng_name.toLowerCase().includes(searchTerm) ||
        company.stock_code.includes(query)
    );

    // Limit results to 50 for performance
    const results = filtered.slice(0, 50).map((company) => ({
      corp_code: company.corp_code,
      corp_name: company.corp_name,
      corp_eng_name: company.corp_eng_name,
      stock_code: company.stock_code,
    }));

    return NextResponse.json({ companies: results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    );
  }
}

