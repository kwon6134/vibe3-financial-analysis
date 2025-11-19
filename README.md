# 재무 데이터 시각화 분석 서비스

누구나 쉽게 이해할 수 있는 재무 데이터 시각화 분석 서비스입니다. React와 Next.js로 구현되었으며, 오픈다트 API를 통해 실제 재무 데이터를 가져와 시각화하고, Google Gemini AI를 활용하여 재무 정보를 쉽게 분석합니다.

## 주요 기능

1. **회사 검색**: corp.xml 데이터베이스를 활용한 회사명 검색 기능
2. **재무 데이터 시각화**: 오픈다트 API를 통한 실제 재무 데이터 조회 및 차트 시각화
3. **AI 분석**: Google Gemini를 활용한 재무 데이터 분석 및 설명

## 기술 스택

- **프레임워크**: Next.js 16 (React 19)
- **차트 라이브러리**: Recharts
- **스타일링**: Tailwind CSS
- **API**: 오픈다트(OpenDart), Google Gemini
- **배포**: Vercel

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENDART_API_KEY=your_opendart_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
vibe3/
├── app/
│   ├── api/
│   │   ├── search/          # 회사 검색 API
│   │   ├── financial/       # 재무 데이터 조회 API
│   │   └── analyze/         # AI 분석 API
│   ├── components/
│   │   ├── CompanySearch.tsx    # 회사 검색 컴포넌트
│   │   ├── FinancialCharts.tsx   # 재무 데이터 차트 컴포넌트
│   │   └── AIAnalysis.tsx        # AI 분석 컴포넌트
│   └── page.tsx             # 메인 페이지
├── data/
│   └── corp-data.json       # 회사 정보 데이터베이스
└── scripts/
    └── convert-corp-xml.js  # XML to JSON 변환 스크립트
```

## 사용 방법

1. **회사 검색**: 상단 검색창에 회사명을 입력하여 검색합니다.
2. **재무 데이터 조회**: 회사를 선택하면 자동으로 재무 데이터를 가져옵니다.
3. **데이터 시각화**: 바 차트와 라인 차트로 재무 데이터를 시각화합니다.
4. **AI 분석**: "분석 시작" 버튼을 클릭하여 AI로 재무 데이터를 분석합니다.

## API 키 발급

### 오픈다트 API 키
1. [오픈다트 홈페이지](https://opendart.fss.or.kr/)에 접속
2. 회원가입 후 API 인증키 발급

### Google Gemini API 키
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. API 키 생성

## Vercel 배포

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인하고 프로젝트를 import합니다.
3. 환경변수를 설정합니다:
   - `OPENDART_API_KEY`
   - `GEMINI_API_KEY`
4. 배포를 완료합니다.

## 주의사항

- API 키는 반드시 `.env.local` 파일에 저장하고, Git에 커밋하지 마세요.
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다.
- 실제 데이터만 사용하며, 데모 데이터는 사용하지 않습니다.

## 라이선스

MIT
