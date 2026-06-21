import { Term } from "@/types/term"

export const TERMS: Term[] = [
  // 기초
  {
    slug: "stock",
    name: "주식",
    fullName: "주식 (Stock / Share)",
    category: "기초",
    summary: "회사의 소유권을 잘게 나눈 조각",
    description:
      "기업이 사업 자금을 마련하기 위해 회사의 소유권을 작게 나눠서 판매하는 것입니다. 주식을 1주 사면 그 회사의 주인이 아주 조금 되는 셈이에요. 회사가 잘 되면 주가가 오르고, 어려워지면 주가가 내려갑니다.",
    example:
      "삼성전자 주식 1주를 샀다 = 삼성전자 회사 전체의 아주 작은 일부분을 소유한 것. 삼성전자가 반도체를 많이 팔아 이익이 늘어나면, 내 주식 가치도 함께 올라가요.",
    related: ["market-cap", "listing", "kospi"],
    tip: "주식은 예금과 달리 원금 보장이 없습니다. 회사 실적에 따라 가치가 변해요.",
  },
  {
    slug: "market-cap",
    name: "시가총액",
    fullName: "시가총액 (Market Capitalization)",
    category: "기초",
    summary: "회사 전체의 주식을 현재 가격으로 계산한 회사의 총 가치",
    description:
      "현재 주가에 발행된 주식 수를 곱한 값입니다. 쉽게 말해 '지금 이 회사 전체를 사려면 얼마가 필요한가'를 나타내요. 시가총액이 클수록 큰 기업입니다.",
    formula: "시가총액 = 주가 × 발행 주식 수",
    formulaExplain:
      "주가가 70,000원이고 발행 주식이 60억 주라면 → 시가총액 = 420조원",
    example:
      "삼성전자 주가가 70,000원이고 주식이 약 60억 주 있다면, 시가총액은 약 420조 원. 이는 삼성전자 전체를 사는 데 420조 원이 필요하다는 뜻이에요.",
    related: ["stock", "per", "listing"],
  },
  {
    slug: "listing",
    name: "상장",
    fullName: "상장 (Listing / IPO)",
    category: "기초",
    summary: "회사 주식을 주식 시장에서 사고팔 수 있게 등록하는 것",
    description:
      "원래 비공개 회사였던 기업이 주식 시장에 등록해서 누구나 주식을 살 수 있게 되는 과정이에요. 카카오, 쿠팡처럼 처음 주식을 시장에 내놓는 것을 IPO(기업공개)라고 합니다.",
    example:
      "카카오가 주식 시장에 상장하기 전에는 일반인이 카카오 주식을 살 수 없었어요. 2021년 상장 후에는 누구나 증권앱에서 카카오 주식을 살 수 있게 됐죠.",
    related: ["stock", "kospi", "kosdaq"],
  },
  {
    slug: "kospi",
    name: "코스피",
    fullName: "코스피 (KOSPI - Korea Composite Stock Price Index)",
    category: "기초",
    summary: "국내 대형 우량기업들이 모인 주식 시장 (1부 리그)",
    description:
      "한국거래소(KRX)가 운영하는 주식 시장으로, 삼성전자·현대차·SK하이닉스 같은 대형 기업들이 상장되어 있습니다. 코스피 지수는 이 시장 전체의 평균 주가 흐름을 나타내요.",
    example:
      "\"코스피가 2,800을 넘었다\"는 말은 코스피 시장에 있는 기업들의 주가가 전반적으로 많이 올랐다는 뜻이에요. 지수가 오르면 경제가 좋다는 신호로 봅니다.",
    related: ["kosdaq", "stock", "listing"],
  },
  {
    slug: "kosdaq",
    name: "코스닥",
    fullName: "코스닥 (KOSDAQ - Korea Securities Dealers Automated Quotation)",
    category: "기초",
    summary: "중소·벤처기업들이 모인 주식 시장 (2부 리그)",
    description:
      "코스피보다 상장 조건이 덜 까다롭고, 성장 가능성 있는 중소기업·바이오·IT 벤처 기업들이 많습니다. 미국의 나스닥(NASDAQ)과 비슷한 개념이에요.",
    example:
      "셀트리온, 카카오게임즈, 에코프로 같은 기업들이 코스닥에 있어요. 코스피보다 변동성이 크지만, 성장주가 많아 높은 수익도 가능합니다.",
    related: ["kospi", "stock", "listing"],
  },
  {
    slug: "volume",
    name: "거래량",
    fullName: "거래량 (Trading Volume)",
    category: "기초",
    summary: "하루에 사고팔린 주식의 총 수량",
    description:
      "그날 시장에서 얼마나 많은 주식이 거래됐는지를 나타냅니다. 거래량이 많으면 투자자들의 관심이 높다는 의미예요. 주가가 오를 때 거래량도 함께 늘어나면 신뢰도 높은 상승입니다.",
    example:
      "삼성전자 거래량이 평소 1천만 주인데 갑자기 5천만 주로 늘었다면, 뭔가 중요한 뉴스가 나와 많은 사람이 사거나 팔고 있다는 신호예요.",
    related: ["stock", "macd"],
  },

  // 가치평가
  {
    slug: "per",
    name: "PER",
    fullName: "PER (Price Earnings Ratio) — 주가수익비율",
    category: "가치평가",
    summary: "주가가 회사 이익의 몇 배인지 나타내는 지표",
    description:
      "현재 주가가 주당 순이익(EPS)의 몇 배인지 보여줍니다. PER이 낮으면 이익 대비 주가가 저렴하다는 뜻, 높으면 비싸다는 뜻입니다. 같은 업종 회사들끼리 비교할 때 특히 유용해요.",
    formula: "PER = 주가 ÷ EPS(주당순이익)",
    formulaExplain:
      "주가 50,000원 ÷ EPS 5,000원 = PER 10배 → 투자금을 회수하는 데 10년 걸린다는 의미",
    example:
      "삼성전자 PER이 10, 경쟁사 PER이 20이라면? 같은 이익을 내는데 삼성전자가 절반 값이라는 뜻. 단, 성장주(미래 기대감 높은 주식)는 PER이 높아도 정상이에요.",
    related: ["eps", "pbr", "roe"],
    tip: "PER만 보고 투자 결정은 금물! 업종 평균 PER과 비교하고, 성장성도 함께 봐야 해요.",
  },
  {
    slug: "pbr",
    name: "PBR",
    fullName: "PBR (Price Book-value Ratio) — 주가순자산비율",
    category: "가치평가",
    summary: "주가가 회사 순자산의 몇 배인지 나타내는 지표",
    description:
      "회사가 가진 순자산(자산 - 부채) 대비 주가가 얼마나 높은지 보여줍니다. PBR이 1 미만이면 회사를 당장 해산해도 주가보다 더 많은 돈을 받을 수 있다는 뜻이에요.",
    formula: "PBR = 주가 ÷ BPS(주당순자산)",
    formulaExplain: "주가 10,000원 ÷ BPS 10,000원 = PBR 1배 (자산 가치와 동일)",
    example:
      "PBR이 0.5라면 이 회사를 통째로 사서 해산하면 투자금의 2배를 돌려받을 수 있어요. 은행주·제조업처럼 자산이 많은 기업 분석에 특히 유용합니다.",
    related: ["bps", "per", "roe"],
  },
  {
    slug: "psr",
    name: "PSR",
    fullName: "PSR (Price Sales Ratio) — 주가매출비율",
    category: "가치평가",
    summary: "주가가 회사 매출의 몇 배인지 나타내는 지표",
    description:
      "이익이 아직 없는 초기 성장주(스타트업, 플랫폼 기업)를 평가할 때 유용합니다. 매출 대비 주가를 봐서 얼마나 비싸게 거래되는지 판단해요.",
    formula: "PSR = 시가총액 ÷ 연간 매출액",
    example:
      "아직 적자이지만 매출이 빠르게 성장하는 AI 스타트업의 가치를 평가할 때 PSR을 씁니다. PSR이 낮을수록 매출 대비 저평가된 것이에요.",
    related: ["per", "market-cap"],
  },
  {
    slug: "peg",
    name: "PEG",
    fullName: "PEG (Price/Earnings to Growth) — 주가이익성장비율",
    category: "가치평가",
    summary: "PER을 이익 성장률로 나눈 값 — 성장성까지 고려한 밸류에이션",
    description:
      "PER만으로는 성장주가 비싼지 판단하기 어렵습니다. PEG는 PER을 연간 이익 성장률로 나눠서, 성장성을 감안한 가치를 봅니다. PEG 1 이하면 저평가로 봐요.",
    formula: "PEG = PER ÷ 연간 EPS 성장률(%)",
    formulaExplain: "PER 20, 성장률 20% → PEG = 1 (적정 수준)",
    example:
      "A사 PER 40 / 성장률 40% → PEG 1.0 / B사 PER 20 / 성장률 5% → PEG 4.0. 성장을 고려하면 A사가 훨씬 저렴해요!",
    related: ["per", "eps"],
  },
  {
    slug: "ev-ebitda",
    name: "EV/EBITDA",
    fullName: "EV/EBITDA (기업가치/영업이익)",
    category: "가치평가",
    summary: "빚까지 포함한 회사 전체 가치를 영업 현금흐름으로 나눈 지표",
    description:
      "PER보다 더 정확한 기업 가치 비교 지표예요. EV(기업가치)는 시가총액 + 순부채이고, EBITDA는 감가상각 전 영업이익입니다. 부채가 많은 기업도 공정하게 비교 가능해요.",
    formula: "EV/EBITDA = (시가총액 + 순부채) ÷ EBITDA",
    example:
      "인수·합병(M&A) 시장에서 기업 가격을 매길 때 많이 씁니다. EV/EBITDA가 낮을수록 저평가됐다고 봐요.",
    related: ["per", "market-cap"],
  },
  {
    slug: "target-price",
    name: "목표주가",
    fullName: "목표주가 (Target Price)",
    category: "가치평가",
    summary: "증권사 애널리스트가 예측하는 향후 적정 주가",
    description:
      "증권사 리서치팀이 기업 분석 후 '이 주식은 12개월 안에 이 가격까지 오를 것'이라고 제시하는 가격입니다. 절대적인 기준은 아니며, 각 증권사마다 다릅니다.",
    example:
      "삼성전자 현재 주가 70,000원인데 A증권사 목표주가가 100,000원이라면, 42% 상승 여력이 있다는 분석이에요. 여러 증권사 평균을 참고하는 게 좋습니다.",
    related: ["per", "per"],
  },

  // 재무
  {
    slug: "eps",
    name: "EPS",
    fullName: "EPS (Earnings Per Share) — 주당순이익",
    category: "재무",
    summary: "주식 1주당 회사가 벌어들인 순이익",
    description:
      "회사의 당기순이익을 발행 주식 수로 나눈 값입니다. 내가 보유한 주식 1주가 얼마나 이익을 창출했는지 보여줘요. EPS가 높을수록, 성장할수록 좋은 기업입니다.",
    formula: "EPS = 당기순이익 ÷ 발행 주식 수",
    formulaExplain: "순이익 1조원 ÷ 주식 2억주 = EPS 5,000원",
    example:
      "삼성전자 EPS가 5,000원이라면, 삼성전자 주식 1주를 갖고 있으면 그 한 해에 5,000원의 이익이 내 몫이라는 의미예요. (실제로 다 받는 건 아니고, 일부만 배당으로 받아요.)",
    related: ["per", "bps", "dividend-yield"],
  },
  {
    slug: "bps",
    name: "BPS",
    fullName: "BPS (Book value Per Share) — 주당순자산",
    category: "재무",
    summary: "주식 1주당 회사의 순자산(재산 - 빚) 가치",
    description:
      "회사가 가진 자산에서 부채를 뺀 순자산을 주식 수로 나눈 값입니다. 회사를 지금 당장 해산할 때 주식 1주당 얼마를 돌려받을 수 있는지를 나타내요.",
    formula: "BPS = 순자산(자본총계) ÷ 발행 주식 수",
    example:
      "BPS가 50,000원인데 주가가 30,000원이라면, 이 회사를 해산하면 투자금보다 더 받을 수 있어요. 이런 경우 PBR이 0.6으로 저평가 신호입니다.",
    related: ["pbr", "eps", "roe"],
  },
  {
    slug: "roe",
    name: "ROE",
    fullName: "ROE (Return On Equity) — 자기자본이익률",
    category: "재무",
    summary: "회사가 자기 자본으로 얼마나 효율적으로 돈을 버는지",
    description:
      "투입된 자기 자본 대비 얼마나 많은 이익을 냈는지를 나타냅니다. ROE가 높을수록 돈을 잘 버는 효율적인 회사예요. 워렌 버핏이 중요하게 보는 지표입니다.",
    formula: "ROE = 당기순이익 ÷ 자기자본 × 100(%)",
    formulaExplain: "순이익 1조원 ÷ 자기자본 10조원 = ROE 10%",
    example:
      "ROE 20%는 은행에 100만원 맡기면 20만원 이자를 받는 것과 같아요. 시중 금리(3~4%)보다 훨씬 높은 ROE를 가진 기업이 매력적입니다.",
    related: ["per", "pbr", "roa"],
    tip: "일반적으로 ROE 15% 이상이면 우량 기업으로 봅니다.",
  },
  {
    slug: "roa",
    name: "ROA",
    fullName: "ROA (Return On Assets) — 총자산이익률",
    category: "재무",
    summary: "회사가 가진 모든 자산으로 얼마나 이익을 냈는지",
    description:
      "자기 자본뿐 아니라 빌린 돈(부채)까지 포함한 총자산 대비 이익률입니다. 부채가 많은 기업도 공정하게 비교할 수 있어요. ROE보다 보수적인 지표입니다.",
    formula: "ROA = 당기순이익 ÷ 총자산 × 100(%)",
    example:
      "은행은 고객 예금(부채)으로 대출 사업을 하기 때문에 ROE는 높지만 ROA는 낮아요. ROA 5% 이상이면 좋은 편입니다.",
    related: ["roe", "per"],
  },
  {
    slug: "debt-ratio",
    name: "부채비율",
    fullName: "부채비율 (Debt Ratio)",
    category: "재무",
    summary: "자기 자본 대비 빌린 돈의 비율 — 낮을수록 안전",
    description:
      "회사가 얼마나 많은 빚을 지고 있는지 보여줍니다. 부채비율이 낮을수록 재무적으로 안전하고, 높을수록 경기 불황 때 위험합니다.",
    formula: "부채비율 = 총부채 ÷ 자기자본 × 100(%)",
    formulaExplain: "부채 100억 ÷ 자본 100억 = 부채비율 100%",
    example:
      "부채비율 200%는 자기 돈 1억 있는데 빚이 2억 있다는 뜻이에요. 제조업은 200% 이하, IT 기업은 100% 이하면 양호하다고 봅니다.",
    related: ["roe", "roa"],
    tip: "경기 불황 때 부채비율 높은 기업이 가장 먼저 위험해집니다.",
  },
  {
    slug: "operating-margin",
    name: "영업이익률",
    fullName: "영업이익률 (Operating Margin)",
    category: "재무",
    summary: "매출 중 실제 사업으로 남긴 이익의 비율",
    description:
      "매출액에서 영업비용(인건비, 제조비 등)을 뺀 영업이익의 비율입니다. 회사의 핵심 사업이 얼마나 돈을 잘 버는지를 보여줘요.",
    formula: "영업이익률 = 영업이익 ÷ 매출액 × 100(%)",
    example:
      "매출이 100억인데 영업이익이 20억이면 영업이익률 20%. 반도체 기업은 호황기에 30~50%에 달하기도 해요. 영업이익률이 높을수록 경쟁력 있는 기업입니다.",
    related: ["roe", "eps"],
  },
  {
    slug: "net-profit",
    name: "순이익",
    fullName: "당기순이익 (Net Profit)",
    category: "재무",
    summary: "모든 비용과 세금을 다 빼고 최종적으로 남은 이익",
    description:
      "매출에서 모든 비용(제조비, 인건비, 이자, 세금 등)을 뺀 최종 이익입니다. 회사가 1년 동안 실제로 번 돈이에요.",
    example:
      "매출 100억, 비용 80억이면 순이익 20억. 이 20억이 주주들의 몫이 되고, 일부는 배당으로 주주에게, 나머지는 회사 성장을 위해 재투자됩니다.",
    related: ["eps", "roe", "operating-margin"],
  },
  {
    slug: "revenue",
    name: "매출액",
    fullName: "매출액 (Revenue / Sales)",
    category: "재무",
    summary: "회사가 물건/서비스를 팔아서 번 총 수입",
    description:
      "비용을 빼기 전 회사가 벌어들인 총 금액입니다. 매출이 크다고 무조건 좋은 건 아니에요. 비용도 많이 들면 결국 순이익이 작을 수 있습니다.",
    example:
      "삼성전자 연간 매출 300조원은 전 세계에서 물건을 팔아 300조 원이 들어왔다는 뜻이에요. 하지만 인건비, 연구개발비 등을 빼면 실제 이익은 훨씬 작습니다.",
    related: ["net-profit", "operating-margin", "psr"],
  },
  {
    slug: "fcf",
    name: "FCF",
    fullName: "FCF (Free Cash Flow) — 잉여현금흐름",
    category: "재무",
    summary: "영업으로 번 현금에서 설비 투자를 빼고 실제로 손에 남는 현금",
    description:
      "회사가 영업으로 벌어들인 현금에서, 공장·장비 같은 사업 유지에 꼭 필요한 투자(CapEx)를 뺀 금액입니다. 회계상 이익(순이익)과 달리 '실제로 자유롭게 쓸 수 있는 현금'을 보여줘서, 배당·자사주·빚 상환 여력을 가늠할 수 있어요.",
    formula: "FCF = 영업활동 현금흐름 − 자본적지출(CapEx)",
    formulaExplain: "영업현금흐름 10조원 − 설비투자 3조원 = FCF 7조원",
    example:
      "순이익은 흑자인데 FCF가 계속 마이너스라면, 번 돈보다 설비에 더 많이 쓰고 있다는 뜻이라 주의가 필요해요. 반대로 FCF가 꾸준히 플러스면 현금 창출력이 좋은 회사입니다.",
    related: ["operating-margin", "net-profit", "ev-ebitda"],
    tip: "적정주가 계산의 DCF(현금흐름할인) 방식에서 핵심 입력값으로 쓰입니다.",
  },
  {
    slug: "revenue-growth",
    name: "매출 성장률",
    fullName: "매출 성장률 (Revenue Growth Rate)",
    category: "재무",
    summary: "지난 기간 대비 매출이 얼마나 늘었는지를 나타내는 비율",
    description:
      "전년(또는 전분기) 대비 매출이 몇 % 증가했는지 보여줍니다. 회사가 성장하고 있는지 가장 직관적으로 알 수 있는 지표예요. 성장률이 높을수록 시장은 보통 더 높은 PER을 인정해 줍니다.",
    formula: "매출 성장률 = (당기 매출 − 전기 매출) ÷ 전기 매출 × 100(%)",
    formulaExplain: "올해 매출 120조 − 작년 100조 = 20조 → 성장률 20%",
    example:
      "매출 성장률이 30%인 회사는 빠르게 크는 중이에요. 다만 성장률이 둔화되기 시작하면 주가가 먼저 반응해 떨어지는 경우가 많습니다.",
    related: ["revenue", "peg", "psr"],
    tip: "PEG는 PER을 이 성장률로 나눠 '성장 대비 비싼지'를 보는 지표예요.",
  },
  {
    slug: "shares-outstanding",
    name: "발행주식수",
    fullName: "발행주식수 (Shares Outstanding)",
    category: "재무",
    summary: "회사가 발행해 시장에 존재하는 주식의 총 개수",
    description:
      "시가총액(주가 × 발행주식수)과 EPS(순이익 ÷ 발행주식수)를 계산하는 기준이 되는 숫자입니다. 회사가 유상증자를 하면 주식 수가 늘어 기존 주주의 몫이 줄고(희석), 자사주 소각을 하면 주식 수가 줄어 주당 가치가 올라갑니다.",
    formula: "EPS = 순이익 ÷ 발행주식수",
    formulaExplain: "순이익 60조원 ÷ 60억 주 = EPS 10,000원",
    example:
      "순이익이 똑같아도 발행주식수가 늘면 EPS가 줄어 주가에 불리해요. 그래서 자사주 소각은 보통 주주 친화적 정책으로 봅니다.",
    related: ["market-cap", "eps"],
  },

  // 배당
  {
    slug: "dividend-yield",
    name: "배당수익률",
    fullName: "배당수익률 (Dividend Yield)",
    category: "배당",
    summary: "주가 대비 1년간 받는 배당금의 비율",
    description:
      "내가 산 주가 대비 1년간 배당금이 얼마나 되는지 보여줍니다. 은행 이자처럼 매년 받는 수익이에요. 배당수익률이 높을수록 현금 수익이 많습니다.",
    formula: "배당수익률 = 주당 연간 배당금 ÷ 현재 주가 × 100(%)",
    formulaExplain: "배당금 2,000원 ÷ 주가 40,000원 = 배당수익률 5%",
    example:
      "주가 40,000원인 주식이 연간 2,000원을 배당한다면 배당수익률 5%. 시중 예금 이자(3%)보다 높으면 매력적인 배당주로 볼 수 있어요.",
    related: ["dividend-ratio", "dividend-exdate", "eps"],
    tip: "배당수익률이 너무 높으면(10% 이상) 주가 하락이나 배당 삭감 위험 신호일 수 있어요.",
  },
  {
    slug: "dividend-ratio",
    name: "배당성향",
    fullName: "배당성향 (Dividend Payout Ratio)",
    category: "배당",
    summary: "순이익 중 배당으로 나눠주는 비율",
    description:
      "회사가 번 순이익에서 얼마를 배당으로 주주에게 돌려주는지 보여줍니다. 배당성향이 높으면 주주 환원이 좋고, 낮으면 재투자에 집중한다는 뜻이에요.",
    formula: "배당성향 = 주당 배당금 ÷ EPS × 100(%)",
    example:
      "EPS 5,000원, 배당금 1,500원 → 배당성향 30%. 성장주는 배당보다 재투자를 선호해 낮고, 안정적인 대기업은 30~50%가 많습니다.",
    related: ["dividend-yield", "eps"],
  },
  {
    slug: "dividend-exdate",
    name: "배당락",
    fullName: "배당락 (Ex-Dividend Date)",
    category: "배당",
    summary: "배당을 받을 권리가 사라지는 날",
    description:
      "배당을 받으려면 배당기준일 전날까지 주식을 갖고 있어야 해요. 배당락일에는 배당 권리가 없어지므로 보통 주가가 배당금만큼 내려갑니다.",
    example:
      "배당기준일이 12월 31일이라면, 12월 30일까지 주식을 사야 배당을 받을 수 있어요. 1월 1일 주식을 사면 배당을 못 받습니다. 국내는 보통 연말에 배당이 많습니다.",
    related: ["dividend-yield", "dividend-ratio"],
  },
  {
    slug: "dividend",
    name: "배당금",
    fullName: "배당금 (Dividend)",
    category: "배당",
    summary: "회사가 주주에게 이익의 일부를 현금으로 나눠주는 것",
    description:
      "회사가 번 이익 일부를 주주(주식 보유자)에게 현금으로 돌려줍니다. 주식 수에 비례해서 받아요. 은행 이자처럼 꾸준한 현금 수익이 됩니다.",
    example:
      "삼성전자 주식 100주 보유, 1주당 배당금 1,500원이면 → 15만원 수령. 보통 12월 결산 후 다음 해 4월쯤 입금돼요.",
    related: ["dividend-yield", "dividend-ratio", "dividend-exdate"],
  },

  // 차트
  {
    slug: "moving-average",
    name: "이동평균선",
    fullName: "이동평균선 (Moving Average)",
    category: "차트",
    summary: "일정 기간 주가의 평균을 이어 그린 선",
    description:
      "5일선, 20일선, 60일선, 120일선 등이 있어요. 단기 이동평균선이 장기 이동평균선 위로 올라오면 상승 신호(골든크로스), 아래로 내려가면 하락 신호(데드크로스)입니다.",
    example:
      "5일선이 20일선 위로 올라왔다 = 최근 5일 평균 주가가 최근 20일 평균보다 높다 = 단기적으로 주가가 오르고 있다는 신호예요.",
    related: ["bollinger-band", "macd"],
    tip: "이동평균선 하나만으로 매매 결정은 위험해요. 거래량이나 다른 지표와 함께 봐야 합니다.",
  },
  {
    slug: "bollinger-band",
    name: "볼린저밴드",
    fullName: "볼린저밴드 (Bollinger Bands)",
    category: "차트",
    summary: "주가의 변동 범위를 나타내는 3개의 선",
    description:
      "중간선(20일 이동평균) 위아래로 표준편차 2배 거리에 상단·하단 밴드를 그립니다. 주가가 상단 밴드에 닿으면 과열(매도 신호), 하단에 닿으면 침체(매수 고려) 신호로 봐요.",
    example:
      "주가가 볼린저밴드 하단에 닿으면 '지금 많이 빠졌으니 반등할 수 있다'는 신호, 상단에 닿으면 '많이 올랐으니 잠깐 쉬어갈 수 있다'는 신호로 해석합니다.",
    related: ["moving-average", "rsi"],
  },
  {
    slug: "rsi",
    name: "RSI",
    fullName: "RSI (Relative Strength Index) — 상대강도지수",
    category: "차트",
    summary: "주가가 과매수인지 과매도인지 나타내는 0~100 지표",
    description:
      "일정 기간 상승/하락 폭을 계산해 0~100으로 표시합니다. 70 이상이면 과매수(너무 많이 올라 조정 가능), 30 이하면 과매도(너무 많이 빠져 반등 가능) 신호예요.",
    formula: "RSI = 100 - (100 ÷ (1 + 평균상승폭/평균하락폭))",
    example:
      "RSI가 80을 넘으면 '너무 빨리 올랐다, 잠깐 쉴 것 같다', RSI가 20이면 '너무 많이 빠졌다, 반등 가능성 있다'라고 해석해요. 절대적인 기준은 아닙니다.",
    related: ["macd", "bollinger-band"],
  },
  {
    slug: "macd",
    name: "MACD",
    fullName: "MACD (Moving Average Convergence Divergence)",
    category: "차트",
    summary: "단기·장기 이동평균의 차이로 추세 방향을 찾는 지표",
    description:
      "12일 이동평균과 26일 이동평균의 차이(MACD선)를 계산합니다. MACD선이 시그널선(9일 평균)을 위로 돌파하면 매수, 아래로 내려가면 매도 신호예요.",
    example:
      "MACD선이 시그널선을 위로 뚫고 올라오면 = '단기 추세가 장기보다 강해졌다 = 상승 모멘텀이 생겼다'는 신호로 해석합니다.",
    related: ["moving-average", "rsi", "volume"],
  },
  {
    slug: "trading-volume-chart",
    name: "거래량(차트)",
    fullName: "거래량 차트 분석",
    category: "차트",
    summary: "주가 움직임의 신뢰도를 확인하는 핵심 지표",
    description:
      "주가가 오를 때 거래량이 늘면 신뢰성 높은 상승, 거래량 없이 주가만 오르면 불안한 상승이에요. 대형 거래량은 기관·외국인 투자자의 움직임 신호일 수 있습니다.",
    example:
      "주가가 5% 급등했는데 거래량이 평소의 5배라면 = 많은 투자자들이 적극적으로 샀다 = 신뢰도 높은 상승. 거래량 없이 올랐다면 = 조심해야 할 수도 있어요.",
    related: ["macd", "moving-average"],
  },
]

export function getTermBySlug(slug: string): Term | undefined {
  return TERMS.find((t) => t.slug === slug)
}

export function getTermsByCategory(category: string): Term[] {
  return TERMS.filter((t) => t.category === category)
}
