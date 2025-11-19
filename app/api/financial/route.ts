import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OPENDART_API_KEY = process.env.OPENDART_API_KEY;

interface FinancialData {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  account_nm: string;
  fs_div: string;
  fs_nm: string;
  sj_div: string;
  sj_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_dt?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const corpCode = searchParams.get('corp_code');
    // 기본 연도를 작년으로 설정 (올해 데이터가 아직 없을 수 있음)
    const bsnsYear = searchParams.get('bsns_year') || (new Date().getFullYear() - 1).toString();
    const reprtCode = searchParams.get('reprt_code') || '11011'; // 사업보고서

    if (!corpCode) {
      return NextResponse.json(
        { error: 'corp_code is required' },
        { status: 400 }
      );
    }

    if (!OPENDART_API_KEY) {
      return NextResponse.json(
        { error: 'OpenDart API key is not configured' },
        { status: 500 }
      );
    }

    const url = 'https://opendart.fss.or.kr/api/fnlttSinglAcnt.json';
    const response = await axios.get(url, {
      params: {
        crtfc_key: OPENDART_API_KEY,
        corp_code: corpCode,
        bsns_year: bsnsYear,
        reprt_code: reprtCode,
      },
    });

    if (response.data.status !== '000') {
      console.error('OpenDart API Error:', {
        status: response.data.status,
        message: response.data.message,
        corp_code: corpCode,
        bsns_year: bsnsYear,
        reprt_code: reprtCode,
      });
      return NextResponse.json(
        { 
          error: response.data.message || 'Failed to fetch financial data',
          status: response.data.status,
          details: `연도: ${bsnsYear}, 보고서: ${reprtCode === '11011' ? '사업보고서' : reprtCode === '11013' ? '1분기보고서' : reprtCode === '11012' ? '반기보고서' : '3분기보고서'}`
        },
        { status: 400 }
      );
    }

    const financialData: FinancialData[] = response.data.list || [];

    return NextResponse.json({
      status: response.data.status,
      message: response.data.message,
      data: financialData,
    });
  } catch (error: any) {
    console.error('Financial data fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch financial data' },
      { status: 500 }
    );
  }
}

