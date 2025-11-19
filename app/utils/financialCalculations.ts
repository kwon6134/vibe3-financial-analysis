export interface FinancialData {
  account_nm: string;
  sj_div: string;
  sj_nm: string;
  fs_div: string;
  thstrm_amount: string;
  frmtrm_amount: string;
  bfefrmtrm_amount?: string;
  thstrm_nm: string;
  frmtrm_nm: string;
  bfefrmtrm_nm?: string;
}

type Period = 'thstrm' | 'frmtrm' | 'bfefrmtrm';

/**
 * 특정 계정의 값을 가져오는 함수
 * @param financialData 재무 데이터 배열
 * @param accountName 계정명
 * @param period 기간 ('thstrm': 당기, 'frmtrm': 전기, 'bfefrmtrm': 전전기)
 * @param sjDiv 재무제표 구분 ('BS': 재무상태표, 'IS': 손익계산서)
 * @returns 계정 값 (없으면 0)
 */
export function getAccountValue(
  financialData: FinancialData[],
  accountName: string,
  period: Period = 'thstrm',
  sjDiv?: 'BS' | 'IS'
): number {
  let filtered = financialData.filter((item) => item.account_nm === accountName);
  
  if (sjDiv) {
    filtered = filtered.filter((item) => item.sj_div === sjDiv);
  }
  
  // 연결재무제표 우선 사용
  const connected = filtered.find((item) => item.fs_div === 'CFS');
  const item = connected || filtered[0];
  
  if (!item) return 0;
  
  let value: string;
  switch (period) {
    case 'thstrm':
      value = item.thstrm_amount || '0';
      break;
    case 'frmtrm':
      value = item.frmtrm_amount || '0';
      break;
    case 'bfefrmtrm':
      value = item.bfefrmtrm_amount || '0';
      break;
    default:
      value = '0';
  }
  
  return parseInt(value, 10) || 0;
}

/**
 * ROE (자기자본이익률) 계산
 * @param netIncome 당기순이익
 * @param equity 자본총계
 * @returns ROE (%)
 */
export function calculateROE(netIncome: number, equity: number): number {
  if (equity === 0) return 0;
  return (netIncome / equity) * 100;
}

/**
 * ROA (총자산이익률) 계산
 * @param netIncome 당기순이익
 * @param assets 자산총계
 * @returns ROA (%)
 */
export function calculateROA(netIncome: number, assets: number): number {
  if (assets === 0) return 0;
  return (netIncome / assets) * 100;
}

/**
 * 부채비율 계산
 * @param debt 부채총계
 * @param equity 자본총계
 * @returns 부채비율 (%)
 */
export function calculateDebtRatio(debt: number, equity: number): number {
  if (equity === 0) return 0;
  return (debt / equity) * 100;
}

/**
 * 유동비율 계산
 * @param currentAssets 유동자산
 * @param currentLiabilities 유동부채
 * @returns 유동비율
 */
export function calculateCurrentRatio(
  currentAssets: number,
  currentLiabilities: number
): number {
  if (currentLiabilities === 0) return 0;
  return currentAssets / currentLiabilities;
}

/**
 * 영업이익률 계산
 * @param operatingIncome 영업이익
 * @param revenue 매출액
 * @returns 영업이익률 (%)
 */
export function calculateOperatingMargin(
  operatingIncome: number,
  revenue: number
): number {
  if (revenue === 0) return 0;
  return (operatingIncome / revenue) * 100;
}

/**
 * 순이익률 계산
 * @param netIncome 당기순이익
 * @param revenue 매출액
 * @returns 순이익률 (%)
 */
export function calculateNetMargin(netIncome: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (netIncome / revenue) * 100;
}

/**
 * 증가율 계산 (YoY)
 * @param current 당기 값
 * @param previous 전기 값
 * @returns 증가율 (%)
 */
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * 재무 비율 상태 판단 (녹색/노란색/빨간색)
 * @param value 비율 값
 * @param thresholds [녹색 기준, 노란색 기준] (녹색 > threshold1, threshold1 >= 노란색 > threshold2, 빨간색 <= threshold2)
 * @returns 'good' | 'warning' | 'danger'
 */
export function getRatioStatus(
  value: number,
  thresholds: [number, number]
): 'good' | 'warning' | 'danger' {
  const [goodThreshold, warningThreshold] = thresholds;
  
  if (value >= goodThreshold) return 'good';
  if (value >= warningThreshold) return 'warning';
  return 'danger';
}

/**
 * 비율 상태에 따른 색상 클래스 반환
 */
export function getStatusColor(status: 'good' | 'warning' | 'danger'): string {
  switch (status) {
    case 'good':
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    case 'danger':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  }
}

