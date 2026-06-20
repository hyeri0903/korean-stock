# 주식공부 — 국내 반도체 주식 & 용어 학습 앱

비전공자도 쉽게 시작할 수 있는 주식 공부 웹앱입니다.  
국내 주요 반도체 종목의 시세를 확인하고, 투자에 필요한 핵심 용어를 학습할 수 있습니다.

---

## 주요 기능

### 대시보드
- 코스피 / 코스닥 지수 실시간(지연) 표시
- 삼성전자 · SK하이닉스 · 한미반도체 시세 카드
- 전일 종가 대비 등락률 및 기준 날짜 표시
- 1개월 미니 차트
- 30초 자동 갱신

### 주식 용어 사전
- PER, PBR, ROE, 배당수익률 등 핵심 용어 29개
- 카테고리 필터 (기초 / 가치평가 / 재무 / 배당 / 차트)
- 검색 기능
- 용어 클릭 시 화면 중앙 팝업 — 개념 설명 · 계산 공식 · 실생활 예시 · 연관 용어

### 기타
- 다크모드 / 라이트모드 토글 지원
- 모바일 퍼스트 반응형 레이아웃

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Variables |
| Data Fetching | TanStack React Query |
| Chart | Recharts |
| Icons | Lucide React |
| Dark Mode | next-themes |
| 주가 데이터 | Yahoo Finance v8 API (무료, 지연 시세) |
| SDD | GitHub Spec-Kit 방법론 (`specs/` 폴더) |

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/stocks/     # Yahoo Finance 주가 프록시
│   ├── api/index/      # 코스피·코스닥 지수 프록시
│   ├── dashboard/      # 대시보드 페이지
│   └── terms/          # 주식 용어 사전 페이지
├── components/
│   ├── dashboard/      # StockCard, MiniChart, MarketIndexBar
│   └── terms/          # TermCard, TermModal, TermsClient
├── lib/
│   ├── api/            # Yahoo Finance fetch 함수
│   └── data/           # 주식 종목 목록, 용어 데이터
├── providers/          # QueryProvider, ThemeProvider
└── types/              # Stock, Term 타입 정의
specs/                  # SDD 문서 (constitution, specification, plan)
```

---

> **주의:** Yahoo Finance API는 약 15~20분 지연 시세를 제공합니다. 실제 투자 판단에 사용하지 마세요.
