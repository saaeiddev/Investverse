export const assetIds = ['stocks', 'property', 'gold', 'crypto', 'bonds', 'etfs', 'savings', 'startups', 'funds', 'reits'] as const;
export type AssetId = typeof assetIds[number];
export type Allocation = Record<AssetId, number>;
export const presets: Record<string, Allocation> = {
  conservative: { stocks: 10, property: 0, gold: 10, crypto: 0, bonds: 40, etfs: 10, savings: 25, startups: 0, funds: 0, reits: 5 },
  balanced: { stocks: 20, property: 5, gold: 10, crypto: 3, bonds: 20, etfs: 25, savings: 10, startups: 0, funds: 2, reits: 5 },
  growth: { stocks: 25, property: 5, gold: 5, crypto: 5, bonds: 5, etfs: 35, savings: 5, startups: 5, funds: 5, reits: 5 },
};

/** Integer percentages, largest-remainder apportionment. Always totals exactly 100. */
export function rebalance(current: Allocation, changed: AssetId, input: number): Allocation {
  const value = Math.round(Math.min(100, Math.max(0, Number.isFinite(input) ? input : current[changed])));
  const other = assetIds.filter(id => id !== changed);
  const remainder = 100 - value;
  const total = other.reduce((sum, id) => sum + current[id], 0);
  const shares = other.map(id => ({ id, exact: remainder * (total ? current[id] / total : 1 / other.length) }));
  const next = { ...current, [changed]: value };
  shares.forEach(s => { next[s.id] = Math.floor(s.exact); });
  const spare = remainder - shares.reduce((n, s) => n + next[s.id], 0);
  shares.sort((a, b) => (b.exact % 1) - (a.exact % 1));
  shares.slice(0, spare).forEach(s => { next[s.id]++; });
  return next;
}

export function validAllocation(value: unknown): value is Allocation {
  if (!value || typeof value !== 'object') return false;
  const v = value as Allocation;
  return assetIds.every(id => Number.isInteger(v[id]) && v[id] >= 0 && v[id] <= 100)
    && assetIds.reduce((s, id) => s + v[id], 0) === 100;
}

export interface GrowthInputs { initial: number; monthly: number; years: number; annual: number; inflation: number; fee: number }
export interface GrowthPoint { year: number; value: number; contributions: number; real: number }
export const defaultGrowth: GrowthInputs = { initial: 10000, monthly: 200, years: 20, annual: 6, inflation: 2.5, fee: 0.25 };

/** Effective annual return and proportional annual fee, converted to monthly factors.
 * Contributions arrive at month END. Inflation discounts to purchasing power today. */
export function calculateGrowth(input: GrowthInputs) {
  const { initial, monthly, years, annual, inflation, fee } = input;
  if (![initial, monthly, years, annual, inflation, fee].every(Number.isFinite)
    || initial < 0 || monthly < 0 || years < 1 || years > 60 || !Number.isInteger(years)
    || annual <= -100 || inflation <= -100 || fee < 0 || fee >= 100) {
    throw new RangeError('Invalid growth assumptions');
  }
  const factor = Math.pow((1 + annual / 100) * (1 - fee / 100), 1 / 12);
  let value = initial;
  const points: GrowthPoint[] = [{ year: 0, value, contributions: initial, real: initial }];
  for (let month = 1; month <= years * 12; month++) {
    value = value * factor + monthly;
    if (!Number.isFinite(value)) throw new RangeError('Result is outside the supported numeric range');
    if (month % 12 === 0) points.push({ year: month / 12, value,
      contributions: initial + monthly * month, real: value / Math.pow(1 + inflation / 100, month / 12) });
  }
  const end = points[points.length - 1];
  return { ...end, growth: end.value - end.contributions, points, netAnnual: ((1 + annual / 100) * (1 - fee / 100) - 1) * 100 };
}

export const shocks: Record<string, Allocation> = {
  downturn: { stocks: -35, property: -15, gold: 5, crypto: -55, bonds: 4, etfs: -25, savings: 0, startups: -60, funds: -20, reits: -30 },
  rates: { stocks: -12, property: -15, gold: -8, crypto: -25, bonds: -12, etfs: -10, savings: 0, startups: -25, funds: -9, reits: -20 },
  liquidity: { stocks: -10, property: -25, gold: -5, crypto: -35, bonds: -6, etfs: -10, savings: 0, startups: -65, funds: -12, reits: -18 },
};
export function shockResult(allocation: Allocation, scenario: Allocation, severity = 1, leverage = 1) {
  if (!Number.isFinite(severity) || severity < 0 || severity > 1.5 || !Number.isFinite(leverage) || leverage < 1 || leverage > 2) throw new RangeError('Invalid shock assumptions');
  return assetIds.reduce((sum, id) => sum + allocation[id] / 100 * Math.max(-100, scenario[id] * severity), 0) * leverage;
}
