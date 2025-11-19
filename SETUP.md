# 환경변수 설정 가이드

프로젝트를 실행하기 전에 환경변수를 설정해야 합니다.

## 1. .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요.

## 2. 환경변수 추가

`.env.local` 파일에 다음 내용을 추가하세요:

```env
OPENDART_API_KEY=528bd7214106f4c7bcabe3f96fba6fef80ca11e0
GEMINI_API_KEY=AIzaSyDUQYtVXKSqrZlSXpH0hNVsm-y73VqIUI8
```

## 3. 개발 서버 실행

```bash
npm run dev
```

## 4. Vercel 배포 시 환경변수 설정

Vercel 대시보드에서 프로젝트 설정 > Environment Variables에 다음을 추가하세요:

- `OPENDART_API_KEY`: 528bd7214106f4c7bcabe3f96fba6fef80ca11e0
- `GEMINI_API_KEY`: AIzaSyDUQYtVXKSqrZlSXpH0hNVsm-y73VqIUI8

## 주의사항

- `.env.local` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)
- 프로덕션 환경에서는 Vercel 대시보드에서 환경변수를 설정하세요

