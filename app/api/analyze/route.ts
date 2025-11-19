import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { financialData, companyName } = body;

    if (!financialData || !Array.isArray(financialData)) {
      return NextResponse.json(
        { error: 'Financial data is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Try gemini-2.0-flash-exp first, fallback to gemini-1.5-flash if not available
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    } catch {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    // Prepare financial data summary
    const summary = financialData
      .map((item: any) => {
        return `${item.account_nm} (${item.sj_nm}): 당기 ${item.thstrm_amount || '0'}, 전기 ${item.frmtrm_amount || '0'}`;
      })
      .slice(0, 30) // Limit to first 30 items to avoid token limits
      .join('\n');

    const prompt = `다음은 ${companyName || '한 기업'}의 재무제표 데이터입니다. 
이 데이터를 분석하여 누구나 쉽게 이해할 수 있도록 한국어로 설명해주세요.

재무 데이터:
${summary}

다음 항목들을 포함하여 분석해주세요:
1. 주요 재무 지표 요약 (자산, 부채, 자본, 매출, 이익 등)
2. 전년 대비 변화 추이
3. 재무 건전성 평가
4. 투자자 관점에서의 주요 포인트
5. 간단한 결론

쉽고 명확한 언어로 작성해주세요. 전문 용어는 최소화하고, 일반인도 이해할 수 있도록 설명해주세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return NextResponse.json({
      analysis,
    });
  } catch (error: any) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze financial data' },
      { status: 500 }
    );
  }
}

