/**
 * VODeco Tokenomics Calculations (MVP)
 *
 * Base: 1 WTR = 1 m³ of drinking water (water cost index, not fiat)
 * Pre-sensor phase: users operate with in-app VOD credits
 * Current discount: 80% off
 * All research staking is open
 */

// Water cost index per 1 m³ (unitless index, not fiat currency)
export const WATER_COST_PER_M3 = 1;

// Current discount (80% off)
export const CURRENT_DISCOUNT = 0.8;

// Current credit price with discount (index units)
export const CURRENT_TOKEN_PRICE = WATER_COST_PER_M3 * (1 - CURRENT_DISCOUNT);

// Full price (after discount period)
export const FULL_TOKEN_PRICE = WATER_COST_PER_M3;

// MVP credit supply (demo only; real minting is data-driven after IoT verification)
export const TOTAL_SUPPLY = 1_000_000_000;

// Staking rates (APY)
export const STAKING_RATES = {
  basic: {
    '1-3': 8,    // 1-3 months: 8% APY
    '4-6': 10,   // 4-6 months: 10% APY
    '7-12': 12,  // 7-12 months: 12% APY
    '13-24': 15, // 13-24 months: 15% APY
    '25+': 17,   // 25+ months: 17% APY
  },
  project: {
    '1-6': 12,   // 1-6 months: 12% APY
    '7-12': 15,  // 7-12 months: 15% APY
    '13-24': 17, // 13-24 months: 17% APY
    '25-36': 20, // 25-36 months: 20% APY
    '37+': 22,   // 37+ months: 22% APY
  },
  research: {
    '1-6': 15,   // Research projects: 15% APY
    '7-12': 18,  // 7-12 months: 18% APY
    '13-24': 20, // 13-24 months: 20% APY
    '25-36': 23, // 25-36 months: 23% APY
    '37+': 25,   // 37+ months: 25% APY
  },
};

/**
 * Calculate token purchase value
 */
export function calculatePurchaseValue(amount: number): {
  tokens: number;
  inputValue: number;
  discount: number;
  savings: number;
} {
  const tokens = amount / CURRENT_TOKEN_PRICE;
  const inputValue = amount;
  const discount = CURRENT_DISCOUNT * 100;
  const savings = tokens * (FULL_TOKEN_PRICE - CURRENT_TOKEN_PRICE);

  return {
    tokens: Math.floor(tokens * 100) / 100, // Round to 2 decimals
    inputValue,
    discount,
    savings: Math.floor(savings * 100) / 100,
  };
}

/**
 * Calculate staking rewards
 */
export function calculateStakingRewards(
  amount: number,
  months: number,
  type: 'basic' | 'project' | 'research' = 'basic'
): {
  apy: number;
  annualRewards: number;
  totalRewards: number;
  monthlyRewards: number;
} {
  let apy = 0;

  if (type === 'basic') {
    const rates = STAKING_RATES.basic;
    if (months <= 3) apy = rates['1-3'] || 0;
    else if (months <= 6) apy = rates['4-6'] || 0;
    else if (months <= 12) apy = rates['7-12'] || 0;
    else if (months <= 24) apy = rates['13-24'] || 0;
    else apy = rates['25+'] || 0;
  } else if (type === 'project') {
    const rates = STAKING_RATES.project;
    if (months <= 6) apy = rates['1-6'] || 0;
    else if (months <= 12) apy = rates['7-12'] || 0;
    else if (months <= 24) apy = rates['13-24'] || 0;
    else if (months <= 36) apy = rates['25-36'] || 0;
    else apy = rates['37+'] || 0;
  } else {
    // research
    const rates = STAKING_RATES.research;
    if (months <= 6) apy = rates['1-6'] || 0;
    else if (months <= 12) apy = rates['7-12'] || 0;
    else if (months <= 24) apy = rates['13-24'] || 0;
    else if (months <= 36) apy = rates['25-36'] || 0;
    else apy = rates['37+'] || 0;
  }

  const annualRewards = (amount * apy) / 100;
  const totalRewards = (annualRewards * months) / 12;
  const monthlyRewards = annualRewards / 12;

  return {
    apy,
    annualRewards: Math.floor(annualRewards * 100) / 100,
    totalRewards: Math.floor(totalRewards * 100) / 100,
    monthlyRewards: Math.floor(monthlyRewards * 100) / 100,
  };
}

/**
 * Calculate project IRR and returns
 */
export function calculateProjectReturns(
  investment: number,
  irr: number,
  duration: number // in months
): {
  totalReturn: number;
  annualReturn: number;
  monthlyReturn: number;
  roi: number;
} {
  const annualReturn = (investment * irr) / 100;
  const totalReturn = (annualReturn * duration) / 12;
  const monthlyReturn = annualReturn / 12;
  const roi = ((totalReturn - investment) / investment) * 100;

  return {
    totalReturn: Math.floor(totalReturn * 100) / 100,
    annualReturn: Math.floor(annualReturn * 100) / 100,
    monthlyReturn: Math.floor(monthlyReturn * 100) / 100,
    roi: Math.floor(roi * 100) / 100,
  };
}

/**
 * Format token amount
 */
export function formatTokens(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, unit = 'W-Index'): string {
  return `${formatTokens(amount)} ${unit}`;
}
