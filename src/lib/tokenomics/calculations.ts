/**
 * VODeco Tokenomics Calculations
 * 
 * Base: 1 VOD = 1 m³ of drinking water (world average cost)
 * Current discount: 80% off
 * All research staking is open
 */

// World average cost of 1 m³ of drinking water
export const WATER_COST_PER_M3 = 1.3; // USD

// Current discount (80% off)
export const CURRENT_DISCOUNT = 0.8;

// Current token price with discount
export const CURRENT_TOKEN_PRICE = WATER_COST_PER_M3 * (1 - CURRENT_DISCOUNT); // $0.26 per VOD

// Full price (after discount period)
export const FULL_TOKEN_PRICE = WATER_COST_PER_M3; // $1.30 per VOD

// Total supply (based on accessible fresh water)
export const TOTAL_SUPPLY = 1_000_000_000; // 1 billion VOD

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
  usdValue: number;
  discount: number;
  savings: number;
} {
  const tokens = amount / CURRENT_TOKEN_PRICE;
  const usdValue = amount;
  const discount = CURRENT_DISCOUNT * 100;
  const savings = tokens * (FULL_TOKEN_PRICE - CURRENT_TOKEN_PRICE);

  return {
    tokens: Math.floor(tokens * 100) / 100, // Round to 2 decimals
    usdValue,
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
  const rates = STAKING_RATES[type];
  let apy = 0;

  if (months <= 3) apy = rates['1-3'] || rates['1-6'] || 0;
  else if (months <= 6) apy = rates['4-6'] || rates['1-6'] || 0;
  else if (months <= 12) apy = rates['7-12'] || 0;
  else if (months <= 24) apy = rates['13-24'] || 0;
  else if (months <= 36) apy = rates['25-36'] || rates['25+'] || 0;
  else apy = rates['37+'] || rates['25+'] || 0;

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
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
