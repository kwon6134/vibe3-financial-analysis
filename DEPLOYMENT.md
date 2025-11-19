# 배포 가이드

## GitHub 저장소
- URL: https://github.com/kwon6134/vibe3-financial-analysis

## Vercel 배포

### 1. Vercel 프로젝트 생성
1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 `kwon6134/vibe3-financial-analysis` 선택
4. Import 클릭

### 2. 환경변수 설정 (중요!)
Vercel 대시보드에서 프로젝트 설정 > Environment Variables에 다음을 추가:

#### 프로덕션 환경 (Production)
- `OPENDART_API_KEY`: `528bd7214106f4c7bcabe3f96fba6fef80ca11e0`
- `GEMINI_API_KEY`: `AIzaSyDUQYtVXKSqrZlSXpH0hNVsm-y73VqIUI8`

#### 프리뷰 환경 (Preview) - 선택사항
- 동일한 환경변수 추가

#### 개발 환경 (Development) - 선택사항
- 동일한 환경변수 추가

### 3. 빌드 설정
- Framework Preset: Next.js (자동 감지)
- Build Command: `npm run build` (기본값)
- Output Directory: `.next` (기본값)
- Install Command: `npm install` (기본값)

### 4. 배포
- "Deploy" 버튼 클릭
- 배포 완료 후 제공되는 URL로 접속 가능

## 환경변수 관리 주의사항

⚠️ **중요**: API 키는 절대 GitHub에 커밋하지 마세요!
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 커밋되지 않습니다
- Vercel 대시보드에서만 환경변수를 설정하세요
- 로컬 개발 시에는 `.env.local` 파일을 사용하세요

## API 키 보안

### 프로덕션 환경
- Vercel 환경변수로 관리
- 코드에 하드코딩하지 않음
- 환경변수는 암호화되어 저장됨

### 개발 환경
- `.env.local` 파일 사용 (Git에 커밋되지 않음)
- 파일 내용:
  ```
  OPENDART_API_KEY=your_key_here
  GEMINI_API_KEY=your_key_here
  ```

## 배포 후 확인사항

1. ✅ 환경변수가 제대로 설정되었는지 확인
2. ✅ API 엔드포인트가 정상 작동하는지 확인
3. ✅ 재무 데이터 조회가 정상 작동하는지 확인
4. ✅ AI 분석 기능이 정상 작동하는지 확인

## 문제 해결

### 환경변수가 적용되지 않는 경우
- Vercel 대시보드에서 환경변수 재설정
- 프로젝트 재배포

### API 에러가 발생하는 경우
- 환경변수가 올바르게 설정되었는지 확인
- API 키가 유효한지 확인
- Vercel 로그 확인 (Deployments > 함수 로그)

