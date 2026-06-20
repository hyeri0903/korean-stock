# Technical Plan — 주식 공부 웹앱

## 기술 스택

| 분류 | 기술 | 선택 이유 |
|------|------|----------|
| Framework | Next.js 14+ (App Router) | SSR + API Route로 Yahoo Finance CORS 우회 |
| Language | TypeScript (strict) | 타입 안정성 |
| Styling | Tailwind CSS + shadcn/ui | 빠른 모바일 UI 구성 |
| 데이터 페칭 | TanStack React Query | 자동 폴링, 캐싱, 로딩 상태 관리 |
| 상태관리 | Zustand | 필터/검색 UI 상태 |
| 차트 | Recharts | React 친화적, 가벼움 |
| 주가 API | Yahoo Finance v8 (무료) | 인증 불필요 |

## 아키텍처

```
Browser
  └─ Next.js App Router
       ├─ /dashboard         → 반도체 주식 대시보드
       │    └─ StockCard, MiniChart, StockTable
       └─ /terms             → 주식 용어
            ├─ page.tsx      → 용어 목록 + 검색 + 필터
            └─ [slug]/       → 용어 상세

Next.js API Routes (서버)
  └─ /api/stocks             → Yahoo Finance 호출 (CORS 우회)
```

## Yahoo Finance API

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=1mo
```
- 서버사이드에서만 호출 (Next.js Route Handler)
- 응답: 현재가, 시가, 고가, 저가, 거래량, 1개월 히스토리

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # → /dashboard redirect
│   ├── dashboard/page.tsx
│   ├── terms/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── api/
│       └── stocks/route.ts         # Yahoo Finance proxy
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── dashboard/
│   │   ├── StockCard.tsx
│   │   ├── StockTable.tsx
│   │   └── MiniChart.tsx
│   └── terms/
│       ├── TermCard.tsx
│       ├── TermDetail.tsx
│       └── SearchBar.tsx
├── lib/
│   ├── api/yahoo-finance.ts
│   └── data/terms.ts
├── types/
│   ├── stock.ts
│   └── term.ts
└── providers/
    └── QueryProvider.tsx
```

## 구현 우선순위

1. 공통 레이아웃 + 네비게이션
2. 타입 정의 (Stock, Term)
3. 주식 용어 데이터 + 페이지 (정적)
4. Yahoo Finance API Route
5. 대시보드 UI + 폴링
6. 미니 차트
7. 다크모드
